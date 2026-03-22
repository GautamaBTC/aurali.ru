import { gsap } from "gsap";

export type RevealDirection = "up" | "left" | "right";

export function runRevealAnimation(target: Element, direction: RevealDirection = "up"): gsap.core.Tween {
  const fromVars =
    direction === "left"
      ? { autoAlpha: 0, x: -44, y: 0 }
      : direction === "right"
        ? { autoAlpha: 0, x: 44, y: 0 }
        : { autoAlpha: 0, y: 22, x: 0 };

  return gsap.fromTo(
    target,
    fromVars,
    { autoAlpha: 1, y: 0, x: 0, duration: 0.72, ease: "power2.out", overwrite: true },
  );
}
