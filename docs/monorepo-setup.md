# モノレポ構成ガイド

## 概要

SnapShareはモノレポ（Monorepo）構成を採用しています。これにより、複数のアプリケーションとパッケージを1つのリポジトリで効率的に管理できます。

## モノレポのメリット

### 1. コードの再利用
共通の型定義やユーティリティを`packages/shared`で一元管理し、複数のプロジェクトで使用できます。

### 2. 一貫性の確保
- TypeScriptのバージョンを統一
- コーディング規約を共有
- 依存関係の管理を簡素化

### 3. 開発効率の向上
- 1つのリポジトリで全体を把握
- コミットで複数プロジェクトを同時に更新
- 型定義の変更が即座に反映

## プロジェクト構成

```
snapshare/
├── apps/              # アプリケーション
│   ├── web/          # Next.jsアプリ（メインUI）
│   └── worker/       # Cloudflare Workers（URL短縮）
│
├── packages/         # 共有パッケージ
│   └── shared/       # 共通の型定義
│
├── docs/             # ドキュメント
└── package.json      # ルート設定
```

## npm workspaces

このプロジェクトは **npm workspaces** を使用してモノレポを管理しています。

### ルート package.json

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

これにより、`apps/`と`packages/`配下のすべてのプロジェクトが1つのworkspaceとして管理されます。

## 依存関係の管理

### インストール

```bash
# ルートで実行すると、すべてのworkspaceの依存関係がインストールされる
npm install

# 特定のworkspaceにパッケージを追加
npm install react --workspace=apps/web
npm install wrangler --workspace=apps/worker
```

### パッケージ間の参照

`packages/shared`を他のプロジェクトから参照する例：

**apps/web/package.json:**
```json
{
  "dependencies": {
    "@snapshare/shared": "*"
  }
}
```

**apps/web/src/types/index.ts:**
```typescript
import { ShortLink, ShortenUrlRequest } from '@snapshare/shared';
```

## 開発フロー

### すべてのプロジェクトを起動

```bash
npm run dev
```

これにより：
- `apps/web` の開発サーバーが起動（http://localhost:3000）
- `apps/worker` の開発サーバーが起動（http://localhost:8787）

### 個別に起動

```bash
# Webアプリのみ
npm run dev:web

# Workerのみ
npm run dev:worker
```

### 型チェック

```bash
# すべてのプロジェクト
npm run type-check

# 特定のプロジェクト
npm run type-check --workspace=apps/web
```

## 共通パッケージの使い方

### packages/shared の役割

Webアプリ（Next.js）とWorker（Cloudflare Workers）で共有される型定義を管理します。

### 型定義の追加

**packages/shared/src/types.ts:**
```typescript
export interface NewFeature {
  id: string;
  name: string;
}
```

**packages/shared/src/index.ts:**
```typescript
export * from './types';
```

### 他のプロジェクトから使用

**apps/web/src/app/api/example/route.ts:**
```typescript
import { NewFeature } from '@snapshare/shared';

export async function GET() {
  const feature: NewFeature = {
    id: '1',
    name: 'Example',
  };

  return Response.json(feature);
}
```

**apps/worker/src/index.ts:**
```typescript
import { NewFeature } from '@snapshare/shared';

export default {
  async fetch(request: Request): Promise<Response> {
    const feature: NewFeature = {
      id: '1',
      name: 'Example',
    };

    return Response.json(feature);
  },
};
```

## ベストプラクティス

### 1. 型定義は共通化

WebアプリとWorker間でやり取りするデータの型定義は、必ず`packages/shared`に配置してください。

**良い例:**
```typescript
// packages/shared/src/types.ts
export interface ShortenUrlRequest {
  originalUrl: string;
  expiresIn?: number;
}

// apps/web と apps/worker の両方で使用
```

**悪い例:**
```typescript
// apps/web/src/types/worker.ts
interface ShortenUrlRequest { ... }  // Workerと重複！
```

### 2. 共通ユーティリティも追加可能

型定義だけでなく、共通のユーティリティ関数も`packages/shared`に配置できます。

**packages/shared/src/utils.ts:**
```typescript
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### 3. 各プロジェクトは独立してデプロイ

- `apps/web` → Vercelにデプロイ
- `apps/worker` → Cloudflare Workersにデプロイ

それぞれ独立してデプロイできますが、型定義は共有されているため一貫性が保たれます。

## トラブルシューティング

### 型が解決されない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### workspaceが認識されない

ルートの`package.json`に`workspaces`フィールドがあることを確認してください。

### 共通パッケージの変更が反映されない

開発サーバーを再起動してください：

```bash
# Ctrl+C で停止
npm run dev:web  # 再起動
```

## 将来の拡張

モノレポ構成により、将来的に以下のような拡張が容易になります：

### 新しいアプリの追加
```bash
mkdir apps/admin
cd apps/admin
npm init -y
```

### 新しい共通パッケージの追加
```bash
mkdir packages/ui-components
cd packages/ui-components
npm init -y
```

### CI/CDの設定
変更されたプロジェクトのみをビルド・デプロイするように設定可能：

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy-web:
    if: contains(github.event.head_commit.modified, 'apps/web/')
    # ...

  deploy-worker:
    if: contains(github.event.head_commit.modified, 'apps/worker/')
    # ...
```

## まとめ

モノレポ構成により、SnapShareプロジェクトは：

- ✅ 型定義を一元管理
- ✅ コードの重複を削減
- ✅ 開発効率を向上
- ✅ 将来の拡張が容易

各プロジェクトは独立してデプロイできますが、共通の型定義により一貫性が保たれます。
