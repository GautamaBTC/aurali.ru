"use client";

import dynamic from "next/dynamic";

const MobileMenu = dynamic(
  () =>
    import("@/components/layout/MobileMenu").then((mod) => ({
      default: mod.MobileMenu,
    })),
  { ssr: false },
);

export function MobileMenuWrapper() {
  return <MobileMenu />;
}
