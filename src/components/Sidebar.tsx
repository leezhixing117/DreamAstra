import React from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import { Sparkles, Dna, Compass, Key, Clock, Brain, Settings, ArrowLeft, LogOut, Star, Crown, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentUser?: User | null;
  activeSection?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns';
  onNavigate: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin', section?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns') => void;
  onLogout: () => void;
  onOpenEarnStars?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeSection = 'workspace',
  onNavigate,
  onLogout,
  onOpenEarnStars,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  return (
    <aside className="sidebar" id="app-sidebar">
      <div className="sidecard space-y-1">
        {/* User Tier Status Badge on top of sidebar */}
        {currentUser && (
          <div className="p-2.5 mb-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-white truncate max-w-[110px]">
                {currentUser.display_name || currentUser.email.split('@')[0]}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  normRole === 'super_admin'
                    ? 'bg-[#aa9cff]/20 text-[#c3b9ff] border-[#aa9cff]/30 font-semibold'
                    : normRole === 'admin'
                    ? 'bg-[#71d9ff]/20 text-[#71d9ff] border-[#71d9ff]/30'
                    : normRole === 'paid'
                    ? 'bg-[#78e1b5]/20 text-[#78e1b5] border-[#78e1b5]/30'
                    : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                }`}
              >
                {getRoleDisplayName(normRole || 'free')}
              </span>
            </div>

            {normRole === 'free' ? (
              <div className="pt-1.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-amber-300 font-mono flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {currentUser.stars ?? 2} 顆星
                </span>
                {onOpenEarnStars && (
                  <button
                    type="button"
                    onClick={onOpenEarnStars}
                    className="text-[10px] text-[#ffd27a] hover:underline font-medium cursor-pointer"
                  >
                    睇片儲星 +
                  </button>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-[#8d97b5] pt-0.5">
                {normRole === 'paid' && '✨ 全功能直接解鎖免儲星'}
                {normRole === 'admin' && '⚙️ 全功能 + 內容管理'}
                {normRole === 'super_admin' && '🛡️ 全功能 + 更改會員等級'}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigate('app', 'workspace')}
          className={`sideitem ${activeSection === 'workspace' ? 'active' : ''}`}
          id="sidebar-item-workspace"
        >
          <Sparkles className="w-4 h-4 text-[#aa9cff]" />
          <span>🌙 夢境解碼</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'dna')}
          className={`sideitem ${activeSection === 'dna' ? 'active' : ''}`}
          id="sidebar-item-dna"
          title="DREAM DNA™️｜你的夢境指紋：統計你重複遇過嘅場景、物件同情緒"
        >
          <Dna className="w-4 h-4 text-[#aa9cff]" />
          <div className="text-left leading-tight">
            <div>🧬 DREAM DNA™️</div>
            <div className="text-[10px] text-[#8d97b5] font-normal">夢境指紋</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'constellation')}
          className={`sideitem ${activeSection === 'constellation' ? 'active' : ''}`}
          id="sidebar-item-constellation"
          title="星圖 CONSTELLATION™️｜夢境連線：將唔同夢境嘅人、地、情緒連成星圖"
        >
          <Compass className="w-4 h-4 text-[#71d9ff]" />
          <div className="text-left leading-tight">
            <div>🌌 星圖 CONSTELLATION™️</div>
            <div className="text-[10px] text-[#8d97b5] font-normal">夢境連線</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'mystery')}
          className={`sideitem ${activeSection === 'mystery' ? 'active' : ''}`}
          id="sidebar-item-mystery"
          title="30 NIGHTS MYSTERY™️｜30晚潛意識檔案：每晚解鎖線索碎片"
        >
          <Key className="w-4 h-4 text-[#ffd27a]" />
          <div className="text-left leading-tight">
            <div>🗝️ 30 NIGHTS™️</div>
            <div className="text-[10px] text-[#8d97b5] font-normal">30晚潛意識檔案</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'history')}
          className={`sideitem ${activeSection === 'history' ? 'active' : ''}`}
          id="sidebar-item-history"
        >
          <Clock className="w-4 h-4 text-[#78e1b5]" />
          <span>🕰️ 日記典藏</span>
        </button>

        <div className="my-2 border-t border-white/10" />

        {/* Pricing & Star Coins Nav Link */}
        <button
          type="button"
          onClick={() => onNavigate('pricing')}
          className="sideitem text-amber-200/90 hover:text-amber-100"
          id="sidebar-item-pricing"
        >
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>⭐ 方案與星星幣</span>
        </button>

        {/* Product Store / Healing goods */}
        <button
          type="button"
          onClick={() => onNavigate('store')}
          className="sideitem text-emerald-300 hover:text-emerald-200"
          id="sidebar-item-store"
          title="解夢選物店：碌柚葉去霉噴霧、深眠草本、空間淨化"
        >
          <span className="text-emerald-400">🌿</span>
          <span>解夢選物店 (碌柚葉)</span>
        </button>

        {/* Privacy Policy Link */}
        <button
          type="button"
          onClick={() => onNavigate('privacy')}
          className="sideitem text-[#8d97b5] hover:text-[#78e1b5]"
          id="sidebar-item-privacy"
        >
          <ShieldCheck className="w-4 h-4 text-[#78e1b5]" />
          <span>🛡️ 私隱承諾與條款</span>
        </button>

        {isManagement && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="sideitem text-[#dce0ff] hover:text-white"
            id="sidebar-item-admin"
          >
            <Settings className="w-4 h-4 text-[#78e1b5]" />
            <span>⚙️ 控制室 ({normRole === 'super_admin' ? '高級' : '管理員'})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="sideitem text-[#aab3d2] hover:text-white"
          id="sidebar-item-home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← 返回首頁</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="sideitem text-[#ff8b9d] hover:bg-red-500/10"
          id="sidebar-item-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>登出</span>
        </button>
      </div>
    </aside>
  );
};
