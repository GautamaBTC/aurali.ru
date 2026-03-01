export type MeterMode = "voltage" | "current" | "resistance";

export interface MeterZone {
  readonly min: number;
  readonly max: number;
  readonly color: string;
  readonly label: string;
}

export interface ChannelConfig {
  readonly mode: MeterMode;
  readonly label: string;
  readonly shortLabel: string;
  readonly icon: string;
  readonly unit: string;
  readonly min: number;
  readonly max: number;
  readonly bargraphMax: number;
  readonly bargraphSegments: number;
  readonly zones: readonly MeterZone[];
  readonly format: (v: number) => string;
  readonly formatUnit: (v: number) => string;
}

export interface ChannelState {
  value: number;
  displayValue: string;
  displayUnit: string;
  zone: MeterZone;
  history: number[];
  min: number;
  max: number;
  avg: number;
  bargraphRatio: number;
}

export interface ComputedState {
  power: number;
  energy: number;
  frequency: number;
  vpp: number;
  duty: number;
}

export interface DemoScenario {
  readonly label: string;
  readonly voltage: number;
  readonly current: number;
  readonly resistance: number;
}

export interface MultimeterProps {
  voltage?: number;
  current?: number;
  resistance?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  className?: string;
}
