"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

export function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const [ref, inView] = useInView({ threshold: 0.35, once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;

    const duration = 800;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(value * progress);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, [inView, reduced, value]);

  const effectiveValue = inView && reduced ? value : display;
  const rounded = Number.isInteger(value) ? Math.round(effectiveValue).toString() : effectiveValue.toFixed(1);

  return (
    <div ref={ref}>
      <span className="font-mono text-3xl font-bold text-[var(--accent-2)]">{rounded}</span>
      <span className="text-xl text-[var(--text-secondary)]">{suffix}</span>
    </div>
  );
}
