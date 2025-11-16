# SnapShare - コーディング規約

## 📌 概要

SnapShareプロジェクトでのコーディング規約を定義します。一貫性のあるコードを保つため、すべての実装でこの規約に従ってください。

---

## 📏 基本原則

### 1. 読みやすさ優先
- コードは書く時間より読む時間のほうが長い
- 他の人が読んでも理解できるコードを書く
- 複雑な処理にはコメントを追加

### 2. 一貫性
- 既存のコードスタイルに合わせる
- Prettier/ESLintの設定に従う

### 3. シンプルさ
- 過度な抽象化を避ける
- YAGNI原則（You Aren't Gonna Need It）
- 必要になってから実装する

---

## 🔤 命名規則

### ファイル名

#### コンポーネント
```
PascalCase を使用

✅ Good:
- FileUploader.tsx
- ImageCard.tsx
- ShareButton.tsx

❌ Bad:
- fileUploader.tsx
- image-card.tsx
- share_button.tsx
```

#### その他のファイル
```
kebab-case を使用

✅ Good:
- file-validator.ts
- date-formatter.ts
- s3-client.ts

❌ Bad:
- FileValidator.ts
- dateFormatter.ts
- s3_client.ts
```

### 変数・関数名

#### 変数
```typescript
// camelCase を使用
✅ Good:
const userName = 'John';
const fileSize = 1024;
const isUploading = false;

❌ Bad:
const UserName = 'John';
const file_size = 1024;
const IsUploading = false;
```

#### 関数
```typescript
// camelCase、動詞で始める
✅ Good:
function uploadFile() {}
function validateInput() {}
function generateUuid() {}

❌ Bad:
function UploadFile() {}
function validation() {}
function uuid() {}
```

#### Boolean変数
```typescript
// is, has, should等の接頭辞を使用
✅ Good:
const isLoading = true;
const hasError = false;
const shouldRetry = true;
const canUpload = false;

❌ Bad:
const loading = true;
const error = false;
```

#### 定数
```typescript
// UPPER_SNAKE_CASE を使用
✅ Good:
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const API_BASE_URL = '/api';

❌ Bad:
const maxFileSize = 10 * 1024 * 1024;
const allowedMimeTypes = ['image/jpeg'];
```

### 型・インターフェース名

```typescript
// PascalCase を使用
// インターフェースにはIプレフィックスを付けない（TypeScriptの推奨）
✅ Good:
interface FileItem {
  id: string;
  fileName: string;
}

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

❌ Bad:
interface IFileItem {}  // Iプレフィックスは不要
type uploadStatus = 'pending' | 'uploading';  // camelCaseは避ける
```

### コンポーネント名

```typescript
// PascalCase を使用
// 機能を明確に表す名前

✅ Good:
export function FileUploader() {}
export function ImagePreviewModal() {}
export function ShareButton() {}

❌ Bad:
export function uploader() {}
export function Modal() {}  // 汎用すぎる
export function Btn() {}    // 省略形は避ける
```

---

## 📦 TypeScript

### 型定義

#### 明示的な型定義
```typescript
// ✅ Good: 型を明示
function calculateFileSize(size: number): string {
  return `${size} bytes`;
}

const fileSize: number = 1024;

// ⚠️ Acceptable: 型推論が明確な場合
const userName = 'John';  // string と推論される
const count = 0;          // number と推論される

// ❌ Bad: any を使用
function processData(data: any) {}  // any は避ける
```

#### インターフェース vs Type
```typescript
// ✅ オブジェクトの形状を定義: interface を使用
interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
}

// ✅ ユニオン型・プリミティブ型: type を使用
type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';
type FileId = string;

// ✅ 関数の型: type を使用
type UploadHandler = (file: File) => Promise<void>;
```

#### Optional vs Undefined
```typescript
// ✅ Good: optional を使用
interface User {
  name: string;
  email?: string;  // 存在しないかもしれない
}

// ❌ Bad: undefined を明示的に指定
interface User {
  name: string;
  email: string | undefined;
}
```

### Null/Undefined チェック

```typescript
// ✅ Good: Optional chaining
const fileName = file?.metadata?.originalname;

// ✅ Good: Nullish coalescing
const userName = user.name ?? 'Anonymous';

// ❌ Bad: 冗長なチェック
const fileName = file && file.metadata && file.metadata.originalname;
```

### Type Guard

