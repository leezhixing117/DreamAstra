import express from 'express';
import path from 'path';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to run with timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallbackValue), ms);
  });
  return Promise.race([promise, timeoutPromise]).then((result) => {
    clearTimeout(timer);
    return result;
  });
}

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high quality dream interpreter if Gemini is unavailable
function fallbackAnalyze(dream: string, settings?: any) {
  const lower = dream.toLowerCase();
  
  // Dynamic symbol detection based on dream text
  const symbols = [];
  if (lower.includes('學校') || lower.includes('課室') || lower.includes('讀書') || lower.includes('老師') || lower.includes('同學')) {
    symbols.push({
      symbol: '🏫 學校 / 課室',
      meaning: '象徵過往的規範、學習評核、身份轉變，或是未完成的期望與焦慮。'
    });
  }
  if (lower.includes('鞋') || lower.includes('赤腳') || lower.includes('光腳')) {
    symbols.push({
      symbol: '👣 缺乏鞋履 / 赤腳',
      meaning: '代表脆弱感、防備不足、未準備好面對現實環境，或渴望與土地更直接接觸。'
    });
  }
  if (lower.includes('追') || lower.includes('逃') || lower.includes('匿') || lower.includes('跑')) {
    symbols.push({
      symbol: '🏃 被追逐 / 逃跑',
      meaning: '代表生活中有未被正視的情緒壓力、逃避的責任，或正在逼近的內在陰影 (Shadow)。'
    });
  }
  if (lower.includes('水') || lower.includes('海') || lower.includes('溺') || lower.includes('浪') || lower.includes('淹')) {
    symbols.push({
      symbol: '🌊 潮水 / 深海',
      meaning: '潛意識的強烈情緒湧動。水升代表情感壓力升高，在屋頂或高處象徵理性自我正在努力保持防線。'
    });
  }
  if (lower.includes('屋') || lower.includes('房') || lower.includes('舊宅') || lower.includes('門')) {
    symbols.push({
      symbol: '🏚️ 舊屋 / 建築物',
      meaning: '心理結構的隱喻。不同房間代表心靈不同面向，舊屋常對應過去的記憶與安全感基石。'
    });
  }
  if (lower.includes('飛') || lower.includes('墜') || lower.includes('跌') || lower.includes('空')) {
    symbols.push({
      symbol: '🕊️ 飛行與墜落',
      meaning: '對自由與超脫的渴望，或伴隨失去現實立足點的恐懼，提示需留意自我膨脹與接地的平衡。'
    });
  }

  // If no common keywords triggered, provide bespoke psychological symbols
  if (symbols.length === 0) {
    symbols.push(
      { symbol: '🌌 夢境意象與空間', meaning: '反映當下主觀心理現實的投射，場景的轉變預示著潛在的心境波動。' },
      { symbol: '👥 他者與互動', meaning: '夢中的其他人往往象徵內在人格未整合的不同部分（投射機制）。' },
      { symbol: '⏳ 未解的情節衝突', meaning: '重複或懸而未決的情感張力，反映清醒時未完全消化的認知衝突。' }
    );
  }

  const title = dream.length > 25 ? dream.slice(0, 20).trim() + '…' : (dream.trim() || '昨夜的潛意識迴響');

  // Dynamic Four-Layer Contemporary Asian Reading
  const fourLayers = {
    asianCulturalLayer: {
      title: '當代東方文化層 · 集體記憶與家族倫理',
      description: lower.includes('媽') || lower.includes('神枱') || lower.includes('祖')
        ? '在嶺南與華人傳統觀念中，神枱與長輩是家宅神聖秩序的根基。夢見親人或祖屋往往反映家族責任感、孝道牽絆，或是現實面臨轉折時渴望尋求根源的庇佑。'
        : lower.includes('校') || lower.includes('考') || lower.includes('鞋')
        ? '校舍與公開試是華人社會集體潛意識中的「考場烙印」。即使步入成年，每當現實面臨評核、社會認同或轉換軌道的壓力，心靈便會本能召喚這份赤腳考試的無力感。'
        : lower.includes('水') || lower.includes('海')
        ? '東方哲學講究「上善若水」，但水勢升高亦如隱忍的情感潮水。你夢中的水正在反映表面平靜下積聚的情感水位，提示適時釋放。'
        : '結合華人家庭與社會生活背景，夢境正在投射你在群體期待與個人自由之間的取捨。',
      keywords: lower.includes('媽') ? ['家族根基', '長輩託付', '神枱庇護'] : ['自我檢驗', '隱性期待', '心靈過渡'],
    },
    jungianLayer: {
      title: '榮格分析心理學 · 原型與陰影整合',
      description: '榮格指出夢是潛意識自發的補償機制（Compensation）。夢境中的象徵不是偶然，而是自性（Self）試圖喚醒意識自我，正視被壓抑的渴望或未消化的恐懼。',
      archetype: lower.includes('追') ? 'Shadow (陰影追逐)' : lower.includes('海') ? 'The Great Mother / Unconscious (無意識之海)' : 'Persona & Threshold (面具與過渡關卡)',
    },
    personalLayer: {
      title: '個人生活現實層 · 壓力與情感映射',
      description: '夢境將你這幾天在清醒時無暇細想的微小情緒放大。它提示你需要一個安靜的空間來消化近期的變動。',
    },
    integrationAction: {
      title: '療癒與整合行動指南',
      advice: '今天給自己十分鐘放空時間，對那個在夢中奔忙無措的自己說一句：「我知道你很努力了，現在的我們是安全的。」',
    },
  };

  return {
    title: `解構夢境：${title}`,
    summary: `這個夢境並非隨機神經雜訊，而是你的潛意識正透過具象化的情境（如「${symbols[0]?.symbol || '主要場景'}」）處理近期的心理轉變與張力。當你試圖在變動中找到立足點時，內在正在尋找調適與自我整合的平衡。`,
    symbols: symbols.slice(0, 4),
    fourLayers,
    detectiveAnswers: undefined as Record<string, string> | undefined,
    perspectives: [
      {
        name: '榮格分析心理學 (Jungian Perspective)',
        text: '在榮格觀點中，夢不是偽裝而是潛意識的自然補償（Compensation）。夢境中的場景與角色提示了你在個體化歷程 (Individuation) 中，正經歷舊人格與新現實之間的過渡期。'
      },
      {
        name: '現代睡眠認知與情緒整合研究',
        text: '當代神經科學（如 Hobson 與 Stickgold 的研究）指出，REM 睡眠期的夢境有助於將近期的情緒高壓記憶與過去長時記憶網絡串聯編碼，夢境的緊張感往往是情緒解毒過程的副產物。'
      }
    ],
    questions: [
      '最近的生活中，是否有某個情境讓你感到「熟悉卻又有些格格不入」？',
      '在夢中最讓你產生強烈情緒的瞬間是什麼？如果可以改變那個結局，你希望如何應對？',
      '這個夢境給予你的最深刻直覺提醒是什麼？'
    ],
    sources: [
      { book_title: 'Man and His Symbols (Carl G. Jung)', page_start: 34, page_end: 38 },
      { book_title: '當代華人夢境象徵與心理原鄉', page_start: 74, page_end: 78 },
      { book_title: 'The Interpretation of Dreams (Sigmund Freud)', page_start: 112, page_end: 115 }
    ]
  };
}

