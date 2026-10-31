import type {WorkEpisodeEntry} from './save-work-episode';
export type EpisodeStage = 'waiting'|'saving'|'body'|'image'|'publishing'|'done'|'failed';
const labels:Record<EpisodeStage,string>={waiting:'대기',saving:'저장 중',body:'원고 업로드 중',image:'삽화 업로드 중',publishing:'공개 처리 중',done:'완료',failed:'실패 · 재시도 필요'};
export function entryStatus(entry:WorkEpisodeEntry,dirty:boolean,stage?:EpisodeStage,now=Date.now()):string {
 if(stage && stage!=='done')return labels[stage];
 if(entry.error)return labels.failed;
 if(dirty && !entry.savedForRun && stage!=='done')return entry.item?'변경사항 미저장':'미저장';
 const item=entry.item;
 if(!item)return '미저장';
 if(!item.published)return '임시 저장';
 const snapshot=item.publishedContent;
 const release=snapshot?.releaseAt || (snapshot?.releaseDate?snapshot.releaseDate+'T09:00:00+09:00':'');
 const live=release&&Date.parse(release)>now?'공개 예약 · '+release.slice(0,16).replace('T',' '):'공개 중';
 return item.revision!==snapshot?.version?live+' · 수정본 임시 저장':live;
}
export function runCounts(stages:Record<string,Record<string,EpisodeStage>>) {
 const rows=Object.values(stages).map(Object.values);
 return {total:rows.length,done:rows.filter(s=>s.length&&s.every(v=>v==='done')).length,
 failed:rows.filter(s=>s.includes('failed')).length,
 running:rows.filter(s=>s.some(v=>['saving','body','image','publishing'].includes(v))).length,
 waiting:rows.filter(s=>s.includes('waiting')&&!s.some(v=>['saving','body','image','publishing','failed'].includes(v))).length};
}
