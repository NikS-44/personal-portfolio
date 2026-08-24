import { reconcileGroupIds } from "./groups";
import type { GroupColor, PlanGraveyard, PlanGroup, PlanState, Priority, SubTask, Task } from "./types";
import { BACKLOG_KEY, GROUP_COLORS } from "./types";

const PRIORITIES: Priority[] = ["p0", "p1", "p2", "p3"];

function nowIso(): string {
  return new Date().toISOString();
}

export function createInitialState(): PlanState {
  const ts = nowIso();
  return {
    tasks: [],
    graveyard: {},
    groups: [],
    groupGraveyard: {},
    fixedWeekStart: null,
    manualOrderColumns: [],
    viewMode: "week",
    metaUpdatedAt: ts,
  };
}

export function sanitizeTask(raw: unknown): Task | null {
  if (typeof raw !== "object" || raw === null) return null;
  const t = raw as Partial<Task>;
  if (typeof t.id !== "string" || typeof t.title !== "string" || typeof t.dayKey !== "string") return null;

  const subtasks: SubTask[] = Array.isArray(t.subtasks)
    ? t.subtasks
        .filter((s): s is SubTask => typeof s === "object" && s !== null && typeof (s as SubTask).id === "string")
        .map((s) => ({ id: s.id, title: String(s.title ?? ""), completed: Boolean(s.completed) }))
    : [];

  const createdAt = typeof t.createdAt === "string" ? t.createdAt : nowIso();
  const updatedAt = typeof t.updatedAt === "string" ? t.updatedAt : createdAt;

  return {
    id: t.id,
    title: t.title,
    notes: typeof t.notes === "string" ? t.notes : "",
    priority: PRIORITIES.includes(t.priority as Priority) ? (t.priority as Priority) : "p2",
    completed: Boolean(t.completed),
    completedAt: typeof t.completedAt === "string" ? t.completedAt : Boolean(t.completed) ? updatedAt : null,
    subtasks,
    collapsed: t.collapsed !== false,
    dayKey: t.dayKey === BACKLOG_KEY || /^\d{4}-\d{2}-\d{2}$/.test(t.dayKey) ? t.dayKey : BACKLOG_KEY,
    sortOrder: typeof t.sortOrder === "number" ? t.sortOrder : 0,
    createdAt,
    updatedAt,
    overdueFrom: typeof t.overdueFrom === "string" ? t.overdueFrom : null,
    groupId: typeof t.groupId === "string" && t.groupId.length > 0 ? t.groupId : null,
  };
}

export function sanitizeGroup(raw: unknown): PlanGroup | null {
  if (typeof raw !== "object" || raw === null) return null;
  const g = raw as Partial<PlanGroup>;
  if (typeof g.id !== "string" || g.id.length === 0) return null;

  const createdAt = typeof g.createdAt === "string" ? g.createdAt : nowIso();

  return {
    id: g.id,
    name: typeof g.name === "string" && g.name.trim().length > 0 ? g.name : "Untitled group",
    priority: PRIORITIES.includes(g.priority as Priority) ? (g.priority as Priority) : "p2",
    color: GROUP_COLORS.includes(g.color as GroupColor) ? (g.color as GroupColor) : GROUP_COLORS[0],
    createdAt,
    updatedAt: typeof g.updatedAt === "string" ? g.updatedAt : createdAt,
  };
}

export function sanitizeGraveyard(raw: unknown): PlanGraveyard {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const out: PlanGraveyard = {};
  for (const [id, deletedAt] of Object.entries(raw)) {
    if (typeof deletedAt === "string" && deletedAt.length > 0) out[id] = deletedAt;
  }
  return out;
}

/**
 * Coerce untrusted data into a valid PlanState; returns null when it isn't a plan at all.
 */
export function sanitizePlanState(raw: unknown): PlanState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const parsed = raw as Partial<PlanState> & { tasks?: unknown; groups?: unknown };
  if (!Array.isArray(parsed.tasks)) return null;

  const tasks: Task[] = [];
  for (const value of parsed.tasks) {
    const task = sanitizeTask(value);
    if (task) tasks.push(task);
  }

  const metaUpdatedAt =
    typeof parsed.metaUpdatedAt === "string"
      ? parsed.metaUpdatedAt
      : tasks.reduce((max, t) => (t.updatedAt > max ? t.updatedAt : max), "1970-01-01T00:00:00.000Z");

  const groups: PlanGroup[] = [];
  if (Array.isArray(parsed.groups)) {
    for (const value of parsed.groups) {
      const group = sanitizeGroup(value);
      if (group) groups.push(group);
    }
  }

  return reconcileGroupIds({
    tasks,
    graveyard: sanitizeGraveyard(parsed.graveyard),
    groups,
    groupGraveyard: sanitizeGraveyard(parsed.groupGraveyard),
    fixedWeekStart: typeof parsed.fixedWeekStart === "string" ? parsed.fixedWeekStart : null,
    manualOrderColumns: Array.isArray(parsed.manualOrderColumns)
      ? parsed.manualOrderColumns.filter((k): k is string => typeof k === "string")
      : [],
    viewMode: parsed.viewMode === "today" ? "today" : "week",
    metaUpdatedAt,
  });
}
