"use client";
import {useRef,useState} from 'react';
import {deleteReaderContent,listReaderContent,type ReaderContent} from '../../../lib/admin/firebase/reader-api';
import {planReaderDeletion,executeReaderDeletion} from '../../../lib/admin/reader/delete-selection';
import {readerButton} from './ReaderAdminUI';
const languages={ko:'한국어',en:'English',ja:'日本語'};
export function ReaderDeleteActions({items,busy,setBusy,onDeleted,label='작품'}:{items:ReaderContent[];busy:boolean;setBusy:(value:boolean)=>void;onDeleted:(ids:string[])=>void|Promise<void>;label?:string}) {
 const locked=useRef(false);const [message,setMessage]=useState('');
 async function remove(targets:ReaderContent[]) {
  if(locked.current||busy)return;locked.current=true;setBusy(true);setMessage('삭제 대상을 확인하고 있습니다…');
  try {
   const plan=await planReaderDeletion(targets,async parent=>{const all:ReaderContent[]=[];let after:string|undefined;const seen=new Set<string>();do{const page=await listReaderContent('book',after,parent.id);all.push(...page.items);after=page.nextCursor||undefined;if(after&&seen.has(after))throw Error('회차 목록을 끝까지 확인하지 못했습니다.');if(after)seen.add(after);}while(after);return all;});
   const names=plan.parents.map(x=>`${languages[x.language||'ko']} · ${x.title}`).join('\n');
   if(!window.confirm(`${names}\n\n선택한 ${label} ${plan.parents.length}개${plan.children.length?`와 포함된 회차 ${plan.children.length}개`:''}를 영구 삭제할까요?\n등록 정보와 첨부 파일이 삭제되며 복구할 수 없습니다. 신규 다운로드가 중단됩니다.${plan.parents.some(x=>x.compilationId||x.publishedContent?.compilationId)?' 연결된 합본 도서는 별도 자료이므로 함께 삭제되지 않습니다.':''} 이미 내려받은 사용자 기기의 파일은 유지됩니다. 저장하지 않은 입력도 닫힙니다.`)){setMessage('');return;}
   const ids=await executeReaderDeletion(plan,item=>deleteReaderContent(item), (done,total)=>setMessage(`삭제 중 ${done} / ${total}`));
   setMessage('삭제를 완료했습니다.');await onDeleted(ids);
  }catch(error){setMessage(`삭제를 완료하지 못했습니다. 일부 항목은 삭제되었을 수 있습니다. 같은 대상으로 다시 시도할 수 있습니다. ${(error as Error).message}`);}
  finally{locked.current=false;setBusy(false);}
 }
 if(!items.length)return null;
 return <details className="border-t border-slate-700 pt-3"><summary className="cursor-pointer">삭제 관리</summary><p className="my-2 text-xs text-slate-500">언어별로 삭제하거나 전체 언어를 삭제할 수 있습니다. 작품 삭제에는 포함된 회차도 함께 삭제됩니다.</p>
 <div className="space-y-2">{items.map(item=><div key={item.id} className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm">{languages[item.language||'ko']} · {item.title}</span><button disabled={busy} className={`${readerButton} reader-button-danger`} onClick={()=>void remove([item])}>{item.deleting?'삭제 재시도':`${languages[item.language||'ko']} 삭제`}</button></div>)}</div>
 {items.length>1&&<button disabled={busy} className={`${readerButton} reader-button-danger mt-3`} onClick={()=>void remove(items)}>{label} 삭제 · 전체 언어</button>}
 {message&&<p role="status" className="mt-3 text-sm">{message}</p>}</details>;
}
