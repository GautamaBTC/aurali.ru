"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type ParallaxImageProps = {
  src: string;
  alt: string;
  speed?: number;
  overlay?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

export function ParallaxImage({
  src,
  alt,
  speed = -0.3,
  overlay = "bg-[var(--bg-primary)]/60",
  className,
  imgClassName,
  priority = false,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const tween = gsap.to(img, {
      yPercent: speed * 30,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return (
    <div ref={wrapRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <div ref={imgRef} className="absolute inset-0 will-change-transform" style={{ scale: 1 + Math.abs(speed) * 0.3 }}>
        <Image src={src} alt={alt} fill priority={priority} className={cn("object-cover", imgClassName)} sizes="100vw" />
      </div>
      {overlay ? <div className={cn("absolute inset-0", overlay)} /> : null}
    </div>
  );
}
