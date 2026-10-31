const fs=require('fs'),path=require('path'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),out=fs.mkdtempSync(path.join(require('os').tmpdir(),'reader-selection-'));
try {
for(const rel of ['lib/admin/reader/file-selection.ts','lib/admin/reader/episode-batch.ts','lib/admin/firebase/book-file-pair.ts']){
 let code=ts.transpileModule(fs.readFileSync(path.join(root,rel),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 code=code.replace(/from ['"](?:\.\/|\.\.\/reader\/)file-selection['"]/g,"from './file-selection.mjs'");
 fs.writeFileSync(path.join(out,path.basename(rel,'.ts')+'.mjs'),code);
}
for(const name of ['file-selection','episode-batch','book-file-pair']){
 let code=fs.readFileSync(path.join(root,'tests',name+'.test.mjs'),'utf8').replace(/\.\.\/lib\/admin\/(?:reader|firebase)\/([^']+)\.ts/g,'./$1.mjs');
 fs.writeFileSync(path.join(out,name+'.test.mjs'),code);
}
require('child_process').execFileSync(process.execPath,['--test',...['file-selection','episode-batch','book-file-pair'].map(n=>path.join(out,n+'.test.mjs'))],{stdio:'inherit'});

} finally { fs.rmSync(out,{recursive:true,force:true}); }
