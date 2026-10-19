import type { JSX } from "react";
import type { ScanStatus } from "./types";

type ProcessingOverlayProps = {
  isOpen: boolean;
  status: ScanStatus | null;
  onCancel: () => void;
};

export default function ProcessingOverlay({
  isOpen,
  status,
  onCancel,
}: ProcessingOverlayProps): JSX.Element | null {
  if (!isOpen || !status) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-dialog-title"
    >
      <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-2xl border border-[#E2DED6] bg-white p-8 text-center shadow-2xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#56A068]/10 blur-2xl" />
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#56A068]/20" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF5EE] text-[#367D49] shadow-sm">
            <span className="material-symbols-outlined animate-pulse text-3xl">document_scanner</span>
          </div>
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#EAF5EE] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#367D49]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#56A068]" />
          CookCraft Vision AI
        </div>
        <h2 id="scan-dialog-title" className="mb-2 font-serif text-2xl font-medium text-[#191C1A]">
          Analyzing Kitchen Haul
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-[#5C645D]">
          Detecting pantry items, identifying fresh produce, and filtering out utensils and cookware…
        </p>

        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[#F4F1EA]">
          <div
            className="h-full rounded-full bg-[#56A068] transition-all duration-300"
            style={{ width: `${status.progress}%` }}
          />
        </div>
        <div className="mb-6 flex w-full justify-between gap-4 text-left font-mono text-xs text-[#5C645D]">
          <span>{status.message}</span>
          <span className="shrink-0 font-semibold text-[#367D49]">{status.progress}%</span>
        </div>
        <p className="mb-4 max-w-full truncate text-xs text-[#8A918A]" title={status.sourceName}>
          Source: {status.sourceName}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#E2DED6] px-4 py-2 text-sm font-medium text-[#5C645D] transition-colors hover:bg-[#F4F1EA] hover:text-[#191C1A]"
        >
          Cancel Scan
        </button>
      </div>
    </div>
  );
}
