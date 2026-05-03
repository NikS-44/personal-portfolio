"use client";

import { useEffect } from "react";
import { useReducedMotion } from "../_lib/useReducedMotion";

interface ConfettiBurstProps {
  active: boolean;
  colors?: string[];
}

export function ConfettiBurst({ active, colors }: ConfettiBurstProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
        ...(colors ? { colors } : {}),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [active, reduced, colors]);

  return null;
}
