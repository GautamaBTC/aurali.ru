# Requested files snapshot`n
## app/page.tsx
`\n"use client";

import { StickyMobileActions } from "@/components/effects/StickyMobileActions";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PartnerBrandsSection } from "@/components/sections/PartnerBrandsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useGlobalReveal } from "@/hooks/useGlobalReveal";

export default function Home() {
  useGlobalReveal();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:font-semibold focus:text-black"
      >
        Перейти к содержимому
      </a>
      <ScrollProgress />
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <CompareSection />
        <ProductShowcase />
        <ServicesSection />
        <PartnerBrandsSection />
        <AdvantagesSection />
        <ProcessSection />
        <BrandsSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <StickyMobileActions />
      <ScrollToTop />
      <Footer />
    </>
  );
}
\n`\n
## app/layout.tsx
`\nimport type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileMenuWrapper } from "@/components/layout/MobileMenuWrapper";
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
    <html lang="ru" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${manrope.variable} ${jetBrainsMono.variable} bg-[var(--bg-primary)] antialiased text-[var(--text-primary)]`}
      >
        <ParallaxBackground intensity={1} />
        <DesktopHeader />
        <MobileMenuWrapper />
        <div className="boot-ui relative z-10 pt-[calc(80px+env(safe-area-inset-top))] lg:pt-[72px]">{children}</div>
        <Script id="motion-policy" strategy="beforeInteractive">
          {`
            (function () {
              var root = document.documentElement;
              var params = new URLSearchParams(window.location.search);
              var raw = (params.get('debug-motion') || '').trim().toLowerCase();
              var forceMotion = raw === '1' || raw === 'true' || raw === 'on';
              var forceReduced = raw === '0' || raw === 'false' || raw === 'off';
              var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              if (forceMotion) reduced = false;
              if (forceReduced) reduced = true;
              root.setAttribute('data-reduce-motion', reduced ? 'true' : 'false');
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

\n`\n
## next.config.ts
`\nimport type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
\n`\n
## components/sections/HeroSection.tsx
`\n"use client";

import { useRef } from "react";
import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".hero-reveal",
    from: { y: 30, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="reveal-section relative h-auto overflow-visible py-8 md:min-h-[80vh] md:py-16"
      style={{ touchAction: "auto" }}
    >
      <div className="container-shell">
        <div className="card-surface relative overflow-hidden bg-[rgba(5,10,20,0.62)] p-6 md:p-8">
          <div className="absolute inset-0 z-0 overflow-hidden lg:hidden" suppressHydrationWarning>
            {!reducedMotion ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/hero-poster.svg"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              >
                <source src="/uploads/videos/hader.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 bg-center bg-cover opacity-30" style={{ backgroundImage: "url('/images/hero-poster.svg')" }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950" />
          </div>

          <div className="hero-reveal pointer-events-none absolute right-4 top-4 z-[1] hidden items-center gap-2 rounded-full border border-[var(--accent-2)]/30 bg-[rgba(5,10,20,0.55)] px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)] backdrop-blur md:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            LIVE FEED
          </div>

          <div className="relative z-[1] grid gap-6 md:gap-8 lg:items-center">
            <div>
              <p className="hero-reveal text-xs font-medium uppercase tracking-widest text-zinc-400">
                <span className="accent-dot" />
                РЁР°С…С‚С‹ вЂў СЃ 2009 РіРѕРґР° вЂў СЂРµР№С‚РёРЅРі {siteConfig.rating}
              </p>
              <h1 className="hero-reveal mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {siteConfig.brand}: {siteConfig.specialization}
              </h1>
              <p className="hero-reveal mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                РћРґРёРЅ РёР· СЃС‚Р°СЂРµР№С€РёС… СЃРµСЂРІРёСЃРѕРІ Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєРё РІ РЁР°С…С‚Р°С….
              </p>
              <p className="hero-reveal mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                РџСЂРµРјРёР°Р»СЊРЅС‹Р№ С†РµРЅС‚СЂ Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєРё. Р”РёР°РіРЅРѕСЃС‚РёРєР°, StarLine, Р°РІС‚РѕСЃРІРµС‚ Рё СЃР»РѕР¶РЅС‹Рµ СЌР»РµРєС‚СЂРёС‡РµСЃРєРёРµ СЃР»СѓС‡Р°Рё.
              </p>
              <div className="hero-reveal mt-4 inline-flex max-w-full items-center rounded-full border border-[var(--accent-2)]/25 bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]">
                РћС„РёС†РёР°Р»СЊРЅС‹Р№ РґРёР»РµСЂ StarLine
              </div>
              <p className="hero-reveal mt-4 text-sm leading-normal text-zinc-500">
                <TypeWriter words={["Р”РёР°РіРЅРѕСЃС‚РёРєР°", "StarLine", "РђРІС‚РѕСЃРІРµС‚", "Р РµРјРѕРЅС‚ РїСЂРѕРІРѕРґРєРё"]} />
              </p>
              <div className="hero-reveal mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="touch-manipulation inline-flex w-full items-center justify-center rounded-lg bg-[var(--accent)] px-6 py-3 text-center font-medium text-[#0b0b0b] shadow-[0_0_24px_rgba(204,255,0,0.28)] transition-all duration-200 hover:bg-[var(--accent)]/90 hover:text-[#0b0b0b] hover:shadow-[0_0_36px_rgba(204,255,0,0.35)] sm:w-auto"
                    style={{ color: "#0b0b0b", WebkitTextFillColor: "#0b0b0b" }}
                  >
                    Р—Р°РїРёСЃР°С‚СЊСЃСЏ РІ WhatsApp
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="touch-manipulation inline-flex w-full items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-6 py-3 text-center font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-2)]/45 hover:bg-[var(--bg-elevated)] sm:w-auto"
                  >
                    РќР°РїРёСЃР°С‚СЊ РІ Telegram
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
\n`\n
## components/sections/BrandsSection.tsx
`\n"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { brands } from "@/data/brands";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import type { BrandItem } from "@/types";

const BRAND_GROUPS = [
  { key: "all", label: "Р’СЃРµ" },
  { key: "europe", label: "Р•РІСЂРѕРїРµР№СЃРєРёРµ" },
  { key: "japan", label: "РЇРїРѕРЅСЃРєРёРµ" },
  { key: "korea", label: "РљРѕСЂРµР№СЃРєРёРµ" },
  { key: "china", label: "РљРёС‚Р°Р№СЃРєРёРµ" },
  { key: "usa", label: "РђРјРµСЂРёРєР°РЅСЃРєРёРµ" },
  { key: "russia", label: "Р РѕСЃСЃРёР№СЃРєРёРµ" },
] as const;

type BrandGroupKey = (typeof BRAND_GROUPS)[number]["key"];

function getBrandIcon(name: string) {
  return name.replace(/[^A-Za-zРђ-РЇР°-СЏ0-9]/g, "").slice(0, 3).toUpperCase();
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 32,
  animate = true,
}: {
  items: BrandItem[];
  reverse?: boolean;
  duration?: number;
  animate?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="brands-marquee relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/95 to-transparent md:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--bg-primary)] via-[var(--bg-primary)]/95 to-transparent md:w-16" />

      <div
        className={[
          "flex w-max items-center gap-3",
          animate ? (reverse ? "animate-brands-marquee-reverse" : "animate-brands-marquee") : "",
        ].join(" ")}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="brand-marquee-chip group flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/4 bg-white/4 px-3 text-xs text-white/55 sm:h-10 sm:text-sm"
          >
            <span className="brand-marquee-chip__logo flex h-5 w-5 items-center justify-center rounded-full border border-white/5 bg-white/4 text-[9px] font-bold tracking-[0.16em] text-white/45">
              {getBrandIcon(brand.name)}
            </span>
            <span className="whitespace-nowrap font-medium">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandGridCard({
  brand,
  index,
  expanded,
}: {
  brand: BrandItem;
  index: number;
  expanded: boolean;
}) {
  return (
    <article
      className="brand-grid-card group relative overflow-hidden rounded-2xl border border-white/5 bg-white/3 p-3 sm:p-4"
      style={
        {
          "--brand-accent": brand.color,
          transitionDelay: expanded ? `${Math.min(index * 30, 300)}ms` : "0ms",
          opacity: expanded ? 1 : 0,
          transform: expanded ? "translateY(0px)" : "translateY(12px)",
        } as CSSProperties
      }
    >
      <div className="brand-grid-card__glow" />
      <div className="brand-grid-card__line" />

      <div className="relative z-[1] flex flex-col items-center gap-2 text-center">
        <div className="brand-grid-card__logo flex h-7 w-7 items-center justify-center rounded-xl border border-white/6 bg-white/4 text-[10px] font-bold tracking-[0.18em] text-white/40 sm:h-8 sm:w-8">
          {getBrandIcon(brand.name)}
        </div>
        <h3 className="text-xs font-medium tracking-wide text-white/68">{brand.name}</h3>
      </div>
    </article>
  );
}

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [marqueeRef, marqueeInView] = useInView({ threshold: 0.15, once: false });
  const reduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeGroup, setActiveGroup] = useState<BrandGroupKey>("all");

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".brands-reveal-item",
    from: { y: 20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  const previewBrands = useMemo(() => {
    const featured = brands.filter((brand) => brand.featured);
    return featured.length ? featured : brands.slice(0, 16);
  }, []);

  const topRow = useMemo(() => previewBrands.slice(0, Math.ceil(previewBrands.length / 2)), [previewBrands]);
  const bottomRow = useMemo(() => previewBrands.slice(Math.ceil(previewBrands.length / 2)), [previewBrands]);

  const filteredBrands = useMemo(() => {
    if (activeGroup === "all") return brands;
    return brands.filter((brand) => brand.group === activeGroup);
  }, [activeGroup]);

  return (
    <section ref={sectionRef} id="brands" className="reveal-section section-padding" aria-label="Р‘СЂРµРЅРґС‹ Р°РІС‚РѕРјРѕР±РёР»РµР№">
      <div className="container-shell">
        <div className="brand-showcase-shell overflow-hidden rounded-[2rem] border border-white/5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="brands-reveal-item reveal-item text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">РђРІС‚РѕРјР°СЂРєРё</p>
              <h2 className="brands-reveal-item reveal-item mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">Р Р°Р±РѕС‚Р°РµРј СЃ СЂР°СЃРїСЂРѕСЃС‚СЂР°РЅРµРЅРЅС‹РјРё Рё СЂРµРґРєРёРјРё РїР»Р°С‚С„РѕСЂРјР°РјРё</h2>
              <p className="brands-reveal-item reveal-item mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                РћС‚ РЅРµРјРµС†РєРёС… Рё СЏРїРѕРЅСЃРєРёС… РјРѕРґРµР»РµР№ РґРѕ РЅРѕРІС‹С… РєРёС‚Р°Р№СЃРєРёС… РїР»Р°С‚С„РѕСЂРј. РџРѕРґР±РёСЂР°РµРј СЂРµС€РµРЅРёРµ РїРѕРґ РєРѕРЅРєСЂРµС‚РЅСѓСЋ СЌР»РµРєС‚СЂРѕРЅРёРєСѓ, Р° РЅРµ РїРѕ С€Р°Р±Р»РѕРЅСѓ.
              </p>
            </div>

            <div className="brands-reveal-item reveal-item flex items-center gap-5 rounded-full border border-white/6 bg-white/3 px-4 py-2 text-center">
              <div>
                <p className="text-lg font-bold text-white">{brands.length}+</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">РјР°СЂРѕРє</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">17+</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Р»РµС‚</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">50K+</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Р°РІС‚Рѕ</p>
              </div>
            </div>
          </div>

          <div
            ref={marqueeRef}
            className={`brands-reveal-item reveal-item mt-7 rounded-[1.5rem] border border-white/6 bg-[linear-gradient(180deg,rgba(12,12,14,0.92),rgba(15,15,19,0.84))] px-2 py-2.5 md:px-3 ${
              marqueeInView ? "is-in-view" : ""
            }`}
          >
            <MarqueeRow items={topRow} duration={32} animate={!reduceMotion && marqueeInView} />
            {bottomRow.length ? <MarqueeRow items={bottomRow} reverse duration={35} animate={!reduceMotion && marqueeInView} /> : null}
          </div>

          <div className="brands-reveal-item reveal-item mt-5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setIsExpanded((prev) => {
                  const next = !prev;
                  if (!next) setActiveGroup("all");
                  return next;
                });
              }}
              aria-label={isExpanded ? "РЎРІРµСЂРЅСѓС‚СЊ СЃРїРёСЃРѕРє РјР°СЂРѕРє" : `РџРѕРєР°Р·Р°С‚СЊ РІСЃРµ ${brands.length} РјР°СЂРѕРє`}
              aria-expanded={isExpanded}
              aria-controls="brands-grid"
              className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/4 px-5 py-2.5 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/8 hover:text-white"
            >
              <span>{isExpanded ? "РЎРІРµСЂРЅСѓС‚СЊ" : `Р’СЃРµ ${brands.length} РјР°СЂРѕРє`}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div
            id="brands-grid"
            className={`overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded ? "mt-6 max-h-[2200px] opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <div className={`transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-200" : "opacity-0"}`}>
              <div className="flex flex-wrap items-center justify-center gap-2 pb-5">
                {BRAND_GROUPS.map((group) => {
                  const isActive = activeGroup === group.key;

                  return (
                    <button
                      key={group.key}
                      type="button"
                      onClick={() => setActiveGroup(group.key)}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                        isActive
                          ? "border-white/10 bg-white/10 text-white"
                          : "border-white/5 bg-white/3 text-white/40 hover:bg-white/6 hover:text-white/70"
                      }`}
                    >
                      {group.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                {filteredBrands.map((brand, index) => (
                  <BrandGridCard key={`${activeGroup}-${brand.id}`} brand={brand} index={index} expanded={isExpanded} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
\n`\n
## components/sections/MultimeterSpoiler.tsx
`\n"use client";

import { useState } from "react";
import { ChevronDown, Gauge } from "lucide-react";
import Multimeter from "@/components/multimeter/Multimeter";

export function MultimeterSpoiler() {
  const [open, setOpen] = useState(false);
  const title = "Интерактивный мультиметр";
  const description =
    "Показать/скрыть демо-стенд диагностики";

  return (
    <section id="products" className="section-padding pt-8 md:pt-10">
      <div className="container-shell">
        <div className="card-surface overflow-hidden rounded-2xl">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.02] md:px-6 md:py-5"
            aria-expanded={open}
            aria-controls="multimeter-spoiler-content"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-2)]/35 bg-[var(--accent-2)]/10 text-[var(--accent-2)]">
                <Gauge className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-wide text-[var(--text-primary)] md:text-base">{title}</p>
                <p className="text-xs text-[var(--text-secondary)] md:text-sm">{description}</p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-[var(--accent)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open ? (
            <div id="multimeter-spoiler-content" className="border-t border-[var(--line)]/70 px-2 pb-2 pt-3 md:px-3 md:pb-3">
              <Multimeter autoAnimate animationInterval={3200} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

\n`\n
## public/images/plate-logo.svg
`\n<svg xmlns="http://www.w3.org/2000/svg" width="200" height="54" viewBox="0 0 260 70" class="plate-logo" aria-label="VIPАвто 161">
  <defs>
    <linearGradient id="plateBg" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#fdfdfd"/>
      <stop offset="100%" stop-color="#f1f2f4"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#111827" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect class="svg-elem-1" x="3" y="5" width="254" height="60" rx="9" fill="url(#plateBg)" stroke="#1a1f2b" stroke-width="3.2" filter="url(#shadow)"/>
  <rect class="svg-elem-2" x="7" y="9" width="246" height="52" rx="7" fill="none" stroke="#0d121f" stroke-width="1.6"/>
  <line class="svg-elem-3" x1="186" y1="9" x2="186" y2="61" stroke="#0d121f" stroke-width="2"/>
  <text class="svg-elem-4" x="20" y="48" fill="#0d121f" font-family="DIN Condensed, 'Segoe UI', Arial" font-weight="700" font-size="34" letter-spacing="1.2">VIPАВТО</text>
  <text class="svg-elem-5" x="196" y="36" fill="#0d121f" font-family="DIN Condensed, 'Segoe UI', Arial" font-weight="700" font-size="24" letter-spacing="1">161</text>
  <text class="svg-elem-6" x="196" y="52.5" fill="#0d121f" font-family="DIN Condensed, 'Segoe UI', Arial" font-weight="700" font-size="13">RUS</text>
  <rect class="svg-elem-7" x="224" y="42" width="22" height="12" fill="#fff" stroke="#0d121f" stroke-width="1"/>
  <rect class="svg-elem-8" x="224" y="42" width="22" height="4" fill="#fff"/>
  <rect class="svg-elem-9" x="224" y="46" width="22" height="4" fill="#0052b4"/>
  <rect class="svg-elem-10" x="224" y="50" width="22" height="4" fill="#d80027"/>
</svg>
\n`\n
## components/layout/DesktopHeader.tsx
`\n"use client";

import Image from "next/image";
import Link from "next/link";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const MENU_ITEMS = [
  { id: "services", href: "#services", label: "РЈСЃР»СѓРіРё" },
  { id: "advantages", href: "#advantages", label: "РџСЂРµРёРјСѓС‰РµСЃС‚РІР°" },
  { id: "process", href: "#process", label: "РџСЂРѕС†РµСЃСЃ" },
  { id: "reviews", href: "#reviews", label: "РћС‚Р·С‹РІС‹" },
  { id: "products", href: "#products", label: "РџСЂРѕРґСѓРєС†РёСЏ" },
  { id: "contacts", href: "#contacts", label: "РљРѕРЅС‚Р°РєС‚С‹" },
] as const;

const HEADER_HEIGHT = 72;

function scrollToId(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const node = document.getElementById(id);
  if (!node) return;
  const y = node.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function DesktopHeader() {
  const { direction, atTop } = useScrollDirection();
  const activeSection = useActiveSection(MENU_ITEMS.map((item) => item.id));
  const hidden = direction === "down" && !atTop;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1200] hidden h-[72px] border-b transition-transform duration-300 ease-out lg:block ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${atTop ? "border-white/5 bg-zinc-950/55" : "border-white/10 bg-zinc-950/80 backdrop-blur-md"}`}
    >
      <div className="container-shell flex h-full items-center justify-between gap-8">
        <button
          type="button"
          aria-label="РќР° РіР»Р°РІРЅСѓСЋ"
          onClick={() => scrollToId("top")}
          className="logo-animate flex shrink-0 items-center"
        >
          <Image src="/images/plate-logo.svg" alt="VIPAuto161" width={130} height={34} className="h-8 w-auto" priority />
        </button>

        <nav aria-label="РћСЃРЅРѕРІРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ" className="flex items-center gap-6">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId(item.id);
                }}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => scrollToId("contacts")}
          className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-white/90"
        >
          РћСЃС‚Р°РІРёС‚СЊ Р·Р°СЏРІРєСѓ
        </button>
      </div>
    </header>
  );
}
\n`\n
