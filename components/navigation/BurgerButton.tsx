"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

type BurgerButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

export function BurgerButton({ isOpen, onToggle, className }: BurgerButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
      });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    const btn = buttonRef.current;
    if (!l1 || !l2 || !l3 || !btn) return;

    gsap.set([l1, l2, l3], { transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

    tl.to([l1, l3], { top: "50%", y: 0, marginTop: -1, scaleY: 0.3, duration: 0.25, ease: "back.in(2)" }, 0)
      .to(l2, { scale: 0, opacity: 0, duration: 0.2 }, 0)
      .to(
        l1,
        {
          rotation: 45,
          width: "32px",
          backgroundColor: "#ccff00",
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        0.2,
      )
      .to(
        l3,
        {
          rotation: -45,
          width: "18px",
          x: -4,
          backgroundColor: "#ccff00",
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        0.2,
      )
      .to(
        btn,
        {
          scale: 1.1,
          boxShadow: "0 0 25px rgba(204,255,0,0.4), inset 0 0 10px rgba(0,240,255,0.18)",
          borderColor: "rgba(204,255,0,0.45)",
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        0.35,
      )
      .to(
        btn,
        {
          boxShadow: "0 0 15px rgba(0,240,255,0.25)",
          scale: 1.05,
          duration: 0.3,
        },
        0.55,
      );

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (isOpen) return;
    gsap.to(line1Ref.current, { width: "100%", duration: 0.3, ease: "power2.out" });
    gsap.to(line2Ref.current, { width: "100%", x: 0, duration: 0.3, delay: 0.05, ease: "power2.out" });
    gsap.to(line3Ref.current, { width: "100%", duration: 0.3, delay: 0.1, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (isOpen) return;
    gsap.to(line1Ref.current, { width: "24px", duration: 0.3, ease: "power2.out" });
    gsap.to(line2Ref.current, { width: "32px", duration: 0.3, ease: "power2.out" });
    gsap.to(line3Ref.current, { width: "18px", duration: 0.3, ease: "power2.out" });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative z-[10000] flex h-12 w-12 items-center justify-center rounded-full",
        "border border-[var(--line)] bg-[var(--bg-elevated)]/35 backdrop-blur-xl transition-colors hover:bg-[var(--bg-elevated)]/65",
        "shadow-[0_4px_10px_rgba(0,0,0,0.1)]",
        className,
      )}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
    >
      <div className="relative h-[16px] w-[24px]">
        <span
          ref={line1Ref}
          className="absolute left-0 top-0 block h-[2px] w-full origin-center rounded-full bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent-2)] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
        />
        <span
          ref={line2Ref}
          className="absolute left-0 top-1/2 mt-[-1px] block h-[2px] w-full origin-center rounded-full bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] opacity-80"
        />
        <span
          ref={line3Ref}
          className="absolute left-0 top-[14px] block h-[2px] w-full origin-center rounded-full bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent-2)] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
        />
      </div>
    </button>
  );
}
