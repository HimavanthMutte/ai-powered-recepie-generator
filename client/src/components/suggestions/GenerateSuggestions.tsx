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
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#26392D] antialiased selection:bg-[#E1EEE1] selection:text-[#26392D]">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 pb-8 pt-3 sm:gap-4 sm:px-5 sm:pt-5">
        <RecipeSelector recipes={recipes} selectedId={selectedId} onSelect={setSelectedId} />
        <article className="flex w-full flex-col gap-4 rounded-[10px] border border-[#E7E7E2] bg-white p-4 shadow-[0_3px_18px_rgba(38,57,45,0.035)] sm:gap-5 sm:p-6">
          <RecipeOverview recipe={selectedRecipe} isSaved={isSaved} onToggleSave={toggleSaved} />
          <NutritionGrid nutrition={selectedRecipe.nutrition} />
          <CookingGuide recipe={selectedRecipe} />
          <ChefTip tip={selectedRecipe.tip} />
        </article>
      </main>
    </div>
  );
}
