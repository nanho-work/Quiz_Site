'use client';
import {ReaderWorkList} from './ReaderWorkList';
import {ReaderStatus,ReaderPageFrame,readerButton,readerPrimaryButton} from './ReaderAdminUI';
import {useReaderLeaveGuard} from '../../../lib/admin/use-reader-leave-guard';
import { mergeSelectedFiles, validateFileSelection, READER_FILE_ACCEPT } from '../../../lib/admin/reader/file-selection';
import { ReaderImagePreview } from './ReaderImagePreview';
import { ReaderFileInput } from './ReaderFileInput';
import { useCallback, useEffect, useState } from 'react';
import { listReaderContent, type ReaderContent } from '../../../lib/admin/firebase/reader-api';
import { mergeEpisodeFiles } from '../../../lib/admin/reader/episode-batch';
import { WorkEditor } from './WorkTranslations';

const languages = ['ko', 'en', 'ja'] as const;
type Language = typeof languages[number];
const names = { ko: '한국어', en: 'English', ja: '日本語' };
const button = readerButton;
const input = 'w-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-slate-100';
type Draft = { key: string; kind: 'book' | 'series'; files: Partial<Record<Language, File[]>>; titles: Partial<Record<Language, string>>; cover?: File; commonImages?: File[]; covers?: Partial<Record<Language, File>> };


