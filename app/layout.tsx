import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { BootGate } from "@/components/layout/BootGate";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileMenuWrapper } from "@/components/layout/MobileMenuWrapper";
import { SiteScrollBackdrop } from "@/components/layout/SiteScrollBackdrop";
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
    default: "ВИПАВТО — Автоэлектрика и автоэлектроника в Шахтах | Официальный дилер StarLine",
    template: "%s | ВИПАВТО",
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
    title: "ВИПАВТО",
    description: "Премиальная автоэлектрика и автоэлектроника в г. Шахты.",
    type: "website",
    locale: "ru_RU",
    url: siteConfig.siteUrl,
    siteName: "ВИПАВТО",
    images: [
      {
        url: "/images/plate-logo.svg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ВИПАВТО",
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
  maximumScale: 1,
  userScalable: false,
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
        className={`${manrope.variable} ${jetBrainsMono.variable} antialiased text-[var(--text-primary)]`}
      >
        <BootGate>
          <SiteScrollBackdrop />
          <DesktopHeader />
          <MobileMenuWrapper />
          <div className="boot-ui relative z-10 pt-[calc(72px+env(safe-area-inset-top))] lg:pt-[72px]">
            {children}
          </div>
        </BootGate>
        <Script id="motion-policy" strategy="beforeInteractive">
          {`
            (function () {
              var root = document.documentElement;
              var params = new URLSearchParams(window.location.search);
              var raw = (params.get('debug-motion') || '').trim().toLowerCase();
              var forceMotion = raw === '1' || raw === 'true' || raw === 'on';
              var forceReduced = raw === '0' || raw === 'false' || raw === 'off';
              var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              var mobileViewport = window.matchMedia('(max-width: 1024px)').matches;
              if (reduced && mobileViewport) reduced = false;
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

