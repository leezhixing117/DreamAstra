export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  display_name?: string;
  role: UserRole;
  created_at?: string;
}

export interface DreamSymbol {
  symbol: string;
  meaning: string;
  culturalContext?: string; // 東方文化或本土生活象徵
}

export interface DreamPerspective {
  name: string;
  text: string;
}

export interface BookSource {
  book_title: string;
  page_start: number;
  page_end?: number;
}

export interface DetectiveQuestion {
  id: string;
  question: string;
  options: string[];
  selectedAnswer?: string;
}

export interface QuickAnalysis {
  title: string;
  simpleSummary: string;
  primarySymbol: {
    symbol: string;
    meaning: string;
  };
  quickTakeaway: string;
  suggestedQuestions: DetectiveQuestion[];
}

export interface FourLayerReading {
  asianCulturalLayer: {
    title: string;
    description: string;
    keywords: string[];
  };
  jungianLayer: {
    title: string;
    description: string;
    archetype: string;
  };
  personalLayer: {
    title: string;
    description: string;
  };
  integrationAction: {
    title: string;
    advice: string;
  };
}

export interface DreamReport {
  title: string;
  summary: string;
  symbols: DreamSymbol[];
  perspectives: DreamPerspective[];
  questions: string[];
  sources: BookSource[];
  fourLayers?: FourLayerReading;
  detectiveAnswers?: Record<string, string>;
  dnaContribution?: {
    dominantSymbol: string;
    dominantEmotion: string;
    themeDetected: string;
  };
}

export interface DreamEntry {
  id: string;
  title: string;
  dream_text: string;
  created_at: string;
  report_json: DreamReport;
  rawCantoneseTranscription?: string;
  tags?: string[];
}

export interface DreamDnaSymbol {
  name: string;
  count: number;
  category: 'element' | 'place' | 'character' | 'action';
  evolution: Array<{
    dreamId: string;
    dreamTitle: string;
    date: string;
    state: string; // e.g. "第一次：平靜", "第二次：洪水"
  }>;
}

export interface DreamDNA {
  totalDreams: number;
  symbols: DreamDnaSymbol[];
  emotionRatios: Array<{
    emotion: string;
    percentage: number;
    color: string;
  }>;
  recurringThemes: Array<{
    theme: string;
    count: number;
    description: string;
  }>;
  narrativeFingerprint: string;
  updatedAt: string;
}

export interface ConstellationNode {
  id: string;
  dreamId: string;
  title: string;
  date: string;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  primarySymbol: string;
  place?: string;
  character?: string;
  emotion: string;
  size: number;
  magnitude: number;
}

export interface ConstellationLink {
  sourceId: string;
  targetId: string;
  relationType: 'character' | 'place' | 'symbol' | 'emotion' | 'opposite_ending';
  relationLabel: string;
}

export interface ThirtyNightsClue {
  night: number;
  dreamId?: string;
  date: string;
  clueTitle: string;
  clueText: string;
  unlocked: boolean;
}

export interface ThirtyNightsJourney {
  completedNights: number;
  targetNights: number;
  currentStreak: number;
  clues: ThirtyNightsClue[];
  overallMysteryReport?: {
    title: string;
    coreMetaphor: string;
    deepSynthesis: string;
    subconsciousDirective: string;
  };
}

export interface DreamSynthesis {
  headline: string;
  summary: string;
  patterns: string[];
  next: string;
}

export interface BookBrainItem {
  id: string;
  title: string;
  file_name: string;
  status: 'queued' | 'processing' | 'ready' | 'error';
  total_pages: number;
  processed_pages: number;
  created_at?: string;
}

export interface EngineSettings {
  personality: number;
  decisiveness: number;
  depth: number;
  temperature: number;
  model: string;
}
