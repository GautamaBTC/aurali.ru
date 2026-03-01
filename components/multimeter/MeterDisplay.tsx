"use client";

import { memo } from "react";
import { MeterLcd } from "./MeterLcd";
import { MeterBargraph } from "./MeterBargraph";
import type { ChannelConfig, ChannelState, MeterMode } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";

type Props = {
  config: ChannelConfig;
  state: ChannelState;
  setRef: (m: MeterMode, k: keyof ChannelRefs, el: HTMLElement | null, idx?: number) => void;
};

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const n = Number.parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const MeterDisplay = memo(function MeterDisplay({ config, state, setRef }: Props) {
  const { zone, displayValue, displayUnit, overload } = state;

  return (
    <div className="flex flex-1 flex-col gap-2.5 rounded-xl p-3 transition-colors hover:bg-white/[0.015]" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded text-[9px]"
            style={{
              backgroundColor: withAlpha(zone.color, 0.12),
              color: zone.color,
              border: `1px solid ${withAlpha(zone.color, 0.25)}`,
              boxShadow: `0 0 10px ${withAlpha(zone.color, 0.1)}`,
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {config.icon}
          </span>
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/35">{config.shortLabel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {overload ? <span className="animate-pulse font-mono text-[8px] font-bold text-red-500" style={{ textShadow: "0 0 6px rgba(255,59,59,0.5)" }}>OL</span> : null}
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-wider"
            style={{
              backgroundColor: withAlpha(zone.color, 0.12),
              color: zone.color,
              border: `1px solid ${withAlpha(zone.color, 0.2)}`,
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {zone.labelRu}
          </span>
        </div>
      </div>

      <MeterLcd initialValue={displayValue} initialUnit={displayUnit} color={zone.color} overload={overload} mode={config.mode} setRef={setRef} />

      <MeterBargraph segments={config.bargraphSegments} mode={config.mode} setRef={setRef} />

      <div className="flex items-center justify-between px-0.5">
        {[
          { label: "MIN", value: config.formatCompact(state.min), color: "#22d3ee" },
          { label: "MAX", value: config.formatCompact(state.max), color: "#ff8c21" },
          { label: "AVG", value: config.formatCompact(state.avg), color: "#818cf8" },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-1">
            <span className="font-mono text-[6px] font-bold tracking-wider" style={{ color: r.color, opacity: 0.4 }}>
              {r.label}
            </span>
            <span className="font-mono text-[8px] tabular-nums text-white/40">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
