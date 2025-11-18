import { ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, getBucketName } from './s3-client';
import { generatePresignedUrl } from './generate-presigned-url';
import { FileItem } from '@/types/file';

/**
 * S3からファイル一覧を取得
 * @returns ファイルアイテムの配列
 */
export async function listFiles(): Promise<FileItem[]> {
  const bucketName = getBucketName();

  // S3からオブジェクト一覧を取得
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: 'uploads/',
  });

  const listResult = await s3Client.send(listCommand);

  if (!listResult.Contents || listResult.Contents.length === 0) {
    return [];
  }

  // 各ファイルの詳細情報を取得
  const filePromises = listResult.Contents.map(async (object) => {
    if (!object.Key) return null;

    try {
      // メタデータを取得
      const headCommand = new HeadObjectCommand({
        Bucket: bucketName,
        Key: object.Key,
      });

      const headResult = await s3Client.send(headCommand);
      const metadata = headResult.Metadata || {};

      // 署名付きURLを生成（1時間有効）
      const previewUrl = await generatePresignedUrl(object.Key, 3600);

      const fileItem: FileItem = {
        id: object.Key,
        fileName: metadata.originalname || object.Key.split('/').pop() || '',
        fileSize: object.Size || 0,
        mimeType: headResult.ContentType || 'application/octet-stream',
        uploadedAt: metadata.uploaddate
          ? new Date(metadata.uploaddate)
          : object.LastModified || new Date(),
        previewUrl,
        s3Key: object.Key,
      };

      return fileItem;
    } catch (error) {
      console.error(`Error processing file ${object.Key}:`, error);
      return null;
    }
  });

  const files = await Promise.all(filePromises);

  // nullを除外してソート（新しい順）
  return files
    .filter((file): file is FileItem => file !== null)
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}
