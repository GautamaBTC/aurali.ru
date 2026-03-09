"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { shouldReduceMotionInBrowser } from "@/lib/motion";

type StaggerRevealConfig = {
  childSelector: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  duration?: number;
  observe?: boolean;
  revealed?: boolean;
};

export function useStaggerReveal(ref: RefObject<HTMLElement | null>, config: StaggerRevealConfig): void {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = Array.from(container.querySelectorAll<HTMLElement>(config.childSelector));
    if (!children.length) return;

    children.forEach((child) => child.classList.add("reveal-item"));

    if (shouldReduceMotionInBrowser()) {
      children.forEach((child) => {
        child.classList.add("is-revealed", "is-in-view");
        gsap.set(child, { clearProps: "all" });
      });

      return () => {
        children.forEach((child) => child.classList.remove("reveal-item"));
      };
    }

    const fromVars: gsap.TweenVars = {
      y: 24,
      autoAlpha: 0,
      ...(config.from ?? {}),
    };

    const toVars: gsap.TweenVars = {
      y: 0,
      autoAlpha: 1,
      duration: config.duration ?? 0.4,
      stagger: config.stagger ?? 0.06,
      ease: "power2.out",
      overwrite: "auto",
      ...(config.to ?? {}),
      onStart: () => {
        children.forEach((child) => child.classList.add("is-revealed", "is-in-view"));
      },
      onComplete: () => {
        children.forEach((child) => {
          child.style.willChange = "auto";
        });
      },
    };

    if (config.revealed) {
      gsap.killTweensOf(children);
      gsap.set(children, { willChange: "transform,opacity" });
      gsap.fromTo(children, fromVars, toVars);
    } else if (config.observe) {
      children.forEach((child) => {
        child.classList.remove("is-revealed");
        gsap.set(child, fromVars);
      });
    }

    return () => {
      gsap.killTweensOf(children);
      children.forEach((child) => child.classList.remove("reveal-item"));
    };
  }, [config.childSelector, config.duration, config.from, config.observe, config.revealed, config.stagger, config.to, ref]);
}
