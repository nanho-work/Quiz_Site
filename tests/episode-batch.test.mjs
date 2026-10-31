import test from 'node:test';
import assert from 'node:assert/strict';
import {parseEpisodeName, mergeEpisodeFiles, episodeIssues} from '../lib/admin/reader/episode-batch.ts';
const title='인어공주는 파도를 벤다';
const file=(name,size=100,lastModified=1)=>({name,size,lastModified});
test('Korean normalized filename extracts episode and title',()=>{assert.deepEqual(parseEpisodeName('인어공주는_파도를_벤다_001_물이_듣지_않는_날.txt'.normalize('NFD'),title),{key:'인어공주는 파도를 벤다 001 물이 듣지 않는 날',number:'1',title:'물이 듣지 않는 날'});});
test('separate drops pair body and cover, duplicate exact file is ignored',()=>{const body=file('001_첫날.txt'),cover=file('001_첫날.jpg');let r=mergeEpisodeFiles([], [body],title);r=mergeEpisodeFiles(r.rows,[cover,body],title);assert.equal(r.rows.length,1);assert.equal(r.rows[0].books.length,1);assert.equal(r.rows[0].covers.length,1);assert.deepEqual(episodeIssues(r.rows[0],r.rows,new Set()),[]);});
test('two different covers remain conflicts, never overwrite',()=>{const r=mergeEpisodeFiles([],[file('001_첫날.txt'),file('001_첫날.jpg'),file('001_첫날.png')],title);assert(episodeIssues(r.rows[0],r.rows,new Set()).includes('표지가 여러 개입니다'));});
test('same number but different filenames is flagged, not guessed',()=>{const r=mergeEpisodeFiles([],[file('001_첫날.txt'),file('001_다른날.jpg')],title);assert.equal(r.rows.length,2);assert(episodeIssues(r.rows[0],r.rows,new Set()).includes('목록 안 회차 번호 중복'));});
test('existing episodes and missing body block registration',()=>{const r=mergeEpisodeFiles([],[file('040_마지막.jpg')],title);const issues=episodeIssues(r.rows[0],r.rows,new Set([40]));assert(issues.includes('이미 등록된 회차'));assert(issues.includes('본문 없음'));});
test('unsupported, empty, oversized files are reported',()=>{const r=mergeEpisodeFiles([],[file('설정.md'),file('1_빈글.txt',0),file('2_큰표지.jpg',6*1024*1024)],title);assert.equal(r.rows.length,0);assert.equal(r.rejected.length,3);});
test('unparsed names require explicit number and missing cover is allowed',()=>{const r=mergeEpisodeFiles([],[file('제목만.txt')],title);assert(episodeIssues(r.rows[0],r.rows,new Set()).includes('회차 번호 확인'));r.rows[0].number='3';assert.deepEqual(episodeIssues(r.rows[0],r.rows,new Set()),[]);});
test('100 episodes match 100 covers across separate drops',()=>{let r=mergeEpisodeFiles([],Array.from({length:100},(_,i)=>file(`${String(i+1).padStart(3,'0')}_제목.txt`)),title);r=mergeEpisodeFiles(r.rows,Array.from({length:100},(_,i)=>file(`${String(i+1).padStart(3,'0')}_제목.jpg`)),title);assert.equal(r.rows.length,100);assert(r.rows.every(row=>episodeIssues(row,r.rows,new Set()).length===0));});
test('integrated batch matches Korean Japanese English numeric prefixes with differently named images', () => {
  for (const [body, cover] of [['1화_겨울.txt', '1화_표지.png'], ['第1話_冬.txt', '1_絵.png'], ['Episode 1_Winter.txt', '1_image.png']]) {
    const r = mergeEpisodeFiles([], [file(cover), file(body)], '', true);
    assert.equal(r.rows.length, 1); assert.equal(r.rows[0].number, '1');
    assert.equal(r.rows[0].books.length, 1); assert.equal(r.rows[0].covers.length, 1);
    assert.deepEqual(episodeIssues(r.rows[0], r.rows, new Set()), []);
  }
});
test('integrated collisions and existing episodes cannot silently overwrite', () => {
  const r = mergeEpisodeFiles([], [file('1화_첫글.txt'), file('1화_다른글.txt'), file('1_image.png')], '', true);
  assert.equal(r.rows.length, 1);
  assert(episodeIssues(r.rows[0], r.rows, new Set([1])).includes('본문이 여러 개입니다'));
  assert(episodeIssues(r.rows[0], r.rows, new Set([1])).includes('이미 등록된 회차'));
});
test('shared illustration numbers match differently titled Korean English Japanese bodies',()=>{
  const image=mergeEpisodeFiles([], [file('01.png')], '', true).rows[0];
  for(const name of ['01_바다 위의 세상.txt','01_The World Above.txt','01_海の上の世界.txt']) {
    const body=mergeEpisodeFiles([], [file(name)], '', true).rows[0];
    assert.equal(body.number,image.number);
    assert.equal(body.key,image.key);
  }
});
test('shared image selection preserves duplicate number conflicts for rejection',()=>{
  const rows=mergeEpisodeFiles([], [file('01.png'),file('1_other.jpg')], '', true).rows;
  assert.equal(rows.length,1);assert.equal(rows[0].covers.length,2);
});
