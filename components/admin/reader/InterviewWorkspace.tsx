'use client';

import { useEffect, useRef, useState } from 'react';
import {
  interviewPhotoPreview, listInterviews, saveInterview, uploadSharedReaderCover,
  type InterviewArticle, type InterviewBlock, type InterviewRecord,
} from '../../../lib/admin/firebase/reader-api';
import { useReaderLeaveGuard } from '../../../lib/admin/use-reader-leave-guard';
import { formatInterviewBlocks, interviewBodyText, splitInterviewManuscript } from '../../../lib/admin/reader/interview-manuscript';
import { readerButton } from './ReaderAdminUI';
import { ReaderReleaseDateField } from './ReaderPublicationSchedule';

const input = 'block w-full rounded-lg border border-slate-600 bg-slate-950 p-2 text-white';
const card = 'space-y-3 rounded-xl border border-slate-700 p-4';
const empty: InterviewArticle = { title: '', subtitle: '', person: '', summary: '', cover: '', coverAlt: '', releaseAt: '', blocks: [] };
type PhotoBlock = Extract<InterviewBlock, { type: 'photo' }>;
const imageTypes = 'image/jpeg,image/png,image/webp';

function BodyText({ text, onText, onPaste, onPhoto }: {
  text: string;
  onText: (text: string) => void;
  onPaste: (text: string) => boolean;
  onPhoto: (file: File, before: string, after: string) => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const position = useRef(text.length);
  return <div className="space-y-2">
    <textarea ref={textarea} className={input} aria-label="본문" rows={text ? 14 : 8} value={text}
      placeholder="원고를 여기에 붙여넣으세요."
      onChange={event => onText(event.target.value)}
      onPaste={event => { if (onPaste(event.clipboardData.getData('text/plain'))) event.preventDefault(); }} />
    <button type="button" className={readerButton} onClick={() => {
      position.current = textarea.current?.selectionStart ?? text.length;
      picker.current?.click();
    }}>본문 사진 넣기</button>
    <input ref={picker} hidden type="file" accept={imageTypes} onChange={event => {
      const file = event.currentTarget.files?.[0];
      if (file) onPhoto(file, text.slice(0, position.current), text.slice(position.current));
      event.currentTarget.value = '';
    }} />
  </div>;
}

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

function PhotoEditor({ block, onChange, onRemove }: {
  block: PhotoBlock;
  onChange: (block: PhotoBlock) => void;
  onRemove: () => void;
}) {
  return <figure className={card}>
    <Photo photo={block.photo} alt={block.alt || block.caption} />
    <label className="block">사진 설명 <span className="text-sm text-slate-400">(선택)</span>
      <input className={input} maxLength={500} value={block.caption}
        onChange={event => onChange({ ...block, caption: event.target.value })} />
    </label>
    <button type="button" className={readerButton} onClick={onRemove}>사진 빼기</button>
  </figure>;
}

export default function InterviewWorkspace() {
  const [items, setItems] = useState<InterviewRecord[]>([]);
  const [item, setItem] = useState<InterviewRecord>();
  const [busy, setBusy] = useState(true);
  const [preview, setPreview] = useState(false);
  const [schedule, setSchedule] = useState(false);
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
    setSchedule(!!next.draft.releaseAt);
    setError('');
    setMessage('');
  }
  function update(patch: Partial<InterviewArticle>) {
    setItem(current => current && { ...current, draft: { ...current.draft, ...patch } });
  }
  function replaceBlocks(start: number, end: number, ...replacement: InterviewBlock[]) {
    if (draft) update({ blocks: [...draft.blocks.slice(0, start), ...replacement, ...draft.blocks.slice(end)] });
  }
  const photos = (draft?.blocks ?? []).flatMap((block, index) =>
    block.type === 'photo' ? [{ block, index }] : []);
  const bodyParts = [
    ...photos,
    { block: null, index: draft?.blocks.length ?? 0 },
  ];
  function previewBlocks() {
    return formatInterviewBlocks(draft?.blocks ?? []);
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
      const blocks = previewBlocks();
      if (action !== 'unpublish' && (blocks.length > 100 || blocks.some(block =>
        (block.type === 'text' && block.text.length > 20000) ||
        (block.type === 'qa' && block.answer.length > 20000)))) {
        throw new Error('본문이 너무 깁니다. 글의 길이를 줄여 주세요.');
      }
      const saved = await saveInterview(action, { ...item, draft: { ...item.draft, blocks } });
      setSchedule(!!saved.draft.releaseAt);
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
        <button className={readerButton} onClick={() => save('publish')}>{draft.releaseAt ? '예약 공개' : '공개하기'}</button>
        <button className={readerButton} aria-expanded={schedule} onClick={() => setSchedule(!schedule)}>공개 시간 설정</button>
        {item?.live && <button className={readerButton} onClick={() => { if (window.confirm('앱과 웹에서 공개를 해제할까요?')) save('unpublish'); }}>공개 해제</button>}
        {dirty && <span className="self-center text-sm text-amber-300">저장하지 않은 변경</span>}
      </div>
      {schedule && <ReaderReleaseDateField value={draft.releaseAt} onChange={releaseAt => update({ releaseAt })} />}
      {preview ? <article className="mx-auto max-w-2xl space-y-6 whitespace-pre-wrap text-base leading-relaxed">
        <header><h2 className="text-3xl font-bold">{draft.title}</h2><p>{draft.subtitle}</p><p>{draft.person}</p></header>
        <Photo photo={draft.cover} alt={draft.coverAlt} />
        {previewBlocks().map((block, index) => block.type === 'text' ? <p key={index}>{block.text}</p>
          : block.type === 'qa' ? <div key={index}><h3 className="mb-2 font-bold">{block.question}</h3><p>{block.answer}</p></div>
          : <figure key={index}><Photo photo={block.photo} alt={block.alt} /><figcaption>{block.caption}</figcaption></figure>)}
      </article> : <>
        <div className={card}>
          <label className="block">제목
            <input className={input} maxLength={160} value={draft.title} onChange={event => update({ title: event.target.value })} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="block">대표 사진 <span className="text-sm text-slate-400">(선택)</span>
              <input className={input} type="file" accept={imageTypes} onChange={event => {
                upload(event.target.files?.[0], cover => update({ cover, coverAlt: '' }));
                event.target.value = '';
              }} />
            </label>
            {draft.cover && <button className={readerButton} onClick={() => update({ cover: '', coverAlt: '' })}>대표 사진 제거</button>}
          </div>
          <Photo photo={draft.cover} alt={draft.coverAlt} />
        </div>
        <section className={card} aria-label="본문 편집">
          <h2 className="font-semibold">본문</h2>
          <p className="text-sm text-slate-400">사진을 넣을 위치에 커서를 두고 ‘본문 사진 넣기’를 누르세요.</p>
          {bodyParts.map(({ block, index }, part) => {
            const start = part === 0 ? 0 : photos[part - 1].index + 1;
            const text = interviewBodyText(draft.blocks.slice(start, index));
            return <div key={part} className="space-y-4">
              <BodyText text={text}
                onText={text => replaceBlocks(start, index, { type: 'text', text })}
                onPaste={value => {
                  if (text.trim() || photos.length || previewBlocks().length) return false;
                  const manuscript = splitInterviewManuscript(value);
                  if (!manuscript.title || manuscript.title.length > 160) return false;
                  update({
                    title: draft.title || manuscript.title,
                    blocks: [{ type: 'text', text: manuscript.body }],
                  });
                  return true;
                }}
                onPhoto={(file, before, after) => upload(file, photo => replaceBlocks(start, index,
                  { type: 'text', text: before },
                  { type: 'photo', photo, caption: '', alt: '' },
                  { type: 'text', text: after },
                ))} />
              {block && <PhotoEditor block={block} onChange={photo => replaceBlocks(index, index + 1, photo)}
                onRemove={() => replaceBlocks(index, index + 1)} />}
            </div>;
          })}
        </section>
      </>}
    </fieldset>}
  </div>;
}
