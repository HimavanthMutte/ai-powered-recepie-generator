import mongoose from "mongoose"

const recepieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    ingredients: [{
        name: {
            type: String,
            require: true
        },
        quantity: {
            type: String
        }
    }],
    nutrition: {
      calories: { type: String },
      protein: { type: String },
      carbs: { type: String },
      fat: { type: String },
      fiber: { type: String },
    },
    servings:  { type: String, required: true },
    prepTime:  { type: String },
    cookTime:  { type: String },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    imageUrl: { type: String },
    detectedIngredients: [String],
    
},{timestamps: true})

export default mongoose.model("Recepie",recepieSchema)