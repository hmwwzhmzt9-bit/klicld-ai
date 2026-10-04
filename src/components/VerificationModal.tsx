import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  Sparkles,
  ShieldCheck,
  Bot,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  UserCheck,
  Crown,
} from 'lucide-react';
import { VerificationState } from '../types';

interface VerificationModalProps {
  state: VerificationState;
  setState: React.Dispatch<React.SetStateAction<VerificationState>>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  state,
  setState,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [discordChecking, setDiscordChecking] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const DISCORD_LINK = 'https://discord.gg/QNmhwjvUR';
  const TIKTOK_LINK = 'https://www.tiktok.com/@klicld';

  // Handle TikTok 5-second countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.isCountingDown && state.tiktokCountdown > 0) {
      timer = setTimeout(() => {
        setState((prev) => {
          const nextCount = prev.tiktokCountdown - 1;
          if (nextCount <= 0) {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#00f2fe', '#4facfe', '#fe2c55'],
            });
            return {
              ...prev,
              tiktokCountdown: 0,
              isCountingDown: false,
              tiktokVerified: true,
            };
          }
          return {
            ...prev,
            tiktokCountdown: nextCount,
          };
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [state.isCountingDown, state.tiktokCountdown, setState]);

  // Handle Discord join click
  const handleDiscordClick = () => {
    setState((prev) => ({ ...prev, discordJoinClicked: true }));
    window.open(DISCORD_LINK, '_blank', 'noopener,noreferrer');

    setDiscordChecking(true);
    setTimeout(() => {
      setDiscordChecking(false);
      setState((prev) => ({ ...prev, discordVerified: true }));
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#5865F2', '#7289da', '#ffffff'],
      });
    }, 2500);
  };

  // Handle TikTok follow click: 5 seconds countdown
  const handleTikTokClick = () => {
    setState((prev) => ({
      ...prev,
      tiktokFollowClicked: true,
      isCountingDown: true,
      tiktokCountdown: 5,
    }));
    window.open(TIKTOK_LINK, '_blank', 'noopener,noreferrer');
  };

  // Both subscriptions done
  const subscriptionsCompleted = state.discordVerified && state.tiktokVerified;

  // Handle Math Bot Challenge: 3 x 3
  const handleCaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = captchaInput.trim();

    // Supports English "9" or Arabic numeral "٩"
    if (cleanInput === '9' || cleanInput === '٩') {
      // SUCCESS: User answered 9 -> Enter the program!
      setCaptchaError(null);
      setState((prev) => ({
        ...prev,
        botCaptchaVerified: true,
        botKickedOut: false,
        isUnlocked: true,
      }));

      // Celebratory Confetti
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#10b981', '#06b6d4', '#5865F2', '#ec4899', '#f59e0b'],
      });

      try {
        localStorage.setItem('klicld_verified', 'true');
      } catch {
        // ignore
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } else {
      // FAILED: Any other number -> KICK THEM OUT ("خرجه")
      setCaptchaError('إجابة خاطئة! تم رصدك كروبوت (بوت) وتم طردك وإخراجك من البرنامج.');
      setState((prev) => ({
        ...prev,
        botKickedOut: true,
        botCaptchaVerified: false,
        isUnlocked: false,
      }));
    }
  };

  // Reset verification completely if kicked out
  const handleReset = () => {
    setCaptchaInput('');
    setCaptchaError(null);
    setState({
      discordVerified: false,
      tiktokVerified: false,
      botCaptchaVerified: false,
      isUnlocked: false,
      tiktokCountdown: 5,
      isCountingDown: false,
      discordJoinClicked: false,
      tiktokFollowClicked: false,
      botKickedOut: false,
    });
    try {
      localStorage.removeItem('klicld_verified');
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5865F2]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#fe2c55]/20 rounded-full blur-3xl pointer-events-none" />

        {/* PROMINENT RIGHTS BANNER: حقوق سيرفر أنور */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>حقوق سيرفر أنور © جميع الحقوق محفوظة</span>
          </div>

          <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            KLICLD × ANWAR SERVER
          </div>
        </div>

        {/* IF KICKED OUT: "اذ قل رقم غير خرجه" */}
        {state.botKickedOut ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4)] animate-bounce">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-950 border border-rose-500/50 text-rose-400 text-xs font-bold">
                تم كشف بوت / إجابة خاطئة
              </span>
              <h3 className="text-2xl font-black text-white">
                تم طردك وإخراجك من البرنامج!
              </h3>
              <p className="text-sm text-rose-300 max-w-md mx-auto leading-relaxed">
                {captchaError || 'لقد قمت بإدخال رقم غير صحيح لمسألة 3×3، وتم رصدك كروبوت وتجميد الوصول وفق حماية حقوق سيرفر أنور.'}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة من البداية</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 pt-2 font-mono">
              نظام الحماية والأمان - حقوق سيرفر أنور
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center relative z-10 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-semibold mb-3">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>نظام التحقق ومكافحة البوتات لتفعيل أداة 4K AI</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                <span>تفعيل ترقية الفيديو والصور 4K</span>
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                أكمل الاشتراك في السيرفر والحساب، ثم أجب على مسألة التحقق من البوتات للدخول مباشرة:
              </p>
            </div>

            {/* Steps Container */}
            <div className="space-y-3.5 relative z-10 mb-6">
              {/* STEP 1: DISCORD */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
                  state.discordVerified
                    ? 'bg-[#5865F2]/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-[#5865F2]/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow shrink-0">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#5865F2]/20 text-[#8da0f9] font-mono font-bold">
                          الخطوة 1
                        </span>
                        <h4 className="font-bold text-white text-sm">الانضمام لسيرفر الديسكورد</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        discord.gg/QNmhwjvUR
                      </p>
                    </div>
                  </div>

                  <div>
                    {state.discordVerified ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم التحقق</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleDiscordClick}
                        disabled={discordChecking}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95 disabled:opacity-75"
                      >
                        {discordChecking ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>جاري التحقق...</span>
                          </>
                        ) : (
                          <>
                            <span>انضم للسيرفر</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 2: TIKTOK (5 SECONDS COUNTDOWN) */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
                  state.tiktokVerified
                    ? 'bg-rose-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-[#fe2c55]/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#fe2c55]/30 to-[#25f4ee]/30" />
                      <svg className="w-5 h-5 fill-white relative z-10" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.84 1.54V6.84a4.85 4.85 0 0 1-1.07-.15z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 font-mono font-bold">
                          الخطوة 2
                        </span>
                        <h4 className="font-bold text-white text-sm">متابعة حساب تيك توك</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        tiktok.com/@klicld <span className="text-amber-400 font-sans">(انتظار 5 ثوانٍ)</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    {state.tiktokVerified ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم التحقق (5 ثوانٍ)</span>
                      </div>
                    ) : state.isCountingDown ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        <span className="font-mono text-xs font-black animate-pulse">
                          {state.tiktokCountdown} ثوانٍ متبقية
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleTikTokClick}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] hover:brightness-110 text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
                      >
                        <span>تابع الحساب</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {state.isCountingDown && (
                  <div className="mt-2.5">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#fe2c55] via-amber-400 to-[#25f4ee] h-full transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${((5 - state.tiktokCountdown) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: BOT CAPTCHA (يطلع انه بوت اولا - مسألة 3x3) */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  !subscriptionsCompleted
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : state.botCaptchaVerified
                    ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        state.botCaptchaVerified
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono font-bold">
                          الخطوة 3 والأخيرة
                        </span>
                        <h4 className="font-bold text-white text-sm">
                          فحص البوتات الإجباري (سيرفر أنور)
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        تحقق أمني: أثبت أنك لست روبوت للدخول
                      </p>
                    </div>
                  </div>

                  {state.botCaptchaVerified ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                      <UserCheck className="w-4 h-4" />
                      <span>تم التحقق: بشري</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                      مطلوب للدخول
                    </span>
                  )}
                </div>

                {subscriptionsCompleted ? (
                  state.botCaptchaVerified ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        تمت الإجابة بنجاح (3 × 3 = 9)! تم تأكيد هويتك البشرية وفك قفل البرنامج.
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleCaptchaSubmit} className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-right">
                          <span className="text-xs text-slate-300 font-bold block">
                            حل المسألة التالية لإثبات أنك إنسان:
                          </span>
                          <span className="text-lg font-black font-mono text-cyan-300 tracking-wider">
                            3 × 3 = ؟
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="اكتب الناتج هنا..."
                            value={captchaInput}
                            onChange={(e) => {
                              setCaptchaInput(e.target.value);
                              setCaptchaError(null);
                            }}
                            className="w-36 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-black text-white focus:outline-none focus:border-cyan-400 font-mono"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
                          >
                            تأكيد الإجابة
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span>ملاحظة: إذا كانت الإجابة خاطئة سيتم إخراجك فوراً</span>
                        <span className="text-amber-400 font-semibold">حقوق سيرفر أنور</span>
                      </div>
                    </form>
                  )
                ) : (
                  <div className="text-xs text-slate-500 flex items-center gap-2 p-2">
                    <Lock className="w-4 h-4 text-slate-600" />
                    <span>أكمل الخطوة 1 و 2 أولاً ليظهر لك اختبار البوتات</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Anwar Server Rights */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-amber-300">حقوق سيرفر أنور</span>
                <span className="text-slate-500">| نظام أمني متطور</span>
              </div>

              {state.isUnlocked ? (
                <button
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>دخول الاستوديو الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>الميزات مقفلة حتى إكمال الخطوات الـ 3</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
