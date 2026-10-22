import React from "react";

interface HorizontalStepperProps {
  currentStep?: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: "Upload Photo" },
  { id: 2, label: "Review Ingredients" },
  { id: 3, label: "Generate Recipes" },
] as const;

const HorizontalStepper: React.FC<HorizontalStepperProps> = ({
  currentStep = 1,
}) => {
  return (
    <div className="flex items-center justify-center mb-12">
      <nav
  aria-label="Workflow progress"
  className="grid w-full max-w-[1440px] mx-auto
           grid-cols-[1fr_auto_1fr_auto_1fr]
           items-center gap-1 sm:gap-2 p-1 h-20
           rounded-full border border-gray-300 shadow-sm"
>
  {steps.map((step, index) => {
    const isActive = step.id === currentStep;

    return (
      <React.Fragment key={step.id}>
        <div
          aria-current={isActive ? "step" : undefined}
          className={`flex items-center justify-center gap-2
            whitespace-nowrap rounded-full px-3 sm:px-4 py-5
            ${
              isActive
                ? "bg-primary text-white shadow-md"
                : "text-gray-700"
            }`}
        >
          {isActive ? (
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-200" />
          ) : (
            <span className="font-mono text-sm sm:text-xl text-gray-500">
              0{step.id}
            </span>
          )}

          <span className="text-xl sm:text-2xl">{step.label}</span>
        </div>

        {index < steps.length - 1 && (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center
                       text-2xl leading-none text-gray-400"
          >
            ›
          </span>
        )}
      </React.Fragment>
    );
  })}
</nav>
    </div>
  );
};

export default HorizontalStepper;