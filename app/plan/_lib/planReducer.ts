import { nextSortOrderForPriority } from "./priority";
import type { PlanState, Priority, SubTask, Task } from "./types";
import { BACKLOG_KEY } from "./types";

export type PlanAction =
  | { type: "HYDRATE"; state: PlanState }
  | { type: "ADD_TASK"; columnKey: string; title: string }
  | { type: "UPDATE_TASK"; taskId: string; patch: Partial<Pick<Task, "title" | "notes" | "priority">> }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "TOGGLE_COMPLETE"; taskId: string }
  | { type: "TOGGLE_COLLAPSE"; taskId: string }
  | { type: "SET_VIEW"; fixedWeekStart: string | null }
  | { type: "MOVE_TASK"; taskId: string; toColumn: string; toIndex: number }
  | { type: "RESET_COLUMN_PRIORITY_SORT"; columnKey: string }
  | { type: "ADD_SUBTASK"; taskId: string; title: string }
  | { type: "UPDATE_SUBTASK"; taskId: string; subtaskId: string; title: string }
  | { type: "TOGGLE_SUBTASK"; taskId: string; subtaskId: string }
  | { type: "DELETE_SUBTASK"; taskId: string; subtaskId: string };

function newId(): string {
  return crypto.randomUUID();
}

function tasksInColumn(tasks: Task[], columnKey: string): Task[] {
  return tasks.filter((t) => t.dayKey === columnKey);
}

function reindexColumn(tasks: Task[], columnKey: string, orderedIds: string[]): Task[] {
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  return tasks.map((task) => {
    if (task.dayKey !== columnKey) return task;
    const index = orderMap.get(task.id);
    if (index === undefined) return task;
    return { ...task, sortOrder: index };
  });
}

function markColumnManual(state: PlanState, columnKey: string): string[] {
  if (state.manualOrderColumns.includes(columnKey)) return state.manualOrderColumns;
  return [...state.manualOrderColumns, columnKey];
}

export function planReducer(state: PlanState, action: PlanAction): PlanState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD_TASK": {
      const columnTasks = tasksInColumn(state.tasks, action.columnKey);
      const priority: Priority = "p2";
      const sortOrder = state.manualOrderColumns.includes(action.columnKey)
        ? columnTasks.length
        : nextSortOrderForPriority(columnTasks, priority);

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
        createdAt: new Date().toISOString(),
      };

      return { ...state, tasks: [...state.tasks, task] };
    }

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.taskId ? { ...t, ...action.patch } : t)),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.taskId),
      };

    case "TOGGLE_COMPLETE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : null,
              }
            : t,
        ),
      };

    case "TOGGLE_COLLAPSE":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.taskId ? { ...t, collapsed: !t.collapsed } : t)),
      };

    case "SET_VIEW":
      return { ...state, fixedWeekStart: action.fixedWeekStart };

    case "MOVE_TASK": {
      const task = state.tasks.find((t) => t.id === action.taskId);
      if (!task) return state;

      const fromColumn = task.dayKey;
      const toColumn = action.toColumn;

      let tasks = state.tasks.map((t) =>
        t.id === action.taskId ? { ...t, dayKey: toColumn, sortOrder: action.toIndex } : t,
      );

      const destTasks = tasksInColumn(tasks, toColumn).sort((a, b) => a.sortOrder - b.sortOrder);
      const destIds = destTasks.map((t) => t.id);
      const withoutActive = destIds.filter((id) => id !== action.taskId);
      withoutActive.splice(action.toIndex, 0, action.taskId);
      tasks = reindexColumn(tasks, toColumn, withoutActive);

      if (fromColumn !== toColumn) {
        const sourceTasks = tasksInColumn(tasks, fromColumn).sort((a, b) => a.sortOrder - b.sortOrder);
        tasks = reindexColumn(
          tasks,
          fromColumn,
          sourceTasks.map((t) => t.id),
        );
      }

      let manualOrderColumns = markColumnManual(state, toColumn);
      if (fromColumn !== toColumn) {
        manualOrderColumns = markColumnManual({ ...state, manualOrderColumns }, fromColumn);
      }

      return { ...state, tasks, manualOrderColumns };
    }

    case "RESET_COLUMN_PRIORITY_SORT": {
      const manualOrderColumns = state.manualOrderColumns.filter((k) => k !== action.columnKey);
      return { ...state, manualOrderColumns };
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
          t.id === action.taskId ? { ...t, subtasks: [...t.subtasks, subtask], collapsed: false } : t,
        ),
      };
    }

    case "UPDATE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, title: action.title } : s)),
              }
            : t,
        ),
      };

    case "TOGGLE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, completed: !s.completed } : s)),
              }
            : t,
        ),
      };

    case "DELETE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== action.subtaskId) } : t,
        ),
      };

    default:
      return state;
  }
}

export function isColumnKey(value: string): boolean {
  return value === BACKLOG_KEY || /^\d{4}-\d{2}-\d{2}$/.test(value);
}
