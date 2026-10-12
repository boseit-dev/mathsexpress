import sys
p='deploy-app.js';s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    if s.count(a)!=1: sys.exit('miss '+a[:80])
    s=s.replace(a,b)
rep("""function openClassFocusMonitor(classId) {""","""// Live class pulse: doing well / struggling / inactive, then drill into a group and a student.
let livePulse={classId:'',data:null,group:'',studentId:'',timer:null};
function livePulseGroup(st){
  const now=Date.now();
  const focusAge=st.focus_updated_at?now-Date.parse(st.focus_updated_at):Infinity;
  const attemptAge=st.last_attempt_at?now-Date.parse(st.last_attempt_at):Infinity;
  if(['hidden','away'].includes(st.state)&&focusAge<5*60000)return {group:'inactive',why:'MathsExpress is hidden or in another tab'};
  if(focusAge>2*60000&&attemptAge>10*60000)return {group:'inactive',why:'No activity in the last 10 minutes'};
  const last=Array.isArray(st.last6)?st.last6:[];
  const right=last.filter(Boolean).length;
  if(last.length>=3&&last.slice(0,3).every(x=>!x))return {group:'struggling',why:'Last 3 answers were wrong'};
  if(last.length>=4&&right/last.length<0.5)return {group:'struggling',why:`${right}/${last.length} of recent answers correct`};
  return {group:'well',why:last.length?`${right}/${last.length} of recent answers correct`:'Working, no answers yet'};
}
function livePulseHtml(){
  const rows=(livePulse.data?.students||[]).map(st=>({...st,...livePulseGroup(st)}));
  const groups={well:rows.filter(r=>r.group==='well'),struggling:rows.filter(r=>r.group==='struggling'),inactive:rows.filter(r=>r.group==='inactive')};
  const labels={well:['Doing well','pulse-well'],struggling:['Struggling','pulse-struggling'],inactive:['Inactive','pulse-inactive']};
  const tiles=`<div class="pulse-tiles">${Object.entries(groups).map(([k,list])=>`<button class="pulse-tile ${labels[k][1]} ${livePulse.group===k?'active':''}" data-action="pulse-group" data-group="${k}"><b>${list.length}</b><span>${labels[k][0]}</span></button>`).join('')}</div>`;
  const rules='<p class="muted pulse-rules">Inactive: MathsExpress hidden/in another tab, or no activity for 10 minutes. Struggling: last 3 answers wrong, or under half of the last 4–6 correct. MathsExpress cannot see other apps, websites or the screen.</p>';
  let detail='';
  const st=rows.find(r=>String(r.student_id)===String(livePulse.studentId));
  if(st){
    const mins=Math.round((Number(st.time_on_task_seconds)||0)/60);
    detail=`<section class="pulse-student"><button class="btn ghost small" data-action="pulse-group" data-group="${st.group}">← ${labels[st.group][0]}</button><h3>${escapeHtml(st.display_name)}</h3><div class="pulse-facts"><span><b>${escapeHtml(st.state)}</b> focus</span><span><b>${Number(st.hidden_count)||0}</b> times left the tab</span><span><b>${Number(st.recent_correct)||0}/${Number(st.recent_attempts)||0}</b> correct (30 min)</span><span><b>${mins} min</b> answering (30 min)</span></div><p class="muted">${escapeHtml(st.assignment_title?`Working on: ${st.assignment_title}`:'Not in an assignment right now')} · ${escapeHtml(st.why)}</p><h4>Recent wrong answers</h4><div class="simple-list">${(st.wrong||[]).map(w=>`<div><strong>${escapeHtml(w.assignment||'Task')} · ${escapeHtml(String(w.question_id||''))}</strong><span>Answered “${escapeHtml(w.answer||'—')}” · ${escapeHtml(new Date(w.at).toLocaleString())}${w.feedback?` · ${escapeHtml(w.feedback)}`:''}</span></div>`).join('')||'<p>No wrong answers in the last 14 days.</p>'}</div></section>`;
  } else if(livePulse.group){
    const list=groups[livePulse.group]||[];
    detail=`<div class="simple-list pulse-list">${list.map(r=>`<button class="pulse-row" data-action="pulse-student" data-student-id="${escapeHtml(String(r.student_id))}"><strong>${escapeHtml(r.display_name)}</strong><span>${escapeHtml(r.why)}${r.assignment_title?` · ${escapeHtml(r.assignment_title)}`:''}</span></button>`).join('')||'<p>No students in this group.</p>'}</div>`;
  }
  return `${tiles}${rules}${detail}<p class="muted pulse-updated">Updated ${escapeHtml(new Date(livePulse.data?.generated_at||Date.now()).toLocaleTimeString())} · refreshes every 10 seconds</p>`;
}
async function refreshLivePulse(){
  const body=document.getElementById('live-pulse-body'); if(!body){clearInterval(livePulse.timer);livePulse.timer=null;return;}
  try{ const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_class_live_pulse',{p_class_id:String(livePulse.classId)}); if(error)throw error; livePulse.data=data; const b=document.getElementById('live-pulse-body'); if(b)b.innerHTML=livePulseHtml(); }
  catch(error){ body.innerHTML=`<p>${escapeHtml(error?.message||'Live class data is unavailable.')}</p>`; }
}
function openLivePulse(classId){
  if(!canUseTeacherHub(account))return;
  if(!classId)return showToast('Choose a class','Open a class first.');
  clearInterval(livePulse.timer); livePulse={classId,data:null,group:'',studentId:'',timer:null};
  openSimpleModal('Live class','<div id="live-pulse-body"><div class="school-loading"><span class="spinner"></span><strong>Loading live class…</strong></div></div>');
  void refreshLivePulse(); livePulse.timer=setInterval(()=>void refreshLivePulse(),10000);
}
function openClassFocusMonitor(classId) {""")
rep("""  if (action === 'open-focus-monitor') {""","""  if (action === 'open-live-pulse') { return openLivePulse(actionEl.dataset.classId||selectedTeacherClassId); }
  if (action === 'pulse-group') { livePulse.group=actionEl.dataset.group||''; livePulse.studentId=''; const b=document.getElementById('live-pulse-body'); if(b)b.innerHTML=livePulseHtml(); return; }
  if (action === 'pulse-student') { livePulse.studentId=actionEl.dataset.studentId||''; const b=document.getElementById('live-pulse-body'); if(b)b.innerHTML=livePulseHtml(); return; }
  if (action === 'open-focus-monitor') {""")
rep("""<button class="btn ghost small" data-action="open-focus-monitor" data-class-id="${escapeHtml(classId)}">Live focus</button>""","""<button class="btn primary small" data-action="open-live-pulse" data-class-id="${escapeHtml(classId)}">Live class</button><button class="btn ghost small" data-action="open-focus-monitor" data-class-id="${escapeHtml(classId)}">Live focus</button>""")
open(p,'w',encoding='utf-8').write(s);print('ok')
