'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, CalendarDays, ShieldCheck } from 'lucide-react'
import { SpaIcon } from '@/components/ui/spa-icon'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  offer: string
  whatsappUrl: string
}

gsap.registerPlugin(ScrollTrigger)

export function HeroSection({ title, subtitle, description, offer, whatsappUrl }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const accentRef = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    const root = sectionRef.current
    const content = contentRef.current
    if (!root || !content) return

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      introTl
        .from('[data-hero-intro="badge"]', { opacity: 0, y: 12, filter: 'blur(8px)', duration: 0.9 })
        .from(
          '[data-hero-intro="title-main"]',
          { opacity: 0, y: 20, filter: 'blur(10px)', duration: 1 },
          '-=0.58',
        )
        .from(
          '[data-hero-intro="title-accent"]',
          { opacity: 0, y: 16, filter: 'blur(10px)', duration: 1 },
          '-=0.74',
        )
        .from('[data-hero-intro="text"]', { opacity: 0, y: 14, filter: 'blur(8px)', duration: 0.9 }, '-=0.64')
        .from('[data-hero-intro="actions"]', { opacity: 0, y: 12, duration: 0.82 }, '-=0.56')
        .from('[data-hero-intro="meta"]', { opacity: 0, y: 10, duration: 0.7 }, '-=0.48')

      if (accentRef.current) {
        gsap.to(accentRef.current, {
          opacity: 0.92,
          duration: 2.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      gsap.fromTo(
        content,
        { y: 0, opacity: 1, filter: 'blur(0px)' },
        {
          y: -72,
          opacity: 0,
          filter: 'blur(3px)',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top+=1 top',
            end: 'bottom top',
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  const headingMain = title || 'Восстановление, которое возвращает вас к себе'
  const headingAccent = 'Ритуалы, после которых вы другой человек'
  const heroDescription =
    description ||
    'Индивидуальные ритуалы массажа и СПА без конвейера: один мастер, один гость и точно выстроенное время для отдыха и возвращения к себе.'

  const badgeText = subtitle || 'ЛИаура · персональные СПА-ритуалы в Шахтах'
  const offerText = offer || 'Первый визит — 15%'

  return (
    <section
      ref={sectionRef}
      id='top'
      className='hero-clean relative -mt-[72px] h-[100svh] min-h-[560px] overflow-hidden bg-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-[calc(72px+env(safe-area-inset-top)+8px)] text-[#f5f0e8] sm:px-6 sm:pb-[calc(env(safe-area-inset-bottom)+12px)] sm:pt-[calc(72px+env(safe-area-inset-top)+10px)] lg:h-[100dvh] lg:min-h-[620px] lg:px-10 lg:pt-[calc(72px+env(safe-area-inset-top)+16px)]'
    >
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(18,18,18,0)_0%,rgba(18,18,18,0.24)_22%,rgba(18,18,18,0.68)_100%)]' />
      <div className='pointer-events-none absolute inset-0 z-[2] opacity-35 bg-[radial-gradient(circle_at_20%_22%,rgba(232,215,219,0.16)_0%,rgba(18,18,18,0)_40%)]' />
      <div className='pointer-events-none absolute inset-0 z-[2] opacity-30 bg-[radial-gradient(circle_at_82%_72%,rgba(212,180,131,0.2)_0%,rgba(18,18,18,0)_42%)]' />
      <div className='pointer-events-none absolute inset-0 z-[2] opacity-55 bg-[radial-gradient(circle_at_50%_42%,rgba(16,16,16,0.58)_0%,rgba(16,16,16,0.18)_36%,rgba(16,16,16,0)_72%)]' />

      <div ref={contentRef} className='relative z-10 mx-auto flex h-full w-full max-w-5xl items-center'>
        <div className='w-full max-w-[48rem]'>
          <div
            data-hero-intro='badge'
            className='inline-flex items-center gap-2 rounded-full border border-[#e7ddd3]/20 bg-[#141414]/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#d9cfc4] backdrop-blur-sm sm:text-[10px]'
            style={{ fontFamily: 'var(--font-manrope), "Inter", sans-serif', fontWeight: 400 }}
          >
            <SpaIcon icon={ShieldCheck} size='sm' tone='primary' aria-hidden />
            {badgeText}
          </div>

          <h1 className='mt-3.5 max-w-[22ch] sm:mt-4.5'>
            <span
              data-hero-intro='title-main'
              className='block !bg-none text-[1.74rem] leading-[1.32] !text-[#f5f0e8] ![-webkit-text-fill-color:#f5f0e8] sm:text-[2.25rem] sm:leading-[1.34] md:text-[3rem] md:leading-[1.36] lg:text-[3.5rem] lg:leading-[1.38]'
              style={{
                fontFamily: 'var(--font-manrope), "Inter", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                WebkitTextFillColor: '#f5f0e8',
              }}
            >
              {headingMain}
            </span>
            <span
              ref={accentRef}
              data-hero-intro='title-accent'
              className='mt-2.5 block text-[1.2rem] leading-[1.22] text-[#d4b483] sm:text-[1.54rem] md:text-[1.95rem] lg:text-[2.22rem]'
              style={{
                fontFamily: 'var(--font-manrope), "Inter", sans-serif',
                fontStyle: 'normal',
                fontWeight: 300,
                letterSpacing: '0.005em',
              }}
            >
              {headingAccent}
            </span>
          </h1>

          <p
            data-hero-intro='text'
            className='mt-4 max-w-[44rem] text-[12.5px] leading-[1.6] text-[#e7ddd3]/90 sm:mt-4.5 sm:text-[14px] md:text-[15px] lg:text-[16px]'
            style={{ fontFamily: 'var(--font-manrope), "Inter", sans-serif', fontWeight: 300, letterSpacing: '0.002em' }}
          >
            {heroDescription}
          </p>

          <div data-hero-intro='actions' className='mt-6 flex flex-col items-start gap-3 sm:mt-6.5 sm:flex-row sm:items-center'>
            <a
              href={whatsappUrl}
              className='lux-cta-whatsapp group inline-flex min-h-[50px] items-center gap-2 px-5 text-[10px] uppercase tracking-[0.18em]'
              style={{ fontFamily: 'var(--font-manrope), "Inter", sans-serif', fontWeight: 500 }}
            >
              <span className='relative z-10 inline-flex items-center gap-2'>
                <SpaIcon icon={CalendarDays} size='sm' className='text-[#1a140f]' aria-hidden />
                Записаться в Ватсап
              </span>
            </a>

            <a
              href='#services'
              className='lux-cta-secondary inline-flex min-h-[50px] items-center gap-2 px-5 text-[10px] uppercase tracking-[0.18em] backdrop-blur-sm'
              style={{ fontFamily: 'var(--font-manrope), "Inter", sans-serif', fontWeight: 400 }}
            >
              <SpaIcon icon={ArrowDown} size='sm' tone='light' aria-hidden />
              Посмотреть услуги
            </a>
          </div>

          <div className='mt-10 sm:mt-12'>
            <span
              data-hero-intro='meta'
              className='inline-flex max-w-full rounded-full border border-[#d4b483]/24 bg-[rgba(255,255,255,0.05)] px-3.5 py-1.5 text-[8px] uppercase tracking-[0.2em] leading-[1.35] text-[#f0e5d6] sm:whitespace-nowrap sm:text-[9px]'
              style={{ fontFamily: 'var(--font-manrope), "Inter", sans-serif', fontWeight: 500 }}
            >
              {offerText} · Один мастер • один гость • персональный ритуал
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}


