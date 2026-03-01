"use client";

import { memo, useMemo } from "react";
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
  const rows = useMemo(
    () => [
      {
        icon: "⚡",
        label: "POWER",
        sub: "P = V * I",
        value: computed.power < 1000 ? `${computed.power.toFixed(1)} W` : `${(computed.power / 1000).toFixed(2)} kW`,
        color: computed.power > 500 ? "#ff8c21" : computed.power > 100 ? "#ffd43b" : "#00e676",
      },
      { icon: "∫", label: "ENERGY", sub: "E = P * t", value: `${computed.energy.toFixed(3)} Wh`, color: "#818cf8" },
      { icon: "~", label: "FREQUENCY", sub: "ALT RIPPLE", value: `${computed.frequency.toFixed(1)} Hz`, color: "#22d3ee" },
      { icon: "V", label: "Vpp", sub: "PEAK-PEAK", value: `${computed.vpp.toFixed(2)} V`, color: states.voltage.zone.color },
      { icon: "%", label: "DUTY", sub: "CYCLE", value: `${computed.duty.toFixed(1)} %`, color: "#ffd43b" },
      {
        icon: "Z",
        label: "IMPEDANCE",
        sub: "R = V/I",
        value: computed.impedance > 100000 ? "∞ Ω" : computed.impedance >= 1000 ? `${(computed.impedance / 1000).toFixed(1)} kΩ` : `${computed.impedance.toFixed(1)} Ω`,
        color: "#22d3ee",
      },
    ],
    [computed, states.voltage.zone.color],
  );

  return (
    <div className="flex h-full flex-col rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.25)" }}>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="font-mono text-[7px] font-bold tracking-[0.15em] text-white/20">COMPUTED</span>
        <span className="flex items-center gap-1">
          <span className="h-[3px] w-[3px] animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-[6px] text-emerald-400/30">SYNC</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/[0.01]" style={{ border: `1px solid ${withAlpha(r.color, 0.08)}`, transition: "border-color 0.6s" }}>
            <div className="flex items-center gap-2">
              <span className="w-3 text-center font-mono text-[9px]" style={{ color: r.color, opacity: 0.4 }}>
                {r.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] font-bold tracking-wider text-white/15">{r.label}</span>
                <span className="font-mono text-[6px] text-white/8">{r.sub}</span>
              </div>
            </div>

            <span className="font-mono text-[10px] font-medium tabular-nums" style={{ color: r.color, textShadow: `0 0 6px ${withAlpha(r.color, 0.15)}`, transition: "color 0.6s" }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
