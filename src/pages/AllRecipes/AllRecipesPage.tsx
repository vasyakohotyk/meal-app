import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchMeals } from '../../api/api';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import RecipeCard from '../../component/RecipeCard';
import './AllRecipes.css';
import { ClipLoader } from 'react-spinners';
import Pagination from '../../component/Pagination/Pagination';

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
  const [searchQuery, setSearchQuery] = useState<string>(localStorage.getItem('searchQuery') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(localStorage.getItem('selectedCategory') || '');

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [searchQuery, selectedCategory]);

  

  //@ts-ignore
  const { data, isLoading, isError }: { data: MealsData | any, isLoading: boolean, isError: boolean } = useQuery({
    queryKey: ['meals', { query: searchQuery, page, category: selectedCategory, limit: 5 }],
    queryFn: fetchMeals,
    keepPreviousData: true,
    enabled: true, 
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  
  const filteredMeals = useMemo(() => {
    if (!data?.meals) return [];
    return searchQuery.length > 0
      ? data.meals.filter((meal: any) => meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase()))
      : data.meals; 
  }, [data, searchQuery, selectedCategory]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="recipes-page">
      <h1 className="page-title">All Recipes</h1>

      <div className="search-filter">
        <input
          className="search-input"
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search for recipes..."
          value={searchQuery}
        />
        <select
  className="category-select"
  onChange={(e) => setSelectedCategory(e.target.value)}
  value={selectedCategory}
>
  <option value="">All Categories</option>
  {categoriesData?.categories.map((category) => (
    <option key={category.strCategory} value={category.strCategory}>
      {category.strCategory}
    </option>
  ))}
</select>


        <Link to="/favorites" className="favorites-button">
          Go to Favorites
        </Link>
      </div>

     
      {isLoading ? (
        <div className="loader-container">
          <ClipLoader className='' color="#36d7b7" size={50} />
        </div>
      ) : (
        <div className="recipes">
        
          {searchQuery.length === 0 ? (
            data?.meals?.map((meal: any) => (
              <RecipeCard key={meal.idMeal} meal={meal} onRemove={() => {}} />
            ))
          ) : (
            filteredMeals.length > 0 ? (
              filteredMeals.map((meal: any) => (
                <RecipeCard key={meal.idMeal} meal={meal} onRemove={() => {}} />
              ))
            ) : (
              <div className="no-recipes-container">No recipes found</div>
            )
          )}
        {filteredMeals.length > 10 &&
         <div className='pagin'>
           <Pagination  totalPages={67} currentPage={page} onPageChange={handlePageChange}/>
         </div>
         
         }
        </div>
      )}
    </div>
  );
};

export default AllRecipesPage;
