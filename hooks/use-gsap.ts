import type { RefObject } from 'react'
import { useEffect } from 'react'
import gsap from 'gsap'

interface UseGsapOptions {
  scope?: RefObject<HTMLElement | null>
  dependencies?: ReadonlyArray<unknown>
}

export function useGsap(setup: () => void, options?: UseGsapOptions): void {
  const { scope, dependencies = [] } = options ?? {}

  useEffect(() => {
    const context = gsap.context(() => {
      setup()
    }, scope?.current ?? undefined)

    return () => {
      context.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
