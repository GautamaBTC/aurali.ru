"use client";

import { memo } from "react";
import { MeterStatusLed } from "./MeterStatusLed";

type Props = {
  scenarioLabel: string;
};

export const MeterHeader = memo(function MeterHeader({ scenarioLabel }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <MeterStatusLed color="#ffd43b" active label="AUTO" />
        <MeterStatusLed color="#22d3ee" active label="DC" />
        <MeterStatusLed color="#ff8c21" active={false} label="HOLD" />
        <MeterStatusLed color="#ff3b3b" active={false} label="REL" />

        {scenarioLabel ? (
          <div className="hidden items-center gap-1.5 rounded border border-white/5 bg-white/[0.02] px-2.5 py-0.5 sm:flex">
            <span className="font-mono text-[9px] tracking-wider text-emerald-400/60">MODE:</span>
            <span className="max-w-[180px] truncate font-mono text-[9px] tracking-wider text-white/40">{scenarioLabel.toUpperCase()}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden font-mono text-[9px] tracking-[0.2em] text-white/12 sm:inline">AUTOELECTRIC</span>
        <span className="font-mono text-[10px] font-bold tracking-wider text-white/20">DMM-PRO</span>
        <MeterStatusLed color="#00e676" active pulse label="REC" />
      </div>
    </div>
  );
});
