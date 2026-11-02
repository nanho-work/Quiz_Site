/** Private, memory-only query cache. Account/endpoint are part of every key. */
const pages = new Map<string, {at:number; value:unknown}>();
const pending = new Map<string, Promise<unknown>>();
let revision = 0;
export const readerQueryRevision = () => revision;
export function clearReaderQueries() { revision++; pages.clear(); pending.clear(); }
export async function readerQuery<T>(key:string, load:()=>Promise<T>):Promise<T> {
  const cached=pages.get(key);
  if(cached&&Date.now()-cached.at<30000)return cached.value as T;
  const running=pending.get(key);if(running)return running as Promise<T>;
  const generation=revision;
  const task=load().then(value=>{if(revision===generation){pages.set(key,{at:Date.now(),value});if(pages.size>200)pages.delete(pages.keys().next().value!);}return value;});
  pending.set(key,task);
  try{return await task;}finally{if(pending.get(key)===task)pending.delete(key);}
}

const changes=new Map<string,Map<string,unknown>>();
export function rememberReaderWrites(namespace:string,data:unknown){
 if(!data||typeof data!=='object')return;
 const value=data as {id?:string;kind?:string;deleted?:boolean;items?:unknown[]};
 const records=changes.get(namespace)||new Map<string,unknown>();
 if(value.id&&value.deleted)records.set(value.id,null);
 else if(value.id&&value.kind)records.set(value.id,value);
 for(const item of value.items||[]){const record=item as {id?:string;kind?:string};if(record.id&&record.kind)records.set(record.id,record);}
 changes.set(namespace,records);
}
export function readerWrites(namespace:string){return changes.get(namespace)||new Map<string,unknown>();}
let sessionRevision=0;
const sessionListeners=new Set<()=>void>();
export const readerSessionRevision=()=>sessionRevision;
export function onReaderSessionCleared(listener:()=>void){sessionListeners.add(listener);return ()=>sessionListeners.delete(listener);}
export function clearReaderSession(){sessionRevision++;clearReaderQueries();changes.clear();for(const listener of sessionListeners)listener();}
