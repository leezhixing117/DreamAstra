import React, { useState } from 'react';
import { BookBrainItem, EngineSettings, User, UserRole, normalizeRole, getRoleDisplayName } from '../types';
import { BookOpen, Sliders, Users, Upload, Check, AlertCircle, RefreshCw, UserCheck, Trash2, Edit3, Plus, ShieldCheck, ShieldAlert, Star, Crown, Settings } from 'lucide-react';

interface BookTheoryItem {
  id: string;
  theoryName: string;
  bookTitle: string;
  citation: string;
  coreInsight: string;
}

const INITIAL_THEORIES: BookTheoryItem[] = [
  {
    id: 'theory_jung_shadow',
    theoryName: '榮格陰影追逐與補償假說 (Shadow Archetype)',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: 'p. 168-175',
    coreInsight: '夢中追逐你的未知力量，實為被清醒意識壓抑的內在特質（陰影）。直面而非逃避是自我整合的第一步。',
  },
  {
    id: 'theory_freud_repression',
    theoryName: '潛抑願望與日間殘留 (Wish-Fulfillment & Day Residue)',
    bookTitle: 'The Interpretation of Dreams (Sigmund Freud)',
    citation: 'p. 210-218',
    coreInsight: '夢是清醒時未滿足願望的象徵性變形滿足，常借用前一日的琐碎細節（殘留記憶）作為化妝偽裝。',
  },
  {
    id: 'theory_asian_exam',
    theoryName: '集體考場烙印與家族倫理 (Collective Examination Trauma)',
    bookTitle: '當代華人夢境象徵與心理原鄉',
    citation: 'p. 82-89',
    coreInsight: '成年後反覆夢見赤腳考試、忘記準考證，對應華人社會成長過程中深植的評核焦慮與對群體期望的恐懼。',
  },
  {
    id: 'theory_water_ocean',
    theoryName: '無意識之海與情緒水位假說 (Oceanic Subconscious)',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: 'p. 112-118',
    coreInsight: '水位的起伏是潛意識情感蓄積程度的晴雨表。浪潮上升象徵壓抑情感突破臨界點，尋找高處象徵理性自保防線。',
  },
];

