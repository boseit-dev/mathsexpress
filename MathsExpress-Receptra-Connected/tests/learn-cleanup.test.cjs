const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'../public');
const src=fs.readFileSync(path.join(root,'deploy-app.js'),'utf8');
const learn=src.slice(src.indexOf('function renderLearn() {'),src.indexOf('\nfunction startLesson('));

test('Learn no longer renders the large Your topics section',()=>{
  assert.doesNotMatch(learn,/\$\{learnHubHtml\(learnYearLevel\)\}/);
  assert.doesNotMatch(learn,/topic-progress-list|Your topics/);
});
test('Learn removes the top recommendation filters and panel',()=>{
  assert.doesNotMatch(learn,/recommendation-control-bar|learn-recommended-panel|Recommended next/);
});
test('Daily missions and everything below it remain in the main page',()=>{
  const missions=learn.indexOf('<section class="daily-missions-section">');
  assert.ok(missions>0);
  assert.ok(learn.indexOf('dailyMissionCards()',missions)>missions);
  assert.ok(learn.indexOf('skillFocusHtml()',missions)>missions);
  assert.ok(learn.indexOf('learn-next-row',missions)>missions);
  assert.ok(learn.indexOf('learn-strand-list',missions)>missions);
  assert.ok(learn.indexOf('curriculum-skill-card',missions)>missions);
  assert.ok(learn.indexOf('Original Algebra lessons',missions)>missions);
  assert.doesNotMatch(learn,/<details class="learn-browse"/);
});
test('new release refreshes script and service worker cache',()=>{
  const html=fs.readFileSync(path.join(root,'app.html'),'utf8');
  const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
  assert.match(html,/deploy-app\.js\?v=11\.5\.34/);
  assert.match(sw,/mathsexpress-v11-5-34-class-controls/);
});
