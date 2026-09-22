import React, { useState, useEffect } from 'react';
import { DreamEntry, DreamReport, DreamSynthesis, EngineSettings, QuickAnalysis, DetectiveQuestion, User, TherapistItem, normalizeRole, getRoleDisplayName, UserDreamContext, DreamMasterAnalysisResult } from '../types';
import { initialDreamDNA, initialConstellationNodes, initialConstellationLinks, initialThirtyNightsJourney, initialDetectiveQuestions } from '../data';
import { exportHtmlToWord, copyFormattedText } from '../utils/wordExport';
import { ReportDetailModal } from './ReportDetailModal';
import { DetectiveInquiryModal } from './DetectiveInquiryModal';
import { DreamDnaCard } from './DreamDnaCard';
import { DreamConstellationView } from './DreamConstellationView';
import { ThirtyNightsMysteryView } from './ThirtyNightsMysteryView';
import { DreamJournalManager } from './DreamJournalManager';
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
  Eye,
  Heart,
  Layers,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Star,
  Crown,
  ShieldCheck,
  Video,
  Database,
  FileText,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Download,
  Copy,
  Check,
  Plus,
} from 'lucide-react';

interface DreamWorkspaceProps {
  initialHistory: DreamEntry[];
  settings: EngineSettings;
  demo?: boolean;
  prefilledDream?: string;
  initialTab?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history';
  currentUser?: User | null;
  onDreamAdded?: (entry: DreamEntry) => void;
  onUpdateUserStars?: (newStars: number) => void;
  onOpenEarnStars?: () => void;
  onGoToPricing?: () => void;
  onGoToStore?: (productId?: string) => void;
  therapists?: TherapistItem[];
}

