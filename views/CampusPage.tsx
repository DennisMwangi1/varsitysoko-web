import React, { useState } from 'react';
import type { ViewState } from '../App';
import { Eyebrow, Button, Input, Textarea, Select, SectionHeading, WaitlistForm } from '../components/UI';
import { UNIVERSITIES, BRAND } from '../constants';
import { submitLead, type LeadKind } from '../lib/leads';

const InquiryForm: React.FC<{ accent: string; kind: 'university' | 'org'; onPrivacy?: () => void }> = ({
  accent,
  kind,
}) => {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viaMailto, setViaMailto] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 text-center">
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
          {viaMailto
            ? `If your email app opened, hit send. Otherwise email ${BRAND.supportEmail}.`
            : 'Thanks — we’ll be in touch.'}
        </p>
      </div>
    );
  }

  const leadKind: LeadKind = kind === 'university' ? 'campus_university' : 'campus_org';

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const data = new FormData(e.currentTarget);
        setSubmitting(true);
        const result = await submitLead({
          kind: leadKind,
          name: String(data.get('name') || ''),
          organisation: String(data.get('organisation') || ''),
          email: String(data.get('email') || ''),
          details: String(data.get('details') || ''),
        });
        setSubmitting(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setViaMailto(result.via === 'mailto');
        setDone(true);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input name="name" required placeholder="Full name" aria-label="Full name" />
        <Input
          name="organisation"
          required
          placeholder={kind === 'university' ? 'University' : 'Organisation'}
          aria-label="Organisation"
        />
      </div>
      <Input name="email" type="email" required placeholder="you@organisation.com" aria-label="Email" />
      <Textarea
        name="details"
        required
        placeholder="Tell us about your campus or organisation…"
        aria-label="Details"
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" fullWidth style={{ backgroundColor: accent }} className="text-white" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send inquiry'}
      </Button>
    </form>
  );
};

const CampusPage: React.FC<{ onNavigate?: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal-up">
          <Eyebrow className="mb-4">Partnerships</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.05] heading">
            Bring VarsitySoko to <span className="gradient-text">your campus.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            We’re building safe student commerce for Kenya’s universities, one campus at a time. Work with us to
            launch VarsitySoko at yours.
          </p>
        </div>
        <div className="reveal-up">
          <img
            src="/images/campus.png"
            alt="Students walking together on a VarsitySoko campus"
            className="w-full rounded-3xl object-cover aspect-[4/3] shadow-lift"
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="Students & guilds"
          title="Rally your campus."
          lead="Are you a student, class rep, or guild leader? Add your campus to the waitlist — the more students who ask, the sooner we launch."
          className="mb-8"
        />
        <WaitlistForm universities={UNIVERSITIES} onPrivacy={onNavigate ? () => onNavigate('privacy') : undefined} />
      </section>

      <section className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                align="left"
                eyebrow="Why partner"
                title="More than a marketplace."
                lead="VarsitySoko is built as a verified, campus-native channel to students — launching university by university."
              />
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8">
              {[
                ['Verified audience', 'Reach real, verified students — no bots, no bought reach.'],
                ['Trust layer', 'Built-in identity verification means authentic engagement.'],
                ['Campus-native', 'Designed for how students trade: local, on-campus, and face to face.'],
                ['Safe by design', 'On-campus meetups and moderation keep the community healthy.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-ink dark:text-white mb-2">
                    <span className="w-1 h-4 bg-brand rounded-full" /> {t}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="Get in touch" title="Let’s talk." className="mb-14" />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-3xl p-8 shadow-card">
            <Eyebrow className="mb-3">Universities</Eyebrow>
            <h3 className="text-2xl font-extrabold text-ink dark:text-white tracking-tight mb-3 heading">University partners</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Launch VarsitySoko for your student body with campus-tailored verification, safe-zone setup, and
              engagement insights.
            </p>
            <InquiryForm accent="#5A24D5" kind="university" />
          </div>
          <div className="bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-3xl p-8 shadow-card">
            <Eyebrow className="mb-3" color="#16A34A">
              Brands &amp; investors
            </Eyebrow>
            <h3 className="text-2xl font-extrabold text-ink dark:text-white tracking-tight mb-3 heading">Brands &amp; investors</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Back a high-trust commerce platform for Kenyan students, or reach our verified campus audience when we
              launch.
            </p>
            <InquiryForm accent="#16A34A" kind="org" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampusPage;
