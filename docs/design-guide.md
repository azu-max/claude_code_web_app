# SnapShare - デザインガイド

## 📌 概要

SnapShareのUI/UXデザインガイドラインを定義します。一貫性のあるデザインを保つため、すべてのコンポーネントでこのガイドに従ってください。

---

## 🎨 デザインコンセプト

### ブランドイメージ
- **シンプル**: 直感的で使いやすい
- **モダン**: 洗練された現代的なデザイン
- **高速**: レスポンシブで快適な操作感
- **安全**: セキュアなファイル共有

### デザイン原則
1. **Mobile First**: モバイル優先でデザイン
2. **アクセシビリティ**: 誰でも使いやすい
3. **一貫性**: 統一されたUI/UX
4. **フィードバック**: ユーザーアクションに対する明確な反応

---

## 🎨 カラーパレット

### プライマリカラー

```css
/* ブルー系 - メインカラー */
--primary-50:  #eff6ff;   /* 背景、ホバー */
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;   /* メインボタン */
--primary-600: #2563eb;   /* ホバー状態 */
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

### グレースケール

```css
/* ニュートラルカラー - テキスト、背景 */
--gray-50:  #f9fafb;   /* 背景 */
--gray-100: #f3f4f6;   /* カード背景 */
--gray-200: #e5e7eb;   /* ボーダー */
--gray-300: #d1d5db;
--gray-400: #9ca3af;   /* プレースホルダー */
--gray-500: #6b7280;   /* 補助テキスト */
--gray-600: #4b5563;
--gray-700: #374151;   /* 本文テキスト */
--gray-800: #1f2937;   /* 見出し */
--gray-900: #111827;   /* 強調テキスト */
```

### セマンティックカラー

```css
/* 成功 */
--success-50:  #f0fdf4;
--success-500: #22c55e;   /* 成功メッセージ */
--success-600: #16a34a;

/* エラー */
--error-50:  #fef2f2;
--error-500: #ef4444;     /* エラーメッセージ */
--error-600: #dc2626;

/* 警告 */
--warning-50:  #fffbeb;
--warning-500: #f59e0b;   /* 警告メッセージ */
--warning-600: #d97706;

/* 情報 */
--info-50:  #eff6ff;
--info-500: #3b82f6;      /* 情報メッセージ */
--info-600: #2563eb;
```

### Tailwind CSS クラス対応表

| 用途 | Tailwind Class | カラーコード |
|-----|---------------|-------------|
| プライマリボタン | `bg-blue-600` | #2563eb |
| プライマリボタン（ホバー） | `hover:bg-blue-700` | #1d4ed8 |
| 背景 | `bg-gray-50` | #f9fafb |
| カード背景 | `bg-white` | #ffffff |
| ボーダー | `border-gray-200` | #e5e7eb |
| 本文テキスト | `text-gray-700` | #374151 |
| 見出し | `text-gray-900` | #111827 |
| 成功通知 | `bg-green-500` | #22c55e |
| エラー通知 | `bg-red-500` | #ef4444 |

---

## 📝 タイポグラフィ

### フォントファミリー

```css
/* システムフォント（デフォルト） */
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;

/* 日本語対応 */
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
  "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", YuGothic, Meiryo;
```

### フォントサイズ

| 用途 | Tailwind Class | サイズ | 行高 |
|-----|---------------|-------|------|
| 大見出し (H1) | `text-3xl` | 30px | 36px |
| 中見出し (H2) | `text-2xl` | 24px | 32px |
| 小見出し (H3) | `text-xl` | 20px | 28px |
| 本文（大） | `text-lg` | 18px | 28px |
| 本文（標準） | `text-base` | 16px | 24px |
| 本文（小） | `text-sm` | 14px | 20px |
| キャプション | `text-xs` | 12px | 16px |

### フォントウェイト

| 用途 | Tailwind Class | ウェイト |
|-----|---------------|---------|
| 見出し | `font-bold` | 700 |
| 強調 | `font-semibold` | 600 |
| 本文 | `font-normal` | 400 |
| 軽い | `font-light` | 300 |

### 使用例

```tsx
{/* 大見出し */}
<h1 className="text-3xl font-bold text-gray-900">
  SnapShare
</h1>

{/* 中見出し */}
<h2 className="text-2xl font-semibold text-gray-800">
  アップロード済みファイル
</h2>

{/* 本文 */}
<p className="text-base text-gray-700">
  画像をドラッグ&ドロップしてアップロード
