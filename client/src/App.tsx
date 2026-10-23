import type { ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useRecipe } from "./context/RecipeContext";
import HomePage from "./pages/HomePage";
import Review from "./pages/Review";
import GenerateSuggestions from "./pages/GenerateSuggestions";
import RecipeResult from "./pages/RecipeResult";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetail from "./pages/RecipeDetail";

// Route guard: Users cannot visit ANY route except Home ('/') unless an image is uploaded
function RequireImage({ children }: { children: ReactNode }) {
  const { photoUrl } = useRecipe();
  const location = useLocation();

  if (!photoUrl) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          notice: "Please upload or choose a kitchen photo first to proceed.",
          from: location.pathname,
        }}
      />
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#191C1A]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/review"
          element={
            <RequireImage>
              <Review />
            </RequireImage>
          }
        />
        <Route
          path="/suggestions"
          element={
            <RequireImage>
              <GenerateSuggestions />
            </RequireImage>
          }
        />
        <Route
          path="/recipe"
          element={
            <RequireImage>
              <RecipeResult />
            </RequireImage>
          }
        />
        <Route
          path="/saved"
          element={
            <RequireImage>
              <SavedRecipes />
            </RequireImage>
          }
        />
        <Route
          path="/saved/:id"
          element={
            <RequireImage>
              <RecipeDetail />
            </RequireImage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