```typescript
// ✅ Good: カスタム型ガードを使用
function isImageFile(file: File): file is File {
  return file.type.startsWith('image/');
}

if (isImageFile(file)) {
  // file は File 型として扱われる
  uploadImage(file);
}
```

---

## ⚛️ React / Next.js

### コンポーネント定義

#### 関数コンポーネント
```typescript
// ✅ Good: function 宣言（Named export）
export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  return <div>...</div>;
}

// ⚠️ Acceptable: アロー関数（簡潔な場合）
export const Button = ({ children }: ButtonProps) => <button>{children}</button>;

// ❌ Bad: デフォルトエクスポート（Named exportを推奨）
export default function FileUploader() {}
```

#### Props の型定義
```typescript
// ✅ Good: インターフェースで定義
interface FileUploaderProps {
  onUploadSuccess: (file: FileItem) => void;
  onUploadError: (error: string) => void;
  maxSize?: number;  // optional
}

export function FileUploader({
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024,  // デフォルト値
}: FileUploaderProps) {
  // ...
}
```

### Hooks

#### useState
```typescript
// ✅ Good: 型を明示（必要な場合）
const [file, setFile] = useState<File | null>(null);
const [files, setFiles] = useState<FileItem[]>([]);

// ⚠️ Acceptable: 型推論が明確な場合
const [isUploading, setIsUploading] = useState(false);  // boolean
const [count, setCount] = useState(0);  // number
```

#### useEffect
```typescript
// ✅ Good: 依存配列を適切に指定
useEffect(() => {
  fetchFiles();
}, []);  // 初回のみ実行

useEffect(() => {
  if (uploadStatus === 'success') {
    showToast('アップロード完了');
  }
}, [uploadStatus]);  // uploadStatus が変更されたときに実行

// ❌ Bad: 依存配列を省略
useEffect(() => {
  fetchFiles();
});  // 無限ループの可能性
```

#### カスタムフック
```typescript
// ✅ Good: useで始まる名前
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      // アップロード処理
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadFile };
}

// 使用例
const { isUploading, uploadFile } = useFileUpload();
```

### イベントハンドラー

```typescript
// ✅ Good: handleで始まる名前
function FileUploader() {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUploadClick = () => {
    uploadFile();
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUploadClick}>アップロード</button>
    </div>
  );
}
```

### 条件付きレンダリング

```typescript
// ✅ Good: 明確な条件分岐
function Gallery({ files, isLoading }: GalleryProps) {
  if (isLoading) {
    return <Spinner />;
  }

  if (files.length === 0) {
    return <EmptyState />;
  }

  return <GalleryGrid files={files} />;
}

// ✅ Good: &&演算子（シンプルな場合）
{isUploading && <ProgressBar />}

// ⚠️ 注意: falsy値に注意
{files.length && <Gallery files={files} />}  // files.length=0で"0"が表示される
{files.length > 0 && <Gallery files={files} />}  // ✅ これが正しい
```

---

## 🎨 Tailwind CSS

### クラス名の順序

```tsx
// ✅ Good: 論理的な順序で記述
// 1. レイアウト (display, position)
// 2. ボックスモデル (width, height, padding, margin)
// 3. 視覚効果 (background, border, shadow)
// 4. テキスト (font, text, color)
// 5. その他 (transition, cursor)

<div className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg shadow-md text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
  コンテンツ
</div>

// ❌ Bad: ランダムな順序
<div className="text-sm cursor-pointer bg-white flex w-full shadow-md p-4">
```

### レスポンシブデザイン

```tsx
// ✅ Good: Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* モバイル: w-full, タブレット: w-1/2, デスクトップ: w-1/3 */}
</div>

// ✅ Good: ブレークポイント
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### カスタムクラスの抽出

```typescript
// ✅ Good: 繰り返し使うスタイルはコンポーネント化
function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      {children}
    </button>
  );
}

// ❌ Bad: 同じクラス名を何度も記述
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Button 1</button>
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Button 2</button>
```

---

## 📂 インポート順序

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. 外部ライブラリ
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// 3. 内部モジュール（絶対パス）
import { FileItem } from '@/types/file';
import { uploadToS3 } from '@/lib/aws/upload';
import { validateFile } from '@/lib/validators/file-validator';

// 4. 相対パス
import { Button } from '../ui/Button';
import { Modal } from './Modal';

// 5. スタイル
import styles from './Gallery.module.css';
```

---

## 💬 コメント

### コメントの書き方

