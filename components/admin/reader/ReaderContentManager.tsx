'use client';

import { useCallback, useEffect, useState } from 'react';
import { FileUp, Plus, RefreshCw } from 'lucide-react';
import { addReaderCategory, listReaderCategories, deleteReaderContent, listReaderContent, mutateReaderContent, uploadReaderAsset, type ReaderContent, type ReaderKind, type ReaderMetadata } from '../../../lib/admin/firebase/reader-api';
import { AdminCard } from '../shared/AdminCard';

const empty: ReaderMetadata = { title: '', author: '', description: '', license: '', category: '기타', source: '' };
const inputClass = 'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-emerald-400 focus:outline-none';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40';
function fields(item: ReaderMetadata): ReaderMetadata { return { title: item.title, author: item.author, description: item.description, license: item.license, category: item.category || '기타', source: item.source || '', ...(item.episodeNumber !== undefined ? { episodeNumber: item.episodeNumber } : {}), ...(item.seriesStatus ? { seriesStatus: item.seriesStatus } : {}) }; }

export function ReaderContentManager({ kind }: { kind: ReaderKind }) {
  const [mode, setMode] = useState<ReaderKind>(kind);
  const [series, setSeries] = useState<ReaderContent | null>(null);
  const [initialItem, setInitialItem] = useState<ReaderContent | null>(null);
  return <ContentEditor key={`${mode}-${series?.id || 'root'}`} kind={mode} series={series} initialItem={initialItem}
    onNavigate={(nextMode, parent = null, item = null) => { setMode(nextMode); setSeries(parent); setInitialItem(item); }} />;
}

