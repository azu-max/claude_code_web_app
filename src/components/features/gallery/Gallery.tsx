'use client';

import { useState } from 'react';
import { FileItem } from '@/types/file';
import { useGallery } from '@/hooks/useGallery';
import { GalleryGrid } from './GalleryGrid';
import { ImagePreview } from './ImagePreview';
import { Spinner } from '@/components/ui/Spinner';

export function Gallery() {
  const { files, isLoading, error, refetch } = useGallery();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleImageClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="lg" />
        <p className="text-gray-600 mt-4">ギャラリーを読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          ギャラリー
          {files.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({files.length}件)
            </span>
          )}
        </h2>
        <button
          onClick={refetch}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          更新
        </button>
      </div>

      <GalleryGrid files={files} onImageClick={handleImageClick} />

      <ImagePreview
        file={selectedFile}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
}
