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
  strInstructions: string;
  [key: string]: string | undefined;
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
        const ingredient = meal[`strIngredient${i}` as keyof Meal] as string;
        const measure = meal[`strMeasure${i}` as keyof Meal] as string;

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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '5px',
              padding: '40px',
            }}
          >
            {favorites.map((meal) => (
              <div
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                  backgroundColor: '#fff',
                  maxWidth: '400px',
                  minWidth: '300px',
                }}
                key={meal.idMeal}
                className="instruction-block"
              >
                <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                  {meal.strMeal}
                </h3>
                <p style={{ fontSize: '14px', color: '#555' }}>
                  {meal.strInstructions}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteRecipesPage;
