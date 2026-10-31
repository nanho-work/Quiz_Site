"use client";
import {useEffect,useRef,useState} from 'react';
import {BookImage} from 'lucide-react';
import {getReaderCoverPreview,type ReaderContent} from '../../../lib/admin/firebase/reader-api';
const previews=new Map<string,Promise<{url:string;expiresAt:number}>>();
async function coverUrl(item:ReaderContent) {
 const key=`${item.id}:${item.revision}:${item.assets.cover.sha256}`;
 let task=previews.get(key);
 if(task){try{const result=await task;if(result.expiresAt>Date.now()+15000)return result.url;}catch{/* Failed requests may be retried on the next mount. */}previews.delete(key);}
 task=getReaderCoverPreview(item);previews.set(key,task);
 try{const result=await task;if(previews.size>200)previews.delete(previews.keys().next().value!);return result.url;}
 catch(error){previews.delete(key);throw error;}
}
export function ReaderSavedCover({item}:{item:ReaderContent}) {
 const host=useRef<HTMLSpanElement>(null);const [url,setUrl]=useState('');const [failed,setFailed]=useState(false);
 const hasCover=!!item.assets.cover;const hash=item.assets.cover?.sha256;
 useEffect(()=>{
  let active=true;let started=false;setUrl('');setFailed(false);
  const load=()=>{if(started||!hasCover)return;started=true;void coverUrl(item).then(value=>{if(active)setUrl(value);}).catch(()=>{if(active)setFailed(true);});};
  let observer:IntersectionObserver|undefined;
  if(hasCover){if(typeof IntersectionObserver==='undefined')load();else{observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer?.disconnect();load();}},{rootMargin:'200px'});if(host.current)observer.observe(host.current);}}
  return()=>{active=false;observer?.disconnect();};
 },[item.id,item.revision,hash,hasCover]); // eslint-disable-line react-hooks/exhaustive-deps
 return <span ref={host} className="reader-saved-cover" title={failed?'표지 미리보기를 불러오지 못했습니다.':hasCover?'대표 표지':'대표 표지 미등록'}>
  {url&&!failed?
   // eslint-disable-next-line @next/next/no-img-element
   <img src={url} alt={`${item.title} 대표 표지`} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>:
   <span className="reader-cover-placeholder"><BookImage aria-hidden="true"/><span>{failed?'미리보기 불가':hasCover?'불러오는 중':'표지 없음'}</span></span>}
 </span>;
}
