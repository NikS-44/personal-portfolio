import type { GroupColor, PlanGroup, PlanState, Task } from "./types";
import { GROUP_COLORS } from "./types";

/** A column's render list: loose cards and folded group blocks, in sorted order. */
export type ColumnBlock = { kind: "group"; group: PlanGroup; tasks: Task[] } | { kind: "task"; task: Task };

export function groupsById(groups: PlanGroup[]): Map<string, PlanGroup> {
  return new Map(groups.map((g) => [g.id, g]));
}

/** The group a task belongs to; an id with no live group reads as ungrouped. */
export function resolveGroup(task: Task, byId: Map<string, PlanGroup>): PlanGroup | null {
  if (!task.groupId) return null;
  return byId.get(task.groupId) ?? null;
}

/**
 * Fold contiguous runs of one group into blocks. Relies on the column sort having already
 * made each group's tasks adjacent (see `sortTasksForColumn`), so a group yields one block.
 */
export function buildColumnBlocks(sortedTasks: Task[], groups: PlanGroup[]): ColumnBlock[] {
  const byId = groupsById(groups);
  const blocks: ColumnBlock[] = [];

  for (const task of sortedTasks) {
    const group = resolveGroup(task, byId);
    if (!group) {
      blocks.push({ kind: "task", task });
      continue;
    }
    const last = blocks[blocks.length - 1];
    if (last && last.kind === "group" && last.group.id === group.id) {
      last.tasks.push(task);
      continue;
    }
    blocks.push({ kind: "group", group, tasks: [task] });
  }

  return blocks;
}

/**
 * Decide a dragged task's group from where it was dropped. `positionalGroupId` is what was
 * under the pointer: `undefined` = no drag context, a string = that block, `null` = a loose
 * slot. A task may only leave its group by being dropped outside that group's block while
 * the block survives in the destination column — otherwise moving a task to a day where its
 * group has no tasks yet, with nothing to aim at, would silently ungroup it.
 *
 * Shared by the reducer and the drag preview so the card never jumps on drop.
 */
export function resolveMembership(
  tasks: Task[],
  task: Task,
  toColumn: string,
  positionalGroupId: string | null | undefined,
): string | null {
  if (positionalGroupId === undefined) return task.groupId;
  if (positionalGroupId !== null) return positionalGroupId;
  if (task.groupId === null) return null;

  const blockSurvives = tasks.some(
    (t) => t.id !== task.id && t.dayKey === toColumn && !t.completed && t.groupId === task.groupId,
  );
  return blockSurvives ? null : task.groupId;
}

/** First palette hue not currently in use, so a deleted group's color becomes free again. */
export function nextGroupColor(groups: PlanGroup[]): GroupColor {
  const taken = new Set(groups.map((g) => g.color));
  return GROUP_COLORS.find((color) => !taken.has(color)) ?? GROUP_COLORS[0];
}

/**
 * Drop `groupId`s with no live group — a group deleted on another device, or a hand-edited
 * snapshot. Returns the same state object when nothing dangles, so callers can skip work.
 */
export function reconcileGroupIds(state: PlanState): PlanState {
  const byId = groupsById(state.groups);
  let changed = false;

  const tasks = state.tasks.map((task) => {
    if (!task.groupId || byId.has(task.groupId)) return task;
    changed = true;
    return { ...task, groupId: null };
  });

  if (!changed) return state;
  return { ...state, tasks };
}
