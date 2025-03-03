// useAddToFavorites.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meal) => {
      const favorites = queryClient.getQueryData(['favorites']) || [];
      const updatedFavorites = [...favorites, meal];
      queryClient.setQueryData(['favorites'], updatedFavorites);
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
    },
  });
};

export default useAddToFavorites;
