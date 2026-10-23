import type { JSX } from "react";

type StickyActionBarProps = {
  count: number;
  onGenerate: () => void;
  loading?: boolean;
};

export default function StickyActionBar({
  count,
  onGenerate,
  loading = false,
}: StickyActionBarProps): JSX.Element {
  return (
    <div className="sticky bottom-6 z-30 mx-auto w-full max-w-5xl px-2 sm:px-0">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#D5DCD3] bg-white/95 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="text-sm sm:text-base font-bold text-[#191C1A]">
            Ready to cook with {count} {count === 1 ? "ingredient" : "ingredients"}
          </div>
          <div className="text-xs text-[#727B73]">
            Powered by Groq AI Intelligence Engine
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:shrink-0">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!count || loading}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#56A068] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-[#478B59] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Generating Recipes…" : "Generate Recipes"}
          </button>
        </div>
      </div>
    </div>
  );
}

