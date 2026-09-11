import json, os, re, html as H
D = os.path.dirname(os.path.abspath(__file__))
concepts = json.load(open(os.path.join(D, 'pill-concepts.json')))
scores = {}
sp = os.path.join(D, 'pill-scores.json')
if os.path.exists(sp):
    for s in json.load(open(sp)).get('scores', []):
        scores[s['index']] = s

def idx_of(c):
    m = re.search(r'pill-(\d+)', c.get('html',''))
    return int(m.group(1)) if m else 999
for c in concepts:
    c['index'] = c.get('index') or idx_of(c)
concepts.sort(key=lambda c: c['index'])

css_all = "\n\n".join("/* --- concept %d: %s --- */\n%s" % (c['index'], c['name'], c.get('css','')) for c in concepts)
payload = json.dumps([{k: c.get(k) for k in ('index','name','tagline','concept','html','js','states','appkit','risks')} for c in concepts], ensure_ascii=False)
scores_json = json.dumps(scores, ensure_ascii=False)

TPL = r'''<title>Listening Pill Contact Sheet</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&display=swap">
<style>
/* ============ page chrome tokens (deliberately NOT --bg/--fg: those belong to the pills) ============ */
:root{
  --p-ground:#EDEAEC; --p-panel:#FCFAFB; --p-panel-2:#F5F1F4;
  --p-ink:#1A151E; --p-muted:#6B6070; --p-faint:#9A8FA0;
  --p-line:rgba(26,21,30,.13); --p-line-2:rgba(26,21,30,.07);
  --p-accent:#8A2E63; --p-accent-soft:rgba(138,46,99,.10);
  --p-shadow:rgba(26,21,30,.13);
  --f-display:"Archivo","Helvetica Neue",Arial,sans-serif;
  --f-body:"Newsreader","Iowan Old Style",Georgia,serif;
  --f-mono:"IBM Plex Mono","SF Mono",ui-monospace,Menlo,monospace;
  --f-cjk:"PingFang HK","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
}
:root:not([data-theme="light"]){ }
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --p-ground:#131017; --p-panel:#1C1721; --p-panel-2:#231C29;
    --p-ink:#EFE9F0; --p-muted:#A497AA; --p-faint:#7A6C80;
    --p-line:rgba(239,233,240,.15); --p-line-2:rgba(239,233,240,.07);
    --p-accent:#E88CC0; --p-accent-soft:rgba(232,140,192,.14);
    --p-shadow:rgba(0,0,0,.55);
  }
}
:root[data-theme="dark"]{
  --p-ground:#131017; --p-panel:#1C1721; --p-panel-2:#231C29;
  --p-ink:#EFE9F0; --p-muted:#A497AA; --p-faint:#7A6C80;
  --p-line:rgba(239,233,240,.15); --p-line-2:rgba(239,233,240,.07);
  --p-accent:#E88CC0; --p-accent-soft:rgba(232,140,192,.14);
  --p-shadow:rgba(0,0,0,.55);
}
*{box-sizing:border-box}
body{background:var(--p-ground);color:var(--p-ink);font-family:var(--f-body);font-size:16px;line-height:1.55;margin:0}
.wrap{max-width:1180px;margin:0 auto;padding:40px 24px 96px}
a{color:var(--p-accent)}
:focus-visible{outline:2px solid var(--p-accent);outline-offset:3px;border-radius:4px}

/* ============ masthead ============ */
.mast{display:flex;flex-direction:column;gap:14px;padding-bottom:26px;border-bottom:1px solid var(--p-line)}
.eyebrow{font-family:var(--f-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--p-accent);margin:0}
h1{font-family:var(--f-display);font-weight:800;font-size:clamp(32px,5vw,52px);line-height:1.02;letter-spacing:-.025em;margin:0;text-wrap:balance}
.lede{font-size:18px;line-height:1.5;color:var(--p-muted);max-width:60ch;margin:0;font-weight:300}
.lede b{color:var(--p-ink);font-weight:400}
.bench{display:flex;flex-wrap:wrap;gap:0;margin:10px 0 0;border:1px solid var(--p-line);border-radius:3px;overflow:hidden;background:var(--p-panel)}
.bench div{flex:1 1 150px;padding:11px 14px;border-right:1px solid var(--p-line-2)}
.bench div:last-child{border-right:0}
.bench dt{font-family:var(--f-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--p-faint);margin:0 0 3px}
.bench dd{font-family:var(--f-display);font-weight:600;font-size:19px;margin:0;font-variant-numeric:tabular-nums}
.bench dd small{font-family:var(--f-mono);font-size:11px;font-weight:400;color:var(--p-muted);margin-left:3px}
.bench .cjk{font-family:var(--f-cjk)}

/* ============ console ============ */
.console{position:sticky;top:0;z-index:40;margin:0 -24px 30px;padding:12px 24px;background:color-mix(in srgb,var(--p-ground) 88%,transparent);
  -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid var(--p-line);
  display:flex;flex-wrap:wrap;align-items:center;gap:8px 20px}
.grp{display:flex;align-items:center;gap:7px;min-width:0}
.grp>span.k{font-family:var(--f-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--p-faint);white-space:nowrap}
.chips{display:flex;flex-wrap:wrap;gap:5px}
button.chip{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.02em;padding:5px 10px;border-radius:999px;border:1px solid var(--p-line);
  background:transparent;color:var(--p-muted);cursor:pointer;transition:background .15s,color .15s,border-color .15s}
button.chip:hover{border-color:var(--p-accent);color:var(--p-ink)}
button.chip[aria-pressed="true"]{background:var(--p-accent);border-color:var(--p-accent);color:#fff}
:root[data-theme="dark"] button.chip[aria-pressed="true"], @media (prefers-color-scheme:dark){}
input[type=range]{accent-color:var(--p-accent);width:110px}
.meter{width:52px;height:6px;border-radius:3px;background:var(--p-line-2);overflow:hidden}
.meter i{display:block;height:100%;width:0;background:var(--p-accent);border-radius:3px}

/* ============ contact sheet ============ */
.sheet{display:grid;grid-template-columns:repeat(auto-fill,minmax(462px,1fr));gap:26px;margin-top:4px}
@media (max-width:1000px){.sheet{grid-template-columns:1fr}}
.card{background:var(--p-panel);border:1px solid var(--p-line);border-radius:6px;display:flex;flex-direction:column;overflow:hidden;
  transition:box-shadow .2s,border-color .2s}
.card[data-picked="true"]{border-color:var(--p-accent);box-shadow:0 0 0 1px var(--p-accent),0 14px 34px var(--p-shadow)}
.card-head{display:flex;align-items:baseline;gap:10px;padding:16px 18px 10px}
.num{font-family:var(--f-mono);font-size:11px;color:var(--p-faint);letter-spacing:.1em;padding-top:4px}
.name{font-family:var(--f-display);font-weight:700;font-size:21px;letter-spacing:-.015em;margin:0;flex:1}
.tag{font-family:var(--f-body);font-style:italic;font-weight:300;font-size:15px;color:var(--p-muted);line-height:1.4;margin:0;padding:0 18px 14px;max-width:52ch}

/* stages: each carries its OWN macOS-theme token set, independent of the page theme */
.stages{display:flex;flex-direction:column;border-top:1px solid var(--p-line-2);border-bottom:1px solid var(--p-line-2)}
.stage{position:relative;min-height:132px;display:flex;align-items:center;justify-content:center;padding:22px 18px;overflow:hidden;isolation:isolate}
.stage+.stage{border-top:1px solid var(--p-line-2)}
.stage[data-ground="light"]{--bg:#FCFAFB;--fg:#1A151E;--muted:#6B6070;--accent:#8A2E63;--ok:#2F7D53;--warn:#A8690C;--err:#B5372F;--shadow:rgba(26,21,30,.18);background:#E9E5E9;color:#1A151E}
.stage[data-ground="dark"]{--bg:#221C27;--fg:#EFE9F0;--muted:#9A8CA0;--accent:#E88CC0;--ok:#56C98A;--warn:#E8A63E;--err:#FF7C6E;--shadow:rgba(0,0,0,.6);background:#14111A;color:#EFE9F0}
.stage-tag{position:absolute;top:7px;left:10px;font-family:var(--f-mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;opacity:.42;z-index:1}
/* faint mock of the app underneath, so legibility is judged in context */
.mock{position:absolute;inset:auto 0 14px 18px;font-family:var(--f-mono);font-size:11.5px;opacity:.2;white-space:nowrap;pointer-events:none;user-select:none}
.mock .cjk{font-family:var(--f-cjk)}
.inst{display:flex;align-items:center;justify-content:center;max-width:100%;z-index:2}
.inst.broken::after{content:"animation script failed — CSS only";font-family:var(--f-mono);font-size:10px;opacity:.6}

.body{padding:14px 18px 0;font-size:14.5px;line-height:1.55;color:var(--p-muted);font-weight:300;max-width:58ch;flex:1}
.chipsrow{display:flex;flex-wrap:wrap;gap:5px;padding:12px 18px 0}
.risk{font-family:var(--f-mono);font-size:10.5px;padding:3px 8px;border-radius:3px;background:var(--p-panel-2);border:1px solid var(--p-line-2);color:var(--p-muted)}
details{padding:12px 18px 0}
summary{font-family:var(--f-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--p-accent);cursor:pointer}
details p{font-family:var(--f-mono);font-size:12px;line-height:1.6;color:var(--p-muted);margin:8px 0 0;white-space:pre-wrap}
.foot{display:flex;align-items:center;gap:12px;padding:16px 18px;margin-top:14px;border-top:1px solid var(--p-line-2)}
.scorebox{display:flex;gap:12px;flex:1;font-family:var(--f-mono);font-size:11px;color:var(--p-muted)}
.scorebox b{color:var(--p-ink);font-weight:500;font-variant-numeric:tabular-nums}
button.pick{font-family:var(--f-display);font-weight:600;font-size:13px;letter-spacing:.01em;padding:8px 18px;border-radius:4px;cursor:pointer;
  border:1px solid var(--p-accent);background:transparent;color:var(--p-accent);transition:background .15s,color .15s}
button.pick:hover{background:var(--p-accent-soft)}
.card[data-picked="true"] button.pick{background:var(--p-accent);color:#fff}
.savenote{padding:0 24px;font-family:var(--f-mono);font-size:11.5px;color:var(--p-muted);margin-top:26px}
footer{margin-top:44px;padding-top:20px;border-top:1px solid var(--p-line);font-family:var(--f-mono);font-size:11.5px;color:var(--p-faint);line-height:1.8}
footer b{color:var(--p-muted);font-weight:500}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001ms !important;transition-duration:.001ms !important}}
</style>

<style id="concept-css">
__CONCEPT_CSS__
</style>

<div class="wrap">
  <header class="mast">
    <p class="eyebrow">Inflow · hold-Right-Option HUD</p>
    <h1>Listening Pill Contact Sheet</h1>
    <p class="lede">Ten candidate replacements for the six-bar capsule, each running live on a <b>light</b> and a <b>dark</b> macOS ground. Pick one and the page saves it back.</p>
    <dl class="bench">
      <div><dt>Competitor p50</dt><dd>467<small>ms</small></dd></div>
      <div><dt>Competitor p90</dt><dd>1103<small>ms</small></dd></div>
      <div><dt>Sessions measured</dt><dd>1814</dd></div>
      <div><dt>Cantonese share</dt><dd>15<small>%</small></dd></div>
      <div><dt>Benchmark</dt><dd class="cjk" style="font-size:16px">秘塔回響 0.1.16</dd></div>
    </dl>
  </header>

  <div class="console">
    <div class="grp"><span class="k">State</span><div class="chips" id="states"></div></div>
    <div class="grp"><span class="k">Voice</span><div class="chips" id="levels"></div>
      <input type="range" id="manual" min="0" max="100" value="55" aria-label="Manual voice level" hidden>
      <div class="meter" aria-hidden="true"><i id="meterbar"></i></div>
    </div>
  </div>

  <main class="sheet" id="sheet"></main>
  <p class="savenote" id="savenote">Loading…</p>

  <footer>
    <b>How to read it.</b> Every pill runs the same simulated speech envelope at 30 Hz. Both grounds are live at once, so a HUD that only works in dark mode shows itself immediately.<br>
    <b>Ground truth.</b> The current build draws a 220×44 <code>.hudWindow</code> capsule with six white bars, hard-coded white text and no <code>NSAppearance</code> handling, so it looks identical in Light Mode.
  </footer>
</div>

<script>
const CONCEPTS = __PAYLOAD__;
const SCORES = __SCORES__;
const sheet = document.getElementById('sheet');
const instances = [];

const MOCKS = [
  ['let retries = 0  // exponential backoff', '上網查下 exponential backoff'],
  ['func transcribe(_ url: URL) throws -> String', '翻譯做英文'],
  ['// TODO: 改寫呢段', 'guard let sel = focused else { return }'],
];

function sandbox(root, src, n){
  if(!src) return null;
  const fakeDoc = {
    querySelector: s => root.querySelector(s),
    querySelectorAll: s => root.querySelectorAll(s),
    getElementById: id => root.querySelector('#' + (window.CSS && CSS.escape ? CSS.escape(id) : id)),
    createElement: (...a) => document.createElement(...a),
    createElementNS: (...a) => document.createElementNS(...a),
    addEventListener: () => {}, removeEventListener: () => {},
    documentElement: document.documentElement,
    body: root, head: document.head,
  };
  const fakeWin = { requestAnimationFrame: window.requestAnimationFrame.bind(window),
                    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
                    getComputedStyle: window.getComputedStyle.bind(window),
                    matchMedia: window.matchMedia.bind(window), CSS: window.CSS };
  try{
    const probe = ';try{if(typeof pill' + n + '_tick==="function")window.__tick=pill' + n + '_tick;}catch(e){}' +
                  ';try{if(typeof tick==="function")window.__tick=window.__tick||tick;}catch(e){}';
    const f = new Function('document','window','self','globalThis','root', src + probe + '\n;return window;');
    const w = f(fakeDoc, fakeWin, fakeWin, fakeWin, root);
    if(typeof w.__tick === 'function') return w.__tick;
    for(const k in w){ if(/^pill\d*_?tick$/i.test(k) && typeof w[k] === 'function') return w[k]; }
    for(const k in w){ if(typeof w[k] === 'function' && /tick/i.test(k)) return w[k]; }
    return null;
  }catch(e){ console.warn('concept ' + n + ' js failed', e); return null; }
}

CONCEPTS.forEach((c, ci) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.index = c.index;
  const risks = (c.risks || []).slice(0,3).map(r => '<span class="risk">' + esc(r.length > 68 ? r.slice(0,66) + '…' : r) + '</span>').join('');
  const s = SCORES[c.index];
  const scoreHTML = s ? ['distinct','feasible','readable','delight'].map(k => k.slice(0,4).toUpperCase() + ' <b>' + s[k] + '</b>').join(' · ') : 'not yet scored';
  card.innerHTML =
    '<div class="card-head"><span class="num">' + String(c.index).padStart(2,'0') + '</span><h2 class="name"></h2></div>' +
    '<p class="tag"></p>' +
    '<div class="stages">' +
      stageHTML('light','Light Mode', ci) +
      stageHTML('dark','Dark Mode', ci) +
    '</div>' +
    '<p class="body"></p>' +
    '<div class="chipsrow">' + risks + '</div>' +
    '<details><summary>AppKit implementation</summary><p></p></details>' +
    '<div class="foot"><div class="scorebox">' + scoreHTML + '</div><button class="pick" type="button">Pick this</button></div>';
  card.querySelector('.name').textContent = c.name;
  card.querySelector('.tag').textContent = c.tagline || '';
  card.querySelector('.body').textContent = c.concept || '';
  card.querySelector('details p').textContent = c.appkit || '';
  sheet.appendChild(card);

  card.querySelectorAll('.inst').forEach(inst => {
    inst.innerHTML = c.html;
    const pill = inst.querySelector('.pill') || inst.firstElementChild;
    const tick = sandbox(inst, c.js, c.index);
    if(c.js && !tick) inst.classList.add('broken');
    instances.push({ c, inst, pill, tick });
  });

  card.querySelector('button.pick').addEventListener('click', () => pick(c));
});

function stageHTML(ground, label, ci){
  const m = MOCKS[ci % MOCKS.length];
  return '<div class="stage" data-ground="' + ground + '">' +
    '<span class="stage-tag">' + label + '</span>' +
    '<span class="mock">' + esc(m[0]) + ' <span class="cjk">' + esc(m[1]) + '</span></span>' +
    '<div class="inst"></div></div>';
}
function esc(s){ return String(s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); }

/* ---------------- state + level engine ---------------- */
const STATES = ['auto','appear','listening','transcribing','transforming','searching','done','failed'];
const LABELS = {auto:'Auto demo',appear:'Appear',listening:'Listening',transcribing:'Transcribing',transforming:'Transforming',searching:'Searching',done:'Done',failed:'Failed'};
let mode = 'auto', levelMode = 'sim';
const SCRIPT = [
  ['appear',600],['listening',4200],['transcribing',900],['done',2600],
  ['appear',500],['listening',3200],['transcribing',800],['searching',1700],['done',3000],
  ['appear',500],['listening',2600],['transforming',1400],['done',2200],
  ['appear',500],['listening',1800],['transcribing',900],['failed',2200],
];
let scriptAt = 0, scriptT = 0, prevTs = 0;

const statesEl = document.getElementById('states');
STATES.forEach(s => {
  const b = document.createElement('button');
  b.className = 'chip'; b.type = 'button'; b.textContent = LABELS[s];
  b.setAttribute('aria-pressed', String(s === mode));
  b.addEventListener('click', () => { mode = s; scriptAt = 0; scriptT = 0;
    statesEl.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b))); });
  statesEl.appendChild(b);
});
const levelsEl = document.getElementById('levels');
const manual = document.getElementById('manual');
[['sim','Speech sim'],['manual','Manual'],['silent','Silent']].forEach(([k,label]) => {
  const b = document.createElement('button');
  b.className = 'chip'; b.type = 'button'; b.textContent = label;
  b.setAttribute('aria-pressed', String(k === levelMode));
  b.addEventListener('click', () => { levelMode = k; manual.hidden = (k !== 'manual');
    levelsEl.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b))); });
  levelsEl.appendChild(b);
});

function speechLevel(t){
  const gate = ((Math.sin(t * 0.5) + 1) / 2) < 0.16 ? 0 : 1;
  const syll = Math.pow(Math.abs(Math.sin(t * Math.PI * 2.3)), 0.55);
  const grain = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * 11.3) * Math.cos(t * 6.1));
  return Math.max(0, Math.min(1, gate * syll * grain * 0.94));
}

const meterbar = document.getElementById('meterbar');
let acc = 0;
function frame(ts){
  const dt = prevTs ? Math.min(ts - prevTs, 120) : 16; prevTs = ts;
  acc += dt;
  if(acc >= 32){
    acc = 0;
    const t = ts / 1000;
    let state = mode, kind = 'text';
    if(mode === 'auto'){
      scriptT += dt;
      if(scriptT > SCRIPT[scriptAt][1]){ scriptT = 0; scriptAt = (scriptAt + 1) % SCRIPT.length; }
      state = SCRIPT[scriptAt][0];
      const nearSearch = SCRIPT.slice(0, scriptAt + 1).reverse().find(s => s[0] === 'searching' || s[0] === 'appear');
      kind = (nearSearch && nearSearch[0] === 'searching') ? 'search' : 'text';
    } else if(mode === 'searching'){ kind = 'search'; }
    let lvl = 0;
    if(state === 'listening'){
      lvl = levelMode === 'sim' ? speechLevel(t) : levelMode === 'manual' ? manual.value / 100 : 0.02;
    }
    meterbar.style.width = Math.round(lvl * 100) + '%';
    for(const it of instances){
      if(it.pill){ it.pill.dataset.state = state; it.pill.dataset.kind = kind;
        it.pill.style.setProperty('--level', lvl.toFixed(3));
        it.inst.style.setProperty('--level', lvl.toFixed(3)); }
      if(it.tick){ try{ it.tick(lvl, state); }catch(e){} }
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------------- pick, saved back to Claude ---------------- */
const note = document.getElementById('savenote');
let db = null;
function render(pickIdx){
  document.querySelectorAll('.card').forEach(c => c.dataset.picked = String(+c.dataset.index === pickIdx));
}
function pick(c){
  render(c.index);
  const rec = { index: c.index, name: c.name, at: new Date().toISOString() };
  try{ localStorage.setItem('inflow.pill.pick', JSON.stringify(rec)); }catch(e){}
  if(db){
    db.doc('picks/pill').set(rec)
      .then(() => note.textContent = 'Picked #' + c.index + ' ' + c.name + ' — saved. Claude can read this back.')
      .catch(() => note.textContent = 'Picked #' + c.index + ' ' + c.name + ' — saved in this browser only.');
  } else {
    note.textContent = 'Picked #' + c.index + ' ' + c.name + ' — saved in this browser only. Tell Claude the number.';
  }
}
(function(){
  let local = null;
  try{ local = JSON.parse(localStorage.getItem('inflow.pill.pick') || 'null'); }catch(e){}
  if(local){ render(local.index); note.textContent = 'Current pick: #' + local.index + ' ' + local.name + '.'; }
  else note.textContent = 'No pick yet. ' + CONCEPTS.length + ' concepts shown.';
  if(window.claude && window.claude.use){
    window.claude.use('db').then(x => {
      db = x; if(!db) return;
      return db.doc('picks/pill').get().then(d => {
        const v = d && (d.data || d);
        if(v && v.index){ render(v.index); note.textContent = 'Current pick: #' + v.index + ' ' + v.name + ' — saved to Claude.'; }
      });
    }).catch(() => {});
  }
})();
</script>
'''

out = TPL.replace('__CONCEPT_CSS__', css_all).replace('__PAYLOAD__', payload).replace('__SCORES__', scores_json)
p = os.path.join(D, 'pill-sheet.html')
open(p, 'w').write(out)
print('wrote', p, len(out), 'bytes;', len(concepts), 'concepts; scores:', len(scores))
