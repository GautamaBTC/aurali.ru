"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { services } from "@/data/services";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReveal } from "@/hooks/useReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";

type ServiceIcon = "shield" | "window" | "sound" | "gear" | "bulb" | "drop";

type ServiceMeta = {
  accent: string;
  icon: ServiceIcon;
  title: string;
};

const SERVICE_META: Record<string, ServiceMeta> = {
  diagnostics: { accent: "#00C2FF", icon: "gear", title: "Диагностика" },
  starline: { accent: "#00C2FF", icon: "shield", title: "Установка сигнализаций" },
  "led-light": { accent: "#3B82F6", icon: "bulb", title: "LED-освещение" },
  autosound: { accent: "#8B5CF6", icon: "sound", title: "Шумоизоляция и автозвук" },
  cameras: { accent: "#10B981", icon: "gear", title: "Доп. оборудование" },
  glonass: { accent: "#10B981", icon: "shield", title: "Мониторинг и GPS" },
  "engine-cooling": { accent: "#F97316", icon: "gear", title: "Сервис охлаждения" },
  "ac-service": { accent: "#38BDF8", icon: "window", title: "Климат-сервис" },
  "llumar-tint": { accent: "#FFB800", icon: "window", title: "Тонировка" },
  repair: { accent: "#FF3D71", icon: "drop", title: "Ремонт электрики" },
};

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const int = Number.parseInt(value, 16);

  if (Number.isNaN(int)) return `rgba(255,255,255,${alpha})`;

  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
        <path d="M3 3l9 9" opacity="0.4" />
        <path d="M12 3l9 9" opacity="0.4" />
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

  if (icon === "gear") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
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

  return (
    <svg {...common}>
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
      <path d="M7 13.5a5 5 0 003.5 5" opacity="0.5" />
    </svg>
  );
}

function useStickyState(
  sentinelRef: RefObject<HTMLDivElement | null>,
  isEnabled: boolean,
  stickyOffset: number,
) {
  const [rawIsStuck, setRawIsStuck] = useState(false);

  useEffect(() => {
    if (!isEnabled || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setRawIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: `${-stickyOffset - 1}px 0px 0px 0px` },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isEnabled, sentinelRef, stickyOffset]);

  return isEnabled ? rawIsStuck : false;
}

type ServiceRowProps = {
  service: (typeof services)[number];
  index: string;
  title: string;
  accent: string;
  icon: ServiceIcon;
  isActive: boolean;
  onToggle: () => void;
  isMobile: boolean;
};

