"use client";

import { useMemo } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { ColorPicker } from "./ColorPicker";
import { CATEGORIES } from "../_data/categories";
import type { CardState, CelebrationPreset } from "../_data/types";

interface StepPersonalizeProps {
  state: Partial<CardState>;
  onChange: (updates: Partial<CardState>) => void;
}

const CELEBRATION_OPTIONS: { value: CelebrationPreset; emoji: string; label: string }[] = [
  { value: "confetti", emoji: "🎊", label: "Confetti" },
  { value: "fireworks", emoji: "🎆", label: "Fireworks" },
  { value: "hearts", emoji: "❤️", label: "Hearts" },
  { value: "sparkles", emoji: "✨", label: "Sparkles" },
  { value: "stars", emoji: "⭐", label: "Stars" },
  { value: "petals", emoji: "🌸", label: "Petals" },
  { value: "snow", emoji: "❄️", label: "Snow" },
  { value: "none", emoji: "🚫", label: "None" },
];

export function StepPersonalize({ state, onChange }: StepPersonalizeProps) {
  const categoryId = state.t ? state.t.split("-").slice(0, -1).join("-") : undefined;
  const category = useMemo(() => CATEGORIES.find((c) => c.id === categoryId), [categoryId]);

  const sampleMessages = category?.sampleMessages ?? [];
  const currentCelebration: CelebrationPreset = state.a ?? category?.defaultCelebration ?? "confetti";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Personalize your card</h2>
        <p className="text-lg text-gray-500">Add names and a message — keep it short and sweet!</p>
      </div>

      <fieldset className="flex w-full min-w-0 flex-col gap-5">
        <legend className="sr-only">Card details</legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="recipient" className="text-lg font-semibold text-gray-700">
            Who is this for? <span className="text-rose-500">*</span>
          </label>
          <input
            id="recipient"
            type="text"
            maxLength={60}
            placeholder="Their name"
            value={state.r ?? ""}
            onChange={(e) => onChange({ r: e.target.value })}
            className="h-14 rounded-xl border-2 border-gray-200 px-4 text-lg text-gray-800 placeholder-gray-400 focus:border-rose-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sender" className="text-lg font-semibold text-gray-700">
            Your name <span className="text-rose-500">*</span>
          </label>
          <input
            id="sender"
            type="text"
            maxLength={60}
            placeholder="Your name"
            value={state.s ?? ""}
            onChange={(e) => onChange({ s: e.target.value })}
            className="h-14 rounded-xl border-2 border-gray-200 px-4 text-lg text-gray-800 placeholder-gray-400 focus:border-rose-400 focus:outline-none"
          />
        </div>

        {/* ── Message ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-lg font-semibold text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            maxLength={280}
            rows={3}
            placeholder="Write something heartfelt…"
            value={state.m ?? ""}
            onChange={(e) => onChange({ m: e.target.value })}
            className="resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-lg text-gray-800 placeholder-gray-400 focus:border-rose-400 focus:outline-none"
          />
          <p className="text-right text-sm text-gray-400">{(state.m ?? "").length}/280</p>
        </div>

        {/* ── Suggested messages ──────────────────────────────── */}
        {sampleMessages.length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-700">💡 Need inspiration? Tap to use:</p>
            <div className="flex flex-col gap-2">
              {sampleMessages.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange({ m: msg })}
                  className={`rounded-lg border-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-white ${
                    state.m === msg
                      ? "border-rose-400 bg-white font-medium text-rose-700"
                      : "border-amber-200 bg-amber-50/60"
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Emoji ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold text-gray-700">Pick an emoji</p>
          <EmojiPicker value={state.e ?? "✨"} onChange={(e) => onChange({ e })} />
        </div>

        {/* ── Celebration effect ──────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold text-gray-700">🎊 Celebration effect</p>
          <p className="text-sm text-gray-500">This plays when your recipient opens the card.</p>
          <div className="grid grid-cols-4 gap-2">
            {CELEBRATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ a: opt.value })}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 text-center transition ${
                  currentCelebration === opt.value
                    ? "border-rose-400 bg-rose-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Color theme ─────────────────────────────────────── */}
        <ColorPicker value={state.c ?? ""} onChange={(c) => onChange({ c })} />
      </fieldset>
    </div>
  );
}
