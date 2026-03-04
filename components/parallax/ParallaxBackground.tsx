"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlowParticles } from "@/components/parallax/GlowParticles";
import { useIsMobile } from "@/hooks/useIsMobile";

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

interface Layer {
  id: string;
  className: string;
  scrollSpeed: number;
  mouseSpeed: number;
  blur: number;
  breathe?: boolean;
  showOnMobile: boolean;
}

const LAYERS: readonly Layer[] = [
  {
    id: "deep-radial",
    className: "absolute inset-0 scale-[1.5]",
    scrollSpeed: 0.08,
    mouseSpeed: 0.003,
    blur: 0,
    showOnMobile: true,
  },
  {
    id: "aurora-1",
    className: "absolute -left-[15%] -top-[30%] h-[80vh] w-[80vw] rounded-full",
    scrollSpeed: 0.22,
    mouseSpeed: 0.015,
    blur: 80,
    breathe: true,
    showOnMobile: true,
  },
  {
    id: "aurora-2",
    className: "absolute -right-[20%] top-[20%] h-[70vh] w-[75vw] rounded-full",
    scrollSpeed: 0.38,
    mouseSpeed: 0.025,
    blur: 100,
    breathe: true,
    showOnMobile: true,
  },
  {
    id: "aurora-3",
    className: "absolute left-[10%] top-[60%] h-[50vh] w-[60vw] rounded-full",
    scrollSpeed: 0.5,
    mouseSpeed: 0.03,
    blur: 120,
    breathe: true,
    showOnMobile: false,
  },
  {
    id: "light-streak",
    className: "absolute inset-0",
    scrollSpeed: 0.6,
    mouseSpeed: 0.035,
    blur: 0,
    showOnMobile: false,
  },
  {
    id: "vignette",
    className: "absolute inset-0",
    scrollSpeed: 0,
    mouseSpeed: 0,
    blur: 0,
    showOnMobile: true,
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
  const videoLayerRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const grainRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();

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

    const mob = isMobile ? 0.4 : 1;
    const k = intensity * mob;
    const activeLayers = LAYERS.map((layer, index) => ({ layer, index })).filter((item) => (isMobile ? item.layer.showOnMobile : true));

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2 });

      activeLayers.forEach(({ index }, i) => {
        const el = layerRefs.current[index];
        if (!el) return;
        intro.fromTo(el, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" }, i * 0.1);
      });

      if (!isMobile) {
        activeLayers.forEach(({ layer, index }) => {
          const el = layerRefs.current[index];
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
      }

      activeLayers.forEach(({ layer, index }, i) => {
        const el = layerRefs.current[index];
        if (!el || !layer.breathe) return;

        gsap.to(el, {
          scale: 1.06 + i * 0.02,
          rotation: isMobile ? 0 : 8 - i * 4,
          duration: isMobile ? 12 + i * 2 : 8 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        if (!isMobile) {
          gsap.to(el, {
            x: `+=${30 + i * 15}`,
            y: `+=${20 - i * 10}`,
            duration: 12 + i * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 1.5,
          });
        }
      });

      if (!isMobile && grainRef.current) {
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

    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      animId = window.requestAnimationFrame(tick);
    }

    return () => {
      ctx.revert();
      if (!isMobile) {
        window.removeEventListener("mousemove", onMouseMove);
        window.cancelAnimationFrame(animId);
      }
    };
  }, [intensity, isMobile]);

  useEffect(() => {
    const layer = videoLayerRef.current;
    if (!layer) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isMobile) return;

    const scrollState = { current: 0, target: 0 };
    let raf = 0;
    const speed = 0.075;
    const smooth = 0.045;

    const tick = () => {
      scrollState.current = lerp(scrollState.current, scrollState.target, smooth);
      layer.style.transform = `translate3d(0, ${scrollState.current.toFixed(2)}px, 0)`;
      raf = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      scrollState.target = Math.min(260, window.scrollY * speed);
    };

    onScroll();
    raf = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-0">
      <div ref={videoLayerRef} className="absolute inset-[-12%] will-change-transform">
        <video
          className="h-full w-full object-cover object-center opacity-[0.5]"
          src="/uploads/videos/hader.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,20,0.2)_0%,rgba(5,10,20,0.46)_48%,rgba(5,10,20,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,240,255,0.15),transparent_45%),radial-gradient(circle_at_86%_92%,rgba(204,255,0,0.12),transparent_38%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(224,230,237,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(224,230,237,0.22) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className={`${isMobile ? "opacity-85" : "hidden md:block opacity-85"}`}>
        {LAYERS.map((layer, i) => (
          <div
            key={layer.id}
            ref={setLayerRef(i)}
            className={`${layer.className} ${layer.showOnMobile ? "" : "hidden md:block"}`}
            style={{
              ...layerStyleById[layer.id],
              willChange: isMobile ? "auto" : "transform",
              filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
            }}
          />
        ))}

        {!isMobile ? <GlowParticles /> : null}

        <div
          ref={grainRef}
          className="absolute inset-0 hidden mix-blend-overlay opacity-[0.03] md:block"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
            willChange: "background-position",
          }}
        />
      </div>
    </div>
  );
}
