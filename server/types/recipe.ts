export interface IngredientItem {
  name: string;
  quantity?: string;
}

export interface InstructionStep {
  step: number;
  description: string;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

export interface RecipeType {
  _id?: string;
  title: string;
  description?: string;
  ingredients: Array<IngredientItem>;
  instructions?: Array<InstructionStep>;
  nutrition: NutritionInfo;
  servings: string;
  prepTime: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  dietaryTags?: string[];
  tip?: string;
  imageUrl?: string;
  detectedIngredients?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SuggestionType {
  id?: string;
  title: string;
  shortTitle?: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cookTime: string;
  prepTime?: string;
  servings?: string;
  dietaryTags: string[];
  previewIngredients?: string[];
}
