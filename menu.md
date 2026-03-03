# Полный код файлов, связанных с меню

## components/layout/MobileMenu.tsx

```tsx
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

    if (!overlay || !panel || !footer || !items.length) return;

    closeTlRef.current?.kill();
    gsap.killTweensOf([overlay, panel, footer, ...items]);

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
              transformOrigin: "left center",
            }}
          />
          <span
            ref={lineMidRef}
            className="absolute left-0 top-[7.5px] block h-[2.5px] rounded-full"
            style={{
              width: "70%",
              background: "#e0e6ed",
              boxShadow: "0 0 8px rgba(224,230,237,0.25)",
              opacity: 1,
              transform: "scaleX(1)",
              transformOrigin: "left center",
            }}
          />
          <span
            ref={lineBotRef}
            className="absolute bottom-0 left-0 block h-[2.5px] rounded-full"
            style={{
              width: "50%",
              background: "#00f0ff",
              boxShadow: "0 0 8px rgba(0,240,255,0.25)",
              transform: "translateY(0) rotate(0)",
              transformOrigin: "left center",
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
            <nav className="flex flex-1 items-center justify-center">
              <ul className="w-full max-w-md">
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
                        className="tap-none touch-manipulation group flex items-baseline justify-center py-5 text-center"
                      >
                        <span
                          style={{
                            fontSize: "clamp(1.8rem, 7.5vw, 3.2rem)",
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            color: "#e0e6ed",
                            transition: "opacity 0.3s",
                            opacity: isActive ? 1 : 0.92,
                          }}
                        >
                          <span
                            className="inline-block bg-clip-text"
                            style={{
                              backgroundImage: "none",
                              WebkitBackgroundClip: "unset",
                              WebkitTextFillColor: "inherit",
                            }}
                          >
                            {item.label}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div ref={footerRef} className="mt-8">
              <a
                href={phoneHref}
                className="tap-none block text-center"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
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
```

## app/layout.tsx

```tsx
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
    "Профессиональная автоэлектрика в г. Шахты. Установка сигнализаций StarLine, LED/Bi-LED оптика, автозвук, камеры, кодирование. Рейтинг 4.6 на Яндекс.Картах.",
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
  themeColor: "#050A14",
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
      <body className={`${manrope.variable} ${jetBrainsMono.variable} bg-[var(--bg-primary)] pt-20 antialiased text-[var(--text-primary)]`}>
        <ParallaxBackground intensity={1} />
        <MobileMenu />
        <div className="relative z-10">{children}</div>
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
```

## hooks/useLockScroll.ts

```ts
"use client";

import { useEffect } from "react";

export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    const html = document.documentElement;

    if (locked) {
      const scrollY = window.scrollY;
      html.classList.add("menu-locked");
      html.style.top = `-${scrollY}px`;
      html.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = Number.parseInt(html.dataset.scrollY ?? "0", 10);
      html.classList.remove("menu-locked");
      html.style.top = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      html.classList.remove("menu-locked");
      html.style.top = "";
    };
  }, [locked]);
}
```

## app/globals.css

```css
@import "tailwindcss";

:root {
  --bg-primary: #050a14;
  --bg-secondary: #0a1322;
  --bg-elevated: #101d32;
  --text-primary: #e0e6ed;
  --text-secondary: #9fadbc;
  --line: #22324c;
  --accent: #ccff00;
  --accent-2: #00f0ff;
  --accent-glow: rgba(204, 255, 0, 0.35);
  --accent-2-glow: rgba(0, 240, 255, 0.35);
  --header-h: 80px;
}

html {
  color-scheme: dark;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

html.menu-locked {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  touch-action: none;
}

body {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 18% 16%, rgba(0, 240, 255, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 82% 0%, rgba(204, 255, 0, 0.05) 0%, transparent 34%),
    #050a14;
  color: var(--text-primary);
  font-family: var(--font-manrope), sans-serif;
  overflow-x: hidden;
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
  background: rgb(10 19 34 / 0.55);
  border: 1px solid rgb(34 50 76);
  border-radius: 0.75rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.03);
  backdrop-filter: blur(12px);
  transition: border-color 300ms ease;
}

.card-surface:hover {
  border-color: rgb(0 240 255 / 0.45);
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
```

## app/page.tsx

```tsx
import { StickyMobileActions } from "@/components/effects/StickyMobileActions";
import { ParallaxSection } from "@/components/parallax/ParallaxSection";
import { Reveal } from "@/components/effects/Reveal";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { MultimeterSpoiler } from "@/components/sections/MultimeterSpoiler";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:font-semibold focus:text-[#050A14]"
      >
        Перейти к содержимому
      </a>
      <ScrollProgress />
      <main id="main-content">
        <Reveal>
          <HeroSection />
        </Reveal>
        <ParallaxSection
          className="relative"
          layers={[
            {
              id: "stats-glow",
              speed: -0.2,
              z: 0,
              style: {
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,240,255,0.12) 0%, rgba(204,255,0,0.08) 42%, transparent 72%)",
                filter: "blur(80px)",
                transform: "translateZ(0)",
              },
            },
            {
              id: "stats-grid",
              speed: -0.08,
              z: 1,
              opacityRange: [0.12, 0.03],
              style: {
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              },
            },
          ]}
        >
          <Reveal>
            <StatsSection />
          </Reveal>
        </ParallaxSection>
        <ParallaxSection
          className="relative"
          layers={[
            {
              id: "cmp-bg",
              speed: -0.16,
              z: 0,
              style: {
                background:
                  "radial-gradient(ellipse at 20% 50%, rgba(0,240,255,0.09) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(204,255,0,0.1) 0%, transparent 70%)",
              },
            },
            {
              id: "cmp-grid",
              speed: -0.06,
              z: 1,
              opacityRange: [0.1, 0.02],
              style: {
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                backgroundSize: "100px 100px",
              },
            },
          ]}
        >
          <Reveal>
            <CompareSection />
          </Reveal>
        </ParallaxSection>
        <Reveal>
          <ServicesSection />
        </Reveal>
        <Reveal>
          <AdvantagesSection />
        </Reveal>
        <Reveal>
          <ProcessSection />
        </Reveal>
        <Reveal>
          <BrandsSection />
        </Reveal>
        <Reveal>
          <ReviewsSection />
        </Reveal>
        <Reveal>
          <ContactSection />
        </Reveal>
        <MultimeterSpoiler />
      </main>
      <StickyMobileActions />
      <Footer />
    </>
  );
}
```

