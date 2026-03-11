"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type CountUpProps = {
  end: number;
  duration?: number;
  suffix?: string;
  revealed?: boolean;
};

export function CountUp({ end, duration = 2000, suffix = "", revealed = false }: CountUpProps) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!revealed || hasRun.current) return;
    hasRun.current = true;

    if (reduced) return;

    const startTime = performance.now();
    let rafId = 0;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) rafId = window.requestAnimationFrame(update);
    };

    rafId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(rafId);
  }, [revealed, end, duration, reduced]);

  return (
    <span>
      {reduced ? end : value}
      {suffix}
    </span>
  );
}
