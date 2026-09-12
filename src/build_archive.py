"""Build isolated previews and catalogue without dependencies or network access."""
import html
import json
import re
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
CSP = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"

class ExportParser(HTMLParser):
    inner = None
    def handle_starttag(self, tag, attrs):
        if tag == 'iframe': self.inner = dict(attrs).get('srcdoc', self.inner)

def validate(catalog):
    runs = [r['id'] for r in catalog['runs']]
    ids = [c['id'] for c in catalog['concepts']]
    assert len(runs) == len(set(runs)), 'Duplicate run IDs'
    assert len(ids) == len(set(ids)), 'Duplicate concept IDs'
    for c in catalog['concepts']:
        assert re.fullmatch(r'[a-z0-9-]+', c['id']), 'Unsafe concept ID'
        assert c['run_id'] in runs, 'Unknown run'
    for r in catalog['runs']:
        assert r['effort'] is None or isinstance(r['effort'], str)
        assert r['prompt'] is None or isinstance(r['prompt'], str)
        assert (ROOT / r['archive']).is_file(), 'Missing original archive'

BRIDGE = r'''<script>
(()=>{
 const ID=__ID__,KIND=__KIND__,N=__NUMBER__;
 const allowed=['appear','listening','transcribing','transforming','searching','done','failed'];
 let latest=null,scheduled=false,previous='',scenario='',revision=-1;
 const root=document.querySelector(KIND==='codex'?'#inflow-studies':'.pill');
 const samples={dictate:'將呢個 function 改成 async。',rewrite:'我聽日覆你。',search:'上網查下 exponential backoff。'};
 const result='Exponential backoff：每次重試前逐步增加等待時間。';
 function apply(){
  scheduled=false;if(!latest||!root)return;const m=latest;
  document.documentElement.dataset.theme=m.theme;
  document.documentElement.dataset.paused=String(!m.active||!m.motion);
  document.documentElement.style.setProperty('--level',m.level.toFixed(3));
  if(KIND==='codex'){
   root.dataset.theme=m.theme;root.dataset.motion=m.motion&&m.active?'on':'off';
   root.style.setProperty('--if-energy',String(.7+m.level*.6));root.style.setProperty('--level',m.level.toFixed(3));
   if(scenario!==m.scenario){const s=root.querySelector('.if-scenario');s.value=m.scenario;s.dispatchEvent(new Event('change'));}
   if(previous!==m.state||scenario!==m.scenario||revision!==m.revision){const s=root.querySelector('.if-state');s.value=m.state==='appear'?'ready':m.state;s.dispatchEvent(new Event('change'));}
  }else{
   let state=m.state;if(state==='appear')state=N===4?'idle':[2,3,5,6,8,9,10].includes(N)?'idle-appear':'appear';
   root.dataset.state=state;root.dataset.kind=m.scenario==='search'?'search':'text';root.style.setProperty('--level',m.level.toFixed(3));
   if(previous!==m.state||scenario!==m.scenario||revision!==m.revision){
    const text=m.scenario==='rewrite'&&m.state==='done'?'I’ll get back to you tomorrow.':samples[m.scenario];
    if(N===1)window.pill1_setPreview?.(m.scenario==='search'?result:text,root.dataset.kind,'Exponential backoff · 示範');
    if(N===2){root.dataset.mode=m.scenario==='search'?'search':'text';window.pill2_setText?.(text);window.pill2_setSearch?.('Exponential backoff · 示範',result);}
    if(N===5){root.dataset.text=text;root.dataset.title='Exponential backoff · 示範';root.dataset.body=result;}
    if(N===10)window.pill10_command?.(m.scenario==='search'?'search':m.scenario==='rewrite'?'transform':'none');
   }
   try{const tick=window['pill'+N+'_tick'];if(typeof tick==='function')tick(m.level,state);}
   catch(error){document.getElementById('frame-error').hidden=false;}
  }
  previous=m.state;scenario=m.scenario;revision=m.revision;
 }
 addEventListener('message',event=>{
  const m=event.data;if(event.source!==parent||!m||m.type!=='pill-state'||!allowed.includes(m.state))return;
  if(!['light','dark'].includes(m.theme)||!['dictate','rewrite','search'].includes(m.scenario))return;
  if(typeof m.level!=='number'||!Number.isFinite(m.level))return;
  latest={...m,level:Math.max(0,Math.min(1,m.level)),active:!!m.active,motion:!!m.motion};
  if(!scheduled){scheduled=true;requestAnimationFrame(apply);}
 });
 const stage=KIND==='codex'?root?.querySelector('.if-study:not([style]) .if-scene'):document.querySelector('.preview-stage');
 const sizeTarget=KIND==='codex'?[...root.querySelectorAll('.if-scene')].find(el=>el.offsetHeight):stage;
 if(sizeTarget)new ResizeObserver(()=>parent.postMessage({type:'pill-size',id:ID,height:Math.ceil(sizeTarget.getBoundingClientRect().height)},'*')).observe(sizeTarget);
 if(parent!==window)parent.postMessage({type:'pill-ready',id:ID},'*');
})();</script>'''

