import React, { useMemo } from 'react';
import useFavoriteStore from '../../store/useFavoriteStore';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RecipeCard from '../../component/RecipeCard';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';


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

const parseQuantity = (measure: string): { value: number; unit: string } => {
  const match = measure.match(/([\d.]+)\s*([a-zA-Z]*)/);
  if (match) {
    return { value: parseFloat(match[1]), unit: match[2] || '' };
  }
  return { value: 0, unit: measure };
};

const FavoriteRecipesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavoriteStore();

  const ingredientsList = useMemo<Ingredient[]>(() => {
    const ingredientsMap = new Map<string, { value: number; unit: string }>();

    favorites.forEach((meal: Meal) => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}` as keyof Meal] as string;
        const measure = meal[`strMeasure${i}` as keyof Meal] || '';

        if (ingredient) {
          const key = ingredient.toLowerCase();
          const { value, unit } = parseQuantity(measure);

          if (ingredientsMap.has(key)) {
            const existing = ingredientsMap.get(key)!;
            if (existing.unit === unit) {
              existing.value += value;
            } else {
              existing.value += value; // Якщо одиниці різні, просто додаємо (можливо, знадобиться покращити логіку)
            }
          } else {
            ingredientsMap.set(key, { value, unit });
          }
        }
      }
    });

    return Array.from(ingredientsMap.entries()).map(([name, { value, unit }]) => ({
      name,
      quantity: `${value} ${unit}`.trim(),
    }));
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
  
          {/* Контейнер для розташування двох блоків поруч */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {/* 🔹 Блок інгредієнтів */}
            <Card sx={{minWidth: 500, maxWidth: 500, margin: '0 auto', boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  Ingredients Needed for all dishhes
                </Typography>
                <List>
                  {ingredientsList.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={item.name}
                          secondary={item.quantity}
                          primaryTypographyProps={{ fontWeight: 'bold', fontSize: '16px' }}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                      {index !== ingredientsList.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
  
            {/* 🔹 Блок інструкцій */}
            <Card sx={{ maxWidth: 500, margin: '0 auto', boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  Cooking Instructions
                </Typography>
                <List>
                  {favorites.map((meal) => (
                    <React.Fragment key={meal.idMeal}>
                      <ListItem>
                        <ListItemText
                          primary={meal.strMeal}
                          secondary={meal.strInstructions}
                          primaryTypographyProps={{ fontWeight: 'bold', fontSize: '16px' }}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
  
};

export default FavoriteRecipesPage;
