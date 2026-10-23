import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import type { Recipe, Suggestion } from "../types/recipe";
import { recipes as initialRecipes } from "../data/recipes";

interface RecipeContextType {
  ingredients: string[];
  photoUrl: string | null;
  dietaryPreference: string;
  recipe: Recipe | null;
  suggestions: Suggestion[];
  savedRecipes: Recipe[];
  loading: boolean;
  loadingMessage: string;
  error: string | null;
  setError: (err: string | null) => void;
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  setPhotoUrl: (url: string | null) => void;
  setDietaryPreference: (diet: string) => void;
  setRecipe: (recipe: Recipe | null) => void;
  analyzeImage: (file: File | Blob, label?: string) => Promise<string[]>;
  generateRecipe: (
    ingredientsOverride?: string[],
    dietOverride?: string,
    recipeTitle?: string,
  ) => Promise<Recipe>;
  getRecipeSuggestions: (
    ingredientsOverride?: string[],
    dietOverride?: string,
  ) => Promise<Suggestion[]>;
  saveRecipe: (recipeToSave?: Recipe) => Promise<Recipe>;
  fetchSavedRecipes: (filters?: {
    diet?: string;
    difficulty?: string;
    search?: string;
  }) => Promise<Recipe[]>;
  deleteSavedRecipe: (id: string) => Promise<void>;
  clearRecipe: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipe = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};

