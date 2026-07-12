import { planReducer, type PlanAction } from "./planReducer";
import type { PlanState } from "./types";

export type HistoryAction = PlanAction | { type: "UNDO" } | { type: "REDO" };

export type HistoryState = {
  past: PlanState[];
  present: PlanState;
  future: PlanState[];
};

const HISTORY_LIMIT = 100;

/** Task mutations join the undo stack; view/cosmetic changes just update present. */
const UNDOABLE = new Set<PlanAction["type"]>([
  "IMPORT_STATE",
  "ADD_TASK",
  "UPDATE_TASK",
  "DELETE_TASK",
  "TOGGLE_COMPLETE",
  "MOVE_TASK",
  "RESET_COLUMN_PRIORITY_SORT",
  "ADD_SUBTASK",
  "UPDATE_SUBTASK",
  "TOGGLE_SUBTASK",
  "DELETE_SUBTASK",
]);

export function createHistory(present: PlanState): HistoryState {
  return { past: [], present, future: [] };
}

export function historyReducer(history: HistoryState, action: HistoryAction): HistoryState {
  if (action.type === "UNDO") {
    const previous = history.past[history.past.length - 1];
    if (!previous) return history;
    return {
      past: history.past.slice(0, -1),
      present: previous,
      future: [history.present, ...history.future],
    };
  }

  if (action.type === "REDO") {
    const [next, ...rest] = history.future;
    if (!next) return history;
    return {
      past: [...history.past, history.present],
      present: next,
      future: rest,
    };
  }

  const next = planReducer(history.present, action);
  if (next === history.present) return history;

  // A fresh snapshot (reload, remote sync) is not something to undo into.
  if (action.type === "HYDRATE") return createHistory(next);

  if (!UNDOABLE.has(action.type)) {
    return { ...history, present: next };
  }

  return {
    past: [...history.past.slice(-(HISTORY_LIMIT - 1)), history.present],
    present: next,
    future: [],
  };
}
