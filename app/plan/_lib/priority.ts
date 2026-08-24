import type { PlanGroup, Priority, Task } from "./types";

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

function groupMap(groups: PlanGroup[]): Map<string, PlanGroup> {
  return new Map(groups.map((g) => [g.id, g]));
}

/** Group a task actually belongs to; a dangling id reads as ungrouped. */
function resolveGroup(task: Task, byId: Map<string, PlanGroup>): PlanGroup | null {
  if (!task.groupId) return null;
  return byId.get(task.groupId) ?? null;
}

/**
 * Lowest sortOrder among a block's open tasks in this column — for a loose task, its own.
 * Sorting on the anchor before any per-task key is what keeps a group's tasks contiguous
 * without a normalization pass, and what lets a whole block be dragged as a unit.
 */
function blockAnchors(tasks: Task[], byId: Map<string, PlanGroup>): Map<string, number> {
  const anchors = new Map<string, number>();
  for (const task of tasks) {
    const group = resolveGroup(task, byId);
    if (!group) continue;
    const current = anchors.get(group.id);
    if (current === undefined || task.sortOrder < current) anchors.set(group.id, task.sortOrder);
  }
  return anchors;
}

function anchorOf(task: Task, byId: Map<string, PlanGroup>, anchors: Map<string, number>): number {
  const group = resolveGroup(task, byId);
  if (!group) return task.sortOrder;
  return anchors.get(group.id) ?? task.sortOrder;
}

/** Priority that positions the task's block: the group's, else the task's own. */
function blockPriority(task: Task, byId: Map<string, PlanGroup>): Priority {
  return resolveGroup(task, byId)?.priority ?? task.priority;
}

function comparePrioritySorted(byId: Map<string, PlanGroup>, anchors: Map<string, number>) {
  return (a: Task, b: Task): number => {
    const bp = PRIORITY_RANK[blockPriority(a, byId)] - PRIORITY_RANK[blockPriority(b, byId)];
    if (bp !== 0) return bp;
    const anchor = anchorOf(a, byId, anchors) - anchorOf(b, byId, anchors);
    if (anchor !== 0) return anchor;
    return compareByPriority(a, b);
  };
}

/** Manual columns ignore group priority exactly as they already ignore task priority. */
function compareManual(byId: Map<string, PlanGroup>, anchors: Map<string, number>) {
  return (a: Task, b: Task): number => {
    const anchor = anchorOf(a, byId, anchors) - anchorOf(b, byId, anchors);
    if (anchor !== 0) return anchor;
    return a.sortOrder - b.sortOrder;
  };
}

/** True when open tasks are already in the order the priority sort would produce. */
export function isPriorityOrdered(tasks: Task[], groups: PlanGroup[] = []): boolean {
  const sorted = sortTasksForColumn(tasks, false, groups);
  return sorted.every((task, index) => task.id === tasks[index].id);
}

export function sortTasksForColumn(tasks: Task[], manualOrder: boolean, groups: PlanGroup[] = []): Task[] {
  const byId = groupMap(groups);
  const anchors = blockAnchors(
    tasks.filter((t) => !t.completed),
    byId,
  );
  return [...tasks].sort(manualOrder ? compareManual(byId, anchors) : comparePrioritySorted(byId, anchors));
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
