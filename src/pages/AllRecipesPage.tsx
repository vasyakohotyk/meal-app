import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeals } from '../api/api';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import Pagination from '../component/Pagination';
import RecipeCard from '../component/RecipeCard';
import './AllRecipes.css';

// Вказуємо типи як any для уникнення помилок
interface Meal {
  idMeal: string;
  strCategory: string;
  strMeal: string;
  strMealThumb: string;
}

interface MealsData {
  meals: Meal[];
  totalResults: number;
}

const AllRecipesPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSearchChange = debounce((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, 500);

  //@ts-ignore
  const { data, isLoading, isError }: { data: MealsData | any, isLoading: boolean, isError: boolean } = useQuery({
    queryKey: ['meals', { query: searchQuery, page, category: selectedCategory, limit: 5 }],
    queryFn: fetchMeals,
    keepPreviousData: true,
  });

  const filteredMeals = useMemo(() => {
    if (!data?.meals) return [];
    return selectedCategory
      ? data.meals.filter((meal: any) => meal.strCategory === selectedCategory)
      : data.meals;
  }, [data, selectedCategory]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!data || !data.meals) return <div>No recipes found</div>;

  return (
    <div className="recipes-page">
      <h1 className="page-title">All Recipes</h1>

      <div className="search-filter">
        <input
          className="search-input"
          type="text"
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search for recipes..."
        />
        <select
          className="category-select"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {Array.from(new Set(data.meals.map((meal: any) => meal.strCategory))).map((category: any) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <Link to="/favorites" className="favorites-button">
          Go to Favorites
        </Link>
      </div>

      <div className="recipes">
        {filteredMeals.map((meal: any) => (
          <RecipeCard key={meal.idMeal} meal={meal} onRemove={() => {}} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalItems={data.totalResults}
        limit={5}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllRecipesPage;
