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

export interface IngredientItem {
  id: string;
  name: string;
  origin: "scan" | "user";
  amount?: string;
  category?: string;
  icon?: string;
}

interface RecipeContextType {
  ingredients: string[];
  ingredientItems: IngredientItem[];
  photoUrl: string | null;
  dietaryPreference: string;
  recipe: Recipe | null;
  suggestions: Suggestion[];
  savedRecipes: Recipe[];
  loading: boolean;
  isAnalyzing: boolean;
  loadingMessage: string;
  error: string | null;
  setError: (err: string | null) => void;
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  setIngredientItems: React.Dispatch<React.SetStateAction<IngredientItem[]>>;
  setPhotoUrl: (url: string | null) => void;
  setDietaryPreference: (diet: string) => void;
  setRecipe: (recipe: Recipe | null) => void;
  analyzeImage: (file: File | Blob, label?: string) => Promise<string[]>;
  addIngredientItem: (name: string) => { success: boolean; message: string };
  removeIngredientItem: (id: string) => void;
  resetIngredientItems: () => void;
  clearIngredientItems: () => void;
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

// Helper to categorize ingredients and assign pleasant visual metadata
export function inferIngredientDetails(
  name: string,
  origin: "scan" | "user",
): IngredientItem {
  const lower = name.toLowerCase();
  let category = "Fresh Produce";
  let icon = "leaf";
  const amount = origin === "scan" ? "Detected from scan" : "Added by you";

  if (lower.includes("egg")) {
    category = "Protein";
    icon = "egg";
  } else if (
    lower.includes("tomato") ||
    lower.includes("pepper") ||
    lower.includes("chili") ||
    lower.includes("zucchini") ||
    lower.includes("carrot") ||
    lower.includes("radicchio")
  ) {
    category = "Produce";
    icon = "tomato";
  } else if (
    lower.includes("spinach") ||
    lower.includes("basil") ||
    lower.includes("herb") ||
    lower.includes("parsley") ||
    lower.includes("lettuce") ||
    lower.includes("cilantro")
  ) {
    category = "Greens & Herbs";
    icon = "leaf";
  } else if (
    lower.includes("cheese") ||
    lower.includes("parmigiano") ||
    lower.includes("milk") ||
    lower.includes("butter") ||
    lower.includes("yogurt")
  ) {
    category = "Dairy";
    icon = "cheese";
  } else if (
    lower.includes("oil") ||
    lower.includes("olive") ||
    lower.includes("vinegar") ||
    lower.includes("sauce")
  ) {
    category = "Fats & Oils";
    icon = "droplet";
  } else if (
    lower.includes("garlic") ||
    lower.includes("onion") ||
    lower.includes("shallot") ||
    lower.includes("ginger")
  ) {
    category = "Aromatics";
    icon = "grip";
  } else if (
    lower.includes("beef") ||
    lower.includes("chicken") ||
    lower.includes("pork") ||
    lower.includes("meat") ||
    lower.includes("fish") ||
    lower.includes("ham")
  ) {
    category = "Protein";
    icon = "egg";
  } else if (
    lower.includes("pasta") ||
    lower.includes("rice") ||
    lower.includes("bean") ||
    lower.includes("bread") ||
    lower.includes("flour") ||
    lower.includes("nut") ||
    lower.includes("chickpea")
  ) {
    category = "Pantry Staples";
    icon = "sprout";
  }

  return {
    id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    origin,
    amount,
    category,
    icon,
  };
}

// Helper to scale down oversized photos before uploading to Groq
async function prepareImageForVision(file: File | Blob): Promise<Blob> {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    try {
      return await new Promise<Blob>((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          const maxDim = 1200;
          let { width, height } = img;
          if (
            width <= maxDim &&
            height <= maxDim &&
            file.size < 1.5 * 1024 * 1024
          ) {
            return resolve(file);
          }
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.85);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(file);
        };
        img.src = url;
      });
    } catch {
      return file;
    }
  }
  return file;
}

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

  const rawNutrition = raw.nutrition || {};
  const calVal =
    typeof rawNutrition.calories === "number"
      ? rawNutrition.calories
      : parseInt(
          String(rawNutrition.calories || "380").replace(/[^\d]/g, ""),
          10,
        ) || 380;

  return {
    _id: raw._id,
    id:
      raw._id ||
      raw.id ||
      `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
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
        : parseInt(String(raw.prepTime || "10").replace(/[^\d]/g, ""), 10) ||
          10,
    cookMinutes:
      typeof raw.cookMinutes === "number"
        ? raw.cookMinutes
        : parseInt(String(raw.cookTime || "15").replace(/[^\d]/g, ""), 10) ||
          15,
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
  // Start with clean states - NO stale data by default!
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientItems, setIngredientItems] = useState<IngredientItem[]>([]);
  const [originalScanItems, setOriginalScanItems] = useState<IngredientItem[]>(
    [],
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [dietaryPreference, setDietaryPreference] =
    useState<string>("Vegetarian");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Processing with Groq AI…",
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch saved recipes from MongoDB Atlas / API on startup
  const fetchSavedRecipes = useCallback(
    async (filters?: {
      diet?: string;
      difficulty?: string;
      search?: string;
    }) => {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.diet && filters.diet !== "All")
          queryParams.append("diet", filters.diet);
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
        console.warn(
          "Could not fetch saved recipes from backend:",
          err.message,
        );
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
      setIsAnalyzing(true);
      setError(null);
      setLoadingMessage("Groq Vision is scanning ingredients & produce…");

      // Set local preview immediately so route guards allow navigation
      if (file instanceof File || file instanceof Blob) {
        const preview = URL.createObjectURL(file);
        setPhotoUrl(preview);
      }

      try {
        const optimized = await prepareImageForVision(file);
        const formData = new FormData();
        const filename = (file as File).name || "kitchen_scan.jpg";
        formData.append("image", optimized, filename);

        const response = await axios.post("/api/recipes/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (
          response.data?.ingredients &&
          Array.isArray(response.data.ingredients)
        ) {
          const list: string[] = response.data.ingredients;
          setIngredients(list);
          const items = list.map((name) =>
            inferIngredientDetails(name, "scan"),
          );
          setIngredientItems(items);
          setOriginalScanItems(items);
          return list;
        }

        return [];
      } catch (err: any) {
        console.error("Image analysis failed:", err);
        setError(
          err.response?.data?.error ||
            "Vision analysis failed. Please try another photo or add ingredients manually.",
        );
        return [];
      } finally {
        setLoading(false);
        setIsAnalyzing(false);
      }
    },
    [],
  );

  // Add ingredient manually by user
  const addIngredientItem = useCallback(
    (name: string): { success: boolean; message: string } => {
      const trimmed = name.trim();
      if (!trimmed) {
        return { success: false, message: "Please enter an ingredient name." };
      }

      const alreadyExists = ingredientItems.some(
        (item) => item.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (alreadyExists) {
        const existing = ingredientItems.find(
          (i) => i.name.toLowerCase() === trimmed.toLowerCase(),
        );
        const originDesc =
          existing?.origin === "scan"
            ? "detected from photo scan"
            : "already added by you";
        return {
          success: false,
          message: `"${trimmed}" is already on your list (${originDesc}).`,
        };
      }

      const newItem = inferIngredientDetails(trimmed, "user");
      setIngredientItems((prev) => [...prev, newItem]);
      setIngredients((prev) => [...prev, trimmed]);

      return {
        success: true,
        message: `"${trimmed}" added by you (manual pantry entry).`,
      };
    },
    [ingredientItems],
  );

  // Remove ingredient
  const removeIngredientItem = useCallback(
    (id: string) => {
      const target = ingredientItems.find((i) => i.id === id);
      setIngredientItems((prev) => prev.filter((i) => i.id !== id));
      if (target) {
        setIngredients((prev) => prev.filter((name) => name !== target.name));
      }
    },
    [ingredientItems],
  );

  // Reset to original detected scan items
  const resetIngredientItems = useCallback(() => {
    setIngredientItems(originalScanItems);
    setIngredients(originalScanItems.map((i) => i.name));
  }, [originalScanItems]);

  // Clear all ingredients
  const clearIngredientItems = useCallback(() => {
    setIngredientItems([]);
    setIngredients([]);
  }, []);

  // Generate full recipe through Groq AI
  const generateRecipe = useCallback(
    async (
      ingredientsOverride?: string[],
      dietOverride?: string,
      recipeTitle?: string,
    ): Promise<Recipe> => {
      setLoading(true);
      setError(null);
      setLoadingMessage("Groq AI is crafting your structured recipe…");

      try {
        const payload = {
          ingredients: ingredientsOverride || ingredients,
          dietaryPreference:
            dietOverride !== undefined ? dietOverride : dietaryPreference,
          recipeTitle: recipeTitle,
        };

        const response = await axios.post("/api/recipes/generate", payload);
        const normalized = normalizeRecipe(response.data);
        setRecipe(normalized);
        return normalized;
      } catch (err: any) {
        console.error("Recipe generation failed:", err);
        setError(err.response?.data?.error || "Failed to generate recipe.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ingredients, dietaryPreference],
  );

  // Generate 3 recipe suggestion cards through Groq AI
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
          dietaryPreference:
            dietOverride !== undefined ? dietOverride : dietaryPreference,
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
        setError(
          err.response?.data?.error || "Failed to save recipe to database",
        );
        throw err;
      }
    },
    [recipe, ingredients],
  );

  // Delete saved recipe from MongoDB
  const deleteSavedRecipe = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/recipes/saved/${id}`);
      setSavedRecipes((prev) =>
        prev.filter((r) => r._id !== id && r.id !== id),
      );
    } catch (err: any) {
      console.error("Failed to delete recipe:", err);
      setSavedRecipes((prev) =>
        prev.filter((r) => r._id !== id && r.id !== id),
      );
    }
  }, []);

  const clearRecipe = useCallback(() => {
    setRecipe(null);
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        ingredients,
        ingredientItems,
        photoUrl,
        dietaryPreference,
        recipe,
        suggestions,
        savedRecipes,
        loading,
        isAnalyzing,
        loadingMessage,
        error,
        setError,
        setIngredients,
        setIngredientItems,
        setPhotoUrl,
        setDietaryPreference,
        setRecipe,
        analyzeImage,
        addIngredientItem,
        removeIngredientItem,
        resetIngredientItems,
        clearIngredientItems,
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
