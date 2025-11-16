# SnapShare - データ構造定義書

## 📌 概要

SnapShareではRDBを使用せず、AWS S3をメインストレージとして使用します。このドキュメントでは、S3に保存するファイル構造、メタデータ、およびアプリケーション内で使用するデータ型を定義します。

---

## 🗂 S3バケット構造

### バケット名
```
snapshare-uploads-[環境]
例: snapshare-uploads-production
    snapshare-uploads-development
```

### ディレクトリ構造
```
snapshare-uploads-production/
├── uploads/
│   ├── 2025/
│   │   ├── 11/
│   │   │   ├── 16/
│   │   │   │   ├── [uuid].jpg
│   │   │   │   ├── [uuid].png
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── thumbnails/  (フェーズ2: Lambda生成)
    └── 2025/
        └── 11/
            └── 16/
                ├── [uuid]_thumb.jpg
                └── ...
```

### ファイル命名規則
```
形式: [UUID v4].[拡張子]
例: 550e8400-e29b-41d4-a716-446655440000.jpg

理由:
- UUID v4でファイル名の衝突を回避
- 元のファイル名はメタデータに保存
- セキュリティ向上（推測不可能）
```

---

## 📦 データ型定義（TypeScript）

### 1. FileMetadata型

S3オブジェクトのメタデータとして保存される情報

```typescript
/**
 * S3オブジェクトのカスタムメタデータ
 * S3のメタデータはHTTPヘッダーとして保存される
 */
interface S3CustomMetadata {
  originalname: string;      // 元のファイル名（例: "vacation.jpg"）
  uploaddate: string;        // アップロード日時（ISO 8601形式）
  filesize: string;          // ファイルサイズ（バイト）
  mimetype: string;          // MIMEタイプ（例: "image/jpeg"）
  uploader?: string;         // アップロード者（フェーズ2: QRセッションID等）
}
```

### 2. FileItem型

アプリケーション内で扱うファイル情報

```typescript
/**
 * ギャラリーに表示するファイルアイテム
 */
interface FileItem {
  id: string;                // ファイルID（S3のKey）
  fileName: string;          // 表示用ファイル名
  fileSize: number;          // ファイルサイズ（バイト）
  mimeType: string;          // MIMEタイプ
  uploadedAt: Date;          // アップロード日時
  thumbnailUrl?: string;     // サムネイルURL（フェーズ2）
  previewUrl: string;        // プレビュー用URL（署名付き）
  s3Key: string;             // S3オブジェクトのキー
}
```

### 3. UploadRequest型

ファイルアップロードAPIのリクエスト

```typescript
/**
 * アップロードAPIリクエスト
 * POST /api/upload
 */
interface UploadRequest {
  file: File;                // アップロードするファイル
  sessionId?: string;        // QRセッションID（フェーズ2）
}
```

### 4. UploadResponse型

ファイルアップロードAPIのレスポンス

```typescript
/**
 * アップロードAPIレスポンス
 */
interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileId: string;          // アップロードされたファイルのID
    fileName: string;        // ファイル名
    fileSize: number;        // ファイルサイズ
    uploadedAt: string;      // アップロード日時（ISO 8601）
  };
  error?: string;            // エラーメッセージ（失敗時）
}
```

### 5. FileListResponse型

ファイル一覧取得APIのレスポンス

```typescript
/**
 * ファイル一覧APIレスポンス
 * GET /api/files
 */
interface FileListResponse {
  success: boolean;
  data?: {
    files: FileItem[];       // ファイルアイテムの配列
    totalCount: number;      // 総ファイル数
    hasMore: boolean;        // 次ページがあるか（将来の拡張用）
  };
  error?: string;
}
```

### 6. ShareLinkRequest型

共有リンク生成APIのリクエスト

```typescript
/**
 * 共有リンク生成APIリクエスト
 * POST /api/share
 */
interface ShareLinkRequest {
  fileId: string;            // 共有するファイルのID
  expiresIn?: number;        // 有効期限（秒）デフォルト: 604800（7日）
}
```

### 7. ShareLinkResponse型

共有リンク生成APIのレスポンス

```typescript
/**
 * 共有リンク生成APIレスポンス
 */
interface ShareLinkResponse {
  success: boolean;
  data?: {
    shareUrl: string;        // 署名付きURL
    expiresAt: string;       // 有効期限（ISO 8601）
  };
  error?: string;
}
```

