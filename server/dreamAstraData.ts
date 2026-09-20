/**
 * DreamAstra 完整主庫數據 (22 經典著作 + 7 標籤 + 92 權威心理意象)
 * 涵蓋榮格派、精神分析、本土意象、生理夢理論與夢工作實務
 */

export interface DreamBookRecord {
  book_id: number;
  book_name: string;
  title_zh: string;
  title_en: string;
  book_name_en: string;
  author: string;
  school: string;
  global_weight: number;
  core_theory: string;
  process: string[];
  forbidden: string[];
  scene_match: string[];
  description: string;
}

export interface DreamTagRecord {
  tag_id: number;
  tag_name: string;
  tag_desc: string;
}

export interface DreamSymbolRecord {
  symbol_id: number;
  symbol: string;
  alias_list: string[];
  book_interpret_json: Record<string, { text: string; weight: number } | string>;
  source_ref: string;
  notes: string;
  tag_ids: number[];
}

export const DREAM_BOOKS: DreamBookRecord[] = [
  {
    "book_id": 1,
    "book_name": "解夢全書",
    "title_zh": "解夢全書",
    "title_en": "",
    "book_name_en": "",
    "author": "朱建軍",
    "school": "本土意象",
    "global_weight": 0.65,
    "core_theory": "夢是個體內在心理意象的投射，重視意象對話與夢者當下生活處境，不主張吉凶預言。",
    "process": [
      "提取夢中核心意象",
      "開展意象對話",
      "連結近期現實事件",
      "給出心理啟示"
    ],
    "forbidden": [
      "照字解籤",
      "簡單斷定吉兇",
      "脫離夢者現實下定論"
    ],
    "scene_match": [
      "日常情緒夢",
      "重複夢",
      "壓力夢",
      "生活化意象夢"
    ],
    "description": "夢是個體內在心理意象的投射，重視意象對話與夢者當下生活處境，不主張吉凶預言。"
  },
  {
    "book_id": 2,
    "book_name": "榮格解夢書：夢的理論與解析",
    "title_zh": "榮格解夢書：夢的理論與解析",
    "title_en": "",
    "book_name_en": "",
    "author": "榮格",
    "school": "榮格派",
    "global_weight": 0.8,
    "core_theory": "夢來自無意識，具有補償功能；需區分個人無意識內容與集體無意識原型。",
    "process": [
      "區分個人素材與原型素材",
      "辨識夢的補償作用",
      "象徵擴充",
      "關聯自性化歷程"
    ],
    "forbidden": [
      "所有意象硬套原型",
      "忽略個人經驗",
      "把夢當預言"
    ],
    "scene_match": [
      "神話感夢",
      "原型夢",
      "轉折期夢境"
    ],
    "description": "夢來自無意識，具有補償功能；需區分個人無意識內容與集體無意識原型。"
  },
  {
    "book_id": 3,
    "book_name": "人及其象徵",
    "title_zh": "人及其象徵",
    "title_en": "Man and His Symbols",
    "book_name_en": "Man and His Symbols",
    "author": "Carl Gustav Jung",
    "school": "榮格派",
    "global_weight": 0.85,
    "core_theory": "象徵是人類共通心靈語言，原型透過夢、神話、民俗顯現。",
    "process": [
      "辨識原型象徵",
      "參考跨文化象徵",
      "對照夢者主觀感受"
    ],
    "forbidden": [
      "機械查表解夢",
      "跳過夢者主觀感受"
    ],
    "scene_match": [
      "古老神聖意象夢",
      "跨文化象徵夢"
    ],
    "description": "象徵是人類共通心靈語言，原型透過夢、神話、民俗顯現。"
  },
  {
    "book_id": 4,
    "book_name": "夢的解析",
    "title_zh": "夢的解析",
    "title_en": "The Interpretation of Dreams",
    "book_name_en": "The Interpretation of Dreams",
    "author": "Sigmund Freud",
    "school": "精神分析",
    "global_weight": 0.6,
    "core_theory": "夢是被壓抑願望的滿足；需分顯夢與隱夢，透過自由聯想拆解夢的工作機制。",
    "process": [
      "分離顯夢與隱夢",
      "自由聯想",
      "辨識凝縮、置換、象徵、二次修飾",
      "回溯早年經驗"
    ],
    "forbidden": [
      "全部意象歸為性象徵",
      "只挖童年創傷",
      "所有夢都解為願望達成"
    ],
    "scene_match": [
      "壓抑衝突夢",
      "扭曲劇情夢"
    ],
    "description": "夢是被壓抑願望的滿足；需分顯夢與隱夢，透過自由聯想拆解夢的工作機制。"
  },
  {
    "book_id": 5,
    "book_name": "夢：牛津通識讀本",
    "title_zh": "夢：牛津通識讀本",
    "title_en": "Dreaming : A Very Short Introduction",
    "book_name_en": "Dreaming : A Very Short Introduction",
    "author": "J. Allan Hobson",
    "school": "生理夢理論",
    "global_weight": 0.4,
    "core_theory": "REM睡眠期大腦隨機神經激發，心智將雜訊編織成故事；可同時保留心理意義。",
    "process": [
      "評估睡眠背景",
      "區分生理素材與心理建構",
      "拒絕超自然預測"
    ],
    "forbidden": [
      "全盤否定心理意義",
      "用生理理論取代心理解析",
      "神秘主義"
    ],
    "scene_match": [
      "混亂破碎夢",
      "睡眠品質差的夢"
    ],
    "description": "REM睡眠期大腦隨機神經激發，心智將雜訊編織成故事；可同時保留心理意義。"
  },
  {
    "book_id": 6,
    "book_name": "Inner Work",
    "title_zh": "Inner Work",
    "title_en": "Inner Work",
    "book_name_en": "Inner Work",
    "author": "Robert A. Johnson",
    "school": "榮格派",
    "global_weight": 0.75,
    "core_theory": "把榮格原型理論落實到日常夢，強調區分外在人物與內在人格面向投射。",
    "process": [
      "完整紀錄夢與感受",
      "自由聯想人物與意象",
      "區分現實人物與內在投射",
      "轉化為現實行動"
    ],
    "forbidden": [
      "只做理論不解行動",
      "把內在投射當現實他人"
    ],
    "scene_match": [
      "人物眾多的夢",
      "人際關係夢"
    ],
    "description": "把榮格原型理論落實到日常夢，強調區分外在人物與內在人格面向投射。"
  },
  {
    "book_id": 7,
    "book_name": "你是做夢大師",
    "title_zh": "你是做夢大師",
    "title_en": "Living Your Dreams",
    "book_name_en": "Living Your Dreams",
    "author": "Gayle Delaney",
    "school": "夢工作實務",
    "global_weight": 0.7,
    "core_theory": "夢屬於做夢者本人；強調主觀感受與孵夢技術，反對通用意象表硬套。",
    "process": [
      "紀錄夢境細節",
      "詢問意象對自己的意義",
      "孵夢",
      "回應現實疑問"
    ],
    "forbidden": [
      "解夢師替夢者下定義",
      "忽略個人聯想"
    ],
    "scene_match": [
      "重複夢",
      "噩夢",
      "有現實困惑的夢"
    ],
    "description": "夢屬於做夢者本人；強調主觀感受與孵夢技術，反對通用意象表硬套。"
  },
  {
    "book_id": 8,
    "book_name": "夢的工作：榮格取向實務",
    "title_zh": "夢的工作：榮格取向實務",
    "title_en": "",
    "book_name_en": "",
    "author": "James A. Hall",
    "school": "榮格派",
    "global_weight": 0.72,
    "core_theory": "榮格派臨床夢解析，重視原型與個人聯想結合。",
    "process": [
      "建立安全探索氛圍",
      "區分原型與個人經驗",
      "探索夢中人物的內在面向",
      "整合到自我認知"
    ],
    "forbidden": [
      "過度抽象化",
      "忽略夢者情緒"
    ],
    "scene_match": [
      "長期重複夢",
      "原型感強的夢"
    ],
    "description": "榮格派臨床夢解析，重視原型與個人聯想結合。"
  },
  {
    "book_id": 9,
    "book_name": "夢的力量",
    "title_zh": "夢的力量",
    "title_en": "The Power of Dreams",
    "book_name_en": "The Power of Dreams",
    "author": "Montague Ullman",
    "school": "夢工作實務",
    "global_weight": 0.68,
    "core_theory": "夢具有自我療癒傾向，團體夢工作有助於把隱隱約約的訊息變成語言。",
    "process": [
      "團體傾聽",
      "避免解釋衝動",
      "幫助夢者自己看見",
      "支持夢者行動化"
    ],
    "forbidden": [
      "搶先解釋",
      "把夢當成病理症狀"
    ],
    "scene_match": [
      "孤獨感強的夢",
      "難以說清的夢"
    ],
    "description": "夢具有自我療癒傾向，團體夢工作有助於把隱隱約約的訊息變成語言。"
  },
  {
    "book_id": 10,
    "book_name": "原型心理學",
    "title_zh": "原型心理學",
    "title_en": "The Archetypes and the Collective Unconscious",
    "book_name_en": "The Archetypes and the Collective Unconscious",
    "author": "Carl Gustav Jung",
    "school": "榮格派",
    "global_weight": 0.82,
    "core_theory": "原型是集體無意識中的先天結構，透過神話、夢、象徵顯現。",
    "process": [
      "辨識原型模式",
      "連接神話母題",
      "評估原型在當下的活躍程度"
    ],
    "forbidden": [
      "把所有意象都當原型",
      "忽略個人層次"
    ],
    "scene_match": [
      "神話母題明顯的夢"
    ],
    "description": "原型是集體無意識中的先天結構，透過神話、夢、象徵顯現。"
  },
  {
    "book_id": 11,
    "book_name": "夢、幻覺與象徵",
    "title_zh": "夢、幻覺與象徵",
    "title_en": "Dreams, Hallucinations, and Symbols",
    "book_name_en": "Dreams, Hallucinations, and Symbols",
    "author": "Edward Edinger",
    "school": "榮格派",
    "global_weight": 0.7,
    "core_theory": "夢中象徵具有轉化功能，自性化過程常透過象徵逐步展開。",
    "process": [
      "辨識轉化象徵",
      "觀察象徵序列",
      "連接人格整合"
    ],
    "forbidden": [
      "單象徵單義解讀",
      "忽略象徵變化"
    ],
    "scene_match": [
      "有明顯象徵序列的夢"
    ],
    "description": "夢中象徵具有轉化功能，自性化過程常透過象徵逐步展開。"
  },
  {
    "book_id": 12,
    "book_name": "精神分析引論",
    "title_zh": "精神分析引論",
    "title_en": "Introductory Lectures on Psycho-Analysis",
    "book_name_en": "Introductory Lectures on Psycho-Analysis",
    "author": "Sigmund Freud",
    "school": "精神分析",
    "global_weight": 0.55,
    "core_theory": "夢是精神分析理解潛意識的重要入口，需透過自由聯想接近隱夢思緒。",
    "process": [
      "自由聯想",
      "辨識壓抑",
      "分析夢的工作",
      "建立轉移關係理解"
    ],
    "forbidden": [
      "簡約化還原",
      "過早確定病因"
    ],
    "scene_match": [
      "內心衝突明顯的夢"
    ],
    "description": "夢是精神分析理解潛意識的重要入口，需透過自由聯想接近隱夢思緒。"
  },
  {
    "book_id": 13,
    "book_name": "夢的神經科學",
    "title_zh": "夢的神經科學",
    "title_en": "The Neuroscience of Sleep and Dreams",
    "book_name_en": "The Neuroscience of Sleep and Dreams",
    "author": "Robert Stickgold",
    "school": "生理夢理論",
    "global_weight": 0.42,
    "core_theory": "夢與睡眠階段、記憶鞏固、情緒處理密切相關。",
    "process": [
      "考慮睡眠結構",
      "區分記憶片段與心理意義",
      "避免玄學"
    ],
    "forbidden": [
      "否定主觀意義",
      "把夢全還原為隨機雜訊"
    ],
    "scene_match": [
      "破碎、記憶感強的夢"
    ],
    "description": "夢與睡眠階段、記憶鞏固、情緒處理密切相關。"
  },
  {
    "book_id": 14,
    "book_name": "孵夢指南",
    "title_zh": "孵夢指南",
    "title_en": "Dream Incubation",
    "book_name_en": "Dream Incubation",
    "author": "Kelly Bulkeley",
    "school": "夢工作實務",
    "global_weight": 0.66,
    "core_theory": "人可以主動向夢提出問題，引導夢境圍繞現實議題展開。",
    "process": [
      "睡前陳述問題",
      "保持開放態度",
      "醒後立即紀錄",
      "尋找象徵答案"
    ],
    "forbidden": [
      "期待字面答案",
      "過度執著特定結果"
    ],
    "scene_match": [
      "有現實疑問的夢"
    ],
    "description": "人可以主動向夢提出問題，引導夢境圍繞現實議題展開。"
  },
  {
    "book_id": 15,
    "book_name": "夢境的智慧",
    "title_zh": "夢境的智慧",
    "title_en": "The Wisdom of the Dream",
    "book_name_en": "The Wisdom of the Dream",
    "author": "Stephen Segaller",
    "school": "榮格派",
    "global_weight": 0.74,
    "core_theory": "夢不是純粹混亂，而是在試圖告訴夢者關於自己的事。",
    "process": [
      "傾聽夢的整體氛圍",
      "辨識重複主題",
      "連接當下自我狀態"
    ],
    "forbidden": [
      "只看單一意象",
      "忽略整體情緒"
    ],
    "scene_match": [
      "重複主題夢"
    ],
    "description": "夢不是純粹混亂，而是在試圖告訴夢者關於自己的事。"
  },
  {
    "book_id": 16,
    "book_name": "夢的象徵辭典",
    "title_zh": "夢的象徵辭典",
    "title_en": "Dictionary of Dream Symbols",
    "book_name_en": "Dictionary of Dream Symbols",
    "author": "Eric Ackroyd",
    "school": "綜合意象",
    "global_weight": 0.6,
    "core_theory": "夢意象有跨文化重複模式，但必須與夢者個人經驗結合。",
    "process": [
      "參考跨文化模式",
      "核對個人經驗",
      "優先夢者感受"
    ],
    "forbidden": [
      "查表式解夢",
      "忽略文化差異"
    ],
    "scene_match": [
      "常見象徵夢"
    ],
    "description": "夢意象有跨文化重複模式，但必須與夢者個人經驗結合。"
  },
  {
    "book_id": 17,
    "book_name": "夜之語言：夢的心理學",
    "title_zh": "夜之語言：夢的心理學",
    "title_en": "The Language of the Night",
    "book_name_en": "The Language of the Night",
    "author": "Marion Woodman",
    "school": "榮格派",
    "global_weight": 0.71,
    "core_theory": "夢與身體、陰性原型、創傷轉化密切相關。",
    "process": [
      "留意身體感",
      "辨識陰性原型",
      "連結創傷與轉化"
    ],
    "forbidden": [
      "忽略身體訊息",
      "只做理性分析"
    ],
    "scene_match": [
      "身體感強的夢"
    ],
    "description": "夢與身體、陰性原型、創傷轉化密切相關。"
  },
  {
    "book_id": 18,
    "book_name": "自我與原型",
    "title_zh": "自我與原型",
    "title_en": "The Self and the Archetypes",
    "book_name_en": "The Self and the Archetypes",
    "author": "Edward Edinger",
    "school": "榮格派",
    "global_weight": 0.73,
    "core_theory": "自性化是人格整合的過程，夢中常出現自性符號。",
    "process": [
      "辨識自性符號",
      "觀察人格整合程度",
      "連結生命階段"
    ],
    "forbidden": [
      "把自性化簡單視為成功",
      "忽略痛苦轉化"
    ],
    "scene_match": [
      "人生轉折夢"
    ],
    "description": "自性化是人格整合的過程，夢中常出現自性符號。"
  },
  {
    "book_id": 19,
    "book_name": "睡眠與夢心理學",
    "title_zh": "睡眠與夢心理學",
    "title_en": "",
    "book_name_en": "",
    "author": "高宜安",
    "school": "本土意象",
    "global_weight": 0.58,
    "core_theory": "華人夢境有其文化特殊性，需結合本土生活經驗理解。",
    "process": [
      "考慮文化背景",
      "連結家庭關係",
      "區分文化聯想與個人聯想"
    ],
    "forbidden": [
      "全盤套用西方象徵",
      "忽略華人家庭議題"
    ],
    "scene_match": [
      "家庭、祖輩、文化意象明顯的夢"
    ],
    "description": "華人夢境有其文化特殊性，需結合本土生活經驗理解。"
  },
  {
    "book_id": 20,
    "book_name": "夢的故事",
    "title_zh": "夢的故事",
    "title_en": "Dream Stories",
    "book_name_en": "Dream Stories",
    "author": "Patricia Garfield",
    "school": "夢工作實務",
    "global_weight": 0.67,
    "core_theory": "噩夢可以被重新講述，重複夢往往是未被處理訊息的提醒。",
    "process": [
      "紀錄重複模式",
      "重新敘事",
      "把恐懼變成可處理訊息"
    ],
    "forbidden": [
      "把噩夢當純預兆",
      "強壓恐懼"
    ],
    "scene_match": [
      "重複噩夢"
    ],
    "description": "噩夢可以被重新講述，重複夢往往是未被處理訊息的提醒。"
  },
  {
    "book_id": 21,
    "book_name": "潛意識的發現",
    "title_zh": "潛意識的發現",
    "title_en": "The Discovery of the Unconscious",
    "book_name_en": "The Discovery of the Unconscious",
    "author": "Henri Ellenberger",
    "school": "精神分析",
    "global_weight": 0.52,
    "core_theory": "夢解析思想有其歷史源流，精神分析只是其中一支。",
    "process": [
      "避免單一學派獨斷",
      "保持方法論自覺"
    ],
    "forbidden": [
      "把所有夢都精神分析化"
    ],
    "scene_match": [
      "學派綜合評估"
    ],
    "description": "夢解析思想有其歷史源流，精神分析只是其中一支。"
  },
  {
    "book_id": 22,
    "book_name": "夢與創傷",
    "title_zh": "夢與創傷",
    "title_en": "Dreams and Trauma",
    "book_name_en": "Dreams and Trauma",
    "author": "Deirdre Barrett",
    "school": "生理夢理論",
    "global_weight": 0.45,
    "core_theory": "創傷夢具有重複性，是大腦試圖處理未完成創傷的訊號。",
    "process": [
      "辨識創傷重複",
      "區分創傷再現與整合夢",
      "必要時建議專業協助"
    ],
    "forbidden": [
      "輕率解讀創傷夢",
      "鼓勵危險自我處理"
    ],
    "scene_match": [
      "創傷重複夢"
    ],
    "description": "創傷夢具有重複性，是大腦試圖處理未完成創傷的訊號。"
  }
];

