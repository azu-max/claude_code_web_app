import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, getBucketName } from './s3-client';

/**
 * S3オブジェクトの署名付きURLを生成
 * @param s3Key - S3オブジェクトのキー
 * @param expiresIn - 有効期限（秒）
 * @returns 署名付きURL
 */
export async function generatePresignedUrl(
  s3Key: string,
  expiresIn: number = 3600
): Promise<string> {
  const bucketName = getBucketName();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return url;
}
