"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
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
import { formatWeekRange, getWeekStart, parseDayKey, toDayKey } from "./dates";
import { sortTasksForColumn } from "./priority";
import { isColumnKey, planReducer, type PlanAction } from "./planReducer";
import { createInitialState, loadPlanState, savePlanState } from "./storage";
import type { Task } from "./types";
import { BACKLOG_KEY } from "./types";

export function usePlanBoard() {
  const [state, dispatch] = useReducer(planReducer, createInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", state: loadPlanState() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePlanState(state);
  }, [state, hydrated]);

  const todayKey = useMemo(() => toDayKey(new Date()), []);

  const boardSegments = useMemo(
    () => getBoardSegments(state.fixedWeekStart, todayKey),
    [state.fixedWeekStart, todayKey],
  );

  const visibleDayKeys = useMemo(() => getDayKeysFromSegments(boardSegments), [boardSegments]);

  const headerLabel = useMemo(() => {
    if (isRollingView(state.fixedWeekStart)) {
      return formatBoardHeaderRange(boardSegments);
    }
    if (visibleDayKeys.length === 0) return "Week";
    return formatWeekRange(getWeekStart(parseDayKey(visibleDayKeys[0])));
  }, [state.fixedWeekStart, boardSegments, visibleDayKeys]);

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

  const act = useCallback((action: PlanAction) => dispatch(action), []);

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
    (_taskId: string, overId: string): { columnKey: string; index: number } | null => {
      if (isColumnKey(overId)) {
        const columnTasks = tasksByColumn.get(overId) ?? [];
        return { columnKey: overId, index: columnTasks.length };
      }

      const overTask = state.tasks.find((t) => t.id === overId);
      if (!overTask) return null;

      const columnTasks = tasksByColumn.get(overTask.dayKey) ?? [];
      const index = columnTasks.findIndex((t) => t.id === overId);
      return { columnKey: overTask.dayKey, index: index >= 0 ? index : columnTasks.length };
    },
    [state.tasks, tasksByColumn],
  );

  const moveTask = useCallback(
    (taskId: string, overId: string) => {
      const target = resolveDropTarget(taskId, overId);
      if (!target) return;
      dispatch({ type: "MOVE_TASK", taskId, toColumn: target.columnKey, toIndex: target.index });
    },
    [resolveDropTarget],
  );

  return {
    state,
    hydrated,
    todayKey,
    boardSegments,
    tasksByColumn,
    headerLabel,
    isRolling: isRollingView(state.fixedWeekStart),
    act,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    moveTask,
  };
}

export type PlanBoardApi = ReturnType<typeof usePlanBoard>;
