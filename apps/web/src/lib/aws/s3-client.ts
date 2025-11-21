import { S3Client } from '@aws-sdk/client-s3';

/**
 * S3クライアントのインスタンスを作成
 */
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * S3バケット名を取得
 */
export const getBucketName = (): string => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not defined');
  }
  return bucketName;
};
