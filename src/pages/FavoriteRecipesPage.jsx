// pages/FavoriteRecipesPage.js
import React, { useMemo } from 'react';
import useFavoriteStore from '../store/useFavoriteStore';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RecipeCard from '../component/RecipeCard';

const FavoriteRecipesPage = () => {
  const { favorites, removeFromFavorites } = useFavoriteStore();

  // Обчислюємо загальний список інгредієнтів
  const ingredientsList = useMemo(() => {
    const ingredientsMap = new Map();

    favorites.forEach((meal) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient) {
          const key = ingredient.toLowerCase(); // Робимо ключ регістронезалежним
          if (ingredientsMap.has(key)) {
            ingredientsMap.set(key, {
              name: ingredient,
              quantity: `${ingredientsMap.get(key).quantity} + ${measure}`,
            });
          } else {
            ingredientsMap.set(key, {
              name: ingredient,
              quantity: measure || '',
            });
          }
        }
      }
    });

    return Array.from(ingredientsMap.values());
  }, [favorites]);

  return (
    <div>
      <Link to="/">
        <Button
          color="primary"
          variant="text"
          style={{ marginLeft: '20px', marginTop: '20px' }}
        >
          Back to Home
        </Button>
      </Link>
      <h1>Favorite Recipes</h1>
      {favorites.length === 0 ? (
        <p>No favorite recipes yet</p>
      ) : (
        <>
          <div className="recipes">
            {favorites.map((meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} onRemove={removeFromFavorites} showRemoveButton={true} />
            ))}
          </div>

          {/* Відображення загального списку інгредієнтів */}
          <h2>Ingredients Needed</h2>
          {ingredientsList.length === 0 ? (
            <p>No ingredients required</p>
          ) : (
            <ul>
              {ingredientsList.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span>: {item.quantity}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default FavoriteRecipesPage;
