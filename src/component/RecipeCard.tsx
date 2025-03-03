import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  meal: {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
  };
  onRemove: (id: string) => void;
  showRemoveButton?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ meal, onRemove, showRemoveButton = false }) => {
  return (
    <div className="recipe-card">
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <h2>{meal.strMeal}</h2>
      <p>{meal.strCategory}</p>
      <p>{meal.strArea}</p>

      {/* Кнопка "View Recipe" */}
      <Link to={`/recipe/${meal.idMeal}`} className="recipe-link">
        <Button
          color="primary"
          variant="outlined"
          style={{
            marginBottom: '10px', // Відступ знизу
          }}
        >
          View Recipe
        </Button>
      </Link>

      {/* Кнопка "Remove" тільки для улюблених рецептів */}
      {showRemoveButton && (
        <Button
          color="error"
          className="recipe-card-button"
          style={{
            marginBottom: '10px', // Відступ знизу
            marginLeft: '2px',
          }}
          onClick={() => onRemove(meal.idMeal)}
        >
          Remove from Favorites
        </Button>
      )}
    </div>
  );
};

export default RecipeCard;
