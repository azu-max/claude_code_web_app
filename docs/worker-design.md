# Cloudflare Workers 設計書

## 概要

SnapShareプロジェクトのURL短縮機能をCloudflare Workersで実装します。この設計書では、Workerのアーキテクチャ、API設計、データ構造、およびNext.jsアプリとの連携方法について説明します。

## 目的

### 主な目的

1. **S3署名付きURLの短縮**: 長いS3の署名付きURLを短い6文字のコードに変換
2. **グローバルな高速アクセス**: Cloudflareのエッジネットワークで世界中どこでも高速レスポンス
3. **型安全な実装**: TypeScriptとモノレポの共通型定義で一貫性を保証
4. **スケーラブルな設計**: アクセス増加に自動対応

### ユースケース

```
[ユーザー] SnapShareでファイルをアップロード
    ↓
[Next.js] S3にファイル保存、署名付きURL生成
    ↓
[Next.js] Workerに短縮リクエスト送信
    ↓
[Worker] 短縮コード生成、KVに保存
    ↓
[Next.js] 短縮URLをユーザーに表示
    ↓
[他のユーザー] 短縮URLにアクセス
    ↓
[Worker] KVから元のURL取得、リダイレクト
```

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                      SnapShare System                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐              │
│  │   Next.js    │         │   Cloudflare │              │
│  │   Web App    │◄───────►│    Workers   │              │
│  │  (Vercel)    │  HTTPS  │  (Edge Net)  │              │
│  └──────┬───────┘         └──────┬───────┘              │
│         │                        │                       │
│         │                        │                       │
│         ▼                        ▼                       │
│  ┌──────────────┐         ┌──────────────┐              │
│  │   AWS S3     │         │ Cloudflare   │              │
│  │   Storage    │         │      KV      │              │
│  └──────────────┘         └──────────────┘              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### コンポーネント間通信

#### 1. ファイルアップロード時（URL短縮生成）

```typescript
// Next.js → Worker
POST https://your-worker.workers.dev/api/shorten
Content-Type: application/json

{
  "originalUrl": "https://snapshare-uploads.s3.amazonaws.com/...",
  "expiresIn": 604800,  // 7日間（秒）
  "metadata": {
    "fileName": "image.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg"
  }
}

// Worker → Next.js
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "shortCode": "AbC123",
    "shortUrl": "https://your-worker.workers.dev/s/AbC123",
    "originalUrl": "https://snapshare-uploads.s3.amazonaws.com/...",
    "expiresAt": "2024-11-28T00:00:00.000Z"
  }
}
```

#### 2. 短縮URLアクセス時（リダイレクト）

```
User → Worker: GET /s/AbC123
Worker → KV: GET "AbC123"
KV → Worker: { originalUrl: "...", expiresAt: "..." }
Worker → User: HTTP 302 Redirect to originalUrl
```

## API設計

### エンドポイント一覧

| メソッド | パス | 説明 | レスポンス |
|---------|------|------|-----------|
| GET | `/health` | ヘルスチェック | 200 OK |
| POST | `/api/shorten` | URL短縮 | 201 Created |
| GET | `/s/:shortCode` | リダイレクト | 302 Found / 404 Not Found / 410 Gone |

### 詳細仕様

#### 1. ヘルスチェック

**リクエスト:**
```
GET /health
```

**レスポンス:**
```json
{
  "status": "ok",
  "service": "snapshare-url-shortener",
  "timestamp": "2024-11-21T00:00:00.000Z"
}
```

#### 2. URL短縮

**リクエスト:**
```
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": string,        // 必須: 短縮したいURL
  "expiresIn": number,          // オプション: 有効期限（秒）デフォルト: 604800(7日)
  "metadata": {                 // オプション: メタデータ
    "fileName": string,
    "fileSize": number,
    "mimeType": string
  }
}
```

**レスポンス（成功）:**
```json
{
  "success": true,
  "data": {
    "shortCode": "AbC123",
    "shortUrl": "https://your-worker.workers.dev/s/AbC123",
    "originalUrl": "https://...",
    "expiresAt": "2024-11-28T00:00:00.000Z"
  }
}
```

**レスポンス（エラー）:**
```json
{
  "success": false,
  "error": "originalUrl is required"
}
```

**ステータスコード:**
- `201 Created`: 正常に作成
- `400 Bad Request`: リクエストが不正
- `500 Internal Server Error`: サーバーエラー

#### 3. リダイレクト

**リクエスト:**
```
GET /s/:shortCode
```

**レスポンス:**
- `302 Found`: 元のURLへリダイレクト
- `404 Not Found`: 短縮コードが存在しない
- `410 Gone`: 有効期限切れ

## データ構造

### Cloudflare KVストレージ

#### キーバリューペア構造

```typescript
// Key
shortCode: string  // 例: "AbC123"

// Value (JSON文字列)
{
  "shortCode": "AbC123",
  "originalUrl": "https://...",
  "createdAt": "2024-11-21T00:00:00.000Z",
  "expiresAt": "2024-11-28T00:00:00.000Z",
  "accessCount": 0,
  "metadata": {
    "fileName": "image.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

#### KVの設定

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "URL_SHORTENER"
id = "your_kv_namespace_id"
preview_id = "your_preview_kv_namespace_id"
```

**KVの特性:**
- **読み取り**: 非常に高速（グローバルに分散）
- **書き込み**: 最終的に一貫性（eventual consistency）
- **有効期限**: TTL（Time To Live）をサポート
- **容量**: キー最大512バイト、値最大25MB

### 共通型定義（@snapshare/shared）

