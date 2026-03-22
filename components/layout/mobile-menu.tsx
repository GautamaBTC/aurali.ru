"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { BrandLogo } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site-config";
import { useLockScroll } from "@/hooks/use-lock-scroll";
import { resolveMotionOverride, shouldReduceMotionInBrowser } from "@/lib/motion";
import { MENU_ITEMS, scrollToSection } from "@/lib/navigation";

const HEADER_PHONE = "8 (921) 523-25-45";
const HEADER_PHONE_CHARS = Array.from(HEADER_PHONE);
const MENU_BACKGROUND_VIDEO_PATH = "/videos/videofon.mp4";
const MENU_EASE_LUX = "cubic-bezier(0.22, 1, 0.36, 1)";
const PHONE_NEON_MODE = "cta" as const;

const PHONE_NEON_PRESETS = {
  subtle: {
    waveSpeed: 0.72,
    glyphAmplitudeY: 2.2,
    glyphScaleAmplitude: 0.048,
    phoneLift: 0.42,
    phoneScale: 0.0055,
    accentOpacityBase: 0.28,
    accentOpacityAmp: 0.18,
    accentScaleBase: 0.96,
    accentScaleAmp: 0.05,
  },
  cta: {
    waveSpeed: 0.92,
    glyphAmplitudeY: 3.8,
    glyphScaleAmplitude: 0.086,
    phoneLift: 0.72,
    phoneScale: 0.0105,
    accentOpacityBase: 0.4,
    accentOpacityAmp: 0.26,
    accentScaleBase: 0.94,
    accentScaleAmp: 0.09,
  },
} as const;

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBurgerVisible, setIsBurgerVisible] = useState(false);
  const [isLogoIntroReady, setIsLogoIntroReady] = useState(false);
  const [activeId, setActiveId] = useState<string>("services");
  const [menuScale, setMenuScale] = useState(1);

  const mobileHeaderRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const lineTopRef = useRef<HTMLSpanElement | null>(null);
  const lineMidRef = useRef<HTMLSpanElement | null>(null);
  const lineBotRef = useRef<HTMLSpanElement | null>(null);
  const crossARef = useRef<HTMLSpanElement | null>(null);
  const crossBRef = useRef<HTMLSpanElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const topPhoneRef = useRef<HTMLAnchorElement | null>(null);
  const menuPhoneWrapRef = useRef<HTMLDivElement | null>(null);
  const menuActionsRef = useRef<HTMLDivElement | null>(null);
  const overlayVideoWrapRef = useRef<HTMLDivElement | null>(null);
  const overlayVideoRef = useRef<HTMLVideoElement | null>(null);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingAnchorRef = useRef<string | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const burgerTlRef = useRef<gsap.core.Timeline | null>(null);
  const burgerEntryTlRef = useRef<gsap.core.Timeline | null>(null);
  const openFocusTimerRef = useRef<number | null>(null);
  const logoAccentTimerRef = useRef<number | null>(null);
  const burgerEntryPlayedRef = useRef(false);
  const overlayAnimationBootedRef = useRef(false);

  useLockScroll(isLocked);

  useEffect(() => {
    const onLogoStart = () => setIsLogoIntroReady(true);
    const fallbackTimer = window.setTimeout(onLogoStart, 1200);
    const onBurgerStart = () => setIsBurgerVisible(true);
    window.addEventListener("ui:intro-logo", onLogoStart as EventListener);
    window.addEventListener("ui:intro-burger", onBurgerStart as EventListener);

    if (document.documentElement.dataset.introLogo === "true") {
      window.requestAnimationFrame(onLogoStart);
    }
    if (document.documentElement.dataset.introBurger === "true") {
      window.requestAnimationFrame(onBurgerStart);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("ui:intro-logo", onLogoStart as EventListener);
      window.removeEventListener("ui:intro-burger", onBurgerStart as EventListener);
    };
  }, []);

  useEffect(() => {
    const header = mobileHeaderRef.current
    if (!header) return

    let rafId = 0
    const applyHeaderState = () => {
      const progress = Math.min(window.scrollY / 180, 1)
      const blur = 10 + progress * 2
      const saturate = 110 + progress * 2

      header.style.opacity = "1"
      header.style.transform = "translateZ(0)"
      header.style.backgroundColor = "rgba(20,18,16,0.68)"
      header.style.backdropFilter = `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}%)`
      header.style.setProperty(
        '-webkit-backdrop-filter',
        `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}%)`,
      )
    }

    const onScroll = () => {
      if (isOpen) return
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(applyHeaderState)
    }

    applyHeaderState()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [isOpen])

  const buildBurgerTimeline = useCallback(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    const crossA = crossARef.current;
    const crossB = crossBRef.current;
    if (!top || !mid || !bot || !crossA || !crossB) return null;

    gsap.killTweensOf([top, mid, bot, crossA, crossB]);
    burgerTlRef.current?.kill();

    gsap.set([top, mid, bot], { transformOrigin: "50% 50%", filter: "none", opacity: 1 });
    gsap.set([top, mid, bot], { y: 0, rotate: 0, scaleX: 1 });
    gsap.set([crossA, crossB], {
      opacity: 0,
      rotate: 0,
      scale: 0.92,
      filter: "blur(3px)",
      transformOrigin: "50% 50%",
    });

    const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
    const tl = gsap.timeline({ paused: true });
    tl.to(top, { y: 14, x: 0, duration: 0.35, ease }, 0)
      .to(bot, { y: -14, x: -5, duration: 0.35, ease }, 0)
      .to([top, mid, bot], { opacity: 0, filter: "blur(4px)", duration: 0.4, ease }, 0.35)
      .to(crossA, { opacity: 1, rotate: 46, scale: 1, filter: "blur(0px)", duration: 0.4, ease }, 0.35)
      .to(crossB, { opacity: 1, rotate: -46, scale: 1, filter: "blur(0px)", duration: 0.4, ease }, 0.35);

    tl.eventCallback("onReverseComplete", () => {
      gsap.set([top, mid, bot], { opacity: 1, scaleX: 1, x: 0, y: 0, rotate: 0, filter: "none" });
      gsap.set([crossA, crossB], { opacity: 0, rotate: 0, scale: 0.92, filter: "blur(3px)" });
    });

    burgerTlRef.current = tl;
    return tl;
  }, []);

  useEffect(() => {
    const tl = burgerTlRef.current ?? buildBurgerTimeline();
    if (!tl) return;
    if (isOpen) {
      tl.timeScale(1);
      tl.play();
    } else {
      // 700ms open vs 750ms close
      tl.timeScale(0.9333333);
      tl.reverse();
    }
  }, [buildBurgerTimeline, isOpen]);

  useEffect(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!isBurgerVisible || !top || !mid || !bot || burgerEntryPlayedRef.current) return;

    const override = resolveMotionOverride(window.location.search);
    if (override === "force-reduced" || shouldReduceMotionInBrowser()) {
      burgerEntryPlayedRef.current = true;
      buildBurgerTimeline();
      return;
    }

    const lines = [top, mid, bot];
    gsap.killTweensOf(lines);
    burgerEntryTlRef.current?.kill();
    gsap.set(lines, { y: 0, opacity: 0, scaleX: 1, filter: "blur(10px)" });

    const entryTl = gsap.timeline({
      delay: 0.24,
      onComplete: () => {
        burgerEntryPlayedRef.current = true;
        gsap.set(lines, { clearProps: "y,opacity,scaleX,filter" });
        const tl = buildBurgerTimeline();
        if (tl) {
          if (isOpen) tl.play();
          else tl.progress(0);
        }
        burgerEntryTlRef.current = null;
      },
    });

    entryTl
      .to(top, { y: 0, opacity: 1, scaleX: 1, filter: "blur(0px)", duration: 1.36, ease: "power2.out" }, 0)
      .to(mid, { y: 0, opacity: 1, scaleX: 1, filter: "blur(0px)", duration: 1.28, ease: "power2.out" }, "-=1.02")
      .to(bot, { y: 0, opacity: 1, scaleX: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }, "-=0.98");

    burgerEntryTlRef.current = entryTl;

    return () => {
      burgerEntryTlRef.current?.kill();
      burgerEntryTlRef.current = null;
      if (!burgerEntryPlayedRef.current) {
        gsap.set(lines, { clearProps: "y,opacity,scaleX,filter" });
      }
    };
  }, [buildBurgerTimeline, isBurgerVisible, isOpen]);

  useEffect(() => {
    if (!isBurgerVisible || !burgerEntryPlayedRef.current || burgerTlRef.current) return;
    const tl = buildBurgerTimeline();
    if (!tl) return;
    if (isOpen) tl.progress(1);
    else tl.progress(0);
  }, [buildBurgerTimeline, isBurgerVisible, isOpen]);

  useEffect(() => {
    const crossA = crossARef.current;
    const crossB = crossBRef.current;
    if (!crossA || !crossB) return;
    if (!isBurgerVisible) {
      gsap.set([crossA, crossB], { opacity: 0 });
    }
  }, [isBurgerVisible]);

  useEffect(() => {
    const video = overlayVideoRef.current;
    if (!video) return;

    if (!isOpen) return;

    video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, [isOpen]);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo || !isOpen) return;
    const override = resolveMotionOverride(window.location.search);
    if (override === "force-reduced" || shouldReduceMotionInBrowser()) return;

    logo.classList.remove("logo-open-accent");
    void logo.offsetWidth;
    logo.classList.add("logo-open-accent");

    if (logoAccentTimerRef.current) {
      window.clearTimeout(logoAccentTimerRef.current);
    }

    logoAccentTimerRef.current = window.setTimeout(() => {
      logo.classList.remove("logo-open-accent");
      logoAccentTimerRef.current = null;
    }, 280);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (logoAccentTimerRef.current) {
        window.clearTimeout(logoAccentTimerRef.current);
      }
    };
  }, []);

  const setItemRef = useCallback((index: number, el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el;
    if (index === 0) firstItemRef.current = el;
  }, []);

  const runPendingScroll = useCallback(() => {
    const pending = pendingAnchorRef.current;
    if (!pending) return;
    pendingAnchorRef.current = null;

    const id = pending.split("#")[1] ?? "";
    if (!id) return;

    window.requestAnimationFrame(() => {
      scrollToSection(id);
    });
  }, []);

  const closeMenu = useCallback((href?: string) => {
    const canInterruptOpening =
      isAnimating &&
      isOpen &&
      (openTlRef.current?.isActive() ?? false) &&
      (burgerTlRef.current?.progress() ?? 0) >= 0.9;

    if (isAnimating && !canInterruptOpening) return;
    if (href) pendingAnchorRef.current = href;
    openTlRef.current?.kill();
    if (openFocusTimerRef.current) {
      window.clearTimeout(openFocusTimerRef.current);
      openFocusTimerRef.current = null;
    }
    setIsAnimating(true);
    setIsOpen(false);
  }, [isAnimating, isOpen]);

  const openMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsLocked(true);
    setIsOpen(true);
  }, [isAnimating]);

  const handleBurgerPressStart = useCallback(() => {
    const button = burgerRef.current;
    if (!button) return;

    const override = resolveMotionOverride(window.location.search);
    if (override === "force-reduced" || shouldReduceMotionInBrowser()) return;

    gsap.killTweensOf(button);
    gsap.to(button, {
      scale: 0.94,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleBurgerPressEnd = useCallback(() => {
    const button = burgerRef.current;
    if (!button) return;

    const override = resolveMotionOverride(window.location.search);
    if (override === "force-reduced" || shouldReduceMotionInBrowser()) return;

    gsap.killTweensOf(button);
    gsap.to(button, {
      scale: 1,
      duration: 0.62,
      ease: "elastic.out(0.8, 0.5)",
    });
  }, []);

  const trapFocus = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !isOpen || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [isOpen],
  );

  useEffect(() => {
    if (!isOpen) return;

    const sections = MENU_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.2, 0.4, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeMenu();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, isOpen, trapFocus]);

  useEffect(() => {
    if (!isOpen || !topPhoneRef.current) return;

    const phoneNode = topPhoneRef.current;
    const chars = Array.from(phoneNode.querySelectorAll<HTMLElement>('[data-phone-char="digit"]'));
    const accentLine = phoneNode.querySelector<HTMLElement>('[data-phone-accent="line"]');
    const neonPreset = PHONE_NEON_PRESETS[PHONE_NEON_MODE];
    if (!chars.length) return;

    const baseColor = { r: 245, g: 240, b: 232 };
    const accentColor = { r: 232, g: 213, b: 183 };
    const glowRamp = { value: 0 };
    const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

    let tickerAttached = false;
    const renderSeamless = (time: number) => {
      const ramp = glowRamp.value;
      const globalWave = (Math.sin(time * neonPreset.waveSpeed) + 1) * 0.5;

      const baseGlowA = 0.24 + globalWave * 0.18;
      const baseGlowB = 0.16 + globalWave * 0.14;
      phoneNode.style.transform = `translate3d(0, ${(-neonPreset.phoneLift * globalWave * ramp).toFixed(3)}px, 0) scale(${(
        1 +
        neonPreset.phoneScale * globalWave * ramp
      ).toFixed(3)})`;
      phoneNode.style.filter = `drop-shadow(0 0 6px rgba(212,175,55,${(baseGlowA * ramp).toFixed(3)})) drop-shadow(0 0 12px rgba(232,213,183,${(baseGlowB * ramp).toFixed(3)}))`;

      chars.forEach((char, index) => {
        const localWave = (Math.sin(time * neonPreset.waveSpeed + index * 0.34) + 1) * 0.5;
        const mix = 0.2 + localWave * 0.42;
        const red = Math.round(lerp(baseColor.r, accentColor.r, mix));
        const green = Math.round(lerp(baseColor.g, accentColor.g, mix));
        const blue = Math.round(lerp(baseColor.b, accentColor.b, mix));
        const shadowA = (0.22 + localWave * 0.2) * ramp;
        const shadowB = (0.14 + localWave * 0.16) * ramp;
        const offsetY = ((localWave - 0.5) * neonPreset.glyphAmplitudeY) * ramp;
        const glyphScale = 1 + (localWave - 0.5) * neonPreset.glyphScaleAmplitude * ramp;
        char.style.color = `rgb(${red}, ${green}, ${blue})`;
        char.style.textShadow = `0 0 10px rgba(212,175,55,${shadowA.toFixed(3)}), 0 0 18px rgba(232,213,183,${shadowB.toFixed(3)})`;
        char.style.transform = `translate3d(0, ${offsetY.toFixed(3)}px, 0) scale(${glyphScale.toFixed(3)})`;
      });

      if (accentLine) {
        const accentOpacity = (neonPreset.accentOpacityBase + globalWave * neonPreset.accentOpacityAmp) * ramp;
        const accentScale = neonPreset.accentScaleBase + globalWave * neonPreset.accentScaleAmp * ramp;
        accentLine.style.opacity = accentOpacity.toFixed(3);
        accentLine.style.transform = `translateX(-50%) scaleX(${accentScale.toFixed(3)})`;
      }
    };

    gsap.set(phoneNode, {
      color: "#f5f0e8",
      filter: "drop-shadow(0 0 6px rgba(212,175,55,0.2)) drop-shadow(0 0 12px rgba(232,213,183,0.14))",
      y: 0,
      scale: 1,
      willChange: "filter, transform, color",
    });
    gsap.set(chars, {
      opacity: 0,
      y: 10,
      color: "inherit",
      textShadow: "none",
      willChange: "opacity, transform, color, text-shadow",
      force3D: false,
    });
    if (accentLine) {
      gsap.set(accentLine, {
        opacity: 0,
        transformOrigin: "center center",
        transform: "translateX(-50%) scaleX(0.9)",
      });
    }

    const introTl = gsap.timeline({ defaults: { ease: MENU_EASE_LUX } });
    introTl.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.038,
      force3D: false,
    });
    introTl.to(glowRamp, { value: 1, duration: 1.15, ease: MENU_EASE_LUX }, 0.08);
    introTl.add(() => {
      if (tickerAttached) return;
      tickerAttached = true;
      gsap.ticker.add(renderSeamless);
    }, 0.2);

    return () => {
      introTl.kill();
      gsap.killTweensOf([phoneNode, ...chars, accentLine, glowRamp].filter(Boolean));
      if (tickerAttached) {
        gsap.ticker.remove(renderSeamless);
        tickerAttached = false;
      }
      phoneNode.style.removeProperty("filter");
      phoneNode.style.removeProperty("will-change");
      phoneNode.style.removeProperty("transform");
      phoneNode.style.removeProperty("color");
      chars.forEach((char) => {
        char.style.removeProperty("transform");
        char.style.removeProperty("color");
        char.style.removeProperty("text-shadow");
        char.style.removeProperty("will-change");
        char.style.removeProperty("opacity");
      });
      if (accentLine) {
        accentLine.style.removeProperty("opacity");
        accentLine.style.removeProperty("transform");
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    const footer = footerRef.current;
    const phoneWrap = menuPhoneWrapRef.current;
    const actionsWrap = menuActionsRef.current;
    const videoWrap = overlayVideoWrapRef.current;
    const burgerTl = burgerTlRef.current ?? buildBurgerTimeline();
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];

    if (!overlay || !panel || !content || !footer || !phoneWrap || !actionsWrap || !videoWrap || !burgerTl || !items.length) return;

    openTlRef.current?.kill();
    closeTlRef.current?.kill();
    gsap.killTweensOf([overlay, panel, content, footer, phoneWrap, actionsWrap, videoWrap, ...items]);

    if (!overlayAnimationBootedRef.current) {
      overlayAnimationBootedRef.current = true;
      gsap.set(overlay, {
        autoAlpha: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });
      gsap.set(panel, { autoAlpha: 0 });
      gsap.set(videoWrap, { autoAlpha: 0, scale: 1.02, filter: "none" });
      gsap.set(content, { autoAlpha: 0, y: 0, scale: 0.99, filter: "none" });
      gsap.set(items, { autoAlpha: 0, y: 0, filter: "none" });
      gsap.set(footer, { autoAlpha: 0, y: 0, filter: "none" });
      gsap.set(phoneWrap, { autoAlpha: 0, y: 0, filter: "none" });
      gsap.set(actionsWrap, { autoAlpha: 0, y: 0, filter: "none" });
      return;
    }

    if (isOpen) {
      gsap.set(overlay, {
        autoAlpha: 0,
        visibility: "visible",
        pointerEvents: "auto",
      });

      gsap.set(panel, { autoAlpha: 1 });
      gsap.set(videoWrap, { autoAlpha: 0, scale: 1.022, filter: "none" });
      gsap.set(content, { y: 10, scale: 0.992, autoAlpha: 0, filter: "blur(4px)" });
      gsap.set(items, {
        y: 8,
        autoAlpha: 0,
        filter: "blur(6px)",
      });
      gsap.set(footer, { autoAlpha: 0, y: 8, filter: "blur(5px)" });
      gsap.set(phoneWrap, { autoAlpha: 0, y: 10, scale: 0.992, filter: "blur(6px)" });
      gsap.set(actionsWrap, { autoAlpha: 0, y: 10, scale: 0.992, filter: "blur(6px)" });

      const openTl = gsap.timeline({
        onComplete: () => {
          gsap.set([footer, phoneWrap, actionsWrap, ...items, content], { filter: "none", scale: 1, y: 0 });
          setIsAnimating(false);
        },
      });

      openTl.addLabel("openStart", 0);
      openTl
        .add(burgerTl.tweenTo(burgerTl.duration(), { duration: 0.56, ease: MENU_EASE_LUX }), "openStart")
        .to(overlay, { autoAlpha: 1, duration: 0.72, ease: MENU_EASE_LUX }, "openStart")
        .to(
          videoWrap,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.98,
            ease: MENU_EASE_LUX,
          },
          "openStart+=0.02",
        )
        .to(
          content,
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.92,
            ease: MENU_EASE_LUX,
          },
          "openStart+=0.08",
        )
        .to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.84,
            stagger: 0.085,
            ease: MENU_EASE_LUX,
          },
          "openStart+=0.18",
        )
        .to(
          phoneWrap,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.78,
            ease: MENU_EASE_LUX,
          },
          "openStart+=0.5",
        )
        .to(
          actionsWrap,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.82,
            ease: MENU_EASE_LUX,
          },
          "openStart+=0.56",
        )
        .to(
          footer,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.72,
            ease: MENU_EASE_LUX,
          },
          "openStart+=0.62",
        );

      openTlRef.current = openTl;

      if (openFocusTimerRef.current) {
        window.clearTimeout(openFocusTimerRef.current);
      }
      openFocusTimerRef.current = window.setTimeout(() => firstItemRef.current?.focus(), 260);
      return () => {
        if (openFocusTimerRef.current) {
          window.clearTimeout(openFocusTimerRef.current);
          openFocusTimerRef.current = null;
        }
        openTlRef.current?.kill();
      };
    }

    const closeTl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, {
          autoAlpha: 0,
          visibility: "hidden",
          pointerEvents: "none",
        });
        gsap.set([content, footer, phoneWrap, actionsWrap, ...items], { filter: "none", scale: 1, y: 0 });
        overlayVideoRef.current?.pause();
        burgerRef.current?.focus();
        setIsLocked(false);
        runPendingScroll();
        setIsAnimating(false);
      },
    });

    closeTl.addLabel("closeStart", 0);
    closeTl
      .add(burgerTl.tweenTo(0, { duration: 0.56, ease: MENU_EASE_LUX }), "closeStart")
      .to(
        actionsWrap,
        {
          autoAlpha: 0,
          y: 8,
          filter: "blur(6px)",
          duration: 0.68,
          ease: MENU_EASE_LUX,
        },
        "closeStart",
      )
      .to(
        phoneWrap,
        {
          autoAlpha: 0,
          y: 8,
          filter: "blur(6px)",
          duration: 0.66,
          ease: MENU_EASE_LUX,
        },
        "closeStart+=0.06",
      )
      .to(
        items,
        {
          y: 8,
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 0.72,
          stagger: { each: 0.07, from: "end" },
          ease: MENU_EASE_LUX,
        },
        "closeStart+=0.1",
      )
      .to(
        footer,
        {
          autoAlpha: 0,
          y: 8,
          filter: "blur(6px)",
          duration: 0.62,
          ease: MENU_EASE_LUX,
        },
        "closeStart+=0.14",
      )
      .to(
        content,
        {
          y: 10,
          autoAlpha: 0,
          scale: 0.992,
          filter: "blur(4px)",
          duration: 0.82,
          ease: MENU_EASE_LUX,
        },
        "closeStart+=0.16",
      )
      .to(
        videoWrap,
        {
          autoAlpha: 0,
          scale: 1.022,
          duration: 0.82,
          ease: MENU_EASE_LUX,
        },
        "closeStart+=0.16",
      )
      .to(overlay, { autoAlpha: 0, duration: 0.74, ease: MENU_EASE_LUX }, "closeStart+=0.26")
      .to(panel, { autoAlpha: 0, duration: 0.4, ease: MENU_EASE_LUX }, "closeStart+=0.48");

    closeTlRef.current = closeTl;

    return () => {
      if (openFocusTimerRef.current) {
        window.clearTimeout(openFocusTimerRef.current);
        openFocusTimerRef.current = null;
      }
      openTlRef.current?.kill();
      closeTlRef.current?.kill();
    };
  }, [buildBurgerTimeline, isOpen, runPendingScroll]);

  const phoneHref = useMemo(() => `tel:${HEADER_PHONE.replace(/[^\d+]/g, "")}`, []);
  const phoneChars = useMemo(() => HEADER_PHONE_CHARS, []);

  useEffect(() => {
    if (!isOpen) return;

    let resizeDebounceTimer: number | undefined;
    const recalcScale = () => {
      const content = contentRef.current;
      if (!content) return;
      const viewportHeight = window.innerHeight;
      const contentHeight = content.scrollHeight;
      if (contentHeight <= viewportHeight) {
        setMenuScale(1);
        return;
      }
      const ratio = viewportHeight / contentHeight;
      setMenuScale(Math.max(0.72, Math.min(1, ratio * 0.99)));
    };

    const onResize = () => {
      if (resizeDebounceTimer) {
        window.clearTimeout(resizeDebounceTimer);
      }
      resizeDebounceTimer = window.setTimeout(recalcScale, 150);
    };

    const raf = window.requestAnimationFrame(recalcScale);
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(raf);
      if (resizeDebounceTimer) {
        window.clearTimeout(resizeDebounceTimer);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const rootContent = document.querySelector<HTMLElement>(".boot-ui");
    if (!rootContent) return;

    if (isOpen) {
      rootContent.setAttribute("aria-hidden", "true");
      rootContent.setAttribute("inert", "");
      return () => {
        rootContent.removeAttribute("aria-hidden");
        rootContent.removeAttribute("inert");
      };
    }

    rootContent.removeAttribute("aria-hidden");
    rootContent.removeAttribute("inert");
    return undefined;
  }, [isOpen]);

  return (
    <>
      <header
        ref={mobileHeaderRef}
        data-site-header="mobile"
        className="fixed left-0 right-0 top-0 z-[1200] flex h-[calc(72px+env(safe-area-inset-top))] items-center justify-start bg-transparent px-4 pt-[env(safe-area-inset-top)] md:hidden"
        style={{
          backgroundColor: "rgba(20, 18, 16, 0.68)",
          backdropFilter: "blur(10px) saturate(110%)",
          WebkitBackdropFilter: "blur(10px) saturate(110%)",
          maskImage: "none",
          WebkitMaskImage: "none",
          boxShadow: "none",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <Link
          ref={logoRef}
          href="/"
          className="header-logo group pointer-events-auto z-[1201] flex h-full items-center select-none"
          style={{
            marginLeft: "max(0.5rem, env(safe-area-inset-left))",
            transition: "none",
            filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.62))",
          }}
          aria-label="ЛИаура, перейти к началу страницы"
        >
          {isLogoIntroReady ? <BrandLogo isReady={isLogoIntroReady} size="mobile" /> : <span className="h-8 w-[158px]" aria-hidden />}
        </Link>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-[rgba(26,26,26,0.46)] via-[rgba(26,26,26,0.16)] to-transparent"
        />
      </header>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-[calc(72px+env(safe-area-inset-top)-1px)] z-[1199] h-4 bg-gradient-to-b from-[rgba(26,26,26,0.46)] via-[rgba(26,26,26,0.14)] to-transparent md:hidden"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      <button
        ref={burgerRef}
        type="button"
        onClick={isOpen ? () => closeMenu() : openMenu}
        onPointerDown={handleBurgerPressStart}
        onPointerUp={handleBurgerPressEnd}
        onPointerLeave={handleBurgerPressEnd}
        onPointerCancel={handleBurgerPressEnd}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        data-state={isOpen ? "open" : "closed"}
        className={`tap-none touch-manipulation fixed right-4 top-0 z-[10001] flex h-[calc(72px+env(safe-area-inset-top))] w-[72px] items-center justify-end pt-[env(safe-area-inset-top)] transition-opacity duration-300 md:hidden ${isBurgerVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          opacity: isBurgerVisible ? 1 : 0,
          visibility: isBurgerVisible ? "visible" : "hidden",
        }}
      >
        <div className="relative h-[30px] w-[40px]" aria-hidden>
          <span
            ref={lineTopRef}
            className="absolute right-0 top-0 block h-px w-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #f5f0e8 0%, #e8ddd3 48%, #d4b483 100%)",
              boxShadow: "0 0 8px rgba(212,180,131,0.16)",
              transition: "none",
            }}
          />
          <span
            ref={lineMidRef}
            className="absolute right-0 top-[14px] block h-px w-[50%] rounded-full"
            style={{
              background: "linear-gradient(90deg, #f5f0e8 0%, #e8ddd3 48%, #d4b483 100%)",
              boxShadow: "0 0 8px rgba(212,180,131,0.16)",
              transition: "none",
            }}
          />
          <span
            ref={lineBotRef}
            className="absolute right-0 top-7 block h-px w-[75%] rounded-full"
            style={{
              background: "linear-gradient(90deg, #f5f0e8 0%, #e8ddd3 48%, #d4b483 100%)",
              boxShadow: "0 0 8px rgba(212,180,131,0.16)",
              transition: "none",
            }}
          />
          <span
            ref={crossARef}
            className="absolute left-1/2 top-[14px] block h-px w-[36px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "linear-gradient(90deg, #f5f0e8 0%, #e8ddd3 48%, #d4b483 100%)",
              boxShadow: "0 0 8px rgba(212,180,131,0.16)",
              opacity: 0,
              transition: "none",
            }}
          />
          <span
            ref={crossBRef}
            className="absolute left-1/2 top-[14px] block h-px w-[36px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "linear-gradient(90deg, #f5f0e8 0%, #e8ddd3 48%, #d4b483 100%)",
              boxShadow: "0 0 8px rgba(212,180,131,0.16)",
              opacity: 0,
              transition: "none",
            }}
          />
        </div>
      </button>

      <div
        ref={overlayRef}
        className="pointer-events-none invisible fixed inset-0 z-[9999] md:hidden"
        aria-hidden={!isOpen}
      >
        <div
          id="mobile-nav-dialog"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
          className="absolute inset-0 overflow-hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div ref={overlayVideoWrapRef} className="absolute inset-0 overflow-hidden">
              <video
                ref={overlayVideoRef}
                className="absolute left-1/2 top-1/2 h-full min-h-full w-auto min-w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
              >
                <source src={MENU_BACKGROUND_VIDEO_PATH} type="video/mp4" />
              </video>
            </div>
          </div>

          <div
            ref={contentRef}
            className="mobile-menu-content relative z-10 flex min-h-dvh max-h-dvh flex-col justify-between overflow-x-hidden overflow-y-auto px-5 pt-[calc(80px+env(safe-area-inset-top))] pb-[calc(12px+env(safe-area-inset-bottom))]"
            style={{
              // Keep scale stable during close animation to avoid visual jump.
              transform: `scale(${menuScale})`,
              transformOrigin: "top center",
              WebkitOverflowScrolling: "touch",
            }}
          >

            <nav className="flex flex-1 items-stretch justify-center pt-2">
              <ul className="flex h-full min-h-[380px] w-full max-w-md flex-col justify-evenly">
                {MENU_ITEMS.map((item, index) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        ref={(el) => setItemRef(index, el)}
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          closeMenu(item.href);
                        }}
                        className="tap-none touch-manipulation group flex items-baseline justify-center py-[clamp(12px,2.6vh,24px)] text-center focus-visible:outline-none"
                      >
                        <span
                          className="menu-item"
                          style={{
                            fontSize: "clamp(2.25rem, 8.2vw, 3.3rem)",
                            fontWeight: 350,
                            lineHeight: 1.02,
                            letterSpacing: "-0.02em",
                            color: isActive ? "#ffffff" : "rgba(255,255,255,0.9)",
                            transition: "color 260ms ease, text-shadow 260ms ease, transform 260ms ease",
                            opacity: isActive ? 1 : 0.92,
                            textShadow: isActive ? "0 0 24px rgba(255, 155, 107, 0.24)" : "0 0 14px rgba(255,255,255,0.1)",
                          }}
                        >
                          <span className="inline-block">{item.label}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div ref={footerRef} className="menu-footer mt-3">
              <div className="mb-4 flex justify-center">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div ref={menuPhoneWrapRef} className="mb-4 flex flex-col items-center gap-2">
                <a
                  ref={topPhoneRef}
                  href={phoneHref}
                  className="menu-top-phone-wrapper text-white"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "1.65rem",
                    letterSpacing: "0.02em",
                    transform: "translateY(-6px)",
                    padding: "0.35rem 0.45rem",
                    borderRadius: "0.6rem",
                  }}
                  aria-label={`Позвонить ${HEADER_PHONE}`}
                >
                  <span data-phone-accent="line" className="menu-top-phone-accent" aria-hidden />
                  {phoneChars.map((char, index) => (
                    <span
                      key={`phone-top-${index}-${char}`}
                      data-phone-char={char === " " ? "space" : "digit"}
                      className={`menu-top-phone-char ${char === " " ? "space" : ""}`}
                      style={{
                        display: "inline-block",
                        backgroundColor: "transparent",
                        isolation: "isolate",
                        transformOrigin: "center center",
                        transition: "none",
                        WebkitTextFillColor: "currentColor",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </a>
              </div>

              <div ref={menuActionsRef} className="menu-actions mt-3 grid grid-cols-2 gap-2.5">
                <a
                  href={siteConfig.social.whatsapp}
                  aria-label="WhatsApp"
                  className="overlay-messenger-btn overlay-messenger-btn--whatsapp tap-none touch-manipulation"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8d9b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span className="text-[0.78rem] font-semibold tracking-[0.04em] text-[#eef5ed]">WhatsApp</span>
                </a>

                <a
                  href={siteConfig.social.telegram}
                  aria-label="Telegram"
                  className="overlay-messenger-btn overlay-messenger-btn--telegram tap-none touch-manipulation"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bfd3e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span className="text-[0.78rem] font-semibold tracking-[0.04em] text-[#eef1f6]">Telegram</span>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




