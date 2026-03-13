"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { siteConfig } from "@/lib/siteConfig";

const primaryPhone = siteConfig.phones[0];
const phoneHref = `tel:${primaryPhone.replace(/[^\d+]/g, "")}`;

const QUICK_LINKS = [
  {
    id: "whatsapp",
    label: "Ватсапп",
    description: primaryPhone,
    href: siteConfig.social.whatsapp,
    icon: "/images/social/whatsapp-logo.png",
    disabled: false,
  },
  {
    id: "telegram",
    label: "Телеграм",
    description: "Написать в Telegram",
    href: siteConfig.social.telegram,
    icon: "/images/social/telegram-logo.png",
    disabled: false,
  },
  {
    id: "vk",
    label: "ВКонтакте",
    description: "Ссылка появится позже",
    href: siteConfig.social.vk,
    icon: "/images/social/vk-logo.png",
    disabled: true,
  },
  {
    id: "2gis",
    label: "2ГИС",
    description: "Карточка компании и маршрут",
    href: siteConfig.twoGis,
    icon: "/images/social/2gis-logo.png",
    disabled: false,
  },
  {
    id: "yandex",
    label: "Яндекс Карты",
    description: "Открыть маршрут",
    href: siteConfig.yandexMaps,
    icon: "/images/social/yandex-maps-logo.png",
    disabled: false,
  },
] as const;

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.SCALE_IN,
    from: { scale: 0.92, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
    duration: 0.65,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".contact-info-col",
    from: { x: -120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.6,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".contact-form-col",
    from: { x: 120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.6,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".contact-form-col .form-reveal",
    from: { y: 24, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.4,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} id="contacts" className="reveal-section section-padding">
      <div className="container-shell">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <article className="contact-info-col reveal-item card-surface rounded-xl p-6 md:p-8">
            <div className="reveal-item flex flex-col items-center gap-3 text-center">
              <SectionBadge title="Контакты" className="mb-3" />
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                Связаться с <BrandWordmark className="align-baseline text-3xl md:text-4xl" />
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
                Все быстрые действия собраны в одном месте: мессенджеры, соцсети, навигация и запись на удобное время.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[var(--radius-1)] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Адрес</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-200 md:text-base">{siteConfig.address}</p>
              </div>
              <div className="rounded-[var(--radius-1)] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                  Режим работы
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-200 md:text-base">{siteConfig.schedule}</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-base md:space-y-4 md:text-lg">
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="phone-link-hint inline-flex items-center gap-3 text-zinc-100 transition-colors duration-200 hover:text-white"
                  >
                    <span className="phone-link-hint__arrow" aria-hidden="true">
                      <ArrowUpRight className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.8} />
                    </span>
                    {phone}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <p className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400 md:text-left">Каналы связи и навигация</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {QUICK_LINKS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-disabled={item.disabled ? true : undefined}
                    className={[
                      "group relative flex min-h-[86px] items-center gap-4 overflow-hidden rounded-[18px] border border-white/12",
                      "bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-3 backdrop-blur-md transition-all duration-300",
                      "hover:-translate-y-1 hover:border-[var(--accent)]/35 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)]",
                      item.disabled ? "pointer-events-none opacity-70" : "",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/12 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <Image src={item.icon} alt={item.label} fill sizes="48px" className="object-contain p-2" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-white">{item.label}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                        {item.disabled ? "Скоро" : "Открыть"}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all duration-300 group-hover:border-[var(--accent)]/35 group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)]">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[var(--radius-1)] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Навигация</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Рейтинг в 2ГИС: <span className="font-semibold text-white">{siteConfig.twoGisRating}</span>. Если едете
                впервые, удобнее сразу открыть маршрут через 2ГИС или Яндекс Карты.
              </p>
            </div>
          </article>

          <article className="contact-form-col reveal-item card-surface rounded-xl p-6 md:p-8">
            <div className="form-reveal reveal-item text-center">
              <SectionBadge title="Запись" className="mb-3" />
              <h3 className="mt-3 text-2xl font-semibold leading-snug md:text-3xl">Оставьте заявку</h3>
            </div>
            <p className="form-reveal mt-4 text-sm leading-normal text-zinc-500">
              Ответим в рабочее время, подскажем по стоимости и согласуем удобную дату визита.
            </p>
            <div className="form-reveal mt-6 rounded-[var(--radius-1)] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-zinc-300">
                Если удобнее без формы, можно сразу написать в Ватсапп или Телеграм, либо позвонить на{" "}
                <a href={phoneHref} className="font-semibold text-white transition-colors hover:text-[var(--accent)]">
                  {primaryPhone}
                </a>
                .
              </p>
            </div>
            <div className="form-reveal mt-6">
              <LeadForm />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}



