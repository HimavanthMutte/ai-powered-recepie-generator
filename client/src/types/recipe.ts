export type Nutrition = {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
};

export type CookingStep = {
  title: string;
  description: string;
};

export type Recipe = {
  id: string;
  shortTitle: string;
  title: string;
  description: string;
  tags: string[];
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  nutrition: Nutrition;
  steps: CookingStep[];
  tip: string;
};
