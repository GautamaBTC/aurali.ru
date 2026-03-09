"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const int = Number.parseInt(value, 16);

  if (Number.isNaN(int)) return `rgba(255,255,255,${alpha})`;

  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function MorphIcon({ isOpen, accent }: { isOpen: boolean; accent: string }) {
  return (
    <div className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
      <span
        className="absolute h-[1.5px] w-3.5 rounded-full transition-all duration-500"
        style={{
          background: isOpen ? withAlpha(accent, 0.92) : "rgba(255,255,255,0.26)",
          boxShadow: isOpen ? `0 0 10px ${withAlpha(accent, 0.35)}` : "none",
        }}
      />
      <span
        className="absolute h-[1.5px] w-3.5 rounded-full transition-all duration-500"
        style={{
          background: isOpen ? withAlpha(accent, 0.92) : "rgba(255,255,255,0.26)",
          transform: isOpen ? "rotate(90deg) scaleY(0)" : "rotate(90deg) scaleY(1)",
          opacity: isOpen ? 0 : 1,
        }}
      />
    </div>
  );
}

export function SignalBars({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div className="flex items-end gap-[2px]" aria-hidden>
      {[4, 6, 9, 12, 16].map((height, index) => (
        <div
          key={height}
          className="w-[3px] rounded-full transition-all duration-500"
          style={{
            height: `${height}px`,
            background: active ? accent : "rgba(255,255,255,0.06)",
            opacity: active ? 0.3 + index * 0.15 : 1,
            transitionDelay: active ? `${index * 60}ms` : "0ms",
          }}
        />
      ))}
    </div>
  );
}

function CornerMarks({ accent }: { accent: string }) {
  return (
    <>
      <span className="absolute left-1.5 top-1.5 h-px w-2.5 rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute left-1.5 top-1.5 h-2.5 w-px rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute right-1.5 top-1.5 h-px w-2.5 rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute right-1.5 top-1.5 h-2.5 w-px rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute bottom-1.5 left-1.5 h-px w-2.5 rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute bottom-1.5 left-1.5 h-2.5 w-px rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute bottom-1.5 right-1.5 h-px w-2.5 rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
      <span className="absolute bottom-1.5 right-1.5 h-2.5 w-px rounded-full" style={{ background: withAlpha(accent, 0.3) }} />
    </>
  );
}

type ScanCellProps = {
  accent: string;
  active: boolean;
  children: ReactNode;
  className?: string;
};

