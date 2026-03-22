"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { services } from "@/data/services";
import { useReveal } from "@/hooks/useReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { withAlpha } from "@/lib/withAlpha";
import { SectionBadge } from "@/components/ui/SectionBadge";

const ACCORDION_DURATION_MS = 380;

type ServiceIcon = "shield" | "window" | "sound" | "gear" | "bulb" | "drop";

type ServiceMeta = {
  accent: string;
  icon: ServiceIcon;
  title: string;
};

const SERVICE_META: Record<string, ServiceMeta> = {
  diagnostics: { accent: "#00C2FF", icon: "gear", title: "Диагностика" },
  starline: { accent: "#00C2FF", icon: "shield", title: "Сигнализации StarLine" },
  "led-light": { accent: "#3B82F6", icon: "bulb", title: "LED и Bi-LED оптика" },
  autosound: { accent: "#8B5CF6", icon: "sound", title: "Автозвук и мультимедиа" },
  cameras: { accent: "#10B981", icon: "gear", title: "Камеры и парктроники" },
  glonass: { accent: "#10B981", icon: "shield", title: "GPS и мониторинг" },
  "engine-cooling": { accent: "#F97316", icon: "gear", title: "Система охлаждения" },
  "ac-service": { accent: "#38BDF8", icon: "window", title: "Сервис кондиционера" },
  "llumar-tint": { accent: "#FFB800", icon: "window", title: "Тонировка LLumar" },
  repair: { accent: "#FF3D71", icon: "drop", title: "Ремонт электрики" },
};

function createBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number) => {
    let t2 = x;

    for (let i = 0; i < 8; i += 1) {
      const x2Value = sampleCurveX(t2) - x;
      if (Math.abs(x2Value) < 1e-6) return t2;
      const derivative = sampleDerivativeX(t2);
      if (Math.abs(derivative) < 1e-6) break;
      t2 -= x2Value / derivative;
    }

    let t0 = 0;
    let t1 = 1;
    t2 = x;

    while (t0 < t1) {
      const x2Value = sampleCurveX(t2);
      if (Math.abs(x2Value - x) < 1e-6) return t2;
      if (x > x2Value) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * 0.5 + t0;
    }

    return t2;
  };

  return (x: number) => sampleCurveY(solveCurveX(x));
}

const easeAccordion = createBezier(0.22, 1, 0.36, 1);

function getHeaderBottom() {
  if (typeof window === "undefined") return 72;

  const headers = Array.from(document.querySelectorAll<HTMLElement>("[data-site-header]"));
  const visibleHeader = headers.find((node) => {
    const styles = window.getComputedStyle(node);
    return styles.display !== "none" && styles.visibility !== "hidden" && node.getBoundingClientRect().height > 0;
  });

  return visibleHeader?.getBoundingClientRect().bottom ?? 72;
}

