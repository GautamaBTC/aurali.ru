'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'liaura-sound-state-v2'
const TRACK_KEY = 'liaura-sound-track-v1'
const TRACKS = [
  '/audio/atmosphere-01.mp3',
  '/audio/atmosphere-02.mp3',
  '/audio/atmosphere-03.mp3',
  '/audio/atmosphere-05.mp3',
  '/audio/atmosphere-06.mp3',
] as const

type SoundState = 'enabled' | 'off'

function writeSoundState(value: SoundState): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, value)
}

function writeTrackIndex(index: number): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TRACK_KEY, String(index))
}

function toTrackIndex(index: number): number {
  const total = TRACKS.length
  if (index >= total) return 0
  if (index < 0) return total - 1
  return index
}

export function AtmosphereToggle() {
  const [soundState, setSoundState] = useState<SoundState>('off')
  const [trackIndex, setTrackIndex] = useState<number>(0)
  const [isInvitationVisible, setIsInvitationVisible] = useState(false)
  const [isTrackBurstVisible, setIsTrackBurstVisible] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const switchLockRef = useRef(false)
  const isBootstrappedRef = useRef(false)

  useEffect(() => {
    if (isBootstrappedRef.current) return
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.4
    audio.loop = false
    audio.src = TRACKS[trackIndex]
    audio.load()

    if (soundState === 'enabled') {
      void audio.play().catch(() => {
        setSoundState('off')
        writeSoundState('off')
      })
    }

    isBootstrappedRef.current = true
  }, [soundState, trackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (soundState === 'enabled') {
      audio.volume = 0.4
      void audio.play().catch(() => {
        setSoundState('off')
        writeSoundState('off')
      })
      return
    }

    audio.pause()
  }, [soundState])

  const runTrackBurst = useCallback((): void => {
    setIsTrackBurstVisible(true)
    window.setTimeout(() => setIsTrackBurstVisible(false), 700)
  }, [])

  const rampVolume = useCallback((target: number, durationMs: number): Promise<void> => {
    const audio = audioRef.current
    if (!audio) return Promise.resolve()

    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }

    const start = audio.volume
    const steps = Math.max(1, Math.floor(durationMs / 40))
    let step = 0

    return new Promise((resolve) => {
      fadeIntervalRef.current = window.setInterval(() => {
        step += 1
        const progress = Math.min(1, step / steps)
        audio.volume = start + (target - start) * progress

        if (progress >= 1) {
          if (fadeIntervalRef.current !== null) {
            window.clearInterval(fadeIntervalRef.current)
            fadeIntervalRef.current = null
          }
          resolve()
        }
      }, 40)
    })
  }, [])

  const applyTrack = useCallback(async (nextIndex: number, shouldPlay: boolean): Promise<void> => {
    const audio = audioRef.current
    if (!audio) return

    const normalizedIndex = toTrackIndex(nextIndex)

    audio.src = TRACKS[normalizedIndex]
    audio.load()

    setTrackIndex(normalizedIndex)
    writeTrackIndex(normalizedIndex)

    if (!shouldPlay) return

    try {
      await audio.play()
    } catch {
      setSoundState('off')
      writeSoundState('off')
    }
  }, [])

  const switchTrack = useCallback(
    async (direction: -1 | 1, withFade: boolean): Promise<void> => {
      if (switchLockRef.current) return
      switchLockRef.current = true

      const audio = audioRef.current
      const nextIndex = toTrackIndex(trackIndex + direction)
      const shouldPlay = soundState === 'enabled'

      if (audio && shouldPlay && withFade) {
        await rampVolume(0, 300)
      }

      await applyTrack(nextIndex, shouldPlay)

      if (audio && shouldPlay && withFade) {
        audio.volume = 0
        await rampVolume(0.4, 500)
      }

      runTrackBurst()
      switchLockRef.current = false
    },
    [applyTrack, rampVolume, runTrackBurst, soundState, trackIndex]
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = (): void => {
      void switchTrack(1, false)
    }

    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [switchTrack])

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current)
      }
    }
  }, [])

  const enableSound = useCallback(async (): Promise<void> => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.4

    try {
      await audio.play()
      setSoundState('enabled')
      writeSoundState('enabled')
      setIsPanelOpen(true)
      setIsInvitationVisible(false)
    } catch {
      setSoundState('off')
      writeSoundState('off')
      setIsPanelOpen(true)
      setIsInvitationVisible(false)
    }
  }, [])

  const toggleSound = useCallback(async (): Promise<void> => {
    if (soundState === 'enabled') {
      setSoundState('off')
      writeSoundState('off')
      return
    }

    await enableSound()
  }, [enableSound, soundState])

  const dismissInvitation = (): void => {
    setIsInvitationVisible(false)
    setSoundState('off')
    writeSoundState('off')
    setIsPanelOpen(false)
  }

  const showLauncher = !isInvitationVisible && (soundState === 'enabled' || soundState === 'off')
  const showControls = showLauncher && isPanelOpen

  return (
    <>
      <audio ref={audioRef} preload='auto' aria-hidden />

      {isInvitationVisible ? (
        <div className='fixed bottom-6 left-1/2 z-[72] w-[min(92vw,360px)] -translate-x-1/2 md:bottom-8 md:left-auto md:right-10 md:translate-x-0'>
          <div
            role='button'
            tabIndex={0}
            onClick={() => {
              void enableSound()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                void enableSound()
              }
            }}
            className='group relative w-full rounded-2xl border border-[#d4b483]/35 bg-[rgba(20,20,20,0.7)] p-4 text-left shadow-[0_14px_30px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#d4b483]/55 hover:shadow-[0_0_24px_rgba(212,180,131,0.24)]'
          >
            <span className='pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(212,180,131,0.18)_0%,transparent_56%)] opacity-70' />
            <span className='relative block text-[10px] uppercase tracking-[0.22em] text-[#d9cfc4]'>
              Атмосфера ждёт вас
            </span>
            <span className='relative mt-2 block text-[13px] leading-[1.45] text-[#f5f0e8]'>
              Включить мягкое звуковое сопровождение
            </span>

            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation()
                dismissInvitation()
              }}
              aria-label='Закрыть приглашение звуковой атмосферы'
              className='absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d4b483]/28 text-[#d9cfc4] transition-colors duration-300 hover:border-[#d4b483]/52 hover:text-[#f5f0e8]'
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {showLauncher ? (
        <div className='fixed bottom-6 right-6 z-[70] md:bottom-8 md:right-10'>
          <button
            type='button'
            onClick={() => setIsPanelOpen((value) => !value)}
            aria-label={isPanelOpen ? 'Свернуть панель звука' : 'Открыть панель звука'}
            className='group absolute bottom-0 right-0 inline-flex h-12 items-center gap-2 rounded-full border border-[#d4b483]/38 bg-[rgba(20,20,20,0.76)] px-3 text-[#f5f0e8] shadow-[0_10px_24px_rgba(0,0,0,0.32)] backdrop-blur-[14px] transition-all duration-300 hover:border-[#d4b483]/62'
          >
            <span className='relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d4b483]/36'>
              <span className={`h-2 w-2 rounded-full bg-[#d4b483] ${soundState === 'enabled' ? 'animate-[atmo-inner-glow_2.4s_ease-in-out_infinite]' : 'opacity-55'}`} />
            </span>
            <span className='text-[10px] uppercase tracking-[0.16em] text-[#e8d7db]'>Звук</span>
          </button>

          {showControls ? (
            <div className='relative mb-14 w-[min(92vw,290px)] rounded-2xl border border-[#d4b483]/30 bg-[rgba(20,20,20,0.72)] px-3 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.35)] backdrop-blur-[16px]'>
            <span className='pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(212,180,131,0.16)_0%,transparent_56%)] opacity-80' />

            <div className='relative flex items-center justify-between gap-2'>
              <span className='text-[10px] uppercase tracking-[0.18em] text-[#d9cfc4]'>
                Звуковая атмосфера
              </span>
              <button
                type='button'
                onClick={() => {
                  setIsPanelOpen(false)
                }}
                aria-label='Скрыть панель звуковой атмосферы'
                className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#d4b483]/24 text-[#d9cfc4] transition-colors duration-300 hover:border-[#d4b483]/50 hover:text-[#f5f0e8]'
              >
                ×
              </button>
            </div>

            <div className='relative mt-2 flex items-center justify-between gap-2'>
              <button
                type='button'
                onClick={() => {
                  void switchTrack(-1, true)
                }}
                aria-label='Предыдущий трек'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483]/32 text-[#e8d7db] transition-all duration-300 hover:border-[#d4b483]/55 hover:text-[#f5f0e8]'
              >
                ‹
              </button>

              <button
                type='button'
                onClick={() => {
                  void toggleSound()
                }}
                aria-label={soundState === 'enabled' ? 'Пауза' : 'Включить звук'}
                className='inline-flex h-11 min-w-[132px] items-center justify-center gap-2 rounded-full border border-[#d4b483]/45 bg-[rgba(212,180,131,0.14)] px-4 text-[11px] uppercase tracking-[0.14em] text-[#f5f0e8] transition-all duration-300 hover:border-[#d4b483]/75 hover:bg-[rgba(212,180,131,0.2)]'
              >
                <span className='inline-flex h-2 w-2 rounded-full bg-[#d4b483] animate-[atmo-inner-glow_2.4s_ease-in-out_infinite]' />
                {soundState === 'enabled' ? 'Пауза' : 'Включить'}
              </button>

              <button
                type='button'
                onClick={() => {
                  void switchTrack(1, true)
                }}
                aria-label='Следующий трек'
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d4b483]/32 text-[#e8d7db] transition-all duration-300 hover:border-[#d4b483]/55 hover:text-[#f5f0e8]'
              >
                ›
              </button>
            </div>

            <div className='relative mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[#d9cfc4]'>
              <span>{`Трек ${trackIndex + 1} из ${TRACKS.length}`}</span>
              <span>{soundState === 'enabled' ? 'Играет' : 'Пауза'}</span>
            </div>

            {soundState === 'enabled' ? (
              <span className='pointer-events-none absolute inset-[-3px] rounded-2xl border border-[#d4b483]/35 animate-[atmo-ring_3.8s_ease-in-out_infinite]' aria-hidden />
            ) : null}

            {isTrackBurstVisible ? (
              <span className='pointer-events-none absolute inset-[-4px] rounded-2xl border border-[#d4b483]/55 animate-[atmo-ring_0.8s_ease-out_1]' aria-hidden />
            ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
