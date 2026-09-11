// Rough worldwide living-population scenarios. Observations and assumptions
// are kept separate in data/population-inputs.json. See docs for limitations.
const mean=values=>values.reduce((sum,n)=>sum+n,0)/values.length;
const geoMean=values=>Math.exp(mean(values.map(Math.log)));
const round=n=>Number(n.toPrecision(2));
export function estimatePopulations(input,dogs){
 const {coverageMultiplier,coverageLow,coverageHigh,imputationUncertainty}=input.assumptions;
 const trend=series=>geoMean(Object.values(series).map(s=>mean(s.counts)/mean(s.counts.slice(0,2))).filter(n=>n>0&&Number.isFinite(n)));
 const labAnnual=input.historicalRegistrations['labrador-retriever']*trend(input.series['labrador-retriever']);
 return Object.fromEntries(dogs.map(b=>{
  if(b.id==='mixed-breed-dogs'){
   const w=input.worldwide;
   return [b.id,{estimate:round(w.reference*w.mixedShare),low:round(w.low*w.mixedShareLow),high:round(w.high*w.mixedShareHigh),year:input.estimateYear,method:'world-share',populationGroup:'mixed-village'}];
  }
  const special=input.specialPopulations?.[b.id];
  if(special)return [b.id,{estimate:round(special.basisCount*special.multiplier),low:round(special.basisCount*special.lowMultiplier),high:round(special.basisCount*special.highMultiplier),year:input.estimateYear,method:special.method}];
  const series=input.series[b.id];
  if(!series||!Object.keys(series).length)throw Error(`Missing registration input: ${b.id}`);
  const lifespanNumbers=b.facts.lifespan.match(/\d+/g).map(Number),lifespan=mean(lifespanNumbers);
  let annual,method,groupShare=null;
  if(input.historicalRegistrations[b.id]){
   annual=input.historicalRegistrations[b.id]*trend(series);method='international';
  }else if(input.groupMembers[b.id]){
   const group=input.groupMembers[b.id],total=input.groups[group];
   // Split the group once; never assign the total for all Poodle sizes to Standard.
   groupShare=mean(Object.entries(series).map(([country,s])=>mean(s.counts)/mean(total[country].counts)));
   annual=input.historicalGroups[group]*trend(total)*groupShare;method='group-share';
  }else{
   // Equal country influence in log space avoids treating the larger registry
   // as a representative worldwide breed mix. Missing registries are omitted.
   const ratios=Object.entries(series).map(([country,s])=>mean(s.counts)/mean(input.series['labrador-retriever'][country].counts));
   if(input.japan2025[b.id]>0)ratios.push(input.japan2025[b.id]/input.japan2025['labrador-retriever']);
   annual=labAnnual*geoMean(ratios.filter(n=>n>0));method='regional-ratio';
  }
  if(!(annual>0&&Number.isFinite(annual)))throw Error(`Invalid estimate: ${b.id}`);
  const uncertainty=method==='international'?1:imputationUncertainty;
  const registeredStock=annual*lifespan;
  return [b.id,{
   estimate:round(registeredStock*coverageMultiplier),
   low:round(registeredStock*coverageLow/uncertainty),
   high:round(registeredStock*coverageHigh*uncertainty),
   year:input.estimateYear,method,
   lifespan,annualRegistrations:Math.round(annual),
   ...(groupShare===null?{}:{groupShare:Number(groupShare.toFixed(4))})
  }];
 }));
}

export function populationBalance(input,estimates){
 const world=input.worldwide;
 const mixed=estimates['mixed-breed-dogs']?.estimate||0;
 const breeds=Object.entries(estimates).filter(([id,p])=>id!=='mixed-breed-dogs'&&!p.includedIn).reduce((sum,[,p])=>sum+p.estimate,0);
 const catalog=breeds+mixed;
 return {reference:world.reference,low:world.low,high:world.high,mixedShare:world.mixedShare,breeds,mixed,catalog,
  unlisted:world.reference-catalog,withinRange:catalog>=world.low&&catalog<=world.high,
  note:'Unlisted is a remainder against the reference scenario, not an independent estimate.'};
}
