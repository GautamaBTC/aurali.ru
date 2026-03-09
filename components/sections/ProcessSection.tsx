"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    from: { y: 70, autoAlpha: 0 },
    duration: 0.65,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: "[data-process-line]",
    from: { scaleY: 0, autoAlpha: 0, transformOrigin: "top center" },
    to: { scaleY: 1, autoAlpha: 1 },
    duration: 0.55,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".process-step",
    from: { y: 40, x: -60, autoAlpha: 0 },
    to: { y: 0, x: 0, autoAlpha: 1 },
    stagger: 0.15,
    duration: 0.65,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} id="process" className="reveal-section section-padding">
      <div className="container-shell">
        <h2 className="reveal-item text-3xl font-bold leading-tight tracking-tight md:text-4xl">Как мы работаем</h2>
        <div className="relative mt-8">
          <div
            data-process-line
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-3 top-4 hidden w-px bg-gradient-to-b from-[var(--accent)]/70 via-[var(--accent-2)]/50 to-transparent sm:block"
          />
          <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {processSteps.map((step) => (
              <li key={step.id} className="process-step reveal-item card-surface relative rounded-xl p-6 md:p-8">
                <p className="font-mono text-sm leading-normal text-zinc-500">{"Шаг"} {step.id}</p>
                <h3 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{step.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

