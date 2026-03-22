"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ChannelState, ComputedState, DemoScenario, MeterMode, RangeMode, ToolbarState } from "./multimeter.types";
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
    overload: false,
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
    peakVoltage: 0,
    peakCurrent: 0,
  });

  const [toolbar, setToolbar] = useState<ToolbarState>({
    hold: false,
    rel: false,
    peak: false,
    acdc: "DC",
    range: "auto",
    rate: "fast",
    recording: true,
  });

  const [scenarioLabel, setScenarioLabel] = useState("");

  const getDuration = useCallback((): number => {
    if (toolbar.rate === "slow") return 3.2;
    if (toolbar.rate === "med") return 2.2;
    return 1.4;
  }, [toolbar.rate]);

  const animateChannel = useCallback(
    (mode: MeterMode, target: number) => {
      if (toolbar.hold) return;
      const cfg = CHANNELS[mode];
      const refs = refsMap.current[mode];
      const prev = prevs.current[mode];
      const dur = getDuration();

      tweens.current[mode]?.kill();
      const proxy = { v: prev };

      tweens.current[mode] = gsap.to(proxy, {
        v: target,
        duration: dur,
        ease: "power2.inOut",
        onUpdate() {
          if (refs.lcdEl) {
            refs.lcdEl.dispatchEvent(
              new CustomEvent("lcdupdate", {
                detail: { value: cfg.format(proxy.v), unit: cfg.formatUnit(proxy.v) },
              }),
            );
          }

          const ratio = getBargraphRatio(proxy.v, cfg);
          const active = Math.round(ratio * cfg.bargraphSegments);
          refs.barEls.forEach((el, i) => {
            if (!el) return;
            if (i < active) {
              const c = getSegmentColor(i, cfg.bargraphSegments);
              el.style.backgroundColor = c;
              el.style.boxShadow = `0 0 4px ${c}80, 0 0 1px ${c}`;
            } else {
              el.style.backgroundColor = "rgba(255,255,255,0.04)";
              el.style.boxShadow = "none";
            }
          });
        },
        onComplete() {
          prevs.current[mode] = target;
          const zone = getZone(cfg, target);
          const overload = mode === "current" ? target > 100 : mode === "resistance" ? target > 900000 : target > 50;

          setStates((s) => {
            const h = [...s[mode].history, target].slice(-HISTORY_MAX);
            return {
              ...s,
              [mode]: {
                value: target,
                displayValue: cfg.format(target),
                displayUnit: cfg.formatUnit(target),
                zone,
                history: h,
                min: h.length > 1 ? Math.min(...h) : target,
                max: h.length > 1 ? Math.max(...h) : target,
                avg: h.reduce((a, b) => a + b, 0) / h.length,
                bargraphRatio: getBargraphRatio(target, cfg),
                overload,
              },
            };
          });
        },
      });
    },
    [toolbar.hold, getDuration],
  );

  const animateScenario = useCallback(
    (sc: DemoScenario) => {
      if (toolbar.hold) return;

      const jitter = (v: number, pct: number) => v + (Math.random() - 0.5) * v * pct;
      const jV = jitter(sc.voltage, 0.02);
      const jA = jitter(sc.current, 0.05);
      const jR = jitter(sc.resistance, 0.03);

      animateChannel("voltage", jV);
      animateChannel("current", jA);
      animateChannel("resistance", jR);
      setScenarioLabel(sc.label);

      const p = jV * jA;
      setComputed((prev) => {
        const next = {
          power: p,
          energy: toolbar.recording ? prev.energy + p * (animationInterval / 3_600_000) : prev.energy,
          frequency: +(sc.frequency + (Math.random() - 0.5) * 4).toFixed(1),
          vpp: +(sc.vpp + (Math.random() - 0.5) * sc.vpp * 0.2).toFixed(2),
          duty: +(48 + Math.random() * 4).toFixed(1),
          impedance: jA > 0.001 ? jV / jA : 999999,
          peakVoltage: toolbar.recording ? Math.max(prev.peakVoltage, jV) : prev.peakVoltage,
          peakCurrent: toolbar.recording ? Math.max(prev.peakCurrent, jA) : prev.peakCurrent,
        };
        return next;
      });
    },
    [animateChannel, toolbar.hold, toolbar.recording, animationInterval],
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

    const frame = requestAnimationFrame(() => {
      animateScenario(SCENARIOS[scenIdx.current]!);
    });

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

  const toggleHold = useCallback(() => setToolbar((t) => ({ ...t, hold: !t.hold })), []);
  const toggleRel = useCallback(() => setToolbar((t) => ({ ...t, rel: !t.rel })), []);
  const togglePeak = useCallback(() => {
    setToolbar((t) => ({ ...t, peak: !t.peak }));
    setComputed((c) => ({
      ...c,
      peakVoltage: prevs.current.voltage,
      peakCurrent: prevs.current.current,
    }));
  }, []);
  const toggleAcDc = useCallback(() => setToolbar((t) => ({ ...t, acdc: t.acdc === "DC" ? "AC" : "DC" })), []);
  const setRange = useCallback((r: RangeMode) => setToolbar((t) => ({ ...t, range: r })), []);
  const cycleRate = useCallback(
    () =>
      setToolbar((t) => ({
        ...t,
        rate: t.rate === "fast" ? "med" : t.rate === "med" ? "slow" : "fast",
      })),
    [],
  );
  const toggleRec = useCallback(() => setToolbar((t) => ({ ...t, recording: !t.recording })), []);
  const resetMinMax = useCallback(() => {
    setStates((s) => {
      const reset = (ch: ChannelState): ChannelState => ({ ...ch, min: ch.value, max: ch.value, avg: ch.value, history: [ch.value] });
      return { voltage: reset(s.voltage), current: reset(s.current), resistance: reset(s.resistance) };
    });
    setComputed((c) => ({ ...c, energy: 0, peakVoltage: 0, peakCurrent: 0 }));
  }, []);

  const setRef = useCallback((mode: MeterMode, key: keyof ChannelRefs, el: HTMLElement | null, index?: number) => {
    if (key === "barEls" && typeof index === "number") {
      refsMap.current[mode].barEls[index] = el as HTMLSpanElement | null;
      return;
    }
    if (key === "lcdEl") refsMap.current[mode].lcdEl = el as HTMLDivElement | null;
  }, []);

  return {
    states,
    computed,
    scenarioLabel,
    toolbar,
    setRef,
    toggleHold,
    toggleRel,
    togglePeak,
    toggleAcDc,
    setRange,
    cycleRate,
    toggleRec,
    resetMinMax,
  };
}
