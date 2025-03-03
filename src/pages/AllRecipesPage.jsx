import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeals } from '../api/api';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import Pagination from '../component/Pagination';
import RecipeCard from '../component/RecipeCard'; // Імпортуємо компонент картки рецепту
import './AllRecipes.css';

const AllRecipesPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchChange = debounce((query) => {
    setSearchQuery(query);
    setPage(1); // Скидання сторінки на 1 при зміні запиту пошуку
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['meals', { query: searchQuery, page, category: selectedCategory, limit: 5 }],
    queryFn: fetchMeals,
    keepPreviousData: true,
  });

  const filteredMeals = useMemo(() => {
    if (!data?.meals) return [];
    return selectedCategory
      ? data.meals.filter((meal) => meal.strCategory === selectedCategory)
      : data.meals;
  }, [data, selectedCategory]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!data || !data.meals) return <div>No recipes found</div>;

  return (
    <div className="recipes-page">
      <h1 className="page-title">All Recipes</h1>

      {/* Пошук та фільтрація */}
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
          {Array.from(new Set(data.meals.map((meal) => meal.strCategory))).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Кнопка "Go to Favorites" */}
        <Link to="/favorites" className="favorites-button">
          Go to Favorites
        </Link>
      </div>

      <div className="recipes">
        {filteredMeals.map((meal) => (
          <RecipeCard key={meal.idMeal} meal={meal} /> // Використовуємо компонент картки
        ))}
      </div>

      {/* Пагінація */}
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
