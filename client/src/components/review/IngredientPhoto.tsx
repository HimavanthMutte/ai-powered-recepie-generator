import type { JSX } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

type IngredientPhotoProps = {
  count: number;
  imageUrl: string;
  isAnalyzing?: boolean;
  onChangePhoto: () => void;
};

export default function IngredientPhoto({
  count,
  imageUrl,
  isAnalyzing = false,
  onChangePhoto,
}: IngredientPhotoProps): JSX.Element {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#E2DED6] bg-[#1F2922] shadow-md">
      {imageUrl ? (
        <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt="Kitchen ingredients preview"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="flex items-center gap-2.5 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white shadow-md backdrop-blur-md border border-white/20">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isAnalyzing ? "bg-amber-400 animate-ping" : "bg-[#56A068] animate-pulse"
                }`}
              />
              <span>
                {isAnalyzing
                  ? "Groq Vision analyzing photo…"
                  : `${count} ${count === 1 ? "ingredient" : "ingredients"} detected`}
              </span>
            </div>

            <button
              type="button"
              onClick={onChangePhoto}
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold text-[#191C1A] shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={14} className={isAnalyzing ? "animate-spin" : ""} />
              Change or retake photo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-56 flex-col items-center justify-center p-6 text-center text-white">
          <Sparkles size={32} className="mb-2 text-[#56A068]" />
          <p className="text-sm font-medium">No photo uploaded yet</p>
          <button
            type="button"
            onClick={onChangePhoto}
            className="mt-3 rounded-xl bg-[#56A068] px-4 py-2 text-xs font-semibold text-white"
          >
            Upload Photo
          </button>
        </div>
      )}
    </section>
  );
}
