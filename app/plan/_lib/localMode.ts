/** Client flag: user chose local-only on the unlock page (no server sync). */
export const PLAN_LOCAL_MODE_KEY = "plan-local-mode";

/** Middleware cookie: allows /plan without the planner key. */
export const PLAN_LOCAL_COOKIE = "plan-local";

export function isLocalOnlyMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PLAN_LOCAL_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setLocalOnlyMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) window.localStorage.setItem(PLAN_LOCAL_MODE_KEY, "1");
    else window.localStorage.removeItem(PLAN_LOCAL_MODE_KEY);
  } catch {
    /* ignore */
  }
}
