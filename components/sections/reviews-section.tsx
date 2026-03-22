'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { PencilLine, Star } from 'lucide-react'
import { SpaIcon } from '@/components/ui/spa-icon'
import { InlineBrandMark } from '@/components/ui/inline-brand-mark'
import { useGsap } from '@/hooks/use-gsap'

interface ReviewItem {
  id: string
  author: string
  source: string
  rating: number
  text: string
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'review-1',
    author: 'Марина',
    source: 'Яндекс Карты',
    rating: 5,
    text: 'Очень деликатный подход и ощущение полного переключения уже в первые минуты сеанса.',
  },
  {
    id: 'review-2',
    author: 'Екатерина',
    source: '2ГИС',
    rating: 5,
    text: 'После массажа ушло напряжение в шее и спине. Пространство спокойное, без суеты.',
  },
  {
    id: 'review-3',
    author: 'Ольга',
    source: 'WhatsApp',
    rating: 5,
    text: 'Понравился индивидуальный разбор запроса и мягкая техника. Вернусь на курс.',
  },
]

export function ReviewsSection() {
  const rootRef = useRef<HTMLElement>(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(rootRef)
      gsap.fromTo(
        q('[data-review-reveal]'),
        { y: 22, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.08,
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
    <section id='reviews' ref={rootRef} className='section-magnetic py-12 sm:py-14'>
      <div className='section-container section-glass-panel p-6 sm:p-8'>
        <div data-review-reveal className='flex items-end justify-between gap-4'>
          <div>
            <p className='text-[10px] uppercase tracking-[0.18em] text-[#d9cfc4]'>Отзывы</p>
            <h2 className='mt-2 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
              <span className='block'>Что говорят гости</span>
              <span className='mt-1 block'>
                <InlineBrandMark className='text-[0.82em] tracking-[0.09em]' />
              </span>
            </h2>
          </div>
          <a
            href='https://yandex.ru/maps/'
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 text-sm font-medium text-[#d4af37] transition-colors duration-300 hover:text-[#e8d5b7]'
          >
            <SpaIcon icon={PencilLine} size='sm' tone='primary' aria-hidden />
            Оставить отзыв
          </a>
        </div>

        <div className='mt-7 grid gap-4 md:grid-cols-3'>
          {REVIEWS.map((review) => (
            <article key={review.id} data-review-reveal className='glass-card p-5'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: Math.max(0, Math.min(5, review.rating)) }).map((_, index) => (
                  <SpaIcon key={`star-${review.id}-${index}`} icon={Star} size='sm' tone='primary' aria-hidden />
                ))}
              </div>
              <p className='mt-3 text-sm leading-[1.6] text-[#e8e3dc]'>{review.text}</p>
              <p className='mt-4 text-sm font-medium text-[#f5f0e8]'>{review.author}</p>
              <p className='text-xs uppercase tracking-[0.14em] text-[#d9cfc4]'>{review.source}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}



