'use client';

import { useState } from 'react';
import { ShareLinkResponse } from '@/types/file';
import { Button } from '@/components/ui/Button';

interface ShareButtonProps {
  fileId: string;
  fileName: string;
}

export function ShareButton({ fileId, fileName }: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      setMessage(null);

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });

      const data: ShareLinkResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || '共有リンクの生成に失敗しました');
      }

      // クリップボードにコピー
      await navigator.clipboard.writeText(data.data.shareUrl);

      // 有効期限を表示用にフォーマット
      const expiresAt = new Date(data.data.expiresAt);
      const expiresText = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(expiresAt);

      setMessage(`共有リンクをコピーしました！\n有効期限: ${expiresText}`);

      // 3秒後にメッセージをクリア
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('共有エラー:', error);
      setMessage(
        error instanceof Error ? error.message : '共有リンクの生成に失敗しました'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleShare}
        disabled={isGenerating}
        variant="secondary"
        className="min-w-[140px]"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            生成中...
          </span>
        ) : (
          '共有リンク作成'
        )}
      </Button>

      {message && (
        <div
          className={`text-xs px-3 py-2 rounded ${
            message.includes('失敗')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {message.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
