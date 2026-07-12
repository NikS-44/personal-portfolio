export const PLAN_COLOR_SCHEME_KEY = "plan-color-scheme";

export type PlanColorScheme = "system" | "light" | "dark";

export const PLAN_COLOR_SCHEME_CYCLE: PlanColorScheme[] = ["system", "light", "dark"];

export function isPlanColorScheme(value: string | null): value is PlanColorScheme {
  return value === "system" || value === "light" || value === "dark";
}

export function readStoredPlanColorScheme(): PlanColorScheme {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(PLAN_COLOR_SCHEME_KEY);
    if (isPlanColorScheme(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "system";
}

export function applyPlanColorScheme(scheme: PlanColorScheme): void {
  if (typeof document === "undefined") return;

  const board = document.querySelector(".plan-board");
  const meta = document.querySelector('meta[name="color-scheme"]');

  if (scheme === "system") {
    board?.removeAttribute("data-theme");
    if (meta) meta.setAttribute("content", "light dark");
  } else {
    board?.setAttribute("data-theme", scheme);
    if (meta) meta.setAttribute("content", scheme);
  }

  try {
    if (scheme === "system") {
      window.localStorage.removeItem(PLAN_COLOR_SCHEME_KEY);
    } else {
      window.localStorage.setItem(PLAN_COLOR_SCHEME_KEY, scheme);
    }
  } catch {
    /* ignore */
  }
}

export function planColorSchemeLabel(scheme: PlanColorScheme): string {
  if (scheme === "system") return "Theme: System";
  if (scheme === "light") return "Theme: Light";
  return "Theme: Dark";
}
