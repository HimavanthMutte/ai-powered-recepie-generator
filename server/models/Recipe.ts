import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          default: "",
        },
      },
    ],
    instructions: [
      {
        step: { type: Number },
        description: { type: String },
      },
    ],
    nutrition: {
      calories: { type: String, default: "350 kcal" },
      protein: { type: String, default: "15g" },
      carbs: { type: String, default: "25g" },
      fat: { type: String, default: "12g" },
      fiber: { type: String, default: "4g" },
    },
    servings: { type: String, default: "2-4 servings" },
    prepTime: { type: String, default: "10 mins" },
    cookTime: { type: String, default: "20 mins" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    dietaryTags: {
      type: [String],
      default: [],
    },
    tip: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    detectedIngredients: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Recipe", recipeSchema);
