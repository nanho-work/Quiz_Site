import test from 'node:test';
import assert from 'node:assert/strict';
import {collectEpisodePages} from '../lib/admin/reader/episode-pages.ts';
test('reads all episode pages including empty intermediate pages',async()=>{
 const calls=[];
 const pages={first:{items:[{id:1}],nextCursor:'two'},two:{items:[],nextCursor:'three'},three:{items:[{id:2}],nextCursor:null}};
 const items=await collectEpisodePages(async after=>{calls.push(after);return pages[after||'first'];});
 assert.deepEqual(items,[{id:1},{id:2}]);assert.deepEqual(calls,[undefined,'two','three']);
});
test('repeated cursors and server failures do not return a misleading partial list',async()=>{
 await assert.rejects(()=>collectEpisodePages(async()=>({items:[],nextCursor:'same'})),/끝까지/);
 await assert.rejects(()=>collectEpisodePages(async()=>{throw new Error('network');}),/network/);
});
