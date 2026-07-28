
// ---------------------------------------------------------------------------
// VarsitySoko marketing content.
// Source of truth for copy. Kept honest — no fabricated metrics, testimonials,
// or “live on campus” claims until a campus actually launches.
// ---------------------------------------------------------------------------

export const BRAND = {
  name: 'VarsitySoko',
  tagline: 'Connect. Shop. Grow.',
  supportEmail: 'hello@varsitysoko.co.ke',
  studentEmailHint: '@*.ac.ke',
  /** Canonical site origin for OG tags and absolute asset URLs. */
  siteUrl: 'https://varsitysoko.co.ke',
  /**
   * Only list profiles that exist. Empty = no social row in the footer
   * (better than dead # links).
   */
  social: [] as { label: string; href: string }[],
} as const;

/** Campus rollout. Flip `status` to `'live'` only when that campus actually launches. */
export const UNIVERSITIES = [
  { id: 'jkuat', name: 'JKUAT', location: 'Juja', status: 'soon' as const },
  { id: 'uon', name: 'University of Nairobi', location: 'Main Campus', status: 'soon' as const },
  { id: 'ku', name: 'Kenyatta University', location: 'Main Campus', status: 'soon' as const },
  { id: 'strath', name: 'Strathmore University', location: 'Madaraka', status: 'soon' as const },
  { id: 'mku', name: 'Mount Kenya University', location: 'Thika', status: 'soon' as const },
  { id: 'moi', name: 'Moi University', location: 'Eldoret', status: 'soon' as const },
  { id: 'egerton', name: 'Egerton University', location: 'Njoro', status: 'soon' as const },
  { id: 'maseno', name: 'Maseno University', location: 'Maseno', status: 'soon' as const },
];

/**
 * Footage for the cinematic brand intro.
 *
 * PLACEHOLDER — these files are a procedurally generated brand backdrop, not
 * campus footage. Replace all three with the real clip (students trading on
 * campus) and delete the placeholder files. Requirements: silent, seamlessly
 * loopable, 6–10s, 1280x720 or larger, landscape. It plays muted and
 * autoplaying, and is cropped to fill the viewport, so keep the subject
 * centred. If the video fails to load the intro falls back to an animated
 * brand backdrop on its own.
 */
export const INTRO_MEDIA: {
  videoSrc?: string;
  videoWebmSrc?: string;
  posterSrc?: string;
} = {
  videoSrc: '/videos/campus-hero.mp4',
  posterSrc: '/videos/campus-hero-placeholder.webp',
};

export const COLORS = {
  purple: '#5A24D5',
  purpleDark: '#3D12A8',
  purpleLight: '#8B5CF6',
  navy: '#2A1570',
  accent: '#FFD60A',
  gold: '#D9A521',
  green: '#16A34A',
  mpesa: '#43B02A',
  ink: '#101828',
  white: '#FFFFFF',
  cream: '#FAFAF9',
};

// Core app features. Honest to the product: the app never processes buyer↔seller
// money (no escrow) — trades are settled in person. M-Pesa is for promotions only.
export const APP_FEATURES = [
  {
    title: 'Verified students only',
    description: 'Everyone proves they study at your university before they can buy or sell. No strangers, no scammers.',
    icon: 'shield',
  },
  {
    title: 'Safe meetups on campus',
    description: 'Arrange to meet at designated safe zones on your campus. Familiar ground, in daylight, near people.',
    icon: 'location',
  },
  {
    title: 'Chat & make offers',
    description: 'Message sellers, negotiate a price, and agree a meetup — all in the app, in real time.',
    icon: 'chat',
  },
  {
    title: 'Pay in person, your way',
    description: 'Settle face-to-face at the meetup with cash or M-Pesa once you have the item in hand. Simple and safe.',
    icon: 'handshake',
  },
  {
    title: 'Earn rewards',
    description: 'Collect points as you trade and redeem them for perks and vouchers on campus.',
    icon: 'gift',
  },
  {
    title: 'Campus Stores',
    description: 'Student entrepreneurs open a verified shopfront, build a brand, and grow a real campus business.',
    icon: 'store',
  },
];

