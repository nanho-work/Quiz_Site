'use client';

import { useRef, useState } from 'react';
import { setReaderWebPublication, type ReaderContent } from '../../../lib/admin/firebase/reader-api';
import { readerButton } from './ReaderAdminUI';

function canSetWebPublication(item?: ReaderContent): item is ReaderContent {
  return item?.kind === 'book' && !item.deleting && item.published && Boolean(item.publishedContent);
}

export function ReaderWebPublication({ item, disabled, onBusy, onChange }: {
  item?: ReaderContent;
  disabled?: boolean;
  onBusy: (busy: boolean) => void;
  onChange: (item: ReaderContent) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  if (!canSetWebPublication(item)) return null;

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

export function ReaderBulkWebPublication({ items, scope, disabled, onBusy, onChange }: {
  items: ReaderContent[];
  scope: 'episodes' | 'translations';
  disabled?: boolean;
  onBusy: (busy: boolean) => void;
  onChange: (items: ReaderContent[]) => void;
}) {
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [result, setResult] = useState<{ succeeded: number; failures: { id: string; label: string; error: string }[] } | null>(null);
  const running = useRef(false);
  const eligible = [...new Map(items.filter(canSetWebPublication).map(item => [item.id, item])).values()];
  const targets = eligible.filter(item => item.webPublic !== true);
  const unit = scope === 'episodes' ? '언어별 회차' : '언어판';
  if (!eligible.length && !result) return null;

  async function publish() {
    if (running.current || disabled || targets.length === 0) return;
    if (!window.confirm(`이 ${unit} ${targets.length}개의 쿠피스토리 웹 공개를 켤까요? 예약된 글은 기존 공개 시간에 올라갑니다.`)) return;

    running.current = true;
    onBusy(true);
    setResult(null);
    setProgress({ completed: 0, total: targets.length });
    const updated: ReaderContent[] = [];
    const failures: { id: string; label: string; error: string }[] = [];
    try {
      for (const item of targets) {
        try {
          updated.push(await setReaderWebPublication(item, true));
        } catch (error) {
          const language = { ko: '한국어', en: '영어', ja: '일본어' }[item.language ?? 'ko'];
          failures.push({ id: item.id, label: `${item.title} (${language})`,
            error: error instanceof Error ? error.message : '웹 공개 설정을 저장하지 못했습니다.' });
        }
        setProgress({ completed: updated.length + failures.length, total: targets.length });
      }
      if (updated.length) onChange(updated);
      setResult({ succeeded: updated.length, failures });
    } finally {
      setProgress(null);
      onBusy(false);
      running.current = false;
    }
  }

  return <div className="space-y-1.5">
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={readerButton} disabled={disabled || Boolean(progress) || !targets.length}
        onClick={() => void publish()}>
        {progress ? '웹 공개 처리 중…' : '웹 공개 일괄 적용'}
      </button>
      <span className="text-xs text-slate-400">웹 공개 {eligible.length - targets.length}/{eligible.length}개 {unit}</span>
    </div>
    {progress && <p role="status" className="text-sm">웹 공개 처리 {progress.completed}/{progress.total}개 · 완료될 때까지 이 화면을 열어 두세요.</p>}
    {result && <p role="status" className="text-sm">웹 공개 설정 {result.succeeded}개 완료{result.failures.length > 0 && ` · ${result.failures.length}개 실패`}</p>}
    {result && result.failures.length > 0 && <ul aria-label="웹 공개 실패 목록" className="space-y-1 text-xs text-rose-300">
      {result.failures.map(failure => <li key={failure.id}>{failure.label} · {failure.error}</li>)}
    </ul>}
  </div>;
}
