"use client";

import { useRef } from "react";
import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".hero-reveal",
    from: { y: 30, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="reveal-section relative h-auto overflow-visible pt-10 pb-10 md:min-h-[80vh] md:pt-16 md:pb-20"
      style={{ touchAction: "auto" }}
    >
      <div className="container-shell">
        <div className="card-surface relative overflow-hidden bg-[rgba(5,10,20,0.62)] p-5 sm:p-6 md:p-9 lg:p-10">
          <div className="absolute inset-0 z-0 overflow-hidden lg:hidden" suppressHydrationWarning>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(0,240,255,0.14),transparent_44%),radial-gradient(circle_at_85%_85%,rgba(204,255,0,0.12),transparent_42%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950" />
          </div>

          <div className="hero-reveal pointer-events-none absolute right-3 top-3 z-[1] hidden items-center gap-2 rounded-full border border-[var(--accent-2)]/30 bg-[rgba(5,10,20,0.55)] px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[var(--accent-2)] backdrop-blur md:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            В РАБОТЕ
          </div>

          <div className="relative z-[1] grid gap-6 md:gap-8 lg:items-center">
            <div className="max-w-3xl">
              <p className="hero-reveal text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:text-xs">
                <span className="accent-dot" />
                Шахты • с 2009 года • рейтинг {siteConfig.rating}
              </p>

              <h1 className="hero-reveal mt-4 text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
                <span className="text-[var(--text-primary)]">{siteConfig.brand}: </span>
                <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                  Автоэлектрика и автоэлектроника
                </span>
              </h1>

              <p className="hero-reveal mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
                Один из старейших сервисов автоэлектрики в Шахтах.
              </p>
              <p className="hero-reveal mt-2.5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
                Премиальный центр автоэлектрики: диагностика, охранные системы, автосвет и сложные электрические случаи.
              </p>

              <div className="hero-reveal mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/55 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-primary)] sm:text-xs">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] leading-none text-[#0b0b0b]">
                  *
                </span>
                Официальный дилер
              </div>

              <p className="hero-reveal mt-4 text-xs leading-normal text-zinc-500 sm:text-sm">
                <TypeWriter words={["Диагностика", "Охранные системы", "Автосвет", "Ремонт проводки"]} />
              </p>

              <div className="hero-reveal mt-6 flex flex-col gap-2.5 sm:mt-7 sm:gap-3 md:flex-row md:flex-wrap md:gap-4">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="touch-manipulation inline-flex h-11 w-full items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_0_22px_rgba(204,255,0,0.28)] transition-all duration-200 hover:bg-[var(--accent)]/90 hover:shadow-[0_0_32px_rgba(204,255,0,0.36)] sm:h-12 sm:text-base md:w-auto"
                    style={{ color: "#0b0b0b", WebkitTextFillColor: "#0b0b0b" }}
                  >
                    Записаться в мессенджер
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="touch-manipulation inline-flex h-11 w-full items-center justify-center rounded-lg border border-[var(--line)] bg-transparent px-5 text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-2)]/45 hover:bg-[var(--bg-elevated)]/65 hover:text-[var(--accent-2)] sm:h-12 sm:text-base md:w-auto"
                  >
                    Получить консультацию
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