function ContentEditor({ kind, series, initialItem, onNavigate }: {
  kind: ReaderKind; series: ReaderContent | null; initialItem: ReaderContent | null;
  onNavigate: (kind: ReaderKind, series?: ReaderContent | null, item?: ReaderContent | null) => void;
}) {
  const newForm = (): ReaderMetadata => series
    ? { ...fields(series), title: '', description: '', episodeNumber: Math.max(0, ...items.map(item => item.episodeNumber || 0)) + 1, seriesStatus: undefined }
    : { ...empty, ...(kind === 'series' ? { seriesStatus: 'ongoing' as const } : {}) };

  const [items, setItems] = useState<ReaderContent[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<ReaderContent | null>(initialItem);
  const [form, setForm] = useState<ReaderMetadata>(() => initialItem ? fields(initialItem) : newForm());
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [weight, setWeight] = useState('400');
  const [categories, setCategories] = useState<string[]>(['시', '소설', '에세이', '기타']);
  const [newCategory, setNewCategory] = useState('');
  const [episodeQuery, setEpisodeQuery] = useState('');
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const categoryOptions = Array.from(new Set([...categories, ...items.map(item => item.category || '기타'), form.category || '기타']));
  const metadataDirty = JSON.stringify(form) !== JSON.stringify(selected ? fields(selected) : newForm());
  const dirty = metadataDirty || Object.keys(pendingFiles).length > 0;
  const valid = form.title.trim() && (series ? Number.isSafeInteger(form.episodeNumber) && form.episodeNumber! > 0 : form.author.trim() && form.license.trim());
  const label = series ? '회차' : kind === 'series' ? '작품' : kind === 'book' ? '책' : '글꼴';
  const navigate: typeof onNavigate = (...args) => {
    if (busy || (dirty && !window.confirm('저장하지 않은 입력을 닫고 이동할까요?'))) return;
    onNavigate(...args);
  };
  const select = (item: ReaderContent | null) => {
    if (dirty && !window.confirm('저장하지 않은 입력을 닫고 다른 항목을 열까요?')) return;
    setPendingFiles({}); setSelected(item); setForm(item ? fields(item) : { ...newForm(), ...(series ? { episodeNumber: Math.max(0, ...items.map(value => value.episodeNumber || 0)) + 1 } : {}) }); setError(null); setNotice(null);
  };
  const load = useCallback(async (after?: string) => {
    setLoading(true); setError(null);
    try {
      const [page, categoryResult] = await Promise.all([
        listReaderContent(kind, after, series?.id),
        kind !== 'font' && !series ? listReaderCategories() : Promise.resolve(null),
      ]);
      const seen = new Set<string>();
      while (page.nextCursor && (series || page.items.length === 0)) {
        if (seen.has(page.nextCursor)) throw new Error('목록을 끝까지 읽지 못했습니다. 새로고침해 주세요.');
        seen.add(page.nextCursor);
        const next = await listReaderContent(kind, page.nextCursor, series?.id);
        page.items.push(...next.items); page.nextCursor = next.nextCursor;
      }
      if (series && !after) setForm(current => current.title || current.description ? current : { ...current, episodeNumber: Math.max(0, ...page.items.map(item => item.episodeNumber || 0)) + 1 });
      if (categoryResult) setCategories(categoryResult.categories);
      setItems(current => after ? Array.from(new Map([...current, ...page.items].map(item => [item.id, item])).values()) : page.items); setCursor(page.nextCursor);
    } catch (error) { setError(error instanceof Error ? error.message : '목록을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }, [kind, series]);
  useEffect(() => { void load(); }, [load]);
  const run = async (action: () => Promise<ReaderContent>, message: string) => {
    setBusy(true); setError(null); setNotice(null);
    try {
      const next = await action(); setSelected(next); setForm(fields(next));
      setItems(current => [next, ...current.filter(item => item.id !== next.id)]); setNotice(message);
    } catch (error) { setError(error instanceof Error ? error.message : '작업을 완료하지 못했습니다.'); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!selected || busy) return;
    const target = selected;
    const files = kind === 'series' ? '대표 표지' : kind === 'book' ? '본문 파일과 회차 표지' : '모든 굵기의 글꼴 파일';
    if (!window.confirm(`“${target.title}”을 영구 삭제할까요?\n\n등록 정보와 서버의 ${files}(이전 업로드 포함)가 삭제되며 복구할 수 없습니다. 신규 다운로드가 차단됩니다. 이미 다운로드한 사용자 기기의 자료는 유지됩니다.${dirty ? '\n저장하지 않은 입력도 사라집니다.' : ''}`)) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      await deleteReaderContent(target);
      setItems(current => current.filter(item => item.id !== target.id));
      setPendingFiles({}); setSelected(null); setForm(newForm());
      setNotice(`“${target.title}”을 삭제했습니다. 사용자 기기에 다운로드한 자료는 유지됩니다.`);
    } catch (error) {
      // The server may already have disabled downloads. Re-read its state
      // without silently dropping the item when cleanup needs a retry.
      setPendingFiles({}); setSelected(null); setForm(newForm());
      await load();
      setError(error instanceof Error ? error.message : '삭제를 완료하지 못했습니다. 목록에서 확인 후 다시 시도해 주세요.');
    } finally { setBusy(false); }
  };
  const addCategory = async () => {
    if (busy || !newCategory.trim()) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      const name = newCategory.normalize('NFC').trim();
      const result = await addReaderCategory(name);
      setCategories(result.categories);
      setForm(current => ({ ...current, category: name }));
      setNewCategory('');
      setNotice(`“${name}” 분류를 등록했습니다. 도서 정보도 저장해 주세요.`);
    } catch (error) { setError(error instanceof Error ? error.message : '분류를 등록하지 못했습니다.'); }
    finally { setBusy(false); }
  };
  const upload = (slot: string, file: File | undefined) => {
    if (!selected || !file) return;
    void run(() => uploadReaderAsset(selected, slot, file), '파일을 초안에 저장했습니다. 확인 후 공개해 주세요.');
  };
  const saveEpisode = async (publish: boolean) => {
    if (!series || busy || !valid || selected?.deleting) return;
    setBusy(true); setError(null); setNotice(null);
    let current = selected;
    const remember = (item: ReaderContent) => {
      current = item; setSelected(item); setForm(fields(item));
      setItems(previous => [item, ...previous.filter(value => value.id !== item.id)]);
    };
    try {
      if (!current) remember(await mutateReaderContent({ action: 'create', kind: 'book', seriesId: series.id, metadata: form }));
      else if (metadataDirty) remember(await mutateReaderContent({ action: 'save', id: current.id, revision: current.revision, metadata: form }));
      for (const [slot, file] of Object.entries(pendingFiles)) {
        remember(await uploadReaderAsset(current!, slot, file));
        setPendingFiles(previous => { const next = { ...previous }; delete next[slot]; return next; });
      }
      if (publish) remember(await mutateReaderContent({ action: 'publish', id: current!.id, revision: current!.revision }));
      setNotice(publish ? '회차를 공개했습니다. 앱에서 목록을 새로고침하면 확인할 수 있습니다.' : '임시 저장했습니다. 이번 변경은 아직 공개되지 않았습니다.');
    } catch (error) {
      setError(`${error instanceof Error ? error.message : '작업을 완료하지 못했습니다.'}${current ? ' 완료된 단계는 저장되어 있습니다. 남은 파일과 공개 상태를 확인한 뒤 다시 시도해 주세요.' : ''}`);
    } finally { setBusy(false); }
  };
  const queueFile = (slot: string, file: File | undefined) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowed = slot === 'book' ? ['txt', 'epub'] : ['png', 'jpg', 'jpeg', 'webp'];
    const maximum = slot === 'book' ? 20 : 5;
    if (!allowed.includes(extension) || file.size <= 0 || file.size > maximum * 1024 * 1024) {
      setError(`파일 형식과 용량을 확인해 주세요. ${allowed.join(' / ')} · 최대 ${maximum}MB`); return;
    }
    setError(null); setNotice(null); setPendingFiles(previous => ({ ...previous, [slot]: file }));
  };
  const publishReady = selected && (kind === 'series' ? !!selected.assets.cover : kind === 'book' ? (Boolean(selected.assets.epub) !== Boolean(selected.assets.txt)) && (series ? series.published && (selected.assets.cover || series.publishedContent?.assets.cover) : selected.assets.cover) : Object.keys(selected.assets).length > 0);
  const fileDisabled = busy || !!selected?.deleting || (!series && (dirty || !selected));
  const episodePublishReady = !!series?.published && !!(pendingFiles.book || selected?.assets.txt || selected?.assets.epub) && !!(pendingFiles.cover || selected?.assets.cover || series?.publishedContent?.assets.cover);
  const fileControl = (slot: string, title: string, accept: string, hint: string) => (
    <label className={`block rounded-xl border border-dashed border-slate-700 p-4 ${fileDisabled ? 'opacity-40' : 'hover:border-emerald-500'}`}>
      <span className="flex items-center gap-2 text-sm font-medium text-slate-100"><FileUp className="h-4 w-4" />{title}</span>
      <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      {series && pendingFiles[slot] && <span className="mt-2 block break-all text-xs text-emerald-300">{pendingFiles[slot].name} · 저장 대기</span>}
      <input aria-label={title} style={series ? { color: 'transparent' } : undefined} type="file" accept={accept} disabled={fileDisabled} className="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200" onChange={event => { if (series) queueFile(slot, event.target.files?.[0]); else upload(slot, event.target.files?.[0]); event.target.value = ''; }} />
    </label>
  );
  return <div className="space-y-5">
    {error && <div role="alert" className="rounded-xl border border-rose-900 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}
    {notice && <div role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-200">{notice}</div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)]">
      <AdminCard className="p-5">
    {kind !== 'font' && <div className="mb-5 flex flex-wrap items-center gap-2">
      {series ? <><button disabled={busy} className={buttonClass} onClick={() => navigate('series', null, series)}>← 작품 정보</button><h2 className="text-lg font-semibold text-white">{series.title} · 회차 관리</h2></> : <>
        <button disabled={busy} aria-pressed={kind === 'book'} className={`${buttonClass} ${kind === 'book' ? 'border-emerald-500 bg-emerald-950' : ''}`} onClick={() => navigate('book')}>단권 도서</button>
        <button disabled={busy} aria-pressed={kind === 'series'} className={`${buttonClass} ${kind === 'series' ? 'border-emerald-500 bg-emerald-950' : ''}`} onClick={() => navigate('series')}>연재 작품</button>
      </>}
    </div>}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-white">{label} 목록</h2><div className="flex gap-2">
          <button className={buttonClass} disabled={busy || loading} onClick={() => { if (dirty && !window.confirm('저장하지 않은 입력을 닫고 새로고침할까요?')) return; setPendingFiles({}); setSelected(null); setForm(newForm()); void load(); }} aria-label="목록 새로고침"><RefreshCw className="h-4 w-4" /></button>
          <button className={buttonClass} disabled={busy || loading} onClick={() => select(null)}><Plus className="h-4 w-4" />추가</button>
        </div></div>
    {series && <p className="mb-5 text-sm leading-6 text-slate-400">저자·분류·출처·이용 조건과 대표 표지는 작품에서 이어받습니다. 회차를 공개할 때 작품의 공개된 정보를 사용합니다. 회차 표지는 필요할 때만 추가하세요.</p>}
    {kind === 'series' && <p className="mb-5 text-sm leading-6 text-slate-400">작품 정보와 대표 표지를 한 번 등록한 뒤 ‘회차 관리’에서 본문을 추가하세요. 새 앱 다운로드 목록에는 작품 하나로 표시됩니다.</p>}
        {loading && <p role="status" className="py-4 text-sm text-slate-400">목록을 불러오는 중…</p>}
        {!loading && items.length === 0 && !error && <p className="py-6 text-sm text-slate-400">등록한 {label}이 없습니다. 오른쪽에서 첫 항목을 추가해 주세요.</p>}
        {series && <label className="mb-4 block text-sm text-slate-300">회차 찾기 · {items.length}개<input className={inputClass} placeholder="번호 또는 제목" value={episodeQuery} onChange={e => setEpisodeQuery(e.target.value)} /></label>}
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">{items.filter(item => !series || `${item.episodeNumber}화 ${item.title}`.toLocaleLowerCase().includes(episodeQuery.trim().toLocaleLowerCase())).sort((a, b) => series ? (a.episodeNumber || 0) - (b.episodeNumber || 0) : a.title.localeCompare(b.title, 'ko')).map(item => <li key={item.id}><button disabled={busy} onClick={() => select(item)} className={`w-full rounded-xl border p-4 text-left ${selected?.id === item.id ? 'border-emerald-500 bg-emerald-950/30' : 'border-slate-800 hover:bg-slate-800/60'}`}>
          <span className="block truncate font-medium text-white">{series ? `${item.episodeNumber}화 · ` : ''}{item.title}</span><span className="mt-1 block text-xs text-slate-400">{item.author} · {item.deleting ? '삭제 대기 · 재시도 필요' : item.published ? '공개 중' : '비공개'}</span>
          {item.published && item.publishedContent?.version !== item.revision && <span className="mt-2 block text-xs text-amber-300">수정된 초안 있음</span>}
        </button></li>)}</ul>
        {cursor && <button className={`${buttonClass} mt-4 w-full`} disabled={busy || loading} onClick={() => void load(cursor)}>더 불러오기</button>}
      </AdminCard>
      <AdminCard className="p-6">
        <h2 className="text-lg font-semibold text-white">{selected ? `${label} 편집` : `새 ${label} 등록`}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">정보와 파일은 초안으로 저장됩니다. ‘공개’하면 앱의 다운로드 목록에 반영됩니다.</p>
        <form className="mt-6 space-y-4" onSubmit={event => { event.preventDefault(); if (series) { void saveEpisode(false); return; } void run(() => selected ? mutateReaderContent({ action: 'save', id: selected.id, revision: selected.revision, metadata: form }) : mutateReaderContent({ action: 'create', kind, metadata: form }), '정보를 초안에 저장했습니다.'); }}>
          <fieldset disabled={busy || !!selected?.deleting} className="space-y-4">
            <label className="block text-sm text-slate-300">{series ? '회차 제목' : `${label} 이름`} (필수)<input required maxLength={160} className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
            {series && <label className="block text-sm text-slate-300">회차 번호 (필수)<input type="number" min={1} max={100000} step={1} required readOnly={!!selected?.publishedContent} className={inputClass} value={form.episodeNumber ?? ''} onChange={e => setForm({ ...form, episodeNumber: e.target.value === '' ? undefined : Number(e.target.value) })} />{selected?.publishedContent && <span className="mt-1 block text-xs text-slate-400">공개한 회차의 번호는 유지됩니다. 제목과 본문은 수정할 수 있습니다.</span>}</label>}
            {kind === 'series' && <label className="block text-sm text-slate-300">연재 상태<select className={inputClass} value={form.seriesStatus || 'ongoing'} onChange={e => setForm({ ...form, seriesStatus: e.target.value as 'ongoing' | 'completed' })}><option value="ongoing">연재 중</option><option value="completed">완결</option></select></label>}
            {!series && <>
            <label className="block text-sm text-slate-300">{kind !== 'font' ? '저자 또는 필명 (필수)' : '제작자 (필수)'}<input required maxLength={120} className={inputClass} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></label>
            {kind !== 'font' && <div className="space-y-2">
              <label className="block text-sm text-slate-300">도서 분류<select className={inputClass} value={form.category || '기타'} onChange={e => setForm({ ...form, category: e.target.value })}>{categoryOptions.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
              <div className="flex flex-wrap items-end gap-2">
                <label className="min-w-0 flex-1 text-xs text-slate-400">새 분류 이름<input className={inputClass} maxLength={40} placeholder="예: 인문, 역사, 동화" value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void addCategory(); } }} /></label>
                <button type="button" className={buttonClass} disabled={busy || !newCategory.trim()} onClick={() => void addCategory()}><Plus className="h-4 w-4" />분류 추가</button>
              </div>
              <p className="text-xs text-slate-400">등록한 분류는 다음에도 선택할 수 있습니다. 해당 도서를 공개하면 앱 검색 필터에도 표시됩니다.</p>
            </div>}
            <label className="block text-sm text-slate-300">출처 (선택)<input maxLength={500} className={inputClass} placeholder="원문 페이지 주소 또는 제공 기관" value={form.source || ''} onChange={e => setForm({ ...form, source: e.target.value })} /></label>
            </>}
            <label className="block text-sm text-slate-300">설명 (선택)<textarea rows={3} maxLength={2000} className={inputClass} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
            {!series && <label className="block text-sm text-slate-300">배포 권한 · 이용 조건 (필수)<textarea required rows={3} maxLength={2000} className={inputClass} placeholder="앱에서 파일을 배포할 수 있는 라이선스와 출처를 입력해 주세요. 사용자에게도 표시됩니다." value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} /></label>}
            {!series && <button type="submit" className={buttonClass} disabled={busy || !valid || (!!selected && !dirty)}>{busy ? '처리 중…' : selected ? '초안 저장' : '초안 만들기'}</button>}
          </fieldset>
        </form>
        <div className="mt-8 space-y-3 border-t border-slate-800 pt-6">
          <h3 className="font-semibold text-white">파일 등록</h3>
          {!series && (!selected || dirty) && <p className="text-sm text-amber-300">입력한 정보를 먼저 저장한 뒤 파일을 등록해 주세요.</p>}
          {series && <p className="text-sm text-slate-400">파일을 선택한 뒤 아래에서 임시 저장하거나 공개하세요.</p>}
          {kind === 'series' ? fileControl('cover', '대표 표지', '.png,.jpg,.jpeg,.webp', 'PNG · JPG · WebP · 최대 5MB. 별도 표지가 없는 회차에도 사용합니다.') : kind === 'book' ? <div className="grid gap-3 md:grid-cols-2">{fileControl('book', '책 파일', '.epub,.txt', 'EPUB 또는 TXT · 최대 20MB. TXT는 각 제목 줄을 [장] 제목으로 작성하면 새 앱에서 목차와 페이지 구분을 만듭니다. [장]은 줄 맨 앞에, 제목은 공백 뒤에 작성하세요. 표식은 숨겨지고 제목만 표시됩니다. 새 파일을 올리면 초안의 기존 책 파일을 교체합니다.')}{fileControl('cover', series ? '회차 표지 (선택)' : '책 표지', '.png,.jpg,.jpeg,.webp', series ? '없으면 작품의 대표 표지를 사용합니다. PNG · JPG · WebP · 최대 5MB' : 'PNG · JPG · WebP · 최대 5MB')}</div> : <>
            <label className="block text-sm text-slate-300">글꼴 굵기<select disabled={busy || !!selected?.deleting} className={inputClass} value={weight} onChange={e => setWeight(e.target.value)}>{[100,200,300,400,500,600,700,800,900].map(w => <option value={w} key={w}>{w}{w === 300 ? ' · Light' : w === 400 ? ' · Regular' : w === 700 ? ' · Bold' : ''}</option>)}</select></label>
            {fileControl(`font${weight}`, '선택한 굵기의 글꼴 파일', '.otf,.ttf', '정적 OTF · TTF · 파일당 최대 10MB. 다른 굵기는 차례로 추가하세요.')}
            <p className="text-xs leading-5 text-slate-400">공개할 때 등록한 글꼴로 이름 미리보기를 자동 생성합니다. 보통 굵기(400)를 우선 사용하며 없으면 가장 가까운 굵기를 사용합니다. 기존 글꼴은 ‘수정 내용 공개’를 누르면 생성됩니다. 글꼴에 이름의 문자가 없으면 앱 기본 글꼴로 표시됩니다.</p>
          </>}
          {kind === 'font' && selected?.published && !selected.publishedContent?.preview && <p role="status" className="text-sm text-amber-300">이 글꼴은 아직 이름 미리보기가 없습니다. 서버를 최신 버전으로 배포한 뒤 ‘수정 내용 공개’를 눌러 생성하세요. 글꼴에 이름의 문자가 없으면 기본 글꼴로 표시됩니다.</p>}
          {selected && <ul className="space-y-2">{Object.entries(selected.assets).map(([slot, asset]) => <li key={slot} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-950 p-3 text-sm text-slate-300"><span>{slot === 'cover' ? '표지' : slot === 'epub' ? 'EPUB' : slot === 'txt' ? 'TXT' : `글꼴 ${asset.weight}`} · {(asset.size / 1024 / 1024).toFixed(1)}MB · 등록됨</span><button className="text-xs text-rose-300 disabled:opacity-40" disabled={busy || dirty || !!selected?.deleting} onClick={() => void run(() => mutateReaderContent({ action: 'removeAsset', id: selected.id, revision: selected.revision, slot }), '초안에서 파일을 제외했습니다. 공개 중인 파일은 다음 공개까지 유지됩니다.')}>초안에서 제외</button></li>)}</ul>}
        </div>
        {series && <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className={buttonClass} disabled={busy || !valid || !!selected?.deleting || (!!selected && !dirty)} onClick={() => void saveEpisode(false)}>{busy ? '처리 중…' : '임시 저장'}</button>
          <button className={`${buttonClass} border-emerald-600 bg-emerald-700 hover:bg-emerald-600`} disabled={busy || !valid || !episodePublishReady || !!selected?.deleting} onClick={() => void saveEpisode(true)}>{busy ? '처리 중…' : selected?.published ? '수정하고 공개' : '등록하고 공개'}</button>
          {Object.keys(pendingFiles).length > 0 && <button className={buttonClass} disabled={busy} onClick={() => setPendingFiles({})}>파일 선택 취소</button>}
        </div>}
        {kind === 'series' && selected && <button className={`${buttonClass} mt-6`} disabled={busy || dirty || !!selected.deleting} onClick={() => navigate('book', selected)}>회차 관리 · 추가</button>}
        {series && !series.published && <p className="mt-4 text-sm text-amber-300">작품 정보와 대표 표지를 먼저 공개해야 회차를 공개할 수 있습니다.</p>}
        {selected && <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-6">
          {!series && <button disabled={busy || dirty || !publishReady || !!selected.deleting} className={`${buttonClass} border-emerald-600 bg-emerald-700 hover:bg-emerald-600`} onClick={() => void run(() => mutateReaderContent({ action: 'publish', id: selected.id, revision: selected.revision }), '공개했습니다. 앱에서 목록을 새로고침하면 확인할 수 있습니다.')}>{selected.published ? '수정 내용 공개' : '앱에 공개'}</button>}
          {selected.published && <button disabled={busy || dirty || !!selected?.deleting} className={buttonClass} onClick={() => void run(() => mutateReaderContent({ action: 'unpublish', id: selected.id, revision: selected.revision }), '비공개로 전환했습니다. 이미 내려받은 파일은 사용자 기기에 유지됩니다.')}>비공개로 전환</button>}
          <button disabled={busy || loading} className={`${buttonClass} border-rose-800 text-rose-300 hover:bg-rose-950`} onClick={() => void remove()}>{selected.deleting ? '삭제 재시도' : '영구 삭제'}</button>
          {selected.deleting && <p role="status" className="w-full text-sm text-amber-300">신규 다운로드가 차단된 상태입니다. 삭제를 다시 시도하여 서버 파일 정리를 완료해 주세요.</p>}
          <p className="w-full text-xs leading-5 text-slate-500">{kind === 'series' ? '작품을 비공개로 전환하면 모든 회차의 신규 다운로드도 중단됩니다. 회차가 있는 작품은 삭제할 수 없습니다.' : '공개한 파일은 로그인 없이 다운로드할 수 있습니다.'} 비공개 전환 후에도 이미 내려받은 파일은 유지됩니다.</p>
        </div>}
      </AdminCard>
    </div>
  </div>;
}
