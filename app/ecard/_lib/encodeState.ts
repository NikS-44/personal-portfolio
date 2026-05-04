import type { CardState } from "../_data/types";
import { parseCardStateUnknown } from "./parseCardState";

/** Compact row — shorter than `{"v":1,"t":…}` after base64. */
function payloadFromArray(parsed: unknown[]): Record<string, unknown> | null {
  if (parsed.length < 6) return null;
  const [v, t, r, s, m, e, c, a] = parsed;
  if (v !== 1) return null;
  if (
    typeof t !== "string" ||
    typeof r !== "string" ||
    typeof s !== "string" ||
    typeof m !== "string" ||
    typeof e !== "string"
  ) {
    return null;
  }
  const obj: Record<string, unknown> = { v, t, r, s, m, e };
  if (typeof c === "string" && c.length > 0) obj.c = c;
  if (typeof a === "string" && a.length > 0) obj.a = a;
  return obj;
}

export function encodeCardState(state: CardState): string {
  const compact = [state.v, state.t, state.r, state.s, state.m, state.e, state.c ?? "", state.a ?? ""];
  const json = JSON.stringify(compact);
  const encoded = btoa(encodeURIComponent(json));
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeCardState(encoded: string): CardState | null {
  try {
    const padding = "===".slice((encoded.length + 3) % 4);
    const restored = (encoded + padding).replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(restored));
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    const obj = payloadFromArray(parsed);
    if (!obj) return null;
    return parseCardStateUnknown(obj);
  } catch {
    return null;
  }
}
