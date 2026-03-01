"use client";

import { memo } from "react";

export const MeterFooter = memo(function MeterFooter() {
  const terminals: Array<{ bg: string; label: string; active: boolean; ring?: string }> = [
    { bg: "#ef4444", label: "V/Ω", active: true },
    { bg: "#111111", label: "COM", active: true, ring: "rgba(255,255,255,0.2)" },
    { bg: "#eab308", label: "mA", active: false },
    { bg: "#ff8c21", label: "10A", active: false },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
      <div className="flex items-center gap-4">
        {terminals.map((t) => (
          <div key={t.label} className="flex items-center gap-1.5">
            <div className="relative">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                  backgroundColor: t.bg,
                  border: `1.5px solid ${t.ring ?? t.bg}`,
                  boxShadow: t.active ? `0 0 6px ${t.bg}80, inset 0 1px 2px rgba(255,255,255,0.2)` : "inset 0 1px 2px rgba(255,255,255,0.05)",
                  opacity: t.active ? 1 : 0.3,
                }}
              >
                <span className="h-[3px] w-[3px] rounded-full bg-black/40" />
              </span>
              {t.active ? <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 4px rgba(34,197,94,0.6)" }} /> : null}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[7px] font-bold text-white/20">{t.label}</span>
              {t.active ? <span className="font-mono text-[5px] text-emerald-400/30">OK</span> : null}
            </div>
          </div>
        ))}

        <div className="hidden items-center gap-1.5 sm:flex">
          <div className="h-px w-5" style={{ background: "linear-gradient(90deg, #ef4444, transparent)" }} />
          <div className="h-px w-5" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
          <span className="font-mono text-[6px] text-white/8">PROBES CONNECTED</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded border border-white/[0.03] px-1.5 py-0.5">
          <span className="font-mono text-[6px] text-white/10">RANGE</span>
          <span className="font-mono text-[7px] font-bold text-emerald-400/30">AUTO 32V</span>
        </div>
        <div className="flex items-center gap-1 rounded border border-white/[0.03] px-1.5 py-0.5">
          <span className="font-mono text-[6px] text-white/10">RATE</span>
          <span className="font-mono text-[7px] font-bold text-emerald-400/30">FAST</span>
        </div>
        <span className="font-mono text-[7px] text-white/6">v3.1.0</span>
      </div>
    </div>
  );
});
