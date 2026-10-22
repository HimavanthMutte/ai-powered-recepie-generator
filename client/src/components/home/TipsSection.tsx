import type { JSX } from "react";

const tips = [
  {
    icon: "wb_sunny",
    title: "Good Lighting",
    description: "Bright, natural kitchen daylight yields the sharpest ingredient detection and color calibration.",
  },
  {
    icon: "grid_view",
    title: "Visible Ingredients",
    description: "Spread produce slightly on your counter so stems, labels, and hidden items aren't completely covered.",
  },
  {
    icon: "filter_alt",
    title: "Smart Filtering",
    description: "Cookware, chef knives, cutting boards, and countertop patterns are automatically filtered out.",
  },
];

export default function TipsSection(): JSX.Element {
  return (
    <section id="tips" className="rounded-2xl border border-[#E2DED6] bg-[#F4F1EA]/80 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-xl text-[#367D49]">lightbulb</span>
        <h2 className="font-serif text-xl font-medium text-[#191C1A]">
          Tips for Highest Recognition Accuracy
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tips.map((tip) => (
          <article key={tip.title} className="flex flex-col gap-2 rounded-xl border border-[#E2DED6]/80 bg-white p-5 shadow-sm">
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF5EE] text-[#367D49]">
              <span className="material-symbols-outlined text-lg">{tip.icon}</span>
            </div>
            <h3 className="text-sm font-semibold text-[#191C1A]">{tip.title}</h3>
            <p className="text-xs leading-relaxed text-[#5C645D]">{tip.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
