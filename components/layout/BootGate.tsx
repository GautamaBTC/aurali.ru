"use client";

import { useLayoutEffect, type ReactNode } from "react";

type BootGateProps = {
  children: ReactNode;
};

export function BootGate({ children }: BootGateProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.introReady = "true";
    root.dataset.introLogo = "true";
    root.dataset.introBurger = "true";
  }, []);

  return <>{children}</>;
}
