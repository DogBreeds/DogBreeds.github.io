import {DIMENSIONS, PREFERENCES, RULES, browseOrder} from './engine.mjs';

// Older must-haves are included as locks. Merge only exact equivalents.
const ruleCriteria={
 small:{dimension:'size',value:'small'},
 lowShed:{dimension:'shedding',value:'low'},
 quiet:{dimension:'barking',value:'lower',label:'Lower barking only',allowed:['low','medium']},
 beginner:{dimension:'experience',value:'beginner',label:'Suitable for a first dog',allowed:['beginner']}
};
export function lockedCriteria(profile){
 const locks=new Map();
 for(const [dimension,choice] of Object.entries(profile.traits||{})){
  const d=DIMENSIONS[dimension];
  if(!choice?.locked||!d||d.lockable===false||!d.levels?.includes(choice.value))continue;
  const key=dimension+':'+choice.value;
  locks.set(key,{key,dimension,value:choice.value,label:d.labels[choice.value],aspect:d.label,icon:d.icon,allowed:[choice.value]});
 }
 for(const rule of profile.rules||[]){
  if(!Object.hasOwn(ruleCriteria,rule))continue;const c=ruleCriteria[rule];
  const d=DIMENSIONS[c.dimension],key=c.dimension+':'+c.value;
  if(!locks.has(key))locks.set(key,{key,dimension:c.dimension,value:c.value,label:c.label||d.labels[c.value],aspect:d?.label||'Experience',icon:d?.icon||'flag',allowed:c.allowed||[c.value],rule});
 }
 return [...locks.values()];
}
export function meetsLock(b,lock){
 return lock.rule?RULES[lock.rule].test(b):DIMENSIONS[lock.dimension].value(b)===lock.value;
}
export function familyComparison(dogs,profiles){
 const byId=new Map(dogs.map(b=>[b.id,b]));
 const people=profiles.map((p,index)=>{
  const traits=Object.entries(p.traits||{}).filter(([key,c])=>DIMENSIONS[key]?.levels.includes(c?.value));
  const replaced=new Set(traits.flatMap(([key])=>DIMENSIONS[key].legacy));
  return {index,name:p.name,top:byId.has(p.top)?p.top:null,
   liked:[...new Set(p.saved||[])].filter(id=>byId.has(id)),locks:lockedCriteria(p),
   flexible:[...traits.filter(([,c])=>!c.locked).map(([key,c])=>DIMENSIONS[key].labels[c.value]),
    ...[...new Set(p.prefs||[])].filter(key=>PREFERENCES[key]&&!replaced.has(key)).map(key=>PREFERENCES[key].label)],
   notes:p.notes||{}};
 });
 const selected=dogs.filter(b=>people.some(person=>person.top===b.id||person.liked.includes(b.id))).map(b=>({
  dog:b,likedBy:people.filter(person=>person.liked.includes(b.id)).map(person=>person.index),
  topBy:people.filter(person=>person.top===b.id).map(person=>person.index),
  outsideLocks:people.map(person=>({person:person.index,locks:person.locks.filter(lock=>!meetsLock(b,lock))})).filter(item=>item.locks.length)
 })).sort((a,b)=>b.likedBy.length-a.likedBy.length||b.topBy.length-a.topBy.length||browseOrder(a.dog)-browseOrder(b.dog)||a.dog.name.localeCompare(b.dog.name));
 const aspects=new Map();
 for(const person of people)for(const lock of person.locks){
  if(!aspects.has(lock.dimension))aspects.set(lock.dimension,{key:lock.dimension,label:lock.aspect,icon:lock.icon,values:new Map()});
  const group=aspects.get(lock.dimension);
  if(!group.values.has(lock.key))group.values.set(lock.key,{...lock,people:[]});
  group.values.get(lock.key).people.push(person.index);
 }
 const criteria=[...aspects.values()].map(group=>{
  const values=[...group.values.values()].sort((a,b)=>b.people.length-a.people.length||a.label.localeCompare(b.label));
  const lockedBy=new Set(values.flatMap(value=>value.people));
  const compatibleValues=values.reduce((common,value)=>common.filter(v=>value.allowed.includes(v)),values[0].allowed);
  return {...group,values,conflict:compatibleValues.length===0,
   notLockedBy:people.filter(person=>!lockedBy.has(person.index)).map(person=>person.index),
   matchingBreeds:dogs.filter(b=>values.every(lock=>meetsLock(b,lock))).length};
 }).sort((a,b)=>Number(b.conflict)-Number(a.conflict)||a.label.localeCompare(b.label));
 return {people,dogs:selected,criteria};
}
