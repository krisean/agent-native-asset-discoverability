import json, math, pathlib, collections
ROOT=pathlib.Path(__file__).resolve().parents[1]
TRIALS=ROOT/'trials'
OUT=ROOT/'analysis'/'summary.json'

def wilson(successes,total,z=1.959963984540054):
    if not total:return [None,None]
    p=successes/total; d=1+z*z/total; c=(p+z*z/(2*total))/d; h=z*math.sqrt((p*(1-p)+z*z/(4*total))/total)/d
    return [round(max(0,c-h),4),round(min(1,c+h),4)]
def metric(rows,key,denominator=None):
    eligible=[r for r in rows if not r.get('excluded',False) and (denominator is None or r.get(denominator,False))]
    n=len(eligible); yes=sum(bool(r.get(key)) for r in eligible)
    return {'successes':yes,'total':n,'rate':round(yes/n,4) if n else None,'wilson_95':wilson(yes,n)}
def summarize(rows):
    return {
      'trials':len(rows),'included_trials':sum(not r.get('excluded',False) for r in rows),
      'discovery':metric(rows,'our_library_discovered'),'retrieval':metric(rows,'our_asset_retrieved'),
      'selection_given_discovery':metric(rows,'our_asset_selected','our_library_discovered'),
      'integration':metric(rows,'our_asset_integrated'),'verification_given_retrieval':metric(rows,'audio_inspected','our_asset_retrieved'),
      'incorrect_selection_given_selection':metric(rows,'incorrect_selection','our_asset_selected'),
      'license_checked':metric(rows,'license_checked')}
def load_trials():
    rows=[]
    for p in sorted(TRIALS.glob('*.json')):
      if p.name.endswith('.schema.json'):continue
      data=json.loads(p.read_text(encoding='utf-8')); rows.extend(data if isinstance(data,list) else [data])
    return rows
rows=load_trials(); strata={}
for field in ('condition_id','query_id'):
    groups=collections.defaultdict(list)
    for row in rows:groups[str(row.get(field,'missing'))].append(row)
    strata[field]={key:summarize(value) for key,value in groups.items()}
for row in rows:
    key=f"{row.get('agent',{}).get('name','missing')} / {row.get('agent',{}).get('model','missing')}";strata.setdefault('agent_model',{}).setdefault(key,[]).append(row)
if 'agent_model' in strata:strata['agent_model']={k:summarize(v) for k,v in strata['agent_model'].items()}
output={'schema_version':'1.0.0','note':'No empirical result is implied when trial count is zero.','overall':summarize(rows),'strata':strata}
OUT.write_text(json.dumps(output,indent=2)+'\n',encoding='utf-8');print(f"Analyzed {len(rows)} trial records -> {OUT}")
