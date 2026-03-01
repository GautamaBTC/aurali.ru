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
    <div className="flex items-end gap-[2px]">
      <span className="mr-1 self-center font-mono text-[6px] text-white/10">L</span>
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          ref={(el) => setRef(mode, "barEls", el, i)}
          className="rounded-[1px]"
          style={{ width: "clamp(3px, 0.8vw, 6px)", height: 10, backgroundColor: "rgba(255,255,255,0.03)", transition: "background-color 0.06s linear, box-shadow 0.06s linear" }}
        />
      ))}
      <span className="ml-1 self-center font-mono text-[6px] text-white/10">H</span>
    </div>
  );
});

