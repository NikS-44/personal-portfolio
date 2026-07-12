import type { Task } from "./types";

export type DropTarget = { columnKey: string; index: number };

function findTaskColumn(tasksByColumn: Map<string, Task[]>, taskId: string): { task: Task; columnKey: string } | null {
  const entries = Array.from(tasksByColumn.entries());
  for (let i = 0; i < entries.length; i += 1) {
    const [columnKey, tasks] = entries[i];
    const task = tasks.find((t) => t.id === taskId);
    if (task) return { task, columnKey };
  }
  return null;
}

/**
 * Live cross-column drag layout (dnd-kit MultipleContainers pattern):
 * re-home the active task into the hovered column without committing state.
 * Same-column reorder is left to SortableContext transforms.
 */
export function applyDragPreview(
  tasksByColumn: Map<string, Task[]>,
  taskId: string,
  preview: DropTarget,
): Map<string, Task[]> {
  const located = findTaskColumn(tasksByColumn, taskId);
  if (!located || located.columnKey === preview.columnKey) {
    return tasksByColumn;
  }

  const { task: active } = located;
  const next = new Map<string, Task[]>();
  Array.from(tasksByColumn.entries()).forEach(([key, tasks]) => {
    next.set(
      key,
      tasks.filter((t) => t.id !== taskId),
    );
  });

  const destTasks = next.get(preview.columnKey) ?? [];
  const open = destTasks.filter((t) => !t.completed);
  const done = destTasks.filter((t) => t.completed);
  const moved: Task = {
    ...active,
    dayKey: preview.columnKey,
    completed: false,
    completedAt: null,
  };

  const insertAt = Math.max(0, Math.min(preview.index, open.length));
  open.splice(insertAt, 0, moved);
  next.set(preview.columnKey, [...open, ...done]);
  return next;
}
