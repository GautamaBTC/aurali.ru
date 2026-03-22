# Mobile Spa Menu Design

## Goal

Replace the current mobile burger/menu motion with a softer spa-style interaction:
- thin elegant three-line toggle with different lengths
- seamless transform into a gradient cross
- slower tactile rubber motion on tap
- softer, longer menu reveal
- muted looping video background inside the mobile menu overlay

## Scope

Only the mobile menu experience changes in this task:
- burger toggle visuals and animation
- overlay entrance and exit timing
- overlay background layering with `videobackand.mp4`
- mobile-only presentation of the background video

Out of scope:
- desktop header behavior
- site section content
- navigation structure
- new dependencies

## Visual Direction

### Burger Toggle

- Use three thin horizontal lines with rounded caps
- Line lengths should feel intentionally uneven:
  - top: shortest
  - middle: longest
  - bottom: medium
- The lines should use the site accent gradient instead of flat color
- The button should feel light and premium, not like a heavy boxed control

### Open State

- The middle line dissolves and collapses softly
- The top and bottom lines rotate into a cross from a stable center point
- The morph must avoid visible seams, jumps, and harsh offset changes
- A subtle press-and-release scale should make the interaction feel tactile

### Overlay

- The menu overlay becomes more atmospheric and spa-like
- `videobackand.mp4` is used as a muted blurred background video
- The video remains visually static in framing on mobile
- Additional translucent warm layers keep text readable and prevent the background from feeling noisy

## Motion Design

### Toggle Motion

- Use GSAP for controlled sequencing
- Opening should have a slow elastic character, but stay refined
- Closing should be slightly quicker but still soft
- Gradient highlights should remain visible in both burger and cross states

### Overlay Motion

- Reveal should happen in layers:
  1. fade in overlay veil
  2. reveal the blurred video background
  3. lift and fade menu panel/content
  4. stagger nav items and footer
- Entrance duration should be longer than the current implementation
- Exit should feel cushioned rather than abrupt

### Video Loop Treatment

- The video runs in an infinite loop
- A soft veil animation smooths the perceived loop point
- The video should stay low-contrast, slightly blurred, and visually recessed

## Technical Design

### Files

- Modify `components/layout/mobile-menu.tsx`
- Add public asset path for the menu video

### Implementation Notes

- Keep the component as a client component
- Reuse existing GSAP and `useLockScroll`
- Prefer Tailwind classes for layout and static styling
- Use inline styles only where dynamic values or layered gradients are clearer
- Keep reduced-motion handling intact

## Acceptance Criteria

- Burger lines are thin, elegant, and different lengths
- Burger-to-cross transform is smooth and does not jump
- Pressing the control feels soft and tactile
- Overlay reveal is slower and more polished than before
- Background video is visible but subdued, blurred, and readable behind content
- The loop does not create a harsh visible reset
- Mobile behavior stays stable and performant
