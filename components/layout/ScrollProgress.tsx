"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getIsMobile } from "@/hooks/useIsMobile";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || getIsMobile()) return;

    const node = barRef.current;
    if (!node) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    node.style.transformOrigin = "left center";
    node.style.transform = "scaleX(0)";

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        node.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  if (typeof window !== "undefined" && getIsMobile()) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent">
      <div ref={barRef} className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] will-change-transform" />
    </div>
  );
}
