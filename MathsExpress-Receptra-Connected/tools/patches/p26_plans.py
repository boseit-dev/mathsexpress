import sys
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for old,new,cnt in pairs:
        n=s.count(old)
        if n!=cnt: sys.exit(f'{p}: expected {cnt} got {n}: {old[:90]}')
        s=s.replace(old,new)
    open(p,'w',encoding='utf-8').write(s)

patch('deploy-core-1.js',[("  async claimDailyMission(missionId) {","""  async myPlan() { return unwrap(await this.client.rpc('mathsexpress_my_plan',{})) || {}; }
  async useHint(hintKey) { return unwrap(await this.client.rpc('mathsexpress_use_hint',{p_hint_key:String(hintKey||'').slice(0,200)})) || {}; }
  async ownerSetUserPlan(userId,plan,days=365) { return unwrap(await this.client.rpc('mathsexpress_owner_set_user_plan',{p_user:String(userId),p_plan:String(plan),p_days:Math.max(1,Math.min(800,Number(days)||365))})) || {}; }
  async claimDailyMission(missionId) {""",1)])

PLAN_JS=r"""
// ---- Plans (v11.5.26) -------------------------------------------------------------------
// The server decides the plan (mathsexpress_my_plan) and enforces the limits that matter:
// 15 recorded questions/day, AI tutor/marking, 3 hints/day and reward caps. The app mirrors
// those rules so free students see a clear upgrade prompt instead of an error.
let planState=null;
const PLAN_LABELS={free:'Free',primary_pro:'Primary Pro',secondary_pro:'Secondary Pro',complete:'Complete',school:'School plan',staff:'Staff access'};
const PLAN_PRICES={primary_pro:10,secondary_pro:15,complete:20};
const FREE_GAME_MODES=new Set(['quick-maths']);
function planIsPaid(){ return !account.authenticated || !planState || planState.paid!==false; }
function planFeature(name){ return planIsPaid() || Boolean(planState?.features?.[name]); }
function planInTeacherWork(){ return Boolean(activeSchoolAssignment?.id && !activeSchoolAssignment.localOnly); }
function freePlanName(){ const y=Number(planState?.year_level ?? account.profile?.yearLevel ?? 9); return y<=6?'Primary Free':'Secondary Free'; }
async function refreshPlanState(){
  if(!account.authenticated)return null;
  try{ planState=await getSchoolClient().myPlan(); updatePlanChrome(); }catch{}
  return planState;
}
function updatePlanChrome(){
  const el=document.getElementById('plan-question-meter');
  if(!el)return;
  if(planIsPaid()){ el.hidden=true; return; }
  el.hidden=false; el.textContent=`${Math.max(0,Number(planState.questions_left)||0)} of 15 free questions left today`;
}
function isFreeSkill(skillId,yearLevel){
  try{
    const skills=getCurriculumSkills({yearLevel:normaliseYearLevel(yearLevel,account.profile?.yearLevel)});
    const seen={};
    for(const s of skills){ const k=s.strand||'x'; seen[k]=(seen[k]||0)+1; if(s.id===skillId) return seen[k]<=2; }
    return false;
  }catch{ return true; }
}
function upgradeRecommendation(){
  const y=Number(planState?.year_level ?? account.profile?.yearLevel ?? 9);
  return y<=6?'primary_pro':'secondary_pro';
}
function showUpgradeModal(reason='This is part of MathsExpress Pro.'){
  const rec=upgradeRecommendation();
  const card=(id,label,years)=>`<article class="upgrade-plan ${id===rec?'recommended':''}">${id===rec?'<span class="upgrade-badge">Recommended</span>':''}<h3>${label}</h3><b>$${PLAN_PRICES[id]}</b><small>per student / year · ${years}</small><button class="btn ${id===rec?'primary':'secondary'}" data-action="choose-plan" data-plan="${id}">Choose plan</button></article>`;
  openSimpleModal('Upgrade MathsExpress',`<div class="upgrade-modal"><p class="upgrade-reason">${escapeHtml(reason)}</p>
    <p class="muted">You’re on <b>${escapeHtml(freePlanName())}</b>: 15 questions a day, basic lessons, limited topics and 3 hints a day.</p>
    <div class="upgrade-grid">${card('primary_pro','Primary Pro','Years K–6')}${card('secondary_pro','Secondary Pro','Years 7–12')}${card('complete','Complete','Years K–12')}</div>
    <p class="muted">Paid plans unlock unlimited questions, every topic for your years, the Clove AI tutor, step-by-step solutions, quizzes and tests, personalised revision, daily challenges, all games and full progress tracking. Schools can get every student access with a school plan.</p>
    <p class="muted">Free questions reset every day.</p></div>`);
}
async function choosePlan(plan){
  if(!PLAN_PRICES[plan])return;
  if(!account.authenticated){ location.href=`./app.html?auth=signup&plan=${encodeURIComponent(plan)}`; return; }
  try{
    const token=account.session?.access_token||accountClient.session?.access_token||'';
    const response=await fetch('/api/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({plan})});
    const data=await response.json().catch(()=>({}));
    if(response.ok&&data.url){ location.href=data.url; return; }
    showToast('Upgrade',data.error||'The payment page could not be opened.');
  }catch{ showToast('Upgrade','The payment page could not be opened. Check your connection.'); }
}
function planErrorMessage(error){
  const m=String(error?.message||'');
  if(m.startsWith('FREE_LIMIT:')||m.startsWith('PLAN_REQUIRED:'))return m.replace(/^[A-Z_]+:\s*/,'');
  return '';
}
// Daily question limit: checked before a free student starts or continues self-paced practice.
function planBlocksPractice(){
  if(planIsPaid()||planInTeacherWork())return false;
  if(Number(planState.questions_left)>0)return false;
  showUpgradeModal('You’ve used your 15 free questions today. Upgrade for unlimited practice, or come back tomorrow.');
  return true;
}
function planDailyKey(key){ return planInTeacherWork()?`asg:${activeSchoolAssignment.id}:${key}`.slice(0,180):key; }
function recordPlanAttempt(key,correct){
  if(!account.authenticated)return;
  getSchoolClient().recordDailyQuestionAttempt(planDailyKey(key),correct).then(r=>{
    if(planState&&r&&r.questions_left!==undefined){ planState={...planState,questions_today:r.questions_today,questions_left:r.questions_left}; updatePlanChrome(); }
  }).catch(error=>{
    const msg=planErrorMessage(error);
    if(msg){ if(planState)planState={...planState,questions_left:0}; updatePlanChrome(); showUpgradeModal(msg); }
  });
}
// Feature locks run in the capture phase, before any other click handler.
const PLAN_LOCKED_ACTIONS={
  'open-ai-helper':['ai_tutor','The Clove AI tutor is part of Primary Pro, Secondary Pro and Complete.'],
  'open-tutor':['ai_tutor','The Clove AI tutor is part of Primary Pro, Secondary Pro and Complete.'],
  'ai-helper-send':['ai_tutor','The Clove AI tutor is part of Primary Pro, Secondary Pro and Complete.'],
  'start-adaptive-practice':['adaptive','Adaptive learning is part of MathsExpress Pro.'],
  'start-recommended-path':['adaptive','Adaptive learning is part of MathsExpress Pro.'],
  'start-exam-practice':['tests','Quizzes and tests are part of MathsExpress Pro.'],
  'open-test-generator':['tests','Quizzes and tests are part of MathsExpress Pro.'],
  'open-challenges':['daily_challenges','Daily challenges are part of MathsExpress Pro.'],
  'start-daily-practice':['daily_challenges','Daily challenges are part of MathsExpress Pro.'],
  'start-speed-challenge':['daily_challenges','Daily challenges are part of MathsExpress Pro.'],
  'open-auto-revision':['revision','Personalised revision is part of MathsExpress Pro.'],
  'create-revision':['revision','Personalised revision is part of MathsExpress Pro.'],
  'create-hardest-revision':['revision','Personalised revision is part of MathsExpress Pro.'],
  'start-mixed-revision':['revision','Personalised revision is part of MathsExpress Pro.'],
  'open-revision-checklist':['revision','Personalised revision is part of MathsExpress Pro.'],
  'open-mistakes':['revision','The Mistake Book and personalised revision are part of MathsExpress Pro.'],
  'start-review-skill':['revision','Personalised revision is part of MathsExpress Pro.'],
  'open-growth-report':['advanced_progress','Advanced progress tracking is part of MathsExpress Pro.'],
  'start-v6-game':['all_games','More games are included with MathsExpress Pro.'],
  'start-math-chess':['all_games','More games are included with MathsExpress Pro.'],
};
const planApprovedHints=new Set();
function planGateClick(event){
  const el=event.target?.closest?.('[data-action]'); if(!el)return;
  const action=el.dataset.action;
  if(action==='choose-plan'){ event.preventDefault(); event.stopImmediatePropagation(); void choosePlan(el.dataset.plan); return; }
  if(action==='open-upgrade'){ event.preventDefault(); event.stopImmediatePropagation(); showUpgradeModal('Unlock everything in MathsExpress.'); return; }
  if(planIsPaid())return;
  const block=(msg)=>{ event.preventDefault(); event.stopImmediatePropagation(); showUpgradeModal(msg); };
  // Teacher-set work keeps its own AI/hint rules; only self-paced use is limited.
  const lock=PLAN_LOCKED_ACTIONS[action];
  if(lock && !(planInTeacherWork() && ['ai_tutor'].includes(lock[0])) && !planFeature(lock[0])) return block(lock[1]);
  if(action==='start-edu-game' && !FREE_GAME_MODES.has(el.dataset.mode||'quick-maths')) return block('More games are included with MathsExpress Pro. Quick Maths is free.');
  if(action==='show-hint'||action==='generated-hint'||action==='open-progressive-hints'){
    if(planInTeacherWork())return;
    const {q,run}=activeAssignmentRunQuestion();
    const key=`${q?.id||'q'}:${(Number(run?.hintCount)||0)+1}`;
    if(planApprovedHints.has(key))return;
    event.preventDefault(); event.stopImmediatePropagation();
    getSchoolClient().useHint(key).then(()=>{ planApprovedHints.add(key); el.click(); })
      .catch(error=>showUpgradeModal(planErrorMessage(error)||'Free plans include 3 hints a day.'));
  }
}
document.addEventListener('click',planGateClick,true);
"""
patch('deploy-app.js',[
("async function syncRemotePlayerState(){\n  if(!account.authenticated||!state)return;\n","async function syncRemotePlayerState(){\n  if(!account.authenticated||!state)return;\n  void refreshPlanState();\n",1),
("\nfunction startGeneratedTask(taskId,{re","""
function planBlocksTask(taskId){
  if(planIsPaid()||planInTeacherWork())return false;
  if(planBlocksPractice())return true;
  const task=getTaskById(taskId);
  if(task&&task.skillId&&!isFreeSkill(task.skillId,task.yearLevel)){ showUpgradeModal('This topic is part of MathsExpress Pro. Free plans include the first topics in each strand.'); return true; }
  return false;
}
function startGeneratedTask(taskId,{re""",1),
("  if(account.authenticated&&attemptNumber===1) void getSchoolClient().recordDailyQuestionAttempt(rewardKey,result.correct).catch(()=>{});","  if(account.authenticated&&attemptNumber===1) recordPlanAttempt(rewardKey,result.correct);",1),
("  if(account.authenticated&&attemptsBefore===0) void getSchoolClient().recordDailyQuestionAttempt(rewardKey,correct).catch(()=>{});","  if(account.authenticated&&attemptsBefore===0) recordPlanAttempt(rewardKey,correct);",1),
("let toolSearchQuery='';",PLAN_JS.strip()+"\nlet toolSearchQuery='';",1),
])
print('ok')
