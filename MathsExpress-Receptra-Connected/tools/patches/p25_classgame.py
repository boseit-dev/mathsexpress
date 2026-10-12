import sys
p='deploy-app.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit(f'expected {count} got {n}: {old[:80]}')
    s=s.replace(old,new)
# 1. game settings in picker
rep('''<p class="lock-note">Students are split into balanced Blue and Red teams automatically. Every game uses one synced class state.</p><div class="classroom-game-menu">''',
'''<p class="lock-note">Students are split into balanced Blue and Red teams automatically. Every game uses one synced class state.</p>${classGameSettingsHtml(targetClass)}<div class="classroom-game-menu">''')
rep('''      const root = document.getElementById('modal-root');
      root.innerHTML = `<div class="modal-backdrop"><div class="modal pop relaxed-tool-modal classroom-games-modal">''',
'''      const root = document.getElementById('modal-root');
      void loadClassGameAssignmentOptions(targetClass);
      root.innerHTML = `<div class="modal-backdrop"><div class="modal pop relaxed-tool-modal classroom-games-modal">''')
# 2. launch reads the settings
rep('''getSchoolClient().createClassroomSession(classId, mode, { seconds:60 })''','''getSchoolClient().createClassroomSession(classId, mode, readClassGameSettings())''')
# 3. expiry follows the chosen duration
rep('''function classGameExpired(session,now=Date.now()){
  const start=Date.parse(session?.created_at||'');return !Number.isFinite(start)||now-start>=600000;
}''','''function classGameDurationMinutes(session){
  const m=Number(session?.config?.duration_minutes);return Number.isFinite(m)&&m>=1?Math.min(30,Math.round(m)):10;
}
function classGameExpired(session,now=Date.now()){
  const start=Date.parse(session?.created_at||'');return !Number.isFinite(start)||now-start>=classGameDurationMinutes(session)*60000;
}
const CLASS_GAME_TOPICS=[['mixed','Mixed topics'],['number','Number'],['algebra','Algebra'],['measurement','Measurement & Geometry'],['statistics','Statistics & Probability']];
function classGameTopicFromText(text=''){
  const t=String(text).toLowerCase();
  if(/algebra|equation|pattern|linear|quadratic|function|calculus|derivative|indices/.test(t))return 'algebra';
  if(/measure|geometr|area|perimeter|volume|angle|pythag|trig|shape|space|length/.test(t))return 'measurement';
  if(/statist|probab|data|chance|mean|median|graph/.test(t))return 'statistics';
  if(/number|fraction|decimal|percent|integer|place value|money|ratio|financ/.test(t))return 'number';
  return 'mixed';
}
function classGameSettingsHtml(classId){
  const cls=teacherHubClasses.find(c=>String(c.id)===String(classId));
  const year=normaliseYearLevel(cls?.year_level??account.profile?.yearLevel);
  return `<div class="class-game-settings"><label>Length<select id="class-game-duration">${[3,5,10,15,20,30].map(m=>`<option value="${m}" ${m===10?'selected':''}>${m} minutes</option>`).join('')}</select></label><label>Topic<select id="class-game-topic">${CLASS_GAME_TOPICS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label><label>Year level<select id="class-game-year">${Array.from({length:13},(_,y)=>`<option value="${y}" ${y===year?'selected':''}>${y===0?'Kindergarten':`Year ${y}`}</option>`).join('')}</select></label><label>Based on an assignment<select id="class-game-assignment"><option value="">None – use the topic above</option></select></label></div>`;
}
async function loadClassGameAssignmentOptions(classId){
  try{
    const rows=await getSchoolClient().listClassAssignments(classId);
    const sel=document.getElementById('class-game-assignment'); if(!sel)return;
    sel.innerHTML='<option value="">None – use the topic above</option>'+rows.slice(0,40).map(r=>{
      const task=r.task_id?getTaskById?.(r.task_id):null, lesson=r.lesson_id?getLessonById?.(r.lesson_id):null;
      const topic=classGameTopicFromText([r.title,task?.title,task?.strand,task?.topic,lesson?.title,lesson?.strand,lesson?.topic,r.skill_id].filter(Boolean).join(' '));
      const year=Number(task?.yearLevel??lesson?.yearLevel);
      return `<option value="${escapeHtml(String(r.id))}" data-topic="${topic}" data-year="${Number.isFinite(year)?year:''}">${escapeHtml(r.title||task?.title||lesson?.title||'Assignment')}</option>`;
    }).join('');
    sel.onchange=()=>{const o=sel.selectedOptions[0];if(!o?.value)return;const t=document.getElementById('class-game-topic');if(t)t.value=o.dataset.topic||'mixed';const y=document.getElementById('class-game-year');if(y&&o.dataset.year!=='')y.value=o.dataset.year;};
  }catch{}
}
function readClassGameSettings(){
  const val=id=>document.getElementById(id)?.value||'';
  const minutes=Math.max(1,Math.min(30,Number(val('class-game-duration'))||10));
  const topic=CLASS_GAME_TOPICS.some(([v])=>v===val('class-game-topic'))?val('class-game-topic'):'mixed';
  const year=Number(val('class-game-year'));
  const sel=document.getElementById('class-game-assignment');
  const config={duration_minutes:minutes,topic};
  if(Number.isFinite(year)&&val('class-game-year')!=='')config.year_level=Math.max(0,Math.min(12,year));
  if(sel?.value){config.assignment_id=sel.value;config.assignment_title=sel.selectedOptions[0]?.textContent||'';}
  return config;
}''')
rep('''showToast('Class game ended','Class games last 10 minutes.')''','''showToast('Class game finished','Time is up for this class game.')''')
# 4. students only see their own right/wrong
rep('''  const teamRows=(team)=>rows.filter(row=>String(row.team||'').toLowerCase()===team.toLowerCase()).slice(0,10);
  const renderTeam=(team)=>`<section class="class-team-board ${team.toLowerCase()}"><header><div><span>${team.toUpperCase()}</span><strong>${totals[team].players} player${totals[team].players===1?'':'s'}</strong></div><b>${totals[team].correct} ✓</b></header><div>${teamRows(team).map((row,i)=>`<article><b>${i+1}</b><span>${escapeHtml(row.display_name||'Student')}<small>${Number(row.correct)||0}/${Number(row.answered)||0} correct</small></span><strong>${Number(row.score)||0}</strong></article>`).join('')||'<div class="class-game-empty">Waiting for players…</div>'}</div></section>`;
  return `<div class="class-team-boards">${renderTeam('Blue')}${renderTeam('Gold')}</div>`;''',
'''  // Students only see their own right/wrong counts (the server also withholds other players' counts).
  const staffView=canUseTeacherHub(account);
  const teamScore=(team)=>rows.filter(row=>String(row.team||'').toLowerCase()===team.toLowerCase()).reduce((t,row)=>t+(Number(row.score)||0),0);
  const teamRows=(team)=>rows.filter(row=>String(row.team||'').toLowerCase()===team.toLowerCase()&&(staffView||row.is_me)).slice(0,staffView?10:1);
  const renderTeam=(team)=>`<section class="class-team-board ${team.toLowerCase()}"><header><div><span>${team.toUpperCase()}</span><strong>${totals[team].players} player${totals[team].players===1?'':'s'}</strong></div><b>${staffView?`${totals[team].correct} ✓`:`${teamScore(team)} pts`}</b></header><div>${teamRows(team).map((row,i)=>`<article><b>${staffView?i+1:'You'}</b><span>${escapeHtml(staffView?(row.display_name||'Student'):'Your answers')}<small>${Number(row.correct)||0}/${Number(row.answered)||0} correct</small></span><strong>${Number(row.score)||0}</strong></article>`).join('')||(staffView||!rows.some(r=>r.is_me)?'<div class="class-game-empty">Waiting for players…</div>':'')}</div></section>`;
  return `<div class="class-team-boards">${renderTeam('Blue')}${renderTeam('Gold')}</div>`;''')
open(p,'w',encoding='utf-8').write(s)
p='deploy-core-1.js'; s=open(p,encoding='utf-8').read()
rep(".in('status', ['lobby','playing']).gte('created_at',new Date(Date.now()-600000).toISOString())",".in('status', ['lobby','playing']).gte('created_at',new Date(Date.now()-1800000).toISOString())")
open(p,'w',encoding='utf-8').write(s)
print('ok')
