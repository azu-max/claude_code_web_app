/**
 * SnapShare 共通型定義
 *
 * Next.jsアプリとCloudflare Workerで共有する型定義
 */

/**
 * 短縮リンク情報
 */
export interface ShortLink {
  /** 短縮コード（6文字のランダム文字列） */
  shortCode: string;

  /** 元のURL（S3の署名付きURLなど） */
  originalUrl: string;

  /** 作成日時（ISO 8601形式） */
  createdAt: string;

  /** 有効期限（ISO 8601形式、オプショナル） */
  expiresAt?: string;

  /** アクセス回数（オプショナル） */
  accessCount?: number;

  /** メタデータ（オプショナル） */
  metadata?: {
    /** ファイル名 */
    fileName?: string;
    /** ファイルサイズ（バイト） */
    fileSize?: number;
    /** MIMEタイプ */
    mimeType?: string;
  };
}

/**
 * URL短縮リクエスト
 */
export interface ShortenUrlRequest {
  /** 短縮したい元のURL */
  originalUrl: string;

  /** 有効期限（秒）デフォルト: 7日間 */
  expiresIn?: number;

  /** メタデータ（オプショナル） */
  metadata?: ShortLink['metadata'];
}

/**
 * URL短縮レスポンス
 */
export interface ShortenUrlResponse {
  success: true;
  data: {
    /** 短縮コード */
    shortCode: string;
    /** 短縮URL */
    shortUrl: string;
    /** 元のURL */
    originalUrl: string;
    /** 有効期限（ISO 8601形式） */
    expiresAt?: string;
  };
}

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

/**
 * APIレスポンスの共通型
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | ErrorResponse;
