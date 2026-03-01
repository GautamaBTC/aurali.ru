"use client";

import { memo, useCallback } from "react";
import type { ChannelState, ComputedState } from "./multimeter.types";
import { useOscilloscope } from "./useOscilloscope";

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

  const overlayData = [
    { label: "CH1", value: `${voltageState.displayValue} ${voltageState.displayUnit}`, color: voltageState.zone.color },
    { label: "CH2", value: `${currentState.displayValue} ${currentState.displayUnit}`, color: "#22d3ee" },
  ];

  const scopeParams = [
    { label: "FREQ", value: `${computed.frequency}Hz` },
    { label: "Vpp", value: `${computed.vpp}V` },
    { label: "DUTY", value: `${computed.duty}%` },
    { label: "T/DIV", value: "5ms" },
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.4)" }}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[7px] font-bold tracking-[0.15em] text-white/20">SCOPE</span>
          {overlayData.map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className="h-[4px] w-[4px] rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 4px ${item.color}99` }} />
              <span className="font-mono text-[7px] text-white/20">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {scopeParams.map((p) => (
            <div key={p.label} className="flex items-center gap-1">
              <span className="font-mono text-[6px] tracking-wider text-white/12">{p.label}</span>
              <span className="font-mono text-[7px] tabular-nums text-emerald-400/30">{p.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="h-36 w-full sm:h-44 lg:h-52" aria-label="Осциллограф" />

        <div className="pointer-events-none absolute bottom-2 left-2 flex flex-col gap-0.5">
          {overlayData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="font-mono text-[7px]" style={{ color: item.color, opacity: 0.3 }}>
                {item.label}
              </span>
              <span className="font-mono text-[9px] font-bold tabular-nums" style={{ color: item.color, opacity: 0.4, textShadow: `0 0 6px ${item.color}33` }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)" }} aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.8) 1px, rgba(0,0,0,0.8) 2px)" }} aria-hidden />
      </div>
    </div>
  );
});