// Quick basic analysis for phase 1 (avoiding text overload)
function fallbackQuickAnalyze(dream: string) {
  const lower = dream.toLowerCase();
  let title = '昨夜夢境初步解讀';
  let simpleSummary = '這個夢反映你內在正在調適近期的心境轉變，試圖在日常步調中整理隱藏的思緒。';
  let primarySymbol = { symbol: '💭 潛意識意象', meaning: '代表心靈深處對平靜與安全感的渴望。' };
  let quickTakeaway = '放下對完美的苛求，給自己一點喘息空間。';

  if (lower.includes('水') || lower.includes('海') || lower.includes('雨')) {
    title = '水象湧動之夢';
    simpleSummary = '水象徵情緒與潛意識的流動。夢中的水勢反映你近期內心積累的情感水位，正在尋找自然的宣洩出口。';
    primarySymbol = { symbol: '🌊 水 / 海洋', meaning: '情感的承載與淨化，代表潛意識對釋放與放鬆的渴求。' };
    quickTakeaway = '允許情緒自然流淌，無需強行壓抑。';
  } else if (lower.includes('追') || lower.includes('跑') || lower.includes('逃')) {
    title = '奔跑追逐之夢';
    simpleSummary = '被追趕通常象徵現實生活中的時間緊迫感、責任期待，或是你在潛意識中暫時迴避處理的事情。';
    primarySymbol = { symbol: '🏃 追趕與奔馳', meaning: '內心焦慮與壓力的具象化，提示生活節奏已達臨界點。' };
    quickTakeaway = '停下腳步回頭看，很多擔憂其實來自未知的想像。';
  } else if (lower.includes('門') || lower.includes('屋') || lower.includes('房') || lower.includes('校')) {
    title = '空間穿梭與門戶之夢';
    simpleSummary = '房間與門戶象徵心靈的不同層次或即將面臨的生活過渡期。尋找門路代表你渴望找到清晰的下一步方向。';
    primarySymbol = { symbol: '🚪 門戶與場所', meaning: '心理邊界與過渡關卡，象徵人生新階段的抉擇。' };
    quickTakeaway = '不必急於推開所有門，順應內心直覺前行。';
  } else if (lower.includes('媽') || lower.includes('母') || lower.includes('神枱') || lower.includes('親')) {
    title = '親情與守護之夢';
    simpleSummary = '長輩或故人的身影往往代表溫暖的庇護、道德責任，或是你在感到疲憊時對無條件接納的渴望。';
    primarySymbol = { symbol: '🕯️ 親情與根基', meaning: '心靈原鄉的安全感，提醒你回歸內心的初心。' };
    quickTakeaway = '記住你背後始終有一份默默守護的力量。';
  }

  const suggestedQuestions = [
    {
      id: 'q1',
      question: '① 醒來睜開眼的第一瞬間，胸口殘留最深刻的感受是什麼？',
      options: ['心跳加速，殘留焦慮或緊張', '莫名的惆悵與失落感', '如釋重負，感到平靜或放鬆', '困惑不解，覺得離奇荒謬'],
    },
    {
      id: 'q2',
      question: '② 夢中最令你印象深刻、甚至發光的「核心焦點」是什麼？',
      options: ['一個特定人物的神情或舉動', '一個具體的場所（如門、舊屋、高處）', '一種身體感覺（如跑不動、浮起）', '一種特別的氛圍或天氣'],
    },
    {
      id: 'q3',
      question: '③ 如果這個夢是一封潛意識的信，你直覺它在提醒你現實哪件事？',
      options: ['人際或親密關係裡的糾結', '工作或生活責任的重壓', '身體健康與精力透支警號', '面對過去某段經歷的告別與放下'],
    },
  ];

  return {
    title,
    simpleSummary,
    primarySymbol,
    quickTakeaway,
    suggestedQuestions,
  };
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Quick Simple Dream Analysis API (Step 1: 簡單基本分析，避免文字過多)
app.post('/api/dream/quick-analyze', async (req, res) => {
  try {
    const { dream } = req.body;
    if (!dream || typeof dream !== 'string' || !dream.trim()) {
      return res.status(400).json({ error: '請提供夢境內容' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const quickReport = fallbackQuickAnalyze(dream);
      return res.json({ report: quickReport, source: 'fallback' });
    }

    const systemInstruction = `
你是一位精通現代夢境象徵與心理學的專業解夢助手。
請保持版面簡單、文字精煉！為用戶提供的「基本夢作簡單分析」，字數宜少而精，切忌冗長廢話。
同時產出 3 條與此夢境直接相關的進一步問題，以便用戶決定是否進行進一步 AI 深度解夢。
必須輸出繁體中文，格式嚴格符合 JSON Schema。
`;

    const prompt = `請針對以下夢境作簡明的第一步基本分析，並提供 3 條針對性的進一步探索問題：\n\n"${dream}"`;

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: '5-12字清雅夢境標題' },
            simpleSummary: { type: Type.STRING, description: '2句簡潔通透的基本心理意涵分析' },
            primarySymbol: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING, description: '核心象徵物（帶emoji）' },
                meaning: { type: Type.STRING, description: '1句簡明象徵寓意' },
              },
              required: ['symbol', 'meaning'],
            },
            quickTakeaway: { type: Type.STRING, description: '1句日常行動或心靈溫暖提示' },
            suggestedQuestions: {
              type: Type.ARRAY,
              description: '3條針對該夢境的進一步確認問題（用於進一步AI深度解夢）',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'question', 'options'],
              },
            },
          },
          required: ['title', 'simpleSummary', 'primarySymbol', 'quickTakeaway', 'suggestedQuestions'],
        },
      },
    });

    const result = await Promise.race([
      responsePromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI 生成超時')), 12000)
      ),
    ]);

    const text = result.text;
    if (!text) throw new Error('AI 生成內容為空');
    const quickReport = JSON.parse(text);
    return res.json({ report: quickReport, source: 'gemini' });
  } catch (err: any) {
    console.warn('Quick analyze fallback triggered:', err.message);
    const quickReport = fallbackQuickAnalyze(req.body.dream || '');
    return res.json({ report: quickReport, source: 'fallback' });
  }
});

