import { sanitizePlanState } from "./storage";
import type { PlanState } from "./types";

export type SyncStatus = "unknown" | "off" | "synced" | "pending" | "error";

export type RemoteSnapshot = {
  state: PlanState;
  updatedAt: string;
};

/**
 * Pull the remote snapshot. `null` data means the server has nothing yet;
 * `available: false` means sync is not configured (or we're locked out) and
 * the board should stay local-only.
 */
export async function fetchRemoteState(): Promise<{ available: boolean; snapshot: RemoteSnapshot | null }> {
  try {
    const res = await fetch("/api/plan-state", { cache: "no-store" });
    if (res.status === 204) return { available: true, snapshot: null };
    if (!res.ok) return { available: false, snapshot: null };

    const body = (await res.json()) as Partial<RemoteSnapshot>;
    const state = sanitizePlanState(body.state);
    if (!state || typeof body.updatedAt !== "string") return { available: true, snapshot: null };
    return { available: true, snapshot: { state, updatedAt: body.updatedAt } };
  } catch {
    return { available: false, snapshot: null };
  }
}

export async function pushRemoteState(snapshot: RemoteSnapshot): Promise<boolean> {
  try {
    const res = await fetch("/api/plan-state", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(snapshot),
    });
    return res.ok;
  } catch {
    return false;
  }
}
