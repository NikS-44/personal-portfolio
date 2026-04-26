"use client";

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

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Choose a design</h2>
      <p className="mb-6 text-lg text-gray-500">Pick a style you love — {templates.length} options below.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {templates.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            aria-label={tmpl.name}
            aria-pressed={value === tmpl.id}
            onClick={() => onChange(tmpl.id)}
            className={`group flex flex-col gap-2 rounded-2xl border-2 p-2 transition focus:outline-none focus:ring-2 focus:ring-rose-400 ${
              value === tmpl.id ? "border-rose-400 shadow-md" : "border-gray-200 hover:border-rose-200"
            }`}
          >
            <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 origin-top-left scale-[0.38]" style={{ width: "263%", height: "263%" }}>
                <ECardCanvas state={{ ...previewState, t: tmpl.id }} className="h-full w-full" />
              </div>
            </div>
            <span className="truncate px-1 text-sm font-medium text-gray-700">{tmpl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
