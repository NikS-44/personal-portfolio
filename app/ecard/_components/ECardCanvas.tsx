"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import type { CardState } from "../_data/types";
import { ALL_TEMPLATES } from "../_data/templates/index";
import { THEMES } from "../_data/themes";
import { TemplateRenderer } from "./TemplateRenderer";

interface ECardCanvasProps {
  state: Partial<CardState>;
  className?: string;
}

export const ECardCanvas = forwardRef<HTMLDivElement, ECardCanvasProps>(function ECardCanvas(
  { state, className },
  ref,
) {
  const template = ALL_TEMPLATES.find((t) => t.id === state.t);
  const theme = THEMES.find((th) => th.id === (state.c ?? template?.themeId)) ?? THEMES[0];

  if (!template) {
    return (
      <div
        ref={ref}
        className={twMerge("flex items-center justify-center rounded-2xl bg-gray-100", className)}
        style={{ aspectRatio: "4/3" }}
      >
        <span className="text-gray-400">Select a template</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={twMerge("relative overflow-hidden rounded-2xl", className)}
      style={{ aspectRatio: "4/3" }}
    >
      <TemplateRenderer template={template} theme={theme} state={state} />
    </div>
  );
});
