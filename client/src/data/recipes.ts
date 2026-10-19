import type { Recipe } from "../types/recipe";

export const recipes: Recipe[] = [
  {
    id: "tuscan-frittata",
    shortTitle: "Rustic Tuscan Frittata",
    title: "Rustic Tuscan Skillet Frittata with Blistered Tomatoes & Basil",
    description:
      "Fluffy organic eggs whisked with aged Parmigiano Reggiano, gently set over fragrant garlic-wilted spinach and sweet pan-burst cherry tomatoes.",
    tags: ["Vegetarian", "High-Protein", "Easy"],
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 15,
    nutrition: { calories: 380, protein: "28g", carbs: "8g", fats: "26g" },
    steps: [
      {
        title: "Blister the tomatoes",
        description:
          "Heat 2 tablespoons of olive oil in a skillet over medium-high heat. Add garlic and cherry tomatoes, cooking 3 minutes until tomatoes blister and start bursting.",
      },
      {
        title: "Wilt spinach & whisk",
        description:
          "Toss in baby spinach for 60 seconds until just wilted. In a bowl, whisk 6 eggs with salt, pepper, and half the grated cheese.",
      },
      {
        title: "Cook low & slow",
        description:
          "Lower flame to medium-low. Pour eggs evenly into skillet. Cover and let cook undisturbed for 6–7 minutes until edges are set and center is softly trembling.",
      },
      {
        title: "Garnish and serve",
        description:
          "Sprinkle remaining parmesan and torn fresh basil on top. Drizzle with a touch of extra virgin olive oil and serve warm straight from the pan.",
      },
    ],
    tip: "Don't pierce all the tomatoes beforehand—letting them burst naturally in the hot olive oil releases sweet caramelized juices right into the pan.",
  },
  {
    id: "tomato-shakshuka",
    shortTitle: "Warm Tomato Shakshuka",
    title: "Warm Tomato Shakshuka with Herbs & Cracked Pepper",
    description:
      "Eggs gently poached in a warmly spiced tomato skillet, finished with fresh herbs and a little cracked pepper.",
    tags: ["Vegetarian", "Comfort Food", "Easy"],
    servings: 2,
    prepMinutes: 8,
    cookMinutes: 18,
    nutrition: { calories: 320, protein: "19g", carbs: "14g", fats: "20g" },
    steps: [
      { title: "Build the base", description: "Warm olive oil in a skillet. Add chopped onion and garlic and cook until soft and fragrant." },
      { title: "Simmer the tomatoes", description: "Stir in tomatoes, paprika, cumin, salt and pepper. Simmer until the sauce thickens slightly." },
      { title: "Add the eggs", description: "Make small wells in the sauce, crack in the eggs, cover and cook until the whites are set." },
      { title: "Finish with herbs", description: "Scatter fresh basil or parsley over the skillet and serve straight away." },
    ],
    tip: "Let the tomato sauce reduce before adding the eggs so the finished dish stays rich instead of watery.",
  },
  {
    id: "parmesan-scramble",
    shortTitle: "Parmesan Herb Scramble",
    title: "Creamy Parmesan Herb Scramble with Sweet Tomatoes",
    description:
      "Soft scrambled eggs folded with parmesan and fresh herbs, served with warm, lightly blistered tomatoes.",
    tags: ["Vegetarian", "High-Protein", "Quick"],
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 10,
    nutrition: { calories: 350, protein: "25g", carbs: "7g", fats: "24g" },
    steps: [
      { title: "Prepare the eggs", description: "Whisk the eggs with a pinch of salt, pepper and a spoonful of finely grated parmesan." },
      { title: "Warm the tomatoes", description: "Heat a little olive oil in a pan and cook the tomatoes until softened and glossy." },
      { title: "Scramble gently", description: "Lower the heat and stir the eggs slowly with a spatula until soft curds begin to form." },
      { title: "Add herbs and serve", description: "Fold in the remaining parmesan and chopped basil, then serve while creamy." },
    ],
    tip: "Take the eggs off the heat just before they look fully done; residual heat will finish them without drying them out.",
  },
];
