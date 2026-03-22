"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

type Particle = {
  id: number;
  x: string;
  y: string;
  size: number;
  opacity: number;
  delay: string;
  color: string;
};

type ParallaxParticlesProps = {
  count?: number;
  colors?: string[];
  className?: string;
};

export function ParallaxParticles({
  count = 30,
  colors = ["bg-[var(--accent)]", "bg-[var(--accent-2)]", "bg-white"],
  className,
}: ParallaxParticlesProps) {
  const seeded = (seed: number): number => {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${seeded(i + 1) * 100}%`,
      y: `${seeded(i + 17) * 100}%`,
      size: seeded(i + 29) * 3 + 1,
      opacity: seeded(i + 41) * 0.4 + 0.1,
      delay: `${seeded(i + 53) * 5}s`,
      color: colors[Math.floor(seeded(i + 71) * colors.length)] ?? colors[0] ?? "bg-white",
    }));
  }, [colors, count]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={cn("absolute rounded-full animate-parallax-twinkle", particle.color)}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
