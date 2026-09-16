import React from 'react';
import { Sparkles, Dna, Compass, Key, Clock, Brain, Settings, ArrowLeft, LogOut } from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
  activeSection?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns';
  onNavigate: (view: 'home' | 'app' | 'admin', section?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isAdmin = false,
  activeSection = 'workspace',
  onNavigate,
  onLogout,
}) => {
  return (
    <aside className="sidebar" id="app-sidebar">
      <div className="sidecard space-y-1">
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
        >
          <Dna className="w-4 h-4 text-[#aa9cff]" />
          <span>🧬 DREAM DNA™️</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'constellation')}
          className={`sideitem ${activeSection === 'constellation' ? 'active' : ''}`}
          id="sidebar-item-constellation"
        >
          <Compass className="w-4 h-4 text-[#71d9ff]" />
          <span>🌌 星圖宇宙</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'mystery')}
          className={`sideitem ${activeSection === 'mystery' ? 'active' : ''}`}
          id="sidebar-item-mystery"
        >
          <Key className="w-4 h-4 text-[#ffd27a]" />
          <span>🗝️ 30 NIGHTS</span>
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

        {isAdmin && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="sideitem text-[#dce0ff] hover:text-white"
            id="sidebar-item-admin"
          >
            <Settings className="w-4 h-4 text-[#78e1b5]" />
            <span>⚙️ 管理員後台</span>
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
