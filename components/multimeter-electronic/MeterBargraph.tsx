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
    <div className="flex w-full gap-[2px]">
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          ref={(el) => setRef(mode, "barEls", el, i)}
          className="h-3 flex-1 rounded-[1px]"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", transition: "background-color 0.08s ease", minWidth: 2 }}
        />
      ))}
    </div>
  );
});
