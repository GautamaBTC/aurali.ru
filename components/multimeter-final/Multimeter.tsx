"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MultimeterProps } from "./multimeter.types";
import { CHANNELS } from "./multimeter.constants";
import { useVisibility } from "./useVisibility";
import { useMultimeter } from "./useMultimeter";
import { MeterHeader } from "./MeterHeader";
import { MeterDisplay } from "./MeterDisplay";
import { MeterOscilloscope } from "./MeterOscilloscope";
import { MeterHistory } from "./MeterHistory";
import { MeterComputed } from "./MeterComputed";
import { MeterFooter } from "./MeterFooter";

gsap.registerPlugin(ScrollTrigger);

function Divider() {
  return (
    <div className="mx-3 sm:mx-4" aria-hidden>
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />
    </div>
  );
}

export default function Multimeter({ voltage, current, resistance, autoAnimate = true, animationInterval = 3200, className }: MultimeterProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const { isActive } = useVisibility(sectionRef);

  const { states, computed, scenarioLabel, setRef, hold, setHold } = useMultimeter({
    voltage,
    current,
    resistance,
    autoAnimate,
    animationInterval,
    isActive,
  });

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    gsap.set(panels, { opacity: 0, y: 24 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(panels, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={sectionRef} className={`relative w-full select-none ${className ?? ""}`} aria-label="Мультиметр">
      <div className="mx-auto w-full max-w-7xl px-3 py-12 sm:px-5 lg:px-8">
        <div
          ref={shellRef}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
          style={{
            background: "linear-gradient(180deg, #0a0a10 0%, #07070c 50%, #09090f 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 0 0 0.5px rgba(255,255,255,0.03), 0 50px 100px -25px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02]" aria-hidden>
            <filter id="dmm-n">
              <feTurbulence baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#dmm-n)" />
          </svg>

          <div className="absolute inset-x-0 top-0 flex justify-center" aria-hidden>
            <div className="h-px w-48 sm:w-72" style={{ background: `linear-gradient(90deg, transparent, ${states.voltage.zone.color}33, transparent)`, transition: "background 1s" }} />
          </div>

          <div data-panel>
            <MeterHeader scenarioLabel={scenarioLabel} hold={hold} onToggleHold={() => setHold((h) => !h)} />
          </div>

          <Divider />

          <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-12 lg:gap-3 lg:p-4">
            <div className="flex flex-col gap-2 lg:col-span-4" data-panel>
              {(["voltage", "current", "resistance"] as const).map((m) => (
                <MeterDisplay key={m} config={CHANNELS[m]} state={states[m]} setRef={setRef} />
              ))}
            </div>

            <div className="flex flex-col gap-2 lg:col-span-5" data-panel>
              <MeterOscilloscope voltageState={states.voltage} currentState={states.current} computed={computed} isActive={isActive} />
              <MeterHistory states={states} />
            </div>

            <div className="lg:col-span-3" data-panel>
              <MeterComputed states={states} computed={computed} />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
            {[33.333, 66.666].map((pct) => (
              <div
                key={pct}
                className="absolute bottom-16 top-20"
                style={{
                  left: `${pct}%`,
                  width: 1,
                  background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.03) 70%, transparent)",
                }}
              />
            ))}
          </div>

          <Divider />

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
