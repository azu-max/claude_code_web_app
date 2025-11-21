declare namespace NodeJS {
  interface ProcessEnv {
    // AWS設定
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET_NAME: string;

    // Basic認証
    BASIC_AUTH_USER: string;
    BASIC_AUTH_PASSWORD: string;

    // アプリケーションURL
    NEXT_PUBLIC_APP_URL: string;
  }
}
