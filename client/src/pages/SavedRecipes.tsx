import { useState, useMemo, useEffect, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useRecipe } from "../context/RecipeContext";
import {
  Bookmark,
  Search,
  Trash2,
  Clock,
  ArrowRight,
  ChefHat,
  Filter,
} from "lucide-react";
import type { Recipe } from "../types/recipe";

export default function SavedRecipes(): JSX.Element {
  const navigate = useNavigate();
  const { savedRecipes, deleteSavedRecipe, fetchSavedRecipes } = useRecipe();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]);

  const filteredRecipes = useMemo(() => {
    return savedRecipes.filter((recipe: Recipe) => {
      const matchesSearch =
        !searchTerm.trim() ||
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const recipeTags = [
        ...(recipe.tags || []),
        ...(recipe.dietaryTags || []),
      ].map((t) => t.toLowerCase());

      const matchesDiet =
        selectedDiet === "All" ||
        recipeTags.some((t) => t.includes(selectedDiet.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === "All" ||
        (recipe.difficulty &&
          recipe.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

      return matchesSearch && matchesDiet && matchesDifficulty;
    });
  }, [savedRecipes, searchTerm, selectedDiet, selectedDifficulty]);

  const handleDelete = async (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;
    if (window.confirm("Are you sure you want to remove this saved recipe?")) {
      await deleteSavedRecipe(id);
      setFeedback("Recipe removed from library.");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header Title */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#367D49]">
              <Bookmark size={15} />
              Personal Recipe Collection
            </div>
            <h1 className="mt-1 font-serif text-3xl font-medium sm:text-4xl">
              Saved Recipes
            </h1>
            <p className="mt-1 text-sm text-[#5C645D]">
              All your AI-generated culinary creations preserved in MongoDB Atlas.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#56A068] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#478B59]"
          >
            <ChefHat size={18} />
            Scan New Kitchen Haul
          </Link>
        </div>

        {feedback && (
          <div className="mb-6 rounded-xl border border-[#CFE3D1] bg-[#EAF5EE] p-3 text-center text-sm font-medium text-[#285C36]">
            {feedback}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="mb-8 rounded-2xl border border-[#E2DED6] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
            {/* Search */}
            <div className="relative sm:col-span-6">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A918A]">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search saved recipes by title…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#E2DED6] bg-[#FAF9F5] py-2.5 pl-10 pr-4 text-sm text-[#191C1A] placeholder-[#8A918A] focus:border-[#56A068] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Diet Filter */}
            <div className="flex items-center gap-2 sm:col-span-3">
              <span className="text-xs font-semibold text-[#8A918A]">
                <Filter size={15} />
              </span>
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="w-full rounded-xl border border-[#E2DED6] bg-[#FAF9F5] px-3 py-2.5 text-sm text-[#191C1A] focus:border-[#56A068] focus:outline-none"
              >
                <option value="All">All Diets</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="High-Protein">High-Protein</option>
                <option value="Low-Carb">Low-Carb</option>
                <option value="Dairy-Free">Dairy-Free</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-xl border border-[#E2DED6] bg-[#FAF9F5] px-3 py-2.5 text-sm text-[#191C1A] focus:border-[#56A068] focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((item) => {
              const recipeId = item._id || item.id;
              return (
                <article
                  key={recipeId}
                  onClick={() => navigate(`/saved/${recipeId}`)}
                  className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#E2DED6] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#56A068]/60 hover:shadow-md"
                >
                  <div>
                    {/* Header tags and delete */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#EAF5EE] px-2.5 py-0.5 text-xs font-semibold text-[#285C36]">
                          {item.difficulty || "Easy"}
                        </span>
                        {(item.tags || item.dietaryTags || []).slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-[#F4F1EA] px-2 py-0.5 text-xs font-medium text-[#5C645D]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        aria-label="Delete recipe"
                        onClick={(e) => handleDelete(e, recipeId)}
                        className="rounded-lg p-1.5 text-[#8A918A] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="font-serif text-xl font-medium leading-snug text-[#191C1A] transition-colors group-hover:text-[#367D49]">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#5C645D]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#E2DED6]/70 pt-4">
                    <div className="flex items-center justify-between text-xs text-[#8A918A]">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {item.cookTime || item.cookMinutes ? `${item.cookMinutes || item.cookTime} mins` : "15 mins"}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#367D49] group-hover:translate-x-0.5 transition-transform">
                        View recipe <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#E2DED6] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F1EA] text-[#8A918A]">
              <Bookmark size={28} />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#191C1A]">
              {savedRecipes.length === 0
                ? "No saved recipes yet"
                : "No recipes match your filter criteria"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#5C645D]">
              {savedRecipes.length === 0
                ? "Scan your kitchen or generate a recipe to save it here for future meals."
                : "Try clearing search keywords or choosing 'All Diets' to see your collection."}
            </p>
            {savedRecipes.length === 0 ? (
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#56A068] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#478B59]"
              >
                Scan Kitchen
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDiet("All");
                  setSelectedDifficulty("All");
                }}
                className="mt-6 rounded-xl border border-[#E2DED6] px-4 py-2 text-xs font-semibold text-[#5C645D] hover:bg-[#F4F1EA]"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
