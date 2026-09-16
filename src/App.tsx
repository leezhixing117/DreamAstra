/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, BookBrainItem, EngineSettings, DreamEntry } from './types';
import { INITIAL_USERS, INITIAL_BOOKS, INITIAL_SETTINGS, INITIAL_DREAMS } from './data';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { DreamWorkspace } from './components/DreamWorkspace';
import { AdminConsole } from './components/AdminConsole';
import { LoginModal } from './components/LoginModal';
import { Sparkles, ShieldAlert, BookOpen } from 'lucide-react';

export default function App() {
  // Load or initialize state from localStorage
  const [currentView, setCurrentView] = useState<'home' | 'app' | 'admin'>('home');
  const [activeSection, setActiveSection] = useState<'workspace' | 'history' | 'patterns'>('workspace');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [prefilledDream, setPrefilledDream] = useState('');

  // Persistent user state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged in as initial admin for immediate full feature access
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [books, setBooks] = useState<BookBrainItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [settings, setSettings] = useState<EngineSettings>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [history, setHistory] = useState<DreamEntry[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_history');
      return saved ? JSON.parse(saved) : INITIAL_DREAMS;
    } catch {
      return INITIAL_DREAMS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('dreamwisdom_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dreamwisdom_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dreamwisdom_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_history', JSON.stringify(history));
  }, [history]);

  // Navigate handler
  const handleNavigate = (view: 'home' | 'app' | 'admin', section?: 'workspace' | 'history' | 'patterns') => {
    setCurrentView(view);
    if (section) {
      setActiveSection(section);
      setTimeout(() => {
        if (section === 'history') {
          document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
        } else if (section === 'patterns') {
          document.getElementById('patterns')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartWithDream = (dreamText: string) => {
    setPrefilledDream(dreamText);
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDreamAdded = (entry: DreamEntry) => {
    setHistory((prev) => [entry, ...prev]);
  };

  const handleUpdateSettings = (newSettings: EngineSettings) => {
    setSettings(newSettings);
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev : [user, ...prev];
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col text-[#f6f7ff]" id="dreamwisdom-app-root">
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Switcher */}
      {currentView === 'home' && (
        <HomeView
          onStartWithDream={handleStartWithDream}
          onGoToApp={() => setCurrentView('app')}
          onGoToAdmin={() => setCurrentView('admin')}
        />
      )}

      {currentView === 'app' && (
        <main className="page shell flex-1" id="app-page-layout">
          <div className="layout">
            <Sidebar
              isAdmin={currentUser?.role === 'admin'}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />

            <div className="content" id="app-workspace-content">
              <div className="toprow">
                <div>
                  <span className="badge">
                    <Sparkles className="w-3 h-3 text-[#78e1b5]" />
                    PRIVATE DREAM SPACE
                  </span>
                  <h1 style={{ marginTop: 8 }}>
                    你好，{currentUser?.display_name || currentUser?.email?.split('@')[0] || 'Dreamer'}。
                  </h1>
                  <p className="muted text-sm">
                    今日記得咩夢？每次報告會自動保存到你的專屬日記，累積後可一鍵進行跨夢境串連分析。
                  </p>
                </div>

                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="btn dark text-xs"
                  >
                    登入以同步記錄
                  </button>
                )}
              </div>

              <DreamWorkspace
                initialHistory={history}
                settings={settings}
                demo={!process.env.GEMINI_API_KEY}
                prefilledDream={prefilledDream}
                onDreamAdded={handleDreamAdded}
              />
            </div>
          </div>
        </main>
      )}

      {currentView === 'admin' && (
        <main className="page shell flex-1" id="admin-page-layout">
          <div className="layout">
            <Sidebar
              isAdmin={true}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />

            <div className="content" id="admin-console-content">
              {currentUser?.role !== 'admin' ? (
                <div className="card p-8 text-center space-y-4 max-w-lg mx-auto mt-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">需要管理員權限</h2>
                  <p className="text-sm text-muted">
                    目前登入的帳戶 ({currentUser?.email || '訪客'}) 為一般會員權限。
                    你可以在下方一鍵切換至預設管理員帳戶 (Boyman) 以管理 Book Brain 與 AI 模型參數。
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSwitchUser(INITIAL_USERS[0])}
                      className="btn text-xs"
                    >
                      切換為管理員 (Boyman)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('app')}
                      className="btn dark text-xs"
                    >
                      返回我的夢境
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="toprow">
                    <div>
                      <span className="badge">
                        <BookOpen className="w-3 h-3 text-[#78e1b5]" />
                        ADMIN CONTROL ROOM
                      </span>
                      <h1 style={{ marginTop: 8 }}>DreamWisdom Control Room</h1>
                      <p className="muted text-sm">
                        Book Brain 典籍知識庫、AI 輸出風格參數、會員權限均在此即時管理。
                      </p>
                    </div>
                  </div>

                  <AdminConsole
                    initialBooks={books}
                    initialUsers={users}
                    initialSettings={settings}
                    currentUserId={currentUser.id}
                    onUpdateSettings={handleUpdateSettings}
                    onSwitchUser={handleSwitchUser}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Global Login / Switch Account Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(user) => {
          handleSwitchUser(user);
          setCurrentView('app');
        }}
        availableUsers={users}
      />
    </div>
  );
}
