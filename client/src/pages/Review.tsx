import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProgressSteps from "../components/review/ProgressSteps";
import IngredientPhoto from "../components/review/IngredientPhoto";
import IngredientList from "../components/review/IngredientList";
import DietaryPreferences from "../components/review/DietaryPreferences";
import StickyActionBar from "../components/review/StickyActionBar";
import { type Ingredient } from "../data/ingredients";
import { CheckCircle2, Package } from "lucide-react";
import { useRecipe } from "../context/RecipeContext";

export default function Review() {
  const navigate = useNavigate();
  const {
    ingredients: contextIngredients,
    setIngredients: setContextIngredients,
    photoUrl,
    setPhotoUrl,
    dietaryPreference,
    setDietaryPreference,
    generateRecipe,
    getRecipeSuggestions,
    loading,
    error,
  } = useRecipe();

  // Map context string ingredients to component's Ingredient objects
  const [activeTab, setActiveTab] = useState("scan");
  const [notice, setNotice] = useState("");
  const [savedPantry, setSavedPantry] = useState(false);
  const [pantry, setPantry] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cookcraft-pantry") || "[]");
    } catch {
      return [];
    }
  });

  const fileInput = useRef<HTMLInputElement>(null);

  // Transform string[] to Ingredient[] for IngredientList component
  const ingredients: Ingredient[] = useMemo(() => {
    return contextIngredients.map((name, index) => ({
      id: `ing-${index}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name: name,
      amount: "Detected from scan",
      category: "Fresh Produce",
      icon: "leaf",
    }));
  }, [contextIngredients]);

  const count = contextIngredients.length;
  const heading = useMemo(
    () =>
      count === 0
        ? "No ingredients detected"
        : `${count} fresh ${count === 1 ? "item" : "items"}`,
    [count],
  );

  function addIngredient(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (
      contextIngredients.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setNotice(`${trimmed} is already on your list.`);
      return;
    }
    setContextIngredients((current) => [...current, trimmed]);
    setSavedPantry(false);
    setNotice(`${trimmed} added to your ingredients.`);
  }

  function removeIngredient(id: string) {
    const target = ingredients.find((i) => i.id === id);
    if (target) {
      setContextIngredients((current) =>
        current.filter((item) => item !== target.name),
      );
      setSavedPantry(false);
    }
  }

  function resetIngredients() {
    setContextIngredients([
      "Cherry Tomatoes",
      "Fresh Basil",
      "Garlic Cloves",
      "Extra Virgin Olive Oil",
      "Baby Spinach",
      "Parmigiano Reggiano",
      "Organic Eggs",
    ]);
    setDietaryPreference("Vegetarian");
    setSavedPantry(false);
    setNotice("Ingredient list reset to defaults.");
  }

  function savePantry() {
    const next = Array.from(new Set([...pantry, ...contextIngredients]));
    setPantry(next);
    localStorage.setItem("cookcraft-pantry", JSON.stringify(next));
    setSavedPantry(true);
    setNotice(`${contextIngredients.length} ingredients saved to your pantry.`);
  }

  function uploadPhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setNotice("Please choose an image smaller than 15 MB.");
      return;
    }
    const preview = URL.createObjectURL(file);
    setPhotoUrl(preview);
    setNotice("Kitchen photo updated.");
  }

  async function handleGenerateFull() {
    if (!count) {
      setNotice("Add at least one ingredient before generating recipes.");
      return;
    }
    try {
      await generateRecipe();
      navigate("/recipe");
    } catch (err: any) {
      setNotice(err.message || "Failed to generate recipe.");
    }
  }

  async function handleGetSuggestions() {
    if (!count) {
      setNotice("Add at least one ingredient before generating recipes.");
      return;
    }
    try {
      await getRecipeSuggestions();
      navigate("/suggestions");
    } catch (err: any) {
      setNotice(err.message || "Failed to generate suggestions.");
    }
  }

  function showTab(tab: string) {
    setActiveTab(tab);
    setNotice("");
    if (tab === "pantry")
      setNotice(`Your pantry has ${pantry.length} saved items.`);
    if (tab === "saved") {
      navigate("/saved");
    }
  }

  return (
    <div className="app-shell min-h-screen bg-[#FAF9F5] text-[#191C1A]">
      <Header />
      {activeTab === "scan" ? (
        <main className="main-content mx-auto w-full max-w-5xl px-4 py-8">
          <ProgressSteps />
          <section className="intro-copy mb-6 text-center">
            <h1 className="font-serif text-3xl font-medium sm:text-4xl">
              Review &amp; refine your ingredients
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-[#5C645D] sm:text-base">
              Our culinary vision model detected <strong>{heading}</strong> in
              your photo. Remove anything you'd rather save for later, or add
              missing pantry items.
            </p>
          </section>

          <input
            ref={fileInput}
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => uploadPhoto(e.target.files?.[0])}
          />

          <IngredientPhoto
            count={count}
            imageUrl={photoUrl || ""}
            onChangePhoto={() => fileInput.current?.click()}
          />

          <IngredientList
            ingredients={ingredients}
            onRemove={removeIngredient}
            onSelectAll={() =>
              setNotice(
                "All detected ingredients are selected for recipe generation.",
              )
            }
            onClearAll={() => {
              setContextIngredients([]);
              setSavedPantry(false);
            }}
            onReset={resetIngredients}
            onAdd={addIngredient}
          />

          <DietaryPreferences
            selected={dietaryPreference}
            onChange={setDietaryPreference}
          />

          {notice && (
            <div
              className="notice mt-4 flex items-center justify-between rounded-xl border border-[#CFE3D1] bg-[#EAF5EE] p-4 text-sm font-medium text-[#285C36]"
              role="status"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                {notice}
              </div>
              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
                className="text-lg font-bold"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div
              className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              role="alert"
            >
              <span>{error}</span>
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          <StickyActionBar
            count={count}
            onSave={savePantry}
            onGenerate={handleGenerateFull}
            onSuggestions={handleGetSuggestions}
            saved={savedPantry}
            loading={loading}
          />
        </main>
      ) : (
        <main className="main-content alternate-view mx-auto w-full max-w-4xl px-4 py-12 text-center">
          <div className="alternate-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF5EE] text-[#367D49]">
            <Package size={28} />
          </div>
          <h1 className="font-serif text-3xl font-medium">Your Pantry</h1>
          <p className="mt-2 text-sm text-[#5C645D]">
            Ingredients you have saved for your next kitchen session.
          </p>

          {pantry.length ? (
            <div className="pantry-grid my-6 flex flex-wrap justify-center gap-2">
              {pantry.map((item) => (
                <span
                  key={item}
                  className="pantry-chip inline-flex items-center gap-2 rounded-full border border-[#E2DED6] bg-white px-3 py-1.5 text-xs font-medium text-[#191C1A]"
                >
                  {item}
                  <button
                    onClick={() => {
                      const next = pantry.filter((value) => value !== item);
                      setPantry(next);
                      localStorage.setItem(
                        "cookcraft-pantry",
                        JSON.stringify(next),
                      );
                    }}
                    className="text-[#8A918A] hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-state my-8 text-sm text-[#8A918A]">
              Your pantry is empty. Return to Scan &amp; Create and save some
              ingredients.
            </p>
          )}

          <button
            className="generate-button back-to-scan rounded-xl bg-[#56A068] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#478B59]"
            onClick={() => showTab("scan")}
          >
            Back to Review
          </button>
        </main>
      )}
    </div>
  );
}
