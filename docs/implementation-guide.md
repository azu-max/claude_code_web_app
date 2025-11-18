# SnapShare - 実装ガイド＆レビュー方法

## 📌 概要

このドキュメントでは、SnapShareの実装の進め方、開発フロー、コードレビュー方法、品質管理について定義します。

---

## 🚀 開発フロー

### 1. 全体の進め方

```
フェーズ1（MVP）の実装順序:

1. プロジェクトセットアップ
   ├─ Next.js プロジェクト作成
   ├─ TypeScript + Tailwind CSS 設定
   ├─ ディレクトリ構造作成
   └─ 環境変数設定

2. AWS S3 セットアップ
   ├─ S3バケット作成
   ├─ IAMユーザー/ポリシー設定
   └─ SDK動作確認

3. Basic認証実装
   ├─ Middleware作成
   └─ 認証テスト

4. ファイルアップロード機能
   ├─ API Route (/api/upload) 実装
   ├─ バリデーション実装
   ├─ S3アップロード処理実装
   ├─ FileUploader コンポーネント実装
   └─ 動作確認

5. ギャラリー表示機能
   ├─ API Route (/api/files) 実装
   ├─ S3ファイル一覧取得実装
   ├─ Gallery コンポーネント実装
   ├─ ImageCard コンポーネント実装
   └─ 動作確認

6. プレビュー機能
   ├─ ImagePreview モーダル実装
   └─ 動作確認

7. 共有リンク生成機能
   ├─ API Route (/api/share) 実装
   ├─ ShareButton コンポーネント実装
   └─ 動作確認

8. UI/UX 改善
   ├─ レスポンシブ対応
   ├─ ローディング状態
   ├─ エラーハンドリング
   └─ トースト通知

9. デプロイ
   ├─ Vercel設定
   ├─ 環境変数設定
   └─ 本番デプロイ

10. 最終テスト
    ├─ 機能テスト
    ├─ モバイルテスト
    └─ パフォーマンステスト
```

---

## 📅 推奨スケジュール

| ステップ | 作業内容 | 所要時間 | チェックポイント |
|---------|---------|---------|-----------------|
| 1 | プロジェクトセットアップ | 0.5日 | `npm run dev` で起動確認 |
| 2 | AWS S3セットアップ | 0.5日 | S3バケット作成、SDK接続確認 |
| 3 | Basic認証実装 | 0.5日 | 認証ダイアログ表示確認 |
| 4 | ファイルアップロード機能 | 1日 | ファイルがS3に保存される |
| 5 | ギャラリー表示機能 | 1日 | アップロード画像が一覧表示 |
| 6 | プレビュー機能 | 0.5日 | モーダルで拡大表示 |
| 7 | 共有リンク生成機能 | 0.5日 | リンクコピー＆アクセス確認 |
| 8 | UI/UX改善 | 1日 | レスポンシブ、エラー表示 |
| 9 | デプロイ | 0.5日 | Vercel本番環境で動作確認 |
| 10 | 最終テスト | 0.5日 | 全機能の動作確認 |

**合計**: 約6-7日

---

## 🔧 開発環境セットアップ

### 必要なツール

```bash
# Node.js (v18以上推奨)
node -v  # v18.17.0以上

# npm または yarn
npm -v   # 9.0.0以上

# Git
git -v   # 2.30.0以上

# VSCode (推奨エディタ)
code -v
```

### 推奨VSCode拡張機能

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "bradlc.vscode-tailwindcss",        // Tailwind CSS IntelliSense
    "ms-vscode.vscode-typescript-next", // TypeScript
    "formulahendry.auto-rename-tag",    // Auto Rename Tag
    "christian-kohler.path-intellisense" // Path IntelliSense
  ]
}
```

### 初回セットアップ手順

```bash
# 1. プロジェクト作成
npx create-next-app@latest snapshare --typescript --tailwind --app --src-dir

