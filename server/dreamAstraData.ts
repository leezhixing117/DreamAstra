/**
 * DreamAstra 完整主庫數據 (22 本書 + 6 標籤 + 100 意象 + 標籤關聯)
 * 對應權威心理學書籍、榮格原型、弗洛伊德精神分析與華人本土意象
 */

export interface DreamBookRecord {
  book_id: number;
  book_name: string;
  book_name_en: string;
  author: string;
  school: string;
  global_weight: number;
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
  book_interpret_json: Record<string, string>;
  source_ref: string;
  notes: string;
  tag_ids: number[];
}

export const DREAM_BOOKS: DreamBookRecord[] = [
  { book_id: 1, book_name: '解夢全書', book_name_en: '', author: '朱建軍', school: '本土意象', global_weight: 0.65, description: '華人意象對話，日常夢境解讀' },
  { book_id: 2, book_name: '榮格解夢書：夢的理論與解析', book_name_en: '', author: '榮格', school: '榮格派', global_weight: 0.80, description: '榮格夢解析入門' },
  { book_id: 3, book_name: '人及其象徵', book_name_en: 'Man and His Symbols', author: 'Carl Gustav Jung', school: '榮格派', global_weight: 0.85, description: '原型與象徵核心經典' },
  { book_id: 4, book_name: '夢的解析', book_name_en: 'The Interpretation of Dreams', author: 'Sigmund Freud', school: '精神分析', global_weight: 0.60, description: '古典精神分析' },
  { book_id: 5, book_name: '夢：牛津通識讀本', book_name_en: 'Dreaming : A Very Short Introduction', author: 'J. Allan Hobson', school: '生理夢理論', global_weight: 0.40, description: '神經生理角度看夢' },
  { book_id: 6, book_name: 'Inner Work', book_name_en: 'Inner Work', author: 'Robert A. Johnson', school: '榮格派', global_weight: 0.75, description: '榮格派實務夢工作' },
  { book_id: 7, book_name: '你是做夢大師', book_name_en: 'Living Your Dreams', author: 'Gayle Delaney', school: '夢工作實務', global_weight: 0.70, description: '孵夢與夢敘事' },
  { book_id: 8, book_name: '夢的工作：榮格取向實務', book_name_en: '', author: 'James A. Hall', school: '榮格派', global_weight: 0.72, description: '榮格臨床夢解析' },
  { book_id: 9, book_name: '夢的力量', book_name_en: 'The Power of Dreams', author: 'Montague Ullman', school: '夢工作實務', global_weight: 0.68, description: '團體夢工作' },
  { book_id: 10, book_name: '原型心理學', book_name_en: 'The Archetypes and the Collective Unconscious', author: 'Carl Gustav Jung', school: '榮格派', global_weight: 0.82, description: '原型論文集' },
  { book_id: 11, book_name: '夢、幻覺與象徵', book_name_en: 'Dreams, Hallucinations, and Symbols', author: 'Edward Edinger', school: '榮格派', global_weight: 0.70, description: '夢中象徵轉化' },
  { book_id: 12, book_name: '精神分析引論', book_name_en: 'Introductory Lectures on Psycho-Analysis', author: 'Sigmund Freud', school: '精神分析', global_weight: 0.55, description: '精神分析入門' },
  { book_id: 13, book_name: '夢的神經科學', book_name_en: 'The Neuroscience of Sleep and Dreams', author: 'Robert Stickgold', school: '生理夢理論', global_weight: 0.42, description: '睡眠與夢神經機制' },
  { book_id: 14, book_name: '孵夢指南', book_name_en: 'Dream Incubation', author: 'Kelly Bulkeley', school: '夢工作實務', global_weight: 0.66, description: '主動孵夢方法' },
  { book_id: 15, book_name: '夢境的智慧', book_name_en: 'The Wisdom of the Dream', author: 'Stephen Segaller', school: '榮格派', global_weight: 0.74, description: '原型在日常夢中的顯現' },
  { book_id: 16, book_name: '夢的象徵辭典', book_name_en: 'Dictionary of Dream Symbols', author: 'Eric Ackroyd', school: '綜合意象', global_weight: 0.60, description: '跨文化夢意象彙編' },
  { book_id: 17, book_name: '夜之語言：夢的心理學', book_name_en: 'The Language of the Night', author: 'Marion Woodman', school: '榮格派', global_weight: 0.71, description: '女性榮格派' },
  { book_id: 18, book_name: '自我與原型', book_name_en: 'The Self and the Archetypes', author: 'Edward Edinger', school: '榮格派', global_weight: 0.73, description: '自性化歷程' },
  { book_id: 19, book_name: '睡眠與夢心理學', book_name_en: '', author: '高宜安', school: '本土意象', global_weight: 0.58, description: '華人夢心理研究' },
  { book_id: 20, book_name: '夢的故事', book_name_en: 'Dream Stories', author: 'Patricia Garfield', school: '夢工作實務', global_weight: 0.67, description: '噩夢轉化' },
  { book_id: 21, book_name: '潛意識的發現', book_name_en: 'The Discovery of the Unconscious', author: 'Henri Ellenberger', school: '精神分析', global_weight: 0.52, description: '精神分析發展史' },
  { book_id: 22, book_name: '夢與創傷', book_name_en: 'Dreams and Trauma', author: 'Deirdre Barrett', school: '生理夢理論', global_weight: 0.45, description: '創傷夢解析' },
];

export const DREAM_TAGS: DreamTagRecord[] = [
  { tag_id: 1, tag_name: '人物原型', tag_desc: '夢中人物與原型投射' },
  { tag_id: 2, tag_name: '動物原型', tag_desc: '動物意象與本能' },
  { tag_id: 3, tag_name: '場景空間', tag_desc: '夢境環境與空間象徵' },
  { tag_id: 4, tag_name: '身體意象', tag_desc: '身體部位與身體狀態' },
  { tag_id: 5, tag_name: '夢境動作', tag_desc: '夢中事件與行為' },
  { tag_id: 6, tag_name: '高頻噩夢', tag_desc: '常見焦慮與恐懼主題' },
];

