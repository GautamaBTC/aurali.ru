"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { cn } from "@/lib/cn";
import type { RevealDirection } from "@/lib/gsapPresets";

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
};

export function Reveal({ children, className, direction = "up" }: RevealProps) {
  const gsap = useGSAP();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fromVars =
      direction === "left"
        ? { autoAlpha: 0, x: -90, y: 0 }
        : direction === "right"
          ? { autoAlpha: 0, x: 90, y: 0 }
          : { autoAlpha: 0, y: 30, x: 0 };

    gsap.set(node, fromVars);

    const tween = gsap.to(node, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top 88%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [direction, gsap]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
