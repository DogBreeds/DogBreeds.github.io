import {DIMENSIONS,chooseTrait,toggleTraitLock,criteriaSummary,preferenceLabels,PREFERENCES,RULES,eligible,browseOrder,fit,rank,nextDog,reasons,tensions,newProfile,sanitizeProfile,familyRanking} from './engine.mjs';
import {familyComparison} from './family.mjs';
import {population,formatPopulation,POPULATION_BALANCE} from './population.mjs';
const $=s=>document.querySelector(s),main=$('#main'),dialog=$('#dialog'),KEY='topdog-family-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',search:'m21 21-4.3-4.3 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0',trophy:'M8 21h8 M12 17v4 M7 3h10v6a5 5 0 0 1-10 0V3Z M7 5H4v3a4 4 0 0 0 4 4 M17 5h3v3a4 4 0 0 1-4 4',arrow:'M5 12h14 m-6-6 6 6-6 6',bolt:'m13 2-9 12h7l-1 8 10-12h-7l1-8Z',size:'M4 4h16v16H4Z M8 4v4 M12 4v3 M16 4v4 M4 12h3 M4 16h4',people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',paw:'M9 14c-2 1-4 3-3 5s4 1 6 1 5 1 6-1-1-4-3-5c-2-2-4-2-6 0 M5 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M18 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M23 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',brush:'m14 3 7 7-10 10H4v-7L14 3Z m-6 7 7 7 M4 16l4 4',brain:'M12 18V5 M12 5c-3-5-8 0-6 3-5 0-5 7-1 8-1 6 6 6 7 2 M12 5c3-5 8 0 6 3 5 0 5 7 1 8 1 6-6 6-7 2',volume:'m11 5-6 4H2v6h3l6 4V5Z M16 9l5 6 M21 9l-5 6',moon:'M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z',flag:'M4 22V3 m0 0c5-4 11 4 16 0v11c-5 4-11-4-16 0',undo:'M3 10h11a6 6 0 0 1 0 12 M3 10l5-5 M3 10l5 5',filter:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M9 15v6',check:'m5 12 4 4L19 6',plus:'M12 5v14 M5 12h14',book:'M12 7c-3-3-8-3-10-2v15c3-2 7-1 10 1 3-2 7-3 10-1V5c-2-1-7-1-10 2Z M12 7v14',clock:'M12 8v4l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',globe:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M2 12h20 M12 2c-6 7-6 13 0 20 6-7 6-13 0-20',shuffle:'m4 4 16 16 M16 20h4v-4 M4 20l6-6 M14 10l6-6 M16 4h4v4'};
paths.lock='M7 10V7a5 5 0 0 1 10 0v3 M5 10h14v11H5Z M12 14v3';
paths.unlock='M7 10V7a5 5 0 0 1 9-3 M5 10h14v11H5Z M12 14v3';
const icon=(k,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[k]||paths.paw}"/></svg>`;
const source=f=>`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(f.replaceAll(' ','_'))}`;
let photoURLs={};
const redirectPhoto=f=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(f)}?width=500`;
const photo=f=>photoURLs[f]||redirectPhoto(f);
const emptyState=()=>({profiles:[newProfile()],active:0});
const emptyUI=()=>({search:'',sizes:[],filters:[],sort:'popular',saved:false,familyView:'people'});
let dogs=[],state=emptyState(),ui=emptyUI(),currentView='explore',storageOK=true,toastTimer,detailId,pendingProfileAction=null;
const p=()=>state.profiles[state.active],dog=id=>dogs.find(d=>d.id===id),humanSize=b=>b.variableTraits?'Size varies':({small:'Small',medium:'Medium',large:'Large'}[b.size]),metric=s=>String(s||'').replace(/[^()]*\(([^)]*)\)/g,'$1').trim();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;toast('Storage is unavailable. Keep this tab open to keep your choices.');}}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3300);}
function snapshot(){const {history,...rest}=p();p().history.push(JSON.parse(JSON.stringify(rest)));if(p().history.length>30)p().history.shift();}
// Every page transition starts at the document top, keeping the banner visible.
// Repeat after layout so the previous page's scroll anchor cannot move it down.
function revealView(view){
 const reveal=()=>{
  if(currentView!==view)return;
  const target=view==='match'?(main.querySelector('.match-header, .winner, .empty')||main):main;
  target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
 };
 reveal();
 requestAnimationFrame(reveal);
}
function navigate(view){
 if(location.hash!=='#'+view)history.pushState(null,'','#'+view);
 render();
 revealView(view);
}
function showComparison(){navigate('match');}
function comparisonIds(){return [p().top||p().candidate,p().challenger];}
function nextChallenger(){return nextDog(dogs,{...p(),top:comparisonIds()[0]})?.id||null;}
function ensureChallenger(){const left=comparisonIds()[0];if(left&&(!p().challenger||!dog(p().challenger)||p().challenger===left))p().challenger=nextChallenger();}
function selectDog(id){
 if(!dog(id))return;
 snapshot();p().winner=false;
 if(!p().top&&!p().candidate){p().candidate=id;p().challenger=null;}
 else if(id!==comparisonIds()[0])p().challenger=id;
 ensureChallenger();persist();showComparison();
}
function vote(id){
 if(!comparisonIds().includes(id)||!dog(id)||!eligible(dog(id),p()))return;
 snapshot();const pair=comparisonIds();p().top=id;p().candidate=null;
 p().seen=[...new Set([...p().seen,...pair].filter(Boolean))];p().rounds++;p().winner=false;
 p().challenger=nextChallenger();persist();showComparison();toast(`${dog(id).name} is your top dog`);
}
function preference(key){if(!PREFERENCES[key])return;snapshot();if(p().prefs.includes(key))p().prefs=p().prefs.filter(x=>x!==key);else{const opposite={small:['medium','large'],medium:['small','large'],large:['small','medium'],active:['calm'],calm:['active']}[key]||[];p().prefs=p().prefs.filter(x=>!opposite.includes(x));p().prefs.push(key);}p().winner=false;persist();render();}
function heartButton(b){
 const saved=p().saved.includes(b.id),label=`${saved?'Unlike':'Like'} ${b.name}`;
 return `<button class="heart-toggle ${saved?'hearted':''}" data-action="save" data-heart="${b.id}" data-id="${b.id}" aria-pressed="${saved}" aria-label="${esc(label)}" title="${esc(label)}">${icon('heart')}</button>`;
}
function toggleSave(id){
 const b=dog(id);if(!b)return;
 const saved=!p().saved.includes(id);
 p().saved=saved?[...p().saved,id]:p().saved.filter(x=>x!==id);persist();
 document.querySelectorAll(`[data-heart="${id}"]`).forEach(button=>{
  button.classList.toggle('hearted',saved);button.setAttribute('aria-pressed',String(saved));
  const label=`${saved?'Unlike':'Like'} ${b.name}`;button.setAttribute('aria-label',label);button.title=label;
 });
 document.querySelectorAll('[data-heart-count]').forEach(el=>el.textContent=p().saved.length);
 if(currentView==='explore'&&ui.saved)renderGrid();
 else if(currentView==='family')family();
 if(currentView==='match'&&p().winner){const grid=$('#winner-shortlist');if(grid){grid.innerHTML=p().saved.map(dog).filter(Boolean).map(card).join('');bindPhotos();}}
}
function image(b,extra='',file=b.photo){return `<img src="${esc(photo(file))}" data-file="${esc(file)}" data-breed-photo="${b.id}" alt="${esc(b.name)}" ${extra}>`;}
function comparisonPhoto(b,extra=''){return `<button class="photo-compare" data-action="pick" data-id="${b.id}" aria-label="Compare ${esc(b.name)}">${image(b,extra)}</button>`;}
function card(b,index=0){
 const isTop=p().top===b.id;
 return `<article class="dog-card ${isTop?'is-top':''}" data-dog="${b.id}"><button class="card-pick" data-action="pick" data-id="${b.id}" aria-label="Compare ${esc(b.name)}"><div class="picture">${image(b,index<8?'loading="eager"':'loading="lazy"')}</div></button><div class="card-info"><button class="card-copy" data-action="details" data-id="${b.id}" aria-label="Details about ${esc(b.name)}">${isTop?`<span class="top-mark">${icon('trophy')}Your top dog</span>`:''}<span class="breed-name">${esc(b.name)}</span><span class="card-meta">${b.variableTraits?'Includes Singapore Specials':humanSize(b)+' · '+esc(metric(b.facts.weight))}</span></button>${heartButton(b)}</div></article>`;
}
const filterTests={shed:b=>!b.variableTraits&&b.profile.shedding<=2,family:b=>!b.variableTraits&&b.profile.children>=4,calm:b=>!b.variableTraits&&b.profile.energy<=2,beginner:b=>!b.variableTraits&&b.profile.experience===1};
function filtered(){let rows=dogs.filter(b=>(!ui.search||[b.name,...(b.aliases||[])].some(name=>name.toLowerCase().includes(ui.search.toLowerCase())))&&(!ui.sizes.length||ui.sizes.some(size=>b.size===size||b.possibleSizes?.includes(size)))&&ui.filters.every(f=>filterTests[f](b))&&(!ui.saved||p().saved.includes(b.id)));const size={large:3,medium:2,small:1};return rows.sort((a,b)=>ui.sort==='name'?a.name.localeCompare(b.name):ui.sort==='large'?Number(!!a.variableTraits)-Number(!!b.variableTraits)||(size[b.size]||0)-(size[a.size]||0)||browseOrder(a)-browseOrder(b):ui.sort==='small'?Number(!!a.variableTraits)-Number(!!b.variableTraits)||(size[a.size]||0)-(size[b.size]||0)||browseOrder(a)-browseOrder(b):ui.sort==='match'?Number(eligible(b,p()))-Number(eligible(a,p()))||fit(b,p())-fit(a,p())||browseOrder(a)-browseOrder(b):browseOrder(a)-browseOrder(b)||a.name.localeCompare(b.name));}
function renderGrid(){const rows=filtered();$('#dog-grid').innerHTML=rows.length?rows.map(card).join(''):`<div class="empty" style="grid-column:1/-1">${icon('search')}<h2>${ui.saved?'No liked dogs yet':'No dogs match those filters'}</h2><p class="muted">${ui.saved?'Tap a heart to like a dog.':'Try removing a filter or changing your search.'}</p><button class="secondary" data-action="clear-filters">Show all dogs</button></div>`;$('#result-count').textContent=`${rows.length} of ${dogs.length} dog types${ui.saved?' · Liked dogs':''}`;bindPhotos();}
function explore(){main.innerHTML=`<section class="intro"><div><span class="eyebrow">FIND YOUR FAVORITE</span><h1>Who's your top dog?</h1><p>See a dog you love? Tap it. Let the comparisons begin.</p></div></section><div class="toolbar"><label class="search"><span class="sr-only" hidden>Search breeds</span>${icon('search')}<input id="search" aria-label="Search dog breeds and mixes" type="search" placeholder="Find a breed or mix…" value="${esc(ui.search)}"></label><label class="select-wrap"><span>Sort</span><select id="sort" aria-label="Sort breeds" title="Popularity: estimated worldwide population">${[['popular','Popularity'],['match','My preferences'],['large','Big → small'],['small','Small → big'],['name','A → Z']].map(([v,l])=>`<option value="${v}" ${ui.sort===v?'selected':''}>${l}</option>`).join('')}</select></label></div><div class="filters" aria-label="Filter breeds">${[['all','All sizes'],['large','Big'],['medium','Medium'],['small','Small']].map(([k,l])=>`<button class="pill ${k==='all'?!ui.sizes.length?'active':'':ui.sizes.includes(k)?'active':''}" data-action="size" data-key="${k}" aria-pressed="${k==='all'?!ui.sizes.length:ui.sizes.includes(k)}">${k!=='all'?icon('size'):''}${l}</button>`).join('')}<span class="filter-divider"></span>${[['shed','spark','Less shedding'],['family','people','Family-friendly'],['calm','moon','Calmer'],['beginner','flag','First dog']].map(([k,i,l])=>`<button class="pill ${ui.filters.includes(k)?'active':''}" data-action="filter" data-key="${k}" aria-pressed="${ui.filters.includes(k)}">${icon(i)}${l}</button>`).join('')}<button class="pill ${ui.saved?'selected':''}" data-action="shortlist" aria-pressed="${ui.saved}">${icon('heart')}Liked dogs <span data-heart-count>${p().saved.length}</span></button></div><div class="results-line"><span id="result-count"></span><button class="text-button" data-action="population-sources">Worldwide estimates</button></div><section id="dog-grid" class="grid" aria-label="Dog gallery"></section>${comparisonIds()[0]?`<div class="dock">${image(dog(comparisonIds()[0]))}<div><small>${p().top?'Your top dog':'Comparing'}</small><strong>${esc(dog(comparisonIds()[0]).name)}</strong></div><a class="primary lime" href="#match">${p().winner?'See winner':'Keep comparing'} ${icon('arrow')}</a></div>`:''}`;renderGrid();$('#search').addEventListener('input',e=>{ui.search=e.target.value;renderGrid();});$('#sort').addEventListener('change',e=>{ui.sort=e.target.value;renderGrid();});}
function fighter(b,incumbent){
 return `<article class="fighter ${incumbent?'incumbent':''}"><div class="fighter-label">${icon(incumbent?'trophy':'spark')}${incumbent?'YOUR TOP DOG':p().top?'THE CHALLENGER':'CONTENDER'}</div><div class="picture">${image(b,'loading="eager"')}</div></article>`;
}
function dimensionRow(key,top,challenger){
 const d=DIMENSIONS[key],choice=p().traits?.[key];
 const isLook=key==='looks',label=isLook?'Looks':d.label;
 const cells=[top,challenger].map(b=>{
  if(!b)return '<div class="dimension-missing"></div>';
  if(!isLook&&b.variableTraits)return '<div class="dimension-pick dimension-unknown"><span><strong>Varies by dog</strong></span></div>';
  const value=isLook?b.id:d.value(b);
  const selected=isLook?p().lookPick===b.id:!!choice&&choice.value===value;
  const blocked=!isLook&&choice?.locked&&choice.value!==value;
  const text=isLook?'I prefer this look':key==='lifespan'?b.facts.lifespan:d.labels[value];
  const detail=key==='size'?metric(b.facts.weight):key==='energy'?b.facts.exercise:key==='lifespan'?d.labels[value]:'';
  return `<button class="dimension-pick ${selected?'preferred':''}" data-action="${isLook?'choose-look':'trait'}" data-key="${key}" data-id="${b.id}" aria-pressed="${selected}" aria-label="Prefer ${esc(b.name)} for ${esc(label.toLowerCase())}: ${esc(text)}" ${blocked?'disabled':''}><span><strong>${esc(text)}</strong>${detail?`<small>${esc(detail)}</small>`:''}</span><span class="preference-tick">${selected?icon('check'):''}</span></button>`;
 }).join('');
 return `<section class="comparison-row" data-dimension="${key}" aria-label="${esc(label)}"><div class="dimension-heading"><h3>${icon(isLook?'spark':d.icon)}${esc(label)}</h3>${choice&&d.lockable!==false?`<button class="dimension-lock ${choice.locked?'locked':''}" data-action="trait-lock" data-key="${key}" data-id="${choice.breedId}" aria-pressed="${choice.locked}" title="${choice.locked?'Unlock':'Require'} ${esc(d.labels[choice.value])}" aria-label="${choice.locked?'Unlock':'Lock'} ${esc(label.toLowerCase())}: ${esc(d.labels[choice.value])}">${icon(choice.locked?'lock':'unlock')}${choice.locked?'Locked':'Lock'}</button>`:''}</div><div class="dimension-options">${cells}</div></section>`;
}
function matchTotal(b){
 const {matched,total,unknown=0}=criteriaSummary(b,p());
 if(unknown)return `<span class="match-total" data-match-total="${b.id}" title="${unknown} criteria need information about an individual dog"><strong>${matched} of ${total}</strong> confirmed · ${unknown} unknown</span>`;
 return `<span class="match-total" data-match-total="${b.id}" title="${total?`${matched} of your ${total} selected criteria match ${esc(b.name)}`:'Select any traits you prefer'}">${total?`<strong>${matched} of ${total}</strong> match`:'No criteria picked'}</span>`;
}
function updateMatchTotals(){
 document.querySelectorAll('[data-match-total]').forEach(el=>{const b=dog(el.dataset.matchTotal);if(b)el.outerHTML=matchTotal(b);});
}
function decisionCards(top,challenger){
 return [top,challenger].map((b,i)=>b?`<div class="decision-card">${matchTotal(b)}<button class="primary ${i?'lime':''}" data-action="vote" data-id="${b.id}" ${!eligible(b,p())?'disabled':''}>${icon('check')}Keep this dog</button><button class="text-button winner-choice" data-action="winner" data-id="${b.id}" ${!eligible(b,p())?'disabled':''}>${icon('trophy')}This is my winner</button>${!eligible(b,p())?`<button class="text-button lock-conflict" data-action="preferences">${b.variableTraits?'Locks need an individual dog · edit':'Outside your locks · edit'}</button>`:''}</div>`:'<div></div>').join('');
}
function updateDimension(key,focusAction='trait',id){
 const top=dog(comparisonIds()[0]),challenger=dog(p().challenger);
 const row=main.querySelector(`[data-dimension="${key}"]`);
 if(row)row.outerHTML=dimensionRow(key,top,challenger);
 const decisions=$('#comparison-decisions');
 if(decisions)decisions.innerHTML=decisionCards(top,challenger);
 updateMatchTotals();
 // A trait choice updates only its row. Keep the pair, scroll position, photos,
 // and keyboard position steady until the player makes the final decision.
 main.querySelector(`[data-action="${focusAction}"][data-key="${key}"]${id?`[data-id="${id}"]`:''}`)?.focus?.({preventScroll:true});
}
function pickDimension(key,id,lock=false){
 const b=dog(id);if(!b||!DIMENSIONS[key])return;
 if(!lock&&!comparisonIds().includes(id))return;
 snapshot();
 const changed=lock?toggleTraitLock(p(),key,b):chooseTrait(p(),key,b);
 if(!changed){p().history.pop();return;}
 p().winner=false;persist();updateDimension(key,lock?'trait-lock':'trait',id);
}
function finishComparison(id=comparisonIds()[0]){
 const b=dog(id);if(!b||!comparisonIds().includes(id)||!eligible(b,p()))return;
 snapshot();const pair=comparisonIds();p().seen=[...new Set([...p().seen,...pair].filter(Boolean))];
 if(p().challenger)p().rounds++;p().top=id;p().candidate=null;p().winner=true;p().challenger=null;
 persist();showComparison();
}
function match(){
 if(p().winner&&dog(p().top)){winner(dog(p().top));return;}
 ensureChallenger();
 if(!comparisonIds()[0]){main.innerHTML=`<div class="empty">${icon('paw')}<h1>Pick a face you love.</h1><a href="#explore" class="primary">Meet the dogs ${icon('arrow')}</a></div>`;return;}
 const top=dog(comparisonIds()[0]),challenger=dog(p().challenger);
 main.innerHTML=`<div class="match-header compare-header"><h1>Compare dogs</h1><div class="actions"><button class="secondary" data-action="undo" ${!p().history.length?'disabled':''}>${icon('undo')}Undo</button><button class="secondary" data-action="skip" ${!challenger?'disabled':''}>${icon('shuffle')}Next</button><a class="secondary" href="#explore">Browse dogs</a></div></div><div class="comparison-board"><div class="pair-headings">${fighter(top,p().top===top.id)}${challenger?fighter(challenger,false):`<div class="empty">${icon('trophy')}<h2>No more matches</h2><button class="secondary" data-action="preferences">Edit preferences & locks</button><button class="secondary" data-action="revisit">Revisit dogs</button></div>`}</div><div class="comparison-names">${[top,challenger].map(b=>b?`<div class="comparison-name"><button class="breed-details" data-action="details" data-id="${b.id}" aria-label="Details about ${esc(b.name)}"><h2>${esc(b.name)}</h2></button>${heartButton(b)}${matchTotal(b)}</div>`:'<div></div>').join('')}</div><p class="comparison-hint">Tap the traits you prefer. Everything is optional.</p>${['looks',...Object.keys(DIMENSIONS)].map(k=>dimensionRow(k,top,challenger)).join('')}<section class="comparison-row tradeoff-row" aria-label="Trade-offs"><div class="dimension-heading"><h3>${icon('book')}Trade-offs</h3></div><div class="dimension-options">${[top,challenger].map(b=>b?`<div class="comparison-tradeoff">${esc(b.disadvantages[0])}</div>`:'<div></div>').join('')}</div></section><div id="comparison-decisions" class="comparison-decisions">${decisionCards(top,challenger)}</div><div class="comparison-optional"><button class="text-button" data-action="preferences">Preferences & locks</button></div></div><div class="section-head"><h2>Pick another challenger</h2><a class="text-button" href="#explore">All dogs</a></div><div class="grid">${rank(dogs,p()).filter(b=>b.id!==top.id&&b.id!==challenger?.id).slice(0,8).map(card).join('')}</div>`;
 bindPhotos();
}
function winner(b){const why=reasons(b,p());main.innerHTML=`<div class="winner">${comparisonPhoto(b,'class="winner-photo"')}<div>${icon('trophy')}<span class="eyebrow" style="color:white;margin-top:12px">${esc(p().name==='You'?'YOUR':p().name.toUpperCase()+"'S")} TOP DOG</span><h1>${esc(b.name)}</h1><p>${why.length?`You like: ${esc(why.join(' · '))}.`:'You picked the dog you love.'}${p().cute.includes(b.id)?' And you love its look.':''}<br>Your favorite so far. You can always change your mind.</p><div class="actions"><button class="primary lime" data-action="details" data-id="${b.id}">${icon('book')}Life with this dog</button><a class="secondary" href="#family">${icon('people')}Compare family picks</a><button class="secondary" data-action="continue">Keep comparing</button>${heartButton(b)}</div></div></div><div class="note">A favorite is a starting point. Meet individual dogs and weigh their needs before deciding.</div><div class="section-head"><h2>Liked dogs</h2><a class="text-button" href="#explore">Meet more dogs</a></div><div class="grid" id="winner-shortlist">${p().saved.map(dog).filter(Boolean).map(card).join('')}</div>`;bindPhotos();}
function familyTabs(){
 return `<div class="family-tabs" aria-label="Family comparison views">${[['people','people','By person'],['dogs','heart','By dog'],['criteria','lock','By criterion']].map(([key,i,label])=>`<button class="pill ${ui.familyView===key?'selected':''}" data-action="family-filter" data-key="${key}" aria-pressed="${ui.familyView===key}" aria-controls="family-view">${icon(i)}${label}</button>`).join('')}</div>`;
}
function familyNames(indices,data){return `<span class="family-person-tags">${indices.map(index=>`<span class="family-person-tag"><span class="avatar">${esc(data.people[index].name[0]?.toUpperCase()||'?')}</span>${esc(data.people[index].name)}</span>`).join('')}</span>`;}
function familyBreedRow(b){
 return `<div class="family-mini-dog">${comparisonPhoto(b,'loading="lazy"')}<div><button class="breed-link" data-action="details" data-id="${b.id}">${esc(b.name)}</button></div></div>`;
}
function familyByPerson(data){
 return `<div class="family-person-grid">${data.people.map(person=>`<article class="family-person-card" data-family-person="${person.index}"><header><h2><span class="avatar">${esc(person.name[0]?.toUpperCase()||'?')}</span>${esc(person.name)}</h2><button class="text-button" data-action="play-as" data-index="${person.index}">Choose as ${esc(person.name)}</button></header><section><h3>${icon('trophy')}Top dog</h3>${person.top?familyBreedRow(dog(person.top)):'<p class="family-empty">Not chosen yet</p>'}${person.top&&person.notes[person.top]?`<p class="family-person-note">${esc(person.notes[person.top])}</p>`:''}</section><section><h3>${icon('heart')}Liked dogs <span class="family-count">${person.liked.length}</span></h3>${person.liked.length?`<ul class="family-like-list" tabindex="0" aria-label="Dogs liked by ${esc(person.name)}">${person.liked.map(id=>`<li>${familyBreedRow(dog(id))}</li>`).join('')}</ul>`:'<p class="family-empty">No likes yet</p>'}</section><section><h3>${icon('lock')}Locked criteria <span class="family-count">${person.locks.length}</span></h3>${person.locks.length?`<ul class="family-lock-list">${person.locks.map(lock=>`<li data-lock-key="${lock.key}"><span>${esc(lock.aspect)}</span><strong>${esc(lock.label)}</strong></li>`).join('')}</ul>`:'<p class="family-empty">No locks recorded</p>'}</section>${person.flexible.length?`<details class="family-flexible"><summary>Other preferences · ${person.flexible.length}</summary><ul>${person.flexible.map(label=>`<li>${esc(label)}</li>`).join('')}</ul></details>`:''}</article>`).join('')}</div>`;
}
function familyDogCard(entry,data){
 const discussions=entry.outsideLocks.length?`<details class="family-dog-conflicts"><summary>${icon('lock')}${entry.dog.variableTraits?'Unconfirmed for':'Outside'} ${entry.outsideLocks.length===1?`${esc(data.people[entry.outsideLocks[0].person].name)}'s`:entry.outsideLocks.length+" people's"} locks</summary><ul>${entry.outsideLocks.map(item=>`<li><strong>${esc(data.people[item.person].name)}</strong><span>${esc(item.locks.map(lock=>lock.label).join(' · '))}</span></li>`).join('')}</ul></details>`:'';
 const relationships=`<div class="family-dog-relationships"><section><h4>${icon('heart')}Liked by ${entry.likedBy.length}${entry.likedBy.length===data.people.length&&data.people.length>1?' · Everyone':''}</h4>${entry.likedBy.length?familyNames(entry.likedBy,data):'<p class="family-empty">No likes yet</p>'}</section>${entry.topBy.length?`<section><h4>${icon('trophy')}Top dog for</h4>${familyNames(entry.topBy,data)}</section>`:''}${discussions}</div>`;
 return card(entry.dog).replace('</article>',relationships+'</article>');
}
function familyByDog(data){
 return data.dogs.length?`<p class="family-view-note">Likes for <strong>${esc(p().name)}</strong>.</p><div class="grid family-dog-grid">${data.dogs.map(entry=>familyDogCard(entry,data)).join('')}</div>`:'<div class="empty"><h2>No dog choices yet.</h2><p>Like dogs in Explore, or choose a top dog in comparison.</p><a class="primary" href="#explore">Explore dogs</a></div>';
}
function familyByCriterion(data){
 if(!data.criteria.length)return '<div class="empty"><h2>No locked criteria yet.</h2><p>Locks chosen in comparison will appear here.</p><a class="primary" href="#match">Compare dogs</a></div>';
 return `<div class="family-criteria-grid">${data.criteria.map(group=>`<article class="family-criterion ${group.conflict?'has-conflict':''}" data-family-criterion="${group.key}"><header><h2>${icon(group.icon)}${esc(group.label)}</h2>${group.conflict?'<span class="family-conflict-badge">Conflicting locks</span>':group.values.length>1?'<span class="family-difference-badge">Different locks</span>':''}</header>${group.conflict?'<p class="family-conflict-explanation">These locks cannot all be met by one dog.</p>':!group.matchingBreeds?'<p class="family-conflict-explanation">No listed breed meets these locks.</p>':''}<div class="family-criterion-values">${group.values.map(value=>`<section data-lock-key="${value.key}"><h3>${icon('lock')}${esc(value.label)}</h3><p class="family-lock-owners">Locked by ${value.people.length}${value.people.length===data.people.length&&data.people.length>1?' · Everyone':''}</p>${familyNames(value.people,data)}</section>`).join('')}</div>${group.notLockedBy.length?`<p class="family-unrecorded">No lock recorded: ${esc(group.notLockedBy.map(index=>data.people[index].name).join(' · '))}</p>`:''}</article>`).join('')}</div>`;
}
function familySuggestions(){
 const participating=state.profiles.filter(q=>q.top||q.prefs.length||q.cute.length||Object.keys(q.traits||{}).length||q.rules.length);
 if(participating.length<2)return '';
 const suggestions=familyRanking(dogs,state.profiles).slice(0,4);
 return `<details class="family-suggestions"><summary>Suggestions from your family preferences</summary>${suggestions.length?`<div class="grid">${suggestions.map(item=>card(item.dog)).join('')}</div>`:'<p>No listed breed meets all the locked criteria. Review them together in By criterion.</p>'}</details>`;
}
function family(){
 const data=familyComparison(dogs,state.profiles);
 const content=ui.familyView==='dogs'?familyByDog(data):ui.familyView==='criteria'?familyByCriterion(data):familyByPerson(data);
 main.innerHTML=`<header class="family-header"><div><h1>Family comparison</h1></div><button class="secondary" data-action="profiles">${icon('people')}People</button></header>${familyTabs()}<div id="family-view" tabindex="-1">${content}</div>${familySuggestions()}<p class="family-storage-note">Choices from profiles on this device.</p>`;
 bindPhotos();
}
function render(){currentView=location.hash.slice(1).split('/')[0]||'explore';if(!['explore','match','family'].includes(currentView))currentView='explore';document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===currentView);if(a.dataset.nav===currentView)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#profile-button').innerHTML=`<span class="avatar">${esc(p().name[0].toUpperCase())}</span><span>${esc(p().name)}</span>`;({explore,match,family}[currentView])();}
function modal(html){pendingProfileAction=null;$('#dialog-content').innerHTML=html;if(!dialog.open)dialog.showModal();bindPhotos();}
function profiles(){modal(`<span class="eyebrow">PLAY TOGETHER</span><h2>Who's choosing?</h2><p>Each person has separate preferences, notes, and a top dog. Saved on this device.</p><div class="family-members">${state.profiles.map((q,i)=>`<button class="member ${i===state.active?'active':''}" data-action="switch" data-index="${i}"><span class="avatar">${esc(q.name[0].toUpperCase())}</span>${esc(q.name)}</button>`).join('')}</div><form class="profile-form" id="add-profile"><input name="name" aria-label="Person's name" placeholder="Add a person's name" maxlength="30" required><button class="primary">${icon('plus')}Add person</button></form><h3>Playing as ${esc(p().name)}</h3><form id="rename-profile" class="profile-form"><input name="name" aria-label="Rename current person" value="${esc(p().name)}" maxlength="30" required><button class="secondary">Rename</button></form><div class="profile-controls"><button class="secondary" data-action="reset-profile">Reset choices</button><button class="secondary danger" data-action="delete-profile">Delete person</button></div><div class="profile-clear-all"><button class="text-button danger" data-action="clear-profiles">Clear all data</button></div>`);$('#add-profile').onsubmit=e=>{e.preventDefault();const name=new FormData(e.target).get('name').trim();if(!name)return;if(state.profiles.length>=12)return toast('This device can hold up to 12 players.');state.profiles.push(newProfile(name));state.active=state.profiles.length-1;persist();dialog.close();navigate('explore');toast(`Now playing as ${name}`);};$('#rename-profile').onsubmit=e=>{e.preventDefault();const name=new FormData(e.target).get('name').trim();if(!name)return;p().name=name;persist();dialog.close();render();};}
function confirmProfileAction(kind){
 if(!['reset','delete','all'].includes(kind))return;
 const person=p(),index=state.active;
 const title=kind==='all'?'Clear all data?':kind==='delete'?`Delete ${person.name}?`:`Reset ${person.name}’s choices?`;
 const description=kind==='all'?'Delete all Top Dog profiles and their choices, liked dogs, locks, notes, and comparison history from this browser.':kind==='delete'?`Delete ${person.name} and all their choices, liked dogs, locks, notes, and comparison history.`:`Clear ${person.name}’s choices, liked dogs, locks, notes, and comparison history. Keep their name.`;
 const label=kind==='all'?'Clear all data':kind==='delete'?'Delete person':'Reset choices';
 modal(`<h2>${esc(title)}</h2><p>${esc(description)} This cannot be undone.</p><div class="modal-actions"><button id="cancel-profile-action" class="secondary" data-action="profiles">Cancel</button><button class="primary danger-fill" data-action="confirm-profile-action">${label}</button></div>`);
 pendingProfileAction={kind,person,index};
 $('#cancel-profile-action')?.focus({preventScroll:true});
}
function applyProfileState(next){
 state=next;ui=emptyUI();pendingProfileAction=null;detailId=undefined;
 closePhoto();dialog.close();$('#dialog-content').textContent='';navigate('explore');
}
function performProfileAction(){
 const action=pendingProfileAction;if(!action)return;
 const {kind,person,index}=action;
 if(kind!=='all'&&state.profiles[index]!==person){pendingProfileAction=null;return;}
 const clear=kind==='all'||kind==='delete'&&state.profiles.length===1;
 let next;
 if(clear)next=emptyState();
 else if(kind==='reset')next={...state,profiles:state.profiles.map((q,i)=>i===index?{...newProfile(q.name),id:q.id}:q)};
 else next={profiles:state.profiles.filter((_,i)=>i!==index),active:Math.max(0,state.active-(index<state.active?1:0))};
 next.active=Math.min(next.active,next.profiles.length-1);
 // Finish the storage write before changing the visible state. A failed write
 // must not look like a successful deletion that returns after a reload.
 try{if(clear)localStorage.removeItem(KEY);else localStorage.setItem(KEY,JSON.stringify(next));}
 catch{toast('Could not change saved data. Nothing was removed. Try again.');return;}
 storageOK=true;applyProfileState(next);
 toast(kind==='all'?'All Top Dog data cleared.':kind==='delete'?`${person.name} deleted.`:`${person.name}’s choices reset.`);
}
function restoreState(raw){
 try{
  const saved=JSON.parse(raw);
  if(saved&&Array.isArray(saved.profiles)&&saved.profiles.length){
   const ids=new Set(dogs.map(d=>d.id)),profiles=saved.profiles.slice(0,12).map(q=>sanitizeProfile(q,ids));
   return {profiles,active:Math.max(0,Math.min(profiles.length-1,Math.trunc(Number(saved.active))||0))};
  }
 }catch{}
 return emptyState();
}
function showPrefs(){
 const choices=Object.entries(p().traits||{});
 modal(`<h2>Preferences & locks</h2>${choices.length?`<div class="stored-preferences">${choices.map(([key,c])=>`<div><span>${c.locked?icon('lock'):icon('check')} ${esc(DIMENSIONS[key].labels[c.value])}</span><button class="text-button" data-action="clear-trait" data-key="${key}" aria-label="Remove ${esc(DIMENSIONS[key].labels[c.value])}">Remove</button></div>`).join('')}</div>`:'<p>No trait picks yet.</p>'}<div class="filters">${p().prefs.filter(k=>PREFERENCES[k]).map(k=>[k,PREFERENCES[k]]).map(([k,v])=>`<button class="pill ${p().prefs.includes(k)?'selected':''}" data-action="modal-pref" data-key="${k}" aria-pressed="${p().prefs.includes(k)}">${icon(v.icon)}${v.label}</button>`).join('')}</div><div class="modal-actions"><button class="secondary" data-action="rules">Must-haves${p().rules.length?` (${p().rules.length})`:''}</button><button class="primary" data-action="close">Done</button></div>`);
}
function showRules(){modal(`<span class="eyebrow">MUST-HAVES</span><h2>What can't you compromise on?</h2><p>Only dogs meeting every checked requirement can become challengers or family suggestions.</p><form id="rules-form">${Object.entries(RULES).map(([k,v])=>`<label class="check-row"><input type="checkbox" name="rule" value="${k}" ${p().rules.includes(k)?'checked':''}>${v.label}</label>`).join('')}<p class="muted">Low shedding does not mean allergy-free. Breed tendencies cannot guarantee an individual dog's behavior.</p><button class="primary">Apply must-haves</button></form>`);$('#rules-form').onsubmit=e=>{e.preventDefault();snapshot();p().rules=new FormData(e.target).getAll('rule');p().winner=false;persist();dialog.close();render();};}
function detail(id){const b=dog(id);if(!b)return;detailId=id;const files=[...new Set([b.photo,...b.gallery])].slice(0,4);modal(`<span class="eyebrow">THE FULL DOG CARD</span><h2>${esc(b.name)}</h2>${b.summary?`<p>${esc(b.summary)}</p>`:''}<div class="detail-photos"><div><button class="detail-enlarge" data-action="photo-full" data-id="${id}" aria-label="View full-screen photo of ${esc(b.name)}">${image(b,'class="main-photo" id="detail-main"')}</button></div><div class="thumbs">${files.map((f,i)=>`<button class="${i===0?'active':''}" data-action="photo" data-file="${esc(f)}" aria-label="View photo ${i+1}">${image(b,'loading="lazy"',f)}</button>`).join('')}</div></div><div class="modal-actions"><button class="primary" data-action="detail-pick" data-id="${id}">Compare this dog</button>${heartButton(b)}</div><div class="detail-grid"><section><h3>At a glance</h3><table class="fact-table"><tbody>${[['Size',humanSize(b)],['Weight · male',metric(b.facts.weightMale||b.facts.weight)],['Weight · female',metric(b.facts.weightFemale||b.facts.weight)],['Height · male',metric(b.facts.heightMale||b.facts.height)],['Height · female',metric(b.facts.heightFemale||b.facts.height)],['Lifespan',b.facts.lifespan],['Worldwide · estimated',`~${formatPopulation(population(b).estimate)} dogs`],['Coat',b.facts.coat],['Bred for',b.facts.purpose],['Exercise',b.facts.exercise]].map(([k,v])=>`<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></section><section><h3>${b.variableTraits?'Individual traits':'Breed tendencies'}</h3><p class="sources">${b.variableTraits?'This group has no single trait profile. Meet the individual dog.':'Broad guides from the original breed profiles. Bars are relative ratings, not measured probabilities.'}</p>${Object.entries(b.stats).map(([k,v])=>`<div class="stat-row"><span>${esc(({trainability:'Trainability',stimulation:'Mental activity',sociability:'Sociability',independence:'Independence',shedding:'Shedding',grooming:'Coat care',barking:'Barking',energy:'Energy',exercise:'Exercise'})[k]||k)}</span>${v===null?'<span class="variable-stat">Varies by dog</span>':`<span class="stat-track"><span style="width:${Math.min(100,Math.max(0,v))}%"></span></span><span>${v>=75?'High':v<=35?'Low':'Medium'}</span>`}</div>`).join('')}</section></div>${populationDetail(b)}<h3>The trade-offs</h3><ul>${b.disadvantages.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>Colors & variations</h3><p>${esc(b.variations?.summary||'No variations listed.')}</p>${b.variations?.colors?.length?`<div class="filters">${b.variations.colors.map(c=>`<span class="pill">${esc(c)}</span>`).join('')}</div>`:''}<h3>Life with a ${esc(b.name)}</h3><p class="sources">A starting routine for a healthy adult dog. Adjust for age, health, weather, and the individual dog.</p><table class="fact-table"><tbody><tr><th>Morning</th><td>Toilet break, part of the day's exercise, then a measured meal and rest.</td></tr><tr><th>Midday</th><td>Toilet break, a sniff walk or gentle play, and a short training session.</td></tr><tr><th>Evening</th><td>The rest of the daily activity, another measured meal, and quiet time.</td></tr><tr><th>Before bed</th><td>A final toilet break.</td></tr><tr><th>Daily activity guide</th><td>${esc(b.facts.exercise)}</td></tr><tr><th>Coat care</th><td>${esc(b.products?.grooming||'Coat-appropriate brushing and basic care.')}</td></tr></tbody></table><p>Keep fresh water available. Food quantities depend on the dog and food; this page does not prescribe portions.</p><h3>Plan the costs</h3><p>Budget for food, grooming, preventive care, training, equipment, boarding, and unexpected treatment. ${b.size==='large'?'Larger dogs typically need more food and larger equipment. ':''}${b.profile.grooming>=4?'Include regular clipping or grooming in your budget. ':''}A priced estimate needs your country and your dog's needs.</p><h3>Your notes</h3><textarea id="dog-notes" maxlength="2000" aria-label="Your notes about this breed" placeholder="What do you like? What would you need to plan for?">${esc(p().notes[id]||'')}</textarea><p class="sources">Saved for ${esc(p().name)} on this device.</p><div class="modal-actions"><a class="secondary" href="${b.adoptionUrl||'classic.html#breed/'+id}" target="_blank" rel="noopener">${b.adoptionUrl?'Meet Singapore Specials':'Original guide, supplies & adoption'}</a><button class="text-button" data-action="sources">Data & photo sources</button></div>`);$('#dog-notes').addEventListener('input',e=>{p().notes[id]=e.target.value;persist();});}
function sources(){modal(`<span class="eyebrow">DATA & PHOTOGRAPHY</span><h2>Know what's behind the cards.</h2>${populationMethod()}<h3>How matching works</h3><p>You can select a preferred value on each dimension. Both dogs are selected when they share that value. Match totals count selected aspects, including a chosen look, once per aspect; hearts and locks do not add extra points. Picks carry equal weight and guide the next challenger after you choose which dog to keep. Unlocked picks are flexible; locked picks require the same displayed trait category. Lifespan and appearance cannot be locked. Must-haves exclude dogs. Your preferences rank the remaining challengers; estimated worldwide population breaks ties. Previously compared dogs wait until you choose to revisit them. Liked dogs are the dogs you marked with a heart. Liking a dog does not choose it as your top dog. Choosing a winner does not automatically like it. A looks preference records an appearance preference for that breed only. It does not imply a preference for a coat, size, or temperament.</p><p>Family views show each person’s liked dogs, top dog, and locked criteria, plus the reverse mappings by dog and criterion. Exact equivalent locks are grouped; different compatible locks remain distinct. Optional suggestions average each participating person’s trait fit, add a small bonus for appearance likes and top picks, and enforce everyone’s locks and must-haves.</p><h3>Breed information</h3><p>The ${dogs.filter(b=>!b.variableTraits).length} original breed profiles, care notes, and curated image choices come from <a href="https://github.com/DogBreeds/DogBreeds.github.io" target="_blank" rel="noopener">the existing Dog Breed Finder project</a>. Behavioral ratings are editorial guides, not probabilities or guarantees. Individual dogs vary. No claims of aggression-free or allergy-free dogs are made.</p><h3>Photos & licenses</h3><p>Open a dog’s details, then tap its photo to view it full screen with the creator, license, and source. Credits load from Wikimedia Commons; the original file page remains linked if metadata is unavailable. Photos fit without cropping.</p><div class="credit-list">${dogs.map(b=>`<div><strong>${esc(b.name)}</strong>: ${[b.photo,...b.gallery].map((f,i)=>`<a href="${source(f)}" target="_blank" rel="noopener">Photo ${i+1}</a>`).join(' · ')}</div>`).join('')}</div><h3>Your choices</h3><p>New match profiles and notes are stored in this browser. They are separate from the original quiz account. Clearing browser storage removes these choices.</p>`);}
let photoReturnFocus=null;
function populationCheck(){
 const b=POPULATION_BALANCE,f=formatPopulation;
 return `<table class="fact-table population-check"><caption>Population check</caption><tbody><tr><th>Listed breeds</th><td>~${f(b.breeds)}</td></tr><tr><th>Mixed-breed & village dogs</th><td>~${f(b.mixed)}</td></tr><tr><th>Catalog total</th><td>~${f(b.catalog)}</td></tr><tr><th>Worldwide benchmark</th><td>${f(b.low)}–${f(b.high)}</td></tr></tbody></table><p class="sources">The catalog is directionally consistent with the world range. Against a ${f(b.reference)} reference, ~${f(b.unlisted)} remains for unlisted breeds. This is an arithmetic remainder, not an independent estimate.</p><details><summary>What this check means</summary><p>The <a href="https://en.wikipedia.org/wiki/Dog#Population" target="_blank" rel="noopener">worldwide benchmark</a> is a broad published estimate. Our mixed/village group assumes a 75% share of the ${f(b.reference)} reference, with a 65–85% sensitivity range. <a href="https://pubmed.ncbi.nlm.nih.gov/26483491/" target="_blank" rel="noopener">Village-dog research</a> supports their numerical importance, but does not establish that share. Free-ranging status and mixed ancestry are different.</p><p>Singapore Specials sit inside the mixed/village group. Purebred dogs are counted under their breed even if unregistered or free-ranging. Do not add individual low or high scenarios together: their uncertainties are not independent. Agreement in scale does not validate individual breed estimates.</p></details>`;
}
function populationDetail(b){
 const n=population(b);
 const basis={international:'Historical international registrations, updated with newer UK and Australian records.', 'group-share':'The breed’s estimated share of a larger registration group; varieties are counted separately.', 'regional-ratio':'Estimated from relative registrations in the UK, Australia, and Japan where available.', 'world-share':'Assumes mixed-breed and non-standardized village dogs comprise 75% of a 900M worldwide reference. This is a scenario, not a measured share. Singapore Specials are included once.', 'racing-stock':'Includes racing and retired Greyhounds, which kennel-club records largely miss.'}[n.method];
 return `<details class="population-detail"><summary>Population estimate details</summary><p>${basis} Broad scenario range: ${formatPopulation(n.low)}–${formatPopulation(n.high)}. Low confidence; this is a model estimate.</p><button class="text-button" data-action="population-sources">Sources & assumptions</button></details>`;
}
function populationMethod(){return `<h2>Worldwide popularity</h2>${populationCheck()}<p>Breeds are sorted by their estimated number of living dogs worldwide. Each breed’s details show its rough count and a broad scenario range.</p><details><summary>How we estimate</summary><p>We start with a historical international registration survey, then use 2016–2025 UK and Australian registrations to reflect newer trends. Where the survey has no breed count, we estimate relative prevalence from those registries and 2025 Japanese registrations. We separate Standard Poodles from other Poodle sizes.</p><p>Estimated annual registrations × average breed lifespan × 8 gives the central estimate. The ×8 coverage factor is our assumption for unregistered purebred dogs and missing countries. Scenario ranges use ×3 to ×20, and widen further for inferred breed shares. These are rough estimates, not census counts or statistical confidence intervals. Mixed-breed and non-standardized village dogs are counted separately as one group. Singapore Specials are included in that group, never added twice.</p><p>Local breed preferences, working dogs outside registries, and changing lifespans can move the true counts substantially. The exact order of nearby breeds is uncertain. Greyhounds use a separate racing-population estimate because kennel-club figures miss most of them.</p></details><details><summary>Statistics & model</summary><ul><li><a href="https://en.wikipedia.org/wiki/List_of_most_popular_dog_breeds#FCI_Worldwide_Figures_2013" target="_blank" rel="noopener">Historical international survey, published 2013</a> (reproduced table; original newsletter unavailable).</li><li><a href="https://www.royalkennelclub.com/media/jwnpo5lt/10-yearly-breeds-stats-gundog.pdf" target="_blank" rel="noopener">Royal Kennel Club, 2016–2025</a> (all seven breed groups used).</li><li><a href="https://dogsaustralia.org.au/media/10430/rego-stats-list_2018-2025.pdf" target="_blank" rel="noopener">Dogs Australia, 2018–2025</a>, plus its 2016–2017 records.</li><li><a href="https://www.jkc.or.jp/registr-statistics/" target="_blank" rel="noopener">Japan Kennel Club, 2025</a>.</li></ul><p><a href="population-method.md" target="_blank" rel="noopener">Full method and source links</a> · <a href="population-inputs.json" target="_blank" rel="noopener">Numeric inputs</a></p><p class="sources">Reviewed September 2026. Counts are rounded to two significant digits. Popularity never overrides your locked criteria.</p></details>`;}
function openPhoto(id,file){
 const b=dog(id);if(!b)return;
 const selected=[b.photo,...b.gallery].includes(file)?file:b.photo;
 const viewer=$('#photo-viewer');if(!viewer)return;
 photoReturnFocus=document.activeElement;
 $('#photo-viewer-content').innerHTML=`<header class="photo-viewer-head"><h2>${esc(b.name)}</h2><button class="photo-close" data-action="photo-close" aria-label="Close full-screen photo">✕</button></header><figure class="full-photo"><img src="${esc(metadata.get(selected)?.url||photo(selected))}" data-file="${esc(selected)}" data-breed-photo="${b.id}" data-full-photo alt="${esc(b.name)}"><figcaption><a href="${source(selected)}" data-credit="${esc(selected)}" target="_blank" rel="noopener">Photo details · Wikimedia Commons</a></figcaption></figure>`;
 if(!viewer.open)viewer.showModal();bindPhotos();
}
function closePhoto(){const viewer=$('#photo-viewer');if(viewer?.open)viewer.close();}
$('#photo-viewer')?.addEventListener('close',()=>{
 $('#photo-viewer-content').textContent='';
 if(photoReturnFocus?.isConnected)photoReturnFocus.focus({preventScroll:true});
 photoReturnFocus=null;
});
const metadata=new Map(),pending=new Set();
function applyMetadata(file,info){const strip=v=>String(v||'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'\"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();const author=strip(info.extmetadata?.Artist?.value),license=strip(info.extmetadata?.LicenseShortName?.value);document.querySelectorAll('a[data-credit]').forEach(a=>{if(a.dataset.credit!==file)return;a.textContent=[author?.slice(0,90),license].filter(Boolean).join(' · ')||'Photo · Wikimedia Commons';a.href=info.descriptionurl||source(file);});}
async function loadMetadata(files){const needed=[...new Set(files)].filter(f=>!metadata.has(f)&&!pending.has(f));if(!needed.length)return;needed.forEach(f=>pending.add(f));try{const u=new URL('https://commons.wikimedia.org/w/api.php');u.search=new URLSearchParams({action:'query',format:'json',origin:'*',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640',titles:needed.map(f=>'File:'+f).join('|')});const res=await fetch(u,{signal:AbortSignal.timeout(8000)});if(!res.ok)throw Error('Photos unavailable');const data=await res.json();for(const page of Object.values(data.query?.pages||{})){const info=page.imageinfo?.[0];if(!info)continue;const title=page.title.replace(/^File:/,'');for(const file of needed){if(file.replaceAll('_',' ')!==title.replaceAll('_',' '))continue;metadata.set(file,info);document.querySelectorAll('img[data-file]').forEach(img=>{if(img.dataset.file!==file)return;if(img.hasAttribute('data-full-photo')&&info.url)img.src=info.url;else if(!img.complete&&info.thumburl)img.src=info.thumburl;});applyMetadata(file,info);}}}catch{}finally{needed.forEach(f=>pending.delete(f));}}
function bindPhotos(){const imgs=[...document.querySelectorAll('img[data-file]')];for(const img of imgs){if(img.dataset.bound)continue;img.dataset.bound='1';img.addEventListener('error',()=>{if(!img.dataset.redirected){img.dataset.redirected='1';img.src=redirectPhoto(img.dataset.file);return;}const b=dog(img.dataset.breedPhoto),files=b?[...new Set([b.photo,...b.gallery])]:[],idx=files.indexOf(img.dataset.file);if(img.dataset.tried!=='1'&&idx>=0&&files[idx+1]){img.dataset.tried='1';img.dataset.file=files[idx+1];img.src=photo(files[idx+1]);const wrap=img.closest('figure,article')||img.parentElement;const a=wrap.querySelector('[data-credit]');if(a){a.dataset.credit=files[idx+1];a.href=source(files[idx+1]);a.textContent='Photo details · Wikimedia Commons';loadMetadata([files[idx+1]]);}return;}img.outerHTML=`<span class="photo-failed">${icon('paw')}<span>Photo couldn't load<br>${esc(b?.name||'')}</span></span>`;});}const files=[...document.querySelectorAll('a[data-credit]')].map(a=>a.dataset.credit);files.forEach(f=>{if(metadata.has(f))applyMetadata(f,metadata.get(f));});loadMetadata(files.slice(0,8));}
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href]');
 if(link&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){
  const view=link.getAttribute('href')?.match(/^#(explore|match|family)$/)?.[1];
  if(view){e.preventDefault();navigate(view);return;}
 }
 const el=e.target.closest('[data-action]');if(!el)return;const {action,id,key,index,file}=el.dataset;switch(action){
 case 'pick':selectDog(id);break;case 'vote':vote(id);break;case 'save':toggleSave(id);break;
 case 'size':ui.sizes=key==='all'?[]:ui.sizes.includes(key)?ui.sizes.filter(x=>x!==key):[...ui.sizes,key];explore();break;
 case 'filter':ui.filters=ui.filters.includes(key)?ui.filters.filter(x=>x!==key):[...ui.filters,key];explore();break;
 case 'family-filter':if(['people','dogs','criteria'].includes(key)){ui.familyView=key;family();main.querySelector(`[data-action="family-filter"][data-key="${key}"]`)?.focus({preventScroll:true});}break;
 case 'shortlist':ui.saved=!ui.saved;explore();break;case 'clear-filters':ui={...ui,search:'',sizes:[],filters:[],saved:false};explore();break;
 case 'profiles':pendingProfileAction=null;profiles();break;
 case 'reset-profile':confirmProfileAction('reset');break;case 'delete-profile':confirmProfileAction('delete');break;case 'clear-profiles':confirmProfileAction('all');break;case 'confirm-profile-action':performProfileAction();break;case 'switch':case 'play-as':if(state.profiles[Number(index)]){state.active=Number(index);persist();dialog.close();if(action==='play-as')navigate(comparisonIds()[0]?'match':'explore');else render();toast(`Playing as ${p().name}`);}break;
 case 'pref':preference(key);break;case 'modal-pref':preference(key);showPrefs();break;case 'preferences':showPrefs();break;case 'rules':showRules();break;
 case 'trait':pickDimension(key,id);break;
 case 'trait-lock':pickDimension(key,id,true);break;
 case 'clear-trait':if(p().traits?.[key]){snapshot();delete p().traits[key];persist();render();showPrefs();}break;
 case 'choose-look':if(comparisonIds().includes(id)){snapshot();p().lookPick=p().lookPick===id?null:id;if(p().lookPick)p().cute=[...new Set([...p().cute,id])];persist();updateDimension('looks','choose-look',id);}break;
 case 'cute':snapshot();p().cute=p().cute.includes(id)?p().cute.filter(x=>x!==id):[...p().cute,id];persist();render();break;
 case 'undo':{const prev=p().history.pop();if(prev){const history=p().history;state.profiles[state.active]={...prev,saved:[...p().saved],history};persist();showComparison();toast('Last choice undone');}}break;
 case 'skip':if(p().challenger){snapshot();p().seen=[...new Set([...p().seen,p().challenger])];p().challenger=nextChallenger();persist();showComparison();}break;
 case 'both':snapshot();p().saved=[...new Set([...p().saved,p().top,p().challenger].filter(Boolean))];persist();render();toast('Both dogs liked.');break;
 case 'winner':finishComparison(id||comparisonIds()[0]);break;
 case 'continue':p().winner=false;persist();showComparison();break;case 'revisit':snapshot();p().seen=[];p().challenger=null;ensureChallenger();persist();showComparison();break;
 case 'details':detail(id);break;case 'detail-pick':dialog.close();selectDog(id);break;case 'detail-save':toggleSave(id);break;
 case 'photo-full':openPhoto(id,file||$('#detail-main')?.dataset.file);break;case 'photo-close':closePhoto();break;
 case 'photo':{const b=dog(detailId);if(!b||![b.photo,...b.gallery].includes(file))break;const img=$('#detail-main');if(img){img.dataset.file=file;img.dataset.tried='';img.dataset.redirected='';img.src=photo(file);}document.querySelectorAll('.thumbs button').forEach(x=>x.classList.toggle('active',x.dataset.file===file));}break;
 case 'population-sources':modal(populationMethod());break;case 'sources':sources();break;case 'close':pendingProfileAction=null;dialog.close();break;
}});
if('scrollRestoration' in history)history.scrollRestoration='manual';
const siteHead=$('.site-head');
if(siteHead&&globalThis.ResizeObserver)new ResizeObserver(()=>{
 document.documentElement.style.setProperty('--head-height',`${siteHead.getBoundingClientRect().height}px`);
}).observe(siteHead);
window.addEventListener('hashchange',()=>{if(dogs.length){render();revealView(currentView);}});
// Other open tabs must replace stale profiles after a reset or deletion.
window.addEventListener('storage',event=>{
 if(!dogs.length||(event.key!==KEY&&event.key!==null))return;
 try{const next=restoreState(localStorage.getItem(KEY));applyProfileState(next);}catch{}
});
async function boot(){try{const [res,photos]=await Promise.all([fetch('./dogs.json'),fetch('./photo-urls.json').then(r=>r.ok?r.json():{}).catch(()=>({}))]);if(!res.ok)throw Error('Could not load breeds');dogs=await res.json();photoURLs=photos;try{state=restoreState(localStorage.getItem(KEY));}catch{}render();if(location.hash.startsWith('#breed/'))detail(location.hash.split('/')[1]);registerTools();}catch{main.innerHTML='<div class="empty"><h2>The dogs could not load.</h2><p>Check your connection and try again.</p><button class="primary" onclick="location.reload()">Try again</button></div>';}}
function registerTools(){const ctx=document.modelContext;if(!ctx?.registerTool)return;const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});const specs=[{name:'read_dog_preferences',title:'Read dog preferences',description:'Read the current player, selected preferences, must-haves, top dog, and challenger.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(){return {player:p().name,top:p().top,candidate:p().candidate,challenger:p().challenger,prefs:p().prefs,traits:p().traits,rules:p().rules,winner:p().winner};}},{name:'start_dog_comparison',title:'Compare a dog',description:'Open a breed in comparison. Does not change the top dog or liked dogs.',inputSchema:{type:'object',properties:{breedId:{type:'string'}},required:['breedId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input.breedId!=='string'||!dog(input.breedId))throw Error('Unknown breed');selectDog(input.breedId);return {top:p().top,candidate:p().candidate,challenger:p().challenger};}}];for(const spec of specs)try{Promise.resolve(ctx.registerTool(spec,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
boot();
