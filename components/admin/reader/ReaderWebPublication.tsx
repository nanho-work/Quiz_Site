'use client';

import { useState } from 'react';
import { setReaderWebPublication, type ReaderContent } from '../../../lib/admin/firebase/reader-api';
import { readerButton } from './ReaderAdminUI';

export function ReaderWebPublication({ item, disabled, onBusy, onChange }: {
  item?: ReaderContent;
  disabled?: boolean;
  onBusy: (busy: boolean) => void;
  onChange: (item: ReaderContent) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  if (item?.kind !== 'book' || item.deleting || !item.published || !item.publishedContent) return null;

  const enabled = item.webPublic === true;
  async function toggle(current: ReaderContent) {
    setPending(true);
    onBusy(true);
    setError('');
    try {
      onChange(await setReaderWebPublication(current, !enabled));
    } catch (error) {
      setError(error instanceof Error ? error.message : '웹 공개 설정을 저장하지 못했습니다.');
    } finally {
      setPending(false);
      onBusy(false);
    }
  }

  return <div className="mt-2">
    <button type="button" className={readerButton} aria-pressed={enabled}
      aria-label={`${item.title} 웹 공개`} disabled={disabled || pending}
      title="쿠피 스토리에서는 기존 공개 일시부터 표시됩니다."
      onClick={() => void toggle(item)}>
      {pending ? '저장 중…' : enabled ? '웹 공개 켜짐' : '웹 공개 꺼짐'}
    </button>
    {error && <p role="alert" className="mt-1 text-xs text-rose-300">{error}</p>}
  </div>;
}
