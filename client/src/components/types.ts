export type SampleKitchen = {
  id: "countertop" | "crisper" | "pantry";
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  description: string;
  scanLabel: string;
};

export type ScanStatus = {
  sourceName: string;
  progress: number;
  message: string;
};
