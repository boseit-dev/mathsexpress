import sys
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for old,new in pairs:
        n=s.count(old)
        if n!=1: sys.exit(f'{p}: expected 1 got {n}: {old[:80]}')
        s=s.replace(old,new)
    open(p,'w',encoding='utf-8').write(s)
patch('deploy-app.js',[
('''  if(active && !document.fullscreenElement){ assessmentIntegrity.fullscreenExits=(assessmentIntegrity.fullscreenExits||0)+1; void recordAssessmentIntegrity('fullscreen-exit',{elapsed_seconds:assignmentElapsedSeconds()}); setTimeout(showAssignmentFullscreenGuard,80); }''',
'''  if(active && !document.fullscreenElement){ assessmentIntegrity.fullscreenExits=(assessmentIntegrity.fullscreenExits||0)+1; void recordAssessmentIntegrity('fullscreen-exit',{elapsed_seconds:assignmentElapsedSeconds()}); refreshQuestionAfterFullscreenExit(); setTimeout(showAssignmentFullscreenGuard,80); }'''),
('''function removeAssignmentFullscreenGuard(){
  document.getElementById('assignment-fullscreen-guard')?.remove();
}''','''function removeAssignmentFullscreenGuard(){
  document.getElementById('assignment-fullscreen-guard')?.remove();
  document.body?.classList.remove('assignment-guard-active');
}
// Leaving fullscreen swaps the unanswered question for a same-type question with different
// numbers, so a question seen outside fullscreen cannot simply be copied elsewhere.
function refreshQuestionAfterFullscreenExit(){
  try{
    const g=currentGeneratedTask;
    if(g?.current && !g.feedback && g.task){
      const avoid=(g.questions||[]).map(q=>questionFingerprint(q)).filter(Boolean);
      const fresh=createGeneratedTaskRun(g.task,{runSeed:Date.now()+Math.floor(Math.random()*1e6),avoidFingerprints:avoid});
      const idx=Math.max(0,Number(g.index)||0);
      const q=fresh.questions[idx]||fresh.questions[0];
      if(q){ g.questions[idx]=q; g.current=q; g.selectedChoice=''; saveActiveAssignmentSession(); renderGeneratedTask(); }
      return;
    }
    const l=currentLesson;
    if(l?.current && !l.feedback){
      const pool=getQuestionsForLesson(l.lessonId);
      const unused=pool.filter(q=>!l.asked.includes(q.id));
      const same=unused.filter(q=>String(q.type||'')===String(l.current.type||''));
      const next=(same.length?same:unused)[Math.floor(Math.random()*(same.length||unused.length))];
      if(!next)return;
      const pos=l.asked.indexOf(l.current.id);
      if(pos>=0)l.asked[pos]=next.id; else l.asked.push(next.id);
      if(l.questionStates)delete l.questionStates[String(l.current.id)];
      l.current=next; l.selectedChoice=''; saveActiveAssignmentSession(); renderLesson();
    }
  }catch{}
}'''),
('''  guard.className='assignment-fullscreen-guard';''','''  guard.className='assignment-fullscreen-guard';
  document.body?.classList.add('assignment-guard-active');'''),
])
print('ok')
