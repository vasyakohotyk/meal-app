import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMealById } from '../api/api';
import { useParams, Link } from 'react-router-dom';
import useFavoriteStore from '../store/useFavoriteStore'; // Підключаємо zustand
import { Button } from '@mui/material'; // Імпортуємо компонент Button з MUI
import './SingleRecipePage.css';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | undefined; // Для інгредієнтів та вимірів
}

const SingleRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Типізуємо параметр id

  // @ts-ignore
  const { data, isLoading, isError } = useQuery<Meal | undefined>({
    queryKey: ['meal', id],
    queryFn: () => fetchMealById(id),
  });

  const { addToFavorites, favorites } = useFavoriteStore(); // Отримуємо методи з Zustand

  // @ts-ignore
  const isFavorite = data ? favorites.some((meal) => meal.idMeal === data.idMeal) : false;

  const handleAddToFavorites = () => {
    if (data && !isFavorite) {
      addToFavorites(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!data) return <div>No recipe found</div>;

  return (
    <div className="single-recipe-page">
      {/* Кнопка повернення назад */}
      <Link to="/" className="back-button-link">
        <Button variant="outlined" color="primary" className="back-button">
          Back to All Recipes
        </Button>
      </Link>

      <h1 className="recipe-title">{data.strMeal}</h1>
      <img className="recipe-image" src={data.strMealThumb} alt={data.strMeal} />
      <p className="recipe-category">{data.strCategory} - {data.strArea}</p>

      <div className="recipe-details">
        <h3>Ingredients:</h3>
        <ul className="ingredients-list">
          {[...Array(20)].map((_, i) => {
            // @ts-ignore
            const ingredient = data[`strIngredient${i + 1}`];
            // @ts-ignore
            const measure = data[`strMeasure${i + 1}`];
            return ingredient ? (
              <li key={i} className="ingredient-item">
                {ingredient} - {measure}
              </li>
            ) : null;
          })}
        </ul>

        <h3>Instructions:</h3>
        <p>{data.strInstructions}</p>

        {/* Кнопка для додавання в обране */}
        <Button
          variant="contained"
          color={isFavorite ? 'success' : 'primary'}
          onClick={handleAddToFavorites}
          disabled={isFavorite}
          className="favorite-button"
        >
          {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
        </Button>
      </div>
    </div>
  );
};

export default SingleRecipePage;
