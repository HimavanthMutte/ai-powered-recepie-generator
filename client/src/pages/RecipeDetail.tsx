import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import type { Recipe } from "../types/recipe";
import { useRecipe } from "../context/RecipeContext";
import {
  ArrowLeft,
  Clock,
  Flame,
  Users,
  ChefHat,
  Trash2,
  Printer,
  Sparkles,
  Check,
} from "lucide-react";

export default function RecipeDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedRecipes, deleteSavedRecipe } = useRecipe();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Check if recipe is already in memory
    const existing = savedRecipes.find((r) => r._id === id || r.id === id);
    if (existing) {
      setRecipe(existing);
      setLoading(false);
      return;
    }

    // Otherwise fetch by ID
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/recipes/saved/${id}`);
        setRecipe(res.data);
      } catch (err: any) {
        console.error("Error fetching recipe:", err);
        setError("Recipe not found or removed from database.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, savedRecipes]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      await deleteSavedRecipe(id);
      navigate("/saved");
    }
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
        <Header />
        <main className="mx-auto flex max-w-xl flex-col items-center justify-center py-24 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#56A068] border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-[#5C645D]">
            Loading recipe details from MongoDB…
          </p>
        </main>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
        <Header />
        <main className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
          <h2 className="font-serif text-2xl font-medium text-[#191C1A]">
            Recipe Not Found
          </h2>
          <p className="mt-2 text-sm text-[#5C645D]">
            This recipe could not be found in your saved library.
          </p>
          <Link
            to="/saved"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#56A068] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#478B59]"
          >
            <ArrowLeft size={16} />
            Back to Saved Recipes
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
      <Header />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation & actions bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/saved"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2DED6] bg-white px-4 py-2 text-xs font-semibold text-[#5C645D] shadow-sm hover:bg-[#F4F1EA] hover:text-[#191C1A]"
          >
            <ArrowLeft size={16} />
            All Saved Recipes
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2DED6] bg-white px-4 py-2 text-xs font-semibold text-[#5C645D] shadow-sm hover:bg-[#F4F1EA]"
            >
              <Printer size={16} />
              Print
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Recipe Main Card */}
        <article className="overflow-hidden rounded-3xl border border-[#E2DED6] bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EAF5EE] px-3 py-1 text-xs font-semibold text-[#285C36]">
              {recipe.difficulty || "Easy"}
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

          {/* Nutrition Info */}
          {recipe.nutrition && (
            <div className="mt-8 rounded-2xl bg-[#FAF9F5] p-5 sm:p-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#5C645D]">
                Nutritional Breakdown (Per Serving)
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                  <span className="text-[11px] font-medium text-[#8A918A]">Calories</span>
                  <p className="text-base font-bold text-[#191C1A]">
                    {recipe.nutrition.calories}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                  <span className="text-[11px] font-medium text-[#8A918A]">Protein</span>
                  <p className="text-base font-bold text-[#367D49]">
                    {recipe.nutrition.protein}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                  <span className="text-[11px] font-medium text-[#8A918A]">Carbs</span>
                  <p className="text-base font-bold text-[#C2410C]">
                    {recipe.nutrition.carbs}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                  <span className="text-[11px] font-medium text-[#8A918A]">Fat</span>
                  <p className="text-base font-bold text-[#A73A00]">
                    {recipe.nutrition.fat || recipe.nutrition.fats || "14g"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#E2DED6] bg-white p-3 text-center">
                  <span className="text-[11px] font-medium text-[#8A918A]">Fiber</span>
                  <p className="text-base font-bold text-[#367D49]">
                    {recipe.nutrition.fiber || "5g"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Checklist */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-2xl font-medium text-[#191C1A]">
                Ingredients
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {recipe.ingredients.map((ing, idx) => {
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
          )}

          {/* Steps */}
          {(recipe.steps || recipe.instructions) && (
            <div className="mt-10">
              <h2 className="font-serif text-2xl font-medium text-[#191C1A]">
                Method &amp; Cooking Steps
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
          )}

          {/* Chef Tip */}
          {recipe.tip && (
            <div className="mt-8 rounded-2xl border border-[#F0D5BE] bg-[#FFF8F3] p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A73A00]">
                <Sparkles size={14} />
                Chef Secret
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#733E16]">
                {recipe.tip}
              </p>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
