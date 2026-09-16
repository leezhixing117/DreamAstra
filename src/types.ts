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

export interface DreamReport {
  title: string;
  summary: string;
  symbols: DreamSymbol[];
  perspectives: DreamPerspective[];
  questions: string[];
  sources: BookSource[];
}

export interface DreamEntry {
  id: string;
  title: string;
  dream_text: string;
  created_at: string;
  report_json: DreamReport;
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
