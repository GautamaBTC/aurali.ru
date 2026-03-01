"use client";

import { memo, useCallback } from "react";

import type { ChannelState, ComputedState } from "./multimeter.types";
import { useOscilloscope } from "./useOscilloscope";

type Props = {
  voltageState: ChannelState;
  currentState: ChannelState;
  computed: ComputedState;
  reducedMotion: boolean;
};

export const MeterOscilloscope = memo(function MeterOscilloscope({ voltageState, currentState, computed, reducedMotion }: Props) {
  const getVoltage = useCallback(() => voltageState.value, [voltageState.value]);
  const getCurrent = useCallback(() => currentState.value, [currentState.value]);
  const getColor = useCallback(() => voltageState.zone.color, [voltageState.zone.color]);

  const canvasRef = useOscilloscope({ getVoltage, getCurrent, getColor, reducedMotion });

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.3)" }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/25">SCOPE</span>
          <div className="flex items-center gap-1">
            <span className="h-[3px] w-[3px] rounded-full" style={{ backgroundColor: voltageState.zone.color }} />
            <span className="font-mono text-[8px] text-white/20">CH1 VDC</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-[3px] w-[3px] rounded-full bg-cyan-400" />
            <span className="font-mono text-[8px] text-white/20">CH2 ADC</span>
          </div>
        </div>
        <span className="font-mono text-[8px] text-white/15">T: 5ms/div</span>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} className="h-40 w-full sm:h-48 md:h-56" aria-hidden />

        <div className="pointer-events-none absolute right-2 top-2 flex flex-col gap-1">
          {[
            { label: "Freq", value: `${computed.frequency} Hz` },
            { label: "Vpp", value: `${computed.vpp} V` },
            { label: "Duty", value: `${computed.duty}%` },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="font-mono text-[7px] tracking-wider text-white/25">{item.label}</span>
              <span className="font-mono text-[8px] tabular-nums text-emerald-400/40">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-2 left-2">
          <span className="font-mono text-[9px] font-bold tabular-nums" style={{ color: voltageState.zone.color, opacity: 0.4 }}>
            {voltageState.displayValue} {voltageState.displayUnit}
          </span>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.5) 1px, rgba(255,255,255,0.5) 2px)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
});
