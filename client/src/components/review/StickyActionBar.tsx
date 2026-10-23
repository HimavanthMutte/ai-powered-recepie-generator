import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

type Props = {
  count: number;
  onSave: () => void;
  onGenerate: () => void;
  onSuggestions?: () => void;
  saved: boolean;
  loading?: boolean;
};

export default function StickyActionBar({
  count,
  onSave,
  onGenerate,
  onSuggestions,
  saved,
  loading = false,
}: Props) {
  return (
    <div className="sticky-action-wrap">
      <div className="sticky-action flex-wrap md:flex-nowrap gap-3">
        <div className="ready-icon">
          <Sparkles size={22} className={loading ? "animate-spin" : ""} />
        </div>
        <div className="ready-copy flex-1">
          <strong>
            Ready to cook with {count}{" "}
            {count === 1 ? "ingredient" : "ingredients"}
          </strong>
          <span>Powered by Groq LLaMA 3.3 70B AI Engine</span>
        </div>
        <button
          type="button"
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={onSave}
        >
          {saved ? "Saved to Pantry ✓" : "Save to Pantry"}
        </button>
        {onSuggestions && (
          <button
            type="button"
            className="generate-button bg-[#294C32] hover:bg-[#1E3724] border border-[#3E6548]"
            onClick={onSuggestions}
            disabled={!count || loading}
          >
            <Wand2 size={16} /> 3 Suggestions
          </button>
        )}
        <button
          type="button"
          className="generate-button"
          onClick={onGenerate}
          disabled={!count || loading}
        >
          {loading ? "Cooking with AI…" : "Generate Full Recipe"}{" "}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
