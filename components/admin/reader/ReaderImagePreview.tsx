 'use client';
import { useEffect, useState } from 'react';
/** Local preview only: release object URLs when the file changes or unmounts. */
export function ReaderImagePreview({file, compact = false}: {file?: File; compact?: boolean}) {
  const [url, setUrl] = useState('');
  useEffect(() => { if (!file) {setUrl(''); return;} const value = URL.createObjectURL(file); setUrl(value); return () => URL.revokeObjectURL(value); }, [file]);
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img src={url} alt="선택한 이미지 미리보기" className={compact ? 'h-16 w-12 rounded object-contain' : 'h-36 w-full rounded-lg object-contain'} /> : compact ? <span className="text-xs text-slate-500">이미지 없음</span> : null;
}
