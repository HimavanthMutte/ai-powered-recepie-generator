import express from "express";
import upload from "../middleware/upload.js";
import {
  analyzeImage,
  generateRecipe,
  generateMultipleRecipes,
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  deleteRecipe,
} from "../controllers/recipeControllers.js";

const recipeRouter = express.Router();

// AI Vision: Upload image and detect ingredients
// Accept both "image" and "file" fields for maximum compatibility
recipeRouter.post(
  "/analyze",
  (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Normalize to req.file
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      if (files?.image?.[0]) {
        req.file = files.image[0];
      } else if (files?.file?.[0]) {
        req.file = files.file[0];
      }
      next();
    });
  },
  analyzeImage,
);

// AI Text: Generate one full structured recipe
recipeRouter.post("/generate", generateRecipe);

// AI Text: Generate 3 recipe suggestion cards
recipeRouter.post("/suggestions", generateMultipleRecipes);

// MongoDB CRUD: Save recipe
recipeRouter.post("/save", saveRecipe);

// MongoDB CRUD: List saved recipes
recipeRouter.get("/saved", getSavedRecipes);

// MongoDB CRUD: Get single saved recipe by ID
recipeRouter.get("/saved/:id", getRecipeById);

// MongoDB CRUD: Delete saved recipe by ID
recipeRouter.delete("/saved/:id", deleteRecipe);

export default recipeRouter;
