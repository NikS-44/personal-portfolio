"use client";

/**
 * Variant 4 — CardFirstVariant
 * Gallery of beautiful pre-built cards. User taps a card they love,
 * then fills in names/message. Visually led, template-first approach.
 */

import { useState, useMemo } from "react";
import { CATEGORIES } from "../../ecard/_data/categories";
import { ALL_TEMPLATES } from "../../ecard/_data/templates";
import { THEMES } from "../../ecard/_data/themes";
import type { CardCategoryId } from "../../ecard/_data/types";
import { ALWAYS_POPULAR, getUpcomingHolidays } from "../../ecard/_data/suggestions";

const PREVIEW_MOCK = { v: 1 as const, r: "Priya", s: "Mom", m: "Wishing you love and joy!", e: "✨", t: "" };

function MiniCardPreview({ templateId }: { templateId: string }) {
  const template = ALL_TEMPLATES.find((t) => t.id === templateId);
  const theme = THEMES.find((th) => th.id === template?.themeId) ?? THEMES[0];
  if (!template) return null;

  return (
    <div
      className={`flex h-32 w-full flex-col items-center justify-center gap-1 rounded-xl text-center ${theme.bg} overflow-hidden`}
    >
      <span className="text-3xl">{PREVIEW_MOCK.e}</span>
      <p className={`text-xs font-bold ${theme.text}`}>{template.name}</p>
      <p className={`text-xs ${theme.accent}`}>{template.categoryId}</p>
    </div>
  );
}

export function CardFirstVariant() {
  const [categoryFilter, setCategoryFilter] = useState<CardCategoryId | "all">("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const upcoming = useMemo(() => getUpcomingHolidays(new Date(), 45), []);
  const suggestedCats = useMemo<CardCategoryId[]>(() => {
    return [...upcoming.map((e) => e.categoryId), ...ALWAYS_POPULAR] as CardCategoryId[];
  }, [upcoming]);

  const filterCats = useMemo(() => {
    return [
      { id: "all" as const, label: "✨ All", emoji: "✨" },
      ...(suggestedCats
        .slice(0, 10)
        .map((id) => CATEGORIES.find((c) => c.id === id))
        .filter(Boolean) as typeof CATEGORIES),
    ];
  }, [suggestedCats]);

  const visibleTemplates = useMemo(() => {
    if (categoryFilter === "all") {
      // Show a curated selection: first template from each suggested category
      return suggestedCats.slice(0, 20).flatMap((id) => ALL_TEMPLATES.filter((t) => t.categoryId === id).slice(0, 2));
    }
    return ALL_TEMPLATES.filter((t) => t.categoryId === categoryFilter);
  }, [categoryFilter, suggestedCats]);

  const selected = selectedTemplateId ? ALL_TEMPLATES.find((t) => t.id === selectedTemplateId) : null;
  const selectedCat = selected ? CATEGORIES.find((c) => c.id === selected.categoryId) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Pick a card you love 💌</h1>
        <p className="mt-2 text-xl text-gray-500">We&apos;ll fill in the details together</p>
      </div>

      {/* Category filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterCats.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoryFilter(cat.id as CardCategoryId | "all")}
            className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-base font-semibold transition ${
              categoryFilter === cat.id
                ? "border-rose-400 bg-rose-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Card gallery */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visibleTemplates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTemplateId(t.id)}
            className={`overflow-hidden rounded-2xl border-2 transition ${
              selectedTemplateId === t.id
                ? "border-rose-500 shadow-xl ring-2 ring-rose-200"
                : "border-gray-200 hover:border-rose-200 hover:shadow-md"
            }`}
          >
            <MiniCardPreview templateId={t.id} />
          </button>
        ))}
      </div>

      {/* Selected card CTA */}
      {selected && selectedCat && (
        <div className="rounded-2xl bg-rose-50 p-6 ring-2 ring-rose-200">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-5xl">{selectedCat.emoji}</span>
            <div>
              <p className="text-xl font-extrabold text-gray-900">{selected.name}</p>
              <p className="text-base text-gray-500">{selectedCat.label}</p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-rose-500 text-xl font-bold text-white shadow-md transition hover:bg-rose-600"
          >
            Personalize this card →
          </button>
        </div>
      )}
    </div>
  );
}
