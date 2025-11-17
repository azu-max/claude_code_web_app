# SnapShare - Claude Code プロジェクトガイド

このファイルは、Claude Codeがこのプロジェクトを理解し、効果的にサポートするためのガイドです。

## プロジェクト概要

**SnapShare**は、Next.js + TypeScript + AWS S3を使用したファイル共有・ギャラリーアプリケーションです。

### 目的
- AWS S3を活用したファイル管理システムの構築
- Next.js + TypeScriptでのモダンなWebアプリケーション開発の学習
- セキュアなファイル共有機能の実装

### 現在のフェーズ
**フェーズ1（MVP）** - 基本機能の実装中

## 技術スタック

```yaml
Frontend:
  Framework: Next.js 14 (App Router)
  Language: TypeScript
  Styling: Tailwind CSS
  Icons: Heroicons or Lucide React

Backend:
  API: Next.js API Routes
  Authentication: Basic Auth (Middleware)

Infrastructure:
  Storage: AWS S3
  Deployment: Vercel

Development:
  Linter: ESLint
  Formatter: Prettier
  Version Control: Git/GitHub
```

## プロジェクト構造

```
snapshare/
├── docs/                           # 📚 すべての設計ドキュメント
│   ├── requirements.md             # 要件定義書
│   ├── data-structure.md           # データ構造定義
│   ├── sequence-diagrams.md        # シーケンス図
│   ├── system-design.md            # システム設計書
│   ├── implementation-guide.md     # 実装ガイド
│   ├── coding-standards.md         # コーディング規約
│   └── design-guide.md             # デザインガイド
│
├── src/                            # ソースコード（未実装）
│   ├── app/                        # Next.js App Router
│   ├── components/                 # Reactコンポーネント
│   ├── lib/                        # ユーティリティ・ライブラリ
│   ├── types/                      # TypeScript型定義
│   ├── hooks/                      # カスタムフック
│   └── middleware.ts               # Basic認証
│
└── README.md                       # プロジェクト概要
```

## 重要なドキュメント

コードを書く前に必ず参照すべきドキュメント：

1. **コーディング規約** (`docs/coding-standards.md`)
   - 命名規則、TypeScriptパターン、Reactベストプラクティス

2. **デザインガイド** (`docs/design-guide.md`)
   - カラーパレット、コンポーネントスタイル、レスポンシブ設計

3. **システム設計書** (`docs/system-design.md`)
   - API設計、ディレクトリ構造、コンポーネント設計

4. **データ構造定義** (`docs/data-structure.md`)
   - TypeScript型定義、S3構造、APIレスポンス形式

## コーディングガイドライン

### 命名規則

```typescript
// ファイル名
✅ FileUploader.tsx          (コンポーネント: PascalCase)
✅ file-validator.ts         (その他: kebab-case)

// 変数・関数
✅ const isUploading = false;        (boolean: is/has/should)
✅ const MAX_FILE_SIZE = 10485760;   (定数: UPPER_SNAKE_CASE)
✅ function uploadFile() {}          (関数: camelCase)

// 型定義
✅ interface FileItem {}             (interface: PascalCase)
✅ type UploadStatus = ...           (type: PascalCase)
```

### TypeScript

```typescript
// ✅ 型を明示
function calculateSize(size: number): string { }

// ✅ Optional chaining
const fileName = file?.metadata?.originalname;

// ✅ Nullish coalescing
const userName = user.name ?? 'Anonymous';

// ❌ any を避ける
function processData(data: any) { }  // NG
```

### React/Next.js

```typescript
// ✅ Named export を使用
export function FileUploader({ onSuccess }: Props) { }

// ✅ Props の型定義
interface FileUploaderProps {
  onSuccess: (file: FileItem) => void;
  maxSize?: number;
}

// ✅ イベントハンドラーは handle で始める
const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => { };
```

### Tailwind CSS

```tsx
// ✅ 論理的な順序でクラス名を記述
// 1. レイアウト, 2. ボックスモデル, 3. 視覚効果, 4. テキスト, 5. その他
<div className="flex items-center w-full p-4 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">

// ✅ Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">
```

## API設計

### エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| POST | `/api/upload` | ファイルアップロード |
| GET | `/api/files` | ファイル一覧取得 |
| POST | `/api/share` | 共有リンク生成 |

### レスポンス形式

```typescript
// 成功レスポンス
{
  "success": true,
  "data": { /* データ */ }
}

// エラーレスポンス
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## 環境変数

```bash
# AWS設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET_NAME=snapshare-uploads-production

# Basic認証
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your_password

# アプリURL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 実装の優先順位

### フェーズ1（MVP）実装順序

1. ✅ プロジェクトセットアップ
2. ✅ ドキュメント作成
3. ⬜ **Next.js プロジェクト作成** ← 次はここ
4. ⬜ AWS S3 セットアップ
5. ⬜ Basic認証実装
6. ⬜ ファイルアップロード機能
7. ⬜ ギャラリー表示機能
8. ⬜ プレビュー機能
9. ⬜ 共有リンク生成機能
10. ⬜ UI/UX改善
11. ⬜ デプロイ

## セキュリティチェックリスト

コードを書く際は以下を確認：

- [ ] AWS認証情報は環境変数で管理
- [ ] クライアントサイドでAWS秘密鍵を露出していない
- [ ] ファイルアップロードのバリデーション実装
- [ ] XSS対策（サニタイズ）実装
- [ ] 署名付きURLに有効期限を設定

## コミット規約

```bash
# フォーマット: <type>: <subject>

feat: ファイルアップロードAPI実装
fix: ギャラリー表示のバグ修正
docs: README更新
style: Prettier適用
refactor: S3クライアントを関数化
```

## デバッグのヒント

### よくある問題

**S3アップロードエラー**
```bash
# IAMポリシーを確認
# - s3:PutObject
# - s3:GetObject
# - s3:ListBucket
```

**画像が表示されない**
```bash
# S3のCORS設定を確認
# 署名付きURLの有効期限を確認
```

## テスト項目

実装完了時に確認すべき項目：

- [ ] ファイルアップロード（10MB以下）
- [ ] ファイルアップロード（10MB超過でエラー）
- [ ] ギャラリー表示（日付順ソート）
- [ ] プレビューモーダル
- [ ] 共有リンク生成
- [ ] モバイル表示（375px）
- [ ] タブレット表示（768px）
- [ ] デスクトップ表示（1920px）

## Claude Codeへの指示

### コードを書く際の注意点

1. **ドキュメント優先**: 実装前に必ず `docs/` のドキュメントを参照
2. **規約遵守**: `coding-standards.md` と `design-guide.md` に従う
3. **段階的実装**: 実装ガイドの順序に従って進める
4. **型安全性**: TypeScriptの型を適切に定義
5. **レスポンシブ**: Mobile-firstで実装

### ファイル作成時

- コンポーネントは必ず `src/components/` 配下に作成
- API Routesは `src/app/api/` 配下に作成
- 型定義は `src/types/` 配下に作成
- ユーティリティは `src/lib/` 配下に作成

### コードレビュー

実装後は以下を確認：

- TypeScriptの型エラーがないか
- ESLintエラーがないか
- console.logを削除したか
- コメントが適切か
- セキュリティチェック完了したか

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [AWS SDK v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

## クイックリファレンス

### よく使うコマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run lint         # リント実行
git status           # Git状態確認
git add .            # 変更をステージ
git commit -m "..."  # コミット
git push             # プッシュ
```

### ディレクトリ作成コマンド

```bash
# プロジェクト構造を作成する場合
mkdir -p src/{app/{api/{upload,files,share},qr/upload},components/{ui,features/{upload,gallery,share},layouts},lib/{aws,validators,utils},types,hooks,constants}
```

---

## 次のアクション

現在、設計フェーズは完了しました。次は：

1. Next.jsプロジェクトのセットアップ
2. AWS S3バケットの作成とIAM設定
3. Basic認証の実装

実装を開始する際は、`docs/implementation-guide.md` を参照してください。

---

**Note to Claude Code**: このプロジェクトは学習目的です。ユーザーと一緒に、丁寧に説明しながら実装を進めてください。
