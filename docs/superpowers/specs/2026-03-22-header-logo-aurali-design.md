# Header Logo Design: AURALI

## Goal

Replace the current header brand mark with a compact two-line animated wordmark:

- `АУРАЛИ`
- `Студия массажа и SPA`

The logo must feel precise, premium, calm, and mobile-first. It should work as the main brand element inside the header without behaving like a hero graphic.

## Context

The current header already uses a dedicated brand logo component and separate desktop/mobile header structures:

- `components/layout/brand-logo.tsx`
- `components/layout/desktop-header.tsx`
- `components/layout/mobile-menu.tsx`

The existing wordmark animation is too experimental for the desired spa-luxury direction and still uses the old brand text.

## Recommended Direction

Use a **wordmark-only** solution with no decorative emblem.

Why this direction:

- cleaner and more premium on small screens
- avoids mystical or salon-generic symbolism
- keeps the header visually disciplined
- gives better typography control than icon-led concepts

Alternatives considered:

1. `wordmark + micro-symbol`
   Good for stronger brand signification, but risks overloading the mobile header.
2. `decorative emblem`
   Too risky for this project because it can easily cheapen the premium spa tone.

## Functional Role

- The logo is the primary brand element in the header.
- It acts as a button that scrolls the page back to the top section.
- It must remain compact enough for mobile layout constraints.
- It must not increase header height beyond the current comfortable range.

## Visual Structure

The logo is a two-line block:

1. Primary line: `АУРАЛИ`
2. Secondary line: `Студия массажа и SPA`

Rules:

- The top line is dominant.
- The bottom line is supportive and quieter.
- Both lines are center-aligned within the same logo block.
- No surrounding frame, badge, medallion, divider line, or icon container.

## Typography Direction

### Top line: `АУРАЛИ`

- elegant serif tone
- uppercase
- thin to light weight
- premium editorial feel
- increased letter spacing
- visually larger than the current logo

### Bottom line: `Студия массажа и SPA`

- calmer and more neutral than the brand line
- smaller optical size
- lighter emphasis
- cleaner tracking than the top line
- must not compete with the main wordmark

## Layout Rules

### Desktop

- The logo should feel more substantial than the current mark, but still compact.
- It should sit comfortably inside the left side of the header.
- The two-line block should read instantly without pushing navigation too far right.

### Mobile

- The logo stays two-line.
- It must fit naturally near the burger button.
- It must read like a refined signature, not a large title.
- Tracking and text size must be reduced compared to desktop to prevent visual breakup.

## Color and Finish

- Base color: warm off-white from the current site palette
- No harsh pure white
- No aggressive gold
- A very subtle pearl-like highlight is allowed during intro
- Static state should remain calm and restrained

## Animation Direction

The animation should feel like one soft premium gesture.

### Intro sequence

1. The whole logo container fades in softly.
2. `АУРАЛИ` reveals first with a gentle wave-like stagger.
3. `Студия массажа и SPA` appears slightly later and more quietly.
4. The logo settles into a stable static state with no residual movement.

### Motion rules

- soft fade and slight vertical lift
- minimal stagger
- no sharp jumps
- no visible seams
- no heavy blur effects
- no contour/fill gimmicks
- no theatrical emblem drawing

### Interaction

Desktop:

- only a very subtle hover response
- slight brightening or soft glow shift is enough

Mobile:

- only a restrained press feedback

Avoid:

- bounce
- strong scale pulses
- flashy shimmer
- playful motion

## Integration Scope

Primary implementation target:

- `components/layout/brand-logo.tsx`

Integration check points:

- `components/layout/desktop-header.tsx`
- `components/layout/mobile-menu.tsx`

Constraints:

- Next.js
- TypeScript strict mode
- Tailwind CSS utilities only
- GSAP for timeline-driven animation
- no external HTML snippet integration
- no font loading via `<link>`

## What Must Be Removed

- old `ЛИЛИЯ` wordmark
- contour/fill letter treatment
- overly effect-driven intro behavior
- any styling that feels experimental instead of finished

## Quality Bar

The result is correct only if all of the following are true:

- mobile readability is immediate
- header height remains disciplined
- the new mark looks more premium than the current one
- the logo does not compete with burger or navigation
- animation is soft, slow, and seamless
- final resting state is clean, stable, and expensive-looking

## Success Criteria

- The new header wordmark clearly reads as `АУРАЛИ`
- The subtitle `Студия массажа и SPA` is visible and elegant
- The logo works equally well in desktop and mobile header contexts
- The intro animation improves perceived polish instead of drawing attention to itself
- The brand presentation feels localized, premium, and complete
