"use client";

import { memo } from "react";
import { MeterStatusLed } from "./MeterStatusLed";
import { RANGE_OPTIONS } from "./multimeter.constants";
import type { RangeMode, ToolbarState } from "./multimeter.types";

type Props = {
  toolbar: ToolbarState;
  scenarioLabel: string;
  onToggleHold: () => void;
  onToggleRel: () => void;
  onTogglePeak: () => void;
  onToggleAcDc: () => void;
  onCycleRate: () => void;
  onToggleRec: () => void;
  onSetRange: (r: RangeMode) => void;
  onResetMinMax: () => void;
};

export const MeterHeader = memo(function MeterHeader({
  toolbar,
  scenarioLabel,
  onToggleHold,
  onToggleRel,
  onTogglePeak,
  onToggleAcDc,
  onCycleRate,
  onToggleRec,
  onSetRange,
  onResetMinMax,
}: Props) {
  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-2 sm:px-4">
        <div className="flex flex-wrap items-center gap-1">
          <MeterStatusLed color="#ffd43b" active label="AUTO" clickable onClick={() => onSetRange("auto")} />
          <MeterStatusLed color="#22d3ee" active={toolbar.acdc === "DC"} label={toolbar.acdc} clickable onClick={onToggleAcDc} />
          <MeterStatusLed color="#ff8c21" active={toolbar.hold} blink={toolbar.hold} label="HOLD" clickable onClick={onToggleHold} />
          <MeterStatusLed color="#818cf8" active={toolbar.rel} label="REL Δ" clickable onClick={onToggleRel} />
          <MeterStatusLed color="#ff3b3b" active={toolbar.peak} blink={toolbar.peak} label="PEAK" clickable onClick={onTogglePeak} />

          <button onClick={onResetMinMax} className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[8px] font-bold tracking-wider text-white/25 transition-all hover:bg-white/[0.04] hover:text-white/40 active:scale-95">
            ↺ RESET
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onCycleRate} className="flex items-center gap-1 rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-0.5 transition-all hover:bg-white/[0.04] active:scale-95">
            <span className="font-mono text-[7px] text-white/30">RATE</span>
            <span className="font-mono text-[8px] font-bold text-emerald-400/60">{toolbar.rate.toUpperCase()}</span>
          </button>

          <span className="hidden font-mono text-[8px] tracking-[0.2em] text-white/15 sm:flex">АВТОЭЛЕКТРИК</span>

          <div className="flex items-center gap-1 rounded-md border border-white/[0.04] bg-white/[0.015] px-2 py-0.5">
            <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-white/35">DMM-PRO</span>
          </div>

          <MeterStatusLed color="#00e676" active={toolbar.recording} pulse={toolbar.recording} label="REC" clickable onClick={onToggleRec} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-white/[0.03] px-3 py-1.5 sm:px-4">
        <div className="flex items-center gap-1">
          <span className="mr-1 font-mono text-[7px] font-bold tracking-wider text-white/25">RANGE</span>
          {RANGE_OPTIONS.voltage.map((r) => (
            <button
              key={r}
              onClick={() => onSetRange(r)}
              className={`rounded px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-wider transition-all active:scale-95 ${toolbar.range === r ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400/70" : "border border-transparent text-white/20 hover:border-white/[0.05] hover:text-white/35"}`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {scenarioLabel ? (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="font-mono text-[7px] font-bold text-emerald-400/40">SCENARIO</span>
            <span className="h-3 w-px bg-white/[0.06]" />
            <span className="max-w-[240px] truncate font-mono text-[8px] text-white/35">{scenarioLabel.toUpperCase()}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
});
