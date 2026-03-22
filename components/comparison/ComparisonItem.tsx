"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ComparisonItemProps = {
  icon: ReactNode;
  text: string;
  variant: "negative" | "positive";
};

export function ComparisonItem({ icon, text, variant }: ComparisonItemProps) {
  const isPositive = variant === "positive";

  return (
    <div
      data-comparison-item
      className={cn(
        "group/item flex items-start gap-3 rounded-2xl p-3 transition-all duration-300 hover:bg-white/[0.03] will-change-transform sm:gap-4 sm:p-4",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-400 group-hover/item:scale-110 group-hover/item:-rotate-3 sm:h-10 sm:w-10",
          isPositive ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--accent-2)]/12 text-[var(--accent-2)]/75",
        )}
      >
        {icon}
      </div>
      <p className={cn("pt-1 text-base leading-relaxed md:text-lg", isPositive ? "text-zinc-300" : "text-zinc-500")}>
        {text}
      </p>
    </div>
  );
}
