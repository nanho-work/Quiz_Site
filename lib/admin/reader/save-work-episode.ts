import type {ReaderContent,ReaderMetadata} from '../firebase/reader-api';
export interface WorkEpisodeEntry {title:string;book?:File;cover?:File;item?:ReaderContent;error?:string}
type API = {
 mutate: (input: {action:'save';id:string;revision:number;metadata:ReaderMetadata}|{action:'create';kind:'book';seriesId:string;metadata:ReaderMetadata})=>Promise<ReaderContent>;
 upload:(item:ReaderContent,slot:string,file:File)=>Promise<ReaderContent>;
 shared:(file:File)=>Promise<string>;
 attach:(item:ReaderContent,hash:string)=>Promise<ReaderContent>;
};
/** Checkpoint every successful mutation so retries resume without creating duplicates. */
export async function saveWorkEpisode(entry:WorkEpisodeEntry,parent:ReaderContent,metadata:ReaderMetadata,common:File|undefined,api:API,checkpoint:()=>void) {
 entry.item=await api.mutate(entry.item?{action:'save',id:entry.item.id,revision:entry.item.revision,metadata}:{action:'create',kind:'book',seriesId:parent.id,metadata});checkpoint();
 if(entry.book){entry.item=await api.upload(entry.item,'book',entry.book);entry.book=undefined;checkpoint();}
 if(entry.cover){entry.item=await api.upload(entry.item,'cover',entry.cover);entry.cover=undefined;checkpoint();}
 else if(common && !entry.item.assets.cover){entry.item=await api.attach(entry.item,await api.shared(common));checkpoint();}
}
