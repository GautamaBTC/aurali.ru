"use client";

import { useEffect, useRef, type ReactNode } from "react";

type BootGateProps = {
  children: ReactNode;
};

export function BootGate({ children }: BootGateProps) {
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.introReady = "true";

    const logoTimer = window.setTimeout(() => {
      root.dataset.introLogo = "true";
      window.dispatchEvent(new CustomEvent("ui:intro-logo"));
    }, 1000);

    const burgerTimer = window.setTimeout(() => {
      root.dataset.introBurger = "true";
      window.dispatchEvent(new CustomEvent("ui:intro-burger"));
    }, 2000);

    timersRef.current.push(logoTimer, burgerTimer);

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  return <>{children}</>;
}
