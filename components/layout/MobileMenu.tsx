"use client";

import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string };

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-40 transition",
        isOpen ? "pointer-events-auto bg-black/50 opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
    >
      <aside
        className={cn(
          "absolute bottom-0 left-0 right-0 rounded-t-3xl border border-white/15 bg-[var(--bg-secondary)] p-6 transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold">РќР°РІРёРіР°С†РёСЏ</p>
          <button type="button" onClick={onClose} className="h-11 w-11 rounded-xl border border-white/20">
            вњ•
          </button>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={onClose}
                className="block rounded-xl border border-white/10 px-4 py-3 text-[var(--text-secondary)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={siteConfig.social.whatsapp} className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center font-semibold text-[#050A14]">
            WhatsApp
          </a>
          <a href={siteConfig.social.telegram} className="rounded-xl border border-white/20 px-4 py-3 text-center font-semibold">
            Telegram
          </a>
        </div>
      </aside>
    </div>
  );
}

