export type RevealPreset = {
  from: Record<string, unknown>;
  to: Record<string, unknown>;
};

export const REVEAL_PRESETS = {
  FADE_UP: {
    from: { y: 60, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
  },
  SLIDE_LEFT: {
    from: { x: -80, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
  },
  SLIDE_RIGHT: {
    from: { x: 80, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
  },
  SCALE_IN: {
    from: { scale: 0.92, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
  },
  CLIP_BOTTOM: {
    from: { clipPath: "inset(100% 0 0 0)" },
    to: { clipPath: "inset(0% 0 0 0)" },
  },
  CLIP_LEFT: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0% 0 0)" },
  },
  BLUR_UP: {
    from: { y: 80, autoAlpha: 0, filter: "blur(8px)" },
    to: { y: 0, autoAlpha: 1, filter: "blur(0px)" },
  },
  ROTATE_IN: {
    from: { rotateY: 15, autoAlpha: 0 },
    to: { rotateY: 0, autoAlpha: 1 },
  },
  FLIP_IN: {
    from: { rotateX: 8, y: 30, autoAlpha: 0 },
    to: { rotateX: 0, y: 0, autoAlpha: 1 },
  },
  SCALE_CENTER: {
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
  },
} as const satisfies Record<string, RevealPreset>;
