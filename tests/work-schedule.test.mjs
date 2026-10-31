import test from 'node:test';
import assert from 'node:assert/strict';
import {commonRelease,releaseFields,assignSchedule,needsPublication} from '../lib/admin/reader/work-schedule.ts';
test('same episode uses one schedule; differing legacy dates require explicit resolution',()=>{
 const date='2026-11-01T09:00:00+09:00';
 assert.equal(commonRelease([{releaseAt:date},{releaseDate:'2026-11-01'},{releaseAt:date}]),date);
 assert.equal(commonRelease([{releaseAt:date},{}]),undefined);
 assert.equal(commonRelease([{},{}]),'');
});
test('clear persisted date explicitly and reject rolled-over date',()=>{
 assert.deepEqual(releaseFields(''),{releaseAt:'',releaseDate:''});
 assert.throws(()=>releaseFields('2026-02-30T09:00:00+09:00'));
 assert.deepEqual(releaseFields('2026-11-01T09:00:00+09:00'),{releaseAt:'2026-11-01T09:00:00+09:00',releaseDate:'2026-11-01'});
});
test('batch schedule is by unique episode, not language/file count, across month boundary',()=>{
 assert.deepEqual(assignSchedule([3,1,1,2,2,3],'2026-10-31T23:00',1),{1:'2026-10-31T23:00:00+09:00',2:'2026-11-01T23:00:00+09:00',3:'2026-11-02T23:00:00+09:00'});
 assert.throws(()=>assignSchedule([1],'2026-11-01T09:00',0));
});

test('saved edits to published episodes still need publication, also after reload',()=>{
 assert.equal(needsPublication({published:true,revision:8,publishedContent:{version:7}}),true);
 assert.equal(needsPublication({published:true,revision:8,publishedContent:{version:8}}),false);
 assert.equal(needsPublication({published:false,revision:8,publishedContent:{version:8}}),true);
 assert.equal(needsPublication(),true);
});
