"use client";

import { useState, useCallback } from "react";
import type { AppState, Theme, FeedbackResult } from "@/types";
import { generateFeedback } from "@/lib/themes";
import { saveRecord } from "@/lib/history";
import HomeScreen from "@/components/HomeScreen";
import InputScreen from "@/components/InputScreen";
import FeedbackScreen from "@/components/FeedbackScreen";

export default function Page() {
  const [screen, setScreen] = useState<AppState>("home");
  const [theme, setTheme] = useState<Theme | null>(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = useCallback((t: Theme) => {
    setTheme(t);
    setUserInput("");
    setFeedback(null);
    setScreen("input");
  }, []);

  const handleSubmit = useCallback(
    async (input: string) => {
      if (!theme) return;
      setUserInput(input);
      setIsLoading(true);
      setScreen("feedback");

      try {
        // Claude API経由でフィードバック取得
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput: input, theme }),
        });
        if (!res.ok) throw new Error("api error");
        const result: FeedbackResult = await res.json();
        setFeedback(result);
        // 履歴に保存
        saveRecord({ themeId: theme.id, category: theme.category, title: theme.title, score: result.score });
      } catch {
        // APIがなければローカルフォールバック
        await new Promise((r) => setTimeout(r, 600));
        const result = generateFeedback(input, theme);
        setFeedback(result);
        saveRecord({ themeId: theme.id, category: theme.category, title: theme.title, score: result.score });
      } finally {
        setIsLoading(false);
      }
    },
    [theme]
  );

  const handleRetry = useCallback(() => {
    setUserInput("");
    setFeedback(null);
    setScreen("input");
  }, []);

  const handleHome = useCallback(() => {
    setScreen("home");
    setTheme(null);
    setUserInput("");
    setFeedback(null);
  }, []);

  if (screen === "home") return <HomeScreen onStart={handleStart} />;
  if (screen === "input" && theme)
    return <InputScreen theme={theme} onSubmit={handleSubmit} onBack={handleHome} />;
  if (screen === "feedback" && theme)
    return (
      <FeedbackScreen
        theme={theme}
        userInput={userInput}
        feedback={feedback}
        isLoading={isLoading}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );

  return null;
}
