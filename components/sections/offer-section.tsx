interface OfferSectionProps {
  text: string
  whatsappUrl: string
}

export function OfferSection({ text, whatsappUrl }: OfferSectionProps) {
  return (
    <section id='offer' className='section-magnetic py-10 sm:py-12'>
      <div className='section-container'>
        <div className='section-glass-panel p-6 sm:p-8'>
          <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>Специальное предложение</p>
          <h2 className='mt-3 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8]'>
            {text}
          </h2>
          <p className='mt-3 max-w-2xl text-sm leading-[1.6] text-[#e8e3dc]'>
            Забронируйте первый ритуал через WhatsApp и получите персональную скидку. Подскажем оптимальный формат
            процедуры под ваше состояние.
          </p>
          <a
            href={whatsappUrl}
            className='lux-cta-whatsapp mt-5 inline-flex min-h-12 items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-[0.1em]'
          >
            Записаться со скидкой
          </a>
        </div>
      </div>
    </section>
  )
}

