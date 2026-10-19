import { useEffect, useRef, useState, type JSX } from "react";
import Header from "../components/Header";
import WorkflowStepper from "../components/WorkflowStepper";
import HeroSection from "../components/HeroSection";
import UploadDropzone from "../components/UploadDropzone";
import SampleKitchenSection from "../components/SampleKitchenSection";
import TipsSection from "../components/TipsSection";
import ProcessingOverlay from "../components/ProcessingOverlay";
import type { SampleKitchen, ScanStatus } from "../components/types";

const scanStages = [
  { progress: 35, message: "Calibrating kitchen illumination…" },
  { progress: 65, message: "Segmenting raw produce and pantry staples…" },
  { progress: 88, message: "Discarding cookware and background items…" },
  { progress: 100, message: "Ingredient identification complete!" },
];

export default function HomePage(): JSX.Element {
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
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

  const startScan = (sourceName: string) => {
    clearScanTimers();
    stageIndexRef.current = 0;
    setScanComplete(false);
    setScanStatus({
      sourceName,
      progress: 15,
      message: `Ingesting ${sourceName}…`,
    });
    setIsScanning(true);

    timerRef.current = setInterval(() => {
      const stage = scanStages[stageIndexRef.current];
      if (!stage) {
        clearScanTimers();
        completionRef.current = setTimeout(() => {
          setIsScanning(false);
          setScanComplete(true);
          window.alert("Vision scan complete! 7 ingredients identified. Ready for Step 2: Review Ingredients.");
        }, 500);
        return;
      }

      setScanStatus((current) =>
        current ? { ...current, progress: stage.progress, message: stage.message } : current,
      );
      stageIndexRef.current += 1;

      if (stageIndexRef.current === scanStages.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        completionRef.current = setTimeout(() => {
          setIsScanning(false);
          setScanComplete(true);
          window.alert("Vision scan complete! 7 ingredients identified. Ready for Step 2: Review Ingredients.");
        }, 500);
      }
    }, 500);
  };

  const cancelScan = () => {
    clearScanTimers();
    setIsScanning(false);
    setScanStatus(null);
    setScanComplete(false);
  };

  const handleSampleSelect = (sample: SampleKitchen) => {
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
        {scanComplete && (
          <p role="status" className="mt-6 rounded-xl border border-[#CFE3D1] bg-[#EAF5EE] p-4 text-sm font-medium text-[#285C36]">
            Demo scan complete. The next step would be ingredient review.
          </p>
        )}
      </main>
      <ProcessingOverlay isOpen={isScanning} status={scanStatus} onCancel={cancelScan} />
    </div>
  );
}
