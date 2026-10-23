import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ChefTip from "../components/suggestions/ChefTip";
import CookingGuide from "../components/suggestions/CookingGuide";
import NutritionGrid from "../components/suggestions/NutritionGrid";
import RecipeOverview from "../components/suggestions/RecipeOverview";
import RecipeSelector from "../components/suggestions/RecipeSelector";
import { recipes as defaultRecipes } from "../data/recipes";
import { useRecipe } from "../context/RecipeContext";
import type { Recipe } from "../types/recipe";

export default function GenerateSuggestions() {
  const navigate = useNavigate();
  const {
    suggestions,
    saveRecipe,
    savedRecipes,
    generateRecipe,
    setRecipe,
  } = useRecipe();

  // Combine initial recipes with any dynamic AI suggestions
  const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(defaultRecipes);
  const [selectedId, setSelectedId] = useState<string>(defaultRecipes[0].id);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      // Convert suggestions to Recipe format for the viewer
      const converted: Recipe[] = suggestions.map((s, idx) => ({
        id: s.id || `sugg-${idx}`,
        shortTitle: s.shortTitle || s.title.split(" ").slice(0, 3).join(" "),
        title: s.title,
        description: s.description,
        tags: s.dietaryTags || s.tags || ["Chef Concept"],
        servings: 2,
        prepMinutes: 10,
        cookMinutes: parseInt(String(s.cookTime).replace(/[^\d]/g, ""), 10) || 15,
        nutrition: {
          calories: 360 + idx * 30,
          protein: `${20 + idx * 3}g`,
          carbs: `${15 + idx * 2}g`,
          fats: `${14 + idx * 2}g`,
        },
        steps: [
          {
            title: "Mise en place",
            description: `Gather and prep all ingredients: ${s.previewIngredients?.join(", ") || "fresh produce"}.`,
          },
          {
            title: "Sear & Sauté",
            description: "Warm skillet over medium flame, bloom aromatics, and gently introduce produce.",
          },
          {
            title: "Simmer to Perfection",
            description: "Reduce heat and cook until textures are tender-crisp and flavors merge.",
          },
          {
            title: "Chef Finish",
            description: "Plate warm with microgreens, coarse sea salt, and a splash of olive oil.",
          },
        ],
        tip: "Adjust spice levels with fresh cracked pepper and finish with lemon zest for vibrant acidity.",
      }));

      setDisplayRecipes(converted);
      setSelectedId(converted[0].id);
    }
  }, [suggestions]);

  const selectedRecipe =
    displayRecipes.find((recipe) => recipe.id === selectedId) ?? displayRecipes[0];

  const isSaved = savedRecipes.some(
    (r) =>
      r.id === selectedRecipe.id ||
      r.title.toLowerCase() === selectedRecipe.title.toLowerCase(),
  );

  const toggleSaved = async () => {
    try {
      await saveRecipe(selectedRecipe);
      setSaveStatus("Recipe saved to MongoDB Atlas!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err: any) {
      setSaveStatus(err.message || "Failed to save recipe");
    }
  };

  const handleExpandToFullRecipe = async () => {
    setRecipe(selectedRecipe);
    try {
      await generateRecipe(undefined, undefined, selectedRecipe.title);
      navigate("/recipe");
    } catch {
      navigate("/recipe");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-on-surface antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <header className="w-full max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#367D49]">
            Your kitchen, reimagined
          </p>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#191C1A] sm:text-4xl">
            Curated Recipe Suggestions
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5C645D] sm:text-base">
            Select an idea tailored to your scanned kitchen items. Click below to expand into full instructions or save directly.
          </p>
        </header>

        {saveStatus && (
          <div className="w-full rounded-xl border border-[#CFE3D1] bg-[#EAF5EE] p-3 text-center text-sm font-semibold text-[#285C36]">
            {saveStatus}
          </div>
        )}

        <RecipeSelector
          recipes={displayRecipes}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <article className="flex w-full flex-col gap-6 rounded-2xl border border-[#E2DED6] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.03)] sm:p-8">
          <RecipeOverview
            recipe={selectedRecipe}
            isSaved={isSaved}
            onToggleSave={toggleSaved}
          />
          <NutritionGrid nutrition={selectedRecipe.nutrition} />
          <CookingGuide recipe={selectedRecipe} />
          {selectedRecipe.tip && <ChefTip tip={selectedRecipe.tip} />}

          <div className="mt-4 flex justify-end gap-3 border-t border-[#E2DED6] pt-5">
            <button
              type="button"
              onClick={handleExpandToFullRecipe}
              className="inline-flex items-center gap-2 rounded-xl bg-[#56A068] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#478B59]"
            >
              <span className="material-symbols-outlined text-[18px]">
                auto_awesome
              </span>
              View Dedicated Recipe Page
            </button>
          </div>
        </article>

        <p className="pb-2 text-center text-xs text-[#8A918A]">
          Made with care by CookCraft AI · Groq Vision + LLaMA 3.3 Engine
        </p>
      </main>
    </div>
  );
}
