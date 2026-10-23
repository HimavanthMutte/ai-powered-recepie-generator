import { dietaryOptions } from "../../data/ingredients";
type Props = { selected: string; onChange: (value: string) => void };
export default function DietaryPreferences({ selected, onChange }: Props) {
  return (
    <section className="panel dietary-panel">
      <div className="diet-heading">
        <h2>Dietary Preference (Optional)</h2>
        <span>Tailors recipe filtering</span>
      </div>
      <div
        className="diet-options"
        role="group"
        aria-label="Dietary preference"
      >
        {dietaryOptions.map((option) => (
          <button
            key={option}
            className={`diet-pill ${selected === option ? "selected" : ""}`}
            aria-pressed={selected === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
