import { useState, type FormEvent, type JSX } from "react";
import {
  Droplet,
  Egg,
  Leaf,
  Sprout,
  Trash2,
  Utensils,
  CircleDot,
  Sandwich,
  Camera,
  UserPlus,
  Plus,
  Sparkles,
} from "lucide-react";
import type { IngredientItem } from "../../context/RecipeContext";

type IngredientListProps = {
  ingredients: IngredientItem[];
  onRemove: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onReset: () => void;
  onAdd: (name: string) => void;
  isAnalyzing?: boolean;
};

function ItemIcon({ type }: { type?: string }): JSX.Element {
  const common = { size: 18, strokeWidth: 2 };
  switch (type) {
    case "egg":
      return <Egg {...common} className="text-amber-600" />;
    case "tomato":
      return <CircleDot {...common} className="text-rose-600" />;
    case "leaf":
      return <Leaf {...common} className="text-emerald-600" />;
    case "cheese":
      return <Sandwich {...common} className="text-yellow-600" />;
    case "sprout":
      return <Sprout {...common} className="text-lime-600" />;
    case "droplet":
      return <Droplet {...common} className="text-sky-600" />;
    case "grip":
      return <Utensils {...common} className="text-stone-600" />;
    default:
      return <Leaf {...common} className="text-emerald-600" />;
  }
}

export default function IngredientList({
  ingredients,
  onRemove,
  onSelectAll,
  onClearAll,
  onReset,
  onAdd,
  isAnalyzing = false,
}: IngredientListProps): JSX.Element {
  return (
    <section className="mb-8 rounded-3xl border border-[#E2DED6] bg-white p-6 shadow-sm sm:p-8">
      {/* Panel Heading */}
      <div className="mb-6 flex flex-col gap-4 border-b border-[#EAE7E0] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl font-semibold text-[#191C1A]">
            Ingredients Identified
          </h2>
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#EAF5EE] px-2.5 text-xs font-bold text-[#2E683D]">
            {ingredients.length}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-[#45664B] hover:text-[#285C36] hover:underline cursor-pointer"
          >
            Select All
          </button>
          <span className="text-[#D3D8D0]">•</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-[#727B73] hover:text-[#191C1A] hover:underline cursor-pointer"
          >
            Clear All
          </button>
          <span className="text-[#D3D8D0]">•</span>
          <button
            type="button"
            onClick={onReset}
            className="text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Model Thinking Indicator if analyzing */}
      {isAnalyzing && (
        <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-[#C8DEC9] bg-[#F2F8F4] p-8 text-center shadow-inner animate-fade-in">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-[#56A068]/30" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#56A068] text-white shadow-md">
              <Sparkles size={24} className="animate-spin" />
            </div>
          </div>
          <h3 className="font-serif text-xl font-semibold text-[#1F3D27]">
            Groq Vision AI is Thinking &amp; Scanning...
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-[#526456]">
            Detecting fresh produce, pantry staples, and kitchen items in your photo.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#2E683D] shadow-sm border border-[#CFE3D1]">
            <span className="h-2 w-2 rounded-full bg-[#56A068] animate-ping" />
            Model: Qwen 2.5 27B Vision on Groq LPU™
          </div>
        </div>
      )}

      {/* Ingredient Items List */}
      {ingredients.length > 0 ? (
        <div className="divide-y divide-[#F2EFE9] rounded-2xl border border-[#ECE8E1] bg-[#FAF9F6]">
          {ingredients.map((item) => {
            const isFromScan = item.origin === "scan";
            return (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-white"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-[#E8E5DD]">
                    <ItemIcon type={item.icon} />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#191C1A] text-sm sm:text-base capitalize truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#727B73]">{item.category || "Pantry Item"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Origin Badge: Detected from scan VS Added by you */}
                  {isFromScan ? (
                    <span
                      title="Identified by Groq Vision from your uploaded photo"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EE] px-3 py-1 text-xs font-semibold text-[#285C36] border border-[#CFE3D1]"
                    >
                      <Camera size={13} className="shrink-0" />
                      <span className="hidden sm:inline">Detected from</span> scan
                    </span>
                  ) : (
                    <span
                      title="Manually added by you"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#C2410C] border border-[#FED7AA]"
                    >
                      <UserPlus size={13} className="shrink-0" />
                      <span className="hidden sm:inline">Added by</span> you
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    title={`Remove ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8C938E] transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : !isAnalyzing ? (
        <div className="rounded-2xl border-2 border-dashed border-[#E2DED6] p-8 text-center bg-[#FAF9F6]">
          <p className="text-sm font-medium text-[#727B73]">
            No ingredients in your list yet. Add items below or change the kitchen photo.
          </p>
        </div>
      ) : null}

      {/* Add Missing Pantry Items Form */}
      <div className="mt-8 border-t border-[#EAE7E0] pt-6">
        <label
          htmlFor="ingredient-input"
          className="mb-2.5 block text-sm font-semibold text-[#191C1A]"
        >
          Add Missing Pantry Items
        </label>
        <AddIngredientForm onAdd={onAdd} />

        {/* Quick Suggestion Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#727B73]">Quick suggestions:</span>
          {["Pasta", "Lemon", "Onion", "Butter", "Olive Oil", "Chili Flakes"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAdd(item)}
              className="inline-flex items-center gap-1 rounded-full border border-[#D5DCD3] bg-white px-3 py-1 text-xs font-semibold text-[#294C32] transition-colors hover:bg-[#EAF1E8] hover:border-[#56A068] cursor-pointer"
            >
              <Plus size={12} />
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AddIngredientForm({ onAdd }: { onAdd: (name: string) => void }): JSX.Element {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2 sm:gap-3">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#8C938E]">
          ⌕
        </span>
        <input
          id="ingredient-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type an ingredient (e.g. Pasta, Garlic, Heavy Cream, Lemon)..."
          className="w-full rounded-xl border border-[#D5DCD3] bg-white py-3 pl-10 pr-4 text-sm text-[#191C1A] placeholder:text-[#9AA29B] focus:border-[#56A068] focus:outline-none focus:ring-2 focus:ring-[#56A068]/20"
        />
      </div>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#56A068] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#478B59] active:scale-95 cursor-pointer"
      >
        <Plus size={16} />
        Add
      </button>
    </form>
  );
}
