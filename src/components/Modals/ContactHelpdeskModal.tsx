import React, { useState } from 'react';
import { X, HelpCircle, Send, Mail, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

interface ContactHelpdeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactHelpdeskModal: React.FC<ContactHelpdeskModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Withdrawal Assistance');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              NairaStream Helpdesk
            </h2>
            <p className="text-xs text-slate-400">
              24/7 Member Assistance & Payment Inquiries
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Ticket Submitted Successfully</h3>
            <p className="text-xs text-slate-400">
              Our Nigerian support team will review your inquiry and respond within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chioma Adeleke"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Registered Email
              </label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Withdrawal Assistance">Friday Withdrawal & Payout Status</option>
                <option value="Ad Stream Verification">Ad Task & 20s Verification</option>
                <option value="Referral Tracking">Affiliate Vault & Referral Credit</option>
                <option value="Account Access">Account & Security Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Message / Details
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe your issue or question in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-95"
            >
              Submit Support Ticket
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Average Response: 15 Mins
              </span>
              <a
                href="https://t.me/nairastreams"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Send className="w-3.5 h-3.5" /> Telegram Desk
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
