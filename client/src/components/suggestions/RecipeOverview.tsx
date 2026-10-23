import type { Recipe } from "../../types/recipe";
import RecipeMetadata from "./RecipeMetadata";

type Props = {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: () => void;
};

export default function RecipeOverview({ recipe, isSaved, onToggleSave }: Props) {
  return (
    <section className="border-b border-outline-subtle/60 pb-6 text-left">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
        {recipe.tags.map((tag, index) => (
          <span
            key={tag}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              index === 0 ? "bg-[#EAF5EE] text-[#166534]" : "bg-[#F3EFEA] text-[#78716C]"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-2 font-serif text-2xl font-medium leading-tight tracking-tight text-on-surface sm:text-3xl">
        {recipe.title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-on-surface-variant">
        {recipe.description}
      </p>

      <RecipeMetadata recipe={recipe} />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={isSaved}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E5E4] px-4 py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-[#F3EFEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-[#C2410C]">
            {isSaved ? "bookmark_added" : "bookmark_add"}
          </span>
          {isSaved ? "Saved" : "Save recipe"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7E5E4] px-4 py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-[#F3EFEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">print</span>
          Print
        </button>
      </div>
    </section>
  );
}
