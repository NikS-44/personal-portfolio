"use client";

import { useEffect } from "react";
import { useReducedMotion } from "../_lib/useReducedMotion";
import type { CelebrationPreset } from "../_data/types";

interface CelebrationEffectProps {
  active: boolean;
  preset?: CelebrationPreset;
  /** Optional override colors (used when category has confettiColors) */
  colors?: string[];
}

export function CelebrationEffect({ active, preset = "confetti", colors }: CelebrationEffectProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced || preset === "none") return;
    let cancelled = false;

    import("canvas-confetti").then(({ default: confettiRaw }) => {
      if (cancelled) return;
      // canvas-confetti typings vary by version; cast to any for extended options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const confetti = confettiRaw as (opts: any) => void;

      switch (preset) {
        case "confetti":
          confetti({
            particleCount: 140,
            spread: 85,
            origin: { y: 0.6 },
            ...(colors ? { colors } : {}),
          });
          break;

        case "fireworks": {
          const burstColors = colors ?? ["#ff0000", "#ffd700", "#00ff7f", "#00bfff", "#ff69b4", "#ff4500"];
          for (let i = 0; i < 4; i++) {
            setTimeout(() => {
              if (cancelled) return;
              confetti({ particleCount: 55, angle: 60, spread: 55, origin: { x: 0 }, colors: burstColors });
              confetti({ particleCount: 55, angle: 120, spread: 55, origin: { x: 1 }, colors: burstColors });
            }, i * 350);
          }
          break;
        }

        case "hearts":
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            shapes: ["heart" as never],
            colors: colors ?? ["#ff0000", "#ff1493", "#ff69b4", "#ffb6c1", "#ff6347"],
          });
          break;

        case "sparkles":
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.5 },
            shapes: ["star" as never],
            colors: colors ?? ["#ffd700", "#ffa500", "#ff8c00", "#fffacd", "#fff8dc"],
          });
          break;

        case "stars":
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            shapes: ["star" as never],
            colors: colors ?? ["#ffffff", "#ffd700", "#ffa500", "#e0f2fe", "#c7d2fe"],
          });
          break;

        case "petals":
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.4 },
            shapes: ["circle" as never],
            colors: colors ?? ["#ff6eb4", "#ff69b4", "#ffb6c1", "#ffc0cb", "#ff1493", "#ff85b3"],
          });
          break;

        case "snow":
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            shapes: ["circle" as never],
            colors: colors ?? ["#ffffff", "#e0f2fe", "#bae6fd", "#f0f9ff"],
            gravity: 0.4,
          });
          break;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [active, reduced, preset, colors]);

  return null;
}
