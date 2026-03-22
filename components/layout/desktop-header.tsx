'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { BrandLogo } from '@/components/layout/brand-logo'
import { useActiveSection } from '@/hooks/use-active-section'
import { MENU_ITEMS, scrollToSection } from '@/lib/navigation'

export function DesktopHeader() {
  const activeSection = useActiveSection(MENU_ITEMS.map((item) => item.id))

  const headerRef = useRef<HTMLElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const [isLogoReady, setIsLogoReady] = useState<boolean>(false)

  useEffect(() => {
    const onLogoStart = () => setIsLogoReady(true)
    const fallbackTimer = window.setTimeout(onLogoStart, 1400)
    window.addEventListener('ui:intro-logo', onLogoStart as EventListener)
    if (document.documentElement.dataset.introLogo === 'true') {
      window.requestAnimationFrame(onLogoStart)
    }
    return () => {
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('ui:intro-logo', onLogoStart as EventListener)
    }
  }, [])

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const ctx = gsap.context(() => {
      gsap.set(header, {
        height: 72,
        backgroundColor: 'rgba(20,18,16,0.62)',
        backdropFilter: 'blur(10px) saturate(110%)',
        WebkitBackdropFilter: 'blur(10px) saturate(110%)',
      })

      gsap.fromTo(header, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.84, ease: 'power3.out' })

      let rafId = 0
      const onScroll = () => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          const progress = Math.min(window.scrollY / 180, 1)
          const blur = 10 + progress * 2
          const saturate = 110 + progress * 2

          gsap.to(header, {
            backgroundColor: 'rgba(20,18,16,0.62)',
            backdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
          })
        })
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()

      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('scroll', onScroll)
      }
    }, header)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        data-site-header='desktop'
        className='fixed inset-x-0 top-0 z-[1200] hidden translate-y-0 transition-transform duration-300 ease-out lg:block bg-transparent'
        style={{ boxShadow: 'none' }}
      >
        <div ref={shellRef} className='container-shell flex h-full items-center justify-between gap-8'>
        {isLogoReady ? (
          <button
            type='button'
            aria-label='ЛИаура, перейти к началу страницы'
            onClick={() => scrollToSection('top')}
            className='header-logo group flex shrink-0 items-center'
            style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.62))' }}
          >
            <BrandLogo isReady={isLogoReady} size='desktop' />
          </button>
        ) : (
          <div className='h-9 w-[196px] shrink-0' aria-hidden />
        )}

        <nav aria-label='Основная навигация' className='flex items-center gap-6'>
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection(item.id)
                }}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#f5f0e8]' : 'text-[#c7b8a8] hover:text-[#e8d7db]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d4b483] to-[#d4c8d4] transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <button
          type='button'
          onClick={() => scrollToSection('contacts')}
          className='lux-cta-primary px-5 py-2 text-sm font-semibold'
        >
          Записаться
        </button>
        </div>
      </header>
      <div
        aria-hidden
        className='pointer-events-none fixed inset-x-0 top-[71px] z-[1199] hidden h-5 bg-gradient-to-b from-[rgba(26,26,26,0.52)] via-[rgba(26,26,26,0.18)] to-transparent lg:block'
        style={{
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
      />
    </>
  )
}

