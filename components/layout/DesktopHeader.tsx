"use client";

import Image from "next/image";
import Link from "next/link";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const MENU_ITEMS = [
  { id: "services", href: "#services", label: "Услуги" },
  { id: "advantages", href: "#advantages", label: "Преимущества" },
  { id: "process", href: "#process", label: "Процесс" },
  { id: "reviews", href: "#reviews", label: "Отзывы" },
  { id: "products", href: "#products", label: "Продукция" },
  { id: "contacts", href: "#contacts", label: "Контакты" },
] as const;

const HEADER_HEIGHT = 72;

function scrollToId(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const node = document.getElementById(id);
  if (!node) return;
  const y = node.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function DesktopHeader() {
  const { direction, atTop } = useScrollDirection();
  const activeSection = useActiveSection(MENU_ITEMS.map((item) => item.id));
  const hidden = direction === "down" && !atTop;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1200] hidden h-[72px] border-b transition-transform duration-300 ease-out lg:block ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${atTop ? "border-white/5 bg-zinc-950/55" : "border-white/10 bg-zinc-950/80 backdrop-blur-md"}`}
    >
      <div className="container-shell flex h-full items-center justify-between gap-8">
        <button
          type="button"
          aria-label="На главную"
          onClick={() => scrollToId("top")}
          className="logo-animate flex shrink-0 items-center"
        >
          <Image
            src="/images/plate-logo.svg"
            alt="ВИПАВТО 161"
            width={130}
            height={34}
            className="logo-animate__img header-logo-glitch h-8 w-auto"
            priority
          />
        </button>

        <nav aria-label="Основная навигация" className="flex items-center gap-6">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId(item.id);
                }}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => scrollToId("contacts")}
          className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-white/90"
        >
          Оставить заявку
        </button>
      </div>
    </header>
  );
}