export const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Verify you’re a student',
    desc: 'Sign up and confirm your campus with your university email — or upload your student ID for review.',
    accent: '#5A24D5',
  },
  {
    number: '02',
    title: 'Browse & make an offer',
    desc: 'Find what students near you are selling, chat with the seller, and agree on a price.',
    accent: '#8B5CF6',
  },
  {
    number: '03',
    title: 'Meet safely on campus',
    desc: 'Pick a designated safe zone, meet in person, check the item, and pay hand-to-hand.',
    accent: '#16A34A',
  },
];

export const SAFETY_FEATURES = [
  {
    title: 'Student verification',
    description: 'Every account is tied to a real, verified student at a supported university — by campus email or a reviewed student ID.',
    icon: 'shield',
  },
  {
    title: 'Designated safe zones',
    description: 'Meetups are arranged at known, busy spots on your own campus — never off-campus, never with strangers.',
    icon: 'location',
  },
  {
    title: 'Report & block',
    description: 'One tap to report a listing or user, and block anyone you don’t want to hear from. Our team reviews every report.',
    icon: 'flag',
  },
  {
    title: 'Ratings & trust',
    description: 'Build a trusted campus reputation. Trades and feedback stay on the record so you always know who you’re meeting.',
    icon: 'star',
  },
];

export const STORE_FEATURES = [
  {
    title: 'Your own shopfront',
    description: 'A branded store page inside your campus — name, cover, and your whole catalogue in one place.',
    icon: 'store',
  },
  {
    title: 'Reach your campus',
    description: 'Get discovered by verified students at your university who are already looking to buy.',
    icon: 'location',
  },
  {
    title: 'Manage enquiries',
    description: 'Buyers message you directly. Keep every conversation and order in one organised inbox.',
    icon: 'chat',
  },
  {
    title: 'Promote your listings',
    description: 'Boost a listing to the top of the feed with a quick M-Pesa payment. That’s the only money that flows through the app.',
    icon: 'spark',
  },
];

/** Local Businesses (vendor) — near-campus shops, admin-onboarded. Distinct from Campus Stores. */
export const BUSINESS_FEATURES = [
  {
    title: 'Found by students on campus',
    description: 'You show up under Local Businesses — next to the shops students already look for near campus.',
    icon: 'location',
  },
  {
    title: 'Your menu in the app',
    description: 'Name, hours, a short note, and menu items with price and photo. Mark what’s out of stock.',
    icon: 'store',
  },
  {
    title: 'Call and WhatsApp',
    description: 'Students tap to call or message you. Ordering stays on your phone — we don’t take the order or the money.',
    icon: 'chat',
  },
  {
    title: 'Boost when you need it',
    description: 'Pay with M-Pesa to sit higher in discovery for 24 hours, or get featured for a week.',
    icon: 'spark',
  },
];

export const FAQ = [
  {
    q: 'Is VarsitySoko free?',
    a: 'Yes — when the app launches, downloading and trading with other students is free. The only optional cost is if a seller chooses to promote a listing, paid with M-Pesa.',
  },
  {
    q: 'Who can join?',
    a: 'Verified students at a supported university. We’re not live on any campus yet — join the waitlist and we’ll email you when yours opens.',
  },
  {
    q: 'How do I get verified?',
    a: 'Sign up and confirm your campus with your university email (a one-time code), or upload your student ID and admission letter for a quick manual review.',
  },
  {
    q: 'Is it safe?',
    a: 'Safety is the whole point. Only verified students can trade, meetups happen at designated safe zones on your own campus, and you can report or block anyone at any time.',
  },
  {
    q: 'Does it handle payments?',
    a: 'You pay the seller in person when you meet — cash or M-Pesa, once you have the item. The app never holds your money. M-Pesa in-app is only for optional listing promotions.',
  },
  {
    q: 'What can I sell?',
    a: 'Textbooks, electronics, furniture, fashion, tickets, services — the everyday things students buy and sell. Prohibited and unsafe items aren’t allowed.',
  },
  {
    q: 'Can a local business near campus join?',
    a: 'Yes. Nearby shops (not student sellers) can get a Local Business listing. Students see your menu and call or WhatsApp you. We don’t take the order or payment — email us to get set up.',
  },
];
