'use client';
import {ReaderStatus,ReaderSectionHeading,readerButton,readerPrimaryButton} from './ReaderAdminUI';
import {useReaderLeaveGuard} from '../../../lib/admin/use-reader-leave-guard';
import { UnifiedWorkEpisodes } from './UnifiedWorkEpisodes';
import { ReaderImagePreview } from './ReaderImagePreview';
import { commonRelease, releaseFields } from '../../../lib/admin/reader/work-schedule';
import { ReaderFileInput } from './ReaderFileInput';
import { useCallback, useEffect, useRef, useState } from 'react';
import { listReaderContent, deleteReaderContent, mutateReaderContent, uploadReaderAsset, linkReaderTranslations, type ReaderContent, type ReaderMetadata } from '../../../lib/admin/firebase/reader-api';
import { ReaderContentManager } from './ReaderContentManager';
import { MonthlyEpisodeBatch } from './MonthlyEpisodeBatch';
import { monthlyDefaults } from '../../../lib/admin/firebase/monthly-defaults';
const langs = ['ko', 'en', 'ja'] as const;
const labels = { ko: '한국어', en: 'English', ja: '日本語' };
const input = 'block w-full rounded-lg border border-slate-700 bg-slate-950 p-2';
const button = readerButton;
export default function WorkTranslations({ kind: defaultKind, general = false }: { kind: 'book' | 'series'; general?: boolean }) {
  const [kind, setKind] = useState(defaultKind);
  const [items, setItems] = useState<ReaderContent[]>([]);
  const [chosen, setChosen] = useState('');
  const [newVersion, setNewVersion] = useState(0);
  const title = general ? '일반 도서' : kind === 'series' ? '연재 소설' : '일반 소설';
  const [legacy, setLegacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const all: ReaderContent[] = [];
    for (const type of (general ? ['book', 'series'] as const : [kind])) { let cursor: string | undefined;
      do { const page = await listReaderContent(type, cursor); all.push(...page.items); cursor = page.nextCursor || undefined; } while (cursor);
    }
    setItems(all.filter(x => (general ? x.collectionType === 'general' : !x.collectionType) && !x.issueMonth && !x.publishedContent?.issueMonth && !x.seriesId && !x.deleting));
  }, [kind, general]);
  useEffect(() => { void reload().catch(e => setError(e.message)); }, [reload]);
  useReaderLeaveGuard(dirty,busy);
  const guard = () => !dirty || window.confirm('저장하지 않은 입력을 닫을까요?');
  const groups = [...new Set(items.map(x => x.translationGroupId || x.id))];
  const group = items.filter(x => (x.translationGroupId || x.id) === chosen);
  return <div className="space-y-5 text-slate-200"><div className="flex justify-between"><h1 className="text-xl font-semibold">{title}</h1>{!general && <button className={button} disabled={busy} onClick={() => { if (guard()) { setLegacy(!legacy); setDirty(false); void reload().catch(e => setError(e.message)); } }}>{legacy ? '통합 관리' : '기존 개별 관리'}</button>}</div>
    {error && <p role="alert">{error}</p>}
    {legacy ? <ReaderContentManager kind={kind} fixedKind /> : <><div className="flex gap-3">{general && <select className={input} disabled={busy} value={kind} onChange={e => { if (guard()) { setKind(e.target.value as 'book' | 'series'); setChosen(''); setDirty(false); } }}><option value="book">한 권으로 등록</option><option value="series">회차로 등록</option></select>}<button className={button} disabled={busy} onClick={() => { if (guard()) { setChosen(''); setNewVersion(v => v + 1); setDirty(false); } }}>새 {title} 등록</button></div>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]"><nav className="space-y-2">{groups.map(id => { const members = items.filter(x => (x.translationGroupId || x.id) === id); return <button className={`${button} w-full text-left ${chosen === id ? 'border-emerald-400' : ''}`} disabled={busy} key={id} onClick={() => { if (guard()) { setChosen(id); setDirty(false); } }}>{members[0].title}<small className="block">{members[0].kind === 'series' ? '연재' : '단권'} · {members.map(x => labels[x.language || 'ko']).join(' / ')}</small></button>; })}</nav>
    <WorkEditor general={general} key={chosen || `${kind}-${newVersion}`} initial={group} kind={group[0]?.kind === 'series' ? 'series' : group.length ? 'book' : kind} candidates={items} onDirty={setDirty} setBusy={setBusy} reload={reload} /></div></>}
  </div>;
}
export function WorkEditor({ general, initial, kind, candidates, onDirty, setBusy, reload, seedFiles, seedCommon, seedTitles, seedCommonImages, seedCovers }: { seedCovers?: Partial<Record<'ko' | 'en' | 'ja', File>>; seedCommonImages?: File[]; seedFiles?: Partial<Record<'ko' | 'en' | 'ja', File[]>>; seedCommon?: File; seedTitles?: Partial<Record<'ko' | 'en' | 'ja', string>>; general: boolean; initial: ReaderContent[]; kind: 'book' | 'series'; candidates: ReaderContent[]; onDirty: (v: boolean) => void; setBusy: (v: boolean) => void; reload: () => Promise<void> }) {
  const [saved, setSaved] = useState(initial);
  const [deleted, setDeleted] = useState(false);
  const [translationVersion,setTranslationVersion]=useState(0);
  const coverApplied=useRef(new Set<string>());
  const saving=useRef(false);
  const [release, setRelease] = useState<string | undefined>(()=>commonRelease(initial));
  const unified = general && kind === 'series';
  const [forms, setForms] = useState<Record<string, ReaderMetadata>>(() => Object.fromEntries(langs.map(l => [l, initial.find(x => (x.language || 'ko') === l) || { ...(general ? { collectionType: 'general' } : {}), language: l, title: seedTitles?.[l] || '', author: monthlyDefaults[l].author, description: '', license: monthlyDefaults[l].license, category: '소설', source: '', ...(kind === 'series' ? { seriesStatus: 'ongoing' } : {}) }])));
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ ko: true, en: true, ja: true });
  const [files, setFiles] = useState<Record<string, { book?: File; cover?: File }>>(() => Object.fromEntries(langs.map(l => [l, { book: kind === 'book' ? seedFiles?.[l]?.find(f => /\.(txt|epub)$/i.test(f.name)) : undefined, cover: seedCovers?.[l] || (kind === 'book' ? seedFiles?.[l]?.find(f => /\.(png|jpe?g|webp)$/i.test(f.name)) : undefined) }])));
  const [common, setCommon] = useState<File | undefined>(seedCommon);
  const [status, setStatus] = useState('');
  const [busy, busySet] = useState(false);
  const [tab, setTab] = useState('settings');
  const [linkId, setLinkId] = useState('');
  const [changed, setChanged] = useState(Boolean(seedFiles));
  const [batchDirty, setBatchDirty] = useState(false);
  useEffect(() => { onDirty(changed || batchDirty); }, [changed, batchDirty, onDirty]);
  const update = (l: string, patch: Partial<ReaderMetadata>) => { setForms(p => ({ ...p, [l]: { ...p[l], ...patch } })); setChanged(true); onDirty(true); };
  const lock = useCallback((v: boolean) => { busySet(v); setBusy(v); }, [setBusy]);
  async function connect(values: ReaderContent[]) { if (values.length < 2) return values; return (await linkReaderTranslations(values)).items; }
  async function save(publish: boolean, required: readonly ('ko'|'en'|'ja')[] = []): Promise<ReaderContent[]> {
    if (required.some(l=>!enabled[l] || !forms[l].title.trim())) throw new Error('원고가 있는 언어의 작품 제목을 모두 입력해 주세요.');
    if (!langs.some(l => enabled[l] && forms[l].title.trim())) { setStatus('등록할 언어의 도서 제목을 입력해 주세요.'); throw new Error('등록할 언어의 도서 제목을 입력해 주세요.'); }
    if (general && kind === 'book' && release === undefined) throw new Error('기존 언어별 공개일이 다릅니다. 공통 공개일을 지정해 주세요.');
    if(saving.current)throw new Error('저장 작업이 진행 중입니다.');
    saving.current=true; lock(true); setStatus(''); let current = [...saved]; const messages: string[] = [];
    try {
      for (const l of langs) {
        const form = forms[l]; if (!enabled[l] || !form.title.trim()) continue;
        let item = current.find(x => (x.language || 'ko') === l);
        try {
          item = await mutateReaderContent(item ? { action: 'save', id: item.id, revision: item.revision, metadata: {...form,...(general && kind === 'book' ? releaseFields(release!) : {})} } : { action: 'create', kind, metadata: {...form,...(general && kind === 'book' ? releaseFields(release!) : {})} });
          const remember = () => { current = [...current.filter(x => x.id !== item!.id), item!]; setSaved(current); }; remember();
          for (const slot of ['book', 'cover'] as const) { const file = files[l]?.[slot] || (slot === 'cover' && !coverApplied.current.has(l) ? common : undefined); if (file) { item = await uploadReaderAsset(item, slot, file); remember(); if(slot==='cover')coverApplied.current.add(l); setFiles(p=>({...p,[l]:{...p[l],[slot]:undefined}})); } }
          if (publish) { item = await mutateReaderContent({ action: 'publish', id: item.id, revision: item.revision }); remember(); }
          messages.push(`${labels[l]} ${publish ? '공개' : '저장'} 완료`);
        } catch (e) { messages.push(`${labels[l]}: ${(e as Error).message}`); }
      }
      current = await connect(current); setSaved(current); await reload();
      // Keep selections after failures so each language can be corrected and retried.
      setStatus(messages.join('\n'));
      if (!unified && kind === 'series' && seedFiles && current.length && !messages.some(m => m.includes(':'))) setTab('episodes');
      if (!messages.some(m => m.includes(':'))) { setChanged(langs.some(l => !enabled[l] && !!forms[l].title)); setFiles(p => Object.fromEntries(Object.entries(p).filter(([l]) => !enabled[l]))); setCommon(undefined); }
      if (messages.some(m=>m.includes(':'))) throw new Error(messages.join('\n'));
      return current;
    } catch (e) { setStatus(`${messages.join('\n')}\n${(e as Error).message}`); throw e; }
    finally { saving.current=false; lock(false); }
  }
  async function removeDraft() {
    if(!window.confirm('이 작품의 모든 언어 초안과 미공개 회차·첨부 파일을 삭제할까요? 되돌릴 수 없습니다.'))return;
    lock(true);
    try {
      if(saved.some(x=>x.published || x.publishedContent))throw new Error('공개 이력이 있는 작품은 초안 삭제할 수 없습니다.');
      const children:ReaderContent[]=[];
      for(const parent of saved.filter(x=>x.kind==='series')) {let after:string|undefined;do{const page=await listReaderContent('book',after,parent.id);children.push(...page.items);after=page.nextCursor||undefined;}while(after);}
      if(children.some(x=>x.published || x.publishedContent))throw new Error('공개 이력이 있는 회차가 있어 작품을 삭제할 수 없습니다.');
      for(const item of children)await deleteReaderContent(item,true);
      for(const item of saved){await deleteReaderContent(item,true);setSaved(p=>p.filter(x=>x.id!==item.id));}
      setChanged(false);setBatchDirty(false);onDirty(false);setDeleted(true);await reload();
    } catch(e){setStatus((e as Error).message);}finally{lock(false);}
  }
  if(deleted)return <p role="status">초안을 삭제했습니다. 도서 목록으로 돌아가세요.</p>;
  return <section className="min-w-0 space-y-4"><div className="flex gap-2">{(!unified && kind==='series' ? ['settings','episodes'] : []).map(t => <button key={t} className={button} disabled={busy} onClick={() => setTab(t)}>{t === 'settings' ? '작품 정보·파일' : '회차 등록·일괄등록'}</button>)}</div>
    <div hidden={tab !== 'settings'} className="space-y-4"><ReaderSectionHeading title="작품 정보" description="언어별 제목과 대표 표지를 확인하세요. 추가 정보는 아래에서 펼칠 수 있습니다."><ReaderStatus value={changed?'변경사항 미저장':saved.length?(saved.every(x=>x.published)?'공개 중':'임시 저장'):'새 작품'}/></ReaderSectionHeading>
    <fieldset disabled={busy} className="space-y-4"><details><summary className="cursor-pointer text-sm">공통 대표 표지 추가·변경 (선택)</summary><label className="block">책 대표 표지 — 공통 (언어별 대표 표지가 우선)<ReaderFileInput  accept=".png,.jpg,.jpeg,.webp" onFiles={selectedFiles => { coverApplied.current.clear(); setCommon(selectedFiles[0]); onDirty(true); setChanged(true); }} /></label><ReaderImagePreview compact file={common}/></details>
    <div className="reader-language-grid grid xl:grid-cols-3">{langs.map(l => <div key={l} className="reader-language-panel min-w-0 space-y-3"><h2><label>{!unified && <input type="checkbox" checked={enabled[l]} onChange={e => {setEnabled(p => ({ ...p, [l]: e.target.checked }));setChanged(true);}} />} {labels[l]}</label><ReaderStatus value={saved.find(x=>(x.language||'ko')===l)?.published?'공개 중':saved.some(x=>(x.language||'ko')===l)?'임시 저장':'미등록'}/></h2>{(['title'] as const).map(key => <label className="block" key={key}>{{ title:'제목', author:'저자·필명', category:'분류', source:'출처', description:'소개', license:'이용조건' }[key]}<textarea className={input} rows={1} value={forms[l][key] || ''} onChange={e => update(l, { [key]: e.target.value })} /></label>)}
    {kind === 'series' && <select className={input} value={forms[l].seriesStatus || 'ongoing'} onChange={e => update(l, { seriesStatus: e.target.value as 'ongoing' | 'completed' })}><option value="ongoing">연재 중</option><option value="completed">완결</option></select>}
    {(kind === 'book' ? ['book','cover'] as const : ['cover'] as const).map(slot => {const existing=saved.find(x=>(x.language||'ko')===l);const selected=files[l]?.[slot]||(slot==='cover' && !coverApplied.current.has(l)?common:undefined);const has=!!selected || !!(slot==='cover'?existing?.assets.cover:existing?.assets.txt||existing?.assets.epub);return <div key={slot} className="reader-file-line">{slot==='cover' && selected && <ReaderImagePreview compact file={selected}/>}<p className="text-xs text-slate-400">{slot==='cover'?'대표 표지':'본문'}: {selected?.name || (has?'저장된 파일 있음':'미등록')}</p><details open={!has}><summary className="cursor-pointer text-sm">{slot==='cover'?'표지':'본문'} {has?'변경':'추가'}</summary><ReaderFileInput accept={slot==='book'?'.txt,.epub':'.png,.jpg,.jpeg,.webp'} onFiles={selectedFiles=>{setFiles(p=>({...p,[l]:{...p[l],[slot]:selectedFiles[0]}}));setChanged(true);}}/></details></div>;})}</div>)}</div>
    <details className="border-y border-slate-700 py-4"><summary className="cursor-pointer">추가 정보 <span className="text-sm text-slate-400">저자 · 분류 · 소개 · 이용조건</span></summary><div className="mt-4 grid gap-5 xl:grid-cols-3">{langs.map(l => <div key={l} className="space-y-3"><h3>{labels[l]}</h3>{(['author','category','source','description','license'] as const).map(key => <label className="block text-sm" key={key}>{{author:'저자·필명',category:'분류',source:'출처',description:'소개',license:'이용조건'}[key]}<textarea className={input} rows={key === 'license' || key === 'description' ? 3 : 1} value={forms[l][key] || ''} onChange={e => update(l, {[key]:e.target.value})} /></label>)}</div>)}</div><button className={`${button} mt-3`} onClick={() => { for (const l of langs) update(l, {license:monthlyDefaults[l].license}); }}>공통 이용조건으로 되돌리기</button></details>
    {general && kind==='book' && <label className="block">공통 공개일 (한국 시간 · 모든 언어에 적용)<input type="datetime-local" className={input} value={release?.slice(0,16)||''} onChange={e=>{setRelease(e.target.value?e.target.value+':00+09:00':'');setChanged(true);}}/>{release===undefined && <span className="text-amber-300">기존 언어별 일정이 다릅니다.</span>}<button className={button} onClick={()=>{setRelease('');setChanged(true);}}>즉시 공개로 지정</button></label>}
    {!unified && <><p className="text-sm text-slate-400">{langs.filter(l => enabled[l] && forms[l].title.trim()).length}개 언어 선택 · {kind === 'series' ? '도서 정보를 저장한 뒤 회차별 공개일을 확인합니다.' : '파일을 확인하고 저장하거나 공개하세요.'}</p><div className="flex gap-3"><button className={button} onClick={() => void save(false).catch(e=>setStatus(e.message))}>초안 저장</button><button className={readerPrimaryButton} onClick={() => { if (window.confirm('체크하고 제목을 입력한 언어의 작품을 공개할까요?')) void save(true).catch(e=>setStatus(e.message)); }}>{kind === 'series' ? '도서 정보 공개' : '일정대로 공개'}</button></div></>}
    {saved.length > 0 && <details className="space-y-2"><summary className="cursor-pointer text-sm">기존 번역본 연결 (선택)</summary><label>기존 번역본 연결<select className={input} value={linkId} onChange={e => setLinkId(e.target.value)}><option value="">작품 선택</option>{candidates.filter(x => x.kind === kind && !saved.some(s => (s.language || 'ko') === (x.language || 'ko')) && !x.translationGroupId).map(x => <option value={x.id} key={x.id}>{labels[x.language || 'ko']} · {x.title}</option>)}</select></label><button className={button} disabled={!linkId || changed || batchDirty} onClick={async () => { lock(true); try { const target = candidates.find(x => x.id === linkId)!; const result = await connect([...saved, target]); setSaved(result); setTranslationVersion(v=>v+1); setForms(p => ({ ...p, [target.language || 'ko']: target })); await reload(); setStatus('기존 파일·독서 기록을 유지하고 연결했습니다.'); } catch(e) { setStatus((e as Error).message); } finally { lock(false); } }}>선택한 번역본 연결</button>{(changed || batchDirty) && <p>입력 중인 내용이 있습니다. 저장 후 목록에서 작품을 다시 열어 연결하세요.</p>}</details>}
    </fieldset></div>
    {unified && <UnifiedWorkEpisodes key={translationVersion} parents={saved} initialFiles={seedFiles} initialCommon={seedCommonImages} prepare={save} onDirty={setBatchDirty} onBusy={lock}/> }
    {!unified && kind === 'series' && <div hidden={tab !== 'episodes'}>{saved.length ? <MonthlyEpisodeBatch issues={saved} setBusy={lock} onDirty={setBatchDirty} ordinary initialFiles={seedFiles} initialCommon={seedCommonImages} /> : <p>도서 정보를 임시 저장하면 선택한 원고의 이미지·순서·공개일을 확인할 수 있습니다.</p>}</div>}
    {saved.length>0 && !saved.some(x=>x.published||x.publishedContent) && <button disabled={busy} className={`${button} text-rose-300`} onClick={()=>void removeDraft()}>작품 초안 삭제 (모든 언어)</button>}
    <p role="status" className="whitespace-pre-wrap">{status}</p>
  </section>;
}
