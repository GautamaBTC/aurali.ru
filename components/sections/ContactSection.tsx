"use client";

import { useRef } from "react";
import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { siteConfig } from "@/lib/siteConfig";

const SOCIAL_CHANNELS = [
  { id: "telegram", label: "Макс", icon: "/images/social/telegram.png", href: "#" },
  { id: "whatsapp", label: "Телеграм", icon: "/images/social/whatsapp.png", href: "#" },
  { id: "vk", label: "ВКонтакте", icon: "/images/social/vk.png", href: "#" },
  { id: "messenger-alt", label: "Ватсапп", icon: "/images/social/messenger-alt.png", href: "#" },
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
            <h2 className="reveal-item text-3xl font-bold leading-tight tracking-tight md:text-4xl">Контакты и запись</h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{siteConfig.address}</p>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{siteConfig.schedule}</p>
            <ul className="mt-6 space-y-3 text-base md:space-y-4 md:text-lg">
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="text-zinc-100 transition-colors duration-200 hover:text-white"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <a
                href={siteConfig.social.telegram}
                className="btn-secondary inline-flex items-center justify-center px-4 py-2"
              >
                Telegram
              </a>
              <a
                href={siteConfig.social.whatsapp}
                className="btn-secondary inline-flex items-center justify-center px-4 py-2"
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.yandexMaps}
                className="btn-secondary inline-flex items-center justify-center px-4 py-2"
              >
                {"Яндекс Карты"}
              </a>
              <a
                href={siteConfig.twoGis}
                className="btn-secondary inline-flex items-center justify-center px-4 py-2"
              >
                2GIS
              </a>
            </div>
            <p className="mt-4 text-sm leading-normal text-zinc-500">
              Рейтинг в 2GIS: <span className="font-semibold text-zinc-200">{siteConfig.twoGisRating}</span>
            </p>
            <div className="mt-7">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-400">Мы в соцсетях</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {SOCIAL_CHANNELS.map((channel) => (
                  <a
                    key={channel.id}
                    href={channel.href}
                    className="btn-secondary inline-flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <span className="relative h-5 w-5 overflow-hidden rounded">
                      <Image src={channel.icon} alt={channel.label} fill sizes="20px" className="object-cover" />
                    </span>
                    <span>{channel.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </article>
          <article className="contact-form-col reveal-item card-surface rounded-xl p-6 md:p-8">
            <h3 className="form-reveal reveal-item text-2xl font-semibold leading-snug md:text-3xl">Оставьте заявку</h3>
            <p className="form-reveal mt-4 text-sm leading-normal text-zinc-500">
              {"Ответим в рабочее время и согласуем удобную дату визита."}
            </p>
            <div className="form-reveal mt-6">
              <LeadForm />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

