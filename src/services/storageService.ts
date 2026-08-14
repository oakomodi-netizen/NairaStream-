import { User, WithdrawalRequest, FinancialAuditStats, BankDetails } from '../types';

const USERS_KEY = 'nairastream_db_users';
const CURRENT_USER_KEY = 'nairastream_auth_user';
const PENDING_SIGNUP_KEY = 'nairastream_pending_signup';
const WITHDRAWALS_KEY = 'nairastream_db_withdrawals';
const FORCE_FRIDAY_KEY = 'nairastream_override_friday';

export interface PendingSignup {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  otpCode: string;
  createdAt: number;
}

// Initial Super Admin profile as required
export const SUPER_ADMIN_ACCOUNT: User = {
  id: 'usr_admin_excel',
  fullName: 'Excel Akomodi (Super Admin)',
  email: 'excelakomodi@gmail.com',
  phone: '+2348039876543',
  password: 'Vudhiroyals@14',
  role: 'admin',
  isAdmin: true,
  hasJoinedTelegram: true,
  walletA_balance: 145000.00,
  walletB_balance: 38200.00,
  lifetimeEarnings: 420000.00,
  adsCompletedToday: 34,
  lastAdDate: new Date().toISOString().split('T')[0],
  referralsCount: 42,
  referralCode: 'EXCELADMIN',
  bankDetails: {
    bankCode: '058',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountNumber: '0123456789',
    accountName: 'EXCEL AKOMODI',
    isVerified: true
  },
  createdAt: '2026-01-10T08:00:00.000Z',
  weeklyWithdrawalsCount: 0
};

// Initial Seed Users for realistic Fintech directory
const INITIAL_USERS: User[] = [
  SUPER_ADMIN_ACCOUNT,
  {
    id: 'usr_001_emeka',
    fullName: 'Emeka Chukwudi Obi',
    email: 'emeka.obi@gmail.com',
    phone: '+2348123456789',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    hasJoinedTelegram: true,
    walletA_balance: 3500.00,
    walletB_balance: 350.00,
    lifetimeEarnings: 14000.00,
    adsCompletedToday: 34,
    lastAdDate: new Date().toISOString().split('T')[0],
    referralsCount: 7,
    referralCode: 'EMEKA77',
    bankDetails: {
      bankCode: '044',
      bankName: 'Access Bank',
      accountNumber: '0712398412',
      accountName: 'EMEKA CHUKWUDI OBI',
      isVerified: true
    },
    createdAt: '2026-06-01T10:30:00.000Z',
    weeklyWithdrawalsCount: 1
  },
  {
    id: 'usr_002_chioma',
    fullName: 'Chioma Grace Adeleke',
    email: 'chioma.grace@yahoo.com',
    phone: '+2347098765432',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    hasJoinedTelegram: true,
    walletA_balance: 4200.00,
    walletB_balance: 600.00,
    lifetimeEarnings: 21500.00,
    adsCompletedToday: 28,
    lastAdDate: new Date().toISOString().split('T')[0],
    referralsCount: 12,
    referralCode: 'CHIOMA88',
    bankDetails: {
      bankCode: '999992',
      bankName: 'OPay Digital Services',
      accountNumber: '7098765432',
      accountName: 'CHIOMA GRACE ADELEKE',
      isVerified: true
    },
    createdAt: '2026-06-15T14:20:00.000Z',
    weeklyWithdrawalsCount: 2
  },
  {
    id: 'usr_003_tunde',
    fullName: 'Babatunde Fashola Adele',
    email: 'tunde.adele@outlook.com',
    phone: '+2349011223344',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    hasJoinedTelegram: false,
    walletA_balance: 1500.00,
    walletB_balance: 100.00,
    lifetimeEarnings: 3000.00,
    adsCompletedToday: 12,
    lastAdDate: new Date().toISOString().split('T')[0],
    referralsCount: 2,
    referralCode: 'TUNDE99',
    bankDetails: {
      bankCode: '999991',
      bankName: 'PalmPay Limited',
      accountNumber: '9011223344',
      accountName: 'BABATUNDE FASHOLA ADELE',
      isVerified: true
    },
    createdAt: '2026-07-01T09:15:00.000Z',
    weeklyWithdrawalsCount: 0
  },
  {
    id: 'usr_004_amina',
    fullName: 'Amina Zainab Ibrahim',
    email: 'amina.ibrahim@gmail.com',
    phone: '+2348055443322',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    hasJoinedTelegram: true,
    walletA_balance: 500.00,
    walletB_balance: 0.00,
    lifetimeEarnings: 500.00,
    adsCompletedToday: 0,
    lastAdDate: '',
    referralsCount: 0,
    referralCode: 'AMINA22',
    bankDetails: {
      bankCode: '057',
      bankName: 'Zenith Bank',
      accountNumber: '2109876543',
      accountName: 'AMINA ZAINAB IBRAHIM',
      isVerified: true
    },
    createdAt: '2026-08-01T11:00:00.000Z',
    weeklyWithdrawalsCount: 0
  }
];

