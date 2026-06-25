import { rollOverIncompleteTasks, toDayKey } from "./dates";
import type { PlanState } from "./types";

const STORAGE_KEY = "plan-board-v1";

export function createInitialState(): PlanState {
  return {
    tasks: [],
    fixedWeekStart: null,
    manualOrderColumns: [],
  };
}

type StoredPlanState = PlanState & { weekStart?: string };

export function loadPlanState(): PlanState {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const parsed = JSON.parse(raw) as StoredPlanState;
    if (!parsed || !Array.isArray(parsed.tasks)) return createInitialState();

    const today = toDayKey(new Date());
    const tasks = rollOverIncompleteTasks(parsed.tasks, today);

    const fixedWeekStart = parsed.fixedWeekStart !== undefined ? parsed.fixedWeekStart : null;

    return {
      tasks,
      fixedWeekStart,
      manualOrderColumns: Array.isArray(parsed.manualOrderColumns) ? parsed.manualOrderColumns : [],
    };
  } catch {
    return createInitialState();
  }
}

export function savePlanState(state: PlanState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
