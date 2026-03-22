"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { withAlpha } from "@/lib/withAlpha";

const ACCORDION_DURATION_MS = 380;
const HEADER_GAP_PX = 12;

function createBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number) => {
    let t2 = x;

    for (let i = 0; i < 8; i += 1) {
      const x2Value = sampleCurveX(t2) - x;
      if (Math.abs(x2Value) < 1e-6) return t2;
      const derivative = sampleDerivativeX(t2);
      if (Math.abs(derivative) < 1e-6) break;
      t2 -= x2Value / derivative;
    }

    let t0 = 0;
    let t1 = 1;
    t2 = x;

    while (t0 < t1) {
      const x2Value = sampleCurveX(t2);
      if (Math.abs(x2Value - x) < 1e-6) return t2;
      if (x > x2Value) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * 0.5 + t0;
    }

    return t2;
  };

  return (x: number) => sampleCurveY(solveCurveX(x));
}

const easeAccordion = createBezier(0.22, 1, 0.36, 1);

function getHeaderBottom() {
  if (typeof window === "undefined") return 72;

  const headers = Array.from(document.querySelectorAll<HTMLElement>("[data-site-header]"));
  const visibleHeader = headers.find((node) => {
    const styles = window.getComputedStyle(node);
    return styles.display !== "none" && styles.visibility !== "hidden" && node.getBoundingClientRect().height > 0;
  });

  return visibleHeader?.getBoundingClientRect().bottom ?? 72;
}

type ScanCellProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
};

