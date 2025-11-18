import { MainContent } from '@/components/layouts/MainContent';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SnapShare</h1>
          <p className="text-lg text-gray-600">
            ファイル共有 & ギャラリーアプリケーション
          </p>
        </div>

        <MainContent />
      </div>
    </main>
  );
}
