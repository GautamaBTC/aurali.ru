"use client";

import { useCallback, useRef, useState } from "react";
import {
  AccordionContainer,
  AccordionItem,
  ImageScanContent,
  ScanCell,
} from "@/components/ui/CipherAccordion";
import { partnerBrands } from "@/data/partnerBrands";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReveal } from "@/hooks/useReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";

export function PartnerBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  const stickyTop = isMobile ? "calc(80px + env(safe-area-inset-top))" : "72px";

  const togglePartner = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section ref={sectionRef} id="partners" className="reveal-section section-padding relative" aria-label="Партнеры и сертификация">
      <div className="container-shell relative z-10">
        <div className="max-w-3xl">
          <span className="reveal-item inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/52">
            Партнеры
          </span>
          <h2 className="reveal-item mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">Сертифицированное оборудование</h2>
          <p className="reveal-item mt-3 max-w-2xl text-sm leading-relaxed text-white/40 md:text-base">
            Авторизованные бренды, с которыми мы работаем ежедневно: охранные системы, пленки, свет и premium detailing.
          </p>
        </div>

        <div className="reveal-item">
          <AccordionContainer>
            {partnerBrands.map((partner) => {
              const isActive = activeId === partner.id;

              return (
                <AccordionItem
                  key={partner.id}
                  index={partner.index}
                  title={partner.name}
                  subtitle={partner.role}
                  accent={partner.accent}
                  isActive={isActive}
                  onToggle={() => togglePartner(partner.id)}
                  stickyTop={stickyTop}
                  footerLabel="certified"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <ScanCell accent={partner.accent} active={isActive}>
                      <ImageScanContent src={partner.logo} alt={partner.name} active={isActive} />
                    </ScanCell>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-relaxed text-white/45 sm:text-sm">{partner.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {partner.tags.map((tag, index) => (
                          <span
                            key={tag}
                            className="rounded-full border px-2.5 py-[5px] font-mono text-[9px] uppercase tracking-[0.14em] transition-all duration-500 sm:text-[10px]"
                            style={{
                              background: isActive ? `${partner.accent}14` : "rgba(255,255,255,0.03)",
                              borderColor: isActive ? `${partner.accent}30` : "rgba(255,255,255,0.08)",
                              color: isActive ? partner.accent : "rgba(255,255,255,0.28)",
                              opacity: isActive ? 1 : 0.55,
                              transform: isActive ? "translateY(0)" : "translateY(4px)",
                              transitionDelay: isActive ? `${index * 70}ms` : "0ms",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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
