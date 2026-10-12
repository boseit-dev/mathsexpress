import sys
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for old,new,cnt in pairs:
        n=s.count(old)
        if n!=cnt: sys.exit(f'{p}: expected {cnt} got {n}: {old[:90]}')
        s=s.replace(old,new)
    open(p,'w',encoding='utf-8').write(s)
patch('deploy-core-1.js',[("  async claimDailyMission(missionId) {","  async claimPracticeCompletion(runKey) { return unwrap(await this.client.rpc('mathsexpress_claim_practice_completion',{p_run_key:String(runKey||'').slice(0,80)})) || {}; }\n  async claimDailyMission(missionId) {",1)])
toast_old=""".then((reward)=>showToast('Assignment complete', reward>0?`Result sent · +${reward} coins earned`:'Your result has been sent to your teacher.', 'success'))"""
toast_new=""".then((reward)=>{showToast('Assignment complete', reward>0?`Result sent · +${reward} coins earned`:'Your result has been sent to your teacher.', 'success');setFinishRewardText(reward>0?`+${reward} coins for finishing`:'Result sent to your teacher');})"""
patch('deploy-app.js',[
(toast_old,toast_new,2),
("""async function completeSchoolAssignmentAndReward(snapshot,payload){""","""// Completion screen: stars from accuracy, plus a server-checked finishing reward for practice runs.
const claimedFinishRuns=new Set();
function setFinishRewardText(text,ok=true){const el=document.getElementById('finish-reward');if(el){el.textContent=text;el.classList.toggle('muted',!ok);}}
function finishStarsHtml(accuracy){const n=accuracy>=90?3:accuracy>=70?2:1;return `<div class="finish-stars" aria-label="${n} of 3 stars">${[1,2,3].map(i=>`<span class="${i<=n?'on':''}">★</span>`).join('')}</div>`;}
function finishCardHtml({eyebrow,title,accuracy,stats=[],actions='',assignment=false}){
  const pct=Math.max(0,Math.min(100,Math.round(Number(accuracy)||0)));
  return `<div class="page generated-task-page"><div class="card finish-card pop">${cloveHtml('done')}<span class="eyebrow">${escapeHtml(eyebrow)}</span><h2>${escapeHtml(title)}</h2>${finishStarsHtml(pct)}<div class="finish-ring" style="--pct:${pct}"><b>${pct}%</b><small>accuracy</small></div><div class="task-finish-stats">${stats.map(([v,l])=>`<span><b>${escapeHtml(String(v))}</b> ${escapeHtml(l)}</span>`).join('')}</div><div id="finish-reward" class="task-finish-reward">${assignment?'Sending your result…':'Checking your finishing reward…'}</div><div class="hero-actions" style="justify-content:center">${actions}</div></div></div>`;
}
function claimPracticeFinishReward(runKey){
  if(!account.authenticated)return setFinishRewardText('Sign in to earn finishing rewards.',false);
  if(claimedFinishRuns.has(runKey))return setFinishRewardText('Finishing reward collected for this run.');
  claimedFinishRuns.add(runKey);
  getSchoolClient().claimPracticeCompletion(runKey).then(result=>{
    if(Number.isFinite(Number(result?.coins)))state=persist({...state,coins:Number(result.coins),xp:Number(result.xp??state.xp??0)},{quiet:true});
    if(Number(result?.coins_awarded)>0){setFinishRewardText(`+${result.coins_awarded} coins · +${result.xp_awarded} XP for finishing`);updateAccountChrome?.();}
    else if(result?.daily_limit)setFinishRewardText('You have collected today’s 5 finishing rewards. More tomorrow!',false);
    else setFinishRewardText('Finishing reward collected for this run.');
  }).catch(error=>setFinishRewardText(error?.message||'Finishing reward unavailable right now.',false));
}
async function completeSchoolAssignmentAndReward(snapshot,payload){""",1),
("""    view.innerHTML = `
      <div class="page"><div class="card empty-state pop">
        <div class="big">🏆</div><span class="eyebrow">Lesson complete</span><h2>${escapeHtml(lesson.title)}</h2>
        <p>You completed every challenge in this run. Your lesson mastery is now <strong>${mastery}%</strong>.</p>
        <div class="hero-actions" style="justify-content:center">${activeSchoolAssignment?`<button class="btn primary" data-action="leave-assignment">← Back to ${activeSchoolAssignment.localOnly?'Learn':'Class'}</button>`:`<button class="btn primary" data-action="restart-lesson" data-lesson-id="${lesson.id}">Practise again</button><button class="btn secondary" data-route="learn">Back to Algebra Path</button>`}</div>
      </div></div>`;
    return;""","""    const lessonAnswered=Number(activeSchoolAssignment?.answered)||currentLesson.asked.length;
    const lessonCorrect=Number(activeSchoolAssignment?.correct);
    const lessonAccuracy=Number.isFinite(lessonCorrect)&&lessonAnswered?Math.round(lessonCorrect/lessonAnswered*100):mastery;
    view.innerHTML = finishCardHtml({eyebrow:'Lesson complete',title:lesson.title,accuracy:lessonAccuracy,assignment:Boolean(activeSchoolAssignment&&!activeSchoolAssignment.localOnly),
      stats:[[currentLesson.asked.length,'questions'],[`${mastery}%`,'lesson mastery']],
      actions:activeSchoolAssignment?`<button class="btn primary" data-action="leave-assignment">← Back to ${activeSchoolAssignment.localOnly?'Learn':'Class'}</button>`:`<button class="btn primary" data-action="restart-lesson" data-lesson-id="${lesson.id}">Practise again</button><button class="btn secondary" data-route="learn">Back to Learn</button>`});
    if(!activeSchoolAssignment||activeSchoolAssignment.localOnly)claimPracticeFinishReward(`lesson:${currentLesson.runId}`);
    return;""",1),
("""    view.innerHTML = `<div class="page generated-task-page"><div class="card empty-state pop"><div class="big">✓</div>${cloveHtml('done')}<span class="eyebrow">Task complete</span><h2>${escapeHtml(task.skill)}</h2><p>You finished ${task.questionCount} questions with <strong>${accuracy}%</strong> attempt accuracy.</p>${postRunMastery>=100?`<p class="muted">Skill mastery: <strong>${Math.round(postRunMastery)}%</strong> — you've mastered this skill. Keep practising to build extra mastery.</p>`:''}<div class="task-finish-stats"><span><b>${run.correct}</b> correct</span><span><b>${run.answered}</b> attempts</span><span><b>${task.difficulty}</b> difficulty</span></div><div class="hero-actions" style="justify-content:center">${activeSchoolAssignment?`<button class="btn primary" data-action="leave-assignment">← Back to ${activeSchoolAssignment.localOnly?'Learn':'Class'}</button>`:`<button class="btn primary" data-action="start-library-task" data-task-id="${escapeHtml(task.id)}">${continueLabel}</button><button class="btn secondary" data-route="learn">Back to Learn</button>`}</div></div></div>`;
    return;""","""    view.innerHTML = finishCardHtml({eyebrow:'Task complete',title:task.skill,accuracy,assignment:Boolean(activeSchoolAssignment&&!activeSchoolAssignment.localOnly),
      stats:[[run.correct,'correct'],[run.answered,'attempts'],[task.difficulty,'difficulty'],...(postRunMastery>=100?[['Mastered','skill']]:[])],
      actions:activeSchoolAssignment?`<button class="btn primary" data-action="leave-assignment">← Back to ${activeSchoolAssignment.localOnly?'Learn':'Class'}</button>`:`<button class="btn primary" data-action="start-library-task" data-task-id="${escapeHtml(task.id)}">${continueLabel}</button><button class="btn secondary" data-route="learn">Back to Learn</button>`});
    if(!activeSchoolAssignment||activeSchoolAssignment.localOnly)claimPracticeFinishReward(`task:${task.id}:${run.runSeed}`.slice(0,80));
    return;""",1),
])
print('ok')
