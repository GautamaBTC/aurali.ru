"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { advantages } from "@/data/advantages";
import { BrandWordmark } from "@/components/ui/BrandWordmark";

export function AdvantagesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.CLIP_LEFT,
    from: { clipPath: "inset(0 100% 0 0)", autoAlpha: 0.04 },
    to: { clipPath: "inset(0 0% 0 0)", autoAlpha: 1 },
    duration: 0.75,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".adv-card",
    from: { rotateY: 15, autoAlpha: 0, transformPerspective: 900 },
    to: { rotateY: 0, autoAlpha: 1 },
    stagger: 0.12,
    duration: 0.55,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} id="advantages" className="reveal-section section-padding">
      <div className="container-shell">
            <h2 className="reveal-item text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Почему выбирают <BrandWordmark />
            </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {advantages.map((advantage) => (
            <article key={advantage.id} className="adv-card reveal-item card-surface rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold leading-snug md:text-3xl">{advantage.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{advantage.description}</p>
              {advantage.stat ? <p className="mt-4 font-mono text-base text-[var(--accent-2)] md:text-lg">{advantage.stat}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

