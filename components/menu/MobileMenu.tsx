"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BurgerButton } from "@/components/menu/BurgerButton";
import { MenuFooter } from "@/components/menu/MenuFooter";
import { MenuLink } from "@/components/menu/MenuLink";
import { MenuParticles } from "@/components/menu/MenuParticles";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useMenuAnimations } from "@/hooks/useMenuAnimations";
import { useMenuStore } from "@/hooks/useMenuStore";
import { cn } from "@/lib/cn";

const MENU_ITEMS = [
  { href: "#top", label: "Главная" },
  { href: "#compare", label: "Сравнение" },
  { href: "#services", label: "Услуги" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
] as const;

export function MobileMenu() {
  const isOpen = useMenuStore((s) => s.isOpen);
  const close = useMenuStore((s) => s.close);
  const dividerRef = useRef<HTMLDivElement>(null);

  useLockScroll(isOpen);

  const { setOverlayRef, addItemRef, setDividerRef, setFooterRef, setLineTopRef, setLineMidRef, setLineBotRef, buildTimelines } = useMenuAnimations();

  useEffect(() => {
    const t = window.setTimeout(buildTimelines, 80);
    return () => window.clearTimeout(t);
  }, [buildTimelines]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const handleLinkClick = useCallback(() => {
    window.setTimeout(close, 100);
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
          "fixed left-0 right-0 top-0 z-[100] flex h-20 items-center justify-between bg-[rgba(5,10,20,0.75)] px-5 shadow-[0_1px_0_rgba(224,230,237,0.05),0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-[20px] backdrop-saturate-[180%]",
        )}
      >
        <Link href="/" className="relative z-[101] select-none" aria-label="VIPAuto161 Главная">
          <Image src="/images/plate-logo.svg" alt="VIPАвто 161" width={164} height={44} className="h-9 w-auto" priority />
        </Link>

        <BurgerButton setLineTopRef={setLineTopRef} setLineMidRef={setLineMidRef} setLineBotRef={setLineBotRef} />
      </header>

      <nav
        ref={setOverlayRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Меню навигации"
        className={cn(
          "fixed inset-0 z-[99] invisible pointer-events-none flex flex-col items-center justify-center bg-[rgba(5,10,20,0.97)] px-6 pb-[calc(32px+env(safe-area-inset-bottom,0px))] pt-28 backdrop-blur-[50px] backdrop-saturate-[120%] md:hidden",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          className="pointer-events-none absolute -right-[15%] -top-[25%] h-[55vw] w-[55vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(204,255,0,0.08) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-[15%] -left-[15%] h-[45vw] w-[45vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        <ul className="w-full max-w-sm space-y-1" role="list">
          {MENU_ITEMS.map((item, i) => (
            <MenuLink key={item.href} href={item.href} label={item.label} index={i} onRegister={addItemRef} onClick={handleLinkClick} />
          ))}
        </ul>

        <div
          ref={handleDividerRef}
          className="my-7 h-px w-16 origin-left scale-x-0 bg-gradient-to-r from-transparent via-[var(--accent)]/35 to-transparent opacity-0"
          aria-hidden="true"
        />

        <MenuFooter ref={setFooterRef} onCtaClick={handleLinkClick} />
      </nav>
    </>
  );
}
