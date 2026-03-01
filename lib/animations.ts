import { gsap } from "gsap";

export const EASE = {
  elastic: "elastic.out(1, 0.5)",
  smooth: "power2.out",
  expo: "expo.out",
  bounceIn: "back.in(2.5)",
  quint: "power4.inOut",
} as const;

export const DURATION = {
  morph: 0.4,
  menu: 0.5,
  stagger: 0.08,
  staggerReverse: 0.04,
  item: 0.5,
  itemExit: 0.3,
  footer: 0.5,
  glow: 0.3,
} as const;

export const BURGER = {
  width: 28,
  lineHeight: 2,
  gap: 6,
  get totalHeight() {
    return this.lineHeight * 3 + this.gap * 2;
  },
  get translateY() {
    return this.gap + this.lineHeight;
  },
} as const;

export function createMenuOpenTimeline(
  overlay: HTMLElement,
  items: HTMLElement[],
  divider: HTMLElement | null,
  footer: HTMLElement | null,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.expo } });

  tl.to(overlay, { autoAlpha: 1, duration: DURATION.menu, ease: EASE.smooth });
  tl.to(
    items,
    {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: DURATION.item,
      stagger: DURATION.stagger,
      ease: EASE.expo,
    },
    "-=0.3",
  );

  if (divider) {
    tl.to(divider, { scaleX: 1, opacity: 1, duration: 0.4, ease: EASE.expo }, "-=0.2");
  }

  if (footer) {
    tl.to(footer, { y: 0, opacity: 1, duration: DURATION.footer, ease: EASE.expo }, "-=0.3");
  }

  return tl;
}

export function createBurgerMorphTimeline(
  lineTop: HTMLElement,
  lineMid: HTMLElement,
  lineBot: HTMLElement,
  button: HTMLElement,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, defaults: { duration: DURATION.morph } });

  tl.to([lineTop, lineMid, lineBot], { scaleY: 0.7, duration: 0.12, ease: EASE.bounceIn });
  tl.to(
    lineTop,
    {
      y: BURGER.translateY,
      rotation: 45,
      scaleY: 1,
      backgroundColor: "#dc2626",
      boxShadow: "0 0 8px rgba(220,38,38,0.6), 0 0 20px rgba(220,38,38,0.3)",
      width: "100%",
      ease: EASE.elastic,
    },
    "+=0.02",
  );
  tl.to(
    lineMid,
    { scaleX: 0, opacity: 0, rotation: 90, duration: DURATION.morph * 0.6, ease: EASE.smooth },
    "<",
  );
  tl.to(
    lineBot,
    {
      y: -BURGER.translateY,
      rotation: -45,
      scaleY: 1,
      backgroundColor: "#dc2626",
      boxShadow: "0 0 8px rgba(220,38,38,0.6), 0 0 20px rgba(220,38,38,0.3)",
      width: "100%",
      ease: EASE.elastic,
    },
    "<",
  );
  tl.to(
    button,
    {
      backgroundColor: "rgba(220, 38, 38, 0.15)",
      borderColor: "rgba(220, 38, 38, 0.3)",
      duration: DURATION.glow,
      ease: EASE.smooth,
    },
    "-=0.15",
  );

  return tl;
}
