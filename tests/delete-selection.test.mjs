import test from 'node:test';
import assert from 'node:assert/strict';
import {planReaderDeletion,executeReaderDeletion} from '../lib/admin/reader/delete-selection.ts';
test('deleting a translated series resolves children and deletes them before all selected parents',async()=>{
 const parents=[{id:'ko',kind:'series'},{id:'en',kind:'series'}];const deleted=[],progress=[];
 const plan=await planReaderDeletion(parents,async p=>[{id:p.id+'1',kind:'book'}]);
 assert.equal(plan.children.length,2);
 await executeReaderDeletion(plan,async item=>deleted.push(item.id),(done,total)=>progress.push([done,total]));
 assert.deepEqual(deleted,['ko1','en1','ko','en']);assert.deepEqual(progress.at(-1),[4,4]);
});
test('failed child deletion stops before deleting its parent or remaining content',async()=>{
 const calls=[];const plan={parents:[{id:'parent'}],children:[{id:'child1'},{id:'child2'}]};
 await assert.rejects(executeReaderDeletion(plan,async item=>{calls.push(item.id);throw Error('storage');},()=>{}));
 assert.deepEqual(calls,['child1']);
});
test('preflight failure does not yield a partial deletion plan',async()=>{
 await assert.rejects(planReaderDeletion([{id:'parent',kind:'series'}],async()=>{throw Error('list failed');}));
});
test('a single-language book never includes other translations or asks for children',async()=>{
 const plan=await planReaderDeletion([{id:'en',kind:'book'},{id:'en',kind:'book'}],async()=>{throw Error('unexpected');});
 assert.deepEqual(plan.parents.map(x=>x.id),['en']);assert.deepEqual(plan.children,[]);
});
