import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import LandingPage from './views/LandingPage';
import FeaturesPage from './views/FeaturesPage';
import SafetyPage from './views/SafetyPage';
import StoresPage from './views/StoresPage';
import BusinessPage from './views/BusinessPage';
import DownloadPage from './views/DownloadPage';
import AboutPage from './views/AboutPage';
import CampusPage from './views/CampusPage';
import LegalPage from './views/LegalPage';
import NotFoundPage from './views/NotFoundPage';
import { Button, BrandLockup } from './components/UI';
import { BRAND } from './constants';

export type ViewState =
  | 'landing'
  | 'features'
  | 'safety'
  | 'stores'
  | 'business'
  | 'download'
  | 'about'
  | 'campus'
  | 'privacy'
  | 'terms'
  | 'notfound';

const VIEW_TO_PATH: Record<ViewState, string> = {
  landing: '/',
  features: '/features',
  safety: '/safety',
  stores: '/stores',
  business: '/business',
  download: '/waitlist',
  about: '/about',
  campus: '/campus',
  privacy: '/privacy',
  terms: '/terms',
  notfound: '/404',
};

const PATH_TO_VIEW: Record<string, ViewState> = Object.fromEntries(
  Object.entries(VIEW_TO_PATH).map(([v, p]) => [p, v as ViewState])
) as Record<string, ViewState>;

const VIEW_TITLES: Record<ViewState, string> = {
  landing: 'VarsitySoko | Campus Marketplace for Kenyan Students',
  features: 'Features | VarsitySoko',
  safety: 'Safety | VarsitySoko',
  stores: 'For Campus Stores | VarsitySoko',
  business: 'For Local Businesses | VarsitySoko',
  download: 'Join the waitlist | VarsitySoko',
  about: 'About | VarsitySoko',
  campus: 'Bring VarsitySoko to your campus',
  privacy: 'Privacy Policy | VarsitySoko',
  terms: 'Terms of Service | VarsitySoko',
  notfound: 'Page not found | VarsitySoko',
};

function pathToView(pathname: string): ViewState {
  if (pathname === '/download') return 'download'; // legacy URL
  return PATH_TO_VIEW[pathname] ?? 'notfound';
}

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('vs-theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const SocialIcon: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand/50 transition-all"
  >
    {children}
  </a>
);

const ThemeToggle: React.FC<{ dark: boolean; onToggle: () => void; className?: string }> = ({ dark, onToggle, className = '' }) => (
  <button
    onClick={onToggle}
    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    className={`w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-brand hover:bg-brand/5 dark:text-slate-400 dark:hover:text-brand-light dark:hover:bg-white/5 transition-all ${className}`}
  >
    {dark ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )}
  </button>
);

