"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

type FullscreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function FullscreenMenu({ isOpen, onClose, children }: FullscreenMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeWrapRef = useRef<HTMLButtonElement>(null);
  const closeLineARef = useRef<HTMLSpanElement>(null);
  const closeLineBRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const glowOneRef = useRef<HTMLDivElement>(null);
  const glowTwoRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const closeWrap = closeWrapRef.current;
    const closeLineA = closeLineARef.current;
    const closeLineB = closeLineBRef.current;
    const nav = navRef.current;
    const footer = footerRef.current;
    const glowOne = glowOneRef.current;
    const glowTwo = glowTwoRef.current;
    if (!overlay || !panel || !closeWrap || !closeLineA || !closeLineB || !nav || !footer || !glowOne || !glowTwo) return;

    const navItems = nav.querySelectorAll<HTMLElement>("[data-nav-item]");
    const footerEls = footer.querySelectorAll<HTMLElement>("[data-footer-el]");

    gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(panel, { xPercent: 105 });
    gsap.set(closeWrap, { autoAlpha: 0, scale: 0, rotate: -90 });
    gsap.set(closeLineA, { width: 0 });
    gsap.set(closeLineB, { width: 0 });
    gsap.set(glowOne, { autoAlpha: 0 });
    gsap.set(glowTwo, { autoAlpha: 0 });
    gsap.set(navItems, {
      autoAlpha: 0,
      y: 50,
      x: (index: number) => (index % 2 === 0 ? -60 : 60),
      skewX: (index: number) => (index % 2 === 0 ? -10 : 10),
    });
    gsap.set(footerEls, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" },
      onReverseComplete: () => {
        gsap.set(overlay, { pointerEvents: "none" });
      },
    });

    tl.to(overlay, {
      autoAlpha: 1,
      pointerEvents: "auto",
      duration: 0.32,
      ease: "power2.out",
    });
    tl.to(
      panel,
      {
        xPercent: 0,
        duration: 0.9,
      },
      0.05,
    );
    tl.to(
      closeWrap,
      {
        autoAlpha: 1,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: "back.out(2)",
      },
      0.1,
    );
    tl.to(closeLineA, { width: 24, duration: 0.35 }, 0.15);
    tl.to(closeLineB, { width: 24, duration: 0.35 }, 0.18);
    tl.to(
      navItems,
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        skewX: 0,
        duration: 0.9,
        stagger: 0.08,
      },
      0.2,
    );
    tl.to(glowOne, { autoAlpha: 1, duration: 0.4 }, 0.4);
    tl.to(glowTwo, { autoAlpha: 1, duration: 0.4 }, 0.45);
    tl.to(
      footerEls,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
      },
      0.5,
    );

    const pulseOne = gsap.to(glowOne, {
      scale: 1.08,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    const pulseTwo = gsap.to(glowTwo, {
      scale: 0.92,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    tlRef.current = tl;
    return () => {
      tl.kill();
      pulseOne.kill();
      pulseTwo.kill();
    };
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (isOpen) {
      tl.timeScale(1).play();
      document.body.style.overflow = "hidden";
    } else {
      tl.timeScale(1.5).reverse();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[9999]" style={{ visibility: "hidden", opacity: 0 }}>
      <div
        className="absolute inset-0 bg-[rgba(5,10,20,0.9)] backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      <button
        ref={closeWrapRef}
        type="button"
        onClick={onClose}
        aria-label="Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ"
        className="fixed right-5 top-2 z-[10002] flex h-11 w-11 items-center justify-center sm:right-6 sm:top-3"
      >
        <span ref={closeLineARef} className="absolute h-[2px] -rotate-45 rounded-full bg-[var(--accent)]" />
        <span ref={closeLineBRef} className="absolute h-[2px] rotate-45 rounded-full bg-[var(--accent)]" />
      </button>

      <aside
        ref={panelRef}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full flex-col overflow-hidden",
          "bg-[rgba(5,10,20,0.88)] backdrop-blur-2xl sm:w-[460px] sm:border-l sm:border-[var(--line)]",
          "shadow-[-10px_0_40px_rgba(0,0,0,0.55)]",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={glowOneRef}
          aria-hidden
          className="pointer-events-none absolute -left-28 top-24 h-56 w-56 rounded-full bg-[var(--accent)]/18 blur-[90px]"
        />
        <div
          ref={glowTwoRef}
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-24 h-64 w-64 rounded-full bg-[var(--accent-2)]/18 blur-[96px]"
        />

        <div className="relative z-10 flex items-center justify-between px-6 pb-6 pt-14 sm:pt-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">РќР°РІРёРіР°С†РёСЏ</p>
            <div className="mt-2 h-px w-12 bg-gradient-to-r from-[var(--accent)] to-transparent" />
          </div>
        </div>

        <nav ref={navRef} className="relative z-10 flex-1 overflow-hidden px-4 sm:px-5" role="navigation">
          <div className="flex h-full flex-col justify-center gap-1">{children}</div>
        </nav>

        <div ref={footerRef} className="relative z-10 mt-auto border-t border-white/10 px-6 pb-8 pt-6">
          <a
            href={`tel:${siteConfig.phones[0]?.replace(/[^\d+]/g, "")}`}
            data-footer-el
            className="mb-3 flex items-center gap-3 text-sm text-white/65 transition-colors duration-300 hover:text-[var(--accent)]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <Phone className="h-4 w-4" />
            </div>
            {siteConfig.phones[0]}
          </a>

          <div data-footer-el className="mb-3 flex items-center gap-3 text-sm text-white/55">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70">
              <MapPin className="h-4 w-4" />
            </div>
            {siteConfig.address}
          </div>

          <div data-footer-el className="mb-6 flex items-center gap-3 text-sm text-white/55">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70">
              <Clock className="h-4 w-4" />
            </div>
            {siteConfig.schedule}
          </div>

          <a
            href={siteConfig.social.whatsapp}
            onClick={onClose}
            data-footer-el
            className="group/cta flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-4 text-sm font-bold text-[#050A14] transition-all duration-300 hover:bg-[var(--accent)]/90 hover:shadow-[0_0_40px_rgba(204,255,0,0.28)] active:scale-[0.97]"
          >
            Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РґРёР°РіРЅРѕСЃС‚РёРєСѓ
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </a>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

