'use client';

import { useEffect, useRef, useState } from 'react';
import { listReaderContent, mutateReaderContent, uploadReaderAsset, type ReaderContent } from '../../../lib/admin/firebase/reader-api';
import { episodeIssues, mergeEpisodeFiles, type EpisodeRow } from '../../../lib/admin/reader/episode-batch';

import { scheduleAt, scheduleIssue } from '../../../lib/admin/reader/monthly-schedule';

const button = 'rounded-lg border border-slate-600 px-4 py-2 text-sm text-white disabled:opacity-40';
const input = 'w-full rounded-lg border border-slate-600 bg-slate-950 p-2 text-sm text-white';
interface Progress { item?: ReaderContent; bookDone?: boolean; coverDone?: boolean; state: 'working' | 'saved' | 'published' | 'failed'; message?: string }
export function ReaderEpisodeBatch({ series, onClose, integrated = false, active = true, related = [], embedded = false, onState }: { series: ReaderContent; onClose: () => void; integrated?: boolean; embedded?: boolean; active?: boolean; related?: ReaderContent[]; onState?: (busy: boolean, dirty: boolean) => void }) {
  const scheduling = Boolean(series.issueMonth || series.collectionType === 'general');
  const [scheduleStart, setScheduleStart] = useState(series.issueMonth ? `${series.issueMonth}-01T09:00` : new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 16));
  const [intervalDays, setIntervalDays] = useState(1);
  const [rows, setRows] = useState<EpisodeRow[]>([]);
  const [referenceDates, setReferenceDates] = useState<Record<number, string>>({});
  const [loadFailed, setLoadFailed] = useState(false);
  const [existing, setExisting] = useState<ReaderContent[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const stop = useRef(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const readExisting = async () => {
    const all: ReaderContent[] = []; let cursor: string | undefined; const seen = new Set<string>();
    do {
      const page = await listReaderContent('book', cursor, series.id); all.push(...page.items);
      cursor = page.nextCursor || undefined;
      if (cursor && seen.has(cursor)) throw new Error('회차 목록을 끝까지 읽지 못했습니다. 다시 확인해 주세요.');
      if (cursor) seen.add(cursor);
    } while (cursor);
    setExisting(all); setLoadFailed(false);
    if (integrated) {
      const dates: Record<number, Set<string>> = {};
      for (const other of related.filter(item => item.id !== series.id)) {
        let after: string | undefined;
        do {
          const page = await listReaderContent('book', after, other.id);
          for (const item of page.items) {
            const value = item.releaseAt || (item.releaseDate ? item.releaseDate + 'T09:00:00+09:00' : '');
            if (value && item.episodeNumber) (dates[item.episodeNumber] ||= new Set()).add(value);
          }
          after = page.nextCursor || undefined;
        } while (after);
      }
      setReferenceDates(Object.fromEntries(Object.entries(dates).filter(([, values]) => values.size === 1).map(([n, values]) => [n, [...values][0]])));
    }
    return all;
  };
  useEffect(() => { if (!active) return; setLoading(true); void readExisting().catch(error => { setLoadFailed(true); setMessage(error.message); }).finally(() => setLoading(false)); }, [series.id, active]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (busy || rows.some(row => !['saved', 'published'].includes(progress[row.key]?.state))) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [busy, rows, progress]);
  const pending = rows.some(row => !['saved', 'published'].includes(progress[row.key]?.state) && !existing.some(item => item.episodeNumber === Number(row.number) && item.id !== progress[row.key]?.item?.id));
  useEffect(() => { onState?.(busy, pending); }, [busy, pending, onState]);
  const issues = (row: EpisodeRow, all = existing) => [...episodeIssues(row, rows, new Set(all.filter(item => item.id !== progress[row.key]?.item?.id).map(item => item.episodeNumber!))), ...(series.issueMonth && row.books[0]?.name.toLowerCase().endsWith('.txt') && row.covers.length !== 1 ? ['TXT 회차에는 첫 페이지 이미지가 필요합니다'] : []), ...(series.issueMonth && (row.byline?.length || 0) > 120 ? ['글쓴이는 120자 이하'] : []), ...(!series.issueMonth && row.releaseAt && scheduleAt(row.releaseAt.slice(0,16), 0, 1) !== row.releaseAt ? ['공개 일시를 확인해 주세요'] : []), ...(series.issueMonth && scheduleIssue(row.releaseAt, series.issueMonth) ? [scheduleIssue(row.releaseAt, series.issueMonth)!] : [])];
  const addFiles = (files: File[]) => {
    if (lock.current || loading || loadFailed) return;
    if (!files.length) { setMessage('폴더 안의 본문·표지 파일들을 선택해서 넣어 주세요.'); return; }
    if (files.length + rows.reduce((sum, row) => sum + row.books.length + row.covers.length, 0) > 1000) { setMessage('한 번에 최대 1,000개 파일을 넣어 주세요.'); return; }
    const result = mergeEpisodeFiles(rows, files, series.title, integrated);
    const locked = result.rows.filter(row => progress[row.key]?.item);
    setRows(result.rows.map(row => progress[row.key]?.item ? rows.find(old => old.key === row.key)! : { ...row, releaseAt: row.releaseAt || referenceDates[Number(row.number)] }));
    setMessage([result.rejected.length ? `지원하지 않는 형식 또는 용량 초과: ${result.rejected.join(', ')}` : '', locked.some(row => files.some(file => row.books.includes(file) || row.covers.includes(file))) ? '처리를 시작한 행에는 파일을 추가하지 않았습니다. 개별 회차 편집을 이용해 주세요.' : ''].filter(Boolean).join(' '));
  };
  const update = (key: string, patch: Partial<EpisodeRow>) => { setRows(current => current.map(row => row.key === key ? { ...row, ...patch } : row)); if (!progress[key]?.item) setProgress(current => { const next = { ...current }; delete next[key]; return next; }); };
  const start = async (publish: boolean) => {
    if (lock.current || loading || loadFailed) return;
    lock.current = true; stop.current = false; setBusy(true); setMessage('기존 회차를 확인하고 있습니다…');
    let completed = 0; let failed = 0;
    try {
      const fresh = await readExisting();
      if (series.compilationId || series.publishedContent?.compilationId) throw new Error('합본이 생성된 월간호입니다. 개별 관리에서 확인해 주세요.');
      for (const row of rows) {
        if (stop.current) break;
        const previous = progress[row.key];
        if (previous?.state === 'published' || (!publish && previous?.state === 'saved') || issues(row, fresh).length) continue;
        if (publish && (!series.published || !(row.covers.length || series.publishedContent?.assets.cover))) continue;
        let state: Progress = { ...previous, state: 'working', message: undefined };
        const remember = (patch: Partial<Progress>) => { state = { ...state, ...patch }; setProgress(current => ({ ...current, [row.key]: state })); };
        remember({}); setMessage(`${row.number}화 처리 중 · 이번 실행 ${completed}개 완료 · ${failed}개 실패`);
        try {
          if (!state.item) {
            const item = await mutateReaderContent({ action: 'create', kind: 'book', seriesId: series.id, metadata: { ...(row.releaseAt ? { releaseDate: row.releaseAt.slice(0, 10), releaseAt: row.releaseAt } : {}), title: row.title.trim(), episodeNumber: Number(row.number), description: row.description, byline: row.byline || '', author: series.author, license: series.license } });
            remember({ item }); fresh.push(item);
          } else {
            const current = fresh.find(item => item.id === state.item!.id);
            if (!current || current.revision !== state.item.revision || current.deleting) throw new Error('서버에서 변경된 회차입니다. 개별 회차 화면에서 확인해 주세요.');
          }
          if (!state.bookDone) remember({ item: await uploadReaderAsset(state.item!, 'book', row.books[0]), bookDone: true });
          if (row.covers.length && !state.coverDone) remember({ item: await uploadReaderAsset(state.item!, 'cover', row.covers[0]), coverDone: true });
          if (publish) remember({ item: await mutateReaderContent({ action: 'publish', id: state.item!.id, revision: state.item!.revision }), state: 'published' });
          else remember({ state: 'saved' });
          completed++;
        } catch (error) { failed++; remember({ state: 'failed', message: error instanceof Error ? error.message : '등록 실패' }); }
      }
      setMessage(`${stop.current ? '중단했습니다. ' : ''}${completed}개 완료 · ${failed}개 실패. 문제가 있는 행은 건너뛰었습니다. 실패한 행은 같은 버튼으로 재시도할 수 있습니다.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : '목록 확인 실패'); }
    finally { lock.current = false; setBusy(false); }
  };
  const ready = (loadFailed ? [] : rows).filter(row => !issues(row).length && progress[row.key]?.state !== 'published');
  return <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-white">{series.title} · 회차 일괄 등록</h2>{!integrated && !embedded && <button className={button} disabled={busy} onClick={() => { if (rows.some(row => !['saved', 'published'].includes(progress[row.key]?.state)) && !window.confirm('아직 완료하지 않은 파일 선택을 닫을까요? 저장된 회차는 유지됩니다.')) return; onClose(); }}>회차 목록으로</button>}</div>
    <p className="text-sm leading-6 text-slate-400">{integrated ? '본문과 이미지를 앞의 회차 번호로 연결합니다. 예: 1화_제목.txt, 1화_이미지.png / 第1話_題名.txt / Episode 1_Title.txt. 다른 언어의 같은 회차에 공개 일시가 하나로 정해져 있으면 자동으로 가져옵니다.' : '본문과 표지를 함께 또는 따로 넣으세요. 확장자를 뺀 파일명이 같으면 연결합니다.'} 예: 작품명_001_회차제목.txt / .jpg. 설명은 선택이며 표지가 없으면 작품 대표 표지를 사용합니다. 기존 회차는 덮어쓰지 않습니다.</p>
    <label onDragOver={event => { event.preventDefault(); if (!busy && !loading && !loadFailed) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); addFiles(Array.from(event.dataTransfer.files)); }} className={`block rounded-xl border-2 border-dashed p-7 text-center text-white ${dragging ? 'border-emerald-400 bg-emerald-950/50' : 'border-slate-600'}`}>
      <span className="block">본문·표지 파일을 여기에 끌어다 놓으세요</span><span className="mt-2 block text-xs text-slate-400">TXT·EPUB 최대 20MB / JPG·PNG·WebP 최대 5MB · 표지는 사용할 폴더 하나에서 선택하세요</span>
      <input aria-label="회차 파일 여러 개 선택" type="file" multiple accept=".txt,.epub,.jpg,.jpeg,.png,.webp" disabled={busy || loading || loadFailed} className="mt-4 max-w-full text-sm" onChange={event => { addFiles(Array.from(event.target.files || [])); event.target.value = ''; }} />
    </label>
    {series.issueMonth && <p className="text-sm text-slate-300">TXT와 회차 이미지를 함께 등록하면 공개 시 이미지 첫 장 → 본문 순서의 EPUB이 만들어집니다. 자동 합본을 쓰려면 모든 회차를 TXT로 등록해 주세요. [장] 표시는 필요 없습니다.</p>}
    {scheduling && <div className="space-y-3 rounded-xl border border-slate-700 p-4">
      <p className="text-sm text-slate-300">{series.issueMonth ? `발행 월: ${series.issueMonth} · ` : ''}한국 시간 기준입니다. 회차 번호 순서로 일정을 넣고, 아래에서 각각 수정할 수 있습니다.</p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-slate-300">시작 일시<input type="datetime-local" className={input} value={scheduleStart} disabled={busy} onChange={e => setScheduleStart(e.target.value)} /></label>
        <label className="text-sm text-slate-300">발행 간격 (일)<input type="number" min={1} max={31} className={input} value={intervalDays} disabled={busy} onChange={e => setIntervalDays(Number(e.target.value))} /></label>
        <button className={button} disabled={busy || !rows.length || !scheduleAt(scheduleStart, 0, intervalDays)} onClick={() => {
          if (rows.some(row => row.releaseAt && !progress[row.key]?.item) && !window.confirm('아직 저장하지 않은 회차의 공개 일시를 다시 배정할까요?')) return;
          let index = 0;
          setRows(rows.map(row => progress[row.key]?.item || existing.some(item => item.episodeNumber === Number(row.number)) ? row : { ...row, releaseAt: scheduleAt(scheduleStart, index++, intervalDays) }));
        }}>미저장 회차에 일정 적용</button>{!series.issueMonth && <button className={button} disabled={busy} onClick={() => setRows(rows.map(row => progress[row.key]?.item || existing.some(item => item.episodeNumber === Number(row.number)) ? row : { ...row, releaseAt: '' }))}>미저장 회차 즉시 공개로 변경</button>}
      </div>
      <p className="text-xs text-slate-400">일정을 확인한 뒤 아래 ‘등록하고 예약·공개’를 누르세요. 과거 일시는 바로 공개됩니다. {series.issueMonth ? '발행 월을 넘긴 회차는 등록되지 않습니다.' : '일시를 비워두면 즉시 공개됩니다.'}</p>
    </div>}
    {loadFailed && <button className={button} onClick={() => { setLoading(true); void readExisting().catch(e => { setLoadFailed(true); setMessage(e.message); }).finally(() => setLoading(false)); }}>목록 다시 확인</button>}
    {message && <p role="status" className="break-words text-sm text-amber-200">{message}</p>}
    <p className="text-sm text-slate-300">{rows.length}개 회차 · 등록 가능 {ready.length}개 {loading ? '· 기존 회차 확인 중…' : ''}</p>
    <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm text-slate-300"><thead><tr>{['회차', scheduling ? '제목·공개 일정' : '제목·설명', '본문', '표지', '상태'].map(label => <th className="p-2" key={label}>{label}</th>)}</tr></thead><tbody>
      {rows.map(row => { const state = progress[row.key]; const problems = issues(row); const locked = busy || !!state?.item || existing.some(item => item.episodeNumber === Number(row.number));
        return <tr key={row.key} className="border-t border-slate-700 align-top">
          <td className="w-24 p-2"><input aria-label={`${row.title} 회차 번호`} type="number" min={1} max={100000} className={input} value={row.number} disabled={locked} onChange={event => update(row.key, { number: event.target.value })} /></td>
          <td className="min-w-64 p-2"><input aria-label={`${row.number || '미지정'}화 제목`} className={input} maxLength={160} value={row.title} disabled={locked} onChange={event => update(row.key, { title: event.target.value })} />{scheduling && <label className="mt-2 block text-xs">공개 일시 (한국 시간)<input type="datetime-local" className={input} value={row.releaseAt?.slice(0, 16) || ''} disabled={locked} onChange={event => update(row.key, { releaseAt: event.target.value ? event.target.value + ':00+09:00' : '' })} /></label>}<textarea aria-label={`${row.number || '미지정'}화 설명`} className={`${input} mt-2`} placeholder={series.issueMonth ? '글쓴이 (선택 · 이미지 위에 표시)' : '설명 (선택)'} maxLength={series.issueMonth ? 120 : 2000} rows={2} value={series.issueMonth ? row.byline || '' : row.description} disabled={locked} onChange={event => update(row.key, series.issueMonth ? { byline: event.target.value } : { description: event.target.value })} /></td>
          {(['books', 'covers'] as const).map(slot => <td className="max-w-56 break-all p-2" key={slot}>{row[slot].length ? row[slot].map((file, index) => <div key={index} className="mb-2">{file.name}{!locked && <button aria-label={`${file.name} 제외`} className="ml-2 text-rose-300" onClick={() => update(row.key, { [slot]: row[slot].filter((_, n) => n !== index) })}>×</button>}</div>) : slot === 'covers' ? '작품 표지 사용' : '본문 없음'}</td>)}
          <td className="min-w-40 p-2"><p className={problems.length || state?.state === 'failed' ? 'text-amber-300' : 'text-emerald-300'}>{state?.state === 'published' ? (row.releaseAt && Date.parse(row.releaseAt) > Date.now() ? '공개 예약 완료' : '공개 완료') : state?.state === 'saved' ? '임시 저장 완료' : state?.state === 'working' ? '처리 중…' : state?.message || problems.join(' · ') || '등록 가능'}</p>{!locked && <button className="mt-2 text-rose-300" onClick={() => { setRows(current => current.filter(item => item.key !== row.key)); setProgress(current => { const next = { ...current }; delete next[row.key]; return next; }); }}>목록에서 제외</button>}</td>
        </tr>;
      })}
    </tbody></table></div>
    <div className="flex flex-wrap gap-3"><button className={button} disabled={busy || loading || !ready.some(row => progress[row.key]?.state !== 'saved')} onClick={() => void start(false)}>전체 임시 저장</button><button className={`${button} bg-emerald-700`} disabled={busy || loading || !series.published || !ready.length} onClick={() => void start(true)}>{series.issueMonth ? '등록하고 예약·공개' : '전체 등록하고 공개'}</button>{busy && <button className={button} onClick={() => { stop.current = true; setMessage('현재 회차를 마친 뒤 중단합니다.'); }}>다음 회차부터 중단</button>}</div>
    {!series.published && <p className="text-sm text-amber-300">월간호 설정에서 표지를 넣고 설정 저장을 먼저 해 주세요.</p>}
    <p className="text-xs text-slate-400">파일 선택은 이 화면에서만 유지됩니다. 등록 중에는 페이지를 닫지 마세요. 임시 저장·공개가 끝난 행은 개별 회차 화면에서 수정할 수 있습니다.</p>
  </section>;
}
