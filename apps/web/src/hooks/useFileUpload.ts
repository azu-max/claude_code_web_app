'use client';

import { useState } from 'react';
import { validateFile } from '@/lib/validators/file-validator';

interface UploadedFileData {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface UseFileUploadResult {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
}

export function useFileUpload(
  onSuccess?: (data: UploadedFileData) => void
): UseFileUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    // バリデーション
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'ファイルが無効です');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'アップロードに失敗しました');
      }

      setProgress(100);
      if (onSuccess) {
        onSuccess(data.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'アップロードに失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    progress,
    error,
    uploadFile,
  };
}
