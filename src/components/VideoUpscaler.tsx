import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Download,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Film,
  Layers,
  Cpu,
  MonitorPlay,
  ArrowRightLeft,
  Link as LinkIcon,
} from 'lucide-react';
import { TargetVideoQuality, VideoSettings } from '../types';
import { SAMPLE_VIDEOS, SampleItem } from '../data/samples';

export const VideoUpscaler: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>(SAMPLE_VIDEOS[0].url);
  const [videoName, setVideoName] = useState<string>('مقطع تجريبي عالي الحركة (سايبربانك)');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Split slider 0 - 100
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [inputUrl, setInputUrl] = useState<string>('');

  // Quality settings state
  const [settings, setSettings] = useState<VideoSettings>({
    quality: '4k',
    fpsBoost: true,
    hdrVivid: true,
    denoise: true,
    audioEnhance: true,
    sharpenLevel: 8,
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);

  // Video references
  const videoBeforeRef = useRef<HTMLVideoElement | null>(null);
  const videoAfterRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync play/pause between the two layered videos
  const togglePlay = () => {
    if (!videoBeforeRef.current || !videoAfterRef.current) return;
    if (isPlaying) {
      videoBeforeRef.current.pause();
      videoAfterRef.current.pause();
      setIsPlaying(false);
    } else {
      videoBeforeRef.current.play().catch(() => {});
      videoAfterRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Sync time scrubber
  const handleTimeUpdate = () => {
    if (videoBeforeRef.current) {
      setCurrentTime(videoBeforeRef.current.currentTime);
      setDuration(videoBeforeRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoBeforeRef.current) videoBeforeRef.current.currentTime = time;
    if (videoAfterRef.current) videoAfterRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Sync both videos when one loops or seeks
  const handleSyncVideos = () => {
    if (videoBeforeRef.current && videoAfterRef.current) {
      if (Math.abs(videoBeforeRef.current.currentTime - videoAfterRef.current.currentTime) > 0.08) {
        videoAfterRef.current.currentTime = videoBeforeRef.current.currentTime;
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoName(file.name);
      setIsCompleted(false);
      setProcessedVideoUrl(null);
      setIsPlaying(false);
    }
  };

  // Handle URL import
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setVideoSrc(inputUrl.trim());
    setVideoName('مقطع من رابط مباشر');
    setIsCompleted(false);
    setProcessedVideoUrl(null);
    setInputUrl('');
    setIsPlaying(false);
  };

  // Choose sample video
  const handleSelectSample = (sample: SampleItem) => {
    setVideoSrc(sample.url);
    setVideoName(sample.title);
    setIsCompleted(false);
    setProcessedVideoUrl(null);
    setIsPlaying(false);
  };

  // Split comparison drag handling
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  // Start 4K AI Upscaling simulation
  const handleStartUpscaling = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    setIsCompleted(false);

    const stages = [
      { p: 15, text: 'تحليل دقة الإطارات واستخراج بيانات Motion Vectors...' },
      { p: 35, text: 'تطبيق خوارزمية الذكاء الاصطناعي لإعادة بناء البيكسلات بدقة 4K...' },
      { p: 60, text: 'معالجة التشويش وعزل الضبابية (AI Neural Denoising)...' },
      { p: 80, text: 'مضاعفة الإطارات إلى 60 FPS وتوليد تدرج ألوان HDR سينمائي...' },
      { p: 95, text: 'ضغط متقدم بنظام H.265 / HEVC فائق الوضوح...' },
      { p: 100, text: 'اكتملت رندرة 4K بنجاح!' },
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        const next = prev + 2;
        if (currentIdx < stages.length && next >= stages[currentIdx].p) {
          setCurrentStage(stages[currentIdx].text);
          currentIdx++;
        }
        if (next >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setProcessedVideoUrl(videoSrc);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
          });
          return 100;
        }
        return next;
      });
    }, 90);
  };

  // Download simulation
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = `klicld_4k_enhanced_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Heading */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-cyan-500/20 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ميزة ترقية الفيديو بالذكاء الاصطناعي (AI Super-Resolution)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              مربع ترقية الفيديو إلى{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                4K Ultra HD
              </span>{' '}
              أو <span className="text-purple-400">2K</span>
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              ارفع أي مقطع فيديو من هاتفك أو جهازك، واختر الدقة المستهدفة (4K أو 2K أو دقة عالية). يقوم
              الذكاء الاصطناعي بإعادة رسم التفاصيل وتصفية التشويش ورفع معدل الإطارات إلى 60FPS مع تباين HDR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>رفع مقطع من جهازك</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Video Player + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Player & Split Comparison) - 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Video Container Box */}
          <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl group">
            {/* Resolution badges */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{settings.quality.toUpperCase()} 60FPS</span>
              </span>
              <span className="px-2 py-1 rounded-lg bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-[11px] font-mono text-cyan-300 font-bold">
                HDR VIVID
              </span>
            </div>

            {/* Video Comparison Container */}
            <div
              ref={containerRef}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              onClick={(e) => handleSliderMove(e.clientX)}
              className="relative w-full aspect-video bg-black cursor-ew-resize select-none overflow-hidden"
            >
              {/* Layer 1: Enhanced Video (Full Width, Underneath) */}
              <video
                ref={videoAfterRef}
                src={videoSrc}
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleSyncVideos}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: `contrast(${100 + (settings.hdrVivid ? 25 : 0)}%) saturate(${
                    100 + (settings.hdrVivid ? 35 : 0)
                  }%) brightness(${100 + (settings.hdrVivid ? 5 : 0)}%)`,
                }}
              />

              {/* Layer 2: Original Video (Clipped by slider position) */}
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white/80 transition-[width] duration-75"
                style={{ width: `${sliderPosition}%` }}
              >
                <video
                  ref={videoBeforeRef}
                  src={videoSrc}
                  playsInline
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    filter: 'blur(1px) contrast(90%) opacity(85%)', // simulates original lower-res
                  }}
                />
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 flex items-center justify-center -translate-x-1/2 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.8)] border-2 border-white flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Split Screen Labels */}
              <div className="absolute bottom-16 right-4 z-20 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-300">
                  قبل (الدقة الأصلية)
                </span>
              </div>
              <div className="absolute bottom-16 left-4 z-20 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-cyan-950/90 backdrop-blur-md border border-cyan-500/50 text-xs font-bold text-cyan-300">
                  بعد ({settings.quality.toUpperCase()} معالجة فائقة)
                </span>
              </div>

              {/* Scanline effect when processing */}
              {isProcessing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline shadow-[0_0_15px_#22d3ee] z-30" />
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-900/90 border-t border-slate-800 p-3 sm:p-4">
              {/* Progress Slider */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-slate-400 w-10">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-xs font-mono text-slate-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="text-xs text-slate-300 font-medium truncate max-w-[180px] sm:max-w-xs">
                    {videoName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    اسحب المؤشر للمقارنة قبل وبعد
                  </span>
                  <div className="w-24">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="w-full h-1 bg-slate-700 rounded appearance-none accent-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Sample Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-cyan-400" />
                <span>أو جرب أحد المقاطع التجريبية الجاهزة فوراً:</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_VIDEOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    videoSrc === sample.url
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={sample.thumbnail}
                    alt={sample.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold truncate">{sample.title}</div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{sample.resolution}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Quality Choices & AI Upscale Box) - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">اختيار دقة الفيديو المستهدفة</h3>
                <p className="text-[11px] text-slate-400">حدد الدقة والإعدادات المطلوبة للرندرة</p>
              </div>
            </div>

            {/* Quality Options: 4K, 2K, 1080p */}
            <div className="space-y-2.5 mb-6">
              {/* 4K OPTION */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, quality: '4k' })}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  settings.quality === '4k'
                    ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg text-cyan-300">4K Ultra HD</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      موصى به
                    </span>
                  </div>
                  {settings.quality === '4k' && (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  أعلى دقة فائقة (3840×2160) مع تحسين تفاصيل الوجه والملابس والألوان
                </p>
              </button>

              {/* 2K OPTION */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, quality: '2k' })}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative ${
                  settings.quality === '2k'
                    ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/80 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg text-indigo-300">2K Quad HD</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      2560×1440
                    </span>
                  </div>
                  {settings.quality === '2k' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  دقة متوازنة وشديدة الوضوح تبرز أدق التفاصيل بدون استهلاك عالي
                </p>
              </button>

              {/* 1080p HIGH QUALITY OPTION */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, quality: '1080p' })}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative ${
                  settings.quality === '1080p'
                    ? 'bg-gradient-to-r from-teal-950/90 to-emerald-950/80 border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg text-teal-300">دقة عالية فائقة</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      1080p 60FPS
                    </span>
                  </div>
                  {settings.quality === '1080p' && (
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  مناسبة لرفعها مباشرة على تيك توك وإنستغرام ريلز بدون تشويش المنصات
                </p>
              </button>
            </div>

            {/* Advanced Enhancement Switches */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80 mb-6">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                ميزات الذكاء الاصطناعي الإضافية:
              </span>

              {/* 60 FPS Boost */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/50">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>مضاعفة الإطارات إلى 60 FPS (سلاسة حركة)</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.fpsBoost}
                  onChange={(e) => setSettings({ ...settings, fpsBoost: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </label>

              {/* HDR Vivid Colors */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/50">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>تلوين سينمائي HDR ونطاق ديناميكي واسع</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hdrVivid}
                  onChange={(e) => setSettings({ ...settings, hdrVivid: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </label>

              {/* Denoise */}
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/50">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>عزل التشويش والضوضاء الرقمية (AI Denoise)</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.denoise}
                  onChange={(e) => setSettings({ ...settings, denoise: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Processing or Action Button */}
            {isProcessing ? (
              <div className="space-y-3 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>جاري معالجة الفيديو بالذكاء الاصطناعي...</span>
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    {processProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-cyan-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-150"
                    style={{ width: `${processProgress}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 leading-snug">
                  {currentStage || 'بدء معالجة الإطارات بدقة فائقة...'}
                </div>
              </div>
            ) : isCompleted ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">تم تجهيز الفيديو بدقة {settings.quality.toUpperCase()}!</div>
                    <div className="text-[10px] text-emerald-300/80">
                      جاهز للتحميل بجودة الكريستال وبصيغة MP4
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الفيديو المعزز ({settings.quality.toUpperCase()})</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartUpscaling}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:brightness-110 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>بدء رفع الجودة إلى {settings.quality.toUpperCase()} الآن</span>
              </button>
            )}

            {/* Paste direct link option */}
            <form onSubmit={handleUrlSubmit} className="mt-4 pt-4 border-t border-slate-800/80">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                أو الصق رابط مقطع فيديو مباشر (MP4 أو تيك توك):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono dir-ltr"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  جلب
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
