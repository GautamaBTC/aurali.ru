interface TouristSectionProps {
  title: string
  text: string
}

export function TouristSection({ title, text }: TouristSectionProps) {
  return (
    <section id='tourist' className='section-magnetic py-12'>
      <div className='section-container section-glass-panel px-6 py-8 sm:px-8'>
        <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>Для гостей города</p>
        <h2 className='mt-3 font-[var(--font-cormorant)] text-2xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-3xl'>
          {title}
        </h2>
        <p className='mt-4 max-w-3xl text-sm leading-[1.62] text-[#e8e3dc] sm:text-base'>{text}</p>
      </div>
    </section>
  )
}

