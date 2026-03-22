# Header Logo AURALI Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current header logo with a compact two-line animated wordmark `АУРАЛИ / Студия массажа и SPA` that works cleanly in desktop and mobile headers.

**Architecture:** Rebuild the existing `BrandLogo` component as a two-line GSAP-driven wordmark, then keep integration changes minimal by preserving the current desktop and mobile header wiring. Adjust sizing and aria labels at the integration points so the logo remains mobile-first and visually balanced beside navigation and burger controls.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, GSAP

---

## Chunk 1: Brand Logo Component

### Task 1: Rebuild the wordmark component

**Files:**
- Modify: `components/layout/brand-logo.tsx`

- [ ] Step 1: Replace the old `ЛИЛИЯ` letter model with a two-line `АУРАЛИ` / `Студия массажа и SPA` structure.
- [ ] Step 2: Add separate refs for primary letters and subtitle container so the intro timeline can animate both layers independently.
- [ ] Step 3: Rebuild the GSAP intro to use a soft stagger on the main line and a calmer delayed reveal on the subtitle.
- [ ] Step 4: Encode mobile/desktop size differences in Tailwind class maps instead of inline design guesses.
- [ ] Step 5: Keep the component output compact and accessible with the new brand label.

## Chunk 2: Header Integration

### Task 2: Align desktop and mobile usage

**Files:**
- Modify: `components/layout/desktop-header.tsx`
- Modify: `components/layout/mobile-menu.tsx`

- [ ] Step 1: Update aria labels and placeholder widths for the new logo proportions.
- [ ] Step 2: Adjust header logo wrappers only where needed so the new two-line block sits cleanly in desktop and mobile layouts.
- [ ] Step 3: Verify the mobile logo remains visually balanced next to the burger control.

## Chunk 3: Verification

### Task 3: Validate the change

**Files:**
- Verify: `components/layout/brand-logo.tsx`
- Verify: `components/layout/desktop-header.tsx`
- Verify: `components/layout/mobile-menu.tsx`

- [ ] Step 1: Run `npm run lint`.
- [ ] Step 2: Run `npm run build`.
- [ ] Step 3: Review the resulting DOM structure and class usage for obvious regressions.
