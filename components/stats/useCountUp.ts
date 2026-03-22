"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";

type UseCountUpOptions = {
  target: number;
  decimals?: number;
  duration?: number;
  ease?: string;
};

export function useCountUp({
  target,
  decimals = 0,
  duration = 2,
  ease = "expo.out",
}: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const proxy = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const format = useCallback(
    (value: number): string => {
      if (decimals > 0) return value.toFixed(decimals);
      return Math.round(value).toString();
    },
    [decimals],
  );

  const setImmediate = useCallback(
    (value: number) => {
      if (!ref.current) return;
      ref.current.textContent = format(value);
    },
    [format],
  );

  const start = useCallback(() => {
    if (!ref.current) return;

    tweenRef.current?.kill();
    proxy.current.value = 0;
    ref.current.textContent = format(0);

    tweenRef.current = gsap.to(proxy.current, {
      value: target,
      duration,
      ease,
      onUpdate: () => {
        if (!ref.current) return;
        ref.current.textContent = format(proxy.current.value);
      },
      onComplete: () => {
        if (!ref.current) return;
        ref.current.textContent = format(target);
      },
    });
  }, [duration, ease, format, target]);

  const stop = useCallback(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
  }, []);

  return { ref, start, stop, setImmediate } as const;
}
