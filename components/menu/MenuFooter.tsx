"use client";

import { forwardRef } from "react";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

type MenuFooterProps = {
  onCtaClick?: () => void;
};

const primaryPhone = siteConfig.phones[0] ?? "+7 (000) 000-00-00";
const telHref = `tel:${primaryPhone.replace(/[^\d+]/g, "")}`;

export const MenuFooter = forwardRef<HTMLDivElement, MenuFooterProps>(function MenuFooter({ onCtaClick }, ref) {
  return (
    <div ref={ref} className="flex w-full max-w-[400px] flex-col items-center gap-4 opacity-0">
      <a
        href={telHref}
        className={cn(
          "inline-flex items-center gap-3 rounded-xl bg-transparent px-5 py-3 text-lg font-medium tracking-wide text-white/90 transition-all duration-300 hover:bg-white/[0.03] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        )}
        aria-label="Позвонить"
      >
        <Phone className="h-[18px] w-[18px] opacity-60" />
        {primaryPhone}
      </a>

      <address className="flex items-center gap-2 text-sm not-italic tracking-wider text-white/40">
        <MapPin className="h-3.5 w-3.5" />
        {siteConfig.city}, {siteConfig.region}
      </address>

      <a
        href="#contacts"
        onClick={onCtaClick}
        className={cn(
          "group relative mt-3 inline-flex w-full max-w-[260px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--accent)] px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.12em] text-[#0a0f18] shadow-[0_4px_20px_rgba(204,255,0,0.34),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_8px_35px_rgba(204,255,0,0.48),inset_0_1px_0_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-2)] active:scale-[0.97]",
        )}
        role="button"
      >
        Записаться
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

        <span
          className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-all duration-500 ease-out group-hover:left-full"
          aria-hidden="true"
        />
      </a>
    </div>
  );
});

MenuFooter.displayName = "MenuFooter";


