"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight, PhoneCall } from "lucide-react";
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

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const lineTopRef = useRef<HTMLSpanElement>(null);
  const lineMidRef = useRef<HTMLSpanElement>(null);
  const lineBotRef = useRef<HTMLSpanElement>(null);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const iconTlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingAnchorRef = useRef<string | null>(null);

  useLockScroll(isOpen);

  const setItemRef = useCallback((index: number, el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el;
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

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const focusFirst = useCallback(() => {
    const target = closeRef.current ?? itemRefs.current[0];
    target?.focus();
  }, []);

  const trapFocus = useCallback((event: KeyboardEvent) => {
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
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const sections = MENU_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
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
    const root = rootRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const cta = ctaRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const top = lineTopRef.current;
    const mid = lineMidRef.current;
    const bot = lineBotRef.current;
    if (!root || !panel || !backdrop || !items.length || !cta || !top || !mid || !bot) return;

    menuTlRef.current?.kill();
    iconTlRef.current?.kill();

    gsap.set(root, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(panel, { yPercent: reduced ? 0 : -100, autoAlpha: reduced ? 0 : 1 });
    gsap.set(items, {
      x: reduced ? 0 : (index: number) => (index % 2 === 0 ? -60 : 60),
      autoAlpha: 0,
    });
    gsap.set(cta, { autoAlpha: 0, y: reduced ? 0 : 24 });

    const menuTl = gsap.timeline({ paused: true });
    menuTl
      .set(root, { autoAlpha: 1, visibility: "visible", pointerEvents: "auto" })
      .to(backdrop, { autoAlpha: 1, duration: reduced ? 0.14 : 0.24, ease: "power2.out" }, 0)
      .to(panel, { yPercent: 0, autoAlpha: 1, duration: reduced ? 0.2 : 0.56, ease: "power3.out" }, 0)
      .to(
        items,
        {
          x: 0,
          autoAlpha: 1,
          duration: reduced ? 0.18 : 0.52,
          stagger: reduced ? 0 : 0.1,
          ease: "power3.out",
        },
        reduced ? 0.06 : 0.14,
      )
      .to(
        cta,
        {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0.18 : 0.4,
          ease: "power3.out",
        },
        reduced ? 0.1 : 0.3,
      );

    menuTl.eventCallback("onReverseComplete", () => {
      gsap.set(root, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
      burgerRef.current?.focus();
      runPendingScroll();
    });

    const iconTl = gsap.timeline({ paused: true });
    iconTl
      .to(
        top,
        {
          y: 7,
          rotation: 45,
          transformOrigin: "50% 50%",
          duration: 0.28,
          ease: "power2.out",
          boxShadow: "0 0 14px rgba(204,255,0,0.45)",
        },
        0,
      )
      .to(
        mid,
        {
          y: -3,
          rotation: -45,
          transformOrigin: "50% 50%",
          duration: 0.28,
          ease: "power2.out",
          boxShadow: "0 0 14px rgba(0,240,255,0.45)",
        },
        0,
      )
      .to(bot, { autoAlpha: 0, scaleX: 0.2, duration: 0.2, ease: "power2.inOut" }, 0);

    menuTlRef.current = menuTl;
    iconTlRef.current = iconTl;

    return () => {
      menuTl.kill();
      iconTl.kill();
    };
  }, [reduced, runPendingScroll]);

  useEffect(() => {
    const menuTl = menuTlRef.current;
    const iconTl = iconTlRef.current;
    if (!menuTl || !iconTl) return;

    if (isOpen) {
      menuTl.play();
      iconTl.play();
      window.setTimeout(focusFirst, reduced ? 80 : 180);
    } else {
      menuTl.reverse();
      iconTl.reverse();
    }
  }, [focusFirst, isOpen, reduced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        handleClose();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isOpen, trapFocus]);

  const onNavClick = useCallback((href: string) => {
    pendingAnchorRef.current = href;
    handleClose();
  }, [handleClose]);

  const phoneHref = useMemo(() => `tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[1200] flex h-20 items-center justify-between bg-[rgba(5,10,20,0.75)] px-5 shadow-[0_1px_0_rgba(224,230,237,0.05),0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-[20px] backdrop-saturate-[180%]">
        <Link href="/" className="relative z-[1202] select-none" aria-label="VIPAuto161 Главная">
          <Image src="/images/plate-logo.svg" alt="VIPАвто 161" width={164} height={44} className="h-9 w-auto" priority />
        </Link>

        <button
          ref={burgerRef}
          type="button"
          onClick={isOpen ? handleClose : handleOpen}
          aria-label={isOpen ? "Закрыть мобильное меню" : "Открыть мобильное меню"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-dialog"
          className={cn(
            "group relative z-[1202] flex h-12 w-12 items-center justify-center rounded-xl md:hidden",
            "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
            "hover:shadow-[0_0_22px_rgba(0,240,255,0.24)]",
          )}
        >
          <span className="relative flex h-[20px] w-8 flex-col justify-between">
            <span
              ref={lineTopRef}
              className="block h-0.5 w-full rounded-full"
              style={{ background: "var(--accent)", boxShadow: "0 0 12px rgba(204,255,0,0.35)" }}
            />
            <span
              ref={lineMidRef}
              className="block h-0.5 w-full rounded-full"
              style={{ background: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,240,255,0.35)" }}
            />
            <span
              ref={lineBotRef}
              className="block h-0.5 w-full rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                boxShadow: "0 0 12px rgba(0,240,255,0.25)",
              }}
            />
          </span>
        </button>
      </header>

      <div ref={rootRef} className="fixed inset-0 z-[1250] md:hidden" aria-hidden={!isOpen}>
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-[rgba(5,10,20,0.68)] backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
        />

        <div
          id="mobile-nav-dialog"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
          className="absolute inset-0 overflow-y-auto bg-[rgba(5,10,20,0.92)] pt-[96px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
          style={{
            borderTop: "1px solid rgba(0,240,255,0.2)",
            boxShadow: "inset 0 1px 0 rgba(224,230,237,0.06)",
          }}
        >
          <div className="container-shell flex min-h-[calc(100dvh-96px)] flex-col pb-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]/85">Навигация</p>
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-2)]/55 hover:text-[var(--text-primary)]"
              >
                Закрыть
              </button>
            </div>

            <ul className="space-y-2">
              {MENU_ITEMS.map((item, index) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      ref={(el) => setItemRef(index, el)}
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavClick(item.href);
                      }}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-2xl px-3 py-4",
                        "transition-colors duration-200 hover:bg-[var(--bg-secondary)]/45",
                        isActive ? "bg-[var(--bg-secondary)]/50" : "bg-transparent",
                      )}
                    >
                      <span className="w-8 font-[var(--font-jetbrains-mono)] text-xs tracking-[0.15em] text-[var(--accent-2)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={cn(
                          "text-3xl font-bold leading-none text-[var(--text-primary)] sm:text-4xl",
                          isActive ? "text-[var(--accent)]" : "",
                        )}
                        style={{
                          textShadow: isActive ? "0 0 18px rgba(204,255,0,0.22)" : "none",
                        }}
                      >
                        <span className="bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary)] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[var(--accent)] group-hover:to-[var(--accent-2)]">
                          {item.label}
                        </span>
                      </span>

                      <span className="ml-auto h-px w-10 bg-[var(--line)] transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--accent-2)]/65" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div ref={ctaRef} className="mt-auto pt-8">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-secondary)]/50 p-4 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={siteConfig.social.whatsapp}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[#050A14] shadow-[0_0_20px_rgba(204,255,0,0.26)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(204,255,0,0.35)]"
                  >
                    WhatsApp
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a
                    href={siteConfig.social.telegram}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--accent-2)]/40 bg-[rgba(0,240,255,0.08)] px-4 py-3 font-semibold text-[var(--text-primary)] shadow-[0_0_16px_rgba(0,240,255,0.18)] transition-all duration-200 hover:border-[var(--accent-2)]/70"
                  >
                    Telegram
                    <ArrowUpRight className="h-4 w-4 text-[var(--accent-2)]" />
                  </a>
                </div>

                <a
                  href={phoneHref}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)]/55 hover:text-[var(--accent)]"
                >
                  <PhoneCall className="h-4 w-4" />
                  {siteConfig.phones[0]}
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
