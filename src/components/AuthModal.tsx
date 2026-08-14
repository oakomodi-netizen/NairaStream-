import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Zap
} from 'lucide-react';
import { StorageService, PendingSignup, SUPER_ADMIN_ACCOUNT } from '../services/storageService';
import { sendVerificationOtpEmail } from '../services/emailService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccessLogin: (user: User) => void;
  onOtpRequired: (pending: PendingSignup) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccessLogin,
  onOtpRequired,
  onSwitchMode
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    // Check if email already registered
    const existing = StorageService.getUserByEmail(trimmedEmail);
    if (existing) {
      setErrorMsg('An account with this email already exists. Please log in instead.');
      return;
    }

    setLoading(true);

    try {
      // 1. Generate 6-digit OTP code string
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 2. Prepare pending signup payload
      const pendingData: PendingSignup = {
        fullName: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password,
        otpCode,
        createdAt: Date.now()
      };

      // 3. PERSISTENT PROTECTION (MOBILE REFRESH BUG FIX):
      // Save user's input credentials and OTP inside localStorage immediately upon dispatch
      StorageService.setPendingSignup(pendingData);

      // 4. Dispatch OTP via EmailJS REST API
      await sendVerificationOtpEmail(trimmedEmail, trimmedName, otpCode);

      setLoading(false);
      // Trigger OTP verification flow
      onOtpRequired(pendingData);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('Failed to dispatch verification code. Please try again.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    // Check for super admin credentials
    if (
      trimmedEmail === SUPER_ADMIN_ACCOUNT.email.toLowerCase() && 
      password === SUPER_ADMIN_ACCOUNT.password
    ) {
      // Admin authenticated
      StorageService.setCurrentUser(SUPER_ADMIN_ACCOUNT);
      onSuccessLogin(SUPER_ADMIN_ACCOUNT);
      return;
    }

    // Standard user login
    const user = StorageService.getUserByEmail(trimmedEmail);
    if (!user) {
      setErrorMsg('No registered account found with this email. Please check or create an account.');
      return;
    }

    if (user.password && user.password !== password) {
      setErrorMsg('Incorrect password. Please try again.');
      return;
    }

    StorageService.setCurrentUser(user);
    onSuccessLogin(user);
  };

  const handleDemoAdminFill = () => {
    setEmail(SUPER_ADMIN_ACCOUNT.email);
    setPassword(SUPER_ADMIN_ACCOUNT.password || 'Vudhiroyals@14');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden">
        
        {/* Neon accent top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Zap className="w-6 h-6 fill-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {mode === 'signup' ? 'Create Free Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {mode === 'signup' 
              ? 'Start streaming ads and earning ₦500 daily instantly' 
              : 'Log in to access your earning dashboard and Friday payout vault'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Signup Form */}
        {mode === 'signup' ? (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Obi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address (For OTP Verification)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number (WhatsApp/SMS)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. EMEKA77 (Gives ₦50 bonus to referrer)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 uppercase font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching EmailJS OTP...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Verify Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Super Admin Quick Helper */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Super Admin Demo Access:</span>
              <button
                type="button"
                onClick={handleDemoAdminFill}
                className="text-emerald-400 hover:underline font-medium"
              >
                Auto-fill Admin Creds
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Log In to NairaStream</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Switch Mode Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode('login');
                  onSwitchMode('login');
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Log In here
              </button>
            </p>
          ) : (
            <p>
              New to NairaStream?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode('signup');
                  onSwitchMode('signup');
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Create Free Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
