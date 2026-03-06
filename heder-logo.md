# Heder/Logo & Mobile Menu — Full Technical Handoff

## 1) Контекст
- Проект: ipauto_161 (Next.js App Router, React 19, TypeScript, GSAP, Tailwind v4).
- Ключевой модуль: мобильный хедер + лого + бургер-меню + футер меню (телефон/стрелка/кнопки).

## 2) Критическая проблема сейчас
Пользователь сообщает: лого отображается не как раньше — блок региона (161/RUS) уходит в неправильную строку/компоновку.

## 3) Что уже выяснено
- LogoReveal.tsx как отдельного компонента в проекте нет.
- Вся логика лого и меню находится в components/layout/MobileMenu.tsx.
- На реальных телефонах возможны отличия от desktop эмулятора из-за dvh/safe-area/overflow.

## 4) Полный код, который за это отвечает

### 4.1 components/layout/MobileMenu.tsx
`	sx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { siteConfig } from "@/lib/siteConfig";
import { useLockScroll } from "@/hooks/useLockScroll";

type MenuItem = {
  id: string;
  href: string;
  label: string;
};

const MENU_ITEMS: readonly MenuItem[] = [
  { id: "services", href: "#services", label: "Услуги" },
  { id: "products", href: "#products", label: "Товары" },
  { id: "advantages", href: "#advantages", label: "Преимущества" },
  { id: "process", href: "#process", label: "Процесс" },
  { id: "reviews", href: "#reviews", label: "Отзывы" },
  { id: "contacts", href: "#contacts", label: "Контакты" },
] as const;

const HEADER_HEIGHT = 72;
const HEADER_PHONE = "+7 (928) 7777-009";
const HEADER_PHONE_CHARS = [
  "+",
  "7",
  " ",
  "(",
  "9",
  "2",
  "8",
  ")",
  " ",
  "7",
  "7",
  "7",
  "7",
  "-",
  "0",
  "0",
  "9",
] as const;

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBurgerVisible, setIsBurgerVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>("services");
  const [glitchId, setGlitchId] = useState<string | null>(null);
  const [menuScale, setMenuScale] = useState(1);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const lineTopRef = useRef<HTMLSpanElement>(null);
  const lineMidRef = useRef<HTMLSpanElement>(null);
  const lineBotRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const logoVipRef = useRef<HTMLSpanElement | null>(null);
  const logoAutoRef = useRef<HTMLSpanElement | null>(null);
  const logoRegionRef = useRef<HTMLSpanElement | null>(null);
  const logoAccentRef = useRef<HTMLSpanElement | null>(null);
  const hasLogoAnimatedRef = useRef(false);
  const topPhoneRef = useRef<HTMLAnchorElement | null>(null);
  const callArrowRef = useRef<HTMLDivElement | null>(null);
  const callLabelRef = useRef<HTMLSpanElement | null>(null);
  const burgerEntryPlayedRef = useRef(false);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingAnchorRef = useRef<string | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const burgerTlRef = useRef<gsap.core.Timeline | null>(null);
  const burgerEntryTlRef = useRef<gsap.core.Timeline | null>(null);
  const glitchClearTimerRef = useRef<number | null>(null);
  const openFocusTimerRef = useRef<number | null>(null);

  useLockScroll(isLocked);

  useEffect(() => {
    let timeoutId: number | undefined;

    const showBurger = () => {
      timeoutId = window.setTimeout(() => setIsBurgerVisible(true), 1500);
    };

    if (document.readyState === "complete") {
      showBurger();
    } else {
      window.addEventListener("load", showBurger, { once: true });
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("load", showBurger);
    };
  }, []);

  useEffect(() => {
    const logo = logoRef.current;
    const vip = logoVipRef.current;
    const auto = logoAutoRef.current;
    const region = logoRegionRef.current;
    const accent = logoAccentRef.current;
    if (!logo || !vip || !auto || !region || !accent) return;
    if (hasLogoAnimatedRef.current) return;
    hasLogoAnimatedRef.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const words = [vip, auto, region];
    gsap.killTweensOf(words);
    gsap.killTweensOf(logo);
    gsap.killTweensOf(accent);

    gsap.set(vip, { opacity: 0, x: -80, rotation: -8, scale: 0.85 });
    gsap.set(auto, { opacity: 0, x: 80, rotation: 8, scale: 0.85 });
    gsap.set(region, { opacity: 0, x: -80, rotation: -8, scale: 0.85 });
    gsap.set(accent, { opacity: 0, scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(vip, {
      opacity: 1,
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
    })
      .to(
        auto,
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.35",
      )
      .to(
        region,
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.35",
      )
      .to(logo, { scale: 1.04, duration: 0.2, ease: "power2.out" }, "+=0.05")
      .to(logo, { scale: 1, duration: 0.35, ease: "power2.inOut" })
      .to(accent, { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out" }, "-=0.4");

    return () => {
      tl.kill();
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

    const id = pending.replace("#", "");
    const node = document.getElementById(id);
    if (!node) return;

    window.requestAnimationFrame(() => {
      const y = node.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  }, []);

  const closeMenu = useCallback((href?: string) => {
    if (isAnimating) return;
    if (href) pendingAnchorRef.current = href;
    setIsAnimating(true);
    setIsOpen(false);
  }, [isAnimating]);

  const openMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsLocked(true);
    setIsOpen(true);
  }, [isAnimating]);

  const buildBurgerTimeline = useCallback(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!top || !mid || !bot) return null;

    gsap.killTweensOf([top, mid, bot]);
    burgerTlRef.current?.kill();

    gsap.set(mid, {
      clipPath: "inset(0% 0% 0% 0%)",
      WebkitClipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
    });

    const tl = gsap.timeline({ paused: true });
    tl.to(
      top,
      {
        y: 8,
        rotate: 45,
        duration: 0.4,
        ease: "power3.inOut",
      },
      0,
    )
      .to(
        bot,
        {
          y: -8,
          rotate: -45,
          width: "100%",
          duration: 0.4,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        mid,
        {
          clipPath: "inset(0% 0% 0% 100%)",
          WebkitClipPath: "inset(0% 0% 0% 100%)",
          duration: 0.3,
          ease: "power2.inOut",
        },
        0,
      );

    burgerTlRef.current = tl;
    return tl;
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
    if (!isOpen) return;

    // Variant 2: deterministic, clearly visible glitch cycle
    let loopTimerId: number | undefined;
    let cycleIndex = 0;

    const tick = () => {
      const item = MENU_ITEMS[cycleIndex % MENU_ITEMS.length];
      cycleIndex += 1;
      if (!item) return;

      setGlitchId(item.id);
      if (glitchClearTimerRef.current) {
        window.clearTimeout(glitchClearTimerRef.current);
      }
      glitchClearTimerRef.current = window.setTimeout(() => {
        setGlitchId((prev) => (prev === item.id ? null : prev));
      }, 420);

      loopTimerId = window.setTimeout(tick, 1400);
    };

    loopTimerId = window.setTimeout(tick, 260);

    return () => {
      if (loopTimerId) window.clearTimeout(loopTimerId);
      if (glitchClearTimerRef.current) {
        window.clearTimeout(glitchClearTimerRef.current);
        glitchClearTimerRef.current = null;
      }
      setGlitchId(null);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !topPhoneRef.current) return;

    const phoneNode = topPhoneRef.current;
    const chars = Array.from(phoneNode.querySelectorAll<HTMLElement>('[data-phone-char="digit"]'));
    const arrow = callArrowRef.current;
    const label = callLabelRef.current;
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.set(chars, {
        opacity: 0,
        y: 20,
        scale: 1,
        color: "#ffffff",
        backgroundColor: "transparent",
        textShadow: "none",
      });
      if (arrow) gsap.set(arrow, { opacity: 0, y: 0 });
      if (label) gsap.set(label, { opacity: 0, scale: 1, color: "#ffffff" });

      const masterTl = gsap.timeline();

      masterTl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.03,
      });

      if (label) {
        masterTl.to(
          label,
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.1",
        );
      }

      if (arrow) {
        masterTl.to(
          arrow,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2",
        );
      }

      const waveTl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      waveTl.to(
        chars,
        {
          keyframes: [
            {
              color: "#ccff00",
              scale: 1.25,
              duration: 0.25,
              ease: "power2.out",
            },
            {
              color: "#ffffff",
              scale: 1,
              duration: 0.4,
              ease: "power2.inOut",
            },
          ],
          stagger: { each: 0.06, from: "start" },
        },
        0,
      );

      masterTl.add(waveTl, "+=0.5");

      if (arrow) {
        const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
        arrowTl
          .to(arrow, { y: -8, duration: 0.3, ease: "power2.out" })
          .to(arrow, { y: 0, duration: 0.25, ease: "bounce.out" })
          .to(arrow, { y: -5, duration: 0.2, ease: "power2.out" })
          .to(arrow, { y: 0, duration: 0.2, ease: "bounce.out" });
        masterTl.add(arrowTl, 1.5);
      }

      if (label) {
        const labelTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        labelTl
          .to(label, { color: "#ccff00", scale: 1.1, duration: 0.4, ease: "power2.out" })
          .to(label, { color: "#00f0ff", scale: 1, duration: 0.5, ease: "power2.inOut" })
          .to(label, { color: "#ffffff", duration: 0.3, ease: "power1.in" });
        masterTl.add(labelTl, 2);
      }
    }, phoneNode);

    return () => {
      ctx.revert();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!burgerTlRef.current) return;
    if (isOpen) {
      burgerTlRef.current.play();
    } else {
      burgerTlRef.current.reverse();
    }
  }, [isOpen]);

  useEffect(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!isBurgerVisible || !top || !mid || !bot || burgerEntryPlayedRef.current) return;

    const lines = [top, mid, bot];
    gsap.killTweensOf(lines);
    burgerEntryTlRef.current?.kill();
    gsap.set(lines, { y: -60, opacity: 0, scaleX: 0.3 });

    const entryTl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        burgerEntryPlayedRef.current = true;
        gsap.set(lines, { clearProps: "y,opacity,scaleX" });
        const tl = buildBurgerTimeline();
        if (tl) {
          if (isOpen) tl.play();
          else tl.progress(0);
        }
        burgerEntryTlRef.current = null;
      },
    });
      entryTl
        .to(top, { y: 0, opacity: 1, scaleX: 1, duration: 0.8, ease: "elastic.out(0.4, 0.3)" }, 0)
        .to(mid, { y: 0, opacity: 1, scaleX: 1, duration: 0.75, ease: "elastic.out(0.4, 0.3)" }, "-=0.55")
        .to(bot, { y: 0, opacity: 1, scaleX: 1, duration: 0.7, ease: "elastic.out(0.4, 0.3)" }, "-=0.5");
    burgerEntryTlRef.current = entryTl;

    return () => {
      burgerEntryTlRef.current?.kill();
      burgerEntryTlRef.current = null;
      if (!burgerEntryPlayedRef.current) {
        gsap.set(lines, { clearProps: "y,opacity,scaleX" });
      }
    };
  }, [buildBurgerTimeline, isBurgerVisible, isOpen]);

  useEffect(() => {
    if (!isBurgerVisible || !burgerEntryPlayedRef.current || burgerTlRef.current) return;
    const tl = buildBurgerTimeline();
    if (!tl) return;
    if (isOpen) tl.play();
    else tl.progress(0);
  }, [buildBurgerTimeline, isBurgerVisible, isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const footer = footerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];

    if (!overlay || !panel || !footer || !items.length) return;

    openTlRef.current?.kill();
    closeTlRef.current?.kill();
    gsap.killTweensOf([overlay, panel, footer, ...items]);

    if (isOpen) {
      gsap.set(overlay, {
        autoAlpha: 1,
        visibility: "visible",
        pointerEvents: "auto",
      });

      gsap.set(panel, { y: 36, scale: 0.985, autoAlpha: 0 });
      gsap.set(items, {
        y: 46,
        autoAlpha: 0,
      });
      gsap.set(footer, { autoAlpha: 0, y: 24 });

      const openTl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      openTl
        .to(
          panel,
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.62,
            ease: "back.out(1.45)",
          },
          0,
        )
        .to(
          items,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.48,
            stagger: 0.08,
            ease: "back.out(1.45)",
          },
          0.1,
        )
        .to(footer, { autoAlpha: 1, y: 0, duration: 0.36, ease: "back.out(1.35)" }, 0.28);

      openTlRef.current = openTl;

      if (openFocusTimerRef.current) {
        window.clearTimeout(openFocusTimerRef.current);
      }
      openFocusTimerRef.current = window.setTimeout(() => firstItemRef.current?.focus(), 200);
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
        burgerRef.current?.focus();
        setIsLocked(false);
        runPendingScroll();
        setIsAnimating(false);
      },
    });

    closeTl
      .to(
        items,
        {
          y: 22,
          autoAlpha: 0,
          duration: 0.2,
          stagger: { each: 0.04, from: "end" },
          ease: "power2.inOut",
        },
        0,
      )
      .to(footer, { autoAlpha: 0, y: 16, duration: 0.15, ease: "power2.in" }, 0)
      .to(panel, { y: 26, autoAlpha: 0, scale: 0.985, duration: 0.34, ease: "power3.in" }, 0.06);

    closeTlRef.current = closeTl;

    return () => {
      if (openFocusTimerRef.current) {
        window.clearTimeout(openFocusTimerRef.current);
        openFocusTimerRef.current = null;
      }
      openTlRef.current?.kill();
      closeTlRef.current?.kill();
    };
  }, [isOpen, runPendingScroll]);

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
        className="fixed left-0 right-0 top-0 z-[1200] flex h-[calc(80px+env(safe-area-inset-top))] items-center justify-center px-5 pt-[env(safe-area-inset-top)] md:hidden"
        style={{
          background: "rgba(5,10,20,0.8)",
          backdropFilter: "blur(10px) saturate(130%)",
          WebkitBackdropFilter: "blur(10px) saturate(130%)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <Link
          ref={logoRef}
          href="/"
          className="header-logo pointer-events-auto absolute top-1/2 z-[1201] -translate-y-1/2 select-none"
          style={{ left: "max(1.25rem, env(safe-area-inset-left))" }}
          aria-label="VIPAuto161 Главная"
        >
          <span className="vip-logo-monolith" aria-label="VIPАВТО 161 RUS">
            <span className="logo-text">
              <span ref={logoVipRef} className="vip-part logo-anim-node">VIP</span>
              <span ref={logoAutoRef} className="auto-part logo-anim-node">АВТО</span>
            </span>
            <span ref={logoRegionRef} className="logo-region logo-anim-node">
              <span className="region-code">161</span>
              <span className="region-flag">RUS</span>
            </span>
            <span
              ref={logoAccentRef}
              aria-hidden="true"
              className="logo-accent-line logo-anim-node absolute -bottom-[4px] left-0 h-[2px] w-full bg-gradient-to-r from-[#ccff00] to-[#00f0ff]"
            />
          </span>
        </Link>
      </header>

      <button
        ref={burgerRef}
        type="button"
        onClick={isOpen ? () => closeMenu() : openMenu}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        className={`tap-none touch-manipulation fixed right-5 top-0 z-[10001] flex h-[calc(80px+env(safe-area-inset-top))] w-[84px] items-center justify-end pt-[env(safe-area-inset-top)] transition-opacity duration-300 md:hidden ${isBurgerVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ background: "none", border: "none", outline: "none" }}
      >
        <div className="relative h-[22px] w-[38px]">
          <span
            ref={lineTopRef}
            className="absolute left-0 top-0 block h-[1.25px] rounded-[2px]"
            style={{
              width: "100%",
              background: "#ccff00",
              boxShadow: "0 0 8px rgba(204,255,0,0.25)",
              transform: "translateY(0) rotate(0)",
              transformOrigin: "center center",
              transition: "none",
            }}
          />
          <span
            ref={lineMidRef}
            className="absolute left-0 top-[10px] block h-[1.25px] rounded-[2px]"
            style={{
              width: "72%",
              background: "linear-gradient(90deg, #ccff00 0%, #00f0ff 100%)",
              boxShadow: "0 0 8px rgba(224,230,237,0.25)",
              opacity: 1,
              clipPath: "inset(0 0 0 0)",
              WebkitClipPath: "inset(0 0 0 0)",
              transformOrigin: "center center",
              transition: "none",
            }}
          />
          <span
            ref={lineBotRef}
            className="absolute bottom-0 left-0 block h-[1.25px] rounded-[2px]"
            style={{
              width: "50%",
              background: "#00f0ff",
              boxShadow: "0 0 8px rgba(0,240,255,0.25)",
              transform: "translateY(0) rotate(0)",
              transformOrigin: "center center",
              transition: "none",
            }}
          />
        </div>
      </button>

      <div ref={overlayRef} className="pointer-events-none invisible fixed inset-0 z-[9999] md:hidden" aria-hidden={!isOpen}>
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
            <video className="h-full w-full object-cover object-center" autoPlay muted loop playsInline preload="metadata">
              <source src="/uploads/videos/menu-bg.webm" type="video/webm" />
              <source src="/uploads/videos/menu-bg.mp4" type="video/mp4" />
              <source src="/uploads/videos/hader.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,22,0.85)_0%,rgba(11,17,22,0.72)_42%,rgba(11,17,22,0.86)_100%)] backdrop-blur-[20px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,240,255,0.12),transparent_40%),radial-gradient(circle_at_86%_90%,rgba(204,255,0,0.12),transparent_44%)]" />
            <div className="menu-film-grain absolute inset-0 opacity-[0.06]" />
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

            <nav className="flex flex-1 items-start justify-center pt-2">
              <ul className="w-full max-w-md">
                {MENU_ITEMS.map((item, index) => {
                  const isActive = activeId === item.id;
                  const isGlitching = glitchId === item.id;
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
                          className={`menu-item ${isGlitching ? "glitch-active" : ""}`}
                          style={{
                            fontSize: "clamp(2rem, 7vw, 2.8rem)",
                            fontWeight: 300,
                            lineHeight: 1.1,
                            letterSpacing: "-0.01em",
                            color: isActive ? "#ffffff" : "#f4f7fb",
                            transition: "none",
                            opacity: isActive ? 1 : 0.92,
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
              <p className="menu-footer-copy mb-3 max-w-[38ch] text-left text-[12px] leading-relaxed tracking-[0.04em] text-[var(--text-secondary)]/84">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет и сложные электрические случаи.
              </p>

              <div className="mb-4 flex justify-center">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="mb-4 flex flex-col items-center gap-2">
                <a
                  ref={topPhoneRef}
                  href={phoneHref}
                  className="menu-top-phone-wrapper text-white"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: "1.65rem",
                    letterSpacing: "0.02em",
                  }}
                  aria-label={`Позвонить ${HEADER_PHONE}`}
                >
                  {phoneChars.map((char, index) => (
                    <span
                      key={`phone-top-${index}-${char}`}
                      data-phone-char={char === " " ? "space" : "digit"}
                      className={`menu-top-phone-char ${char === " " ? "space" : ""}`}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </a>

                <div className="flex flex-col items-center gap-1">
                  <div ref={callArrowRef} className="call-arrow" style={{ transformOrigin: "center center" }}>
                    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="32" x2="12" y2="6" stroke="url(#arrowGrad)" strokeWidth="2" strokeLinecap="round" />
                      <line x1="12" y1="6" x2="5" y2="13" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                      <line x1="12" y1="6" x2="19" y2="13" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="arrowGrad" x1="12" y1="32" x2="12" y2="6">
                          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#ccff00" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span ref={callLabelRef} className="call-label inline-block text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                    позвонить
                  </span>
                </div>
              </div>

              <div className="menu-actions mt-3 grid grid-cols-2 gap-2.5">
                <a
                  href={siteConfig.social.whatsapp}
                  aria-label="WhatsApp"
                  className="btn-shine tap-none touch-manipulation flex h-11 items-center justify-center gap-2 rounded-full border border-[#ccff0026] bg-[#ccff0014] px-3.5 transition-all duration-300 hover:border-[#ccff0059] hover:bg-[#ccff0026] hover:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span className="text-[0.78rem] font-semibold tracking-[0.04em] text-[#ccff00]">WhatsApp</span>
                </a>

                <a
                  href={siteConfig.social.telegram}
                  aria-label="Telegram"
                  className="btn-shine tap-none touch-manipulation flex h-11 items-center justify-center gap-2 rounded-full border border-[#00f0ff26] bg-[#00f0ff0f] px-3.5 transition-all duration-300 hover:border-[#00f0ff59] hover:bg-[#00f0ff1f] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span className="text-[0.78rem] font-semibold tracking-[0.04em] text-[#00f0ff]">Telegram</span>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

`

### 4.2 pp/globals.css
`css
@import "tailwindcss";

:root {
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-elevated: #27272a;
  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --line: #3f3f46;
  --accent: #ccff00;
  --accent-2: #00f0ff;
  --accent-glow: rgba(204, 255, 0, 0.35);
  --accent-2-glow: rgba(0, 240, 255, 0.35);
  --header-h: 80px;
}

html {
  color-scheme: dark;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: auto;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-x: none;
  touch-action: auto;
}

.boot-ui {
  opacity: 1;
  transition: opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

html:not(.ui-ready) .boot-ui {
  opacity: 0;
}

body {
  min-height: 100svh;
  background:
    radial-gradient(circle at 18% 16%, rgba(0, 240, 255, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 82% 0%, rgba(204, 255, 0, 0.05) 0%, transparent 34%),
    #09090b;
  color: var(--text-primary);
  font-family: var(--font-manrope), sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: auto;
}

* {
  border-color: var(--line);
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

#mobile-nav-dialog a:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.container-shell {
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: 1rem;
}

@media (min-width: 640px) {
  .container-shell {
    padding-inline: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-shell {
    padding-inline: 2rem;
  }
}

.section-padding {
  padding-block: 4rem;
}

.reveal-section {
  visibility: hidden;
}

.reveal-section.is-revealed {
  visibility: visible;
}

@media (max-width: 767px) and (prefers-reduced-motion: no-preference) {
  .mobile-reveal-lite {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    filter: blur(2px);
    will-change: transform, opacity;
  }

  .mobile-reveal-lite.mobile-reveal-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
    transition:
      opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .mobile-stagger-item {
    opacity: 0;
    transform: translate3d(0, 14px, 0) scale(0.985);
    will-change: transform, opacity;
  }

  .mobile-stagger-active .mobile-stagger-item {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    transition:
      opacity 360ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: calc(var(--stagger-index, 0) * 70ms);
  }
}

@media (max-width: 767px) {
  .container-shell {
    padding-inline: 0.875rem;
  }

  .section-padding {
    padding-block: 3.25rem;
  }
}

@media (max-width: 420px) {
  .section-padding {
    padding-block: 2.75rem;
  }
}

@media (min-width: 768px) {
  .section-padding {
    padding-block: 6rem;
  }
}

@media (min-width: 1024px) {
  .section-padding {
    padding-block: 8rem;
  }
}

.card-surface {
  background: rgb(39 39 42 / 0.5);
  border: 1px solid rgb(63 63 70);
  border-radius: 0.75rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.03);
  backdrop-filter: blur(12px);
  transition: border-color 300ms ease;
}

.card-surface:hover {
  border-color: rgb(82 82 91);
}

.ds-h1 {
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ds-h2 {
  font-size: 1.875rem;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ds-h3 {
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 600;
}

.ds-body {
  font-size: 1rem;
  line-height: 1.75;
  color: rgb(161 161 170);
}

.ds-caption {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(113 113 122);
}

.btn-primary {
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: #0b0b0b;
  background: var(--accent);
  transition: all 200ms;
}

.btn-secondary {
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: rgb(244 244 245);
  background: rgb(39 39 42 / 0.65);
  border: 1px solid rgb(63 63 70);
  transition: all 200ms;
}

.btn-secondary:hover {
  background: rgb(63 63 70 / 0.75);
  border-color: rgb(82 82 91);
}

.input-field {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(63 63 70);
  background: rgb(39 39 42 / 0.75);
  color: rgb(244 244 245);
  padding: 0.75rem 1rem;
}

.input-field::placeholder {
  color: rgb(82 82 91);
}

.input-field:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 1px rgb(59 130 246 / 0.5);
}

.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.03;
  background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0);
  background-size: 6px 6px;
}

.accent-dot {
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  margin-right: 0.65rem;
  background: linear-gradient(130deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 22px var(--accent-glow);
}

.typewriter-container {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  width: min(100%, calc(var(--typewriter-ch, 28) * 1ch));
  min-height: 1.5em;
  max-width: 100%;
}

.typewriter-sizer {
  visibility: hidden;
  white-space: nowrap;
  padding-right: 0.2em;
}

.typewriter-text {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
}

.typewriter-cursor {
  display: inline-block;
  width: 0;
  margin-left: 2px;
  border-right: 2px solid var(--accent);
  animation: typewriter-cursor-blink 0.9s step-end infinite;
}

@keyframes typewriter-cursor-blink {
  0%,
  45% {
    opacity: 1;
  }
  46%,
  100% {
    opacity: 0;
  }
}

.glass-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(224, 230, 237, 0.08);
  background: rgba(10, 19, 34, 0.5);
  backdrop-filter: blur(20px);
  transition: all 400ms ease;
  cursor: default;
}

.glass-card:hover {
  background: rgba(16, 29, 50, 0.7);
  border-color: rgba(0, 240, 255, 0.24);
  box-shadow:
    0 20px 60px -20px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(0, 240, 255, 0.1);
}

.glow-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: 0;
  border-bottom-left-radius: 999px;
  border-bottom-right-radius: 999px;
  transition: width 500ms ease-out;
}

.glass-card:hover .glow-line {
  width: 60%;
}

.corner-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  height: 120px;
  width: 120px;
  border-radius: 999px;
  opacity: 0;
  filter: blur(40px);
  pointer-events: none;
  transition: opacity 500ms ease;
}

.glass-card:hover .corner-glow {
  opacity: 1;
}

@keyframes badge-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.animate-badge-pulse {
  animation: badge-pulse 2s ease-in-out infinite;
}

.shimmer-text {
  background: linear-gradient(90deg, #f0f0f0 0%, #ffffff 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 1.8s ease-out forwards;
}

.duration-400 {
  transition-duration: 400ms;
}

.cmp-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  backdrop-filter: blur(20px);
  transition: all 500ms ease;
}

.cmp-card--garage {
  background: rgba(159, 173, 188, 0.04);
  border: 1px solid rgba(159, 173, 188, 0.18);
}

.cmp-card--garage:hover {
  background: rgba(159, 173, 188, 0.07);
  border-color: rgba(159, 173, 188, 0.3);
  box-shadow: 0 20px 80px -20px rgba(159, 173, 188, 0.18);
}

.cmp-card--vip {
  background: rgba(204, 255, 0, 0.05);
  border: 1px solid rgba(204, 255, 0, 0.2);
}

.cmp-card--vip:hover {
  background: rgba(204, 255, 0, 0.09);
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 20px 80px -20px rgba(204, 255, 0, 0.22);
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

@keyframes parallax-twinkle {
  0%,
  100% {
    opacity: var(--tw-opacity, 1);
    transform: scale(1);
  }
  50% {
    opacity: 0.05;
    transform: scale(0.5);
  }
}

.animate-float-slow {
  animation: float-slow 4s ease-in-out infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-out infinite;
}

.animate-parallax-twinkle {
  animation: parallax-twinkle 3s ease-in-out infinite;
}

.menu-scroll::-webkit-scrollbar {
  width: 3px;
}

.menu-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.menu-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.tap-none {
  -webkit-tap-highlight-color: transparent;
}

.touch-manipulation {
  touch-action: manipulation;
}

.shadow-glass-header {
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 8px 32px rgba(0, 0, 0, 0.2);
}

.shadow-crimson-line {
  box-shadow:
    0 0 8px rgba(0, 240, 255, 0.55),
    0 0 20px rgba(0, 240, 255, 0.28);
}

.shadow-crimson-cta {
  box-shadow:
    0 4px 15px rgba(204, 255, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.shadow-crimson-cta-hover {
  box-shadow:
    0 8px 30px rgba(204, 255, 0, 0.42),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

@keyframes glow-pulse {
  0%,
  100% {
    box-shadow:
      0 0 10px rgba(0, 240, 255, 0.2),
      0 0 30px rgba(0, 240, 255, 0.06);
  }
  50% {
    box-shadow:
      0 0 15px rgba(204, 255, 0, 0.3),
      0 0 40px rgba(204, 255, 0, 0.1);
  }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

.sticky-actions-anim {
  transition-property: transform, opacity !important;
  transition-duration: 460ms, 320ms !important;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1), ease !important;
}

@keyframes menu-glitch {
  0%,
  88%,
  100% {
    transform: translate3d(0, 0, 0);
    text-shadow: none;
    opacity: 1;
  }
  90% {
    transform: translate3d(-1px, 1px, 0);
    text-shadow:
      1px 0 #ccff00,
      -1px 0 #00f0ff;
    opacity: 0.96;
  }
  93% {
    transform: translate3d(1px, -1px, 0);
    text-shadow:
      -1px 0 #ccff00,
      1px 0 #00f0ff;
    opacity: 0.92;
  }
  96% {
    transform: translate3d(0, 0, 0);
    text-shadow: none;
    opacity: 1;
  }
}

.menu-item {
  display: inline-block;
  will-change: transform, opacity, text-shadow;
}

.menu-item.glitch-active {
  animation: menu-glitch 260ms linear 1;
}

.menu-item:hover,
.menu-item:focus-visible {
  animation: none !important;
}

.menu-film-grain {
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  mix-blend-mode: soft-light;
  animation: grain-shift 0.45s steps(4) infinite;
}

@keyframes grain-shift {
  to {
    background-position: 100% 100%;
  }
}

.phone-number {
  position: relative;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0;
  will-change: transform, opacity, text-shadow, filter;
  animation: phone-signal-pulse 2.8s ease-in-out infinite;
  text-shadow:
    0 0 8px rgba(0, 240, 255, 0.35),
    0 0 18px rgba(204, 255, 0, 0.12);
}

.phone-char {
  display: inline-block;
  transform-origin: center;
  transition: transform 120ms ease-out, filter 120ms ease-out, color 120ms ease-out;
}

.phone-char-space {
  display: inline-block;
  width: 0.45em;
}

.header-phone {
  font-size: clamp(1.4rem, 5vw, 2.2rem);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: 0.01em;
}

.menu-phone {
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.menu-top-phone-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5px;
  overflow: hidden;
  white-space: nowrap;
}

.menu-top-phone-char {
  display: inline-block;
  transform: translateZ(0);
  background: transparent !important;
  -webkit-text-fill-color: currentColor;
  isolation: isolate;
  transition: none;
  transform-origin: center center;
}

.menu-top-phone-char.space {
  width: 4px;
}

.vip-logo-monolith {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.vip-logo-monolith::before {
  content: none;
}

.logo-text {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-manrope), sans-serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.vip-part {
  color: #fff;
}

.auto-part {
  margin-left: 2px;
  color: #ccff00;
  text-shadow: 0 0 10px rgba(204, 255, 0, 0.22);
}

.logo-region {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  border-radius: 5px;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 2px 6px;
}

.region-code {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 17px;
  font-weight: 900;
  line-height: 1;
  color: #fff;
}

.region-flag {
  margin-top: 1px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.region-flag::before {
  content: "";
  display: inline-block;
  width: 11px;
  height: 7px;
  border: 1px solid #ccc;
  background: linear-gradient(to bottom, #fff 33%, #0039a6 33%, #0039a6 66%, #d52b1e 66%);
}

/* GSAP logo animation guard: prevent CSS/extension conflicts on transform/opacity targets */
.logo-anim-node {
  display: inline-block;
  transform-origin: center center;
  transition: none !important;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.logo-accent-line {
  transform-origin: left center;
}

.logo-region.logo-anim-node {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.phone-char.fisheye-active {
  animation: beautiful-pulse 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  color: #ffffff;
  text-shadow:
    0 0 15px rgba(224, 17, 95, 0.8),
    0 0 30px rgba(255, 255, 255, 0.6);
}

@keyframes phone-signal-pulse {
  0%,
  100% {
    filter: saturate(1);
    text-shadow:
      0 0 8px rgba(0, 240, 255, 0.35),
      0 0 18px rgba(204, 255, 0, 0.12);
  }
  50% {
    filter: saturate(1.14);
    text-shadow:
      0 0 12px rgba(204, 255, 0, 0.45),
      0 0 24px rgba(0, 240, 255, 0.28);
  }
}

@keyframes beautiful-pulse {
  0% {
    transform: scale(1) translateY(0);
    color: #fff;
    text-shadow: none;
    filter: blur(0);
  }
  50% {
    transform: scale(1.4) translateY(-2px);
    color: #fff;
    text-shadow:
      0 0 15px rgba(224, 17, 95, 0.8),
      0 0 30px rgba(255, 255, 255, 0.6);
    filter: blur(0.3px) brightness(1.25);
  }
  100% {
    transform: scale(1) translateY(0);
    color: #fff;
    text-shadow: none;
    filter: blur(0);
  }
}

.btn-shine {
  position: relative;
  overflow: hidden;
}

.btn-shine::before {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 55%;
  height: 100%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.82), transparent);
  transform: skewX(-24deg);
  pointer-events: none;
  animation: btn-shine-run 3.8s ease-in-out infinite;
}

.btn-shine:hover::before {
  animation-duration: 1.9s;
}

@keyframes btn-shine-run {
  0% {
    left: -120%;
  }
  28% {
    left: 170%;
  }
  100% {
    left: 170%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (max-height: 500px) {
  .mobile-menu-content nav .menu-item {
    font-size: clamp(1.45rem, 6vw, 2rem) !important;
  }

  .mobile-menu-content nav a {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }

  .mobile-menu-content .menu-top-phone-wrapper {
    font-size: 1.2rem !important;
  }
}

@media (max-height: 760px) {
  .mobile-menu-content {
    padding-top: calc(72px + env(safe-area-inset-top)) !important;
    padding-bottom: calc(8px + env(safe-area-inset-bottom)) !important;
  }

  .mobile-menu-content nav a {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }

  .mobile-menu-content .menu-item {
    font-size: clamp(1.55rem, 6.4vw, 2.2rem) !important;
  }

  .mobile-menu-content .menu-footer-copy {
    display: none;
  }

  .mobile-menu-content .menu-top-phone-wrapper {
    font-size: 1.35rem !important;
  }

  .mobile-menu-content .call-label {
    font-size: 10px !important;
    letter-spacing: 0.18em !important;
  }

  .mobile-menu-content .menu-actions {
    gap: 8px !important;
    margin-top: 8px !important;
  }

  .mobile-menu-content .menu-actions a {
    height: 40px !important;
  }
}

@media (max-width: 380px) {
  .vip-logo-monolith {
    gap: 6px;
  }

  .logo-text {
    font-size: 17px;
  }

  .region-code {
    font-size: 15px;
  }
}

`

### 4.3 pp/layout.tsx
`	sx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { MobileMenu } from "@/components/layout/MobileMenu";
import ParallaxBackground from "@/components/parallax/ParallaxBackground";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["cyrillic", "latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "VIPАвто — Автоэлектрика и автоэлектроника в Шахтах | Официальный дилер StarLine",
    template: "%s | VIPАвто",
  },
  description:
    "Профессиональная автоэлектрика в г. Шахты. Установка сигнализаций StarLine, LED/Bi-LED оптика, автозвук, камеры. Рейтинг 4.6 на Яндекс.Картах.",
  alternates: {
    canonical: "/",
  },
  category: "autos",
  keywords: [
    "автоэлектрика шахты",
    "автоэлектрик шахты",
    "автоэлектроника",
    "установка starline",
    "сигнализация starline шахты",
    "установка led линз",
    "автозвук",
    "диагностика автоэлектрики",
    "vipauto161",
  ],
  openGraph: {
    title: "VIPАвто",
    description: "Премиальная автоэлектрика и автоэлектроника в г. Шахты.",
    type: "website",
    locale: "ru_RU",
    url: siteConfig.siteUrl,
    siteName: "VIPАвто",
    images: [
      {
        url: "/images/plate-logo.svg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIPАвто",
    description: "Премиальная автоэлектрика и автоэлектроника в г. Шахты.",
    images: ["/images/plate-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: siteConfig.brand,
  image: `${siteConfig.siteUrl}/images/plate-logo.svg`,
  priceRange: "₽₽",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
    addressLocality: siteConfig.city,
    addressRegion: siteConfig.region,
    addressCountry: "RU",
  },
  telephone: siteConfig.phones[0],
  areaServed: "Ростовская область",
  url: siteConfig.siteUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: siteConfig.rating,
    reviewCount: siteConfig.ratingVotes,
  },
  sameAs: [siteConfig.social.telegram, siteConfig.social.whatsapp, siteConfig.social.vk],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${jetBrainsMono.variable} bg-[var(--bg-primary)] antialiased text-[var(--text-primary)]`}>
        <ParallaxBackground intensity={1} />
        <MobileMenu />
        <div className="boot-ui relative z-10 pt-[calc(80px+env(safe-area-inset-top))]">{children}</div>
        <Script id="ui-boot" strategy="beforeInteractive">
          {`
            (function () {
              var root = document.documentElement;
              root.classList.remove('ui-ready');
              var show = function () {
                window.setTimeout(function () {
                  root.classList.add('ui-ready');
                }, 110);
              };
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', show, { once: true });
              } else {
                show();
              }
            })();
          `}
        </Script>
        <Script id="local-business-jsonld" type="application/ld+json">
          {JSON.stringify(localBusinessJsonLd)}
        </Script>
        {yandexMetrikaId ? (
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};ym(${yandexMetrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}


`

### 4.4 hooks/useLockScroll.ts
`	s
"use client";

import { useEffect } from "react";

export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;

    if (locked) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      return () => {
        const restoreY = Number.parseInt(body.dataset.scrollY ?? "0", 10);
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflow = "";
        body.style.overscrollBehavior = "";
        delete body.dataset.scrollY;
        window.scrollTo({ top: restoreY, behavior: "auto" });
      };
    }

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    body.style.overscrollBehavior = "";
    delete body.dataset.scrollY;
    return undefined;
  }, [locked]);
}

`

## 5) Acceptance Criteria
1. Лого: VIPАВТО + регион 161/RUS выглядят как раньше (вертикальный регион).
2. Бургер: появляется через 1.5s, линии мягко падают, трансформация в крестик корректна.
3. Меню: на реальном телефоне видны позвонить, WhatsApp, Telegram.
4. Закрытие меню мягкое, без рывка.
