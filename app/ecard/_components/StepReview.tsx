"use client";

import { useRef, useState } from "react";
import type { CardState } from "../_data/types";
import { CATEGORIES } from "../_data/categories";
import { ECardCanvas } from "./ECardCanvas";
import { ShareSheet } from "./ShareSheet";
import { CelebrationEffect } from "./CelebrationEffect";

interface StepReviewProps {
  state: CardState;
  onSuccess: () => void;
}

export function StepReview({ state, onSuccess }: StepReviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const category = CATEGORIES.find((c) => c.id === state.t.split("-").slice(0, -1).join("-"));
  const celebrationPreset = state.a ?? category?.defaultCelebration ?? "confetti";
  const celebrationActive = celebrationPreset !== "none";

  function handleSuccess() {
    onSuccess();
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <span className="text-8xl">🎉</span>
        <h2 className="text-3xl font-bold text-gray-800">Card sent!</h2>
        <p className="text-xl text-gray-500">Your eCard is on its way to someone special.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 flex h-14 items-center justify-center gap-3 rounded-2xl bg-rose-500 px-10 text-xl font-semibold text-white shadow-md transition hover:bg-rose-600"
        >
          💌 Make another card
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Your card is ready! 🎉</h2>
        <p className="text-lg text-gray-500">Share it with someone special.</p>
      </div>

      <CelebrationEffect active={celebrationActive} preset={celebrationPreset} colors={category?.confettiColors} />

      <ECardCanvas ref={canvasRef} state={state} className="w-full shadow-xl" />

      <ShareSheet state={state} canvasRef={canvasRef} onSuccess={handleSuccess} />

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 min-h-[44px] text-center text-base text-gray-500 underline underline-offset-2 hover:text-gray-700"
      >
        Start over / make a different card
      </button>
    </div>
  );
}