// Helper to normalize recipe object coming from backend AI
function normalizeRecipe(raw: any): Recipe {
  const steps =
    raw.steps && raw.steps.length > 0
      ? raw.steps
      : raw.instructions && raw.instructions.length > 0
        ? raw.instructions.map((inst: any, idx: number) => ({
            title: `Step ${inst.step || idx + 1}`,
            description: inst.description || inst,
          }))
        : [
            {
              title: "Preparation",
              description: "Prepare and portion all detected ingredients.",
            },
            {
              title: "Cooking",
              description: "Simmer or sauté according to chef recommendations.",
            },
            {
              title: "Plating",
              description: "Garnish with fresh herbs and serve immediately.",
            },
          ];

  const tags =
    raw.tags && raw.tags.length > 0
      ? raw.tags
      : raw.dietaryTags && raw.dietaryTags.length > 0
        ? raw.dietaryTags
        : ["Custom Creation", "Fresh Kitchen"];

  // Normalize nutrition
  const rawNutrition = raw.nutrition || {};
  const calVal =
    typeof rawNutrition.calories === "number"
      ? rawNutrition.calories
      : parseInt(String(rawNutrition.calories || "380").replace(/[^\d]/g, ""), 10) || 380;

  return {
    _id: raw._id,
    id: raw._id || raw.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    title: raw.title || "Chef's Artisanal Recipe",
    shortTitle: raw.shortTitle || raw.title?.split(" ").slice(0, 4).join(" "),
    description:
      raw.description ||
      "A thoughtfully crafted culinary creation celebrating your seasonal ingredients.",
    ingredients: raw.ingredients || [],
    tags: tags,
    dietaryTags: tags,
    servings: raw.servings || 2,
    prepMinutes:
      typeof raw.prepMinutes === "number"
        ? raw.prepMinutes
        : parseInt(String(raw.prepTime || "10").replace(/[^\d]/g, ""), 10) || 10,
    cookMinutes:
      typeof raw.cookMinutes === "number"
        ? raw.cookMinutes
        : parseInt(String(raw.cookTime || "15").replace(/[^\d]/g, ""), 10) || 15,
    prepTime: raw.prepTime || "10 mins",
    cookTime: raw.cookTime || "15 mins",
    difficulty: raw.difficulty || "Easy",
    nutrition: {
      calories: calVal,
      protein: String(rawNutrition.protein || "20g"),
      carbs: String(rawNutrition.carbs || "18g"),
      fats: String(rawNutrition.fat || rawNutrition.fats || "14g"),
      fat: String(rawNutrition.fat || rawNutrition.fats || "14g"),
      fiber: String(rawNutrition.fiber || "5g"),
    },
    steps: steps,
    instructions: steps,
    tip:
      raw.tip ||
      "Let the dish rest for 2 minutes before serving to allow delicate aromatics and juices to settle.",
    detectedIngredients: raw.detectedIngredients || [],
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([
    "Cherry Tomatoes",
    "Fresh Basil",
    "Garlic Cloves",
    "Extra Virgin Olive Oil",
    "Baby Spinach",
    "Parmigiano Reggiano",
    "Organic Eggs",
  ]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBjRA98lnBAVGIMMliJCGxeAbiQsRm8wBGDA1Q8zk5KIW70RLrzQtemrqhIryMt0k61bBoGkjJuu_UviYBCXoCqZF_QYwBMRDMX9tdRK1abU8kdqE9LEqelnxMBxAlOi-IYt3suiBIua_urllLAPC4MfQHrUgFZJ2S6DHCltdIsoQcKVIsn3cm8K1hz55rkDDkMr0jNKwsXS3wP3RjKE-1tXrOtL8GZWgkOTfslGUTXbXKtvr9GoAQtwg",
  );
  const [dietaryPreference, setDietaryPreference] = useState<string>("Vegetarian");
  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipes[0]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Processing with Groq AI…");
  const [error, setError] = useState<string | null>(null);

  // Fetch saved recipes from MongoDB Atlas / API on startup
  const fetchSavedRecipes = useCallback(
    async (filters?: { diet?: string; difficulty?: string; search?: string }) => {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.diet && filters.diet !== "All") queryParams.append("diet", filters.diet);
        if (filters?.difficulty && filters.difficulty !== "All")
          queryParams.append("difficulty", filters.difficulty);
        if (filters?.search && filters.search.trim())
          queryParams.append("search", filters.search.trim());

        const queryStr = queryParams.toString();
        const url = `/api/recipes/saved${queryStr ? `?${queryStr}` : ""}`;
        const response = await axios.get(url);

        const list = Array.isArray(response.data)
          ? response.data.map(normalizeRecipe)
          : [];
        setSavedRecipes(list);
        return list;
      } catch (err: any) {
        console.warn("Could not fetch saved recipes from backend:", err.message);
        return [];
      }
    },
    [],
  );

  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]);

  // Analyze image through Groq Vision endpoint
  const analyzeImage = useCallback(
    async (file: File | Blob, _label?: string): Promise<string[]> => {
      setLoading(true);
      setError(null);
      setLoadingMessage("Groq Vision is scanning ingredients & produce…");

      try {
        // Set local preview
        if (file instanceof File || file instanceof Blob) {
          const preview = URL.createObjectURL(file);
          setPhotoUrl(preview);
        }

        const formData = new FormData();
        formData.append("image", file, (file as File).name || "scan.jpg");

        const response = await axios.post("/api/recipes/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data?.ingredients && Array.isArray(response.data.ingredients)) {
          const list = response.data.ingredients;
          setIngredients(list);
          return list;
        }

        return ingredients;
      } catch (err: any) {
        console.error("Image analysis failed:", err);
        setError(err.response?.data?.error || "Vision analysis failed. Using extracted items.");
        return ingredients;
      } finally {
        setLoading(false);
      }
    },
    [ingredients],
  );

  // Generate full recipe through Groq LLaMA 3.3 70B
  const generateRecipe = useCallback(
    async (
      ingredientsOverride?: string[],
      dietOverride?: string,
      recipeTitle?: string,
    ): Promise<Recipe> => {
      setLoading(true);
      setError(null);
      setLoadingMessage("Groq LLaMA 3.3 70B is crafting your structured recipe…");

      try {
        const payload = {
          ingredients: ingredientsOverride || ingredients,
          dietaryPreference: dietOverride !== undefined ? dietOverride : dietaryPreference,
          recipeTitle: recipeTitle,
        };

        const response = await axios.post("/api/recipes/generate", payload);
        const normalized = normalizeRecipe(response.data);
        setRecipe(normalized);
        return normalized;
      } catch (err: any) {
        console.error("Recipe generation failed:", err);
        setError(err.response?.data?.error || "Failed to generate recipe.");
        // Fallback to initial recipe
        const fallback = initialRecipes[0];
        setRecipe(fallback);
        return fallback;
      } finally {
        setLoading(false);
      }
    },
    [ingredients, dietaryPreference],
  );

  // Generate 3 recipe suggestion cards through Groq LLaMA 3.3
  const getRecipeSuggestions = useCallback(
    async (
      ingredientsOverride?: string[],
      dietOverride?: string,
    ): Promise<Suggestion[]> => {
      setLoading(true);
      setError(null);
      setLoadingMessage("Curating 3 customized culinary concepts…");

      try {
        const payload = {
          ingredients: ingredientsOverride || ingredients,
          dietaryPreference: dietOverride !== undefined ? dietOverride : dietaryPreference,
        };

        const response = await axios.post("/api/recipes/suggestions", payload);
        const list: Suggestion[] = response.data?.suggestions || [];
        setSuggestions(list);
        return list;
      } catch (err: any) {
        console.error("Suggestions generation failed:", err);
        setError(err.response?.data?.error || "Failed to get suggestions.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [ingredients, dietaryPreference],
  );

  // Save recipe to MongoDB Atlas
  const saveRecipe = useCallback(
    async (recipeToSave?: Recipe): Promise<Recipe> => {
      const target = recipeToSave || recipe;
      if (!target) {
        throw new Error("No recipe to save");
      }

      setError(null);
      try {
        const payload = {
          title: target.title,
          description: target.description,
          ingredients:
            target.ingredients && target.ingredients.length > 0
              ? target.ingredients
              : ingredients.map((name) => ({ name, quantity: "As needed" })),
          instructions: target.steps.map((s, idx) => ({
            step: idx + 1,
            description: s.description || s.title || "",
          })),
          nutrition: {
            calories: String(target.nutrition.calories),
            protein: target.nutrition.protein,
            carbs: target.nutrition.carbs,
            fat: target.nutrition.fat || target.nutrition.fats || "14g",
            fiber: target.nutrition.fiber || "5g",
          },
          servings: String(target.servings),
          prepTime: target.prepTime || `${target.prepMinutes || 10} mins`,
          cookTime: target.cookTime || `${target.cookMinutes || 15} mins`,
          difficulty: target.difficulty || "Easy",
          dietaryTags: target.tags || target.dietaryTags || [],
          tip: target.tip || "",
          detectedIngredients: target.detectedIngredients || ingredients,
        };

        const response = await axios.post("/api/recipes/save", payload);
        const saved = normalizeRecipe(response.data);

        // Optimistic state update
        setSavedRecipes((prev) => [
          saved,
          ...prev.filter((r) => r.id !== saved.id && r._id !== saved._id),
        ]);

        return saved;
      } catch (err: any) {
        console.error("Failed to save recipe:", err);
        setError(err.response?.data?.error || "Failed to save recipe to database");
        throw err;
      }
    },
    [recipe, ingredients],
  );

  // Delete saved recipe from MongoDB
  const deleteSavedRecipe = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/recipes/saved/${id}`);
      setSavedRecipes((prev) => prev.filter((r) => r._id !== id && r.id !== id));
    } catch (err: any) {
      console.error("Failed to delete recipe:", err);
      // Still update local state optimistically
      setSavedRecipes((prev) => prev.filter((r) => r._id !== id && r.id !== id));
    }
  }, []);

  const clearRecipe = useCallback(() => {
    setRecipe(null);
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        ingredients,
        photoUrl,
        dietaryPreference,
        recipe,
        suggestions,
        savedRecipes,
        loading,
        loadingMessage,
        error,
        setError,
        setIngredients,
        setPhotoUrl,
        setDietaryPreference,
        setRecipe,
        analyzeImage,
        generateRecipe,
        getRecipeSuggestions,
        saveRecipe,
        fetchSavedRecipes,
        deleteSavedRecipe,
        clearRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
