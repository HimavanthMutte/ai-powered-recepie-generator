interface Ingredient {
    name: string,
    quantity: string
} 

interface Nutrition {
    calories: string,
    protein: string,
    carbs: string,
    fat: string,
    fiber: string
}

export interface Recipe {
    title: string,
    ingredients: Array<Ingredient>,
    nutrition: Nutrition,
    servings: string,
    prepTime: string,
    cookTime: string,
    difficulty: "Easy" | "Medium" | "Hard",
    imageUrl: string,
    detectedIngredients: string[]
}

