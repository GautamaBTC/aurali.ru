"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ComparisonCardProps = {
  variant: "garage" | "vip";
  badge: string;
  title: ReactNode;
  titleIcon: ReactNode;
  children: ReactNode;
  className?: string;
};

export const ComparisonCard = forwardRef<HTMLDivElement, ComparisonCardProps>(
  ({ variant, badge, title, titleIcon, children, className }, ref) => {
    const isVip = variant === "vip";

    return (
      <article
        ref={ref}
        className={cn(
          "cmp-card group flex flex-col p-5 sm:p-8 lg:p-10",
          isVip ? "cmp-card--vip" : "cmp-card--garage",
          className,
        )}
      >
        <div
          className={cn(
            "absolute left-1/2 top-0 h-[2px] w-0 -translate-x-1/2 rounded-b transition-[width] duration-500 ease-out group-hover:w-3/5",
            isVip
              ? "bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
              : "bg-gradient-to-r from-transparent via-[var(--accent-2)]/65 to-transparent",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-16 -top-16 h-[160px] w-[160px] rounded-full blur-[60px] opacity-0 transition-opacity duration-700 group-hover:opacity-100",
            isVip ? "bg-[var(--accent)]/20" : "bg-[var(--accent-2)]/16",
          )}
        />

        <div
          className={cn(
            "mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest",
            isVip
              ? "border border-[var(--accent)]/35 bg-[var(--accent)]/15 text-[var(--accent)]"
              : "border border-[var(--accent-2)]/25 bg-[var(--accent-2)]/12 text-[var(--accent-2)]/80",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isVip ? "bg-[var(--accent)] animate-badge-pulse" : "bg-[var(--accent-2)]/70")} />
          {badge}
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-400 group-hover:scale-110 sm:h-11 sm:w-11",
              isVip ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--accent-2)]/10 text-[var(--accent-2)]/70",
            )}
          >
            {titleIcon}
          </div>
          <h3 className={cn("text-2xl font-semibold leading-snug md:text-3xl", isVip ? "text-zinc-100" : "text-zinc-400")}>
            {title}
          </h3>
        </div>

        <div className="flex flex-col gap-0.5 sm:gap-1">{children}</div>

        {!isVip ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl border border-dashed border-[var(--accent-2)]/22"
          />
        ) : null}
      </article>
    );
  },
);

ComparisonCard.displayName = "ComparisonCard";
