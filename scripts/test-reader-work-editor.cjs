/* Render the real shared editor with mutations disabled. No backend calls or credentials. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const root = path.resolve(__dirname, '..');
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, 'utf8');
    module._compile(ts.transpileModule(source, {compilerOptions: {
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    }}).outputText, filename);
  };
}
const apiPath = path.join(root, 'lib/admin/firebase/reader-api.ts');
const api = new Module(apiPath);
api.exports = new Proxy({}, {get: (_, name) => {
  if (name === '__esModule') return true;
  return () => {throw new Error(`Unexpected backend access during editor render: ${String(name)}`);};
}});
require.cache[apiPath] = api;
const {WorkEditor} = require('../components/admin/reader/WorkTranslations.tsx');
const noop = () => {};
const parent = {id:'existing-parent',kind:'series',language:'ko',title:'기존 연재 작품',
  author:'작가',description:'기존 소개',license:'기존 이용조건',category:'소설',source:'',
  seriesStatus:'ongoing',revision:4,published:true,assets:{},publishedContent:null};
const render = (props) => renderToStaticMarkup(React.createElement(WorkEditor, {
  initial:[parent],kind:'series',candidates:[],onDirty:noop,setBusy:noop,reload:async()=>{},...props,
}));
const general = render({general:true});
const novel = render({general:false});
assert.equal(novel, general, 'Novel and general serial works must render the identical editor');
for (const title of ['작품 정보','회차와 공개 일정','공통 삽화','한국어','English','日本語','공통 공개일','회차별 언어 파일과 공개 일정 및 처리 상태','삭제 관리']) {
  assert.ok(novel.includes(title), `Missing shared editor section: ${title}`);
}
assert.ok(!novel.includes('일괄등록 언어'), 'Language tabs must not replace the shared episode table');
assert.ok(!novel.includes('회차 등록·일괄등록'), 'Old settings/episodes navigation must not remain');
const single = render({general:true,kind:'book',initial:[{...parent,kind:'book'}]});
assert.ok(!single.includes('회차와 공개 일정'), 'Single-volume books must not render episode management');
assert.ok(single.includes('공통 공개일'), 'Single-volume scheduling must remain available');
console.log('Shared work editor: serial novel/general book parity, language columns, schedules, delete actions and single-volume isolation passed.');
