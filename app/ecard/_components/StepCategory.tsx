"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "../_data/categories";
import type { CardCategoryId } from "../_data/types";
import { ALWAYS_POPULAR, getUpcomingHolidays } from "../_data/suggestions";

interface StepCategoryProps {
  value: CardCategoryId | undefined;
  onChange: (id: CardCategoryId) => void;
}

function CategoryCard({
  emoji,
  label,
  selected,
  onClick,
  badge,
}: {
  id?: CardCategoryId;
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center focus:outline-none focus:ring-2 focus:ring-rose-400 ${
        selected
          ? "border-rose-400 bg-rose-50 shadow-md"
          : "border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50"
      }`}
    >
      {badge && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
      <span className="text-5xl">{emoji}</span>
      <span className="text-base font-semibold text-gray-700">{label}</span>
    </motion.button>
  );
}

export function StepCategory({ value, onChange }: StepCategoryProps) {
  const [showAll, setShowAll] = useState(false);

  const upcoming = useMemo(() => getUpcomingHolidays(new Date(), 45), []);

  const popularCategories = useMemo(() => CATEGORIES.filter((c) => ALWAYS_POPULAR.includes(c.id)), []);

  const upcomingCategories = useMemo(() => {
    return upcoming
      .map((entry) => {
        const cat = CATEGORIES.find((c) => c.id === entry.categoryId);
        return cat ? { ...cat, daysAway: entry.daysAway, entryLabel: entry.label } : null;
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [upcoming]);

  function daysBadge(days: number) {
    if (days === 0) return "Today!";
    if (days === 1) return "Tomorrow!";
    if (days <= 7) return `${days}d away`;
    return undefined;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="mb-1 text-2xl font-bold text-gray-800">What&apos;s the occasion? 🎉</h2>
        <p className="text-lg text-gray-500">Tap an occasion to get started.</p>
      </div>

      {/* ── Coming up soon ─────────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-rose-600">📅 Coming up soon</h3>
        {upcomingCategories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {upcomingCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={value === cat.id}
                onClick={() => onChange(cat.id)}
                className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                  value === cat.id
                    ? "border-rose-400 bg-rose-50 shadow-md"
                    : "border-amber-200 bg-amber-50 hover:border-rose-300 hover:bg-rose-50"
                }`}
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="flex flex-col">
                  <span className="text-base font-bold text-gray-800">{cat.label}</span>
                  {cat.daysAway <= 45 && (
                    <span className="text-sm font-medium text-amber-700">
                      {cat.daysAway === 0 ? "Today!" : cat.daysAway === 1 ? "Tomorrow!" : `in ${cat.daysAway} days`}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-base text-amber-700">
            No major holidays in the next 45 days — but any occasion works! Pick one below.
          </p>
        )}
      </section>

      {/* ── Popular any time ───────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-700">⭐ Popular any time</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {popularCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              emoji={cat.emoji}
              label={cat.label}
              selected={value === cat.id}
              onClick={() => onChange(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* ── See all occasions ──────────────────────────────────────── */}
      <section>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mb-3 flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-lg font-bold text-gray-700 transition hover:bg-gray-50"
          aria-expanded={showAll}
        >
          <span>🗂️ See all occasions ({CATEGORIES.length})</span>
          <span className="text-gray-500">{showAll ? "▲ Less" : "▼ More"}</span>
        </button>

        {showAll && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const upcomingEntry = upcomingCategories.find((u) => u.id === cat.id);
              const badge = upcomingEntry ? daysBadge(upcomingEntry.daysAway) : undefined;
              return (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  emoji={cat.emoji}
                  label={cat.label}
                  selected={value === cat.id}
                  onClick={() => onChange(cat.id)}
                  badge={badge}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
