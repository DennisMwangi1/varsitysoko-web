import React, { useEffect, useId, useRef, useState } from 'react';
import { submitLead } from '../lib/leads';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type ScrollGrowOptions = {
  /** Floor opacity when far from centre. Use 0 for sticky stacks so covered cards disappear. Default 0.6. */
  minOpacity?: number;
};

/**
 * Scroll-driven grow/fade: an element scales up and fades in as it nears the
 * viewport centre, then settles back as it leaves. Disabled under reduced-motion
 * and on small screens. Returns a ref + style to spread onto the target.
 */
export function useScrollGrow<T extends HTMLElement>(options: ScrollGrowOptions = {}) {
  const minOpacity = options.minOpacity ?? 0.6;
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'scale(0.98)',
    opacity: minOpacity,
  });

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStyle({ transform: 'none', opacity: 1 });
      return;
    }
    const range = 1 - minOpacity;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      if (window.innerWidth < 768) {
        setStyle({ transform: 'none', opacity: 1 });
        return;
      }
      const rect = el.getBoundingClientRect();
      const centerOffset = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
      const threshold = window.innerHeight / 2;
      if (centerOffset < threshold) {
        const factor = 1 - centerOffset / threshold;
        setStyle({
          transform: `scale(${0.98 + 0.02 * factor})`,
          opacity: minOpacity + range * factor,
        });
      } else {
        setStyle({ transform: 'scale(0.98)', opacity: minOpacity });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [minOpacity]);

  return { ref, style };
}

/**
 * Sticky card-stack fade: the active card stays fully opaque; earlier cards
 * (underneath in the stack) fade to 0 as the next sibling sticks over them.
 * Disabled under reduced-motion and on small screens.
 */
export function useStickyStackFade<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 1 });

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStyle({ opacity: 1 });
      return;
    }
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      if (window.innerWidth < 768) {
        setStyle({ opacity: 1, transform: 'none', pointerEvents: 'auto' });
        return;
      }

      const next = el.nextElementSibling as HTMLElement | null;
      let opacity = 1;

      if (next) {
        const stickyTop = el.getBoundingClientRect().top;
        const nextTop = next.getBoundingClientRect().top;
        // Start fading as the next card enters the lower half of the viewport;
        // fully gone once it reaches this card's sticky position.
        const fadeStart = window.innerHeight * 0.72;
        const fadeEnd = stickyTop + 8;
        if (nextTop <= fadeEnd) {
          opacity = 0;
        } else if (nextTop < fadeStart) {
          opacity = (nextTop - fadeEnd) / (fadeStart - fadeEnd);
        }
      }

      setStyle({
        opacity,
        transform: opacity < 1 ? `scale(${0.96 + 0.04 * opacity})` : 'none',
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        willChange: 'opacity, transform',
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, style };
}

/** Brand V-mark. SVG on the web (spec §4.1) with a PNG fallback for older engines. */
export const BrandMark: React.FC<{ className?: string; variant?: 'mark' | 'icon' }> = ({
  className = 'w-8 h-8',
  variant = 'mark',
}) => (
  <img
    src={variant === 'icon' ? '/images/app-icon.svg' : '/images/mark.svg'}
    alt=""
    aria-hidden="true"
    className={`object-contain ${className}`}
    width={32}
    height={32}
    decoding="async"
  />
);

/** Full lockup: the V-mark IS the leading V — [mark]arsitySoko (ink · violet). */
export const BrandLockup: React.FC<{
  className?: string;
  markClassName?: string;
  dark?: boolean;
  id?: string;
  onClick?: () => void;
}> = ({ className = '', markClassName = 'w-8 h-8', dark = false, id, onClick }) => {
  const content = (
    <>
      <BrandMark className={`${markClassName} group-hover:scale-105 transition-transform duration-300`} />
      <span
        className={`brand-lockup-word font-extrabold text-lg tracking-tight heading ${
          dark ? 'text-white' : 'text-ink dark:text-white'
        }`}
      >
        arsity<span className="text-brand dark:text-brand-light">Soko</span>
      </span>
    </>
  );
  if (onClick) {
    return (
      <button
        id={id}
        onClick={onClick}
        aria-label="VarsitySoko — home"
        className={`brand-lockup group ${className}`}
      >
        {content}
      </button>
    );
  }
  return (
    <div id={id} className={`brand-lockup group ${className}`}>
      {content}
    </div>
  );
};

export const PhoneFrame: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className = '',
}) => (
  <div className={`max-w-[260px] mx-auto ${className}`}>
    <div className="bg-gradient-to-b from-brand/20 to-brand-navy/20 rounded-[2.75rem] p-2.5 border border-brand/20 shadow-lift">
      <div className="rounded-[2.25rem] overflow-hidden bg-[#1a1a2e]">
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      </div>
    </div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ghostBrand' | 'inverted' | 'accent';
  fullWidth?: boolean;
}

