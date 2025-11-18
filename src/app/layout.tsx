import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnapShare - ファイル共有&ギャラリー',
  description: 'シンプルで高速なファイル共有・ギャラリーアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