# 2. ディレクトリ移動
cd snapshare

# 3. 必要なパッケージをインストール
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid
npm install -D @types/uuid

# 4. 環境変数ファイル作成
cp .env.example .env.local

# 5. .env.local を編集（AWS認証情報等を設定）

# 6. 開発サーバー起動
npm run dev
```

---

## 📝 コーディングワークフロー

### 機能実装の標準フロー

```
1. ブランチ作成
   git checkout -b feature/upload-functionality

2. コード実装
   - 型定義を先に書く (types/)
   - ユーティリティ関数を実装 (lib/)
   - コンポーネント/API Routeを実装

3. 動作確認
   - ブラウザで手動テスト
   - console.log でデバッグ

4. コードフォーマット
   npm run lint
   npm run format

5. コミット
   git add .
   git commit -m "feat: ファイルアップロード機能を実装"

6. プッシュ
   git push origin feature/upload-functionality

7. マージ
   git checkout main
   git merge feature/upload-functionality
```

### コミットメッセージ規約

**フォーマット**: `<type>: <subject>`

**タイプ一覧**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: コードスタイル変更（動作に影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加/修正
- `chore`: ビルド設定等

**例**:
```
feat: ファイルアップロードAPI実装
fix: ギャラリー表示のバグを修正
docs: README更新
style: Prettier適用
refactor: S3クライアントを関数化
```

---

## 🔀 PR（プルリクエスト）戦略

### PR作成の基本方針

**小さく、頻繁に、レビューしやすく**

- ✅ 1つのPRは1つの機能または関心事に集中
- ✅ 変更ファイル数: **5〜10ファイル程度**を目安
- ✅ レビュー時間: 15〜30分で完了できる規模
- ✅ 動作確認: PRごとに動作確認可能な状態

### PR単位の例

#### ❌ 悪い例：大きすぎるPR

```
PR: ファイルアップロード機能の実装
変更ファイル数: 25ファイル

- 型定義
- バリデーション
- S3クライアント
- API Route
- コンポーネント（5個）
- スタイル
- テスト
```

**問題点**:
- レビューに1時間以上かかる
- バグが見つかった時の影響範囲が大きい
- マージ後の問題切り分けが困難

---

#### ✅ 良い例：適切に分割されたPR

**PR #1: 型定義とバリデーション**
```
変更ファイル数: 3ファイル

src/types/file.ts
src/lib/validators/file-validator.ts
src/constants/index.ts
```

**PR #2: S3クライアント設定**
```
変更ファイル数: 4ファイル

src/lib/aws/s3-client.ts
src/lib/aws/upload.ts
.env.example
README.md (環境変数のドキュメント更新)
```

**PR #3: アップロードAPI実装**
```
変更ファイル数: 2ファイル

src/app/api/upload/route.ts
src/types/api.ts (APIレスポンス型追加)
```

**PR #4: ファイルアップローダーUI（基本）**
```
変更ファイル数: 5ファイル

src/components/ui/Button.tsx
src/components/features/upload/FileUploader.tsx
src/hooks/useFileUpload.ts
src/app/page.tsx (統合)
src/app/globals.css (必要なスタイル)
```

**PR #5: ドラッグ&ドロップ機能追加**
```
変更ファイル数: 2ファイル

src/components/features/upload/DropZone.tsx
src/components/features/upload/FileUploader.tsx (統合)
```

**メリット**:
- 各PRは15分程度でレビュー可能
- 問題があれば特定のPRだけrevert
- 段階的に動作確認できる

---

### PR作成のガイドライン

#### 1. PRの範囲を決める

**1つのPRにまとめる基準**:
- ✅ 同じ機能/関心事に関連している
- ✅ お互いに依存関係がある
- ✅ 単独でテスト・レビューできる
- ✅ 5〜10ファイル以内

**別PRに分ける基準**:
- ❌ 異なる機能（アップロードとギャラリー）
- ❌ 依存関係がない（型定義と後からのUI改善）
- ❌ 10ファイル以上の変更になる

#### 2. PR作成時のチェックリスト

作成前に確認：

- [ ] 変更ファイル数は5〜10ファイル程度か？
- [ ] 1つの明確な目的があるか？
- [ ] PRタイトルで何をしたか明確か？
- [ ] 動作確認できる状態か？
- [ ] コミットメッセージは適切か？
- [ ] コンフリクトはないか？

#### 3. PRタイトル・説明のフォーマット

**タイトル**:
```
<type>: <簡潔な説明>

