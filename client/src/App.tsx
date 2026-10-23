import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Review from "./pages/Review";
import GenerateSuggestions from "./pages/GenerateSuggestions";
import RecipeResult from "./pages/RecipeResult";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetail from "./pages/RecipeDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/review" element={<Review />} />
        <Route path="/suggestions" element={<GenerateSuggestions />} />
        <Route path="/recipe" element={<RecipeResult />} />
        <Route path="/saved" element={<SavedRecipes />} />
        <Route path="/saved/:id" element={<RecipeDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
