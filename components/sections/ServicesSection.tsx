"use client";

import { ArrowRight, AudioLines, Binoculars, CarFront, CircleDot, Gauge, ShieldCheck, Snowflake, Sparkles, SunMedium, Wrench } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import {
  AccordionContainer,
  AccordionItem,
  ScanCell,
} from "@/components/ui/CipherAccordion";
import { services } from "@/data/services";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReveal } from "@/hooks/useReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";

const SERVICE_META: Record<
  string,
  {
    accent: string;
    icon: ReactNode;
    title: string;
  }
> = {
  diagnostics: { accent: "#00C2FF", icon: <Gauge className="h-5 w-5 text-current" />, title: "Диагностика" },
  starline: { accent: "#00C2FF", icon: <ShieldCheck className="h-5 w-5 text-current" />, title: "Установка сигнализаций" },
  "led-light": { accent: "#3B82F6", icon: <SunMedium className="h-5 w-5 text-current" />, title: "LED-освещение" },
  autosound: { accent: "#8B5CF6", icon: <AudioLines className="h-5 w-5 text-current" />, title: "Шумоизоляция и автозвук" },
  cameras: { accent: "#10B981", icon: <Binoculars className="h-5 w-5 text-current" />, title: "Доп. оборудование" },
  glonass: { accent: "#10B981", icon: <CarFront className="h-5 w-5 text-current" />, title: "Мониторинг и GPS" },
  "engine-cooling": { accent: "#F97316", icon: <Wrench className="h-5 w-5 text-current" />, title: "Сервис охлаждения" },
  "ac-service": { accent: "#38BDF8", icon: <Snowflake className="h-5 w-5 text-current" />, title: "Климат-сервис" },
  "llumar-tint": { accent: "#FFB800", icon: <Sparkles className="h-5 w-5 text-current" />, title: "Тонировка" },
  repair: { accent: "#FF3D71", icon: <Wrench className="h-5 w-5 text-current" />, title: "Ремонт электрики" },
};

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  const stickyTop = isMobile ? "calc(80px + env(safe-area-inset-top))" : "72px";

  const toggleService = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section ref={sectionRef} id="services" className="reveal-section section-padding">
      <div className="container-shell">
        <div className="max-w-3xl">
          <span className="reveal-item inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/52">
            Услуги
          </span>
          <h2 className="reveal-item mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">Что мы делаем</h2>
          <p className="reveal-item mt-3 max-w-2xl text-sm leading-relaxed text-white/40 md:text-base">
            Диагностика, установка и сложные электронные работы собраны в один аккуратный аккордеон без перегруза карточками.
          </p>
        </div>

        <div className="reveal-item">
          <AccordionContainer>
            {services.map((service, index) => {
              const meta = SERVICE_META[service.id] ?? {
                accent: "#00F0FF",
                icon: <CircleDot className="h-5 w-5 text-current" />,
                title: service.title,
              };
              const isActive = activeId === service.id;

              return (
                <AccordionItem
                  key={service.id}
                  index={String(index + 1).padStart(2, "0")}
                  title={meta.title}
                  accent={meta.accent}
                  isActive={isActive}
                  onToggle={() => toggleService(service.id)}
                  stickyTop={stickyTop}
                  footerLabel="service"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <ScanCell accent={meta.accent} active={isActive}>
                      <div className="transition-all duration-700" style={{ color: meta.accent, transform: isActive ? "scale(1.05)" : "scale(0.95)" }}>
                        {meta.icon}
                      </div>
                    </ScanCell>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-relaxed text-white/45 sm:text-sm">{service.description}</p>
                      <ul className="mt-4 space-y-2.5">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/40 transition-all duration-500"
                            style={{
                              opacity: isActive ? 1 : 0.55,
                              transform: isActive ? "translateY(0)" : "translateY(4px)",
                              transitionDelay: isActive ? `${featureIndex * 50}ms` : "0ms",
                            }}
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: meta.accent }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/38">
                          {service.leadTime}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: meta.accent }}>
                          {service.price}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToContacts}
                        className="group mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 hover:underline"
                        style={{ color: meta.accent }}
                      >
                        Узнать стоимость
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </AccordionItem>
              );
            })}
          </AccordionContainer>
        </div>
      </div>
    </section>
  );
}
