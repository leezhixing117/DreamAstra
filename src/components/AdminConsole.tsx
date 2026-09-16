import React, { useState } from 'react';
import { BookBrainItem, EngineSettings, User } from '../types';
import { BookOpen, Sliders, Users, Upload, Check, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';

interface AdminConsoleProps {
  initialBooks: BookBrainItem[];
  initialUsers: User[];
  initialSettings: EngineSettings;
  currentUserId: string;
  onUpdateSettings: (settings: EngineSettings) => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  initialBooks,
  initialUsers,
  initialSettings,
  currentUserId,
  onUpdateSettings,
  onSwitchUser,
}) => {
  const [books, setBooks] = useState<BookBrainItem[]>(initialBooks);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<EngineSettings>(initialSettings);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  // Handle uploading book
  async function handleUpload(file: File) {
    setBusy('upload');
    setNotice('');
    try {
      // Simulate real OCR queue and book indexing
      await new Promise((resolve) => setTimeout(resolve, 600));
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
      setBooks([newBook, ...books]);
      setNotice(`書本「${newBook.title}」已加入 OCR 與知識庫建構佇列。點擊下方按鈕可開始提取段落。`);
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

      // Incrementally advance processed pages for visual feedback
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'processing' } : b))
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      setBooks((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: 'ready',
                processed_pages: b.total_pages,
              }
            : b
        )
      );

      setNotice(`「${book.title}」Book Brain 處理完成！文字已向量化儲存，之後解夢會自動檢索相關心理學段落。`);
    } catch (e: any) {
      alert(e.message || '處理失敗');
    } finally {
      setBusy('');
    }
  }

  // Save settings
  function saveSettings() {
    setBusy('settings');
    setTimeout(() => {
      onUpdateSettings(settings);
      setNotice('✓ AI 解夢引擎個性與參數已成功儲存。');
      setBusy('');
    }, 300);
  }

  // Toggle user role
  function toggleRole(u: User) {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (u.id === currentUserId && newRole === 'user') {
      alert('你不能取消自己目前的管理員權限。');
      return;
    }

    setBusy(u.id);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((item) => (item.id === u.id ? { ...item, role: newRole } : item))
      );
      setNotice(`${u.email} 的權限已更新為 ${newRole === 'admin' ? '管理員 (Admin)' : '一般會員 (User)'}。`);
      setBusy('');
    }, 200);
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
            className="text-xs text-[#aab3d2] hover:text-white"
          >
            關閉
          </button>
        </div>
      )}

      <div className="adminGrid">
        {/* Book Brain Section */}
        <section className="card" id="admin-book-brain-card">
          <div className="flex items-center justify-between">
            <span className="badge">
              <BookOpen className="w-3 h-3" />
              BOOK BRAIN
            </span>
            <span className="text-xs text-[#8d97b5]">已收錄 {books.length} 本典籍</span>
          </div>

          <h2 style={{ fontSize: 26, marginTop: 12 }}>書本知識庫</h2>
          <p className="text-sm">
            只有管理員可以上傳。文字型 PDF 直接抽取；掃描頁面會使用 OCR 視覺辨識。
            每頁切成段落並建立語意向量，解夢時自動檢索最相關理論。
          </p>

          <label
            className="filedrop"
            style={{ display: 'block', marginTop: 18, cursor: 'pointer' }}
            id="book-upload-dropzone"
          >
            <div className="text-3xl mb-1">📚</div>
            <b className="text-sm text-white">
              {busy === 'upload' ? '上傳與解析中…' : '加入 PDF / 書籍掃描圖檔 (JPG, PNG, WebP)'}
            </b>
            <div className="tiny muted" style={{ marginTop: 6 }}>
              MVP 每本最高支援 50MB
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

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            {books.length === 0 && (
              <div className="muted tiny text-center py-4">未有書本。上傳第一本書後，Book Brain 才有根據可檢索。</div>
            )}
            {books.map((b) => {
              const p = Math.round((b.processed_pages / Math.max(1, b.total_pages)) * 100);
              return (
                <div className="historyItem" key={b.id} id={`book-item-${b.id}`}>
                  <div className="historyMeta">
                    <span
                      className={
                        b.status === 'ready'
                          ? 'text-[#78e1b5] font-semibold'
                          : b.status === 'processing'
                          ? 'text-[#ffd27a]'
                          : 'text-[#8d97b5]'
                      }
                    >
                      {b.status === 'ready' ? '✓ Ready (已建庫)' : b.status === 'processing' ? '⚡ OCR / 向量化中' : '⏳ Queued'}
                    </span>
                    <span>
                      {b.processed_pages}/{b.total_pages} pages ({p}%)
                    </span>
                  </div>
                  <h3 className="text-base text-white mt-1 mb-2">{b.title}</h3>
                  <div className="progress">
                    <span style={{ width: `${p}%` }} />
                  </div>
                  {b.status !== 'ready' && (
                    <button
                      type="button"
                      className="btn dark text-xs"
                      style={{ marginTop: 12 }}
                      disabled={busy === b.id}
                      onClick={() => processBook(b.id)}
                    >
                      {busy === b.id ? (
                        <>
                          <span className="loading" /> 處理中…
                        </>
                      ) : (
                        '開始／繼續 OCR 與索引'
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Engine Personality Section */}
        <section className="card" id="admin-dream-engine-card">
          <span className="badge">
            <Sliders className="w-3 h-3" />
            DREAM ENGINE
          </span>
          <h2 style={{ fontSize: 26, marginTop: 12 }}>AI 輸出個性與語氣</h2>
          <p className="text-sm">
            你可以控制表達方式，但系統會保留安全底線：決斷性只影響提問語氣，唔會將書本無講嘅內容變成定論。
          </p>

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
            <div className="tiny muted flex justify-between">
              <span>0% 客觀學術分析</span>
              <span>100% 溫暖且富畫面感</span>
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
            <div className="tiny muted flex justify-between">
              <span>0% 多重假設並列</span>
              <span>100% 明確指出核心方向</span>
            </div>
          </div>

          <div className="field">
            <label>
              <span>報告深度 (Depth)</span>
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
              <span>底層推論模型</span>
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (高效智慧)</option>
              <option value="deepseek/deepseek-v4.1-flash">deepseek/deepseek-v4.1-flash (心理哲學適配)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (超深度剖析)</option>
            </select>
          </div>

          <div className="field">
            <label>
              <span>Temperature</span>
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
            <div className="tiny muted flex justify-between">
              <span>0 精確收斂</span>
              <span>1 想像發散</span>
            </div>
          </div>

          <button
            type="button"
            className="btn w-full mt-4"
            disabled={busy === 'settings'}
            onClick={saveSettings}
            id="admin-save-settings-btn"
          >
            {busy === 'settings' ? '儲存中…' : '儲存 AI 設定'}
          </button>
        </section>
      </div>

      {/* Access Control Table */}
      <section className="card" id="admin-access-control-card">
        <div className="toprow">
          <div>
            <span className="badge">
              <Users className="w-3 h-3" />
              ACCESS CONTROL
            </span>
            <h2 style={{ fontSize: 26, marginTop: 12 }}>會員與管理員權限</h2>
            <p className="text-sm">任何已登入會員都可以由你即時升級／取消管理員身份。亦可快速切換模擬視角。</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" id="admin-users-table">
            <thead>
              <tr>
                <th>會員</th>
                <th>角色</th>
                <th>操作</th>
                <th>身份模擬</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b className="text-white text-sm">
                      {u.display_name || u.email.split('@')[0]}
                    </b>
                    <div className="tiny muted">{u.email}</div>
                  </td>
                  <td>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        u.role === 'admin'
                          ? 'bg-[#78e1b5]/10 border-[#78e1b5]/30 text-[#78e1b5]'
                          : 'bg-white/5 border-white/10 text-muted'
                      }`}
                    >
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn2 text-xs"
                      disabled={busy === u.id}
                      onClick={() => toggleRole(u)}
                    >
                      {u.role === 'admin' ? '轉為一般會員' : '升級為 Admin'}
                    </button>
                  </td>
                  <td>
                    {onSwitchUser && (
                      <button
                        type="button"
                        onClick={() => onSwitchUser(u)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                          u.id === currentUserId
                            ? 'border-[#aa9cff] text-[#aa9cff] bg-[#aa9cff]/10'
                            : 'border-white/10 text-[#aab3d2] hover:bg-white/10'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        {u.id === currentUserId ? '當前登入者' : '切換為以此登入'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
