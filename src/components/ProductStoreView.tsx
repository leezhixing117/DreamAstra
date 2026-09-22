import React, { useState } from 'react';
import { ProductItem, User, PurchaseOrder } from '../types';
import { Sparkles, ShoppingBag, Star, ShieldCheck, Check, Truck, CreditCard, ChevronRight, X, Heart, RefreshCw, Flame, ExternalLink, PackageCheck, Clock, CheckCircle } from 'lucide-react';

interface ProductStoreViewProps {
  products: ProductItem[];
  currentUser: User | null;
  currentDreamSummary?: string;
  recommendedProductId?: string;
  onOpenLogin: () => void;
  onOpenEarnStars: () => void;
  onUpdateUserStars?: (newStars: number) => void;
  onNavigateToWorkspace?: () => void;
}

export const ProductStoreView: React.FC<ProductStoreViewProps> = ({
  products,
  currentUser,
  currentDreamSummary,
  recommendedProductId,
  onOpenLogin,
  onOpenEarnStars,
  onUpdateUserStars,
  onNavigateToWorkspace,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDetailProduct, setActiveDetailProduct] = useState<ProductItem | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  // Checkout form state
  const [customerName, setCustomerName] = useState(currentUser?.display_name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'sf_express' | 'store_pickup'>('sf_express');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'fps' | 'payme' | 'alipay_hk' | 'wechat_pay' | 'credit_card'>('fps');
  const [useStarsDiscount, setUseStarsDiscount] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<PurchaseOrder | null>(null);

  const getSavedOrders = (): PurchaseOrder[] => {
    try {
      return JSON.parse(localStorage.getItem('dreamwisdom_orders') || '[]');
    } catch {
      return [];
    }
  };

  const savedOrdersList = getSavedOrders();

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleStartCheckout = (product: ProductItem) => {
    setCheckoutProduct(product);
    setOrderSuccess(null);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutProduct) return;

    const starsAvail = currentUser?.stars ?? 0;
    const canUseStars = useStarsDiscount && checkoutProduct.starsRedeemCost && starsAvail >= checkoutProduct.starsRedeemCost;
    const finalPrice = canUseStars ? Math.max(0, checkoutProduct.priceHKD - 20) : checkoutProduct.priceHKD;

    const newOrder: PurchaseOrder = {
      id: 'ORD_' + Date.now().toString().slice(-6),
      productId: checkoutProduct.id,
      productName: checkoutProduct.name,
      quantity: 1,
      unitPrice: checkoutProduct.priceHKD,
      totalHKD: finalPrice,
      starsUsed: canUseStars ? checkoutProduct.starsRedeemCost : 0,
      customerName,
      customerPhone,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'store_pickup' ? '旺角/銅鑼灣自取點 (下單後通知)' : deliveryAddress,
      paymentMethod,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      associatedDreamSummary: currentDreamSummary,
    };

    // Save order history locally
    try {
      const savedOrders = JSON.parse(localStorage.getItem('dreamwisdom_orders') || '[]');
      localStorage.setItem('dreamwisdom_orders', JSON.stringify([newOrder, ...savedOrders]));
    } catch {
      // ignore
    }

    // Deduct user stars if stars discount was applied
    if (canUseStars && checkoutProduct.starsRedeemCost && onUpdateUserStars) {
      const remainingStars = Math.max(0, starsAvail - checkoutProduct.starsRedeemCost);
      onUpdateUserStars(remainingStars);
    }

    setOrderSuccess(newOrder);
  };

  return (
    <div className="shell py-8 space-y-8 min-h-screen" id="product-store-view">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-amber-950/30 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              🌿 夢後療癒與氣場轉化產品庫
            </span>
            <span className="text-xs text-amber-300 flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              支援星星幣抵扣
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            解夢選物店 · 身心能量調校與心靈療癒
          </h1>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            夢境是潛意識的呼喚，清醒後更是轉化能量的契機。為你精選助眠草本香氛、空間煙燻淨化、守護水晶原石與身心調校等不同類型療癒產品，配合你的夢境診斷，為生活注入好運與安寧。
          </p>

          {currentDreamSummary && (
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#aa9cff]">💭 最近解夢關聯：</span>
                <span className="truncate max-w-[280px] sm:max-w-md text-amber-200">
                  「{currentDreamSummary}」
                </span>
              </div>
              {onNavigateToWorkspace && (
                <button
                  type="button"
                  onClick={onNavigateToWorkspace}
                  className="text-[11px] text-[#78e1b5] hover:underline shrink-0"
                >
                  查看報告 →
                </button>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setShowOrderHistory(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/15 shadow-sm transition-all cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>我的訂單記錄 ({savedOrdersList.length})</span>
          </button>
          {currentUser && (
            <div className="text-[11px] text-[#aab3d2] text-center sm:text-left md:text-center">
              持星：<span className="text-amber-300 font-bold font-mono">{currentUser.stars ?? 0}</span> 顆星可抵扣
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
          }`}
        >
          全部產品 ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('purify')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'purify'
              ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
          }`}
        >
          🍃 淨化開運 · 氣場轉化
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('sleep')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'sleep'
              ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
          }`}
        >
          🌙 深眠安神 · 枕頭噴霧
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('herb')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'herb'
              ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
          }`}
        >
          ☕ 草本調校 · 晚安舒緩茶
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('incense')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'incense'
              ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
          }`}
        >
          🌿 空間結界 · 煙燻淨化
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('crystal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'crystal'
              ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/10'
          }`}
        >
          💎 靈性直覺 · 守護水晶
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isRecommended = recommendedProductId === product.id;

          return (
            <div
              key={product.id}
              className={`rounded-2xl bg-white/[0.03] border transition-all flex flex-col justify-between overflow-hidden group hover:border-emerald-500/40 hover:bg-white/[0.05] ${
                isRecommended
                  ? 'border-emerald-500/70 shadow-lg shadow-emerald-950/50 relative'
                  : 'border-white/10'
              }`}
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                  {product.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-black shadow-md">
                      {product.badge}
                    </span>
                  )}
                  {isRecommended && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      你的解夢專屬推薦
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white/80 backdrop-blur-sm ml-auto">
                    {product.volumeOrSpec}
                  </span>
                </div>

                {/* Scent notes pill if applicable */}
                {product.scentNotes && (
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <div className="text-[10px] text-amber-200 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 truncate">
                      🍊 {product.scentNotes.top.split('(')[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#8d97b5]">
                    <span>{product.brand}</span>
                    <span className="text-emerald-400">{product.categoryLabel}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#aab3d2] line-clamp-2 leading-relaxed">
                    {product.subTitle}
                  </p>
                </div>

                {/* Why recommended for dreams */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-[#cbd2ef] space-y-1">
                  <span className="text-emerald-300 font-medium text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 解夢對應功效：
                  </span>
                  <p className="text-[11px] text-[#cbd2ef] line-clamp-2 leading-relaxed">
                    {product.recommendationReason}
                  </p>
                </div>

                {/* Pricing & Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white">
                        HK${product.priceHKD}
                      </span>
                      {product.originalPriceHKD && (
                        <span className="text-xs text-[#8d97b5] line-through">
                          HK${product.originalPriceHKD}
                        </span>
                      )}
                    </div>
                    {product.starsRedeemCost && (
                      <span className="text-[10px] text-amber-300 font-mono block">
                        可扣減 {product.starsRedeemCost} 粒星折抵 $20
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveDetailProduct(product)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-all cursor-pointer"
                    >
                      詳情
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartCheckout(product)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      立即選購
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {activeDetailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0f1422] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 my-8 relative">
            <button
              type="button"
              onClick={() => setActiveDetailProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <img
                  src={activeDetailProduct.imageUrl}
                  alt={activeDetailProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:w-1/2 space-y-3">
                <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                  {activeDetailProduct.categoryLabel}
                </span>
                <h2 className="text-xl font-bold text-white leading-snug">
                  {activeDetailProduct.name}
                </h2>
                <div className="text-xs text-emerald-300">
                  {activeDetailProduct.subTitle}
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-black text-white">
                    HK${activeDetailProduct.priceHKD}
                  </span>
                  {activeDetailProduct.originalPriceHKD && (
                    <span className="text-sm text-[#8d97b5] line-through">
                      HK${activeDetailProduct.originalPriceHKD}
                    </span>
                  )}
                  <span className="text-xs text-amber-300 font-mono">
                    (規格: {activeDetailProduct.volumeOrSpec})
                  </span>
                </div>

                <div className="text-xs text-[#cbd2ef] space-y-1 pt-1 border-t border-white/10">
                  <div><b>品牌：</b>{activeDetailProduct.brand}</div>
                  <div><b>保質期：</b>{activeDetailProduct.shelfLife}</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const prod = activeDetailProduct;
                    setActiveDetailProduct(null);
                    handleStartCheckout(prod);
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  以 HK${activeDetailProduct.priceHKD} 選購
                </button>
              </div>
            </div>

            {/* Scent notes & Key benefits */}
            {activeDetailProduct.scentNotes && (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  🍊 特調香氛金字塔 (廣東精選大吉葉)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-black/40">
                    <span className="text-[10px] text-amber-400 block font-mono">TOP 前調</span>
                    <span className="text-white">{activeDetailProduct.scentNotes.top}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <span className="text-[10px] text-amber-400 block font-mono">HEART 中調</span>
                    <span className="text-white">{activeDetailProduct.scentNotes.middle}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <span className="text-[10px] text-amber-400 block font-mono">BASE 後調</span>
                    <span className="text-white">{activeDetailProduct.scentNotes.base}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits & Medical / Folk Background */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                ✨ 功效與成份認證
              </h4>
              <ul className="space-y-1.5 text-xs text-[#cbd2ef]">
                {activeDetailProduct.keyBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suitable Dreams */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#71d9ff] flex items-center gap-1.5">
                💭 特別適合以下夢境體驗：
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeDetailProduct.suitableDreams.map((sd, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    • {sd}
                  </span>
                ))}
              </div>
            </div>

            {/* Usage guide and Cautions */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2">
              <div>
                <b className="text-white">使用指南：</b>
                <p className="text-[#aab3d2] mt-0.5">{activeDetailProduct.usageGuide}</p>
              </div>
              <div className="pt-2 border-t border-white/5">
                <b className="text-amber-300">注意事項：</b>
                <div className="text-[11px] text-[#8d97b5] space-y-0.5 mt-0.5">
                  {activeDetailProduct.cautions.map((c, i) => (
                    <div key={i}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0f1422] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-5 my-8 relative">
            <button
              type="button"
              onClick={() => setCheckoutProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!orderSuccess ? (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div>
                  <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                    FAST CHECKOUT · 香港直送 / 順豐自取
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">選購確認</h3>
                </div>

                {/* Selected Item Recap */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                  <img
                    src={checkoutProduct.imageUrl}
                    alt={checkoutProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover bg-black/40"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {checkoutProduct.name}
                    </h4>
                    <div className="text-[11px] text-[#8d97b5]">
                      規格：{checkoutProduct.volumeOrSpec}
                    </div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      HK${checkoutProduct.priceHKD}
                    </div>
                  </div>
                </div>

                {/* Stars Discount Option */}
                {checkoutProduct.starsRedeemCost && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        使用星星幣折抵 $20
                      </span>
                      <span className="text-[11px] text-[#cbd2ef] block">
                        目前持有: {currentUser?.stars ?? 0} 顆 (需 {checkoutProduct.starsRedeemCost} 顆)
                      </span>
                    </div>

                    {(currentUser?.stars ?? 0) >= checkoutProduct.starsRedeemCost ? (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                        <input
                          type="checkbox"
                          checked={useStarsDiscount}
                          onChange={(e) => setUseStarsDiscount(e.target.checked)}
                          className="rounded text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>使用折抵</span>
                      </label>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenEarnStars}
                        className="text-[11px] text-amber-300 underline font-medium"
                      >
                        睇片賺星 →
                      </button>
                    )}
                  </div>
                )}

                {/* Recipient Details */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#cbd2ef] block mb-1">收件人姓名 *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="例如：Chan Tai Man"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#cbd2ef] block mb-1">香港聯絡電話 (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="例如：91234567"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#cbd2ef] block mb-1">取件方式</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('sf_express')}
                        className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                          deliveryMethod === 'sf_express'
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#aab3d2]'
                        }`}
                      >
                        📦 順豐速運 / 智能櫃
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('store_pickup')}
                        className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all ${
                          deliveryMethod === 'store_pickup'
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#aab3d2]'
                        }`}
                      >
                        🏪 旺角 / 銅鑼灣自取
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'sf_express' && (
                    <div>
                      <label className="text-xs text-[#cbd2ef] block mb-1">順豐點碼 / 工商住宅地址 *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="例如：順豐智能櫃 H852XXXX / 九龍旺角彌敦道..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-[#cbd2ef] block mb-1">支付方式</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('fps')}
                        className={`p-2 rounded-xl border text-[11px] text-center cursor-pointer ${
                          paymentMethod === 'fps'
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#aab3d2]'
                        }`}
                      >
                        轉數快 FPS
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('payme')}
                        className={`p-2 rounded-xl border text-[11px] text-center cursor-pointer ${
                          paymentMethod === 'payme'
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#aab3d2]'
                        }`}
                      >
                        PayMe
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-2 rounded-xl border text-[11px] text-center cursor-pointer ${
                          paymentMethod === 'credit_card'
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#aab3d2]'
                        }`}
                      >
                        信用卡 (Stripe)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final Total */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-[#aab3d2]">
                    應付總額 (免香港本地運費)：
                  </div>
                  <div className="text-xl font-black text-emerald-400">
                    HK${useStarsDiscount ? Math.max(0, checkoutProduct.priceHKD - 20) : checkoutProduct.priceHKD}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  確認送出訂單
                </button>
              </form>
            ) : (
              /* Order Success Screen */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">訂單已成功建立！</h3>
                  <p className="text-xs text-emerald-300 font-mono">
                    訂單編號：{orderSuccess.id}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8d97b5]">選購產品：</span>
                    <span className="text-white font-bold">{orderSuccess.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8d97b5]">收件人：</span>
                    <span className="text-white">{orderSuccess.customerName} ({orderSuccess.customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8d97b5]">取件方式：</span>
                    <span className="text-white">{orderSuccess.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-[#8d97b5]">應付金額：</span>
                    <span className="text-emerald-400 font-black text-sm">HK${orderSuccess.totalHKD}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-left text-[11px] text-[#cbd2ef] space-y-1">
                  <span className="text-amber-300 font-bold block">📲 付款及出貨說明：</span>
                  <p>
                    我們已將訂單確認通知發送至你的聯絡號碼。透過 FPS 或 PayMe 付款後，訂單將於 24 小時內安排順豐出貨。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutProduct(null)}
                  className="btn w-full text-xs py-2.5"
                >
                  返回產品庫
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b0f1e] border border-white/20 rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowOrderHistory(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <PackageCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">我的解夢選物訂單記錄</h3>
                <p className="text-xs text-[#cbd2ef]">
                  你所購買的身心轉運與療癒商品訂單狀態
                </p>
              </div>
            </div>

            {savedOrdersList.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-white/[0.02] rounded-2xl border border-white/5">
                <ShoppingBag className="w-10 h-10 text-[#8d97b5] mx-auto opacity-50" />
                <p className="text-xs text-[#aab3d2]">目前暫無任何選物訂單記錄</p>
                <p className="text-[11px] text-[#8d97b5]">
                  完成解夢後，可於選物店瀏覽各類身心調校、助眠草本與能量淨化產品。
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedOrdersList.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {order.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          處理中 (已建檔)
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8d97b5]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <h4 className="font-bold text-white">{order.productName}</h4>
                        <div className="text-[11px] text-[#8d97b5] mt-0.5">
                          收件人：{order.customerName} · {order.customerPhone}
                        </div>
                        <div className="text-[11px] text-[#8d97b5] mt-0.5 truncate max-w-sm">
                          地址/取件：{order.deliveryAddress}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-emerald-400 font-mono">
                          HK${order.totalHKD}
                        </div>
                        {order.starsUsed && order.starsUsed > 0 ? (
                          <div className="text-[10px] text-amber-300 flex items-center justify-end gap-1">
                            <Star className="w-3 h-3 fill-amber-300" />
                            已抵扣 {order.starsUsed} 星
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {order.associatedDreamSummary && (
                      <div className="text-[10px] text-amber-200/90 bg-amber-950/20 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
                        關聯夢境：{order.associatedDreamSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOrderHistory(false)}
                className="btn text-xs py-2 px-4"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
