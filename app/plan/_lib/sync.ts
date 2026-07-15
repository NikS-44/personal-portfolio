import { sanitizePlanState } from "./planState";
import { mergePlanStates, planRevision } from "./taskMerge";
import type { PlanState } from "./types";

export type SyncStatus = "unknown" | "off" | "synced" | "pending" | "error";

export type RemoteSnapshot = {
  state: PlanState;
  updatedAt: string;
};

export type FetchRemoteResult = {
  available: boolean;
  snapshot: RemoteSnapshot | null;
  corrupt?: boolean;
};

/**
 * Pull remote. `null` snapshot = empty KV. Client always merges with local.
 */
export async function fetchRemoteState(): Promise<FetchRemoteResult> {
  try {
    const res = await fetch("/api/plan-state", { cache: "no-store" });
    if (res.status === 204) return { available: true, snapshot: null };
    if (!res.ok) return { available: false, snapshot: null };

    const body = (await res.json()) as Partial<RemoteSnapshot>;
    const state = sanitizePlanState(body.state);
    if (!state) return { available: true, snapshot: null, corrupt: true };
    const updatedAt = typeof body.updatedAt === "string" ? body.updatedAt : planRevision(state);
    return { available: true, snapshot: { state, updatedAt } };
  } catch {
    return { available: false, snapshot: null };
  }
}

/**
 * Push local; server merges with KV and returns the merged snapshot.
 * `keepalive` allows the request to finish during page unload.
 */
export async function pushRemoteState(state: PlanState, keepalive = false): Promise<RemoteSnapshot | null> {
  try {
    const updatedAt = planRevision(state);
    const res = await fetch("/api/plan-state", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state, updatedAt }),
      keepalive,
    });
    if (!res.ok) return null;
    if (res.status === 204) return { state, updatedAt };
    const body = (await res.json().catch(() => null)) as Partial<RemoteSnapshot> | null;
    const merged = sanitizePlanState(body?.state);
    if (!merged) return { state, updatedAt };
    return {
      state: merged,
      updatedAt: typeof body?.updatedAt === "string" ? body.updatedAt : planRevision(merged),
    };
  } catch {
    return null;
  }
}

/** Merge remote into local (identity if remote missing). */
export function mergeWithRemote(local: PlanState, remote: PlanState | null): PlanState {
  if (!remote) return local;
  return mergePlanStates(local, remote);
}
