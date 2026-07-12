import { toDayKey } from "./dates";
import { nextSortOrderForPriority, sortTasksForColumn } from "./priority";
import type { PlanState, Priority, SubTask, Task } from "./types";
import { BACKLOG_KEY } from "./types";

export type PlanAction =
  | { type: "HYDRATE"; state: PlanState }
  | { type: "IMPORT_STATE"; state: PlanState }
  | { type: "ADD_TASK"; columnKey: string; title: string; priority?: Priority }
  | { type: "UPDATE_TASK"; taskId: string; patch: Partial<Pick<Task, "title" | "notes" | "priority">> }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "TOGGLE_COMPLETE"; taskId: string }
  | { type: "TOGGLE_COLLAPSE"; taskId: string }
  | { type: "SET_VIEW"; fixedWeekStart: string | null }
  | { type: "SET_MODE"; mode: PlanState["viewMode"] }
  | { type: "MOVE_TASK"; taskId: string; toColumn: string; toIndex: number }
  | { type: "RESET_COLUMN_PRIORITY_SORT"; columnKey: string }
  | { type: "ADD_SUBTASK"; taskId: string; title: string }
  | { type: "UPDATE_SUBTASK"; taskId: string; subtaskId: string; title: string }
  | { type: "TOGGLE_SUBTASK"; taskId: string; subtaskId: string }
  | { type: "DELETE_SUBTASK"; taskId: string; subtaskId: string };

