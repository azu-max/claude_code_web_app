import { NextRequest, NextResponse } from 'next/server';
import { validateFile } from '@/lib/validators/file-validator';
import { uploadFileToS3 } from '@/lib/aws/upload';

export async function POST(request: NextRequest) {
  try {
    // FormDataからファイルを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'ファイルが選択されていません',
        },
        { status: 400 }
      );
    }

    // バリデーション
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // S3にアップロード
    const s3Key = await uploadFileToS3(file);

    // 成功レスポンス
    return NextResponse.json(
      {
        success: true,
        message: 'アップロードが完了しました',
        data: {
          fileId: s3Key,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'アップロードに失敗しました',
      },
      { status: 500 }
    );
  }
}
