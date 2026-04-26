"use client";

import { CATEGORIES } from "../_data/categories";
import type { CardCategoryId } from "../_data/types";

interface StepCategoryProps {
  value: CardCategoryId | undefined;
  onChange: (id: CardCategoryId) => void;
}

export function StepCategory({ value, onChange }: StepCategoryProps) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">What&apos;s the occasion?</h2>
      <p className="mb-6 text-lg text-gray-500">Pick a category to get started.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-label={cat.label}
            aria-pressed={value === cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition focus:outline-none focus:ring-2 focus:ring-rose-400 ${
              value === cat.id
                ? "border-rose-400 bg-rose-50 shadow-md"
                : "border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50"
            }`}
          >
            <span className="text-4xl">{cat.emoji}</span>
            <span className="text-base font-semibold text-gray-700">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
