"use client";

import { useCallback, useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 400);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Наверх"
      className={`scroll-to-top fixed bottom-[calc(8rem+env(safe-area-inset-bottom))] right-4 z-[1300] flex h-12 w-12 items-center justify-center rounded-2xl bg-transparent text-white/80 outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:bottom-6 md:right-6 ${visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"} hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--accent-2)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
      style={{
        boxShadow: isHovered
          ? "0 0 28px rgba(0,240,255,0.25)"
          : "0 0 18px rgba(0,240,255,0.16)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="scroll-to-top-arrow relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <path
          d="M9 14V4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`transition-colors duration-500 ${isHovered ? "text-[var(--accent)]" : "text-white/70"}`}
        />
        <path
          d="M4 8.5L9 3.5L14 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-colors duration-500 ${isHovered ? "text-[var(--accent-2)]" : "text-white/80"}`}
        />
      </svg>

      {isHovered ? (
        <>
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
        </>
      ) : null}
    </button>
  );
}
