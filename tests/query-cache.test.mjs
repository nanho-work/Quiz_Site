import test from 'node:test';
import assert from 'node:assert/strict';
import {readerQuery,clearReaderQueries,clearReaderSession,readerWrites,rememberReaderWrites,readerSessionRevision} from '../lib/admin/reader/query-cache.ts';
test('parallel pages are deduplicated and account namespaces remain isolated',async()=>{
 clearReaderSession();let calls=0;let finish;const waiting=new Promise(resolve=>finish=resolve);
 const load=async()=>{calls++;await waiting;return {items:[1]}};
 const one=readerQuery('endpoint|alice|page',load),two=readerQuery('endpoint|alice|page',load);
 assert.equal(calls,1);finish();assert.deepEqual(await one,await two);
 await readerQuery('endpoint|alice|page',load);assert.equal(calls,1);
 await readerQuery('endpoint|bob|page',load);assert.equal(calls,2);
});
test('mutation invalidation cannot be overwritten by a slower previous request',async()=>{
 clearReaderSession();let finish;const old=readerQuery('alice|page',()=>new Promise(resolve=>finish=resolve));
 clearReaderQueries();assert.equal(await readerQuery('alice|page',async()=>'fresh'),'fresh');finish('old');await old;
 assert.equal(await readerQuery('alice|page',async()=>'wrong'),'fresh');
});
test('failed requests retry; session changes clear private writes and pending cache generations',async()=>{
 clearReaderSession();await assert.rejects(readerQuery('page',async()=>{throw new Error('offline')}));
 assert.equal(await readerQuery('page',async()=>7),7);
 rememberReaderWrites('alice',{items:[{id:'new',kind:'book',revision:2}]});rememberReaderWrites('alice',{id:'removed',deleted:true});
 assert.equal(readerWrites('alice').get('new').revision,2);assert.equal(readerWrites('alice').get('removed'),null);assert.equal(readerWrites('bob').size,0);
 const before=readerSessionRevision();clearReaderSession();assert.equal(readerWrites('alice').size,0);assert.equal(readerSessionRevision(),before+1);
});
