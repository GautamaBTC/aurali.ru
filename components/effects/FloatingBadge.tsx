"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type FloatingBadgeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FloatingBadge({ children, className = "", delay = 0 }: FloatingBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduced) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay });
    tl.to(ref.current, {
      y: -6,
      duration: 2.5,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [reduced, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