/** Readable, accessible button — spec §4.3 (16px / 700, sentence case). */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark hover:shadow-lift',
    secondary: 'bg-ink text-white hover:bg-brand dark:bg-white dark:text-ink dark:hover:bg-brand dark:hover:text-white',
    outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:text-white dark:hover:bg-brand',
    ghost: 'text-slate-500 hover:text-brand hover:bg-brand/5 dark:text-slate-400 dark:hover:text-brand-light dark:hover:bg-white/5',
    ghostBrand: 'text-white hover:bg-white/10 hover:text-white',
    inverted: 'bg-white text-brand hover:bg-white/90 hover:text-brand-dark',
    accent: 'bg-accent text-ink hover:brightness-95',
  };

  return (
    <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full px-5 py-3 bg-white dark:bg-[#1A1F2E] border border-slate-200 dark:border-[#2A3350] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-sm text-ink dark:text-white transition-all placeholder:text-slate-400 ${className}`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => (
  <select
    {...props}
    className={`w-full px-5 py-3 bg-white dark:bg-[#1A1F2E] border border-slate-200 dark:border-[#2A3350] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-sm text-ink dark:text-white transition-all ${className}`}
  >
    {children}
  </select>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={`w-full px-5 py-4 bg-white dark:bg-[#1A1F2E] border border-slate-200 dark:border-[#2A3350] rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-sm text-ink dark:text-white transition-all placeholder:text-slate-400 resize-none min-h-[120px] ${className}`}
  />
);

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div
    {...props}
    className={`bg-white dark:bg-[#1A1F2E] rounded-2xl overflow-hidden border border-slate-100 dark:border-[#2A3350] shadow-card ${className}`}
  >
    {children}
  </div>
);

/** Eyebrow / kicker — readable small caps, gentle tracking (spec §4.3). */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({
  children,
  className = '',
  color,
}) => (
  <p
    className={`text-xs font-bold uppercase tracking-[0.08em] text-brand dark:text-brand-light ${className}`}
    style={color ? { color } : undefined}
  >
    {children}
  </p>
);

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'default' | 'outline' | 'accent' | 'warning';
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, variant = 'default', className = '', style }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    default: 'bg-brand/5 text-brand border border-brand/10 dark:bg-brand/20 dark:text-brand-light dark:border-brand/30',
    outline: 'border border-slate-200 text-slate-500 dark:border-[#2A3350] dark:text-slate-400',
    accent: 'bg-brand text-white',
    warning: 'bg-gold-soft text-gold border border-gold/20 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-tight ${styles[variant]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

/** Verified/safe trust chip — green check + label, never colour alone (spec §9). */
export const TrustChip: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 ${className}`}
  >
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
    {children}
  </span>
);

/** Centered section heading: eyebrow + title + optional lead. */
export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
}> = ({ eyebrow, title, lead, align = 'center', className = '' }) => (
  <div className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-2xl ${className}`}>
    {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
    <h2 className="text-3xl sm:text-4xl font-extrabold text-ink dark:text-white tracking-tight heading">{title}</h2>
    {lead && <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{lead}</p>}
  </div>
);

/** A single honest stat. Numerals are tabular. */
export const Stat: React.FC<{ value: string; label: string; color?: string }> = ({ value, label, color }) => (
  <div>
    <p className="text-3xl sm:text-4xl font-extrabold text-ink dark:text-white tnums heading tracking-tight">{value}</p>
    <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400" style={color ? { color } : undefined}>
      {label}
    </p>
  </div>
);

/** Coming-soon store badges — optional waitlist CTA instead of dead store links. */
export const StoreBadges: React.FC<{ onWaitlist?: () => void; className?: string }> = ({ onWaitlist, className = '' }) => (
  <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
    <span className="inline-flex items-center gap-3 bg-ink text-white px-5 py-3 rounded-2xl opacity-90">
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] text-slate-300">Coming soon to</span>
        <span className="block text-sm font-bold">App Store</span>
      </span>
    </span>
    <span className="inline-flex items-center gap-3 bg-ink text-white px-5 py-3 rounded-2xl opacity-90">
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] text-slate-300">Coming soon to</span>
        <span className="block text-sm font-bold">Google Play</span>
      </span>
    </span>
    {onWaitlist && (
      <button type="button" onClick={onWaitlist} className="text-sm font-bold text-brand dark:text-brand-light hover:underline underline-offset-4">
        Join the waitlist →
      </button>
    )}
  </div>
);

