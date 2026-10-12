import sys
p='public/deploy-app.js';s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    if s.count(a)!=1: sys.exit('miss '+a[:80])
    s=s.replace(a,b)
MFA=r"""
// ---- Login security code (v11.5.27): optional authenticator-app code (Supabase TOTP MFA) ----
function mfaApi(){ return accountClient.ensureClient()?.auth?.mfa; }
let mfaResolve=null;
async function requireMfaIfEnrolled(){
  try{
    const mfa=mfaApi(); if(!mfa)return true;
    const {data}=await mfa.getAuthenticatorAssuranceLevel();
    if(!(data?.nextLevel==='aal2'&&data?.currentLevel!=='aal2'))return true;
    return await new Promise(resolve=>{
      mfaResolve=resolve;
      openSimpleModal('Security code',`<form id="mfa-login-form" class="school-form">${cloveHtml('thinking')}<p>Enter the 6-digit code from your authenticator app.</p><label>Security code<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required autofocus></label><p id="mfa-login-error" class="auth-message"></p><div class="simple-modal-actions"><button class="btn ghost" type="button" data-action="mfa-cancel">Cancel and sign out</button><button class="btn primary" type="submit">Verify</button></div></form>`);
    });
  }catch{ return true; }
}
async function submitMfaLogin(form){
  const code=String(new FormData(form).get('code')||'').trim();
  const err=document.getElementById('mfa-login-error');
  try{
    const mfa=mfaApi(); const {data:f}=await mfa.listFactors(); const factor=(f?.totp||[]).find(x=>x.status==='verified');
    if(!factor)throw new Error('No security code is set up on this account.');
    const {error}=await mfa.challengeAndVerify({factorId:factor.id,code}); if(error)throw error;
    document.getElementById('modal-root').innerHTML=''; const r=mfaResolve; mfaResolve=null; r?.(true);
  }catch(e){ if(err)err.textContent=e?.message||'That code did not work. Try again.'; }
}
async function openSecurityCodeSettings(){
  const mfa=mfaApi(); if(!mfa)return showToast('Security code','Not available right now.');
  const {data:f}=await mfa.listFactors(); const factor=(f?.totp||[]).find(x=>x.status==='verified');
  if(factor){ openSimpleModal('Security code',`<p>A security code from your authenticator app is required each time you log in.</p><div class="simple-modal-actions"><button class="btn danger" data-action="mfa-disable" data-factor-id="${escapeHtml(factor.id)}">Turn off security code</button></div>`); return; }
  for(const old of (f?.totp||[]).filter(x=>x.status!=='verified')){ try{ await mfa.unenroll({factorId:old.id}); }catch{} }
  const {data,error}=await mfa.enroll({factorType:'totp',friendlyName:`MathsExpress ${Date.now()}`});
  if(error)return showToast('Security code',error.message||'Could not start set-up.');
  openSimpleModal('Turn on a security code',`<form id="mfa-enroll-form" class="school-form" data-factor-id="${escapeHtml(data.id)}"><p>1. Scan this with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy…).</p><img class="mfa-qr" src="${escapeHtml(data.totp.qr_code)}" alt="Security code QR"><p class="muted">Can’t scan? Enter this key: <code>${escapeHtml(data.totp.secret)}</code></p><label>2. Enter the 6-digit code it shows<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label><p id="mfa-enroll-error" class="auth-message"></p><button class="btn primary" type="submit">Turn on</button></form>`);
}
async function submitMfaEnroll(form){
  const code=String(new FormData(form).get('code')||'').trim(); const err=document.getElementById('mfa-enroll-error');
  try{ const {error}=await mfaApi().challengeAndVerify({factorId:form.dataset.factorId,code}); if(error)throw error;
    document.getElementById('modal-root').innerHTML=''; showToast('Security code on','You’ll be asked for a code each time you log in.','success'); }
  catch(e){ if(err)err.textContent=e?.message||'That code did not work.'; }
}
document.addEventListener('submit',(event)=>{
  if(event.target?.id==='mfa-login-form'){ event.preventDefault(); void submitMfaLogin(event.target); }
  if(event.target?.id==='mfa-enroll-form'){ event.preventDefault(); void submitMfaEnroll(event.target); }
},true);
document.addEventListener('click',(event)=>{
  const el=event.target?.closest?.('[data-action]'); if(!el)return;
  if(el.dataset.action==='mfa-cancel'){ event.preventDefault(); event.stopImmediatePropagation(); const r=mfaResolve; mfaResolve=null; document.getElementById('modal-root').innerHTML=''; r?.(false); }
  if(el.dataset.action==='open-security-code'){ event.preventDefault(); event.stopImmediatePropagation(); void openSecurityCodeSettings(); }
  if(el.dataset.action==='mfa-disable'){ event.preventDefault(); event.stopImmediatePropagation(); mfaApi().unenroll({factorId:el.dataset.factorId}).then(({error})=>{ if(error)throw error; document.getElementById('modal-root').innerHTML=''; showToast('Security code off','Only your password is needed to log in now.'); }).catch(e=>showToast('Security code',e?.message||'Could not turn it off. Log out and in with your code first.')); }
},true);
"""
rep("let toolSearchQuery='';",MFA.strip()+"\nlet toolSearchQuery='';")
rep("async function finishAuthentication(snapshot) {\n  syncAccountSession(snapshot);",
    "async function finishAuthentication(snapshot) {\n  if(!(await requireMfaIfEnrolled())){ try{ await accountClient.signOut?.(); }catch{} showAuthGate('Login cancelled. A security code is required for this account.'); return; }\n  syncAccountSession(snapshot);")
rep("${planState.in_class===false&&account.profile?.role==='player'?'<button class=\"btn ghost small\" data-action=\"open-join-class\">Have a school class code?</button>':''}</div>`;",
    "${planState.in_class===false&&account.profile?.role==='player'?'<button class=\"btn ghost small\" data-action=\"open-join-class\">Have a school class code?</button>':''}<button class=\"btn ghost small\" data-action=\"open-security-code\">Login security code</button></div>`;")
open(p,'w',encoding='utf-8').write(s);print('ok')
