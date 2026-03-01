"use client";

import { memo } from "react";
import type { ChannelState, ComputedState, MeterMode } from "./multimeter.types";

type Props = {
  states: Record<MeterMode, ChannelState>;
  computed: ComputedState;
};

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const n = Number.parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const MeterComputed = memo(function MeterComputed({ states, computed }: Props) {
  const v = states.voltage;
  const a = states.current;

  const rFromVi =
    a.value > 0.001
      ? (() => {
          const r = v.value / a.value;
          return r >= 1000 ? `${(r / 1000).toFixed(1)} kΩ` : `${r.toFixed(1)} Ω`;
        })()
      : "∞ Ω";

  const iFromVr = states.resistance.value > 0 ? `${((v.value / states.resistance.value) * 1000).toFixed(2)} mA` : "--";

  const rows = [
    {
      icon: "⚡",
      label: "POWER",
      value: computed.power < 1000 ? `${computed.power.toFixed(1)} W` : `${(computed.power / 1000).toFixed(2)} kW`,
      color: computed.power > 500 ? "#ff8c21" : "#00e676",
    },
    { icon: "∫", label: "ENERGY", value: `${computed.energy.toFixed(3)} Wh`, color: "#818cf8" },
    { icon: "Ω", label: "R = V/I", value: rFromVi, color: "#22d3ee", sub: "COMPUTED" },
    { icon: "I", label: "I = V/R", value: iFromVr, color: "#ffd43b", sub: "COMPUTED" },
  ];

  return (
    <div className="rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/20">COMPUTED</span>
        <span className="font-mono text-[7px] text-emerald-400/30">SYNC</span>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-lg px-2 py-1.5"
            style={{ background: withAlpha(row.color, 0.05), border: `1px solid ${withAlpha(row.color, 0.08)}` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: row.color, opacity: 0.5 }}>
                {row.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[8px] tracking-wider text-white/20">{row.label}</span>
                {row.sub ? <span className="font-mono text-[6px] text-white/10">{row.sub}</span> : null}
              </div>
            </div>
            <span className="font-mono text-[11px] font-medium tabular-nums" style={{ color: row.color, textShadow: `0 0 8px ${withAlpha(row.color, 0.2)}` }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
