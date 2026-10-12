const test=require('node:test');const assert=require('node:assert');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function billing(){
  const src=read('worker.js');const s=src.indexOf('// ---- Billing');const e=src.indexOf('const __mxFactories={');
  const ctx={crypto:globalThis.crypto,TextEncoder,Response,URLSearchParams,JSON,Object,Number,String,Math,Date,fetch:async()=>{throw new Error('no network in tests')},MX_PUBLIC_SUPABASE_URL:'x',MX_PUBLIC_SUPABASE_KEY:'y'};
  vm.runInNewContext(src.slice(s,e)+';this.verify=__mxVerifyStripe;this.hmac=__mxHmacHex;this.checkout=__mxBillingCheckout;this.webhook=__mxBillingWebhook;this.PLANS=MX_PLANS;',ctx);return ctx;
}
test('plan prices match the published pricing (AUD cents)',()=>{
  const {PLANS}=billing();
  assert.equal(PLANS.primary_pro.cents,1000);assert.equal(PLANS.secondary_pro.cents,1500);assert.equal(PLANS.complete.cents,2000);
});
test('Stripe webhook signature: valid accepted, tampered/old/missing rejected',async()=>{
  const b=billing();const secret='whsec_test';const body='{"id":"evt_1"}';const t=Math.floor(Date.now()/1000);
  const sig=await b.hmac(secret,`${t}.${body}`);
  assert.equal(await b.verify(body,`t=${t},v1=${sig}`,secret),true);
  assert.equal(await b.verify(body+' ',`t=${t},v1=${sig}`,secret),false);
  assert.equal(await b.verify(body,`t=${t-1000},v1=${await b.hmac(secret,`${t-1000}.${body}`)}`,secret),false);
  assert.equal(await b.verify(body,'',secret),false);
});
test('without Stripe secrets, checkout says payments are not set up and the webhook grants nothing',async()=>{
  const b=billing();
  const r=await b.checkout(new Request('https://x.test/api/billing/checkout',{method:'POST',body:'{}'}),{});
  assert.equal(r.status,503);assert.match(await r.text(),/not set up/);
  const w=await b.webhook(new Request('https://x.test/api/billing/webhook',{method:'POST',body:'{}'}),{});
  assert.equal(w.status,503);
});
test('app locks paid features for free plans in the capture phase and counts questions on the server',()=>{
  const app=read('public/deploy-app.js');
  assert.match(app,/document\.addEventListener\('click',planGateClick,true\)/);
  for(const a of ['open-ai-helper','start-adaptive-practice','start-exam-practice','open-challenges','open-mistakes','open-growth-report'])assert.match(app,new RegExp(`'${a}':\\['`));
  assert.match(app,/recordPlanAttempt\(rewardKey,result\.correct\)/);assert.match(app,/recordPlanAttempt\(rewardKey,correct\)/);
  assert.match(app,/if\(planBlocksTask\(taskId\)\) return;/);
  assert.doesNotMatch(app,/recordDailyQuestionAttempt\(rewardKey/);
});
test('plans migration keeps entitlements server-only',()=>{
  const sql=read('supabase/migrations/20261014_01_plans_and_entitlements.sql');
  assert.match(sql,/revoke all on public\.mathsexpress_entitlements from public, anon, authenticated/);
  assert.match(sql,/grant execute on function public\.mathsexpress_grant_plan\([^)]*\) to service_role/);
  assert.doesNotMatch(sql,/grant execute on function public\.mathsexpress_grant_plan\([^)]*\) to authenticated/);
  assert.match(sql,/FREE_LIMIT/);assert.match(sql,/PLAN_REQUIRED/);
});
test('homepage shows all five student plans and the school plan',()=>{
  const html=read('public/index.html');
  for(const t of ['PRIMARY FREE','SECONDARY FREE','PRIMARY PRO','SECONDARY PRO','COMPLETE','Custom Pricing','Contact Us for a Quote'])assert.ok(html.includes(t),t);
  for(const p of ['$10','$15','$20'])assert.ok(html.includes(`>${p}<`),p);
  assert.match(html,/plan=primary_pro/);assert.match(html,/plan=secondary_pro/);assert.match(html,/plan=complete/);
});
