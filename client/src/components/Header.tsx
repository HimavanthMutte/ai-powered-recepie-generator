import type { JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext";

export default function Header(): JSX.Element {
  const location = useLocation();
  const { savedRecipes } = useRecipe();

  const isScanActive =
    location.pathname === "/" || location.pathname === "/review";
  const isSavedActive =
    location.pathname === "/saved" || location.pathname.startsWith("/saved/");
  const isSuggestionsActive =
    location.pathname === "/suggestions" || location.pathname === "/recipe";

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E8E1] bg-[#FAF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[80px] max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="CookCraft AI home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#56A068] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="material-symbols-outlined text-[25px]">
              restaurant
            </span>
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#243B2B] sm:text-3xl">
            CookCraft AI
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 md:flex"
        >
          <Link
            to="/"
            className={`inline-flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-base font-semibold shadow-sm transition-colors ${
              isScanActive
                ? "bg-[#56A068] text-white hover:bg-[#478B59]"
                : "text-[#526456] hover:bg-[#EAF1E8] hover:text-[#294C32]"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              photo_camera
            </span>
            Scan &amp; Create
          </Link>

          <Link
            to="/suggestions"
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors ${
              isSuggestionsActive
                ? "bg-[#EAF1E8] font-semibold text-[#294C32]"
                : "text-[#526456] hover:bg-[#EAF1E8] hover:text-[#294C32]"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              auto_awesome
            </span>
            Suggestions
          </Link>

          <Link
            to="/saved"
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors ${
              isSavedActive
                ? "bg-[#EAF1E8] font-semibold text-[#294C32]"
                : "text-[#526456] hover:bg-[#EAF1E8] hover:text-[#294C32]"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              bookmark
            </span>
            Saved Recipes
            <span className="rounded-md bg-[#E9EDE5] px-2 py-0.5 text-xs font-semibold text-[#45664B]">
              {savedRecipes.length}
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/saved"
            aria-label="View saved recipes"
            className="flex h-11 items-center gap-1.5 rounded-xl border border-[#E0E5DC] bg-white px-3 text-[#45664B] shadow-sm transition-colors hover:border-[#56A068] hover:bg-[#EEF5EC]"
          >
            <span className="material-symbols-outlined text-[22px]">
              bookmarks
            </span>
            <span className="text-sm font-semibold">{savedRecipes.length}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
