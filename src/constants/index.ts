/**
 * SnapShare - 定数定義
 */

// ファイルアップロードの制限
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 許可するMIMEタイプ
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

// MIMEタイプから拡張子へのマッピング
export const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

// エラーメッセージ
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'ファイルサイズは10MB以下にしてください',
  INVALID_FILE_TYPE: '対応していないファイル形式です（JPEG, PNG, GIF, WebP）',
  FILE_NAME_TOO_LONG: 'ファイル名が長すぎます（255文字以内）',
  UPLOAD_FAILED: 'アップロードに失敗しました',
  NO_FILE_SELECTED: 'ファイルが選択されていません',
} as const;

// 共有リンクの有効期限（秒）
export const SHARE_LINK_EXPIRATION = 7 * 24 * 60 * 60; // 7日間

// プレビューURLの有効期限（秒）
export const PREVIEW_URL_EXPIRATION = 60 * 60; // 1時間
