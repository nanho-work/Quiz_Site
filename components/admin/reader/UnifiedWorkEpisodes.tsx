 'use client';
import {ReaderStatus,ReaderSectionHeading,readerButton,readerPrimaryButton} from './ReaderAdminUI';
import { useEffect, useRef, useState } from 'react';
import {saveWorkEpisode,type WorkEpisodeEntry} from '../../../lib/admin/reader/save-work-episode';
import {entryStatus,runCounts,type EpisodeStage} from '../../../lib/admin/reader/episode-status';
import { ReaderFileInput } from './ReaderFileInput';
import { ReaderImagePreview } from './ReaderImagePreview';
import { mergeEpisodeFiles } from '../../../lib/admin/reader/episode-batch';
import { commonRelease, releaseFields, assignSchedule, needsPublication } from '../../../lib/admin/reader/work-schedule';
import { listReaderContent, mutateReaderContent, uploadReaderAsset, uploadSharedReaderCover, attachSharedReaderCover, deleteReaderContent, type ReaderContent } from '../../../lib/admin/firebase/reader-api';
const languages = ['ko','en','ja'] as const;
type Language = typeof languages[number];
const names = {ko:'한국어',en:'English',ja:'日本語'};
const input = 'w-full rounded-lg border border-slate-700 bg-slate-950 p-2';
const button = readerButton;
type Entry = WorkEpisodeEntry;
type Row = {number:number; release:string | undefined; entries:Partial<Record<Language,Entry>>; common?:File; dirty:boolean};
async function children(parent:ReaderContent) {
  const items:ReaderContent[]=[]; let after:string|undefined; const seen=new Set<string>();
  do { const page=await listReaderContent('book',after,parent.id);items.push(...page.items);after=page.nextCursor||undefined;if(after && seen.has(after)) throw new Error('회차 목록을 끝까지 읽지 못했습니다.');if(after)seen.add(after); } while(after);
  return items;
}
export function UnifiedWorkEpisodes({parents,initialFiles,initialCommon,prepare,onDirty,onBusy,externalBusy=false}: {
  externalBusy?:boolean;parents:ReaderContent[];initialFiles?:Partial<Record<Language,File[]>>;initialCommon?:File[];
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
  const [stages,setStages]=useState<Record<string,Record<string,EpisodeStage>>>({});
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),30000);return ()=>clearInterval(timer);},[]);
  useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(locked.current){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[]);
  const counts=runCounts(stages);
  const stage=(n:number,l:Language,value:EpisodeStage)=>setStages(p=>({...p,[n]:{...p[n],[l]:value}}));
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
  function change(n:number,patch:Partial<Row>) {
    setStages(p=>{const next={...p};delete next[n];return next;});
    setRows(rs=>rs.map(r=>r.number!==n?r:{...r,...patch,dirty:true,entries:Object.fromEntries(Object.entries(patch.entries||r.entries).map(([l,e])=>[l,('release' in patch || !patch.entries || e!==r.entries[l as Language])?{...e,savedForRun:false,error:undefined}:e]))}));
  }
  function add(l:Language|'common',files:File[]) {
    const parsed=mergeEpisodeFiles([],files,'',true);
    if(parsed.rejected.length || parsed.rows.some(r=>!Number(r.number)||Number(r.number)>100000||r.books.length>1||r.covers.length>1)) {setMessage('01_제목.txt / 01.png처럼 회차 번호를 붙여 주세요. 같은 번호의 파일은 종류별 한 개만 넣으세요.');return;}
    setStages({});
    setRows(previous=>{
      const map=new Map(previous.map(r=>[r.number,{...r,entries:{...r.entries}}]));
      for(const source of parsed.rows) {
        const n=Number(source.number);const row=map.get(n)||{number:n,release:'',entries:{},dirty:true};
        if(l==='common'){row.common=source.covers[0];row.entries=Object.fromEntries(Object.entries(row.entries).map(([key,e])=>[key,{...e,savedForRun:false,error:undefined}])) as Row['entries'];}
        else {const old=row.entries[l];row.entries[l]={...old,savedForRun:false,error:undefined,title:source.books.length?source.title:old?.title||'',book:source.books[0]||old?.book,cover:source.covers[0]||old?.cover};}
        row.dirty=true;map.set(n,row);
      }return [...map.values()].sort((a,b)=>a.number-b.number);
    });setMessage('');
  }
  async function remove(row:Row) {
    if(!window.confirm(`${row.number}화의 등록된 모든 언어와 첨부 파일을 영구 삭제할까요? 이미 다운로드한 파일은 사용자 기기에 유지됩니다. 되돌릴 수 없습니다.`))return;
    if(locked.current||externalBusy)return;locked.current=true;setBusy(true);onBusy(true);
    const next={...row,entries:{...row.entries}};
    try{
      for(const l of languages){const item=next.entries[l]?.item;if(item)await deleteReaderContent(item);delete next.entries[l];setRows(rs=>rs.map(r=>r.number===row.number?{...next}:r));}
      setRows(rs=>rs.filter(r=>r.number!==row.number));setStages(p=>{const next={...p};delete next[row.number];return next;});setMessage(`${row.number}화를 삭제했습니다.`);
    }catch(e){setMessage((e as Error).message);}finally{locked.current=false;setBusy(false);onBusy(false);}
  }
  async function save(publish:boolean) {
    if(locked.current||externalBusy||loading||loadError)return;
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
    setStages(Object.fromEntries(work.map(r=>[r.number,Object.fromEntries(Object.entries(r.entries).map(([l,e])=>[l,e.savedForRun && (!publish||!needsPublication(e.item))?'done':'waiting']))])));
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
            if(e.savedForRun && !e.book && !e.cover){stage(row.number,l,publish&&needsPublication(e.item)?'waiting':'done');continue;}
            const parent=savedParents.find(p=>(p.language||'ko')===l);
            if(!parent)throw new Error(`${names[l]} 작품 제목을 먼저 입력해 주세요.`);
            const metadata={...(e.item||{}),title:e.title.trim(),episodeNumber:row.number,author:parent.author,description:e.item?.description||'',license:parent.license,...releaseFields(row.release!)};
            await saveWorkEpisode(e,parent,metadata,row.common,{
              mutate:mutateReaderContent,upload:uploadReaderAsset,attach:attachSharedReaderCover,
              shared:async(file)=>{let hash=cache.current.get(file);if(!hash){hash=(await uploadSharedReaderCover(file)).hash;cache.current.set(file,hash);}return hash;}
            },commit,value=>stage(row.number,l,value));
            e.savedForRun=true;stage(row.number,l,publish?'waiting':'done');commit();
          } catch(error){e.error=(error as Error).message;rowFailed=true;failures++;stage(row.number,l,'failed');commit();}
        }
        // Save all translations of this episode before making any visible.
        if(publish&&!rowFailed)for(const l of languages){
          const e=row.entries[l];if(!e?.item)continue;
          try{if(needsPublication(e.item)){stage(row.number,l,'publishing');e.item=await mutateReaderContent({action:'publish',id:e.item.id,revision:e.item.revision});}stage(row.number,l,'done');commit();}
          catch(error){e.error=(error as Error).message;rowFailed=true;failures++;stage(row.number,l,'failed');commit();}
        }
        if(rowFailed)for(const l of languages){const e=row.entries[l];if(e?.savedForRun && !e.error)stage(row.number,l,'done');}

        row.dirty=rowFailed;if(!rowFailed)row.common=undefined;commit();
      }
      setMessage(failures?`${failures}개 처리 실패. 성공한 파일은 저장되어 있습니다. 오류를 수정한 뒤 다시 저장하세요.`:publish?'모든 언어의 저장 및 예약·공개가 완료되었습니다.':'모든 언어의 원고·삽화·공개일을 임시 저장했습니다. 다시 열어 이어서 편집할 수 있습니다.');
    }catch(e){setMessage((e as Error).message);}finally{locked.current=false;setBusy(false);onBusy(false);}
  }
  return <section className="min-w-0 space-y-5 border-t border-slate-700 pt-5">
    <ReaderSectionHeading title="회차와 공개 일정" description="세 언어를 한 줄에서 확인하세요. 공개 일시는 한국 시간 기준이며, 비워두면 즉시 공개합니다."><span className="text-xs text-slate-400">전체 {rows.length}회차</span></ReaderSectionHeading>
    <div className="reader-save-bar sticky top-16 z-10 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite">전체 {rows.length}회{counts.total>0 && ` · 이번 작업 ${counts.total}회 · 완료 ${counts.done} · 처리 중 ${counts.running} · 대기 ${counts.waiting} · 실패 ${counts.failed}`}</p>
      <div className="flex gap-2"><button disabled={busy||externalBusy||loading||!!loadError} className={button} onClick={()=>void save(false)}>초안 저장</button><button disabled={busy||externalBusy||loading||!!loadError} className={readerPrimaryButton} onClick={()=>void save(true)}>{counts.failed?'미완료 항목 재시도 · 예약·공개':'일정대로 공개'}</button></div></div>
      {message&&<p role="status" className="text-sm text-slate-300">{message}</p>}
      {busy&&<p className="text-xs text-amber-200">처리 중에는 이 화면을 닫거나 이동하지 마세요. 다른 탭에서 작업할 수 있습니다.</p>}
    </div>
    {loading&&<p>저장된 회차를 불러오는 중입니다…</p>}{loadError&&<p role="alert">{loadError} <button onClick={()=>void load()}>다시 확인</button></p>}
    <fieldset disabled={busy||externalBusy||loading||!!loadError} className="min-w-0 space-y-4">
      <details><summary className="cursor-pointer">원고·삽화 추가 또는 변경</summary><div className="mt-3 grid gap-3 lg:grid-cols-4">{(['common',...languages] as const).map(l=><label key={l}>{l==='common'?'공통 삽화':names[l]+' 원고·삽화'}<ReaderFileInput multiple accept={l==='common'?'.png,.jpg,.jpeg,.webp':'.txt,.epub,.png,.jpg,.jpeg,.webp'} onFiles={fs=>add(l,fs)}/></label>)}</div></details>
      <div className="flex flex-wrap items-end gap-3"><label>시작 일시<input type="datetime-local" className={input} value={start} onChange={e=>setStart(e.target.value)}/></label><label>간격 (일)<input className={input} type="number" min={1} max={31} value={interval} onChange={e=>setInterval(Number(e.target.value))}/></label><button className={button} onClick={()=>{try{const dates=assignSchedule(rows.map(r=>r.number),start,interval);if(rows.some(r=>Object.values(r.entries).some(e=>e.item?.publishedContent))&&!window.confirm('공개 이력이 있는 회차도 일정이 변경됩니다. 계속할까요?'))return;setStages({});setRows(rs=>rs.map(r=>({...r,release:dates[r.number],dirty:true,entries:Object.fromEntries(Object.entries(r.entries).map(([l,e])=>[l,{...e,savedForRun:false,error:undefined}]))})));}catch(e){setMessage((e as Error).message);}}}>전체 회차에 일정 적용</button></div>
      <div className="reader-table-wrap">
      <table className="w-full min-w-[940px] table-fixed text-left text-sm">
        <caption className="sr-only">회차별 언어 파일과 공개 일정 및 처리 상태</caption>
        <thead className="bg-slate-900"><tr><th className="w-16 p-3">회차</th>{languages.map(l=><th className="p-3" key={l}>{names[l]}</th>)}<th className="w-60 p-3">공통 공개일 (한국 시간)</th><th className="w-44 p-3">진행 상태</th></tr></thead>
        <tbody>{rows.map(row=>{
          const entries=Object.values(row.entries);const active=languages.find(l=>['saving','body','image','publishing'].includes(stages[row.number]?.[l]));
          const failed=languages.filter(l=>row.entries[l]?.error);const status=entries.map(e=>entryStatus(e,row.dirty,undefined,now));
          const summary=active?names[active]+' · '+entryStatus(row.entries[active]!,row.dirty,stages[row.number]?.[active],now):failed.length?'일부 실패 · '+failed.map(l=>names[l]).join(', '):busy && Object.values(stages[row.number]||{}).includes('waiting')?'대기':new Set(status).size===1?status[0]||'원고 없음':'언어별 상태 확인';
          return <tr key={row.number} className="border-t border-slate-700 align-top" aria-label={`${row.number}화`}>
            <th scope="row" className="p-3">{row.number}화</th>
            {languages.map(l=>{const e=row.entries[l];return <td key={l} className="min-w-0 p-3">{e?<>
              <p className="reader-episode-title">{e.title||'제목 없음'}</p>
              <div className="mt-2"><ReaderStatus value={entryStatus(e,row.dirty,stages[row.number]?.[l],now)}/></div>
              <details className="reader-episode-details"><summary className="cursor-pointer text-xs text-slate-400">파일 확인·수정</summary>
                <input aria-label={`${row.number}화 ${names[l]} 제목`} className={input+' mt-2'} value={e.title} maxLength={160} onChange={event=>change(row.number,{entries:{...row.entries,[l]:{...e,title:event.target.value}}})}/>
                <p className="mt-2 break-all text-xs">{e.book?.name||(e.item?.assets.txt||e.item?.assets.epub?'본문 저장됨':'본문 없음')}</p>
                {(e.cover||row.common)&&<ReaderImagePreview compact file={e.cover||row.common}/>}
                <p className="break-all text-xs">{e.cover?.name||row.common?.name||(e.item?.assets.cover?'삽화 저장됨':'작품 표지 사용')}</p>
              </details>{e.error&&<p className="mt-2 break-words text-xs text-rose-300">{e.error}</p>}
            </>:<span className="text-slate-500">미등록</span>}</td>;})}
            <td className="p-3"><input aria-label={`${row.number}화 공통 공개일`} type="datetime-local" className={input} value={row.release?.slice(0,16)||''} onChange={e=>change(row.number,{release:e.target.value?e.target.value+':00+09:00':''})}/>
              <button className="mt-2 text-xs underline" onClick={()=>change(row.number,{release:''})}>즉시 공개로 지정</button>
              {row.release===undefined&&<p className="text-xs text-amber-300">언어별 일정이 다릅니다. 공통 일정을 선택해 주세요.</p>}</td>
            <td className="p-3"><ReaderStatus value={summary}/>
              <button className="mt-3 text-xs text-rose-300 underline" onClick={()=>void remove(row)}>회차 삭제</button>
            </td>
          </tr>;
        })}</tbody>
      </table></div>
    </fieldset>
  </section>;
}
