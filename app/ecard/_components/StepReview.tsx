"use client";

import { useRef } from "react";
import type { CardState } from "../_data/types";
import { CATEGORIES } from "../_data/categories";
import { ECardCanvas } from "./ECardCanvas";
import { ShareSheet } from "./ShareSheet";
import { ConfettiBurst } from "./ConfettiBurst";

interface StepReviewProps {
  state: CardState;
  onSuccess: () => void;
}

export function StepReview({ state, onSuccess }: StepReviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const category = CATEGORIES.find((c) => c.id === state.t.split("-").slice(0, -1).join("-"));
  const allowConfetti = category?.allowConfetti ?? false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Your card is ready!</h2>
        <p className="text-lg text-gray-500">Download it or copy a link to share.</p>
      </div>

      <ConfettiBurst active={allowConfetti} />

      <ECardCanvas ref={canvasRef} state={state} className="w-full shadow-xl" />

      <p className="text-center text-sm text-gray-400">Preview may vary slightly from downloaded image</p>

      <ShareSheet state={state} canvasRef={canvasRef} onSuccess={onSuccess} />
    </div>
  );
}
