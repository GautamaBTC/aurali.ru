"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MultimeterProps } from "./multimeter.types";
import { CHANNELS } from "./multimeter.constants";
import { useMultimeter } from "./useMultimeter";
import { MeterHeader } from "./MeterHeader";
import { MeterDisplay } from "./MeterDisplay";
import { MeterOscilloscope } from "./MeterOscilloscope";
import { MeterHistory } from "./MeterHistory";
import { MeterComputed } from "./MeterComputed";
import { MeterFooter } from "./MeterFooter";

gsap.registerPlugin(ScrollTrigger);

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Multimeter({
  voltage,
  current,
  resistance,
  autoAnimate = true,
  animationInterval = 3200,
  className,
}: MultimeterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const { states, computed, scenarioLabel, setRef } = useMultimeter({ voltage, current, resistance, autoAnimate, animationInterval });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    gsap.set(panels, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(panels, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className={`relative w-full select-none ${className ?? ""}`} aria-label="Multimeter diagnostics panel">
      <div className="mx-auto w-full max-w-7xl px-3 py-12 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
          style={{
            background: "linear-gradient(180deg, #0a0a10 0%, #07070c 50%, #09090f 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 0 0 0.5px rgba(255,255,255,0.03), 0 50px 100px -25px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]" aria-hidden>
            <filter id="dmm-noise">
              <feTurbulence baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#dmm-noise)" />
          </svg>

          <div className="absolute inset-x-0 top-0 flex justify-center" aria-hidden>
            <div className="h-px w-48 sm:w-72" style={{ background: "linear-gradient(90deg, transparent, rgba(0,230,118,0.15), transparent)" }} />
          </div>

          <div data-panel>
            <MeterHeader scenarioLabel={scenarioLabel} />
          </div>

          <div className="mx-4 sm:mx-5" aria-hidden>
            <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
          </div>

          <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-12 lg:gap-4 lg:p-4">
            <div className="flex flex-col gap-3 lg:col-span-4" data-panel>
              {(["voltage", "current", "resistance"] as const).map((mode) => (
                <MeterDisplay key={mode} config={CHANNELS[mode]} state={states[mode]} setRef={setRef} />
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5" data-panel>
              <MeterOscilloscope voltageState={states.voltage} currentState={states.current} computed={computed} reducedMotion={reducedMotion} />
              <MeterHistory states={states} />
            </div>

            <div className="lg:col-span-3" data-panel>
              <MeterComputed states={states} computed={computed} />
            </div>
          </div>

          <div className="mx-4 sm:mx-5" aria-hidden>
            <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
          </div>

          <div data-panel>
            <MeterFooter />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-center" aria-hidden>
            <div className="h-px w-32" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
