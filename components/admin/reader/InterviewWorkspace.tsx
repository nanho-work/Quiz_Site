'use client';

import { useEffect, useState } from 'react';
import {
  interviewPhotoPreview, listInterviews, saveInterview, uploadSharedReaderCover,
  type InterviewArticle, type InterviewBlock, type InterviewRecord,
} from '../../../lib/admin/firebase/reader-api';
import { useReaderLeaveGuard } from '../../../lib/admin/use-reader-leave-guard';
import { readerButton } from './ReaderAdminUI';
import { ReaderReleaseDateField } from './ReaderPublicationSchedule';

const input = 'block w-full rounded-lg border border-slate-600 bg-slate-950 p-2 text-white';
const card = 'space-y-3 rounded-xl border border-slate-700 p-4';
const empty: InterviewArticle = { title: '', subtitle: '', person: '', summary: '', cover: '', coverAlt: '', releaseAt: '', blocks: [] };
const newBlocks: InterviewBlock[] = [
  { type: 'text', text: '' },
  { type: 'qa', question: '', answer: '' },
  { type: 'photo', photo: '', caption: '', alt: '' },
];
const labels = { text: '글', qa: '질문·답변', photo: '사진' };

function Photo({ photo, alt }: { photo: string; alt: string }) {
  const [result, setResult] = useState<{ key: string; url: string }>();
  useEffect(() => {
    if (!photo) return;
    let active = true;
    interviewPhotoPreview(photo).then(({ url }) => {
      if (active) setResult({ key: photo, url });
    }).catch(() => { if (active) setResult({ key: photo, url: '' }); });
    return () => { active = false; };
  }, [photo]);
  if (!photo) return null;
  if (result?.key !== photo) return <p>사진 불러오는 중…</p>;
  return result.url
    ? <img className="max-h-96 max-w-full rounded-lg object-contain" src={result.url} alt={alt} />
    : <p role="status">사진을 불러오지 못했습니다.</p>;
}

