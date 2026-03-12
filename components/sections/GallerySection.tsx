"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { galleryImages } from "@/data/gallery";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { BrandWordmark } from "@/components/ui/BrandWordmark";

const AUTO_DELAY_MS = 4500;

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const staggerFrom = useMemo(() => ({ y: 28, autoAlpha: 0 }), []);
  const staggerTo = useMemo(() => ({ y: 0, autoAlpha: 1 }), []);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.CLIP_LEFT,
    from: { clipPath: "inset(0 0 0 100%)", autoAlpha: 0.04 },
    to: { clipPath: "inset(0 0 0 0)", autoAlpha: 1 },
    duration: 0.75,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".gallery-reveal",
    from: staggerFrom,
    to: staggerTo,
    stagger: 0.06,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  useEffect(() => {
    if (isPaused || galleryImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, AUTO_DELAY_MS);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goTo = (next: number) => {
    const total = galleryImages.length;
    if (!total) return;
    setActiveIndex(((next % total) + total) % total);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    setIsPaused(true);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartXRef.current = null;
    setIsPaused(false);
    if (startX === null || endX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < 42) return;
    if (delta < 0) goTo(activeIndex + 1);
    else goTo(activeIndex - 1);
  };

  return (
    <section ref={sectionRef} id="gallery" className="reveal-section section-padding">
      <div className="container-shell">
        <div className="card-surface rounded-xl p-6 md:p-8">
          <h2 className="gallery-reveal text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Галлерея <BrandWordmark />
          </h2>
          <p className="gallery-reveal mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
            Реальные примеры выполненных работ: автосвет, диагностика и установка электроники.
          </p>

          <div className="gallery-reveal mt-8">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/12 bg-[rgba(5,10,20,0.7)]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translate3d(-${activeIndex * 100}%,0,0)` }}
              >
                {galleryImages.map((src, index) => (
                  <article key={src} className="relative w-full shrink-0">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[18/8]">
                      <Image
                        src={src}
                        alt={`Галерея ВИПАВТО ${index + 1}`}
                        fill
                        priority={index < 2}
                        sizes="100vw"
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                      <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm md:left-4 md:top-4">
                        {String(index + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                aria-label="Предыдущее фото"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white/85 backdrop-blur-md transition hover:bg-black/60"
              >
                <span aria-hidden>‹</span>
              </button>
              <button
                type="button"
                aria-label="Следующее фото"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white/85 backdrop-blur-md transition hover:bg-black/60"
              >
                <span aria-hidden>›</span>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
              {galleryImages.map((src, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${src}-thumb`}
                    type="button"
                    aria-label={`Показать фото ${index + 1}`}
                    onClick={() => goTo(index)}
                    className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition ${
                      isActive ? "border-[var(--accent)]/80 ring-1 ring-[var(--accent)]/45" : "border-white/15 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                );
              })}
            </div>

            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-[width] duration-500"
                style={{ width: `${((activeIndex + 1) / galleryImages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
