"use client";

import { useEffect } from "react";
import { useReducedMotion } from "../_lib/useReducedMotion";

interface ConfettiBurstProps {
  active: boolean;
}

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    });
    return () => {
      cancelled = true;
    };
  }, [active, reduced]);

  return null;
}
