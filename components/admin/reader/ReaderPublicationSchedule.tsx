"use client";
import { useState } from 'react';
import { readerButton } from './ReaderAdminUI';
import { assignSchedule, releaseFields } from '../../../lib/admin/reader/work-schedule';
import { scheduleAt, scheduleIssue } from '../../../lib/admin/reader/monthly-schedule';

const input = 'w-full rounded-lg border border-slate-600 bg-slate-950 p-2 text-sm text-white';

/** Both batch editors use the same Korean-time controls; parents own saved data. */
export function ReaderPublicationSchedule({ numbers, issueMonth, disabled = false, applyLabel = '전체 회차에 일정 적용', onApply, onImmediate, onError }: {
  numbers: number[]; issueMonth?: string; disabled?: boolean; applyLabel?: string;
  onApply: (dates: Record<number, string>) => void; onImmediate?: () => void; onError: (message: string) => void;
}) {
  const [start, setStart] = useState(issueMonth ? `${issueMonth}-01T09:00` : new Date(Date.now() + 9 * 3600000).toISOString().slice(0,16));
  const [interval, setInterval] = useState(1);
  function apply() {
    try {
      const dates = assignSchedule(numbers, start, interval);
      if (issueMonth && Object.values(dates).some(date => scheduleIssue(date, issueMonth))) throw new Error('공개 일시가 발행 월을 벗어납니다. 시작 일시와 간격을 확인해 주세요.');
      onApply(dates);
    } catch (error) { onError((error as Error).message); }
  }
  return <div className="space-y-3 rounded-xl border border-slate-700 p-4">
    <p className="text-sm text-slate-400">{issueMonth ? `발행 월: ${issueMonth} · ` : ''}한국 시간 기준 · 회차 번호 순서로 배정하며 회차별로 수정할 수 있습니다.</p>
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-sm">시작 일시<input type="datetime-local" className={input} value={start} disabled={disabled} onChange={e => setStart(e.target.value)} /></label>
      <label className="text-sm">발행 간격 (일)<input type="number" min={1} max={31} className={input} value={interval} disabled={disabled} onChange={e => setInterval(Number(e.target.value))} /></label>
      <button type="button" className={readerButton} disabled={disabled || !numbers.length || !scheduleAt(start,0,interval)} onClick={apply}>{applyLabel}</button>
      {!issueMonth && onImmediate && <button type="button" className={readerButton} disabled={disabled || !numbers.length} onClick={onImmediate}>즉시 공개로 지정</button>}
    </div>
    <p className="text-xs text-slate-400">일정 지정만으로 공개되지 않습니다. 임시 저장하거나 예약·공개 버튼으로 반영하세요. 미래 일시는 예약, 현재·과거 일시는 즉시 공개됩니다. {issueMonth ? '발행 월 안에서 공개 일시를 지정해 주세요.' : '일시를 비워두면 즉시 공개됩니다.'}</p>
  </div>;
}

export function ReaderReleaseDateField({ value, onChange, label = '공개 일시 (한국 시간)', disabled = false, allowImmediate = true }: {
  value: string | undefined; onChange: (value: string) => void; label?: string; disabled?: boolean; allowImmediate?: boolean;
}) {
  return <label className="block text-xs">{label}
    <input type="datetime-local" className={input} value={value?.slice(0,16) || ''} disabled={disabled} onChange={e => onChange(releaseFields(e.target.value ? e.target.value + ':00+09:00' : '').releaseAt)} />
    {allowImmediate && <button type="button" disabled={disabled} className="mt-2 text-xs underline" onClick={() => onChange('')}>즉시 공개로 지정</button>}
    {value === undefined && <span className="mt-1 block text-amber-300">언어별 일정이 다릅니다. 공통 일정을 선택해 주세요.</span>}
  </label>;
}
