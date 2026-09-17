import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Crown,
  Check,
  X,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Tv,
  Coins,
  Database,
  FileDown,
  Lock,
  Zap,
} from 'lucide-react';
import { User, normalizeRole } from '../types';

interface PricingViewProps {
  currentUser?: User | null;
  onOpenEarnStars: () => void;
  onUpgradeToPaid: () => void;
  onGoToApp: (tab?: 'workspace' | 'dna' | 'constellation' | 'mystery') => void;
  onExchangeStorageQuota: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUser,
  onOpenEarnStars,
  onUpgradeToPaid,
  onGoToApp,
  onExchangeStorageQuota,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const normRole = currentUser ? normalizeRole(currentUser.role) : 'free';
  const isPaid = normRole === 'paid' || normRole === 'admin' || normRole === 'super_admin';
  const stars = currentUser?.stars ?? 0;
  const currentQuota = isPaid ? '無限' : `${currentUser?.storage_quota || 3} 條 (上限 10 條)`;

  const pricingFaqs = [
    {
      q: '睇廣告攞到嘅星星幣，會唔會過期？',
      a: '唔會，星星幣永久喺你帳戶入面，唔會過期，你可以隨時按自己節奏慢慢儲、慢慢用。',
    },
    {
      q: '用星星幣解鎖咗 AI 深入解密，個夢嘅分析會唔會消失？',
      a: '唔會。只要你用星星幣解鎖咗某個夢境嘅深入解密，嗰個夢嘅所有四層心理學報告同指引會永久保存喺你帳戶歷史入面。',
    },
    {
      q: '付費之後，之前賺嘅星星幣仲有冇用？',
      a: '依然保留喺帳戶！如果未來會籍調整，你之前累積嘅星星幣都依然有效，絕不作廢清零。',
    },
    {
      q: '免費同付費最大分別係咩？',
      a: '免費版只可以試簡單單次解夢（最多儲存 3 條記錄）；星星幣可以逐次試深入解密同週報；付費版則完全免廣告、直接解鎖 CONSTELLATION™️ 互動星圖連線、無限夢境存檔、30 日全息完整總結報告與 PDF 匯出備份。',
    },
  ];

