import { BookBrainItem, DreamEntry, EngineSettings, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    email: 'boyman131418@gmail.com',
    display_name: 'Boyman (Admin)',
    role: 'admin',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user_demo',
    email: 'demo.user@gmail.com',
    display_name: 'Demo Dreamer',
    role: 'user',
    created_at: '2026-09-05T10:30:00Z',
  },
  {
    id: 'user_mystic',
    email: 'mysticblaza@gmail.com',
    display_name: 'Mystic Blaza',
    role: 'user',
    created_at: '2026-09-10T14:15:00Z',
  },
];

export const INITIAL_BOOKS: BookBrainItem[] = [
  {
    id: 'book1',
    title: 'Man and His Symbols (Carl G. Jung)',
    file_name: 'man-and-his-symbols.pdf',
    status: 'ready',
    total_pages: 320,
    processed_pages: 320,
    created_at: '2026-09-01T12:00:00Z',
  },
  {
    id: 'book2',
    title: 'The Interpretation of Dreams (Sigmund Freud)',
    file_name: 'interpretation-of-dreams.pdf',
    status: 'ready',
    total_pages: 544,
    processed_pages: 544,
    created_at: '2026-09-02T16:00:00Z',
  },
  {
    id: 'book3',
    title: 'Dreaming: A Very Short Introduction (J. Allan Hobson)',
    file_name: 'dreaming-short-intro.pdf',
    status: 'processing',
    total_pages: 156,
    processed_pages: 98,
    created_at: '2026-09-12T09:20:00Z',
  },
];

export const INITIAL_SETTINGS: EngineSettings = {
  personality: 65,
  decisiveness: 55,
  depth: 72,
  temperature: 0.35,
  model: 'gemini-3.8-flash',
};

