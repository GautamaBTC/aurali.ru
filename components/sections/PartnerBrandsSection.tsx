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
import { SectionBadge } from "@/components/ui/SectionBadge";

export function PartnerBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });

  const stickyTop = isMobile ? "calc(var(--header-h) + env(safe-area-inset-top) + 12px)" : "calc(var(--header-h) + 12px)";

  const togglePartner = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const hasActiveItem = activeId !== null;

  return (
    <section ref={sectionRef} id="partners" className="reveal-section section-padding relative" aria-label="Партнёры и сертификация">
      <div className="container-shell relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge title="Партнеры" />
          <h2 className="reveal-item mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">Сертифицированное оборудование</h2>
          <p className="reveal-item mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/40 md:text-base">
            Авторизованные бренды, с которыми мы работаем ежедневно: охранные системы, плёнки, свет и premium detailing.
          </p>
        </div>

        <div className="reveal-item">
          <AccordionContainer>
            {partnerBrands.map((partner) => {
              const isActive = activeId === partner.id;

              return (
                <AccordionItem
                  key={partner.id}
                  title={partner.name}
                  subtitle={partner.role}
                  accent={partner.accent}
                  isActive={isActive}
                  dimmed={hasActiveItem && !isActive}
                  onToggle={() => togglePartner(partner.id)}
                  stickyTop={stickyTop}
                  leadingVisual={
                    <ScanCell active={isActive}>
                      <ImageScanContent src={partner.logo} alt={partner.name} active={isActive} />
                    </ScanCell>
                  }
                >
                  <div>
                    <p className="text-sm leading-relaxed text-white/70">{partner.description}</p>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:max-w-xs">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Статус</p>
                        <p className="mt-1 text-sm font-medium text-white/85">Сертифицированный партнёр</p>
                      </div>
                    </div>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {partner.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-white/72">
                          {tag}
                        </li>
                      ))}
                    </ul>
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



