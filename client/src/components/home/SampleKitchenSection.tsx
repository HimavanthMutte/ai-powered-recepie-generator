import type { JSX } from "react";
import type { SampleKitchen } from "../types";

import image3 from "../../assets/image-3.jpg";
import image1 from "../../assets/image-1.webp";

const samples: SampleKitchen[] = [
  {
    id: "countertop",
    image: image3,
    imageAlt: "Fresh kitchen ingredients on a marble countertop",
    badge: "Fresh Countertop Haul",
    title: "Market Countertop Provision",
    description:
      "black beans, fresh basil, olive oil, green olives, ribbon pasta, tomatoes, coarse salt, chickpeas, millets, black sesame seeds, tomato sauce, spiral pasta, nuts, cornmeal",
    scanLabel: "Market Countertop Provision",
  },
  {
    id: "crisper",
    image: image1,
    imageAlt: "Fresh vegetables in a refrigerator crisper drawer",
    badge: "Vegetable Crisper",
    title: "Crisper Drawer Reserve",
    description:
      "Orange bell peppers, crisp zucchini, slender carrots, purple radicchio and fresh cilantro.",
    scanLabel: "Vegetable Crisper Haul",
  },
  {
    id: "pantry",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLcxxYblKpV9t8GayL20BWwwDedorLYAAXsMUcLMjg9MjxqlPU0doE4GwD0c7w8rhre7Y6Y34h9UaM2r6UmACfRIEAKyYL3cjmW7Wm0OS0elyz2vspYHGk70Uwz6oC3eSmKQ7rFhM3e-Bc22CZYbUIOMPdiUPmgvTPTxKFfRsMu6dk0Mlovg8vgjgtiZ-KBgpmN2mxzp_TRFSK2hkssTBvt8a1m3hzQv2tVMdcg91kqJ-1rMJsuLttFg",
    imageAlt: "Pantry shelves with dry goods and spices",
    badge: "Pantry Staples",
    title: "Weekend Dry Goods",
    description:
      "Bronze-cut rigatoni, organic garbanzo beans, canned San Marzano tomatoes, shallots and chili flakes.",
    scanLabel: "Weekend Pantry Shelves",
  },
];

type SampleKitchenSectionProps = {
  onSelectSample: (sample: SampleKitchen) => void;
};

function SampleCard({
  sample,
  onSelect,
}: {
  sample: SampleKitchen;
  onSelect: (sample: SampleKitchen) => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(sample)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E2DED6] bg-white text-left transition-all duration-300 hover:border-[#56A068]/50 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F4F1EA]">
        <img
          alt={sample.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={sample.image}
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#191C1A] shadow-sm backdrop-blur-md">
          {sample.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-serif text-lg font-medium text-[#191C1A] transition-colors group-hover:text-[#367D49]">
            {sample.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#5C645D]">
            {sample.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#E2DED6]/70 pt-4">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#367D49] transition-transform group-hover:translate-x-0.5">
            Try this sample
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </span>
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-base text-[#5C645D]/40"
          >
            restaurant
          </span>
        </div>
      </div>
    </button>
  );
}

export default function SampleKitchenSection({
  onSelectSample,
}: SampleKitchenSectionProps): JSX.Element {
  return (
    <section id="samples" className="mb-16">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A73A00]">
            Fast Experimentation
          </span>
          <h2 className="mt-1 font-serif text-2xl font-medium text-[#191C1A]">
            No photo on hand? Try a sample kitchen provision
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {samples.map((sample) => (
          <SampleCard
            key={sample.id}
            sample={sample}
            onSelect={onSelectSample}
          />
        ))}
      </div>
    </section>
  );
}
