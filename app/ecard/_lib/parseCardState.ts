import type { CardState, CelebrationPreset } from "../_data/types";

const VALID_CELEBRATIONS: CelebrationPreset[] = [
  "confetti",
  "fireworks",
  "hearts",
  "sparkles",
  "stars",
  "petals",
  "snow",
  "none",
];

export function parseCardStateUnknown(raw: unknown): CardState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.v !== 1) return null;
  if (typeof obj.t !== "string" || obj.t.length === 0) return null;
  if (typeof obj.r !== "string" || obj.r.length > 60) return null;
  if (typeof obj.s !== "string" || obj.s.length > 60) return null;
  if (typeof obj.m !== "string" || obj.m.length > 280) return null;
  if (typeof obj.e !== "string") return null;
  if (obj.c !== undefined && typeof obj.c !== "string") return null;
  if (obj.a !== undefined && !VALID_CELEBRATIONS.includes(obj.a as CelebrationPreset)) return null;
  return {
    v: 1,
    t: obj.t,
    r: obj.r,
    s: obj.s,
    m: obj.m,
    e: obj.e,
    c: typeof obj.c === "string" ? obj.c : undefined,
    a: VALID_CELEBRATIONS.includes(obj.a as CelebrationPreset) ? (obj.a as CelebrationPreset) : undefined,
  };
}
