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
    default: "VIPAuto вЂ” РђРІС‚РѕСЌР»РµРєС‚СЂРёРєР° Рё Р°РІС‚РѕСЌР»РµРєС‚СЂРѕРЅРёРєР° РІ РЁР°С…С‚Р°С… | РћС„РёС†РёР°Р»СЊРЅС‹Р№ РґРёР»РµСЂ StarLine",
    template: "%s | VIPРђРІС‚Рѕ",
  },
  description:
    "РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅР°СЏ Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєР° РІ Рі. РЁР°С…С‚С‹. РЈСЃС‚Р°РЅРѕРІРєР° СЃРёРіРЅР°Р»РёР·Р°С†РёР№ StarLine, LED/Bi-LED РѕРїС‚РёРєР°, Р°РІС‚РѕР·РІСѓРє, РєР°РјРµСЂС‹, РєРѕРґРёСЂРѕРІР°РЅРёРµ. Р РµР№С‚РёРЅРі 4.6 РЅР° РЇРЅРґРµРєСЃ.РљР°СЂС‚Р°С….",
  alternates: {
    canonical: "/",
  },
  category: "autos",
  keywords: [
    "Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєР° С€Р°С…С‚С‹",
    "Р°РІС‚РѕСЌР»РµРєС‚СЂРёРє С€Р°С…С‚С‹",
    "Р°РІС‚РѕСЌР»РµРєС‚СЂРѕРЅРёРєР°",
    "СѓСЃС‚Р°РЅРѕРІРєР° starline",
    "СЃРёРіРЅР°Р»РёР·Р°С†РёСЏ starline С€Р°С…С‚С‹",
    "СѓСЃС‚Р°РЅРѕРІРєР° led Р»РёРЅР·",
    "Р°РІС‚РѕР·РІСѓРє",
    "РґРёР°РіРЅРѕСЃС‚РёРєР° Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєРё",
    "vipauto161",
  ],
  openGraph: {
    title: "VIPРђРІС‚Рѕ",
    description: "РџСЂРµРјРёР°Р»СЊРЅР°СЏ Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєР° Рё Р°РІС‚РѕСЌР»РµРєС‚СЂРѕРЅРёРєР° РІ Рі. РЁР°С…С‚С‹.",
    type: "website",
    locale: "ru_RU",
    url: siteConfig.siteUrl,
    siteName: "VIPРђРІС‚Рѕ",
    images: [
      {
        url: "/images/plate-logo.svg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIPРђРІС‚Рѕ",
    description: "РџСЂРµРјРёР°Р»СЊРЅР°СЏ Р°РІС‚РѕСЌР»РµРєС‚СЂРёРєР° Рё Р°РІС‚РѕСЌР»РµРєС‚СЂРѕРЅРёРєР° РІ Рі. РЁР°С…С‚С‹.",
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
  priceRange: "в‚Ѕв‚Ѕ",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
    addressLocality: siteConfig.city,
    addressRegion: siteConfig.region,
    addressCountry: "RU",
  },
  telephone: siteConfig.phones[0],
  areaServed: "Р РѕСЃС‚РѕРІСЃРєР°СЏ РѕР±Р»Р°СЃС‚СЊ",
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

