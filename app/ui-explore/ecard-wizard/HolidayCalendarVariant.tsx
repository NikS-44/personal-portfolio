"use client";

/**
 * Variant 2 — HolidayCalendarVariant
 * "What's coming up?" — a visual calendar-style grid of holidays sorted
 * by proximity to today. Perfect for date-aware auto-selection.
 */

import { useState, useMemo } from "react";
import { CATEGORIES } from "../../ecard/_data/categories";
import type { CardCategoryId } from "../../ecard/_data/types";
import { HOLIDAY_CALENDAR, ALWAYS_POPULAR, getUpcomingHolidays } from "../../ecard/_data/suggestions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function HolidayCalendarVariant() {
  const [selected, setSelected] = useState<CardCategoryId | null>(null);

  const upcoming = useMemo(() => getUpcomingHolidays(new Date(), 90), []);
  const farFuture = useMemo(() => getUpcomingHolidays(new Date(), 365).filter((e) => e.daysAway > 90), []);

  const popularCats = CATEGORIES.filter((c) => ALWAYS_POPULAR.includes(c.id));

  function urgencyColor(days: number) {
    if (days === 0) return "bg-rose-500 text-white";
    if (days <= 3) return "bg-rose-400 text-white";
    if (days <= 14) return "bg-amber-400 text-white";
    if (days <= 30) return "bg-yellow-300 text-yellow-900";
    return "bg-green-100 text-green-800";
  }

  function dayLabel(days: number) {
    if (days === 0) return "TODAY";
    if (days === 1) return "TMR";
    if (days <= 7) return `${days}d`;
    if (days <= 30) return `${Math.ceil(days / 7)}w`;
    return MONTHS[new Date(Date.now() + days * 86400000).getMonth()];
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">What holiday is coming? 📅</h1>
        <p className="mt-2 text-xl text-gray-500">We&apos;ll suggest the perfect card for the moment</p>
      </div>

      {/* Upcoming timeline */}
      <h2 className="mb-4 text-xl font-bold text-gray-700">Next 90 days</h2>
      <div className="mb-8 flex flex-col gap-3">
        {upcoming.map((entry) => {
          const cat = CATEGORIES.find((c) => c.id === entry.categoryId);
          if (!cat) return null;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelected(cat.id)}
              className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition ${
                selected === cat.id
                  ? "border-rose-400 bg-rose-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-rose-200"
              }`}
            >
              {/* Days-away badge */}
              <span
                className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-sm font-extrabold ${urgencyColor(entry.daysAway)}`}
              >
                {dayLabel(entry.daysAway)}
              </span>
              <span className="text-4xl">{cat.emoji}</span>
              <span>
                <span className="block text-xl font-bold text-gray-900">{cat.label}</span>
                <span className="block text-sm text-gray-500">
                  {entry.daysAway === 0
                    ? "Today — send a card now!"
                    : entry.daysAway === 1
                      ? "Tomorrow — don't forget!"
                      : `in ${entry.daysAway} days`}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Further out */}
      {farFuture.length > 0 && (
        <>
          <h2 className="mb-4 text-xl font-bold text-gray-500">Later this year</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {farFuture.slice(0, 12).map((entry) => {
              const cat = CATEGORIES.find((c) => c.id === entry.categoryId);
              if (!cat) return null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelected(cat.id)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${
                    selected === cat.id
                      ? "border-rose-400 bg-rose-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Always-popular row */}
      <h2 className="mb-4 text-xl font-bold text-gray-700">⭐ No occasion needed</h2>
      <div className="mb-8 flex flex-wrap gap-3">
        {popularCats.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelected(cat.id)}
            className={`flex items-center gap-2 rounded-2xl border-2 px-5 py-4 transition ${
              selected === cat.id
                ? "border-rose-400 bg-rose-50 shadow-md"
                : "border-gray-200 bg-white hover:border-rose-200"
            }`}
          >
            <span className="text-4xl">{cat.emoji}</span>
            <span className="text-lg font-semibold text-gray-800">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Non-holiday categories */}
      <details className="mb-8">
        <summary className="cursor-pointer rounded-xl border-2 border-gray-200 px-5 py-4 text-lg font-bold text-gray-600 hover:bg-gray-50">
          🗂️ All other occasions ({HOLIDAY_CALENDAR.length} more…)
        </summary>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.filter(
            (c) => !ALWAYS_POPULAR.includes(c.id) && !HOLIDAY_CALENDAR.find((h) => h.categoryId === c.id),
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelected(cat.id)}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${
                selected === cat.id ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </details>

      {selected && (
        <div className="flex justify-center">
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
