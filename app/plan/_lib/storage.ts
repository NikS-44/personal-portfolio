import { createInitialState, sanitizePlanState } from "./planState";
import { prunePlanState } from "./prune";
import type { PlanState } from "./types";

const STORAGE_KEY = "plan-board-v2";
const UPDATED_AT_KEY = "plan-board-updated-at-v2";

export { createInitialState, sanitizePlanState, sanitizeTask, sanitizeGraveyard } from "./planState";
export { prunePlanState, COMPLETED_RETENTION_MONTHS } from "./prune";

export function loadPlanState(): PlanState {
  if (typeof window === "undefined") return createInitialState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const state = sanitizePlanState(JSON.parse(raw));
    if (!state) return createInitialState();

    return prunePlanState(state);
  } catch {
    return createInitialState();
  }
}

export function savePlanState(state: PlanState, updatedAt?: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (updatedAt !== undefined) {
    window.localStorage.setItem(UPDATED_AT_KEY, updatedAt);
  }
}

export function loadUpdatedAt(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(UPDATED_AT_KEY);
  } catch {
    return null;
  }
}

/* ── Backup export / import ── */

type BackupFile = {
  app: "plan-board";
  version: 2;
  exportedAt: string;
  state: PlanState;
};

export function serializeBackup(state: PlanState): string {
  const backup: BackupFile = { app: "plan-board", version: 2, exportedAt: new Date().toISOString(), state };
  return JSON.stringify(backup, null, 2);
}

/** Accepts both backup files and raw PlanState JSON. */
export function parseBackup(text: string): PlanState | null {
  try {
    const parsed = JSON.parse(text) as Partial<BackupFile> | PlanState;
    const candidate = typeof parsed === "object" && parsed !== null && "state" in parsed ? parsed.state : parsed;
    const state = sanitizePlanState(candidate);
    return state ? prunePlanState(state) : null;
  } catch {
    return null;
  }
}
