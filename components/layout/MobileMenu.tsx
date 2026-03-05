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
  const topPhoneRef = useRef<HTMLAnchorElement | null>(null);
  const burgerEntryPlayedRef = useRef(false);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingAnchorRef = useRef<string | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const glitchClearTimerRef = useRef<number | null>(null);
  const openFocusTimerRef = useRef<number | null>(null);

  useLockScroll(isLocked);

  useEffect(() => {
    let timeoutId: number | undefined;

    const showBurger = () => {
      timeoutId = window.setTimeout(() => setIsBurgerVisible(true), 3000);
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

    let loopTimerId: number | undefined;

    const tick = () => {
      const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
      if (randomItem) {
        setGlitchId(randomItem.id);
        if (glitchClearTimerRef.current) {
          window.clearTimeout(glitchClearTimerRef.current);
        }
        glitchClearTimerRef.current = window.setTimeout(() => setGlitchId((prev) => (prev === randomItem.id ? null : prev)), 240);
      }
      loopTimerId = window.setTimeout(tick, 3000 + Math.random() * 3000);
    };

    loopTimerId = window.setTimeout(tick, 1200);

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
    const chars = Array.from(phoneNode.querySelectorAll<HTMLElement>(".menu-top-phone-char:not(.space)"));
    const glare = phoneNode.querySelector<HTMLElement>(".menu-top-phone-glare");
    if (!chars.length || !glare) return;

    const ctx = gsap.context(() => {
      gsap.set(glare, { xPercent: -180 });
      gsap.set(chars, { scale: 1, color: "#f4f4f5" });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      tl.to(
        glare,
        {
          xPercent: 180,
          duration: 0.85,
          ease: "power2.inOut",
        },
        0,
      ).to(
        chars,
        {
          scale: 1.18,
          color: "#ccff00",
          duration: 0.14,
          ease: "power2.out",
          stagger: {
            each: 0.05,
            yoyo: true,
            repeat: 1,
          },
        },
        0.1,
      );
    }, phoneNode);

    return () => {
      ctx.revert();
    };
  }, [isOpen]);

  useEffect(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!top || !mid || !bot) return;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([top, mid, bot]);

      if (isOpen) {
        const flyDistance = -Math.max((window?.innerWidth ?? 420) - 100, 320);
        gsap.to(top, {
          y: 7.2,
          x: 1.2,
          rotate: 36,
          background: "#ccff00",
          boxShadow: "0 0 12px rgba(204,255,0,0.4)",
          duration: 0.5,
          ease: "back.out(1.4)",
        });
        gsap.to(mid, {
          x: flyDistance,
          y: -1.5,
          rotate: -14,
          opacity: 0,
          scaleX: 0,
          duration: 0.26,
          ease: "power4.in",
        });
        gsap.to(bot, {
          y: -7.2,
          x: -1.2,
          rotate: -52,
          width: 38,
          background: "#00f0ff",
          boxShadow: "0 0 12px rgba(0,240,255,0.35)",
          duration: 0.5,
          ease: "back.out(1.4)",
        });
        return;
      }

      gsap.to(top, {
        y: 0,
        x: 0,
        rotate: 0,
        background: "#ccff00",
        boxShadow: "0 0 8px rgba(204,255,0,0.25)",
        duration: 0.46,
        ease: "back.out(1.35)",
      });
      gsap.fromTo(
        mid,
        { x: 16, y: 0, rotate: 0, opacity: 0, scaleX: 0.45 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          scaleX: 1,
          duration: 0.44,
          delay: 0.06,
          ease: "back.out(1.35)",
        },
      );
      gsap.to(bot, {
        y: 0,
        x: 0,
        rotate: 0,
        width: 19,
        background: "#00f0ff",
        boxShadow: "0 0 8px rgba(0,240,255,0.25)",
        duration: 0.46,
        ease: "back.out(1.35)",
      });
    });

    return () => {
      ctx.revert();
    };
  }, [isOpen]);

  useEffect(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!isBurgerVisible || !top || !mid || !bot || burgerEntryPlayedRef.current) return;

    burgerEntryPlayedRef.current = true;
    const ctx = gsap.context(() => {
      gsap.set([top, mid, bot], { opacity: 0 });

      const entryTl = gsap.timeline();
      entryTl
        .fromTo(
          top,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, ease: "back.out(2)" },
          0,
        )
        .fromTo(
          bot,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, ease: "back.out(2)" },
          0.06,
        )
        .fromTo(
          mid,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.62, ease: "back.out(2.2)" },
          0.12,
        );
    });

    return () => {
      ctx.revert();
    };
  }, [isBurgerVisible]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const footer = footerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];

    if (!overlay || !panel || !footer || !items.length) return;

    const ctx = gsap.context(() => {
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

        gsap
          .timeline({
            onComplete: () => {
              setIsAnimating(false);
            },
          })
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

        if (openFocusTimerRef.current) {
          window.clearTimeout(openFocusTimerRef.current);
        }
        openFocusTimerRef.current = window.setTimeout(() => firstItemRef.current?.focus(), 200);
        return;
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
    });

    return () => {
      if (openFocusTimerRef.current) {
        window.clearTimeout(openFocusTimerRef.current);
        openFocusTimerRef.current = null;
      }
      closeTlRef.current?.kill();
      ctx.revert();
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
          href="/"
          className="header-logo pointer-events-auto absolute top-1/2 z-[1201] -translate-y-1/2 select-none"
          style={{ left: "max(1.25rem, env(safe-area-inset-left))" }}
          aria-label="VIPAuto161 Главная"
        >
          <span className="vip-logo-monolith" aria-label="VIPАВТО 161 RUS">
            <span className="logo-text">
              <span className="vip-part">VIP</span>
              <span className="auto-part">АВТО</span>
            </span>
            <span className="logo-region">
              <span className="region-code">161</span>
              <span className="region-flag">RUS</span>
            </span>
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
              transform: "scaleX(1)",
              transformOrigin: "left center",
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
            className="mobile-menu-content relative z-10 flex min-h-dvh max-h-dvh flex-col justify-between overflow-hidden px-5 pt-[calc(80px+env(safe-area-inset-top))] pb-[calc(12px+env(safe-area-inset-bottom))]"
            style={{
              transform: `scale(${isOpen ? menuScale : 1})`,
              transformOrigin: "top center",
            }}
          >
            <a
              ref={topPhoneRef}
              href={phoneHref}
              className="menu-top-phone-wrapper absolute left-5 top-[calc(18px+env(safe-area-inset-top))] z-20 text-[1.02rem] font-medium tracking-[0.02em] text-zinc-100"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              aria-label={`Позвонить ${HEADER_PHONE}`}
            >
              {phoneChars.map((char, index) => (
                <span key={`phone-top-${index}-${char}`} className={`menu-top-phone-char ${char === " " ? "space" : ""}`}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
              <span className="menu-top-phone-glare" aria-hidden />
            </a>

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
                            transition: "opacity 0.3s",
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

            <div ref={footerRef} className="mt-3">
              <p className="mb-3 max-w-[38ch] text-left text-[12px] leading-relaxed tracking-[0.04em] text-[var(--text-secondary)]/84">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет и сложные электрические случаи.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
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

                <a
                  href={phoneHref}
                  className="btn-shine tap-none touch-manipulation col-span-2 flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#e0e6ed14] bg-[#e0e6ed0a] px-3.5 transition-all duration-300 hover:border-[#e0e6ed26] hover:bg-[#e0e6ed14]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9fadbc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-[0.78rem] font-medium text-[#9fadbc]">Позвонить</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
