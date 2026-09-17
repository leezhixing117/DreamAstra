import React, { useState } from 'react';
import { BookBrainItem, EngineSettings, User, UserRole, ProductItem, AdVideoItem, normalizeRole, getRoleDisplayName } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_AD_VIDEOS } from '../data';
import { BookOpen, Sliders, Users, Upload, Check, AlertCircle, RefreshCw, UserCheck, Trash2, Edit3, Plus, ShieldCheck, ShieldAlert, Star, Crown, Settings, ShoppingBag, Package, Sparkles, Tv, Play, Video, Eye } from 'lucide-react';

interface BookTheoryItem {
  id: string;
  theoryName: string;
  bookTitle: string;
  citation: string;
  coreInsight: string;
}

const INITIAL_THEORIES: BookTheoryItem[] = [
  {
    id: 'theory_jung_shadow',
    theoryName: '榮格陰影追逐與補償假說 (Shadow Archetype)',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: 'p. 168-175',
    coreInsight: '夢中追逐你的未知力量，實為被清醒意識壓抑的內在特質（陰影）。直面而非逃避是自我整合的第一步。',
  },
  {
    id: 'theory_freud_repression',
    theoryName: '潛抑願望與日間殘留 (Wish-Fulfillment & Day Residue)',
    bookTitle: 'The Interpretation of Dreams (Sigmund Freud)',
    citation: 'p. 210-218',
    coreInsight: '夢是清醒時未滿足願望的象徵性變形滿足，常借用前一日的琐碎細節（殘留記憶）作為化妝偽裝。',
  },
  {
    id: 'theory_asian_exam',
    theoryName: '集體考場烙印與家族倫理 (Collective Examination Trauma)',
    bookTitle: '當代華人夢境象徵與心理原鄉',
    citation: 'p. 82-89',
    coreInsight: '成年後反覆夢見赤腳考試、忘記準考證，對應華人社會成長過程中深植的評核焦慮與對群體期望的恐懼。',
  },
  {
    id: 'theory_water_ocean',
    theoryName: '無意識之海與情緒水位假說 (Oceanic Subconscious)',
    bookTitle: 'Man and His Symbols (Carl G. Jung)',
    citation: 'p. 112-118',
    coreInsight: '水位的起伏是潛意識情感蓄積程度的晴雨表。浪潮上升象徵壓抑情感突破臨界點，尋找高處象徵理性自保防線。',
  },
];

