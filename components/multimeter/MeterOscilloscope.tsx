"use client";

import { memo, useCallback } from "react";
import { useOscilloscope } from "./useOscilloscope";
import type { ChannelState, ComputedState } from "./multimeter.types";

type Props = {
  voltageState: ChannelState;
  currentState: ChannelState;
  computed: ComputedState;
  isActive: boolean;
};

export const MeterOscilloscope = memo(function MeterOscilloscope({ voltageState, currentState, computed, isActive }: Props) {
  const canvasRef = useOscilloscope({
    getVoltage: useCallback(() => voltageState.value, [voltageState.value]),
    getCurrent: useCallback(() => currentState.value, [currentState.value]),
    getColor: useCallback(() => voltageState.zone.color, [voltageState.zone.color]),
    getFrequency: useCallback(() => computed.frequency, [computed.frequency]),
    getVpp: useCallback(() => computed.vpp, [computed.vpp]),
    isActive,
  });

  const channels = [
    { label: "CH1", tag: "VDC", value: `${voltageState.displayValue}${voltageState.displayUnit}`, color: voltageState.zone.color },
    { label: "CH2", tag: "ADC", value: `${currentState.displayValue}${currentState.displayUnit}`, color: "#22d3ee" },
  ];

  const params = [
    { label: "FREQ", value: `${computed.frequency}Hz` },
    { label: "Vpp", value: `${computed.vpp}V` },
    { label: "DUTY", value: `${computed.duty}%` },
    { label: "T/DIV", value: "5ms" },
    { label: "V/DIV", value: "2V" },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.4)" }}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/30">OSCILLOSCOPE</span>
          {channels.map((c) => (
            <div key={c.label} className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: c.color, boxShadow: `0 0 4px ${c.color}60` }} />
              <span className="font-mono text-[7px] text-white/30">{c.label}</span>
              <span className="font-mono text-[6px] text-white/15">{c.tag}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {params.map((p) => (
            <div key={p.label} className="flex items-center gap-0.5">
              <span className="font-mono text-[6px] tracking-wider text-white/20">{p.label}</span>
              <span className="font-mono text-[7px] tabular-nums text-emerald-400/50">{p.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="h-full w-full" style={{ minHeight: "clamp(120px, 20vw, 260px)" }} aria-label="Осциллограф" />

        <div className="pointer-events-none absolute bottom-2 left-2 flex flex-col gap-0.5">
          {channels.map((c) => (
            <div key={c.label} className="flex items-center gap-1.5">
              <span className="font-mono text-[7px]" style={{ color: c.color, opacity: 0.4 }}>
                {c.label}
              </span>
              <span className="font-mono text-[9px] font-bold tabular-nums" style={{ color: c.color, opacity: 0.5, textShadow: `0 0 8px ${c.color}25` }}>
                {c.value}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.25) 100%)" }} aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.7) 1px, rgba(0,0,0,0.7) 2px)" }} aria-hidden />
      </div>
    </div>
  );
});
