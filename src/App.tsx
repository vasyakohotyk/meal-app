import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AllRecipesPage from './pages/AllRecipes/AllRecipesPage';
import SingleRecipePage from './pages/SingleRecipes/SingleRecipePage';
import FavoriteRecipesPage from './pages/FavoriteRecipes/FavoriteRecipesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AllRecipesPage />} />
          <Route path="/recipe/:id" element={<SingleRecipePage />} />
          <Route path="/favorites" element={<FavoriteRecipesPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
