"use client";

import type { CardState } from "../_data/types";
import { parseCardStateUnknown } from "./parseCardState";

export function encodeCardState(state: CardState): string {
  const json = JSON.stringify(state);
  const encoded = btoa(encodeURIComponent(json));
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeCardState(encoded: string): CardState | null {
  try {
    const padding = "===".slice((encoded.length + 3) % 4);
    const restored = (encoded + padding).replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(restored));
    const parsed: unknown = JSON.parse(json);
    return parseCardStateUnknown(parsed);
  } catch {
    return null;
  }
}
