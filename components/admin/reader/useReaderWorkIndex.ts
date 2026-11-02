"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {listReaderWorks,readerCacheNamespace,type ReaderContent,type ReaderKind} from '../../../lib/admin/firebase/reader-api';
import {clearReaderQueries,readerQueryRevision,readerWrites,readerSessionRevision,onReaderSessionCleared} from '../../../lib/admin/reader/query-cache';
type Scope='general'|'monthly'|'novel';
type Snapshot={items:ReaderContent[];cursors:Record<string,string|undefined>;done:Record<string,boolean>;pages:number;at:number;revision:number};
const snapshots=new Map<string,Snapshot>();
onReaderSessionCleared(()=>snapshots.clear());
export function useReaderWorkIndex(kinds:ReaderKind[],scope:Scope,query:string) {
 const namespace=readerCacheNamespace();const types=kinds.join(',');const key=`${namespace}|${scope}|${types}`;
 const currentKey=useRef(key);currentKey.current=key;
 const initial=snapshots.get(key);
 const state=useRef<Snapshot>(initial||{items:[],cursors:{},done:{},pages:0,at:0,revision:-1});
 const [items,setItemsState]=useState<ReaderContent[]>(state.current.items);
 const [fetching,setFetching]=useState(false);const [error,setError]=useState('');
 const [complete,setComplete]=useState(kinds.every(kind=>state.current.done[kind]));
 const active=useRef(true);const running=useRef<Promise<void>|null>(null);
 const load=useCallback((reset=false):Promise<void>=>{
  if(running.current)return running.current;
  const session=readerSessionRevision();
  const task=(async()=>{
   if(!active.current||currentKey.current!==key)return;setFetching(true);setError('');
   const previous=state.current;
   const next:Snapshot=reset?{items:[],cursors:{},done:{},pages:0,at:0,revision:readerQueryRevision()}:{...previous,cursors:{...previous.cursors},done:{...previous.done},items:[...previous.items]};
   const result=new Map(next.items.map(item=>[item.id,item]));
   // Refresh only the portion already browsed, preserving its current order and scroll.
   const rounds=reset?Math.max(1,previous.pages):1;
   const seen=new Set<string>();
   for(let round=0;round<rounds || (!result.size&&!types.split(',').every(kind=>next.done[kind]));round++){
    const pages=await Promise.all(types.split(',').filter(kind=>!next.done[kind]).map(async type=>{
     const kind=type as ReaderKind;const page=await listReaderWorks(kind,scope,next.cursors[kind]);
     if(page.nextCursor&&(page.nextCursor===next.cursors[kind]||seen.has(`${kind}:${page.nextCursor}`)))throw new Error('목록의 다음 페이지를 확인하지 못했습니다.');
     if(page.nextCursor)seen.add(`${kind}:${page.nextCursor}`);
     return {kind,page};
    }));
    for(const {kind,page} of pages){for(const item of page.items)result.set(item.id,item);next.cursors[kind]=page.nextCursor||undefined;next.done[kind]=!page.nextCursor;}
    next.pages++;
   }
   if(session!==readerSessionRevision())return;
   for(const [id,change] of readerWrites(namespace)){
    if(change===null){result.delete(id);continue;}
    const item=change as ReaderContent;
    if(item.seriesId||item.deleting||!types.split(',').includes(item.kind))continue;
    const matches=scope==='general'?item.collectionType==='general'&&!item.issueMonth&&!item.publishedContent?.issueMonth:scope==='monthly'?!!(item.issueMonth||item.publishedContent?.issueMonth):!item.collectionType&&!item.issueMonth&&!item.publishedContent?.issueMonth;
    if(matches&&(!result.has(id)||result.get(id)!.revision<=item.revision))result.set(id,item);
    else if(!matches)result.delete(id);
   }
   next.items=[...result.values()];next.at=Date.now();next.revision=readerQueryRevision();
   if(active.current&&currentKey.current===key){state.current=next;snapshots.set(key,next);if(snapshots.size>20)snapshots.delete(snapshots.keys().next().value!);setItemsState(next.items);setComplete(types.split(',').every(kind=>next.done[kind]));}
  })().catch(error=>{if(active.current&&currentKey.current===key)setError(error instanceof Error?error.message:'목록을 불러오지 못했습니다.');throw error;}).finally(()=>{if(running.current===task)running.current=null;if(active.current&&currentKey.current===key)setFetching(false);});
  running.current=task;return task;
 },[key,scope,types,namespace]);
 useEffect(()=>{active.current=true;running.current=null;const saved=snapshots.get(key);state.current=saved||{items:[],cursors:{},done:{},pages:0,at:0,revision:-1};setItemsState(state.current.items);setComplete(types.split(',').every(kind=>state.current.done[kind]));
  if(!saved||saved.revision!==readerQueryRevision()||Date.now()-saved.at>=30000)void load(true).catch(()=>{});
  return()=>{active.current=false;};
 },[key,load]);
 useEffect(()=>{
  let stop=false;
  if(query.trim())void (async()=>{try{do{if(stop||types.split(',').every(kind=>state.current.done[kind]))return;await load();}while(!stop);}catch{/* Keep previous results and show retry. */}})();
  return()=>{stop=true;};
 },[query,load,types]);
 const setItems=useCallback((update:ReaderContent[]|((previous:ReaderContent[])=>ReaderContent[]))=>{
  const value=typeof update==='function'?update(state.current.items):update;
  state.current={...state.current,items:value};snapshots.set(key,state.current);setItemsState(value);
 },[key]);
 return {items,setItems,loading:fetching&&!items.length,fetching,error,complete,hasMore:!complete,loadMore:()=>load(),reload:()=>{clearReaderQueries();return load(true)}};
}
