import React, { useMemo } from 'react';
import useFavoriteStore from '../../store/useFavoriteStore';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RecipeCard from '../../component/RecipeCard';

type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
};

interface Ingredient {
  name: string;
  quantity: string;
}

const FavoriteRecipesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavoriteStore();

  const ingredientsList = useMemo<Ingredient[]>(() => {
    const ingredientsMap = new Map<string, Ingredient>();

    favorites.forEach((meal: Meal) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}` as keyof Meal];
        const measure = meal[`strMeasure${i}` as keyof Meal];

        if (ingredient) {
          const key = ingredient.toLowerCase(); 
          if (ingredientsMap.has(key)) {
            ingredientsMap.set(key, {
              name: ingredient,
              quantity: `${ingredientsMap.get(key)?.quantity} + ${measure || 'N/A'}`,
            });
          } else {
            ingredientsMap.set(key, {
              name: ingredient,
              quantity: measure || 'N/A', 
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
            {favorites.map((meal: Meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} onRemove={removeFromFavorites} showRemoveButton={true} />
            ))}
          </div>

          
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
          <h2>Cooking Instructions</h2>
          {favorites.map((meal) => (
  <div key={meal.idMeal} className="instruction-block">
    <h3>{meal.strMeal}</h3>
    <p>{meal.strInstructions}</p>
  </div>
))}

        </>
      )}
    </div>
  );
};

export default FavoriteRecipesPage;
