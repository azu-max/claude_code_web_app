# SnapShare - シーケンス図

## 📌 概要

SnapShareの主要機能のシーケンス図をMermaid形式で記載します。

---

## 🔐 1. Basic認証フロー

ユーザーがアプリにアクセスする際の認証フロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant Browser as ブラウザ
    participant Middleware as Next.js Middleware
    participant Page as ページ

    User->>Browser: アプリにアクセス
    Browser->>Middleware: HTTPリクエスト

    alt 認証情報なし
        Middleware->>Browser: 401 Unauthorized + WWW-Authenticate
        Browser->>User: Basic認証ダイアログ表示
        User->>Browser: ユーザー名/パスワード入力
        Browser->>Middleware: 認証情報付きリクエスト
    end

    Middleware->>Middleware: 認証情報を検証

    alt 認証成功
        Middleware->>Page: リクエストを通過
        Page->>Browser: ページを表示
        Browser->>User: アプリ画面
    else 認証失敗
        Middleware->>Browser: 401 Unauthorized
        Browser->>User: 認証エラー
    end
```

---

## 📤 2. ファイルアップロードフロー

ユーザーが画像をアップロードするフロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as UI (React)
    participant API as API Route<br/>/api/upload
    participant Validator as バリデーター
    participant S3Client as AWS S3 Client
    participant S3 as AWS S3

    User->>UI: ファイルを選択/ドロップ
    UI->>UI: ファイルをプレビュー
    UI->>User: プレビュー表示

    User->>UI: アップロードボタンクリック
    UI->>UI: プログレスバー表示開始

    UI->>API: POST /api/upload<br/>(FormData)

    API->>Validator: ファイルバリデーション
    Validator->>Validator: ファイルサイズチェック (≤10MB)
    Validator->>Validator: MIMEタイプチェック
    Validator->>Validator: ファイル名チェック

    alt バリデーション失敗
        Validator->>API: エラー
        API->>UI: 400 Bad Request
        UI->>User: エラーメッセージ表示
    else バリデーション成功
        Validator->>API: OK

        API->>API: UUID生成
        API->>API: S3キー生成<br/>(uploads/YYYY/MM/DD/[UUID].ext)
        API->>API: メタデータ作成

        API->>S3Client: PutObjectCommand
        S3Client->>S3: ファイル + メタデータ保存
        S3->>S3Client: 保存完了
        S3Client->>API: 成功レスポンス

        API->>UI: 200 OK<br/>(UploadResponse)
        UI->>UI: プログレスバー完了
        UI->>UI: ギャラリーを更新
        UI->>User: 成功通知表示
    end
```

---

## 🖼 3. ギャラリー表示フロー

アップロード済みファイル一覧を取得・表示するフロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as UI (React)
    participant API as API Route<br/>/api/files
    participant S3Client as AWS S3 Client
    participant S3 as AWS S3
    participant Presigner as S3 Presigner

    User->>UI: ページアクセス/更新
    UI->>API: GET /api/files

    API->>S3Client: ListObjectsV2Command
    S3Client->>S3: バケット内のオブジェクト一覧取得
    S3->>S3Client: オブジェクトリスト

    loop 各ファイルごと
        S3Client->>S3: HeadObjectCommand<br/>(メタデータ取得)
        S3->>S3Client: メタデータ

        API->>Presigner: getSignedUrl<br/>(有効期限: 1時間)
        Presigner->>API: 署名付きURL

        API->>API: FileItemオブジェクト生成
    end

    API->>API: 日付順にソート (新しい順)
    API->>UI: 200 OK<br/>(FileListResponse)

    UI->>UI: グリッドレイアウトで表示
    UI->>User: ギャラリー画面表示

    User->>UI: 画像をクリック
    UI->>UI: モーダルでプレビュー表示
    UI->>User: 拡大画像表示
