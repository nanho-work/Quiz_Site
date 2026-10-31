 'use client';
import { useId, useRef, useState } from 'react';
import { validateFileSelection } from '../../../lib/admin/reader/file-selection';

/** Shared keyboard-accessible picker and drop target. Does not upload or own domain state. */
export function ReaderFileInput({ accept, multiple = false, disabled = false, onFiles, className = '', 'aria-label': label }: {
  accept: string; multiple?: boolean; disabled?: boolean; onFiles: (files: File[]) => void;
  className?: string; 'aria-label'?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const choose = (files: File[]) => {
    if (disabled || ref.current?.matches(':disabled') || !files.length) return;
    const problem = validateFileSelection(files, accept, multiple);
    setError(problem || '');
    if (!problem) onFiles(files);
  };
  return <span className={`my-2 block min-w-0 rounded-lg border border-dashed p-4 transition-colors ${disabled ? 'opacity-40' : 'focus-within:ring-2 focus-within:ring-emerald-400'} ${dragging ? 'border-emerald-400 bg-emerald-950/40' : 'border-slate-600'} ${className}`}
    onDragOver={e => { e.preventDefault(); e.stopPropagation(); if (!disabled && !ref.current?.matches(':disabled')) setDragging(true); }}
    onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
    onDrop={e => { e.preventDefault(); e.stopPropagation(); setDragging(false); choose(Array.from(e.dataTransfer.files)); }}>
    <span className="block text-xs text-slate-400">{multiple ? '여러 파일을 끌어다 놓거나 선택하세요' : '파일을 끌어다 놓거나 선택하세요'}</span>
    <input ref={ref} aria-label={label} aria-invalid={!!error} aria-describedby={error ? id : undefined} type="file" accept={accept} multiple={multiple} disabled={disabled}
      className="mt-3 block w-full min-w-0 text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-white"
      onChange={e => { choose(Array.from(e.target.files || [])); e.target.value = ''; }} />
    {error && <span id={id} role="alert" className="mt-2 block text-sm text-amber-300">{error}</span>}
  </span>;
}
