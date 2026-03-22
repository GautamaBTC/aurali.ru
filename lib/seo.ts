import type { Metadata } from 'next'
import type { SiteContent } from '@/data/site-content'

export function createMetadata(content: SiteContent): Metadata {
  return {
    metadataBase: new URL(`https://${content.domain}`),
    title: {
      default: `${content.brand} — массаж и SPA в ${content.contact.city}`,
      template: `%s | ${content.brand}`,
    },
    description: `${content.heroSubtitle}. ${content.heroDescription}`,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${content.brand} — ${content.heroSubtitle}`,
      description: content.heroDescription,
      type: 'website',
      locale: 'ru_RU',
      url: `https://${content.domain}`,
      siteName: content.brand,
    },
  }
}

export function createDaySpaJsonLd(content: SiteContent): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'DaySpa',
    name: content.brand,
    description: content.heroSubtitle,
    address: {
      '@type': 'PostalAddress',
      streetAddress: content.contact.address,
      addressLocality: content.contact.city,
      addressRegion: content.contact.region,
      addressCountry: 'RU',
    },
    telephone: content.contact.phoneDigits,
    email: content.contact.email,
    openingHours: 'Mo-Su 10:00-21:00',
    priceRange: '₽₽',
    url: `https://${content.domain}`,
  })
}
