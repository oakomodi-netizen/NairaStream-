import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  Send, 
  LogIn, 
  UserPlus, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert,
  Clock,
  Wallet
} from 'lucide-react';
import { User, NigerianTimeData } from '../types';
import { getNigerianTimeData, formatNaira } from '../utils/timeUtils';

interface NavbarProps {
  currentUser: User | null;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenHelpdesk: () => void;
  onOpenAbout: () => void;
  isFridayOverride: boolean;
  onToggleFridayOverride: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRoute,
  onNavigate,
  onOpenAuth,
  onLogout,
  onOpenHelpdesk,
  onOpenAbout,
  isFridayOverride,
  onToggleFridayOverride
}) => {
  const [timeData, setTimeData] = useState<NigerianTimeData>(() => getNigerianTimeData(isFridayOverride));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(getNigerianTimeData(isFridayOverride));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFridayOverride]);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Top Micro Ticker */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border-b border-emerald-500/20 px-4 py-1 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE PAYOUT WINDOW
            </span>
            <span className="hidden sm:inline text-slate-400">
              Friday Disbursements Scheduled • ₦3,500 Min Payout
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              {timeData.timeString} WAT (Lagos)
            </span>
            <span className="text-slate-600">|</span>
            <button
              onClick={onToggleFridayOverride}
              className={`px-2 py-0.5 rounded text-[10px] font-sans transition-colors ${
                isFridayOverride 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Click to toggle Test Friday Mode for withdrawal testing"
            >
              {isFridayOverride ? '⚡ Test Friday Mode: ON' : '⚙️ Simulate Friday'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          id="nav-brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] group-hover:scale-105 transition-all">
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-lg text-white font-['Space_Grotesk']">
                NAIRA<span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">STREAM</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                Fintech
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
              Daily Ad Rewards & Bank Disbursements
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-emerald-400 ${currentRoute === 'home' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            Home
          </button>
          
          <button 
            onClick={onOpenAbout}
            className="transition-colors hover:text-emerald-400"
          >
            About Us
          </button>

          <button 
            onClick={onOpenHelpdesk}
            className="transition-colors hover:text-emerald-400 flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Contact Helpdesk
          </button>

          <a
            href="https://t.me/nairastreams"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            Telegram Channel
          </a>

          {currentUser?.isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                currentRoute === 'admin' 
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm shadow-red-500/20' 
                  : 'bg-slate-900 text-red-400 border-red-500/30 hover:bg-red-500/10'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* User / Auth CTAs */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Wallet preview chip */}
              <div 
                onClick={() => onNavigate('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Available</div>
                  <div className="text-xs font-bold text-white font-mono">
                    {formatNaira(currentUser.walletA_balance)}
                  </div>
                </div>
              </div>

              {/* Dashboard / User button */}
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentRoute === 'dashboard'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
                id="btn-nav-dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">My Dashboard</span>
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                id="btn-nav-login"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                Log In
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="relative group overflow-hidden flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-95"
                id="btn-nav-signup"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
