// GitHub Pages serves the root files directly. This copy is only needed by
// the existing private preview, whose host requires a dist/ directory.
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const output=new URL('dist/',root);
const files=fs.readdirSync(root,{withFileTypes:true})
 .filter(entry=>entry.isFile()&&!['README.md','package.json'].includes(entry.name))
 .map(entry=>entry.name)
 .filter(name=>name==='.nojekyll'||/\.(html|css|js|mjs|json|md|svg|ico|png|jpe?g|webp|avif|gif|woff2?|ttf|otf)$/i.test(name));
if(!files.includes('index.html'))throw Error('Root index.html is missing');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output);
for(const name of files)fs.copyFileSync(new URL(name,root),new URL(name,output));
console.log(`Copied ${files.length} root assets for private hosting. GitHub Pages needs no build.`);
