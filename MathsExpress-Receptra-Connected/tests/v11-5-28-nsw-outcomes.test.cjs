const test=require('node:test');const assert=require('node:assert');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const official=new Set(fs.readFileSync(path.join(__dirname,'fixtures/nsw-outcome-codes-2026-10.txt'),'utf8').split('\n').filter(l=>!l.startsWith('#')).join(' ').split(/\s+/).filter(Boolean));
function curriculum(){
  const src=fs.readFileSync(path.join(__dirname,'..','public/deploy-core-1.js'),'utf8');
  const s=src.indexOf('__modules["src/data/curriculum.js"]'),e=src.indexOf('__modules["src/data/task-library.js"]');
  const ctx={Object,Array,Set,Map,Number,String,Math,RegExp,JSON,Error};ctx.globalThis=ctx;
  vm.runInNewContext('var __modules={};'+src.slice(s,e)+';this.C=__modules["src/data/curriculum.js"];',ctx);return ctx.C;
}
test('every K–12 skill maps to a current, official NSW outcome code for its stage',()=>{
  const C=curriculum(); const bad=[];
  const prefix=y=>y===0?'MAE-':y<=2?'MA1-':y<=4?'MA2-':y<=6?'MA3-':y<=8?'MA4-':y<=10?'MA5-':'';
  for(const sk of C.CURRICULUM){
    const codes=C.nswOutcomesForSkill(sk);
    for(const c of codes) if(!official.has(c)) bad.push(`${sk.yearLevel}:${sk.id} -> ${c} (not official)`);
    const main=codes.find(c=>c!=='MAO-WM-01');
    if(!main){ bad.push(`${sk.yearLevel}:${sk.id} has no content outcome`); continue; }
    const y=Number(sk.yearLevel);
    if(y<=10&&!main.startsWith(prefix(y))) bad.push(`${sk.yearLevel}:${sk.id} -> ${main} (wrong stage)`);
    if(y>=11&&!/^(MST|MAV|ME1)-1[12]/.test(main)) bad.push(`${sk.yearLevel}:${sk.id} -> ${main} (not Stage 6)`);
    if(y>=11&&!main.includes(`-${y}-`)) bad.push(`${sk.yearLevel}:${sk.id} -> ${main} (wrong year)`);
  }
  assert.deepEqual(bad.slice(0,15),[],`${bad.length} problems`);
});
test('spot checks map to the right outcome',()=>{
  const C=curriculum();
  const m=(y,title,extra={})=>C.nswOutcomesForSkill({yearLevel:y,title,topic:'',strand:'',generator:'',...extra})[0];
  assert.equal(m(7,'Adding and subtracting integers'),'MA4-INT-C-01');
  assert.equal(m(8,'Pythagoras’ theorem'),'MA4-PYT-C-01');
  assert.equal(m(10,'Logarithm laws'),'MA5-LOG-P-01');
  assert.equal(m(12,'Integration',{pathway:'Advanced'}),'MAV-12-05');
  assert.equal(m(12,'Financial mathematics and annuities',{pathway:'Standard'}),'MST-12-S2-03');
  assert.equal(m(0,'Counting to 20'),'MAE-RWN-01');
});
