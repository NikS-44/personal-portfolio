"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import type { CardState, ColorTheme } from "../_data/types";
import { ALL_TEMPLATES } from "../_data/templates/index";
import { THEMES } from "../_data/themes";
import { TemplateRenderer } from "./TemplateRenderer";
import { ParticleCanvas } from "./ParticleCanvas";

interface ECardCanvasProps {
  state: Partial<CardState>;
  className?: string;
  /** When true, suppresses particles (used in StepTemplate preview thumbnails) */
  preview?: boolean;
}

export const ECardCanvas = forwardRef<HTMLDivElement, ECardCanvasProps>(function ECardCanvas(
  { state, className, preview = false },
  ref,
) {
  const template = ALL_TEMPLATES.find((t) => t.id === state.t);
  const baseTheme = THEMES.find((th) => th.id === (state.c ?? template?.themeId)) ?? THEMES[0];

  // When a background image is present, make layouts use transparent bg so the image shows through
  const theme: ColorTheme = template?.backgroundImage ? { ...baseTheme, bg: "bg-transparent" } : baseTheme;

  // In preview mode (template thumbnails) we lock the 4:3 ratio so the grid stays uniform.
  // In full-size mode we let height grow with content so long messages don't get clipped.
  const aspectStyle = preview ? { aspectRatio: "4/3" } : { minHeight: "calc(min(70vw, 420px) * 0.75)" };

  if (!template) {
    return (
      <div
        ref={ref}
        className={twMerge("flex items-center justify-center rounded-2xl bg-gray-100", className)}
        style={aspectStyle}
      >
        <span className="text-gray-500">Select a template</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={twMerge("relative overflow-hidden rounded-2xl", className)}
      style={{
        ...aspectStyle,
        ...(template.backgroundImage
          ? {
              backgroundImage: `url(${template.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      {template.backgroundImage && <div className="absolute inset-0 z-0 bg-black/30" />}

      {/* Ambient particles — only on full-size views, not preview thumbnails */}
      {!preview && template.particlePreset && (
        <ParticleCanvas preset={template.particlePreset} id={`particles-${template.id}`} />
      )}

      <div className={template.backgroundImage ? "relative z-10 h-full w-full" : "h-full w-full"}>
        <TemplateRenderer template={template} theme={theme} state={state} />
      </div>
    </div>
  );
});
