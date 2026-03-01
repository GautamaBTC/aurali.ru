import type { ChannelConfig, DemoScenario, MeterZone, SegmentMap } from "./multimeter.types";

const V_ZONES: readonly MeterZone[] = [
  { min: 0, max: 8, color: "#ff3b3b", label: "CRIT", labelRu: "КРИТИЧНО" },
  { min: 8, max: 11.5, color: "#ff8c21", label: "LOW", labelRu: "НИЗКОЕ" },
  { min: 11.5, max: 12.4, color: "#ffd43b", label: "FAIR", labelRu: "ДОПУСТИМО" },
  { min: 12.4, max: 14.8, color: "#00e676", label: "OK", labelRu: "НОРМА" },
  { min: 14.8, max: 16, color: "#ffd43b", label: "HIGH", labelRu: "ПОВЫШЕНО" },
  { min: 16, max: 20, color: "#ff8c21", label: "WARN", labelRu: "ВЫСОКОЕ" },
  { min: 20, max: 60, color: "#ff3b3b", label: "DANG", labelRu: "ОПАСНО" },
];

const A_ZONES: readonly MeterZone[] = [
  { min: 0, max: 0.5, color: "#475569", label: "IDLE", labelRu: "ПОКОЙ" },
  { min: 0.5, max: 5, color: "#00e676", label: "OK", labelRu: "НОРМА" },
  { min: 5, max: 15, color: "#ffd43b", label: "LOAD", labelRu: "НАГРУЗКА" },
  { min: 15, max: 40, color: "#ff8c21", label: "HIGH", labelRu: "ВЫСОКИЙ" },
  { min: 40, max: 200, color: "#ff3b3b", label: "CRIT", labelRu: "КРИТИЧНО" },
];

const R_ZONES: readonly MeterZone[] = [
  { min: 0, max: 1, color: "#00e676", label: "SHORT", labelRu: "КЗ" },
  { min: 1, max: 100, color: "#22d3ee", label: "LOW", labelRu: "НИЗКОЕ" },
  { min: 100, max: 10000, color: "#818cf8", label: "MED", labelRu: "СРЕДНЕЕ" },
  { min: 10000, max: 100000, color: "#ffd43b", label: "HIGH", labelRu: "ВЫСОКОЕ" },
  { min: 100000, max: 999999, color: "#ff8c21", label: "OPEN", labelRu: "ОБРЫВ" },
];

function fmtR(v: number): string {
  if (v >= 1e6) return (v / 1e6).toFixed(2);
  if (v >= 1e3) return (v / 1e3).toFixed(2);
  if (v >= 1) return v.toFixed(1);
  return v.toFixed(3);
}

function fmtRUnit(v: number): string {
  if (v >= 1e6) return "MΩ";
  if (v >= 1e3) return "kΩ";
  return "Ω";
}

function fmtRCompact(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  return v.toFixed(0);
}

export const CHANNELS: Record<string, ChannelConfig> = {
  voltage: {
    mode: "voltage",
    label: "VOLTAGE",
    shortLabel: "VDC",
    icon: "⚡",
    min: 0,
    max: 60,
    bargraphMax: 32,
    bargraphSegments: 32,
    zones: V_ZONES,
    format: (v) => v.toFixed(1),
    formatUnit: () => "V",
    formatCompact: (v) => v.toFixed(1),
  },
  current: {
    mode: "current",
    label: "CURRENT",
    shortLabel: "ADC",
    icon: "~",
    min: 0,
    max: 200,
    bargraphMax: 50,
    bargraphSegments: 32,
    zones: A_ZONES,
    format: (v) => v.toFixed(2),
    formatUnit: () => "A",
    formatCompact: (v) => v.toFixed(1),
  },
  resistance: {
    mode: "resistance",
    label: "RESISTANCE",
    shortLabel: "OHM",
    icon: "Ω",
    min: 0,
    max: 999999,
    bargraphMax: 999999,
    bargraphSegments: 32,
    zones: R_ZONES,
    format: fmtR,
    formatUnit: fmtRUnit,
    formatCompact: fmtRCompact,
  },
};

export function getBargraphRatio(v: number, cfg: ChannelConfig): number {
  if (cfg.mode === "resistance") {
    if (v <= 0) return 0;
    return Math.max(0, Math.min(1, Math.log10(Math.max(1, v)) / Math.log10(999999)));
  }
  return Math.max(0, Math.min(1, v / cfg.bargraphMax));
}

export function getZone(cfg: ChannelConfig, v: number): MeterZone {
  const c = Math.max(cfg.min, Math.min(cfg.max, v));
  return cfg.zones.find((z) => c >= z.min && c < z.max) ?? cfg.zones[cfg.zones.length - 1]!;
}

export function getSegmentColor(index: number, total: number): string {
  const ratio = index / total;
  if (ratio <= 0.55) return "#00e676";
  if (ratio <= 0.75) return "#ffd43b";
  if (ratio <= 0.88) return "#ff8c21";
  return "#ff3b3b";
}

export const SEGMENTS: SegmentMap = {
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  "2": [true, true, false, true, true, false, true],
  "3": [true, true, true, true, false, false, true],
  "4": [false, true, true, false, false, true, true],
  "5": [true, false, true, true, false, true, true],
  "6": [true, false, true, true, true, true, true],
  "7": [true, true, true, false, false, false, false],
  "8": [true, true, true, true, true, true, true],
  "9": [true, true, true, true, false, true, true],
  "-": [false, false, false, false, false, false, true],
  " ": [false, false, false, false, false, false, false],
  L: [false, false, false, true, true, true, false],
  O: [true, true, true, true, true, true, false],
};

export const SCENARIOS: readonly DemoScenario[] = [
  { label: "Двигатель заглушен", voltage: 12.6, current: 0.35, resistance: 36000, frequency: 0, vpp: 0.05 },
  { label: "Стартер крутит", voltage: 10.2, current: 125, resistance: 82, frequency: 12, vpp: 3.8 },
  { label: "Холостой ход", voltage: 14.1, current: 3.5, resistance: 4028, frequency: 55, vpp: 0.4 },
  { label: "Фары + печка", voltage: 13.8, current: 12.4, resistance: 1113, frequency: 58, vpp: 0.8 },
  { label: "Всё включено", voltage: 13.4, current: 28.6, resistance: 468, frequency: 62, vpp: 1.2 },
  { label: "Генератор слабый", voltage: 12.2, current: 6.8, resistance: 1794, frequency: 42, vpp: 2.1 },
  { label: "Зарядка", voltage: 14.7, current: 8.2, resistance: 1793, frequency: 68, vpp: 0.3 },
  { label: "Батарея разряжена", voltage: 11.4, current: 0.9, resistance: 12667, frequency: 48, vpp: 1.5 },
  { label: "КЗ предохранитель", voltage: 2.1, current: 42, resistance: 50, frequency: 0, vpp: 0.02 },
  { label: "Обрыв цепи", voltage: 14.4, current: 0.001, resistance: 850000, frequency: 60, vpp: 0.1 },
  { label: "Нормальный режим", voltage: 14.2, current: 5.6, resistance: 2536, frequency: 56, vpp: 0.5 },
  { label: "Подогрев сидений", voltage: 13.9, current: 9.8, resistance: 1418, frequency: 58, vpp: 0.7 },
];

export const HISTORY_MAX = 50;
