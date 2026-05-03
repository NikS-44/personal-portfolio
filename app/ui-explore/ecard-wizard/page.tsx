"use client";

import { useState } from "react";
import { LargeButtonWizard } from "./LargeButtonWizard";
import { HolidayCalendarVariant } from "./HolidayCalendarVariant";
import { GuidedConversational } from "./GuidedConversational";
import { CardFirstVariant } from "./CardFirstVariant";

const VARIANTS = [
  { id: "large-button", label: "1 · Large Button", description: "Current wizard — large tiles, high-contrast" },
  { id: "holiday-calendar", label: "2 · Holiday Calendar", description: '"What\'s coming up?" — date-aware grid' },
  { id: "guided", label: "3 · Guided Conversation", description: "One question at a time — minimal fatigue" },
  { id: "card-first", label: "4 · Card First", description: "Gallery of beautiful cards — template-first" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

export default function UIExplorePage() {
  const [active, setActive] = useState<VariantId>("large-button");

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          UI Explore · eCard Wizard
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                active === v.id ? "bg-rose-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-center text-xs text-gray-400">{VARIANTS.find((v) => v.id === active)?.description}</p>
      </div>

      {/* Variant content */}
      <div className="flex-1">
        {active === "large-button" && <LargeButtonWizard />}
        {active === "holiday-calendar" && <HolidayCalendarVariant />}
        {active === "guided" && <GuidedConversational />}
        {active === "card-first" && <CardFirstVariant />}
      </div>
    </div>
  );
}
