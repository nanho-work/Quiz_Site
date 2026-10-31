'use client';
import { useCallback, useEffect, useState } from 'react';
import { listReaderContent, mutateReaderContent, uploadReaderAsset, linkReaderTranslations, type ReaderContent, type ReaderMetadata } from '../../../lib/admin/firebase/reader-api';
import { ReaderContentManager } from './ReaderContentManager';
import { MonthlyEpisodeBatch } from './MonthlyEpisodeBatch';
import { monthlyDefaults } from '../../../lib/admin/firebase/monthly-defaults';
const langs = ['ko', 'en', 'ja'] as const;
const labels = { ko: '한국어', en: 'English', ja: '日本語' };
const input = 'block w-full rounded-lg border border-slate-700 bg-slate-950 p-2';
const button = 'rounded-lg border border-slate-600 px-3 py-2 disabled:opacity-40';
export default function WorkTranslations() {
  const [items, setItems] = useState<ReaderContent[]>([]);
  const [chosen, setChosen] = useState('');
  const [kind, setKind] = useState<'book' | 'series'>('book');
  const [legacy, setLegacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const all: ReaderContent[] = [];
    for (const type of ['book', 'series'] as const) { let cursor: string | undefined;
      do { const page = await listReaderContent(type, cursor); all.push(...page.items); cursor = page.nextCursor || undefined; } while (cursor);
    }
    setItems(all.filter(x => !x.issueMonth && !x.publishedContent?.issueMonth && !x.seriesId && !x.deleting));
  }, []);
  useEffect(() => { void reload().catch(e => setError(e.message)); }, [reload]);
  useEffect(() => { const warn = (e: BeforeUnloadEvent) => { if (dirty || busy) e.preventDefault(); }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty, busy]);
  const guard = () => !dirty || window.confirm('저장하지 않은 입력을 닫을까요?');
  const groups = [...new Set(items.map(x => x.translationGroupId || x.id))];
  const group = items.filter(x => (x.translationGroupId || x.id) === chosen);
  return <div className="space-y-5 text-slate-200"><div className="flex justify-between"><h1 className="text-xl font-semibold">일반 작품 · 번역본 관리</h1><button className={button} disabled={busy} onClick={() => { if (guard()) { setLegacy(!legacy); setDirty(false); void reload().catch(e => setError(e.message)); } }}>{legacy ? '통합 관리' : '기존 개별 관리'}</button></div>
    {error && <p role="alert">{error}</p>}
    {legacy ? <ReaderContentManager kind="book" /> : <><div className="flex gap-3"><select className={input} value={kind} disabled={busy} onChange={e => setKind(e.target.value as 'book' | 'series')}><option value="book">단권 도서</option><option value="series">연재 작품</option></select><button className={button} disabled={busy} onClick={() => { if (guard()) { setChosen(''); setDirty(false); } }}>새 작품</button></div>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]"><nav className="space-y-2">{groups.map(id => { const members = items.filter(x => (x.translationGroupId || x.id) === id); return <button className={`${button} w-full text-left ${chosen === id ? 'border-emerald-400' : ''}`} disabled={busy} key={id} onClick={() => { if (guard()) { setChosen(id); setDirty(false); } }}>{members[0].title}<small className="block">{members[0].kind === 'series' ? '연재' : '단권'} · {members.map(x => labels[x.language || 'ko']).join(' / ')}</small></button>; })}</nav>
    <WorkEditor key={chosen || kind} initial={group} kind={group[0]?.kind === 'series' ? 'series' : group.length ? 'book' : kind} candidates={items} onDirty={setDirty} setBusy={setBusy} reload={reload} /></div></>}
  </div>;
}
function WorkEditor({ initial, kind, candidates, onDirty, setBusy, reload }: { initial: ReaderContent[]; kind: 'book' | 'series'; candidates: ReaderContent[]; onDirty: (v: boolean) => void; setBusy: (v: boolean) => void; reload: () => Promise<void> }) {
  const [saved, setSaved] = useState(initial);
  const [forms, setForms] = useState<Record<string, ReaderMetadata>>(() => Object.fromEntries(langs.map(l => [l, initial.find(x => (x.language || 'ko') === l) || { language: l, title: '', author: '쿠피랩', description: '', license: '', category: '소설', source: '', ...(kind === 'series' ? { seriesStatus: 'ongoing' } : {}) }])));
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ ko: true, en: true, ja: true });
  const [files, setFiles] = useState<Record<string, { book?: File; cover?: File }>>({});
  const [common, setCommon] = useState<File>();
  const [status, setStatus] = useState('');
  const [busy, busySet] = useState(false);
  const [tab, setTab] = useState('settings');
  const [linkId, setLinkId] = useState('');
  const [changed, setChanged] = useState(false);
  const [batchDirty, setBatchDirty] = useState(false);
  useEffect(() => { onDirty(changed || batchDirty); }, [changed, batchDirty, onDirty]);
  const update = (l: string, patch: Partial<ReaderMetadata>) => { setForms(p => ({ ...p, [l]: { ...p[l], ...patch } })); setChanged(true); onDirty(true); };
  const lock = useCallback((v: boolean) => { busySet(v); setBusy(v); }, [setBusy]);
  async function connect(values: ReaderContent[]) { if (values.length < 2) return values; return (await linkReaderTranslations(values)).items; }
  async function save(publish: boolean) {
    lock(true); setStatus(''); let current = [...saved]; const messages: string[] = [];
    try {
      for (const l of langs) {
        const form = forms[l]; if (!enabled[l] || !form.title.trim()) continue;
        let item = current.find(x => (x.language || 'ko') === l);
        try {
          item = await mutateReaderContent(item ? { action: 'save', id: item.id, revision: item.revision, metadata: form } : { action: 'create', kind, metadata: form });
          const remember = () => { current = [...current.filter(x => x.id !== item!.id), item!]; setSaved(current); }; remember();
          for (const slot of ['book', 'cover'] as const) { const file = files[l]?.[slot] || (slot === 'cover' ? common : undefined); if (file) { item = await uploadReaderAsset(item, slot, file); remember(); } }
          if (publish) { item = await mutateReaderContent({ action: 'publish', id: item.id, revision: item.revision }); remember(); }
          messages.push(`${labels[l]} ${publish ? '공개' : '저장'} 완료`);
        } catch (e) { messages.push(`${labels[l]}: ${(e as Error).message}`); }
      }
      current = await connect(current); setSaved(current); await reload();
      // Keep selections after failures so each language can be corrected and retried.
      setStatus(messages.join('\n'));
      if (!messages.some(m => m.includes(':'))) { setChanged(langs.some(l => !enabled[l] && !!forms[l].title)); setFiles(p => Object.fromEntries(Object.entries(p).filter(([l]) => !enabled[l]))); setCommon(undefined); }
    } catch (e) { setStatus(`${messages.join('\n')}\n번역본 연결: ${(e as Error).message}`); }
    finally { lock(false); }
  }
  return <section className="min-w-0 space-y-4"><div className="flex gap-2">{['settings', ...(kind === 'series' ? ['episodes'] : [])].map(t => <button key={t} className={button} disabled={busy} onClick={() => setTab(t)}>{t === 'settings' ? '작품 정보·파일' : '회차 등록·일괄등록'}</button>)}</div>
    <div hidden={tab !== 'settings'} className="space-y-4"><p>등록할 언어를 체크하고 제목과 파일을 넣으세요. 실패한 언어만 체크해 재시도할 수 있습니다. 제목이 비어 있는 언어는 건너뜁니다. 번역은 자동으로 생성하지 않습니다.</p>
    <fieldset disabled={busy} className="space-y-4"><label className="block">공통 표지 (언어별 표지가 우선)<input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={e => { setCommon(e.target.files?.[0]); onDirty(true); setChanged(true); }} /></label>
    <button className={button} onClick={() => { for (const l of langs) update(l, { author: forms.ko.author, category: forms.ko.category, source: forms.ko.source }); }}>한국어의 저자·분류·출처를 다른 언어에 적용</button>
    <button className={button} onClick={() => { for (const l of langs) update(l, { license: monthlyDefaults[l].license }); }}>쿠피 자체 작품 이용조건 적용</button>
    <div className="grid gap-4 xl:grid-cols-3">{langs.map(l => <div key={l} className="min-w-0 space-y-3 rounded-xl border border-slate-700 p-4"><h2><label><input type="checkbox" checked={enabled[l]} onChange={e => setEnabled(p => ({ ...p, [l]: e.target.checked }))} /> {labels[l]}</label></h2>{(['title','author','category','source','description','license'] as const).map(key => <label className="block" key={key}>{{ title:'제목', author:'저자·필명', category:'분류', source:'출처', description:'소개', license:'이용조건' }[key]}<textarea className={input} rows={key === 'description' || key === 'license' ? 3 : 1} value={forms[l][key] || ''} onChange={e => update(l, { [key]: e.target.value })} /></label>)}
    {kind === 'series' && <select className={input} value={forms[l].seriesStatus || 'ongoing'} onChange={e => update(l, { seriesStatus: e.target.value as 'ongoing' | 'completed' })}><option value="ongoing">연재 중</option><option value="completed">완결</option></select>}
    {(kind === 'book' ? ['book','cover'] as const : ['cover'] as const).map(slot => <label className="block" key={slot}>{slot === 'book' ? '본문 TXT·EPUB' : '언어별 표지'}<input type="file" accept={slot === 'book' ? '.txt,.epub' : '.png,.jpg,.jpeg,.webp'} onChange={e => { setFiles(p => ({ ...p, [l]: { ...p[l], [slot]: e.target.files?.[0] } })); onDirty(true); setChanged(true); }} /></label>)}<small>{saved.find(x => (x.language || 'ko') === l)?.published ? '공개된 작품' : '미공개 / 미등록'}</small></div>)}</div>
    <div className="flex gap-3"><button className={button} onClick={() => void save(false)}>선택 언어 저장</button><button className={button} onClick={() => { if (window.confirm('체크하고 제목을 입력한 언어의 작품을 공개할까요?')) void save(true); }}>선택 언어 공개</button></div>
    {saved.length > 0 && <div className="space-y-2"><label>기존 번역본 연결<select className={input} value={linkId} onChange={e => setLinkId(e.target.value)}><option value="">작품 선택</option>{candidates.filter(x => x.kind === kind && !saved.some(s => (s.language || 'ko') === (x.language || 'ko')) && !x.translationGroupId).map(x => <option value={x.id} key={x.id}>{labels[x.language || 'ko']} · {x.title}</option>)}</select></label><button className={button} disabled={!linkId || changed} onClick={async () => { lock(true); try { const target = candidates.find(x => x.id === linkId)!; const result = await connect([...saved, target]); setSaved(result); setForms(p => ({ ...p, [target.language || 'ko']: target })); await reload(); setStatus('기존 파일·독서 기록을 유지하고 연결했습니다.'); } catch(e) { setStatus((e as Error).message); } finally { lock(false); } }}>선택한 번역본 연결</button>{changed && <p>입력 중인 내용이 있습니다. 저장 후 목록에서 작품을 다시 열어 연결하세요.</p>}</div>}
    </fieldset></div>
    {kind === 'series' && <div hidden={tab !== 'episodes'}>{saved.length ? <MonthlyEpisodeBatch issues={saved} setBusy={lock} onDirty={setBatchDirty} ordinary /> : <p>작품을 먼저 저장한 다음 회차를 등록해 주세요.</p>}</div>}
    <p role="status" className="whitespace-pre-wrap">{status}</p>
  </section>;
}
