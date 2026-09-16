/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, BookBrainItem, EngineSettings, DreamEntry, normalizeRole, getRoleDisplayName } from './types';
import { INITIAL_USERS, INITIAL_BOOKS, INITIAL_SETTINGS, INITIAL_DREAMS } from './data';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { DreamWorkspace } from './components/DreamWorkspace';
import { AdminConsole } from './components/AdminConsole';
import { LoginModal } from './components/LoginModal';
import { StarVideoModal } from './components/StarVideoModal';
import { Sparkles, ShieldAlert, BookOpen, Star } from 'lucide-react';

export default function App() {
  // Load or initialize state from localStorage
  const [currentView, setCurrentView] = useState<'home' | 'app' | 'admin'>('home');
  const [activeSection, setActiveSection] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns'>('workspace');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStarVideoOpen, setIsStarVideoOpen] = useState(false);
  const [prefilledDream, setPrefilledDream] = useState('');

  // Persistent user state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((u) => u.id));
        const merged = [...parsed];
        for (const initialU of INITIAL_USERS) {
          if (!existingIds.has(initialU.id)) {
            merged.push(initialU);
          }
        }
        return merged;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_USERS[0]; // Default to super_admin (Mystic Blaza)
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
  const handleNavigate = (view: 'home' | 'app' | 'admin', section?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns') => {
    setCurrentView(view);
    if (section) {
      setActiveSection(section);
      setTimeout(() => {
        if (section === 'history') {
          document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
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
    setActiveSection('workspace');
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

  const handleUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    if (currentUser) {
      const updatedSelf = newUsers.find((u) => u.id === currentUser.id);
      if (updatedSelf) {
        setCurrentUser(updatedSelf);
      }
    }
  };

  const handleUpdateBooks = (newBooks: BookBrainItem[]) => {
    setBooks(newBooks);
  };

  const handleEarnStar = () => {
    if (!currentUser) return;
    const currentStars = currentUser.stars ?? 0;
    const nextStars = currentStars + 1;
    const updatedUser: User = { ...currentUser, stars: nextStars };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const handleUpdateUserStars = (newStars: number) => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, stars: newStars };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  return (
    <div className="min-h-screen flex flex-col text-[#f6f7ff]" id="dreamwisdom-app-root">
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenEarnStars={() => setIsStarVideoOpen(true)}
      />

      {/* Main View Switcher */}
      {currentView === 'home' && (
        <HomeView
          onStartWithDream={handleStartWithDream}
          onGoToApp={(tab) => {
            if (tab) setActiveSection(tab);
            setCurrentView('app');
          }}
          onGoToAdmin={() => setCurrentView('admin')}
        />
      )}

      {currentView === 'app' && (
        <main className="page shell flex-1" id="app-page-layout">
          <div className="layout">
            <Sidebar
              currentUser={currentUser}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onOpenEarnStars={() => setIsStarVideoOpen(true)}
            />

            <div className="content" id="app-workspace-content">
              <div className="toprow">
                <div>
                  <span className="badge">
                    <Sparkles className="w-3 h-3 text-[#78e1b5]" />
                    PRIVATE DREAM SPACE · 專屬夢境宇宙
                  </span>
                  <h1 style={{ marginTop: 8 }}>
                    你好，{currentUser?.display_name || currentUser?.email?.split('@')[0] || 'Dreamer'}。
                  </h1>
                  <p className="muted text-sm">
                    每一個夢，都是潛意識留給你的信。我們記得你的夢，為你持續累積 Dream DNA™️ 與星圖連線。
                  </p>
                </div>

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="btn dark text-xs cursor-pointer"
                  >
                    EMAIL 登入以同步記錄
                  </button>
                ) : normRole === 'free' ? (
                  <button
                    type="button"
                    onClick={() => setIsStarVideoOpen(true)}
                    className="btn text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>隨機彈出片儲星星</span>
                  </button>
                ) : null}
              </div>

              <DreamWorkspace
                key={activeSection}
                initialHistory={history}
                settings={settings}
                demo={!process.env.GEMINI_API_KEY}
                prefilledDream={prefilledDream}
                initialTab={activeSection === 'patterns' ? 'history' : activeSection}
                currentUser={currentUser}
                onDreamAdded={handleDreamAdded}
                onUpdateUserStars={handleUpdateUserStars}
                onOpenEarnStars={() => setIsStarVideoOpen(true)}
              />
            </div>
          </div>
        </main>
      )}

      {currentView === 'admin' && (
        <main className="page shell flex-1" id="admin-page-layout">
          <div className="layout">
            <Sidebar
              currentUser={currentUser}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onOpenEarnStars={() => setIsStarVideoOpen(true)}
            />

            <div className="content" id="admin-console-content">
              {!isManagement ? (
                <div className="card p-8 text-center space-y-4 max-w-lg mx-auto mt-10" id="admin-access-denied-box">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">需要管理員權限</h2>
                  <p className="text-sm text-muted">
                    目前登入的帳戶 ({currentUser?.email || '未登入'}) 為「{getRoleDisplayName(normRole || 'free')}」權限。
                    進入控制室管理 Book Brain 典籍與 AI 模型參數需管理員或高級管理員權限。
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSwitchUser(INITIAL_USERS[1])}
                      className="btn text-xs"
                    >
                      切換為管理員 (Alex)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchUser(INITIAL_USERS[0])}
                      className="btn text-xs bg-[#aa9cff]/20 text-white border border-[#aa9cff]/40 hover:bg-[#aa9cff]/30"
                    >
                      切換為高級管理員 (Mystic)
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
                        ADMIN CONTROL ROOM · 控制室
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
                    currentUserRole={currentUser.role}
                    onUpdateSettings={handleUpdateSettings}
                    onUpdateUsers={handleUpdateUsers}
                    onUpdateBooks={handleUpdateBooks}
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

      {/* Star Video Earning Modal (for General Members) */}
      <StarVideoModal
        isOpen={isStarVideoOpen}
        onClose={() => setIsStarVideoOpen(false)}
        onEarnStar={handleEarnStar}
        currentStars={currentUser?.stars ?? 2}
      />
    </div>
  );
}
