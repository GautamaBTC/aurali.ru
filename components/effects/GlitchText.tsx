"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type GlitchTextProps = {
  children: string;
  className?: string;
};

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;

    const el = ref.current;
    let alive = true;
    const timers = new Set<number>();

    const schedule = (cb: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (alive) cb();
      }, delay);
      timers.add(id);
    };

    const stopBurst = () => {
      el.removeAttribute("data-glitch-active");
      el.removeAttribute("data-glitch-mode");
      el.style.removeProperty("--hero-glitch-duration");
    };

    const triggerBurst = () => {
      const mode = Math.random() < 0.38 ? "vanish" : "normal";
      const duration = 180 + Math.round(Math.random() * 260);
      el.style.setProperty("--hero-glitch-duration", `${duration}ms`);
      el.setAttribute("data-glitch-active", "true");
      el.setAttribute("data-glitch-mode", mode);
      schedule(stopBurst, duration + 80);
    };

    const scheduleCycle = () => {
      const cycleMs = 10_000;
      const burstCount = 3 + Math.floor(Math.random() * 4);

      const marks = Array.from({ length: burstCount }, () => 500 + Math.random() * (cycleMs - 1000)).sort(
        (a, b) => a - b,
      );

      marks.forEach((mark) => {
        schedule(triggerBurst, Math.round(mark));
      });

      const drift = Math.round((Math.random() - 0.5) * 1200);
      schedule(scheduleCycle, cycleMs + drift);
    };

    scheduleCycle();

    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      stopBurst();
    };
  }, [reduced]);

  return (
    <span ref={ref} className={`hero-glitch-text ${className}`.trim()} data-text={children}>
      {children}
    </span>
  );
}