## lib/siteConfig.ts

```ts
export const siteConfig = {
  brand: "VIPАвто",
  legalBrand: "VIPAUTO161",
  specialization: "Автоэлектрика и автоэлектроника",
  founded: 2016,
  slogan: "Подключаем технологии. Защищаем с умом.",
  phones: ["+7 (928) 197-77-00", "+7 (928) 777-70-09", "+7 (928) 121-01-61"],
  address: "Ростовская обл., г. Шахты, пер. Новочеркасский, 44Б",
  city: "Шахты",
  region: "Ростовская область",
  schedule: "Пн-Пт 10:00-20:00, Сб-Вс по записи",
  rating: "4.6",
  ratingVotes: 117,
  email: "info@vipauto161.ru",
  inn: "615512388814",
  okpo: "0178696862",
  okved: "45.20",
  registrationDate: "6 июня 2016",
  social: {
    telegram: "https://t.me/VipAuto_161",
    whatsapp: "https://wa.me/message/OHQIEET6AABBO1",
    vk: "https://vk.com/vipauto161",
  },
  yandexMaps: "https://yandex.ru/maps/-/CDa1rOdV",
  siteUrl: "https://vipauto161.ru",
  ogrnip: "316619600153914",
} as const;
```

## components/sections/ServicesSection.tsx

```tsx
import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section id="services" className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Основные услуги</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {services.map((service) => (
            <article key={service.id} className="card-surface rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 md:gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]/75">{service.leadTime}</p>
                {service.popular ? <span className="rounded-full bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]">Популярно</span> : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{service.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{service.description}</p>
              <p className="mt-4 font-mono text-base text-[var(--accent-2)] md:text-lg">{service.price}</p>
              <ul className="mt-4 flex flex-wrap gap-3 md:gap-4">
                {service.features.map((feature) => (
                  <li key={feature} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## components/sections/AdvantagesSection.tsx

```tsx
import { advantages } from "@/data/advantages";

export function AdvantagesSection() {
  return (
    <section id="advantages" className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Почему выбирают VIPАвто</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {advantages.map((advantage) => (
            <article key={advantage.id} className="card-surface rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold leading-snug md:text-3xl">{advantage.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{advantage.description}</p>
              {advantage.stat ? <p className="mt-4 font-mono text-base text-[var(--accent-2)] md:text-lg">{advantage.stat}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## components/sections/ProcessSection.tsx

```tsx
import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <section id="process" className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Как мы работаем</h2>
        <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {processSteps.map((step) => (
            <li key={step.id} className="card-surface relative rounded-xl p-6 md:p-8">
              <p className="font-mono text-sm leading-normal text-[var(--text-secondary)]/75">Шаг {step.id}</p>
              <h3 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{step.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

## components/sections/ReviewsSection.tsx

```tsx
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/lib/siteConfig";

export function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding">
      <div className="container-shell">
        <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Отзывы клиентов</h2>
          <p className="text-sm leading-normal text-[var(--text-secondary)]/75">
            Яндекс Карты: {siteConfig.rating} ({siteConfig.ratingVotes} оценок)
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => (
            <article key={review.id} className="card-surface rounded-xl p-6 md:p-8">
              <p className="text-sm leading-normal text-[var(--text-secondary)]/75">
                {"★".repeat(review.rating)} <span className="ml-1">{review.car}</span>
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]/75">
                {review.service} • {review.date}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{review.text}</p>
              <p className="mt-4 text-sm font-medium leading-normal text-[var(--text-primary)]/90">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## components/sections/ContactSection.tsx

```tsx
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/siteConfig";

export function ContactSection() {
  return (
    <section id="contacts" className="section-padding">
      <div className="container-shell">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <article className="card-surface rounded-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Контакты и запись</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{siteConfig.address}</p>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{siteConfig.schedule}</p>
            <ul className="mt-6 space-y-3 md:space-y-4 text-base md:text-lg">
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-[var(--text-primary)]/90 transition-colors duration-200 hover:text-[var(--text-primary)]">
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
              <a href={siteConfig.social.telegram} className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]">
                Telegram
              </a>
              <a href={siteConfig.social.whatsapp} className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]">
                WhatsApp
              </a>
              <a href={siteConfig.yandexMaps} className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]">
                Яндекс Карты
              </a>
            </div>
          </article>
          <article className="card-surface rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">Оставьте заявку</h3>
            <p className="mt-4 text-sm leading-normal text-[var(--text-secondary)]/75">
              Ответим в рабочее время и согласуем удобную дату визита.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
```


