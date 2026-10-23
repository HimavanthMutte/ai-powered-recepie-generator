import { ChefHat, Clock, Flame, X } from "lucide-react";
type Props = { dietary: string; count: number; onClose: () => void };
const recipes = [
  {
    name: "Garden Tomato & Spinach Frittata",
    time: "25 min",
    calories: "320 kcal",
    note: "A fluffy skillet frittata with sweet tomatoes, tender greens and parmesan.",
  },
  {
    name: "Cherry Tomato Basil Pasta",
    time: "20 min",
    calories: "410 kcal",
    note: "A bright, garlicky olive-oil sauce finished with fresh basil and parmesan.",
  },
  {
    name: "Warm Spinach & Tomato Salad",
    time: "15 min",
    calories: "245 kcal",
    note: "Wilted baby spinach, blistered tomatoes and a lemony garlic dressing.",
  },
];
export default function RecipeResults({ dietary, count, onClose }: Props) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="results-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close recipes"
        >
          <X size={20} />
        </button>
        <div className="results-eyebrow">
          <span className="ready-icon small">
            <ChefHat size={18} />
          </span>{" "}
          YOUR PERSONALIZED MENU
        </div>
        <h2 id="results-title">A little kitchen inspiration.</h2>
        <p className="results-intro">
          Created from {count} selected ingredients
          {dietary !== "Any Diet"
            ? ` with your ${dietary} preference in mind`
            : ""}
          . Connect your recipe-generation API to replace these sample ideas
          with live AI results.
        </p>
        <div className="recipe-results">
          {recipes.map((recipe, index) => (
            <article className="recipe-card" key={recipe.name}>
              <div className="recipe-number">0{index + 1}</div>
              <div className="recipe-info">
                <h3>{recipe.name}</h3>
                <p>{recipe.note}</p>
                <div className="recipe-meta">
                  <span>
                    <Clock size={14} />
                    {recipe.time}
                  </span>
                  <span>
                    <Flame size={14} />
                    {recipe.calories}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="generate-button modal-done" onClick={onClose}>
          Back to ingredients
        </button>
      </section>
    </div>
  );
}
