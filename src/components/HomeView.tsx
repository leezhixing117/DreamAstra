import React, { useState } from 'react';
import { Sparkles, BookOpen, Search, Brain, Shield, User, Sliders, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onStartWithDream: (dreamText: string) => void;
  onGoToApp: () => void;
  onGoToAdmin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartWithDream,
  onGoToApp,
  onGoToAdmin,
}) => {
  const [draftDream, setDraftDream] = useState('');

  const samplePrompts = [
    '我夢到自己返回以前讀書的學校，但所有人都不認得我。我一直找課室，最後發現自己沒有穿鞋……',
    '海水一路無聲地升高，水面漫過街道與窗戶，我爬到最高處的屋頂，看著一片汪洋，雖然害怕，但周圍好安靜。',
    '有人在身後一直追著我，我心跳好快，一直狂奔，最後推開了一間荒廢木造舊屋的門躲在裡面……',
  ];

  const handleStart = () => {
    onStartWithDream(draftDream);
  };

  return (
    <main id="home-view-main">
      <section className="hero shell" id="hero-section">
        <div className="eyebrow" id="hero-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-[#aa9cff]" />
          <span>☾ Book Brain × DeepSeek / Gemini × Dream Memory</span>
        </div>

        <h1 id="hero-title">
          <span className="grad">昨晚發咗一個奇怪嘅夢？</span>
        </h1>

        <p className="lead" id="hero-lead">
          寫低你記得嘅夢。DreamWisdom 唔係憑空估，而係先從管理員建立嘅 Book Brain 找出相關理論，
          再由 AI 結合你過往夢境，整理可能值得留意嘅訊息。
        </p>

        <div className="dreambox" id="hero-dreambox">
          <textarea
            value={draftDream}
            onChange={(e) => setDraftDream(e.target.value)}
            placeholder="例如：我夢到自己返回以前讀書的學校，但所有人都不認得我。我一直找課室，最後發現自己沒有穿鞋……"
            id="hero-dream-textarea"
          />

          <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-white/5 bg-white/[0.02]">
            <span className="text-xs text-[#8e98b7] flex items-center gap-1 self-center">快速試試：</span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDraftDream(p)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#cbd2ef] hover:bg-white/10 hover:text-white transition-colors"
              >
                {i === 0 ? '🏫 舊學校赤腳' : i === 1 ? '🌊 海水升至屋頂' : '🏃 被追逐進舊屋'}
              </button>
            ))}
          </div>

          <div className="dreamfoot" id="hero-dream-foot">
            <span className="muted tiny">登入後，每份報告都會自動保存到你的夢境歷史，並支援長期串連。</span>
            <button
              type="button"
              className="btn"
              onClick={handleStart}
              id="hero-start-btn"
            >
              <Sparkles className="w-4 h-4 text-[#08101d]" />
              ✨ 開始深度解夢
            </button>
          </div>
        </div>

        <div className="trust" id="hero-trust-badges">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#78e1b5]" /> 私密保存
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#71d9ff]" /> Book-grounded
          </span>
          <span className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-[#aa9cff]" /> 可串連過往夢境
          </span>
        </div>
      </section>

      <section className="section shell" id="how">
        <div className="eyebrow">
          <Brain className="w-3.5 h-3.5 text-[#71d9ff]" />
          <span>核心流程</span>
        </div>
        <h2 style={{ marginTop: 16 }}>唔係一次性「問 AI」，而係建立你自己嘅 Dream Memory。</h2>
        <p className="sectionLead">
          每次解夢都保存；當累積更多夢境，你可以一鍵要求 DreamWisdom 將多次夢境串連，分析重複人物、場景、情緒與主題。
        </p>

        <div className="grid3" id="how-grid-cards">
          <div className="card" id="card-book-brain">
            <div className="icon">📚</div>
            <h3>Book Brain</h3>
            <p>
              只有管理員可上傳書籍。系統抽取文字或 OCR 掃描頁，再切成可搜尋知識段落，收錄榮格、佛洛伊德及現代睡眠認知科學典籍。
            </p>
          </div>

          <div className="card" id="card-grounded-search">
            <div className="icon">🔎</div>
            <h3>先搵書，再解夢</h3>
            <p>
              每次解夢先檢索最相關書本內容，再將來源連同夢境送交 AI 模型，標註理論學派出處，減少憑空臆測。
            </p>
          </div>

          <div className="card" id="card-dream-patterns">
            <div className="icon">🌙</div>
            <h3>Long-term Dream Pattern</h3>
            <p>
              保存所有夢境與報告，再串連分析近期心境演變、重複象徵與可能嘅心理主題，作為自我成長的鏡子。
            </p>
          </div>
        </div>
      </section>

      <section className="section shell" id="perspectives-section">
        <div className="grid2">
          <div className="card flex flex-col justify-between" id="user-perspective-card">
            <div>
              <div className="eyebrow mb-2">
                <User className="w-3.5 h-3.5 text-[#78e1b5]" />
                <span>USER 用戶視角</span>
              </div>
              <h2 style={{ fontSize: 30, marginTop: 14 }}>用戶只需要做一件事：講個夢。</h2>
              <p className="mt-2 text-[#aab3d2] leading-relaxed">
                介面保持簡約純粹；登入、過往夢境、報告、串連分析全部放入「我的夢境」，唔迫用戶理解後台複雜的 RAG 向量與分塊技術。
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={onGoToApp}
                className="btn dark flex items-center gap-2"
                id="btn-goto-app-from-home"
              >
                <span>進入我的夢境工作台</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="card flex flex-col justify-between" id="admin-perspective-card">
            <div>
              <div className="eyebrow mb-2">
                <Sliders className="w-3.5 h-3.5 text-[#aa9cff]" />
                <span>ADMIN 管理員視角</span>
              </div>
              <h2 style={{ fontSize: 30, marginTop: 14 }}>管理員控制「腦」同「語氣」。</h2>
              <p className="mt-2 text-[#aab3d2] leading-relaxed">
                Book Brain 知識庫、AI 輸出個性滑桿（親和度 vs 分析度、決斷性、深度、溫度）、用戶角色授權、全站解夢記錄集中一個後台管理。
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={onGoToAdmin}
                className="btn dark flex items-center gap-2"
                id="btn-goto-admin-from-home"
              >
                <span>打開管理員控制室</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" id="site-footer">
        <div className="shell flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-semibold text-white">DreamWisdom</span> · 夢境智慧
            <div className="text-xs text-[#6e7796] mt-1">
              AI dream reflection is for self-exploration and is not a medical or psychological diagnosis.
            </div>
          </div>
          <div className="text-xs text-[#8e98b7]">
            Carl G. Jung · Sigmund Freud · Modern Sleep Cognitive Science
          </div>
        </div>
      </footer>
    </main>
  );
};
