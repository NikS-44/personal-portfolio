"use client";

import { useCallback, useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export type ParticlePreset =
  | "sparkles"
  | "snow"
  | "confetti-rain"
  | "fireworks"
  | "petals"
  | "hearts"
  | "stars"
  | "embers";

const PRESETS: Record<ParticlePreset, ISourceOptions> = {
  sparkles: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 40 },
      color: { value: ["#FFD700", "#FFA500", "#FF8C00", "#FFFACD", "#FFF8DC"] },
      shape: { type: "star" },
      opacity: { value: { min: 0.3, max: 1 }, animation: { enable: true, speed: 1.5, sync: false } },
      size: { value: { min: 2, max: 6 }, animation: { enable: true, speed: 3, sync: false } },
      move: { enable: true, speed: 1.5, direction: "none", random: true, outModes: { default: "out" } },
      life: { duration: { sync: false, value: 4 }, count: 0 },
      rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 20 } },
    },
    interactivity: { events: {} },
  },

  snow: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 60 },
      color: { value: ["#FFFFFF", "#E0F2FE", "#BAE6FD"] },
      shape: { type: ["circle", "star"] },
      opacity: { value: { min: 0.4, max: 0.9 } },
      size: { value: { min: 3, max: 8 } },
      move: {
        enable: true,
        speed: 1.2,
        direction: "bottom",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    interactivity: { events: {} },
  },

  "confetti-rain": {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 50 },
      color: { value: ["#FF0080", "#00BFFF", "#FFD700", "#00FF7F", "#FF4500", "#9400D3", "#FF69B4"] },
      shape: { type: ["square", "circle"] },
      opacity: { value: { min: 0.6, max: 1 } },
      size: { value: { min: 5, max: 10 } },
      move: {
        enable: true,
        speed: 4,
        direction: "bottom",
        random: true,
        outModes: { default: "out" },
      },
      rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 30 } },
    },
    interactivity: { events: {} },
  },

  fireworks: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 0 },
      color: { value: ["#FF4500", "#FFD700", "#FF69B4", "#00BFFF", "#7FFF00", "#FF00FF"] },
      shape: { type: "circle" },
      opacity: { value: 1, animation: { enable: true, speed: 0.8, sync: false, startValue: "max", destroy: "min" } },
      size: {
        value: { min: 1, max: 4 },
        animation: { enable: true, speed: 5, sync: false, startValue: "min", destroy: "max" },
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: true,
        outModes: { default: "destroy" },
        decay: 0.05,
      },
      life: { duration: { sync: true, value: 0.5 }, count: 1 },
    },
    emitters: {
      direction: "top",
      rate: { delay: 0.3, quantity: 20 },
      position: { x: 50, y: 80 },
      size: { width: 100, height: 0 },
    },
    interactivity: { events: {} },
  },

  petals: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 30 },
      color: { value: ["#FF6EB4", "#FF69B4", "#FFB6C1", "#FFC0CB", "#FF1493", "#FF85B3"] },
      shape: { type: "circle" },
      opacity: { value: { min: 0.4, max: 0.9 } },
      size: { value: { min: 6, max: 14 } },
      move: {
        enable: true,
        speed: 1,
        direction: "bottom",
        random: true,
        outModes: { default: "out" },
        drift: 1,
      },
      rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 10, sync: false } },
    },
    interactivity: { events: {} },
  },

  hearts: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 25 },
      color: { value: ["#FF0000", "#FF1493", "#FF69B4", "#FF6347", "#FF4500"] },
      shape: { type: "heart" },
      opacity: { value: { min: 0.5, max: 1 }, animation: { enable: true, speed: 1, sync: false } },
      size: { value: { min: 8, max: 18 } },
      move: {
        enable: true,
        speed: 1.5,
        direction: "bottom",
        random: true,
        outModes: { default: "out" },
      },
    },
    interactivity: { events: {} },
  },

  stars: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 55 },
      color: { value: ["#FFFFFF", "#FFD700", "#FFA500", "#E0F2FE", "#C7D2FE"] },
      shape: { type: "star" },
      opacity: { value: { min: 0.2, max: 1 }, animation: { enable: true, speed: 2, sync: false } },
      size: { value: { min: 2, max: 5 } },
      move: { enable: true, speed: 0.5, direction: "none", random: true, outModes: { default: "out" } },
      rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 15 } },
    },
    interactivity: { events: {} },
  },

  embers: {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 35 },
      color: { value: ["#FF4500", "#FF8C00", "#FFD700", "#FF6347", "#FFA500"] },
      shape: { type: "circle" },
      opacity: { value: { min: 0.3, max: 1 }, animation: { enable: true, speed: 2, sync: false } },
      size: { value: { min: 2, max: 5 } },
      move: {
        enable: true,
        speed: 2,
        direction: "top",
        random: true,
        outModes: { default: "out" },
      },
      life: { duration: { sync: false, value: 3 }, count: 0 },
    },
    interactivity: { events: {} },
  },
};

interface ParticleCanvasProps {
  preset: ParticlePreset;
  id: string;
}

let engineInitialized = false;

export function ParticleCanvas({ preset, id }: ParticleCanvasProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (engineInitialized) {
      setReady(true);
      return;
    }
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      engineInitialized = true;
      setReady(true);
    });
  }, []);

  const options = useCallback(() => PRESETS[preset], [preset]);

  if (!ready) return null;

  return <Particles id={id} options={options()} className="pointer-events-none absolute inset-0" />;
}
