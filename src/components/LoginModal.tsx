import React, { useState } from 'react';
import { User, UserRole, normalizeRole, getRoleDisplayName } from '../types';
import { Moon, X, Shield, Sparkles, UserCheck, Mail, Star, Crown, Settings, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  availableUsers: User[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  availableUsers,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('free');
  const [activeTab, setActiveTab] = useState<'quick' | 'email'>('quick');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSelectUser = (user: User) => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onLogin(user);
      onClose();
    }, 250);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    // Check if email already exists in available users
    const existing = availableUsers.find(
      (u) => u.email.toLowerCase() === customEmail.trim().toLowerCase()
    );

    if (existing) {
      onLogin(existing);
    } else {
      const normRole = normalizeRole(selectedRole);
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: customEmail.trim(),
        display_name: customName.trim() || customEmail.split('@')[0],
        role: normRole,
        stars: normRole === 'free' ? 2 : 999,
        created_at: new Date().toISOString(),
      };
      onLogin(newUser);
    }
    onClose();
  };

  return (
    <div className="modalback" id="login-modal-backdrop" onClick={onClose}>
      <div
        className="loginbox relative max-w-lg w-full p-6 sm:p-8"
        id="login-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#aab3d2] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="logo" style={{ margin: '0 auto' }}>
          ☾
        </span>

        <h1 style={{ fontSize: 28, marginBottom: 6, marginTop: 14 }} className="text-white font-serif">
          EMAIL 登入 DreamWisdom
        </h1>
        <p className="muted text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-5">
          系統支援一般會員、付費會員、管理員與高級管理員四種權限。登入後你的夢境日誌、DREAM DNA™️ 與分析報告將即時同步。
        </p>

        {/* Tab switch between Quick Demo & Custom Email Form */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'quick'
                ? 'bg-[#aa9cff]/20 text-white font-semibold shadow-sm'
                : 'text-[#aab3d2] hover:text-white'
            }`}
          >
            ⚡ 快速切換 4 種會員等級
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'email'
                ? 'bg-[#aa9cff]/20 text-white font-semibold shadow-sm'
                : 'text-[#aab3d2] hover:text-white'
            }`}
          >
            ✉️ 輸入自訂 EMAIL 登入
          </button>
        </div>

        {activeTab === 'quick' && (
          <div className="space-y-2.5 text-left" id="login-quick-demo-list">
            <div className="text-[11px] text-[#8d97b5] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>點擊一鍵以該等級登入體驗：</span>
              <span className="text-[#78e1b5]">即時生效</span>
            </div>

            {/* 1. 一般會員 */}
            <button
              type="button"
              onClick={() => {
                const freeUser = availableUsers.find((u) => normalizeRole(u.role) === 'free') || {
                  id: 'demo_free',
                  email: 'free.user@gmail.com',
                  display_name: 'Chris (一般會員)',
                  role: 'free',
                  stars: 2,
                };
                handleSelectUser(freeUser);
              }}
              className="w-full p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#ffd27a]/40 transition-all text-left flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400/50" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    一般會員 · free.user@gmail.com
                  </div>
                  <div className="text-[11px] text-[#cbd2ef] mt-0.5">
                    ✨ 特色：<b className="text-amber-300">可透過隨機彈出片儲星星</b>，用星星解鎖進階報告。
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 shrink-0">
                一般會員
              </span>
            </button>

            {/* 2. 付費會員 */}
            <button
              type="button"
              onClick={() => {
                const paidUser = availableUsers.find((u) => normalizeRole(u.role) === 'paid') || {
                  id: 'demo_paid',
                  email: 'pro.dreamer@gmail.com',
                  display_name: 'Elena (付費會員)',
                  role: 'paid',
                  stars: 999,
                };
                handleSelectUser(paidUser);
              }}
              className="w-full p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#78e1b5]/40 transition-all text-left flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#78e1b5]/10 border border-[#78e1b5]/25 flex items-center justify-center text-[#78e1b5] shrink-0 mt-0.5">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#78e1b5] transition-colors">
                    付費會員 · pro.dreamer@gmail.com
                  </div>
                  <div className="text-[11px] text-[#cbd2ef] mt-0.5">
                    ✨ 特色：<b className="text-[#78e1b5]">可直接解鎖使用其他功能</b>，無廣告、免睇片儲星。
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78e1b5]/10 text-[#78e1b5] border border-[#78e1b5]/30 shrink-0">
                付費會員
              </span>
            </button>

            {/* 3. 管理員 */}
            <button
              type="button"
              onClick={() => {
                const adminUser = availableUsers.find((u) => normalizeRole(u.role) === 'admin') || {
                  id: 'demo_admin',
                  email: 'admin@dreamwisdom.com',
                  display_name: 'Alex (內容管理員)',
                  role: 'admin',
                  stars: 999,
                };
                handleSelectUser(adminUser);
              }}
              className="w-full p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#71d9ff]/40 transition-all text-left flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#71d9ff]/10 border border-[#71d9ff]/25 flex items-center justify-center text-[#71d9ff] shrink-0 mt-0.5">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#71d9ff] transition-colors">
                    管理員 · admin@dreamwisdom.com
                  </div>
                  <div className="text-[11px] text-[#cbd2ef] mt-0.5">
                    ✨ 特色：<b className="text-[#71d9ff]">直接解鎖其他功能 + 可管理及修改內容</b>（典籍與語氣）。
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#71d9ff]/10 text-[#71d9ff] border border-[#71d9ff]/30 shrink-0">
                管理員
              </span>
            </button>

            {/* 4. 高級管理員 */}
            <button
              type="button"
              onClick={() => {
                const superUser = availableUsers.find((u) => normalizeRole(u.role) === 'super_admin') || {
                  id: 'demo_super',
                  email: 'mysticblaza@gmail.com',
                  display_name: 'Mystic Blaza',
                  role: 'super_admin',
                  stars: 999,
                };
                handleSelectUser(superUser);
              }}
              className="w-full p-3 rounded-2xl border border-[#aa9cff]/30 bg-[#aa9cff]/[0.06] hover:bg-[#aa9cff]/[0.12] transition-all text-left flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#aa9cff]/20 border border-[#aa9cff]/40 flex items-center justify-center text-[#c3b9ff] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#c3b9ff] transition-colors">
                    高級管理員 · mysticblaza@gmail.com
                  </div>
                  <div className="text-[11px] text-[#cbd2ef] mt-0.5">
                    ✨ 特色：<b className="text-[#c3b9ff]">直接解鎖 + 可管理修改內容 + 可更改會員等級</b>。
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#aa9cff]/20 text-[#c3b9ff] border border-[#aa9cff]/40 shrink-0 font-semibold">
                高級管理員
              </span>
            </button>
          </div>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleCustomLogin} className="space-y-3.5 text-left" id="custom-email-login-form">
            <div>
              <label className="text-xs text-[#cbd2ef] block mb-1">
                電子郵件 (EMAIL) <span className="text-[#ff8b9d]">*</span>
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => {
                  setCustomEmail(e.target.value);
                  // Auto-detect role if matches existing user
                  const match = availableUsers.find(
                    (u) => u.email.toLowerCase() === e.target.value.trim().toLowerCase()
                  );
                  if (match) setSelectedRole(normalizeRole(match.role));
                }}
                placeholder="例如：yourname@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                id="login-input-email"
              />
            </div>

            <div>
              <label className="text-xs text-[#cbd2ef] block mb-1">
                顯示名稱 (可選)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="例如：Dreamer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#aa9cff]"
                id="login-input-name"
              />
            </div>

            <div>
              <label className="text-xs text-[#cbd2ef] block mb-1">
                選擇新註冊之會員等級
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1224] border border-white/20 text-white text-xs focus:outline-none focus:border-[#aa9cff]"
                id="login-select-role"
              >
                <option value="free">🌱 一般會員 (可透過隨機彈出片儲星星)</option>
                <option value="paid">👑 付費會員 (直接解鎖使用其他功能)</option>
                <option value="admin">⚙️ 管理員 (直接解鎖 + 可管理及修改內容)</option>
                <option value="super_admin">🛡️ 高級管理員 (可管理修改內容 + 更改會員等級)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5"
              id="btn-submit-custom-login"
            >
              <span>以所選等級安全登入</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="tiny muted mt-5">
          DreamWisdom 採用無痕本地數據庫模擬，所有等級均可自由切換測試體驗。
        </p>
      </div>
    </div>
  );
};
