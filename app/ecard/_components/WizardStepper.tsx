"use client";

type WizardStep = "category" | "template" | "personalize" | "review";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "category", label: "Occasion" },
  { id: "template", label: "Design" },
  { id: "personalize", label: "Personalize" },
  { id: "review", label: "Share" },
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

  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="Card creation steps">
        <ol className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <li key={step.id} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-center">
                  {i > 0 && <div className={`h-0.5 flex-1 ${done || active ? "bg-rose-400" : "bg-gray-200"}`} />}
                  <div
                    aria-current={active ? "step" : undefined}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                      done
                        ? "bg-rose-500 text-white"
                        : active
                          ? "bg-rose-500 text-white ring-4 ring-rose-100"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${done ? "bg-rose-400" : "bg-gray-200"}`} />}
                </div>
                <span className={`text-xs font-medium ${active ? "text-rose-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={`flex ${isFirst ? "justify-end" : "justify-between"}`}>
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 items-center gap-2 rounded-xl border-2 border-gray-200 px-5 text-base font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
          >
            ← Back
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance}
            className="flex h-12 items-center gap-2 rounded-xl bg-rose-500 px-6 text-base font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
