import { NextRequest, NextResponse } from "next/server";
import type { FeedbackResult } from "@/types";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "no api key" }, { status: 501 });
  }

  const { userInput, theme } = await req.json();

  const system = `あなたは宅建試験の厳格な採点コーチです。
以下のJSONのみを返してください（他のテキスト・マークダウン不可）：
{
  "score": 0-95の整数,
  "items": [{"type": "missing|incorrect|vague|hint", "message": "..."}],
  "encouragement": "...",
  "missingKeywords": ["...", "..."]
}

ルール：
1. 答えを直接教えない。不足・誤り・曖昧さのみ指摘。
2. itemsは最大4件。
3. missingKeywordsは書き忘れた重要キーワードを配列で（最大6件）。
4. scoreはキーワードの網羅度を0-95で評価（100は与えない）。
5. encouragementは30字以内の励ましメッセージ。`;

  const user = `テーマ: ${theme.category} / ${theme.title}
採点基準キーワード（非表示）: ${theme.keywords.join(", ")}

ユーザー記述:
${userInput}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const result: FeedbackResult = JSON.parse(clean);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "api error" }, { status: 500 });
  }
}
