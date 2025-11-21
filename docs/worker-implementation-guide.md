# Cloudflare Workers 実装ガイド

このガイドでは、SnapShareのCloudflare Workers（URL短縮サービス）の実装手順を段階的に説明します。

## 目次

1. [前提条件](#前提条件)
2. [環境セットアップ](#環境セットアップ)
3. [実装ステップ](#実装ステップ)
4. [テスト方法](#テスト方法)
5. [デプロイ](#デプロイ)
6. [トラブルシューティング](#トラブルシューティング)

## 前提条件

### 必要なアカウント・ツール

- [x] Node.js 18以上
- [x] npm workspaces対応リポジトリ（モノレポ構成）
- [ ] Cloudflareアカウント（無料）
- [ ] Wrangler CLI

### Cloudflareアカウント作成

1. https://dash.cloudflare.com/sign-up にアクセス
2. メールアドレスとパスワードで登録
3. メール認証を完了

## 環境セットアップ

### Step 1: Wranglerのインストール確認

```bash
# プロジェクトルートで
cd apps/worker

# 依存関係を確認（モノレポの場合、ルートでnpm installを実行済みのはず）
npm list wrangler
```

### Step 2: Cloudflareにログイン

```bash
# Wranglerでログイン
npx wrangler login
```

ブラウザが開き、Cloudflareアカウントとの連携を承認します。

### Step 3: KVネームスペースの作成

```bash
# 本番用KVネームスペースを作成
npx wrangler kv:namespace create "URL_SHORTENER"

# 出力例:
# ✅ Successfully created KV namespace with name URL_SHORTENER
# 📋 Add the following to your wrangler.toml:
# [[kv_namespaces]]
# binding = "URL_SHORTENER"
# id = "abc123..."

# 開発用（プレビュー）KVネームスペースを作成
npx wrangler kv:namespace create "URL_SHORTENER" --preview

# 出力例:
# ✅ Successfully created KV namespace with name URL_SHORTENER_preview
# 📋 Add the following to your wrangler.toml:
# preview_id = "def456..."
```

### Step 4: wrangler.toml の設定

出力されたIDを`apps/worker/wrangler.toml`に追加:

```toml
name = "snapshare-url-shortener"
main = "src/index.ts"
compatibility_date = "2024-11-21"

# KVネームスペース（Step 3で取得したIDを設定）
[[kv_namespaces]]
binding = "URL_SHORTENER"
id = "あなたのKV_NAMESPACE_ID"
preview_id = "あなたのPREVIEW_KV_NAMESPACE_ID"

# 環境変数（オプション）
[vars]
ALLOWED_ORIGIN = "*"  # 開発環境用

# 本番環境設定
[env.production]
name = "snapshare-url-shortener"
vars = { ALLOWED_ORIGIN = "https://your-domain.com" }
```

## 実装ステップ

### フェーズ1: 基本実装（完了済み✅）

基本的なWorkerの実装は既に完了しています：

- [x] エントリーポイント (`apps/worker/src/index.ts`)
- [x] ヘルスチェックエンドポイント
- [x] URL短縮エンドポイント（スケルトン）
- [x] リダイレクトエンドポイント（スケルトン）
- [x] 型定義 (`packages/shared/src/types.ts`)

### フェーズ2: KVストレージの実装

#### Step 1: 型定義の更新

`apps/worker/src/index.ts`の`Env`インターフェースを更新:

```typescript
interface Env {
  // KVネームスペース（wrangler.tomlで設定）
  URL_SHORTENER: KVNamespace;

  // 環境変数
  ALLOWED_ORIGIN?: string;
}
```

#### Step 2: URL短縮機能の実装

`apps/worker/src/index.ts`の`handleShortenUrl`関数を更新:

```typescript
async function handleShortenUrl(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as ShortenUrlRequest;

    // バリデーション
    if (!body.originalUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'originalUrl is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // URL検証（本番環境ではS3 URLのみ許可）
    try {
      new URL(body.originalUrl);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid URL format',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 短縮コード生成（重複チェック付き）
    let shortCode = generateShortCode();
    let attempts = 0;
    while (await env.URL_SHORTENER.get(shortCode) !== null && attempts < 3) {
      shortCode = generateShortCode();
      attempts++;
    }

    if (attempts >= 3) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to generate unique short code',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // リンクデータ作成
    const expiresIn = body.expiresIn || 604800; // デフォルト7日
    const linkData: ShortLink = {
      shortCode,
      originalUrl: body.originalUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      accessCount: 0,
      metadata: body.metadata,
    };

    // KVに保存（TTL付き）
    await env.URL_SHORTENER.put(
      shortCode,
      JSON.stringify(linkData),
      {
        expirationTtl: expiresIn,
      }
    );

    // レスポンス
    const shortUrl = `${new URL(request.url).origin}/s/${shortCode}`;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          shortCode,
          shortUrl,
          originalUrl: body.originalUrl,
          expiresAt: linkData.expiresAt,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in handleShortenUrl:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

#### Step 3: リダイレクト機能の実装

`handleRedirect`関数を更新:

```typescript
async function handleRedirect(pathname: string, env: Env): Promise<Response> {
  const shortCode = pathname.replace('/s/', '');

  if (!shortCode || shortCode.length !== 6) {
    return new Response('Invalid short code', { status: 400 });
  }

  try {
    // KVから取得
    const linkDataStr = await env.URL_SHORTENER.get(shortCode);

    if (!linkDataStr) {
      return new Response('Short URL not found', { status: 404 });
    }

    const linkData: ShortLink = JSON.parse(linkDataStr);

    // 期限チェック
    if (linkData.expiresAt && new Date(linkData.expiresAt) < new Date()) {
      return new Response('Short URL has expired', { status: 410 });
    }

    // アクセスカウント更新（オプション）
    linkData.accessCount = (linkData.accessCount || 0) + 1;
    await env.URL_SHORTENER.put(shortCode, JSON.stringify(linkData), {
      expirationTtl: Math.floor(
        (new Date(linkData.expiresAt!).getTime() - Date.now()) / 1000
      ),
    });

    // リダイレクト
    return Response.redirect(linkData.originalUrl, 302);
  } catch (error) {
    console.error('Error in handleRedirect:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

#### Step 4: インポートの追加

ファイルの先頭に型のインポートを追加:

```typescript
import { ShortLink, ShortenUrlRequest } from '@snapshare/shared';
```

### フェーズ3: Next.jsアプリとの連携

#### Step 1: 環境変数の設定

`apps/web/.env.local`に追加:

```bash
# Cloudflare Worker URL
NEXT_PUBLIC_WORKER_URL=https://snapshare-url-shortener.your-subdomain.workers.dev
```

#### Step 2: Workerクライアントの作成

`apps/web/src/lib/worker/url-shortener-client.ts`を作成:

```typescript
import { ShortenUrlRequest, ShortenUrlResponse, ErrorResponse } from '@snapshare/shared';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL;

export async function createShortUrl(
  request: ShortenUrlRequest
): Promise<ShortenUrlResponse> {
  const response = await fetch(`${WORKER_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error((data as ErrorResponse).error);
  }

  return data as ShortenUrlResponse;
}
```

#### Step 3: 共有機能での使用

`apps/web/src/app/api/share/route.ts`を更新:

```typescript
import { createShortUrl } from '@/lib/worker/url-shortener-client';

export async function POST(request: Request) {
  try {
    const { fileKey } = await request.json();

    // S3の署名付きURLを生成
    const presignedUrl = await generatePresignedUrl(fileKey);

    // Workerで短縮URLを生成
    const shortUrlData = await createShortUrl({
      originalUrl: presignedUrl,
      expiresIn: 604800, // 7日間
      metadata: {
        fileName: fileKey,
      },
    });

    return Response.json({
      success: true,
      data: {
        shareUrl: shortUrlData.data.shortUrl,
        expiresAt: shortUrlData.data.expiresAt,
      },
    });
  } catch (error) {
    console.error('Share error:', error);
    return Response.json(
      { success: false, error: 'Failed to create share link' },
      { status: 500 }
    );
  }
}
```

## テスト方法

### ローカルテスト

#### Step 1: 開発サーバーの起動

```bash
# Workerのみ起動
npm run dev:worker

# または両方起動
npm run dev
```

#### Step 2: ヘルスチェック

```bash
curl http://localhost:8787/health
```

期待されるレスポンス:
```json
{
  "status": "ok",
  "service": "snapshare-url-shortener",
  "timestamp": "2024-11-21T00:00:00.000Z"
}
```

#### Step 3: URL短縮のテスト

```bash
curl -X POST http://localhost:8787/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very/long/url/to/shorten",
    "expiresIn": 3600
  }'
```

期待されるレスポンス:
```json
{
  "success": true,
  "data": {
    "shortCode": "AbC123",
    "shortUrl": "http://localhost:8787/s/AbC123",
    "originalUrl": "https://example.com/very/long/url/to/shorten",
    "expiresAt": "2024-11-21T01:00:00.000Z"
  }
}
```

#### Step 4: リダイレクトのテスト

```bash
# -L オプションでリダイレクトを追跡
curl -L http://localhost:8787/s/AbC123
```

### KVデータの確認

```bash
# KVに保存されているキーを一覧表示
npx wrangler kv:key list --namespace-id=<your-namespace-id>

# 特定のキーの値を取得
npx wrangler kv:key get "AbC123" --namespace-id=<your-namespace-id>
```

## デプロイ

### 本番環境へのデプロイ

#### Step 1: 本番用KVネームスペースを確認

```bash
# KVネームスペースIDを確認
npx wrangler kv:namespace list
```

#### Step 2: wrangler.tomlの本番設定を確認

```toml
[env.production]
name = "snapshare-url-shortener"
vars = { ALLOWED_ORIGIN = "https://your-production-domain.com" }

[[env.production.kv_namespaces]]
binding = "URL_SHORTENER"
id = "your_production_kv_namespace_id"
```

#### Step 3: デプロイ実行

```bash
# 本番環境にデプロイ
npm run build:worker

# または直接
cd apps/worker
npx wrangler deploy --env production
```

デプロイ後、以下のようなURLが表示されます:
```
https://snapshare-url-shortener.your-subdomain.workers.dev
```

#### Step 4: デプロイ確認

```bash
# ヘルスチェック
curl https://snapshare-url-shortener.your-subdomain.workers.dev/health
```

### Next.jsアプリの環境変数を更新

Vercelの環境変数に追加:

```bash
NEXT_PUBLIC_WORKER_URL=https://snapshare-url-shortener.your-subdomain.workers.dev
```

## トラブルシューティング

### 問題1: Workerが起動しない

**症状:**
```
Error: No Worker found
```

**解決方法:**
```bash
# wrangler.tomlが正しいか確認
cat apps/worker/wrangler.toml

# ログインし直す
npx wrangler logout
npx wrangler login
```

### 問題2: KVに接続できない

**症状:**
```
Error: KVNamespace not found
```

**解決方法:**
```bash
# KVネームスペースを再作成
npx wrangler kv:namespace create "URL_SHORTENER"

# wrangler.tomlのIDを更新
```

### 問題3: CORSエラー

**症状:**
```
Access to fetch blocked by CORS policy
```

**解決方法:**

`apps/worker/src/index.ts`で CORS ヘッダーを確認:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// すべてのレスポンスにCORSヘッダーを追加
return new Response(body, {
  headers: { ...headers, ...corsHeaders },
});
```

### 問題4: デプロイ後に404エラー

**症状:**
Worker URLにアクセスすると404

**解決方法:**
```bash
# Worker URLを確認
npx wrangler whoami

# デプロイログを確認
npx wrangler tail
```

### 問題5: 型エラー

**症状:**
```
Cannot find module '@snapshare/shared'
```

**解決方法:**
```bash
# モノレポルートで依存関係を再インストール
cd ../..
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

## パフォーマンステスト

### 負荷テスト（オプション）

```bash
# Apache Benchでテスト（要インストール）
ab -n 1000 -c 10 https://your-worker.workers.dev/health

# 期待される結果:
# - Requests per second: > 1000
# - Time per request: < 10ms
```

## セキュリティチェックリスト

実装後、以下を確認:

- [ ] 本番環境で `ALLOWED_ORIGIN` を特定ドメインに制限
- [ ] S3 URL以外の短縮を拒否（本番環境）
- [ ] KVのTTL設定が正しい
- [ ] エラーメッセージに機密情報を含まない
- [ ] ログに個人情報を出力しない

## 次のステップ

実装が完了したら：

1. [x] ローカルでテスト
2. [ ] ステージング環境にデプロイ
3. [ ] Next.jsアプリと連携テスト
4. [ ] 本番環境にデプロイ
5. [ ] 監視・アラート設定

## 参考資料

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [KV Storage API](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Worker設計書](./worker-design.md)
