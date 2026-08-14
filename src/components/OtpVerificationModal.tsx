import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Mail, 
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';
import { PendingSignup, StorageService } from '../services/storageService';
import { sendVerificationOtpEmail } from '../services/emailService';
import { User } from '../types';

interface OtpVerificationModalProps {
  pendingSignup: PendingSignup;
  onVerifiedSuccess: (user: User) => void;
  onCancel: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  pendingSignup,
  onVerifiedSuccess,
  onCancel
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-focus first digit
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Handle single digit
    const char = cleaned.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg(null);

    // Advance focus
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    setErrorMsg(null);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = () => {
    const enteredCode = digits.join('');
    if (enteredCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your security code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    // Hard access lock evaluation
    if (enteredCode !== pendingSignup.otpCode) {
      setIsVerifying(false);
      // HARD ACCESS LOCK ALERT REQUIREMENT:
      setErrorMsg('Invalid security code. Please check your Gmail primary or spam section.');
      return;
    }

    // Correct OTP code verified! Create permanent user profile
    const refCode = `NS${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
    
    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName: pendingSignup.fullName,
      email: pendingSignup.email,
      phone: pendingSignup.phone,
      password: pendingSignup.password,
      role: 'user',
      isAdmin: false,
      hasJoinedTelegram: false, // Will trigger Step 3 Telegram Checkpoint
      walletA_balance: 0.00,
      walletB_balance: 0.00,
      lifetimeEarnings: 0.00,
      adsCompletedToday: 0,
      lastAdDate: new Date().toISOString().split('T')[0],
      referralsCount: 0,
      referralCode: refCode,
      createdAt: new Date().toISOString(),
      weeklyWithdrawalsCount: 0
    };

    // Save in DB & set active session
    StorageService.createUser(newUser);
    // Clear pending signup from localStorage
    StorageService.clearPendingSignup();

    setIsVerifying(false);
    
    // Smooth transition to interior state without white-screen bugs
    onVerifiedSuccess(newUser);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendSuccess(false);
    setErrorMsg(null);

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const updatedPending: PendingSignup = {
      ...pendingSignup,
      otpCode: newCode
    };

    StorageService.setPendingSignup(updatedPending);

    await sendVerificationOtpEmail(updatedPending.email, updatedPending.fullName, newCode);

    setIsResending(false);
    setResendSuccess(true);
    setResendCooldown(60);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 sm:p-10 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100 text-center">
        
        {/* Glow Header Accent */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold font-mono mb-2">
          <Lock className="w-3 h-3" />
          <span>SECURITY ACCESS GATE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
          Enter 6-Digit Verification Code
        </h2>

        <p className="text-slate-300 text-sm mt-2 max-w-sm mx-auto">
          We dispatched an official OTP code to{' '}
          <span className="font-semibold text-emerald-400">{pendingSignup.email}</span>.
        </p>

        {/* Development Helper Preview */}
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 inline-block font-mono">
          Demo Code Preview:{' '}
          <span className="text-emerald-400 font-bold tracking-widest">{pendingSignup.otpCode}</span>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mt-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-start gap-2 text-left">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Resend success notice */}
        {resendSuccess && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>A fresh 6-digit code was re-dispatched to your inbox!</span>
          </div>
        )}

        {/* 6-Digit OTP Inputs */}
        <div className="mt-8 flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-extrabold font-mono rounded-2xl bg-slate-950 border transition-all focus:outline-none ${
                digit 
                  ? 'border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-950/20' 
                  : 'border-slate-800 text-white focus:border-emerald-500'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying || digits.join('').length !== 6}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Validating Security Token...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Unlock Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-2">
            <button
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isResending}
              className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code via EmailJS'}
              </span>
            </button>

            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Cancel Registration
            </button>
          </div>
        </div>

        {/* Security assurance note */}
        <div className="mt-6 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Mail className="w-3 h-3" />
          <span>Delivered via EmailJS Secure REST Protocol</span>
        </div>

      </div>
    </div>
  );
};
