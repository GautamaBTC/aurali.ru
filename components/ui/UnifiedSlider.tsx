"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type SliderItem = {
  id: string;
  ariaLabel: string;
  content: ReactNode;
  thumb?: ReactNode;
};

type UnifiedSliderProps = {
  items: SliderItem[];
  ariaLabel: string;
  autoPlay?: boolean;
  autoDelay?: number;
  showProgress?: boolean;
  showThumbs?: boolean;
  className?: string;
};

const SWIPE_THRESHOLD = 42;

export function UnifiedSlider({
  items,
  ariaLabel,
  autoPlay = true,
  autoDelay = 5000,
  showProgress = true,
  showThumbs = false,
  className = "",
}: UnifiedSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const total = items.length;

  const transitionDuration = useMemo(() => {
    if (prefersReducedMotion) return "0ms";
    return isDesktop ? "700ms" : "500ms";
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!autoPlay || isPaused || prefersReducedMotion || total <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoDelay);
    return () => window.clearInterval(timer);
  }, [autoDelay, autoPlay, isPaused, prefersReducedMotion, total]);

  const goTo = (index: number) => {
    if (!total) return;
    setActiveIndex(((index % total) + total) % total);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    setIsPaused(true);
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartXRef.current = null;
    setIsPaused(false);
    if (startX === null || endX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goTo(activeIndex + 1);
    else goTo(activeIndex - 1);
  };

  return (
    <div
      className={`slider ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(activeIndex - 1);
        if (event.key === "ArrowRight") goTo(activeIndex + 1);
      }}
      tabIndex={0}
    >
      <div className="slider__viewport">
        <div
          className="slider__track"
          style={{
            transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
            transitionDuration,
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="slider__slide" role="group" aria-roledescription="slide" aria-label={item.ariaLabel}>
              {item.content}
            </div>
          ))}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="slider__arrow slider__arrow--prev"
              aria-label="Предыдущий слайд"
              onClick={() => goTo(activeIndex - 1)}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 4l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              className="slider__arrow slider__arrow--next"
              aria-label="Следующий слайд"
              onClick={() => goTo(activeIndex + 1)}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M8 4l6 6-6 6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="slider__dots">
          {items.map((item, index) => (
            <button
              key={`${item.id}-dot`}
              type="button"
              className={`slider__dot ${index === activeIndex ? "slider__dot--active" : ""}`.trim()}
              aria-label={`Открыть слайд ${index + 1}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}

      {showProgress && total > 1 ? (
        <div className="slider__progress" aria-hidden>
          <div className="slider__progress-bar" style={{ width: `${((activeIndex + 1) / total) * 100}%` }} />
        </div>
      ) : null}

      {showThumbs && total > 1 ? (
        <div className="mt-[var(--space-3)] flex items-center gap-[var(--space-2)] overflow-x-auto pb-[var(--space-1)]">
          {items.map((item, index) => (
            <button
              key={`${item.id}-thumb`}
              type="button"
              aria-label={`Открыть слайд ${index + 1}`}
              onClick={() => goTo(index)}
              className={`min-h-[44px] min-w-[44px] shrink-0 overflow-hidden rounded-[var(--radius-1)] border transition-opacity ${index === activeIndex ? "border-white/40 opacity-100" : "border-white/12 opacity-72"}`.trim()}
            >
              {item.thumb}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
