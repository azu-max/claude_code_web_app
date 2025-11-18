import { FileItem } from '@/types/file';
import { ImageCard } from './ImageCard';

interface GalleryGridProps {
  files: FileItem[];
  onImageClick: (file: FileItem) => void;
}

export function GalleryGrid({ files, onImageClick }: GalleryGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">まだファイルがアップロードされていません</p>
        <p className="text-gray-400 text-sm mt-2">
          上のエリアからファイルをアップロードしてください
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <ImageCard
          key={file.id}
          file={file}
          onClick={() => onImageClick(file)}
        />
      ))}
    </div>
  );
}
