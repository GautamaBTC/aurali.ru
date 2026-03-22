"use client";

import { useEffect, useRef } from "react";

type Config = {
  getVoltage: () => number;
  getCurrent: () => number;
  getColor: () => string;
  getFrequency: () => number;
  getVpp: () => number;
  isActive: boolean;
};

export function useOscilloscope(config: Config) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const trailsRef = useRef<Array<{ pts: Float32Array; color: string }>>([]);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const TRAIL_MAX = 5;
    const POINTS = 300;

    const tick = () => {
      if (!configRef.current.isActive || W === 0 || H === 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const voltage = configRef.current.getVoltage();
      const current = configRef.current.getCurrent();
      const color = configRef.current.getColor();
      const freq = configRef.current.getFrequency();
      const vpp = configRef.current.getVpp();

      phaseRef.current += 0.018 + freq * 0.00015;
      ctx.clearRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      const midV = H * 0.4;
      const ampV = Math.min(H * 0.3, vpp * H * 0.06 + voltage * 0.3);
      const noiseAmt = current > 30 ? 0.18 : current > 10 ? 0.07 : 0.02;

      const pts = new Float32Array(POINTS * 2);
      for (let i = 0; i < POINTS; i += 1) {
        const t = i / POINTS;
        const x = t * W;
        let y = Math.sin(phaseRef.current + t * Math.PI * 2 * 4) * ampV;
        y += Math.sin(phaseRef.current * 1.7 + t * Math.PI * 2 * 8) * ampV * 0.12;
        y += Math.sin(phaseRef.current * 0.4 + t * Math.PI * 2 * 16) * ampV * 0.05;
        y += Math.sin(phaseRef.current * 2.5 + t * Math.PI * 2 * freq * 0.1) * vpp * 3;
        y += (Math.random() - 0.5) * ampV * noiseAmt;
        pts[i * 2] = x;
        pts[i * 2 + 1] = midV + y;
      }

      trailsRef.current.unshift({ pts, color });
      if (trailsRef.current.length > TRAIL_MAX) trailsRef.current.pop();

      for (let t = trailsRef.current.length - 1; t >= 0; t -= 1) {
        const trail = trailsRef.current[t]!;
        const alpha = t === 0 ? 0.75 : (1 - t / TRAIL_MAX) * 0.12;
        ctx.beginPath();
        for (let i = 0; i < POINTS; i += 1) {
          const x = trail.pts[i * 2]!;
          const y = trail.pts[i * 2 + 1]!;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = trail.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = t === 0 ? 1.5 : 0.5;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < POINTS; i += 1) {
        const x = pts[i * 2]!;
        const y = pts[i * 2 + 1]!;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 10;
      ctx.filter = "blur(8px)";
      ctx.stroke();
      ctx.filter = "none";

      const midA = H * 0.8;
      const ampA = Math.min(H * 0.1, current * 0.25);
      ctx.beginPath();
      for (let i = 0; i < POINTS; i += 2) {
        const t = i / POINTS;
        const x = t * W;
        let y = Math.sin(phaseRef.current * 1.1 + t * Math.PI * 2 * 4) * ampA;
        y += (Math.random() - 0.5) * ampA * 0.12;
        if (i === 0) ctx.moveTo(x, midA + y);
        else ctx.lineTo(x, midA + y);
      }
      ctx.strokeStyle = "#22d3ee";
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.globalAlpha = 0.35;
      drawTriangle(ctx, 0, midV, 6, color);
      ctx.globalAlpha = 0.25;
      drawTriangle(ctx, 0, midA, 5, "#22d3ee");
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return canvasRef;
}

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y - size * 0.7);
  ctx.lineTo(x + size, y + size * 0.7);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cols = 10;
  const rows = 8;

  for (let i = 0; i <= cols; i += 1) {
    const x = Math.round((i / cols) * W) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.strokeStyle = i === cols / 2 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.025)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  for (let i = 0; i <= rows; i += 1) {
    const y = Math.round((i / rows) * H) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.strokeStyle = i === Math.round(rows * 0.4) ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.025)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}
