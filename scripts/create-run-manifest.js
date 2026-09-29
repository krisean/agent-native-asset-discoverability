const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const args=Object.fromEntries(process.argv.slice(2).map(value=>{const [key,...rest]=value.replace(/^--/,'').split('=');return[key,rest.join('=')||true]}));
if(!args.condition||!args.agent||!args.model)throw new Error('Usage: node scripts/create-run-manifest.js --condition=ID --agent=NAME --model=MODEL [--repetitions=10] [--queries-per-intent=all|N] [--seed=VALUE]');
const repetitions=Math.max(1,Number(args.repetitions||10));
const seed=String(args.seed||crypto.randomBytes(8).toString('hex'));
let state=[...seed].reduce((number,character)=>(number*31+character.charCodeAt(0))>>>0,2166136261);
const random=()=>((state=(1664525*state+1013904223)>>>0)/2**32);
const benchmark=JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','queries','benchmark.json'),'utf8'));
const perIntent=args['queries-per-intent']&&args['queries-per-intent']!=='all'?Math.max(1,Number(args['queries-per-intent'])):null;
const groups=Object.groupBy(benchmark.queries,query=>query.intent);
const selected=perIntent?Object.values(groups).flatMap(group=>{
  const broad=group.find(query=>query.specificity==='broad');
  const specific=group.find(query=>query.specificity==='specific');
  const prioritized=[specific,broad,...group].filter(Boolean);
  return [...new Map(prioritized.map(query=>[query.id,query])).values()].slice(0,perIntent);
}):benchmark.queries;
const runs=[];
for(let repetition=1;repetition<=repetitions;repetition++)for(const query of selected)runs.push({trial_id:`${args.condition}_${query.id}_r${String(repetition).padStart(2,'0')}`,condition_id:args.condition,query_id:query.id,intent:query.intent,specificity:query.specificity,repetition,prompt:query.prompt,agent:{name:args.agent,model:args.model}});
for(let index=runs.length-1;index>0;index--){const other=Math.floor(random()*(index+1));[runs[index],runs[other]]=[runs[other],runs[index]];}
const manifest={schema_version:'1.1.0',created_at:new Date().toISOString(),seed,benchmark_version:'1.0.0',condition_id:args.condition,agent:{name:args.agent,model:args.model},selection:{queries_per_intent:perIntent||'all',intent_count:Object.keys(groups).length,selected_query_count:selected.length,method:perIntent?'specific-first, broad-second, then benchmark order':'all benchmark queries'},repetitions,run_count:runs.length,runs:runs.map((run,index)=>({...run,order:index+1}))};
const output=path.resolve(__dirname,'..','trials',`manifest_${args.condition}_${args.agent.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}_${seed}.json`);
fs.writeFileSync(output,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log(output);
