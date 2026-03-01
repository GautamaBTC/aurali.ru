"use client";

import { useCallback } from "react";
import { useMenuStore } from "@/hooks/useMenuStore";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { cn } from "@/lib/cn";

type BurgerButtonProps = {
  setBurgerRef: (el: HTMLButtonElement | null) => void;
  setLineTopRef: (el: HTMLSpanElement | null) => void;
  setLineMidRef: (el: HTMLSpanElement | null) => void;
  setLineBotRef: (el: HTMLSpanElement | null) => void;
};

export function BurgerButton({ setBurgerRef, setLineTopRef, setLineMidRef, setLineBotRef }: BurgerButtonProps) {
  const isOpen = useMenuStore((s) => s.isOpen);
  const toggle = useMenuStore((s) => s.toggle);
  const setMagneticRef = useMagneticHover<HTMLButtonElement>({ strength: 4, disabled: isOpen });

  const combinedRef = useCallback(
    (el: HTMLButtonElement | null) => {
      setBurgerRef(el);
      setMagneticRef(el);
    },
    [setBurgerRef, setMagneticRef],
  );

  return (
    <button
      ref={combinedRef}
      type="button"
      className={cn(
        "tap-none touch-manipulation relative z-[101] flex h-12 w-12 items-center justify-center rounded-xl border border-transparent bg-transparent outline-none transition-all duration-300 ease-out hover:border-white/15 hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151A] active:scale-[0.92]",
        isOpen && "animate-glow-pulse border-[#dc2626]/30 bg-[#dc2626]/15",
      )}
      onClick={toggle}
      aria-label={isOpen ? "Закрыть меню навигации" : "Открыть меню навигации"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <span className="pointer-events-none relative flex h-[18px] w-7 flex-col justify-between" aria-hidden="true">
        <span ref={setLineTopRef} className="block h-0.5 w-full origin-center rounded-full bg-white will-change-transform" />
        <span ref={setLineMidRef} className="block h-0.5 w-3/4 origin-center self-end rounded-full bg-white/90 will-change-transform" />
        <span ref={setLineBotRef} className="block h-0.5 w-[60%] origin-center self-end rounded-full bg-white/90 will-change-transform" />
      </span>
    </button>
  );
}
