"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotionInBrowser } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function useGlobalReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = shouldReduceMotionInBrowser();
    const targets = gsap.utils.toArray<HTMLElement>(".reveal-section, .reveal-item");
    if (!targets.length) return;

    if (reduce) {
      targets.forEach((el) => {
        el.classList.add("is-revealed", "is-in-view");
        gsap.set(el, { clearProps: "all" });
      });
      return;
    }

    gsap.set(targets, { autoAlpha: 0, y: 40, willChange: "transform,opacity" });

    const trigger = ScrollTrigger.batch(targets, {
      start: "top 85%",
      once: true,
      onEnter: (elements) => {
        gsap.to(elements, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.08,
          overwrite: "auto",
          onStart: () => {
            elements.forEach((el) => {
              el.classList.add("is-revealed", "is-in-view");
            });
          },
          onComplete: () => {
            elements.forEach((el) => {
              (el as HTMLElement).style.willChange = "auto";
            });
          },
        });
      },
    });

    const inViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in-view");
          else entry.target.classList.remove("is-in-view");
        });
      },
      { threshold: 0.05 },
    );

    targets.forEach((target) => inViewObserver.observe(target));

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      inViewObserver.disconnect();
      trigger.forEach((item) => item.kill());
    };
  }, []);
}