BASE_CSS = '''
:root{color-scheme:light;--bg:#fcfafb;--fg:#1a151e;--muted:#6b6070;--accent:#8a2e63;--ok:#2f7d53;--warn:#a8690c;--err:#b5372f;--shadow:#1a151e2e;background:#e9e5e9;color:var(--fg)}
:root[data-theme=dark]{color-scheme:dark;--bg:#221c27;--fg:#efe9f0;--muted:#a497aa;--accent:#e88cc0;--ok:#56c98a;--warn:#e8a63e;--err:#ff7c6e;--shadow:#0009;background:#14111a}
*{box-sizing:border-box}html,body{margin:0;min-height:100%;width:100%}body{font-family:system-ui,sans-serif}
.preview-stage{min-height:350px;display:flex;align-items:center;justify-content:center;padding:40px 18px;position:relative;isolation:isolate}
.preview-stage>.pill{max-width:100%;flex-shrink:1}
#frame-error{position:fixed;bottom:5px;left:8px;background:var(--bg);color:var(--err);font:12px system-ui;padding:6px}
[hidden]{display:none!important}:root[data-paused=true] *{animation-play-state:paused!important}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
'''

def bridge(c, kind, number=0):
    return BRIDGE.replace('__ID__', json.dumps(c['id'])).replace('__KIND__', json.dumps(kind)).replace('__NUMBER__', str(number))

def legacy_frame(entry, c):
    n=entry['source_index']
    return f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="{CSP}"><title>{html.escape(entry['name'])}</title><style>{BASE_CSS}\n{c['css']}</style></head><body><div class="preview-stage">{c['html']}</div><p id="frame-error" hidden>此示範未能更新狀態。</p><script>{c.get('js','')}</script>{bridge(entry,'claude',n)}</body></html>'''

def codex_frame(entry, original):
    document=re.sub(r'(<meta http-equiv="Content-Security-Policy" content=")[^"]*',r'\g<1>'+CSP,original)
    css=f'''<style>
    html,body{{margin:0!important;padding:0!important;min-height:350px;overflow:hidden;color-scheme:light dark}}
    #inflow-studies .if-controls,#inflow-studies .if-caption,#inflow-studies .if-scene-footer{{display:none!important}}
    #inflow-studies .if-study{{margin:0!important}}
    #inflow-studies .if-study:not([data-concept="{entry['source_concept']}"]){{display:none!important}}
    #inflow-studies .if-scene{{border:0!important;border-radius:0!important;min-height:350px;display:flex;flex-direction:column}}
    #inflow-studies .still-composition,#inflow-studies .weave-composition,#inflow-studies .relay-composition{{flex:1}}
    #inflow-studies .weave-thread span{{animation:none;transform:scaleY(calc(1 + var(--level,0) * 3))}}
    :root[data-paused=true] *{{animation-play-state:paused!important}}
    </style>'''
    return document.replace('</body>',css+bridge(entry,'codex')+'</body>')

def build():
    catalog=json.loads((ROOT/'src/catalog.json').read_text());validate(catalog)
    legacy=json.loads((ROOT/'src/pill-concepts.json').read_text())
    scores=json.loads((ROOT/'src/pill-scores.json').read_text())['scores']
    parser=ExportParser();parser.feed((ROOT/'archives/codex-original.html').read_text())
    assert parser.inner and 'inflow-studies' in parser.inner,'Invalid Codex archive'
    for folder in ['assets','previews']:(ROOT/folder).mkdir(exist_ok=True)
    for c in catalog['concepts']:
        c['preview']='previews/'+c['id']+'.html'
        if c['run_id']=='claude-original':
            source=legacy[c['source_index']-1]
            c['original_score']=next((s for s in scores if s['index']==c['source_index']),None)
            page=legacy_frame(c,source)
        elif c['run_id']=='codex-three':page=codex_frame(c,parser.inner)
        else:
            source=(ROOT/c['source_file']).resolve()
            assert source.is_relative_to((ROOT/'src/submissions').resolve()), 'Submission must be inside src/submissions'
            page=source.read_text()
        (ROOT/c['preview']).write_text(page)
    (ROOT/'assets/catalog.mjs').write_text('export const catalog = '+json.dumps(catalog,ensure_ascii=False,indent=2)+';\n')
    print(f"Built {len(catalog['concepts'])} previews from {len(catalog['runs'])} recorded runs.")

if __name__=='__main__':build()