export const DreamWorkspace: React.FC<DreamWorkspaceProps> = ({
  initialHistory,
  settings,
  prefilledDream = '',
  initialTab = 'workspace',
  currentUser,
  onDreamAdded,
  onUpdateUserStars,
  onOpenEarnStars,
  onGoToPricing,
  onGoToStore,
  therapists,
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history'>(initialTab);
  const [dream, setDream] = useState(prefilledDream);
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

  // Auto-fill if passed from HomeView
  useEffect(() => {
    if (prefilledDream) {
      setDream(prefilledDream);
      setMasterAnalysis(null);
      setQuickReport(null);
      setActiveReport(null);
      setFollowUpHistory([]);
      setFollowUpQuestion('');
    }
  }, [prefilledDream]);

  // Dream Master SQL SOP States
  const [userContext, setUserContext] = useState<UserDreamContext>({
    gender: '未指定',
    recent_status: '',
    is_recurring: false,
  });
  const [showContextOptions, setShowContextOptions] = useState(false);
  const [isMasterAnalyzing, setIsMasterAnalyzing] = useState(false);
  const [masterAnalysis, setMasterAnalysis] = useState<DreamMasterAnalysisResult | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpHistory, setFollowUpHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [copiedWordNotice, setCopiedWordNotice] = useState(false);
  const [paidPreliminary, setPaidPreliminary] = useState(false);

  // Export Dream Master report as Microsoft Word (.doc)
  const handleExportMasterToWord = () => {
    if (!masterAnalysis) return;
    const dreamTitle = (masterAnalysis.cleaned_dream || dream).slice(0, 18);
    const title = `Dream Master 深度心理學解讀 · ${dreamTitle}...`;
    const paragraphs = masterAnalysis.analysis_text
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        if (p.startsWith('【') || p.startsWith('###') || p.startsWith('##')) {
          return `<h2>${p.replace(/^[#\s]+/, '')}</h2>`;
        }
        return `<p>${p}</p>`;
      })
      .join('');

    const followUpsHtml = followUpHistory.length > 0 ? `
      <h2>深度追問對話歷程</h2>
      ${followUpHistory.map((fu, idx) => `
        <div style="margin-bottom: 16px;">
          <p><strong>問 ${idx + 1}：${fu.q}</strong></p>
          <div class="quote-box">${fu.a.replace(/\n/g, '<br>')}</div>
        </div>
      `).join('')}
    ` : '';

    const bodyHtml = `
      <div class="quote-box">
        <strong>【造夢者原始夢境紀錄】：</strong><br>
        「${masterAnalysis.cleaned_dream || dream}」
      </div>
      ${userContext.recent_status ? `<p class="meta">造夢者近況背景：${userContext.recent_status}</p>` : ''}
      <div>${paragraphs}</div>
      ${followUpsHtml}
    `;

    exportHtmlToWord(`DreamWisdom_深度解夢報告_${new Date().toISOString().slice(0, 10)}`, title, bodyHtml);
  };

  // Copy report formatted for Microsoft Word / Notes paste
  const handleCopyMasterText = async () => {
    if (!masterAnalysis) return;
    let fullText = `【DreamWisdom · Dream Master 深度心理學解讀】\n\n`;
    fullText += `【造夢者原始夢境】：\n${masterAnalysis.cleaned_dream || dream}\n\n`;
    if (userContext.recent_status) {
      fullText += `【生活背景】：${userContext.recent_status}\n\n`;
    }
    fullText += `【深度心理學透視與榮格原型分析】：\n${masterAnalysis.analysis_text}\n\n`;
    if (followUpHistory.length > 0) {
      fullText += `【深度追問對話歷程】：\n`;
      followUpHistory.forEach((fu, i) => {
        fullText += `Q${i + 1}：${fu.q}\nA：${fu.a}\n\n`;
      });
    }
    fullText += `備註：${masterAnalysis.disclaimer}`;
    const ok = await copyFormattedText(fullText);
    if (ok) {
      setCopiedWordNotice(true);
      setTimeout(() => setCopiedWordNotice(false), 3000);
    }
  };

  // Dream Master SOP Analysis Runner (需 6 星，若已做初步分析只需加 3 星)
  const handleRunMasterAnalysis = async () => {
    if (!dream.trim()) return;
    setErrorNotice(null);

    // SOP Preprocessing character length requirement (< 15 characters)
    if (dream.trim().length < 15) {
      setErrorNotice('夢境文字少於 15 字，暫不執行解讀。請試著補充夢中的核心情緒（例如害怕、平靜、困惑）、周遭具體場景、身邊出現的人物或關鍵細節，以便透過心理意象資料庫為你精準解析。');
      return;
    }

    const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
    const isDirectUnlock = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
    const stars = currentUser?.stars ?? 0;
    const isUpgradingFromPreliminary = Boolean(paidPreliminary || quickReport);
    const requiredStars = isUpgradingFromPreliminary ? 3 : 6;

    if (!isDirectUnlock) {
      if (stars < requiredStars) {
        if (isUpgradingFromPreliminary) {
          setErrorNotice(`升級 Dream Master 深度解夢需再加 3 顆星星幣（已為你折抵初步分析之 3 星，你目前持有 ${stars} 顆）。你可以點擊上方「隨機彈出片儲星星」免費獲取，或升級付費會員！`);
        } else {
          setErrorNotice(`直接進行 Dream Master 深度解夢需要 6 顆星星幣（你目前持有 ${stars} 顆）。你可以先用 3 星體驗初步分析，或點擊上方「隨機彈出片儲星星」儲滿 6 顆星！`);
        }
        return;
      }
    }

    setIsMasterAnalyzing(true);
    try {
      const response = await fetch('/api/dream/master-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_dream: dream.trim(),
          user_context: {
            gender: userContext.gender === '未指定' ? undefined : userContext.gender,
            recent_status: userContext.recent_status?.trim() || undefined,
            is_recurring: userContext.is_recurring,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || '解析失敗');
      }

      setMasterAnalysis(data);
      setFollowUpHistory([]);

      // Deduct stars for free tier after successful Dream Master analysis
      if (!isDirectUnlock && onUpdateUserStars) {
        onUpdateUserStars(Math.max(0, stars - requiredStars));
      }

      // Auto scroll to SOP card
      setTimeout(() => {
        document.getElementById('dream-master-sop-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || 'Dream Master 深度解析失敗，請重試');
    } finally {
      setIsMasterAnalyzing(false);
    }
  };

  // Follow-up on same dream (Only carries previous compressed summary <= 200 tokens)
  const handleSendFollowUp = async () => {
    if (!followUpQuestion.trim() || !masterAnalysis) return;
    setIsFollowUpLoading(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/dream/master-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_dream: dream.trim(),
          follow_up: {
            is_follow_up: true,
            follow_up_question: followUpQuestion.trim(),
            previous_summary: masterAnalysis.compressed_summary_for_followup || '',
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || '追問回答失敗');
      }

      setFollowUpHistory((prev) => [
        ...prev,
        { q: followUpQuestion.trim(), a: data.analysis_text },
      ]);
      setFollowUpQuestion('');
      if (data.compressed_summary_for_followup) {
        setMasterAnalysis((prev) => prev ? { ...prev, compressed_summary_for_followup: data.compressed_summary_for_followup } : null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || '追問失敗，請稍後重試');
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // STEP 1: Perform Simple Basic Analysis (簡單初步分析，需 3 星)
  const handlePerformQuickAnalysis = async () => {
    if (!dream.trim()) return;
    setErrorNotice(null);

    const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
    const isDirectUnlock = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
    const stars = currentUser?.stars ?? 0;
    const requiredStars = 3;

    if (!isDirectUnlock) {
      if (stars < requiredStars) {
        setErrorNotice(`初步分析需要 3 顆星星幣（你目前持有 ${stars} 顆）。你可以點擊上方「隨機彈出片儲星星」免費獲取，或升級付費會員！`);
        return;
      }
    }

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
      setPaidPreliminary(true);

      // Deduct 3 stars for free tier after successful preliminary analysis
      if (!isDirectUnlock && onUpdateUserStars) {
        onUpdateUserStars(Math.max(0, stars - requiredStars));
      }

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

  // STEP 2: Trigger Further AI Analysis (進一步 AI 深度解夢，初析後加 3 星)
  const handleOpenFurtherInquiry = () => {
    const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
    const isDirectUnlock = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';

    if (isDirectUnlock) {
      setIsDetectiveOpen(true);
      return;
    }

    // General member star checking: +3 stars if preliminary already completed, else 6 stars
    const stars = currentUser?.stars ?? 0;
    const requiredStars = (paidPreliminary || quickReport) ? 3 : 6;
    if (stars >= requiredStars) {
      if (onUpdateUserStars) {
        onUpdateUserStars(stars - requiredStars);
      }
      setIsDetectiveOpen(true);
    } else {
      if (onOpenEarnStars) {
        onOpenEarnStars();
      } else {
        alert(`你的星星餘額為 ${stars} 顆（需要 ${requiredStars} 顆）。一般會員可透過觀看隨機短片儲星星！`);
      }
    }
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

      const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
      const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
      const maxQuota = isPaid ? 99999 : (currentUser?.storage_quota || 3);

      if (!isPaid && history.length >= maxQuota) {
        setErrorNotice(
          `⚠️ 儲存提醒：你目前為一般會員，已達到夢境儲存上限（${history.length} / ${maxQuota} 條）。已為你完成深度解讀，但未能存入日記。請前往日記刪除舊記錄、或在「方案與星星幣」用星星幣兌換儲存配額（最多 10 條），或升級付費版解鎖無限儲存！`
        );
      } else {
        const newEntry: DreamEntry = data.entry || {
          id: 'dream_' + Date.now(),
          title: data.report.title,
          dream_text: dream.trim(),
          created_at: new Date().toISOString(),
          report_json: data.report,
        };

        setHistory((prev) => [newEntry, ...prev]);
        if (onDreamAdded) onDreamAdded(newEntry);
      }

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
    setPaidPreliminary(false);
    setQuickReport(null);
    setActiveReport(null);
    setMasterAnalysis(null);
    setFollowUpHistory([]);
    setFollowUpQuestion('');
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

  const handleDeleteHistory = async (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/dreams/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete dream from backend db', e);
    }
  };

  const handleUpdateEntryTags = async (id: string, newTags: string[]) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, tags: newTags } : item))
    );
    const target = history.find((h) => h.id === id);
    if (target) {
      try {
        await fetch('/api/dreams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: target.id,
            title: target.title,
            dream_text: target.dream_text,
            report_json: target.report_json,
            tags: newTags,
            rawCantoneseTranscription: target.rawCantoneseTranscription,
          }),
        });
      } catch (e) {
        console.warn('Failed to update tags in backend db', e);
      }
    }
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
            title="DREAM DNA™️｜你的夢境指紋：統計重複遇過嘅場景、物件同情緒"
          >
            <Dna className="w-3.5 h-3.5" />
            <span>DREAM DNA™️ (夢境指紋)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('constellation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'constellation'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
            title="星圖 CONSTELLATION™️｜夢境連線：將唔同夢境嘅人、地、情緒連成星圖"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>星圖連線</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mystery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'mystery'
                ? 'bg-[#aa9cff] text-white shadow-md shadow-[#aa9cff]/20'
                : 'bg-white/5 border border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
            }`}
            title="30 NIGHTS MYSTERY™️｜30晚潛意識檔案：每晚解鎖線索碎片"
          >
            <Key className="w-3.5 h-3.5" />
            <span>30 NIGHTS™️ (30晚檔案)</span>
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
          {/* Member Tier & Star Status Banner */}
          {currentUser && (
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                normalizeRole(currentUser.role) === 'free'
                  ? 'bg-amber-400/5 border-amber-400/25'
                  : 'bg-[#78e1b5]/10 border-[#78e1b5]/25'
              }`}
              id="workspace-member-status-banner"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    normalizeRole(currentUser.role) === 'free'
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/30'
                  }`}
                >
                  {normalizeRole(currentUser.role) === 'free' ? (
                    <Star className="w-5 h-5 fill-amber-300/40" />
                  ) : normalizeRole(currentUser.role) === 'paid' ? (
                    <Crown className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {getRoleDisplayName(currentUser.role)} · {currentUser.display_name || currentUser.email}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full border ${
                        normalizeRole(currentUser.role) === 'free'
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/30 font-mono'
                          : 'bg-[#78e1b5]/20 text-[#78e1b5] border-[#78e1b5]/30'
                      }`}
                    >
                      {normalizeRole(currentUser.role) === 'free' ? `⭐ 結餘：${currentUser.stars ?? 0} 顆星` : 'VIP 已直接全解鎖'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#aab3d2] mt-0.5">
                    {normalizeRole(currentUser.role) === 'free'
                      ? '一般會員星星機制：初步分析需 3 顆星 · Dream Master 深度解夢需 6 顆星（若已做初步分析，只需再加 3 星升級）。可隨機彈出片儲星！'
                      : '付費會員與管理員已直接解鎖全部進階深度解夢、星圖宇宙與 30 夜探索功能，免看片免扣星。'}
                  </p>
                </div>
              </div>

              {normalizeRole(currentUser.role) === 'free' && onOpenEarnStars && (
                <button
                  type="button"
                  onClick={onOpenEarnStars}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
                  id="btn-workspace-earn-stars"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>隨機彈出片儲星星 (+1 ⭐)</span>
                </button>
              )}
            </div>
          )}

          {/* Main Dream Input Card (Clean, Simple Layout) */}
          <section className="card p-6 sm:p-7 rounded-3xl bg-[#0e1122]/90 border border-white/10" id="dream-input-section">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#aa9cff] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
                <span>記錄夢境</span>
              </div>

              <div className="flex items-center gap-2">
                {(quickReport || activeReport || masterAnalysis || dream.trim().length > 0) && (
                  <button
                    type="button"
                    onClick={handleResetDream}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#c3b9ff] hover:text-white flex items-center gap-1 transition-all cursor-pointer border border-white/10"
                    title="清空並記錄新夢"
                    id="workspace-reset-dream-btn"
                  >
                    <RotateCcw className="w-3 h-3 text-[#aa9cff]" />
                    <span>清空重寫 / 記錄新夢</span>
                  </button>
                )}
              </div>
            </div>

            {/* 記夢引導（醒來記憶喚醒提示，置頂重要位置優先引導造夢者回憶） */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#aa9cff]/10 border border-[#aa9cff]/20 flex flex-wrap items-center justify-between gap-2 text-xs mb-3" id="workspace-dream-guide">
              <div className="flex items-center gap-1.5 font-semibold text-[#c3b9ff]">
                <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
                <span>記夢引導（點擊帶入回憶結構）：</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: '👥 有邊啲人物？', prompt: '【夢中人物】：' },
                  { label: '📍 場景係邊度？', prompt: '【場景地點】：' },
                  { label: '💭 感覺驚／開心／不安？', prompt: '【當時心情感覺】：' },
                  { label: '🚪 有冇特定物件？', prompt: '【重要物件】：' },
                ].map((guide, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDream((prev) => {
                        const trimmed = prev.trim();
                        return trimmed ? `${trimmed}\n${guide.prompt}` : guide.prompt;
                      });
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#aa9cff]/25 text-[#cbd2ef] hover:text-white border border-white/15 hover:border-[#aa9cff]/40 transition-all cursor-pointer font-medium active:scale-95"
                    title={`點擊加入「${guide.prompt}」引導`}
                  >
                    {guide.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="寫低你記得嘅夢境……醒來時看見甚麼？心情如何？（可點擊上方「記夢引導」快速帶入提示，或直接自由書寫）"
                rows={4}
                className="w-full text-base sm:text-sm leading-relaxed min-h-[140px] p-3.5 sm:p-4 rounded-2xl bg-[#090b16] border border-white/20 focus:border-[#aa9cff] focus:ring-2 focus:ring-[#aa9cff]/20 text-white placeholder-[#727c9e] outline-none transition-all shadow-inner"
                id="workspace-dream-textarea"
              />

              {/* Realtime Character Count & Minimum Guidance */}
              <div className="flex items-center justify-between text-[11px] mt-1 px-1">
                <div>
                  {dream.trim().length > 0 && dream.trim().length < 15 ? (
                    <span className="text-amber-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      目前 {dream.trim().length} 字（少於 15 字）：建議補充情緒、場景或關鍵細節以利深入解讀
                    </span>
                  ) : dream.trim().length >= 15 ? (
                    <span className="text-[#78e1b5] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      已達 {dream.trim().length} 字，內容完整度良好
                    </span>
                  ) : (
                    <span className="text-[#8d97b5]">建議完整描述夢中場景與情緒感受</span>
                  )}
                </div>
                <div className="text-[#8d97b5] font-mono">
                  {dream.trim().length} 字
                </div>
              </div>
            </div>

            {/* Quick Word Adder Chips (次要輔助：補充意象詞) */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/5">
              <span className="text-[11px] text-[#8d97b5] font-medium flex items-center gap-1">
                <Plus className="w-3 h-3" />
                補充意象詞：
              </span>
              {[
                { label: '🌊 海洋水流', text: '海洋、大水淹沒' },
                { label: '👣 赤腳無鞋', text: '赤腳、沒穿鞋子' },
                { label: '🏃 被追狂奔', text: '在黑暗中被人追趕、拼命狂奔' },
                { label: '🏚️ 祖屋舊居', text: '小時候住過的舊屋居所' },
                { label: '🕯️ 家宅神枱', text: '神枱香火、祖先排位' },
                { label: '🏫 課室考試', text: '學校課室、試卷未答完' },
                { label: '🚪 緊閉門鎖', text: '打不開的門、找不到鑰匙' },
                { label: '🕳️ 高處墜落', text: '從高樓邊緣失足下墜' },
                { label: '🪞 鏡中倒影', text: '看著鏡中的自己' },
                { label: '🐍 野獸毒蛇', text: '突然出現的毒蛇怪獸' },
                { label: '⏳ 趕車遲到', text: '快要遲到、錯過班次列車' },
                { label: '🛗 下墜電梯', text: '失控快速下墜的電梯' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDream((prev) => {
                      const trimmed = prev.trim();
                      return trimmed ? `${trimmed}，夢中有${item.text}` : `昨晚夢見${item.text}`;
                    });
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#aa9cff]/10 border border-[#aa9cff]/20 text-[#cbd2ef] hover:bg-[#aa9cff]/25 hover:text-white transition-colors cursor-pointer"
                  title={`點擊加入「${item.label}」`}
                >
                  +{item.label}
                </button>
              ))}
            </div>

            {/* Optional User Context Drawer (可選補充資訊：性別、近況、是否為重複夢) */}
            <div className="mt-3 pt-2.5 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowContextOptions((prev) => !prev)}
                className="text-xs text-[#aab3d2] hover:text-white flex items-center justify-between w-full py-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[#aa9cff]" />
                  <span className="font-semibold text-white">可選補充資訊（提供背景利於模型結合個人現況解讀）</span>
                  {(userContext.recent_status || userContext.gender !== '未指定' || userContext.is_recurring) && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#aa9cff]/20 text-[#aa9cff] font-medium">
                      已自訂背景
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#8d97b5]">
                  <span>{showContextOptions ? '收起' : '展開填寫'}</span>
                  {showContextOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {showContextOptions && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Gender Option */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#8d97b5] mb-1">造夢者性別</label>
                    <select
                      value={userContext.gender || '未指定'}
                      onChange={(e) => setUserContext((prev) => ({ ...prev, gender: e.target.value }))}
                      className="w-full bg-[#111425] border border-white/15 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#aa9cff]"
                    >
                      <option value="未指定">未指定 / 不透露</option>
                      <option value="女性">女性</option>
                      <option value="男性">男性</option>
                      <option value="多元性別">多元性別</option>
                    </select>
                  </div>

                  {/* Recurring Dream Option */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#8d97b5] mb-1">是否為重複出現的夢</label>
                    <select
                      value={userContext.is_recurring ? 'true' : 'false'}
                      onChange={(e) => setUserContext((prev) => ({ ...prev, is_recurring: e.target.value === 'true' }))}
                      className="w-full bg-[#111425] border border-white/15 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#aa9cff]"
                    >
                      <option value="false">否（首次出現此夢境）</option>
                      <option value="true">是（重複出現 / 類似情節）</option>
                    </select>
                  </div>

                  {/* Recent Life Status Option */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#8d97b5] mb-1">近期生活近況</label>
                    <input
                      type="text"
                      value={userContext.recent_status || ''}
                      onChange={(e) => setUserContext((prev) => ({ ...prev, recent_status: e.target.value }))}
                      placeholder="例：剛轉新工作、感情困擾、準備考試"
                      className="w-full bg-[#111425] border border-white/15 rounded-xl px-2.5 py-1.5 text-white text-xs placeholder:text-[#6a759b] focus:outline-none focus:border-[#aa9cff]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Dream Master Deep Analysis vs. Quick Analysis */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
              <div className="text-xs">
                {masterAnalysis ? (
                  <span className="text-[#78e1b5] font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    已完成 Dream Master 深度心理學專業分析
                  </span>
                ) : normalizeRole(currentUser?.role || 'free') === 'free' ? (
                  <div className="flex flex-wrap items-center gap-1.5 text-[#cbd2ef]">
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      星星幣說明：
                    </span>
                    <span className="text-[#8d97b5]">
                      初步分析需 <b className="text-amber-300">3 星</b> · 深度解夢需 <b className="text-amber-300">6 星</b>（先初析後只需加 <b className="text-amber-300">3 星</b> 升級）
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono font-bold">
                      目前結餘：{currentUser?.stars ?? 0} ⭐
                    </span>
                  </div>
                ) : (
                  <span className="text-[#78e1b5] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#78e1b5]" />
                    付費會員尊享：無限次初步分析與 Dream Master 深度解夢，免扣星星幣
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="btn2 text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
                  disabled={isQuickAnalyzing || isMasterAnalyzing || !dream.trim()}
                  onClick={handlePerformQuickAnalysis}
                  id="workspace-quick-analyze-btn"
                  title="初步分析需要 3 顆星星幣（付費會員免扣星）"
                >
                  {isQuickAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>初步分析中…</span>
                    </>
                  ) : (
                    <>
                      <span>✨ 初步分析</span>
                      {normalizeRole(currentUser?.role || 'free') === 'free' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold font-mono">
                          3 星 ⭐
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#78e1b5]/20 text-[#78e1b5] font-medium">
                          免星
                        </span>
                      )}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn text-xs px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] text-[#0a0d1d] font-bold shadow-lg shadow-[#aa9cff]/20 hover:brightness-110"
                  disabled={isMasterAnalyzing || !dream.trim() || dream.trim().length < 15}
                  onClick={handleRunMasterAnalysis}
                  id="workspace-master-analyze-btn"
                  title={
                    dream.trim().length < 15
                      ? '夢境文字少於 15 字，暫不可執行'
                      : (paidPreliminary || quickReport)
                      ? '已做初步分析，只需再加 3 顆星升級 Dream Master 深度解夢'
                      : '執行 Dream Master 深度心理學解夢（需 6 顆星）'
                  }
                >
                  {isMasterAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#0a0d1d] border-t-transparent rounded-full animate-spin" />
                      <span>深度心理學解析中…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {(paidPreliminary || quickReport)
                          ? '升級 Dream Master 深度解夢'
                          : 'Dream Master 深度解夢'}
                      </span>
                      {normalizeRole(currentUser?.role || 'free') === 'free' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/35 text-amber-300 font-extrabold font-mono">
                          {(paidPreliminary || quickReport) ? '+3 星 ⭐' : '6 星 ⭐'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 text-[#0a0d1d] font-extrabold">
                          VIP
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* DREAM MASTER RESULT CARD */}
          {masterAnalysis && (
            <section
              className="card p-6 sm:p-7 rounded-3xl border border-[#aa9cff]/40 bg-gradient-to-b from-[#12162c] to-[#090c1b] space-y-5 shadow-2xl"
              id="dream-master-sop-card"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#aa9cff]/20 border border-[#aa9cff]/30 text-[#aa9cff] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                        Dream Master 深度心理學解讀
                      </h2>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#78e1b5]/15 text-[#78e1b5] border border-[#78e1b5]/30 font-medium">
                        榮格原型與文獻對映
                      </span>
                    </div>
                    <p className="text-xs text-[#8d97b5]">
                      融合榮格分析心理學、現代睡眠科學與經典文獻透視
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {copiedWordNotice && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/40 text-xs font-semibold flex items-center gap-1 animate-pulse">
                      <Check className="w-3.5 h-3.5" />
                      已複製！可貼入 Word
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyMasterText}
                    className="btn2 text-xs px-2.5 py-1.5 flex items-center gap-1 cursor-pointer hover:border-[#aa9cff] text-[#cbd2ef]"
                    title="複製整份報告文字，格式相容 Microsoft Word 及各筆記軟體"
                    id="master-copy-word-btn"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#aa9cff]" />
                    <span>複製全文</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportMasterToWord}
                    className="btn2 text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer border-[#71d9ff]/40 text-[#71d9ff] hover:bg-[#71d9ff]/10"
                    title="下載 Microsoft Word 格式 (.doc) 檔案"
                    id="master-export-word-btn"
                  >
                    <Download className="w-3.5 h-3.5 text-[#71d9ff]" />
                    <span>匯出 Word 檔 (.doc)</span>
                  </button>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono">
                    字數：{masterAnalysis.word_count} 字
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#71d9ff] font-mono">
                    {masterAnalysis.source === 'gemini' ? 'Gemini 3.8 Flash' : '專業心理模型'}
                  </span>
                </div>
              </div>

              {/* Psychological Dimensions & Literature Overview */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Brain className="w-3.5 h-3.5 text-[#71d9ff]" />
                  <span>深度解析心理原型維度：</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#111425] border border-white/10 text-center">
                    <div className="text-[11px] text-[#8d97b5]">核心意象對映</div>
                    <div className="text-sm font-bold text-[#78e1b5] mt-0.5">
                      {masterAnalysis.retrieved_counts.symbols} 項
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111425] border border-white/10 text-center">
                    <div className="text-[11px] text-[#8d97b5]">潛意識主題維度</div>
                    <div className="text-sm font-bold text-[#71d9ff] mt-0.5">
                      {masterAnalysis.retrieved_counts.themes} 項
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111425] border border-white/10 text-center">
                    <div className="text-[11px] text-[#8d97b5]">心理學大師典籍</div>
                    <div className="text-sm font-bold text-[#aa9cff] mt-0.5">
                      {masterAnalysis.retrieved_counts.books_and_rules} 則
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Psychological Analysis Content (400-800 words) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1020]/90 border border-white/10 text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap space-y-4 font-sans tracking-wide">
                {masterAnalysis.analysis_text}
              </div>

              {/* Mandatory Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">{masterAnalysis.disclaimer}</span>
                </div>
                <span className="text-[11px] text-amber-300/80">心理學參考 · 非命運預測</span>
              </div>

              {/* Multi-turn Context Management & Follow-up Conversation (對話輪次管理) */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#aa9cff]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      深入追問此夢（對話輪次管理）
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#78e1b5]">
                    僅攜帶上一輪壓縮摘要 (≤200 Token) · 不重傳檢索庫
                  </span>
                </div>

                {/* Follow-up history list */}
                {followUpHistory.length > 0 && (
                  <div className="space-y-3">
                    {followUpHistory.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#71d9ff]">
                          <span>Q{idx + 1} 追問：</span>
                          <span>{item.q}</span>
                        </div>
                        <div className="text-[#cbd2ef] whitespace-pre-wrap leading-relaxed border-t border-white/5 pt-2">
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up input form */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendFollowUp();
                      }
                    }}
                    placeholder="針對此夢進一步追問……（例如：夢中推不開的門在心理學上代表甚麼？）"
                    className="flex-1 bg-[#111425] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#6a759b] focus:outline-none focus:border-[#aa9cff]"
                  />
                  <button
                    type="button"
                    onClick={handleSendFollowUp}
                    disabled={isFollowUpLoading || !followUpQuestion.trim()}
                    className="btn text-xs px-4 py-2.5 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isFollowUpLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>提交追問</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

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

              {/* POST-DREAM HEALING PRODUCT RECOMMENDATION (Post-Analysis Selection) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/20 to-black border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
                    🌿
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                        解夢轉運選物
                      </span>
                      <span className="text-[11px] text-amber-300 font-medium">
                        零離 · 廣東碌柚葉香水噴霧 (去霉開運)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#cbd2ef] leading-relaxed line-clamp-1">
                      嶺南古方碌柚葉黃酮，醒後一噴驅散夢境黏滯與心神不寧，重置清爽個人氣場。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <span className="text-xs font-bold text-white">HK$68</span>
                  <button
                    type="button"
                    onClick={() => onGoToStore && onGoToStore('prod_pomelo_spray')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>選購去霉</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* STEP 2 INVITATION: 升級 Dream Master 深度解夢 (需加 3 星) */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#aa9cff]/5 p-4 rounded-2xl border border-[#aa9cff]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#c3b9ff]">
                    <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
                    <span>升級 Dream Master 深度解夢？</span>
                    {currentUser && normalizeRole(currentUser.role) !== 'free' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/30">
                        {getRoleDisplayName(currentUser.role)} · 免扣星尊享
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                        折抵後只需 +3 顆星 ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#aab3d2] leading-relaxed">
                    {currentUser && normalizeRole(currentUser.role) === 'free'
                      ? `你已完成初步分析（消耗 3 顆星）。現只需再加 3 顆星星幣（目前結餘：${currentUser.stars ?? 0} 顆），即可展開 400-800 字深度心理學剖析與典籍文獻交叉檢索！`
                      : '付費會員已享尊貴特權：直接解鎖 Dream Master 深度心理學剖析，並同步更新你的 DREAM DNA™️。'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {currentUser && normalizeRole(currentUser.role) === 'free' && onOpenEarnStars && (
                    <button
                      type="button"
                      onClick={onOpenEarnStars}
                      className="px-3 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/35 hover:bg-amber-400/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="睇 10 秒心靈短片賺星星幣"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>睇片儲星 (+1)</span>
                    </button>
                  )}

                  {onGoToPricing && (
                    <button
                      type="button"
                      onClick={onGoToPricing}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 cursor-pointer"
                      title="查看方案與星星幣兌換詳情"
                    >
                      方案詳情
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRunMasterAnalysis}
                    disabled={isMasterAnalyzing}
                    className="btn text-xs px-5 py-2.5 font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-[#aa9cff]/20 cursor-pointer bg-gradient-to-r from-[#aa9cff] to-[#71d9ff] text-[#0a0d1d] hover:brightness-110"
                    id="trigger-master-upgrade-from-quick-btn"
                  >
                    {isMasterAnalyzing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#0a0d1d] border-t-transparent rounded-full animate-spin" />
                        <span>深度解析中…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {currentUser && normalizeRole(currentUser.role) !== 'free'
                            ? '👑 直接升級 Dream Master 深度解夢'
                            : (currentUser?.stars ?? 0) >= 3
                            ? '🔮 加 3 星升級 Dream Master 深度解夢'
                            : '🎬 儲星星幣加 3 星升級深度解夢'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
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

              {/* POST-DREAM PRODUCT RECOMMENDATION BANNER */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-black border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/30">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
                    🌿
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                        解夢轉化配方 · 實體選物推薦
                      </span>
                      <span className="text-xs text-white font-bold">
                        零離 · 廣東精選碌柚葉好運香水噴霧
                      </span>
                    </div>
                    <p className="text-xs text-[#cbd2ef] leading-relaxed">
                      針對本場夢境意象，醒後以柚葉黃酮純露一噴淨化身心能量場，去霉開運、安神定心。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                  <div className="text-right">
                    <div className="text-sm font-black text-white">HK$68</div>
                    <div className="text-[10px] text-amber-300 font-mono">支援星星幣折抵</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onGoToStore && onGoToStore('prod_pomelo_spray')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>選購轉運</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

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

          {/* Dream Journal Manager (Tags, Multi-field Search, PDF Export, Morning Reminder) */}
          <DreamJournalManager
            history={history}
            onSelectEntry={(entry) => setSelectedEntry(entry)}
            onUpdateEntryTags={handleUpdateEntryTags}
          />
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
        therapists={therapists}
        prefilledDreamText={dream}
      />
    </div>
  );
};
