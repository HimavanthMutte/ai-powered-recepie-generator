import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useRecipe } from "../context/RecipeContext";
import {
  Sparkles,
  Clock,
  Users,
  Flame,
  Bookmark,
  BookmarkCheck,
  Printer,
  ArrowLeft,
  ChefHat,
  Check,
} from "lucide-react";

export default function RecipeResult(): JSX.Element {
  const navigate = useNavigate();
  const { recipe, saveRecipe, savedRecipes } = useRecipe();
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
        <Header />
        <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF5EE] text-[#367D49]">
            <ChefHat size={32} />
          </div>
          <h1 className="font-serif text-3xl font-medium">No Recipe Generated Yet</h1>
          <p className="mt-2 text-sm text-[#5C645D]">
            Upload a photo of your kitchen ingredients or pick a sample kitchen provision to get started.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#56A068] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#478B59]"
          >
            <ArrowLeft size={18} />
            Go to Kitchen Scanner
          </button>
        </main>
      </div>
    );
  }

  const isSaved = savedRecipes.some(
    (r) =>
      r.id === recipe.id ||
      r._id === recipe._id ||
      r.title.toLowerCase() === recipe.title.toLowerCase(),
  );

  const handleSave = async () => {
    try {
      await saveRecipe(recipe);
      setSaveStatus("Recipe saved to MongoDB!");
      setTimeout(() => setSaveStatus(""), 3500);
    } catch (err: any) {
      setSaveStatus(err.message || "Failed to save recipe");
    }
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
      <Header />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation & actions bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/review")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2DED6] bg-white px-4 py-2 text-xs font-semibold text-[#5C645D] shadow-sm hover:bg-[#F4F1EA] hover:text-[#191C1A]"
          >
            <ArrowLeft size={16} />
            Back to Ingredients
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
                isSaved
                  ? "bg-[#EAF5EE] text-[#285C36] border border-[#CFE3D1]"
                  : "bg-[#56A068] text-white hover:bg-[#478B59]"
              }`}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {isSaved ? "Saved to Library" : "Save Recipe"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2DED6] bg-white px-4 py-2 text-xs font-semibold text-[#5C645D] shadow-sm hover:bg-[#F4F1EA]"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="mb-6 rounded-xl border border-[#CFE3D1] bg-[#EAF5EE] p-3 text-center text-sm font-semibold text-[#285C36]">
            {saveStatus}
          </div>
        )}

        {/* Recipe Main Card */}
        <article className="overflow-hidden rounded-3xl border border-[#E2DED6] bg-white p-6 shadow-sm sm:p-10">
          {/* Tags */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF5EE] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#367D49]">
              <Sparkles size={13} />
              Groq LLaMA 3.3 Recipe
            </span>
            {(recipe.tags || recipe.dietaryTags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F4F1EA] px-3 py-1 text-xs font-semibold text-[#5C645D]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#191C1A] sm:text-4xl">
            {recipe.title}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-[#5C645D]">
            {recipe.description}
          </p>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[#E2DED6] py-5 sm:grid-cols-4 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F1EA] text-[#367D49]">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-[#8A918A]">Prep Time</p>
                <p className="text-sm font-medium text-[#191C1A]">{recipe.prepTime || "10 mins"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F1EA] text-[#C2410C]">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-[#8A918A]">Cook Time</p>
                <p className="text-sm font-medium text-[#191C1A]">{recipe.cookTime || "15 mins"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F1EA] text-[#367D49]">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-[#8A918A]">Servings</p>
                <p className="text-sm font-medium text-[#191C1A]">{recipe.servings || 2}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F1EA] text-[#478B59]">
                <ChefHat size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-[#8A918A]">Difficulty</p>
                <p className="text-sm font-medium text-[#191C1A]">{recipe.difficulty || "Easy"}</p>
              </div>
            </div>
          </div>

          {/* Macro Nutrition Grid */}
          <div className="mt-8 rounded-2xl bg-[#FAF9F5] p-5 sm:p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#5C645D]">
              Nutritional Profile (Per Serving)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                <span className="text-[11px] font-medium text-[#8A918A]">Calories</span>
                <p className="text-base font-bold text-[#191C1A]">
                  {recipe.nutrition?.calories}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                <span className="text-[11px] font-medium text-[#8A918A]">Protein</span>
                <p className="text-base font-bold text-[#367D49]">
                  {recipe.nutrition?.protein}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                <span className="text-[11px] font-medium text-[#8A918A]">Carbs</span>
                <p className="text-base font-bold text-[#C2410C]">
                  {recipe.nutrition?.carbs}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                <span className="text-[11px] font-medium text-[#8A918A]">Fat</span>
                <p className="text-base font-bold text-[#A73A00]">
                  {recipe.nutrition?.fat || recipe.nutrition?.fats || "14g"}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                <span className="text-[11px] font-medium text-[#8A918A]">Fiber</span>
                <p className="text-base font-bold text-[#367D49]">
                  {recipe.nutrition?.fiber || "5g"}
                </p>
              </div>
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div className="mt-8">
            <h2 className="font-serif text-2xl font-medium text-[#191C1A]">
              Required Ingredients
            </h2>
            <p className="mb-4 text-xs text-[#8A918A]">
              Click an item to check it off as you assemble your mise en place.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {(recipe.ingredients && recipe.ingredients.length > 0
                ? recipe.ingredients
                : (recipe.detectedIngredients || []).map((name) => ({
                    name,
                    quantity: "Fresh pantry",
                  }))
              ).map((ing, idx) => {
                const isChecked = Boolean(checkedIngredients[idx]);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isChecked
                        ? "border-[#CFE3D1] bg-[#EAF5EE]/60 line-through text-[#8A918A]"
                        : "border-[#E2DED6] bg-white hover:border-[#56A068]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          isChecked
                            ? "border-[#367D49] bg-[#367D49] text-white"
                            : "border-[#C8CEB9]"
                        }`}
                      >
                        {isChecked && <Check size={13} />}
                      </div>
                      <span className="text-sm font-medium">{ing.name}</span>
                    </div>
                    {ing.quantity && (
                      <span className="text-xs font-semibold text-[#8A918A]">
                        {ing.quantity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-medium text-[#191C1A]">
              Step-by-Step Instructions
            </h2>
            <div className="mt-4 space-y-4">
              {(recipe.steps || recipe.instructions || []).map((st, idx) => {
                const isChecked = Boolean(checkedSteps[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                      isChecked
                        ? "border-[#CFE3D1] bg-[#EAF5EE]/40"
                        : "border-[#E2DED6] bg-white hover:border-[#56A068]/40"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          isChecked
                            ? "bg-[#367D49] text-white"
                            : "bg-[#F4F1EA] text-[#294C32]"
                        }`}
                      >
                        {isChecked ? <Check size={14} /> : `0${st.step || idx + 1}`}
                      </div>
                      <div className="flex-1">
                        {st.title && (
                          <h4 className="text-sm font-bold text-[#191C1A]">
                            {st.title}
                          </h4>
                        )}
                        <p className={`mt-1 text-sm leading-relaxed ${isChecked ? "text-[#8A918A] line-through" : "text-[#5C645D]"}`}>
                          {st.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef Tip */}
          {recipe.tip && (
            <div className="mt-8 rounded-2xl border border-[#F0D5BE] bg-[#FFF8F3] p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A73A00]">
                <Sparkles size={14} />
                Executive Chef Note
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#733E16]">
                {recipe.tip}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2DED6] pt-6">
            <button
              type="button"
              onClick={() => navigate("/review")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2DED6] bg-white px-5 py-3 text-sm font-semibold text-[#5C645D] hover:bg-[#F4F1EA]"
            >
              <ArrowLeft size={16} />
              Adjust Ingredients
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-[#56A068] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#478B59]"
            >
              <Bookmark size={18} />
              {isSaved ? "Saved in MongoDB Atlas" : "Save Recipe"}
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}
