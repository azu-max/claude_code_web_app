'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { FileItem } from '@/types/file';
import { formatFileSize } from '@/lib/validators/file-validator';
import { ShareButton } from '@/components/features/share/ShareButton';

interface ImagePreviewProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePreview({ file, isOpen, onClose }: ImagePreviewProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !file) {
    return null;
  }

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {file.fileName}
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span>{formatFileSize(file.fileSize)}</span>
              <span>{formatDate(file.uploadedAt)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 画像表示 */}
        <div className="relative bg-gray-100 flex items-center justify-center min-h-[400px] max-h-[70vh]">
          <div className="relative w-full h-full">
            <Image
              src={file.previewUrl}
              alt={file.fileName}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>

        {/* フッター（共有ボタンエリア） */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {file.mimeType}
          </div>
          <ShareButton fileId={file.s3Key} fileName={file.fileName} />
        </div>
      </div>
    </div>
  );
}
