import type { ReaderContent } from '../../../lib/admin/firebase/reader-api';
import { ReaderSavedCover } from './ReaderSavedCover';
import { ReaderStatus } from './ReaderAdminUI';
const languages = ['ko', 'en', 'ja'] as const;
const names = {ko:'한국어', en:'English', ja:'日本語'};
export interface ReaderWorkRow {id:string; title:string; detail:string; items:ReaderContent[]}
/** Shared saved-work list. Each row represents one work, keeping translations together. */
export function ReaderWorkList({rows,query,onOpen,busy=false,loading=false}:{rows:ReaderWorkRow[];query:string;onOpen:(id:string)=>void;busy?:boolean;loading?:boolean}) {
 if(loading)return <p role="status">목록을 불러오는 중입니다…</p>;
 const visible=rows.filter(row=>[row.title,row.detail,...row.items.map(item=>item.title)].some(text=>text.toLowerCase().includes(query.trim().toLowerCase())));
 return <div className="reader-general-grid">{visible.map(row=><button key={row.id} disabled={busy} className="reader-list-row reader-book-row reader-general-card w-full text-left" onClick={()=>onOpen(row.id)}>
  <ReaderSavedCover item={row.items.find(x=>(x.language||'ko')==='ko'&&x.assets.cover)||row.items.find(x=>x.assets.cover)||row.items[0]}/>
  <span className="reader-book-info"><strong className="reader-episode-title">{row.title}</strong><span className="mt-1 block text-sm text-slate-400">{row.detail}</span><span className="reader-book-languages">{languages.map(language=>{const item=row.items.find(x=>(x.language||'ko')===language);return <span key={language}>{names[language]} <ReaderStatus value={!item?'미등록':item.published?'공개 중':'임시 저장'}/></span>;})}</span></span><span className="reader-book-arrow" aria-hidden>→</span>
 </button>)}{!visible.length&&<p className="col-span-full py-12 text-center text-slate-400">{rows.length?'검색 결과가 없습니다.':'등록된 항목이 없습니다. 등록 버튼에서 시작해 주세요.'}</p>}</div>;
}
