import React from 'react';
import { X, ShieldCheck, Zap, Award, CheckCircle2, Building, Send } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Zap className="w-6 h-6 fill-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              About NairaStream Technologies
            </h2>
            <p className="text-xs text-slate-400">
              Nigeria's Leading Digital Ad Monetization & Automated Payout Network
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>NairaStream</strong> is a digital rewards and advertising infrastructure designed specifically for the Nigerian ecosystem. We connect tier-1 ad publishers, international brands, and fintech startups with high-intent Nigerian mobile consumers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs uppercase font-bold text-emerald-400 font-mono">Our Mission</div>
              <div className="text-xs text-slate-300">
                To provide a sustainable, fee-free daily earning stream for every Nigerian with a smartphone or laptop.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs uppercase font-bold text-teal-400 font-mono">Disbursement Model</div>
              <div className="text-xs text-slate-300">
                Automated Friday bank transfers directly to NUBAN accounts (Access, GTB, Zenith, OPay, PalmPay, Kuda).
              </div>
            </div>
          </div>

          <h3 className="text-base font-bold text-white pt-2">Why Our Model is 100% Free:</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Brand advertisers pay us per impression & verified attention click.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>We distribute 70% of ad revenues directly to active viewers in Wallet A.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Zero registration fees, zero card activation requirements, zero hidden deductions.</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <a
            href="https://t.me/nairastreams"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:underline flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Join Official Telegram (@nairastreams)</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
          >
            Get Started Free
          </button>
        </div>

      </div>
    </div>
  );
};
