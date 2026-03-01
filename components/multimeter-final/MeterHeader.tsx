"use client";

import { memo } from "react";
import { MeterStatusLed } from "./MeterStatusLed";

type Props = {
  scenarioLabel: string;
  hold: boolean;
  onToggleHold: () => void;
};

export const MeterHeader = memo(function MeterHeader({ scenarioLabel, hold, onToggleHold }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <MeterStatusLed color="#ffd43b" active label="AUTO" />
        <MeterStatusLed color="#22d3ee" active label="DC" />

        <button onClick={onToggleHold} className="transition-transform hover:scale-105 active:scale-95">
          <MeterStatusLed color="#ff8c21" active={hold} blink={hold} label="HOLD" />
        </button>

        <MeterStatusLed color="#818cf8" active={false} label="REL" />
        <MeterStatusLed color="#ff3b3b" active={false} label="PEAK" />

        {scenarioLabel ? (
          <div className="hidden items-center gap-1.5 rounded border border-white/[0.04] bg-white/[0.015] px-2 py-0.5 sm:flex">
            <span className="font-mono text-[7px] font-bold tracking-wider text-emerald-400/40">MODE</span>
            <span className="h-2 w-px bg-white/5" />
            <span className="max-w-[200px] truncate font-mono text-[8px] text-white/30">{scenarioLabel.toUpperCase()}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-[8px] tracking-[0.2em] text-white/8 sm:inline">АВТОЭЛЕКТРИК</span>

        <div className="flex items-center gap-1.5 rounded border border-white/[0.04] px-2 py-0.5" style={{ background: "rgba(255,255,255,0.015)" }}>
          <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-white/25">DMM-PRO</span>
        </div>

        <MeterStatusLed color="#00e676" active pulse label="REC" />
      </div>
    </div>
  );
});
