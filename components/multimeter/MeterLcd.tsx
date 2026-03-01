"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SEGMENTS } from "./multimeter.constants";
import type { MeterMode } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";

const SEG_PATHS = [
  "M 4 1 L 24 1 L 21 5 L 7 5 Z",
  "M 25 2 L 25 22 L 22 19 L 22 5 Z",
  "M 25 26 L 25 46 L 22 43 L 22 29 Z",
  "M 4 47 L 24 47 L 21 43 L 7 43 Z",
  "M 3 26 L 3 46 L 6 43 L 6 29 Z",
  "M 3 2 L 3 22 L 6 19 L 6 5 Z",
  "M 4 24 L 7 21 L 21 21 L 24 24 L 21 27 L 7 27 Z",
] as const;

const LcdChar = memo(function LcdChar({ char, color }: { char: string; color: string }) {
  if (char === ".") {
    return (
      <svg viewBox="0 0 10 48" className="h-full" style={{ width: "25%" }}>
        <circle cx={5} cy={45} r={3} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      </svg>
    );
  }

  const map = SEGMENTS[char] ?? SEGMENTS[" "];
  return (
    <svg viewBox="0 0 28 48" className="h-full" style={{ width: "100%" }}>
      {SEG_PATHS.map((d, i) => {
        const on = map[i] ?? false;
        return (
          <path key={i} d={d} fill={on ? color : "rgba(255,255,255,0.025)"} style={{ filter: on ? `drop-shadow(0 0 3px ${color}90)` : "none", transition: "fill 0.15s ease" }} />
        );
      })}
    </svg>
  );
});

type LcdProps = {
  initialValue: string;
  initialUnit: string;
  color: string;
  overload?: boolean;
  mode: MeterMode;
  setRef: (mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | null) => void;
};

export const MeterLcd = memo(function MeterLcd({ initialValue, initialUnit, color, overload = false, mode, setRef }: LcdProps) {
  const [chars, setChars] = useState<string[]>(() => padValue(initialValue));
  const [unit, setUnit] = useState(initialUnit);
  const elRef = useRef<HTMLDivElement | null>(null);

  const handleUpdate = useCallback((e: Event) => {
    const detail = (e as CustomEvent<{ value: string; unit: string }>).detail;
    setChars(padValue(detail.value));
    setUnit(detail.unit);
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.addEventListener("lcdupdate", handleUpdate as EventListener);
    return () => el.removeEventListener("lcdupdate", handleUpdate as EventListener);
  }, [handleUpdate]);

  const mergeRef = useCallback(
    (node: HTMLDivElement | null) => {
      elRef.current = node;
      setRef(mode, "lcdEl", node);
    },
    [mode, setRef],
  );

  const displayChars = overload ? [" ", "O", "L", " ", " "] : chars;
  const displayColor = overload ? "#ff3b3b" : color;

  return (
    <div
      ref={mergeRef}
      className="relative flex items-center gap-0.5 rounded-lg px-3 py-2.5"
      style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.45) 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-lg" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 40%)" }} aria-hidden />

      <div className={`flex items-center gap-[2px] ${overload ? "animate-pulse" : ""}`} style={{ height: "clamp(30px, 5vw, 44px)" }}>
        {displayChars.map((ch, i) => (
          <LcdChar key={`${i}-${ch}`} char={ch} color={displayColor} />
        ))}
      </div>

      <span className="ml-1.5 self-end pb-0.5 font-mono text-[10px] font-bold tracking-wider" style={{ color: displayColor, opacity: 0.6, textShadow: `0 0 6px ${displayColor}40` }}>
        {unit}
      </span>

      <div className="pointer-events-none absolute inset-0 rounded-lg opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.6) 1px, rgba(0,0,0,0.6) 2px)" }} aria-hidden />
    </div>
  );
});

function padValue(str: string): string[] {
  return str.padStart(5, " ").split("");
}
