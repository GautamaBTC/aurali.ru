"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { BurgerButton } from "@/components/menu/BurgerButton";
import { MenuFooter } from "@/components/menu/MenuFooter";
import { MenuLink } from "@/components/menu/MenuLink";
import { MenuParticles } from "@/components/menu/MenuParticles";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useMenuAnimations } from "@/hooks/useMenuAnimations";
import { useMenuStore } from "@/hooks/useMenuStore";
import { cn } from "@/lib/cn";

const MENU_ITEMS = [
  { href: "#home", label: "Главная" },
  { href: "#about", label: "О нас" },
  { href: "#services", label: "Услуги" },
  { href: "#lighting", label: "Свет" },
  { href: "#booking", label: "Записаться" },
] as const;

export function MobileMenu() {
  const isOpen = useMenuStore((s) => s.isOpen);
  const close = useMenuStore((s) => s.close);
  const dividerRef = useRef<HTMLDivElement>(null);

  useLockScroll(isOpen);

  const { setOverlayRef, addItemRef, setDividerRef, setFooterRef, setLineTopRef, setLineMidRef, setLineBotRef, setBurgerRef, buildTimelines } =
    useMenuAnimations();

  useEffect(() => {
    const timeout = window.setTimeout(buildTimelines, 100);
    return () => window.clearTimeout(timeout);
  }, [buildTimelines]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const handleLinkClick = useCallback(() => {
    window.setTimeout(close, 150);
  }, [close]);

  const handleDividerRef = useCallback(
    (el: HTMLDivElement | null) => {
      dividerRef.current = el;
      setDividerRef(el);
    },
    [setDividerRef],
  );

  return (
    <>
      <MenuParticles />

      <header
        className={cn(
          "shadow-glass-header fixed left-0 right-0 top-0 z-[100] flex h-[80px] items-center justify-between border-b border-white/8 bg-[#12151A]/75 px-5 pt-[env(safe-area-inset-top,0px)] backdrop-blur-[20px] transition-all duration-300 ease-out md:px-8 lg:px-12",
        )}
      >
        <Link href="/" className="relative z-[101] select-none font-bold uppercase tracking-[0.15em] text-white md:text-xl" aria-label="VIPAuto161 Главная">
          VIP<span className="text-[#dc2626] drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">Auto</span>161
        </Link>

        <BurgerButton setBurgerRef={setBurgerRef} setLineTopRef={setLineTopRef} setLineMidRef={setLineMidRef} setLineBotRef={setLineBotRef} />
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[98] hidden bg-black/50 backdrop-blur-sm transition-opacity duration-400 ease-out md:block",
          isOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none",
        )}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        ref={setOverlayRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Главное меню навигации"
        className={cn(
          "fixed inset-0 z-[99] invisible pointer-events-none flex flex-col items-center justify-center bg-[#12151A]/92 px-8 pb-[calc(40px+env(safe-area-inset-bottom,0px))] pt-[calc(80px+40px)] opacity-0 backdrop-blur-[40px] backdrop-saturate-150",
          "md:left-auto md:right-0 md:w-[420px] md:border-l md:border-white/8 lg:w-[450px]",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          className="pointer-events-none absolute -right-[20%] -top-[30%] h-[60vw] w-[60vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-[20%] -left-[20%] h-[50vw] w-[50vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(22,33,62,0.15) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <ul className="w-full max-w-[400px] space-y-1" role="list">
          {MENU_ITEMS.map((item, i) => (
            <MenuLink key={item.href} href={item.href} label={item.label} index={i} onRegister={addItemRef} onClick={handleLinkClick} />
          ))}
        </ul>

        <div
          ref={handleDividerRef}
          className="my-7 h-px w-[60%] max-w-[200px] origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#dc2626]/30 to-transparent opacity-0"
          aria-hidden="true"
        />

        <MenuFooter ref={setFooterRef} onCtaClick={handleLinkClick} />
      </nav>
    </>
  );
}