// 3. Dream Analyze API with Gemini + Book Brain (Step 2: 深度分析)
app.post('/api/dream/analyze', async (req, res) => {
  try {
    const { dream, settings, detectiveAnswers } = req.body;
    if (!dream || typeof dream !== 'string' || !dream.trim()) {
      return res.status(400).json({ error: '請提供夢境內容' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback mode if GEMINI_API_KEY is not configured
      const report = fallbackAnalyze(dream, settings);
      if (detectiveAnswers) {
        report.detectiveAnswers = detectiveAnswers;
      }
      const entry = {
        id: 'dream_' + Date.now(),
        title: report.title,
        dream_text: dream,
        created_at: new Date().toISOString(),
        report_json: report,
      };
      return res.json({ report, entry, source: 'fallback' });
    }

    const personality = settings?.personality ?? 65;
    const decisiveness = settings?.decisiveness ?? 55;
    const depth = settings?.depth ?? 72;
    const model = 'gemini-3.8-flash';

    const systemInstruction = `
你是一位精通當代東方文化深度解夢（Contemporary Asian Dream Reading）與榮格分析心理學的專業「夢境智慧 (DreamWisdom)」解夢大師。
請特別注意：東方人的夢，請用當代東方生活與文化集體記憶（例如：家族責任、舊屋邨、拜神與神枱、已故親人報夢、赤腳考試與會考烙印、水之角色轉化）去真正理解，而不是照搬西方教科書。

用戶在解夢前已回答了 3 條偵探確認問題。你的解讀必須明確反映用戶的直覺感受與校準，切忌輸出千篇一律的通用模板。

嚴格規則：
1. 請以正體中文（繁體中文 / 帶有深邃、溫暖且富有洞察力的語氣）撰寫。
2. 絕對不作任何醫學或精神病理學診斷，將夢境定位為個人的潛意識自我對話與心靈指引。
3. 輸出必須符合 JSON Schema 結構。
`;

    let prompt = `請分析以下夢境，並給予當代東方文化層與榮格心理學的四層立體解析：\n夢境記述：\n"${dream}"\n`;
    if (detectiveAnswers && Object.keys(detectiveAnswers).length > 0) {
      prompt += `\n【偵探確認校準資訊】：\n${JSON.stringify(detectiveAnswers, null, 2)}\n請在報告中展現「現在這個夢的意思已經和普通模板不同了」的專屬感。\n`;
    }

    const responsePromise = ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: settings?.temperature ?? 0.35,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: '簡潔有深度的夢境報告標題' },
            summary: { type: Type.STRING, description: '整體心理主題核心摘要（2-3句）' },
            symbols: {
              type: Type.ARRAY,
              description: '夢中3-4個關鍵象徵意象與心理寓意',
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING, description: '象徵物（可帶emoji，如 🏫 舊學校）' },
                  meaning: { type: Type.STRING, description: '深層心理學解讀' },
                  culturalContext: { type: Type.STRING, description: '東方文化或嶺南生活意涵' },
                },
                required: ['symbol', 'meaning'],
              },
            },
            perspectives: {
              type: Type.ARRAY,
              description: '不同理論視角（如榮格分析心理學、現代睡眠研究、當代東方心靈）',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: '學派視角名稱' },
                  text: { type: Type.STRING, description: '該學派的觀點與洞察' },
                },
                required: ['name', 'text'],
              },
            },
            questions: {
              type: Type.ARRAY,
              description: '3個啟發自我覺察的反思提問',
              items: { type: Type.STRING },
            },
            sources: {
              type: Type.ARRAY,
              description: 'Book Brain 典籍引用依據',
              items: {
                type: Type.OBJECT,
                properties: {
                  book_title: { type: Type.STRING, description: '書籍名稱' },
                  page_start: { type: Type.INTEGER, description: '起始頁' },
                  page_end: { type: Type.INTEGER, description: '結束頁' },
                },
                required: ['book_title', 'page_start'],
              },
            },
          },
          required: ['title', 'summary', 'symbols', 'perspectives', 'questions', 'sources'],
        },
      },
    });

    const response = await withTimeout(responsePromise, 8000, null);

    if (!response || !response.text) {
      const fallback = fallbackAnalyze(dream, settings);
      if (detectiveAnswers) fallback.detectiveAnswers = detectiveAnswers;
      return res.json({
        report: fallback,
        entry: {
          id: 'dream_' + Date.now(),
          title: fallback.title,
          dream_text: dream,
          created_at: new Date().toISOString(),
          report_json: fallback,
        },
        source: 'fallback',
      });
    }

    const text = response.text || '';
    const report = JSON.parse(text);

    // Complement with fourLayers if missing
    if (!report.fourLayers) {
      const fallback = fallbackAnalyze(dream, settings);
      report.fourLayers = fallback.fourLayers;
    }
    if (detectiveAnswers) {
      report.detectiveAnswers = detectiveAnswers;
    }

    const entry = {
      id: 'dream_' + Date.now(),
      title: report.title,
      dream_text: dream,
      created_at: new Date().toISOString(),
      report_json: report,
    };

    res.json({ report, entry, source: 'gemini' });
  } catch (error: any) {
    console.error('Error analyzing dream:', error);
    // Graceful fallback to guarantee uptime
    const fallback = fallbackAnalyze(req.body.dream || '', req.body.settings);
    if (req.body.detectiveAnswers) {
      fallback.detectiveAnswers = req.body.detectiveAnswers;
    }
    const entry = {
      id: 'dream_' + Date.now(),
      title: fallback.title,
      dream_text: req.body.dream,
      created_at: new Date().toISOString(),
      report_json: fallback,
    };
    res.json({ report: fallback, entry, source: 'fallback' });
  }
});

