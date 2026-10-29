'use client';
import { useEffect, useMemo, useState } from 'react';
import { ReaderEpisodeBatch } from './ReaderEpisodeBatch';
import type { ReaderContent } from '../../../lib/admin/firebase/reader-api';

const languages = ['ko', 'en', 'ja'] as const;
const labels = { ko: '한국어', en: 'English', ja: '日本語' };
type Language = typeof languages[number];
export function MonthlyEpisodeBatch({ issues, setBusy, onDirty }: {
  issues: ReaderContent[]; setBusy: (value: boolean) => void; onDirty: (value: boolean) => void;
}) {
  const [language, setLanguage] = useState<Language>('ko');
  const [states, setStates] = useState<Partial<Record<Language, { busy: boolean; dirty: boolean }>>>({});
  const handlers = useMemo(() => Object.fromEntries(languages.map(l => [l, (busy: boolean, dirty: boolean) => {
    setStates(previous => previous[l]?.busy === busy && previous[l]?.dirty === dirty ? previous : { ...previous, [l]: { busy, dirty } });
  }])) as Record<Language, (busy: boolean, dirty: boolean) => void>, []);
  const busy = Object.values(states).some(s => s.busy);
  const dirty = Object.values(states).some(s => s.dirty);
  useEffect(() => { setBusy(busy); onDirty(dirty); }, [busy, dirty, setBusy, onDirty]);
  return <div className="space-y-4">
    <p className="text-sm text-slate-400">언어별로 원고·이미지를 여러 개 넣으세요. 탭을 바꿔도 파일 선택은 유지됩니다. 저장은 현재 언어만 처리하며 기존 회차는 제외합니다.</p>
    <div role="tablist" aria-label="일괄등록 언어" className="flex gap-2">
      {languages.map(l => <button key={l} role="tab" aria-selected={language === l} aria-controls={`batch-${l}`} disabled={busy} onClick={() => setLanguage(l)} className={`rounded-lg border px-4 py-2 text-sm ${language === l ? 'border-emerald-400 bg-emerald-950' : 'border-slate-700'}`}>{labels[l]}{states[l]?.dirty ? ' •' : ''}</button>)}
    </div>
    {languages.map(l => {
      const issue = issues.find(item => (item.language || 'ko') === l);
      return <div key={l} id={`batch-${l}`} role="tabpanel" aria-label={labels[l]} hidden={language !== l}>
        {issue ? <ReaderEpisodeBatch series={issue} integrated active={language === l} related={issues} onState={handlers[l]} onClose={() => {}} /> : <p>이 언어의 월간호가 없습니다. 같은 연·월의 ‘3개 언어 월간호 만들기’를 먼저 눌러 주세요.</p>}
      </div>;
    })}
  </div>;
}
