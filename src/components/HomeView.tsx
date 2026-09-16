import React, { useState } from 'react';
import { Sparkles, Dna, Compass, Key, Mic, Heart, ArrowRight } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { TherapeuticSupportModal } from './TherapeuticSupportModal';

interface HomeViewProps {
  onStartWithDream: (dreamText: string) => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onGoToAdmin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartWithDream,
  onGoToApp,
}) => {
  const [draftDream, setDraftDream] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isTherapeuticOpen, setIsTherapeuticOpen] = useState(false);

  const samplePrompts = [
    { label: '🏫 舊校赤腳找課室', text: '我夢到自己返回以前讀書的學校，但所有人都不認得我。我一直找課室，最後發現自己沒有穿鞋……' },
    { label: '🌊 海水升至屋頂', text: '海水一路無聲地升高，水面漫過街道與窗戶，我爬到最高處的屋頂，看著一片汪洋，雖然害怕，但周圍好安靜。' },
    { label: '🏃 被黑影追逐躲入舊居', text: '有人在身後一直追著我，我心跳好快，一直狂奔，最後推開了一間小時候住過的舊居躲在神枱旁……' },
    { label: '🕯️ 已故母親報夢託付', text: '我夢見回到小時候的祖屋，已故的母親在神枱前遞給我一串金屬鑰匙，眼神好溫柔但講唔出聲……' },
  ];

  const handleStart = () => {
    onStartWithDream(draftDream || samplePrompts[0].text);
  };

  return (
    <main id="home-view-main" className="overflow-hidden">
      {/* HERO SECTION - Clean, Simple, Breathing Room */}
      <section className="hero shell relative py-12 sm:py-20 text-center" id="hero-section">
        {/* Glow backdrop light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#aa9cff]/15 via-[#71d9ff]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Eyebrow */}
        <div className="eyebrow inline-flex items-center gap-2 mb-4" id="hero-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
          <span>DREAMWISDOM · 你的專屬夢境宇宙</span>
        </div>

        {/* Primary Headline - Strictly on ONE single line */}
        <h1 id="hero-title" className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight max-w-5xl mx-auto leading-tight whitespace-nowrap">
          每一個夢，都是潛意識留給你的信。
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl font-medium text-white/90 max-w-2xl mx-auto mt-3" id="hero-lead">
          別人解讀你的夢。<b>我們記得你的夢。</b>
        </p>

        {/* Small Fine Print Lines */}
        <div className="mt-3.5 space-y-1.5 max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#aab3d2]">
            <span>免費探索你的夢境宇宙。若重複的夢持續帶來困擾，</span>
            <button
              type="button"
              onClick={() => setIsTherapeuticOpen(true)}
              className="text-[#78e1b5] hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 inline" />
              我們提供後續療癒支援選項
            </button>
          </div>

          <p className="text-xs text-[#8d97b5] leading-relaxed max-w-xl mx-auto">
            DreamWisdom 唔係憑空估，而係先從 Book Brain 找出相關理論，再由 AI 結合你過往夢境，整理可能值得留意嘅訊息。
          </p>
        </div>

        {/* Interactive Dream Input Box */}
        <div className="dreambox max-w-3xl mx-auto mt-7 relative z-10 text-left" id="hero-dreambox">
          {isVoiceOpen ? (
            <VoiceRecorder
              onDreamRecorded={(organizedText) => {
                setDraftDream(organizedText);
                setIsVoiceOpen(false);
                onStartWithDream(organizedText);
              }}
              onCancel={() => setIsVoiceOpen(false)}
            />
          ) : (
            <>
              <div className="relative">
                <textarea
                  value={draftDream}
                  onChange={(e) => setDraftDream(e.target.value)}
                  placeholder="寫低你記得嘅夢境……醒來時有甚麼畫面？（可直接打字或使用廣東話語音輸入）"
                  id="hero-dream-textarea"
                  rows={4}
                />

                {/* Voice button */}
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(true)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-[#aa9cff]/20 hover:bg-[#aa9cff]/30 text-[#c3b9ff] border border-[#aa9cff]/40 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  title="切換廣東話語音輸入"
                >
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">🎙️ 廣東話講夢</span>
                </button>
              </div>

              {/* Sample Pills */}
              <div className="flex flex-wrap gap-2 px-4 py-2.5 border-t border-white/5 bg-white/[0.02]">
                <span className="text-xs text-[#8e98b7] self-center">快速試試：</span>
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDraftDream(p.text)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#cbd2ef] hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="dreamboxActions p-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/30">
                <div className="text-xs text-[#8e98b7] flex items-center gap-3">
                  <span>✨ 輸入後即獲簡單基本分析</span>
                  <span>•</span>
                  <span>🔮 可選擇進一步 AI 深入解密</span>
                </div>

                <button
                  type="button"
                  onClick={handleStart}
                  className="btn text-sm px-6 py-2.5 font-semibold shadow-lg shadow-[#aa9cff]/20 flex items-center gap-2"
                  id="hero-cta-record-btn"
                >
                  <span>記錄你的夢（免費開始）</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* THREE PILLARS - Clean & Concise without word walls */}
      <section className="shell py-12 border-t border-white/5" id="three-pillars-section">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            三大夢境核心支柱
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-1.5">
            不僅解今晚的一場夢，更為你串連終身的潛意識宇宙。
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
            <p className="text-xs text-[#78e1b5] font-mono mt-0.5">你的個人夢境指紋</p>
            <p className="text-xs text-[#aab3d2] mt-2 leading-relaxed">
              統計象徵頻率（水、門、舊居）與情緒分佈，不再只是片面象徵，而是建立你的專屬心靈指紋。
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
            <p className="text-xs text-[#71d9ff] font-mono mt-0.5">夢境宇宙網絡連線</p>
            <p className="text-xs text-[#aab3d2] mt-2 leading-relaxed">
              將不同夢境的人、地、情緒連成星圖，發現「水從洪水變平靜」等心境轉變軌跡。
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
            <p className="text-xs text-[#ffd27a] font-mono mt-0.5">30日逐步揭示潛意識</p>
            <p className="text-xs text-[#aab3d2] mt-2 leading-relaxed">
              每晚解鎖線索碎片，最後生成一份震撼的「你的夢在反覆講甚麼」全息報告書。
            </p>
          </div>
        </div>
      </section>

      {/* Therapeutic Support Modal */}
      <TherapeuticSupportModal
        isOpen={isTherapeuticOpen}
        onClose={() => setIsTherapeuticOpen(false)}
      />
    </main>
  );
};