  return (
    <div className="shell py-8 sm:py-14" id="pricing-page-root">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#aa9cff]/10 border border-[#aa9cff]/25 text-[#c3b9ff] text-xs font-semibold mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
          <span>雙軌透明架構 · 付費 / 睇廣告賺星星幣</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          揀適合你嘅探索方式
        </h1>
        <p className="text-sm sm:text-base text-[#aab3d2] mt-3 max-w-2xl mx-auto leading-relaxed">
          核心原則：<b>星星幣 = 免費用戶嘅代幣</b>，睇廣告賺，唔使俾真金白銀都可以試進階功能；付費就直接全解鎖、唔使睇廣告。
        </p>

        {/* Current user status indicator */}
        {currentUser && (
          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white">
            <span>目前身份：<b className="text-[#aa9cff]">{currentUser.display_name || currentUser.email}</b></span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>餘額：{stars} 顆星星幣</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[#78e1b5]">儲存配額：{currentQuota}</span>
          </div>
        )}
      </div>

      {/* THREE CARDS: Free, Star Coins, Paid (Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch max-w-6xl mx-auto mb-14" id="pricing-cards-grid">
        {/* CARD 1: 🆓 免費探索 */}
        <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 bg-[#0c0f20]/90 hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8d97b5]">Free Tier</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#aab3d2] border border-white/10">
                毋須付款
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>🆓 免費探索</span>
            </h2>
            <p className="text-xs text-[#aab3d2] mt-2 leading-relaxed min-h-[36px]">
              可以直接輸入夢境獲得簡易解析；帳戶最多儲存 3 個夢境記錄，隨時體驗基礎操作。
            </p>

            <div className="my-5 pb-5 border-b border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">HK$0</span>
                <span className="text-xs text-[#8d97b5]">/ 永久免費</span>
              </div>
              <p className="text-[11px] text-[#78e1b5] mt-1 font-mono">
                無需星星幣 · 即開即試
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-white uppercase tracking-wider">包含功能：</div>
              <ul className="space-y-2 text-[#cbd2ef]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>單次夢境簡易解析（主意象、日常啟發）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>建立個人帳戶同步登入</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>儲存最多 3 個夢境記錄</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>基礎夢境標籤分類、歷史記錄瀏覽</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] font-bold text-[#ff8b9d] uppercase tracking-wider">尚未包含：</div>
              <ul className="space-y-1.5 text-[#8d97b5]">
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>無 AI 深入解密（四層心理深度剖析）</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>無 DREAM DNA 統計、無 CONSTELLATION 星圖</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>無 30 NIGHTS MYSTERY™️ 計劃與全息報告</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[#ff8b9d]/70 shrink-0 mt-0.5" />
                  <span>不能匯出 PDF 檔案</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => onGoToApp('workspace')}
              className="btn dark w-full text-xs py-3 justify-center cursor-pointer"
            >
              <span>即刻免費試解一個夢 →</span>
            </button>
          </div>
        </div>

        {/* CARD 2: ⭐ 星星幣解鎖 (Highlighted Freemium Track) */}
        <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-amber-400/50 bg-gradient-to-b from-[#161208]/90 via-[#0f1225] to-[#0a0d1d] shadow-xl shadow-amber-500/10 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-[11px] tracking-wide uppercase shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" />
            <span>免費用戶首選 · 睇片賺幣</span>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-2 mt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300">Ad-Supported Token</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                唔使真金白銀
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>⭐ 星星幣體驗</span>
            </h2>
            <p className="text-xs text-[#cbd2ef] mt-2 leading-relaxed min-h-[36px]">
              消耗星星幣，逐次 / 限期開啟進階功能，適合想試下深度解夢、暫時唔想直接付費嘅用戶。
            </p>

            <div className="my-5 pb-5 border-b border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">0 元</span>
                <span className="text-xs text-[#aab3d2]">/ 睇短片廣告賺幣</span>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-1 font-mono">
                每睇 1 段心靈短片 ➔ 即賺 1 顆星星幣 ⭐
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">星星幣可開啟：</div>
              <ul className="space-y-2 text-[#cbd2ef]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>AI 深入解密</b>（每個夢消耗 1 顆星星幣）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>額外增加夢境儲存配額</b>（用 3 星兌換，上限最多 10 條）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span><b>基礎 DREAM DNA 統計</b>（個人情緒、象徵詞頻分析，計算你已存夢境）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>啟動 30 NIGHTS MYSTERY™️，睇每 7 日中期小報告</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] font-bold text-[#8d97b5] uppercase tracking-wider">限制說明：</div>
              <ul className="space-y-1.5 text-[#8d97b5]">
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span>唔解鎖完整 CONSTELLATION™️ 互動星圖連線</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span>唔解鎖 30 日全息完整總結報告</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span>儲存配額設有上限（最多 10 條）</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <span>不能 PDF 匯出</span>
                </li>
              </ul>
            </div>

            {/* Micro Rules Notice */}
            <div className="mt-4 p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-amber-200/80 space-y-1">
              <div>• 星星幣永久保留，<b>唔會過期</b></div>
              <div>• 解鎖後，對應夢境深度解密紀錄<b>永久保留</b></div>
              <div>• 星星幣不可兌換現金，純作平台功能兌換</div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={onOpenEarnStars}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer shadow-md"
              id="pricing-watch-ad-btn"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>睇片賺星星幣 (+1 顆)</span>
            </button>

            <button
              type="button"
              onClick={onExchangeStorageQuota}
              disabled={stars < 3}
              className={`w-full py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                stars >= 3
                  ? 'bg-white/5 border-amber-400/40 text-amber-200 hover:bg-amber-400/10'
                  : 'bg-white/[0.02] border-white/5 text-[#8d97b5] cursor-not-allowed opacity-60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>用 3 星幣兌換 +3 夢境配額 (目前: {stars}星)</span>
            </button>
          </div>
        </div>

        {/* CARD 3: 💎 付費全解鎖方案 */}
        <div className="card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#aa9cff]/40 bg-gradient-to-b from-[#13112a]/95 via-[#0d1024] to-[#080a18] shadow-xl shadow-[#aa9cff]/10">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#aa9cff]">Unlimited Premium</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#aa9cff]/20 text-[#c3b9ff] border border-[#aa9cff]/30 font-semibold">
                全功能解鎖
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>💎 付費進階方案</span>
            </h2>
            <p className="text-xs text-[#cbd2ef] mt-2 leading-relaxed min-h-[36px]">
              一次開晒全部功能：完整互動星圖、30 日全息報告、無限儲存、PDF 匯出備份，完全唔使睇廣告！
            </p>

            {/* Billing switcher */}
            <div className="my-4 p-1 rounded-xl bg-white/5 border border-white/10 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  billingCycle === 'monthly' ? 'bg-[#aa9cff] text-black font-bold' : 'text-[#aab3d2]'
                }`}
              >
                月度訂閱
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('lifetime')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  billingCycle === 'lifetime' ? 'bg-[#aa9cff] text-black font-bold' : 'text-[#aab3d2]'
                }`}
              >
                一次性永久買斷
              </button>
            </div>

            <div className="pb-4 mb-4 border-b border-white/10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  {billingCycle === 'monthly' ? 'HK$88' : 'HK$588'}
                </span>
                <span className="text-xs text-[#aab3d2]">
                  {billingCycle === 'monthly' ? '/ 每月' : '/ 終身永久存取'}
                </span>
              </div>
              <p className="text-[11px] text-[#78e1b5] mt-1 font-mono">
                {billingCycle === 'monthly' ? '隨時取消訂閱 · 無合約束縛' : '一次付款 · 終生無限探索潛意識'}
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#c3b9ff] uppercase tracking-wider">全部特權直通解鎖：</div>
              <ul className="space-y-2 text-[#cbd2ef]">
                <li className="flex items-start gap-2 font-semibold text-white">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>全部星星幣功能全開（免睇廣告、免扣幣）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>完整 CONSTELLATION™️ 可交互夢境星圖</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>30 NIGHTS MYSTERY™️ 最終全息完整報告</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>無限夢境存檔</b>（無數量上限，記得你一生的夢）</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span><b>所有夢境記錄可匯出 PDF 檔案</b> 隨身珍藏</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>優先解析排隊，減少 AI 運算等待時間</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#78e1b5] shrink-0 mt-0.5" />
                  <span>星圖圖片高畫質下載、自訂私密夢境標籤</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            {isPaid ? (
              <div className="p-3 rounded-xl bg-[#78e1b5]/15 border border-[#78e1b5]/30 text-[#78e1b5] text-xs text-center font-bold flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4" />
                <span>你現已尊享付費會員全部特權！</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onUpgradeToPaid}
                className="btn w-full text-xs py-3 justify-center cursor-pointer shadow-lg shadow-[#aa9cff]/20 font-bold"
                id="pricing-upgrade-btn"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>立即啟用付費會員 ({billingCycle === 'monthly' ? 'HK$88/月' : 'HK$588 買斷'})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRICING FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto pt-6 border-t border-white/10" id="pricing-faq-section">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            關於星星幣與方案的常見問題
          </h2>
          <p className="text-xs text-[#aab3d2] mt-1">清晰明確，杜絕任何隱形收費與規則陷阱</p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="card rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-white">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8d97b5] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-300' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#cbd2ef] leading-relaxed border-t border-white/5">
                    <p>{faq.a}</p>
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
