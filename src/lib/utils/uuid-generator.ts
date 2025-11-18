import { v4 as uuidv4 } from 'uuid';

/**
 * UUID v4を生成
 * @returns UUID文字列
 */
export function generateUuid(): string {
  return uuidv4();
}
