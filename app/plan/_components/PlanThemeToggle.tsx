"use client";

import { useEffect, useId, useState } from "react";
import { PlanIconButton } from "./PlanHint";
import {
  applyPlanColorScheme,
  planColorSchemeLabel,
  PLAN_COLOR_SCHEME_CYCLE,
  readStoredPlanColorScheme,
  type PlanColorScheme,
} from "../_lib/theme";

export default function PlanThemeToggle() {
  const [scheme, setScheme] = useState<PlanColorScheme>("system");
  const tipId = useId();
  const anchorName = "--plan-theme-toggle";

  useEffect(() => {
    const stored = readStoredPlanColorScheme();
    setScheme(stored);
    applyPlanColorScheme(stored);
  }, []);

  const cycle = () => {
    const index = PLAN_COLOR_SCHEME_CYCLE.indexOf(scheme);
    const next = PLAN_COLOR_SCHEME_CYCLE[(index + 1) % PLAN_COLOR_SCHEME_CYCLE.length] ?? "system";
    setScheme(next);
    applyPlanColorScheme(next);
  };

  const label = planColorSchemeLabel(scheme);

  return (
    <PlanIconButton
      label={label}
      hint={label}
      hintId={tipId}
      anchorName={anchorName}
      hintAlign="end"
      pressed={scheme !== "system"}
      onClick={cycle}
      className={`plan-menu-btn ${scheme !== "system" ? "plan-menu-btn--active" : ""}`}
    >
      <ThemeIcon scheme={scheme} />
    </PlanIconButton>
  );
}

function ThemeIcon({ scheme }: { scheme: PlanColorScheme }) {
  if (scheme === "light") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (scheme === "dark") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M13.5 9.1A5.5 5.5 0 0 1 6.9 2.5 5.75 5.75 0 1 0 13.5 9.1Z" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2.75v10.5A5.25 5.25 0 0 0 8 2.75Z" fill="currentColor" />
    </svg>
  );
}
