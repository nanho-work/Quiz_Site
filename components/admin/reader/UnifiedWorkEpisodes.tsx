 'use client';
import { useEffect, useRef, useState } from 'react';
import {saveWorkEpisode,type WorkEpisodeEntry} from '../../../lib/admin/reader/save-work-episode';
import { ReaderFileInput } from './ReaderFileInput';
import { ReaderImagePreview } from './ReaderImagePreview';
import { mergeEpisodeFiles } from '../../../lib/admin/reader/episode-batch';
import { commonRelease, releaseFields, assignSchedule, needsPublication } from '../../../lib/admin/reader/work-schedule';
import { listReaderContent, mutateReaderContent, uploadReaderAsset, uploadSharedReaderCover, attachSharedReaderCover, deleteReaderContent, type ReaderContent } from '../../../lib/admin/firebase/reader-api';
const languages = ['ko','en','ja'] as const;
type Language = typeof languages[number];
const names = {ko:'한국어',en:'English',ja:'日本語'};
const input = 'w-full rounded-lg border border-slate-700 bg-slate-950 p-2';
const button = 'rounded-lg border border-slate-600 px-3 py-2 text-sm disabled:opacity-40';
type Entry = WorkEpisodeEntry;
type Row = {number:number; release:string | undefined; entries:Partial<Record<Language,Entry>>; common?:File; dirty:boolean};
async function children(parent:ReaderContent) {
  const items:ReaderContent[]=[]; let after:string|undefined; const seen=new Set<string>();
  do { const page=await listReaderContent('book',after,parent.id);items.push(...page.items);after=page.nextCursor||undefined;if(after && seen.has(after)) throw new Error('회차 목록을 끝까지 읽지 못했습니다.');if(after)seen.add(after); } while(after);
  return items;
}
export function UnifiedWorkEpisodes({parents,initialFiles,initialCommon,prepare,onDirty,onBusy}: {
  parents:ReaderContent[];initialFiles?:Partial<Record<Language,File[]>>;initialCommon?:File[];
  prepare:(publish:boolean,required:readonly Language[])=>Promise<ReaderContent[]>;onDirty:(value:boolean)=>void;onBusy:(value:boolean)=>void;
}) {
  const [rows,setRows]=useState<Row[]>(()=>{
    const map=new Map<number,Row>();
    for(const l of languages) for(const source of mergeEpisodeFiles([],initialFiles?.[l]||[],'',true).rows) {
      const n=Number(source.number);const row=map.get(n)||{number:n,release:'',entries:{},dirty:true};
      row.entries[l]={title:source.title,book:source.books[0],cover:source.covers[0]};map.set(n,row);
    }
    for(const source of mergeEpisodeFiles([],initialCommon||[],'',true).rows) {const row=map.get(Number(source.number));if(row)row.common=source.covers[0];}
    return [...map.values()].sort((a,b)=>a.number-b.number);
  });
  const [loading,setLoading]=useState(parents.length>0);
  const [loadError,setLoadError]=useState('');
  const [busy,setBusy]=useState(false);
  const locked=useRef(false);
  const [message,setMessage]=useState('');
  const [start,setStart]=useState('');const [interval,setInterval]=useState(1);
  const cache=useRef(new Map<File,string>());
  const initialParents=useRef(parents);
  const rowsRef=useRef(rows);rowsRef.current=rows;
  const dirty=rows.some(r=>r.dirty);
  useEffect(()=>{onDirty(dirty);},[dirty,onDirty]);
  async function load() {
    setLoading(true);setLoadError('');
    try {
      const all=(await Promise.all(initialParents.current.map(children))).flat();
      const map=new Map<number,Row>();
      for(const item of all) {const n=item.episodeNumber!;const row=map.get(n)||{number:n,release:'',entries:{},dirty:false};row.entries[item.language||'ko']={title:item.title,item};map.set(n,row);}
      for(const row of map.values())row.release=commonRelease(Object.values(row.entries).map(e=>e.item!));
      setRows(previous=>{
        for(const row of previous) {const existing=map.get(row.number);if(!existing)map.set(row.number,row);else if(row.dirty) {
          for(const l of languages) if(row.entries[l] && !existing.entries[l]) existing.entries[l]=row.entries[l];
          existing.common=row.common;existing.dirty=true;
        }}
        return [...map.values()].sort((a,b)=>a.number-b.number);
      });
    }catch(e){setLoadError((e as Error).message);}finally{setLoading(false);}
  }
  useEffect(()=>{if(initialParents.current.length)void load();},[]); // eslint-disable-line react-hooks/exhaustive-deps
  function change(n:number,patch:Partial<Row>) {setRows(rs=>rs.map(r=>r.number===n?{...r,...patch,dirty:true}:r));}
  function add(l:Language|'common',files:File[]) {
    const parsed=mergeEpisodeFiles([],files,'',true);
    if(parsed.rejected.length || parsed.rows.some(r=>!Number(r.number)||Number(r.number)>100000||r.books.length>1||r.covers.length>1)) {setMessage('01_제목.txt / 01.png처럼 회차 번호를 붙여 주세요. 같은 번호의 파일은 종류별 한 개만 넣으세요.');return;}
    setRows(previous=>{
      const map=new Map(previous.map(r=>[r.number,{...r,entries:{...r.entries}}]));
      for(const source of parsed.rows) {
        const n=Number(source.number);const row=map.get(n)||{number:n,release:'',entries:{},dirty:true};
        if(l==='common')row.common=source.covers[0];
        else {const old=row.entries[l];row.entries[l]={...old,title:source.books.length?source.title:old?.title||'',book:source.books[0]||old?.book,cover:source.covers[0]||old?.cover};}
        row.dirty=true;map.set(n,row);
      }return [...map.values()].sort((a,b)=>a.number-b.number);
    });setMessage('');
  }
  async function remove(row:Row) {
    if(!window.confirm(`${row.number}화의 세 언어 초안과 파일을 삭제할까요? 되돌릴 수 없습니다.`))return;
    if(locked.current)return;locked.current=true;setBusy(true);onBusy(true);
    const next={...row,entries:{...row.entries}};
    try{
      if(Object.values(row.entries).some(e=>e.item?.published||e.item?.publishedContent))throw new Error('공개 이력이 있는 회차는 초안 삭제할 수 없습니다.');
      for(const l of languages){const item=next.entries[l]?.item;if(item)await deleteReaderContent(item,true);delete next.entries[l];setRows(rs=>rs.map(r=>r.number===row.number?{...next}:r));}
      setRows(rs=>rs.filter(r=>r.number!==row.number));setMessage(`${row.number}화 초안을 삭제했습니다.`);
    }catch(e){setMessage((e as Error).message);}finally{locked.current=false;setBusy(false);onBusy(false);}
  }
  async function save(publish:boolean) {
    if(locked.current||loading||loadError)return;
    const work=rowsRef.current.filter(r=>r.dirty || (publish && Object.values(r.entries).some(e=>needsPublication(e.item))));
    if(publish&&!rowsRef.current.length){setMessage('공개할 원고를 넣어 주세요.');return;}
    try {
      for(const row of work) {
        if(!Number.isSafeInteger(row.number)||row.number<1||row.number>100000)throw new Error('회차 번호를 확인해 주세요.');
        if(row.release===undefined)throw new Error(`${row.number}화의 기존 언어별 일정이 다릅니다. 공통 공개일을 선택해 주세요.`);
        releaseFields(row.release);
        if(!Object.keys(row.entries).length)throw new Error(`${row.number}화에 원고가 없습니다.`);
        for(const e of Object.values(row.entries))if(!e.title.trim()||(!e.book&&!e.item?.assets.txt&&!e.item?.assets.epub))throw new Error(`${row.number}화 제목과 본문을 확인해 주세요.`);
      }
    }catch(e){setMessage((e as Error).message);return;}
    if(publish&&!window.confirm('전체 언어를 저장하고 공개할까요? 미래 공개일은 예약됩니다.'))return;
    locked.current=true;setBusy(true);onBusy(true);setMessage('작품과 회차를 저장하고 있습니다…');
    const next=rowsRef.current.map(r=>({...r,entries:{...r.entries}}));let failures=0;
    const commit=()=>setRows(next.map(r=>({...r,entries:{...r.entries}})));
    try {
      const savedParents=await prepare(publish,languages.filter(l=>rowsRef.current.some(r=>r.entries[l])));
      onBusy(true);
      for(const row of next) {
        if(!work.some(w=>w.number===row.number))continue;
        let rowFailed=false;
        for(const l of languages) {
          let e=row.entries[l];if(!e)continue;
          e={...e,error:undefined};row.entries[l]=e;
          try {
            const parent=savedParents.find(p=>(p.language||'ko')===l);
            if(!parent)throw new Error(`${names[l]} 작품 제목을 먼저 입력해 주세요.`);
            const metadata={...(e.item||{}),title:e.title.trim(),episodeNumber:row.number,author:parent.author,description:e.item?.description||'',license:parent.license,...releaseFields(row.release!)};
            await saveWorkEpisode(e,parent,metadata,row.common,{
              mutate:mutateReaderContent,upload:uploadReaderAsset,attach:attachSharedReaderCover,
              shared:async(file)=>{let hash=cache.current.get(file);if(!hash){hash=(await uploadSharedReaderCover(file)).hash;cache.current.set(file,hash);}return hash;}
            },commit);
          } catch(error){e.error=(error as Error).message;rowFailed=true;failures++;commit();}
        }
        // Save all translations of this episode before making any visible.
        if(publish&&!rowFailed)for(const l of languages){const e=row.entries[l];if(!e?.item)continue;try{e.item=await mutateReaderContent({action:'publish',id:e.item.id,revision:e.item.revision});commit();}catch(error){e.error=(error as Error).message;rowFailed=true;failures++;}}
        row.dirty=rowFailed;if(!rowFailed)row.common=undefined;commit();
      }
      setMessage(failures?`${failures}개 처리 실패. 성공한 파일은 저장되어 있습니다. 오류를 수정한 뒤 다시 저장하세요.`:publish?'모든 언어의 저장 및 예약·공개가 완료되었습니다.':'모든 언어의 원고·삽화·공개일을 임시 저장했습니다. 다시 열어 이어서 편집할 수 있습니다.');
    }catch(e){setMessage((e as Error).message);}finally{locked.current=false;setBusy(false);onBusy(false);}
  }
  return <section className="space-y-5 border-t border-slate-700 pt-5">
    <h2 className="text-lg font-semibold">회차와 공개 일정</h2>
    <p className="text-sm text-slate-400">같은 회차의 세 언어를 한 줄에서 확인합니다. 공개일은 공통으로 저장하며, 비워두면 공개 버튼을 누를 때 즉시 공개됩니다. 시간은 한국 시간입니다.</p>
    {loading&&<p>저장된 회차를 불러오는 중입니다…</p>}{loadError&&<p role="alert">{loadError} <button onClick={()=>void load()}>다시 확인</button></p>}
    <fieldset disabled={busy||loading||!!loadError} className="space-y-4">
      <details><summary className="cursor-pointer">원고·삽화 추가 또는 변경</summary><div className="mt-3 grid gap-3 lg:grid-cols-4">{(['common',...languages] as const).map(l=><label key={l}>{l==='common'?'공통 삽화':names[l]+' 원고·삽화'}<ReaderFileInput multiple accept={l==='common'?'.png,.jpg,.jpeg,.webp':'.txt,.epub,.png,.jpg,.jpeg,.webp'} onFiles={fs=>add(l,fs)}/></label>)}</div></details>
      <div className="flex flex-wrap items-end gap-3"><label>시작 일시<input type="datetime-local" className={input} value={start} onChange={e=>setStart(e.target.value)}/></label><label>간격 (일)<input className={input} type="number" min={1} max={31} value={interval} onChange={e=>setInterval(Number(e.target.value))}/></label><button className={button} onClick={()=>{try{const dates=assignSchedule(rows.map(r=>r.number),start,interval);if(rows.some(r=>Object.values(r.entries).some(e=>e.item?.publishedContent))&&!window.confirm('공개 이력이 있는 회차도 일정이 변경됩니다. 계속할까요?'))return;setRows(rs=>rs.map(r=>({...r,release:dates[r.number],dirty:true})));}catch(e){setMessage((e as Error).message);}}}>전체 회차에 일정 적용</button></div>
      <div className="space-y-4">{rows.map(row=><article key={row.number} className="rounded-lg border border-slate-700 p-4"><div className="mb-4 flex flex-wrap items-center gap-4"><strong>{row.number}화</strong><label className="text-sm">공통 공개일<input type="datetime-local" className={input} value={row.release?.slice(0,16)||''} onChange={e=>change(row.number,{release:e.target.value?e.target.value+':00+09:00':''})}/></label><button className={button} onClick={()=>change(row.number,{release:''})}>즉시 공개로 지정</button>{row.release===undefined&&<span className="text-amber-300">언어별 기존 일정이 다릅니다. 일정을 선택해 주세요.</span>}{!Object.values(row.entries).some(e=>e.item?.published||e.item?.publishedContent)&&<button className={`${button} ml-auto text-rose-300`} onClick={()=>void remove(row)}>회차 초안 삭제</button>}</div><div className="grid gap-4 lg:grid-cols-3">{languages.map(l=>{const e=row.entries[l];return <div key={l} className="min-w-0 space-y-2"><strong className="text-sm">{names[l]}</strong>{e?<><input aria-label={`${row.number}화 ${names[l]} 제목`} className={input} value={e.title} maxLength={160} onChange={event=>change(row.number,{entries:{...row.entries,[l]:{...e,title:event.target.value}}})}/><p className="break-all text-xs text-slate-400">{e.book?.name||(e.item?.assets.txt||e.item?.assets.epub?'본문 저장됨':'본문 없음')}</p>{(e.cover||row.common)&&<ReaderImagePreview compact file={e.cover||row.common}/>}<p className="text-xs">{e.cover?.name||row.common?.name||(e.item?.assets.cover?'삽화 저장됨':'작품 표지 사용')}</p><p className="text-xs">{row.dirty?'변경사항 저장 필요':e.item?.published?(needsPublication(e.item)?'변경사항 임시 저장됨 · 공개 대기':'예약·공개됨'):'임시 저장됨'}</p>{e.error&&<p role="alert" className="text-sm text-rose-300">{e.error}</p>}</>:<p className="text-sm text-slate-500">미등록 — 이 언어는 건너뜁니다.</p>}</div>;})}</div></article>)}</div>
      <div className="flex gap-3"><button className={button} onClick={()=>void save(false)}>전체 임시 저장</button><button className={`${button} bg-emerald-700`} onClick={()=>void save(true)}>전체 저장하고 예약·공개</button></div>
    </fieldset><p role="status" className="whitespace-pre-wrap">{message}</p>
  </section>;
}
