import type { Priority, Task } from "./types";

const PRIORITY_RANK: Record<Priority, number> = {
  p0: 0,
  p1: 1,
  p2: 2,
  p3: 3,
};

export function compareByPriority(a: Task, b: Task): number {
  const pd = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (pd !== 0) return pd;
  return a.sortOrder - b.sortOrder;
}

/** True when open tasks are already in non-decreasing priority order (p0→p3). */
export function isPriorityOrdered(tasks: Task[]): boolean {
  for (let i = 1; i < tasks.length; i += 1) {
    if (PRIORITY_RANK[tasks[i].priority] < PRIORITY_RANK[tasks[i - 1].priority]) {
      return false;
    }
  }
  return true;
}

export function sortTasksForColumn(tasks: Task[], manualOrder: boolean): Task[] {
  const list = [...tasks];
  if (manualOrder) {
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return list.sort(compareByPriority);
}

/** Themed fg/bg pair for a priority; flips with the board's light/dark palette. */
export function priorityBadgeClass(priority: Priority): string {
  return `plan-tone--${priority}`;
}

export function nextSortOrderForPriority(tasks: Task[], priority: Priority): number {
  const sameOrLower = tasks.filter((t) => PRIORITY_RANK[t.priority] >= PRIORITY_RANK[priority]);
  if (sameOrLower.length === 0) return 0;
  return Math.max(...sameOrLower.map((t) => t.sortOrder)) + 1;
}
