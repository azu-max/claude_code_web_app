import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUrl } from '@/lib/aws/generate-presigned-url';
import { ShareLinkRequest, ShareLinkResponse } from '@/types/file';

/**
 * 共有リンク生成API
 * POST /api/share
 */
export async function POST(request: NextRequest) {
  try {
    const body: ShareLinkRequest = await request.json();
    const { fileId, expiresIn = 604800 } = body; // デフォルト: 7日間

    // fileIdのバリデーション
    if (!fileId || typeof fileId !== 'string') {
      const response: ShareLinkResponse = {
        success: false,
        error: 'ファイルIDが無効です',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 有効期限のバリデーション（最大7日間）
    const maxExpiresIn = 604800; // 7日間
    const validExpiresIn = Math.min(expiresIn, maxExpiresIn);

    // 署名付きURL生成
    const shareUrl = await generatePresignedUrl(fileId, validExpiresIn);

    // 有効期限の計算
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + validExpiresIn);

    const response: ShareLinkResponse = {
      success: true,
      data: {
        shareUrl,
        expiresAt: expiresAt.toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('共有リンク生成エラー:', error);

    const response: ShareLinkResponse = {
      success: false,
      error: '共有リンクの生成に失敗しました',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