interface AdminConsoleProps {
  initialBooks: BookBrainItem[];
  initialUsers: User[];
  initialSettings: EngineSettings;
  initialProducts?: ProductItem[];
  initialAdVideos?: AdVideoItem[];
  currentUserId: string;
  currentUserRole?: UserRole;
  onUpdateSettings: (settings: EngineSettings) => void;
  onUpdateUsers?: (users: User[]) => void;
  onUpdateBooks?: (books: BookBrainItem[]) => void;
  onUpdateProducts?: (products: ProductItem[]) => void;
  onUpdateAdVideos?: (adVideos: AdVideoItem[]) => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  initialBooks,
  initialUsers,
  initialSettings,
  initialProducts = INITIAL_PRODUCTS,
  initialAdVideos = INITIAL_AD_VIDEOS,
  currentUserId,
  currentUserRole = 'super_admin',
  onUpdateSettings,
  onUpdateUsers,
  onUpdateBooks,
  onUpdateProducts,
  onUpdateAdVideos,
  onSwitchUser,
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'theories' | 'products' | 'advideos' | 'engine' | 'users'>('books');
  const [books, setBooks] = useState<BookBrainItem[]>(initialBooks);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [adVideos, setAdVideos] = useState<AdVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_ad_videos');
      return saved ? JSON.parse(saved) : initialAdVideos;
    } catch {
      return initialAdVideos;
    }
  });
  const [theories, setTheories] = useState<BookTheoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_theories');
      return saved ? JSON.parse(saved) : INITIAL_THEORIES;
    } catch {
      return INITIAL_THEORIES;
    }
  });
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<EngineSettings>(initialSettings);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  // Editing theory state
  const [editingTheory, setEditingTheory] = useState<BookTheoryItem | null>(null);
  const [isAddingTheory, setIsAddingTheory] = useState(false);
  const [theoryForm, setTheoryForm] = useState<Partial<BookTheoryItem>>({
    theoryName: '',
    bookTitle: '',
    citation: '',
    coreInsight: '',
  });

  // Product management state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({
    name: '',
    subTitle: '',
    brand: '',
    priceHKD: 68,
    category: 'purify',
    categoryLabel: '淨化去霉 · 好運轉化',
    volumeOrSpec: '100ML',
    shelfLife: '2 年',
    recommendationReason: '',
    usageGuide: '',
    imageUrl: '',
    badge: '',
    inStock: true,
  });

  // Ad Video Management State
  const [editingAd, setEditingAd] = useState<AdVideoItem | null>(null);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [previewingAd, setPreviewingAd] = useState<AdVideoItem | null>(null);
  const [adForm, setAdForm] = useState<Partial<AdVideoItem>>({
    title: '',
    advertiser: '',
    tagline: '',
    durationSeconds: 10,
    rewardStars: 1,
    category: 'alien_philosophy',
    bgGradient: 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
    accentColor: '#aa9cff',
    isActive: true,
    posterUrl: '',
    videoUrl: '',
  });
  const [dialogueRows, setDialogueRows] = useState<Array<{ speaker: string; text: string }>>([
    { speaker: '外星導師', text: '' },
  ]);

  const isSuperAdmin = normalizeRole(currentUserRole) === 'super_admin';

  // Save products
  const saveProducts = (updated: ProductItem[]) => {
    setProducts(updated);
    if (onUpdateProducts) onUpdateProducts(updated);
    try {
      localStorage.setItem('dreamwisdom_products', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.priceHKD) return;

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...productForm,
              name: productForm.name || p.name,
              priceHKD: Number(productForm.priceHKD) || p.priceHKD,
            }
          : p
      );
      saveProducts(updated);
      setNotice(`已更新產品「${productForm.name}」資料`);
      setEditingProduct(null);
    } else {
      const newProd: ProductItem = {
        id: 'prod_' + Date.now(),
        name: productForm.name || '新產品',
        subTitle: productForm.subTitle || '',
        brand: productForm.brand || 'DreamWisdom',
        priceHKD: Number(productForm.priceHKD) || 50,
        originalPriceHKD: productForm.originalPriceHKD ? Number(productForm.originalPriceHKD) : undefined,
        starsRedeemCost: 15,
        category: productForm.category || 'purify',
        categoryLabel: productForm.categoryLabel || '好運淨化',
        volumeOrSpec: productForm.volumeOrSpec || '標準裝',
        shelfLife: productForm.shelfLife || '2 年',
        ingredients: productForm.ingredients || ['天然草本提取物'],
        keyBenefits: productForm.keyBenefits || ['淨化空間與身心氣場'],
        suitableDreams: ['噩夢', '心神不寧', '去霉轉運'],
        matchingKeywords: ['霉', '鬼', '驚', '亂', '沉'],
        recommendationReason: productForm.recommendationReason || '解夢後身心調節推薦',
        usageGuide: productForm.usageGuide || '適量噴於空氣中或脈搏處',
        cautions: ['避免入眼，置於陰涼乾燥處'],
        imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        badge: productForm.badge,
        inStock: true,
      };
      const updated = [newProd, ...products];
      saveProducts(updated);
      setNotice(`已成功新增產品條目：「${newProd.name}」`);
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (!window.confirm('確定要從產品資料庫移除此商品嗎？')) return;
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setNotice('已刪除該商品條目');
  };

  // Save Ad Videos
  const saveAdVideos = (updated: AdVideoItem[]) => {
    setAdVideos(updated);
    if (onUpdateAdVideos) onUpdateAdVideos(updated);
    try {
      localStorage.setItem('dreamwisdom_ad_videos', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSaveAdVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title || !adForm.advertiser) {
      alert('請填寫廣告標題及贊助商名稱');
      return;
    }

    const filteredDialogues = dialogueRows.filter((d) => d.text.trim().length > 0);

    if (editingAd) {
      const updated = adVideos.map((ad) =>
        ad.id === editingAd.id
          ? {
              ...ad,
              ...adForm,
              title: adForm.title || ad.title,
              advertiser: adForm.advertiser || ad.advertiser,
              tagline: adForm.tagline || ad.tagline,
              durationSeconds: Number(adForm.durationSeconds) || ad.durationSeconds,
              rewardStars: Number(adForm.rewardStars) || ad.rewardStars,
              category: adForm.category || ad.category,
              dialogueDialogue: filteredDialogues.length > 0 ? filteredDialogues : ad.dialogueDialogue,
              bgGradient: adForm.bgGradient || ad.bgGradient,
              accentColor: adForm.accentColor || ad.accentColor,
              posterUrl: adForm.posterUrl,
              videoUrl: adForm.videoUrl,
            }
          : ad
      );
      saveAdVideos(updated);
      setNotice(`已更新廣告短片「${adForm.title}」`);
      setEditingAd(null);
    } else {
      const newAd: AdVideoItem = {
        id: 'ad_' + Date.now(),
        title: adForm.title || '全新心靈贊助廣告',
        advertiser: adForm.advertiser || '品牌贊助商',
        tagline: adForm.tagline || '觀看獲取星星幣，解鎖進階夢境探索。',
        durationSeconds: Number(adForm.durationSeconds) || 10,
        rewardStars: Number(adForm.rewardStars) || 1,
        category: adForm.category || 'alien_philosophy',
        bgGradient: adForm.bgGradient || 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
        accentColor: adForm.accentColor || '#aa9cff',
        isActive: adForm.isActive ?? true,
        posterUrl: adForm.posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        videoUrl: adForm.videoUrl,
        dialogueDialogue: filteredDialogues.length > 0 ? filteredDialogues : undefined,
        createdAt: new Date().toISOString(),
      };
      const updated = [newAd, ...adVideos];
      saveAdVideos(updated);
      setNotice(`已成功新增廣告短片：「${newAd.title}」（現已加入隨機播放池）`);
      setIsAddingAd(false);
    }
  };

  const handleDeleteAdVideo = (id: string) => {
    if (!window.confirm('確定要從廣告資料庫刪除此廣告短片嗎？客人將不再隨機觀看到此廣告。')) return;
    const updated = adVideos.filter((a) => a.id !== id);
    saveAdVideos(updated);
    setNotice('已從廣告庫刪除該短片');
  };

  const handleToggleAdActive = (id: string) => {
    const updated = adVideos.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    saveAdVideos(updated);
    const target = updated.find((a) => a.id === id);
    setNotice(`廣告「${target?.title}」狀態已更改為：${target?.isActive ? '啟用 (隨機播放)' : '已下架停播'}`);
  };

  // Save theories to localStorage
  const saveTheories = (updated: BookTheoryItem[]) => {
    setTheories(updated);
    localStorage.setItem('dreamwisdom_theories', JSON.stringify(updated));
  };

  // Handle uploading book
  async function handleUpload(file: File) {
    setBusy('upload');
    setNotice('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const totalEstimatedPages = Math.floor(Math.random() * 200) + 50;
      const newBook: BookBrainItem = {
        id: 'book_' + Date.now(),
        title: file.name.replace(/\.[^.]+$/, ''),
        file_name: file.name,
        status: 'queued',
        total_pages: totalEstimatedPages,
        processed_pages: 0,
        created_at: new Date().toISOString(),
      };
      const updated = [newBook, ...books];
      setBooks(updated);
      if (onUpdateBooks) onUpdateBooks(updated);
      setNotice(`書本「${newBook.title}」已加入 OCR 與知識庫建構佇列。點擊「開始 OCR 索引」即可提取理論段落。`);
    } catch (e: any) {
      alert(e.message || '上傳失敗');
    } finally {
      setBusy('');
    }
  }

  // Handle OCR processing of a book
  async function processBook(id: string) {
    setBusy(id);
    setNotice('');
    try {
      const book = books.find((b) => b.id === id);
      if (!book) return;

      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'processing' } : b))
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const updated = books.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'ready' as const,
              processed_pages: b.total_pages,
            }
          : b
      );
      setBooks(updated);
      if (onUpdateBooks) onUpdateBooks(updated);
      setNotice(`「${book.title}」Book Brain 處理完成！文字已向量化儲存，解夢時會自動引用。`);
    } catch (e: any) {
      alert(e.message || '處理失敗');
    } finally {
      setBusy('');
    }
  }

  // Delete a book
  function handleDeleteBook(id: string) {
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    if (onUpdateBooks) onUpdateBooks(updated);
    setNotice('已從 Book Brain 中移除該典籍。');
  }

  // Save settings
  function saveSettings() {
    setBusy('settings');
    setTimeout(() => {
      onUpdateSettings(settings);
      setNotice('✓ AI 解夢引擎風格參數與 Prompt 已成功儲存。');
      setBusy('');
    }, 250);
  }

  // Handle Role Change (ONLY SUPER ADMIN CAN CALL THIS)
  function handleRoleChange(userToChange: User, newRole: UserRole) {
    if (!isSuperAdmin) {
      alert('權限不足：只有高級管理員 (Super Admin) 可以更改會員等級。');
      return;
    }

    if (userToChange.id === currentUserId && newRole !== 'super_admin') {
      const confirmChange = window.confirm('你正在將自己降級，確定要執行嗎？');
      if (!confirmChange) return;
    }

    const normNewRole = normalizeRole(newRole);
    setBusy(userToChange.id);

    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, role: normNewRole } : u
    );

    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);

    setNotice(
      `✓ 已成功將「${userToChange.display_name || userToChange.email}」的等級更改為：${getRoleDisplayName(
        normNewRole
      )}`
    );
    setBusy('');
  }

  // Adjust Stars for a user (Super admin only)
  function handleAdjustStars(userToChange: User, delta: number) {
    if (!isSuperAdmin) {
      alert('只有高級管理員可以手動調整會員星星。');
      return;
    }
    const current = userToChange.stars ?? 0;
    const nextStars = Math.max(0, current + delta);
    const updatedUsers = users.map((u) =>
      u.id === userToChange.id ? { ...u, stars: nextStars } : u
    );
    setUsers(updatedUsers);
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    setNotice(`已為「${userToChange.email}」調整星星數為：${nextStars} 顆 ⭐`);
  }

  // Add / Edit Theory logic
  function handleSaveTheory(e: React.FormEvent) {
    e.preventDefault();
    if (!theoryForm.theoryName || !theoryForm.coreInsight) return;

    if (editingTheory) {
      const updated = theories.map((t) =>
        t.id === editingTheory.id
          ? {
              ...t,
              theoryName: theoryForm.theoryName || t.theoryName,
              bookTitle: theoryForm.bookTitle || t.bookTitle,
              citation: theoryForm.citation || t.citation,
              coreInsight: theoryForm.coreInsight || t.coreInsight,
            }
          : t
      );
      saveTheories(updated);
      setNotice(`已成功修改理論條目：「${theoryForm.theoryName}」`);
      setEditingTheory(null);
    } else {
      const newTheory: BookTheoryItem = {
        id: 'theory_' + Date.now(),
        theoryName: theoryForm.theoryName || '未命名理論',
        bookTitle: theoryForm.bookTitle || '自訂典籍文獻',
        citation: theoryForm.citation || 'p. 1',
        coreInsight: theoryForm.coreInsight || '',
      };
      saveTheories([newTheory, ...theories]);
      setNotice(`已新增理論條目：「${newTheory.theoryName}」`);
      setIsAddingTheory(false);
    }
    setTheoryForm({ theoryName: '', bookTitle: '', citation: '', coreInsight: '' });
  }

  function handleDeleteTheory(id: string) {
    const updated = theories.filter((t) => t.id !== id);
    saveTheories(updated);
    setNotice('已刪除該理論條目。');
  }

  return (
    <div className="space-y-6" id="admin-console-wrapper">
      {notice && (
        <div className="callout text-sm flex items-center justify-between" id="admin-notice-callout">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#78e1b5]" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice('')}
            className="text-xs text-[#aab3d2] hover:text-white cursor-pointer"
          >
            關閉
          </button>
        </div>
      )}

      {/* Role permission status banner */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isSuperAdmin 
          ? 'bg-[#aa9cff]/10 border-[#aa9cff]/30 text-[#c3b9ff]'
          : 'bg-[#71d9ff]/10 border-[#71d9ff]/30 text-[#71d9ff]'
      }`}>
        <div className="flex items-center gap-2.5">
          {isSuperAdmin ? (
            <ShieldCheck className="w-5 h-5 text-[#aa9cff]" />
          ) : (
            <Settings className="w-5 h-5 text-[#71d9ff]" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">
              {isSuperAdmin ? '🛡️ 高級管理員模式 (SUPER ADMIN)' : '⚙️ 內容管理員模式 (ADMIN)'}
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isSuperAdmin
                ? '您擁有最高權限：可管理修改 Book Brain 典籍、廣告賺星影片庫、調整 AI 語氣參數，以及更改所有會員之等級與星星配置。'
                : '您擁有內容管理權限：可管理與修改 Book Brain 典籍、廣告賺星影片庫、編輯夢境理論辭典、調整 AI 引擎參數。（更改會員等級需高級管理員權限）'}
            </p>
          </div>
        </div>

        <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
          isSuperAdmin 
            ? 'bg-[#aa9cff]/20 text-[#aa9cff] border-[#aa9cff]/40' 
            : 'bg-[#71d9ff]/20 text-[#71d9ff] border-[#71d9ff]/40'
        }`}>
          {isSuperAdmin ? '最高權限' : '內容管理權限'}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'books'
              ? 'bg-[#71d9ff]/20 text-white border border-[#71d9ff]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#71d9ff]" />
          <span>📚 Book Brain 典籍 ({books.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theories')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'theories'
              ? 'bg-[#78e1b5]/20 text-white border border-[#78e1b5]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Edit3 className="w-4 h-4 text-[#78e1b5]" />
          <span>📑 夢境理論辭典管理 ({theories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>🌿 解夢選物產品庫 ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advideos')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'advideos'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Tv className="w-4 h-4 text-amber-400" />
          <span>📺 賺星廣告影片庫 ({adVideos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('engine')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'engine'
              ? 'bg-[#ffd27a]/20 text-white border border-[#ffd27a]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#ffd27a]" />
          <span>🎛️ AI 引擎個性參數</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#aa9cff]/20 text-white border border-[#aa9cff]/40 shadow-sm'
              : 'text-[#aab3d2] hover:text-white bg-white/5 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-[#aa9cff]" />
          <span>👥 會員等級管理 ({users.length})</span>
          {isSuperAdmin && (
            <span className="w-2 h-2 rounded-full bg-[#aa9cff] animate-ping" />
          )}
        </button>
      </div>

      {/* TAB 1: BOOK BRAIN MANAGEMENT */}
      {activeTab === 'books' && (
        <section className="card p-6" id="admin-book-brain-card">
          <div className="flex items-center justify-between">
            <span className="badge">
              <BookOpen className="w-3 h-3 text-[#71d9ff]" />
              BOOK BRAIN KNOWLEDGE REPOSITORY
            </span>
            <span className="text-xs text-[#8d97b5]">已收錄 {books.length} 本典籍</span>
          </div>

          <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
            書本知識庫管理與索引
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            管理員與高級管理員皆可在此上傳專業典籍、觸發 OCR 向量化處理，或刪除過時文獻。
            解夢時系統優先根據此處的知識庫檢索心理學依據。
          </p>

          <label
            className="filedrop block mt-4 p-5 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#71d9ff]/50 bg-white/[0.02] text-center cursor-pointer transition-all"
            id="book-upload-dropzone"
          >
            <div className="text-3xl mb-1">📚</div>
            <b className="text-sm text-white block">
              {busy === 'upload' ? '上傳與解析中…' : '加入 PDF / 書籍掃描圖檔 (JPG, PNG, WebP)'}
            </b>
            <div className="tiny muted mt-1">
              單檔最高支援 50MB · 文字型直接切段，掃描圖檔啟用 OCR 視覺分析
            </div>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp,text/plain"
              disabled={busy === 'upload'}
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.currentTarget.value = '';
              }}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
            {books.map((b) => {
              const p = Math.round((b.processed_pages / Math.max(1, b.total_pages)) * 100);
              return (
                <div
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  key={b.id}
                  id={`book-item-${b.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span
                        className={
                          b.status === 'ready'
                            ? 'text-[#78e1b5] font-semibold flex items-center gap-1'
                            : b.status === 'processing'
                            ? 'text-[#ffd27a]'
                            : 'text-[#8d97b5]'
                        }
                      >
                        {b.status === 'ready' ? '✓ Ready (已建庫)' : b.status === 'processing' ? '⚡ 索引中…' : '⏳ 待處理'}
                      </span>
                      <span className="text-[11px] text-[#8d97b5] font-mono">
                        {b.processed_pages}/{b.total_pages} 頁 ({p}%)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{b.title}</h3>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden my-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#71d9ff] to-[#78e1b5] transition-all"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    {b.status !== 'ready' ? (
                      <button
                        type="button"
                        className="btn dark text-xs py-1.5 px-3"
                        disabled={busy === b.id}
                        onClick={() => processBook(b.id)}
                      >
                        {busy === b.id ? '處理中…' : '開始 OCR 索引'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#78e1b5]">已可用於 AI 檢索</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteBook(b.id)}
                      className="p-1.5 text-xs text-[#8d97b5] hover:text-[#ff8b9d] transition-colors cursor-pointer"
                      title="刪除此典籍"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: THEORY & CONTENT MANAGEMENT (管理及修改內容) */}
      {activeTab === 'theories' && (
        <section className="card p-6" id="admin-theories-card">
          <div className="flex items-center justify-between">
            <div>
              <span className="badge">
                <Edit3 className="w-3 h-3 text-[#78e1b5]" />
                CONTENT EDITING & PSYCHOLOGICAL THEORIES
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                心理學理論與核心象徵內容管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1">
                管理員與高級管理員均可新增、修訂或更新 Book Brain 的核心理論條目與引文見解。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingTheory(true);
                setEditingTheory(null);
                setTheoryForm({ theoryName: '', bookTitle: '', citation: '', coreInsight: '' });
              }}
              className="btn text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增理論條目</span>
            </button>
          </div>

          {/* Form Modal / Inline Editor */}
          {(isAddingTheory || editingTheory) && (
            <form
              onSubmit={handleSaveTheory}
              className="p-5 rounded-2xl bg-white/[0.04] border border-[#78e1b5]/30 mt-4 space-y-3"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#78e1b5]" />
                <span>{editingTheory ? '編輯理論內容' : '新增理論內容'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1">理論名稱 *</label>
                  <input
                    type="text"
                    required
                    value={theoryForm.theoryName}
                    onChange={(e) => setTheoryForm({ ...theoryForm, theoryName: e.target.value })}
                    placeholder="例如：榮格原型理論、東方集體考場烙印"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#cbd2ef] block mb-1">出處典籍 *</label>
                  <input
                    type="text"
                    required
                    value={theoryForm.bookTitle}
                    onChange={(e) => setTheoryForm({ ...theoryForm, bookTitle: e.target.value })}
                    placeholder="例如：Man and His Symbols (Carl G. Jung)"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#cbd2ef] block mb-1">引文頁碼 / 章節</label>
                <input
                  type="text"
                  value={theoryForm.citation}
                  onChange={(e) => setTheoryForm({ ...theoryForm, citation: e.target.value })}
                  placeholder="例如：p. 168-175, 第二章"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                />
              </div>

              <div>
                <label className="text-xs text-[#cbd2ef] block mb-1">核心理論闡釋與心理洞察 *</label>
                <textarea
                  rows={3}
                  required
                  value={theoryForm.coreInsight}
                  onChange={(e) => setTheoryForm({ ...theoryForm, coreInsight: e.target.value })}
                  placeholder="詳細說明該理論如何闡明特定夢境意象……"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#78e1b5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTheory(false);
                    setEditingTheory(null);
                  }}
                  className="btn2 text-xs py-1.5 px-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn text-xs py-1.5 px-4"
                >
                  儲存修改
                </button>
              </div>
            </form>
          )}

          {/* Theory List */}
          <div className="space-y-3 mt-4">
            {theories.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#78e1b5]/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{t.theoryName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#78e1b5]/10 text-[#78e1b5] font-mono">
                      {t.citation}
                    </span>
                  </div>
                  <div className="text-xs text-[#71d9ff] font-medium">
                    📚 {t.bookTitle}
                  </div>
                  <p className="text-xs text-[#cbd2ef] leading-relaxed">
                    {t.coreInsight}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTheory(t);
                      setIsAddingTheory(false);
                      setTheoryForm(t);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#aab3d2] hover:text-white transition-colors"
                    title="編輯此條目"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTheory(t.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-xs text-[#8d97b5] hover:text-[#ff8b9d] transition-colors"
                    title="刪除此條目"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: PRODUCTS DATABASE MANAGEMENT */}
      {activeTab === 'products' && (
        <section className="card p-6" id="admin-products-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <Package className="w-3 h-3 text-emerald-400" />
                POST-DREAM PRODUCTS DATABASE
              </span>
              <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
                解夢後選購產品資料庫管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed mt-1">
                管理可供客人在完成夢境分析後選購之身心轉運產品（包含廣東碌柚葉好運噴霧、安眠草本、空間淨化等）。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingProduct(true);
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  subTitle: '',
                  brand: '零離 (LINGLI)',
                  priceHKD: 68,
                  category: 'purify',
                  categoryLabel: '淨化去霉 · 好運轉化',
                  volumeOrSpec: '100ML',
                  shelfLife: '2 年',
                  recommendationReason: '',
                  usageGuide: '',
                  imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                  badge: '🌿 新品推薦',
                  inStock: true,
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>新增產品條目</span>
            </button>
          </div>

          {/* Add / Edit Product Form */}
          {(isAddingProduct || editingProduct) && (
            <form
              onSubmit={handleSaveProduct}
              className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 mb-6"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>{editingProduct ? '編輯產品資料' : '新增選物產品條目'}</span>
                </h3>
                <span className="text-xs text-emerald-300">
                  {editingProduct ? `ID: ${editingProduct.id}` : '草稿'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#cbd2ef] block mb-1">產品名稱 *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="例如：零離 · 廣東精選碌柚葉好運香水噴霧"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">副標題 / 宣傳特點</label>
                  <input
                    type="text"
                    value={productForm.subTitle || ''}
                    onChange={(e) => setProductForm({ ...productForm, subTitle: e.target.value })}
                    placeholder="例如：去霉開運 · 日進斗金 · 鴻運當頭"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">品牌名稱</label>
                  <input
                    type="text"
                    value={productForm.brand || ''}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="例如：零離 (LINGLI)"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">售價 (HK$) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.priceHKD || 0}
                      onChange={(e) => setProductForm({ ...productForm, priceHKD: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">原價 (HK$)</label>
                    <input
                      type="number"
                      value={productForm.originalPriceHKD || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPriceHKD: Number(e.target.value) })}
                      placeholder="98"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">產品分類</label>
                  <select
                    value={productForm.category || 'purify'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="purify">🍃 淨化去霉 · 好運轉化 (碌柚葉等)</option>
                    <option value="sleep">🌙 深眠安神 · 夢境撫慰 (枕頭噴霧)</option>
                    <option value="incense">🌿 空間結界 · 白鼠尾草</option>
                    <option value="crystal">💎 靈性直覺 · 守護水晶</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">規格容量 / 包裝</label>
                  <input
                    type="text"
                    value={productForm.volumeOrSpec || ''}
                    onChange={(e) => setProductForm({ ...productForm, volumeOrSpec: e.target.value })}
                    placeholder="100ML 噴霧裝"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cbd2ef] block mb-1">產品圖片 URL</label>
                  <input
                    type="text"
                    value={productForm.imageUrl || ''}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="圖片網址"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cbd2ef] block mb-1">解夢後推薦理由 (廣東話)</label>
                  <textarea
                    rows={2}
                    value={productForm.recommendationReason || ''}
                    onChange={(e) => setProductForm({ ...productForm, recommendationReason: e.target.value })}
                    placeholder="醒來若感心有餘悸或沉重滯塞，廣東傳統以碌柚葉水淨身去霉..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="btn2 text-xs py-1.5 px-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-md"
                >
                  儲存產品
                </button>
              </div>
            </form>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all flex items-start gap-4"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover bg-black/40 shrink-0 border border-white/10"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {p.categoryLabel}
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      HK${p.priceHKD}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-[#aab3d2] line-clamp-1">
                    {p.subTitle}
                  </p>

                  <div className="text-[10px] text-[#8d97b5] pt-0.5">
                    規格：{p.volumeOrSpec} · 品牌：{p.brand}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-[10px] text-amber-300">
                      適用關鍵字：{p.matchingKeywords.slice(0, 4).join('、')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsAddingProduct(false);
                          setProductForm(p);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs"
                        title="編輯此產品"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8d97b5] hover:text-[#ff8b9d] text-xs"
                        title="刪除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB: AD VIDEO DATABASE MANAGEMENT (只有管理員及高級管理員加減，隨意出給客人觀看賺星星) */}
      {activeTab === 'advideos' && (
        <section className="card p-6" id="admin-advideos-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
            <div>
              <span className="badge bg-amber-500/20 text-amber-300 border-amber-500/40">
                <Tv className="w-3 h-3 text-amber-400" />
                ADVERTISEMENT & SPONSOR VIDEO DATABASE
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                賺星星廣告資料庫管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-1">
                此處所管理的廣告短片將於客人點擊「睇片儲星」時，隨機挑選播放。只有管理員及高級管理員有權新增、編輯、下架或刪除。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingAd(true);
                  setEditingAd(null);
                  setAdForm({
                    title: '',
                    advertiser: '',
                    tagline: '',
                    durationSeconds: 10,
                    rewardStars: 1,
                    category: 'alien_philosophy',
                    bgGradient: 'from-[#0b051d] via-[#1a0c3b] to-[#04010a]',
                    accentColor: '#aa9cff',
                    isActive: true,
                    posterUrl: '',
                    videoUrl: '',
                  });
                  setDialogueRows([{ speaker: '外星導師', text: '' }]);
                }}
                className="btn primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
                id="btn-add-advideo"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增廣告短片</span>
              </button>
            </div>
          </div>

          {/* Add / Edit Ad Video Form */}
          {(isAddingAd || editingAd) && (
            <form
              onSubmit={handleSaveAdVideo}
              className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4 mb-6 animate-fade-in"
              id="advideo-form"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-amber-400" />
                  <span>{editingAd ? '編輯廣告短片內容' : '新增廣告短片資料'}</span>
                </h3>
                <span className="text-xs text-amber-300">
                  {editingAd ? `ID: ${editingAd.id}` : '全新廣告條目'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="text-[#cbd2ef] block mb-1">廣告標題 / 主題 *</label>
                  <input
                    type="text"
                    required
                    value={adForm.title || ''}
                    onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                    placeholder="例如：👽 星際對話 · 外星導師解密夢境的唯一真實"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">贊助商 / 廣告商品牌 *</label>
                  <input
                    type="text"
                    required
                    value={adForm.advertiser || ''}
                    onChange={(e) => setAdForm({ ...adForm, advertiser: e.target.value })}
                    placeholder="例如：Intergalactic Consciousness Lab 或 零離 LINGLI"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#cbd2ef] block mb-1">宣傳標語 / 口號 (Tagline)</label>
                  <input
                    type="text"
                    value={adForm.tagline || ''}
                    onChange={(e) => setAdForm({ ...adForm, tagline: e.target.value })}
                    placeholder="例如：「做夢才是真的？夢境是來自真實心靈的投射，它比你自認為的內心還要真實。」"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">播放秒數 (秒)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={adForm.durationSeconds || 10}
                      onChange={(e) => setAdForm({ ...adForm, durationSeconds: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[#cbd2ef] block mb-1">完播獎勵星星 (顆)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={adForm.rewardStars || 1}
                      onChange={(e) => setAdForm({ ...adForm, rewardStars: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#cbd2ef] block mb-1">廣告類別</label>
                    <select
                      value={adForm.category || 'alien_philosophy'}
                      onChange={(e) => setAdForm({ ...adForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="alien_philosophy">👽 星際哲學 / 心靈對話</option>
                      <option value="brand_sponsor">🌿 選物商品 / 品牌贊助</option>
                      <option value="healing_sound">🌙 療癒聲景 / 深眠導引</option>
                      <option value="meditation_scene">💎 冥想水晶 / 能量場景</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#cbd2ef] block mb-1">播放狀態</label>
                    <select
                      value={adForm.isActive ? 'true' : 'false'}
                      onChange={(e) => setAdForm({ ...adForm, isActive: e.target.value === 'true' })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="true">✓ 啟用中 (客人隨機觀看)</option>
                      <option value="false">⏸️ 下架停播 (不提供觀看)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">背景封面海報 URL</label>
                  <input
                    type="url"
                    value={adForm.posterUrl || ''}
                    onChange={(e) => setAdForm({ ...adForm, posterUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[#cbd2ef] block mb-1">影片連結 URL (可選 mp4 / 嵌入)</label>
                  <input
                    type="text"
                    value={adForm.videoUrl || ''}
                    onChange={(e) => setAdForm({ ...adForm, videoUrl: e.target.value })}
                    placeholder="可選填影片網址或留空使用沉浸式聲畫"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Dynamic Subtitles / Dialogue Lines */}
              <div className="pt-2 border-t border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>廣告播放對白／語音字幕流（按秒數分段自動滾動）：</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setDialogueRows([...dialogueRows, { speaker: '外星導師', text: '' }])}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>新增一段對白</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dialogueRows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={row.speaker}
                        onChange={(e) => {
                          const updated = [...dialogueRows];
                          updated[idx].speaker = e.target.value;
                          setDialogueRows(updated);
                        }}
                        placeholder="說話者 (如 外星導師)"
                        className="w-28 px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-amber-300 font-bold text-xs"
                      />
                      <input
                        type="text"
                        value={row.text}
                        onChange={(e) => {
                          const updated = [...dialogueRows];
                          updated[idx].text = e.target.value;
                          setDialogueRows(updated);
                        }}
                        placeholder="字幕內容 (如：我們認為夢境是唯一的真實，夢境來自真實心靈的投射...)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                      />
                      {dialogueRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDialogueRows(dialogueRows.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                          title="移除此句"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAd(false);
                    setEditingAd(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs text-[#aab3d2] hover:text-white bg-white/5 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {editingAd ? '更新廣告' : '確認新增入庫'}
                </button>
              </div>
            </form>
          )}

          {/* Ad Videos List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {adVideos.map((ad) => (
              <div
                key={ad.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  ad.isActive
                    ? 'bg-white/[0.03] border-white/10 hover:border-amber-400/40'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ad.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-amber-300">
                        {ad.advertiser}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                        ⏱️ {ad.durationSeconds}s
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        ⭐ +{ad.rewardStars}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {ad.title}
                  </h3>

                  <p className="text-xs text-[#aab3d2] mt-1.5 leading-relaxed line-clamp-2">
                    {ad.tagline}
                  </p>

                  {/* Subtitle dialogue count preview */}
                  {ad.dialogueDialogue && ad.dialogueDialogue.length > 0 && (
                    <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-white/10 text-[11px] text-[#cbd2ef] flex items-center gap-2">
                      <span className="text-amber-400 font-semibold shrink-0">
                        💬 {ad.dialogueDialogue[0].speaker}：
                      </span>
                      <span className="truncate">
                        {ad.dialogueDialogue[0].text}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAdActive(ad.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all ${
                        ad.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-white/5 text-[#8d97b5] border-white/10 hover:text-white'
                      }`}
                    >
                      {ad.isActive ? '✓ 播放中' : '⏸️ 已停播'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAd(ad);
                        setIsAddingAd(false);
                        setAdForm(ad);
                        setDialogueRows(
                          ad.dialogueDialogue && ad.dialogueDialogue.length > 0
                            ? ad.dialogueDialogue
                            : [{ speaker: '外星導師', text: '' }]
                        );
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs cursor-pointer"
                      title="編輯廣告內容"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAdVideo(ad.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8d97b5] hover:text-[#ff8b9d] text-xs cursor-pointer"
                      title="從資料庫刪除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: AI ENGINE SETTINGS */}
      {activeTab === 'engine' && (
        <section className="card p-6" id="admin-dream-engine-card">
          <span className="badge">
            <Sliders className="w-3 h-3 text-[#ffd27a]" />
            DREAM ENGINE PARAMETERS
          </span>
          <h2 style={{ fontSize: 24, marginTop: 12 }} className="text-white font-bold">
            AI 輸出個性與語氣調整
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd2ef] leading-relaxed">
            管理員與高級管理員均可微調 AI 輸出的心理學分析深度與溫潤度，確保解夢既符合學術規範，又富共情溫度。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="field">
              <label>
                <span>親和／個性風格</span>
                <span className="font-mono text-[#aa9cff]">{settings.personality}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.personality}
                onChange={(e) => setSettings({ ...settings, personality: +e.target.value })}
              />
              <div className="tiny muted flex justify-between mt-1">
                <span>0% 客觀學術剖析</span>
                <span>100% 溫暖且富共情畫面感</span>
              </div>
            </div>

            <div className="field">
              <label>
                <span>決斷性 (Decisiveness)</span>
                <span className="font-mono text-[#71d9ff]">{settings.decisiveness}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.decisiveness}
                onChange={(e) => setSettings({ ...settings, decisiveness: +e.target.value })}
              />
              <div className="tiny muted flex justify-between mt-1">
                <span>0% 多元假設並置</span>
                <span>100% 提煉核心指引</span>
              </div>
            </div>

            <div className="field">
              <label>
                <span>解夢報告深度 (Depth)</span>
                <span className="font-mono text-[#78e1b5]">{settings.depth}%</span>
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.depth}
                onChange={(e) => setSettings({ ...settings, depth: +e.target.value })}
              />
            </div>

            <div className="field">
              <label>
                <span>Temperature (發散度)</span>
                <span className="font-mono text-[#ffd27a]">{settings.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: +e.target.value })}
              />
              <div className="tiny muted flex justify-between mt-1">
                <span>0 精確收斂</span>
                <span>1 想像與隱喻發散</span>
              </div>
            </div>
          </div>

          <div className="field mt-4">
            <label>
              <span>底層推論模型</span>
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (高效快速 · 推薦)</option>
              <option value="deepseek/deepseek-v4.1-flash">deepseek/deepseek-v4.1-flash (哲學與隱喻適配)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (超深度榮格原型剖析)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn w-full mt-4 text-xs py-2.5"
            disabled={busy === 'settings'}
            onClick={saveSettings}
            id="admin-save-settings-btn"
          >
            {busy === 'settings' ? '儲存中…' : '儲存 AI 引擎配置'}
          </button>
        </section>
      )}

      {/* TAB 4: USER & TIER MANAGEMENT (高級管理員可更改等級；管理員僅檢視) */}
      {activeTab === 'users' && (
        <section className="card p-6" id="admin-access-control-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="badge">
                <Users className="w-3 h-3 text-[#aa9cff]" />
                MEMBER ROLES & ACCESS CONTROL
              </span>
              <h2 style={{ fontSize: 24, marginTop: 8 }} className="text-white font-bold">
                會員等級與權限管理
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd2ef] mt-0.5">
                {isSuperAdmin ? (
                  <span className="text-[#78e1b5] font-semibold">
                    ✓ 高級管理員專屬權限：您可在此直接更改任何會員的等級（一般會員 ↔ 付費會員 ↔ 管理員 ↔ 高級管理員）及增減星星。
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    🔒 內容管理員權限：您可檢視會員列表與點數，但更改會員等級僅限高級管理員操作。
                  </span>
                )}
              </p>
            </div>

            <div className="text-xs text-[#8d97b5] font-mono">
              總會員數：{users.length} 名
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-left" id="admin-users-table">
              <thead>
                <tr className="border-b border-white/10 text-xs text-[#8d97b5]">
                  <th className="py-2.5 px-3">會員資訊</th>
                  <th className="py-2.5 px-3">當前等級</th>
                  <th className="py-2.5 px-3">星星餘額</th>
                  <th className="py-2.5 px-3">
                    {isSuperAdmin ? '更改會員等級 (高級管理員專用)' : '等級權限狀態'}
                  </th>
                  <th className="py-2.5 px-3 text-right">身份切換模擬</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const roleNorm = normalizeRole(u.role);
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-xs">
                          {u.display_name || u.email.split('@')[0]}
                        </div>
                        <div className="text-[11px] text-[#8d97b5] font-mono">{u.email}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                            roleNorm === 'super_admin'
                              ? 'bg-[#aa9cff]/20 border-[#aa9cff]/40 text-[#c3b9ff]'
                              : roleNorm === 'admin'
                              ? 'bg-[#71d9ff]/20 border-[#71d9ff]/40 text-[#71d9ff]'
                              : roleNorm === 'paid'
                              ? 'bg-[#78e1b5]/20 border-[#78e1b5]/40 text-[#78e1b5]'
                              : 'bg-amber-400/15 border-amber-400/30 text-amber-300'
                          }`}
                        >
                          {roleNorm === 'super_admin' && <ShieldCheck className="w-3 h-3" />}
                          {roleNorm === 'admin' && <Settings className="w-3 h-3" />}
                          {roleNorm === 'paid' && <Crown className="w-3 h-3" />}
                          {roleNorm === 'free' && <Star className="w-3 h-3" />}
                          <span>{getRoleDisplayName(roleNorm)}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-amber-300">
                            ⭐ {u.stars ?? (roleNorm === 'free' ? 2 : 999)}
                          </span>
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleAdjustStars(u, 5)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[#cbd2ef] cursor-pointer"
                              title="為該會員增加 5 顆星星"
                            >
                              +5星
                            </button>
                          )}
                        </div>
                      </td>

                      {/* ROLE MODIFICATION COLUMN */}
                      <td className="py-3 px-3">
                        {isSuperAdmin ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={roleNorm}
                              disabled={busy === u.id}
                              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                              className="px-2.5 py-1 rounded-lg bg-[#0e1224] border border-white/25 text-white text-xs font-medium focus:outline-none focus:border-[#aa9cff] cursor-pointer"
                              id={`select-role-${u.id}`}
                            >
                              <option value="free">🌱 一般會員 (睇片儲星)</option>
                              <option value="paid">👑 付費會員 (直接解鎖)</option>
                              <option value="admin">⚙️ 管理員 (內容管理)</option>
                              <option value="super_admin">🛡️ 高級管理員 (更改等級)</option>
                            </select>
                            {busy === u.id && <span className="text-[10px] text-[#78e1b5]">更新中…</span>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-[#8d97b5]">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>僅高級管理員可更改</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {onSwitchUser && (
                          <button
                            type="button"
                            onClick={() => onSwitchUser(u)}
                            className={`text-xs px-3 py-1 rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                              u.id === currentUserId
                                ? 'border-[#aa9cff] text-[#aa9cff] bg-[#aa9cff]/10'
                                : 'border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>{u.id === currentUserId ? '當前登入者' : '以此登入'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
