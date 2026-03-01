"use client";

import { memo } from "react";
import { MeterBargraph } from "./MeterBargraph";
import { MeterLcd } from "./MeterLcd";
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
    <div className="flex flex-col gap-2 rounded-xl p-3 transition-colors hover:bg-white/[0.01]" style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded text-[9px]"
            style={{
              backgroundColor: withAlpha(zone.color, 0.1),
              color: zone.color,
              border: `1px solid ${withAlpha(zone.color, 0.2)}`,
              boxShadow: `0 0 8px ${withAlpha(zone.color, 0.1)}`,
              transition: "all 0.6s ease",
            }}
          >
            {config.icon}
          </span>
          <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-white/15">{config.shortLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          {overload ? <span className="animate-pulse font-mono text-[8px] font-bold text-red-500">OL</span> : null}
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[7px] font-bold tracking-wider"
            style={{
              backgroundColor: withAlpha(zone.color, 0.1),
              color: zone.color,
              border: `1px solid ${withAlpha(zone.color, 0.15)}`,
              transition: "all 0.6s ease",
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
          { label: "MIN", value: config.formatCompact(state.min) },
          { label: "MAX", value: config.formatCompact(state.max) },
          { label: "AVG", value: config.formatCompact(state.avg) },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-1">
            <span className="font-mono text-[6px] font-bold tracking-wider text-white/10">{row.label}</span>
            <span className="font-mono text-[8px] tabular-nums text-white/25">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

