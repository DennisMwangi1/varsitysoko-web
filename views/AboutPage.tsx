import React from 'react';
import type { ViewState } from '../App';
import { Eyebrow, Button, SectionHeading, PhoneFrame } from '../components/UI';

const Pillar: React.FC<{ title: string; body: string; icon: React.ReactNode; bg: string; fg?: string }> = ({ title, body, icon, bg, fg = '#fff' }) => (
  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 reveal-up">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: bg, color: fg }}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/70 leading-relaxed text-sm">{body}</p>
  </div>
);

const AboutPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8">
        <div className="max-w-3xl reveal-up">
          <Eyebrow className="mb-4">Our story</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.05] heading">
            Connecting <span className="gradient-text">campus communities.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            VarsitySoko is a marketplace built exclusively for Kenyan university students. We make campus
            commerce safe, simple, and personal — campus by campus.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="reveal-up">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-white mb-5 tracking-tight heading">The problem.</h2>
          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            General marketplaces are full of scammers, out-of-town sellers, and risky logistics. Students
            feel unsafe trading essentials like laptops, textbooks, and furniture — and there’s no platform
            designed for how students actually trade: fast, local, and trust-based.
          </p>
          <div className="mt-6 h-1 w-24 bg-brand rounded-full" />
        </div>
        <div className="reveal-up rounded-3xl overflow-hidden">
          <img
            src="/images/laptop.png"
            alt="VarsitySoko marketplace on laptop and phone"
            className="w-full h-auto block"
            width={1315}
            height={862}
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="md:order-2 reveal-up">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-white mb-5 tracking-tight heading">Our solution.</h2>
          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            A mobile-first marketplace where only verified students can take part. By keeping trades within a
            single campus, we remove shipping and strangers entirely — every trade happens face-to-face on
            familiar ground, at a designated safe zone.
          </p>
          <div className="mt-6 h-1 w-24 bg-emerald-500 rounded-full" />
        </div>
        <div className="md:order-1 reveal-up flex justify-center">
          <PhoneFrame src="/images/home.jpeg" alt="VarsitySoko marketplace home screen" />
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-gradient-to-br from-brand via-brand-dark to-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 brand-pattern opacity-[0.06]" />
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 relative">
          <div className="text-center mb-14 reveal-up">
            <div className="inline-block text-xs font-bold uppercase tracking-[0.08em] text-white/60 mb-3">Our pillars</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight heading">Why students trust us.</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Pillar
              title="Verification"
              body="Every user is a verified student at a supported university. You always know who you’re trading with."
              bg="#5A24D5"
              icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />
            <Pillar
              title="Proximity"
              body="Trades happen at designated safe zones on your own campus. No long trips, no meeting strangers off-campus."
              bg="#8B5CF6"
              icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <Pillar
              title="Control"
              body="You pay in person, on your terms — the app never holds your money. Report or block anyone, any time."
              bg="#FFD60A"
              fg="#101828"
              icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" /></svg>}
            />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-dark to-brand-navy text-white text-center p-10 sm:p-16">
          <div className="absolute inset-0 brand-pattern opacity-[0.06]" />
          <div className="relative">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight heading">Built by students, for students.</h2>
            <p className="mt-5 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              We started VarsitySoko because we lived the frustration of unsafe online trading as students
              ourselves. Our mission is to make every campus in Kenya a connected, thriving — and safe — marketplace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="inverted" onClick={() => onNavigate('download')}>Join waitlist</Button>
              <Button variant="ghostBrand" onClick={() => onNavigate('campus')}>Partner with us</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
