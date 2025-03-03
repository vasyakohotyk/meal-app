import { create } from 'zustand';

// Define the Recipe type
interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | undefined; // For ingredients and measurements
}

// Define the Recipe Store's state and actions types
interface RecipeStore {
  selectedRecipes: Recipe[]; // Array of selected recipes
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  getIngredients: () => Record<string, string>; // A map of ingredient to its measure
}

// Create the store with proper types
const useRecipeStore = create<RecipeStore>((set, get) => ({
  selectedRecipes: [],

  // Add a recipe to the selectedRecipes array if it doesn't already exist
  addRecipe: (recipe) => {
    set((state) => {
      if (state.selectedRecipes.some((r) => r.idMeal === recipe.idMeal)) {
        return state; // Return the same state if the recipe already exists
      }
      return { selectedRecipes: [...state.selectedRecipes, recipe] };
    });
  },

  // Remove a recipe by its id
  removeRecipe: (id) => {
    set((state) => ({
      selectedRecipes: state.selectedRecipes.filter((r) => r.idMeal !== id),
    }));
  },

  // Get ingredients from all selected recipes
  getIngredients: () => {
    const ingredientsMap: Record<string, string> = {};
    get().selectedRecipes.forEach((recipe) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          if (ingredientsMap[ingredient]) {
            ingredientsMap[ingredient] += `, ${measure}`;
          } else {
            ingredientsMap[ingredient] = measure || '';
          }
        }
      }
    });
    return ingredientsMap;
  },
}));

export default useRecipeStore;
