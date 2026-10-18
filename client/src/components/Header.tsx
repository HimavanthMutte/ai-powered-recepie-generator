import {type JSX} from "react";

const Header = (): JSX.Element => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E8E1] bg-[#FAF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined text-[23px]">
                restaurant
              </span>
            </div>

            <span className="font-serif text-2xl font-semibold tracking-tight text-[#243B2B]">
              CookCraft AI
            </span>
          </a>

          <span className="hidden rounded-md border border-[#DCE8DC] bg-primary px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white sm:inline-flex">
            VISION STUDIO
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <a
            href="#"
            aria-current="page"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">
              photo_camera
            </span>
            Scan &amp; Create
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#667368] transition-colors hover:bg-primary/90 hover:text-white"
          >
            <span className="material-symbols-outlined text-[19px]">
              bookmark
            </span>
            Saved Recipes
            <span className="rounded-md bg-[#E9EDE5] px-1.5 py-0.5 text-xs font-semibold text-[#45664B]">
              14
            </span>
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#667368] transition-colors hover:bg-primary/90 hover:text-white"
          >
            <span className="material-symbols-outlined text-[19px]">
              kitchen
            </span>
            Pantry
          </a>
        </nav>

        {/* Profile */}
        <button
          type="button"
          aria-label="User profile"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E0E5DC] bg-white text-[#45664B] shadow-sm transition-colors hover:border-[#56A068] hover:bg-[#EEF5EC]"
        >
          <span className="material-symbols-outlined text-[21px]">
            person
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
