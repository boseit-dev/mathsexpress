import sys
p='public/deploy-app.js';s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    if s.count(a)!=1: sys.exit('miss '+a[:80])
    s=s.replace(a,b)
BOT=r"""
// ---- Auto-complete bot (v11.5.28) -------------------------------------------------------
// Only for the owner and people the owner grants (checked on the server). It answers the open
// task question by question through the normal submit path. On teacher assignments every use
// is logged as a 'bot-autocomplete' integrity event so the teacher can see it was automated.
let botAccess=false, botRunning=false;
async function refreshBotAccess(){
  if(!account.authenticated){ botAccess=false; return; }
  try{ const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_my_bot_access',{}); botAccess=!error&&data===true; }catch{ botAccess=false; }
  updateBotButton();
}
function updateBotButton(){
  let btn=document.getElementById('autocomplete-bot-button');
  const onTask=['generated-task','assignment'].includes(routeFromHash().route)&&Boolean(currentGeneratedTask&&!currentGeneratedTask.complete);
  if(!botAccess||!onTask){ if(btn)btn.hidden=true; return; }
  if(!btn&&document.body){ btn=document.createElement('button'); btn.id='autocomplete-bot-button'; btn.className='autocomplete-bot-button'; btn.dataset.action='run-autocomplete-bot'; document.body.appendChild(btn); }
  btn.hidden=false; btn.textContent=botRunning?'🤖 Stop auto-complete':'🤖 Auto-complete';
}
function botFillAnswer(q){
  const ans=q.answer;
  if(q.type==='multiple-choice'){ currentGeneratedTask.selectedChoice=String(ans); return true; }
  if(q.type==='coordinate'&&Array.isArray(ans)){ const x=document.getElementById('generated-coordinate-x'),y=document.getElementById('generated-coordinate-y'); if(!x||!y)return false; x.value=ans[0]; y.value=ans[1]; return true; }
  if(q.type==='graph-point'&&Array.isArray(ans)){ const g=document.getElementById('generated-graph-grid'); if(!g)return false; g.dataset.x=String(ans[0]); g.dataset.y=String(ans[1]); return true; }
  if(['multi-part','matching','drag-drop'].includes(q.type))return false;
  const input=document.getElementById('lesson-answer'); if(!input||ans==null||typeof ans==='object')return false;
  input.value=String(ans); input.dispatchEvent(new Event('input',{bubbles:true})); return true;
}
async function runAutoCompleteBot(){
  if(!botAccess)return showToast('Auto-complete','You don’t have access to the auto-complete bot.');
  if(botRunning){ botRunning=false; updateBotButton(); return; }
  botRunning=true; updateBotButton();
  if(activeSchoolAssignment?.id&&!activeSchoolAssignment.localOnly) void recordAssessmentIntegrity('bot-autocomplete',{started:true});
  let done=0;
  try{
    for(let guard=0;guard<200&&botRunning;guard++){
      const run=currentGeneratedTask; if(!run||run.complete||!run.current)break;
      const q=run.current;
      if(!(run.feedback?.correct||run.feedback?.needsReview)){
        if(!botFillAnswer(q)){ showToast('Auto-complete paused',`A ${q.type} question needs to be answered by hand.`); break; }
        await submitGeneratedTaskAnswer();
        if(!(currentGeneratedTask?.feedback?.correct||currentGeneratedTask?.feedback?.needsReview)){ showToast('Auto-complete paused','This question needs working out or another step.'); break; }
        done++;
      }
      await new Promise(r=>setTimeout(r,350));
      currentGeneratedTask=advanceGeneratedTask(currentGeneratedTask); saveActiveAssignmentSession(); renderGeneratedTask();
      await new Promise(r=>setTimeout(r,250));
    }
  } finally {
    botRunning=false; updateBotButton();
    if(done) showToast('Auto-complete',`${done} question${done===1?'':'s'} answered automatically.`,'success');
  }
}
"""
rep("let toolSearchQuery='';",BOT.strip()+"\nlet toolSearchQuery='';")
rep("async function refreshPlanState(){\n  handleUpgradeReturn();","async function refreshPlanState(){\n  handleUpgradeReturn();\n  void refreshBotAccess();")
rep("  if(action==='open-join-class'){","  if(action==='run-autocomplete-bot'){ event.preventDefault(); event.stopImmediatePropagation(); void runAutoCompleteBot(); return; }\n  if(action==='open-join-class'){")
# show/hide the button whenever a task renders
rep("function renderGeneratedTask() {\n","function renderGeneratedTask() {\n  setTimeout(updateBotButton,0);\n")
# owner console: per-user bot access toggle (owner only)
rep('''<button class="btn secondary small" data-action="owner-set-user-plan" data-user-id="${escapeHtml(String(p.user_id||userId))}">Set plan</button></div>''',
'''<button class="btn secondary small" data-action="owner-set-user-plan" data-user-id="${escapeHtml(String(p.user_id||userId))}">Set plan</button></div>${account.profile?.role==='owner'?`<div class="owner-reward-controls owner-bot-controls"><span>Auto-complete bot</span><button class="btn secondary small" data-action="owner-set-bot-access" data-user-id="${escapeHtml(String(p.user_id||userId))}" data-allowed="true">Give access</button><button class="btn ghost small" data-action="owner-set-bot-access" data-user-id="${escapeHtml(String(p.user_id||userId))}" data-allowed="false">Remove access</button></div>`:''}''')
rep("  if (action === 'owner-set-user-plan') {","""  if (action === 'owner-set-bot-access') {
    const allowed=actionEl.dataset.allowed==='true';
    accountClient.ensureClient().rpc('mathsexpress_owner_set_bot_access',{p_user:actionEl.dataset.userId,p_allowed:allowed}).then(({error})=>{ if(error)throw error; showToast('Auto-complete bot',allowed?'Access given.':'Access removed.','success'); }).catch(e=>showToast('Auto-complete bot',e?.message||'Not changed.'));
    return;
  }
  if (action === 'owner-set-user-plan') {""")
open(p,'w',encoding='utf-8').write(s);print('ok')
