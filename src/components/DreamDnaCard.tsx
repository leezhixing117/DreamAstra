import React, { useState } from 'react';
import { DreamDNA, DreamDnaSymbol } from '../types';
import { Dna, Sparkles, TrendingUp, Compass, Share2, Check, ArrowRight, Eye } from 'lucide-react';

interface DreamDnaCardProps {
  dna: DreamDNA;
  onSelectSymbolForConstellation?: (symbolName: string) => void;
}

export const DreamDnaCard: React.FC<DreamDnaCardProps> = ({ dna, onSelectSymbolForConstellation }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<DreamDnaSymbol | null>(dna.symbols[0] || null);
  const [copied, setCopied] = useState(false);

  const handleShareDna = () => {
    const text = `【我的 Dream DNA™️ 夢境指紋】\n潛意識模式：${dna.narrativeFingerprint}\n核心象徵：水(4次)、門(3次)、被追逐(3次)\n焦慮情緒比例：68%\n在 DreamWisdom 解鎖你的夢境密碼`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card border-[#aa9cff]/30 bg-gradient-to-b from-[#111428] to-[#0a0d1d] relative overflow-hidden p-6 sm:p-8 rounded-3xl" id="dream-dna-card">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#aa9cff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#aa9cff]/15 border border-[#aa9cff]/30 flex items-center justify-center text-[#c3b9ff]">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge">DREAM DNA™️</span>
              <span className="text-xs text-[#78e1b5] font-mono">已累積 {dna.totalDreams} 個夢境樣本</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              你的個人夢境指紋
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShareDna}
          className="btn2 text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#78e1b5]" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? '已複製 DNA 指紋' : '分享我的 Dream DNA'}</span>
        </button>
      </div>

      {/* Breakthrough Narrative Banner - The Wow moment */}
      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#aa9cff]/15 via-[#71d9ff]/10 to-transparent border border-[#aa9cff]/30 relative">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#aa9cff] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#aa9cff] mb-1">
              跨夢境演算法洞察 · 盲點揭示
            </div>
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed italic">
              「{dna.narrativeFingerprint}」
            </p>
            <div className="mt-2 text-xs text-[#aab3d2]">
              系統不只分析單一晚上的隨機意象，而是從長時記憶池中辨識你的核心生命課題。
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Symbols Breakdown & Emotion Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left 2 Cols: Dream DNA Symbols List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>核心重複象徵 (點擊查看演化軌跡)</span>
            <span>出現頻率</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dna.symbols.map((sym) => {
              const isSelected = selectedSymbol?.name === sym.name;
              return (
                <button
                  key={sym.name}
                  type="button"
                  onClick={() => setSelectedSymbol(sym)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#aa9cff]/20 border-[#aa9cff] shadow-lg shadow-[#aa9cff]/10'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {sym.name.includes('水')
                        ? '🌊'
                        : sym.name.includes('門')
                        ? '🚪'
                        : sym.name.includes('居')
                        ? '🏚️'
                        : sym.name.includes('追')
                        ? '🏃'
                        : sym.name.includes('母')
                        ? '👵'
                        : '🔮'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{sym.name}</div>
                      <div className="text-[11px] text-[#8d97b5]">
                        {sym.evolution.length} 個演化節點
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-[#71d9ff]">
                      出現 {sym.count} 次
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-[#aa9cff] transition-transform ${isSelected ? 'translate-x-1' : 'opacity-40'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Symbol Evolution Viewer */}
          {selectedSymbol && (
            <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#71d9ff] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  【{selectedSymbol.name}】在過去夢境中的角色改變弧度：
                </span>
                {onSelectSymbolForConstellation && (
                  <button
                    type="button"
                    onClick={() => onSelectSymbolForConstellation(selectedSymbol.name)}
                    className="text-[11px] text-[#aa9cff] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    在星圖中定位
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {selectedSymbol.evolution.map((evo, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between text-xs"
                  >
                    <div>
                      <span className="text-[#8d97b5] mr-2 font-mono">{evo.date}</span>
                      <b className="text-white">{evo.dreamTitle}</b>
                    </div>
                    <span className="text-[#78e1b5] font-medium shrink-0 ml-3">
                      {evo.state}
                    </span>
                  </div>
                ))}
              </div>

              {selectedSymbol.name.includes('水') && (
                <div className="mt-3 text-xs text-[#aab3d2] bg-[#71d9ff]/10 p-2.5 rounded-xl border border-[#71d9ff]/20">
                  💡 <b>關鍵發現：</b>你 30 日內有 4 個夢出現水。從一開始的平靜無聲漫漲、到洪水衝擊、涉水渡海、最後在岸邊看浪。<b>水的角色正在改變——從威脅轉變為平靜的力量！</b>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Emotions & Recurring Themes */}
        <div className="space-y-6">
          {/* Emotion Spectrum */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold mb-3 flex items-center justify-between">
              <span>情緒頻譜分析</span>
              <span className="text-[#aa9cff] font-mono">68% 焦慮</span>
            </div>

            <div className="space-y-3">
              {dna.emotionRatios.map((emo) => (
                <div key={emo.emotion} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">{emo.emotion}</span>
                    <span className="font-mono text-[#8d97b5]">{emo.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${emo.percentage}%`,
                        backgroundColor: emo.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Themes */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#78e1b5]" />
              <span>反覆出現的 Theme</span>
            </div>

            <div className="space-y-2.5">
              {dna.recurringThemes.map((theme, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <b className="text-white font-medium">{theme.theme}</b>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-[#ffd27a]">
                      出現 {theme.count} 次
                    </span>
                  </div>
                  <p className="text-[11px] text-[#aab3d2] leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
