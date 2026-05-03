"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { templatesByCategory } from "../_data/templates/index";
import type { CardCategoryId, CardState } from "../_data/types";
import { ECardCanvas } from "./ECardCanvas";

interface StepTemplateProps {
  categoryId: CardCategoryId;
  value: string | undefined;
  previewState: Partial<CardState>;
  onChange: (templateId: string) => void;
}

export function StepTemplate({ categoryId, value, previewState, onChange }: StepTemplateProps) {
  const templates = templatesByCategory[categoryId] ?? [];
  const [showAll, setShowAll] = useState(false);

  // Show just 4 top picks initially — much less overwhelming for first-time / elderly users
  const TOP_COUNT = 4;
  const topPicks = templates.slice(0, TOP_COUNT);
  const remaining = templates.slice(TOP_COUNT);
  const visibleTemplates = showAll ? templates : topPicks;

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-gray-800">Choose a design</h2>
      <p className="mb-5 text-lg text-gray-500">Pick a style you love — tap to select.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visibleTemplates.map((tmpl) => (
          <motion.button
            key={tmpl.id}
            type="button"
            aria-label={tmpl.name}
            aria-pressed={value === tmpl.id}
            onClick={() => onChange(tmpl.id)}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group flex flex-col gap-2 rounded-2xl border-2 p-2 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
              value === tmpl.id ? "border-rose-400 shadow-md" : "border-gray-200"
            }`}
          >
            <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 origin-top-left scale-[0.38]" style={{ width: "263%", height: "263%" }}>
                <ECardCanvas state={{ ...previewState, t: tmpl.id }} className="h-full w-full" preview={true} />
              </div>
            </div>
            <span className="truncate px-1 text-sm font-medium text-gray-700" title={tmpl.name}>
              {tmpl.name}
            </span>
          </motion.button>
        ))}
      </div>

      {remaining.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-5 w-full rounded-xl border-2 border-gray-200 py-3 text-base font-semibold text-gray-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        >
          {showAll ? "▲ Show fewer designs" : `▼ See all ${templates.length} designs`}
        </button>
      )}
    </div>
  );
}
