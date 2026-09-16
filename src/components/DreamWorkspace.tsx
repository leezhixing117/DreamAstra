import React, { useState, useEffect } from 'react';
import { DreamEntry, DreamReport, DreamSynthesis, EngineSettings, QuickAnalysis, DetectiveQuestion } from '../types';
import { initialDreamDNA, initialConstellationNodes, initialConstellationLinks, initialThirtyNightsJourney, initialDetectiveQuestions } from '../data';
import { ReportDetailModal } from './ReportDetailModal';
import { VoiceRecorder } from './VoiceRecorder';
import { DetectiveInquiryModal } from './DetectiveInquiryModal';
import { DreamDnaCard } from './DreamDnaCard';
import { DreamConstellationView } from './DreamConstellationView';
import { ThirtyNightsMysteryView } from './ThirtyNightsMysteryView';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';
import {
  Sparkles,
  Brain,
  Clock,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Dna,
  Compass,
  Key,
  Mic,
  Eye,
  Heart,
  Layers,
  ArrowRight,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface DreamWorkspaceProps {
  initialHistory: DreamEntry[];
  settings: EngineSettings;
  demo?: boolean;
  prefilledDream?: string;
  initialTab?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history';
  onDreamAdded?: (entry: DreamEntry) => void;
}

export const DreamWorkspace: React.FC<DreamWorkspaceProps> = ({
  initialHistory,
  settings,
  prefilledDream = '',
  initialTab = 'workspace',
  onDreamAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history'>(initialTab);
  const [dream, setDream] = useState(prefilledDream);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDetectiveOpen, setIsDetectiveOpen] = useState(false);
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);

  // Loading states
  const [isQuickAnalyzing, setIsQuickAnalyzing] = useState(false);
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);

  // Analysis result states
  const [quickReport, setQuickReport] = useState<QuickAnalysis | null>(null);
  const [activeReport, setActiveReport] = useState<DreamReport | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<DetectiveQuestion[]>(initialDetectiveQuestions);

  const [history, setHistory] = useState<DreamEntry[]>(initialHistory);
  const [synthesis, setSynthesis] = useState<DreamSynthesis | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DreamEntry | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Dynamic products state
  const [dreamDNA, setDreamDNA] = useState(initialDreamDNA);
  const [constellationNodes] = useState(initialConstellationNodes);
  const [constellationLinks] = useState(initialConstellationLinks);
  const [mysteryJourney, setMysteryJourney] = useState(initialThirtyNightsJourney);

  const samplePrompts = [
    '我夢到自己返回以前讀書的學校，但所有人都不認得我。我一直找課室，最後發現自己沒有穿鞋……',
    '海水一路無聲地升高，水面漫過街道與窗戶，我爬到最高處的屋頂，看著一片汪洋，雖然害怕，但周圍好安靜。',
    '有人在身後一直追著我，我心跳好快，一直狂奔，最後推開了一間荒廢木造舊屋的門躲在裡面……',
    '已故的母親在老家神枱前點了三炷香，轉身笑著遞給我一疊紅包，我接過時發現全是白色信封……',
  ];

  // Auto-fill if passed from HomeView
  useEffect(() => {
    if (prefilledDream && !quickReport && !activeReport) {
      setDream(prefilledDream);
    }
  }, [prefilledDream]);

  // STEP 1: Perform Simple Basic Analysis (簡單初步分析)
  const handlePerformQuickAnalysis = async () => {
    if (!dream.trim()) return;
    setErrorNotice(null);
    setIsQuickAnalyzing(true);
    setActiveReport(null);

    const pastDreams = history.slice(0, 3).map((h) => ({
      title: h.title,
      text: h.dream_text,
      date: h.created_at,
    }));

    try {
      const response = await fetch('/api/dream/quick-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream: dream.trim(),
          pastDreams,
        }),
      });

      if (!response.ok) {
        throw new Error('初步解讀服務暫時繁忙');
      }

      const data = await response.json();
      setQuickReport(data.report);

      // Populate 3 questions tailored to this dream for Step 2
      if (data.report.suggestedQuestions && data.report.suggestedQuestions.length > 0) {
        setActiveQuestions(data.report.suggestedQuestions);
      }

      setTimeout(() => {
        document.getElementById('quick-analysis-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '解讀失敗，請重試');
    } finally {
      setIsQuickAnalyzing(false);
    }
  };

  // STEP 2: Trigger Further AI Analysis (進一步 AI 深度解夢)
  const handleOpenFurtherInquiry = () => {
    setIsDetectiveOpen(true);
  };

  // STEP 3: Complete the 3 questions and run Deep Analysis
  const handleCompleteDetectiveInquiry = async (detectiveAnswers: Record<string, string>) => {
    setIsDetectiveOpen(false);
    setIsDeepAnalyzing(true);
    setErrorNotice(null);

    const pastDreams = history.slice(0, 4).map((h) => ({
      title: h.title,
      text: h.dream_text,
      date: h.created_at,
    }));

    try {
      const response = await fetch('/api/dream/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream: dream.trim(),
          settings,
          detectiveAnswers,
          pastDreams,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '深度解夢服務發生錯誤');
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

      // Update DNA & Mystery Journey
      setDreamDNA((prev) => ({
        ...prev,
        totalDreams: prev.totalDreams + 1,
      }));

      setMysteryJourney((prev) => ({
        ...prev,
        completedNights: Math.min(30, prev.completedNights + 1),
        currentStreak: prev.currentStreak + 1,
      }));

      setTimeout(() => {
        document.getElementById('deep-report-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '深度解讀失敗，請稍後重試');
    } finally {
      setIsDeepAnalyzing(false);
    }
  };

  // Reset to record a new dream
  const handleResetDream = () => {
    setDream('');
    setQuickReport(null);
    setActiveReport(null);
    setErrorNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Multi-dream synthesis
  async function synthesize() {
    if (history.length < 2) return;
    setIsDeepAnalyzing(true);
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
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '串連分析失敗，請重試');
    } finally {
      setIsDeepAnalyzing(false);
    }
  }

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="dream-workspace-container">
      {/* Workspace Top Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>解讀夢境</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dna')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'dna'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>DREAM DNA™️</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('constellation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'constellation'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>星圖宇宙</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mystery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'mystery'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>30 NIGHTS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>日記 ({history.length})</span>
          </button>
        </div>

        {/* Small Therapeutic button */}
        <button
          type="button"
          onClick={() => setIsTherapeuticOpen(true)}
          className="text-xs text-[#78e1b5] hover:underline flex items-center gap-1.5 cursor-pointer py-1"
        >
          <Heart className="w-3.5 h-3.5 text-[#78e1b5]" />
          <span>後續療癒支援</span>
        </button>
      </div>

      {errorNotice && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* TAB 1: WORKSPACE - INPUT, QUICK ANALYSIS & DEEP ANALYSIS FLOW */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* Main Dream Input Card (Clean, Simple Layout) */}
          <section className="card p-6 sm:p-7 rounded-3xl bg-[#0e1122]/90 border border-white/10" id="dream-input-section">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#aa9cff] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
                <span>記錄夢境</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(!isVoiceOpen)}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                    isVoiceOpen
                      ? 'bg-[#aa9cff] text-white border-[#aa9cff]'
                      : 'bg-white/5 border-white/10 text-[#cbd2ef] hover:bg-white/10'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isVoiceOpen ? '切換文字' : '🎙️ 廣東話'}</span>
                </button>

                {(quickReport || activeReport) && (
                  <button
                    type="button"
                    onClick={handleResetDream}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#aab3d2] flex items-center gap-1 transition-all cursor-pointer"
                    title="清空並記錄新夢"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>記錄新夢</span>
                  </button>
                )}
              </div>
            </div>

            {isVoiceOpen ? (
              <VoiceRecorder
                onDreamRecorded={(text) => {
                  setDream(text);
                  setIsVoiceOpen(false);
                }}
                onCancel={() => setIsVoiceOpen(false)}
              />
            ) : (
              <>
                <textarea
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  placeholder="寫低你記得嘅夢境……醒來時看見甚麼？心情如何？"
                  rows={3}
                  id="workspace-dream-textarea"
                />

                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/5">
                  <span className="text-[11px] text-[#8d97b5]">範例：</span>
                  {samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDream(p)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[#cbd2ef] hover:bg-white/10 hover:text-white transition-colors"
                    >
                      範例 {i + 1}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
                  <div className="text-xs text-[#8d97b5]">
                    {quickReport ? '已產出基本分析，可在下方展開進一步深度解夢' : '先作基本簡單分析，需要進一步解夢再回答 3 題'}
                  </div>

                  <button
                    type="button"
                    className="btn text-xs px-5 py-2.5 flex items-center gap-1.5"
                    disabled={isQuickAnalyzing || !dream.trim()}
                    onClick={handlePerformQuickAnalysis}
                    id="workspace-quick-analyze-btn"
                  >
                    {isQuickAnalyzing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>簡單分析中…</span>
                      </>
                    ) : (
                      <>
                        <span>✨ 簡單分析夢境</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </section>

          {/* STEP 1 RESULT: 簡單基本分析 (Quick Analysis Card) */}
          {quickReport && !activeReport && (
            <section
              className="card p-6 rounded-3xl bg-gradient-to-b from-[#11162b] to-[#090c1a] border border-[#71d9ff]/30 shadow-xl space-y-4"
              id="quick-analysis-card"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#71d9ff]/20 text-[#71d9ff] font-mono border border-[#71d9ff]/30">
                    初步基本分析
                  </span>
                  <h3 className="text-base font-serif font-bold text-white">
                    {quickReport.title}
                  </h3>
                </div>
                <span className="text-[11px] text-[#8d97b5]">免冗長文字 · 精簡意涵</span>
              </div>

              {/* Core Symbol & Simple Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-center">
                  <span className="text-[11px] text-[#8d97b5] block mb-1">核心意象</span>
                  <b className="text-sm text-[#71d9ff]">{quickReport.primarySymbol.symbol}</b>
                  <p className="text-xs text-[#aab3d2] mt-1 leading-relaxed">
                    {quickReport.primarySymbol.meaning}
                  </p>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[11px] text-[#aa9cff] font-medium block">心理意涵初探</span>
                  <p className="text-xs sm:text-sm text-[#e1e5f8] leading-relaxed">
                    {quickReport.simpleSummary}
                  </p>
                  <div className="text-[11px] text-[#78e1b5] pt-1.5 border-t border-white/5 flex items-center gap-1.5">
                    <span>💡 心靈指引：</span>
                    <span>{quickReport.quickTakeaway}</span>
                  </div>
                </div>
              </div>

              {/* Book Brain Snippet & Noteworthy Message for Quick Analysis */}
              {(quickReport.bookBrainSnippet || quickReport.noteworthyMessage) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {quickReport.bookBrainSnippet && (
                    <div className="p-3.5 rounded-2xl bg-[#71d9ff]/5 border border-[#71d9ff]/20 text-xs flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#71d9ff] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#71d9ff] font-bold block mb-0.5">
                          Book Brain 典籍溯源 · {quickReport.bookBrainSnippet.bookTitle}
                        </span>
                        <p className="text-[#c8d0ec] leading-relaxed text-[11px]">
                          {quickReport.bookBrainSnippet.theory}
                        </p>
                      </div>
                    </div>
                  )}

                  {quickReport.noteworthyMessage && (
                    <div className="p-3.5 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-xs flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#aa9cff] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#c3b9ff] font-bold block mb-0.5">
                          可能值得留意嘅訊息
                        </span>
                        <p className="text-[#e1e5f8] leading-relaxed text-[11px]">
                          {quickReport.noteworthyMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 INVITATION: 需要進一步 AI 解夢才出 3 條進一步問題 */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#aa9cff]/5 p-4 rounded-2xl border border-[#aa9cff]/20">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#c3b9ff]">
                    <HelpCircle className="w-3.5 h-3.5 text-[#aa9cff]" />
                    <span>需要進一步 AI 深度解夢？</span>
                  </div>
                  <p className="text-xs text-[#aab3d2] mt-0.5">
                    回答 3 條與此夢有關的進一步問題，AI 將結合你的個人直覺，生成深度四層架構並更新你的 DREAM DNA™️。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenFurtherInquiry}
                  disabled={isDeepAnalyzing}
                  className="btn text-xs px-5 py-2.5 font-semibold shrink-0 flex items-center gap-1.5 shadow-md shadow-[#aa9cff]/20 cursor-pointer"
                  id="trigger-further-inquiry-btn"
                >
                  {isDeepAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>深度解讀中…</span>
                    </>
                  ) : (
                    <>
                      <span>🔮 回答 3 條問題進一步解夢</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 RESULT: 完整 AI 深度四層解碼報告 (Deep Report) */}
          {activeReport && (
            <section
              className="card p-6 sm:p-7 rounded-3xl border border-[#aa9cff]/40 bg-gradient-to-b from-[#12162c] to-[#090c1b] space-y-5"
              id="deep-report-card"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="badge">AI 深度解讀報告</span>
                  <span className="text-xs text-[#78e1b5] font-mono">已載入 DREAM DNA™️</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (history[0]) setSelectedEntry(history[0]);
                  }}
                  className="btn2 text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>全屏檢視</span>
                </button>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {activeReport.title}
                </h2>
                <div className="callout mt-2 text-xs sm:text-sm leading-relaxed border-[#aa9cff]/30 bg-[#aa9cff]/10">
                  <b className="text-white block mb-0.5">核心信號：</b>
                  {activeReport.summary}
                </div>
              </div>

              {/* Book Brain Theory & Past Dream Comparison Grounding Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeReport.bookBrainTheory && (
                  <div className="p-4 rounded-2xl bg-[#71d9ff]/5 border border-[#71d9ff]/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#71d9ff]" />
                        <span className="text-xs font-bold text-[#71d9ff]">Book Brain 典籍理論依據</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#aab3d2] bg-white/5 px-2 py-0.5 rounded">
                        {activeReport.bookBrainTheory.citation}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">
                      {activeReport.bookBrainTheory.theoryName}
                      <span className="text-[#aab3d2] font-normal block text-[11px] mt-0.5">
                        《{activeReport.bookBrainTheory.bookTitle}》
                      </span>
                    </div>
                    <p className="text-xs text-[#cbd2ef] leading-relaxed">
                      {activeReport.bookBrainTheory.coreInsight}
                    </p>
                  </div>
                )}

                {activeReport.pastDreamComparison && (
                  <div className="p-4 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#aa9cff]" />
                        <span className="text-xs font-bold text-[#c3b9ff]">結合過往夢境交叉比對</span>
                      </div>
                      <span className="text-[10px] text-[#78e1b5] font-mono bg-[#78e1b5]/10 px-2 py-0.5 rounded">
                        記憶連繫
                      </span>
                    </div>
                    {activeReport.pastDreamComparison.matchedPatterns?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-[#8d97b5]">比對吻合意象：</span>
                        {activeReport.pastDreamComparison.matchedPatterns.map((pat, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">
                            {pat}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-[#cbd2ef] leading-relaxed">
                      {activeReport.pastDreamComparison.pastOccurrencesSummary}
                    </p>
                  </div>
                )}
              </div>

              {/* Noteworthy Message Banner */}
              {activeReport.noteworthyMessage && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#78e1b5]/15 via-[#78e1b5]/5 to-transparent border border-[#78e1b5]/30 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#78e1b5]/20 border border-[#78e1b5]/40 flex items-center justify-center text-[#78e1b5] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-[#e1e5f8] leading-relaxed">
                    <b className="text-[#78e1b5] block mb-0.5">可能值得留意嘅訊息：</b>
                    {activeReport.noteworthyMessage}
                  </div>
                </div>
              )}

              {/* Four Layers Highlight */}
              {activeReport.fourLayers && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#aa9cff]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      四層立體解析架構
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Asian Cultural Layer */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-[#71d9ff]/30 space-y-1">
                      <span className="text-xs font-bold text-[#71d9ff]">
                        🏮 {activeReport.fourLayers.asianCulturalLayer.title}
                      </span>
                      <p className="text-xs text-[#aab3d2] leading-relaxed">
                        {activeReport.fourLayers.asianCulturalLayer.description}
                      </p>
                    </div>

                    {/* Jungian Archetype Layer */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-[#aa9cff]/30 space-y-1">
                      <span className="text-xs font-bold text-[#c3b9ff]">
                        🧠 {activeReport.fourLayers.jungianLayer.title}
                      </span>
                      <p className="text-xs text-[#aab3d2] leading-relaxed">
                        {activeReport.fourLayers.jungianLayer.description}
                      </p>
                    </div>

                    {/* Personal Layer */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-xs font-bold text-[#ffd27a]">
                        🧬 {activeReport.fourLayers.personalLayer.title}
                      </span>
                      <p className="text-xs text-[#aab3d2] leading-relaxed">
                        {activeReport.fourLayers.personalLayer.description}
                      </p>
                    </div>

                    {/* Action Layer */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-[#78e1b5]/30 space-y-1">
                      <span className="text-xs font-bold text-[#78e1b5]">
                        🌱 {activeReport.fourLayers.integrationAction.title}
                      </span>
                      <p className="text-xs text-[#d8ddf0] leading-relaxed">
                        {activeReport.fourLayers.integrationAction.advice}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Symbols */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeReport.symbols?.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <b className="text-white text-xs">{s.symbol}</b>
                    <p className="text-[11px] text-[#aab3d2] mt-1 leading-relaxed">{s.meaning}</p>
                  </div>
                ))}
              </div>

              {/* Book Brain Sources */}
              {activeReport.sources && (
                <div className="flex flex-wrap gap-2 text-[11px] text-[#8d97b5] pt-1">
                  <span className="flex items-center gap-1 text-white">
                    <BookOpen className="w-3 h-3 text-[#aa9cff]" />
                    典籍依據：
                  </span>
                  {activeReport.sources.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      📚 {s.book_title}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetDream}
                  className="btn2 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>記錄下一場夢</span>
                </button>
              </div>
            </section>
          )}

          {/* Quick Peek of Dream DNA */}
          <div className="pt-2">
            <DreamDnaCard
              dna={dreamDNA}
              onSelectSymbolForConstellation={() => setActiveTab('constellation')}
            />
          </div>
        </div>
      )}

      {/* TAB 2: DREAM DNA */}
      {activeTab === 'dna' && (
        <DreamDnaCard
          dna={dreamDNA}
          onSelectSymbolForConstellation={() => setActiveTab('constellation')}
        />
      )}

      {/* TAB 3: DREAM CONSTELLATION */}
      {activeTab === 'constellation' && (
        <DreamConstellationView
          nodes={constellationNodes}
          links={constellationLinks}
          dreams={history}
          onOpenReportDetail={(entry) => setSelectedEntry(entry)}
        />
      )}

      {/* TAB 4: 30 NIGHTS MYSTERY */}
      {activeTab === 'mystery' && (
        <ThirtyNightsMysteryView
          journey={mysteryJourney}
          onRecordNewNight={() => setActiveTab('workspace')}
        />
      )}

      {/* TAB 5: HISTORY ARCHIVES */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {/* Synthesis CTA */}
          <section className="card p-5 rounded-2xl" id="patterns">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[#71d9ff] font-mono flex items-center gap-1 mb-1">
                  <Brain className="w-3 h-3" />
                  <span>LONG-TERM SYNTHESIS</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  串連你過往 {history.length} 個夢境
                </h3>
                <p className="text-xs text-[#aab3d2] mt-0.5">
                  尋找長期重複出現的意象、情緒與轉化軌跡。
                </p>
              </div>

              <button
                type="button"
                className="btn dark text-xs px-4 py-2"
                disabled={isDeepAnalyzing || history.length < 2}
                onClick={synthesize}
              >
                {isDeepAnalyzing ? '計算中…' : '🧠 串連分析'}
              </button>
            </div>

            {synthesis && (
              <div className="mt-4 p-4 rounded-xl bg-black/40 border border-[#71d9ff]/30 text-xs space-y-2">
                <h4 className="text-sm font-bold text-white">{synthesis.headline}</h4>
                <p className="text-[#cbd2ef] leading-relaxed">{synthesis.summary}</p>
              </div>
            )}
          </section>

          {/* History List */}
          <section className="card p-5 rounded-2xl" id="history-section">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#ffd27a]" />
                <h4 className="text-sm font-bold text-white">過往夢境日記</h4>
              </div>
              <span className="text-xs text-[#8d97b5] font-mono">{history.length} 篇</span>
            </div>

            <div className="space-y-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => setSelectedEntry(h)}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#aa9cff]/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#8d97b5] font-mono">
                      {new Date(h.created_at).toLocaleDateString('zh-HK')}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{h.title || '未命名夢境'}</div>
                    <p className="text-[11px] text-[#aab3d2] truncate mt-0.5">
                      {h.report_json?.summary || h.dream_text}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#8d97b5] shrink-0" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Detective Inquiry Modal (Triggered ONLY when user chooses further AI analysis) */}
      <DetectiveInquiryModal
        isOpen={isDetectiveOpen}
        dreamText={dream}
        questions={activeQuestions}
        onComplete={handleCompleteDetectiveInquiry}
        onClose={() => setIsDetectiveOpen(false)}
      />

      {/* Report Detail Modal */}
      {selectedEntry && (
        <ReportDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDeleteHistory}
        />
      )}

      {/* Therapeutic Support Modal */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
      />
    </div>
  );
};