</p>

{/* キャプション */}
<span className="text-xs text-gray-500">
  最大10MBまで
</span>
```

---

## 📏 スペーシング

### 基本ルール

```
8pxグリッドシステムを採用
すべての余白は8の倍数を使用
```

### Tailwind スペーシング

| Tailwind | サイズ | 用途 |
|----------|-------|------|
| `p-1` | 4px | 最小余白 |
| `p-2` | 8px | 小余白 |
| `p-3` | 12px | - |
| `p-4` | 16px | 標準余白 |
| `p-6` | 24px | 中余白 |
| `p-8` | 32px | 大余白 |
| `p-12` | 48px | 特大余白 |

### 使用例

```tsx
{/* カード内の余白 */}
<div className="p-6">
  コンテンツ
</div>

{/* 要素間のマージン */}
<div className="space-y-4">
  <div>要素1</div>
  <div>要素2</div>
</div>

{/* セクション間の余白 */}
<section className="mb-12">
  セクション
</section>
```

---

## 🔲 コンポーネントスタイル

### ボタン

#### プライマリボタン
```tsx
<button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
  アップロード
</button>
```

#### セカンダリボタン
```tsx
<button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
  キャンセル
</button>
```

#### 危険ボタン
```tsx
<button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
  削除
</button>
```

#### アイコンボタン
```tsx
<button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
  <IconShare className="w-5 h-5" />
</button>
```

### カード

```tsx
<div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <div className="p-6">
    カード内容
  </div>
</div>
```

### インプット

```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="プレースホルダー"
/>
```

### モーダル

```tsx
{/* オーバーレイ */}
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  {/* モーダル本体 */}
  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
    {/* ヘッダー */}
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">タイトル</h2>
    </div>

    {/* コンテンツ */}
    <div className="p-6">
      コンテンツ
    </div>

    {/* フッター */}
    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
      <button>キャンセル</button>
      <button>確定</button>
    </div>
  </div>
</div>
```

### トースト通知

```tsx
{/* 成功 */}
<div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
  <IconCheck className="w-5 h-5" />
  <span>アップロードが完了しました</span>
</div>

{/* エラー */}
<div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
  <IconX className="w-5 h-5" />
  <span>エラーが発生しました</span>
</div>
```

---

## 📐 レイアウト

### グリッドレイアウト（ギャラリー）

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* 画像カード */}
  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
    <img src="..." alt="..." className="w-full h-full object-cover" />
  </div>
</div>
```

### レスポンシブブレークポイント

```
Mobile:     0px - 639px   (デフォルト)
Tablet:   640px - 1023px  (sm:)
Desktop: 1024px -         (lg:)
```

### コンテナ幅

```tsx
{/* 最大幅制限 */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  コンテンツ
</div>
```

---

## 🎭 アニメーション

### トランジション

```tsx
{/* ホバー時の色変化 */}
<button className="transition-colors duration-200">
  ボタン
</button>

{/* ホバー時の影変化 */}
<div className="transition-shadow duration-300">
  カード
</div>

{/* すべてのプロパティ */}
<div className="transition-all duration-200">
  要素
</div>
```

### アニメーション例

#### フェードイン
```tsx
<div className="animate-fade-in">
  コンテンツ
</div>

// tailwind.config.ts に追加
{
  keyframes: {
    'fade-in': {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
  },
  animation: {
    'fade-in': 'fade-in 0.3s ease-in-out',
  },
}
```

#### スライドイン（下から）
```tsx
<div className="animate-slide-up">
  コンテンツ
</div>

// tailwind.config.ts に追加
{
  keyframes: {
    'slide-up': {
      '0%': { transform: 'translateY(20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
  },
  animation: {
    'slide-up': 'slide-up 0.3s ease-out',
  },
}
```

---

## 🖼 画像・アイコン

### 画像表示

```tsx
{/* アスペクト比を保持 */}
<div className="aspect-square overflow-hidden rounded-lg">
  <img
    src="..."
    alt="..."
    className="w-full h-full object-cover"
  />
</div>

{/* ローディング状態 */}
<div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
```

### アイコンサイズ

| サイズ | Tailwind | ピクセル | 用途 |
|-------|----------|---------|------|
| 小 | `w-4 h-4` | 16px | インラインアイコン |
| 標準 | `w-5 h-5` | 20px | ボタンアイコン |
| 中 | `w-6 h-6` | 24px | カードアイコン |
| 大 | `w-8 h-8` | 32px | ヘッダーアイコン |

