'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { CalendarDays, CheckCircle2, Clock3, LocateFixed, MessageCircleMore, SlidersHorizontal } from 'lucide-react'
import type { ContactInfo } from '@/data/site-content'
import { SpaIcon } from '@/components/ui/spa-icon'
import { useGsap } from '@/hooks/use-gsap'

interface BookingSectionProps {
  contact: ContactInfo
}

export function BookingSection({ contact }: BookingSectionProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(rootRef)
      gsap.fromTo(
        q('[data-booking-reveal]'),
        { y: 24, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.82,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      )
    },
    { scope: rootRef, dependencies: [] }
  )

  return (
    <section id='booking' ref={rootRef} className='section-magnetic py-12 sm:py-14'>
      <div className='section-container section-glass-panel p-6 sm:p-8'>
        <div className='grid gap-5 lg:grid-cols-2'>
          <article data-booking-reveal className='glass-card p-6'>
            <p className='text-[10px] uppercase tracking-[0.18em] text-[#d9cfc4]'>Бронирование</p>
            <h2 className='mt-2 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
              Запись за 1 минуту
            </h2>
            <p className='mt-4 text-sm leading-[1.6] text-[#e8e3dc] sm:text-[15px]'>
              Выберите удобный формат связи: моментальная запись в WhatsApp или звонок. Подберем услугу и комфортное
              время под ваш график.
            </p>

            <div className='mt-6 flex flex-wrap gap-3'>
              <a
                href={contact.whatsappUrl}
                className='lux-cta-whatsapp inline-flex min-h-12 items-center gap-2 px-5 py-2 text-xs font-medium uppercase tracking-[0.1em]'
              >
                <SpaIcon icon={CheckCircle2} size='sm' className='text-[#1a140f]' aria-hidden />
                Записаться в WhatsApp
              </a>
              <a
                href={`tel:${contact.phoneDigits}`}
                className='lux-cta-secondary inline-flex min-h-12 items-center gap-2 px-5 py-2 text-xs font-medium uppercase tracking-[0.1em]'
              >
                <SpaIcon icon={Clock3} size='sm' tone='primary' aria-hidden />
                Позвонить: {contact.phoneDisplay}
              </a>
            </div>
          </article>

          <article data-booking-reveal className='glass-card p-6'>
            <p className='text-[10px] uppercase tracking-[0.18em] text-[#d9cfc4]'>Как проходит запись</p>
            <ol className='mt-4 space-y-3 text-sm leading-[1.6] text-[#e8e3dc]'>
              <li className='inline-flex items-start gap-2.5'>
                <SpaIcon icon={MessageCircleMore} size='sm' tone='primary' aria-hidden />
                <span>1. Пишете в WhatsApp или звоните.</span>
              </li>
              <li className='inline-flex items-start gap-2.5'>
                <SpaIcon icon={SlidersHorizontal} size='sm' tone='primary' aria-hidden />
                <span>2. Уточняем запрос и подбираем формат.</span>
              </li>
              <li className='inline-flex items-start gap-2.5'>
                <SpaIcon icon={CalendarDays} size='sm' tone='primary' aria-hidden />
                <span>3. Фиксируем удобные дату и время.</span>
              </li>
              <li className='inline-flex items-start gap-2.5'>
                <SpaIcon icon={LocateFixed} size='sm' tone='primary' aria-hidden />
                <span>4. Отправляем подтверждение и точку на карте.</span>
              </li>
            </ol>
            <p className='mt-5 rounded-xl border border-[#f5f0e8]/14 bg-[#0f0e0c]/40 p-4 text-sm leading-[1.6] text-[#d9cfc4]'>
              Напоминание о визите отправляем заранее, чтобы вы приехали без спешки.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

