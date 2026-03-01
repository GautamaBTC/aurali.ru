"use client";

import { memo } from "react";

import type { ChannelConfig, ChannelState, MeterMode } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";
import { MeterBargraph } from "./MeterBargraph";

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
  const { zone, displayValue, displayUnit } = state;

  return (
    <div className="flex flex-col gap-2 rounded-xl p-3 transition-colors hover:bg-white/[0.015]" style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded text-[10px]"
            style={{
              backgroundColor: withAlpha(zone.color, 0.1),
              color: zone.color,
              border: `1px solid ${withAlpha(zone.color, 0.2)}`,
              transition: "all 0.6s ease",
            }}
          >
            {config.icon}
          </span>
          <span className="font-mono text-[9px] tracking-[0.15em] text-white/20">{config.shortLabel}</span>
        </div>

        <span
          className="rounded-sm px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wider"
          style={{
            backgroundColor: withAlpha(zone.color, 0.12),
            color: zone.color,
            border: `1px solid ${withAlpha(zone.color, 0.18)}`,
            transition: "all 0.6s ease",
          }}
        >
          {zone.label}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span
          ref={(el) => setRef(config.mode, "valueEl", el)}
          className="font-mono tabular-nums leading-none tracking-tight"
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 300,
            color: zone.color,
            textShadow: `0 0 20px ${withAlpha(zone.color, 0.3)}, 0 0 40px ${withAlpha(zone.color, 0.1)}`,
            transition: "color 0.6s, text-shadow 0.6s",
          }}
        >
          {displayValue}
        </span>
        <span
          ref={(el) => setRef(config.mode, "unitEl", el)}
          className="font-mono leading-none"
          style={{
            fontSize: "clamp(0.65rem, 1.2vw, 0.9rem)",
            fontWeight: 500,
            color: zone.color,
            opacity: 0.5,
            transition: "color 0.6s",
          }}
        >
          {displayUnit}
        </span>
      </div>

      <MeterBargraph segments={config.bargraphSegments} mode={config.mode} setRef={setRef} />

      <div className="flex items-center gap-3">
        {[
          { label: "MIN", key: "minEl" as const, val: state.min },
          { label: "MAX", key: "maxEl" as const, val: state.max },
          { label: "AVG", key: "avgEl" as const, val: state.avg },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className="font-mono text-[7px] font-bold tracking-wider text-white/15">{item.label}</span>
            <span ref={(el) => setRef(config.mode, item.key, el)} className="font-mono text-[9px] tabular-nums text-white/30">
              {config.format(item.val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
