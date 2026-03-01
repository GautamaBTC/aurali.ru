"use client";

import { useEffect, useState } from "react";

export function useVisibility(elementRef: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handler = () => setIsPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => setIsVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [elementRef]);

  return { isActive: isVisible && isPageVisible };
}
