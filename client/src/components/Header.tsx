
import { type JSX } from "react";

const Header = (): JSX.Element => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E8E1] bg-[#FAF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[80px] max-w-6xl items-center justify-between px-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined text-[25px]">
                restaurant
              </span>
            </div>

            <span className="font-serif text-3xl font-semibold tracking-tight text-[#243B2B]">
              CookCraft AI
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 md:flex"
        >
          {/* Active Navigation Item */}
          <a
            href="#"
            aria-current="page"
            className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#478B59]"
          >
            <span className="material-symbols-outlined text-[22px]">
              photo_camera
            </span>
            <span>Scan &amp; Create</span>
          </a>

          {/* Saved Recipes */}
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-[#526456] transition-colors hover:bg-[#EAF1E8] hover:text-[#294C32]"
          >
            <span className="material-symbols-outlined text-[22px]">
              bookmark
            </span>

            <span>Saved Recipes</span>

            <span className="rounded-md bg-[#E9EDE5] px-2 py-0.5 text-sm font-semibold text-[#45664B]">
              14
            </span>
          </a>

          {/* Pantry */}
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-[#526456] transition-colors hover:bg-[#EAF1E8] hover:text-[#294C32]"
          >
            <span className="material-symbols-outlined text-[22px]">
              kitchen
            </span>
            <span>Pantry</span>
          </a>
        </nav>

        {/* User Profile */}
        <button
          type="button"
          aria-label="User profile"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E0E5DC] bg-white text-[#45664B] shadow-sm transition-colors hover:border-primary hover:bg-[#EEF5EC]"
        >
          <span className="material-symbols-outlined text-[24px]">
            person
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
