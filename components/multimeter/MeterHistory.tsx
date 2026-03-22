"use client";

import { memo } from "react";
import { HISTORY_MAX } from "./multimeter.constants";
import type { ChannelState, MeterMode } from "./multimeter.types";

type Props = { states: Record<MeterMode, ChannelState> };

const CONFIGS: Array<{ mode: MeterMode; label: string; max: number; useLog: boolean }> = [
  { mode: "voltage", label: "V", max: 32, useLog: false },
  { mode: "current", label: "A", max: 50, useLog: false },
  { mode: "resistance", label: "Ω", max: 999999, useLog: true },
];

export const MeterHistory = memo(function MeterHistory({ states }: Props) {
  return (
    <div className="flex flex-1 flex-col rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.25)" }}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/30">HISTORY</span>
          <span className="font-mono text-[7px] text-white/15">{HISTORY_MAX} SAMPLES</span>
        </div>
        <div className="flex items-center gap-2">
          {CONFIGS.map((c) => (
            <div key={c.mode} className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: states[c.mode].zone.color, transition: "background-color 0.8s" }} />
              <span className="font-mono text-[7px] text-white/20">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2">
        {CONFIGS.map((cfg) => {
          const state = states[cfg.mode];
          return (
            <div key={cfg.mode} className="flex flex-1 items-end gap-[1px]">
              {Array.from({ length: HISTORY_MAX }, (_, i) => {
                const val = state.history[i];
                let h = 0;
                if (val !== undefined) {
                  h = cfg.useLog ? Math.log10(Math.max(1, val)) / Math.log10(999999) : val / cfg.max;
                  h = Math.max(0, Math.min(1, h));
                }
                const isLast = i === state.history.length - 1 && val !== undefined;

                return (
                  <span
                    key={i}
                    className="flex-1 rounded-t-[1px]"
                    style={{
                      height: val !== undefined ? `${Math.max(8, h * 100)}%` : "3%",
                      backgroundColor: val !== undefined ? state.zone.color : "rgba(255,255,255,0.02)",
                      opacity: val !== undefined ? 0.12 + (i / HISTORY_MAX) * 0.7 : 1,
                      boxShadow: isLast ? `0 0 6px ${state.zone.color}50` : "none",
                      transition: "height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
                      minWidth: 1,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});
