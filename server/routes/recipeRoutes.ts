import express from "express";

import {
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  deleteRecipe,
} from "../controllers/recipeControllers.js";

const recipeRouter = express.Router();

recipeRouter.post("/save", saveRecipe);

recipeRouter.get("/saved", getSavedRecipes);

recipeRouter.get("/saved/:id", getRecipeById);

recipeRouter.delete("/saved/:id", deleteRecipe);

export default recipeRouter;
