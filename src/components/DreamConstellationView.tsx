import React, { useState } from 'react';
import { ConstellationNode, ConstellationLink, DreamEntry } from '../types';
import { Sparkles, Compass, Layers, Info, Eye, ExternalLink, X } from 'lucide-react';

interface DreamConstellationViewProps {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
  dreams: DreamEntry[];
  onOpenReportDetail: (entry: DreamEntry) => void;
  focusedSymbol?: string;
}

export const DreamConstellationView: React.FC<DreamConstellationViewProps> = ({
  nodes,
  links,
  dreams,
  onOpenReportDetail,
  focusedSymbol,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('star_3'); // default focus on Ocean
  const [activeSymbolFilter, setActiveSymbolFilter] = useState<string>(focusedSymbol || '海');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeNode = nodes.find((n) => n.id === selectedNodeId);
  const activeDream = dreams.find((d) => d.id === activeNode?.dreamId);

  // Filter links related to selected or hovered node
  const activeLinks = links.filter(
    (l) =>
      l.sourceId === selectedNodeId ||
      l.targetId === selectedNodeId ||
      l.sourceId === hoveredNodeId ||
      l.targetId === hoveredNodeId
  );

  const handleSelectSymbolPill = (symbol: string) => {
    setActiveSymbolFilter(symbol);
    if (symbol === '海' || symbol === '水') {
      setSelectedNodeId('star_3');
    } else if (symbol === '舊居') {
      setSelectedNodeId('star_2');
    } else if (symbol === '被追逐') {
      setSelectedNodeId('star_2');
    } else if (symbol === '舊校' || symbol === '門') {
      setSelectedNodeId('star_1');
    }
  };

  return (
    <div className="card border-[#aa9cff]/30 bg-[#090c1a] p-6 sm:p-8 rounded-3xl relative overflow-hidden" id="dream-constellation-view">
      {/* Background Starry Galaxy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1d1e3d]/40 via-[#090c1a] to-[#04060e] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge">DREAM CONSTELLATION™️</span>
            <span className="text-xs text-[#71d9ff] font-mono">Your Dream Universe</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            夢境星圖 · 宇宙連線
          </h2>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-1 max-w-2xl leading-relaxed">
            每粒星代表一個夢。星與星之間連起人物、場景、象徵與情緒。
            點擊星辰或象徵（例如「海」），觀察它在 30 日內的心理角色演變。
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {['全部星辰', '海', '舊居', '被追逐', '門', '母親'].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => handleSelectSymbolPill(sym === '全部星辰' ? '' : sym)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                (sym === '全部星辰' && !activeSymbolFilter) || activeSymbolFilter === sym
                  ? 'bg-[#aa9cff] text-white border-[#aa9cff] shadow-md shadow-[#aa9cff]/20 font-medium'
                  : 'bg-white/5 border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Cosmos Canvas and Evolution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">
        {/* SVG Constellation Map (8 Cols) */}
        <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          {/* Link Type Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8d97b5] border-b border-white/5 pb-3">
            <span className="text-white font-medium">連線法則：</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#71d9ff]" /> 同一象徵
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#aa9cff]" /> 同一人物/地方
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#ffd27a]" /> 同一情緒
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#78e1b5]" /> 相反結局
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full h-[320px] sm:h-[360px] my-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                {/* Glow filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Draw Constellation Lines */}
              {links.map((link, idx) => {
                const source = nodes.find((n) => n.id === link.sourceId);
                const target = nodes.find((n) => n.id === link.targetId);
                if (!source || !target) return null;

                const isConnected =
                  selectedNodeId === link.sourceId ||
                  selectedNodeId === link.targetId ||
                  hoveredNodeId === link.sourceId ||
                  hoveredNodeId === link.targetId;

                let strokeColor = 'rgba(255, 255, 255, 0.15)';
                if (link.relationType === 'symbol') strokeColor = isConnected ? '#71d9ff' : 'rgba(113, 217, 255, 0.35)';
                else if (link.relationType === 'place' || link.relationType === 'character') strokeColor = isConnected ? '#aa9cff' : 'rgba(170, 156, 255, 0.35)';
                else if (link.relationType === 'emotion') strokeColor = isConnected ? '#ffd27a' : 'rgba(255, 210, 122, 0.35)';
                else if (link.relationType === 'opposite_ending') strokeColor = isConnected ? '#78e1b5' : 'rgba(120, 225, 181, 0.35)';

                return (
                  <line
                    key={idx}
                    x1={`${source.x}%`}
                    y1={`${source.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={strokeColor}
                    strokeWidth={isConnected ? '0.8' : '0.4'}
                    strokeDasharray={link.relationType === 'opposite_ending' ? '1,1' : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Draw Nodes (Stars) */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const radius = isSelected ? 3.5 : isHovered ? 2.8 : 2.2;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer group"
                  >
                    {/* Star pulse circle */}
                    {isSelected && (
                      <circle
                        cx={`${node.x}%`}
                        cy={`${node.y}%`}
                        r={radius * 2.2}
                        fill="rgba(170, 156, 255, 0.15)"
                        className="animate-ping"
                      />
                    )}

                    {/* Star outer ring */}
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={radius + 1.2}
                      fill="none"
                      stroke={isSelected ? '#71d9ff' : 'rgba(255, 255, 255, 0.3)'}
                      strokeWidth="0.4"
                    />

                    {/* Star Center */}
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={radius}
                      fill={isSelected ? '#ffffff' : '#aa9cff'}
                      filter="url(#glow)"
                      className="transition-all duration-200"
                    />

                    {/* Text Label */}
                    <text
                      x={`${node.x}%`}
                      y={`${node.y + 6}%`}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#c3b9ff'}
                      fontSize="3.2"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {node.primarySymbol}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8d97b5] pt-2 border-t border-white/5">
            <span>✨ 提示：點擊任一顆星辰，右側將展開深層角色轉變分析</span>
            <span className="font-mono text-[#78e1b5]">5 顆星辰已互聯 · 6 條深層引力線</span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Star & "Water Role Changing" Feature Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* THE HIGHLIGHTED CASE STUDY: 海 / 水的角色正在改變 */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#161d3a] to-[#0d1226] border border-[#71d9ff]/40 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#71d9ff] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                象徵演變弧度 · 核心破譯
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#71d9ff]/10 text-[#71d9ff] font-mono">
                30 日內 4 次顯現
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              「水」的角色正在改變
            </h3>
            <p className="text-xs text-[#aab3d2] leading-relaxed mb-4">
              你 30 日內有 4 個夢出現水。這不是隨機重複，而是你的心靈正在逐步學會面對與承載情緒：
            </p>

            {/* Step-by-step evolution timeline */}
            <div className="space-y-2 border-l-2 border-[#71d9ff]/30 pl-3 my-3">
              <div className="text-xs">
                <span className="font-semibold text-white">第一次：</span>
                <span className="text-[#aab3d2]">平靜水位無聲上升，爬上屋頂防衛</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white">第二次：</span>
                <span className="text-[#ffd27a]">洪水洶湧翻滾，壓抑情緒爆發</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white">第三次：</span>
                <span className="text-[#aa9cff]">主動跳入急流渡海，追尋彼岸母親</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#78e1b5]">第四次：</span>
                <span className="text-[#78e1b5] font-medium">站在岸邊晨光中看浪，水成為身外風景</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-[#71d9ff]">
              ✨ <b>這不再是普通日記，這是你的 Dream Universe。</b>
            </div>
          </div>

          {/* Active Node Detail Card */}
          {activeNode && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#8d97b5] uppercase">選取星辰</div>
                  <h4 className="text-sm font-bold text-white">{activeNode.title}</h4>
                </div>
                <span className="text-xs text-[#8d97b5] font-mono">{activeNode.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-[#8d97b5] block">主象徵</span>
                  <span className="text-white font-medium">{activeNode.primarySymbol}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-[#8d97b5] block">主情緒</span>
                  <span className="text-[#aa9cff] font-medium">{activeNode.emotion}</span>
                </div>
              </div>

              {activeLinks.length > 0 && (
                <div className="text-xs space-y-1 pt-1">
                  <span className="text-[10px] text-[#8d97b5] uppercase block">引力連線 ({activeLinks.length})</span>
                  {activeLinks.map((l, i) => (
                    <div key={i} className="text-[11px] text-[#aab3d2] bg-white/[0.02] p-1.5 rounded border border-white/5">
                      • {l.relationLabel}
                    </div>
                  ))}
                </div>
              )}

              {activeDream && (
                <button
                  type="button"
                  onClick={() => onOpenReportDetail(activeDream)}
                  className="btn w-full text-xs py-2 flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>查看這場夢的 4 層完整報告</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
