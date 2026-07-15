import { createInitialState, sanitizePlanState } from "./planState";
import { prunePlanState } from "./prune";
import type { PlanGraveyard, PlanState, Task } from "./types";

export type SyncTaskRecord = { kind: "live"; task: Task } | { kind: "tombstone"; id: string; deletedAt: string };

function recordTime(record: SyncTaskRecord): string {
  return record.kind === "live" ? record.task.updatedAt : record.deletedAt;
}

function toRecordMap(state: PlanState): Map<string, SyncTaskRecord> {
  const map = new Map<string, SyncTaskRecord>();
  for (const [id, deletedAt] of Object.entries(state.graveyard)) {
    map.set(id, { kind: "tombstone", id, deletedAt });
  }
  for (const task of state.tasks) {
    const existing = map.get(task.id);
    if (!existing || task.updatedAt >= recordTime(existing)) {
      map.set(task.id, { kind: "live", task });
    }
  }
  return map;
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

function pickRecord(a: SyncTaskRecord | undefined, b: SyncTaskRecord | undefined): SyncTaskRecord | undefined {
  if (!a) return b;
  if (!b) return a;
  if (a.kind === "live" && b.kind === "live") {
    const task = mergeLiveTasks(a.task, b.task);
    return { kind: "live", task };
  }
  return recordTime(a) >= recordTime(b) ? a : b;
}

/**
 * Per-task LWW merge with delete tombstones. Meta fields use metaUpdatedAt.
 * Never drops a remote-only or local-only task unless a newer tombstone says so.
 * Applies completed-task retention after merge.
 */
export function mergePlanStates(local: PlanState, remote: PlanState, now: Date = new Date()): PlanState {
  const localMap = toRecordMap(local);
  const remoteMap = toRecordMap(remote);
  const ids = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));

  const tasks: Task[] = [];
  const graveyard: PlanGraveyard = {};

  for (const id of ids) {
    const winner = pickRecord(localMap.get(id), remoteMap.get(id));
    if (!winner) continue;
    if (winner.kind === "tombstone") graveyard[id] = winner.deletedAt;
    else tasks.push(winner.task);
  }

  const metaSource = remote.metaUpdatedAt > local.metaUpdatedAt ? remote : local;

  return prunePlanState(
    {
      tasks,
      graveyard,
      fixedWeekStart: metaSource.fixedWeekStart,
      manualOrderColumns: metaSource.manualOrderColumns,
      viewMode: metaSource.viewMode,
      metaUpdatedAt: metaSource.metaUpdatedAt,
    },
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
  return max;
}

export function emptyRemoteAsInitial(): PlanState {
  return createInitialState();
}

export function parseRemoteState(raw: unknown): PlanState | null {
  return sanitizePlanState(raw);
}