例:
feat: ファイルアップロード用の型定義とバリデーション実装
fix: ギャラリー表示のソート順を修正
```

**説明テンプレート**:
```markdown
## 概要
[何を実装したか簡潔に説明]

## 変更内容
- [ ] 型定義を追加
- [ ] バリデーション関数を実装
- [ ] 定数ファイルを作成

## 動作確認
- [ ] ビルドエラーなし (`npm run build`)
- [ ] リントエラーなし (`npm run lint`)
- [ ] 型エラーなし

## スクリーンショット
[必要に応じて画面キャプチャを添付]

## 関連PR
- 次のPR: #X (S3クライアント設定)
```

---

### PR分割の具体例（機能別）

#### Basic認証実装

**PR #1: Middleware実装**
- `src/middleware.ts`
- `.env.example`
- `README.md`

約3ファイル ✅

---

#### ファイルアップロード機能

**PR #1: 型定義・バリデーション**
- `src/types/file.ts`
- `src/lib/validators/file-validator.ts`
- `src/constants/index.ts`

約3ファイル ✅

**PR #2: S3設定**
- `src/lib/aws/s3-client.ts`
- `src/lib/aws/upload.ts`
- `src/lib/utils/uuid-generator.ts`
- `.env.example`

約4ファイル ✅

**PR #3: アップロードAPI**
- `src/app/api/upload/route.ts`
- `src/types/api.ts`

約2ファイル ✅

**PR #4: UI基本コンポーネント**
- `src/components/ui/Button.tsx`
- `src/components/ui/Spinner.tsx`
- `src/components/ui/Toast.tsx`

約3ファイル ✅

**PR #5: アップローダー実装**
- `src/components/features/upload/FileUploader.tsx`
- `src/components/features/upload/ProgressBar.tsx`
- `src/hooks/useFileUpload.ts`
- `src/app/page.tsx` (統合)

約4ファイル ✅

**PR #6: ドラッグ&ドロップ**
- `src/components/features/upload/DropZone.tsx`
- `src/components/features/upload/FileUploader.tsx` (更新)

約2ファイル ✅

---

#### ギャラリー表示機能

**PR #1: ファイル一覧API**
- `src/app/api/files/route.ts`
- `src/lib/aws/list-files.ts`
- `src/lib/aws/generate-presigned-url.ts`

約3ファイル ✅

**PR #2: ギャラリーコンポーネント**
- `src/components/features/gallery/Gallery.tsx`
- `src/components/features/gallery/GalleryGrid.tsx`
- `src/hooks/useGallery.ts`
- `src/app/page.tsx` (統合)

約4ファイル ✅

**PR #3: 画像カード**
- `src/components/features/gallery/ImageCard.tsx`
- `src/lib/utils/file-size-formatter.ts`
- `src/lib/utils/date-formatter.ts`

約3ファイル ✅

**PR #4: プレビューモーダル**
- `src/components/ui/Modal.tsx`
- `src/components/features/gallery/ImagePreview.tsx`

約2ファイル ✅

---

### PR作成の手順

```bash
# 1. 新しいブランチを作成
git checkout -b feat/file-validation

# 2. コード実装（5〜10ファイル程度）

# 3. 動作確認

# 4. コミット
git add .
git commit -m "feat: ファイルアップロード用の型定義とバリデーション実装"

# 5. プッシュ
git push origin feat/file-validation

