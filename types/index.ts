export type AppState = "home" | "input" | "feedback";

export interface Theme {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  keywords: string[];
  sampleAnswer: string; // ← 追加
  difficulty: "基礎" | "応用" | "発展";
}

export interface FeedbackItem {
  type: "missing" | "incorrect" | "vague" | "hint";
  message: string;
}

export interface FeedbackResult {
  score: number;
  items: FeedbackItem[];
  encouragement: string;
  missingKeywords: string[]; // ← 追加：漏れキーワード
}

export interface ScoreRecord {
  id: string;
  themeId: string;
  category: string;
  title: string;
  score: number;
  date: string; // ISO string
}
