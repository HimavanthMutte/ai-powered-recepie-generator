import type { Recipe } from "../../types/recipe";
import CookingStep from "./CookingStep";

export default function CookingGuide({ recipe }: { recipe: Recipe }) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="cooking-guide-heading">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="cooking-guide-heading" className="font-serif text-lg font-medium text-on-surface">Step-by-step cooking guide</h2>
        <span className="text-xs text-on-surface-variant">Tap to check off</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {recipe.steps.map((step, index) => <CookingStep key={`${recipe.id}-${index}`} step={step} index={index} />)}
      </div>
    </section>
  );
}