// Initial Seed Withdrawals for Queue & Audit
const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wdr_req_101',
    userId: 'usr_001_emeka',
    userFullName: 'Emeka Chukwudi Obi',
    userEmail: 'emeka.obi@gmail.com',
    walletType: 'earning',
    amount: 3500.00,
    bankName: 'Access Bank',
    accountNumber: '0712398412',
    accountName: 'EMEKA CHUKWUDI OBI',
    status: 'pending',
    createdAt: '2026-08-14T02:30:00.000Z',
    referenceCode: 'NST-PAY-77821'
  },
  {
    id: 'wdr_req_102',
    userId: 'usr_002_chioma',
    userFullName: 'Chioma Grace Adeleke',
    userEmail: 'chioma.grace@yahoo.com',
    walletType: 'referral',
    amount: 600.00,
    bankName: 'OPay Digital Services',
    accountNumber: '7098765432',
    accountName: 'CHIOMA GRACE ADELEKE',
    status: 'pending',
    createdAt: '2026-08-14T02:45:00.000Z',
    referenceCode: 'NST-PAY-88942'
  },
  {
    id: 'wdr_req_100',
    userId: 'usr_001_emeka',
    userFullName: 'Emeka Chukwudi Obi',
    userEmail: 'emeka.obi@gmail.com',
    walletType: 'earning',
    amount: 3500.00,
    bankName: 'Access Bank',
    accountNumber: '0712398412',
    accountName: 'EMEKA CHUKWUDI OBI',
    status: 'approved',
    createdAt: '2026-08-07T12:00:00.000Z',
    processedAt: '2026-08-07T14:15:22.000Z',
    referenceCode: 'NST-PAY-66512',
    paystackTransferId: 'TRF_pstk_99182319a'
  }
];