---

## 🔄 フェーズ2: QRコード機能のデータ構造

### 8. QRSession型

QRコード経由アップロード用のセッション情報

```typescript
/**
 * QRセッション情報
 * 一時的にメモリ or Redis に保存
 */
interface QRSession {
  sessionId: string;         // セッションID（UUID）
  createdAt: Date;           // 作成日時
  expiresAt: Date;           // 有効期限（15分後）
  isActive: boolean;         // セッション有効フラグ
  uploadedFiles: string[];   // アップロードされたファイルID配列
}
```

### 9. QRUploadRequest型

QRコード経由アップロードAPIのリクエスト

```typescript
/**
 * QR経由アップロードAPIリクエスト
 * POST /api/qr-upload
 */
interface QRUploadRequest {
  sessionId: string;         // QRセッションID
  file: File;                // アップロードファイル
}
```

---

## 🗄 S3オブジェクトの例

### オブジェクトメタデータの実例

```json
{
  "Key": "uploads/2025/11/16/550e8400-e29b-41d4-a716-446655440000.jpg",
  "Size": 2048576,
  "LastModified": "2025-11-16T10:30:00.000Z",
  "ETag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
  "ContentType": "image/jpeg",
  "Metadata": {
    "originalname": "my-vacation-photo.jpg",
    "uploaddate": "2025-11-16T10:30:00.000Z",
    "filesize": "2048576",
    "mimetype": "image/jpeg"
  }
}
```

---

## 📋 バリデーションルール

### ファイルアップロード

| 項目 | ルール | エラーメッセージ |
|------|--------|------------------|
| ファイルサイズ | 最大10MB | "ファイルサイズは10MB以下にしてください" |
| ファイル形式 | JPEG, PNG, GIF, WebP | "対応していないファイル形式です" |
| ファイル名 | 最大255文字 | "ファイル名が長すぎます" |
| MIMEタイプ | image/* | "画像ファイルのみアップロード可能です" |

### MIMEタイプ許可リスト

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];
```

### ファイル拡張子マッピング

```typescript
const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};
```

---

## 🔐 環境変数定義

### 必須環境変数

```bash
# AWS認証情報
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=snapshare-uploads-production

# Basic認証
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your_secure_password

# Next.js
NEXT_PUBLIC_APP_URL=https://snapshare.vercel.app

# フェーズ2: Redis（オプション）
REDIS_URL=redis://localhost:6379
```

### 環境変数の型定義

```typescript
/**
 * 環境変数の型定義
 */
interface EnvironmentVariables {
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET_NAME: string;
  BASIC_AUTH_USER: string;
  BASIC_AUTH_PASSWORD: string;
  NEXT_PUBLIC_APP_URL: string;
  REDIS_URL?: string;  // オプション
}
```

---

## 📊 データフロー概要

### アップロードフロー

```
1. クライアント: File選択
2. クライアント → API: FormData送信
3. API: バリデーション
4. API → S3: ファイル保存 + メタデータ
5. S3 → API: 成功レスポンス
6. API → クライアント: UploadResponse
7. クライアント: ギャラリー更新
```

### 共有リンク生成フロー

```
1. クライアント: 共有ボタンクリック
2. クライアント → API: ShareLinkRequest
3. API: S3署名付きURL生成（有効期限7日）
4. API → クライアント: ShareLinkResponse
5. クライアント: リンクをクリップボードにコピー
```

---

## 🔄 将来の拡張性

### データベース導入時の移行計画

フェーズ3以降でユーザー管理やコメント機能を追加する場合：

```typescript
/**
 * ユーザーテーブル（将来）
 */
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

/**
 * ファイルテーブル（将来）
 */
interface File {
  id: string;
  userId: string;         // 所有者
  s3Key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  tags: string[];         // タグ機能
  isPublic: boolean;      // 公開/非公開
}
```

現在のS3中心の設計から、DynamoDBやPostgreSQLへの移行が可能な設計となっています。

---

## 📝 備考

- S3のメタデータは2KBまでの制限があります
- 大きなメタデータが必要な場合は、DynamoDBの併用を検討します
- ファイルの論理削除（soft delete）はフェーズ2で検討します
