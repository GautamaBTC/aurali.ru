import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Manrope } from "next/font/google";
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
        <MobileMenuWrapper />
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

