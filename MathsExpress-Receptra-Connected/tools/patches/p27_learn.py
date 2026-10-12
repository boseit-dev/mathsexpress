import sys
p='public/deploy-app.js';s=open(p,encoding='utf-8').read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: sys.exit(f'expected {c} got {n}: {a[:90]}')
    s=s.replace(a,b)

# custom-question runs (teacher worksheets, mistake reviews, placement) render instead of "Task not found"
rep("  const { param: taskId } = routeFromHash();\n  const task = getTaskById(taskId);\n  if (!task) { view.innerHTML = `<div class=\"page\"><div class=\"card empty-state\"><div class=\"big\">?</div><h2>Task not found</h2>",
    "  const { param: taskId } = routeFromHash();\n  const task = getTaskById(taskId) || (currentGeneratedTask?.task && String(currentGeneratedTask.task.id)===String(taskId) ? currentGeneratedTask.task : null);\n  if (!task) { view.innerHTML = `<div class=\"page\"><div class=\"card empty-state\"><div class=\"big\">?</div><h2>Task not found</h2>")
rep("  if (!currentGeneratedTask || currentGeneratedTask.task.id !== task.id) currentGeneratedTask = createUniqueGeneratedTaskRun(task);\n  const run = currentGeneratedTask;\n  if(!canUseTeacherHub(account)&&Number(task.yearLevel)!==normaliseYearLevel(account.profile?.yearLevel)&&(!activeSchoolAssignment||activeSchoolAssignment.localOnly))return go('learn');",
    "  if (!currentGeneratedTask || currentGeneratedTask.task.id !== task.id) currentGeneratedTask = createUniqueGeneratedTaskRun(task);\n  const run = currentGeneratedTask;\n  if(!canUseTeacherHub(account)&&!run.customRun&&Number(task.yearLevel)!==normaliseYearLevel(account.profile?.yearLevel)&&(!activeSchoolAssignment||activeSchoolAssignment.localOnly))return go('learn');")
# placement result handled at completion
rep("    const accuracy = run.answered ? Math.round((run.correct / run.answered) * 100) : 0;\n    recordGeneratedTaskMastery(run,task,accuracy);",
    "    const accuracy = run.answered ? Math.round((run.correct / run.answered) * 100) : 0;\n    if(run.placement){ finishPlacement(run); return; }\n    if(!run.customRun) recordGeneratedTaskMastery(run,task,accuracy);")
# recency + attempt counts for the confidence score
rep("  const next={...state,\n    skillMasteryMap:{...(state.skillMasteryMap||{}),[skillStateKey(resolvedSkillId,task.yearLevel)]:blended},",
    "  const skillKey=skillStateKey(resolvedSkillId,task.yearLevel);\n  const next={...state,\n    skillLastPractised:{...(state.skillLastPractised||{}),[skillKey]:Date.now()},\n    skillAttemptCounts:{...(state.skillAttemptCounts||{}),[skillKey]:(Number(state.skillAttemptCounts?.[skillKey])||0)+1},\n    skillMasteryMap:{...(state.skillMasteryMap||{}),[skillKey]:blended},")
rep("'plannerTasks','weeklyGoalQuestions',","'plannerTasks','skillLastPractised','skillAttemptCounts','placementResult','weeklyGoalQuestions',")
# wrong generated answers are kept with the full question so they can come back in 2 days
rep("mistakeBook: [...(nextState.mistakeBook || []), { questionId:q.id, prompt:q.prompt, skill:currentGeneratedTask.task.skill || currentGeneratedTask.task.topic || 'Maths', correct:false, createdAt:new Date().toISOString()",
    "mistakeBook: [...(nextState.mistakeBook || []), { questionId:q.id, prompt:q.prompt, skill:currentGeneratedTask.task.skill || currentGeneratedTask.task.topic || 'Maths', correct:false, question:q, yourAnswer:String(raw??'').slice(0,120), explanation:String(q.workedSolution||q.explanation||(Array.isArray(q.hints)?q.hints.join(' '):'')).slice(0,600), dueAt:Date.now()+2*86400000, reviewCount:Number(currentGeneratedTask.reviewOf?.[q.id]||0), createdAt:new Date().toISOString()")

# Learn: simple top section, everything else folded away
rep("      ${skillFocusHtml()}\n      <section class=\"recommendation-control-bar\">",
    "      ${learnHubHtml(learnYearLevel)}\n      <details class=\"learn-browse\" ${learnBrowseOpen?'open':''}><summary data-action=\"toggle-learn-browse\">Browse all skills, recommendations and more</summary>\n      ${skillFocusHtml()}\n      <section class=\"recommendation-control-bar\">")
