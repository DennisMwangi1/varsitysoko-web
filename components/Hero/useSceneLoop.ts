import { useEffect, useRef, useState } from 'react';

/** Detects the user's reduced-motion preference and keeps it live. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** True when viewport is below Tailwind `md` (768px) — keeps pace with sticky/scroll JS. */
export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return mobile;
}

/**
 * Drives a looping scripted timeline.
 *
 * Give it the duration (ms) of each scene; it returns the index of the
 * scene currently on screen and advances through them forever, wrapping
 * back to 0 for a seamless loop.
 *
 * - Pauses while the tab is hidden (no wasted work / no desync on return).
 * - Honours prefers-reduced-motion by freezing on the first scene.
 */
export function useSceneLoop(durations: readonly number[], enabled = true): number {
  const [scene, setScene] = useState(0);
  const reduced = usePrefersReducedMotion();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || reduced || durations.length === 0) {
      setScene(0);
      return;
    }

    let current = 0;
    setScene(0);

    const clear = () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };

    const schedule = () => {
      clear();
      timer.current = window.setTimeout(() => {
        current = (current + 1) % durations.length;
        setScene(current);
        schedule();
      }, durations[current]);
    };

    const onVisibility = () => {
      if (document.hidden) clear();
      else schedule();
    };

    schedule();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clear();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [durations, enabled, reduced]);

  return scene;
}