```typescript
// ✅ Good: 複雑なロジックに説明を追加
// ファイルをYYYY/MM/DD形式のディレクトリ構造で保存
// 例: uploads/2025/11/16/[uuid].jpg
const s3Key = `uploads/${year}/${month}/${day}/${uuid}.${ext}`;

// ✅ Good: JSDocコメント（関数の説明）
/**
 * ファイルをS3にアップロードします
 * @param file - アップロードするファイル
 * @param metadata - ファイルのメタデータ
 * @returns S3オブジェクトのキー
 * @throws {Error} アップロードに失敗した場合
 */
async function uploadToS3(
  file: File,
  metadata: FileMetadata
): Promise<string> {
  // ...
}

// ❌ Bad: 自明なコメント
// カウントを1増やす
const count = count + 1;

// ❌ Bad: コメントアウトされたコード（削除する）
// const oldFunction = () => {
//   console.log('old');
// };
```

### TODO コメント

```typescript
// ✅ Good: TODOコメント
// TODO: フェーズ2でサムネイル生成を追加
// TODO(username): エラーハンドリングを改善

// ✅ Good: FIXMEコメント（バグの記録）
// FIXME: 大きいファイルでメモリリークが発生する可能性
```

---

## ⚠️ エラーハンドリング

### Try-Catch

```typescript
// ✅ Good: エラーを適切にハンドリング
async function uploadFile(file: File) {
  try {
    const result = await uploadToS3(file);
    return { success: true, data: result };
  } catch (error) {
    console.error('Upload failed:', error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: '不明なエラーが発生しました' };
  }
}

// ❌ Bad: エラーを無視
async function uploadFile(file: File) {
  try {
    const result = await uploadToS3(file);
    return result;
  } catch (error) {
    // 何もしない
  }
}
```

### API レスポンス

```typescript
// ✅ Good: 一貫したレスポンス形式
export async function POST(request: NextRequest) {
  try {
    const data = await processRequest(request);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'サーバーエラー',
      },
      { status: 500 }
    );
  }
}
```

---

## 🔒 セキュリティ

### 環境変数

```typescript
// ✅ Good: サーバーサイドで環境変数を使用
// app/api/upload/route.ts
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ❌ Bad: クライアントサイドで秘密情報を使用
// components/FileUploader.tsx
const apiKey = process.env.AWS_SECRET_ACCESS_KEY;  // 露出する！
```

### 入力バリデーション

```typescript
// ✅ Good: すべてのユーザー入力をバリデーション
function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'ファイルサイズが大きすぎます' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: '対応していないファイル形式です' };
  }

  return { valid: true };
}

// ❌ Bad: バリデーションなし
function uploadFile(file: File) {
  // 直接アップロード（危険！）
  uploadToS3(file);
}
```

---

## 🧹 コードの整理

### DRY原則（Don't Repeat Yourself）

```typescript
// ✅ Good: 共通処理を関数化
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const size1 = formatFileSize(1024);
const size2 = formatFileSize(2048576);

// ❌ Bad: 同じロジックを繰り返し
const size1 = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
const size2 = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
```

### 単一責任の原則

```typescript
// ✅ Good: 1つの関数は1つの責任
function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

function validateFileType(file: File): boolean {
  return ALLOWED_MIME_TYPES.includes(file.type);
}

function validateFile(file: File): { valid: boolean; error?: string } {
  if (!validateFileSize(file)) {
    return { valid: false, error: 'ファイルサイズエラー' };
  }
  if (!validateFileType(file)) {
    return { valid: false, error: 'ファイル形式エラー' };
  }
  return { valid: true };
}

// ❌ Bad: 1つの関数で複数の責任
function validateAndUploadFile(file: File) {
  // バリデーション
  if (file.size > MAX_FILE_SIZE) return;
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return;

  // アップロード
  uploadToS3(file);

  // UI更新
  updateGallery();
}
```

---

## 📝 ESLint / Prettier設定

### .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## ✅ チェックリスト

コードをコミットする前に確認：

- [ ] 命名規則に従っているか
- [ ] TypeScriptの型エラーがないか
- [ ] ESLintエラーがないか
- [ ] 未使用のimportを削除したか
- [ ] console.logを削除したか
- [ ] コメントが適切に記載されているか
- [ ] DRY原則に従っているか
- [ ] セキュリティチェック完了したか

---

## 📚 参考リソース

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js Best Practices](https://nextjs.org/docs/pages/building-your-application)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
