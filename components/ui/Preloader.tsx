"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ACCENT = "#00a6ff";
const ACCENT_DIM = "rgba(0,166,255,0.04)";
const ACCENT_LOW = "rgba(0,166,255,0.12)";
const GREEN = "#00ff41";
const RED = "#ff0040";
const WARN = "#ffaa00";

type PreloaderProps = {
  onComplete?: () => void;
};

type LedRowProps = {
  count: number;
};

type PanelProps = {
  children: React.ReactNode;
  label: string;
};

function LedRow({ count }: LedRowProps) {
  return (
    <div className="flex gap-[1.5px]" style={{ marginTop: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="led" style={{ width: 4, height: 7, borderRadius: 1, backgroundColor: ACCENT_DIM }} />
      ))}
    </div>
  );
}

function Panel({ children, label }: PanelProps) {
  return (
    <div className="p-[5px]" style={{ border: `1px solid ${ACCENT_LOW}`, backgroundColor: "rgba(0,0,0,0.55)" }}>
      <div style={{ fontSize: 5.5, letterSpacing: "0.12em", color: "rgba(0,166,255,0.22)", marginBottom: 3, fontFamily: "monospace" }}>
        -- {label} --
      </div>
      {children}
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
  const digitBox = useRef<HTMLDivElement>(null);
  const rangeEl = useRef<HTMLDivElement>(null);
  const statusEl = useRef<HTMLDivElement>(null);
  const progTrack = useRef<HTMLDivElement>(null);
  const progLabel = useRef<HTMLSpanElement>(null);
  const panelTL = useRef<HTMLDivElement>(null);
  const panelTR = useRef<HTMLDivElement>(null);
  const panelBL = useRef<HTMLDivElement>(null);
  const panelBR = useRef<HTMLDivElement>(null);
  const oscCanvas = useRef<HTMLCanvasElement>(null);
  const bottomBar = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);

  const d = useRef({
    count: 0,
    pct: 0,
    volt: 0,
    ohm: 0,
    amp: 0,
    freq: 0,
    dist: 0,
    temp: 18,
    phase: 0,
  });
  const oscTrails = useRef<number[][]>([]);

  const drawOsc = useCallback((ph: number) => {
    const cv = oscCanvas.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
    const W = cv.width;
    const H = cv.height;
    c.clearRect(0, 0, W, H);

    c.strokeStyle = "rgba(0,166,255,0.03)";
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

    c.strokeStyle = "rgba(0,166,255,0.06)";
    c.setLineDash([2, 3]);
    c.beginPath();
    c.moveTo(0, H / 2);
    c.lineTo(W, H / 2);
    c.stroke();
    c.setLineDash([]);

    const pts: number[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      pts.push(
        H / 2 +
          Math.sin(t * Math.PI * 6 + ph) * H * 0.22 +
          Math.sin(t * Math.PI * 14 + ph * 1.4) * H * 0.05 +
          (Math.random() - 0.5) * 0.6,
      );
    }

    oscTrails.current.push([...pts]);
    if (oscTrails.current.length > 3) oscTrails.current.shift();
    oscTrails.current.forEach((tr, ti) => {
      c.strokeStyle = `rgba(0,166,255,${((ti + 1) / oscTrails.current.length) * 0.05})`;
      c.lineWidth = 1;
      c.beginPath();
      tr.forEach((y, i) => {
        const x = (i / 120) * W;
        if (i) c.lineTo(x, y);
        else c.moveTo(x, y);
      });
      c.stroke();
    });

    c.strokeStyle = ACCENT;
    c.lineWidth = 1.5;
    c.shadowColor = ACCENT;
    c.shadowBlur = 3;
    c.beginPath();
    pts.forEach((y, i) => {
      const x = (i / 120) * W;
      if (i) c.lineTo(x, y);
      else c.moveTo(x, y);
    });
    c.stroke();
    c.shadowBlur = 0;

    c.font = "7px monospace";
    c.fillStyle = ACCENT;
    c.fillText("CH1", 3, 9);
    c.fillStyle = ACCENT_LOW;
    c.fillText("5V/div", W - 36, 9);
  }, []);

  const updateLeds = useCallback((container: HTMLDivElement | null, value: number, max: number) => {
    if (!container) return;
    const leds = container.querySelectorAll<HTMLDivElement>(".led");
    const filled = Math.round((value / max) * leds.length);
    leds.forEach((l, i) => {
      const on = i < filled;
      const ratio = i / leds.length;
      const c = on ? (ratio < 0.6 ? ACCENT : ratio < 0.85 ? WARN : RED) : ACCENT_DIM;
      l.style.backgroundColor = c;
      l.style.boxShadow = on ? `0 0 3px ${c}` : "none";
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

    const ctx = gsap.context(() => {
      const dd = d.current;
      const SEG: Record<string, number[]> = {
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

      const writeDigit = (el: HTMLDivElement | null, ch: string, color: string) => {
        if (!el) return;
        const bits = SEG[ch] || Array(7).fill(0);
        for (let i = 0; i < 7 && i < el.children.length; i++) {
          const s = el.children[i] as HTMLElement;
          s.style.backgroundColor = bits[i] ? color : ACCENT_DIM;
          s.style.boxShadow = bits[i] ? `0 0 8px ${color}, 0 0 2px ${color}` : "none";
        }
      };

      const tick = () => {
        const val = Math.min(Math.floor(dd.count), 9);
        writeDigit(digitBox.current, String(val), dd.count >= 9.5 ? GREEN : ACCENT);

        if (rangeEl.current) rangeEl.current.textContent = `RANGE  ${dd.dist.toFixed(1)}m`;
        drawOsc(dd.phase);

        setText(panelTR.current, "pv", `${dd.volt.toFixed(1)}V`);
        setText(panelTR.current, "pv2", `${Math.round(dd.freq)}Hz`);
        setText(panelBL.current, "pv", dd.ohm >= 1000 ? `${(dd.ohm / 1000).toFixed(1)} kOhm` : `${dd.ohm.toFixed(0)} Ohm`);
        setText(panelBR.current, "pv", `${dd.amp.toFixed(1)}A`);

        updateLeds(panelTR.current, dd.volt, 16);
        updateLeds(panelBL.current, dd.ohm, 3000);
        updateLeds(panelBR.current, dd.amp, 5);

        if (progTrack.current) {
          const segs = progTrack.current.querySelectorAll<HTMLDivElement>(".pseg");
          const filled = Math.round((dd.pct / 100) * segs.length);
          segs.forEach((s, i) => {
            const on = i < filled;
            s.style.backgroundColor = on ? ACCENT : ACCENT_DIM;
            s.style.boxShadow = on ? `0 0 3px ${ACCENT}` : "none";
          });
        }
        if (progLabel.current) progLabel.current.textContent = `${Math.round(dd.pct)}%`;

        if (radar.current) {
          const arc = radar.current.querySelector<SVGCircleElement>(".rprog");
          if (arc) {
            const c = 2 * Math.PI * 168;
            arc.setAttribute("stroke-dashoffset", String(c * (1 - dd.pct / 100)));
          }
        }
      };

      gsap.ticker.add(tick);

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.ticker.remove(tick);
          document.body.style.overflow = savedOv;
          if (overlay.current) overlay.current.style.display = "none";
          setGone(true);
          onComplete?.();
        },
      });

      tl.fromTo(scanlines.current, { opacity: 0 }, { opacity: 0.2, duration: 0.3 }, 0);
      tl.fromTo(vignette.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0);
      tl.fromTo(grid.current, { opacity: 0 }, { opacity: 0.1, duration: 0.6 }, 0.3);

      if (radar.current) {
        const rings = radar.current.querySelectorAll<SVGCircleElement>(".rring");
        rings.forEach((ring, i) => {
          const r = parseFloat(ring.getAttribute("r") || "0");
          const circ = 2 * Math.PI * r;
          ring.setAttribute("stroke-dasharray", String(circ));
          ring.setAttribute("stroke-dashoffset", String(circ));
          gsap.set(ring, { opacity: 0 });
          tl.to(ring, { attr: { "stroke-dashoffset": 0 }, opacity: 0.5, duration: 0.35 }, 0.5 + i * 0.06);
        });

        tl.fromTo(radar.current.querySelectorAll<SVGElement>(".rtick"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.002 }, 0.7);
        tl.fromTo(radar.current.querySelectorAll<SVGElement>(".rdeg"), { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.01 }, 0.8);
        tl.fromTo(radar.current.querySelectorAll<SVGElement>(".rrad"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.008 }, 0.7);

        const sweepLine = radar.current.querySelector<SVGElement>(".rsweep-line");
        const sweepGlow = radar.current.querySelector<SVGElement>(".rsweep-glow");
        if (sweepLine && sweepGlow) {
          const proxy = { a: 0 };
          tl.set([sweepLine, sweepGlow], { opacity: 0 });
          tl.to([sweepLine, sweepGlow], { opacity: 1, duration: 0.15 }, 0.9);
          tl.to(
            proxy,
            {
              a: 1080,
              duration: 5,
              ease: "none",
              onUpdate: () => {
                sweepLine.setAttribute("transform", `rotate(${proxy.a} 200 200)`);
                sweepGlow.setAttribute("transform", `rotate(${proxy.a} 200 200)`);
              },
            },
            0.9,
          );
          tl.to([sweepLine, sweepGlow], { opacity: 0, duration: 0.15 }, 5.2);
        }

        const targets = radar.current.querySelectorAll<SVGElement>(".rtarget");
        targets.forEach((t, i) => {
          gsap.set(t, { opacity: 0 });
          tl.to(t, { opacity: 1, duration: 0.2 }, 1 + i * 0.04);
        });

        const vulns = radar.current.querySelectorAll<SVGGElement>(".vdot");
        vulns.forEach((v, i) => {
          gsap.set(v, { opacity: 0 });
          tl.to(v, { opacity: 1, duration: 0.12 }, 2 + i * 0.6);
        });

        const progArc = radar.current.querySelector<SVGCircleElement>(".rprog");
        if (progArc) {
          const c = 2 * Math.PI * 168;
          progArc.setAttribute("stroke-dasharray", String(c));
          progArc.setAttribute("stroke-dashoffset", String(c));
          gsap.set(progArc, { opacity: 0 });
          tl.to(progArc, { opacity: 0.6, duration: 0.2 }, 1.2);
        }
      }

      tl.fromTo(crossT.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.25 }, 1.0);
      tl.fromTo(crossB.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.25 }, 1.0);
      tl.fromTo(crossL.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.25 }, 1.0);
      tl.fromTo(crossR.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.25 }, 1.0);

      tl.fromTo(digitBox.current, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" }, 1.2);
      tl.fromTo(rangeEl.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.3);

      [panelTL, panelTR, panelBL, panelBR].forEach((p, i) => {
        tl.fromTo(p.current, { opacity: 0, x: i % 2 === 0 ? -12 : 12 }, { opacity: 1, x: 0, duration: 0.35 }, 1.5 + i * 0.06);
      });

      tl.fromTo(statusEl.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.6);
      tl.fromTo(progTrack.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.65);
      tl.fromTo(progLabel.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.65);
      tl.fromTo(bottomBar.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.7);

      tl.to(dd, { phase: Math.PI * 12, duration: 4.5, ease: "none" }, 1.5);
      tl.to(dd, { count: 9, duration: 3, ease: "power1.in" }, 2.0);
      tl.to(dd, { pct: 99, duration: 3, ease: "power1.in" }, 2.0);
      tl.to(dd, { volt: 12.6, duration: 1.5 }, 2.0);
      tl.to(dd, { ohm: 2400, duration: 2 }, 2.2);
      tl.to(dd, { amp: 3.2, duration: 2 }, 2.0);
      tl.to(dd, { freq: 440, duration: 1.5 }, 2.3);
      tl.to(dd, { dist: 247.3, duration: 2 }, 2.0);
      tl.to(dd, { temp: 23.4, duration: 1 }, 2.0);

      tl.call(() => {
        if (statusEl.current) {
          statusEl.current.textContent = "3 VULNERABILITIES DETECTED";
          statusEl.current.style.color = WARN;
        }
      }, [], 5.0);
      tl.to(statusEl.current, { opacity: 0, duration: 0.04, repeat: 3, yoyo: true }, 5.0);

      tl.call(() => {
        dd.count = 10;
        dd.pct = 100;
        if (digitBox.current) {
          digitBox.current.innerHTML = `<span style="color:${GREEN};font-family:monospace;font-size:30px;font-weight:bold;text-shadow:0 0 12px ${GREEN},0 0 25px ${GREEN};letter-spacing:0.15em">OK</span>`;
        }
        if (statusEl.current) {
          statusEl.current.textContent = "SYSTEM SECURED";
          statusEl.current.style.color = GREEN;
        }
      }, [], 5.3);

      tl.to(flash.current, { opacity: 0.3, duration: 0.04 }, 5.3);
      tl.to(flash.current, { opacity: 0, duration: 0.12 }, 5.34);

      if (radar.current) {
        tl.to(radar.current.querySelectorAll(".rring, .rtarget, .rprog"), { attr: { stroke: GREEN }, duration: 0.12 }, 5.3);
        tl.to(radar.current.querySelectorAll(".vdot circle"), { attr: { fill: GREEN, stroke: GREEN }, duration: 0.12 }, 5.3);
        tl.to(radar.current.querySelectorAll(".vdot text"), { attr: { fill: GREEN }, duration: 0.12 }, 5.3);
      }

      [panelTL, panelTR, panelBL, panelBR].forEach((p, i) => {
        tl.to(p.current, { opacity: 0, duration: 0.25 }, 5.8 + i * 0.02);
      });
      tl.to([crossT.current, crossB.current], { scaleY: 0, opacity: 0, duration: 0.25 }, 5.8);
      tl.to([crossL.current, crossR.current], { scaleX: 0, opacity: 0, duration: 0.25 }, 5.8);
      tl.to(digitBox.current, { opacity: 0, scale: 0.3, duration: 0.2 }, 5.85);
      tl.to([statusEl.current, rangeEl.current, progTrack.current, progLabel.current], { opacity: 0, duration: 0.15 }, 5.85);
      tl.to(radar.current, { opacity: 0, scale: 0.5, duration: 0.3 }, 5.8);
      tl.to([grid.current, bottomBar.current], { opacity: 0, duration: 0.15 }, 5.9);
      tl.to(overlay.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 6.2);
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = savedOv;
    };
  }, [drawOsc, onComplete, setText, updateLeds]);

  if (gone) return null;

  const CX = 200;
  const R = [38, 62, 90, 122, 152];

  const sH: React.CSSProperties = { position: "absolute", left: 5, right: 5, height: 3.5, borderRadius: 1.5, backgroundColor: ACCENT_DIM };
  const sVL: React.CSSProperties = { position: "absolute", left: 0, width: 3.5, borderRadius: 1.5, backgroundColor: ACCENT_DIM };
  const sVR: React.CSSProperties = { position: "absolute", right: 0, width: 3.5, borderRadius: 1.5, backgroundColor: ACCENT_DIM };

  return (
    <div ref={root}>
      <div ref={overlay} className="fixed inset-0 z-[9999]" style={{ backgroundColor: "var(--bg-primary,#060a10)" }}>
        <div ref={scanlines} className="absolute inset-0 pointer-events-none opacity-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,166,255,0.006) 1px,rgba(0,166,255,0.006) 2px)" }} />
        <div ref={vignette} className="absolute inset-0 pointer-events-none opacity-0" style={{ background: "radial-gradient(ellipse at center,transparent 15%,rgba(0,0,0,0.5) 48%,rgba(0,0,0,0.92) 75%,rgba(0,0,0,0.99) 100%)" }} />
        <div
          ref={grid}
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,166,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,166,255,0.04) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse at center,black 10%,transparent 42%)",
            WebkitMaskImage: "radial-gradient(ellipse at center,black 10%,transparent 42%)",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg ref={radar} viewBox="0 0 400 400" className="w-[min(65vw,65vh,380px)] h-[min(65vw,65vh,380px)]" style={{ marginTop: "-3%" }}>
            {R.map((r, i) => (
              <circle key={i} className="rring" cx={CX} cy={CX} r={r} fill="none" stroke={i < 3 ? ACCENT : "rgba(0,166,255,0.18)"} strokeWidth={i === 0 ? 1 : i < 3 ? 0.5 : 0.3} opacity="0" />
            ))}
            {Array.from({ length: 72 }).map((_, i) => {
              const a = (i * 5 * Math.PI) / 180;
              const maj = i % 6 === 0;
              const r1 = R[4] - (maj ? 7 : 2.5);
              const r2 = R[4] + 1.5;
              return <line key={i} className="rtick" x1={CX + Math.cos(a) * r1} y1={CX + Math.sin(a) * r1} x2={CX + Math.cos(a) * r2} y2={CX + Math.sin(a) * r2} stroke={maj ? ACCENT : "rgba(0,166,255,0.1)"} strokeWidth={maj ? 0.6 : 0.2} opacity="0" />;
            })}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const a = (deg * Math.PI) / 180;
              return (
                <text key={i} className="rdeg" x={CX + Math.cos(a) * (R[4] + 12)} y={CX + Math.sin(a) * (R[4] + 12) + 1} textAnchor="middle" dominantBaseline="central" fill="rgba(0,166,255,0.15)" fontSize="6" fontFamily="monospace" opacity="0">
                  {deg}d
                </text>
              );
            })}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return <line key={i} className="rrad" x1={CX + Math.cos(a) * 25} y1={CX + Math.sin(a) * 25} x2={CX + Math.cos(a) * (R[4] - 8)} y2={CX + Math.sin(a) * (R[4] - 8)} stroke="rgba(0,166,255,0.025)" strokeWidth={0.3} opacity="0" />;
            })}
            <line className="rsweep-line" x1={CX} y1={CX} x2={CX + R[4]} y2={CX} stroke={ACCENT} strokeWidth={0.7} opacity="0" />
            <path className="rsweep-glow" d={`M${CX},${CX} L${CX + R[4]},${CX - 8} L${CX + R[4]},${CX + 8}Z`} fill={ACCENT} fillOpacity={0.05} opacity="0" />

            {[{ a: 52, r: 72, t: "PORT 443" }, { a: 168, r: 100, t: "SQL INJ" }, { a: 290, r: 50, t: "XSS" }].map((v, i) => {
              const rad = (v.a * Math.PI) / 180;
              const vx = CX + Math.cos(rad) * v.r;
              const vy = CX + Math.sin(rad) * v.r;
              return (
                <g key={i} className="vdot" opacity="0">
                  <circle cx={vx} cy={vy} r={3} fill={RED} style={{ filter: `drop-shadow(0 0 3px ${RED})` }} />
                  <circle cx={vx} cy={vy} r={6} fill="none" stroke={RED} strokeWidth={0.3} opacity={0.35} />
                  <text x={vx + 9} y={vy + 2} fill={RED} fontSize="4.5" fontFamily="monospace">{v.t}</text>
                </g>
              );
            })}

            <rect className="rtarget" x={CX - 15} y={CX - 15} width={30} height={30} fill="none" stroke={ACCENT} strokeWidth={0.8} transform={`rotate(45 ${CX} ${CX})`} opacity="0" />
            <rect className="rtarget" x={CX - 8} y={CX - 8} width={16} height={16} fill="none" stroke={ACCENT} strokeWidth={0.5} transform={`rotate(45 ${CX} ${CX})`} opacity="0" />
            <circle className="rtarget" cx={CX} cy={CX} r={1.5} fill={ACCENT} opacity="0" style={{ filter: `drop-shadow(0 0 3px ${ACCENT})` }} />
            <circle className="rprog" cx={CX} cy={CX} r={168} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeLinecap="round" opacity="0" transform={`rotate(-90 ${CX} ${CX})`} style={{ filter: `drop-shadow(0 0 2px ${ACCENT})` }} />
          </svg>
        </div>

        <div ref={crossT} className="absolute left-1/2 top-0 opacity-0" style={{ width: 1, height: "calc(50% - 170px)", transform: "translateX(-0.5px)", transformOrigin: "bottom", background: `linear-gradient(to bottom, transparent 45%, ${ACCENT}35)` }} />
        <div ref={crossB} className="absolute left-1/2 bottom-0 opacity-0" style={{ width: 1, height: "calc(50% - 170px)", transform: "translateX(-0.5px)", transformOrigin: "top", background: `linear-gradient(to top, transparent 45%, ${ACCENT}35)` }} />
        <div ref={crossL} className="absolute top-1/2 left-0 opacity-0" style={{ height: 1, width: "calc(50% - 170px)", transform: "translateY(-0.5px)", transformOrigin: "right", background: `linear-gradient(to right, transparent 45%, ${ACCENT}35)` }} />
        <div ref={crossR} className="absolute top-1/2 right-0 opacity-0" style={{ height: 1, width: "calc(50% - 170px)", transform: "translateY(-0.5px)", transformOrigin: "left", background: `linear-gradient(to left, transparent 45%, ${ACCENT}35)` }} />

        <div ref={rangeEl} className="absolute left-1/2 -translate-x-1/2 opacity-0" style={{ top: "3%", fontFamily: "monospace", fontSize: 11, color: ACCENT, textShadow: `0 0 4px ${ACCENT}`, letterSpacing: "0.15em", fontVariantNumeric: "tabular-nums" }}>
          RANGE  0.0m
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex items-center justify-center" style={{ marginTop: 10 }}>
          <div ref={digitBox} className="relative opacity-0" style={{ width: 26, height: 44 }}>
            <div style={{ ...sH, top: 0 }} />
            <div style={{ ...sVL, top: 5, height: "calc(50% - 5px)" }} />
            <div style={{ ...sVR, top: 5, height: "calc(50% - 5px)" }} />
            <div style={{ ...sH, top: "calc(50% - 1.75px)" }} />
            <div style={{ ...sVL, top: "50%", height: "calc(50% - 5px)" }} />
            <div style={{ ...sVR, top: "50%", height: "calc(50% - 5px)" }} />
            <div style={{ ...sH, bottom: 0 }} />
          </div>
        </div>

        <div ref={statusEl} className="absolute left-1/2 -translate-x-1/2 opacity-0" style={{ top: "86%", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.18em", color: ACCENT, textShadow: `0 0 3px ${ACCENT}` }}>
          SCANNING...
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ top: "90%" }}>
          <div ref={progTrack} className="flex gap-[1px] opacity-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="pseg" style={{ width: 3, height: 6, borderRadius: 0.5, backgroundColor: ACCENT_DIM }} />
            ))}
          </div>
          <span ref={progLabel} className="opacity-0" style={{ fontFamily: "monospace", fontSize: 7, color: ACCENT, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums", minWidth: 22, textAlign: "right" }}>
            0%
          </span>
        </div>

        <div ref={panelTL} className="absolute opacity-0" style={{ left: "2%", top: "10%", maxWidth: "23%" }}>
          <Panel label="WAVEFORM">
            <canvas ref={oscCanvas} width={160} height={48} className="block w-full" style={{ border: "1px solid rgba(0,166,255,0.03)" }} />
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 5.5, color: "rgba(0,166,255,0.18)", marginTop: 2 }}>
              <span>CH1 ACTIVE</span>
              <span>5V/div</span>
            </div>
          </Panel>
        </div>

        <div ref={panelTR} className="absolute opacity-0" style={{ right: "2%", top: "10%", maxWidth: "23%" }}>
          <Panel label="VOLTAGE">
            <div className="pv" style={{ fontFamily: "monospace", fontSize: 20, fontWeight: "bold", color: ACCENT, textShadow: `0 0 6px ${ACCENT}`, fontVariantNumeric: "tabular-nums" }}>
              0.0V
            </div>
            <LedRow count={14} />
            <div className="pv2" style={{ fontFamily: "monospace", fontSize: 6, color: "rgba(0,166,255,0.2)", marginTop: 3 }}>
              0Hz
            </div>
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 5, color: "rgba(0,166,255,0.15)", marginTop: 2 }}>
              <span>MIN 11.8</span>
              <span>MAX 14.2</span>
            </div>
          </Panel>
        </div>

        <div ref={panelBL} className="absolute opacity-0" style={{ left: "2%", bottom: "14%", maxWidth: "23%" }}>
          <Panel label="IMPEDANCE">
            <div className="pv" style={{ fontFamily: "monospace", fontSize: 18, fontWeight: "bold", color: ACCENT, textShadow: `0 0 5px ${ACCENT}`, fontVariantNumeric: "tabular-nums" }}>
              0 Ohm
            </div>
            <LedRow count={14} />
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 5, color: "rgba(0,166,255,0.15)", marginTop: 3 }}>
              <span>MEASURING</span>
              <span>AUTO</span>
            </div>
          </Panel>
        </div>

        <div ref={panelBR} className="absolute opacity-0" style={{ right: "2%", bottom: "14%", maxWidth: "23%" }}>
          <Panel label="LOAD">
            <div className="pv" style={{ fontFamily: "monospace", fontSize: 18, fontWeight: "bold", color: ACCENT, textShadow: `0 0 5px ${ACCENT}`, fontVariantNumeric: "tabular-nums" }}>
              0.0A
            </div>
            <LedRow count={12} />
            <div className="flex justify-between" style={{ fontFamily: "monospace", fontSize: 5, color: "rgba(0,166,255,0.15)", marginTop: 3 }}>
              <span>Pk: 0.0A</span>
              <span className="pv">ACTIVE</span>
            </div>
          </Panel>
        </div>

        <div ref={bottomBar} className="absolute left-0 right-0 flex justify-center gap-5 opacity-0" style={{ bottom: "2%", fontFamily: "monospace", fontSize: 6, color: "rgba(0,166,255,0.12)" }}>
          <span>48d51&apos;24&quot;N 2d21&apos;07&quot;E</span>
          <span>23.4C</span>
          <span>SYS v3.7.1</span>
        </div>

        <div ref={flash} className="absolute inset-0 pointer-events-none opacity-0 bg-white" />
      </div>
    </div>
  );
}
