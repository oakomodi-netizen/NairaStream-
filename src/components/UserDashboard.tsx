import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  PlayCircle, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  RefreshCw,
  TrendingUp,
  Award,
  ChevronRight,
  Send,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { User, NigerianTimeData, WithdrawalRequest, BankDetails } from '../types';
import { getNigerianTimeData, formatNaira } from '../utils/timeUtils';
import { StorageService } from '../services/storageService';
import { AD_CAMPAIGNS, NIGERIAN_BANKS_LIST } from '../data/adInventory';

interface UserDashboardProps {
  user: User;
  onUpdateUser: (updated: User) => void;
  onOpenAdStream: (adTask: any) => void;
  isFridayOverride: boolean;
  onToggleFridayOverride: () => void;
  onOpenHelpdesk: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUpdateUser,
  onOpenAdStream,
  isFridayOverride,
  onToggleFridayOverride,
  onOpenHelpdesk
}) => {
  // Real-time Nigerian clock & greeting
  const [timeData, setTimeData] = useState<NigerianTimeData>(() => getNigerianTimeData(isFridayOverride));
  const [activeTab, setActiveTab] = useState<'overview' | 'stream' | 'affiliate' | 'withdraw' | 'history'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Bank Form State
  const [isEditingBank, setIsEditingBank] = useState(!user.bankDetails);
  const [bankCode, setBankCode] = useState(user.bankDetails?.bankCode || '058');
  const [accountNumber, setAccountNumber] = useState(user.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState(user.bankDetails?.accountName || '');
  const [bankSaveSuccess, setBankSaveSuccess] = useState(false);

  // Withdrawal Modal / Flow State
  const [withdrawalWalletType, setWithdrawalWalletType] = useState<'earning' | 'referral'>('earning');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('3500');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  // Withdrawals history
  const [userWithdrawals, setUserWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(getNigerianTimeData(isFridayOverride));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFridayOverride]);

  useEffect(() => {
    loadWithdrawalHistory();
  }, [user.id]);

  const loadWithdrawalHistory = () => {
    const all = StorageService.getAllWithdrawals();
    const userOnly = all.filter((w) => w.userId === user.id);
    setUserWithdrawals(userOnly);
  };

  const userFirstName = user.fullName.split(' ')[0] || 'Member';
  const referralLink = `${window.location.origin}/?ref=${user.referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSimulateReferralSignup = () => {
    // Add 1 test referral to user's profile
    const refBonus = 50.0;
    const updated: User = {
      ...user,
      walletB_balance: user.walletB_balance + refBonus,
      referralsCount: user.referralsCount + 1,
      lifetimeEarnings: user.lifetimeEarnings + refBonus
    };
    StorageService.updateUser(updated);
    onUpdateUser(updated);
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length < 10) {
      alert('Please enter a valid 10-digit NUBAN account number.');
      return;
    }
    const selectedBank = NIGERIAN_BANKS_LIST.find((b) => b.code === bankCode);
    const bankDetails: BankDetails = {
      bankCode,
      bankName: selectedBank?.name || 'Commercial Bank',
      accountNumber,
      accountName: accountName.toUpperCase() || user.fullName.toUpperCase(),
      isVerified: true
    };
    const updated = StorageService.saveBankDetails(user.id, bankDetails);
    onUpdateUser(updated);
    setIsEditingBank(false);
    setBankSaveSuccess(true);
    setTimeout(() => setBankSaveSuccess(false), 3000);
  };

  const handleStartAdStream = () => {
    const nextAdIndex = user.adsCompletedToday % AD_CAMPAIGNS.length;
    const nextAd = AD_CAMPAIGNS[nextAdIndex];
    onOpenAdStream(nextAd);
  };

  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError('Please enter a valid payout amount.');
      return;
    }

    // 1. Check Friday Lock
    if (!timeData.isFriday) {
      setWithdrawError(
        'Disbursements are processed automatically every Friday afternoon. The withdrawal window opens strictly on Fridays.'
      );
      return;
    }

    // 2. Check 2-Referral Safety Gate
    if (user.referralsCount < 2) {
      setWithdrawError(
        `Affiliate Expansion Requirement Not Met: You need at least 2 referred members to unlock withdrawals (Currently: ${user.referralsCount}/2).`
      );
      return;
    }

    // 3. Check Weekly limit (max 10)
    if ((user.weeklyWithdrawalsCount || 0) >= 10) {
      setWithdrawError(
        'Weekly limit reached: You have submitted 10 withdrawal requests in the last 7-day period.'
      );
      return;
    }

    // 4. Check Wallet Balance & Min Amounts
    if (withdrawalWalletType === 'earning') {
      if (amountNum < 3500) {
        setWithdrawError('Minimum withdrawal for Earning Wallet A is ₦3,500.00.');
        return;
      }
      if (user.walletA_balance < amountNum) {
        setWithdrawError(`Insufficient balance in Wallet A (Available: ${formatNaira(user.walletA_balance)}).`);
        return;
      }
    } else {
      // Referral Wallet B
      if (amountNum < 100) {
        setWithdrawError('Minimum withdrawal for Referral Vault B is ₦100.00.');
        return;
      }
      if (user.walletB_balance < amountNum) {
        setWithdrawError(`Insufficient balance in Wallet B (Available: ${formatNaira(user.walletB_balance)}).`);
        return;
      }
    }

    // 5. Check Bank Details
    if (!user.bankDetails || !user.bankDetails.accountNumber) {
      setWithdrawError('Please link and verify your Nigerian Bank Account before requesting a payout.');
      return;
    }

    setIsSubmittingWithdrawal(true);

    try {
      const newReq = StorageService.requestWithdrawal(
        user.id,
        withdrawalWalletType,
        amountNum,
        user.bankDetails.bankName,
        user.bankDetails.accountNumber,
        user.bankDetails.accountName
      );

      // Refresh user from storage
      const refreshed = StorageService.getUserById(user.id);
      if (refreshed) onUpdateUser(refreshed);

      loadWithdrawalHistory();
      setIsSubmittingWithdrawal(false);
      setWithdrawSuccess(
        `Withdrawal request for ${formatNaira(amountNum)} submitted successfully! Reference: ${newReq.referenceCode}. Scheduled for Friday automatic Paystack transfer.`
      );
    } catch (err: any) {
      setIsSubmittingWithdrawal(false);
      setWithdrawError(err?.message || 'Failed to submit withdrawal request.');
    }
  };

  const adsRemaining = Math.max(0, 34 - user.adsCompletedToday);
  const adsProgressPct = Math.min(100, (user.adsCompletedToday / 34) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. POSITION 1 (ABSOLUTE TOP): PINNED LIVE NIGERIAN DATE & TIME + SHIFT GREETING */}
      <div className="bg-slate-900/90 border-b border-emerald-500/20 backdrop-blur-md sticky top-16 z-30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Automated Greeting + User Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base shadow-sm">
              {userFirstName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                  {timeData.greeting}, <span className="text-emerald-400 font-extrabold">{userFirstName}</span>!
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold font-mono">
                  VERIFIED EARNER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stream ads daily & withdraw earnings straight to your bank account every Friday.
              </p>
            </div>
          </div>

          {/* Pinned Nigerian Time String */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300">{timeData.formattedDateTime}</span>
            </div>

            {/* Friday Payout Badge */}
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 ${
              timeData.isFriday 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${timeData.isFriday ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
              <span>{timeData.isFriday ? 'FRIDAY CASHOUT OPEN' : 'FRIDAY CASHOUT LOCKED'}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stream'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Daily Ad Streamer ({user.adsCompletedToday}/34)</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'withdraw'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Friday Payout Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliate')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'affiliate'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Affiliate & Referrals (+₦50)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Payout History ({userWithdrawals.length})</span>
          </button>
        </div>

        {/* 2. DUAL-WALLET ARCHITECTURE DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Wallet A: Available Earning Balance */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-emerald-500/40 shadow-xl relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-emerald-400" />
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono">
                WALLET A • TASK REWARDS
              </span>
              <span className="text-xs text-slate-400">Ad Streams</span>
            </div>

            <div className="text-xs text-slate-400 uppercase font-semibold">Available Earning Balance</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1 mb-4">
              {formatNaira(user.walletA_balance)}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-slate-400">Min Friday Payout: ₦3,500</span>
              <button
                onClick={() => {
                  setWithdrawalWalletType('earning');
                  setActiveTab('withdraw');
                }}
                className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>Withdraw Earning</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Wallet B: Referral Wallet Balance */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-teal-500/40 shadow-xl relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-teal-400" />
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-bold font-mono">
                WALLET B • AFFILIATE VAULT
              </span>
              <span className="text-xs text-slate-400">₦50 per signup</span>
            </div>

            <div className="text-xs text-slate-400 uppercase font-semibold">Referral Wallet Balance</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono mt-1 mb-4">
              {formatNaira(user.walletB_balance)}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-slate-400">{user.referralsCount} Affiliates Connected</span>
              <button
                onClick={() => {
                  setWithdrawalWalletType('referral');
                  setActiveTab('withdraw');
                }}
                className="text-teal-300 hover:underline font-bold flex items-center gap-1"
              >
                <span>Referral Vault Cashout</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Summary / Lifetime Stats Card */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Lifetime Cumulative Earnings</div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">
                {formatNaira(user.lifetimeEarnings)}
              </div>
            </div>

            <div className="my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">2-Referral Gate Status:</span>
                <span className={`font-bold font-mono ${user.referralsCount >= 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {user.referralsCount >= 2 ? 'UNLOCKED (2+/2)' : `${user.referralsCount} / 2 (LOCKED)`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${Math.min(100, (user.referralsCount / 2) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Weekly Submissions:</span>
              <span className="font-mono font-bold text-white">{user.weeklyWithdrawalsCount || 0} / 10 limit</span>
            </div>
          </div>

        </div>

        {/* 3. TAB 1: OVERVIEW & STREAM ACTION */}
        {(activeTab === 'overview' || activeTab === 'stream') && (
          <div className="space-y-8">
            
            {/* Daily Ad Task Streamer Action Box */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-emerald-500/40 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>DAILY EARNING STREAM • ₦500.00 REWARD POOL</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                    Stream Sponsored Ads & Collect ₦14.71 per 30s Task
                  </h2>
                  <p className="text-sm text-slate-300">
                    Watch all 34 daily tasks to maximize your ₦500 daily earning allowance. Complete the 20s security presence click to verify your reward!
                  </p>
                </div>

                <div className="w-full lg:w-auto p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 shrink-0">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Today's Progress</div>
                    <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                      {user.adsCompletedToday} <span className="text-slate-500 text-lg">/ 34 Ads</span>
                    </div>
                    <div className="text-xs text-emerald-400 font-mono font-bold mt-1">
                      Earned: {formatNaira(user.adsCompletedToday * 14.71)} / ₦500.00
                    </div>
                  </div>

                  <div className="w-48 mx-auto h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${adsProgressPct}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={handleStartAdStream}
                    disabled={user.adsCompletedToday >= 34}
                    id="btn-watch-next-ad"
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {user.adsCompletedToday >= 34 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Daily Limit Reached (₦500 Claimed)</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 fill-slate-950 text-emerald-400" />
                        <span>Watch Next Ad (+₦14.71)</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Available Task Queue Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-emerald-400" />
                  <span>Featured Sponsored Ad Units in Queue</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {adsRemaining} Tasks Remaining Today
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AD_CAMPAIGNS.slice(0, 3).map((ad, idx) => (
                  <div 
                    key={ad.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                          +{formatNaira(ad.rewardNgn)}
                        </span>
                        <span className="text-slate-500 font-mono">30s Duration</span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {ad.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {ad.tagline}
                      </p>
                    </div>

                    <button
                      onClick={handleStartAdStream}
                      disabled={user.adsCompletedToday >= 34}
                      className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Stream Task</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. TAB 2: FRIDAY PAYOUT VAULT & BANK LINKING */}
        {activeTab === 'withdraw' && (
          <div className="space-y-8">
            
            {/* Friday Lock Controller Notification Banner */}
            <div className={`p-6 rounded-3xl border ${
              timeData.isFriday
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-900/80 border-amber-500/40 text-slate-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  timeData.isFriday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {timeData.isFriday ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {timeData.isFriday 
                        ? 'Friday Automatic Disbursement Window is Currently OPEN' 
                        : 'Friday Lock Controller Active'}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950">
                      {timeData.dayName}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Disbursements are processed automatically every Friday afternoon. The withdrawal window opens strictly on Fridays.
                  </p>
                  {!timeData.isFriday && (
                    <div className="pt-2">
                      <button
                        onClick={onToggleFridayOverride}
                        className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                      >
                        ⚙️ Toggle Test Friday Mode to Submit Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Safety Gate Indicator: The 2-Referral Withdrawal Rule */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-400 font-mono">
                    Mandatory Anti-Fraud Policy
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    The 2-Referral Safety Withdrawal Requirement
                  </h4>
                </div>
                <div className="text-xs text-slate-400">
                  Status:{' '}
                  <strong className={user.referralsCount >= 2 ? 'text-emerald-400' : 'text-amber-400'}>
                    {user.referralsCount >= 2 ? 'PASSED (Eligible)' : 'ACTION REQUIRED'}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Affiliate Expansion Progress:</span>
                  <span className="text-emerald-400 font-bold">{user.referralsCount} / 2 Referred</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      user.referralsCount >= 2 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, (user.referralsCount / 2) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Users are blocked from requesting ANY payout unless their lifetime ledger records a minimum of 2 successfully referred accounts.
                </p>
              </div>

              {user.referralsCount < 2 && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{copiedLink ? 'Copied Referral Link!' : 'Copy My Referral Link'}</span>
                  </button>

                  <button
                    onClick={handleSimulateReferralSignup}
                    className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-colors"
                  >
                    + Simulate 1 Test Referral Signup (Adds ₦50)
                  </button>
                </div>
              )}
            </div>

            {/* Linked Bank Account Section */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-bold text-white">Disbursement Bank Account (NUBAN)</h4>
                </div>
                {!isEditingBank && (
                  <button
                    onClick={() => setIsEditingBank(true)}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Edit Bank Info
                  </button>
                )}
              </div>

              {bankSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bank details saved & verified successfully!</span>
                </div>
              )}

              {isEditingBank ? (
                <form onSubmit={handleSaveBankDetails} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Select Nigerian Bank
                    </label>
                    <select
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {NIGERIAN_BANKS_LIST.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      10-Digit NUBAN Account Number
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="e.g. 0123456789"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Account Name (As registered in your bank)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BABATUNDE OBI"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white uppercase focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    >
                      Save & Verify Account
                    </button>
                    {user.bankDetails && (
                      <button
                        type="button"
                        onClick={() => setIsEditingBank(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-base font-bold text-white">{user.bankDetails?.accountName}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {user.bankDetails?.bankName} • {user.bankDetails?.accountNumber}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified for Paystack Transfers
                  </span>
                </div>
              )}
            </div>

            {/* Withdrawal Form Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-emerald-500/30 space-y-6 backdrop-blur-sm">
              <div>
                <h4 className="text-xl font-bold text-white">Process Friday Bank Cashout</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select which wallet to disburse and specify your cashout amount.
                </p>
              </div>

              {withdrawError && (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{withdrawError}</span>
                </div>
              )}

              {withdrawSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{withdrawSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProcessWithdrawal} className="space-y-5 max-w-lg">
                
                {/* Select Wallet */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                    Source Wallet Ledger
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawalWalletType('earning');
                        setWithdrawAmount('3500');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        withdrawalWalletType === 'earning'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Wallet A (Earnings)</div>
                      <div className="text-xs font-mono text-emerald-400 mt-0.5">
                        {formatNaira(user.walletA_balance)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Min: ₦3,500</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawalWalletType('referral');
                        setWithdrawAmount(user.walletB_balance.toString());
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        withdrawalWalletType === 'referral'
                          ? 'bg-teal-500/20 border-teal-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Wallet B (Referrals)</div>
                      <div className="text-xs font-mono text-teal-300 mt-0.5">
                        {formatNaira(user.walletB_balance)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Min: ₦100</div>
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Withdrawal Amount (₦ NGN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={withdrawalWalletType === 'earning' ? 3500 : 100}
                      step="50"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingWithdrawal}
                  id="btn-submit-friday-cashout"
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>
                    {isSubmittingWithdrawal 
                      ? 'Submitting Payout Request...' 
                      : `Submit Friday Bank Cashout (${formatNaira(parseFloat(withdrawAmount) || 0)})`}
                  </span>
                </button>

              </form>
            </div>

          </div>
        )}

        {/* 5. TAB 3: AFFILIATE & REFERRAL EXPANSION */}
        {activeTab === 'affiliate' && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-teal-500/40 shadow-2xl backdrop-blur-sm">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>EARN ₦50.00 PER VERIFIED SIGNUP</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                  NairaStream Affiliate Expansion Hub
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Share your personalized referral invitation link. Every time a friend registers and completes their free email verification, <strong>₦50.00</strong> is immediately credited to your <span className="text-teal-300 font-semibold">Wallet B (Referral Vault)</span>.
                </p>

                {/* Referral Link Box */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Your Unique Referral Link
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 font-mono select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyReferral}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleSimulateReferralSignup}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>Simulate Test Referral Signup (+₦50)</span>
                  </button>
                  
                  <span className="text-xs text-slate-400 font-mono">
                    Referral Code: <strong className="text-white">{user.referralCode}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Dedicated Referral Vault Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 backdrop-blur-sm">
                <div className="text-xs uppercase font-bold text-teal-400 font-mono">Total Referral Earnings</div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {formatNaira(user.walletB_balance)}
                </div>
                <p className="text-xs text-slate-400">
                  Ready to be withdrawn on Fridays straight into your linked bank account.
                </p>
                <button
                  onClick={() => {
                    setWithdrawalWalletType('referral');
                    setActiveTab('withdraw');
                  }}
                  className="w-full mt-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Cash Out Referral Vault
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 backdrop-blur-sm">
                <div className="text-xs uppercase font-bold text-slate-400 font-mono">Affiliate Network Size</div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {user.referralsCount} <span className="text-base text-slate-500 font-sans">Active Members</span>
                </div>
                <p className="text-xs text-slate-400">
                  {user.referralsCount >= 2 
                    ? '2-Referral safety minimum requirement satisfied.' 
                    : `Refer ${2 - user.referralsCount} more to unlock Friday bank withdrawals.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. TAB 4: WITHDRAWAL & TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Disbursement & Payout Records</h3>
                <p className="text-xs text-slate-400">
                  Track all your past and pending Friday bank transfers.
                </p>
              </div>
              <button
                onClick={loadWithdrawalHistory}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="Refresh Ledger"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {userWithdrawals.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <Clock className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Withdrawal Records Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Stream ads daily to reach ₦3,500 and submit your payout request on Friday!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Wallet</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Bank Details</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {userWithdrawals.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">
                          {req.referenceCode}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            req.walletType === 'earning' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                          }`}>
                            {req.walletType === 'earning' ? 'Wallet A' : 'Wallet B'}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                          {formatNaira(req.amount)}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white">{req.bankName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{req.accountNumber}</div>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {req.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Paid via Paystack
                            </span>
                          ) : req.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                              <Clock className="w-3 h-3" /> Pending Friday Queue
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 font-bold border border-red-500/30 text-[10px]">
                              Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
