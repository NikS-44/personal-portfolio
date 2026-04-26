"use client";

import { EmojiPicker } from "./EmojiPicker";
import { ColorPicker } from "./ColorPicker";
import type { CardState } from "../_data/types";

interface StepPersonalizeProps {
  state: Partial<CardState>;
  onChange: (updates: Partial<CardState>) => void;
}

export function StepPersonalize({ state, onChange }: StepPersonalizeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Personalize your card</h2>
        <p className="text-lg text-gray-500">Add names and a message — keep it short and sweet!</p>
      </div>

      <fieldset className="flex flex-col gap-5">
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

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold text-gray-700">Pick an emoji</p>
          <EmojiPicker value={state.e ?? "✨"} onChange={(e) => onChange({ e })} />
        </div>

        <ColorPicker value={state.c ?? ""} onChange={(c) => onChange({ c })} />
      </fieldset>
    </div>
  );
}
