'use client'

import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Clock3, Filter, Gift, Leaf, Sparkles, Waves, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ServiceCategory, ServiceItem } from '@/data/site-content'
import { SpaIcon } from '@/components/ui/spa-icon'
import { InlineBrandMark } from '@/components/ui/inline-brand-mark'
import { cn } from '@/lib/utils'
import { useGsap } from '@/hooks/use-gsap'

interface ServicesSectionProps {
  categories: ServiceCategory[]
  services: ServiceItem[]
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}

export function ServicesSection({ categories, services }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory['id']>('barrel')
  const [renderCategory, setRenderCategory] = useState<ServiceCategory['id']>('barrel')
  const rootRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement | null>(null)
  const isSwitchingRef = useRef(false)

  const categoryIconMap: Record<ServiceCategory['id'], LucideIcon> = {
    barrel: Wind,
    massage: Waves,
    face: Sparkles,
    wraps: Leaf,
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) => service.categoryId === renderCategory)
  }, [renderCategory, services])

  useGsap(
    () => {
      const q = gsap.utils.selector(cardsRef)
      gsap.fromTo(
        q('.service-card'),
        { y: 14, opacity: 0, filter: 'blur(7px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.62,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    },
    { scope: cardsRef, dependencies: [renderCategory] }
  )

  const handleCategoryChange = (nextCategory: ServiceCategory['id']) => {
    if (nextCategory === renderCategory || isSwitchingRef.current) return

    setActiveCategory(nextCategory)
    isSwitchingRef.current = true

    const cards = cardsRef.current?.querySelectorAll<HTMLElement>('.service-card')
    if (!cards || cards.length === 0) {
      setRenderCategory(nextCategory)
      window.setTimeout(() => {
        isSwitchingRef.current = false
      }, 520)
      return
    }

    gsap.to(cards, {
      opacity: 0,
      y: -8,
      filter: 'blur(6px)',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.inOut',
      onComplete: () => {
        setRenderCategory(nextCategory)
        window.setTimeout(() => {
          isSwitchingRef.current = false
        }, 720)
      },
    })
  }

  return (
    <section id='services' ref={rootRef} className='section-magnetic py-12 sm:py-14'>
      <div className='section-container section-glass-panel p-5 sm:p-7'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>
              Ритуалы <InlineBrandMark className='text-[0.86em] align-middle tracking-[0.09em]' />
            </p>
            <h2 className='mt-2 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
              Выберите свой ритм восстановления
            </h2>
          </div>
          <a href='#contacts' className='text-sm font-medium text-[#d4af37] transition-colors duration-300 hover:text-[#e8d5b7]'>
            Нужна консультация по выбору?
          </a>
        </div>

        <div className='mt-7 grid max-w-[38rem] grid-cols-2 gap-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              type='button'
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                'lux-cta-chip inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]',
                activeCategory === category.id
                  ? 'lux-cta-chip--active border-[#d4af37] text-[#f5f0e8]'
                  : 'border-[#f5f0e8]/20 text-[#d9cfc4] hover:border-[#d4af37]/55 hover:text-[#f5f0e8]'
              )}
            >
              <SpaIcon icon={categoryIconMap[category.id]} size='sm' tone='primary' aria-hidden />
              {category.title}
            </button>
          ))}
        </div>

        <div className='mt-4 inline-flex items-center gap-2 text-sm text-[#d9cfc4]'>
          <SpaIcon icon={Filter} size='md' tone='muted' aria-hidden />
          Фильтр по типу ритуала
        </div>

        <div ref={cardsRef} className='mt-6 grid gap-4 md:grid-cols-2'>
          {filteredServices.map((service) => (
            <article key={service.id} className='service-card glass-card p-5'>
              <div className='flex items-start justify-between gap-3'>
                <h3 className='font-[var(--font-cormorant)] text-2xl leading-[1.1] font-light tracking-[0.04em] text-[#f5f0e8]'>
                  {service.title}
                </h3>
                <div className='inline-flex min-w-[92px] flex-col items-center rounded-xl border border-[#f5f0e8]/18 bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-center'>
                  <span className='text-[9px] uppercase tracking-[0.14em] text-[#a1a1aa]'>Время</span>
                  <span className='mt-0.5 text-sm leading-none text-[#f0e5d6]'>{service.durationMin} мин</span>
                </div>
              </div>
              <p className='mt-3 text-sm leading-[1.6] text-[#e8e3dc]'>{service.shortText}</p>
              <p className='mt-2 text-sm leading-[1.6] text-[#d9cfc4]'>{service.effect}</p>
              <div className='mt-4 flex items-center justify-between gap-3'>
                <p className='font-[var(--font-cormorant)] text-2xl leading-[1.1] font-light text-[#f5f0e8]'>
                  {formatPrice(service.priceRub)} ₽
                </p>
                <a
                  href='#booking'
                  className='lux-cta-secondary inline-flex min-h-12 items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-[0.1em]'
                >
                  <SpaIcon icon={Clock3} size='sm' tone='primary' aria-hidden />
                  Забронировать
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className='mt-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/12 px-4 py-2 text-sm text-[#f5f0e8]'>
          <SpaIcon icon={Gift} size='md' tone='primary' aria-hidden />
          Абонемент на 4 сеанса — выгода до 20%
        </div>
      </div>
    </section>
  )
}


