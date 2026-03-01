"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ChannelState, ComputedState, DemoScenario, MeterMode } from "./multimeter.types";
import { CHANNELS, getBargraphRatio, getSegmentColor, getZone, HISTORY_MAX, SCENARIOS } from "./multimeter.constants";

export interface ChannelRefs {
  barEls: Array<HTMLSpanElement | null>;
  lcdEl: HTMLDivElement | null;
}

function initChannel(mode: MeterMode, v: number): ChannelState {
  const cfg = CHANNELS[mode];
  const zone = getZone(cfg, v);
  return {
    value: v,
    displayValue: cfg.format(v),
    displayUnit: cfg.formatUnit(v),
    zone,
    history: [v],
    min: v,
    max: v,
    avg: v,
    bargraphRatio: getBargraphRatio(v, cfg),
    overload: mode === "current" ? v > 100 : mode === "resistance" ? v > 900000 : v > 50,
  };
}

type UseMultimeterArgs = {
  voltage?: number;
  current?: number;
  resistance?: number;
  autoAnimate?: boolean;
  animationInterval?: number;
  isActive?: boolean;
};

export function useMultimeter({
  voltage: extV,
  current: extA,
  resistance: extR,
  autoAnimate = true,
  animationInterval = 3200,
  isActive = true,
}: UseMultimeterArgs) {
  const refsMap = useRef<Record<MeterMode, ChannelRefs>>({
    voltage: { barEls: [], lcdEl: null },
    current: { barEls: [], lcdEl: null },
    resistance: { barEls: [], lcdEl: null },
  });

  const tweens = useRef<Record<MeterMode, gsap.core.Tween | null>>({ voltage: null, current: null, resistance: null });
  const prevs = useRef<Record<MeterMode, number>>({ voltage: extV ?? 0, current: extA ?? 0, resistance: extR ?? 0 });
  const scenIdx = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [states, setStates] = useState<Record<MeterMode, ChannelState>>({
    voltage: initChannel("voltage", extV ?? 0),
    current: initChannel("current", extA ?? 0),
    resistance: initChannel("resistance", extR ?? 0),
  });

  const [computed, setComputed] = useState<ComputedState>({
    power: 0,
    energy: 0,
    frequency: 50,
    vpp: 0.5,
    duty: 50,
    impedance: 0,
  });

  const [scenarioLabel, setScenarioLabel] = useState("");
  const [hold, setHold] = useState(false);

  const animateChannel = useCallback(
    (mode: MeterMode, target: number) => {
      if (hold) return;
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
          if (refs.lcdEl) {
            refs.lcdEl.dispatchEvent(
              new CustomEvent("lcdupdate", {
                detail: { value: cfg.format(proxy.v), unit: cfg.formatUnit(proxy.v) },
              }),
            );
          }

          const ratio = getBargraphRatio(proxy.v, cfg);
          const activeCount = Math.round(ratio * cfg.bargraphSegments);
          refs.barEls.forEach((el, i) => {
            if (!el) return;
            const isActiveSeg = i < activeCount;
            const segColor = getSegmentColor(i, cfg.bargraphSegments);
            el.style.backgroundColor = isActiveSeg ? segColor : "rgba(255,255,255,0.03)";
            el.style.boxShadow = isActiveSeg ? `0 0 4px ${segColor}80, 0 0 1px ${segColor}` : "none";
            el.style.opacity = "1";
          });
        },
        onComplete() {
          prevs.current[mode] = target;
          const zone = getZone(cfg, target);
          const overload = mode === "current" ? target > 100 : mode === "resistance" ? target > 900000 : target > 50;

          setStates((s) => {
            const h = [...s[mode].history, target].slice(-HISTORY_MAX);
            const min = h.length > 1 ? Math.min(...h) : target;
            const max = h.length > 1 ? Math.max(...h) : target;
            const avg = h.reduce((acc, n) => acc + n, 0) / h.length;
            return {
              ...s,
              [mode]: {
                value: target,
                displayValue: cfg.format(target),
                displayUnit: cfg.formatUnit(target),
                zone,
                history: h,
                min,
                max,
                avg,
                bargraphRatio: getBargraphRatio(target, cfg),
                overload,
              },
            };
          });
        },
      });
    },
    [hold],
  );

  const animateScenario = useCallback(
    (sc: DemoScenario) => {
      if (hold) return;
      const jitter = (v: number, pct: number) => v + (Math.random() - 0.5) * v * pct;

      const v = jitter(sc.voltage, 0.02);
      const a = jitter(sc.current, 0.05);
      const r = jitter(sc.resistance, 0.03);

      animateChannel("voltage", v);
      animateChannel("current", a);
      animateChannel("resistance", r);
      setScenarioLabel(sc.label);

      const p = v * a;
      setComputed((prev) => ({
        power: p,
        energy: prev.energy + p * (animationInterval / 3_600_000),
        frequency: +(sc.frequency + (Math.random() - 0.5) * 4).toFixed(1),
        vpp: +(sc.vpp + (Math.random() - 0.5) * sc.vpp * 0.2).toFixed(2),
        duty: +(48 + Math.random() * 4).toFixed(1),
        impedance: a > 0.001 ? v / a : 999999,
      }));
    },
    [animateChannel, hold, animationInterval],
  );

  useEffect(() => {
    if (extV === undefined) return;
    const id = requestAnimationFrame(() => animateChannel("voltage", extV));
    return () => cancelAnimationFrame(id);
  }, [extV, animateChannel]);

  useEffect(() => {
    if (extA === undefined) return;
    const id = requestAnimationFrame(() => animateChannel("current", extA));
    return () => cancelAnimationFrame(id);
  }, [extA, animateChannel]);

  useEffect(() => {
    if (extR === undefined) return;
    const id = requestAnimationFrame(() => animateChannel("resistance", extR));
    return () => cancelAnimationFrame(id);
  }, [extR, animateChannel]);

  useEffect(() => {
    if (!autoAnimate) return;

    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      Object.values(tweens.current).forEach((t) => t?.kill());
      return;
    }

    const first = SCENARIOS[scenIdx.current]!;
    const frame = requestAnimationFrame(() => animateScenario(first));

    intervalRef.current = setInterval(() => {
      scenIdx.current = (scenIdx.current + 1) % SCENARIOS.length;
      animateScenario(SCENARIOS[scenIdx.current]!);
    }, animationInterval);

    return () => {
      cancelAnimationFrame(frame);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoAnimate, animationInterval, animateScenario, isActive]);

  useEffect(() => {
    const activeTweens = tweens.current;
    return () => {
      Object.values(activeTweens).forEach((t) => t?.kill());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const setRef = useCallback((mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | null, index?: number) => {
    if (key === "barEls" && typeof index === "number") {
      refsMap.current[mode].barEls[index] = el as HTMLSpanElement | null;
      return;
    }
    if (key === "lcdEl") refsMap.current[mode].lcdEl = el as HTMLDivElement | null;
  }, []);

  return { states, computed, scenarioLabel, setRef, hold, setHold };
}
