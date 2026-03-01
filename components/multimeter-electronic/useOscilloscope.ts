"use client";

import { useEffect, useRef } from "react";

type OscilloscopeConfig = {
  getVoltage: () => number;
  getCurrent: () => number;
  getColor: () => string;
  reducedMotion: boolean;
};

export function useOscilloscope({ getVoltage, getCurrent, getColor, reducedMotion }: OscilloscopeConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);

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

    const tick = () => {
      if (W === 0 || H === 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      if (reducedMotion) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const voltage = getVoltage();
      const current = getCurrent();
      const color = getColor();
      phaseRef.current += 0.025;

      const mid = H * 0.45;
      const amp = Math.min(H * 0.35, voltage * H * 0.018);
      const noise = current > 20 ? 0.15 : 0.03;

      const points: Array<{ x: number; y: number }> = [];
      for (let i = 0; i <= W; i += 2) {
        const t = i / W;
        let y = Math.sin(phaseRef.current + t * Math.PI * 2 * 4) * amp;
        y += Math.sin(phaseRef.current * 1.7 + t * Math.PI * 2 * 8) * amp * 0.15;
        y += Math.sin(phaseRef.current * 0.3 + t * Math.PI * 2 * 2) * amp * 0.25;
        y += (Math.random() - 0.5) * amp * noise;
        y += Math.sin(phaseRef.current * 3 + t * Math.PI * 2 * 12) * current * 0.08;
        points.push({ x: i, y: mid + y });
      }

      ctx.beginPath();
      points.forEach((p, j) => {
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.beginPath();
      points.forEach((p, j) => {
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 6;
      ctx.filter = "blur(4px)";
      ctx.stroke();
      ctx.filter = "none";

      const mid2 = H * 0.8;
      const amp2 = Math.min(H * 0.12, current * 0.3);
      ctx.beginPath();
      for (let i = 0; i <= W; i += 2) {
        const t = i / W;
        const y = Math.sin(phaseRef.current * 1.2 + t * Math.PI * 2 * 4) * amp2 + (Math.random() - 0.5) * amp2 * 0.1;
        if (i === 0) ctx.moveTo(i, mid2 + y);
        else ctx.lineTo(i, mid2 + y);
      }
      ctx.strokeStyle = "#22d3ee";
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(6, mid - 4);
      ctx.lineTo(6, mid + 4);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.fill();

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [getVoltage, getCurrent, getColor, reducedMotion]);

  return canvasRef;
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cols = 10;
  const rows = 6;

  for (let i = 0; i <= cols; i += 1) {
    const x = (i / cols) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.strokeStyle = i === cols / 2 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
    ctx.lineWidth = i === cols / 2 ? 0.8 : 0.5;
    ctx.stroke();
  }

  for (let i = 0; i <= rows; i += 1) {
    const y = (i / rows) * H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.strokeStyle = i === Math.floor(rows * 0.45) ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  const midX = W / 2;
  const midY = H * 0.45;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (let i = -20; i <= 20; i += 1) {
    ctx.fillRect(midX + i * (W / cols / 5), midY, 0.5, 0.5);
    ctx.fillRect(midX, midY + i * (H / rows / 5), 0.5, 0.5);
  }
}
