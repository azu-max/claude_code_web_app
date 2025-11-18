/**
 * S3オブジェクトのカスタムメタデータ
 * S3のメタデータはHTTPヘッダーとして保存される
 */
export interface S3CustomMetadata {
  originalname: string; // 元のファイル名（例: "vacation.jpg"）
  uploaddate: string; // アップロード日時（ISO 8601形式）
  filesize: string; // ファイルサイズ（バイト）
  mimetype: string; // MIMEタイプ（例: "image/jpeg"）
  uploader?: string; // アップロード者（フェーズ2: QRセッションID等）
}

/**
 * ギャラリーに表示するファイルアイテム
 */
export interface FileItem {
  id: string; // ファイルID（S3のKey）
  fileName: string; // 表示用ファイル名
  fileSize: number; // ファイルサイズ（バイト）
  mimeType: string; // MIMEタイプ
  uploadedAt: Date; // アップロード日時
  thumbnailUrl?: string; // サムネイルURL（フェーズ2）
  previewUrl: string; // プレビュー用URL（署名付き）
  s3Key: string; // S3オブジェクトのキー
}

/**
 * アップロードAPIリクエスト
 * POST /api/upload
 */
export interface UploadRequest {
  file: File; // アップロードするファイル
  sessionId?: string; // QRセッションID（フェーズ2）
}

/**
 * アップロードAPIレスポンス
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileId: string; // アップロードされたファイルのID
    fileName: string; // ファイル名
    fileSize: number; // ファイルサイズ
    uploadedAt: string; // アップロード日時（ISO 8601）
  };
  error?: string; // エラーメッセージ（失敗時）
}

/**
 * ファイル一覧APIレスポンス
 * GET /api/files
 */
export interface FileListResponse {
  success: boolean;
  data?: {
    files: FileItem[]; // ファイルアイテムの配列
    totalCount: number; // 総ファイル数
    hasMore: boolean; // 次ページがあるか（将来の拡張用）
  };
  error?: string;
}

/**
 * 共有リンク生成APIリクエスト
 * POST /api/share
 */
export interface ShareLinkRequest {
  fileId: string; // 共有するファイルのID
  expiresIn?: number; // 有効期限（秒）デフォルト: 604800（7日）
}

/**
 * 共有リンク生成APIレスポンス
 */
export interface ShareLinkResponse {
  success: boolean;
  data?: {
    shareUrl: string; // 署名付きURL
    expiresAt: string; // 有効期限（ISO 8601）
  };
  error?: string;
}

/**
 * ファイルバリデーション結果
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}
