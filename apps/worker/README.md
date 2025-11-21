# SnapShare URL Shortener Worker

Cloudflare Workersで動作するURL短縮サービス

## 概要

SnapShareの共有リンクを短縮URLに変換し、グローバルに高速なリダイレクトを提供します。

## 機能

- **URL短縮**: 長いS3署名付きURLを短い6文字のコードに変換
- **高速リダイレクト**: Cloudflareのエッジネットワークで世界中どこでも高速アクセス
- **有効期限管理**: リンクに有効期限を設定可能
- **アクセス統計**: アクセス回数を追跡（将来実装予定）

## エンドポイント

### ヘルスチェック
```
GET /health
```

レスポンス:
```json
{
  "status": "ok",
  "service": "snapshare-url-shortener",
  "timestamp": "2024-11-21T00:00:00.000Z"
}
```

### URL短縮
```
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://s3.amazonaws.com/...",
  "expiresIn": 604800  // 7日間（秒）
}
```

レスポンス:
```json
{
  "success": true,
  "data": {
    "shortCode": "AbC123",
    "shortUrl": "https://your-worker.workers.dev/s/AbC123",
    "originalUrl": "https://s3.amazonaws.com/...",
    "expiresAt": "2024-11-28T00:00:00.000Z"
  }
}
```

### リダイレクト
```
GET /s/:shortCode
```

短縮URLから元のURLへリダイレクト（302）

## セットアップ

### 1. 依存関係のインストール

```bash
# モノレポのルートで
npm install

# またはworkerディレクトリで
cd apps/worker
npm install
```

### 2. KVネームスペースの作成

```bash
# 本番用
wrangler kv:namespace create "URL_SHORTENER"

# 開発用
wrangler kv:namespace create "URL_SHORTENER" --preview
```

### 3. wrangler.tomlの設定

作成されたKV NamespaceのIDを`wrangler.toml`に追加:

```toml
[[kv_namespaces]]
binding = "URL_SHORTENER"
id = "your_kv_namespace_id"
preview_id = "your_preview_kv_namespace_id"
```

## 開発

### ローカル開発サーバー起動

```bash
# モノレポのルートで
npm run dev:worker

# またはworkerディレクトリで
npm run dev
```

http://localhost:8787 でアクセス可能

### テスト

```bash
# ヘルスチェック
curl http://localhost:8787/health

# URL短縮
curl -X POST http://localhost:8787/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com/very/long/url"}'

# リダイレクト
curl -L http://localhost:8787/s/AbC123
```

## デプロイ

### Cloudflare Workersにデプロイ

```bash
# モノレポのルートで
npm run build:worker

# またはworkerディレクトリで
npm run deploy
```

## 技術スタック

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Storage**: Cloudflare KV
- **Build Tool**: Wrangler

## アーキテクチャ

```
[ユーザー] → [Next.js App] → [Worker: /api/shorten] → [KV: shortCode → URL]
                                         ↓
                            [Worker: /s/:code] → [Redirect]
```

## 料金

Cloudflare Workers 無料プラン:
- 1日 100,000 リクエスト
- KV: 100,000 read/day

※小規模プロジェクトでは完全無料で運用可能

## 今後の実装予定

- [ ] KVストレージの実装
- [ ] カスタム短縮コード対応
- [ ] アクセス統計機能
- [ ] QRコード生成
- [ ] パスワード保護
- [ ] アクセス回数制限

## トラブルシューティング

### Workerが起動しない
- wrangler.tomlの設定を確認
- `wrangler login`でログインしているか確認

### KVに保存できない
- KVネームスペースのIDが正しいか確認
- bindingの名前が一致しているか確認

## 参考リンク

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [KV Storage](https://developers.cloudflare.com/workers/runtime-apis/kv/)
