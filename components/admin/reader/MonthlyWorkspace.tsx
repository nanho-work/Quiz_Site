'use client';
import {ReaderStatus,ReaderSectionHeading,readerButton,readerPrimaryButton} from './ReaderAdminUI';
import {useReaderLeaveGuard} from '../../../lib/admin/use-reader-leave-guard';
import { ReaderImagePreview } from './ReaderImagePreview';
import { ReaderFileInput } from './ReaderFileInput';
import { useEffect, useRef, useState } from 'react';
import { MonthlyEpisodeBatch } from './MonthlyEpisodeBatch';
import { ReaderContentManager } from './ReaderContentManager';
import { listReaderContent, mutateReaderContent, uploadReaderAsset, ensureMonthlyIssues, ensureMonthlyEpisode, type ReaderContent, type ReaderMetadata } from '../../../lib/admin/firebase/reader-api';
import { monthlyTitle } from '../../../lib/admin/firebase/monthly-defaults';
import { commonRelease } from '../../../lib/admin/reader/work-schedule';
import { scheduleIssue } from '../../../lib/admin/reader/monthly-schedule';

const languages = ['ko', 'en', 'ja'] as const;
type Language = typeof languages[number];
const names = { ko: '한국어', en: 'English', ja: '日本語' };
const input = 'mt-2 w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white';
const button = readerButton;
const panel = 'reader-month-panel min-w-0 space-y-4';
const koreaNow = () => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 16);
async function allItems(kind: 'series' | 'book', seriesId?: string) {
  const items: ReaderContent[] = []; let cursor: string | undefined;
  do { const page = await listReaderContent(kind, cursor, seriesId); items.push(...page.items); cursor = page.nextCursor || undefined; } while (cursor);
  return items;
}

function checkImage(file?: File) { if (file && (!/\.(png|jpe?g|webp)$/i.test(file.name) || file.size > 5 * 1024 * 1024 || !file.size)) throw new Error('이미지는 PNG·JPG·WebP, 최대 5MB로 선택해 주세요.'); }

