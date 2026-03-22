"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, PhoneCall } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export function StickyMobileActions() {
  const callLabel = "\u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C";
  const bookLabel = "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F";
  const quickActionsLabel = "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F";
  const phoneHref = `tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`;

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const shown = mounted && visible;

  return (
    <div
      className="sticky-actions-anim fixed left-0 right-0 z-[1200] px-3 will-change-transform md:hidden"
      style={{
        transform: `translateY(${shown ? 0 : 64}px)`,
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-[rgba(5,10,20,0.95)] p-2 shadow-[0_10px_34px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={phoneHref}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)]/50 px-3 py-3 font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-2)]/45 hover:bg-[var(--bg-elevated)]"
          >
            <PhoneCall className="h-4 w-4 text-[var(--accent-2)] transition-transform duration-200 group-hover:-translate-y-0.5" />
            {callLabel}
          </a>
          <a
            href={siteConfig.social.whatsapp}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-3 font-semibold text-black shadow-[0_0_18px_rgba(204,255,0,0.28)] transition-all duration-200 hover:bg-[var(--accent)]/92 hover:text-black hover:shadow-[0_0_30px_rgba(204,255,0,0.38)]"
          >
            <CalendarCheck2 className="h-4 w-4 text-black transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="text-black">{bookLabel}</span>
          </a>
        </div>
        <p className="px-1 pt-2 text-center text-xs font-medium uppercase tracking-widest text-zinc-500">{quickActionsLabel}</p>
      </div>
      <div className="pointer-events-none mx-auto mt-1 h-px max-w-sm bg-gradient-to-r from-transparent via-[var(--accent-2)]/45 to-transparent opacity-70" />
    </div>
  );
}