```

---

## 🔗 4. 共有リンク生成フロー

ファイルの共有リンクを生成するフロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as UI (React)
    participant API as API Route<br/>/api/share
    participant Presigner as S3 Presigner
    participant Clipboard as クリップボード

    User->>UI: 共有ボタンクリック
    UI->>API: POST /api/share<br/>{fileId, expiresIn: 604800}

    API->>API: fileIdからS3キーを取得
    API->>API: 有効期限を計算 (7日後)

    API->>Presigner: getSignedUrl<br/>(GetObjectCommand, 7日間)
    Presigner->>API: 署名付きURL生成

    API->>UI: 200 OK<br/>(ShareLinkResponse)

    UI->>Clipboard: 共有URLをコピー
    Clipboard->>UI: コピー完了

    UI->>User: "リンクをコピーしました" 通知

    Note over User,Presigner: ユーザーは共有URLを他の人に送信

    actor Recipient as 受信者
    participant Browser as ブラウザ

    User->>Recipient: 共有URLを送信
    Recipient->>Browser: URLにアクセス
    Browser->>S3: 署名付きURLでGETリクエスト

    alt URLが有効期限内
        S3->>Browser: ファイルを返却
        Browser->>Recipient: ファイル表示/ダウンロード
    else URLが期限切れ
        S3->>Browser: 403 Forbidden
        Browser->>Recipient: エラー表示
    end
```

---

## 📱 5. QRコード経由アップロードフロー（フェーズ2）

PC画面にQRコードを表示し、スマホからアップロードするフロー

```mermaid
sequenceDiagram
    actor PCUser as PCユーザー
    participant PCUI as PC UI
    participant API as API Routes
    participant SessionStore as セッションストア<br/>(メモリ/Redis)
    participant S3 as AWS S3
    actor MobileUser as スマホユーザー
    participant MobileUI as スマホUI

    PCUser->>PCUI: QRアップロードボタンクリック
    PCUI->>API: POST /api/qr/session/create

    API->>API: セッションID生成 (UUID)
    API->>SessionStore: セッション保存<br/>(有効期限: 15分)
    SessionStore->>API: OK

    API->>PCUI: セッションID返却
    PCUI->>PCUI: QRコード生成<br/>(URL: /qr/upload?session=[ID])
    PCUI->>PCUser: QRコード表示

    Note over PCUI,MobileUI: ポーリング開始 (2秒ごと)

    loop ポーリング
        PCUI->>API: GET /api/qr/session/[ID]/status
        API->>SessionStore: セッション状態取得
        SessionStore->>API: アップロードファイルリスト
        API->>PCUI: ステータス返却
    end

    MobileUser->>MobileUser: スマホでQRコードをスキャン
    MobileUser->>MobileUI: URLにアクセス
    MobileUI->>API: GET /qr/upload?session=[ID]

    API->>SessionStore: セッション検証

    alt セッション有効
        SessionStore->>API: OK
        API->>MobileUI: アップロードページ表示

        MobileUser->>MobileUI: カメラから写真選択
        MobileUser->>MobileUI: アップロードボタンタップ

        MobileUI->>API: POST /api/qr/upload<br/>{sessionId, file}
        API->>API: バリデーション
        API->>S3: ファイル保存
        S3->>API: OK

        API->>SessionStore: セッションにファイルID追加
        SessionStore->>API: OK

        API->>MobileUI: 成功レスポンス
        MobileUI->>MobileUser: アップロード完了表示

        Note over PCUI: 次回のポーリングで検知
        PCUI->>API: GET /api/qr/session/[ID]/status
        API->>SessionStore: 新規ファイルを取得
        SessionStore->>API: ファイルリスト
        API->>PCUI: 新規ファイル情報

        PCUI->>PCUI: ギャラリーに自動追加
        PCUI->>PCUser: 新しい画像を表示 + 通知

    else セッション無効
        SessionStore->>API: エラー
        API->>MobileUI: 403 Forbidden
        MobileUI->>MobileUser: エラー表示
    end

    PCUser->>PCUI: QRコードを閉じる
    PCUI->>API: DELETE /api/qr/session/[ID]
    API->>SessionStore: セッション削除
    SessionStore->>API: OK
```

---

## 🗑 6. ファイル削除フロー（フェーズ2）