export const INITIAL_DREAMS: DreamEntry[] = [
  {
    id: 'd1',
    title: '回到舊學校，失去歸屬感',
    dream_text: '我夢到自己返回以前讀書的學校，但所有人都不認得我。我一直找課室，最後發現自己沒有穿鞋……',
    created_at: '2026-09-13T23:40:00Z',
    report_json: {
      title: '回到熟悉地方，卻失去歸屬感',
      summary: '這個夢境正在處理「身份轉變」與「我是否還屬於過去的自己」之間的張力。重點不在學校本身，而在一個曾無比熟悉的地方突然變得疏離，提示你可能正在經歷人生階段的蛻變。',
      symbols: [
        { symbol: '🏫 舊學校', meaning: '過去身份、成長階段、曾經熟悉的規則與被評核的壓力' },
        { symbol: '👥 無人認得你', meaning: '內在歸屬感、渴望被理解與被認同的深層需求' },
        { symbol: '👣 沒有鞋 / 赤腳', meaning: '脆弱感、未做好心理防備、缺乏現實支撐的保護感' },
      ],
      perspectives: [
        {
          name: '榮格分析心理學',
          text: '可以將「學校」視為舊人格或舊人生階段的場景；當場景仍然熟悉但身份已經改變，夢可能在呈現個體化過程中「舊我與新我」之間的過渡與割裂。',
        },
        {
          name: '現代睡眠認知研究',
          text: '近期壓力、記憶重整與情緒處理都可能令舊場景重新浮現。REM 睡眠正在試圖整合過去的應對機制與當前的挑戰。',
        },
      ],
      questions: [
        '最近是否有一件事讓你覺得「以前適合我，現在未必」？',
        '你最近最渴望得到身邊誰的認同？',
        '如果夢中你找到了一雙鞋，你直覺會想穿著它走向哪裡？',
      ],
      sources: [
        { book_title: 'Man and His Symbols', page_start: 18, page_end: 20 },
        { book_title: 'Dreaming: A Very Short Introduction', page_start: 52, page_end: 54 },
      ],
    },
  },
  {
    id: 'd2',
    title: '被神秘身影追逐，逃入舊宅',
    dream_text: '有人在身後一直追著我，我心跳好快，一直狂奔，最後推開了一間荒廢木造舊屋的門躲在裡面，門外傳來腳步聲……',
    created_at: '2026-09-10T22:18:00Z',
    report_json: {
      title: '逃避壓迫與本能回歸舊有避風港',
      summary: '逃跑與追逐是潛意識最具張力的警報信號。追逐者往往象徵白天被壓抑的情緒、拖延的決定，而舊屋則象徵退行（Regression）尋求童年時期的安全屏障。',
      symbols: [
        { symbol: '🏃 被迫狂奔', meaning: '生活中有急迫需要正視的責任或即將逼近的挑戰' },
        { symbol: '👤 神秘追逐者', meaning: '榮格心理學中的「陰影 (Shadow)」，即不願承認的自我面向' },
        { symbol: '🏚️ 荒廢舊屋', meaning: '退回心靈深處最原始的防衛機制，試圖隔絕外界刺激' },
      ],
      perspectives: [
        {
          name: '榮格陰影理論',
          text: '夢中追逐你的人或怪物，本質上是你未整合的生命力與被排斥的情緒。只有停下腳步轉身面對，追逐才會終止。',
        },
        {
          name: '神經生物學威脅模擬',
          text: 'Revonsuo 的威脅模擬理論（Threat Simulation Theory）認為，追逐夢是古老進化機制的演練，幫助個體在大腦安全環境中強化應對危機的反應敏捷度。',
        },
      ],
      questions: [
        '現實中有沒有什麼事情或溝通，是你這陣子一直在迴避的？',
        '如果在夢中你轉身直視追你的人，你覺得他會說什麼？',
        '舊屋裡的氣味與光線讓你聯想到哪一段回憶？',
      ],
      sources: [
        { book_title: 'The Interpretation of Dreams', page_start: 142, page_end: 145 },
        { book_title: 'Man and His Symbols', page_start: 78, page_end: 82 },
      ],
    },
  },
  {
    id: 'd3',
    title: '潮水不斷升高，孤身站在屋頂',
    dream_text: '海水一路無聲地升高，水面漫過街道與窗戶，我爬到最高處的屋頂，看著一片汪洋，雖然害怕，但周圍好安靜。',
    created_at: '2026-09-04T21:05:00Z',
    report_json: {
      title: '情感受壓上升，理性保持高處自保',
      summary: '水是無意識情緒能量的經典象徵。上升的水位代表情感或心理壓力的浸潤；而站在屋頂代表自我（Ego）試圖以理智俯瞰並控制局面，維持心靈的安全防線。',
      symbols: [
        { symbol: '🌊 漫過街道的潮水', meaning: '洶湧的潛意識情感、即將超出負荷的生活壓力或深層悲傷' },
        { symbol: '🏠 攀上屋頂', meaning: '以超然、理性的視角自保，不讓自己溺於情緒洪流中' },
        { symbol: '🤫 異常安靜的氣氛', meaning: '情感解離（Emotional Dissociation）或暴風雨前的心理沉澱' },
      ],
      perspectives: [
        {
          name: '榮格水象原型',
          text: '水是孕育也是吞噬。當水面上升，潛意識正要求意識界承認那些被忽視的情感需求，不再只是單純理性壓制。',
        },
        {
          name: '情緒調節理論',
          text: '夢中的高處提供了安全距離，大腦正透過這種視覺化的「遠離」來幫助你消化現實中難以立刻解決的重擔。',
        },
      ],
      questions: [
        '最近是否有某種情緒（如焦慮、疲累或委屈）正悄悄「淹過」你的日常？',
        '你在生活中有習慣用「理智抽離」來避免感受痛苦嗎？',
        '如果水面停止上升並開始退去，你最希望看見什麼浮現？',
      ],
      sources: [
        { book_title: 'Man and His Symbols', page_start: 110, page_end: 114 },
        { book_title: 'Dreaming: A Very Short Introduction', page_start: 88, page_end: 91 },
      ],
    },
  },
];
