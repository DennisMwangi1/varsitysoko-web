import type { Transition, Variants } from 'framer-motion';

/**
 * Shared animation language for the hero device cluster.
 * One easing curve, a small set of durations — so every motion in the
 * scene reads as the same system (Linear/Vercel-style restraint).
 * No bounce, no elastic: symmetric easeInOut only.
 */

/** The single easing curve used everywhere. Smooth in, smooth out. */
export const EASE = [0.4, 0, 0.2, 1] as const;

/** A slightly softer curve for larger layout moves (card → details). */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.35,
  base: 0.5,
  slow: 0.7,
} as const;

/** Standard transition for scene cross-fades. */
export const sceneTransition: Transition = {
  duration: DURATION.base,
  ease: EASE,
};

/** Layout transition for expanding/collapsing cards. */
export const layoutTransition: Transition = {
  duration: DURATION.slow,
  ease: EASE_SOFT,
};

/** Full-screen scene: fade + a whisper of vertical drift. */
export const sceneVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: sceneTransition },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE } },
};

/** Container that staggers its children in. */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
  exit: {},
};

/** A single item inside a staggered container (product cards, list rows). */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: DURATION.fast, ease: EASE } },
};

/** A chat bubble sliding in from its side. */
export const bubbleVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.fast, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
};
