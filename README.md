# 白紙コーチ - 宅建試験対策アプリ

## ディレクトリ構成

```
takken-coach/
├── app/
│   ├── api/
│   │   └── feedback/
│   │       └── route.ts       # Claude API連携（オプション）
│   ├── globals.css            # デザイントークン・アニメーション
│   ├── layout.tsx
│   └── page.tsx               # 状態管理ルート
├── components/
│   ├── HomeScreen.tsx         # トップ画面
│   ├── InputScreen.tsx        # 白紙入力画面
│   └── FeedbackScreen.tsx     # フィードバック画面
├── lib/
│   └── themes.ts              # テーマデータ + generateFeedback()
├── types/
│   └── index.ts               # 型定義
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で起動

## Claude API連携（オプション）

```bash
cp .env.local.example .env.local
# ANTHROPIC_API_KEY=sk-ant-... を設定
```

`app/page.tsx` の `handleSubmit` 内で `/api/feedback` を呼ぶように変更：

```ts
// generateFeedback(input, theme) の代わりに:
const res = await fetch("/api/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userInput: input, theme }),
});
const result = await res.json();
```

## テーマ追加

`lib/themes.ts` の `THEMES` 配列にオブジェクトを追加するだけ。
