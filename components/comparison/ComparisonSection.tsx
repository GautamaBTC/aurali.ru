"use client";

import { useRef } from "react";
import { ClipboardCheck, CircleDollarSign, Crown, Handshake, ScanLine, Warehouse, Wrench, Zap } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { ComparisonCard } from "@/components/comparison/ComparisonCard";
import { ComparisonItem } from "@/components/comparison/ComparisonItem";

const garageItems = [
  {
    icon: <Wrench className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "Замена деталей без поиска первопричины",
  },
  {
    icon: <CircleDollarSign className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "Неясные сроки и стоимость по факту",
  },
  {
    icon: <Zap className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "Нестабильный результат на сложной электрике",
  },
] as const;

const vipItems = [
  {
    icon: <ScanLine className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "Диагностика цепей и блоков под нагрузкой",
  },
  {
    icon: <Handshake className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "Прозрачное согласование до старта ремонта",
  },
  {
    icon: <ClipboardCheck className="h-[18px] w-[18px] sm:h-5 sm:w-5" />,
    text: "Контрольная проверка перед выдачей автомобиля",
  },
] as const;

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.CLIP_BOTTOM,
    from: { clipPath: "inset(100% 0 0 0)", autoAlpha: 0.02 },
    to: { clipPath: "inset(0% 0 0 0)", autoAlpha: 1 },
    duration: 0.8,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-garage",
    from: { x: -120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.7,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-vip",
    from: { x: 120, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
    duration: 0.7,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-garage [data-comparison-item]",
    from: { y: 24, x: -20, autoAlpha: 0 },
    to: { y: 0, x: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".comparison-vip [data-comparison-item]",
    from: { y: 24, x: 20, autoAlpha: 0 },
    to: { y: 0, x: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="reveal-section section-padding relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(ellipse, rgba(0,240,255,0.08) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/2 h-[400px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ background: "radial-gradient(ellipse, rgba(204,255,0,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mb-8 text-center md:mb-12">
        <div className="reveal-item mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)] md:mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
          {"Сравнение"}
        </div>

        <h2 className="reveal-item text-3xl font-bold leading-tight tracking-tight text-zinc-100 md:text-4xl">
          <span className="text-zinc-400">{"Обычный гараж"}</span>{" "}
          <span className="mx-1 text-zinc-600 sm:mx-2">vs</span>{" "}
          <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">VIPАвто</span>
        </h2>

        <p className="reveal-item mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
          {"Чем профессиональный подход отличается от привычного ремонта без диагностики."}
        </p>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 items-stretch gap-6 md:gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <ComparisonCard
            variant="garage"
            badge={"Гаражный подход"}
            title={"Обычный гараж"}
            titleIcon={<Warehouse className="h-5 w-5" />}
            className="comparison-garage reveal-item"
          >
            {garageItems.map((item) => (
              <ComparisonItem key={item.text} icon={item.icon} text={item.text} variant="negative" />
            ))}
          </ComparisonCard>

          <div className="flex items-center justify-center py-2 lg:py-0">
            <div className="absolute hidden h-[70%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />

            <div className="animate-float-slow relative z-10 mx-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] sm:h-14 sm:w-14 lg:mx-0">
              <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-white/10" />
              <span className="text-base font-bold tracking-tight text-white/40 sm:text-lg">vs</span>
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />
          </div>

          <ComparisonCard
            variant="vip"
            badge={"Подход VIPАвто"}
            title={"VIPАвто"}
            titleIcon={<Crown className="h-5 w-5" />}
            className="comparison-vip reveal-item"
          >
            {vipItems.map((item) => (
              <ComparisonItem key={item.text} icon={item.icon} text={item.text} variant="positive" />
            ))}
          </ComparisonCard>
        </div>
      </div>
    </section>
  );
}

