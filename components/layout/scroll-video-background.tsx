'use client'

import { useEffect, useRef, useState } from 'react'

const GLOBAL_BACKGROUND_VIDEO_PATH = '/videos/videofon.mp4'
const FALLBACK_BACKGROUND_VIDEO_PATH = '/videos/video-fallback.mp4'

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoSrc, setVideoSrc] = useState<string>(GLOBAL_BACKGROUND_VIDEO_PATH)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultMuted = true

    let fallbackApplied = false
    let startupWatchdog: number | null = null

    const applyFallback = () => {
      if (fallbackApplied || videoSrc === FALLBACK_BACKGROUND_VIDEO_PATH) return
      fallbackApplied = true
      setVideoSrc(FALLBACK_BACKGROUND_VIDEO_PATH)
    }

    const tryPlay = () => {
      void video.play().catch(() => undefined)
    }

    const onError = () => {
      applyFallback()
    }

    tryPlay()
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('error', onError)

    // If video is still not playable shortly after mount, fallback.
    startupWatchdog = window.setTimeout(() => {
      const notReady = video.readyState < 2 || video.videoWidth === 0
      const stalledAtZero = video.currentTime === 0 && (video.paused || video.ended)
      if (notReady || stalledAtZero) {
        applyFallback()
      }
    }, 2500)

    // iOS/Safari hardening: retry play on first user interaction.
    const onFirstInteraction = () => {
      tryPlay()
      window.removeEventListener('touchstart', onFirstInteraction)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
    window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true })
    window.addEventListener('pointerdown', onFirstInteraction, { passive: true, once: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true })

    return () => {
      if (startupWatchdog) {
        window.clearTimeout(startupWatchdog)
      }
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('error', onError)
      window.removeEventListener('touchstart', onFirstInteraction)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [videoSrc])

  return (
    <div className='site-scroll-backdrop' aria-hidden>
      <video
        ref={videoRef}
        className='site-scroll-backdrop__video'
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload='auto'
      />
      <div className='site-scroll-backdrop__shade' />
    </div>
  )
}
