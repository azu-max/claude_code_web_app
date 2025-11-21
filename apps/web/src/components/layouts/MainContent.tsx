'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/features/upload/FileUploader';
import { Gallery } from '@/components/features/gallery/Gallery';

export function MainContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // ギャラリーを更新（トリガーを増やす）
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="mb-12">
        <FileUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="mb-12">
        <Gallery refreshTrigger={refreshTrigger} />
      </div>
    </>
  );
}
