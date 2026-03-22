'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface BrandLogoProps {
  isReady: boolean
  size?: 'desktop' | 'mobile'
  className?: string
}

const BRAND_LETTERS = ['\u041b', '\u0438', '\u0430', '\u0443', '\u0440', '\u0430'] as const
const BRAND_SUBTITLE = '\u0421\u0442\u0443\u0434\u0438\u044f \u043c\u0430\u0441\u0441\u0430\u0436\u043d\u043e\u0433\u043e \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432\u0430'

const SIZE_STYLES = {
  desktop: {
    shell: 'gap-[0.18rem]',
    title: 'text-[2.12rem] tracking-[0.14em]',
    subtitle: 'text-[0.58rem] tracking-[0.28em]',
  },
  mobile: {
    shell: 'gap-[0.14rem]',
    title: 'text-[1.68rem] tracking-[0.12em]',
    subtitle: 'text-[0.48rem] tracking-[0.24em]',
  },
} as const

export function BrandLogo({ isReady, size = 'desktop', className = '' }: BrandLogoProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null)
  const subtitleRef = useRef<HTMLSpanElement | null>(null)
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([])

  useLayoutEffect(() => {
    if (!isReady) return

    const root = rootRef.current
    const subtitle = subtitleRef.current
    const letters = lettersRef.current.filter(Boolean)
    const accentLetters = lettersRef.current.slice(0, 2).filter(Boolean)
    if (!root || !subtitle || !letters.length) return

    const ctx = gsap.context(() => {
      gsap.killTweensOf([root, subtitle, ...letters, ...accentLetters])

      gsap.set(root, { autoAlpha: 1 })
      gsap.set(letters, {
        opacity: 0,
        y: 1.5,
        filter: 'blur(7px)',
        textShadow: 'none',
      })
      gsap.set(subtitle, {
        opacity: 0,
        y: 2,
        filter: 'blur(7px)',
      })
      gsap.set(accentLetters, {
        textShadow: 'none',
      })

      const introTl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      introTl.to(
        letters,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.78,
          stagger: 0.12,
          ease: 'power3.out',
        },
        0,
      )
      introTl.to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.96,
          ease: 'power2.out',
        },
        '>-0.02',
      )
    }, root)

    return () => ctx.revert()
  }, [isReady])

  const styles = SIZE_STYLES[size]

  return (
    <span
      ref={rootRef}
      className={`inline-flex opacity-0 select-none flex-col items-start justify-center ${styles.shell} ${className}`.trim()}
      aria-label='\u041b\u0418\u0430\u0443\u0440\u0430 \u0421\u0442\u0443\u0434\u0438\u044f \u043c\u0430\u0441\u0441\u0430\u0436\u0430 \u0438 SPA'
    >
      <span
        className={`inline-flex items-baseline font-[var(--font-manrope)] uppercase leading-none font-light whitespace-nowrap text-[#f5f0e8] transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[1px] ${styles.title}`}
      >
        {BRAND_LETTERS.map((letter, index) => {
          const isAccent = index < 2

          return (
            <span
              key={`brand-letter-${index}-${letter}`}
              ref={(node) => {
                lettersRef.current[index] = node
              }}
              className={[
                'inline-block opacity-0 will-change-[opacity,filter,transform,text-shadow]',
                isAccent
                  ? 'brand-li-gradient brand-li-glow font-[var(--font-cormorant)] font-semibold'
                  : `font-[var(--font-manrope)] font-light align-baseline text-[0.59em] tracking-[0.1em] ${
                      index === 2 ? '-ml-[0.005em]' : 'ml-[0.055em]'
                    } text-[#f5f0e8]`,
              ].join(' ')}
            >
              {letter}
            </span>
          )
        })}
      </span>

      <span
        ref={subtitleRef}
        className={`opacity-0 font-[var(--font-manrope)] uppercase leading-none whitespace-nowrap text-[#a1a1aa] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 ${styles.subtitle}`}
      >
        {BRAND_SUBTITLE}
      </span>
    </span>
  )
}
