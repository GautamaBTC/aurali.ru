'use client'

import { ChevronDown } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { FaqItem } from '@/data/site-content'

interface FaqSectionProps {
  items: FaqItem[]
}

export function FaqSection({ items }: FaqSectionProps) {
  const initialOpenId = items[0]?.id ?? ''
  const [openId, setOpenId] = useState<string>(initialOpenId)
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useLayoutEffect(() => {
    items.forEach((item) => {
      const element = contentRefs.current[item.id]
      if (!element) return

      if (item.id === initialOpenId) {
        gsap.set(element, { height: 'auto', opacity: 1 })
      } else {
        gsap.set(element, { height: 0, opacity: 0 })
      }
    })
  }, [initialOpenId, items])

  const animateOpen = (element: HTMLDivElement): void => {
    gsap.killTweensOf(element)
    const fromHeight = element.getBoundingClientRect().height
    const toHeight = element.scrollHeight

    gsap.fromTo(
      element,
      { height: fromHeight, opacity: 0 },
      {
        height: toHeight,
        opacity: 1,
        duration: 0.56,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(element, { height: 'auto' })
        },
      }
    )
  }

  const animateClose = (element: HTMLDivElement): void => {
    gsap.killTweensOf(element)
    gsap.set(element, { height: element.scrollHeight })

    gsap.to(element, {
      height: 0,
      opacity: 0,
      duration: 0.52,
      ease: 'power3.inOut',
    })
  }

  const handleToggle = (id: string): void => {
    const isActive = openId === id
    const nextId = isActive ? '' : id

    items.forEach((item) => {
      const element = contentRefs.current[item.id]
      if (!element) return

      if (item.id === nextId) {
        animateOpen(element)
      } else {
        animateClose(element)
      }
    })

    window.requestAnimationFrame(() => {
      setOpenId(nextId)
    })
  }

  return (
    <section id='faq' className='section-magnetic py-12 sm:py-14'>
      <div className='section-container section-glass-panel max-w-5xl p-6 sm:p-8'>
        <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>Частые вопросы</p>
        <h2 className='mt-2 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
          Перед первым визитом
        </h2>

        <div className='mt-8 space-y-3'>
          {items.map((item) => {
            const isOpen = openId === item.id

            return (
              <article key={item.id} className='glass-card'>
                <button
                  type='button'
                  onClick={() => handleToggle(item.id)}
                  className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left'
                >
                  <span className='text-base font-medium text-[#f5f0e8]'>{item.question}</span>
                  <ChevronDown
                    className={isOpen ? 'rotate-180 text-[#d4af37] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]' : 'text-[#d9cfc4] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'}
                    size={18}
                  />
                </button>
                <div
                  ref={(node) => {
                    contentRefs.current[item.id] = node
                  }}
                  style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  className='overflow-hidden'
                >
                  <p className='px-5 pb-5 text-sm leading-[1.6] text-[#d9cfc4]'>{item.answer}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

