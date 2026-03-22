"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

type BootGateProps = {
  children: ReactNode;
};

export function BootGate({ children }: BootGateProps) {
  const timersRef = useRef<number[]>([]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.removeAttribute("data-intro-ready");
    root.removeAttribute("data-intro-logo");
    root.removeAttribute("data-intro-burger");

    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };

    const startIntro = () => {
      if (root.dataset.introReady === "true") return;
      root.dataset.introReady = "true";
      window.dispatchEvent(new CustomEvent("ui:intro-ready"));

      const logoTimer = window.setTimeout(() => {
        root.dataset.introLogo = "true";
        window.dispatchEvent(new CustomEvent("ui:intro-logo"));
      }, 1000);

      const burgerTimer = window.setTimeout(() => {
        root.dataset.introBurger = "true";
        window.dispatchEvent(new CustomEvent("ui:intro-burger"));
      }, 3200);

      timersRef.current.push(logoTimer, burgerTimer);
    };

    const onWindowLoad = () => {
      window.requestAnimationFrame(startIntro);
    };

    if (document.readyState === "complete") {
      onWindowLoad();
    } else {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onWindowLoad);
      clearTimers();
    };
  }, []);

  return <>{children}</>;
}
