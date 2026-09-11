import {populationCount} from './population.mjs';
export const PREFERENCES={
 small:{label:'Small dogs',icon:'size',test:b=>b.size==='small'?1:0},medium:{label:'Medium dogs',icon:'size',test:b=>b.size==='medium'?1:0},large:{label:'Big dogs',icon:'size',test:b=>b.size==='large'?1:0},
 active:{label:'Adventure buddy',icon:'bolt',test:b=>b.profile.energy/5},calm:{label:'Calmer days',icon:'moon',test:b=>(6-b.profile.energy)/5},
 lowShed:{label:'Less shedding',icon:'spark',test:b=>(6-b.profile.shedding)/5},easyCoat:{label:'Easy coat care',icon:'brush',test:b=>(6-b.profile.grooming)/5},
 family:{label:'Family time',icon:'people',test:b=>b.profile.children/5},trainable:{label:'Easy to train',icon:'brain',test:b=>b.stats.trainability/100},
 social:{label:'Social dogs',icon:'paw',test:b=>b.stats.sociability/100},quiet:{label:'Less barking',icon:'volume',test:b=>1-b.stats.barking/100},
 longLife:{label:'Longer lifespan',icon:'heart',test:b=>Math.min(1,(parseInt(b.facts.lifespan)||10)/15)},beginner:{label:'First dog',icon:'flag',test:b=>b.profile.experience===1?1:.2}
};
export const RULES={lowShed:{label:'Low shedding only',test:b=>b.profile.shedding<=2},beginner:{label:'Suitable for a first dog',test:b=>b.profile.experience===1},small:{label:'Small dogs only',test:b=>b.size==='small'},quiet:{label:'Lower barking only',test:b=>b.stats.barking<=50}};
// A broad mixed/village category has no single verified trait profile.
for(const rule of Object.values(RULES)){const test=rule.test;rule.test=b=>!b.variableTraits&&test(b);}
for(const preference of Object.values(PREFERENCES)){const test=preference.test;preference.test=b=>b.variableTraits?null:test(b);}
const band5=n=>n<=2?'low':n>=4?'high':'medium';
const band100=n=>n<=35?'low':n>=75?'high':'medium';
const three=['low','medium','high'];
export const DIMENSIONS={
 size:{label:'Size',icon:'size',levels:['small','medium','large'],value:b=>b.size,labels:{small:'Small dogs',medium:'Medium dogs',large:'Big dogs'},legacy:['small','medium','large']},
 energy:{label:'Energy',icon:'bolt',levels:three,value:b=>band5(b.profile.energy),labels:{low:'Calmer energy',medium:'Moderate energy',high:'High energy'},legacy:['active','calm']},
 shedding:{label:'Shedding',icon:'spark',levels:three,value:b=>band5(b.profile.shedding),labels:{low:'Low shedding',medium:'Some shedding',high:'Heavy shedding'},legacy:['lowShed']},
 grooming:{label:'Coat care',icon:'brush',levels:three,value:b=>band5(b.profile.grooming),labels:{low:'Easy coat care',medium:'Moderate coat care',high:'Regular grooming'},legacy:['easyCoat']},
 children:{label:'With children',icon:'people',levels:three,value:b=>band5(b.profile.children),labels:{low:'Needs careful pairing',medium:'Thoughtful pairing',high:'Usually family-friendly'},legacy:['family']},
 trainability:{label:'Training',icon:'brain',levels:three,value:b=>band100(b.stats.trainability),labels:{low:'Independent learner',medium:'Steady practice',high:'Quick to learn'},legacy:['trainable']},
 sociability:{label:'Sociability',icon:'paw',levels:three,value:b=>band100(b.stats.sociability),labels:{low:'More reserved',medium:'Moderately social',high:'Often sociable'},legacy:['social']},
 barking:{label:'Barking',icon:'volume',levels:three,value:b=>band100(b.stats.barking),labels:{low:'Less barking',medium:'Some barking',high:'More vocal'},legacy:['quiet']},
 lifespan:{label:'Lifespan',icon:'clock',levels:three,value:b=>{const n=(b.facts.lifespan.match(/\d+/g)||['10']).map(Number);const mean=n.reduce((a,v)=>a+v,0)/n.length;return mean<10?'low':mean>=13?'high':'medium';},labels:{low:'Shorter lifespan',medium:'Moderate lifespan',high:'Longer lifespan'},legacy:['longLife'],lockable:false}
};
for(const dimension of Object.values(DIMENSIONS)){const value=dimension.value;dimension.value=b=>b.variableTraits?null:value(b);}
export function traitFit(b,key,choice){const d=DIMENSIONS[key];if(!d||!d.levels.includes(choice?.value)||!d.levels.includes(d.value(b)))return 0;return 1-Math.abs(d.levels.indexOf(d.value(b))-d.levels.indexOf(choice.value))/(d.levels.length-1);}
export function chooseTrait(p,key,b){
 const d=DIMENSIONS[key];if(!d||!b||!d.levels.includes(d.value(b)))return false;
 const value=d.value(b),previous=p.traits?.[key];
 if(previous?.locked)return false;
 p.traits??={};
 if(previous?.value===value)delete p.traits[key];
 else p.traits[key]={value,breedId:b.id,locked:!!previous?.locked};
 p.prefs=p.prefs.filter(k=>!d.legacy.includes(k));
 return true;
}
export function toggleTraitLock(p,key,b){
 const d=DIMENSIONS[key];if(!d||d.lockable===false||!b||!d.levels.includes(d.value(b)))return false;
 const value=d.value(b),previous=p.traits?.[key];
 if(previous?.locked&&previous.value!==value)return false;
 p.traits??={};p.traits[key]={value,breedId:b.id,locked:!previous?.locked};
 p.prefs=p.prefs.filter(k=>!d.legacy.includes(k));return true;
}
export const eligible=(b,p)=>!!b&&p.rules.every(k=>RULES[k]?.test(b))&&Object.entries(p.traits||{}).every(([key,choice])=>!choice.locked||DIMENSIONS[key]?.value(b)===choice.value);
export const browseOrder=b=>-populationCount(b);
export function fit(b,p){const scores=[...p.prefs.filter(k=>PREFERENCES[k]).map(k=>PREFERENCES[k].test(b)),...Object.entries(p.traits||{}).map(([k,v])=>traitFit(b,k,v))];return scores.length?scores.reduce((a,v)=>a+v,0)/scores.length:0;}
export function rank(dogs,p){return dogs.filter(b=>eligible(b,p)).sort((a,b)=>fit(b,p)-fit(a,p)||browseOrder(a)-browseOrder(b)||a.name.localeCompare(b.name));}
export function nextDog(dogs,p){return rank(dogs,p).find(b=>b.id!==p.top&&!p.seen.includes(b.id))||null;}
// Count selected aspects, not hearted dogs, votes, or locks as extra criteria.
export function criteriaSummary(b,p){
 const traits=Object.entries(p.traits||{}).filter(([key,choice])=>DIMENSIONS[key]?.levels.includes(choice?.value));
 const replaced=new Set(traits.flatMap(([key])=>DIMENSIONS[key].legacy));
 const legacy=[...new Set(p.prefs||[])].filter(key=>PREFERENCES[key]&&!replaced.has(key));
 const matches=[...traits.map(([key,choice])=>DIMENSIONS[key].value(b)===choice.value),...legacy.map(key=>PREFERENCES[key].test(b)>=.75)];
 if(p.lookPick)matches.push(p.lookPick===b.id);
 const summary={matched:matches.filter(Boolean).length,total:matches.length};
 if(b.variableTraits)summary.unknown=traits.length+legacy.length;
 return summary;
}
export function preferenceLabels(p){return [...p.prefs.filter(k=>PREFERENCES[k]).map(k=>PREFERENCES[k].label),...Object.entries(p.traits||{}).filter(([k])=>DIMENSIONS[k]).map(([k,v])=>DIMENSIONS[k].labels[v.value])];}
export function reasons(b,p){return [...p.prefs.filter(k=>PREFERENCES[k]?.test(b)>=.75).map(k=>PREFERENCES[k].label),...Object.entries(p.traits||{}).filter(([k,v])=>traitFit(b,k,v)>=.75).map(([k,v])=>DIMENSIONS[k].labels[v.value])];}
export function tensions(b,p){if(b.variableTraits)return [];return [...p.prefs.filter(k=>PREFERENCES[k]?.test(b)<.5).map(k=>PREFERENCES[k].label),...Object.entries(p.traits||{}).filter(([k,v])=>traitFit(b,k,v)<.5).map(([k,v])=>DIMENSIONS[k].labels[v.value])];}
export function familyRanking(dogs,profiles){const active=profiles.filter(p=>p.top||p.prefs.length||p.cute.length||Object.keys(p.traits||{}).length||p.rules.length);return dogs.filter(b=>active.every(p=>eligible(b,p))).map(b=>({dog:b,score:active.length?active.reduce((n,p)=>n+fit(b,p)+(p.cute.includes(b.id)?.25:0)+(p.top===b.id?.5:0),0)/active.length:0,votes:active.filter(p=>p.top===b.id).length})).sort((a,b)=>b.score-a.score||browseOrder(a.dog)-browseOrder(b.dog));}
export function newProfile(name='You'){return {id:globalThis.crypto?.randomUUID?.()||String(Date.now()),name,top:null,candidate:null,challenger:null,prefs:[],rules:[],traits:{},lookPick:null,cute:[],saved:[],seen:[],rounds:0,winner:false,notes:{},history:[]};}
export function sanitizeProfile(raw,ids){const p=newProfile(String(raw.name||'You').slice(0,30));p.id=String(raw.id||p.id).slice(0,80);p.top=ids.has(raw.top)?raw.top:null;p.candidate=!p.top&&ids.has(raw.candidate)?raw.candidate:null;p.challenger=ids.has(raw.challenger)&&raw.challenger!==(p.top||p.candidate)?raw.challenger:null;for(const k of ['cute','saved','seen'])p[k]=[...new Set((Array.isArray(raw[k])?raw[k]:[]).filter(id=>ids.has(id)))];p.prefs=[...new Set((Array.isArray(raw.prefs)?raw.prefs:[]).filter(k=>PREFERENCES[k]))];p.rules=[...new Set((Array.isArray(raw.rules)?raw.rules:[]).filter(k=>RULES[k]))];p.rounds=Math.max(0,Math.min(1000,Number(raw.rounds)||0));p.winner=!!raw.winner&&!!p.top;p.notes=Object.fromEntries(Object.entries(raw.notes||{}).filter(([k,v])=>ids.has(k)&&typeof v==='string').map(([k,v])=>[k,v.slice(0,2000)]));p.traits=Object.fromEntries(Object.entries(raw.traits||{}).filter(([k,v])=>DIMENSIONS[k]&&v&&DIMENSIONS[k].levels.includes(v.value)&&ids.has(v.breedId)).map(([k,v])=>[k,{value:v.value,breedId:v.breedId,locked:DIMENSIONS[k].lockable!==false&&!!v.locked}]));p.lookPick=ids.has(raw.lookPick)?raw.lookPick:null;return p;}
