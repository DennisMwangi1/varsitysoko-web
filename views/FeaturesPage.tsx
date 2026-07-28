import React from 'react';
import type { ViewState } from '../App';
import { Eyebrow, Button, PhoneFrame, FeatureIcon, SectionHeading, useStickyStackFade } from '../components/UI';
import { APP_FEATURES } from '../constants';

const Check: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent = '#5A24D5' }) => (
  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}1a`, color: accent }}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
    </span>
    {children}
  </li>
);

const Detail: React.FC<{
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  image: string;
  accent?: string;
  flip?: boolean;
  /** Higher cards sit above earlier ones in the sticky stack. */
  layer: number;
}> = ({ eyebrow, title, body, points, image, accent, flip, layer }) => {
  const { ref, style } = useStickyStackFade<HTMLDivElement>();
  return (
  <div
    ref={ref}
    style={{ ...style, zIndex: layer }}
    className="grid md:grid-cols-2 gap-10 md:gap-16 items-center py-14 md:py-16 border-t border-slate-100 dark:border-[#2A3350] md:sticky md:top-[22vh] bg-[#FAFAF9] dark:bg-[#0F1117]"
  >
    <div className={flip ? 'md:order-2' : ''}>
      <Eyebrow className="mb-3" color={accent}>{eyebrow}</Eyebrow>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink dark:text-white tracking-tight mb-5 heading">{title}</h2>
      <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{body}</p>
      <ul className="space-y-3">
        {points.map((p) => <Check key={p} accent={accent}>{p}</Check>)}
      </ul>
    </div>
    <div className={flip ? 'md:order-1' : ''}>
      <PhoneFrame src={image} alt={`VarsitySoko — ${title}`} />
    </div>
  </div>
  );
};

const FeaturesPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-4">
        <div className="max-w-3xl reveal-up">
          <Eyebrow className="mb-4">App features</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.05] heading">
            Built for the <span className="gradient-text">student hustle.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Every feature is designed around how students actually buy and sell on campus — verified, local, and safe.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {APP_FEATURES.map((feature) => (
            <div key={feature.title} className="reveal-up bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] p-7 rounded-2xl shadow-card hover-lift">
              <FeatureIcon icon={feature.icon} className="mb-5" />
              <h3 className="text-lg font-bold text-ink dark:text-white mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <Detail
          layer={1}
          image="/images/verified.jpeg"
          eyebrow="Identity"
          title="Verified students only."
          body="Everyone proves they study at your university before they can trade — with a one-time code to their campus email, or a reviewed student ID. You always know who you’re dealing with."
          points={['Campus email verification', 'Student ID review', 'Campus-specific communities', 'Ratings and trust profiles']}
        />
        <Detail
          layer={2}
          flip
          image="/images/listing.jpeg"
          eyebrow="Selling"
          title="List fast, sell smart."
          body="Post an item in a couple of taps and get a clear view of how it’s doing. Sellers see helpful insights on interest and pricing so they can move items faster."
          points={['Quick photo listings', 'Selling insights on your items', 'Organised offers and chats', 'Boost a listing when you want reach']}
        />
        <Detail
          layer={3}
          image="/images/chat.jpeg"
          eyebrow="Messaging"
          title="Chat, offer, and agree a meetup."
          body="Message sellers in real time, negotiate a price with in-app offers, and lock in a safe on-campus meetup — without leaving VarsitySoko."
          points={['Real-time chat on every listing', 'Make and accept offers in-thread', 'Safety tips on every conversation', 'See listing context while you chat']}
        />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <SectionHeading title="Ready to try it?" lead="Get VarsitySoko and join your campus community." />
        <Button variant="primary" className="mt-8 py-3.5 px-8" onClick={() => onNavigate('download')}>Join waitlist</Button>
      </section>
    </div>
  );
};

export default FeaturesPage;
