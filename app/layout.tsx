import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 👈 이 줄이 없으면 디자인이 적용되지 않습니다!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Longform Image Gen",
  description: "Create consistent characters and video source images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}