import React, { useState, useRef } from 'react';
import { ConstellationNode, ConstellationLink, DreamEntry } from '../types';
import { Sparkles, Compass, Layers, Info, Eye, ExternalLink, X, Download, Share2, ArrowRight } from 'lucide-react';

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
  const [isExporting, setIsExporting] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeNode = nodes.find((n) => n.id === selectedNodeId);
  const activeDream = dreams.find((d) => d.id === activeNode?.dreamId);

  // State transformation trajectories for recurring symbols
  const stateTransformations = [
    {
      symbol: '水 / 海洋',
      from: '洪水暴漲 (恐懼焦慮)',
      to: '平靜海水 (放鬆接納)',
      trajectory: '洪水 (恐懼) → 涉水渡河 (試煉) → 平靜海水 (放鬆)',
      nodeId: 'star_3',
      color: 'border-[#71d9ff]/40 bg-[#71d9ff]/10 text-[#71d9ff]',
    },
    {
      symbol: '門 / 出口',
      from: '鎖死的鐵門 (受困壓抑)',
      to: '推開通往天台 (解脫希望)',
      trajectory: '迷宮密閉 (困惑) → 密碼鎖 (試煉) → 迎光之門 (釋放)',
      nodeId: 'star_1',
      color: 'border-[#ffd27a]/40 bg-[#ffd27a]/10 text-[#ffd27a]',
    },
    {
      symbol: '被追逐黑影',
      from: '盲目逃命 (逃避自我)',
      to: '轉身對視黑影 (整合陰影)',
      trajectory: '狂奔逃離 (驚慌) → 躲入老宅 (喘息) → 直面陰影 (整合)',
      nodeId: 'star_2',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
  ];

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

  // Export Constellation SVG to PNG Image
  const handleExportConstellationImage = () => {
    setIsExporting(true);
    try {
      const svg = svgRef.current;
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw starry galaxy dark background
      const grad = ctx.createRadialGradient(600, 400, 50, 600, 400, 650);
      grad.addColorStop(0, '#1d1e3d');
      grad.addColorStop(0.6, '#090c1a');
      grad.addColorStop(1, '#04060e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 800);

      // Add stars
      for (let i = 0; i < 150; i++) {
        const sx = Math.random() * 1200;
        const sy = Math.random() * 800;
        const sr = Math.random() * 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add branding header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('DreamWisdom · DREAM CONSTELLATION™️ 夢境星圖', 40, 60);

      ctx.fillStyle = '#aa9cff';
      ctx.font = '16px sans-serif';
      ctx.fillText('每一個夢，都是潛意識留給你的信 · 30 NIGHTS UNIVERSE', 40, 90);

      // Embed SVG to canvas
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const urlApi = window.URL || (window as any).webkitURL;
      const blobURL = urlApi.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 60, 120, 1080, 620);
        urlApi.revokeObjectURL(blobURL);

        // Download PNG
        const link = document.createElement('a');
        link.download = `dreamwisdom-constellation-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsExporting(false);
      };
      img.src = blobURL;
    } catch (e) {
      console.error('Error exporting image:', e);
      setIsExporting(false);
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
            每粒星代表一個夢。節點代表地點 / 人物 / 象徵，線代表引力關聯。
            點擊星辰或變化標籤，觀察象徵物在 30 日內的心理角色演變。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Constellation as PNG */}
          <button
            type="button"
            onClick={handleExportConstellationImage}
            disabled={isExporting}
            className="btn2 text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#71d9ff]" />
            <span>{isExporting ? '生成星圖圖片中...' : '匯出星圖圖片 (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* State Change Transformation Badges */}
      <div className="relative z-10 pt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8d97b5]">
          <span className="flex items-center gap-1 text-white font-medium">
            <Compass className="w-3.5 h-3.5 text-[#78e1b5]" />
            心境轉變軌跡標籤 (State-Change Labels)：
          </span>
          <span>點擊快速高亮轉變節點</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {stateTransformations.map((st, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedNodeId(st.nodeId)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.02] ${st.color}`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{st.symbol}</span>
                <span className="text-[10px] opacity-80">點擊聚焦</span>
              </div>
              <div className="text-[11px] leading-relaxed opacity-95">
                {st.trajectory}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3 relative z-10">
        <span className="text-xs text-[#8d97b5] mr-1">象徵篩選：</span>
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

      {/* Interactive Cosmos Canvas and Evolution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 relative z-10">
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
            <svg ref={svgRef} className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
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
