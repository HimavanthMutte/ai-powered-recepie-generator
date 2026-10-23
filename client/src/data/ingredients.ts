export type Ingredient = {
  id: string;
  name: string;
  amount: string;
  category: string;
  icon: string;
};

export const initialIngredients: Ingredient[] = [
  { id: 'eggs', name: 'Organic Eggs', amount: '6 pieces • Fresh in carton', category: 'Protein', icon: 'egg' },
  { id: 'tomatoes', name: 'Cherry Tomatoes', amount: 'Approx. 250g • Ripe on vine', category: 'Produce', icon: 'tomato' },
  { id: 'spinach', name: 'Baby Spinach', amount: '1 bowl / 150g • Crisp greens', category: 'Greens', icon: 'leaf' },
  { id: 'cheese', name: 'Parmigiano Reggiano', amount: '1 wedge • Aged hard cheese', category: 'Dairy', icon: 'cheese' },
  { id: 'basil', name: 'Fresh Basil', amount: 'Small bouquet • Fresh garden herb', category: 'Aromatics', icon: 'sprout' },
  { id: 'garlic', name: 'Garlic Cloves', amount: '4 cloves • Whole raw garlic', category: 'Alliums', icon: 'grip' },
  { id: 'oil', name: 'Extra Virgin Olive Oil', amount: 'Cold pressed • Bottle', category: 'Fat / Oil', icon: 'droplet' },
];
export const dietaryOptions = ['Any Diet', 'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein', 'Keto'];
export const quickSuggestions = ['Pasta', 'Lemon', 'Onion', 'Butter', 'Chili Flakes'];