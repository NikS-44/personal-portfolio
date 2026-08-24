# Weekly plan: task groups (work streams)

Status: approved design, not yet implemented Date: 2026-08-22 Area: `app/plan`, `app/api/plan-state`

## Problem

The weekly plan sorts every task in a column by its own P0–P3 priority. Work that belongs to one stream — a project, an
initiative — has no way to hold together: its tasks scatter across the column among unrelated work, and there is no way
to say "this whole stream outranks that whole stream" without hand-tuning every task's priority.

## Goal

Add a lightweight grouping concept, roughly Jira epics minus the ceremony:

- A **group** is a named work stream with its own priority and color.
- A task belongs to **exactly one group, or none**.
- A group's priority positions the group **as a unit** among ungrouped tasks; task priorities then order items
  **relative to other items in the same group**.
- In a column, a group's tasks render inside a bordered block, colored distinctly from the existing priority accents.

## Non-goals

Deliberately excluded: `#stream` quick-add tokens, a board-level group manager panel, group progress rollups or
burndown, nested groups, per-group day capacity, cross-board group sharing. Groups are managed where they are seen.

---

## 1. Data model

```ts
export type GroupColor = "teal" | "sky" | "plum" | "moss" | "clay" | "slate";

export type PlanGroup = {
  id: string;
  name: string;
  priority: Priority; // p0–p3, same scale as tasks
  color: GroupColor; // auto-assigned round-robin at creation, editable
  createdAt: string;
  updatedAt: string; // LWW clock, same contract as Task.updatedAt
};
```

`Task` gains `groupId: string | null`.

`PlanState` gains:

```ts
groups: PlanGroup[];
groupGraveyard: Record<string, string>;   // id → deletedAt, mirrors `graveyard`
```

A group is board-wide, not per-column: one stream whose tasks spread across days and the backlog. Groups are not scoped
to a week and are not pruned by completion retention.

### Backward compatibility

`sanitizePlanState` defaults `groups: []`, `groupGraveyard: {}`, and `sanitizeTask` defaults `groupId: null`. Existing
localStorage snapshots, the KV board snapshot, and v2 backup files therefore load unchanged. **No storage version bump,
no backup format bump.** `sanitizeGroup` coerces unknown `color` values to the first palette entry and unknown
`priority` values to `p2`, matching how `sanitizeTask` already handles priority.

---

## 2. Ordering

`Task.sortOrder` stays a flat number per column. Blocks are **derived at sort time**, never materialized, which leaves
`MOVE_TASK`, `reindexColumn`, and the drop-indicator's flat index math intact.

**Block anchor** — for a grouped task, the lowest `sortOrder` among that group's _open_ tasks in that column; for an
ungrouped task, its own `sortOrder`. Sorting by the anchor before any per-task key is what makes a group's tasks
contiguous, with no normalization pass, and is what lets a whole block be dragged as a unit.

Comparator, by column mode:

| Rank | Priority-sorted column                             | Manual-order column |
| ---- | -------------------------------------------------- | ------------------- |
| 1    | block priority (group's priority, else task's own) | block anchor        |
| 2    | block anchor                                       | task `sortOrder`    |
| 3    | task priority                                      | —                   |
| 4    | task `sortOrder`                                   | —                   |

Consequences, stated explicitly:

- A P0 task inside a P1 group does **not** jump above a loose P0 task. The group is placed as a unit at P1; the P0 only
  orders it first _within_ its block.
- Manual columns ignore group priority exactly as they already ignore task priority. The existing "Sort by priority"
  button (`RESET_COLUMN_PRIORITY_SORT`) returns them to the priority-sorted comparator.
- Two same-priority groups tiebreak by block anchor — deterministic and stable.

`isPriorityOrdered` (which gates the visibility of the sort button) becomes block-aware. Without this it would report
"unordered" permanently on any column containing a group, and the button would never dismiss.

Completed tasks are unaffected: they leave the block and render in the column's existing Done section, retaining
`groupId` and showing a small color dot. Un-completing returns the task to its block.

---

## 3. Drag and membership

`DropTarget` becomes `{ columnKey: string; index: number; groupId: string | null }`. `index` stays a flat index into the
column's open tasks. `groupId` is resolved from the hover target: a card inside group G, or G's block header/padding
(both registered as droppables), yields G; a loose card or the column shell yields `null`.

Drop position decides membership, with one guardrail:

> **A task can only leave its group by being dropped outside that group's block while the block is visible in the same
> column.**

Full rule table:

| Drop location                                                      | Result                                                   |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| Inside group G's block                                             | task joins G                                             |
| Loose slot in a column that shows a block for the task's own group | task leaves its group (undo toast)                       |
| Loose slot in a column with no block for the task's own group      | membership unchanged; task starts a one-task block there |
| Loose slot, task was already ungrouped                             | unchanged                                                |

Rationale for the guardrail: without it, moving a grouped task to a day where that group has no tasks yet would silently
ungroup it, because there would be nothing to aim at. Under this rule, ungrouping is always a deliberate "step outside
the fence you can see" gesture, and every day-to-day reschedule preserves the stream.

Dropping onto a slot continues to mark the destination column manual, exactly as today.

---

## 4. UI

**Block.** 1px border in `color-mix(in srgb, <hue> 45%, var(--plan-border))`, ~6% hue background tint, rounded to match
cards, with a header row: 6px color dot, group name, priority badge. The six hues are defined with `light-dark()` next
to the existing `--plan-p*` tokens, desaturated so they read as containers rather than competing with the P0–P3
red/orange/amber card accents or the violet board accent.

