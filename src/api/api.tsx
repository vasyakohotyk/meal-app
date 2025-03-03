import axios from "axios";

const API_URL = "https://www.themealdb.com/api/json/v1/1/";

// Типи для параметрів запиту
interface FetchMealsParams {
  query: string;
  page: number;
  category:string;
}

// Тип для результату запиту
interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  // Додати інші поля, які повертаються API, якщо потрібно
}

// Тип для результату пошуку
interface MealsResponse {
  meals: Meal[];
}

export const fetchMeals = async ({ queryKey }: { queryKey: [string, FetchMealsParams] }): Promise<MealsResponse> => {
  const [_key, { query, page, category }] = queryKey;

  const url = category
    ? `${API_URL}filter.php?c=${category}`
    : `${API_URL}search.php?s=${query || ""}&page=${page || 1}`;

  console.log("Fetching meals from:", url);

  const response = await axios.get<MealsResponse>(url);
  return response.data;
};





export const fetchMealById = async (id: string | undefined): Promise<Meal | undefined> => {
  if (!id) return undefined;

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('API Response:', data); // ДОДАНО ЛОГ
    return data.meals ? data.meals[0] : undefined;
  } catch (error) {
    console.error('Error fetching meal:', error);
    return undefined;
  }
};


export const fetchCategories = async (): Promise<{ categories: { strCategory: string }[] }> => {
  const response = await axios.get(`${API_URL}categories.php`);
  return response.data;
};
