"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ACCENT_RAW = "#00a6ff";
const ACCENT_DIM = "rgba(0,166,255,0.04)";
const GREEN = "#00ff41";
const GREEN_DIM = "rgba(0,255,65,0.06)";
const RADAR_ACCENT = "var(--accent, #ccff00)";
const RADAR_ACCENT_RAW = "#ccff00";
const RADAR_ACCENT_DIM = "rgba(204,255,0,0.1)";
const RADAR_ACCENT_SOFT = "rgba(204,255,0,0.26)";
const TARGET_CORE = "#ff3d3d";

const RADAR_TARGETS = [
  { a: 46, r: 76, t: "ПОРТ 443" },
  { a: 214, r: 108, t: "SQL ИНЪ." },
  { a: 302, r: 62, t: "XSS" },
] as const;
const SEGMENT_MAP: Record<string, number[]> = {
  "0": [1, 1, 1, 0, 1, 1, 1],
  "1": [0, 0, 1, 0, 0, 1, 0],
  "2": [1, 0, 1, 1, 1, 0, 1],
  "3": [1, 0, 1, 1, 0, 1, 1],
  "4": [0, 1, 1, 1, 0, 1, 0],
  "5": [1, 1, 0, 1, 0, 1, 1],
  "6": [1, 1, 0, 1, 1, 1, 1],
  "7": [1, 0, 1, 0, 0, 1, 0],
  "8": [1, 1, 1, 1, 1, 1, 1],
  "9": [1, 1, 1, 1, 0, 1, 1],
};

type PreloaderProps = {
  onComplete?: () => void;
};

type LedRowProps = {
  n: number;
};

type PanelProps = {
  children: React.ReactNode;
  label: string;
};

function LedRow({ n }: LedRowProps) {
  return (
    <div className="flex gap-[1.5px]" style={{ marginTop: 3 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="led" style={{ width: 4, height: 6, borderRadius: 1, backgroundColor: ACCENT_DIM }} />
      ))}
    </div>
  );
}

function Panel({ children, label }: PanelProps) {
  return (
    <div className="p-[5px]" style={{ border: "1px solid rgba(0,166,255,0.08)", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 5.5, letterSpacing: "0.1em", color: "rgba(0,166,255,0.18)", marginBottom: 3, fontFamily: "monospace" }}>
        -- {label} --
      </div>
      {children}
    </div>
  );
}

