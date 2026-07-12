import { rollOverIncompleteTasks, toDayKey } from "./dates";
import type { PlanState, Priority, SubTask, Task, ViewMode } from "./types";
import { BACKLOG_KEY } from "./types";

const STORAGE_KEY = "plan-board-v1";
const UPDATED_AT_KEY = "plan-board-updated-at";

const PRIORITIES: Priority[] = ["p0", "p1", "p2", "p3"];

export function createInitialState(): PlanState {
  return {
    tasks: [],
    fixedWeekStart: null,
    manualOrderColumns: [],
    viewMode: "week",
  };
}

/**
 * Coerce untrusted data (old localStorage schema, imported backups, remote
 * state) into a valid PlanState; returns null when it isn't a plan at all.
 */
export function sanitizePlanState(raw: unknown): PlanState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const parsed = raw as Partial<PlanState>;
  if (!Array.isArray(parsed.tasks)) return null;

  const tasks: Task[] = [];
  for (const value of parsed.tasks) {
    if (typeof value !== "object" || value === null) continue;
    const t = value as Partial<Task>;
    if (typeof t.id !== "string" || typeof t.title !== "string" || typeof t.dayKey !== "string") continue;

    const subtasks: SubTask[] = Array.isArray(t.subtasks)
      ? t.subtasks
          .filter((s): s is SubTask => typeof s === "object" && s !== null && typeof (s as SubTask).id === "string")
          .map((s) => ({ id: s.id, title: String(s.title ?? ""), completed: Boolean(s.completed) }))
      : [];

    tasks.push({
      id: t.id,
      title: t.title,
      notes: typeof t.notes === "string" ? t.notes : "",
      priority: PRIORITIES.includes(t.priority as Priority) ? (t.priority as Priority) : "p2",
      completed: Boolean(t.completed),
      completedAt: typeof t.completedAt === "string" ? t.completedAt : null,
      subtasks,
      collapsed: t.collapsed !== false,
      dayKey: t.dayKey === BACKLOG_KEY || /^\d{4}-\d{2}-\d{2}$/.test(t.dayKey) ? t.dayKey : BACKLOG_KEY,
      sortOrder: typeof t.sortOrder === "number" ? t.sortOrder : 0,
      createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date().toISOString(),
      overdueFrom: typeof t.overdueFrom === "string" ? t.overdueFrom : null,
    });
  }

  return {
    tasks,
    fixedWeekStart: typeof parsed.fixedWeekStart === "string" ? parsed.fixedWeekStart : null,
    manualOrderColumns: Array.isArray(parsed.manualOrderColumns)
      ? parsed.manualOrderColumns.filter((k): k is string => typeof k === "string")
      : [],
    viewMode: parsed.viewMode === "today" ? "today" : ("week" as ViewMode),
  };
}

export function loadPlanState(): PlanState {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const state = sanitizePlanState(JSON.parse(raw));
    if (!state) return createInitialState();

    return { ...state, tasks: rollOverIncompleteTasks(state.tasks, toDayKey(new Date())) };
  } catch {
    return createInitialState();
  }
}

export function savePlanState(state: PlanState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.localStorage.setItem(UPDATED_AT_KEY, new Date().toISOString());
}

export function loadUpdatedAt(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(UPDATED_AT_KEY);
  } catch {
    return null;
  }
}

/* ── Backup export / import ── */

type BackupFile = {
  app: "plan-board";
  version: 1;
  exportedAt: string;
  state: PlanState;
};

export function serializeBackup(state: PlanState): string {
  const backup: BackupFile = { app: "plan-board", version: 1, exportedAt: new Date().toISOString(), state };
  return JSON.stringify(backup, null, 2);
}

/** Accepts both backup files and raw PlanState JSON. */
export function parseBackup(text: string): PlanState | null {
  try {
    const parsed = JSON.parse(text) as Partial<BackupFile> | PlanState;
    const candidate = typeof parsed === "object" && parsed !== null && "state" in parsed ? parsed.state : parsed;
    return sanitizePlanState(candidate);
  } catch {
    return null;
  }
}
