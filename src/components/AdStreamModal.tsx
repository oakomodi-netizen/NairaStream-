import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Play, 
  Volume2, 
  VolumeX,
  MousePointerClick,
  Award,
  AlertTriangle
} from 'lucide-react';
import { AdTaskItem } from '../types';
import { formatNaira } from '../utils/timeUtils';

interface AdStreamModalProps {
  isOpen: boolean;
  ad: AdTaskItem;
  currentTaskNumber: number;
  totalDailyTasks: number;
  onClose: () => void;
  onCompleteTask: () => void;
}

export const AdStreamModal: React.FC<AdStreamModalProps> = ({
  isOpen,
  ad,
  currentTaskNumber,
  totalDailyTasks,
  onClose,
  onCompleteTask
}) => {
  // 30 seconds countdown
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isPausedAt20, setIsPausedAt20] = useState(false);
  const [hasCompletedSecurityClick, setHasCompletedSecurityClick] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [interactionRegistered, setInteractionRegistered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize countdown on open
  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(30);
      setIsPausedAt20(false);
      setHasCompletedSecurityClick(false);
      setIsCompleted(false);
      return;
    }

    setSecondsRemaining(30);
    setIsPausedAt20(false);
    setHasCompletedSecurityClick(false);
    setIsCompleted(false);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        // At exactly 20 seconds, if user hasn't clicked security check, pause!
        if (prev === 21) {
          // next is 20
          setIsPausedAt20(true);
          return 20;
        }

        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsCompleted(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Restart timer once security click is resolved
  const handleSecurityScreenTap = (e: React.MouseEvent) => {
    if (isPausedAt20 && !hasCompletedSecurityClick) {
      setHasCompletedSecurityClick(true);
      setIsPausedAt20(false);
      setInteractionRegistered(true);

      // Flash feedback and resume timer down to 0
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleClaimReward = () => {
    onCompleteTask();
  };

  if (!isOpen) return null;

  const progressPercentage = ((30 - secondsRemaining) / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[94vh] max-h-[880px] rounded-3xl bg-slate-950 border border-emerald-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden select-none"
        onClick={handleSecurityScreenTap}
      >
        
        {/* Top Control & Countdown Ribbon */}
        <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Zap className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  Sponsored Stream Task #{currentTaskNumber} of {totalDailyTasks}
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
                  +{formatNaira(ad.rewardNgn)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Adsterra Direct Smartlink & Multi-Layer Stack
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Live Countdown Clock */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono">
              <Clock className={`w-4 h-4 ${isPausedAt20 ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
              <div className="text-right">
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  {secondsRemaining}s
                </div>
              </div>
            </div>

            {/* Mute Audio Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Close button (allowed only after completion or with warning) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isCompleted) {
                  onCompleteTask();
                } else {
                  if (confirm('Closing early will forfeit this ad task reward. Close anyway?')) {
                    onClose();
                  }
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1 bg-slate-900 overflow-hidden relative shrink-0">
          <div 
            className={`h-full transition-all duration-300 ${
              isPausedAt20 
                ? 'bg-amber-400 animate-pulse' 
                : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* MAIN STACKED AD CONTENT CONTAINER */}
        <div className="relative flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          
          {/* Layer 1: Simulated Top Interactive Adsterra Banner */}
          <div className="w-full p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {ad.badge}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {ad.advertiser}
              </span>
            </div>
            <div className="text-xs text-slate-400 hidden md:block font-mono">
              Adsterra Secure Script Unit: {ad.adsterraTag}
            </div>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
            >
              {ad.ctaText}
            </button>
          </div>

          {/* Layer 2: Main Featured Creative & Direct Smartlink Canvas */}
          <div className="relative flex-1 min-h-[320px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col justify-end p-6 group">
            
            {/* Background Graphic */}
            <img
              src={ad.creativeUrl}
              alt={ad.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

            {/* Smartlink Simulated Interactive Elements */}
            <div className="relative z-10 space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DIRECT SMARTLINK STREAM #2026</span>
              </div>
              
              <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                {ad.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl drop-shadow">
                {ad.tagline}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                >
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400">
                  Tap anywhere on screen to verify human attention
                </span>
              </div>
            </div>

            {/* Interaction Tracker indicator */}
            {interactionRegistered && (
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Screen Tap Verified</span>
              </div>
            )}

          </div>

          {/* Layer 3: Secondary Adsterra Sponsored Native Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Instant NUBAN Payouts</div>
                <div className="text-[10px] text-slate-400">Direct to all 36 Nigerian banks</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Adsterra Clean Engine</div>
                <div className="text-[10px] text-slate-400">Zero rogue redirects on dashboard</div>
              </div>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Daily Cap ₦500.00</div>
                <div className="text-[10px] text-slate-400">Watch 34 daily tasks to maximize</div>
              </div>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

        </div>

        {/* 20-SECOND INTERACTION SECURITY LOCK OVERLAY */}
        {isPausedAt20 && !hasCompletedSecurityClick && (
          <div 
            onClick={handleSecurityScreenTap}
            className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md cursor-pointer animate-in fade-in"
          >
            <div className="relative max-w-md w-full p-8 rounded-3xl bg-slate-900 border-2 border-amber-400 text-center shadow-[0_0_50px_rgba(251,191,36,0.3)] animate-pulse">
              
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-4 text-amber-400">
                <MousePointerClick className="w-9 h-9 animate-bounce" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>TIMER PAUSED AT 20s</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
                Security Verification Click Required
              </h3>

              <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                Tap the active ad screen area right now to authenticate presence and resume your earning timer.
              </p>

              <div className="mt-6 py-3 px-4 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg">
                <MousePointerClick className="w-4 h-4" />
                <span>TAP HERE TO UNLOCK TIMER (20s ➔ 0s)</span>
              </div>

            </div>
          </div>
        )}

        {/* COMPLETION CELEBRATION MODAL OVERLAY (AT 0s) */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
            <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-emerald-500 text-center shadow-[0_0_60px_rgba(16,185,129,0.3)] space-y-4">
              
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <Award className="w-11 h-11" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                AD TASK COMPLETED SUCCESSFULLY
              </span>

              <h3 className="text-3xl font-extrabold text-white font-['Space_Grotesk']">
                +{formatNaira(ad.rewardNgn)} Credited!
              </h3>

              <p className="text-slate-300 text-sm">
                Your reward has been injected directly into <strong className="text-emerald-400">Wallet A (Available Earning Balance)</strong>.
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
                Task {currentTaskNumber} of {totalDailyTasks} Finished Today
              </div>

              <button
                onClick={handleClaimReward}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all active:scale-98"
              >
                Claim Reward & Return to Dashboard
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
