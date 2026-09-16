import React from 'react';
import { User } from '../types';
import { Moon, ShieldCheck, UserCircle, LogIn, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'app' | 'admin';
  setCurrentView: (view: 'home' | 'app' | 'admin') => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
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

          <button
            type="button"
            onClick={() => setCurrentView('admin')}
            className={`bg-transparent border-0 text-[14px] cursor-pointer flex items-center gap-1.5 ${
              currentView === 'admin' ? 'text-white font-semibold' : ''
            }`}
            id="nav-link-admin"
          >
            <BookOpen className="w-4 h-4 text-[#71d9ff]" />
            管理員
            {currentUser?.role === 'admin' && (
              <span className="text-[10px] bg-[#aa9cff]/20 text-[#c3b9ff] px-1.5 py-0.5 rounded-full border border-[#aa9cff]/30">
                Admin
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2" id="nav-user-profile">
              <button
                type="button"
                onClick={() => setCurrentView('app')}
                className="navpill"
                title={`登入帳戶: ${currentUser.email}`}
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
                className="btn2 text-xs opacity-70 hover:opacity-100"
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
              className="navpill"
              id="nav-login-btn"
            >
              <LogIn className="w-4 h-4 text-[#ffd27a]" />
              Google 登入
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
