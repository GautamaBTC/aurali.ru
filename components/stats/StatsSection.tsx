"use client";

import { useEffect, useRef } from "react";
import { Clock, LayoutGrid, Star, Users } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { stats } from "@/data/stats";
import { StatCard, type AccentKey } from "@/components/stats/StatCard";

const accentOrder: readonly AccentKey[] = ["red", "orange", "blue", "green", "orange"] as const;

export function StatsSection() {
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    if (reduced) {
      gsap.set(node, { autoAlpha: 1, y: 0 });
      return;
    }

    const tween = gsap.from(node, {
      autoAlpha: 0,
      y: 30,
      duration: 0.8,
      ease: "expo.out",
      scrollTrigger: {
        trigger: node,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [gsap, reduced]);

  useEffect(() => {
    return () => {
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="stats" className="section-padding relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, rgba(204, 255, 0, 0.08) 42%, transparent 72%)",
        }}
      />

      <div className="container-shell relative z-10">
        <div ref={headerRef} className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-[var(--accent-2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
            Наши результаты
          </div>

          <h2 className="text-[clamp(28px,5vw,44px)] font-bold leading-tight tracking-tight text-gray-100">
            Цифры, которые{" "}
            <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              говорят за нас
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
              <StatCard
                key={item.id}
                icon={icon}
                target={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
                label={item.label}
                accent={accent}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

