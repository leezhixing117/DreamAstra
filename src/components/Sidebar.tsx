import React from 'react';
import { Moon, Clock, Brain, Settings, ArrowLeft, LogOut, Sparkles } from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
  activeSection?: 'workspace' | 'history' | 'patterns';
  onNavigate: (view: 'home' | 'app' | 'admin', section?: 'workspace' | 'history' | 'patterns') => void;
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
      <div className="sidecard">
        <button
          type="button"
          onClick={() => onNavigate('app', 'workspace')}
          className={`sideitem ${activeSection === 'workspace' ? 'active' : ''}`}
          id="sidebar-item-workspace"
        >
          <Sparkles className="w-4 h-4 text-[#aa9cff]" />
          <span>🌙 我的夢境</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'history')}
          className={`sideitem ${activeSection === 'history' ? 'active' : ''}`}
          id="sidebar-item-history"
        >
          <Clock className="w-4 h-4 text-[#ffd27a]" />
          <span>🕰️ 過往報告</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('app', 'patterns')}
          className={`sideitem ${activeSection === 'patterns' ? 'active' : ''}`}
          id="sidebar-item-patterns"
        >
          <Brain className="w-4 h-4 text-[#71d9ff]" />
          <span>🧠 串連分析</span>
        </button>

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

        <div className="my-2 border-t border-white/10" />

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
          <span>↪ 登出／切換</span>
        </button>
      </div>
    </aside>
  );
};
