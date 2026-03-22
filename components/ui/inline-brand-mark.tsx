interface InlineBrandMarkProps {
  className?: string
}

export function InlineBrandMark({ className = '' }: InlineBrandMarkProps) {
  return (
    <span
      className={`inline-flex items-baseline font-[var(--font-manrope)] font-light tracking-[0.12em] uppercase ${className}`.trim()}
      aria-label='ЛИаура'
    >
      <span className='brand-li-gradient brand-li-glow font-[var(--font-cormorant)] font-semibold'>ЛИ</span>
      <span className='ml-[0.03em] text-[#f5f0e8]'>аура</span>
    </span>
  )
}
