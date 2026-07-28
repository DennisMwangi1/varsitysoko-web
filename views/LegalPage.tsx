import React from 'react';
import { Eyebrow, BrandMark } from '../components/UI';
import { BRAND } from '../constants';

type Section = { h: string; p: string[] };

const PRIVACY: Section[] = [
  { h: 'Who we are', p: [
    `VarsitySoko is a campus marketplace for verified university students in Kenya. We are the data controller for the personal data described here and are registering with the Office of the Data Protection Commissioner (ODPC) under the Kenya Data Protection Act, 2019.`,
  ] },
  { h: 'What we collect', p: [
    `Account details: your name, university, campus, and email address.`,
    `Verification data: to confirm you are a student, we verify either a university email (via a one-time code) or, where needed, a student ID and admission letter. ID documents are treated as sensitive personal data.`,
    `Usage data: listings, messages, offers, and meetups you create in the app, plus basic device and log information needed to run the service securely.`,
  ] },
  { h: 'How we use it', p: [
    `To verify you are a student and keep the community safe; to operate the marketplace (listings, chat, offers, meetups, rewards); to process optional listing-promotion payments via M-Pesa; and to comply with legal obligations.`,
    `We do not sell your personal data.`,
  ] },
  { h: 'Payments', p: [
    `VarsitySoko never holds funds between buyers and sellers. Purchases are settled directly between students in person. The only payment we process is an optional M-Pesa charge when a seller chooses to promote a listing.`,
  ] },
  { h: 'How long we keep it', p: [
    `We keep account data while your account is active. Verification ID documents are retained only as long as necessary to confirm your student status and are then deleted in line with our retention schedule.`,
  ] },
  { h: 'Your rights', p: [
    `Under the Data Protection Act, 2019 you may access, correct, or delete your personal data, object to or restrict certain processing, and request a copy of your data. You can export or delete your data from within the app, or contact us any time.`,
  ] },
  { h: 'Contact', p: [
    `Questions or requests: ${BRAND.supportEmail}.`,
  ] },
];

const TERMS: Section[] = [
  { h: 'Agreement', p: [
    `By creating an account or using VarsitySoko, you agree to these terms. VarsitySoko is available to verified students of supported universities in Kenya.`,
  ] },
  { h: 'Eligibility & verification', p: [
    `You must be a genuine student at a supported university and complete verification before you buy or sell. You are responsible for keeping your account secure and for activity under it.`,
  ] },
  { h: 'Buying, selling & meetups', p: [
    `VarsitySoko is a venue that connects student buyers and sellers. We are not a party to any transaction. Trades are settled directly between users, in person, at a designated campus safe zone. You are responsible for inspecting items before you pay.`,
    `We do not provide escrow, shipping, or payment handling between buyers and sellers.`,
  ] },
  { h: 'Prohibited items & conduct', p: [
    `You may not list illegal, unsafe, counterfeit, or prohibited items, impersonate others, harass anyone, or misuse the platform. We may remove listings, and suspend or ban accounts, to protect the community.`,
  ] },
  { h: 'Promotions', p: [
    `Sellers may pay, via M-Pesa, to promote a listing. Promotion fees are for placement only and do not guarantee a sale.`,
  ] },
  { h: 'Liability', p: [
    `VarsitySoko is provided “as is.” To the extent permitted by law, we are not liable for disputes, losses, or damages arising from transactions between users. Always follow the safety guidance in the app.`,
  ] },
  { h: 'Changes & contact', p: [
    `We may update these terms and will note the effective date. Questions: ${BRAND.supportEmail}.`,
  ] },
];

const LegalPage: React.FC<{ kind: 'privacy' | 'terms' }> = ({ kind }) => {
  const isPrivacy = kind === 'privacy';
  const sections = isPrivacy ? PRIVACY : TERMS;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <Eyebrow className="mb-3">Legal</Eyebrow>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-ink dark:text-white tracking-tight heading">
        {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
      </h1>
      <p className="mt-3 text-sm text-slate-400">Last updated: July 2026</p>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-bold text-ink dark:text-white mb-3 tracking-tight">{s.h}</h2>
            <div className="space-y-3">
              {s.p.map((para, i) => (
                <p key={i} className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 flex items-start gap-3 rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/80 dark:bg-amber-900/10 p-5">
        <BrandMark className="w-8 h-8 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Working draft (July 2026). This reflects how VarsitySoko is designed to work under the Kenya Data
          Protection Act, 2019. We’ll update it as we complete ODPC registration and as counsel reviews the final
          wording. Questions: {BRAND.supportEmail}.
        </p>
      </div>
    </div>
  );
};

export default LegalPage;