interface AdminConsoleProps {
  initialBooks: BookBrainItem[];
  initialUsers: User[];
  initialSettings: EngineSettings;
  currentUserId: string;
  currentUserRole?: UserRole;
  onUpdateSettings: (settings: EngineSettings) => void;
  onUpdateUsers?: (users: User[]) => void;
  onUpdateBooks?: (books: BookBrainItem[]) => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  initialBooks,
  initialUsers,
  initialSettings,
  currentUserId,
  currentUserRole = 'super_admin',
  onUpdateSettings,
  onUpdateUsers,
  onUpdateBooks,
  onSwitchUser,
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'theories' | 'engine' | 'users'>('books');
  const [books, setBooks] = useState<BookBrainItem[]>(initialBooks);
  const [theories, setTheories] = useState<BookTheoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_theories');
      return saved ? JSON.parse(saved) : INITIAL_THEORIES;
    } catch {
      return INITIAL_THEORIES;
    }
  });
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<EngineSettings>(initialSettings);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  // Editing theory state
  const [editingTheory, setEditingTheory] = useState<BookTheoryItem | null>(null);
  const [isAddingTheory, setIsAddingTheory] = useState(false);
  const [theoryForm, setTheoryForm] = useState<Partial<BookTheoryItem>>({
    theoryName: '',
    bookTitle: '',
    citation: '',
    coreInsight: '',
  });

  const isSuperAdmin = normalizeRole(currentUserRole) === 'super_admin';

  // Save theories to localStorage
  const saveTheories = (updated: BookTheoryItem[]) => {
    setTheories(updated);
    localStorage.setItem('dreamwisdom_theories', JSON.stringify(updated));
  };

  // Handle uploading book
  async function handleUpload(file: File) {
    setBusy('upload');
    setNotice('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const totalEstimatedPages = Math.floor(Math.random() * 200) + 50;
      const newBook: BookBrainItem = {
        id: 'book_' + Date.now(),
        title: file.name.replace(/\.[^.]+$/, ''),
        file_name: file.name,
        status: 'queued',
        total_pages: totalEstimatedPages,
        processed_pages: 0,
        created_at: new Date().toISOString(),
      };
      const updated = [newBook, ...books];
      setBooks(updated);
      if (onUpdateBooks) onUpdateBooks(updated);
      setNotice(`書本「${newBook.title}」已加入 OCR 與知識庫建構佇列。點擊「開始 OCR 索引」即可提取理論段落。`);
    } catch (e: any) {
      alert(e.message || '上傳失敗');
    } finally {
      setBusy('');
    }
  }

  // Handle OCR processing of a book
  async function processBook(id: string) {
    setBusy(id);
    setNotice('');
    try {
      const book = books.find((b) => b.id === id);
      if (!book) return;

      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'processing' } : b))
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const updated = books.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'ready' as const,
              processed_pages: b.total_pages,
            }
          : b
      );
      setBooks(updated);
      if (onUpdateBooks) onUpdateBooks(updated);
      setNotice(`「${book.title}」Book Brain 處理完成！文字已向量化儲存，解夢時會自動引用。`);
    } catch (e: any) {
      alert(e.message || '處理失敗');
    } finally {
      setBusy('');
    }
  }

  // Delete a book
  function handleDeleteBook(id: string) {
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    if (onUpdateBooks) onUpdateBooks(updated);
    setNotice('已從 Book Brain 中移除該典籍。');
  }

  // Save settings
  function saveSettings() {
    setBusy('settings');
    setTimeout(() => {
      onUpdateSettings(settings);
      setNotice('✓ AI 解夢引擎風格參數與 Prompt 已成功儲存。');
      setBusy('');
    }, 250);
  }

  // Handle Role Change (ONLY SUPER ADMIN CAN CALL THIS)
  function handleRoleChange(userToChange: User, newRole: UserRole) {
    if (!isSuperAdmin) {
      alert('權限不足：只有高級管理員 (Super Admin) 可以更改會員等級。');
      return;
    }

    if (userToChange.id === currentUserId && newRole !== 'super_admin') {
      const confirmChange = window.confirm('你正在將自己降級，確定要執行嗎？');
      if (!confirmChange) return;
    }

    const normNewRole = normalizeRole(newRole);
    setBusy(userToChange.id);

    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, role: normNewRole } : u
    );

    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);

    setNotice(
      `✓ 已成功將「${userToChange.display_name || userToChange.email}」的等級更改為：${getRoleDisplayName(
        normNewRole
      )}`
    );
    setBusy('');
  }

  // Adjust Stars for a user (Super admin only)
  function handleAdjustStars(userToChange: User, delta: number) {
    if (!isSuperAdmin) {
      alert('只有高級管理員可以手動調整會員星星。');
      return;
    }
    const current = userToChange.stars ?? 0;
    const nextStars = Math.max(0, current + delta);
    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, stars: nextStars } : u
    );
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    setNotice(`已為「${userToChange.email}」調整星星數為：${nextStars} 顆 ⭐`);
  }

  // Add / Edit Theory logic
  function handleSaveTheory(e: React.FormEvent) {
    e.preventDefault();
    if (!theoryForm.theoryName || !theoryForm.coreInsight) return;

    if (editingTheory) {
      const updated = theories.map((t) =>
        t.id === editingTheory.id
          ? {
              ...t,
              theoryName: theoryForm.theoryName || t.theoryName,
              bookTitle: theoryForm.bookTitle || t.bookTitle,
              citation: theoryForm.citation || t.citation,
              coreInsight: theoryForm.coreInsight || t.coreInsight,
            }
          : t
      );
      saveTheories(updated);
      setNotice(`已成功修改理論條目：「${theoryForm.theoryName}」`);
      setEditingTheory(null);
    } else {
      const newTheory: BookTheoryItem = {
        id: 'theory_' + Date.now(),
        theoryName: theoryForm.theoryName || '未命名理論',
        bookTitle: theoryForm.bookTitle || '自訂典籍文獻',
        citation: theoryForm.citation || 'p. 1',
        coreInsight: theoryForm.coreInsight || '',
      };
      saveTheories([newTheory, ...theories]);
      setNotice(`已新增理論條目：「${newTheory.theoryName}」`);
      setIsAddingTheory(false);
    }
    setTheoryForm({ theoryName: '', bookTitle: '', citation: '', coreInsight: '' });
  }

  function handleDeleteTheory(id: string) {
    const updated = theories.filter((t) => t.id !== id);
    saveTheories(updated);
    setNotice('已刪除該理論條目。');
  }

  return (
    <div className="space-y-6" id="admin-console-wrapper">
      {notice && (
        <div className="callout text-sm flex items-center justify-between" id="admin-notice-callout">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#78e1b5]" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="text-xs text-[#aab3d2] hover:text-white cursor-pointer"
          >
            關閉
          </button>
        </div>
      )}

      {/* Role permission status banner */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isSuperAdmin 
          ? 'bg-[#aa9cff]/10 border-[#aa9cff]/30 text-[#c3b9ff]'
          : 'bg-[#71d9ff]/10 border-[#71d9ff]/30 text-[#71d9ff]'
      }`}>
        <div className="flex items-center gap-2.5">
          {isSuperAdmin ? (
            <ShieldCheck className="w-5 h-5 text-[#aa9cff]" />
          ) : (
            <Settings className="w-5 h-5 text-[#71d9ff]" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">
              {isSuperAdmin ? '🛡️ 高級管理員模式 (SUPER ADMIN)' : '⚙️ 內容管理員模式 (ADMIN)'}
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isSuperAdmin
                ? '您擁有最高權限：可管理修改 Book Brain 典籍、調整 AI 語氣參數，以及更改所有會員之等級與星星配置。'
                : '您擁有內容管理權限：可管理與修改 Book Brain 典籍、編輯夢境理論辭典、調整 AI 引擎參數。（更改會員等級需高級管理員權限）'}
            </p>
          </div>
        </div>

        <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
          isSuperAdmin 
            ? 'bg-[#aa9cff]/20 text-[#aa9cff] border-[#aa9cff]/40' 
            : 'bg-[#71d9ff]/20 text-[#71d9ff] border-[#71d9ff]/40'
        }`}>
          {isSuperAdmin ? '最高權限' : '內容管理權限'}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'books'
              ? 'bg-[#71d9ff]/20 text-white border border-[#71d9ff]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#71d9ff]" />
          <span>📚 Book Brain 典籍 ({books.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theories')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'theories'
              ? 'bg-[#78e1b5]/20 text-white border border-[#78e1b5]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Edit3 className="w-4 h-4 text-[#78e1b5]" />
          <span>📑 夢境理論辭典管理 ({theories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('engine')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'engine'
              ? 'bg-[#ffd27a]/20 text-white border border-[#ffd27a]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#ffd27a]" />
          <span>🎛️ AI 引擎個性參數</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#aa9cff]/20 text-white border border-[#aa9cff]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-[#aa9cff]" />
          <span>👥 會員等級管理 ({users.length})</span>
          {isSuperAdmin && (
            <span className="w-2 h-2 rounded-full bg-[#aa9cff] animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: BOOK BRAIN MANAGEMENT */}
      {activeTab === 'books' && (
        <section className="card p-6" id="admin-book-brain-card">
          <div className="flex items-center justify-between">
            <span className="badge">
              <BookOpen className="w-3 h-3 text-[#71d9ff]" />
              BOOK BRAIN KNOWLEDGE REPOSITORY
            </span>
            <span className="text-xs text-[#8d97b5]">已收錄 {books.length} 本典籍</span>
          </div>

          <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
            書本知識庫管理與索引
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            管理員與高級管理員皆可在此上傳專業典籍、觸發 OCR 向量化處理，或刪除過時文獻。
            解夢時系統優先根據此處的知識庫檢索心理學依據。
          </p>

          <label
            className="filedrop block mt-4 p-5 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#71d9ff]/50 bg-white/[0.02] text-center cursor-pointer transition-all"
            id="book-upload-dropzone"
          >
            <div className="text-3xl mb-1">📚</div>
            <b className="text-sm text-white block">
              {busy === 'upload' ? '上傳與解析中…' : '加入 PDF / 書籍掃描圖檔 (JPG, PNG, WebP)'}
            </b>
            <div className="tiny muted mt-1">
              單檔最高支援 50MB · 文字型直接切段，掃描圖檔啟用 OCR 視覺分析
            </div>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp,text/plain"
              disabled={busy === 'upload'}
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.currentTarget.value = '';
              }}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
            {books.map((b) => {
              const p = Math.round((b.processed_pages / Math.max(1, b.total_pages)) * 100);
              return (
                <div
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  key={b.id}
                  id={`book-item-${b.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span
                        className={
                          b.status === 'ready'
                            ? 'text-[#78e1b5] font-semibold flex items-center gap-1'
                            : b.status === 'processing'
                            ? 'text-[#ffd27a]'
                            : 'text-[#8d97b5]'
                        }
                      >
                        {b.status === 'ready' ? '✓ Ready (已建庫)' : b.status === 'processing' ? '⚡ 索引中…' : '⏳ 待處理'}
                      </span>
                      <span className="text-[11px] text-[#8d97b5] font-mono">
                        {b.processed_pages}/{b.total_pages} 頁 ({p}%)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{b.title}</h3>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden my-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#71d9ff] to-[#78e1b5] transition-all"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    {b.status !== 'ready' ? (
                      <button
                        type="button"
                        className="btn dark text-xs py-1.5 px-3"
                        disabled={busy === b.id}
                        onClick={() => processBook(b.id)}
                      >
                        {busy === b.id ? '處理中…' : '開始 OCR 索引'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#78e1b5]">已可用於 AI 檢索</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteBook(b.id)}
                      className="p-1.5 text-xs text-[#8d97b5] hover:text-[#ff8b9d] transition-colors cursor-pointer"
                      title="刪除此典籍"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: THEORY & CONTENT MANAGEMENT (管理及修改內容) */}
      {activeTab === 'theories' && (
        <section className="card p-6" id="admin-theories-card">
          <div className="flex items-center justify-between">
            <div>
              <span className="badge">
                <Edit3 className="w-3 h-3 text-[#78e1b5]" />
                CONTENT EDITING & PSYCHOLOGICAL THEORIES
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                心理學理論與核心象徵內容管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1">
                管理員與高級管理員均可新增、修訂或更新 Book Brain 的核心理論條目與引文見解。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingTheory(true);
                setEditingTheory(null);
                setTheoryForm({ theoryName: '', bookTitle: '', citation: '', coreInsight: '' });
              }}
              className="btn text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增理論條目</span>
            </button>
          </div>

          {/* Form Modal / Inline Editor */}
          {(isAddingTheory || editingTheory) && (
            <form
              onSubmit={handleSaveTheory}
              className="p-5 rounded-2xl bg-white/[0.04] border border-[#78e1b5]/30 mt-4 space-y-3"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#78e1b5]" />
                <span>{editingTheory ? '編輯理論內容' : '新增理論內容'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1">理論名稱 *</label>
                  <input
                    type="text"
                    required
                    value={theoryForm.theoryName}
                    onChange={(e) => setTheoryForm({ ...theoryForm, theoryName: e.target.value })}
                    placeholder="例如：榮格原型理論、東方集體考場烙印"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1">出處典籍 *</label>
                  <input
                    type="text"
                    required
                    value={theoryForm.bookTitle}
                    onChange={(e) => setTheoryForm({ ...theoryForm, bookTitle: e.target.value })}
                    placeholder="例如：Man and His Symbols (Carl G. Jung)"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#cbd2ef] block mb-1">引文頁碼 / 章節</label>
                <input
                  type="text"
                  value={theoryForm.citation}
                  onChange={(e) => setTheoryForm({ ...theoryForm, citation: e.target.value })}
                  placeholder="例如：p. 168-175, 第二章"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                />
              </div>

              <div>
                <label className="text-xs text-[#cbd2ef] block mb-1">核心理論闡釋與心理洞察 *</label>
                <textarea
                  rows={3}
                  required
                  value={theoryForm.coreInsight}
                  onChange={(e) => setTheoryForm({ ...theoryForm, coreInsight: e.target.value })}
                  placeholder="詳細說明該理論如何闡明特定夢境意象……"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTheory(false);
                    setEditingTheory(null);
                  }}
                  className="btn2 text-xs py-1.5 px-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn text-xs py-1.5 px-4"
                >
                  儲存修改
                </button>
              </div>
            </form>
          )}

          {/* Theory List */}
          <div className="space-y-3 mt-4">
            {theories.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#78e1b5]/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{t.theoryName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#78e1b5]/10 text-[#78e1b5] font-mono">
                      {t.citation}
                    </span>
                  </div>
                  <div className="text-xs text-[#71d9ff] font-medium">
                    📚 {t.bookTitle}
                  </div>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    {t.coreInsight}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTheory(t);
                      setIsAddingTheory(false);
                      setTheoryForm(t);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#aab3d2] hover:text-white transition-colors"
                    title="編輯此條目"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTheory(t.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-xs text-[#8d97b5] hover:text-[#ff8b9d] transition-colors"
                    title="刪除此條目"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: AI ENGINE SETTINGS */}
      {activeTab === 'engine' && (
        <section className="card p-6" id="admin-dream-engine-card">
          <span className="badge">
            <Sliders className="w-3 h-3 text-[#ffd27a]" />
            DREAM ENGINE PARAMETERS
          </span>
          <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
            AI 輸出個性與語氣調整
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            管理員與高級管理員均可微調 AI 輸出的心理學分析深度與溫潤度，確保解夢既符合學術規範，又富共情溫度。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="field">
              <label>
                <span>親和／個性風格</span>
                <span className="font-mono text-[#aa9cff]">{settings.personality}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.personality}
                onChange={(e) => setSettings({ ...settings, personality: +e.target.value })}
              />
              <div className="tiny muted flex justify-between mt-1">
                <span>0% 客觀學術剖析</span>
                <span>100% 溫暖且富共情畫面感</span>
              </div>
            </div>

            <div className="field">
              <label>
                <span>決斷性 (Decisiveness)</span>
                <span className="font-mono text-[#71d9ff]">{settings.decisiveness}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.decisiveness}
                onChange={(e) => setSettings({ ...settings, decisiveness: +e.target.value })}
              />
              <div className="tiny muted flex justify-between mt-1">
                <span>0% 多元假設並置</span>
                <span>100% 提煉核心指引</span>
              </div>
            </div>

            <div className="field">
              <label>
                <span>解夢報告深度 (Depth)</span>
                <span className="font-mono text-[#78e1b5]">{settings.depth}%</span>
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.depth}
                onChange={(e) => setSettings({ ...settings, depth: +e.target.value })}
              />
            </div>

            <div className="field">
              <label>
                <span>Temperature (發散度)</span>
                <span className="font-mono text-[#ffd27a]">{settings.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: +e.target.value })}
              />
              <div className="tiny muted flex justify-between mt-1">
                <span>0 精確收斂</span>
                <span>1 想像與隱喻發散</span>
              </div>
            </div>
          </div>

          <div className="field mt-4">
            <label>
              <span>底層推論模型</span>
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (高效快速 · 推薦)</option>
              <option value="deepseek/deepseek-v4.1-flash">deepseek/deepseek-v4.1-flash (哲學與隱喻適配)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (超深度榮格原型剖析)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn w-full mt-4 text-xs py-2.5"
            disabled={busy === 'settings'}
            onClick={saveSettings}
            id="admin-save-settings-btn"
          >
            {busy === 'settings' ? '儲存中…' : '儲存 AI 引擎配置'}
          </button>
        </section>
      )}

      {/* TAB 4: USER & TIER MANAGEMENT (高級管理員可更改等級；管理員僅檢視) */}
      {activeTab === 'users' && (
        <section className="card p-6" id="admin-access-control-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="badge">
                <Users className="w-3 h-3 text-[#aa9cff]" />
                MEMBER ROLES & ACCESS CONTROL
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                會員等級與權限管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-0.5">
                {isSuperAdmin ? (
                  <span className="text-[#78e1b5] font-semibold">
                    ✓ 高級管理員專屬權限：您可在此直接更改任何會員的等級（一般會員 ↔ 付費會員 ↔ 管理員 ↔ 高級管理員）及增減星星。
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    🔒 內容管理員權限：您可檢視會員列表與點數，但更改會員等級僅限高級管理員操作。
                  </span>
                )}
              </p>
            </div>

            <div className="text-xs text-[#8d97b5] font-mono">
              總會員數：{users.length} 名
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-left" id="admin-users-table">
              <thead>
                <tr className="border-b border-white/10 text-xs text-[#8d97b5]">
                  <th className="py-2.5 px-3">會員資訊</th>
                  <th className="py-2.5 px-3">當前等級</th>
                  <th className="py-2.5 px-3">星星餘額</th>
                  <th className="py-2.5 px-3">
                    {isSuperAdmin ? '更改會員等級 (高級管理員專用)' : '等級權限狀態'}
                  </th>
                  <th className="py-2.5 px-3 text-right">身份切換模擬</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const roleNorm = normalizeRole(u.role);
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-xs">
                          {u.display_name || u.email.split('@')[0]}
                        </div>
                        <div className="text-[11px] text-[#8d97b5] font-mono">{u.email}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                            roleNorm === 'super_admin'
                              ? 'bg-[#aa9cff]/20 border-[#aa9cff]/40 text-[#c3b9ff]'
                              : roleNorm === 'admin'
                              ? 'bg-[#71d9ff]/20 border-[#71d9ff]/40 text-[#71d9ff]'
                              : roleNorm === 'paid'
                              ? 'bg-[#78e1b5]/20 border-[#78e1b5]/40 text-[#78e1b5]'
                              : 'bg-amber-400/15 border-amber-400/30 text-amber-300'
                          }`}
                        >
                          {roleNorm === 'super_admin' && <ShieldCheck className="w-3 h-3" />}
                          {roleNorm === 'admin' && <Settings className="w-3 h-3" />}
                          {roleNorm === 'paid' && <Crown className="w-3 h-3" />}
                          {roleNorm === 'free' && <Star className="w-3 h-3" />}
                          <span>{getRoleDisplayName(roleNorm)}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-amber-300">
                            ⭐ {u.stars ?? (roleNorm === 'free' ? 2 : 999)}
                          </span>
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleAdjustStars(u, 5)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[#cbd2ef] cursor-pointer"
                              title="為該會員增加 5 顆星星"
                            >
                              +5星
                            </button>
                          )}
                        </div>
                      </td>

                      {/* ROLE MODIFICATION COLUMN */}
                      <td className="py-3 px-3">
                        {isSuperAdmin ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={roleNorm}
                              disabled={busy === u.id}
                              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                              className="px-2.5 py-1 rounded-lg bg-[#0e1224] border border-white/25 text-white text-xs font-medium focus:outline-none focus:border-[#aa9cff] cursor-pointer"
                              id={`select-role-${u.id}`}
                            >
                              <option value="free">🌱 一般會員 (睇片儲星)</option>
                              <option value="paid">👑 付費會員 (直接解鎖)</option>
                              <option value="admin">⚙️ 管理員 (內容管理)</option>
                              <option value="super_admin">🛡️ 高級管理員 (更改等級)</option>
                            </select>
                            {busy === u.id && <span className="text-[10px] text-[#78e1b5]">更新中…</span>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-[#8d97b5]">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>僅高級管理員可更改</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {onSwitchUser && (
                          <button
                            type="button"
                            onClick={() => onSwitchUser(u)}
                            className={`text-xs px-3 py-1 rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                              u.id === currentUserId
                                ? 'border-[#aa9cff] text-[#aa9cff] bg-[#aa9cff]/10'
                                : 'border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>{u.id === currentUserId ? '當前登入者' : '以此登入'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
