import { useState } from 'react';
import { setReaderSeriesStatus } from '../../../lib/admin/firebase/reader-api';
import {readerButton} from './ReaderAdminUI';
import type { ReaderContent } from '../../../lib/admin/firebase/reader-api';
import { ReaderSavedCover } from './ReaderSavedCover';
import { ReaderStatus } from './ReaderAdminUI';
const languages = ['ko', 'en', 'ja'] as const;
const names = {ko:'한국어', en:'English', ja:'日本語'};
export interface ReaderWorkRow {id:string; title:string; detail:string; items:ReaderContent[]}
/** Shared saved-work list. Each row represents one work, keeping translations together. */
export function ReaderWorkList({rows,query,onOpen,busy=false,loading=false,onStatusChanged,onStatusBusy}:{rows:ReaderWorkRow[];query:string;onOpen:(id:string)=>void;busy?:boolean;loading?:boolean;onStatusChanged?:()=>Promise<void>;onStatusBusy?:(busy:boolean)=>void}) {
 const [changing,setChanging]=useState(false);
 const [message,setMessage]=useState('');
 async function toggle(row:ReaderWorkRow) {
  if(busy||changing||!onStatusChanged)return;
  const status=row.items.every(x=>x.seriesStatus==='completed')?'ongoing':'completed';
  setChanging(true);onStatusBusy?.(true);setMessage('');
  try {
   const preview=await setReaderSeriesStatus(row.items,status,true);
   const pending=preview.pending.drafts+preview.pending.scheduled;
   const warning=status==='completed'&&pending?`\n미공개 ${preview.pending.drafts}건 · 예약 ${preview.pending.scheduled}건 (언어별 합계)이 남아 있습니다. 공개 일정은 유지됩니다.`:'';
   if(!window.confirm(`‘${row.title}’의 연결된 ${row.items.length}개 언어를 ${status==='completed'?'완결':'연재 중'}로 변경할까요?${warning}\n미저장 원고나 설정은 공개되지 않습니다.`))return;
   await setReaderSeriesStatus(row.items,status,false,status==='completed'&&pending>0);
   try {await onStatusChanged();setMessage('작품 상태를 변경했습니다.');}
   catch {setMessage('상태 변경은 완료했지만 목록 갱신에 실패했습니다. 새로고침해 확인해 주세요.');}
  } catch(error) {setMessage(error instanceof Error?error.message:'상태 변경에 실패했습니다.');}
  finally {setChanging(false);onStatusBusy?.(false);}
 }
 if(loading)return <p role="status">목록을 불러오는 중입니다…</p>;
 const visible=rows.filter(row=>[row.title,row.detail,...row.items.map(item=>item.title)].some(text=>text.toLowerCase().includes(query.trim().toLowerCase())));
 return <>{message&&<p role="status">{message}</p>}<div className="reader-general-grid">{visible.map(row=><div key={row.id} className="reader-general-card"><button disabled={busy||changing} className="reader-book-row w-full text-left" onClick={()=>onOpen(row.id)}>
  <ReaderSavedCover item={row.items.find(x=>(x.language||'ko')==='ko'&&x.assets.cover)||row.items.find(x=>x.assets.cover)||row.items[0]}/>
  <span className="reader-book-info"><strong className="reader-episode-title">{row.title}</strong><span className="mt-1 block text-sm text-slate-400">{row.detail}</span><span className="reader-book-languages">{languages.map(language=>{const item=row.items.find(x=>(x.language||'ko')===language);return <span key={language}>{names[language]} <ReaderStatus value={!item?'미등록':item.published?'공개 중':'임시 저장'}/></span>;})}</span></span><span className="reader-book-arrow" aria-hidden>→</span>
 </button>{row.items.every(x=>x.kind==='series'&&!x.issueMonth&&!x.publishedContent?.issueMonth)&&onStatusChanged&&<div className="reader-work-status-actions"><span>{row.items.every(x=>x.seriesStatus==='completed')?'완결':row.items.some(x=>x.seriesStatus==='completed')?'언어별 상태 다름':'연재 중'}</span><button className={readerButton} disabled={busy||changing} aria-label={`${row.title} ${row.items.every(x=>x.seriesStatus==='completed')?'연재 중으로 변경':'완결로 변경'}`} onClick={()=>void toggle(row)}>{changing?'처리 중…':row.items.every(x=>x.seriesStatus==='completed')?'연재 중으로 변경':'완결로 변경'}</button></div>}</div>)}{!visible.length&&<p className="col-span-full py-12 text-center text-slate-400">{rows.length?'검색 결과가 없습니다.':'등록된 항목이 없습니다. 등록 버튼에서 시작해 주세요.'}</p>}</div></>;
}
