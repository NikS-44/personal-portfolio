"use client";

// UI EXPLORE: remove before ship
import { useState } from "react";
import { AlwaysVisibleVariant } from "./AlwaysVisibleVariant";
import { CurrentBaselineVariant } from "./CurrentBaselineVariant";
import { DenseToolbarVariant } from "./DenseToolbarVariant";
import { PopoverPriorityVariant } from "./PopoverPriorityVariant";
import { SegmentedPriorityVariant } from "./SegmentedPriorityVariant";

const VARIANTS = [
  {
    id: "baseline",
    label: "1 · Current",
    description: "Hover-reveal actions + native/base-select priority (shipping feel)",
  },
  {
    id: "always-visible",
    label: "2 · Always visible",
    description: "Checkbox + expand always on; static SVG caret on priority; Delete as text",
  },
  {
    id: "segmented",
    label: "3 · Segmented P",
    description: "P0–P3 chip group — no dropdown caret; expand is a real button",
  },
  {
    id: "popover",
    label: "4 · Popover P",
    description: "Owned SVG caret on priority menu; labeled Details/Hide + caret",
  },
  {
    id: "dense",
    label: "5 · Dense row",
    description: "Linear-style single row: check · title · P · expand; details below",
  },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

export default function PlanCardControlsExplorePage() {
  const [active, setActive] = useState<VariantId>("baseline");

  return (
    <div className="flex min-h-dvh flex-col bg-stone-50">
      <div className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-stone-400">
          UI Explore · Plan card controls
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                active === v.id ? "bg-stone-800 text-white shadow" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-center text-xs text-stone-500">
          {VARIANTS.find((v) => v.id === active)?.description}
        </p>
        <p className="mt-1 text-center text-[11px] text-stone-400">
          Accordion caret: up when collapsed, down when open · Pick a priority pattern you like
        </p>
      </div>

      <div className="flex-1">
        {active === "baseline" && <CurrentBaselineVariant />}
        {active === "always-visible" && <AlwaysVisibleVariant />}
        {active === "segmented" && <SegmentedPriorityVariant />}
        {active === "popover" && <PopoverPriorityVariant />}
        {active === "dense" && <DenseToolbarVariant />}
      </div>
    </div>
  );
}