export function ScanCell({ accent, active, children, className }: ScanCellProps) {
  return (
    <div
      className={cn(
        "cipher-scan-cell relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[18px] border sm:h-14 sm:w-14",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 50% 35%, ${withAlpha(accent, active ? 0.16 : 0.08)}, rgba(255,255,255,0.03) 72%)`,
        borderColor: active ? withAlpha(accent, 0.2) : "rgba(255,255,255,0.06)",
        boxShadow: active ? `0 0 28px ${withAlpha(accent, 0.09)}, inset 0 0 22px ${withAlpha(accent, 0.08)}` : "none",
      }}
    >
      <div className="cipher-scan-line pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]" aria-hidden>
        <div
          className="animate-cipher-scan absolute inset-x-0 top-0 h-[40%]"
          style={{
            background: `linear-gradient(180deg, transparent, ${withAlpha(accent, 0.18)}, transparent)`,
          }}
        />
      </div>
      <CornerMarks accent={accent} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function AccordionContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "cipher-accordion-shell relative mt-8 overflow-visible rounded-[28px] border border-white/6 bg-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_24px_80px_-40px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.32) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

type AccordionItemProps = {
  index: string;
  title: string;
  subtitle?: string;
  accent: string;
  isActive: boolean;
  onToggle: () => void;
  stickyTop?: string | number;
  headerClassName?: string;
  contentClassName?: string;
  headerVisual?: ReactNode;
  footerLabel?: string;
  children: ReactNode;
};

export function AccordionItem({
  index,
  title,
  subtitle,
  accent,
  isActive,
  onToggle,
  stickyTop = 72,
  headerClassName,
  contentClassName,
  headerVisual,
  footerLabel = "certified",
  children,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const panelId = useId();
  const headerId = useId();

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const update = () => setHeight(node.scrollHeight);
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <article className="cipher-accordion-item relative overflow-visible border-b border-white/4 last:border-b-0">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] transition-all duration-700"
        style={{
          background: isActive
            ? `linear-gradient(180deg, ${withAlpha(accent, 0)}, ${withAlpha(accent, 0.9)}, ${withAlpha(accent, 0)})`
            : "transparent",
          boxShadow: isActive ? `0 0 12px ${withAlpha(accent, 0.35)}` : "none",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(90deg, ${withAlpha(accent, 0.06)} 0%, transparent 62%)`,
        }}
      />

      <div
        className={cn(
          "relative transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
          isActive && "z-10 border-b border-white/4 bg-zinc-950/95 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-sm",
        )}
        style={isActive ? { position: "sticky", top: stickyTop } : undefined}
      >
        <button
          id={headerId}
          type="button"
          onClick={onToggle}
          className={cn(
            "group relative flex min-h-[56px] w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-300 hover:bg-white/[0.015] focus-visible:bg-white/[0.02] sm:gap-5 sm:px-6 sm:py-4",
            headerClassName,
          )}
          aria-expanded={isActive}
          aria-controls={panelId}
        >
          <span className="w-5 flex-shrink-0 font-mono text-[11px] tracking-[0.18em] text-white/15 transition-colors duration-300 group-hover:text-white/30">
            {index}
          </span>
          <span
            className="hidden h-px w-4 flex-shrink-0 sm:block"
            style={{
              background: isActive ? `linear-gradient(90deg, ${withAlpha(accent, 0.55)}, transparent)` : "rgba(255,255,255,0.06)",
            }}
          />
          <span
            className="text-[14px] font-semibold transition-colors duration-300"
            style={{ color: isActive ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.45)" }}
          >
            {title}
          </span>
          {subtitle ? <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/12 sm:inline">{subtitle}</span> : null}
          <span className="flex-1" />
          <span
            className="h-[6px] w-[6px] flex-shrink-0 rounded-full transition-all duration-500"
            style={{
              background: isActive ? accent : "rgba(255,255,255,0.1)",
              boxShadow: isActive ? `0 0 10px ${withAlpha(accent, 0.6)}, 0 0 20px ${withAlpha(accent, 0.2)}` : "none",
            }}
          />
          {headerVisual}
          <MorphIcon isOpen={isActive} accent={accent} />
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn("overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]", contentClassName)}
        style={{ maxHeight: isActive ? `${height}px` : "0px", opacity: isActive ? 1 : 0 }}
      >
        <div ref={contentRef} className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6">
          <div
            className="mb-5 h-px"
            style={{
              background: `linear-gradient(90deg, ${withAlpha(accent, 0.3)}, transparent 85%)`,
            }}
          />
          {children}
          <div className="mt-5 flex items-center gap-3 border-t border-white/3 pt-3">
            <SignalBars active={isActive} accent={accent} />
            <div className="h-px flex-1 bg-white/3" />
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: isActive ? withAlpha(accent, 0.6) : "rgba(255,255,255,0.12)" }}
            >
              {footerLabel}
            </span>
          </div>
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
    <Image
      src={src}
      alt={alt}
      width={36}
      height={36}
      className="object-contain transition-all duration-700"
      style={{
        opacity: active ? 0.88 : 0.8,
        filter: active ? "brightness(1.12)" : "brightness(1.02)",
        transform: active ? "scale(1.05)" : "scale(0.95)",
      }}
    />
  );
}

export function AccentLabelContent({
  label,
  sublabel,
  accent,
  active,
}: {
  label: string;
  sublabel?: string;
  accent: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-2 text-center">
      <span
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-700 sm:text-xs"
        style={{
          color: active ? withAlpha(accent, 0.98) : "rgba(255,255,255,0.68)",
          transform: active ? "scale(1.05)" : "scale(0.96)",
        }}
      >
        {label}
      </span>
      {sublabel ? <span className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/28">{sublabel}</span> : null}
    </div>
  );
}
