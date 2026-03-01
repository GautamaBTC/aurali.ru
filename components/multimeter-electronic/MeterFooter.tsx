"use client";

import { memo } from "react";

export const MeterFooter = memo(function MeterFooter() {
  const terminals = [
    { color: "#ef4444", label: "V/Ω", glow: "#ef444440" },
    { color: "#000000", label: "COM", glow: "#ffffff10", ring: "#ffffff20" },
    { color: "#eab308", label: "mA", glow: "#eab30840" },
    { color: "#ff8c21", label: "10A", glow: "#ff8c2140" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
      <div className="flex items-center gap-4">
        {terminals.map((terminal) => (
          <div key={terminal.label} className="flex items-center gap-1.5">
            <div className="relative">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                  backgroundColor: terminal.color,
                  border: `1.5px solid ${terminal.ring ?? terminal.color}`,
                  boxShadow: `0 0 6px ${terminal.glow}, inset 0 1px 2px rgba(255,255,255,0.15)`,
                }}
              >
                <span className="h-1 w-1 rounded-full bg-black/30" />
              </span>
            </div>
            <span className="font-mono text-[8px] font-medium tracking-wider text-white/20">{terminal.label}</span>
          </div>
        ))}

        <div className="hidden items-center gap-1 sm:flex">
          <div className="h-px w-6 bg-red-500/20" />
          <div className="h-px w-6 bg-white/5" />
          <span className="font-mono text-[7px] text-white/10">PROBES</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded border border-white/5 px-2 py-0.5">
          <span className="font-mono text-[7px] text-white/15">RANGE</span>
          <span className="font-mono text-[8px] font-bold text-emerald-400/40">AUTO</span>
        </div>
        <span className="font-mono text-[8px] text-white/10">v3.0.1</span>
      </div>
    </div>
  );
});
