import type { Nutrition } from "../../types/recipe";

export default function NutritionGrid({ nutrition }: { nutrition: Nutrition }) {
  const metrics = [
    { label: "Calories", value: String(nutrition.calories), highlight: false },
    { label: "Protein", value: nutrition.protein, highlight: true },
    { label: "Carbs", value: nutrition.carbs, highlight: false },
    { label: "Fats", value: nutrition.fats, highlight: false },
  ];

  return (
    <section aria-labelledby="nutrition-heading">
      <h2 id="nutrition-heading" className="mb-2.5 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        Nutrition per serving
      </h2>
      <div className="grid grid-cols-4 gap-2.5">
        {metrics.map((metric) => (
          <div key={metric.label} className={`rounded-xl p-3 text-center ${metric.highlight ? "bg-[#EAF5EE]" : "bg-surface-muted/60"}`}>
            <span className={`block text-xs ${metric.highlight ? "font-medium text-[#166534]" : "text-on-surface-variant"}`}>{metric.label}</span>
            <span className={`mt-0.5 block text-base ${metric.highlight ? "font-bold text-[#14532D]" : "font-semibold text-on-surface"}`}>{metric.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-left text-[11px] text-on-surface-variant">Estimated values; actual nutrition may vary by ingredients and portions.</p>
    </section>
  );
}
