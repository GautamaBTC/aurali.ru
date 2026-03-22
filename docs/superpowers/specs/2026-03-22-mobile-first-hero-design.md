# Mobile-First Hero Design

## Goal

Rebuild the landing hero so it feels more premium and image-led while still selling the booking action from the first screen.

## Priority

1. Mobile-first composition
2. Premium, pedantic visual polish
3. Clear booking CTA
4. Desktop as an expansion of the mobile layout

## Approved Content

- Eyebrow: `АУРАЛИ · персональные SPA-ритуалы в Шахтах`
- Heading line 1: `Восстановление, которое`
- Heading line 2: `чувствуется с первого прикосновения`
- Description: `Индивидуальные ритуалы массажа и SPA без конвейера: один мастер, один гость, один точно выстроенный час для отдыха, расслабления и возвращения к себе.`
- Primary CTA: `Записаться на ритуал`
- Secondary CTA: `Позвонить`
- Premium note: `Первый визит — 15%`
- Trust line: `Один мастер · один гость · персональный ритуал`

## Layout

### Mobile

- Eyebrow
- Two-line headline
- Short descriptive paragraph
- Primary and secondary CTA
- Premium note
- Trust line
- Atmospheric visual support without pushing the CTA below the fold

### Desktop

- Keep the text block on the left
- Add a larger atmospheric visual block on the right
- Preserve the same content order and hierarchy

## Visual Direction

- Calm luxury, not noisy luxury
- Strong typography and generous spacing
- Minimal UI chrome
- Background/visual support should feel cinematic and soft, not like a dashboard card
- Supporting metadata should be reduced from three equal pills to one premium note and one trust line

## Motion

- Slow, soft GSAP reveals
- No cursor glow gimmicks or magnetic button motion
- One clear intro sequence:
  - eyebrow
  - headline
  - description
  - actions
  - supporting note and trust line
- Ambient motion stays subtle and slow

## Acceptance Criteria

- The mobile hero reads cleanly within the first screen
- The layout looks premium and uncluttered
- The booking CTA remains obvious
- The hero feels more image-led and expensive than the current implementation
- Motion is softer and less technical
