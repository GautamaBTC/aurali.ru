import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { BootGate } from '@/components/layout/boot-gate'
import { DesktopHeader } from '@/components/layout/desktop-header'
import { MobileMenuWrapper } from '@/components/layout/mobile-menu-wrapper'
import { ScrollVideoBackground } from '@/components/layout/scroll-video-background'
import { siteContent } from '@/data/site-content'
import { createDaySpaJsonLd, createMetadata } from '@/lib/seo'
import './globals.css'

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500'],
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-jetbrains-mono',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = createMetadata(siteContent)

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetBrainsMono.variable} ${cormorantGaramond.variable} antialiased text-[var(--text-primary)] bg-[var(--bg-primary)]`}
      >
        <ScrollVideoBackground />
        <BootGate>
          <DesktopHeader />
          <MobileMenuWrapper />
          <div className='boot-ui relative z-10 pt-[calc(72px+env(safe-area-inset-top))] lg:pt-[72px]'>{children}</div>
        </BootGate>

        <Script id='motion-policy' strategy='beforeInteractive'>
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
        <Script id='aurali-day-spa-jsonld' type='application/ld+json'>
          {createDaySpaJsonLd(siteContent)}
        </Script>
      </body>
    </html>
  )
}
