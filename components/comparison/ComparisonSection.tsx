"use client";

import { useEffect, useRef } from "react";
import { ClipboardCheck, CircleDollarSign, Crown, Handshake, ScanLine, Warehouse, Wrench, Zap } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const garageRef = useRef<HTMLDivElement>(null);
  const vipRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const garage = garageRef.current;
    const vip = vipRef.current;
    const vs = vsRef.current;
    if (!section || !header || !garage || !vip || !vs) return;

    if (reduced) {
      gsap.set([header.children, garage, vip, vs], { autoAlpha: 1, y: 0, x: 0, scale: 1, rotation: 0 });
      return;
    }

    const mm = gsap.matchMedia();
    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    const headerItems = Array.from(header.children);
    gsap.set(headerItems, { autoAlpha: 0, y: 25 });
    triggers.push(
      ScrollTrigger.create({
        trigger: header,
        start: "top 85%",
        once: true,
        onEnter: () => {
          tweens.push(
            gsap.to(headerItems, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "expo.out",
            }),
          );
        },
      }),
    );

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (ctx) => {
        const { isDesktop } = ctx.conditions as { isDesktop: boolean };

        gsap.set(garage, {
          autoAlpha: 0,
          x: isDesktop ? -60 : 0,
          y: isDesktop ? 0 : 40,
          scale: 0.97,
        });
        triggers.push(
          ScrollTrigger.create({
            trigger: garage,
            start: "top 88%",
            once: true,
            onEnter: () => {
              tweens.push(
                gsap.to(garage, {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: 1,
                  ease: "expo.out",
                }),
              );

              const items = garage.querySelectorAll<HTMLElement>("[data-comparison-item]");
              if (items.length) {
                gsap.set(items, { autoAlpha: 0, x: -30, scale: 0.95 });
                tweens.push(
                  gsap.to(items, {
                    autoAlpha: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.5,
                    ease: "back.out(1.4)",
                  }),
                );
              }
            },
          }),
        );

        gsap.set(vip, {
          autoAlpha: 0,
          x: isDesktop ? 60 : 0,
          y: isDesktop ? 0 : 40,
          scale: 0.97,
        });
        triggers.push(
          ScrollTrigger.create({
            trigger: vip,
            start: "top 88%",
            once: true,
            onEnter: () => {
              tweens.push(
                gsap.to(vip, {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: 1,
                  delay: 0.15,
                  ease: "expo.out",
                }),
              );

              const items = vip.querySelectorAll<HTMLElement>("[data-comparison-item]");
              if (items.length) {
                gsap.set(items, { autoAlpha: 0, x: 30, scale: 0.95 });
                tweens.push(
                  gsap.to(items, {
                    autoAlpha: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.65,
                    ease: "back.out(1.4)",
                  }),
                );
              }
            },
          }),
        );
      },
    );

    gsap.set(vs, { autoAlpha: 0, scale: 0, rotation: -180 });
    triggers.push(
      ScrollTrigger.create({
        trigger: vs,
        start: "top 90%",
        once: true,
        onEnter: () => {
          tweens.push(
            gsap.to(vs, {
              autoAlpha: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              delay: 0.4,
              ease: "back.out(2)",
            }),
          );
        },
      }),
    );

    return () => {
      mm.revert();
      triggers.forEach((trigger) => trigger.kill());
      tweens.forEach((tween) => tween.kill());
    };
  }, [gsap, reduced]);

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="relative mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 lg:py-28"
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

      <div ref={headerRef} className="relative z-10 mb-10 text-center sm:mb-14">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-[var(--accent-2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
          Сравнение
        </div>

        <h2 className="text-[clamp(24px,5vw,44px)] font-bold leading-tight tracking-tight text-gray-100">
          <span className="text-[var(--text-secondary)]">Обычный гараж</span>{" "}
          <span className="mx-1 text-white/20 sm:mx-2">vs</span>{" "}
          <span className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">VIPАвто</span>
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/40 sm:text-[15px]">
          Чем профессиональный подход отличается от привычного ремонта без диагностики.
        </p>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 lg:grid-cols-[1fr_auto_1fr]">
          <ComparisonCard
            ref={garageRef}
            variant="garage"
            badge="Гаражный подход"
            title="Обычный гараж"
            titleIcon={<Warehouse className="h-5 w-5" />}
          >
            {garageItems.map((item) => (
              <ComparisonItem key={item.text} icon={item.icon} text={item.text} variant="negative" />
            ))}
          </ComparisonCard>

          <div className="flex items-center justify-center py-2 lg:py-0">
            <div className="absolute hidden h-[70%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />

            <div
              ref={vsRef}
              className="animate-float-slow relative z-10 mx-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl sm:h-14 sm:w-14 lg:mx-0"
            >
              <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-white/10" />
              <span className="text-base font-bold tracking-tight text-white/40 sm:text-lg">vs</span>
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />
          </div>

          <ComparisonCard
            ref={vipRef}
            variant="vip"
            badge="Подход VIPАвто"
            title="VIPАвто"
            titleIcon={<Crown className="h-5 w-5" />}
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

