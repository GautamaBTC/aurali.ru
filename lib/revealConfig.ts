export const REVEAL_CONFIG = {
  defaultEase: "power3.out",
  defaultDuration: 0.6,
  defaultThreshold: 0.15,
  mobileQuery: "(max-width: 767px)",
  mobileDurationMultiplier: 0.86,
  mobileTransformMultiplier: 0.68,
  mobileMaxTranslate: 120,
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function adaptRevealVarsForMobile(vars: Record<string, unknown>): Record<string, unknown> {
  const next = { ...vars };

  if (typeof next.x === "number") {
    const scaled = next.x * REVEAL_CONFIG.mobileTransformMultiplier;
    next.x = clamp(scaled, -REVEAL_CONFIG.mobileMaxTranslate, REVEAL_CONFIG.mobileMaxTranslate);
  }

  if (typeof next.y === "number") {
    const scaled = next.y * REVEAL_CONFIG.mobileTransformMultiplier;
    next.y = clamp(scaled, -REVEAL_CONFIG.mobileMaxTranslate, REVEAL_CONFIG.mobileMaxTranslate);
  }

  return next;
}