function ServiceGlyph({ icon, className }: { icon: ServiceIcon; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (icon === "shield") {
    return (
      <svg {...common}>
        <path d="M12 2L3 7v6c0 5.25 3.75 10 9 11 5.25-1 9-5.75 9-11V7l-9-5z" />
        <rect x="10" y="11" width="4" height="5" rx="1" />
        <circle cx="12" cy="9.5" r="1.5" />
      </svg>
    );
  }

  if (icon === "window") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 12h18" />
        <path d="M12 3v18" />
      </svg>
    );
  }

  if (icon === "sound") {
    return (
      <svg {...common}>
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M17 9l4 4" />
        <path d="M21 9l-4 4" />
      </svg>
    );
  }

  if (icon === "bulb") {
    return (
      <svg {...common}>
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
      </svg>
    );
  }

  if (icon === "drop") {
    return (
      <svg {...common}>
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function scrollToContacts() {
  const node = document.getElementById("contacts");
  if (!node) return;
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const offset = isDesktop ? 72 : 96;
  const y = node.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

type ServiceRowProps = {
  id: string;
  title: string;
  accent: string;
  icon: ServiceIcon;
  description: string;
  price: string;
  leadTime: string;
  features: string[];
  isActive: boolean;
  onToggle: () => void;
};

function ServiceRow({
  id,
  title,
  accent,
  icon,
  description,
  price,
  leadTime,
  features,
  isActive,
  onToggle,
}: ServiceRowProps) {
  const panelId = `service-panel-${id}`;
  const buttonId = `service-button-${id}`;
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [progress, setProgress] = useState(isActive ? 1 : 0);
  const progressRef = useRef(progress);
  const [shouldRenderContent, setShouldRenderContent] = useState(isActive);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const update = () => setContentHeight(node.scrollHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isActive) {
      setShouldRenderContent(true);
    }

    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const startProgress = progressRef.current;
    const targetProgress = isActive ? 1 : 0;
    const startScrollY = typeof window === "undefined" ? 0 : window.scrollY;
    const targetViewportTop = getHeaderBottom() + 12;

    if (Math.abs(targetProgress - startProgress) < 0.001) {
      setProgress(targetProgress);
      progressRef.current = targetProgress;
      if (!isActive) {
        setShouldRenderContent(false);
      }
      return;
    }

    const startedAt = performance.now();

    const step = (now: number) => {
      const raw = Math.min((now - startedAt) / ACCORDION_DURATION_MS, 1);
      const eased = easeAccordion(raw);
      const nextProgress = startProgress + (targetProgress - startProgress) * eased;
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (isActive && headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const desiredScrollY = Math.max(0, absoluteTop - targetViewportTop);
        const nextScrollY = startScrollY + (desiredScrollY - startScrollY) * eased;
        window.scrollTo({ top: nextScrollY, behavior: "auto" });
      }

      if (raw < 1) {
        animationRef.current = window.requestAnimationFrame(step);
        return;
      }

      animationRef.current = null;
      progressRef.current = targetProgress;
      setProgress(targetProgress);

      if (!isActive) {
        setShouldRenderContent(false);
      }
    };

    animationRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, contentHeight]);

  return (
    <article className="group relative border-b border-white/5 last:border-b-0">
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(95deg, ${withAlpha(accent, 0.12)} 0%, transparent 55%)`,
        }}
      />

      <div
        ref={headerRef}
        className={`relative z-20 transition-all duration-300 ${progress > 0 ? "sticky border-b border-white/8 bg-[rgba(6,12,20,0.92)] backdrop-blur-md" : ""}`}
        style={progress > 0 ? { top: "calc(var(--header-h) + env(safe-area-inset-top) + 12px)" } : undefined}
      >
        <button
          id={buttonId}
          type="button"
          aria-expanded={isActive}
          aria-controls={panelId}
          onClick={onToggle}
          className="relative z-[1] flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-300 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:gap-4 sm:px-6"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300"
            style={{
              borderColor: isActive ? withAlpha(accent, 0.35) : withAlpha(accent, 0.18),
              background: isActive ? withAlpha(accent, 0.16) : withAlpha(accent, 0.07),
              color: accent,
              boxShadow: isActive ? `0 0 20px ${withAlpha(accent, 0.2)}` : `inset 0 0 0 1px ${withAlpha(accent, 0.04)}`,
            }}
          >
            <ServiceGlyph icon={icon} className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
            <p className="mt-1 text-xs text-white/45">
              {leadTime} • {price}
            </p>
          </div>

          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300"
            style={{
              borderColor: isActive ? withAlpha(accent, 0.4) : "rgba(255,255,255,0.14)",
              background: isActive ? withAlpha(accent, 0.12) : "rgba(255,255,255,0.03)",
              color: isActive ? accent : "rgba(255,255,255,0.6)",
              boxShadow: isActive ? `0 0 18px ${withAlpha(accent, 0.16)}` : "none",
            }}
            aria-hidden
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-4 w-4 transition-transform duration-300 ease-out ${isActive ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </span>
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!shouldRenderContent}
        className="relative z-[1] overflow-hidden"
        style={{
          maxHeight: `${contentHeight * progress}px`,
          opacity: progress,
          visibility: shouldRenderContent ? "visible" : "hidden",
        }}
      >
        <div
          ref={contentRef}
          className="px-4 pb-5 sm:px-6 sm:pb-6"
          style={{
            transform: `translateY(${(1 - progress) * 8}px)`,
            opacity: 0.3 + progress * 0.7,
          }}
        >
          <div className="mb-4 h-px" style={{ background: `linear-gradient(90deg, ${withAlpha(accent, 0.5)} 0%, transparent 75%)` }} />

          <p
            className="text-sm leading-relaxed text-white/70"
            style={{
              transform: isActive ? "translateY(0)" : "translateY(8px)",
              opacity: isActive ? 1 : 0,
              transition: "opacity 360ms ease 80ms, transform 360ms ease 80ms",
            }}
          >
            {description}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Срок</p>
              <p className="mt-1 text-sm font-medium text-white/85">{leadTime}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Стоимость</p>
              <p className="mt-1 text-sm font-medium text-white/85">{price}</p>
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {features.map((feature, idx) => (
              <li
                key={feature}
                className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-white/72"
                style={{
                  transform: isActive ? "translateY(0)" : "translateY(6px)",
                  opacity: isActive ? 1 : 0,
                  transition: `opacity 340ms ease ${120 + idx * 50}ms, transform 340ms ease ${120 + idx * 50}ms`,
                }}
              >
                {feature}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={scrollToContacts}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: withAlpha(accent, 0.45),
              color: accent,
              background: withAlpha(accent, 0.1),
            }}
          >
            Узнать стоимость
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("");

  useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  useReveal(headingRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  useReveal(accordionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  const toggleService = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? "" : id));
  }, []);

  const serviceRows = useMemo(
    () =>
      services.map((service) => {
        const meta = SERVICE_META[service.id] ?? {
          accent: "#00C2FF",
          icon: "gear" as ServiceIcon,
          title: service.title,
        };

        return {
          ...service,
          accent: meta.accent,
          icon: meta.icon,
          title: meta.title,
        };
      }),
    [],
  );

  return (
    <section ref={sectionRef} id="services" className="services-section reveal-section section-padding">
      <div className="container-shell">
        <div ref={headingRef} className="reveal-item mb-10 text-center sm:mb-12">
          <SectionBadge title="Услуги" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Что мы делаем</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            Продуманный технологичный сервис: диагностика, установка, настройка и сопровождение.
          </p>
        </div>

        <div ref={accordionRef} className="reveal-item">
          <div className="overflow-visible rounded-2xl border border-white/8 bg-[rgba(6,12,20,0.7)] backdrop-blur-md sm:rounded-3xl">
            {serviceRows.map((service) => (
              <ServiceRow
                key={service.id}
                id={service.id}
                title={service.title}
                accent={service.accent}
                icon={service.icon}
                description={service.description}
                price={service.price}
                leadTime={service.leadTime}
                features={service.features}
                isActive={activeId === service.id}
                onToggle={() => toggleService(service.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



