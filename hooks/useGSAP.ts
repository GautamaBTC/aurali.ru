"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let gsapReady = false;

export function useGSAP(): typeof gsap {
  useEffect(() => {
    if (gsapReady) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsapReady = true;
  }, []);

  return gsap;
}
