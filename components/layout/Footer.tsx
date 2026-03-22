import Link from 'next/link'
import { InlineBrandMark } from '@/components/ui/inline-brand-mark'
import { MENU_ITEMS } from '@/lib/navigation'

interface FooterProps {
  domain: string
}

export function Footer({ domain }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className='section-magnetic border-t border-[var(--line)] bg-[#0c0b09]/90 backdrop-blur-md'>
      <div className='section-container py-8 text-[#f0ead6]'>
        <div className='flex flex-col gap-6'>
          <nav aria-label='Футер меню' className='flex flex-wrap gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-[#d9cfc4] sm:text-[12px]'>
            {MENU_ITEMS.filter((item) => item.id !== 'top').map((item) => (
              <Link key={`footer-menu-${item.id}`} href={item.href} className='transition-colors duration-300 hover:text-[#f5f0e8]'>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-[#c7b8a8] sm:text-[12px]'>
            <Link href='/privacy' className='transition-colors duration-300 hover:text-[#f5f0e8]'>
              Политика конфиденциальности
            </Link>
            <Link href='/terms' className='transition-colors duration-300 hover:text-[#f5f0e8]'>
              Правила использования
            </Link>
            <a href='#top' className='transition-colors duration-300 hover:text-[#f5f0e8]'>
              Наверх
            </a>
          </div>

          <div className='flex flex-col gap-1 text-[11px] text-[#b5aa9d] sm:flex-row sm:items-center sm:justify-between sm:text-[12px]'>
            <p className='inline-flex items-baseline gap-1'>
              <span>© {year}</span>
              <InlineBrandMark className='text-[0.82em] tracking-[0.09em]' />
              <span>Все права защищены.</span>
            </p>
            <a href={`https://${domain}`} className='text-[#d4b483] transition-colors duration-300 hover:text-[#e8d5b7]'>
              {domain}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
