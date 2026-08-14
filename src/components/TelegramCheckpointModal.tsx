import React, { useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Sparkles,
  Lock
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { User } from '../types';

interface TelegramCheckpointModalProps {
  user: User;
  onUnlocked: (updatedUser: User) => void;
}

export const TelegramCheckpointModal: React.FC<TelegramCheckpointModalProps> = ({
  user,
  onUnlocked
}) => {
  const [clickedLink, setClickedLink] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleJoinClick = () => {
    setClickedLink(true);
    window.open('https://t.me/nairastreams', '_blank', 'noopener,noreferrer');
  };

  const handleVerifyAttendance = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // Permanently mark has_joined_telegram as true
      const updated = StorageService.markTelegramJoined(user.id);
      setIsVerifying(false);
      onUnlocked(updated);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg p-6 sm:p-10 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-slate-100 text-center overflow-hidden">
        
        {/* Neon Top Glowing Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

        {/* Telegram Shield Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-3xl bg-sky-500/20 blur-xl"></div>
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30">
            <Send className="w-10 h-10 -rotate-12 translate-x-0.5" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>SECURITY REQUIREMENT (1-TIME STEP)</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
          Mandatory Security Step
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          Join the <strong className="text-white">Official NairaStream Telegram Announcement Channel</strong> to unlock your earning dashboard and receive real-time Friday payout proof notifications.
        </p>

        {/* Instructions Steps Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
              1
            </div>
            <span>Click the neon action button below to join <strong>@nairastreams</strong> on Telegram.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
              2
            </div>
            <span>Click <strong>"Verify My Channel Attendance & Unlock Dashboard"</strong> to permanently activate your earning tools.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3.5">
          
          {/* Step 1: Open Telegram */}
          <button
            onClick={handleJoinClick}
            id="btn-join-telegram"
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2.5 transition-all active:scale-98"
          >
            <Send className="w-5 h-5 -rotate-12 fill-slate-950" />
            <span>1. Join Official Telegram Channel (@nairastreams)</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Step 2: Verify & Unlock */}
          <button
            onClick={handleVerifyAttendance}
            disabled={isVerifying}
            id="btn-verify-telegram-attendance"
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
              clickedLink 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)]' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              {isVerifying ? 'Verifying Attendance...' : '2. Verify My Channel Attendance & Unlock Dashboard'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* Note */}
        <div className="mt-6 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>One-time requirement. Never prompted again once confirmed.</span>
        </div>

      </div>
    </div>
  );
};
