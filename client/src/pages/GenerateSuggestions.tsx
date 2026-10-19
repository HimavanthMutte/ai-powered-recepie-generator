import { useState } from "react";
import Header from "../components/Header";
import ChefTip from "../components/suggestions/ChefTip";
import CookingGuide from "../components/suggestions/CookingGuide";
import NutritionGrid from "../components/suggestions/NutritionGrid";
import RecipeOverview from "../components/suggestions/RecipeOverview";
import RecipeSelector from "../components/suggestions/RecipeSelector";
import { recipes } from "../data/recipes";

export default function GenerateSuggestions() {
  const [selectedId, setSelectedId] = useState(recipes[0].id);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];
  const isSaved = savedIds.includes(selectedRecipe.id);

  const toggleSaved = () => {
    setSavedIds((current) =>
      current.includes(selectedRecipe.id)
        ? current.filter((id) => id !== selectedRecipe.id)
        : [...current, selectedRecipe.id],
    );
  };

  return (
    <div className="min-h-screen bg-surface font-sans bg-[#FAF9F5] text-on-surface antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <header className="w-full max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Your kitchen, reimagined</p>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-on-surface sm:text-4xl">Your recipe suggestions</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
            Choose a recipe tailored to your ingredients and make something delicious today.
          </p>
        </header>

        <RecipeSelector recipes={recipes} selectedId={selectedId} onSelect={setSelectedId} />

        <article className="flex w-full flex-col gap-6 rounded-2xl border border-outline-subtle/80 bg-surface-card p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] sm:p-8">
          <RecipeOverview recipe={selectedRecipe} isSaved={isSaved} onToggleSave={toggleSaved} />
          <NutritionGrid nutrition={selectedRecipe.nutrition} />
          <CookingGuide recipe={selectedRecipe} />
          <ChefTip tip={selectedRecipe.tip} />
        </article>

        <p className="pb-2 text-center text-xs text-on-surface-variant">
          Made with care by CookCraft AI · Recipe and nutrition details are suggestions.
        </p>
      </main>
    </div>
  );
}
