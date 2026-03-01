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
        size: 1 + fract(Math.sin(seed * 1.3) * 12345.6789) * 2,
        duration: 8 + fract(Math.sin(seed * 1.7) * 24680.1357) * 12,
        delay: fract(Math.sin(seed * 2.1) * 97531.8642) * 10,
        opacity: 0.1 + fract(Math.sin(seed * 2.7) * 86420.2468) * 0.2,
      };
    }),
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const dots = containerRef.current.querySelectorAll<HTMLSpanElement>(".particle-dot");

    dots.forEach((dot, i) => {
      const p = particles[i];
      if (!p) return;

      gsap.fromTo(
        dot,
        { y: "100vh", x: 0, scale: 0, opacity: 0 },
        {
          y: "-10vh",
          x: `random(-20, 20)`,
          scale: "random(0.5, 1)",
          opacity: p.opacity,
          duration: p.duration,
          delay: p.delay,
          repeat: -1,
          ease: "none",
        },
      );
    });

    return () => {
      dots.forEach((dot) => gsap.killTweensOf(dot));
    };
  }, [particles]);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-dot absolute rounded-full bg-[#dc2626]/15"
          style={{ left: `${p.x}%`, width: `${p.size}px`, height: `${p.size}px` }}
        />
      ))}
    </div>
  );
}
