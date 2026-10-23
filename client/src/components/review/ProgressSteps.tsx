import { Check } from "lucide-react";
export default function ProgressSteps() {
  return (
    <div className="steps" aria-label="Recipe creation progress">
      <div className="step completed">
        <span className="step-check">
          <Check size={11} />
        </span>
        <span>01 Upload Photo</span>
      </div>
      <div className="step current">
        <span>Step 2: Review Ingredients</span>
      </div>
      <div className="step upcoming">
        <span>03 Generate Recipes</span>
      </div>
    </div>
  );
}
