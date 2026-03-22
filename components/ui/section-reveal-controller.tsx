'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SectionRevealControllerProps {
  selector?: string
}

export function SectionRevealController({ selector = '.section-magnetic' }: SectionRevealControllerProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const sections = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const nodes = sections.map((section) => {
      const contentNode = section.querySelector<HTMLElement>(':scope > .section-container')
      return {
        contentNode: contentNode ?? section,
        sectionNode: section,
      }
    })
    if (!nodes.length) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const timelines: gsap.core.Tween[] = []

    nodes.forEach(({ sectionNode, contentNode }) => {
      gsap.set(contentNode, {
        opacity: 0.12,
        y: 56,
        filter: 'blur(18px)',
        willChange: 'transform, opacity, filter',
      })

      const revealTween = gsap.to(contentNode, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionNode,
          start: 'top 94%',
          end: 'top 52%',
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      })

      const fadeOutTween = gsap.to(contentNode, {
        opacity: 0.24,
        y: -34,
        filter: 'blur(12px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionNode,
          start: 'bottom 58%',
          end: 'bottom 8%',
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      })

      const restoreTween = gsap.to(contentNode, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionNode,
          start: 'top 8%',
          end: 'top 38%',
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      })

      timelines.push(revealTween, fadeOutTween, restoreTween)
    })

    ScrollTrigger.refresh()

    return () => {
      timelines.forEach((timeline) => timeline.kill())
      nodes.forEach(({ contentNode }) => {
        gsap.set(contentNode, {
          clearProps: 'opacity,transform,filter,willChange',
        })
      })
    }
  }, [selector])

  return null
}
