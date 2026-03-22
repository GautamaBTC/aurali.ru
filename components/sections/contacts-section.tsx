import Image from 'next/image'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { SpaIcon } from '@/components/ui/spa-icon'
import { InlineBrandMark } from '@/components/ui/inline-brand-mark'
import type { ContactInfo } from '@/data/site-content'

interface ContactsSectionProps {
  contact: ContactInfo
}

interface SocialItem {
  name: string
  src: string
  href: string
  tint: string
}

export function ContactsSection({ contact }: ContactsSectionProps) {
  const socialItems: SocialItem[] = [
    {
      name: 'Вотсап',
      src: '/images/social/whatsapp-logo.png',
      href: contact.whatsappUrl,
      tint:
        'border-[rgba(157,196,63,0.16)] bg-[linear-gradient(135deg,rgba(157,196,63,0.12),rgba(157,196,63,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(157,196,63,0.08)] hover:border-[rgba(157,196,63,0.24)] hover:bg-[linear-gradient(135deg,rgba(157,196,63,0.16),rgba(157,196,63,0.06))]',
    },
    {
      name: 'Телеграм',
      src: '/images/social/telegram-logo.png',
      href: '#',
      tint:
        'border-[rgba(81,168,255,0.16)] bg-[linear-gradient(135deg,rgba(81,168,255,0.12),rgba(81,168,255,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(81,168,255,0.08)] hover:border-[rgba(81,168,255,0.24)] hover:bg-[linear-gradient(135deg,rgba(81,168,255,0.16),rgba(81,168,255,0.06))]',
    },
    {
      name: 'ВКонтакте',
      src: '/images/social/vk-logo.png',
      href: '#',
      tint:
        'border-[rgba(104,134,255,0.16)] bg-[linear-gradient(135deg,rgba(104,134,255,0.12),rgba(104,134,255,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(104,134,255,0.08)] hover:border-[rgba(104,134,255,0.24)] hover:bg-[linear-gradient(135deg,rgba(104,134,255,0.16),rgba(104,134,255,0.06))]',
    },
    {
      name: 'MAX',
      src: '/images/social/max-logo.png',
      href: '#',
      tint:
        'border-[rgba(255,255,255,0.14)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))]',
    },
    {
      name: 'Яндекс Карты',
      src: '/images/social/yandex-maps-logo.png',
      href: contact.mapsUrl,
      tint:
        'border-[rgba(255,203,72,0.18)] bg-[linear-gradient(135deg,rgba(255,203,72,0.15),rgba(255,203,72,0.05))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(255,203,72,0.08)] hover:border-[rgba(255,203,72,0.28)] hover:bg-[linear-gradient(135deg,rgba(255,203,72,0.2),rgba(255,203,72,0.07))]',
    },
    {
      name: '2ГИС',
      src: '/images/social/2gis-logo.png',
      href: '#',
      tint:
        'border-[rgba(77,209,117,0.16)] bg-[linear-gradient(135deg,rgba(77,209,117,0.12),rgba(77,209,117,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_rgba(77,209,117,0.08)] hover:border-[rgba(77,209,117,0.24)] hover:bg-[linear-gradient(135deg,rgba(77,209,117,0.16),rgba(77,209,117,0.06))]',
    },
  ]

  return (
    <section id='contacts' className='section-magnetic py-12 sm:py-14'>
      <div className='section-container'>
        <div className='grid gap-7 lg:grid-cols-2'>
          <article className='p-1'>
            <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>Контакты</p>
            <h2 className='mt-2 inline-flex items-baseline gap-2 font-[var(--font-cormorant)] text-3xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8] sm:text-4xl'>
              <span>Связаться с</span>
              <InlineBrandMark className='text-[0.82em] tracking-[0.09em]' />
            </h2>

            <ul className='mt-5 space-y-3 text-sm leading-[1.6] text-[#e8e3dc]'>
              <li className='inline-flex items-center gap-2'>
                <SpaIcon icon={MapPin} size='sm' tone='primary' aria-hidden />
                Город: {contact.city}
              </li>
              <li className='inline-flex items-center gap-2'>
                <SpaIcon icon={MapPin} size='sm' tone='primary' aria-hidden />
                Регион: {contact.region}
              </li>
              <li className='inline-flex items-center gap-2'>
                <SpaIcon icon={MapPin} size='sm' tone='primary' aria-hidden />
                Адрес: {contact.address}
              </li>
              <li className='inline-flex items-center gap-2'>
                <SpaIcon icon={Phone} size='sm' tone='primary' aria-hidden />
                Телефон:{' '}
                <a href={`tel:${contact.phoneDigits}`} className='underline underline-offset-4'>
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className='inline-flex items-center gap-2'>
                <SpaIcon icon={Mail} size='sm' tone='primary' aria-hidden />
                Email:{' '}
                <a href={`mailto:${contact.email}`} className='underline underline-offset-4'>
                  {contact.email}
                </a>
              </li>
              <li className='inline-flex items-center gap-2'>
                <SpaIcon icon={Clock3} size='sm' tone='primary' aria-hidden />
                Режим: {contact.openingHours}
              </li>
            </ul>

            <div className='mt-6 flex flex-wrap gap-3'>
              <a
                href={contact.whatsappUrl}
                className='lux-cta-whatsapp inline-flex min-h-12 items-center justify-center px-5 py-2 text-xs font-medium uppercase tracking-[0.1em]'
              >
                Написать в WhatsApp
              </a>
              <a
                href={contact.mapsUrl}
                className='lux-cta-secondary inline-flex min-h-12 items-center justify-center px-5 py-2 text-xs font-medium uppercase tracking-[0.1em]'
              >
                Построить маршрут
              </a>
            </div>
          </article>

          <article className='p-1'>
            <p className='text-xs uppercase tracking-[0.16em] text-[#d9cfc4]'>Где нас найти</p>
            <h3 className='mt-2 font-[var(--font-cormorant)] text-2xl leading-[1.08] font-light tracking-[0.05em] text-[#f5f0e8]'>
              Карты и соцсети
            </h3>
            <p className='mt-4 text-sm leading-[1.62] text-[#e8e3dc]'>
              Мы в Шахтах. После записи отправим точную точку и удобный маршрут, чтобы вы приехали спокойно и без спешки.
            </p>

            <a
              href={contact.mapsUrl}
              target='_blank'
              rel='noreferrer'
              aria-label='Открыть тёмную Яндекс карту и построить маршрут'
              className='mt-5 block overflow-hidden rounded-2xl border border-[#f5f0e8]/16 bg-[#0f0e0c]/46 shadow-[0_16px_34px_rgba(0,0,0,0.34)] transition-transform duration-500 hover:-translate-y-0.5'
            >
              <img
                src='https://static-maps.yandex.ru/v1?lang=ru_RU&ll=40.2368,47.7095&z=15&size=650,360&theme=dark&pt=40.2368,47.7095,pm2rdm'
                alt='Тёмная схема Яндекс карты: Шахты, пер. Новочеркасский, 44Б'
                loading='lazy'
                className='h-[290px] w-full object-cover sm:h-[320px]'
              />
            </a>

            <div className='mt-5 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent' />

            <div className='mt-5 flex flex-col gap-3'>
              {socialItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className={`inline-flex min-h-15 items-center justify-start gap-4 rounded-2xl border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 ${item.tint}`}
                >
                  <Image src={item.src} alt={item.name} width={132} height={48} className='h-9 w-auto object-contain sm:h-10' />
                  <span className='text-sm font-semibold tracking-[0.04em] text-[#f5f0e8]'>{item.name}</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

