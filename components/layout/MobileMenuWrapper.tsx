"use client";

import dynamic from "next/dynamic";

function MobileMenuFallback() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-[1200] flex h-[calc(80px+env(safe-area-inset-top))] items-center justify-center px-5 pt-[env(safe-area-inset-top)] md:hidden"
      style={{
        background: "rgba(5,10,20,0.8)",
        backdropFilter: "blur(10px) saturate(130%)",
        WebkitBackdropFilter: "blur(10px) saturate(130%)",
      }}
    />
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
