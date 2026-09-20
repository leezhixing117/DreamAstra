import React, { useState } from 'react';
import {
  Sparkles,
  Dna,
  Compass,
  Key,
  Heart,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Check,
  X,
  BookOpen,
  Brain,
  MessageSquare,
  ChevronDown,
  Star,
  Lock,
  Eye,
} from 'lucide-react';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';
import { DreamPortalModal } from './DreamPortalModal';
import { TherapistItem } from '../types';

interface HomeViewProps {
  onStartWithDream: (dreamText: string) => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onGoToAdmin: () => void;
  onGoToPricing?: () => void;
  onGoToPrivacy?: () => void;
  therapists?: TherapistItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartWithDream,
  onGoToApp,
  onGoToPricing,
  onGoToPrivacy,
  therapists,
}) => {
  const [draftDream, setDraftDream] = useState('');
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Structured guide prompt additions
  const handleAppendPrompt = (hintText: string) => {
    setDraftDream((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return hintText;
      return `${trimmed}\n${hintText}`;
    });
  };

  const handleStart = () => {
    onStartWithDream(draftDream.trim());
  };

  const faqs = [
    {
      q: 'AI 解夢準唔準？',
      a: 'AI 解夢唔係算命籤文，冇絕對嘅「準唔準」，而係一面映照你內心深處嘅鏡子。我哋先從卡爾·榮格（Carl G. Jung）嘅《人及其象徵》、現代原型心理學與華人文化層中找出相應理論依據，再比對你生活情境與重複意象，啟發你思考白天壓抑或忽略咗嘅情緒與渴望。',
      icon: BookOpen,
      badge: '理論與原型依據',
    },
    {
      q: '我嘅夢境紀錄會唔會俾其他人睇？',
      a: '絕對唔會。夢境係人最私密嘅內心世界，所有紀錄只限你個人帳戶瀏覽；我哋絕不公開、絕不出售轉讓數據，亦明文承諾絕不用於訓練公開通用 AI 模型。你更加可以隨時一鍵清空所有夢境資料，或啟用「純本地模式」將數據只留喺你部手機／電腦。',
      icon: ShieldCheck,
      badge: '極致私隱 · 絕不訓練 AI',
    },
    {
      q: '免費同 AI 深入解密分別係咩？',
      a: '免費版提供單次夢境嘅基礎意象與情緒梳理，最多儲存 3 條記錄；AI 深入解密會調用 Book Brain 典籍文獻進行四層深度交叉分析、挖掘潛意識陰影（Shadow）與情結（Complex），並串聯你過往夢境進行時間線演進對比，累積你的 DREAM DNA™️ 與星圖。',
      icon: Sparkles,
      badge: '功能差異解析',
    },
    {
      q: '如果經常發噩夢點算？',
      a: '發噩夢通常係潛意識喺度強烈提醒你：生活中正面對未消化嘅壓力、創傷或者焦慮。夢境本身唔會傷害你。你可以先嘗試記低夢境情緒，亦可以用我哋嘅清醒夢意象改寫練習；但如果噩夢頻密發生、或者嚴重影響日常生活同睡眠品質，強烈建議尋找註冊臨床心理學家或精神科醫生等專業醫療協助。',
      icon: Heart,
      badge: '專業心理關懷',
    },
  ];

  return (
    <main id="home-view-main" className="overflow-hidden bg-transparent">
      {/* HERO SECTION - Nocturnal, Breathing Room, Mobile Optimized */}
      <section className="hero shell relative py-12 sm:py-16 md:py-24 text-center" id="hero-section">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[700px] h-[300px] bg-gradient-to-tr from-[#aa9cff]/20 via-[#71d9ff]/15 to-transparent rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

        {/* Eyebrow */}
        <div className="glass-pill inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold text-[#dce0ff]" id="hero-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
          <span>DREAMWISDOM · 專為香港廣東話設計的夢境宇宙</span>
        </div>

        {/* Primary Headline - Strictly one line display */}
        <h1
          id="hero-title"
          className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight max-w-5xl mx-auto leading-tight whitespace-nowrap px-2 drop-shadow-md"
        >
          每一個夢，都是潛意識留給你的信。
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-2xl font-medium text-white/90 max-w-2xl mx-auto mt-3 px-2 drop-shadow-sm" id="hero-lead">
          別人解讀你的夢。<b>我們記得你的夢。</b>
        </p>


        {/* Small Fine Print Lines */}
        <div className="mt-3.5 space-y-1.5 max-w-2xl mx-auto px-4">
          <p className="text-xs sm:text-[13px] text-[#aab3d2] leading-relaxed max-w-xl mx-auto">
            DreamWisdom 唔係憑空估，而係先從 Book Brain 找出相關理論，再由 AI 結合你過往夢境，整理可能值得留意嘅訊息。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#8d97b5] pt-1">
            <span>免費探索你的夢境宇宙。若重複夢魘持續帶來困擾，</span>
            <button
              type="button"
              onClick={() => setIsTherapeuticOpen(true)}
              className="text-[#78e1b5] hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              <Heart className="w-3 h-3 inline" />
              我們提供後續療癒支援選項
            </button>
          </div>
        </div>

        {/* Dual Column Layout: Dream Input Box + Subconscious Portal Card */}
        <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          {/* Left Column: Interactive Dream Input Box (7 Cols on Desktop) */}
          <div className="lg:col-span-7 dreambox relative z-10 w-full" id="hero-dreambox">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs font-semibold text-[#c3b9ff] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
                <span>記錄今晨夢境</span>
              </span>
              <span className="text-[11px] text-[#8e98b7]">輸入醒來記得的任何片段</span>
            </div>

            {/* Textarea Area */}
            <div className="relative p-3.5 sm:p-4">
              <textarea
                value={draftDream}
                onChange={(e) => setDraftDream(e.target.value)}
                placeholder="寫低你記得嘅夢境……醒來時有甚麼畫面？你當時感覺點？（可自由輸入或點擊下方標籤快速加字）"
                id="hero-dream-textarea"
                rows={4}
                className="w-full bg-transparent border-0 text-white placeholder-[#7c88aa] text-base focus:outline-none resize-none leading-relaxed min-h-[130px] sm:min-h-[140px]"
              />
              {/* Live Character Count indicator */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-[#8e98b7]">
                <span>
                  {draftDream.trim().length >= 15 ? (
                    <span className="text-[#78e1b5]">✓ 已達 {draftDream.trim().length} 字，符合解析標準</span>
                  ) : draftDream.trim().length > 0 ? (
                    <span className="text-amber-300">目前 {draftDream.trim().length} 字（建議達 15 字以上）</span>
                  ) : (
                    <span>自由記錄醒來片段</span>
                  )}
                </span>
                <span className="font-mono text-[#aa9cff]">{draftDream.trim().length} 字</span>
              </div>
            </div>

            {/* Mobile-Friendly Structured Prompting Chips */}
            <div className="px-3.5 sm:px-4 py-2 border-t border-white/5 bg-black/20 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#8e98b7] self-center mr-1">引導提示：</span>
              {[
                { label: '👥 有邊啲人物？', text: '【夢中人物】：' },
                { label: '📍 場景係邊度？', text: '【場景地點】：' },
                { label: '💭 感覺驚／開心／不安？', text: '【當時心情感覺】：' },
                { label: '🚪 有冇特定物件？', text: '【關鍵物件】：' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendPrompt(chip.text)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#aab3d2] hover:text-white border border-white/5 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Quick Word Addition Chips */}
            <div className="px-3.5 sm:px-4 py-1.5 border-t border-white/5 bg-black/30 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#aa9cff] self-center mr-1 font-medium">快速加字：</span>
              {[
                { label: '🌊 海洋水流', text: '海洋大水' },
                { label: '👣 赤腳無鞋', text: '赤腳沒穿鞋' },
                { label: '🏃 被人追趕', text: '被黑影追趕狂奔' },
                { label: '🏚️ 舊居祖屋', text: '童年舊屋' },
                { label: '🕯️ 家宅神枱', text: '神枱香火' },
                { label: '🏫 課室考試', text: '學校課室考試' },
              ].map((w, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDraftDream((prev) => {
                      const trimmed = prev.trim();
                      return trimmed ? `${trimmed}，夢見${w.text}` : `昨晚夢見${w.text}`;
                    });
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#aa9cff]/10 hover:bg-[#aa9cff]/20 text-[#c3b9ff] border border-[#aa9cff]/20 transition-colors cursor-pointer"
                  title={`點擊加入「${w.label}」`}
                >
                  +{w.label}
                </button>
              ))}
            </div>

            {/* Primary Action Footer with Clear Single CTA Button */}
            <div className="dreamboxActions p-4 flex flex-col sm:flex-row items-center justify-between gap-3.5 border-t border-white/10 bg-black/40">
              <div className="text-xs text-[#8e98b7] flex items-center gap-2 text-center sm:text-left">
                <span>✨ 免費輸入即獲基本分析</span>
                <span>•</span>
                <span>🧠 支援串連過往夢境累積指紋</span>
              </div>

              {/* Primary CTA - Distinct & Explicit to reduce hesitation */}
              <button
                type="button"
                onClick={handleStart}
                className="w-full sm:w-auto btn text-sm sm:text-base px-7 py-3 font-bold shadow-xl shadow-[#aa9cff]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                id="hero-cta-record-btn"
              >
                <span>免費記錄第一個夢</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Dream Portal Card (5 Cols on Desktop) */}
          <div className="lg:col-span-5 relative w-full flex flex-col rounded-3xl overflow-hidden glass-modern border border-[#aa9cff]/30 shadow-2xl shadow-[#aa9cff]/20 group transition-all duration-300 hover:border-[#aa9cff]/60">
            {/* Image Artwork Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={() => setIsPortalModalOpen(true)}>
              <img
                src="/dream_cover_vertical.jpg"
                alt="夢境宇宙門戶 - 潛意識之鑰與櫻花浮島"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1329] via-[#0e1329]/20 to-transparent" />
              
              {/* Floating Archetype Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                <Key className="w-3.5 h-3.5 text-[#ffd27a]" />
                <span>92項核心意象 · 視覺門戶</span>
              </div>

              {/* Preview Explore Button on Image */}
              <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-[#0e1329]/80 hover:bg-[#0e1329] backdrop-blur-md border border-white/25 text-xs font-medium text-white flex items-center gap-1.5 transition-all shadow-lg">
                <Eye className="w-3.5 h-3.5 text-[#aa9cff]" />
                <span>點擊探索圖解</span>
              </div>
            </div>


            {/* Card Content & Symbol Chips */}
            <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-base font-serif font-bold text-white tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#aa9cff]" />
                    <span>夢境之鑰與潛意識浮島</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#71d9ff]/10 text-[#71d9ff] border border-[#71d9ff]/20 font-mono">
                    22本大師典籍
                  </span>
                </div>
                <p className="text-xs text-[#aab3d2] leading-relaxed">
                  融合榮格「自性化浮島」、弗洛伊德「心靈之鑰」與情緒彩虹星河。點擊即可沉浸解析每一處畫面背後對應的心理學原型。
                </p>
              </div>

              {/* Quick Inspiration Pills from Artwork */}
              <div>
                <div className="text-[11px] text-[#8e98b7] mb-1.5 font-medium">快速加入本畫作象徵元素：</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '🗝️ 黃金鑰匙', text: '找到了懸浮於雲海的發光金鑰匙' },
                    { label: '🌸 櫻花浮島', text: '漂浮在空中的綠色小島與盛開櫻花' },
                    { label: '🌈 彩虹光流', text: '像彩虹一般發光的河流穿過雲海' },
                    { label: '🌌 翠綠極光', text: '天空中舞動著翠綠色的奇幻極光' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAppendPrompt(`【視覺象徵】：${p.text}`)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#aa9cff]/20 text-[#c3b9ff] border border-white/10 hover:border-[#aa9cff]/30 transition-all cursor-pointer"
                      title="點擊套用至夢境輸入框"
                    >
                      +{p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-[#8e98b7]">已完整建置 1～92 號詞庫</span>
                <button
                  type="button"
                  onClick={() => setIsPortalModalOpen(true)}
                  className="text-xs font-semibold text-[#aa9cff] hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>意象全解析</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS (如何運作 · 無需預設範本，直接記錄真實夢境) */}
      <section className="shell py-12 sm:py-16 border-t border-white/10" id="how">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-[#c3b9ff] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
            <span>如何運作 · HOW IT WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            無需任何預設範本，直接看懂你的夢
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-2.5 max-w-xl mx-auto leading-relaxed">
            告別千篇一律的「經典試試」與算命套話。每一次醒來，只要直接寫下你的真實所夢，系統即刻展開三步心理學解讀與長期檔案串連。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="card p-6 sm:p-7 rounded-3xl bg-[#0e1224]/80 border border-white/10 relative group hover:border-[#aa9cff]/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-mono font-black text-[#aa9cff]/60">01</span>
              <div className="w-10 h-10 rounded-2xl bg-[#aa9cff]/15 border border-[#aa9cff]/30 flex items-center justify-center text-[#c3b9ff]">
                <Brain className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2">
              寫下真實夢境細節
            </h3>
            <p className="text-xs sm:text-[13px] text-[#8d97b5] leading-relaxed">
              醒來後自由寫下你記得的人物、場景或即時情緒（至少 15 字，亦可善用上方引導標籤）。這是你獨一無二的潛意識投影，無需任何他人範本。
            </p>
          </div>

          {/* Step 2 */}
          <div className="card p-6 sm:p-7 rounded-3xl bg-[#0e1224]/80 border border-white/10 relative group hover:border-[#71d9ff]/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-mono font-black text-[#71d9ff]/60">02</span>
              <div className="w-10 h-10 rounded-2xl bg-[#71d9ff]/15 border border-[#71d9ff]/30 flex items-center justify-center text-[#71d9ff]">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2">
              SQL 心理意象庫精確檢索
            </h3>
            <p className="text-xs sm:text-[13px] text-[#8d97b5] leading-relaxed">
              系統依據你的情節，精確檢索榮格原型、東方文化意象與當代文獻片段，產出 600～900 字深度心理學透視，嚴禁迷信算命與吉凶妄斷。
            </p>
          </div>

          {/* Step 3 */}
          <div className="card p-6 sm:p-7 rounded-3xl bg-[#0e1224]/80 border border-white/10 relative group hover:border-[#78e1b5]/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-mono font-black text-[#78e1b5]/60">03</span>
              <div className="w-10 h-10 rounded-2xl bg-[#78e1b5]/15 border border-[#78e1b5]/30 flex items-center justify-center text-[#78e1b5]">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2">
              沉澱 DREAM DNA™️ 與星圖
            </h3>
            <p className="text-xs sm:text-[13px] text-[#8d97b5] leading-relaxed">
              不同於關閉即忘的普通網站，你的每一次記錄都會連入專屬心靈星圖，洞察「水從洶湧到平靜」等重複模式，見證長期的自我整合。
            </p>
          </div>
        </div>

        <div className="text-center mt-9">
          <button
            type="button"
            onClick={handleStart}
            className="btn text-xs sm:text-sm px-7 py-3 font-semibold rounded-2xl shadow-lg shadow-[#aa9cff]/20 cursor-pointer inline-flex items-center gap-2"
          >
            <span>開始寫下你的真實夢境</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION: DIFFERENCE FROM ORDINARY DREAM WEBSITES (快速講清楚差異點) */}
      <section className="shell py-12 sm:py-16 border-t border-white/10" id="comparison-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-[#c3b9ff] text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>核心差異 · 為什麼選擇 DREAMWISDOM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            不只解一次夢，更為你建立潛意識檔案
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-2">
            區別於普通網頁的千篇一律模板，我們聚焦於你個人的長期心靈演變。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Card A: Ordinary Dream Sites */}
          <div className="card p-6 sm:p-7 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#8d97b5]">
                <X className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm sm:text-base text-[#cbd2ef]">普通解夢網站 / 傳統字典</b>
                <p className="text-[11px] text-[#8d97b5]">單次查詢 · 通用標籤</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-[13px] text-[#8d97b5] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                <span><b>通用標籤套話：</b>輸入一個夢，只給出「周公解夢」或千篇一律的固定辭典解釋，與你的真實生活無關。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                <span><b>單次消費，關閉即忘：</b>無法保存你的歷史夢境，每一次輸入都是孤立點，無法看出內在規律。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                <span><b>模糊玄學與吉凶：</b>夾雜「行大運」或「大難臨頭」等算命口吻，徒增不必要的焦慮與迷信。</span>
              </li>
            </ul>
          </div>

          {/* Card B: DreamWisdom Advantage */}
          <div className="card p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#aa9cff]/10 via-[#101428] to-[#0c0f1f] border border-[#aa9cff]/35 space-y-4 shadow-xl shadow-[#aa9cff]/10">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#aa9cff]/20">
              <div className="w-8 h-8 rounded-xl bg-[#aa9cff]/20 border border-[#aa9cff]/40 flex items-center justify-center text-[#aa9cff]">
                <Check className="w-4 h-4 text-[#78e1b5]" />
              </div>
              <div>
                <b className="text-sm sm:text-base text-white">DreamWisdom 現代潛意識鏡子</b>
                <p className="text-[11px] text-[#78e1b5] font-medium">長期累積 · 專屬心靈指紋</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-[13px] text-[#cbd2ef] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#78e1b5] font-bold shrink-0 mt-0.5">✓</span>
                <span><b>Book Brain 理論依據：</b>先從榮格心理學與東方典籍找出理論，再由 AI 為你梳理真正值得留意嘅訊息。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#78e1b5] font-bold shrink-0 mt-0.5">✓</span>
                <span><b>累積個人模式：</b>記低每個夢，建立 DREAM DNA™️ 與星圖，發現「水從洶湧變成平靜」的心靈轉變軌跡。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#78e1b5] font-bold shrink-0 mt-0.5">✓</span>
                <span><b>自我觀察日記定位：</b>不做吉凶預測，不搞迷信玄學，專注於情緒覺察、心理整合與現實生活啟發。</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            type="button"
            onClick={handleStart}
            className="btn text-xs sm:text-sm px-6 py-2.5 rounded-xl cursor-pointer"
          >
            <span>立即體驗專屬記錄 →</span>
          </button>
        </div>
      </section>

      {/* SECTION: THREE PILLARS (DREAM DNA / CONSTELLATION / 30 NIGHTS) */}
      <section className="shell py-12 sm:py-16 border-t border-white/10" id="three-pillars-section">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-[#c3b9ff] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>淺白解釋 · 拒絕過度包裝</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            三大夢境核心支柱
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-1.5">
            不僅解今晚的一場夢，更為你串連終身的潛意識演進。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div
            onClick={() => onGoToApp('dna')}
            className="card p-6 rounded-3xl bg-[#0f1225]/80 border border-[#aa9cff]/20 hover:border-[#aa9cff]/50 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#aa9cff]/15 flex items-center justify-center text-[#c3b9ff] mb-3">
              <Dna className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">① DREAM DNA™️</h3>
            <p className="text-xs text-[#78e1b5] font-mono mt-0.5">你的夢境指紋</p>
            <p className="text-xs text-[#aab3d2] mt-2.5 leading-relaxed sm:leading-[1.7]">
              統計你重複遇過嘅場景、物件同情緒，睇下潛意識重複關心啲乜。不再只是片面象徵，而是建立專屬你嘅心靈指紋。
            </p>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => onGoToApp('constellation')}
            className="card p-6 rounded-3xl bg-[#0f1225]/80 border border-[#71d9ff]/20 hover:border-[#71d9ff]/50 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#71d9ff]/15 flex items-center justify-center text-[#71d9ff] mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">② 星圖 CONSTELLATION™️</h3>
            <p className="text-xs text-[#71d9ff] font-mono mt-0.5">夢境連線</p>
            <p className="text-xs text-[#aab3d2] mt-2.5 leading-relaxed sm:leading-[1.7]">
              將唔同夢境嘅人、地、情緒連成星圖，發現潛意識心境轉變軌跡（例如水從洪水變平靜、黑影從追逐到對話）。
            </p>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => onGoToApp('mystery')}
            className="card p-6 rounded-3xl bg-[#0f1225]/80 border border-[#ffd27a]/20 hover:border-[#ffd27a]/50 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ffd27a]/15 flex items-center justify-center text-[#ffd27a] mb-3">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">③ 30 NIGHTS MYSTERY™️</h3>
            <p className="text-xs text-[#ffd27a] font-mono mt-0.5">30晚潛意識檔案</p>
            <p className="text-xs text-[#aab3d2] mt-2.5 leading-relaxed sm:leading-[1.7]">
              每晚解鎖線索碎片，逐步解鎖「你嘅夢在反覆講緊乜」全息報告書，睇清內心深處最真實嘅聲音。
            </p>
          </div>
        </div>

        {/* Dual Track Banner Callout */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-400/10 via-[#aa9cff]/10 to-transparent border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>雙軌制權益：付費直接解鎖，或睇廣告賺「星星幣」試用進階功能！</span>
              </div>
              <p className="text-xs text-[#aab3d2] mt-0.5">
                免費儲存 3 條夢境 · 星星幣可兌換至 10 條與解鎖 AI 深入分析 · 付費享無限存檔與互動星圖
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onGoToPricing && (
              <button
                type="button"
                onClick={onGoToPricing}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 cursor-pointer shadow-md"
              >
                查看三方案詳情 →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: INFORMATION TRANSPARENCY & FAQ (資訊透明度：AI 如何解讀？理論與邊界) */}
      <section className="shell py-12 sm:py-16 border-t border-white/10" id="transparency-faq-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78e1b5]/10 border border-[#78e1b5]/25 text-[#78e1b5] text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>資訊透明度 · TRANSPARENCY & BOUNDARIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            AI 如何解讀？我們的理論與邊界
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-2">
            清晰透明，拒絕黑盒，讓每一次反思都有跡可循。
          </p>
        </div>

        {/* FAQ Accordion Cards */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className={`card rounded-2xl transition-all border ${
                  isOpen
                    ? 'bg-[#12162e] border-[#aa9cff]/40 shadow-lg shadow-[#aa9cff]/10'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c3b9ff] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] px-2 py-0.2 rounded-full bg-[#aa9cff]/15 text-[#aa9cff] inline-block font-mono mb-1">
                        {item.badge}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {item.q}
                      </h4>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#8d97b5] shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen ? 'rotate-180 text-[#aa9cff]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#cbd2ef] leading-relaxed sm:leading-[1.75] border-t border-white/5">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Safe boundary summary banner */}
        <div className="max-w-3xl mx-auto mt-8 p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-xs text-amber-200/90 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <b>溫馨免責提醒：</b>DreamWisdom 是以科技賦能自我覺察的日記工具。所有分析均旨在啟發個人思考與反省，不做絕對吉凶判斷，亦無法取代任何執業醫療、精神科或法律諮詢。
          </p>
        </div>
      </section>

      {/* Therapeutic Support Modal */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
        therapists={therapists}
      />

      {/* Dreamscape Subconscious Portal Modal */}
      <DreamPortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        onSelectSymbolPrompt={handleAppendPrompt}
      />
    </main>
  );
};
