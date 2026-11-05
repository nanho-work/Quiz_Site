 'use client';
import { useId, useRef, useState } from 'react';
import { validateFileSelection } from '../../../lib/admin/reader/file-selection';

/** Shared keyboard-accessible picker and drop target. Does not upload or own domain state. */
export function ReaderFileInput({ accept, multiple = false, disabled = false, onFiles, selectedFiles, className = '', 'aria-label': label }: {
  accept: string; multiple?: boolean; disabled?: boolean; onFiles: (files: File[]) => void;
  selectedFiles?: readonly File[]; className?: string; 'aria-label'?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [lastSelected, setLastSelected] = useState<File[]>([]);
  const shownFiles = selectedFiles ?? lastSelected;
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const choose = (files: File[]) => {
    if (disabled || ref.current?.matches(':disabled') || !files.length) return;
    const problem = validateFileSelection(files, accept, multiple);
    setError(problem || '');
    if (!problem) { onFiles(files); setLastSelected(files); }
  };
  return <span className={`my-2 block min-w-0 rounded-lg border border-dashed p-4 transition-colors ${disabled ? 'opacity-40' : 'focus-within:ring-2 focus-within:ring-emerald-400'} ${dragging ? 'border-emerald-400 bg-emerald-950/40' : 'border-slate-600'} ${className}`}
    onDragOver={e => { e.preventDefault(); e.stopPropagation(); if (!disabled && !ref.current?.matches(':disabled')) setDragging(true); }}
    onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
    onDrop={e => { e.preventDefault(); e.stopPropagation(); setDragging(false); choose(Array.from(e.dataTransfer.files)); }}>
    <span className="block text-xs text-slate-400">{multiple ? '여러 파일을 끌어다 놓거나 선택하세요' : '파일을 끌어다 놓거나 선택하세요'}</span>
    <button type="button" disabled={disabled} aria-label={label || (multiple ? '여러 파일 선택' : '파일 선택')} aria-describedby={`${id}-selection${error ? ` ${id}` : ''}`}
      className="mt-3 rounded-md bg-slate-700 px-3 py-2 text-xs text-white disabled:opacity-40" onClick={() => ref.current?.click()}>파일 선택</button>
    <input ref={ref} aria-label={label} aria-invalid={!!error} aria-describedby={error ? id : undefined} type="file" accept={accept} multiple={multiple} disabled={disabled}
      className="hidden" tabIndex={-1}
      onChange={e => { choose(Array.from(e.target.files || [])); e.target.value = ''; }} />
    <span id={`${id}-selection`} role="status" className="mt-2 block break-all text-xs text-slate-400">
      {shownFiles.length ? `${selectedFiles ? '선택된 파일' : '이번에 고른 파일'} ${shownFiles.length}개: ${shownFiles.slice(0, 3).map(file => file.name).join(' · ')}${shownFiles.length > 3 ? ` 외 ${shownFiles.length - 3}개` : ''}` : '선택한 파일이 없습니다.'}
    </span>
    {error && <span id={id} role="alert" className="mt-2 block text-sm text-amber-300">{error}</span>}
  </span>;
}
