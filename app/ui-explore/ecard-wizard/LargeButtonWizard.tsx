"use client";

/**
 * Variant 1 — LargeButtonWizard
 * The current flow restyled: 120px+ tiles, text-xl labels, high-contrast
 * rose/saffron palette, "Coming up soon" banner at top.
 */

import { useState, useMemo } from "react";
import { CATEGORIES } from "../../ecard/_data/categories";
import type { CardCategoryId } from "../../ecard/_data/types";
import { ALWAYS_POPULAR, getUpcomingHolidays } from "../../ecard/_data/suggestions";

export function LargeButtonWizard() {
  const [selected, setSelected] = useState<CardCategoryId | null>(null);
  const [showAll, setShowAll] = useState(false);

  const upcoming = useMemo(() => getUpcomingHolidays(new Date(), 45), []);
  const upcomingCats = useMemo(
    () =>
      upcoming
        .map((e) => {
          const cat = CATEGORIES.find((c) => c.id === e.categoryId);
          return cat ? { ...cat, daysAway: e.daysAway } : null;
        })
        .filter(Boolean) as Array<(typeof CATEGORIES)[0] & { daysAway: number }>,
    [upcoming],
  );

  const popularCats = CATEGORIES.filter((c) => ALWAYS_POPULAR.includes(c.id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Send an eCard 💌</h1>
        <p className="mt-2 text-xl text-gray-500">Tap an occasion to get started</p>
      </div>

      {/* Coming up soon */}
      {upcomingCats.length > 0 && (
        <div className="mb-8 rounded-2xl bg-amber-50 p-5 ring-2 ring-amber-200">
          <h2 className="mb-4 text-xl font-bold text-amber-800">📅 Coming up soon</h2>
          <div className="flex flex-wrap gap-3">
            {upcomingCats.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelected(cat.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left transition ${
                  selected === cat.id
                    ? "border-rose-400 bg-rose-50 shadow-md"
                    : "border-amber-300 bg-white hover:border-rose-300"
                }`}
              >
                <span className="text-5xl">{cat.emoji}</span>
                <span>
                  <span className="block text-xl font-bold text-gray-900">{cat.label}</span>
                  <span className="block text-base text-amber-700">
                    {cat.daysAway === 0 ? "Today!" : cat.daysAway === 1 ? "Tomorrow!" : `in ${cat.daysAway} days`}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular always */}
      <h2 className="mb-4 text-xl font-bold text-gray-700">⭐ Popular any time</h2>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {popularCats.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelected(cat.id)}
            className={`flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-2xl border-2 transition ${
              selected === cat.id
                ? "border-rose-400 bg-rose-50 shadow-md"
                : "border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50"
            }`}
          >
            <span className="text-5xl">{cat.emoji}</span>
            <span className="text-lg font-bold text-gray-700">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* See all collapsible */}
      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="mb-4 w-full rounded-xl border-2 border-gray-200 py-4 text-lg font-bold text-gray-600 transition hover:bg-gray-50"
      >
        {showAll ? "▲ Show fewer occasions" : `▼ See all ${CATEGORIES.length} occasions`}
      </button>
      {showAll && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelected(cat.id)}
              className={`flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-2xl border-2 transition ${
                selected === cat.id
                  ? "border-rose-400 bg-rose-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50"
              }`}
            >
              <span className="text-5xl">{cat.emoji}</span>
              <span className="text-lg font-bold text-gray-700">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="flex h-16 items-center gap-3 rounded-2xl bg-rose-500 px-10 text-xl font-bold text-white shadow-lg transition hover:bg-rose-600"
          >
            Create {CATEGORIES.find((c) => c.id === selected)?.label} card →
          </button>
        </div>
      )}
    </div>
  );
}
