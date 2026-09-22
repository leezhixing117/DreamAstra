import React, { useState } from 'react';
import { ProductItem, User, PurchaseOrder, normalizeRole } from '../types';
import {
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Check,
  Truck,
  CreditCard,
  ChevronRight,
  X,
  Heart,
  RefreshCw,
  Flame,
  ExternalLink,
  PackageCheck,
  Clock,
  CheckCircle,
  Plus,
  AlertCircle,
  FileText,
  BadgeCheck,
  Edit3,
  Trash2,
} from 'lucide-react';
import { MemberProductSubmitModal } from './MemberProductSubmitModal';
import { EditProductModal } from './EditProductModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface ProductStoreViewProps {
  products: ProductItem[];
  currentUser: User | null;
  currentDreamSummary?: string;
  recommendedProductId?: string;
  onOpenLogin: () => void;
  onOpenEarnStars: () => void;
  onUpdateUserStars?: (newStars: number) => void;
  onNavigateToWorkspace?: () => void;
  onUpdateProducts?: (products: ProductItem[]) => void;
  onNavigateToAdmin?: () => void;
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
  onUpdateProducts,
  onNavigateToAdmin,
}) => {
  const [storeViewMode, setStoreViewMode] = useState<'public' | 'my_submissions' | 'pending_admin'>('public');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDetailProduct, setActiveDetailProduct] = useState<ProductItem | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<ProductItem | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Admin & Super Admin Management State
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  const normRole = normalizeRole(currentUser?.role);
  const isSuperAdmin = normRole === 'super_admin';
  const isAdmin = normRole === 'admin';
  const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

  const approvedProducts = products.filter((p) => !p.status || p.status === 'approved');
  const mySubmissions = currentUser ? products.filter((p) => p.submittedByUserId === currentUser.id) : [];
  const pendingAdminProducts = products.filter((p) => p.status === 'pending');

  const handleSaveEditedProduct = (updatedProduct: ProductItem) => {
    const updatedList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    if (onUpdateProducts) onUpdateProducts(updatedList);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updatedList));
    } catch {}

    if (activeDetailProduct?.id === updatedProduct.id) {
      setActiveDetailProduct(updatedProduct);
    }
    setSubmissionFeedback(`✅ 管理員操作成功：已更新選物產品「${updatedProduct.name}」！`);
    setProductToEdit(null);
  };

  const handleConfirmDeleteProduct = (productId: string) => {
    if (!isAdminOrSuperAdmin) return;
    const target = products.find((p) => p.id === productId);
    const updatedList = products.filter((p) => p.id !== productId);
    if (onUpdateProducts) onUpdateProducts(updatedList);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updatedList));
    } catch {}

    if (activeDetailProduct?.id === productId) {
      setActiveDetailProduct(null);
    }
    if (productToEdit?.id === productId) {
      setProductToEdit(null);
    }
    setProductToDelete(null);
    setSubmissionFeedback(`🗑️ 管理員操作成功：已從選物店永久刪除產品「${target?.name || ''}」！`);
  };

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

  const filteredProducts = approvedProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleOpenSubmitModal = () => {
    if (!currentUser) {
      alert('請先登入會員以提交選物產品上架申請！新產品將經由高級管理員審批後公開。');
      onOpenLogin();
      return;
    }
    setIsSubmitModalOpen(true);
  };

  const handleSuccessSubmitProduct = (newProduct: ProductItem) => {
    const updated = [newProduct, ...products];
    if (onUpdateProducts) {
      onUpdateProducts(updated);
    }
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {}

    setIsSubmitModalOpen(false);

    if (newProduct.status === 'approved') {
      setSubmissionFeedback(`✅ 高級管理員核准：產品「${newProduct.name}」已直接於解夢選物店公開上架！`);
      setStoreViewMode('public');
    } else {
      setSubmissionFeedback(
        `🎉 產品「${newProduct.name}」上架申請已成功送出！\n\n根據平台規範，此產品已進入待審批佇列，需經由高級管理員審批核准後方會公開上架。\n你可隨時在「我的上架申請」標籤追蹤審核進度。`
      );
      setStoreViewMode('my_submissions');
    }
  };

  const handleQuickApprove = (productId: string) => {
    if (!isSuperAdmin) return;
    const target = products.find((p) => p.id === productId);
    const updated = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            status: 'approved' as const,
            reviewedByUserId: currentUser?.id,
            reviewedAt: new Date().toISOString(),
          }
        : p
    );
    if (onUpdateProducts) onUpdateProducts(updated);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {}
    setSubmissionFeedback(`✅ 高級管理員審批完成：產品「${target?.name || ''}」已正式公開上架！`);
  };

  const handleQuickReject = (productId: string) => {
    if (!isSuperAdmin) return;
    const target = products.find((p) => p.id === productId);
    const reason = window.prompt(
      `請輸入退回產品「${target?.name || ''}」的理由：`,
      '暫不符合解夢選物店選品標準，請補充詳細規格或調整內容後再次提交'
    );
    if (reason === null) return;
    const updated = products.map((p) =>
      p.id === productId
        ? {
            ...p,
            status: 'rejected' as const,
            rejectionReason: reason || '暫不符合選品標準',
            reviewedByUserId: currentUser?.id,
            reviewedAt: new Date().toISOString(),
          }
        : p
    );
    if (onUpdateProducts) onUpdateProducts(updated);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {}
    setSubmissionFeedback(`❌ 已退回產品「${target?.name || ''}」的上架申請。`);
  };

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
          {isAdminOrSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                const newBlankProduct: ProductItem = {
                  id: 'prod_' + Date.now(),
                  name: '',
                  subTitle: '',
                  brand: 'DreamWisdom Atelier',
                  priceHKD: 128,
                  originalPriceHKD: 168,
                  starsRedeemCost: 15,
                  category: 'purify',
                  categoryLabel: '好運淨化',
                  volumeOrSpec: '100ml',
                  shelfLife: '2 年',
                  ingredients: ['天然草本提取物'],
                  keyBenefits: ['身心舒緩與淨化磁場'],
                  suitableDreams: ['噩夢', '心神不寧'],
                  matchingKeywords: ['淨化', '開運'],
                  recommendationReason: '解夢後身心調節推薦',
                  usageGuide: '睡前噴於枕頭或身心周遭',
                  cautions: ['避免入眼，置於陰涼乾燥處'],
                  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                  inStock: true,
                  status: 'approved',
                  reviewedByUserId: currentUser?.id,
                  reviewedAt: new Date().toISOString(),
                };
                setProductToEdit(newBlankProduct);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ 管理員新增/上架產品</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenSubmitModal}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isAdminOrSuperAdmin
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold shadow-lg shadow-emerald-500/25'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ 會員申請上架產品</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOrderHistory(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/15 shadow-sm transition-all cursor-pointer"
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

      {/* Submission Feedback Toast / Notice */}
      {submissionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-start justify-between gap-3 text-xs shadow-lg shadow-emerald-950/30">
          <div className="flex items-start gap-2.5 text-white leading-relaxed whitespace-pre-line">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{submissionFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionFeedback(null)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Senior Admin Pending Notification Banner */}
      {isSuperAdmin && pendingAdminProducts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-2.5 text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-white">👑 高級管理員審批提醒：</strong>
              <span>
                目前有 <strong className="text-amber-300 font-bold">{pendingAdminProducts.length}</strong> 件會員提交的選物產品正等待審批核准！
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setStoreViewMode('pending_admin')}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs cursor-pointer shadow-sm"
            >
              即時審批 ({pendingAdminProducts.length})
            </button>
            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs border border-white/20 cursor-pointer"
              >
                前往控制室 →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Store View Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStoreViewMode('public')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              storeViewMode === 'public'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛍️ 探索公開選品 ({approvedProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                alert('請先登入會員以查看你的產品上架申請！');
                onOpenLogin();
                return;
              }
              setStoreViewMode('my_submissions');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              storeViewMode === 'my_submissions'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-[#cbd2ef] hover:bg-white/10 border border-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📋 我的上架申請 ({mySubmissions.length})</span>
            {mySubmissions.some((p) => p.status === 'pending') && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setStoreViewMode('pending_admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                storeViewMode === 'pending_admin'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>👑 高級管理員審批佇列</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono font-bold">
                {pendingAdminProducts.length}
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenSubmitModal}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>申請上架新產品（需審批）</span>
        </button>
      </div>

      {/* TAB 1: PUBLIC PRODUCTS STOREFRONT */}
      {storeViewMode === 'public' && (
        <div className="space-y-6">
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
              全部公開產品 ({approvedProducts.length})
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

                {/* Admin & Senior Admin Quick Edit / Delete Toolbar */}
                {isAdminOrSuperAdmin && (
                  <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] bg-white/[0.03] -mx-5 -mb-5 px-5 py-2.5 rounded-b-2xl">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isSuperAdmin ? '高級管理員' : '管理員'}操作</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToEdit(product);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer transition-all border border-white/10 text-xs"
                        title="隨時更改此商品資料"
                      >
                        <Edit3 className="w-3 h-3 text-emerald-400" />
                        <span>更改</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToDelete(product);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center gap-1 font-medium cursor-pointer transition-all border border-red-500/20 text-xs"
                        title="隨時刪除此商品"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>刪除</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

      {/* TAB 2: MEMBER'S OWN SUBMISSIONS & APPROVAL TRACKER */}
      {storeViewMode === 'my_submissions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-purple-500/20 text-purple-300 border-purple-500/40">
                  <FileText className="w-3 h-3 text-purple-400" />
                  MEMBER SUBMISSION STATUS
                </span>
                <span className="text-xs text-[#cbd2ef]">
                  登入帳號：<strong className="text-white">{currentUser?.display_name || currentUser?.email}</strong>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">
                我的產品上架申請進度 ({mySubmissions.length})
              </h2>
              <p className="text-xs text-[#aab3d2] mt-1">
                解夢選物店落實品質保證：所有會員申請之選品均需經由高級管理員審批通過後，才會正式公開於選物店展示。
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenSubmitModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>申請上架新產品</span>
            </button>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <PackageCheck className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
              <h3 className="text-base font-bold text-white">你目前尚未提交任何選物產品上架申請</h3>
              <p className="text-xs text-[#8d97b5] max-w-md mx-auto leading-relaxed">
                你有自製安眠枕頭香氛、天然手工皂、空間聖木草杖、靜心水晶或草本舒緩茶嗎？歡迎提交給解夢選物店，經高級管理員審批後即可公開展示！
              </p>
              <button
                type="button"
                onClick={handleOpenSubmitModal}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>立即提交第一件產品上架申請</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mySubmissions.map((p) => {
                const isPending = p.status === 'pending';
                const isApproved = !p.status || p.status === 'approved';
                const isRejected = p.status === 'rejected';

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      isPending
                        ? 'bg-amber-950/15 border-amber-500/40 shadow-lg shadow-amber-950/20'
                        : isApproved
                        ? 'bg-emerald-950/15 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                        : 'bg-red-950/15 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-2xl object-cover bg-black/40 shrink-0 border border-white/10"
                      />

                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Status Tag */}
                        <div className="flex items-center justify-between gap-2">
                          {isPending && (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                              <span>⏳ 待高級管理員審批中</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>✅ 已核准公開上架</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-bold flex items-center gap-1.5">
                              <X className="w-3.5 h-3.5" />
                              <span>❌ 上架申請已退回</span>
                            </span>
                          )}

                          <span className="text-sm font-black text-white font-mono">
                            HK${p.priceHKD}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                        <p className="text-xs text-[#aab3d2] line-clamp-1">{p.subTitle}</p>

                        <div className="text-[11px] text-[#8d97b5]">
                          分類：{p.categoryLabel} · 規格：{p.volumeOrSpec}
                        </div>

                        <div className="text-[10px] text-[#8d97b5]">
                          申請時間：{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('zh-HK') : '近期'}
                        </div>
                      </div>
                    </div>

                    {/* Explanatory status card */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                      {isPending && (
                        <p className="text-amber-200/90 text-[11px] leading-relaxed">
                          🛡️ 產品審核中：已送交進駐佇列，等待高級管理員 (Super Admin) 審閱身心調校規格。審核通過後，該產品將自動公開於選物店展示。
                        </p>
                      )}
                      {isApproved && (
                        <div className="flex items-center justify-between text-[11px] text-emerald-300">
                          <span>🎉 恭喜！產品已通過高級管理員審批，正式在選物店公開展示。</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('all');
                              setStoreViewMode('public');
                              setActiveDetailProduct(p);
                            }}
                            className="text-white hover:underline shrink-0 font-medium ml-2 cursor-pointer"
                          >
                            前往商品頁 →
                          </button>
                        </div>
                      )}
                      {isRejected && (
                        <div className="space-y-1">
                          <p className="text-red-300 text-[11px]">
                            ⚠️ 審批退回原因：{p.rejectionReason || '暫不符合選品標準'}
                          </p>
                          <p className="text-[10px] text-[#aab3d2]">
                            提示：你可以點擊右上方「申請上架新產品」補充成分或調整說明後重新送出。
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Admin or Submitter Action Controls */}
                    {(isAdminOrSuperAdmin || (currentUser && p.submittedByUserId === currentUser.id)) && (
                      <div className="pt-2.5 flex items-center justify-between border-t border-white/10 text-xs">
                        <span className="text-[11px] text-[#8d97b5]">
                          {isAdminOrSuperAdmin ? '管理員可隨時更改或移除此產品' : '您可隨時更改或撤回此申請'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProductToEdit(p)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 text-xs flex items-center gap-1 cursor-pointer border border-white/10 transition-all"
                            title="更改產品資料"
                          >
                            <Edit3 className="w-3 h-3 text-emerald-400" />
                            <span>更改資料</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs flex items-center gap-1 cursor-pointer border border-red-500/20 transition-all"
                            title="刪除此商品"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>刪除</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENIOR ADMIN REVIEW QUEUE (SUPER ADMIN ONLY) */}
      {storeViewMode === 'pending_admin' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-amber-500/20 text-amber-300 border-amber-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  SUPER ADMIN APPROVAL QUEUE
                </span>
                <span className="text-xs text-amber-200 font-bold">
                  👑 高級管理員專屬權限
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">
                會員提交產品審批佇列 ({pendingAdminProducts.length})
              </h2>
              <p className="text-xs text-[#aab3d2] mt-1">
                會員登入後提交的選物產品在此匯集。審批通過後，產品將立即向全體客人公開展示；高級管理員亦可隨時修改產品規格或直接刪除。
              </p>
            </div>

            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs border border-white/20 cursor-pointer self-start sm:self-auto shrink-0 transition-all"
              >
                前往完整 Admin 控制室 →
              </button>
            )}
          </div>

          {pendingAdminProducts.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">目前無等待審批之產品！</h3>
              <p className="text-xs text-[#8d97b5] max-w-sm mx-auto">
                所有會員申請項目皆已完成審批處理。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingAdminProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-amber-950/15 border-2 border-amber-500/50 flex flex-col justify-between gap-4 shadow-xl shadow-amber-950/30"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-28 h-28 rounded-2xl object-cover bg-black/40 shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {p.categoryLabel}
                        </span>
                        <span className="text-base font-black text-white font-mono">
                          HK${p.priceHKD}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-[#cbd2ef] line-clamp-2">{p.subTitle}</p>

                      <div className="text-[11px] text-[#aab3d2]">
                        品牌：{p.brand} · 規格：{p.volumeOrSpec}
                      </div>

                      <div className="text-[10px] text-amber-200 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                        👤 提交會員：<strong className="text-white">{p.submittedByUserName}</strong>
                        {p.submittedByUserEmail ? ` (${p.submittedByUserEmail})` : ''} ·{' '}
                        {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('zh-HK') : '近期'}
                      </div>
                    </div>
                  </div>

                  {/* Product Details for Approval Verification */}
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                    <div>
                      <span className="text-[#8d97b5] block text-[10px]">成分 / 原料：</span>
                      <span className="text-white text-[11px]">
                        {p.ingredients?.join('、') || '天然草本'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8d97b5] block text-[10px]">核心功效：</span>
                      <span className="text-emerald-300 text-[11px]">
                        {p.keyBenefits?.join(' · ') || '舒緩放鬆'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8d97b5] block text-[10px]">推薦理由 / 創作心意：</span>
                      <span className="text-[#cbd2ef] text-[11px]">
                        {p.recommendationReason || '無'}
                      </span>
                    </div>
                  </div>

                  {/* Action Controls for Senior Admin */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-500/20">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProductToEdit(p)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer border border-white/10"
                        title="更改產品規格"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>更改</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(p)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-red-500/30"
                        title="刪除此商品"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>刪除</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickReject(p.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>退回</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickApprove(p.id)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>核准上架</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

                {/* Admin & Senior Admin Management Controls */}
                {isAdminOrSuperAdmin && (
                  <div className="pt-2 mt-1 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const prod = activeDetailProduct;
                        setProductToEdit(prod);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-white/15 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>更改此產品</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const prod = activeDetailProduct;
                        setProductToDelete(prod);
                      }}
                      className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>刪除商品</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Scent notes & Key benefits */}
            {activeDetailProduct.scentNotes && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  🌿 天然植萃香氛金字塔調配
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

      {/* Member Product Submission Modal */}
      {currentUser && (
        <MemberProductSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          currentUser={currentUser}
          onSuccessSubmit={handleSuccessSubmitProduct}
        />
      )}

      {/* Edit Product Modal for Admin & Senior Admin */}
      {isAdminOrSuperAdmin && (
        <EditProductModal
          isOpen={!!productToEdit}
          onClose={() => setProductToEdit(null)}
          product={productToEdit}
          onSaveProduct={handleSaveEditedProduct}
          onDeleteProduct={(id) => {
            const prod = products.find((p) => p.id === id);
            if (prod) {
              setProductToDelete(prod);
            }
          }}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {/* In-App Confirmation Modal for Safe Product Deletion */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        product={productToDelete}
        onConfirm={handleConfirmDeleteProduct}
      />
    </div>
  );
};
