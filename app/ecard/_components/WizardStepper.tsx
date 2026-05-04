"use client";

type WizardStep = "category" | "template" | "personalize" | "review";

const STEPS: { id: WizardStep; label: string; hint: string }[] = [
  { id: "category", label: "Occasion", hint: "Tap an occasion below to continue 👇" },
  { id: "template", label: "Design", hint: "Tap a card design below to select it 👇" },
  { id: "personalize", label: "Personalize", hint: "Fill in your name and recipient's name below 👇" },
  { id: "review", label: "Share", hint: "" },
];

interface WizardStepperProps {
  currentStep: WizardStep;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardStepper({ currentStep, canAdvance, onBack, onNext }: WizardStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STEPS.length - 1;
  const currentHint = STEPS[currentIndex].hint;

  return (
    <div className="flex flex-col gap-4">
      {/* "Step X of Y" label — large and easy to read */}
      <p className="text-center text-lg font-semibold text-gray-500">
        Step {currentIndex + 1} of {STEPS.length} — <span className="text-rose-600">{STEPS[currentIndex].label}</span>
      </p>

      <nav aria-label="Card creation steps">
        <ol className="flex list-none flex-col gap-1.5 p-0">
          {/* Circles + connectors: one flex-1 segment between each pair so spacing is even */}
          <li className="flex w-full items-center">
            {STEPS.map((step, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              // Single segment between (i-1) and i; rose once we've reached step i
              const segmentBeforeRose = i > 0 && currentIndex >= i;
              return (
                <div key={step.id} className="contents">
                  {i > 0 && (
                    <div
                      className={`h-1 min-w-0 flex-1 rounded-full ${segmentBeforeRose ? "bg-rose-400" : "bg-gray-200"}`}
                      aria-hidden
                    />
                  )}
                  <div
                    aria-current={active ? "step" : undefined}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold transition ${
                      done
                        ? "bg-rose-500 text-white"
                        : active
                          ? "bg-rose-500 text-white ring-4 ring-rose-100"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                </div>
              );
            })}
          </li>
          {/* Labels: same flex weights as row above (flex-1 under each connector, minimal under dots) */}
          <li className="flex w-full items-start justify-center gap-0">
            {STEPS.map((step, i) => {
              const active = i === currentIndex;
              return (
                <div key={`${step.id}-label`} className="contents">
                  {i > 0 && <div className="min-w-0 flex-1" aria-hidden />}
                  <div className="flex w-10 shrink-0 justify-center">
                    <span
                      className={`max-w-[7.5rem] text-center text-sm font-medium leading-tight ${active ? "text-rose-600" : "text-gray-500"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </li>
        </ol>
      </nav>

      <div className={`flex flex-col gap-2 ${isFirst ? "items-end" : ""}`}>
        {/* Hint appears above the Next button so users see WHY it's disabled before tapping */}
        {!isLast && !canAdvance && currentHint && (
          <p className="text-right text-sm font-medium text-amber-700">{currentHint}</p>
        )}
        <div className={`flex w-full ${isFirst ? "justify-end" : "justify-between"}`}>
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-14 items-center gap-2 rounded-xl border-2 border-gray-200 px-6 text-lg font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={onNext}
              disabled={!canAdvance}
              aria-disabled={!canAdvance}
              className="flex h-14 items-center gap-2 rounded-xl bg-rose-500 px-8 text-lg font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
