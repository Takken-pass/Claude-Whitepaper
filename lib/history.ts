import type { ScoreRecord } from "@/types";

const KEY = "takken_coach_history";

export function loadHistory(): ScoreRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: Omit<ScoreRecord, "id" | "date">): void {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  const newRecord: ScoreRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: new Date().toISOString(),
  };
  history.unshift(newRecord);
  // 最大200件保持
  const trimmed = history.slice(0, 200);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

// 科目別平均スコア
export function getCategoryStats(
  history: ScoreRecord[]
): { category: string; avg: number; count: number; latest: number }[] {
  const map = new Map<string, number[]>();
  for (const r of history) {
    if (!map.has(r.category)) map.set(r.category, []);
    map.get(r.category)!.push(r.score);
  }
  return Array.from(map.entries())
    .map(([category, scores]) => ({
      category,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
      latest: scores[0], // unshiftしているので最新が先頭
    }))
    .sort((a, b) => b.count - a.count);
}
