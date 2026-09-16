import React from 'react';
import { User, normalizeRole, getRoleDisplayName } from '../types';
import { Moon, ShieldCheck, UserCircle, LogIn, Sparkles, BookOpen, Star, Crown, Settings } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'app' | 'admin';
  setCurrentView: (view: 'home' | 'app' | 'admin') => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenEarnStars?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenEarnStars,
}) => {
  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
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
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'home') setCurrentView('home');
              setTimeout(() => {
                const el = document.getElementById('how');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="bg-transparent border-0 text-[14px] cursor-pointer"
            id="nav-link-how"
          >
            如何運作
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('app')}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'app' ? 'text-white font-semibold' : ''
            }`}
            id="nav-link-app"
          >
            <Sparkles className="w-4 h-4 text-[#aa9cff]" />
            我的夢境
          </button>

          {/* Admin link for Admin & Super Admin */}
          {isManagement && (
            <button
              type="button"
              onClick={() => setCurrentView('admin')}
              className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
                currentView === 'admin' ? 'text-white font-semibold' : ''
              }`}
              id="nav-link-admin"
            >
              <BookOpen className="w-4 h-4 text-[#71d9ff]" />
              <span>控制室</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                normRole === 'super_admin'
                  ? 'bg-[#aa9cff]/20 text-[#c3b9ff] border-[#aa9cff]/30 font-semibold'
                  : 'bg-[#71d9ff]/20 text-[#71d9ff] border-[#71d9ff]/30'
              }`}>
                {normRole === 'super_admin' ? '高級管理員' : '管理員'}
              </span>
            </button>
          )}

          {/* General Member Stars Counter & Video Earning CTA */}
          {currentUser && normRole === 'free' && onOpenEarnStars && (
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 hover:bg-amber-400/25 transition-all text-xs text-amber-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="點擊觀看 10 秒心靈短片儲星星 ⭐"
              id="nav-earn-stars-btn"
            >
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{currentUser.stars ?? 2} 顆星</span>
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
