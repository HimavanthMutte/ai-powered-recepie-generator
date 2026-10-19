import type { JSX } from "react";

export default function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E8E1] bg-[#FAF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[80px] max-w-6xl items-center justify-between px-6">
        <a href="#" className="group flex items-center gap-3" aria-label="CookCraft AI home">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#56A068] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="material-symbols-outlined text-[25px]">restaurant</span>
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#243B2B] sm:text-3xl">
            CookCraft AI
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 md:flex">
          <a
            href="#scan"
            aria-current="page"
            className="inline-flex items-center gap-2.5 rounded-lg bg-[#56A068] px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#478B59] sm:px-5"
          >
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            Scan &amp; Create
          </a>
          <a
            href="#samples"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-[#526456] transition-colors hover:bg-[#EAF1E8] hover:text-[#294C32] sm:px-4"
          >
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
            Saved Recipes
            <span className="rounded-md bg-[#E9EDE5] px-2 py-0.5 text-sm font-semibold text-[#45664B]">14</span>
          </a>
          <a
            href="#tips"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-[#526456] transition-colors hover:bg-[#EAF1E8] hover:text-[#294C32] sm:px-4"
          >
            <span className="material-symbols-outlined text-[22px]">kitchen</span>
            Pantry
          </a>
        </nav>

        <button
          type="button"
          aria-label="User profile"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E0E5DC] bg-white text-[#45664B] shadow-sm transition-colors hover:border-[#56A068] hover:bg-[#EEF5EC]"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
        </button>
      </div>
    </header>
  );
}
