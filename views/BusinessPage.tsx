import React, { useState } from 'react';
import type { ViewState } from '../App';
import { Eyebrow, Button, FeatureIcon, SectionHeading, Input, Textarea, Select } from '../components/UI';
import { BUSINESS_FEATURES, BRAND, UNIVERSITIES } from '../constants';
import { submitLead } from '../lib/leads';

const BusinessInquiryForm: React.FC = () => {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viaMailto, setViaMailto] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 text-center">
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
          {viaMailto
            ? 'If your email app opened, hit send. Otherwise email us at ' + BRAND.supportEmail + '.'
            : 'Thanks — we’ll get back to you.'}
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const data = new FormData(e.currentTarget);
        setSubmitting(true);
        const result = await submitLead({
          kind: 'business',
          name: String(data.get('name') || ''),
          business: String(data.get('business') || ''),
          email: String(data.get('email') || ''),
          phone: String(data.get('phone') || ''),
          campus: String(data.get('campus') || ''),
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
        <Input name="name" required placeholder="Your name" aria-label="Your name" />
        <Input name="business" required placeholder="Business name" aria-label="Business name" />
      </div>
      <Input name="email" type="email" required placeholder="you@business.com" aria-label="Email" />
      <Input name="phone" type="tel" placeholder="WhatsApp / phone" aria-label="WhatsApp or phone" />
      <Select name="campus" required aria-label="Nearest campus" defaultValue="">
        <option value="" disabled>
          Nearest campus
        </option>
        {UNIVERSITIES.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </Select>
      <Textarea name="details" required placeholder="What do you sell, and how close are you to campus?" aria-label="About your business" />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" fullWidth variant="primary" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send'}
      </Button>
    </form>
  );
};

const BusinessPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal-up">
          <Eyebrow className="mb-4">For local businesses</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink dark:text-white leading-[1.05] heading">
            Put your shop in front of students on campus.
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Already selling to students near a campus? We’ll list your menu in the app. They call or WhatsApp you to
            order — you handle the rest, same as now. No cut of the sale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="py-3.5 px-7"
              onClick={() => document.getElementById('business-inquiry')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Talk to us
            </Button>
            <Button variant="outline" className="py-3.5 px-7" onClick={() => onNavigate('stores')}>
              I’m a student seller
            </Button>
          </div>
        </div>
        <div className="reveal-up">
          <img
            src="/images/business.png"
            alt="A local campus business handing a VarsitySoko bag to a student"
            className="w-full rounded-3xl object-cover aspect-[4/3] shadow-lift"
            width={1536}
            height={1024}
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading eyebrow="What you get" title="A listing on campus. Orders on your phone." />
        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {BUSINESS_FEATURES.map((f) => (
            <div
              key={f.title}
              className="reveal-up bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-2xl p-8 shadow-card"
            >
              <FeatureIcon icon={f.icon} className="mb-5" />
              <h3 className="text-xl font-bold text-ink dark:text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading eyebrow="How it works" title="From signup to your first order." />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              ['1', 'We set you up', 'There’s no self-signup yet. Tell us about your shop and we’ll create the account.'],
              ['2', 'Add your menu', 'Prices, photos, what’s in stock. Update hours or a short announcement anytime.'],
              ['3', 'Students find you', 'They browse Local Businesses, open your page, then call or WhatsApp.'],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-[#FAFAF9] dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] rounded-2xl p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center font-extrabold text-lg tnums mb-5">
                  {n}
                </div>
                <h3 className="text-lg font-bold text-ink dark:text-white mb-2">{t}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-400 max-w-2xl mx-auto">
            Optional: pay with M-Pesa to boost your store for a day or feature it for a week. That’s the only payment
            that goes through the app — customer orders stay between you and them.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-slate-100 dark:border-[#2A3350] bg-[#FAFAF9] dark:bg-[#1A1F2E] p-8 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Eyebrow className="mb-3">Student sellers</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-white tracking-tight heading">
              Selling as a student on campus?
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              That’s Campus Stores — your own shopfront, listings, and chat in the app. This page is for shops near
              campus that take orders on WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <Button variant="outline" onClick={() => onNavigate('stores')}>
              Campus Stores →
            </Button>
          </div>
        </div>
      </section>

      <section id="business-inquiry" className="bg-white dark:bg-[#151A28] border-y border-slate-100 dark:border-[#2A3350]">
        <div className="max-w-xl mx-auto px-6 py-20 sm:py-28">
          <SectionHeading
            eyebrow="Get listed"
            title="Want your shop listed?"
            lead="Send a short note about your business. We’ll follow up when we’re ready to onboard near your campus."
            className="mb-10"
          />
          <BusinessInquiryForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            Or email{' '}
            <a
              href={`mailto:${BRAND.supportEmail}?subject=Local%20Business`}
              className="text-brand dark:text-brand-light font-semibold hover:underline"
            >
              {BRAND.supportEmail}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default BusinessPage;
