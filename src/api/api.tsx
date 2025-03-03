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
  totalResults: number;
}

export const fetchMeals = async ({ queryKey }: { queryKey: [string, FetchMealsParams] }): Promise<MealsResponse> => {
  const [_key, { query, category }] = queryKey;

  if (category) {
    // 1️⃣ Отримуємо список страв у цій категорії
    const response = await axios.get<{ meals: { idMeal: string }[] }>(
      `${API_URL}filter.php?c=${category}`
    );

    if (!response.data.meals) return { meals: [], totalResults: 0 };

    // 2️⃣ Для кожного ID страви отримуємо деталі через lookup.php?i=...
    const detailedMeals = await Promise.all(
      response.data.meals.map(async (meal) => {
        const mealResponse = await axios.get<{ meals: Meal[] }>(
          `${API_URL}lookup.php?i=${meal.idMeal}`
        );
        return mealResponse.data.meals[0]; // Повертаємо перший (єдиний) результат
      })
    );

    return { meals: detailedMeals, totalResults: detailedMeals.length };
  } else {
    // Якщо категорія не вибрана, використовуємо стандартний пошук
    const response = await axios.get<MealsResponse>(`${API_URL}search.php?s=${query || ""}`);
    return response.data;
  }
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