export const DREAM_TAGS: DreamTagRecord[] = [
  {
    "tag_id": 1,
    "tag_name": "人物",
    "tag_desc": "夢中人物與原型投射"
  },
  {
    "tag_id": 2,
    "tag_name": "動物",
    "tag_desc": "動物意象與本能象徵"
  },
  {
    "tag_id": 3,
    "tag_name": "場景",
    "tag_desc": "夢境空間環境與場域"
  },
  {
    "tag_id": 4,
    "tag_name": "身體",
    "tag_desc": "身體部位與生理感覺"
  },
  {
    "tag_id": 5,
    "tag_name": "動作",
    "tag_desc": "夢中行為、互動與動態事件"
  },
  {
    "tag_id": 6,
    "tag_name": "噩夢",
    "tag_desc": "高頻焦慮、驚恐與創傷性主題"
  },
  {
    "tag_id": 7,
    "tag_name": "物件",
    "tag_desc": "象徵器具、符號與道具"
  }
];

export const DREAM_SYMBOLS: DreamSymbolRecord[] = [
  {
    "symbol_id": 1,
    "symbol": "祖母",
    "alias_list": [
      "嫲嫲",
      "奶奶"
    ],
    "book_interpret_json": {
      "1": {
        "text": "象徵庇護、舊時情感、內心母性原型",
        "weight": 0.7
      },
      "3": {
        "text": "大母神原型",
        "weight": 0.8
      },
      "10": {
        "text": "正向大母神：滋養、包容",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 2,
    "symbol": "祖父",
    "alias_list": [
      "爺爺"
    ],
    "book_interpret_json": {
      "1": {
        "text": "代表權威、經驗、精神指引",
        "weight": 0.7
      },
      "3": {
        "text": "智慧老人原型",
        "weight": 0.8
      },
      "10": {
        "text": "智慧老人原型",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 3,
    "symbol": "小偷",
    "alias_list": [
      "賊",
      "盜賊"
    ],
    "book_interpret_json": {
      "1": {
        "text": "恐懼失去、被壓抑慾望",
        "weight": 0.6
      },
      "4": {
        "text": "本我衝動外化",
        "weight": 0.7
      },
      "6": {
        "text": "陰影原型",
        "weight": 0.76
      }
    },
    "source_ref": "1,4,6",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 4,
    "symbol": "流浪漢",
    "alias_list": [
      "流浪人",
      "乞丐"
    ],
    "book_interpret_json": {
      "1": {
        "text": "被遺棄的自我部分",
        "weight": 0.7
      },
      "6": {
        "text": "陰影原型",
        "weight": 0.8
      },
      "8": {
        "text": "未整合人格碎片",
        "weight": 0.71
      }
    },
    "source_ref": "1,6,8",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 5,
    "symbol": "女巫",
    "alias_list": [
      "巫婆"
    ],
    "book_interpret_json": {
      "1": {
        "text": "陰性陰影、直覺、操縱感",
        "weight": 0.7
      },
      "3": {
        "text": "負面大母神原型",
        "weight": 0.8
      },
      "10": {
        "text": "負面大母神",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 6,
    "symbol": "醫生",
    "alias_list": [
      "醫師",
      "大夫"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在療癒者",
        "weight": 0.7
      },
      "3": {
        "text": "療癒者原型",
        "weight": 0.8
      },
      "8": {
        "text": "心靈修復象徵",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,8",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 7,
    "symbol": "小孩",
    "alias_list": [
      "孩童",
      "細路",
      "小朋友"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在孩童",
        "weight": 0.7
      },
      "3": {
        "text": "內在孩童原型",
        "weight": 0.8
      },
      "10": {
        "text": "脆弱與潛能",
        "weight": 0.79
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 8,
    "symbol": "敵人",
    "alias_list": [
      "仇敵",
      "對手"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內心陰影投射",
        "weight": 0.7
      },
      "6": {
        "text": "陰影投射",
        "weight": 0.8
      },
      "8": {
        "text": "未整合人格面向",
        "weight": 0.73
      }
    },
    "source_ref": "1,6,8",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 9,
    "symbol": "司機",
    "alias_list": [
      "駕駛員"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生方向的掌控者",
        "weight": 0.7
      },
      "2": {
        "text": "意識或潛意識主導",
        "weight": 0.76
      },
      "7": {
        "text": "控制權主題",
        "weight": 0.69
      }
    },
    "source_ref": "1,2,7",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 10,
    "symbol": "聖者／隱士",
    "alias_list": [
      "聖人"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在智慧、獨處",
        "weight": 0.7
      },
      "3": {
        "text": "智慧老人原型",
        "weight": 0.8
      },
      "10": {
        "text": "智慧老人",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "人物",
    "tag_ids": [
      1
    ]
  },
  {
    "symbol_id": 11,
    "symbol": "鹿",
    "alias_list": [
      "雄鹿",
      "小鹿"
    ],
    "book_interpret_json": {
      "1": {
        "text": "靈敏、純真、精神追求",
        "weight": 0.7
      },
      "3": {
        "text": "柔和本能",
        "weight": 0.6
      },
      "10": {
        "text": "溫和本能原型",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 12,
    "symbol": "貓",
    "alias_list": [
      "野貓",
      "家貓"
    ],
    "book_interpret_json": {
      "1": {
        "text": "直覺、獨立",
        "weight": 0.7
      },
      "3": {
        "text": "陰性本能",
        "weight": 0.6
      },
      "10": {
        "text": "獨立本能原型",
        "weight": 0.71
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 13,
    "symbol": "孔雀",
    "alias_list": [],
    "book_interpret_json": {
      "1": {
        "text": "虛榮或自我展現",
        "weight": 0.6
      },
      "15": {
        "text": "自我呈現",
        "weight": 0.66
      },
      "16": {
        "text": "跨文化：吉祥或炫耀",
        "weight": 0.58
      }
    },
    "source_ref": "1,15,16",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 14,
    "symbol": "綿羊",
    "alias_list": [
      "羊"
    ],
    "book_interpret_json": {
      "1": {
        "text": "順服、缺乏主見",
        "weight": 0.6
      },
      "15": {
        "text": "順從群體",
        "weight": 0.65
      },
      "16": {
        "text": "溫馴與犧牲",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 15,
    "symbol": "蝙蝠",
    "alias_list": [],
    "book_interpret_json": {
      "1": {
        "text": "黑暗感知、恐懼",
        "weight": 0.6
      },
      "7": {
        "text": "個人感受優先",
        "weight": 0.65
      },
      "16": {
        "text": "文化差異極大",
        "weight": 0.59
      }
    },
    "source_ref": "1,7,16",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 16,
    "symbol": "狼",
    "alias_list": [
      "野狼"
    ],
    "book_interpret_json": {
      "1": {
        "text": "野性、生存力量",
        "weight": 0.7
      },
      "3": {
        "text": "未馴服本能",
        "weight": 0.7
      },
      "10": {
        "text": "野生本能原型",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 17,
    "symbol": "馬",
    "alias_list": [
      "野馬",
      "駿馬"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命力、前進動能",
        "weight": 0.7
      },
      "3": {
        "text": "身體本能",
        "weight": 0.7
      },
      "10": {
        "text": "本能原型",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 18,
    "symbol": "蛇",
    "alias_list": [
      "大蛇"
    ],
    "book_interpret_json": {
      "1": {
        "text": "轉化、慾望、重生",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生原型",
        "weight": 0.8
      },
      "4": {
        "text": "性能量象徵",
        "weight": 0.6
      }
    },
    "source_ref": "1,3,4",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 19,
    "symbol": "鷹",
    "alias_list": [
      "雄鷹",
      "老鷹"
    ],
    "book_interpret_json": {
      "1": {
        "text": "高層視角、遠見",
        "weight": 0.7
      },
      "3": {
        "text": "精神原型",
        "weight": 0.8
      },
      "10": {
        "text": "精神原型",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 20,
    "symbol": "老鼠",
    "alias_list": [
      "鼠"
    ],
    "book_interpret_json": {
      "1": {
        "text": "微小恐懼",
        "weight": 0.6
      },
      "16": {
        "text": "微小威脅",
        "weight": 0.57
      },
      "19": {
        "text": "華人夢境常見小煩惱",
        "weight": 0.56
      }
    },
    "source_ref": "1,16,19",
    "notes": "動物",
    "tag_ids": [
      2
    ]
  },
  {
    "symbol_id": 21,
    "symbol": "圖書館",
    "alias_list": [
      "圖書室"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內心知識、記憶集合",
        "weight": 0.7
      },
      "2": {
        "text": "集體記憶",
        "weight": 0.7
      },
      "3": {
        "text": "集體潛意識",
        "weight": 0.77
      }
    },
    "source_ref": "1,2,3",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 22,
    "symbol": "港口",
    "alias_list": [
      "碼頭"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生轉折",
        "weight": 0.7
      },
      "7": {
        "text": "過渡場域",
        "weight": 0.68
      },
      "15": {
        "text": "階段交界",
        "weight": 0.67
      }
    },
    "source_ref": "1,7,15",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 23,
    "symbol": "旅館／酒店",
    "alias_list": [
      "酒店",
      "賓館"
    ],
    "book_interpret_json": {
      "1": {
        "text": "過渡階段",
        "weight": 0.7
      },
      "2": {
        "text": "暫時人格狀態",
        "weight": 0.73
      },
      "6": {
        "text": "非永久空間",
        "weight": 0.71
      }
    },
    "source_ref": "1,2,6",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 24,
    "symbol": "墳墓",
    "alias_list": [
      "墳",
      "墓穴",
      "墳頭"
    ],
    "book_interpret_json": {
      "1": {
        "text": "舊自我結束",
        "weight": 0.7
      },
      "3": {
        "text": "死亡-重生",
        "weight": 0.8
      },
      "10": {
        "text": "舊人格埋葬",
        "weight": 0.78
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 25,
    "symbol": "森林",
    "alias_list": [
      "樹林",
      "山林"
    ],
    "book_interpret_json": {
      "1": {
        "text": "潛意識探索",
        "weight": 0.7
      },
      "3": {
        "text": "集體潛意識",
        "weight": 0.8
      },
      "10": {
        "text": "潛意識場域",
        "weight": 0.79
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 26,
    "symbol": "學校",
    "alias_list": [
      "學堂",
      "校園"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人生課題",
        "weight": 0.7
      },
      "5": {
        "text": "壓力相關夢",
        "weight": 0.4
      },
      "20": {
        "text": "成年人高頻回溯場景",
        "weight": 0.65
      }
    },
    "source_ref": "1,5,20",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 27,
    "symbol": "橋",
    "alias_list": [
      "橋樑"
    ],
    "book_interpret_json": {
      "1": {
        "text": "狀態過渡",
        "weight": 0.7
      },
      "2": {
        "text": "邊界與連接",
        "weight": 0.74
      },
      "3": {
        "text": "跨過內在鴻溝",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,3",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 28,
    "symbol": "家／房屋",
    "alias_list": [
      "房子",
      "大屋",
      "居所",
      "屋企"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內心自我",
        "weight": 0.8
      },
      "2": {
        "text": "心靈結構",
        "weight": 0.8
      },
      "3": {
        "text": "房屋即心靈",
        "weight": 0.82
      }
    },
    "source_ref": "1,2,3",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 29,
    "symbol": "洞穴",
    "alias_list": [
      "山洞"
    ],
    "book_interpret_json": {
      "1": {
        "text": "退入潛意識",
        "weight": 0.7
      },
      "3": {
        "text": "母性潛意識",
        "weight": 0.7
      },
      "10": {
        "text": "大母神空間",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 30,
    "symbol": "山",
    "alias_list": [
      "高山"
    ],
    "book_interpret_json": {
      "1": {
        "text": "目標、精神高度",
        "weight": 0.7
      },
      "3": {
        "text": "精神高度",
        "weight": 0.77
      },
      "10": {
        "text": "攀登原型",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 31,
    "symbol": "地下室",
    "alias_list": [
      "地庫"
    ],
    "book_interpret_json": {
      "1": {
        "text": "被壓抑記憶",
        "weight": 0.7
      },
      "2": {
        "text": "最深層潛意識",
        "weight": 0.7
      },
      "4": {
        "text": "被壓抑本我",
        "weight": 0.58
      }
    },
    "source_ref": "1,2,4",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 32,
    "symbol": "天台",
    "alias_list": [
      "屋頂"
    ],
    "book_interpret_json": {
      "1": {
        "text": "精神層面",
        "weight": 0.7
      },
      "2": {
        "text": "意識頂層",
        "weight": 0.73
      },
      "3": {
        "text": "俯瞰人生",
        "weight": 0.74
      }
    },
    "source_ref": "1,2,3",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 33,
    "symbol": "監獄",
    "alias_list": [
      "牢獄",
      "牢房"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我設限",
        "weight": 0.7
      },
      "6": {
        "text": "內在束縛",
        "weight": 0.72
      },
      "15": {
        "text": "分辨外在限制或自我設限",
        "weight": 0.68
      }
    },
    "source_ref": "1,6,15",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 34,
    "symbol": "醫院",
    "alias_list": [
      "病院"
    ],
    "book_interpret_json": {
      "1": {
        "text": "療癒需求",
        "weight": 0.7
      },
      "7": {
        "text": "身體或心理修復",
        "weight": 0.68
      },
      "22": {
        "text": "創傷夢中的安全象徵",
        "weight": 0.44
      }
    },
    "source_ref": "1,7,22",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 35,
    "symbol": "沙漠",
    "alias_list": [
      "荒漠"
    ],
    "book_interpret_json": {
      "1": {
        "text": "孤獨、能量枯竭",
        "weight": 0.7
      },
      "3": {
        "text": "心靈荒漠",
        "weight": 0.74
      },
      "10": {
        "text": "乾涸原型",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 36,
    "symbol": "海洋",
    "alias_list": [
      "大海",
      "海"
    ],
    "book_interpret_json": {
      "1": {
        "text": "集體潛意識",
        "weight": 0.7
      },
      "3": {
        "text": "水原型",
        "weight": 0.8
      },
      "10": {
        "text": "大海原型",
        "weight": 0.79
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 37,
    "symbol": "河流",
    "alias_list": [
      "溪水",
      "河"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命流動",
        "weight": 0.7
      },
      "2": {
        "text": "流動心靈能量",
        "weight": 0.74
      },
      "3": {
        "text": "情緒流動",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,3",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 38,
    "symbol": "超市",
    "alias_list": [
      "商場"
    ],
    "book_interpret_json": {
      "1": {
        "text": "大量選擇",
        "weight": 0.7
      },
      "7": {
        "text": "人生選項",
        "weight": 0.67
      },
      "19": {
        "text": "現代華人夢常見場景",
        "weight": 0.57
      }
    },
    "source_ref": "1,7,19",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 39,
    "symbol": "車站",
    "alias_list": [
      "火車站"
    ],
    "book_interpret_json": {
      "1": {
        "text": "等待轉變",
        "weight": 0.7
      },
      "7": {
        "text": "過渡場域",
        "weight": 0.68
      },
      "15": {
        "text": "人生選擇點",
        "weight": 0.67
      }
    },
    "source_ref": "1,7,15",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 40,
    "symbol": "教堂",
    "alias_list": [
      "廟宇",
      "寺廟"
    ],
    "book_interpret_json": {
      "1": {
        "text": "精神寄託",
        "weight": 0.7
      },
      "3": {
        "text": "神聖空間",
        "weight": 0.78
      },
      "10": {
        "text": "自性原型場域",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,10",
    "notes": "場景",
    "tag_ids": [
      3
    ]
  },
  {
    "symbol_id": 41,
    "symbol": "鑰匙",
    "alias_list": [
      "鎖匙"
    ],
    "book_interpret_json": {
      "1": {
        "text": "解開謎團",
        "weight": 0.7
      },
      "3": {
        "text": "打開潛意識",
        "weight": 0.7
      },
      "10": {
        "text": "開啟符號",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 42,
    "symbol": "鏡子",
    "alias_list": [
      "鏡"
    ],
    "book_interpret_json": {
      "1": {
        "text": "看見真實自我",
        "weight": 0.7
      },
      "6": {
        "text": "面對陰影",
        "weight": 0.8
      },
      "8": {
        "text": "自我映照",
        "weight": 0.73
      }
    },
    "source_ref": "1,6,8",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 43,
    "symbol": "船",
    "alias_list": [
      "船隻",
      "小舟",
      "輪船"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命旅程",
        "weight": 0.7
      },
      "2": {
        "text": "心靈承載",
        "weight": 0.74
      },
      "3": {
        "text": "情緒之舟",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,3",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 44,
    "symbol": "燈籠／燈",
    "alias_list": [
      "燈光",
      "燈籠",
      "燈火"
    ],
    "book_interpret_json": {
      "1": {
        "text": "覺察、方向",
        "weight": 0.7
      },
      "3": {
        "text": "意識之光",
        "weight": 0.7
      },
      "10": {
        "text": "光明原型",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 45,
    "symbol": "衣服",
    "alias_list": [
      "衫",
      "衣物",
      "服裝"
    ],
    "book_interpret_json": {
      "1": {
        "text": "社會面具",
        "weight": 0.7
      },
      "4": {
        "text": "人格偽裝",
        "weight": 0.6
      },
      "6": {
        "text": "人格面具",
        "weight": 0.72
      }
    },
    "source_ref": "1,4,6",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 46,
    "symbol": "寶石",
    "alias_list": [
      "珠寶",
      "寶玉"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在珍貴特質",
        "weight": 0.7
      },
      "3": {
        "text": "自性內核",
        "weight": 0.7
      },
      "10": {
        "text": "寶石原型",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 47,
    "symbol": "錢／金錢",
    "alias_list": [
      "鈔票",
      "銀紙"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我價值",
        "weight": 0.7
      },
      "4": {
        "text": "能量與資源",
        "weight": 0.6
      },
      "7": {
        "text": "感受優先",
        "weight": 0.67
      }
    },
    "source_ref": "1,4,7",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 48,
    "symbol": "門",
    "alias_list": [
      "門戶"
    ],
    "book_interpret_json": {
      "1": {
        "text": "轉換邊界",
        "weight": 0.7
      },
      "2": {
        "text": "心靈邊界",
        "weight": 0.74
      },
      "3": {
        "text": "意識與潛意識邊界",
        "weight": 0.75
      }
    },
    "source_ref": "1,2,3",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 49,
    "symbol": "鐘錶／時鐘",
    "alias_list": [
      "手錶"
    ],
    "book_interpret_json": {
      "1": {
        "text": "時間壓力",
        "weight": 0.7
      },
      "5": {
        "text": "限時焦慮",
        "weight": 0.4
      },
      "13": {
        "text": "記憶提取",
        "weight": 0.41
      }
    },
    "source_ref": "1,5,13",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 50,
    "symbol": "武器",
    "alias_list": [
      "兵器"
    ],
    "book_interpret_json": {
      "1": {
        "text": "攻擊性、界限",
        "weight": 0.7
      },
      "4": {
        "text": "攻擊驅動",
        "weight": 0.6
      },
      "6": {
        "text": "陰影力量",
        "weight": 0.72
      }
    },
    "source_ref": "1,4,6",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 51,
    "symbol": "書本",
    "alias_list": [
      "書籍"
    ],
    "book_interpret_json": {
      "1": {
        "text": "學習、訊息",
        "weight": 0.7
      },
      "2": {
        "text": "內在知識",
        "weight": 0.73
      },
      "14": {
        "text": "接收內在訊息",
        "weight": 0.64
      }
    },
    "source_ref": "1,2,14",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 52,
    "symbol": "車輛",
    "alias_list": [
      "汽車",
      "車"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我前進",
        "weight": 0.7
      },
      "2": {
        "text": "自我載具",
        "weight": 0.74
      },
      "7": {
        "text": "控制權主題",
        "weight": 0.69
      }
    },
    "source_ref": "1,2,7",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 53,
    "symbol": "梯子",
    "alias_list": [
      "樓梯"
    ],
    "book_interpret_json": {
      "1": {
        "text": "階段成長",
        "weight": 0.7
      },
      "2": {
        "text": "心靈層級",
        "weight": 0.73
      },
      "3": {
        "text": "向上邁進",
        "weight": 0.74
      }
    },
    "source_ref": "1,2,3",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 54,
    "symbol": "窗",
    "alias_list": [
      "窗戶"
    ],
    "book_interpret_json": {
      "1": {
        "text": "視角、開放度",
        "weight": 0.7
      },
      "2": {
        "text": "心靈視窗",
        "weight": 0.73
      },
      "8": {
        "text": "意識觀察",
        "weight": 0.7
      }
    },
    "source_ref": "1,2,8",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 55,
    "symbol": "鎖",
    "alias_list": [
      "鎖頭"
    ],
    "book_interpret_json": {
      "1": {
        "text": "封閉、秘密",
        "weight": 0.7
      },
      "3": {
        "text": "心靈封閉",
        "weight": 0.72
      },
      "14": {
        "text": "尋求解鎖",
        "weight": 0.62
      }
    },
    "source_ref": "1,3,14",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 56,
    "symbol": "劍",
    "alias_list": [
      "寶劍"
    ],
    "book_interpret_json": {
      "1": {
        "text": "界限、分辨",
        "weight": 0.7
      },
      "3": {
        "text": "劃清界限",
        "weight": 0.74
      },
      "10": {
        "text": "劍原型",
        "weight": 0.75
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 57,
    "symbol": "花朵",
    "alias_list": [
      "花"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命力、綻放",
        "weight": 0.7
      },
      "3": {
        "text": "自性綻放",
        "weight": 0.73
      },
      "10": {
        "text": "花朵原型",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 58,
    "symbol": "種子",
    "alias_list": [],
    "book_interpret_json": {
      "1": {
        "text": "潛能",
        "weight": 0.7
      },
      "3": {
        "text": "潛藏原型",
        "weight": 0.72
      },
      "10": {
        "text": "種子原型",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 59,
    "symbol": "面具",
    "alias_list": [],
    "book_interpret_json": {
      "1": {
        "text": "社會偽裝",
        "weight": 0.7
      },
      "4": {
        "text": "防禦機制",
        "weight": 0.6
      },
      "6": {
        "text": "人格面具",
        "weight": 0.75
      }
    },
    "source_ref": "1,4,6",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 60,
    "symbol": "棺材",
    "alias_list": [
      "棺木"
    ],
    "book_interpret_json": {
      "1": {
        "text": "舊狀態結束",
        "weight": 0.7
      },
      "3": {
        "text": "死亡重生",
        "weight": 0.77
      },
      "10": {
        "text": "埋葬舊人格",
        "weight": 0.76
      }
    },
    "source_ref": "1,3,10",
    "notes": "物件",
    "tag_ids": [
      7
    ]
  },
  {
    "symbol_id": 61,
    "symbol": "眼睛",
    "alias_list": [
      "雙眼",
      "眼"
    ],
    "book_interpret_json": {
      "1": {
        "text": "洞察力",
        "weight": 0.7
      },
      "3": {
        "text": "看見真實",
        "weight": 0.7
      },
      "10": {
        "text": "眼睛原型",
        "weight": 0.74
      }
    },
    "source_ref": "1,3,10",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 62,
    "symbol": "心臟",
    "alias_list": [
      "心"
    ],
    "book_interpret_json": {
      "1": {
        "text": "真實情感",
        "weight": 0.7
      },
      "3": {
        "text": "自性核心",
        "weight": 0.74
      },
      "10": {
        "text": "心臟原型",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 63,
    "symbol": "牙齒",
    "alias_list": [
      "牙"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自信、力量",
        "weight": 0.7
      },
      "4": {
        "text": "經典夢主題",
        "weight": 0.5
      },
      "5": {
        "text": "體感觸發",
        "weight": 0.4
      }
    },
    "source_ref": "1,4,5",
    "notes": "身體,噩夢",
    "tag_ids": [
      4,
      6
    ]
  },
  {
    "symbol_id": 64,
    "symbol": "皮膚",
    "alias_list": [
      "肌膚"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我邊界",
        "weight": 0.7
      },
      "2": {
        "text": "心靈外層",
        "weight": 0.73
      },
      "17": {
        "text": "邊界受傷",
        "weight": 0.69
      }
    },
    "source_ref": "1,2,17",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 65,
    "symbol": "頭",
    "alias_list": [
      "腦袋"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我認同",
        "weight": 0.7
      },
      "2": {
        "text": "意識中心",
        "weight": 0.73
      },
      "4": {
        "text": "自我受損",
        "weight": 0.56
      }
    },
    "source_ref": "1,2,4",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 66,
    "symbol": "手",
    "alias_list": [
      "手掌"
    ],
    "book_interpret_json": {
      "1": {
        "text": "行動、創造",
        "weight": 0.7
      },
      "15": {
        "text": "抓取與給予",
        "weight": 0.67
      },
      "16": {
        "text": "跨文化：行動能力",
        "weight": 0.58
      }
    },
    "source_ref": "1,15,16",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 67,
    "symbol": "腳",
    "alias_list": [
      "雙腳"
    ],
    "book_interpret_json": {
      "1": {
        "text": "立足點",
        "weight": 0.7
      },
      "15": {
        "text": "人生根基",
        "weight": 0.67
      },
      "16": {
        "text": "前進能力",
        "weight": 0.58
      }
    },
    "source_ref": "1,15,16",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 68,
    "symbol": "血",
    "alias_list": [
      "血液"
    ],
    "book_interpret_json": {
      "1": {
        "text": "生命力",
        "weight": 0.7
      },
      "4": {
        "text": "生命能量",
        "weight": 0.6
      },
      "16": {
        "text": "跨文化：生命、創傷",
        "weight": 0.58
      }
    },
    "source_ref": "1,4,16",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 69,
    "symbol": "骨頭",
    "alias_list": [
      "骨"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內在根基",
        "weight": 0.7
      },
      "15": {
        "text": "最真實本質",
        "weight": 0.67
      },
      "16": {
        "text": "堅固、底層",
        "weight": 0.58
      }
    },
    "source_ref": "1,15,16",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 70,
    "symbol": "頭髮",
    "alias_list": [
      "毛髮"
    ],
    "book_interpret_json": {
      "1": {
        "text": "魅力、生命力",
        "weight": 0.7
      },
      "15": {
        "text": "自信",
        "weight": 0.67
      },
      "19": {
        "text": "華人夢中常連結形象",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,19",
    "notes": "身體",
    "tag_ids": [
      4
    ]
  },
  {
    "symbol_id": 71,
    "symbol": "追逐",
    "alias_list": [
      "被追",
      "追趕"
    ],
    "book_interpret_json": {
      "1": {
        "text": "逃避壓力",
        "weight": 0.7
      },
      "4": {
        "text": "被壓抑衝動",
        "weight": 0.7
      },
      "6": {
        "text": "陰影追趕",
        "weight": 0.76
      }
    },
    "source_ref": "1,4,6",
    "notes": "動作,噩夢",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 72,
    "symbol": "尋找東西",
    "alias_list": [
      "找東西",
      "搜尋物件"
    ],
    "book_interpret_json": {
      "1": {
        "text": "尋找失落自我",
        "weight": 0.7
      },
      "7": {
        "text": "內在渴求",
        "weight": 0.6
      },
      "14": {
        "text": "孵夢主題",
        "weight": 0.63
      }
    },
    "source_ref": "1,7,14",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 73,
    "symbol": "溺水",
    "alias_list": [
      "遇溺"
    ],
    "book_interpret_json": {
      "1": {
        "text": "被情緒淹沒",
        "weight": 0.7
      },
      "4": {
        "text": "本我過度湧入",
        "weight": 0.6
      },
      "5": {
        "text": "呼吸體感觸發",
        "weight": 0.4
      }
    },
    "source_ref": "1,4,5",
    "notes": "動作,噩夢",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 74,
    "symbol": "墜落",
    "alias_list": [
      "跌落",
      "往下掉",
      "墮下"
    ],
    "book_interpret_json": {
      "1": {
        "text": "失控、安全感",
        "weight": 0.7
      },
      "4": {
        "text": "控制感崩塌",
        "weight": 0.6
      },
      "5": {
        "text": "入睡肌抽躍",
        "weight": 0.5
      }
    },
    "source_ref": "1,4,5",
    "notes": "動作,噩夢",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 75,
    "symbol": "考試／答不出題",
    "alias_list": [
      "測驗",
      "考場"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自我懷疑",
        "weight": 0.7
      },
      "5": {
        "text": "壓力夢",
        "weight": 0.4
      },
      "20": {
        "text": "高頻壓力夢",
        "weight": 0.65
      }
    },
    "source_ref": "1,5,20",
    "notes": "動作,噩夢",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 76,
    "symbol": "遲到",
    "alias_list": [
      "趕唔切"
    ],
    "book_interpret_json": {
      "1": {
        "text": "錯過機會",
        "weight": 0.7
      },
      "15": {
        "text": "內在錯失感",
        "weight": 0.67
      },
      "16": {
        "text": "現代夢常見",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 77,
    "symbol": "飛翔",
    "alias_list": [
      "飛"
    ],
    "book_interpret_json": {
      "1": {
        "text": "自由、超越",
        "weight": 0.7
      },
      "3": {
        "text": "精神向上",
        "weight": 0.7
      },
      "10": {
        "text": "自由原型",
        "weight": 0.73
      }
    },
    "source_ref": "1,3,10",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 78,
    "symbol": "躲藏",
    "alias_list": [
      "匿藏"
    ],
    "book_interpret_json": {
      "1": {
        "text": "逃避",
        "weight": 0.7
      },
      "15": {
        "text": "不想面對",
        "weight": 0.67
      },
      "16": {
        "text": "保護自己",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 79,
    "symbol": "殺人",
    "alias_list": [
      "殺死"
    ],
    "book_interpret_json": {
      "1": {
        "text": "終結舊人格",
        "weight": 0.7
      },
      "4": {
        "text": "消除內在面向",
        "weight": 0.6
      },
      "15": {
        "text": "結束舊狀態",
        "weight": 0.67
      }
    },
    "source_ref": "1,4,15",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 80,
    "symbol": "死亡",
    "alias_list": [
      "死",
      "死去"
    ],
    "book_interpret_json": {
      "1": {
        "text": "轉變",
        "weight": 0.7
      },
      "3": {
        "text": "死亡重生",
        "weight": 0.8
      },
      "10": {
        "text": "原型過渡",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,10",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 81,
    "symbol": "奔跑",
    "alias_list": [
      "跑"
    ],
    "book_interpret_json": {
      "1": {
        "text": "逃離或追尋",
        "weight": 0.7
      },
      "15": {
        "text": "主動前進或逃離",
        "weight": 0.67
      },
      "16": {
        "text": "行動強度",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 82,
    "symbol": "迷路",
    "alias_list": [
      "唔識路",
      "迷失"
    ],
    "book_interpret_json": {
      "1": {
        "text": "方向迷惘",
        "weight": 0.7
      },
      "15": {
        "text": "自我定位",
        "weight": 0.67
      },
      "16": {
        "text": "過渡狀態",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 83,
    "symbol": "受傷",
    "alias_list": [
      "傷口"
    ],
    "book_interpret_json": {
      "1": {
        "text": "內心創傷",
        "weight": 0.7
      },
      "15": {
        "text": "情緒受傷",
        "weight": 0.67
      },
      "22": {
        "text": "創傷夢常見",
        "weight": 0.43
      }
    },
    "source_ref": "1,15,22",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 84,
    "symbol": "結婚",
    "alias_list": [
      "婚禮"
    ],
    "book_interpret_json": {
      "1": {
        "text": "人格整合",
        "weight": 0.7
      },
      "3": {
        "text": "陰陽整合",
        "weight": 0.8
      },
      "18": {
        "text": "自性化",
        "weight": 0.72
      }
    },
    "source_ref": "1,3,18",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 85,
    "symbol": "分手",
    "alias_list": [
      "離開"
    ],
    "book_interpret_json": {
      "1": {
        "text": "分離、放下",
        "weight": 0.7
      },
      "15": {
        "text": "結束舊連結",
        "weight": 0.67
      },
      "16": {
        "text": "分離主題",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 86,
    "symbol": "開槍",
    "alias_list": [
      "射擊"
    ],
    "book_interpret_json": {
      "1": {
        "text": "釋放攻擊",
        "weight": 0.7
      },
      "4": {
        "text": "攻擊驅動",
        "weight": 0.6
      },
      "15": {
        "text": "界限宣示",
        "weight": 0.67
      }
    },
    "source_ref": "1,4,15",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 87,
    "symbol": "被綁",
    "alias_list": [
      "綑綁"
    ],
    "book_interpret_json": {
      "1": {
        "text": "行動受限",
        "weight": 0.7
      },
      "15": {
        "text": "內心束縛",
        "weight": 0.67
      },
      "16": {
        "text": "無法自主",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 88,
    "symbol": "斷電",
    "alias_list": [
      "無電",
      "燈滅"
    ],
    "book_interpret_json": {
      "1": {
        "text": "失去覺察",
        "weight": 0.7
      },
      "15": {
        "text": "看不清",
        "weight": 0.67
      },
      "16": {
        "text": "現代意象",
        "weight": 0.57
      }
    },
    "source_ref": "1,15,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 89,
    "symbol": "洪水",
    "alias_list": [
      "大水"
    ],
    "book_interpret_json": {
      "1": {
        "text": "情緒爆發",
        "weight": 0.7
      },
      "3": {
        "text": "無意識衝擊",
        "weight": 0.8
      },
      "10": {
        "text": "水原型",
        "weight": 0.77
      }
    },
    "source_ref": "1,3,10",
    "notes": "動作,噩夢",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 90,
    "symbol": "火災",
    "alias_list": [
      "起火",
      "火"
    ],
    "book_interpret_json": {
      "1": {
        "text": "憤怒、淨化",
        "weight": 0.7
      },
      "10": {
        "text": "火原型",
        "weight": 0.74
      },
      "16": {
        "text": "跨文化：毀滅與淨化",
        "weight": 0.59
      }
    },
    "source_ref": "1,10,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  },
  {
    "symbol_id": 91,
    "symbol": "地震",
    "alias_list": [
      "地動"
    ],
    "book_interpret_json": {
      "1": {
        "text": "根基動搖",
        "weight": 0.7
      },
      "15": {
        "text": "安全感崩塌",
        "weight": 0.67
      },
      "22": {
        "text": "創傷夢常見",
        "weight": 0.44
      }
    },
    "source_ref": "1,15,22",
    "notes": "動作,噩夢",
    "tag_ids": [
      5,
      6
    ]
  },
  {
    "symbol_id": 92,
    "symbol": "裸體",
    "alias_list": [
      "光身",
      "赤身"
    ],
    "book_interpret_json": {
      "1": {
        "text": "暴露、無防備",
        "weight": 0.7
      },
      "4": {
        "text": "本我真實",
        "weight": 0.6
      },
      "16": {
        "text": "跨文化：羞恥與真實",
        "weight": 0.59
      }
    },
    "source_ref": "1,4,16",
    "notes": "動作",
    "tag_ids": [
      5
    ]
  }
];
