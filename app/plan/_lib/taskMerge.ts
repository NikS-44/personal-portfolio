import { reconcileGroupIds } from "./groups";
import { createInitialState, sanitizePlanState } from "./planState";
import { prunePlanState } from "./prune";
import type { PlanGraveyard, PlanGroup, PlanState, Task } from "./types";

/** Anything sync merges per-id: a task or a group. */
type Syncable = { id: string; updatedAt: string };

export type SyncRecord<T extends Syncable> =
  | { kind: "live"; entity: T }
  | { kind: "tombstone"; id: string; deletedAt: string };

export type SyncTaskRecord = SyncRecord<Task>;

function recordTime<T extends Syncable>(record: SyncRecord<T>): string {
  return record.kind === "live" ? record.entity.updatedAt : record.deletedAt;
}

function toRecordMap<T extends Syncable>(entities: T[], graveyard: PlanGraveyard): Map<string, SyncRecord<T>> {
  const map = new Map<string, SyncRecord<T>>();
  for (const [id, deletedAt] of Object.entries(graveyard)) {
    map.set(id, { kind: "tombstone", id, deletedAt });
  }
  for (const entity of entities) {
    const existing = map.get(entity.id);
    if (!existing || entity.updatedAt >= recordTime(existing)) {
      map.set(entity.id, { kind: "live", entity });
    }
  }
  return map;
}

/**
 * Per-id LWW with delete tombstones, shared by tasks and groups.
 * `resolveLive` lets tasks apply their completion-wins rule; groups use plain LWW.
 */
function mergeById<T extends Syncable>(
  local: { entities: T[]; graveyard: PlanGraveyard },
  remote: { entities: T[]; graveyard: PlanGraveyard },
  resolveLive: (a: T, b: T) => T,
): { entities: T[]; graveyard: PlanGraveyard } {
  const localMap = toRecordMap(local.entities, local.graveyard);
  const remoteMap = toRecordMap(remote.entities, remote.graveyard);
  const ids = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));

  const entities: T[] = [];
  const graveyard: PlanGraveyard = {};

  for (const id of ids) {
    const winner = pickRecord(localMap.get(id), remoteMap.get(id), resolveLive);
    if (!winner) continue;
    if (winner.kind === "tombstone") graveyard[id] = winner.deletedAt;
    else entities.push(winner.entity);
  }

  return { entities, graveyard };
}

function newerWins<T extends Syncable>(a: T, b: T): T {
  return a.updatedAt >= b.updatedAt ? a : b;
}

/** Prefer completion when timestamps conflict — rollover must not erase a remote done state. */
function mergeLiveTasks(local: Task, remote: Task): Task {
  if (local.completed === remote.completed) {
    return local.updatedAt >= remote.updatedAt ? local : remote;
  }

  const completed = local.completed ? local : remote;
  const incomplete = local.completed ? remote : local;

  // Incomplete wins only when strictly newer (explicit undo or post-completion edit).
  if (incomplete.updatedAt > completed.updatedAt) return incomplete;
  return completed;
}

function pickRecord<T extends Syncable>(
  a: SyncRecord<T> | undefined,
  b: SyncRecord<T> | undefined,
  resolveLive: (x: T, y: T) => T,
): SyncRecord<T> | undefined {
  if (!a) return b;
  if (!b) return a;
  if (a.kind === "live" && b.kind === "live") {
    return { kind: "live", entity: resolveLive(a.entity, b.entity) };
  }
  return recordTime(a) >= recordTime(b) ? a : b;
}

/**
 * Per-task LWW merge with delete tombstones. Meta fields use metaUpdatedAt.
 * Never drops a remote-only or local-only task unless a newer tombstone says so.
 * Applies completed-task retention after merge.
 */
export function mergePlanStates(local: PlanState, remote: PlanState, now: Date = new Date()): PlanState {
  const { entities: tasks, graveyard } = mergeById<Task>(
    { entities: local.tasks, graveyard: local.graveyard },
    { entities: remote.tasks, graveyard: remote.graveyard },
    mergeLiveTasks,
  );

  const { entities: groups, graveyard: groupGraveyard } = mergeById<PlanGroup>(
    { entities: local.groups, graveyard: local.groupGraveyard },
    { entities: remote.groups, graveyard: remote.groupGraveyard },
    newerWins,
  );

  const metaSource = remote.metaUpdatedAt > local.metaUpdatedAt ? remote : local;

  // Groups are never pruned or garbage-collected: an empty group here may still hold
  // tasks on a peer that has not synced yet.
  return prunePlanState(
    reconcileGroupIds({
      tasks,
      graveyard,
      groups,
      groupGraveyard,
      fixedWeekStart: metaSource.fixedWeekStart,
      manualOrderColumns: metaSource.manualOrderColumns,
      viewMode: metaSource.viewMode,
      metaUpdatedAt: metaSource.metaUpdatedAt,
    }),
    now,
  );
}

/** Board revision clock for debounce / status UI (max of meta + task/tombstone times). */
export function planRevision(state: PlanState): string {
  let max = state.metaUpdatedAt;
  for (const task of state.tasks) {
    if (task.updatedAt > max) max = task.updatedAt;
  }
  for (const deletedAt of Object.values(state.graveyard)) {
    if (deletedAt > max) max = deletedAt;
  }
  for (const group of state.groups) {
    if (group.updatedAt > max) max = group.updatedAt;
  }
  for (const deletedAt of Object.values(state.groupGraveyard)) {
    if (deletedAt > max) max = deletedAt;
  }
  return max;
}

export function emptyRemoteAsInitial(): PlanState {
  return createInitialState();
}

export function parseRemoteState(raw: unknown): PlanState | null {
  return sanitizePlanState(raw);
}
