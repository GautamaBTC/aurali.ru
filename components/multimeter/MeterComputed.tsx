"use client";

import { memo, useMemo } from "react";
import type { ChannelState, ComputedState, MeterMode, ToolbarState } from "./multimeter.types";

type Props = {
  states: Record<MeterMode, ChannelState>;
  computed: ComputedState;
  toolbar: ToolbarState;
};

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const n = Number.parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const MeterComputed = memo(function MeterComputed({ states, computed, toolbar }: Props) {
  const rows = useMemo(() => {
    const list = [
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
        sub: "R = V / I",
        value: computed.impedance > 100000 ? "∞ Ω" : computed.impedance >= 1000 ? `${(computed.impedance / 1000).toFixed(1)} kΩ` : `${computed.impedance.toFixed(1)} Ω`,
        color: "#22d3ee",
      },
      { icon: "↑", label: "PEAK V", sub: "MAX RECORDED", value: `${computed.peakVoltage.toFixed(1)} V`, color: "#ff8c21", show: toolbar.peak },
      { icon: "↑", label: "PEAK A", sub: "MAX RECORDED", value: `${computed.peakCurrent.toFixed(2)} A`, color: "#ff3b3b", show: toolbar.peak },
    ];

    return list.filter((r) => r.show !== false);
  }, [computed, states.voltage.zone.color, toolbar.peak]);

  return (
    <div className="flex h-full flex-col rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.25)" }}>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/30">COMPUTED</span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[7px] text-emerald-400/40">SYNC</span>
          </span>
        </div>
        {toolbar.hold ? <span className="animate-pulse font-mono text-[7px] font-bold text-orange-400/60">FROZEN</span> : null}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-1 items-center justify-between rounded-lg px-2.5 py-1 transition-colors hover:bg-white/[0.015]" style={{ border: `1px solid ${withAlpha(r.color, 0.1)}`, transition: "border-color 0.8s" }}>
            <div className="flex items-center gap-2">
              <span className="w-3 text-center font-mono text-[10px]" style={{ color: r.color, opacity: 0.5 }}>
                {r.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] font-bold tracking-wider text-white/30">{r.label}</span>
                <span className="font-mono text-[6px] text-white/15">{r.sub}</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-medium tabular-nums" style={{ color: r.color, textShadow: `0 0 8px ${withAlpha(r.color, 0.18)}`, transition: "color 0.8s" }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
