import { type RecipeType } from "../types/recipe.js";

import { type Request, type Response } from "express";

import Recipe from "../models/Recipe.js"

export const saveRecipe = async(req:Request<{},{},RecipeType>,res:Response) => {
    try {
    const newRecipe = new Recipe(req.body)
    const savedRecipe = await newRecipe.save()
    res.status(201).json(savedRecipe)
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Save recipe error:", err.message);
        res.status(500).json({ error: "Failed to save recipe" });
        }
    }
}

