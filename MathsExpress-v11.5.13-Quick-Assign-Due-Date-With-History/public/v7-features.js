'use strict';
var __modules = window.__modules || (window.__modules = Object.create(null));
__modules["src/core/v7-features.js"]=(()=>{
const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
const clean=(v,max=240)=>String(v??'').trim().replace(/\s+/g,' ').slice(0,max);
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const seeded=(seed)=>{let x=(hash(seed)||1)>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};};

function normalizeMathExpression(expr=''){
  return String(expr)
    .replace(/[×·]/g,'*').replace(/÷/g,'/')
    .replace(/[−–—]/g,'-').replace(/π/gi,'pi')
    .replace(/√\s*\(([^()]*)\)/g,'sqrt($1)')
    .replace(/\^/g,'**').replace(/\s+/g,'')
    .replace(/(\d)([a-zA-Z])/g,'$1*$2')
    .replace(/([a-zA-Z])(\d)/g,'$1*$2')
    .replace(/\)([a-zA-Z0-9])/g,')*$1')
    .replace(/([a-zA-Z0-9])\(/g,'$1*(');
}
function safeEvalExpression(expr='',vars={}){
  try {
    const value=globalThis.MXSafeMath?.evaluate?.(String(expr||''),vars);
    return Number.isFinite(Number(value))?Number(value):NaN;
  } catch { return NaN; }
}
function symbolicEquivalent(a,b,{variables=['x'],tolerance=1e-7}={}){
  const left=String(a??'').trim(),right=String(b??'').trim();
  if(!left||!right)return{equivalent:false,reason:'Enter both expressions.'};
  if(normalizeMathExpression(left)===normalizeMathExpression(right))return{equivalent:true,reason:'Same simplified expression.'};
  const samples=[-4,-2.5,-1,.5,1.5,3,5]; let valid=0;
  for(let i=0;i<samples.length;i++){
    const vars={}; variables.forEach((v,j)=>vars[v]=samples[(i+j)%samples.length]);
    const l=safeEvalExpression(left,vars),r=safeEvalExpression(right,vars);
    if(!Number.isFinite(l)||!Number.isFinite(r))continue;
    valid++;
    const scale=Math.max(1,Math.abs(l),Math.abs(r));
    if(Math.abs(l-r)>tolerance*scale)return{equivalent:false,reason:`They differ for ${variables.map(v=>`${v}=${vars[v]}`).join(', ')}.`};
  }
  return valid>=3?{equivalent:true,reason:`Equivalent across ${valid} independent checks.`}:{equivalent:false,reason:'Could not safely evaluate enough test values.'};
}
function graphMatch(points=[],expression='',tolerance=.35){
  const valid=points.filter(p=>Number.isFinite(Number(p.x))&&Number.isFinite(Number(p.y)));
  if(!valid.length)return{correct:false,matched:0,total:0};
  let matched=0;
  for(const p of valid){const expected=safeEvalExpression(expression,{x:Number(p.x)});if(Number.isFinite(expected)&&Math.abs(expected-Number(p.y))<=tolerance)matched++;}
  return{correct:matched===valid.length,matched,total:valid.length,accuracy:matched/valid.length};
}
function updateTrueMastery({mastery=0,correct=false,hintsUsed=0,difficulty='medium',responseTimeMs=0,daysSincePractice=0}={}){
  const base={easy:5,medium:7,hard:10}[difficulty]||7;
  const hintPenalty=Math.min(5,Math.max(0,Number(hintsUsed)||0)*1.5);
  const speedBonus=responseTimeMs>0&&responseTimeMs<30000?1:0;
  const decay=Math.min(12,Math.max(0,Number(daysSincePractice)||0)*.25);
  const delta=correct?Math.max(1,base-hintPenalty+speedBonus):-Math.max(3,Math.round(base*.75));
  return Math.round(clamp(Number(mastery)+delta-decay,0,100));
}
function prerequisiteMap(skills=[]){
  const byId=new Map(skills.map(s=>[s.id,s]));
  return skills.map((s,i)=>{
    const explicit=Array.isArray(s.prerequisites)?s.prerequisites.filter(id=>byId.has(id)):[];
    const fallback=!explicit.length&&i>0&&skills[i-1]?.strand===s.strand?[skills[i-1].id]:[];
    const prereqs=explicit.length?explicit:fallback;
    return{...s,prerequisites:prereqs,unlocked:prereqs.every(id=>Number(byId.get(id)?.mastery||0)>=60)};
  });
}
function buildInterventionGroupsV7(students=[]){
  const groups={support:[],revision:[],core:[],extension:[]};
  for(const s of students){
    const vals=Object.values(s.mastery||{}).map(Number).filter(Number.isFinite);
    const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:Number(s.accuracy||0);
    const target=avg<=40?'support':avg<=60?'revision':avg>=85?'extension':'core';
    groups[target].push({...s,averageMastery:Math.round(avg)});
  }
  return groups;
}
function misconceptionAnalytics(attempts=[]){
  const types=new Map();
  for(const a of attempts){
    let type=clean(a.errorType||'',60);
    if(!type){
      const expected=String(a.expected??''),actual=String(a.actual??'');
      if(expected&&actual&&expected.replace('-','')===actual.replace('-','')&&expected!==actual)type='sign error';
      else if(a.hintsUsed>=2)type='method uncertainty';
      else if(/fraction|denominator/i.test(a.topic||a.prompt||''))type='fraction setup';
      else if(/equation|algebra/i.test(a.topic||a.prompt||''))type='algebra manipulation';
      else type='arithmetic / concept';
    }
    const r=types.get(type)||{type,count:0,students:new Set()};r.count++;if(a.studentId)r.students.add(a.studentId);types.set(type,r);
  }
  return[...types.values()].map(r=>({type:r.type,count:r.count,studentCount:r.students.size})).sort((a,b)=>b.count-a.count);
}
function questionAnalytics(attempts=[]){
  const map=new Map();
  for(const a of attempts){const id=clean(a.questionId||a.id||a.prompt||'question',120);const r=map.get(id)||{id,prompt:clean(a.prompt||id,180),attempts:0,correct:0,skips:0,totalMs:0};r.attempts++;if(a.correct)r.correct++;if(a.skipped)r.skips++;r.totalMs+=Math.max(0,Number(a.responseTimeMs)||0);map.set(id,r);}
  return[...map.values()].map(r=>({...r,accuracy:r.attempts?r.correct/r.attempts:0,avgSeconds:r.attempts?Math.round(r.totalMs/r.attempts/1000):0,flag:r.attempts>=4&&r.correct/r.attempts<.2?'possibly-too-hard':r.attempts>=4&&r.correct/r.attempts>.95?'possibly-too-easy':r.skips/r.attempts>.45?'frequently-skipped':'ok'})).sort((a,b)=>a.accuracy-b.accuracy);
}
function outcomeMap(skills=[]){
  const prefixes=['MA4-NUM-C','MA4-ALG-C','MA4-GEO-C','MA5-NUM-C','MA5-ALG-C','MA5-MAG-C','MA5-STA-C'];
  return skills.map((s,i)=>({...s,outcome:(s.outcomes&&s.outcomes[0])||`${prefixes[i%prefixes.length]}-${String((i%6)+1).padStart(2,'0')}`}));
}
function reportComment({name='Student',accuracy=0,mastery=0,completed=0,weakSkills=[],strongSkills=[]}={}){
  const strength=strongSkills[0]||'recent classwork'; const focus=weakSkills[0]||'continued mixed revision';
  const effort=completed>=10?'has worked consistently':'is building a more consistent practice routine';
  return `${name} ${effort} and is currently achieving about ${Math.round(Number(accuracy)||0)}% accuracy with ${Math.round(Number(mastery)||0)}% average mastery. A current strength is ${strength}. The next focus should be ${focus}, with regular practice and checking working carefully.`;
}
function dailyPuzzle(dateKey=new Date().toISOString().slice(0,10),yearLevel=9){
  const r=seeded(`${dateKey}:${yearLevel}`); const a=3+Math.floor(r()*9),b=2+Math.floor(r()*7),c=1+Math.floor(r()*8),x=2+Math.floor(r()*8); const rhs=a*x+b-c;
  return{id:`daily-${dateKey}-${yearLevel}`,dateKey,yearLevel,prompt:`A number x satisfies ${a}x + ${b} − ${c} = ${rhs}. What is x?`,answer:String(x),explanation:`Combine the constants, then use inverse operations. The answer is x = ${x}.`};
}
function seasonDefinition(date=new Date()){
  const y=date.getFullYear(),m=date.getMonth(); const term=m<3?1:m<6?2:m<9?3:4;
  return{id:`${y}-T${term}`,name:`${y} Term ${term} Season`,theme:['Launch','Momentum','Mastery','Finals'][term-1],quests:[{id:'practice-50',label:'Answer 50 questions',target:50},{id:'master-3',label:'Master 3 skills',target:3},{id:'puzzle-5',label:'Complete 5 daily puzzles',target:5}]};
}
const SAFE_MESSAGES=Object.freeze(['Good game!','Nice work!','Want a rematch?','Great comeback!','Good luck!','That was close!','Well played!','Let’s practise again.']);
function safeMessages(){return[...SAFE_MESSAGES];}
function adventureWorlds(){return[
  {id:'number-harbour',name:'Number Harbour',skills:['fractions','percentages','indices'],boss:'The Ratio Kraken'},
  {id:'algebra-forest',name:'Algebra Forest',skills:['expressions','equations','linear graphs'],boss:'The Variable Warden'},
  {id:'geometry-peaks',name:'Geometry Peaks',skills:['angles','pythagoras','trigonometry'],boss:'The Triangle Guardian'},
  {id:'data-city',name:'Data City',skills:['statistics','probability','data displays'],boss:'The Chance Engine'},
];}
function escapeRoom(seed='default'){const r=seeded(seed);return{rooms:Array.from({length:5},(_,i)=>({id:`room-${i+1}`,title:['Code Door','Pattern Hall','Graph Vault','Probability Lock','Final Chamber'][i],difficulty:['easy','medium','medium','hard','hard'][i],code:String(100+Math.floor(r()*900))}))};}
function portfolioSnapshot({name='Student',mastery={},achievements=[],feedback=[],bestWork=[]}={}){
  const vals=Object.values(mastery).map(Number).filter(Number.isFinite);return{name,averageMastery:vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0,achievements:achievements.slice(-12),feedback:feedback.slice(-8),bestWork:bestWork.slice(-8),createdAt:new Date().toISOString()};
}
function certificateData({name='Student',title='MathsExpress Achievement',reason='Outstanding progress'}={}){return{id:`cert-${Date.now()}`,name:clean(name,80),title:clean(title,120),reason:clean(reason,240),issuedAt:new Date().toISOString()};}
function qualityCheckQuestion(q={}){
  const issues=[]; const prompt=clean(q.prompt,1200); if(prompt.length<8)issues.push('Prompt is too short.'); if(q.answer==null||String(q.answer).trim()==='')issues.push('Missing answer.');
  if(Array.isArray(q.options)){const uniq=new Set(q.options.map(x=>String(x).trim().toLowerCase()));if(uniq.size!==q.options.length)issues.push('Duplicate answer options.');if(q.options.length<3)issues.push('Use at least 3 options.');}
  if(/always|never|obvious|stupid/i.test(prompt))issues.push('Wording may be unnecessarily absolute or discouraging.');
  return{ok:issues.length===0,issues,score:Math.max(0,100-issues.length*20)};
}
function teacherCopilot({topic='Algebra',yearLevel=9,minutes=50}={}){
  const m=Math.max(20,Math.min(90,Number(minutes)||50)); return{topic,yearLevel,minutes:m,segments:[
    {name:'Do now',minutes:5,detail:`Retrieval questions from earlier ${topic} skills.`},
    {name:'Explicit teaching',minutes:Math.round(m*.25),detail:`Model the new ${topic} method with one worked example.`},
    {name:'Guided practice',minutes:Math.round(m*.25),detail:'Students complete examples with immediate feedback.'},
    {name:'Independent practice',minutes:Math.round(m*.3),detail:'Adaptive questions with extension available.'},
    {name:'Exit ticket',minutes:5,detail:'Three questions: recall, application and reasoning.'},
  ],homework:`10 mixed ${topic} questions plus one reasoning question.`};
}
function privacySummary({eventCount=0,hasParentLinks=false,focusTracking=true}={}){return{stored:['account profile','learning progress','assignment attempts','school/class memberships','rewards'],notStored:['password plaintext','other website contents','external app contents','hidden keystrokes'],focusTracking:Boolean(focusTracking),eventCount:Number(eventCount)||0,hasParentLinks:Boolean(hasParentLinks)};}
function permissionCatalog(){return{
  student:['learn','submit-work','use-games','view-own-progress'],parent:['view-linked-child-summary','school-messages'],teacher:['manage-own-classes','assign-work','view-class-progress','send-feedback','run-live-class'],bug_tester:['beta-features','submit-priority-bugs'],content_editor:['edit-learning-content','resource-review'],support:['safe-account-diagnostics','feedback-review'],admin:['school-management','feature-rollouts','platform-status'],owner:['all-platform-controls','roles','audit','backups','permissions']
};}
function integrationCatalogV7(){return[
  {id:'google-sso',name:'Google school login',provider:'google',readyInCode:true,needs:'Enable Google provider + OAuth client in Supabase.'},
  {id:'microsoft-sso',name:'Microsoft school login',provider:'azure',readyInCode:true,needs:'Enable Azure provider + Entra app in Supabase.'},
  {id:'google-classroom',name:'Google Classroom sync',provider:null,readyInCode:true,needs:'Google Classroom OAuth/API credentials.'},
  {id:'microsoft-teams',name:'Microsoft Teams sync',provider:null,readyInCode:true,needs:'Microsoft Graph/Teams app credentials.'},
  {id:'csv-sis',name:'CSV / SIS import',provider:null,readyInCode:true,needs:'No provider required for CSV import.'},
];}
function parseCsv(textValue=''){
  const lines=String(textValue).split(/\r?\n/).filter(Boolean);if(!lines.length)return[];
  const split=line=>{const out=[];let cur='',quoted=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&line[i+1]==='"'&&quoted){cur+='"';i++;}else if(ch==='"')quoted=!quoted;else if(ch===','&&!quoted){out.push(cur.trim());cur='';}else cur+=ch;}out.push(cur.trim());return out;};
  const headers=split(lines[0]).map(h=>h.toLowerCase().replace(/\s+/g,'_'));
  return lines.slice(1).map(line=>{const vals=split(line);return Object.fromEntries(headers.map((h,i)=>[h,vals[i]??'']));});
}
function stagingPlan(features=[]){return features.map((f,i)=>({feature:typeof f==='string'?f:f.feature||f.id||`feature-${i+1}`,group:i===0?'bug-testers':i===1?'pilot-school':'percentage',percent:i<2?100:10,status:'staged'}));}
function schoolAchievement({schoolName='School',questions=0,mastered=0,challengeWins=0}={}){const unlocked=[];if(questions>=10000)unlocked.push('10,000 Questions');if(questions>=100000)unlocked.push('100,000 Questions');if(mastered>=250)unlocked.push('Mastery Milestone');if(challengeWins>=3)unlocked.push('Challenge Champions');return{schoolName,unlocked};}
function statusSnapshot({online=true,supabase=true,ai=true,serviceWorker=true}={}){const services=[['Website',online],['Supabase',supabase],['Smart AI',ai],['Offline cache',serviceWorker]].map(([name,ok])=>({name,ok:Boolean(ok)}));return{overall:services.every(x=>x.ok)?'operational':services.some(x=>x.ok)?'degraded':'outage',services};}

return {normalizeMathExpression,safeEvalExpression,symbolicEquivalent,graphMatch,updateTrueMastery,prerequisiteMap,buildInterventionGroupsV7,misconceptionAnalytics,questionAnalytics,outcomeMap,reportComment,dailyPuzzle,seasonDefinition,safeMessages,adventureWorlds,escapeRoom,portfolioSnapshot,certificateData,qualityCheckQuestion,teacherCopilot,privacySummary,permissionCatalog,integrationCatalogV7,parseCsv,stagingPlan,schoolAchievement,statusSnapshot};
})();
