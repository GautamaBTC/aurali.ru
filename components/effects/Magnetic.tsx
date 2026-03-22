"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !finePointer) return;

    const toX = gsap.quickTo(node, "x", { duration: 0.32, ease: "power3.out" });
    const toY = gsap.quickTo(node, "y", { duration: 0.32, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      toX(relX * strength);
      toY(relY * strength);
    };

    const onLeave = () => {
      toX(0);
      toY(0);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      gsap.set(node, { x: 0, y: 0 });
    };
  }, [finePointer, reduced, strength]);

  return (
    <div ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </div>
  );
}
