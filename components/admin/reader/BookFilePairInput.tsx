'use client';
import { ReaderFileInput } from './ReaderFileInput';
import { useState } from 'react';
import { matchBookFilePair } from '../../../lib/admin/firebase/book-file-pair';

export function BookFilePairInput({ disabled, onSelect }: { disabled: boolean; onSelect: (pair: { book: File; cover: File; title: string }) => void }) {
  const [error, setError] = useState('');
  const choose = (files: File[]) => {
    if (disabled) return;
    try { const pair = matchBookFilePair(files); onSelect(pair); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : '파일을 확인해 주세요.'); }
  };
  return <div>
    <label className="block text-sm text-slate-200">본문·이미지 함께 등록
      <ReaderFileInput  multiple disabled={disabled} accept=".txt,.epub,.png,.jpg,.jpeg,.webp"  onFiles={selectedFiles => { choose(selectedFiles);  }} />
    </label>
    <p className="mt-2 text-xs text-slate-400">한 작품씩 파일명이 같은 본문과 이미지를 함께 선택하거나 끌어다 놓으세요. 예: 겨울옷.txt + 겨울옷.png. 제목이 비어 있으면 파일명으로 채웁니다. 아래에서 각각 선택해도 됩니다.</p>
    <p className="mt-2 text-xs text-slate-400">TXT는 공개할 때 이미지 첫 페이지 + 본문 순서의 EPUB으로 생성됩니다. [장] 없이도 등록 가능하며, [장] 제목이 있으면 목차로 유지됩니다. 직접 만든 EPUB은 본문을 변경하지 않고 이미지만 서재 표지로 사용합니다.</p>
    {error && <p role="alert" className="mt-2 text-sm text-rose-300">{error}</p>}
  </div>;
}
