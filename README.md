# SnapShare

ファイル共有とギャラリー機能を持つWebアプリケーション。画像やドキュメントをAWS S3にアップロードし、共有リンクを生成できます。

## 📌 プロジェクト概要

**SnapShare**は、Next.js + TypeScript + AWS S3 + Cloudflare Workersを使用したモダンなファイル共有アプリケーションです。シンプルで直感的なUIで、画像のアップロード、ギャラリー表示、共有リンクの生成が可能です。

### 🏗️ モノレポ構成

このプロジェクトはモノレポ（Monorepo）構成で、複数のアプリケーションとパッケージが1つのリポジトリで管理されています：

- **`apps/web`**: Next.jsのメインアプリケーション（ファイル共有UI）
- **`apps/worker`**: Cloudflare Workers（URL短縮サービス）
- **`packages/shared`**: 共通の型定義とユーティリティ

### 主な機能（フェーズ1）

- ✅ ファイルアップロード（ドラッグ&ドロップ対応）
- ✅ ギャラリー表示（レスポンシブグリッド）
- ✅ 画像プレビュー（モーダル）
- ✅ 共有リンク生成（署名付きURL）
- ✅ Basic認証

### 将来の機能（フェーズ2）

- 🔜 QRコード経由アップロード（スマホ連携）
- 🔜 Lambda自動画像処理
- 🔜 ファイル削除機能
- 🔜 PDFファイル対応

## 🛠 技術スタック

### Webアプリ（apps/web）
- **フロントエンド**: Next.js 14 (App Router), React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Next.js API Routes
- **ストレージ**: AWS S3
- **デプロイ**: Vercel
- **認証**: Basic認証（Next.js Middleware）

### URL短縮サービス（apps/worker）
- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Storage**: Cloudflare KV
- **Build Tool**: Wrangler

### 共通パッケージ（packages/shared）
- TypeScript型定義
- 共通ユーティリティ関数

## 📁 ドキュメント

プロジェクトの詳細なドキュメントは`docs/`ディレクトリにあります：

### 設計ドキュメント

| ドキュメント | 説明 | パス |
|------------|------|------|
| **要件定義書** | プロジェクトの目的、機能要件、非機能要件 | [docs/requirements.md](docs/requirements.md) |
| **データ構造定義** | S3構造、型定義、API仕様 | [docs/data-structure.md](docs/data-structure.md) |
| **シーケンス図** | 主要機能のフロー図（Mermaid形式） | [docs/sequence-diagrams.md](docs/sequence-diagrams.md) |
| **システム設計書** | アーキテクチャ、ディレクトリ構成、API設計 | [docs/system-design.md](docs/system-design.md) |

### 実装ドキュメント

| ドキュメント | 説明 | パス |
|------------|------|------|
| **実装ガイド** | 開発フロー、テスト方法、レビュー基準 | [docs/implementation-guide.md](docs/implementation-guide.md) |
| **コーディング規約** | TypeScript、React、Tailwindの規約 | [docs/coding-standards.md](docs/coding-standards.md) |
| **デザインガイド** | カラー、タイポグラフィ、コンポーネント | [docs/design-guide.md](docs/design-guide.md) |

## 🚀 クイックスタート

### 前提条件

- Node.js 18以上
- npm または yarn
- AWS アカウント（S3バケット作成済み）
- Cloudflareアカウント（URL短縮機能を使う場合）

### セットアップ手順

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd snapshare

# 2. 依存関係をインストール（モノレポ全体）
npm install

# 3. 環境変数ファイルを作成
# Webアプリ用
cp apps/web/.env.example apps/web/.env.local

# 4. apps/web/.env.local を編集して以下を設定
# AWS_REGION=ap-northeast-1
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_S3_BUCKET_NAME=your_bucket_name
# BASIC_AUTH_USER=admin
# BASIC_AUTH_PASSWORD=your_password

# 5. 開発サーバー起動
# Webアプリのみ起動
npm run dev:web

