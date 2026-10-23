import { useState, useRef, useMemo, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProgressSteps from "../components/review/ProgressSteps";
import IngredientPhoto from "../components/review/IngredientPhoto";
import IngredientList from "../components/review/IngredientList";
import DietaryPreferences from "../components/review/DietaryPreferences";
import StickyActionBar from "../components/review/StickyActionBar";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useRecipe } from "../context/RecipeContext";

export default function Review(): JSX.Element {
  const navigate = useNavigate();
  const {
    ingredientItems,
    ingredients,
    photoUrl,
    dietaryPreference,
    setDietaryPreference,
    generateRecipe,
    getRecipeSuggestions,
    addIngredientItem,
    removeIngredientItem,
    resetIngredientItems,
    clearIngredientItems,
    analyzeImage,
    loading,
    isAnalyzing,
    error,
    setError,
  } = useRecipe();

  const [notice, setNotice] = useState<string>("");
  const [savedPantry, setSavedPantry] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const count = ingredientItems.length;

  const headingText = useMemo(() => {
    if (isAnalyzing) return "Analyzing your kitchen photo…";
    if (count === 0) return "No ingredients detected";
    return `${count} fresh ${count === 1 ? "item" : "items"}`;
  }, [count, isAnalyzing]);

  // Handle adding an ingredient manually (Requirement 5)
  const handleAddIngredient = (name: string) => {
    const res = addIngredientItem(name);
    setNotice(res.message);
    setSavedPantry(false);
  };

  // Handle photo retake or change
  const handlePhotoUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file (JPG, PNG, or WEBP).");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setNotice("Please choose an image smaller than 25 MB.");
      return;
    }

    setNotice("Scanning new kitchen photo with Groq Vision AI…");
    analyzeImage(file);
  };

  const handleSaveToPantry = () => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("cookcraft-pantry") || "[]",
      );
      const updated = Array.from(new Set([...existing, ...ingredients]));
      localStorage.setItem("cookcraft-pantry", JSON.stringify(updated));
      setSavedPantry(true);
      setNotice(
        `${ingredients.length} items saved to your pantry storage!`,
      );
    } catch {
      setNotice("Ingredients saved.");
    }
  };

  const handleGenerateFullRecipe = async () => {
    if (!count) {
      setNotice("Please add at least one ingredient to generate recipes.");
      return;
    }
    try {
      await generateRecipe();
      navigate("/recipe");
    } catch (err: any) {
      setNotice(err.message || "Failed to generate recipe.");
    }
  };

  const handleGetSuggestions = async () => {
    if (!count) {
      setNotice("Please add at least one ingredient to generate suggestions.");
      return;
    }
    try {
      await getRecipeSuggestions();
      navigate("/suggestions");
    } catch (err: any) {
      setNotice(err.message || "Failed to generate suggestions.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans antialiased text-[#191C1A]">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Progress Step Component showing Step 2: Review Ingredients */}
        <ProgressSteps currentStep={2} />

        {/* Intro copy */}
        <section className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-medium sm:text-4xl text-[#191C1A]">
            Review &amp; Refine Ingredients
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#5C645D] sm:text-base">
            {isAnalyzing ? (
              <span>Our culinary vision model is currently inspecting your kitchen photo.</span>
            ) : (
              <span>
                Our culinary vision model detected <strong>{headingText}</strong> in your photo.
                Verify your items, remove anything not needed, or add missing pantry staples.
              </span>
            )}
          </p>
        </section>

        {/* Hidden file input for changing photo */}
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
        />

        {/* Photo preview card with live count and change button */}
        <IngredientPhoto
          count={count}
          imageUrl={photoUrl || ""}
          isAnalyzing={isAnalyzing}
          onChangePhoto={() => fileInputRef.current?.click()}
        />

        {/* Notifications / Alerts banner */}
        {notice && (
          <div
            className="mb-6 flex items-center justify-between rounded-2xl border border-[#CFE3D1] bg-[#EAF5EE] p-4 text-sm font-medium text-[#285C36] shadow-sm animate-fade-in"
            role="status"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 text-[#367D49]" />
              <span>{notice}</span>
            </div>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="text-lg font-bold text-[#285C36] hover:text-[#183d22] px-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Error notification banner */}
        {error && (
          <div
            className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm"
            role="alert"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={18} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="text-lg font-bold text-red-700 hover:text-red-900 px-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Detected Ingredients List with Add Form and Scan vs User badges */}
        <IngredientList
          ingredients={ingredientItems}
          isAnalyzing={isAnalyzing}
          onRemove={removeIngredientItem}
          onSelectAll={() =>
            setNotice("All ingredients are selected for AI recipe generation.")
          }
          onClearAll={() => {
            clearIngredientItems();
            setSavedPantry(false);
            setNotice("Ingredient list cleared.");
          }}
          onReset={() => {
            resetIngredientItems();
            setNotice("Ingredient list restored to original photo scan.");
          }}
          onAdd={handleAddIngredient}
        />

        {/* Dietary Preferences selector */}
        <DietaryPreferences
          selected={dietaryPreference}
          onChange={setDietaryPreference}
        />

        {/* Sticky Action Bar */}
        <StickyActionBar
          count={count}
          onSave={handleSaveToPantry}
          onGenerate={handleGenerateFullRecipe}
          onSuggestions={handleGetSuggestions}
          saved={savedPantry}
          loading={loading || isAnalyzing}
        />
      </main>
    </div>
  );
}