const NAV_LINKS: { label: string; viewName: ViewState }[] = [
  { label: 'Features', viewName: 'features' },
  { label: 'Safety', viewName: 'safety' },
  { label: 'Campus', viewName: 'campus' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(() =>
    typeof window !== 'undefined' ? pathToView(window.location.pathname) : 'landing'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDark);
  /** Landing intro finished typing the lockup — navbar may fade in. */
  const [navReady, setNavReady] = useState(
    () => (typeof window !== 'undefined' ? pathToView(window.location.pathname) : 'landing') !== 'landing'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('vs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    document.title = VIEW_TITLES[view];
  }, [view]);

  useEffect(() => {
    const onPopState = () => setView(pathToView(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Leaving landing always restores the navbar; returning hides it until the intro is ready.
  useEffect(() => {
    if (view !== 'landing') {
      setNavReady(true);
      return;
    }
    setNavReady(false);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [view]);

  useLayoutEffect(() => {
    if (view !== 'landing') return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [view]);

  const navigateTo = useCallback((v: ViewState) => {
    const path = VIEW_TO_PATH[v];
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setView(v);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const handleLogoClick = () => navigateTo('landing');

  const showNav = view !== 'landing' || navReady;

  const NavItem: React.FC<{ label: string; viewName: ViewState }> = ({ label, viewName }) => (
    <button
      onClick={() => navigateTo(viewName)}
      className={`px-3 py-2 text-sm font-semibold transition-colors relative group ${
        view === viewName ? 'text-brand dark:text-brand-light' : 'text-slate-600 hover:text-ink dark:text-slate-300 dark:hover:text-white'
      }`}
    >
      {label}
      <span
        className={`absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand rounded-full transition-transform duration-300 origin-left ${
          view === viewName ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] dark:bg-[#0F1117] selection:bg-brand/20 transition-colors duration-300">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>

      {/* Brand rule — violet only (accent is a rare highlight, spec §4.2). */}
      <div
        className={`h-1 w-full bg-gradient-to-r from-brand-dark via-brand to-brand-light fixed top-0 left-0 z-[110] transition-opacity duration-500 ${
          showNav ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={!showNav}
      />

      {/* Navigation — fades in once the intro lockup + tagline have landed. */}
      <header
        className={`fixed top-1 left-0 right-0 z-[100] bg-white/70 dark:bg-[#0F1117]/80 backdrop-blur-xl border-b border-slate-100/60 dark:border-[#2A3350]/60 transition-opacity duration-500 ${
          showNav ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!showNav}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <BrandLockup onClick={handleLogoClick} />

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavItem key={l.viewName} {...l} />
            ))}
            <div className="w-px h-4 bg-slate-200 dark:bg-[#2A3350] mx-2" />
            <ThemeToggle dark={darkMode} onToggle={() => setDarkMode((d) => !d)} className="mr-1" />
            <Button onClick={() => navigateTo('download')} variant="primary" className="py-2.5 px-5">
              Join waitlist
            </Button>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle dark={darkMode} onToggle={() => setDarkMode((d) => !d)} />
            <button
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              tabIndex={showNav ? 0 : -1}
            >
              <div className="w-5 h-0.5 bg-ink dark:bg-white" />
              <div className="w-4 h-0.5 bg-ink dark:bg-white self-end" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[200] md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-[#1A1F2E] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 dark:border-[#2A3350]">
            <BrandLockup markClassName="w-7 h-7" onClick={() => navigateTo('landing')} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-grow px-6 py-6 flex flex-col gap-1" aria-label="Mobile">
            {[{ label: 'Home', viewName: 'landing' as ViewState }, ...NAV_LINKS, { label: 'Campus Stores', viewName: 'stores' as ViewState }, { label: 'For Business', viewName: 'business' as ViewState }, { label: 'About', viewName: 'about' as ViewState }].map((link) => (
              <button
                key={link.viewName}
                onClick={() => navigateTo(link.viewName)}
                className={`text-left px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                  view === link.viewName
                    ? 'bg-brand/5 text-brand dark:bg-brand/20 dark:text-brand-light'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="px-6 pb-8">
            <Button onClick={() => navigateTo('download')} variant="primary" fullWidth className="py-3.5">
              Join waitlist
            </Button>
          </div>
        </div>
      </div>

      {/* Main — landing stays flush so the intro can be full-bleed; other
          pages clear the fixed header with pt-16. */}
      <main id="main" className={`flex-grow ${view === 'landing' ? 'pt-0' : 'pt-16'}`}>
        {view === 'landing' && (
          <LandingPage onNavigate={navigateTo} onNavReadyChange={setNavReady} />
        )}
        {view === 'features' && <FeaturesPage onNavigate={navigateTo} />}
        {view === 'safety' && <SafetyPage onNavigate={navigateTo} />}
        {view === 'stores' && <StoresPage onNavigate={navigateTo} />}
        {view === 'business' && <BusinessPage onNavigate={navigateTo} />}
        {view === 'download' && <DownloadPage onNavigate={navigateTo} />}
        {view === 'about' && <AboutPage onNavigate={navigateTo} />}
        {view === 'campus' && <CampusPage onNavigate={navigateTo} />}
        {view === 'privacy' && <LegalPage kind="privacy" />}
        {view === 'terms' && <LegalPage kind="terms" />}
        {view === 'notfound' && <NotFoundPage onNavigate={navigateTo} />}
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy text-white pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:pr-6">
              <BrandLockup dark markClassName="w-7 h-7" className="mb-4" onClick={handleLogoClick} />
              <p className="text-brand-light font-semibold text-sm mb-2">{BRAND.tagline}</p>
              <p className="text-white/60 text-sm leading-relaxed">
                The verified campus marketplace for Kenyan university students. Coming soon — join the waitlist.
              </p>
            </div>

            <FooterCol title="Product" onNav={navigateTo} links={[
              { label: 'Features', v: 'features' },
              { label: 'Safety', v: 'safety' },
              { label: 'Campus Stores', v: 'stores' },
              { label: 'For Business', v: 'business' },
              { label: 'Join waitlist', v: 'download' },
            ]} />

            <FooterCol title="Company" onNav={navigateTo} links={[
              { label: 'About', v: 'about' },
              { label: 'Bring to your campus', v: 'campus' },
            ]} />

            <FooterCol title="Legal" onNav={navigateTo} links={[
              { label: 'Privacy Policy', v: 'privacy' },
              { label: 'Terms of Service', v: 'terms' },
            ]}>
              <li>
                <a href={`mailto:${BRAND.supportEmail}`} className="text-white/60 text-sm hover:text-white transition-colors">
                  {BRAND.supportEmail}
                </a>
              </li>
            </FooterCol>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white/50 text-xs leading-relaxed max-w-xl">
              <p>© {new Date().getFullYear()} VarsitySoko. All rights reserved.</p>
              <p className="mt-1">
                Operating under the Kenya Data Protection Act, 2019. ODPC registration in progress.
              </p>
            </div>
            {BRAND.social.length > 0 && (
              <div className="flex items-center gap-3">
                {BRAND.social.map((s) => (
                  <SocialIcon key={s.href} href={s.href} label={s.label}>
                    <span className="text-[10px] font-bold uppercase">{s.label.slice(0, 2)}</span>
                  </SocialIcon>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterCol: React.FC<{
  title: string;
  links: { label: string; v: ViewState }[];
  onNav: (v: ViewState) => void;
  children?: React.ReactNode;
}> = ({ title, links, onNav, children }) => (
  <div>
    <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.label}>
          <button onClick={() => onNav(l.v)} className="text-white/60 text-sm hover:text-white transition-colors">
            {l.label}
          </button>
        </li>
      ))}
      {children}
    </ul>
  </div>
);

export default App;
