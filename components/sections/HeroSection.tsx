"use client";

import { useRef } from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { AnimatedGrid } from "@/components/effects/AnimatedGrid";
import { CountUp } from "@/components/effects/CountUp";
import { FloatingBadge } from "@/components/effects/FloatingBadge";
import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { siteConfig } from "@/lib/siteConfig";

const YEARS = new Date().getFullYear() - siteConfig.founded;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ratingVotes = Number(siteConfig.ratingVotes) || 0;

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
        <div className="card-surface hero-card-surface relative overflow-hidden bg-[rgba(5,10,20,0.78)] p-5 sm:p-6 md:p-9 lg:p-10">
          <div className="hidden md:block">
            <AnimatedGrid />
          </div>

          <div className="absolute inset-0 z-0 overflow-hidden" suppressHydrationWarning>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(0,240,255,0.14),transparent_44%),radial-gradient(circle_at_85%_85%,rgba(204,255,0,0.12),transparent_42%)]" />
            <div className="hero-scan-line absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950/80" />
          </div>

          <div className="hero-corner hero-corner--tl" aria-hidden />
          <div className="hero-corner hero-corner--tr" aria-hidden />
          <div className="hero-corner hero-corner--bl" aria-hidden />
          <div className="hero-corner hero-corner--br" aria-hidden />

          <FloatingBadge
            className="hero-reveal pointer-events-none absolute right-4 bottom-4 z-[2] hidden flex-col items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[rgba(5,10,20,0.75)] px-4 py-3 backdrop-blur-md lg:flex"
            delay={1}
          >
            <span className="text-3xl font-black leading-none text-[var(--accent)]">
              <CountUp end={YEARS} duration={2000} revealed={isSectionRevealed} />
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">лет опыта</span>
          </FloatingBadge>

          <div className="relative z-[1] grid gap-6 md:gap-8 lg:items-center">
            <div className="max-w-3xl">
              <p className="hero-reveal text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:text-xs">
                <span className="accent-dot hero-accent-dot-animated" />
                Шахты • с {siteConfig.founded} года • рейтинг <span className="hero-rating-badge">{siteConfig.rating}</span>
                <span className="hero-rating-star ml-1">★</span>
              </p>

              <h1 className="hero-reveal mt-4 text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
                <BrandWordmark />{" "}
                <span className="hero-gradient-text">автоэлектрика и автоэлектроника</span>
              </h1>

              <div className="hero-reveal hero-divider-line mt-5" />

              <p className="hero-reveal mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
                Один из старейших сервисов автоэлектрики в Шахтах.
              </p>
              <p className="hero-reveal mt-2.5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
                Премиальный центр автоэлектрики: диагностика, охранные системы, автосвет и сложные электрические случаи.
              </p>

              <div className="hero-reveal mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/55 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.13em] text-[var(--text-primary)] backdrop-blur-sm sm:text-xs">
                <span className="hero-star-icon" aria-hidden>
                  ★
                </span>
                Официальный дилер охранных систем
              </div>

              <p className="hero-reveal mt-4 text-xs leading-normal text-zinc-500 sm:text-sm">
                <TypeWriter words={["Диагностика", "Охранные системы", "Автосвет", "Ремонт проводки"]} />
              </p>

              <div className="hero-reveal mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--line)]/40 pt-5 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--accent)] sm:text-xl">
                    <CountUp end={YEARS} duration={1800} suffix="+" revealed={isSectionRevealed} />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">лет работы</span>
                </div>
                <div className="h-8 w-px bg-[var(--line)]/30" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--accent-2)] sm:text-xl">
                    <CountUp end={ratingVotes} duration={2200} revealed={isSectionRevealed} />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">отзывов</span>
                </div>
                <div className="h-8 w-px bg-[var(--line)]/30" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
                    {siteConfig.rating}
                    <span className="hero-rating-star">★</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">рейтинг</span>
                </div>
              </div>

              <div className="hero-reveal mt-6 flex flex-col gap-2.5 sm:mt-7 sm:gap-3 md:flex-row md:flex-wrap md:gap-4">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="hero-btn-primary touch-manipulation inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-[#0b0b0b] transition-all duration-200 sm:h-12 sm:text-base md:w-auto"
                    style={{ color: "#0b0b0b", WebkitTextFillColor: "#0b0b0b" }}
                  >
                    <MessageCircle className="hero-btn-icon" aria-hidden />
                    Записаться в мессенджер
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="hero-btn-secondary touch-manipulation inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-transparent px-5 text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-2)]/45 hover:bg-[var(--bg-elevated)]/65 hover:text-[var(--accent-2)] sm:h-12 sm:text-base md:w-auto"
                  >
                    <ShieldCheck className="hero-btn-icon" aria-hidden />
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
