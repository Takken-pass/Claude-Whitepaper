import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "白紙コーチ | 宅建試験対策",
  description: "白紙に書いて記憶を定着させる宅建試験対策アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
