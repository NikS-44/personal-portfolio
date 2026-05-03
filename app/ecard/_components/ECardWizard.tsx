"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CardCategoryId, CardState } from "../_data/types";
import { CATEGORIES } from "../_data/categories";
import { templatesByCategory } from "../_data/templates/index";
import { WizardStepper } from "./WizardStepper";
import { StepCategory } from "./StepCategory";
import { StepTemplate } from "./StepTemplate";
import { StepPersonalize } from "./StepPersonalize";
import { StepReview } from "./StepReview";

type WizardStep = "category" | "template" | "personalize" | "review";

const DRAFT_KEY = "ecard:draft:v1";
const INITIAL_EMOJI = "✨";

export function ECardWizard() {
  const [step, setStep] = useState<WizardStep>("category");
  const [cardState, setCardState] = useState<Partial<CardState>>({ v: 1, e: INITIAL_EMOJI });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CardState>;
        if (parsed && typeof parsed === "object") setCardState(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(cardState));
    } catch {
      // ignore
    }
  }, [cardState]);

  function update(updates: Partial<CardState>) {
    setCardState((prev) => ({ ...prev, ...updates }));
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }

  const [direction, setDirection] = useState(1);

  const categoryId = cardState.t ? (cardState.t.split("-").slice(0, -1).join("-") as CardCategoryId) : undefined;

  const category = categoryId ? CATEGORIES.find((c) => c.id === categoryId) : undefined;

  function canAdvance(): boolean {
    if (step === "category") return !!cardState.t || !!categoryId;
    if (step === "template") return !!cardState.t;
    if (step === "personalize") return !!cardState.r?.trim() && !!cardState.s?.trim();
    return false;
  }

  function handleCategoryChange(id: CardCategoryId) {
    const templates = templatesByCategory[id];
    // Limit random pick to the top 4 "visible" templates so the selection ring
    // always appears in the default grid view (no confusing invisible selection).
    const TOP_VISIBLE = 4;
    const pickPool = templates?.slice(0, TOP_VISIBLE) ?? [];
    const idx = pickPool.length ? Math.floor(Math.random() * pickPool.length) : 0;
    const cat = CATEGORIES.find((c) => c.id === id);
    update({
      t: pickPool?.[idx]?.id,
      // Prefill message with first suggestion if user hasn't typed one yet
      ...(cardState.m ? {} : { m: cat?.sampleMessages?.[0] ?? "" }),
      // Set the default celebration for this category
      a: cat?.defaultCelebration,
    });
    setDirection(1);
    setStep("template");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    setDirection(1);
    if (step === "category") setStep("template");
    else if (step === "template") setStep("personalize");
    else if (step === "personalize") setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setDirection(-1);
    if (step === "template") setStep("category");
    else if (step === "personalize") setStep("template");
    else if (step === "review") setStep("personalize");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isCompleteState = (s: Partial<CardState>): s is CardState =>
    s.v === 1 && !!s.t && !!s.r && !!s.s && s.m !== undefined && !!s.e;

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create an eCard</h1>
        <p className="mt-1 text-base text-gray-500">Send something beautiful in seconds</p>
      </div>

      <WizardStepper currentStep={step} canAdvance={canAdvance()} onBack={handleBack} onNext={handleNext} />

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {step === "category" && <StepCategory value={category?.id} onChange={handleCategoryChange} />}

            {step === "template" && categoryId && (
              <StepTemplate
                categoryId={categoryId}
                value={cardState.t}
                previewState={cardState}
                onChange={(t) => update({ t })}
              />
            )}

            {step === "personalize" && <StepPersonalize state={cardState} onChange={update} />}

            {step === "review" && isCompleteState(cardState) && <StepReview state={cardState} onSuccess={clearDraft} />}

            {step === "review" && !isCompleteState(cardState) && (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-lg text-gray-600">Please complete all required fields first.</p>
                <button
                  type="button"
                  onClick={() => setStep("personalize")}
                  className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
                >
                  Go back and fill in details
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
