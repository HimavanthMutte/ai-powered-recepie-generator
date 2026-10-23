import { useRef, useState, type ChangeEvent, type DragEvent, type JSX } from "react";

type UploadDropzoneProps = {
  onScan: (sourceName: string, file?: File) => void;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export default function UploadDropzone({ onScan }: UploadDropzoneProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = (file?: File) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, WEBP, or HEIC image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Your image must be 25MB or smaller.");
      return;
    }
    setError("");
    onScan(file.name, file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <section id="scan" className="mb-16">
      <input
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        type="file"
        onChange={handleInputChange}
      />

      <div
        onClick={openFilePicker}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md sm:p-12 md:p-16 ${
          isDragging
            ? "border-[#56A068] bg-[#EAF5EE]/70"
            : "border-[#E2DED6] bg-white hover:border-[#56A068]/60"
        }`}
      >
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF5EE] text-[#367D49] shadow-inner transition-transform duration-300 group-hover:scale-105">
            <span className="material-symbols-outlined text-4xl">photo_camera</span>
          </div>
          <h2 className="mb-2 text-xl font-medium text-[#191C1A] sm:text-2xl">
            Drag and drop your kitchen photo, or browse
          </h2>
          <p className="mb-8 text-sm text-[#5C645D]">
            Supports JPG, PNG, WEBP up to 10MB
          </p>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#56A068] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#478B59] active:scale-[0.99] sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              Take Photo / Browse Files
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2DED6] bg-[#F4F1EA] px-5 py-3.5 text-sm font-medium text-[#191C1A] transition-all hover:bg-[#ECE8DF] active:scale-[0.99] sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              Select File
            </button>
          </div>

          {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
