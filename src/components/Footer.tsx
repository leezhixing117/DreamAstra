import React from 'react';
import { Moon, ShieldCheck, Star, Heart, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin') => void;
  onOpenTherapeuticSupport: () => void;
  onOpenEarnStars: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTherapeuticSupport,
  onOpenEarnStars,
}) => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#060814]/75 backdrop-blur-2xl text-[#8d97b5] text-xs mt-auto pt-10 pb-12" id="global-site-footer">
      <div className="shell max-w-6xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-base">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#aa9cff] to-[#71d9ff] flex items-center justify-center text-black">
                <Moon className="w-4 h-4 fill-current" />
              </span>
              <span>DreamWisdom</span>
            </div>
            <p className="text-[12px] leading-relaxed text-[#8d97b5]">
              專為香港廣東話設計的潛意識夢境宇宙。別人解讀你的夢，我們記得你的夢。
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#78e1b5]/10 border border-[#78e1b5]/20 text-[#78e1b5] text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>絕不用作用戶數據訓練 AI</span>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">探索功能</h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  首頁探索
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('app')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
                  <span>我的夢境解碼</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>方案與星星幣 (Pricing)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="text-[#aa9cff]">🛍️</span>
                  <span>解夢選物店</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust Col */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">信任與私隱</h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#78e1b5]" />
                  <span>獨立私隱政策 (Privacy)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  純本地模式 (Local-Only)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTherapeuticSupport}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-amber-300/90"
                >
                  <Heart className="w-3.5 h-3.5 text-amber-300" />
                  <span>香港心理支援與熱線</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Earning Stars Quick Access */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">免費用戶代幣</h4>
            <p className="text-[12px] leading-relaxed mb-3">
              免費用戶可透過收看短片廣告賺取星星幣，解鎖 AI 深度解密與擴充存檔。
            </p>
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>睇片賺星星幣 (+1 ⭐)</span>
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6b7596]">
          <p>© {new Date().getFullYear()} DreamWisdom. 本平台只做基於心理學的自我反思工具，不做吉凶預測；本平台不是心理治療、不是精神科服務，非臨床醫療途徑。</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              私隱條款
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              權益架構
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenTherapeuticSupport}
              className="hover:text-white transition-colors cursor-pointer"
            >
              心靈求助熱線
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
