import React from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import { Moon, ShieldCheck, UserCircle, LogIn, Sparkles, BookOpen, Star, Crown, Settings, Compass } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars';
  setCurrentView: (view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars') => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenEarnStars?: () => void;
  activeSection?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns';
  onNavigateSection?: (section: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns') => void;
  savedDreamCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenEarnStars,
  activeSection,
  onNavigateSection,
  savedDreamCount = 0,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  return (
    <nav className="nav" id="main-navbar">
      <div className="shell navin">
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="brand bg-transparent border-0 text-left p-0 cursor-pointer flex items-center"
          id="nav-brand-btn"
        >
          <span className="logo" aria-hidden="true">
            <Moon className="w-5 h-5 fill-current" />
          </span>
          <span className="font-extrabold text-white tracking-tight">DreamWisdom</span>
        </button>

        <div className="navlinks" id="nav-links-group">
          {/* 1. 我的夢境 */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateSection) {
                onNavigateSection('workspace');
              } else {
                setCurrentView('app');
              }
            }}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'app' && activeSection !== 'constellation' ? 'text-white font-semibold' : 'text-[#cbd2ef] hover:text-white'
            }`}
            id="nav-link-app"
          >
            <Sparkles className="w-4 h-4 text-[#aa9cff]" />
            <span>我的夢境</span>
          </button>

          {/* 2. 夢境星圖 */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateSection) {
                onNavigateSection('constellation');
              } else {
                setCurrentView('app');
              }
            }}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'app' && activeSection === 'constellation' ? 'text-[#71d9ff] font-semibold' : 'text-[#cbd2ef] hover:text-white'
            }`}
            id="nav-link-constellation"
            title="🌌 星圖 CONSTELLATION™️ · 夢境連線"
          >
            <Compass className="w-4 h-4 text-[#71d9ff]" />
            <span>夢境星圖</span>
          </button>

          {/* 3. 星星幣 */}
          <button
            type="button"
            onClick={() => setCurrentView('stars')}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'stars' ? 'text-amber-300 font-semibold' : 'text-[#cbd2ef] hover:text-white'
            }`}
            id="nav-link-stars"
            title="睇片儲星與消耗規則"
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>星星幣</span>
          </button>

          {/* 4. 方案 */}
          <button
            type="button"
            onClick={() => setCurrentView('pricing')}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'pricing' ? 'text-[#aa9cff] font-semibold' : 'text-[#cbd2ef] hover:text-white'
            }`}
            id="nav-link-pricing"
          >
            <span>方案</span>
          </button>

          {/* 5. 私隱 */}
          <button
            type="button"
            onClick={() => setCurrentView('privacy')}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'privacy' ? 'text-[#78e1b5] font-semibold' : 'text-[#cbd2ef] hover:text-white'
            }`}
            id="nav-link-privacy"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#78e1b5]" />
            <span>私隱</span>
          </button>

          {/* 選物 (Optional shortcut) */}
          <button
            type="button"
            onClick={() => setCurrentView('store')}
            className={`bg-transparent border-0 text-[13px] cursor-pointer flex items-center gap-1 ${
              currentView === 'store' ? 'text-emerald-400 font-semibold' : 'text-[#8d97b5] hover:text-white'
            }`}
            id="nav-link-store"
          >
            <span>🌿 選物</span>
          </button>

          {/* 6. 控制室 (Admin only) */}
          {isManagement && (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
                currentView === 'admin' ? 'text-white font-semibold' : 'text-[#71d9ff]'
              }`}
              id="nav-link-admin"
            >
              <BookOpen className="w-4 h-4 text-[#71d9ff]" />
              <span>控制室</span>
            </button>
          )}

          {/* Quota status visualization: 免費用戶已儲存 X/3 條夢境 */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono">
              {isPaid ? (
                <span className="text-[#78e1b5] flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>VIP 無限存檔</span>
                </span>
              ) : (
                <span className="text-amber-200/90 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>已儲存 {Math.min(3, savedDreamCount)}/3 條夢境</span>
                </span>
              )}
            </div>
          )}

          {/* General Member Stars Counter & Video Earning CTA */}
          {currentUser && normRole === 'free' && onOpenEarnStars && (
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 hover:bg-amber-400/25 transition-all text-xs text-amber-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="點擊觀看身心靈短片儲星星 ⭐"
              id="nav-earn-stars-btn"
            >
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{currentUser.stars ?? 2} 星</span>
              <span className="text-[10px] bg-amber-400/20 px-1 py-0.2 rounded text-amber-200">
                +儲星
              </span>
            </button>
          )}

          {/* Paid Member Badge */}
          {currentUser && normRole === 'paid' && (
            <div className="px-2.5 py-1 rounded-full bg-[#78e1b5]/15 border border-[#78e1b5]/30 text-xs text-[#78e1b5] flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span className="font-semibold">付費會員</span>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2" id="nav-user-profile">
              <button
                type="button"
                onClick={() => setCurrentView('app')}
                className="navpill"
                title={`登入帳戶: ${currentUser.email} (${getRoleDisplayName(currentUser.role)})`}
                id="nav-current-user-btn"
              >
                <UserCircle className="w-4 h-4 text-[#78e1b5]" />
                <span className="max-w-[120px] truncate text-white">
                  {currentUser.display_name || currentUser.email.split('@')[0]}
                </span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="btn2 text-xs opacity-70 hover:opacity-100 cursor-pointer"
                title="登出或切換帳戶"
                id="nav-logout-btn"
              >
                登出
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="navpill cursor-pointer"
              id="nav-login-btn"
            >
              <LogIn className="w-4 h-4 text-[#ffd27a]" />
              EMAIL 登入
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
