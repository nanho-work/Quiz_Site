'use client';
import { mergeSelectedFiles, validateFileSelection, READER_FILE_ACCEPT } from '../../../lib/admin/reader/file-selection';
import { ReaderFileInput } from './ReaderFileInput';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReaderEpisodeBatch } from './ReaderEpisodeBatch';
import { uploadSharedReaderCover, type ReaderContent } from '../../../lib/admin/firebase/reader-api';

import { mergeEpisodeFiles } from '../../../lib/admin/reader/episode-batch';
const languages = ['ko', 'en', 'ja'] as const;
const labels = { ko: '한국어', en: 'English', ja: '日本語' };
type Language = typeof languages[number];
export function MonthlyEpisodeBatch({ issues, setBusy, onDirty, ordinary = false, initialFiles, initialCommon }: {
  initialCommon?: File[]; initialFiles?: Partial<Record<'ko' | 'en' | 'ja', File[]>>; ordinary?: boolean; issues: ReaderContent[]; setBusy: (value: boolean) => void; onDirty: (value: boolean) => void;
}) {
  const [common, setCommon] = useState<Record<string, File>>(() => Object.fromEntries(mergeEpisodeFiles([], initialCommon || [], '', true).rows.map(row => [row.number, row.covers[0]])));
  const [commonError, setCommonError] = useState('');
  const uploaded = useRef(new Map<File, Promise<string>>());
  const getShared = async (file: File) => {
    let task = uploaded.current.get(file);
    if (!task) { task = uploadSharedReaderCover(file).then(x => x.hash).catch(e => { uploaded.current.delete(file); throw e; }); uploaded.current.set(file, task); }
    return task;
  };
  const [language, setLanguage] = useState<Language>('ko');
  const [states, setStates] = useState<Partial<Record<Language, { busy: boolean; dirty: boolean }>>>({});
  const handlers = useMemo(() => Object.fromEntries(languages.map(l => [l, (busy: boolean, dirty: boolean) => {
    setStates(previous => previous[l]?.busy === busy && previous[l]?.dirty === dirty ? previous : { ...previous, [l]: { busy, dirty } });
  }])) as Record<Language, (busy: boolean, dirty: boolean) => void>, []);
  const busy = Object.values(states).some(s => s.busy);
  const dirty = Object.keys(common).length > 0 || Object.values(states).some(s => s.dirty);
  useEffect(() => { setBusy(busy); onDirty(dirty); }, [busy, dirty, setBusy, onDirty]);
  return <div className="space-y-4">
    <label className="block rounded-lg border border-slate-700 p-4">공통 삽화 (01.png, 02.png · 회차 번호로 연결)
      <ReaderFileInput  multiple accept=".png,.jpg,.jpeg,.webp" disabled={busy} onFiles={selectedFiles => {
        const merged = mergeSelectedFiles(Object.values(common), selectedFiles);
        const problem = validateFileSelection(merged, READER_FILE_ACCEPT.image, true);
        if (problem) { setCommonError(problem); return; }
        const result = mergeEpisodeFiles([], merged, '', true);
        if (result.rejected.length || result.rows.some(x => !x.number || Number(x.number) < 1 || Number(x.number) > 100000 || x.books.length || x.covers.length !== 1)) { setCommonError('회차 번호가 있는 5MB 이하 이미지 한 장씩 선택하세요. 같은 번호의 중복 이미지는 등록할 수 없습니다.'); return; }
        setCommon(Object.fromEntries(result.rows.map(x => [x.number, x.covers[0]]))); setCommonError('');
      }} />
      <p className="text-sm">{Object.entries(common).map(([n, f]) => `${n}화: ${f.name}`).join(' / ')}</p>
      <p className="text-sm">언어별 이미지가 있으면 우선 사용합니다. 공통 이미지는 첫 회차 저장 때 한 번 업로드됩니다. 이미 저장한 회차는 변경하지 않습니다.</p>
      {commonError && <p role="alert">{commonError}</p>}
    </label>
    {Object.keys(common).length > 0 && <button disabled={busy} className="rounded-lg border border-slate-600 px-3 py-2 text-sm disabled:opacity-40" onClick={() => {setCommon({});setCommonError('');}}>공통 삽화 선택 비우기</button>}
    <p className="text-sm text-slate-400">언어별로 원고·이미지를 여러 개 넣으세요. 탭을 바꿔도 파일 선택은 유지됩니다. 저장은 현재 언어만 처리하며 기존 회차는 제외합니다.</p>
    <div role="tablist" aria-label="일괄등록 언어" className="flex gap-2">
      {languages.map(l => <button key={l} role="tab" aria-selected={language === l} aria-controls={`batch-${l}`} disabled={busy} onClick={() => setLanguage(l)} className={`rounded-lg border px-4 py-2 text-sm ${language === l ? 'border-emerald-400 bg-emerald-950' : 'border-slate-700'}`}>{labels[l]}{states[l]?.dirty ? ' •' : ''}</button>)}
    </div>
    {languages.map(l => {
      const issue = issues.find(item => (item.language || 'ko') === l);
      return <div key={l} id={`batch-${l}`} role="tabpanel" aria-label={labels[l]} hidden={language !== l}>
        {issue ? <ReaderEpisodeBatch initialFiles={initialFiles?.[l]} series={issue} embedded integrated commonCovers={common} getSharedCover={getShared} active={language === l} related={issues} onState={handlers[l]} onClose={() => {}} /> : <p>{ordinary ? '이 언어의 작품을 먼저 저장해 주세요.' : '이 언어의 월간호가 없습니다. 같은 연·월의 3개 언어 월간호 만들기를 먼저 눌러 주세요.'}</p>}
      </div>;
    })}
  </div>;
}
