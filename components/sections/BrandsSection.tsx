"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { brands } from "@/data/brands";

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    from: { y: 40, autoAlpha: 0 },
    duration: 0.4,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".brand-chip",
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
    stagger: { each: 0.06, from: "center" },
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} className="reveal-section section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">С какими марками работаем</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          {"Европейские, корейские, японские и китайские автомобили. Подбираем решения под конкретную платформу."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
          {brands.map((brand) => (
            <span
              key={brand.id}
              className="brand-chip rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

