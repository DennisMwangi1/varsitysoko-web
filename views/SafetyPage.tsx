import React from 'react';
import type { ViewState } from '../App';
import { Eyebrow, Button, FeatureIcon, SectionHeading, TrustChip } from '../components/UI';
import { SAFETY_FEATURES } from '../constants';

const SafetyPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal-up">
          <Eyebrow className="mb-4">Safety</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.05] heading">
            Trading you can <span className="gradient-text">trust.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Safety isn’t a footnote at VarsitySoko — it’s the whole design. Verified students, safe on-campus
            meetups, and real accountability on every trade.
          </p>
          <Button variant="primary" className="mt-8" onClick={() => onNavigate('download')}>
            Join waitlist
          </Button>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <TrustChip>Verified students</TrustChip>
            <TrustChip>On-campus safe zones</TrustChip>
            <TrustChip>Report &amp; block</TrustChip>
            <TrustChip>No money held in-app</TrustChip>
          </div>
        </div>
        <div className="reveal-up">
          <img
            src="/images/trust-safety.png"
            alt="Two students high-fiving after a successful campus trade"
            className="w-full rounded-3xl object-cover aspect-[4/3] shadow-lift bg-slate-100 dark:bg-[#1A1F2E]"
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <SectionHeading eyebrow="How it stays safe" title="Four layers of protection." />
        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {SAFETY_FEATURES.map((f) => (
            <div key={f.title} className="reveal-up bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-2xl p-8 shadow-card">
              <FeatureIcon icon={f.icon} className="mb-5" />
              <h3 className="text-xl font-bold text-ink dark:text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet-safe checklist */}
      <section className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading eyebrow="Meet safe" title="Every meetup, the same simple rules." className="mb-10" />
          <ul className="space-y-4">
            {[
              'Meet at a designated safe zone on your own campus — busy, well-lit, and public.',
              'Meet in daylight where you can, and bring a friend if it helps you feel comfortable.',
              'Check the item in person before you pay. If it isn’t as described, walk away.',
              'Pay hand-to-hand when you’re happy — cash or M-Pesa. The app never holds your money.',
              'Something off? Report or block the user in one tap. Our team reviews every report.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-base text-slate-600 dark:text-slate-300">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Privacy note */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-28">
        <div className="rounded-3xl border border-slate-100 dark:border-[#2A3350] bg-white dark:bg-[#1A1F2E] p-8 sm:p-12">
          <Eyebrow className="mb-3">Your data</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-white tracking-tight heading mb-4">
            Verification data, handled with care.
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            To keep the community verified, we may check a student ID during sign-up. We treat that information
            as sensitive personal data under the Kenya Data Protection Act, 2019 — it’s used only to confirm you’re
            a student, stored securely, and retained no longer than necessary.
          </p>
          <Button variant="ghost" className="mt-6 px-0" onClick={() => onNavigate('privacy')}>Read our Privacy Policy →</Button>
        </div>
      </section>
    </div>
  );
};

export default SafetyPage;
