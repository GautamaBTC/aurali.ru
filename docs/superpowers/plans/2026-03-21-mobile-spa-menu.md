# Mobile Spa Menu Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current mobile burger and menu overlay motion with a softer spa-style interaction, including a refined GSAP toggle morph and muted looping background video.

**Architecture:** Keep the work localized to the existing mobile menu component so navigation logic and header structure stay intact. Rebuild the burger control as DOM lines animated by GSAP, then retime the overlay reveal to layer in the video background, veil, and content in a calmer sequence.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, GSAP

---

## Chunk 1: Planning And Assets

### Task 1: Prepare spec-aligned file structure

**Files:**
- Modify: `components/layout/mobile-menu.tsx`
- Create: `public/videos/spa-menu-background.mp4`

- [ ] **Step 1: Move the root video asset into `public/videos`**

Run: `New-Item -ItemType Directory -Force public\\videos`
Run: `Move-Item videobackand.mp4 public\\videos\\spa-menu-background.mp4`
Expected: video asset is available under `/videos/spa-menu-background.mp4`

- [ ] **Step 2: Verify the component references only the public asset path**

Expected: no runtime code reads the root-level video file directly

## Chunk 2: Burger Toggle Motion

### Task 2: Introduce a testable burger line structure

**Files:**
- Modify: `components/layout/mobile-menu.tsx`

- [ ] **Step 1: Write the failing test for the burger structure**

Because the repo currently has no test harness and adding dependencies is out of scope, define the red step as a temporary build-breaking structural expectation in the component refactor checklist:
- burger button renders three dedicated line elements
- lines expose stable data attributes for GSAP targeting
- open state exposes a stable active class or state attribute

- [ ] **Step 2: Verify the current implementation fails that expectation**

Expected: the current SVG-based burger does not provide the required DOM line structure

- [ ] **Step 3: Implement the minimal DOM-based burger structure**

Expected:
- three line elements with different resting widths
- gradient fill via layered backgrounds
- accessible `aria-expanded` behavior remains intact

- [ ] **Step 4: Verify the new structure builds cleanly**

Run: `npm run build`
Expected: PASS

### Task 3: Animate the burger into a seamless cross

**Files:**
- Modify: `components/layout/mobile-menu.tsx`

- [ ] **Step 1: Add GSAP refs and line timelines**

- [ ] **Step 2: Animate press feedback and open/close morph**

Expected:
- top and bottom lines rotate into a centered cross
- middle line fades and contracts away
- no jumpy transforms or misaligned seams

- [ ] **Step 3: Verify the component still builds**

Run: `npm run build`
Expected: PASS

## Chunk 3: Overlay Atmosphere

### Task 4: Add the muted looping background video

**Files:**
- Modify: `components/layout/mobile-menu.tsx`
- Create: `public/videos/spa-menu-background.mp4`

- [ ] **Step 1: Add a dedicated video layer inside the overlay**

- [ ] **Step 2: Add blur, dimming, and warm veil layers**

- [ ] **Step 3: Add a gentle opacity pulse to soften the perceived loop point**

- [ ] **Step 4: Verify the overlay remains readable and mobile-safe**

Run: `npm run build`
Expected: PASS

### Task 5: Retime the menu reveal

**Files:**
- Modify: `components/layout/mobile-menu.tsx`

- [ ] **Step 1: Rework the open timeline into layered reveal phases**

- [ ] **Step 2: Soften the close timeline**

- [ ] **Step 3: Keep focus management and scroll locking behavior intact**

- [ ] **Step 4: Verify the component still builds**

Run: `npm run build`
Expected: PASS

## Chunk 4: Final Verification

### Task 6: Verify and review

**Files:**
- Modify: `components/layout/mobile-menu.tsx`

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Manually review the mobile menu behavior**

Expected:
- elegant unequal lines
- soft rubber press
- seamless cross morph
- softened overlay reveal
- muted looping video background

- [ ] **Step 4: Summarize any residual risks**

Expected: note mobile video performance and reduced-motion caveats if they remain
