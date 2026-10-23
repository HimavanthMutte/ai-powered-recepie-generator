import type { Recipe } from "../../types/recipe";

type Props = {
  recipes: Recipe[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function RecipeSelector({ recipes, selectedId, onSelect }: Props) {
  return (
    <div className="flex w-full max-w-4xl items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Suggested recipes">
      {recipes.map((recipe, index) => {
        const active = recipe.id === selectedId;
        return (
          <button
            key={recipe.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(recipe.id)}
            className={`min-w-0 flex-1 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              active
                ? "border-2 border-primary bg-white shadow-sm"
                : "border border-outline-subtle bg-white opacity-80 hover:border-stone-400 hover:opacity-100"
            }`}
          >
            <span className={`block text-[11px] font-bold uppercase tracking-wider ${active ? "text-primary" : "text-on-surface-variant"}`}>
              Recipe {index + 1}{index === 0 ? " · Recommended" : ""}
            </span>
            <span className="mt-1 block truncate font-serif text-base font-medium text-on-surface">
              {recipe.shortTitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}
