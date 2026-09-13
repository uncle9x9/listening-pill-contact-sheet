import {catalog} from './catalog.mjs';
import {STATES,STATE_LABELS,UNKNOWN,modelLabel,effortLabel,matches,cleanSelection,toggleSelection,speechLevel,timeline} from './core.mjs';

const $=id=>document.getElementById(id);
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const runs=new Map(catalog.runs.map(r=>[r.id,r]));
const validIds=catalog.concepts.map(c=>c.id);
const entries=new Map();
const params=new URLSearchParams(location.search);
let stored=[];
try { const value=JSON.parse(localStorage.getItem('pill-archive.comparison.v1')||'[]');if(Array.isArray(value))stored=value; } catch {}
let selected=cleanSelection(params.has('compare')?(params.get('compare')||'').split(','):stored,validIds);
let comparing=params.get('view')==='compare'&&selected.length>=2;
let revision=0;
let currentState='listening',playing=false,timers=[],toastTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
$('motion').checked=!reduced.matches;
$('theme').value=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';

function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>{$('toast').hidden=true;},3500);}
function addOptions(id,values){for(const value of new Set(values)){$(id).add(new Option(value,value));}if([...$(id).options].some(o=>o.value===params.get(id)))$(id).value=params.get(id);}
addOptions('provider',catalog.runs.map(r=>r.provider));
addOptions('model',catalog.runs.map(modelLabel));
addOptions('effort',catalog.runs.map(effortLabel));
$('total-designs').textContent=catalog.concepts.length;
$('total-runs').textContent=catalog.runs.length;
for(const run of catalog.runs){
 const row=node('div','run-item');const dot=node('span','provider-dot');dot.dataset.provider=run.provider;
 row.append(dot,node('span','',`${run.provider} / ${run.tool} · ${catalog.concepts.filter(c=>c.run_id===run.id).length} 款`));$('run-list').append(row);
}

