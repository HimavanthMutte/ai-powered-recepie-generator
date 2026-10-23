import type { JSX } from "react";
import { Check } from "lucide-react";

type ProgressStepsProps = {
  currentStep?: 1 | 2 | 3;
};

export default function ProgressSteps({ currentStep = 2 }: ProgressStepsProps): JSX.Element {
  const steps = [
    { id: 1, label: "Upload Photo" },
    { id: 2, label: "Review Ingredients" },
    { id: 3, label: "Recipes" },
  ] as const;

  return (
    <div className="mb-10 flex items-center justify-center">
      <nav
        aria-label="Recipe creation progress"
        className="grid w-full max-w-4xl grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 rounded-2xl border border-[#E2DED6] bg-white p-2 shadow-sm sm:gap-2 sm:rounded-full"
      >
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="contents">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2.5 py-3 text-center transition-all duration-200 sm:gap-2.5 sm:rounded-full sm:px-4 ${isCurrent
                    ? "bg-[#56A068] text-white shadow-sm ring-2 ring-[#56A068]/20"
                    : isCompleted
                      ? "bg-[#EAF5EE] text-[#294C32] font-medium"
                      : "text-[#8B958C] hover:text-[#526456]"
                  }`}
              >
                {isCompleted ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#56A068] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                ) : (
                  <span
                    className={`shrink-0 font-mono text-xs sm:text-sm font-semibold ${isCurrent ? "text-white/90" : "text-[#8B958C]"
                      }`}
                  >
                    0{step.id}
                  </span>
                )}

                <span className="text-xs font-semibold leading-tight sm:text-sm md:text-base">
                  {step.label}
                </span>

                {isCurrent && (
                  <span className="hidden sm:inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-white">
                    Active
                  </span>
                )}
              </div>

              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-base sm:text-xl ${isCompleted ? "text-[#56A068]" : "text-[#C8CECA]"
                    }`}
                >
                  arrow_forward
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
