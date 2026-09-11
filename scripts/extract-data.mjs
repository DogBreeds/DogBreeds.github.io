import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root=new URL('../',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,root),'utf8');
const noop=()=>{};
const ctx=vm.createContext({console,document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop},window:{addEventListener:noop},location:{hash:''},setTimeout:noop,MutationObserver:class{observe(){}}});
for(const f of ['breeds.js','extra-breeds.js','extra-breeds-2.js','extra-breeds-3.js']) vm.runInContext(read(f),ctx,{filename:f});
// Read the original data declarations without starting the original UI.
vm.runInContext(read('app.js').split('const primaryPhotoCache')[0],ctx);
for(const f of ['site-patches.js','photo-overrides.js','review-updates.js','review-fixes-2.js','rough-collie.js','review-fixes-3.js','extra-breeds-2-ui.js','extra-breeds-3-ui.js','chesapeake-photos.js','chesapeake-final.js']) vm.runInContext(read(f),ctx,{filename:f});
const data=vm.runInContext('BREEDS.map(b=>({...b,gallery:CURATED_GALLERY[b.id]||[],variations:AKC_VARIATIONS[b.id]||null}))',ctx);
data.find(b=>b.id==='standard-poodle').photo='Red Standard Poodle.jpg';
data.push(...JSON.parse(fs.readFileSync(new URL('../data/additional-dogs.json',import.meta.url),'utf8')));
fs.writeFileSync(new URL('dogs.json',root),JSON.stringify(data));
const files=[...new Set(data.flatMap(b=>[b.photo,...b.gallery]))];
const urls=Object.fromEntries(files.map(f=>{const n=f.replaceAll(' ','_'),h=crypto.createHash('md5').update(n).digest('hex'),u=encodeURIComponent(n);return [f,`https://thumb.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0,2)}/${u}/500px-${u}`];}));
fs.writeFileSync(new URL('photo-urls.json',root),JSON.stringify(urls));
console.log(JSON.stringify({breeds:data.length,photos:data.filter(b=>b.photo).length,ids:data.map(b=>b.id)}));
