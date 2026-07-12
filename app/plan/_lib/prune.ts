import type { PlanGraveyard, PlanState, Task } from "./types";

/** Completed tasks at least this old are dropped from the live board. */
export const COMPLETED_RETENTION_MONTHS = 6;

function retentionCutoffIso(now: Date): string {
  const cutoff = new Date(now.getTime());
  cutoff.setMonth(cutoff.getMonth() - COMPLETED_RETENTION_MONTHS);
  return cutoff.toISOString();
}

function completedAtIso(task: Task): string {
  return task.completedAt ?? task.updatedAt;
}

/**
 * Drop completed tasks ≥6 months old and tombstone them so sync cannot resurrect them.
 * Idempotent; safe after sanitize/merge on client and server.
 */
export function prunePlanState(state: PlanState, now: Date = new Date()): PlanState {
  const cutoffIso = retentionCutoffIso(now);
  const deletedAt = now.toISOString();

  const graveyard: PlanGraveyard = { ...state.graveyard };
  const tasks: Task[] = [];
  let changed = false;

  for (const task of state.tasks) {
    if (task.completed && completedAtIso(task) < cutoffIso) {
      const existing = graveyard[task.id];
      if (!existing || deletedAt >= existing) {
        graveyard[task.id] = deletedAt;
      }
      changed = true;
      continue;
    }
    tasks.push(task);
    if (graveyard[task.id] !== undefined) {
      delete graveyard[task.id];
      changed = true;
    }
  }

  if (!changed) return state;
  return { ...state, tasks, graveyard };
}
