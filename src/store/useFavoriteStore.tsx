import { create } from 'zustand';

// Define the Meal type
interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | undefined; // For ingredients and measurements
}

// Define the Favorite Store's state and actions types
interface FavoriteStore {
  favorites: Meal[]; // Array of Meal objects
  addToFavorites: (meal: Meal) => void;
  removeFromFavorites: (mealId: string) => void;
}

// Create the store with proper types
const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'), // Ensure fallback if there's nothing in localStorage

  addToFavorites: (meal) => {
    const { favorites } = get();
    const updatedFavorites = [...favorites, meal];
    set({ favorites: updatedFavorites });

    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  },

  removeFromFavorites: (mealId) => {
    const { favorites } = get();
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== mealId);
    set({ favorites: updatedFavorites });

    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  },
}));

export default useFavoriteStore;
