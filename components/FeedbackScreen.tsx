"use client";

import { useEffect, useRef, useState } from "react";
import type { Theme, FeedbackResult, FeedbackItem } from "@/types";

type Props = {
  theme: Theme;
  userInput: string;
  feedback: FeedbackResult | null;
  isLoading: boolean;
  onRetry: () => void;
  onHome: () => void;
};

const ITEM_CONFIG: Record<FeedbackItem["type"], { label: string; color: string; bg: string; icon: string }> = {
  missing:   { label: "不足",  color: "var(--accent)", bg: "var(--accent-dim)", icon: "○" },
  incorrect: { label: "修正",  color: "var(--red)",    bg: "var(--red-dim)",    icon: "△" },
  vague:     { label: "曖昧",  color: "var(--blue)",   bg: "var(--blue-dim)",   icon: "?" },
  hint:      { label: "ヒント", color: "var(--green)",  bg: "var(--green-dim)",  icon: "→" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.strokeDashoffset = String(circ);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)";
        el.style.strokeDashoffset = String(offset);
      })
    );
  }, [score, offset, circ]);

  const color = score >= 70 ? "var(--green)" : score >= 40 ? "var(--orange)" : "var(--red)";

  return (
    <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          ref={ref}
          cx="48" cy="48" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "var(--text)", fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{score}</span>
        <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>/ 100</span>
      </div>
    </div>
  );
}

export default function FeedbackScreen({ theme, userInput, feedback, isLoading, onRetry, onHome }: Props) {
  const [showSample, setShowSample] = useState(false);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex flex-col items-center px-4 py-10">
      <div className="w-full" style={{ maxWidth: "560px" }}>
        {/* Theme label */}
        <div className="fade-in" style={{ marginBottom: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
            {theme.category} / {theme.title}
          </p>
        </div>

        {/* Your answer */}
        <div className="fade-in" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px", marginBottom: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginBottom: "10px" }}>YOUR ANSWER</p>
          <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{userInput}</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 0" }}>
            <div className="spinner" />
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>採点中...</span>
          </div>
        )}

        {/* Feedback */}
        {!isLoading && feedback && (
          <>
            {/* Score */}
            <div className="fade-in" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", marginBottom: "16px", display: "flex", gap: "20px", alignItems: "center" }}>
              <ScoreRing score={feedback.score} />
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginBottom: "8px" }}>COVERAGE SCORE</p>
                <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.7 }}>{feedback.encouragement}</p>
              </div>
            </div>

            {/* Feedback items */}
            {feedback.items.length > 0 && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {feedback.items.map((item, i) => {
                  const cfg = ITEM_CONFIG[item.type];
                  return (
                    <div key={i} style={{ background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: "6px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: cfg.color, fontFamily: "var(--font-mono)", fontSize: "12px", flexShrink: 0 }}>{cfg.icon}</span>
                      <div>
                        <span style={{ color: cfg.color, fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", display: "block", marginBottom: "3px" }}>{cfg.label}</span>
                        <p style={{ color: "var(--text)", fontSize: "14px", margin: 0, lineHeight: 1.7 }}>{item.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Missing keywords */}
            {feedback.missingKeywords.length > 0 && (
              <div className="fade-in" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginBottom: "10px" }}>
                  ⚡ 漏れているキーワード
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {feedback.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      style={{
                        background: "var(--accent-dim)", color: "var(--accent)",
                        border: "1px solid var(--accent)44",
                        borderRadius: "4px", padding: "3px 8px",
                        fontSize: "12px", fontWeight: 600,
                      }}
                    >
                      {kw.split("：")[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sample answer toggle */}
            <div className="fade-in" style={{ marginBottom: "20px" }}>
              <button
                onClick={() => setShowSample((v) => !v)}
                style={{
                  width: "100%", padding: "12px",
                  background: showSample ? "var(--surface2)" : "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  color: "var(--text-muted)", fontSize: "13px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all 0.2s",
                }}
              >
                <span>📋 サンプル答えを{showSample ? "閉じる" : "見る"}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{showSample ? "▲" : "▼"}</span>
              </button>
              {showSample && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 6px 6px", padding: "16px 18px" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginBottom: "10px" }}>SAMPLE ANSWER</p>
                  <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{theme.sampleAnswer}</p>
                </div>
              )}
            </div>

            {/* Note */}
            <p style={{ color: "var(--text-dim)", fontSize: "11px", textAlign: "center", marginBottom: "20px", fontFamily: "var(--font-mono)" }}>
              // 答えは出しません。自分で思い出すことが記憶定着の核心です。
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={onRetry}
                style={{
                  flex: 2, padding: "14px",
                  background: "#1e3a5f", color: "#ffffff",
                  border: "none", borderRadius: "6px",
                  fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em",
                  cursor: "pointer",
                }}
              >
                もう一度書く（同じテーマ）
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const pad = (n: number) => String(n).padStart(2, "0");
                  const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
                  const content = [
                    `【白紙コーチ】${ts}`,
                    `テーマ: ${theme.category} / ${theme.title}`,
                    `サブタイトル: ${theme.subtitle}`,
                    `難易度: ${theme.difficulty}`,
                    `スコア: ${feedback.score} / 100`,
                    "",
                    "─── あなたの記述 ───",
                    userInput,
                    "",
                    "─── サンプル答え ───",
                    theme.sampleAnswer ?? "",
                  ].join("\n");
                  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `白紙コーチ_${ts}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  flex: 1, padding: "14px",
                  background: "#2563eb", color: "#ffffff",
                  border: "none", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ↓ 保存
              </button>
              <button
                onClick={onHome}
                style={{
                  flex: 1, padding: "14px",
                  background: "var(--surface2)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                別テーマへ
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
