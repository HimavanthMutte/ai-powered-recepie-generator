import { useState, type FormEvent } from "react";
import {
  Droplet,
  Egg,
  Leaf,
  Sprout,
  Trash2,
  Utensils,
  CircleDot,
  Sandwich,
} from "lucide-react";
import type { Ingredient } from "../../data/ingredients";

type Props = {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onReset: () => void;
  onAdd: (name: string) => void;
};
function ItemIcon({ type }: { type: string }) {
  const common = { size: 19, strokeWidth: 1.8 };
  if (type === "egg") return <Egg {...common} />;
  if (type === "tomato") return <CircleDot {...common} />;
  if (type === "leaf") return <Leaf {...common} />;
  if (type === "cheese") return <Sandwich {...common} />;
  if (type === "sprout") return <Sprout {...common} />;
  if (type === "droplet") return <Droplet {...common} />;
  if (type === "grip") return <Utensils {...common} />;
  return <Leaf {...common} />;
}
export default function IngredientList({
  ingredients,
  onRemove,
  onSelectAll,
  onClearAll,
  onReset,
  onAdd,
}: Props) {
  return (
    <section className="panel ingredient-panel">
      <div className="panel-heading">
        <div className="heading-left">
          <h2>Detected in your photo</h2>
          <span className="count-badge">{ingredients.length}</span>
        </div>
        <div className="list-actions">
          <button onClick={onSelectAll}>Select All</button>
          <span>•</span>
          <button className="muted" onClick={onClearAll}>
            Clear All
          </button>
          <span>•</span>
          <button className="danger-text" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
      {ingredients.length ? (
        <div className="ingredient-list">
          {ingredients.map((item) => (
            <div className="ingredient-row" key={item.id}>
              <span
                className={`ingredient-icon ${item.icon === "egg" || item.icon === "tomato" || item.icon === "droplet" ? "warm" : ""}`}
              >
                <ItemIcon type={item.icon} />
              </span>
              <div className="ingredient-copy">
                <span className="ingredient-name">{item.name}</span>
                <span className="ingredient-amount">{item.amount}</span>
              </div>
              <span className="category">{item.category}</span>
              <button
                className="remove-button"
                aria-label={`Remove ${item.name}`}
                title={`Remove ${item.name}`}
                onClick={() => onRemove(item.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No ingredients yet. Add an ingredient below to get started.
        </div>
      )}
      <div className="add-section">
        <label htmlFor="ingredient-input">Add Missing Pantry Items</label>
        <AddIngredientForm onAdd={onAdd} />
        <div className="suggestions">
          <span>Quick suggestions:</span>
          {["Pasta", "Lemon", "Onion", "Butter", "Chili Flakes"].map((item) => (
            <button key={item} onClick={() => onAdd(item)}>
              + {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
function AddIngredientForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  }
  return (
    <form className="add-form" onSubmit={submit}>
      <div className="input-wrap">
        <span className="search-symbol">⌕</span>
        <input
          id="ingredient-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type an ingredient (e.g. Pasta, Chili flakes, Lemon)..."
        />
      </div>
      <button className="add-button" type="submit">
        Add
      </button>
    </form>
  );
}
