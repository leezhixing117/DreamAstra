import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  HardDrive,
  Cloud,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
  Heart,
  Phone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

interface PrivacyViewProps {
  currentUser?: User | null;
  onOpenTherapeuticSupport: () => void;
  onClearAllLocalData: () => void;
  onToggleLocalOnlyMode: (enabled: boolean) => void;
  isLocalOnly: boolean;
  onGoToApp: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  currentUser,
  onOpenTherapeuticSupport,
  onClearAllLocalData,
  onToggleLocalOnlyMode,
  isLocalOnly,
  onGoToApp,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [hasClearedNotice, setHasClearedNotice] = useState(false);

  const handleClearData = () => {
    if (window.confirm('確定要徹底清除本機存儲的所有夢境記錄與登入緩存嗎？此操作不可逆。')) {
      onClearAllLocalData();
      setHasClearedNotice(true);
      setTimeout(() => setHasClearedNotice(false), 4000);
    }
  };

  const privacyFaqs = [
    {
      q: 'AI 解夢準唔準？',
      a: 'AI 解夢唔係算命籤文，冇絕對嘅「準唔準」，而係一面映照你內心深處嘅鏡子。我哋先從卡爾·榮格（Carl G. Jung）嘅《人及其象徵》、現代原型心理學與華人文化層中找出相應理論依據，再比對你生活情境與重複意象，啟發你思考白天壓抑或忽略咗嘅情緒與渴望。',
      tag: '解夢本質',
    },
    {
      q: '我嘅夢境紀錄會唔會俾其他人睇？',
      a: '絕對唔會。夢境係人最私密嘅內心世界，所有紀錄只限你個人帳戶瀏覽；我哋絕不公開、絕不出售轉讓數據，亦明文承諾絕不用於訓練公開通用 AI 模型。你更加可以隨時一鍵清空所有夢境資料，或啟用「純本地模式」將數據只留喺你部手機／電腦。',
      tag: '私隱保障',
    },
    {
      q: '免費同 AI 深入解密分別係咩？',
      a: '免費版提供單次夢境嘅基礎意象與情緒梳理，適合隨手記錄；AI 深入解密會調用 Book Brain 典籍文獻進行四層深度交叉分析、挖掘潛意識陰影（Shadow）與情結（Complex），並串聯你過往夢境進行時間線演進對比，累積你的 DREAM DNA™️ 與星圖。',
      tag: '功能差異',
    },
    {
      q: '如果經常發噩夢點算？',
      a: '發噩夢通常係潛意識喺度強烈提醒你：生活中正面對未消化嘅壓力、創傷或者焦慮。夢境本身唔會傷害你。你可以先嘗試記低夢境情緒，亦可以用我哋嘅清醒夢意象改寫練習；但如果噩夢頻密發生、或者嚴重影響日常生活同睡眠品質，強烈建議尋找註冊臨床心理學家或精神科醫生等專業醫療協助。',
      tag: '身心健康',
    },
  ];

