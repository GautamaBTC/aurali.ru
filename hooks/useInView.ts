"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type InViewOptions = {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
};

export function useInView(options: InViewOptions = {}): [RefObject<HTMLDivElement | null>, boolean] {
  const { threshold = 0.2, once = true, rootMargin = "0px" } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}