# 6. GitHubでPR作成
# タイトル、説明、レビュワーを設定

# 7. レビュー対応

# 8. マージ

# 9. 次のPRのためにmainブランチを更新
git checkout main
git pull origin main
```

---

### PRマージ後のクリーンアップ

```bash
# ローカルブランチを削除
git branch -d feat/file-validation

# リモートブランチを削除（GitHubで自動削除設定推奨）
git push origin --delete feat/file-validation
```

---

### よくある質問

**Q: 10ファイルを超えそうな場合はどうする？**
A: 機能を論理的に分割してください。例えば、「型定義」と「実装」を別PRにする。

**Q: 1ファイルしか変更がない場合は？**
A: 問題ありません。小さいPRは歓迎です。

**Q: リファクタリングはどう扱う？**
A: 機能追加とは別PRにしてください。`refactor:` プレフィックスを使用。

**Q: ドキュメント更新は？**
A: 関連する実装PRに含めるか、別の`docs:` PRにするか、変更の大きさで判断。

---

## ✅ コードレビューチェックリスト

### セルフレビュー（コミット前）

実装完了後、以下の項目を自分でチェックしてください。

#### 1. 機能面
- [ ] 要件定義通りの動作をするか
- [ ] エラーケースで適切にエラーメッセージが表示されるか
- [ ] ローディング状態が適切に表示されるか
- [ ] モバイルでも正常に動作するか

#### 2. コード品質
- [ ] TypeScriptの型エラーがないか (`npm run build`)
- [ ] ESLintエラーがないか (`npm run lint`)
- [ ] console.log等のデバッグコードを削除したか
- [ ] 未使用のimportを削除したか
- [ ] マジックナンバーを定数化したか

#### 3. セキュリティ
- [ ] 環境変数が適切に使用されているか
- [ ] AWS認証情報がクライアントに露出していないか
- [ ] ユーザー入力のバリデーションがあるか
- [ ] XSS対策（サニタイズ）がされているか

#### 4. パフォーマンス
- [ ] 不要な再レンダリングがないか
- [ ] 重い処理が適切に最適化されているか
- [ ] 画像が遅延読み込みされているか

#### 5. アクセシビリティ
- [ ] alt属性が適切に設定されているか
- [ ] ボタンがキーボードで操作できるか
- [ ] フォーカス状態が視覚的にわかるか

---

## 🧪 テスト方法

### 手動テスト項目

#### ファイルアップロード機能

**正常系**:
- [ ] 1MB以下の画像をアップロードできる
- [ ] 10MB以下の画像をアップロードできる
- [ ] JPEG/PNG/GIF/WebPすべて対応
- [ ] ドラッグ&ドロップでアップロードできる
- [ ] プログレスバーが表示される
- [ ] アップロード完了通知が表示される

**異常系**:
- [ ] 10MB超過の画像で適切なエラーが表示される
- [ ] 非対応形式(PDF等)で適切なエラーが表示される
- [ ] ネットワークエラー時にエラーが表示される

#### ギャラリー表示機能

**正常系**:
- [ ] アップロード済み画像が一覧表示される
- [ ] 画像が新しい順にソートされている
- [ ] サムネイルが正しく表示される
- [ ] ファイル名/日時/サイズが表示される

#### プレビュー機能

**正常系**:
- [ ] 画像クリックでモーダルが開く
- [ ] モーダル外クリックで閉じる
- [ ] ESCキーで閉じる
- [ ] 前後の画像に移動できる

#### 共有リンク生成機能

**正常系**:
- [ ] 共有ボタンクリックでリンク生成
- [ ] クリップボードにコピーされる
- [ ] コピー完了通知が表示される
- [ ] 生成したリンクでファイルにアクセスできる

**異常系**:
- [ ] 期限切れリンクで適切なエラーが表示される

#### Basic認証

**正常系**:
- [ ] 正しい認証情報でログインできる
- [ ] ログイン後すべてのページにアクセスできる

**異常系**:
- [ ] 間違った認証情報でログインできない
- [ ] 認証なしでページにアクセスできない

#### レスポンシブ

- [ ] スマートフォン (375px) で正常表示
- [ ] タブレット (768px) で正常表示
- [ ] デスクトップ (1920px) で正常表示

---

## 🐛 デバッグ方法

### よくある問題と対処法

#### 1. S3アップロードエラー

**症状**: `Access Denied` エラー

**確認項目**:
```bash
# 環境変数が正しく設定されているか
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_S3_BUCKET_NAME

