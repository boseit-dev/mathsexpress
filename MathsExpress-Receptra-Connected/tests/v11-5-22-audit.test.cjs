'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');

function gameFns(){
  const src=read('public/deploy-app.js');
  const grab=(name,next)=>{
    const start=src.indexOf(`function ${name}(`);
    const end=src.indexOf(`\nfunction ${next}(`,start);
    assert.ok(start>=0 && end>start,`${name} exists`);
    return src.slice(start,end);
  };
  const code=[
    grab('classGameTeamTotals','classGameVisual'),
    grab('classGameVisual','classGameLeaderboardHtml'),
    grab('classGameLeaderboardHtml','stopClassGamePolling')
  ].join('\n');
  const sandbox={escapeHtml:value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'),
    classGameState:progress=>progress?.game_state||{},classGamePercent:()=>0,Math,Number,String,Array,Object};
  vm.createContext(sandbox);vm.runInContext(code,sandbox);
  return sandbox;
}

test('class game scores use actual Blue/Gold teams (never silently count Gold as Red)',()=>{
  const {classGameTeamTotals}=gameFns();
  const totals=classGameTeamTotals([
    {team:'Blue',display_name:'Blue student',score:12,correct:2,answered:3},
    {team:'Gold',display_name:'Gold student',score:20,correct:4,answered:5},
  ]);
  assert.equal(totals.Blue.score,12);
  assert.equal(totals.Gold.score,20);
  assert.equal(totals.Gold.players,1);
  assert.equal(Object.hasOwn(totals,'Red'),false);
});

test('class-game fallback displays genuine leaderboard totals and never fake mode progress',()=>{
  const {classGameVisual}=gameFns();
  const html=classGameVisual({game_state:{}},'maths-football',[
    {team:'Blue',score:7,correct:1},{team:'Gold',score:9,correct:3}
  ]);
  assert.match(html,/BLUE TEAM/);assert.match(html,/GOLD TEAM/);
  assert.match(html,/>7<\/strong>/);assert.match(html,/>9<\/strong>/);
  assert.doesNotMatch(html,/football-ball|FIRST TO 3/);
});

test('class game leaderboard correctly includes Gold players and escapes student names',()=>{
  const {classGameLeaderboardHtml}=gameFns();
  const html=classGameLeaderboardHtml([
    {team:'Gold',display_name:'<script>bad</script>',score:14,correct:3,answered:4}
  ]);
  assert.match(html,/GOLD/);
  assert.match(html,/&lt;script&gt;bad&lt;\/script&gt;/);
  assert.doesNotMatch(html,/<script>/);
});

function serviceWorker(){
  const events={};let putCalls=0,fetchCalls=0;
  const cache={put:async()=>{putCalls++},addAll:async()=>{},match:async()=>null};
  const caches={open:async()=>cache,match:async()=>null,keys:async()=>[]};
  const self={location:{origin:'https://school.example',href:'https://school.example/service-worker.js'},
    addEventListener:(type,cb)=>{events[type]=cb;},skipWaiting:()=>{},clients:{claim:async()=>{}}};
  const sandbox={self,caches,URL,Response,fetch:async()=>{fetchCalls++;return new Response('OK',{headers:{'Content-Type':'text/plain'}})}};
  vm.runInNewContext(read('public/service-worker.js'),sandbox);
  const request=(pathname,headers={},mode='cors')=>({url:`https://school.example${pathname}`,headers:new Headers(headers),method:'GET',mode});
  async function dispatch(req){let intercepted=false;const waits=[];let promise;
    events.fetch({request:req,respondWith:p=>{intercepted=true;promise=p},waitUntil:p=>waits.push(p)});
    if(promise)await promise;await Promise.all(waits);return intercepted;
  }
  return {request,dispatch,putCalls:()=>putCalls,fetchCalls:()=>fetchCalls};
}

test('service worker leaves authenticated Supabase/API GETs network-only',async()=>{
  const sw=serviceWorker();
  assert.equal(await sw.dispatch(sw.request('/api/auth/v1/user')),false);
  assert.equal(await sw.dispatch(sw.request('/api/rest/v1/account_profiles?select=*')),false);
  assert.equal(await sw.dispatch(sw.request('/api/parent-email')),false);
  assert.equal(await sw.dispatch(sw.request('/deploy-app.js',{Authorization:'Bearer private-token'})),false);
  assert.equal(await sw.dispatch(sw.request('/styles.css',{Cookie:'session=private'})),false);
  assert.equal(sw.putCalls(),0);
});

test('service worker caches only known safe public assets, not unknown navigation paths',async()=>{
  const sw=serviceWorker();
  assert.equal(await sw.dispatch(sw.request('/admin',{}, 'navigate')),false);
  assert.equal(await sw.dispatch(sw.request('/styles.css')),true);
  assert.equal(sw.putCalls(),1);
});

test('unsupported power tools never display invented replay, diagnosis or integrity results',()=>{
  const app=read('public/deploy-app.js');
  assert.doesNotMatch(app,/Question 3<\/strong><span>Blue team took the lead/);
  assert.doesNotMatch(app,/answerTimesMs:\[250,280,260,240,270\]/);
  assert.doesNotMatch(app,/correct:x\.mastery>=50/);
  assert.doesNotMatch(app,/confidenceAttempts\|\|\[/);
});

test('missing class game state RPCs are no longer called',()=>{
  const core=read('public/deploy-core-1.js');
  assert.doesNotMatch(core,/this\.client\.rpc\('mathsexpress_class_game_(state|snapshot)_v114'/);
  assert.match(core,/classroomGameSnapshot\(sessionId\)[\s\S]*?this\.classroomGameLeaderboard\(sessionId\)/);
});
