"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { MessageCircle, Send } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/cn";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const reduced = useReducedMotion();
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
  const pendingAnchorRef = useRef<string | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);

  useLockScroll(isOpen);

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
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const closeMenu = useCallback((href?: string) => {
    if (href) pendingAnchorRef.current = href;
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
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
    const sections = MENU_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.7],
      },
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
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const footer = footerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!overlay || !panel || !footer || !items.length) return;

    closeTlRef.current?.kill();
    gsap.killTweensOf([overlay, panel, footer, ...items]);

    if (isOpen) {
      gsap.set(overlay, { autoAlpha: 1, visibility: "visible", pointerEvents: "auto" });

      if (reduced) {
        gsap.set(panel, { y: 0, autoAlpha: 0 });
        gsap.set(items, { x: 0, autoAlpha: 0 });
        gsap.set(footer, { autoAlpha: 0, y: 0 });

        gsap
          .timeline()
          .to(panel, { autoAlpha: 1, duration: 0.18, ease: "power2.out" }, 0)
          .to(items, { autoAlpha: 1, duration: 0.14, stagger: 0, ease: "power2.out" }, 0.04)
          .to(footer, { autoAlpha: 1, duration: 0.14, ease: "power2.out" }, 0.08);
      } else {
        gsap.set(panel, { yPercent: -100, autoAlpha: 1 });
        gsap.set(items, {
          x: (index: number) => (index % 2 === 0 ? -80 : 80),
          autoAlpha: 0,
        });
        gsap.set(footer, { autoAlpha: 0, y: 18 });

        gsap
          .timeline()
          .to(panel, { yPercent: 0, duration: 0.5, ease: "power3.out" }, 0)
          .to(
            items,
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.36,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.15,
          )
          .to(footer, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power3.out" }, 0.34);
      }

      window.setTimeout(() => firstItemRef.current?.focus(), reduced ? 70 : 180);
      return;
    }

    if (reduced) {
      const closeTl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
          burgerRef.current?.focus();
          runPendingScroll();
        },
      });

      closeTl
        .to([items, footer], { autoAlpha: 0, duration: 0.12, ease: "power2.in" }, 0)
        .to(panel, { autoAlpha: 0, duration: 0.14, ease: "power2.in" }, 0.02);

      closeTlRef.current = closeTl;
      return;
    }

    const closeTl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
        burgerRef.current?.focus();
        runPendingScroll();
      },
    });

    closeTl
      .to(
        items,
        {
          x: (index: number) => (index % 2 === 0 ? -64 : 64),
          autoAlpha: 0,
          duration: 0.18,
          stagger: { each: 0.05, from: "end" },
          ease: "power2.in",
        },
        0,
      )
      .to(footer, { autoAlpha: 0, y: 14, duration: 0.14, ease: "power2.in" }, 0)
      .to(panel, { yPercent: -100, duration: 0.3, ease: "power3.in" }, 0.1);

    closeTlRef.current = closeTl;
  }, [isOpen, reduced, runPendingScroll]);

  const phoneHref = useMemo(() => `tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[1200] flex h-20 items-center bg-[rgba(5,10,20,0.75)] px-5 backdrop-blur-[20px] backdrop-saturate-[180%] md:hidden">
        <Link href="/" className="relative z-[1201] select-none" aria-label="VIPAuto161 Главная">
          <Image src="/images/plate-logo.svg" alt="VIPАвто 161" width={164} height={44} className="h-9 w-auto" priority />
        </Link>
      </header>

      <button
        ref={burgerRef}
        type="button"
        onClick={isOpen ? () => closeMenu() : openMenu}
        aria-label={isOpen ? "Закрыть мобильное меню" : "Открыть мобильное меню"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-dialog"
        className="fixed right-5 top-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-xl md:hidden"
      >
        <span className="relative flex h-5 w-8 flex-col justify-between">
          <span
            ref={lineTopRef}
            className={cn(
              "block h-0.5 rounded-full transition-all duration-[400ms]",
              isOpen ? "translate-y-[7px] rotate-[44deg]" : "translate-y-0 rotate-0",
            )}
            style={{
              width: isOpen ? "108%" : "100%",
              background: "#ccff00",
              boxShadow: "0 0 12px rgba(204,255,0,0.35)",
            }}
          />
          <span
            ref={lineMidRef}
            className={cn(
              "ml-auto block h-0.5 rounded-full transition-all duration-[400ms]",
              isOpen ? "-translate-y-[3px] -rotate-[56deg]" : "translate-y-0 rotate-0",
            )}
            style={{
              width: isOpen ? "86%" : "72%",
              background: "#00f0ff",
              boxShadow: "0 0 12px rgba(0,240,255,0.35)",
            }}
          />
          <span
            ref={lineBotRef}
            className={cn(
              "ml-auto block h-0.5 rounded-full transition-all duration-[400ms]",
              isOpen ? "translate-x-2 scale-x-0 opacity-0" : "translate-x-0 scale-x-100 opacity-100",
            )}
            style={{
              width: "54%",
              background: "linear-gradient(90deg, #ccff00, #00f0ff)",
            }}
          />
        </span>
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
          className="absolute inset-0 overflow-y-auto bg-[#050a14]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <div className="container-shell flex min-h-dvh flex-col pb-8 pt-[112px]">
            <div className="flex flex-1 items-center">
              <ul className="w-full space-y-8">
                {MENU_ITEMS.map((item, index) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id} className="relative pb-6">
                      <a
                        ref={(el) => setItemRef(index, el)}
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          closeMenu(item.href);
                        }}
                        className="group flex items-baseline gap-4"
                      >
                        <span className="font-[var(--font-jetbrains-mono)] text-xs tracking-[0.18em] text-[#00f0ff]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn("font-bold text-[#e0e6ed]", isActive ? "text-[#ccff00]" : "")}
                          style={{
                            fontSize: "clamp(2rem, 8vw, 3.5rem)",
                            lineHeight: 1,
                            textShadow: isActive ? "0 0 16px rgba(204,255,0,0.18)" : "none",
                          }}
                        >
                          <span className="bg-gradient-to-r from-[#e0e6ed] to-[#e0e6ed] bg-clip-text text-transparent transition-all duration-200 group-hover:from-[#ccff00] group-hover:to-[#00f0ff]">
                            {item.label}
                          </span>
                        </span>
                      </a>
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-[#22324c] opacity-30" />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div ref={footerRef} className="pt-6">
              <p className="font-[var(--font-jetbrains-mono)] text-xs tracking-[0.14em] text-[#9fadbc]">
                +7 (928) 197-77-00
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={siteConfig.social.whatsapp}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#ccff00] text-[#050a14]"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.social.telegram}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#ccff00] text-[#050a14]"
                  aria-label="Telegram"
                >
                  <Send className="h-4 w-4" />
                </a>
                <a href={phoneHref} className="ml-1 text-sm text-[#9fadbc]">
                  Позвонить
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
