export type UserRole = 'user' | 'admin';

export interface BankDetails {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  isAdmin: boolean;
  hasJoinedTelegram: boolean;
  walletA_balance: number; // Available Earning Balance (Ad streaming)
  walletB_balance: number; // Referral Wallet Balance (₦50 per referral)
  lifetimeEarnings: number;
  adsCompletedToday: number; // Max 34 daily (~₦500/day)
  lastAdDate: string; // YYYY-MM-DD
  referralsCount: number;
  referralCode: string;
  referredBy?: string;
  bankDetails?: BankDetails;
  createdAt: string;
  isLocked?: boolean;
  weeklyWithdrawalsCount?: number;
  lastWithdrawalWeek?: string;
}

export type WalletType = 'earning' | 'referral';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  walletType: WalletType;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt?: string;
  referenceCode: string;
  paystackTransferId?: string;
}

export interface AdTaskItem {
  id: string;
  title: string;
  advertiser: string;
  category: string;
  rewardNgn: number;
  durationSeconds: number;
  creativeUrl: string;
  adsterraTag: string;
  ctaText: string;
  tagline: string;
  badge: string;
}

export interface FinancialAuditStats {
  totalMembers: number;
  totalCumulativeBalances: number;
  totalFridayLiabilities: number;
  totalApprovedPaid: number;
  activeTasksToday: number;
}

export interface NigerianTimeData {
  timeString: string;
  dateString: string;
  greeting: string;
  isFriday: boolean;
  dayName: string;
  formattedDateTime: string;
}
