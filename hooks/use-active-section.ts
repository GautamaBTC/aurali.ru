"use client";

import { useEffect, useState } from "react";
import { getCurrentHeaderOffset } from "@/lib/navigation";

export function useActiveSection(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length) return;

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      observer?.disconnect();
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];
      if (!sections.length) return;

      const headerOffset = Math.round(getCurrentHeaderOffset());
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visible?.target?.id) setActiveSection(visible.target.id);
        },
        {
          threshold: 0.3,
          rootMargin: `-${headerOffset + 8}px 0px -50% 0px`,
        },
      );

      sections.forEach((section) => observer?.observe(section));
    };

    setupObserver();
    const onResize = () => setupObserver();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
}
