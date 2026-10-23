import { useState, type JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import WorkflowStepper from "../components/home/WorkflowStepper";
import HeroSection from "../components/home/HeroSection";
import UploadDropzone from "../components/home/UploadDropzone";
import SampleKitchenSection from "../components/home/SampleKitchenSection";
import TipsSection from "../components/home/TipsSection";
import type { SampleKitchen } from "../components/types";
import { useRecipe } from "../context/RecipeContext";
import { AlertCircle } from "lucide-react";

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { analyzeImage, setPhotoUrl, setIngredients, setIngredientItems } =
    useRecipe();

  const [routeNotice, setRouteNotice] = useState<string | null>(
    (location.state as { notice?: string })?.notice || null,
  );

  // Directly initiate vision analysis and navigate to /review
  const handleFileScan = async (_sourceName: string, file?: File) => {
    if (!file) return;

    // Immediately trigger analysis in context (sets preview photoUrl & isAnalyzing)
    analyzeImage(file);

    // Immediately navigate to /review route where user sees the model thinking indicator
    navigate("/review");
  };

  const handleSampleSelect = async (sample: SampleKitchen) => {
    if (sample.image) {
      setPhotoUrl(sample.image);
    }

    // Attempt to pass sample image to Groq Vision
    try {
      const response = await fetch(sample.image);
      const blob = await response.blob();
      analyzeImage(blob, sample.scanLabel);
    } catch {
      // Fallback to sample's ingredients if fetch fails
      const sampleItems = sample.description
        .split(/[,.]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2);

      if (sampleItems.length > 0) {
        setIngredients(sampleItems);
        setIngredientItems(
          sampleItems.map((name, idx) => ({
            id: `sample-${idx}`,
            name,
            origin: "scan",
            amount: "Sample pantry provision",
            category: "Fresh Produce",
            icon: "leaf",
          })),
        );
      }
    }

    // Immediately navigate to /review
    navigate("/review");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans antialiased text-[#191C1A]">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">
        {routeNotice && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <span>{routeNotice}</span>
            </div>
            <button
              onClick={() => setRouteNotice(null)}
              className="text-lg font-bold text-amber-700 hover:text-amber-900 px-2"
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        )}

        <WorkflowStepper currentStep={1} />
        <HeroSection />
        <UploadDropzone onScan={handleFileScan} />
        <SampleKitchenSection onSelectSample={handleSampleSelect} />
        <TipsSection />
      </main>
    </div>
  );
}