function SegBox() {
  const sH: React.CSSProperties = { position: "absolute", left: 5, right: 5, height: 3, borderRadius: 1.5, backgroundColor: ACCENT_DIM };
  const sVL: React.CSSProperties = { position: "absolute", left: 0, width: 3, borderRadius: 1.5, backgroundColor: ACCENT_DIM };
  const sVR: React.CSSProperties = { position: "absolute", right: 0, width: 3, borderRadius: 1.5, backgroundColor: ACCENT_DIM };

  return (
    <div className="segbox relative" style={{ width: 20, height: 36 }}>
      <div style={{ ...sH, top: 0 }} />
      <div style={{ ...sVL, top: 4, height: "calc(50% - 4px)" }} />
      <div style={{ ...sVR, top: 4, height: "calc(50% - 4px)" }} />
      <div style={{ ...sH, top: "calc(50% - 1.5px)" }} />
      <div style={{ ...sVL, top: "50%", height: "calc(50% - 4px)" }} />
      <div style={{ ...sVR, top: "50%", height: "calc(50% - 4px)" }} />
      <div style={{ ...sH, bottom: 0 }} />
    </div>
  );
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const overlay = useRef<HTMLDivElement>(null);
  const scanlines = useRef<HTMLDivElement>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const radar = useRef<SVGSVGElement>(null);
  const crossT = useRef<HTMLDivElement>(null);
  const crossB = useRef<HTMLDivElement>(null);
  const crossL = useRef<HTMLDivElement>(null);
  const crossR = useRef<HTMLDivElement>(null);
  const counterEl = useRef<HTMLDivElement>(null);
  const rangeEl = useRef<HTMLDivElement>(null);
  const statusEl = useRef<HTMLDivElement>(null);
  const progTrack = useRef<HTMLDivElement>(null);
  const progLabel = useRef<HTMLSpanElement>(null);
  const pTL = useRef<HTMLDivElement>(null);
  const pTR = useRef<HTMLDivElement>(null);
  const pBL = useRef<HTMLDivElement>(null);
  const pBR = useRef<HTMLDivElement>(null);
  const oscCanvas = useRef<HTMLCanvasElement>(null);
  const bottomBar = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);

  const d = useRef({ count: 0, pct: 0, volt: 0, ohm: 0, amp: 0, freq: 0, dist: 0, temp: 18, phase: 0, scanAngle: 0 });
  const oscTrails = useRef<number[][]>([]);
  const tickerRef = useRef<gsap.TickerCallback | null>(null);
  const prevCounterRef = useRef(-1);
  const prevSegFilledRef = useRef(-1);
  const prevRingFilledRef = useRef(-1);
  const prevPctLabelRef = useRef(-1);

  const writeDig = useCallback((el: HTMLDivElement | null, ch: string, color: string) => {
    if (!el) return;
    const bits = SEGMENT_MAP[ch] || Array(7).fill(0);
    for (let i = 0; i < 7 && i < el.children.length; i++) {
      const s = el.children[i] as HTMLElement;
      s.style.backgroundColor = bits[i] ? color : ACCENT_DIM;
      s.style.boxShadow = bits[i] ? `0 0 6px ${color}` : "none";
    }
  }, []);

  const writeCounter = useCallback((box: HTMLDivElement | null, val: number, color: string) => {
    if (!box) return;
    const str = String(Math.min(Math.floor(val), 9)).padStart(3, "0");
    const digits = box.querySelectorAll<HTMLDivElement>(".segbox");
    digits.forEach((digit, i) => writeDig(digit, str[i], color));
  }, [writeDig]);

  const drawOsc = useCallback((ph: number) => {
    const cv = oscCanvas.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
    const W = cv.width;
    const H = cv.height;
    c.clearRect(0, 0, W, H);

    c.strokeStyle = GREEN_DIM;
    c.lineWidth = 0.5;
    for (let x = W / 10; x < W; x += W / 10) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, H);
      c.stroke();
    }
    for (let y = H / 6; y < H; y += H / 6) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(W, y);
      c.stroke();
    }

    c.strokeStyle = "rgba(0,255,65,0.08)";
    c.setLineDash([2, 3]);
    c.beginPath();
    c.moveTo(0, H / 2);
    c.lineTo(W, H / 2);
    c.stroke();
    c.setLineDash([]);

    const pts: number[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      pts.push(H / 2 + Math.sin(t * Math.PI * 6 + ph) * H * 0.2 + Math.sin(t * Math.PI * 14 + ph * 1.4) * H * 0.05 + (Math.random() - 0.5) * 0.5);
    }

    oscTrails.current.push([...pts]);
    if (oscTrails.current.length > 3) oscTrails.current.shift();

    oscTrails.current.forEach((tr, ti) => {
      c.strokeStyle = `rgba(0,255,65,${((ti + 1) / oscTrails.current.length) * 0.04})`;
      c.lineWidth = 1;
      c.beginPath();
      tr.forEach((y, i) => {
        const x = (i / 120) * W;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      });
      c.stroke();
    });

    c.strokeStyle = GREEN;
    c.lineWidth = 1.5;
    c.shadowColor = GREEN;
    c.shadowBlur = 3;
    c.beginPath();
    pts.forEach((y, i) => {
      const x = (i / 120) * W;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    });
    c.stroke();
    c.shadowBlur = 0;

    c.font = "6px monospace";
    c.fillStyle = GREEN;
    c.fillText("CH1", 2, 8);
  }, []);

  const updateLeds = useCallback((el: HTMLDivElement | null, val: number, max: number) => {
    if (!el) return;
    const leds = el.querySelectorAll<HTMLDivElement>(".led");
    const filled = Math.round((val / max) * leds.length);
    leds.forEach((l, i) => {
      const on = i < filled;
      l.style.backgroundColor = on ? ACCENT_RAW : ACCENT_DIM;
      l.style.boxShadow = on ? `0 0 3px ${ACCENT_RAW}` : "none";
    });
  }, []);

  const setText = useCallback((panel: HTMLDivElement | null, cls: string, txt: string) => {
    if (!panel) return;
    const el = panel.querySelector<HTMLElement>(`.${cls}`);
    if (el) el.textContent = txt;
  }, []);

  useLayoutEffect(() => {
    const savedOv = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cleanupTicker = () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }
    };

    const ctx = gsap.context(() => {
      const dd = d.current;
      prevCounterRef.current = -1;
      prevSegFilledRef.current = -1;
      prevRingFilledRef.current = -1;
      prevPctLabelRef.current = -1;
      const radarElStatic = radar.current;
      const radarBlocks = radarElStatic ? Array.from(radarElStatic.querySelectorAll<SVGRectElement>(".pblock")) : [];
      const sweepGroupStatic = radarElStatic?.querySelector<SVGGElement>(".rsweep") ?? null;
      const targetNodes = radarElStatic
        ? Array.from(radarElStatic.querySelectorAll<SVGGElement>(".vdot")).map((group) => ({
            group,
            angle: Number(group.dataset.angle ?? 0),
            core: group.querySelector<SVGCircleElement>(".v-core"),
            pulse: group.querySelector<SVGCircleElement>(".v-pulse"),
            halo: group.querySelector<SVGCircleElement>(".v-halo"),
            text: group.querySelector<SVGTextElement>("text"),
          }))
        : [];

      const tick: gsap.TickerCallback = () => {
        const counterValue = Math.min(Math.floor(dd.count), 9);
        if (counterValue !== prevCounterRef.current) {
          writeCounter(counterEl.current, dd.count, ACCENT_RAW);
          prevCounterRef.current = counterValue;
        }
        if (rangeEl.current) rangeEl.current.textContent = `РАССТОЯНИЕ  ${dd.dist.toFixed(1)}м`;

        drawOsc(dd.phase);

        setText(pTR.current, "pv", `${dd.volt.toFixed(1)}V`);
        setText(pTR.current, "pv2", `${Math.round(dd.freq)}Гц`);
        setText(pBL.current, "pv", dd.ohm >= 1000 ? `${(dd.ohm / 1000).toFixed(1)} кОм` : `${dd.ohm.toFixed(0)} Ом`);
        setText(pBR.current, "pv", `${dd.amp.toFixed(1)}A`);

        updateLeds(pTR.current, dd.volt, 16);
        updateLeds(pBL.current, dd.ohm, 3000);
        updateLeds(pBR.current, dd.amp, 5);

        if (progTrack.current) {
          const segs = progTrack.current.querySelectorAll<HTMLDivElement>(".pseg");
          const filled = Math.round((dd.pct / 100) * segs.length);
          if (filled !== prevSegFilledRef.current) {
            segs.forEach((s, i) => {
              const on = i < filled;
              s.style.backgroundColor = on ? ACCENT_RAW : ACCENT_DIM;
              s.style.boxShadow = on ? `0 0 3px ${ACCENT_RAW}` : "none";
            });
            prevSegFilledRef.current = filled;
          }
        }

        const pctRounded = Math.round(dd.pct);
        if (progLabel.current && pctRounded !== prevPctLabelRef.current) {
          progLabel.current.textContent = `${pctRounded}%`;
          prevPctLabelRef.current = pctRounded;
        }

        if (radarBlocks.length > 0) {
          const filled = Math.round((dd.pct / 100) * radarBlocks.length);
          if (filled !== prevRingFilledRef.current) {
            radarBlocks.forEach((b, i) => {
              b.setAttribute("fill", i < filled ? RADAR_ACCENT_RAW : "rgba(204,255,0,0.04)");
              b.setAttribute("opacity", i < filled ? "0.95" : "0.28");
            });
            prevRingFilledRef.current = filled;
          }
        }

        if (sweepGroupStatic) {
          sweepGroupStatic.setAttribute("transform", `rotate(${dd.scanAngle} 200 200)`);
        }

        if (targetNodes.length > 0 && dd.scanAngle > 0) {
          targetNodes.forEach((target) => {
            const delta = Math.abs((((dd.scanAngle - target.angle + 540) % 360) - 180));
            const focusRaw = Math.max(0, 1 - delta / 26);
            const focus = focusRaw * focusRaw * (3 - 2 * focusRaw);
            const base = 0.18;
            target.group.setAttribute("opacity", String(base + focus * 0.8));
            if (target.core) target.core.setAttribute("r", (4 + focus * 1.8).toFixed(2));
            if (target.pulse) {
              target.pulse.setAttribute("r", (10 + focus * 8).toFixed(2));
              target.pulse.setAttribute("opacity", (0.2 + focus * 0.72).toFixed(2));
            }
            if (target.halo) {
              target.halo.setAttribute("r", (15 + focus * 4).toFixed(2));
              target.halo.setAttribute("opacity", (0.18 + focus * 0.42).toFixed(2));
            }
            if (target.text) target.text.setAttribute("opacity", (0.35 + focus * 0.65).toFixed(2));
          });
        }
      };

      tickerRef.current = tick;
      gsap.ticker.add(tick);

      const tl = gsap.timeline({
        onComplete: () => {
          cleanupTicker();
          document.body.style.overflow = savedOv;
          if (overlay.current) overlay.current.style.display = "none";
          setGone(true);
          onComplete?.();
        },
      });

      tl.fromTo(scanlines.current, { opacity: 0 }, { opacity: 0.2, duration: 0.3 }, 0);
      tl.fromTo(vignette.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0);
      tl.fromTo(grid.current, { opacity: 0 }, { opacity: 0.08, duration: 0.5 }, 0.3);

      if (radar.current) {
        const radarEl = radar.current;
        const rings = radarEl.querySelectorAll<SVGCircleElement>(".rring");
        rings.forEach((ring, i) => {
          const r = parseFloat(ring.getAttribute("r") || "0");
          const circ = 2 * Math.PI * r;
          ring.setAttribute("stroke-dasharray", String(circ));
          ring.setAttribute("stroke-dashoffset", String(circ));
          gsap.set(ring, { opacity: 0 });
          tl.to(ring, { attr: { "stroke-dashoffset": 0 }, opacity: 0.4, duration: 0.3 }, 0.5 + i * 0.05);
        });

        tl.fromTo(radarEl.querySelectorAll<SVGElement>(".rtick"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.001 }, 0.7);
        tl.fromTo(radarEl.querySelectorAll<SVGElement>(".rdeg"), { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.01 }, 0.8);
        tl.fromTo(radarEl.querySelectorAll<SVGElement>(".rrad"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.006 }, 0.7);
        tl.fromTo(radarEl.querySelectorAll<SVGElement>(".pblock"), { opacity: 0 }, { opacity: 0.45, duration: 0.3, stagger: 0.001 }, 0.8);

        const slowSpin = radarEl.querySelector<SVGGElement>(".rspin-slow");
        if (slowSpin) {
          const slowProxy = { a: 0 };
          tl.to(
            slowProxy,
            {
              a: 14,
              duration: 7,
              ease: "none",
              onUpdate: () => {
                slowSpin.setAttribute("transform", `rotate(${slowProxy.a} 200 200)`);
              },
            },
            1.0,
          );
        }

        const fastSpin = radarEl.querySelector<SVGGElement>(".rspin-fast");
        if (fastSpin) {
          const fastProxy = { a: 0 };
          tl.to(
            fastProxy,
            {
              a: -22,
              duration: 7,
              ease: "none",
              onUpdate: () => {
                fastSpin.setAttribute("transform", `rotate(${fastProxy.a} 200 200)`);
              },
            },
            1.0,
          );
        }

        const sweepGroup = radarEl.querySelector<SVGGElement>(".rsweep");
        if (sweepGroup) {
          tl.set(sweepGroup, { opacity: 0 });
          tl.to(sweepGroup, { opacity: 1, duration: 0.12 }, 0.9);
          tl.to(sweepGroup, { opacity: 0, duration: 0.15 }, 7.9);
        }

        const retEls = radarEl.querySelectorAll<SVGElement>(".retic");
        retEls.forEach((ret, i) => {
          gsap.set(ret, { opacity: 0 });
          tl.to(ret, { opacity: 1, duration: 0.2 }, 1 + i * 0.03);
        });

        const corePulse = radarEl.querySelector<SVGCircleElement>(".r-core-pulse");
        if (corePulse) {
          gsap.set(corePulse, { opacity: 0, attr: { r: 5 } });
          tl.to(
            corePulse,
            { attr: { r: 18 }, opacity: 0, duration: 0.7, repeat: 5, repeatDelay: 0.45, ease: "power1.out" },
            2.0,
          );
        }

        const vulns = radarEl.querySelectorAll<SVGGElement>(".vdot");
        gsap.set(vulns, { opacity: 0 });
        tl.to(vulns, { opacity: 0.18, duration: 0.35, ease: "power1.out" }, 1.4);
      }

      tl.fromTo(crossT.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.2 }, 1.0);
      tl.fromTo(crossB.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.2 }, 1.0);
      tl.fromTo(crossL.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.2 }, 1.0);
      tl.fromTo(crossR.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.2 }, 1.0);

      tl.fromTo(counterEl.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.2);
      tl.fromTo(rangeEl.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.3);

      [pTL, pTR, pBL, pBR].forEach((panel, i) => {
        tl.fromTo(panel.current, { opacity: 0, x: i % 2 === 0 ? -10 : 10 }, { opacity: 1, x: 0, duration: 0.3 }, 1.5 + i * 0.06);
      });

      tl.fromTo(statusEl.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.6);
      tl.fromTo(progTrack.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.65);
      tl.fromTo(progLabel.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.65);
      tl.fromTo(bottomBar.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.7);

      tl.to(dd, { phase: Math.PI * 16, duration: 7, ease: "none" }, 1.5);
      tl.to(dd, { scanAngle: 360, duration: 7, ease: "none" }, 0.9);
      tl.to(dd, { count: 9.49, duration: 7, ease: "none" }, 2.0);
      tl.to(dd, { pct: 100, duration: 7, ease: "none" }, 2.0);
      tl.to(dd, { volt: 12.6, duration: 3 }, 2.0);
      tl.to(dd, { ohm: 2400, duration: 4 }, 2.2);
      tl.to(dd, { amp: 3.2, duration: 3.5 }, 2.0);
      tl.to(dd, { freq: 440, duration: 3 }, 2.3);
      tl.to(dd, { dist: 247.3, duration: 4 }, 2.0);
      tl.to(dd, { temp: 23.4, duration: 2 }, 2.0);

      tl.call(() => {
        if (statusEl.current) statusEl.current.textContent = "● СКАНИРОВАНИЕ ЗАВЕРШЕНО";
      }, [], 8.5);
      tl.to(statusEl.current, { opacity: 0, duration: 0.04, repeat: 3, yoyo: true }, 8.5);

      [pTL, pTR, pBL, pBR].forEach((panel, i) => {
        tl.to(panel.current, { opacity: 0, duration: 0.2 }, 9.0 + i * 0.02);
      });
      tl.to([crossT.current, crossB.current], { scaleY: 0, opacity: 0, duration: 0.2 }, 9.0);
      tl.to([crossL.current, crossR.current], { scaleX: 0, opacity: 0, duration: 0.2 }, 9.0);
      tl.to(counterEl.current, { opacity: 0, duration: 0.15 }, 9.05);
      tl.to([statusEl.current, rangeEl.current, progTrack.current, progLabel.current], { opacity: 0, duration: 0.12 }, 9.05);
      tl.to(radar.current, { opacity: 0, scale: 0.5, duration: 0.3 }, 9.0);
      tl.to([grid.current, bottomBar.current], { opacity: 0, duration: 0.12 }, 9.1);
      tl.to(flash.current, { opacity: 0.25, duration: 0.03 }, 9.15);
      tl.to(flash.current, { opacity: 0, duration: 0.08 }, 9.18);
      tl.to(overlay.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 9.3);
    }, root);

    return () => {
      cleanupTicker();
      ctx.revert();
      document.body.style.overflow = savedOv;
    };
  }, [drawOsc, onComplete, setText, updateLeds, writeCounter]);

  if (gone) return null;

  const CX = 200;
  const RINGS_R = [36, 64, 92, 124, 156];
  const PROG_R = 166;
  const BLOCK_COUNT = 120;

  const progBlocks: React.ReactNode[] = [];
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const angle = (i / BLOCK_COUNT) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const x = CX + Math.cos(rad) * PROG_R;
    const y = CX + Math.sin(rad) * PROG_R;

    progBlocks.push(
      <rect
        key={`pb-${i}`}
        className="pblock"
        x={x - 2.8}
        y={y - 2}
        width={5.6}
        height={4}
        rx={0.7}
        fill="rgba(204,255,0,0.03)"
        opacity={0}
        transform={`rotate(${angle + 90} ${x} ${y})`}
      />,
    );
  }

  return (
    <div ref={root}>
      <div ref={overlay} className="fixed inset-0 z-[9999]" style={{ backgroundColor: "var(--bg-primary, #060a10)" }}>
        <div ref={scanlines} className="absolute inset-0 pointer-events-none opacity-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,255,65,0.005) 1px,rgba(0,255,65,0.005) 2px)" }} />

        <div ref={vignette} className="absolute inset-0 pointer-events-none opacity-0" style={{ background: "radial-gradient(ellipse at center,transparent 15%,rgba(0,0,0,0.5) 45%,rgba(0,0,0,0.92) 72%,rgba(0,0,0,0.99) 100%)" }} />

        <div
          ref={grid}
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,65,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,65,0.03) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse at center,black 10%,transparent 40%)",
            WebkitMaskImage: "radial-gradient(ellipse at center,black 10%,transparent 40%)",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg ref={radar} viewBox="0 0 400 400" className="h-[min(62vw,62vh,370px)] w-[min(62vw,62vh,370px)]" style={{ marginTop: "-4%" }}>
            <defs>
              <linearGradient id="sweepLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={RADAR_ACCENT_DIM} />
                <stop offset="100%" stopColor={RADAR_ACCENT} />
              </linearGradient>
              <linearGradient id="sweepConeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={RADAR_ACCENT_SOFT} />
                <stop offset="100%" stopColor="rgba(204,255,0,0)" />
              </linearGradient>
              <radialGradient id="coreGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(255,61,61,0.95)" />
                <stop offset="55%" stopColor="rgba(255,61,61,0.45)" />
                <stop offset="100%" stopColor="rgba(255,61,61,0)" />
              </radialGradient>
            </defs>

            <g className="rspin-slow">
              {RINGS_R.map((r, i) => (
                <circle key={i} className="rring" cx={CX} cy={CX} r={r} fill="none" stroke={RADAR_ACCENT} strokeWidth={i === 0 ? 1 : i === 4 ? 0.55 : 0.42} opacity={0} />
              ))}

              {Array.from({ length: 120 }).map((_, i) => {
                const a = ((i * 3) * Math.PI) / 180;
                const maj = i % 10 === 0;
                const mid = i % 5 === 0;
                const r1 = RINGS_R[4] - (maj ? 8 : mid ? 5 : 2.5);
                const r2 = RINGS_R[4] + 3;

                return (
                  <line
                    key={i}
                    className="rtick"
                    x1={CX + Math.cos(a) * r1}
                    y1={CX + Math.sin(a) * r1}
                    x2={CX + Math.cos(a) * r2}
                    y2={CX + Math.sin(a) * r2}
                    stroke={maj ? RADAR_ACCENT : "rgba(204,255,0,0.11)"}
                    strokeWidth={maj ? 0.7 : mid ? 0.42 : 0.26}
                    opacity={0}
                  />
                );
              })}

              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                const a = (deg * Math.PI) / 180;
                return (
                  <text
                    key={i}
                    className="rdeg"
                    x={CX + Math.cos(a) * (RINGS_R[4] + 13)}
                    y={CX + Math.sin(a) * (RINGS_R[4] + 13) + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(204,255,0,0.28)"
                    fontSize="5.8"
                    fontFamily="monospace"
                    opacity={0}
                  >
                    {deg}
                  </text>
                );
              })}

              {Array.from({ length: 24 }).map((_, i) => {
                const a = ((i * 15) * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    className="rrad"
                    x1={CX + Math.cos(a) * 20}
                    y1={CX + Math.sin(a) * 20}
                    x2={CX + Math.cos(a) * (RINGS_R[4] - 8)}
                    y2={CX + Math.sin(a) * (RINGS_R[4] - 8)}
                    stroke={RADAR_ACCENT_DIM}
                    strokeWidth={0.34}
                    opacity={0}
                  />
                );
              })}
            </g>

            <g className="rspin-fast">
              <circle className="rring" cx={CX} cy={CX} r={30} fill="none" stroke={RADAR_ACCENT} strokeWidth={0.5} opacity={0} />
              <circle className="rring" cx={CX} cy={CX} r={18} fill="none" stroke={TARGET_CORE} strokeWidth={0.65} opacity={0} />

              {[
                [-35, -35, -20, -35, -35, -20],
                [35, -35, 20, -35, 35, -20],
                [-35, 35, -20, 35, -35, 20],
                [35, 35, 20, 35, 35, 20],
              ].map((p, i) => (
                <path
                  key={`b-${i}`}
                  className="retic"
                  d={`M${CX + p[0]} ${CX + p[1]} L${CX + p[2]} ${CX + p[3]} L${CX + p[4]} ${CX + p[5]}`}
                  fill="none"
                  stroke={RADAR_ACCENT}
                  strokeWidth={0.7}
                  opacity={0}
                />
              ))}

              <line className="retic" x1={CX - 32} y1={CX} x2={CX - 10} y2={CX} stroke={RADAR_ACCENT} strokeWidth={0.58} opacity={0} />
              <line className="retic" x1={CX + 10} y1={CX} x2={CX + 32} y2={CX} stroke={RADAR_ACCENT} strokeWidth={0.58} opacity={0} />
              <line className="retic" x1={CX} y1={CX - 32} x2={CX} y2={CX - 10} stroke={RADAR_ACCENT} strokeWidth={0.58} opacity={0} />
              <line className="retic" x1={CX} y1={CX + 10} x2={CX} y2={CX + 32} stroke={RADAR_ACCENT} strokeWidth={0.58} opacity={0} />

              <rect className="retic" x={CX - 9} y={CX - 9} width={18} height={18} fill="none" stroke={TARGET_CORE} strokeWidth={0.7} transform={`rotate(45 ${CX} ${CX})`} opacity={0} />
              <circle className="retic r-core-pulse" cx={CX} cy={CX} r={6} fill="none" stroke="rgba(255,61,61,0.9)" strokeWidth={0.7} opacity={0} />
              <circle className="retic" cx={CX} cy={CX} r={4.5} fill="url(#coreGrad)" opacity={0} />
              <circle className="retic" cx={CX} cy={CX} r={2.1} fill={TARGET_CORE} opacity={0} />
            </g>

            {progBlocks}

            <g className="rsweep" opacity={0}>
              <line className="rsweep-l" x1={CX} y1={CX} x2={CX + RINGS_R[4] + 2} y2={CX} stroke="url(#sweepLineGrad)" strokeWidth={0.95} />
              <path className="rsweep-g" d={`M${CX},${CX} L${CX + RINGS_R[4] + 2},${CX - 12} L${CX + RINGS_R[4] + 2},${CX + 12}Z`} fill="url(#sweepConeGrad)" />
            </g>

            {RADAR_TARGETS.map((v, i) => {
              const rad = (v.a * Math.PI) / 180;
              const vx = CX + Math.cos(rad) * v.r;
              const vy = CX + Math.sin(rad) * v.r;

              return (
                <g key={i} className="vdot" data-angle={v.a} opacity={0}>
                  <circle className="v-core" cx={vx} cy={vy} r={4.4} fill={RADAR_ACCENT} style={{ filter: `drop-shadow(0 0 7px ${RADAR_ACCENT_RAW})` }} />
                  <circle className="v-pulse" cx={vx} cy={vy} r={10} fill="none" stroke={RADAR_ACCENT} strokeWidth={0.55} opacity={0.52} />
                  <circle className="v-halo" cx={vx} cy={vy} r={15} fill="none" stroke="rgba(204,255,0,0.42)" strokeWidth={0.28} />
                  <text x={vx + 12} y={vy + 3} fill={RADAR_ACCENT} fontSize="6" fontFamily="monospace">{v.t}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div ref={crossT} className="absolute left-1/2 top-0 opacity-0" style={{ width: 1, height: "calc(50% - 168px)", transform: "translateX(-0.5px)", transformOrigin: "bottom", background: `linear-gradient(to bottom, transparent 45%, ${ACCENT_RAW}30)` }} />
        <div ref={crossB} className="absolute left-1/2 bottom-0 opacity-0" style={{ width: 1, height: "calc(50% - 168px)", transform: "translateX(-0.5px)", transformOrigin: "top", background: `linear-gradient(to top, transparent 45%, ${ACCENT_RAW}30)` }} />
        <div ref={crossL} className="absolute left-0 top-1/2 opacity-0" style={{ height: 1, width: "calc(50% - 168px)", transform: "translateY(-0.5px)", transformOrigin: "right", background: `linear-gradient(to right, transparent 45%, ${ACCENT_RAW}30)` }} />
        <div ref={crossR} className="absolute right-0 top-1/2 opacity-0" style={{ height: 1, width: "calc(50% - 168px)", transform: "translateY(-0.5px)", transformOrigin: "left", background: `linear-gradient(to left, transparent 45%, ${ACCENT_RAW}30)` }} />

        <div ref={rangeEl} className="absolute left-1/2 -translate-x-1/2 opacity-0" style={{ top: "3%", fontFamily: "monospace", fontSize: 11, color: ACCENT_RAW, textShadow: `0 0 4px ${ACCENT_RAW}`, letterSpacing: "0.12em", fontVariantNumeric: "tabular-nums" }}>
          РАССТОЯНИЕ  0.0м
        </div>

        <div ref={counterEl} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[4px] opacity-0" style={{ top: "78%" }}>
          <SegBox />
          <SegBox />
          <SegBox />
        </div>

        <div ref={statusEl} className="absolute left-1/2 -translate-x-1/2 opacity-0" style={{ top: "85%", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.15em", color: ACCENT_RAW, textShadow: `0 0 3px ${ACCENT_RAW}` }}>
          СКАНИРОВАНИЕ...
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ top: "89%" }}>
          <div ref={progTrack} className="flex gap-[1px] opacity-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="pseg" style={{ width: 3, height: 5, borderRadius: 0.5, backgroundColor: ACCENT_DIM }} />
            ))}
          </div>
          <span ref={progLabel} className="opacity-0" style={{ fontFamily: "monospace", fontSize: 7, color: ACCENT_RAW, letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums", minWidth: 22, textAlign: "right" }}>
            0%
          </span>
        </div>

        <div ref={pTL} className="absolute opacity-0" style={{ left: "2%", top: "10%", maxWidth: "23%" }}>
          <Panel label="ОСЦИЛЛОГРАФ">
            <canvas ref={oscCanvas} width={160} height={48} className="block w-full" style={{ border: `1px solid ${GREEN_DIM}` }} />
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 5, color: "rgba(0,255,65,0.15)", marginTop: 2 }}>
              <span>CH1</span>
              <span>5В/дел</span>
            </div>
          </Panel>
        </div>

        <div ref={pTR} className="absolute opacity-0" style={{ right: "2%", top: "10%", maxWidth: "23%" }}>
          <Panel label="НАПРЯЖЕНИЕ">
            <div className="pv" style={{ fontFamily: "monospace", fontSize: 18, fontWeight: "bold", color: ACCENT_RAW, textShadow: `0 0 5px ${ACCENT_RAW}`, fontVariantNumeric: "tabular-nums" }}>
              0.0V
            </div>
            <LedRow n={14} />
            <div className="pv2" style={{ fontFamily: "monospace", fontSize: 5.5, color: "rgba(0,166,255,0.18)", marginTop: 3 }}>
              0Гц
            </div>
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 4.5, color: "rgba(0,166,255,0.12)", marginTop: 2 }}>
              <span>МИН 11.8</span>
              <span>МАКС 14.2</span>
            </div>
          </Panel>
        </div>

        <div ref={pBL} className="absolute opacity-0" style={{ left: "2%", bottom: "14%", maxWidth: "23%" }}>
          <Panel label="СОПРОТИВЛЕНИЕ">
            <div className="pv" style={{ fontFamily: "monospace", fontSize: 16, fontWeight: "bold", color: ACCENT_RAW, textShadow: `0 0 5px ${ACCENT_RAW}`, fontVariantNumeric: "tabular-nums" }}>
              0 Ом
            </div>
            <LedRow n={14} />
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 4.5, color: "rgba(0,166,255,0.12)", marginTop: 3 }}>
              <span>● ИЗМЕРЕНИЕ</span>
              <span>АВТО</span>
            </div>
          </Panel>
        </div>

        <div ref={pBR} className="absolute opacity-0" style={{ right: "2%", bottom: "14%", maxWidth: "23%" }}>
          <Panel label="НАГРУЗКА">
            <div className="pv" style={{ fontFamily: "monospace", fontSize: 16, fontWeight: "bold", color: ACCENT_RAW, textShadow: `0 0 5px ${ACCENT_RAW}`, fontVariantNumeric: "tabular-nums" }}>
              0.0A
            </div>
            <LedRow n={12} />
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 4.5, color: "rgba(0,166,255,0.12)", marginTop: 3 }}>
              <span>Пик: 0.0A</span>
              <span>АКТИВНО</span>
            </div>
          </Panel>
        </div>

        <div ref={bottomBar} className="absolute left-0 right-0 flex justify-center gap-5 opacity-0" style={{ bottom: "2%", fontFamily: "monospace", fontSize: 5.5, color: "rgba(0,166,255,0.1)" }}>
          <span>48°51&apos;24&quot;N 2°21&apos;07&quot;E</span>
          <span>23.4°C</span>
          <span>СИС v3.7.1</span>
        </div>

        <div ref={flash} className="absolute inset-0 pointer-events-none opacity-0 bg-white" />
      </div>
    </div>
  );
}