```typescript
// packages/shared/src/types.ts

export interface ShortLink {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
  accessCount?: number;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface ShortenUrlRequest {
  originalUrl: string;
  expiresIn?: number;
  metadata?: ShortLink['metadata'];
}

export interface ShortenUrlResponse {
  success: true;
  data: {
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    expiresAt?: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}
```

## セキュリティ設計

### 1. CORS設定

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

本番環境では、`ALLOWED_ORIGIN`を特定のドメインに制限：
```toml
# wrangler.toml
[env.production]
vars = { ALLOWED_ORIGIN = "https://snapshare.example.com" }
```

### 2. レート制限

将来的に実装予定：
- IPアドレスごとに1分間に10リクエストまで
- Cloudflare Workers KVまたはDurable Objectsで管理

### 3. 短縮コードの生成

**要件:**
- 長さ: 6文字
- 文字種: A-Z, a-z, 0-9（62文字）
- 衝突確率: 62^6 = 約560億通り

**生成アルゴリズム:**
```typescript
function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

**衝突対策:**
- KVに既に存在するかチェック
- 存在する場合は再生成（最大3回まで試行）

### 4. URL検証

```typescript
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // S3 URLのみ許可（本番環境）
    return parsed.hostname.endsWith('.amazonaws.com');
  } catch {
    return false;
  }
}
```

## パフォーマンス設計

### 目標レスポンス時間

| エンドポイント | 目標時間 | 説明 |
|--------------|---------|------|
| `/health` | < 10ms | ヘルスチェック |
| `/api/shorten` | < 50ms | URL短縮（KV書き込み） |
| `/s/:code` | < 30ms | リダイレクト（KV読み取り） |

### 最適化手法

#### 1. KV読み取りキャッシュ

Cloudflare KVは自動的にエッジでキャッシュされますが、以下の点に注意：

```typescript
// 読み取り時のキャッシュTTL
const linkData = await env.URL_SHORTENER.get(shortCode, {
  cacheTtl: 3600, // 1時間キャッシュ
});
```

#### 2. 軽量なレスポンス

```typescript
// 最小限のデータのみ返す
return Response.redirect(originalUrl, 302);  // ヘッダーのみ
```

#### 3. エラーハンドリング

```typescript
try {
  // 処理
} catch (error) {
  console.error('Worker error:', error);
  return new Response('Internal Server Error', { status: 500 });
}
```

## スケーラビリティ

### Cloudflare Workersの特性

- **自動スケール**: リクエスト数に応じて自動でスケール
- **グローバル配置**: 世界275以上の都市に自動デプロイ
- **レート**: 無料プラン 100,000 req/日、有料プラン 1000万 req/日

### KVのスケーラビリティ

- **読み取り**: 事実上無制限（エッジキャッシュ）
- **書き込み**: 1秒に1回/キー（最終的整合性）
- **容量**: ネームスペースあたり1GB（無料）、制限なし（有料）

## 監視・ログ設計

### 1. ログ出力

```typescript
// エラーログ
console.error('Failed to create short URL:', error);

// アクセスログ（将来実装）
console.log(`[${shortCode}] accessed from ${request.headers.get('cf-ipcountry')}`);
```

### 2. メトリクス（将来実装）

Cloudflare Analyticsで以下を監視：
- リクエスト数
- エラー率
- レスポンス時間
- リダイレクト成功率

### 3. アラート

- エラー率が5%を超えたら通知
- リクエスト数が急増したら通知

## デプロイ設計

### 環境分離

| 環境 | Worker名 | KV Namespace | 用途 |
|-----|---------|--------------|------|
| 開発 | snapshare-url-shortener-dev | preview_kv | ローカル開発 |
| ステージング | snapshare-url-shortener-staging | staging_kv | テスト |
| 本番 | snapshare-url-shortener | production_kv | 本番 |

### デプロイフロー

```bash
# 開発環境
wrangler dev

# ステージング環境
wrangler deploy --env staging

# 本番環境
wrangler deploy --env production
```

### CI/CD（将来実装）

```yaml
# .github/workflows/deploy-worker.yml
name: Deploy Worker
on:
  push:
    branches: [main]
    paths: ['apps/worker/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

## コスト見積もり

### Cloudflare Workers無料プラン

- **リクエスト**: 100,000/日
- **CPU時間**: 10ms/リクエスト
- **KV読み取り**: 100,000/日
- **KV書き込み**: 1,000/日
- **KVストレージ**: 1GB

### 想定使用量（月間）

| 項目 | 想定 | 無料枠 | 超過料金 |
|-----|------|--------|---------|
| リクエスト | 50,000 | 3,000,000 | ✅ 無料 |
| KV読み取り | 40,000 | 3,000,000 | ✅ 無料 |
| KV書き込み | 10,000 | 30,000 | ✅ 無料 |
| KVストレージ | 10MB | 1GB | ✅ 無料 |

**結論**: 小規模プロジェクトでは完全無料で運用可能

## 将来の拡張

### フェーズ2

- [ ] カスタム短縮コード対応
- [ ] パスワード保護機能
- [ ] QRコード生成API
- [ ] アクセス統計ダッシュボード

### フェーズ3

- [ ] Durable Objectsでリアルタイム統計
- [ ] Cloudflare R2で大容量ファイル直接保存
- [ ] WebSocketでリアルタイム通知

## まとめ

この設計により、SnapShareは：

- ✅ グローバルに高速なURL短縮機能を提供
- ✅ 型安全な実装で保守性を確保
- ✅ スケーラブルで信頼性の高いシステム
- ✅ 低コストで運用可能

次のステップは実装ガイドを参照してください。
