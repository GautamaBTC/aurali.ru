"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  intensity?: number;
}

export default function ParallaxBackground({ intensity = 1 }: Props) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden"
      style={{ opacity: Math.min(1, Math.max(0.35, intensity)) }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(0,240,255,0.08)_0%,transparent_45%),radial-gradient(circle_at_82%_0%,rgba(204,255,0,0.07)_0%,transparent_36%),#09090b]" />
    </div>
  );
}

