"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DESKTOP_VIDEO_SRC = "/uploads/videos/hero-background.mp4";
const MOBILE_VIDEO_SRC = "/uploads/videos/hader.mp4";
const MOBILE_QUERY = "(max-width: 767px)";

export function SiteScrollBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const root = document.documentElement;
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let fallbackAttempted = false;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    let glitchStartTimer: ReturnType<typeof setTimeout> | undefined;
    let glitchWindowTimer: ReturnType<typeof setTimeout> | undefined;
    let glitchBurstTimer: ReturnType<typeof setTimeout> | undefined;
    let glitchActiveTimer: ReturnType<typeof setTimeout> | undefined;
    let glitchStarted = false;

    const applySource = (src: string) => {
      if (video.dataset.src === src) return;
      video.dataset.src = src;
      video.src = src;
      video.load();
    };

    const getPreferredSource = () => (mediaQuery.matches ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC);

    const getFallbackSource = (src: string) => (src === MOBILE_VIDEO_SRC ? DESKTOP_VIDEO_SRC : MOBILE_VIDEO_SRC);

    const clearStartupTimer = () => {
      if (startupTimer !== undefined) {
        clearTimeout(startupTimer);
        startupTimer = undefined;
      }
    };

    const clearGlitchTimers = () => {
      if (glitchStartTimer !== undefined) clearTimeout(glitchStartTimer);
      if (glitchWindowTimer !== undefined) clearTimeout(glitchWindowTimer);
      if (glitchBurstTimer !== undefined) clearTimeout(glitchBurstTimer);
      if (glitchActiveTimer !== undefined) clearTimeout(glitchActiveTimer);
      glitchStartTimer = undefined;
      glitchWindowTimer = undefined;
      glitchBurstTimer = undefined;
      glitchActiveTimer = undefined;
      root.removeAttribute("data-logo-glitch");
    };

    const runGlitchBurst = () => {
      root.setAttribute("data-logo-glitch", "on");
      const duration = 180 + Math.round(Math.random() * 260);
      if (glitchActiveTimer !== undefined) clearTimeout(glitchActiveTimer);
      glitchActiveTimer = setTimeout(() => {
        root.removeAttribute("data-logo-glitch");
      }, duration);
    };

    const scheduleRandomGlitchWindow = () => {
      const burstDelay = 1000 + Math.round(Math.random() * 9000);
      glitchBurstTimer = setTimeout(runGlitchBurst, burstDelay);
      glitchWindowTimer = setTimeout(scheduleRandomGlitchWindow, 10000);
    };

    const startLogoGlitchScheduler = () => {
      if (glitchStarted) return;
      glitchStarted = true;
      root.setAttribute("data-video-ready", "true");
      glitchStartTimer = setTimeout(scheduleRandomGlitchWindow, 5000);
    };

    const tryPlay = () => {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.loop = true;
      video.setAttribute("muted", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "true");

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    const fallbackToAlternateSource = () => {
      if (fallbackAttempted) return;
      fallbackAttempted = true;
      applySource(getFallbackSource(video.dataset.src || getPreferredSource()));
      tryPlay();
    };

    const scheduleStartupCheck = () => {
      clearStartupTimer();
      startupTimer = setTimeout(() => {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          fallbackToAlternateSource();
        }
      }, 3500);
    };

    const syncPreferredSource = () => {
      fallbackAttempted = false;
      applySource(getPreferredSource());
      scheduleStartupCheck();
      tryPlay();
    };

    syncPreferredSource();

    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);
    video.addEventListener("playing", startLogoGlitchScheduler);
    video.addEventListener("loadeddata", clearStartupTimer);
    video.addEventListener("error", fallbackToAlternateSource);

    const onMediaChange = () => {
      syncPreferredSource();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) tryPlay();
    };

    const onTouchStart = () => {
      tryPlay();
      window.removeEventListener("touchstart", onTouchStart);
    };

    const onPointerDown = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onPointerDown);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onMediaChange);
    } else {
      mediaQuery.addListener(onMediaChange);
    }

    return () => {
      clearStartupTimer();
      clearGlitchTimers();
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", tryPlay);
      video.removeEventListener("playing", startLogoGlitchScheduler);
      video.removeEventListener("loadeddata", clearStartupTimer);
      video.removeEventListener("error", fallbackToAlternateSource);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("pointerdown", onPointerDown);
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", onMediaChange);
      } else {
        mediaQuery.removeListener(onMediaChange);
      }
    };
  }, [reduced]);

  return (
    <div className="site-scroll-backdrop" aria-hidden>
      <div
        className="site-scroll-backdrop__poster"
        style={{ backgroundImage: "url('/images/hero-poster.svg')" }}
      />
      {!reduced ? (
        <video
          ref={videoRef}
          className="site-scroll-backdrop__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          poster="/images/hero-poster.svg"
          aria-hidden
          tabIndex={-1}
        />
      ) : null}
      <div className="site-scroll-backdrop__shade" />
    </div>
  );
}
