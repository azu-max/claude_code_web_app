'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';
import { ProgressBar } from './ProgressBar';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/lib/validators/file-validator';

interface FileUploaderProps {
  onUploadSuccess?: () => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, progress, error, uploadFile } = useFileUpload(() => {
    setToastMessage('アップロードが完了しました');
    setToastType('success');
    setShowToast(true);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadSuccess) {
      onUploadSuccess();
    }
  });

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadFile(selectedFile);
    } catch {
      setToastMessage(error || 'アップロードに失敗しました');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ファイルアップロード
        </h2>

        <div className="space-y-4">
          {/* ファイル選択 */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={handleButtonClick}
              variant="secondary"
              disabled={isUploading}
              className="w-full"
            >
              ファイルを選択
            </Button>
          </div>

          {/* 選択されたファイル情報 */}
          {selectedFile && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 font-medium truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}

          {/* プログレスバー */}
          {isUploading && (
            <div className="space-y-2">
              <ProgressBar progress={progress} />
              <div className="flex items-center justify-center space-x-2">
                <Spinner size="sm" />
                <span className="text-sm text-gray-600">
                  アップロード中...
                </span>
              </div>
            </div>
          )}

          {/* アップロードボタン */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </Button>

          {/* ヒント */}
          <p className="text-xs text-gray-500 text-center">
            対応形式: JPEG, PNG, GIF, WebP（最大10MB）
          </p>
        </div>
      </div>

      {/* トースト通知 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
