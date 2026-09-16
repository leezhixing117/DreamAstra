import React, { useState } from 'react';
import { DreamEntry, DreamReport, DreamSynthesis, EngineSettings } from '../types';
import { ReportDetailModal } from './ReportDetailModal';
import { Sparkles, Brain, Clock, ChevronRight, BookOpen, AlertCircle, RefreshCw, Trash2, Eye } from 'lucide-react';

interface DreamWorkspaceProps {
  initialHistory: DreamEntry[];
  settings: EngineSettings;
  demo?: boolean;
  prefilledDream?: string;
  onDreamAdded?: (entry: DreamEntry) => void;
}

export const DreamWorkspace: React.FC<DreamWorkspaceProps> = ({
  initialHistory,
  settings,
  demo = false,
  prefilledDream = '',
  onDreamAdded,
}) => {
  const [dream, setDream] = useState(prefilledDream);
  const [busy, setBusy] = useState(false);
  const [activeReport, setActiveReport] = useState<DreamReport | null>(null);
  const [history, setHistory] = useState<DreamEntry[]>(initialHistory);
  const [synthesis, setSynthesis] = useState<DreamSynthesis | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DreamEntry | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const samplePrompts = [
    '我夢到自己返回以前讀書的學校，但所有人都不認得我。我一直找課室，最後發現自己沒有穿鞋……',
    '海水一路無聲地升高，水面漫過街道與窗戶，我爬到最高處的屋頂，看著一片汪洋，雖然害怕，但周圍好安靜。',
    '有人在身後一直追著我，我心跳好快，一直狂奔，最後推開了一間荒廢木造舊屋的門躲在裡面……',
  ];

  // Analyze new dream
  async function analyse() {
    if (!dream.trim()) return;
    setBusy(true);
    setActiveReport(null);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/dream/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: dream.trim(), settings }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '解夢服務發生錯誤');
      }

      const data = await response.json();
      setActiveReport(data.report);
      const newEntry: DreamEntry = data.entry || {
        id: 'dream_' + Date.now(),
        title: data.report.title,
        dream_text: dream.trim(),
        created_at: new Date().toISOString(),
        report_json: data.report,
      };

      setHistory((prev) => [newEntry, ...prev]);
      if (onDreamAdded) onDreamAdded(newEntry);
      setDream('');
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '分析失敗，請稍後重試');
    } finally {
      setBusy(false);
    }
  }

  // Synthesize multi-dream patterns
  async function synthesize() {
    if (history.length < 2) return;
    setBusy(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/dream/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreams: history.map((h) => ({
            id: h.id,
            title: h.title,
            dream_text: h.dream_text,
            created_at: h.created_at,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '串連分析服務發生錯誤');
      }

      const data = await response.json();
      setSynthesis(data.report);

      // Smooth scroll down to patterns section
      setTimeout(() => {
        const el = document.getElementById('patterns');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '串連分析失敗，請重試');
    } finally {
      setBusy(false);
    }
  }

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const count = history.length;

  return (
    <div className="space-y-6" id="dream-workspace-container">
      {errorNotice && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* New Dream Input Card */}
      <section className="card" id="new-dream-section">
        <div className="flex items-center justify-between">
          <div className="eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
            <span>NEW DREAM</span>
          </div>
          <span className="text-xs text-[#8d97b5]">
            當前模型: {settings.model.split('/').pop() || 'Gemini'} · 深度 {settings.depth}%
          </span>
        </div>

        <h2 style={{ fontSize: 30, marginTop: 14 }}>講低你昨晚個夢。</h2>

        <div className="dreambox" style={{ width: '100%', marginTop: 16 }}>
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="人物、地方、顏色、感覺、奇怪細節……唔需要寫得完整，哪怕只有幾個片斷也可以。"
            id="workspace-dream-input"
          />

          <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-white/5 bg-white/[0.02]">
            <span className="text-xs text-[#8d97b5]">預設案例：</span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDream(p)}
                className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#cbd2ef] hover:bg-white/10 transition-colors"
              >
                {i === 0 ? '🏫 舊校無鞋' : i === 1 ? '🌊 屋頂漲水' : '🏃 舊屋逃跑'}
              </button>
            ))}
          </div>

          <div className="dreamfoot">
            <span className="tiny muted">
              AI 會先檢索 Book Brain 典籍（榮格/佛洛伊德/睡眠神經科學），再生成專屬解讀報告。
            </span>
            <button
              type="button"
              className="btn"
              onClick={analyse}
              disabled={busy || !dream.trim()}
              id="workspace-analyze-btn"
            >
              {busy ? (
                <>
                  <span className="loading" /> 分析典籍中…
                </>
              ) : (
                '✨ 深度解夢'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Active Newly Generated Report Card */}
      {activeReport && (
        <section className="report" id="active-report-section">
          <div className="card">
            <span className="badge">
              <BookOpen className="w-3 h-3" />
              BOOK-GROUNDED REPORT
            </span>
            <h2 style={{ fontSize: 32, marginTop: 12 }}>{activeReport.title}</h2>
            <p style={{ fontSize: 17, color: '#e4e7f7', lineHeight: 1.6 }}>{activeReport.summary}</p>

            <div className="symbolgrid">
              {activeReport.symbols?.map((s, i) => (
                <div className="symbol" key={i}>
                  <b className="text-white text-sm">{s.symbol}</b>
                  <div className="muted tiny" style={{ marginTop: 6 }}>
                    {s.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeReport.perspectives?.map((p, i) => (
            <div className="card" key={i}>
              <h3 className="text-base text-[#c3b9ff]">{p.name}</h3>
              <p className="text-sm mt-1">{p.text}</p>
            </div>
          ))}

          <div className="card">
            <h3 className="text-base text-[#ffd27a]">可以問自己</h3>
            <div className="space-y-2 mt-2">
              {activeReport.questions?.map((q, i) => (
                <p key={i} style={{ margin: '8px 0', color: '#e1e5f8', fontSize: 14 }}>
                  <span className="text-[#aa9cff] font-mono font-bold mr-1.5">0{i + 1}.</span> {q}
                </p>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-base text-[#71d9ff] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              今次用到嘅 Book Brain 依據
            </h3>
            <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
              {activeReport.sources?.map((s, i) => (
                <div className="source" key={i}>
                  📚 {s.book_title} · p.{s.page_start}
                  {s.page_end && s.page_end !== s.page_start ? `–${s.page_end}` : ''}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Long-term Synthesis Section */}
      <section className="section" id="patterns" style={{ paddingBottom: 24, paddingTop: 24 }}>
        <div className="toprow">
          <div>
            <div className="eyebrow">
              <Brain className="w-3.5 h-3.5 text-[#71d9ff]" />
              <span>DREAM PATTERN</span>
            </div>
            <h2 style={{ fontSize: 30, marginTop: 12 }}>串連你過往 {count} 個夢。</h2>
            <p className="muted">唔逐個夢重複解，而係尋找長期重複人物、場景、情緒與轉變軌跡。</p>
          </div>
          <button
            type="button"
            className="btn dark whitespace-nowrap self-start"
            disabled={busy || count < 2}
            onClick={synthesize}
            id="workspace-synthesize-btn"
          >
            {busy ? (
              <>
                <span className="loading" /> 串連計算中…
              </>
            ) : (
              '🧠 串連分析全部夢境'
            )}
          </button>
        </div>

        {synthesis ? (
          <div className="card" id="synthesis-result-card">
            <span className="badge">
              <Brain className="w-3 h-3" />
              LONG-TERM SYNTHESIS
            </span>
            <h2 style={{ fontSize: 28, marginTop: 12 }}>{synthesis.headline}</h2>
            <p style={{ fontSize: 16, color: '#e4e7f7', lineHeight: 1.6 }}>{synthesis.summary}</p>

            <div className="grid3" style={{ marginTop: 16 }}>
              {synthesis.patterns?.map((p: string, i: number) => (
                <div className="symbol" key={i}>
                  <b className="text-[#c3b9ff]">Pattern {i + 1}</b>
                  <div className="muted tiny" style={{ marginTop: 6, lineHeight: 1.5 }}>
                    {p}
                  </div>
                </div>
              ))}
            </div>

            <div className="callout" style={{ marginTop: 16 }}>
              <b className="text-white">下一步可以留意：</b>
              <div className="mt-1 text-[#e4e7f7]">{synthesis.next}</div>
            </div>
          </div>
        ) : (
          count >= 2 && (
            <div className="p-4 rounded-xl border border-dashed border-white/15 text-center text-sm text-[#8d97b5]">
              點擊上方「🧠 串連分析全部夢境」以探索你記錄中的潛在重複母題與心理演進。
            </div>
          )
        )}
      </section>

      {/* History Section */}
      <section className="section" id="history" style={{ paddingTop: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="eyebrow">
              <Clock className="w-3.5 h-3.5 text-[#ffd27a]" />
              <span>HISTORY</span>
            </div>
            <h2 style={{ fontSize: 30, marginTop: 12 }}>過往夢境日記</h2>
          </div>
          <span className="text-xs text-[#8d97b5]">已保存 {count} 篇紀錄</span>
        </div>

        <div className="history" id="dream-history-list">
          {history.length === 0 ? (
            <div className="p-8 rounded-2xl border border-white/10 text-center text-muted">
              目前尚未記錄任何夢境。在上方寫下你的第一個夢開始吧！
            </div>
          ) : (
            history.map((h) => (
              <div
                className="historyItem cursor-pointer"
                key={h.id}
                onClick={() => setSelectedEntry(h)}
                id={`history-entry-${h.id}`}
              >
                <div className="historyMeta">
                  <span>
                    {new Date(h.created_at).toLocaleDateString('zh-HK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-[#78e1b5] flex items-center gap-1">
                    <span>已保存</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </span>
                </div>
                <h3>{h.title || '未命名夢境'}</h3>
                <p className="muted line-clamp-2">{h.report_json?.summary || h.dream_text}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#aa9cff]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>點擊查看完整 Book Brain 報告與象徵解析</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal for viewing detailed past dream */}
      {selectedEntry && (
        <ReportDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDeleteHistory}
        />
      )}
    </div>
  );
};
