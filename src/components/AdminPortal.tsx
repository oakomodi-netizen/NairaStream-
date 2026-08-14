import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Wallet, 
  CreditCard, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Clock, 
  ExternalLink, 
  Send, 
  Zap, 
  Sparkles,
  DollarSign,
  ArrowRight,
  TrendingDown,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';
import { User, WithdrawalRequest, FinancialAuditStats } from '../types';
import { StorageService, SUPER_ADMIN_ACCOUNT } from '../services/storageService';
import { formatNaira, getNigerianTimeData } from '../utils/timeUtils';

interface AdminPortalProps {
  currentUser: User | null;
  onNavigateHome: () => void;
  onSwitchUserSession?: (user: User) => void;
  isFridayOverride: boolean;
  onToggleFridayOverride: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onNavigateHome,
  onSwitchUserSession,
  isFridayOverride,
  onToggleFridayOverride
}) => {
  // Check admin authorization
  const isAdminAuthenticated = currentUser?.isAdmin && currentUser?.email.toLowerCase() === SUPER_ADMIN_ACCOUNT.email.toLowerCase();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [withdrawalsList, setWithdrawalsList] = useState<WithdrawalRequest[]>([]);
  const [auditStats, setAuditStats] = useState<FinancialAuditStats>({
    totalMembers: 0,
    totalCumulativeBalances: 0,
    totalFridayLiabilities: 0,
    totalApprovedPaid: 0,
    activeTasksToday: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActiveTasks, setFilterActiveTasks] = useState(false);
  const [overrideNotice, setOverrideNotice] = useState<string | null>(null);
  const [processingWithdrawalId, setProcessingWithdrawalId] = useState<string | null>(null);

  // Time & Lagos Context
  const [timeData, setTimeData] = useState(() => getNigerianTimeData(isFridayOverride));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(getNigerianTimeData(isFridayOverride));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFridayOverride]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  const loadData = () => {
    const users = StorageService.getAllUsers();
    const withdrawals = StorageService.getAllWithdrawals();
    const stats = StorageService.getFinancialAuditStats();

    setUsersList(users);
    setWithdrawalsList(withdrawals);
    setAuditStats(stats);
  };

  // Profile Override: "Reset Account Wallet & Liquidate Ledger to 0"
  // Completely wipes out both current Available Balance, Referral Balance, and Total Lifetime Accumulated metric fields to absolute zero (0) instantly.
  const handleLiquidateUserLedger = (targetUser: User) => {
    const confirmMessage = `WARNING: Are you sure you want to LIQUIDATE & RESET the entire financial ledger for "${targetUser.fullName}" (${targetUser.email}) to ₦0.00?\n\nThis will wipe:\n- Available Balance ➔ ₦0\n- Referral Balance ➔ ₦0\n- Lifetime Earnings ➔ ₦0`;
    
    if (window.confirm(confirmMessage)) {
      StorageService.resetUserLedger(targetUser.id);
      loadData();
      setOverrideNotice(`Ledger Liquidated: All wallet balances for ${targetUser.fullName} have been wiped to absolute ₦0.00.`);
      setTimeout(() => setOverrideNotice(null), 4000);
    }
  };

  // Approve & Pay via Paystack Transfer
  const handleApprovePaystack = (reqId: string) => {
    setProcessingWithdrawalId(reqId);
    setTimeout(() => {
      try {
        const approved = StorageService.approvePaystackTransfer(reqId);
        loadData();
        setProcessingWithdrawalId(null);
        setOverrideNotice(`Paystack Transfer Approved: ₦${approved.amount} sent. Transfer Reference: ${approved.paystackTransferId}`);
        setTimeout(() => setOverrideNotice(null), 5000);
      } catch (err: any) {
        setProcessingWithdrawalId(null);
        alert(err?.message || 'Error processing transfer');
      }
    }, 800);
  };

  // Route guard check UI
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-red-500/40 text-center space-y-4 text-slate-100 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Admin Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            The Super Admin Command Center (<code className="text-red-400 font-mono">/admin-portal</code>) is strictly reserved for the registered Super Admin (<code className="text-emerald-400 font-mono">excelakomodi@gmail.com</code>).
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateHome}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
            >
              Return to Member Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    
    const matchesTask = filterActiveTasks ? u.adsCompletedToday > 0 : true;
    return matchesSearch && matchesTask;
  });

  const pendingWithdrawals = withdrawalsList.filter((w) => w.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 selection:bg-red-500 selection:text-white">
      
      {/* Top Admin Sticky Banner */}
      <div className="sticky top-16 z-30 bg-slate-900/95 border-b border-red-500/30 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Super Admin Command Center
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold">
                  ROOT PRIVILEGES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Operator: <span className="text-emerald-400 font-semibold">{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{timeData.timeString} WAT</span>
            </div>

            <button
              onClick={onToggleFridayOverride}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                isFridayOverride 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isFridayOverride ? '⚡ Test Friday Mode: ACTIVE' : '⚙️ Toggle Test Friday'}
            </button>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh Real-time Audit"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
            >
              Exit to App
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Flash Override Notice */}
        {overrideNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{overrideNotice}</span>
          </div>
        )}

        {/* 1. CONTROL GRID B: FINANCIAL AUDIT LEDGERS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Control Grid B: Financial Audit Ledgers</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live System Balances</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Members */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
                <span>Total Members</span>
                <Users className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono mt-2">
                {auditStats.totalMembers}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                {auditStats.activeTasksToday} streamers active today
              </div>
            </div>

            {/* Total Cumulative Balances */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
                <span>Total Cumulative Balances</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
                {formatNaira(auditStats.totalCumulativeBalances)}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                Wallet A + Wallet B combined
              </div>
            </div>

            {/* Total Friday Outgoing Liabilities */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex flex-col justify-between backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
                <span>Friday Outgoing Liabilities</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-2">
                {formatNaira(auditStats.totalFridayLiabilities)}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-2 font-mono">
                {pendingWithdrawals.length} Pending payout transfers
              </div>
            </div>

            {/* Total Approved Paid */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30 flex flex-col justify-between backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
                <span>Disbursed via Paystack</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono mt-2">
                {formatNaira(auditStats.totalApprovedPaid)}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                Automated bank transfers completed
              </div>
            </div>

          </div>
        </div>

        {/* 2. CONTROL GRID C: LIVE WITHDRAWAL REQUEST QUEUE */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Control Grid C: Live Withdrawal Request Queue</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pending Friday payout requests awaiting Paystack NUBAN bank transfer trigger.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 w-fit">
              {pendingWithdrawals.length} Requests in Queue
            </span>
          </div>

          {pendingWithdrawals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">Withdrawal Queue Cleared</div>
              <div className="text-xs text-slate-400">No pending payouts awaiting approval.</div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Reference</th>
                    <th className="p-3.5">Member Name / Email</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Bank Name</th>
                    <th className="p-3.5">Account Number</th>
                    <th className="p-3.5">Account Name</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pendingWithdrawals.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-white">
                        {req.referenceCode}
                        <div className="text-[10px] text-slate-500 font-sans">
                          {req.walletType === 'earning' ? 'Wallet A (Ad Task)' : 'Wallet B (Affiliate)'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{req.userFullName}</div>
                        <div className="text-[11px] text-slate-400">{req.userEmail}</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">
                        {formatNaira(req.amount)}
                      </td>
                      <td className="p-3.5 text-slate-300 font-semibold">{req.bankName}</td>
                      <td className="p-3.5 font-mono font-bold text-white tracking-wider">
                        {req.accountNumber}
                      </td>
                      <td className="p-3.5 text-slate-300 uppercase">{req.accountName}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleApprovePaystack(req.id)}
                          disabled={processingWithdrawalId === req.id}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 ml-auto disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5 fill-slate-950" />
                          <span>
                            {processingWithdrawalId === req.id 
                              ? 'Dispatching...' 
                              : 'Approve & Pay via Paystack Transfer'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. CONTROL GRID A: FULL USER DIRECTORY */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 backdrop-blur-sm">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Control Grid A: Full User Directory & Ledger Controller</span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage all registered accounts, inspect balances, and execute administrative ledger resets.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
                />
              </div>

              <button
                onClick={() => setFilterActiveTasks(!filterActiveTasks)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  filterActiveTasks
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Active Tasks Only</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-4">User Profile</th>
                  <th className="p-4">Daily Task Status</th>
                  <th className="p-4">Available (Wallet A)</th>
                  <th className="p-4">Referral (Wallet B)</th>
                  <th className="p-4">Lifetime Earnings</th>
                  <th className="p-4">Affiliates</th>
                  <th className="p-4 text-right">Profile Override Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => {
                  const isTaskActive = u.adsCompletedToday > 0;
                  const isAdminUser = u.email.toLowerCase() === SUPER_ADMIN_ACCOUNT.email.toLowerCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isAdminUser && (
                                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] font-mono">
                                  SUPER ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{u.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* Daily Task Status: Active (Green) or Idle (Gray) */}
                      <td className="p-4">
                        {isTaskActive ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Active ({u.adsCompletedToday}/34)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-semibold font-mono">
                            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                            <span>Idle (0/34)</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        {formatNaira(u.walletA_balance)}
                      </td>

                      <td className="p-4 font-mono font-bold text-teal-300 text-sm">
                        {formatNaira(u.walletB_balance)}
                      </td>

                      <td className="p-4 font-mono font-bold text-white">
                        {formatNaira(u.lifetimeEarnings)}
                      </td>

                      <td className="p-4 font-mono text-slate-300">
                        {u.referralsCount} Ref
                      </td>

                      {/* PROFILE OVERRIDE BUTTON REQUIREMENT:
                          "Reset Account Wallet & Liquidate Ledger to 0" */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleLiquidateUserLedger(u)}
                          className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto active:scale-95"
                          title="Wipe Available Balance, Referral Balance, and Lifetime Earnings to absolute 0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Account Wallet & Liquidate Ledger to 0</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};
