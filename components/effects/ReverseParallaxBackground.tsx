"use client";

import { useEffect, useRef } from "react";

type ReverseParallaxBackgroundProps = {
  speed?: number;
  maxOffset?: number;
};

export function ReverseParallaxBackground({
  speed = 0.2,
  maxOffset = 140,
}: ReverseParallaxBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;

    const hostSection = wrap.closest("section");
    if (!hostSection) return;

    let raf = 0;
    const update = () => {
      const rect = hostSection.getBoundingClientRect();
      const offset = Math.max(-maxOffset, Math.min(maxOffset, -rect.top * speed));
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [maxOffset, speed]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={layerRef}
        className="absolute inset-[-12%]"
        style={{
          background:
            "radial-gradient(600px 240px at 15% 20%, rgba(0,240,255,0.14), transparent 72%), radial-gradient(700px 300px at 85% 10%, rgba(204,255,0,0.16), transparent 74%), linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
