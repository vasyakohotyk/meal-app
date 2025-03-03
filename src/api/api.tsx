import axios from "axios";

const API_URL = "https://www.themealdb.com/api/json/v1/1/";

// Типи для параметрів запиту
interface FetchMealsParams {
  query: string;
  page: number;
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
  const [_key, { query, page }] = queryKey;

  const response = await axios.get<MealsResponse>(
    `${API_URL}search.php?s=${query || ""}&page=${page || 1}`
  );

  return response.data; // Повертаємо всю відповідь
};

export const fetchMealById = async (id: string | undefined): Promise<Meal | undefined> => {
  if (!id) return undefined;
  const response = await fetch(`https://api.example.com/meal/${id}`);
  const data = await response.json();
  return data.meal || undefined;
};

