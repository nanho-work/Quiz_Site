"use client";
import {useEffect} from 'react';
const eventName='koofy-admin-before-leave';
export function requestAdminLeave():boolean {
 return window.dispatchEvent(new Event(eventName,{cancelable:true}));
}
/** Protect SPA navigation as well as browser reload while reader files are in memory. */
export function useReaderLeaveGuard(dirty:boolean,busy:boolean) {
 useEffect(()=>{
  const allow=()=>{
   if(busy){window.alert('저장·업로드가 진행 중입니다. 작업이 끝난 뒤 이동해 주세요.');return false;}
   return !dirty || window.confirm('저장하지 않은 파일과 입력을 닫고 이동할까요?');
  };
  const leave=(e:Event)=>{if(!allow())e.preventDefault();};
  const click=(e:MouseEvent)=>{
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const link=e.target instanceof Element?e.target.closest('a[href]'):null;
   if(!(link instanceof HTMLAnchorElement)||link.target==='_blank'||link.hasAttribute('download'))return;
   const next=new URL(link.href,location.href);
   if(next.origin===location.origin&&next.pathname===location.pathname&&next.search===location.search)return;
   if(!allow()){e.preventDefault();e.stopPropagation();}
  };
  const unload=(e:BeforeUnloadEvent)=>{if(dirty||busy){e.preventDefault();e.returnValue='';}};
  document.addEventListener('click',click,true);window.addEventListener(eventName,leave);window.addEventListener('beforeunload',unload);
  return()=>{document.removeEventListener('click',click,true);window.removeEventListener(eventName,leave);window.removeEventListener('beforeunload',unload);};
 },[dirty,busy]);
}
