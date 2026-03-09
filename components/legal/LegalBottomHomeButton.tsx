"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LegalBottomHomeButton() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        threshold: 0.15,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-2 w-full" />
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "mt-6 max-h-28 opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className={`flex justify-center transition-transform duration-500 ${visible ? "translate-y-0" : "translate-y-3"}`}>
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-[0_0_24px_rgba(204,255,0,0.32)]"
          >
            <span aria-hidden>↩</span>
            На главную
          </Link>
        </div>
      </div>
    </>
  );
}
