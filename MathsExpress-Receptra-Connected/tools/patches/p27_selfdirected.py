import sys
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for old,new,cnt in pairs:
        n=s.count(old)
        if n!=cnt: sys.exit(f'{p}: expected {cnt} got {n}: {old[:90]}')
        s=s.replace(old,new)
    open(p,'w',encoding='utf-8').write(s)
patch('public/deploy-app.js',[
('''<label class="signup-class-code">Class code<input id="auth-signup-class-code" name="classCode" maxlength="6" minlength="6" autocomplete="off" autocapitalize="characters" placeholder="ABC123" pattern="[A-Za-z0-9]{6}" required><small class="field-help">The 6-character code from your teacher. You join the class as soon as your account is created.</small></label>''',
'''<label class="signup-class-code">School class code <span class="optional-tag">optional</span><input id="auth-signup-class-code" name="classCode" maxlength="6" minlength="6" autocomplete="off" autocapitalize="characters" placeholder="Leave blank to learn on your own" pattern="[A-Za-z0-9]{6}"><small class="field-help">Only if your school gave you a code. Without one you get your own self-paced MathsExpress.</small></label>''',1),
("  if(input) input.required=student;\n","  if(input) input.required=false;\n",1),
("      if(accountType==='student' && !/^[A-Z0-9]{6}$/.test(classCode)) throw new Error('Enter the 6-character class code from your teacher.');",
 "      if(accountType==='student' && classCode && !/^[A-Z0-9]{6}$/.test(classCode)) throw new Error('A school class code has 6 letters or numbers. Leave it blank to learn on your own.');",1),
("      if(accountType==='student' && account.authenticated){\n        try { await getSchoolClient().joinClass(classCode);",
 "      if(accountType==='student' && account.authenticated && classCode){\n        try { await getSchoolClient().joinClass(classCode);",1),
("function updatePlanChrome(){\n","""// Self-directed accounts: students who aren't in any class see no class/school features.
function isSelfDirected(){ return account.authenticated && account.profile?.role==='player' && planState && planState.in_class===false; }
function applySelfDirectedChrome(){ document.body?.classList.toggle('mx-self-directed',Boolean(isSelfDirected())); }
function updatePlanChrome(){
  applySelfDirectedChrome();
""",1),
("function go(route, param = '') {\n  if (!ROUTES.includes(route)) route = 'home';",
 "function go(route, param = '') {\n  if (!ROUTES.includes(route)) route = 'home';\n  if (route==='student-hub' && typeof isSelfDirected==='function' && isSelfDirected()) route='learn';",1),
('''${planState.paid?'':`<small>${Math.max(0,Number(planState.questions_left)||0)} of 15 free questions left today</small><button class="btn primary small" data-action="open-upgrade">Upgrade</button>`}</div>`;''',
 '''${planState.paid?'':`<small>${Math.max(0,Number(planState.questions_left)||0)} of 15 free questions left today</small><button class="btn primary small" data-action="open-upgrade">Upgrade</button>`}${planState.in_class===false&&account.profile?.role==='player'?'<button class="btn ghost small" data-action="open-join-class">Have a school class code?</button>':''}</div>`;''',1),
("  if(action==='open-upgrade'){","  if(action==='open-join-class'){ event.preventDefault(); event.stopImmediatePropagation(); openJoinClassModal(); return; }\n  if(action==='open-upgrade'){",1),
])
print('ok')
