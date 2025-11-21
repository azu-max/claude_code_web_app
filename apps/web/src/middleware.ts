import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Basic認証のチェック
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, password] = atob(authValue).split(':');

    // 環境変数から認証情報を取得
    const validUser = process.env.BASIC_AUTH_USER;
    const validPassword = process.env.BASIC_AUTH_PASSWORD;

    if (user === validUser && password === validPassword) {
      return NextResponse.next();
    }
  }

  // 認証失敗または認証情報なし
  return new NextResponse('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  // すべてのパスで認証を要求（静的ファイルは除外）
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
