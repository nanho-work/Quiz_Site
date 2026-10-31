import test from 'node:test';
import assert from 'node:assert/strict';
import {entryStatus,runCounts} from '../lib/admin/reader/episode-status.ts';
const now=Date.parse('2026-10-31T09:00:00+09:00');
test('published snapshot determines live versus scheduled, not unsaved release changes',()=>{
 const item={published:true,revision:2,releaseAt:'2020-01-01',publishedContent:{version:1,releaseAt:'2026-11-01T09:00:00+09:00'}};
 assert.equal(entryStatus({item},false,undefined,now),'공개 예약 · 2026-11-01 09:00 · 수정본 임시 저장');
 assert.equal(entryStatus({item:{...item,revision:1}},false,undefined,Date.parse('2026-11-01T09:01:00+09:00')),'공개 중');
});
test('pending edits, checkpoints, draft, upload and failures remain distinguishable',()=>{
 const e={item:{published:false}};
 assert.equal(entryStatus(e,true),'변경사항 미저장');
 assert.equal(entryStatus({...e,savedForRun:true},true),'임시 저장');
 assert.equal(entryStatus(e,true,'body'),'원고 업로드 중');
 assert.equal(entryStatus({...e,error:'network'},false),'실패 · 재시도 필요');
});
test('overall counts are episode counts and do not count a partially failed row as completed',()=>{
 assert.deepEqual(runCounts({1:{ko:'done',en:'done'},2:{ko:'done',en:'failed'},3:{ko:'image',en:'waiting'},4:{ko:'waiting'}}),{total:4,done:1,failed:1,running:1,waiting:1});
});
