import type { Recipe } from "../../types/recipe";

export default function RecipeMetadata({ recipe }: { recipe: Recipe }) {
  const items = [
    { icon: "group", value: recipe.servings, label: "servings" },
    { icon: "schedule", value: recipe.prepMinutes, label: "mins prep" },
    { icon: "skillet", value: recipe.cookMinutes, label: "mins cook" },
  ];

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-on-surface">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-[#A8A29E]">{item.icon}</span>
          <span><strong>{item.value}</strong> {item.label}</span>
        </div>
      ))}
    </div>
  );
}
