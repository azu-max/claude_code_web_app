import { NextResponse } from 'next/server';
import { listFiles } from '@/lib/aws/list-files';

export async function GET() {
  try {
    const files = await listFiles();

    return NextResponse.json(
      {
        success: true,
        data: {
          files,
          totalCount: files.length,
          hasMore: false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ファイル一覧の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}
