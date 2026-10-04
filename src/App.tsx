import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  ExternalLink,
  Flame,
  ArrowDown,
  Layers,
  Zap,
} from 'lucide-react';
import { VerificationState } from './types';
import { VerificationModal } from './components/VerificationModal';
import { Navbar } from './components/Navbar';
import { VideoUpscaler } from './components/VideoUpscaler';
import { ImageUpscaler } from './components/ImageUpscaler';

export default function App() {
  const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

  // Verification state tracking
  const [verification, setVerification] = useState<VerificationState>(() => {
    let saved = false;
    try {
      saved = localStorage.getItem('klicld_verified') === 'true';
    } catch {
      // ignore
    }
    return {
      discordVerified: saved,
      tiktokVerified: saved,
      botCaptchaVerified: saved,
      isUnlocked: saved,
      tiktokCountdown: 5,
      isCountingDown: false,
      discordJoinClicked: saved,
      tiktokFollowClicked: saved,
      botKickedOut: false,
    };
  });

  // Open verification modal on initial load if not verified yet
  useEffect(() => {
    if (!verification.isUnlocked) {
      const timer = setTimeout(() => {
        setIsVerificationModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [verification.isUnlocked]);

  const handleUnlockSuccess = () => {
    setIsVerificationModalOpen(false);
  };

  const scrollToImageSection = () => {
    setActiveTab('image');
    const el = document.getElementById('image-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToVideoSection = () => {
    setActiveTab('video');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b12] bg-grid-pattern text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        verification={verification}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
      />

      {/* Verification Lock Banner (if not unlocked) */}
      {!verification.isUnlocked && (
        <div className={`py-3 px-4 text-center border-b transition-colors ${
          verification.botKickedOut
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-rose-500/50'
            : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border-amber-500/30'
        }`}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Lock className={`w-4 h-4 shrink-0 ${verification.botKickedOut ? 'text-rose-400' : 'text-amber-400'}`} />
              <span className={verification.botKickedOut ? 'text-rose-300 font-bold' : 'text-amber-200'}>
                {verification.botKickedOut
                  ? 'تم إخراجك من البرنامج بسبب إجابة خاطئة في فحص البوتات! اضغط لإعادة المحاولة.'
                  : 'الأداة مقفلة: اشترك في سيرفر الديسكورد وتيك توك ثم أجب على مسألة 3×3 لإثبات أنك إنسان (حقوق سيرفر أنور)'}
              </span>
            </div>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className={`px-4 py-1.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                verification.botKickedOut
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950'
              }`}
            >
              {verification.botKickedOut ? 'إعادة التحقق (سيرفر أنور)' : 'فحص البوتات والاشتراك'}
            </button>
          </div>
        </div>
      )}

      {/* Hero Quick Jump & Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              محرك الذكاء الاصطناعي جاهز: 4K Neural Tensor Core v4.2
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={scrollToVideoSection}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>مربع الفيديو 4K / 2K</span>
            </button>
            <button
              onClick={scrollToImageSection}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-pink-500 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>قسم الصور بالأسفل (4K)</span>
              <ArrowDown className="w-3 h-3 text-pink-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-16">
        {/* SECTION 1: VIDEO UPSCALER */}
        <section className="relative">
          <VideoUpscaler />

          {/* Locked overlay if not verified */}
          {!verification.isUnlocked && (
            <div className="absolute inset-0 bg-[#070b12]/80 backdrop-blur-[4px] rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                مربع ترقية الفيديو إلى 4K مقفل مؤقتاً
              </h3>
              <p className="text-sm text-slate-300 max-w-md mb-2 leading-relaxed">
                اشترك في سيرفر الديسكورد وتيك توك ثم أجب على مسألة فحص البوتات 3×3 لتفعيل ميزة رفع
                الفيديو إلى 4K و 2K مجاناً وبلا حدود.
              </p>
              <div className="text-xs text-amber-400 font-bold mb-4 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                برعاية وحقوق سيرفر أنور ©
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>فتح الأداة وفحص البوتات (سيرفر أنور)</span>
              </button>
            </div>
          )}
        </section>

        {/* SECTION DIVIDER WITH SCROLL PROMPT */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/80" />
          </div>
          <div className="relative px-6 py-2 bg-[#0b0f19] rounded-2xl border border-slate-800 text-xs font-bold text-slate-400 flex items-center gap-2 shadow-lg">
            <ImageIcon className="w-4 h-4 text-pink-400" />
            <span>قسم معالجة وترقية الصور إلى 4K • حقوق سيرفر أنور</span>
            <ArrowDown className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
          </div>
        </div>

        {/* SECTION 2: IMAGE UPSCALER (UNDERNEATH) */}
        <section className="relative">
          <ImageUpscaler />

          {/* Locked overlay if not verified */}
          {!verification.isUnlocked && (
            <div className="absolute inset-0 bg-[#070b12]/80 backdrop-blur-[4px] rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                قسم ترقية الصور إلى 4K مقفل مؤقتاً
              </h3>
              <p className="text-sm text-slate-300 max-w-md mb-2 leading-relaxed">
                أكمل خطوات الاشتراك واجتز فحص مكافحة البوتات (3×3) لتوليد وتحميل صورك بدقة 4K فائقة الوضوح.
              </p>
              <div className="text-xs text-amber-400 font-bold mb-4 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                برعاية وحقوق سيرفر أنور ©
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-black text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>إكمال التحقق لفتح قسم الصور 4K</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer with links */}
      <footer className="mt-20 border-t border-slate-800/80 bg-[#060910] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center font-mono font-black text-slate-950">
                4K
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">KLICLD AI 4K STUDIO</h4>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                    حقوق سيرفر أنور
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  المنصة الاحترافية لترقية جودة الفيديو والصور إلى 4K و 2K • جميع الحقوق محفوظة لسيرفر أنور
                </p>
              </div>
            </div>

            {/* Social Verification Direct Links */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://discord.gg/QNmhwjvUR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#8da0f9] border border-[#5865F2]/40 text-xs font-bold transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>سيرفر الديسكورد</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.tiktok.com/@klicld"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.84 1.54V6.84a4.85 4.85 0 0 1-1.07-.15z" />
                </svg>
                <span>تيك توك @klicld</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Verification Modal (Discord + TikTok 5-sec countdown) */}
      <VerificationModal
        state={verification}
        setState={setVerification}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSuccess={handleUnlockSuccess}
      />
    </div>
  );
}
