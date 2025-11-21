import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, getBucketName } from './s3-client';
import { generateUuid } from '@/lib/utils/uuid-generator';
import { MIME_TO_EXTENSION } from '@/constants';

/**
 * ファイルをS3にアップロード
 * @param file - アップロードするファイル
 * @returns S3オブジェクトのキー
 */
export async function uploadFileToS3(file: File): Promise<string> {
  const bucketName = getBucketName();
  const uuid = generateUuid();
  const extension = MIME_TO_EXTENSION[file.type] || 'bin';

  // 現在の日付を取得
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // S3キーを生成: uploads/YYYY/MM/DD/[UUID].ext
  const s3Key = `uploads/${year}/${month}/${day}/${uuid}.${extension}`;

  // ファイルをArrayBufferに変換
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // メタデータを作成
  const metadata: Record<string, string> = {
    originalname: file.name,
    uploaddate: now.toISOString(),
    filesize: String(file.size),
    mimetype: file.type,
  };

  // S3にアップロード
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: buffer,
    ContentType: file.type,
    Metadata: metadata,
  });

  await s3Client.send(command);

  return s3Key;
}
