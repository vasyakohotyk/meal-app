import { create } from 'zustand';

const useFavoriteStore = create((set, get) => ({
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],

  addToFavorites: (meal) => {
    const { favorites } = get();
    const updatedFavorites = [...favorites, meal];
    set({ favorites: updatedFavorites });

    // Зберігаємо у localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  },

  removeFromFavorites: (mealId) => {
    const { favorites } = get();
    const updatedFavorites = favorites.filter(meal => meal.idMeal !== mealId);
    set({ favorites: updatedFavorites });

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  },
}));

export default useFavoriteStore;
