import test from 'node:test';
import assert from 'node:assert/strict';
import {saveWorkEpisode} from '../lib/admin/reader/save-work-episode.ts';
const parent={id:'parent'};
const metadata={title:'title',releaseAt:'2026-11-01T09:00:00+09:00',releaseDate:'2026-11-01'};
test('failed upload resumes saved item; schedule updates on retry and successful uploads not repeated',async()=>{
 const calls=[];let fail=true;let checkpoints=0;
 const entry={title:'title',book:{name:'01.txt'},cover:{name:'01.png'}};
 const api={mutate:async x=>{calls.push(x);return {id:'child',revision:(x.revision||0)+1,assets:{},...x.metadata};},upload:async(item,slot)=>{calls.push(slot);if(slot==='cover'&&fail)throw Error('network');return {...item,revision:item.revision+1};},shared:async()=>{throw Error('unexpected');},attach:async()=>{throw Error('unexpected');}};
 await assert.rejects(saveWorkEpisode(entry,parent,metadata,undefined,api,()=>checkpoints++));
 assert.equal(entry.item.id,'child');assert.equal(entry.book,undefined);assert.ok(entry.cover);
 fail=false;
 await saveWorkEpisode(entry,parent,{...metadata,releaseAt:'',releaseDate:''},undefined,api,()=>checkpoints++);
 assert.equal(calls.filter(x=>x.action==='create').length,1);
 assert.equal(calls.filter(x=>x==='book').length,1);
 assert.equal(calls.find(x=>x.action==='save').metadata.releaseAt,'');
 assert.equal(entry.cover,undefined);assert.equal(checkpoints,4);
});
test('common image never overwrites a language-specific image on retry',async()=>{
 const entry={title:'t',item:{id:'child',revision:4,assets:{cover:{path:'localized'}}}};
 const api={mutate:async x=>({...entry.item,revision:5,...x.metadata}),upload:async()=>{throw Error('unexpected');},shared:async()=>{throw Error('must not replace localized image');},attach:async()=>{throw Error('unexpected');}};
 await saveWorkEpisode(entry,parent,metadata,{name:'common.png'},api,()=>{});
 assert.equal(entry.item.assets.cover.path,'localized');
});

test('reports each operation before it starts',async()=>{
 const events=[];const entry={title:'t',book:{name:'t.txt'},cover:{name:'t.png'}};
 const api={mutate:async()=>{events.push('mutate');return {id:'i',assets:{}};},upload:async(item,slot)=>{events.push(slot);return item;}};
 await saveWorkEpisode(entry,parent,metadata,undefined,api,()=>{},stage=>events.push(stage));
 assert.deepEqual(events,['saving','mutate','body','book','image','cover']);
});

test('a replacement shared illustration updates an old shared asset, but identical retry skips attachment',async()=>{
 const entry={title:'t',item:{id:'child',revision:4,assets:{cover:{path:'readerSharedCovers/old/cover.png',sha256:'old'}}}};
 let attachments=0;
 const api={mutate:async()=>entry.item,upload:async()=>{throw Error('unexpected');},shared:async()=> 'new',attach:async item=>{attachments++;return {...item,assets:{cover:{path:'readerSharedCovers/new/cover.png',sha256:'new'}}};}};
 await saveWorkEpisode(entry,parent,metadata,{name:'new.png'},api,()=>{});
 await saveWorkEpisode(entry,parent,metadata,{name:'new.png'},api,()=>{});
 assert.equal(attachments,1);assert.equal(entry.item.assets.cover.sha256,'new');
});