export default function GeneralBookManager() {
  const [items, setItems] = useState<ReaderContent[]>([]);
  const [screen, setScreen] = useState<'list' | 'upload' | 'edit'>('list');
  const [selected, setSelected] = useState<ReaderContent[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [files, setFiles] = useState<Partial<Record<Language, File[]>>>({});
  const [images, setImages] = useState<File[]>([]);
  const [covers, setCovers] = useState<Partial<Record<Language, File>>>({});
  const [layout, setLayout] = useState<'' | 'series' | 'books'>('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [states, setStates] = useState<Record<string, { busy?: boolean; dirty?: boolean }>>({});
  const busy = Object.values(states).some(s => s.busy);
  const dirty = Object.values(states).some(s => s.dirty) || (screen === 'upload' && (Object.values(covers).some(Boolean) || images.length > 0 || Object.values(files).some(f => f.length)));
  const reload = useCallback(async () => {
    const result: ReaderContent[] = [];
    for (const kind of ['book','series'] as const) {
      let after: string | undefined;
      do { const page = await listReaderContent(kind, after); result.push(...page.items); after = page.nextCursor || undefined; } while (after);
    }
    setItems(result.filter(x => x.collectionType === 'general' && !x.seriesId && !x.issueMonth));
  }, []);
  useEffect(() => { void reload().catch(e => setError(e.message)).finally(() => setLoading(false)); }, [reload]);
  useReaderLeaveGuard(dirty,busy);
  const leave = () => !busy && (!dirty || window.confirm('저장하지 않은 파일과 입력을 닫을까요?'));
  const groups = [...new Set(items.map(x => x.translationGroupId || x.id))].map(id => items.filter(x => (x.translationGroupId || x.id) === id));
  const rows = Object.fromEntries(languages.map(l => [l, mergeEpisodeFiles([], files[l] || [], '', true).rows]));
  const commonRows = mergeEpisodeFiles([], images, '', true).rows;
  const numberedBooks=languages.flatMap(l=>rows[l].filter(r=>r.books.length));
  const multiple = languages.some(l => rows[l].filter(r => r.books.length).length > 1) || (numberedBooks.every(r=>!!r.number) && new Set(numberedBooks.map(r=>r.number)).size>1);
  const keys = [...new Set(languages.flatMap(l => rows[l].filter(r => r.books.length).map(r => r.key)))];
  const coverFor = (key: string) => commonRows.find(r => r.key === key)?.covers[0] || (images.length === 1 ? images[0] : undefined);
  function choose(l: Language | 'common', incoming: File[]) {
    const merged = mergeSelectedFiles(l === 'common' ? images : files[l] || [], incoming);
    const problem = validateFileSelection(merged, l === 'common' ? READER_FILE_ACCEPT.image : READER_FILE_ACCEPT.content, true);
    if (problem) { setError(problem); return; }
    const checked = mergeEpisodeFiles([], merged, '', true);
    if (checked.rejected.length || (l === 'common' && checked.rows.some(r => r.books.length))) { setError('원고는 TXT·EPUB 20MB 이하, 이미지는 PNG·JPG·WEBP 5MB 이하로 넣어 주세요.'); return; }
    setError('');
    if (l === 'common') setImages(merged); else setFiles(p => ({...p,[l]:merged}));
    setLayout('');
  }
  function review() {
    setError('');
    if (!languages.some(l => rows[l].some(r => r.books.length))) { setError('원고 파일을 먼저 넣어 주세요.'); return; }
    if (multiple && !layout) { setError('여러 원고가 한 작품의 회차인지, 각각 다른 책인지 선택해 주세요.'); return; }
    const all = languages.flatMap(l => rows[l]);
    if (all.some(r => r.books.length > 1 || r.covers.length > 1) || commonRows.some(r => r.covers.length > 1)) { setError('같은 번호에 파일이 중복되었습니다. 언어별 본문과 이미지는 각각 하나씩 넣어 주세요.'); return; }
    if (multiple && all.some(r => r.books.length && !r.number)) { setError('여러 원고는 01_제목.txt처럼 번호를 붙여 주세요. 언어마다 같은 번호로 연결합니다.'); return; }
    if (all.some(r => !r.books.length && r.covers.length) || commonRows.some(r => images.length > 1 && !keys.includes(r.key))) { setError('연결할 본문이 없는 이미지가 있습니다. 파일 번호를 확인해 주세요.'); return; }
    if (multiple && layout === 'series' && commonRows.some(r => !r.number)) { setError('회차 공통 이미지는 01.png처럼 회차 번호를 붙여 주세요.'); return; }
    if (multiple && layout === 'series') {
      setDrafts([{key:'series',kind:'series',files,commonImages:images,covers,titles:{}}]);
    } else if (multiple) {
      if (Object.values(covers).some(Boolean)) { setError('각각 다른 책으로 등록할 때는 다음 단계에서 책별 대표 표지를 넣어 주세요. 위의 대표 표지 선택을 비우면 계속할 수 있습니다.'); return; }
      setDrafts(keys.map(key => ({key,kind:'book',cover:coverFor(key),files:Object.fromEntries(languages.map(l => { const row = rows[l].find(r => r.key === key); return [l,row ? [...row.books,...row.covers] : []]; })),titles:Object.fromEntries(languages.map(l => [l,rows[l].find(r => r.key === key)?.title || '']))})));
    } else {
      if (Object.values(covers).some(Boolean) && (images.length || all.some(r => r.covers.length))) { setError('한 권 파일은 대표 표지 한 장을 사용합니다. 회차 삽화 영역의 이미지를 비우거나, 여러 회차 원고로 등록해 주세요.'); return; }
      if (images.length > 1) { setError('한 권의 공통 표지는 한 장만 선택해 주세요.'); return; }
      setDrafts([{key:'book',kind:'book',files,cover:images[0],covers,titles:Object.fromEntries(languages.map(l => [l,rows[l].find(r => r.books.length)?.title || '']))}]);
    }
    setSelected([]); setStates({}); setActive(0); setScreen('edit');
  }
  const mark = useCallback((key: string, patch: {busy?: boolean;dirty?:boolean}) => setStates(p => Object.entries(patch).every(([k,v]) => p[key]?.[k as 'busy'|'dirty'] === v) ? p : {...p,[key]:{...p[key],...patch}}), []);
  return <ReaderPageFrame toolbar={screen === 'list' ? <>
      <button className={readerPrimaryButton} onClick={() => {setScreen('upload');setFiles({});setImages([]);setCovers({});setLayout('');setError('');}}>+ 도서 등록</button>
      <input className={`${input} reader-general-search`} aria-label="도서 검색" placeholder="도서 제목 검색" value={query} onChange={e => setQuery(e.target.value)} />
    </> : <><button disabled={busy} className={readerButton} onClick={() => { if (leave()) {setScreen('list');setStates({});setFiles({});setImages([]);setCovers({});} }}>← 도서 목록</button><h1 className="reader-page-title">{selected.length ? '도서 관리' : '도서 등록'}</h1></>}>
    {error && <p role="alert" className="text-amber-300">{error}</p>}
    {screen === 'list' && <ReaderWorkList loading={loading} query={query} busy={busy} onStatusChanged={reload} onStatusBusy={value=>mark('list-status',{busy:value})} rows={groups.map(g=>({id:g[0].translationGroupId||g[0].id,title:(g.find(x=>x.language==='ko')||g[0]).title,detail:g[0].kind==='series'?'회차가 있는 도서':'한 권의 도서',items:g}))} onOpen={id=>{const g=groups.find(g=>(g[0].translationGroupId||g[0].id)===id)!;setSelected(g);setDrafts([]);setScreen('edit');setStates({});}}/>}
    {screen === 'upload' && <><section className="space-y-4 border-b border-slate-700 pb-6"><h2 className="text-lg font-semibold">책 대표 표지</h2><p className="text-sm text-slate-400">묶음책 전체를 나타내는 겉표지입니다. 언어별로 한 장씩 넣으세요. 파일명은 자유이며 회차 번호와 연결하지 않습니다. 다음 단계에서 넣어도 됩니다.</p><div className="reader-language-grid grid md:grid-cols-3">{languages.map(l => <div key={l} className="min-w-0"><label className="block"><strong>{names[l]} 대표 표지</strong><ReaderFileInput accept={READER_FILE_ACCEPT.image} onFiles={selected => setCovers(p => ({...p,[l]:selected[0]}))}/></label><ReaderImagePreview file={covers[l]}/>{covers[l] && <div className="mt-2 flex items-center justify-between gap-2 text-xs"><span className="break-all text-slate-400">{covers[l]?.name}</span><button className={button} onClick={() => setCovers(p => ({...p,[l]:undefined}))}>제외</button></div>}</div>)}</div></section><section className="space-y-4"><h2 className="text-lg font-semibold">회차 원고와 삽화</h2><p className="text-sm text-slate-400">한 권은 파일 하나, 여러 회차는 01_제목.txt처럼 번호를 붙여 넣으세요. 번역본은 같은 번호로 연결됩니다.</p><label className="block border-y border-slate-700 py-5">회차 공통 삽화 <span className="text-sm text-slate-400">언어 없는 삽화 · 01.png, 02.png · 언어별 삽화 우선</span><ReaderFileInput   multiple accept=".png,.jpg,.jpeg,.webp" onFiles={selectedFiles => choose('common',selectedFiles)}/><span className="text-sm text-slate-400">{images.map(f => f.name).join(' · ')}</span></label>{images.length > 0 && <button className={button} onClick={() => setImages([])}>회차 공통 삽화 비우기</button>}<div className="reader-language-grid grid md:grid-cols-3">{languages.map(l => <label key={l} className="min-w-0 border-b border-slate-700 pb-5"><strong>{names[l]} 원고·삽화</strong><ReaderFileInput   multiple accept=".txt,.epub,.png,.jpg,.jpeg,.webp" onFiles={selectedFiles => choose(l,selectedFiles)}/><span className="mt-3 block break-all text-xs text-slate-400">{files[l]?.map(f => f.name).join(' · ') || '01_제목.txt + 필요한 경우 01.png (언어별 회차 삽화)'}</span></label>)}</div><div className="flex flex-wrap gap-3">{languages.filter(l => files[l]?.length).map(l => <button className={button} key={l} onClick={() => {setFiles(p => ({...p,[l]:[]}));setLayout('');}}>{names[l]} 파일 비우기</button>)}</div></section>
    {multiple && <fieldset className="space-y-3"><legend className="mb-2 font-semibold">여러 원고를 어떻게 등록할까요?</legend><label className="mr-6 inline-flex gap-2"><input type="radio" name="layout" checked={layout === 'series'} onChange={() => setLayout('series')} />한 작품으로 묶기</label><label className="inline-flex gap-2"><input type="radio" name="layout" checked={layout === 'books'} onChange={() => setLayout('books')} />여러 책으로 각각 등록</label></fieldset>}
    {keys.length > 0 && <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="pb-3 text-left font-semibold">회차 파일 연결 미리보기</caption><thead><tr className="border-b border-slate-700"><th className="py-3">이미지</th><th>번호</th>{languages.map(l => <th key={l}>{names[l]}</th>)}</tr></thead><tbody>{(multiple ? keys : ['single']).map(key => <tr key={key} className="border-b border-slate-800"><td className="py-3"><ReaderImagePreview compact file={multiple ? coverFor(key) || languages.flatMap(l => rows[l].find(r => r.key === key)?.covers || [])[0] : images[0] || languages.flatMap(l => rows[l].flatMap(r => r.covers))[0]} /></td><td>{multiple ? key.replace('episode-','') : '1'}</td>{languages.map(l => {const row = multiple ? rows[l].find(r => r.key === key) : rows[l].find(r => r.books.length);return <td className="max-w-60 break-words p-2" key={l}>{row?.books[0]?.name || '미등록'}</td>;})}</tr>)}</tbody></table></div>}
    <div className="flex justify-end"><button className={readerPrimaryButton} onClick={review}>등록 내용 확인 →</button></div></>}
    {screen === 'edit' && <>{drafts.length > 1 && <div className="flex flex-wrap gap-2">{drafts.map((d,i) => <button disabled={busy} className={`${button} ${active === i ? 'border-emerald-400' : ''}`} key={d.key} onClick={() => setActive(i)}>{i+1}. {d.titles.ko || d.titles.en || d.titles.ja}</button>)}</div>}{selected.length ? <EditorPanel id="existing" initial={selected} candidates={items} reload={reload} mark={mark}/> : drafts.map((draft,i) => <div key={draft.key} hidden={active !== i}><EditorPanel id={draft.key} draft={draft} initial={[]} candidates={items} reload={reload} mark={mark}/></div>)}</>}
  </ReaderPageFrame>;
}
function EditorPanel({ id, draft, initial, candidates, reload, mark }: {id:string;draft?:Draft;initial:ReaderContent[];candidates:ReaderContent[];reload:()=>Promise<void>;mark:(key:string,patch:{busy?:boolean;dirty?:boolean})=>void}) {
  const onDirty = useCallback((dirty:boolean)=>mark(id,{dirty}),[id,mark]);
  const setBusy = useCallback((busy:boolean)=>mark(id,{busy}),[id,mark]);
  return <WorkEditor general initial={initial} kind={draft?.kind || (initial[0]?.kind === 'series' ? 'series':'book')} seedFiles={draft?.files} seedTitles={draft?.titles} seedCommon={draft?.cover} seedCommonImages={draft?.commonImages} seedCovers={draft?.covers} candidates={candidates} onDirty={onDirty} setBusy={setBusy} reload={reload}/>;
}
