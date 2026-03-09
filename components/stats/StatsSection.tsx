"use client";

import { useRef } from "react";
import { Clock, LayoutGrid, Star, Users } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { stats } from "@/data/stats";
import { StatCard, type AccentKey } from "@/components/stats/StatCard";

const accentOrder: readonly AccentKey[] = ["red", "orange", "blue", "green", "orange"] as const;

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    from: { ...REVEAL_PRESETS.FADE_UP.from, y: 120 },
    duration: 0.8,
    threshold: 0.3,
  });

  useStaggerReveal(sectionRef, {
    childSelector: "[data-stat-card]",
    from: { scale: 0.8, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
    stagger: 0.12,
    duration: 0.6,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} id="stats" className="reveal-section section-padding relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, rgba(204, 255, 0, 0.08) 42%, transparent 72%)",
        }}
      />

      <div className="container-shell relative z-10">
        <div className="mb-8 text-center md:mb-12">
          <div className="reveal-item mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)] md:mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
            Наши результаты
          </div>

          <h2 className="reveal-item text-3xl font-bold leading-tight tracking-tight text-zinc-100 md:text-4xl">
            Цифры, которые{" "}
            <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              говорят за нас
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
          {stats.map((item, index) => {
            const accent = accentOrder[index % accentOrder.length];
            const icon =
              item.id === "experience" ? (
                <Clock className="h-[22px] w-[22px] stroke-[var(--accent-2)]" strokeWidth={2} />
              ) : item.id === "rating" ? (
                <Star className="h-[22px] w-[22px] stroke-[var(--accent)]" strokeWidth={2} />
              ) : item.id === "reviews" ? (
                <Users className="h-[22px] w-[22px] stroke-[var(--accent-2)]" strokeWidth={2} />
              ) : item.id === "satisfied" ? (
                <Users className="h-[22px] w-[22px] stroke-[var(--accent)]" strokeWidth={2} />
              ) : (
                <LayoutGrid className="h-[22px] w-[22px] stroke-[var(--accent)]" strokeWidth={2} />
              );

            return (
              <div key={item.id} data-stat-card className="reveal-item">
                <StatCard
                  icon={icon}
                  target={item.value}
                  suffix={item.suffix}
                  decimals={item.decimals}
                  label={item.label}
                  accent={accent}
                  reveal={isSectionRevealed}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