export default function MonthlyWorkspace() {
  const [issues, setIssues] = useState<ReaderContent[]>([]);
  const [month, setMonth] = useState('');
  const [createMonth, setCreateMonth] = useState(koreaNow().slice(0, 7));
  const [tab, setTab] = useState<'settings' | 'episodes' | 'batch'>('settings');
  const [legacy, setLegacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [version, setVersion] = useState(0);
  const guard = () => !dirty || window.confirm('저장하지 않은 입력을 닫고 이동할까요?');
  async function reload() { setIssues((await allItems('series')).filter(x => x.issueMonth || x.publishedContent?.issueMonth)); }
  useEffect(() => { void reload().catch(e => setError(String(e.message))); }, []);
  useReaderLeaveGuard(dirty,busy);
  const selected = issues.filter(x => (x.issueMonth || x.publishedContent?.issueMonth) === month);
  const duplicates = languages.some(l => selected.filter(x => (x.language || 'ko') === l).length > 1);
  const months = [...new Set(issues.map(x => x.issueMonth || x.publishedContent!.issueMonth!))].sort().reverse();
  async function create() {
    if (!guard()) return;
    setBusy(true); setError('');
    try { await ensureMonthlyIssues(createMonth); await reload(); setMonth(createMonth); setTab('settings'); setDirty(false); setVersion(v => v + 1); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <div className="space-y-5 text-slate-200">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-xl font-semibold">월간 쿠피</h1><button disabled={busy} className={button} onClick={() => { if ((legacy ? window.confirm('개별 관리에서 저장을 마쳤나요? 저장하지 않은 입력은 사라집니다.') : guard())) { setDirty(false); setLegacy(!legacy); void reload().catch(e => setError(e.message)); } }}>{legacy ? '통합 관리로 돌아가기' : '기존 개별 관리'}</button></div>
    {legacy ? <ReaderContentManager kind="series" monthly /> : <>
      <div className={panel}><div className="flex flex-wrap items-end gap-3"><label>발행 연·월<input aria-label="생성할 발행 연월" type="month" min="2000-01" max="2099-12" className={input} value={createMonth} disabled={busy} onChange={e => setCreateMonth(e.target.value)} /></label><button className={button} disabled={busy || !createMonth} onClick={() => void create()}>3개 언어 월간호 만들기</button></div><p className="text-sm text-slate-400">한국어·영어·일본어의 틀만 생성합니다. 기존 월간호는 유지하고 없는 언어만 추가합니다. 본문과 이미지는 자동 번역되지 않습니다.</p></div>
      {error && <p role="alert" className="text-rose-300">{error}</p>}
      <div className="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="월간호 목록" className={panel}>{months.length ? months.map(value => <button key={value} disabled={busy} className={`${button} w-full text-left ${month === value ? 'border-emerald-400 bg-emerald-950' : ''}`} onClick={() => { if (guard()) { setMonth(value); setTab('settings'); setDirty(false); } }}>{value} 월간호<span className="mt-2 block text-xs text-slate-400">{languages.map(l => `${names[l]} ${issues.some(x => (x.issueMonth || x.publishedContent?.issueMonth) === value && (x.language || 'ko') === l) ? '등록' : '미등록'}`).join(' · ')}</span></button>) : <p>등록된 월간호가 없습니다.</p>}</nav>
        <div className="min-w-0 space-y-4">{month && <>
          <div className="flex gap-3">{(['settings', 'episodes', 'batch'] as const).map(t => <button key={t} disabled={busy} className={`${button} ${tab === t ? 'bg-emerald-900' : ''}`} onClick={() => { if (guard()) { setDirty(false); setTab(t); } }}>{t === 'settings' ? '월간호 설정' : t === 'episodes' ? '한 회차 등록·수정' : '회차 일괄등록'}</button>)}</div>
          {duplicates ? <p role="alert">같은 월·언어의 월간호가 여러 개 있습니다. 기존 개별 관리에서 확인해 주세요. 자동으로 합치거나 삭제하지 않습니다.</p> : tab === 'settings' ? <IssueSettings key={`${month}-${version}`} issues={selected} busy={busy} setBusy={setBusy} onDirty={setDirty} onUpdate={item => setIssues(prev => prev.map(x => x.id === item.id ? item : x))} /> : tab === 'batch' ? <MonthlyEpisodeBatch key={month} issues={selected} setBusy={setBusy} onDirty={setDirty} /> : <EpisodeEditor key={month} month={month} issues={selected} busy={busy} setBusy={setBusy} onDirty={setDirty} onIssueUpdate={item => setIssues(prev => prev.map(x => x.id === item.id ? item : x))} />}
        </>}</div>
      </div>
    </>}
  </div>;
}

function IssueSettings({ issues, busy, setBusy, onDirty, onUpdate }: { issues: ReaderContent[]; busy: boolean; setBusy: (v: boolean) => void; onDirty: (v: boolean) => void; onUpdate: (v: ReaderContent) => void }) {
  const [forms, setForms] = useState<Record<string, ReaderContent>>(Object.fromEntries(issues.map(i => [i.id, i])));
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [common, setCommon] = useState<File>();
  const [status, setStatus] = useState('');
  const latest = useRef(Object.fromEntries(issues.map(i => [i.id, i])));
  function update(id: string, patch: Partial<ReaderMetadata>) { setForms(prev => ({ ...prev, [id]: { ...prev[id], ...patch } })); onDirty(true); }
  async function save() {
    setStatus('');
    try { checkImage(common); Object.values(files).forEach(checkImage); } catch(e) { setStatus((e as Error).message); return; }
    setBusy(true);
    const failures: string[] = [];
    for (const original of issues) {
      let item = latest.current[original.id];
      const language = item.language || 'ko';
      try {
        item = await mutateReaderContent({ action: 'save', id: item.id, revision: item.revision, metadata: forms[item.id] }); latest.current[item.id] = item;
        const cover = files[item.id] || common;
        if (cover) { item = await uploadReaderAsset(item, 'cover', cover); latest.current[item.id] = item; }
        // Publishing metadata only arms the issue. Catalog visibility requires a released episode.
        if (item.assets.cover) { item = await mutateReaderContent({ action: 'publish', id: item.id, revision: item.revision }); latest.current[item.id] = item; }
        onUpdate(item);
      } catch(e) { failures.push(`${names[language]}: ${(e as Error).message}`); onUpdate(latest.current[original.id]); }
    }
    setBusy(false);
    if (failures.length) setStatus(`일부 저장 실패. 성공한 언어는 유지됩니다. ${failures.join(' / ')}`);
    else { setFiles({}); setCommon(undefined); onDirty(false); setStatus('설정 저장 완료. 각 언어의 첫 회차가 공개되면 앱에 표시됩니다.'); }
  }
  return <div className="space-y-4">
    <p className="text-sm text-slate-400">월간호만 만들어서는 앱에 표시되지 않습니다. 표지를 저장한 뒤 회차를 공개하거나 예약해 주세요.</p>
    <fieldset disabled={busy} className={panel}><label>공통 표지 · 등록된 모든 언어에 적용<ReaderFileInput   accept=".png,.jpg,.jpeg,.webp" onFiles={selectedFiles => { setCommon(selectedFiles[0]); onDirty(true); }} /></label><ReaderImagePreview file={common} /></fieldset>
    <div className="grid gap-4 xl:grid-cols-3">{languages.map(l => {
      const item = issues.find(x => (x.language || 'ko') === l); if (!item) return <div key={l} className={panel}>{names[l]} 미등록 · 위에서 같은 월의 3개 언어 만들기를 누르세요.</div>;
      const f = forms[item.id];
      return <fieldset disabled={busy} className={panel} key={item.id}><legend>{names[l]}</legend><label className="block">제목<input className={input} maxLength={160} value={f.title} onChange={e => update(item.id, { title: e.target.value })} /></label><button className="text-xs text-emerald-300 underline" onClick={() => update(item.id, { title: monthlyTitle(item.issueMonth!, l) })}>제목 자동 채우기</button><label className="block">언어별 표지 (공통보다 우선)<ReaderFileInput   accept=".png,.jpg,.jpeg,.webp" onFiles={selectedFiles => { setFiles(p => ({ ...p, [item.id]: selectedFiles[0] })); onDirty(true); }} /></label><ReaderImagePreview file={files[item.id] || common} /><p className="text-xs">{latest.current[item.id]?.assets.cover ? '기존 표지 등록됨 · 새 파일이 없으면 유지' : '표지 미등록'}</p><label className="flex gap-2"><input type="checkbox" checked={f.autoCompile || false} onChange={e => update(item.id, { autoCompile: e.target.checked })} />월말 자동 합본</label><details><summary>추가 정보</summary><label className="block">설명<textarea className={input} value={f.description} onChange={e => update(item.id, { description: e.target.value })} /></label><label className="block">이용 조건<textarea className={input} value={f.license} onChange={e => update(item.id, { license: e.target.value })} /></label></details>{item.compilationId && <p className="text-xs text-amber-300">합본 연결됨 · 합본 관리는 기존 개별 관리에서 가능합니다.</p>}</fieldset>;
    })}</div>
    {status && <p role="status" className="text-sm text-amber-200">{status}</p>}
    <button disabled={busy} className={readerPrimaryButton} onClick={() => void save()}>{busy ? '저장 중…' : '설정 저장'}</button>
  </div>;
}

type Row = { item?: ReaderContent; title: string; byline: string; releaseAt: string; body?: File; image?: File; selected: boolean; status?: string };
function EpisodeEditor({ month, issues, busy, setBusy, onDirty, onIssueUpdate }: { month: string; issues: ReaderContent[]; busy: boolean; setBusy: (v: boolean) => void; onDirty: (v: boolean) => void; onIssueUpdate: (v: ReaderContent) => void }) {
  const [items, setItems] = useState<ReaderContent[]>([]);
  const [number, setNumber] = useState(1);
  const defaultDate = koreaNow().startsWith(month) ? koreaNow() : `${month}-01T09:00`;
  const [date, setDate] = useState(defaultDate);
  const emptyRows = () => Object.fromEntries(languages.map(l => [l, { title: '', byline: '', releaseAt: defaultDate, selected: false }])) as Record<Language, Row>;
  const [rows, setRows] = useState<Record<Language, Row>>(emptyRows);
  const rowsRef = useRef(rows);
  const dirtyLanguages = useRef(new Set<Language>());
  const appliedImages=useRef(new Set<Language>());
  const [common, setCommon] = useState<File>();
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [changed, setChanged] = useState(false);
  const latestIssues = useRef(Object.fromEntries(issues.map(i => [i.id, i])));
  function dirty() { setChanged(true); onDirty(true); }
  function patch(l: Language, value: Partial<Row>, user = true) { rowsRef.current = { ...rowsRef.current, [l]: { ...rowsRef.current[l], ...value } }; setRows(rowsRef.current); if (user) { dirtyLanguages.current.add(l); dirty(); } }
  async function reload() { const all = (await Promise.all(issues.map(i => allItems('book', i.id)))).flat(); setItems(all); return all; }
  function open(n: number, all = items) {
    dirtyLanguages.current.clear(); appliedImages.current.clear(); setNumber(n); setCommon(undefined); setDate(defaultDate);
    const next = emptyRows();
    for (const l of languages) { const parent = issues.find(x => (x.language || 'ko') === l); const item = all.find(x => x.seriesId === parent?.id && x.episodeNumber === n); if (item) next[l] = { item, title: item.title, byline: item.byline || '', releaseAt: item.releaseAt?.slice(0,16) || (item.releaseDate ? `${item.releaseDate}T09:00` : defaultDate), selected: false }; }
    const stored=commonRelease(Object.values(next).filter(r=>r.item).map(r=>r.item!));
    setDate(stored===undefined?'':stored?stored.slice(0,16):defaultDate);
    rowsRef.current = next; setRows(next); setChanged(false); onDirty(false); setError('');
  }
  useEffect(() => { let active = true; void reload().then(all => { if (active) { open(Math.max(0, ...all.map(i => i.episodeNumber || 0)) + 1, all); setLoaded(true); } }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const numbers = [...new Set(items.map(i => i.episodeNumber!))].sort((a,b) => a-b);
  async function save(publish: boolean) {
    const selected = languages.filter(l => rowsRef.current[l].selected);
    try {
      if (!selected.length) throw new Error('저장하거나 공개할 언어를 선택해 주세요.');
      checkImage(common);
      for (const l of selected) {
        const row = rowsRef.current[l], parent = issues.find(x => (x.language || 'ko') === l);
        if (!parent) throw new Error(`${names[l]} 월간호를 먼저 생성해 주세요.`);
        if (parent.compilationId || parent.publishedContent?.compilationId) throw new Error(`${names[l]} 합본이 이미 생성되었습니다. 기존 개별 관리에서 확인해 주세요.`);
        if (!row.title.trim()) throw new Error(`${names[l]} 제목을 입력해 주세요.`);
        const problem = scheduleIssue(`${row.releaseAt}:00+09:00`, month); if (problem) throw new Error(`${names[l]}: ${problem}`);
        checkImage(row.image);
        if (row.body && (!/\.(txt|epub)$/i.test(row.body.name) || row.body.size > 20*1024*1024 || !row.body.size)) throw new Error(`${names[l]} TXT·EPUB은 최대 20MB입니다.`);
        if (publish && (!parent.assets.cover || !(row.body || row.item?.assets.txt || row.item?.assets.epub) || !(row.image || common || row.item?.assets.cover))) throw new Error(`${names[l]} 월간호 표지, 회차 본문과 회차 이미지가 모두 필요합니다.`);
      }
    } catch(e) { setError((e as Error).message); return; }
    setBusy(true); setError(''); let failed = false;
    for (const l of selected) {
      const row = rowsRef.current[l]; let parent = latestIssues.current[issues.find(x => (x.language || 'ko') === l)!.id];
      try {
        const metadata: ReaderMetadata = { ...parent, title: row.title, byline: row.byline, description: row.item?.description || '', episodeNumber: number, releaseDate: row.releaseAt.slice(0,10), releaseAt: `${row.releaseAt}:00+09:00` };
        let item = row.item;
        if (!item) {
          item = await ensureMonthlyEpisode(parent.id, metadata); patch(l, { item }, false);
          // An existing translation is not silently overwritten after a lost response/concurrent creation.
          if (item.assets.txt || item.assets.epub || item.publishedContent) throw new Error('이미 저장된 회차가 있습니다. 목록을 다시 열어 내용을 확인해 주세요.');
        }
        item = await mutateReaderContent({ action: 'save', id: item.id, revision: item.revision, metadata }); patch(l, { item }, false);
        if (row.body) { item = await uploadReaderAsset(item, 'book', row.body); patch(l, { item, body: undefined }, false); }
        if (row.image || (common && !appliedImages.current.has(l))) { item = await uploadReaderAsset(item, 'cover', (row.image || common)!); appliedImages.current.add(l); patch(l, { item, image: undefined }, false); }
        if (publish) {
          if (!parent.published || parent.publishedContent?.version !== parent.revision) { parent = await mutateReaderContent({ action: 'publish', id: parent.id, revision: parent.revision }); latestIssues.current[parent.id] = parent; onIssueUpdate(parent); }
          item = await mutateReaderContent({ action: 'publish', id: item.id, revision: item.revision }); patch(l, { item }, false);
        }
        dirtyLanguages.current.delete(l);
        patch(l, { selected: false, status: publish ? (new Date(`${row.releaseAt}:00+09:00`).getTime() > Date.now() ? '예약 공개 완료' : '공개 완료') : '초안 저장 완료' }, false);
      } catch(e) { failed = true; patch(l, { status: `실패: ${(e as Error).message}` }, false); }
    }
    try { await reload(); } catch(e) { failed = true; setError(`목록 확인 실패: ${(e as Error).message}`); }
    setBusy(false);
    if (!failed) { setCommon(undefined); const remaining = dirtyLanguages.current.size > 0; setChanged(remaining); onDirty(remaining); }
    else setError('일부 작업이 실패했습니다. 성공한 언어는 유지하며, 실패한 언어만 확인 후 다시 저장해 주세요.');
  }
  return <div className="space-y-4">
    <div className={panel}><div className="flex flex-wrap gap-3"><label>회차<select disabled={busy || !loaded} className={input} value={number} onChange={e => { if (!changed || window.confirm('저장하지 않은 입력을 닫을까요?')) open(Number(e.target.value)); }}>{[...new Set([...numbers, Math.max(0,...numbers)+1, number])].sort((a,b)=>a-b).map(n => <option key={n} value={n}>{n}회차 {numbers.includes(n) ? '' : '(새 회차)'}</option>)}</select></label><label>공개 일시 · 한국 시간<input disabled={busy} className={input} type="datetime-local" value={date} onChange={e => { setDate(e.target.value); languages.forEach(l => patch(l, { releaseAt: e.target.value })); }} /></label></div><p className="text-xs text-slate-400">같은 월·회차 번호를 같은 이야기의 번역본으로 표시합니다. 기존 회차의 ID·파일·독서 기록은 유지합니다. 공통 일시를 바꾸면 세 언어 입력에 적용되며 선택한 언어만 저장됩니다.</p><label className="block">공통 회차 이미지 (언어별 이미지가 있으면 해당 이미지 우선)<ReaderFileInput key={`common-${number}-${common?.name || "empty"}`} disabled={busy}   accept=".png,.jpg,.jpeg,.webp" onFiles={selectedFiles => { appliedImages.current.clear(); setCommon(selectedFiles[0]); dirty(); }} /></label></div>
    <div className="grid gap-4 xl:grid-cols-3">{languages.map(l => { const row = rows[l]; return <fieldset disabled={busy || !loaded} className={panel} key={`${number}-${l}`}><legend><label className="flex gap-2"><input type="checkbox" checked={row.selected} onChange={e => patch(l, { selected: e.target.checked })} />{names[l]} 저장·공개 대상</label></legend><label className="block">제목<input className={input} value={row.title} maxLength={160} onChange={e => patch(l, { title: e.target.value })} /></label><label className="block">글쓴이 (선택)<input className={input} value={row.byline} maxLength={120} onChange={e => patch(l, { byline: e.target.value })} /></label><label className="block">본문 TXT·EPUB<ReaderFileInput   accept=".txt,.epub" onFiles={selectedFiles => patch(l, { body: selectedFiles[0] })} /></label><p className="text-xs text-slate-400">{row.body?.name || (row.item?.assets.txt || row.item?.assets.epub ? '기존 본문 유지' : '본문 미등록')}</p><label className="block">언어별 이미지<ReaderFileInput   accept=".png,.jpg,.jpeg,.webp" onFiles={selectedFiles => patch(l, { image: selectedFiles[0] })} /></label><ReaderImagePreview file={row.image || (!appliedImages.current.has(l)?common:undefined)} /><p className="text-xs text-slate-400">{row.image?.name || (!appliedImages.current.has(l)?common?.name:undefined) || (row.item?.assets.cover ? '기존 회차 이미지 유지' : '이미지 미등록')}</p><label className="block">이 언어의 공개 일시<input type="datetime-local" className={input} value={row.releaseAt} onChange={e => patch(l, { releaseAt: e.target.value })} /></label><p role="status" className="text-sm text-emerald-200"><ReaderStatus value={row.status || (row.item?.published ? (row.item.releaseAt && Date.parse(row.item.releaseAt)>Date.now()?'공개 예약':'공개 중') : row.item ? '임시 저장' : '미등록')}/></p></fieldset>; })}</div>
    {error && <p role="alert" className="text-rose-300">{error}</p>}
    <div className="flex flex-wrap gap-3"><button className={button} disabled={busy || !loaded} onClick={() => void save(false)}>선택 언어 초안 저장</button><button className={readerPrimaryButton} disabled={busy || !loaded} onClick={() => void save(true)}>선택 언어 공개·예약</button></div><p className="text-xs text-slate-400">미래 일시는 예약, 현재·이전 일시는 즉시 공개됩니다. 언어별로 처리하며 중간에 실패하면 각 카드에 결과를 표시합니다. 합본에는 TXT 원본이 필요합니다.</p>
  </div>;
}
