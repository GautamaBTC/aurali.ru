import { CheckCircle2 } from 'lucide-react'
import { SpaIcon } from '@/components/ui/spa-icon'

interface MasterSectionProps {
  title: string
}

export function MasterSection({ title }: MasterSectionProps) {
  return (
    <section id='master' className='section-magnetic py-12 sm:py-14'>
      <div className='section-container section-glass-panel p-6 sm:p-8'>
        <div className='grid gap-8 lg:grid-cols-[1.1fr_.9fr]'>
          <div>
            <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>Обо мне</p>
            <h2 className='mt-3 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
              {title}
            </h2>
            <p className='mt-5 text-[15px] leading-[1.64] text-[#e8e3dc] sm:text-base'>
              Меня зовут Лилия. Я работаю с телом более пяти лет и чувствую каждого гостя как отдельную историю.
              В студии нет потока: один мастер, один гость и полное внимание к вашему состоянию.
            </p>
            <p className='mt-4 text-[15px] leading-[1.64] text-[#d9cfc4] sm:text-base'>
              Каждый ритуал я адаптирую в моменте: по дыханию, по мышечному напряжению, по отклику тела.
              Поэтому после сеанса вы получаете не шаблонную услугу, а персональный результат.
            </p>
          </div>

          <div className='glass-card p-6'>
            <p className='text-sm text-[#d9cfc4]'>Формат работы</p>
            <ul className='mt-4 space-y-3 text-sm leading-[1.6] text-[#e8e3dc]'>
              <li>Персональная консультация перед процедурой</li>
              <li>Индивидуальный выбор техники и интенсивности</li>
              <li>Комфортное пространство без потока гостей</li>
              <li>Рекомендации по восстановлению после сеанса</li>
            </ul>
            <a
              href='#booking'
              className='lux-cta-secondary mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] sm:w-auto'
            >
              <SpaIcon icon={CheckCircle2} size='sm' tone='primary' aria-hidden />
              Выбрать мастера
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

