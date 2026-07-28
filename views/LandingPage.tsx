import React, { useLayoutEffect } from 'react';
import type { ViewState } from '../App';
import {
  Button,
  Eyebrow,
  SectionHeading,
  FeatureIcon,
  Accordion,
  WaitlistForm,
  useScrollGrow,
} from '../components/UI';
import { APP_FEATURES, HOW_IT_WORKS, FAQ, UNIVERSITIES, INTRO_MEDIA } from '../constants';
import CinematicIntro from '../components/Hero/CinematicIntro';
import Hero from '../components/Hero/Hero';
import { useIsMobile, usePrefersReducedMotion } from '../components/Hero/useSceneLoop';

/** Trust chip — green check, dark label. */
const TrustChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
    {children}
  </span>
);

/** Scroll-animated sticky step card — grows/fades toward the viewport centre (honours reduced-motion). */
const StepCard: React.FC<{ number: string; title: string; desc: string; accent: string }> = ({
  number,
  title,
  desc,
  accent,
}) => {
  const { ref, style } = useScrollGrow<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="min-h-0 md:min-h-[30vh] flex flex-col justify-center relative md:sticky md:top-[26vh] mb-6 md:mb-[6vh]"
      style={style}
    >
      <div className="bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] p-6 md:p-10 rounded-3xl shadow-card flex flex-col md:flex-row gap-6 md:gap-8 items-center overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-1000">
          <div className="brand-pattern w-full h-full" />
        </div>
        <div className="text-[4rem] md:text-[7rem] font-extrabold leading-none select-none tnums heading" style={{ color: `${accent}1f` }}>
          {number}
        </div>
        <div className="max-w-md relative z-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            Step {number}
          </span>
          <h3 className="text-xl md:text-3xl font-extrabold text-ink dark:text-white mb-3 tracking-tight heading">{title}</h3>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<{
  onNavigate: (v: ViewState) => void;
  onNavReadyChange?: (ready: boolean) => void;
}> = ({ onNavigate, onNavReadyChange }) => {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const staticIntro = reduced || mobile;

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    onNavReadyChange?.(staticIntro);
  }, [staticIntro, onNavReadyChange]);

  return (
    <div>
      <CinematicIntro {...INTRO_MEDIA} onNavReadyChange={onNavReadyChange} />

      {/* Clears the fixed navbar once it has faded in. */}
      <div className="h-16" aria-hidden="true" />

      {/* Launch band — live status, CTAs, and trust chips from the old conversion hero. */}
      <section className="border-y border-slate-100 dark:border-[#2A3350] bg-white/50 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-ink dark:text-white">
              <span className="w-2 h-2 rounded-full bg-brand" /> Coming soon to Kenyan campuses
            </span>
            <span className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-[#2A3350]" />
            <button onClick={() => onNavigate('campus')} className="text-sm font-semibold text-brand dark:text-brand-light hover:underline underline-offset-4">
              Bring VarsitySoko to your campus →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="py-3.5 px-7" onClick={() => onNavigate('download')}>
              Join waitlist
            </Button>
            <Button variant="outline" className="py-3.5 px-7" onClick={() => onNavigate('features')}>
              See how it works
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <TrustChip>Verified students</TrustChip>
            <TrustChip>Safe campus meetups</TrustChip>
            <TrustChip>Pay in person</TrustChip>
          </div>
        </div>
      </section>

      {/* Product — polished 3D device mockup. */}
      <section className="relative overflow-x-clip">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/[0.04] via-transparent to-transparent dark:from-brand/[0.1] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 relative">
          <SectionHeading
            eyebrow="Product"
            title="Your campus marketplace, on every screen."
            lead="Browse listings, chat with sellers, and arrange a safe meetup — the same VarsitySoko experience on laptop and phone."
          />
          <div className="mt-14 reveal-up">
            <Hero />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps, one safe trade."
          lead="From proving you’re a student to meeting on campus — trading is the trust argument told as a flow."
        />
        <div className="mt-14 relative">
          {HOW_IT_WORKS.map((step) => (
            <StepCard key={step.number} number={step.number} title={step.title} desc={step.desc} accent={step.accent} />
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading eyebrow="Features" title="Everything you need to trade on campus." />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {APP_FEATURES.map((f) => (
              <div key={f.title} className="reveal-up bg-[#FAFAF9] dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-2xl p-7 hover-lift">
                <FeatureIcon icon={f.icon} className="mb-5" />
                <h3 className="text-lg font-bold text-ink dark:text-white mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="ghost" onClick={() => onNavigate('features')}>Explore all features →</Button>
          </div>
        </div>
      </section>

      {/* Safety band */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 brand-pattern opacity-[0.06]" />
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 relative">
          <div className="max-w-2xl">
            <Eyebrow className="mb-3 text-brand-light">Safety</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight heading">Built around trust.</h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
              Verified students. Designated safe zones. Report and block. Safety isn’t a feature — it’s the product.
            </p>
          </div>
          <Button variant="inverted" className="mt-8" onClick={() => onNavigate('safety')}>
            Learn about safety →
          </Button>
        </div>
      </section>

      {/* Campus Stores + Local Businesses */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <Eyebrow className="mb-3">Campus Stores</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink dark:text-white tracking-tight heading">
              Turn your hustle into a campus brand.
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              Student entrepreneurs get a verified shopfront, reach buyers on their own campus, and grow a real business — without leaving university grounds.
            </p>
            <Button variant="outline" className="mt-8" onClick={() => onNavigate('stores')}>
              Explore Campus Stores →
            </Button>
          </div>
          <div>
            <Eyebrow className="mb-3">Local Businesses</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink dark:text-white tracking-tight heading">
              Run a shop near campus?
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              List your menu so students can find you and order on WhatsApp. We don’t take a cut of the sale.
            </p>
            <Button variant="outline" className="mt-8" onClick={() => onNavigate('business')}>
              For local businesses →
            </Button>
          </div>
        </div>
      </section>

      {/* Campus rollout */}
      <section className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading
            eyebrow="Campuses"
            title="Where we’re headed."
            lead="We’re launching one campus at a time. None are live yet — join the waitlist and we’ll bring VarsitySoko to your university."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UNIVERSITIES.map((u) => (
              <div
                key={u.id}
                className="rounded-2xl border p-5 border-slate-100 dark:border-[#2A3350] bg-[#FAFAF9] dark:bg-[#1A1F2E]"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-ink dark:text-white text-sm">{u.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Soon</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{u.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
        <SectionHeading eyebrow="FAQ" title="Questions, answered." />
        <div className="mt-10">
          <Accordion items={FAQ} />
        </div>
      </section>

      {/* Waitlist / CTA */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="absolute inset-0 brand-pattern opacity-[0.08]" />
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight heading">
              Ready for your campus marketplace?
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed max-w-md">
              Join the waitlist for your campus, or tell us you want VarsitySoko at your university.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button variant="inverted" onClick={() => onNavigate('download')}>
                Join waitlist
              </Button>
              <Button variant="ghostBrand" onClick={() => onNavigate('campus')}>
                Bring to my campus →
              </Button>
            </div>
          </div>
          <WaitlistForm universities={UNIVERSITIES} onPrivacy={() => onNavigate('privacy')} tone="brand" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
