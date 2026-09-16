import React from 'react';
import { DreamEntry } from '../types';
import { X, Calendar, BookOpen, HelpCircle, Check, Copy, Trash2 } from 'lucide-react';

interface ReportDetailModalProps {
  entry: DreamEntry | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  entry,
  onClose,
  onDelete,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!entry) return null;
  const report = entry.report_json;

  const handleCopy = () => {
    const text = `【DreamWisdom 夢境報告】\n標題：${report.title}\n時間：${new Date(entry.created_at).toLocaleDateString('zh-HK')}\n\n【夢境記錄】\n${entry.dream_text}\n\n【核心解讀】\n${report.summary}\n\n【象徵意象】\n${report.symbols?.map(s => `• ${s.symbol}: ${s.meaning}`).join('\n')}\n\n【自我反思提問】\n${report.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modalback" id="report-detail-modal-overlay" onClick={onClose}>
      <div
        className="modal"
        id="report-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="badge">
              <Calendar className="w-3 h-3" />
              {new Date(entry.created_at).toLocaleDateString('zh-HK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="btn2 text-xs"
              title="複製完整報告"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#78e1b5]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製' : '複製'}</span>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定要刪除這筆夢境記錄嗎？')) {
                    onDelete(entry.id);
                    onClose();
                  }
                }}
                className="btn2 text-xs text-[#ff8b9d] hover:bg-red-500/10"
                title="刪除此夢境記錄"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#aab3d2] hover:text-white hover:bg-white/10"
              aria-label="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-6">
          <div>
            <div className="text-xs text-[#8d97b5] uppercase tracking-wider mb-1">夢境原文</div>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-[#f6f7ff] text-sm leading-relaxed italic">
              "{entry.dream_text}"
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{report.title}</h2>
            <p className="text-[#e4e7f7] leading-relaxed text-base">{report.summary}</p>
          </div>

          {report.symbols && report.symbols.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-[#cbd2ef] mb-3 flex items-center gap-2">
                <span>象徵符號解析</span>
              </h3>
              <div className="symbolgrid">
                {report.symbols.map((s, i) => (
                  <div className="symbol" key={i}>
                    <b className="text-white text-sm">{s.symbol}</b>
                    <div className="muted tiny mt-1.5 leading-normal">{s.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.perspectives && report.perspectives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#cbd2ef]">深度學派視角</h3>
              {report.perspectives.map((p, i) => (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10" key={i}>
                  <h4 className="font-semibold text-[#dce0ff] text-sm mb-1">{p.name}</h4>
                  <p className="text-[#aab3d2] text-xs leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          )}

          {report.questions && report.questions.length > 0 && (
            <div className="p-4 rounded-xl bg-[#aa9cff]/10 border border-[#aa9cff]/20">
              <h3 className="text-sm font-semibold text-[#c3b9ff] mb-2.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>可以問自己的反思問題</span>
              </h3>
              <div className="space-y-2">
                {report.questions.map((q, i) => (
                  <div key={i} className="text-xs text-[#e1e5f8] flex items-start gap-2">
                    <span className="text-[#aa9cff] font-mono font-bold">0{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.sources && report.sources.length > 0 && (
            <div>
              <h3 className="text-xs text-[#8d97b5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#71d9ff]" />
                <span>Book Brain 典籍引用依據</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.sources.map((s, i) => (
                  <span className="source text-xs" key={i}>
                    📚 {s.book_title} · p.{s.page_start}
                    {s.page_end && s.page_end !== s.page_start ? `–${s.page_end}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
