import React from 'react';
import { Sparkles, ShieldCheck, Video, Image as ImageIcon, Flame, CheckCircle2, Crown } from 'lucide-react';
import { VerificationState } from '../types';

interface NavbarProps {
  activeTab: 'video' | 'image';
  setActiveTab: (tab: 'video' | 'image') => void;
  verification: VerificationState;
  onOpenVerification: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  verification,
  onOpenVerification,
}) => {
  const isVerified = verification.isUnlocked;

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('video')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-xl bg-gradient-to-br from-cyan-300 via-white to-pink-400 bg-clip-text text-transparent font-mono tracking-tighter">
                    4K
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-[#0b0f19] rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-1.5">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                    KLICLD
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400 font-mono text-sm px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    AI PRO
                  </span>
                </h1>
                {/* Rights Badge */}
                <div className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>حقوق سيرفر أنور</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                محرر ورافع دقة الفيديو والصور بالذكاء الاصطناعي إلى 4K و 2K • حقوق سيرفر أنور
              </p>
            </div>
          </div>

          {/* Navigation Switcher (Video / Image) */}
          <nav className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>معالج الفيديو 4K</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>رافع الصور 4K</span>
            </button>
          </nav>

          {/* Verification Status Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVerification}
              className={`group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isVerified
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/40 animate-pulse'
              }`}
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">مفعل (بشري ✓)</span>
                  <span className="md:hidden">مفعل 4K ✓</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>تأكيد الاشتراك وفحص البوتات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


