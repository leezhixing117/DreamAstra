/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, BookBrainItem, EngineSettings, DreamEntry, AdVideoItem, TherapistItem, ProductItem, normalizeRole, getRoleDisplayName } from './types';
import { INITIAL_USERS, INITIAL_BOOKS, INITIAL_SETTINGS, INITIAL_DREAMS, INITIAL_AD_VIDEOS } from './data';
import { INITIAL_THERAPISTS } from './data/therapists';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { DreamWorkspace } from './components/DreamWorkspace';
import { AdminConsole } from './components/AdminConsole';
import { LoginModal } from './components/LoginModal';
import { StarVideoModal } from './components/StarVideoModal';
import { PricingView } from './components/PricingView';
import { PrivacyView } from './components/PrivacyView';
import { ProductStoreView } from './components/ProductStoreView';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS } from './data/products';
import { Sparkles, ShieldAlert, BookOpen, Star, Package, Tv } from 'lucide-react';
import { DreamAtmosphereController } from './components/DreamAtmosphereController';

export default function App() {
  // Load or initialize state from localStorage
  const [currentView, setCurrentView] = useState<'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin'>('home');
  const [activeSection, setActiveSection] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns'>('workspace');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStarVideoOpen, setIsStarVideoOpen] = useState(false);
  const [prefilledDream, setPrefilledDream] = useState('');
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);

  // Full-screen Dream Atmosphere & Wallpaper state
  const [wallpaperOpacity, setWallpaperOpacity] = useState<number>(0.72);
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
  const [wallpaperTint, setWallpaperTint] = useState<'aurora' | 'twilight' | 'cyber' | 'deep'>('aurora');


  // Products catalog state
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Advertisement & Sponsor Videos Catalog State
  const [adVideos, setAdVideos] = useState<AdVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_ad_videos');
      return saved ? JSON.parse(saved) : INITIAL_AD_VIDEOS;
    } catch {
      return INITIAL_AD_VIDEOS;
    }
  });

  // Therapist Directory state
  const [therapists, setTherapists] = useState<TherapistItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_therapists');
      return saved ? JSON.parse(saved) : INITIAL_THERAPISTS;
    } catch {
      return INITIAL_THERAPISTS;
    }
  });

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

  // Load data from Backend PostgreSQL Database on mount
  useEffect(() => {
    async function loadDataFromDb() {
      try {
        const dreamsRes = await fetch('/api/dreams');
        if (dreamsRes.ok) {
          const dreamsData = await dreamsRes.json();
          if (Array.isArray(dreamsData.dreams) && dreamsData.dreams.length > 0) {
            setHistory(dreamsData.dreams);
          }
        }
      } catch (err) {
        console.warn('Could not fetch dreams from db, using local fallback', err);
      }

      try {
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData.users) && usersData.users.length > 0) {
            setUsers(usersData.users);
          }
        }
      } catch (err) {
        console.warn('Could not fetch users from db', err);
      }

      try {
        const booksRes = await fetch('/api/books');
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          if (Array.isArray(booksData.books) && booksData.books.length > 0) {
            setBooks(booksData.books);
          }
        }
      } catch (err) {
        console.warn('Could not fetch books from db', err);
      }

      try {
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            setSettings(settingsData.settings);
          }
        }
      } catch (err) {
        console.warn('Could not fetch settings from db', err);
      }
    }

    loadDataFromDb();
  }, []);

  // Save changes to localStorage as offline safety
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

  useEffect(() => {
    localStorage.setItem('dreamwisdom_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_ad_videos', JSON.stringify(adVideos));
  }, [adVideos]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_therapists', JSON.stringify(therapists));
  }, [therapists]);

  // Navigate handler
  const handleNavigate = (
    view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin',
    section?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns'
  ) => {
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

  const handleDreamAdded = async (entry: DreamEntry) => {
    setHistory((prev) => [entry, ...prev]);
    try {
      await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: entry.id,
          title: entry.title,
          dream_text: entry.dream_text,
          report_json: entry.report_json,
          tags: entry.tags || [],
          rawCantoneseTranscription: entry.rawCantoneseTranscription,
        }),
      });
    } catch (e) {
      console.warn('Failed to sync new dream to Postgres', e);
    }
  };

  const handleUpdateSettings = async (newSettings: EngineSettings) => {
    setSettings(newSettings);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
    } catch (e) {
      console.warn('Failed to sync settings to db', e);
    }
  };

  const handleSwitchUser = async (user: User) => {
    setCurrentUser(user);
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev];
    });

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    } catch (e) {
      console.warn('Failed to sync user to db', e);
    }
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

  // Quota exchange with Star Coins (free users)
  const handleExchangeQuota = (starsCost: number, quotaToAdd: number) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    const currentStars = currentUser.stars ?? 2;
    if (currentStars < starsCost) {
      setIsStarVideoOpen(true);
      return;
    }
    const currentQuota = currentUser.storage_quota || 3;
    const newQuota = Math.min(10, currentQuota + quotaToAdd);
    const newStars = currentStars - starsCost;

    const updatedUser: User = {
      ...currentUser,
      stars: newStars,
      storage_quota: newQuota,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Upgrade to paid membership
  const handleUpgradeToPaid = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    const updatedUser: User = {
      ...currentUser,
      role: 'paid',
      storage_quota: 99999,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Clear all dream records (Privacy right)
  const handleClearAllDreams = () => {
    setHistory([]);
    localStorage.removeItem('dreamwisdom_history');
  };

  // Toggle local-only mode
  const handleToggleLocalOnly = (localOnly: boolean) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      privacy_local_only: localOnly,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  // Dynamic tint gradient based on user selection
  const tintGradient = {
    aurora: 'from-[#060814]/40 via-[#0a1226]/30 to-[#060917]/60',
    twilight: 'from-[#0e0717]/40 via-[#140b20]/30 to-[#070510]/60',
    cyber: 'from-[#080d20]/40 via-[#0c142c]/30 to-[#050814]/60',
    deep: 'from-[#030610]/45 via-[#050e1e]/35 to-[#02040c]/65',
  }[wallpaperTint];

  return (
    <div className="min-h-screen flex flex-col text-[#f6f7ff] relative selection:bg-[#aa9cff]/30 selection:text-white" id="dreamwisdom-app-root">
      {/* 🌟 IMMERSIVE FULL-PAGE DREAMSCAPE COVER WALLPAPER LAYER 🌟 */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-700"
        id="app-fullpage-dream-cover"
        style={{
          opacity: wallpaperOpacity,
        }}
      >
        <img
          src="/dream_cover_banner.jpg"
          alt="Dreamscape Universe Full-Page Cover"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700"
          style={{
            filter: wallpaperBlur > 0 ? `blur(${wallpaperBlur}px) saturate(140%)` : 'saturate(140%)',
            transform: 'scale(1.02)',
          }}
        />
        {/* Dynamic Aesthetic Tint Gradient - subtle to let artwork shine */}
        <div className={`absolute inset-0 bg-gradient-to-b ${tintGradient}`} />
        {/* Radial Vignette for cinematic focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,8,16,0.35)_70%,rgba(5,7,14,0.75)_100%)]" />
      </div>

      {/* Atmospheric dynamic floating ambient glows for extra modern vibe */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-[#aa9cff]/15 rounded-full blur-[140px] pointer-events-none -z-10 glow-ambient-orb" />
      <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-[#71d9ff]/12 rounded-full blur-[150px] pointer-events-none -z-10 glow-ambient-orb" style={{ animationDelay: '-5s' }} />

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
          onGoToPricing={() => handleNavigate('pricing')}
          onGoToPrivacy={() => handleNavigate('privacy')}
          therapists={therapists}
        />
      )}

      {currentView === 'pricing' && (
        <PricingView
          currentUser={currentUser}
          currentStoredDreamsCount={history.length}
          onOpenEarnStars={() => setIsStarVideoOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onUpgradeToPaid={handleUpgradeToPaid}
          onExchangeQuota={handleExchangeQuota}
          onGoToWorkspace={() => handleNavigate('app', 'workspace')}
        />
      )}

      {currentView === 'privacy' && (
        <PrivacyView
          currentUser={currentUser}
          currentStoredDreamsCount={history.length}
          onClearAllData={handleClearAllDreams}
          onToggleLocalOnly={handleToggleLocalOnly}
          onGoBack={() => handleNavigate('home')}
        />
      )}

      {currentView === 'store' && (
        <ProductStoreView
          products={products}
          currentUser={currentUser}
          recommendedProductId={targetProductId}
          currentDreamSummary={history[0]?.dream_text?.slice(0, 100)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenEarnStars={() => setIsStarVideoOpen(true)}
          onUpdateUserStars={handleUpdateUserStars}
          onNavigateToWorkspace={() => handleNavigate('app', 'workspace')}
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
                onGoToPricing={() => handleNavigate('pricing')}
                onGoToStore={(prodId) => {
                  setTargetProductId(prodId);
                  handleNavigate('store');
                }}
                therapists={therapists}
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
                    initialProducts={products}
                    initialAdVideos={adVideos}
                    initialTherapists={therapists}
                    currentUserId={currentUser.id}
                    currentUserRole={currentUser.role}
                    onUpdateSettings={handleUpdateSettings}
                    onUpdateUsers={handleUpdateUsers}
                    onUpdateBooks={handleUpdateBooks}
                    onUpdateProducts={(updated) => setProducts(updated)}
                    onUpdateAdVideos={(updated) => setAdVideos(updated)}
                    onUpdateTherapists={(updated) => setTherapists(updated)}
                    onSwitchUser={handleSwitchUser}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Global Site Footer */}
      <Footer onNavigate={handleNavigate} />

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
        adVideos={adVideos}
      />

      {/* Floating Atmosphere Customizer Widget */}
      <DreamAtmosphereController
        opacity={wallpaperOpacity}
        setOpacity={setWallpaperOpacity}
        blur={wallpaperBlur}
        setBlur={setWallpaperBlur}
        tint={wallpaperTint}
        setTint={setWallpaperTint}
      />
    </div>
  );
}

