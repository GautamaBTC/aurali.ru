"use client";

import { useEffect } from "react";

export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    const html = document.documentElement;

    if (locked) {
      const scrollY = window.scrollY;
      html.classList.add("menu-locked");
      html.style.top = `-${scrollY}px`;
      html.dataset.scrollY = String(scrollY);
    } else {
      const scrollY = Number.parseInt(html.dataset.scrollY ?? "0", 10);
      html.classList.remove("menu-locked");
      html.style.top = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      html.classList.remove("menu-locked");
      html.style.top = "";
    };
  }, [locked]);
}
