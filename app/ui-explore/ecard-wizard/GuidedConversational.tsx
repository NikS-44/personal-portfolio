"use client";

/**
 * Variant 3 — GuidedConversational
 * Friendly "assistant" style — shows one card at a time. Two big YES/NO
 * buttons swipe through options. Auto-advances after YES with a celebration.
 * Perfect for elderly users who feel overwhelmed by lots of choices.
 */

import { useState, useMemo } from "react";
import { CATEGORIES } from "../../ecard/_data/categories";
import type { CardCategoryId } from "../../ecard/_data/types";
import { ALWAYS_POPULAR, getUpcomingHolidays } from "../../ecard/_data/suggestions";

export function GuidedConversational() {
  const upcoming = useMemo(() => getUpcomingHolidays(new Date(), 45), []);

  const orderedIds = useMemo<CardCategoryId[]>(() => {
    const upcomingIds = upcoming.map((e) => e.categoryId);
    const popularIds = ALWAYS_POPULAR;
    const rest = CATEGORIES.filter((c) => !upcomingIds.includes(c.id) && !popularIds.includes(c.id)).map((c) => c.id);
    return [...upcomingIds, ...popularIds, ...rest] as CardCategoryId[];
  }, [upcoming]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<CardCategoryId | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const currentId = orderedIds[index];
  const current = CATEGORIES.find((c) => c.id === currentId);

  function handleYes() {
    if (!current) return;
    setCelebrating(true);
    setChosen(current.id);
    setTimeout(() => setCelebrating(false), 1200);
  }

  function handleNo() {
    if (index < orderedIds.length - 1) {
      setIndex((i) => i + 1);
    }
  }

  function handleRestart() {
    setIndex(0);
    setChosen(null);
  }

  if (chosen) {
    const cat = CATEGORIES.find((c) => c.id === chosen)!;
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-8 text-center">
        <div className={`transition-transform duration-700 ${celebrating ? "scale-125" : "scale-100"}`}>
          <span className="text-9xl">{cat.emoji}</span>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-gray-900">Perfect! 🎉</p>
          <p className="mt-2 text-xl text-gray-600">Creating a {cat.label} card for you…</p>
        </div>
        <button
          type="button"
          className="h-16 rounded-2xl bg-rose-500 px-12 text-xl font-bold text-white shadow-lg transition hover:bg-rose-600"
        >
          Let&apos;s make it beautiful →
        </button>
        <button type="button" onClick={handleRestart} className="text-base text-gray-400 underline">
          Choose a different occasion
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-3xl font-bold text-gray-700">You&apos;ve seen all occasions!</p>
        <button
          type="button"
          onClick={handleRestart}
          className="h-14 rounded-2xl bg-rose-500 px-10 text-xl font-bold text-white"
        >
          Start over
        </button>
      </div>
    );
  }

  const upcomingEntry = upcoming.find((e) => e.categoryId === current.id);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 text-center">
      {/* Progress dots */}
      <div className="flex gap-1.5">
        {orderedIds.slice(0, Math.min(orderedIds.length, 12)).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i < index ? "bg-rose-400" : i === index ? "bg-rose-600" : "bg-gray-200"}`}
          />
        ))}
        {orderedIds.length > 12 && <span className="text-xs text-gray-400">…</span>}
      </div>

      {/* Question */}
      <p className="text-2xl font-semibold text-gray-600">Are you sending a card for…</p>

      {/* Card */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-gray-200 bg-white px-12 py-10 shadow-xl">
        <span className="text-9xl">{current.emoji}</span>
        <p className="text-4xl font-extrabold text-gray-900">{current.label}</p>
        {upcomingEntry && (
          <span className="rounded-full bg-amber-100 px-4 py-1 text-lg font-semibold text-amber-800">
            {upcomingEntry.daysAway === 0
              ? "Today! 🎉"
              : upcomingEntry.daysAway === 1
                ? "Tomorrow!"
                : `Coming in ${upcomingEntry.daysAway} days`}
          </span>
        )}
      </div>

      {/* YES / NO buttons */}
      <div className="flex gap-6">
        <button
          type="button"
          onClick={handleNo}
          className="flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-gray-300 bg-white text-2xl font-bold text-gray-500 shadow transition hover:bg-gray-50 active:scale-95"
        >
          <span>😐</span>
          <span className="text-xl">Nope</span>
        </button>
        <button
          type="button"
          onClick={handleYes}
          className="flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-2xl bg-rose-500 text-2xl font-bold text-white shadow-lg transition hover:bg-rose-600 active:scale-95"
        >
          <span>✅</span>
          <span className="text-xl">Yes!</span>
        </button>
      </div>

      <p className="text-base text-gray-400">
        {index + 1} of {orderedIds.length} occasions
      </p>
    </div>
  );
}
