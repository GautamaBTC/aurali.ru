"use client";

import { forwardRef } from "react";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

type MenuFooterProps = {
  onCtaClick?: () => void;
};

export const MenuFooter = forwardRef<HTMLDivElement, MenuFooterProps>(function MenuFooter({ onCtaClick }, ref) {
  return (
    <div ref={ref} className="flex w-full max-w-[400px] flex-col items-center gap-4 opacity-0">
      <a
        href="tel:+79999999999"
        className={cn(
          "inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-[1.1rem] font-medium tracking-wide text-white transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#dc2626]/30 hover:bg-[#dc2626]/8 hover:text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151A]",
        )}
        aria-label="Позвонить нам"
      >
        <Phone className="h-4 w-4 opacity-70" />
        +7 (XXX) XXX-XX-XX
      </a>

      <address className="flex items-center gap-2 text-sm not-italic tracking-wider text-white/60">
        <MapPin className="h-3.5 w-3.5" />
        Amsterdam, NL
      </address>

      <a
        href="#booking"
        onClick={onCtaClick}
        className={cn(
          "group shadow-crimson-cta relative mt-2 inline-flex w-full max-w-[280px] items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[#dc2626] px-8 py-4 text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-crimson-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151A] active:scale-[0.97]",
        )}
        role="button"
      >
        Записаться
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        <span
          className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-all duration-500 ease-out group-hover:left-full"
          aria-hidden="true"
        />
      </a>
    </div>
  );
});
