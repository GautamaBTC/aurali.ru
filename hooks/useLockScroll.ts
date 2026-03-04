"use client";

import { useEffect } from "react";

export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (locked) {
      const scrollY = window.scrollY;
      html.classList.add("menu-locked");
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      return () => {
        const restoreY = Number.parseInt(body.dataset.scrollY ?? "0", 10);
        html.classList.remove("menu-locked");
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        delete body.dataset.scrollY;
        window.scrollTo(0, restoreY);
      };
    }

    html.classList.remove("menu-locked");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    delete body.dataset.scrollY;
    return undefined;
  }, [locked]);
}
