"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Particle = {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

export function MenuParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles] = useState<Particle[]>(
    Array.from({ length: 12 }, (_, i) => {
      const seed = i * 17 + 13;
      const fract = (v: number) => v - Math.floor(v);
      return {
        id: i,
        x: fract(Math.sin(seed) * 43758.5453) * 100,
        size: 1 + fract(Math.sin(seed * 1.3) * 12345.6789) * 2.5,
        duration: 10 + fract(Math.sin(seed * 1.7) * 24680.1357) * 15,
        delay: fract(Math.sin(seed * 2.1) * 97531.8642) * 8,
        opacity: 0.08 + fract(Math.sin(seed * 2.7) * 86420.2468) * 0.15,
      };
    }),
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const dots = containerRef.current.querySelectorAll<HTMLSpanElement>(".p-dot");

    dots.forEach((dot, i) => {
      const p = particles[i];
      if (!p) return;
      gsap.fromTo(
        dot,
        { y: "100vh", x: 0, scale: 0, opacity: 0 },
        {
          y: "-10vh",
          x: "random(-25, 25)",
          scale: "random(0.4, 1.2)",
          opacity: p.opacity,
          duration: p.duration,
          delay: p.delay,
          repeat: -1,
          ease: "none",
        },
      );
    });

    return () => {
      dots.forEach((d) => gsap.killTweensOf(d));
    };
  }, [particles]);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden md:hidden" aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className="p-dot absolute rounded-full bg-[var(--accent-2)]/20" style={{ left: `${p.x}%`, width: `${p.size}px`, height: `${p.size}px` }} />
      ))}
    </div>
  );
}
