"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { MobileNav } from "@/components/navigation/MobileNav";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Сравнение", href: "#compare" },
  { label: "Услуги", href: "#services" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Процесс", href: "#process" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
] as const;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, delay: 0.2, ease: "expo.out" },
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed left-0 right-0 top-0 z-[150] h-16 px-5 sm:h-[72px] sm:px-6 lg:px-8",
        "transition-all duration-500",
        scrolled
          ? "border-b border-[var(--line)] bg-[var(--bg-primary)]/85 shadow-[0_4px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-shell flex h-full items-center justify-between">
        <Link href="/" className="relative z-[200] flex items-center" aria-label="VIPАвто главная">
          <Image src="/images/plate-logo.svg" alt="VIPАвто 161" width={180} height={48} className="h-9 w-auto sm:h-10" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm text-white/55 transition-all duration-300 hover:bg-[var(--bg-elevated)]/45 hover:text-[var(--accent-2)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
