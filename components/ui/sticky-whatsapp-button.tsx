'use client'

import { MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGsap } from '@/hooks/use-gsap'

interface StickyWhatsappButtonProps {
  href: string
}

export function StickyWhatsappButton({ href }: StickyWhatsappButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useGsap(
    () => {
      if (!buttonRef.current) return

      gsap.to(buttonRef.current, {
        scale: 1.04,
        duration: 1.25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    },
    { scope: buttonRef }
  )

  return (
    <a
      ref={buttonRef}
      href={href}
      aria-label='Написать в WhatsApp'
      className='fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/55 bg-[linear-gradient(135deg,rgba(22,21,19,0.92)_0%,rgba(15,14,12,0.88)_55%,rgba(12,11,9,0.94)_100%)] text-[#f5f0e8] shadow-[inset_0_1px_0_rgba(245,240,232,0.16),0_0_24px_rgba(212,175,55,0.22),0_14px_34px_rgba(0,0,0,0.55)] transition-all duration-300 hover:scale-[1.04] hover:border-[#d4af37]/75 hover:shadow-[inset_0_1px_0_rgba(245,240,232,0.2),0_0_30px_rgba(212,175,55,0.3),0_16px_40px_rgba(0,0,0,0.62)] md:h-12 md:w-12'
    >
      <MessageCircle size={22} className='text-[#d4af37]' />
    </a>
  )
}
