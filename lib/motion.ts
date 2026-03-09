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

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