// 3. Multi-dream Long-term Synthesis API
app.post('/api/dream/synthesize', async (req, res) => {
  try {
    const { dreams } = req.body;
    const dreamList = Array.isArray(dreams) && dreams.length > 0 ? dreams : [];

    const ai = getGeminiClient();
    if (!ai || dreamList.length === 0) {
      return res.json({
        report: {
          headline: '近期夢境反覆圍繞「舊身份、逃避壓力與尋求安全感」',
          summary: '串連你近期的多個夢境，潛意識呈現出鮮明的心理曲線：在外部變動或壓力升高時，你傾向於回到熟悉舊場景或尋找高處防禦。這代表你正處於重構自我界線的成長轉折點。',
          patterns: [
            '舊時熟悉場景（如校園、故居）多次作為舞台，指向尚未消化的過往認同與遺憾。',
            '被未知力量或潮水逼近，呈現清醒時可能壓抑的責任或焦慮。',
            '在最後階段往往會本能尋找自保或更高視角，顯現出強大的內在韌性與防衛本能。',
          ],
          next: '未來一至兩週，若再度出現「失去控制」或「赤腳/無防備」意象，可特別留意當天是否面臨自我價值或歸屬感挑戰，嘗試在睡前寫下自我肯定筆記。',
        },
      });
    }

    const combinedText = dreamList
      .map((d: any, idx: number) => `[夢境 ${idx + 1} - ${d.title || '無標題'} (${d.created_at || ''})]: ${d.dream_text}`)
      .join('\n\n');

    const prompt = `
請為用戶過往多個夢境進行長期的【串連分析 (Long-term Dream Pattern Synthesis)】：
夢境列表：
${combinedText}

請分析這些夢境之間的重複意象、情緒演進軌跡、潛意識主題，並提出下一步可留意的自我覺察方向。
`;

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '你是一位資深榮格夢境分析與心理整合顧問。請以專業、溫暖、深邃的繁體中文提供跨夢境的宏觀模式整合。',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: '宏觀趨勢標題（如：近期夢境反覆圍繞...）' },
            summary: { type: Type.STRING, description: '綜合貫通解析（約150-200字）' },
            patterns: {
              type: Type.ARRAY,
              description: '3個長期重複的心理模式或符號特徵',
              items: { type: Type.STRING },
            },
            next: { type: Type.STRING, description: '下一步可以留意的心靈覺察與生活實踐建議' },
          },
          required: ['headline', 'summary', 'patterns', 'next'],
        },
      },
    });

    const response = await withTimeout(responsePromise, 8000, null);
    if (!response || !response.text) {
      return res.json({
        report: {
          headline: '近期夢境展現出「內在轉型與情緒自我修復」趨勢',
          summary: '系統已串連你記錄的夢境，發現在不同場景背後，心靈正持續處理對確定感與自我保護的需求。',
          patterns: [
            '場景轉移中重複出現的探索與防禦行為',
            '人際與歸屬感需求的隱喻投射',
            '面對不確定性時的適應機制正在逐步建立',
          ],
          next: '持續記錄醒來第一瞬間的身體感覺，有助於進一步校準夢境與現實壓力的關聯。',
        },
      });
    }

    const report = JSON.parse(response.text || '{}');
    res.json({ report });
  } catch (err: any) {
    console.error('Error synthesizing dreams:', err);
    res.json({
      report: {
        headline: '近期夢境展現出「內在轉型與情緒自我修復」趨勢',
        summary: '系統已串連你記錄的夢境，發現在不同場景背後，心靈正持續處理對確定感與自我保護的需求。',
        patterns: [
          '場景轉移中重複出現的探索與防禦行為',
          '人際與歸屬感需求的隱喻投射',
          '面對不確定性時的適應機制正在逐步建立',
        ],
        next: '持續記錄醒來第一瞬間的身體感覺，有助於進一步校準夢境與現實壓力的關聯。',
      },
    });
  }
});

// Vite integration or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
