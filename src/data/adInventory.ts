import { AdTaskItem } from '../types';

export const NIGERIAN_BANKS_LIST = [
  { code: '044', name: 'Access Bank' },
  { code: '058', name: 'GTBank (Guaranty Trust Bank)' },
  { code: '057', name: 'Zenith Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '999992', name: 'OPay Digital Services' },
  { code: '999991', name: 'PalmPay Limited' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '215', name: 'Unity Bank' },
  { code: '100004', name: 'Moniepoint Microfinance Bank' }
];

export const AD_CAMPAIGNS: AdTaskItem[] = [
  {
    id: 'ad_01_fintech',
    title: 'Trade & Swap Crypto at Zero Fees with Naira Instant Payout',
    advertiser: 'Roqqu / Adsterra Direct Smartlink',
    category: 'Fintech & Web3',
    rewardNgn: 14.71,
    durationSeconds: 30,
    creativeUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80',
    adsterraTag: 'ADSTERRA_SL_99812_DIRECT',
    ctaText: 'Visit Sponsor Portal',
    tagline: 'Deposit Naira instantly and swap over 100+ crypto assets securely.',
    badge: 'High Yield Sponsor'
  },
  {
    id: 'ad_02_ecommerce',
    title: 'Jumia Tech Super Sale — Up to 70% Off Smartphones & Gadgets',
    advertiser: 'Jumia Mega Express',
    category: 'E-Commerce & Tech',
    rewardNgn: 14.71,
    durationSeconds: 30,
    creativeUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    adsterraTag: 'ADSTERRA_BANNER_728x90_PREM',
    ctaText: 'Shop Mega Deals',
    tagline: 'Fast delivery across Lagos, Abuja, Port Harcourt & all 36 states.',
    badge: 'Exclusive Discount'
  },
  {
    id: 'ad_03_savings',
    title: 'Earn 18% Annual Interest on Naira Vault Savings with PiggyVest',
    advertiser: 'Piggyvest Finance Nigeria',
    category: 'Investments & Savings',
    rewardNgn: 14.71,
    durationSeconds: 30,
    creativeUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    adsterraTag: 'ADSTERRA_NATIVE_FEED_440',
    ctaText: 'Lock High Interest',
    tagline: 'Join 4.5 million Nigerians saving towards financial freedom.',
    badge: 'Verified Sponsor'
  },
  {
    id: 'ad_04_gaming',
    title: 'Bet9ja 100% Welcome Match Bonus on Sports & Live Virtuals',
    advertiser: 'Bet9ja Official Interactive',
    category: 'Sports & Entertainment',
    rewardNgn: 14.71,
    durationSeconds: 30,
    creativeUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    adsterraTag: 'ADSTERRA_POP_INTERSTITIAL_ISOLATED',
    ctaText: 'Claim ₦100,000 Bonus',
    tagline: 'Fastest payouts in Nigeria with 24/7 customer assistance.',
    badge: 'Trending Campaign'
  },
  {
    id: 'ad_05_elearning',
    title: 'Learn High-Income Tech Skills: Cloud, UI/UX & AI Prompting',
    advertiser: 'AltSchool Africa & Coursera Partner',
    category: 'Education & Tech Skills',
    rewardNgn: 14.71,
    durationSeconds: 30,
    creativeUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    adsterraTag: 'ADSTERRA_DIRECT_SL_882',
    ctaText: 'Apply For Scholarship',
    tagline: 'Get certified and land international remote contracts paying in USD.',
    badge: 'Sponsored Education'
  }
];

export const LIVE_RECENT_PAYOUTS = [
  { name: 'Emeka O.', bank: 'Access Bank', amount: '₦3,500.00', time: '12 mins ago' },
  { name: 'Chioma A.', bank: 'OPay', amount: '₦7,000.00', time: '18 mins ago' },
  { name: 'Ibrahim K.', bank: 'GTBank', amount: '₦3,500.00', time: '24 mins ago' },
  { name: 'Blessing E.', bank: 'Kuda Bank', amount: '₦4,200.00', time: '35 mins ago' },
  { name: 'Oluwaseun D.', bank: 'Zenith Bank', amount: '₦5,600.00', time: '41 mins ago' },
  { name: 'Fatima M.', bank: 'PalmPay', amount: '₦3,500.00', time: '52 mins ago' },
  { name: 'Chinedu N.', bank: 'UBA', amount: '₦8,400.00', time: '1 hr ago' }
];

export const FAQS_LIST = [
  {
    q: 'How much do I earn per day on NairaStream?',
    a: 'Every registered user can stream 34 daily web ads. Each completed ad credits your Available Earning Balance with ₦14.71, totaling ₦500.00 every single day.'
  },
  {
    q: 'When and how do I receive my bank withdrawals?',
    a: 'Withdrawal requests open strictly every Friday (based on Nigerian Local Time). Accumulated earnings of ₦3,500 or more are disbursed directly to your verified Nigerian bank account (Access, GTBank, Zenith, OPay, PalmPay, Kuda, etc.) via automated transfer.'
  },
  {
    q: 'What is the 2-Referral Safety Rule?',
    a: 'To maintain sustainable ad network traffic quality and prevent automated bots, users must refer a minimum of 2 verified members before submitting their first bank withdrawal. You also earn a ₦50 bonus in your Referral Wallet for each person who signs up with your link!'
  },
  {
    q: 'Are there any registration fees or hidden charges?',
    a: 'No! Registration on NairaStream is 100% free. You will never be asked to pay any activation fee to earn or withdraw your money.'
  },
  {
    q: 'How does the 20-second security verification work?',
    a: 'While watching an ad task, the 30-second countdown pauses at exactly 20 seconds with a neon alert box. You simply tap anywhere on the sponsored ad screen to verify your active presence, and the timer resumes down to 0.'
  }
];
