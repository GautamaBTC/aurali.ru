"use client";

import { useEffect } from "react";

export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;

    if (locked) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      return () => {
        const restoreY = Number.parseInt(body.dataset.scrollY ?? "0", 10);
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflow = "";
        body.style.overscrollBehavior = "";
        delete body.dataset.scrollY;
        window.scrollTo({ top: restoreY, behavior: "auto" });
      };
    }

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    body.style.overscrollBehavior = "";
    delete body.dataset.scrollY;
    return undefined;
  }, [locked]);
}
