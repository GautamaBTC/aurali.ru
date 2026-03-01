"use client";

import { memo } from "react";
import type { MeterMode } from "./multimeter.types";
import type { ChannelRefs } from "./useMultimeter";

type Props = {
  segments: number;
  mode: MeterMode;
  setRef: (m: MeterMode, k: keyof ChannelRefs, el: HTMLElement | null, idx?: number) => void;
};

export const MeterBargraph = memo(function MeterBargraph({ segments, mode, setRef }: Props) {
  return (
    <div className="flex items-center gap-[1.5px]">
      <span className="mr-0.5 font-mono text-[7px] text-white/20">L</span>
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          ref={(el) => setRef(mode, "barEls", el, i)}
          className="rounded-[1px]"
          style={{ width: "clamp(3px, 0.7vw, 6px)", height: 12, backgroundColor: "rgba(255,255,255,0.04)", transition: "background-color 0.08s linear, box-shadow 0.08s linear" }}
        />
      ))}
      <span className="ml-0.5 font-mono text-[7px] text-white/20">H</span>
    </div>
  );
});
