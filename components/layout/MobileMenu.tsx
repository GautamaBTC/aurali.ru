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
  { id: "advantages", href: "#advantages", label: "Преимущества" },
  { id: "process", href: "#process", label: "Процесс" },
  { id: "reviews", href: "#reviews", label: "Отзывы" },
  { id: "contacts", href: "#contacts", label: "Контакты" },
] as const;

const HEADER_HEIGHT = 80;

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("services");

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const lineTopRef = useRef<HTMLSpanElement>(null);
  const lineMidRef = useRef<HTMLSpanElement>(null);
  const lineBotRef = useRef<HTMLSpanElement>(null);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const dividerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pendingAnchorRef = useRef<string | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);

  useLockScroll(isOpen);

  const setItemRef = useCallback((index: number, el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el;
    if (index === 0) firstItemRef.current = el;
  }, []);

  const setDividerRef = useCallback((index: number, el: HTMLSpanElement | null) => {
    dividerRefs.current[index] = el;
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
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!top || !mid || !bot) return;

    gsap.killTweensOf([top, mid, bot]);

    if (isOpen) {
      gsap.to(top, {
        y: 7.5,
        rotate: 45,
        boxShadow: "0 0 14px rgba(204,255,0,0.5)",
        duration: 0.38,
        ease: "power3.out",
      });
      gsap.to(mid, {
        opacity: 0,
        scaleX: 0,
        duration: 0.25,
        ease: "power2.out",
      });
      gsap.to(bot, {
        y: -7.5,
        rotate: -45,
        width: 28,
        marginLeft: 0,
        background: "#00f0ff",
        boxShadow: "0 0 14px rgba(0,240,255,0.5)",
        duration: 0.38,
        ease: "power3.out",
      });
      return;
    }

    gsap.to(top, {
      y: 0,
      rotate: 0,
      boxShadow: "0 0 8px rgba(204,255,0,0.25)",
      duration: 0.36,
      ease: "power3.out",
    });
    gsap.to(mid, {
      opacity: 1,
      scaleX: 1,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(bot, {
      y: 0,
      rotate: 0,
      width: 14,
      marginLeft: 14,
      background: "linear-gradient(90deg, #ccff00, #00f0ff)",
      boxShadow: "0 0 8px rgba(0,240,255,0.2)",
      duration: 0.36,
      ease: "power3.out",
    });
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const footer = footerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const dividers = dividerRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (!overlay || !panel || !footer || !items.length) return;

    closeTlRef.current?.kill();
    gsap.killTweensOf([overlay, panel, footer, ...items, ...dividers]);

    if (isOpen) {
      gsap.set(overlay, {
        autoAlpha: 1,
        visibility: "visible",
        pointerEvents: "auto",
      });

      gsap.set(panel, { yPercent: -100, autoAlpha: 1 });
      gsap.set(items, {
        x: (index: number) => (index % 2 === 0 ? -140 : 140),
        autoAlpha: 0,
      });
      gsap.set(dividers, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(footer, { autoAlpha: 0, y: 24 });

      gsap
        .timeline()
        .to(panel, { yPercent: 0, duration: 0.55, ease: "power4.out" }, 0)
        .to(
          items,
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.48,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.18,
        )
        .to(
          dividers,
          {
            scaleX: 1,
            duration: 0.35,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.3,
        )
        .to(footer, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.42);

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
          x: (index: number) => (index % 2 === 0 ? -80 : 80),
          autoAlpha: 0,
          duration: 0.2,
          stagger: { each: 0.04, from: "end" },
          ease: "power2.in",
        },
        0,
      )
      .to(
        dividers,
        {
          scaleX: 0,
          duration: 0.15,
          stagger: { each: 0.03, from: "end" },
          ease: "power2.in",
        },
        0,
      )
      .to(footer, { autoAlpha: 0, y: 16, duration: 0.15, ease: "power2.in" }, 0)
      .to(panel, { yPercent: -100, duration: 0.35, ease: "power3.in" }, 0.12);

    closeTlRef.current = closeTl;
  }, [isOpen, runPendingScroll]);

  const phoneHref = useMemo(() => `tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`, []);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-[1200] flex h-20 items-center justify-between px-5 md:hidden"
        style={{
          background: "rgba(5,10,20,0.8)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <Link href="/" className="relative z-[1201] select-none" aria-label="VIPAuto161 Главная">
          <Image
            src="/images/plate-logo.svg"
            alt="VIPАвто 161"
            width={164}
            height={44}
            className="h-9 w-auto"
            priority
          />
        </Link>
      </header>

      <button
        ref={burgerRef}
        type="button"
        onClick={isOpen ? () => closeMenu() : openMenu}
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        className="tap-none touch-manipulation fixed right-5 top-5 z-[10000] flex h-11 w-11 items-center justify-center md:hidden"
        style={{ background: "none", border: "none", outline: "none" }}
      >
        <div className="relative h-[18px] w-[28px]">
          <span
            ref={lineTopRef}
            className="absolute left-0 top-0 block h-[2.5px] rounded-full"
            style={{
              width: "100%",
              background: "#ccff00",
              boxShadow: "0 0 8px rgba(204,255,0,0.25)",
              transform: "translateY(0) rotate(0)",
            }}
          />
          <span
            ref={lineMidRef}
            className="absolute left-0 top-[7.5px] block h-[2.5px] rounded-full"
            style={{
              width: "70%",
              marginLeft: "auto",
              background: "#00f0ff",
              boxShadow: "0 0 8px rgba(0,240,255,0.25)",
              opacity: 1,
              transform: "scaleX(1)",
              transformOrigin: "right center",
            }}
          />
          <span
            ref={lineBotRef}
            className="absolute bottom-0 left-0 block h-[2.5px] rounded-full"
            style={{
              width: "50%",
              marginLeft: "auto",
              background: "linear-gradient(90deg, #ccff00, #00f0ff)",
              boxShadow: "0 0 8px rgba(0,240,255,0.2)",
              transform: "translateY(0) rotate(0)",
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
          className="absolute inset-0 overflow-y-auto bg-[#050a14]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <div className="flex min-h-dvh flex-col justify-between px-6 pb-10 pt-28">
            <nav className="flex flex-1 items-center">
              <ul className="w-full">
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
                        className="tap-none touch-manipulation group flex items-baseline py-5"
                      >
                        <span
                          style={{
                            fontSize: "clamp(1.8rem, 7.5vw, 3.2rem)",
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            color: isActive ? "#ccff00" : "#e0e6ed",
                            textShadow: isActive ? "0 0 20px rgba(204,255,0,0.2)" : "none",
                            transition: "color 0.3s, text-shadow 0.3s",
                          }}
                        >
                          <span
                            className="inline-block bg-clip-text"
                            style={{
                              backgroundImage: isActive ? "linear-gradient(90deg, #ccff00, #00f0ff)" : "none",
                              WebkitBackgroundClip: isActive ? "text" : "unset",
                              WebkitTextFillColor: isActive ? "transparent" : "inherit",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {item.label}
                          </span>
                        </span>
                      </a>
                      {index < MENU_ITEMS.length - 1 ? (
                        <span
                          ref={(el) => setDividerRef(index, el)}
                          className="block h-px w-full"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(34,50,76,0.4) 20%, rgba(34,50,76,0.4) 80%, transparent)",
                          }}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div ref={footerRef} className="mt-8">
              <a
                href={phoneHref}
                className="tap-none inline-block"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  color: "#9fadbc",
                  transition: "color 0.2s",
                }}
              >
                {siteConfig.phones[0]}
              </a>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={siteConfig.social.whatsapp}
                  aria-label="WhatsApp"
                  className="tap-none touch-manipulation flex h-10 items-center gap-2 rounded-full border border-[#ccff0026] bg-[#ccff0014] px-4 transition-all duration-300 hover:border-[#ccff0059] hover:bg-[#ccff0026] hover:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ccff00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span className="text-[0.72rem] font-semibold tracking-[0.06em] text-[#ccff00]">WhatsApp</span>
                </a>

                <a
                  href={siteConfig.social.telegram}
                  aria-label="Telegram"
                  className="tap-none touch-manipulation flex h-10 items-center gap-2 rounded-full border border-[#00f0ff26] bg-[#00f0ff0f] px-4 transition-all duration-300 hover:border-[#00f0ff59] hover:bg-[#00f0ff1f] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span className="text-[0.72rem] font-semibold tracking-[0.06em] text-[#00f0ff]">Telegram</span>
                </a>

                <a
                  href={phoneHref}
                  className="tap-none touch-manipulation ml-1 flex h-10 items-center gap-1.5 rounded-full border border-[#e0e6ed14] bg-[#e0e6ed0a] px-4 transition-all duration-300 hover:border-[#e0e6ed26] hover:bg-[#e0e6ed14]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9fadbc"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-[0.72rem] font-medium text-[#9fadbc]">Позвонить</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: HEADER_HEIGHT }} aria-hidden />
    </>
  );
}
