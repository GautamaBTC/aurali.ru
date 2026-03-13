"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { brands } from "@/data/brands";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { siteConfig } from "@/lib/siteConfig";
import type { BrandItem } from "@/types";

const BRAND_GROUPS = [
  { key: "all", label: "Все" },
  { key: "europe", label: "Европейские" },
  { key: "japan", label: "Японские" },
  { key: "korea", label: "Корейские" },
  { key: "china", label: "Китайские" },
  { key: "usa", label: "Американские" },
  { key: "russia", label: "Российские" },
] as const;

type BrandGroupKey = (typeof BRAND_GROUPS)[number]["key"];

function getBrandIcon(name: string) {
  return name.replace(/[^A-Za-zА-Яа-я0-9]/g, "").slice(0, 3).toUpperCase();
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 32,
  animate = true,
  inView = false,
}: {
  items: BrandItem[];
  reverse?: boolean;
  duration?: number;
  animate?: boolean;
  inView?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className={`brands-marquee relative overflow-hidden py-2 ${inView ? "is-in-view" : ""}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/95 to-transparent md:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--bg-primary)] via-[var(--bg-primary)]/95 to-transparent md:w-16" />

      <div
        className={[
          "flex w-max items-center gap-3",
          animate ? (reverse ? "animate-brands-marquee-reverse" : "animate-brands-marquee") : "",
        ].join(" ")}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="brand-marquee-chip group flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/4 bg-white/4 px-3 text-xs text-white/55 sm:h-10 sm:text-sm"
          >
            <span className="brand-marquee-chip__logo flex h-5 w-5 items-center justify-center rounded-full border border-white/5 bg-white/4 text-[9px] font-bold tracking-[0.16em] text-white/45">
              {getBrandIcon(brand.name)}
            </span>
            <span className="whitespace-nowrap font-medium">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandGridCard({
  brand,
  index,
  expanded,
}: {
  brand: BrandItem;
  index: number;
  expanded: boolean;
}) {
  return (
    <article
      className="brand-grid-card group relative overflow-hidden rounded-2xl border border-white/5 bg-white/3 p-3 sm:p-4"
      style={
        {
          "--brand-accent": brand.color,
          transitionDelay: expanded ? `${Math.min(index * 30, 300)}ms` : "0ms",
          opacity: expanded ? 1 : 0,
          transform: expanded ? "translateY(0px)" : "translateY(12px)",
        } as CSSProperties
      }
    >
      <div className="brand-grid-card__glow" />
      <div className="brand-grid-card__line" />

      <div className="relative z-[1] flex flex-col items-center gap-2 text-center">
        <div className="brand-grid-card__logo flex h-7 w-7 items-center justify-center rounded-xl border border-white/6 bg-white/4 text-[10px] font-bold tracking-[0.18em] text-white/40 sm:h-8 sm:w-8">
          {getBrandIcon(brand.name)}
        </div>
        <h3 className="text-xs font-medium tracking-wide text-white/68">{brand.name}</h3>
      </div>
    </article>
  );
}

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [marqueeRef, marqueeInView] = useInView({ threshold: 0.15, once: false });
  const reduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeGroup, setActiveGroup] = useState<BrandGroupKey>("all");

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".brands-reveal-item",
    from: { y: 20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  const previewBrands = useMemo(() => {
    const featured = brands.filter((brand) => brand.featured);
    return featured.length ? featured : brands.slice(0, 16);
  }, []);

  const topRow = useMemo(() => previewBrands.slice(0, Math.ceil(previewBrands.length / 2)), [previewBrands]);
  const bottomRow = useMemo(() => previewBrands.slice(Math.ceil(previewBrands.length / 2)), [previewBrands]);

  const filteredBrands = useMemo(() => {
    if (activeGroup === "all") return brands;
    return brands.filter((brand) => brand.group === activeGroup);
  }, [activeGroup]);

  return (
    <section ref={sectionRef} id="brands" className="reveal-section section-padding" aria-label="Бренды автомобилей">
      <div className="container-shell">
        <div className="brand-showcase-shell overflow-hidden rounded-[2rem] border border-white/5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="max-w-2xl">
              <SectionBadge title="Автомарки" className="brands-reveal-item" />
              <h2 className="brands-reveal-item reveal-item mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">Работаем с распространенными и редкими платформами</h2>
              <p className="brands-reveal-item reveal-item mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                От немецких и японских моделей до новых китайских платформ. Подбираем решение под конкретную электронику, а не по шаблону.
              </p>
            </div>

            <div className="brands-reveal-item reveal-item flex items-center gap-5 rounded-full border border-white/6 bg-white/3 px-4 py-2 text-center">
              <div>
                <p className="text-lg font-bold text-white">{brands.length}+</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">марок</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">17+</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">лет</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{`${Math.floor(siteConfig.carsServiced / 1000)}K+`}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">авто</p>
              </div>
            </div>
          </div>

          <div
            ref={marqueeRef}
            className={`brands-reveal-item reveal-item mt-7 rounded-[1.5rem] border border-white/6 bg-[linear-gradient(180deg,rgba(12,12,14,0.92),rgba(15,15,19,0.84))] px-2 py-2.5 md:px-3 ${
              marqueeInView ? "is-in-view" : ""
            }`}
          >
            <MarqueeRow items={topRow} duration={32} animate={!reduceMotion} inView={marqueeInView} />
            {bottomRow.length ? <MarqueeRow items={bottomRow} reverse duration={35} animate={!reduceMotion} inView={marqueeInView} /> : null}
          </div>

          <div className="brands-reveal-item reveal-item mt-5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setIsExpanded((prev) => {
                  const next = !prev;
                  if (!next) setActiveGroup("all");
                  return next;
                });
              }}
              aria-label={isExpanded ? "Свернуть список марок" : `Показать все ${brands.length} марок`}
              aria-expanded={isExpanded}
              aria-controls="brands-grid"
              className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/4 px-5 py-2.5 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/8 hover:text-white"
            >
              <span>{isExpanded ? "Свернуть" : `Все ${brands.length} марок`}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div
            id="brands-grid"
            className={`overflow-hidden transition-[max-height,opacity,margin] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded ? "mt-6 max-h-[2200px] opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <div className={`transition-opacity duration-300 ${isExpanded ? "opacity-100 delay-200" : "opacity-0"}`}>
              <div className="flex flex-wrap items-center justify-center gap-2 pb-5">
                {BRAND_GROUPS.map((group) => {
                  const isActive = activeGroup === group.key;

                  return (
                    <button
                      key={group.key}
                      type="button"
                      onClick={() => setActiveGroup(group.key)}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                        isActive
                          ? "border-white/10 bg-white/10 text-white"
                          : "border-white/5 bg-white/3 text-white/40 hover:bg-white/6 hover:text-white/70"
                      }`}
                    >
                      {group.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                {filteredBrands.map((brand, index) => (
                  <BrandGridCard key={`${activeGroup}-${brand.id}`} brand={brand} index={index} expanded={isExpanded} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



