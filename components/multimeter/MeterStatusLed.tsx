"use client";

import { memo } from "react";

type Props = {
  color?: string;
  active?: boolean;
  blink?: boolean;
  pulse?: boolean;
  label: string;
  onClick?: () => void;
  clickable?: boolean;
};

export const MeterStatusLed = memo(function MeterStatusLed({
  color = "#00e676",
  active = true,
  blink = false,
  pulse = false,
  label,
  onClick,
  clickable = false,
}: Props) {
  const Wrapper = (clickable ? "button" : "div") as "button" | "div";

  return (
    <Wrapper
      onClick={clickable ? onClick : undefined}
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 transition-all ${clickable ? "cursor-pointer hover:bg-white/[0.04] active:scale-95" : ""} ${active && clickable ? "bg-white/[0.03]" : ""}`}
    >
      <span className="relative flex h-[6px] w-[6px]">
        {pulse && active ? <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} /> : null}
        <span
          className={`relative inline-flex h-[6px] w-[6px] rounded-full ${blink && active ? "animate-pulse" : ""}`}
          style={{
            backgroundColor: active ? color : "rgba(255,255,255,0.08)",
            boxShadow: active ? `0 0 8px ${color}90, 0 0 3px ${color}` : "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </span>
      <span
        className="font-mono text-[8px] font-bold tracking-[0.1em]"
        style={{
          color: active ? color : "rgba(255,255,255,0.18)",
          textShadow: active ? `0 0 8px ${color}30` : "none",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: active ? 0.85 : 0.4,
        }}
      >
        {label}
      </span>
    </Wrapper>
  );
});
