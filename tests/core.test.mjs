import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../assets/catalog.mjs';
import {matches,modelLabel,effortLabel,cleanSelection,toggleSelection,speechLevel,timeline} from '../assets/core.mjs';
test('original ten and new three remain selectable by provider',()=>{
 const filter=provider=>catalog.concepts.filter(c=>matches(c,catalog.runs.find(r=>r.id===c.run_id),{provider}));
 assert.equal(filter('Anthropic').length,10);assert.equal(filter('OpenAI').length,3);
 assert.equal(filter('Google DeepMind').length,4);
 assert.equal(filter('').length,17);
});
test('unknown metadata remains unknown, family is not an exact version',()=>{
 assert.equal(modelLabel({}), '未記錄');assert.equal(effortLabel({}), '未記錄');
 assert.equal(modelLabel({model_family:'GPT-6'}),'GPT-6 · 版本未記錄');
});
test('shared selection removes invalid and duplicate IDs and limits comparison to three',()=>{
 const valid=catalog.concepts.map(c=>c.id);
 assert.deepEqual(cleanSelection(['invalid',valid[0],valid[0],...valid.slice(10)],valid),[valid[0],valid[10],valid[11]]);
 assert.deepEqual(toggleSelection([valid[0],valid[10]],valid[0],valid),[valid[10]]);
});
test('scenario workflows finish and include only relevant processing state',()=>{
 assert.deepEqual(timeline('search').map(x=>x[0]),['appear','listening','transcribing','searching','done']);
 assert.ok(timeline('rewrite').some(x=>x[0]==='transforming'));
 assert.equal(timeline('dictate').at(-1)[0],'done');
});
test('simulated speech remains bounded and changes over time',()=>{
 const levels=Array.from({length:1000},(_,i)=>speechLevel(i/30));
 assert.ok(levels.every(x=>Number.isFinite(x)&&x>=0&&x<=1));assert.ok(Math.max(...levels)>.5);assert.ok(Math.min(...levels)<.01);
});