  return (
    <div className="shell py-8 sm:py-14 max-w-4xl mx-auto" id="privacy-policy-root">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#78e1b5]/10 border border-[#78e1b5]/25 text-[#78e1b5] text-xs font-semibold mb-3.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>香港用戶私隱與數據承諾 · DATA PRIVACY & TRUST</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
          文案、信任與私隱政策
        </h1>
        <p className="text-xs sm:text-sm text-[#aab3d2] mt-3 max-w-2xl mx-auto leading-relaxed">
          夢境屬於高度敏感嘅個人內心數據。我們深明香港用戶對個人資料極為看重，在此莊嚴公佈我們的四項最高私隱準則。
        </p>
      </div>

      {/* 4 CORE COMMITMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10">
        {/* Commitment 1 */}
        <div className="card p-5 sm:p-6 rounded-2xl bg-[#0e1227] border border-white/10 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#78e1b5]/15 text-[#78e1b5] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">1. 夢境數據嚴格用途</h2>
          <p className="text-xs text-[#aab3d2] leading-relaxed">
            你輸入或語音錄製嘅每一個夢，<b>僅用於為你本人提供當前夢境分析、個人心靈軌跡統計</b>。我們絕不出售、絕不轉交第三方機構，亦絕不用作任何商業推廣。
          </p>
        </div>

        {/* Commitment 2 */}
        <div className="card p-5 sm:p-6 rounded-2xl bg-[#0e1227] border border-white/10 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#71d9ff]/15 text-[#71d9ff] flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">2. 絕不用於訓練通用 AI</h2>
          <p className="text-xs text-[#aab3d2] leading-relaxed">
            鄭重承諾：<b>我們絕不使用用戶私密夢境數據來公開訓練或改進通用 AI 模型</b>。所有分析調用均遵循嚴格隱私協議，運算完成後絕無留存訓練集之風險。
          </p>
        </div>

        {/* Commitment 3 */}
        <div className="card p-5 sm:p-6 rounded-2xl bg-[#0e1227] border border-white/10 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#aa9cff]/15 text-[#aa9cff] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">3. 端到端加密傳輸</h2>
          <p className="text-xs text-[#aab3d2] leading-relaxed">
            全站強制啟用 TLS/HTTPS 現代高強度加密傳輸，伺服器數據庫採取獨立行級隔離與安全防護，嚴密防範任何未經授權之外洩風險。
          </p>
        </div>

        {/* Commitment 4 */}
        <div className="card p-5 sm:p-6 rounded-2xl bg-[#0e1227] border border-white/10 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white">4. 隨時徹底刪除（被遺忘權）</h2>
          <p className="text-xs text-[#aab3d2] leading-relaxed">
            你擁有 100% 個人數據主導權。你可以隨時手動刪除單個夢境，或者在下方隨時一鍵清除所有歷史記錄，不留任何痕跡。
          </p>
        </div>
      </div>

      {/* LOCAL MODE VS CLOUD SYNC MODE */}
      <section className="card p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#10142d] to-[#0d1024] border border-[#78e1b5]/30 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#78e1b5]" />
              <h2 className="text-lg font-bold text-white">「本地模式概念 (Local Mode)」選項</h2>
            </div>
            <p className="text-xs text-[#cbd2ef] mt-1.5 leading-relaxed max-w-xl">
              如果你希望極致私隱，可開啟「純本地模式」：你的夢境記錄將<b>僅儲存在當前瀏覽器本地 (LocalStorage)</b>，完全不傳送或存入雲端伺服器；關閉時則會同步備份至加密數據庫，方便跨裝置登入。
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#aab3d2] font-mono">
              {isLocalOnly ? '🟢 本地模式 (Local-Only)' : '☁️ 雲端同步模式 (Cloud Sync)'}
            </span>
            <button
              type="button"
              onClick={() => onToggleLocalOnlyMode(!isLocalOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isLocalOnly ? 'bg-[#78e1b5]' : 'bg-white/20'
              }`}
              title="切換純本地儲存或雲端同步"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  isLocalOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Erasure action box */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>行使被遺忘權 · 一鍵清除數據</span>
            </h3>
            <p className="text-[11px] text-[#8d97b5] mt-0.5">
              清除此裝置上的所有瀏覽歷史、夢境記錄緩存與登入狀態。
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasClearedNotice && (
              <span className="text-xs text-[#78e1b5] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>已成功清空！</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearData}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空本機全部夢境緩存</span>
            </button>
          </div>
        </div>
      </section>

      {/* DISCLAIMER & MENTAL HEALTH CARE */}
      <section className="card p-6 sm:p-7 rounded-3xl bg-amber-400/5 border border-amber-400/25 mb-10">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-white">免責聲明與專業心理健康建議</h2>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              <b>重要提醒：</b>本產品（DreamWisdom）僅作為<b>日常自我反思、情緒覺察與個人夢境日記工具</b>，並非臨床醫學診斷、心理治療工具或危機介入服務。
            </p>
            <p className="text-xs text-[#cbd2ef] leading-relaxed">
              若你長期遭遇嚴重噩夢、睡眠窒息困擾、創傷後應激（PTSD）或持續性焦慮抑鬱，請切勿僅依賴 AI 工具，建議立即尋找註冊臨床心理學家、精神科專科醫生或專業輔導人員之協助。
            </p>
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onOpenTherapeuticSupport}
                className="btn text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer bg-amber-400 text-black font-bold hover:bg-amber-300"
              >
                <Heart className="w-3.5 h-3.5 fill-black" />
                <span>查看香港心理支援熱線與專業療癒指引 →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FAQ ACCORDION (地道廣東話) */}
      <section className="space-y-4" id="privacy-core-faqs">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#aa9cff] font-mono mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>常見疑問 · 廣東話淺白解答</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            常見問題 (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {privacyFaqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="card rounded-2xl border border-white/10 bg-[#0e1124] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#aa9cff]/15 text-[#aa9cff] font-mono shrink-0">
                      {item.tag}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      Q：{item.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8d97b5] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#aa9cff]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#cbd2ef] leading-relaxed border-t border-white/5">
                    <p className="leading-relaxed sm:leading-[1.75]">A：{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
