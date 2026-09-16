import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Volume2, VolumeX, CheckCircle, Play, Star } from 'lucide-react';

interface StarVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnStar: () => void;
  currentStars: number;
}

interface MeditationClip {
  id: string;
  title: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  theme: 'sea' | 'galaxy' | 'forest' | 'candle';
}

const CLIPS: MeditationClip[] = [
  {
    id: 'sea',
    title: '🌊 深海潮汐與鯨落冥想',
    tagline: '感受潛意識的深邃與包容，讓緊繃的心情隨潮水退去。',
    bgGradient: 'from-[#031526] via-[#082a47] to-[#020b14]',
    accentColor: '#71d9ff',
    theme: 'sea',
  },
  {
    id: 'galaxy',
    title: '🌌 銀河星軌與深空靜謐',
    tagline: '在萬億星辰的無垠宇宙中，找回屬於你自己的安穩心靈坐標。',
    bgGradient: 'from-[#120429] via-[#210c42] to-[#080214]',
    accentColor: '#aa9cff',
    theme: 'galaxy',
  },
  {
    id: 'forest',
    title: '🌿 靜夜松林與流螢微光',
    tagline: '夜風拂過樹梢，深吸一口草木芬芳，釋放白天的所有焦慮。',
    bgGradient: 'from-[#031c13] via-[#0a3324] to-[#020d08]',
    accentColor: '#78e1b5',
    theme: 'forest',
  },
  {
    id: 'candle',
    title: '🕯️ 潛意識暖光睡前引導',
    tagline: '柔和燭光搖曳，告訴夢境深處的自己：現在是安全的。',
    bgGradient: 'from-[#2b1704] via-[#45270b] to-[#120902]',
    accentColor: '#ffd27a',
    theme: 'candle',
  },
];

export const StarVideoModal: React.FC<StarVideoModalProps> = ({
  isOpen,
  onClose,
  onEarnStar,
  currentStars,
}) => {
  const [currentClip, setCurrentClip] = useState<MeditationClip>(CLIPS[0]);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // When modal opens, pick a random clip and reset timer
  useEffect(() => {
    if (isOpen) {
      const randomClip = CLIPS[Math.floor(Math.random() * CLIPS.length)];
      setCurrentClip(randomClip);
      setSecondsRemaining(10);
      setIsCompleted(false);
      setHasClaimed(false);
    } else {
      stopAmbientAudio();
    }
  }, [isOpen]);

  // 10-second countdown
  useEffect(() => {
    if (!isOpen || isCompleted || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, secondsRemaining]);

  // Ambient sound synthesizer
  const startAmbientAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(174, ctx.currentTime); // Solfeggio healing frequency
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsMuted(false);
    } catch (e) {
      console.warn('Audio play restricted by browser policy', e);
    }
  };

  const stopAmbientAudio = () => {
    try {
      if (gainRef.current && audioContextRef.current) {
        gainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch {
      // ignore
    }
    audioContextRef.current = null;
    oscRef.current = null;
    gainRef.current = null;
    setIsMuted(true);
  };

  const toggleSound = () => {
    if (isMuted) {
      startAmbientAudio();
    } else {
      stopAmbientAudio();
    }
  };

  const handleClaim = () => {
    if (hasClaimed) return;
    setHasClaimed(true);
    stopAmbientAudio();
    onEarnStar();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((10 - secondsRemaining) / 10) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      id="star-video-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/20 overflow-hidden shadow-2xl bg-[#090b15] text-white"
        id="star-video-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-400/30">
              ⭐
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                一般會員儲星計劃
              </span>
              <span className="text-[11px] text-[#8d97b5] block">
                現有星星：{currentStars} 顆
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#aab3d2] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div
          className={`relative h-64 sm:h-72 w-full bg-gradient-to-b ${currentClip.bgGradient} flex flex-col items-center justify-center p-6 text-center overflow-hidden`}
        >
          {/* Animated Atmospheric Background Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl"
              style={{ backgroundColor: currentClip.accentColor, opacity: 0.3 }}
            />
          </div>

          {/* Calming Ripple / Pulsing Core */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center border border-white/30 bg-white/5 backdrop-blur-sm mb-4 shadow-lg">
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: currentClip.accentColor }}
              />
              <Sparkles className="w-8 h-8" style={{ color: currentClip.accentColor }} />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              {currentClip.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-sm mt-1.5 leading-relaxed">
              {currentClip.tagline}
            </p>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="absolute bottom-4 left-4 p-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white/90 hover:bg-black/70 flex items-center gap-1.5 transition-colors z-20 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#8d97b5]" /> : <Volume2 className="w-4 h-4 text-[#78e1b5]" />}
            <span>{isMuted ? '開啟白噪音' : '靜音'}</span>
          </button>

          {/* Floating Stars badge */}
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-amber-300 z-20 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>觀看完獲取 +1 星</span>
          </div>
        </div>

        {/* Progress Bar & Reward Controls */}
        <div className="p-5 bg-[#0e1224] border-t border-white/10 space-y-3.5">
          <div>
            <div className="flex items-center justify-between text-xs text-[#aab3d2] mb-1.5">
              <span>{isCompleted ? '✓ 短片觀看完成！' : '正在觀看心靈短片…'}</span>
              <span className="font-mono text-white">
                {isCompleted ? '10/10 秒' : `剩餘 ${secondsRemaining} 秒`}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-all duration-1000 ease-linear rounded-full bg-gradient-to-r from-[#aa9cff] via-[#71d9ff] to-amber-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <button
              type="button"
              onClick={handleClaim}
              disabled={hasClaimed}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasClaimed
                  ? 'bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/40'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-98'
              }`}
              id="btn-claim-star-reward"
            >
              {hasClaimed ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#78e1b5]" />
                  <span>已領取！星星 +1 ⭐（現有 {currentStars + 1} 顆）</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 fill-black" />
                  <span>點擊領取 1 顆夢境星星 ⭐</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between text-xs text-[#8d97b5] px-1">
              <span>倒數完成即可獲得 1 顆星星，解鎖進階夢境功能。</span>
              <button
                type="button"
                onClick={onClose}
                className="text-[#aab3d2] hover:text-white underline cursor-pointer"
              >
                略過
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
