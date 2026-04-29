"use client";

import { useState } from "react";
import type { Theme } from "@/types";

type Props = {
  theme: Theme;
  onSubmit: (input: string, mode: "blank" | "fill") => void;
  onBack: () => void;
};

type Mode = "blank" | "fill";

const DIFFICULTY_COLOR: Record<string, string> = {
  基礎: "var(--green)",
  応用: "var(--accent)",
  発展: "var(--red)",
};

export default function InputScreen({ theme, onSubmit, onBack }: Props) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("blank");
  // 穴埋めモード：キーワードごとの回答
  const [fills, setFills] = useState<string[]>(theme.keywords.map(() => ""));
  const charCount = input.length;

  const handleSubmit = () => {
    if (mode === "blank") {
      onSubmit(input, "blank");
    } else {
      // 穴埋めの回答を結合してfeedbackに渡す
      const combined = theme.keywords
        .map((kw, i) => `${kw.split("（")[0].split("：")[0]}：${fills[i]}`)
        .join("\n");
      onSubmit(combined, "fill");
    }
  };

  const canSubmit =
    mode === "blank"
      ? input.trim().length > 0
      : fills.some((f) => f.trim().length > 0);

  return (
    <main
      style={{ background: "var(--bg)", minHeight: "100vh" }}
      className="flex flex-col items-center px-4 py-8"
    >
      <div className="w-full" style={{ maxWidth: "600px" }}>
        {/* Nav */}
        <div className="fade-in flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "13px",
              cursor: "pointer",
              padding: "0",
              fontFamily: "var(--font-jp)",
            }}
          >
            ← ホームへ
          </button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-dim)" }}>
            {mode === "blank" ? "WHITE PAPER MODE" : "FILL IN MODE"}
          </span>
        </div>

        {/* Theme card */}
        <div
          className="fade-in mb-6"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px 24px",
            animationDelay: "0.05s",
            opacity: 0,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--text-muted)",
                background: "var(--surface2)",
                padding: "3px 8px",
                borderRadius: "3px",
                border: "1px solid var(--border)",
              }}
            >
              {theme.category}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: DIFFICULTY_COLOR[theme.difficulty],
                border: `1px solid ${DIFFICULTY_COLOR[theme.difficulty]}`,
                padding: "3px 8px",
                borderRadius: "3px",
                opacity: 0.8,
              }}
            >
              {theme.difficulty}
            </span>
          </div>
          <h2
            style={{
              color: "var(--text)",
              fontSize: "clamp(20px, 4vw, 26px)",
              fontWeight: 700,
              margin: "0 0 8px",
              letterSpacing: "-0.01em",
            }}
          >
            {theme.title}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
            {theme.subtitle}
          </p>
        </div>

        {/* Mode toggle */}
        <div
          className="fade-in mb-6"
          style={{ display: "flex", gap: "8px", animationDelay: "0.08s", opacity: 0 }}
        >
          <button
            onClick={() => setMode("blank")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: `1px solid ${mode === "blank" ? "var(--text)" : "var(--border)"}`,
              background: mode === "blank" ? "var(--text)" : "transparent",
              color: mode === "blank" ? "var(--bg)" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-jp)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            白紙モード
          </button>
          <button
            onClick={() => setMode("fill")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: `1px solid ${mode === "fill" ? "var(--text)" : "var(--border)"}`,
              background: mode === "fill" ? "var(--text)" : "transparent",
              color: mode === "fill" ? "var(--bg)" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-jp)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            穴埋めモード
          </button>
        </div>

        {/* 白紙モード */}
        {mode === "blank" && (
          <div className="fade-in" style={{ opacity: 0 }}>
            {/* Guide */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px 8px 0 0",
                borderBottom: "none",
                padding: "12px 20px",
              }}
            >
              <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0, lineHeight: 2 }}>
                「{theme.title}」について、思い出せる内容をすべて書いてください。
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
                {["定義・要件", "例外・例外の例外", "数字・期間", "判例のポイント"].map((g) => (
                  <span key={g} style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                    · {g}
                  </span>
                ))}
              </div>
              <p style={{ color: "var(--text-dim)", fontSize: "11px", margin: "6px 0 0", fontFamily: "var(--font-mono)" }}>
                正確でなくてもOK。まず書くことが大切です。
              </p>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ここに書く..."
              style={{
                width: "100%",
                minHeight: "240px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "0 0 8px 8px",
                color: "var(--text)",
                fontSize: "15px",
                lineHeight: 1.8,
                padding: "20px",
                transition: "border-color 0.2s",
              }}
              className="placeholder:text-gray-400"
            />
            <div
              className="flex justify-between mt-2"
              style={{ color: "var(--text-dim)", fontSize: "11px", fontFamily: "var(--font-mono)" }}
            >
              <span>{charCount > 0 ? `${charCount} 文字` : ""}</span>
              <span>{charCount >= 200 ? "✓ 十分な記述量" : charCount >= 80 ? "もう少し詳しく" : ""}</span>
            </div>
          </div>
        )}

        {/* 穴埋めモード */}
        {mode === "fill" && (
          <div className="fade-in" style={{ opacity: 0 }}>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                marginBottom: "12px",
              }}
            >
              // 各キーワードに関連する内容を入力してください
            </p>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {theme.keywords.map((kw, i) => {
                const label = kw.split("（")[0].split("：")[0];
                return (
                  <div
                    key={i}
                    style={{
                      borderBottom: i < theme.keywords.length - 1 ? "1px solid var(--border)" : "none",
                      padding: "14px 16px",
                      background: "var(--bg)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        marginBottom: "6px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} · {label}
                    </label>
                    <input
                      type="text"
                      value={fills[i]}
                      onChange={(e) => {
                        const next = [...fills];
                        next[i] = e.target.value;
                        setFills(next);
                      }}
                      placeholder="わかる範囲で入力..."
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid var(--border)",
                        color: "var(--text)",
                        fontSize: "14px",
                        padding: "4px 0",
                        fontFamily: "var(--font-jp)",
                        outline: "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "11px",
                marginTop: "10px",
                fontFamily: "var(--font-mono)",
              }}
            >
              // 空欄のままでもOK。わかるものだけ埋めてください。
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="fade-in mt-6" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: "100%",
              background: canSubmit ? "var(--text)" : "var(--surface2)",
              color: canSubmit ? "var(--bg)" : "var(--text-dim)",
              border: "none",
              borderRadius: "4px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "var(--font-jp)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            書き終わった → フィードバックを受ける
          </button>
        </div>

        <p style={{ color: "var(--text-dim)", fontSize: "11px", textAlign: "center", marginTop: "12px" }}>
          答えは出しません。「何が足りないか」だけ教えます。
        </p>
      </div>
    </main>
  );
}
