import React, { useState } from 'react';
import { User } from '../types';
import { Moon, X, Shield, Sparkles, UserCheck } from 'lucide-react';

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
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = (chosenUser?: User) => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (chosenUser) {
        onLogin(chosenUser);
      } else {
        // Default to admin or first available user
        const defaultUser = availableUsers[0] || {
          id: 'user_' + Date.now(),
          email: 'dreamer@gmail.com',
          display_name: 'Dreamer',
          role: 'user',
        };
        onLogin(defaultUser);
      }
      onClose();
    }, 400);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const role = customEmail.toLowerCase().includes('admin') || customEmail.toLowerCase() === 'boyman131418@gmail.com' ? 'admin' : 'user';
    const newUser: User = {
      id: 'custom_' + Date.now(),
      email: customEmail,
      display_name: customName || customEmail.split('@')[0],
      role,
      created_at: new Date().toISOString(),
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="modalback" id="login-modal-backdrop" onClick={onClose}>
      <div
        className="loginbox relative"
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

        <h1 style={{ fontSize: 32, marginBottom: 8, marginTop: 14 }}>登入 DreamWisdom</h1>
        <p className="muted text-sm leading-relaxed">
          用 Google 登入後，你每次嘅夢境、解讀報告同長期 Dream Pattern 都會保存到私人帳戶。
        </p>

        {/* Primary One-Click Google Login */}
        <button
          type="button"
          className="googlebtn"
          onClick={() => handleGoogleLogin(availableUsers[0])}
          disabled={busy}
          id="btn-google-login-action"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="text-sm">
            {busy ? '正在安全連接 Google…' : '使用 Google 帳戶一鍵登入'}
          </span>
        </button>

        {/* Quick Demo Switcher Accounts */}
        <div className="mt-6 pt-5 border-t border-white/10 text-left">
          <div className="text-xs text-[#8d97b5] uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>快速測試帳戶 (Demo Mode)</span>
            <span className="text-[#78e1b5]">即點即用</span>
          </div>

          <div className="space-y-2">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleGoogleLogin(u)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-xs text-left"
              >
                <div>
                  <div className="font-semibold text-white">
                    {u.display_name || u.email}
                  </div>
                  <div className="text-[#8d97b5]">{u.email}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[11px] ${
                    u.role === 'admin'
                      ? 'bg-[#aa9cff]/20 text-[#c3b9ff] border-[#aa9cff]/30'
                      : 'bg-white/5 text-muted border-white/10'
                  }`}
                >
                  {u.role === 'admin' ? '⚙️ 管理員' : '一般會員'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="tiny muted mt-6">
          DreamWisdom 不會要求 Google Drive、Gmail 等額外權限，只需要基本身份與電郵。
        </p>
      </div>
    </div>
  );
};
