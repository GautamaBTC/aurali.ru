"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";

type UseScrollTriggerOptions = {
  enabled?: boolean;
  create: () => ScrollTrigger | null;
};

export function useScrollTrigger(options: UseScrollTriggerOptions): void {
  const { enabled = true, create } = options;
  useGSAP();

  useEffect(() => {
    if (!enabled) return;
    const trigger = create();
    return () => {
      trigger?.kill();
    };
  }, [enabled, create]);
}