アップロードしたファイルを削除するフロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as UI (React)
    participant Modal as 確認モーダル
    participant API as API Route<br/>/api/files/[id]
    participant S3Client as AWS S3 Client
    participant S3 as AWS S3

    User->>UI: ファイルの削除ボタンクリック
    UI->>Modal: 確認ダイアログ表示
    Modal->>User: "本当に削除しますか?"

    alt ユーザーがキャンセル
        User->>Modal: キャンセル
        Modal->>UI: モーダルを閉じる
    else ユーザーが削除を確認
        User->>Modal: 削除確定
        Modal->>API: DELETE /api/files/[fileId]

        API->>API: fileIdからS3キーを取得
        API->>S3Client: DeleteObjectCommand
        S3Client->>S3: オブジェクト削除
        S3->>S3Client: 削除完了
        S3Client->>API: 成功レスポンス

        API->>UI: 200 OK
        UI->>UI: ギャラリーから削除
        UI->>User: "削除しました" 通知
    end
```

---

## 🔄 7. エラーハンドリングフロー

エラー発生時の共通フロー

```mermaid
sequenceDiagram
    participant UI as UI (React)
    participant API as API Routes
    participant External as 外部サービス<br/>(S3等)

    UI->>API: リクエスト
    API->>External: 処理実行

    alt ネットワークエラー
        External--xAPI: タイムアウト
        API->>API: エラーログ記録
        API->>UI: 500 Internal Server Error<br/>{error: "一時的なエラーが発生しました"}
        UI->>UI: トースト通知表示
        UI->>UI: リトライボタン表示
    else バリデーションエラー
        API->>API: バリデーション失敗
        API->>UI: 400 Bad Request<br/>{error: "ファイルサイズが大きすぎます"}
        UI->>UI: エラーメッセージ表示
    else 認証エラー
        API->>API: AWS認証失敗
        API->>UI: 401 Unauthorized
        UI->>UI: "認証エラー。管理者に連絡してください"
    else S3エラー
        External->>API: S3エラー (NoSuchBucket等)
        API->>API: エラーログ記録
        API->>UI: 500 Internal Server Error
        UI->>UI: "サーバーエラーが発生しました"
    end
```

---

## 📊 8. ページロードフロー（全体像）

アプリ起動時の全体フロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant Browser as ブラウザ
    participant Middleware as Middleware
    participant Page as ページ (SSR)
    participant ClientUI as Client UI
    participant API as API Routes
    participant S3 as AWS S3

    User->>Browser: アプリにアクセス
    Browser->>Middleware: リクエスト
    Middleware->>Middleware: Basic認証チェック

    alt 認証OK
        Middleware->>Page: リクエスト許可
        Page->>Page: サーバーサイドレンダリング
        Page->>Browser: HTML返却
        Browser->>User: ページ表示

        Browser->>ClientUI: React Hydration
        ClientUI->>ClientUI: マウント

        ClientUI->>API: GET /api/files
        API->>S3: ファイル一覧取得
        S3->>API: データ返却
        API->>ClientUI: FileListResponse

        ClientUI->>ClientUI: ギャラリー描画
        ClientUI->>User: 画像一覧表示
    else 認証NG
        Middleware->>Browser: 401 + Basic認証要求
        Browser->>User: 認証ダイアログ
    end
```

---

## 📝 シーケンス図の読み方

### 参加者（Participant）

- **User / PCユーザー / スマホユーザー**: エンドユーザー
- **UI / PCUI / MobileUI**: フロントエンド（React コンポーネント）
- **Middleware**: Next.js Middleware（Basic認証等）
- **API / API Routes**: Next.js API Routes（バックエンド）
- **S3Client**: AWS SDK for JavaScript v3のS3クライアント
- **S3 / AWS S3**: AWS S3サービス
- **Presigner**: S3の署名付きURL生成モジュール
- **SessionStore**: QRセッション情報の保存先（メモリまたはRedis）

### 矢印の意味

- `->`: 同期リクエスト
- `-->`: 非同期レスポンス
- `--x`: エラー
- `Note over`: コメント

### alt / else / loop

- `alt ... else`: 条件分岐
- `loop`: 繰り返し処理

---

## 🔧 実装時の参照

実装時は各シーケンス図を参照しながら、以下を確認してください：

1. ✅ 各APIエンドポイントのリクエスト/レスポンス形式
2. ✅ エラーハンドリングのパターン
3. ✅ ユーザーへのフィードバックタイミング
4. ✅ 外部サービス（S3）との連携ポイント

---

## 📅 更新履歴

- 2025-11-16: 初版作成
