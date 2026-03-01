"use client";

import { useCallback, useRef, type MouseEvent } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

type MenuLinkProps = {
  href: string;
  label: string;
  index: number;
  onRegister: (el: HTMLAnchorElement | null, index: number) => void;
  onClick?: () => void;
};

export function MenuLink({ href, label, index, onRegister, onClick }: MenuLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  const combinedRef = useCallback(
    (el: HTMLAnchorElement | null) => {
      ref.current = el;
      onRegister(el, index);
    },
    [onRegister, index],
  );

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current || !glowRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(glowRef.current, { x: x - 75, y: y - 75, opacity: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
  };

  const num = String(index + 1).padStart(2, "0");

  return (
    <li className="w-full">
      <a
        ref={combinedRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        tabIndex={-1}
        className={cn(
          "group relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-6 py-[18px] text-2xl font-semibold tracking-wide text-white opacity-0 transition-all duration-300 ease-out hover:scale-105 hover:bg-[#dc2626]/8 hover:text-[#dc2626] focus-visible:bg-[#dc2626]/8 focus-visible:text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151A] active:scale-[0.97]",
        )}
      >
        <span className="absolute left-6 text-[0.65rem] font-normal tabular-nums tracking-widest text-white/20 transition-colors duration-300 group-hover:text-[#dc2626]/50">
          {num}
        </span>
        <span>{label}</span>
        <span
          className="absolute bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#dc2626] shadow-crimson-line transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:w-[40%] group-focus-visible:w-[40%]"
          aria-hidden="true"
        />
        <span
          ref={glowRef}
          className="pointer-events-none absolute h-[150px] w-[150px] rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
      </a>
    </li>
  );
}
