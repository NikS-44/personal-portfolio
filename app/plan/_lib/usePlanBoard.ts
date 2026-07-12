"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  formatBoardHeaderRange,
  getBoardSegments,
  getDayKeysFromSegments,
  isRollingView,
  nextWeekFromRolling,
  nextWeekStart,
  prevWeekFromRolling,
  prevWeekStart,
} from "./boardView";
import { formatWeekRange, getWeekStart, parseDayKey, rollOverIncompleteTasks, toDayKey } from "./dates";
import { createHistory, historyReducer, type HistoryAction } from "./history";
import { sortTasksForColumn } from "./priority";
import { isColumnKey } from "./planReducer";
import { applyDragPreview, type DropTarget } from "./dragPreview";
import { createInitialState, loadPlanState, loadUpdatedAt, savePlanState } from "./storage";
import { fetchRemoteState, pushRemoteState, type SyncStatus } from "./sync";
import type { BoardDaySegment } from "./boardView";
import type { Task, ViewMode } from "./types";
import { BACKLOG_KEY } from "./types";

export type { DropTarget };

export type PlanToastData = {
  id: number;
  message: string;
  undoable: boolean;
};

const SYNC_DEBOUNCE_MS = 1500;

export function usePlanBoard() {
  const [history, dispatch] = useReducer(historyReducer, createInitialState(), createHistory);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<PlanToastData | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("unknown");
  const syncEnabledRef = useRef(false);
  const toastIdRef = useRef(0);
  const historyRef = useRef(history);
  historyRef.current = history;

  const state = history.present;

  useEffect(() => {
    dispatch({ type: "HYDRATE", state: loadPlanState() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePlanState(state);
  }, [state, hydrated]);

  const todayKey = useMemo(() => toDayKey(new Date()), []);

  /* ── Remote sync (no-op unless /api/plan-state is reachable) ── */

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    (async () => {
      const { available, snapshot } = await fetchRemoteState();
      if (cancelled) return;
      if (!available) {
        setSyncStatus("off");
        return;
      }
      const localUpdatedAt = loadUpdatedAt();
      if (snapshot && (!localUpdatedAt || snapshot.updatedAt > localUpdatedAt)) {
        dispatch({
          type: "HYDRATE",
          state: { ...snapshot.state, tasks: rollOverIncompleteTasks(snapshot.state.tasks, todayKey) },
        });
      }
      syncEnabledRef.current = true;
      setSyncStatus("synced");
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, todayKey]);

  useEffect(() => {
    if (!hydrated || !syncEnabledRef.current) return;
    setSyncStatus("pending");
    const timer = setTimeout(async () => {
      const ok = await pushRemoteState({ state, updatedAt: new Date().toISOString() });
      setSyncStatus(ok ? "synced" : "error");
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state, hydrated]);

  /* ── Toasts (undo affordance for destructive-ish actions) ── */

  const notify = useCallback((message: string, undoable = false) => {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message, undoable });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const act = useCallback(
    (action: HistoryAction) => {
      const current = historyRef.current.present;
      if (action.type === "DELETE_TASK") {
        const task = current.tasks.find((t) => t.id === action.taskId);
        notify(`Deleted “${(task?.title ?? "task").trim() || "Untitled task"}”`, true);
      } else if (action.type === "TOGGLE_COMPLETE") {
        const task = current.tasks.find((t) => t.id === action.taskId);
        if (task && !task.completed) {
          notify(`Done: “${task.title.trim() || "Untitled task"}”`, true);
        } else {
          setToast(null);
        }
      } else if (action.type === "IMPORT_STATE") {
        notify(`Imported ${action.state.tasks.length} tasks`, true);
      } else if (action.type !== "UNDO" && action.type !== "REDO") {
        setToast(null);
      } else {
        setToast(null);
      }
      dispatch(action);
    },
    [notify],
  );

  const undoToast = useCallback(() => {
    setToast(null);
    dispatch({ type: "UNDO" });
  }, []);

  /* ── Board view ── */

  const boardSegments = useMemo<BoardDaySegment[]>(() => {
    if (state.viewMode === "today") return [{ kind: "day", dayKey: todayKey }];
    return getBoardSegments(state.fixedWeekStart, todayKey);
  }, [state.viewMode, state.fixedWeekStart, todayKey]);

  const visibleDayKeys = useMemo(() => getDayKeysFromSegments(boardSegments), [boardSegments]);

  const headerLabel = useMemo(() => {
    if (state.viewMode === "today") {
      return parseDayKey(todayKey).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    }
    if (isRollingView(state.fixedWeekStart)) {
      return formatBoardHeaderRange(boardSegments);
    }
    if (visibleDayKeys.length === 0) return "Week";
    return formatWeekRange(getWeekStart(parseDayKey(visibleDayKeys[0])));
  }, [state.viewMode, state.fixedWeekStart, boardSegments, visibleDayKeys, todayKey]);

  const tasksByColumn = useMemo(() => {
    const map = new Map<string, Task[]>();
    const columns = [BACKLOG_KEY, ...visibleDayKeys];
    for (const key of columns) {
      const manual = state.manualOrderColumns.includes(key);
      const tasks = state.tasks.filter((t) => t.dayKey === key);
      map.set(key, sortTasksForColumn(tasks, manual));
    }
    return map;
  }, [state.tasks, state.manualOrderColumns, visibleDayKeys]);

  const setMode = useCallback((mode: ViewMode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const goToPrevWeek = useCallback(() => {
    if (isRollingView(state.fixedWeekStart)) {
      dispatch({ type: "SET_VIEW", fixedWeekStart: prevWeekFromRolling(todayKey) });
      return;
    }
    const week = state.fixedWeekStart;
    if (!week) return;
    dispatch({ type: "SET_VIEW", fixedWeekStart: prevWeekStart(week) });
  }, [state.fixedWeekStart, todayKey]);

  const goToNextWeek = useCallback(() => {
    if (isRollingView(state.fixedWeekStart)) {
      dispatch({ type: "SET_VIEW", fixedWeekStart: nextWeekFromRolling(todayKey) });
      return;
    }
    const week = state.fixedWeekStart;
    if (!week) return;
    dispatch({ type: "SET_VIEW", fixedWeekStart: nextWeekStart(week) });
  }, [state.fixedWeekStart, todayKey]);

  const goToToday = useCallback(() => {
    dispatch({ type: "SET_VIEW", fixedWeekStart: null });
  }, []);

  const resolveDropTarget = useCallback(
    (taskId: string, overId: string): DropTarget | null => {
      const activeTask = state.tasks.find((t) => t.id === taskId);
      if (!activeTask) return null;

      const openIdsForColumn = (columnKey: string) =>
        (tasksByColumn.get(columnKey) ?? []).filter((t) => !t.completed).map((t) => t.id);

      if (isColumnKey(overId)) {
        const openIds = openIdsForColumn(overId);
        const fromIndex = openIds.indexOf(taskId);
        // Column shell: append (arrayMove to end when same column, insert at end when cross).
        if (fromIndex >= 0) {
          return { columnKey: overId, index: Math.max(openIds.length - 1, 0) };
        }
        return { columnKey: overId, index: openIds.length };
      }

      if (overId === taskId) return null;

      const overTask = state.tasks.find((t) => t.id === overId);
      if (!overTask || overTask.completed) return null;

      const openIds = openIdsForColumn(overTask.dayKey);
      const index = openIds.indexOf(overId);
      if (index < 0) {
        return { columnKey: overTask.dayKey, index: Math.max(openIds.length - 1, 0) };
      }

      return { columnKey: overTask.dayKey, index };
    },
    [state.tasks, tasksByColumn],
  );

  const previewTasksByColumn = useCallback(
    (draggingTaskId: string | null, dropTarget: DropTarget | null) => {
      if (!draggingTaskId || !dropTarget) return tasksByColumn;
      return applyDragPreview(tasksByColumn, draggingTaskId, dropTarget);
    },
    [tasksByColumn],
  );

  const commitDrop = useCallback(
    (taskId: string, target: DropTarget) => {
      act({ type: "MOVE_TASK", taskId, toColumn: target.columnKey, toIndex: target.index });
    },
    [act],
  );

  return {
    state,
    hydrated,
    todayKey,
    boardSegments,
    tasksByColumn,
    headerLabel,
    isRolling: isRollingView(state.fixedWeekStart),
    viewMode: state.viewMode,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    act,
    setMode,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    commitDrop,
    resolveDropTarget,
    previewTasksByColumn,
    toast,
    dismissToast,
    undoToast,
    notify,
    syncStatus,
  };
}

export type PlanBoardApi = ReturnType<typeof usePlanBoard>;
