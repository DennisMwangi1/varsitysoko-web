import React from 'react';
import type { ViewState } from '../App';
import { Eyebrow, Button, FeatureIcon, SectionHeading } from '../components/UI';
import { STORE_FEATURES } from '../constants';

const StoresPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal-up">
          <Eyebrow className="mb-4">For campus stores</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.05] heading">
            Turn your hustle into a <span className="gradient-text">campus brand.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Selling snacks, thrift, tech, or services? Open a verified store on VarsitySoko and reach every
            student on your campus from one branded shopfront.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="py-3.5 px-7" onClick={() => onNavigate('download')}>Join waitlist</Button>
            <Button variant="outline" className="py-3.5 px-7" onClick={() => onNavigate('business')}>I’m a local business</Button>
          </div>
        </div>
        <div className="reveal-up">
          <img
            src="/images/store.png"
            alt="A campus store stall on VarsitySoko with products and a student seller"
            className="w-full rounded-3xl object-cover aspect-[4/3] shadow-lift"
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="What you get" title="A real shopfront, inside your campus." />
        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {STORE_FEATURES.map((f) => (
            <div key={f.title} className="reveal-up bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-2xl p-8 shadow-card">
              <FeatureIcon icon={f.icon} className="mb-5" />
              <h3 className="text-xl font-bold text-ink dark:text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to start */}
      <section className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading eyebrow="Getting started" title="From verified student to open store." />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              ['1', 'Get verified', 'Sign up and verify you’re a student — the same trusted check every buyer sees.'],
              ['2', 'Set up your store', 'Add your store name, cover, and list your catalogue in a few taps.'],
              ['3', 'Start selling', 'Buyers discover you in the campus feed and message you directly. Promote listings when you want a boost.'],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-[#FAFAF9] dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-2xl p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center font-extrabold text-lg tnums mb-5">{n}</div>
                <h3 className="text-lg font-bold text-ink dark:text-white mb-2">{t}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-400 max-w-2xl mx-auto">
            The only money that flows through the app is an optional M-Pesa payment to promote a listing.
            Buyers still pay you in person, at the meetup.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
        <SectionHeading title="Ready to open your campus store?" lead="Join the waitlist — we’ll tell you when Campus Stores open at your university." />
        <Button variant="primary" className="mt-8 py-3.5 px-8" onClick={() => onNavigate('download')}>Join waitlist</Button>
      </section>
    </div>
  );
};

export default StoresPage;
