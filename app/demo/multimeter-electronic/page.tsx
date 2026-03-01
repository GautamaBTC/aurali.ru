"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MultimeterElectronic = dynamic(() => import("@/components/multimeter-electronic/Multimeter"), { ssr: false });

const PRESETS = [
  { label: "Engine Off", v: 12.6, a: 0.35, r: 36000 },
  { label: "Starter", v: 10.2, a: 85, r: 120 },
  { label: "Idle", v: 14.1, a: 3.5, r: 4028 },
  { label: "Full Load", v: 13.4, a: 28.6, r: 468 },
  { label: "Open Circuit", v: 14.4, a: 0.001, r: 850000 },
  { label: "Short Circuit", v: 2.1, a: 42, r: 50 },
] as const;

export default function DemoElectronicPage() {
  const [v, setV] = useState(14.2);
  const [a, setA] = useState(5.6);
  const [r, setR] = useState(2536);

  return (
    <div className="min-h-dvh bg-[#06060a] py-10">
      <MultimeterElectronic voltage={v} current={a} resistance={r} autoAnimate={false} />

      <div className="mx-auto mt-6 max-w-lg space-y-4 px-4">
        {[
          { label: "Voltage", val: v, set: setV, min: 0, max: 30, step: 0.1, unit: "V" },
          { label: "Current", val: a, set: setA, min: 0, max: 100, step: 0.1, unit: "A" },
          { label: "Resistance", val: r, set: setR, min: 0, max: 999999, step: 10, unit: "Ω" },
        ].map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-[11px] text-white/25">
              <span>{item.label}</span>
              <span className="font-mono">
                {item.val} {item.unit}
              </span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={item.val}
              onChange={(e) => item.set(Number(e.target.value))}
              className="h-1 w-full appearance-none bg-transparent
                [&::-webkit-slider-runnable-track]:h-[2px]
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-runnable-track]:bg-white/10
                [&::-webkit-slider-thumb]:-mt-[7px]
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white/60"
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setV(preset.v);
                setA(preset.a);
                setR(preset.r);
              }}
              className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] text-white/30 transition-all hover:bg-white/5 hover:text-white/50"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
