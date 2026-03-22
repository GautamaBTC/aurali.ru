"use client";

import { useEffect, useState, type RefObject } from "react";
import { shouldReduceMotionInBrowser } from "@/lib/motion";

type RevealConfig = {
  threshold?: number;
  once?: boolean;
  onReveal?: () => void;
  [key: string]: unknown;
};

export function useReveal(ref: RefObject<HTMLElement | null>, config: RevealConfig = {}): boolean {
  const [revealed, setRevealed] = useState(false);
  const { threshold = 0.15, once = true, onReveal } = config;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (shouldReduceMotionInBrowser()) {
      node.classList.add("is-revealed", "is-in-view");
      const frame = window.requestAnimationFrame(() => {
        setRevealed(true);
        onReveal?.();
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-in-view", "is-revealed");
          setRevealed(true);
          onReveal?.();
          if (once) observer.disconnect();
        } else if (!once) {
          node.classList.remove("is-in-view", "is-revealed");
          setRevealed(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, onReveal, ref, threshold]);

  return revealed;
}
