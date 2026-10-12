const test=require('node:test');const assert=require('node:assert');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
function load(){
  const src=fs.readFileSync(path.join(__dirname,'..','public/deploy-core-1.js'),'utf8');
  const end=src.indexOf('__modules["src/core/progression.js"]');
  const ctx={console,Math,Date,JSON,Object,Array,Set,Map,Number,String,Boolean,Symbol,Proxy,Reflect,Error,RegExp,isFinite,parseInt,parseFloat,Intl};
  ctx.globalThis=ctx;ctx.window=ctx;
  vm.runInNewContext('var __modules={};'+src.slice(src.indexOf('__modules["src/data/questions.js"]'),end)+';this.M=__modules;',ctx);
  return ctx.M;
}
test('Year 12 senior skills generate HSC-level questions whose answers match the worked solution',()=>{
  const M=load();const lib=M['src/data/task-library.js'];const run=M['src/core/generated-task-runner.js'];const cur=M['src/data/curriculum.js'];
  const gens=['calculus-diff','calculus-int','logarithm','exponential','trig-function','sequence','polynomial','function-eval','probability-conditional','distribution','finance-annuity','trig-right'];
  const skills=cur.getCurriculumSkills({yearLevel:12}).filter(s=>gens.includes(s.generator));
  assert.ok(skills.length>=8,'senior skills found');
  let checked=0;
  for(const sk of skills.slice(0,14)){
    const found=lib.searchTaskLibrary({query:sk.title,yearLevel:12,limit:40});
    const tasks=(found.items||found.results||found||[]).filter(t=>t&&t.skillId===sk.id&&Number(t.yearLevel)===12).slice(0,2);
    for(const t of tasks){
      const r=run.createGeneratedTaskRun(t,{runSeed:12345});
      assert.ok(r.questions.length>=1,`${sk.id} produced questions`);
      for(const q of r.questions){
        assert.ok(String(q.prompt).length>10);
        assert.doesNotMatch(String(q.prompt),/log₁₀\(\d+\) equals|Find sin\((0|30|90)°\)/,'no Year 3-style basics in Year 12');
        if(q.type==='numeric') assert.ok(Number.isFinite(Number(q.answer)),`${q.prompt} has a numeric answer`);
        checked++;
      }
    }
  }
  assert.ok(checked>=10,`checked ${checked} questions`);
});
