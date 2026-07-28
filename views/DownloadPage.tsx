import React from 'react';
import type { ViewState } from '../App';
import { Card, PhoneFrame, StoreBadges, WaitlistForm, SectionHeading, TrustChip } from '../components/UI';
import { UNIVERSITIES } from '../constants';

const DownloadPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  const live = UNIVERSITIES.filter((u) => u.status === 'live');
  const soon = UNIVERSITIES.filter((u) => u.status === 'soon');

  const scrollToForm = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-navy text-white">
        <div className="absolute inset-0 brand-pattern opacity-[0.06]" />
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24 relative text-center">
          <div className="reveal-up">
            <div className="inline-block text-xs font-bold uppercase tracking-[0.08em] text-white/60 mb-4">Waitlist</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] heading">
              Get notified when we launch.
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              The app isn’t on the stores yet, and no campus is live. Leave your email — we’ll tell you when both are ready.
            </p>
            <div className="mt-8 flex justify-center">
              <StoreBadges onWaitlist={scrollToForm} />
            </div>
            <div className="mt-12 flex justify-center">
              <PhoneFrame src="/images/app-screenshot.png" alt="VarsitySoko app screen" className="max-w-[240px]" />
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        <SectionHeading
          title="Join the waitlist"
          lead="Pick your campus. We’ll email you when VarsitySoko opens there."
          className="mb-8"
        />
        <WaitlistForm universities={UNIVERSITIES} onPrivacy={() => onNavigate('privacy')} />
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100 dark:border-[#2A3350]">
        <SectionHeading
          eyebrow="What’s next"
          title="Once we launch, here’s the flow."
          lead="Not available yet — this is what signing up will look like."
        />
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Download', desc: 'Get the free app from the App Store or Google Play when it ships.' },
            { step: '2', title: 'Pick your campus', desc: 'Choose your university and sign up with your student email.' },
            { step: '3', title: 'Verify', desc: 'Confirm you’re a student by email code or ID review.' },
            { step: '4', title: 'Trade', desc: 'Browse the campus feed or list your first item.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-extrabold text-lg tnums shadow-card">
                {item.step}
              </div>
              <h3 className="font-bold text-ink dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100 dark:border-[#2A3350]">
        <SectionHeading
          eyebrow="Coverage"
          title="Where VarsitySoko is headed."
          lead={live.length === 0 ? 'No campus is live yet. These are on the roadmap — join the waitlist for yours.' : undefined}
        />
        <div className="mt-10">
          {live.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <TrustChip>Live now</TrustChip>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {live.map((uni) => (
                  <Card key={uni.id} className="p-5 text-center border-emerald-100 dark:border-emerald-900/50">
                    <h3 className="font-bold text-sm text-ink dark:text-white">{uni.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{uni.location}</p>
                  </Card>
                ))}
              </div>
            </>
          )}

          <p className="mb-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.08em]">
            {live.length > 0 ? 'Coming soon' : 'On the roadmap'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {soon.map((uni) => (
              <Card key={uni.id} className="p-5 text-center opacity-70">
                <h3 className="font-bold text-sm text-ink dark:text-white">{uni.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{uni.location}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100 dark:border-[#2A3350]">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-bold text-ink dark:text-white mb-6">Will work on</h3>
            <div className="space-y-3">
              {[
                ['iOS 15.0+', 'iPhone 8 or later'],
                ['Android 8.0+', 'Most modern Android phones'],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1F2E] rounded-xl border border-slate-100 dark:border-[#2A3350]"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-[#252B3B] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-ink dark:text-white">{t}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink dark:text-white mb-6">What you’ll need</h3>
            <ul className="space-y-3">
              {[
                'A valid student email (e.g. you@student.ac.ke) or your student ID',
                'A phone with a camera (for listing items)',
                'M-Pesa (only if you choose to promote a listing)',
                'An internet connection — Wi-Fi or mobile data',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 p-3 bg-white dark:bg-[#1A1F2E] rounded-xl border border-slate-100 dark:border-[#2A3350]"
                >
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DownloadPage;