# または両方同時に起動
npm run dev
```

### アクセス

- **Webアプリ**: http://localhost:3000
- **Worker**: http://localhost:8787 (dev:workerを実行した場合)

## 📋 開発フロー

### 実装の順序

実装は以下の順序で進めることを推奨します：

1. ✅ プロジェクトセットアップ
2. ⬜ AWS S3セットアップ
3. 🔄 Basic認証実装（実装中）
4. ⬜ ファイルアップロード機能
5. ⬜ ギャラリー表示機能
6. ⬜ プレビュー機能
7. ⬜ 共有リンク生成機能
8. ⬜ UI/UX改善
9. ⬜ デプロイ
10. ⬜ 最終テスト

詳細は [実装ガイド](docs/implementation-guide.md) を参照してください。

### 開発コマンド

```bash
# 全プロジェクトの開発サーバー起動
npm run dev

# 個別起動
npm run dev:web        # Webアプリのみ
npm run dev:worker     # Workerのみ

# ビルド
npm run build          # 全プロジェクト
npm run build:web      # Webアプリのみ
npm run build:worker   # Workerデプロイ

# 型チェック
npm run type-check     # 全プロジェクト

# リント
npm run lint           # Webアプリのみ
```

詳細は各プロジェクトのREADMEを参照：
- [Webアプリ README](apps/web/README.md)（※要作成）
- [Worker README](apps/worker/README.md)

## 🏗 ディレクトリ構造

```
snapshare/ (モノレポルート)
├── apps/
│   ├── web/                    # Next.jsアプリケーション
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   ├── components/     # Reactコンポーネント
│   │   │   ├── lib/            # ユーティリティ
│   │   │   └── types/          # 型定義
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   └── worker/                 # Cloudflare Workers
│       ├── src/
│       │   └── index.ts        # Workerエントリーポイント
│       ├── package.json
│       ├── wrangler.toml       # Cloudflare設定
│       └── README.md
│
├── packages/
│   └── shared/                 # 共通パッケージ
│       ├── src/
│       │   ├── types.ts        # 共通型定義
│       │   └── index.ts
│       └── package.json
│
├── docs/                       # ドキュメント
├── package.json                # モノレポルート設定
└── README.md                   # このファイル
```

詳細は [システム設計書](docs/system-design.md) を参照してください。

## 🔐 環境変数

### Webアプリ（apps/web/.env.local）

```bash
# AWS設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=snapshare-uploads-production

# Basic認証
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your_secure_password

# アプリケーションURL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Worker URL（URL短縮機能を使う場合）
NEXT_PUBLIC_WORKER_URL=https://your-worker.workers.dev
```

### Cloudflare Worker（apps/worker/wrangler.toml）

KVネームスペースのIDを設定（デプロイ時のみ必要）:

```toml
[[kv_namespaces]]
binding = "URL_SHORTENER"
id = "your_kv_namespace_id"
```

**重要**: `.env.local`は絶対にGitにコミットしないでください！

## 🧪 テスト

### 手動テスト

主要機能のテスト項目：

- [ ] ファイルアップロード（正常系・異常系）
- [ ] ギャラリー表示
- [ ] プレビューモーダル
- [ ] 共有リンク生成
- [ ] Basic認証
- [ ] レスポンシブ表示（3サイズ）

詳細は [実装ガイド](docs/implementation-guide.md#テスト方法) を参照してください。

## 🚢 デプロイ

### Vercelへのデプロイ

```bash
# 1. Vercel CLIインストール
npm install -g vercel

# 2. デプロイ
vercel

# 3. 環境変数を設定（Vercelダッシュボードから）
# - AWS認証情報
# - Basic認証情報
```

詳細は [システム設計書](docs/system-design.md#デプロイ設計) を参照してください。

## 📖 学習リソース

このプロジェクトで学べること：

- ✅ Next.js 14 App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ AWS S3の操作
- ✅ ファイルアップロード処理
- ✅ レスポンシブデザイン
- ✅ Vercelデプロイ

### 参考ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

## 🤝 コントリビューション

このプロジェクトは学習目的で作成されています。

コードを書く前に以下を確認してください：

1. [コーディング規約](docs/coding-standards.md)
2. [デザインガイド](docs/design-guide.md)
3. [実装ガイド](docs/implementation-guide.md)

## 📝 ライセンス

MIT

## 👤 作成者

SnapShare開発チーム

---

## 🎯 次のステップ

1. ✅ ドキュメントを読む
2. ⬜ 環境構築（Node.js, AWS）
3. ⬜ プロジェクトセットアップ
4. ⬜ Basic認証実装から開始
5. ⬜ 各機能を順次実装

詳細は [実装ガイド](docs/implementation-guide.md) を参照してください。

**Let's build SnapShare together!**
