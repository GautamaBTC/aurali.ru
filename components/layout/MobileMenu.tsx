"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBurgerVisible, setIsBurgerVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>("services");
  const [glitchId, setGlitchId] = useState<string | null>(null);
  const [phoneGlitch, setPhoneGlitch] = useState(false);
  const [animatedPhone, setAnimatedPhone] = useState<string>("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const lineTopRef = useRef<HTMLSpanElement>(null);
  const lineMidRef = useRef<HTMLSpanElement>(null);
  const lineBotRef = useRef<HTMLSpanElement>(null);
  const burgerEntryPlayedRef = useRef(false);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingAnchorRef = useRef<string | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);

  useLockScroll(isOpen);

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

    const y = node.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const closeMenu = useCallback((href?: string) => {
    if (href) pendingAnchorRef.current = href;
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => setIsOpen(true), []);

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
  }, []);

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
    if (!isOpen) {
      setGlitchId(null);
      return;
    }

    let timerId: number | undefined;

    const tick = () => {
      const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
      if (randomItem) {
        setGlitchId(randomItem.id);
        window.setTimeout(() => setGlitchId((prev) => (prev === randomItem.id ? null : prev)), 240);
      }
      timerId = window.setTimeout(tick, 3000 + Math.random() * 3000);
    };

    timerId = window.setTimeout(tick, 1200);

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [isOpen]);

  const preferredPhone = useMemo(
    () => siteConfig.phones.find((phone) => phone.includes("777-70-09")) ?? siteConfig.phones[0],
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      setPhoneGlitch(false);
      setAnimatedPhone(preferredPhone);
      return;
    }

    setAnimatedPhone(preferredPhone);

    const runDigits = window.setInterval(() => {
      setAnimatedPhone((prev) => prev.replace(/(\d{2})-(\d{2})$/, `${rand2()}-${rand2()}`));
      window.setTimeout(() => setAnimatedPhone(preferredPhone), 580);
    }, 2000);

    const runPhoneGlitch = window.setInterval(() => {
      setPhoneGlitch(true);
      window.setTimeout(() => setPhoneGlitch(false), 250);
    }, 10000);

    return () => {
      window.clearInterval(runDigits);
      window.clearInterval(runPhoneGlitch);
    };
  }, [isOpen, preferredPhone]);

  useEffect(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!top || !mid || !bot) return;

    gsap.killTweensOf([top, mid, bot]);

    if (isOpen) {
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
        x: -34,
        y: -1.5,
        rotate: -14,
        opacity: 0,
        scaleX: 0.15,
        duration: 0.36,
        ease: "power2.in",
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
  }, [isOpen]);

  useEffect(() => {
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!isBurgerVisible || !top || !mid || !bot || burgerEntryPlayedRef.current) return;

    burgerEntryPlayedRef.current = true;
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
  }, [isBurgerVisible]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const footer = footerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];

    if (!overlay || !panel || !footer || !items.length) return;

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
        .timeline()
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

      window.setTimeout(() => firstItemRef.current?.focus(), 200);
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
        runPendingScroll();
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
  }, [isOpen, runPendingScroll]);

  const phoneHref = useMemo(() => `tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`, []);

  function rand2() {
    return String(Math.floor(Math.random() * 100)).padStart(2, "0");
  }

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-[1200] flex h-[72px] items-center justify-between px-5 md:hidden"
        style={{
          background: "rgba(5,10,20,0.8)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <Link href="/" className="relative z-[1201] select-none" aria-label="VIPAuto161 Главная">
          <Image src="/images/plate-logo.svg" alt="VIPАвто 161" width={189} height={51} className="h-[42px] w-auto" priority />
        </Link>
      </header>

      <button
        ref={burgerRef}
        type="button"
        onClick={isOpen ? () => closeMenu() : openMenu}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        className={`tap-none touch-manipulation fixed right-5 top-0 z-[10000] flex h-[80px] w-[80px] items-center justify-center transition-opacity duration-300 md:hidden ${isBurgerVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
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
          className="absolute inset-0 overflow-y-auto"
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

          <div className="relative z-10 flex min-h-dvh flex-col justify-between px-6 pb-10 pt-20">
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
                        className="tap-none touch-manipulation group flex items-baseline justify-center py-5 text-center focus-visible:outline-none"
                      >
                        <span
                          className={`menu-item ${isGlitching ? "glitch-active" : ""}`}
                          style={{
                            fontSize: "clamp(1.7rem, 7vw, 3rem)",
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

            <div ref={footerRef} className="mt-8">
              <p className="mx-auto mb-4 max-w-[34ch] text-center text-xs leading-relaxed tracking-[0.04em] text-[var(--text-secondary)]/82">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет, кодирование блоков и сложные
                электрические случаи.
              </p>
              <a
                href={phoneHref}
                className={`phone-number tap-none block text-center ${phoneGlitch ? "phone-glitch-active" : ""}`}
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "1.08rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "#9fadbc",
                  transition: "color 0.2s",
                }}
              >
                {animatedPhone || preferredPhone}
              </a>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:flex sm:items-center sm:gap-3">
                <a
                  href={siteConfig.social.whatsapp}
                  aria-label="WhatsApp"
                  className="btn-shine tap-none touch-manipulation flex h-10 items-center justify-center gap-2 rounded-full border border-[#ccff0026] bg-[#ccff0014] px-4 transition-all duration-300 hover:border-[#ccff0059] hover:bg-[#ccff0026] hover:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span className="text-[0.72rem] font-semibold tracking-[0.06em] text-[#ccff00]">WhatsApp</span>
                </a>

                <a
                  href={siteConfig.social.telegram}
                  aria-label="Telegram"
                  className="btn-shine tap-none touch-manipulation flex h-10 items-center justify-center gap-2 rounded-full border border-[#00f0ff26] bg-[#00f0ff0f] px-4 transition-all duration-300 hover:border-[#00f0ff59] hover:bg-[#00f0ff1f] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span className="text-[0.72rem] font-semibold tracking-[0.06em] text-[#00f0ff]">Telegram</span>
                </a>

                <a
                  href={phoneHref}
                  className="btn-shine tap-none touch-manipulation flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#e0e6ed14] bg-[#e0e6ed0a] px-4 transition-all duration-300 hover:border-[#e0e6ed26] hover:bg-[#e0e6ed14] sm:ml-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9fadbc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-[0.72rem] font-medium text-[#9fadbc]">Позвонить</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
