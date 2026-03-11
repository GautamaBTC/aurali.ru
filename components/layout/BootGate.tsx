"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Preloader from "@/components/ui/Preloader";

type BootGateProps = {
  children: ReactNode;
};

export function BootGate({ children }: BootGateProps) {
  const [isReady, setIsReady] = useState(false);
  const timersRef = useRef<number[]>([]);

  const handleComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

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
  }, [isReady]);

  return (
    <>
      {children}
      {!isReady ? <Preloader onComplete={handleComplete} /> : null}
    </>
  );
}
