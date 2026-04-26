"use client";

import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { EMOJI_GROUPS } from "../_data/emoji";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [activeGroup, setActiveGroup] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const group = EMOJI_GROUPS[activeGroup];
  const emojis = group.emoji;

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    const cols = 5;
    const total = emojis.length;
    let next = idx;
    if (e.key === "ArrowRight") next = Math.min(idx + 1, total - 1);
    else if (e.key === "ArrowLeft") next = Math.max(idx - 1, 0);
    else if (e.key === "ArrowDown") next = Math.min(idx + cols, total - 1);
    else if (e.key === "ArrowUp") next = Math.max(idx - cols, 0);
    else if (e.key === "Enter") {
      onChange(emojis[idx]);
      return;
    } else return;
    e.preventDefault();
    const btn = gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-emoji-btn]")[next];
    btn?.focus();
  }

  useEffect(() => {
    gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-emoji-btn]")[0]?.focus();
  }, [activeGroup]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
        {EMOJI_GROUPS.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setActiveGroup(i)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              i === activeGroup ? "bg-rose-100 text-rose-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div ref={gridRef} role="grid" className="grid grid-cols-5 gap-1" aria-label="Emoji picker">
        {emojis.map((emoji, idx) => (
          <div key={emoji} role="row">
            <button
              type="button"
              data-emoji-btn
              role="gridcell"
              aria-label={emoji}
              tabIndex={idx === 0 ? 0 : -1}
              onClick={() => onChange(emoji)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex h-10 w-full items-center justify-center rounded-lg text-2xl transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                value === emoji ? "bg-rose-100 ring-2 ring-rose-400" : ""
              }`}
            >
              {emoji}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
