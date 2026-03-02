"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export function StickyMobileActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-3 left-0 right-0 z-[1200] px-3 transition md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-2xl border border-[var(--line)] bg-[rgba(5,10,20,0.94)] p-2 backdrop-blur-md">
        <a href={`tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`} className="rounded-xl border border-[var(--line)] px-3 py-3 text-center font-semibold text-[var(--text-primary)]">
          РџРѕР·РІРѕРЅРёС‚СЊ
        </a>
        <a href={siteConfig.social.whatsapp} className="rounded-xl bg-[var(--accent)] px-3 py-3 text-center font-semibold text-[#0a0f18] shadow-[0_0_18px_rgba(204,255,0,0.28)]">
          Р—Р°РїРёСЃР°С‚СЊСЃСЏ
        </a>
      </div>
    </div>
  );
}




