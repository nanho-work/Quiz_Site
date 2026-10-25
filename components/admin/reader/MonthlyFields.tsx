'use client';
import { useEffect, useState } from 'react';
import { listReaderContent, ReaderContent, ReaderKind, ReaderMetadata } from '../../../lib/admin/firebase/reader-api';

/** Monthly publishing is an extension of series, not another content store. */
export default function MonthlyFields({ kind, series, form, onChange, monthLocked = false, section = 'all' }: {
  section?: 'all' | 'link';
  monthLocked?: boolean; kind: ReaderKind; series: ReaderContent | null; form: ReaderMetadata; onChange: (value: ReaderMetadata) => void;
}) {
  const [books, setBooks] = useState<ReaderContent[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    if (kind !== 'series' || !form.issueMonth) return;
    setError('');
    void (async () => {
      const all: ReaderContent[] = []; let cursor: string | undefined;
      do { const page = await listReaderContent('book', cursor); all.push(...page.items); cursor = page.nextCursor || undefined; } while (cursor);
      if (active) setBooks(all);
    })().catch(() => { if (active) setError('합본 목록을 불러오지 못했습니다. 화면을 다시 열어 주세요.'); });
    return () => { active = false; };
  }, [kind, form.issueMonth]);
  if (kind === 'font') return null;
  const input = 'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white';
  if (series) return series.issueMonth ? <label className="block text-sm text-slate-300">공개 일시 (한국 시간 기준)
    <input required type="datetime-local" className={input} value={form.releaseAt?.slice(0, 16) || (form.releaseDate ? form.releaseDate + 'T00:00' : '')} min={`${series.issueMonth}-01T00:00`} onChange={e => onChange({ ...form, releaseDate: e.target.value.slice(0, 10), releaseAt: e.target.value ? e.target.value + ':00+09:00' : '' })} />
    <span className="mt-2 block text-xs">예약 저장 후에도 지정한 일시 전에는 앱에 노출되지 않습니다. 회차별 표지를 넣어 주세요.</span>
  </label> : null;
  const options = books.filter(book => book.published && book.publishedContent?.assets.epub && !book.seriesId &&
    book.publishedContent.issueMonth === form.issueMonth && (book.publishedContent.language || 'ko') === (form.language || 'ko'));
  return <div className="space-y-3 rounded-xl border border-slate-700 p-4">
    {section === 'all' && <label className="block text-sm text-slate-300">발행 월 (필수)
      <input required disabled={monthLocked} type="month" className={input} value={form.issueMonth || ''} onChange={e => onChange({ ...form, issueMonth: e.target.value, compilationId: '', releaseDate: '', releaseAt: '' })} />
    </label>}
    {form.issueMonth && kind === 'book' && <p className="text-xs text-slate-400">이 월간호의 완성된 합본 EPUB을 올리고 공개한 뒤, 월간호 · 회차 탭에서 해당 월간호에 연결하세요.</p>}
    {form.issueMonth && kind === 'series' && <>
      {section === 'all' && <><label className="block text-sm text-slate-300"><input type="checkbox" checked={form.autoCompile || false} onChange={e => onChange({ ...form, autoCompile: e.target.checked, expectedEpisodes: form.expectedEpisodes || 1 })} /> 월말 자동 합본 생성</label>
      <label className="block text-sm text-slate-300">이번 호 예정 회차 수
        <input type="number" min={1} max={100} className={input} value={form.expectedEpisodes || ''} onChange={e => onChange({ ...form, expectedEpisodes: Number(e.target.value) })} />
      </label>
      <p className="text-xs text-slate-400">설정 후 ‘수정하고 공개’를 눌러 적용하세요. 다음 달 1일 한국 시간 0시 이후 매시간 확인합니다. 예정 회차가 모두 공개되고 TXT 원본이 있어야 합본을 만들며, 누락·실패 시 기존 목록을 유지합니다. 원본 TXT와 이미지는 보관됩니다.</p></>}
      <label className="block text-sm text-slate-300">직접 만든 합본 연결 (선택)
        <select className={input} value={form.compilationId || ''} onChange={e => onChange({ ...form, compilationId: e.target.value, ...(e.target.value ? { seriesStatus: 'completed' } : {}) })}>
          <option value="">아직 연결하지 않음</option>
          {form.compilationId && !options.some(book => book.id === form.compilationId) && <option value={form.compilationId}>기존 연결 · 공개 상태 확인 필요</option>}
          {options.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}
        </select>
      </label>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <p className="text-xs text-slate-400">같은 월·언어의 공개된 EPUB만 표시됩니다. 합본 연결 후 ‘수정 내용 공개’를 누르면 앱 다운로드 목록은 합본으로 전환됩니다. 기존에 받은 회차와 독서 기록은 유지됩니다.</p>
      {section === 'all' && <p className="text-xs text-slate-400">일괄 등록에서 시작 일시와 발행 간격을 지정할 수 있습니다. 회차 번호와 발행 날짜는 별개이며 각 회차의 공개 일시도 수정할 수 있습니다.</p>}
    </>}
  </div>;
}
