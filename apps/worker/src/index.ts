/**
 * SnapShare URL Shortener Worker
 *
 * 共有リンクの短縮URL生成・リダイレクト機能を提供します
 */

// TODO: KVネームスペースの型定義を追加
// import { ShortLink } from '@snapshare/shared';

interface Env {
  // KVネームスペース（wrangler.tomlで設定）
  // URL_SHORTENER: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS対応
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONSリクエスト（プリフライト）への対応
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ルーティング
      if (url.pathname === '/health') {
        return handleHealthCheck();
      }

      if (url.pathname === '/api/shorten' && request.method === 'POST') {
        return await handleShortenUrl(request, env);
      }

      if (url.pathname.startsWith('/s/')) {
        return await handleRedirect(url.pathname, env);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Internal Server Error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
  },
};

/**
 * ヘルスチェックエンドポイント
 */
function handleHealthCheck(): Response {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'snapshare-url-shortener',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * URL短縮エンドポイント
 *
 * POST /api/shorten
 * Body: { originalUrl: string, expiresIn?: number }
 * Response: { success: true, data: { shortCode: string, shortUrl: string } }
 */
async function handleShortenUrl(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { originalUrl: string; expiresIn?: number };

    if (!body.originalUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'originalUrl is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 短縮コードを生成（6文字のランダム文字列）
    const shortCode = generateShortCode();

    // TODO: KVに保存
    // const linkData: ShortLink = {
    //   shortCode,
    //   originalUrl: body.originalUrl,
    //   createdAt: new Date().toISOString(),
    //   expiresAt: body.expiresIn
    //     ? new Date(Date.now() + body.expiresIn * 1000).toISOString()
    //     : undefined,
    // };
    // await env.URL_SHORTENER.put(shortCode, JSON.stringify(linkData), {
    //   expirationTtl: body.expiresIn,
    // });

    const shortUrl = `${new URL(request.url).origin}/s/${shortCode}`;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          shortCode,
          shortUrl,
          originalUrl: body.originalUrl,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid request body',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * 短縮URLからリダイレクト
 *
 * GET /s/:shortCode
 */
async function handleRedirect(pathname: string, env: Env): Promise<Response> {
  const shortCode = pathname.replace('/s/', '');

  if (!shortCode) {
    return new Response('Short code is required', { status: 400 });
  }

  // TODO: KVから取得
  // const linkDataStr = await env.URL_SHORTENER.get(shortCode);
  //
  // if (!linkDataStr) {
  //   return new Response('Short URL not found', { status: 404 });
  // }
  //
  // const linkData: ShortLink = JSON.parse(linkDataStr);
  //
  // // 期限チェック
  // if (linkData.expiresAt && new Date(linkData.expiresAt) < new Date()) {
  //   return new Response('Short URL has expired', { status: 410 });
  // }
  //
  // // リダイレクト
  // return Response.redirect(linkData.originalUrl, 302);

  // TODO: KV実装までは仮のレスポンス
  return new Response(
    JSON.stringify({
      message: 'Redirect feature - Coming soon!',
      shortCode,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * 短縮コード生成（6文字のランダム文字列）
 */
function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
