"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";
import { getIsMobile, useIsMobile } from "@/hooks/useIsMobile";
import { shouldReduceMotionInBrowser } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export type ParallaxLayer = {
  id: string;
  speed: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  z?: number;
  scale?: number;
  opacityRange?: [number, number];
  rotate?: number;
};

type ParallaxSectionProps = {
  layers: ParallaxLayer[];
  children: ReactNode;
  className?: string;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  pin?: boolean;
};

export function ParallaxSection({
  layers,
  children,
  className,
  scrub = 1,
  start = "top bottom",
  end = "bottom top",
  pin = false,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (getIsMobile()) return;
    if (shouldReduceMotionInBrowser()) return;

    const mm = gsap.matchMedia();
    const tweens: gsap.core.Tween[] = [];

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
      },
      () => {
        const speedMultiplier = 1;

        layers.forEach((layer, i) => {
          const el = layerRefs.current[i];
          if (!el) return;

          const adjustedSpeed = layer.speed * speedMultiplier;
          const distance = adjustedSpeed * 100;
          const tweenVars: gsap.TweenVars = {
            y: `${distance}%`,
            ease: "none",
          };

          if (layer.opacityRange) {
            gsap.set(el, { opacity: layer.opacityRange[0] });
            tweenVars.opacity = layer.opacityRange[1];
          }

          if (layer.rotate) {
            tweenVars.rotation = layer.rotate * speedMultiplier;
          }

          const tween = gsap.to(el, {
            ...tweenVars,
            scrollTrigger: {
              trigger: section,
              start,
              end,
              scrub: typeof scrub === "boolean" ? (scrub ? 1 : 0) : scrub,
              pin: i === 0 ? pin : false,
              invalidateOnRefresh: true,
            },
          });

          tweens.push(tween);
        });
      },
    );

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      mm.revert();
    };
  }, [end, layers, pin, scrub, start]);

  return (
    <section ref={sectionRef} className={cn(isMobile ? "relative overflow-visible" : "relative overflow-hidden", className)}>
      {!isMobile
        ? layers.map((layer, i) => (
            <div
              key={layer.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className={cn("pointer-events-none absolute inset-0 will-change-transform", layer.className)}
              style={{
                zIndex: layer.z ?? i,
                scale: layer.scale ?? 1,
                ...layer.style,
              }}
            >
              {layer.children}
            </div>
          ))
        : null}

      <div className="relative z-50">{children}</div>
    </section>
  );
}
