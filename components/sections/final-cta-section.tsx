interface FinalCtaSectionProps {
  title: string
  text: string
  phoneDisplay: string
  phoneDigits: string
  whatsappUrl: string
}

export function FinalCtaSection({ title, text, phoneDisplay, phoneDigits, whatsappUrl }: FinalCtaSectionProps) {
  return (
    <section id='final-cta' className='section-magnetic py-12 sm:py-14'>
      <div className='section-container'>
        <div className='section-glass-panel p-8 text-center sm:p-10'>
          <h2 className='font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
            {title}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-sm leading-[1.62] text-[#d9cfc4] sm:text-base'>{text}</p>
          <div className='mt-7 flex flex-wrap items-center justify-center gap-3'>
            <a
              href={whatsappUrl}
              className='lux-cta-whatsapp inline-flex min-h-12 items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-[0.1em]'
            >
              Записаться в WhatsApp
            </a>
            <a
              href={`tel:${phoneDigits}`}
              className='lux-cta-secondary inline-flex min-h-12 items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-[0.1em]'
            >
              {phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

