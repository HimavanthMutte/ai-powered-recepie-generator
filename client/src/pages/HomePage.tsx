import { useEffect, useRef, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import WorkflowStepper from "../components/home/WorkflowStepper";
import HeroSection from "../components/home/HeroSection";
import UploadDropzone from "../components/home/UploadDropzone";
import SampleKitchenSection from "../components/home/SampleKitchenSection";
import TipsSection from "../components/home/TipsSection";
import ProcessingOverlay from "../components/home/ProcessingOverlay";
import type { SampleKitchen, ScanStatus } from "../components/types";
import { useRecipe } from "../context/RecipeContext";

const scanStages = [
  { progress: 25, message: "Calibrating kitchen illumination & focus…" },
  { progress: 55, message: "Segmenting raw produce and pantry staples…" },
  { progress: 85, message: "Discarding cookware and background items…" },
  { progress: 100, message: "Ingredient identification complete!" },
];

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { analyzeImage, setIngredients, setPhotoUrl } = useRecipe();

  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageIndexRef = useRef(0);

  const clearScanTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (completionRef.current) clearTimeout(completionRef.current);
    timerRef.current = null;
    completionRef.current = null;
  };

  useEffect(() => {
    return () => clearScanTimers();
  }, []);

  const startScan = async (sourceName: string, file?: File) => {
    clearScanTimers();
    stageIndexRef.current = 0;
    setScanStatus({
      sourceName,
      progress: 15,
      message: `Ingesting ${sourceName} into Groq Vision…`,
    });
    setIsScanning(true);

    // If actual file is provided, trigger the AI backend analyze call
    let analysisPromise: Promise<string[]> | null = null;
    if (file) {
      analysisPromise = analyzeImage(file, sourceName);
    }

    timerRef.current = setInterval(async () => {
      const stage = scanStages[stageIndexRef.current];
      if (!stage) {
        clearScanTimers();
        if (analysisPromise) {
          await analysisPromise.catch(() => {});
        }
        completionRef.current = setTimeout(() => {
          setIsScanning(false);
          navigate("/review");
        }, 400);
        return;
      }

      setScanStatus((current) =>
        current
          ? { ...current, progress: stage.progress, message: stage.message }
          : current,
      );
      stageIndexRef.current += 1;

      if (stageIndexRef.current === scanStages.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        if (analysisPromise) {
          await analysisPromise.catch(() => {});
        }
        completionRef.current = setTimeout(() => {
          setIsScanning(false);
          navigate("/review");
        }, 400);
      }
    }, 450);
  };

  const cancelScan = () => {
    clearScanTimers();
    setIsScanning(false);
    setScanStatus(null);
  };

  const handleSampleSelect = (sample: SampleKitchen) => {
    // Parse sample ingredients
    const sampleItems = sample.description
      .split(/[,.]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);

    if (sampleItems.length > 0) {
      setIngredients(sampleItems);
    }
    if (sample.image) {
      setPhotoUrl(sample.image);
    }

    startScan(sample.scanLabel);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans antialiased text-[#191C1A]">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">
        <WorkflowStepper currentStep={1} />
        <HeroSection />
        <UploadDropzone onScan={startScan} />
        <SampleKitchenSection onSelectSample={handleSampleSelect} />
        <TipsSection />
      </main>
      <ProcessingOverlay
        isOpen={isScanning}
        status={scanStatus}
        onCancel={cancelScan}
      />
    </div>
  );
}
