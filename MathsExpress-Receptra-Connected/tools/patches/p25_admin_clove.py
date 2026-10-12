import sys
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for old,new,cnt in pairs:
        n=s.count(old)
        if n!=cnt: sys.exit(f'{p}: expected {cnt} got {n}: {old[:80]}')
        s=s.replace(old,new)
    open(p,'w',encoding='utf-8').write(s)
patch('deploy-app.js',[
('''  if(account.profile?.role!=='player'){
    mount.innerHTML=`<div class="home-admin-shortcuts"><div><strong>${escapeHtml(platformRoleLabel(account.profile?.role))} workspace</strong><span>Student assignments do not appear on admin accounts.</span></div><button class="btn primary small" data-route="teacher-hub">Open School tools</button></div>`;
    return;
  }''','''  if(account.profile?.role!=='player'){
    // Staff and admin accounts see the latest tasks set in their classes (and any tasks assigned to them).
    const head=`<div class="home-admin-shortcuts"><div><strong>${escapeHtml(platformRoleLabel(account.profile?.role))} workspace</strong><span>Latest tasks in your classes.</span></div><button class="btn primary small" data-route="teacher-hub">Open School tools</button></div>`;
    mount.innerHTML=head+'<div class="school-empty">Loading class tasks…</div>';
    try{
      const school=getSchoolClient();
      const [own,classes]=await Promise.all([school.listStudentAssignments().catch(()=>[]),withStartupTimeout(school.listTeacherClasses(),5000,'Classes took too long to load.').catch(()=>[])]);
      const live=(classes||[]).filter(c=>!c.archived).slice(0,12);
      const groups=await Promise.all(live.map(c=>withStartupTimeout(school.listClassAssignments(c.id),3500,'Assignments took too long to load.').then(rows=>rows.map(r=>({...r,class_name:c.name||c.class_name||'Class'}))).catch(()=>[])));
      if(routeFromHash().route!=='home')return;
      const staffRows=groups.flat().sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))).slice(0,6);
      const ownRows=(own||[]).map(effectiveStudentAssignment).slice(0,3);
      const staffHtml=staffRows.map(a=>`<article class="home-assigned-task-card mx-home-task-card ${/test/i.test(a.assignment_type||'')?'test':''}"><div class="mx-home-task-visual" aria-hidden="true"><span>${/test/i.test(a.assignment_type||'')?'T':'∑'}</span></div><div class="mx-home-task-meta"><span class="mx-home-task-type">${escapeHtml(a.assignment_type||'Practice')}</span><span class="mx-home-task-due">${a.due_at?`Due ${escapeHtml(formatSchoolDate(a.due_at))}`:'No due date'}</span></div><h3>${escapeHtml(a.title||'Class task')}</h3><p>${escapeHtml(a.class_name)} · ${Number(a.question_count)||10} questions</p><div class="mx-home-task-footer"><span></span><div class="mx-home-task-action"><button class="btn ghost small" data-route="teacher-hub">Open class</button></div></div></article>`).join('');
      mount.innerHTML=head+(ownRows.length||staffRows.length?`<div class="home-assigned-task-grid">${ownRows.map(homeAssignedTaskCard).join('')}${staffHtml}</div>`:'<div class="school-empty">No tasks have been set in your classes yet.</div>');
    }catch{ mount.innerHTML=head+'<div class="school-empty">Class tasks could not be loaded right now.</div>'; }
    return;
  }''',1),
("'MathsExpress AI')}</small>","'Clove')}</small>",1),
('<small>MathsExpress AI</small><div class="ai-thinking" aria-label="MathsExpress AI is thinking">','<small>Clove</small><div class="ai-thinking" aria-label="Clove is thinking">',1),
("openSimpleModal('MathsExpress AI Helper',","openSimpleModal('Clove · maths helper',",1),
])
patch('deploy-core-2.js',[("I’m your MathsExpress AI Helper.","I’m Clove, your MathsExpress maths helper.",1)])
print('ok')
