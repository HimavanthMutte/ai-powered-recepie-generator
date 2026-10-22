import type { JSX } from "react";

const steps = [
  { id: 1, label: "Upload Photo" },
  { id: 2, label: "Review Ingredients" },
  { id: 3, label: "Generate Recipes" },
] as const;

type WorkflowStepperProps = {
  currentStep?: 1 | 2 | 3;
};

export default function WorkflowStepper({ currentStep = 1 }: WorkflowStepperProps): JSX.Element {
  return (
    <div className="mb-12 flex items-center justify-center">
      <nav
        aria-label="Workflow progress"
        className="grid w-full max-w-4xl grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 rounded-2xl border border-[#E2DED6] bg-white p-2 shadow-sm sm:gap-2 sm:rounded-full"
      >
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          return (
            <div key={step.id} className="contents">
              <div
                aria-current={isActive ? "step" : undefined}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 py-3 text-center sm:gap-2.5 sm:rounded-full sm:px-4 ${
                  isActive ? "bg-[#56A068] text-white shadow-sm" : "text-[#667368]"
                }`}
              >
                <span className={`shrink-0 font-mono text-xs sm:text-sm ${isActive ? "text-white/80" : "text-[#8B958C]"}`}>
                  0{step.id}
                </span>
                <span className="text-xs font-semibold leading-tight sm:text-sm md:text-base">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="material-symbols-outlined text-base text-[#B8BDB5] sm:text-xl">
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
