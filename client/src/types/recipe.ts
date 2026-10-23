export type Nutrition = {
  calories: number | string;
  protein: string;
  carbs: string;
  fats?: string;
  fat?: string;
  fiber?: string;
};

export type CookingStep = {
  step?: number;
  title?: string;
  description: string;
};

export type RecipeIngredient = {
  name: string;
  quantity?: string;
};

export type Recipe = {
  _id?: string;
  id: string;
  shortTitle?: string;
  title: string;
  description: string;
  ingredients?: RecipeIngredient[];
  tags: string[];
  dietaryTags?: string[];
  servings: number | string;
  prepMinutes?: number;
  prepTime?: string;
  cookMinutes?: number;
  cookTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  nutrition: Nutrition;
  steps: CookingStep[];
  instructions?: CookingStep[];
  tip?: string;
  imageUrl?: string;
  detectedIngredients?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Suggestion = {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  cookTime: string;
  prepTime?: string;
  servings?: string | number;
  dietaryTags?: string[];
  tags?: string[];
  previewIngredients?: string[];
};
