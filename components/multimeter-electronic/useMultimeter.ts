"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ChannelState, ComputedState, MeterMode } from "./multimeter.types";
import { CHANNELS, getBargraphRatio, getZone, HISTORY_MAX, SCENARIOS } from "./multimeter.constants";

export interface ChannelRefs {
  valueEl: HTMLSpanElement | null;
  unitEl: HTMLSpanElement | null;
  minEl: HTMLSpanElement | null;
  maxEl: HTMLSpanElement | null;
  avgEl: HTMLSpanElement | null;
  barEls: HTMLSpanElement[];
}

function initChannel(mode: MeterMode, v: number): ChannelState {
  const cfg = CHANNELS[mode];
  return {
    value: v,
    displayValue: cfg.format(v),
    displayUnit: cfg.formatUnit(v),
    zone: getZone(cfg, v),
    history: [v],
    min: v,
    max: v,
    avg: v,
    bargraphRatio: getBargraphRatio(v, cfg),
  };
}

type UseMultimeterArgs = {
  voltage?: number;
  current?: number;
  resistance?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
};

export function useMultimeter({
  voltage: extV,
  current: extA,
  resistance: extR,
  autoAnimate = true,
  animationInterval = 3200,
}: UseMultimeterArgs) {
  const refsMap = useRef<Record<MeterMode, ChannelRefs>>({
    voltage: { valueEl: null, unitEl: null, minEl: null, maxEl: null, avgEl: null, barEls: [] },
    current: { valueEl: null, unitEl: null, minEl: null, maxEl: null, avgEl: null, barEls: [] },
    resistance: { valueEl: null, unitEl: null, minEl: null, maxEl: null, avgEl: null, barEls: [] },
  });

  const tweens = useRef<Record<MeterMode, gsap.core.Tween | null>>({ voltage: null, current: null, resistance: null });
  const prevs = useRef<Record<MeterMode, number>>({ voltage: extV ?? 0, current: extA ?? 0, resistance: extR ?? 0 });
  const scenIdx = useRef(0);

  const [states, setStates] = useState<Record<MeterMode, ChannelState>>({
    voltage: initChannel("voltage", extV ?? 0),
    current: initChannel("current", extA ?? 0),
    resistance: initChannel("resistance", extR ?? 0),
  });

  const [computed, setComputed] = useState<ComputedState>({
    power: 0,
    energy: 0,
    frequency: 50,
    vpp: 0.8,
    duty: 50,
  });

  const [scenarioLabel, setScenarioLabel] = useState("");

  const animateChannel = useCallback((mode: MeterMode, target: number) => {
    const cfg = CHANNELS[mode];
    const refs = refsMap.current[mode];
    const prev = prevs.current[mode];

    tweens.current[mode]?.kill();
    const proxy = { v: prev };

    tweens.current[mode] = gsap.to(proxy, {
      v: target,
      duration: 1.6,
      ease: "power3.out",
      onUpdate() {
        if (refs.valueEl) refs.valueEl.textContent = cfg.format(proxy.v);
        if (refs.unitEl) refs.unitEl.textContent = cfg.formatUnit(proxy.v);

        const ratio = getBargraphRatio(proxy.v, cfg);
        const activeCount = Math.round(ratio * cfg.bargraphSegments);
        const zone = getZone(cfg, proxy.v);

        refs.barEls.forEach((el, i) => {
          if (!el) return;
          const isActive = i < activeCount;
          const segRatio = i / cfg.bargraphSegments;
          let segColor = zone.color;
          if (segRatio > 0.85) segColor = "#ff3b3b";
          else if (segRatio > 0.7) segColor = "#ff8c21";
          el.style.backgroundColor = isActive ? segColor : "rgba(255,255,255,0.04)";
          el.style.boxShadow = isActive ? `0 0 4px ${segColor}66` : "none";
        });
      },
      onComplete() {
        prevs.current[mode] = target;
        setStates((s) => {
          const history = [...s[mode].history, target].slice(-HISTORY_MAX);
          const min = Math.min(s[mode].min, target);
          const max = Math.max(s[mode].max, target);
          const avg = history.reduce((a, b) => a + b, 0) / history.length;
          return {
            ...s,
            [mode]: {
              value: target,
              displayValue: cfg.format(target),
              displayUnit: cfg.formatUnit(target),
              zone: getZone(cfg, target),
              history,
              min,
              max,
              avg,
              bargraphRatio: getBargraphRatio(target, cfg),
            },
          };
        });
      },
    });
  }, []);

  const animateScenario = useCallback(
    (v: number, a: number, r: number, label?: string) => {
      animateChannel("voltage", v);
      animateChannel("current", a);
      animateChannel("resistance", r);
      if (label) setScenarioLabel(label);

      const power = v * a;
      const freq = 50 + (Math.random() - 0.5) * 15;
      const vpp = 0.3 + Math.random() * 2.5;
      const duty = 40 + Math.random() * 20;

      setComputed((prev) => ({
        power,
        energy: prev.energy + power * (animationInterval / 3_600_000),
        frequency: +freq.toFixed(1),
        vpp: +vpp.toFixed(2),
        duty: +duty.toFixed(1),
      }));
    },
    [animateChannel, animationInterval],
  );

  useEffect(() => {
    if (extV !== undefined && extA !== undefined && extR !== undefined) {
      const frame = window.requestAnimationFrame(() => {
        animateScenario(extV, extA, extR);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    return undefined;
  }, [extV, extA, extR, animateScenario]);

  useEffect(() => {
    if (!autoAnimate) return;

    const s = SCENARIOS[0]!;
    const initialFrame = window.requestAnimationFrame(() => {
      animateScenario(s.voltage, s.current, s.resistance, s.label);
    });

    const id = window.setInterval(() => {
      scenIdx.current = (scenIdx.current + 1) % SCENARIOS.length;
      const sc = SCENARIOS[scenIdx.current]!;
      const jV = sc.voltage + (Math.random() - 0.5) * 0.4;
      const jA = sc.current + (Math.random() - 0.5) * sc.current * 0.05;
      const jR = sc.resistance + (Math.random() - 0.5) * sc.resistance * 0.03;
      animateScenario(jV, jA, jR, sc.label);
    }, animationInterval);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.clearInterval(id);
    };
  }, [autoAnimate, animationInterval, animateScenario]);

  useEffect(() => {
    const active = tweens.current;
    return () => {
      Object.values(active).forEach((t) => t?.kill());
    };
  }, []);

  const setRef = useCallback(
    (mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | null, index?: number) => {
      if (key === "barEls" && typeof index === "number" && el) {
        refsMap.current[mode].barEls[index] = el as HTMLSpanElement;
        return;
      }

      switch (key) {
        case "valueEl":
        case "unitEl":
        case "minEl":
        case "maxEl":
        case "avgEl":
          refsMap.current[mode][key] = el as HTMLSpanElement | null;
          break;
        default:
          break;
      }
    },
    [],
  );

  return { states, computed, scenarioLabel, setRef };
}
