import React from 'react';
import { Heart, X, Shield, Phone, Moon, Sparkles, BookOpen } from 'lucide-react';

interface TherapeuticSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TherapeuticSupportModal: React.FC<TherapeuticSupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060b]/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-[#0d1022] border border-[#78e1b5]/30 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden text-left">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#78e1b5]/10 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8d97b5] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#78e1b5]/15 border border-[#78e1b5]/30 flex items-center justify-center text-[#78e1b5]">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="badge">CARE & THERAPEUTIC SUPPORT</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
              後續療癒與心靈支援選項
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#aab3d2] leading-relaxed mb-5">
          免費探索你的夢境宇宙之餘，若特定噩夢、被追逐或沉重意象反覆出現並引發焦慮，
          請記住：<b>夢境不是預言，而是心靈過載時的呼救。</b> 你不需要獨自承擔。
        </p>

        {/* Self-Care Techniques */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#78e1b5]" />
              意象重寫療法 (Imagery Rehearsal Therapy, IRT)
            </h4>
            <p className="text-[11px] text-[#aab3d2] leading-relaxed">
              在白天清醒且感到安全時，把重複噩夢的結尾改寫成一個受保護、平靜或有力量的版本（例如：不再狂奔逃跑，而是在舊居神枱旁迎來黎明曙光），每晚睡前練習想像改寫後的結局。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Moon className="w-3.5 h-3.5 text-[#71d9ff]" />
              睡前正念降噪 (Night Wind-down)
            </h4>
            <p className="text-[11px] text-[#aab3d2] leading-relaxed">
              睡前 30 分鐘放下屏幕藍光，進行 4-7-8 腹式呼吸法，告訴身體：「今天已經結束，現在的我是完全安全的。」
            </p>
          </div>
        </div>

        {/* Crisis & Professional Hotline */}
        <div className="p-4 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/20">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
            <Phone className="w-3.5 h-3.5 text-[#aa9cff]" />
            如感到難以承受的痛苦，請立即尋求免費專業支援熱線：
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-black/30">
              <span className="text-[10px] text-[#8d97b5] block">香港地區</span>
              <div className="text-white font-mono">情緒通：18111 (24小時)</div>
              <div className="text-[#aab3d2] text-[11px]">撒瑪利亞防止自殺會：2389 2222</div>
            </div>
            <div className="p-2 rounded-lg bg-black/30">
              <span className="text-[10px] text-[#8d97b5] block">台灣地區</span>
              <div className="text-white font-mono">生命線：1995 (24小時)</div>
              <div className="text-[#aab3d2] text-[11px]">張老師專線：1980</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn text-xs px-5 py-2.5"
          >
            明白，回到夢境探索
          </button>
        </div>
      </div>
    </div>
  );
};