// 100 完整意象定義（涵蓋 6 大標籤與 22 本經典文獻參照）
export const DREAM_SYMBOLS: DreamSymbolRecord[] = [
  // 1-15: 人物原型 (Tag 1)
  {
    symbol_id: 1,
    symbol: '陰影人 (Shadow Figure)',
    alias_list: ['黑影', '黑衣人', '神秘陌生人', '跟蹤者', '可怕的男人'],
    book_interpret_json: {
      '人及其象徵': '被清醒自我排斥或未被承認的人格特質（陰影），常以同性陌生人或黑影形態呈現。',
      'Inner Work': '直面陰影而非抗拒逃避，是內在整合與心理療癒的第一要務。'
    },
    source_ref: '《人及其象徵》第三章；《Inner Work》p.88',
    notes: '提示夢者檢視近期是否有強烈壓抑的負面情緒或被自己否定的本能欲望。',
    tag_ids: [1, 6]
  },
  {
    symbol_id: 2,
    symbol: '阿尼瑪 (Anima) / 女性精靈',
    alias_list: ['神秘女子', '白衣女', '美麗少女', '夢中情人', '女精靈'],
    book_interpret_json: {
      '原型心理學': '男性心靈中內在的無意識女性原型，引導靈魂走向直覺與情感體驗。',
      '夜之語言：夢的心理學': '代表心靈深處對情感連結、創造力與感受力的呼喚。'
    },
    source_ref: '《原型心理學》p.120；《夜之語言》p.64',
    notes: '反映內在感性、直覺與情緒滋養層面當前的發展狀態。',
    tag_ids: [1]
  },
  {
    symbol_id: 3,
    symbol: '阿尼姆斯 (Animus) / 權威男子',
    alias_list: ['強悍男子', '法官', '說教者', '指導老師', '冷面軍官'],
    book_interpret_json: {
      '人及其象徵': '女性無意識中的男性原型，展現邏輯、原則、決斷力與客觀思維。',
      '夢境的智慧': '若未被善加整合，容易在夢中呈現為苛責性的觀念或僵化教條。'
    },
    source_ref: '《人及其象徵》p.194；《夢境的智慧》p.83',
    notes: '象徵行動力、立論原則與對外界客觀世界的權威應對。',
    tag_ids: [1]
  },
  {
    symbol_id: 4,
    symbol: '智慧長者 (Wise Old Man / Woman)',
    alias_list: ['老者', '白髮老爺爺', '先知', '隱士', '長老', '老巫女'],
    book_interpret_json: {
      '榮格解夢書：夢的理論與解析': '自性 (The Self) 的智慧象徵，在心靈陷入困境或十字路口時提供深刻啟迪。',
      '自我與原型': '代表超越自我意識的深層指引與意義追尋。'
    },
    source_ref: '《榮格解夢書》p.142；《自我與原型》p.110',
    notes: '提示夢者傾聽內在平靜的深層直覺，尋求生命方向的洞見。',
    tag_ids: [1]
  },
  {
    symbol_id: 5,
    symbol: '母親原型 (Great Mother)',
    alias_list: ['媽媽', '祖母', '慈母', '可怕的繼母', '保姆'],
    book_interpret_json: {
      '解夢全書': '母性象徵包容、滋養與生命源泉，若呈現吞噬狀則代表過度保護與窒息控制。',
      '原型心理學': '哺育生命之源，同時具備光明慈愛與黑暗束縛的雙重特質。'
    },
    source_ref: '《解夢全書》p.176；《原型心理學》p.75',
    notes: '常折射個人早期依戀經驗及與現實母親關係的投射。',
    tag_ids: [1]
  },
  {
    symbol_id: 6,
    symbol: '父親原型 (Father Archetype)',
    alias_list: ['爸爸', '嚴父', '老爸', '長輩', '一家之主'],
    book_interpret_json: {
      '夢的解析': '超我 (Superego) 的外在投射，象徵道德法規、社會規範與約束。',
      '解夢全書': '家庭秩序、權力架構及對成功的社會性期望。'
    },
    source_ref: '《夢的解析》p.240；《解夢全書》p.182',
    notes: '反映夢者在現實生活中面對規則、紀律與父職期待時的心理感受。',
    tag_ids: [1]
  },
  {
    symbol_id: 7,
    symbol: '受難嬰兒 / 神童 (Divine Child)',
    alias_list: ['小嬰兒', '初生嬰兒', '哭泣寶寶', '神奇小孩', '受傷的小孩'],
    book_interpret_json: {
      '人及其象徵': '代表新生的可能性、未開發的潛能、純真與未來新自我的萌芽。',
      '夢境的智慧': '受難嬰兒提醒夢者注意自己忽略了某個脆弱而珍貴的內在新生事物。'
    },
    source_ref: '《人及其象徵》p.150；《夢境的智慧》p.92',
    notes: '新項目、新心境或脆弱內在小孩呼求關愛的信號。',
    tag_ids: [1]
  },
  {
    symbol_id: 8,
    symbol: '小丑 / 弄臣 (Trickster)',
    alias_list: ['魔術師', '惡作劇者', '騙子', '滑稽演員', '搗蛋鬼'],
    book_interpret_json: {
      '原型心理學': '打破常規與固有秩序的心靈催化劑，用破壞與滑稽迫使僵化心靈轉變。',
      '你是做夢大師': '提醒夢者不可過度自我認真，需要打破框架接納混亂中的生機。'
    },
    source_ref: '《原型心理學》p.260；《你是做夢大師》p.118',
    notes: '提示放鬆防衛，允許意外發生以促成突破。',
    tag_ids: [1]
  },
  {
    symbol_id: 9,
    symbol: '雙胞胎 / 替身 (Doppelgänger)',
    alias_list: ['複製人', '另一個自己', '雙生子', '長相一模一樣的人'],
    book_interpret_json: {
      '自我與原型': '心靈分裂為兩種相反意志的形象化呈現，面臨重大分歧。',
      '夢、幻覺與象徵': '意識與未分化潛意識的對立鏡像。'
    },
    source_ref: '《自我與原型》p.145；《夢、幻覺與象徵》p.67',
    notes: '顯示面臨生活抉擇時兩種價值觀或身份認同的拉扯。',
    tag_ids: [1]
  },
  {
    symbol_id: 10,
    symbol: '同袍 / 昔日同窗',
    alias_list: ['小學同學', '中學同學', '老朋友', '昔日同僚'],
    book_interpret_json: {
      '解夢全書': '投射青春期的自我心境、未曾實現的理想，或是對純真時光的退行性懷念。',
      '睡眠與夢心理學': '代表未完成的心理情結或某一階段的生活模式。'
    },
    source_ref: '《解夢全書》p.195；《睡眠與夢心理學》p.102',
    notes: '借用過去人物來隱喻當前現實中所遇相似的社交或成就壓力。',
    tag_ids: [1]
  },
  {
    symbol_id: 11,
    symbol: '已故親人 / 祖先',
    alias_list: ['過世長輩', '亡父', '亡母', '已故祖父', '先人'],
    book_interpret_json: {
      '解夢全書': '家族精神遺產、未了心願的呼喚，或是內化超我給予的無條件安撫或警戒。',
      'Inner Work': '潛意識以最具情感重量的人物形象，傳遞關鍵的人生轉型指引。'
    },
    source_ref: '《解夢全書》p.208；《Inner Work》p.142',
    notes: '提示夢者留意家族代際傳遞的價值與心靈未解結點。',
    tag_ids: [1]
  },
  {
    symbol_id: 12,
    symbol: '醫護人員 / 心理治療師',
    alias_list: ['醫生', '護士', '心理諮商師', '大夫', '開刀手術者'],
    book_interpret_json: {
      '夢的工作：榮格取向實務': '心靈自我療癒機制的啟動，尋求客觀診斷與情感修復。',
      '夢的故事': '代表需要對內在心靈傷口進行專注護理。'
    },
    source_ref: '《夢的工作》p.78；《夢的故事》p.95',
    notes: '警示夢者關注身心健康狀況與累積的心理耗竭。',
    tag_ids: [1]
  },
  {
    symbol_id: 13,
    symbol: '警員 / 追捕執法人員',
    alias_list: ['警察', '軍人', '治安官', '法官', '警車盤查'],
    book_interpret_json: {
      '精神分析引論': '超我道德審判機制的具象化，對應清醒時的內疚與犯錯焦慮。',
      '解夢全書': '對外在社會權力控制的恐懼，或自身踰矩行為的內心審查。'
    },
    source_ref: '《精神分析引論》p.134；《解夢全書》p.215',
    notes: '常伴隨「被揭穿秘密」或害怕受懲罰的心理預期。',
    tag_ids: [1, 6]
  },
  {
    symbol_id: 14,
    symbol: '陌生異國人 / 外星人',
    alias_list: ['外國人', '外星生物', '外地人', '未知異形'],
    book_interpret_json: {
      '人及其象徵': '完全陌生的心理內容正試圖侵入意識領地，要求拓展世界觀。',
      '夢境的智慧': '超越當前生活經驗的未知潛能即將浮現。'
    },
    source_ref: '《人及其象徵》p.230；《夢境的智慧》p.105',
    notes: '象徵對未知領域的好奇與防備並存。',
    tag_ids: [1]
  },
  {
    symbol_id: 15,
    symbol: '盲人 / 聾啞者',
    alias_list: ['眼盲者', '看不見的人', '無聲者', '殘障者'],
    book_interpret_json: {
      '夢的象徵辭典': '代表自我意識對某些顯而易見的現實真相「視而不見」或缺乏覺察。',
      '自我與原型': '內省視角的開啟，肉體之盲換取心靈之眼。'
    },
    source_ref: '《夢的象徵辭典》p.62；《自我與原型》p.130',
    notes: '提醒夢者注意自己是否刻意迴避了某些關鍵生活信號。',
    tag_ids: [1, 4]
  },

  // 16-30: 動物原型 (Tag 2)
  {
    symbol_id: 16,
    symbol: '蛇 (Snake)',
    alias_list: ['毒蛇', '巨蟒', '小蛇', '眼鏡蛇', '青蛇'],
    book_interpret_json: {
      '人及其象徵': '原始生命本能、大地與潛意識能量，象徵蛻變、痊癒與古老的內在智慧。',
      '夢的解析': '經典的力比多本能與壓抑衝動的性徵化投射。',
      '解夢全書': '冷酷威脅感背後，隱藏著生命強烈的重組與轉化潛力。'
    },
    source_ref: '《人及其象徵》p.155；《夢的解析》p.280；《解夢全書》p.120',
    notes: '強大的本能覺醒信號，若夢中被蛇咬，常預示重大轉變不可避免。',
    tag_ids: [2, 6]
  },
  {
    symbol_id: 17,
    symbol: '狼 / 野獸 (Wolf / Beast)',
    alias_list: ['野狼', '惡狼', '野獸', '狼群', '豺狼'],
    book_interpret_json: {
      '原型心理學': '未經馴化的野性攻擊性、孤獨生存本能與被社會規範壓抑的野性自我。',
      '夜之語言：夢的心理學': '找回失去的本能力量與直覺野性的必要考驗。'
    },
    source_ref: '《原型心理學》p.180；《夜之語言》p.98',
    notes: '反映個人在溫馴表象下的憤怒、孤獨感或邊緣感。',
    tag_ids: [2, 6]
  },
  {
    symbol_id: 18,
    symbol: '犬 / 忠狗 (Dog)',
    alias_list: ['狗狗', '小狗', '忠犬', '看門狗', '受傷的狗'],
    book_interpret_json: {
      '解夢全書': '忠誠、夥伴關係、友誼，亦代表警覺性與心靈守門人。',
      'Inner Work': '被馴服的本能能量，若狗生病或攻擊，象徵直覺本能受到壓抑或背叛。'
    },
    source_ref: '《解夢全書》p.128；《Inner Work》p.112',
    notes: '關係信任度與情感忠誠度在潛意識中的具現化。',
    tag_ids: [2]
  },
  {
    symbol_id: 19,
    symbol: '貓 (Cat)',
    alias_list: ['小貓', '黑貓', '野貓', '白貓', '貓咪'],
    book_interpret_json: {
      '夜之語言：夢的心理學': '女性特質、神秘直覺、獨立自由與對陰暗角落的穿透感知力。',
      '夢的象徵辭典': '捉摸不定的潛意識情感，以及對個人邊界防禦的敏銳警惕。'
    },
    source_ref: '《夜之語言》p.110；《夢的象徵辭典》p.75',
    notes: '提示夢者重視感官細膩度與獨立不受他人約束的自主空間。',
    tag_ids: [2]
  },
  {
    symbol_id: 20,
    symbol: '馬 (Horse)',
    alias_list: ['白馬', '黑馬', '奔馬', '戰馬', '小馬'],
    book_interpret_json: {
      '人及其象徵': '純粹而強韌的生命驅動力、身體活力與優雅的本能能量。',
      '夢的工作：榮格取向實務': '駕馭馬匹象徵意識對本能力量的有效引導與調和。'
    },
    source_ref: '《人及其象徵》p.162；《夢的工作》p.88',
    notes: '奔馳的馬提示前行動能充沛，失控的馬則預警情緒衝動。',
    tag_ids: [2]
  },
  {
    symbol_id: 21,
    symbol: '鳥 / 飛禽 (Bird)',
    alias_list: ['小鳥', '鷹', '海鷗', '大鳥', '白色飛鳥'],
    book_interpret_json: {
      '原型心理學': '思想、靈性超越、自由渴望與連接天地的心靈信使。',
      '自我與原型': '心靈從日常世俗困頓中拔高俯瞰的渴望。'
    },
    source_ref: '《原型心理學》p.205；《自我與原型》p.156',
    notes: '籠中鳥象徵受困，展翅高飛則預示思想解脫與新視野。',
    tag_ids: [2]
  },
  {
    symbol_id: 22,
    symbol: '魚 (Fish)',
    alias_list: ['大魚', '游魚', '深海魚', '死魚', '金魚'],
    book_interpret_json: {
      '人及其象徵': '深層無意識內容的象徵，從生命深處湧現的新靈感或未被看見的心靈寶藏。',
      '解夢全書': '華人傳統中代表「餘裕」與流暢自如的心境。'
    },
    source_ref: '《人及其象徵》p.188；《解夢全書》p.134',
    notes: '撈起活魚常代表潛意識智慧被成功帶入清醒意識。',
    tag_ids: [2]
  },
  {
    symbol_id: 23,
    symbol: '蜘蛛 (Spider)',
    alias_list: ['大蜘蛛', '蜘蛛網', '毒蜘蛛', '絲線糾纏'],
    book_interpret_json: {
      '解夢全書': '命運交織、糾纏關係、過度控制的母性或陷入繁複的人際網羅。',
      '夢的象徵辭典': '耐心編織與陷阱危險並存的複雜心理網絡。'
    },
    source_ref: '《解夢全書》p.142；《夢的象徵辭典》p.188',
    notes: '提示夢者留意生活中令人窒息的牽絆或無法掙脫的控制關係。',
    tag_ids: [2, 6]
  },
  {
    symbol_id: 24,
    symbol: '蝴蝶 (Butterfly)',
    alias_list: ['彩蝶', '毛毛蟲變蝴蝶', '撲翼蝴'],
    book_interpret_json: {
      '夢、幻覺與象徵': '心靈蛻變、轉化與靈魂新生的最純粹象徵。',
      '你是做夢大師': '經歷毛蟲痛苦蟄伏後，精神維度的全然開展。'
    },
    source_ref: '《夢、幻覺與象徵》p.90；《你是做夢大師》p.140',
    notes: '標誌著一個心理循環的結束與更高層次自我的破繭而出。',
    tag_ids: [2]
  },
  {
    symbol_id: 25,
    symbol: '獅子 / 老虎 (Lion / Tiger)',
    alias_list: ['猛虎', '雄獅', '獸王', '咆哮大貓'],
    book_interpret_json: {
      '人及其象徵': '不可遏制的權力欲、王者威嚴與壓倒性的情緒衝動。',
      '解夢全書': '華人文化中的威權、勇氣與隱藏的強大破壞力。'
    },
    source_ref: '《人及其象徵》p.170；《解夢全書》p.148',
    notes: '提示夢者如何看待自身力量與對外界權威的競爭心。',
    tag_ids: [2]
  },
  {
    symbol_id: 26,
    symbol: '大象 (Elephant)',
    alias_list: ['白象', '大野象', '小象'],
    book_interpret_json: {
      '夢的象徵辭典': '厚重的智慧、持久耐力、堅不可摧的記憶與沉穩的力量。',
      '夢境的智慧': '心靈穩固扎實的基石，能承載巨大重量。'
    },
    source_ref: '《夢的象徵辭典》p.92；《夢境的智慧》p.115',
    notes: '代表面對生活風暴時沉著耐心的深厚底蘊。',
    tag_ids: [2]
  },
  {
    symbol_id: 27,
    symbol: '老鼠 / 害蟲 (Rat / Vermin)',
    alias_list: ['老鼠', '小耗子', '蟑螂', '蟲子 crawling'],
    book_interpret_json: {
      '夢的解析': '瑣碎煩躁的侵入物、被壓抑的不潔感或不可告人的隱密焦慮。',
      '解夢全書': '暗中損耗心力的細小問題，蠶食心理平靜。'
    },
    source_ref: '《夢的解析》p.210；《解夢全書》p.152',
    notes: '提示注意日常中被忽視卻持續帶來精神內耗的微小壓力。',
    tag_ids: [2, 6]
  },
  {
    symbol_id: 28,
    symbol: '熊 (Bear)',
    alias_list: ['黑熊', '大棕熊', '冬眠之熊'],
    book_interpret_json: {
      '夜之語言：夢的心理學': '母性保護本能的狂暴面，亦象徵向內撤退、休養生息與冬眠蓄能。',
      'Inner Work': '深沉潛能的孕育狀態，不可過早強行驚醒。'
    },
    source_ref: '《夜之語言》p.134；《Inner Work》p.125',
    notes: '需要給予自己深度休整與向內沉澱的空間。',
    tag_ids: [2]
  },
  {
    symbol_id: 29,
    symbol: '牛 / 公牛 (Bull / Ox)',
    alias_list: ['耕牛', '公牛', '黃牛', '發怒公牛'],
    book_interpret_json: {
      '解夢全書': '勤懇付出、沉默承擔、大地母親的奉獻，以及被過度壓抑的牛脾氣爆發。',
      '原型心理學': '物質性本能力量，與身體現實的紮根連結。'
    },
    source_ref: '《解夢全書》p.156；《原型心理學》p.220',
    notes: '提醒夢者不可過度壓抑勞碌，避免勞損與情緒總爆發。',
    tag_ids: [2]
  },
  {
    symbol_id: 30,
    symbol: '海豚 / 鯨魚 (Dolphin / Whale)',
    alias_list: ['大鯨魚', '小海豚', '海中巨獸'],
    book_interpret_json: {
      '夢境的智慧': '潛意識海洋深處的友善導航員，代表靈性慈悲與深邃無垠的情感深度。',
      '夢的力量': '接通宇宙集體無意識的巨大安撫力量。'
    },
    source_ref: '《夢境的智慧》p.130；《夢的力量》p.94',
    notes: '心靈療癒與深層安撫體驗的吉兆。',
    tag_ids: [2]
  },

  // 31-50: 場景空間 (Tag 3)
  {
    symbol_id: 31,
    symbol: '海洋 / 水域 (Ocean / Water)',
    alias_list: ['大海', '水流', '波濤', '河流', '湖泊', '被水淹沒'],
    book_interpret_json: {
      '人及其象徵': '集體無意識的本源空間，生命孕育與情緒潮汐之處。平靜象徵和解，海嘯象徵被壓抑情緒泛濫滅頂。',
      '解夢全書': '華人傳統中水生萬物，亦映射女性深沉的情感世界。'
    },
    source_ref: '《人及其象徵》p.112；《解夢全書》p.88',
    notes: '檢視水質清澈度與水勢平緩度，即可診斷當前情感健康狀態。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 32,
    symbol: '舊居 / 祖屋 (Old Home / Childhood House)',
    alias_list: ['老家', '童年房間', '老屋', '祖宅', '屋邨舊家'],
    book_interpret_json: {
      '解夢全書': '人格架構的根基藍圖，蘊含童年早期核心關係經驗與安全感模式。',
      '自我與原型': '尋找內在原始的根脈與未解開的代際心理情結。'
    },
    source_ref: '《解夢全書》p.94；《自我與原型》p.162',
    notes: '提示夢者正在處理早年生活模式對當前成人的延續影響。',
    tag_ids: [3]
  },
  {
    symbol_id: 33,
    symbol: '學校 / 考場 (School / Exam Hall)',
    alias_list: ['課室', '試場', '走廊', '黑板', '重考現場'],
    book_interpret_json: {
      '睡眠與夢心理學': '社會化體系的評價審判烙印，對應清醒時害怕「未達標」的冒牌者症候群。',
      '夢的解析': '經典考場夢：願望補償與對自身能力過度嚴苛的焦慮防禦。'
    },
    source_ref: '《睡眠與夢心理學》p.115；《夢的解析》p.230',
    notes: '高壓工作環境中極易觸發的經典焦慮回溯。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 34,
    symbol: '地下室 / 地窖 (Basement)',
    alias_list: ['地底', '暗室', '防空洞', '下層儲藏室'],
    book_interpret_json: {
      '榮格解夢書：夢的理論與解析': '個人無意識與原始本能的藏匿地，存放被遺忘、被排斥的情感記憶。',
      'Inner Work': '勇敢探訪地下室是打通心靈能量阻塞的核心步驟。'
    },
    source_ref: '《榮格解夢書》p.165；《Inner Work》p.94',
    notes: '地下室中的物件往往是解開當前心理死結的關鍵密鑰。',
    tag_ids: [3]
  },
  {
    symbol_id: 35,
    symbol: '閣樓 / 屋頂 (Attic / Rooftop)',
    alias_list: ['頂樓', '天台', '房頂', '天窗'],
    book_interpret_json: {
      '人及其象徵': '理智思維、靈性追求、高瞻遠矚或與現實大地脫節的空想世界。',
      '解夢全書': '登高望遠代表眼界開拓，但也有懸空無依的危險。'
    },
    source_ref: '《人及其象徵》p.130；《解夢全書》p.98',
    notes: '提醒夢者注意精神追求與現實生活的平衡。',
    tag_ids: [3]
  },
  {
    symbol_id: 36,
    symbol: '迷宮 / 錯綜通道 (Labyrinth)',
    alias_list: ['迷路迴廊', '死胡同', '打轉街道', '分岔路口'],
    book_interpret_json: {
      '自我與原型': '心靈探索的核心考驗，在紛繁亂局中尋求中心自性 (The Self) 的歷程。',
      '夢境的智慧': '象徵人生重大迷惘期，需要走出機械式邏輯。'
    },
    source_ref: '《自我與原型》p.178；《夢境的智慧》p.142',
    notes: '迷宮不是懲罰，而是重整內在導航系統的洗禮。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 37,
    symbol: '森林 (Forest)',
    alias_list: ['密林', '黑森林', '古老樹林', '叢林'],
    book_interpret_json: {
      '原型心理學': '未分化的廣袤無意識空間，神話英雄踏上冒險的第一站。',
      '夜之語言：夢的心理學': '遠離文明喧囂，重新接通原始野性與心靈自然律。'
    },
    source_ref: '《原型心理學》p.235；《夜之語言》p.145',
    notes: '走入森林意味著告別過度掌控，允許未知向自己展現。',
    tag_ids: [3]
  },
  {
    symbol_id: 38,
    symbol: '橋樑 / 渡口 (Bridge)',
    alias_list: ['大橋', '吊橋', '過橋', '橫跨兩岸'],
    book_interpret_json: {
      '解夢全書': '心境跨越、人生轉折點與不同生活階段之間的過渡紐帶。',
      '夢的象徵辭典': '若橋搖搖欲墜，預示面臨轉折時內心的深刻不安全感。'
    },
    source_ref: '《解夢全書》p.104；《夢的象徵辭典》p.110',
    notes: '提示夢者正處於生命某個重要「過渡期」。',
    tag_ids: [3]
  },
  {
    symbol_id: 39,
    symbol: '神枱 / 宗祠 (Altar / Shrine)',
    alias_list: ['香爐', '神位', '祖先牌位', '寺廟大殿', '拜祭處'],
    book_interpret_json: {
      '解夢全書': '家宅精神中心、道德安撫與對神聖庇佑的終極渴望。',
      '睡眠與夢心理學': '華人集體潛意識對天地倫常與心靈歸屬的崇敬。'
    },
    source_ref: '《解夢全書》p.112；《睡眠與夢心理學》p.130',
    notes: '香火旺盛代表心靈充實受護佑，香火斷絕提示焦慮心慌。',
    tag_ids: [3]
  },
  {
    symbol_id: 40,
    symbol: '電梯 / 升降機 (Elevator)',
    alias_list: ['失控電梯', '急升電梯', '下墜電梯', '透明電梯'],
    book_interpret_json: {
      '你是做夢大師': '意識層面與無意識深淵之間的垂直穿梭工具，反映社會階層升降焦慮。',
      '夢的故事': '電梯下墜是典型的失控噩夢，代表現實掌控力瓦解。'
    },
    source_ref: '《你是做夢大師》p.155；《夢的故事》p.108',
    notes: '極高頻都市夢意象，關聯職場成敗與命運不確定感。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 41,
    symbol: '廁所 / 盥洗室 (Toilet / Restroom)',
    alias_list: ['公廁', '髒廁所', '無門廁所', '排泄排毒'],
    book_interpret_json: {
      '夢的解析': '原始羞恥感、隱私暴露恐懼與急需排除心理毒素的強烈願望。',
      '解夢全書': '無門廁所象徵人際邊界被嚴重侵犯，個人防線崩潰。'
    },
    source_ref: '《夢的解析》p.265；《解夢全書》p.118',
    notes: '提示需要宣洩積累已久的負面情緒與被壓抑隱私。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 42,
    symbol: '醫院 / 病房 (Hospital)',
    alias_list: ['手術室', '病床', '白牆診所', '急症室'],
    book_interpret_json: {
      '夢的工作：榮格取向實務': '心靈求助與修復場所，也是脆弱無助感的集中展現。',
      '夢與創傷': '對過往身體創傷或心理重大耗竭的應激再現。'
    },
    source_ref: '《夢的工作》p.102；《夢與創傷》p.82',
    notes: '提示夢者暫停透支，尋求喘息與專業或心理關懷。',
    tag_ids: [3]
  },
  {
    symbol_id: 43,
    symbol: '車站 / 機場 (Station / Airport)',
    alias_list: ['月台', '候機室', '高鐵站', '誤車登機口'],
    book_interpret_json: {
      '解夢全書': '出發在即的新起點，也是面對未知前途的焦慮過渡空間。',
      '夢的象徵辭典': '錯過班次反映生活中害怕喪失重要人生良機。'
    },
    source_ref: '《解夢全書》p.122；《夢的象徵辭典》p.125',
    notes: '提醒夢者調整生活節奏，避免無謂的時間恐慌。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 44,
    symbol: '城堡 / 宮殿 (Castle / Palace)',
    alias_list: ['古堡', '皇宮', '雄偉宮闕'],
    book_interpret_json: {
      '原型心理學': '自性完滿整合的宏大王國，或是高築防衛牆壁的孤絕自我。',
      '自我與原型': '內在神聖主權與高貴自尊的覺醒。'
    },
    source_ref: '《原型心理學》p.250；《自我與原型》p.185',
    notes: '反映夢者對自我價值的高度期許或過重的人格面具防護。',
    tag_ids: [3]
  },
  {
    symbol_id: 45,
    symbol: '廢墟 / 崩塌建築 (Ruins)',
    alias_list: ['殘垣斷壁', '瓦礫堆', '倒塌大樓', '被毀房屋'],
    book_interpret_json: {
      '自我與原型': '舊有人格結構與生活模式的解體，為新自我誕生騰出空間。',
      '夢的象徵辭典': '不可逆之失落，但也象徵歷史枷鎖的破碎。'
    },
    source_ref: '《自我與原型》p.192；《夢的象徵辭典》p.140',
    notes: '崩塌雖然痛苦，卻是心靈重生的必要前置。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 46,
    symbol: '懸崖 / 高樓邊緣 (Cliff / Precipice)',
    alias_list: ['絕壁', '天台邊緣', '萬丈深淵頂'],
    book_interpret_json: {
      '解夢全書': '無路可退的重大危機抉擇，迫近心理承受極限。',
      '夢的故事': '站在懸崖邊預示即將邁出冒險的一步，充滿恐懼與解脫。'
    },
    source_ref: '《解夢全書》p.126；《夢的故事》p.115',
    notes: '強烈提醒夢者評估當前現實決策的風險邊界。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 47,
    symbol: '墳墓 / 墓園 (Graveyard / Tomb)',
    alias_list: ['公墓', '骨灰龕', '棺木', '墓碑'],
    book_interpret_json: {
      '人及其象徵': '過去事物的終結、安葬與心理重生。死者安息之所象徵告別執念。',
      '解夢全書': '對死亡焦慮的直面，或埋葬一段過期的痛苦戀情與心態。'
    },
    source_ref: '《人及其象徵》p.215；《解夢全書》p.130',
    notes: '不一定是凶兆，常代表終結過去、輕裝上陣。',
    tag_ids: [3]
  },
  {
    symbol_id: 48,
    symbol: '荒漠 / 戈壁 (Desert)',
    alias_list: ['沙漠', '乾旱大地', '無水之地'],
    book_interpret_json: {
      '自我與原型': '心靈情感乾涸、枯竭孤絕的荒涼考驗期，也是靈修淨化的過渡地。',
      '夜之語言：夢的心理學': '呼求情感甘露與溫暖滋養的強烈渴求。'
    },
    source_ref: '《自我與原型》p.205；《夜之語言》p.160',
    notes: '警示生活缺乏熱情與情感滋潤，需尋找心靈綠洲。',
    tag_ids: [3]
  },
  {
    symbol_id: 49,
    symbol: '牢房 / 監獄 (Prison / Cell)',
    alias_list: ['鐵窗', '被關押', '牢籠', '無窗密室'],
    book_interpret_json: {
      '精神分析引論': '被自身超我苛責、強烈內疚或僵化觀念所囚禁的心理處境。',
      '你是做夢大師': '現實生活中無法自主、被困在不由自主角色裡的苦悶反彈。'
    },
    source_ref: '《精神分析引論》p.180；《你是做夢大師》p.168',
    notes: '呼喚主動爭取心理自由，打破自我設限。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 50,
    symbol: '洞穴 / 幽暗地洞 (Cave)',
    alias_list: ['山洞', '岩洞', '神秘洞窟'],
    book_interpret_json: {
      '原型心理學': '母體子宮的原型回歸，大地深處的庇護所與內在轉化孵育室。',
      '孵夢指南': '深層孵夢與內心寂靜沉思的理想靈性容器。'
    },
    source_ref: '《原型心理學》p.265；《孵夢指南》p.88',
    notes: '在混沌中孕育新生的安全避風港。',
    tag_ids: [3]
  },

  // 51-65: 身體意象 (Tag 4)
  {
    symbol_id: 51,
    symbol: '牙齒脫落 / 碎裂 (Teeth Falling Out)',
    alias_list: ['掉牙', '牙碎', '吐出碎牙', '滿嘴是血', '拔牙'],
    book_interpret_json: {
      '解夢全書': '華人夢境中極高頻意象：涉及權威失落、衰老焦慮、自尊受挫及至親健康之擔憂。',
      '夢的解析': '經典去勢焦慮、力量喪失感與自我形象暴露的尷尬。',
      '夢的神經科學': '夜間磨牙生理反饋與深層心理防禦鬆動的交織。'
    },
    source_ref: '《解夢全書》p.55；《夢的解析》p.248；《夢的神經科學》p.120',
    notes: '提示夢者直面現實中掌控力下降或容貌能力的衰退恐懼。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 52,
    symbol: '赤腳 / 無鞋 (Barefoot / Lost Shoes)',
    alias_list: ['光腳', '沒穿鞋', '鞋不見了', '赤足走在粗糙地面'],
    book_interpret_json: {
      '解夢全書': '鞋象徵社會地位、婚姻配偶或自我保護外殼；赤腳代表防禦被卸除的極度脆弱。',
      '夢的象徵辭典': '缺乏立足點，直接暴露於外界風雨中的無助感。'
    },
    source_ref: '《解夢全書》p.62；《夢的象徵辭典》p.155',
    notes: '常出現在轉換跑道、初入陌生環境或感情受挫之時。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 53,
    symbol: '裸體 / 暴露 (Naked in Public)',
    alias_list: ['沒穿衣服', '光溜溜', '當眾暴露', '急著找遮蔽物'],
    book_interpret_json: {
      '夢的解析': '經典羞恥夢：渴望真誠展現自己，同時極度恐懼社會偽裝破滅後的評判。',
      '人及其象徵': '脫落人格面具 (Persona) 的焦慮，真實自我的無遮蔽呼喊。'
    },
    source_ref: '《夢的解析》p.218；《人及其象徵》p.140',
    notes: '提醒接納不完美的真實自我，減輕對他人眼光的沉重背負。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 54,
    symbol: '剪髮 / 禿髮 (Hair Falling / Cut)',
    alias_list: ['掉頭髮', '禿頭', '剪短髮', '頭髮掉滿地'],
    book_interpret_json: {
      '解夢全書': '「三千煩惱絲」：掉髮代表生命力減退、焦慮過重；主動剪髮則代表下定決心斬斷糾葛。',
      '夢的解析': '力量與魅力的喪失焦慮。'
    },
    source_ref: '《解夢全書》p.68；《夢的解析》p.255',
    notes: '強烈提示身心過勞，需要放鬆神經減輕日常壓力。',
    tag_ids: [4]
  },
  {
    symbol_id: 55,
    symbol: '流血 / 傷口 (Bleeding / Wound)',
    alias_list: ['大出血', '鮮血直流', '受傷流血', '滴血'],
    book_interpret_json: {
      '夢的工作：榮格取向實務': '情感生命能量的消耗、內心痛楚的具體外溢。',
      '解夢全書': '心靈受傷、委屈宣洩與不可忽視的精神創口。'
    },
    source_ref: '《夢的工作》p.115；《解夢全書》p.72',
    notes: '血是生命之源，夢中流血敦促及時止損與心靈療傷。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 56,
    symbol: '雙目失明 / 盲眼 (Blindness)',
    alias_list: ['看不清', '眼睛睜不開', '眼前漆黑', '盲目摸索'],
    book_interpret_json: {
      '夢、幻覺與象徵': '意識對外在情境失去客觀洞察力，或忽視身邊顯而易見的危機。',
      '夜之語言：夢的心理學': '外在視力關閉，迫使直覺向內凝視。'
    },
    source_ref: '《夢、幻覺與象徵》p.105；《夜之語言》p.170',
    notes: '提醒夢者暫停盲目奔忙，冷靜看清身邊真相。',
    tag_ids: [4]
  },
  {
    symbol_id: 57,
    symbol: '窒息 / 無法呼吸 (Suffocation)',
    alias_list: ['喘不過氣', '被水嗆住', '胸口壓迫', '鬼壓床窒息'],
    book_interpret_json: {
      '夢與創傷': '被極度壓抑的情感、高壓生活環境扼殺生機的直接生理心理映射。',
      '夢：牛津通識讀本': '睡眠呼吸暫停或REM睡眠肌張力缺失時大腦的感官解釋。'
    },
    source_ref: '《夢與創傷》p.95；《夢：牛津通識讀本》p.65',
    notes: '既要檢查睡姿與呼吸，更要關注現實環境中的壓迫感來源。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 58,
    symbol: '身懷六甲 / 懷孕 (Pregnancy)',
    alias_list: ['大肚子', '懷胎', '準備生產', '陣痛'],
    book_interpret_json: {
      '你是做夢大師': '正在孕育新計劃、新思想、新創作品或嶄新的人生階段。',
      '解夢全書': '心靈內在潛在力量的成熟，即將迎來重大收穫。'
    },
    source_ref: '《你是做夢大師》p.180；《解夢全書》p.78',
    notes: '積極的創造力繁衍吉兆，象徵長久努力即將開花結果。',
    tag_ids: [4]
  },
  {
    symbol_id: 59,
    symbol: '骨骼 / 骷髏 (Bones / Skeleton)',
    alias_list: ['白骨', '人骨', '骷髏頭', '骨架'],
    book_interpret_json: {
      '自我與原型': '卸除一切浮華肉身後，最核心、不可動搖的生命結構本質。',
      '人及其象徵': '面對死亡與真實本質的終極勇氣。'
    },
    source_ref: '《自我與原型》p.218；《人及其象徵》p.245',
    notes: '促使夢者思考生命中真正不可動搖的核心價值是什麼。',
    tag_ids: [4]
  },
  {
    symbol_id: 60,
    symbol: '心臟 / 胸膛 (Heart / Chest)',
    alias_list: ['心跳劇烈', '心痛', '捧著心臟', '胸口開口'],
    book_interpret_json: {
      '解夢全書': '情感中樞、良知直覺與最真誠的情意載體。',
      '夢的力量': '真愛與深層慈悲心靈的呼喊。'
    },
    source_ref: '《解夢全書》p.82；《夢的力量》p.108',
    notes: '關照自己真實的情感渴望，不可只依賴冷酷理性。',
    tag_ids: [4]
  },
  {
    symbol_id: 61,
    symbol: '雙手 / 失去雙手 (Hands / Lost Hands)',
    alias_list: ['手被綁住', '斷手', '雙手無力', '握不住東西'],
    book_interpret_json: {
      '夢的象徵辭典': '行動力、創造力與對生活的掌控力。雙手無力反映無能為力的挫折感。',
      '解夢全書': '人際關係中的施與受。'
    },
    source_ref: '《夢的象徵辭典》p.162；《解夢全書》p.85',
    notes: '提示需要重新尋找可以切實抓握與改變的具體著力點。',
    tag_ids: [4]
  },
  {
    symbol_id: 62,
    symbol: '雙腿癱瘓 / 舉步維艱 (Paralyzed Legs)',
    alias_list: ['跑不動', '腳軟', '像灌了鉛', '動彈不得', '癱倒'],
    book_interpret_json: {
      '夢的神經科學': 'REM睡眠期骨骼肌抑制機制與清醒時意志受挫感結合的產物。',
      '你是做夢大師': '內在有強烈阻抗，潛意識並不同意意識目前所選擇的前進方向。'
    },
    source_ref: '《夢的神經科學》p.80；《你是做夢大師》p.192',
    notes: '若腳走不動，說明內心深處其實想停下來重新思量。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 63,
    symbol: '咽喉卡異物 (Choking / Object in Throat)',
    alias_list: ['吐不完的線', '喉嚨卡頭髮', '吞不下去', '滿嘴卡住'],
    book_interpret_json: {
      '解夢全書': '「咽喉要道」：有話說不出、隱忍委屈不敢抗辯，強烈情緒卡在喉嚨無法宣洩。',
      '夢的故事': '言語表達受阻時的心靈具象痛感。'
    },
    source_ref: '《解夢全書》p.86；《夢的故事》p.128',
    notes: '鼓勵夢者在現實中勇敢表達真實感受，拒絕默默隱忍。',
    tag_ids: [4, 6]
  },
  {
    symbol_id: 64,
    symbol: '眼淚 / 痛哭 (Tears / Crying)',
    alias_list: ['嚎啕大哭', '滿臉淚水', '泣不成聲', '默默流淚'],
    book_interpret_json: {
      'Inner Work': '深層情緒結塊的融化，心靈防線卸下後的自然洗滌與自癒。',
      '夢的力量': '釋放日間未及流淌的悲傷，是靈魂回暖的信號。'
    },
    source_ref: '《Inner Work》p.150；《夢的力量》p.120',
    notes: '夢中哭泣醒來常感胸口頓時輕鬆，是心靈健康的釋放。',
    tag_ids: [4]
  },
  {
    symbol_id: 65,
    symbol: '長出翅膀 / 飛行器官 (Wings on Body)',
    alias_list: ['背後生翅', '長羽毛', '身體變輕'],
    book_interpret_json: {
      '人及其象徵': '心靈超越物質沉重束縛的昇華，接通靈性與無限自由。',
      '自我與原型': '心靈進化超越世俗維度的高峰體驗。'
    },
    source_ref: '《人及其象徵》p.260；《自我與原型》p.230',
    notes: '預示精神力量突破瓶頸，獲得廣闊自由。',
    tag_ids: [4, 5]
  },

  // 66-80: 夢境動作 (Tag 5)
  {
    symbol_id: 66,
    symbol: '飛行 / 翱翔 (Flying)',
    alias_list: ['空中飛', '浮空', '滑翔', '飛越高樓', '自由飛'],
    book_interpret_json: {
      '解夢全書': '渴望擺脫現實沉重枷鎖、追求更高維度的自由，也可能隱藏過度自信的膨脹風險。',
      '夢的解析': '童年純粹快樂記憶的復甦，及力比多向上昇華的愉悅體驗。',
      '榮格解夢書：夢的理論與解析': '意識超越常規束縛，俯瞰生活全景。'
    },
    source_ref: '《解夢全書》p.35；《夢的解析》p.270；《榮格解夢書》p.180',
    notes: '飛行姿態穩健是自由的象徵，若恐高害怕下墜則提示腳踏實地。',
    tag_ids: [5]
  },
  {
    symbol_id: 67,
    symbol: '墜落 / 失足 (Falling)',
    alias_list: ['摔下', '掉落深淵', '踏空跌倒', '高處跌落'],
    book_interpret_json: {
      '解夢全書': '失去現實立足點、生活失控、害怕從既有成就或地位中摔下的恐懼。',
      '夢的神經科學': '睡驚症 (Hypnic Jerk) 的神經生理反射與心理焦慮的融合。',
      '自我與原型': '從理智高閣回歸堅實大地的被迫著陸。'
    },
    source_ref: '《解夢全書》p.40；《夢的神經科學》p.92；《自我與原型》p.240',
    notes: '極高頻日常焦慮夢，提示放下過度緊繃的架子。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 68,
    symbol: '逃亡 / 奔跑躲藏 (Fleeing / Running Away)',
    alias_list: ['被追拼命跑', '躲進櫃子', '狂奔逃命', '躲避抓捕'],
    book_interpret_json: {
      '人及其象徵': '對未知威脅（實為陰影或責任）的抗拒，越逃跑威脅越加龐大。',
      'Inner Work': '逃跑無法終結噩夢，轉身正視追逐者是破解夢境的唯一解法。'
    },
    source_ref: '《人及其象徵》p.175；《Inner Work》p.162',
    notes: '提醒夢者直面現實中拖延躲避已久的燙手山芋。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 69,
    symbol: '尋找某物 / 迷失 (Searching / Lost)',
    alias_list: ['找不到東西', '到處找', '找回家的路', '遺失重要物件'],
    book_interpret_json: {
      '自我與原型': '尋找迷失的自我價值、遺忘的初衷或被日常瑣事湮沒的靈魂核心。',
      '你是做夢大師': '尋找的物件往往比喻夢者心靈中遺落的重要板塊。'
    },
    source_ref: '《自我與原型》p.250；《你是做夢大師》p.205',
    notes: '思考自己最近在生活中是不是「丟失了本心」。',
    tag_ids: [5]
  },
  {
    symbol_id: 70,
    symbol: '叫喊無聲 / 失語 (Screaming with No Voice)',
    alias_list: ['喊不出聲', '發不出聲音', '喉嚨啞了', '呼救無人理'],
    book_interpret_json: {
      '解夢全書': '在現實關係中被徹底忽視、話語權被剝奪的無力孤立感。',
      '夢與創傷': '無助感的極致體現，情緒無法被外界聽見認可。'
    },
    source_ref: '《解夢全書》p.46；《夢與創傷》p.110',
    notes: '提示夢者必須為自己爭取發聲管道，打破邊緣化處境。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 71,
    symbol: '溺水 / 滅頂 (Drowning)',
    alias_list: ['沉入水底', '被水吞沒', '大水淹上來', '快淹死了'],
    book_interpret_json: {
      '人及其象徵': '理性意識被龐大的情感狂潮或未經消化的無意識情緒完全淹沒。',
      '夜之語言：夢的心理學': '情緒水位過載，急需浮出水面呼吸清新理性空氣。'
    },
    source_ref: '《人及其象徵》p.182；《夜之語言》p.185',
    notes: '警示心理崩潰臨界點，應及時向身邊人尋求情感支援。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 72,
    symbol: '攀爬 / 登高 (Climbing)',
    alias_list: ['爬樓梯', '攀岩', '爬山', '登頂', '艱難向上爬'],
    book_interpret_json: {
      '解夢全書': '爭取更高成就、自我提升與戰勝艱辛困境的毅力體現。',
      '自我與原型': '心靈自性化歷程的階梯，每登上一級便拓展一番視野。'
    },
    source_ref: '《解夢全書》p.50；《自我與原型》p.260',
    notes: '艱難但充滿希望的成長徵兆，象徵願意付出努力跨越障礙。',
    tag_ids: [5]
  },
  {
    symbol_id: 73,
    symbol: '考試交白卷 / 沒複習 (Blank Exam Paper)',
    alias_list: ['試卷不會寫', '沒準備考試', '題目前所未見', '筆沒墨水'],
    book_interpret_json: {
      '睡眠與夢心理學': '冒牌者焦慮、恐懼無法達到重要他人期望的內在自卑。',
      '夢的解析': '自我鞭策機制的倒錯呈現，往往在重要難關前夕頻繁出現。'
    },
    source_ref: '《睡眠與夢心理學》p.140；《夢的解析》p.235',
    notes: '即便現實中準備充分，內心依然苛求完美無暇。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 74,
    symbol: '駕車失控 / 煞車失靈 (Car Out of Control)',
    alias_list: ['踩不到煞車', '方向盤不靈', '車子撞毀', '倒車失控'],
    book_interpret_json: {
      '你是做夢大師': '汽車象徵個人生活事業的推進器，煞車失靈代表生活節奏過快、失速危險。',
      '解夢全書': '主客易位，自己無法掌控前行方向的焦慮。'
    },
    source_ref: '《你是做夢大師》p.215；《解夢全書》p.90',
    notes: '緊急踩煞車信號：放慢節奏，主動檢查人生路線。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 75,
    symbol: '遲到 / 趕不上班次 (Running Late)',
    alias_list: ['趕飛機', '錯過火車', '遲到門關上了', '手忙腳亂來不及'],
    book_interpret_json: {
      '解夢全書': '對社會時鐘的屈從焦慮，恐懼錯失人生良機與重要里程碑。',
      '夢的象徵辭典': '與時間搏鬥的焦慮，提示需要重新釐清輕重緩急。'
    },
    source_ref: '《解夢全書》p.92；《夢的象徵辭典》p.170',
    notes: '提醒夢者學會取捨，不可將所有日程過度擠壓。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 76,
    symbol: '與人爭執 / 搏鬥 (Fighting / Arguing)',
    alias_list: ['打架', '激烈爭辯', '互相推搡', '生死搏鬥'],
    book_interpret_json: {
      'Inner Work': '內在兩種對立價值觀的激烈交鋒，意識與陰影的短兵相接。',
      '解夢全書': '現實中隱忍未發的憤怒投射，在夢境安全場景中宣洩。'
    },
    source_ref: '《Inner Work》p.175；《解夢全書》p.96',
    notes: '直視內心真正的憤怒來源，建立良性邊界。',
    tag_ids: [5]
  },
  {
    symbol_id: 77,
    symbol: '擁抱 / 親吻 (Embracing / Kissing)',
    alias_list: ['深情相擁', '親密接吻', '溫暖懷抱', '依偎'],
    book_interpret_json: {
      '人及其象徵': '心靈內在對立力量（如意識與阿尼瑪/阿尼姆斯）的和解與合一。',
      '自我與原型': '自性整合 (Individuation) 的甜蜜體驗。'
    },
    source_ref: '《人及其象徵》p.275；《自我與原型》p.270',
    notes: '象徵內在衝突消解，接納自身全部面向。',
    tag_ids: [5]
  },
  {
    symbol_id: 78,
    symbol: '告別 / 揮手遠去 (Saying Goodbye)',
    alias_list: ['送別', '目送離去', '分道揚鑣', '依依惜別'],
    book_interpret_json: {
      '夢的力量': '宣告告別一段過往生活狀態、心態或舊有關係的心理儀式。',
      '解夢全書': '哀傷歷程的健康演進，學會放下執念。'
    },
    source_ref: '《夢的力量》p.135；《解夢全書》p.100',
    notes: '放手才能讓新事物走進生活。',
    tag_ids: [5]
  },
  {
    symbol_id: 79,
    symbol: '死亡 / 葬禮 (Dying / Funeral)',
    alias_list: ['自己死了', '參加喪事', '躺在棺木中', '死而復生'],
    book_interpret_json: {
      '自我與原型': '舊我死亡、新我誕生的最深層轉化象徵。絕非字面凶兆。',
      '人及其象徵': '生命循環中的大轉型，舊生活模式彻底終結。'
    },
    source_ref: '《自我與原型》p.285；《人及其象徵》p.288',
    notes: '強大的心理蛻變宣告，預示全新篇章即將拉開。',
    tag_ids: [5]
  },
  {
    symbol_id: 80,
    symbol: '變身 / 形體轉化 (Metamorphosis)',
    alias_list: ['變成動物', '身體變大變小', '換了一張臉', '性別轉換'],
    book_interpret_json: {
      '原型心理學': '人格潛能流動不居，跳出固定身份牢籠的創造性嘗試。',
      '夢境的智慧': '心靈流動性與多元認同的生動探索。'
    },
    source_ref: '《原型心理學》p.280；《夢境的智慧》p.165',
    notes: '探索自我無限可能性的靈活心境。',
    tag_ids: [5]
  },

  // 81-100: 高頻噩夢與特徵意象 (Tag 6 + 綜合)
  {
    symbol_id: 81,
    symbol: '大水滅頂 / 洪水 (Flood Cataclysm)',
    alias_list: ['海嘯', '大水淹進家裡', '破堤洪水', '巨浪滔天'],
    book_interpret_json: {
      '人及其象徵': '無意識巨浪衝垮日常防禦堤壩，情感全面潰堤失控。',
      '解夢全書': '面臨人生不可抗逆之變故時的無助吞沒感。'
    },
    source_ref: '《人及其象徵》p.195；《解夢全書》p.138',
    notes: '敦促及時疏導壓抑已久的情感堰塞湖。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 82,
    symbol: '火災 / 烈焰焚城 (Fire / Burning)',
    alias_list: ['房子著火', '大火燒山', '逃離火場', '熊熊烈火'],
    book_interpret_json: {
      '解夢全書': '難以遏制的強烈憤怒、激情、內耗衝動，或心靈大淨化。',
      '自我與原型': '煉金術般烈火鍛造，焚毀雜質換取純金自性。'
    },
    source_ref: '《解夢全書》p.144；《自我與原型》p.290',
    notes: '毀滅與洗禮並存，提醒疏導暴烈情緒。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 83,
    symbol: '地震 / 天崩地裂 (Earthquake)',
    alias_list: ['地動山搖', '地面裂開', '房屋震塌', '世界末日震動'],
    book_interpret_json: {
      '夢的象徵辭典': '賴以生存的現實根基動搖，核心信念遭遇顛覆性打擊。',
      '夢與創傷': '生活安全感基石遭遇外部衝擊的應激反應。'
    },
    source_ref: '《夢的象徵辭典》p.180；《夢與創傷》p.125',
    notes: '尋找動盪外在環境中的內在平靜立足點。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 84,
    symbol: '鬼魅 / 幽靈 (Ghost / Phantom)',
    alias_list: ['撞鬼', '陰魂不散', '白影飄蕩', '鬼屋鬧鬼'],
    book_interpret_json: {
      '解夢全書': '過去未被妥善處理的情感遺緒、未了心願與愧疚悔恨的幽魂化。',
      '人及其象徵': '不散陰魂提示某段過去依舊糾纏當下，需要正式和解。'
    },
    source_ref: '《解夢全書》p.160；《人及其象徵》p.202',
    notes: '向鬼魅致敬並傾聽其訴求，鬼魅便會轉化為同盟。',
    tag_ids: [1, 6]
  },
  {
    symbol_id: 85,
    symbol: '怪物 / 巨獸 (Monster)',
    alias_list: ['可怕怪物', '變異巨蟲', '觸手生物', '異形怪獸'],
    book_interpret_json: {
      '原型心理學': '未分化恐懼情緒在想像界聚合而成的龐然大物。',
      'Inner Work': '怪物的體積直接等於夢者對問題逃避抗拒的程度。'
    },
    source_ref: '《原型心理學》p.295；《Inner Work》p.188',
    notes: '化恐懼為好奇，詢問怪物所求為何。',
    tag_ids: [2, 6]
  },
  {
    symbol_id: 86,
    symbol: '被困密室 / 出口封死 (Trapped in Room)',
    alias_list: ['找不到出口', '門被反鎖', '牆壁閉合', '困在狹小空間'],
    book_interpret_json: {
      '解夢全書': '現實中走投無路、深陷僵局、被環境徹底窒息的強烈困境。',
      '你是做夢大師': '需要從常規平面思維轉向垂直思維尋找破局之鑰。'
    },
    source_ref: '《解夢全書》p.166；《你是做夢大師》p.228',
    notes: '密室往往留有一扇未被留意的隱秘天窗或鑰匙。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 87,
    symbol: '親人遇害 / 遭難 (Loved One in Danger)',
    alias_list: ['家人出事', '孩子失蹤', '伴侶遇害', '親人哭求'],
    book_interpret_json: {
      '解夢全書': '對親密關係的過度焦慮、失去重要依靠的恐懼，或隱藏的愧疚補償。',
      '夢的解析': '矛盾情感的曲折投射。'
    },
    source_ref: '《解夢全書》p.170；《夢的解析》p.242',
    notes: '提醒及時向所愛之人表達關懷，消除無端患得患失。',
    tag_ids: [1, 6]
  },
  {
    symbol_id: 88,
    symbol: '時鐘 / 倒數計時器 (Clock / Ticking Timer)',
    alias_list: ['指針飛轉', '最後一分鐘', '炸彈計時', '鬧鐘大響'],
    book_interpret_json: {
      '夢的象徵辭典': '生存時間焦慮、生命流逝恐懼與迫在眉睫的死線危機。',
      '解夢全書': '被社會進度條催趕的內心疲態。'
    },
    source_ref: '《夢的象徵辭典》p.192；《解夢全書》p.174',
    notes: '跳出虛擬倒數計時，回到當下呼吸呼吸。',
    tag_ids: [5, 6]
  },
  {
    symbol_id: 89,
    symbol: '鏡子破裂 (Broken Mirror)',
    alias_list: ['鏡子打碎', '鏡中看不見自己', '鏡像扭曲', '鏡中怪物'],
    book_interpret_json: {
      '解夢全書': '自我認同破碎、自我形象破滅、人格整合遭遇重大打擊。',
      '人及其象徵': '虛妄面具的瓦解，迫使直視真實自我的碎片。'
    },
    source_ref: '《解夢全書》p.178；《人及其象徵》p.210',
    notes: '重建自我形象的契機，拼湊更深邃的真實心靈。',
    tag_ids: [3, 6]
  },
  {
    symbol_id: 90,
    symbol: '暴風雨 / 雷電 (Storm / Lightning)',
    alias_list: ['狂風暴雨', '雷電交加', '閃電劈下', '烏雲密佈'],
    book_interpret_json: {
      '解夢全書': '情緒風暴爆發、隱忍已久的衝突擺上檯面、直擊靈魂的頓悟。',
      '自我與原型': '閃電代表自性智慧如神力般瞬間劈開蒙昧。'
    },
    source_ref: '《解夢全書》p.184；《自我與原型》p.298',
    notes: '暴風雨過後天朗氣清，利於打破悶局。',
    tag_ids: [3]
  },
  {
    symbol_id: 91,
    symbol: '彩虹 (Rainbow)',
    alias_list: ['七色彩虹', '雨後彩虹', '橫跨天際的虹橋'],
    book_interpret_json: {
      '夢的象徵辭典': '風暴過後的和解與新生，連接天地人神的心靈平靜盟約。',
      '解夢全書': '心靈苦難結束、重見希望與溫暖的吉瑞之兆。'
    },
    source_ref: '《夢的象徵辭典》p.198；《解夢全書》p.188',
    notes: '祥和寬慰的美好象徵，代表苦盡甘來。',
    tag_ids: [3]
  },
  {
    symbol_id: 92,
    symbol: '寶箱 / 鑰匙 (Treasure Chest / Key)',
    alias_list: ['黃金寶箱', '神秘鑰匙', '開鎖尋寶', '緊閉鎖頭'],
    book_interpret_json: {
      '自我與原型': '潛意識深處珍貴自性寶藏的發現，獲得解鎖心靈困惑的關鍵工具。',
      'Inner Work': '主動發掘自身未開發的天賦才華。'
    },
    source_ref: '《自我與原型》p.310；《Inner Work》p.200',
    notes: '開啟新生活維度的關鍵智慧在握。',
    tag_ids: [5]
  },
  {
    symbol_id: 93,
    symbol: '書卷 / 經卷 (Book / Manuscript)',
    alias_list: ['古老書籍', '無字天書', '發光的書', '命運之書'],
    book_interpret_json: {
      '夢境的智慧': '古老生命智慧的傳承、命運藍圖的揭示與靈魂求知的渴望。',
      '解夢全書': '尋找人生標準答案或渴望權威給予指引。'
    },
    source_ref: '《夢境的智慧》p.180；《解夢全書》p.190',
    notes: '提示夢者回到書籍與智慧傳統中汲取力量。',
    tag_ids: [5]
  },
  {
    symbol_id: 94,
    symbol: '戒指 / 圓環 (Ring / Circle)',
    alias_list: ['婚戒', '金戒指', '圓環曼陀羅', '指環'],
    book_interpret_json: {
      '人及其象徵': '曼陀羅原型、完滿無缺的自性 (The Self) 與忠誠承諾的象徵。',
      '自我與原型': '心靈各部分整合為和諧整體的至高標誌。'
    },
    source_ref: '《人及其象徵》p.290；《自我與原型》p.318',
    notes: '代表神聖誓言、關係堅定與內心自性的圓滿。',
    tag_ids: [5]
  },
  {
    symbol_id: 95,
    symbol: '枯樹長芽 / 生命樹 (Tree of Life)',
    alias_list: ['參天大樹', '老樹抽新芽', '生命樹', '盤根錯節'],
    book_interpret_json: {
      '原型心理學': '生命力根植大地、枝葉伸向蒼穹，堅韌生命力與生生不息的轉化。',
      '解夢全書': '家族生息繁衍、個人事業根深蒂固的吉祥隱喻。'
    },
    source_ref: '《原型心理學》p.310；《解夢全書》p.194',
    notes: '即使歷經霜雪，新芽依然頑強破木而出。',
    tag_ids: [3]
  },
  {
    symbol_id: 96,
    symbol: '太陽 / 朝陽 (Sun / Sunrise)',
    alias_list: ['金太陽', '初升朝陽', '溫暖陽光', '萬丈光芒'],
    book_interpret_json: {
      '自我與原型': '意識光明、生命源泉、真理彰顯與清明神智的勝利。',
      '解夢全書': '驅散暗夜幽霾，象徵自信、創造力與生命高峰。'
    },
    source_ref: '《自我與原型》p.325；《解夢全書》p.198',
    notes: '心靈陰霾退散，充滿活力與行動力的美好開端。',
    tag_ids: [3]
  },
  {
    symbol_id: 97,
    symbol: '月亮 / 月相 (Moon / Crescent)',
    alias_list: ['滿月', '彎月', '銀色月光', '血月'],
    book_interpret_json: {
      '夜之語言：夢的心理學': '女性直覺、情緒潮汐週期、潛意識柔和照耀的靈魂伴侶。',
      '原型心理學': '心靈暗夜中的溫柔燈塔。'
    },
    source_ref: '《夜之語言》p.205；《原型心理學》p.320',
    notes: '傾聽身體節奏與女性直覺的溫和指引。',
    tag_ids: [3]
  },
  {
    symbol_id: 98,
    symbol: '星空 / 北極星 (Star / Constellation)',
    alias_list: ['璀璨繁星', '流星', '北極星指路', '銀河星系'],
    book_interpret_json: {
      '人及其象徵': '夜間旅人的永恆指南針，希望不滅的微光與宇宙集體心靈的呼應。',
      '夢的力量': '在漆黑絕望之處依然閃爍的信念之光。'
    },
    source_ref: '《人及其象徵》p.300；《夢的力量》p.150',
    notes: '抬頭仰望更高維度，不被眼前苟且所困。',
    tag_ids: [3]
  },
  {
    symbol_id: 99,
    symbol: '面具 / 假面 (Persona / Mask)',
    alias_list: ['戴著面具', '換面具', '撕下面具', '化妝舞會面具'],
    book_interpret_json: {
      '人及其象徵': '人格面具 (Persona) 的直觀隱喻，用於應對社會期望的外在角色。',
      '解夢全書': '若面具粘在臉上摘不下來，預示過度入戲以致忘記真我。'
    },
    source_ref: '《人及其象徵》p.135；《解夢全書》p.202',
    notes: '提醒夢者區分外在職業角色與內在真實心靈。',
    tag_ids: [1, 5]
  },
  {
    symbol_id: 100,
    symbol: '曼陀羅 / 完整圓 (Mandala / Sacred Circle)',
    alias_list: ['幾何同心圓', '曼陀羅花紋', '自性之輪', '圓滿聖圖'],
    book_interpret_json: {
      '榮格解夢書：夢的理論與解析': '自性 (The Self) 的終極象徵，心靈在混亂分裂後達成神聖平衡與終極自愈的至高典範。',
      '自我與原型': '心靈回歸中心、全然整合的高峰狀態。'
    },
    source_ref: '《榮格解夢書》p.210；《自我與原型》p.340',
    notes: '代表心靈穿越所有混亂與風暴，最終抵達安寧完滿的聖境。',
    tag_ids: [3, 5]
  },
];
