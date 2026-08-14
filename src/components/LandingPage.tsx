import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PlayCircle, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  Sparkles,
  DollarSign,
  ChevronDown,
  Lock,
  Smartphone,
  Check
} from 'lucide-react';
import { LIVE_RECENT_PAYOUTS, FAQS_LIST } from '../data/adInventory';
import { formatNaira } from '../utils/timeUtils';

interface LandingPageProps {
  onOpenSignUp: () => void;
  onOpenLogIn: () => void;
  onOpenHelpdesk: () => void;
  onOpenAbout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSignUp,
  onOpenLogIn,
  onOpenHelpdesk,
  onOpenAbout
}) => {
  const [calcDays, setCalcDays] = useState(7);
  const [calcReferrals, setCalcReferrals] = useState(4);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const calculatedAdEarnings = calcDays * 500;
  const calculatedReferralEarnings = calcReferrals * 50;
  const totalCalculated = calculatedAdEarnings + calculatedReferralEarnings;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Neon Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-500/10">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Nigeria's #1 Automated Web Ad Earning Ecosystem</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 font-normal">Updated August 2026</span>
            </div>

            {/* Bold Macro Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Space_Grotesk'] leading-[1.1]">
              Get Paid to Watch Web Ads Daily —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]">
                Earn ₦500 Every Single Day!
              </span>
            </h1>

            {/* Prominent Sub-headline */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
              No registration fee. Work from your phone. Cash out{' '}
              <span className="text-emerald-400 font-bold underline decoration-emerald-500/50 decoration-2 underline-offset-4">
                ₦3,500 straight to your bank account
              </span>{' '}
              every single Friday automatically!
            </p>

            {/* CTA Grid */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={onOpenSignUp}
                id="btn-hero-claim-500"
                className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>Get Started & Claim Your First ₦500 Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Activation Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant EmailJS OTP Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All Nigerian Banks & Fintechs Supported</span>
              </div>
            </div>

          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₦500.00</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Daily Ad Earning Cap</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">₦3,500.00</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Friday Minimum Payout</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">34 Ads</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Daily Streaming Allowance</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">+₦50.00</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Per Direct Referral</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION 2: HOW IT WORKS GRID */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs sm:text-sm uppercase tracking-widest text-emerald-400 font-bold font-mono">
              Simple 3-Step Earning Engine
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              How NairaStream Puts Money in Your Pocket
            </p>
            <p className="text-slate-400 text-base">
              No technical expertise needed. Just stream sponsored brand ads daily from your mobile phone or laptop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all group backdrop-blur-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 font-mono shadow-md">
                01
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Register Free & Verify Email</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Sign up in under 60 seconds with your basic details. Receive a secure 6-digit OTP code dispatched straight to your inbox via our real-time EmailJS service.
              </p>
              <div className="inline-flex items-center text-xs font-semibold text-emerald-400 gap-1">
                <Check className="w-3.5 h-3.5" /> 100% Free • No Card Required
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all group backdrop-blur-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 font-mono shadow-md">
                02
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <PlayCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Stream 34 Daily Ads & Earn ₦500</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Watch 30-second sponsored web ads in our stacked overlay viewer. Complete the simple 20-second presence click to instantly credit ₦14.71 per ad directly into Wallet A.
              </p>
              <div className="inline-flex items-center text-xs font-semibold text-emerald-400 gap-1">
                <Check className="w-3.5 h-3.5" /> ₦500.00 Daily Guaranteed Cap
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all group backdrop-blur-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 font-mono shadow-md">
                03
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Withdraw ₦3,500 Every Friday</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Link any Nigerian bank account (OPay, PalmPay, Kuda, GTBank, Zenith, Access). The withdrawal vault opens automatically every Friday afternoon for seamless bank transfers.
              </p>
              <div className="inline-flex items-center text-xs font-semibold text-emerald-400 gap-1">
                <Check className="w-3.5 h-3.5" /> Automated Bank Transfers
              </div>
            </div>

          </div>

          {/* How it works CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={onOpenSignUp}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 hover:border-emerald-500/40 transition-all shadow-md"
            >
              <span>Join Thousands of Active Nigerian Earners</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE EARNINGS SIMULATOR */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                Interactive ROI Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
                Calculate Your Projected Weekly & Monthly Take-Home
              </h2>
              <p className="text-slate-400 text-sm mb-8">
                See how much you can cash out every Friday based on your daily streaming consistency and affiliate referrals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Controls */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Days Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-300">Days Active per Week:</span>
                    <span className="text-emerald-400 font-bold font-mono">{calcDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={calcDays}
                    onChange={(e) => setCalcDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>1 Day (₦500)</span>
                    <span>4 Days (₦2,000)</span>
                    <span>7 Days (₦3,500)</span>
                  </div>
                </div>

                {/* Referrals Slider */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-300">Active Friends Referred:</span>
                    <span className="text-teal-400 font-bold font-mono">{calcReferrals} Affiliates</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={calcReferrals}
                    onChange={(e) => setCalcReferrals(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>0 Friends (₦0)</span>
                    <span>10 Friends (₦500)</span>
                    <span>30 Friends (₦1,500)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Ad Stream Income ({calcDays} days × ₦500):</span>
                    <span className="font-mono text-white font-semibold">{formatNaira(calculatedAdEarnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Vault Bonus ({calcReferrals} × ₦50):</span>
                    <span className="font-mono text-white font-semibold">{formatNaira(calculatedReferralEarnings)}</span>
                  </div>
                </div>

              </div>

              {/* Result Card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-inner text-center space-y-4">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Estimated Weekly Payout
                </div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                  {formatNaira(totalCalculated)}
                </div>
                <div className="text-xs text-slate-400">
                  Monthly Projected: <span className="text-emerald-400 font-bold font-mono">{formatNaira(totalCalculated * 4)}</span>
                </div>
                <button
                  onClick={onOpenSignUp}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  Claim This Payout Now
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. LIVE NIGERIAN BANK PAYOUT TICKER */}
      <section className="py-14 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Live Payout Stream
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Recent Disbursements to Nigerian Bank Accounts
              </h3>
            </div>
            <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Verified via Paystack NUBAN Transfers
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LIVE_RECENT_PAYOUTS.slice(0, 4).map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.bank}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400 font-mono">{item.amount}</div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1">
                    <Check className="w-2.5 h-2.5" /> Paid
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. DUAL-WALLET ARCHITECTURE EXPLANATION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">
              Transparent Accounting
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Dual-Wallet Ledger Isolation
            </p>
            <p className="text-slate-400 text-sm sm:text-base">
              NairaStream guarantees zero confusion by keeping your ad-streaming income strictly separated from your affiliate commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Wallet A Card */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-emerald-500/30 relative overflow-hidden backdrop-blur-sm hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  WALLET A
                </span>
                <span className="text-xs text-slate-400">Task Earning Vault</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Available Earning Balance</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Accumulates your ₦14.71 earnings per watched web ad. Stream 34 daily tasks to lock in your ₦500.00 daily allowance.
              </p>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Daily Cap:</span>
                  <span className="text-emerald-400 font-mono font-bold">₦500.00 / day</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Friday Min Payout:</span>
                  <span className="text-white font-mono font-bold">₦3,500.00</span>
                </div>
              </div>
            </div>

            {/* Wallet B Card */}
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-teal-500/30 relative overflow-hidden backdrop-blur-sm hover:border-teal-500/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-bold font-mono">
                  WALLET B
                </span>
                <span className="text-xs text-slate-400">Referral Vault</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Referral Wallet Balance</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Accumulates ₦50.00 instant rewards every time someone signs up with your unique affiliate referral link.
              </p>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Reward per Invite:</span>
                  <span className="text-teal-300 font-mono font-bold">+₦50.00 instant</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Dedicated Cashout:</span>
                  <span className="text-white font-mono font-bold">Independent Vault</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 font-mono">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1 font-['Space_Grotesk']">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS_LIST.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/30 shadow-2xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Space_Grotesk']">
              Ready to Start Earning ₦500 Daily?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Join over 24,000+ active Nigerian streamers who cash out their earnings straight to their bank accounts every Friday afternoon.
            </p>
            <div>
              <button
                onClick={onOpenSignUp}
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-lg shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                Create Your Free Account Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-extrabold text-white text-lg font-['Space_Grotesk']">
                NAIRA<span className="text-emerald-400">STREAM</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
              <button onClick={onOpenAbout} className="hover:text-emerald-400 transition-colors">
                About Us
              </button>
              <button onClick={onOpenHelpdesk} className="hover:text-emerald-400 transition-colors">
                Contact Helpdesk
              </button>
              <a 
                href="https://t.me/nairastreams" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-sky-400 transition-colors"
              >
                Official Telegram Channel
              </a>
              <button onClick={onOpenLogIn} className="hover:text-emerald-400 transition-colors">
                Member Login
              </button>
            </div>

            <div className="text-xs text-slate-500">
              © 2026 NairaStream Technologies NG. All Rights Reserved.
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
};