Palette: `teal`, `sky`, `plum`, `moss`, `clay`, `slate` — assigned round-robin by creation order so consecutively
created groups are maximally separated.

**Assigning a task.** `Group ▸` submenu in the task card's meta menu, beside the existing _Move to backlog_ / _Delete_
actions. Lists existing groups with a ✓ on the current one, `No group` to clear, and `New group…` at the bottom, which
creates a group from an inline name field and assigns the task in one action.

**Managing a group.** Click the block header to open a popover: rename, priority select, color swatches, _Delete group_.
The same popover is reachable from a trailing `⋯` on each row of the card menu's `Group ▸` submenu. There is no separate
management screen — groups are edited where they appear.

That second entry point exists to close an orphan hole: a group whose last task is deleted or dragged out still exists
but has no block anywhere, so a block-header-only popover would make it permanently unmanageable. **Empty groups
persist** and stay listed in `Group ▸`; they are deliberately _not_ garbage-collected, because a group that looks empty
on this device may still hold tasks on a peer that has not synced yet, and GC during merge would destroy them.

**Defaults.** New groups are P2, matching `ADD_TASK`. Deleting a group nulls `groupId` on its tasks (touching their
`updatedAt`) and tombstones the group.

---

## 5. Sync and robustness

`taskMerge.ts`'s `toRecordMap` / `pickRecord` are generalized over `{ id: string; updatedAt: string }` and run a second
time for groups against `groupGraveyard`. Groups therefore inherit the same per-entity LWW plus delete-tombstone
guarantees tasks already have: a group is never dropped because one device had not seen it, and a delete is never
resurrected by a stale peer. Task merge behavior, including the completion-wins rule, is untouched.

`mergeLiveTasks`'s completion preference is task-specific and does not apply to groups; groups use plain `updatedAt`
LWW.

**Dangling-group reconcile.** After merge (and after sanitize on load), any task whose `groupId` names a group not
present in `state.groups` has its `groupId` nulled. This covers a group deleted on another device while this device
edited its tasks, and any partial or hand-edited snapshot. Rendering also tolerates a dangling id defensively by
treating the task as ungrouped.

`app/api/plan-state/route.ts` needs no logic change: it already delegates to `sanitizePlanState`, `prunePlanState`, and
`mergePlanStates`.

New reducer actions, all undoable: `ADD_GROUP`, `UPDATE_GROUP`, `DELETE_GROUP`, `SET_TASK_GROUP`. `MOVE_TASK` gains
`groupId?: string | null` carrying the drop's membership decision, where the two falsy-ish values mean different things
and must not be conflated: **`undefined` = leave membership unchanged**, **`null` = remove from group**.
`DropTarget.groupId` stays purely positional (`string | null` — what you are hovering); the reducer, which knows the
destination column's blocks, is what applies the section 3 guardrail and translates a positional `null` into either
`null` or `undefined`. Keeping the guardrail in one place, in the reducer, is what keeps drag preview and commit in
agreement.

---

## 6. Files

New:

- `app/plan/_lib/groups.ts` — palette, color assignment, block derivation, dangling reconcile
- `app/plan/_components/TaskGroupBlock.tsx` — bordered block, header, droppable, manage popover

Changed:

- `_lib/types.ts`, `_lib/planState.ts` — model + sanitize
- `_lib/priority.ts` — block-aware comparator and `isPriorityOrdered`
- `_lib/planReducer.ts` — group actions, `MOVE_TASK` membership
- `_lib/taskMerge.ts` — generic LWW record merge, group merge, reconcile
- `_lib/history.ts` — new undoable action types
- `_lib/dragPreview.ts`, `_lib/dropIndicator.ts` — `groupId` in `DropTarget`, indicator inside blocks
- `_lib/usePlanBoard.ts` — group-aware `resolveDropTarget`, blocks memo
- `_components/PlanColumn.tsx` — render blocks between loose cards
- `_components/TaskCard.tsx` — `Group ▸` submenu
- `_components/CompletedTaskRow.tsx` — group color dot
- `_styles/plan.css` — group hue tokens and block styles
- `_lib/version.ts` — bump

---

## 7. Verification

`yarn verify` (eslint check + production build) plus a Chrome DevTools MCP pass on the board, screenshots under
`verification/<branch>/`.

**Vitest is added for `app/plan/_lib` only** — approved as an exception to CLAUDE.md's "no new tooling" rule, because
the block sort key, the membership guardrail, and group LWW merge are pure functions whose failure modes are silent data
corruption rather than visible breakage. Adds `vitest` as a devDependency and a `yarn test` script; `yarn verify` gains
`yarn test`.

Unit tests cover, at minimum:

- block contiguity and unit-placement in both column modes, including the "P0 in a P1 group does not outrank a loose P0"
  case
- same-priority group tiebreak determinism
- `isPriorityOrdered` on grouped columns
- every row of the membership rule table in section 3, including that `MOVE_TASK` with `groupId: undefined` preserves
  membership while `groupId: null` clears it
- an empty group survives merge and is not garbage-collected
- group LWW merge, group tombstones surviving a stale peer, and dangling-`groupId` reconcile
- sanitize of a pre-groups snapshot (no `groups` key, no `groupId` on tasks)
