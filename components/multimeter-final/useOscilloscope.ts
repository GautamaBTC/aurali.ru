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
  const trailsRef = useRef<Array<{ points: Float32Array; color: string }>>([]);
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

    const TRAIL_MAX = 4;
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

      phaseRef.current += 0.02 + freq * 0.0002;
      ctx.clearRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      const midV = H * 0.4;
      const ampV = Math.min(H * 0.3, vpp * H * 0.06 + voltage * 0.3);
      const noiseScale = current > 30 ? 0.2 : current > 10 ? 0.08 : 0.02;

      const newPoints = new Float32Array(POINTS * 2);
      for (let i = 0; i < POINTS; i += 1) {
        const t = i / POINTS;
        const x = t * W;

        let y = Math.sin(phaseRef.current + t * Math.PI * 2 * 4) * ampV;
        y += Math.sin(phaseRef.current * 1.7 + t * Math.PI * 2 * 8) * ampV * 0.12;
        y += Math.sin(phaseRef.current * 0.4 + t * Math.PI * 2 * 16) * ampV * 0.06;
        y += Math.sin(phaseRef.current * 2.5 + t * Math.PI * 2 * freq * 0.1) * vpp * 3;
        y += (Math.random() - 0.5) * ampV * noiseScale;

        newPoints[i * 2] = x;
        newPoints[i * 2 + 1] = midV + y;
      }

      trailsRef.current.unshift({ points: newPoints, color });
      if (trailsRef.current.length > TRAIL_MAX) trailsRef.current.pop();

      for (let t = trailsRef.current.length - 1; t >= 0; t -= 1) {
        const trail = trailsRef.current[t]!;
        const alpha = t === 0 ? 0.7 : (1 - t / TRAIL_MAX) * 0.15;
        ctx.beginPath();
        for (let i = 0; i < POINTS; i += 1) {
          const x = trail.points[i * 2]!;
          const y = trail.points[i * 2 + 1]!;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = trail.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = t === 0 ? 1.5 : 0.6;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < POINTS; i += 1) {
        const x = newPoints[i * 2]!;
        const y = newPoints[i * 2 + 1]!;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 8;
      ctx.filter = "blur(6px)";
      ctx.stroke();
      ctx.filter = "none";

      const midA = H * 0.78;
      const ampA = Math.min(H * 0.1, current * 0.25);
      ctx.beginPath();
      for (let i = 0; i < POINTS; i += 2) {
        const tt = i / POINTS;
        const x = tt * W;
        let y = Math.sin(phaseRef.current * 1.1 + tt * Math.PI * 2 * 4) * ampA;
        y += (Math.random() - 0.5) * ampA * 0.15;
        if (i === 0) ctx.moveTo(x, midA + y);
        else ctx.lineTo(x, midA + y);
      }
      ctx.strokeStyle = "#22d3ee";
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.stroke();

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

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cols = 10;
  const rows = 8;

  for (let i = 0; i <= cols; i += 1) {
    const x = Math.round((i / cols) * W) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.strokeStyle = i === cols / 2 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  for (let i = 0; i <= rows; i += 1) {
    const y = Math.round((i / rows) * H) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.strokeStyle = i === Math.round(rows * 0.4) ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}
