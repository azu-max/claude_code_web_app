import { FileUploader } from '@/components/features/upload/FileUploader';
import { Gallery } from '@/components/features/gallery/Gallery';

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

        <div className="mb-12">
          <FileUploader />
        </div>

        <div className="mb-12">
          <Gallery />
        </div>
      </div>
    </main>
  );
}
