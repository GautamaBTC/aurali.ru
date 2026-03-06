"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

function MobileMenuFallback() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-[1200] flex h-[calc(80px+env(safe-area-inset-top))] items-center justify-center px-5 pt-[env(safe-area-inset-top)] md:hidden"
      style={{
        background: "rgba(5,10,20,0.8)",
        backdropFilter: "blur(10px) saturate(130%)",
        WebkitBackdropFilter: "blur(10px) saturate(130%)",
      }}
    >
      <Link
        href="/"
        className="header-logo pointer-events-auto absolute top-1/2 z-[1201] -translate-y-1/2 select-none"
        style={{ left: "max(1.25rem, env(safe-area-inset-left))", transition: "none" }}
        aria-label="VIPAuto161 Главная"
      >
        <span className="vip-logo-monolith" aria-label="VIPАВТО 161 RUS" style={{ overflow: "visible" }}>
          <span className="logo-text" style={{ overflow: "visible" }}>
            <span className="vip-part logo-anim-node">VIP</span>
            <span className="auto-part logo-anim-node">АВТО</span>
          </span>
          <span className="logo-region logo-anim-node">
            <span className="region-code">161</span>
            <span className="region-flag">RUS</span>
          </span>
          <span
            aria-hidden="true"
            className="logo-accent-line logo-anim-node absolute -bottom-[4px] left-0 h-[2px] w-full bg-gradient-to-r from-[#ccff00] to-[#00f0ff]"
            style={{ opacity: 1 }}
          />
        </span>
      </Link>
    </header>
  );
}

const MobileMenu = dynamic(
  () =>
    import("@/components/layout/MobileMenu").then((mod) => ({
      default: mod.MobileMenu,
    })),
  {
    ssr: false,
    loading: () => <MobileMenuFallback />,
  },
);

export function MobileMenuWrapper() {
  return <MobileMenu />;
}
