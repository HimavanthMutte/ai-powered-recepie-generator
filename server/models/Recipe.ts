import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
        },
      },
    ],
    nutrition: {
      calories: { type: String, required: true },
      protein: { type: String, required: true },
      carbs: { type: String, required: true },
      fat: { type: String, required: true },
      fiber: { type: String, required: true },
    },
    servings: { type: String, required: true },
    prepTime: { type: String, required: true },
    cookTime: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    imageUrl: { type: String },
    detectedIngredients: { type: [String], required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Recipe", recipeSchema);