export default function InterviewWorkspace() {
  const [items, setItems] = useState<InterviewRecord[]>([]);
  const [item, setItem] = useState<InterviewRecord>();
  const [busy, setBusy] = useState(true);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    listInterviews().then(({ items }) => { if (active) setItems(items); })
      .catch((err: Error) => { if (active) setError(err.message); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  const draft = item?.draft;
  const stored = items.find(entry => entry.id === item?.id);
  const dirty = !!item && JSON.stringify(draft) !== JSON.stringify(stored?.draft ?? empty);
  useReaderLeaveGuard(dirty, busy);
  function select(next: InterviewRecord) {
    if (dirty && !window.confirm('저장하지 않은 변경을 버릴까요?')) return;
    setItem(next);
    setPreview(false);
    setError('');
    setMessage('');
  }
  function update(patch: Partial<InterviewArticle>) {
    setItem(current => current && { ...current, draft: { ...current.draft, ...patch } });
  }
  function setBlock(index: number, block: InterviewBlock) {
    if (draft) update({ blocks: draft.blocks.map((entry, position) => position === index ? block : entry) });
  }
  function move(index: number, offset: number) {
    if (!draft) return;
    const blocks = [...draft.blocks];
    const target = index + offset;
    if (target < 0 || target >= blocks.length) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    update({ blocks });
  }
  async function run(task: () => Promise<void>) {
    setBusy(true); setError(''); setMessage('');
    try { await task(); }
    catch (err) { setError(err instanceof Error ? err.message : '작업을 완료하지 못했습니다.'); }
    finally { setBusy(false); }
  }
  function upload(file: File | undefined, assign: (hash: string) => void) {
    if (file) void run(async () => assign((await uploadSharedReaderCover(file)).hash));
  }
  function save(action: 'save' | 'publish' | 'unpublish') {
    if (!item) return;
    void run(async () => {
      const saved = await saveInterview(action, item);
      setItems(current => [saved, ...current.filter(entry => entry.id !== saved.id)]);
      setItem(action === 'unpublish' ? { ...saved, draft: item.draft } : saved);
      setMessage(action === 'save' ? '초안을 저장했습니다.' : action === 'unpublish' ? '공개를 해제했습니다.' :
        Date.parse(saved.live?.releaseAt ?? '') > Date.now() ? '공개를 예약했습니다.' : '기사를 공개했습니다.');
    });
  }
  return <div className="mx-auto max-w-5xl space-y-5 p-4">
    <h1 className="text-2xl font-bold">사람을 만나다</h1>
    <div className="flex flex-wrap gap-2">
      <button className={readerButton} disabled={busy} onClick={() => select({
        id: crypto.randomUUID().replaceAll('-', ''), draft: empty, revision: 0, live: null,
      })}>새 인터뷰</button>
      <select className={input} aria-label="저장된 인터뷰" value={stored?.id ?? ''} disabled={busy}
        onChange={event => { const next = items.find(entry => entry.id === event.target.value); if (next) select(next); }}>
        <option value="" disabled>저장된 인터뷰 선택</option>
        {items.map(entry => <option key={entry.id} value={entry.id}>
          {entry.draft.title} · {entry.live ? Date.parse(entry.live.releaseAt) > Date.now() ? '예약' : '공개 중' : '초안'}
        </option>)}
      </select>
    </div>
    {busy && <p role="status">처리 중…</p>}
    {message && <p role="status">{message}</p>}
    {error && <p role="alert" className="text-rose-300">{error}</p>}
    {draft && <fieldset disabled={busy} className="min-w-0 space-y-4">
      <div className="flex flex-wrap gap-2">
        <button className={readerButton} onClick={() => setPreview(!preview)}>{preview ? '편집으로 돌아가기' : '미리보기'}</button>
        <button className={readerButton} onClick={() => save('save')}>초안 저장</button>
        <button className={readerButton} onClick={() => save('publish')}>공개·예약 반영</button>
        {item?.live && <button className={readerButton} onClick={() => { if (window.confirm('앱과 웹에서 공개를 해제할까요?')) save('unpublish'); }}>공개 해제</button>}
        {dirty && <span className="self-center text-sm text-amber-300">저장하지 않은 변경</span>}
      </div>
      {preview ? <article className="mx-auto max-w-2xl space-y-6 whitespace-pre-wrap text-base leading-relaxed">
        <header><h2 className="text-3xl font-bold">{draft.title}</h2><p>{draft.subtitle}</p><p>{draft.person}</p></header>
        <Photo photo={draft.cover} alt={draft.coverAlt} />
        {draft.blocks.map((block, index) => block.type === 'text' ? <p key={index}>{block.text}</p>
          : block.type === 'qa' ? <div key={index}><h3 className="mb-2 font-bold">{block.question}</h3><p>{block.answer}</p></div>
          : <figure key={index}><Photo photo={block.photo} alt={block.alt} /><figcaption>{block.caption}</figcaption></figure>)}
      </article> : <>
        <div className={card}>
          {([{ key: 'title', label: '제목', max: 160 }, { key: 'subtitle', label: '부제', max: 300 },
            { key: 'person', label: '인물', max: 160 }, { key: 'summary', label: '목록 소개', max: 1000 }] as const).map(({ key, label, max }) =>
            <label className="block" key={key}>{label}<input className={input} maxLength={max} value={draft[key]} onChange={event => update({ [key]: event.target.value })} /></label>)}
          <ReaderReleaseDateField value={draft.releaseAt} onChange={releaseAt => update({ releaseAt })} />
          <label className="block">대표 사진<input className={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { upload(event.target.files?.[0], cover => update({ cover })); event.target.value = ''; }} /></label>
          {draft.cover && <button className={readerButton} onClick={() => update({ cover: '' })}>대표 사진 제거</button>}
          <label className="block">대표 사진 대체 텍스트<input className={input} maxLength={500} value={draft.coverAlt} onChange={event => update({ coverAlt: event.target.value })} /></label>
          <Photo photo={draft.cover} alt={draft.coverAlt} />
        </div>
        {draft.blocks.map((block, index) => <section className={card} key={index}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto font-semibold">{labels[block.type]}</h2>
            <button className={readerButton} disabled={index === 0} onClick={() => move(index, -1)}>위로</button>
            <button className={readerButton} disabled={index === draft.blocks.length - 1} onClick={() => move(index, 1)}>아래로</button>
            <button className={readerButton} onClick={() => {
              if (window.confirm('이 본문 항목을 제거할까요?')) {
                update({ blocks: draft.blocks.filter((_, position) => position !== index) });
              }
            }}>제거</button>
          </div>
          {block.type === 'text' && <textarea aria-label="본문 글" className={input} rows={6} maxLength={20000} value={block.text} onChange={event => setBlock(index, { ...block, text: event.target.value })} />}
          {block.type === 'qa' && <>
            <label className="block">질문<input className={input} maxLength={500} value={block.question} onChange={event => setBlock(index, { ...block, question: event.target.value })} /></label>
            <label className="block">답변<textarea className={input} rows={6} maxLength={20000} value={block.answer} onChange={event => setBlock(index, { ...block, answer: event.target.value })} /></label>
          </>}
          {block.type === 'photo' && <>
            <input aria-label="본문 사진" className={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { upload(event.target.files?.[0], photo => setBlock(index, { ...block, photo })); event.target.value = ''; }} />
            <label className="block">사진 설명<input className={input} maxLength={500} value={block.caption} onChange={event => setBlock(index, { ...block, caption: event.target.value })} /></label>
            <label className="block">대체 텍스트<input className={input} maxLength={500} value={block.alt} onChange={event => setBlock(index, { ...block, alt: event.target.value })} /></label>
            <Photo photo={block.photo} alt={block.alt} />
          </>}
        </section>)}
        <div className="flex flex-wrap gap-2">
          {newBlocks.map(block => <button className={readerButton} key={block.type} disabled={draft.blocks.length >= 100}
            onClick={() => update({ blocks: [...draft.blocks, block] })}>{labels[block.type]} 추가</button>)}
        </div>
      </>}
    </fieldset>}
  </div>;
}
