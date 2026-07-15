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
import { isLocalOnlyMode } from "./localMode";
import { createInitialState, loadPlanState, savePlanState } from "./storage";
import { fetchRemoteState, mergeWithRemote, pushRemoteState, type SyncStatus } from "./sync";
import { planRevision } from "./taskMerge";
import type { BoardDaySegment } from "./boardView";
import type { PlanState, Task, ViewMode } from "./types";
import { BACKLOG_KEY } from "./types";

export type { DropTarget };

export type PlanToastData = {
  id: number;
  message: string;
  undoable: boolean;
};

const SYNC_DEBOUNCE_MS = 1500;
/** Pull+merge while the tab stays open; paused when hidden. */
const SYNC_POLL_MS = 30_000;

function withRollover(state: PlanState, todayKey: string): PlanState {
  return {
    ...state,
    tasks: rollOverIncompleteTasks(state.tasks, todayKey),
  };
}

export function usePlanBoard() {
  const [history, dispatch] = useReducer(historyReducer, createInitialState(), createHistory);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<PlanToastData | null>(null);
  const [syncStatus, setSyncStatusState] = useState<SyncStatus>("unknown");
  const syncStatusRef = useRef<SyncStatus>("unknown");
  const syncEnabledRef = useRef(false);
  const allowPushRef = useRef(false);
  const toastIdRef = useRef(0);
  const historyRef = useRef(history);
  historyRef.current = history;
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPushStateRef = useRef<PlanState | null>(null);

  const setSyncStatus = useCallback((next: SyncStatus) => {
    syncStatusRef.current = next;
    setSyncStatusState(next);
  }, []);

  const state = history.present;
  const todayKey = useMemo(() => toDayKey(new Date()), []);

  /* ── Bootstrap: load local, merge remote per-task, then enable push ── */

  useEffect(() => {
    const local = loadPlanState();
    dispatch({ type: "HYDRATE", state: local });

    if (isLocalOnlyMode()) {
      setSyncStatus("off");
      setHydrated(true);
      return;
    }

    let cancelled = false;

    (async () => {
      const { available, snapshot, corrupt } = await fetchRemoteState();
      if (cancelled) return;

      if (!available) {
        setSyncStatus("off");
        setHydrated(true);
        return;
      }

      const merged = withRollover(mergeWithRemote(local, snapshot?.state ?? null), todayKey);
      dispatch({ type: "HYDRATE", state: merged });
      savePlanState(merged, planRevision(merged));

      // Always push once after merge so server gets our local-only tasks / tombstones.
      if (!corrupt) allowPushRef.current = true;

      syncEnabledRef.current = true;
      setSyncStatus(corrupt ? "error" : "synced");
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [todayKey, setSyncStatus]);

  useEffect(() => {
    if (!hydrated) return;
    savePlanState(state);
  }, [state, hydrated]);

  const runRemotePush = useCallback(
    async (stateToPush: PlanState, keepalive = false) => {
      pendingPushStateRef.current = null;
      const result = await pushRemoteState(stateToPush, keepalive);
      if (!result) {
        if (!keepalive) setSyncStatus("error");
        return;
      }
      if (keepalive) return;

      const next = withRollover(result.state, todayKey);
      if (planRevision(next) !== planRevision(stateToPush) || next.tasks.length !== stateToPush.tasks.length) {
        dispatch({ type: "HYDRATE", state: next });
      }
      savePlanState(next, result.updatedAt);
      setSyncStatus("synced");
    },
    [todayKey, setSyncStatus],
  );

  /* ── Push local edits; pull+merge when the tab refocuses ── */

  useEffect(() => {
    if (!hydrated || !syncEnabledRef.current || !allowPushRef.current) return;
    setSyncStatus("pending");
    pendingPushStateRef.current = state;
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(() => {
      pushTimerRef.current = null;
      void runRemotePush(state);
    }, SYNC_DEBOUNCE_MS);
    return () => {
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current);
        pushTimerRef.current = null;
      }
    };
  }, [state, hydrated, runRemotePush, setSyncStatus]);

  useEffect(() => {
    const flushPendingPush = () => {
      if (!syncEnabledRef.current || !allowPushRef.current) return;
      const pending = pendingPushStateRef.current;
      if (!pending) return;
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current);
        pushTimerRef.current = null;
      }
      void runRemotePush(pending, true);
    };

    window.addEventListener("pagehide", flushPendingPush);
    return () => window.removeEventListener("pagehide", flushPendingPush);
  }, [runRemotePush]);

  useEffect(() => {
    if (!hydrated) return;

    const pullAndMerge = async () => {
      if (!syncEnabledRef.current || syncStatusRef.current === "pending") return;
      if (document.visibilityState !== "visible") return;
      const { available, snapshot } = await fetchRemoteState();
      if (!available || !snapshot) return;
      const localPresent = historyRef.current.present;
      const merged = withRollover(mergeWithRemote(localPresent, snapshot.state), todayKey);
      if (planRevision(merged) === planRevision(localPresent) && merged.tasks.length === localPresent.tasks.length) {
        return;
      }
      dispatch({ type: "HYDRATE", state: merged });
      savePlanState(merged, planRevision(merged));
      setSyncStatus("synced");
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") void pullAndMerge();
    };

    window.addEventListener("focus", pullAndMerge);
    document.addEventListener("visibilitychange", onVisibility);
    const poll = window.setInterval(() => {
      void pullAndMerge();
    }, SYNC_POLL_MS);

    return () => {
      window.removeEventListener("focus", pullAndMerge);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(poll);
    };
  }, [hydrated, todayKey, setSyncStatus]);
  /* ── Toasts (undo affordance for destructive-ish actions) ── */

  const notify = useCallback((message: string, undoable = false) => {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message, undoable });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const act = useCallback(
    (action: HistoryAction) => {
      allowPushRef.current = true;
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
    allowPushRef.current = true;
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
    allowPushRef.current = true;
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const goToPrevWeek = useCallback(() => {
    allowPushRef.current = true;
    if (isRollingView(state.fixedWeekStart)) {
      dispatch({ type: "SET_VIEW", fixedWeekStart: prevWeekFromRolling(todayKey) });
      return;
    }
    const week = state.fixedWeekStart;
    if (!week) return;
    dispatch({ type: "SET_VIEW", fixedWeekStart: prevWeekStart(week) });
  }, [state.fixedWeekStart, todayKey]);

  const goToNextWeek = useCallback(() => {
    allowPushRef.current = true;
    if (isRollingView(state.fixedWeekStart)) {
      dispatch({ type: "SET_VIEW", fixedWeekStart: nextWeekFromRolling(todayKey) });
      return;
    }
    const week = state.fixedWeekStart;
    if (!week) return;
    dispatch({ type: "SET_VIEW", fixedWeekStart: nextWeekStart(week) });
  }, [state.fixedWeekStart, todayKey]);

  const goToToday = useCallback(() => {
    allowPushRef.current = true;
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
