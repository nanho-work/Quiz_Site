import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFileSelection, mergeSelectedFiles, READER_FILE_ACCEPT as accept } from '../lib/admin/reader/file-selection.ts';
const f = (name, size = 1, lastModified = 1) => ({name,size,lastModified});
test('single and batch limits reject entire invalid selections', () => {
 assert.match(validateFileSelection([f('a.png'),f('b.png')],accept.image), /한 개/);
 assert.equal(validateFileSelection([f('a.TXT',20*1024*1024),f('a.PNG',5*1024*1024)],accept.content,true),null);
 assert.ok(validateFileSelection([f('a.txt'),f('a.exe')],accept.content,true));
 assert.ok(validateFileSelection([f('a.png',0)],accept.image));
 assert.ok(validateFileSelection([f('a.png',5*1024*1024+1)],accept.image));
 assert.ok(validateFileSelection(Array.from({length:1001},(_,i)=>f(i+'.txt')),accept.body,true));
 assert.equal(validateFileSelection([f('font.ttf',10*1024*1024)],accept.font),null);
});
test('separate selections retain files and normalized re-selection replaces the same filename', () => {
 const original=f('겨울.txt'), other=f('01.png'), replacement=f('겨울.txt'.normalize('NFD'),2,2);
 const merged=mergeSelectedFiles([original,other],[replacement]);
 assert.deepEqual(merged,[replacement,other]);
 assert.deepEqual(mergeSelectedFiles(merged,[other]),merged);
});
