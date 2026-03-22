'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { Repeat2, Sparkles, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StatItem } from '@/data/site-content'
import { SpaIcon } from '@/components/ui/spa-icon'
import { useGsap } from '@/hooks/use-gsap'

interface TrustSectionProps {
  stats: StatItem[]
}

interface CounterConfig {
  decimals: number
  suffix: string
  target: number
}

const iconMap: Record<string, LucideIcon> = {
  sessions: Sparkles,
  rating: Star,
  returns: Repeat2,
}

function getCounterConfig(item: StatItem): CounterConfig {
  if (item.id === 'sessions') return { target: 500, suffix: '+', decimals: 0 }
  if (item.id === 'rating') return { target: 4.9, suffix: '/5', decimals: 1 }
  if (item.id === 'returns') return { target: 43, suffix: '%', decimals: 0 }

  const cleaned = item.value.replace(',', '.')
  const parsed = Number.parseFloat(cleaned)
  if (Number.isNaN(parsed)) return { target: 0, suffix: '', decimals: 0 }

  const suffix = cleaned.replace(/[\d.,]/g, '').trim()
  const decimals = cleaned.includes('.') || cleaned.includes(',') ? 1 : 0
  return { target: parsed, suffix, decimals }
}

function formatValue(value: number, decimals: number): string {
  if (decimals === 0) return Math.round(value).toString()
  return value.toFixed(decimals)
}

export function TrustSection({ stats }: TrustSectionProps) {
  const rootRef = useRef<HTMLElement>(null)
  const valueRefs = useRef<Record<string, HTMLSpanElement | null>>({})

  useGsap(
    () => {
      const q = gsap.utils.selector(rootRef)
      const cards = q('[data-trust-card]')

      gsap.set(cards, { y: 30, opacity: 0, filter: 'blur(8px)' })

      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 82%',
          once: true,
        },
      })

      revealTimeline.to(cards, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.92,
        stagger: 0.1,
        ease: 'power3.out',
      })

      revealTimeline.add(() => {
        stats.forEach((item, index) => {
          const targetNode = valueRefs.current[item.id]
          if (!targetNode) return

          const { target, suffix, decimals } = getCounterConfig(item)
          const state = { value: 0 }

          gsap.to(state, {
            value: target,
            duration: 3.4,
            delay: 0.55 + index * 0.2,
            ease: 'power2.out',
            onUpdate: () => {
              targetNode.textContent = `${formatValue(state.value, decimals)}${suffix}`
            },
          })
        })
      }, 0)
    },
    { scope: rootRef, dependencies: [stats] }
  )

  return (
    <section id='trust' ref={rootRef} className='section-magnetic py-12 sm:py-14'>
      <div className='section-container'>
        <div className='mb-7 sm:mb-9'>
          <p className='text-[10px] uppercase tracking-[0.18em] text-[#a1a1aa]'>Доверие в деталях</p>
          <h2
            className='mt-2 text-3xl leading-[1.08] font-light text-[#f5f0e8] sm:text-4xl'
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif',
              letterSpacing: '0.05em',
            }}
          >
            Цифры, которые говорят за нас
          </h2>
        </div>

        <div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-14 lg:gap-20'>
          {stats.map((item) => (
            <article
              key={item.id}
              data-trust-card
              className='group flex flex-1 flex-col items-start gap-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05]'
            >
              <SpaIcon
                icon={iconMap[item.id] ?? Sparkles}
                size='md'
                tone='primary'
                className='!h-5 !w-5 !text-[#d4b483] transition-colors duration-300 group-hover:!text-[#e8d5b7]'
                aria-hidden
              />

              <p
                className='text-[2.3rem] leading-[1.1] font-light text-[#f5f0e8] sm:text-[2.7rem] lg:text-[3.1rem]'
                style={{
                  fontFamily: 'var(--font-manrope), "Inter", sans-serif',
                  letterSpacing: '0.01em',
                }}
              >
                <span
                  ref={(node) => {
                    valueRefs.current[item.id] = node
                  }}
                >
                  0
                </span>
              </p>

              <p
                className='text-[11px] leading-[1.5] text-[#a1a1aa] sm:text-[12px]'
                style={{
                  fontFamily: 'var(--font-manrope), "Inter", sans-serif',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
