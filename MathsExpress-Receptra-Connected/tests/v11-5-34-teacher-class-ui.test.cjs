const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'public/deploy-app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'public/styles.css'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/migrations/20261012_05_classroom_controls.sql'),'utf8');
const html=fs.readFileSync(path.join(root,'public/app.html'),'utf8');
test('class dropdown switch updates selected class and refreshes view',()=>{
  assert.match(app,/if\(action==='switch-student-class'\)/);
  assert.match(app,/selectedStudentClassId=next/);
  assert.match(app,/return void renderStudentHub\(\)/);
});
test('bulk assign guards double submits and gives real progress',()=>{
  assert.match(app,/if\(form\.dataset\.submitting==='1'\)return/);
  assert.match(app,/Promise\.all\(Array\.from\(\{length:Math\.min\(2,ids\.length\)\},run\)\)/);
  assert.match(app,/failures\.push\(\{classId/);
  assert.match(app,/bulk-assign-progress/);
  assert.match(app,/allowedTypes=new Set\(/);
});
test('teacher permissions are server backed',()=>{
  for(const func of ['mathsexpress_class_controls','mathsexpress_set_class_controls','mathsexpress_archive_class_announcement','mathsexpress_create_class_post']){
    assert.match(app,new RegExp(`rpc\\('${func}'`));
    assert.match(sql,new RegExp(`function public\\.${func}\\(`));
    assert.match(sql,new RegExp(`GRANT EXECUTE ON FUNCTION public\\.${func}\\(`));
  }
  assert.match(sql,/CREATE TRIGGER mx_guard_class_game_player/);
  assert.match(sql,/CREATE TRIGGER mx_guard_student_thread/);
  assert.match(sql,/CREATE TRIGGER mx_guard_student_reply/);
});
test('student posting respects class permissions and is rate limited',()=>{
  assert.match(sql,/NOT student_posts_enabled/);
  assert.match(sql,/posting limit reached/i);
  assert.match(app,/if\(action==='open-class-post'\)/);
  assert.match(app,/if\(form\.id==='class-post-form'\)/);
});
test('worksheet builder hidden from recommended cards and recommendations rotate',()=>{
  const renderHome=app.slice(app.indexOf('function renderHome()'),app.indexOf('function renderLearn()'));
  assert.doesNotMatch(renderHome,/Worksheet Builder/);
  assert.match(renderHome,/const rotation=eligible\.length/);
  assert.match(renderHome,/Math\.floor\(Number\(m\.questionsAnswered\|\|0\)\/3\)/);
});
test('pomodoro and leaderboard occur after games in home sidebar',()=>{
  const renderHome=app.slice(app.indexOf('function renderHome()'),app.indexOf('function renderLearn()'));
  const games=renderHome.indexOf('mx-home-games-card');
  const timer=renderHome.indexOf('mx-home-sidebar-panel mx-home-pomodoro-panel');
  const leaderboard=renderHome.indexOf('mx-home-sidebar-panel mx-home-leaderboard-main');
  const aside=renderHome.indexOf('<aside class="mx-home-side-column"');
  assert.ok(aside<games&&games<timer&&timer<leaderboard);
});
test('school surfaces are light blue in light mode and readable in dark mode',()=>{
  assert.match(css,/#e3f9ff/);
  assert.match(css,/\.school-page .school-section/);
  assert.match(css,/\.mx-home-sidebar-panel/);
});
// Was pinned to the literal v11.5.34, so it failed on every later release
// rather than catching the mistake it was written for. The real invariant is
// that the service-worker cache name tracks the app's newest asset version: if
// it does not, a release ships to browsers that keep serving the old copy.
test('the service-worker cache name matches the newest asset version',()=>{
  const sw=fs.readFileSync(path.join(root,'public/service-worker.js'),'utf8');
  const versions=[...html.matchAll(/\?v=(\d+\.\d+\.\d+)/g)].map(m=>m[1]);
  assert.ok(versions.length>=8,'app.html should cache-bust every bundle');
  const newest=versions.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).pop();
  assert.match(sw,new RegExp(`mathsexpress-v${newest.replace(/\./g,'-')}\\b`),
    `service worker should be mathsexpress-v${newest.replace(/\./g,'-')}-*, newest asset is ${newest}`);
});