function ServiceRow({ service, index, title, accent, icon, isActive, onToggle, isMobile }: ServiceRowProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const isStuck = useStickyState(sentinelRef, isActive, isMobile ? 0 : 72);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => setContentHeight(node.scrollHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article className="relative border-b border-white/4 last:border-b-0">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] transition-opacity duration-[800ms] [transition-timing-function:var(--accordion-ease)]"
        style={{
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(180deg, ${withAlpha(accent, 0)} 0%, ${withAlpha(accent, 0.7)} 50%, ${withAlpha(accent, 0)} 100%)`,
          boxShadow: `0 0 12px ${withAlpha(accent, 0.2)}`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1000ms] [transition-timing-function:var(--accordion-ease)]"
        style={{
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(90deg, ${withAlpha(accent, 0.04)} 0%, transparent 50%)`,
        }}
      />

      <div ref={sentinelRef} className="h-0" aria-hidden />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className={[
          "group relative z-10 flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-7 sm:py-5",
          "cursor-pointer transition-colors [transition-duration:var(--accordion-hover-duration)] [transition-timing-function:var(--accordion-ease)]",
          "hover:bg-white/[0.012] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/15",
          isActive ? "sticky top-[var(--sticky-top-mobile)] sm:top-[var(--sticky-top-desktop)] z-10" : "",
        ].join(" ")}
        style={{
          backgroundColor: isActive && isStuck ? "rgba(9,9,11,0.97)" : "transparent",
          borderBottom: isActive && isStuck ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          boxShadow: isActive && isStuck ? "0 4px 20px rgba(0,0,0,0.4)" : "none",
          backdropFilter: isActive && isStuck ? "blur(12px)" : "none",
          transition:
            "background-color 400ms var(--accordion-ease), border-color 400ms var(--accordion-ease), box-shadow 400ms var(--accordion-ease), backdrop-filter 400ms var(--accordion-ease)",
        }}
      >
        <span
          className="hidden w-6 flex-shrink-0 font-mono text-[11px] tabular-nums sm:inline"
          style={{
            color: isActive ? withAlpha(accent, 0.5) : "rgba(255,255,255,0.12)",
            transition: "color var(--accordion-hover-duration) var(--accordion-ease)",
          }}
        >
          {index}
        </span>
        <span
          className="hidden h-px w-6 flex-shrink-0 sm:block"
          style={{
            background: isActive ? `linear-gradient(90deg, ${withAlpha(accent, 0.7)} 0%, transparent 100%)` : "rgba(255,255,255,0.06)",
            boxShadow: isActive ? `0 0 10px ${withAlpha(accent, 0.22)}` : "none",
            transition: "all 600ms var(--accordion-ease)",
          }}
        />
        <span
          style={{
            color: isActive ? accent : "rgba(255,255,255,0.2)",
            transform: isActive ? "scale(1.08)" : "scale(1)",
            transition: "color 800ms var(--accordion-ease), transform 800ms var(--accordion-ease)",
          }}
        >
          <ServiceGlyph
            icon={icon}
            className="h-5 w-5 flex-shrink-0 transition-all [transition-duration:var(--accordion-hover-duration)] [transition-timing-function:var(--accordion-ease)] sm:h-6 sm:w-6"
          />
        </span>
        <span
          className="text-[13px] font-semibold tracking-[0.01em] sm:text-[15px]"
          style={{
            color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.4)",
            transition: "color 600ms var(--accordion-ease)",
          }}
        >
          {title}
        </span>
        <span className="flex-1" />
        <span
          className="h-[5px] w-[5px] rounded-full"
          style={{
            background: isActive ? accent : "rgba(255,255,255,0.08)",
            boxShadow: isActive ? `0 0 8px ${withAlpha(accent, 0.5)}, 0 0 20px ${withAlpha(accent, 0.15)}` : "none",
            transform: isActive ? "scale(1)" : "scale(0.7)",
            transition: "all 800ms var(--accordion-ease)",
          }}
        />
        <span className="relative h-4 w-4" aria-hidden>
          <span
            className="absolute left-1/2 top-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: isActive ? withAlpha(accent, 0.6) : "rgba(255,255,255,0.26)",
              transition: "all 600ms var(--accordion-ease)",
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: isActive ? withAlpha(accent, 0.6) : "rgba(255,255,255,0.26)",
              transform: `translate(-50%, -50%) rotate(90deg) ${isActive ? "scaleY(0)" : "scaleY(1)"}`,
              opacity: isActive ? 0 : 1,
              transition: "transform 600ms var(--accordion-ease), opacity 600ms var(--accordion-ease), background-color 600ms var(--accordion-ease)",
            }}
          />
        </span>
      </button>

      <div
        role="region"
        className="overflow-hidden"
        style={{
          maxHeight: isActive ? `${contentHeight}px` : "0px",
          opacity: isActive ? 1 : 0,
          transitionProperty: "max-height, opacity",
          transitionDuration: isActive ? "var(--accordion-open-duration), 600ms" : "var(--accordion-close-duration), 300ms",
          transitionDelay: isActive ? "0ms, 150ms" : "0ms, 0ms",
          transitionTimingFunction: "var(--accordion-ease), var(--accordion-ease)",
        }}
      >
        <div ref={contentRef} className="px-4 pb-5 pt-0 sm:px-7 sm:pb-7">
          <div
            className="mb-5 mt-1 h-px origin-left sm:mb-6"
            style={{
              background: `linear-gradient(90deg, ${withAlpha(accent, 0.2)} 0%, transparent 70%)`,
              transform: isActive ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 800ms var(--accordion-ease) 200ms",
            }}
          />

          <div className="flex items-start gap-4">
            <span
              style={{
                color: accent,
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1.1)" : "scale(0.9)",
                transition: "opacity 800ms var(--accordion-ease) 200ms, transform 800ms var(--accordion-ease) 200ms",
              }}
            >
              <ServiceGlyph
                icon={icon}
                className="h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8"
              />
            </span>
            <p
              className="text-[12px] leading-relaxed text-white/40 sm:text-sm"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 700ms var(--accordion-ease) 300ms, transform 700ms var(--accordion-ease) 300ms",
              }}
            >
              {service.description}
            </p>
          </div>

          <ul className="mt-4 space-y-2 sm:mt-5">
            {service.features.map((feature, featureIndex) => (
              <li
                key={feature}
                className="flex items-start gap-2.5"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 500ms var(--accordion-ease), transform 500ms var(--accordion-ease)",
                  transitionDelay: isActive ? `${400 + featureIndex * 100}ms` : "0ms",
                }}
              >
                <span
                  className="mt-[7px] h-[4px] w-[4px] flex-shrink-0 rounded-full"
                  style={{ background: accent }}
                />
                <span className="text-[12px] leading-relaxed text-white/35 sm:text-[13px]">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={scrollToContacts}
            className="group mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium sm:mt-6"
            style={{
              color: accent,
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 500ms var(--accordion-ease) 600ms, transform 500ms var(--accordion-ease) 600ms",
            }}
          >
            Узнать стоимость
            <span
              aria-hidden
              className="inline-block transition-transform duration-[400ms] group-hover:translate-x-[5px]"
            >
              →
            </span>
          </button>

          <div className="mt-5 flex items-center gap-3 border-t border-white/3 pt-4 sm:mt-6">
            <div className="hidden items-end gap-[3px] sm:flex" aria-hidden>
              {[0.3, 0.4, 0.55, 0.7, 0.9].map((opacity, barIndex) => (
                <span
                  key={opacity}
                  className="w-[3px] rounded-full"
                  style={{
                    height: `${[4, 6, 9, 13, 17][barIndex]}px`,
                    background: accent,
                    opacity: isActive ? opacity : 0,
                    transition: `opacity 600ms var(--accordion-ease) ${500 + barIndex * 80}ms`,
                  }}
                />
              ))}
            </div>
            <span className="h-px flex-1 bg-white/3" />
          </div>
        </div>
      </div>
    </article>
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

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const serviceRows = useMemo(
    () =>
      services.map((service, idx) => {
        const meta = SERVICE_META[service.id] ?? { accent: "#00C2FF", icon: "gear" as ServiceIcon, title: service.title };
        return {
          ...service,
          index: String(idx + 1).padStart(2, "0"),
          accent: meta.accent,
          icon: meta.icon,
          title: meta.title,
        };
      }),
    [],
  );

  return (
    <section ref={sectionRef} id="services" className="reveal-section section-padding">
      <div className="container-shell">
        <div ref={headingRef} className="reveal-item mb-10 text-center sm:mb-14 sm:text-left">
          <span className="inline-flex rounded-full border border-white/5 bg-white/4 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Услуги
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Что мы делаем</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/35 sm:mx-0 sm:text-base">
            Полный спектр услуг для вашего автомобиля
          </p>
        </div>

        <div ref={accordionRef} className="reveal-item">
          <div className="overflow-hidden rounded-2xl border border-white/4 bg-white/1 sm:rounded-3xl">
            {serviceRows.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={service.index}
                title={service.title}
                accent={service.accent}
                icon={service.icon}
                isActive={activeId === service.id}
                onToggle={() => toggleService(service.id)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
