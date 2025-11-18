'use client';

import { useState, useEffect } from 'react';
import { FileItem } from '@/types/file';

interface UseGalleryResult {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  refreshFiles: () => Promise<void>;
}

export function useGallery(): UseGalleryResult {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/files');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ファイル一覧の取得に失敗しました');
      }

      setFiles(data.data.files);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'ファイル一覧の取得に失敗しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    isLoading,
    error,
    refreshFiles: fetchFiles,
  };
}
