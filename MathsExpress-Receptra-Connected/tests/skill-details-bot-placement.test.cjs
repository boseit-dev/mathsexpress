const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../public/deploy-app.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../public/styles.css'),'utf8');
const extract=(a,b)=>app.slice(app.indexOf(a),app.indexOf(b));

test('Practice row opens topic/skill details rather than skipping directly to a question',()=>{
  const browser=extract('function renderLearningPath()', 'function drivingHistoryForYear');
  assert.match(browser,/class="mx-practice-skill" data-action="open-skill-practice"/);
  assert.match(app,/function openSkillPracticeDetails\(yearLevel,skillId\)/);
  assert.match(app,/data-action="start-skill-detail-practice"/);
  assert.match(app,/if \(action === 'skill-map-node' \|\| action === 'open-skill-practice'\)/);
});

test('skill details use actual curriculum skills and preserve practice route',()=>{
  const detail=extract('function openSkillPracticeDetails','function renderLearningPath');
  assert.match(detail,/learningPathRows\(year\)/);
  assert.match(detail,/x\.topic/);
  assert.match(detail,/x\.strand/);
  assert.match(app,/action === 'start-skill-detail-practice'/);
  assert.match(app,/startGeneratedTask\(task\.id,\{returnRoute:'learning-path'\}\)/);
});

test('bot is in assignment sidebar only and does not have a global fixed bubble',()=>{
  const widget=extract('function assignmentSideRailHtml','function assignmentTestModeBannerHtml');
  assert.match(widget,/botTaskIsAllowed\(\)/);
  assert.match(widget,/data-action="run-autocomplete-bot"/);
  const bot=extract('let botAccess=false','function botFillAnswer');
  assert.match(bot,/rail\.appendChild\(btn\)/);
  assert.doesNotMatch(bot,/document\.body\.appendChild/);
  assert.match(css,/\.autocomplete-bot-button\{display:none!important\}/);
});

test('bot is restricted to server-approved accounts, real assignments, and non-test tasks',()=>{
  const bot=extract('let botAccess=false','function botFillAnswer');
  assert.match(bot,/mathsexpress_my_bot_access/);
  assert.match(bot,/!activeSchoolAssignment\.localOnly/);
  assert.match(bot,/!activeSchoolAssignment\.testMode/);
  assert.match(bot,/activeSchoolAssignment\.tutorAllowed!==false/);
  assert.match(bot,/routeFromHash\(\)\.route==='generated-task'/);
  const run=extract('async function runAutoCompleteBot','let toolSearchQuery');
  assert.match(run,/await refreshBotAccess\(\)/);
  assert.match(run,/guard%5===0/);
});
