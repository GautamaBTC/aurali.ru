import type { ChannelConfig, DemoScenario, MeterZone } from "./multimeter.types";

const V_ZONES: readonly MeterZone[] = [
  { min: 0, max: 8, color: "#ff3b3b", label: "CRIT" },
  { min: 8, max: 11.5, color: "#ff8c21", label: "LOW" },
  { min: 11.5, max: 12.4, color: "#ffd43b", label: "FAIR" },
  { min: 12.4, max: 14.8, color: "#00e676", label: "OK" },
  { min: 14.8, max: 16, color: "#ffd43b", label: "HIGH" },
  { min: 16, max: 20, color: "#ff8c21", label: "WARN" },
  { min: 20, max: 60, color: "#ff3b3b", label: "DANG" },
];

const A_ZONES: readonly MeterZone[] = [
  { min: 0, max: 0.5, color: "#475569", label: "IDLE" },
  { min: 0.5, max: 5, color: "#00e676", label: "OK" },
  { min: 5, max: 15, color: "#ffd43b", label: "LOAD" },
  { min: 15, max: 40, color: "#ff8c21", label: "HIGH" },
  { min: 40, max: 100, color: "#ff3b3b", label: "CRIT" },
];

const R_ZONES: readonly MeterZone[] = [
  { min: 0, max: 1, color: "#00e676", label: "SHORT" },
  { min: 1, max: 100, color: "#22d3ee", label: "LOW" },
  { min: 100, max: 10000, color: "#818cf8", label: "MED" },
  { min: 10000, max: 100000, color: "#ffd43b", label: "HIGH" },
  { min: 100000, max: 999999, color: "#ff8c21", label: "OPEN" },
];

function fmtR(v: number): string {
  if (v >= 1e6) return (v / 1e6).toFixed(2);
  if (v >= 1e3) return (v / 1e3).toFixed(2);
  if (v >= 1) return v.toFixed(1);
  return v.toFixed(3);
}

function fmtRU(v: number): string {
  if (v >= 1e6) return "MΩ";
  if (v >= 1e3) return "kΩ";
  return "Ω";
}

function bargraphR(v: number): number {
  if (v <= 0) return 0;
  const logMin = 0;
  const logMax = Math.log10(999999);
  return Math.max(0, Math.min(1, (Math.log10(Math.max(1, v)) - logMin) / (logMax - logMin)));
}

export const CHANNELS: Record<string, ChannelConfig> = {
  voltage: {
    mode: "voltage",
    label: "VOLTAGE",
    shortLabel: "VDC",
    icon: "⚡",
    unit: "V",
    min: 0,
    max: 60,
    bargraphMax: 32,
    bargraphSegments: 40,
    zones: V_ZONES,
    format: (v) => v.toFixed(1),
    formatUnit: () => "V",
  },
  current: {
    mode: "current",
    label: "CURRENT",
    shortLabel: "ADC",
    icon: "~",
    unit: "A",
    min: 0,
    max: 100,
    bargraphMax: 50,
    bargraphSegments: 40,
    zones: A_ZONES,
    format: (v) => v.toFixed(2),
    formatUnit: () => "A",
  },
  resistance: {
    mode: "resistance",
    label: "RESISTANCE",
    shortLabel: "OHM",
    icon: "Ω",
    unit: "Ω",
    min: 0,
    max: 999999,
    bargraphMax: 999999,
    bargraphSegments: 40,
    zones: R_ZONES,
    format: fmtR,
    formatUnit: fmtRU,
  },
} as const;

export function getBargraphRatio(v: number, cfg: ChannelConfig): number {
  if (cfg.mode === "resistance") return bargraphR(v);
  return Math.max(0, Math.min(1, v / cfg.bargraphMax));
}

export function getZone(cfg: ChannelConfig, v: number): MeterZone {
  const c = Math.max(cfg.min, Math.min(cfg.max, v));
  return cfg.zones.find((z) => c >= z.min && c < z.max) ?? cfg.zones[cfg.zones.length - 1]!;
}

export const SCENARIOS: readonly DemoScenario[] = [
  { label: "Engine Off", voltage: 12.6, current: 0.35, resistance: 36000 },
  { label: "Starter Crank", voltage: 10.2, current: 85, resistance: 120 },
  { label: "Idle", voltage: 14.1, current: 3.5, resistance: 4028 },
  { label: "Lights + Heater", voltage: 13.8, current: 12.4, resistance: 1113 },
  { label: "Full Load", voltage: 13.4, current: 28.6, resistance: 468 },
  { label: "Weak Alternator", voltage: 12.2, current: 6.8, resistance: 1794 },
  { label: "Battery Charging", voltage: 14.7, current: 8.2, resistance: 1793 },
  { label: "Battery Low", voltage: 11.4, current: 0.9, resistance: 12667 },
  { label: "Short Circuit", voltage: 2.1, current: 42, resistance: 50 },
  { label: "Open Circuit", voltage: 14.4, current: 0.001, resistance: 850000 },
  { label: "Normal", voltage: 14.2, current: 5.6, resistance: 2536 },
  { label: "Seat Heating", voltage: 13.9, current: 9.8, resistance: 1418 },
] as const;

export const HISTORY_MAX = 60;
