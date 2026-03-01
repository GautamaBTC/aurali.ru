"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMenuStore } from "@/hooks/useMenuStore";
import { DURATION, EASE, createBurgerMorphTimeline, createMenuOpenTimeline } from "@/lib/animations";

type MenuRefs = {
  overlay: HTMLDivElement | null;
  items: HTMLAnchorElement[];
  divider: HTMLDivElement | null;
  footer: HTMLDivElement | null;
  lineTop: HTMLSpanElement | null;
  lineMid: HTMLSpanElement | null;
  lineBot: HTMLSpanElement | null;
  burgerBtn: HTMLButtonElement | null;
};

export function useMenuAnimations() {
  const refs = useRef<MenuRefs>({
    overlay: null,
    items: [],
    divider: null,
    footer: null,
    lineTop: null,
    lineMid: null,
    lineBot: null,
    burgerBtn: null,
  });

  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const burgerTl = useRef<gsap.core.Timeline | null>(null);

  const isOpen = useMenuStore((s) => s.isOpen);
  const setAnimating = useMenuStore((s) => s.setAnimating);

  const buildTimelines = useCallback(() => {
    const r = refs.current;
    menuTl.current?.kill();
    burgerTl.current?.kill();

    if (r.overlay && r.items.length > 0) {
      menuTl.current = createMenuOpenTimeline(r.overlay, r.items, r.divider, r.footer);
    }
    if (r.lineTop && r.lineMid && r.lineBot && r.burgerBtn) {
      burgerTl.current = createBurgerMorphTimeline(r.lineTop, r.lineMid, r.lineBot, r.burgerBtn);
    }
  }, []);

  useEffect(() => {
    if (!menuTl.current || !burgerTl.current) buildTimelines();
    const mt = menuTl.current;
    const bt = burgerTl.current;
    if (!mt || !bt) return;

    const supportsViewTransitions = typeof document !== "undefined" && "startViewTransition" in document;

    if (isOpen) {
      const doOpen = () => {
        if (refs.current.overlay) gsap.set(refs.current.overlay, { visibility: "visible", pointerEvents: "auto" });
        bt.play();
        mt.play();

        const maxDuration = Math.max(bt.duration(), mt.duration());
        gsap.delayedCall(maxDuration + 0.1, () => {
          setAnimating(false);
          refs.current.items[0]?.focus();
        });
      };

      if (supportsViewTransitions) (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(doOpen);
      else doOpen();
    } else {
      const doClose = () => {
        bt.reverse();
        const items = [...refs.current.items].reverse();
        gsap.to(items, {
          x: 20,
          opacity: 0,
          scale: 0.95,
          duration: DURATION.itemExit,
          stagger: DURATION.staggerReverse,
          ease: EASE.smooth,
          onComplete: () => {
            mt.pause(0);
            if (refs.current.overlay) gsap.set(refs.current.overlay, { visibility: "hidden", pointerEvents: "none", autoAlpha: 0 });
            gsap.set(refs.current.items, { x: -30, opacity: 0, scale: 0.95 });
            if (refs.current.divider) gsap.set(refs.current.divider, { scaleX: 0, opacity: 0 });
            if (refs.current.footer) gsap.set(refs.current.footer, { y: 20, opacity: 0 });
            setAnimating(false);
            refs.current.burgerBtn?.focus();
          },
        });
        if (refs.current.footer) gsap.to(refs.current.footer, { y: 10, opacity: 0, duration: 0.3, ease: EASE.smooth });
        if (refs.current.divider) gsap.to(refs.current.divider, { scaleX: 0, opacity: 0, duration: 0.3, ease: EASE.smooth });
      };

      if (supportsViewTransitions) (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(doClose);
      else doClose();
    }
  }, [isOpen, buildTimelines, setAnimating]);

  const setOverlayRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.overlay = el;
    if (el) gsap.set(el, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
  }, []);
  const addItemRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
    if (el) refs.current.items[index] = el;
  }, []);
  const setDividerRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.divider = el;
  }, []);
  const setFooterRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.footer = el;
  }, []);
  const setLineTopRef = useCallback((el: HTMLSpanElement | null) => {
    refs.current.lineTop = el;
  }, []);
  const setLineMidRef = useCallback((el: HTMLSpanElement | null) => {
    refs.current.lineMid = el;
  }, []);
  const setLineBotRef = useCallback((el: HTMLSpanElement | null) => {
    refs.current.lineBot = el;
  }, []);
  const setBurgerRef = useCallback((el: HTMLButtonElement | null) => {
    refs.current.burgerBtn = el;
  }, []);

  return {
    setOverlayRef,
    addItemRef,
    setDividerRef,
    setFooterRef,
    setLineTopRef,
    setLineMidRef,
    setLineBotRef,
    setBurgerRef,
    buildTimelines,
  };
}