/** Accessible accordion for FAQs — keyboard operable, one open at a time. */
export const Accordion: React.FC<{ items: { q: string; a: string }[]; className?: string }> = ({ items, className = '' }) => {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className={`divide-y divide-slate-100 dark:divide-[#2A3350] border-y border-slate-100 dark:border-[#2A3350] ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={`${base}-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base sm:text-lg font-bold text-ink dark:text-white">{item.q}</span>
                <svg
                  className={`w-5 h-5 shrink-0 text-brand transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </h3>
            <div
              id={`${base}-panel-${i}`}
              role="region"
              aria-labelledby={`${base}-btn-${i}`}
              hidden={!isOpen}
              className="pb-5 -mt-1"
            >
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Waitlist capture with explicit DPA consent. */
export const WaitlistForm: React.FC<{
  universities: { id: string; name: string; status: 'live' | 'soon' }[];
  onPrivacy?: () => void;
  tone?: 'default' | 'brand';
}> = ({ universities, onPrivacy, tone = 'default' }) => {
  const [done, setDone] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viaMailto, setViaMailto] = useState(false);
  const id = useId();
  const onBrand = tone === 'brand';

  if (done) {
    return (
      <div
        className={
          onBrand
            ? 'bg-white/10 border border-white/20 rounded-2xl p-6 text-center'
            : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 text-center'
        }
      >
        <TrustChip className={onBrand ? 'mb-3 bg-white/15 text-white' : 'mb-3'}>You’re on the list</TrustChip>
        <p className={onBrand ? 'text-sm text-white/80' : 'text-sm text-slate-600 dark:text-slate-300'}>
          {viaMailto
            ? 'If your email app opened, hit send — we’ll reply when your campus is ready. Otherwise email hello@varsitysoko.co.ke.'
            : 'Thanks! We’ll email you when VarsitySoko reaches your campus.'}
        </p>
      </div>
    );
  }

  const privacyClass = onBrand
    ? 'text-white underline underline-offset-2'
    : 'text-brand dark:text-brand-light underline underline-offset-2';

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const data = new FormData(form);
        const email = String(data.get('email') || '').trim();
        const campus = String(data.get('campus') || '').trim();
        if (!email || !campus || !consent) return;
        setSubmitting(true);
        const result = await submitLead({
          kind: 'waitlist',
          email,
          campus,
          consent: true,
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
      <div className="flex flex-col md:flex-row gap-3">
        <label className="sr-only" htmlFor={`${id}-email`}>
          Email address
        </label>
        <Input id={`${id}-email`} name="email" type="email" required placeholder="you@student.ac.ke" aria-label="Email address" />
        <label className="sr-only" htmlFor={`${id}-campus`}>
          Your campus
        </label>
        <Select id={`${id}-campus`} name="campus" required defaultValue="" aria-label="Your campus" className="md:max-w-[220px]">
          <option value="" disabled>
            Your campus
          </option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
          <option value="other">Other / not listed</option>
        </Select>
        <Button type="submit" variant={onBrand ? 'inverted' : 'primary'} disabled={!consent || submitting} className="shrink-0">
          {submitting ? 'Sending…' : 'Join the waitlist'}
        </Button>
      </div>
      {error && <p className={`text-xs ${onBrand ? 'text-red-200' : 'text-red-600 dark:text-red-400'}`}>{error}</p>}
      <label
        className={`flex items-start gap-2.5 text-xs cursor-pointer ${
          onBrand ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-brand w-4 h-4"
        />
        <span>
          I agree to VarsitySoko storing my email and campus to notify me about launch, in line with the{' '}
          {onPrivacy ? (
            <button type="button" onClick={onPrivacy} className={privacyClass}>
              Privacy Policy
            </button>
          ) : (
            <a href="/privacy" className={privacyClass}>
              Privacy Policy
            </a>
          )}{' '}
          (Kenya Data Protection Act, 2019).
        </span>
      </label>
    </form>
  );
};

export const AnimatedPathCard: React.FC<{
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}> = ({ title, description, cta, icon, onClick, color = '#5A24D5' }) => (
  <button
    onClick={onClick}
    className="group h-full text-left cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#1A1F2E] border border-slate-100 dark:border-[#2A3350] shadow-card hover:shadow-lift transition-all duration-300 hover:-translate-y-1 w-full"
  >
    <div className="p-8 flex flex-col items-start h-full">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-ink dark:text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-sm">{description}</p>
      <span className="mt-auto inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all" style={{ color }}>
        {cta}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </div>
  </button>
);

const ICONS: Record<string, React.ReactNode> = {
  shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  location: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
  chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  handshake: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l3-3 3 3 2-2m-9 6l4 4 8-8-4-4-3 3M3 12l3 3" />,
  gift: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14v11a1 1 0 01-1 1H6a1 1 0 01-1-1V8zM3 8h18v3H3V8zm9 0V5m0 3s-2-3-4-3-2 3 4 3zm0 0s2-3 4-3 2 3-4 3zm0 0v12" />,
  store: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l1-4h16l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16M9 20v-6h6v6" />,
  spark: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
  sparkle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  flag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6l1 2h5a1 1 0 011 1v8a1 1 0 01-1 1h-6l-1-2H5a2 2 0 00-2 2z" />,
  star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.06 10.8c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
  payment: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
};

export const FeatureIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = '' }) => (
  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light ${className}`}>
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      {ICONS[icon] ?? ICONS.sparkle}
    </svg>
  </div>
);
