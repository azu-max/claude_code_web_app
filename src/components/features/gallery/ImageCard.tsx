import Image from 'next/image';
import { FileItem } from '@/types/file';
import { formatFileSize } from '@/lib/validators/file-validator';

interface ImageCardProps {
  file: FileItem;
  onClick: () => void;
}

export function ImageCard({ file, onClick }: ImageCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square relative bg-gray-100">
        <Image
          src={file.previewUrl}
          alt={file.fileName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-2">
          {file.fileName}
        </h3>
        <div className="text-xs text-gray-500 space-y-1">
          <p>{formatFileSize(file.fileSize)}</p>
          <p>{formatDate(file.uploadedAt)}</p>
        </div>
      </div>
    </div>
  );
}
