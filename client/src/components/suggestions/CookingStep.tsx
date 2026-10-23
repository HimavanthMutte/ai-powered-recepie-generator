import { useState } from "react";
import type { CookingStep as CookingStepType } from "../../types/recipe";

type Props = { step: CookingStepType; index: number };

export default function CookingStep({ step, index }: Props) {
  const [completed, setCompleted] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setCompleted((value) => !value)}
      aria-pressed={completed}
      className={`group flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        completed ? "border-primary/20 bg-primary-light/50" : "border-outline-subtle/80 hover:bg-[#F3EFEA]"
      }`}
    >
      <span aria-hidden="true" className={`material-symbols-outlined mt-0.5 text-[20px] transition-colors ${completed ? "text-primary" : "text-[#D6D3D1] group-hover:text-[#A8A29E]"}`}>
        {completed ? "check_circle" : "circle"}
      </span>
      <span className={`flex-1 text-sm leading-relaxed ${completed ? "opacity-60" : ""}`}>
        <span className={`mr-1.5 font-semibold text-on-surface ${completed ? "line-through" : ""}`}>
          {index + 1}. {step.title}:
        </span>
        <span className={`text-on-surface-variant ${completed ? "line-through" : ""}`}>{step.description}</span>
      </span>
    </button>
  );
}
