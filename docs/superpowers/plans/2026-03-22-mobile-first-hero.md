# Mobile-First Hero Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the landing hero into a mobile-first premium composition that feels more editorial and still drives bookings.

**Architecture:** Keep the change focused to the current hero data and hero section component. Update the hero copy in the shared content model, then simplify the hero structure, motion, and supporting UI so mobile gets the cleanest and most premium version first.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, GSAP

---

## Chunk 1: Content

### Task 1: Update approved hero copy

**Files:**
- Modify: `data/site-content.ts`

- [ ] Replace the current hero copy with the approved premium text
- [ ] Keep the content model unchanged
- [ ] Verify the hero props still map cleanly from `app/page.tsx`

## Chunk 2: Hero Layout

### Task 2: Rebuild hero structure for mobile-first composition

**Files:**
- Modify: `components/sections/hero-section.tsx`

- [ ] Remove overly technical pointer effects and magnetic button behavior
- [ ] Rebuild the block order to match the approved mobile hierarchy
- [ ] Replace the three meta pills with one premium note and one trust line
- [ ] Add a restrained atmospheric visual area that supports both mobile and desktop

## Chunk 3: Motion

### Task 3: Simplify and soften hero animation

**Files:**
- Modify: `components/sections/hero-section.tsx`

- [ ] Keep GSAP intro animation
- [ ] Reduce visual noise in the sequence
- [ ] Make reveals softer and slower
- [ ] Keep motion readable on mobile

## Chunk 4: Verification

### Task 4: Validate the result

**Files:**
- Modify: `components/sections/hero-section.tsx`
- Modify: `data/site-content.ts`

- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Summarize any residual visual risks that still need browser-side review
