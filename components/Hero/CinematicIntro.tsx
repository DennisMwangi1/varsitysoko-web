import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MARK_ASPECT, MARK_RECT, MARK_SHAPE } from './markOutline';
import { usePrefersReducedMotion } from './useSceneLoop';
import { BRAND } from '../../constants';

/**
 * Scroll-scrubbed brand intro.
 *
 * Campus footage → clips into the real V-mark → dissolves into the logo →
 * typewriter “arsitySoko” → tagline. When the tagline has landed, the parent
 * can fade the navbar in. No fly-to-nav handoff.
 */

/** Letters after the V-mark — the mark itself is the leading “V”. */
const WORDMARK = 'arsitySoko';
const SOKO_AT = 6;

const PHASE = {
  headlineOut: [0.06, 0.20],
  clip: [0.10, 0.44],
  dissolve: [0.44, 0.56],
  pegboard: [0.38, 0.58],
  lockup: [0.56, 0.70],
  type: [0.70, 0.88],
  tagline: [0.86, 0.95],
  hintOut: [0.0, 0.05],
} as const;

/** Progress at which the wordmark + tagline are fully in — navbar may appear. */
const NAV_READY_AT = 0.95;

/** Peak opacity of the pegboard once the lockup has landed. */
const PEGBOARD_OPACITY = 0.28;
const PEGBOARD_OPACITY_DARK = 0.35;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const phase = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CinematicIntroProps {
  videoSrc?: string;
  videoWebmSrc?: string;
  posterSrc?: string;
  headline?: [string, string];
  kicker?: string;
  /** True once the tagline has fully landed (navbar can fade in). */
  onNavReadyChange?: (ready: boolean) => void;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({
  videoSrc,
  videoWebmSrc,
  posterSrc,
  headline = ['Your campus', 'Your marketplace'],
  kicker = 'A place to trade with people you trust',
  onNavReadyChange,
}) => {
  const reduced = usePrefersReducedMotion();
  const [footageFailed, setFootageFailed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const footageRef = useRef<HTMLDivElement>(null);
  const pegboardRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLImageElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const geometry = useRef<{ stage: Box; slot: Box; frame: Box } | null>(null);
  const rafId = useRef(0);
  const navReadyRef = useRef(false);
  const onNavReadyChangeRef = useRef(onNavReadyChange);
  onNavReadyChangeRef.current = onNavReadyChange;

  const showFootage = Boolean(videoSrc) && !footageFailed;

  const setNavReady = useCallback((ready: boolean) => {
    if (navReadyRef.current === ready) return;
    navReadyRef.current = ready;
    onNavReadyChangeRef.current?.(ready);
  }, []);

  const measure = useCallback(() => {
    const stageEl = stageRef.current;
    const markEl = markRef.current;
    if (!stageEl || !markEl) return;

    const previous = markEl.style.transform;
    markEl.style.transform = 'none';
    const markRect = markEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();
    markEl.style.transform = previous;

    if (!markRect.width || !stageRect.width) return;

    const stage: Box = { x: 0, y: 0, w: stageRect.width, h: stageRect.height };
    const slot: Box = {
      x: markRect.left - stageRect.left,
      y: markRect.top - stageRect.top,
      w: markRect.width,
      h: markRect.height,
    };

    const frameH = Math.min(stage.h * 0.54, (stage.w * 0.68) / MARK_ASPECT);
    const frameW = frameH * MARK_ASPECT;
    geometry.current = {
      stage,
      slot,
      frame: {
        x: (stage.w - frameW) / 2,
        y: (stage.h - frameH) / 2,
        w: frameW,
        h: frameH,
      },
    };
  }, []);

  const clipPathAt = useCallback((t: number) => {
    const geo = geometry.current;
    if (!geo) return 'none';
    const { stage, frame: f } = geo;
    const points = MARK_SHAPE.map((markPoint, i) => {
      const rectPoint = MARK_RECT[i];
      const markX = ((f.x + markPoint[0] * f.w) / stage.w) * 100;
      const markY = ((f.y + markPoint[1] * f.h) / stage.h) * 100;
      return `${lerp(rectPoint[0] * 100, markX, t).toFixed(3)}% ${lerp(rectPoint[1] * 100, markY, t).toFixed(3)}%`;
    });
    return `polygon(${points.join(', ')})`;
  }, []);

  const paintScrub = useCallback(
    (p: number) => {
      const geo = geometry.current;
      if (!geo) return;

      const footage = footageRef.current;
      if (footage) {
        footage.style.clipPath = clipPathAt(easeInOutCubic(phase(p, PHASE.clip)));
        footage.style.opacity = String(1 - phase(p, PHASE.dissolve));
      }

      const headlineOut = 1 - phase(p, PHASE.headlineOut);
      if (headlineRef.current) headlineRef.current.style.opacity = String(headlineOut);
      if (scrimRef.current) scrimRef.current.style.opacity = String(headlineOut);

      const mark = markRef.current;
      if (mark) {
        const { slot, frame: f } = geo;
        const t = easeInOutCubic(phase(p, PHASE.lockup));
        mark.style.transform = `translate(${lerp(f.x - slot.x, 0, t).toFixed(2)}px, ${lerp(f.y - slot.y, 0, t).toFixed(2)}px) scale(${lerp(f.w / slot.w, 1, t).toFixed(4)})`;
        mark.style.opacity = String(phase(p, PHASE.dissolve));
      }

      const chars = wordmarkRef.current?.children;
      if (chars) {
        const typed = phase(p, PHASE.type);
        const total = chars.length;
        for (let i = 0; i < total; i++) {
          (chars[i] as HTMLElement).style.opacity = String(clamp01((typed - i / total) / (0.9 / total)));
        }
      }

      if (taglineRef.current) {
        const t = easeOutCubic(phase(p, PHASE.tagline));
        taglineRef.current.style.opacity = String(t);
        taglineRef.current.style.transform = `translateY(${((1 - t) * 12).toFixed(2)}px)`;
      }

      if (hintRef.current) hintRef.current.style.opacity = String(1 - phase(p, PHASE.hintOut));

      if (pegboardRef.current) {
        const pegT = easeOutCubic(phase(p, PHASE.pegboard));
        const dark = document.documentElement.classList.contains('dark');
        pegboardRef.current.style.opacity = String(
          pegT * (dark ? PEGBOARD_OPACITY_DARK : PEGBOARD_OPACITY)
        );
      }

      setNavReady(p >= NAV_READY_AT);
    },
    [clipPathAt, setNavReady]
  );

  const render = useCallback(() => {
    rafId.current = 0;
    const section = sectionRef.current;
    if (!section) return;

    const scrubbable = section.offsetHeight - window.innerHeight;
    if (scrubbable < window.innerHeight * 1.2) {
      paintScrub(0);
      return;
    }

    paintScrub(clamp01(-section.getBoundingClientRect().top / scrubbable));
  }, [paintScrub]);

  const onScroll = useCallback(() => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(render);
  }, [render]);

  const onResize = useCallback(() => {
    measure();
    render();
  }, [measure, render]);

  useLayoutEffect(() => {
    if (reduced) return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [reduced]);

  useLayoutEffect(() => {
    if (reduced) return;
    onResize();
  }, [reduced, onResize]);

  useEffect(() => {
    if (reduced) {
      setNavReady(true);
      return;
    }
    setNavReady(false);
  }, [reduced, setNavReady]);

  useEffect(() => {
    if (reduced) return;

    const snapTop = () => {
      if (!navReadyRef.current && window.scrollY > 0) window.scrollTo(0, 0);
    };
    snapTop();
    const t1 = window.setTimeout(snapTop, 50);
    const t2 = window.setTimeout(snapTop, 200);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [reduced, onScroll, onResize]);

  if (reduced) {
    return (
      <section aria-label={`${BRAND.name} — ${BRAND.tagline}`} className="relative bg-[#FAFAF9] dark:bg-[#0F1117]">
        <div className="pointer-events-none absolute inset-0 intro-pegboard opacity-[0.28] dark:opacity-[0.35]" />
        <div className="relative flex min-h-[50vh] w-full items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center">
            <div className="brand-lockup">
              <img src="/images/mark.svg" alt="" aria-hidden="true" className="h-14 w-auto sm:h-16" width={1122} height={927} />
              <span className="brand-lockup-word heading text-4xl font-extrabold tracking-tight sm:text-5xl" aria-label={BRAND.name}>
                <span className="text-ink dark:text-white">arsity</span>
                <span className="text-brand dark:text-brand-light">Soko</span>
              </span>
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
              {BRAND.tagline}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label={`${BRAND.name} — ${BRAND.tagline}`} className="intro-scrub relative">
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-[#FAFAF9] dark:bg-[#0F1117]"
      >
        {/* Pegboard behind the footage — revealed as the frame clips into the V,
            then holds under the lockup once the footage dissolves. */}
        <div
          ref={pegboardRef}
          className="pointer-events-none absolute inset-0 z-[1] intro-pegboard"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />

        <div ref={footageRef} className="absolute inset-0 z-[2]" style={{ willChange: 'clip-path, opacity' }}>
          {showFootage ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setFootageFailed(true)}
            >
              {videoWebmSrc && <source src={videoWebmSrc} type="video/webm" />}
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <div className="intro-gradient absolute inset-0">
              <span className="intro-bokeh" />
              <span className="intro-bokeh" />
              <span className="intro-bokeh" />
              <span className="intro-bokeh" />
              <span className="intro-bokeh" />
            </div>
          )}
          <div ref={scrimRef} className="absolute inset-0 bg-brand-navy/50" />
        </div>

        <div
          ref={headlineRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="heading text-3xl font-extrabold uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
            {headline[0]}
            <br />
            {headline[1]}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/70 sm:text-base">{kicker}</p>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
          <div className="flex flex-col items-center">
            <div className="brand-lockup">
              <img
                ref={markRef}
                src="/images/mark.svg"
                alt=""
                aria-hidden="true"
                draggable={false}
                width={1122}
                height={927}
                onLoad={onResize}
                className="h-14 w-auto shrink-0 select-none sm:h-16 lg:h-20"
                style={{ opacity: 0, transformOrigin: 'top left', willChange: 'transform, opacity' }}
              />
              <span
                ref={wordmarkRef}
                className="brand-lockup-word heading whitespace-nowrap text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                aria-label={BRAND.name}
              >
                {WORDMARK.split('').map((char, i) => (
                  <span
                    key={`${char}-${i}`}
                    aria-hidden="true"
                    className={`inline-block ${i >= SOKO_AT ? 'text-brand dark:text-brand-light' : 'text-ink dark:text-white'}`}
                    style={{ opacity: 0 }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
            <div
              ref={taglineRef}
              className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm"
              style={{ opacity: 0 }}
            >
              {BRAND.tagline}
            </div>
          </div>
        </div>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-white/70"
        >
          <span>Scroll</span>
          <svg
            className="intro-chevron h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CinematicIntro;
