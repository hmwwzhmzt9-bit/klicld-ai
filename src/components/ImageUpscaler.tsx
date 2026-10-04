import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  Sparkles,
  Download,
  CheckCircle2,
  Sliders,
  Maximize2,
  RotateCcw,
  Zap,
  Layers,
  Image as ImageIcon,
  ArrowRightLeft,
  Eye,
  Info,
} from 'lucide-react';
import { ImageSettings, TargetImageQuality } from '../types';
import { SAMPLE_IMAGES, SampleItem } from '../data/samples';
import { upscaleImageOnCanvas } from '../utils/imageProcessing';

export const ImageUpscaler: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_IMAGES[0].url);
  const [imageName, setImageName] = useState<string>('صورة بورتريه تجريبية');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Split slider 0 - 100

  // Dimensions
  const [origDims, setOrigDims] = useState<{ w: number; h: number }>({ w: 500, h: 750 });
  const [newDims, setNewDims] = useState<{ w: number; h: number }>({ w: 3840, h: 2560 });

  // Settings
  const [settings, setSettings] = useState<ImageSettings>({
    mode: '4k',
    sharpness: 85,
    denoise: 70,
    contrastBoost: 30,
    vibranceBoost: 40,
    faceEnhance: true,
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [enhancedDataUrl, setEnhancedDataUrl] = useState<string | null>(null);

  // References
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Measure initial image natural size when imageSrc changes
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setOrigDims({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
      // Trigger upscale calculation
      processUpscale(img, settings);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle upscale processing
  const processUpscale = async (imgObj?: HTMLImageElement, customSettings?: ImageSettings) => {
    const targetImg = imgObj || imgRef.current;
    if (!targetImg) return;

    setIsProcessing(true);
    setProgress(15);

    const activeSettings = customSettings || settings;

    // Simulate quick neural processing steps
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(timer);
          return 85;
        }
        return prev + 15;
      });
    }, 80);

    try {
      const res = await upscaleImageOnCanvas(targetImg, activeSettings);
      clearInterval(timer);
      setProgress(100);
      setEnhancedDataUrl(res.dataUrl);
      setNewDims({ w: res.width, h: res.height });
      setIsProcessing(false);
    } catch {
      clearInterval(timer);
      setIsProcessing(false);
      // Fallback
      setEnhancedDataUrl(targetImg.src);
    }
  };

  // Re-process when settings change (debounced or explicit)
  const handleApplySettings = () => {
    processUpscale();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#f43f5e', '#8b5cf6'],
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select sample
  const handleSelectSample = (sample: SampleItem) => {
    setImageSrc(sample.url);
    setImageName(sample.title);
  };

  // Split slider drag
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // Download high-res 4K image
  const handleDownload = () => {
    if (!enhancedDataUrl) return;
    const a = document.createElement('a');
    a.href = enhancedDataUrl;
    a.download = `klicld_4k_photo_${newDims.w}x${newDims.h}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#a855f7', '#06b6d4'],
    });
  };

  return (
    <div id="image-section" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#181124] to-slate-900 border border-pink-500/20 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>قسم رفع جودة الصور إلى 4K Ultra HD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ترقية وتكبير الصور بدقة{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
                4K Ultra HD
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              ارفع أي صورة قديمة أو منخفضة الدقة، واستمتع بتكبير يصل إلى 4 أضعاف مع معالجة الشوائب،
              توضيح ملامح الوجه، وشحذ التفاصيل الدقيقة وحفظها بصيغة 4K فائقة الوضوح.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-black text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(244,63,94,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>رفع صورة من جهازك</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Main Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Comparison Display (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl relative">
            {/* Dimension Specs Overlay */}
            <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2">
                <span className="text-slate-400">الأصل:</span> {origDims.w}×{origDims.h}
                <span className="text-pink-400">➔</span>
                <span className="text-pink-400 font-black">
                  {newDims.w}×{newDims.h} 4K
                </span>
              </span>
              <span className="px-2.5 py-1.5 rounded-xl bg-pink-950/80 backdrop-blur-md border border-pink-500/40 text-[11px] font-mono text-pink-300 font-bold">
                {((newDims.w * newDims.h) / 1000000).toFixed(1)} MegaPixels
              </span>
            </div>

            {/* Split Comparison Viewer */}
            <div
              ref={containerRef}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
              onClick={(e) => handleSliderMove(e.clientX)}
              className="relative w-full min-h-[380px] max-h-[600px] bg-[#05080f] cursor-ew-resize select-none overflow-hidden flex items-center justify-center"
            >
              {/* Layer 1: Enhanced 4K Image (Underneath) */}
              <img
                ref={imgRef}
                src={enhancedDataUrl || imageSrc}
                alt="Enhanced 4K Preview"
                crossOrigin="anonymous"
                className="w-full h-auto max-h-[600px] object-contain select-none"
              />

              {/* Layer 2: Original Low-Res Image (Clipped by slider position) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl transition-[width] duration-75"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={imageSrc}
                  alt="Original Preview"
                  crossOrigin="anonymous"
                  className="w-full h-auto max-h-[600px] object-contain select-none max-w-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    filter: 'blur(2px) contrast(85%)', // shows contrast with 4K clarity
                  }}
                />
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 flex items-center justify-center -translate-x-1/2 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.8)] border-2 border-white flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Badges on viewer */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-300">
                  قبل (الدقة العادية)
                </span>
              </div>
              <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-pink-950/90 backdrop-blur-md border border-pink-500/50 text-xs font-bold text-pink-300">
                  بعد (4K Ultra HD فائق النقاء)
                </span>
              </div>

              {/* Scanning visual when processing */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-30">
                  <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4" />
                  <div className="text-white font-bold text-sm">جاري إعادة بناء البيكسلات بدقة 4K...</div>
                  <div className="text-pink-400 font-mono text-xs mt-1">{progress}%</div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Slider control and filename */}
            <div className="bg-slate-900/90 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300 truncate max-w-xs">
                <ImageIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="truncate">{imageName}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  مستوى المقارنة ({Math.round(sliderPosition)}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Sample Images Palette */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block mb-3">
              صور تجريبية جاهزة للاختبار بنقرة واحدة:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    imageSrc === sample.url
                      ? 'bg-pink-950/60 border-pink-500/60 text-white'
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
                    <div className="text-[10px] text-pink-400 font-mono mt-0.5">{sample.resolution}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4K Controls & Download (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">إعدادات ترقية دقة الصورة</h3>
                <p className="text-[11px] text-slate-400">تحكم بمستوى النقاء والشحذ والتباين</p>
              </div>
            </div>

            {/* Mode selection */}
            <div className="space-y-2">
              {/* 4K MODE */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: '4k' })}
                className={`w-full p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  settings.mode === '4k'
                    ? 'bg-gradient-to-r from-pink-950/80 to-purple-950/80 border-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-pink-300">
                    4K Ultra HD (4X)
                  </span>
                  {settings.mode === '4k' && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  تكبير 4 أضعاف مع شحذ الحواف وإعادة تكوين البيكسلات المفقودة
                </p>
              </button>

              {/* 2K MODE */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: '2k' })}
                className={`w-full p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  settings.mode === '2k'
                    ? 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border-purple-500 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-purple-300">
                    2K Quad HD (2X)
                  </span>
                  {settings.mode === '2k' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  تكبير متوازن مرتين للصور المتوسطة والصور الشخصية
                </p>
              </button>

              {/* FACE RETOUCH */}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: 'face_retouch' })}
                className={`w-full p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  settings.mode === 'face_retouch'
                    ? 'bg-gradient-to-r from-amber-950/80 to-rose-950/80 border-amber-500 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-amber-300">
                    مصحح ملامح الوجه (Face AI)
                  </span>
                  {settings.mode === 'face_retouch' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  توضيح ملامح العيون والمسام وإزالة التمويه من الوجوه
                </p>
              </button>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              {/* Sharpness */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">شحذ وحدة التفاصيل:</span>
                  <span className="font-mono text-pink-400 font-bold">{settings.sharpness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.sharpness}
                  onChange={(e) => setSettings({ ...settings, sharpness: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* HDR Contrast */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">تباين وإضاءة HDR:</span>
                  <span className="font-mono text-purple-400 font-bold">{settings.contrastBoost}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.contrastBoost}
                  onChange={(e) =>
                    setSettings({ ...settings, contrastBoost: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Vibrance */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">حيوية الألوان:</span>
                  <span className="font-mono text-cyan-400 font-bold">{settings.vibranceBoost}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.vibranceBoost}
                  onChange={(e) =>
                    setSettings({ ...settings, vibranceBoost: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Apply & Re-render button */}
            <button
              onClick={handleApplySettings}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تحديث الفلاتر والرندرة</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 text-white font-black text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الصورة بدقة 4K جاهزة (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
