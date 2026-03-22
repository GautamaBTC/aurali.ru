"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { useCountUp } from "@/components/stats/useCountUp";

const accentMap = {
  red: {
    iconBg: "bg-[var(--accent)]/15",
    suffixColor: "text-[var(--accent-2)]",
    lineClass: "from-transparent via-[var(--accent)] to-transparent",
    glowClass: "bg-[var(--accent)]/30",
  },
  orange: {
    iconBg: "bg-[var(--accent-2)]/15",
    suffixColor: "text-[var(--accent-2)]",
    lineClass: "from-transparent via-[var(--accent-2)] to-transparent",
    glowClass: "bg-[var(--accent-2)]/30",
  },
  blue: {
    iconBg: "bg-[var(--accent-2)]/15",
    suffixColor: "text-[var(--accent-2)]",
    lineClass: "from-transparent via-[var(--accent-2)] to-transparent",
    glowClass: "bg-[var(--accent-2)]/30",
  },
  green: {
    iconBg: "bg-[var(--accent)]/15",
    suffixColor: "text-[var(--accent)]",
    lineClass: "from-transparent via-[var(--accent)] to-transparent",
    glowClass: "bg-[var(--accent)]/30",
  },
} as const;

export type AccentKey = keyof typeof accentMap;

type StatCardProps = {
  icon: ReactNode;
  target: number;
  suffix?: string;
  decimals?: number;
  label: string;
  accent: AccentKey;
  reveal?: boolean;
};

export function StatCard({
  icon,
  target,
  suffix = "",
  decimals = 0,
  label,
  accent,
  reveal = false,
}: StatCardProps) {
  const gsap = useGSAP();
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const { ref: valueRef, start, stop, setImmediate } = useCountUp({
    target,
    decimals,
    duration: 2.8,
    ease: "power2.out",
  });

  const a = accentMap[accent];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { y: 0 });
      return;
    }

    const hoverTl = gsap.timeline({ paused: true }).to(el, {
      y: -4,
      duration: 0.4,
      ease: "power3.out",
    });

    const enter = () => hoverTl.play();
    const leave = () => hoverTl.reverse();
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      hoverTl.kill();
    };
  }, [gsap, reduced]);

  useEffect(() => {
    if (!reveal) return;
    if (startedRef.current) return;

    startedRef.current = true;

    if (reduced) {
      setImmediate(target);
      return;
    }

    valueRef.current?.classList.add("shimmer-text");
    start();
    const timeoutId = window.setTimeout(() => {
      valueRef.current?.classList.remove("shimmer-text");
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [reduced, reveal, setImmediate, start, target, valueRef]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "glass-card group/card p-8 sm:p-9",
        "max-sm:grid max-sm:grid-cols-[auto_1fr] max-sm:gap-x-5 max-sm:rounded-2xl max-sm:p-6",
      )}
    >
      <div className={cn("glow-line bg-gradient-to-r", a.lineClass)} />
      <div className={cn("corner-glow", a.glowClass)} />

      <div
        className={cn(
          "mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] text-xl transition-transform duration-400 group-hover/card:scale-110",
          "max-sm:row-span-2 max-sm:mb-0 max-sm:h-12 max-sm:w-12",
          a.iconBg,
        )}
      >
        {icon}
      </div>

      <div className="mb-2 flex items-baseline gap-0.5 max-sm:mb-0.5">
        <span
          ref={valueRef}
          className="font-mono text-5xl font-extrabold leading-none tracking-tight text-zinc-100 tabular-nums md:text-6xl"
        >
          0
        </span>
        {suffix ? (
          <span className={cn("text-2xl font-bold leading-none md:text-3xl", a.suffixColor)}>
            {suffix}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed tracking-wide text-zinc-500 md:text-base">{label}</p>
    </article>
  );
}
