const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'public/deploy-app.js'),'utf8');
const school=fs.readFileSync(path.join(root,'public/deploy-core-1.js'),'utf8');
const migration=fs.readFileSync(path.join(root,'supabase/migrations/20261012_04_daily_mission_evidence_sync.sql'),'utf8');
const cards=app.slice(app.indexOf('function dailyMissionCards(){'),app.indexOf('function questRows()'));
test('Learn mission progress uses server evidence, not optimistic local quest counters',()=>{
 assert.match(cards,/dailyMissionStatus\?\.day/);
 assert.match(cards,/live\?\.\[q\.id\]/);
 assert.doesNotMatch(cards,/state\.quests/);
 assert.match(cards,/!done\|\|isClaimed/);
});
test('A claim waits for database writes and rechecks real progress before rewarding',()=>{
 assert.match(cards,/await Promise\.allSettled\(\[\.\.\.pendingLearningUpdates\]\)/);
 assert.match(cards,/refreshDailyMissionStatus\(true\)/);
 assert.match(cards,/if\(!row\?\.complete\)/);
 assert.match(cards,/getSchoolClient\(\)\.claimDailyMission\(id\)/);
});
test('Each attempt records to the server, including correct retries',()=>{
 assert.match(app,/if\(account\.authenticated\) void recordPlanAttempt\(rewardKey,result\.correct\)/);
 assert.match(app,/if\(account\.authenticated && !needsReview\) void recordPlanAttempt\(rewardKey,correct\)/);
 assert.match(app,/trackLearningUpdate\(write\.catch\(\(\)=>null\)\)/);
 assert.match(migration,/on conflict \(student_id,event_key\) do update/);
 assert.match(migration,/set correct=true/);
});
test('Daily missions RPC counts evidence and secures access to signed-in users',()=>{
 assert.match(school,/myDailyMissions\(\)/);
 assert.match(migration,/create or replace function public\.mathsexpress_my_daily_missions\(\)/);
 assert.match(migration,/auth\.uid\(\)/);
 assert.match(migration,/grant execute on function public\.mathsexpress_my_daily_missions\(\) to authenticated/);
 assert.match(migration,/event_type='question'/);
 assert.match(migration,/mathsexpress_daily_question_attempts/);
});
