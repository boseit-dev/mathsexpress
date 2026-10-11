'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
function modules(fetchImpl){
  const sandbox={window:{__modules:Object.create(null)},console,URL,Request,Response,Headers,
    Math,Date,JSON,Number,String,Boolean,Array,Object,Promise,RegExp,Error,Set,Map,Intl,
    setTimeout,clearTimeout,fetch:fetchImpl,
    location:{origin:'https://mathsexpress.example',pathname:'/app.html',href:'https://mathsexpress.example/app.html'},
    MATHSEXPRESS_CONFIG:{supabaseUrl:'https://example.supabase.co',supabasePublishableKey:'public-key'}};
  sandbox.globalThis=sandbox;
  vm.createContext(sandbox);vm.runInContext(read('public/deploy-core-1.js'),sandbox,{timeout:5000});
  return sandbox.window.__modules;
}

test('signup handles email verification with no session and never logs in an unverified account',async()=>{
  let sessions=0,signins=0;
  const loaded=modules(async()=>({ok:true,json:async()=>({ok:true,needsConfirmation:true})}));
  const fake={auth:{setSession:async()=>{sessions++;throw Error('must not set session')},signInWithPassword:async()=>{signins++;throw Error('must not sign in')}}};
  const account=new loaded['src/core/auth.js'].MathRiftAccountClient(()=>fake);
  const r=await account.signUp('student@example.com','some-long-password','Student','student');
  assert.equal(r.needsConfirmation,true);assert.equal(r.authenticated,false);
  assert.equal(sessions,0);assert.equal(signins,0);
});

test('signup without returned tokens signs in via standard Supabase Auth and reads the profile',async()=>{
  let signins=0;
  const loaded=modules(async()=>({ok:true,json:async()=>({ok:true,needsConfirmation:false})}));
  const fake={auth:{async signInWithPassword({email,password}){
    signins++;assert.equal(email,'student@example.com');assert.equal(password,'some-long-password');
    return {data:{session:{access_token:'access',refresh_token:'refresh'}},error:null};
  }},async rpc(name){assert.equal(name,'account_get_profile');return {data:{user_id:'id',role:'player',status:'active'},error:null};}};
  const account=new loaded['src/core/auth.js'].MathRiftAccountClient(()=>fake);
  const r=await account.signUp('student@example.com','some-long-password','Student');
  assert.equal(signins,1);assert.equal(r.authenticated,true);assert.equal(r.needsConfirmation,false);
});

test('resend signup verification calls Supabase, not a fake no-op',async()=>{
  let calls=0;
  const loaded=modules(async()=>{throw Error('unexpected fetch')});
  const fake={auth:{resend:async arg=>{calls++;assert.equal(arg.type,'signup');assert.equal(arg.email,'student@example.com');return {error:null};}}};
  const account=new loaded['src/core/auth.js'].MathRiftAccountClient(()=>fake);
  assert.equal(await account.resendSignupVerification('STUDENT@example.com'),true);
  assert.equal(calls,1);
});

test('class-game submission sends a required unique question key and never retries legacy API',async()=>{
  const loaded=modules(async()=>{throw Error('no network')});
  const calls=[];
  const fake={rpc:async (name,params)=>{calls.push({name,params});return {data:{score:10},error:null};}};
  const game=new loaded['src/core/school-cloud.js'].MathRiftSchoolClient(fake);
  await game.submitClassroomGameAnswer('session-id','lane-2','drive-key');
  assert.equal(calls.length,1);
  assert.equal(calls[0].name,'mathsexpress_class_game_answer');
  assert.equal(calls[0].params.p_question_key,'drive-key');
  assert.equal(calls[0].params.p_option_id,'lane-2');
  assert.equal(Object.hasOwn(calls[0].params,'p_correct'),false);
  await assert.rejects(game.submitClassroomGameAnswer('session-id','lane-0',''),/question key/);
});

test('classroom question comes from server without client-visible correct answer',async()=>{
  const loaded=modules(async()=>{throw Error('no network')});
  const calls=[];
  const fake={rpc:async(name,params)=>{calls.push({name,params});return {data:{id:'q1',prompt:'2 + 2 = ?',options:[{id:'lane-0',value:'4'},{id:'lane-1',value:'5'}]},error:null};}};
  const school=new loaded['src/core/school-cloud.js'].MathRiftSchoolClient(fake);
  const question=await school.classroomGameNextQuestion('game',0);
  assert.equal(question.prompt,'2 + 2 = ?');
  assert.equal(calls[0].name,'mathsexpress_class_game_next_question');
  assert.equal(calls[0].params.p_year_level,0);
  assert.equal('correct' in question.options[0],false);
});

test('daily attempt tracking has a real RPC and does not call the reward endpoint',async()=>{
  const loaded=modules(async()=>{throw Error('no network')});
  const calls=[];
  const fake={rpc:async(name,params)=>{calls.push({name,params});return {data:{recorded:true},error:null};}};
  const school=new loaded['src/core/school-cloud.js'].MathRiftSchoolClient(fake);
  const result=await school.recordDailyQuestionAttempt('reward-key',false);
  assert.equal(result.recorded,true);
  assert.equal(calls.length,1);
  assert.equal(calls[0].name,'mathsexpress_record_daily_question_attempt');
  assert.equal(calls[0].params.p_correct,false);
});

test('SQL migration locks direct tables, validates membership, blocks duplicates and rate limits answers',()=>{
  const sql=read('supabase/migrations/20261011_02_class_game_idempotency_and_daily_attempts.sql');
  assert.match(sql,/primary key\s*\(session_id, student_id, question_key\)/i);
  assert.match(sql,/create table if not exists public\.mathsexpress_class_game_questions/);
  assert.match(sql,/v_correct := v_question\.correct_option = p_option_id/);
  assert.match(sql,/for update;/i);
  assert.match(sql,/on conflict do nothing/i);
  assert.match(sql,/private\.mathrift_in_class/);
  assert.match(sql,/interval '3 seconds'/);
  assert.match(sql,/revoke all on function public\.mathsexpress_class_game_answer\(uuid,boolean\) from public, anon, authenticated/);
  assert.match(sql,/create table if not exists public\.mathsexpress_daily_question_attempts/);
  assert.match(sql,/alter table public\.mathsexpress_daily_question_attempts enable row level security/);
});

test('signup UI does not skip email confirmation, and client cooldown can retry a blocked answer',()=>{
  const app=read('public/deploy-app.js');
  assert.doesNotMatch(app,/No email verification step is required/);
  assert.match(app,/if\(result\.needsConfirmation\)/);
  assert.match(app,/classGameSubmittedKeys\.delete\(submissionKey\)/);
  assert.match(app,/startClassGameCooldown\(Math\.max\(3000/);
});
