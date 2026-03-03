import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { MobileMenu } from "@/components/menu";
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
    default: "VIPAuto — Автоэлектрика и автоэлектроника в Шахтах | Официальный дилер StarLine",
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
