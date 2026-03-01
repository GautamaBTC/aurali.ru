"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";

type MagneticOptions = {
  strength?: number;
  ease?: number;
  disabled?: boolean;
};

export function useMagneticHover<T extends HTMLElement>(options: MagneticOptions = {}): (node: T | null) => void {
  const ref = useRef<T | null>(null);
  const { strength = 4, ease = 0.3, disabled = false } = options;

  const setRef = useCallback((node: T | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = rect.width || 1;
      const pull = Math.min(dist / maxDist, 1);
      const moveX = (dx / maxDist) * strength * pull;
      const moveY = (dy / maxDist) * strength * pull;

      gsap.to(el, { x: moveX, y: moveY, duration: ease, ease: "power2.out" });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength, ease, disabled]);

  return setRef;
}
