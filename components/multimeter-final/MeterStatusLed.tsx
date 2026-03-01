"use client";

import { memo } from "react";

type Props = {
  color?: string;
  active?: boolean;
  blink?: boolean;
  pulse?: boolean;
  label: string;
};

export const MeterStatusLed = memo(function MeterStatusLed({ color = "#00e676", active = true, blink = false, pulse = false, label }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-[6px] w-[6px]">
        {pulse && active ? <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} /> : null}
        <span
          className={`relative inline-flex h-[6px] w-[6px] rounded-full ${blink && active ? "animate-pulse" : ""}`}
          style={{
            backgroundColor: active ? color : "rgba(255,255,255,0.05)",
            boxShadow: active ? `0 0 6px ${color}e6, 0 0 2px ${color}` : "none",
            transition: "all 0.4s ease",
          }}
        />
      </span>
      <span
        className="font-mono text-[8px] font-bold tracking-[0.1em]"
        style={{
          color: active ? color : "rgba(255,255,255,0.12)",
          textShadow: active ? `0 0 6px ${color}4d` : "none",
          transition: "all 0.4s ease",
          opacity: active ? 0.7 : 0.3,
        }}
      >
        {label}
      </span>
    </div>
  );
});
