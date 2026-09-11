import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newProfile,familyRanking} from '../engine.mjs';
import {familyComparison,lockedCriteria} from '../family.mjs';

const dogs=JSON.parse(fs.readFileSync(new URL('../dogs.json',import.meta.url),'utf8'));
const lock=(value,breedId)=>({value,breedId,locked:true});
const linus=newProfile('Linus'),ada=newProfile('Ada'),pascale=newProfile('Pascale'),danny=newProfile('Danny');
linus.saved=['standard-poodle','labrador-retriever','standard-poodle','unknown'];linus.top='labrador-retriever';
linus.traits={size:lock('large','labrador-retriever'),shedding:lock('low','standard-poodle'),energy:{...lock('high','labrador-retriever'),locked:false}};
linus.rules=['lowShed'];
ada.saved=['standard-poodle','bichon-frise'];ada.top='bichon-frise';
ada.traits={size:lock('small','bichon-frise'),shedding:lock('low','standard-poodle')};ada.rules=['small'];
pascale.top='standard-poodle';
danny.saved=['standard-poodle'];danny.rules=['quiet'];danny.prefs=['trainable'];
const profiles=[linus,ada,pascale,danny],before=JSON.stringify(profiles);
const data=familyComparison(dogs,profiles);
const breed=id=>data.dogs.find(item=>item.dog.id===id),aspect=key=>data.criteria.find(item=>item.key===key);
assert.equal(JSON.stringify(profiles),before,'Viewing the family must never change anyone’s choices');
assert.deepEqual(data.people[0].liked,['standard-poodle','labrador-retriever'],'Like lists deduplicate and exclude missing breeds');
assert.deepEqual(breed('standard-poodle').likedBy,[0,1,3]);
assert.deepEqual(breed('standard-poodle').topBy,[2],'A top dog is not an implicit heart');
assert.equal(data.dogs[0].dog.id,'standard-poodle','Most shared likes appear first');
assert.equal(data.people.length,4,'People with no likes or locks still appear');
assert.deepEqual(data.people[2].liked,[]);assert.deepEqual(data.people[2].locks,[]);
for(const person of data.people){
 for(const entry of data.dogs){
  assert.equal(person.liked.includes(entry.dog.id),entry.likedBy.includes(person.index),'Person-to-dog and dog-to-person must be exact inverses');
  assert.equal(person.top===entry.dog.id,entry.topBy.includes(person.index));
 }
 for(const group of data.criteria)for(const value of group.values){
  assert.equal(person.locks.some(item=>item.key===value.key),value.people.includes(person.index),'Person-to-lock and lock-to-person must be exact inverses');
 }
}
assert.equal(aspect('size').conflict,true,'Small and large exact-size locks cannot both be met');
assert.deepEqual(aspect('size').notLockedBy,[2,3]);
assert.equal(aspect('shedding').values.length,1);
assert.deepEqual(aspect('shedding').values[0].people,[0,1],'Equivalent must-haves and trait locks count each person once');
assert.deepEqual(aspect('shedding').notLockedBy,[2,3],'Unrecorded locks do not imply agreement');
assert(!aspect('energy'),'An unlocked preference is not a lock');
assert(data.people[0].flexible.includes('High energy'));
assert.equal(lockedCriteria(linus).length,2);
assert.equal(lockedCriteria(ada).length,2);
assert(breed('labrador-retriever').outsideLocks.some(item=>item.person===0&&item.locks.some(c=>c.key==='shedding:low')),'A person’s favorite can conflict with their own locks');
assert(breed('standard-poodle').outsideLocks.some(item=>item.person===1&&item.locks.some(c=>c.key==='size:small')),'Dog view identifies the specific owners and unmet locks');
const one=newProfile('Same name'),two=newProfile('Same name');
one.traits.barking=lock('medium','german-shorthaired-pointer');two.rules=['quiet'];
const overlap=familyComparison(dogs,[one,two]).criteria[0];
assert.equal(overlap.conflict,false,'Lower-barking must-have overlaps with part of the medium category');
assert.equal(overlap.values.length,2,'Partially overlapping constraints must not be merged');
assert(overlap.matchingBreeds>0);
assert.deepEqual(overlap.values.flatMap(v=>v.people).sort(),[0,1],'People with equal names remain distinct');
one.traits.barking=lock('high','beagle');
assert.equal(familyComparison(dogs,[one,two]).criteria[0].conflict,true,'High barking conflicts with the lower-barking must-have');
const lockedOnly=newProfile('Locks only');lockedOnly.traits.shedding=lock('low','standard-poodle');
assert(familyRanking(dogs,[lockedOnly]).every(item=>item.dog.profile.shedding<=2),'Suggestions include a person whose only choices are locks');
const blank=familyComparison(dogs,[newProfile('Blank')]);
assert.equal(blank.people.length,1);assert.deepEqual(blank.dogs,[]);assert.deepEqual(blank.criteria,[]);
console.log('Family checks passed: both inverse mappings, exact lock ownership, unknown choices, conflict detection, legacy constraints, dog trade-offs, and read-only views.');
