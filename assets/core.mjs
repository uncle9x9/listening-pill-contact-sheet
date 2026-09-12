export const STATES = ['appear','listening','transcribing','transforming','searching','done','failed'];
export const STATE_LABELS = ['準備','聆聽','轉錄','改寫','搜尋','完成','失敗'];
export const UNKNOWN = '未記錄';
export function modelLabel(run) { return run.model || (run.model_family ? `${run.model_family} · 版本未記錄` : UNKNOWN); }
export function effortLabel(run) { return run.effort || UNKNOWN; }
export function matches(entry, run, filters) {
 return (!filters.provider || run.provider === filters.provider) && (!filters.model || modelLabel(run) === filters.model) && (!filters.effort || effortLabel(run) === filters.effort);
}
export function cleanSelection(ids,validIds) { return [...new Set(ids)].filter(id=>validIds.includes(id)).slice(0,3); }
export function toggleSelection(ids,id,validIds) { return ids.includes(id) ? ids.filter(x=>x!==id) : cleanSelection([...ids,id],validIds); }
export function speechLevel(t) {
 const gate=((Math.sin(t*.5)+1)/2)<.16?0:1;
 return Math.max(0,Math.min(1,gate*Math.pow(Math.abs(Math.sin(t*Math.PI*2.3)),.55)*(.72+.28*(.5+.5*Math.sin(t*11.3)*Math.cos(t*6.1)))*.94));
}
export function timeline(scenario) {
 const steps=[['appear',600],['listening',3400],['transcribing',1100]];
 if(scenario==='rewrite')steps.push(['transforming',1800]);
 if(scenario==='search')steps.push(['searching',1800]);
 return [...steps,['done',0]];
}
