"use client";

import { useState, useEffect } from "react";
import type { Theme } from "@/types";
import { THEMES } from "@/lib/themes";
import { loadHistory, getCategoryStats, clearHistory } from "@/lib/history";

type Props = { onStart: (t: Theme) => void };

const CATEGORIES = ["宅建業法", "法令上の制限", "民法", "税その他"];
const DIFF_COLOR: Record<string, string> = { 基礎: "#4ade80", 応用: "#fb923c", 発展: "#f87171" };

export default function HomeScreen({ onStart }: Props) {
  const [tab, setTab] = useState<"select" | "history">("select");
  const [category, setCategory] = useState("宅建業法");
  const [selected, setSelected] = useState<Theme | null>(null);
  const [historyStats, setHistoryStats] = useState<ReturnType<typeof getCategoryStats>>([]);
  const [historyList, setHistoryList] = useState<ReturnType<typeof loadHistory>>([]);

  useEffect(() => {
    const h = loadHistory();
    setHistoryStats(getCategoryStats(h));
    setHistoryList(h.slice(0, 30));
  }, [tab]);

  const filtered = THEMES.filter((t) => t.category === category);

  const handleStart = () => {
    if (selected) onStart(selected);
    else onStart(THEMES[Math.floor(Math.random() * THEMES.length)]);
  };

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex flex-col items-center px-4 py-10">
      <div className="w-full fade-in" style={{ maxWidth: "560px" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "12px" }}>
            TAKKEN · WHITE PAPER COACH
          </p>
          <h1 style={{ color: "var(--text)", fontSize: "clamp(26px,5vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "8px" }}>
            白紙コーチ
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
            テーマを見て、知っていることをすべて書く。<br />
            AIが不足点とサンプル答えを教えます。
          </p>
        </div>

        {/* Tab */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "20px" }}>
          {(["select", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "10px", background: "transparent",
                border: "none", borderBottom: `2px solid ${tab === t ? "var(--accent)" : "transparent"}`,
                color: tab === t ? "var(--text)" : "var(--text-muted)",
                fontSize: "13px", fontWeight: 600, transition: "all 0.15s",
              }}
            >
              {t === "select" ? "テーマを選ぶ" : "スコア履歴"}
            </button>
          ))}
        </div>

        {tab === "select" && (
          <>
            {/* Category filter */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setSelected(null); }}
                  style={{
                    padding: "5px 12px", borderRadius: "99px",
                    border: `1px solid ${category === c ? "#2563eb" : "var(--border)"}`,
                    background: category === c ? "#dbeafe" : "transparent",
                    color: category === c ? "#1d4ed8" : "var(--text-muted)",
                    fontSize: "12px", transition: "all 0.15s",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Theme list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px", maxHeight: "320px", overflowY: "auto" }}>
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(selected?.id === t.id ? null : t)}
                  style={{
                    padding: "12px 14px", borderRadius: "6px", textAlign: "left",
                    border: `1px solid ${selected?.id === t.id ? "#2563eb" : "var(--border)"}`,
                    background: selected?.id === t.id ? "#dbeafe" : "var(--surface)",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text)", fontSize: "14px", fontWeight: 600 }}>{t.title}</span>
                    <span style={{ color: DIFF_COLOR[t.difficulty], fontSize: "11px", fontFamily: "var(--font-mono)" }}>{t.difficulty}</span>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{t.category} · {t.subtitle}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              style={{
                width: "100%", padding: "14px",
                background: "#2563eb", color: "#ffffff",
                border: "none", borderRadius: "6px",
                fontSize: "15px", fontWeight: 700, letterSpacing: "0.02em",
              }}
            >
              {selected ? `「${selected.title}」で開始` : "ランダムで開始"}
            </button>
          </>
        )}

        {tab === "history" && (
          <>
            {/* Category stats */}
            {historyStats.length > 0 ? (
              <>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "12px" }}>科目別平均スコア</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {historyStats.map((s) => (
                    <div key={s.category} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "var(--text)", fontSize: "14px", fontWeight: 600 }}>{s.category}</span>
                        <span style={{
                          color: s.avg >= 70 ? "var(--green)" : s.avg >= 40 ? "var(--orange)" : "var(--red)",
                          fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700
                        }}>{s.avg}<span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/100</span></span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ background: "var(--surface2)", borderRadius: "99px", height: "4px" }}>
                        <div style={{
                          width: `${s.avg}%`, height: "100%", borderRadius: "99px",
                          background: s.avg >= 70 ? "var(--green)" : s.avg >= 40 ? "var(--orange)" : "var(--red)",
                          transition: "width 0.8s ease",
                        }} />
                      </div>
                      <span style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", display: "block" }}>{s.count}回 挑戦 · 直近 {s.latest}点</span>
                    </div>
                  ))}
                </div>

                {/* Recent history */}
                <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "8px" }}>最近の記録</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px", maxHeight: "200px", overflowY: "auto" }}>
                  {historyList.map((r) => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "var(--surface)", borderRadius: "4px", border: "1px solid var(--border)" }}>
                      <div>
                        <span style={{ color: "var(--text)", fontSize: "13px" }}>{r.title}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "11px", marginLeft: "8px" }}>{r.category}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{
                          color: r.score >= 70 ? "var(--green)" : r.score >= 40 ? "var(--orange)" : "var(--red)",
                          fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 700,
                        }}>{r.score}</span>
                        <span style={{ color: "var(--text-dim)", fontSize: "10px" }}>
                          {new Date(r.date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { clearHistory(); setHistoryStats([]); setHistoryList([]); }}
                  style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 16px", borderRadius: "4px", fontSize: "12px" }}
                >
                  履歴をリセット
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: "14px" }}>
                まだ記録がありません。<br />テーマに挑戦して記録を積み上げましょう。
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
