import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as matching from '../engine.mjs';
import * as familyModel from '../family.mjs';
import * as populationModel from '../population.mjs';

// Exercise the real UI event handler and navigation against a small rendering
// port. This checks action ordering and the hash/layout race, not browser layout.
const events=[],frames=[],handlers={},allElements=new Map();
// The main heading is below the document top. Treating these as the same position
// used to hide the reset/deletion regression in this harness.
const target={setAttribute(){},focus(options){assert.equal(options?.preventScroll,true);events.push('focus');},scrollIntoView(){events.push('reveal');viewport.y=180;}};
const main={...target,querySelector:()=>target};
const elements=new Map([['#main',main],['#dialog',{close(){events.push('close-detail');}}],['#dog-notes',{addEventListener(){}}]]);
const photoHandlers={},photoContent={innerHTML:'',textContent:''};
const photoViewer={open:false,showModal(){this.open=true;},close(){this.open=false;photoHandlers.close?.();},addEventListener:(name,handler)=>{photoHandlers[name]=handler;}};
elements.set('#photo-viewer',photoViewer);elements.set('#photo-viewer-content',photoContent);
const viewport={y:2400};
const context=vm.createContext({
 ...matching,...familyModel,...populationModel,console,URL,AbortController,AbortSignal,
 document:{querySelector:s=>elements.get(s)||null,querySelectorAll:selector=>allElements.get(selector)||[],addEventListener:(name,handler)=>{handlers[name]=handler;}},
 window:{addEventListener:(name,handler)=>{handlers[name]=handler;},scrollTo:({top})=>{viewport.y=top;events.push('section-top');}},
 location:{hash:'#explore'},
 history:{scrollRestoration:'auto',pushState(_state,_title,hash){context.location.hash=hash;events.push('route');}},
 requestAnimationFrame:callback=>frames.push(callback),setTimeout:()=>0,clearTimeout(){},
 events
});
const path=process.argv[2]||new URL('../topdog.mjs',import.meta.url);
const source=fs.readFileSync(path,'utf8').replace(/^import .*\n/gm,'').replace(/\nboot\(\);\s*$/,'');
vm.runInContext(source,context);
vm.runInContext(`
 dogs=${fs.readFileSync(new URL('../dogs.json',import.meta.url),'utf8')};
 persist=()=>{};toast=()=>{};let detailHTML;modal=html=>{detailHTML=html;};
 render=()=>{currentView=location.hash.slice(1)||'explore';events.push('render:'+currentView);};
`,context);
const read=code=>JSON.parse(vm.runInContext(`JSON.stringify(${code})`,context));
function click(action,id,key,file){handlers.click({target:{closest:selector=>selector==='[data-action]'?{dataset:{action,id,key,file}}:null}});}
function assertRevealed(label){
 assert(events.includes('render:match'),label+': comparison must render immediately');
 assert.equal(viewport.y,0,label+': comparison must be revealed immediately');
 assert(events.indexOf('render:match')<events.indexOf('section-top'),label+': render must happen before scroll');
 assert(!events.includes('reveal'),label+': must not jump down to the section heading');
 // Model the browser reapplying the old gallery's scroll anchor before paint.
 viewport.y=1800;
 while(frames.length)frames.shift()();
 assert.equal(viewport.y,0,label+': post-layout anchoring cannot hide the comparison');
 events.length=0;viewport.y=1600;
}
// Hearts never select a top dog or start a comparison, and can save many breeds.
click('save','beagle');click('save','standard-poodle');
assert.deepEqual(read('p().saved'),['beagle','standard-poodle']);
assert.equal(read('p().top'),null);assert.equal(read('p().candidate'),null);
assert.equal(context.location.hash,'#explore');assert.equal(viewport.y,2400);
assert.equal(read('p().history.length'),0,'Hearts must not enter comparison undo history');
click('save','beagle');assert.deepEqual(read('p().saved'),['standard-poodle']);
click('pick','labrador-retriever');
assert.equal(read('p().top'),null,'A picture stages a contender without naming a top dog');
assert.equal(read('p().candidate'),'labrador-retriever');
assert.equal(read('sanitizeProfile(p(),new Set(dogs.map(d=>d.id))).candidate'),'labrador-retriever');
vm.runInContext('match()',context);
assert(!main.innerHTML.includes('YOUR TOP DOG'),'No top-dog label before the first comparison decision');
assert.equal((main.innerHTML.match(/class="heart-toggle/g)||[]).length>=2,true);

assert(read('p().challenger'));
assertRevealed('First selection from a scrolled gallery');
click('pick','standard-poodle');
assert.equal(read('p().challenger'),'standard-poodle');
assertRevealed('Selection from the lower challenger gallery on the same route');
click('vote','standard-poodle');
assert.equal(read('p().top'),'standard-poodle');
assert.equal(read('p().rounds'),1);
assert.equal(read('p().candidate'),null);
assert.deepEqual(read('p().saved'),['standard-poodle'],'Choosing a top dog does not add any extra hearts');
assert.notEqual(read('p().challenger'),'standard-poodle');
assertRevealed('Choose the challenger and reveal the next round');
const next=read('p().challenger');click('skip');
assert.notEqual(read('p().challenger'),next);
assertRevealed('Skip a challenger');
click('undo');
assert.equal(read('p().challenger'),next);
assertRevealed('Undo a skipped challenger');
click('winner');
assert.equal(read('p().winner'),true);
assertRevealed('Declare a winner');
click('continue');
assert.equal(read('p().winner'),false);
assertRevealed('Resume comparisons');
const html=read("card(dog('beagle'))");
assert.match(html,/class="heart-toggle[^>]*data-action="save"/,'Hearts must only save');
assert.match(html,/class="card-copy"[^>]*data-action="details"/,'Text must open details');
assert.match(html,/class="card-pick"[^>]*data-action="pick"/,'Photos must open comparison');
assert(!html.includes('pick-hint')&&!html.includes('pick-badge'),'No controls or badges over pictures');
assert(html.indexOf('class="heart-toggle')>html.indexOf('</div></button>'),'Heart belongs outside the picture button');
const existingTop=read('p().top'),existingPair=read('comparisonIds()');
click('details','beagle');
assert(read('detailHTML').includes('data-action="detail-pick"'));
assert.deepEqual(read('comparisonIds()'),existingPair,'Opening details must not change the comparison');
click('detail-pick','beagle');
assert.equal(read('p().top'),existingTop,'Compare from details must keep the current top dog');
assert.equal(read('p().challenger'),'beagle');
assertRevealed('Compare from dog details');
const readingPair=read('comparisonIds()');events.length=0;viewport.y=1300;
click('save','beagle');click('save',existingTop);click('save',existingTop);
assert.equal(read('p().top'),existingTop,'Heart and unheart cannot change the top dog');
assert.deepEqual(read('comparisonIds()'),readingPair,'Hearts must leave both contenders alone');
assert.equal(viewport.y,1300);assert(!events.includes('reveal'));assert(!events.some(e=>e.startsWith('render:')),'Heart updates cannot rerender comparison photos');

// Work down different dimensions without jumping or replacing the pair.
vm.runInContext("state.profiles=[newProfile('You')];state.active=0;p().top='labrador-retriever';p().challenger='bichon-frise';",context);
events.length=0;viewport.y=1600;
click('trait','labrador-retriever','size');
click('trait','bichon-frise','shedding');
assert.equal(read('p().traits.size.value'),'large');
assert.equal(read('p().traits.shedding.value'),'low');
assert.equal(read('p().challenger'),'bichon-frise','Trait picks must not swap the challenger mid-comparison');
assert.equal(viewport.y,1600,'Trait picks must preserve reading position');
assert(!events.includes('reveal'),'Trait picks must not navigate to the top');
assert.equal(read("criteriaSummary(nextDog(dogs,p()),p()).matched"),2,'The next challenger must match both selected preferences');
click('choose-look','bichon-frise','looks');
assert.equal(read('p().lookPick'),'bichon-frise');
assert.equal(read('p().challenger'),'bichon-frise');
click('trait-lock','labrador-retriever','size');
assert.equal(read('p().traits.size.locked'),true);
assert.equal(read("eligible(dog('bichon-frise'),p())"),false,'Explicit locks exclude conflicting contenders');
vm.runInContext('match()',context);
assert.equal(read('p().challenger'),'bichon-frise','Rendering a new lock must keep the pair stable');
assert(!main.innerHTML.includes('match-sidebar'),'No extra right panel');
assert(main.innerHTML.indexOf('id="comparison-decisions"')>main.innerHTML.indexOf('data-dimension="lifespan"'),'Final choices belong below the dimensions');
click('trait-lock','labrador-retriever','size');
assert.equal(read('p().traits.size.locked'),false);
assert.equal(read("eligible(dog('bichon-frise'),p())"),true);
events.length=0;click('vote','bichon-frise');
assert.equal(read('p().top'),'bichon-frise','An optional preference must not prevent choosing either dog');
assert.equal(read("fit(dog(p().challenger),p())"),1,'The new pair should use all dimensions picked');
assertRevealed('Final decision after mixed dimension picks');
const restored=read('sanitizeProfile(p(),new Set(dogs.map(d=>d.id)))');
assert.equal(restored.traits.size.value,'large');assert.equal(restored.traits.shedding.value,'low');
click('pick','standard-poodle');assertRevealed('Manually choose another challenger');
click('winner','standard-poodle');
assert.equal(read('p().top'),'standard-poodle','Either card can be declared the winner directly');
assert.equal(read('p().winner'),true);
assert(!read('p().saved').includes('standard-poodle'),'A winner is independent of the hearted list');
click('save','standard-poodle');click('undo');
assert(read('p().saved').includes('standard-poodle'),'Undoing a comparison must preserve later hearts');
assertRevealed('Undo without reverting hearts');
// Family shortlists stay independent of each member's one top dog.
vm.runInContext("state.profiles=[newProfile('Linus'),newProfile('Ada')];state.active=0;state.profiles[0].saved=['beagle','standard-poodle'];state.profiles[1].saved=['beagle'];currentView='family';ui.familyView='dogs';family();",context);
assert(main.innerHTML.includes('Liked by 2 · Everyone'));
assert(main.innerHTML.includes('Liked by 1'));
assert(main.innerHTML.includes('Linus')&&main.innerHTML.includes('Ada'));
assert.deepEqual(read('state.profiles.map(q=>q.top)'),[null,null]);
assert(!main.innerHTML.includes('Your top dog'),'Hearts cannot imply a family top dog');
vm.runInContext("state.profiles[0].traits.size={value:'large',breedId:'labrador-retriever',locked:true};state.profiles[1].traits.size={value:'small',breedId:'beagle',locked:true};",context);
const familyBefore=read('state');
click('family-filter',undefined,'people');
assert.equal((main.innerHTML.match(/data-family-person=/g)||[]).length,2);
assert.equal((main.innerHTML.match(/Locked criteria/g)||[]).length,2);
assert.equal((main.innerHTML.match(/Liked dogs/g)||[]).length,2);
click('family-filter',undefined,'criteria');
assert(main.innerHTML.includes('data-family-criterion="size"'));
assert(main.innerHTML.includes('Conflicting locks'));
assert(main.innerHTML.includes('Big dogs')&&main.innerHTML.includes('Small dogs'));
click('family-filter',undefined,'dogs');
assert(main.innerHTML.includes('Liked by 2 · Everyone'));
assert(main.innerHTML.includes('Outside'));
assert.deepEqual(read('state'),familyBefore,'Switching family views does not edit or switch a person');

vm.runInContext("ui.saved=true;ui.familyView='people';currentView='explore';",context);
assert.deepEqual(read('filtered().map(b=>b.id)').sort(),['beagle','standard-poodle']);
// Shared values are one criterion and highlight every dog that meets it.
vm.runInContext("state.profiles=[newProfile()];state.active=0;p().top='german-shorthaired-pointer';p().challenger='german-shepherd-dog';currentView='match';ui.saved=false;",context);
const pointer='german-shorthaired-pointer',shepherd='german-shepherd-dog';
const totalNodes=[pointer,shepherd,pointer,shepherd].map(id=>({dataset:{matchTotal:id},outerHTML:''}));
allElements.set('[data-match-total]',totalNodes);
const summaries=()=>read('comparisonIds().map(id=>criteriaSummary(dog(id),p()))');
const barkingRow=()=>read("dimensionRow('barking',dog(p().top),dog(p().challenger))");
assert.deepEqual(summaries(),[{matched:0,total:0},{matched:0,total:0}]);
events.length=0;viewport.y=1400;
click('trait',pointer,'barking');
assert.equal((barkingRow().match(/aria-pressed="true"/g)||[]).length,2,'Both equal values must be highlighted');
assert.deepEqual(summaries(),[{matched:1,total:1},{matched:1,total:1}]);
assert(totalNodes.every(node=>node.outerHTML.includes('<strong>1 of 1</strong>')),'Both summary locations must update immediately');
click('trait',shepherd,'barking');
assert.equal((barkingRow().match(/aria-pressed="true"/g)||[]).length,0,'Either shared button clears the same criterion');
assert.deepEqual(summaries(),[{matched:0,total:0},{matched:0,total:0}]);
click('trait',shepherd,'barking');click('trait',pointer,'grooming');
assert.deepEqual(summaries(),[{matched:2,total:2},{matched:1,total:2}],'Only exact selected categories count as matching aspects');
assert(totalNodes[0].outerHTML.includes('<strong>2 of 2</strong>'));
assert(totalNodes[1].outerHTML.includes('<strong>1 of 2</strong>'));
click('trait-lock',shepherd,'barking');click('trait',pointer,'barking');
assert.equal(read('p().traits.barking.locked'),true,'The matching dog cannot clear a locked criterion');
assert.deepEqual(summaries(),[{matched:2,total:2},{matched:1,total:2}],'Locks do not add another aspect');
click('choose-look',shepherd,'looks');
assert.deepEqual(summaries(),[{matched:2,total:3},{matched:2,total:3}],'Looks stays breed-specific even though both buttons have the same wording');
click('save',pointer);
assert.deepEqual(summaries(),[{matched:2,total:3},{matched:2,total:3}],'Hearts do not add criteria or points');
assert.equal(viewport.y,1400);assert(!events.includes('reveal'));
assert.deepEqual(read('comparisonIds()'),[pointer,shepherd],'Counting and shared picks must not swap contenders');
const restoredShared=read('sanitizeProfile(p(),new Set(dogs.map(d=>d.id)))');
assert.equal(restoredShared.traits.barking.value,'medium');assert.equal(restoredShared.traits.barking.locked,true);
vm.runInContext("p().prefs=['quiet','quiet'];",context);
assert.deepEqual(summaries(),[{matched:2,total:3},{matched:2,total:3}],'A legacy preference for the same aspect cannot be counted twice');
vm.runInContext('match()',context);
assert.equal((main.innerHTML.match(/data-match-total=/g)||[]).length,4,'Totals belong beside both names and above both final decisions');
console.log('Interaction checks passed: shared trait selections, live criterion totals, independent hearts and top dog, clean photo/detail actions, persistence, and stable comparison navigation. Browser layout is not tested by this harness.');

// Profile actions use the real storage boundary, confirmation handler and restore
// path. Verify irreversible removal without touching other people or other apps.
const stored=new Map([['unrelated-app','keep']]);let failStorage=false;
context.localStorage={
 getItem:key=>stored.get(key)??null,
 setItem(key,value){if(failStorage)throw Error('Storage blocked');stored.set(key,value);},
 removeItem(key){if(failStorage)throw Error('Storage blocked');stored.delete(key);}
};
for(const selector of ['#dialog-content','#add-profile','#rename-profile'])elements.set(selector,{});
vm.runInContext(`
 let lastToast='';toast=message=>{lastToast=message;};
 function seedProfiles(){
  state={profiles:['Linus','Ada','Danny'].map((name,i)=>({...newProfile(name),id:'person-'+i,
   top:'labrador-retriever',challenger:'beagle',prefs:['lowShed'],rules:['small'],
   traits:{size:{value:'small',breedId:'beagle',locked:true}},saved:['beagle'],cute:['beagle'],
   lookPick:'beagle',notes:{beagle:'A note'},seen:['beagle'],rounds:4,winner:true,
   history:[{...newProfile(name),id:'person-'+i,top:'standard-poodle'}]})),active:1};
  localStorage.setItem(KEY,JSON.stringify(state));
 }
 seedProfiles();
`,context);
assert(read('familySuggestions()').includes('Suggestions from your family preferences'));
const originalProfiles=read('state.profiles');
click('reset-profile');
assert(read('detailHTML').includes('Reset Ada’s choices?'));
assert.deepEqual(read('state.profiles'),originalProfiles,'Opening reset must not change data');
click('profiles');click('confirm-profile-action');
assert.deepEqual(read('state.profiles'),originalProfiles,'Cancel leaves choices intact');
click('reset-profile');click('confirm-profile-action');
assert.equal(read('p().id'),'person-1');assert.equal(read('p().name'),'Ada');
assert.deepEqual(read('state.profiles[0]'),originalProfiles[0]);
assert.deepEqual(read('state.profiles[2]'),originalProfiles[2]);
const emptyAda=read("({...newProfile('Ada'),id:'person-1'})");
assert.deepEqual(read('p()'),emptyAda,'Reset clears every field including history, retaining only identity');
assert.deepEqual(read('restoreState(localStorage.getItem(KEY)).profiles[1]'),emptyAda);
click('undo');assert.deepEqual(read('p()'),emptyAda,'Undo cannot resurrect a reset');
assert.equal(context.location.hash,'#explore');

vm.runInContext('seedProfiles()',context);
click('delete-profile');assert(read('detailHTML').includes('Delete Ada?'));
click('confirm-profile-action');
assert.deepEqual(read('state.profiles'),[originalProfiles[0],originalProfiles[2]]);
assert.equal(read('p().name'),'Danny','Deleting the active person selects a remaining person');
assert(!stored.get('topdog-family-v1').includes('Ada'),'Deleted profile must not survive storage');
assert.equal(read('familyComparison(dogs,state.profiles).people.length'),2);
click('delete-profile');click('confirm-profile-action');
assert.equal(read('p().name'),'Linus');assert.equal(read('state.active'),0);
click('delete-profile');click('confirm-profile-action');
assert.equal(read('state.profiles.length'),1);assert.equal(read('p().name'),'You');
assert(!stored.has('topdog-family-v1'),'Deleting the last person removes saved data');

vm.runInContext("seedProfiles();ui={search:'poodle',sizes:['small'],filters:['shed'],sort:'match',saved:true,familyView:'criteria'};detailId='beagle';",context);
click('clear-profiles');click('close');click('confirm-profile-action');
assert.equal(read('state.profiles.length'),3,'Dismissed clear-all cannot run');
const beforeFailure=read('state'),storedBeforeFailure=stored.get('topdog-family-v1');
click('clear-profiles');failStorage=true;click('confirm-profile-action');
assert.deepEqual(read('state'),beforeFailure,'Storage failure must leave current choices intact');
assert.equal(stored.get('topdog-family-v1'),storedBeforeFailure);
assert(read('lastToast').includes('Nothing was removed'));
failStorage=false;click('confirm-profile-action');
assert(!stored.has('topdog-family-v1'));assert.equal(stored.get('unrelated-app'),'keep');
assert.deepEqual(read('ui'),read('emptyUI()'));
assert(read('detailId===undefined'));assert.equal(elements.get('#dialog-content').textContent,'');
assert.equal(read('state.profiles.length'),1);assert.equal(read('p().name'),'You');
assert.deepEqual(read('p()'),read("({...newProfile(),id:p().id})"));
assert.equal(read('restoreState(localStorage.getItem(KEY)).profiles[0].name'),'You');
click('undo');assert.equal(read('p().top'),null);

vm.runInContext('seedProfiles()',context);stored.delete('topdog-family-v1');
handlers.storage({key:'topdog-family-v1',newValue:null});
assert.equal(read('p().name'),'You','An open tab must drop deleted data');
assert.equal(read('p().history.length'),0);assert(!stored.has('topdog-family-v1'));
console.log('Profile checks passed: cancel, reset, delete, last person, clear all, reload, undo, storage failure, and open-tab refresh.');

// Every destructive profile path must start Explore at the document top, whether
// the action began at the top or deep inside any of the three pages.
while(frames.length)frames.shift()();
for(const view of ['explore','match','family'])for(const y of [0,1800])for(const action of ['reset-profile','delete-profile','delete-last','clear-profiles']){
 vm.runInContext(`seedProfiles();${action==='delete-last'?'state.profiles=[state.profiles[0]];state.active=0;':''}`,context);
 context.location.hash=`#${view}`;vm.runInContext('render()',context);
 viewport.y=y;events.length=0;
 click(action==='delete-last'?'delete-profile':action);
 assert.equal(viewport.y,y,'Opening confirmation preserves the reading position');
 click('confirm-profile-action');
 const label=`${action} from ${view} at ${y}`;
 assert.equal(context.location.hash,'#explore',label);
 assert.equal(viewport.y,0,label+': page starts at the banner');
 assert(events.indexOf('render:explore')<events.indexOf('section-top'),label+': render before positioning');
 assert(!events.includes('reveal'),label+': no jump to the main heading');
 viewport.y=100;while(frames.length)frames.shift()();
 assert.equal(viewport.y,0,label+': old scroll anchor cannot move the page down');
}
vm.runInContext('seedProfiles()',context);
viewport.y=1300;events.length=0;
click('clear-profiles');click('close');click('confirm-profile-action');
assert.equal(viewport.y,1300,'Cancelling clear-all preserves the reading position');
click('clear-profiles');failStorage=true;click('confirm-profile-action');failStorage=false;
assert.equal(viewport.y,1300,'A failed clear-all preserves the reading position');
click('close');

// Both header tabs and links inside content use the same page-top transition.
for(const header of [true,false])for(const view of ['explore','match','family','explore']){
 events.length=0;viewport.y=1200;
 const before=read('state');
 const link={getAttribute:()=>`#${view}`,closest:selector=>header&&selector==='.site-head'?{}:null};
 let prevented=false;
 handlers.click({target:{closest:selector=>selector==='a[href]'?link:null},preventDefault(){prevented=true;}});
 assert(prevented);assert.equal(context.location.hash,`#${view}`);
 assert.equal(viewport.y,0);assert(events.includes('section-top'));assert(!events.includes('reveal'),'Header tabs do not scroll the section heading into view');
 viewport.y=100;while(frames.length)frames.shift()();assert.equal(viewport.y,0);
 assert.deepEqual(read('state'),before,'Navigation cannot change a family choice');
}
context.location.hash='#family';vm.runInContext('render()',context);
for(const key of ['people','dogs','criteria']){
 viewport.y=900;events.length=0;
 click('family-filter',undefined,key);
 assert.equal(read('ui.familyView'),key);
 assert.equal(viewport.y,900,'Changing the family view preserves the reading position');
 assert(!events.includes('reveal')&&!events.includes('section-top'));
}
assert(!source.includes('scrollIntoView'),'The app must not scroll down to content on a page transition');
console.log('Navigation checks passed: reset, deletion, last person and clear-all from every page; header/content links; family tabs; no downward content scrolling.');
const styles=fs.readFileSync(new URL('../topdog.css',import.meta.url),'utf8');
assert.match(styles,/\.site-head\{position:sticky;top:0;z-index:30\}/);
assert.match(styles,/\.comparison-names,\.family-tabs\{top:var\(--head-height\)\}/);
assert(source.includes("siteHead.getBoundingClientRect().height"),'Sticky offsets must follow the actual mobile header height');

// Only a second click inside details opens the full photo and its credits.
click('details','beagle');
const beforePhotoState=read('state'),beforePhotoDetails=read('detailHTML');
assert(beforePhotoDetails.includes('data-action="photo-full"'));
assert(!beforePhotoDetails.includes('data-credit='));
assert(!read("card(dog('beagle'))").includes('data-credit='));
assert(!read("fighter(dog('beagle'),true)").includes('data-credit='));
const alternate=read("dog('beagle').gallery.find(f=>f!==dog('beagle').photo)");
assert(alternate,'Fixture needs a second image');
const detailPhoto={dataset:{file:read("dog('beagle').photo")},src:''};elements.set('#detail-main',detailPhoto);
click('photo',undefined,undefined,alternate);assert.equal(detailPhoto.dataset.file,alternate);
context.document.activeElement={isConnected:true,focus(){events.push('photo-focus-return');}};
click('photo-full','beagle');
assert(photoViewer.open);assert(photoContent.innerHTML.includes('data-full-photo'));
assert(photoContent.innerHTML.includes(encodeURIComponent(alternate.replaceAll(' ','_'))),'The selected thumbnail carries its own Commons source');
assert(photoContent.innerHTML.includes('data-credit='));
const credit={dataset:{credit:alternate},textContent:'',href:''};allElements.set('a[data-credit]',[credit]);
context.testPhotoFile=alternate;
vm.runInContext("applyMetadata(testPhotoFile,{descriptionurl:source(testPhotoFile),extmetadata:{Artist:{value:'<a>Photo author</a>'},LicenseShortName:{value:'CC BY-SA 3.0'}}})",context);
assert.equal(credit.textContent,'Photo author · CC BY-SA 3.0');
assert(credit.href.endsWith(encodeURIComponent(alternate.replaceAll(' ','_'))));
allElements.delete('a[data-credit]');
click('photo-close');assert(!photoViewer.open);assert(events.includes('photo-focus-return'));
assert.equal(read('detailHTML'),beforePhotoDetails,'Closing full screen leaves dog details available');
assert.deepEqual(read('state'),beforePhotoState,'Photo browsing cannot change choices');
assert.equal(photoContent.textContent,'');
assert.match(read('populationMethod()'),/model|estimate/);
assert.equal(read('emptyUI().sort'),'popular');
assert.deepEqual(read('filtered().map(populationCount)'),read('filtered().map(populationCount).sort((a,b)=>b-a)'));
console.log('Navigation and photo checks passed: stationary header, measured sticky offsets, full-screen selected photo, credits only in viewer, and unchanged choices.');

// The mixed/village group includes Singapore Specials once, with no invented
// category-wide temperament or false matches against a family's hard locks.
vm.runInContext("state=emptyState();ui=emptyUI();ui.search='Singapore special';",context);
assert.deepEqual(read('filtered().map(b=>b.id)'),['mixed-breed-dogs']);
vm.runInContext("ui.sizes=['small'];",context);
assert.equal(read('filtered().length'),1,'The mixed group can include small individual dogs');
vm.runInContext("ui.filters=['shed'];",context);
assert.equal(read('filtered().length'),0,'Unknown shedding cannot pass a low-shedding filter');
vm.runInContext("ui=emptyUI();ui.sort='small';",context);
assert.equal(read('filtered().at(-1).id'),'mixed-breed-dogs','Unknown size is not labeled as the smallest');
vm.runInContext("ui.sort='popular';",context);
assert.equal(read('filtered()[0].id'),'mixed-breed-dogs');
click('pick','mixed-breed-dogs');
assert.equal(read('p().top'),null);assert.equal(read('p().candidate'),'mixed-breed-dogs');
click('trait','mixed-breed-dogs','shedding');
assert.deepEqual(read('p().traits'),{});
click('save','mixed-breed-dogs');assert(read("p().saved.includes('mixed-breed-dogs')"));
click('vote','mixed-breed-dogs');assert.equal(read('p().top'),'mixed-breed-dogs');
vm.runInContext("p().prefs=['lowShed','calm'];p().rules=['lowShed'];",context);
assert.equal(read("fit(dog('mixed-breed-dogs'),p())"),0);
assert.equal(read("eligible(dog('mixed-breed-dogs'),p())"),false);
assert.deepEqual(read("criteriaSummary(dog('mixed-breed-dogs'),p())"),{matched:0,total:2,unknown:2});
assert(read("matchTotal(dog('mixed-breed-dogs'))").includes('2 unknown'));
assert(read("decisionCards(dog('mixed-breed-dogs'),dog('beagle'))").includes('Locks need an individual dog'));
const mixedRow=read("dimensionRow('shedding',dog('mixed-breed-dogs'),dog('beagle'))");
assert(mixedRow.includes('Varies by dog'));assert(!mixedRow.includes('data-id="mixed-breed-dogs"'),'Unknown traits are not selectable');
click('details','mixed-breed-dogs');
assert(read('detailHTML').includes('Meet Singapore Specials'));
assert(!read('detailHTML').includes('class="stat-track"'),'No fabricated rating bars for mixed dogs');
assert(!read('detailHTML').includes('classic.html#breed/mixed-breed-dogs'),'New categories must not link to nonexistent classic pages');
assert(read('populationCheck()').includes('Catalog total'));
assert(read('populationDetail(dog("mixed-breed-dogs"))').includes('not a measured share'));
console.log('Mixed-dog checks passed: search aliases, independent liking and winner choice, unknown traits, truthful filtering, and no duplicated population.');
