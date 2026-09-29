import json, math, pathlib, collections, statistics
from datetime import datetime
ROOT=pathlib.Path(__file__).resolve().parents[1]
TRIALS=ROOT/'trials'
LIFECYCLE=ROOT/'metadata'/'asset-lifecycle-events.json'
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
      if p.name.endswith('.schema.json') or p.name.startswith('manifest_'):continue
      data=json.loads(p.read_text(encoding='utf-8')); candidates=data if isinstance(data,list) else [data]
      rows.extend(row for row in candidates if 'trial_id' in row and 'final_outcome' in row)
    return rows
def parse_time(value):return datetime.fromisoformat(value.replace('Z','+00:00'))
def lifecycle_summary():
    data=json.loads(LIFECYCLE.read_text(encoding='utf-8'))
    grouped=collections.defaultdict(list)
    for event in data['events']:grouped[event['asset_id']].append(event)
    latency_types=('sitemap_included','crawler_requested','indexed','exact_title_visible','semantic_query_visible','agent_retrieved','agent_selected')
    assets=[]; observation_end=parse_time(data['observation_end']) if data.get('observation_end') else None
    for asset_id,events in grouped.items():
      first={}
      for event in sorted(events,key=lambda item:item['timestamp']):first.setdefault(event['event_type'],event)
      published=first.get('published'); latencies={}; censored=[]; censor_hours=None
      if published:
        start=parse_time(published['timestamp'])
        for event_type in latency_types:
          if event_type in first:latencies[f'{event_type}_hours']=round((parse_time(first[event_type]['timestamp'])-start).total_seconds()/3600,4)
          elif observation_end:censored.append(event_type)
        if observation_end:censor_hours=round((observation_end-start).total_seconds()/3600,4)
      assets.append({'asset_id':asset_id,'cohort':events[0]['cohort'],'published_at':published['timestamp'] if published else None,'latencies':latencies,'right_censored_events':censored,'censor_hours':censor_hours})
    aggregates={}
    for event_type in latency_types:
      key=f'{event_type}_hours';values=[asset['latencies'][key] for asset in assets if key in asset['latencies']]
      aggregates[key]={'observed':len(values),'median':round(statistics.median(values),4) if values else None,'minimum':min(values) if values else None,'maximum':max(values) if values else None}
    return {'event_count':len(data['events']),'asset_count':len(assets),'observation_end':data.get('observation_end'),'assets':assets,'aggregates':aggregates}
rows=load_trials(); strata={}
for field in ('condition_id','query_id'):
    groups=collections.defaultdict(list)
    for row in rows:groups[str(row.get(field,'missing'))].append(row)
    strata[field]={key:summarize(value) for key,value in groups.items()}
for row in rows:
    key=f"{row.get('agent',{}).get('name','missing')} / {row.get('agent',{}).get('model','missing')}";strata.setdefault('agent_model',{}).setdefault(key,[]).append(row)
if 'agent_model' in strata:strata['agent_model']={key:summarize(value) for key,value in strata['agent_model'].items()}
output={'schema_version':'1.1.0','note':'No empirical result is implied when trial or lifecycle counts are zero.','overall':summarize(rows),'strata':strata,'asset_lifecycle':lifecycle_summary()}
OUT.write_text(json.dumps(output,indent=2)+'\n',encoding='utf-8');print(f"Analyzed {len(rows)} trial records and {output['asset_lifecycle']['event_count']} lifecycle events -> {OUT}")