# IAMポリシーが正しいか
# - s3:PutObject
# - s3:GetObject
# - s3:ListBucket
```

**解決策**:
- IAMユーザーのポリシーを確認
- バケットポリシーを確認
- リージョンが正しいか確認

---

#### 2. 画像が表示されない

**症状**: 画像のURLは取得できているが表示されない

**確認項目**:
```javascript
// 署名付きURLの有効期限を確認
console.log('URL:', previewUrl);
console.log('Expires:', expiresAt);

// CORSエラーがないかブラウザのコンソールを確認
```

**解決策**:
- S3バケットのCORS設定を確認
- 署名付きURLの有効期限を確認
- URLが正しく生成されているか確認

---

#### 3. TypeScriptエラー

**症状**: ビルド時に型エラー

**解決策**:
```bash
# 型定義ファイルを確認
npm run type-check

# 型定義を追加
npm install -D @types/[package-name]
```

---

## 📊 品質管理

### 品質基準

コードをコミットする前に、以下の基準を満たしているか確認してください。

| 項目 | 基準 | 確認方法 |
|-----|------|---------|
| TypeScript | 型エラーなし | `npm run build` |
| ESLint | リントエラーなし | `npm run lint` |
| 動作確認 | 手動テストOK | ブラウザで確認 |
| レスポンシブ | 3サイズで表示確認 | DevTools |
| セキュリティ | 環境変数適切に使用 | コードレビュー |

### CI/CD（将来）

フェーズ2以降で導入予定：

```yaml
# .github/workflows/ci.yml (例)
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

---

## 🔄 レビュー依頼方法

### プルリクエストテンプレート

```markdown
## 概要
[何を実装したか簡潔に説明]

## 変更内容
- [ ] ファイルアップロード機能を実装
- [ ] バリデーション処理を追加
- [ ] UIコンポーネントを作成

## スクリーンショット
[変更後の画面キャプチャを添付]

## テスト
- [ ] 手動テスト完了
- [ ] モバイル表示確認
- [ ] エラーケース確認

## チェックリスト
- [ ] TypeScriptエラーなし
- [ ] ESLintエラーなし
- [ ] ドキュメント更新（必要な場合）
- [ ] セキュリティチェック完了

## 関連Issue
Closes #[issue番号]
```

---

## 📚 参考リソース

### 公式ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

### 学習リソース

- [Next.js Learn](https://nextjs.org/learn)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [AWS S3 Getting Started](https://docs.aws.amazon.com/s3/index.html)

---

## 🚨 トラブルシューティング

### 開発サーバーが起動しない

```bash
# ポート3000が使用中の場合
npm run dev -- -p 3001

# node_modules を再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf .next
npm run build
```

### Vercelデプロイエラー

```bash
# ローカルでVercelビルドを再現
npx vercel build

# 環境変数が設定されているか確認
npx vercel env ls
```

---

## 📝 備考

- 実装中に困ったことがあれば、まずは公式ドキュメントを確認
- エラーメッセージをそのままGoogle検索すると解決策が見つかることが多い
- わからないことがあれば質問する（学習が目的！）
- 完璧を目指さず、まず動くものを作る（イテレーション重視）

---

## 次のステップ

実装ガイドを確認したら、次はコーディング規約とデザインガイドを確認して実装を開始しましょう！