export function ScanCell({ active, children, className }: ScanCellProps) {
  return (
    <div
      className={cn("accordion-leading-visual relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-[4.5rem] sm:w-[4.5rem]", className)}
      style={{
        background: active ? "rgba(239,243,248,0.26)" : "rgba(239,243,248,0.2)",
        borderRadius: "12px",
        transform: active ? "translateY(-1px)" : "translateY(0)",
        transition: `transform ${ACCORDION_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), background ${ACCORDION_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function AccordionContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "accordion-shell relative mt-8 overflow-visible rounded-2xl border border-white/8 bg-[rgba(6,12,20,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur-md sm:rounded-3xl",
        className,
      )}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

type AccordionItemProps = {
  title: string;
  subtitle?: string;
  accent: string;
  leadingVisual?: ReactNode;
  meta?: ReactNode;
  isActive: boolean;
  dimmed?: boolean;
  onToggle: () => void;
  stickyTop?: string | number;
  headerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function AccordionItem({
  title,
  subtitle,
  accent,
  leadingVisual,
  meta,
  isActive,
  dimmed = false,
  onToggle,
  stickyTop = 72,
  headerClassName,
  contentClassName,
  children,
}: AccordionItemProps) {
  const headerWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [progress, setProgress] = useState(isActive ? 1 : 0);
  const [shouldRenderContent, setShouldRenderContent] = useState(isActive);
  const progressRef = useRef(progress);
  const animationRef = useRef<number | null>(null);
  const panelId = useId();
  const headerId = useId();

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const update = () => setHeight(node.scrollHeight);
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isActive) {
      setShouldRenderContent(true);
    }

    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const startProgress = progressRef.current;
    const targetProgress = isActive ? 1 : 0;
    const startScrollY = typeof window === "undefined" ? 0 : window.scrollY;
    const targetViewportTop = getHeaderBottom() + HEADER_GAP_PX;

    if (Math.abs(targetProgress - startProgress) < 0.001) {
      setProgress(targetProgress);
      progressRef.current = targetProgress;
      if (!isActive) {
        setShouldRenderContent(false);
      }
      return;
    }

    const startedAt = performance.now();

    const step = (now: number) => {
      const raw = Math.min((now - startedAt) / ACCORDION_DURATION_MS, 1);
      const eased = easeAccordion(raw);
      const nextProgress = startProgress + (targetProgress - startProgress) * eased;
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (isActive && headerWrapRef.current) {
        const rect = headerWrapRef.current.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const desiredScrollY = Math.max(0, absoluteTop - targetViewportTop);
        const nextScrollY = startScrollY + (desiredScrollY - startScrollY) * eased;
        window.scrollTo({ top: nextScrollY, behavior: "auto" });
      }

      if (raw < 1) {
        animationRef.current = window.requestAnimationFrame(step);
        return;
      }

      animationRef.current = null;
      progressRef.current = targetProgress;
      setProgress(targetProgress);

      if (!isActive) {
        setShouldRenderContent(false);
      }
    };

    animationRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, height]);

  const chevronOpacity = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2;
  const chevronRotation = progress < 0.5 ? 0 : 180;
  const inactiveOpacity = dimmed ? 0.4 : 1;

  return (
    <article
      className="accordion-item group relative overflow-visible border-b border-white/5 last:border-b-0"
      style={{
        opacity: inactiveOpacity,
        transition: `opacity ${ACCORDION_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      <div
        className="pointer-events-none absolute left-6 right-6 top-0 h-px origin-left"
        style={{
          opacity: progress,
          transform: `scaleX(${0.35 + progress * 0.65})`,
          background: "rgba(255,255,255,0.12)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] transition-all duration-700"
        style={{
          background: progress > 0
            ? `linear-gradient(180deg, ${withAlpha(accent, 0)}, ${withAlpha(accent, 0.9)}, ${withAlpha(accent, 0)})`
            : "transparent",
          boxShadow: progress > 0 ? `0 0 12px ${withAlpha(accent, 0.35)}` : "none",
          opacity: progress,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.35 + progress * 0.65,
          background: `linear-gradient(95deg, ${withAlpha(accent, 0.05 + progress * 0.07)} 0%, transparent 58%)`,
          transition: `opacity ${ACCORDION_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />

      <div
        ref={headerWrapRef}
        className={cn(
          "accordion-sticky-header relative z-20 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
          progress > 0 && "z-10 border-b border-white/8 bg-[rgba(6,12,20,0.92)] shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-md",
        )}
        style={progress > 0 ? { position: "sticky", top: stickyTop } : undefined}
      >
        <button
          id={headerId}
          type="button"
          onClick={onToggle}
          className={cn(
            "relative flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-300 hover:bg-white/[0.02] focus-visible:bg-white/[0.02] focus-visible:outline-none sm:gap-4 sm:px-6",
            headerClassName,
          )}
          aria-expanded={isActive}
          aria-controls={panelId}
        >
          {leadingVisual ? <div className="shrink-0">{leadingVisual}</div> : null}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
            {subtitle ? <p className="mt-1 text-xs text-white/45">{subtitle}</p> : null}
          </div>

          {meta ? <div className="hidden shrink-0 md:block">{meta}</div> : null}

          <span
            className="accordion-chevron flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
            style={{
              borderColor: progress > 0.01 ? withAlpha(accent, 0.4) : "rgba(255,255,255,0.14)",
              background: progress > 0.01 ? withAlpha(accent, 0.12) : "rgba(255,255,255,0.03)",
              color: progress > 0.01 ? accent : "rgba(255,255,255,0.6)",
              boxShadow: progress > 0.01 ? `0 0 18px ${withAlpha(accent, 0.16)}` : "none",
            }}
            aria-hidden
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: chevronOpacity,
                transform: `rotate(${chevronRotation}deg)`,
              }}
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </span>
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!shouldRenderContent}
        className={cn("overflow-hidden", contentClassName)}
        style={{
          maxHeight: `${height * progress}px`,
          opacity: progress,
          visibility: shouldRenderContent ? "visible" : "hidden",
          transition: "none",
        }}
      >
        <div
          ref={contentRef}
          className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6"
          style={{
            transform: `translateY(${(1 - progress) * 8}px)`,
            opacity: 0.3 + progress * 0.7,
          }}
        >
          <div
            className="mb-4 h-px"
            style={{
              background: `linear-gradient(90deg, ${withAlpha(accent, 0.5)} 0%, transparent 75%)`,
            }}
          />
          {children}
        </div>
      </div>
    </article>
  );
}

export function ImageScanContent({
  src,
  alt,
  active,
}: {
  src: string;
  alt: string;
  active: boolean;
}) {
  return (
    <div
      className="relative flex h-16 w-16 items-center justify-center rounded-[10px] p-[12px]"
      style={{
        background: "#FFFFFF",
        opacity: 1,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={42}
        height={42}
        className="object-contain transition-all duration-300"
        style={{
          filter: active ? "brightness(1.06)" : "brightness(1.02)",
          transform: active ? "scale(1.12)" : "scale(1.1)",
        }}
      />
    </div>
  );
}