export class StorageService {
  private static initDB(): void {
    if (typeof window === 'undefined') return;
    
    // Ensure Users DB exists
    const usersStr = localStorage.getItem(USERS_KEY);
    if (!usersStr) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    } else {
      // Ensure super admin exists with correct credentials
      try {
        const users: User[] = JSON.parse(usersStr);
        const adminIndex = users.findIndex(u => u.email.toLowerCase() === SUPER_ADMIN_ACCOUNT.email.toLowerCase());
        if (adminIndex === -1) {
          users.unshift(SUPER_ADMIN_ACCOUNT);
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } else {
          // Keep admin password & privileges updated
          users[adminIndex].password = SUPER_ADMIN_ACCOUNT.password;
          users[adminIndex].role = 'admin';
          users[adminIndex].isAdmin = true;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      } catch (e) {
        localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      }
    }

    // Ensure Withdrawals DB exists
    if (!localStorage.getItem(WITHDRAWALS_KEY)) {
      localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(INITIAL_WITHDRAWALS));
    }
  }

  // Get all users
  static getAllUsers(): User[] {
    this.initDB();
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  // Save all users
  static saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Get current logged-in user
  static getCurrentUser(): User | null {
    this.initDB();
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (!data) return null;
      const parsed: User = JSON.parse(data);
      // Fetch latest from DB to ensure sync
      const freshUser = this.getUserById(parsed.id);
      return freshUser || parsed;
    } catch {
      return null;
    }
  }

  // Set current logged-in user
  static setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      // Also update in all users list
      this.updateUser(user);
    }
  }

  // Get user by id
  static getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  // Get user by email
  static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  // Update a single user in database
  static updateUser(updatedUser: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
      
      // Update session if it's the active user
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          if (parsed.id === updatedUser.id) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
          }
        } catch {}
      }
    }
  }

  // Create new user (after OTP verification)
  static createUser(user: User): User {
    const users = this.getAllUsers();
    users.push(user);
    this.saveUsers(users);
    
    // Check if referred by someone
    if (user.referredBy) {
      const referrer = users.find(u => u.referralCode.toUpperCase() === user.referredBy?.toUpperCase());
      if (referrer) {
        referrer.walletB_balance += 50.00;
        referrer.referralsCount += 1;
        referrer.lifetimeEarnings += 50.00;
        this.updateUser(referrer);
      }
    }

    this.setCurrentUser(user);
    return user;
  }

  // Pending Signup State Management (Fixes Mobile Refresh Bug)
  static setPendingSignup(data: PendingSignup): void {
    localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(data));
  }

  static getPendingSignup(): PendingSignup | null {
    try {
      const data = localStorage.getItem(PENDING_SIGNUP_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static clearPendingSignup(): void {
    localStorage.removeItem(PENDING_SIGNUP_KEY);
  }

  // Complete one ad watch task
  static completeAdTask(userId: string): { success: boolean; reward: number; totalCompleted: number; user: User } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const todayStr = new Date().toISOString().split('T')[0];
    if (user.lastAdDate !== todayStr) {
      user.adsCompletedToday = 0;
      user.lastAdDate = todayStr;
    }

    if (user.adsCompletedToday >= 34) {
      return {
        success: false,
        reward: 0,
        totalCompleted: 34,
        user
      };
    }

    const reward = 14.71; // 34 * 14.71 = ~500.14
    user.adsCompletedToday += 1;
    user.walletA_balance += reward;
    user.lifetimeEarnings += reward;
    this.updateUser(user);

    return {
      success: true,
      reward,
      totalCompleted: user.adsCompletedToday,
      user
    };
  }

  // Mark telegram channel as joined
  static markTelegramJoined(userId: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.hasJoinedTelegram = true;
    this.updateUser(user);
    return user;
  }

  // Update bank details
  static saveBankDetails(userId: string, bank: BankDetails): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.bankDetails = bank;
    this.updateUser(user);
    return user;
  }

  // Super Admin: Profile Override Button: "Reset Account Wallet & Liquidate Ledger to 0"
  // Completely wipes both current Available Balance, Referral Balance, and Total Lifetime Accumulated metric fields to absolute zero (0)
  static resetUserLedger(userId: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    user.walletA_balance = 0;
    user.walletB_balance = 0;
    user.lifetimeEarnings = 0;
    user.adsCompletedToday = 0;
    this.updateUser(user);

    return user;
  }

  // Withdrawals Management
  static getAllWithdrawals(): WithdrawalRequest[] {
    this.initDB();
    try {
      const data = localStorage.getItem(WITHDRAWALS_KEY);
      return data ? JSON.parse(data) : INITIAL_WITHDRAWALS;
    } catch {
      return INITIAL_WITHDRAWALS;
    }
  }

  static saveWithdrawals(withdrawals: WithdrawalRequest[]): void {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
  }

  static requestWithdrawal(
    userId: string,
    walletType: 'earning' | 'referral',
    amount: number,
    bankName: string,
    accountNumber: string,
    accountName: string
  ): WithdrawalRequest {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    // Deduct from wallet
    if (walletType === 'earning') {
      if (user.walletA_balance < amount) throw new Error('Insufficient Earning Wallet balance');
      user.walletA_balance -= amount;
    } else {
      if (user.walletB_balance < amount) throw new Error('Insufficient Referral Wallet balance');
      user.walletB_balance -= amount;
    }

    user.weeklyWithdrawalsCount = (user.weeklyWithdrawalsCount || 0) + 1;
    this.updateUser(user);

    const ref = `NST-PAY-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReq: WithdrawalRequest = {
      id: `wdr_${Date.now()}`,
      userId: user.id,
      userFullName: user.fullName,
      userEmail: user.email,
      walletType,
      amount,
      bankName,
      accountNumber,
      accountName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      referenceCode: ref
    };

    const withdrawals = this.getAllWithdrawals();
    withdrawals.unshift(newReq);
    this.saveWithdrawals(withdrawals);

    return newReq;
  }

  // Admin Approve & Pay via Paystack Transfer
  static approvePaystackTransfer(requestId: string): WithdrawalRequest {
    const withdrawals = this.getAllWithdrawals();
    const index = withdrawals.findIndex(w => w.id === requestId);
    if (index === -1) throw new Error('Withdrawal request not found');

    const transferId = `TRF_pstk_${Math.random().toString(36).substring(2, 12)}`;
    withdrawals[index].status = 'approved';
    withdrawals[index].processedAt = new Date().toISOString();
    withdrawals[index].paystackTransferId = transferId;

    this.saveWithdrawals(withdrawals);
    return withdrawals[index];
  }

  // Calculate Financial Audit Stats for Admin Dashboard
  static getFinancialAuditStats(): FinancialAuditStats {
    const users = this.getAllUsers();
    const withdrawals = this.getAllWithdrawals();

    const totalMembers = users.length;
    const totalCumulativeBalances = users.reduce((sum, u) => sum + u.walletA_balance + u.walletB_balance, 0);
    
    // Friday outgoing liabilities: Pending withdrawals
    const totalFridayLiabilities = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);

    const totalApprovedPaid = withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + w.amount, 0);

    const activeTasksToday = users.filter(u => u.adsCompletedToday > 0).length;

    return {
      totalMembers,
      totalCumulativeBalances,
      totalFridayLiabilities,
      totalApprovedPaid,
      activeTasksToday
    };
  }

  // Friday Override test toggle
  static getFridayOverride(): boolean {
    return localStorage.getItem(FORCE_FRIDAY_KEY) === 'true';
  }

  static setFridayOverride(override: boolean): void {
    localStorage.setItem(FORCE_FRIDAY_KEY, override ? 'true' : 'false');
  }
}
