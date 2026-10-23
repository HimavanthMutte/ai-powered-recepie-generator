import type { JSX } from "react";
import { dietaryOptions } from "../../data/ingredients";

type DietaryPreferencesProps = {
  selected: string;
  onChange: (value: string) => void;
};

export default function DietaryPreferences({
  selected,
  onChange,
}: DietaryPreferencesProps): JSX.Element {
  return (
    <section className="mb-12 rounded-3xl border border-[#E2DED6] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#191C1A]">
            Dietary Preference (Optional)
          </h2>
          <p className="text-xs text-[#727B73] mt-0.5">
            Instructs Groq AI to customize recipes to your nutritional lifestyle
          </p>
        </div>
        <span className="text-xs font-semibold text-[#56A068]">
          Selected: {selected}
        </span>
      </div>

      <div
        className="flex flex-wrap gap-2.5"
        role="group"
        aria-label="Dietary preference"
      >
        {dietaryOptions.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option)}
              className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                isSelected
                  ? "bg-[#56A068] text-white shadow-sm ring-2 ring-[#56A068]/30"
                  : "border border-[#D5DCD3] bg-[#FAF9F6] text-[#455247] hover:bg-[#EEF5EC] hover:border-[#56A068]/50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
