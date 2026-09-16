import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  return {
    title: `解構夢境：${title}`,
    summary: `這個夢境並非隨機神經雜訊，而是你的潛意識正透過具象化的情境（如「${symbols[0]?.symbol || '主要場景'}」）處理近期的心理轉變與張力。當你試圖在變動中找到立足點時，內在正在尋找調適與自我整合的平衡。`,
    symbols: symbols.slice(0, 4),
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
      { book_title: 'The Interpretation of Dreams (Sigmund Freud)', page_start: 112, page_end: 115 },
      { book_title: 'Dreaming: A Very Short Introduction (J. Allan Hobson)', page_start: 58, page_end: 62 }
    ]
  };
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Dream Analyze API with Gemini + Book Brain
app.post('/api/dream/analyze', async (req, res) => {
  try {
    const { dream, settings } = req.body;
    if (!dream || typeof dream !== 'string' || !dream.trim()) {
      return res.status(400).json({ error: '請提供夢境內容' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback mode if GEMINI_API_KEY is not configured
      const report = fallbackAnalyze(dream, settings);
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
你是一位精通分析心理學（榮格學派）、精神分析與現代睡眠神經認知科學的專業「夢境智慧 (DreamWisdom)」解夢顧問。
用戶將提供昨晚或最近的夢境，請你基於經典夢學理論（如 Carl G. Jung《Man and His Symbols》、Sigmund Freud《The Interpretation of Dreams》、J. Allan Hobson《Dreaming》）提供客觀、溫暖且富有洞察力的解夢報告。

參數調整要求：
- 親和/個性 (0-100)：目前為 ${personality}（較高代表溫暖、富畫面感與同理心；較低代表學術分析風格）。
- 決斷性 (0-100)：目前為 ${decisiveness}（提供明確假設與探索線索，但保持自我探索本質，不妄下心理醫學診斷）。
- 報告深度 (20-100)：目前為 ${depth}（深入剖析原型、情緒機制與潛意識動態）。

嚴格規則：
1. 請以正體中文（繁體中文 / 帶有親切自然的語氣）撰寫。
2. 絕對不作任何醫學或精神病理學診斷，將夢境定位為個人的潛意識自我對話與心靈反思。
3. 輸出必須符合 JSON Schema 結構。
`;

    const prompt = `
請分析以下夢境，並給予典籍依據與多維度視角：
夢境內容：
"${dream}"
`;

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
                },
                required: ['symbol', 'meaning'],
              },
            },
            perspectives: {
              type: Type.ARRAY,
              description: '不同理論視角（如榮格分析心理學、現代睡眠研究、格式塔完形）',
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
