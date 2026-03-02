"use client";

import { useCallback } from "react";
import { useMenuStore } from "@/hooks/useMenuStore";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { cn } from "@/lib/cn";

type BurgerButtonProps = {
  setLineTopRef: (el: HTMLSpanElement | null) => void;
  setLineMidRef: (el: HTMLSpanElement | null) => void;
  setLineBotRef: (el: HTMLSpanElement | null) => void;
};

export function BurgerButton({ setLineTopRef, setLineMidRef, setLineBotRef }: BurgerButtonProps) {
  const isOpen = useMenuStore((s) => s.isOpen);
  const toggle = useMenuStore((s) => s.toggle);
  const setMagneticRef = useMagneticHover<HTMLButtonElement>({ strength: 4, disabled: isOpen });

  const setRef = useCallback((el: HTMLButtonElement | null) => setMagneticRef(el), [setMagneticRef]);

  return (
    <button
      ref={setRef}
      type="button"
      className={cn(
        "tap-none touch-manipulation relative z-[101] flex h-12 w-12 items-center justify-center rounded-xl bg-transparent outline-none transition-transform duration-150 active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)] md:hidden",
      )}
      onClick={toggle}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <span className="pointer-events-none relative flex h-[18px] w-7 flex-col justify-between" aria-hidden="true">
        <span ref={setLineTopRef} className="block h-0.5 w-full origin-center rounded-full bg-[var(--text-primary)] will-change-transform" />
        <span ref={setLineMidRef} className="block h-0.5 w-[70%] origin-center self-end rounded-full bg-[var(--accent-2)]/80 will-change-transform" />
        <span ref={setLineBotRef} className="block h-0.5 w-[55%] origin-center self-end rounded-full bg-[var(--accent)]/75 will-change-transform" />
      </span>
    </button>
  );
}
