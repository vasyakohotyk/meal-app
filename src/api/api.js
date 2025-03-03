import axios from "axios";

const API_URL = "https://www.themealdb.com/api/json/v1/1/";

export const fetchMeals = async ({ queryKey }) => {
    const [_key, { query, page }] = queryKey;
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query || ''}&page=${page || 1}`
    );
    return response.data; // Повертаємо всю відповідь
  };

export const fetchMealById = async (id) => {
  const response = await axios.get(`${API_URL}lookup.php?i=${id}`);
  return response.data.meals[0];
};
