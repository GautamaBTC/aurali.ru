"use client";

import { memo } from "react";

type Props = {
  color?: string;
  active?: boolean;
  pulse?: boolean;
  label: string;
  size?: "sm" | "md";
};

export const MeterStatusLed = memo(function MeterStatusLed({
  color = "#00e676",
  active = true,
  pulse = false,
  label,
  size = "sm",
}: Props) {
  const d = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <div className="flex items-center gap-1.5">
      <span className={`relative flex ${d}`}>
        {pulse && active ? <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: color, opacity: 0.4 }} /> : null}
        <span
          className={`relative inline-flex ${d} rounded-full`}
          style={{
            backgroundColor: active ? color : "rgba(255,255,255,0.06)",
            boxShadow: active ? `0 0 6px ${color}cc` : "none",
            transition: "all 0.6s ease",
          }}
        />
      </span>
      <span className="font-mono text-[9px] font-medium uppercase tracking-wider text-white/25">{label}</span>
    </div>
  );
});
