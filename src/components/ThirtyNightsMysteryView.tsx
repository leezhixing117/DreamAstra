import React, { useState } from 'react';
import { ThirtyNightsJourney, ThirtyNightsClue } from '../types';
import { Key, Lock, Unlock, Sparkles, Award, Compass, FileText, Share2, Check } from 'lucide-react';

interface ThirtyNightsMysteryViewProps {
  journey: ThirtyNightsJourney;
  onRecordNewNight?: () => void;
}

export const ThirtyNightsMysteryView: React.FC<ThirtyNightsMysteryViewProps> = ({
  journey,
  onRecordNewNight,
}) => {
  const [selectedClue, setSelectedClue] = useState<ThirtyNightsClue | null>(journey.clues[0] || null);
  const [copied, setCopied] = useState(false);

  const percentage = Math.round((journey.completedNights / journey.targetNights) * 100);

  const handleShareMystery = () => {
    const text = `【30 Nights Dream Mystery™️ 夢境密碼】\n我已完成 ${journey.completedNights}/30 夜潛意識解密！\n階段核心意象：${journey.overallMysteryReport?.coreMetaphor}\n在 DreamWisdom 慢慢破解你的夢境世界。`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card border-[#aa9cff]/30 bg-gradient-to-b from-[#10142a] via-[#0b0e20] to-[#070915] p-6 sm:p-8 rounded-3xl relative overflow-hidden" id="thirty-nights-mystery-view">
      {/* Ambient background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#ffd27a]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge">
              <Key className="w-3 h-3 text-[#ffd27a]" />
              30 NIGHTS DREAM MYSTERY™️
            </span>
            <span className="text-xs text-[#ffd27a] font-mono">
              第 {journey.completedNights} / {journey.targetNights} 夜
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            30 日夢境密碼揭示
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-1 max-w-2xl leading-relaxed">
            一個夢，看見一個訊息。一個月，看見自己的模式。
            每晚收集潛意識線索，逐步拼湊出你的心靈地圖，最終生成專屬「你的夢在反覆講甚麼」全息報告。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareMystery}
            className="btn2 text-xs flex items-center gap-1.5 px-3.5 py-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#78e1b5]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '已複製解密進度' : '分享解密進度'}</span>
          </button>
          {onRecordNewNight && (
            <button
              type="button"
              onClick={onRecordNewNight}
              className="btn text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>記錄今晚線索</span>
            </button>
          )}
        </div>
      </div>

      {/* Journey Progress Bar & Milestone Badges */}
      <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
          <span className="text-white font-medium">解密進度：已解開 {percentage}% 潛意識碎片</span>
          <span className="font-mono text-[#78e1b5]">
            🔥 連續記錄 {journey.currentStreak} 晚 · 距離下一階段線索解鎖還差 2 晚
          </span>
        </div>

        {/* Outer bar */}
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full bg-gradient-to-r from-[#aa9cff] via-[#71d9ff] to-[#ffd27a] rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Milestone checkpoints */}
        <div className="flex justify-between items-center text-[10px] text-[#8d97b5] mt-3 px-1">
          <span className="text-[#aa9cff] font-semibold">Day 1 啟航 ✓</span>
          <span className="text-[#71d9ff] font-semibold">Day 7 陰影警報 ✓</span>
          <span className="opacity-70">Day 14 中程整合 (鎖定)</span>
          <span className="opacity-70">Day 21 轉型密碼 (鎖定)</span>
          <span className="text-[#ffd27a] font-semibold">Day 30 全息揭密 🏆</span>
        </div>
      </div>

      {/* Clues Collector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left 7 Cols: Unlocked & Locked Clues list */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs text-[#8d97b5] uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>每晚解密線索匣 (Clues Collector)</span>
            <span>共 {journey.clues.length} 塊拼圖</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {journey.clues.map((clue) => {
              const isSelected = selectedClue?.night === clue.night;
              return (
                <button
                  key={clue.night}
                  type="button"
                  onClick={() => setSelectedClue(clue)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                    !clue.unlocked
                      ? 'bg-black/30 border-white/5 opacity-60 hover:opacity-80'
                      : isSelected
                      ? 'bg-[#ffd27a]/15 border-[#ffd27a] shadow-lg shadow-[#ffd27a]/10'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white">
                      {clue.date}
                    </span>
                    {clue.unlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-[#78e1b5]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#8d97b5]" />
                    )}
                  </div>

                  <b className={`text-xs ${clue.unlocked ? 'text-white' : 'text-[#8d97b5]'}`}>
                    {clue.clueTitle}
                  </b>

                  <p className="text-[11px] text-[#aab3d2] line-clamp-2 mt-1">
                    {clue.clueText}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Clue Detail & Phase Synthesis Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phase Synthesis Card */}
          {journey.overallMysteryReport && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a172e] to-[#0c0d1d] border border-[#ffd27a]/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-[#ffd27a]" />
                <span className="text-[11px] font-semibold text-[#ffd27a] uppercase tracking-wider">
                  30 NIGHTS STAGE VERDICT · 階段性判詞
                </span>
              </div>

              <h3 className="text-xl font-serif font-bold text-white mb-2">
                {journey.overallMysteryReport.coreMetaphor}
              </h3>

              <p className="text-xs text-[#d8ddf0] leading-relaxed mb-4">
                {journey.overallMysteryReport.deepSynthesis}
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[#78e1b5]">
                <b>潛意識指示：</b>
                {journey.overallMysteryReport.subconsciousDirective}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#8d97b5]">集齊 30 夜將自動解鎖全景長篇 PDF</span>
                <span className="text-[#ffd27a] font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  已準備好 1/3
                </span>
              </div>
            </div>
          )}

          {/* Selected Clue Card */}
          {selectedClue && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#8d97b5] uppercase">線索細節</span>
                <span className="text-xs text-[#ffd27a] font-mono">{selectedClue.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{selectedClue.clueTitle}</h4>
              <p className="text-xs text-[#aab3d2] leading-relaxed mb-3">
                {selectedClue.clueText}
              </p>
              {selectedClue.unlocked ? (
                <div className="text-[11px] text-[#78e1b5] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  此線索已永久收錄於你的夢境基因庫中。
                </div>
              ) : (
                <div className="text-[11px] text-[#8d97b5] flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  繼續記錄即可在達標當晚解鎖破譯。
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
