"use client";

import { memo } from "react";
import { HISTORY_MAX } from "./multimeter.constants";
import type { ChannelState, MeterMode } from "./multimeter.types";

type Props = {
  states: Record<MeterMode, ChannelState>;
};

export const MeterHistory = memo(function MeterHistory({ states }: Props) {
  const channels: Array<{ mode: MeterMode; history: number[]; color: string; max: number }> = [
    { mode: "voltage", history: states.voltage.history, color: states.voltage.zone.color, max: 32 },
    { mode: "current", history: states.current.history, color: states.current.zone.color, max: 50 },
    { mode: "resistance", history: states.resistance.history, color: states.resistance.zone.color, max: 1 },
  ];

  return (
    <div className="rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/20">HISTORY</span>
        <span className="font-mono text-[8px] text-white/10">{HISTORY_MAX} SAMPLES</span>
      </div>

      <div className="flex flex-col gap-2">
        {channels.map((channel) => (
          <div key={channel.mode} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-[3px] w-[3px] rounded-full" style={{ backgroundColor: channel.color }} />
              <span className="font-mono text-[7px] tracking-wider text-white/15">{channel.mode.toUpperCase().slice(0, 4)}</span>
            </div>

            <div className="flex h-6 items-end gap-[1px] overflow-hidden">
              {Array.from({ length: HISTORY_MAX }, (_, i) => {
                const val = channel.history[i];
                let h = 0;
                if (val !== undefined) {
                  if (channel.mode === "resistance") {
                    h = Math.max(0, Math.min(1, Math.log10(Math.max(1, val)) / Math.log10(999999)));
                  } else {
                    h = Math.max(0, Math.min(1, val / channel.max));
                  }
                }

                return (
                  <span
                    key={i}
                    className="flex-1 rounded-t-[1px]"
                    style={{
                      height: val !== undefined ? `${Math.max(2, h * 100)}%` : "2px",
                      backgroundColor: val !== undefined ? channel.color : "rgba(255,255,255,0.02)",
                      opacity: val !== undefined ? 0.3 + (i / HISTORY_MAX) * 0.5 : 1,
                      transition: "height 0.3s ease, opacity 0.3s ease",
                      minWidth: 1,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
