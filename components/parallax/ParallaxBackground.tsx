"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlowParticles } from "@/components/parallax/GlowParticles";

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

interface Layer {
  id: string;
  className: string;
  scrollSpeed: number;
  mouseSpeed: number;
  blur: number;
  breathe?: boolean;
}

const LAYERS: readonly Layer[] = [
  {
    id: "deep-radial",
    className: "absolute inset-0 scale-[1.5]",
    scrollSpeed: 0.08,
    mouseSpeed: 0.003,
    blur: 0,
  },
  {
    id: "aurora-1",
    className: "absolute -left-[15%] -top-[30%] h-[80vh] w-[80vw] rounded-full",
    scrollSpeed: 0.22,
    mouseSpeed: 0.015,
    blur: 80,
    breathe: true,
  },
  {
    id: "aurora-2",
    className: "absolute -right-[20%] top-[20%] h-[70vh] w-[75vw] rounded-full",
    scrollSpeed: 0.38,
    mouseSpeed: 0.025,
    blur: 100,
    breathe: true,
  },
  {
    id: "aurora-3",
    className: "absolute left-[10%] top-[60%] h-[50vh] w-[60vw] rounded-full",
    scrollSpeed: 0.5,
    mouseSpeed: 0.03,
    blur: 120,
    breathe: true,
  },
  {
    id: "light-streak",
    className: "absolute inset-0",
    scrollSpeed: 0.6,
    mouseSpeed: 0.035,
    blur: 0,
  },
  {
    id: "vignette",
    className: "absolute inset-0",
    scrollSpeed: 0,
    mouseSpeed: 0,
    blur: 0,
  },
];

const layerStyleById: Record<string, React.CSSProperties> = {
  "deep-radial": {
    background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(20,50,120,0.5), transparent 65%)",
  },
  "aurora-1": {
    background: "radial-gradient(circle, rgba(56,130,220,0.22), transparent 50%)",
  },
  "aurora-2": {
    background: "radial-gradient(circle, rgba(120,50,200,0.16), transparent 45%)",
  },
  "aurora-3": {
    background: "radial-gradient(circle, rgba(0,200,180,0.1), transparent 50%)",
  },
  "light-streak": {
    background:
      "linear-gradient(125deg, transparent 35%, rgba(255,255,255,0.018) 48%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.018) 52%, transparent 65%)",
  },
  vignette: {
    background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
  },
};

interface Props {
  intensity?: number;
}

export default function ParallaxBackground({ intensity = 1 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const grainRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const isMobile = useRef(false);

  const setLayerRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      layerRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(containerRef.current, { opacity: 1 });
      return;
    }

    isMobile.current = window.matchMedia("(max-width: 768px)").matches;
    const mob = isMobile.current ? 0.4 : 1;
    const k = intensity * mob;

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2 });

      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        intro.fromTo(el, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" }, i * 0.1);
      });

      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el || layer.scrollSpeed === 0) return;
        gsap.to(el, {
          y: () => layer.scrollSpeed * k * window.innerHeight * 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        });
      });

      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el || !layer.breathe) return;

        gsap.to(el, {
          scale: 1.08 + i * 0.03,
          rotation: 8 - i * 4,
          duration: 8 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(el, {
          x: `+=${30 + i * 15}`,
          y: `+=${20 - i * 10}`,
          duration: 12 + i * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.5,
        });
      });

      if (grainRef.current) {
        gsap.to(grainRef.current, {
          backgroundPosition: "100% 100%",
          duration: 0.4,
          repeat: -1,
          ease: "steps(4)",
        });
      }
    }, containerRef);

    let animId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const lerpFactor = 0.06;

    const tick = () => {
      smoothMouse.current.x = lerp(smoothMouse.current.x, mouse.current.x, lerpFactor);
      smoothMouse.current.y = lerp(smoothMouse.current.y, mouse.current.y, lerpFactor);

      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el || layer.mouseSpeed === 0) return;
        const moveX = smoothMouse.current.x * layer.mouseSpeed * window.innerWidth * k;
        gsap.set(el, { x: moveX, overwrite: "auto" });
      });

      animId = window.requestAnimationFrame(tick);
    };

    if (!isMobile.current) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      animId = window.requestAnimationFrame(tick);
    }

    return () => {
      ctx.revert();
      if (!isMobile.current) {
        window.removeEventListener("mousemove", onMouseMove);
        window.cancelAnimationFrame(animId);
      }
    };
  }, [intensity]);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-0">
      {LAYERS.map((layer, i) => (
        <div
          key={layer.id}
          ref={setLayerRef(i)}
          className={layer.className}
          style={{
            ...layerStyleById[layer.id],
            willChange: "transform",
            filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
          }}
        />
      ))}

      <GlowParticles />

      <div
        ref={grainRef}
        className="absolute inset-0 mix-blend-overlay opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          willChange: "background-position",
        }}
      />
    </div>
  );
}
