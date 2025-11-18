import {
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ERROR_MESSAGES,
} from '@/constants';
import { FileValidationResult } from '@/types/file';

/**
 * ファイルのバリデーションを実行
 * @param file - 検証するファイル
 * @returns バリデーション結果
 */
export function validateFile(file: File): FileValidationResult {
  // ファイルが存在するか
  if (!file) {
    return {
      valid: false,
      error: ERROR_MESSAGES.NO_FILE_SELECTED,
    };
  }

  // ファイルサイズをチェック
  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  // ファイル形式をチェック
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  // ファイル名の長さをチェック
  if (!validateFileName(file)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.FILE_NAME_TOO_LONG,
    };
  }

  return { valid: true };
}

/**
 * ファイルサイズをチェック
 * @param file - 検証するファイル
 * @returns サイズが有効な場合true
 */
export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * ファイル形式をチェック
 * @param file - 検証するファイル
 * @returns 形式が有効な場合true
 */
export function validateFileType(file: File): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(file.type);
}

/**
 * ファイル名の長さをチェック
 * @param file - 検証するファイル
 * @returns ファイル名が有効な場合true
 */
export function validateFileName(file: File): boolean {
  return file.name.length <= 255;
}

/**
 * ファイルサイズを人間が読める形式にフォーマット
 * @param bytes - バイト数
 * @returns フォーマットされた文字列
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
