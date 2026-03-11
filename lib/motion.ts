const FORCE_MOTION_VALUES = new Set(["1", "true", "on"]);
const FORCE_REDUCED_VALUES = new Set(["0", "false", "off"]);

export type MotionOverride = "force-motion" | "force-reduced" | null;

export function resolveMotionOverride(search: string): MotionOverride {
  const params = new URLSearchParams(search);
  const raw = params.get("debug-motion")?.trim().toLowerCase();
  if (!raw) return null;
  if (FORCE_MOTION_VALUES.has(raw)) return "force-motion";
  if (FORCE_REDUCED_VALUES.has(raw)) return "force-reduced";
  return null;
}

export function shouldReduceMotionInBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const override = resolveMotionOverride(window.location.search);
  if (override === "force-motion") return false;
  if (override === "force-reduced") return true;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) return false;

  // Keep mobile experience animated by default.
  const mobileViewport = window.matchMedia("(max-width: 1024px)").matches;
  if (mobileViewport) return false;

  return true;
}
