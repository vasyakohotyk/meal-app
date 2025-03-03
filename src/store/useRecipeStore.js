import { create } from 'zustand';

const useRecipeStore = create((set, get) => ({
  selectedRecipes: [],
  addRecipe: (recipe) => {
    set((state) => {
      if (state.selectedRecipes.some((r) => r.idMeal === recipe.idMeal)) {
        return state;
      }
      return { selectedRecipes: [...state.selectedRecipes, recipe] };
    });
  },
  removeRecipe: (id) => {
    set((state) => ({
      selectedRecipes: state.selectedRecipes.filter((r) => r.idMeal !== id),
    }));
  },
  getIngredients: () => {
    const ingredientsMap = {};
    get().selectedRecipes.forEach((recipe) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          if (ingredientsMap[ingredient]) {
            ingredientsMap[ingredient] += `, ${measure}`;
          } else {
            ingredientsMap[ingredient] = measure;
          }
        }
      }
    });
    return ingredientsMap;
  },
}));

export default useRecipeStore;
