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

export function sortTasksForColumn(tasks: Task[], manualOrder: boolean): Task[] {
  const list = [...tasks];
  if (manualOrder) {
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return list.sort(compareByPriority);
}

export function priorityAccentClass(priority: Priority): string {
  switch (priority) {
    case "p0":
      return "border-l-red-500";
    case "p1":
      return "border-l-orange-500";
    case "p2":
      return "border-l-amber-400";
    case "p3":
      return "border-l-stone-300";
  }
}

export function priorityActiveClass(priority: Priority): string {
  switch (priority) {
    case "p0":
      return "bg-red-500 text-white ring-red-500";
    case "p1":
      return "bg-orange-500 text-white ring-orange-500";
    case "p2":
      return "bg-amber-500 text-white ring-amber-500";
    case "p3":
      return "bg-stone-500 text-white ring-stone-500";
  }
}

export function nextSortOrderForPriority(tasks: Task[], priority: Priority): number {
  const sameOrLower = tasks.filter((t) => PRIORITY_RANK[t.priority] >= PRIORITY_RANK[priority]);
  if (sameOrLower.length === 0) return 0;
  return Math.max(...sameOrLower.map((t) => t.sortOrder)) + 1;
}
