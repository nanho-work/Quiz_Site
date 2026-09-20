'use client';

import { useCallback, useEffect, useState } from 'react';
import { FileUp, Plus, RefreshCw } from 'lucide-react';
import { deleteReaderContent, listReaderContent, mutateReaderContent, uploadReaderAsset, type ReaderContent, type ReaderKind, type ReaderMetadata } from '../../../lib/admin/firebase/reader-api';
import { AdminCard } from '../shared/AdminCard';

const empty: ReaderMetadata = { title: '', author: '', description: '', license: '' };
const inputClass = 'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-emerald-400 focus:outline-none';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40';
function fields(item: ReaderMetadata): ReaderMetadata { return { title: item.title, author: item.author, description: item.description, license: item.license }; }

export function ReaderContentManager({ kind }: { kind: ReaderKind }) {
  const [items, setItems] = useState<ReaderContent[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<ReaderContent | null>(null);
  const [form, setForm] = useState<ReaderMetadata>(empty);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [weight, setWeight] = useState('400');
  const dirty = JSON.stringify(form) !== JSON.stringify(selected ? fields(selected) : empty);
  const valid = form.title.trim() && form.author.trim() && form.license.trim();
  const label = kind === 'book' ? '책' : '글꼴';
  const select = (item: ReaderContent | null) => {
    if (dirty && !window.confirm('저장하지 않은 입력을 닫고 다른 항목을 열까요?')) return;
    setSelected(item); setForm(item ? fields(item) : empty); setError(null); setNotice(null);
  };
  const load = useCallback(async (after?: string) => {
    setLoading(true); setError(null);
    try {
      const page = await listReaderContent(kind, after);
      setItems(current => after ? Array.from(new Map([...current, ...page.items].map(item => [item.id, item])).values()) : page.items); setCursor(page.nextCursor);
    } catch (error) { setError(error instanceof Error ? error.message : '목록을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }, [kind]);
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
    const files = kind === 'book' ? '본문 파일과 표지' : '모든 굵기의 글꼴 파일';
    if (!window.confirm(`“${target.title}”을 영구 삭제할까요?\n\n등록 정보와 서버의 ${files}(이전 업로드 포함)가 삭제되며 복구할 수 없습니다. 신규 다운로드가 차단됩니다. 이미 다운로드한 사용자 기기의 자료는 유지됩니다.${dirty ? '\n저장하지 않은 입력도 사라집니다.' : ''}`)) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      await deleteReaderContent(target);
      setItems(current => current.filter(item => item.id !== target.id));
      setSelected(null); setForm(empty);
      setNotice(`“${target.title}”을 삭제했습니다. 사용자 기기에 다운로드한 자료는 유지됩니다.`);
    } catch (error) {
      // The server may already have disabled downloads. Re-read its state
      // without silently dropping the item when cleanup needs a retry.
      setSelected(null); setForm(empty);
      await load();
      setError(error instanceof Error ? error.message : '삭제를 완료하지 못했습니다. 목록에서 확인 후 다시 시도해 주세요.');
    } finally { setBusy(false); }
  };
  const upload = (slot: string, file: File | undefined) => {
    if (!selected || !file) return;
    void run(() => uploadReaderAsset(selected, slot, file), '파일을 초안에 저장했습니다. 확인 후 공개해 주세요.');
  };
  const publishReady = selected && (kind === 'book' ? (Boolean(selected.assets.epub) !== Boolean(selected.assets.txt)) && selected.assets.cover : Object.keys(selected.assets).length > 0);
  const fileControl = (slot: string, title: string, accept: string, hint: string) => (
    <label className={`block rounded-xl border border-dashed border-slate-700 p-4 ${busy || dirty || !selected || !!selected.deleting ? 'opacity-40' : 'hover:border-emerald-500'}`}>
      <span className="flex items-center gap-2 text-sm font-medium text-slate-100"><FileUp className="h-4 w-4" />{title}</span>
      <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      <input aria-label={title} type="file" accept={accept} disabled={busy || dirty || !selected || !!selected.deleting} className="mt-3 block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200" onChange={event => { upload(slot, event.target.files?.[0]); event.target.value = ''; }} />
    </label>
  );
  return <div className="space-y-5">
    {error && <div role="alert" className="rounded-xl border border-rose-900 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}
    {notice && <div role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-200">{notice}</div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)]">
      <AdminCard className="p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-white">{label} 목록</h2><div className="flex gap-2">
          <button className={buttonClass} disabled={busy || loading} onClick={() => { if (dirty && !window.confirm('저장하지 않은 입력을 닫고 새로고침할까요?')) return; setSelected(null); setForm(empty); void load(); }} aria-label="목록 새로고침"><RefreshCw className="h-4 w-4" /></button>
          <button className={buttonClass} disabled={busy} onClick={() => select(null)}><Plus className="h-4 w-4" />추가</button>
        </div></div>
        {loading && <p role="status" className="py-4 text-sm text-slate-400">목록을 불러오는 중…</p>}
        {!loading && items.length === 0 && !error && <p className="py-6 text-sm text-slate-400">등록한 {label}이 없습니다. 오른쪽에서 첫 항목을 추가해 주세요.</p>}
        <ul className="space-y-2">{items.map(item => <li key={item.id}><button disabled={busy} onClick={() => select(item)} className={`w-full rounded-xl border p-4 text-left ${selected?.id === item.id ? 'border-emerald-500 bg-emerald-950/30' : 'border-slate-800 hover:bg-slate-800/60'}`}>
          <span className="block truncate font-medium text-white">{item.title}</span><span className="mt-1 block text-xs text-slate-400">{item.author} · {item.deleting ? '삭제 대기 · 재시도 필요' : item.published ? '공개 중' : '비공개'}</span>
          {item.published && item.publishedContent?.version !== item.revision && <span className="mt-2 block text-xs text-amber-300">수정된 초안 있음</span>}
        </button></li>)}</ul>
        {cursor && <button className={`${buttonClass} mt-4 w-full`} disabled={busy || loading} onClick={() => void load(cursor)}>더 불러오기</button>}
      </AdminCard>
      <AdminCard className="p-6">
        <h2 className="text-lg font-semibold text-white">{selected ? `${label} 편집` : `새 ${label} 등록`}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">정보와 파일은 초안으로 저장됩니다. ‘공개’하면 앱의 다운로드 목록에 반영됩니다.</p>
        <form className="mt-6 space-y-4" onSubmit={event => { event.preventDefault(); void run(() => selected ? mutateReaderContent({ action: 'save', id: selected.id, revision: selected.revision, metadata: form }) : mutateReaderContent({ action: 'create', kind, metadata: form }), '정보를 초안에 저장했습니다.'); }}>
          <fieldset disabled={busy || !!selected?.deleting} className="space-y-4">
            <label className="block text-sm text-slate-300">{label} 이름<input required maxLength={160} className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
            <label className="block text-sm text-slate-300">{kind === 'book' ? '저자 · 출판사' : '제작자'}<input required maxLength={120} className={inputClass} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></label>
            <label className="block text-sm text-slate-300">설명<textarea rows={3} maxLength={2000} className={inputClass} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
            <label className="block text-sm text-slate-300">배포 권한 · 이용 조건<textarea required rows={3} maxLength={2000} className={inputClass} placeholder="앱에서 파일을 배포할 수 있는 라이선스와 출처를 입력해 주세요. 사용자에게도 표시됩니다." value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} /></label>
            <button type="submit" className={buttonClass} disabled={busy || !valid || (!!selected && !dirty)}>{busy ? '처리 중…' : selected ? '초안 저장' : '초안 만들기'}</button>
          </fieldset>
        </form>
        <div className="mt-8 space-y-3 border-t border-slate-800 pt-6">
          <h3 className="font-semibold text-white">파일 등록</h3>
          {(!selected || dirty) && <p className="text-sm text-amber-300">입력한 정보를 먼저 저장한 뒤 파일을 등록해 주세요.</p>}
          {kind === 'book' ? <div className="grid gap-3 md:grid-cols-2">{fileControl('book', '책 파일', '.epub,.txt', 'EPUB 또는 TXT · 최대 20MB. 새 파일을 올리면 초안의 기존 책 파일을 교체합니다.')}{fileControl('cover', '책 표지', '.png,.jpg,.jpeg,.webp', 'PNG · JPG · WebP · 최대 5MB')}</div> : <>
            <label className="block text-sm text-slate-300">글꼴 굵기<select disabled={busy || !!selected?.deleting} className={inputClass} value={weight} onChange={e => setWeight(e.target.value)}>{[100,200,300,400,500,600,700,800,900].map(w => <option value={w} key={w}>{w}{w === 300 ? ' · Light' : w === 400 ? ' · Regular' : w === 700 ? ' · Bold' : ''}</option>)}</select></label>
            {fileControl(`font${weight}`, '선택한 굵기의 글꼴 파일', '.otf,.ttf', '정적 OTF · TTF · 파일당 최대 10MB. 다른 굵기는 차례로 추가하세요.')}
          </>}
          {selected && <ul className="space-y-2">{Object.entries(selected.assets).map(([slot, asset]) => <li key={slot} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-950 p-3 text-sm text-slate-300"><span>{slot === 'cover' ? '표지' : slot === 'epub' ? 'EPUB' : slot === 'txt' ? 'TXT' : `글꼴 ${asset.weight}`} · {(asset.size / 1024 / 1024).toFixed(1)}MB · 등록됨</span><button className="text-xs text-rose-300 disabled:opacity-40" disabled={busy || dirty || !!selected?.deleting} onClick={() => void run(() => mutateReaderContent({ action: 'removeAsset', id: selected.id, revision: selected.revision, slot }), '초안에서 파일을 제외했습니다. 공개 중인 파일은 다음 공개까지 유지됩니다.')}>초안에서 제외</button></li>)}</ul>}
        </div>
        {selected && <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-6">
          <button disabled={busy || dirty || !publishReady || !!selected.deleting} className={`${buttonClass} border-emerald-600 bg-emerald-700 hover:bg-emerald-600`} onClick={() => void run(() => mutateReaderContent({ action: 'publish', id: selected.id, revision: selected.revision }), '공개했습니다. 앱에서 목록을 새로고침하면 확인할 수 있습니다.')}>{selected.published ? '수정 내용 공개' : '앱에 공개'}</button>
          {selected.published && <button disabled={busy || dirty || !!selected?.deleting} className={buttonClass} onClick={() => void run(() => mutateReaderContent({ action: 'unpublish', id: selected.id, revision: selected.revision }), '비공개로 전환했습니다. 이미 내려받은 파일은 사용자 기기에 유지됩니다.')}>비공개로 전환</button>}
          <button disabled={busy || loading} className={`${buttonClass} border-rose-800 text-rose-300 hover:bg-rose-950`} onClick={() => void remove()}>{selected.deleting ? '삭제 재시도' : '영구 삭제'}</button>
          {selected.deleting && <p role="status" className="w-full text-sm text-amber-300">신규 다운로드가 차단된 상태입니다. 삭제를 다시 시도하여 서버 파일 정리를 완료해 주세요.</p>}
          <p className="w-full text-xs leading-5 text-slate-500">공개한 파일은 로그인 없이 다운로드할 수 있습니다. 비공개 전환 후에도 이미 내려받은 파일은 유지됩니다.</p>
        </div>}
      </AdminCard>
    </div>
  </div>;
}
