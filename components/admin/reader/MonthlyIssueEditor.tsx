'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { BookImage, ChevronDown } from 'lucide-react';
import type { ReaderContent, ReaderMetadata } from '../../../lib/admin/firebase/reader-api';
import MonthlyFields from './MonthlyFields';

const input = 'mt-2 w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none';
const button = 'rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

function useCoverPreview(file: File | undefined, item: ReaderContent | null) {
  const [url, setUrl] = useState('');
  const [failed, setFailed] = useState(false);
  const snapshot = item?.publishedContent;
  const publishedHash = snapshot?.assets.cover?.sha256;
  const draftHash = item?.assets.cover?.sha256;
  const id = item?.id;
  const version = snapshot?.version;
  useEffect(() => {
    setUrl(''); setFailed(false);
    if (file) {
      const local = URL.createObjectURL(file); setUrl(local);
      return () => URL.revokeObjectURL(local);
    }
    // Do not show a previous public cover as if it were a newly saved draft.
    if (!id || !version || !publishedHash || draftHash !== publishedHash) return;
    const controller = new AbortController();
    const endpoint = (process.env.NEXT_PUBLIC_READER_ADMIN_URL || 'https://asia-northeast3-koofy-reader.cloudfunctions.net/readerAdmin').replace(/readerAdmin$/, 'readerCatalog');
    const query = new URLSearchParams({ action: 'download', id, version: String(version), slot: 'cover' });
    void fetch(`${endpoint}?${query}`, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('preview unavailable');
      const result = await response.json();
      if (!controller.signal.aborted) setUrl(result.url);
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [file, id, version, publishedHash, draftHash]);
  return { url, failed, fail: () => setFailed(true) };
}

export default function MonthlyIssueEditor({ form, onChange, selected, busy, dirty, valid, publishReady, coverFile, coverInput, onSave, onEpisodes, onCompile, onRemoveCover, onCancelFile, management }: {
  form: ReaderMetadata; onChange: (value: ReaderMetadata) => void; selected: ReaderContent | null;
  busy: boolean; dirty: boolean; valid: boolean; publishReady: boolean; coverFile?: File; coverInput: ReactNode;
  onSave: (publish: boolean) => void; onEpisodes: () => void; onCompile: () => void;
  onRemoveCover: () => void; onCancelFile: () => void; management: ReactNode;
}) {
  const [extraOpen, setExtraOpen] = useState(false);
  const preview = useCoverPreview(coverFile, selected);
  const disabled = busy || !!selected?.deleting;
  const missingExtra = !form.author.trim() || !form.license.trim();
  return <div className="min-w-0 space-y-5 pb-28 sm:pb-20">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-semibold text-white">{selected ? '월간호 설정' : '새 월간호 등록'}</h2><p className="mt-1 text-sm text-slate-400">기본 정보와 표지를 정하고, 회차 관리에서 글을 올리세요.</p></div>
      {selected && <button className={button} disabled={disabled} onClick={onEpisodes}>회차 관리 →</button>}
    </div>
    <fieldset disabled={disabled} className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-[160px_140px_minmax(0,1fr)]">
      <label className="min-w-0 text-sm text-slate-300">발행 월<input type="month" required className={input} disabled={!!selected?.publishedContent} value={form.issueMonth || ''} onChange={e => onChange({ ...form, issueMonth: e.target.value, compilationId: '', releaseDate: '', releaseAt: '' })} /></label>
      <label className="min-w-0 text-sm text-slate-300">언어<select className={input} disabled={!!selected?.publishedContent} value={form.language || 'ko'} onChange={e => onChange({ ...form, language: e.target.value as 'ko' | 'en' | 'ja', compilationId: '' })}><option value="ko">한국어</option><option value="en">English</option><option value="ja">日本語</option></select></label>
      <label className="min-w-0 text-sm text-slate-300 sm:col-span-2 2xl:col-span-1">월간호 제목<input required maxLength={160} className={input} value={form.title} placeholder="월간 쿠피 11월호" onChange={e => onChange({ ...form, title: e.target.value })} /></label>
    </fieldset>
    <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 space-y-3" aria-label="대표 표지">
        <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 sm:h-56">
          {preview.url && !preview.failed ? <img src={preview.url} alt="월간호 대표 표지 미리보기" className="h-full w-full object-contain p-3" onError={preview.fail} /> : <div className="px-4 text-center text-sm text-slate-400"><BookImage className="mx-auto mb-3 h-8 w-8" />{selected?.assets.cover ? '대표 표지 등록됨 · 새 이미지를 선택하면 미리볼 수 있습니다.' : '대표 표지를 선택해 주세요'}</div>}
        </div>
        {coverInput}
        {coverFile ? <button className="text-sm text-slate-300 underline" disabled={disabled} onClick={onCancelFile}>선택 취소</button> : selected?.assets.cover && <button className="text-sm text-slate-400 underline" disabled={disabled || dirty} onClick={onRemoveCover}>등록된 표지를 초안에서 제외</button>}
      </section>
      <fieldset disabled={disabled} className="min-w-0 space-y-4 rounded-xl border border-slate-800 p-4">
        <legend className="px-2 text-sm font-medium text-white">발행 · 합본 설정</legend>
        <label className="flex items-center justify-between gap-3 text-sm text-slate-200">월말 자동 합본 생성<input type="checkbox" className="h-5 w-5 accent-emerald-500" checked={form.autoCompile || false} onChange={e => onChange({ ...form, autoCompile: e.target.checked })} /></label>
        <p className="text-xs leading-5 text-slate-400">다음 달 1일 0시 이후, 해당 월에 공개된 회차만 공개 일시 순으로 모아 합본을 만듭니다. 한국 시간 기준이며 매시간 확인합니다.</p>
        <label className="block text-sm text-slate-300">발행 상태<select className={input} value={form.seriesStatus || 'ongoing'} onChange={e => onChange({ ...form, seriesStatus: e.target.value as 'ongoing' | 'completed' })}><option value="ongoing">연재 중</option><option value="completed">완결</option></select></label>
        {selected?.publishedContent?.compilationId && <p className="text-sm text-emerald-300">합본 연결 완료</p>}
        {selected?.compilationError && <p role="alert" className="text-sm text-amber-300">{selected.compilationError}</p>}
        {selected && <button className={`${button} w-full`} disabled={disabled || dirty || !selected.published || !!selected.publishedContent?.compilationId} onClick={onCompile}>지금 합본 만들고 마감</button>}
      </fieldset>
    </div>
    <details id="monthly-extra-anchor" open={extraOpen} onToggle={e => setExtraOpen(e.currentTarget.open)} className="rounded-xl border border-slate-800">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm text-slate-200">추가 정보 <span className="flex items-center gap-2 text-xs text-slate-400">{missingExtra ? '제작자 · 배포 권한 입력 필요' : '제작자 · 설명 · 이용 조건 · 합본 연결'}<ChevronDown className={`h-4 w-4 ${extraOpen ? 'rotate-180' : ''}`} /></span></summary>
      <fieldset disabled={disabled} className="grid gap-4 border-t border-slate-800 p-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-300">제작자 / 저자 (필수)<input className={input} required maxLength={120} value={form.author} onChange={e => onChange({ ...form, author: e.target.value })} /></label>
        <label className="block text-sm text-slate-300">설명 (선택)<textarea className={input} rows={2} maxLength={2000} value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} /></label>
        <label className="block text-sm text-slate-300 sm:col-span-2">배포 권한 · 이용 조건 (필수)<textarea className={input} required rows={2} maxLength={2000} value={form.license} onChange={e => onChange({ ...form, license: e.target.value })} /></label>
        <div className="min-w-0 sm:col-span-2">{extraOpen && <MonthlyFields section="link" kind="series" series={null} form={form} onChange={onChange} />}</div>
      </fieldset>
    </details>
    {management}
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-700 bg-slate-950/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur lg:left-72">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-3">
        <span role="status" className="w-full text-xs text-slate-400 sm:mr-auto sm:w-auto">{busy ? '저장 중…' : missingExtra ? <button className="text-amber-300 underline" onClick={() => { setExtraOpen(true); document.getElementById('monthly-extra-anchor')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }}>추가 정보의 필수 항목을 입력하세요</button> : dirty ? '저장하지 않은 변경이 있습니다' : selected ? '저장된 상태입니다' : '정보를 입력해 주세요'}</span>
        <button className={`${button} flex-1 sm:flex-none`} disabled={disabled || !valid || (!!selected && !dirty)} onClick={() => onSave(false)}>초안 저장</button>
        <button className={`${button} flex-1 border-emerald-600 bg-emerald-700 hover:bg-emerald-600 sm:flex-none`} disabled={disabled || !valid || !publishReady} onClick={() => onSave(true)}>{selected?.published ? '수정하고 공개' : '등록하고 공개'}</button>
      </div>
    </div>
  </div>;
}