function filters(){return Object.fromEntries(['provider','model','effort'].map(id=>[id,$(id).value]));}
function updateURL(){
 const url=new URL(location.href);
 for(const [key,value]of Object.entries(filters())){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
 if(selected.length)url.searchParams.set('compare',selected.join(','));else url.searchParams.delete('compare');
 if(comparing)url.searchParams.set('view','compare');else url.searchParams.delete('view');
 history.replaceState(null,'',url);
 try{localStorage.setItem('pill-archive.comparison.v1',JSON.stringify(selected));}catch{}
}
function renderCollection(){
 if(selected.length<2)comparing=false;
 let count=0;
 for(const [id,it]of entries){
  const visible=comparing?selected.includes(id):matches(it.concept,it.run,filters());
  it.card.hidden=!visible;if(visible)count++;
  it.card.dataset.selected=String(selected.includes(id));
  it.compare.setAttribute('aria-pressed',String(selected.includes(id)));
  it.compare.textContent=selected.includes(id)?'✓ 已加入比較':'+ 加入比較';
  send(it);
 }
 $('collection').dataset.comparing=String(comparing);$('collection').dataset.count=String(count);
 $('selected-count').textContent=selected.length;$('compare-view').disabled=selected.length<2;
 $('compare-view').setAttribute('aria-pressed',String(comparing));$('all-view').setAttribute('aria-pressed',String(!comparing));
 $('clear-selection').disabled=!selected.length;$('share').disabled=selected.length<2;
 $('empty').hidden=count>0;
 $('result-count').textContent=comparing?`並排比較 ${count} 款`:`顯示 ${count} / ${catalog.concepts.length} 款`;
 for(const id of ['provider','model','effort','clear-filters'])$(id).disabled=comparing;
 updateURL();
}

const observer=new IntersectionObserver(changes=>{
 for(const change of changes){const it=entries.get(change.target.dataset.id);if(it){it.visible=change.isIntersecting;send(it);}}
},{rootMargin:'120px'});

catalog.concepts.forEach((concept,index)=>{
 const run=runs.get(concept.run_id);
 const card=node('article','design-card');card.dataset.id=concept.id;card.id=concept.id;card.setAttribute('aria-labelledby',`title-${concept.id}`);
 const head=node('div','design-head'),meta=node('div','design-meta'),dot=node('span','provider-dot');dot.dataset.provider=run.provider;
 meta.append(dot,node('span','',`${run.provider} / ${run.tool}`),node('span','design-index',String(index+1).padStart(2,'0')));
 const title=node('h3','',concept.name);title.id=`title-${concept.id}`;
 head.append(meta,title,node('p','',concept.tagline));
 const preview=node('div','preview-wrap'),frame=node('iframe');
 frame.title=`${concept.name} 互動示範`;frame.setAttribute('sandbox','allow-scripts');frame.loading='lazy';frame.referrerPolicy='no-referrer';frame.src=concept.preview;
 const label=node('div','preview-label');label.append(node('span','', '即時示範'),node('span','frame-state','聆聽 · '+($('theme').value==='dark'?'深色':'淺色')));preview.append(frame,label);
 const info=node('div','design-info');for(const [k,v]of [['模型',modelLabel(run)],['Effort',effortLabel(run)]]){const item=node('span','',`${k}  `);item.append(node('b','',v));info.append(item);}
 const actions=node('div','design-actions'),record=node('button','record-button','Prompt / 製作紀錄'),compare=node('button','compare-button','+ 加入比較');record.type=compare.type='button';
 record.addEventListener('click',()=>showRecord(concept,run));
 compare.addEventListener('click',()=>{
  if(!selected.includes(concept.id)&&selected.length===3){toast('最多並排比較三款，請先移除其中一款。');return;}
  selected=toggleSelection(selected,concept.id,validIds);renderCollection();
 });
 actions.append(record,compare);card.append(head,preview,info,actions);
 const it={concept,run,card,frame,compare,visible:false,ready:false};entries.set(concept.id,it);
 $('collection').append(card);observer.observe(card);
});

function stop(){timers.forEach(clearTimeout);timers=[];playing=false;$('play').textContent='▶ 播放流程';$('play').setAttribute('aria-pressed','false');}
function setState(state){
 currentState=state;revision++;
 for(const button of $('state-controls').children)button.setAttribute('aria-pressed',String(button.dataset.state===state));
 $('playback-status').textContent=STATE_LABELS[STATES.indexOf(state)]+'中';
 if(state==='done')$('playback-status').textContent='流程完成';
 if(state==='failed')$('playback-status').textContent='失敗狀態示範';
 if(state==='appear')$('playback-status').textContent='準備好';
 for(const it of entries.values()){
  it.card.querySelector('.frame-state').textContent=STATE_LABELS[STATES.indexOf(state)]+' · '+($('theme').value==='dark'?'深色':'淺色');send(it);
 }
}
for(const [i,state]of STATES.entries()){
 const button=node('button','',STATE_LABELS[i]);button.type='button';button.dataset.state=state;
 button.addEventListener('click',()=>{stop();setState(state);});$('state-controls').append(button);
}
$('play').addEventListener('click',()=>{
 if(playing){stop();setState('appear');return;}stop();playing=true;$('play').textContent='■ 停止流程';$('play').setAttribute('aria-pressed','true');
 let elapsed=0;
 for(const [state,duration]of timeline($('scenario').value)){
  timers.push(setTimeout(()=>{setState(state);if(state==='done')stop();},elapsed));elapsed+=duration;
 }
});
function send(it,level){
 if(!it.ready)return;
 const active=it.visible&&!it.card.hidden&&!document.hidden;
 const voice=$('voice').value;
 const volume=currentState!=='listening'?0:voice==='silent'?0:voice==='manual'?Number($('level').value)/100:level??speechLevel(performance.now()/1000);
 it.frame.contentWindow?.postMessage({type:'pill-state',revision,state:currentState,scenario:$('scenario').value,theme:$('theme').value,level:volume,motion:$('motion').checked,active},'*');
}
addEventListener('message',event=>{
 const m=event.data;if(!m||!['pill-ready','pill-size'].includes(m.type))return;
 const it=entries.get(m.id);if(!it||event.source!==it.frame.contentWindow)return;
 if(m.type==='pill-size'){if(Number.isFinite(m.height))it.frame.style.height=Math.max(350,Math.min(800,Math.ceil(m.height)))+'px';return;}
 it.ready=true;send(it);
});
let previous=0;
function tick(now){
 if(now-previous>=33&&!document.hidden){previous=now;const level=speechLevel(now/1000);for(const it of entries.values())if(it.visible&&!it.card.hidden)send(it,level);}
 requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange',()=>{for(const it of entries.values())send(it);});
requestAnimationFrame(tick);

for(const id of ['provider','model','effort'])$(id).addEventListener('change',renderCollection);
function resetFilters(){for(const id of ['provider','model','effort'])$(id).value='';comparing=false;renderCollection();}
$('clear-filters').addEventListener('click',resetFilters);$('empty-reset').addEventListener('click',resetFilters);
$('all-view').addEventListener('click',()=>{comparing=false;renderCollection();});
$('compare-view').addEventListener('click',()=>{comparing=true;renderCollection();});
$('clear-selection').addEventListener('click',()=>{selected=[];renderCollection();});
for(const id of ['scenario','theme','voice','motion'])$(id).addEventListener('change',()=>{
 if(id==='scenario'){stop();currentState='listening';}
 $('level-control').hidden=$('voice').value!=='manual';setState(currentState);
});
$('level').addEventListener('input',()=>{$('level-value').textContent=$('level').value+'%';for(const it of entries.values())send(it);});
reduced.addEventListener('change',event=>{if(event.matches){$('motion').checked=false;for(const it of entries.values())send(it);}});

let recordPrompt='';
function showRecord(concept,run){
 $('record-title').textContent=concept.name;$('record-meta').replaceChildren();
 for(const [key,value]of [['廠商',run.provider],['製作工具',run.tool],['模型',modelLabel(run)],['Effort',effortLabel(run)],['生成日期',run.created_at||UNKNOWN],['收錄日期',run.recorded_at]]){
  $('record-meta').append(node('dt','',key),node('dd','',value));
 }
 recordPrompt=run.prompt||'';$('record-prompt').textContent=recordPrompt||'未記錄：原作沒有附上原始 prompt。';$('copy-prompt').hidden=!recordPrompt;
 $('record-context').textContent=run.prompt_context;$('record-provenance').textContent=run.provenance;
 $('record-original').href=concept.archive||run.archive;$('original-notes').hidden=!concept.original_score;$('original-notes').open=false;
 $('original-score').textContent=concept.original_score?.note||'';$('record-dialog').showModal();
}
$('close-record').addEventListener('click',()=>$('record-dialog').close());
$('record-dialog').addEventListener('click',e=>{if(e.target===$('record-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
async function copy(text,success){try{await navigator.clipboard.writeText(text);toast(success);}catch{toast('未能自動複製，請選取文字手動複製。');}}
$('copy-prompt').addEventListener('click',()=>copy(recordPrompt,'已複製原始 Prompt。'));
$('share').addEventListener('click',()=>{const url=new URL(location.href);url.search='';url.searchParams.set('compare',selected.join(','));url.searchParams.set('view','compare');copy(url.href,'已複製比較連結。');});
renderCollection();setState('listening');