### 推奨アイコンライブラリ

**Heroicons** または **Lucide React**

```tsx
import { CloudArrowUpIcon, PhotoIcon, ShareIcon } from '@heroicons/react/24/outline';

<CloudArrowUpIcon className="w-6 h-6 text-gray-600" />
```

---

## ♿️ アクセシビリティ

### カラーコントラスト

- 本文テキスト: 最低4.5:1
- 大きいテキスト: 最低3:1
- グレーで表示する場合は`text-gray-600`以上を使用

### フォーカス状態

```tsx
{/* キーボードフォーカス時の表示 */}
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  ボタン
</button>
```

### Alt属性

```tsx
{/* すべての画像にalt属性を追加 */}
<img src="vacation.jpg" alt="バケーション写真" />

{/* 装飾画像は空文字列 */}
<img src="decoration.svg" alt="" />
```

### ARIA属性

```tsx
{/* ローディング状態 */}
<button aria-busy="true" aria-label="アップロード中">
  <Spinner />
</button>

{/* モーダル */}
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">モーダルタイトル</h2>
</div>
```

---

## 📱 レスポンシブデザイン

### モバイル（〜639px）

- グリッド: 1列
- フォントサイズ: 小さめ
- パディング: 狭め（p-4）
- ボタン: フル幅

```tsx
<div className="w-full px-4 space-y-4">
  <button className="w-full">アップロード</button>
</div>
```

### タブレット（640px〜1023px）

- グリッド: 2-3列
- フォントサイズ: 標準
- パディング: 標準（p-6）

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  カード
</div>
```

### デスクトップ（1024px〜）

- グリッド: 3-4列
- フォントサイズ: 大きめ
- パディング: 広め（p-8）

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  カード
</div>
```

---

## 🎯 UI/UXベストプラクティス

### ローディング状態

```tsx
{/* スピナー */}
<div className="flex items-center justify-center p-8">
  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
</div>

{/* スケルトンスクリーン */}
<div className="space-y-4">
  <div className="h-4 bg-gray-200 rounded animate-pulse" />
  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
</div>
```

### エラー状態

```tsx
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-sm text-red-800">
    エラーが発生しました。もう一度お試しください。
  </p>
</div>
```

### 空状態

```tsx
<div className="flex flex-col items-center justify-center p-12 text-center">
  <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    まだファイルがありません
  </h3>
  <p className="text-sm text-gray-500 mb-4">
    ファイルをアップロードして始めましょう
  </p>
  <button>アップロード</button>
</div>
```

---

## 📋 コンポーネント一覧

### 実装すべきコンポーネント

| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| Button | `components/ui/Button.tsx` | プライマリ、セカンダリ、危険 |
| Modal | `components/ui/Modal.tsx` | モーダルダイアログ |
| Toast | `components/ui/Toast.tsx` | 通知トースト |
| Spinner | `components/ui/Spinner.tsx` | ローディングスピナー |
| FileUploader | `components/features/upload/FileUploader.tsx` | アップロードUI |
| DropZone | `components/features/upload/DropZone.tsx` | ドラッグ&ドロップ |
| ProgressBar | `components/features/upload/ProgressBar.tsx` | プログレスバー |
| Gallery | `components/features/gallery/Gallery.tsx` | ギャラリー全体 |
| GalleryGrid | `components/features/gallery/GalleryGrid.tsx` | グリッドレイアウト |
| ImageCard | `components/features/gallery/ImageCard.tsx` | 画像カード |
| ImagePreview | `components/features/gallery/ImagePreview.tsx` | プレビューモーダル |
| ShareButton | `components/features/share/ShareButton.tsx` | 共有ボタン |

---

## 🎨 Tailwind設定ファイル

### tailwind.config.ts の推奨設定

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## ✅ デザインチェックリスト

実装前に確認：

- [ ] カラーパレットに従っているか
- [ ] フォントサイズ・ウェイトは適切か
- [ ] スペーシングは8pxグリッドか
- [ ] レスポンシブ対応しているか（3サイズ確認）
- [ ] ホバー・フォーカス状態が実装されているか
- [ ] ローディング状態が表示されるか
- [ ] エラー状態が適切に表示されるか
- [ ] アクセシビリティ対応（alt, aria）しているか
- [ ] アニメーションは滑らかか

---

## 🎓 参考リソース

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

これでデザインガイドは完成です！実装時はこのガイドを参照しながら、一貫性のあるデザインを心がけてください。