function newId(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

function touchTask(task: Task, patch: Partial<Task> = {}): Task {
  return { ...task, ...patch, updatedAt: nowIso() };
}

function tasksInColumn(tasks: Task[], columnKey: string): Task[] {
  return tasks.filter((t) => t.dayKey === columnKey);
}

function reindexColumn(tasks: Task[], columnKey: string, orderedIds: string[]): Task[] {
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  const ts = nowIso();
  return tasks.map((task) => {
    if (task.dayKey !== columnKey) return task;
    const index = orderMap.get(task.id);
    if (index === undefined || task.sortOrder === index) return task;
    return { ...task, sortOrder: index, updatedAt: ts };
  });
}

function arrayMoveIds(ids: string[], fromIndex: number, toIndex: number): string[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return ids;
  const next = ids.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function markColumnManual(state: PlanState, columnKey: string): string[] {
  if (state.manualOrderColumns.includes(columnKey)) return state.manualOrderColumns;
  return [...state.manualOrderColumns, columnKey];
}

function touchMeta(state: PlanState, patch: Partial<PlanState>): PlanState {
  return { ...state, ...patch, metaUpdatedAt: nowIso() };
}

export function planReducer(state: PlanState, action: PlanAction): PlanState {
  switch (action.type) {
    case "HYDRATE":
    case "IMPORT_STATE":
      return action.state;

    case "ADD_TASK": {
      const columnTasks = tasksInColumn(state.tasks, action.columnKey);
      const priority: Priority = action.priority ?? "p2";
      const sortOrder = state.manualOrderColumns.includes(action.columnKey)
        ? columnTasks.length
        : nextSortOrderForPriority(columnTasks, priority);
      const ts = nowIso();

      const task: Task = {
        id: newId(),
        title: action.title.trim() || "Untitled task",
        notes: "",
        priority,
        completed: false,
        completedAt: null,
        subtasks: [],
        collapsed: true,
        dayKey: action.columnKey,
        sortOrder,
        createdAt: ts,
        updatedAt: ts,
        overdueFrom: null,
      };

      const graveyard = { ...state.graveyard };
      delete graveyard[task.id];

      return { ...state, tasks: [...state.tasks, task], graveyard };
    }

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.taskId ? touchTask(t, action.patch) : t)),
      };

    case "DELETE_TASK": {
      const existing = state.tasks.find((t) => t.id === action.taskId);
      if (!existing) return state;
      const deletedAt = nowIso();
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.taskId),
        graveyard: { ...state.graveyard, [action.taskId]: deletedAt },
      };
    }

    case "TOGGLE_COMPLETE": {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task) return state;

      const completing = !task.completed;
      if (!completing) {
        return {
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === action.taskId ? touchTask(t, { completed: false, completedAt: null }) : t,
          ),
        };
      }

      const fromBacklog = task.dayKey === BACKLOG_KEY;
      const today = toDayKey(new Date());
      const toColumn = fromBacklog ? today : task.dayKey;
      const completedAt = nowIso();

      let tasks = state.tasks.map((t) =>
        t.id === action.taskId
          ? touchTask(t, {
              dayKey: toColumn,
              completed: true,
              completedAt,
              overdueFrom: null,
            })
          : t,
      );

      if (fromBacklog) {
        const backlogTasks = tasksInColumn(tasks, BACKLOG_KEY).sort((a, b) => a.sortOrder - b.sortOrder);
        tasks = reindexColumn(
          tasks,
          BACKLOG_KEY,
          backlogTasks.map((t) => t.id),
        );

        const todayTasks = tasksInColumn(tasks, toColumn).sort((a, b) => a.sortOrder - b.sortOrder);
        const openIds = todayTasks.filter((t) => !t.completed).map((t) => t.id);
        const doneIds = todayTasks.filter((t) => t.completed && t.id !== action.taskId).map((t) => t.id);
        doneIds.push(action.taskId);
        tasks = reindexColumn(tasks, toColumn, [...openIds, ...doneIds]);
      }

      return { ...state, tasks };
    }

    case "TOGGLE_COLLAPSE":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.taskId ? touchTask(t, { collapsed: !t.collapsed }) : t)),
      };

    case "SET_VIEW":
      return touchMeta(state, { fixedWeekStart: action.fixedWeekStart });

    case "SET_MODE":
      return touchMeta(state, { viewMode: action.mode });

    case "MOVE_TASK": {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task) return state;

      const fromColumn = task.dayKey;
      const toColumn = action.toColumn;
      const sameColumn = fromColumn === toColumn;
      const destWasManual = state.manualOrderColumns.includes(toColumn);

      const visualOpenIds = (columnKey: string, tasks: Task[], manual: boolean, excludeId?: string) =>
        sortTasksForColumn(
          tasksInColumn(tasks, columnKey).filter((t) => !t.completed && t.id !== excludeId),
          manual,
        ).map((t) => t.id);

      if (sameColumn) {
        const prevOpenIds = visualOpenIds(toColumn, state.tasks, destWasManual);
        const doneIds = tasksInColumn(state.tasks, toColumn)
          .filter((t) => t.completed)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((t) => t.id);
        const fromIndex = prevOpenIds.indexOf(action.taskId);
        if (fromIndex < 0) return state;

        const toIndex = Math.max(0, Math.min(action.toIndex, prevOpenIds.length - 1));
        const openIds = arrayMoveIds(prevOpenIds, fromIndex, toIndex);
        if (openIds.every((id, index) => id === prevOpenIds[index])) return state;

        return touchMeta(
          {
            ...state,
            tasks: reindexColumn(state.tasks, toColumn, [...openIds, ...doneIds]),
            manualOrderColumns: markColumnManual(state, toColumn),
          },
          {},
        );
      }

      let tasks = state.tasks.map((t) =>
        t.id === action.taskId
          ? touchTask(t, {
              dayKey: toColumn,
              completed: false,
              completedAt: null,
              sortOrder: action.toIndex,
              overdueFrom: null,
            })
          : t,
      );

      const droppedOnSlot = action.toIndex < visualOpenIds(toColumn, tasks, destWasManual, action.taskId).length;
      const makeManual = destWasManual || droppedOnSlot;

      if (makeManual) {
        const openIds = visualOpenIds(toColumn, tasks, destWasManual, action.taskId);
        const doneIds = tasksInColumn(tasks, toColumn)
          .filter((t) => t.completed)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((t) => t.id);
        openIds.splice(Math.min(action.toIndex, openIds.length), 0, action.taskId);
        tasks = reindexColumn(tasks, toColumn, [...openIds, ...doneIds]);
      } else {
        const peers = tasksInColumn(tasks, toColumn).filter((t) => t.id !== action.taskId);
        const sortOrder = nextSortOrderForPriority(peers, task.priority);
        tasks = tasks.map((t) => (t.id === action.taskId ? { ...t, sortOrder } : t));
      }

      const sourceManual = state.manualOrderColumns.includes(fromColumn);
      const sourceOpenIds = visualOpenIds(fromColumn, tasks, sourceManual);
      const sourceDoneIds = tasksInColumn(tasks, fromColumn)
        .filter((t) => t.completed)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((t) => t.id);
      tasks = reindexColumn(tasks, fromColumn, [...sourceOpenIds, ...sourceDoneIds]);

      return touchMeta(
        {
          ...state,
          tasks,
          manualOrderColumns: makeManual ? markColumnManual(state, toColumn) : state.manualOrderColumns,
        },
        {},
      );
    }

    case "RESET_COLUMN_PRIORITY_SORT": {
      const manualOrderColumns = state.manualOrderColumns.filter((k) => k !== action.columnKey);
      return touchMeta(state, { manualOrderColumns });
    }

    case "ADD_SUBTASK": {
      const subtask: SubTask = {
        id: newId(),
        title: action.title.trim() || "Subtask",
        completed: false,
      };
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? touchTask(t, { subtasks: [...t.subtasks, subtask], collapsed: false }) : t,
        ),
      };
    }

    case "UPDATE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? touchTask(t, {
                subtasks: t.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, title: action.title } : s)),
              })
            : t,
        ),
      };

    case "TOGGLE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? touchTask(t, {
                subtasks: t.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, completed: !s.completed } : s)),
              })
            : t,
        ),
      };

    case "DELETE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? touchTask(t, { subtasks: t.subtasks.filter((s) => s.id !== action.subtaskId) }) : t,
        ),
      };

    default:
      return state;
  }
}

export function isColumnKey(value: string): boolean {
  return value === BACKLOG_KEY || /^\d{4}-\d{2}-\d{2}$/.test(value);
}
