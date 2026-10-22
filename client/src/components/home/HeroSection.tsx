import type { JSX } from "react";

export default function HeroSection(): JSX.Element {
  return (
    <section className="mx-auto mb-10 max-w-3xl text-center">
      <h1 className="mb-3 font-serif text-3xl font-normal leading-tight tracking-tight text-[#191C1A] sm:text-4xl md:text-5xl">
        Upload a photo of your fridge or countertop
      </h1>
      <p className="text-base font-light leading-relaxed text-[#5C645D] sm:text-lg">
        Our culinary vision model identifies every ingredient instantly so you can cook delicious, zero-waste meals from what you already have.
      </p>
    </section>
  );
}