rep("<div class=\"grid two\">${lessonCards()}</div></section>` : ''}\n    </div>`;\n  const focusClass=selectedStudentClassId||null;",
    "<div class=\"grid two\">${lessonCards()}</div></section>` : ''}\n      </details>\n    </div>`;\n  const focusClass=selectedStudentClassId||null;")

LEARN=r"""
// ---- Learn hub (v11.5.27): topic progress bars with 10-question check-ins, skill map,
// confidence, wrong-question review and a placement test --------------------------------
let learnBrowseOpen=false;
function skillConfidence(skill){
  const key=skillStateKey(skill.id,skill.yearLevel);
  const mastery=Math.min(100,skillMasteryValue(skill.id,skill.yearLevel));
  const attempts=Number(state.skillAttemptCounts?.[key])||0;
  const last=Number(state.skillLastPractised?.[key])||0;
  const days=last?(Date.now()-last)/86400000:Infinity;
  const recency=days<=7?1:days>=60?0:1-(days-7)/53;
  const difficulty=Math.min(1,(Number(skill.yearLevel)||0)/12);
  // accuracy-based mastery, weighted up for harder skills, more evidence and recent practice
  const score=Math.round(mastery*0.55+Math.min(attempts,5)/5*20+recency*15+difficulty*10*(mastery/100));
  return {score:Math.max(0,Math.min(100,score)),label:score>=75?'High':score>=45?'Medium':'Low',attempts,days};
}
function topicRows(year){
  const skills=getCurriculumSkills({yearLevel:year});
  const map=new Map();
  for(const sk of skills){ const k=sk.topic||sk.strand||'Maths'; if(!map.has(k))map.set(k,[]); map.get(k).push(sk); }
  return [...map.entries()].map(([topic,list])=>{
    const masteries=list.map(sk=>Math.min(100,skillMasteryValue(sk.id,sk.yearLevel)));
    const mastered=masteries.filter(m=>m>=80).length;
    const frontier=list.find((sk,i)=>masteries[i]<80)||null;
    const conf=list.map(skillConfidence); const avgConf=Math.round(conf.reduce((a,c)=>a+c.score,0)/Math.max(1,conf.length));
    return {topic,skills:list,mastered,total:list.length,pct:Math.round(mastered/Math.max(1,list.length)*100),frontier,confidence:avgConf};
  });
}
function dueMistakes(){ return (state.mistakeBook||[]).filter(m=>m&&m.question&&!m.reviewed&&Number(m.dueAt||0)<=Date.now()); }
function learnHubHtml(year){
  const rows=topicRows(year);
  const due=dueMistakes();
  const placement=state.placementResult;
  const showPlacement=!placement&&account.profile?.role==='player';
  return `<section class="learn-hub">
    ${showPlacement?`<article class="learn-hub-card placement-card"><div><span class="eyebrow">New here?</span><h2>Find your level</h2><p>A short 12-question check finds your real level in each strand and sets your starting path.</p></div><button class="btn primary" data-action="start-placement">Start placement test</button></article>`:''}
    ${due.length?`<article class="learn-hub-card review-card"><div><span class="eyebrow">Due for review</span><h2>${due.length} question${due.length===1?'':'s'} from your mistakes</h2><p>Questions you got wrong come back after a couple of days, with the worked solution.</p></div><div class="simple-actions"><button class="btn primary" data-action="start-mistake-review">Review now</button><button class="btn ghost" data-action="open-mistake-explanations">See explanations</button></div></article>`:''}
    <div class="learn-hub-head"><div><span class="eyebrow">${escapeHtml(yearLabel(year))}</span><h2>Your topics</h2></div><button class="btn secondary small" data-action="open-skill-map" data-year="${year}">Skill map</button></div>
    <div class="topic-progress-list">${rows.map(r=>`<article class="topic-progress"><div class="topic-progress-top"><strong>${escapeHtml(r.topic)}</strong><span>${r.mastered}/${r.total} skills · confidence ${r.confidence>=75?'high':r.confidence>=45?'medium':'low'}</span></div><div class="topic-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${r.pct}" aria-label="${escapeHtml(r.topic)} progress"><i style="width:${r.pct}%"></i></div><div class="topic-progress-actions">${r.frontier?`<small>Next: ${escapeHtml(r.frontier.title)}</small><button class="btn primary small" data-action="start-topic-checkin" data-skill-id="${escapeHtml(r.frontier.id)}" data-skill-year="${r.frontier.yearLevel}">10-question check-in</button>`:'<small>Topic mastered</small><span class="tag green">✓</span>'}</div></article>`).join('')}</div>
  </section>`;
}
function skillMapHtml(year){
  const skills=getCurriculumSkills({yearLevel:year});
  const strands=[...new Set(skills.map(s=>s.strand))];
  const status=sk=>{ const m=Math.min(100,skillMasteryValue(sk.id,sk.yearLevel)); const a=Number(state.skillAttemptCounts?.[skillStateKey(sk.id,sk.yearLevel)])||0;
    return m>=80?'mastered':m>=40?'learning':(a>0||m>0)?'needs-work':'not-started'; };
  return `<div class="skill-map"><div class="skill-map-legend"><span class="mastered">Mastered</span><span class="learning">Learning</span><span class="needs-work">Needs work</span><span class="not-started">Not started</span></div>
    ${strands.map(st=>{ const list=skills.filter(s=>s.strand===st); return `<section class="skill-map-strand"><h3>${escapeHtml(st)}</h3><div class="skill-map-row">${list.map((sk,i)=>{ const next=list[i+1]; const stt=status(sk); return `<button class="skill-node ${stt}" data-action="skill-map-node" data-skill-id="${escapeHtml(sk.id)}" data-skill-year="${sk.yearLevel}" title="${escapeHtml(sk.title)}${next?` → unlocks ${escapeHtml(next.title)}`:''}"><b>${escapeHtml(sk.title)}</b><small>${Math.round(Math.min(100,skillMasteryValue(sk.id,sk.yearLevel)))}%${next?` · unlocks ${escapeHtml(next.title)}`:''}</small></button>${next?'<span class="skill-arrow" aria-hidden="true">→</span>':''}`; }).join('')}</div></section>`; }).join('')}</div>`;
}
function openSkillMap(year){ openSimpleModal(`Skill map · ${yearLabel(year)}`,skillMapHtml(year)); }
function startCustomRun({id,title,questions,extra={}}){
  if(!questions.length)return showToast('Nothing to start','No questions are ready yet.');
  const task={id,title,skill:title,learningGoal:title,yearLevel:normaliseYearLevel(account.profile?.yearLevel),pathway:'Personal',difficulty:'mixed',type:'review',typeLabel:title,questionCount:questions.length,estimatedMinutes:Math.max(1,Math.round(questions.length*1.2)),masteryTarget:70,strand:'Mixed',topic:title,skillId:id};
  currentLesson=null; activeSchoolAssignment=null;
  currentGeneratedTask={task,runSeed:Date.now(),questions,index:0,current:questions[0],answered:0,correct:0,attempts:0,hintCount:0,selectedChoice:'',feedback:null,attemptHistory:[],questionResults:[],complete:false,startedAt:Date.now(),customRun:true,...extra};
  go('task',id);
}
function startMistakeReview(){
  if(planBlocksPractice())return;
  const due=dueMistakes().slice(0,10);
  const ids=new Set(due.map(m=>m.question?.id));
  const reviewOf={}; due.forEach(m=>{ reviewOf[m.question.id]=(Number(m.reviewCount)||0)+1; });
  persist({...state,mistakeBook:(state.mistakeBook||[]).map(m=>m&&ids.has(m.question?.id)&&!m.reviewed?{...m,reviewed:true,reviewedAt:Date.now()}:m)},{quiet:true});
  startCustomRun({id:`review-${Date.now()}`,title:'Mistake review',questions:due.map(m=>m.question),extra:{reviewOf}});
}
function openMistakeExplanations(){
  const items=(state.mistakeBook||[]).filter(m=>m&&m.question&&!m.reviewed).slice(-15).reverse();
  openSimpleModal('Why these were wrong',`<div class="mistake-explain-list">${items.map(m=>`<article><strong>${mathHtml?mathHtml(m.prompt||''):escapeHtml(m.prompt||'')}</strong><p><span>Your answer:</span> ${escapeHtml(m.yourAnswer||'—')}</p><p><span>How to solve it:</span> ${mathHtml?mathHtml(m.explanation||'Use the hints and worked example for this skill.'):escapeHtml(m.explanation||'')}</p><small>Comes back ${Number(m.dueAt)<=Date.now()?'now':new Date(m.dueAt).toLocaleDateString()}</small></article>`).join('')||'<p>No saved mistakes yet.</p>'}</div>`);
}
function startPlacementTest(){
  const year=normaliseYearLevel(account.profile?.yearLevel);
  const years=[...new Set([Math.max(0,year-1),year,Math.min(12,year+1)])];
  const strands=[...new Set(getCurriculumSkills({yearLevel:year}).map(s=>s.strand))].slice(0,4);
  const questions=[]; const meta=[];
  for(const st of strands){
    for(const y of years){
      const skill=getCurriculumSkills({yearLevel:y}).find(s=>s.strand===st);
      const task=skill&&taskForLearningSkill(skill,'adaptive',3);
      if(!task)continue;
      try{ const q=createGeneratedTaskRun(task,{runSeed:Date.now()+questions.length*7919}).questions[0]; if(q){ questions.push(q); meta.push({strand:st,year:y,skillId:skill.id}); } }catch{}
    }
  }
  startCustomRun({id:`placement-${Date.now()}`,title:'Placement test',questions,extra:{placement:meta}});
}
function finishPlacement(run){
  const results=Array.isArray(run.questionResults)?run.questionResults:[];
  const byStrand={};
  run.placement.forEach((m,i)=>{ const r=results[i]; const ok=Boolean(r?.correct??r?.firstAttemptCorrect); byStrand[m.strand]=byStrand[m.strand]||{level:null,tried:[]}; byStrand[m.strand].tried.push({year:m.year,ok}); if(ok) byStrand[m.strand].level=Math.max(byStrand[m.strand].level??-1,m.year); });
  const ownYear=normaliseYearLevel(account.profile?.yearLevel);
  const map={...(state.skillMasteryMap||{})};
  const summary=[];
  for(const [strand,info] of Object.entries(byStrand)){
    const level=info.level==null?Math.max(0,ownYear-2):info.level;
    summary.push({strand,level});
    // Skills below the level found are treated as already secure so the path starts at the right place.
    for(let y=Math.max(0,level-2);y<level;y++) for(const sk of getCurriculumSkills({yearLevel:y}).filter(s=>s.strand===strand)){ const k=skillStateKey(sk.id,sk.yearLevel); map[k]=Math.max(Number(map[k])||0,80); }
  }
  persist({...state,skillMasteryMap:map,placementResult:{date:new Date().toISOString(),strands:summary}},{quiet:true});
  const view=document.getElementById('app-view');
  view.innerHTML=`<div class="page"><div class="card finish-card pop">${cloveHtml('done')}<span class="eyebrow">Placement complete</span><h2>Your starting levels</h2><div class="simple-list">${summary.map(x=>`<div><strong>${escapeHtml(x.strand)}</strong><span>Working at ${escapeHtml(yearLabel(x.level))} level</span></div>`).join('')}</div><p class="muted">Your Learn page now starts each topic at the right place.</p><div class="hero-actions" style="justify-content:center"><button class="btn primary" data-route="learn">See my path</button></div></div></div>`;
}
"""
rep("let toolSearchQuery='';",LEARN.strip()+"\nlet toolSearchQuery='';")
rep("  if (action === 'claim-season-reward') {","""  if (action === 'toggle-learn-browse') { learnBrowseOpen=!learnBrowseOpen; return; }
  if (action === 'open-skill-map') { return openSkillMap(normaliseYearLevel(actionEl.dataset.year,account.profile?.yearLevel)); }
  if (action === 'skill-map-node' || action === 'start-topic-checkin') { const y=normaliseYearLevel(actionEl.dataset.skillYear,account.profile?.yearLevel); const skill=getCurriculumSkill(y,actionEl.dataset.skillId)||CURRICULUM.find(x=>x.id===actionEl.dataset.skillId); const task=taskForLearningSkill(skill,'adaptive',10); if(!task)return showToast('Check-in unavailable','Try another skill.'); document.getElementById('modal-root').innerHTML=''; activeSchoolAssignment=null; return startGeneratedTask(task.id,{returnRoute:'learn'}); }
  if (action === 'start-mistake-review') { return startMistakeReview(); }
  if (action === 'open-mistake-explanations') { return openMistakeExplanations(); }
  if (action === 'start-placement') { if(planBlocksPractice())return; return startPlacementTest(); }
  if (action === 'claim-season-reward') {""")
open(p,'w',encoding='utf-8').write(s);print('ok')
