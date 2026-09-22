'use strict';
var __modules = window.__modules || (window.__modules = Object.create(null));
// module: src/app.js
__modules["src/app.js"]=(()=>{
const {LESSONS, QUESTIONS, getLessonById, getQuestionById, getQuestionsForLesson}=__modules["src/data/questions.js"];
const {TASK_LIBRARY, TASK_LIBRARY_SIZE, TASK_TYPES, QUESTION_COUNTS, searchTaskLibrary, getTaskById, previewTask, generateTaskQuestions, questionFingerprint}=__modules["src/data/task-library.js"];
const {CURRICULUM, CURRICULUM_STRANDS, CURRICULUM_TOPICS, CURRICULUM_SYSTEMS, getCurriculumSkills, getCurriculumSkill}=__modules["src/data/curriculum.js"];
const {createGeneratedTaskRun, submitGeneratedAnswer, jumpGeneratedTask, advanceGeneratedTask, useGeneratedHint, selectGeneratedChoice, generatedTaskProgress}=__modules["src/core/generated-task-runner.js"];
const {validateAnswer, chooseQuestion}=__modules["src/core/question-engine.js"];
const {ACHIEVEMENTS, QUEST_DEFINITIONS, applyQuestionResult, evaluateAchievements, getTopicMastery, levelFromXp, touchDailyStreak}=__modules["src/core/progression.js"];
const {COSMETICS, purchaseCosmetic, equipCosmetic, getEquippedCosmetic}=__modules["src/core/inventory.js"];
const {loadState, saveState, resetState, STORAGE_KEY}=__modules["src/core/persistence.js"];
const {MathRiftAccountClient, canUseOwnerConsole, canUseTeacherHub, canUsePlatformAdmin, canUseBugTools, accountStorageKey}=__modules["src/core/auth.js"];
const {MathRiftSchoolClient}=__modules["src/core/school-cloud.js"];
const {OWNER_ACTIVITY_CATEGORIES, filterOwnerActivity, summarizeOwnerActivity, activityLabel, ownerUserSummary}=__modules["src/core/owner-activity.js"];
const {CLASSROOM_MODES, assignmentStatus, schoolCapabilitiesForRole}=__modules["src/core/school.js"];
const {buildRecommendedPractice, topicReadinessSummary, buildPlannerItems, buildAdminAnalytics}=__modules["src/core/platform.js"];
const {gradebookCsv}=__modules["src/core/reports.js"];
const {buildDashboardModel, buildProfileModel}=__modules["src/core/ui-model.js"];
const {awardQuestionGameTime, spendGameTime, formatGameTime, MAX_GAME_TIME_SECONDS}=__modules["src/core/game-time.js"];
const {createDrivingQuestion, createDrivingState, moveDrivingLane, chooseDrivingLane}=__modules["src/core/driving-game.js"];
const {startLuckyBox, revealLuckyBox}=__modules["src/core/lucky-box.js"];
const {challengeWeekKey, previousChallengeWeekKey, scoreSpeedChallenge, rankChallengeScores, formatChallengeTime, WEEKLY_REWARDS}=__modules["src/core/global-challenges.js"];
const {buildMistakeBook, buildDailyPractice, nextSmartDifficulty, masteryBand, createGoal, updateGoal, tutorResponse, generateAssessmentPack, differentiateAssignment, recurringDates, buildStudentGroups, createPoll, votePoll, createExitTicket, createCertificate, buildNotifications, normalizeFeatureFlags, exportRowsCsv, ownerAnalytics, revisionPlanDates, buildDifferentiatedTargets}=__modules["src/core/ultimate-suite.js"];
const {buildBotContext, createStudyBotReply}=__modules["src/core/ai-study-bot.js"];
const {TEXTBOOK_BOOKS, TEXTBOOK_SECTIONS, getTextbookBooks, getTextbookSection, searchTextbookSeries, textbookStats}=__modules["src/data/textbooks.js"];
const {scoreDiagnostic, buildLearningPath, scheduleSpacedReview, predictMastery, buildExamVersions, markWorkedResponse, buildRubric, buildAttendanceRegister, buildSeatingPlan, buildTournamentBracket, inspectChallengeIntegrity, createStudySession, confidenceAccuracySummary, classifyMathError, convertUnit, rearrangeFormula, buildParentWeeklySummary, duplicateAssignment, createResourceVersion, searchResourceLibrary, buildFeatureRollout, buildStatusSnapshot, buildDataRetentionPlan, buildDemoSchool, buildTimetable, buildRevisionChecklist, createFlashcards, buildFormulaSheet, buildLessonPlan, buildTermPlan, curriculumCoverage, buildMarkingScheme, buildExamPaper, buildMultiPartQuestion, progressiveHints, buildHouseStandings, buildMeritRecord, buildLateWork, buildTeacherReminders, createNotebookPage, searchEverything, buildDashboardLayout, translateMathUi, buildGameSchedule, buildErrorLog, buildAuditEntry, buildBackupManifest, buildIntegrationCatalog}=__modules["src/core/complete-suite.js"];
const {symbolicEquivalent,graphMatch,updateTrueMastery,prerequisiteMap,buildInterventionGroupsV7,misconceptionAnalytics,questionAnalytics,outcomeMap,reportComment,dailyPuzzle,seasonDefinition,safeMessages,adventureWorlds,escapeRoom,portfolioSnapshot,certificateData,qualityCheckQuestion,teacherCopilot,privacySummary,permissionCatalog,integrationCatalogV7,parseCsv,stagingPlan,schoolAchievement,statusSnapshot}=__modules["src/core/v7-features.js"];
const ROUTES = Object.freeze(['home','learn','learning-path','lesson','generated-task','assignment','textbook','textbook-lesson','student-hub','teacher-hub','teacher-class','games','elo','class-game','challenges','tools','v7','calendar','parent','shop','locker','achievements','profile','owner-activity']);
const YEAR_LEVEL_OPTIONS = Object.freeze([{value:0,label:'Kindergarten'},{value:1,label:'Year 1'},{value:2,label:'Year 2'},{value:3,label:'Year 3'},{value:4,label:'Year 4'},{value:5,label:'Year 5'},{value:6,label:'Year 6'},{value:7,label:'Year 7'},{value:8,label:'Year 8'},{value:9,label:'Year 9'},{value:10,label:'Year 10'},{value:11,label:'Year 11'},{value:12,label:'Year 12'}]);
const ASSIGNMENT_TYPE_HELP = Object.freeze({
  practice:'Teacher-selected practice using a real MathsExpress skill set.',
  custom:'Choose the skill, difficulty and question count yourself.',
  adaptive:'Difficulty adjusts to student mastery.',
  lesson:'A lesson-linked task with practice questions.',
  worksheet:'A worksheet-style task using selected/generated questions.',
  test:'Strict assessment mode with hints, AI and support locked.',
  readiness:'Prerequisite check before beginning a topic.',
  'discovery-checkin':'Broader diagnostic to discover current strengths and gaps.',
  'skills-checkin':'Recurring 5-question adaptive skills check-in.',
  'skill-check':'Quick 2-question mastery check for one skill.',
  recommended:'Personalised recommended practice.',
  revision:'Revision built around a selected skill or weak area.',
  template:'Reusable teacher task template.',
  tutorial:'Short tutorial task that teaches the workflow.',
  'bulk-custom':'Custom work intended for bulk class assignment.',
  'bulk-adaptive':'Adaptive work intended for bulk class assignment.',
  'template-sequence':'A sequence/group of reusable tasks.',
  'topic-test':'Topic test in strict assessment mode.',
  'self-directed-adaptive':'Student-directed adaptive practice.'
});
function assignmentTypeLabel(value){return TASK_TYPES.find(([id])=>id===value)?.[1]||String(value||'Task');}
function assignmentTypeQuestionCount(type, requested){
  if(type==='skill-check') return 2;
  if(type==='skills-checkin') return 5;
  if(type==='tutorial') return 6;
  if(type==='discovery-checkin') return Math.max(15,Number(requested)||20);
  if(type==='topic-test') return Math.max(10,Number(requested)||15);
  return Math.max(1,Number(requested)||10);
}
function assignmentTypeIsStrictTest(type){return type==='test'||type==='topic-test';}
async function fireAndForgetRpc(name,args={}){
  try{ await accountClient.ensureClient().rpc(name,args); }catch{}
}

function withTimeout(promise, ms=5000, message='Request timed out.') {
  const timeoutMs=Math.max(1, Number(ms)||5000);
  let timer=null;
  const timeoutPromise=new Promise((_, reject)=>{
    timer=setTimeout(()=>reject(new Error(String(message||'Request timed out.'))), timeoutMs);
  });
  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(()=>{ if(timer) clearTimeout(timer); });
}

const SCHOOL_HUB_TABS = Object.freeze([{id:'overview',label:'Overview'},{id:'staff',label:'Staff'},{id:'students',label:'Students'},{id:'classes',label:'Classes'},{id:'assignments',label:'Assignments'},{id:'reports',label:'Reports'},{id:'curriculum',label:'Curriculum'},{id:'settings',label:'Settings'}]);

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function mathHtml(value) {
  return escapeHtml(value)
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/\^(-?\d+(?:\.\d+)?)/g, '<sup>$1</sup>')
    .replace(/\^([a-zA-Z])/g, '<sup>$1</sup>');
}

function platformRoleLabel(role='player') {
  return ({player:'Student',parent:'Parent / Guardian',teacher:'Teacher',district_admin:'District Admin',bug_tester:'Bug Tester',content_editor:'Content Editor',support:'Support',admin:'Admin',owner:'Owner'})[role] || 'Student';
}

function cloveHtml(pose='happy', message='') {
  const safePose=String(pose||'happy').replace(/[^a-z-]/g,'');
  const cloveImages={happy:'clove-happy.png',encourage:'clove-encourage.png',thinking:'clove-thinking.png',celebrate:'clove-celebrate.png',laptop:'clove-laptop.png',reading:'clove-reading.png',idea:'clove-idea.png',sleep:'clove-sleep.png',done:'clove-done.png',pencil:'clove-pencil.png',thumbsup:'clove-thumbsup.png'}; const img=cloveImages[safePose]||'clove-happy.png'; return `<div class="clove-mascot clove-${safePose}"><img src="./assets/${img}?v=11.1.0" alt="Clove, the MathsExpress mascot">${message?`<div class="clove-message">${escapeHtml(message)}</div>`:''}</div>`;
}

function normaliseYearLevel(value, fallback = 9) {
  const n = Number(value);
  const safeFallback = Number.isFinite(Number(fallback)) ? Number(fallback) : 9;
  return Math.max(0, Math.min(12, Math.round(Number.isFinite(n) ? n : safeFallback)));
}

function yearLabel(yearLevel) {
  const y = normaliseYearLevel(yearLevel);
  return y === 0 ? 'Kindergarten' : `Year ${y}`;
}

function displayNameFromEmail(email='') {
  const local = String(email || '').trim().toLowerCase().split('@')[0] || '';
  const cleaned = local.replace(/\+.*$/,'').replace(/\d+$/,'').replace(/[._-]+/g,' ').replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();
  if (!cleaned) return 'MathsExpress Student';
  return cleaned.split(' ').filter(Boolean).slice(0,3).map((part)=>part.charAt(0).toUpperCase()+part.slice(1)).join(' ').slice(0,40) || 'MathsExpress Student';
}


function generatedUsernameFromEmail(email='') {
  const local=String(email||'').trim().toLowerCase().split('@')[0]||'student';
  const clean=local.replace(/\+.*/,'').replace(/\d+$/,'').replace(/[^a-z0-9_]+/g,'_').replace(/^_+|_+$/g,'').slice(0,20);
  return (clean.length>=3?clean:`student_${clean||'user'}`).slice(0,24);
}

function hideLoadingScreen() {
  const loading=document.getElementById('mx-loading-screen');
  if(!loading) return;
  requestAnimationFrame(()=>loading.classList.add('is-hidden'));
  setTimeout(()=>loading.remove(),450);
}

function withStartupTimeout(promise, ms=6000, message='MathsExpress took too long to connect.') {
  let timer;
  const timeout=new Promise((_,reject)=>{
    timer=setTimeout(()=>reject(new Error(message)),Math.max(500,Number(ms)||6000));
  });
  return Promise.race([Promise.resolve(promise),timeout]).finally(()=>clearTimeout(timer));
}

// The loading screen is decorative only. Never allow a slow network request to trap the user behind it.
const loadingScreenSafetyTimer=setTimeout(()=>{
  hideLoadingScreen();
  const gate=document.getElementById('auth-gate');
  const view=document.getElementById('app-view');
  if(!account?.authenticated && gate && !gate.innerHTML.trim() && view && !view.innerHTML.trim()) {
    showAuthGate('MathsExpress is taking longer than usual to connect. You can still log in or reload.');
  }
},4500);

function localDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function routeFromHash() {
  const raw = globalThis.location?.hash?.replace(/^#/, '') || 'home';
  const [route, param] = raw.split('/');
  return ROUTES.includes(route) ? { route, param } : { route: 'home', param: null };
}

function go(route, param = '') {
  if (!ROUTES.includes(route)) route = 'home';
  const target = `#${route}${param ? `/${param}` : ''}`;
  if (globalThis.location.hash === target) render();
  else globalThis.location.hash = target;
}

const ROUTE_TITLES = Object.freeze({
  home:'Home', learn:'Learn', 'learning-path':'Practice', lesson:'Working',
  'generated-task':'Working', textbook:'Textbook', 'textbook-lesson':'Textbook',
  games:'Games', elo:'Games', 'class-game':'Games', challenges:'Challenges',
  tools:'Tools', v7:'Teacher', calendar:'Calendar', parent:'Parent',
  shop:'Shop', locker:'Locker', achievements:'Achievements', profile:'Profile',
  'student-hub':'Assignments', 'teacher-hub':'Teacher', 'teacher-class':'Teacher',
  assignment:'Working', 'owner-activity':'Owner Console',
});
function applyPageTitle(route){
  if(typeof document==='undefined')return;
  let label=ROUTE_TITLES[route]||'MathsExpress';
  if(route==='assignment') label=activeSchoolAssignment?.testMode?'Test':'Working';
  document.title=`MathsExpress — ${label}`;
}

function downloadTextFile(filename, text, type = 'text/plain;charset=utf-8') {
  if (typeof document === 'undefined' || !globalThis.URL?.createObjectURL) return false;
  const blob = new Blob([text], { type });
  const url = globalThis.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.URL.revokeObjectURL(url);
  return true;
}

function safeStorageGet(key) {
  try { return globalThis.localStorage?.getItem?.(key) ?? null; } catch { return null; }
}
function safeStorageRemove(key) {
  try { globalThis.localStorage?.removeItem?.(key); return true; } catch { return false; }
}
function exportProgressBackup() {
  if (!state) return showToast('Nothing to back up','Open your MathsExpress account first.');
  const payload = {
    format: 'mathsexpress-progress-backup',
    version: '10.0.0',
    exportedAt: new Date().toISOString(),
    accountId: account.profile?.userId || null,
    state,
  };
  const stamp = new Date().toISOString().slice(0,10);
  const ok = downloadTextFile(`MathsExpress-Progress-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  showToast(ok ? 'Progress backup downloaded' : 'Backup unavailable', ok ? 'Keep this file safe. You can restore it in MathsExpress later.' : 'Your browser blocked the download.', ok ? 'success' : '');
}
function importProgressBackup() {
  if (typeof document === 'undefined') return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.hidden = true;
  input.addEventListener('change', async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      const parsed = JSON.parse(await file.text());
      const candidate = parsed?.format === 'mathsexpress-progress-backup' ? parsed.state : parsed?.state || parsed;
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw new Error('This is not a valid MathsExpress progress backup.');
      if (!globalThis.confirm?.('Restore this MathsExpress progress backup? Your current local progress will be replaced.')) return;
      state = saveState(globalThis.localStorage, candidate, activeStorageKey);
      state = touchDailyStreak(state, localDateString());
      persist(state, { quiet: true });
      showToast('Progress restored','Your local MathsExpress progress has been restored.','success');
      render();
    } catch (error) {
      showToast('Could not restore backup', error?.message || 'Choose a valid MathsExpress JSON backup.');
    } finally {
      input.remove();
    }
  }, { once: true });
  document.body.append(input);
  input.click();
}

let state = null;
let cloudStateSyncAvailable = false;
let cloudStateSyncTimer = null;
let cloudStateSyncInFlight = false;
let cloudStateSyncDirty = false;
const CLOUD_APP_STATE_KEYS = Object.freeze([
  'accessibilityPrefs','drivingSettings','drivingQuestionHistory','ownedDrivingTracks','drivingHighScore','updateNotesSeen',
  'textbookBookmarks','textbookProgress','textbookLastSection','textbookNotes','diagnosticHistory','skillCheckInHistory','skillCheckInSchedule',
  'personalLearningPath','confidenceAttempts','notebookPages','flashcards','focusMode','dashboardLayout','preferredLanguage','spacedReviews',
  'plannerTasks','weeklyGoalQuestions','weeklyQuestionsCompleted','mistakeBook','goals','favoriteQuestionIds','customWorksheets','parentSettings',
  'calendarItems','gameSchedule','gameStats','challengeHistory','learningPathYear','workbookMultiplier','workbookQuestionStreak',
  'v7BestWork','v7DiagnosticHistory','v7PuzzleStreak','v7SeasonProgress','v7Teams','onboardingComplete',
  'themePrefs','recommendationPrefs','characterAppearance'
]);
let currentLesson = null;
const accountClient = new MathRiftAccountClient();
let account = { authenticated: false, profile: null, session: null };
let pendingSignup = null;
let authStateSubscription = null;
let activeStorageKey = accountStorageKey('guest');
let schoolClient = null;
let selectedTeacherClassId = '';
let studentHubTab = 'class';
let selectedStudentClassId = '';
let classHubLiveTimer = null;
let teacherHubTab = 'classes';
let lastTeacherReport = null;
let activeTaskReport = null;
let activeEngagementData = [];
let activeDiscussionClassId = '';
let taskReportQuestionSort = 'incorrect';
let teacherPlannerMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let taskLibraryFilters = { query:'', yearLevel:9, pathway:'all', strand:'all', topic:'all', skillId:'all', difficulty:'all', type:'all', questionCount:'all' };
let worksheetBuilderDraft = null;
let lastSchoolReportContext = null;
let groupedReportGroupFilter = 'all';
let templateLifecycleRows = [];
let learnYearLevel = 9;
let learnExpandedStrands = new Set();
let currentGeneratedTask = null;
let teacherHubClasses = [];
let schoolHubSchools = [];
let selectedSchoolId = '';
let selectedParentChildId = '';
let schoolHubTab = 'overview';
let activeSchoolAssignment = null;
let readAloudButtonEl = null;
let achievementsFilter = 'all';
let drivingState = null;
let drivingTimer = null;
let eduGameSession = null;
let eduGameTimer = null;
let eduGameLastTickAt = 0;
let mathChessSession = null;
let mathChessTimer = null;
let mathChessLastTickAt = 0;
let eloBoardData = null;
let luckyBoxRound = null;
let speedChallenge = null;
let challengeLeaderboard = [];
let challengeRewardChecked = false;
let challengePersonalBest = null;
let activeClassSessions = [];
let activeClassGame = null;
let classGamePollTimer = null;
let classGamePollBusy = false;
let classGameAnswerPending = false;
let classGameCooldownUntil = 0;
let classGameCooldownTimer = null;
let ownerFeedback = [];
let ownerFeedbackLoading = false;
let activeToolTab = 'study';
let livePoll = null;
let exitTicket = null;
let graphPoints = [];
let graphExpression = '';
let ownerPlatformStats = { users:1, schools:0, questions:0, assignments:0, games:0, feedback:0 };
let studioContent = [];
let activeStudioContentId = null;
let textbookYearLevel = null;
let textbookPublisher = 'Cambridge';
let textbookPathway = 'all';
let textbookBookId = '';
let textbookQuery = '';
let textbookAssignContext = null;
let aiChatHistory = [];
let ownerActivityRows = [];
let ownerActivityUsers = [];
let ownerActivityStatsData = { total_users:0, active_15m:0, new_users_7d:0, events_today:0, question_attempts_today:0, class_joins_today:0 };
let ownerActivityLoading = false;
let ownerActivityLoadedAt = 0;
let ownerActivityMode = 'activity';
let ownerActivityFilters = { search:'', category:'all', eventType:'all', userId:'all', page:'all', limit:250 };
let lastTrackedRoute = '';
let activitySessionId = '';
let ownerActivityRefreshTimer = null;
let resultFlashTimer = null;
let studyTimerInterval = null;
let studyTimerRuntime = null;
let focusHiddenAt = null;
let focusStatusTimer = null;
let focusStatusLast = '';
let shopCategory = 'all';
let v6ArcadeState = null;
let calculatorAngleMode = 'deg';
let fixModeSession = null;
let textbookReadTracker = { sectionId:'', lastAt:0, maxScroll:0 };
let textbookReadTimer = null;
let assessmentIntegrity = { pasteEvents:0, fullscreenExits:0, tabLeaves:0, startedAt:0 };
let assignmentTimerInterval = null;
let assignmentTimerLastSecond = -1;
let gameServerSpendPending = 0;
let gameServerSpendInFlight = false;
let calculatorAns = 0;
let onboardingStep = 0;
let textbookExpandedChapters = new Set();
let nextStepRequestToken = 0;
let recommendationCategory = 'smart';
let recommendationShuffleSeed = 0;
let activeClassSkillFocus = [];
let activeClassSkillFocusClassId = '';
let schoolUsageRangeDays = 30;
let districtRangeDays = 90;
let districtActiveTab = 'usage';
let districtSchoolFilter = 'all';
let districtYearFilter = 'all';

const THEME_PRESETS = Object.freeze([
  {id:'clean',name:'Clean',bg:'linear-gradient(145deg,#f7f9fc,#edf3f8 48%,#f8fbfd)',accent:'#627d98',pattern:'none'},
  {id:'custom',name:'Custom colour',bg:'#e9eef5',accent:'#738158',pattern:'none'},
  {id:'ocean',name:'Ocean',bg:'linear-gradient(145deg,#e8f4f7,#dcebf0 45%,#eef7f5)',accent:'#357b86',pattern:'waves'},
  {id:'purple',name:'Purple Mist',bg:'linear-gradient(145deg,#efe9fa,#e7e0f5 48%,#f6f0fb)',accent:'#7458aa',pattern:'dots'},
  {id:'forest',name:'Forest',bg:'linear-gradient(145deg,#e8f0e1,#d9e6d0 48%,#eef3e8)',accent:'#58704a',pattern:'grid'},
  {id:'sunset',name:'Sunset',bg:'linear-gradient(145deg,#f8e7db,#f4d9cf 48%,#f9efe6)',accent:'#a9624f',pattern:'dots'},
  {id:'midnight',name:'Midnight',bg:'linear-gradient(145deg,#111827,#172033 48%,#0d1626)',accent:'#7d8cff',pattern:'stars',dark:true}
]);

const V6_ARCADE_MODES = Object.freeze([
  {id:'maths-racing',name:'Maths Racing',icon:'RACE',description:'Correct answers push your racer toward the finish line.',goal:'Reach 100% track progress.'},
  {id:'maths-football',name:'Maths Football',icon:'BALL',description:'Build an attack with correct answers and score goals.',goal:'Score 3 goals before 10 rounds.'},
  {id:'basketball',name:'Basketball Shootout',icon:'SHOT',description:'Answer correctly to take shots and build a high score.',goal:'Score as many points as possible.'},
  {id:'tower-defence',name:'Tower Defence',icon:'TOWER',description:'Power your towers with maths before the enemy reaches the base.',goal:'Survive 10 waves.'},
  {id:'boss-battle',name:'Boss Battle',icon:'BOSS',description:'Every correct answer damages the boss. Harder rounds hit harder.',goal:'Defeat the boss.'},
  {id:'dungeon',name:'Dungeon Maths',icon:'KEY',description:'Clear rooms, collect keys and escape the maths dungeon.',goal:'Clear 8 rooms.'},
]);

function skillStateKey(skillId, yearLevel = null) {
  const id=String(skillId||'');
  if(yearLevel===null || yearLevel===undefined || yearLevel==='') return id;
  return `${normaliseYearLevel(yearLevel)}:${id}`;
}

const MAX_SKILL_MASTERY = 500; // defensive ceiling only (5 mastery tiers); never a normal target.
function skillMasteryValue(skillId, yearLevel = null) {
  const scopedKey=skillStateKey(skillId,yearLevel);
  const scoped=Number(state?.skillMasteryMap?.[scopedKey]);
  if(Number.isFinite(scoped)) return Math.max(0,Math.min(MAX_SKILL_MASTERY,scoped));
  // Once a year is known, never fall back to an unscoped key. Reused skill ids such
  // as probability/coordinates/patterns must not leak mastery between year levels.
  if(yearLevel!==null && yearLevel!==undefined && yearLevel!=='') return 0;
  const local=Number(state?.skillMasteryMap?.[skillId]);
  if(Number.isFinite(local)) return Math.max(0,Math.min(MAX_SKILL_MASTERY,local));
  const legacy=Number(state?.lessonMastery?.[skillId]);
  return Number.isFinite(legacy)?Math.max(0,Math.min(MAX_SKILL_MASTERY,legacy)):0;
}
// 0-99%: normal blended growth toward first mastery. >=100%: already mastered once,
// so "Continue more" practice adds toward the next 100-point tier instead of being
// squashed back down by the blend formula (which only ever settles near 100).
function nextSkillMasteryValue(old, accuracy) {
  const safeOld = Math.max(0, Number(old) || 0);
  const acc = Math.max(0, Math.min(100, Number(accuracy) || 0));
  if (safeOld < 100) return Math.max(safeOld, Math.round(safeOld * .45 + acc * .55));
  return Math.min(MAX_SKILL_MASTERY, safeOld + Math.round(acc * .2));
}
// Ring fill (0-100) for a mastery value that may exceed 100: shows progress within
// the CURRENT 100-point tier, not the raw total (so 200% draws a full ring, not a
// ring that would need to wrap around twice).
function masteryTierProgress(value) {
  const v = Math.max(0, Number(value) || 0);
  if (v <= 0) return 0;
  const mod = v % 100;
  return mod === 0 ? 100 : mod;
}

function migrateLegacyMasteryToCurrentYear(profileYear) {
  if(!state || state.masteryYearScopeMigratedV86) return state;
  const year=normaliseYearLevel(profileYear,9);
  const allSkills=[];
  for(let y=0;y<=12;y+=1) allSkills.push(...getCurriculumSkills({yearLevel:y}));
  const idYears=new Map();
  for(const skill of allSkills){
    const id=String(skill.id); if(!idYears.has(id)) idYears.set(id,new Set()); idYears.get(id).add(Number(skill.yearLevel));
  }
  const currentSkills=getCurriculumSkills({yearLevel:year});
  const map={...(state.skillMasteryMap||{})};
  for(const skill of currentSkills){
    const id=String(skill.id), scoped=skillStateKey(id,year);
    if(Number.isFinite(Number(map[scoped]))) continue;
    // Only migrate legacy mastery when that skill id belongs to exactly one year.
    // Reused ids (probability, coordinates, patterns, etc.) start fresh so old data cannot bleed years.
    if((idYears.get(id)?.size||0)!==1) continue;
    const legacy=Number(map[id] ?? state?.lessonMastery?.[id]);
    if(Number.isFinite(legacy)) map[scoped]=Math.max(0,Math.min(100,legacy));
  }
  return {...state,skillMasteryMap:map,masteryYearScopeMigratedV86:true};
}


function learningPathRows(yearLevel) {
  const skills=getCurriculumSkills({yearLevel:Number(yearLevel)});
  const previousByStrand=new Map();
  return skills.map((skill,index)=>{
    const mastery=skillMasteryValue(skill.id,skill.yearLevel);
    const prev=previousByStrand.get(skill.strand)||null;
    const unlocked=true;
    previousByStrand.set(skill.strand,skill);
    return {...skill,mastery,prerequisiteId:prev?.id||null,unlocked,index};
  });
}

function recommendedLearningPathSkill() {
  const profileYear=normaliseYearLevel(account.profile?.yearLevel);
  const all=learningPathRows(profileYear);
  return all.filter(x=>x.unlocked&&x.mastery<85).sort((a,b)=>a.mastery-b.mastery||a.yearLevel-b.yearLevel)[0] || learningPathRows(profileYear)[0] || null;
}

function taskForLearningSkill(skill,type='adaptive',questionCount=10) {
  if(!skill)return null;
  const yearLevel=normaliseYearLevel(skill.yearLevel,account.profile?.yearLevel);
  const mastery=skillMasteryValue(skill.id,yearLevel);
  const difficulty=mastery>=75?'hard':mastery>=40?'medium':'easy';
  const direct=searchTaskLibrary({yearLevel,skillId:skill.id,type,difficulty,questionCount,limit:1})[0]
    || searchTaskLibrary({yearLevel,skillId:skill.id,type:'practice',difficulty,questionCount,limit:1})[0]
    || searchTaskLibrary({yearLevel,skillId:skill.id,limit:1})[0];
  if(direct)return direct;
  const topic=String(skill.topic||skill.strand||'').trim();
  return searchTaskLibrary({yearLevel,topic,type,difficulty,questionCount,limit:1})[0]
    || searchTaskLibrary({yearLevel,topic,type:'practice',questionCount,limit:1})[0]
    || searchTaskLibrary({yearLevel,type:'practice',questionCount,limit:1})[0]
    || searchTaskLibrary({yearLevel,limit:1})[0]
    || null;
}

function scheduleSkillReviews(skill,accuracy) {
  if(!skill?.id || Number(accuracy)<55) return state.spacedReviews||[];
  const existing=(state.spacedReviews||[]).filter(r=>r.skillId!==skill.id || normaliseYearLevel(r.yearLevel,skill.yearLevel)!==normaliseYearLevel(skill.yearLevel) || r.done);
  const dates=scheduleSpacedReview(new Date(),accuracy>=85?6:4);
  const created=dates.map((d,i)=>({id:`review-${skill.id}-${Date.now()}-${i}`,skillId:skill.id,yearLevel:normaliseYearLevel(skill.yearLevel,account.profile?.yearLevel),title:`${skill.title||skill.skill} review`,dueAt:d.toISOString(),done:false}));
  return [...existing,...created].slice(-500);
}

function recordGeneratedTaskMastery(run,task,accuracy) {
  if(run.v6MasteryRecorded)return;
  run.v6MasteryRecorded=true;
  const old=skillMasteryValue(task.skillId,task.yearLevel);
  const blended=nextSkillMasteryValue(old,accuracy);
  const hour=new Date().getHours();
  const secretFlags={...(state.secretFlags||{})};
  if(hour>=22)secretFlags.nightOwl=true;
  if(hour<=6)secretFlags.earlyBird=true;
  const next={...state,
    skillMasteryMap:{...(state.skillMasteryMap||{}),[skillStateKey(task.skillId,task.yearLevel)]:blended},
    spacedReviews:scheduleSkillReviews(task,accuracy),
    weeklyQuestionsCompleted:(Number(state.weeklyQuestionsCompleted)||0)+Number(run.questions?.length||0),
    secretFlags,
  };
  persist(evaluateAchievements(next),{quiet:true});
  if(account.authenticated && task.skillId) getSchoolClient().saveSkillMastery(task.skillId,blended).catch(()=>{});
}

function renderLearningPath() {
  const view=document.getElementById('app-view');
  const ownYear=normaliseYearLevel(account.profile?.yearLevel);
  const canBrowseAllYears=canUseTeacherHub(account);
  const year=canBrowseAllYears?normaliseYearLevel(state.learningPathYear,ownYear):ownYear;
  const rows=learningPathRows(year);
  const groups=[...new Set(rows.map(x=>x.strand))];
  const mastered=rows.filter(x=>x.mastery>=80).length;
  const skillSymbol=(skill)=>{const t=`${skill.strand} ${skill.title}`.toLowerCase();if(/fraction|ratio|percent/.test(t))return '½';if(/integer|number/.test(t))return '123';if(/algebra|equation/.test(t))return 'x';if(/graph|linear/.test(t))return '↗';if(/geometry|angle|shape/.test(t))return '△';if(/measure|length|area|volume/.test(t))return '⌗';if(/probab/.test(t))return '◉';if(/stat|data/.test(t))return '▥';if(/finance|money/.test(t))return '$';return '∑';};
  view.innerHTML=`<div class="page mx-skill-map-page">
    <header class="mx-skill-map-head"><span class="eyebrow">${escapeHtml(yearLabel(year))} pathway</span><h1>Your skills map</h1><p>Choose a topic, practise skills, and grow the progress rings as your mastery improves.</p><div class="mx-skill-map-tabs"><button class="active">Topics</button><button data-route="learn">All skills</button></div><div class="mx-skill-map-summary"><strong>${mastered}</strong><span>mastered</span><strong>${rows.length}</strong><span>skills</span></div></header>
    ${canBrowseAllYears?`<div class="mx-year-dropdown mx-skill-year-switcher"><label for="learning-path-year-select"><span>Year level</span><select id="learning-path-year-select" data-action="learning-path-year-select" aria-label="Choose year level">${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<option value="${value}" ${year===value?'selected':''}>${escapeHtml(label)}</option>`).join('')}</select></label></div>`:''}
    <div class="mx-skill-map-groups">${groups.map((strand,strandIndex)=>`<section class="mx-skill-topic-panel" style="--stagger:${strandIndex}"><h2>${escapeHtml(strand)}</h2><div class="mx-skill-badge-grid">${rows.filter(x=>x.strand===strand).map((skill,skillIndex)=>{const m=Math.round(skill.mastery||0);const tier=Math.floor(m/100);return `<button class="mx-skill-badge ${m>=80?'mastered':skill.unlocked?'ready':'locked'}" style="--stagger:${skillIndex}" data-action="start-path-skill" data-skill-id="${escapeHtml(skill.id)}" data-skill-year="${skill.yearLevel}" ${skill.unlocked?'':'disabled'}><span class="mx-skill-ring" style="--skill-progress:${masteryTierProgress(m)}">${tier>0?`<em class="mx-skill-tier">×${tier+1}</em>`:''}<i>${escapeHtml(skillSymbol(skill))}</i></span><strong>${escapeHtml(skill.title||skill.skill)}</strong><small>${m}% mastery</small></button>`;}).join('')}</div></section>`).join('')}</div>
  </div>`;
}

function drivingHistoryForYear(year=normaliseYearLevel(account.profile?.yearLevel)){return Array.isArray(state?.drivingQuestionHistory?.[String(year)])?state.drivingQuestionHistory[String(year)]:[];}
function rememberPersistentDrivingPrompt(prompt,year=normaliseYearLevel(account.profile?.yearLevel)){
  if(!prompt||!state)return;
  const key=String(year);
  const next=[...drivingHistoryForYear(year),String(prompt)].filter(Boolean);
  persist({...state,drivingQuestionHistory:{...(state.drivingQuestionHistory||{}),[key]:[...new Set(next)].slice(-180)}},{quiet:true});
}
function newArcadeQuestion(){ const year=normaliseYearLevel(account.profile?.yearLevel); return createDrivingQuestion(year,Math.random,drivingHistoryForYear(year)); }
function startV6Arcade(modeId){
  const mode=V6_ARCADE_MODES.find(m=>m.id===modeId); if(!mode)return;
  if((state.gameTimeSeconds||0)<10)return showToast('Earn more Game Time','You need at least 10 seconds to start an arcade round.');
  v6ArcadeState={mode,round:1,score:0,correct:0,wrong:0,progress:0,goals:0,hp:100,bossHp:100,rooms:0,question:newArcadeQuestion(),finished:false,message:''};
  renderV6ArcadeModal();
}
function renderV6ArcadeModal(){
  const g=v6ArcadeState;if(!g)return;
  const metric=g.mode.id==='maths-football'?`${g.goals}/3 goals`:g.mode.id==='boss-battle'?`${Math.max(0,g.bossHp)} boss HP`:g.mode.id==='dungeon'?`${g.rooms}/8 rooms`:g.mode.id==='maths-racing'?`${Math.min(100,g.progress)}% track`:g.mode.id==='tower-defence'?`${Math.max(0,g.hp)} base HP`:`${g.score} points`;
  const status=g.finished?`<div class="arcade-finish"><span>${g.correct>=g.wrong?'🏆':'↺'}</span><h3>${escapeHtml(g.message||'Round finished')}</h3><p>${g.score} points · ${g.correct} correct · ${g.wrong} missed</p><button class="btn primary" data-action="start-v6-game" data-game="${g.mode.id}">Play again</button></div>`:`<div class="arcade-question"><span class="eyebrow">Round ${g.round} · costs 10s Game Time</span><h3>${mathHtml(g.question.prompt)}</h3><div class="arcade-choice-grid">${g.question.options.map(o=>`<button data-action="v6-game-answer" data-choice="${o.id}">${mathHtml(o.value)}</button>`).join('')}</div></div>`;
  openSimpleModal(`${g.mode.icon} ${g.mode.name}`,`<div class="v6-arcade"><div class="arcade-hud"><div><small>MISSION</small><strong>${escapeHtml(g.mode.goal)}</strong></div><div><small>STATUS</small><strong>${escapeHtml(metric)}</strong></div><div><small>GAME TIME</small><strong>${formatGameTime(state.gameTimeSeconds)}</strong></div></div>${status}</div>`);
}
function answerV6Arcade(choiceId){
  const g=v6ArcadeState;if(!g||g.finished)return;
  if((state.gameTimeSeconds||0)<10){g.finished=true;g.message='Game Time ran out.';return renderV6ArcadeModal();}
  const picked=g.question.options.find(o=>o.id===choiceId);const correct=Boolean(picked?.correct);
  rememberPersistentDrivingPrompt(g.question?.prompt,g.question?.yearLevel||normaliseYearLevel(account.profile?.yearLevel));
  state=saveState(globalThis.localStorage,spendGameTime(state,10),activeStorageKey);
  if(correct){g.correct++;g.score+=100+g.round*10;if(g.mode.id==='maths-racing')g.progress+=20;if(g.mode.id==='maths-football'&&g.correct%3===0)g.goals++;if(g.mode.id==='boss-battle')g.bossHp-=15+Math.min(15,g.round);if(g.mode.id==='dungeon')g.rooms++;}
  else{g.wrong++;if(g.mode.id==='tower-defence')g.hp-=18;if(g.mode.id==='maths-racing')g.progress=Math.max(0,g.progress-5);}
  if(g.mode.id==='tower-defence'&&correct)g.hp=Math.min(100,g.hp+5);
  g.round++;
  const win=(g.mode.id==='maths-racing'&&g.progress>=100)||(g.mode.id==='maths-football'&&g.goals>=3)||(g.mode.id==='boss-battle'&&g.bossHp<=0)||(g.mode.id==='dungeon'&&g.rooms>=8)||(g.round>10&&g.mode.id!=='boss-battle'&&g.mode.id!=='dungeon'&&g.mode.id!=='maths-racing'&&g.mode.id!=='maths-football');
  const lose=(g.mode.id==='tower-defence'&&g.hp<=0)||(g.round>15);
  if(win||lose){g.finished=true;g.message=win?'You completed the mission!':'Mission ended — use the result to try again.';const prev=state.gameStats?.[g.mode.id]||{};persist({...state,gameStats:{...(state.gameStats||{}),[g.mode.id]:{plays:(prev.plays||0)+1,bestScore:Math.max(prev.bestScore||0,g.score),lastScore:g.score}}},{quiet:true});}
  else g.question=newArcadeQuestion();
  renderV6ArcadeModal();
}

function assignmentControlModal(assignmentId){
  const a=(lastTeacherReport?.assignments||[]).find(x=>String(x.id)===String(assignmentId));if(!a)return showToast('Assignment unavailable','Open the class report again.');
  const cfg=a.config||{};const students=lastTeacherReport?.students||[];
  const dt=(value)=>{if(!value)return '';const d=new Date(value);if(!Number.isFinite(d.getTime()))return '';const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;};
  openSimpleModal('Assignment controls',`<form id="assignment-controls-form" class="school-form"><input type="hidden" name="assignmentId" value="${escapeHtml(a.id)}"><h3>${escapeHtml(a.title)}</h3><label class="check-row"><input type="checkbox" name="paused" ${cfg.paused?'checked':''}> Pause this assignment</label><label class="check-row"><input type="checkbox" name="gamesLocked" ${cfg.games_locked?'checked':''}> Lock MathsExpress games while students are working</label><label class="check-row"><input type="checkbox" name="focusRequired" ${cfg.focus_required?'checked':''}> Show focus status reminder during this task</label><label class="check-row"><input type="checkbox" name="resultsReleased" ${a.results_released!==false?'checked':''}> Release results to students</label><div class="form-two"><label>Starts at<input name="startAt" type="datetime-local" value="${escapeHtml(dt(a.start_at||cfg.start_at))}"></label><label>Due date<input name="dueAt" type="datetime-local" value="${escapeHtml(dt(a.due_at))}"></label></div><div class="form-two"><label>Time limit (minutes)<input name="timeLimit" type="number" min="1" max="240" value="${a.time_limit_minutes||''}" placeholder="No limit"></label><label class="check-row schedule-check"><input type="checkbox" name="exactStart" ${cfg.exact_scheduled_start?'checked':''}> Timer starts from the scheduled start time for everyone</label></div><p class="muted">With exact scheduled start, a 45-minute test beginning at 10:00 ends at 10:45 for the whole class, even if a student opens it late.</p><button class="btn primary" type="submit">Save assignment controls</button></form><hr><form id="student-accommodation-form" class="school-form"><input type="hidden" name="assignmentId" value="${escapeHtml(a.id)}"><h3>Student accommodation</h3><label>Student<select name="studentId" required>${students.map(st=>`<option value="${escapeHtml(st.user_id)}">${escapeHtml(st.display_name||st.email||'Student')}</option>`).join('')}</select></label><div class="form-two"><label>Extra time (minutes)<input name="extraMinutes" type="number" min="0" max="240" value="10"></label><div class="unlimited-attempts-note"><small>Attempts</small><strong>Unlimited</strong><span>Students can retry assigned work as many times as they need.</span></div></div><button class="btn secondary" type="submit">Save for student</button></form>`);
}

function getSchoolClient() {
  if (!schoolClient) schoolClient = new MathRiftSchoolClient(accountClient.ensureClient());
  return schoolClient;
}

function getActivitySessionId() {
  if (activitySessionId) return activitySessionId;
  try {
    const key='mathsexpress.activity.session';
    const existing=globalThis.sessionStorage?.getItem(key);
    if(existing) activitySessionId=existing;
    else {
      activitySessionId=globalThis.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
      globalThis.sessionStorage?.setItem(key,activitySessionId);
    }
  } catch { activitySessionId=`session-${Date.now()}`; }
  return activitySessionId;
}

function activityCategoryForAction(action='') {
  const value=String(action);
  if(/lesson|question|practice|textbook|hint|solution|diagnostic|study|goal|revision/.test(value)) return 'learning';
  if(/assign|task|homework|test|exam/.test(value)) return 'assignment';
  if(/class|student|teacher|attendance|seating|group/.test(value)) return 'class';
  if(/school|principal|staff|curriculum|parent/.test(value)) return 'school';
  if(/game|drive|lucky|shop|cosmetic/.test(value)) return 'game';
  if(/challenge|leaderboard|tournament|duel/.test(value)) return 'challenge';
  if(/coin|xp|streak|badge|reward|certificate/.test(value)) return 'reward';
  if(/feedback|bug|suggestion/.test(value)) return 'feedback';
  if(/owner|admin|maintenance|broadcast|audit|backup|rollout/.test(value)) return 'admin';
  if(/setting|profile|accessibility|theme|language/.test(value)) return 'settings';
  return 'navigation';
}

function safeActionDetails(element) {
  const out={};
  const allowed=['taskId','lessonId','sectionId','contentId','classId','schoolId','mode','tab','setting','itemId','feedbackId','status','year','pathway','route','param'];
  for(const key of allowed) if(element?.dataset?.[key]!=null && String(element.dataset[key]).length<=160) out[key]=String(element.dataset[key]);
  return out;
}

function setOwnerActivityAutoRefresh(active) {
  if(!active){ if(ownerActivityRefreshTimer){ clearInterval(ownerActivityRefreshTimer); ownerActivityRefreshTimer=null; } return; }
  if(ownerActivityRefreshTimer) return;
  ownerActivityRefreshTimer=setInterval(()=>{ if(routeFromHash().route==='owner-activity') { ownerActivityLoadedAt=0; loadOwnerActivityData(true); } else setOwnerActivityAutoRefresh(false); },15000);
}

const pendingLearningUpdates=new Set();
const pendingMissionClaims=new Set();
function trackLearningUpdate(promise){const tracked=Promise.resolve(promise);pendingLearningUpdates.add(tracked);tracked.finally(()=>pendingLearningUpdates.delete(tracked)).catch(()=>{});return tracked;}
function trackActivityEvent(eventType, category='system', action='', details={}) {
  if(!account.authenticated) return Promise.resolve(null);
  const route=routeFromHash();
  return trackLearningUpdate(getSchoolClient().trackOwnerEvent({
    eventType, category, action:action||eventType, page:route.route,
    schoolId:selectedSchoolId||null, classId:selectedTeacherClassId||null,
    assignmentId:activeSchoolAssignment?.id||null, sessionId:getActivitySessionId(), details,
  }).catch(()=>null));
}

function currentFocusClassId() {
  return activeSchoolAssignment?.classId || null;
}

function syncStudentFocusStatus(nextState='active', {force=false}={}) {
  if (!account.authenticated || !activeSchoolAssignment?.id) return Promise.resolve(null);
  const classId=currentFocusClassId();
  if (!classId) return Promise.resolve(null);
  const stateKey=`${nextState}:${classId}:${activeSchoolAssignment.id}`;
  if (!force && focusStatusLast===stateKey) return Promise.resolve(null);
  focusStatusLast=stateKey;
  const details={assignmentId:activeSchoolAssignment.id,classId};
  if(nextState==='hidden' || nextState==='away') focusHiddenAt=focusHiddenAt || Date.now();
  if(nextState==='active' && focusHiddenAt){ details.awaySeconds=Math.max(1,Math.round((Date.now()-focusHiddenAt)/1000)); focusHiddenAt=null; }
  trackActivityEvent('focus-status','assignment',`focus-${nextState}`,details).catch?.(()=>{});
  return getSchoolClient().updateFocusStatus({state:nextState,classId,assignmentId:activeSchoolAssignment.id}).catch(()=>null);
}

function startFocusHeartbeat() {
  if (focusStatusTimer) return;
  focusStatusTimer=setInterval(()=>{
    if(!activeSchoolAssignment?.id) return;
    syncStudentFocusStatus(document.hidden?'hidden':document.hasFocus?.()===false?'away':'active',{force:true});
  },30000);
}

function stopFocusHeartbeat() {
  if (focusStatusTimer) { clearInterval(focusStatusTimer); focusStatusTimer=null; }
  focusStatusLast='';
  focusHiddenAt=null;
}

async function loadOwnerActivityData(force=false) {
  if(!canUseOwnerConsole(account) || ownerActivityLoading) return;
  if(!force && ownerActivityLoadedAt && Date.now()-ownerActivityLoadedAt<12000) return;
  ownerActivityLoading=true;
  if(routeFromHash().route==='owner-activity') renderOwnerActivity(false);
  try {
    const client=getSchoolClient();
    const userId=ownerActivityFilters.userId==='all'?null:ownerActivityFilters.userId;
    const [events,users,stats]=await Promise.all([
      client.ownerActivityFeed({...ownerActivityFilters,userId}),
      client.ownerUserDirectory(ownerActivityFilters.search,500),
      client.ownerActivityStats(),
    ]);
    ownerActivityRows=Array.isArray(events)?events:[];
    ownerActivityUsers=Array.isArray(users)?users:[];
    ownerActivityStatsData=stats||ownerActivityStatsData;
    ownerActivityLoadedAt=Date.now();
  } catch(error) {
    showToast('Activity Center unavailable',error.message||'Could not load owner activity.');
  } finally {
    ownerActivityLoading=false;
    if(routeFromHash().route==='owner-activity') renderOwnerActivity(false);
  }
}

async function syncPlatformSettings() {
  if (!account.authenticated || !state) return;
  try {
    const client=accountClient.ensureClient();
    const {data,error}=await client.from('mathsexpress_platform_settings').select('*').eq('singleton',true).single();
    if(error||!data) return;
    const key=String(data.updated_at||'');
    let notifications=[...(state.notifications||[])];
    if(data.broadcast_title && key && !(state.updateNotesSeen||[]).includes(`broadcast:${key}`)) {
      notifications.push({id:`broadcast:${key}`,type:'broadcast',title:data.broadcast_title,body:data.broadcast_body||'',createdAt:key});
    }
    state=persist({...state,ownerSettings:{maintenanceMode:Boolean(data.maintenance_mode),maintenanceMessage:data.maintenance_message||'MathsExpress is being updated. Please try again soon.',broadcastTitle:data.broadcast_title||'',broadcastBody:data.broadcast_body||'',updatedAt:key},notifications:notifications.slice(-100),updateNotesSeen:[...(state.updateNotesSeen||[]),...(data.broadcast_title&&key?[`broadcast:${key}`]:[])].slice(-100)},{quiet:true});
  } catch {}
}

async function updatePlatformSettingsRemote({maintenanceMode,maintenanceMessage,broadcastTitle,broadcastBody}={}) {
  const client=accountClient.ensureClient();
  const {data,error}=await client.rpc('mathsexpress_owner_platform_settings',{p_maintenance:Boolean(maintenanceMode),p_message:String(maintenanceMessage||'MathsExpress is being updated. Please try again soon.'),p_broadcast_title:broadcastTitle||null,p_broadcast_body:broadcastBody||null});
  if(error) throw error; return data||{};
}

function cloudSafeAppState(source=state) {
  const out={};
  if(!source||typeof source!=='object') return out;
  for(const key of CLOUD_APP_STATE_KEYS) if(Object.prototype.hasOwnProperty.call(source,key)) out[key]=source[key];
  return out;
}

async function flushCloudAppState() {
  if(!account.authenticated || !state || cloudStateSyncInFlight) { if(cloudStateSyncInFlight) cloudStateSyncDirty=true; return false; }
  cloudStateSyncInFlight=true;
  try {
    await getSchoolClient().saveUserAppState(cloudSafeAppState(state));
    cloudStateSyncAvailable=true;
    return true;
  } catch(error) {
    cloudStateSyncAvailable=false;
    if(!/mathsexpress_(get|put)_user_app_state|schema cache|could not find|does not exist/i.test(String(error?.message||''))) console.warn('Cloud app-state sync failed',error);
    return false;
  } finally {
    cloudStateSyncInFlight=false;
    if(cloudStateSyncDirty){cloudStateSyncDirty=false;scheduleCloudAppStateSync(500);}
  }
}

function scheduleCloudAppStateSync(delay=350) {
  if(!account.authenticated || !state) return;
  if(cloudStateSyncTimer) clearTimeout(cloudStateSyncTimer);
  cloudStateSyncTimer=setTimeout(()=>{cloudStateSyncTimer=null;void flushCloudAppState();},Math.max(100,Number(delay)||350));
}

async function hydrateCloudAppState() {
  if(!account.authenticated || !state) return false;
  try {
    const data=await getSchoolClient().getUserAppState();
    const remote=(data&&typeof data.state==='object'&&data.state&&!Array.isArray(data.state))?data.state:{};
    cloudStateSyncAvailable=true;
    if(Object.keys(remote).length){
      state=saveState(globalThis.localStorage,{...state,...remote},activeStorageKey);
      applyAccessibilityPreferences(); updateChrome();
    } else {
      await flushCloudAppState();
    }
    return true;
  } catch(error) {
    cloudStateSyncAvailable=false;
    if(!/mathsexpress_(get|put)_user_app_state|schema cache|could not find|does not exist/i.test(String(error?.message||''))) console.warn('Cloud app-state hydration failed',error);
    return false;
  }
}

async function secureSignOut() {
  const previousKey=activeStorageKey;
  const synced=await flushCloudAppState();
  try { await accountClient.signOut(); } finally {
    if(synced) safeStorageRemove(previousKey);
    account = { authenticated:false, profile:null, session:null };
    state = null; activeStorageKey = accountStorageKey('guest'); cloudStateSyncAvailable=false;
    updateAccountChrome(); go('home'); showAuthGate('Signed out. Log in to keep learning.');
  }
}

async function submitPrivacyRequest(type) {
  if(!account.authenticated) return showToast('Sign in required','Log in first.');
  const label=type==='deletion'?'account/data deletion':type==='export'?'data export':type;
  if(type==='deletion' && !globalThis.confirm?.('Send a request to delete your MathsExpress account data? This does not delete it immediately. The operator must verify and process the request.')) return;
  try {
    const result=await getSchoolClient().createPrivacyRequest(type,`Requested in MathsExpress on ${new Date().toISOString()}`);
    showToast(result?.already_open?'Request already open':'Request sent',`Your ${label} request has been recorded.`,'success');
  } catch(error) { showToast('Could not send request',error?.message||'Try again later.'); }
}

function achievementRewardFor(achievementId) {
  const index=Math.max(0,ACHIEVEMENTS.findIndex((item)=>String(item.id)===String(achievementId)));
  const tier=Math.min(4,Math.floor(index/40));
  return { coins:10+(tier*5), xp:20+(tier*10), gameTimeSeconds:10+(tier*5) };
}

function applyAchievementRewards(nextState, previousAchievements=new Set()) {
  const earned=[...new Set(nextState.achievements||[])];
  const claimed=new Set(nextState.achievementRewardsClaimed||[]);
  const unclaimed=earned.filter((id)=>!claimed.has(id));
  const newlyUnlocked=earned.filter((id)=>!previousAchievements.has(id));
  let coins=Number(nextState.coins)||0;
  let xp=Number(nextState.xp)||0;
  let gameTimeSeconds=Math.max(0,Math.min(MAX_GAME_TIME_SECONDS,Number(nextState.gameTimeSeconds)||0));
  for(const id of unclaimed){
    const reward=achievementRewardFor(id);
    coins+=reward.coins;
    xp+=reward.xp;
    gameTimeSeconds=Math.min(MAX_GAME_TIME_SECONDS,gameTimeSeconds+reward.gameTimeSeconds);
    claimed.add(id);
  }
  return {
    state:{...nextState,coins,xp,gameTimeSeconds,achievementRewardsClaimed:[...claimed]},
    newlyUnlocked,
    rewardedNow:unclaimed,
  };
}

function persist(nextState, { quiet = false, skipCloud = false } = {}) {
  const oldLevel = state ? levelFromXp(state.xp) : 1;
  const previousAchievements=new Set(state?.achievements||[]);
  const evaluated=evaluateAchievements(nextState);
  const achievementResult=applyAchievementRewards(evaluated,previousAchievements);
  state = saveState(globalThis.localStorage, achievementResult.state, activeStorageKey);
  applyAccessibilityPreferences();
  const newLevel = levelFromXp(state.xp);
  updateChrome();
  if (!skipCloud) scheduleCloudAppStateSync();
  if (achievementResult.newlyUnlocked.length) {
    const first=ACHIEVEMENTS.find((item)=>String(item.id)===String(achievementResult.newlyUnlocked[0]));
    const reward=achievementRewardFor(achievementResult.newlyUnlocked[0]);
    const more=achievementResult.newlyUnlocked.length>1?` + ${achievementResult.newlyUnlocked.length-1} more`:'';
    showToast('Achievement unlocked!', `${first?.secretTitle||first?.title||'New badge'}${more} · +${reward.coins} coins · +${reward.xp} XP · +${reward.gameTimeSeconds}s Game Time`, 'reward');
  }
  if (!quiet && newLevel > oldLevel) showToast('Level up!', `You reached Level ${newLevel}.`, 'reward');
  return state;
}

function autoTrackedGoalValue(goal, s) {
  if (goal.metric === 'questions') return Number(s?.stats?.answered) || 0;
  if (goal.metric === 'streak') return Number(s?.streak) || 0;
  return null;
}

// Recomputes progress for auto-tracked goals (questions answered, day streak) from
// live account stats instead of relying on the student to click a manual +1 button.
// 'custom' goals have no trackable stat behind them, so they keep the manual button.
function syncGoalsAutoProgress() {
  const goals = state?.goals || [];
  if (!goals.length) return goals;
  let changed = false;
  const nextGoals = goals.map((g) => {
    if (g.completed || g.metric === 'custom' || !g.metric) return g;
    const current = autoTrackedGoalValue(g, state);
    if (current === null) return g;
    const progress = Math.max(0, Math.min(g.target, current - (Number(g.baseline) || 0)));
    const completed = progress >= g.target;
    if (progress === g.progress && completed === g.completed) return g;
    changed = true;
    if (g.remoteId) getSchoolClient().updateGoal(g.remoteId, progress, completed ? 'completed' : 'active').catch(() => {});
    return { ...g, progress, completed };
  });
  if (!changed) return nextGoals;
  persist({ ...state, goals: nextGoals }, { quiet: true });
  return state.goals;
}

function updateChrome() {
  if (!state || typeof document === 'undefined') return;
  const model = buildDashboardModel(state);
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setText('top-level', model.level);
  setText('top-xp', `${model.xp} XP`);
  setText('top-coins', model.coins);
  setText('top-points', Math.max(0,Number(account.profile?.weeklyPoints)||0).toLocaleString());
  setText('top-streak', model.streak);
  setText('top-game-time', formatGameTime(state.gameTimeSeconds));
  updateStudyTimerDisplay();
  setText('side-player-name', state.playerName);
  const sideTitle=getEquippedCosmetic(state,'title')?.name||'';
  setText('side-player-level', sideTitle ? `${sideTitle} · Level ${model.level}` : `Level ${model.level}`);
  const flags=normalizeFeatureFlags(state.featureFlags||{});
  const gamesNav=document.querySelector('[data-route="games"].nav-item'); if(gamesNav) gamesNav.hidden=!flags.games;
  const challengeNav=document.querySelector('[data-route="challenges"].nav-item'); if(challengeNav) challengeNav.hidden=!flags.globalChallenges;
  const currentRoute=routeFromHash().route;
  const assignmentWorkspaceRoute=['assignment','generated-task','lesson'].includes(currentRoute);
  document.querySelectorAll('[data-action="open-custom-assignment"]').forEach((button)=>{
    button.hidden=assignmentWorkspaceRoute || !canUseTeacherHub(account);
  });
  const createAnywhere=document.getElementById('teacher-create-anywhere');
  if(createAnywhere) createAnywhere.hidden=assignmentWorkspaceRoute || !canUseTeacherHub(account) || !['teacher-hub','teacher-class','task-library'].includes(currentRoute);
  const accent=String(state.schoolBranding?.accent||'olive').toLowerCase();
  document.body?.classList.remove('mx-accent-olive','mx-accent-navy','mx-accent-purple','mx-accent-blue');
  document.body?.classList.add(`mx-accent-${['olive','navy','purple','blue'].includes(accent)?accent:'olive'}`);
}


function updateAccountChrome() {
  if (typeof document === 'undefined') return;
  const chip = document.getElementById('account-chip');
  const name = document.getElementById('account-chip-name');
  const role = document.getElementById('account-chip-role');
  if (!chip || !name || !role) return;
  const signed = Boolean(account.authenticated && account.profile);
  chip.classList.toggle('signed-in', signed);
  chip.classList.toggle('owner', canUseOwnerConsole(account));
  name.textContent = signed ? (account.profile.role === 'player' ? displayNameFromEmail(account.profile.email) : account.profile.displayName) : 'Sign in';
  role.textContent = signed ? (getEquippedCosmetic(state,'title')?.name || platformRoleLabel(account.profile.role).toUpperCase()) : 'ACCOUNT REQUIRED';
  const ownerButton = document.getElementById('owner-console-button');
  if (ownerButton) ownerButton.hidden = !canUseOwnerConsole(account);
  const ownerTopButton = document.getElementById('owner-console-top-button');
  if (ownerTopButton) ownerTopButton.hidden = !canUseOwnerConsole(account);
  const schoolTopButton = document.getElementById('school-top-button');
  if (schoolTopButton) schoolTopButton.hidden = !canUseTeacherHub(account);
  const currentRoute=routeFromHash().route;
  const assignmentWorkspaceRoute=['assignment','generated-task','lesson'].includes(currentRoute);
  const createAnywhere = document.getElementById('teacher-create-anywhere');
  if (createAnywhere) createAnywhere.hidden = assignmentWorkspaceRoute || !canUseTeacherHub(account) || !['teacher-hub','teacher-class','task-library'].includes(currentRoute);
  const roleToolsButton = document.getElementById('role-tools-button');
  document.querySelectorAll('[data-action="open-custom-assignment"]').forEach(button=>{button.hidden=assignmentWorkspaceRoute || !canUseTeacherHub(account);});
  if (roleToolsButton) roleToolsButton.hidden = !Boolean(account.authenticated && ['bug_tester','content_editor','support','admin','owner'].includes(account.profile?.role) && account.profile?.status==='active');
  const platformHubButton = document.getElementById('platform-hub-menu-button');
  if (platformHubButton) platformHubButton.hidden = !canUseTeacherHub(account);
}

function canCreateSchoolAccount() {
  return Boolean(account.authenticated && ['teacher','owner'].includes(account.profile?.role) && account.profile?.status === 'active');
}

function canEditAccountIdentity() {
  return Boolean(account.authenticated && ['teacher','admin','owner'].includes(account.profile?.role) && account.profile?.status === 'active');
}

function loadStateForAccount(profile) {
  activeStorageKey = accountStorageKey(profile.userId);
  const hasScopedSave = Boolean(safeStorageGet(activeStorageKey));
  if (!hasScopedSave) {
    const legacyRaw = safeStorageGet(STORAGE_KEY);
    const legacy = legacyRaw ? loadState(globalThis.localStorage) : null;
    const seed = legacy || loadState(globalThis.localStorage, activeStorageKey);
    const lockedStudentName = profile.role === 'player' ? displayNameFromEmail(profile.email) : profile.displayName;
    const named = seed.playerName === 'MathsExpress Student' && lockedStudentName ? { ...seed, playerName: lockedStudentName } : seed;
    saveState(globalThis.localStorage, named, activeStorageKey);
    // Delete the old save only after the new account-scoped save is confirmed.
    if (legacyRaw && safeStorageGet(activeStorageKey)) safeStorageRemove(STORAGE_KEY);
  }
  state = loadState(globalThis.localStorage, activeStorageKey);
  const remoteOwned=Object.entries(profile.inventory||{}).filter(([,qty])=>Number(qty)>0).map(([id])=>id);
  state = { ...state, coins:Number(profile.coins ?? state.coins ?? 0), xp:Number(profile.xp ?? state.xp ?? 0), gameTimeSeconds:Math.min(300,Number(profile.gameTimeSeconds ?? state.gameTimeSeconds ?? 0)), ownedCosmetics:[...new Set([...(state.ownedCosmetics||[]),...remoteOwned])], equipped:{...(state.equipped||{}),...(profile.equipped||{})} };
  if (profile.role === 'player') state = { ...state, playerName: displayNameFromEmail(profile.email) };
  else if (profile.displayName && !['teacher','admin','owner'].includes(profile.role)) state = { ...state, playerName: profile.displayName };
  else if (state.playerName === 'MathsExpress Student' && profile.displayName) state = { ...state, playerName: profile.displayName };
  state = touchDailyStreak(state, localDateString());
  state = migrateLegacyMasteryToCurrentYear(profile.yearLevel);
  recommendationCategory=String(state.recommendationPrefs?.category||'smart');
  recommendationShuffleSeed=Number(state.recommendationPrefs?.shuffleSeed)||0;
  persist(state, { quiet: true });
}

function syncAccountSession(snapshot = accountClient.snapshot()) {
  account = snapshot;
  updateAccountChrome();
  if (account.authenticated && account.profile) loadStateForAccount(account.profile);
}

async function syncStudentLearningContextFromClasses(){
  if(!account.authenticated || account.profile?.role!=='player') return null;
  let resolved=null;
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_resolve_student_learning_context',{});
    if(!error && data) resolved=Array.isArray(data)?data[0]:data;
  }catch{}
  if(!resolved){
    try{
      const rows=await getSchoolClient().listStudentClasses();
      const active=rows.map(r=>r.class).find(c=>c && !c.archived);
      if(active) { selectedStudentClassId=String(active.id||selectedStudentClassId||''); resolved={year_level:active.year_level,textbook_focus:active.textbook_focus||null,class_id:active.id,source:'class'}; }
    }catch{}
  }
  if(!resolved) return null;
  if(resolved.class_id || resolved.classId) selectedStudentClassId=String(resolved.class_id||resolved.classId);
  const year=normaliseYearLevel(resolved.year_level ?? resolved.yearLevel, account.profile?.yearLevel);
  const textbookFocus=String(resolved.textbook_focus ?? resolved.textbookFocus ?? account.profile?.textbookFocus ?? 'Mathematics');
  account={...account,profile:{...account.profile,yearLevel:year,textbookFocus,yearSource:resolved.source||'class',yearOverrideExpiresAt:resolved.override_expires_at||null}};
  if(state){state={...state,learningPathYear:year};persist(state,{quiet:true});}
  updateAccountChrome();
  return resolved;
}

function clearAuthGate() {
  const root = document.getElementById('auth-gate');
  if (root) root.innerHTML = '';
}

function requestedAuthMode() {
  try { return new URLSearchParams(globalThis.location?.search || '').get('auth') === 'signup' ? 'signup' : 'login'; }
  catch { return 'login'; }
}

function authVerificationPanelHtml() {
  if (!pendingSignup?.email) return '';
  return `<div class="auth-verify-panel">
    <div class="auth-verify-icon">✉</div>
    <span class="eyebrow">One quick step</span>
    <h2>Check your school email</h2>
    <p>We sent a verification link to <strong>${escapeHtml(pendingSignup.email)}</strong>.</p>
    <p class="auth-verify-help">Open the link in that email. MathsExpress will detect the verified session and continue into your account automatically. The button below is only a backup.</p>
    <button class="btn primary auth-submit" type="button" data-action="auth-finish-signup">I verified it — continue →</button>
    <button class="auth-link" type="button" data-action="auth-resend-verification">Resend verification email</button>
    <button class="auth-link subtle" type="button" data-action="auth-change-signup">Use a different email</button>
  </div>`;
}

function ensureAuthStateListener() {
  if (authStateSubscription) return;
  try {
    const client=accountClient.ensureClient();
    const result=client.auth.onAuthStateChange((event,session)=>{
      if(event!=='SIGNED_IN' || !session?.access_token || account.authenticated) return;
      setTimeout(async()=>{
        try {
          accountClient.session=session;
          await accountClient.refreshProfile();
          await finishAuthentication(accountClient.snapshot());
        } catch(error) {
          const message=document.getElementById('auth-message');
          if(message) message.textContent=error?.message||'Your email is verified. Finishing sign in…';
        }
      },0);
    });
    authStateSubscription=result?.data?.subscription||result?.subscription||true;
  } catch {}
}

function showAuthGate(message = '') {
  const root = document.getElementById('auth-gate');
  if (!root) return;
  try { if(globalThis.speechSynthesis?.speaking || globalThis.speechSynthesis?.pending) globalThis.speechSynthesis.cancel(); } catch {}
  ensureAuthStateListener();
  const signupMode=requestedAuthMode()==='signup';
  const verification=Boolean(pendingSignup?.email);
  try { document.title=`MathsExpress — ${verification?'Verify email':signupMode?'Create account':'Log in'}`; } catch {}
  root.innerHTML = `
    <div class="auth-backdrop">
      <section class="auth-card auth-card-v1149" aria-label="MathsExpress account sign in">
        <aside class="auth-art auth-art-v1149" aria-hidden="true">
          <div class="auth-brand-lockup"><div class="auth-logo"><img src="./assets/mx-logo.png" alt="" aria-hidden="true"></div><div><strong>MathsExpress</strong><small>Learn · Practise · Progress</small></div></div>
          <div class="auth-clove-wrap">${cloveHtml('happy')}</div>
          <div class="auth-art-copy"><span class="eyebrow">Your maths workspace</span><h1>Everything in one place.</h1><p>Assignments, practice, progress and rewards stay connected to your account.</p></div>
          <div class="auth-feature-grid">
            <div class="auth-feature"><span>✓</span><div><b>Your year level</b><small>See learning that matches your class.</small></div></div>
            <div class="auth-feature"><span>✓</span><div><b>Saved progress</b><small>Keep your work across devices.</small></div></div>
            <div class="auth-feature"><span>✓</span><div><b>Class assignments</b><small>Join classes and complete teacher tasks.</small></div></div>
          </div>
        </aside>
        <div class="auth-forms auth-forms-v1149">
          ${verification ? authVerificationPanelHtml() : `
          <div class="auth-tabs"><button type="button" class="${signupMode?'':'active'}" data-auth-tab="login">Log in</button><button type="button" class="${signupMode?'active':''}" data-auth-tab="signup">Create account</button></div>
          <form id="auth-login-form" class="auth-form" ${signupMode?'hidden':''}>
            <div class="auth-form-head"><span class="eyebrow">Welcome back</span><h2>Log in to MathsExpress</h2><p>Continue from where you left off.</p></div>
            <label>Email<input id="auth-login-email" type="email" autocomplete="email" placeholder="name@school.edu.au" required></label>
            <label>Password<input id="auth-login-password" type="password" autocomplete="current-password" placeholder="Your password" required></label>
            <button class="btn primary auth-submit" type="submit">Log in →</button>
            <button class="auth-link" type="button" data-action="forgot-password">Forgot password?</button>
          </form>
          <form id="auth-signup-form" class="auth-form v10-signup-form" ${signupMode?'':'hidden'}>
            <div class="auth-form-head"><span class="eyebrow">New account</span><h2>Create your MathsExpress account</h2><p>Choose your role and use your school or education email.</p></div>
            <fieldset class="account-type-picker"><legend>Account type</legend>
              <label><input type="radio" name="accountType" value="student" checked><span><b>Student</b><small>Join classes and complete work</small></span></label>
              <label><input type="radio" name="accountType" value="teacher"><span><b>Teacher</b><small>Create classes, assign work and view reports</small></span></label>
            </fieldset>
            <label>School / education email<input id="auth-signup-email" type="email" autocomplete="email" placeholder="firstname.lastname@school.edu.au" required><small class="field-help">Approved school and education domains are supported.</small></label>
            <label>Password<input id="auth-signup-password" type="password" minlength="10" autocomplete="new-password" placeholder="At least 10 characters" required><small class="field-help">If your school requires email verification, you will stay in this signup flow and will not need to type your details again.</small></label>
            <button class="btn primary auth-submit" type="submit">Create account →</button>
          </form>`}
          <p id="auth-message" class="auth-message ${message?'visible':''}">${escapeHtml(message)}</p>
        </div>
      </section>
    </div>`;
}

async function finishAuthentication(snapshot) {
  syncAccountSession(snapshot);
  pendingSignup=null;
  try {
    const url=new URL(globalThis.location.href);
    if(url.searchParams.has('auth')) { url.searchParams.delete('auth'); globalThis.history.replaceState(null,'',`${url.pathname}${url.search}${globalThis.location.hash||'#home'}`); }
  } catch {}
  if (account.profile?.role === 'parent') {
    if (!state.onboardingComplete) persist({...state,onboardingComplete:true},{quiet:true});
    if (!globalThis.location.hash || ['#home','#learn'].includes(globalThis.location.hash)) globalThis.history.replaceState(null, '', '#parent');
  } else if (account.profile?.role === 'teacher') {
    if (!globalThis.location.hash || ['#home','#learn'].includes(globalThis.location.hash)) globalThis.history.replaceState(null, '', '#teacher-hub');
  } else if (!globalThis.location.hash) globalThis.history.replaceState(null, '', '#home');

  // Render immediately. Class/progress syncing is useful, but must never block the whole app.
  render();
  clearAuthGate();
  hideLoadingScreen();
  clearTimeout(loadingScreenSafetyTimer);

  void Promise.allSettled([
    withStartupTimeout(syncStudentLearningContextFromClasses(),3500,'Class sync timed out.'),
    withStartupTimeout(claimPendingTeacherRewards(),3500,'Reward sync timed out.'),
    withStartupTimeout(hydrateCloudAppState(),3500,'Cloud progress sync timed out.'),
    withStartupTimeout(syncPlatformSettings(),3500,'Settings sync timed out.')
  ]).then(()=>{ if(account.authenticated) render(); });
  if (account.profile?.role !== 'parent') showOnboarding();
  trackActivityEvent('login','account','login',{role:account.profile?.role||'player'});
}

async function handleAuthSubmit(event) {
  if (event.target.id === 'auth-login-form') {
    event.preventDefault();
    const message = document.getElementById('auth-message');
    message.textContent = 'Logging in…';
    try {
      const snapshot = await accountClient.signIn(document.getElementById('auth-login-email').value, document.getElementById('auth-login-password').value);
      await finishAuthentication(snapshot);
    } catch (error) { message.textContent = error.message || 'Login failed.'; }
  }
  if (event.target.id === 'auth-signup-form') {
    event.preventDefault();
    const message = document.getElementById('auth-message');
    message.textContent = 'Creating account…';
    try {
      const signupEmail=document.getElementById('auth-signup-email').value;
      const accountType=document.querySelector('input[name="accountType"]:checked')?.value||'student';
      const result = await accountClient.signUp(signupEmail, document.getElementById('auth-signup-password').value, displayNameFromEmail(signupEmail), accountType);
      if (result?.needsConfirmation) {
        pendingSignup={email:String(signupEmail||'').trim().toLowerCase(),password:document.getElementById('auth-signup-password').value,accountType};
        showAuthGate(result.message || 'Check your school email to verify your account.');
        return;
      }
      await finishAuthentication(result);
    } catch (error) { message.textContent = error.message || 'Could not create account.'; }
  }
}

function closeOwnerConsole() {
  const root = document.getElementById('owner-console-root');
  if (root) root.innerHTML = '';
}

function ownerActionButton(action, icon, title, description, danger = false) {
  return `<button class="owner-tool ${danger ? 'danger' : ''}" data-owner-action="${action}"><span>${icon}</span><div><strong>${title}</strong><small>${description}</small></div></button>`;
}

function ownerFeedbackHtml() {
  if (ownerFeedbackLoading) return '<div class="owner-feedback-empty">Loading reports…</div>';
  if (!ownerFeedback.length) return '<div class="owner-feedback-empty">No bug reports or suggestions yet.</div>';
  return ownerFeedback.map((row) => {
    const status = String(row.status || 'open');
    const category = String(row.category || 'bug');
    const created = row.created_at ? new Date(row.created_at).toLocaleString() : '';
    return `<article class="owner-feedback-item ${status}">
      <div class="owner-feedback-top"><span class="feedback-kind ${category}">${category === 'suggestion' ? 'Suggestion' : 'Bug'}</span><span class="feedback-status">${escapeHtml(status)}</span></div>
      <h4>${escapeHtml(row.title || 'Untitled report')}</h4>
      <p>${escapeHtml(row.description || '')}</p>
      ${row.note ? `<small class="feedback-note">Note: ${escapeHtml(row.note)}</small>` : ''}
      <div class="owner-feedback-meta"><span>${escapeHtml(row.display_name || 'Student')}</span><span>${escapeHtml(row.page || 'unknown page')}</span><span>${escapeHtml(created)}</span></div>
      <div class="owner-feedback-actions">
        ${status !== 'reviewed' ? `<button class="btn ghost small" data-action="owner-feedback-status" data-feedback-id="${Number(row.id)}" data-status="reviewed">Mark reviewed</button>` : ''}
        ${status !== 'resolved' ? `<button class="btn success small" data-action="owner-feedback-status" data-feedback-id="${Number(row.id)}" data-status="resolved">Resolve</button>` : `<button class="btn ghost small" data-action="owner-feedback-status" data-feedback-id="${Number(row.id)}" data-status="open">Reopen</button>`}
      </div>
    </article>`;
  }).join('');
}

async function loadOwnerFeedback() {
  if (!canUseOwnerConsole(account) || ownerFeedbackLoading) return;
  ownerFeedbackLoading = true;
  const mount = document.getElementById('owner-feedback-list');
  if (mount) mount.innerHTML = ownerFeedbackHtml();
  try {
    const { data, error } = await accountClient.ensureClient().rpc('mathsexpress_owner_feedback', { p_limit: 50 });
    if (error) throw error;
    ownerFeedback = Array.isArray(data) ? data : [];
  } catch (error) {
    ownerFeedback = [];
    showToast('Feedback inbox unavailable', error.message || 'Could not load reports.');
  } finally {
    ownerFeedbackLoading = false;
    const nextMount = document.getElementById('owner-feedback-list');
    if (nextMount) nextMount.innerHTML = ownerFeedbackHtml();
  }
}

async function updateOwnerFeedbackStatus(id, status) {
  if (!canUseOwnerConsole(account)) return;
  try {
    const { error } = await accountClient.ensureClient().rpc('mathsexpress_owner_update_feedback', { p_id: Number(id), p_status: String(status) });
    if (error) throw error;
    showToast('Feedback updated', `Marked as ${status}.`, 'success');
    await loadOwnerFeedback();
  } catch (error) {
    showToast('Could not update feedback', error.message || 'Try again.');
  }
}


function ownerActivityDetailsHtml(details={}) {
  const entries=Object.entries(details||{}).filter(([k,v])=>v!=null && v!=='' && !['password','token','secret','answer_text','raw_answer'].includes(String(k).toLowerCase())).slice(0,8);
  if(!entries.length) return '';
  return `<div class="owner-activity-details">${entries.map(([k,v])=>`<span><b>${escapeHtml(String(k).replaceAll('_',' '))}</b> ${escapeHtml(typeof v==='object'?JSON.stringify(v):String(v))}</span>`).join('')}</div>`;
}

function ownerActivityFeedHtml() {
  const rows=filterOwnerActivity(ownerActivityRows,ownerActivityFilters);
  if(ownerActivityLoading && !rows.length) return '<div class="school-loading"><span class="spinner"></span><strong>Loading activity…</strong></div>';
  if(!rows.length) return '<div class="school-empty">No activity matches these filters yet.</div>';
  return `<div class="owner-activity-feed">${rows.map(row=>{
    const time=row.createdAt?new Date(row.createdAt).toLocaleString():'';
    return `<article class="owner-activity-event ${escapeHtml(row.category)}">
      <div class="owner-activity-icon">${row.source==='system'?'●':'○'}</div>
      <div class="owner-activity-main"><div class="owner-activity-line"><strong>${escapeHtml(row.displayName)}</strong><span>${escapeHtml(activityLabel(row))}</span></div>
      <div class="owner-activity-meta"><span>${escapeHtml(row.email||row.role)}</span><span>${escapeHtml(row.page||'app')}</span><span>${escapeHtml(row.category)}</span><time>${escapeHtml(time)}</time></div>${ownerActivityDetailsHtml(row.details)}</div>
    </article>`;
  }).join('')}</div>`;
}

function ownerUsersHtml() {
  if(ownerActivityLoading && !ownerActivityUsers.length) return '<div class="school-loading"><span class="spinner"></span><strong>Loading users…</strong></div>';
  if(!ownerActivityUsers.length) return '<div class="school-empty">No users found.</div>';
  return `<div class="owner-user-table"><div class="owner-user-row owner-user-head"><span>User</span><span>Role</span><span>Joined</span><span>Last seen</span><span>Schools / Classes</span><span>Events</span><span></span></div>${ownerActivityUsers.map(user=>{
    const summary=ownerUserSummary(user,ownerActivityRows);
    const joined=summary.joinedAt?new Date(summary.joinedAt).toLocaleDateString():'—';
    const seen=summary.lastSeen?new Date(summary.lastSeen).toLocaleString():'—';
    return `<div class="owner-user-row"><span><strong>${escapeHtml(summary.displayName)}</strong><small>${escapeHtml(summary.email)}</small></span><span><b class="owner-role-chip">${escapeHtml(platformRoleLabel(summary.role))}</b><small>${escapeHtml(summary.status)}</small></span><span>${escapeHtml(joined)}</span><span>${escapeHtml(seen)}</span><span>${Number(user.school_count)||0} / ${Number(user.class_count)||0}</span><span>${Number(user.event_count)||0}</span><span><button class="btn ghost small" data-action="owner-user-detail" data-user-id="${escapeHtml(summary.userId)}">View</button></span></div>`;
  }).join('')}</div>`;
}

async function openOwnerUserDetail(userId) {
  if(!canUseOwnerConsole(account)) return;
  openSimpleModal('User Activity','<div class="school-loading"><span class="spinner"></span><strong>Loading user history…</strong></div>');
  try {
    const data=await getSchoolClient().ownerUserDetail(userId,250);
    const p=data.profile||{}; const events=Array.isArray(data.events)?data.events:[]; const stats=data.assignment_stats||{};
    const schools=Array.isArray(data.schools)?data.schools:[]; const classes=Array.isArray(data.classes)?data.classes:[];
    const root=document.querySelector('#modal-root .ultimate-modal-body'); if(!root) return;
    root.innerHTML=`<div class="owner-user-detail"><div class="owner-user-detail-head"><div><span class="eyebrow">${escapeHtml(p.role||'player')} · ${escapeHtml(p.status||'active')}</span><h2>${escapeHtml(p.display_name||'User')}</h2><p>${escapeHtml(p.email||'')}</p></div><div class="owner-user-big-stat"><b>${events.length}</b><span>recent events</span></div></div>
      <div class="owner-analytics-strip"><div><b>${Number(stats.started)||0}</b><small>assignments started</small></div><div><b>${Number(stats.completed)||0}</b><small>completed</small></div><div><b>${Number(stats.question_attempts)||0}</b><small>question attempts</small></div><div><b>${Number(stats.correct_questions)||0}</b><small>correct</small></div></div>
      <section class="calm-card owner-account-controls"><span class="eyebrow">Account controls</span><div class="owner-account-grid"><label>Display name<input id="owner-user-display-name" value="${escapeHtml(p.display_name||'')}"></label><label>Username<input id="owner-user-username" value="${escapeHtml(p.username||'')}"></label><label>Year level<select id="owner-user-year-level">${YEAR_LEVEL_OPTIONS.map(o=>`<option value="${o.value}" ${Number(p.year_level)===o.value?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}</select></label><label>Role<select id="owner-user-role-select">${['player','parent','teacher','bug_tester','content_editor','support','admin','owner'].map(role=>`<option value="${role}" ${p.role===role?'selected':''}>${escapeHtml(platformRoleLabel(role))}</option>`).join('')}</select></label></div><div class="simple-modal-actions"><button class="btn primary small" data-action="owner-save-user-profile" data-user-id="${escapeHtml(String(p.user_id||userId))}">Save account details</button><button class="btn secondary small" data-action="owner-set-user-role" data-user-id="${escapeHtml(String(p.user_id||userId))}">Save role</button><button class="btn ghost small" data-action="owner-send-password-reset" data-email="${escapeHtml(String(p.email||''))}">Send password reset</button></div><div class="owner-reward-controls"><label>Coins +/-<input id="owner-user-coins-delta" type="number" value="0"></label><label>XP +/-<input id="owner-user-xp-delta" type="number" value="0"></label><label>Game Time +/- seconds<input id="owner-user-game-delta" type="number" min="-300" max="300" value="0"></label><button class="btn secondary small" data-action="owner-adjust-user-rewards" data-user-id="${escapeHtml(String(p.user_id||userId))}">Apply rewards</button></div><div class="simple-modal-actions"><button class="btn secondary small" data-action="owner-set-user-status" data-user-id="${escapeHtml(String(p.user_id||userId))}" data-status="active">Activate</button><button class="btn ghost small" data-action="owner-set-user-status" data-user-id="${escapeHtml(String(p.user_id||userId))}" data-status="suspended">Suspend</button><button class="btn danger small" data-action="owner-set-user-status" data-user-id="${escapeHtml(String(p.user_id||userId))}" data-status="banned">Ban</button></div><p class="muted">Passwords are never shown to the owner. Password changes use a secure reset link sent to the user.</p></section><section class="calm-card"><span class="eyebrow">Memberships</span><p>${schools.map(x=>`${escapeHtml(x.name)} (${escapeHtml(x.membership)})`).join(' · ')||'No school memberships'}</p><p>${classes.map(x=>`${escapeHtml(x.name)} — Year ${Number(x.year_level)||''} (${escapeHtml(x.membership)})`).join(' · ')||'No classes'}</p></section>
      <section class="calm-card"><span class="eyebrow">Recent history</span><div class="owner-activity-feed compact">${events.slice(0,100).map(e=>`<article class="owner-activity-event"><div class="owner-activity-main"><div class="owner-activity-line"><strong>${escapeHtml(activityLabel(e))}</strong><span>${escapeHtml(e.page||'app')}</span></div><div class="owner-activity-meta"><span>${escapeHtml(e.category||'system')}</span><time>${escapeHtml(e.created_at?new Date(e.created_at).toLocaleString():'')}</time></div>${ownerActivityDetailsHtml(e.details)}</div></article>`).join('')||'<div class="school-empty">No events recorded yet.</div>'}</div></section></div>`;
  } catch(error) {
    const root=document.querySelector('#modal-root .ultimate-modal-body');
    if(root) root.innerHTML=`<div class="school-error"><strong>Couldn’t load this user</strong><p>${escapeHtml(error.message||'Please try again.')}</p><button class="btn secondary" data-action="owner-user-detail" data-user-id="${escapeHtml(String(userId||''))}">Retry</button></div>`;
    showToast('Couldn’t load user',error.message||'Try again.');
  }
}

function renderOwnerActivity(load=true) {
  const view=document.getElementById('app-view'); if(!view) return;
  if(!canUseOwnerConsole(account)) { view.innerHTML='<div class="page"><div class="school-error"><strong>Owner access required.</strong></div></div>'; return; }
  const s=ownerActivityStatsData||{};
  const localSummary=summarizeOwnerActivity(ownerActivityRows);
  const categories=['all',...OWNER_ACTIVITY_CATEGORIES];
  const eventTypes=['all',...[...new Set(ownerActivityRows.map(x=>x.event_type||x.eventType).filter(Boolean))].sort()];
  const pages=['all',...[...new Set(ownerActivityRows.map(x=>x.page).filter(Boolean))].sort()];
  setOwnerActivityAutoRefresh(true);
  view.innerHTML=`<div class="page owner-activity-page">
    <div class="page-head"><div><span class="eyebrow">Owner only</span><h1>Activity Center</h1><p>See who joins MathsExpress and a timestamped history of visible in-app activity. Passwords, secret credentials and hidden keystrokes are never recorded here.</p></div><div class="simple-actions"><button class="btn secondary" data-action="owner-activity-refresh">Refresh</button><button class="btn ghost" data-action="owner-activity-export">Export CSV</button></div></div>
    <div class="owner-analytics-strip large"><div><b>${Number(s.total_users)||ownerActivityUsers.length}</b><small>total users</small></div><div><b>${Number(s.active_15m)||0}</b><small>active in 15 min</small></div><div><b>${Number(s.events_today)||localSummary.todayEvents}</b><small>events today</small></div><div><b>${Number(s.question_attempts_today)||localSummary.questionAttempts}</b><small>questions today</small></div><div><b>${Number(s.class_joins_today)||0}</b><small>class joins today</small></div><div><b>${Number(s.new_users_7d)||0}</b><small>new users 7d</small></div></div>
    <div class="owner-activity-tabs"><button class="${ownerActivityMode==='activity'?'active':''}" data-action="owner-activity-tab" data-tab="activity">Activity Feed</button><button class="${ownerActivityMode==='users'?'active':''}" data-action="owner-activity-tab" data-tab="users">All Users</button></div>
    <form id="owner-activity-filter-form" class="owner-activity-filters"><input name="search" value="${escapeHtml(ownerActivityFilters.search)}" placeholder="Search name, email, action…"><select name="category">${categories.map(v=>`<option value="${escapeHtml(v)}" ${ownerActivityFilters.category===v?'selected':''}>${v==='all'?'All categories':escapeHtml(v)}</option>`).join('')}</select><select name="eventType">${eventTypes.map(v=>`<option value="${escapeHtml(v)}" ${ownerActivityFilters.eventType===v?'selected':''}>${v==='all'?'All events':escapeHtml(v.replaceAll('-',' '))}</option>`).join('')}</select><select name="userId"><option value="all">All users</option>${ownerActivityUsers.map(u=>`<option value="${escapeHtml(u.user_id)}" ${ownerActivityFilters.userId===u.user_id?'selected':''}>${escapeHtml(u.display_name||u.email)}</option>`).join('')}</select><select name="page">${pages.map(v=>`<option value="${escapeHtml(v)}" ${ownerActivityFilters.page===v?'selected':''}>${v==='all'?'All pages':escapeHtml(v)}</option>`).join('')}</select><button class="btn primary small" type="submit">Apply</button></form>
    <section class="calm-card owner-activity-panel"><div class="calm-section-head"><div><span class="eyebrow">${ownerActivityMode==='activity'?'Live audit trail':'Account directory'}</span><h2>${ownerActivityMode==='activity'?'Recent activity':'Everyone who has joined'}</h2></div><span>${ownerActivityLoading?'Refreshing…':ownerActivityMode==='activity'?`${ownerActivityRows.length} events loaded · auto-refresh 15s`:`${ownerActivityUsers.length} users · auto-refresh 15s`}</span></div>${ownerActivityMode==='activity'?ownerActivityFeedHtml():ownerUsersHtml()}</section>
  </div>`;
  if(load) loadOwnerActivityData(false);
}

function openOwnerConsole() {
  if (!canUseOwnerConsole(account)) return showToast('Owner only', 'This console is only available to the Owner account.');
  const root = document.getElementById('owner-console-root');
  if (!root) return;
  root.innerHTML = `<div class="owner-backdrop"><section class="owner-console">
    <header><div><span class="eyebrow">Owner testing tools</span><h2>MathsExpress Control Room</h2><p>Test progression, games, challenges and school screens without affecting other users.</p></div><button class="owner-close" data-action="close-owner-console" aria-label="Close owner console">×</button></header>
    <div class="owner-status"><span>Signed in as <strong>${escapeHtml(account.profile.displayName)}</strong></span><span class="owner-badge">OWNER</span><span>Level ${levelFromXp(state.xp)}</span><span>${state.coins} coins</span><span>${formatGameTime(state.gameTimeSeconds || 0)} Game Time</span></div>
    <div class="owner-sections">
      <section><h3>Progress</h3><div class="owner-grid">
        ${ownerActionButton('add-xp','✦','+500 XP','Quick level progress')}
        ${ownerActionButton('xp-5000','XP','+5,000 XP','Jump through several levels')}
        ${ownerActionButton('add-coins','◆','+5,000 coins','Test rewards and shop')}
        ${ownerActionButton('coins-50000','◇','Set 50,000 coins','Large testing balance')}
        ${ownerActionButton('streak-30','ST','30-day streak','Test streak UI')}
        ${ownerActionButton('streak-365','☀','365-day streak','Test large streak values')}
        ${ownerActionButton('complete-quests','✓','Complete quests','Finish all daily quests')}
      </div></section>
      <section><h3>Game Time & driving</h3><div class="owner-grid">
        ${ownerActionButton('add-game-time','GT','+5 min Game Time','Add 300 seconds')}
        ${ownerActionButton('game-time-30','⏱','Set 30 min Game Time','Fill the game-time bank')}
        ${ownerActionButton('clear-game-time','⌫','Clear Game Time','Return game-time bank to zero', true)}
        ${ownerActionButton('set-drive-score','🏁','10,000 drive score','Test driving high-score UI')}
        ${ownerActionButton('clear-drive-score','↺','Reset drive score','Clear driving high score', true)}
      </div></section>
      <section><h3>Mastery</h3><div class="owner-grid">
        ${ownerActionButton('mastery-50','50','Set 50% mastery','Set Algebra mastery to 50%')}
        ${ownerActionButton('mastery-80','80','Set 80% mastery','Set Algebra mastery to 80%')}
        ${ownerActionButton('mastery-100','100','Max mastery','Set every Algebra lesson to 100%')}
        ${ownerActionButton('mastery-zero','↺','Reset mastery','Set mastery back to 0%', true)}
      </div></section>
      <section><h3>Rewards & test states</h3><div class="owner-grid">
        ${ownerActionButton('unlock-achievements','🏆','All badges','Unlock every achievement')}
        ${ownerActionButton('unlock-cosmetics','♙','All cosmetics','Own every shop cosmetic')}
        ${ownerActionButton('challenge-test','CH','45s challenge result','Preview a strong weekly result locally')}
        ${ownerActionButton('clear-challenges','⌫','Clear challenge history','Remove local challenge runs', true)}
        ${ownerActionButton('max-account','★','Max test save','Max progression, rewards and unlocks')}
        ${ownerActionButton('reset-save','🗑','Fresh save','Reset this account’s MathsExpress progress', true)}
      </div></section>
      <section><h3>Open screens</h3><div class="owner-grid">
        ${ownerActionButton('open-school-admin','⌁','School Admin','Open the school dashboard')}
        ${ownerActionButton('open-games','GM','Games','Open Maths Drive and Lucky Box')}
        ${ownerActionButton('open-challenges','CH','Challenges','Open the global challenge')}
        ${ownerActionButton('open-learn','✦','Learn','Open K–12 curriculum')}
        ${ownerActionButton('open-tools','▦','Power Tools','Open the full feature suite')}
        ${ownerActionButton('open-calendar','🗓','Calendar','Open events and notifications')}
      </div></section>
      <section><h3>Platform management</h3><div class="owner-grid">
        ${ownerActionButton('school-manager','🏫','Owner School Manager','Review schools and admin tools')}
        ${ownerActionButton('feature-controls','⚑','Feature flags','Turn major platform features on/off')}
        ${ownerActionButton('maintenance-mode','🛠','Maintenance mode','Toggle a local maintenance banner')}
        ${ownerActionButton('owner-broadcast','📣','Owner broadcast','Create a platform notice')}
        ${ownerActionButton('owner-analytics','▥','Owner analytics','Users, schools, questions, games and feedback')}
        ${ownerActionButton('open-activity-center','◉','Activity Center','See every user and recent platform activity')}
        ${ownerActionButton('feedback-voting','▲','Suggestion voting','Review and vote on feature requests')}
        ${ownerActionButton('bug-status','!','Bug status page','Open bug reports by status')}
        ${ownerActionButton('update-notes','✦','What’s New','Publish / preview update notes')}
        ${ownerActionButton('manage-user-roles','👤','User roles','Assign Admin, Bug Tester, Support and more')}
        ${ownerActionButton('education-domains','🎓','Education email domains','Manage school email domains allowed to sign up')}
        ${ownerActionButton('platform-health','♥','Platform health','Check database, AI and account services')}
        ${ownerActionButton('focus-monitor','👁','Focus monitor','See whether students are active in MathsExpress during assigned work')}
      </div></section>
      <section><h3>Current platform snapshot</h3><div class="owner-analytics-strip"><div><b>${ownerPlatformStats.users}</b><small>users</small></div><div><b>${schoolHubSchools.length}</b><small>schools</small></div><div><b>${state.stats?.answered||0}</b><small>questions</small></div><div><b>${state.challengeHistory?.length||0}</b><small>challenge runs</small></div><div><b>${ownerFeedback.length}</b><small>feedback</small></div></div></section>
      <section class="owner-feedback-section"><div class="owner-section-heading"><div><span class="eyebrow">Reports from users</span><h3>Feedback Inbox</h3></div><button class="btn ghost small" data-action="refresh-owner-feedback">Refresh</button></div><div id="owner-feedback-list" class="owner-feedback-list">${ownerFeedbackHtml()}</div></section>
    </div>
    <footer><button class="btn secondary" data-action="owner-home">Home</button><button class="btn primary" data-action="close-owner-console">Done testing</button></footer>
  </section></div>`;
  loadOwnerFeedback();
}

function completeAllQuests(quests = {}) {
  return Object.fromEntries(Object.entries(quests).map(([id, quest]) => [id, { ...quest, progress: quest.target, complete: true }]));
}

function applyOwnerAction(action) {
  if (!canUseOwnerConsole(account)) return;
  trackActivityEvent('owner-action','admin',action,{owner:true});
  let next = state;
  if (action === 'add-xp') next = { ...state, xp: state.xp + 500 };
  else if (action === 'xp-5000') next = { ...state, xp: state.xp + 5000 };
  else if (action === 'add-coins') next = { ...state, coins: state.coins + 5000 };
  else if (action === 'coins-50000') next = { ...state, coins: 50000 };
  else if (action === 'streak-30') next = { ...state, streak: 30, lastActiveDate: localDateString() };
  else if (action === 'streak-365') next = { ...state, streak: 365, lastActiveDate: localDateString() };
  else if (action === 'complete-quests') next = { ...state, quests: completeAllQuests(state.quests) };
  else if (action === 'add-game-time') next = { ...state, gameTimeSeconds: Math.min(MAX_GAME_TIME_SECONDS, (state.gameTimeSeconds || 0) + 300) };
  else if (action === 'game-time-30') next = { ...state, gameTimeSeconds: MAX_GAME_TIME_SECONDS };
  else if (action === 'clear-game-time') next = { ...state, gameTimeSeconds: 0 };
  else if (action === 'set-drive-score') next = { ...state, drivingHighScore: 10000 };
  else if (action === 'clear-drive-score') next = { ...state, drivingHighScore: 0 };
  else if (action === 'mastery-50') next = { ...state, mastery: { ...state.mastery, algebra: 50 } };
  else if (action === 'mastery-80') next = { ...state, mastery: { ...state.mastery, algebra: 80 } };
  else if (action === 'mastery-100') next = { ...state, mastery: { ...state.mastery, algebra: 100 }, lessonMastery: Object.fromEntries(LESSONS.map((lesson) => [lesson.id, 100])) };
  else if (action === 'mastery-zero') next = { ...state, mastery: { ...state.mastery, algebra: 0 }, lessonMastery: Object.fromEntries(LESSONS.map((lesson) => [lesson.id, 0])) };
  else if (action === 'unlock-achievements') next = { ...state, achievements: ACHIEVEMENTS.map((achievement) => achievement.id) };
  else if (action === 'unlock-cosmetics') next = { ...state, ownedCosmetics: COSMETICS.map((item) => item.id) };
  else if (action === 'challenge-test') {
    const yearLevel = Math.max(0, Math.min(12, normaliseYearLevel(account.profile?.yearLevel)));
    const result = scoreSpeedChallenge({ elapsedMs: 45000, wrongAnswers: 0, correct: 10 });
    const row = { weekKey: challengeWeekKey(), yearLevel, displayName: state.playerName, ...result, createdAt: new Date().toISOString(), ownerTest: true };
    next = { ...state, challengeHistory: [...(state.challengeHistory || []), row].slice(-50) };
    speedChallenge = { finished: true, result, yearLevel, run: { complete: true } };
  }
  else if (action === 'clear-challenges') { next = { ...state, challengeHistory: [] }; speedChallenge = null; challengeLeaderboard = []; }
  else if (action === 'max-account') next = { ...state, xp: 25000, coins: 99999, streak: 365, gameTimeSeconds: MAX_GAME_TIME_SECONDS, drivingHighScore: 10000, mastery: { algebra: 100 }, lessonMastery: Object.fromEntries(LESSONS.map((lesson) => [lesson.id, 100])), quests: completeAllQuests(state.quests), achievements: ACHIEVEMENTS.map((achievement) => achievement.id), ownedCosmetics: COSMETICS.map((item) => item.id) };
  else if (action === 'open-school-admin') { closeOwnerConsole(); return go('teacher-hub'); }
  else if (action === 'open-games') { closeOwnerConsole(); return go('games'); }
  else if (action === 'open-challenges') { closeOwnerConsole(); return go('challenges'); }
  else if (action === 'open-learn') { closeOwnerConsole(); return go('learn'); }
  else if (action === 'open-tools') { closeOwnerConsole(); return go('tools'); }
  else if (action === 'open-calendar') { closeOwnerConsole(); return go('calendar'); }
  else if (action === 'school-manager') { closeOwnerConsole(); schoolHubTab='overview'; return go('teacher-hub'); }
  else if (action === 'feature-controls') { closeOwnerConsole(); activeToolTab='school'; go('tools'); setTimeout(()=>document.querySelector('[data-action="open-feature-flags"]')?.click(),0); return; }
  else if (action === 'maintenance-mode') { const mode=!Boolean(state.ownerSettings?.maintenanceMode); next = { ...state, ownerSettings:{...(state.ownerSettings||{}),maintenanceMode:mode} }; updatePlatformSettingsRemote({maintenanceMode:mode,maintenanceMessage:state.ownerSettings?.maintenanceMessage,broadcastTitle:state.ownerSettings?.broadcastTitle,broadcastBody:state.ownerSettings?.broadcastBody}).catch((e)=>showToast('Server setting failed',e.message)); }
  else if (action === 'owner-broadcast') { closeOwnerConsole(); return openSimpleModal('Owner Broadcast',`<form id="owner-broadcast-form" class="school-form"><label>Title<input name="title" maxlength="120" required value="MathsExpress update"></label><label>Message<textarea name="body" rows="6" maxlength="1000" required></textarea></label><button class="btn primary" type="submit">Publish broadcast</button></form>`); }
  else if (action === 'open-activity-center') { closeOwnerConsole(); return go('owner-activity'); }
  else if (action === 'owner-analytics') { closeOwnerConsole(); accountClient.ensureClient().rpc('mathsexpress_owner_analytics',{}).then(({data,error})=>{ if(error) throw error; ownerPlatformStats=ownerAnalytics(data||{}); openSimpleModal('Owner Analytics',`<div class="owner-analytics-strip large">${Object.entries(ownerPlatformStats).map(([k,v])=>`<div><b>${v}</b><small>${escapeHtml(k)}</small></div>`).join('')}</div><p class="muted">Live totals from the MathsExpress database.</p>`); }).catch(e=>showToast('Analytics unavailable',e.message)); return; }
  else if (action === 'feedback-voting') { const suggestions=ownerFeedback.filter(x=>x.category==='suggestion'); closeOwnerConsole(); return openSimpleModal('Suggestion Voting',suggestions.length?`<div class="suggestion-vote-list">${suggestions.map(row=>`<article><button class="vote-button" data-action="vote-suggestion" data-feedback-id="${row.id}">▲ <b>${Number(state.suggestionVotes?.[row.id]||0)}</b></button><div><strong>${escapeHtml(row.title)}</strong><p>${escapeHtml(row.description)}</p></div></article>`).join('')}</div>`:'<div class="school-empty">No suggestions have been submitted yet.</div>'); }
  else if (action === 'bug-status') { const bugs=ownerFeedback.filter(x=>x.category==='bug'); closeOwnerConsole(); return openSimpleModal('Bug Status',bugs.length?`<div class="bug-status-list">${bugs.map(row=>`<article><span class="feedback-status">${escapeHtml(row.status||'open')}</span><div><strong>${escapeHtml(row.title)}</strong><p>${escapeHtml(row.description)}</p></div></article>`).join('')}</div>`:'<div class="school-empty">No bug reports yet.</div>'); }
  else if (action === 'update-notes') { const note={id:`update-${Date.now()}`,type:'update',title:"What's New in MathsExpress",body:'Textbook catalogue updated with 55 Cambridge book titles across Foundation–Year 12, year/pathway filtering, grouped Cambridge series, the supplied CambridgeMATHS NSW Year 9 cover, Jacaranda support, and textbook-linked teacher assignment tools.',createdAt:new Date().toISOString()}; next={...state,notifications:[...(state.notifications||[]),note].slice(-100)}; accountClient.ensureClient().rpc('mathsexpress_owner_publish',{p_type:'update-note',p_title:note.title,p_body:note.body,p_payload:{version:'Ultimate'}}).then(({error})=>{if(error)throw error;showToast('Update note published','Signed-in users can receive the release note.','success');}).catch(e=>showToast('Saved locally','Server publish failed: '+e.message)); }
  else if (action === 'manage-user-roles') { closeOwnerConsole(); ownerActivityMode='users'; go('owner-activity'); setTimeout(()=>loadOwnerActivityData(true),0); return; }
  else if (action === 'education-domains') { closeOwnerConsole(); return openEducationDomainsModal(); }
  else if (action === 'platform-health') { closeOwnerConsole(); return openPlatformHealthModal(); }
  else if (action === 'focus-monitor') { closeOwnerConsole(); if(selectedTeacherClassId) return openClassFocusMonitor(selectedTeacherClassId); showToast('Choose a class first','Open a class report, then use Focus monitor.'); return; }
  else if (action === 'reset-save') {
    if (!globalThis.confirm?.('Reset this MathsExpress account save?')) return;
    state = resetState(globalThis.localStorage, activeStorageKey);
    state = { ...state, playerName: account.profile.displayName, onboardingComplete: true };
    persist(state, { quiet: true });
    closeOwnerConsole(); render(); showToast('Owner tool', 'Account save reset.'); return;
  } else return showToast('Owner tool', 'That testing command is unavailable.');
  persist(next, { quiet: true });
  render();
  openOwnerConsole();
  showToast('Owner tool applied', 'Testing state updated.', 'success');
}

async function openEducationDomainsModal() {
  if(!canUseOwnerConsole(account)) return;
  openSimpleModal('Education email domains','<div class="school-loading"><span class="spinner"></span><strong>Loading allowed domains…</strong></div>');
  try {
    const rows=await getSchoolClient().listEducationDomains();
    const root=document.querySelector('#modal-root .ultimate-modal-body'); if(!root)return;
    root.innerHTML=`<p>MathsExpress accepts common education domains such as <b>.edu.au</b>, plus the exact school domains listed here.</p><form id="education-domain-form" class="school-form compact"><label>School domain<input name="domain" placeholder="school.example.edu.au" required></label><label>Label<input name="label" placeholder="School name (optional)"></label><button class="btn primary" type="submit">Add domain</button></form><div class="education-domain-list">${rows.map(r=>`<article><div><strong>${escapeHtml(r.domain)}</strong><small>${escapeHtml(r.label||'Approved education domain')}</small></div><button class="btn danger small" data-action="remove-education-domain" data-domain="${escapeHtml(r.domain)}">Remove</button></article>`).join('')||'<div class="school-empty">No custom domains yet. Standard .edu/.edu.au domains still work.</div>'}</div>`;
  } catch(error){ const root=document.querySelector('#modal-root .ultimate-modal-body'); if(root) root.innerHTML=`<div class="school-error"><strong>Could not load domains</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`; showToast('Could not load domains',error.message||'Try again.');}
}

async function openPlatformHealthModal() {
  if(!canUseOwnerConsole(account)) return;
  openSimpleModal('Platform health','<div class="school-loading"><span class="spinner"></span><strong>Checking MathsExpress services…</strong></div>');
  const root=document.querySelector('#modal-root .ultimate-modal-body');
  try {
    const client=accountClient.ensureClient();
    const start=performance.now();
    const {error}=await client.from('mathsexpress_platform_settings').select('singleton').eq('singleton',true).single();
    const dbMs=Math.round(performance.now()-start);
    let ai='Available';
    try { const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Reply with OK only.',context:{topic:'Health check',yearLevel:9,tutorAllowed:true,testMode:false},history:[]})}); if(!response.ok) ai='Fallback only'; } catch { ai='Fallback only'; }
    if(root) root.innerHTML=`<div class="health-grid"><article><span>Database</span><strong>${error?'Issue':'Online'}</strong><small>${dbMs} ms</small></article><article><span>Smart AI</span><strong>${ai}</strong><small>AI helper has an offline maths fallback.</small></article><article><span>Account</span><strong>${account.authenticated?'Signed in':'Signed out'}</strong><small>${escapeHtml(account.profile?.email||'')}</small></article><article><span>Activity tracking</span><strong>Online</strong><small>Focus tracking only reports MathsExpress tab state.</small></article></div>`;
  } catch(error){ if(root) root.innerHTML=`<div class="school-error"><strong>Service check failed</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`; }
}

async function openClassFocusMonitor(classId) {
  if(!canUseTeacherHub(account)) return;
  openSimpleModal('Student focus monitor','<div class="school-loading"><span class="spinner"></span><strong>Loading focus status…</strong></div>');
  try {
    const rows=await getSchoolClient().classFocusStatus(classId);
    const root=document.querySelector('#modal-root .ultimate-modal-body'); if(!root)return;
    root.innerHTML=`<p class="muted">This only shows whether MathsExpress is active, hidden or away. It cannot see another website, app or tab content.</p><div class="focus-monitor-list">${rows.map(r=>{const fresh=r.updated_at&&Date.now()-new Date(r.updated_at).getTime()<90000;const st=fresh?(r.state||'active'):'offline';return `<article><span class="focus-dot ${escapeHtml(st)}"></span><div><strong>${escapeHtml(r.display_name||'Student')}</strong><small>${st==='active'?'On MathsExpress':st==='hidden'||st==='away'?'Away from MathsExpress tab':'Offline'} · ${Number(r.hidden_count)||0} tab switches</small></div><time>${r.updated_at?escapeHtml(new Date(r.updated_at).toLocaleTimeString()):'—'}</time></article>`}).join('')||'<div class="school-empty">No focus information yet. It appears when students start assigned work.</div>'}</div><div class="simple-modal-actions"><button class="btn secondary" data-action="refresh-focus-modal" data-class-id="${escapeHtml(classId)}">Refresh</button></div>`;
  } catch(error){ const root=document.querySelector('#modal-root .ultimate-modal-body'); if(root) root.innerHTML=`<div class="school-error"><strong>Focus monitor unavailable</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`; showToast('Focus monitor unavailable',error.message||'Try again.');}
}

function openFeedbackModal() {
  const root = document.getElementById('modal-root');
  if (!root) return;
  const route = routeFromHash().route;
  root.innerHTML = `<div class="modal-backdrop"><section class="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
    <div class="feedback-modal-head"><div><span class="eyebrow">Help improve MathsExpress</span><h2 id="feedback-title">Report a bug or send a suggestion</h2><p>Tell us what happened or what you would like added.</p></div><button class="owner-close" type="button" data-action="close-feedback" aria-label="Close feedback form">×</button></div>
    <form id="feedback-form" class="feedback-form">
      <label>Type<select id="feedback-category" required><option value="bug">Bug</option><option value="suggestion">Suggestion</option></select></label>
      <label>Title<input id="feedback-title-input" maxlength="100" required placeholder="Short summary"></label>
      <label>Description<textarea id="feedback-description" maxlength="2000" rows="6" required placeholder="What happened? What should happen instead?"></textarea></label>
      <label>Screenshot / extra note <span>(optional)</span><textarea id="feedback-note" maxlength="800" rows="3" placeholder="You can describe a screenshot, error message, or extra detail here."></textarea></label>
      <div class="feedback-context"><span>Page</span><strong>${escapeHtml(route)}</strong></div>
      <div id="feedback-message" class="form-message" aria-live="polite"></div>
      <div class="modal-actions"><button type="button" class="btn ghost" data-action="open-my-feedback">My reports</button><button type="button" class="btn secondary" data-action="close-feedback">Cancel</button><button type="submit" class="btn primary">Send report</button></div>
    </form>
  </section></div>`;
}

async function handleFeedbackSubmit(event) {
  if (event.target.id !== 'feedback-form') return;
  event.preventDefault();
  const message = document.getElementById('feedback-message');
  const category = document.getElementById('feedback-category')?.value || 'bug';
  const title = document.getElementById('feedback-title-input')?.value?.trim() || '';
  const description = document.getElementById('feedback-description')?.value?.trim() || '';
  const note = document.getElementById('feedback-note')?.value?.trim() || '';
  if (title.length < 3 || description.length < 5) {
    if (message) message.textContent = 'Please add a short title and a little more detail.';
    return;
  }
  if (message) message.textContent = 'Sending…';
  try {
    const { error } = await accountClient.ensureClient().rpc('mathsexpress_submit_feedback', {
      p_category: category,
      p_title: title,
      p_description: description,
      p_page: routeFromHash().route,
      p_note: note || null,
    });
    if (error) throw error;
    trackActivityEvent('feedback-submitted','feedback',`submit-${category}`,{title});
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
    showToast(category === 'bug' ? 'Bug report sent' : 'Suggestion sent', 'Thanks — it is now in the Owner Feedback Inbox.', 'success');
  } catch (error) {
    if (message) message.textContent = error.message || 'Could not send your report. Try again.';
  }
}

function showToast(title, message = '', kind = '') {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('toast-root');
  if (!root) return;
  const toast = document.createElement('div');
  toast.className = `toast ${kind}`;
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ''}`;
  root.append(toast);
  setTimeout(() => toast.remove(), 3200);
}

function updateActiveNav(route) {
  const navRoute = route === 'lesson' ? 'learn' : route;
  document.querySelectorAll('[data-route]').forEach((button) => {
    button.classList.toggle('active', button.dataset.route === navRoute && button.classList.contains('nav-item'));
  });
}



const DAILY_MISSION_REWARDS = Object.freeze({
  'answer-5':{coins:5,xp:20,label:'5 coins + 20 XP'},
  'correct-3':{coins:5,xp:25,label:'5 coins + 25 XP'},
  'earn-40-xp':{coins:10,xp:20,label:'10 coins + 20 XP'},
});
function ensureDailyMissions(){
  const today=localDateString();
  if(state.dailyMissionDate===today) return;
  const reset=Object.fromEntries(Object.values(QUEST_DEFINITIONS).map(q=>[q.id,{progress:0,target:q.target,complete:false,claimed:false}]));
  state=persist({...state,dailyMissionDate:today,dailyMissionClaims:[],quests:reset},{quiet:true});
}
function dailyMissionCards(){
  ensureDailyMissions();
  const claimed=new Set(state.dailyMissionClaims||[]);
  return Object.values(QUEST_DEFINITIONS).map(q=>{
    const row=state.quests?.[q.id]||{progress:0,target:q.target,complete:false};
    const done=Boolean(row.complete); const isClaimed=claimed.has(q.id); const reward=DAILY_MISSION_REWARDS[q.id]||{label:'5 coins'};
    const pct=Math.min(100,Math.round((Number(row.progress)||0)/Math.max(1,Number(row.target)||1)*100));
    return `<article class="daily-mission-card ${done?'complete':''}"><div class="daily-mission-icon">${done?'✓':'✦'}</div><div class="daily-mission-copy"><strong>${escapeHtml(q.title)}</strong><small>${escapeHtml(q.description)}</small><div class="daily-mission-progress"><i style="width:${pct}%"></i></div><span>${Number(row.progress)||0}/${Number(row.target)||0} · ${escapeHtml(reward.label||'Reward')}</span></div><button class="btn ${done&&!isClaimed?'primary':'ghost'} small" data-action="claim-daily-mission" data-mission-id="${escapeHtml(q.id)}" ${!done||isClaimed?'disabled':''}>${isClaimed?'Claimed':done?'Claim':'In progress'}</button></article>`;
  }).join('');
}
async function claimDailyMission(id){
  ensureDailyMissions();
  const q=state.quests?.[id]; const claimed=new Set(state.dailyMissionClaims||[]);
  if(!q?.complete || claimed.has(id) || pendingMissionClaims.has(id)) return;
  pendingMissionClaims.add(id);
  try{
    await Promise.allSettled([...pendingLearningUpdates]);
    const result=await getSchoolClient().claimDailyMission(id);
    claimed.add(id);
    state=persist({...state,coins:Number(result.coins??state.coins??0),xp:Number(result.xp??state.xp??0),dailyMissionClaims:[...claimed]},{quiet:true});
    if(account.profile) account={...account,profile:{...account.profile,coins:Number(result.coins??account.profile.coins??0),xp:Number(result.xp??account.profile.xp??0)}};
    updateChrome();
    const reward=DAILY_MISSION_REWARDS[id]||{label:'Mission reward'};
    showToast(result.already_claimed?'Already claimed':'Mission claimed',result.already_claimed?'This mission was already claimed today.':reward.label,'reward');
    if(routeFromHash().route==='learn') renderLearn();
  }catch(error){showToast('Could not claim mission',error?.message||'Your progress could not sync. Try Claim again.');}
  finally{pendingMissionClaims.delete(id);}
}

function questRows() {
  return Object.values(QUEST_DEFINITIONS).map((quest) => {
    const qState = state.quests?.[quest.id] ?? { progress: 0, target: quest.target, complete: false };
    const pct = Math.round((qState.progress / qState.target) * 100);
    return `
      <div class="quest-row ${qState.complete ? 'complete' : ''}">
        <div class="quest-icon">${qState.complete ? '✓' : '✦'}</div>
        <div>
          <strong>${escapeHtml(quest.title)}</strong>
          <small>${escapeHtml(quest.description)}</small>
          <div class="progress-track" style="margin-top:8px"><div class="progress-fill ${qState.complete ? 'green' : ''}" style="width:${Math.min(100, pct)}%"></div></div>
        </div>
        <div class="quest-count">${qState.progress}/${qState.target}</div>
      </div>`;
  }).join('');
}

function recommendedLesson() {
  return [...LESSONS].sort((a, b) => (state.lessonMastery?.[a.id] ?? 0) - (state.lessonMastery?.[b.id] ?? 0))[0];
}

function lessonCards() {
  return LESSONS.map((lesson, index) => {
    const mastery = Math.round(state.lessonMastery?.[lesson.id] ?? 0);
    return `
      <article class="card lesson-card">
        <div class="lesson-number">${index + 1}</div>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.description)}</p>
        <div class="progress-meta"><span>Mastery</span><span>${mastery}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${mastery}%"></div></div>
        <div class="lesson-actions">
          <span class="mastery-chip">${mastery >= 80 ? 'Mastered' : mastery > 0 ? 'In progress' : 'New'}</span>
          <button class="btn small secondary" data-action="open-lesson" data-lesson-id="${lesson.id}">${mastery > 0 ? 'Continue' : 'Start'}</button>
        </div>
      </article>`;
  }).join('');
}


function flashBoardResult(correct) {
  if (typeof document === 'undefined') return;
  showMascotFeedback(correct?'celebrate':'thinking',correct?'Nice work!':'You can try again.');
  const cls = correct ? 'answer-flash-correct' : 'answer-flash-wrong';
  document.body.classList.remove('answer-flash-correct','answer-flash-wrong');
  void document.body.offsetWidth;
  document.body.classList.add(cls);
  if (resultFlashTimer) clearTimeout(resultFlashTimer);
  resultFlashTimer = setTimeout(() => document.body.classList.remove(cls), 1250);
}

function studyTimerSnapshot() {
  if (!studyTimerRuntime) {
    const saved = state?.activeStudySession || {};
    studyTimerRuntime = {
      mode: saved.mode === 'break' ? 'break' : 'study',
      remaining: Math.max(0, Number(saved.remainingSeconds) || 25 * 60),
      cyclesDone: Math.max(0, Number(saved.cyclesDone) || 0),
      cycles: Math.max(1, Number(saved.cycles) || 4),
      running: false,
    };
  }
  return studyTimerRuntime;
}

function persistStudyTimer() {
  if (!state || !studyTimerRuntime) return;
  persist({ ...state, activeStudySession: {
    mode: studyTimerRuntime.mode, remainingSeconds: studyTimerRuntime.remaining,
    cyclesDone: studyTimerRuntime.cyclesDone, cycles: studyTimerRuntime.cycles, savedAt: Date.now(),
  } }, { quiet:true });
}

function updateStudyTimerDisplay() {
  const t = studyTimerSnapshot();
  const timeText = `${Math.floor(t.remaining/60)}:${String(t.remaining%60).padStart(2,'0')}`;
  const out = document.getElementById('study-timer-display');
  const mode = document.getElementById('study-timer-mode');
  const button = document.querySelector('[data-action="study-timer-toggle"]');
  const top = document.getElementById('study-timer-top');
  const topDisplay = document.getElementById('study-timer-top-display');
  if (out) out.textContent = timeText;
  if (mode) mode.textContent = `${t.mode === 'study' ? 'Focus' : 'Break'} · cycle ${Math.min(t.cyclesDone+1,t.cycles)} of ${t.cycles}`;
  if (button) button.textContent = t.running ? 'Pause' : 'Start';
  if (topDisplay) topDisplay.textContent = timeText;
  const assignmentDisplay=document.getElementById('assignment-focus-timer-display');
  const assignmentLabel=document.getElementById('assignment-focus-timer-label');
  const assignmentFocusButton=document.querySelector('.assignment-focus-timer');
  if(assignmentDisplay) assignmentDisplay.textContent=timeText;
  if(assignmentLabel) assignmentLabel.textContent=t.mode==='study'?'FOCUS':'BREAK';
  if(assignmentFocusButton){
    assignmentFocusButton.classList.toggle('running',Boolean(t.running));
    assignmentFocusButton.classList.toggle('paused',!t.running);
    assignmentFocusButton.classList.toggle('is-break',t.mode==='break');
  }
  if (top) {
    top.hidden = !t.running;
    const label = top.querySelector('small');
    if (label) label.textContent = t.mode === 'study' ? 'FOCUS' : 'BREAK';
    top.classList.toggle('is-break', t.mode === 'break');
  }
}

function stopStudyTimerInterval() {
  if (studyTimerInterval) { clearInterval(studyTimerInterval); studyTimerInterval = null; }
  if (studyTimerRuntime) studyTimerRuntime.running = false;
}

function startStudyTimerInterval() {
  const t = studyTimerSnapshot();
  if (studyTimerInterval) return;
  t.running = true;
  updateStudyTimerDisplay();
  studyTimerInterval = setInterval(() => {
    if (!studyTimerRuntime?.running) return;
    studyTimerRuntime.remaining = Math.max(0, studyTimerRuntime.remaining - 1);
    if (studyTimerRuntime.remaining <= 0) {
      if (studyTimerRuntime.mode === 'study') {
        studyTimerRuntime.mode = 'break'; studyTimerRuntime.remaining = 5 * 60;
        showToast('Focus block complete','Take a 5-minute break.','success');
      } else {
        studyTimerRuntime.cyclesDone += 1;
        if (studyTimerRuntime.cyclesDone >= studyTimerRuntime.cycles) {
          stopStudyTimerInterval(); studyTimerRuntime.remaining = 25 * 60; studyTimerRuntime.mode = 'study'; studyTimerRuntime.cyclesDone = 0;
          showToast('Pomodoro complete','Four focus cycles completed. Starting a new set at cycle 1 of 4.','success');
        } else {
          studyTimerRuntime.mode = 'study'; studyTimerRuntime.remaining = 25 * 60;
          showToast('Break complete','Start the next focus block.','success');
        }
      }
      persistStudyTimer();
    }
    updateStudyTimerDisplay();
  }, 1000);
}

function openStudyTimerModal() {
  const t = studyTimerSnapshot();
  openSimpleModal('Pomodoro Study Timer', `<div class="study-timer-live"><div class="countdown-big"><b id="study-timer-display">${Math.floor(t.remaining/60)}:${String(t.remaining%60).padStart(2,'0')}</b><span id="study-timer-mode">${t.mode === 'study' ? 'Focus' : 'Break'} · cycle ${Math.min(t.cyclesDone+1,t.cycles)} of ${t.cycles}</span></div><div class="study-timer-actions"><button class="btn primary" data-action="study-timer-toggle">${t.running?'Pause':'Start'}</button><button class="btn secondary" data-action="study-timer-reset">Reset</button><button class="btn ghost" data-action="study-timer-skip">Skip phase</button></div><p class="muted">25-minute focus blocks with 5-minute breaks. The timer keeps running while you use MathsExpress.</p></div>`);
  updateStudyTimerDisplay();
}

async function applyRemotePlayerState(data,{quiet=false,preserveGameTime=false}={}) {
  if(!data||!state)return;
  const inv=data.inventory&&typeof data.inventory==='object'?data.inventory:{};
  const owned=Object.entries(inv).filter(([,qty])=>Number(qty)>0).map(([id])=>id);
  const localGameTime=Math.max(0,Math.min(300,Number(state.gameTimeSeconds)||0));
  const remoteGameTime=Math.max(0,Math.min(300,Number(data.game_time_seconds ?? data.gameTimeSeconds ?? localGameTime)||0));
  persist({ ...state, coins:Math.max(0,Number(data.coins ?? state.coins)||0), xp:Math.max(0,Number(data.xp ?? state.xp)||0), gameTimeSeconds:preserveGameTime?localGameTime:remoteGameTime, ownedCosmetics:[...new Set([...(state.ownedCosmetics||[]),...owned])], equipped:{...(state.equipped||{}),...(data.equipped||{})} },{quiet:true});
  if(Number.isFinite(Number(data.weekly_points ?? data.weeklyPoints))) account={...account,profile:{...account.profile,weeklyPoints:Math.max(0,Number(data.weekly_points ?? data.weeklyPoints)||0)}};
  updateChrome();
  if(!quiet) updateChrome();
}
async function syncRemotePlayerState(){
  if(!account.authenticated||!state)return;
  try{const data=await getSchoolClient().playerState();await applyRemotePlayerState(data,{quiet:true});}catch(error){console.warn('Could not sync player state',error);}
}
async function claimPendingTeacherRewards() {
  if (!account.authenticated || !state) return;
  try {
    const beforeCoins=Number(state.coins)||0,beforeSeconds=Number(state.gameTimeSeconds)||0;
    const data = await getSchoolClient().claimTeacherRewards();
    await applyRemotePlayerState(data,{quiet:true});
    const grantedCoins=Math.max(0,Number(data?.granted_coins)||Math.max(0,(Number(data?.coins)||0)-beforeCoins));
    const grantedSeconds=Math.max(0,Number(data?.granted_game_time_seconds)||Math.max(0,(Number(data?.game_time_seconds)||0)-beforeSeconds));
    const grants=Math.max(0,Number(data?.grants)||0);
    if(grantedCoins||grantedSeconds) showToast('Teacher reward received',`${grantedCoins?`+${grantedCoins} coin${grantedCoins===1?'':'s'}`:''}${grantedCoins&&grantedSeconds?' · ':''}${grantedSeconds?`+${formatGameTime(grantedSeconds)} Game Time`:''}${grants>1?` from ${grants} grants`:''}`,'reward');
  } catch (error) { console.warn('Could not claim teacher rewards', error); }
}

function normaliseThemePrefs(raw={}) {
  const preset=THEME_PRESETS.find(x=>x.id===String(raw?.preset||'')) || THEME_PRESETS[0];
  return {
    preset:preset.id,
    accent:String(raw?.accent||preset.accent||'#738158').slice(0,30),
    cardOpacity:Math.max(.72,Math.min(1,Number(raw?.cardOpacity)||.96)),
    blur:Math.max(0,Math.min(24,Number(raw?.blur)||8)),
    pattern:String(raw?.pattern||preset.pattern||'none'),
    customColor:String(raw?.customColor||'').slice(0,40),
    useCustomImage:Boolean(raw?.useCustomImage),
  };
}

function applyThemePreferences() {
  if(typeof document==='undefined' || !state) return;
  const prefs=normaliseThemePrefs(state.themePrefs||{});
  const preset=THEME_PRESETS.find(x=>x.id===prefs.preset) || THEME_PRESETS[0];
  const root=document.documentElement;
  const customImage=String(state.customBackgroundImage||'');
  const safeImage=customImage.replaceAll('"','%22');
  const bg=prefs.useCustomImage&&customImage?`linear-gradient(rgba(255,255,255,.08),rgba(255,255,255,.08)),url("${safeImage}")`:(prefs.preset==='custom'&&prefs.customColor?prefs.customColor:preset.bg);
  root.style.setProperty('--mx-user-bg',bg);
  root.style.setProperty('--mx-user-accent',prefs.accent||preset.accent);
  root.style.setProperty('--mx-card-alpha',String(prefs.cardOpacity));
  root.style.setProperty('--mx-card-blur',`${prefs.blur}px`);
  root.dataset.mxPattern=prefs.pattern||'none';
  root.classList.toggle('mx-theme-dark',Boolean(preset.dark));
}

function openThemeCustomizer(){
  const prefs=normaliseThemePrefs(state.themePrefs||{});
  const hasImage=Boolean(state.customBackgroundImage);
  openSimpleModal('Theme & background',`<form id="theme-customizer-form" class="school-form theme-customizer-form">
    <div class="theme-preset-grid">${THEME_PRESETS.map(t=>`<label class="theme-preset-card ${prefs.preset===t.id?'active':''}"><input type="radio" name="preset" value="${escapeHtml(t.id)}" ${prefs.preset===t.id?'checked':''}><span class="theme-preset-preview" style="background:${escapeHtml(t.bg)}"></span><strong>${escapeHtml(t.name)}</strong></label>`).join('')}</div>
    <div class="form-two"><label>Accent colour<input type="color" name="accent" value="${/^#[0-9a-f]{6}$/i.test(prefs.accent)?prefs.accent:'#738158'}"></label><label>Custom background colour<input type="color" name="customColor" value="${/^#[0-9a-f]{6}$/i.test(prefs.customColor)?prefs.customColor:'#eef3f8'}"></label></div>
    <label>Pattern<select name="pattern">${['none','dots','grid','waves','stars'].map(v=>`<option value="${v}" ${prefs.pattern===v?'selected':''}>${v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select></label>
    <div class="form-two"><label>Card transparency<input type="range" min="72" max="100" value="${Math.round(prefs.cardOpacity*100)}" name="cardOpacity"></label><label>Background blur<input type="range" min="0" max="24" value="${prefs.blur}" name="blur"></label></div>
    <section class="theme-upload-box"><strong>Background picture</strong><p>Upload your own picture on this device. Large images are resized before saving.</p><div class="simple-actions"><button class="btn secondary" type="button" data-action="upload-theme-background">${hasImage?'Replace picture':'Upload picture'}</button>${hasImage?'<button class="btn ghost" type="button" data-action="clear-theme-background">Remove picture</button>':''}</div><label class="check-row"><input type="checkbox" name="useCustomImage" ${prefs.useCustomImage&&hasImage?'checked':''} ${hasImage?'':'disabled'}> Use uploaded picture</label></section>
    <div class="simple-modal-actions"><button class="btn primary" type="submit">Save theme</button><button class="btn ghost" type="button" data-action="reset-theme">Reset</button></div>
  </form>`);
}

function uploadThemeBackground(){
  const input=document.createElement('input');input.type='file';input.accept='image/*';
  input.addEventListener('change',()=>{
    const file=input.files?.[0]; if(!file)return;
    if(file.size>8*1024*1024)return showToast('Image too large','Choose an image under 8 MB.');
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=1800,scale=Math.min(1,max/Math.max(img.width,img.height));
        const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        const data=canvas.toDataURL('image/jpeg',.78);
        persist({...state,customBackgroundImage:data,themePrefs:{...normaliseThemePrefs(state.themePrefs||{}),useCustomImage:true}},{quiet:true});
        applyThemePreferences();showToast('Background saved','Your picture is now being used on this device.','success');openThemeCustomizer();
      }; img.src=String(reader.result||'');
    };reader.readAsDataURL(file);
  },{once:true}); input.click();
}

function recommendationRowsForCategory(rows,category='smart'){
  const base=[...rows].filter(x=>x.unlocked);
  // Public Mathspace guidance groups recommendations as Ready to learn,
  // Skill almost mastered and Skill worked on recently. MathsExpress uses
  // its own transparent mastery/review evidence to create the same useful categories.
  if(category==='ready') return base.filter(x=>Number(x.mastery||0)<25).sort((a,b)=>(a.mastery-b.mastery)||(a.yearLevel-b.yearLevel));
  if(category==='almost') return base.filter(x=>Number(x.mastery||0)>=45&&Number(x.mastery||0)<80).sort((a,b)=>b.mastery-a.mastery);
  if(category==='recent'){
    const reviewIds=new Set((state.spacedReviews||[]).filter(r=>!r.done).map(r=>String(r.skillId||'')));
    const recent=base.filter(x=>reviewIds.has(String(x.id))||Number(x.mastery||0)>=25&&Number(x.mastery||0)<80);
    return recent.sort((a,b)=>Number(a.mastery||0)-Number(b.mastery||0));
  }
  return base.sort((a,b)=>(a.mastery-b.mastery)||(a.yearLevel-b.yearLevel));
}
function shuffledRecommendations(rows){
  const arr=recommendationRowsForCategory(rows,recommendationCategory);
  if(!recommendationShuffleSeed) return arr;
  let seed=recommendationShuffleSeed>>>0;
  for(let i=arr.length-1;i>0;i--){ seed=(Math.imul(seed,1664525)+1013904223)>>>0; const j=seed%(i+1); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr;
}
function renderPreservingScroll(fn){
  const nodes=[document.scrollingElement,...document.querySelectorAll('.main-content,#app-view')].filter(Boolean);
  const positions=nodes.map(n=>[n,n.scrollTop,n.scrollLeft]); fn();
  positions.forEach(([n,top,left])=>{n.scrollTop=top;n.scrollLeft=left;});
}

async function loadClassSkillFocus(classId,{render=false}={}){
  if(!classId){activeClassSkillFocus=[];activeClassSkillFocusClassId='';return []}
  try{
    const {data,error}=await withTimeout(accountClient.ensureClient().rpc('mathsexpress_class_skill_focus',{p_class_id:String(classId)}),4000,'Skills Focus took too long.');
    if(error)throw error;activeClassSkillFocus=Array.isArray(data)?data:[];activeClassSkillFocusClassId=String(classId);
    if(render && routeFromHash().route==='learn') renderLearn();
    return activeClassSkillFocus;
  }catch(error){console.warn('Skills Focus unavailable',error);return []}
}

function skillFocusHtml(){
  if(!activeClassSkillFocus.length) return '';
  return `<section class="skills-focus-panel"><div class="section-heading"><div><span class="eyebrow">Teacher focus</span><h2>Skills Focus</h2></div><span>${activeClassSkillFocus.length} priority skill${activeClassSkillFocus.length===1?'':'s'}</span></div><div class="skills-focus-grid">${activeClassSkillFocus.map(f=>{const skill=getCurriculumSkill(f.skill_id)||{};return `<button data-action="start-path-skill" data-skill-id="${escapeHtml(f.skill_id)}" data-skill-year="${Number(skill.yearLevel??account.profile?.yearLevel??9)}"><span class="focus-priority p${Number(f.priority)||1}">${'●'.repeat(Number(f.priority)||1)}</span><div><strong>${escapeHtml(f.title||skill.title||skill.skill||f.skill_id)}</strong><small>${escapeHtml(f.note||'Selected by your teacher')}</small></div><b>→</b></button>`}).join('')}</div></section>`;
}

async function openSkillsFocusManager(classId){
  const cls=teacherHubClasses.find(c=>String(c.id)===String(classId))||lastTeacherReport?.class||{};
  const year=normaliseYearLevel(cls.year_level,9);const skills=getCurriculumSkills({yearLevel:year});
  const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_class_skill_focus',{p_class_id:String(classId)});if(error)throw error;
  const selected=new Set((Array.isArray(data)?data:[]).map(x=>String(x.skill_id)));
  openSimpleModal('Skills Focus',`<form id="skills-focus-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><p>Choose up to 6 skills that should appear first for this class. Students see them in Learn and Class.</p><label>Priority skills<select name="skillIds" multiple size="14">${skills.map(s=>`<option value="${escapeHtml(s.id)}" ${selected.has(String(s.id))?'selected':''}>${escapeHtml(s.strand)} · ${escapeHtml(s.title||s.skill)}</option>`).join('')}</select></label><label>Teacher note<input name="note" maxlength="160" placeholder="Focus on these before Friday's test"></label><button class="btn primary" type="submit">Save Skills Focus</button></form>`);
}

function applyAccessibilityPreferences() {
  if (typeof document === 'undefined' || !state) return;
  const prefs = state.accessibilityPrefs || {};
  document.documentElement.classList.toggle('mx-dark', Boolean(prefs.darkMode));
  document.documentElement.classList.toggle('mx-high-contrast', Boolean(prefs.highContrast));
  document.documentElement.classList.toggle('mx-large-text', Boolean(prefs.largeText));
  document.documentElement.classList.toggle('mx-reduced-motion', Boolean(prefs.reducedMotion));
  document.documentElement.classList.toggle('mx-dyslexia', Boolean(prefs.dyslexiaFriendly));
  document.documentElement.classList.toggle('mx-focus-mode', Boolean(state.focusMode));
  applyThemePreferences();
}

function currentMistakes() {
  const local = Array.isArray(state.mistakeBook) ? state.mistakeBook : [];
  return buildMistakeBook(local);
}

function curriculumMasteryCards() {
  const base = Number(state.mastery?.algebra || 0);
  const skills = getCurriculumSkills({ yearLevel: normaliseYearLevel(account.profile?.yearLevel) }).slice(0, 12);
  return skills.map((skill, i) => {
    const value = Math.max(0, Math.min(100, Math.round(base + ((i % 5) - 2) * 8)));
    return `<article class="mastery-map-card"><span>${escapeHtml(skill.strand)}</span><strong>${escapeHtml(skill.skill)}</strong><div class="progress-track"><div class="progress-fill" style="width:${value}%"></div></div><small>${value}% · ${masteryBand(value)}</small></article>`;
  }).join('');
}


function renderCompleteSuite() {
  const integrations=buildIntegrationCatalog();
  const completeGroups=[
    {title:'Personal learning',icon:'◎',items:[
      ['Discovery Check-In','Run a broad curriculum check-in and save IRT evidence.','open-discovery-checkin'],
      ['Topic Readiness','Measure readiness for the next topic using adaptive evidence.','open-topic-readiness'],
      ['Growth Report','Track scaled score, grade-equivalent growth and uncertainty over time.','open-growth-report'],
      ['Diagnostic placement','Find a starting level and weak skills.','run-diagnostic'],
      ['Personal learning path','Order skills by readiness and prerequisites.','open-learning-path'],
      ['Spaced repetition','Bring skills back before they are forgotten.','open-spaced-review'],
      ['Predicted mastery','Estimate which skills are likely to need revision next.','open-predicted-mastery'],
      ['Confidence tracking','Compare confidence with actual accuracy.','open-confidence-report'],
      ['Error analysis','Classify sign, arithmetic, formula and algebra mistakes.','open-error-analysis'],
    ]},
    {title:'Exams & marking',icon:'📝',items:[
      ['Exam Builder Pro','Create A–D versions, cover page, marks and timing.','open-exam-pro'],
      ['Rubric builder','Build method, accuracy and follow-through marks.','open-rubric-builder'],
      ['Show-my-working marking','Award marks for valid working, not only the final answer.','open-working-marker'],
      ['Multi-part questions','Build linked parts such as 4a, 4b and 4c.','open-multipart-builder'],
      ['Progressive hints','Unlock hints gradually with optional penalties.','open-progressive-hints'],
      ['Resubmissions & feedback','Return work, add teacher comments and allow another attempt.','open-resubmission-tools'],
    ]},
    {title:'Teacher planning',icon:'🗓',items:[
      ['Lesson Planner','Build a 45–60 minute lesson structure from a topic.','open-lesson-planner'],
      ['Term Planner','Map topics across school weeks.','open-term-planner'],
      ['Class growth report','Track long-term curriculum growth by student.','open-class-growth'],
      ['Standards growth','See proficiency growth by skill/standard over time.','open-standards-growth'],
      ['Teacher usage analytics','School leaders can compare class/assignment activity.','open-school-usage'],
      ['Assigned vs self-directed','Compare teacher-assigned and independent learning time.','open-learning-source-report'],
      ['School vs home hours','Compare learning during school hours and outside school hours.','open-school-hours-report'],
      ['Curriculum coverage','Track syllabus outcome coverage by class.','open-curriculum-coverage'],
      ['Late & missing work','Find overdue tasks and create reminders.','open-late-work'],
      ['Task folders & versions','Organise, duplicate and version teacher resources.','open-resource-manager'],
      ['School resource library','Share original tasks with teachers in the school.','open-resource-library'],
    ]},
    {title:'Classroom management',icon:'👥',items:[
      ['Attendance','Mark a class roll.','open-attendance'],
      ['Seating plan','Generate and rearrange classroom seats.','open-seating-plan'],
      ['Merit points','Record positive learning/effort points.','open-merit-points'],
      ['House system','Track school house maths points.','open-house-system'],
      ['Timetable','View lessons by day and period.','open-timetable'],
      ['Focus / Homework / Exam Lock','Switch students into a distraction-reduced mode.','open-learning-modes'],
    ]},
    {title:'Study centre',icon:'📚',items:[
      ['Digital notebook','Save maths notes and tags.','open-notebook'],
      ['Flashcards','Create revision cards for formulas and vocabulary.','open-flashcards'],
      ['Formula sheet','Build a personal formula sheet.','open-formula-sheet'],
      ['Revision checklist','Tick off topics before an assessment.','open-revision-checklist'],
      ['Exam countdown','Track days until a test.','open-exam-countdown'],
      ['Pomodoro timer','25-minute study sessions with breaks.','open-study-timer'],
    ]},
    {title:'Interactive maths lab',icon:'∑',items:[
      ['Scientific calculator','Calculator workspace with teacher controls.','open-scientific-calculator'],
      ['Unit converter','Convert common length, mass and capacity units.','open-unit-converter'],
      ['Formula rearranger','Rearrange common school formulas.','open-formula-rearranger'],
      ['Probability simulator','Run coin, dice and spinner trials.','open-probability-sim'],
      ['Statistics explorer','Enter a dataset and inspect mean/median/range.','open-statistics-explorer'],
      ['Geometry toolkit','Ruler, protractor, coordinates and diagram workspace.','open-geometry-toolkit'],
    ]},
    {title:'Competitions & integrity',icon:'🏆',items:[
      ['Tournament brackets','Create class or school knockout tournaments.','open-tournament'],
      ['Maths Duels','Set up one-v-one maths challenge rounds.','open-duel'],
      ['Friend challenges','Create a private 10-question challenge code.','open-friend-challenge'],
      ['Teacher spectate','Inspect live game/class progress.','open-spectate'],
      ['Game replay summary','Review the questions that changed a match.','open-game-replay'],
      ['Anti-cheat checks','Flag impossible speed, tab switching and paste patterns.','open-integrity-check'],
    ]},
    {title:'Parents & communication',icon:'◉',items:[
      ['Parent emails','Add guardian emails for reports and teacher messages.','open-parent-accounts'],
      ['Email progress report','Send the latest student progress straight to parents.','open-parent-weekly'],
      ['Email parents','Send teacher messages and progress reports by email.','open-parent-messages'],
      ['Email notifications','Provider-ready email notification settings.','open-email-settings'],
      ['Push notifications','PWA notification settings and permission status.','open-push-settings'],
      ['Ask Teacher / discussion','Teacher-moderated question discussions.','open-discussion-tools'],
    ]},
    {title:'Platform & data',icon:'⚙',items:[
      ['Offline/PWA mode','Installable shell and offline-safe cached app files.','open-offline-status'],
      ['Backups & restore','Create backup manifests and recovery points.','open-backups'],
      ['Recycle bin','Recover recently deleted resources.','open-recycle-bin'],
      ['Audit logs','Track role/settings/assignment changes.','open-audit-log'],
      ['Privacy & retention','Configure data retention and privacy controls.','open-retention'],
      ['Global search / command palette','Search tasks, notes, resources and students.','open-command-palette'],
    ]},
    {title:'Owner rollout & reliability',icon:'🛡',items:[
      ['Feature rollouts','Enable a feature for selected schools or beta groups.','open-rollouts'],
      ['System status','Check API, database, authentication and app status.','open-system-status'],
      ['Error logs','Store and inspect application errors.','open-error-logs'],
      ['Preview as role','Preview the student/teacher experience without changing work.','open-role-preview'],
      ['Account suspension tools','Owner/admin account status controls.','open-suspension-tools'],
      ['Demo school','Generate sample classes/students for safe testing.','open-demo-school'],
    ]},
    {title:'Creation & teacher assistant',icon:'✦',items:[
      ['Teacher Assistant','Generate an original lesson outline, examples, practice and homework from a topic.','open-teacher-assistant'],
      ['Written-answer marking','Use a rubric and working steps to suggest method/accuracy marks and feedback.','open-written-marking'],
      ['Automatic test versions','Create equivalent A, B, C and D versions with different seeds.','open-test-versions'],
      ['Photo / worksheet import','Prepare an uploaded teacher worksheet for editable question entry.','open-photo-import'],
      ['Handwriting input','Handwriting-ready maths input area with a typed fallback.','open-handwriting-input'],
      ['Diagram builders','Create graph, table, geometry and data-question structures.','open-diagram-builders'],
    ]},
    {title:'Advanced maths tools',icon:'ƒ',items:[
      ['Function sliders','Explore y = ax² + bx + c with adjustable parameters.','open-function-sliders'],
      ['Probability lab','Coins, dice and spinner simulations with frequency tables.','open-probability-lab'],
      ['Spreadsheet statistics','Table-style dataset explorer and summary statistics.','open-data-spreadsheet'],
      ['CAS-style workspace','Simplify/evaluate supported school expressions with teacher controls.','open-cas-workspace'],
      ['Coordinate editor','Plot/edit coordinate points and linear relationships.','open-coordinate-editor'],
      ['Multiple solution methods','Compare alternative valid methods for the same problem.','open-solution-methods'],
    ]},
    {title:'Personalisation & access',icon:'Aa',items:[
      ['Dashboard widgets','Choose and reorder Home widgets.','open-dashboard-widgets'],
      ['Language & translation','Switch common interface labels and prepare translated support text.','open-language-tools'],
      ['Screen-reader mode','Stronger labels, live regions and keyboard-first navigation.','open-screen-reader-tools'],
      ['Colour-blind graph mode','Use patterns/labels instead of colour alone.','open-colourblind-tools'],
      ['Font & keyboard controls','Adjust font size and use keyboard-only navigation.','open-font-keyboard'],
      ['Game Time limits','Set daily caps, allowed days and allowed time windows.','open-game-schedule'],
    ]},
    {title:'School operations & sharing',icon:'⌂',items:[
      ['Duplicate classes & assignments','Copy structures without reusing IDs or student submissions.','open-duplicate-tools'],
      ['Public teacher library','Publish original resources for other MathsExpress teachers.','open-public-library'],
      ['Ratings & favourites','Rate shared resources and save favourites.','open-resource-ratings'],
      ['Teacher folders','Organise tasks by term, unit and assessment.','open-teacher-folders'],
      ['Inter-school competitions','Configure school-v-school challenge events by year level.','open-inter-school'],
      ['Onboarding & sample data','Student, teacher and principal tours plus a demo school.','open-onboarding-tools'],
    ]},
    {title:'Integrations centre',icon:'↔',items:integrations.map(x=>[x.name,'Connection-ready integration. Requires the real provider/service to be connected.',`integration-${x.id}`])},
  ];
  return `<section class="ultimate-section complete-suite"><div class="complete-suite-intro calm-card"><div><span class="eyebrow">MathsExpress Complete</span><h2>Advanced learning, teaching and school platform tools</h2><p>These tools stay out of Home so the main experience remains simple. External provider integrations are clearly labelled until a real provider is connected.</p></div><span class="complete-count">${completeGroups.reduce((n,g)=>n+g.items.length,0)} tools</span></div>${completeGroups.map(group=>`<section class="complete-group"><div class="section-heading"><div><span class="eyebrow">${group.icon} Complete suite</span><h2>${escapeHtml(group.title)}</h2></div></div><div class="complete-grid">${group.items.map(([title,desc,action])=>`<article class="complete-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p><button class="btn secondary small" data-action="${escapeHtml(action)}">Open</button></article>`).join('')}</div></section>`).join('')}</section>`;
}

function renderTools() {
  const view = document.getElementById('app-view');
  const mistakes = currentMistakes();
  const flags = normalizeFeatureFlags(state.featureFlags || {});
  const goals = syncGoalsAutoProgress();
  const tabs = canUseTeacherHub(account)
    ? [['study','Study'],['assessment','Tests & homework'],['live','Live class'],['school','School tools'],['access','Accessibility'],['complete','Complete suite']]
    : [['study','Study'],['assessment','Tests & homework'],['access','Accessibility']];
  if (!tabs.some(([id])=>id===activeToolTab)) activeToolTab='study';
  view.innerHTML = `<div class="page ultimate-page">
    <div class="page-head"><div><span class="eyebrow">MathsExpress Power Tools</span><h1>Everything you need, without crowding Home.</h1><p>Study smarter, create assessments, run live lessons, manage school tools and personalise accessibility.</p></div><button class="btn secondary" data-route="calendar">Calendar & notifications</button></div>
    <div class="ultimate-tabs">${tabs.map(([id,label])=>`<button class="${activeToolTab===id?'active':''}" data-action="tool-tab" data-tab="${id}">${label}</button>`).join('')}</div>

    ${activeToolTab==='study'?`<section class="ultimate-section">
      <div class="ultimate-grid">
        ${flags.helper?`<article class="ultimate-card feature-hero"><span>✦</span><div><h3>Maths Helper</h3><p>Ask full maths questions, get clear step-by-step explanations, hints, worked examples and feedback on your working.</p></div><button class="btn primary" data-action="open-tutor">Open helper</button></article>`:''}
        <article class="ultimate-card"><span>↺</span><h3>Mistake Book</h3><p>${mistakes.length ? `${mistakes.length} mistake pattern${mistakes.length===1?'':'s'} ready for revision.` : 'Wrong answers are automatically collected here for focused revision.'}</p><button class="btn secondary" data-action="open-mistakes">Review mistakes</button></article>
        <article class="ultimate-card"><span>5</span><h3>Daily Practice</h3><p>Five quick questions matched to your year level and current progress.</p><button class="btn secondary" data-action="start-daily-practice">Start 5 questions</button></article>
        <article class="ultimate-card"><span>◎</span><h3>Smart Difficulty</h3><p>Difficulty automatically moves between Easy, Medium and Hard based on recent accuracy.</p><strong>${nextSmartDifficulty('medium',[true,true,false,true])} recommendation</strong></article>
        <article class="ultimate-card"><span>🎯</span><h3>Student Goals</h3><p>${goals.length ? `${goals.filter(g=>!g.completed).length} active goal${goals.filter(g=>!g.completed).length===1?'':'s'}.` : 'Set a mastery, streak or question target and track it here.'}</p><button class="btn secondary" data-action="open-goals">Manage goals</button></article>
        <article class="ultimate-card"><span>▦</span><h3>Working Out</h3><p>Open a scratchpad with equation buttons and a coordinate graph for rough working.</p><button class="btn secondary" data-action="open-workspace">Open workspace</button></article>
      </div>
      <div class="section-heading"><div><span class="eyebrow">Topic mastery map</span><h2>Your ${yearLabel(Number(account.profile?.yearLevel??9))} map</h2></div></div>
      <div class="mastery-map-grid">${curriculumMasteryCards()}</div>
    </section>`:''}

    ${activeToolTab==='assessment'?`<section class="ultimate-section"><div class="ultimate-grid">
      <article class="ultimate-card feature-hero"><span>📝</span><div><h3>Exam Mode</h3><p>Timed assessment setup with hints off, calculator rules, reading time and a score summary.</p></div><button class="btn primary" data-action="open-exam-generator">Create exam</button></article>
      <article class="ultimate-card"><span>▤</span><h3>Past-Test Generator</h3><p>Choose a year, topic, difficulty and question count to make a fresh test.</p><button class="btn secondary" data-action="open-test-generator">Generate test</button></article>
      <article class="ultimate-card"><span>⌁</span><h3>Homework Generator</h3><p>Build a ready-to-assign pack instantly from the 1,000,000-task library.</p><button class="btn secondary" data-action="open-homework-generator">Create homework</button></article>
      <article class="ultimate-card"><span>✎</span><h3>Question Builder</h3><p>Create numeric, multiple-choice, algebra, graph or written-response questions.</p><button class="btn secondary" data-action="open-question-builder">Build question</button></article>
      <article class="ultimate-card"><span>★</span><h3>Question Favourites</h3><p>Save useful questions and reuse them in tests and worksheets.</p><button class="btn secondary" data-action="open-favourites">View favourites</button></article>
      <article class="ultimate-card"><span>↻</span><h3>Auto Revision</h3><p>Set a test date and generate short revision sessions leading up to it.</p><button class="btn secondary" data-action="open-auto-revision">Plan revision</button></article>
      <article class="ultimate-card"><span>≋</span><h3>Differentiated Work</h3><p>Create Support, Core and Extension versions from one assignment.</p><button class="btn secondary" data-action="preview-differentiation">Preview versions</button></article>
      <article class="ultimate-card"><span>⎙</span><h3>Printable Worksheets</h3><p>Generate a clean worksheet plus answers from the same digital question bank.</p><button class="btn secondary" data-action="print-worksheet">Create printable</button></article>
      <article class="ultimate-card"><span>▣</span><h3>Calculator Rules</h3><p>Choose no calculator, basic or scientific calculator per assessment.</p><button class="btn secondary" data-action="open-calculator-rules">Set rules</button></article>
      <article class="ultimate-card"><span>🗓</span><h3>Assignment Scheduling</h3><p>Create work now and choose when it starts and when it is due.</p><button class="btn secondary" data-action="open-assignment-scheduler">Schedule work</button></article>
      <article class="ultimate-card"><span>↻</span><h3>Recurring Homework</h3><p>Prepare weekly, fortnightly or daily homework dates automatically.</p><button class="btn secondary" data-action="open-recurring-homework">Plan recurring work</button></article>
    </div></section>`:''}

    ${activeToolTab==='live'?`<section class="ultimate-section"><div class="ultimate-grid">
      <article class="ultimate-card feature-hero"><span>●</span><div><h3>Live Lesson Mode</h3><p>Send one question to the class and see answers arrive live.</p></div><button class="btn primary" data-action="start-live-lesson">Start live lesson</button></article>
      <article class="ultimate-card"><span>?</span><h3>Quick Poll</h3><p>Ask a fast confidence or understanding question.</p><button class="btn secondary" data-action="open-poll">Create poll</button></article>
      <article class="ultimate-card"><span>✓</span><h3>Exit Ticket</h3><p>Create a three-question end-of-lesson check.</p><button class="btn secondary" data-action="create-exit-ticket">Create exit ticket</button></article>
      <article class="ultimate-card"><span>👥</span><h3>Student Groups</h3><p>Make balanced Support/Core/Extension groups or custom teams.</p><button class="btn secondary" data-action="open-student-groups">Build groups</button></article>
      <article class="ultimate-card"><span>📣</span><h3>Announcements</h3><p>Post a class or school message without adding clutter to Home.</p><button class="btn secondary" data-action="open-announcement">Create announcement</button></article>
      <article class="ultimate-card"><span>🏅</span><h3>Certificates</h3><p>Create certificates for improvement, mastery, effort or challenge winners.</p><button class="btn secondary" data-action="open-certificate">Create certificate</button></article>
      <article class="ultimate-card"><span>◉</span><h3>Live Results</h3><p>Refresh recent live lessons, polls and exit tickets, then inspect student responses.</p><button class="btn secondary" data-action="refresh-live-activities">Refresh activities</button></article>
    </div>
    ${studioContent.filter(x=>['live-lesson','quick-poll','exit-ticket','class-challenge'].includes(x.content_type)).length?`<div class="calm-card live-preview"><span class="eyebrow">Recent live activities</span><div class="live-content-list">${studioContent.filter(x=>['live-lesson','quick-poll','exit-ticket','class-challenge'].includes(x.content_type)).slice(0,8).map(x=>`<article class="live-content-item"><div><strong>${escapeHtml(x.title||'Live activity')}</strong><small>${escapeHtml(String(x.content_type||'activity').replaceAll('-',' '))}</small></div><button class="btn ghost small" data-action="open-live-results" data-content-id="${Number(x.id)}">Results</button></article>`).join('')}</div></div>`:''}
    ${livePoll?`<div class="calm-card live-preview"><span class="eyebrow">Active poll</span><h3>${escapeHtml(livePoll.question)}</h3>${livePoll.options.map(o=>`<button class="poll-option" data-action="vote-poll" data-option="${o.id}">${mathHtml(o.label)} <b>${o.votes}</b></button>`).join('')}</div>`:''}
    </section>`:''}

    ${activeToolTab==='school'?`<section class="ultimate-section"><div class="ultimate-grid">
      <article class="ultimate-card feature-hero"><span>⌂</span><div><h3>School Administration</h3><p>Classes, co-teachers, student transfers, staff roles, branding, reports and school settings.</p></div><button class="btn primary" data-route="teacher-hub">Open School</button></article>
      <article class="ultimate-card"><span>👥</span><h3>Co-teachers & Relief</h3><p>Add another teacher to a class or grant temporary limited class access.</p><button class="btn secondary" data-action="open-staff-tools">Manage access</button></article>
      <article class="ultimate-card"><span>▦</span><h3>Head Teacher Dashboard</h3><p>Compare maths classes, curriculum coverage and intervention needs.</p><button class="btn secondary" data-action="open-head-dashboard">Open dashboard</button></article>
      <article class="ultimate-card"><span>⌁</span><h3>Principal Dashboard</h3><p>Whole-school participation, year-level progress, staff and engagement summaries.</p><button class="btn secondary" data-action="open-principal-dashboard">Open dashboard</button></article>
      <article class="ultimate-card"><span>⇩</span><h3>Data Export</h3><p>Export school/class summaries in CSV format.</p><button class="btn secondary" data-action="export-platform-data">Export CSV</button></article>
      <article class="ultimate-card"><span>⇧</span><h3>Import Students</h3><p>Paste CSV-style student rows and prepare them for school import.</p><button class="btn secondary" data-action="open-student-import">Open importer</button></article>
      <article class="ultimate-card"><span>🎨</span><h3>School Branding</h3><p>Choose school display name, logo reference and accent preference.</p><button class="btn secondary" data-action="open-school-branding">Branding</button></article>
      <article class="ultimate-card"><span>⚑</span><h3>Feature Controls</h3><p>Owner/school leaders can control Games, Challenges, Lucky Box, leaderboards and helper access.</p><button class="btn secondary" data-action="open-feature-flags">Manage features</button></article>
      <article class="ultimate-card"><span>⚠</span><h3>Teacher Interventions</h3><p>Flag students with low accuracy, missed assignments or repeated skill difficulty.</p><button class="btn secondary" data-action="open-interventions">View interventions</button></article>
      <article class="ultimate-card"><span>▦</span><h3>Class Heatmap</h3><p>Compare students against skills using simple mastery bands.</p><button class="btn secondary" data-action="open-class-heatmap">Open heatmap</button></article>
      <article class="ultimate-card"><span>↗</span><h3>Student Timeline</h3><p>See recent activity, accuracy, time spent and improvement in one timeline.</p><button class="btn secondary" data-action="open-student-timeline">View timeline</button></article>
      <article class="ultimate-card"><span>WC</span><h3>Class Weekly Challenge</h3><p>Run a private 10-question speed challenge for one class.</p><button class="btn secondary" data-action="open-class-challenge">Set challenge</button></article>
      <article class="ultimate-card"><span>🏆</span><h3>School Leaderboards</h3><p>Class, year and school boards with teacher controls.</p><button class="btn secondary" data-action="open-school-leaderboard">View boards</button></article>
      <article class="ultimate-card"><span>🛡</span><h3>Moderation Controls</h3><p>Control competitive features, custom profile text and leaderboard visibility.</p><button class="btn secondary" data-action="open-moderation">Manage moderation</button></article>
      <article class="ultimate-card"><span>✉</span><h3>Parent Emails</h3><p>Add parent contacts and send progress reports or teacher messages directly by email.</p><button class="btn secondary" data-action="open-parent-accounts">Manage parent emails</button></article>
    </div></section>`:''}

    ${activeToolTab==='access'?`<section class="ultimate-section"><div class="accessibility-panel">
      ${[['darkMode','Dark mode'],['highContrast','High contrast'],['largeText','Larger text'],['reducedMotion','Reduced motion'],['dyslexiaFriendly','Dyslexia-friendly text'],['readAloud','Read aloud by default']].map(([key,label])=>`<label class="access-toggle"><span><strong>${label}</strong><small>${key==='readAloud'?'Questions can be spoken with the browser speech engine.':'Saved on this device for this account.'}</small></span><input type="checkbox" data-action="toggle-access" data-pref="${key}" ${(state.accessibilityPrefs||{})[key]?'checked':''}></label>`).join('')}
      <article class="ultimate-card feature-hero"><span>🎨</span><div><h3>Theme & background</h3><p>Choose colours, gradients, patterns, card transparency or your own background picture.</p></div><button class="btn primary" data-action="open-theme-customizer">Customise</button></article>
      <article class="ultimate-card"><span>🔊</span><h3>Read this page</h3><p>Uses your browser’s built-in speech synthesis.</p><button class="btn secondary" data-action="read-current-page">Read page</button></article>
      <article class="ultimate-card"><span>⌨</span><h3>Keyboard-first navigation</h3><p>All important buttons remain native keyboard-focusable controls.</p></article>
    </div></section>`:''}

    ${activeToolTab==='complete'?renderCompleteSuite():''}
  </div>`;
}

function renderCalendar() {
  const view=document.getElementById('app-view');
  const items=[...(state.calendarItems||[]),...(state.plannerTasks||[])].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
  const notices=buildNotifications(state.notifications||[]);
  const activeTasks=(state.plannerTasks||[]).filter(x=>!x.done);
  const timer=state.activeStudySession;
  view.innerHTML=`<div class="page ultimate-page"><div class="page-head"><div><span class="eyebrow">Student planner</span><h1>Calendar, homework & study</h1><p>Assignments, tests, revision reminders, personal goals and study sessions in one place.</p></div><div class="hero-actions"><button class="btn primary" data-action="open-planner-task">Add study task</button><button class="btn secondary" data-action="open-calendar-item">Add event</button></div></div>
    <div class="planner-dashboard"><section class="calm-card"><span class="eyebrow">This week</span><h2>${activeTasks.length} personal task${activeTasks.length===1?'':'s'} left</h2><div class="progress-track"><div class="progress-fill green" style="width:${Math.min(100,Math.round(((state.weeklyQuestionsCompleted||0)/(state.weeklyGoalQuestions||30))*100))}%"></div></div><small>${state.weeklyQuestionsCompleted||0}/${state.weeklyGoalQuestions||30} question goal</small></section><section class="calm-card"><span class="eyebrow">Study timer</span><h2>${timer?'Session saved':'25 minute focus session'}</h2><p>${timer?'Your latest Pomodoro session is saved to this account.':'Use a focused study block, then take a short break.'}</p><button class="btn secondary" data-action="open-study-timer">${timer?'Start another':'Start timer'}</button></section></div>
    <div class="calendar-layout"><section class="calm-card"><div class="section-heading"><div><span class="eyebrow">Upcoming</span><h2>Planner</h2></div></div>${items.length?items.map(x=>`<article class="calendar-row ${x.done?'done':''}"><time>${escapeHtml(x.date||'No date')}</time><div><strong>${escapeHtml(x.title||'Event')}</strong><small>${escapeHtml(x.type||'Study')}</small></div>${String(x.id||'').startsWith('planner-')?`<button class="planner-check" data-action="toggle-planner-task" data-task-id="${escapeHtml(x.id)}">${x.done?'↺':'✓'}</button>`:''}</article>`).join(''):'<div class="school-empty">No planner events yet.</div>'}</section>
    <aside class="calm-card"><div class="section-heading"><div><span class="eyebrow">Notifications</span><h2>What’s new</h2></div></div>${notices.length?notices.slice(0,20).map(n=>`<article class="notice-row ${n.read?'read':''}"><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.body)}</p><button class="btn ghost small" data-action="mark-notice-read" data-notice-id="${escapeHtml(n.id)}">Mark read</button></article>`).join(''):'<div class="school-empty">You’re all caught up.</div>'}</aside></div></div>`;
}

async function renderGuardianPortal() {
  const view=document.getElementById('app-view'); if(!view)return;
  view.innerHTML='<div class="page ultimate-page parent-view"><div class="school-loading"><span class="spinner"></span><strong>Loading guardian portal…</strong></div></div>';
  try {
    const client=accountClient.ensureClient();
    const {data:children,error}=await client.rpc('mathsexpress_parent_children',{});
    if(error)throw error;
    const rows=Array.isArray(children)?children:[];
    if(!rows.length){ view.innerHTML=`<div class="page ultimate-page parent-view"><div class="page-head"><div><span class="eyebrow">Parent / Guardian</span><h1>Guardian portal</h1><p>Your account is ready, but it is not linked to a student yet.</p></div></div><div class="calm-card"><h2>Ask the school to link you</h2><p>A teacher or school leader needs to add your email as an approved guardian for a student. Once linked, progress and school messages appear here.</p></div></div>`; return; }
    if(!selectedParentChildId || !rows.some(x=>String(x.student_id)===String(selectedParentChildId))) selectedParentChildId=String(rows[0].student_id);
    const active=rows.find(x=>String(x.student_id)===String(selectedParentChildId))||rows[0];
    const [{data:summary,error:sumError},{data:messages,error:msgError}]=await Promise.all([
      client.rpc('mathsexpress_parent_child_summary',{p_student_id:active.student_id}),
      client.rpc('mathsexpress_parent_message_thread',{p_student_id:active.student_id})
    ]);
    if(sumError)throw sumError;
    const assigns=summary?.assignments||{}, questions=summary?.questions||{}, mastery=Array.isArray(summary?.mastery)?summary.mastery:[];
    const attempted=Number(questions.attempted)||0,correct=Number(questions.correct)||0,accuracy=attempted?Math.round(correct/attempted*100):0;
    const weak=mastery.slice(0,6).map(x=>({skill:CURRICULUM.find(s=>s.id===x.skill_id),mastery:Number(x.mastery)||0}));
    const thread=msgError?[]:(Array.isArray(messages)?messages:[]);
    view.innerHTML=`<div class="page ultimate-page parent-view"><div class="page-head"><div><span class="eyebrow">Parent / Guardian</span><h1>${escapeHtml(active.display_name)}’s progress</h1><p>${escapeHtml(active.school_name)} · Year ${Number(active.year_level)||''}</p></div><div class="guardian-child-switcher">${rows.map(child=>`<button class="btn ${String(child.student_id)===String(active.student_id)?'primary':'ghost'} small" data-action="parent-child" data-student-id="${escapeHtml(child.student_id)}">${escapeHtml(child.display_name)}</button>`).join('')}</div></div><div class="parent-summary-grid"><article class="calm-card"><span class="eyebrow">Assignments</span><h2>${Number(assigns.completed)||0} completed</h2><div class="parent-stat-grid"><div><b>${Number(assigns.started)||0}</b><small>Started</small></div><div><b>${Number(assigns.average_score)||0}%</b><small>Average</small></div><div><b>${attempted}</b><small>Questions</small></div><div><b>${accuracy}%</b><small>Accuracy</small></div></div></article><article class="calm-card"><span class="eyebrow">Focus areas</span><h2>Skills to strengthen</h2><div class="simple-list">${weak.length?weak.map(x=>`<div><strong>${escapeHtml(x.skill?.skill||x.skill?.title||x.skill?.id||'Maths skill')}</strong><span>${Math.round(x.mastery)}% mastery</span></div>`).join(''):'<p>More practice is needed before skill trends appear.</p>'}</div></article></div><section class="calm-card parent-messages-card"><div class="section-heading"><div><span class="eyebrow">School communication</span><h2>Teacher messages</h2></div></div><div class="message-thread">${thread.length?thread.map(m=>`<article class="${m.sender_role==='parent'?'from-parent':'from-school'}"><small>${escapeHtml(m.sender_role==='parent'?'You':'School')} · ${new Date(m.created_at).toLocaleString()}</small><p>${escapeHtml(m.body)}</p></article>`).join(''):'<div class="school-empty">No messages yet.</div>'}</div><form id="parent-reply-form" class="school-form compact"><input type="hidden" name="studentId" value="${escapeHtml(active.student_id)}"><label>Reply<textarea name="body" rows="3" maxlength="2000" required placeholder="Write a message to the school…"></textarea></label><button class="btn primary" type="submit">Send reply</button></form></section></div>`;
  } catch(error){ view.innerHTML=`<div class="page ultimate-page"><div class="school-error"><strong>Guardian portal unavailable</strong><p>${escapeHtml(error.message||'Try again.')}</p></div></div>`; }
}

function renderParentView() {
  if(account.profile?.role==='parent') { renderGuardianPortal(); return; }
  const view=document.getElementById('app-view'); const m=buildDashboardModel(state); const p=buildProfileModel(state);
  const weak=Object.entries(state.skillMasteryMap||{}).sort((a,b)=>a[1]-b[1]).slice(0,5).map(([id,v])=>({skill:CURRICULUM.find(x=>x.id===id),mastery:v}));
  const activeGoals=syncGoalsAutoProgress().filter(g=>!g.completed&&g.status!=='completed');
  const summary=buildParentWeeklySummary({name:state.playerName,completed:Math.max(0,Math.round((state.weeklyQuestionsCompleted||0)/10)),assigned:Math.max(1,Math.ceil((state.weeklyGoalQuestions||30)/10)),mastery:Math.round(Object.values(state.skillMasteryMap||{}).reduce((a,b)=>a+Number(b||0),0)/Math.max(1,Object.keys(state.skillMasteryMap||{}).length)),minutes:Math.round((state.stats?.answered||0)*1.2)});
  view.innerHTML=`<div class="page ultimate-page parent-view"><div class="page-head"><div><span class="eyebrow">Guardian summary</span><h1>${escapeHtml(state.playerName)}’s progress</h1><p>Progress, assignments, strengths, focus areas and teacher-ready reporting without exposing private account controls.</p></div><div class="hero-actions"><button class="btn secondary" data-action="print-parent-summary">Print / PDF</button><button class="btn primary" data-action="download-parent-report">Download weekly report</button></div></div>
  <div class="parent-summary-grid"><article class="calm-card"><span class="eyebrow">This account</span><h2>Learning snapshot</h2><div class="parent-stat-grid"><div><b>${m.level}</b><small>Level</small></div><div><b>${p.accuracy}%</b><small>Accuracy</small></div><div><b>${state.streak||0}</b><small>Day streak</small></div><div><b>${state.weeklyQuestionsCompleted||0}</b><small>Questions this week</small></div></div></article><article class="calm-card"><span class="eyebrow">Weekly summary</span><h2>Progress report</h2><p>${escapeHtml(summary.text)}</p><div class="parent-pref-list"><span>Weekly summary ${state.parentSettings?.weeklySummary!==false?'✓':'off'}</span><span>Assignment alerts ${state.parentSettings?.assignmentAlerts!==false?'✓':'off'}</span><span>Teacher messages ${state.parentSettings?.teacherMessages!==false?'✓':'off'}</span></div></article></div>
  <div class="parent-detail-grid"><section class="calm-card"><div class="section-heading"><div><span class="eyebrow">Focus areas</span><h2>Skills to strengthen</h2></div></div><div class="simple-list">${weak.length?weak.map(x=>`<div><strong>${escapeHtml(x.skill?.title||x.skill?.skill||x.skill?.id||'Skill')}</strong><span>${Math.round(x.mastery)}% mastery</span></div>`).join(''):'<p>Complete more practice to build detailed skill reporting.</p>'}</div></section><section class="calm-card"><div class="section-heading"><div><span class="eyebrow">Goals</span><h2>Current student goals</h2></div></div><div class="simple-list">${activeGoals.length?activeGoals.slice(0,6).map(g=>`<div><strong>${escapeHtml(g.title)}</strong><span>${g.progress||0}/${g.target||0}</span></div>`).join(''):'<p>No active personal goals.</p>'}</div></section></div><section class="calm-card parent-messages-card"><div class="section-heading"><div><span class="eyebrow">School communication</span><h2>Teacher messages</h2></div><button class="btn ghost small" data-action="open-parent-messages">Open thread</button></div><div id="parent-message-list"><div class="school-loading compact"><span class="spinner"></span><strong>Loading messages…</strong></div></div></section></div>`;
  loadParentMessagesIntoView();
}


function completeSampleSkills() {
  return getCurriculumSkills({yearLevel:normaliseYearLevel(account.profile?.yearLevel)}).slice(0,18).map((skill,i)=>({id:skill.id,skill:skill.skill,strand:skill.strand,mastery:Math.max(0,Math.min(100,Math.round((state.mastery?.algebra||35)+((i%7)-3)*9))),prerequisites:i>0?[getCurriculumSkills({yearLevel:normaliseYearLevel(account.profile?.yearLevel)})[i-1]?.id].filter(Boolean):[]}));
}

function completeCurrentStudents() {
  const source=lastTeacherReport?.students||[];
  return source.map((x,i)=>({id:x.user_id||x.student_id||`student-${i+1}`,name:x.display_name||x.displayName||`Student ${i+1}`,mastery:Number(x.mastery_after||x.mastery||50)}));
}

function currentSchoolIdForTools() {
  return selectedSchoolId || lastTeacherReport?.class?.school_id || teacherHubClasses.find(c=>!c.archived)?.school_id || schoolHubSchools[0]?.id || '';
}

async function openHouseSystemModal() {
  if(!canUseTeacherHub(account)) return showToast('Teacher feature','Teacher or school leadership access is required.');
  const schoolId=currentSchoolIdForTools();
  if(!schoolId) return showToast('Open a school first','House points need a school.');
  openSimpleModal('House Maths Points','<div class="school-loading"><span class="spinner"></span><strong>Loading houses…</strong></div>');
  try {
    const school=getSchoolClient();
    const [houses,students]=await Promise.all([school.listSchoolHouses(schoolId),school.listSchoolStudents(schoolId).catch(()=>[])]);
    const root=document.querySelector('.ultimate-modal-body'); if(!root)return;
    root.innerHTML=`<div class="house-live-layout"><section><div class="section-heading"><div><span class="eyebrow">Live standings</span><h3>${houses.length} houses</h3></div></div><div class="leaderboard-demo">${houses.length?houses.map((h,i)=>`<div><b>${i+1}</b><span>${escapeHtml(h.name)} <small>${Number(h.member_count)||0} students</small></span><strong>${Number(h.points)||0} pts</strong></div>`).join(''):'<div class="school-empty">No houses yet. Create the first one below.</div>'}</div></section><section class="house-admin-grid"><form id="house-create-form" class="school-form compact"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><h3>Create house</h3><label>Name<input name="name" maxlength="60" required placeholder="e.g. Blue House"></label><button class="btn primary" type="submit">Create house</button></form>${houses.length&&students.length?`<form id="house-assign-form" class="school-form compact"><h3>Assign student</h3><label>Student<select name="studentId">${students.map(s=>`<option value="${escapeHtml(s.user_id||s.student_id)}">${escapeHtml(s.display_name||s.email||'Student')}</option>`).join('')}</select></label><label>House<select name="houseId">${houses.map(h=>`<option value="${Number(h.id)}">${escapeHtml(h.name)}</option>`).join('')}</select></label><button class="btn secondary" type="submit">Assign house</button></form>`:''}<form id="merit-award-form" class="school-form compact"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><h3>Award merit points</h3><label>Student<select name="studentId" required>${students.map(s=>`<option value="${escapeHtml(s.user_id||s.student_id)}">${escapeHtml(s.display_name||s.email||'Student')}</option>`).join('')}</select></label><div class="form-two"><label>Points<input type="number" name="points" min="1" max="20" value="3"></label><label>Reason<input name="reason" maxlength="240" value="Excellent maths effort"></label></div><button class="btn secondary" type="submit" ${students.length?'':'disabled'}>Award points</button></form></section></div>`;
  } catch(error) { showToast('Could not load houses',error.message||'Try again.'); }
}

async function openTournamentModal() {
  if(!canUseTeacherHub(account)) return showToast('Teacher feature','Teacher or school leadership access is required.');
  const schoolId=currentSchoolIdForTools(); const classId=selectedTeacherClassId||lastTeacherReport?.class?.id||'';
  if(!schoolId&&!classId) return showToast('Open a school or class first','Tournaments need a real class or school.');
  openSimpleModal('Maths Tournaments','<div class="school-loading"><span class="spinner"></span><strong>Loading tournaments…</strong></div>');
  try {
    const school=getSchoolClient(); const rows=await school.listTournaments({schoolId:schoolId||null,classId:null});
    const students=lastTeacherReport?.students||[];
    const preview=buildTournamentBracket((students.length?students.slice(0,8).map(s=>s.display_name):['Team A','Team B','Team C','Team D','Team E','Team F','Team G','Team H']));
    const root=document.querySelector('.ultimate-modal-body'); if(!root)return;
    root.innerHTML=`<div class="tournament-live-layout"><form id="tournament-create-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><h3>Create tournament</h3><label>Title<input name="title" value="MathsExpress Challenge Cup" maxlength="120" required></label><div class="form-two"><label>Scope<select name="scope"><option value="class" ${classId?'selected':''}>Current class</option><option value="school">Whole school</option></select></label><label>Format<select name="type"><option value="knockout">Knockout</option><option value="round-robin">Round robin</option><option value="speed">Speed challenge</option><option value="team">Team challenge</option></select></label></div><input type="hidden" name="bracket" value="${escapeHtml(JSON.stringify(preview))}"><button class="btn primary" type="submit">Create tournament</button></form><section><div class="section-heading"><div><span class="eyebrow">Saved events</span><h3>${rows.length} tournaments</h3></div></div><div class="simple-list">${rows.length?rows.map(r=>`<div><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.status)} · ${escapeHtml(r.tournament_type||'knockout')}</span></div>`).join(''):'<p>No tournaments created yet.</p>'}</div></section></div>`;
  } catch(error){ showToast('Could not load tournaments',error.message||'Try again.'); }
}

function parentEmailApiEndpoints() {
  if (globalThis.location?.protocol === 'file:') return ['https://mathsexpress.netlify.app/api/parent-email','https://mathsexpress.netlify.app/.netlify/functions/parent-email'];
  return ['/api/parent-email','/.netlify/functions/parent-email'];
}
async function queueParentEmail(action, schoolId, studentId, body='') {
  const client=accountClient.ensureClient();
  const {data,error}=await client.rpc('mathsexpress_queue_parent_email',{
    p_school_id:String(schoolId||''),
    p_student_id:String(studentId||''),
    p_kind:String(action||''),
    p_body:body?String(body):null
  });
  if(error) throw error;
  return data||{};
}
async function parentEmailRequest(outboxId) {
  const token=account.session?.access_token||accountClient.session?.access_token||'';
  if(!token) throw new Error('Sign in again before sending parent email.');
  let lastError=null;
  for(const endpoint of parentEmailApiEndpoints()){
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({action:'send-outbox',outboxId:Number(outboxId)})});
      const data=await response.json().catch(()=>({}));
      if(response.status===404){lastError=new Error('Parent email delivery endpoint is not deployed.');continue;}
      if(!response.ok) throw new Error(data?.error||`Parent email failed (${response.status}).`);
      return data;
    }catch(error){lastError=error;}
  }
  throw lastError||new Error('Parent email delivery service could not be reached.');
}
async function queueAndTryParentEmail(action,schoolId,studentId,body=''){
  const queued=await queueParentEmail(action,schoolId,studentId,body);
  try{
    const sent=await parentEmailRequest(queued.outbox_id);
    return {...queued,...sent,delivery:'sent'};
  }catch(error){
    return {...queued,delivery:'queued',deliveryError:error?.message||'Email delivery is currently unavailable.'};
  }
}

async function openStudentParentModal() {
  if(!account.authenticated) return showToast('Sign in required','Sign in to add a parent or guardian.');
  if(account.profile?.role==='parent') return showToast('Student account required','Parents can manage linked children from Parent View.');
  if(canUseTeacherHub(account)) return showToast('Use Parent Emails','Teachers and school staff link guardians for their students from School → Parent Emails.');
  openSimpleModal('Parents & Guardians','<div class="school-loading"><span class="spinner"></span><strong>Loading family links…</strong></div>');
  try {
    const client=accountClient.ensureClient();
    const {data:links,error}=await client.rpc('mathsexpress_my_parent_links',{});
    if(error) throw error;
    const rows=Array.isArray(links)?links:[];
    const root=document.querySelector('.ultimate-modal-body'); if(!root)return;
    root.innerHTML=`<div class="student-parent-link-shell">
      <section class="parent-link-hero"><span class="eyebrow">Family access</span><h3>Add a Parent / Guardian</h3><p>Add the email where your parent or guardian should receive MathsExpress progress reports and teacher messages. No parent account is needed.</p></section>
      <form id="student-parent-invite-form" class="school-form parent-invite-form">
        <label>Parent / guardian name<input name="guardianName" maxlength="80" placeholder="e.g. Mum, Dad, Parent / Guardian"></label>
        <label>Parent / guardian email<input name="guardianEmail" type="email" maxlength="160" required placeholder="parent@example.com"></label>
        <button class="btn primary" type="submit">Add Parent / Guardian</button>
        <p class="muted">This only links your own student account. Reports and teacher messages can be emailed directly to this address.</p>
      </form>
      <section class="calm-card family-links-card"><div class="section-heading"><div><span class="eyebrow">Linked family</span><h3>${rows.length?`${rows.length} parent / guardian link${rows.length===1?'':'s'}`:'No parent linked yet'}</h3></div></div>
        <div class="simple-list">${rows.length?rows.map(link=>`<div><strong>${escapeHtml(link.guardian_name||'Parent / Guardian')}</strong><span>${escapeHtml(link.guardian_email)} · Email reports enabled</span></div>`).join(''):'<p>Add a guardian above. They do not need to create a MathsExpress account.</p>'}</div>
      </section>
    </div>`;
  } catch(error){ showToast('Could not load family links',error.message||'Try again.'); }
}

async function openParentAccountsModal() {
  if(!canUseTeacherHub(account)) return showToast('Teacher feature','School leadership access is required to link guardians.');
  const schoolId=currentSchoolIdForTools(); if(!schoolId)return showToast('Open a school first','Guardian links belong to a school.');
  openSimpleModal('Parent Emails','<div class="school-loading"><span class="spinner"></span><strong>Loading guardian links…</strong></div>');
  try {
    const school=getSchoolClient();
    const client=accountClient.ensureClient();
    const [students,links,outboxResult]=await Promise.all([
      school.listSchoolStudents(schoolId).catch(()=>[]),
      school.listSchoolParentLinks(schoolId).catch(()=>[]),
      client.rpc('mathsexpress_my_parent_email_outbox',{p_limit:20}).catch(()=>({data:[]}))
    ]);
    const outbox=Array.isArray(outboxResult?.data)?outboxResult.data:[];
    const root=document.querySelector('.ultimate-modal-body'); if(!root)return;
    root.innerHTML=`<div class="parent-account-admin"><form id="parent-link-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><h3>Add parent / guardian email</h3><label>Student<select name="studentId" required>${students.map(st=>`<option value="${escapeHtml(st.user_id||st.student_id)}">${escapeHtml(st.display_name||st.email||'Student')}</option>`).join('')}</select></label><div class="form-two"><label>Guardian name<input name="guardianName" maxlength="80" placeholder="Parent / guardian"></label><label>Guardian email<input name="guardianEmail" type="email" maxlength="160" required placeholder="parent@example.com"></label></div><button class="btn primary" type="submit" ${students.length?'':'disabled'}>Save parent email</button><p class="muted">Reports, due reminders and teacher messages can be emailed directly to this address. No parent account is required.</p></form><section class="calm-card"><span class="eyebrow">Parent email contacts</span><h3>${links.length} link${links.length===1?'':'s'}</h3><div class="simple-list">${links.length?links.map(link=>`<div class="parent-email-link-row"><span><strong>${escapeHtml(link.student_name||'Student')} → ${escapeHtml(link.guardian_name||link.guardian_email)}</strong><small>${escapeHtml(link.guardian_email)} · Email reports enabled</small></span><span class="simple-actions"><button class="btn ghost small" data-action="open-parent-message-teacher" data-student-id="${escapeHtml(link.student_id)}">Message</button><button class="btn secondary small" data-action="email-parent-report" data-school-id="${escapeHtml(schoolId)}" data-student-id="${escapeHtml(link.student_id)}">Send report</button></span></div>`).join(''):'<p>No guardian emails yet.</p>'}</div></section><section class="calm-card parent-email-setup-note"><span class="eyebrow">Email delivery</span><h3>Email sender setup required</h3><p>Parent messages are saved safely in the outbox, but this deployment does not yet have a verified sending domain. Once email delivery is configured, use Retry to send queued messages.</p></section>${outbox.length?`<section class="calm-card"><span class="eyebrow">Email delivery</span><h3>Recent parent emails</h3><div class="simple-list">${outbox.map(row=>`<div class="parent-email-link-row"><span><strong>${escapeHtml(row.student_name||'Student')} · ${row.email_kind==='progress-report'?'Progress report':'Teacher message'}</strong><small>${row.status==='sent'?'Sent':row.status==='failed'?'Saved · delivery setup required':'Queued safely'}${row.status!=='sent'?' · No message will be lost':''}</small></span>${row.status!=='sent'?`<button class="btn secondary small" data-action="retry-parent-email" data-outbox-id="${Number(row.id)||0}">Retry</button>`:'<span class="tag green">Sent</span>'}</div>`).join('')}</div></section>`:''}</div>`;
  } catch(error){showToast('Could not load guardians',error.message||'Try again.');}
}

async function openParentMessagesModal(studentId='') {
  const school=getSchoolClient();
  if(canUseTeacherHub(account)) {
    const schoolId=currentSchoolIdForTools();
    const students=lastTeacherReport?.students||[];
    if(!schoolId) return showToast('Open a class or school first','Parent messages need a real school.');
    const selected=studentId||students[0]?.user_id||students[0]?.student_id||'';
    return openSimpleModal('Email Parents / Guardians',`<div class="parent-email-actions"><form id="parent-message-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><h3>Send teacher message</h3><label>Student<select name="studentId" required>${students.map(s=>`<option value="${escapeHtml(s.user_id||s.student_id)}" ${String(s.user_id||s.student_id)===String(selected)?'selected':''}>${escapeHtml(s.display_name||s.email||'Student')}</option>`).join('')}</select></label><label>Message<textarea name="body" rows="5" maxlength="2000" required placeholder="Share progress, praise or a learning reminder…"></textarea></label><p class="muted">This is emailed to every saved parent / guardian contact for the selected student.</p><button class="btn primary" type="submit" ${students.length?'':'disabled'}>Email message</button></form><form id="parent-report-email-form" class="school-form compact"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><h3>Send progress report</h3><label>Student<select name="studentId" required>${students.map(s=>`<option value="${escapeHtml(s.user_id||s.student_id)}" ${String(s.user_id||s.student_id)===String(selected)?'selected':''}>${escapeHtml(s.display_name||s.email||'Student')}</option>`).join('')}</select></label><p class="muted">Emails assignment completion, average score, question accuracy, weekly points and current focus skills.</p><button class="btn secondary" type="submit" ${students.length?'':'disabled'}>Email progress report</button></form></div>`);
  }
  openSimpleModal('Teacher Messages','<div class="school-loading"><span class="spinner"></span><strong>Loading messages…</strong></div>');
  try {
    const messages=await school.listMyParentMessages();
    const root=document.querySelector('.ultimate-modal-body'); if(root) root.innerHTML=messages.length?`<div class="message-thread">${messages.map(m=>`<article><small>${new Date(m.created_at).toLocaleString()}</small><p>${escapeHtml(m.body)}</p></article>`).join('')}</div>`:'<div class="school-empty">No teacher messages yet.</div>';
  } catch(error){showToast('Could not load messages',error.message||'Try again.');}
}

function openTeacherFeedbackModal(studentId) {
  if(!canUseTeacherHub(account)) return;
  const assignments=lastTeacherReport?.assignments||[]; const student=(lastTeacherReport?.students||[]).find(s=>String(s.user_id||s.student_id)===String(studentId));
  openSimpleModal('Teacher feedback',`<form id="teacher-feedback-form" class="school-form"><input type="hidden" name="studentId" value="${escapeHtml(studentId)}"><h3>${escapeHtml(student?.display_name||'Student')}</h3><label>Assignment<select name="assignmentId" required>${assignments.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(a.title)}</option>`).join('')}</select></label><label>Feedback<textarea name="comment" rows="5" maxlength="2000" required placeholder="What did the student do well? What should they improve next?"></textarea></label><label class="check-row"><input type="checkbox" name="allowResubmission"> Allow another submission</label><button class="btn primary" type="submit" ${assignments.length?'':'disabled'}>Save feedback</button></form>`);
}

function openStudentIdentityEditor(studentId) {
  if(!canUseTeacherHub(account) && !canUsePlatformAdmin(account)) return;
  const student=(lastTeacherReport?.students||[]).find(s=>String(s.user_id||s.student_id)===String(studentId));
  if(!student) return showToast('Student unavailable','Open the class report first.');
  openSimpleModal('Edit student account',`<form id="student-identity-form" class="school-form"><input type="hidden" name="studentId" value="${escapeHtml(studentId)}"><label>Display name<input name="displayName" maxlength="40" required value="${escapeHtml(student.display_name||'Student')}"></label><label>Username<input name="username" maxlength="24" value="${escapeHtml(student.username||'')}" placeholder="Optional username"></label><label>Email<input value="${escapeHtml(student.email||'')}" disabled><small>Email is protected by the authentication system. Students cannot edit it themselves.</small></label><button class="btn primary" type="submit">Save account identity</button></form>`);
}

async function loadParentMessagesIntoView(){
  const root=document.getElementById('parent-message-list'); if(!root||!account.authenticated)return;
  try { const rows=await getSchoolClient().listMyParentMessages(); root.innerHTML=rows.length?rows.slice(0,8).map(m=>`<article class="notice-row"><strong>Teacher message</strong><p>${escapeHtml(m.body)}</p><small>${new Date(m.created_at).toLocaleDateString()}</small></article>`).join(''):'<div class="school-empty">No teacher messages yet.</div>'; }
  catch { root.innerHTML='<div class="school-empty">Messages could not load right now.</div>'; }
}

async function openRoleTools() {
  if(!account.authenticated) return;
  const role=account.profile?.role||'player';
  if(!['bug_tester','content_editor','support','admin','owner'].includes(role)) return showToast('Role tools unavailable','Your account does not have a platform role.');
  openSimpleModal(`${platformRoleLabel(role)} Tools`,'<div class="school-loading"><span class="spinner"></span><strong>Loading role tools…</strong></div>');
  try {
    const client=accountClient.ensureClient();
    const [{data:dash,error:dashError},{data:mine,error:mineError}]=await Promise.all([
      client.rpc('mathsexpress_role_dashboard',{}),client.rpc('mathsexpress_my_feedback_summary',{})
    ]);
    if(dashError) throw dashError;
    const root=document.querySelector('.ultimate-modal-body'); if(!root)return;
    const roleCopy={
      bug_tester:'Try beta features, report reproducible bugs, and check whether your own reports were reviewed.',
      content_editor:'Review curriculum content, textbook wording and question quality before broader release.',
      support:'Use account-safe support diagnostics and feedback counts without Owner-only user controls.',
      admin:'Monitor platform health, schools and feature rollouts. Sensitive Owner controls stay Owner-only.',
      owner:'Full platform tools plus Owner Console access.'
    }[role]||'';
    root.innerHTML=`<div class="role-tools-dashboard"><section class="calm-card"><span class="eyebrow">${escapeHtml(platformRoleLabel(role))}</span><h3>Your platform role</h3><p>${escapeHtml(roleCopy)}</p></section><div class="owner-analytics-strip large"><div><b>${Number(dash?.bugs_open)||0}</b><small>open bugs</small></div><div><b>${Number(dash?.suggestions_open)||0}</b><small>suggestions</small></div><div><b>${Number(dash?.users_active_15m)||0}</b><small>active 15m</small></div><div><b>${Number(dash?.feature_rollouts)||0}</b><small>feature rollouts</small></div></div><section class="calm-card"><span class="eyebrow">Your reports</span><p>${Number(mine?.open)||0} open · ${Number(mine?.reviewed)||0} reviewed · ${Number(mine?.resolved)||0} resolved</p><div class="simple-modal-actions"><button class="btn primary" data-action="open-feedback">Report a bug</button>${canUsePlatformAdmin(account)?'<button class="btn secondary" data-route="teacher-hub">School tools</button>':''}${canUseOwnerConsole(account)?'<button class="btn secondary" data-action="open-owner-console">Owner Console</button>':''}</div></section><section class="calm-card"><span class="eyebrow">Platform status</span><p>${dash?.maintenance?'Maintenance mode is currently ON.':'Platform is running normally.'}</p><p>${Number(dash?.events_today)||0} tracked MathsExpress events today.</p></section></div>`;
  } catch(error) { showToast('Role tools unavailable',error.message||'Try again.'); }
}


function currentTaskSupportContext() {
  if (currentGeneratedTask?.current) {
    const task=currentGeneratedTask.task||{};
    const question=currentGeneratedTask.current||{};
    return {
      kind:'generated', task, question,
      yearLevel:Number(task.yearLevel||normaliseYearLevel(account.profile?.yearLevel)),
      title:task.skill||task.title||task.topic||'Current maths task',
      topic:task.topic||task.strand||'Mathematics',
      strand:task.strand||'',
      skillId:task.skillId||task.lessonId||'',
      learningGoal:task.learningGoal||'Understand the method, show accurate working, and check the answer.',
      explanation:'',
      example:'',
    };
  }
  if (currentLesson?.current) {
    const lesson=getLessonById(currentLesson.lessonId)||{};
    const question=currentLesson.current||{};
    return {
      kind:'lesson', task:null, question,
      yearLevel:normaliseYearLevel(account.profile?.yearLevel),
      title:lesson.title||'Current lesson',
      topic:lesson.topic||lesson.title||'Mathematics',
      strand:lesson.strand||'',
      skillId:lesson.id||'',
      learningGoal:lesson.description||lesson.explanation||'Understand the method and apply it accurately.',
      explanation:lesson.explanation||lesson.description||'',
      example:lesson.example||'',
    };
  }
  return null;
}

function currentTaskTextbookSection(context=currentTaskSupportContext()) {
  if (!context) return null;
  const year=Number(context.yearLevel)||null;
  const exact=TEXTBOOK_SECTIONS.find(section=>
    (!year || section.yearLevel===year) &&
    (String(section.skillId||'')===String(context.skillId||'') || String(section.id||'')===String(context.skillId||''))
  );
  if (exact) return exact;
  const queries=[context.title,context.topic,context.strand].filter(Boolean);
  for (const query of queries) {
    const rows=searchTextbookSeries(query,{yearLevel:year,limit:20});
    if (rows?.length) return rows[0];
  }
  return TEXTBOOK_SECTIONS.find(section=>!year || section.yearLevel===year) || null;
}

function supportSteps(context,section) {
  const q=context?.question||{};
  const rows=[];
  if (section?.keyRule) rows.push(section.keyRule);
  rows.push(...safeLessonHints(q).slice(0,2));
  if (Array.isArray(section?.explanation)) rows.push(...section.explanation.filter(Boolean).slice(0,2));
  if (!rows.length && context?.explanation) rows.push(context.explanation);
  rows.push('Show each important line of working, then check that the result fits the original question.');
  return [...new Set(rows.map(x=>String(x).trim()).filter(Boolean))].slice(0,4);
}

function taskTextbookPanelHtml(context=currentTaskSupportContext(),{compact=false}={}) {
  if (!context) return '<p class="muted">Open a task first to see its matching textbook lesson.</p>';
  const section=currentTaskTextbookSection(context);
  const question=context.question||{};
  if (!section) {
    return `<section class="task-textbook-panel"><span class="support-kicker">Current lesson</span><h3>${escapeHtml(context.title)}</h3><p>${escapeHtml(context.learningGoal)}</p><div class="support-rule"><strong>Method</strong><p>Identify what is given, choose the correct rule, show your working clearly, and check the result.</p></div></section>`;
  }
  const example=section.workedExamples?.[0];
  const explanation=(section.explanation||[]).slice(0,compact?1:3);
  return `<section class="task-textbook-panel ${compact?'compact':''}">
    <div class="task-textbook-meta"><span>${escapeHtml(yearLabel(section.yearLevel))}</span><span>${escapeHtml(section.chapterTitle||section.strand||'Textbook')}</span><span>Section ${escapeHtml(section.sectionNumber||'')}</span></div>
    <span class="support-kicker">Textbook lesson for this task</span>
    <h3>${escapeHtml(section.shortTitle||section.title||context.title)}</h3>
    <p class="task-textbook-goal">${escapeHtml(section.learningGoal||context.learningGoal)}</p>
    ${explanation.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}
    ${section.keyRule?`<div class="support-rule"><strong>Key rule</strong><p>${mathHtml(section.keyRule)}</p></div>`:''}
    ${example?`<div class="support-worked-example"><span>Worked example</span><strong>${mathHtml(example.prompt)}</strong><div>${mathHtml(example.solution)}</div></div>`:''}
    ${!compact&&section.commonMistakes?.length?`<div class="support-mistakes"><strong>Common mistakes</strong><ul>${section.commonMistakes.slice(0,3).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`:''}
    ${question?.prompt?`<div class="support-current-question"><strong>Your current question</strong><p>${mathHtml(question.prompt)}</p></div>`:''}
  </section>`;
}

function lessonSupportHtml() {
  const context=currentTaskSupportContext();
  if (!context) return '<p class="muted">Open an assignment question first.</p>';
  const section=currentTaskTextbookSection(context);
  const q=context.question||{};
  const steps=supportSteps(context,section);
  const example=section?.workedExamples?.[0];
  return `<div class="lesson-support-pro">
    <div class="lesson-support-head"><div><span class="support-kicker">${escapeHtml(context.topic||'Mathematics')}</span><h3>${escapeHtml(context.title)}</h3><p>${escapeHtml(section?.learningGoal||context.learningGoal)}</p></div><span class="lesson-support-year">${escapeHtml(yearLabel(context.yearLevel))}</span></div>
    <div class="support-current-question"><strong>Current question</strong><p>${mathHtml(q.prompt||'')}</p></div>
    <section class="support-method"><span class="support-kicker">How to approach it</span><ol>${steps.map(step=>`<li>${mathHtml(step)}</li>`).join('')}</ol></section>
    ${example?`<section class="support-worked-example"><span>Worked example from the textbook</span><strong>${mathHtml(example.prompt)}</strong><div>${mathHtml(example.solution)}</div></section>`:context.example?`<section class="support-worked-example"><span>Worked example</span><div>${mathHtml(context.example)}</div></section>`:''}
    ${safeLessonHints(q)[0]?`<section class="support-hint"><strong>First hint</strong><p>${mathHtml(safeLessonHints(q)[0])}</p></section>`:''}
    ${section?.commonMistakes?.length?`<section class="support-mistakes"><strong>Watch out for</strong><ul>${section.commonMistakes.slice(0,3).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section>`:''}
    <div class="lesson-support-actions"><button class="btn primary" data-action="assignment-textbook">Open task textbook</button>${activeSchoolAssignment?.tutorAllowed===false||activeSchoolAssignment?.testMode?'':`<button class="btn secondary" data-action="open-ai-helper">Ask AI about this step</button>`}</div>
  </div>`;
}

function scientificCalculatorHtml() {
  const keys=[
    ['AC','clear','utility'],['DEL','delete','utility'],['(', '(','utility'],[')',')','utility'],
    ['sin','sin(','function'],['cos','cos(','function'],['tan','tan(','function'],['sqrt','sqrt(','function'],
    ['7','7','number'],['8','8','number'],['9','9','number'],['÷','/','operator'],
    ['4','4','number'],['5','5','number'],['6','6','number'],['×','*','operator'],
    ['1','1','number'],['2','2','number'],['3','3','number'],['−','-','operator'],
    ['0','0','number'],['.','.','number'],['pi','π','function'],['+','+','operator'],
    ['x²','square','function'],['xʸ','^','function'],['log','log(','function'],['ln','ln(','function'],
    ['e','e','function'],['Ans','ans','function'],['%','/100','function'],['=','equals','equals'],
  ];
  return `<div class="scientific-calculator">
    <div class="calculator-display-wrap">
      <div class="calculator-mode-row"><span>Scientific calculator</span><button type="button" class="calculator-mode-toggle" data-action="calculator-toggle-angle">${calculatorAngleMode.toUpperCase()}</button></div>
      <input id="complete-calc-expression" class="calculator-expression" value="" placeholder="0" aria-label="Calculator expression" autocomplete="off">
      <output id="complete-calc-output" class="calculator-result">0</output>
    </div>
    <div class="calculator-grid">${keys.map(([label,value,type])=>`<button type="button" class="calc-key ${type}" data-action="calculator-key" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`).join('')}</div>
    <p class="calculator-note">Use DEG for normal angle questions or switch to RAD for radians. Teachers can disable the calculator for an assignment or test.</p>
  </div>`;
}

function evaluateScientificCalculator(raw) {
  let expression=String(raw||'').trim();
  if(!expression) return 0;
  if(expression.length>180) throw new Error('Expression is too long.');
  expression=expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/\^/g,'**').toLowerCase();
  if(!/^[0-9+\-*/().,%*\s_a-z]+$/.test(expression)) throw new Error('Unsupported character.');
  const allowed=['sqrt','sin','cos','tan','log','ln','abs','pi','e','ans'];
  const probe=expression.replace(/\b(sqrt|sin|cos|tan|log|ln|abs|pi|e|ans)\b/g,'');
  if(/[a-z_$\[\]{};'"`]/i.test(probe)) throw new Error('Unsupported expression.');
  const value=globalThis.MXSafeMath?.evaluate?.(expression,{ans:Number(calculatorAns)||0},{angleMode:calculatorAngleMode});
  if(!Number.isFinite(value)) throw new Error('That calculation does not have a finite result.');
  calculatorAns=Math.round(value*1e12)/1e12;
  return calculatorAns;
}

function completeAction(action) {
  if(!action)return false;
  if(action==='open-discovery-checkin'){openV83Diagnostic('discovery');return true;}
  if(action==='open-topic-readiness'){openV83Diagnostic('readiness');return true;}
  if(action==='open-growth-report'){openV83GrowthReport();return true;}
  if(action==='open-class-growth'){openV83ClassGrowth('class');return true;}
  if(action==='open-standards-growth'){openV83ClassGrowth('standards');return true;}
  if(action==='open-school-usage'){openV83SchoolUsage('usage');return true;}
  if(action==='open-learning-source-report'){openV83SchoolUsage('source');return true;}
  if(action==='open-school-hours-report'){openV83SchoolUsage('hours');return true;}
  if(action==='open-school-integrations'){openV83IntegrationSettings();return true;}
  if(action.startsWith('integration-')) {
    const id=action.replace('integration-','');
    if(['canvas','clever','saml','sis'].includes(id)){openV83IntegrationSettings();return true;}
    const item=buildIntegrationCatalog().find(x=>x.id===id);
    openSimpleModal(item?.name||'Integration',`<div class="integration-status-card"><span class="status-dot waiting"></span><div><h3>Provider authorization required</h3><p>${escapeHtml(item?.status||'Requires a provider connection.')}</p><p class="muted">MathsExpress keeps provider secrets server-side. Authorise the real provider before live syncing can start.</p></div></div>`); return true;
  }
  const students=completeCurrentStudents();
  if(action==='run-diagnostic') {
    const skills=completeSampleSkills(); const attempts=skills.slice(0,12).map((x,i)=>({skillId:x.id,strand:x.strand,correct:x.mastery>=50,difficulty:i%3===0?'hard':i%3===1?'medium':'easy'}));
    const result=scoreDiagnostic(attempts,normaliseYearLevel(account.profile?.yearLevel)); const path=buildLearningPath({skills});
    persist({...state,diagnosticHistory:[...(state.diagnosticHistory||[]),{...result,createdAt:new Date().toISOString()}].slice(-20),personalLearningPath:path.map(x=>x.id)},{quiet:true});
    openSimpleModal('Diagnostic Placement',`<div class="diagnostic-result"><div class="owner-analytics-strip"><div><b>${Math.round(result.accuracy*100)}%</b><small>diagnostic accuracy</small></div><div><b>${result.weakSkills.length}</b><small>priority skills</small></div><div><b>${escapeHtml(result.recommendedDifficulty)}</b><small>starting difficulty</small></div></div><h3>Your next learning steps</h3><ol class="simple-list">${path.slice(0,8).map(x=>`<li><strong>${escapeHtml(x.skill||x.id)}</strong><span>${Math.round(x.mastery)}% · ${escapeHtml(x.reason)}</span></li>`).join('')}</ol></div>`); return true;
  }
  if(action==='open-learning-path') { const path=buildLearningPath({skills:completeSampleSkills()}); openSimpleModal('Personal Learning Path',`<ol class="simple-list">${path.map((x,i)=>`<li><b>${i+1}</b><div><strong>${escapeHtml(x.skill||x.id)}</strong><small>${escapeHtml(x.strand||'Maths')} · ${Math.round(x.mastery)}% · ${escapeHtml(x.reason)}</small></div></li>`).join('')}</ol>`); return true; }
  if(action==='open-spaced-review') { const dates=scheduleSpacedReview(new Date(),6); const added=dates.map((d,i)=>({id:`spaced-${Date.now()}-${i}`,date:d.toISOString().slice(0,10),title:`Spaced review ${i+1}`,type:'Revision'})); persist({...state,calendarItems:[...(state.calendarItems||[]),...added].slice(-200)},{quiet:true}); openSimpleModal('Spaced Repetition',`<p>Six revision sessions were added to your MathsExpress calendar.</p><div class="simple-list">${dates.map((d,i)=>`<div><strong>Review ${i+1}</strong><span>${d.toISOString().slice(0,10)}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-predicted-mastery') { const rows=completeSampleSkills().map((x,i)=>({...x,predicted:predictMastery({mastery:x.mastery,recent:[true,i%2===0,true,i%3!==0],daysSincePractice:i})})).sort((a,b)=>a.predicted-b.predicted); openSimpleModal('Predicted Mastery',`<p>Lower predictions appear first so students can revise before gaps grow.</p><div class="simple-list">${rows.slice(0,10).map(x=>`<div><strong>${escapeHtml(x.skill)}</strong><span>${x.mastery}% now → ${x.predicted}% predicted</span></div>`).join('')}</div>`); return true; }
  if(action==='open-confidence-report') { const attempts=state.confidenceAttempts||[{correct:true,confidence:5},{correct:false,confidence:5},{correct:true,confidence:2},{correct:true,confidence:4}]; const r=confidenceAccuracySummary(attempts); openSimpleModal('Confidence vs Accuracy',`<div class="owner-analytics-strip"><div><b>${r.overconfident}</b><small>overconfident</small></div><div><b>${r.underconfident}</b><small>underconfident</small></div><div><b>${r.calibrated}</b><small>well calibrated</small></div></div>`); return true; }
  if(action==='open-error-analysis') { const mistakes=currentMistakes(); const rows=mistakes.slice(0,12).map(m=>({prompt:m.prompt,type:classifyMathError({expected:'5',actual:m.prompt?.includes('-')?'-5':'4',working:m.prompt||''})})); openSimpleModal('Error Analysis',rows.length?`<div class="simple-list">${rows.map(x=>`<div><strong>${escapeHtml(x.type.replaceAll('-',' '))}</strong><span>${mathHtml(x.prompt)}</span></div>`).join('')}</div>`:'<p>No unresolved mistakes are saved yet. Error types will appear after practice.</p>'); return true; }
  if(action==='open-exam-pro') { const candidates=searchTaskLibrary({yearLevel:normaliseYearLevel(account.profile?.yearLevel),difficulty:'all',type:'all'}).slice(0,10).map((t,i)=>({id:t.id,marks:i%4===0?3:i%3===0?2:1,title:t.title})); const versions=buildExamVersions(candidates,4,'mathsexpress-exam'); const exam=buildExamPaper({title:`${yearLabel(account.profile?.yearLevel)} Mathematics Examination`,timeMinutes:60,readingMinutes:5,questions:candidates}); openSimpleModal('Exam Builder Pro',`<div class="owner-analytics-strip"><div><b>${exam.totalMarks}</b><small>marks</small></div><div><b>${exam.timeMinutes}m</b><small>writing time</small></div><div><b>A–D</b><small>equivalent versions</small></div></div><div class="version-grid">${Object.values(versions).map(v=>`<article class="complete-card"><h3>Version ${v.label}</h3><p>${v.questions.length} questions · ${v.totalMarks} marks</p></article>`).join('')}</div><button class="btn primary" data-action="complete-download-exam">Download exam outline</button>`); return true; }
  if(action==='open-rubric-builder') { const r=buildRubric([{part:'a',marks:2,criteria:'Correct method and substitution'},{part:'b',marks:3,criteria:'Accurate reasoning and final result'}]); openSimpleModal('Rubric Builder',`<div class="simple-list">${r.parts.map(x=>`<div><strong>Part ${x.part} · ${x.marks} marks</strong><span>${escapeHtml(x.criteria)}</span></div>`).join('')}</div><p><b>${r.totalMarks} marks total</b></p>`); return true; }
  if(action==='open-working-marker') { const a=lastTeacherReport?.assignments?.[0]; if(!a)return showToast('Open a class first','Then choose Scorecard on an assignment to review real student working.'); scorecardModal(a.id); return true; }
  if(action==='open-multipart-builder') { const q=buildMultiPartQuestion({stem:'A taxi fare is modelled by C = 4 + 2.5d.',parts:[{prompt:'Find the cost when d = 6.',marks:2},{prompt:'Rearrange the formula to make d the subject.',marks:2,dependsOn:'a'},{prompt:'Interpret the constant 4.',marks:1}]}); openSimpleModal('Multi-part Question Builder',`<h3>${escapeHtml(q.stem)}</h3><div class="simple-list">${q.parts.map(p=>`<div><strong>${p.label}) ${p.marks} marks</strong><span>${escapeHtml(p.prompt)}${p.dependsOn?` · uses ${p.dependsOn})`:''}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-progressive-hints') { const hints=progressiveHints(['Identify the variables.','Use inverse operations.','Divide both sides by the coefficient.']); openSimpleModal('Progressive Hints',`<div class="simple-list">${hints.map(h=>`<div><strong>Hint ${h.level}</strong><span>${escapeHtml(h.text)} · ${h.penalty}% optional score penalty</span></div>`).join('')}</div>`); return true; }
  if(action==='open-resubmission-tools') { openSimpleModal('Resubmissions & Teacher Feedback',`<p>Teachers can return a task with comments, keep the first attempt in history, and allow a new submission.</p><div class="status-banner success">Version history keeps the original result instead of overwriting it.</div>`); return true; }
  if(action==='open-lesson-planner') { const plan=buildLessonPlan({topic:'Linear equations',minutes:50,yearLevel:normaliseYearLevel(account.profile?.yearLevel)}); openSimpleModal('Lesson Planner',`<h3>${escapeHtml(plan.topic)} · Year ${plan.yearLevel}</h3><p>${escapeHtml(plan.objective)}</p><div class="simple-list">${plan.segments.map(x=>`<div><strong>${escapeHtml(x.name)}</strong><span>${x.minutes} min</span></div>`).join('')}</div>`); return true; }
  if(action==='open-term-planner') { const plan=buildTermPlan(['Number','Algebra','Linear relationships','Geometry','Trigonometry','Statistics','Probability','Revision'],10); openSimpleModal('Term Planner',`<div class="term-plan-grid">${plan.map(x=>`<article><b>Week ${x.week}</b><span>${escapeHtml(x.topic)}</span></article>`).join('')}</div>`); return true; }
  if(action==='open-curriculum-coverage') { const skills=getCurriculumSkills({yearLevel:normaliseYearLevel(account.profile?.yearLevel)}).slice(0,18).map(x=>({id:x.id,label:x.skill,strand:x.strand})); const done=skills.filter((_,i)=>i%3!==0).map(x=>x.id); const r=curriculumCoverage(skills,done); openSimpleModal('Curriculum Coverage',`<div class="owner-analytics-strip"><div><b>${r.percent}%</b><small>covered</small></div><div><b>${r.covered}</b><small>skills covered</small></div><div><b>${r.total-r.covered}</b><small>remaining</small></div></div><div class="simple-list">${r.rows.map(x=>`<div><strong>${x.covered?'✓':'○'} ${escapeHtml(x.label)}</strong><span>${escapeHtml(x.strand)}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-late-work') { const now=new Date(); const tasks=[{title:'Algebra homework',status:'assigned',dueAt:new Date(now.getTime()-86400000).toISOString()},{title:'Geometry task',status:'completed',dueAt:new Date(now.getTime()-86400000).toISOString()},{title:'Revision',status:'assigned',dueAt:new Date(now.getTime()+86400000).toISOString()}]; const late=buildLateWork(tasks,now); const reminders=buildTeacherReminders({lateWork:late,unmarked:3,upcoming:[tasks[2]]}); openSimpleModal('Late / Missing Work',`<div class="simple-list">${late.map(x=>`<div><strong>${escapeHtml(x.title)}</strong><span>Overdue</span></div>`).join('')||'<p>No overdue work.</p>'}</div><h3>Teacher reminders</h3><p>${escapeHtml(reminders.join(' · '))}</p>`); return true; }
  if(action==='open-resource-manager') { const sample={id:'resource-1',title:'Year 9 Algebra Test',questions:10}; const copy=duplicateAssignment(sample); const version=createResourceVersion(sample,2,'Updated the challenge question'); openSimpleModal('Task Folders & Version History',`<div class="simple-list"><div><strong>${escapeHtml(copy.title)}</strong><span>Duplicate created safely with a new ID</span></div><div><strong>Version ${version.version}</strong><span>${escapeHtml(version.changeNote)}</span></div><div><strong>Recycle Bin</strong><span>Deleted resources can be restored before permanent removal.</span></div></div>`); return true; }
  if(action==='open-resource-library') { const resources=[{title:'Year 9 Algebra Test',tags:['algebra','year9'],rating:4.8},{title:'Trigonometry Revision',tags:['trig','year9'],rating:4.6},{title:'Year 8 Geometry Investigation',tags:['geometry','year8'],rating:4.4}]; const rows=searchResourceLibrary(resources,''); openSimpleModal('Teacher Resource Library',`<p>Teachers can share original MathsExpress resources, favourite them and keep school/public versions.</p><div class="simple-list">${rows.map(x=>`<div><strong>${escapeHtml(x.title)}</strong><span>★ ${x.rating} · ${escapeHtml(x.tags.join(', '))}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-attendance') { const list=students.length?students:buildDemoSchool().classes[2].students; const r=buildAttendanceRegister(list,new Date().toISOString().slice(0,10)); openSimpleModal('Attendance',`<p>${r.date}</p><div class="attendance-list">${r.rows.map(x=>`<label><input type="checkbox" checked> <span>${escapeHtml(x.name)}</span><small>Present</small></label>`).join('')}</div>`); return true; }
  if(action==='open-seating-plan') { const list=students.length?students:buildDemoSchool().classes[2].students; const seats=buildSeatingPlan(list,4); openSimpleModal('Seating Plan',`<div class="seating-grid" style="--seat-cols:4">${seats.map(x=>`<div class="seat"><small>R${x.row} C${x.column}</small><strong>${escapeHtml(x.name)}</strong></div>`).join('')}</div>`); return true; }
  if(action==='open-merit-points') { openHouseSystemModal(); return true; }
  if(action==='open-house-system') { openHouseSystemModal(); return true; }
  if(action==='open-timetable') { const rows=buildTimetable([{day:'Monday',period:1,className:'Year 9 Maths'},{day:'Monday',period:3,className:'Year 10 Maths'},{day:'Tuesday',period:2,className:'Year 8 Maths'}]); openSimpleModal('School Timetable',`<div class="simple-list">${rows.map(x=>`<div><strong>${escapeHtml(x.day)} · Period ${x.period}</strong><span>${escapeHtml(x.className)}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-learning-modes') { openSimpleModal('Learning Modes',`<div class="mode-cards"><article><h3>Focus Mode</h3><p>Hides games, coins and competitive widgets.</p></article><article><h3>Homework Mode</h3><p>Shows only assigned work and required learning tools.</p></article><article><h3>Exam Lock</h3><p>Hides helper, notes and unrelated MathsExpress screens during a test.</p></article></div><button class="btn primary" data-action="complete-toggle-focus">Toggle Focus Mode</button>`); return true; }
  if(action==='open-notebook') { const pages=state.notebookPages||[]; openSimpleModal('Digital Maths Notebook',`<textarea id="complete-notebook-text" rows="8" placeholder="Write maths notes, formulas, examples or revision ideas…">${escapeHtml(pages.at(-1)?.body||'')}</textarea><div class="simple-modal-actions"><button class="btn primary" data-action="complete-save-notebook">Save page</button></div>${pages.length?`<p class="muted">${pages.length} saved page${pages.length===1?'':'s'} on this account.</p>`:''}`); return true; }
  if(action==='open-flashcards') { const cards=(state.flashcards?.length?state.flashcards:createFlashcards([{term:'Gradient',definition:'rise ÷ run'},{term:'Pythagoras',definition:'a² + b² = c²'}])); openSimpleModal('Flashcards',`<div class="flashcard-grid">${cards.map(c=>`<article><strong>${escapeHtml(c.term)}</strong><p>${escapeHtml(c.definition)}</p></article>`).join('')}</div><button class="btn secondary" data-action="complete-save-starter-flashcards">Save starter cards</button>`); return true; }
  if(action==='open-formula-sheet') { const sheet=buildFormulaSheet([{topic:'Circle',formula:'A = πr²'},{topic:'Pythagoras',formula:'a² + b² = c²'},{topic:'Gradient',formula:'m = (y₂-y₁)/(x₂-x₁)'}]); openSimpleModal('Formula Sheet',`<pre class="formula-sheet">${escapeHtml(sheet)}</pre><button class="btn secondary" data-action="complete-download-formulas">Download</button>`); return true; }
  if(action==='open-revision-checklist') { const list=buildRevisionChecklist(['Algebra','Linear relationships','Pythagoras','Trigonometry','Probability','Statistics']); openSimpleModal('Revision Checklist',`<div class="attendance-list">${list.map(x=>`<label><input type="checkbox"> <span>${escapeHtml(x.topic)}</span><small>Confidence ${x.confidence}/5</small></label>`).join('')}</div>`); return true; }
  if(action==='open-exam-countdown') { const target=new Date(); target.setDate(target.getDate()+21); openSimpleModal('Exam Countdown',`<div class="countdown-big"><b>21</b><span>days until your example exam</span></div><p>Add the real test date to Calendar to keep it updated.</p>`); return true; }
  if(action==='open-study-timer') { openStudyTimerModal(); return true; }
  if(action==='open-scientific-calculator') { if(activeSchoolAssignment?.testMode){showToast('Calculator locked','Calculator is disabled in Test Mode.');return true;} openSimpleModal('Calculator',scientificCalculatorHtml()); setTimeout(()=>document.getElementById('complete-calc-expression')?.focus(),0); return true; }
  if(action==='open-graphing-calculator') { openWorkingSpace(); return true; }
  if(action==='open-unit-converter') { openSimpleModal('Unit Converter',`<div class="school-form converter-form"><label>Value<input id="unit-value" type="number" step="any" value="2.5"></label><div class="form-two"><label>From<select id="unit-from">${['mm','cm','m','km','mg','g','kg','ml','l'].map(u=>`<option value="${u}" ${u==='km'?'selected':''}>${u}</option>`).join('')}</select></label><label>To<select id="unit-to">${['mm','cm','m','km','mg','g','kg','ml','l'].map(u=>`<option value="${u}" ${u==='m'?'selected':''}>${u}</option>`).join('')}</select></label></div><button class="btn primary" type="button" data-action="complete-convert-unit">Convert</button><output id="unit-convert-output" class="tool-result">2.5 km = 2500 m</output></div><p class="muted">Convert common length, mass and capacity units. Choose units from the same measurement family.</p>`); return true; }
  if(action==='open-formula-rearranger') { openSimpleModal('Formula Rearranger',`<div class="converter-row"><strong>v = d/t</strong><span>make d the subject</span><strong>${escapeHtml(rearrangeFormula('v=d/t','d'))}</strong></div>`); return true; }
  if(action==='open-probability-sim') { openSimpleModal('Probability Simulator',`<div class="school-form probability-form"><div class="form-two"><label>Experiment<select id="probability-kind"><option value="coin">Coin toss</option><option value="die">Six-sided die</option><option value="spinner">4-section spinner</option></select></label><label>Trials<input id="probability-trials" type="number" min="1" max="10000" value="100"></label></div><button class="btn primary" type="button" data-action="complete-run-probability">Run simulation</button><div id="probability-output" class="probability-results"><p>Run the experiment to see the results.</p></div></div>`); return true; }
  if(action==='open-statistics-explorer') { openSimpleModal('Statistics Explorer',`<div class="school-form statistics-form"><label>Dataset<textarea id="statistics-data" rows="4" placeholder="Enter numbers separated by commas">3, 5, 5, 7, 8, 9, 12</textarea></label><button class="btn primary" type="button" data-action="complete-statistics">Analyse data</button><div id="statistics-output" class="statistics-output"></div></div>`); setTimeout(()=>document.querySelector('[data-action="complete-statistics"]')?.click(),0); return true; }
  if(action==='open-geometry-toolkit') { openSimpleModal('Geometry Toolkit',`<div class="school-form geometry-calc"><h3>Coordinate geometry</h3><div class="form-two"><label>Point A (x, y)<input id="geometry-point-a" value="1, 2"></label><label>Point B (x, y)<input id="geometry-point-b" value="7, 10"></label></div><button class="btn primary" type="button" data-action="complete-geometry">Calculate distance & midpoint</button><div id="geometry-output" class="tool-result"></div><div class="geometry-tool-demo"><div class="geometry-grid"></div><div class="geometry-toolbar"><span>Ruler</span><span>Coordinates</span><span>Distance</span><span>Midpoint</span></div></div></div>`); return true; }
  if(action==='open-tournament') { openTournamentModal(); return true; }
  if(action==='open-duel') { openSimpleModal('Maths Duels',`<p>Create a 1v1 challenge using the same year/topic/difficulty rules for both students.</p><div class="duel-card"><strong>Student A</strong><span>10 questions</span><strong>Student B</strong></div>`); return true; }
  if(action==='open-friend-challenge') { const code=`MX${String(Date.now()).slice(-6)}`; openSimpleModal('Private Friend Challenge',`<div class="challenge-code"><small>Challenge code</small><b>${code}</b></div><p>10 equal-difficulty questions. The code can be shared with a classmate.</p>`); return true; }
  if(action==='open-spectate') { openSimpleModal('Teacher Spectate',`<p>${activeClassSessions.length?`${activeClassSessions.length} active class session${activeClassSessions.length===1?'':'s'} loaded.`:'No active sessions are currently loaded.'}</p><p>Open a class game to view server-backed position, score, streak, lives and answers.</p>`); return true; }
  if(action==='open-game-replay') { openSimpleModal('Game Replay Summary',`<div class="simple-list"><div><strong>Question 3</strong><span>Blue team took the lead</span></div><div><strong>Question 7</strong><span>Red team recovered with a 3-answer streak</span></div><div><strong>Question 10</strong><span>Final deciding question</span></div></div>`); return true; }
  if(action==='open-integrity-check') { const r=inspectChallengeIntegrity({answerTimesMs:[250,280,260,240,270],accuracy:1,tabLeaves:1,pasteEvents:0}); openSimpleModal('Challenge Integrity',`<div class="status-banner ${r.flagged?'warning':'success'}"><b>${r.flagged?'Review recommended':'No flags'}</b></div><p>Average answer time: ${r.averageAnswerMs} ms</p><p>${escapeHtml(r.reasons.join(' · ')||'No suspicious patterns detected.')}</p>`); return true; }
  if(action==='open-parent-accounts') { openParentAccountsModal(); return true; }
  if(action==='open-parent-weekly') { openParentMessagesModal(); return true; }
  if(action==='open-parent-messages') { openParentMessagesModal(); return true; }
  if(action==='open-email-settings') { return completeAction('integration-email'); }
  if(action==='open-push-settings') { return completeAction('integration-push'); }
  if(action==='open-discussion-tools') { void openDiscussionBoard(); return true; }
  if(action==='open-offline-status') { const sw=Boolean(navigator?.serviceWorker); openSimpleModal('Offline / PWA Status',`<div class="status-banner ${sw?'success':'warning'}"><b>${sw?'PWA APIs supported':'PWA support limited'}</b></div><p>Core app files can be cached for offline opening. Assignment syncing still requires a connection when results are sent to the school.</p>`); return true; }
  if(action==='open-backups') { const m=buildBackupManifest({schools:schoolHubSchools.length,users:students.length,assignments:lastTeacherReport?.assignments?.length||0,version:'complete'}); openSimpleModal('Backups & Restore',`<p>Recovery point <b>${escapeHtml(m.id)}</b></p><p>${m.counts.schools} schools · ${m.counts.users} visible students · ${m.counts.assignments} assignments in the current context</p><button class="btn primary" data-action="complete-export-backup">Export account backup</button>`); return true; }
  if(action==='open-recycle-bin') { const rows=state.recycleBin||[]; openSimpleModal('Recycle Bin',rows.length?`<div class="simple-list">${rows.map(x=>`<div><strong>${escapeHtml(x.title||'Deleted resource')}</strong><span>Recoverable</span></div>`).join('')}</div>`:'<p>The recycle bin is empty. Deleted teacher resources can be retained here before permanent removal.</p>'); return true; }
  if(action==='open-audit-log') { const rows=state.localAuditLog||[buildAuditEntry({actor:state.playerName,action:'Opened Complete Suite',target:'Power Tools'})]; openSimpleModal('Audit Log',`<div class="simple-list">${rows.slice(-20).reverse().map(x=>`<div><strong>${escapeHtml(x.action)}</strong><span>${escapeHtml(x.actor)} · ${escapeHtml(x.target)} · ${escapeHtml(x.createdAt)}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-retention') { const p=buildDataRetentionPlan({}); openSimpleModal('Privacy & Data Retention',`<div class="simple-list"><div><strong>Student work</strong><span>${p.studentWorkDays} days</span></div><div><strong>Audit logs</strong><span>${p.auditDays} days</span></div><div><strong>Feedback</strong><span>${p.feedbackDays} days</span></div><div><strong>Deleted-item recovery</strong><span>${p.deletedRecoveryDays} days</span></div></div><p class="muted">Actual legal/school retention settings should be configured by the organisation deploying MathsExpress.</p>`); return true; }
  if(action==='open-command-palette') { const hits=searchEverything({resources:[{title:'Year 9 Algebra Test'}],notes:state.notebookPages||[],tasks:searchTaskLibrary({yearLevel:normaliseYearLevel(account.profile?.yearLevel)}).slice(0,20),students},'algebra'); openSimpleModal('Global Search / Command Palette',`<input type="search" value="algebra" aria-label="Search MathsExpress"><div class="simple-list">${hits.slice(0,12).map(x=>`<div><strong>${escapeHtml(x.type)}</strong><span>${escapeHtml(x.item.title||x.item.name||x.item.body||'Result')}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-rollouts') { const r=buildFeatureRollout({feature:'New assessment marking',schools:selectedSchoolId?[selectedSchoolId]:[],beta:true,percent:20}); openSimpleModal('Feature Rollouts',`<div class="status-banner success"><b>Beta rollout configured</b></div><p>${escapeHtml(r.feature)} · ${r.percent}% rollout · ${r.schools.length||'selected'} school scope</p><p>Owner can enable new features school-by-school before a platform-wide release.</p>`); return true; }
  if(action==='open-system-status') { const r=buildStatusSnapshot({app:true,database:true,authentication:account.authenticated,schoolApi:Boolean(schoolClient||account.authenticated)}); openSimpleModal('System Status',`<div class="status-banner ${r.overall==='operational'?'success':'warning'}"><b>${escapeHtml(r.overall.toUpperCase())}</b></div><div class="simple-list">${r.services.map(x=>`<div><strong>${escapeHtml(x.name)}</strong><span>${x.ok?'Operational':'Needs attention'}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-error-logs') { const logs=state.errorLogs||[buildErrorLog({message:'Example diagnostic event',route:routeFromHash().route,severity:'info'})]; openSimpleModal('Error Logs',`<div class="simple-list">${logs.slice(-20).reverse().map(x=>`<div><strong>${escapeHtml(x.severity.toUpperCase())}</strong><span>${escapeHtml(x.message)} · ${escapeHtml(x.route)}</span></div>`).join('')}</div>`); return true; }
  if(action==='open-role-preview') { if(!canUseOwnerConsole(account))return showToast('Owner only','Role preview is an Owner diagnostic tool.'),true; openSimpleModal('Preview as Role',`<p>This is a safe visual preview mode—it does not submit work or change another user’s account.</p><div class="simple-modal-actions"><button class="btn secondary">Student preview</button><button class="btn secondary">Teacher preview</button><button class="btn secondary">Principal preview</button></div>`); return true; }
  if(action==='open-suspension-tools') { if(!canUseOwnerConsole(account))return showToast('Owner only','Account status controls require Owner access.'),true; openSimpleModal('Account Status Controls',`<p>Search/select a real account from Owner Console before changing access. No account is modified from this preview.</p><div class="simple-modal-actions"><button class="btn danger" disabled>Suspend selected account</button><button class="btn secondary" disabled>Restore selected account</button></div>`); return true; }
  if(action==='open-demo-school') { const d=buildDemoSchool('MathsExpress Demo School'); openSimpleModal('Demo School',`<p><b>${escapeHtml(d.name)}</b> includes ${d.classes.length} demo classes and ${d.staff.length} sample staff roles.</p><div class="simple-list">${d.classes.map(c=>`<div><strong>${escapeHtml(c.name)}</strong><span>${c.students.length} sample students</span></div>`).join('')}</div><p class="muted">Demo data is generated locally and does not create real student accounts.</p>`); return true; }
  if(action==='open-teacher-assistant') { const plan=buildLessonPlan({topic:'Quadratic equations',minutes:55,yearLevel:normaliseYearLevel(account.profile?.yearLevel),objective:'Solve and interpret quadratic equations using appropriate methods.'}); openSimpleModal('Teacher Assistant',`<p class="muted">Built into MathsExpress using the curriculum/question engine—no external AI provider is required for this planner.</p><h3>${escapeHtml(plan.topic)} · ${plan.minutes||55} minute lesson</h3><div class="simple-list">${plan.segments.map(x=>`<div><strong>${escapeHtml(x.name)}</strong><span>${x.minutes} min</span></div>`).join('')}</div><p><b>Homework:</b> 10 Core questions + 3 Extension questions from the matching textbook section.</p>`); return true; }
  if(action==='open-written-marking') { const a=lastTeacherReport?.assignments?.[0]; if(!a)return showToast('Open a class first','Written-answer marking now uses real assignment submissions and AI rationale.'); scorecardModal(a.id); return true; }
  if(action==='open-test-versions') { return completeAction('open-exam-pro'); }
  if(action==='open-photo-import') { openSimpleModal('Photo / Worksheet Import',`<p>Teacher-uploaded worksheets can be prepared for manual question extraction into MathsExpress. This build does not pretend OCR is perfect: the teacher reviews each imported question before saving it.</p><input type="file" accept="image/*,.pdf" disabled><p class="muted">File picking is disabled in this local preview; the question-builder workflow is ready for reviewed imports.</p>`); return true; }
  if(action==='open-handwriting-input') { openSimpleModal('Handwriting Maths Input',`<div class="geometry-grid" style="min-height:160px"></div><p>Handwriting-ready canvas area with a typed fallback:</p><input placeholder="Type the maths expression here…"><p class="muted">Automatic handwriting recognition requires a recognition model/provider and is not falsely marked as connected.</p>`); return true; }
  if(action==='open-diagram-builders') { openSimpleModal('Question Diagram Builders',`<div class="mode-cards"><article><h3>Graph builder</h3><p>Axes, points, lines and functions.</p></article><article><h3>Geometry builder</h3><p>Lengths, angles and labelled shapes.</p></article><article><h3>Table/data builder</h3><p>Rows, columns and datasets.</p></article><article><h3>Probability builder</h3><p>Tree/list/sample-space structures.</p></article></div>`); return true; }
  if(action==='open-function-sliders') { openSimpleModal('Function Sliders',`<p>Explore <b>y = ax² + bx + c</b></p><label>a <input type="range" min="-5" max="5" value="1"></label><label>b <input type="range" min="-10" max="10" value="0"></label><label>c <input type="range" min="-10" max="10" value="0"></label><div class="geometry-grid"></div><p class="muted">Use the existing graph workspace for exact plotting.</p>`); return true; }
  if(action==='open-probability-lab') { return completeAction('open-probability-sim'); }
  if(action==='open-data-spreadsheet') { const data=[12,15,17,17,18,20,21,24]; const mean=(data.reduce((a,b)=>a+b,0)/data.length).toFixed(2); openSimpleModal('Spreadsheet Statistics',`<table class="data-table"><thead><tr><th>Row</th><th>Value</th></tr></thead><tbody>${data.map((v,i)=>`<tr><td>${i+1}</td><td>${v}</td></tr>`).join('')}</tbody></table><p><b>Mean:</b> ${mean} · <b>Median:</b> 17.5 · <b>Range:</b> 12</p>`); return true; }
  if(action==='open-cas-workspace') { openSimpleModal('CAS-style Workspace',`<p>For supported school expressions:</p><div class="simple-list"><div><strong>Simplify</strong><span>2x + 3x → 5x</span></div><div><strong>Expand</strong><span>3(x + 4) → 3x + 12</span></div><div><strong>Evaluate</strong><span>x² + 2x at x=3 → 15</span></div></div><p class="muted">Teachers can disable this workspace for assessments.</p>`); return true; }
  if(action==='open-coordinate-editor') { openSimpleModal('Coordinate Editor',`<div class="geometry-grid"></div><div class="geometry-toolbar"><button class="btn ghost">Add point</button><button class="btn ghost">Draw line</button><button class="btn ghost">Add function</button><button class="btn ghost">Clear</button></div>`); return true; }
  if(action==='open-solution-methods') { openSimpleModal('Multiple Solution Methods',`<div class="mode-cards"><article><h3>Method 1 · Balance</h3><p>2x + 5 = 15 → 2x = 10 → x = 5</p></article><article><h3>Method 2 · Inverse operations</h3><p>Subtract 5, then divide by 2.</p></article></div>`); return true; }
  if(action==='open-dashboard-widgets') { const layout=buildDashboardLayout([{id:'assigned'},{id:'progress'},{id:'game-time'},{id:'recommended'},{id:'calendar'}]); persist({...state,dashboardLayout:layout},{quiet:true}); openSimpleModal('Dashboard Widgets',`<div class="attendance-list">${layout.map(x=>`<label><input type="checkbox" checked><span>${escapeHtml(x.id.replaceAll('-',' '))}</span><small>Order ${x.order+1}</small></label>`).join('')}</div><p>Widget preferences are saved to this account.</p>`); return true; }
  if(action==='open-language-tools') { openSimpleModal('Language & Translation',`<div class="simple-list"><div><strong>Spanish</strong><span>${escapeHtml(translateMathUi('Learn','es'))}</span></div><div><strong>French</strong><span>${escapeHtml(translateMathUi('Learn','fr'))}</span></div><div><strong>Hindi</strong><span>${escapeHtml(translateMathUi('Learn','hi'))}</span></div></div><p class="muted">Full textbook translation requires translated content packs; MathsExpress does not auto-claim translations it has not reviewed.</p>`); return true; }
  if(action==='open-screen-reader-tools') { openSimpleModal('Screen-reader Mode',`<p>MathsExpress uses native buttons/inputs, labelled navigation, keyboard focus and live status regions. This mode emphasises text labels and reduces decorative-only UI.</p><button class="btn primary" data-action="complete-toggle-screen-reader">Toggle screen-reader emphasis</button>`); return true; }
  if(action==='open-colourblind-tools') { openSimpleModal('Colour-blind-friendly Graphs',`<p>Graph series use labels, point shapes and line patterns so colour is not the only signal.</p><div class="geometry-grid"></div>`); return true; }
  if(action==='open-font-keyboard') { openSimpleModal('Font & Keyboard Controls',`<p>Large text, dyslexia-friendly text and keyboard-first navigation already live in Accessibility.</p><button class="btn secondary" data-action="tool-tab" data-tab="access">Open Accessibility</button>`); return true; }
  if(action==='open-game-schedule') { const g=buildGameSchedule(state.gameSchedule||{}); openSimpleModal('Game Time Schedule',`<div class="simple-list"><div><strong>Allowed days</strong><span>${escapeHtml(g.allowedDays.join(', '))}</span></div><div><strong>Time window</strong><span>${g.start}–${g.end}</span></div><div><strong>Daily cap</strong><span>${g.dailyCapMinutes} minutes</span></div></div><button class="btn primary" data-action="complete-save-game-schedule">Save example schedule</button>`); return true; }
  if(action==='open-duplicate-tools') { const original={id:'a1',title:'Year 9 Homework',classId:'c1'}; const copy=duplicateAssignment(original); openSimpleModal('Duplicate Classes & Assignments',`<p>Copies receive new IDs so results and submissions stay separate.</p><div class="simple-list"><div><strong>${escapeHtml(original.title)}</strong><span>${escapeHtml(original.id)}</span></div><div><strong>${escapeHtml(copy.title)}</strong><span>${escapeHtml(copy.id)}</span></div></div>`); return true; }
  if(action==='open-public-library') { return completeAction('open-resource-library'); }
  if(action==='open-resource-ratings') { openSimpleModal('Resource Ratings & Favourites',`<div class="simple-list"><div><strong>Year 9 Algebra Test</strong><span>★ 4.8 · Favourite</span></div><div><strong>Trigonometry Revision</strong><span>★ 4.6 · 128 saves</span></div></div>`); return true; }
  if(action==='open-teacher-folders') { openSimpleModal('Teacher Folders',`<div class="simple-list"><div><strong>Term 1</strong><span>Number & Algebra</span></div><div><strong>Term 2</strong><span>Measurement & Geometry</span></div><div><strong>Assessments</strong><span>Tests and exams</span></div></div>`); return true; }
  if(action==='open-inter-school') { openSimpleModal('Inter-school Competitions',`<p>Configure equal-year challenge events with shared question rules, integrity checks and school rankings.</p><div class="status-banner warning">Public/state-wide events should be moderated and scheduled by platform/school administrators.</div>`); return true; }
  if(action==='open-onboarding-tools') { const d=buildDemoSchool(); openSimpleModal('Onboarding & Sample Data',`<div class="mode-cards"><article><h3>Student tour</h3><p>Learn → Class → Textbook → Games.</p></article><article><h3>Teacher tour</h3><p>Create class → Assign → Reports → Live lesson.</p></article><article><h3>Principal tour</h3><p>School setup → Staff → Analytics → Controls.</p></article><article><h3>Demo data</h3><p>${d.classes.length} sample classes ready for preview.</p></article></div>`); return true; }
  return false;
}

function openSimpleModal(title, body, actions='') {
  const root=document.getElementById('modal-root'); if(!root)return;
  root.innerHTML=`<div class="modal-backdrop"><section class="ultimate-modal" role="dialog" aria-modal="true"><header><div><span class="eyebrow">MathsExpress</span><h2>${escapeHtml(title)}</h2></div><button class="owner-close" data-action="close-ultimate-modal">×</button></header><div class="ultimate-modal-body">${body}</div>${actions?`<footer>${actions}</footer>`:''}</section></div>`;
}

async function openLeadershipDashboard(kind='head') {
  const schoolId=selectedSchoolId||schoolHubSchools[0]?.id||teacherHubClasses[0]?.school_id||'';
  if(!schoolId) return showToast('Open a school first','Leadership dashboards need a school.');
  openSimpleModal(kind==='principal'?'Principal Dashboard':'Head Teacher Dashboard','<div class="school-loading"><span class="spinner"></span><strong>Loading live school data…</strong></div>');
  try {
    const school=getSchoolClient();
    const [dashboard,staff,students,classes]=await Promise.all([school.getSchoolDashboard(schoolId),school.listSchoolStaff(schoolId).catch(()=>[]),school.listSchoolStudents(schoolId).catch(()=>[]),school.listTeacherClasses().catch(()=>[])]);
    const schoolClasses=classes.filter(c=>String(c.school_id)===String(schoolId)&&!c.archived);
    const byYear=YEAR_LEVEL_OPTIONS.map(y=>({year:y.value,count:schoolClasses.filter(c=>Number(c.year_level)===y.value).length}));
    const roleCounts={}; for(const member of staff) roleCounts[member.staff_role]=(roleCounts[member.staff_role]||0)+1;
    const title=kind==='principal'?'Principal Dashboard':'Head Teacher Dashboard';
    const body=`<div class="leadership-summary"><div class="owner-analytics-strip large"><div><b>${Number(dashboard?.counts?.students??students.length)}</b><small>students</small></div><div><b>${Number(dashboard?.counts?.staff??staff.length)}</b><small>staff</small></div><div><b>${Number(dashboard?.counts?.classes??schoolClasses.length)}</b><small>classes</small></div><div><b>${Number(dashboard?.counts?.assignments??0)}</b><small>assignments</small></div></div><section class="calm-card"><span class="eyebrow">Curriculum coverage</span><h3>Classes by year</h3><div class="leadership-year-grid">${byYear.map(row=>`<div><strong>Year ${row.year}</strong><span>${row.count} class${row.count===1?'':'es'}</span></div>`).join('')}</div></section><section class="calm-card"><span class="eyebrow">Leadership</span><h3>Staff structure</h3><p>${Object.entries(roleCounts).map(([role,count])=>`${schoolRoleLabel(role)}: ${count}`).join(' · ')||'No staff roles loaded.'}</p></section><section class="calm-card"><span class="eyebrow">Next actions</span><div class="simple-modal-actions"><button class="btn secondary" data-route="teacher-hub">Open school reports</button><button class="btn secondary" data-action="open-interventions">Interventions</button><button class="btn secondary" data-action="open-class-heatmap">Class heatmap</button></div></section></div>`;
    openSimpleModal(title,body);
  } catch(error) { document.getElementById('modal-root').innerHTML=''; showToast('Dashboard unavailable',error.message||'Could not load school data.'); }
}

function aiChatStorageKey() {
  return `mathsexpress-ai-chat:${account.profile?.userId || 'guest'}`;
}

function aiChatContextStorageKey() {
  return `${aiChatStorageKey()}:context`;
}

function currentAiChatContextKey() {
  if (currentGeneratedTask?.current) {
    const run = currentGeneratedTask;
    const q = run.current || {};
    return `generated:${run.task?.id || 'task'}:${run.runSeed || run.startedAt || 'run'}:${run.index ?? 0}:${q.id || q.prompt || 'question'}`;
  }
  if (currentLesson?.current) {
    const run = currentLesson;
    const q = run.current || {};
    return `lesson:${run.lessonId || 'lesson'}:${run.runId || 'run'}:${run.currentIndex ?? 0}:${q.id || q.prompt || 'question'}`;
  }
  return `route:${routeFromHash().route || 'unknown'}:${routeFromHash().param || ''}`;
}

function clearAiChatHistoryForNewQuestion() {
  aiChatHistory = [];
  try {
    globalThis.localStorage?.removeItem(aiChatStorageKey());
    globalThis.localStorage?.removeItem(aiChatContextStorageKey());
  } catch {}
}

function syncAiChatWithCurrentQuestion() {
  const contextKey = currentAiChatContextKey();
  try {
    const savedContext = globalThis.localStorage?.getItem(aiChatContextStorageKey()) || '';
    if (savedContext !== contextKey) {
      aiChatHistory = [];
      globalThis.localStorage?.removeItem(aiChatStorageKey());
      globalThis.localStorage?.setItem(aiChatContextStorageKey(), contextKey);
      return true;
    }
  } catch {
    aiChatHistory = [];
  }
  return false;
}

function loadAiChatHistory() {
  try {
    const raw = globalThis.localStorage?.getItem(aiChatStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    aiChatHistory = Array.isArray(parsed) ? parsed.slice(-40) : [];
  } catch { aiChatHistory = []; }
  return aiChatHistory;
}

function saveAiChatHistory() {
  try { globalThis.localStorage?.setItem(aiChatStorageKey(), JSON.stringify(aiChatHistory.slice(-40))); } catch {}
}

function currentAiContext() {
  const q = currentGeneratedTask?.current || currentLesson?.current || null;
  const task = currentGeneratedTask?.task || null;
  const lesson = currentLesson?.lessonId ? getLessonById(currentLesson.lessonId) : null;
  const flags = normalizeFeatureFlags(state?.featureFlags || {});
  const tutorAllowed = flags.helper && activeSchoolAssignment?.tutorAllowed !== false;
  const testMode = Boolean(activeSchoolAssignment?.testMode);
  return buildBotContext({
    question:q,
    skill:task?.skill || lesson?.title || q?.topic || 'Mathematics',
    topic:task?.topic || q?.topic || lesson?.title || 'Mathematics',
    yearLevel:normaliseYearLevel(task?.yearLevel,normaliseYearLevel(account.profile?.yearLevel,state?.yearLevel)),
    difficulty:task?.difficulty || q?.difficulty || 'medium',
    attempts:currentGeneratedTask?.attempts || currentLesson?.attempts || 0,
    tutorAllowed,
    testMode,
    mistakes:currentMistakes(),
  });
}

function renderAiLatexLite(value, display=false) {
  let s=escapeHtml(String(value??'').trim());
  s=s.replace(/\\begin\{(?:aligned|align\*?|gathered|equation\*?)\}/g,'')
     .replace(/\\end\{(?:aligned|align\*?|gathered|equation\*?)\}/g,'')
     .replace(/&amp;(?==)/g,'')
     .replace(/\\left|\\right/g,'')
     .replace(/\\displaystyle/g,'');
  for(let i=0;i<5;i++){
    s=s.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,'<span class="mx-frac"><span class="mx-frac-num">$1</span><span class="mx-frac-den">$2</span></span>');
    s=s.replace(/\\sqrt\s*\{([^{}]+)\}/g,'<span class="mx-sqrt"><span class="mx-radical">√</span><span class="mx-radicand">$1</span></span>');
  }
  s=s.replace(/\\boxed\s*\{([^{}]+)\}/g,'<span class="mx-boxed">$1</span>')
     .replace(/\\text\s*\{([^{}]+)\}/g,'$1')
     .replace(/\\Longleftrightarrow/g,'⟺').replace(/\\Leftrightarrow/g,'⇔')
     .replace(/\\Longrightarrow/g,'⟹').replace(/\\Rightarrow/g,'⇒')
     .replace(/\\longrightarrow/g,'⟶').replace(/\\rightarrow/g,'→')
     .replace(/\\times/g,'×').replace(/\\cdot/g,'·').replace(/\\div/g,'÷')
     .replace(/\\pm/g,'±').replace(/\\approx/g,'≈').replace(/\\neq/g,'≠')
     .replace(/\\leq?/g,'≤').replace(/\\geq?/g,'≥')
     .replace(/\\pi/g,'π').replace(/\\theta/g,'θ').replace(/\\alpha/g,'α').replace(/\\beta/g,'β')
     .replace(/\\infty/g,'∞').replace(/\\degree/g,'°')
     .replace(/\\quad|\\qquad/g,'&nbsp;&nbsp;').replace(/\\[,;:!]/g,'')
     .replace(/\^\{([^{}]+)\}/g,'<sup>$1</sup>').replace(/\^([A-Za-z0-9.+-]+)/g,'<sup>$1</sup>')
     .replace(/_\{([^{}]+)\}/g,'<sub>$1</sub>').replace(/_([A-Za-z0-9.+-]+)/g,'<sub>$1</sub>')
     .replace(/\\\\/g,'<br>')
     .replace(/\\([A-Za-z]+)/g,'$1');
  return `<span class="${display?'ai-math-equation':'ai-math-inline'}">${s}</span>`;
}

function aiInlineMarkup(value) {
  return escapeHtml(String(value??''))
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/__([^_]+)__/g,'<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
}

function renderAiFormattedText(value) {
  let raw=String(value??'').replace(/\r\n?/g,'\n').trim();
  if(!raw) return '<p class="ai-response-paragraph">No response returned.</p>';
  const maths=[];
  const stash=(content,display)=>{ const key=`@@MXMATH${maths.length}@@`; maths.push({key,html:renderAiLatexLite(content,display)}); return key; };
  raw=raw.replace(/\\\[([\s\S]*?)\\\]/g,(_,m)=>`\n${stash(m,true)}\n`)
         .replace(/\$\$([\s\S]*?)\$\$/g,(_,m)=>`\n${stash(m,true)}\n`)
         .replace(/\\\(([\s\S]*?)\\\)/g,(_,m)=>stash(m,false));

  const lines=raw.split('\n');
  const out=[];
  let listType='';
  const closeList=()=>{ if(listType){out.push(`</${listType}>`);listType='';} };
  for(const original of lines){
    const line=original.trim();
    if(!line){closeList();continue;}
    if(/^@@MXMATH\d+@@$/.test(line)){closeList();out.push(`<div class="ai-math-display">${line}</div>`);continue;}
    const h=line.match(/^(#{1,3})\s+(.+)$/);
    if(h){closeList();const level=Math.min(4,h[1].length+2);out.push(`<h${level} class="ai-response-heading">${aiInlineMarkup(h[2])}</h${level}>`);continue;}
    const bullet=line.match(/^[-*•]\s+(.+)$/);
    if(bullet){if(listType!=='ul'){closeList();listType='ul';out.push('<ul class="ai-response-list">');}out.push(`<li>${aiInlineMarkup(bullet[1])}</li>`);continue;}
    const numbered=line.match(/^\d+[.)]\s+(.+)$/);
    if(numbered){if(listType!=='ol'){closeList();listType='ol';out.push('<ol class="ai-response-list numbered">');}out.push(`<li>${aiInlineMarkup(numbered[1])}</li>`);continue;}
    closeList();
    const plain=line.replace(/\*\*/g,'').trim();
    const final=/^(final answer|answer)\s*:/i.test(plain) || /^therefore[,\s]/i.test(plain);
    out.push(`<p class="ai-response-paragraph${final?' ai-final-answer':''}">${aiInlineMarkup(line)}</p>`);
  }
  closeList();
  let html=out.join('');
  for(const item of maths) html=html.split(item.key).join(item.html);
  return html;
}

function renderAiChatMessages() {
  return aiChatHistory.map((m)=>{
    const isUser=m.role==='user';
    const isError=Boolean(m.error);
    const body=isUser ? `<p>${mathHtml(m.text).replace(/\n/g,'<br>')}</p>` : `<div class="ai-response-body">${renderAiFormattedText(m.text)}</div>`;
    return `<div class="ai-chat-message ${isUser?'user':'assistant'}${isError?' ai-chat-error':''}"><div class="ai-chat-avatar">${isUser?'You':'AI'}</div><div class="ai-chat-bubble"><small>${isUser?'You':(isError?'Connection error':'MathsExpress AI')}</small>${body}</div></div>`;
  }).join('');
}

function renderAiThinking() {
  return `<div class="ai-chat-message assistant ai-thinking-message"><div class="ai-chat-avatar">AI</div><div class="ai-chat-bubble"><small>MathsExpress AI</small><div class="ai-thinking" aria-label="MathsExpress AI is thinking"><span></span><span></span><span></span><b>Thinking through your question…</b></div></div></div>`;
}

function aiContextForRequest(context) {
  return {
    prompt: context.prompt || '',
    // Deliberately do not send the expected answer or worked solution to the remote tutor.
    // The server only needs the current prompt plus safe strategy hints.
    hints: [],
    skill: context.skill || 'Mathematics',
    topic: context.topic || 'Mathematics',
    yearLevel: normaliseYearLevel(context.yearLevel),
    difficulty: context.difficulty || 'medium',
    attempts: Number(context.attempts || 0),
    tutorAllowed: context.tutorAllowed !== false,
    testMode: Boolean(context.testMode),
    assignmentId: activeSchoolAssignment?.id && !activeSchoolAssignment?.localOnly ? String(activeSchoolAssignment.id) : null,
    mistakes: Array.isArray(context.mistakes) ? context.mistakes.slice(0, 5) : [],
  };
}

function aiApiEndpoints() {
  if (globalThis.location?.protocol === 'file:') {
    return [
      'https://mathsexpress.netlify.app/api/ai',
      'https://mathsexpress.netlify.app/.netlify/functions/ai',
    ];
  }
  return ['/api/ai','/.netlify/functions/ai'];
}

async function fetchAiEndpoint(url, options={}, timeoutMs=20000) {
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try { return await fetch(url,{...options,signal:controller.signal}); }
  finally { clearTimeout(timer); }
}

async function probeAiHelperStatus() {
  const badge=document.getElementById('ai-service-status');
  if(!badge) return;
  for(const url of aiApiEndpoints()) {
    try {
      const aiToken=account.session?.access_token||accountClient.session?.access_token||'';
      const authHeader=aiToken?{'Authorization':`Bearer ${aiToken}`}:{ };
      const response=await fetchAiEndpoint(url,{method:'GET',headers:{'Accept':'application/json',...authHeader}},8000);
      if(response.status===404 || response.status===405) continue;
      const data=await response.json().catch(()=>({}));
      if(response.ok && data?.configured===true){ badge.textContent='AI online'; badge.className='ai-ready-pill'; return; }
      if(response.ok && data?.configured===false){ badge.textContent='Needs Groq key'; badge.className='ai-lock-pill'; return; }
    } catch {}
  }
  badge.textContent='AI offline';
  badge.className='ai-lock-pill';
}

async function requestSmartAiReply(message, context) {
  let lastError=null;
  const payload=JSON.stringify({
    message,
    context: aiContextForRequest(context),
    history: aiChatHistory.slice(-12).filter(m=>m.role==='user'||m.role==='assistant').map((m)=>({ role:m.role, text:String(m.text||'').slice(0,1800) })),
  });
  for(const url of aiApiEndpoints()) {
    try {
      const aiToken=account.session?.access_token||accountClient.session?.access_token||'';
      const authHeader=aiToken?{'Authorization':`Bearer ${aiToken}`}:{ };
      const response=await fetchAiEndpoint(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...authHeader},body:payload},25000);
      if(response.status===404 || response.status===405){ lastError=new Error('AI endpoint was not found on this deployment.'); continue; }
      const data=await response.json().catch(()=>({}));
      if(!response.ok || !data?.text) throw new Error(data?.error || `AI request failed (${response.status}).`);
      return { text:String(data.text).slice(0,5000), intent:String(data.intent||'smart-ai'), model:String(data.model||'') };
    } catch(error) {
      lastError=error?.name==='AbortError' ? new Error('The AI request timed out. Please try again.') : error;
      if(/not configured|Groq key|401|invalid api key/i.test(String(lastError?.message||''))) break;
    }
  }
  throw lastError || new Error('The AI service could not be reached.');
}

function guardAiTutorReply(text, context={}) {
  const raw=String(text||'').trim();
  if(!raw || !context?.prompt) return raw;
  const explicitAnswerLanguage=/(?:final\s+answer|the\s+answer\s+is|answer\s*[:=]|therefore\s+(?:x|y|the answer)|so\s+(?:x|y)\s*=|hence\s+(?:x|y)?\s*=)/i.test(raw);
  const expectedRaw=Array.isArray(context.answer)?context.answer.join(', '):(context.answer&&typeof context.answer==='object'?Object.values(context.answer).join(', '):String(context.answer??''));
  const expected=expectedRaw.trim();
  let expectedLeak=false;
  if(expected){
    const escaped=expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const boundary=new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,'i');
    expectedLeak=boundary.test(raw) && (raw.length<100 || /(?:answer|therefore|hence|so|equals|=)/i.test(raw));
  }
  if(!explicitAnswerLanguage && !expectedLeak) return raw;
  const hints=Array.isArray(context.hints)?context.hints.filter(Boolean):[];
  const hint=hints[Math.min(Math.max(0,Number(context.attempts)||0),Math.max(0,hints.length-1))] || 'Identify the operation or rule that should come next, then do only that one step.';
  return `I’ll keep this hint-first so you still solve the current question yourself.\n\nNext step: ${hint}\n\nTry that step and send me your working. I can check it without revealing the final answer.`;
}


function openAiHelperModal() {
  const flags=normalizeFeatureFlags(state?.featureFlags||{});
  if(!flags.helper) return showToast('AI Helper disabled','Your school has turned the MathsExpress helper off.');
  syncAiChatWithCurrentQuestion();
  loadAiChatHistory();
  const context=currentAiContext();
  if(!aiChatHistory.length){ aiChatHistory=[]; }
  const contextLabel=context.prompt?`Current question: ${context.prompt}`:`Current focus: ${context.topic}`;
  openSimpleModal('MathsExpress AI Helper',`<div class="ai-helper-shell">
    <div class="ai-context-strip"><span>AI</span><div><strong>${escapeHtml(context.topic)}</strong><small>${escapeHtml(contextLabel)}</small></div>${context.testMode||!context.tutorAllowed?'<b class="ai-lock-pill">Locked for test</b>':'<b id="ai-service-status" class="ai-ready-pill">Checking AI…</b>'}</div>
    <div id="ai-chat-log" class="ai-chat-log" aria-live="polite">${renderAiChatMessages()}</div>
    <div class="ai-suggestion-row">
      ${['Help me start','Give me one hint','Explain the method more simply','Show a similar example','Check my working','Make a 5-question revision quiz'].map(text=>`<button class="ai-suggestion" type="button" data-action="ai-helper-chip" data-message="${escapeHtml(text)}">${escapeHtml(text)}</button>`).join('')}
    </div>
    <div class="ai-chat-compose"><textarea id="ai-helper-input" rows="2" maxlength="1200" placeholder="Ask a maths question, paste your working, or say what you don’t understand..."></textarea><button class="btn primary" type="button" data-action="ai-helper-send">Send</button></div>
    <div class="ai-helper-footer"><small>Hint-first tutor mode: the AI guides one step at a time and does not give the final answer to the current question. It stays locked when a teacher disables it for a test.</small><button class="btn ghost small" type="button" data-action="ai-helper-clear">Clear chat</button></div>
  </div>`);
  setTimeout(()=>{const log=document.getElementById('ai-chat-log');if(log)log.scrollTop=log.scrollHeight;document.getElementById('ai-helper-input')?.focus();if(!context.testMode&&context.tutorAllowed)probeAiHelperStatus();},0);
}

async function sendAiHelperMessage(message) {
  const text=String(message||'').trim().slice(0,1200);
  if(!text) return;
  const context=currentAiContext();
  if(!context.tutorAllowed || context.testMode) return showToast('AI Helper locked','Your teacher has disabled the helper for this assessment.');
  aiChatHistory.push({role:'user',text,at:new Date().toISOString()});
  aiChatHistory=aiChatHistory.slice(-40);
  saveAiChatHistory();
  const input=document.getElementById('ai-helper-input');
  if(input){ input.value=''; input.disabled=true; }
  const sendButton=document.querySelector('[data-action="ai-helper-send"]');
  if(sendButton){ sendButton.disabled=true; sendButton.textContent='Thinking…'; }
  const log=document.getElementById('ai-chat-log');
  if(log){ log.innerHTML=renderAiChatMessages()+renderAiThinking(); log.scrollTop=log.scrollHeight; }

  let reply;
  try {
    if(globalThis.location?.protocol==='file:'){
      const mode=/similar example/i.test(text)?'example':/check|mistake|working/i.test(text)?'mistake':/explain|method|simply/i.test(text)?'explain':'hint';
      reply={text:tutorResponse({prompt:context.prompt||text,hint:(context.hints||[])[Math.min(Number(context.attempts)||0,Math.max(0,(context.hints||[]).length-1))]||'',solution:'',mode}),intent:'offline-tutor',model:'built-in'};
    }else{
      reply=await requestSmartAiReply(text,context);
    }
  } catch(error) {
    const detail=String(error?.message||'Groq could not answer right now. Please try again.');
    let friendly=detail;
    if(/not configured|Groq key/i.test(detail)) friendly='The live AI key is not configured on this deployment. Add GROQ_API_KEY to your hosting environment, redeploy, then try again.';
    else if(/timed out/i.test(detail)) friendly='The AI took too long to respond. Try sending the question again.';
    else if(globalThis.location?.protocol==='file:' && /fetch|network|reach/i.test(detail)) friendly='This downloaded copy could not reach the live AI server. Deploy the latest build to Netlify, then try again.';
    const mode=/similar example/i.test(text)?'example':/check|mistake|working/i.test(text)?'mistake':/explain|method|simply/i.test(text)?'explain':'hint';
    const fallback=tutorResponse({prompt:context.prompt||text,hint:(context.hints||[])[Math.min(Number(context.attempts)||0,Math.max(0,(context.hints||[]).length-1))]||'',solution:'',mode});
    friendly=`${fallback}

Offline helper: the live AI service is unavailable right now, so MathsExpress used its built-in maths tutor.`;
    aiChatHistory.push({role:'assistant',text:friendly,error:false,offline:true,at:new Date().toISOString()});
    aiChatHistory=aiChatHistory.slice(-40);
    saveAiChatHistory();
    if(input){ input.disabled=false; input.focus(); }
    if(sendButton){ sendButton.disabled=false; sendButton.textContent='Send'; }
    if(log){ log.innerHTML=renderAiChatMessages(); log.scrollTop=log.scrollHeight; }
    showToast('AI unavailable', friendly);
    probeAiHelperStatus();
    return;
  }

  const protectedReply=guardAiTutorReply(reply.text,context);
  aiChatHistory.push({role:'assistant',text:protectedReply,at:new Date().toISOString()});
  aiChatHistory=aiChatHistory.slice(-40);
  saveAiChatHistory();
  if(log){log.innerHTML=renderAiChatMessages();log.scrollTop=log.scrollHeight;}
  if(input){ input.disabled=false; input.focus(); }
  if(sendButton){ sendButton.disabled=false; sendButton.textContent='Send'; }
  trackActivityEvent('ai-helper-message','learning','use-ai-helper',{intent:reply.intent,topic:context.topic}).catch?.(()=>{});
  if(account.authenticated && (activeSchoolAssignment?.id || selectedTeacherClassId)) {
    getSchoolClient().saveTutorChat({classId:selectedTeacherClassId||null,assignmentId:activeSchoolAssignment?.id||null,questionId:currentGeneratedTask?.current?.id||currentLesson?.current?.id||null,messages:aiChatHistory.slice(-12),moderationState:'ok',seriousEvent:false}).catch(()=>{});
  }
}

function openTutorModal() { return openAiHelperModal(); }

function openWorkspaceModal() {
  openSimpleModal('Working-Out Space',`<div class="workspace-grid"><section><label>Scratchpad<textarea id="working-pad" rows="12" placeholder="Write your working here..."></textarea></label><div class="equation-keyboard">${['+','−','×','÷','=','x','x²','√','π','≤','≥','(',')','/'].map(k=>`<button type="button" data-action="equation-key" data-key="${escapeHtml(k)}">${escapeHtml(k)}</button>`).join('')}</div></section><section><div class="graph-toolbar"><strong>Coordinate graph</strong><button class="btn ghost small" data-action="graph-clear">Clear</button></div><div class="graph-function-row"><label>Plot y = <input id="graph-expression" value="${escapeHtml(graphExpression)}" placeholder="e.g. x² - 4"></label><button class="btn secondary small" type="button" data-action="graph-plot-expression">Plot</button></div><canvas id="workspace-graph" width="500" height="360" aria-label="Coordinate graph"></canvas><p class="muted">Plot an equation or click the graph to add your own points. Supported functions: sin, cos, tan, sqrt and abs.</p></section></div>`);
  setTimeout(drawWorkspaceGraph,0);
}

function graphFunction(expression){
  const raw=String(expression||'').trim().toLowerCase();
  if(!raw) return null;
  if(!/^[0-9x+\-*/().,^ a-z]+$/.test(raw)) throw new Error('Use numbers, x, brackets and normal maths operators only.');
  const identifiers=(raw.match(/[a-z]+/g)||[]);
  if(identifiers.some(id=>!['x','sin','cos','tan','sqrt','abs','pi'].includes(id))) throw new Error('That graph function is not supported.');
  // Validate without code generation. Trig graph functions use radians.
  globalThis.MXSafeMath?.evaluate?.(raw,{x:0},{angleMode:'rad'});
  return (x)=>{try{const y=Number(globalThis.MXSafeMath?.evaluate?.(raw,{x:Number(x)},{angleMode:'rad'}));return Number.isFinite(y)?y:null;}catch{return null;}};
}

function drawWorkspaceGraph(){
  const c=document.getElementById('workspace-graph');if(!c)return;const ctx=c.getContext('2d');const w=c.width,h=c.height;ctx.clearRect(0,0,w,h);
  const scale=25;
  ctx.strokeStyle='#d5cab8';ctx.lineWidth=1;for(let x=0;x<=w;x+=scale){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<=h;y+=scale){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  ctx.strokeStyle='#544b3f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  if(graphExpression){try{const fn=graphFunction(graphExpression);if(fn){ctx.strokeStyle='#6f8152';ctx.lineWidth=3;ctx.beginPath();let drawing=false;for(let px=0;px<=w;px++){const x=(px-w/2)/scale;const y=fn(x);const py=h/2-y*scale;if(y===null||py<-h||py>h*2){drawing=false;continue;}if(!drawing){ctx.moveTo(px,py);drawing=true;}else ctx.lineTo(px,py);}ctx.stroke();}}catch{}}
  ctx.fillStyle='#6f8152';for(const p of graphPoints){ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();}
}

function openTestGenerator(exam=false){
  openSimpleModal(exam?'Exam Mode Generator':'Test Generator',`<form id="assessment-generator-form" class="school-form"><label>Title<input name="title" value="${exam?yearLabel(account.profile?.yearLevel)+' Practice Exam':'Generated Maths Test'}"></label><div class="form-two"><label>Questions<select name="count"><option>10</option><option>15</option><option>20</option><option>30</option></select></label><label>Difficulty<select name="difficulty"><option value="mixed">Mixed</option><option>easy</option><option>medium</option><option>hard</option></select></label></div><div class="form-two"><label>Calculator<select name="calculator"><option value="teacher-choice">Teacher choice</option><option value="none">No calculator</option><option value="basic">Basic</option><option value="scientific">Scientific</option></select></label><label>Time limit (minutes)<input type="number" name="timeLimit" min="5" max="180" value="${exam?60:30}"></label></div><input type="hidden" name="exam" value="${exam?'1':'0'}"><button class="btn primary" type="submit">Generate ${exam?'exam':'test'}</button></form><div id="assessment-preview"></div>`);
}

function openQuestionBuilder(){openSimpleModal('Question Builder',`<form id="custom-question-form" class="school-form"><label>Question type<select name="type"><option value="numeric">Numeric / fraction</option><option value="multiple-choice">Multiple choice</option><option value="algebra">Algebraic expression</option><option value="coordinate">Coordinate pair</option><option value="graph-point">Plot a point on a graph</option><option value="number-line">Number line</option><option value="table-entry">Table / data entry</option><option value="matching">Matching</option><option value="drag-drop">Drag-and-drop ordering</option><option value="multi-part">Multi-part response</option><option value="written-response">Written reasoning</option><option value="proof">Proof / justification</option></select></label><label>Prompt<textarea name="prompt" required rows="4"></textarea></label><label>Answer / marking note<input name="answer" required></label><label>Topic<input name="topic" value="Mathematics"></label><p class="muted">Interactive types can be refined in the question bank after saving. MathsExpress stores the selected response type so assignments can render the matching control.</p><button class="btn primary" type="submit">Save question</button></form>`);}

function goalMetricLabel(g){ if(g.metric==='questions')return 'Auto-tracked · questions answered'; if(g.metric==='streak')return 'Auto-tracked · day streak'; return 'Manual goal'; }
function openGoalsModal(){const goals=syncGoalsAutoProgress();openSimpleModal('Student Goals',`<form id="goal-form" class="school-form"><label>Goal<input name="title" placeholder="e.g. Answer 100 questions" required></label><div class="form-two"><label>Target<input name="target" type="number" min="1" max="100000" value="100"></label><label>Due date<input name="dueDate" type="date"></label></div><label>Track<select name="metric"><option value="questions">Auto-track · questions answered</option><option value="streak">Auto-track · day streak</option><option value="custom">Manual (I'll update it myself)</option></select></label><button class="btn primary" type="submit">Add goal</button></form><div class="goal-list">${goals.map(g=>`<article><div><strong>${escapeHtml(g.title)}</strong><small>${g.progress}/${g.target}${g.dueDate?' · due '+escapeHtml(g.dueDate):''} · ${escapeHtml(goalMetricLabel(g))}</small></div><progress max="${g.target}" value="${g.progress}"></progress>${g.metric==='custom'||!g.metric?`<button class="btn ghost small" data-action="goal-progress" data-goal-id="${escapeHtml(g.id)}">+1</button>`:g.completed?'<span class="goal-complete-chip">✓ Complete</span>':''}</article>`).join('')||'<div class="school-empty">No goals yet.</div>'}</div>`);}

function openMistakesModal(){const mistakes=currentMistakes();openSimpleModal('Mistake Book',mistakes.length?`<div class="mistake-list">${mistakes.slice(0,30).map(m=>`<article><span>${m.count}×</span><div><strong>${escapeHtml(m.skill)}</strong><p>${mathHtml(m.prompt)}</p></div></article>`).join('')}</div>`:'<div class="school-empty">No unresolved mistakes yet. Wrong answers will appear here automatically.</div>');}

function resetReadAloudButton(){
  if(readAloudButtonEl){ readAloudButtonEl.textContent=readAloudButtonEl.dataset.idleLabel||'🔊 Read aloud'; readAloudButtonEl.classList.remove('reading'); }
  readAloudButtonEl=null;
}
function readText(text,buttonEl=null){
  if(!('speechSynthesis' in globalThis))return showToast('Read aloud unavailable','This browser does not expose speech synthesis.');
  const wasReadingSameButton=buttonEl && readAloudButtonEl===buttonEl && (globalThis.speechSynthesis.speaking||globalThis.speechSynthesis.pending);
  globalThis.speechSynthesis.cancel();
  resetReadAloudButton();
  if(wasReadingSameButton) return;
  const u=new SpeechSynthesisUtterance(String(text||''));
  u.onend=resetReadAloudButton;
  u.onerror=resetReadAloudButton;
  if(buttonEl){
    if(!buttonEl.dataset.idleLabel) buttonEl.dataset.idleLabel=buttonEl.textContent;
    buttonEl.textContent='⏹ Stop reading';
    buttonEl.classList.add('reading');
    readAloudButtonEl=buttonEl;
  }
  globalThis.speechSynthesis.speak(u);
}


function homeDueLabel(value){
  if(!value)return 'No due date';
  const due=new Date(value);if(Number.isNaN(due.getTime()))return 'No due date';
  const days=Math.ceil((due.getTime()-Date.now())/86400000);
  if(days<0)return `${Math.abs(days)}d overdue`;
  if(days===0)return 'Due today';
  if(days===1)return 'Due tomorrow';
  return `Due in ${days}d`;
}

function schoolAssignmentStartButton(a,label='Start task'){
  const due=a._effectiveDue||a.due_at||'';
  return `<button class="btn primary small" data-action="start-school-assignment" data-assignment-id="${escapeHtml(a.id)}" data-class-id="${escapeHtml(a.class_id || a.classId || '')}" data-assignment-title="${escapeHtml(a.title||'Assigned work')}" data-class-name="${escapeHtml(a.class_name||'MathsExpress class')}" data-due-at="${escapeHtml(due)}" data-lesson-id="${escapeHtml(a.lesson_id || '')}" data-task-id="${escapeHtml(a.config?.task_library_id || '')}" data-test-mode="${a.test_mode?'1':'0'}" data-tutor-allowed="${a.tutor_allowed===false?'0':'1'}" data-hints-allowed="${a.hints_allowed===false?'0':'1'}" data-calculator-enabled="${a.calculator_enabled===false?'0':'1'}" data-videos-allowed="${a.videos_allowed===false?'0':'1'}" data-time-limit="${Number(a.time_limit_minutes)||0}" data-start-at="${escapeHtml(a._effectiveStart||a.start_at||a.config?.start_at||'')}" data-exact-start="${a.config?.exact_scheduled_start?'1':'0'}" data-games-locked="${a.config?.games_locked?'1':'0'}" data-focus-required="${a.config?.focus_required?'1':'0'}">${escapeHtml(label)}</button>`;
}

function homeAssignedTaskCard(raw){
  const a=effectiveStudentAssignment(raw);
  const complete=a._effectiveStatus==='completed';
  const scheduled=a._effectiveStatus==='scheduled';
  const test=Boolean(a.test_mode||a.assignment_type==='test');
  const due=a._effectiveDue||a.due_at||'';
  const status=complete?'Completed':scheduled?'Scheduled':homeDueLabel(due);
  const lockedResult=Boolean(test&&complete&&a.results_released===false);
  const action=complete
    ? lockedResult?`<span class="mx-home-result-lock">Results locked</span>`:`<div class="mx-home-task-actions">${schoolAssignmentStartButton(a,'Retry')}<button class="btn ghost small" data-route="student-hub">Result</button></div>`
    : scheduled
      ? `<button class="btn secondary small" disabled>Opens ${escapeHtml(formatSchoolDate(a._effectiveStart))}</button>`
      : schoolAssignmentStartButton(a,'Start');
  const kind=test?'Test':escapeHtml(a.assignment_type||'Practice');
  const visual=test?'T':'∑';
  return `<article class="home-assigned-task-card mx-home-task-card ${test?'test':''} ${complete?'complete':''}">
    <div class="mx-home-task-visual" aria-hidden="true"><span>${visual}</span></div>
    <div class="mx-home-task-meta"><span class="mx-home-task-type">${kind}</span><span class="mx-home-task-due ${/overdue/i.test(status)?'overdue':''}">${escapeHtml(status)}</span></div>
    <h3>${escapeHtml(a.title||'Assigned maths')}</h3>
    <p>${escapeHtml(a.class_name||'MathsExpress class')} · ${Number(a.question_count)||10} questions</p>
    <div class="mx-home-task-footer"><span class="mx-home-task-reward">+100 <b>coins</b></span><div class="mx-home-task-action">${action}</div></div>
  </article>`;
}
async function hydrateHomeAssignedTasks(){
  const mount=document.getElementById('home-assigned-tasks-body');
  if(!mount || !account.authenticated) return;
  if(account.profile?.role!=='player'){
    mount.innerHTML=`<div class="home-admin-shortcuts"><div><strong>${escapeHtml(platformRoleLabel(account.profile?.role))} workspace</strong><span>Student assignments do not appear on admin accounts.</span></div><button class="btn primary small" data-route="teacher-hub">Open School tools</button></div>`;
    return;
  }
  try{
    const rows=(await getSchoolClient().listStudentAssignments()).map(effectiveStudentAssignment);
    if(routeFromHash().route!=='home')return;
    const active=rows.filter(a=>!['completed','overdue'].includes(a._effectiveStatus)).sort((a,b)=>String(a._effectiveDue||'9999').localeCompare(String(b._effectiveDue||'9999')));
    const done=rows.filter(a=>a._effectiveStatus==='completed').sort((a,b)=>String(b.completed_at||b.updated_at||'').localeCompare(String(a.completed_at||a.updated_at||'')));
    const show=[...active,...done].slice(0,3);
    mount.innerHTML=show.length?`<div class="home-assigned-task-grid">${show.map(homeAssignedTaskCard).join('')}</div>`:'<div class="school-empty">No class tasks right now. Your teacher’s next task will appear here.</div>';
  }catch(error){mount.innerHTML='<div class="school-empty">Class tasks will appear here when connected to your school account.</div>';}
}

async function completeSchoolAssignmentAndReward(snapshot,payload){
  const school=getSchoolClient();
  let syncedCompletion=true;
  try{
    await school.completeAssignment(snapshot.id,payload);
  }catch(error){
    const message=String(error?.message||'');
    if(snapshot?.unlimitedRetry && /attempt|completed|active assignment|start assignment|no.*attempt/i.test(message)) syncedCompletion=false;
    else throw error;
  }
  // A retry must never pay the completion reward twice. The server claim is already
  // idempotent, and local-only compatibility retries skip the claim entirely.
  if(!syncedCompletion || snapshot?.unlimitedRetry) return 0;
  let reward=0;
  try{
    const claim=await school.claimAssignmentCompletionReward(snapshot.id);
    reward=Number(claim?.reward_coins)||0;
    if(Number.isFinite(Number(claim?.coins))) persist({...state,coins:Number(claim.coins)},{quiet:true});
    else if(reward>0) persist({...state,coins:(Number(state.coins)||0)+reward},{quiet:true});
  }catch{}
  return reward;
}

function renderHome() {
  const view = document.getElementById('app-view');
  const m = buildDashboardModel(state);
  const homeYear = normaliseYearLevel(account.profile?.yearLevel);
  const homePath = learningPathRows(homeYear);
  const rec = recommendedLearningPathSkill() || homePath[0] || null;
  const recommendations = homePath.filter((skill)=>skill.unlocked && (!rec || skill.id!==rec.id)).sort((a,b)=>a.mastery-b.mastery).slice(0,2);
  const practiceTiles=[rec,...recommendations].filter(Boolean).slice(0,3);
  const firstName=String(state.playerName||account.profile?.displayName||'Student').trim().split(/\s+/)[0]||'Student';
  const weeklyTarget=Math.max(1,Number(state.weeklyGoalQuestions)||30);
  const weeklyDone=Math.max(0,Number(state.weeklyQuestionsCompleted)||0);
  const weeklyPct=Math.min(100,Math.round((weeklyDone/weeklyTarget)*100));
  const challengeTarget=Math.max(10,Math.min(weeklyTarget,30));
  const challengeDone=Math.min(challengeTarget,weeklyDone);
  const practiceGlyphs=['x²','π','∠'];
  view.innerHTML = `
    <div class="page minimal-home mx-home-dashboard-v105">
      ${state.ownerSettings?.maintenanceMode?`<div class="maintenance-banner"><strong>Maintenance mode</strong><span>${escapeHtml(state.ownerSettings?.maintenanceMessage||'MathsExpress is being updated.')}</span></div>`:''}

      <section class="mx-home-hero" aria-label="Learning summary">
        <div class="mx-home-hero-copy">
          <span class="mx-home-kicker">${escapeHtml(yearLabel(homeYear))}</span>
          <h1>A fresh start and big wins ahead, ${escapeHtml(firstName)}.</h1>
          <div class="mx-home-hero-progress" aria-label="Weekly question progress"><i style="width:${weeklyPct}%"></i></div>
          <div class="mx-home-hero-progress-row"><span><b>${weeklyDone}</b> of ${weeklyTarget} questions this week</span><span>${weeklyPct}%</span></div>
        </div>
        <div class="mx-home-hero-mascot">${cloveHtml('encourage','')}</div>
        <div class="mx-home-hero-streak"><strong>${m.streak}</strong><span>day streak</span></div>
      </section>

      <div class="mx-home-board">
        <main class="mx-home-main-column">
          <section class="mx-home-panel mx-home-assigned-panel">
            <div class="mx-home-panel-head">
              <div><span class="mx-home-kicker">Next up</span><h2>Your assigned tasks</h2></div>
              <button class="mx-home-link" data-route="student-hub">View all</button>
            </div>
            <div id="home-assigned-tasks-body"><div class="school-loading compact"><span class="spinner"></span><strong>Loading tasks…</strong></div></div>
          </section>

          <section class="mx-home-panel mx-home-practice-panel">
            <div class="mx-home-panel-head">
              <div><span class="mx-home-kicker">Recommended</span><h2>Your practice</h2></div>
              <button class="mx-home-pill-link" data-route="learning-path">Skills map</button>
            </div>
            <div class="mx-home-practice-grid">
              ${practiceTiles.map((skill,index)=>`<button class="mx-home-practice-card" data-action="start-path-skill" data-skill-id="${escapeHtml(skill.id)}" data-skill-year="${skill.yearLevel}">
                <div class="mx-home-practice-art art-${index%3}" aria-hidden="true"><span>${practiceGlyphs[index%practiceGlyphs.length]}</span></div>
                <div class="mx-home-practice-copy"><strong>${escapeHtml(skill.title||skill.skill||'Maths practice')}</strong><small>${Math.round(skill.mastery||0)}% mastery · ${escapeHtml(skill.strand||'Mathematics')}</small></div>
                <div class="mx-home-mastery"><i style="width:${Math.min(100,Math.max(0,Math.round(skill.mastery||0)))}%"></i></div>
              </button>`).join('') || `<button class="mx-home-practice-card empty" data-route="learn"><div class="mx-home-practice-art"><span>+</span></div><div class="mx-home-practice-copy"><strong>Choose your first skill</strong><small>Explore ${escapeHtml(yearLabel(homeYear))} maths.</small></div></button>`}
            </div>
          </section>
        </main>

        <aside class="mx-home-side-column" aria-label="Student shortcuts">
          <section class="mx-home-side-card mx-home-leaderboard-card">
            <div class="mx-home-side-head"><span>Leaderboard</span><button data-route="elo" aria-label="Open ELO leaderboard">↗</button></div>
            <div id="home-class-champion" class="mx-home-champion-loading"><span class="spinner"></span><small>Loading class ranking…</small></div>
          </section>

          <section class="mx-home-side-card mx-home-shop-card">
            <div class="mx-home-side-head"><span>Shop</span><strong>${m.coins}</strong></div>
            <p>Use your coins to customise MathsExpress.</p>
            <button class="mx-home-side-action" data-route="shop">Go to Shop</button>
          </section>

          <section class="mx-home-side-card mx-home-challenge-card">
            <div class="mx-home-side-head"><span>Challenge</span><small>Weekly</small></div>
            <strong class="mx-home-challenge-title">Complete ${challengeTarget} questions</strong>
            <div class="mx-home-mini-progress"><i style="width:${Math.round((challengeDone/challengeTarget)*100)}%"></i></div>
            <div class="mx-home-side-meta"><span>${challengeDone}/${challengeTarget}</span><button data-route="challenges">View</button></div>
          </section>

          <section class="mx-home-side-card mx-home-games-card">
            <div class="mx-home-side-head"><span>Game Time</span><strong>${formatGameTime(state.gameTimeSeconds)}</strong></div>
            <p>Earn more by answering maths questions.</p>
            <button class="mx-home-side-action" data-route="games">Open games</button>
          </section>
        </aside>
      </div>

      ${canUseTeacherHub(account)?`<div class="mx-home-admin-row"><span>${escapeHtml(platformRoleLabel(account.profile?.role))} tools</span><button class="mx-home-link" data-route="teacher-hub">Open School tools →</button></div>`:''}
    </div>`;
  void hydrateHomeAssignedTasks();
  void refreshHomeEloChampion();
}
function renderLearn() {
  const view = document.getElementById('app-view');
  const profileYear = normaliseYearLevel(account.profile?.yearLevel);
  const canBrowseAllYears = canUseTeacherHub(account);
  if (!canBrowseAllYears) learnYearLevel = profileYear;
  else if (!Number.isInteger(learnYearLevel) || learnYearLevel < 0 || learnYearLevel > 12) learnYearLevel = profileYear;
  const skills = getCurriculumSkills({ yearLevel: learnYearLevel });
  const strands = [...new Set(skills.map((item) => item.strand))];

  const pathRows=learningPathRows(learnYearLevel);
  const recPool=shuffledRecommendations(pathRows);
  const recommended=(learnYearLevel===profileYear && recommendationCategory==='smart' && !recommendationShuffleSeed?recommendedLearningPathSkill():null) || recPool[0] || null;
  const nextTwo=recPool.filter(x=>(!recommended || x.id!==recommended.id)).slice(0,2);
  const dueReview=(state.spacedReviews||[]).find(r=>!r.done && (!r.date || r.date<=localDateString()));
  view.innerHTML = `
    <div class="page curriculum-learn-page minimal-learn-page">
      <div class="page-head curriculum-head">
        <div><span class="eyebrow">K–12 Mathematics</span><h1>Learn</h1>${cloveHtml('pencil')}<p>Start with your recommendation, use a quick check, or browse the full curriculum.</p></div>
        <div class="curriculum-count"><strong>${CURRICULUM.length}</strong><span>K–12 skills</span></div>
      </div>
      ${skillFocusHtml()}
      <section class="recommendation-control-bar"><div><strong>Recommendations</strong><span>Choose a skill from your year level.</span></div><div class="recommendation-chip-row">${[['smart','Smart'],['ready','Ready to learn'],['almost','Almost mastered'],['recent','Worked recently']].map(([id,label])=>`<button class="${recommendationCategory===id?'active':''}" data-action="recommendation-category" data-category="${id}">${label}</button>`).join('')}<button data-action="shuffle-recommendations" ${recPool.length<2?'disabled title="More matching skills are needed to shuffle"':''}>Shuffle ↻</button></div></section>
      <section class="learn-recommended-panel">
        <div class="learn-recommended-main">
          <span class="eyebrow">Recommended next</span>
          <h2>${escapeHtml(recommended?.title||recommended?.skill||'Choose a skill')}</h2>
          <p>${recommended?`${Math.round(recommended.mastery||0)}% mastery · ${escapeHtml(recommended.strand||'Mathematics')} · ${escapeHtml(yearLabel(recommended.yearLevel))}`:'No skills match this filter yet. Try Smart or Ready to learn.'}</p>
          <div class="simple-actions"><button class="btn primary" data-action="start-path-skill" data-skill-id="${escapeHtml(recommended?.id||'')}" data-skill-year="${recommended?.yearLevel??learnYearLevel}" ${recommended?'':'disabled'}>Start recommended</button><button class="btn secondary" data-action="start-daily-practice">Daily 5</button></div>
        </div>
        <div class="learn-recommended-grid">
          <button data-action="start-path-skill" data-skill-id="${escapeHtml(recommended?.id||'')}" data-skill-year="${recommended?.yearLevel??learnYearLevel}" ${recommended?'':'disabled'}><strong>Recommended practice</strong><small>Best next skill for you</small></button>
          <button data-action="start-adaptive-practice"><strong>Self-directed adaptive</strong><small>Difficulty changes with you</small></button>
          <button data-action="open-topic-readiness"><strong>Topic readiness</strong><small>Check prerequisites first</small></button>
          <button data-action="start-recurring-skill-checkin"><strong>Skills Check-In</strong><small>5-question adaptive check</small></button>
          <button data-action="open-discovery-checkin"><strong>Discovery check</strong><small>Find strengths and gaps</small></button>
          <button data-action="start-mixed-revision"><strong>Mixed revision</strong><small>Weak skills + spaced review</small></button>
          <button data-route="learning-path"><strong>Learning Path</strong><small>Personalised roadmap</small></button>
          <button data-action="start-exam-practice"><strong>Exam practice</strong><small>Strict Test Mode</small></button>
        </div>
      </section>
      <section class="daily-missions-section"><div class="section-heading"><div><span class="eyebrow">Resets daily</span><h2>Daily missions</h2></div><span>${escapeHtml(localDateString())}</span></div><div class="daily-mission-grid">${dailyMissionCards()}</div></section>
      ${nextTwo.length?`<section class="learn-next-row">${nextTwo.map(skill=>`<button class="learn-next-card" data-action="start-path-skill" data-skill-id="${escapeHtml(skill.id)}" data-skill-year="${skill.yearLevel}"><span>${Math.round(skill.mastery||0)}%</span><div><strong>${escapeHtml(skill.title)}</strong><small>${escapeHtml(skill.strand)}</small></div><b>→</b></button>`).join('')}${dueReview?`<button class="learn-next-card review" data-action="start-review-skill" data-review-id="${escapeHtml(dueReview.id||'')}" data-skill-id="${escapeHtml(dueReview.skillId||recommended?.id||'')}" data-skill-year="${Number(dueReview.yearLevel??recommended?.yearLevel??learnYearLevel)}"><span>↺</span><div><strong>Spaced review due</strong><small>Keep older learning strong</small></div><b>→</b></button>`:''}</section>`:''}
      ${canBrowseAllYears?`<div class="mx-year-dropdown"><label for="learn-year-select"><span>Year level</span><select id="learn-year-select" data-action="learn-year-select" aria-label="Choose year level">${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<option value="${value}" ${learnYearLevel===value?'selected':''}>${escapeHtml(label)}</option>`).join('')}</select></label></div>`:''}
      <section class="learn-mode-bar compact-learn-modes" hidden><button data-route="learning-path"><span>◎</span><div><strong>Learning Path</strong><small>Personalised roadmap</small></div></button><button data-action="start-adaptive-practice"><span>↗</span><div><strong>Adaptive</strong><small>Difficulty adjusts automatically</small></div></button><button data-action="open-discovery-checkin"><span>◉</span><div><strong>Discovery</strong><small>Find strengths and gaps</small></div></button><button data-route="textbook"><span>▤</span><div><strong>Textbook</strong><small>Read the matching lesson</small></div></button></section>
      <div class="learn-strand-list">
      ${strands.map((strand) => { const strandSkills=skills.filter((skill)=>skill.strand===strand); const key=String(strand); const expanded=learnExpandedStrands.has(key); return `<section class="curriculum-strand learn-collapsible ${expanded?'expanded':'collapsed'}"><button class="learn-strand-toggle" data-action="learn-toggle-strand" data-strand="${escapeHtml(key)}" aria-expanded="${expanded?'true':'false'}"><span class="chapter-chevron">${expanded?'⌄':'›'}</span><span><small>${escapeHtml(yearLabel(learnYearLevel))}</small><strong>${escapeHtml(strand)}</strong></span><b>${strandSkills.length} skills</b></button><div class="curriculum-skill-grid" ${expanded?'':'hidden'}>${strandSkills.map((skill)=>{ const task=searchTaskLibrary({yearLevel:skill.yearLevel,skillId:skill.id,type:'practice',difficulty:'medium',questionCount:10,limit:1})[0]; const mastery=skillMasteryValue(skill.id,skill.yearLevel); return `<article class="curriculum-skill-card"><div class="skill-card-meta"><span>${Math.round(mastery)}% mastery</span>${skill.pathway!=='Core'?`<span>${escapeHtml(skill.pathway)}</span>`:''}</div><h3>${escapeHtml(skill.title)}</h3><p>${escapeHtml(skill.topic)}</p><button class="btn secondary small" data-action="start-library-task" data-task-id="${escapeHtml(task?.id||'')}">Practise</button></article>`; }).join('')}</div></section>`; }).join('')}
      </div>
      ${learnYearLevel===9 ? `<section class="curriculum-strand legacy-algebra"><div class="section-heading"><div><span class="eyebrow">Core Algebra</span><h2>Original Algebra lessons</h2></div></div><div class="grid two">${lessonCards()}</div></section>` : ''}
    </div>`;
  const focusClass=selectedStudentClassId||null;
  if(focusClass && String(focusClass)!==activeClassSkillFocusClassId) void loadClassSkillFocus(focusClass,{render:true});
}

function startLesson(lessonId) {
  clearAiChatHistoryForNewQuestion();
  const lesson = getLessonById(lessonId);
  if (!lesson) return;
  const pool = getQuestionsForLesson(lessonId);
  currentLesson = {
    lessonId,
    runId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    asked: [],
    recent: [],
    current: null,
    attempts: 0,
    hintCount: 0,
    selectedChoice: '',
    feedback: null,
    attemptHistory: [],
    showSolution: false,
    complete: false,
    currentIndex: -1,
    questionStates: {},
  };
  pickNextLessonQuestion(pool);
  activeSchoolAssignment={id:`lesson-${Date.now()}`,classId:null,assignmentTitle:lesson?.title||'Lesson practice',className:'Independent learning',dueAt:'',lessonId,taskId:'',testMode:false,tutorAllowed:true,hintsAllowed:true,calculatorAllowed:true,videosAllowed:true,gamesLocked:false,focusRequired:false,answered:0,correct:0,startedAt:Date.now(),synced:true,localOnly:true,returnRoute:'learn'};
  saveActiveAssignmentSession(); assessmentIntegrity={pasteEvents:0,fullscreenExits:0,tabLeaves:0,startedAt:Date.now()}; if(activeSchoolAssignment?.testMode) void enterAssignmentFullscreen({quiet:true}); startAssignmentTimer(); go('assignment', lessonId);
}

function safeLessonHints(question={}) {
  const type=String(question.type||question.answerKind||'numeric');
  if(type==='multiple-choice') return [
    'Read every choice first. Identify the rule, definition or calculation the question is testing.',
    'Test each choice against the question and cross out choices that do not fit.',
    'Explain why your chosen option fits before you submit it.'
  ];
  if(type==='coordinate'||type==='graph-point') return [
    'Identify the x-value and y-value separately before placing the point.',
    'Move along the x-axis first, then move vertically to the y-value.',
    'Check that you wrote the coordinate in the order (x, y).'
  ];
  if(type==='number-line') return [
    'Estimate where the answer should sit between the labelled values.',
    'Check the size of each interval before choosing a point.',
    'Compare your selected value with the question one more time.'
  ];
  if(type==='written-response'||type==='proof') return [
    'Write down the facts or rules you know before making a conclusion.',
    'Link each step to a mathematical reason instead of jumping straight to the result.',
    'Finish with a sentence that answers exactly what the question asks.'
  ];
  return [
    'Identify what you know, what you need to find, and the rule or operation that connects them.',
    'Work one small step at a time. Keep equations balanced and keep units or labels with your values.',
    'Check your result by substituting it back, reversing the operation, or estimating whether it is reasonable.'
  ];
}
function saveLessonQuestionState(){
  if(!currentLesson?.current)return;
  const id=String(currentLesson.current.id||'');
  if(!id)return;
  currentLesson.questionStates={...(currentLesson.questionStates||{}),[id]:{
    attempts:Number(currentLesson.attempts)||0,
    hintCount:Number(currentLesson.hintCount)||0,
    selectedChoice:String(currentLesson.selectedChoice||''),
    feedback:currentLesson.feedback?{...currentLesson.feedback}:null,
    attemptHistory:Array.isArray(currentLesson.attemptHistory)?currentLesson.attemptHistory.map(x=>({...x})):[],
    showSolution:Boolean(currentLesson.showSolution),
  }};
}
function loadLessonQuestionAt(index,pool=getQuestionsForLesson(currentLesson.lessonId)){
  const safeIndex=Math.max(0,Math.min((currentLesson.asked?.length||1)-1,Number(index)||0));
  const id=currentLesson.asked?.[safeIndex];
  const next=pool.find(q=>String(q.id)===String(id));
  if(!next)return false;
  saveLessonQuestionState();
  const saved=currentLesson.questionStates?.[String(id)]||{};
  currentLesson.current=next;
  currentLesson.currentIndex=safeIndex;
  currentLesson.attempts=Number(saved.attempts)||0;
  currentLesson.hintCount=Number(saved.hintCount)||0;
  currentLesson.selectedChoice=String(saved.selectedChoice||'');
  currentLesson.feedback=saved.feedback?{...saved.feedback}:null;
  currentLesson.attemptHistory=Array.isArray(saved.attemptHistory)?saved.attemptHistory.map(x=>({...x})):[];
  currentLesson.showSolution=Boolean(saved.showSolution);
  currentLesson.complete=false;
  saveActiveAssignmentSession();
  return true;
}
function pickNextLessonQuestion(pool = getQuestionsForLesson(currentLesson.lessonId)) {
  saveLessonQuestionState();
  const currentIndex=Number.isFinite(Number(currentLesson.currentIndex))?Number(currentLesson.currentIndex):Math.max(-1,(currentLesson.asked?.length||0)-1);
  if(currentIndex < (currentLesson.asked?.length||0)-1){
    loadLessonQuestionAt(currentIndex+1,pool);
    return;
  }
  const remaining = pool.filter((q) => !currentLesson.asked.includes(q.id));
  if (!remaining.length) {
    currentLesson.current = null;
    currentLesson.complete = true;
    currentLesson.currentIndex=currentLesson.asked.length;
    saveActiveAssignmentSession();
    return;
  }
  const next = chooseQuestion(remaining, currentLesson.recent) ?? remaining[0];
  currentLesson.current = next;
  currentLesson.asked.push(next.id);
  currentLesson.currentIndex=currentLesson.asked.length-1;
  currentLesson.attempts = 0;
  currentLesson.hintCount = 0;
  currentLesson.selectedChoice = '';
  currentLesson.feedback = null;
  currentLesson.attemptHistory = [];
  currentLesson.showSolution = false;
  saveActiveAssignmentSession();
}

function difficultyBars(difficulty) {
  return `<span class="difficulty" aria-label="Difficulty ${difficulty} of 3">${[1,2,3].map((n) => `<i class="${n <= difficulty ? 'on' : ''}"></i>`).join('')}</span>`;
}

function questionAllowedLetters(question={}) {
  if (['written-response','proof','multiple-choice','matching','drag-drop'].includes(String(question.type||''))) return null;
  const source=`${question.prompt||''} ${question.answer??''} ${question.exactAnswer??''}`;
  const vars=new Set();
  for(const match of source.matchAll(/(^|[^A-Za-z])([a-z])(?=$|[^A-Za-z])/gi)){
    if('xyzabcmnpqrstuvw'.includes(match[2].toLowerCase())) vars.add(match[2].toLowerCase());
  }
  if(question.type==='linear-equation'||question.answerKind==='linear-equation') vars.add('x');
  return [...vars].join('');
}
function questionAllowedUnits(question={}) {
  const source=`${question.prompt||''} ${question.unit||''}`;
  const units=[]; const candidates=['mm','cm','km','m','mg','kg','g','mL','ml','L','l','ms','min','s','h'];
  for(const unit of candidates){
    const re=new RegExp(`(^|[^A-Za-z])${unit.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Za-z]|$)`,'i');
    if(re.test(source)) units.push(unit);
  }
  return [...new Set(units)].join('|');
}

function mathAnswerInputAttrs(question={}) {
  const letters=questionAllowedLetters(question);
  if(letters===null) return 'inputmode="text"';
  const units=questionAllowedUnits(question);
  return `inputmode="${letters||units?'text':'decimal'}" data-math-answer="1" data-allowed-letters="${escapeHtml(letters)}" data-allowed-units="${escapeHtml(units)}"`;
}

function sanitizeMathAnswerInput(input) {
  if(!input?.dataset || input.dataset.mathAnswer!=='1') return;
  const letters=String(input.dataset.allowedLetters||'').replace(/[^a-z]/g,'');
  const unitLetters=String(input.dataset.allowedUnits||'').replace(/[^a-z]/gi,'').toLowerCase();
  const allowedLetters=new Set((letters+unitLetters).split(''));
  let out='';
  for(const ch of String(input.value||'')){
    if(/[0-9\s.,+\-*/×÷^()%π√=<>≤≥:;$£€¥°²³]/.test(ch)){ out+=ch; continue; }
    if(/[a-z]/i.test(ch) && allowedLetters.has(ch.toLowerCase())){ out+=ch; continue; }
  }
  if(out!==input.value){
    const pos=Math.max(0,Number(input.selectionStart)||out.length);
    input.value=out;
    try{input.setSelectionRange(Math.min(pos,out.length),Math.min(pos,out.length));}catch{}
  }
}

function answerControl(question, selectedChoice = '') {
  if (question.type === 'multiple-choice') {
    return `<div class="choice-grid">${question.options.map((option) => `<button class="choice ${selectedChoice === option.id ? 'selected' : ''}" data-action="lesson-choice" data-choice="${option.id}">${mathHtml(option.label)}</button>`).join('')}</div>`;
  }
  const placeholder = question.type === 'linear-equation' || question.answerKind === 'linear-equation' ? 'Enter x = ...' : 'Enter your answer';
  return `<input id="lesson-answer" class="answer-input" ${mathAnswerInputAttrs(question)} autocomplete="off" placeholder="${placeholder}" />`;
}

function assignmentAttemptText(raw) {
  const value=String(raw??'').trim();
  if(!value)return 'No answer entered';
  try {
    const parsed=JSON.parse(value);
    if(Array.isArray(parsed)) return parsed.join(', ');
    if(parsed && typeof parsed==='object') return Object.entries(parsed).map(([k,v])=>`${k}: ${v}`).join(' · ');
  } catch {}
  return value;
}

function assignmentProgressHtml(total,currentIndex,results=[],action='jump-task-question') {
  const count=Math.max(1,Number(total)||1);
  return `<div class="assignment-progress-wrap"><div class="assignment-progress-dots">${Array.from({length:count},(_,i)=>{const r=results[i];return `<button type="button" class="assignment-progress-dot ${i===currentIndex?'current':r?'done':'future'}" data-action="${action}" data-question-index="${i}" aria-label="Question ${i+1}${r?', answered':''}" ${i===currentIndex?'aria-current="step"':''}>${r?'✓':i+1}</button>`}).join('')}</div><strong>${Math.min(currentIndex+1,count)} / ${count}</strong></div>`;
}

function assignmentAttemptHistoryHtml(history=[],tutorAllowed=true) {
  if(!history?.length)return '';
  return `<div class="assignment-step-history">${history.map((item,index)=>`<div class="assignment-step-record ${item.correct?'correct':item.needsReview?'review':'wrong'}"><div class="assignment-step-answer"><span>=</span><div>${mathHtml(assignmentAttemptText(item.rawAnswer))}</div></div><div class="assignment-step-status">${item.correct?'<span class="step-status-chip correct">✓ Correct</span>':item.needsReview?'<span class="step-status-chip review">✓ Submitted</span>':`<span class="step-status-chip wrong">↶ Try again</span>${tutorAllowed?'<button class="step-explain-btn" data-action="open-ai-helper">Explain</button>':''}`}</div></div>`).join('')}</div>`;
}

function assignmentMathKeyboardHtml() {
  const keys=[['+','+'],['−','-'],['×','×'],['÷','÷'],['(', '('],[')', ')'],['x²','^2'],['√','sqrt('],['π','π'],['a⁄b','/']];
  return `<div class="assignment-math-keyboard" aria-label="Maths keyboard">${keys.map(([label,insert])=>`<button type="button" data-action="assignment-insert-math" data-insert="${escapeHtml(insert)}">${label}</button>`).join('')}</div>`;
}

function currentIncorrectAttemptCount() {
  const run=currentGeneratedTask?.current ? currentGeneratedTask : currentLesson?.current ? currentLesson : null;
  if(!run) return 0;
  const history=Array.isArray(run.attemptHistory)?run.attemptHistory:[];
  if(history.length) return history.filter((item)=>item && item.correct===false).length;
  return Math.max(0,Number(run.attempts)||0);
}

function lessonSupportIsUnlocked() {
  return !activeSchoolAssignment?.testMode;
}

function assignmentSideRailHtml({tutorAllowed=true,testMode=false,calculatorAllowed=true,videosAllowed=true,attempts=0}={}) {
  const supportUnlocked=!testMode;
  const hardLocked=Boolean(testMode);
  return `<aside class="assignment-side-rail ${hardLocked?'test-locked':''}" aria-label="Assignment tools">
    <button data-action="${tutorAllowed&&!hardLocked?'open-ai-helper':'assignment-ai-locked'}" class="${tutorAllowed&&!hardLocked?'':'locked'}"><span>AI</span><small>${hardLocked?'Locked':'Hints'}</small></button>
    <button data-action="${supportUnlocked?'assignment-lesson-help':'assignment-lesson-help-locked'}" class="${supportUnlocked?'':'locked'}" title="${hardLocked?'Locked in Test Mode':supportUnlocked?'Open Lesson Support':'Locked in Test Mode'}"><span>LS</span><small>${hardLocked?'Locked':supportUnlocked?'Lesson':'Locked'}</small></button>
    <button data-action="${hardLocked?'assignment-textbook-locked':'assignment-textbook'}" class="${hardLocked?'locked':''}"><span>TB</span><small>${hardLocked?'Locked':'Textbook'}</small></button>
    <button ${videosAllowed&&!hardLocked?'data-action="assignment-video"':'data-action="assignment-video-locked"'} class="${videosAllowed&&!hardLocked?'':'locked'}"><span>VID</span><small>${hardLocked?'Locked':'Video'}</small></button>
    <button ${calculatorAllowed&&!hardLocked?'data-action="open-scientific-calculator"':'data-action="assignment-calculator-locked"'} class="${calculatorAllowed&&!hardLocked?'':'locked'}"><span>CALC</span><small>${hardLocked?'Locked':'Calculator'}</small></button>
    <button data-action="${hardLocked?'assignment-toolbox-locked':'assignment-toolbox'}" class="${hardLocked?'locked':''}"><span>TOOLS</span><small>${hardLocked?'Locked':'More tools'}</small></button>
  </aside>`;
}

function assignmentTestModeBannerHtml(){
  if(!activeSchoolAssignment?.testMode)return '';
  return `<div class="assignment-test-mode-banner"><strong>TEST MODE</strong><span>Hints, AI, Lesson Support, Textbook, videos, calculator and extra tools are locked.</span></div>`;
}

function assignmentTopBarHtml({title,subtitle,total,index,results=[],progressAction='jump-task-question'}={}) {
  const multiplier=Math.max(1,Number(state.workbookMultiplier)||1);
  const streak=Math.max(0,Number(state.workbookQuestionStreak)||0);
  const focus=studyTimerSnapshot();
  const focusTime=`${Math.floor(focus.remaining/60)}:${String(focus.remaining%60).padStart(2,'0')}`;
  const focusLabel=focus.mode==='break'?'BREAK':'FOCUS';
  return `<header class="assignment-workspace-topbar"><div class="assignment-title-group"><button class="assignment-back" data-action="leave-assignment" aria-label="Leave task">←</button><div><strong>${escapeHtml(title||'MathsExpress task')}</strong><small>${escapeHtml(subtitle||'Focused task')}</small></div></div><div class="assignment-top-status">${streak>0?`<span class="assignment-streak-chip"><small>STREAK</small><strong>${streak}</strong><b>${multiplier}×</b></span>`:''}<button type="button" class="assignment-focus-timer ${focus.running?'running':'paused'} ${focus.mode==='break'?'is-break':''}" data-action="open-study-timer" title="Open Pomodoro timer"><small id="assignment-focus-timer-label">${focusLabel}</small><strong id="assignment-focus-timer-display">${focusTime}</strong></button><span class="assignment-task-timer"><small>TASK</small><strong id="assignment-task-timer">${assignmentTimeText()}</strong></span>${assignmentProgressHtml(total,index,results,progressAction)}</div></header>`;
}

function assignmentElapsedSeconds(){
  if(!activeSchoolAssignment?.startedAt)return 0;
  return Math.max(0,Math.floor((Date.now()-Number(activeSchoolAssignment.startedAt))/1000));
}
function assignmentTimeText(){
  const elapsed=assignmentElapsedSeconds();
  const limit=Math.max(0,Number(activeSchoolAssignment?.timeLimitMinutes)||0)*60;
  const sec=limit?Math.max(0,limit-elapsed):elapsed;
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}
function updateAssignmentTimerDisplay(){
  const el=document.getElementById('assignment-task-timer'); if(el)el.textContent=assignmentTimeText();
  const limit=Math.max(0,Number(activeSchoolAssignment?.timeLimitMinutes)||0)*60;
  if(limit&&assignmentElapsedSeconds()>=limit&&activeSchoolAssignment&&!activeSchoolAssignment.timeExpired){
    activeSchoolAssignment.timeExpired=true; saveActiveAssignmentSession(); showToast('Time is up','Your teacher can see the time used on this task.');
  }
}
function startAssignmentTimer(){
  if(assignmentTimerInterval)return; assignmentTimerLastSecond=-1; updateAssignmentTimerDisplay();
  assignmentTimerInterval=setInterval(()=>{if(!activeSchoolAssignment?.id){stopAssignmentTimer();return;}const sec=assignmentElapsedSeconds();if(sec!==assignmentTimerLastSecond){assignmentTimerLastSecond=sec;updateAssignmentTimerDisplay();}},250);
}
function stopAssignmentTimer(){if(assignmentTimerInterval){clearInterval(assignmentTimerInterval);assignmentTimerInterval=null;}assignmentTimerLastSecond=-1;}
async function awardRemoteQuestionProgress(eventKey,q,attemptNumber,correct){
  if(!account.authenticated||!correct)return null;
  try{
    const streak=applyWorkbookStreak(true); const xp=Math.max(0,Math.round((Number(q?.xp)||0)*streak.mult));
    const rewardYear=normaliseYearLevel(currentGeneratedTask?.task?.yearLevel ?? q?.yearLevel ?? account.profile?.yearLevel,9);
    const economy=await getSchoolClient().awardQuestionReward(eventKey,{correct:true,xp,gameTimeSeconds:10,yearLevel:rewardYear});
    await applyRemotePlayerState(economy,{quiet:true}); eloBoardData=null;
    let expeditionClassId=activeSchoolAssignment?.classId || selectedStudentClassId || null;
    if(!expeditionClassId){await syncStudentLearningContextFromClasses();expeditionClassId=selectedStudentClassId;}
    const [eloResult,expeditionResult]=await Promise.allSettled([
      getSchoolClient().eloAwardQuestion(eventKey,String(q?.id||''),attemptNumber,true),
      expeditionClassId?accountClient.ensureClient().rpc('mathsexpress_contribute_expedition',{p_class_id:String(expeditionClassId),p_points:10}):Promise.resolve(null)
    ]);
    const elo=eloResult.status==='fulfilled'?eloResult.value:null;
    if(expeditionResult.status==='rejected'||expeditionResult.value?.error)showToast('Class points could not sync','Your answer is saved. Check your connection before continuing.');
    if(Number(elo?.points)>0)showToast('ELO earned',`+${Number(elo.points)} ELO · ${streak.mult}× streak · rating ${Number(elo.rating)||1000}`,'success');
    return {economy,elo,streak};
  }catch(error){console.warn('Remote question reward failed',error);return null;}
}
async function recordIrtEvidence(q,correct,{skillId=null,source=null}={}){
  if(!account.authenticated||correct===null||correct===undefined)return null;
  const id=String(skillId||q?.lessonId||currentGeneratedTask?.task?.skillId||currentGeneratedTask?.task?.topic||q?.topic||'general-maths');
  const complexity=Math.max(1,Math.min(5,Number(q?.complexity||q?.difficulty||2)));
  const difficulty=[0,-1.4,-0.6,0.2,1.0,1.8][complexity] ?? 0;
  const year=normaliseYearLevel(currentGeneratedTask?.task?.yearLevel,account.profile?.yearLevel);
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_irt_record_response',{p_skill_id:id,p_year_level:year,p_item_difficulty:difficulty,p_discrimination:1.15,p_correct:Boolean(correct),p_source:source||(activeSchoolAssignment&&!activeSchoolAssignment.localOnly?'assignment':'practice'),p_assignment_id:activeSchoolAssignment?.id&&!activeSchoolAssignment?.localOnly?String(activeSchoolAssignment.id):null});
    if(error)throw error;
    const mastery=Math.max(0,Math.min(100,Number(data?.mastery)||0));
    if(id&&Number.isFinite(mastery)){
      persist({...state,skillMasteryMap:{...(state.skillMasteryMap||{}),[skillStateKey(id,year)]:mastery}},{quiet:true});
      if(currentGeneratedTask?.task?.type==='adaptive'||currentGeneratedTask?.task?.assignmentType==='adaptive'){
        const target=mastery<30?1:mastery<55?2:mastery<75?3:mastery<90?4:5;
        const prefix=currentGeneratedTask.questions.slice(0,currentGeneratedTask.index+1);
        const rest=currentGeneratedTask.questions.slice(currentGeneratedTask.index+1).sort((a,b)=>Math.abs((Number(a.complexity)||2)-target)-Math.abs((Number(b.complexity)||2)-target));
        currentGeneratedTask.questions=[...prefix,...rest];
      }
    }
    return data;
  }catch(error){console.warn('IRT evidence update failed',error);return null;}
}

async function openV83Diagnostic(kind='discovery'){
  const year=normaliseYearLevel(account.profile?.yearLevel);
  const qs=v83DiagnosticQuestions(year,kind);
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_start_diagnostic',{p_kind:kind,p_year_level:year,p_topic:kind==='readiness'?(recommendedLearningPathSkill()?.topic||null):null,p_total_questions:qs.length});
    if(error)throw error;
    openSimpleModal(kind==='discovery'?'Discovery Check-In':'Topic Readiness',`<form id="v7-v83-diagnostic-form" class="v7-diagnostic-form"><input type="hidden" name="runId" value="${escapeHtml(data?.run_id||'')}"><input type="hidden" name="kind" value="${escapeHtml(kind)}"><p class="muted">${kind==='discovery'?'This check spans number, algebra, geometry, probability and data to find your strongest and weakest curriculum areas.':'This check focuses on whether prerequisite knowledge is secure enough for the next topic.'}</p>${qs.map((x,i)=>`<label><span>${i+1}. ${mathHtml(x.prompt)}</span><input name="${x.id}" autocomplete="off" required></label>`).join('')}<button class="btn primary" type="submit">Finish check-in</button></form>`);
  }catch(error){showToast('Diagnostic unavailable',error.message||'Try again.');}
}
function v83DiagnosticQuestions(year=9,kind='discovery'){
  const base=v7DiagnosticQuestions(year);
  const extra=[
    {id:'x1',skill:'ratio-rate',strand:'Number',prompt:'Simplify the ratio 18:24.',answer:'3:4',type:'short-answer',difficulty:-.4},
    {id:'x2',skill:'area',strand:'Measurement',prompt:'Find the area of a rectangle 7 cm by 5 cm.',answer:'35',type:'numeric',difficulty:-.7},
    {id:'x3',skill:'mean',strand:'Statistics',prompt:'Find the mean of 4, 7, 9, 10.',answer:'7.5',type:'numeric',difficulty:-.2},
    {id:'x4',skill:'probability',strand:'Probability',prompt:'A fair die is rolled. What is the probability of rolling an even number? Give a simplified fraction.',answer:'1/2',type:'numeric',difficulty:-.2},
    {id:'x5',skill:'linear-graphs',strand:'Functions & Graphs',prompt:'For y = 3x + 2, find y when x = 4.',answer:'14',type:'numeric',difficulty:.2},
    ...(year>=9?[{id:'x6',skill:'gradient',strand:'Functions & Graphs',prompt:'Find the gradient between (1,3) and (5,11).',answer:'2',type:'numeric',difficulty:.5}]:[]),
    ...(year>=10?[{id:'x7',skill:'quadratic-equations',strand:'Algebra',prompt:'Solve x² - 9 = 0. Enter the positive solution.',answer:'3',type:'numeric',difficulty:.9}]:[])
  ];
  const qs=[...base.map((q,i)=>({...q,type:q.type||'short-answer',difficulty:-.8+i*.25})),...extra];
  return kind==='readiness'?qs.slice(Math.max(0,qs.length-10)):qs.slice(0,14);
}
async function openV83GrowthReport(){
  openSimpleModal('Growth Report','<div class="school-loading"><span class="spinner"></span><strong>Loading growth evidence…</strong></div>');
  try{const [{data:g,error:e1},{data:s,error:e2}]=await Promise.all([accountClient.ensureClient().rpc('mathsexpress_my_growth_report',{}),accountClient.ensureClient().rpc('mathsexpress_my_irt_state',{})]);if(e1)throw e1;if(e2)throw e2;const current=g?.current||{},snaps=g?.snapshots||[],skills=Array.isArray(s)?s:[];openSimpleModal('Growth Report',`<div class="owner-analytics-strip large"><div><b>${Number(current.scaled_score||500).toFixed(0)}</b><small>scaled score</small></div><div><b>${Number(current.grade_equivalent||normaliseYearLevel(account.profile?.yearLevel)).toFixed(1)}</b><small>grade-equivalent estimate</small></div><div><b>${Number(current.evidence_count||0)}</b><small>IRT evidence</small></div><div><b>±${Number(current.standard_error||0).toFixed(2)}</b><small>uncertainty</small></div></div><h3>Skill proficiency</h3><div class="simple-list">${skills.slice(0,12).map(x=>`<div><strong>${escapeHtml(x.skill_id)}</strong><span>${Number(x.mastery||0).toFixed(0)}% · grade ${Number(x.grade_equivalent||0).toFixed(1)} · ${x.evidence_count||0} items</span></div>`).join('')||'<p>Complete more questions to build a growth estimate.</p>'}</div><h3>Growth snapshots</h3><div class="simple-list">${snaps.slice(-12).reverse().map(x=>`<div><strong>${new Date(x.created_at).toLocaleDateString()}</strong><span>Score ${Number(x.scaled_score||0).toFixed(0)} · grade ${Number(x.grade_equivalent||0).toFixed(1)} · ${escapeHtml(x.source||'practice')}</span></div>`).join('')||'<p>No snapshots yet.</p>'}</div>`);}catch(error){openSimpleModal('Growth Report',`<p>${escapeHtml(error.message||'Growth data is not available yet.')}</p>`);}
}
async function openV83ClassGrowth(kind='class'){
  const classId=v7CurrentClassId();if(!classId)return showToast('Choose a class first','Open a class before viewing growth.');
  openSimpleModal('Class Growth','<div class="school-loading"><span class="spinner"></span><strong>Loading report…</strong></div>');
  try{const rpcName=kind==='standards'?'mathsexpress_standards_growth_report':'mathsexpress_teacher_growth_report';const args=kind==='standards'?{p_class_id:classId,p_days:90}:{p_class_id:classId};const {data,error}=await accountClient.ensureClient().rpc(rpcName,args);if(error)throw error;if(kind==='standards'){const rows=data?.standards||[];openSimpleModal('Standards Growth',`<div class="v7-analytics-table"><div class="head"><b>Skill</b><b>Students</b><b>Start</b><b>Current</b><b>Growth</b></div>${rows.map(r=>`<div><span>${escapeHtml(r.skill_id)}</span><span>${r.students}</span><span>${Number(r.starting_mastery||0).toFixed(0)}%</span><span>${Number(r.current_mastery||0).toFixed(0)}%</span><strong>${Number(r.growth||0)>=0?'+':''}${Number(r.growth||0).toFixed(1)}</strong></div>`).join('')||'<p>No IRT evidence yet.</p>'}</div>`);}else{const rows=data?.students||[];openSimpleModal('Class Growth',`<div class="v7-analytics-table"><div class="head"><b>Student</b><b>Grade eq.</b><b>Scaled</b><b>90d growth</b><b>Evidence</b></div>${rows.map(r=>`<div><span>${escapeHtml(r.display_name||'Student')}</span><span>${Number(r.grade_equivalent||0).toFixed(1)}</span><span>${Number(r.scaled_score||500).toFixed(0)}</span><strong>${Number(r.growth_90d||0)>=0?'+':''}${Number(r.growth_90d||0).toFixed(2)}</strong><span>${r.evidence_count||0}</span></div>`).join('')||'<p>No growth evidence yet.</p>'}</div>`);}}catch(error){showToast('Growth report unavailable',error.message||'Try again.');}
}
async function openV83SchoolUsage(mode='usage'){
  const schoolId=v7CurrentSchoolId();if(!schoolId)return showToast('Choose a school first','Open School first.');openSimpleModal('School Analytics','<div class="school-loading"><span class="spinner"></span><strong>Loading analytics…</strong></div>');try{const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_school_usage_report',{p_school_id:schoolId,p_days:30});if(error)throw error;const l=data?.learning||{},teachers=data?.teachers||[];const assigned=Math.round(Number(l.assigned_seconds||0)/60),self=Math.round(Number(l.self_directed_seconds||0)/60),school=Math.round(Number(l.school_hours_seconds||0)/60),home=Math.round(Number(l.home_hours_seconds||0)/60);openSimpleModal(mode==='hours'?'School vs Home Learning':mode==='source'?'Assigned vs Self-Directed':'Teacher Usage Analytics',`<div class="owner-analytics-strip large"><div><b>${assigned}m</b><small>assigned</small></div><div><b>${self}m</b><small>self-directed</small></div><div><b>${school}m</b><small>school hours</small></div><div><b>${home}m</b><small>home hours</small></div></div>${mode==='usage'?`<div class="v7-analytics-table"><div class="head"><b>Teacher</b><b>Classes</b><b>Assignments 30d</b><b>Last seen</b></div>${teachers.map(t=>`<div><span>${escapeHtml(t.display_name||'Teacher')}</span><span>${t.classes_owned||0}</span><span>${t.assignments_created||0}</span><span>${t.last_seen?new Date(t.last_seen).toLocaleDateString():'—'}</span></div>`).join('')||'<p>No teacher activity yet.</p>'}</div>`:''}`);}catch(error){showToast('School analytics unavailable',error.message||'Try again.');}
}
async function openV83IntegrationSettings(){
  const schoolId=v7CurrentSchoolId();if(!schoolId)return showToast('Choose a school first','Open School first.');try{const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_get_integration_config',{p_school_id:schoolId});if(error)throw error;const c=data||{};openSimpleModal('School Integrations',`<form id="v7-v83-integrations-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><h3>Canvas LMS</h3><label><input type="checkbox" name="canvas" ${c.canvas_enabled?'checked':''}> Enable Canvas connection</label><label>Canvas base URL<input name="canvasUrl" value="${escapeHtml(c.canvas_base_url||'')}" placeholder="https://school.instructure.com"></label><h3>Clever rostering</h3><label><input type="checkbox" name="clever" ${c.clever_enabled?'checked':''}> Enable Clever</label><label>District ID<input name="cleverDistrict" value="${escapeHtml(c.clever_district_id||'')}"></label><h3>SAML SSO</h3><label><input type="checkbox" name="saml" ${c.saml_enabled?'checked':''}> Enable SAML</label><label>School domain<input name="samlDomain" value="${escapeHtml(c.saml_domain||'')}" placeholder="school.edu.au"></label><h3>Automatic roster sync</h3><label><input type="checkbox" name="sync" ${c.roster_sync_enabled?'checked':''}> Enable scheduled sync</label><div class="form-two"><label>Provider<select name="provider"><option value="manual">Manual</option><option value="canvas" ${c.roster_sync_provider==='canvas'?'selected':''}>Canvas</option><option value="clever" ${c.roster_sync_provider==='clever'?'selected':''}>Clever</option><option value="schoolsplp" ${c.roster_sync_provider==='schoolsplp'?'selected':''}>SchoolsPLP OneRoster</option></select></label><label>Sync hour (UTC)<input type="number" min="0" max="23" name="hour" value="${Number(c.sync_hour_local??5)}"></label></div><p class="muted">Provider secrets are never stored in browser code. Canvas/Clever require server-side provider credentials for live and scheduled roster sync. SAML configuration can be validated here, while the school IdP must still be wired to the deployed login callback before SSO can be used.</p><button class="btn primary" type="submit">Save integration settings</button></form>`);}catch(error){showToast('Integrations unavailable',error.message||'Try again.');}
}

function assignmentFullscreenAvailable(){
  return Boolean(document?.documentElement?.requestFullscreen && document?.exitFullscreen);
}
function removeAssignmentFullscreenGuard(){
  document.getElementById('assignment-fullscreen-guard')?.remove();
}
function showAssignmentFullscreenGuard(){
  removeAssignmentFullscreenGuard();
  if(!activeSchoolAssignment?.id || document.fullscreenElement || !assignmentFullscreenAvailable()) return;
  const guard=document.createElement('div');
  guard.id='assignment-fullscreen-guard';
  guard.className='assignment-fullscreen-guard';
  guard.innerHTML=`<section><span class="eyebrow">Assignment still active</span><h2>Return to fullscreen to continue</h2><p>Fullscreen keeps the assignment focused and hides the browser tabs and address bar. You can still leave using the MathsExpress back arrow.</p><div><button class="btn primary" data-action="assignment-return-fullscreen">Return to fullscreen</button><button class="btn secondary" data-action="leave-assignment">← Back to ${activeSchoolAssignment?.localOnly?'Learn':'Class'}</button></div></section>`;
  document.body.appendChild(guard);
}
async function enterAssignmentFullscreen({quiet=false}={}){
  if(!assignmentFullscreenAvailable() || document.fullscreenElement) { removeAssignmentFullscreenGuard(); return true; }
  try {
    await document.documentElement.requestFullscreen();
    removeAssignmentFullscreenGuard();
    document.body?.classList.add('assignment-browser-fullscreen');
    return true;
  } catch(error) {
    if(!quiet) showToast('Fullscreen blocked','Press Return to fullscreen to hide the browser tabs.');
    setTimeout(showAssignmentFullscreenGuard,80);
    return false;
  }
}
async function exitAssignmentFullscreen(){
  removeAssignmentFullscreenGuard();
  document.body?.classList.remove('assignment-browser-fullscreen');
  if(document.fullscreenElement && document.exitFullscreen){
    try { await document.exitFullscreen(); } catch {}
  }
}
function handleAssignmentFullscreenChange(){
  const active=Boolean(activeSchoolAssignment?.id);
  document.body?.classList.toggle('assignment-browser-fullscreen',Boolean(document.fullscreenElement && active));
  if(active && !document.fullscreenElement){ assessmentIntegrity.fullscreenExits=(assessmentIntegrity.fullscreenExits||0)+1; void recordAssessmentIntegrity('fullscreen-exit',{elapsed_seconds:assignmentElapsedSeconds()}); setTimeout(showAssignmentFullscreenGuard,80); }
  else removeAssignmentFullscreenGuard();
}

let assessmentCaptureWarningAt=0;
function showAssessmentCaptureWarning(kind='capture'){
  if(!activeSchoolAssignment?.id)return;
  const now=Date.now(); if(now-assessmentCaptureWarningAt<1200)return; assessmentCaptureWarningAt=now;
  const label=kind==='recording'?'Screen recording':'Screenshots';
  showToast(`${label} not allowed`,`Do not capture or record assessment questions while this task is active.`);
  void recordAssessmentIntegrity(kind==='recording'?'screen-recording-attempt':'screenshot-attempt',{elapsed_seconds:assignmentElapsedSeconds(),detected_by:'browser-shortcut'});
}
function assessmentCaptureShortcut(event){
  if(!activeSchoolAssignment?.id)return false;
  const key=String(event.key||'').toLowerCase();
  const printScreen=key==='printscreen';
  const macCapture=Boolean(event.metaKey&&event.shiftKey&&['3','4','5'].includes(key));
  const commonCapture=Boolean((event.ctrlKey||event.metaKey)&&event.shiftKey&&key==='s');
  if(!(printScreen||macCapture||commonCapture))return false;
  event.preventDefault?.(); event.stopPropagation?.();
  showAssessmentCaptureWarning(macCapture&&key==='5'?'recording':'capture');
  return true;
}

function assignmentSessionKey(){ return 'mathsexpress-active-assignment-v7'; }
function saveActiveAssignmentSession(){
  try {
    if(activeSchoolAssignment){
      const payload={version:3,assignment:activeSchoolAssignment,generatedTask:currentGeneratedTask||null,lesson:currentLesson||null,savedAt:Date.now()};
      sessionStorage.setItem(assignmentSessionKey(), JSON.stringify(payload));
    } else sessionStorage.removeItem(assignmentSessionKey());
  } catch {}
}
function restoreActiveAssignmentSession(){
  if(activeSchoolAssignment) return activeSchoolAssignment;
  try {
    const raw=sessionStorage.getItem(assignmentSessionKey());
    if(raw){
      const parsed=JSON.parse(raw);
      // Backwards compatible with v7/v11 checkpoints that stored only the assignment object.
      if(parsed?.assignment?.id){
        activeSchoolAssignment=parsed.assignment;
        if(parsed.generatedTask?.task?.id) currentGeneratedTask=parsed.generatedTask;
        if(parsed.lesson?.lessonId) currentLesson=parsed.lesson;
      } else if(parsed?.id) activeSchoolAssignment=parsed;
    }
  } catch {}
  return activeSchoolAssignment;
}
function clearActiveAssignment({returnToAssigned=true}={}){
  const returnRoute=activeSchoolAssignment?.returnRoute || 'student-hub';
  clearAiChatHistoryForNewQuestion();
  if(activeSchoolAssignment?.id) syncStudentFocusStatus('idle',{force:true});
  try{ stopFocusHeartbeat?.(); }catch{}
  stopAssignmentTimer();
  activeSchoolAssignment=null;
  saveActiveAssignmentSession();
  currentGeneratedTask=null;
  currentLesson=null;
  document.body?.classList.remove('assignment-focus-mode','assignment-test-lock');
  void exitAssignmentFullscreen();
  if(returnToAssigned) go(returnRoute);
}
function generatedQuestionHistoryKey(){
  const userId=account?.profile?.userId || account?.session?.user?.id || 'guest';
  return `mathsexpress-generated-question-history-v1:${userId}`;
}
function loadGeneratedQuestionHistory(){
  try {
    const parsed=JSON.parse(localStorage.getItem(generatedQuestionHistoryKey()) || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch { return []; }
}
function rememberGeneratedQuestions(questions=[]){
  try {
    const existing=loadGeneratedQuestionHistory();
    const next=[...existing];
    const seen=new Set(existing);
    for(const q of questions){
      const fp=questionFingerprint?.(q);
      if(fp && !seen.has(fp)){ seen.add(fp); next.push(fp); }
    }
    // 100,000 compact fingerprints is enough for years of normal student practice
    // while staying safely below browser storage limits.
    const trimmed=next.slice(-100000);
    localStorage.setItem(generatedQuestionHistoryKey(),JSON.stringify(trimmed));
  } catch {}
}
function createUniqueGeneratedTaskRun(task,{runSeed=null,avoidHistory=true}={}){
  const avoidFingerprints=avoidHistory?loadGeneratedQuestionHistory():[];
  const options={avoidFingerprints}; if(Number.isFinite(Number(runSeed))&&Number(runSeed)>0)options.runSeed=Number(runSeed);
  const run=createGeneratedTaskRun(task,options);
  if(avoidHistory) rememberGeneratedQuestions(run.questions);
  return run;
}

function startAssignedGeneratedTask(taskId){
  clearAiChatHistoryForNewQuestion();
  const task=getTaskById(taskId);
  if(!task) return showToast('Task unavailable','This assignment task could not be opened.');
  currentGeneratedTask=createUniqueGeneratedTaskRun(task,{runSeed:activeSchoolAssignment?.questionSeed||null,avoidHistory:false});
  currentLesson=null;
  saveActiveAssignmentSession();
  go('assignment',task.id);
}
function startAssignedLesson(lessonId){
  clearAiChatHistoryForNewQuestion();
  const lesson=getLessonById(lessonId);
  if(!lesson) return showToast('Lesson unavailable','This assignment lesson could not be opened.');
  const pool=getQuestionsForLesson(lessonId);
  currentLesson={lessonId,runId:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,asked:[],recent:[],current:null,attempts:0,hintCount:0,selectedChoice:'',feedback:null,attemptHistory:[],showSolution:false,complete:false,currentIndex:-1,questionStates:{}};
  currentGeneratedTask=null;
  pickNextLessonQuestion(pool);
  saveActiveAssignmentSession();
  go('assignment',lesson.id);
}
function renderAssignmentRoute(){
  restoreActiveAssignmentSession();
  const view=document.getElementById('app-view');
  if(fixModeSession) return renderFixMode();
  if(activeSchoolAssignment?.id){ startAssignmentTimer(); if(!document.fullscreenElement) setTimeout(showAssignmentFullscreenGuard,450); }
  if(!activeSchoolAssignment){
    document.body?.classList.remove('assignment-focus-mode','assignment-test-lock');
    view.innerHTML=`<div class="page"><div class="card empty-state"><div class="big">↩</div><h2>No assignment is open</h2><p>Return to Class and choose an assignment.</p><button class="btn primary" data-route="student-hub">Back to Class</button></div></div>`;
    return;
  }
  if(activeSchoolAssignment.customWorksheet?.questions?.length){
    if(!currentGeneratedTask) startAssignedCustomWorksheet({id:activeSchoolAssignment.id,title:activeSchoolAssignment.assignmentTitle,config:{custom_worksheet:activeSchoolAssignment.customWorksheet}});
    return renderGeneratedTask();
  }
  if(activeSchoolAssignment.taskId){
    const task=getTaskById(activeSchoolAssignment.taskId);
    if(!task) return clearActiveAssignment();
    if(!currentGeneratedTask || currentGeneratedTask.task?.id!==task.id) currentGeneratedTask=createUniqueGeneratedTaskRun(task);
    return renderGeneratedTask();
  }
  if(activeSchoolAssignment.lessonId){
    const lesson=getLessonById(activeSchoolAssignment.lessonId);
    if(!lesson) return clearActiveAssignment();
    if(!currentLesson || currentLesson.lessonId!==lesson.id){
      currentLesson={lessonId:lesson.id,runId:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,asked:[],recent:[],current:null,attempts:0,hintCount:0,selectedChoice:'',feedback:null,attemptHistory:[],showSolution:false,complete:false,currentIndex:-1,questionStates:{}};
      pickNextLessonQuestion(getQuestionsForLesson(lesson.id));
    }
    return renderLesson();
  }
  view.innerHTML=`<div class="assignment-workspace">${assignmentTopBarHtml({title:activeSchoolAssignment.assignmentTitle||'Assigned work',subtitle:activeSchoolAssignment.className||'MathsExpress class',total:1,index:0})}<main class="assignment-workspace-main"><section class="assignment-problem-area"><h2>This assignment has no task attached.</h2><p>Ask your teacher to edit the assignment.</p></section></main></div>`;
}



function assessmentApiEndpoints(name) {
  if (globalThis.location?.protocol === 'file:') return [`https://mathsexpress.netlify.app/api/${name}`,`https://mathsexpress.netlify.app/.netlify/functions/${name}`];
  return [`/api/${name}`,`/.netlify/functions/${name}`];
}
async function assessmentApi(name,payload,timeoutMs=22000){
  let lastError=null;
  for(const url of assessmentApiEndpoints(name)){
    try{
      const aiToken=account.session?.access_token||accountClient.session?.access_token||'';
      const authHeader=aiToken?{'Authorization':`Bearer ${aiToken}`}:{ };
      const r=await fetchAiEndpoint(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...authHeader},body:JSON.stringify(payload)},timeoutMs);
      if(r.status===404||r.status===405) continue;
      const data=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(data?.error||`Service returned ${r.status}`);
      return data;
    }catch(error){lastError=error;}
  }
  throw lastError||new Error(`${name} service unavailable.`);
}
function activeAssignmentRunQuestion(){
  if(currentGeneratedTask?.current) return {run:currentGeneratedTask,q:currentGeneratedTask.current,kind:'generated'};
  if(currentLesson?.current) return {run:currentLesson,q:currentLesson.current,kind:'lesson'};
  return {run:null,q:null,kind:null};
}
function questionMaxMarks(q){
  const explicit=Number(q?.marksPossible);
  if(Number.isFinite(explicit)&&explicit>0)return Math.max(1,Math.min(10,Math.round(explicit)));
  const d=Number(q?.complexity||q?.difficulty||2);
  const type=String(q?.type||'numeric');
  if(['multiple-choice','matching','drag-drop','number-line'].includes(type))return 1;
  return Math.max(1,Math.min(5,Number.isFinite(d)?d:2));
}
function questionWorkingSteps(q){
  if(q?.requiresWorking===false)return 0;
  const explicit=Number(q?.workingSteps);
  if(Number.isFinite(explicit)&&explicit>=0)return Math.max(0,Math.min(6,Math.round(explicit)));
  return Math.max(0,questionMaxMarks(q)-1);
}
function assignmentSupportsStepMarking(q){
  if(!q||questionWorkingSteps(q)<1||questionMaxMarks(q)<2)return false;
  return !['multiple-choice','matching','drag-drop','number-line'].includes(String(q.type||''));
}
function getStepState(run,q){
  if(!run||!q) return null;
  run.stepMarking=run.stepMarking||{};
  if(!run.stepMarking[q.id]) run.stepMarking[q.id]={steps:[],marksAwarded:0,marksPossible:questionMaxMarks(q),nextStepUsed:false,nextStepCount:0,revealedSteps:[],nextStep:'',feedback:'',rationale:'',methodId:''};
  return run.stepMarking[q.id];
}
function assignmentStepPanelHtml(run,q){
  if(!assignmentSupportsStepMarking(q)) return '';
  if(activeSchoolAssignment?.testMode){
    const targetSteps=questionWorkingSteps(q);
    return `<section class="assignment-step-marker test-rough-work"><div class="assignment-step-marker-head"><div><strong>Rough working</strong><small>Use this space for your method. Step marking and feedback are disabled in Test Mode.</small></div><span>${targetSteps>0?`About ${targetSteps} line${targetSteps===1?'':'s'}`:'Optional'}</span></div><div class="assignment-step-entry test-only"><input id="assignment-step-input" autocomplete="off" placeholder="Write rough working here…"></div></section>`;
  }
  const st=getStepState(run,q); const steps=st?.steps||[];
  const revealed=Array.isArray(st.revealedSteps)?st.revealedSteps:[];
  const targetSteps=questionWorkingSteps(q);
  const marks=questionMaxMarks(q);
  return `<section class="assignment-step-marker"><div class="assignment-step-marker-head"><div><strong>Show your working</strong><small>This is a ${marks}-mark question. About ${targetSteps} clear working ${targetSteps===1?'line is':'lines are'} normally enough; extra lines are optional and any correct method is accepted.</small></div><span>${Number(st.marksAwarded||0).toFixed(Number(st.marksAwarded)%1?1:0)}/${st.marksPossible} marks so far</span></div>${steps.length?`<div class="assignment-marked-steps">${steps.map((x,i)=>`<article class="${escapeHtml(x.verdict)}"><b>${i+1}</b><div><strong>${mathHtml(x.text)}</strong><small>${escapeHtml(x.feedback||'')}</small></div><span>+${Number(x.deltaMarks||0).toFixed(Number(x.deltaMarks)%1?1:0)}</span></article>`).join('')}</div>`:''}${revealed.length?`<div class="assignment-next-step-card"><strong>Next Steps revealed (${revealed.length})</strong>${revealed.map((x,i)=>`<p><b>${i+1}.</b> ${mathHtml(x)}</p>`).join('')}<small>Each revealed step reduces the maximum available mark by 1, down to a minimum of 1 mark.</small></div>`:''}<div class="assignment-step-entry"><input id="assignment-step-input" autocomplete="off" placeholder="Enter your next line of working…"><button class="btn secondary small" type="button" data-action="assignment-submit-working-step">Mark step</button><button class="btn ghost small" type="button" data-action="assignment-handwriting">Handwrite</button></div></section>`;
}
function quickLocalNextStep(q,st) {
  const used=new Set((st.revealedSteps||[]).map((x)=>String(x).trim()));
  // Never use raw question hints or the worked solution here. Older generated
  // questions may store the complete solution in those fields.
  const hints=safeLessonHints(q);
  const hint=hints.find((x)=>String(x||'').trim()&&!used.has(String(x).trim()));
  return String(hint || 'Write the next operation you would use, then simplify one line at a time.');
}

async function submitAssignmentWorkingStep({requestNext=false}={}){
  const {run,q}=activeAssignmentRunQuestion(); if(!run||!q||!activeSchoolAssignment)return;
  if(activeSchoolAssignment?.testMode)return showToast('Step feedback locked','Step marking and Next Step are disabled in Test Mode.');
  const st=getStepState(run,q); const input=document.getElementById('assignment-step-input'); const text=String(input?.value||'').trim();
  if(!requestNext&&!text) return showToast('Enter a step','Write the next line of your working first.');
  const previous=[...st.steps.map(x=>x.text),...(Array.isArray(st.revealedSteps)?st.revealedSteps:[])]; const maxMarks=st.marksPossible||questionMaxMarks(q);
  const requestToken=++nextStepRequestToken;
  let optimisticStep='';
  if(requestNext){
    st.nextStepUsed=true;
    st.nextStepCount=(Number(st.nextStepCount)||0)+1;
    optimisticStep=quickLocalNextStep(q,st);
    st.nextStep=optimisticStep;
    st.revealedSteps=[...(st.revealedSteps||[]),optimisticStep].slice(-8);
    st.feedback=`Next Step ${st.nextStepCount} used`;
    if(currentGeneratedTask?.current===q) renderGeneratedTask(); else if(currentLesson?.current===q) renderLesson();
    showToast('Next Step ready','A quick local hint is shown now while MathsExpress checks the best next step.','success');
  } else {
    const btn=document.querySelector('[data-action="assignment-submit-working-step"]');
    if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='Marking…';}
  }
  try{
    const result=await assessmentApi('mark-step',{assignmentId:activeSchoolAssignment?.id&&!activeSchoolAssignment?.localOnly?String(activeSchoolAssignment.id):null,action:requestNext?'next_step':'mark_step',question:{prompt:q.prompt,answer:q.answer,workedSolution:q.workedSolution,type:q.type},step:text,previousSteps:previous,nextStepUsed:Number(st.nextStepCount||0)>0,nextStepCount:requestNext?Math.max(0,Number(st.nextStepCount||1)-1):Number(st.nextStepCount||0),maxMarks});
    if(requestNext){
      if(requestToken!==nextStepRequestToken)return;
      const refined=String(result.next_step||'').trim();
      if(refined && refined!==optimisticStep){
        const rows=[...(st.revealedSteps||[])];
        if(rows.length)rows[rows.length-1]=refined;
        st.revealedSteps=rows;
        st.nextStep=refined;
      }
    }else{
      const before=Number(st.marksAwarded)||0; st.marksAwarded=Math.max(before,Number(result.marks_awarded)||0); st.feedback=result.feedback||''; st.rationale=result.rationale||''; st.methodId=result.method_id||st.methodId;
      st.steps.push({text:result.normalized_step||text,verdict:result.verdict||'valid-progress',feedback:result.feedback||'',deltaMarks:Math.max(0,st.marksAwarded-before),followThrough:Boolean(result.follow_through)});
      if(input) input.value='';
    }
    if(activeSchoolAssignment?.id&&!activeSchoolAssignment.localOnly&&account.authenticated){
      void fireAndForgetRpc('mathsexpress_record_step_mark',{p_assignment_id:activeSchoolAssignment.id,p_question_id:String(q.id),p_step_index:Math.max(1,st.steps.length),p_step_text:requestNext?(st.nextStep||'Next Step used'):text,p_verdict:requestNext?'valid-progress':(result.verdict||'valid-progress'),p_marks_awarded:requestNext?0:Number(result.marks_awarded)||0,p_marks_possible:maxMarks,p_feedback:result.feedback||'',p_rationale:result.rationale||'',p_next_step_used:requestNext||st.nextStepUsed,p_method_id:result.method_id||null});
    }
    if(result.final_answer_reached&&!requestNext) showToast('That reaches the answer','Your step is mathematically complete. Enter/check the final answer below.','success');
  }catch(error){
    if(!requestNext) showToast('Step marking unavailable',error.message||'Try again in a moment.');
  }
  if(currentGeneratedTask?.current===q) renderGeneratedTask(); else if(currentLesson?.current===q) renderLesson();
}

function openAssignmentHandwriting(){
  openSimpleModal('Handwriting to maths',`<div class="v7-sketch-wrap handwriting-maths-modal"><canvas id="v7-sketch-canvas" width="900" height="420" aria-label="Write maths here"></canvas><div class="simple-modal-actions"><button class="btn secondary" data-action="v7-clear-sketch">Clear</button><button class="btn primary" data-action="recognize-assignment-handwriting">Recognize maths</button></div><p class="muted">Write one mathematical line clearly. MathsExpress will convert it to editable maths, then you can submit it as a marked step.</p><div id="handwriting-result" class="v7-result-box"></div><div class="handwriting-fallback"><label for="handwriting-typed-fallback">Typed fallback</label><div><input id="handwriting-typed-fallback" class="answer-input" autocomplete="off" placeholder="Type the expression if recognition is unsure…"><button class="btn secondary" type="button" data-action="use-handwriting-typed-fallback">Use typed maths</button></div></div></div>`); setTimeout(v7InitSketchCanvas,0);
}
function handwritingCorrectionSuggestions(expression=''){
  const raw=String(expression||'').trim(); if(!raw)return [];
  const variants=new Set([raw]);
  const swaps=[[/[Oo]/g,'0'],[/[Il|]/g,'1'],[/×/g,'x'],[/\bx\b/g,'×'],[/÷/g,'/'],[/\^2\b/g,'²'],[/\^3\b/g,'³'],[/√\s*([0-9a-z])/gi,'√($1)']];
  for(const [rx,repl] of swaps){const v=raw.replace(rx,repl);if(v!==raw)variants.add(v);}
  return [...variants].slice(0,6);
}
async function recognizeAssignmentHandwriting(){
  const c=document.getElementById('v7-sketch-canvas'); if(!c)return; const out=document.getElementById('handwriting-result'); if(out)out.textContent='Recognizing…';
  try{
    const image=c.toDataURL('image/png');const r=await assessmentApi('recognize-handwriting',{image},30000);if(!r.expression)throw new Error('No maths was recognized.');
    const suggestions=handwritingCorrectionSuggestions(r.expression);
    if(out)out.innerHTML=`<div class="handwriting-recognized"><strong>${mathHtml(r.expression)}</strong><small>${Math.round((Number(r.confidence)||0)*100)}% confidence</small></div><p class="muted">Check the symbols before using it. Tap a corrected version if recognition confused a symbol.</p><div class="handwriting-suggestions">${suggestions.map((value,i)=>`<button class="btn ${i===0?'primary':'secondary'} small" data-action="use-handwriting-expression" data-expression="${encodeURIComponent(value)}">${mathHtml(value)}</button>`).join('')}</div>`;
  }catch(error){
    if(out){
      const message=String(error?.message||'Recognition failed.');
      const setup=/not configured|service unavailable|could not be reached|endpoint was not found/i.test(message);
      out.innerHTML=`<div class="handwriting-error"><strong>${setup?'Handwriting AI is not connected on this deployment yet.':'Could not recognise that line.'}</strong><p>${escapeHtml(setup?'Deploy the Worker-ready build and add GROQ_API_KEY. You can use the typed fallback below right now.':message)}</p></div>`;
    }
  }
}
function currentQuestionPayload(q){return {id:q.id,prompt:q.prompt,answer:q.answer,exactAnswer:q.exactAnswer,workedSolution:q.workedSolution,hints:q.hints||[],type:q.type,options:q.options||[],parts:q.parts||[],acceptedAnswers:q.acceptedAnswers||[],graphMin:q.graphMin,graphMax:q.graphMax,minLength:q.minLength,complexity:q.complexity||q.difficulty||2};}
async function registerFixItem(q,raw,score=0,possible=1){
  if(!activeSchoolAssignment?.id||activeSchoolAssignment.localOnly||!account.authenticated)return;
  try{await accountClient.ensureClient().rpc('mathsexpress_register_fix_item',{p_assignment_id:activeSchoolAssignment.id,p_question_id:String(q.id),p_question_payload:currentQuestionPayload(q),p_original_score:Number(score)||0,p_score_possible:Number(possible)||1,p_first_wrong_answer:typeof raw==='string'?raw:JSON.stringify(raw)});}catch{}
}
async function openFixMode(assignmentId=activeSchoolAssignment?.id){
  if(!assignmentId||assignmentId==='local-exam')return showToast('Fix Mode unavailable','Fix Mode is for teacher assignments.');
  try{const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_my_fix_items',{p_assignment_id:String(assignmentId)});if(error)throw error;const items=(data||[]).filter(x=>x.status==='open');if(!items.length)return showToast('Nothing to fix','You have no open mistakes for this assignment.','success');fixModeSession={assignmentId:String(assignmentId),items,index:0,feedback:null}; if(!activeSchoolAssignment)activeSchoolAssignment={id:String(assignmentId),assignmentTitle:'Fix Mode',className:'Assigned work',localOnly:false,startedAt:Date.now(),synced:true,returnRoute:'student-hub'}; if(activeSchoolAssignment?.testMode) void enterAssignmentFullscreen({quiet:true}); startAssignmentTimer(); go('assignment','fix');}catch(error){showToast('Fix Mode unavailable',error.message||'Try again.');}
}
function renderFixMode(){
  const view=document.getElementById('app-view'); const f=fixModeSession; if(!f||!f.items?.length)return openFixMode(f?.assignmentId);
  if(f.index>=f.items.length){view.innerHTML=`<div class="assignment-workspace">${assignmentTopBarHtml({title:'Fix Mode complete',subtitle:'Corrections finished',total:f.items.length,index:f.items.length-1,results:[]})}<main class="assignment-workspace-main"><section class="assignment-problem-area"><div class="card empty-state"><h2>You fixed every available mistake.</h2><p>Your teacher can see the corrected attempts.</p><button class="btn primary" data-action="leave-assignment">Back to Class</button></div></section></main></div>`;return;}
  const item=f.items[f.index],q=item.question_payload||{}; view.innerHTML=`<div class="assignment-workspace">${assignmentTopBarHtml({title:'Fix Mode',subtitle:'Correct mistakes before the deadline',total:f.items.length,index:f.index,results:[]})}<main class="assignment-workspace-main"><section class="assignment-problem-area"><div class="assignment-question-row"><span class="assignment-question-badge">${f.index+1}</span><div class="assignment-question-copy"><div class="assignment-question-meta"><span>Correction</span><span>${Number(item.original_score)||0}/${Number(item.score_possible)||1} originally</span></div><div class="assignment-question-prompt">${mathHtml(q.prompt||'Question')}</div></div></div><div class="assignment-current-step"><span class="assignment-equals">=</span><div class="assignment-answer-control"><input id="fix-answer" class="answer-input" placeholder="Enter your corrected answer"></div></div>${f.feedback?`<div class="feedback ${f.feedback.correct?'correct':'wrong'}"><strong>${f.feedback.correct?'Corrected':'Not fixed yet'}</strong><p>${escapeHtml(f.feedback.message||'')}</p></div>`:''}</section></main><footer class="assignment-bottom-bar"><div><button class="assignment-submit" data-action="fix-check-answer">Check correction</button></div><div><span>${f.index+1} of ${f.items.length}</span></div></footer></div>`;
}
async function checkFixAnswer(){const f=fixModeSession;if(!f)return;const item=f.items[f.index],q=item.question_payload||{};const raw=String(document.getElementById('fix-answer')?.value||'').trim();if(!raw)return showToast('Enter an answer','Correct the question first.');const correct=validateAnswer({prompt:q.prompt||'',answer:q.answer,exactAnswer:q.exactAnswer,type:q.type||'numeric',options:q.options||[],acceptedAnswers:q.acceptedAnswers||[],parts:q.parts||[]},raw).correct||symbolicEquivalent(raw,String(q.answer??''));if(!correct){f.feedback={correct:false,message:'That still does not match the correct result. Review your method and try again.'};return renderFixMode();}const recovered=Math.max(Number(item.original_score)||0,Number(item.score_possible)||1);try{const {error}=await accountClient.ensureClient().rpc('mathsexpress_complete_fix_item',{p_assignment_id:f.assignmentId,p_question_id:String(item.question_id),p_fixed_score:recovered});if(error)throw error;}catch(error){return showToast('Could not save correction',error.message);}f.feedback=null;f.index++;flashBoardResult(true);setTimeout(renderFixMode,650);}
function workbookMultiplier(streak){return streak>=12?4:streak>=7?3:streak>=3?2:1;}
function applyWorkbookStreak(correct){const streak=correct?(Number(state.workbookQuestionStreak)||0)+1:0;const mult=workbookMultiplier(streak);persist({...state,workbookQuestionStreak:streak,workbookMultiplier:mult},{quiet:true});return{streak,mult};}
function startTextbookReadTracking(sectionId){textbookReadTracker={sectionId,lastAt:Date.now(),maxScroll:0};if(textbookReadTimer)clearInterval(textbookReadTimer);textbookReadTimer=setInterval(flushTextbookReadTracking,15000);}
function updateTextbookScrollDepth(){if(!textbookReadTracker.sectionId)return;const doc=document.documentElement;const max=Math.max(1,doc.scrollHeight-innerHeight);const pct=Math.max(0,Math.min(100,Math.round((scrollY/max)*100)));textbookReadTracker.maxScroll=Math.max(textbookReadTracker.maxScroll,pct);}
async function flushTextbookReadTracking({completed=false}={}){if(!textbookReadTracker.sectionId||!account.authenticated)return;const now=Date.now();const sec=Math.max(0,Math.round((now-textbookReadTracker.lastAt)/1000));if(sec<2&&!completed)return;textbookReadTracker.lastAt=now;try{await accountClient.ensureClient().rpc('mathsexpress_record_textbook_reading',{p_section_id:textbookReadTracker.sectionId,p_seconds:sec,p_scroll:textbookReadTracker.maxScroll,p_completed:Boolean(completed)});}catch{}}
function scorecardModal(assignmentId){openSimpleModal('Assessment Scorecard','<div class="school-loading"><span class="spinner"></span><strong>Building scorecard…</strong></div>');accountClient.ensureClient().rpc('mathsexpress_assignment_scorecard',{p_assignment_id:String(assignmentId)}).then(({data,error})=>{if(error)throw error;const rows=data?.students||[];openSimpleModal(`Scorecard · ${escapeHtml(data?.assignment?.title||'Assessment')}`,`<div class="v82-scorecard"><div class="v82-scorecard-head"><b>Student</b><b>Result</b><b>Step marks</b><b>Fixes</b><b>Integrity</b><b>Actions</b></div>${rows.map(r=>`<div><span>${escapeHtml(r.display_name||r.email||'Student')}</span><strong>${Math.round(Number(r.score_percent)||0)}%</strong><span>${Number(r.step_marks)||0}/${Number(r.step_possible)||0}</span><span>${Number(r.fixed_count)||0}</span><span>${Number(r.integrity_events)||0}</span><div class="scorecard-actions"><button class="btn ghost small" data-action="open-assessment-review" data-assignment-id="${escapeHtml(assignmentId)}" data-student-id="${escapeHtml(r.user_id)}" data-student-name="${escapeHtml(r.display_name||'Student')}">Review work</button><button class="btn ghost small" data-action="open-mark-override" data-assignment-id="${escapeHtml(assignmentId)}" data-student-id="${escapeHtml(r.user_id)}" data-student-name="${escapeHtml(r.display_name||'Student')}">Override mark</button></div></div>`).join('')||'<p>No student attempts yet.</p>'}</div><div class="simple-modal-actions"><button class="btn primary" data-action="open-custom-assignment">Create follow-up task</button><button class="btn secondary" data-action="open-bulk-assign">Bulk adaptive task</button></div>`);}).catch(e=>showToast('Scorecard unavailable',e.message));}
function openMarkOverrideModal(assignmentId,studentId,studentName){openSimpleModal('Override AI mark',`<form id="mark-override-form" class="school-form"><input type="hidden" name="assignmentId" value="${escapeHtml(assignmentId)}"><input type="hidden" name="studentId" value="${escapeHtml(studentId)}"><h3>${escapeHtml(studentName||'Student')}</h3><label>Question ID<input name="questionId" required placeholder="question id"></label><div class="form-two"><label>Mark awarded<input name="score" type="number" step="0.5" min="0" required></label><label>Out of<input name="possible" type="number" step="0.5" min="0.5" value="3" required></label></div><label>Teacher rationale<textarea name="comment" rows="4" placeholder="Why you changed the mark"></textarea></label><button class="btn primary" type="submit">Save override</button></form>`);}
function printableWorksheetHtml(task,count=12){const run=createUniqueGeneratedTaskRun({...task,questionCount:Math.max(1,Math.min(30,count))});const qs=run.questions||[];return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(task.title||'MathsExpress Worksheet')}</title><style>body{font:15px Arial,sans-serif;color:#111;margin:32px}h1{margin-bottom:4px}.q{margin:22px 0;page-break-inside:avoid}.space{height:70px;border-bottom:1px solid #ddd}.answers{page-break-before:always}.solution{margin:12px 0 22px;padding:12px;border:1px solid #ccc} @media print{button{display:none}}</style></head><body><h1>${escapeHtml(task.title||'MathsExpress Worksheet')}</h1><p>Year ${task.yearLevel||''} · ${escapeHtml(task.topic||'Mathematics')}</p>${qs.map((q,i)=>`<div class="q"><b>${i+1}.</b> ${escapeHtml(q.prompt)}<div class="space"></div></div>`).join('')}<section class="answers"><h1>Answer key & worked solutions</h1>${qs.map((q,i)=>`<div class="solution"><b>${i+1}. ${escapeHtml(String(q.answer??''))}</b><p>${escapeHtml(q.workedSolution||'Work through the method shown in the digital task.')}</p></div>`).join('')}</section></body></html>`;}
function openPrintableWorksheet(taskId){const task=getTaskById(taskId)||TASK_LIBRARY[0];if(!task)return;const w=window.open('','_blank');if(!w)return showToast('Popup blocked','Allow popups to create the printable worksheet.');w.document.write(printableWorksheetHtml(task,12));w.document.close();setTimeout(()=>w.print(),300);}


async function recordAssessmentIntegrity(eventType,payload={}){
  if(!account.authenticated||!activeSchoolAssignment?.id||activeSchoolAssignment.localOnly)return;
  try{await accountClient.ensureClient().rpc('mathsexpress_record_integrity_event',{p_assignment_id:String(activeSchoolAssignment.id),p_event_type:String(eventType),p_payload:payload||{}});}catch{}
}
function currentTutorialContext(){
  const q=currentGeneratedTask?.current||currentLesson?.current||null;
  const task=currentGeneratedTask?.task||null;
  return {skillId:String(task?.skillId||q?.skillId||currentLesson?.lessonId||''),topic:String(task?.topic||q?.topic||'Mathematics'),prompt:String(q?.prompt||'')};
}
async function openTutorialVideoModal(){
  const ctx=currentTutorialContext(); openSimpleModal('Question tutorial videos','<div class="school-loading"><span class="spinner"></span><strong>Finding videos for this skill…</strong></div>');
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_list_tutorial_videos',{p_skill_id:ctx.skillId||null,p_topic:ctx.topic||null,p_school_id:null}); if(error)throw error;
    const rows=data||[];
    openSimpleModal('Question tutorial videos',`<div class="v82-video-list">${rows.length?rows.map(v=>`<article><div><strong>${escapeHtml(v.title)}</strong><small>${escapeHtml(v.topic||ctx.topic)}${v.duration_seconds?` · ${Math.ceil(Number(v.duration_seconds)/60)} min`:''}</small></div><a class="btn secondary small" href="${escapeHtml(v.url)}" target="_blank" rel="noopener">Open video</a></article>`).join(''):`<div class="school-empty"><strong>No video is attached to this skill yet.</strong><p>Your teacher can attach a YouTube or Vimeo tutorial from the class tools.</p></div>`}</div>`);
  }catch(error){showToast('Videos unavailable',error.message||'Try again.');}
}
function openTutorialVideoManager(){
  const schoolId=selectedSchoolId||teacherHubClasses.find(c=>String(c.id)===String(selectedTeacherClassId))?.school_id||'';
  openSimpleModal('Attach tutorial video',`<form id="tutorial-video-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><label>Skill ID / lesson ID<input name="skillId" placeholder="e.g. simplify or year9-algebra"></label><label>Topic<input name="topic" value="Mathematics"></label><label>Video title<input name="title" required placeholder="Solving linear equations step by step"></label><label>YouTube / Vimeo URL<input name="url" type="url" required placeholder="https://youtube.com/..."></label><label>Duration (seconds)<input name="duration" type="number" min="1" max="14400"></label><button class="btn primary" type="submit">Attach video</button></form>`);
}
async function openAssessmentReviewModal(assignmentId,studentId,studentName='Student'){
  openSimpleModal(`Review · ${studentName}`,'<div class="school-loading"><span class="spinner"></span><strong>Loading the real submission…</strong></div>');
  try{
    const client=accountClient.ensureClient(); const [{data,error},{data:integrity,error:integrityError}]=await Promise.all([
      client.rpc('mathsexpress_assignment_question_review',{p_assignment_id:String(assignmentId),p_student_id:String(studentId)}),
      client.rpc('mathsexpress_assignment_integrity_log',{p_assignment_id:String(assignmentId),p_student_id:String(studentId)})
    ]); if(error)throw error; if(integrityError)throw integrityError;
    const attempts=data?.attempts||[],steps=data?.steps||[],overrides=data?.overrides||[],fixes=data?.fixes||[];
    openSimpleModal(`Review · ${escapeHtml(studentName)}`,`<div class="v82-review-summary"><span><b>${attempts.length}</b> submissions</span><span><b>${steps.length}</b> marked steps</span><span><b>${fixes.filter(x=>x.status==='fixed').length}</b> fixes</span><span><b>${(integrity||[]).length}</b> integrity events</span></div><div class="v82-review-list">${attempts.length?attempts.map((a,i)=>`<article><header><strong>Question ${escapeHtml(a.question_id||String(i+1))}</strong><span>${Number(a.score_awarded||0)}/${Number(a.score_possible||1)} marks</span></header><p><b>Answer:</b> ${mathHtml(a.answer_text||'No final answer')}</p>${Array.isArray(a.working)&&a.working.length?`<ol>${a.working.map(w=>`<li>${mathHtml(typeof w==='string'?w:(w.text||JSON.stringify(w)))}</li>`).join('')}</ol>`:''}${a.feedback?`<p class="muted"><b>Feedback:</b> ${escapeHtml(a.feedback)}</p>`:''}${a.marking_rationale?`<details><summary>AI marking rationale</summary><p>${escapeHtml(a.marking_rationale)}</p></details>`:''}</article>`).join(''):'<div class="school-empty">No submitted question attempts yet.</div>'}</div><h3>Integrity timeline</h3><div class="v82-integrity-list">${(integrity||[]).map(e=>`<div><strong>${escapeHtml(String(e.event_type).replaceAll('-',' '))}</strong><small>${new Date(e.created_at).toLocaleString()}</small><span>${escapeHtml(JSON.stringify(e.payload||{}))}</span></div>`).join('')||'<p>No tab/fullscreen/paste events recorded.</p>'}</div>${overrides.length?`<p class="muted">${overrides.length} teacher mark override${overrides.length===1?'':'s'} saved.</p>`:''}`);
  }catch(error){showToast('Review unavailable',error.message||'Try again.');}
}
function openBulkAssignModal(){
  const classes=teacherHubClasses.filter(c=>!c.archived); const task=TASK_LIBRARY.find(t=>String(t.id)===String(taskLibraryFilters.skillId))||TASK_LIBRARY[0];
  if(!classes.length)return showToast('Create a class first','Bulk assignment needs at least one class.');
  openSimpleModal('Bulk assign work',`<form id="bulk-assign-form" class="school-form"><label>Assignment title<input name="title" value="${escapeHtml(task?.title||'Adaptive maths practice')}" required></label><label>Task<select name="taskId">${TASK_LIBRARY.slice(0,150).map(t=>`<option value="${escapeHtml(t.id)}">Year ${t.yearLevel} · ${escapeHtml(t.skill)}</option>`).join('')}</select></label><fieldset><legend>Classes</legend><div class="v82-check-grid">${classes.map(c=>`<label><input type="checkbox" name="classIds" value="${escapeHtml(c.id)}"> ${escapeHtml(c.name)}</label>`).join('')}</div></fieldset><div class="form-two"><label>Mode<select name="mode"><option value="adaptive">Adaptive difficulty</option><option value="custom">Use task difficulty</option></select></label><label>Due date<input name="dueAt" type="datetime-local" value="${localInputDateTime(7)}"></label></div><button class="btn primary" type="submit">Assign to selected classes</button></form>`);
}
function openRecognitionModal(){
  if(!canUseTeacherHub(account))return;
  const students=(lastTeacherReport?.students||[]).filter(st=>st.userId||st.user_id||st.student_id||st.id); if(!students.length)return showToast('Open a class report first','Recognition is sent to students in the current class.');
  openSimpleModal('Recognition sticker + note',`<form id="recognition-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(selectedTeacherClassId||'')}"><label>Student<select name="studentId">${students.map(st=>`<option value="${escapeHtml(st.userId||st.user_id||st.student_id||st.id||'')}">${escapeHtml(st.displayName||st.display_name||'Student')}</option>`).join('')}</select></label><label>Sticker<select name="sticker"><option value="star">Star</option><option value="great-working">Great working</option><option value="persistence">Persistence</option><option value="accuracy">Accuracy</option><option value="improvement">Improvement</option></select></label><label>Teacher note<textarea name="message" rows="4" placeholder="Great improvement in algebra today."></textarea></label><button class="btn primary" type="submit">Send to dashboard</button></form>`);
}
async function openClassExpeditionModal(){
  const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id; if(!classId)return showToast('Choose a class','Open a class first.');
  try{const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_get_expedition',{p_class_id:String(classId)});if(error)throw error;const pct=Math.min(100,Math.round(100*Number(data?.progress||0)/Math.max(1,Number(data?.target||1000))));openSimpleModal('Monthly class expedition',`<div class="v82-expedition"><span class="eyebrow">${escapeHtml(data?.month||'This month')}</span><h2>${escapeHtml(data?.title||'Monthly Maths Expedition')}</h2><p>The whole class contributes points by completing maths. Everyone wins when the class reaches the target.</p><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><strong>${Number(data?.progress||0).toLocaleString()} / ${Number(data?.target||1000).toLocaleString()} points</strong><small>${pct}% complete · ${escapeHtml(data?.status||'active')}</small></div>`);}catch(error){showToast('Expedition unavailable',error.message);}
}
async function openTextbookResources(sectionId,{teacher=false}={}){
  const schoolId=selectedSchoolId||teacherHubClasses[0]?.school_id||null; const section=getTextbookSection(sectionId); openSimpleModal(teacher?'Teacher facilitation resources':'Section resources','<div class="school-loading"><span class="spinner"></span><strong>Loading resources…</strong></div>');
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_textbook_resources',{p_section_id:String(sectionId),p_school_id:schoolId});if(error)throw error;const rows=data||[];const pack=section?textbookFacilitationPack(section):null;
    const generated=teacher&&pack?`<section class="facilitation-pack"><span class="eyebrow">Built-in facilitation pack</span><h3>${escapeHtml(section.title)}</h3><div class="facilitation-flow"><article><b>Launch</b><p>${escapeHtml(pack.launch)}</p></article><article><b>Model</b><p>${escapeHtml(pack.model)}</p></article><article><b>Check</b><p>${escapeHtml(pack.check)}</p></article><article><b>Practice</b><p>${escapeHtml(pack.practice)}</p></article><article><b>Close</b><p>${escapeHtml(pack.close)}</p></article></div><h4>Teacher prompts</h4><ul>${pack.questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ul><p><strong>Differentiation:</strong> ${escapeHtml(pack.differentiation)}</p></section><hr>`:'';
    openSimpleModal(teacher?'Teacher facilitation resources':'Section resources',`${generated}${teacher?`<form id="textbook-resource-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId||'')}"><input type="hidden" name="sectionId" value="${escapeHtml(sectionId)}"><div class="form-two"><label>Type<select name="type"><option value="teacher-note">Teacher note</option><option value="activity">Activity</option><option value="worksheet">Worksheet</option><option value="discussion">Discussion prompt</option><option value="extension">Extension</option><option value="video">Video</option></select></label><label>Title<input name="title" required></label></div><label>Instructions / content<textarea name="body" rows="4"></textarea></label><label>Optional URL<input name="url" type="url"></label><button class="btn primary" type="submit">Attach resource</button></form><hr>`:''}<div class="v82-resource-list">${rows.map(r=>`<article><span>${escapeHtml(r.resource_type)}</span><strong>${escapeHtml(r.title)}</strong>${r.body?`<p>${escapeHtml(r.body)}</p>`:''}${r.url?`<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">Open resource</a>`:''}</article>`).join('')||'<div class="school-empty">No extra school resources are attached yet.</div>'}</div>`);
  }catch(error){
    if(teacher&&section){const pack=textbookFacilitationPack(section);openSimpleModal('Teacher facilitation resources',`<section class="facilitation-pack"><span class="eyebrow">Built-in facilitation pack</span><h3>${escapeHtml(section.title)}</h3><div class="facilitation-flow"><article><b>Launch</b><p>${escapeHtml(pack.launch)}</p></article><article><b>Model</b><p>${escapeHtml(pack.model)}</p></article><article><b>Check</b><p>${escapeHtml(pack.check)}</p></article><article><b>Practice</b><p>${escapeHtml(pack.practice)}</p></article><article><b>Close</b><p>${escapeHtml(pack.close)}</p></article></div><ul>${pack.questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ul><p><strong>Differentiation:</strong> ${escapeHtml(pack.differentiation)}</p></section>`);return;}
    showToast('Resources unavailable',error.message);
  }
}
async function openTemplateFoldersModal({includeArchived=false}={}){
  openSimpleModal('Task template folders','<div class="school-loading"><span class="spinner"></span><strong>Loading templates…</strong></div>');
  try{
    let result=await accountClient.ensureClient().rpc('mathsexpress_list_assignment_templates_v866',{p_include_archived:Boolean(includeArchived)});
    if(result.error)result=await accountClient.ensureClient().rpc('mathsexpress_list_assignment_templates_v86',{});
    if(result.error)result=await accountClient.ensureClient().rpc('mathsexpress_list_assignment_templates',{});
    if(result.error)throw result.error;
    const rows=(result.data||[]).map(t=>({...t,can_edit:t.can_edit===true||(t.can_edit===undefined&&!t.shared&&String(t.share_scope||'private')==='private'),archived:Boolean(t.archived)})); templateLifecycleRows=rows;
    const folders=new Map();for(const t of rows){const f=String(t.folder_path||'/').replace(/\+/g,'/').replace(/\/{2,}/g,'/');if(!folders.has(f))folders.set(f,[]);folders.get(f).push(t);}
    const folderHtml=[...folders.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([folder,items])=>{const depth=Math.max(0,folder.split('/').filter(Boolean).length-1);const label=folder==='/'?'Unfiled':folder.split('/').filter(Boolean).pop();return `<section class="template-folder-node" style="--folder-depth:${depth}"><h3><span>${depth?'↳':'📂'}</span>${escapeHtml(label)}</h3><small class="folder-path">${escapeHtml(folder)}</small>${items.map(t=>{const scope=t.share_scope||(t.shared?'school':'private');const sharedWarning=t.can_edit===false?'<div class="template-author-warning">Shared template · duplicate it before making changes.</div>':'';return `<article class="template-lifecycle-card ${t.archived?'archived':''}"><div><strong>${escapeHtml(t.name)}</strong><small>${scope==='district'?'District shared':scope==='school'?'School shared':'Private'} · ${Number(t.payload?.questions||0)||'Custom'} questions${t.archived?' · Archived':''}</small>${sharedWarning}</div><div class="template-actions">${t.can_edit!==false?`<button class="btn ghost small" data-action="edit-template" data-template-id="${escapeHtml(t.id)}">Edit</button>`:''}<button class="btn ghost small" data-action="duplicate-template" data-template-id="${escapeHtml(t.id)}">Duplicate</button>${t.can_edit!==false&&!t.archived?`<button class="btn ghost small" data-action="archive-template" data-template-id="${escapeHtml(t.id)}">Archive</button>`:''}</div></article>`}).join('')}</section>`;}).join('');
    openSimpleModal('Task template folders',`<div class="simple-modal-actions template-toolbar"><button class="btn primary small" data-action="v7-assignment-template">New template</button><button class="btn secondary small" data-action="toggle-archived-templates" data-show-archived="${includeArchived?'0':'1'}">${includeArchived?'Hide archived':'Show archived'}</button><span class="muted">Edit, duplicate, archive and organise with nested paths such as /Year 9/Algebra/Term 2.</span></div><div class="v82-template-folders nested-template-folders">${folderHtml||'<div class="school-empty">No saved templates yet.</div>'}</div>`);
  }catch(error){showToast('Templates unavailable',error.message);}
}
function openTemplateLifecycleEditor(templateId){
  const t=templateLifecycleRows.find(x=>String(x.id)===String(templateId)); if(!t)return showToast('Template unavailable','Refresh the template folder first.');
  if(t.can_edit===false)return openSimpleModal('Shared template',`<div class="status-banner warning"><b>This template belongs to another author.</b><p>Duplicate it first so the original author’s version is not changed.</p></div><button class="btn primary" data-action="duplicate-template" data-template-id="${escapeHtml(t.id)}">Duplicate template</button>`);
  const scope=t.share_scope||(t.shared?'school':'private');
  openSimpleModal('Edit template',`<form id="template-lifecycle-edit-form" class="school-form"><input type="hidden" name="templateId" value="${escapeHtml(t.id)}"><label>Template name<input name="title" value="${escapeHtml(t.name||'Assignment Template')}" required></label><label>Folder / subfolder<input name="folder" value="${escapeHtml(t.folder_path||'/')}"></label><div class="form-two"><label>Questions<input name="questions" type="number" min="5" max="100" value="${Number(t.payload?.questions)||20}"></label><label>Difficulty<select name="difficulty">${['adaptive','easy','medium','hard'].map(v=>`<option value="${v}" ${String(t.payload?.difficulty||'adaptive')===v?'selected':''}>${v}</option>`).join('')}</select></label></div><label>Sharing<select name="shareScope"><option value="private" ${scope==='private'?'selected':''}>Private</option><option value="school" ${scope==='school'?'selected':''}>Share with school</option><option value="district" ${scope==='district'?'selected':''}>Share across district</option></select></label><label><input name="ai" type="checkbox" ${t.payload?.aiAllowed!==false?'checked':''}> AI helper allowed</label><label><input name="games" type="checkbox" ${t.payload?.gamesAllowed?'checked':''}> Game rewards allowed during task</label><div class="status-banner"><b>Author protection</b><p>Only the template owner can edit or archive this original. Shared users get a duplicate instead.</p></div><button class="btn primary" type="submit">Save changes</button></form>`);
}
async function duplicateTemplateLifecycle(templateId){
  try{const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_duplicate_assignment_template_v866',{p_template_id:String(templateId)});if(error)throw error;showToast('Template duplicated','A private editable copy was created in the same folder.','success');openTemplateFoldersModal();}catch(error){showToast('Could not duplicate template',error.message||'Apply the v8.6.6 database migration.');}
}
async function archiveTemplateLifecycle(templateId){
  try{const {error}=await accountClient.ensureClient().rpc('mathsexpress_archive_assignment_template_v866',{p_template_id:String(templateId),p_archived:true});if(error)throw error;showToast('Template archived','It is hidden from the active template library.','success');openTemplateFoldersModal();}catch(error){showToast('Could not archive template',error.message||'Apply the v8.6.6 database migration.');}
}


function assignmentByIdForTeacher(assignmentId){
  return (lastTeacherReport?.assignments||[]).find(a=>String(a.id)===String(assignmentId))
    || (lastSchoolReportContext?.allAssignments||[]).find(a=>String(a.id)===String(assignmentId)) || null;
}
function copyTaskShareLink(taskId,title='Task'){
  const id=String(taskId||'').trim(); if(!id||!getTaskById(id))return showToast('Share link unavailable','This assignment does not have a reusable Task Library ID.');
  const url=new URL(globalThis.location.href); url.hash=`generated-task/${id}`;
  const text=url.toString();
  if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>showToast('Task share link copied',`${title} can be opened from the copied link.`,'success')).catch(()=>openSimpleModal('Task share link',`<input value="${escapeHtml(text)}" readonly onclick="this.select()">`));}
  else openSimpleModal('Task share link',`<p>Copy this link:</p><input value="${escapeHtml(text)}" readonly onclick="this.select()">`);
}
async function reopenAssignmentFromReport(assignmentId){
  const a=assignmentByIdForTeacher(assignmentId); if(!a)return showToast('Assignment unavailable','Refresh the class report and try again.');
  const due=new Date(); due.setDate(due.getDate()+7); due.setHours(23,59,0,0);
  try{await getSchoolClient().updateAssignmentControls(assignmentId,{paused:false,dueAt:due.toISOString()});a.due_at=due.toISOString();if(a.config)a.config.paused=false;showToast('Assignment reopened',`Students can work on it again until ${formatSchoolDate(due.toISOString())}.`,'success');if(routeFromHash().route==='teacher-class')renderTeacherClass();}
  catch(error){showToast('Could not reopen assignment',error.message||'Try again.');}
}
function exportSingleTaskReport(assignmentId){
  const a=assignmentByIdForTeacher(assignmentId); if(!a)return showToast('Report unavailable','Refresh the class report and try again.');
  const attempts=(lastTeacherReport?.attempts||[]).filter(x=>String(x.assignment_id)===String(assignmentId));
  const students=lastTeacherReport?.students||[];
  const rows=students.map(st=>{const sid=String(st.user_id||st.student_id||st.userId||'');const mine=attempts.filter(x=>String(x.student_id||x.user_id||'')===sid);const completed=mine.some(x=>x.completed_at);const avg=mine.length?Math.round(mine.reduce((n,x)=>n+Number(x.score_percent||0),0)/mine.length):0;return {student:st.display_name||st.email||'Student',email:st.email||'',status:completed?'Completed':mine.length?'In progress':'Not started',score_percent:avg,attempts:mine.length,due_at:a.due_at||''};});
  const header=['Student','Email','Status','Score %','Attempts','Due'];
  const csv=[header.join(','),...rows.map(r=>[r.student,r.email,r.status,r.score_percent,r.attempts,r.due_at].map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(','))].join('\n');
  downloadTextFile(`MathsExpress-${String(a.title||'task').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')}-report.csv`,csv,'text/csv;charset=utf-8');
  showToast('Task report exported','CSV downloaded with each student’s task status.','success');
}
async function openMatureTaskReport(assignmentId,view='students'){
  const a=assignmentByIdForTeacher(assignmentId); if(!a)return showToast('Report unavailable','Refresh the class report and try again.');
  openSimpleModal(`Task report · ${escapeHtml(a.title||'Assignment')}`,'<div class="school-loading"><span class="spinner"></span><strong>Loading task evidence…</strong></div>');
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_task_question_report',{p_assignment_id:String(assignmentId)}); if(error)throw error;
    activeTaskReport={assignment:a,questionData:data||{questions:[],grid:[]}};
    renderMatureTaskReport(view);
  }catch(error){
    activeTaskReport={assignment:a,questionData:{questions:[],grid:[]}};
    renderMatureTaskReport(view);
    if(!/does not exist|schema cache|could not find/i.test(String(error?.message||''))) showToast('Question analysis unavailable',error.message||'The student summary is still available.');
  }
}
function renderMatureTaskReport(view='students'){
  const a=activeTaskReport?.assignment; if(!a)return;
  const attempts=(lastTeacherReport?.attempts||[]).filter(x=>String(x.assignment_id)===String(a.id));
  const students=lastTeacherReport?.students||[];
  const completed=new Set(attempts.filter(x=>x.completed_at).map(x=>String(x.student_id||x.user_id||''))).size;
  const avg=attempts.length?Math.round(attempts.reduce((n,x)=>n+Number(x.score_percent||0),0)/attempts.length):0;
  const expired=Boolean(a.due_at&&new Date(a.due_at)<new Date()); const taskId=String(a.config?.task_library_id||'');
  let questions=Array.isArray(activeTaskReport?.questionData?.questions)?[...activeTaskReport.questionData.questions]:[];
  const sortMetric=['correct','partial','incorrect'].includes(taskReportQuestionSort)?taskReportQuestionSort:'incorrect';
  if(view==='questions') questions.sort((a,b)=>Number(b?.[sortMetric]||0)-Number(a?.[sortMetric]||0)||String(a?.question_id||'').localeCompare(String(b?.question_id||'')));
  const grid=Array.isArray(activeTaskReport?.questionData?.grid)?activeTaskReport.questionData.grid:[];
  const allowed=['students','questions','grid']; if(!allowed.includes(view))view='students';
  const tabs=`<div class="task-report-tabs"><button class="${view==='students'?'active':''}" data-action="task-report-view" data-view="students">Students</button><button class="${view==='questions'?'active':''}" data-action="task-report-view" data-view="questions">Questions</button><button class="${view==='grid'?'active':''}" data-action="task-report-view" data-view="grid">Grid view</button></div>`;
  let body='';
  if(view==='students'){
    body=`<div class="task-report-students">${students.map(st=>{const sid=String(st.user_id||st.student_id||st.userId||'');const mine=attempts.filter(x=>String(x.student_id||x.user_id||'')===sid);const done=mine.some(x=>x.completed_at);const score=mine.length?Math.round(mine.reduce((n,x)=>n+Number(x.score_percent||0),0)/mine.length):0;return `<article class="class-task-row"><div><strong>${escapeHtml(st.display_name||st.email||'Student')}</strong><small>${done?'Completed':mine.length?'In progress':'Not started'}</small></div><b>${score}%</b></article>`}).join('')||'<div class="school-empty">No students yet.</div>'}</div>`;
  }else if(view==='questions'){
    body=questions.length?`<div class="task-question-sort"><span>Sort questions by</span>${['incorrect','partial','correct'].map(metric=>`<button class="${taskReportQuestionSort===metric?'active':''}" data-action="task-report-sort" data-sort="${metric}">${metric[0].toUpperCase()+metric.slice(1)}</button>`).join('')}</div><div class="task-question-list">${questions.map((q,i)=>{const total=Math.max(1,Number(q.attempts)||0),c=Number(q.correct)||0,p=Number(q.partial)||0,w=Number(q.incorrect)||0;return `<article class="task-question-row"><button class="task-question-open" data-action="open-question-detail" data-question-id="${escapeHtml(q.question_id||'')}"><strong>Question ${i+1}</strong><small>${escapeHtml(q.question_id||'Question')}</small><div class="task-question-status"><i class="correct" style="width:${100*c/total}%"></i><i class="partial" style="width:${100*p/total}%"></i><i class="incorrect" style="width:${100*w/total}%"></i></div></button><span><b>${c}</b><small> correct</small></span><span><b>${p}</b><small> partial</small></span><span><b>${w}</b><small> incorrect</small></span><div class="task-question-actions"><button class="btn primary small" data-action="open-question-detail" data-question-id="${escapeHtml(q.question_id||'')}">Student answers</button><button class="btn ghost small" data-action="try-report-question" data-question-id="${escapeHtml(q.question_id||'')}">Try</button></div></article>`}).join('')}</div>`:'<div class="school-empty">Question-level results appear after students answer questions.</div>';
  }else{
    const qids=[...new Set((questions.length?questions.map(q=>String(q.question_id)):grid.map(g=>String(g.question_id))).filter(Boolean))];
    const names=new Map(); for(const g of grid)names.set(String(g.student_id),g.display_name||'Student');
    const sids=[...names.keys()]; const cell=new Map(grid.map(g=>[`${g.student_id}|${g.question_id}`,g]));
    body=qids.length&&sids.length?`<div class="task-grid-scroll"><table class="task-grid-table"><thead><tr><th>Student</th>${qids.map((_,i)=>`<th>Q${i+1}</th>`).join('')}</tr></thead><tbody>${sids.map(sid=>`<tr><td>${escapeHtml(names.get(sid)||'Student')}</td>${qids.map(qid=>{const g=cell.get(`${sid}|${qid}`);const status=g?.status||'';return `<td title="${escapeHtml(qid)}" class="report-status-${status||'none'}">${status==='correct'?'✓':status==='partial'?'◐':status==='incorrect'?'×':'—'}</td>`}).join('')}</tr>`).join('')}</tbody></table></div>`:'<div class="school-empty">Grid results appear after students answer questions.</div>';
  }
  const actionBar=`<div class="task-report-action-grid"><button class="btn primary" data-action="open-scorecard" data-assignment-id="${escapeHtml(a.id)}">Student work</button>${questions.length?`<button class="btn secondary" data-action="create-hardest-revision" data-assignment-id="${escapeHtml(a.id)}">Revision from hardest 5</button>`:''}<button class="btn secondary" data-action="print-actual-task" data-assignment-id="${escapeHtml(a.id)}">Print actual task</button><button class="btn secondary" data-action="print-task-report" data-assignment-id="${escapeHtml(a.id)}">Print report</button><button class="btn secondary" data-action="task-to-template" data-assignment-id="${escapeHtml(a.id)}">Save as template</button><button class="btn secondary" data-action="reassign-task-report" data-assignment-id="${escapeHtml(a.id)}">Reassign</button><button class="btn secondary" data-action="export-single-task-report" data-assignment-id="${escapeHtml(a.id)}">Export CSV</button>${taskId?`<button class="btn ghost" data-action="copy-task-share-link" data-task-id="${escapeHtml(taskId)}" data-task-title="${escapeHtml(a.title||'Task')}">Share task</button>`:''}${expired?`<button class="btn ghost" data-action="reopen-assignment" data-assignment-id="${escapeHtml(a.id)}">Reopen 7 days</button>`:''}<button class="btn ghost" data-action="assignment-controls" data-assignment-id="${escapeHtml(a.id)}">Controls</button></div>`;
  openSimpleModal(`Task report · ${escapeHtml(a.title||'Assignment')}`,`<div class="teacher-metrics task-report-metrics"><article><span>Completed</span><strong>${completed}/${students.length}</strong><small>students</small></article><article><span>Average</span><strong>${avg}%</strong><small>submitted attempts</small></article><article><span>Questions</span><strong>${Number(a.question_count||questions.length||0)}</strong><small>${escapeHtml(a.assignment_type||'practice')}</small></article><article><span>Status</span><strong>${expired?'Expired':'Open'}</strong><small>${escapeHtml(formatSchoolDate(a.due_at))}</small></article></div>${tabs}${body}${actionBar}`);
}
async function openTaskQuestionDetail(questionId){
  const a=activeTaskReport?.assignment;if(!a)return;
  openSimpleModal('Question student answers','<div class="school-loading"><span class="spinner"></span><strong>Loading answers…</strong></div>');
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_task_question_detail',{p_assignment_id:String(a.id),p_question_id:String(questionId)});
    if(error)throw error;
    const rows=Array.isArray(data)?data:[];
    openSimpleModal(`Question · ${escapeHtml(questionId)}`,`<div class="question-answer-detail-list">${rows.map(r=>`<article><header><strong>${escapeHtml(r.display_name||'Student')}</strong><span class="tag ${r.correct?'green':r.partial?'amber':'red'}">${r.correct?'Correct':r.partial?'Partial':'Incorrect'}</span></header><div class="question-answer-text"><b>Answer</b><span>${escapeHtml(r.answer_text||'—')}</span></div><div class="question-answer-score"><span>${Number(r.score_awarded||0)} / ${Number(r.score_possible||0)} marks</span><span>${Number(r.time_seconds||0)}s</span></div>${r.feedback?`<p><b>Feedback:</b> ${escapeHtml(r.feedback)}</p>`:''}${r.marking_rationale?`<p><b>Marking:</b> ${escapeHtml(r.marking_rationale)}</p>`:''}${Array.isArray(r.working)&&r.working.length?`<details><summary>Working</summary><pre>${escapeHtml(JSON.stringify(r.working,null,2))}</pre></details>`:''}</article>`).join('')||'<div class="school-empty">No answers recorded for this question yet.</div>'}</div>`);
  }catch(error){showToast('Could not load student answers',error.message||'Try again.');}
}
function printTaskReport(assignmentId){
  const a=assignmentByIdForTeacher(assignmentId)||activeTaskReport?.assignment;if(!a)return;
  const questions=activeTaskReport?.questionData?.questions||[];
  const attempts=(lastTeacherReport?.attempts||[]).filter(x=>String(x.assignment_id)===String(a.id));
  const avg=attempts.length?Math.round(attempts.reduce((n,x)=>n+Number(x.score_percent||0),0)/attempts.length):0;
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(a.title||'Task')} report</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#222}h1{margin:0 0 8px}.meta{color:#666;margin-bottom:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>${escapeHtml(a.title||'Task')}</h1><div class="meta">${escapeHtml(a.assignment_type||'practice')} · ${avg}% average · Due ${escapeHtml(formatSchoolDate(a.due_at))}</div><table><thead><tr><th>Question</th><th>Correct</th><th>Partial</th><th>Incorrect</th><th>Average score</th></tr></thead><tbody>${questions.map((q,i)=>`<tr><td>Q${i+1} · ${escapeHtml(q.question_id||'')}</td><td>${Number(q.correct)||0}</td><td>${Number(q.partial)||0}</td><td>${Number(q.incorrect)||0}</td><td>${Math.round(Number(q.average_score_percent)||0)}%</td></tr>`).join('')}</tbody></table></body></html>`;
  const win=window.open('','_blank','noopener,noreferrer');if(!win)return showToast('Print blocked','Allow pop-ups for MathsExpress, then try again.');win.document.write(html);win.document.close();setTimeout(()=>win.print(),120);
}
async function saveTaskAsTemplate(assignmentId){
  const a=assignmentByIdForTeacher(assignmentId)||activeTaskReport?.assignment;if(!a)return;
  try{const {error}=await accountClient.ensureClient().rpc('mathsexpress_task_to_template',{p_assignment_id:String(a.id),p_name:String(a.title||'Task'),p_folder:'/',p_share_scope:'private'});if(error)throw error;showToast('Template saved','A reusable private template was created from this task.','success');}
  catch(error){showToast('Could not create template',error.message||'Try again.');}
}
async function reassignTaskFromReport(assignmentId){
  const a=assignmentByIdForTeacher(assignmentId)||activeTaskReport?.assignment;if(!a)return;
  const due=new Date(Date.now()+7*86400000);due.setHours(23,59,0,0);
  try{const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_reassign_assignment',{p_assignment_id:String(a.id),p_due_at:due.toISOString(),p_title:String(a.title||'Task')});if(error)throw error;showToast('Task reassigned',`A fresh copy is due ${formatSchoolDate(due.toISOString())}.`,'success');document.getElementById('modal-root').innerHTML='';if(routeFromHash().route==='teacher-class')void renderTeacherClass();}
  catch(error){showToast('Could not reassign task',error.message||'Try again.');}
}

function tryReportQuestion(questionId){
  const a=activeTaskReport?.assignment; if(!a)return;
  const custom=a.config?.custom_worksheet?.questions||[];
  let q=custom.find(x=>String(x.id)===String(questionId));
  if(!q){const taskId=String(a.config?.task_library_id||'');const task=getTaskById(taskId);if(task){const run=createUniqueGeneratedTaskRun({...task,questionCount:10});q=(run.questions||[]).find(x=>String(x.id)===String(questionId))||run.questions?.[0];}}
  if(!q)return showToast('Question preview unavailable','The report evidence is saved, but this older generated question cannot be reconstructed exactly.');
  openSimpleModal('Try Question',`<div class="card question-card"><span class="eyebrow">Teacher preview</span><div class="math-prompt">${mathHtml(q.prompt||'Question')}</div>${q.options?.length?`<div class="answer-options">${q.options.map(o=>`<div class="option">${mathHtml(o.label??o.text??o)}</div>`).join('')}</div>`:''}<details><summary>Answer & solution</summary><p><strong>${mathHtml(String(q.answerText??q.answer??''))}</strong></p><p>${mathHtml(q.workedSolution||'')}</p></details></div>`);
}
async function createHardestRevision(assignmentId){
  const a=assignmentByIdForTeacher(assignmentId)||activeTaskReport?.assignment;if(!a)return;
  const hardest=(activeTaskReport?.questionData?.questions||[]).slice(0,5).map(q=>String(q.question_id||'')).filter(Boolean);
  const classId=String(a.class_id||a.classId||selectedTeacherClassId||'');if(!classId)return showToast('Class unavailable','Open this report from a class first.');
  const custom=a.config?.custom_worksheet?.questions||[]; const chosen=hardest.map(id=>custom.find(q=>String(q.id)===id)).filter(Boolean);
  const due=new Date(Date.now()+7*86400000);due.setHours(23,59,0,0);
  try{
    const config={source_assignment_id:a.id,source_question_ids:hardest};
    if(chosen.length)config.custom_worksheet={id:`hardest-${Date.now()}`,title:`${a.title} · Hardest 5 revision`,createdAt:new Date().toISOString(),questions:chosen.slice(0,5),yearLevel:lastTeacherReport?.class?.year_level||9};
    await getSchoolClient().createAndAssignTask({classId,title:`${a.title} · Hardest 5 revision`,type:'revision',topic:a.topic||'Mathematics',lessonId:a.lesson_id||'',taskLibraryId:a.config?.task_library_id||'',difficulty:'adaptive',questionCount:5,dueAt:due.toISOString(),hintsAllowed:true,videosAllowed:true,tutorAllowed:true,calculatorEnabled:true,config});
    showToast('Revision created','A 5-question revision task was assigned from the hardest question evidence.','success');
    document.getElementById('modal-root').innerHTML=''; if(routeFromHash().route==='teacher-class')renderTeacherClass();
  }catch(error){showToast('Could not create revision',error.message||'Try again.');}
}
async function openLearningEngagementCompass(){
  const classId=selectedTeacherClassId||lastTeacherReport?.class?.id;if(!classId)return showToast('Open a class first','Choose a class to view engagement.');
  openSimpleModal('Learning Engagement Compass','<div class="school-loading"><span class="spinner"></span><strong>Loading engagement…</strong></div>');
  try{
    const end=new Date(),start=new Date(Date.now()-30*86400000);
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_engagement_scatter',{p_class_id:String(classId),p_start_at:start.toISOString(),p_end_at:end.toISOString()});
    if(error)throw error;
    const rows=Array.isArray(data?.students)?data.students:[];activeEngagementData=rows;
    const profileCounts=['Efficient','Persevering','Struggling','Sporadic','Inactive'].map(profile=>({profile,count:rows.filter(r=>r.profile===profile).length}));
    const maxEffort=Math.max(20,...rows.map(r=>Number(r.weekly_questions)||0));
    const maxGain=Math.max(.5,...rows.map(r=>Number(r.skill_gains_per_week)||0));
    const dots=rows.map(r=>{
      const effort=Number(r.weekly_questions)||0,gain=Number(r.skill_gains_per_week)||0;
      const x=Math.max(3,Math.min(97,(effort/maxEffort)*94+3));
      const y=Math.max(3,Math.min(97,(gain/maxGain)*94+3));
      return `<button class="engagement-dot profile-${String(r.profile||'sporadic').toLowerCase()}" style="left:${x}%;bottom:${y}%" data-action="open-engagement-student" data-student-id="${escapeHtml(r.student_id)}" title="${escapeHtml(r.display_name)} · ${escapeHtml(r.profile)} · ${gain.toFixed(2)} skill gains/wk · ${effort.toFixed(1)} questions/wk"><span>${escapeHtml(String(r.display_name||'?').trim().charAt(0).toUpperCase())}</span></button>`;
    }).join('');
    openSimpleModal('Learning Engagement Compass',`<div class="engagement-report-head"><div><strong>Last 30 days</strong><span>${rows.length} students · click a dot for the student report</span></div></div><div class="status-banner"><b>Effort × skill gains</b><p>X-axis = questions completed per week. Y-axis = estimated secure skills/mastery gains per week. MathsExpress uses transparent thresholds because another platform’s exact proprietary cut-offs are not public.</p></div><div class="engagement-profile-strip">${profileCounts.map(x=>`<article class="profile-${x.profile.toLowerCase()}"><strong>${x.count}</strong><span>${x.profile}</span></article>`).join('')}</div><div class="engagement-scatter-wrap"><div class="engagement-y-label">Skill gains / week ↑</div><div class="engagement-scatter"><span class="quadrant q1">Persevering</span><span class="quadrant q2">Efficient</span><span class="quadrant q3">Inactive / Sporadic</span><span class="quadrant q4">Struggling</span><i class="axis-v"></i><i class="axis-h"></i>${dots||'<div class="school-empty">No activity evidence yet.</div>'}</div><div class="engagement-x-label">Questions completed / week →</div></div><div class="engagement-legend">${['Efficient','Persevering','Struggling','Sporadic','Inactive'].map(x=>`<span class="profile-${x.toLowerCase()}"><i></i>${x}</span>`).join('')}</div>`);
  }catch(error){showToast('Engagement report unavailable',error.message||'Try again.');}
}
function openEngagementStudent(studentId){
  const r=activeEngagementData.find(x=>String(x.student_id)===String(studentId));if(!r)return showToast('Student report unavailable','Refresh the Engagement Compass.');
  openSimpleModal(`Engagement · ${escapeHtml(r.display_name||'Student')}`,`<div class="teacher-metrics"><article><span>Profile</span><strong>${escapeHtml(r.profile||'Sporadic')}</strong></article><article><span>Questions / week</span><strong>${Number(r.weekly_questions||0).toFixed(1)}</strong></article><article><span>Skill gains / week</span><strong>${Number(r.skill_gains_per_week||0).toFixed(2)}</strong></article><article><span>Accuracy</span><strong>${Math.round(Number(r.accuracy)||0)}%</strong></article></div><div class="simple-list"><div><strong>Questions in range</strong><span>${Number(r.questions)||0}</span></div><div><strong>Secure skills evidence</strong><span>${Number(r.secure_skills)||0}</span></div><div><strong>Active days</strong><span>${Number(r.active_days)||0}</span></div><div><strong>Active time</strong><span>${Math.round(Number(r.active_seconds||0)/60)} minutes</span></div><div><strong>Task completion</strong><span>${Math.round(Number(r.completion)||0)}%</span></div><div><strong>Average task score</strong><span>${Math.round(Number(r.avg_score)||0)}%</span></div></div><div class="simple-modal-actions"><button class="btn primary" data-action="open-teacher-feedback" data-student-id="${escapeHtml(r.student_id)}">Give feedback</button><button class="btn secondary" data-action="open-year-override" data-student-id="${escapeHtml(r.student_id)}">Learning settings</button></div>`);
}
async function loadStandardsGrowthReport({schoolId,start,end,year='all'}={}){
  const sid=String(schoolId||selectedSchoolId||v7CurrentSchoolId()||'');if(!sid)return showToast('Choose a school first','Open School first.');
  const startIso=new Date(start||Date.now()-90*86400000).toISOString();const endIso=new Date(end||Date.now()).toISOString();const yearValue=year==='all'||year===''?null:Number(year);
  openSimpleModal('Standards Growth','<div class="school-loading"><span class="spinner"></span><strong>Loading standards growth…</strong></div>');
  try{
    const [{data:growth,error:gerr},{data:current,error:cerr}]=await Promise.all([
      accountClient.ensureClient().rpc('mathsexpress_standards_growth',{p_school_id:sid,p_start_at:startIso,p_end_at:endIso,p_year_level:yearValue}),
      accountClient.ensureClient().rpc('mathsexpress_school_standards_proficiency',{p_school_id:sid})
    ]);if(gerr)throw gerr;if(cerr)throw cerr;
    const rows=Array.isArray(growth?.skills)?growth.skills:[];const currentMap=new Map((current?.skills||[]).map(r=>[String(r.skill_id),r]));
    const filter=`<form id="standards-growth-filter-form" class="report-filter-bar"><input type="hidden" name="schoolId" value="${escapeHtml(sid)}"><label>From<input type="date" name="start" value="${startIso.slice(0,10)}"></label><label>To<input type="date" name="end" value="${endIso.slice(0,10)}"></label><label>Year<select name="year"><option value="all" ${yearValue==null?'selected':''}>All years</option>${YEAR_LEVEL_OPTIONS.map(o=>`<option value="${o.value}" ${yearValue===o.value?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}</select></label><button class="btn primary small" type="submit">Apply</button></form>`;
    const table=`<div class="standards-growth-table"><div class="standards-growth-row head"><b>Skill / standard</b><b>Students</b><b>Start</b><b>End</b><b>Growth</b><b>Current mastery</b></div>${rows.map(r=>{const cur=currentMap.get(String(r.skill_id));const g=Number(r.growth||0);return `<div class="standards-growth-row"><span>${escapeHtml(r.skill_id||'Skill')}</span><span>${Number(r.students)||0}</span><span>${Math.round(Number(r.start_proficiency)||0)}%</span><span>${Math.round(Number(r.end_proficiency)||0)}%</span><strong class="${g>=0?'positive':'negative'}">${g>=0?'+':''}${g.toFixed(1)}</strong><span>${Math.round(Number(cur?.average_mastery)||0)}%</span></div>`}).join('')||'<div class="school-empty">No question evidence in this date range.</div>'}</div>`;
    openSimpleModal('Standards Growth',`${filter}<div class="teacher-metrics"><article><span>Current students</span><strong>${Number(current?.students)||0}</strong></article><article><span>Current mastery</span><strong>${Math.round(Number(current?.average_mastery)||0)}%</strong></article><article><span>Skills in range</span><strong>${rows.length}</strong></article></div>${table}`);
  }catch(error){showToast('Standards report unavailable',error.message||'Try again.');}
}
async function openStandardsProficiencyReport(){
  const schoolId=selectedSchoolId||v7CurrentSchoolId();if(!schoolId)return showToast('Choose a school first','Open School first.');
  return loadStandardsGrowthReport({schoolId,start:new Date(Date.now()-90*86400000),end:new Date(),year:'all'});
}
function openStudentYearOverrideModal(studentId){
  const student=(lastTeacherReport?.students||[]).find(st=>String(st.user_id)===String(studentId));
  if(!student)return showToast('Student unavailable','Refresh the class report and try again.');
  const classYear=normaliseYearLevel(lastTeacherReport?.class?.year_level,9);
  openSimpleModal('Temporary year-level override',`<form id="year-override-form" class="school-form"><input type="hidden" name="studentId" value="${escapeHtml(student.user_id)}"><input type="hidden" name="classId" value="${escapeHtml(selectedTeacherClassId||'')}"><h3>${escapeHtml(student.display_name||'Student')}</h3><p class="muted">Normally the student automatically follows the class year level (${escapeHtml(yearLabel(classYear))}). Use an override only when needed; it expires automatically.</p><div class="form-two"><label>Temporary year level<select name="yearLevel">${YEAR_LEVEL_OPTIONS.map(o=>`<option value="${o.value}" ${o.value===classYear?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}</select></label><label>Expires<input name="expiresAt" type="datetime-local" value="${localInputDateTime(30)}" required></label></div><div class="simple-modal-actions"><button class="btn primary" type="submit">Save temporary override</button><button class="btn secondary" type="button" data-action="clear-year-override" data-student-id="${escapeHtml(student.user_id)}" data-class-id="${escapeHtml(selectedTeacherClassId||'')}">Return to class year</button></div></form>`);
}

async function openClassTextbookFocusModal(){
  const classId=selectedTeacherClassId; if(!classId)return showToast('Open a class first','Choose a class to set its textbook focus.');
  const cls=lastTeacherReport?.class||{}; let settings={textbook_focus:cls.textbook_focus||'',auto_assign_year:true};
  try{settings={...settings,...await getSchoolClient().getClassLearningSettings(classId)}}catch{}
  const y=normaliseYearLevel(cls.year_level,9);
  const publisherOptions=TEXTBOOK_PUBLISHERS.map(pub=>{
    const books=getPublisherTextbookBooks(pub,y,'all');
    return `<optgroup label="${escapeHtml(pub)}">${books.map(b=>{const value=textbookFocusValue(b,pub);const stored=String(settings.textbook_focus||'');const selected=stored===value||(!stored.includes('::')&&pub==='Cambridge'&&(stored===String(b.baseBookId||b.id)||(b.legacyIds||[]).includes(stored)));return `<option value="${escapeHtml(value)}" ${selected?'selected':''}>${escapeHtml(textbookFocusOptionLabel(b,pub))}</option>`}).join('')}</optgroup>`;
  }).join('');
  openSimpleModal('Default class textbook',`<form id="class-learning-settings-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><h3>${escapeHtml(cls.name||'Class')}</h3><p class="muted">Choose the publisher view, pathway and default textbook for this class. Students will open this catalogue view automatically when their class settings are applied.</p><label>Default textbook / pathway<select name="textbookFocus"><option value="">Use the year-level default</option>${publisherOptions}</select></label><p class="muted">Cambridge and Jacaranda are shown as catalogue publisher labels. MathsExpress-generated lessons are not claimed as official publisher content unless licensed material is added by the school.</p><label class="check-row"><input type="checkbox" name="autoAssignYear" ${settings.auto_assign_year!==false?'checked':''}> Automatically set students to ${escapeHtml(yearLabel(y))} when they join</label><button class="btn primary" type="submit">Save class learning settings</button></form>`);
}

function plannerMonthLabel(date){return date.toLocaleDateString(undefined,{month:'long',year:'numeric'});}
function openClassPlannerCalendar(){
  const assignments=lastTeacherReport?.assignments||[]; if(!lastTeacherReport)return showToast('Open a class first','The planner uses the current class assignments.');
  const first=new Date(teacherPlannerMonth.getFullYear(),teacherPlannerMonth.getMonth(),1); const start=new Date(first); start.setDate(1-first.getDay());
  const cells=[];
  for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=localDateString(d);const dayRows=assignments.filter(a=>a.due_at&&localDateString(new Date(a.due_at))===key);cells.push(`<div class="class-planner-day ${d.getMonth()===first.getMonth()?'':'outside'}" data-planner-date="${key}"><b>${d.getDate()}</b>${dayRows.map(a=>`<button draggable="true" class="class-planner-event" data-assignment-id="${escapeHtml(a.id)}" title="Drag to move due date">${escapeHtml(a.title)}</button>`).join('')}</div>`);}
  openSimpleModal('Class Planner',`<div class="planner-calendar-wrap"><div class="planner-calendar-head"><button class="btn ghost small" data-action="planner-prev">←</button><h2>${escapeHtml(plannerMonthLabel(first))}</h2><button class="btn ghost small" data-action="planner-next">→</button><button class="btn secondary small" data-action="planner-today">Today</button></div><p class="muted">Drag an assignment to another day to change its due date. Its existing due-time is kept.</p><div class="planner-weekdays">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=>`<span>${x}</span>`).join('')}</div><div class="class-planner-grid">${cells.join('')}</div></div>`);
}

async function movePlannerAssignment(assignmentId,dateKey){
  const a=(lastTeacherReport?.assignments||[]).find(x=>String(x.id)===String(assignmentId));if(!a)return;
  const old=a.due_at?new Date(a.due_at):new Date(); const parts=String(dateKey).split('-').map(Number); if(parts.length!==3)return;
  const target=new Date(parts[0],parts[1]-1,parts[2],old.getHours()||15,old.getMinutes()||0,0,0);
  try{await getSchoolClient().updateAssignmentControls(assignmentId,{dueAt:target.toISOString()});a.due_at=target.toISOString();showToast('Planner updated',`${a.title} is now due ${formatSchoolDate(a.due_at)}.`,'success');openClassPlannerCalendar();}catch(error){showToast('Could not move task',error.message||'Try again.');}
}

function openTextbookTaskSearch(query=''){
  const q=String(query||'').trim(); const results=searchTextbookSeries(q,{yearLevel:null,pathway:'all',limit:120});
  openSimpleModal('Search every textbook',`<form id="textbook-task-search-form" class="school-form textbook-global-search"><label>Search all K–12 textbook sections<input name="query" value="${escapeHtml(q)}" placeholder="e.g. expanding quadratics, fractions, probability" autofocus></label><button class="btn primary" type="submit">Search textbooks</button></form><div class="textbook-global-results">${results.slice(0,60).map(sec=>`<article><div><span class="eyebrow">${escapeHtml(yearLabel(sec.yearLevel))} · ${escapeHtml(sec.pathway||'Core')}</span><strong>${escapeHtml(sec.title)}</strong><small>${escapeHtml(sec.chapterTitle||sec.strand||'Mathematics')} · ~${Number(sec.exercises?.[0]?.estimatedMinutes||10)} min</small></div><div class="simple-actions"><button class="btn ghost small" data-action="open-textbook-section" data-section-id="${escapeHtml(sec.id)}">Preview</button><button class="btn primary small" data-action="assign-textbook-task" data-task-id="${escapeHtml(sec.checkpointTaskId||sec.reviewTaskId||'')}">Assign checkpoint</button></div></article>`).join('')||'<div class="school-empty">No textbook sections matched that search.</div>'}</div>`);
}

function textbookEngageActivity(section){
  const vocab=(section.vocabulary||[]).slice(0,3); const examples=(section.workedExamples||[]);
  return {title:`Notice, predict, explain`,prompt:`Before reading the method, study ${examples[0]?.prompt||section.shortTitle}. Write one thing you notice, one result you predict, and one reason.`,discussion:`Compare two different approaches using ${vocab.join(', ')||'the key vocabulary'}. Which approach is clearer and why?`,extension:`Create a similar example that would catch a common mistake, then explain the correction.`};
}
function textbookFacilitationPack(section){
  const engage=textbookEngageActivity(section);return {launch:`5 min: ${engage.prompt}`,model:`10 min: Model the first worked example, asking students to justify each step rather than copy it.`,check:`8 min: Use the checkpoint and ask students to explain one answer to a partner.`,practice:`15–25 min: Use the exercise bands; move students up only when accuracy and working are secure.`,close:`5 min: Exit question — state the key rule in your own words and give one mistake to avoid.`,questions:[`What changed from the previous line?`,`How can you check that result another way?`,`Which part of the question tells you what operation or method to use?`],differentiation:`Support: use the first exercise band and vocabulary prompts. Extend: use the challenge task and require a second method or justification.`};
}

function assignmentBottomBarHtml({accepted=false,checkAction,nextAction,hintAction,hintsAllowed=true,testMode=false,stepMarking=false}={}) {
  const helpAction=stepMarking?'assignment-request-next-step':hintAction;
  const canReview=Boolean(currentGeneratedTask?.questionResults?.length);
  return `<footer class="assignment-bottom-bar"><div class="assignment-bottom-inner"><div class="assignment-bottom-left">${canReview?`<button class="assignment-review-previous" type="button" data-action="review-previous-question">← Previous solved</button>`:''}${accepted?`<button class="assignment-submit muted" type="button" disabled>Submitted</button>`:`<button class="assignment-submit" data-action="${escapeHtml(checkAction)}">Check final answer</button>`}</div><div class="assignment-bottom-right">${!accepted&&hintsAllowed&&!testMode?`<button class="assignment-next-step" data-action="${escapeHtml(helpAction)}">Next Step</button>`:''}${accepted?`<button class="assignment-next-primary" data-action="${escapeHtml(nextAction)}">Next question →</button>`:''}</div></div></footer>`;
}

function renderLesson() {
  const view = document.getElementById('app-view');
  const { param: lessonId } = routeFromHash();
  const lesson = getLessonById(lessonId);
  if (!lesson) { view.innerHTML = `<div class="page"><div class="card empty-state"><div class="big">?</div><h2>Lesson not found</h2><button class="btn primary" data-route="learn">Back to Learn</button></div></div>`; return; }
  if (!currentLesson || currentLesson.lessonId !== lesson.id) {
    currentLesson = null;
    startLesson(lesson.id);
    return;
  }

  if (currentLesson.complete) {
    if(!activeSchoolAssignment) document.body?.classList.remove('assignment-focus-mode','assignment-test-lock');
    if(activeSchoolAssignment){ activeSchoolAssignment.completed=true; activeSchoolAssignment.gamesLocked=false; syncStudentFocusStatus('idle',{force:true}); }
    const mastery = Math.round(state.lessonMastery?.[lesson.id] ?? 0);
    if (activeSchoolAssignment && !activeSchoolAssignment.localOnly && !activeSchoolAssignment.synced && (!activeSchoolAssignment.lessonId || activeSchoolAssignment.lessonId === lesson.id)) {
      activeSchoolAssignment.synced = true;
      const snapshot = { ...activeSchoolAssignment };
      completeSchoolAssignmentAndReward(snapshot, { answered:snapshot.answered, correct:snapshot.correct, timeSeconds:Math.round((Date.now()-snapshot.startedAt)/1000), masteryAfter:mastery })
        .then((reward)=>showToast('Assignment complete', reward>0?`Result sent · +${reward} coins earned`:'Your result has been sent to your teacher.', 'success'))
        .catch((error)=>showToast('Progress saved locally', error.message || 'Teacher sync failed.'));
    }
    view.innerHTML = `
      <div class="page"><div class="card empty-state pop">
        <div class="big">🏆</div><span class="eyebrow">Lesson complete</span><h2>${escapeHtml(lesson.title)}</h2>
        <p>You completed every challenge in this run. Your lesson mastery is now <strong>${mastery}%</strong>.</p>
        <div class="hero-actions" style="justify-content:center">${activeSchoolAssignment?`<button class="btn primary" data-action="leave-assignment">← Back to ${activeSchoolAssignment.localOnly?'Learn':'Class'}</button>`:`<button class="btn primary" data-action="restart-lesson" data-lesson-id="${lesson.id}">Practise again</button><button class="btn secondary" data-route="learn">Back to Algebra Path</button>`}</div>
      </div></div>`;
    return;
  }

  const q = currentLesson.current;
  const lessonPool=getQuestionsForLesson(lesson.id);
  const currentLessonIndex=Math.max(0,Math.min(currentLesson.asked.length-1,Number.isFinite(Number(currentLesson.currentIndex))?Number(currentLesson.currentIndex):currentLesson.asked.length-1));
  const progress = Math.round((currentLesson.asked.length / lessonPool.length) * 100);
  const lessonHints=safeLessonHints(q);
  const hintText = currentLesson.hintCount > 0 ? lessonHints[Math.min(currentLesson.hintCount - 1, lessonHints.length - 1)] : '';
  const feedbackHtml = currentLesson.feedback ? `
    <div class="feedback ${currentLesson.feedback.correct ? 'correct' : 'wrong'} pop">
      <strong>${currentLesson.feedback.correct ? '✓ Correct!' : 'Not quite yet'}</strong>
      <p>${currentLesson.feedback.correct ? `+${q.xp} XP and coins earned. Nice work.` : 'Try again, use a hint, or check the worked solution after another attempt.'}</p>
    </div>` : '';
  const solution = currentLesson.showSolution ? `<div class="solution-box"><strong>Worked solution:</strong><br>${mathHtml(q.workedSolution)}</div>` : '';

  if (activeSchoolAssignment) {
    const accepted=Boolean(currentLesson.feedback?.correct);
    const title=activeSchoolAssignment.assignmentTitle||lesson.title||'Assigned work';
    const due=activeSchoolAssignment.dueAt?`Due ${formatSchoolDate(activeSchoolAssignment.dueAt)}`:'Assigned practice';
    const subtitle=`${activeSchoolAssignment.className||'MathsExpress class'} · ${due}`;
    const history=currentLesson.attemptHistory||[];
    view.innerHTML=`<div class="assignment-workspace">
      ${assignmentTopBarHtml({title,subtitle,total:lessonPool.length,index:currentLessonIndex,progressAction:'jump-lesson-question',results:currentLesson.asked.map((id,i)=>{const st=currentLesson.questionStates?.[String(id)];return i===currentLessonIndex?currentLesson.feedback?.correct:st?.feedback?.correct;})})}
      ${assignmentTestModeBannerHtml()}
      <main class="assignment-workspace-main">
        <section class="assignment-problem-area">
          <div class="assignment-question-row"><span class="assignment-question-badge">${currentLessonIndex+1}</span><div class="assignment-question-copy"><div class="assignment-question-meta"><span>${escapeHtml(lesson.title)}</span>${difficultyBars(q.difficulty)}</div><div class="assignment-question-prompt">${mathHtml(q.prompt)}</div></div></div>
          ${q.type==='step-entry'?`<div class="assignment-working-block"><label for="lesson-working">Working</label><textarea id="lesson-working" class="working-input" placeholder="Write your working here if it helps…"></textarea></div>`:''}
          ${assignmentStepPanelHtml(currentLesson,q)}
          ${assignmentAttemptHistoryHtml(history,activeSchoolAssignment.tutorAllowed!==false && !activeSchoolAssignment.testMode)}
          ${!accepted?`<div class="assignment-current-step"><span class="assignment-equals">=</span><div class="assignment-answer-control">${answerControl(q,currentLesson.selectedChoice)}</div></div>${assignmentMathKeyboardHtml()}`:''}
          ${hintText?`<div class="assignment-inline-hint"><span>↶</span><div><strong>Next step</strong><p>${escapeHtml(hintText)}</p></div></div>`:''}
          ${currentLesson.showSolution?`<div class="assignment-inline-solution"><strong>Worked solution</strong><p>${mathHtml(q.workedSolution)}</p></div>`:''}
          ${currentLesson.asked.length>1?`<div class="lesson-history-nav"><button type="button" class="btn ghost small" data-action="jump-lesson-question" data-question-index="${currentLessonIndex-1}" ${currentLessonIndex<=0?'disabled':''}>← Previous question</button><span>${currentLessonIndex+1} of ${currentLesson.asked.length} opened</span><button type="button" class="btn ghost small" data-action="jump-lesson-question" data-question-index="${currentLessonIndex+1}" ${currentLessonIndex>=currentLesson.asked.length-1?'disabled':''}>Next opened →</button></div>`:''}
        </section>
      </main>
      ${assignmentSideRailHtml({tutorAllowed:activeSchoolAssignment.tutorAllowed!==false,testMode:Boolean(activeSchoolAssignment.testMode),calculatorAllowed:activeSchoolAssignment.calculatorAllowed!==false,videosAllowed:activeSchoolAssignment.videosAllowed!==false,attempts:currentIncorrectAttemptCount()})}
      ${assignmentBottomBarHtml({accepted,checkAction:'check-lesson-answer',nextAction:'next-question',hintAction:'show-hint',hintsAllowed:activeSchoolAssignment.hintsAllowed!==false,testMode:Boolean(activeSchoolAssignment.testMode),stepMarking:assignmentSupportsStepMarking(q)})}
    </div>`;
    return;
  }

  view.innerHTML = `
    <div class="page">
      <div class="page-head">
        <div><span class="eyebrow">${escapeHtml(yearLabel(account.profile?.yearLevel))} Mathematics • ${Math.round(state.lessonMastery?.[lesson.id] ?? 0)}% mastery</span><h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.description)}</p></div>
        <button class="btn ghost" data-route="learn">← Leave lesson</button>
      </div>
      <div class="progress-track" style="height:6px;margin:-7px 0 18px"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="lesson-layout">
        <section class="card question-card">
          <div class="question-kicker"><span>Challenge ${currentLessonIndex+1} of ${lessonPool.length}</span>${difficultyBars(q.difficulty)}</div>
          <div class="math-prompt">${mathHtml(q.prompt)}</div>
          ${q.type === 'step-entry' ? `<label class="lock-note" for="lesson-working">Show your working</label><textarea id="lesson-working" class="working-input" placeholder="Write your steps here..."></textarea>` : ''}
          ${answerControl(q, currentLesson.selectedChoice)}
          <div class="question-actions">
            ${currentLesson.feedback?.correct ? `<button class="btn success" data-action="next-question">Next challenge →</button>` : `<button class="btn primary" data-action="check-lesson-answer">Check answer</button>`}
            <button class="btn secondary" data-action="show-hint">Hint ${currentLesson.hintCount ? `(${Math.min(currentLesson.hintCount, lessonHints.length)}/${lessonHints.length})` : ''}</button>
            ${currentLesson.attempts >= 2 ? `<button class="btn ghost" data-action="show-solution">Worked solution</button>` : ''}
          </div>
          ${hintText ? `<div class="hint-box">Hint: ${escapeHtml(hintText)}</div>` : ''}
          ${feedbackHtml}${solution}
        </section>
        <aside class="card lesson-panel">
          <span class="eyebrow">Quick lesson</span><h2>How it works</h2><p class="lock-note">${escapeHtml(lesson.explanation)}</p>
          <div class="example-box"><small>Worked example</small><div>${escapeHtml(lesson.example)}</div></div>
          <div class="section-title" style="margin:22px 0 12px"><h2>Rewards</h2></div>
          <div class="quest-row"><div class="quest-icon">✦</div><div><strong>XP</strong><small>Build your MathsExpress level</small></div><div class="quest-count">+${q.xp}</div></div>
          <div class="quest-row" style="margin-top:9px"><div class="quest-icon">◆</div><div><strong>Coins</strong><small>Buy cosmetic rewards</small></div><div class="quest-count">+1</div></div>
        </aside>
      </div>
    </div>`;
}

async function submitLessonAnswer() {
  ensureDailyMissions();
  if (!currentLesson?.current || currentLesson.feedback?.correct) return;
  const q = currentLesson.current;
  const answerEl = document.getElementById('lesson-answer');
  const raw = q.type === 'multiple-choice' ? currentLesson.selectedChoice : answerEl?.value ?? '';
  if (!String(raw).trim()) { showToast('Add an answer first', 'Choose or type an answer before checking.'); return; }
  const result = validateAnswer(q, raw);
  currentLesson.attempts += 1;
  const attemptNumber=currentLesson.attempts;
  currentLesson.feedback = { correct: result.correct };
  currentLesson.attemptHistory = [...(currentLesson.attemptHistory||[]), { rawAnswer:String(raw), correct:Boolean(result.correct), at:Date.now() }];
  currentLesson.recent.push(result.correct);
  currentLesson.recent = currentLesson.recent.slice(-3);

  const rewardKey=`lesson:${currentLesson.runId}:${q.id}`;
  if(account.authenticated&&attemptNumber===1) void getSchoolClient().recordDailyQuestionAttempt(rewardKey,result.correct).catch(()=>{});
  let nextState = applyQuestionResult(state, { eventId:`${rewardKey}:attempt:${attemptNumber}`, firstAttempt:attemptNumber===1, correct: result.correct, topic:q.topic, lessonId:q.lessonId, xp:q.xp, difficulty:q.difficulty });
  if (result.correct) nextState = awardQuestionGameTime(nextState, rewardKey);
  else nextState = { ...nextState, mistakeBook: [...(nextState.mistakeBook || []), { questionId:q.id, prompt:q.prompt, skill:getLessonById(q.lessonId)?.title || q.topic || 'Maths', correct:false, createdAt:new Date().toISOString() }].slice(-500) };
  persist(nextState, { quiet: true });

  const stepState=getStepState(currentLesson,q); const maxMarks=stepState?.marksPossible||questionMaxMarks(q); const cappedMax=Math.max(1,maxMarks-Math.max(0,Number(stepState?.nextStepCount||0)));
  const scoreAwarded=result.correct?cappedMax:Number(stepState?.marksAwarded||0);
  if (activeSchoolAssignment && !activeSchoolAssignment.localOnly && (!activeSchoolAssignment.lessonId || activeSchoolAssignment.lessonId === q.lessonId)) {
    if(attemptNumber===1) activeSchoolAssignment.answered += 1;
    if (result.correct) activeSchoolAssignment.correct += 1;
    getSchoolClient().recordQuestionAttempt({ assignmentId:activeSchoolAssignment.id, questionId:q.id, correct:result.correct, answer:raw, hintUsed:currentLesson.hintCount>0, timeSeconds:assignmentElapsedSeconds(), working:(stepState?.steps||[]).map(x=>x.text), scoreAwarded, scorePossible:maxMarks, partial:!result.correct&&scoreAwarded>0, nextStepUsed:Boolean(stepState?.nextStepUsed), retries:Math.max(0,attemptNumber-1), feedback:stepState?.feedback||'', markingRationale:stepState?.rationale||'' }).catch(()=>{});
    if(!result.correct) registerFixItem(q,raw,scoreAwarded,maxMarks);
  }

  trackActivityEvent('question-attempt','learning','answer-question',{questionId:q.id,lessonId:q.lessonId,correct:result.correct,hintUsed:currentLesson.hintCount>0,difficulty:q.difficulty,attempt:attemptNumber});
  if(attemptNumber===1) void recordIrtEvidence(q,result.correct,{skillId:q.lessonId,source:activeSchoolAssignment&&!activeSchoolAssignment.localOnly?'assignment':'lesson'});
  if (result.correct) { showToast('Correct answer', `+1 coin • +10s Game Time`, 'success'); void trackLearningUpdate(awardRemoteQuestionProgress(rewardKey,q,attemptNumber,true)); } else applyWorkbookStreak(false);
  flashBoardResult(result.correct);
  saveLessonQuestionState(); saveActiveAssignmentSession();
  renderLesson();
  // Stay on the solved question until the student chooses Next so they can review their working.
}


function startGeneratedTask(taskId,{returnRoute=null}={}) {
  clearAiChatHistoryForNewQuestion();
  const task = getTaskById(taskId);
  if (!task) return showToast('Task unavailable', 'Choose another task from the library.');
  if(!canUseTeacherHub(account) && normaliseYearLevel(task.yearLevel)!==normaliseYearLevel(account.profile?.yearLevel)) return showToast('Your year level only','Ask your teacher to change your learning level.');
  const currentRoute=routeFromHash().route;
  const origin=returnRoute||(['home','learn','learning-path','textbook','textbook-lesson'].includes(currentRoute)?currentRoute:'learn');
  currentGeneratedTask = createUniqueGeneratedTaskRun(task); currentLesson=null;
  activeSchoolAssignment={id:`practice-${Date.now()}`,classId:null,assignmentTitle:task.title||task.skill||'Practice',className:`${yearLabel(task.yearLevel??account.profile?.yearLevel??9)} · Independent practice`,dueAt:'',lessonId:'',taskId:task.id,testMode:false,tutorAllowed:true,hintsAllowed:true,calculatorAllowed:true,videosAllowed:true,gamesLocked:false,focusRequired:false,answered:0,correct:0,startedAt:Date.now(),synced:true,localOnly:true,returnRoute:origin};
  saveActiveAssignmentSession(); assessmentIntegrity={pasteEvents:0,fullscreenExits:0,tabLeaves:0,startedAt:Date.now()}; if(activeSchoolAssignment?.testMode) void enterAssignmentFullscreen({quiet:true}); startAssignmentTimer(); go('assignment',task.id);
}

function graphAxisTicksHtml(min, max) {
  const range = max - min;
  if (!(range > 0)) return '';
  const step = Math.max(1, Math.round(range / 10));
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) ticks.push(v);
  const xTicks = ticks.map((v) => `<span class="graph-tick x-tick" style="left:${(100 * (v - min) / range).toFixed(2)}%">${v}</span>`).join('');
  const yTicks = ticks.filter((v) => v !== 0).map((v) => `<span class="graph-tick y-tick" style="top:${(100 * (max - v) / range).toFixed(2)}%">${v}</span>`).join('');
  return `${xTicks}${yTicks}<span class="graph-tick origin-tick" style="left:${(100 * (0 - min) / range).toFixed(2)}%;top:${(100 * (max - 0) / range).toFixed(2)}%">0</span>`;
}

function generatedQuestionInputHtml(q, run) {
  if (q.type === 'multiple-choice') return `<div class="choice-grid">${q.options.map((option)=>`<button class="choice ${run.selectedChoice===option.id?'selected':''}" data-action="generated-choice" data-choice="${option.id}">${mathHtml(option.label)}</button>`).join('')}</div>`;
  if (q.type === 'coordinate') return `<div class="coordinate-answer"><label>x<input id="generated-coordinate-x" type="number" step="any" autocomplete="off"></label><label>y<input id="generated-coordinate-y" type="number" step="any" autocomplete="off"></label></div>`;
  if (q.type === 'graph-point') { const min=Number(q.graphMin??-10),max=Number(q.graphMax??10); return `<div class="graph-answer-wrap"><p class="muted">Click the coordinate grid or use the arrow keys, then press Enter/Space to confirm the selected point.</p><div id="generated-graph-grid" class="generated-graph-grid" data-min="${min}" data-max="${max}" role="button" tabindex="0" aria-label="Coordinate grid answer"><div class="graph-axis x"></div><div class="graph-axis y"></div>${graphAxisTicksHtml(min,max)}<div id="generated-graph-marker" class="graph-marker" hidden></div></div><div class="graph-answer-readout">Selected point: <strong id="generated-graph-output">none</strong></div></div>`; }
  if (q.type === 'number-line') { const min=Number.isFinite(Number(q.min))?Number(q.min):-10,max=Number.isFinite(Number(q.max))?Number(q.max):10,start=Math.min(max,Math.max(min,0)); return `<div class="number-line-answer" data-min="${min}" data-max="${max}"><div class="number-line-top"><span>Choose a value</span><strong id="generated-number-line-output">${start}</strong></div><div class="number-line-control"><button type="button" class="number-line-step" data-action="number-line-step" data-delta="-1" aria-label="Move one step left">−</button><div class="number-line-track-wrap"><input id="lesson-answer" type="range" min="${min}" max="${max}" step="1" value="${start}" aria-label="Choose a value on the number line"><div class="number-line-labels"><span>${min}</span><span>${Math.round((min+max)/2)}</span><span>${max}</span></div></div><button type="button" class="number-line-step" data-action="number-line-step" data-delta="1" aria-label="Move one step right">+</button></div></div>`; }
  if (q.type === 'table-entry') return `<div class="table-question-wrap"><table class="math-data-table"><thead><tr><th>Value</th><th>Frequency</th></tr></thead><tbody>${(q.rows||[]).map(row=>`<tr><td>${mathHtml(row.value)}</td><td>${mathHtml(row.frequency)}</td></tr>`).join('')}</tbody></table><label class="table-answer-label">Answer<input id="lesson-answer" class="answer-input" ${mathAnswerInputAttrs(q)} autocomplete="off" placeholder="Enter the table result"></label></div>`;
  if (q.type === 'multi-part') return `<div class="multi-part-answer">${(q.parts||[]).map((part,i)=>`<label>${mathHtml(part.label||`Part ${i+1}`)}<input class="answer-input generated-part-answer" data-part-id="${escapeHtml(part.id||String(i))}" ${mathAnswerInputAttrs({...q,answer:part.answer??q.answer,prompt:`${q.prompt||''} ${part.label||''}`})} autocomplete="off" placeholder="Answer"></label>`).join('')}</div>`;
  if (q.type === 'matching') { const rights=[...new Set((q.pairs||[]).map(p=>p.right))]; return `<div class="matching-answer">${(q.pairs||[]).map(pair=>`<label><strong>${escapeHtml(pair.left)}</strong><span>→</span><select class="generated-match-answer" data-left="${escapeHtml(pair.left)}"><option value="">Choose…</option>${rights.map(right=>`<option value="${escapeHtml(right)}">${escapeHtml(right)}</option>`).join('')}</select></label>`).join('')}</div>`; }
  if (q.type === 'drag-drop') { const shuffled=[...(q.items||[])].sort((a,b)=>String(a).localeCompare(String(b))); return `<div class="drag-drop-answer"><p class="muted">Drag or tap each tile into the answer area in the correct order.</p><div id="generated-drag-source" class="drag-tile-bank">${shuffled.map(item=>`<button type="button" class="generated-drag-tile" draggable="true" data-action="generated-drag-tile" data-value="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div><div id="generated-drag-zone" class="drag-drop-zone" aria-label="Answer order"><span class="drop-placeholder">Drop tiles here</span></div><button type="button" class="btn ghost small" data-action="generated-drag-reset">Reset order</button></div>`; }
  if (q.type === 'written-response' || q.type === 'proof') return `<textarea id="lesson-answer" class="answer-input written-answer" rows="6" autocomplete="off" placeholder="Explain your reasoning. Your teacher can review this response. (Shift+Enter to submit)"></textarea>`;
  return `<input id="lesson-answer" class="answer-input" ${mathAnswerInputAttrs(q)} autocomplete="off" placeholder="Enter your answer" />`;
}

function generatedRawAnswer(q) {
  if (q.type === 'multiple-choice') return currentGeneratedTask?.selectedChoice || '';
  if (q.type === 'coordinate') {
    const x=document.getElementById('generated-coordinate-x')?.value ?? '';
    const y=document.getElementById('generated-coordinate-y')?.value ?? '';
    return (String(x).trim() && String(y).trim()) ? [x,y] : '';
  }
  if (q.type === 'graph-point') { const grid=document.getElementById('generated-graph-grid'); const x=grid?.dataset.x,y=grid?.dataset.y; return x!==undefined&&y!==undefined?[x,y]:''; }
  if (q.type === 'multi-part') {
    const answer={}; document.querySelectorAll('.generated-part-answer').forEach(el=>answer[el.dataset.partId]=el.value); return answer;
  }
  if (q.type === 'matching') {
    const answer={}; document.querySelectorAll('.generated-match-answer').forEach(el=>answer[el.dataset.left]=el.value); return answer;
  }
  if (q.type === 'drag-drop') return Array.from(document.querySelectorAll('#generated-drag-zone .generated-drag-tile')).map(el=>el.dataset.value||el.textContent||'');
  return document.getElementById('lesson-answer')?.value ?? '';
}

function generatedAnswerIsEmpty(q, raw) {
  if (raw == null || raw === '') return true;
  if (Array.isArray(raw)) return raw.some(v=>!String(v??'').trim());
  if (typeof raw === 'object') return Object.keys(raw).length===0 || Object.values(raw).some(v=>!String(v??'').trim());
  return !String(raw).trim();
}

function openSolvedQuestionReview(index=null){
  const run=currentGeneratedTask;
  if(!run?.questionResults?.length)return showToast('No previous questions','Finish a question first.');
  const i=index===null?run.questionResults.length-1:Math.max(0,Math.min(run.questionResults.length-1,Number(index)||0));
  const result=run.questionResults[i];
  const q=run.questions[i] || run.questions.find(item=>String(item.id)===String(result?.questionId));
  if(!q||!result)return;
  openSimpleModal(`Question ${i+1} review`, `<div class="previous-question-review"><span class="eyebrow">Solved question ${i+1} of ${run.questions.length}</span><div class="math-prompt">${mathHtml(q.prompt)}</div><div class="previous-question-result ${result.correct?'correct':result.needsReview?'review':'wrong'}"><strong>${result.correct?'✓ Correct':result.needsReview?'Submitted for review':'Needs another look'}</strong><span>${Number(result.attempts)||1} attempt${Number(result.attempts)===1?'':'s'}</span></div>${result.rawAnswer?`<div class="previous-question-answer"><small>Your answer</small><strong>${mathHtml(assignmentAttemptText(result.rawAnswer))}</strong></div>`:''}<p class="muted">Review-only: this cannot change marks or award the question twice.</p></div>`);
}

function renderGeneratedTask() {
  const view = document.getElementById('app-view');
  const { param: taskId } = routeFromHash();
  const task = getTaskById(taskId);
  if (!task) { view.innerHTML = `<div class="page"><div class="card empty-state"><div class="big">?</div><h2>Task not found</h2><button class="btn primary" data-route="learn">Back to Learn</button></div></div>`; return; }
  if (!currentGeneratedTask || currentGeneratedTask.task.id !== task.id) currentGeneratedTask = createUniqueGeneratedTaskRun(task);
  const run = currentGeneratedTask;
  if(!canUseTeacherHub(account)&&Number(task.yearLevel)!==normaliseYearLevel(account.profile?.yearLevel)&&(!activeSchoolAssignment||activeSchoolAssignment.localOnly))return go('learn');
  requestAnimationFrame(restoreQuestionDraft);
  if (run.complete) {
    if(!activeSchoolAssignment) document.body?.classList.remove('assignment-focus-mode','assignment-test-lock');
    if(activeSchoolAssignment){ activeSchoolAssignment.completed=true; activeSchoolAssignment.gamesLocked=false; syncStudentFocusStatus('idle',{force:true}); }
    const accuracy = run.answered ? Math.round((run.correct / run.answered) * 100) : 0;
    recordGeneratedTaskMastery(run,task,accuracy);
    recordRecurringCheckInCompletion(task,run,accuracy);
    if (activeSchoolAssignment && !activeSchoolAssignment.localOnly && !activeSchoolAssignment.synced && activeSchoolAssignment.taskId === task.id) {
      activeSchoolAssignment.synced = true;
      const snapshot = { ...activeSchoolAssignment };
      completeSchoolAssignmentAndReward(snapshot, { answered:run.answered, correct:run.correct, timeSeconds:Math.round((Date.now()-snapshot.startedAt)/1000), masteryAfter:accuracy })
        .then((reward)=>showToast('Assignment complete', reward>0?`Result sent · +${reward} coins earned`:'Your result has been sent to your teacher.', 'success'))
        .catch((error)=>showToast('Progress saved locally', error.message || 'Teacher sync failed.'));
    }
    const postRunMastery=skillMasteryValue(task.skillId,task.yearLevel);
    const continueLabel=postRunMastery>=100?'Continue more →':'Practise again';
    view.innerHTML = `<div class="page generated-task-page"><div class="card empty-state pop"><div class="big">✓</div>${cloveHtml('done')}<span class="eyebrow">Task complete</span><h2>${escapeHtml(task.skill)}</h2><p>You finished ${task.questionCount} questions with <strong>${accuracy}%</strong> attempt accuracy.</p>${postRunMastery>=100?`<p class="muted">Skill mastery: <strong>${Math.round(postRunMastery)}%</strong> — you've mastered this skill. Keep practising to build extra mastery.</p>`:''}<div class="task-finish-stats"><span><b>${run.correct}</b> correct</span><span><b>${run.answered}</b> attempts</span><span><b>${task.difficulty}</b> difficulty</span></div><div class="hero-actions" style="justify-content:center">${activeSchoolAssignment?`<button class="btn primary" data-action="leave-assignment">← Back to ${activeSchoolAssignment.localOnly?'Learn':'Class'}</button>`:`<button class="btn primary" data-action="start-library-task" data-task-id="${escapeHtml(task.id)}">${continueLabel}</button><button class="btn secondary" data-route="learn">Back to Learn</button>`}</div></div></div>`;
    return;
  }
  const q = run.current;
  const progress = generatedTaskProgress(run);
  const hintText = run.hintCount ? q.hints[Math.min(run.hintCount - 1, q.hints.length - 1)] : '';
  if(activeSchoolAssignment){
    const accepted=Boolean(run.feedback?.correct||run.feedback?.needsReview);
    const title=activeSchoolAssignment.assignmentTitle||task.title||task.skill||'Assigned work';
    const due=activeSchoolAssignment.dueAt?`Due ${formatSchoolDate(activeSchoolAssignment.dueAt)}`:(activeSchoolAssignment.localOnly?'Practice exam':'Assigned practice');
    const subtitle=`${activeSchoolAssignment.className||`Year ${task.yearLevel} ${task.pathway}`} · ${due}`;
    view.innerHTML=`<div class="assignment-workspace">
      ${assignmentTopBarHtml({title,subtitle,total:run.questions.length,index:run.index,results:run.questionResults||[]})}
      ${assignmentTestModeBannerHtml()}
      <main class="assignment-workspace-main">
        <section class="assignment-problem-area">
          <div class="assignment-question-row"><span class="assignment-question-badge">${run.index+1}</span><div class="assignment-question-copy"><div class="assignment-question-meta"><span>${escapeHtml(task.topic||task.strand||'Mathematics')}</span>${difficultyBars(q.complexity)}<span class="assignment-mark-value">${questionMaxMarks(q)} mark${questionMaxMarks(q)===1?'':'s'}</span></div><div class="assignment-question-prompt">${mathHtml(q.prompt)}</div></div></div>
          ${assignmentStepPanelHtml(run,q)}
          ${assignmentAttemptHistoryHtml(run.attemptHistory||[],activeSchoolAssignment.tutorAllowed!==false && !activeSchoolAssignment.testMode)}
          ${!accepted?`<div class="assignment-current-step ${q.type==='multiple-choice'?'choice-step':''}">${q.type==='multiple-choice'?'':`<span class="assignment-equals">=</span>`}<div class="assignment-answer-control">${generatedQuestionInputHtml(q,run)}</div></div>${!['multiple-choice','matching','drag-drop','number-line'].includes(q.type)?assignmentMathKeyboardHtml():''}`:''}
          ${hintText?`<div class="assignment-inline-hint"><span>↶</span><div><strong>Next step</strong><p>${mathHtml(hintText)}</p></div></div>`:''}
          ${run.feedback?.needsReview?`<div class="assignment-inline-review"><strong>Response submitted</strong><p>Your written reasoning has been saved for teacher review.</p></div>`:''}
        </section>
      </main>
      ${assignmentSideRailHtml({tutorAllowed:activeSchoolAssignment.tutorAllowed!==false,testMode:Boolean(activeSchoolAssignment.testMode),calculatorAllowed:activeSchoolAssignment.calculatorAllowed!==false,videosAllowed:activeSchoolAssignment.videosAllowed!==false,attempts:currentIncorrectAttemptCount()})}
      ${run.aiMarking?`<footer class="assignment-bottom-bar"><div class="assignment-bottom-inner"><div><button class="assignment-submit muted" disabled><span class="spinner small"></span> AI marking…</button></div><div><span>Checking your reasoning</span></div></div></footer>`:assignmentBottomBarHtml({accepted,checkAction:'check-generated-answer',nextAction:'generated-next',hintAction:'generated-hint',hintsAllowed:activeSchoolAssignment.hintsAllowed!==false,testMode:Boolean(activeSchoolAssignment.testMode),stepMarking:assignmentSupportsStepMarking(q)})}
    </div>`;
    return;
  }
  view.innerHTML = `<div class="page generated-task-page"><div class="page-head"><div><span class="eyebrow">Year ${task.yearLevel} · ${escapeHtml(task.pathway)} · ${escapeHtml(task.difficulty)}</span><h1>${escapeHtml(task.skill)}</h1><p>${escapeHtml(task.learningGoal)}</p></div><button class="btn ghost" data-route="${activeSchoolAssignment?.returnRoute||'learn'}">← Leave task</button></div>${assignmentProgressHtml(run.questions.length,run.index,run.questionResults)}<div class="progress-track generated-progress"><div class="progress-fill" style="width:${progress}%"></div></div><div class="lesson-layout"><section class="card question-card"><div class="question-kicker"><span>Question ${run.index+1} of ${run.questions.length}</span>${difficultyBars(q.complexity)}</div><div class="math-prompt">${mathHtml(q.prompt)}</div>${generatedQuestionInputHtml(q,run)}<div class="question-actions">${run.aiMarking?`<button class="btn primary" disabled><span class="spinner small"></span> AI marking…</button>`:run.feedback?.correct||run.feedback?.needsReview?`<button class="btn success" data-action="generated-next">Next question →</button>`:`<button class="btn primary" data-action="check-generated-answer">Check answer</button>`}<button class="btn secondary" data-action="generated-hint">Hint</button></div>${hintText?`<div class="hint-box">Hint: ${mathHtml(hintText)}</div>`:''}${run.feedback?`<div class="feedback ${run.feedback.correct?'correct':run.feedback.needsReview?'review':'wrong'} pop"><strong>${run.feedback.correct?'✓ Correct!':run.feedback.needsReview?'✓ Response submitted':'Not quite yet'}</strong><p>${run.feedback.correct?'Nice work. Continue when you are ready.':run.feedback.needsReview?'This written response is saved as a teacher-review item. Continue when you are ready.':'Try again or use a hint.'}</p></div>`:''}</section><aside class="card lesson-panel generated-task-info"><span class="eyebrow">Task details</span><h2>${escapeHtml(task.typeLabel)}</h2><p>${task.questionCount} questions · ~${task.estimatedMinutes} min</p><div class="task-detail-list"><div><span>Difficulty</span><strong>${escapeHtml(task.difficulty)}</strong></div><div><span>Strand</span><strong>${escapeHtml(task.strand)}</strong></div><div><span>Topic</span><strong>${escapeHtml(task.topic)}</strong></div><div><span>Target</span><strong>${task.masteryTarget}%</strong></div></div></aside></div></div>`;
}

async function submitGeneratedTaskAnswer() {
  ensureDailyMissions();
  if (!currentGeneratedTask?.current || currentGeneratedTask.feedback?.correct || currentGeneratedTask.feedback?.needsReview) return;
  const q = currentGeneratedTask.current;
  const raw = generatedRawAnswer(q);
  if (generatedAnswerIsEmpty(q, raw)) return showToast('Add an answer first', 'Complete the answer before checking.');
  currentGeneratedTask.uiDraft=captureQuestionDraft();
  const attemptsBefore=Number(currentGeneratedTask.attempts)||0;
  currentGeneratedTask = submitGeneratedAnswer(currentGeneratedTask, raw);
  const attemptNumber=Number(currentGeneratedTask.attempts)||attemptsBefore+1;
  const initialMarkedCorrect=Boolean(currentGeneratedTask.feedback?.correct);
  let correct = initialMarkedCorrect;
  let needsReview = Boolean(currentGeneratedTask.feedback?.needsReview);
  const stepState=getStepState(currentGeneratedTask,q); const maxMarks=stepState?.marksPossible||questionMaxMarks(q); const nextPenalty=Math.max(0,Number(stepState?.nextStepCount||0)); const cappedMax=Math.max(1,maxMarks-nextPenalty);
  let scoreAwarded=correct?cappedMax:Number(stepState?.marksAwarded||0), rationale=stepState?.rationale||'', feedback=stepState?.feedback||'';

  if((q.type==='written-response'||q.type==='proof') && activeSchoolAssignment){
    currentGeneratedTask.aiMarking=true; renderGeneratedTask();
    try{
      const ai=await assessmentApi('mark-step',{assignmentId:activeSchoolAssignment?.id&&!activeSchoolAssignment?.localOnly?String(activeSchoolAssignment.id):null,action:'mark_step',question:{prompt:q.prompt,answer:q.answer,exactAnswer:q.exactAnswer,workedSolution:q.workedSolution,type:q.type},step:String(raw),previousSteps:[...(stepState?.steps||[]).map(x=>x.text),...(stepState?.revealedSteps||[])],nextStepUsed:Number(stepState?.nextStepCount||0)>0,nextStepCount:Number(stepState?.nextStepCount||0),maxMarks});
      scoreAwarded=Math.max(0,Math.min(cappedMax,Number(ai.marks_awarded)||0)); rationale=ai.rationale||''; feedback=ai.feedback||'';
      needsReview=ai.verdict==='needs-review'; correct=Boolean(ai.final_answer_reached||scoreAwarded>=cappedMax*0.8) && !needsReview;
      currentGeneratedTask.feedback={...currentGeneratedTask.feedback,correct,needsReview,aiMarked:true,scoreAwarded,scorePossible:maxMarks,feedback,rationale};
    }catch(error){ console.warn('AI written marking unavailable',error); } finally { if(currentGeneratedTask) currentGeneratedTask.aiMarking=false; }
  }

  if(correct!==initialMarkedCorrect)currentGeneratedTask.correct=Math.max(0,currentGeneratedTask.correct+(correct?1:-1));
  const rewardKey=`generated:${currentGeneratedTask.task.id}:${currentGeneratedTask.startedAt}:${q.id}`;
  if(account.authenticated&&attemptsBefore===0) void getSchoolClient().recordDailyQuestionAttempt(rewardKey,correct).catch(()=>{});
  let nextState = state;
  if (!needsReview) {
    nextState = applyQuestionResult(state, { eventId:`${rewardKey}:attempt:${attemptNumber}`, firstAttempt:attemptsBefore===0, correct, difficulty:q.complexity, xp:q.xp, topic:'curriculum', lessonId:null });
    if (correct) nextState = awardQuestionGameTime(nextState, rewardKey);
    else nextState = { ...nextState, mistakeBook: [...(nextState.mistakeBook || []), { questionId:q.id, prompt:q.prompt, skill:currentGeneratedTask.task.skill || currentGeneratedTask.task.topic || 'Maths', correct:false, createdAt:new Date().toISOString() }].slice(-500) };
    persist(nextState, { quiet:true });
  }

  if (activeSchoolAssignment?.id && !activeSchoolAssignment.localOnly) {
    if(attemptsBefore===0) activeSchoolAssignment.answered=(activeSchoolAssignment.answered||0)+1;
    if(correct) activeSchoolAssignment.correct=(activeSchoolAssignment.correct||0)+1;
    trackLearningUpdate(getSchoolClient().recordQuestionAttempt({ assignmentId:activeSchoolAssignment.id, questionId:q.id, correct, answer:typeof raw==='string'?raw:JSON.stringify(raw), hintUsed:currentGeneratedTask.hintCount>0, timeSeconds:assignmentElapsedSeconds(), working:(stepState?.steps||[]).map(x=>x.text), scoreAwarded, scorePossible:maxMarks, partial:!correct&&scoreAwarded>0, nextStepUsed:Boolean(stepState?.nextStepUsed), retries:Math.max(0,attemptNumber-1), feedback, markingRationale:rationale }).catch(()=>{}));
    if(!correct&&!needsReview) registerFixItem(q,raw,scoreAwarded,maxMarks);
  } else {
    trackActivityEvent(needsReview?'written-response-submitted':'question-attempt','learning',needsReview?'submit-written-response':'answer-question',{questionId:q.id,taskId:currentGeneratedTask.task.id,correct:needsReview?null:correct,needsReview,hintUsed:currentGeneratedTask.hintCount>0,difficulty:q.complexity,attempt:attemptNumber});
  }
  if(!needsReview && attemptsBefore===0) void recordIrtEvidence(q,correct,{skillId:currentGeneratedTask?.task?.skillId||q.lessonId||q.topic,source:activeSchoolAssignment&&!activeSchoolAssignment.localOnly?'assignment':'adaptive'});
  if(correct) void trackLearningUpdate(awardRemoteQuestionProgress(rewardKey,q,attemptNumber,true)); else if(!needsReview) applyWorkbookStreak(false);
  flashBoardResult(needsReview ? true : correct);
  saveActiveAssignmentSession();
  renderGeneratedTask();
  // Do not auto-advance. The student chooses Next after reviewing feedback.
}



function stopDrivingTimer() {
  if (drivingTimer) { clearInterval(drivingTimer); drivingTimer = null; }
}

function startDrivingTimer() {
  stopDrivingTimer();
  if (!drivingState || !state?.gameTimeSeconds) return;
  drivingTimer = setInterval(() => {
    if (!drivingState || routeFromHash().route !== 'games') return stopDrivingTimer();
    if ((state.gameTimeSeconds || 0) <= 0) {
      stopDrivingTimer(); drivingState = null; showToast('Game Time finished', 'Complete more maths questions to earn more driving time.'); return renderGames();
    }
    persist(spendGameTime(state, 1), { quiet:true });
    const timer = document.getElementById('driving-time-left'); if (timer) timer.textContent = formatGameTime(state.gameTimeSeconds);
  }, 1000);
}

function drivingRoadHtml() {
  const q = drivingState.question;
  const track = drivingState.track || 'city';
  const mode = drivingState.mode || 'classic';
  const modeLabel = mode.replaceAll('-', ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  const trackLabel = track.replace(/\b\w/g, (m) => m.toUpperCase());
  return `<div class="driving-stage track-${escapeHtml(track)}">
    <div class="drive-hud"><span>Score <b>${drivingState.score}</b></span><span>Combo <b>x${drivingState.combo}</b></span><span>${escapeHtml(trackLabel)} · ${escapeHtml(modeLabel)}</span><span>Time <b id="driving-time-left">${formatGameTime(state.gameTimeSeconds)}</b></span></div>
    <div class="drive-question">${mathHtml(q.prompt)}</div>
    <div class="drive-road track-${escapeHtml(track)}" aria-label="Four lane maths driving game">
      ${q.options.map((opt,i)=>`<button class="drive-lane ${drivingState.lane===i?'selected':''}" data-action="drive-select-lane" data-lane="${i}"><span class="answer-gate">${escapeHtml(opt.value)}</span><span class="lane-lines"></span>${drivingState.lane===i?'<span class="drive-car">🚗</span>':''}</button>`).join('')}
    </div>
    <div class="drive-controls"><button class="btn secondary" data-action="drive-left">← Left</button><button class="btn primary" data-action="drive-submit">Drive through answer</button><button class="btn secondary" data-action="drive-right">Right →</button></div>
    <p class="lock-note">${mode==='speed-round'?'Speed Round gives bigger points for every correct lane.':mode==='perfect-streak'?'Perfect Streak heavily rewards long correct-answer combos.':mode==='obstacles'?'Obstacle Mode removes 50 points for a wrong lane.':mode==='endless'?'Endless Mode uses steady scoring for long runs.':'Use ← → to change lanes and Space/Enter to choose. Correct answers build your combo.'}</p>
  </div>`;
}


function classGameMode(modeId) {
  return CLASSROOM_MODES.find((mode) => mode.id === modeId) || { id:modeId, name:'Class Game', description:'Answer questions to help your team.' };
}

function classGameActionPrompt(mode) {
  const prompts={
    'mastery-challenge':'Answer correctly to charge your mastery core',
    'tug-of-war':'Answer correctly to pull the rope',
    'capture-zone':'Answer correctly to capture territory',
    'maths-race':'Answer correctly to accelerate your team car',
    'tower-climb':'Answer correctly to climb the tower',
    'king-of-the-hill':'Answer correctly to take the hill',
    'team-relay':'Answer correctly to pass the baton',
    'last-team-standing':'Answer carefully to protect your team lives',
    'team-quiz':'Answer correctly to build your team score',
    'quiz-show':'Answer correctly to win a star',
    'maths-football':'Answer correctly to move the shared ball',
    'basketball-shootout':'Answer correctly to take the shot',
    'checkpoint-race':'Answer correctly to charge the next checkpoint',
    'boss-question':'Answer correctly to damage the boss',
    'tower-defence':'Answer correctly to charge the defence towers',
    'dungeon-run':'Answer correctly to find a dungeon key',
    'quiz-battle':'Answer correctly to attack the other team',
    'boss-raid':'Answer correctly to hit the raid boss'
  };
  return prompts[mode]||'Answer correctly to help your team';
}

function classGameState(progress) {
  return progress?.game_state && typeof progress.game_state === 'object' ? progress.game_state : {};
}

function classGameWinner(progress) {
  return String(classGameState(progress).winner || '');
}

function classGamePercent(value, target) {
  const v=Number(value)||0, t=Math.max(1,Number(target)||1);
  return Math.max(0,Math.min(100,(v/t)*100));
}

function classGameTeamTotals(leaderboard=[]) {
  return leaderboard.reduce((out,row)=>{
    const team=String(row.team||'Blue')==='Red'?'Red':'Blue';
    out[team].players+=1;
    out[team].score+=Number(row.score)||0;
    out[team].correct+=Number(row.correct)||0;
    out[team].answered+=Number(row.answered)||0;
    return out;
  },{Blue:{players:0,score:0,correct:0,answered:0},Red:{players:0,score:0,correct:0,answered:0}});
}

function classGameVisual(progress, mode) {
  const g=classGameState(progress);
  const winner=String(g.winner||'');
  const winnerBanner=winner?`<div class="class-game-winner"><strong>${escapeHtml(winner)} ${['Class','Enemies','Boss'].includes(winner)?'wins!':'team wins!'}</strong><span>Game complete</span></div>`:'';
  const teamScore=(blue,red,centre='VS')=>`<div class="team-match-score"><div class="team-score blue"><span>BLUE</span><strong>${blue}</strong></div><div class="match-target">${centre}</div><div class="team-score red"><strong>${red}</strong><span>RED</span></div></div>`;
  const blocks=(value,target,cls='')=>Array.from({length:target},(_,i)=>`<i class="${i<value?'active':''} ${cls}"></i>`).join('');

  if (mode==='mastery-challenge') {
    const blue=Number(g.blue_mastery)||0, red=Number(g.red_mastery)||0, target=Math.max(1,Number(g.target)||100);
    return `${winnerBanner}<div class="mastery-duel-visual">${teamScore(`${blue}%`,`${red}%`,'MASTERY RACE')}
      <div class="mastery-core-row"><div class="mastery-core blue"><div><i style="height:${classGamePercent(blue,target)}%"></i><b>${blue}%</b></div><span>BLUE CORE</span></div><div class="mastery-versus">FIRST TO 100%</div><div class="mastery-core red"><div><i style="height:${classGamePercent(red,target)}%"></i><b>${red}%</b></div><span>RED CORE</span></div></div>
      <div class="game-instruction">Correct answers charge your team’s mastery core. A 3-answer streak gives a boost.</div></div>`;
  }

  if (mode==='maths-football') {
    const ball=Math.max(-100,Math.min(100,Number(g.ball)||0));
    const left=5+((ball+100)/200)*90;
    const blue=Number(g.blue_goals)||0, red=Number(g.red_goals)||0, firstTo=Number(g.first_to)||3;
    return `${winnerBanner}<div class="football-game-visual">${teamScore(blue,red,`FIRST TO ${firstTo}`)}
      <div class="football-pitch"><div class="football-goal left"></div><div class="football-goal right"></div><div class="football-half"></div><div class="football-circle"></div><span class="football-ball" style="left:${left}%"></span><span class="football-attack blue">BLUE ATTACKS →</span><span class="football-attack red">← RED ATTACKS</span></div>
      <div class="game-instruction">Correct answers push the same shared ball toward the other goal. Long streaks create breakaways.</div></div>`;
  }

  if (mode==='tug-of-war') {
    const marker=Math.max(-100,Math.min(100,Number(g.marker)||0));
    const left=5+((marker+100)/200)*90;
    return `${winnerBanner}<div class="tug-game-visual">${teamScore('BLUE','RED','PULL TO YOUR END')}<div class="tug-players"><span class="blue">◀ ◀ ◀</span><span class="red">▶ ▶ ▶</span></div><div class="tug-rope"><span class="tug-end blue"></span><i style="left:${left}%"></i><span class="tug-end red"></span></div><div class="game-instruction">Every correct answer pulls the centre marker. A 4-answer streak gives a power pull.</div></div>`;
  }

  if (mode==='capture-zone') {
    const control=Math.max(-100,Math.min(100,Number(g.control)||0));
    const left=5+((control+100)/200)*90;
    const blue=Number(g.blue_score)||0, red=Number(g.red_score)||0, target=Number(g.target)||100;
    return `${winnerBanner}<div class="zone-game-visual">${teamScore(blue,red,`${target} CONTROL PTS`)}<div class="zone-battle"><div class="zone-blue"><span>BLUE ZONE</span></div><div class="zone-neutral"><span>CONTESTED</span></div><div class="zone-red"><span>RED ZONE</span></div><i style="left:${left}%"></i></div><div class="game-instruction">Push control into your colour. While your team controls the zone, correct answers earn control points.</div></div>`;
  }

  if (mode==='maths-race') {
    const blue=Number(g.blue_distance)||0, red=Number(g.red_distance)||0, target=Math.max(1,Number(g.target)||100);
    const lane=(team,value)=>`<div class="race-car-lane ${team.toLowerCase()}"><b>${team}</b><div class="race-asphalt"><span class="race-checkers"></span><i style="left:${Math.min(96,classGamePercent(value,target))}%"></i></div><strong>${value}m</strong></div>`;
    return `${winnerBanner}<div class="maths-race-visual"><div class="race-header"><span>START</span><b>${target}m FINISH</b></div>${lane('BLUE',blue)}${lane('RED',red)}<div class="game-instruction">Each correct answer accelerates your team car 10m. A 4-answer streak activates turbo.</div></div>`;
  }

  if (mode==='tower-climb') {
    const blue=Number(g.blue_floor)||0, red=Number(g.red_floor)||0, target=Math.max(1,Number(g.target)||12);
    const tower=(team,value)=>`<div class="climb-team ${team.toLowerCase()}"><strong>${team}</strong><div class="climb-tower">${Array.from({length:target},(_,i)=>{const floor=target-i;return `<span class="${floor<=value?'cleared':''}"><b>${floor}</b></span>`}).join('')}</div><small>Floor ${value}/${target}</small></div>`;
    return `${winnerBanner}<div class="tower-climb-visual"><div class="tower-roof">ROOFTOP FINISH</div><div class="tower-duel">${tower('BLUE',blue)}<div class="tower-gap">VS</div>${tower('RED',red)}</div><div class="game-instruction">Correct answers climb one floor. Every third answer in a streak finds a lift and jumps two floors.</div></div>`;
  }

  if (mode==='king-of-the-hill') {
    const control=Math.max(-100,Math.min(100,Number(g.control)||0));
    const left=5+((control+100)/200)*90;
    const blue=Number(g.blue_hold)||0, red=Number(g.red_hold)||0, target=Number(g.target)||30;
    const owner=String(g.owner||'');
    const ownerLabel=owner?`${owner.toUpperCase()} CONTROLS THE HILL`:'HILL IS CONTESTED';
    const ownerClass=owner?owner.toLowerCase():'neutral';
    return `${winnerBanner}<div class="hill-game-visual">${teamScore(blue,red,`${target} HOLD PTS`)}
      <div class="hill-owner-banner ${ownerClass}"><span>${ownerLabel}</span><small>${owner?'Defend it to build hold points':'Reach 60% control to capture it'}</small></div>
      <div class="hill-control-meter"><span class="blue-zone">BLUE</span><div class="hill-neutral-band"></div><span class="red-zone">RED</span><i style="left:${left}%"></i></div>
      <div class="hill-arena-scene ${ownerClass}"><div class="hill-flag"><b></b><i></i></div><div class="hill-mountain"><span>THE HILL</span></div><div class="hill-team blue">BLUE</div><div class="hill-team red">RED</div></div>
      <div class="game-instruction">Capture the hill first. While your team owns it, correct answers build hold points. The other team can knock you off and steal control.</div></div>`;
  }

  if (mode==='team-relay') {
    const blue=Number(g.blue_leg)||0, red=Number(g.red_leg)||0, target=Math.max(1,Number(g.target)||16);
    const relay=(team,value)=>`<div class="relay-lane ${team.toLowerCase()}"><b>${team}</b><div>${blocks(value,target)}</div><span class="relay-baton" style="left:${Math.min(96,classGamePercent(value,target))}%"></span><strong>${value}/${target}</strong></div>`;
    return `${winnerBanner}<div class="relay-visual"><div class="relay-title">BATON RELAY · ${target} LEGS</div>${relay('BLUE',blue)}${relay('RED',red)}<div class="game-instruction">Every correct answer completes one relay leg and passes the shared baton to the next runner.</div></div>`;
  }

  if (mode==='last-team-standing') {
    const blue=Math.max(0,Number(g.blue_lives)||0), red=Math.max(0,Number(g.red_lives)||0);
    return `${winnerBanner}<div class="lives-team-visual"><div class="life-team blue"><span>BLUE</span><strong>${blue}</strong><small>lives</small><div>${blocks(blue,10)}</div></div><div class="versus-mark">LAST TEAM<br>STANDING</div><div class="life-team red"><span>RED</span><strong>${red}</strong><small>lives</small><div>${blocks(red,10)}</div></div><div class="game-instruction">Wrong answers cost a team life. Survive five correct in a row to win one life back.</div></div>`;
  }

  if (mode==='team-quiz') {
    const blue=Number(g.blue_score)||0, red=Number(g.red_score)||0, target=Math.max(1,Number(g.target)||200);
    return `${winnerBanner}<div class="score-battle-visual team-quiz-visual"><div class="score-battle-number blue"><span>BLUE</span><strong>${blue}</strong><div><i style="width:${classGamePercent(blue,target)}%"></i></div><small>streaks multiply points</small></div><div class="score-battle-target"><strong>${target}</strong><span>POINTS TO WIN</span></div><div class="score-battle-number red"><span>RED</span><strong>${red}</strong><div><i style="width:${classGamePercent(red,target)}%"></i></div><small>streaks multiply points</small></div><div class="game-instruction">A classic team quiz race. Longer individual streaks earn your team larger point bursts.</div></div>`;
  }

  if (mode==='quiz-show') {
    const blue=Number(g.blue_stars)||0, red=Number(g.red_stars)||0, target=Math.max(1,Number(g.target)||12);
    const stars=(n)=>Array.from({length:target},(_,i)=>`<i class="${i<n?'won':''}">★</i>`).join('');
    return `${winnerBanner}<div class="quiz-show-visual"><div class="quiz-stage-title">MATHSEXPRESS QUIZ SHOW</div><div class="quiz-show-team blue"><b>BLUE</b><strong>${blue}/${target}</strong><div>${stars(blue)}</div></div><div class="quiz-show-team red"><b>RED</b><strong>${red}/${target}</strong><div>${stars(red)}</div></div><div class="game-instruction">Correct answers win stars. Four correct in a row wins a double-star bonus.</div></div>`;
  }

  if (mode==='basketball-shootout') {
    const blue=Number(g.blue_score)||0, red=Number(g.red_score)||0, target=Math.max(1,Number(g.target)||30);
    return `${winnerBanner}<div class="basketball-team-visual"><div class="basket-team blue"><span>BLUE</span><strong>${blue}</strong><div class="basket-court"><i></i><div class="basket-hoop"></div></div></div><div class="basket-centre"><b>${target}</b><span>FIRST TO</span></div><div class="basket-team red"><span>RED</span><strong>${red}</strong><div class="basket-court"><i></i><div class="basket-hoop"></div></div></div><div class="game-instruction">Correct answers hit 2-point shots. Three or more correct in a row turns the next shot into a 3-pointer.</div></div>`;
  }

  if (mode==='checkpoint-race') {
    const blue=Number(g.blue_checkpoint)||0, red=Number(g.red_checkpoint)||0, bc=Number(g.blue_charge)||0, rc=Number(g.red_charge)||0, target=Math.max(1,Number(g.target)||8), charge=Math.max(1,Number(g.charge_target)||2);
    const row=(team,value,c)=>`<div class="checkpoint-team ${team.toLowerCase()}"><header><b>${team}</b><span>Checkpoint ${Math.min(target,value+1)} · charge ${c}/${charge}</span></header><div class="checkpoint-line">${Array.from({length:target},(_,i)=>`<i class="${i<value?'cleared':i===value?'current':''}">${i+1}</i>`).join('')}</div><div class="checkpoint-charge"><i style="width:${classGamePercent(c,charge)}%"></i></div></div>`;
    return `${winnerBanner}<div class="checkpoint-visual"><div class="checkpoint-title">CLEAR ${target} CHECKPOINTS</div>${row('BLUE',blue,bc)}${row('RED',red,rc)}<div class="game-instruction">Two correct answers charge and clear each checkpoint. First team through every gate wins.</div></div>`;
  }

  if (mode==='boss-question') {
    const hp=Math.max(0,Number(g.boss_hp)||0), max=Math.max(1,Number(g.max_hp)||300);
    return `${winnerBanner}<div class="boss-game-visual"><div class="boss-icon"><span>BOSS</span><b>?</b></div><strong>${hp} HP</strong><div class="boss-health"><i style="width:${classGamePercent(hp,max)}%"></i></div><div class="boss-damage">Total class damage <b>${Number(g.class_damage)||0}</b></div><div class="game-instruction">The entire class attacks one question boss. Correct streaks increase your damage.</div></div>`;
  }

  if (mode==='tower-defence') {
    const wave=Math.min(10,Number(g.wave)||1), charge=Number(g.charge)||0, target=Math.max(1,Number(g.target_charge)||50), hp=Math.max(0,Number(g.base_hp)||0);
    return `${winnerBanner}<div class="defence-game-visual"><div class="defence-battlefield"><div class="defence-base"><span>BASE HP</span><strong>${hp}%</strong><div class="base-health"><i style="width:${hp}%"></i></div></div><div class="enemy-lane">${Array.from({length:5},(_,i)=>`<i style="left:${68-i*11}%"></i>`).join('')}<b>WAVE ${wave}/10</b></div></div><div class="defence-wave"><span>TOWER ENERGY</span><strong>${charge}/${target}</strong><div><i style="width:${classGamePercent(charge,target)}%"></i></div><small>Fill the bar to destroy the wave</small></div><div class="game-instruction">Correct answers charge the class towers. Wrong answers let enemies damage the base. Clear all 10 waves before base HP reaches zero.</div></div>`;
  }

  if (mode==='dungeon-run') {
    const blue=Number(g.blue_room)||0, red=Number(g.red_room)||0, bk=Number(g.blue_keys)||0, rk=Number(g.red_keys)||0, target=Math.max(1,Number(g.target)||8);
    const dungeon=(team,room,keys)=>`<div class="dungeon-team ${team.toLowerCase()}"><header><b>${team}</b><span>${keys}/2 keys</span></header><div class="dungeon-rooms">${Array.from({length:target},(_,i)=>`<i class="${i<room?'open':i===room?'current':''}"><span>${i+1}</span></i>`).join('')}</div><small>${room>=target?'ESCAPED':`Room ${room+1} · ${2-keys} key${2-keys===1?'':'s'} needed`}</small></div>`;
    return `${winnerBanner}<div class="dungeon-visual"><div class="dungeon-title">ESCAPE THE 8-ROOM DUNGEON</div>${dungeon('BLUE',blue,bk)}${dungeon('RED',red,rk)}<div class="game-instruction">Each correct answer finds a key. Two keys unlock the next room; a wrong answer can drop a key.</div></div>`;
  }

  if (mode==='quiz-battle') {
    const blue=Math.max(0,Number(g.blue_hp)||0), red=Math.max(0,Number(g.red_hp)||0);
    return `${winnerBanner}<div class="quiz-battle-visual"><div class="battle-fighter blue"><b>BLUE</b><strong>${blue} HP</strong><div><i style="width:${blue}%"></i></div><span>ATTACK →</span></div><div class="battle-versus">VS</div><div class="battle-fighter red"><b>RED</b><strong>${red} HP</strong><div><i style="width:${red}%"></i></div><span>← ATTACK</span></div><div class="game-instruction">Correct answers damage the other team. Streaks increase attack power; wrong answers cause 5 recoil damage.</div></div>`;
  }

  if (mode==='boss-raid') {
    const hp=Math.max(0,Number(g.boss_hp)||0), max=Math.max(1,Number(g.max_hp)||750), lives=Math.max(0,Number(g.class_lives)||0), rage=Math.max(0,Number(g.rage)||0);
    return `${winnerBanner}<div class="raid-game-visual"><div class="raid-boss"><div class="raid-face">RAID<br>BOSS</div><div><span>BOSS HP</span><strong>${hp}/${max}</strong><div class="boss-health"><i style="width:${classGamePercent(hp,max)}%"></i></div></div></div><div class="raid-status"><div><span>CLASS LIVES</span><strong>${lives}</strong>${blocks(lives,12)}</div><div><span>BOSS RAGE</span><strong>${rage}/3</strong><div class="rage-bar"><i style="width:${classGamePercent(rage,3)}%"></i></div></div><div><span>DAMAGE</span><strong>${Number(g.class_damage)||0}</strong></div></div><div class="game-instruction">The whole class raids one boss. Correct streaks deal bigger hits; three misses trigger a boss rage attack and cost one class life.</div></div>`;
  }

  const blue=Number(g.blue_score)||0, red=Number(g.red_score)||0;
  return `${winnerBanner}<div class="score-battle-visual"><div class="score-battle-number blue"><span>BLUE</span><strong>${blue}</strong></div><div class="versus-mark">VS</div><div class="score-battle-number red"><span>RED</span><strong>${red}</strong></div></div>`;
}
function classGameLeaderboardHtml(leaderboard=[], progress=null) {
  const totals=classGameTeamTotals(leaderboard);
  const teamRows=(team)=>leaderboard.filter(row=>String(row.team||'Blue')===team).slice(0,10);
  const renderTeam=(team)=>`<section class="class-team-board ${team.toLowerCase()}"><header><div><span>${team.toUpperCase()}</span><strong>${totals[team].players} player${totals[team].players===1?'':'s'}</strong></div><b>${totals[team].correct} ✓</b></header><div>${teamRows(team).map((row,i)=>`<article><b>${i+1}</b><span>${escapeHtml(row.display_name||'Student')}<small>${Number(row.correct)||0}/${Number(row.answered)||0} correct</small></span><strong>${Number(row.score)||0}</strong></article>`).join('')||'<div class="class-game-empty">Waiting for players…</div>'}</div></section>`;
  return `<div class="class-team-boards">${renderTeam('Blue')}${renderTeam('Red')}</div>`;
}

function stopClassGamePolling() {
  if(classGamePollTimer){ clearInterval(classGamePollTimer); classGamePollTimer=null; }
  classGamePollBusy=false;
}

function classGameCooldownMs() {
  return Math.max(0, classGameCooldownUntil - Date.now());
}

function stopClassGameCooldown() {
  if(classGameCooldownTimer){ clearInterval(classGameCooldownTimer); classGameCooldownTimer=null; }
}

function updateClassGameCooldownDom() {
  const ms=classGameCooldownMs();
  const box=document.getElementById('class-game-cooldown');
  if(box){
    box.hidden=ms<=0;
    if(ms>0) box.innerHTML=`<strong>Wrong answer</strong><span>Next question unlocks in ${(ms/1000).toFixed(1)}s</span>`;
  }
  const winner=activeClassGame ? classGameWinner(activeClassGame.progress) : '';
  document.querySelectorAll('[data-action="class-game-answer"]').forEach(btn=>{
    btn.disabled=Boolean(winner)||classGameAnswerPending||ms>0;
  });
  if(ms<=0) stopClassGameCooldown();
}

function startClassGameCooldown(ms=3000) {
  classGameCooldownUntil=Date.now()+Math.max(0,Number(ms)||0);
  stopClassGameCooldown();
  updateClassGameCooldownDom();
  classGameCooldownTimer=setInterval(updateClassGameCooldownDom,100);
}

function updateClassGameLiveDom() {
  if(!activeClassGame) return;
  const arena=document.getElementById('class-game-arena');
  if(arena) arena.innerHTML=classGameVisual(activeClassGame.progress,activeClassGame.session.mode);
  const board=document.getElementById('class-game-leaderboard');
  if(board) board.innerHTML=classGameLeaderboardHtml(activeClassGame.leaderboard,activeClassGame.progress);
  const event=document.getElementById('class-game-event');
  const last=classGameState(activeClassGame.progress).last_event;
  if(event) event.textContent=last?.message||'Answer correctly to make your team move.';
  const winner=classGameWinner(activeClassGame.progress);
  document.querySelectorAll('[data-action="class-game-answer"]').forEach(btn=>{ btn.disabled=Boolean(winner)||classGameAnswerPending||classGameCooldownMs()>0; });
  updateClassGameCooldownDom();
}

function classGameExpired(session,now=Date.now()){
  const start=Date.parse(session?.created_at||'');return !Number.isFinite(start)||now-start>=600000;
}
function leaveExpiredClassGame(){stopClassGamePolling();stopClassGameCooldown();activeClassGame=null;showToast('Class game ended','Class games last 10 minutes.');go('student-hub');}
async function pollClassGameSnapshot() {
  if(classGamePollBusy || !activeClassGame) return;
  if(classGameExpired(activeClassGame.session))return leaveExpiredClassGame();
  const route=routeFromHash();
  if(route.route!=='class-game' || String(route.param)!==String(activeClassGame.session.id)) {
    stopClassGamePolling();
    updateAccountChrome();
    return;
  }
  classGamePollBusy=true;
  try {
    const snap=await getSchoolClient().classroomGameSnapshot(activeClassGame.session.id);
    if(!activeClassGame || String(activeClassGame.session.id)!==String(snap.session_id||activeClassGame.session.id)) return;
    activeClassGame={...activeClassGame,progress:{...activeClassGame.progress,game_state:snap.game_state||{}},leaderboard:Array.isArray(snap.players)?snap.players:activeClassGame.leaderboard};
    updateClassGameLiveDom();
  } catch {}
  finally { classGamePollBusy=false; }
}

function startClassGamePolling() {
  stopClassGamePolling();
  classGamePollTimer=setInterval(pollClassGameSnapshot,1500);
}

async function refreshClassSessions() {
  try {
    activeClassSessions = await getSchoolClient().listActiveClassroomSessions();
    const root = document.getElementById('active-class-games');
    if (root && routeFromHash().route === 'games') root.innerHTML = activeClassSessions.length ? activeClassSessions.map((session) => { const mode=classGameMode(session.mode); return `<button class="active-class-game" data-action="join-class-game" data-session-id="${session.id}"><span>${session.mode==='maths-football'?'BALL':session.mode==='capture-zone'?'ZONE':session.mode==='maths-race'?'RACE':session.mode==='tower-climb'?'TOWER':'LIVE'}</span><div><strong>${escapeHtml(mode.name)}</strong><small>${escapeHtml(mode.description)}</small></div><b>Join →</b></button>`; }).join('') : '<div class="school-empty">No live class games right now. Your teacher can start one from School → Tools → Classroom games.</div>';
  } catch {
    const root=document.getElementById('active-class-games'); if(root) root.innerHTML='<div class="school-empty">No live class games available.</div>';
  }
}

async function openClassGame(sessionId) {
  try {
    const sessions=await getSchoolClient().listActiveClassroomSessions();
    const session=sessions.find(item=>String(item.id)===String(sessionId));
    if(!session||classGameExpired(session))return leaveExpiredClassGame();
    const joined = await getSchoolClient().joinClassroomGame(sessionId);
    const snapshot = await getSchoolClient().classroomGameSnapshot(sessionId).catch(()=>null);
    const progress={...joined,game_state:snapshot?.game_state||joined?.game_state||{}};
    const leaderboard=Array.isArray(snapshot?.players)?snapshot.players:await getSchoolClient().classroomGameLeaderboard(sessionId);
    activeClassGame = { session, progress, leaderboard, question:createDrivingQuestion(normaliseYearLevel(account.profile?.yearLevel)) };
    classGameCooldownUntil=0; stopClassGameCooldown();
    startClassGamePolling();
    go('class-game', sessionId);
  } catch (error) { showToast('Couldn’t join class game', error.message || 'Try again.'); }
}

function renderClassGame() {
  const view=document.getElementById('app-view');
  const sessionId=routeFromHash().param;
  const createAnywhere=document.getElementById('teacher-create-anywhere');
  if(createAnywhere) createAnywhere.hidden=true;
  if (!activeClassGame || activeClassGame.session.id!==sessionId) {
    view.innerHTML=`<div class="page"><div class="school-loading"><span class="spinner"></span><strong>Joining class game…</strong></div></div>`;
    return openClassGame(sessionId);
  }
  startClassGamePolling();
  const {session,progress,leaderboard,question}=activeClassGame;
  const mode=classGameMode(session.mode);
  const winner=classGameWinner(progress);
  const last=classGameState(progress).last_event;
  view.innerHTML=`<div class="page class-game-page"><div class="class-game-head"><div><span class="eyebrow">LIVE CLASS GAME · ${escapeHtml(progress?.team||'Team')}</span><h1>${escapeHtml(mode.name)}</h1><p>${escapeHtml(mode.description)}</p></div><button class="btn ghost" data-route="games">Leave game</button></div>
    <div class="class-game-shell"><main class="class-game-main"><section id="class-game-arena" class="class-game-arena">${classGameVisual(progress,session.mode)}</section>
      <section class="class-game-question"><div class="class-game-question-head"><div><span class="eyebrow">YOUR TURN</span><h2>${winner?`${escapeHtml(winner)} won the game`:escapeHtml(classGameActionPrompt(session.mode))}</h2></div><span id="class-game-event" class="class-game-event">${escapeHtml(last?.message||'Every answer updates the same live game for the whole class.')}</span></div>
      ${winner?`<div class="class-game-finished"><strong>Game finished</strong><p>Your teacher can start another classroom game.</p></div>`:`<div class="class-game-maths"><div id="class-game-cooldown" class="class-game-cooldown" ${classGameCooldownMs()>0?'':'hidden'}></div><h3>${mathHtml(question.prompt)}</h3><div class="class-game-choices">${question.options.map((o)=>`<button class="class-game-choice" data-action="class-game-answer" data-option="${o.id}" ${classGameCooldownMs()>0?'disabled':''}>${mathHtml(o.value)}</button>`).join('')}</div></div>`}</section></main>
      <aside id="class-game-leaderboard" class="class-game-sidebar">${classGameLeaderboardHtml(leaderboard,progress)}</aside></div></div>`;
}

async function answerClassGame(optionId) {
  if (!activeClassGame?.question || classGameAnswerPending || classGameWinner(activeClassGame.progress)) return;
  if(classGameExpired(activeClassGame.session))return leaveExpiredClassGame();
  const cooldown=classGameCooldownMs();
  if(cooldown>0){ startClassGameCooldown(cooldown); return; }
  const option=activeClassGame.question.options.find((item)=>item.id===optionId);
  const correct=Boolean(option?.correct);
  const questionKey=String(activeClassGame.question.id||`${activeClassGame.session.id}:${activeClassGame.question.prompt}`);
  classGameAnswerPending=true;
  document.querySelectorAll('[data-action="class-game-answer"]').forEach(btn=>btn.disabled=true);
  try {
    const progress=await getSchoolClient().submitClassroomGameAnswer(activeClassGame.session.id,correct,questionKey);
    if(progress?.blocked){
      const retry=Math.max(0,Number(progress.retry_after_ms)||0);
      if(retry>0) startClassGameCooldown(retry);
      if(progress.reason==='duplicate') showToast('Already submitted','That question has already counted.');
      else if(progress.reason==='cooldown') showToast('Wait a moment',`You can answer again in ${(retry/1000).toFixed(1)} seconds.`);
      return;
    }
    trackActivityEvent('game-answer','game','class-game-answer',{sessionId:activeClassGame.session.id,mode:activeClassGame.session.mode,correct});
    const snapshot=await getSchoolClient().classroomGameSnapshot(activeClassGame.session.id).catch(()=>null);
    const leaderboard=Array.isArray(snapshot?.players)?snapshot.players:await getSchoolClient().classroomGameLeaderboard(activeClassGame.session.id);
    const nextQuestion=createDrivingQuestion(normaliseYearLevel(account.profile?.yearLevel));
    activeClassGame={...activeClassGame,progress:{...progress,game_state:snapshot?.game_state||progress?.game_state||{}},leaderboard,question:nextQuestion};
    const message=classGameState(activeClassGame.progress)?.last_event?.message;
    if(!correct) startClassGameCooldown(Math.max(3000,Number(progress.retry_after_ms)||3000));
    else { classGameCooldownUntil=0; stopClassGameCooldown(); }
    showToast(correct?'Correct!':'Wrong answer', message|| (correct?'Your team made a move.':'Wait 3 seconds, then try the next question.'),correct?'success':'');
    renderClassGame();
    updateClassGameCooldownDom();
  } catch(error){ showToast('Game update failed',error.message||'Try again.'); }
  finally {
    classGameAnswerPending=false;
    updateClassGameLiveDom();
  }
}

function shuffleGameChoices(items){
  const out=[...items];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}
function gameChoices(answer, spread=8){
  const numeric=Number(answer); const vals=new Set([numeric]);
  const offsets=[1,-1,2,-2,3,-3,5,-5,10,-10,spread,-spread];
  for(const d of shuffleGameChoices(offsets)){ if(vals.size>=4)break; vals.add(Number((numeric+d).toFixed(2))); }
  return shuffleGameChoices([...vals].slice(0,4)).map((v,i)=>({id:`c${i}-${String(v).replace(/[^0-9-]/g,'')}`,value:String(v),correct:Math.abs(Number(v)-numeric)<1e-9}));
}
function quickMathQuestion(){
  const year=normaliseYearLevel(account.profile?.yearLevel);
  const max=year>=11?30:year>=9?20:15; const kind=Math.floor(Math.random()*4);
  let a=2+Math.floor(Math.random()*max), b=2+Math.floor(Math.random()*max), prompt='',answer=0;
  if(kind===0){answer=a+b;prompt=`${a} + ${b} = ?`;}
  else if(kind===1){if(b>a)[a,b]=[b,a];answer=a-b;prompt=`${a} − ${b} = ?`;}
  else if(kind===2){a=2+Math.floor(Math.random()*12);b=2+Math.floor(Math.random()*12);answer=a*b;prompt=`${a} × ${b} = ?`;}
  else {b=2+Math.floor(Math.random()*12);answer=2+Math.floor(Math.random()*12);a=b*answer;prompt=`${a} ÷ ${b} = ?`;}
  return {id:`quick-${Date.now()}-${Math.random()}`,prompt,answer,options:gameChoices(answer,4),explanation:`${prompt.replace('= ?','')}= ${answer}`,rating:1000};
}
function mathsQuestQuestion(){
  const kind=Math.floor(Math.random()*6); let prompt='',answer=0,explanation='';
  if(kind===0){const pct=[10,20,25,40,50,75][Math.floor(Math.random()*6)],v=(4+Math.floor(Math.random()*17))*20;answer=v*pct/100;prompt=`A class has ${v} reward points. ${pct}% are used. How many points is that?`;explanation=`${pct}% of ${v} = ${answer}.`;}
  else if(kind===1){const x=2+Math.floor(Math.random()*15),a=2+Math.floor(Math.random()*8),b=1+Math.floor(Math.random()*12);answer=x;prompt=`Solve ${a}x + ${b} = ${a*x+b}.`;explanation=`Subtract ${b}, then divide by ${a}: x = ${x}.`;}
  else if(kind===2){const l=4+Math.floor(Math.random()*16),w=3+Math.floor(Math.random()*12);answer=l*w;prompt=`A rectangular garden is ${l} m by ${w} m. What is its area in m²?`;explanation=`Area = ${l} × ${w} = ${answer} m².`;}
  else if(kind===3){const base=2+Math.floor(Math.random()*9),vals=[base,base+2,base+4,base+6];answer=base+3;prompt=`Find the mean of ${vals.join(', ')}.`;explanation=`The total is ${vals.reduce((a,b)=>a+b,0)}. Divide by 4 to get ${answer}.`;}
  else if(kind===4){const start=(5+Math.floor(Math.random()*20))*10,pct=[5,10,20][Math.floor(Math.random()*3)];answer=Number((start*(1+pct/100)).toFixed(2));prompt=`$${start} increases by ${pct}%. What is the new amount?`;explanation=`Multiply ${start} by ${1+pct/100} to get $${answer}.`;}
  else {const a=3+Math.floor(Math.random()*10),b=2+Math.floor(Math.random()*9),c=2+Math.floor(Math.random()*8);answer=a+b*c;prompt=`A puzzle score starts at ${a}, then gains ${b} points ${c} times. What is the final score?`;explanation=`${a} + ${b} × ${c} = ${answer}.`;}
  return {id:`quest-${Date.now()}-${Math.random()}`,prompt,answer,options:gameChoices(answer,Math.max(4,Math.round(Math.abs(answer)*0.1))),explanation,rating:1100};
}
function nextEducationalGameQuestion(mode){
  const seen=eduGameSession?.seen || new Set();
  for(let tries=0;tries<300;tries++){
    const q=mode==='maths-quest'?mathsQuestQuestion():quickMathQuestion();
    const sig=String(q.prompt).replace(/\s+/g,' ').trim().toLowerCase();
    if(!seen.has(sig)){seen.add(sig);return q;}
  }
  return mode==='maths-quest'?mathsQuestQuestion():quickMathQuestion();
}
async function flushGameServerSpend(force=false,{preserveLocalGameTime=false}={}){
  if(!account.authenticated||gameServerSpendInFlight||gameServerSpendPending<=0)return;
  if(!force&&gameServerSpendPending<5)return;
  const spend=Math.min(300,gameServerSpendPending); gameServerSpendPending-=spend; gameServerSpendInFlight=true;
  try{const data=await getSchoolClient().spendGameTime(spend);await applyRemotePlayerState(data,{quiet:true,preserveGameTime:preserveLocalGameTime});}
  catch(error){gameServerSpendPending+=spend;console.warn('Game Time sync failed',error);}
  finally{gameServerSpendInFlight=false;if(force&&gameServerSpendPending>0)void flushGameServerSpend(true,{preserveLocalGameTime});}
}
function stopEduGameTimer(){if(eduGameTimer){clearInterval(eduGameTimer);eduGameTimer=null;}eduGameLastTickAt=0;}
async function finishEducationalGame({showResult=true}={}){
  if(!eduGameSession)return;
  const finished=eduGameSession; stopEduGameTimer(); eduGameSession=null; await flushGameServerSpend(true);
  let result=null;
  try{if(finished.sessionId)result=await getSchoolClient().eloFinishSession(finished.sessionId,finished.answered,finished.correct);}catch(e){console.warn('ELO finish failed',e);}
  eloBoardData=null;
  if(showResult){
    const delta=Number(result?.delta)||0; const rating=Number(result?.rating)||finished.startRating||1000;
    openSimpleModal('Game session complete',`<div class="elo-result"><strong>${finished.correct}/${finished.answered}</strong><span>correct answers</span><strong class="positive">+${Number(finished.eloEarned)||0} ELO</strong><span>Per question: +5 first-try correct, +4 second-try correct, then +0.</span><span>New rating: ${rating}</span></div><button class="btn primary" data-route="elo">View ELO leaderboard</button>`);
  }
  if(routeFromHash().route==='games')renderGames();
}
function startEduGameTimer(){
  if(eduGameTimer || !eduGameSession)return;
  eduGameLastTickAt=Date.now();
  eduGameTimer=setInterval(()=>{
    if(!eduGameSession || routeFromHash().route!=='games'){stopEduGameTimer();return;}
    const now=Date.now();
    const elapsed=Math.max(0,Math.floor((now-eduGameLastTickAt)/1000));
    if(elapsed<1)return;
    eduGameLastTickAt+=elapsed*1000;
    const remaining=Math.max(0,Number(state.gameTimeSeconds)||0);
    if(remaining<=elapsed){
      persist({...state,gameTimeSeconds:0},{quiet:true});
      const timer=document.getElementById('edu-game-time-left');if(timer)timer.textContent='0:00';
      finishEducationalGame({showResult:true});
      return;
    }
    persist(spendGameTime(state,elapsed),{quiet:true}); gameServerSpendPending+=elapsed; void flushGameServerSpend(false);
    const timer=document.getElementById('edu-game-time-left');if(timer)timer.textContent=formatGameTime(state.gameTimeSeconds);
  },250);
}
async function startEducationalGame(mode){
  try{await syncRemotePlayerState();}catch{}
  if((state.gameTimeSeconds||0)<=0)return showToast('No Game Time','Complete learning questions to earn up to 5 minutes.');
  try{
    const started=await getSchoolClient().eloStartSession(mode);
    gameServerSpendPending=0;
    eduGameSession={mode,sessionId:started?.session_id||null,startRating:Number(started?.rating)||1000,answered:0,correct:0,streak:0,seen:new Set(),question:null,eloEarned:0,lastEloPoints:0};
    eduGameSession.question=nextEducationalGameQuestion(mode); renderGames(); startEduGameTimer();
  }catch(error){showToast('Could not start game',error.message||'Try again.');}
}

function answerEducationalGame(choiceId){
  if(!eduGameSession)return;
  const q=eduGameSession.question; const choice=q.options.find(o=>String(o.id)===String(choiceId)); if(!choice)return;
  const correct=Boolean(choice.correct); eduGameSession.answered+=1; if(correct){eduGameSession.correct+=1;eduGameSession.streak+=1;}else eduGameSession.streak=0;
  eduGameSession.last={correct,answer:q.answer,explanation:q.explanation};
  if(correct&&account.authenticated){const key=`game:${eduGameSession.sessionId||eduGameSession.mode}:${q.id}`;getSchoolClient().eloAwardQuestion(key,q.id,1,true).then(r=>{const pts=Number(r?.points)||0;if(eduGameSession){eduGameSession.lastEloPoints=pts;eduGameSession.eloEarned=(Number(eduGameSession.eloEarned)||0)+pts;eduGameSession.startRating=Number(r?.rating)||eduGameSession.startRating;}if(pts)eloBoardData=null;}).catch(()=>{});}
  eduGameSession.question=nextEducationalGameQuestion(eduGameSession.mode);
  renderGames();
}

function educationalGameHtml(){
  const g=eduGameSession,q=g.question,name=g.mode==='maths-quest'?'Maths Quest':'Quick Maths';
  return `<div class="edu-game-screen"><div class="edu-game-top"><button class="btn ghost" data-action="stop-edu-game">← Leave</button><div><span class="eyebrow">${escapeHtml(name)}</span><h1>Answer as many as you can</h1></div><div class="elo-live"><small>ELO</small><strong>${g.startRating}</strong><span>+${Number(g.eloEarned)||0} this run</span></div></div><main class="edu-game-main"><div class="edu-score-row"><span><b>${g.correct}</b> correct</span><span><b>${g.answered}</b> answered</span><span><b>${g.streak}</b> streak</span></div>${g.last?`<div class="edu-feedback ${g.last.correct?'correct':'wrong'}">${g.last.correct?'Correct':'Not quite'} · ${escapeHtml(g.last.explanation)}${g.last.correct&&g.lastEloPoints?` · +${g.lastEloPoints} ELO`:''}</div>`:''}<section class="edu-question-card"><span class="eyebrow">No question timer</span><h2>${mathHtml(q.prompt)}</h2><div class="edu-choice-grid">${q.options.map(o=>`<button data-action="edu-game-answer" data-choice="${escapeHtml(o.id)}">${mathHtml(o.value)}</button>`).join('')}</div></section></main><div class="edu-game-timer"><small>GAME TIME</small><strong id="edu-game-time-left">${formatGameTime(state.gameTimeSeconds)}</strong><span>max 5:00</span></div></div>`;
}

const MATH_CHESS_PIECES=Object.freeze({K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'});
const MATH_CHESS_VALUES=Object.freeze({p:1,n:3,b:3.2,r:5,q:9,k:100});
function mathChessInitialBoard(){
  return ['r','n','b','q','k','b','n','r','p','p','p','p','p','p','p','p','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','P','P','P','P','P','P','P','P','R','N','B','Q','K','B','N','R'];
}
function mathChessInitialPosition(){return{board:mathChessInitialBoard(),turn:'w',castling:{wK:true,wQ:true,bK:true,bQ:true},enPassant:null,halfmove:0,fullmove:1};}
function mathChessPieceColor(piece){if(!piece)return'';return piece===piece.toUpperCase()?'w':'b';}
function mathChessRow(index){return Math.floor(index/8);}function mathChessCol(index){return index%8;}
function mathChessIndex(row,col){return row*8+col;}function mathChessInside(row,col){return row>=0&&row<8&&col>=0&&col<8;}
function mathChessCoord(index){return `${String.fromCharCode(97+mathChessCol(index))}${8-mathChessRow(index)}`;}
function mathChessSquareAttacked(board,index,byColor){
  const tr=mathChessRow(index),tc=mathChessCol(index);
  for(let i=0;i<64;i++){
    const piece=board[i];if(!piece||mathChessPieceColor(piece)!==byColor)continue;
    const r=mathChessRow(i),c=mathChessCol(i),kind=piece.toLowerCase();
    if(kind==='p'){
      const dr=byColor==='w'?-1:1;
      if(r+dr===tr&&(c-1===tc||c+1===tc))return true;
    }else if(kind==='n'){
      for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])if(r+dr===tr&&c+dc===tc)return true;
    }else if(kind==='k'){
      if(Math.max(Math.abs(r-tr),Math.abs(c-tc))===1)return true;
    }else{
      const dirs=kind==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:kind==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
      for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc;while(mathChessInside(rr,cc)){const sq=mathChessIndex(rr,cc);if(rr===tr&&cc===tc)return true;if(board[sq])break;rr+=dr;cc+=dc;}}
    }
  }
  return false;
}
function mathChessInCheck(board,color){const king=color==='w'?'K':'k';const idx=board.indexOf(king);return idx<0||mathChessSquareAttacked(board,idx,color==='w'?'b':'w');}
function mathChessPromotionMoves(base,color){return['q','r','b','n'].map(kind=>({...base,promotion:color==='w'?kind.toUpperCase():kind}));}
function mathChessPseudoMoves(position,from){
  const board=position.board,piece=board[from];if(!piece)return[];const color=mathChessPieceColor(piece),kind=piece.toLowerCase(),r=mathChessRow(from),c=mathChessCol(from),moves=[];
  const add=(rr,cc)=>{if(!mathChessInside(rr,cc))return false;const to=mathChessIndex(rr,cc),target=board[to];if(!target){moves.push({from,to,piece,capture:''});return true;}if(mathChessPieceColor(target)!==color&&target.toLowerCase()!=='k')moves.push({from,to,piece,capture:target});return false;};
  if(kind==='p'){
    const dr=color==='w'?-1:1,start=color==='w'?6:1,promoRow=color==='w'?0:7,oneR=r+dr;
    if(mathChessInside(oneR,c)&&!board[mathChessIndex(oneR,c)]){
      const to=mathChessIndex(oneR,c),base={from,to,piece,capture:''};
      if(oneR===promoRow)moves.push(...mathChessPromotionMoves(base,color));else moves.push(base);
      const twoR=r+2*dr;if(r===start&&!board[mathChessIndex(twoR,c)])moves.push({from,to:mathChessIndex(twoR,c),piece,capture:'',doublePawn:true});
    }
    for(const dc of [-1,1]){
      const rr=r+dr,cc=c+dc;if(!mathChessInside(rr,cc))continue;const to=mathChessIndex(rr,cc),target=board[to];
      if(target&&mathChessPieceColor(target)!==color&&target.toLowerCase()!=='k'){
        const base={from,to,piece,capture:target};if(rr===promoRow)moves.push(...mathChessPromotionMoves(base,color));else moves.push(base);
      }else if(position.enPassant===to){
        const captureIndex=mathChessIndex(r,cc),captured=board[captureIndex];
        if(captured&&captured.toLowerCase()==='p'&&mathChessPieceColor(captured)!==color)moves.push({from,to,piece,capture:captured,enPassant:true,captureIndex});
      }
    }
  }else if(kind==='n'){
    for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dr,c+dc);
  }else if(kind==='k'){
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)add(r+dr,c+dc);
    const enemy=color==='w'?'b':'w',home=color==='w'?60:4;
    if(from===home&&!mathChessInCheck(board,color)){
      const rights=position.castling||{};
      const kRight=color==='w'?rights.wK:rights.bK,qRight=color==='w'?rights.wQ:rights.bQ;
      if(kRight){const rook=home+3;if(board[rook]===(color==='w'?'R':'r')&&!board[home+1]&&!board[home+2]&&!mathChessSquareAttacked(board,home+1,enemy)&&!mathChessSquareAttacked(board,home+2,enemy))moves.push({from,to:home+2,piece,capture:'',castle:'K'});}
      if(qRight){const rook=home-4;if(board[rook]===(color==='w'?'R':'r')&&!board[home-1]&&!board[home-2]&&!board[home-3]&&!mathChessSquareAttacked(board,home-1,enemy)&&!mathChessSquareAttacked(board,home-2,enemy))moves.push({from,to:home-2,piece,capture:'',castle:'Q'});}
    }
  }else{
    const dirs=kind==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:kind==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
    for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc;while(mathChessInside(rr,cc)){if(!add(rr,cc))break;rr+=dr;cc+=dc;}}
  }
  return moves;
}
function mathChessApplyMove(position,move){
  const board=[...position.board],piece=board[move.from],color=mathChessPieceColor(piece),captured=move.enPassant?board[move.captureIndex]:board[move.to];board[move.from]='';
  if(move.enPassant&&Number.isInteger(move.captureIndex))board[move.captureIndex]='';
  if(move.castle){const home=color==='w'?60:4;if(move.castle==='K'){board[home+1]=board[home+3];board[home+3]='';}else{board[home-1]=board[home-4];board[home-4]='';}}
  board[move.to]=move.promotion||piece;
  const castling={...(position.castling||{})};
  if(piece==='K'){castling.wK=false;castling.wQ=false;}if(piece==='k'){castling.bK=false;castling.bQ=false;}
  if(move.from===63)castling.wK=false;if(move.from===56)castling.wQ=false;if(move.from===7)castling.bK=false;if(move.from===0)castling.bQ=false;
  if(move.to===63&&captured==='R')castling.wK=false;if(move.to===56&&captured==='R')castling.wQ=false;if(move.to===7&&captured==='r')castling.bK=false;if(move.to===0&&captured==='r')castling.bQ=false;
  const pawn=piece.toLowerCase()==='p';const enPassant=pawn&&Math.abs(move.to-move.from)===16?(move.from+move.to)/2:null;
  return{board,turn:color==='w'?'b':'w',castling,enPassant,halfmove:pawn||captured?0:(Number(position.halfmove)||0)+1,fullmove:(Number(position.fullmove)||1)+(color==='b'?1:0)};
}
function mathChessLegalMoves(position,color=position.turn){
  const out=[];for(let i=0;i<64;i++){if(mathChessPieceColor(position.board[i])!==color)continue;for(const move of mathChessPseudoMoves(position,i)){const next=mathChessApplyMove(position,move);if(!mathChessInCheck(next.board,color))out.push(move);}}
  return out;
}
function mathChessPositionKey(position){const c=position.castling||{};return`${position.board.map(p=>p||'.').join('')}/${position.turn}/${c.wK?'K':''}${c.wQ?'Q':''}${c.bK?'k':''}${c.bQ?'q':''}/${position.enPassant==null?'-':position.enPassant}`;}
function mathChessInsufficientMaterial(board){
  const extras=[];for(let i=0;i<64;i++){const p=board[i];if(p&&p.toLowerCase()!=='k')extras.push({p,i});}
  if(!extras.length)return true;if(extras.some(x=>['p','r','q'].includes(x.p.toLowerCase())))return false;if(extras.length===1)return true;
  if(extras.every(x=>x.p.toLowerCase()==='b')){const colors=new Set(extras.map(x=>(mathChessRow(x.i)+mathChessCol(x.i))%2));return colors.size===1;}
  return false;
}
function mathChessPositionState(position,color=position.turn,history=[]){
  if((Number(position.halfmove)||0)>=100)return{over:true,result:'draw',message:'Draw by the 50-move rule.'};
  if(mathChessInsufficientMaterial(position.board))return{over:true,result:'draw',message:'Draw by insufficient material.'};
  const key=mathChessPositionKey(position);if(history.filter(item=>item===key).length>=3)return{over:true,result:'draw',message:'Draw by threefold repetition.'};
  const moves=mathChessLegalMoves(position,color);if(moves.length)return{over:false,moves};if(mathChessInCheck(position.board,color))return{over:true,result:color==='w'?'loss':'win',message:color==='w'?'Checkmate — the bot wins.':'Checkmate — you win!'};return{over:true,result:'draw',message:'Stalemate — draw.'};
}
function mathChessEvaluate(position){let score=0;for(const p of position.board){if(!p)continue;const v=MATH_CHESS_VALUES[p.toLowerCase()]||0;score+=mathChessPieceColor(p)==='w'?v:-v;}return score;}
function mathChessMinimax(position,depth,alpha=-Infinity,beta=Infinity){
  const side=position.turn,stateNow=mathChessPositionState(position,side,[]);if(stateNow.over){if(stateNow.result==='win')return 1000+depth;if(stateNow.result==='loss')return -1000-depth;return 0;}if(depth<=0)return mathChessEvaluate(position);
  if(side==='w'){let best=-Infinity;for(const m of stateNow.moves){best=Math.max(best,mathChessMinimax(mathChessApplyMove(position,m),depth-1,alpha,beta));alpha=Math.max(alpha,best);if(beta<=alpha)break;}return best;}
  let best=Infinity;for(const m of stateNow.moves){best=Math.min(best,mathChessMinimax(mathChessApplyMove(position,m),depth-1,alpha,beta));beta=Math.min(beta,best);if(beta<=alpha)break;}return best;
}
function mathChessBotChoice(position,difficulty){
  const moves=mathChessLegalMoves(position,'b');if(!moves.length)return null;
  if(difficulty==='easy')return moves[Math.floor(Math.random()*moves.length)];
  if(difficulty==='medium')return moves.map(m=>{const capture=MATH_CHESS_VALUES[String(m.capture||'').toLowerCase()]||0;const next=mathChessApplyMove(position,m);const check=mathChessInCheck(next.board,'w')?1.7:0;const castle=m.castle?1.2:0;const promotion=m.promotion?5:0;return{m,score:capture*2+check+castle+promotion+Math.random()*2};}).sort((a,b)=>b.score-a.score)[0].m;
  let bestMove=moves[0],best=Infinity;for(const move of moves){const next=mathChessApplyMove(position,move);const score=mathChessMinimax(next,2)+Math.random()*.03;if(score<best){best=score;bestMove=move;}}return bestMove;
}
function mathChessQuestion(){
  const year=normaliseYearLevel(account.profile?.yearLevel);
  try{const tasks=shuffleGameChoices(searchTaskLibrary({yearLevel:year,type:'practice',limit:40})||[]);for(let t=0;t<Math.min(24,tasks.length);t++){const q=generateTaskQuestions(tasks[t],2,{seedOffset:(Date.now()+t*97)%1000000}).find(item=>['numeric','short-answer','linear-equation','multiple-choice'].includes(String(item.type||''))&&!Array.isArray(item.answer)&&item.answer!=null);if(q)return q;}}catch{}
  return quickMathQuestion();
}
function stopMathChessTimer(){if(mathChessTimer){clearInterval(mathChessTimer);mathChessTimer=null;}mathChessLastTickAt=0;}
function saveMathChessSession(session=mathChessSession){
  if(!session){ if(state.savedMathChess) persist({...state,savedMathChess:null},{quiet:true}); return; }
  try{const clean=JSON.parse(JSON.stringify(session));persist({...state,savedMathChess:clean},{quiet:true});}catch{}
}
function loadSavedMathChess(){
  const saved=state.savedMathChess;
  if(!saved?.position?.board || !Array.isArray(saved.position.board) || saved.position.board.length!==64)return false;
  try{mathChessSession=JSON.parse(JSON.stringify(saved));return true;}catch{return false;}
}
function resumeMathChess(){
  if((state.gameTimeSeconds||0)<1)return showToast('No Game Time yet','Earn more Game Time, then your saved chess game can continue.');
  if(!mathChessSession && !loadSavedMathChess())return showToast('No saved chess game','Start a new chess game first.');
  if(mathChessSession.status==='finished')return showToast('Game already finished','Start a new chess game.');
  mathChessSession.status='playing';mathChessSession.question=null;mathChessSession.pendingMove=null;mathChessSession.selected=null;mathChessSession.message='Saved game resumed — your move.';
  saveMathChessSession();renderGames();startMathChessTimer();
}

function startMathChessTimer(){
  if(mathChessTimer||!mathChessSession||mathChessSession.status!=='playing')return;mathChessLastTickAt=Date.now();
  mathChessTimer=setInterval(()=>{if(!mathChessSession||routeFromHash().route!=='games'){stopMathChessTimer();return;}const now=Date.now(),elapsed=Math.max(0,Math.floor((now-mathChessLastTickAt)/1000));if(elapsed<1)return;mathChessLastTickAt+=elapsed*1000;const remaining=Math.max(0,Number(state.gameTimeSeconds)||0);if(remaining<=elapsed){persist({...state,gameTimeSeconds:0},{quiet:true});gameServerSpendPending+=remaining;void flushGameServerSpend(true,{preserveLocalGameTime:true});mathChessSession.status='paused';mathChessSession.pausedAt=new Date().toISOString();mathChessSession.message='Game Time paused this match. Your exact chess position is saved.';saveMathChessSession();stopMathChessTimer();renderGames();showToast('Chess saved','Your match is paused at this exact position. Earn more Game Time and press Resume.','success');return;}persist(spendGameTime(state,elapsed),{quiet:true});gameServerSpendPending+=elapsed;void flushGameServerSpend(false,{preserveLocalGameTime:true});const timer=document.getElementById('math-chess-time-left');if(timer)timer.textContent=formatGameTime(state.gameTimeSeconds);},250);
}
function startMathChess(difficulty='easy'){
  gameServerSpendPending=0;
  if((state.gameTimeSeconds||0)<1)return showToast('No Game Time','Complete learning questions to earn Game Time first.');
  const position=mathChessInitialPosition();mathChessSession={difficulty:['easy','medium','hard'].includes(difficulty)?difficulty:'easy',position,history:[mathChessPositionKey(position)],selected:null,pendingMove:null,promotionMoves:null,question:null,feedback:'',moves:0,status:'playing',message:'Your move — choose a white piece.',lastMove:null};
  saveMathChessSession();renderGames();startMathChessTimer();
}
function finishMathChess(result,message){
  if(!mathChessSession)return;const g=mathChessSession;g.status='finished';g.result=result;g.message=message;stopMathChessTimer();void flushGameServerSpend(true,{preserveLocalGameTime:true});
  const prev=state.gameStats?.['math-chess']||{};persist({...state,savedMathChess:null,gameStats:{...(state.gameStats||{}),'math-chess':{plays:(prev.plays||0)+1,wins:(prev.wins||0)+(result==='win'?1:0),lastResult:result,difficulty:g.difficulty}}},{quiet:true});renderGames();
}
function mathChessQueueMove(g,move){g.pendingMove=move;g.promotionMoves=null;g.question=mathChessQuestion();g.feedback='';g.message=`Solve the maths question to play ${mathChessCoord(move.from)} → ${mathChessCoord(move.to)}${move.castle?' (castle)':''}.`;saveMathChessSession(g);renderGames();}
function mathChessPlayMove(g,move){
  if(!g||g.status!=='playing'||!move)return;
  g.position=mathChessApplyMove(g.position,move);g.lastMove=move;g.history.push(mathChessPositionKey(g.position));g.moves+=1;g.pendingMove=null;g.question=null;g.feedback='';g.selected=null;g.promotionMoves=null;
  const stateAfter=mathChessPositionState(g.position,g.position.turn,g.history);if(stateAfter.over)return finishMathChess(stateAfter.result,stateAfter.message);
  g.message=`Move played. Bot (${g.difficulty}) is thinking…`;saveMathChessSession(g);renderGames();setTimeout(mathChessBotMove,g.difficulty==='hard'?450:280);
}
function mathChessChooseSquare(index){
  const g=mathChessSession;if(!g||g.status!=='playing'||g.position.turn!=='w'||g.promotionMoves)return;
  const piece=g.position.board[index],color=mathChessPieceColor(piece),legal=mathChessLegalMoves(g.position,'w');
  if(g.selected==null){if(color==='w'){g.selected=index;g.message=`${mathChessCoord(index)} selected. Choose a destination.`;}return renderGames();}
  if(color==='w'){g.selected=index;g.message=`${mathChessCoord(index)} selected. Choose a destination.`;return renderGames();}
  const candidates=legal.filter(m=>m.from===g.selected&&m.to===index);if(!candidates.length){g.message='That is not a legal move. Choose another square.';return renderGames();}
  if(candidates.length>1&&candidates.every(m=>m.promotion)){g.promotionMoves=candidates;g.message='Choose the piece for your pawn promotion.';return renderGames();}
  mathChessPlayMove(g,candidates[0]);
}
function mathChessChoosePromotion(kind){const g=mathChessSession;if(!g?.promotionMoves?.length)return;const wanted=String(kind||'q').toLowerCase(),move=g.promotionMoves.find(m=>String(m.promotion||'').toLowerCase()===wanted)||g.promotionMoves[0];mathChessPlayMove(g,move);}
function mathChessCheckAnswer(raw){
  const g=mathChessSession;if(!g?.question||!g.pendingMove)return;const q=g.question,result=validateAnswer(q,String(raw??'').trim());
  if(!result.correct){g.feedback='Not quite — your chess move stays locked. Try the maths question again.';return renderGames();}
  g.position=mathChessApplyMove(g.position,g.pendingMove);g.lastMove=g.pendingMove;g.history.push(mathChessPositionKey(g.position));g.moves+=1;g.pendingMove=null;g.question=null;g.feedback='Correct — move unlocked!';g.selected=null;
  const stateAfter=mathChessPositionState(g.position,g.position.turn,g.history);if(stateAfter.over)return finishMathChess(stateAfter.result,stateAfter.message);
  g.message=`Correct! Bot (${g.difficulty}) is thinking…`;saveMathChessSession(g);renderGames();setTimeout(mathChessBotMove,g.difficulty==='hard'?450:280);
}
function mathChessBotMove(){
  const g=mathChessSession;if(!g||g.status!=='playing'||g.position.turn!=='b')return;const move=mathChessBotChoice(g.position,g.difficulty);if(!move){const s=mathChessPositionState(g.position,'b',g.history);return finishMathChess(s.result,s.message);}
  g.position=mathChessApplyMove(g.position,move);g.lastMove=move;g.history.push(mathChessPositionKey(g.position));const botText=`Bot played ${mathChessCoord(move.from)} → ${mathChessCoord(move.to)}${move.castle?' (castled)':''}.`;const stateAfter=mathChessPositionState(g.position,g.position.turn,g.history);if(stateAfter.over)return finishMathChess(stateAfter.result,stateAfter.message);g.message=`${botText} Your move.`;saveMathChessSession(g);renderGames();
}
function mathChessQuestionHtml(g){
  if(g.promotionMoves?.length)return `<section class="math-chess-question math-chess-promotion"><span class="eyebrow">Pawn promotion</span><h3>Choose your new piece</h3><div class="math-chess-promotion-grid"><button data-action="math-chess-promotion" data-piece="q"><span>♛</span>Queen</button><button data-action="math-chess-promotion" data-piece="r"><span>♜</span>Rook</button><button data-action="math-chess-promotion" data-piece="b"><span>♝</span>Bishop</button><button data-action="math-chess-promotion" data-piece="n"><span>♞</span>Knight</button></div></section>`;
  if(!g.question)return'';const q=g.question;
  if(q.type==='multiple-choice')return `<section class="math-chess-question"><span class="eyebrow">Unlock your move</span><h3>${mathHtml(q.prompt)}</h3><div class="math-chess-answer-grid">${(q.options||[]).map(o=>`<button data-action="math-chess-answer" data-answer="${escapeHtml(o.id)}">${mathHtml(o.label)}</button>`).join('')}</div>${g.feedback?`<p class="math-chess-feedback">${escapeHtml(g.feedback)}</p>`:''}</section>`;
  return `<section class="math-chess-question"><span class="eyebrow">Unlock your move</span><h3>${mathHtml(q.prompt)}</h3><div class="math-chess-input-row"><input id="math-chess-answer-input" ${mathAnswerInputAttrs(q)} autocomplete="off" placeholder="Your answer"><button class="btn primary" data-action="math-chess-submit">Unlock move</button></div>${g.feedback?`<p class="math-chess-feedback">${escapeHtml(g.feedback)}</p>`:''}</section>`;
}
function mathChessHtml(){
  const g=mathChessSession,board=g.position.board,legal=g.selected==null?[]:mathChessLegalMoves(g.position,'w').filter(m=>m.from===g.selected).map(m=>m.to),files=['a','b','c','d','e','f','g','h'];
  const boardHtml=board.map((piece,i)=>{const row=mathChessRow(i),col=mathChessCol(i),selected=g.selected===i,target=legal.includes(i),last=g.lastMove&&(g.lastMove.from===i||g.lastMove.to===i),pieceColor=mathChessPieceColor(piece);return `<button class="math-chess-square ${(row+col)%2?'dark':'light'} ${selected?'selected':''} ${target?'target':''} ${last?'last-move':''}" data-action="math-chess-square" data-square="${i}" aria-label="${mathChessCoord(i)} ${piece||'empty'}"><span class="math-chess-piece ${pieceColor==='w'?'white-piece':'black-piece'}">${piece?MATH_CHESS_PIECES[piece]:''}</span>${row===7?`<small class="file-label">${files[col]}</small>`:''}${col===0?`<small class="rank-label">${8-row}</small>`:''}</button>`;}).join('');
  const inCheck=mathChessInCheck(board,g.position.turn);const turn=g.position.turn==='w'?'Your turn':'Bot thinking';return `<div class="page math-chess-page"><div class="math-chess-top"><button class="btn ghost" data-action="stop-math-chess">← Games</button><div><span class="eyebrow">Chess · ${escapeHtml(g.difficulty)} bot</span><h1>Normal chess</h1><p class="math-chess-subtitle">Standard chess rules against the bot. No maths questions interrupt your moves.</p></div><div class="game-time-bank"><small>GAME TIME</small><strong id="math-chess-time-left">${formatGameTime(state.gameTimeSeconds)}</strong><span>/ 5:00</span></div></div><div class="math-chess-layout"><section class="math-chess-board-column"><div class="math-chess-player-card bot"><span class="player-avatar">♚</span><div><small>BLACK</small><strong>MathsExpress Bot</strong></div><b>${g.difficulty.toUpperCase()}</b></div><div class="math-chess-board-frame"><div class="math-chess-board" role="grid" aria-label="Chess board">${boardHtml}</div></div><div class="math-chess-player-card you"><span class="player-avatar">♔</span><div><small>WHITE</small><strong>${escapeHtml(state.playerName||'You')}</strong></div><b>${escapeHtml(turn)}</b></div><div class="math-chess-status"><strong>${escapeHtml(g.message)}</strong>${inCheck?'<span>CHECK</span>':''}</div></section><aside class="math-chess-side"><div class="math-chess-difficulty"><small>BOT</small><strong>${escapeHtml(g.difficulty.toUpperCase())}</strong><span>${g.difficulty==='easy'?'Makes mostly random legal moves.':g.difficulty==='medium'?'Looks for captures, checks and useful castling.':'Searches ahead and evaluates positions.'}</span></div>${g.status==='finished'?`<div class="math-chess-finish"><h2>${g.result==='win'?'You won!':g.result==='draw'?'Draw':'Bot wins'}</h2><p>${escapeHtml(g.message)}</p><button class="btn primary" data-action="start-math-chess" data-difficulty="${escapeHtml(g.difficulty)}">Play again</button><button class="btn secondary" data-action="stop-math-chess">Back to Games</button></div>`:g.status==='paused'?`<div class="math-chess-finish math-chess-paused"><span class="eyebrow">Saved game</span><h2>Chess paused at 0:00</h2><p>Your board, turn, castling rights, en passant state and move history are saved.</p>${state.gameTimeSeconds>0?'<button class="btn primary" data-action="resume-math-chess">Resume saved game</button>':'<button class="btn primary" data-route="learn">Earn more Game Time</button>'}<button class="btn secondary" data-action="stop-math-chess">Abandon saved game</button></div>`:mathChessQuestionHtml(g)}<div class="math-chess-how"><h3>Full chess rules</h3><p>• Legal moves must keep your king safe.</p><p>• Kingside and queenside castling are supported.</p><p>• En passant is supported on the immediately following move.</p><p>• Promotion lets you choose Queen, Rook, Bishop or Knight.</p><p>• Checkmate and stalemate end the game.</p><p>• Threefold repetition, the 50-move rule and insufficient material can draw the game.</p><small>Game Time pauses the match at 0:00. Your exact position is saved so you can resume later.</small></div></aside></div></div>`;
}
async function refreshGamesEloCard(){
  try{eloBoardData=await getSchoolClient().eloLeaderboards();const root=document.getElementById('games-elo-summary');if(!root)return;const me=eloBoardData?.me||{};root.innerHTML=`<span class="eyebrow">Your ELO</span><strong>${Number(me.rating)||1000}</strong><small>Peak ${Number(me.peak_rating)||1000} · ${Number(me.sessions)||0} sessions</small><button class="btn ghost small" data-route="elo">View leaderboards</button>`;}catch{}
}
function renderGames() {
  const view=document.getElementById('app-view');
  if(activeSchoolAssignment?.id && activeSchoolAssignment?.gamesLocked){view.innerHTML=`<div class="page"><section class="calm-card"><span class="eyebrow">Games locked for this assignment</span><h1>Finish or leave your assigned work first.</h1><button class="btn primary" data-action="leave-assignment">Return to assignment</button></section></div>`;return;}
  const flags=normalizeFeatureFlags(state.featureFlags||{});if(!flags.games){view.innerHTML=`<div class="page"><section class="calm-card"><span class="eyebrow">Games disabled</span><h1>Games are turned off for this school.</h1></section></div>`;return;}
  if(mathChessSession){view.innerHTML=mathChessHtml();if(mathChessSession.status==='playing'&&!mathChessTimer)startMathChessTimer();return;}
  if(eduGameSession){view.innerHTML=educationalGameHtml();if(!eduGameTimer)startEduGameTimer();return;}
  stopEduGameTimer();stopMathChessTimer();
  view.innerHTML=`<div class="page games-page v74-games"><div class="page-head"><div><span class="eyebrow">Educational Games</span><h1>Spend your earned Game Time</h1><p>Your bank can hold a maximum of <strong>5:00</strong>. When it is full, you must spend some before learning questions can add more.</p></div><div class="game-time-bank"><small>GAME TIME</small><strong>${formatGameTime(state.gameTimeSeconds)}</strong><span>/ 5:00</span></div></div><div class="two-game-grid three-game-grid"><article class="edu-mode-card quick"><span class="mode-icon">QM</span><span class="eyebrow">Mode 1</span><h2>Quick Maths</h2><p>Rapid arithmetic and number skills. There is no timer per question — keep answering until your saved Game Time reaches zero.</p><button class="btn primary" data-action="start-edu-game" data-mode="quick-maths" ${state.gameTimeSeconds<1?'disabled':''}>${state.gameTimeSeconds<1?'Earn Game Time first':'Play Quick Maths'}</button></article><article class="edu-mode-card quest"><span class="mode-icon">MQ</span><span class="eyebrow">Mode 2</span><h2>Maths Quest</h2><p>Word problems, algebra, percentages, geometry and statistics. ELO is earned per question: +5 first try, +4 second try, then +0.</p><button class="btn primary" data-action="start-edu-game" data-mode="maths-quest" ${state.gameTimeSeconds<1?'disabled':''}>${state.gameTimeSeconds<1?'Earn Game Time first':'Start Maths Quest'}</button></article><article class="edu-mode-card chess"><span class="mode-icon">♞</span><span class="eyebrow">Mode 3</span><h2>Chess</h2><p>Normal chess against a bot with standard legal moves, check, checkmate, castling, en passant, promotion and draws.</p>${state.savedMathChess&&state.savedMathChess.status!=='finished'?`<div class="saved-chess-banner"><strong>Saved game</strong><span>${Number(state.savedMathChess.moves)||0} moves · ${escapeHtml(String(state.savedMathChess.difficulty||'easy'))} bot</span><button class="btn primary" data-action="resume-math-chess" ${state.gameTimeSeconds<1?'disabled':''}>${state.gameTimeSeconds<1?'Earn Game Time to resume':'Resume saved game'}</button></div>`:`<div class="math-chess-starts"><button class="btn secondary" data-action="start-math-chess" data-difficulty="easy" ${state.gameTimeSeconds<1?'disabled':''}>Easy</button><button class="btn secondary" data-action="start-math-chess" data-difficulty="medium" ${state.gameTimeSeconds<1?'disabled':''}>Medium</button><button class="btn primary" data-action="start-math-chess" data-difficulty="hard" ${state.gameTimeSeconds<1?'disabled':''}>Hard</button></div>`}</article></div><section class="calm-card game-rules"><h2>Game Time rules</h2><div class="game-time-steps"><div><b>1</b><span>Correct learning questions earn +10 seconds</span></div><div><b>2</b><span>Your bank stops earning at 5:00</span></div><div><b>3</b><span>Games spend one second every second</span></div><div><b>4</b><span>Game questions never generate more Game Time</span></div></div></section><aside id="games-elo-summary" class="games-elo-summary"><span class="spinner"></span><small>Loading ELO…</small></aside></div>`;
  refreshGamesEloCard();
}

async function loadEloBoard(force=false){if(eloBoardData&&!force)return eloBoardData;eloBoardData=await getSchoolClient().eloLeaderboards();return eloBoardData;}
function eloRowsHtml(rows=[]){return rows.length?rows.slice(0,100).map((r,i)=>`<div class="elo-row ${String(r.user_id)===String(account.profile?.userId)?'me':''}"><b>${i+1}</b><span>${escapeHtml(r.display_name||'Student')}<small>${Number(r.sessions)||0} sessions · ${Number(r.accuracy)||0}% accuracy</small></span><strong>${Number(r.rating)||1000}</strong></div>`).join(''):'<div class="school-empty">No rated game sessions yet.</div>';}
async function refreshEloPage(){try{const data=await loadEloBoard(true);const root=document.getElementById('elo-page-content');if(!root)return;const me=data?.me||{},c=data?.class||{},sch=data?.school||{};root.innerHTML=`<section class="elo-hero"><div><span class="eyebrow">Your rating</span><h1>${Number(me.rating)||1000} ELO</h1><p>Peak ${Number(me.peak_rating)||1000} · ${Number(me.sessions)||0} rated sessions</p></div>${(c.rows||[])[0]?`<div class="champion-card"><small>CLASS CHAMPION</small><strong>${escapeHtml(c.rows[0].display_name)}</strong><span>${Number(c.rows[0].rating)||1000} ELO</span></div>`:''}${(sch.rows||[])[0]?`<div class="champion-card school"><small>SCHOOL CHAMPION</small><strong>${escapeHtml(sch.rows[0].display_name)}</strong><span>${Number(sch.rows[0].rating)||1000} ELO</span></div>`:''}</section><div class="elo-grid"><section class="calm-card"><span class="eyebrow">${escapeHtml(c.name||'Your class')}</span><h2>Class leaderboard</h2><div class="elo-board">${eloRowsHtml(c.rows||[])}</div></section><section class="calm-card"><span class="eyebrow">${escapeHtml(sch.name||'Your school')}</span><h2>School leaderboard</h2><div class="elo-board">${eloRowsHtml(sch.rows||[])}</div></section></div>`;}catch(error){const root=document.getElementById('elo-page-content');if(root)root.innerHTML=`<div class="school-empty">Could not load ELO right now. ${escapeHtml(error.message||'')}</div>`;}}
function renderElo(){const view=document.getElementById('app-view');view.innerHTML=`<div class="page elo-page"><div class="page-head"><div><span class="eyebrow">Competitive maths</span><h1>ELO Rankings</h1><p>Your rating is earned question by question: +5 for a first-try correct answer, +4 for a second-try correct answer, and +0 after that.</p></div><button class="btn primary" data-route="games">Play rated maths</button></div><div id="elo-page-content"><div class="school-loading"><span class="spinner"></span><strong>Loading leaderboards…</strong></div></div></div>`;refreshEloPage();}
async function refreshHomeEloChampion(){
  const root=document.getElementById('home-class-champion');
  if(!root)return;
  if(account.profile?.role!=='player'){
    root.innerHTML=`<div class="home-champion"><span>◎</span><div><strong>${escapeHtml(platformRoleLabel(account.profile?.role))} workspace</strong><small>Student class rankings appear here.</small></div></div><button class="btn ghost small" data-route="elo">Open ELO</button>`;
    return;
  }
  try{
    const data=await loadEloBoard();
    if(!document.getElementById('home-class-champion'))return;
    const champ=data?.class?.rows?.[0];
    root.innerHTML=champ?`<span class="eyebrow">Class ELO Champion</span><div class="home-champion"><span>♜</span><div><strong>${escapeHtml(champ.display_name)}</strong><small>${Number(champ.rating)||1000} ELO · ${escapeHtml(data.class.name||'Your class')}</small></div></div><button class="btn ghost small" data-route="elo">View ELO</button>`:`<span class="eyebrow">ELO Rankings</span><p class="lock-note">No rated sessions yet. Play an educational game to establish a rating.</p><div class="side-actions"><button class="btn primary small" data-route="elo">Open ELO</button><button class="btn ghost small" data-route="games">Play first game</button></div>`;
  }catch{
    root.innerHTML=`<div class="home-champion"><span>◎</span><div><strong>Leaderboard</strong><small>Connect online to load class rankings.</small></div></div><button class="btn ghost small" data-route="elo">Open ELO</button>`;
  }
}

function localChallengeRows(yearLevel) {
  return (state.challengeHistory || []).filter(r => Number(r.yearLevel)===Number(yearLevel) && r.weekKey===challengeWeekKey());
}

async function claimPreviousChallengeReward(yearLevel) {
  if (challengeRewardChecked) return;
  challengeRewardChecked = true;
  try {
    const { data, error } = await accountClient.ensureClient().rpc('mathsexpress_claim_challenge_reward', { p_week_key:previousChallengeWeekKey(), p_year_level:Number(yearLevel) });
    if (!error) {
      if (data && typeof data === 'object' && ('coins' in data || 'game_time_seconds' in data || 'inventory' in data)) await applyRemotePlayerState(data,{quiet:true});
      const rewardCoins=Number(data?.reward_coins)||0;
      if(rewardCoins>0) showToast('Weekly leaderboard reward!', `You placed #${data.rank} and earned ${rewardCoins} coins.`, 'reward');
    }
  } catch {}
}

async function refreshChallengeLeaderboard(yearLevel) {
  const local = localChallengeRows(yearLevel);
  challengeLeaderboard = rankChallengeScores(local);
  try {
    const client = accountClient.ensureClient();
    const { data, error } = await client.rpc('mathsexpress_global_leaderboard', { p_week_key: challengeWeekKey(), p_year_level:Number(yearLevel) });
    if (!error && Array.isArray(data)) challengeLeaderboard = data.map((r,i)=>({ ...r, rank:i+1, totalMs:Number(r.total_ms), rewardCoins:WEEKLY_REWARDS[i+1]||0, displayName:r.display_name || 'Student' }));
  } catch {}
}
async function refreshChallengePersonalBest(yearLevel){
  try{
    const key=`weekly-speed:${challengeWeekKey()}:year${Number(yearLevel)}`;
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_personal_best',{p_key:key});
    if(error)throw error;
    challengePersonalBest=data||null;
    const root=document.getElementById('challenge-personal-best');
    if(root){
      const best=Number(data?.best_value); const ms=Number.isFinite(best)?Math.max(0,10000000-best):null;
      root.innerHTML=ms!==null?`<span class="eyebrow">Personal best</span><strong>${formatChallengeTime(ms)}</strong><small>${Number(data?.attempts)||0} attempt${Number(data?.attempts)===1?'':'s'} this week</small>`:`<span class="eyebrow">Personal best</span><strong>—</strong><small>Complete a run to set your first PB.</small>`;
    }
  }catch{}
}

function challengeLeaderboardHtml(yearLevel) {
  const rows = challengeLeaderboard.length ? challengeLeaderboard : rankChallengeScores(localChallengeRows(yearLevel));
  return `<div class="challenge-board">${rows.slice(0,20).map((r,i)=>`<div class="challenge-row"><b>${i<3?['🥇','🥈','🥉'][i]:i+1}</b><span>${escapeHtml(r.displayName || r.display_name || state.playerName)}</span><strong>${formatChallengeTime(r.totalMs ?? r.total_ms)}</strong><small>${r.rewardCoins?`+${r.rewardCoins} coins`:''}</small></div>`).join('') || '<div class="school-empty">No completed runs yet. Set the first time this week.</div>'}</div>`;
}

function startSpeedChallenge() {
  const year = Math.max(0, Math.min(12, normaliseYearLevel(account.profile?.yearLevel)));
  const task = searchTaskLibrary({ yearLevel:year, type:'practice', difficulty:'medium', questionCount:10, limit:1 })[0];
  if (!task) return showToast('Challenge unavailable', 'No challenge task was found for your year level.');
  speedChallenge = { run:createUniqueGeneratedTaskRun(task), startedAt:Date.now(), wrongAnswers:0, finished:false, yearLevel:year };
  trackActivityEvent('challenge-started','challenge','start-global-challenge',{yearLevel:year,weekKey:challengeWeekKey()});
  renderChallenges();
}

function finishSpeedChallenge() {
  if (!speedChallenge || speedChallenge.finished) return;
  speedChallenge.finished = true;
  const score = scoreSpeedChallenge({ elapsedMs:Date.now()-speedChallenge.startedAt, wrongAnswers:speedChallenge.wrongAnswers, correct:10 });
  speedChallenge.result = score;
  const row = { weekKey:challengeWeekKey(), yearLevel:speedChallenge.yearLevel, displayName:state.playerName, ...score, createdAt:new Date().toISOString() };
  persist({ ...state, challengeHistory:[...(state.challengeHistory||[]),row].slice(-50) }, { quiet:true });
  challengeLeaderboard = rankChallengeScores(localChallengeRows(speedChallenge.yearLevel));
  trackActivityEvent('challenge-submitted','challenge','finish-global-challenge',{yearLevel:row.yearLevel,weekKey:row.weekKey,totalMs:row.totalMs,wrongAnswers:row.wrongAnswers});
  try { accountClient.ensureClient().rpc('mathsexpress_submit_global_challenge', { p_week_key:row.weekKey, p_year_level:row.yearLevel, p_elapsed_ms:row.elapsedMs, p_wrong_answers:row.wrongAnswers, p_total_ms:row.totalMs }); } catch {}
  try { const pbScore=Math.max(0,10000000-Number(row.totalMs||0)); accountClient.ensureClient().rpc('mathsexpress_record_personal_best',{p_key:`weekly-speed:${row.weekKey}:year${row.yearLevel}`,p_value:pbScore}).then(({data})=>{if(data?.is_personal_best)showToast('Personal best!','You beat your previous weekly speed score.','success'); void refreshChallengePersonalBest(row.yearLevel);}); } catch {}
}

function renderChallenges() {
  const view = document.getElementById('app-view');
  const flags=normalizeFeatureFlags(state.featureFlags||{});
  if(!flags.globalChallenges){ view.innerHTML=`<div class="page"><section class="calm-card"><div><span class="eyebrow">Challenges disabled</span><h1>Global Challenges are turned off.</h1><p>Your school can enable them from Feature Controls.</p></div><button class="btn primary" data-route="learn">Go to Learn</button></section></div>`; return; }
  const year = speedChallenge?.yearLevel ?? Math.max(0, Math.min(12, Number(account.profile?.yearLevel ?? 9)));
  if (speedChallenge && !speedChallenge.finished && !speedChallenge.run.complete) {
    const run=speedChallenge.run, q=run.current;
    view.innerHTML=`<div class="page challenge-page"><div class="page-head"><div><span class="eyebrow">Weekly Global Challenge · Year ${year}</span><h1>10-question speed run</h1><p>Wrong answers add a 5-second penalty. Finish all 10 accurately as fast as you can.</p></div><div class="challenge-live-time">Running</div></div><div class="progress-track"><div class="progress-fill" style="width:${Math.round(run.index/10*100)}%"></div></div><section class="card challenge-question"><span class="eyebrow">Question ${run.index+1} of 10</span><h2>${mathHtml(q.prompt)}</h2>${q.type==='multiple-choice'?`<div class="choice-grid">${q.options.map(o=>`<button class="choice ${run.selectedChoice===o.id?'selected':''}" data-action="challenge-choice" data-choice="${o.id}">${mathHtml(o.label)}</button>`).join('')}</div>`:`<input id="challenge-answer" class="answer-input" placeholder="Enter your answer">`}<div class="question-actions">${run.feedback?.correct?'<button class="btn success" data-action="challenge-next">Next →</button>':'<button class="btn primary" data-action="challenge-check">Check answer</button>'}</div>${run.feedback?`<div class="feedback ${run.feedback.correct?'correct':'wrong'}"><strong>${run.feedback.correct?'Correct!':'Not quite — +5s penalty'}</strong></div>`:''}</section></div>`;
    return;
  }
  if (speedChallenge?.run.complete && !speedChallenge.finished) finishSpeedChallenge();
  const last = speedChallenge?.finished ? speedChallenge.result : null;
  view.innerHTML=`<div class="page challenge-page">
    <div class="page-head challenge-page-head"><div><span class="eyebrow">Global Challenges</span><h1>Weekly speed challenge</h1><p>10 questions, one fair leaderboard for your year level, refreshed every week.</p></div><div class="week-chip">${challengeWeekKey()}</div></div>
    <div class="challenge-summary-row">${last?`<section class="challenge-result"><div><span>Latest run</span><strong>${formatChallengeTime(last.totalMs)}</strong></div><small>${last.wrongAnswers} wrong · ${formatChallengeTime(last.penaltyMs)} penalty</small></section>`:''}<section id="challenge-personal-best" class="challenge-personal-best"><span class="eyebrow">Personal best</span><strong>Loading…</strong><small>Beat your own best time each week.</small></section></div>
    <section class="calm-card challenge-start-card">
      <div class="challenge-year-badge"><small>YEAR</small><strong>${year}</strong></div>
      <div class="challenge-start-copy"><span class="eyebrow">This week</span><h2>Ready for 10 questions?</h2><p>Answer accurately and finish as fast as possible. Wrong answers add 5 seconds.</p></div>
      <button class="btn primary challenge-start-button" data-action="start-speed-challenge">Start challenge</button>
    </section>
    <div class="challenge-prizes" aria-label="Weekly prizes">
      <div class="challenge-prize first"><span>🥇</span><div><strong>1st place</strong><small>15 coins</small></div></div>
      <div class="challenge-prize second"><span>🥈</span><div><strong>2nd place</strong><small>8 coins</small></div></div>
      <div class="challenge-prize third"><span>🥉</span><div><strong>3rd place</strong><small>4 coins</small></div></div>
    </div>
    ${flags.leaderboards?`<section class="calm-card challenge-leaderboard-card"><div class="calm-section-head"><div><span class="eyebrow">Global leaderboard · Year ${year}</span><h2>This week</h2><p>Fastest total time after penalties ranks first.</p></div><button class="btn ghost small" data-action="refresh-challenge-board">Refresh</button></div>${challengeLeaderboardHtml(year)}</section>`:`<section class="calm-card"><div><span class="eyebrow">Private challenge mode</span><h2>Leaderboard hidden</h2><p>Your time still saves as a personal result, but public rankings are disabled.</p></div></section>`}
  </div>`;
  claimPreviousChallengeReward(year);
  void refreshChallengePersonalBest(year);
  if(flags.leaderboards) refreshChallengeLeaderboard(year).then(()=>{ if(routeFromHash().route==='challenges' && !speedChallenge?.run?.current) { const el=document.querySelector('.challenge-board'); if(el) el.outerHTML=challengeLeaderboardHtml(year); } });
}

function submitChallengeAnswer() {
  if (!speedChallenge?.run?.current || speedChallenge.run.feedback?.correct) return;
  const run=speedChallenge.run, q=run.current;
  const raw=q.type==='multiple-choice'?run.selectedChoice:(document.getElementById('challenge-answer')?.value||'');
  if (!String(raw).trim()) return showToast('Add an answer first','Choose or type an answer.');
  const before=run.answered;
  speedChallenge.run=submitGeneratedAnswer(run,raw);
  if (speedChallenge.run.answered>before) {
    if (!speedChallenge.run.feedback?.correct) speedChallenge.wrongAnswers += 1;
    else persist(state,{quiet:true});
  }
  const correct=Boolean(speedChallenge.run.feedback?.correct);
  flashBoardResult(correct);
  renderChallenges();
  const answeredQuestionId=q.id;
  setTimeout(()=>{
    if(!speedChallenge?.run?.current || speedChallenge.run.current.id!==answeredQuestionId) return;
    speedChallenge.run=advanceGeneratedTask(speedChallenge.run);
    if(speedChallenge.run.complete) finishSpeedChallenge();
    renderChallenges();
  },1100);
}

function renderShop() {
  const view = document.getElementById('app-view');
  const categories=['all',...new Set(COSMETICS.map(x=>x.category))];
  const visible=shopCategory==='all'?COSMETICS:COSMETICS.filter(x=>x.category===shopCategory);
  view.innerHTML = `
    <div class="page">
      <div class="page-head"><div><span class="eyebrow">Cosmetic rewards only</span><h1>MathsExpress Shop</h1><p>Outfits, pets, frames, backgrounds, titles, themes, avatars and game skins. Everything is cosmetic.</p></div><div class="tag purple">◆ ${state.coins} coins</div></div>
      <div class="shop-category-tabs">${categories.map(c=>`<button class="${shopCategory===c?'active':''}" data-action="shop-category" data-category="${escapeHtml(c)}">${escapeHtml(c==='all'?'All':c.replace(/([A-Z])/g,' $1').replace(/^./,m=>m.toUpperCase()))}</button>`).join('')}</div>
      <div class="shop-summary"><strong>${visible.length}</strong> items shown · <span>${COSMETICS.length} total rewards</span></div>
      <div class="shop-grid">${visible.map((item) => {
        const owned = state.ownedCosmetics.includes(item.id);
        const equipped = state.equipped?.[item.category] === item.id;
        return `<article class="card shop-card"><div class="item-icon">${item.icon}</div><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p></div><div class="price-row"><span class="price">${item.price === 0 ? 'FREE' : `◆ ${item.price}`}</span>${equipped ? '<span class="tag green">Equipped</span>' : owned ? `<button class="btn small secondary" data-action="equip-item" data-item-id="${item.id}">Equip</button>` : `<button class="btn small primary" data-action="buy-item" data-item-id="${item.id}">Buy</button>`}</div></article>`;
      }).join('')}</div>
    </div>`;
}

function validCharacterColour(value,fallback){
  const v=String(value||'').trim();
  return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;
}
function characterAppearance(){
  const raw=state?.characterAppearance&&typeof state.characterAppearance==='object'?state.characterAppearance:{};
  const style=['classic','sport','varsity','hoodie'].includes(raw.style)?raw.style:'classic';
  return {
    skin:validCharacterColour(raw.skin,'#f2c7a4'),
    shirtPrimary:validCharacterColour(raw.shirtPrimary,'#4b63d3'),
    shirtSecondary:validCharacterColour(raw.shirtSecondary,'#2e3b86'),
    pants:validCharacterColour(raw.pants,'#29304d'),
    style,
  };
}
function characterAppearanceControlsHtml(){
  const a=characterAppearance();
  return `<section class="card card-pad character-customiser"><div class="section-title"><div><span class="eyebrow">Your character</span><h2>Character colours</h2></div></div><p class="lock-note">Choose your skin tone, clothes colours and clothing style. These are cosmetic only.</p><div class="character-customiser-grid"><label><span>Skin colour</span><input id="character-skin-colour" type="color" value="${a.skin}"></label><label><span>Top colour</span><input id="character-shirt-primary" type="color" value="${a.shirtPrimary}"></label><label><span>Second top colour</span><input id="character-shirt-secondary" type="color" value="${a.shirtSecondary}"></label><label><span>Pants colour</span><input id="character-pants-colour" type="color" value="${a.pants}"></label><label class="character-style-select"><span>Clothes style</span><select id="character-clothes-style"><option value="classic" ${a.style==='classic'?'selected':''}>Classic</option><option value="sport" ${a.style==='sport'?'selected':''}>Sport</option><option value="varsity" ${a.style==='varsity'?'selected':''}>Varsity</option><option value="hoodie" ${a.style==='hoodie'?'selected':''}>Hoodie</option></select></label></div><div class="hero-actions"><button class="btn primary" data-action="save-character-appearance">Save character</button><button class="btn secondary" data-action="reset-character-appearance">Reset colours</button></div></section>`;
}
function cosmeticCharacterHtml({compact=false,showIdentity=true}={}){
  const outfit=getEquippedCosmetic(state,'outfit');
  const avatar=getEquippedCosmetic(state,'avatar');
  const frame=getEquippedCosmetic(state,'frame');
  const background=getEquippedCosmetic(state,'background');
  const pet=getEquippedCosmetic(state,'pet');
  const title=getEquippedCosmetic(state,'title');
  const nameEffect=getEquippedCosmetic(state,'nameEffect');
  const appearance=characterAppearance();
  const styleVars=`--skin:${appearance.skin};--shirt-primary:${appearance.shirtPrimary};--shirt-secondary:${appearance.shirtSecondary};--pants:${appearance.pants}`;
  return `<div class="mx-character-card ${compact?'compact':''} ${escapeHtml(frame?.id||'frame-default')}" data-background="${escapeHtml(background?.id||'default')}" data-clothes-style="${appearance.style}" style="${styleVars}">
    <div class="mx-character-scene">
      <div class="mx-character-halo"></div>
      <div class="mx-character-model" aria-label="${escapeHtml(outfit?.name||'MathsExpress Student')} character">
        <div class="mx-character-hair"></div>
        <div class="mx-character-head"><i class="eye left"></i><i class="eye right"></i><i class="smile"></i></div>
        <div class="mx-character-neck"></div>
        <div class="mx-character-torso"><span>${escapeHtml(outfit?.icon||'M')}</span></div>
        <div class="mx-character-arm left"></div><div class="mx-character-arm right"></div>
        <div class="mx-character-leg left"></div><div class="mx-character-leg right"></div>
      </div>
      ${pet?`<div class="mx-character-pet" title="${escapeHtml(pet.name)}"><span>${pet.icon}</span><small>${escapeHtml(pet.name.replace(' Study Pet',''))}</small></div>`:''}
    </div>
    ${showIdentity?`<div class="mx-character-identity"><strong class="${escapeHtml(nameEffect?.cssClass||'')}">${escapeHtml(state.playerName)}</strong>${title?`<span>${escapeHtml(title.name)}</span>`:''}<small>${escapeHtml(outfit?.name||'MathsExpress Student')}${avatar?` · ${escapeHtml(avatar.name)}`:''}</small></div>`:''}
  </div>`;
}

function renderLocker() {
  const view = document.getElementById('app-view');
  const outfit = getEquippedCosmetic(state, 'outfit');
  const nameEffect = getEquippedCosmetic(state, 'nameEffect');
  const torsoStyle = outfit?.previewStyle || '';
  const nameClass = nameEffect?.cssClass || '';
  const owned = COSMETICS.filter((item) => state.ownedCosmetics.includes(item.id));
  view.innerHTML = `
    <div class="page">
      <div class="page-head"><div><span class="eyebrow">Character customisation</span><h1>Locker</h1><p>Equip the cosmetic rewards you have earned.</p></div><button class="btn secondary" data-route="shop">Open shop</button></div>
      <div class="locker-layout">
        <div class="locker-preview-column"><section class="character-stage clean-character-stage">${cosmeticCharacterHtml()}</section>${characterAppearanceControlsHtml()}</div>
        <section><div class="section-title" style="margin-top:0"><h2>Owned cosmetics</h2><span>${owned.length}/${COSMETICS.length}</span></div><div class="shop-grid">${owned.map((item) => {
          const equipped = state.equipped?.[item.category] === item.id;
          return `<article class="card shop-card"><div class="item-icon">${item.icon}</div><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p></div><div class="price-row"><span class="tag">${escapeHtml(item.category)}</span>${equipped ? '<span class="tag green">Equipped</span>' : `<button class="btn small secondary" data-action="equip-item" data-item-id="${item.id}">Equip</button>`}</div></article>`;
        }).join('')}</div></section>
      </div>
    </div>`;
}

function renderAchievements() {
  const view = document.getElementById('app-view');
  const earned = new Set(state.achievements ?? []);
  const claimed = new Set(state.achievementRewardsClaimed ?? []);
  const filter = achievementsFilter;
  const visible = ACHIEVEMENTS.map((achievement, index) => ({achievement, index, got: earned.has(achievement.id)}))
    .filter(({got}) => filter==='discovered' ? got : filter==='undiscovered' ? !got : true);
  view.innerHTML = `
    <div class="page achievements-page">
      <div class="page-head"><div><span class="eyebrow">Your milestones</span><h1>Achievements</h1><p>Unlock badges to earn coins, XP and Game Time while you learn.</p></div><span class="tag green">${earned.size}/${ACHIEVEMENTS.length} earned</span></div>
      <div class="achievement-filter-bar" role="tablist" aria-label="Filter achievements">${[['all','All'],['discovered','Discovered'],['undiscovered','Undiscovered']].map(([id,label])=>`<button class="${filter===id?'active':''}" data-action="achievements-filter" data-filter="${id}" role="tab" aria-selected="${filter===id}">${label}</button>`).join('')}</div>
      <div class="achievement-summary"><strong>${visible.length}</strong><span>${filter==='discovered'?'discovered badges':filter==='undiscovered'?'still to discover':`badges available, including secret milestones`}</span></div><div class="badge-grid">${visible.map(({achievement, index, got}) => {const secret=achievement.title==='???';const title=got&&achievement.secretTitle?achievement.secretTitle:achievement.title;const desc=secret&&!got?'Secret achievement — keep learning to discover it.':achievement.description;const reward=achievementRewardFor(achievement.id);const rewardState=got&&claimed.has(achievement.id)?'Reward received':got?'Reward ready':`+${reward.coins} coins · +${reward.xp} XP · +${reward.gameTimeSeconds}s`;return `<article class="card badge-card ${got?'':'locked'} ${secret?'secret':''}"><div class="badge-icon">${got ? ['★','✦','◎','◆'][index % 4] : secret?'?':'🔒'}</div><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p><span class="achievement-reward ${got?'earned':''}">${escapeHtml(rewardState)}</span></div></article>`}).join('')||'<div class="school-empty">No badges match this filter yet.</div>'}</div>
    </div>`;
}

let mascotFeedbackTimer=null;
function showMascotFeedback(pose,message){
  let host=document.getElementById('mx-feedback-mascot');
  if(!host){host=document.createElement('div');host.id='mx-feedback-mascot';host.setAttribute('role','status');document.body.appendChild(host);}
  host.innerHTML=cloveHtml(pose,message);host.hidden=false;clearTimeout(mascotFeedbackTimer);mascotFeedbackTimer=setTimeout(()=>{host.hidden=true;},2400);
}
function juniorLessonHtml(section){
  const counting=/count|number.*20/i.test(section.title||'');
  return `<section class="textbook-content-block mx-junior-start">${cloveHtml('reading')}<h2>Let’s try it together</h2><p>${counting?'Touch each dot. Say one number for each dot.':'Ask an adult to read the example with you. Try one small step.'}</p>${counting?`<div class="mx-counting-dots">${Array.from({length:20},(_,i)=>`<button type="button" data-action="count-dot" data-number="${i+1}" aria-label="Count dot ${i+1}">●</button>`).join('')}</div><output id="mx-count-output" aria-live="polite">Start with the first dot.</output>`:'<p>Use blocks, drawings or your fingers to help. Say what you notice.</p>'}<p>It is okay to ask for help.</p></section>`;
}
function captureQuestionDraft(){
  return {fields:Array.from(document.querySelectorAll('.assignment-answer-control input,.assignment-answer-control textarea,.assignment-answer-control select,#assignment-step-input')).map(el=>({id:el.id,part:el.dataset.partId,left:el.dataset.left,value:el.value})),graph:document.getElementById('generated-graph-grid')?{...document.getElementById('generated-graph-grid').dataset}:null,tiles:Array.from(document.querySelectorAll('#generated-drag-zone .generated-drag-tile')).map(el=>el.dataset.value)};
}
function restoreQuestionDraft(){
  const saved=currentGeneratedTask?.uiDraft;
  if(saved){
    const fields=Array.from(document.querySelectorAll('.assignment-answer-control input,.assignment-answer-control textarea,.assignment-answer-control select,#assignment-step-input'));
    for(const field of saved.fields||[]){const el=fields.find(el=>field.id?el.id===field.id:field.part?el.dataset.partId===field.part:el.dataset.left===field.left);if(el)el.value=field.value;}
    const grid=document.getElementById('generated-graph-grid');if(grid&&saved.graph?.x!==undefined){Object.assign(grid.dataset,saved.graph);const min=Number(grid.dataset.min),max=Number(grid.dataset.max),x=Number(grid.dataset.x),y=Number(grid.dataset.y),marker=document.getElementById('generated-graph-marker');if(marker){marker.hidden=false;marker.style.left=`${100*(x-min)/(max-min)}%`;marker.style.top=`${100*(max-y)/(max-min)}%`;}const out=document.getElementById('generated-graph-output');if(out)out.textContent=`(${x}, ${y})`;}
    const zone=document.getElementById('generated-drag-zone');if(zone&&(saved.tiles||[]).length){zone.querySelector('.drop-placeholder')?.remove();for(const value of saved.tiles){const tile=Array.from(document.querySelectorAll('#generated-drag-source .generated-drag-tile')).find(el=>el.dataset.value===value);if(tile)zone.appendChild(tile);}}
  } else if(typeof currentGeneratedTask?.draftAnswer==='string'){const input=document.getElementById('lesson-answer');if(input)input.value=currentGeneratedTask.draftAnswer;}
}
function profileAppearanceHtml(){
  return cosmeticCharacterHtml({compact:true});
}

function renderProfile() {
  const view = document.getElementById('app-view');
  const m = buildProfileModel(state);
  const canEditIdentity = canEditAccountIdentity();
  view.innerHTML = `
    <div class="page">
      <div class="page-head profile-page-intro"><div class="profile-intro-copy"><span class="eyebrow">Player profile</span><h1>Your Profile</h1><p>Your progress is saved separately for this signed-in MathsExpress account.</p></div><div class="profile-intro-mascot" aria-hidden="true">${cloveHtml('happy')}</div></div>
      <div class="profile-grid">
        <section class="card profile-hero">${profileAppearanceHtml()}<p class="profile-level-line">Level ${m.level} • ${m.xp} XP</p><div class="tag purple">${m.streak} day streak</div><div class="hero-actions profile-character-actions"><button class="btn secondary small" data-route="locker">Customise character</button></div><div class="profile-account"><strong>${escapeHtml(account.profile?.email || '')}</strong><span>${escapeHtml((account.profile?.role || 'player').toUpperCase())}</span></div>${canEditIdentity?`<div class="profile-name-row"><input id="profile-name" class="answer-input" maxlength="24" value="${escapeHtml(state.playerName)}" aria-label="Player display name"><button class="btn small secondary" data-action="save-player-name">Save name</button></div>`:`<div class="identity-locked-note"><strong>Account identity is managed by school staff.</strong><span>Students cannot change their name, username or email.</span></div>`}</section>
        <section>
          <div class="grid two">
            <div class="card stat-card"><div class="icon">◎</div><strong>${m.accuracy}%</strong><small>Accuracy</small></div>
            <div class="card stat-card"><div class="icon">✎</div><strong>${m.questionsAnswered}</strong><small>Question attempts</small></div>
          </div>
          <div class="card card-pad" style="margin-top:18px"><div class="section-title" style="margin:0 0 12px"><h2>Algebra mastery</h2><span>${m.algebraMastery}%</span></div><div class="progress-track" style="height:10px"><div class="progress-fill" style="width:${m.algebraMastery}%"></div></div></div>
          <div class="card card-pad" style="margin-top:18px"><div class="section-title" style="margin:0 0 8px"><h2>Appearance</h2></div><p class="lock-note">Change your character colours, clothes style, background and theme.</p><div class="hero-actions"><button class="btn primary" data-route="locker">Character</button><button class="btn secondary" data-action="open-theme-customizer">Theme & background</button></div></div>
          ${(account.profile?.role||'player')==='player'?`<div class="card card-pad" style="margin-top:18px"><div class="section-title" style="margin:0 0 8px"><h2>Parents & Guardians</h2></div><p class="lock-note">Add a parent or guardian email so the school can send progress reports and teacher messages directly. No parent account is needed.</p><div class="hero-actions"><button class="btn primary" data-action="open-student-parent">Add / manage parent</button></div></div>`:''}
          <div class="card card-pad" style="margin-top:18px"><div class="section-title" style="margin:0 0 8px"><h2>Account & save</h2></div><p class="lock-note">Your save is separated by account on this browser. Download a backup before moving to another extracted folder or computer.</p><div class="hero-actions">${canUseOwnerConsole(account) ? '<button class="btn cyan" data-action="open-owner-console">Owner Console</button>' : ''}<button class="btn secondary" data-action="export-progress">Download backup</button><button class="btn secondary" data-action="import-progress">Restore backup</button><button class="btn secondary" data-action="sign-out">Sign out</button><button class="btn danger" data-action="reset-progress">Reset progress</button></div></div>
        </section>
      </div>
    </div>`;
}









function onboardingSlides() {
  return [
    {icon:'⌂',title:'Start at Home',body:'Home shows your assignments, recommended learning and progress. Use the top navigation to move around MathsExpress.',callout:'Teacher tasks, announcements and live games appear under Class.'},
    {icon:'✎',title:'Learn and Textbook',body:'Learn gives you practice by skill. Textbook gives full K–12 lessons, examples, exercises and chapter tests.',callout:'Use the small arrows in Textbook to open only the chapter you need.'},
    {icon:'AI',title:'Use help without giving away the answer',body:'AI Helper gives hints and checks your working one step at a time. Lesson Support is available whenever you need it, except in Test Mode.',callout:'Try first, then use help when you are actually stuck.'},
    {icon:'◎',title:'Mastery and progress',body:'Correct questions build mastery and growth evidence. Teachers can see your results, while you can use Learning Path and check-ins to find what to practise next.',callout:'A recurring 5-question Skills Check-In is a quick way to re-check mastery and schedule the next review.'},
    {icon:'▶',title:'Earn Game Time',body:'Correct learning questions add Game Time. Games spend that saved time and do not generate more Game Time.',callout:'Your bank stops at 5:00, so use it when it fills up.'},
  ];
}

function renderOnboardingModal() {
  const root=document.getElementById('modal-root');
  if(!root || state.onboardingComplete) return;
  const slides=onboardingSlides();
  onboardingStep=Math.max(0,Math.min(slides.length-1,Number(onboardingStep)||0));
  const item=slides[onboardingStep];
  root.innerHTML=`<div class="modal-backdrop onboarding-backdrop"><div class="modal pop onboarding-tour">
    <div class="onboarding-tour-progress"><span>Welcome to MathsExpress</span><strong>${onboardingStep+1} / ${slides.length}</strong></div>
    <div class="onboarding-tour-meter"><i style="width:${Math.round(((onboardingStep+1)/slides.length)*100)}%"></i></div>
    <div class="onboarding-tour-icon">${escapeHtml(item.icon)}</div>
    <h2>${escapeHtml(item.title)}</h2>
    <p>${escapeHtml(item.body)}</p>
    <div class="onboarding-callout">${escapeHtml(item.callout)}</div>
    <div class="onboarding-tour-actions">
      <button class="btn ghost" type="button" data-action="onboarding-prev" ${onboardingStep===0?'disabled':''}>← Back</button>
      ${onboardingStep<slides.length-1?'<button class="btn primary" type="button" data-action="onboarding-next">Next →</button>':'<button class="btn primary" type="button" data-action="complete-onboarding">Start MathsExpress →</button>'}
    </div>
  </div></div>`;
}

function showOnboarding() {
  // Welcome tour disabled — removed at user request.
}


function formatSchoolDate(value) {
  if (!value) return 'No due date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(date);
}

function schoolStatusPill(status = 'not-started') {
  const label = String(status).replaceAll('-', ' ');
  return `<span class="school-status ${escapeHtml(status)}">${escapeHtml(label)}</span>`;
}

function studentRecommendationCards() {
  const skills = LESSONS.map((lesson) => ({
    id: lesson.id,
    name: lesson.title,
    mastery: state.lessonMastery?.[lesson.id] ?? 0,
    prerequisiteMastery: 100,
    recent: false,
  }));
  return buildRecommendedPractice(skills).slice(0, 3).map((item) => `
    <button class="recommend-card" data-action="open-lesson" data-lesson-id="${escapeHtml(item.id)}">
      <span class="recommend-icon">✦</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.reason)} • ${Math.round(item.mastery)}% mastery</small></div><b>→</b>
    </button>`).join('');
}

function openStudioContent(id) {
  const item=studioContent.find((row)=>String(row.id)===String(id));
  if(!item) return showToast('Activity unavailable','Refresh your School Hub and try again.');
  activeStudioContentId=Number(item.id);
  if(item.content_type==='quick-poll') {
    const options=Array.isArray(item.payload?.options)?item.payload.options:[];
    return openSimpleModal(item.title,`<p>${escapeHtml(item.body||'Choose one response.')}</p><div class="studio-poll-options">${options.map((o,i)=>{const id=typeof o==='object'?(o.id||`o${i+1}`):`o${i+1}`;const label=typeof o==='object'?(o.label||o.value||id):o;return `<button class="poll-option" data-action="studio-poll-vote" data-option="${escapeHtml(id)}" data-label="${escapeHtml(label)}"><span>${escapeHtml(label)}</span><b>→</b></button>`}).join('')||'<div class="school-empty">This poll has no options yet.</div>'}</div>`);
  }
  if(item.content_type==='announcement') return openSimpleModal(item.title,`<div class="announcement-view"><p>${escapeHtml(item.body||'')}</p><small>${escapeHtml(formatSchoolDate(item.created_at))}</small></div>`);
  if(item.content_type==='exit-ticket') return openSimpleModal(item.title,`<p>${escapeHtml(item.body||'Complete a short end-of-lesson check.')}</p><button class="btn primary" data-route="learn">Start a short practice check</button>`);
  if(item.content_type==='live-lesson') return openSimpleModal(item.title,`<p>${escapeHtml(item.body||'Your teacher has started a live maths lesson.')}</p><button class="btn primary" data-route="games">Join live class activity</button>`);
  return openSimpleModal(item.title,`<p>${escapeHtml(item.body||'Your class has a new activity.')}</p><button class="btn primary" data-route="games">Open class games</button>`);
}



const CAMBRIDGE_BOOK_CATALOGUE=Object.freeze([{"id":"cam-001","title":"Cambridge Early Years Mathematics","years":[0],"pathsByYear":{"0":["Core"]},"series":"Early Years"},{"id":"cam-002","title":"Cambridge Primary Mathematics Learner’s Book 1","years":[1],"pathsByYear":{"1":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-003","title":"Cambridge Primary Mathematics Workbook 1","years":[1],"pathsByYear":{"1":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-004","title":"Cambridge Primary Mathematics Games Book 1","years":[1],"pathsByYear":{"1":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-005","title":"Cambridge Primary Mathematics Learner’s Book 2","years":[2],"pathsByYear":{"2":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-006","title":"Cambridge Primary Mathematics Workbook 2","years":[2],"pathsByYear":{"2":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-007","title":"Cambridge Primary Mathematics Games Book 2","years":[2],"pathsByYear":{"2":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-008","title":"Cambridge Primary Mathematics Learner’s Book 3","years":[3],"pathsByYear":{"3":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-009","title":"Cambridge Primary Mathematics Workbook 3","years":[3],"pathsByYear":{"3":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-010","title":"Cambridge Primary Mathematics Games Book 3","years":[3],"pathsByYear":{"3":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-011","title":"Cambridge Primary Mathematics Learner’s Book 4","years":[4],"pathsByYear":{"4":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-012","title":"Cambridge Primary Mathematics Workbook 4","years":[4],"pathsByYear":{"4":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-013","title":"Cambridge Primary Mathematics Games Book 4","years":[4],"pathsByYear":{"4":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-014","title":"Cambridge Primary Mathematics Learner’s Book 5","years":[5],"pathsByYear":{"5":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-015","title":"Cambridge Primary Mathematics Workbook 5","years":[5],"pathsByYear":{"5":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-016","title":"Cambridge Primary Mathematics Games Book 5","years":[5],"pathsByYear":{"5":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-017","title":"Cambridge Primary Mathematics Learner’s Book 6","years":[6],"pathsByYear":{"6":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-018","title":"Cambridge Primary Mathematics Workbook 6","years":[6],"pathsByYear":{"6":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-019","title":"Cambridge Primary Mathematics Games Book 6","years":[6],"pathsByYear":{"6":["Core"]},"series":"Cambridge Primary Mathematics"},{"id":"cam-020","title":"Cambridge Lower Secondary Mathematics Learner’s Book 7","years":[7],"pathsByYear":{"7":["Core"]},"series":"Lower Secondary"},{"id":"cam-021","title":"Cambridge Lower Secondary Mathematics Workbook 7","years":[7],"pathsByYear":{"7":["Core"]},"series":"Lower Secondary"},{"id":"cam-022","title":"Cambridge Checkpoint Mathematics 7","years":[7],"pathsByYear":{"7":["Core"]},"series":"Checkpoint"},{"id":"cam-023","title":"CambridgeMATHS NSW Year 7","years":[7],"pathsByYear":{"7":["Core","Advanced","Extension"]},"series":"CambridgeMATHS NSW"},{"id":"cam-024","title":"CambridgeMATHS GOLD NSW Year 7","years":[7],"pathsByYear":{"7":["Core","Advanced","Extension"]},"series":"CambridgeMATHS GOLD NSW"},{"id":"cam-025","title":"Cambridge Lower Secondary Mathematics Learner’s Book 8","years":[8],"pathsByYear":{"8":["Core"]},"series":"Lower Secondary"},{"id":"cam-026","title":"Cambridge Lower Secondary Mathematics Workbook 8","years":[8],"pathsByYear":{"8":["Core"]},"series":"Lower Secondary"},{"id":"cam-027","title":"Cambridge Checkpoint Mathematics 8","years":[8],"pathsByYear":{"8":["Core"]},"series":"Checkpoint"},{"id":"cam-028","title":"CambridgeMATHS NSW Year 8","years":[8],"pathsByYear":{"8":["Core","Advanced","Extension"]},"series":"CambridgeMATHS NSW"},{"id":"cam-029","title":"CambridgeMATHS GOLD NSW Year 8","years":[8],"pathsByYear":{"8":["Core","Advanced","Extension"]},"series":"CambridgeMATHS GOLD NSW"},{"id":"cam-030","title":"Cambridge Lower Secondary Mathematics Learner’s Book 9","years":[9],"pathsByYear":{"9":["Core"]},"series":"Lower Secondary"},{"id":"cam-031","title":"Cambridge Lower Secondary Mathematics Workbook 9","years":[9],"pathsByYear":{"9":["Core"]},"series":"Lower Secondary"},{"id":"cam-032","title":"Cambridge Checkpoint Mathematics 9","years":[9],"pathsByYear":{"9":["Core"]},"series":"Checkpoint"},{"id":"cam-033","title":"CambridgeMATHS NSW Year 9 5.1/5.2","years":[9],"pathsByYear":{"9":["Core","Advanced"]},"series":"CambridgeMATHS NSW"},{"id":"cam-034","title":"CambridgeMATHS NSW Stage 5 Year 9 — Core & Advanced/Extension Paths (Third Edition)","years":[9],"pathsByYear":{"9":["Core","Advanced","Extension"]},"series":"CambridgeMATHS NSW"},{"id":"cam-035","title":"CambridgeMATHS GOLD NSW Year 9","years":[9],"pathsByYear":{"9":["Core","Advanced","Extension"]},"series":"CambridgeMATHS GOLD NSW"},{"id":"cam-036","title":"CambridgeMATHS NSW Year 10 5.1/5.2","years":[10],"pathsByYear":{"10":["Core","Advanced"]},"series":"CambridgeMATHS NSW"},{"id":"cam-037","title":"CambridgeMATHS NSW Year 10 5.1/5.2/5.3","years":[10],"pathsByYear":{"10":["Core","Advanced","Extension"]},"series":"CambridgeMATHS NSW"},{"id":"cam-038","title":"CambridgeMATHS GOLD NSW Year 10","years":[10],"pathsByYear":{"10":["Core","Advanced","Extension"]},"series":"CambridgeMATHS GOLD NSW"},{"id":"cam-039","title":"Cambridge IGCSE Mathematics Core","years":[10,11],"pathsByYear":{"10":["Core"],"11":["Standard"]},"series":"Cambridge IGCSE"},{"id":"cam-040","title":"Cambridge IGCSE Mathematics Extended","years":[10,11],"pathsByYear":{"10":["Advanced","Extension"],"11":["Advanced","Extension"]},"series":"Cambridge IGCSE"},{"id":"cam-041","title":"Cambridge IGCSE International Mathematics","years":[10,11],"pathsByYear":{"10":["Advanced"],"11":["Advanced"]},"series":"Cambridge IGCSE"},{"id":"cam-042","title":"Cambridge IGCSE and O Level Additional Mathematics","years":[10,11],"pathsByYear":{"10":["Extension"],"11":["Extension"]},"series":"Cambridge IGCSE / O Level"},{"id":"cam-043","title":"CambridgeMATHS Stage 6 Mathematics Standard","years":[11],"pathsByYear":{"11":["Standard"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-044","title":"CambridgeMATHS Stage 6 Mathematics Advanced","years":[11],"pathsByYear":{"11":["Advanced"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-045","title":"CambridgeMATHS Stage 6 Mathematics Extension 1","years":[11],"pathsByYear":{"11":["Extension"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-046","title":"CambridgeMATHS Stage 6 Mathematics Standard 1","years":[12],"pathsByYear":{"12":["Standard"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-047","title":"CambridgeMATHS Stage 6 Mathematics Standard 2","years":[12],"pathsByYear":{"12":["Standard"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-048","title":"CambridgeMATHS Stage 6 Mathematics Advanced","years":[12],"pathsByYear":{"12":["Advanced"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-049","title":"CambridgeMATHS Stage 6 Mathematics Extension 1","years":[12],"pathsByYear":{"12":["Extension"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-050","title":"CambridgeMATHS Stage 6 Mathematics Extension 2","years":[12],"pathsByYear":{"12":["Extension"]},"series":"CambridgeMATHS Stage 6"},{"id":"cam-051","title":"Cambridge International AS & A Level Mathematics: Pure Mathematics 1","years":[11,12],"pathsByYear":{"11":["Advanced","Extension"],"12":["Advanced","Extension"]},"series":"International AS & A Level"},{"id":"cam-052","title":"Cambridge International AS & A Level Mathematics: Pure Mathematics 2 & 3","years":[11,12],"pathsByYear":{"11":["Advanced","Extension"],"12":["Advanced","Extension"]},"series":"International AS & A Level"},{"id":"cam-053","title":"Cambridge International AS & A Level Mathematics: Probability & Statistics 1","years":[11,12],"pathsByYear":{"11":["Advanced","Extension"],"12":["Advanced","Extension"]},"series":"International AS & A Level"},{"id":"cam-054","title":"Cambridge International AS & A Level Mathematics: Probability & Statistics 2","years":[11,12],"pathsByYear":{"11":["Advanced","Extension"],"12":["Advanced","Extension"]},"series":"International AS & A Level"},{"id":"cam-055","title":"Cambridge International AS & A Level Mathematics: Mechanics","years":[11,12],"pathsByYear":{"11":["Advanced","Extension"],"12":["Advanced","Extension"]},"series":"International AS & A Level"}]);
const CAMBRIDGE_YEAR9_CORE_ADVANCED_PDF=Object.freeze([{"number":1,"title":"Computation and financial maths","page":2,"sections":[{"code":"1A","title":"Computations with integers","page":4,"label":"CONSOLIDATING"},{"code":"1B","title":"Decimal places and significant figures","page":9,"label":"Core"},{"code":"1C","title":"Rational numbers","page":14,"label":"CONSOLIDATING"},{"code":"1D","title":"Computation with fractions","page":20,"label":"CONSOLIDATING"},{"code":"1E","title":"Ratios, rates and best buys","page":26,"label":"CONSOLIDATING"},{"code":"1F","title":"Percentages and money","page":32,"label":"CONSOLIDATING"},{"code":"1G","title":"Percentage increase and decrease","page":37,"label":"CONSOLIDATING"},{"code":"Progress quiz","title":"Progress quiz","page":42,"label":""},{"code":"1H","title":"Profits and discounts","page":43,"label":"CONSOLIDATING"},{"code":"1I","title":"Income","page":48,"label":"Core"},{"code":"1J","title":"The PAYG income tax system","page":56,"label":"Core"},{"code":"Applications","title":"Applications and problem-solving","page":63,"label":""},{"code":"1K","title":"Simple interest","page":65,"label":"Core"},{"code":"1L","title":"Compound interest and depreciation","page":70,"label":"Core"},{"code":"1M","title":"Using a formula for compound interest and depreciation","page":75,"label":"Core"},{"code":"Working mathematically","title":"Working mathematically","page":81,"label":""},{"code":"Investigation","title":"Investigation","page":82,"label":""},{"code":"Problems","title":"Problems and challenges","page":83,"label":""},{"code":"Summary","title":"Chapter summary","page":84,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":85,"label":""},{"code":"Review","title":"Chapter review","page":88,"label":""}]},{"number":2,"title":"Expressions, equations and inequalities","page":92,"sections":[{"code":"2A","title":"Algebraic expressions","page":94,"label":"CONSOLIDATING"},{"code":"2B","title":"Simplifying algebraic expressions","page":100,"label":"CONSOLIDATING"},{"code":"2C","title":"Expanding algebraic expressions","page":105,"label":"Core"},{"code":"2D","title":"Linear equations with pronumerals on one side","page":110,"label":"Core"},{"code":"2E","title":"Linear equations with brackets and pronumerals on both sides","page":115,"label":"Core"},{"code":"2F","title":"Solving word problems","page":119,"label":"Core"},{"code":"Progress quiz","title":"Progress quiz","page":124,"label":""},{"code":"2G","title":"Linear inequalities","page":125,"label":"Path"},{"code":"2H","title":"Using formulas","page":130,"label":"Core"},{"code":"2I","title":"Linear simultaneous equations: substitution","page":136,"label":"Path"},{"code":"Applications","title":"Applications and problem-solving","page":141,"label":""},{"code":"2J","title":"Linear simultaneous equations: elimination","page":143,"label":"Path"},{"code":"2K","title":"Using linear simultaneous equations to solve problems","page":149,"label":"Path"},{"code":"2L","title":"Quadratic equations of the form ax² = c","page":154,"label":"Path"},{"code":"Working mathematically","title":"Working mathematically","page":160,"label":""},{"code":"Investigation","title":"Investigation","page":161,"label":""},{"code":"Problems","title":"Problems and challenges","page":162,"label":""},{"code":"Summary","title":"Chapter summary","page":163,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":164,"label":""},{"code":"Review","title":"Chapter review","page":166,"label":""}]},{"number":3,"title":"Right-angled triangles: Pythagoras’ theorem and trigonometry","page":170,"sections":[{"code":"3A","title":"Pythagoras’ theorem","page":172,"label":"CONSOLIDATING"},{"code":"3B","title":"Finding the length of the shorter sides","page":179,"label":"CONSOLIDATING"},{"code":"3C","title":"Using Pythagoras’ theorem to solve two-dimensional problems","page":184,"label":"CONSOLIDATING"},{"code":"3D","title":"Using Pythagoras’ theorem to solve three-dimensional problems","page":189,"label":"Path"},{"code":"3E","title":"Introducing the trigonometric ratios","page":194,"label":"Core"},{"code":"3F","title":"Finding unknown side lengths","page":201,"label":"Core"},{"code":"Progress quiz","title":"Progress quiz","page":207,"label":""},{"code":"3G","title":"Solving for the denominator","page":208,"label":"Core"},{"code":"3H","title":"Finding unknown angles","page":213,"label":"Core"},{"code":"Applications","title":"Applications and problem-solving","page":218,"label":""},{"code":"3I","title":"Using trigonometry to solve problems","page":220,"label":"Core"},{"code":"3J","title":"Bearings","page":227,"label":"Core"},{"code":"Working mathematically","title":"Working mathematically","page":235,"label":""},{"code":"Investigation","title":"Investigation","page":236,"label":""},{"code":"Problems","title":"Problems and challenges","page":237,"label":""},{"code":"Summary","title":"Chapter summary","page":238,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":239,"label":""},{"code":"Review","title":"Chapter review","page":241,"label":""}]},{"number":4,"title":"Linear relationships","page":246,"sections":[{"code":"4A","title":"Introducing linear relationships","page":248,"label":"CONSOLIDATING"},{"code":"4B","title":"Graphing straight lines using intercepts","page":255,"label":"Path"},{"code":"4C","title":"Lines with one intercept","page":259,"label":"Core"},{"code":"4D","title":"Gradient","page":266,"label":"Core"},{"code":"4E","title":"Gradient and direct proportion","page":274,"label":"Path"},{"code":"4F","title":"Gradient–intercept form","page":279,"label":"Core"},{"code":"Progress quiz","title":"Progress quiz","page":285,"label":""},{"code":"4G","title":"Finding the equation of a line using y = mx + c","page":287,"label":"Core"},{"code":"4H","title":"Midpoint and length of a line segment from diagrams","page":292,"label":"Core"},{"code":"4I","title":"Perpendicular lines and parallel lines","page":297,"label":"Path"},{"code":"Applications","title":"Applications and problem-solving","page":301,"label":""},{"code":"4J","title":"Linear modelling","page":303,"label":"Core"},{"code":"4K","title":"Graphical solutions to simultaneous equations","page":308,"label":"Path"},{"code":"Working mathematically","title":"Working mathematically","page":314,"label":""},{"code":"Investigation","title":"Investigation","page":315,"label":""},{"code":"Problems","title":"Problems and challenges","page":317,"label":""},{"code":"Summary","title":"Chapter summary","page":318,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":319,"label":""},{"code":"Review","title":"Chapter review","page":321,"label":""}]},{"number":5,"title":"Length, area, surface area and volume","page":326,"sections":[{"code":"5A","title":"Length and perimeter","page":328,"label":"CONSOLIDATING"},{"code":"5B","title":"Circle circumference and perimeter of a sector","page":335,"label":"CONSOLIDATING"},{"code":"5C","title":"Area","page":341,"label":"CONSOLIDATING"},{"code":"5D","title":"Perimeter and area of composite shapes","page":350,"label":"Core"},{"code":"Progress quiz","title":"Progress quiz","page":357,"label":""},{"code":"5E","title":"Surface area of prisms and pyramids","page":358,"label":"Path"},{"code":"5F","title":"Surface area of cylinders","page":364,"label":"Core"},{"code":"Applications","title":"Applications and problem-solving","page":369,"label":""},{"code":"5G","title":"Volume of prisms","page":371,"label":"Core"},{"code":"5H","title":"Volume of cylinders","page":378,"label":"Core"},{"code":"Working mathematically","title":"Working mathematically","page":383,"label":""},{"code":"Investigation","title":"Investigation","page":384,"label":""},{"code":"Problems","title":"Problems and challenges","page":385,"label":""},{"code":"Summary","title":"Chapter summary","page":386,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":387,"label":""},{"code":"Review","title":"Chapter review","page":390,"label":""},{"code":"Semester review 1","title":"Semester review 1","page":394,"label":""}]},{"number":6,"title":"Indices and surds","page":402,"sections":[{"code":"6A","title":"Index notation","page":404,"label":"Core"},{"code":"6B","title":"Index laws for multiplying and dividing","page":410,"label":"Core"},{"code":"6C","title":"The zero index and power of a power","page":416,"label":"Core"},{"code":"6D","title":"Index laws extended","page":421,"label":"Path"},{"code":"6E","title":"Negative indices","page":426,"label":"Path"},{"code":"Progress quiz","title":"Progress quiz","page":431,"label":""},{"code":"6F","title":"Scientific notation","page":432,"label":"Core"},{"code":"6G","title":"Scientific notation using significant figures","page":437,"label":"Core"},{"code":"Applications","title":"Applications and problem-solving","page":442,"label":""},{"code":"6H","title":"Fractional indices and surds","page":444,"label":"Path"},{"code":"6I","title":"Simple operations with surds","page":450,"label":"Path"},{"code":"Working mathematically","title":"Working mathematically","page":454,"label":""},{"code":"Investigation","title":"Investigation","page":455,"label":""},{"code":"Problems","title":"Problems and challenges","page":456,"label":""},{"code":"Summary","title":"Chapter summary","page":457,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":458,"label":""},{"code":"Review","title":"Chapter review","page":460,"label":""}]},{"number":7,"title":"Properties of geometrical figures","page":464,"sections":[{"code":"7A","title":"Angles and triangles","page":466,"label":"CONSOLIDATING"},{"code":"7B","title":"Parallel lines","page":474,"label":"CONSOLIDATING"},{"code":"7C","title":"Quadrilaterals and other polygons","page":482,"label":"Path"},{"code":"7D","title":"Congruent triangles","page":489,"label":"Path"},{"code":"7E","title":"Using congruence in proof","page":497,"label":"Path"},{"code":"Progress quiz","title":"Progress quiz","page":502,"label":""},{"code":"7F","title":"Enlargement and similar figures","page":504,"label":"Core"},{"code":"Applications","title":"Applications and problem-solving","page":512,"label":""},{"code":"7G","title":"Similar triangles","page":514,"label":""},{"code":"7H","title":"Proving and applying similar triangles","page":522,"label":"Path"},{"code":"Working mathematically","title":"Working mathematically","page":528,"label":""},{"code":"Investigation","title":"Investigation","page":529,"label":""},{"code":"Problems","title":"Problems and challenges","page":530,"label":""},{"code":"Summary","title":"Chapter summary","page":531,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":532,"label":""},{"code":"Review","title":"Chapter review","page":535,"label":""}]},{"number":8,"title":"Quadratic expressions and algebraic techniques","page":540,"sections":[{"code":"8A","title":"Expanding binomial products","page":542,"label":"Path"},{"code":"8B","title":"Perfect squares and difference of two squares","page":547,"label":"Path"},{"code":"8C","title":"Factorising algebraic expressions","page":553,"label":"Path"},{"code":"8D","title":"Factorising the difference of two squares","page":559,"label":"Path"},{"code":"8E","title":"Factorising by grouping in pairs","page":564,"label":"Path"},{"code":"8F","title":"Factorising monic quadratic trinomials","page":568,"label":"Path"},{"code":"Progress quiz","title":"Progress quiz","page":573,"label":""},{"code":"8G","title":"Factorising non-monic quadratic trinomials","page":574,"label":"Path"},{"code":"8H","title":"Simplifying algebraic fractions: Multiplication and division","page":579,"label":"Path"},{"code":"8I","title":"Simplifying algebraic fractions: Addition and subtraction","page":584,"label":"Path"},{"code":"Applications","title":"Applications and problem-solving","page":589,"label":""},{"code":"8J","title":"Further addition and subtraction of algebraic fractions","page":591,"label":"Path"},{"code":"8K","title":"Equations involving algebraic fractions","page":596,"label":"Path"},{"code":"Working mathematically","title":"Working mathematically","page":602,"label":""},{"code":"Investigation","title":"Investigation","page":603,"label":""},{"code":"Problems","title":"Problems and challenges","page":604,"label":""},{"code":"Summary","title":"Chapter summary","page":605,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":606,"label":""},{"code":"Review","title":"Chapter review","page":607,"label":""}]},{"number":9,"title":"Probability and single variable data analysis","page":610,"sections":[{"code":"9A","title":"Review of probability","page":612,"label":"CONSOLIDATING"},{"code":"9B","title":"Venn diagrams and two-way tables","page":619,"label":"Path"},{"code":"9C","title":"Using set notation","page":626,"label":"Path"},{"code":"9D","title":"Using arrays for two-step experiments","page":632,"label":""},{"code":"9E","title":"Using tree diagrams","page":638,"label":"Core"},{"code":"9F","title":"Using relative frequencies to estimate probabilities","page":644,"label":"Core"},{"code":"Progress quiz","title":"Progress quiz","page":649,"label":""},{"code":"9G","title":"Data and sampling","page":650,"label":"Path"},{"code":"9H","title":"Mean, median and mode","page":656,"label":"CONSOLIDATING"},{"code":"9I","title":"Stem-and-leaf plots","page":662,"label":"CONSOLIDATING"},{"code":"Applications","title":"Applications and problem-solving","page":669,"label":""},{"code":"9J","title":"Grouping data into classes","page":672,"label":"EXTENDING"},{"code":"9K","title":"Measures of spread: range and interquartile range","page":679,"label":"Core"},{"code":"9L","title":"Box plots","page":685,"label":"Core"},{"code":"Working mathematically","title":"Working mathematically","page":692,"label":""},{"code":"Investigation","title":"Investigation","page":693,"label":""},{"code":"Problems","title":"Problems and challenges","page":694,"label":""},{"code":"Summary","title":"Chapter summary","page":695,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":696,"label":""},{"code":"Review","title":"Chapter review","page":699,"label":""}]},{"number":10,"title":"Quadratic equations and graphs of parabolas","page":704,"sections":[{"code":"10A","title":"Quadratic equations","page":706,"label":"Path"},{"code":"10B","title":"Solving ax² + bx = 0 and x² − d = 0 by factorising","page":711,"label":"Path"},{"code":"10C","title":"Solving x² + bx + c = 0 by factorising","page":715,"label":"Path"},{"code":"10D","title":"Using quadratic equations to solve problems","page":719,"label":"Path"},{"code":"Progress quiz","title":"Progress quiz","page":723,"label":""},{"code":"10E","title":"The parabola","page":724,"label":"Path"},{"code":"10F","title":"Sketching y = ax² with dilations and reflections","page":734,"label":"Path"},{"code":"Applications","title":"Applications and problem-solving","page":743,"label":""},{"code":"10G","title":"Sketching translations of y = x²","page":746,"label":"Path"},{"code":"10H","title":"Sketching parabolas using intercept form","page":755,"label":"Path"},{"code":"Working mathematically","title":"Working mathematically","page":763,"label":""},{"code":"Investigation","title":"Investigation","page":764,"label":""},{"code":"Problems","title":"Problems and challenges","page":765,"label":""},{"code":"Summary","title":"Chapter summary","page":766,"label":""},{"code":"Checklist","title":"Chapter checklist with success criteria","page":767,"label":""},{"code":"Review","title":"Chapter review","page":769,"label":""},{"code":"Semester review 2","title":"Semester review 2","page":773,"label":""}]}]);
const CAMBRIDGE_YEAR9_PDF_KEY='cambridge-nsw-stage5-year9-core-advanced-2024';
function licensedSlug(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function isExactCambridgeYear9Book(book){return Boolean(book?.licensedPdfKey===CAMBRIDGE_YEAR9_PDF_KEY);}
function makeExactCambridgeYear9Chapters(base,pathway){
  const allBase=(base?.chapters||[]).flatMap(ch=>ch.sections||[]);
  return Object.freeze(CAMBRIDGE_YEAR9_CORE_ADVANCED_PDF.map((row,chapterIndex)=>{
    const sourceChapter=base?.chapters?.[chapterIndex % Math.max(1,base?.chapters?.length||1)]||base?.chapters?.[0]||null;
    const sourceSections=sourceChapter?.sections?.length?sourceChapter.sections:allBase;
    const chapterId=`licensed-cam034-${licensedSlug(pathway)}-ch${row.number}`;
    const sections=Object.freeze(row.sections.map((item,sectionIndex)=>{
      const source=sourceSections?.[sectionIndex % Math.max(1,sourceSections?.length||1)]||allBase?.[sectionIndex % Math.max(1,allBase?.length||1)]||null;
      const ref=`${item.code} ${item.title} · p. ${item.page}`;
      return Object.freeze({
        id:`${chapterId}-${licensedSlug(item.code)}-${item.page}`,sectionNumber:item.code,title:item.title,shortTitle:item.title,chapterId,chapterTitle:row.title,yearLevel:9,pathway,bookPage:item.page,pdfPage:item.page+16,tocLabel:item.label||'',licensedPdf:true,reference:ref,
        taskId:source?.reviewTaskId||source?.checkpointTaskId||source?.challengeTaskId||'',checkpointTaskId:source?.checkpointTaskId||'',reviewTaskId:source?.reviewTaskId||source?.checkpointTaskId||'',challengeTaskId:source?.challengeTaskId||source?.reviewTaskId||source?.checkpointTaskId||''
      });
    }));
    return Object.freeze({id:chapterId,number:row.number,title:row.title,yearLevel:9,pathway,bookPage:row.page,pdfPage:row.page+16,sections,topicTestTaskId:sourceChapter?.topicTestTaskId||sections.find(s=>s.reviewTaskId)?.reviewTaskId||''});
  }));
}
function openLicensedPdfDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in globalThis))return reject(new Error('This browser cannot save a local textbook PDF.'));
    const request=indexedDB.open('mathsexpress-licensed-textbooks',1);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('pdfs'))db.createObjectStore('pdfs');};
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||new Error('Could not open textbook storage.'));
  });
}
async function saveLicensedPdf(key,file){
  if(!(file instanceof Blob))throw new Error('Choose a PDF file first.');
  if(file.type&&file.type!=='application/pdf')throw new Error('Please choose a PDF file.');
  const db=await openLicensedPdfDb();
  await new Promise((resolve,reject)=>{const tx=db.transaction('pdfs','readwrite');tx.objectStore('pdfs').put(file,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Could not save the PDF.'));});
  db.close();
}
async function getLicensedPdf(key){
  try{const db=await openLicensedPdfDb();const value=await new Promise((resolve,reject)=>{const tx=db.transaction('pdfs','readonly');const req=tx.objectStore('pdfs').get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});db.close();return value;}catch{return null;}
}
function openLicensedPdfLoadModal(key,page=1,label='CambridgeMATHS NSW Year 9'){
  const root=document.getElementById('modal-root');if(!root)return;
  root.innerHTML=`<div class="modal-backdrop"><div class="modal licensed-pdf-setup-modal pop"><div class="simple-modal-head"><div><span class="eyebrow">Licensed textbook</span><h2>Connect your exact PDF</h2></div><button class="modal-x" data-action="close-school-modal" aria-label="Close">×</button></div><p>Select the CambridgeMATHS NSW Year 9 PDF that you or your school is licensed to use. MathsExpress stores it only in this browser and does not include it in the public website ZIP.</p><label class="licensed-pdf-picker">Choose PDF<input type="file" accept="application/pdf,.pdf" data-action="licensed-pdf-file" data-pdf-key="${escapeHtml(key)}" data-pdf-page="${Number(page)||1}" data-pdf-label="${escapeHtml(label)}"></label><small class="muted">After you choose it once, chapter links open the exact pages from your copy on this device.</small></div></div>`;
}
async function openLicensedPdfPage(key,page=1,label='CambridgeMATHS NSW Year 9'){
  const blob=await getLicensedPdf(key);
  if(!blob){openLicensedPdfLoadModal(key,page,label);return;}
  const url=URL.createObjectURL(blob);
  const root=document.getElementById('modal-root');if(!root)return;
  const oldUrl=root.dataset.pdfObjectUrl||'';if(oldUrl)try{URL.revokeObjectURL(oldUrl);}catch{}
  root.innerHTML=`<div class="modal-backdrop licensed-pdf-backdrop"><div class="modal licensed-pdf-modal pop"><div class="simple-modal-head"><div><span class="eyebrow">Exact licensed PDF</span><h2>${escapeHtml(label)}</h2></div><button class="modal-x" data-action="close-school-modal" aria-label="Close">×</button></div><iframe title="${escapeHtml(label)}" src="${url}#page=${Math.max(1,Number(page)||1)}&zoom=page-width"></iframe><div class="licensed-pdf-footer"><span>Opening PDF page ${Math.max(1,Number(page)||1)}.</span><button class="btn ghost small" data-action="load-licensed-pdf" data-pdf-key="${escapeHtml(key)}" data-pdf-page="${Math.max(1,Number(page)||1)}" data-pdf-label="${escapeHtml(label)}">Choose a different PDF</button></div></div></div>`;
  root.dataset.pdfObjectUrl=url;
}

const TEXTBOOK_PUBLISHERS=Object.freeze(['Cambridge','Jacaranda']);
const TEXTBOOK_PATHWAY_ORDER=Object.freeze(['Core','Standard','Advanced','Extension']);

function cambridgePathsFor(entry,yearLevel){
  return Array.isArray(entry?.pathsByYear?.[String(Number(yearLevel))])?entry.pathsByYear[String(Number(yearLevel))]:[];
}
function cambridgeSelectionId(entry,yearLevel,pathway){
  const path=String(pathway||'Core').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  return `${entry.id}--y${Number(yearLevel)}--${path}`;
}
function parseCambridgeSelectionId(value){
  const raw=String(value||'');
  const match=raw.match(/^(cam-\d{3})--y(\d{1,2})--([a-z0-9-]+)$/i);
  if(!match)return null;
  const entry=CAMBRIDGE_BOOK_CATALOGUE.find(item=>item.id===match[1].toLowerCase());
  if(!entry)return null;
  const yearLevel=Number(match[2]);
  const pathway=cambridgePathsFor(entry,yearLevel).find(path=>path.toLowerCase().replace(/[^a-z0-9]+/g,'-')===match[3].toLowerCase());
  if(!pathway)return null;
  return {entry,yearLevel,pathway};
}
function baseTextbookBook(yearLevel,pathway){
  const books=getTextbookBooks({yearLevel:Number(yearLevel),pathway:String(pathway||'all')});
  return books[0]||null;
}
function makeCambridgeCatalogueBook(entry,yearLevel,pathway){
  const base=baseTextbookBook(yearLevel,pathway);
  if(!base)return null;
  const exactYear9=entry.id==='cam-034'&&Number(yearLevel)===9;
  return Object.freeze({
    ...base,
    id:cambridgeSelectionId(entry,yearLevel,pathway),
    legacyIds:[],
    catalogueId:entry.id,
    catalogueTitle:entry.title,
    catalogueSeries:entry.series,
    publisher:'Cambridge',
    baseBookId:base.id,
    yearLevel:Number(yearLevel),
    pathway:String(pathway),
    title:entry.title,
    subtitle:exactYear9?'Exact hardcopy contents · local licensed PDF viewer':`${entry.series} · ${pathway} linked practice`,
    contentSource:exactYear9?'Exact chapter/page map from the supplied 2024 hardcopy PDF; MathsExpress tasks remain generated practice.':'MathsExpress-generated linked practice and assessment',
    licensedPdfKey:exactYear9?CAMBRIDGE_YEAR9_PDF_KEY:'',
    licensedPdfTitle:exactYear9?'CambridgeMATHS NSW Stage 5 Year 9 — Core & Advanced/Extension Paths (Third Edition)':'',
    chapters:exactYear9?makeExactCambridgeYear9Chapters(base,pathway):base.chapters,
  });
}
function getPublisherTextbookBooks(publisher,yearLevel,pathway='all'){
  const pub=TEXTBOOK_PUBLISHERS.includes(publisher)?publisher:'Cambridge';
  const year=Number(yearLevel);
  if(pub==='Cambridge'){
    const rows=[];
    for(const entry of CAMBRIDGE_BOOK_CATALOGUE){
      if(!entry.years.includes(year))continue;
      const paths=cambridgePathsFor(entry,year);
      for(const path of paths){
        if(pathway!=='all'&&path!==pathway)continue;
        const book=makeCambridgeCatalogueBook(entry,year,path);
        if(book)rows.push(book);
      }
    }
    return rows;
  }
  return getTextbookBooks({yearLevel:year,pathway});
}
function textbookPathwaysForYear(yearLevel,publisher=textbookPublisher) {
  if(publisher==='Cambridge'){
    const paths=new Set();
    for(const entry of CAMBRIDGE_BOOK_CATALOGUE){
      if(entry.years.includes(Number(yearLevel)))cambridgePathsFor(entry,yearLevel).forEach(path=>paths.add(path));
    }
    return TEXTBOOK_PATHWAY_ORDER.filter(path=>paths.has(path));
  }
  return [...new Set(getTextbookBooks({ yearLevel }).map((book) => book.pathway))];
}

function textbookCompletion(section) {
  return Math.max(0, Math.min(100, Number(state.textbookProgress?.[section.id]) || 0));
}

function textbookProgressForBook(book) {
  const sections = book.chapters.flatMap((chapter) => chapter.sections);
  if (!sections.length) return 0;
  return Math.round(sections.reduce((sum, section) => sum + textbookCompletion(section), 0) / sections.length);
}

function parseTextbookFocus(value){
  const raw=String(value||'');
  const match=raw.match(/^(cambridge|jacaranda)::(.+)$/i);
  if(match)return {publisher:match[1].toLowerCase()==='jacaranda'?'Jacaranda':'Cambridge',bookId:match[2]};
  return {publisher:'Cambridge',bookId:raw};
}
function textbookFocusValue(book,publisher=textbookPublisher){return `${String(publisher||'Cambridge').toLowerCase()}::${book?.id||''}`;}
function textbookPublisherTitle(book,publisher=textbookPublisher){
  if(!book)return '';
  if(publisher==='Cambridge'&&book.catalogueTitle)return book.catalogueTitle;
  const year=book.yearLevel===0?'K':String(book.yearLevel);
  const suffix=book.yearLevel<=6?'':` – ${book.pathway}`;
  if(publisher==='Cambridge') return `Cambridge Maths NSW ${year}${suffix}`;
  return `Jacaranda Mathematics ${year}${suffix}`;
}
function textbookFocusOptionLabel(book,publisher=textbookPublisher){
  const title=textbookPublisherTitle(book,publisher);
  if(!book||Number(book.yearLevel)<=6)return title;
  const path=String(book.pathway||'');
  return path&&title.toLowerCase().includes(path.toLowerCase())?title:`${title} · ${path}`;
}
function textbookFocusDisplay(value){
  const parsed=parseTextbookFocus(value); const book=resolveTextbookBookFocus(value);
  return book?textbookFocusOptionLabel(book,parsed.publisher):(value?'Class choice':'Year-level default');
}
function textbookSyllabusNote(yearLevel,pathway='',publisher=textbookPublisher,book=null) {
  const year = Number(yearLevel); const path=String(pathway||'Core');
  const level=year===0?'Kindergarten':`Year ${year}`;
  const title=book?textbookPublisherTitle(book,publisher):publisher;
  return `${title} · ${level}${year<=6?'':` ${path}`}. MathsExpress creates linked practice and assessment tasks; publisher-authored pages and questions are only included when the school supplies licensed material.`;
}
function cambridgeCoverShortTitle(book){
  const title=String(book?.catalogueTitle||'Cambridge Mathematics');
  if(title.includes('Early Years'))return 'EARLY YEARS MATHEMATICS';
  if(title.includes('Primary Mathematics'))return 'PRIMARY MATHEMATICS';
  if(title.includes('Lower Secondary'))return 'LOWER SECONDARY';
  if(title.includes('Checkpoint'))return 'CHECKPOINT MATHEMATICS';
  if(title.includes('IGCSE and O Level'))return 'IGCSE & O LEVEL';
  if(title.includes('IGCSE'))return 'IGCSE MATHEMATICS';
  if(title.includes('Stage 6'))return 'CAMBRIDGEMATHS STAGE 6';
  if(title.includes('AS & A Level'))return 'AS & A LEVEL';
  if(title.includes('GOLD'))return 'CAMBRIDGEMATHS GOLD NSW';
  if(title.includes('CambridgeMATHS NSW'))return 'CAMBRIDGEMATHS NSW';
  return 'CAMBRIDGE MATHEMATICS';
}
function textbookCoverMarkup(book,publisher=textbookPublisher){
  if(!book)return '';
  const year=book.yearLevel===0?'K':String(book.yearLevel);
  const path=escapeHtml(book.pathway||'Core');
  const exact=String(book.catalogueTitle||'');
  if(publisher==='Cambridge' && book.catalogueId==='cam-034'){
    return `<div class="mx-textbook-cover mx-textbook-cover-photo"><img src="assets/cambridge-maths-nsw-9.png" alt="CambridgeMATHS NSW Stage 5 Year 9 Core and Advanced/Extension Paths cover"><span class="mx-cover-path-chip">${path}</span></div>`;
  }
  if(publisher==='Cambridge'){
    return `<div class="mx-textbook-cover mx-cambridge-cover ${escapeHtml(textbookCoverClass(book))}"><small>CAMBRIDGE</small><div class="mx-cover-pattern"></div><b class="mx-cover-title">${escapeHtml(cambridgeCoverShortTitle(book))}</b><strong>${escapeHtml(year)}</strong><span>${path}</span></div>`;
  }
  return `<div class="mx-textbook-cover publisher-jacaranda ${escapeHtml(textbookCoverClass(book))}"><small>JACARANDA</small><b>MATHEMATICS</b><strong>${escapeHtml(year)}</strong><span>${path}</span></div>`;
}
function textbookAssignmentLabel(book,chapter,detail='Practice'){
  const title=textbookPublisherTitle(book,textbookPublisher);
  return `${title}${chapter?` · Ch ${chapter.number} ${chapter.title}`:''} · ${detail}`.slice(0,190);
}
function openTextbookAssignMenu(bookId){
  if(!canUseTeacherHub(account))return showToast('Teacher access required','Only teachers can assign textbook work.');
  const focus=`${String(textbookPublisher||'Cambridge').toLowerCase()}::${String(bookId||'')}`;
  const book=resolveTextbookBookFocus(focus)||resolveTextbookBookFocus(bookId);
  if(!book)return showToast('Book unavailable','Choose a textbook first.');
  const rows=isExactCambridgeYear9Book(book)?book.chapters.map(ch=>{
    const first=ch.sections?.find(sec=>sec.taskId)||ch.sections?.[0];
    const practiceId=first?.reviewTaskId||first?.checkpointTaskId||first?.taskId||'';
    const testId=ch.topicTestTaskId||'';
    const sectionRows=(ch.sections||[]).map(sec=>{const taskId=sec.reviewTaskId||sec.checkpointTaskId||sec.taskId||'';return `<div class="licensed-assign-section"><span><b>${escapeHtml(sec.sectionNumber)}</b> ${escapeHtml(sec.title)} <small>p. ${sec.bookPage}${sec.tocLabel?` · ${escapeHtml(sec.tocLabel)}`:''}</small></span>${taskId?`<button class="btn ghost small" data-action="assign-textbook-task" data-task-id="${escapeHtml(taskId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,ch,`${sec.sectionNumber} ${sec.title} · p. ${sec.bookPage}`))}">Assign</button>`:''}</div>`}).join('');
    return `<details class="textbook-assign-row licensed-assign-chapter"><summary><div><strong>Chapter ${ch.number}: ${escapeHtml(ch.title)}</strong><small>Starts p. ${ch.bookPage} · exact hardcopy contents</small></div><div>${practiceId?`<button type="button" class="btn secondary small" data-action="assign-textbook-task" data-task-id="${escapeHtml(practiceId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,ch,`Chapter practice · p. ${ch.bookPage}`))}">Assign practice</button>`:''}${testId?`<button type="button" class="btn primary small" data-action="assign-textbook-task" data-task-id="${escapeHtml(testId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,ch,`Chapter review/test · p. ${ch.bookPage}`))}">Assign test</button>`:''}</div></summary><div class="licensed-assign-sections">${sectionRows}</div></details>`;
  }).join(''):book.chapters.map(ch=>{
    const first=ch.sections?.[0];
    const practiceId=first?.reviewTaskId||first?.checkpointTaskId||'';
    const testId=ch.topicTestTaskId||'';
    return `<article class="textbook-assign-row"><div><strong>Chapter ${ch.number}: ${escapeHtml(ch.title)}</strong><small>${ch.sections.length} lessons · ${escapeHtml(book.pathway)} pathway</small></div><div>${practiceId?`<button class="btn secondary small" data-action="assign-textbook-task" data-task-id="${escapeHtml(practiceId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,ch,'Chapter practice'))}">Assign practice</button>`:''}${testId?`<button class="btn primary small" data-action="assign-textbook-task" data-task-id="${escapeHtml(testId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,ch,'Topic test'))}">Assign test</button>`:''}</div></article>`;
  }).join('');
  openSimpleModal(`Assign from ${textbookPublisherTitle(book,textbookPublisher)}`,`<p class="muted">${isExactCambridgeYear9Book(book)?'Choose the exact hardcopy chapter or section. MathsExpress will create linked practice while keeping the real Cambridge page reference on the assignment.':'Choose a chapter task. It will open Quick Assign so you can choose the class, due date and normal assignment controls.'}</p><div class="textbook-assign-list">${rows}</div><p class="muted">MathsExpress-generated practice is linked to the exact book reference. The publisher PDF itself stays in the school/user browser when loaded locally.</p>`);
}
function resolveTextbookBookFocus(value){
  const parsed=parseTextbookFocus(value);
  const focus=parsed.bookId;
  if(!focus)return null;
  if(parsed.publisher==='Cambridge'){
    const selection=parseCambridgeSelectionId(focus);
    if(selection)return makeCambridgeCatalogueBook(selection.entry,selection.yearLevel,selection.pathway);
  }
  return TEXTBOOK_BOOKS.find(book=>book.id===focus||(book.legacyIds||[]).includes(focus))||null;
}
function textbookCoverClass(book){return `path-${String(book?.pathway||'core').toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;}
function textbookBookOptionsHtml(books,publisher,selectedId){
  if(publisher!=='Cambridge')return books.map(candidate=>`<option value="${escapeHtml(candidate.id)}" ${candidate.id===selectedId?'selected':''}>${escapeHtml(textbookPublisherTitle(candidate,publisher))}</option>`).join('');
  const groups=new Map();
  for(const book of books){
    const key=book.catalogueSeries||'Cambridge';
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(book);
  }
  return [...groups.entries()].map(([series,rows])=>`<optgroup label="${escapeHtml(series)}">${rows.map(candidate=>`<option value="${escapeHtml(candidate.id)}" ${candidate.id===selectedId?'selected':''}>${escapeHtml(textbookPublisherTitle(candidate,publisher))}</option>`).join('')}</optgroup>`).join('');
}

function renderTextbook() {
  const root=document.getElementById('app-view'); if(!root)return;
  const profileYear=normaliseYearLevel(account.profile?.yearLevel);
  const canBrowseAllYears=canUseTeacherHub(account);
  if(!canBrowseAllYears) textbookYearLevel=profileYear;
  else if(!Number.isFinite(textbookYearLevel)||textbookYearLevel<0||textbookYearLevel>12) textbookYearLevel=profileYear;
  const classFocusRaw=parseTextbookFocus(account.profile?.textbookFocus);
  const classFocus=resolveTextbookBookFocus(account.profile?.textbookFocus);
  if(!textbookBookId&&classFocus&&classFocus.yearLevel===textbookYearLevel){textbookPublisher=classFocusRaw.publisher;textbookPathway=classFocus.pathway;textbookBookId=classFocus.id;}
  if(!TEXTBOOK_PUBLISHERS.includes(textbookPublisher))textbookPublisher='Cambridge';
  const pathways=textbookPathwaysForYear(textbookYearLevel,textbookPublisher);
  if(textbookPathway!=='all'&&!pathways.includes(textbookPathway)) textbookPathway='all';
  if(textbookPathway==='all') textbookPathway=pathways.includes('Core')?'Core':(pathways.includes('Standard')?'Standard':(pathways[0]||'all'));
  const books=getPublisherTextbookBooks(textbookPublisher,textbookYearLevel,textbookPathway==='all'?'all':textbookPathway);
  let book=books.find(candidate=>candidate.id===textbookBookId||(candidate.legacyIds||[]).includes(textbookBookId))||books[0]||null;
  if(book)textbookBookId=book.id;
  const searchResults=textbookQuery?(isExactCambridgeYear9Book(book)?book.chapters.flatMap(ch=>ch.sections).filter(sec=>`${sec.sectionNumber} ${sec.title} ${sec.tocLabel} ${sec.chapterTitle}`.toLowerCase().includes(textbookQuery.toLowerCase())).slice(0,60):searchTextbookSeries(textbookQuery,{yearLevel:textbookYearLevel,pathway:textbookPathway==='all'?'all':textbookPathway,limit:60})):[];
  const progress=book?textbookProgressForBook(book):0;

  const toc=book?book.chapters.map(ch=>{
    const open=textbookExpandedChapters.has(ch.id); const testId=ch.topicTestTaskId||'';
    const rows=isExactCambridgeYear9Book(book)?ch.sections.map(sec=>`<button class="licensed-toc-row" data-action="open-licensed-textbook-page" data-pdf-key="${escapeHtml(book.licensedPdfKey)}" data-pdf-page="${sec.pdfPage}" data-book-page="${sec.bookPage}" data-pdf-label="${escapeHtml(`${sec.sectionNumber} ${sec.title}`)}"><span>${escapeHtml(sec.sectionNumber||'')}</span><b>${escapeHtml(sec.title)}</b><small>p. ${sec.bookPage}${sec.tocLabel?` · ${escapeHtml(sec.tocLabel)}`:''}</small></button>`).join(''):ch.sections.map(sec=>`<button data-action="open-textbook-section" data-section-id="${escapeHtml(sec.id)}"><span>${escapeHtml(sec.sectionNumber||'')}</span><b>${escapeHtml(sec.title)}</b></button>`).join('');
    return `<div class="mx-textbook-topic ${open?'open':''}"><button class="mx-textbook-topic-toggle" data-action="textbook-toggle-chapter" data-chapter-id="${escapeHtml(ch.id)}"><span>${open?'⌄':'›'}</span><strong>${ch.number}. ${escapeHtml(ch.title)}</strong><small>${isExactCambridgeYear9Book(book)?`p. ${ch.bookPage}`:ch.sections.length}</small></button>${open?`<div class="mx-textbook-topic-lessons">${rows}${testId?`<div class="mx-topic-test-row"><button class="mx-topic-test" data-action="start-library-task" data-task-id="${escapeHtml(testId)}"><span>TEST</span><b>${isExactCambridgeYear9Book(book)?`MathsExpress practice for Chapter ${ch.number}`:`Chapter ${ch.number} topic test`}</b></button>${canUseTeacherHub(account)?`<button class="mx-topic-assign" data-action="assign-textbook-task" data-task-id="${escapeHtml(testId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,ch,isExactCambridgeYear9Book(book)?`Chapter practice · hardcopy p. ${ch.bookPage}`:'Topic test'))}">Assign</button>`:''}</div>`:''}</div>`:''}</div>`;
  }).join(''):'';
  const coverYear=textbookYearLevel===0?'K':String(textbookYearLevel);
  const displayTitle=book?textbookPublisherTitle(book,textbookPublisher):'';
  root.innerHTML=`<section class="page mx-textbook-browser">
    <aside class="mx-textbook-sidebar">
      <div class="mx-textbook-catalog-title"><span class="eyebrow">Textbook library</span><strong>K–12 catalogue</strong><small>55 Cambridge titles &amp; Jacaranda</small></div>
      <div class="mx-textbook-search"><form id="textbook-search-form"><input name="query" value="${escapeHtml(textbookQuery)}" placeholder="Search textbook" aria-label="Search textbook"><button type="submit">⌕</button></form></div>
      <div class="mx-textbook-selector-stack">
        <div><span>Publisher</span><div class="mx-textbook-publishers">${TEXTBOOK_PUBLISHERS.map(pub=>`<button class="${pub===textbookPublisher?'active':''} publisher-${pub.toLowerCase()}" data-action="textbook-publisher" data-publisher="${escapeHtml(pub)}">${escapeHtml(pub)}</button>`).join('')}</div></div>
        ${canBrowseAllYears?`<label>Year<select data-action="textbook-year-select">${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<option value="${value}" ${value===textbookYearLevel?'selected':''}>${escapeHtml(label)}</option>`).join('')}</select></label>`:`<div class="mx-textbook-year-fixed"><span>Year</span><strong>${escapeHtml(yearLabel(textbookYearLevel))}</strong><small>Set in Settings</small></div>`}
        <div><span>Pathway</span><div class="mx-textbook-course">${pathways.map(path=>`<button class="${path===textbookPathway?'active':''}" data-action="textbook-pathway" data-pathway="${escapeHtml(path)}">${escapeHtml(path)}</button>`).join('')}</div></div>
        <label>Book<select data-action="textbook-book-select">${textbookBookOptionsHtml(books,textbookPublisher,book?.id||'')}</select></label>
      </div>
      ${book?`<div class="mx-textbook-book-card">${textbookCoverMarkup(book,textbookPublisher)}<div><strong>${escapeHtml(displayTitle)}</strong><small>${progress}% complete</small><em>${isExactCambridgeYear9Book(book)?'Exact hardcopy contents mapped from your supplied PDF':`${escapeHtml(textbookPublisher)} textbook`}</em>${isExactCambridgeYear9Book(book)?`<div class="licensed-book-actions"><button class="btn secondary small" data-action="open-licensed-textbook-page" data-pdf-key="${escapeHtml(book.licensedPdfKey)}" data-pdf-page="1" data-pdf-label="${escapeHtml(displayTitle)}">Open exact PDF</button><button class="btn ghost small" data-action="load-licensed-pdf" data-pdf-key="${escapeHtml(book.licensedPdfKey)}" data-pdf-page="1" data-pdf-label="${escapeHtml(displayTitle)}">Connect PDF</button></div>`:''}${canUseTeacherHub(account)?`<button class="btn primary small mx-textbook-assign-book" data-action="textbook-assign-menu" data-book-id="${escapeHtml(book.id)}">Assign from textbook</button>`:''}</div></div><nav class="mx-textbook-toc">${toc}</nav>`:'<div class="school-empty">No textbook is available for this year yet.</div>'}
    </aside>
    <main class="mx-textbook-main">
      ${textbookQuery?`<div class="mx-textbook-main-head"><div><span class="eyebrow">Search</span><h1>${searchResults.length} result${searchResults.length===1?'':'s'}</h1></div><button class="btn ghost" data-action="clear-textbook-search">Clear</button></div><div class="mx-textbook-search-list">${searchResults.map(sec=>isExactCambridgeYear9Book(book)?`<button data-action="open-licensed-textbook-page" data-pdf-key="${escapeHtml(book.licensedPdfKey)}" data-pdf-page="${sec.pdfPage}" data-pdf-label="${escapeHtml(`${sec.sectionNumber} ${sec.title}`)}"><span>${escapeHtml(sec.sectionNumber)}</span><div><strong>${escapeHtml(sec.title)}</strong><small>${escapeHtml(sec.chapterTitle)} · hardcopy p. ${sec.bookPage}${sec.tocLabel?` · ${escapeHtml(sec.tocLabel)}`:''}</small></div><b>→</b></button>`:`<button data-action="open-textbook-section" data-section-id="${escapeHtml(sec.id)}"><span>${escapeHtml(sec.sectionNumber)}</span><div><strong>${escapeHtml(sec.title)}</strong><small>${escapeHtml(sec.chapterTitle)} · ${escapeHtml(sec.pathway)} · ${escapeHtml(textbookPublisher)}</small></div><b>→</b></button>`).join('')||'<div class="school-empty">No matching textbook sections.</div>'}</div>`:`<div class="mx-textbook-empty"><div class="mx-textbook-illustration">▤</div><span class="mx-original-content-badge">${escapeHtml(textbookPublisher)} textbook</span><h1>Select a chapter to start exploring</h1><p>${isExactCambridgeYear9Book(book)?'This book now follows the exact hardcopy chapter names, section order and printed page numbers from your supplied PDF. Open any row to jump to that page in your local licensed copy.':'Choose Publisher → Year → Pathway → Book → Chapter. Teachers can assign chapter practice, exercises, checkpoints, reviews, challenges and topic tests directly from the textbook area.'}</p>${book?`<div class="mx-textbook-welcome"><strong>${escapeHtml(displayTitle)}</strong><span>${escapeHtml(textbookSyllabusNote(textbookYearLevel,textbookPathway,textbookPublisher,book))}</span><small>${book.chapters.length} chapters · ${book.chapters.reduce((n,c)=>n+c.sections.length,0)} ${isExactCambridgeYear9Book(book)?'hardcopy contents entries':'lessons'} · ${isExactCambridgeYear9Book(book)?'2024 third edition':'linked topic tests'}</small></div>`:''}</div>`}
    </main>
  </section>`;
  const select=root.querySelector('[data-action="textbook-year-select"]'); if(select) select.addEventListener('change',()=>{if(!canUseTeacherHub(account))return;textbookYearLevel=Number(select.value);textbookPathway='all';textbookBookId='';textbookQuery='';textbookExpandedChapters=new Set();renderTextbook();});
  const bookSelect=root.querySelector('[data-action="textbook-book-select"]'); if(bookSelect) bookSelect.addEventListener('change',()=>{textbookBookId=String(bookSelect.value||'');const selected=resolveTextbookBookFocus(textbookBookId);if(selected)textbookPathway=selected.pathway;textbookQuery='';textbookExpandedChapters=new Set();renderTextbook();});
}

function renderTextbookLesson() {
  const root = document.getElementById('app-view');
  if (!root) return;
  const sectionId = routeFromHash().param || state.textbookLastSection || '';
  const section = getTextbookSection(sectionId);
  if (!section) return go('textbook');
  if(!canUseTeacherHub(account)&&Number(section.yearLevel)!==normaliseYearLevel(account.profile?.yearLevel))return go('textbook');
  const activeFocus=textbookBookId?resolveTextbookBookFocus(`${String(textbookPublisher||'Cambridge').toLowerCase()}::${textbookBookId}`):null;
  const book = activeFocus?.chapters?.some((chapter)=>chapter.id===section.chapterId)?activeFocus:TEXTBOOK_BOOKS.find((candidate)=>candidate.chapters.some((chapter)=>chapter.id===section.chapterId));
  const chapter = book?.chapters.find((candidate)=>candidate.id===section.chapterId);
  const allSections = book?.chapters.flatMap((item)=>item.sections) || TEXTBOOK_SECTIONS;
  const sectionIndex = allSections.findIndex((item)=>item.id===section.id);
  const previous = sectionIndex>0?allSections[sectionIndex-1]:null;
  const next = sectionIndex>=0&&sectionIndex<allSections.length-1?allSections[sectionIndex+1]:null;
  const bookmarked = (state.textbookBookmarks||[]).includes(section.id);
  const progress = textbookCompletion(section);
  if (state.textbookLastSection !== section.id) persist({...state,textbookLastSection:section.id},{quiet:true});
  startTextbookReadTracking(section.id);
  setTimeout(updateTextbookScrollDepth,0);
  root.innerHTML = `
    <section class="page textbook-reader-page ${Number(section.yearLevel)<4?'mx-junior-reader':''}">
      <div class="textbook-reader-top">
        <button class="back-link" data-route="textbook">← Textbook contents</button>
        <div class="reader-top-actions">
          <button class="btn ghost small" data-action="read-textbook-section" data-section-id="${escapeHtml(section.id)}">🔊 Read aloud</button>
          <button class="btn ghost small ${bookmarked?'active':''}" data-action="bookmark-textbook-section" data-section-id="${escapeHtml(section.id)}">${bookmarked?'★ Bookmarked':'☆ Bookmark'}</button>
          ${canUseTeacherHub(account)?`<button class="btn ghost small" data-action="textbook-teacher-resources" data-section-id="${escapeHtml(section.id)}">Teacher resources</button><button class="btn primary small" data-action="assign-textbook-task" data-task-id="${escapeHtml(section.reviewTaskId||section.checkpointTaskId||'')}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,chapter,section.shortTitle+' practice'))}">Assign this section</button>`:''}
          <button class="btn ${progress>=100?'secondary':'primary'} small" data-action="complete-textbook-section" data-section-id="${escapeHtml(section.id)}">${progress>=100?'✓ Completed':'Mark complete'}</button>
        </div>
      </div>
      <div class="textbook-reader-layout">
        <aside class="textbook-reader-toc">
          <div><span class="eyebrow">${escapeHtml(book?textbookPublisherTitle(book,textbookPublisher):`Year ${section.yearLevel}`)}</span><h3>Chapter ${chapter?.number||''}: ${escapeHtml(chapter?.title||section.chapterTitle)}</h3></div>
          <div class="reader-toc-list">${(chapter?.sections||[]).map((item)=>`<button class="${item.id===section.id?'active':''} ${textbookCompletion(item)>=100?'complete':''}" data-action="open-textbook-section" data-section-id="${escapeHtml(item.id)}"><span>${escapeHtml(item.sectionNumber)}</span><div><strong>${escapeHtml(item.shortTitle)}</strong><small>${escapeHtml(item.stageLabel)}</small></div></button>`).join('')}</div>
        </aside>
        <main class="textbook-reader-main">${Number(section.yearLevel)<4?juniorLessonHtml(section):''}
          <header class="textbook-lesson-head"><span class="mx-original-content-badge">${escapeHtml(textbookPublisher)} textbook</span><span class="eyebrow">Section ${escapeHtml(section.sectionNumber)} · ${escapeHtml(section.pathway)}</span><h1>${escapeHtml(section.title)}</h1><p>${escapeHtml(section.learningGoal)}</p><div class="lesson-progress-line"><i style="width:${progress}%"></i></div></header>

          <section class="textbook-content-block intentions-block"><h2>Learning intentions</h2><ul>${section.learningIntentions.map((item)=>`<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="prerequisite-strip"><strong>Before you start</strong><span>${section.prerequisites.map(escapeHtml).join(' · ')}</span></div></section>

          ${(()=>{const engage=textbookEngageActivity(section);return `<section class="textbook-content-block textbook-engage-block"><span class="block-kicker">Engage activity</span><h2>${escapeHtml(engage.title)}</h2><p>${escapeHtml(engage.prompt)}</p><div class="engage-prompts"><div><strong>Discuss</strong><span>${escapeHtml(engage.discussion)}</span></div><div><strong>Extend</strong><span>${escapeHtml(engage.extension)}</span></div></div></section>`})()}

          <section class="textbook-content-block"><h2>Key vocabulary</h2><div class="textbook-vocab">${section.vocabulary.map((word)=>`<span>${escapeHtml(word)}</span>`).join('')}</div></section>

          <section class="textbook-content-block concept-block"><span class="block-kicker">Concept</span><h2>Understanding ${escapeHtml(section.shortTitle)}</h2>${section.explanation.map((paragraph)=>`<p>${escapeHtml(paragraph)}</p>`).join('')}<div class="key-rule"><strong>Key rule</strong><p>${escapeHtml(section.keyRule)}</p></div></section>

          ${Number(section.yearLevel)>=4?`<section class="textbook-content-block textbook-deep-dive"><span class="block-kicker">Deep dive</span><h2>Build the idea, not just the answer</h2><div class="textbook-deep-dive-grid"><article><strong>Why this works</strong><p>${escapeHtml(section.keyRule)} The aim is to connect each step to the mathematical relationship in the question, rather than memorising an isolated procedure.</p></article><article><strong>How to reason</strong><p>Identify what is known, what must be found, and which relationship connects them. Write one clear mathematical step at a time and keep equivalent expressions or equations balanced.</p></article><article><strong>How to check</strong><p>Substitute, estimate, reverse the operation, compare with the original condition, or use a second representation where possible. A sensible answer should satisfy the question as well as the calculation.</p></article><article><strong>Make connections</strong><p>Link this section to ${escapeHtml((section.prerequisites||[]).slice(0,2).join(' and ')||'earlier number and algebra skills')}. Look for the same structure when the numbers, notation or context change.</p></article></div></section>`:''}

          ${Number(section.yearLevel)>=4?`<section class="textbook-content-block textbook-practice-plan"><span class="block-kicker">Study guide</span><h2>A full learning sequence</h2><div class="textbook-practice-plan-grid"><div><span>1</span><strong>Recall</strong><p>Explain these words in your own language: ${section.vocabulary.slice(0,4).map(escapeHtml).join(', ')}.</p></div><div><span>2</span><strong>Model</strong><p>Read the first worked example and explain why each line follows from the previous line.</p></div><div><span>3</span><strong>Practise</strong><p>Complete a short exercise without looking at the worked solution. Mark any step where you were unsure.</p></div><div><span>4</span><strong>Reason</strong><p>Change one feature of a question and predict how the method or result changes before calculating.</p></div><div><span>5</span><strong>Check</strong><p>Use the checkpoint to decide whether you are ready to move on or should return to a specific example.</p></div><div><span>6</span><strong>Extend</strong><p>Create your own question that uses the same key idea in a different representation or real-world setting.</p></div></div><div class="textbook-exam-tip"><strong>Exam strategy</strong><p>Read the command word first, show enough working for the marks available, keep notation clear, and finish by checking that your final response answers exactly what was asked.</p></div></section>`:''}

          <section class="textbook-content-block"><span class="block-kicker">Worked examples</span><h2>See the method</h2><div class="worked-example-stack">${section.workedExamples.map((example,index)=>`<article class="worked-example"><header><span>${index+1}</span><div><strong>${escapeHtml(example.label)}</strong><small>${escapeHtml(example.difficulty)}</small></div></header><p class="example-question">${mathHtml(example.prompt)}</p><details ${index===0?'open':''}><summary>Show worked solution</summary><p>${mathHtml(example.solution)}</p><small>Hint: ${mathHtml(example.hint)}</small><div class="worked-example-actions"><button class="btn ghost small" data-action="textbook-try-similar" data-task-id="${escapeHtml(section.checkpointTaskId||section.reviewTaskId||'')}">Try a similar problem</button></div></details></article>`).join('')}</div></section>

          <section class="textbook-content-block textbook-interactive"><span class="block-kicker">Interactive activity</span><h2>Explore the maths</h2><p>Use a live maths tool, then return to the worked examples and explain what changed.</p><div class="checkpoint-actions"><button class="btn secondary" data-action="open-scientific-calculator">Scientific calculator</button><button class="btn secondary" data-action="open-graphing-calculator">Graph explorer</button><button class="btn secondary" data-action="open-probability-sim">Probability simulator</button><button class="btn ghost" data-action="textbook-view-resources" data-section-id="${escapeHtml(section.id)}">Section resources</button></div></section>

          <section class="textbook-content-block common-mistakes"><span class="block-kicker">Watch out</span><h2>Common mistakes</h2><div>${section.commonMistakes.map((mistake)=>`<p><b>!</b>${escapeHtml(mistake)}</p>`).join('')}</div></section>

          <section class="textbook-content-block exercises-block"><span class="block-kicker">Practice</span><h2>Graded exercises</h2><p>Start where you are comfortable, then move upward. Each set opens as a fully markable MathsExpress task.</p><div class="exercise-band-grid">${section.exercises.map((exercise)=>`<article class="exercise-band ${exercise.id}"><div class="exercise-band-head"><span>${escapeHtml(exercise.title)}</span><b>${exercise.count} questions</b></div><p>~${exercise.estimatedMinutes} min · ${escapeHtml(exercise.difficulty)} difficulty</p><ol>${exercise.sampleQuestions.map((q)=>`<li>${mathHtml(q.prompt)}</li>`).join('')}</ol><div class="exercise-actions"><button class="btn primary small" data-action="start-library-task" data-task-id="${escapeHtml(exercise.taskId)}">Start exercise</button>${canUseTeacherHub(account)?`<button class="btn ghost small" data-action="assign-textbook-task" data-task-id="${escapeHtml(exercise.taskId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,chapter,`${section.shortTitle} · ${exercise.title}`))}">Assign</button>`:''}</div></article>`).join('')}</div></section>

          <section class="textbook-content-block checkpoint-block"><div><span class="block-kicker">Check your understanding</span><h2>Checkpoint, review & challenge</h2><p>Use the checkpoint to test this skill, the review for consolidation, or the challenge for unfamiliar reasoning.</p></div><div class="checkpoint-actions"><button class="btn secondary" data-action="start-library-task" data-task-id="${escapeHtml(section.checkpointTaskId)}">10-question checkpoint</button><button class="btn secondary" data-action="start-library-task" data-task-id="${escapeHtml(section.reviewTaskId)}">20-question review</button><button class="btn primary" data-action="start-library-task" data-task-id="${escapeHtml(section.challengeTaskId)}">Challenge</button></div>${canUseTeacherHub(account)?`<div class="checkpoint-assign-actions"><button class="btn ghost small" data-action="assign-textbook-task" data-task-id="${escapeHtml(section.checkpointTaskId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,chapter,section.shortTitle+' checkpoint'))}">Assign checkpoint</button><button class="btn ghost small" data-action="assign-textbook-task" data-task-id="${escapeHtml(section.reviewTaskId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,chapter,section.shortTitle+' review'))}">Assign review</button><button class="btn ghost small" data-action="assign-textbook-task" data-task-id="${escapeHtml(section.challengeTaskId)}" data-assignment-title="${escapeHtml(textbookAssignmentLabel(book,chapter,section.shortTitle+' challenge'))}">Assign challenge</button></div>`:''}</section>

          <section class="textbook-content-block notes-block"><span class="block-kicker">My notes</span><h2>Write your own summary</h2><form id="textbook-note-form"><input type="hidden" name="sectionId" value="${escapeHtml(section.id)}"><textarea name="note" rows="5" placeholder="Write formulas, reminders, mistakes to avoid, or your own example…">${escapeHtml(state.textbookNotes?.[section.id]||'')}</textarea><button class="btn secondary small" type="submit">Save notes</button></form></section>

          <nav class="textbook-reader-nav">${previous?`<button class="btn ghost" data-action="open-textbook-section" data-section-id="${escapeHtml(previous.id)}">← ${escapeHtml(previous.shortTitle)}</button>`:'<span></span>'}${next?`<button class="btn primary" data-action="open-textbook-section" data-section-id="${escapeHtml(next.id)}">${escapeHtml(next.shortTitle)} →</button>`:'<button class="btn secondary" data-route="textbook">Back to contents</button>'}</nav>
        </main>
      </div>
    </section>`;
}


function stopClassHubLiveRefresh(){
  if(classHubLiveTimer){clearInterval(classHubLiveTimer);classHubLiveTimer=null;}
}
function classHubGameListHtml(rows=[]){
  if(!rows.length) return '<div class="class-hub-empty">No live class game right now.</div>';
  return rows.map(session=>{const mode=classGameMode(session.mode);return `<button class="class-live-game-card" data-action="join-class-game" data-session-id="${escapeHtml(session.id)}"><span class="live-dot"></span><div><strong>${escapeHtml(mode.name)}</strong><small>Teacher game is live · Join now</small></div><b>Join →</b></button>`}).join('');
}
function classHubAnnouncementHtml(rows=[]){
  const announcements=rows.filter(x=>x.content_type==='announcement').slice(0,8);
  if(!announcements.length) return '<div class="class-hub-empty">No class announcements yet.</div>';
  return announcements.map(item=>`<article class="class-announcement"><div><span>Announcement</span><small>${escapeHtml(formatSchoolDate(item.created_at))}</small></div><h3>${escapeHtml(item.title||'Class announcement')}</h3><p>${escapeHtml(item.body||'')}</p></article>`).join('');
}
async function hydrateClassHubExtras(cls){
  if(!cls || routeFromHash().route!=='student-hub') return;
  const school=getSchoolClient();
  const stillHere=()=>routeFromHash().route==='student-hub' && String(selectedStudentClassId)===String(cls.id);
  const safe=async(promise,fallback,ms=3500)=>{
    try{return await withStartupTimeout(promise,ms,'This class card took too long to load.');}
    catch{return fallback;}
  };

  // Load every card independently. One slow endpoint must never hold the entire Class page hostage.
  void safe(school.listStudioContent({schoolId:cls.school_id,classId:cls.id,limit:24}),[],3500).then(content=>{
    if(!stillHere()) return;
    studioContent=content||[];
    const anns=document.getElementById('class-announcements');
    if(anns) anns.innerHTML=classHubAnnouncementHtml(studioContent);
  });

  void safe(accountClient.ensureClient().rpc('mathsexpress_class_skill_focus',{p_class_id:String(cls.id)}),{data:[],error:null},3000).then(result=>{
    if(!stillHere()) return;
    activeClassSkillFocus=Array.isArray(result?.data)?result.data:[];activeClassSkillFocusClassId=String(cls.id);
    const box=document.getElementById('class-skills-focus');
    if(box) box.innerHTML=activeClassSkillFocus.length?`<div class="skills-focus-grid">${activeClassSkillFocus.map(f=>{const skill=getCurriculumSkill(f.skill_id)||{};return `<button data-action="start-path-skill" data-skill-id="${escapeHtml(f.skill_id)}" data-skill-year="${Number(skill.yearLevel??cls.year_level??9)}"><span class="focus-priority p${Number(f.priority)||1}">${'●'.repeat(Number(f.priority)||1)}</span><div><strong>${escapeHtml(f.title||skill.title||skill.skill||f.skill_id)}</strong><small>${escapeHtml(f.note||'Teacher focus')}</small></div><b>→</b></button>`}).join('')}</div>`:'<div class="class-hub-empty">Your teacher has not set Skills Focus yet.</div>';
  });

  void safe(school.listActiveClassroomSessions(),[],3000).then(sessions=>{
    if(!stillHere()) return;
    const live=(sessions||[]).filter(x=>String(x.class_id)===String(cls.id));
    activeClassSessions=live;
    const games=document.getElementById('class-live-games');
    if(games) games.innerHTML=classHubGameListHtml(live);
  });

  void safe(accountClient.ensureClient().rpc('mathsexpress_get_expedition',{p_class_id:String(cls.id)}),{data:null,error:new Error('timeout')},3200).then(result=>{
    if(!stillHere()) return;
    const exp=document.getElementById('class-expedition-card');
    if(!exp) return;
    const expedition=result?.data||null;
    if(!expedition){
      exp.innerHTML=`<div class="class-expedition-head"><div><span class="eyebrow">Class expedition</span><h3>Expedition unavailable</h3></div></div><p>This card could not load right now. The rest of Class still works.</p><button class="btn secondary small" data-action="retry-class-extras">Retry</button>`;
      return;
    }
    const progress=Number(expedition?.progress||0),target=Math.max(1,Number(expedition?.target||1000)),pct=Math.min(100,Math.round(progress/target*100));
    exp.innerHTML=`<div class="class-expedition-head"><div><span class="eyebrow">Class expedition</span><h3>${escapeHtml(expedition?.title||'Monthly Maths Expedition')}</h3></div><strong>${progress.toLocaleString()} pts</strong></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><p>${progress.toLocaleString()} / ${target.toLocaleString()} class points · Every correct learning question adds <b>10 points</b>.</p>`;
  });

  void safe(school.listRecognition(),[],3200).then(recognition=>{
    if(!stillHere()) return;
    const recog=document.getElementById('class-recognition'); if(!recog) return;
    const uniqueRecognition=[...(recognition||[])].filter(r=>String(r.class_id)===String(cls.id)&&String(r.student_id)===String(account.profile?.userId));
    recog.innerHTML=uniqueRecognition.length
      ? `<span class="eyebrow">Teacher recognition</span>${uniqueRecognition.slice(0,4).map(r=>`<article><strong>${escapeHtml(r.message||'Great work')}</strong><small>${escapeHtml(String(r.sticker||'star').replaceAll('-',' '))}</small></article>`).join('')}`
      : `<span class="eyebrow">Teacher recognition</span><p class="muted">No recognition yet.</p>`;
  });

  void safe(school.listMyTeacherFeedback(),[],3200).then(teacherFeedback=>{
    if(!stillHere()) return;
    const feedback=document.getElementById('class-feedback'); if(!feedback) return;
    feedback.innerHTML=teacherFeedback?.length
      ? `<span class="eyebrow">Teacher feedback</span>${teacherFeedback.slice(0,4).map(f=>`<article><p>${escapeHtml(f.comment||'')}</p><small>${new Date(f.created_at).toLocaleDateString()}${f.allow_resubmission?' · Resubmission allowed':''}</small></article>`).join('')}`
      : `<span class="eyebrow">Teacher feedback</span><p class="muted">No teacher feedback yet.</p>`;
  });
}
async function refreshClassHubLive(){
  if(routeFromHash().route!=='student-hub' || !selectedStudentClassId) return stopClassHubLiveRefresh();
  try{
    const school=getSchoolClient();
    const clsId=String(selectedStudentClassId);
    const clsSchoolId=document.getElementById('class-hub-root')?.dataset.schoolId||'';
    const [sessions,content]=await Promise.all([
      withStartupTimeout(school.listActiveClassroomSessions(),3000,'Live games refresh timed out.').catch(()=>[]),
      clsSchoolId?withStartupTimeout(school.listStudioContent({schoolId:clsSchoolId,classId:clsId,limit:12}),3000,'Announcements refresh timed out.').catch(()=>[]):Promise.resolve([])
    ]);
    const live=(sessions||[]).filter(x=>String(x.class_id)===clsId); activeClassSessions=live;
    const games=document.getElementById('class-live-games'); if(games)games.innerHTML=classHubGameListHtml(live);
    if(content?.length){studioContent=content;const anns=document.getElementById('class-announcements');if(anns)anns.innerHTML=classHubAnnouncementHtml(content);}
  }catch{}
}
function startClassHubLiveRefresh(){stopClassHubLiveRefresh();classHubLiveTimer=setInterval(()=>void refreshClassHubLive(),2500);}

function openJoinClassModal(){
  openSimpleModal('Join a class',`<form id="join-class-form" class="school-form join-class-modal-form">
    <p>Enter the 6-character code your teacher gave you.</p>
    <label>Class code<input name="code" maxlength="6" minlength="6" autocomplete="off" autocapitalize="characters" placeholder="ABC123" required></label>
    <button class="btn primary" type="submit">Join class</button>
  </form>`);
  setTimeout(()=>document.querySelector('#join-class-form input[name="code"]')?.focus(),0);
}

async function openDiscussionBoard(classId=''){
  const cid=String(classId||selectedStudentClassId||selectedTeacherClassId||lastTeacherReport?.class?.id||'');
  if(!cid) return showToast('Choose a class first','Join or open a class before using Ask Teacher.');
  activeDiscussionClassId=cid;
  openSimpleModal('Ask Teacher / Discussion Board','<div class="school-loading"><span class="spinner"></span><strong>Loading discussion…</strong></div>');
  try{
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_list_discussion_threads',{p_class_id:cid,p_limit:100});
    if(error) throw error;
    const rows=Array.isArray(data)?data:[];
    const teacher=canUseTeacherHub(account);
    const composer=teacher?'':`<form id="discussion-new-form" class="discussion-composer school-form"><input type="hidden" name="classId" value="${escapeHtml(cid)}"><label>Subject<input name="subject" maxlength="120" placeholder="What do you need help with?"></label><label>Your question<textarea name="body" rows="3" maxlength="4000" placeholder="Ask your teacher a maths question…" required></textarea></label><button class="btn primary" type="submit">Post to teacher</button></form>`;
    const list=rows.map(t=>`<article class="discussion-thread ${escapeHtml(t.status||'open')}"><header><div><strong>${escapeHtml(t.subject||'Question')}</strong><small>${teacher?`${escapeHtml(t.student_name||'Student')} · `:''}${new Date(t.created_at).toLocaleString()}</small></div><span class="tag ${t.status==='answered'?'green':t.status==='closed'?'muted':'amber'}">${escapeHtml(t.status||'open')}</span></header><p>${escapeHtml(t.body||'')}</p>${(t.posts||[]).map(post=>`<div class="discussion-reply ${post.is_staff?'staff':''}"><b>${post.is_staff?'Teacher':escapeHtml(post.author_name||'Student')}</b><span>${escapeHtml(post.body||'')}</span><small>${new Date(post.created_at).toLocaleString()}</small></div>`).join('')}<form id="discussion-reply-form" class="discussion-reply-form"><input type="hidden" name="threadId" value="${escapeHtml(t.id)}"><input name="body" maxlength="4000" placeholder="${teacher?'Reply to student…':'Reply…'}" ${t.status==='closed'?'disabled':''}><button class="btn secondary small" type="submit" ${t.status==='closed'?'disabled':''}>Reply</button></form>${teacher?`<div class="discussion-moderation"><button class="btn ghost small" data-action="discussion-visibility" data-thread-id="${escapeHtml(t.id)}" data-visibility="${t.visibility==='class'?'teacher':'class'}">${t.visibility==='class'?'Make teacher-only':'Share with class'}</button><button class="btn ghost small" data-action="discussion-status" data-thread-id="${escapeHtml(t.id)}" data-status="${t.status==='closed'?'open':'closed'}">${t.status==='closed'?'Reopen':'Close'}</button></div>`:''}</article>`).join('')||'<div class="school-empty">No questions yet.</div>';
    openSimpleModal('Ask Teacher / Discussion Board',`${composer}<div class="discussion-list">${list}</div>`);
  }catch(error){openSimpleModal('Ask Teacher / Discussion Board',`<div class="school-error"><strong>Discussion couldn’t load.</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`);}
}

async function renderStudentHub() {
  const root=document.getElementById('app-view');
  root.innerHTML='<section class="page class-hub-page"><div class="school-loading"><span class="spinner"></span><strong>Loading your class…</strong></div></section>';
  try{
    const school=getSchoolClient();
    let memberships;
    try{
      memberships=await withStartupTimeout(school.listStudentClasses(),12000,'Classes are taking longer than usual to load.');
    }catch(firstError){
      console.warn('Class membership load timed out; retrying once.',firstError);
      memberships=await withStartupTimeout(school.listStudentClasses(),12000,'Classes still could not load. Check your connection and retry.');
    }
    const [assignments,sessions]=await Promise.all([
      withStartupTimeout(school.listStudentAssignments(),10000,'Tasks took too long to load.').catch(error=>{console.warn('Class tasks unavailable',error);return [];}),
      withStartupTimeout(school.listActiveClassroomSessions(),7000,'Live games took too long to load.').catch(()=>[])
    ]);
    if(routeFromHash().route!=='student-hub')return;
    const classes=memberships.map(r=>r?.class).filter(c=>c&&!c.archived);
    if(!classes.length){root.innerHTML=`<section class="page class-hub-page"><div class="class-empty-large join-class-empty"><span class="eyebrow">Class</span><h1>Join your class</h1><p>Enter the 6-character class code from your teacher. Your class tasks, games, announcements and textbook focus will appear here.</p><form id="join-class-form" class="inline-join-class-form"><input name="code" maxlength="6" minlength="6" placeholder="ABC123" required><button class="btn primary" type="submit">Join class</button></form></div></section>`;return;}
    if(!selectedStudentClassId || !classes.some(c=>String(c.id)===String(selectedStudentClassId))) selectedStudentClassId=String(classes[0].id);
    const cls=classes.find(c=>String(c.id)===String(selectedStudentClassId))||classes[0];
    selectedStudentClassId=String(cls.id);
    const adjusted=assignments.map(effectiveStudentAssignment).filter(a=>!a.class_id || String(a.class_id)===String(cls.id));
    const active=adjusted.filter(a=>!['completed','overdue'].includes(a._effectiveStatus));
    const past=adjusted.filter(a=>['completed','overdue'].includes(a._effectiveStatus));
    const live=(sessions||[]).filter(x=>String(x.class_id)===String(cls.id));
    activeClassSessions=live;
    const weeklyPoints=Math.max(0,Number(account.profile?.weeklyPoints)||0);
    const tab=['class','tasks','activity','skills','settings'].includes(studentHubTab)?studentHubTab:'class';
    const classChooser=classes.length>1?`<select class="class-hub-select" data-action="switch-student-class" aria-label="Choose class">${classes.map(c=>`<option value="${escapeHtml(c.id)}" ${String(c.id)===String(cls.id)?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select>`:'';
    root.innerHTML=`<section id="class-hub-root" data-school-id="${escapeHtml(cls.school_id||'')}" class="page class-hub-page minimal-class-hub">
      <header class="class-hub-header"><div><span class="eyebrow">Class</span><div class="class-title-line"><h1>${escapeHtml(cls.name||'Your class')}</h1>${classChooser}</div><p>${escapeHtml(yearLabel(cls.year_level))}${cls.room?` · Room ${escapeHtml(cls.room)}`:''}${cls.join_code?` · Code ${escapeHtml(cls.join_code)}`:''}</p><div class="class-header-actions"><button class="btn secondary small" data-action="open-join-class">Join another class</button><button class="btn secondary small" data-action="open-student-parent">Add Parent / Guardian</button><button class="btn ghost small" data-action="open-discussion-board" data-class-id="${escapeHtml(cls.id)}">Ask teacher</button></div></div><div class="class-points-card"><small>YOUR POINTS</small><strong>${weeklyPoints.toLocaleString()}</strong><span>+10 per correct question</span></div></header>
      <nav class="class-hub-tabs"><button class="${tab==='class'?'active':''}" data-action="student-hub-tab" data-tab="class">Overview</button><button class="${tab==='tasks'?'active':''}" data-action="student-hub-tab" data-tab="tasks">Tasks <b>${active.length}</b></button><button class="${tab==='activity'?'active':''}" data-action="student-hub-tab" data-tab="activity">Activity</button><button class="${tab==='skills'?'active':''}" data-action="student-hub-tab" data-tab="skills">Skills</button><button class="${tab==='settings'?'active':''}" data-action="student-hub-tab" data-tab="settings">Settings</button></nav>
      ${tab==='class'?`<div class="class-hub-grid"><main>
        <section class="class-hub-section live-class-section"><div class="class-section-head"><div><span class="eyebrow">Live now</span><h2>Class games</h2></div><small>Updates automatically</small></div><div id="class-live-games">${classHubGameListHtml(live)}</div></section>
        <section class="class-hub-section"><div class="class-section-head"><div><span class="eyebrow">From your teacher</span><h2>Announcements</h2></div><button class="btn ghost small" data-action="open-discussion-board" data-class-id="${escapeHtml(cls.id)}">Ask teacher</button></div><div id="class-announcements"><div class="school-loading compact"><span class="spinner"></span><strong>Loading announcements…</strong></div></div></section>
        <section class="class-hub-section"><div class="class-section-head"><div><span class="eyebrow">Next up</span><h2>Class tasks</h2></div><button class="text-link" data-action="student-hub-tab" data-tab="tasks">View all</button></div><div class="assignment-list compact-class-task-list">${active.slice(0,3).map(studentAssignmentCard).join('')||'<div class="class-hub-empty">You are caught up.</div>'}</div></section>
      </main><aside>
        <section id="class-expedition-card" class="class-side-card"><div class="school-loading compact"><span class="spinner"></span><strong>Loading expedition…</strong></div></section>
        <section class="class-side-card"><span class="eyebrow">Class details</span><dl class="class-details-list"><div><dt>Year</dt><dd>${escapeHtml(yearLabel(cls.year_level))}</dd></div><div><dt>Join code</dt><dd>${escapeHtml(cls.join_code||'—')}</dd></div><div><dt>Textbook</dt><dd>${escapeHtml(textbookFocusDisplay(cls.textbook_focus||''))}</dd></div><div><dt>Active tasks</dt><dd>${active.length}</dd></div></dl></section>
        <section class="class-side-card family-shortcut-card"><span class="eyebrow">Family</span><h3>Parent / Guardian</h3><p>Add an email where your parent or guardian can receive progress reports and teacher messages.</p><button class="btn secondary small" data-action="open-student-parent">Manage parents</button></section>
        <section id="class-recognition" class="class-side-card"><span class="eyebrow">Teacher recognition</span><p class="muted">Loading…</p></section><section id="class-feedback" class="class-side-card"><span class="eyebrow">Teacher feedback</span><p class="muted">Loading…</p></section>
      </aside></div>`:''}
      ${tab==='tasks'?`<section class="class-hub-section"><div class="class-section-head"><div><span class="eyebrow">Class work</span><h2>Your tasks</h2></div><span>${active.length} active</span></div><div class="assignment-list">${active.map(studentAssignmentCard).join('')||'<div class="class-hub-empty">No active tasks.</div>'}</div><div class="class-history-block"><h3>Past work</h3><div class="history-grid">${past.slice(0,12).map(a=>`<article class="history-card"><strong>${escapeHtml(a.title)}</strong><span>${schoolStatusPill(a._effectiveStatus||a.status)}</span><small>${Math.round(Number(a.score_percent)||0)}% result</small><div class="history-card-actions">${schoolAssignmentStartButton(a,'Retry task')}${Number(a.score_percent)<100?`<button class="btn ghost small" data-action="open-fix-mode" data-assignment-id="${escapeHtml(a.id)}">Fix mistakes</button>`:''}</div></article>`).join('')||'<div class="class-hub-empty">Completed tasks appear here.</div>'}</div></div></section>`:''}
      ${tab==='activity'?`<section class="class-hub-section"><div class="class-section-head"><div><span class="eyebrow">Progress</span><h2>Your class activity</h2></div></div><div class="class-activity-summary"><article><strong>${active.length}</strong><span>active tasks</span></article><article><strong>${past.filter(a=>a._effectiveStatus==='completed').length}</strong><span>completed tasks</span></article><article><strong>${weeklyPoints}</strong><span>points this week</span></article><article><strong>${formatGameTime(state.gameTimeSeconds)}</strong><span>Game Time</span></article></div><div class="recommend-list">${studentRecommendationCards()}</div></section>`:''}
      ${tab==='skills'?`<section class="class-hub-section"><div class="class-section-head"><div><span class="eyebrow">Teacher focus</span><h2>Skills Focus</h2></div><button class="btn primary small" data-route="learn">Open Learn</button></div><div id="class-skills-focus"><div class="school-loading compact"><span class="spinner"></span><strong>Loading focus skills…</strong></div></div><div class="class-section-head spaced"><div><span class="eyebrow">Recommended learning</span><h2>Skills for you</h2></div></div><div class="recommend-list">${studentRecommendationCards()}</div></section>`:''}
      ${tab==='settings'?`<section class="class-hub-section"><div class="class-section-head"><div><span class="eyebrow">Student settings</span><h2>Account & class</h2></div></div><p>Your class data, assignments and progress are saved to your MathsExpress account. Local preferences are also synced to the account cloud when available.</p><div class="simple-actions"><button class="btn primary" data-action="open-student-parent">Parents & guardians</button><button class="btn secondary" data-route="profile">Profile</button><button class="btn secondary" data-route="tools">Accessibility</button><button class="btn ghost" data-action="export-progress">Download backup</button></div></section>`:''}
    </section>`;
    if(tab==='class'){void hydrateClassHubExtras(cls);startClassHubLiveRefresh();}else if(tab==='skills'){void hydrateClassHubExtras(cls);stopClassHubLiveRefresh();}else stopClassHubLiveRefresh();
  }catch(error){stopClassHubLiveRefresh();root.innerHTML=`<section class="page class-hub-page"><div class="school-error"><strong>Class couldn’t load.</strong><p>${escapeHtml(error.message||'Try again.')}</p><div class="simple-actions"><button class="btn primary" data-action="retry-student-hub">Retry</button><button class="btn secondary" data-route="home">Back home</button></div></div></section>`;}
}

function teacherSummaryCards(dashboard = {}) {
  const students = dashboard.students || [];
  const assignments = dashboard.assignments || [];
  const activity = dashboard.activity || [];
  const attempts = dashboard.attempts || [];
  const activeToday = students.filter((s) => s.last_seen && Date.now() - new Date(s.last_seen).getTime() < 86400000).length;
  const avg = attempts.length ? Math.round(attempts.reduce((n,a)=>n+Number(a.score_percent||0),0)/attempts.length) : 0;
  return `<div class="teacher-metrics"><article><span>Students</span><strong>${students.length}</strong><small>${activeToday} active today</small></article><article><span>Assignments</span><strong>${assignments.length}</strong><small>${assignments.filter(a=>!a.due_at || new Date(a.due_at)>new Date()).length} open</small></article><article><span>Average result</span><strong>${avg}%</strong><small>across submitted work</small></article><article><span>Activity</span><strong>${activity.reduce((n,x)=>n+(Number(x.questions)||0),0)}</strong><small>questions logged</small></article></div>`;
}

function localInputDateTime(daysAhead = 7) {
  const d = new Date(Date.now() + daysAhead * 86400000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function curatedBankTasks(yearLevel=9){
  const year=normaliseYearLevel(yearLevel,9); const skills=getCurriculumSkills({yearLevel:year}); const rows=[];
  const recipes=[
    {type:'practice',difficulty:'easy',questionCount:15,label:'Fluency'},
    {type:'practice',difficulty:'medium',questionCount:15,label:'Core'},
    {type:'practice',difficulty:'hard',questionCount:15,label:'Reasoning'},
    {type:'test',difficulty:'mixed',questionCount:15,label:'Checkpoint'},
  ];
  for(const skill of skills){
    for(const recipe of recipes){
      const task=searchTaskLibrary({yearLevel:year,skillId:skill.id,type:recipe.type,difficulty:recipe.difficulty,questionCount:recipe.questionCount,limit:1})[0]
        || searchTaskLibrary({yearLevel:year,skillId:skill.id,type:recipe.type,questionCount:recipe.questionCount,limit:1})[0];
      if(task)rows.push({...task,curatedLabel:recipe.label});
    }
  }
  return rows;
}
function openCuratedQuestionBank(yearLevel=normaliseYearLevel(account.profile?.yearLevel,9)){
  const year=normaliseYearLevel(yearLevel,9); const rows=curatedBankTasks(year); const slots=rows.reduce((n,t)=>n+Number(t.questionCount||0),0);
  openSimpleModal('MathsExpress Curated Question Bank',`<div class="curated-bank-head"><div><span class="eyebrow">Stable teacher collections</span><h2>${escapeHtml(yearLabel(year))}</h2><p>Fixed Fluency, Core, Reasoning and Checkpoint collections are kept separate from the much larger generated practice catalogue.</p></div><div class="curated-bank-stat"><strong>${rows.length}</strong><small>collections · ${slots.toLocaleString()} question slots</small></div></div><div class="curated-year-switcher">${YEAR_LEVEL_OPTIONS.map(o=>`<button class="btn ${o.value===year?'primary':'ghost'} small" data-action="open-curated-bank-year" data-year="${o.value}">${escapeHtml(o.label)}</button>`).join('')}</div><div class="curated-bank-grid">${rows.slice(0,120).map(t=>`<article><span class="task-type-badge">${escapeHtml(t.curatedLabel)}</span><strong>${escapeHtml(t.skill)}</strong><small>${escapeHtml(t.topic)} · ${t.questionCount} questions · ${escapeHtml(t.difficulty)}</small><div class="simple-actions"><button class="btn ghost small" data-action="preview-library-task" data-task-id="${escapeHtml(t.id)}">Preview</button><button class="btn ghost small" data-action="copy-task-share-link" data-task-id="${escapeHtml(t.id)}" data-task-title="${escapeHtml(t.title)}">Share</button><button class="btn primary small" data-action="quick-assign-task" data-task-id="${escapeHtml(t.id)}">Assign</button></div></article>`).join('')||'<div class="school-empty">No curated collections found for this year.</div>'}</div><p class="muted">These are stable MathsExpress collections built from the platform’s validated question generators. They are not presented as a licensed third-party question bank.</p>`);
}

function libraryTaskCard(task) {
  return `<article class="task-library-card">
    <div class="task-card-top"><span class="task-type-badge">${escapeHtml(task.typeLabel)}</span><span class="task-difficulty ${escapeHtml(task.difficulty)}">${escapeHtml(task.difficulty)}</span></div>
    <h3>${escapeHtml(task.title)}</h3>
    <p>${escapeHtml(task.learningGoal)}</p>
    <div class="task-card-meta"><span>Year ${task.yearLevel}</span><span>${task.questionCount} questions</span><span>~${task.estimatedMinutes} min</span><span>${task.masteryTarget}% target</span></div>
    <div class="task-card-actions"><button class="btn secondary small" data-action="preview-library-task" data-task-id="${task.id}">Preview task</button><button class="btn ghost small" data-action="copy-task-share-link" data-task-id="${task.id}" data-task-title="${escapeHtml(task.title)}">Share link</button><button class="btn primary small" data-action="quick-assign-task" data-task-id="${task.id}">Quick Assign</button></div>
  </article>`;
}

function openTaskPreview(taskId) {
  const task = previewTask(taskId);
  if (!task) return showToast('Task unavailable', 'Choose another task.');
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-backdrop"><div class="modal task-preview-modal pop">
    <div class="simple-modal-head"><div><span class="eyebrow">Task preview</span><h2>${escapeHtml(task.title)}</h2></div><button class="modal-x" data-action="close-school-modal" aria-label="Close">×</button></div>
    <div class="preview-summary"><div><small>Learning goal</small><strong>${escapeHtml(task.learningGoal)}</strong></div><div><small>Questions</small><strong>${task.questionCount}</strong></div><div><small>Estimated time</small><strong>${task.estimatedMinutes} min</strong></div><div><small>Mastery target</small><strong>${task.masteryTarget}%</strong></div></div>
    <h3>Sample questions</h3><div class="preview-question-list">${task.sampleQuestions.map((q,i)=>`<div><span>${i+1}</span><p>${mathHtml(q.prompt)}</p></div>`).join('')}</div>
    <div class="simple-modal-actions"><button class="btn secondary" data-action="close-school-modal">Back</button><button class="btn ghost" data-action="copy-task-share-link" data-task-id="${task.id}" data-task-title="${escapeHtml(task.title)}">Copy share link</button><button class="btn primary" data-action="quick-assign-task" data-task-id="${task.id}">Quick Assign</button></div>
  </div></div>`;
}

async function loadTeacherClassesForAssign(){
  let classes=teacherHubClasses.filter((c)=>!c.archived);
  if(classes.length) return classes;
  const loaded=await withStartupTimeout(getSchoolClient().listTeacherClasses(),12000,'Your classes are taking longer than usual to load.');
  teacherHubClasses=Array.isArray(loaded)?loaded:[];
  if(!selectedSchoolId && teacherHubClasses[0]?.school_id) selectedSchoolId=String(teacherHubClasses[0].school_id);
  return teacherHubClasses.filter((c)=>!c.archived);
}

async function openQuickAssign(taskId, context=null) {
  const task = getTaskById(taskId);
  textbookAssignContext=context||null;
  if (!task) return showToast('Task unavailable', 'Choose another task.');
  const root = document.getElementById('modal-root');
  let classes = teacherHubClasses.filter((c) => !c.archived);
  if (!classes.length) {
    root.innerHTML = `<div class="modal-backdrop"><div class="modal task-preview-modal pop"><div class="school-loading"><span class="spinner"></span><strong>Loading your active classes…</strong></div></div></div>`;
    try {
      classes = await loadTeacherClassesForAssign();
    } catch (error) {
      console.warn('Quick Assign class load failed', error);
      root.innerHTML = `<div class="modal-backdrop"><div class="modal task-preview-modal pop"><span class="eyebrow">Quick Assign</span><h2>Classes couldn’t load</h2><p class="lock-note">${escapeHtml(error?.message||'Try again in a moment.')}</p><div class="simple-modal-actions"><button class="btn secondary" data-action="close-school-modal">Close</button><button class="btn primary" data-action="teacher-tab" data-tab="classes">Open Classes</button></div></div></div>`;
      return;
    }
  }
  if (!classes.length) {
    root.innerHTML = `<div class="modal-backdrop"><div class="modal task-preview-modal pop"><span class="eyebrow">Quick Assign</span><h2>Create a class first</h2><p class="lock-note">No active teacher classes were found on your account.</p><div class="simple-modal-actions"><button class="btn secondary" data-action="close-school-modal">Close</button><button class="btn primary" data-action="teacher-tab" data-tab="classes">Go to Classes</button></div></div></div>`;
    return;
  }
  const defaultClass=classes.find(c=>String(c.id)===String(selectedTeacherClassId))||classes[0];
  root.innerHTML = `<div class="modal-backdrop"><div class="modal quick-assign-modal pop">
    <div class="simple-modal-head"><div><span class="eyebrow">Quick Assign</span><h2>${escapeHtml(context?.title||task.title)}</h2>${context?.reference?`<p class="muted">${escapeHtml(context.reference)}</p>`:''}</div><button class="modal-x" data-action="close-school-modal" aria-label="Close">×</button></div>
    <form id="quick-assign-form" class="quick-assign-form">
      <input type="hidden" name="taskId" value="${task.id}"><input type="hidden" name="assignmentTitle" value="${escapeHtml(context?.title||task.title)}">
      ${context?.reference?`<div class="assign-step textbook-reference-step"><span>📘</span><label>Textbook reference<input name="textbookRef" value="${escapeHtml(context.reference)}" maxlength="300"><small>You can change this to the exact Cambridge/Jacaranda chapter, page or exercise your class is using.</small></label></div>`:`<input type="hidden" name="textbookRef" value="">`}
      <div class="assign-step"><span>1</span><label>Choose class<select name="classId" required>${classes.map((c)=>`<option value="${c.id}" ${String(c.id)===String(defaultClass?.id)?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select></label></div>
      <div class="assign-step"><span>2</span><div><small>Task</small><strong>${escapeHtml(task.skill)}</strong><p>${task.questionCount} questions · ${escapeHtml(task.difficulty)} · ~${task.estimatedMinutes} min</p></div></div>
      <div class="assign-step"><span>3</span><label>Set due date<input name="dueAt" type="datetime-local" value="${localInputDateTime(7)}" required></label></div>
      <div class="assign-step final"><span>4</span><div><small>Ready</small><strong>Assign to the whole class</strong><p>Students will see it on their dashboard immediately.</p></div></div>
      <div class="simple-modal-actions"><button type="button" class="btn secondary" data-action="close-school-modal">Cancel</button><button type="submit" class="btn primary">Assign task</button></div>
    </form>
  </div></div>`;
}

function openCustomAssignment() {
  if (!canUseTeacherHub(account)) return showToast('Teacher tools only', 'Task creation is only available to teacher and school accounts.');
  const classes = teacherHubClasses.filter((c) => !c.archived);
  const root = document.getElementById('modal-root');
  if (!classes.length) return showToast('Create a class first', 'Go to Classes, then create your own assignment.');
  const defaultClass=classes.find(c=>String(c.id)===String(selectedTeacherClassId))||classes[0];
  const defaultYear=normaliseYearLevel(defaultClass?.year_level,normaliseYearLevel(account.profile?.yearLevel,9));
  const skills=getCurriculumSkills({yearLevel:'all'}).slice().sort((a,b)=>Number(a.yearLevel)-Number(b.yearLevel)||String(a.strand).localeCompare(String(b.strand))||String(a.title).localeCompare(String(b.title)));
  root.innerHTML = `<div class="modal-backdrop"><div class="modal quick-assign-modal assignment-builder-modal pop"><div class="simple-modal-head"><div><span class="eyebrow">Create assignment</span><h2>Choose exactly what students will do</h2><p class="muted">Every assignment is attached to a real skill/question set, so students never receive an empty task.</p></div><button class="modal-x" data-action="close-school-modal">×</button></div>
  <form id="create-assignment-form" class="simple-custom-form assignment-builder-form">
    <div class="assignment-builder-grid"><label>Class<select name="classId">${classes.map((c)=>`<option value="${c.id}" ${String(c.id)===String(defaultClass?.id)?'selected':''}>${escapeHtml(c.name)}${c.room?` · Room ${escapeHtml(c.room)}`:''}</option>`).join('')}</select></label>
    <label>Title<input name="title" placeholder="e.g. Linear equations revision" required></label></div>
    <label>Task type<select name="type">${TASK_TYPES.map(([value,label])=>`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join('')}</select><small class="field-help">Includes Custom, Adaptive, Lesson, Worksheet, Test, readiness/diagnostics, check-ins, revision, templates, bulk workflows and topic tests.</small></label>
    <label>Skill / topic<select name="skillId" required>${skills.map(skill=>`<option value="${escapeHtml(skill.id)}" ${skill.yearLevel===defaultYear?'':'data-other-year="1"'}>${escapeHtml(yearLabel(skill.yearLevel))} · ${escapeHtml(skill.strand)} · ${escapeHtml(skill.title)}</option>`).join('')}</select></label>
    <div class="form-two"><label>Difficulty<select name="difficulty"><option value="adaptive">Adaptive</option><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option><option value="mixed">Mixed</option></select></label><label>Questions<select name="questionCount">${QUESTION_COUNTS.map(n=>`<option value="${n}" ${n===10?'selected':''}>${n}</option>`).join('')}</select></label></div>
    <div class="form-two"><label>Start date<input name="startAt" type="datetime-local"></label><label>Due date<input name="dueAt" type="datetime-local" value="${localInputDateTime(7)}"></label></div>
    <label class="check-row"><input type="checkbox" name="hintsAllowed" checked> Allow hints on non-test tasks</label>
    <div class="assignment-type-reference"><strong>Assignment types included</strong><div>${TASK_TYPES.filter(([v])=>v!=='practice'&&v!=='self-directed-adaptive').map(([v,l])=>`<span title="${escapeHtml(ASSIGNMENT_TYPE_HELP[v]||'')}">${escapeHtml(l)}</span>`).join('')}</div></div>
    <div class="simple-modal-actions"><button type="button" class="btn secondary" data-action="close-school-modal">Cancel</button><button class="btn primary" type="submit">Create assignment</button></div>
  </form></div></div>`;
}
function schoolRoleLabel(role = '') {
  return ({ owner:'Owner', principal:'Principal', deputy_principal:'Deputy Principal', head_teacher:'Head Teacher', year_coordinator:'Year Coordinator', teacher:'Teacher', student:'Student' })[role] || 'School member';
}


function assignmentTaskGroupForStudent(assignment, userId=account.profile?.userId){
  const groups=Array.isArray(assignment?.config?.task_groups)?assignment.config.task_groups:[];
  const uid=String(userId||'');
  return groups.find(group=>(group.studentIds||group.student_ids||[]).map(String).includes(uid))||null;
}
function assignmentScheduleForStudent(assignment){
  const group=assignmentTaskGroupForStudent(assignment);
  return {
    group,
    startAt:group?.startAt||group?.start_at||assignment?.start_at||assignment?.config?.start_at||null,
    dueAt:group?.dueAt||group?.due_at||assignment?.due_at||null,
  };
}
function effectiveStudentAssignment(assignment){
  const schedule=assignmentScheduleForStudent(assignment);
  const now=Date.now();
  const complete=assignment?.status==='completed';
  let status=assignment?.status||'assigned';
  if(!complete && schedule.startAt && new Date(schedule.startAt).getTime()>now) status='scheduled';
  else if(!complete && schedule.dueAt && new Date(schedule.dueAt).getTime()<now) status='overdue';
  else if(!complete && status==='overdue') status='assigned';
  return {...assignment,_group:schedule.group,_effectiveStart:schedule.startAt,_effectiveDue:schedule.dueAt,_effectiveStatus:status};
}
function studentAssignmentCard(raw){
  const a=effectiveStudentAssignment(raw);
  const startMs=a._effectiveStart?new Date(a._effectiveStart).getTime():0;
  const notOpen=Boolean(startMs && startMs>Date.now());
  const due=a._effectiveDue||a.due_at||'';
  const isTest=Boolean(a.test_mode||a.assignment_type==='test'||a.assignment_type==='topic-test');
  const complete=a._effectiveStatus==='completed';
  const locked=Boolean(isTest&&complete&&a.results_released===false);
  if(complete&&isTest){
    return `<article class="assignment-card v10-test-complete ${locked?'results-locked':'results-open'}"><div class="v10-test-main"><span class="task-type-badge">Test</span><small>${escapeHtml(formatSchoolDate(a.completed_at||a.updated_at||due))}</small><h3>${escapeHtml(a.title)}</h3><div class="v10-test-status"><span class="done">✓ Done</span>${locked?'<span class="locked">🔒 Results locked</span>':`<span class="released">${Math.round(Number(a.score_percent)||0)}% result</span>`}</div><div class="v10-test-message">${locked?'Well done! Your results will be shared soon.':'Your teacher has released your result.'}</div></div>${cloveHtml('celebrate')}</article>`;
  }
  return `<article class="assignment-card"><div class="assignment-type">${escapeHtml(a.assignment_type || 'practice')}</div><div class="assignment-copy"><strong>${escapeHtml(a.title)}</strong><small>${escapeHtml(a.class_name || 'MathsExpress class')} • ${escapeHtml(a.topic || 'Algebra')}${a._group?` • ${escapeHtml(a._group.name||'Task group')}`:''}</small><div>${schoolStatusPill(a._effectiveStatus)} <span class="due-chip">${notOpen?`Opens ${escapeHtml(formatSchoolDate(a._effectiveStart))}`:escapeHtml(formatSchoolDate(due))}</span></div></div><div class="assignment-progress"><strong>${Math.round(Number(a.score_percent)||0)}%</strong><small>${Number(a.answered)||0} answered</small>${a.config?.paused?'<span class="tag amber">Paused by teacher</span>':notOpen?'<span class="tag amber">Scheduled</span>':`<button class="btn primary small" data-action="start-school-assignment" data-assignment-id="${a.id}" data-class-id="${escapeHtml(a.class_id || a.classId || '')}" data-assignment-title="${escapeHtml(a.title||'Assigned work')}" data-class-name="${escapeHtml(a.class_name||'MathsExpress class')}" data-due-at="${escapeHtml(due)}" data-lesson-id="${escapeHtml(a.lesson_id || '')}" data-task-id="${escapeHtml(a.config?.task_library_id || '')}" data-test-mode="${a.test_mode?'1':'0'}" data-tutor-allowed="${a.tutor_allowed===false?'0':'1'}" data-hints-allowed="${a.hints_allowed===false?'0':'1'}" data-calculator-enabled="${a.calculator_enabled===false?'0':'1'}" data-videos-allowed="${a.videos_allowed===false?'0':'1'}" data-time-limit="${Number(a.time_limit_minutes)||0}" data-start-at="${escapeHtml(a._effectiveStart||a.start_at||a.config?.start_at||'')}" data-exact-start="${a.config?.exact_scheduled_start?'1':'0'}" data-games-locked="${a.config?.games_locked?'1':'0'}" data-focus-required="${a.config?.focus_required?'1':'0'}">Start</button>`}</div></article>`;
}
function worksheetQuestionSeconds(question){
  const complexity=Math.max(1,Math.min(5,Number(question?.complexity||question?.difficulty)||2));
  const type=String(question?.type||'numeric');
  const typeExtra=['proof','written-response','multi-part'].includes(type)?60:0;
  return 35+(complexity*25)+typeExtra;
}
function worksheetQuestionDifficulty(question){
  const c=Math.max(1,Math.min(5,Number(question?.complexity||question?.difficulty)||2));
  return ['','Easy','Easy–Medium','Medium','Hard','Challenge'][c]||'Medium';
}
function normalizeWorksheetQuestion(question,index=0){
  const q=JSON.parse(JSON.stringify(question||{}));
  q.id=String(q.id||`custom-q-${Date.now()}-${index}`);
  q.prompt=String(q.prompt||'');
  q.type=q.type||'numeric';
  q.complexity=Math.max(1,Math.min(5,Number(q.complexity||q.difficulty)||2));
  q.xp=Math.max(4,Number(q.xp)||8);
  q.sourceTitle=String(q.sourceTitle||q.topic||'Question Bank');
  return q;
}
function selectedWorksheetQuestions(){
  return Array.isArray(worksheetBuilderDraft?.questions)?worksheetBuilderDraft.questions:[];
}
function saveWorksheetDraftLocal(title=''){
  if(!worksheetBuilderDraft)return null;
  const questions=selectedWorksheetQuestions();
  if(!questions.length)return null;
  const worksheet={
    id:worksheetBuilderDraft.id||`worksheet-${Date.now()}`,
    title:String(title||worksheetBuilderDraft.title||'Custom Worksheet').trim().slice(0,160)||'Custom Worksheet',
    yearLevel:Math.max(0,Math.min(12,Number(worksheetBuilderDraft.yearLevel)||9)),
    createdAt:worksheetBuilderDraft.createdAt||new Date().toISOString(),
    questions:questions.map(normalizeWorksheetQuestion),
  };
  worksheetBuilderDraft={...worksheet};
  const existing=(state.customWorksheets||[]).filter(w=>w.id!==worksheet.id);
  persist({...state,customWorksheets:[...existing,worksheet].slice(-100)},{quiet:true});
  return worksheet;
}
function renderCustomWorksheetBuilder(){
  if(!worksheetBuilderDraft)worksheetBuilderDraft={id:`worksheet-${Date.now()}`,title:'Custom Worksheet',yearLevel:normaliseYearLevel(account.profile?.yearLevel),topicFilter:'all',createdAt:new Date().toISOString(),questions:[]};
  const year=Math.max(0,Math.min(12,Number(worksheetBuilderDraft.yearLevel)||9));
  const topics=[...new Set(getCurriculumSkills({yearLevel:year}).map(x=>x.topic))].sort();
  const topicFilter=topics.includes(worksheetBuilderDraft.topicFilter)?worksheetBuilderDraft.topicFilter:'all';
  worksheetBuilderDraft.topicFilter=topicFilter;
  const rawTasks=searchTaskLibrary({yearLevel:year,topic:topicFilter,type:'practice',difficulty:'mixed',limit:80});
  const seenSkills=new Set();
  const candidateTasks=[];
  for(const task of rawTasks){
    const key=String(task.skillId||task.skill||task.topic||task.id);
    if(seenSkills.has(key))continue;
    seenSkills.add(key);candidateTasks.push(task);
    if(candidateTasks.length>=12)break;
  }
  const bank=[];
  candidateTasks.forEach((task,ti)=>{
    const seed=(year*10000)+(ti*97)+17;
    generateTaskQuestions(task,2,{seedOffset:seed}).forEach((q,qi)=>bank.push({task,question:normalizeWorksheetQuestion({...q,sourceTitle:task.skill||task.title},qi),seed,qi}));
  });
  const questions=selectedWorksheetQuestions();
  const classes=teacherHubClasses.filter(c=>!c.archived);
  const totalSeconds=questions.reduce((n,q)=>n+worksheetQuestionSeconds(q),0);
  openSimpleModal('Custom Worksheet Builder',`
    <div class="v84-builder">
      <div class="v84-builder-head">
        <div><span class="eyebrow">Individual question editor</span><h3>${escapeHtml(worksheetBuilderDraft.title||'Custom Worksheet')}</h3><p>Pick exact questions, keep only one part of a multi-part question, combine topics and drag the order with the arrow controls.</p></div>
        <div class="v84-builder-filters"><label>Year<select id="worksheet-builder-year">${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<option value="${value}" ${value===year?'selected':''}>${label}</option>`).join('')}</select></label><label>Topic<select id="worksheet-builder-topic"><option value="all">All topics</option>${topics.map(topic=>`<option value="${escapeHtml(topic)}" ${topicFilter===topic?'selected':''}>${escapeHtml(topic)}</option>`).join('')}</select></label></div>
      </div>
      <div class="v84-bank-meta"><strong>${bank.length}</strong> individual questions shown <span>Difficulty and estimated time are listed before you add them.</span></div>
      <div class="v84-bank-grid">
        ${bank.map(({task,question,seed,qi})=>`<article class="v84-bank-card"><small>Year ${task.yearLevel} · ${escapeHtml(task.topic)}</small><strong>${mathHtml(question.prompt)}</strong><span>${worksheetQuestionDifficulty(question)} · ~${worksheetQuestionSeconds(question)} sec · ${escapeHtml(task.skill)}</span>${Array.isArray(question.parts)&&question.parts.length?`<em>${question.parts.length}-part question</em>`:''}<button class="btn secondary small" data-action="worksheet-add-question" data-task-id="${escapeHtml(task.id)}" data-seed="${seed}" data-question-index="${qi}">Add question</button></article>`).join('')||'<div class="school-empty">No questions match this year/topic yet.</div>'}
      </div>
      <section class="v84-selected-questions">
        <div class="section-heading"><div><span class="eyebrow">Worksheet</span><h3>${questions.length} selected question${questions.length===1?'':'s'}</h3></div><span>~${Math.max(1,Math.round(totalSeconds/60))} min</span></div>
        ${questions.length?questions.map((q,i)=>`<article class="v84-question-row">
          <div class="v84-question-number">${i+1}</div>
          <div class="v84-question-copy"><strong>${mathHtml(q.prompt)}</strong><small>${escapeHtml(q.sourceTitle||q.topic||'Question Bank')} · ${worksheetQuestionDifficulty(q)} · ~${worksheetQuestionSeconds(q)} sec</small>
          ${Array.isArray(q.parts)&&q.parts.length?`<div class="v84-part-actions"><span>Use only:</span>${q.parts.map((part,pi)=>`<button class="btn ghost small" data-action="worksheet-use-part" data-index="${i}" data-part="${pi}">${escapeHtml(part.label||`Part ${pi+1}`)}</button>`).join('')}</div>`:''}</div>
          <div class="v84-order-actions"><button class="btn ghost small" data-action="worksheet-move-question" data-index="${i}" data-direction="-1" ${i===0?'disabled':''}>↑</button><button class="btn ghost small" data-action="worksheet-move-question" data-index="${i}" data-direction="1" ${i===questions.length-1?'disabled':''}>↓</button><button class="btn danger small" data-action="worksheet-remove-question" data-index="${i}">Remove</button></div>
        </article>`).join(''):'<div class="school-empty">Add individual questions from the bank above.</div>'}
      </section>
      <form id="custom-worksheet-assign-form" class="school-form v84-builder-form">
        <label>Worksheet title<input id="worksheet-builder-title" name="title" value="${escapeHtml(worksheetBuilderDraft.title||'Custom Worksheet')}" required maxlength="160"></label>
        <div class="form-two"><label>Class<select name="classId" required><option value="">Choose a class</option>${classes.map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join('')}</select></label><label>Due date<input name="dueAt" type="datetime-local" value="${localInputDateTime(7)}"></label></div>
        <div class="simple-actions"><button class="btn secondary" type="button" data-action="save-custom-worksheet">Save worksheet</button><button class="btn primary" type="submit" ${questions.length?'':'disabled'}>Save & assign</button></div>
      </form>
    </div>`);
}
function openCustomWorksheetBuilder(){
  worksheetBuilderDraft={id:`worksheet-${Date.now()}`,title:'Custom Worksheet',yearLevel:normaliseYearLevel(account.profile?.yearLevel),topicFilter:'all',createdAt:new Date().toISOString(),questions:[]};
  renderCustomWorksheetBuilder();
}
function startAssignedCustomWorksheet(assignment){
  clearAiChatHistoryForNewQuestion();
  const custom=assignment?.config?.custom_worksheet;
  const rawQuestions=Array.isArray(custom?.questions)?custom.questions:[];
  if(!rawQuestions.length)return false;
  const questions=rawQuestions.map(normalizeWorksheetQuestion);
  const task={
    id:`custom:${custom.id||assignment.id}`,title:custom.title||assignment.title||'Custom Worksheet',skill:custom.title||'Custom Worksheet',
    learningGoal:'Complete the teacher-selected questions and show accurate mathematical working.',yearLevel:Number(custom.yearLevel||account.profile?.yearLevel)||9,
    pathway:'Teacher Custom',difficulty:'mixed',type:'worksheet',typeLabel:'Custom Worksheet',questionCount:questions.length,
    estimatedMinutes:Math.max(1,Math.round(questions.reduce((n,q)=>n+worksheetQuestionSeconds(q),0)/60)),masteryTarget:70,strand:'Mixed',topic:'Custom Worksheet',skillId:`custom:${custom.id||assignment.id}`,
  };
  currentLesson=null;
  if(activeSchoolAssignment){activeSchoolAssignment.customWorksheet=custom;saveActiveAssignmentSession();}
  currentGeneratedTask={task,runSeed:Date.now(),questions,index:0,current:questions[0]||null,answered:0,correct:0,attempts:0,hintCount:0,selectedChoice:'',feedback:null,attemptHistory:[],questionResults:[],complete:questions.length===0,startedAt:Date.now()};
  go('assignment',task.id);
  return true;
}
function openTaskGroupsModal(assignmentId){
  const assignment=(lastTeacherReport?.assignments||[]).find(a=>String(a.id)===String(assignmentId));
  if(!assignment)return showToast('Assignment unavailable','Open the class report again.');
  const students=lastTeacherReport?.students||[];
  const existing=Array.isArray(assignment.config?.task_groups)?assignment.config.task_groups:[];
  const groups=Array.from({length:4},(_,i)=>existing[i]||{name:`Group ${i+1}`,studentIds:[],startAt:'',dueAt:assignment.due_at||''});
  const dt=(value)=>{if(!value)return'';const d=new Date(value);if(Number.isNaN(d.getTime()))return'';const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`};
  openSimpleModal('Task Groups',`<form id="task-groups-form" class="school-form v84-task-groups"><input type="hidden" name="assignmentId" value="${escapeHtml(assignment.id)}"><p>Keep one assignment and one combined report, while each student group can have its own start and due dates.</p>${groups.map((g,i)=>`<fieldset><legend>Group ${i+1}</legend><label>Name<input name="g${i}Name" value="${escapeHtml(g.name||`Group ${i+1}`)}"></label><div class="form-two"><label>Start<input name="g${i}Start" type="datetime-local" value="${escapeHtml(dt(g.startAt||g.start_at))}"></label><label>Due<input name="g${i}Due" type="datetime-local" value="${escapeHtml(dt(g.dueAt||g.due_at||assignment.due_at))}"></label></div><div class="v84-student-picker">${students.map(st=>`<label><input type="checkbox" name="g${i}Students" value="${escapeHtml(st.user_id)}" ${(g.studentIds||g.student_ids||[]).map(String).includes(String(st.user_id))?'checked':''}> ${escapeHtml(st.display_name||st.email||'Student')}</label>`).join('')}</div></fieldset>`).join('')}<button class="btn primary" type="submit">Save task groups</button></form>`);
}
async function openMasteryEvidenceModal(studentId,skillId,studentName='Student'){
  openSimpleModal('Mastery evidence','<div class="school-loading"><span class="spinner"></span><strong>Loading exact question evidence…</strong></div>');
  try{
    const rows=await getSchoolClient().masteryEvidence(selectedTeacherClassId,studentId,skillId);
    const evidence=Array.isArray(rows)?rows:Array.isArray(rows?.evidence)?rows.evidence:[];
    openSimpleModal(`Mastery evidence · ${studentName}`,`<p class="muted">These are the question responses behind this mastery cell.</p><div class="v84-evidence-list">${evidence.length?evidence.map((r,i)=>`<article><div><span class="feedback-status ${r.correct?'success':''}">${r.correct?'Correct':'Incorrect'}</span><small>${escapeHtml(r.created_at?new Date(r.created_at).toLocaleString():'')}</small></div><strong>${escapeHtml(r.question_prompt||r.prompt||r.question_id||`Question ${i+1}`)}</strong><p><b>Student response:</b> ${escapeHtml(r.answer_text??r.answer??'')}</p>${r.score_possible!=null?`<small>Marks: ${Number(r.score_awarded||0)} / ${Number(r.score_possible||0)} · retries ${Number(r.retries||0)}</small>`:''}</article>`).join(''):'<div class="school-empty">No question-level evidence has been recorded for this skill yet.</div>'}</div>`);
  }catch(error){openSimpleModal('Mastery evidence',`<div class="school-error"><strong>Evidence could not load.</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`);}
}
function openCourseProgressReport(){
  if(!lastTeacherReport)return showToast('Open a class first','Course Progress uses the current class data.');
  const year=Math.max(0,Math.min(12,Number(lastTeacherReport.class?.year_level)||9));
  const totalSkills=Math.max(1,getCurriculumSkills({yearLevel:year}).length);
  const rows=(lastTeacherReport.students||[]).map(student=>{
    const m=(lastTeacherReport.mastery||[]).filter(x=>String(x.student_id)===String(student.user_id));
    const mastered=m.filter(x=>Number(x.mastery)>=80).length;
    const avg=m.length?Math.round(m.reduce((n,x)=>n+Number(x.mastery||0),0)/m.length):0;
    const coverage=Math.min(100,Math.round(100*mastered/totalSkills));
    const projected=Math.min(100,Math.round(coverage+(avg/100)*(100-coverage)*0.25));
    const category=coverage>=75?'Course nearly complete':coverage>=45?'On pace':coverage>=20?'Building progress':'Early in course';
    return {student,avg,coverage,projected,category};
  });
  openSimpleModal('Course Progress',`<p class="muted">Progress is estimated from mastered curriculum skills and current mastery evidence. It is a guide, not a final grade.</p><div class="v84-report-table"><div class="v84-report-row head"><span>Student</span><span>Course complete</span><span>Projected</span><span>Category</span></div>${rows.map(r=>`<div class="v84-report-row"><strong>${escapeHtml(r.student.display_name||'Student')}</strong><span>${r.coverage}%</span><span>${r.projected}%</span><span>${escapeHtml(r.category)}</span></div>`).join('')}</div>`);
}
function openGroupedTaskReport(){
  if(!lastTeacherReport)return showToast('Open a class first','Grouped reporting uses the current class.');
  const attempts=lastTeacherReport.attempts||[];
  const assignments=(lastTeacherReport.assignments||[]).filter(a=>Array.isArray(a.config?.task_groups)&&a.config.task_groups.length);
  const groupNames=[...new Set(assignments.flatMap(a=>a.config.task_groups.map(g=>String(g.name||'Group'))))].sort();
  if(groupedReportGroupFilter!=='all'&&!groupNames.includes(groupedReportGroupFilter))groupedReportGroupFilter='all';
  const sections=assignments.map(a=>{
    const lines=a.config.task_groups.filter(g=>groupedReportGroupFilter==='all'||String(g.name||'Group')===groupedReportGroupFilter).map(g=>{
      const ids=(g.studentIds||g.student_ids||[]).map(String);
      const ar=attempts.filter(x=>String(x.assignment_id)===String(a.id)&&ids.includes(String(x.student_id)));
      const avg=ar.length?Math.round(ar.reduce((n,x)=>n+Number(x.score_percent||0),0)/ar.length):0;
      const completed=ar.filter(x=>x.completed_at).length;
      return `<div class="v84-group-line"><strong>${escapeHtml(g.name||'Group')}</strong><span>${ids.length} students</span><span>${ar.length?`${avg}% average · ${completed} completed`:'No results yet'}</span><small>${escapeHtml(formatSchoolDate(g.dueAt||g.due_at||a.due_at))}</small></div>`;
    }).join('');
    return lines?`<section><h3>${escapeHtml(a.title)}</h3>${lines}</section>`:'';
  }).filter(Boolean).join('');
  openSimpleModal('Grouped Task Reports',assignments.length?`<div class="v84-group-report-toolbar"><label>Filter group<select id="group-report-filter"><option value="all">All groups</option>${groupNames.map(name=>`<option value="${escapeHtml(name)}" ${groupedReportGroupFilter===name?'selected':''}>${escapeHtml(name)}</option>`).join('')}</select></label><span>All groups stay inside the same assignment result set.</span></div><div class="v84-group-report">${sections||'<div class="school-empty">No results match this group filter.</div>'}</div>`:'<div class="school-empty">No assignments use Task Groups yet.</div>');
}
async function openYearOverYearAnalytics(){
  const context=lastSchoolReportContext;
  if(!context)return showToast('Open School Reports first','Year-over-year analytics needs the selected school.');
  openSimpleModal('Year-over-Year School Analytics','<div class="school-loading"><span class="spinner"></span><strong>Building historical comparison…</strong></div>');
  try{
    const assignments=context.allAssignments||[];
    const reports=await Promise.all((context.classes||[]).map(c=>getSchoolClient().classDashboard(c.id).catch(()=>null)));
    const attempts=reports.flatMap(r=>Array.isArray(r?.attempts)?r.attempts:[]);
    const assignmentById=new Map(assignments.map(a=>[String(a.id),a]));
    const byYear=new Map();
    const byMonth=new Map();
    for(const a of assignments){
      const d=new Date(a.created_at||a.due_at||Date.now()); if(Number.isNaN(d.getTime()))continue;
      const y=d.getFullYear(), key=`${y}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const yr=byYear.get(y)||{year:y,assignments:0,questionSlots:0,attempts:0,scores:[]};yr.assignments++;yr.questionSlots+=Number(a.question_count)||0;byYear.set(y,yr);
      const mo=byMonth.get(key)||{key,label:d.toLocaleDateString(undefined,{month:'short',year:'numeric'}),assignments:0,attempts:0,scores:[]};mo.assignments++;byMonth.set(key,mo);
    }
    for(const attempt of attempts){
      const a=assignmentById.get(String(attempt.assignment_id)); if(!a)continue;
      const d=new Date(a.created_at||a.due_at||Date.now()); if(Number.isNaN(d.getTime()))continue;
      const y=d.getFullYear(), key=`${y}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const score=Number(attempt.score_percent);
      const yr=byYear.get(y)||{year:y,assignments:0,questionSlots:0,attempts:0,scores:[]};yr.attempts++;if(Number.isFinite(score))yr.scores.push(score);byYear.set(y,yr);
      const mo=byMonth.get(key)||{key,label:d.toLocaleDateString(undefined,{month:'short',year:'numeric'}),assignments:0,attempts:0,scores:[]};mo.attempts++;if(Number.isFinite(score))mo.scores.push(score);byMonth.set(key,mo);
    }
    const years=[...byYear.values()].sort((a,b)=>b.year-a.year);
    const months=[...byMonth.values()].sort((a,b)=>a.key.localeCompare(b.key)).slice(-24);
    const yearCards=years.map((r,i)=>{const prev=years[i+1];const avg=r.scores.length?Math.round(r.scores.reduce((n,v)=>n+v,0)/r.scores.length):0;const delta=prev?Math.round(100*(r.assignments-prev.assignments)/Math.max(1,prev.assignments)):null;return `<article><small>${r.year}</small><strong>${r.assignments}</strong><span>assignments · ${r.attempts} submissions</span><b>${r.questionSlots.toLocaleString()} question slots · ${avg}% avg result</b>${delta==null?'<em>First year of available data</em>':`<em>${delta>=0?'+':''}${delta}% assignments vs ${prev.year}</em>`}</article>`}).join('');
    const monthRows=months.map(m=>{const avg=m.scores.length?Math.round(m.scores.reduce((n,v)=>n+v,0)/m.scores.length):0;return `<div class="v84-month-row"><strong>${escapeHtml(m.label)}</strong><span>${m.assignments} assignments</span><span>${m.attempts} submissions</span><span>${m.scores.length?`${avg}% average`:'No scored work'}</span></div>`}).join('');
    openSimpleModal('Year-over-Year School Analytics',`<p class="muted">Compares assignment usage and submitted performance from the historical data stored for this school.</p><div class="v84-yoy-grid">${yearCards||'<div class="school-empty">Historical data will appear as the school uses MathsExpress.</div>'}</div>${months.length?`<h3 class="v84-subheading">Monthly comparison</h3><div class="v84-month-table">${monthRows}</div>`:''}`);
  }catch(error){openSimpleModal('Year-over-Year School Analytics',`<div class="school-error"><strong>Historical analytics could not load.</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`);}
}
async function openSchoolUsageDashboard(){
  const schoolId=selectedSchoolId||lastSchoolReportContext?.selectedSchool?.id||'';
  if(!schoolId)return showToast('Choose a school','Open a school first.');
  openSimpleModal('School Usage','<div class="school-loading"><span class="spinner"></span><strong>Loading school usage…</strong></div>');
  try{
    const end=new Date(),start=new Date(Date.now()-schoolUsageRangeDays*86400000);
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_school_usage_dashboard',{p_school_id:String(schoolId),p_start_at:start.toISOString(),p_end_at:end.toISOString()});if(error)throw error;
    const counts=data?.counts||{},daily=Array.isArray(data?.daily)?data.daily:[],classes=Array.isArray(data?.classes)?data.classes:[];
    const maxQ=Math.max(1,...daily.map(x=>Number(x.questions)||0));
    openSimpleModal('School Usage',`<div class="report-filter-row"><label>Range<select data-action="school-usage-range"><option value="7" ${schoolUsageRangeDays===7?'selected':''}>7 days</option><option value="30" ${schoolUsageRangeDays===30?'selected':''}>30 days</option><option value="90" ${schoolUsageRangeDays===90?'selected':''}>90 days</option><option value="365" ${schoolUsageRangeDays===365?'selected':''}>1 year</option></select></label></div><div class="teacher-metrics"><article><span>Students</span><strong>${Number(counts.students)||0}</strong></article><article><span>Active</span><strong>${Number(counts.active_students)||0}</strong></article><article><span>Questions</span><strong>${Number(counts.questions||0).toLocaleString()}</strong></article><article><span>Learning time</span><strong>${Math.round(Number(counts.active_seconds||0)/3600)}h</strong></article></div><h3>Daily usage</h3><div class="school-usage-chart">${daily.map(d=>`<article><i style="height:${Math.max(3,Math.round(145*(Number(d.questions)||0)/maxQ))}px"></i><b>${Number(d.questions)||0}</b><small>${new Date(d.activity_day).toLocaleDateString(undefined,{day:'numeric',month:'short'})}</small></article>`).join('')||'<div class="school-empty">No usage in this period.</div>'}</div><h3>Class performance</h3><div class="standards-growth-table"><div class="standards-growth-row head"><b>Class</b><b>Active</b><b>Questions</b><b>Accuracy</b><b>Completion</b><b>Average</b></div>${classes.map(c=>`<div class="standards-growth-row"><span>${escapeHtml(c.name||'Class')}</span><span>${Number(c.active_students)||0}/${Number(c.students)||0}</span><span>${Number(c.questions||0).toLocaleString()}</span><span>${Math.round(Number(c.accuracy)||0)}%</span><span>${Math.round(Number(c.completion)||0)}%</span><strong>${Math.round(Number(c.avg_score)||0)}%</strong></div>`).join('')||'<div class="school-empty">No class data yet.</div>'}</div>`);
  }catch(error){openSimpleModal('School Usage',`<div class="school-error"><strong>Usage report could not load.</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`)}
}

async function openEngagementClassComparison(){
  const schoolId=selectedSchoolId||lastSchoolReportContext?.selectedSchool?.id||'';
  if(!schoolId)return showToast('Choose a school','Open a school first.');
  openSimpleModal('Engagement · class comparison','<div class="school-loading"><span class="spinner"></span><strong>Comparing classes…</strong></div>');
  try{
    const end=new Date(),start=new Date(Date.now()-schoolUsageRangeDays*86400000);
    const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_engagement_class_comparison',{p_school_id:String(schoolId),p_start_at:start.toISOString(),p_end_at:end.toISOString()});if(error)throw error;
    const rows=Array.isArray(data?.classes)?data.classes:[];
    openSimpleModal('Engagement · class comparison',`<p class="muted">MathsExpress compares participation, practice volume, accuracy and completion using a transparent calculation. It does not claim to reproduce Mathspace's private formula.</p><div class="class-comparison-grid">${rows.map(r=>`<article class="class-comparison-card"><header><div><strong>${escapeHtml(r.name||'Class')}</strong><small>${escapeHtml(yearLabel(r.year_level))} · ${Number(r.students)||0} students</small></div><b>${Math.round(Number(r.avg_score)||0)}%</b></header><div class="dual-meter"><span><small>Participation</small><i><b style="width:${Math.min(100,Number(r.participation)||0)}%"></b></i><em>${Math.round(Number(r.participation)||0)}%</em></span><span><small>Practice</small><i><b style="width:${Math.min(100,Number(r.practice)||0)}%"></b></i><em>${Math.round(Number(r.practice)||0)}%</em></span><span><small>Accuracy</small><i><b style="width:${Math.min(100,Number(r.accuracy)||0)}%"></b></i><em>${Math.round(Number(r.accuracy)||0)}%</em></span><span><small>Completion</small><i><b style="width:${Math.min(100,Number(r.completion)||0)}%"></b></i><em>${Math.round(Number(r.completion)||0)}%</em></span></div><small>${Number(r.questions)||0} questions · ${Math.round(Number(r.active_seconds||0)/3600)}h active</small></article>`).join('')||'<div class="school-empty">No class evidence yet.</div>'}</div>`);
  }catch(error){showToast('Class comparison unavailable',error.message||'Try again.');}
}

function actualTaskQuestions(assignment){
  const custom=assignment?.config?.custom_worksheet?.questions;
  if(Array.isArray(custom)&&custom.length)return custom.slice(0,Math.max(1,Number(assignment.question_count)||custom.length));
  const ids=Array.isArray(assignment?.question_ids)?assignment.question_ids:[];
  const direct=ids.map(id=>getQuestionById(String(id))).filter(Boolean);if(direct.length)return direct;
  const taskId=String(assignment?.config?.task_library_id||'');const task=taskId?getTaskById(taskId):null;const seed=Number(assignment?.config?.question_seed)||0;
  if(task&&seed){try{return createUniqueGeneratedTaskRun({...task,questionCount:Number(assignment.question_count)||10},{runSeed:seed,avoidHistory:false}).questions||[]}catch{}}
  return [];
}
function printActualTask(assignmentId){
  const a=(activeTaskReport?.assignment&&String(activeTaskReport.assignment.id)===String(assignmentId)?activeTaskReport.assignment:null) || (lastTeacherReport?.assignments||[]).find(x=>String(x.id)===String(assignmentId));
  if(!a)return showToast('Task unavailable','Open the class report again.');
  const questions=actualTaskQuestions(a);if(!questions.length)return showToast('Exact task unavailable','This older task does not contain enough saved question data to reconstruct the task exactly.');
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(a.title||'MathsExpress task')}</title><style>body{font-family:Arial,sans-serif;color:#111;padding:36px;max-width:900px;margin:auto}h1{margin:0}.meta{color:#555;margin:8px 0 28px}.q{break-inside:avoid;margin:0 0 24px;padding:0 0 18px;border-bottom:1px solid #ddd}.q h3{font-size:16px;margin:0 0 12px}.options{display:grid;grid-template-columns:1fr 1fr;gap:8px}.option{padding:8px;border:1px solid #ccc;border-radius:6px}.working{height:70px;border-bottom:1px solid #bbb;margin-top:14px}@media print{button{display:none}}</style></head><body><h1>${escapeHtml(a.title||'MathsExpress task')}</h1><div class="meta">${escapeHtml(a.assignment_type||'practice')} · ${questions.length} questions · Name: ____________________</div>${questions.map((q,i)=>`<section class="q"><h3>${i+1}. ${escapeHtml(String(q.prompt||q.question||'Question'))}</h3>${Array.isArray(q.options)&&q.options.length?`<div class="options">${q.options.map((o,j)=>`<div class="option">${String.fromCharCode(65+j)}. ${escapeHtml(String(o.label??o.text??o.value??o))}</div>`).join('')}</div>`:''}<div class="working"></div></section>`).join('')}<script>window.onload=()=>window.print()<\/script></body></html>`;
  const win=window.open('','_blank','noopener,noreferrer');if(!win)return showToast('Pop-up blocked','Allow pop-ups to print this task.');win.document.write(html);win.document.close();
}

async function openAuthoredQuestionStudio(){
  const schoolId=selectedSchoolId||lastSchoolReportContext?.selectedSchool?.id||null;
  openSimpleModal('Reviewed Question Studio','<div class="school-loading"><span class="spinner"></span><strong>Loading authored questions…</strong></div>');
  try{
    const [statsRes,listRes]=await Promise.all([
      accountClient.ensureClient().rpc('mathsexpress_authored_question_stats',{p_school_id:schoolId}),
      accountClient.ensureClient().rpc('mathsexpress_list_authored_questions',{p_school_id:schoolId,p_status:null,p_limit:80})
    ]);if(statsRes.error)throw statsRes.error;if(listRes.error)throw listRes.error;
    const data=statsRes.data||{},rows=Array.isArray(listRes.data)?listRes.data:[];const reviewer=['owner','admin','content_editor'].includes(account.profile?.role);
    openSimpleModal('Reviewed Question Studio',`<div class="teacher-metrics"><article><span>Published</span><strong>${Number(data?.published)||0}</strong></article><article><span>In review</span><strong>${Number(data?.review)||0}</strong></article><article><span>Drafts</span><strong>${Number(data?.draft)||0}</strong></article><article><span>Total authored</span><strong>${Number(data?.total)||0}</strong></article></div><div class="status-banner"><b>Human-authored content stays separate from generated questions.</b><p>Teachers can author questions and submit them for review. Published status means a real person reviewed the item; generated questions are never relabelled as professionally authored.</p></div><form id="authored-question-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId||'')}"><div class="form-two"><label>Year<select name="year">${YEAR_LEVEL_OPTIONS.map(o=>`<option value="${o.value}">${escapeHtml(o.label)}</option>`).join('')}</select></label><label>Difficulty<select name="difficulty"><option>easy</option><option selected>medium</option><option>hard</option></select></label></div><div class="form-two"><label>Strand<input name="strand" placeholder="Algebra" required></label><label>Topic<input name="topic" placeholder="Linear equations" required></label></div><label>Skill ID (optional)<input name="skillId" placeholder="solve-linear-equations"></label><label>Question type<select name="questionType"><option value="numeric">Numeric</option><option value="short-answer">Short answer</option><option value="multiple-choice">Multiple choice</option><option value="written-response">Written response</option></select></label><label>Question prompt<textarea name="prompt" rows="3" required></textarea></label><label>Answer<textarea name="answer" rows="2" placeholder="Correct answer or marking key" required></textarea></label><label>Worked solution<textarea name="workedSolution" rows="3"></textarea></label><label>Source / author note<input name="sourceLabel" placeholder="Original MathsExpress authoring"></label><label class="check-row"><input type="checkbox" name="submitReview" checked> Submit for review</label><button class="btn primary" type="submit">Save authored question</button></form><h3>Recent authored questions</h3><div class="authored-question-list">${rows.map(q=>`<article><header><div><strong>${escapeHtml(q.topic||q.strand||'Question')}</strong><small>${escapeHtml(yearLabel(q.year_level))} · ${escapeHtml(q.difficulty||'medium')} · ${escapeHtml(q.author_name||'Author')}</small></div><span class="tag ${q.status==='published'?'green':q.status==='review'?'amber':'muted'}">${escapeHtml(q.status||'draft')}</span></header><p>${escapeHtml(q.prompt||'')}</p>${reviewer?`<div class="simple-actions"><button class="btn ghost small" data-action="review-authored-question" data-question-id="${escapeHtml(q.id)}" data-status="published">Publish</button><button class="btn ghost small" data-action="review-authored-question" data-question-id="${escapeHtml(q.id)}" data-status="review">Needs review</button><button class="btn ghost small" data-action="review-authored-question" data-question-id="${escapeHtml(q.id)}" data-status="archived">Archive</button></div>`:''}</article>`).join('')||'<div class="school-empty">No authored questions yet.</div>'}</div>`);
  }catch(error){showToast('Question Studio unavailable',error.message||'Try again.');}
}

async function openCanvasAutomaticPassback(){
  const cls=lastTeacherReport?.class||teacherHubClasses.find(c=>String(c.id)===String(selectedTeacherClassId));
  const assignments=lastTeacherReport?.assignments||[];const students=lastTeacherReport?.students||[];
  openSimpleModal('Automatic Canvas grade passback',`<div class="status-banner"><b>How automatic passback works</b><p>Map a MathsExpress assignment and student to Canvas IDs once. When the MathsExpress attempt completes, its score is queued automatically for Canvas.</p></div>${assignments.length?`<form id="canvas-auto-assignment-map-form" class="school-form"><label>MathsExpress assignment<select name="assignmentId">${assignments.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(a.title)}</option>`).join('')}</select></label><div class="form-two"><label>Canvas course ID<input name="courseId" required></label><label>Canvas assignment ID<input name="canvasAssignmentId" required></label></div><label class="check-row"><input type="checkbox" name="auto" checked> Automatically queue completed scores</label><button class="btn primary" type="submit">Save assignment mapping</button></form>`:'<p class="muted">Open a class report first to map assignments.</p>'}${students.length?`<form id="canvas-auto-user-map-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(cls?.school_id||selectedSchoolId||'')}"><label>Student<select name="studentId">${students.map(st=>`<option value="${escapeHtml(st.user_id)}">${escapeHtml(st.display_name||st.email||'Student')}</option>`).join('')}</select></label><label>Canvas user ID<input name="canvasUserId" required></label><button class="btn secondary" type="submit">Save student mapping</button></form>`:''}<div class="simple-modal-actions"><button class="btn primary" type="button" data-action="sync-canvas-grade-queue">Send queued grades now</button><button class="btn secondary" type="button" data-action="view-canvas-grade-queue">View queue</button></div><p class="muted">The queue becomes fully automatic when the deployment has a scheduled grade-sync function plus Canvas grading credentials. Manual “send one grade” remains available as a fallback.</p>`);
}

async function viewCanvasGradeQueue(){
  const schoolId=selectedSchoolId||lastTeacherReport?.class?.school_id||'';if(!schoolId)return showToast('Choose a school','Open a school first.');
  const {data,error}=await accountClient.ensureClient().rpc('mathsexpress_canvas_grade_queue',{p_school_id:String(schoolId),p_limit:100});if(error)throw error;const rows=Array.isArray(data)?data:[];
  openSimpleModal('Canvas grade queue',`<div class="simple-list">${rows.map(r=>`<div><strong>${escapeHtml(r.assignment_title||'Assignment')} · ${escapeHtml(r.student_name||'Student')}</strong><span>${Math.round(Number(r.score_percent)||0)}% · ${escapeHtml(r.status||'queued')}${r.last_error?` · ${escapeHtml(r.last_error)}`:''}</span></div>`).join('')||'<div class="school-empty">No queued Canvas grades.</div>'}</div><div class="simple-modal-actions"><button class="btn primary" data-action="sync-canvas-grade-queue">Send queued grades</button></div>`);
}
async function syncCanvasGradeQueue(){
  const schoolId=selectedSchoolId||lastTeacherReport?.class?.school_id||'';if(!schoolId)return showToast('Choose a school','Open a school first.');
  try{showToast('Canvas sync','Sending queued grades…');const data=await integrationRequest('canvas_grade_queue_sync','canvas',{schoolId});showToast('Canvas grades synced',`${Number(data.sent)||0} sent · ${Number(data.failed)||0} failed · ${Number(data.skipped)||0} skipped.`,'success');void viewCanvasGradeQueue();}catch(error){showToast('Canvas grade sync failed',error.message||'Check Canvas credentials and mappings.');}
}


async function openDistrictDashboard(){
  openSimpleModal('District Reporting','<div class="school-loading"><span class="spinner"></span><strong>Loading district analytics…</strong></div>');
  try{
    const districts=await getSchoolClient().listMyDistricts();
    if(!districts.length){
      const canCreate=['owner','admin','district_admin'].includes(account.profile?.role);
      return openSimpleModal('District Reporting',canCreate?`<form id="district-create-form" class="school-form"><p>Create a district above your schools, then view Usage, Performance, Growth and Course Progress together.</p><label>District name<input name="name" placeholder="MathsExpress District" required></label><fieldset><legend>Schools</legend><div class="v84-student-picker">${schoolHubSchools.map(sc=>`<label><input type="checkbox" name="schoolIds" value="${escapeHtml(sc.id)}" checked> ${escapeHtml(sc.name)}</label>`).join('')}</div></fieldset><button class="btn primary" type="submit">Create district</button></form>`:'<div class="school-empty">Your account is not attached to a district yet.</div>');
    }
    const chosen=districts[0],endDate=new Date(),startDate=new Date(Date.now()-districtRangeDays*86400000);
    const [basic,analyticsResult]=await Promise.all([getSchoolClient().districtDashboard(chosen.id),accountClient.ensureClient().rpc('mathsexpress_district_analytics',{p_district_id:String(chosen.id),p_start_at:startDate.toISOString(),p_end_at:endDate.toISOString()}).catch(error=>({data:{schools:[],monthly:[]},error}))]);
    const data=analyticsResult?.data||{schools:[],monthly:[]};const allSchools=Array.isArray(data.schools)?data.schools:[];const allMonthly=Array.isArray(data.monthly)?data.monthly:[];const schools=districtSchoolFilter==='all'?allSchools:allSchools.filter(x=>String(x.id)===String(districtSchoolFilter));const monthly=(districtYearFilter==='all'?allMonthly:allMonthly.filter(x=>String(x.year_level)===String(districtYearFilter)));
    const maxQuestions=Math.max(1,...schools.map(x=>Number(x.questions)||0));const maxMonthly=Math.max(1,...monthly.map(x=>Number(x.avg_score)||0));
    const years=[...new Set(allMonthly.map(x=>String(x.year_level)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));const tabs=`<div class="district-report-controls"><label>Range<select data-action="district-range"><option value="30" ${districtRangeDays===30?'selected':''}>30 days</option><option value="90" ${districtRangeDays===90?'selected':''}>90 days</option><option value="180" ${districtRangeDays===180?'selected':''}>6 months</option><option value="365" ${districtRangeDays===365?'selected':''}>1 year</option></select></label><label>School<select data-action="district-school-filter"><option value="all">All schools</option>${allSchools.map(sc=>`<option value="${escapeHtml(sc.id)}" ${String(districtSchoolFilter)===String(sc.id)?'selected':''}>${escapeHtml(sc.name||'School')}</option>`).join('')}</select></label><label>Year<select data-action="district-year-filter"><option value="all">All years</option>${years.map(y=>`<option value="${escapeHtml(y)}" ${String(districtYearFilter)===String(y)?'selected':''}>${escapeHtml(yearLabel(y))}</option>`).join('')}</select></label><div class="district-tab-row">${[['usage','Usage'],['performance','Performance'],['growth','Growth'],['progress','Course progress']].map(([id,label])=>`<button class="${districtActiveTab===id?'active':''}" data-action="district-tab" data-tab="${id}">${label}</button>`).join('')}</div></div>`;
    let body='';
    if(districtActiveTab==='usage')body=`<section><span class="eyebrow">Usage</span><h3>School activity</h3><div class="district-performance-chart">${schools.map(sc=>`<article><header><strong>${escapeHtml(sc.name||'School')}</strong><span>${Number(sc.active_students)||0}/${Number(sc.students)||0} active</span></header><div class="district-dual-bars"><i style="width:${Math.round(100*Number(sc.questions||0)/maxQuestions)}%"></i></div><small>${Number(sc.questions||0).toLocaleString()} questions · ${Math.round(Number(sc.active_seconds||0)/3600)}h active</small></article>`).join('')||'<div class="school-empty">No district usage yet.</div>'}</div></section>`;
    if(districtActiveTab==='performance')body=`<section><span class="eyebrow">Performance</span><h3>Results and completion</h3><div class="district-course-grid">${schools.map(sc=>`<article><strong>${Math.round(Number(sc.avg_score)||0)}%</strong><span>${escapeHtml(sc.name||'School')}</span><small>${Math.round(Number(sc.completion)||0)}% completion</small></article>`).join('')}</div></section>`;
    if(districtActiveTab==='growth')body=`<section><span class="eyebrow">Growth</span><h3>Monthly results by year level</h3><div class="district-monthly-chart">${monthly.map(m=>`<article><span>${new Date(m.month_start).toLocaleDateString(undefined,{month:'short',year:'2-digit'})}<small>${escapeHtml(yearLabel(m.year_level))}</small></span><i style="height:${Math.max(4,100*Number(m.avg_score||0)/maxMonthly)}%"></i><b>${Math.round(Number(m.avg_score)||0)}%</b></article>`).join('')||'<div class="school-empty">Monthly performance appears after submissions.</div>'}</div></section>`;
    if(districtActiveTab==='progress')body=`<section><span class="eyebrow">Course progress</span><h3>School mastery</h3><div class="district-course-grid">${schools.map(sc=>`<article><strong>${Math.round(Number(sc.course_progress)||0)}%</strong><span>${escapeHtml(sc.name||'School')}</span><small>${Number(sc.active_students)||0}/${Number(sc.students)||0} active</small></article>`).join('')}</div></section>`;
    openSimpleModal(`District · ${chosen.name||'Reporting'}`,`${tabs}<div class="teacher-metrics"><article><span>Schools</span><strong>${Number(basic?.counts?.schools||schools.length)}</strong></article><article><span>Students</span><strong>${Number(basic?.counts?.students||schools.reduce((n,x)=>n+Number(x.students||0),0))}</strong></article><article><span>Classes</span><strong>${Number(basic?.counts?.classes||schools.reduce((n,x)=>n+Number(x.classes||0),0))}</strong></article><article><span>Period</span><strong>${districtRangeDays}d</strong></article></div>${body}`);
  }catch(error){openSimpleModal('District Reporting',`<div class="school-error"><strong>District reporting could not load.</strong><p>${escapeHtml(error.message||'Try again.')}</p></div>`);}
}

async function integrationRequest(action,provider='',extra={}){
  const token=account.session?.access_token||accountClient.session?.access_token||'';
  const options={method:action==='status'?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:action==='status'?undefined:JSON.stringify({action,provider,...extra})};
  let lastError=null;
  for(const endpoint of ['/api/integrations','/.netlify/functions/integrations']){
    try{const res=await fetch(endpoint,options);const data=await res.json().catch(()=>({}));if(res.ok)return data;if(res.status!==404)throw new Error(data.error||'Integration request failed.');lastError=new Error(data.error||'Integration endpoint not found.');}catch(error){lastError=error;}
  }
  throw lastError||new Error('Integration request failed.');
}
async function openIntegrationCenter(){
  openSimpleModal('School integrations','<div class="school-loading"><span class="spinner"></span><strong>Checking provider connections…</strong></div>');
  try{
    const data=await integrationRequest('status'); const providers=data.providers||{};
    const cards=[
      ['canvas','Canvas API','Rosters and school data','live'],
      ['canvas_grade_passback','Canvas grade passback','Send MathsExpress scores into Canvas','grade'],
      ['canvas_lti','Canvas LTI 1.3','LMS launch, deep-linking and Advantage readiness','external'],
      ['canvas_sso','Canvas OAuth SSO','Canvas sign-in registration readiness','external'],
      ['clever','Clever rostering','District sections and student rosters','live'],
      ['clever_sso','Clever SSO','OAuth/OIDC login readiness','external'],
      ['saml','SAML SSO','School identity-provider readiness','external'],
      ['schoolsplp','SchoolsPLP OneRoster','Partner-issued OneRoster roster sync','live']
    ];
    openSimpleModal('School integrations',`<div class="simple-modal-actions"><button class="btn secondary small" data-action="open-integration-readiness">Production readiness</button></div><p class="muted">Secrets stay on the server. Live roster and Canvas grade actions only activate when provider-issued credentials are configured.</p><div class="v84-integration-grid">${cards.map(([id,name,desc,kind])=>{const pr=providers[id]||{};let controls='';if(id==='canvas'&&pr.configured)controls=`<button class="btn ghost small" data-action="preview-integration-roster" data-provider="canvas">Preview roster</button><button class="btn primary small" data-action="sync-integration-roster" data-provider="canvas">Sync now</button>`;if(id==='clever'&&pr.configured)controls=`<button class="btn ghost small" data-action="preview-integration-roster" data-provider="clever">Preview roster</button><button class="btn primary small" data-action="sync-integration-roster" data-provider="clever">Sync now</button>`;if(id==='schoolsplp'&&pr.configured)controls=`<button class="btn ghost small" data-action="preview-integration-roster" data-provider="schoolsplp">Preview OneRoster</button><button class="btn primary small" data-action="sync-integration-roster" data-provider="schoolsplp">Sync now</button>`;if(id==='canvas_grade_passback')controls=`<button class="btn primary small" data-action="open-canvas-auto-passback" ${pr.configured?'':'disabled'}>Automatic passback</button><button class="btn secondary small" data-action="open-canvas-grade-passback" ${pr.configured?'':'disabled'}>Send one grade</button>`;if(['canvas','clever','saml'].includes(id))controls=`<button class="btn secondary small" data-action="test-integration" data-provider="${id}" ${pr.configured?'':'disabled'}>${id==='saml'?'Check config':'Test connection'}</button>${controls}`;return `<article><div><span class="feedback-status ${pr.configured?'success':''}">${pr.configured?'Configured':'Setup required'}</span><h3>${escapeHtml(name)}</h3><p>${escapeHtml(desc)}</p></div><small>${escapeHtml(pr.detail||'Provider setup is required.')}</small>${controls?`<div class="simple-actions">${controls}</div>`:''}${kind==='external'&&!pr.configured?'<small class="muted">Activation requires provider registration/credentials; MathsExpress does not fake an SSO or LTI connection.</small>':''}</article>`}).join('')}</div><div class="v84-integration-note"><strong>What is already real</strong><p>Canvas/Clever roster reads use server-side provider APIs. Canvas grade passback uses the Canvas submissions API when the school token has grading permission. LTI, OAuth/OIDC, SAML and SchoolsPLP still require the school/provider to register MathsExpress and issue the required credentials before they can be activated.</p></div>`);
  }catch(error){openSimpleModal('School integrations',`<div class="school-error"><strong>Integration service could not load.</strong><p>${escapeHtml(error.message||'Deploy the integration API files included in this build.')}</p></div>`);}
}
async function openIntegrationReadiness(){
  openSimpleModal('Production integration readiness','<div class="school-loading"><span class="spinner"></span><strong>Checking deployment configuration…</strong></div>');
  try{const data=await integrationRequest('status');const p=data.providers||{};const rows=[['Canvas API',p.canvas?.configured,'CANVAS_BASE_URL + CANVAS_ACCESS_TOKEN'],['Canvas grade passback',p.canvas_grade_passback?.configured,'Canvas grading-capable API token'],['Canvas LTI 1.3',p.canvas_lti?.configured,'Canvas LTI registration values'],['Canvas OAuth SSO',p.canvas_sso?.configured,'Canvas OAuth client values'],['Clever rostering',p.clever?.configured,'CLEVER_ACCESS_TOKEN'],['Clever SSO',p.clever_sso?.configured,'Clever Complete + OAuth client values'],['SAML SSO',p.saml?.configured,'SAML IdP + callback values'],['SchoolsPLP',p.schoolsplp?.configured,'Partner-issued interoperability setup']];const ready=rows.filter(x=>x[1]).length;openSimpleModal('Production integration readiness',`<div class="teacher-metrics"><article><span>Configured</span><strong>${ready}/${rows.length}</strong><small>integration capabilities</small></article><article><span>Roster APIs</span><strong>${p.canvas?.configured||p.clever?.configured?'Ready':'Waiting'}</strong><small>server-side only</small></article><article><span>Grade passback</span><strong>${p.canvas_grade_passback?.configured?'Ready':'Waiting'}</strong><small>Canvas</small></article></div><div class="simple-list">${rows.map(([name,ok,env])=>`<div><strong>${ok?'✓':'○'} ${name}</strong><span>${ok?'Configuration detected':escapeHtml(env)}</span></div>`).join('')}</div><div class="status-banner ${ready?'success':'warning'}"><b>${ready?'Configured capabilities are ready to test.':'Provider setup is still required.'}</b><p>SSO/LTI cannot be honestly activated without external registration and credentials from the school/provider. MathsExpress keeps those secrets server-side and shows unconfigured features as waiting rather than pretending they work.</p></div>`);}catch(error){showToast('Readiness check failed',error.message||'Deploy the integrations endpoint first.');}
}
async function openCanvasGradePassback(){
  openSimpleModal('Canvas grade passback',`<form id="canvas-grade-passback-form" class="school-form"><p>Send one MathsExpress result to a Canvas submission. Canvas IDs come from the connected Canvas course/assignment/user.</p><div class="form-two"><label>Canvas course ID<input name="courseId" required></label><label>Canvas assignment ID<input name="canvasAssignmentId" required></label></div><div class="form-two"><label>Canvas user ID<input name="canvasUserId" required></label><label>Score %<input type="number" min="0" max="100" step="0.01" name="scorePercent" required></label></div><button class="btn primary" type="submit">Send grade to Canvas</button><p class="muted">Requires a server-side Canvas token with permission to update submissions.</p></form>`);
}
async function testIntegrationProvider(provider){
  try{const data=await integrationRequest('test',provider);showToast(`${provider[0].toUpperCase()+provider.slice(1)} connection`,data.message||'Connection succeeded.','success');openIntegrationCenter();}catch(error){showToast('Connection test failed',error.message||'Check provider credentials.');}
}
async function previewIntegrationRoster(provider){
  openSimpleModal(`${provider==='canvas'?'Canvas':provider==='clever'?'Clever':'SchoolsPLP'} roster preview`,'<div class="school-loading"><span class="spinner"></span><strong>Reading live provider roster…</strong></div>');
  try{const data=await integrationRequest('roster_preview',provider,{schoolId:selectedSchoolId||v7CurrentSchoolId()||''});const classes=data.classes||[];const providerName=provider==='canvas'?'Canvas':provider==='clever'?'Clever':'SchoolsPLP';openSimpleModal(`${providerName} roster preview`,`<div class="teacher-metrics"><article><span>Classes</span><strong>${classes.length}</strong><small>provider sections</small></article><article><span>Students</span><strong>${classes.reduce((n,c)=>n+(c.students?.length||0),0)}</strong><small>roster entries</small></article></div><div class="simple-list">${classes.slice(0,50).map(c=>`<div><strong>${escapeHtml(c.name||'Class')}</strong><span>${escapeHtml(yearLabel(c.yearLevel??9))} · ${c.students?.length||0} students</span></div>`).join('')||'<p>No classes were returned by the provider.</p>'}</div><div class="simple-modal-actions"><button class="btn primary" data-action="sync-integration-roster" data-provider="${escapeHtml(provider)}">Sync this roster</button><button class="btn secondary" data-action="open-integration-center">Back</button></div>`);}catch(error){showToast('Roster preview failed',error.message||'Check provider permissions.');openIntegrationCenter();}
}
async function syncIntegrationRoster(provider){
  try{showToast('Roster sync started','Reading classes and student emails from the provider…');const data=await integrationRequest('roster_sync',provider,{schoolId:selectedSchoolId||v7CurrentSchoolId()||''});showToast('Roster sync complete',`${Number(data.classesLinked||0)} classes · ${Number(data.studentsLinked||0)} students linked${Number(data.unmatchedCount||0)?` · ${Number(data.unmatchedCount)} need MathsExpress accounts`:''}.`,'success');openIntegrationCenter();if(routeFromHash().route==='teacher-hub')renderTeacherHub();}catch(error){showToast('Roster sync failed',error.message||'Check provider permissions and school setup.');}
}
function recurringCheckInDueDate(accuracy=0){
  const days=Number(accuracy)>=80?14:Number(accuracy)>=50?7:3;
  const d=new Date(); d.setDate(d.getDate()+days); return d;
}
function recordRecurringCheckInCompletion(task,run,accuracy){
  if(!activeSchoolAssignment?.checkInKind || activeSchoolAssignment.checkInRecorded)return;
  const skillId=String(activeSchoolAssignment.checkInSkillId||task?.skillId||'').trim();
  if(!skillId)return;
  const year=normaliseYearLevel(task?.yearLevel,normaliseYearLevel(account.profile?.yearLevel));
  const next=recurringCheckInDueDate(accuracy);
  const row={skillId,yearLevel:year,accuracy:Number(accuracy)||0,completedAt:new Date().toISOString(),nextDueAt:next.toISOString()};
  activeSchoolAssignment.checkInRecorded=true;
  persist({...state,skillCheckInHistory:[...(state.skillCheckInHistory||[]),row].slice(-100),skillCheckInSchedule:{...(state.skillCheckInSchedule||{}),[skillStateKey(skillId,year)]:next.toISOString()}},{quiet:true});
}
function startRecurringSkillCheckIn(skillId=null,yearLevel=null){
  const year=normaliseYearLevel(yearLevel,normaliseYearLevel(state.learningPathYear,normaliseYearLevel(account.profile?.yearLevel)));
  const skill=skillId?getCurriculumSkills({yearLevel:year}).find(x=>String(x.id)===String(skillId)):learningPathRows(year).filter(x=>x.unlocked&&x.mastery<85).sort((a,b)=>a.mastery-b.mastery)[0];
  const chosen=skill||getCurriculumSkills({yearLevel:year}).sort((a,b)=>skillMasteryValue(a.id,year)-skillMasteryValue(b.id,year))[0];
  if(!chosen)return showToast('Check-in unavailable','No skill was found for this year level.');
  const key=skillStateKey(chosen.id,year); const due=state.skillCheckInSchedule?.[key];
  if(due && new Date(due)>new Date()){
    const when=new Date(due).toLocaleDateString();
    showToast('Check-In not due yet',`The next scheduled ${chosen.title||chosen.skill} check-in is ${when}. You can still start it now.`);
  }
  const base=searchTaskLibrary({yearLevel:year,skillId:chosen.id,type:'adaptive',difficulty:'adaptive',questionCount:5,limit:1})[0]
    || searchTaskLibrary({yearLevel:year,skillId:chosen.id,type:'practice',questionCount:5,limit:1})[0];
  if(!base)return showToast('Check-in unavailable','No 5-question bank was found for this skill.');
  currentGeneratedTask=createUniqueGeneratedTaskRun(base); currentLesson=null;
  activeSchoolAssignment={id:`skill-checkin-${Date.now()}`,classId:null,assignmentTitle:`${chosen.title||chosen.skill} · Skills Check-In`,className:'Recurring 5-question adaptive check-in',dueAt:'',lessonId:'',taskId:base.id,testMode:true,tutorAllowed:false,hintsAllowed:false,calculatorAllowed:true,videosAllowed:false,gamesLocked:false,focusRequired:false,answered:0,correct:0,startedAt:Date.now(),synced:true,localOnly:true,returnRoute:'learning-path',checkInKind:'recurring-five',checkInSkillId:chosen.id,checkInRecorded:false};
  saveActiveAssignmentSession(); assessmentIntegrity={pasteEvents:0,fullscreenExits:0,tabLeaves:0,startedAt:Date.now()}; void enterAssignmentFullscreen({quiet:true}); startAssignmentTimer(); go('assignment',base.id);
}
function startSkillMiniCheck(skillId, yearLevel=null){ return startRecurringSkillCheckIn(skillId,yearLevel); }

function schoolSetupMarkup() {
  if (!canCreateSchoolAccount()) {
    return `<section class="page school-page school-setup-page"><div class="school-setup-card"><span class="eyebrow">School access</span><h1>No school is available yet</h1><p>Teacher and Owner accounts can create a new school. Owner can access and manage every school area.</p><button class="btn secondary" data-route="home">Back to Home</button></div></section>`;
  }
  return `<section class="page school-page school-setup-page">
    <div class="school-setup-card">
      <span class="eyebrow">School Setup</span>
      <h1>Create your school</h1>
      <p>MathsExpress is school-first. Create the school before adding staff, students, classes or assignments. You become the first <strong>Principal</strong> automatically.</p>
      <form id="create-school-form" class="school-setup-form">
        <label>School name<input name="name" placeholder="e.g. Parramatta College" required maxlength="100"></label>
        <div class="form-two"><label>School code<input name="code" placeholder="e.g. PAR2026" minlength="6" maxlength="10" required></label><label>Curriculum<select name="curriculum">${CURRICULUM_SYSTEMS.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('')}</select></label></div>
        <div class="form-two"><label>State / region<input name="region" placeholder="NSW"></label><label>Country<input name="country" value="Australia"></label></div>
        <fieldset class="year-level-picker"><legend>Year levels</legend>${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<label><input type="checkbox" name="yearLevels" value="${value}" checked> ${label}</label>`).join('')}</fieldset>
        <button class="btn primary" type="submit">Create school & become Principal</button>
      </form>
      <div class="school-hierarchy-preview"><strong>School hierarchy</strong><span>Principal</span><span>Deputy Principal</span><span>Head Teacher</span><span>Year Coordinator</span><span>Teacher</span><span>Student</span></div>
    </div>
  </section>`;
}


function openClassEditor(classId){
  const cls=teacherHubClasses.find(c=>String(c.id)===String(classId));
  if(!cls)return showToast('Class not found','Refresh the School Hub and try again.');
  openSimpleModal('Edit class',`<form id="edit-class-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(cls.id)}"><label>Class name<input name="name" value="${escapeHtml(cls.name||'')}" maxlength="80" required></label><div class="form-two"><label>Year level<select name="yearLevel">${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<option value="${value}" ${Number(cls.year_level)===value?'selected':''}>${escapeHtml(label)}</option>`).join('')}</select></label><label>Room<input name="room" value="${escapeHtml(cls.room||'')}" maxlength="80" placeholder="e.g. B14"></label></div><div class="simple-modal-actions"><button class="btn primary" type="submit">Save class</button><button class="btn ghost" type="button" data-action="close-school-modal">Cancel</button></div></form>`);
}

async function toggleClassArchive(classId, archived){
  try{
    await getSchoolClient().manageClass(classId,{action:archived?'unarchive':'archive'});
    showToast(archived?'Class unarchived':'Class archived',archived?'Students and tasks are visible again.':'The class is kept for records but moved out of active use.','success');
    return routeFromHash().route==='teacher-class'?go('teacher-hub'):renderTeacherHub();
  }catch(error){showToast('Could not update class',error.message||'Try again.');}
}

async function deleteClassPermanently(classId,className='this class'){
  const ok=globalThis.confirm?.(`Delete ${className}? This permanently removes the class and its class-linked data. This cannot be undone.`);
  if(!ok)return;
  try{
    await getSchoolClient().manageClass(classId,{action:'delete'});
    if(String(selectedTeacherClassId)===String(classId))selectedTeacherClassId='';
    showToast('Class deleted',`${className} was deleted.`,'success');
    go('teacher-hub');
  }catch(error){showToast('Could not delete class',error.message||'Try again.');}
}


async function renderTeacherHub() {
  const root = document.getElementById('app-view');
  if (!canUseTeacherHub(account)) { root.innerHTML = `<section class="page"><div class="school-error"><strong>Teacher account required.</strong><p>Student accounts cannot view school staff or class data.</p></div></section>`; return; }
  root.innerHTML = `<section class="page school-page"><div class="school-loading"><span class="spinner"></span><strong>Loading School Hub…</strong></div></section>`;
  try {
    const school = getSchoolClient();
    const schools = await withStartupTimeout(school.listSchools(),4500,'School list took too long to load.');
    schoolHubSchools = schools;
    if (routeFromHash().route !== 'teacher-hub') return;
    if (!schools.length) { root.innerHTML = schoolSetupMarkup(); return; }

    if (!selectedSchoolId || !schools.some((item)=>String(item.id)===String(selectedSchoolId))) selectedSchoolId = String(schools[0].id);
    const selectedSchool = schools.find((item)=>String(item.id)===String(selectedSchoolId)) || schools[0];
    const [dashboard,allClasses] = await Promise.all([
      withStartupTimeout(school.getSchoolDashboard(selectedSchool.id),5000,'School dashboard took too long to load.').catch(()=>({ school:selectedSchool, staff_role:selectedSchool.staff_role, counts:{} })),
      withStartupTimeout(school.listTeacherClasses(),5000,'Classes took too long to load.').catch(()=>[])
    ]);
    const staffRole = dashboard.staff_role || selectedSchool.staff_role || 'teacher';
    const capabilities = schoolCapabilitiesForRole(staffRole);
    const classes = allClasses.filter((c)=>String(c.school_id)===String(selectedSchool.id));
    teacherHubClasses = classes;
    const needsAssignmentRows = schoolHubTab==='assignments' || schoolHubTab==='reports';
    const assignmentGroups = needsAssignmentRows ? await Promise.all(classes.filter((c)=>!c.archived).map(async (c) => ({ classInfo:c, rows: await withStartupTimeout(school.listClassAssignments(c.id),3500,'Assignments took too long to load.').catch(()=>[]) }))) : [];
    const allAssignments = assignmentGroups.flatMap(({classInfo,rows}) => rows.map((row)=>({...row,class_name:classInfo.name})));
    const counts = dashboard.counts || {};
    const libraryResults = searchTaskLibrary({ ...taskLibraryFilters, limit: 96 });
    const staff = schoolHubTab === 'staff' ? await school.listSchoolStaff(selectedSchool.id).catch(()=>[]) : [];
    const students = schoolHubTab === 'students' ? await school.listSchoolStudents(selectedSchool.id).catch(()=>[]) : [];
    lastSchoolReportContext = { selectedSchool, schools, classes, allAssignments, dashboard };

    const yearOptions = YEAR_LEVEL_OPTIONS.map(o=>o.value);
    root.innerHTML = `<section class="page school-page teacher-dashboard school-hierarchy-dashboard school-tab-${escapeHtml(schoolHubTab)}">
      <div class="school-hub-head"><div><span class="eyebrow">School Dashboard</span><h1>${escapeHtml(selectedSchool.display_name || selectedSchool.name)}</h1><p>${escapeHtml(selectedSchool.code)} · ${escapeHtml(selectedSchool.curriculum || 'NSW')} · <strong>${escapeHtml(schoolRoleLabel(staffRole))}</strong></p></div><div class="school-switcher school-head-actions">${schools.length>1?`<select data-action="switch-school" aria-label="Choose school">${schools.map((item)=>`<option value="${item.id}" ${String(item.id)===String(selectedSchool.id)?'selected':''}>${escapeHtml(item.name)}</option>`).join('')}</select>`:''}<button class="btn primary" data-action="open-custom-assignment">＋ Create task</button><div class="teacher-more-wrap compact-teacher-tools"><button class="btn secondary teacher-more-button" data-action="toggle-teacher-more" aria-expanded="false">Tools <span>⌄</span></button><div class="teacher-more-menu" hidden><button data-action="teacher-tab" data-tab="library">Task Library</button><button data-action="teacher-more-action" data-tool="planner">Planner</button><button data-action="school-tab" data-tab="students">Students</button><button data-action="open-template-folders">Template folders</button><button data-action="open-authored-question-studio">Reviewed Question Studio</button><button data-action="open-integration-center">Integrations & SSO</button><button data-action="open-tutorial-video-manager">Tutorial videos</button><button data-action="teacher-more-action" data-tool="games">Classroom games</button><button data-action="open-announcement">Class announcement</button><button data-action="open-teacher-rewards">Give coins / Game Time</button></div></div></div></div>
      <nav class="school-section-tabs" aria-label="School sections">${SCHOOL_HUB_TABS.map((tab)=>`<button class="${schoolHubTab===tab.id?'active':''}" data-action="school-tab" data-tab="${tab.id}">${tab.label}</button>`).join('')}</nav>

      ${schoolHubTab==='overview' && teacherHubTab!=='library' ? `<section class="school-overview-grid"><article class="school-overview-main"><span class="eyebrow">Your school</span><h2>Everything starts here.</h2><p>Staff and students belong to the school. Classes are created inside it, and assignments live inside those classes.</p><div class="school-count-grid"><button data-action="school-tab" data-tab="staff"><strong>${counts.staff ?? 0}</strong><span>Staff</span></button><button data-action="school-tab" data-tab="students"><strong>${counts.students ?? 0}</strong><span>Students</span></button><button data-action="school-tab" data-tab="classes"><strong>${counts.classes ?? classes.length}</strong><span>Classes</span></button><button data-action="school-tab" data-tab="assignments"><strong>${counts.assignments ?? allAssignments.length}</strong><span>Assignments</span></button></div></article><aside class="school-role-card"><span class="eyebrow">Your role</span><h3>${escapeHtml(schoolRoleLabel(staffRole))}</h3><p>${capabilities.manageStaff?'You can manage staff and school teaching.':'You can teach and manage your assigned classes.'}</p><div class="role-ladder"><span>Principal</span><span>Deputy Principal</span><span>Head Teacher</span><span>Year Coordinator</span><span>Teacher</span></div></aside></section>` : ''}

      ${schoolHubTab==='staff' && teacherHubTab!=='library' ? `<section class="school-section"><div class="section-heading"><div><span class="eyebrow">School staff</span><h2>Staff & leadership</h2><p>Assign Principal, Deputy Principal, Head Teacher, Year Coordinator and Teacher roles.</p></div></div><div class="school-staff-layout"><div class="school-staff-list">${staff.map((member)=>`<article class="school-person-card"><div class="person-avatar">${escapeHtml((member.display_name||'T')[0])}</div><div class="person-copy"><strong>${escapeHtml(member.display_name||member.email)}</strong><small>${escapeHtml(member.email)}</small><span class="staff-role-pill">${escapeHtml(schoolRoleLabel(member.staff_role))}</span></div>${capabilities.manageStaff?`<form class="staff-role-form" data-user-id="${member.user_id}"><input type="hidden" name="userId" value="${member.user_id}"><select name="staffRole">${[['principal','Principal'],['deputy_principal','Deputy Principal'],['head_teacher','Head Teacher'],['year_coordinator','Year Coordinator'],['teacher','Teacher']].map(([v,l])=>`<option value="${v}" ${member.staff_role===v?'selected':''}>${l}</option>`).join('')}</select><button class="btn ghost small" type="submit">Save role</button><button class="btn danger small" type="button" data-action="remove-school-staff" data-user-id="${member.user_id}">Remove</button></form>`:''}</article>`).join('') || '<div class="school-empty">No staff yet.</div>'}</div>${capabilities.manageStaff?`<form id="add-school-staff-form" class="create-panel school-form"><span class="eyebrow">Add staff</span><h3>Add existing account</h3><p>The staff member needs a MathsExpress account first.</p><label>Email<input name="email" type="email" placeholder="teacher@school.edu.au" required></label><label>School role<select name="staffRole"><option value="teacher">Teacher</option><option value="year_coordinator">Year Coordinator</option><option value="head_teacher">Head Teacher</option><option value="deputy_principal">Deputy Principal</option><option value="principal">Principal</option></select></label><button class="btn primary" type="submit">Add to school</button></form>`:''}</div></section>` : ''}

      ${schoolHubTab==='students' && teacherHubTab!=='library' ? `<section class="school-section"><div class="section-heading"><div><span class="eyebrow">School students</span><h2>Students</h2><p>Students are added to the school automatically when they join one of its classes.</p></div><span>${students.length} enrolled</span></div><div class="school-student-table"><div class="school-table-head"><span>Name</span><span>Year</span><span>Email</span></div>${students.map((student)=>`<div class="school-table-row"><strong>${escapeHtml(student.display_name||'Student')}</strong><span>Year ${student.year_level}</span><small>${escapeHtml(student.email||'')}</small></div>`).join('') || '<div class="school-empty">No students have joined this school yet.</div>'}</div></section>` : ''}

      ${schoolHubTab==='classes' && teacherHubTab!=='library' ? `<div class="teacher-two-col"><main><div class="section-heading"><div><span class="eyebrow">Classes inside ${escapeHtml(selectedSchool.name)}</span><h2>Classes</h2></div><span>${classes.length} total</span></div><div class="teacher-class-grid">${classes.map((c)=>`<article class="teacher-class-card-wrap"><button class="teacher-class-card-main" data-route="teacher-class" data-param="${c.id}"><div class="class-detail-meta"><span class="class-year">YEAR ${c.year_level}</span>${c.room?`<span class="class-room-pill">Room ${escapeHtml(c.room)}</span>`:''}${c.archived?'<span class="class-archive-pill">Archived</span>':''}</div><h3>${escapeHtml(c.name)}</h3><p>Join code <b>${escapeHtml(c.join_code)}</b></p><small>${c.archived?'Archived class':'Open class →'}</small></button><div class="teacher-class-card-actions"><button class="btn ghost small" data-action="edit-class" data-class-id="${c.id}">Edit</button><button class="btn secondary small" data-action="toggle-class-archive" data-class-id="${c.id}" data-archived="${c.archived?'1':'0'}">${c.archived?'Unarchive':'Archive'}</button><button class="btn danger small" data-action="delete-class" data-class-id="${c.id}" data-class-name="${escapeHtml(c.name)}">Delete</button></div></article>`).join('') || '<div class="school-empty">Create the first class inside this school.</div>'}</div></main><aside>${capabilities.createClasses?`<form id="create-class-form" class="create-panel school-form"><input type="hidden" name="schoolId" value="${selectedSchool.id}"><span class="eyebrow">New class</span><h3>Create inside school</h3><label>Class name<input name="name" placeholder="9 Mathematics" required></label><label>Year<select name="yearLevel">${yearOptions.map((v)=>`<option value="${v}" ${v===9?'selected':''}>${escapeHtml(yearLabel(v))}</option>`).join('')}</select></label><label>Room<input name="room" placeholder="e.g. B14" maxlength="80"></label><button class="btn primary" type="submit">Create class</button></form>`:''}</aside></div>` : ''}

      ${(schoolHubTab==='assignments' || teacherHubTab==='library') ? `<section class="school-section"><div class="section-heading"><div><span class="eyebrow">School assignments</span><h2>${teacherHubTab==='library'?'Task Library':'Assignments'}</h2><p>${teacherHubTab==='library'?'Preview work, then assign it to a class in this school.':'Assigned work across this school.'}</p></div><div class="simple-actions"><button class="btn ${teacherHubTab==='library'?'secondary':'primary'}" data-action="teacher-tab" data-tab="library">Task Library</button><button class="btn secondary" data-action="open-custom-assignment">Create Your Own</button><button class="btn secondary" data-action="open-custom-worksheet-builder">Worksheet Builder</button><button class="btn secondary" data-action="open-curated-bank">Curated Bank</button></div></div>${teacherHubTab==='library'?`<form id="task-library-filter-form" class="task-filter-bar curriculum-task-filters"><input name="query" value="${escapeHtml(taskLibraryFilters.query)}" placeholder="Search topics or skills"><select name="yearLevel"><option value="all">All years</option>${YEAR_LEVEL_OPTIONS.map(({value,label})=>`<option value="${value}" ${Number(taskLibraryFilters.yearLevel)===value?'selected':''}>${label}</option>`).join('')}</select><select name="pathway"><option value="all">All pathways</option>${['Core','Standard','Advanced','Extension'].map(v=>`<option value="${v}" ${taskLibraryFilters.pathway===v?'selected':''}>${v}</option>`).join('')}</select><select name="strand"><option value="all">All strands</option>${CURRICULUM_STRANDS.map(v=>`<option value="${escapeHtml(v)}" ${taskLibraryFilters.strand===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select><select name="topic"><option value="all">All topics</option>${CURRICULUM_TOPICS.map(v=>`<option value="${escapeHtml(v)}" ${taskLibraryFilters.topic===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select><select name="skillId"><option value="all">All skills</option>${getCurriculumSkills({yearLevel:taskLibraryFilters.yearLevel,pathway:taskLibraryFilters.pathway,strand:taskLibraryFilters.strand,topic:taskLibraryFilters.topic}).map(l=>`<option value="${l.id}" ${taskLibraryFilters.skillId===l.id?'selected':''}>Year ${l.yearLevel} · ${escapeHtml(l.title)}</option>`).join('')}</select><select name="difficulty"><option value="all">All difficulty</option>${['easy','medium','hard','adaptive','mixed'].map(v=>`<option value="${v}" ${taskLibraryFilters.difficulty===v?'selected':''}>${v==='mixed'?'Mixed Difficulty':v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select><select name="type"><option value="all">All task types</option>${TASK_TYPES.map(([v,l])=>`<option value="${v}" ${taskLibraryFilters.type===v?'selected':''}>${escapeHtml(l)}</option>`).join('')}</select><select name="questionCount"><option value="all">Any length</option>${QUESTION_COUNTS.map(v=>`<option value="${v}" ${Number(taskLibraryFilters.questionCount)===v?'selected':''}>${v} questions</option>`).join('')}</select><button class="btn primary small" type="submit">Search</button></form><div class="library-result-line"><strong>${libraryResults.length}</strong> matching tasks shown <span>from ${TASK_LIBRARY_SIZE.toLocaleString()} total</span></div><div class="task-library-grid">${libraryResults.map(libraryTaskCard).join('') || '<div class="school-empty">No tasks match those filters.</div>'}</div>`:`<div class="assignment-list">${allAssignments.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map((a)=>`<article class="assignment-card simple-assignment-card"><div class="assignment-type">${escapeHtml(a.assignment_type)}</div><div class="assignment-copy"><strong>${escapeHtml(a.title)}</strong><small>${escapeHtml(a.class_name)} · ${escapeHtml(a.topic||'Maths')}</small><span class="due-chip">${escapeHtml(formatSchoolDate(a.due_at))}</span></div><div class="assignment-progress"><strong>${a.question_count||0}</strong><small>questions</small><button class="btn ghost small" data-route="teacher-class" data-param="${a.class_id}">View class</button></div></article>`).join('') || '<div class="school-empty">No assignments yet. Open the Task Library to assign work.</div>'}</div>`}</section>` : ''}

      ${schoolHubTab==='reports' && teacherHubTab!=='library' ? `<section class="school-section"><div class="section-heading"><div><span class="eyebrow">School reports</span><h2>Reports</h2><p>Class evidence, course progress, long-term comparisons and district reporting.</p></div><div class="simple-actions"><button class="btn secondary small" data-action="open-school-usage">School usage</button><button class="btn secondary small" data-action="open-class-comparison">Class comparison</button><button class="btn secondary small" data-action="open-standards-proficiency">Standards proficiency</button><button class="btn secondary small" data-action="open-year-over-year">Year-over-year</button><button class="btn secondary small" data-action="open-district-report">District</button></div></div><div class="report-launch-grid">${classes.map(c=>`<button data-route="teacher-class" data-param="${c.id}"><span>📊</span><div><strong>${escapeHtml(c.name)}</strong><small>Insights · Mastery evidence · Task groups · Course progress</small></div><b>→</b></button>`).join('') || '<div class="school-empty">Reports appear when your school has classes.</div>'}</div></section>` : ''}

      ${schoolHubTab==='curriculum' && teacherHubTab!=='library' ? `<section class="school-section school-curriculum-panel"><span class="eyebrow">Curriculum</span><h2>${escapeHtml(selectedSchool.curriculum||'NSW')} Mathematics · K–12</h2><p>Your school can assign from ${TASK_LIBRARY_SIZE.toLocaleString()} K–12 task packs across Core, Standard, Advanced and Extension-style pathways.</p><button class="btn primary" data-action="teacher-tab" data-tab="library">Open Task Library</button></section>` : ''}

      ${schoolHubTab==='settings' && teacherHubTab!=='library' ? `<section class="school-section"><div class="section-heading"><div><span class="eyebrow">School settings</span><h2>${escapeHtml(selectedSchool.name)}</h2><p>Set the school details used throughout MathsExpress.</p></div></div><div class="school-settings-editor"><div class="school-settings-summary"><div><small>School code</small><strong>${escapeHtml(selectedSchool.code)}</strong></div><div><small>Region</small><strong>${escapeHtml(selectedSchool.region||'Not set')}</strong></div><div><small>Country</small><strong>${escapeHtml(selectedSchool.country||'Not set')}</strong></div><div><small>Curriculum</small><strong>${escapeHtml(selectedSchool.curriculum||'NSW')}</strong></div></div>${(capabilities.manageStaff||canUseOwnerConsole(account))?`<form id="school-details-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(selectedSchool.id)}"><div class="school-settings-form-grid"><label>School name<input name="name" value="${escapeHtml(selectedSchool.name||'')}" required maxlength="100"></label><label>Region / state<input name="region" value="${escapeHtml(selectedSchool.region||'')}" placeholder="NSW" maxlength="100"></label><label>Country<input name="country" value="${escapeHtml(selectedSchool.country||'Australia')}" maxlength="100"></label><label>Curriculum<select name="curriculum">${CURRICULUM_SYSTEMS.map(v=>`<option value="${escapeHtml(v)}" ${String(selectedSchool.curriculum||'NSW')===String(v)?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label></div><div class="simple-actions"><button class="btn primary" type="submit">Save school settings</button><button class="btn secondary" type="button" data-action="open-integration-center">Canvas / Clever / SAML</button></div></form>`:`<p>Principal and Deputy Principal roles can edit these school settings.</p><div class="simple-actions"><button class="btn secondary" data-action="open-integration-center">Canvas / Clever / SAML</button></div>`}</div></section>` : ''}
    </section>`;
  } catch (error) { root.innerHTML = `<section class="page school-page"><div class="school-error"><strong>School Hub couldn’t load.</strong><p>${escapeHtml(error.message || 'Try again.')}</p></div></section>`; }
}
async function renderTeacherClass() {
  const root = document.getElementById('app-view');
  if (!canUseTeacherHub(account)) return renderTeacherHub();
  const classId = routeFromHash().param || selectedTeacherClassId;
  selectedTeacherClassId = classId;
  root.innerHTML = `<section class="page school-page"><div class="school-loading"><span class="spinner"></span><strong>Building class report…</strong></div></section>`;
  try {
    const school = getSchoolClient();
    const dashboard = await school.classDashboard(classId);
    const focusRows = await school.classFocusStatus(classId).catch(()=>[]);
    if (routeFromHash().route !== 'teacher-class') return;
    const cls = dashboard.class || {};
    const students = dashboard.students || [];
    const assignments = dashboard.assignments || [];
    const attempts = dashboard.attempts || [];
    const mastery = dashboard.mastery || [];
    lastTeacherReport = { class: cls, students, assignments, attempts, mastery, focusRows };
    const planner = buildPlannerItems(assignments.map(a=>({ ...a, title:a.title, type:a.assignment_type, dueAt:a.due_at })));
    const analytics = buildAdminAnalytics(students.map(s=>({ activeDays: s.last_seen && Date.now()-new Date(s.last_seen).getTime()<7*86400000 ? 1 : 0, questions:0, timeSeconds:0 })));
    const skills = LESSONS.map(l=>l.id);
    root.innerHTML = `<section class="page school-page teacher-dashboard">
      <button class="back-link" data-route="teacher-hub">← School Hub</button>
      <div class="class-detail-hero"><div><span class="eyebrow">${escapeHtml(yearLabel(cls.year_level))}</span><h1>${escapeHtml(cls.name || 'MathsExpress Class')}</h1><p class="class-detail-meta"><span>Join code <b>${escapeHtml(cls.join_code || '------')}</b></span><span>${students.length} students</span><span>${assignments.length} tasks</span>${cls.room?`<span class="class-room-pill">Room ${escapeHtml(cls.room)}</span>`:''}${cls.archived?'<span class="class-archive-pill">Archived</span>':''}</p><div class="class-management-actions"><button class="btn ghost small" data-action="edit-class" data-class-id="${escapeHtml(classId)}">Edit class</button><button class="btn ghost small" data-action="toggle-class-archive" data-class-id="${escapeHtml(classId)}" data-archived="${cls.archived?'1':'0'}">${cls.archived?'Unarchive':'Archive'}</button><button class="btn danger small" data-action="delete-class" data-class-id="${escapeHtml(classId)}" data-class-name="${escapeHtml(cls.name||'this class')}">Delete</button></div></div><div class="hero-actions v10-class-actions"><button class="btn light" data-action="teacher-tab" data-tab="create">＋ Create assignment</button><details class="teacher-action-dropdown"><summary>More tools</summary><div><button class="btn ghost small" data-action="open-bulk-assign">Bulk assign</button><button class="btn ghost small" data-action="open-recognition">Sticker / note</button><button class="btn ghost small" data-action="open-class-expedition">Class expedition</button><button class="btn ghost small" data-action="open-focus-monitor" data-class-id="${escapeHtml(classId)}">Live focus</button><button class="btn ghost small" data-action="open-course-progress">Course progress</button><button class="btn ghost small" data-action="open-grouped-task-report">Task group report</button><button class="btn ghost small" data-action="open-class-planner">Planner</button><button class="btn ghost small" data-action="open-class-textbook-focus">Textbook focus</button><button class="btn ghost small" data-action="open-textbook-task-search">Search textbooks</button><button class="btn ghost small" data-action="export-gradebook">Export CSV</button><button class="btn ghost small" data-action="print-class-report">Print / PDF</button></div></details></div></div>
      ${teacherSummaryCards(dashboard)}
      <div class="class-report-tabs"><span class="active">Insights</span><span>Activity</span><span>Mastery</span><span>Tasks</span><span>Gradebook</span></div>
      <div class="teacher-report-grid"><section class="school-section"><div class="section-heading"><div><span class="eyebrow">Class Insights</span><h2>Students to watch</h2></div><span>${analytics.activeStudents}/${students.length} active this week</span></div><div class="student-table student-table-actions"><div class="student-row head"><span>Student</span><span>Recent score</span><span>Mastery</span><span>Status</span><span>Actions</span></div>${students.map(student=>{ const sa=attempts.filter(a=>a.student_id===student.user_id); const avg=sa.length?Math.round(sa.reduce((n,a)=>n+Number(a.score_percent||0),0)/sa.length):0; const sm=mastery.filter(m=>m.student_id===student.user_id); const mm=sm.length?Math.round(sm.reduce((n,m)=>n+Number(m.mastery||0),0)/sm.length):0; const focus=focusRows.find(f=>String(f.user_id)===String(student.user_id)); const focusFresh=focus?.updated_at && Date.now()-new Date(focus.updated_at).getTime()<90000; const focusState=focusFresh?(focus.state||'active'):'offline'; const focusLabel=focusState==='active'?'On MathsExpress':focusState==='hidden'||focusState==='away'?'Away from tab':'Offline'; return `<div class="student-row"><span><b>${escapeHtml(student.display_name)}</b><small>${escapeHtml(student.username || student.email || '')}</small></span><span>${avg}%</span><span><div class="mini-progress"><i style="width:${mm}%"></i></div>${mm}%</span><span class="live-state ${focusState==='active'?'working':focusState==='hidden'||focusState==='away'?'away':'offline'}">${focusLabel}${focus?.hidden_count?` · ${Number(focus.hidden_count)} switches`:''}</span><span class="student-row-actions"><details class="row-action-menu"><summary>Actions</summary><div><button class="btn ghost small" data-action="open-student-identity-editor" data-student-id="${escapeHtml(student.user_id)}">Edit account</button><button class="btn ghost small" data-action="open-teacher-feedback" data-student-id="${escapeHtml(student.user_id)}">Feedback</button><button class="btn ghost small" data-action="open-parent-message-teacher" data-student-id="${escapeHtml(student.user_id)}">Parent message</button><button class="btn ghost small" data-action="open-year-override" data-student-id="${escapeHtml(student.user_id)}">Year override</button></div></details></span></div>`}).join('') || '<div class="school-empty">Students who join with the class code will appear here.</div>'}</div></section>
        <section class="school-section"><div class="section-heading"><div><span class="eyebrow">Planner</span><h2>Upcoming tasks</h2></div><button class="btn secondary small" data-action="open-class-planner">Open calendar</button></div><div class="planner-list">${planner.slice(0,8).map(t=>`<div><span class="task-type-dot ${escapeHtml(t.type)}"></span><div><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(formatSchoolDate(t.dueAt))}</small></div></div>`).join('') || '<div class="school-empty">No tasks scheduled.</div>'}</div></section></div>
      <section class="school-section v10-mastery-section"><div class="section-heading"><div><span class="eyebrow">Class Mastery Report</span><h2>Skill heatmap</h2></div><button class="btn secondary small" data-action="teacher-tab" data-tab="create">Assign Adaptive Task</button></div><div class="mastery-table"><div class="mastery-row head"><span>Student</span>${skills.map(id=>`<span>${escapeHtml(getLessonById(id)?.shortTitle || getLessonById(id)?.title || id)}</span>`).join('')}</div>${students.map(student=>`<div class="mastery-row"><span>${escapeHtml(student.display_name)}</span>${skills.map(id=>{const row=mastery.find(m=>m.student_id===student.user_id&&m.skill_id===id); const v=Math.round(Number(row?.mastery||0)); return `<button class="mastery-cell m${Math.floor(v/20)}" title="Open evidence for ${v}% mastery" data-action="open-mastery-evidence" data-student-id="${escapeHtml(student.user_id)}" data-student-name="${escapeHtml(student.display_name||'Student')}" data-skill-id="${escapeHtml(id)}">${v}%</button>`}).join('')}</div>`).join('') || '<div class="school-empty">Mastery appears after students practise skills.</div>'}</div></section>
      <section class="school-section v10-task-overview"><div class="section-heading"><div><span class="eyebrow">Class Tasks Report</span><h2>Assignments</h2></div><div class="simple-actions"><button class="btn secondary small" data-action="open-engagement-compass">Engagement compass</button><button class="btn secondary small" data-action="open-skills-focus" data-class-id="${escapeHtml(classId)}">Skills Focus</button><button class="btn primary small" data-action="teacher-tab" data-tab="create">＋ Create Task</button></div></div><div class="assignment-list">${assignments.map(a=>{const aa=attempts.filter(x=>x.assignment_id===a.id); const complete=aa.filter(x=>x.completed_at).length; const avg=aa.length?Math.round(aa.reduce((n,x)=>n+Number(x.score_percent||0),0)/aa.length):0; return `<article class="assignment-card"><div class="assignment-type">${escapeHtml(a.assignment_type)}</div><div class="assignment-copy"><strong>${escapeHtml(a.title)}</strong><small>${complete}/${students.length} completed • ${avg}% average</small><div><span class="due-chip">${escapeHtml(formatSchoolDate(a.due_at))}</span></div></div><div class="assignment-progress"><div class="assignment-result-summary"><strong>${avg}%</strong><small>class result</small></div><div class="assignment-action-row"><button class="btn primary small" data-action="open-task-report" data-assignment-id="${a.id}">Open</button>${(a.test_mode||a.assignment_type==='test'||a.assignment_type==='topic-test')&&a.results_released===false?`<button class="btn success small" data-action="quick-release-results" data-assignment-id="${a.id}">Unlock results</button>`:''}<details class="row-action-menu task-row-menu"><summary>•••</summary><div><button class="btn ghost small" data-action="create-revision" data-assignment-id="${a.id}">Create revision</button><button class="btn ghost small" data-action="open-scorecard" data-assignment-id="${a.id}">Scorecard</button><button class="btn ghost small" data-action="open-task-groups" data-assignment-id="${a.id}">Task groups</button><button class="btn ghost small" data-action="queue-parent-due" data-assignment-id="${a.id}">Parent reminder</button><button class="btn ghost small" data-action="assignment-controls" data-assignment-id="${a.id}">Controls</button></div></details></div></div></article>`}).join('') || '<div class="school-empty">No assignments yet.</div>'}</div></section>
    </section>`;
  } catch (error) { root.innerHTML = `<section class="page school-page"><div class="school-error"><strong>Class report couldn’t load.</strong><p>${escapeHtml(error.message || 'Try again.')}</p><button class="btn secondary" data-route="teacher-hub">Back</button></div></section>`; }
}

async function handleSchoolSubmit(event) {
  const form = event.target;
  if (!form || !account.authenticated) return;
  const data = new FormData(form);
  try {
    const school = getSchoolClient();
    if (form.id === 'school-details-form') {
      event.preventDefault();
      await school.updateSchoolDetails(String(data.get('schoolId')||selectedSchoolId),{name:data.get('name'),region:data.get('region'),country:data.get('country'),curriculum:data.get('curriculum')});
      showToast('School settings saved','Region, country and curriculum have been updated.','success');
      return renderTeacherHub();
    }
    if (form.id === 'edit-class-form') {
      event.preventDefault();
      const classId=String(data.get('classId')||'');
      const saved=await school.manageClass(classId,{action:'edit',name:data.get('name'),yearLevel:data.get('yearLevel'),room:data.get('room')});
      document.getElementById('modal-root').innerHTML='';
      showToast('Class updated',saved?.roomUnavailable?'Name and year level were saved. Run the v8.7 SQL migration to enable Room.':'Name, year level and room were saved.',saved?.roomUnavailable?'info':'success');
      return routeFromHash().route==='teacher-class'?renderTeacherClass():renderTeacherHub();
    }
    if (form.id === 'task-groups-form') {
      event.preventDefault();
      const assignmentId=String(data.get('assignmentId')||'');
      const used=new Set(); const groups=[];
      for(let i=0;i<4;i++){
        const studentIds=data.getAll(`g${i}Students`).map(String).filter(id=>{if(used.has(id))return false;used.add(id);return true;});
        if(!studentIds.length) continue;
        const startRaw=String(data.get(`g${i}Start`)||''); const dueRaw=String(data.get(`g${i}Due`)||'');
        groups.push({id:`group-${i+1}`,name:String(data.get(`g${i}Name`)||`Group ${i+1}`).slice(0,80),studentIds,startAt:startRaw?new Date(startRaw).toISOString():null,dueAt:dueRaw?new Date(dueRaw).toISOString():null});
      }
      await school.updateTaskGroups(assignmentId,groups);
      document.getElementById('modal-root').innerHTML=''; showToast('Task Groups saved',`${groups.length} group${groups.length===1?'':'s'} now use their own schedule.`, 'success');
      return renderTeacherClass();
    }
    if (form.id === 'year-override-form') {
      event.preventDefault(); const studentId=String(data.get('studentId')||'');const classId=String(data.get('classId')||'');const expires=String(data.get('expiresAt')||'');
      await school.setStudentYearOverride(studentId,classId,Number(data.get('yearLevel')),expires?new Date(expires).toISOString():null);document.getElementById('modal-root').innerHTML='';showToast('Year override saved','It will expire automatically and then return to the class year level.','success');return renderTeacherClass();
    }
    if (form.id === 'class-learning-settings-form') {
      event.preventDefault();await school.setClassLearningSettings(String(data.get('classId')||''),{textbookFocus:String(data.get('textbookFocus')||'')||null,autoAssignYear:data.get('autoAssignYear')==='on'});document.getElementById('modal-root').innerHTML='';showToast('Class learning settings saved','Current and new members will use these class defaults.','success');return renderTeacherClass();
    }
    if (form.id === 'textbook-task-search-form') { event.preventDefault();return openTextbookTaskSearch(String(data.get('query')||'')); }
    if (form.id === 'custom-worksheet-assign-form') {
      event.preventDefault();
      const worksheet=saveWorksheetDraftLocal(data.get('title'));
      if(!worksheet?.questions?.length) throw new Error('Add at least one question first.');
      const created=await school.createAndAssignTask({classId:data.get('classId'),title:worksheet.title,type:'worksheet',topic:'custom worksheet',difficulty:'mixed',questionCount:worksheet.questions.length,dueAt:data.get('dueAt')?new Date(data.get('dueAt')).toISOString():null,hintsAllowed:true,testMode:false,config:{custom_worksheet:worksheet}});
      document.getElementById('modal-root').innerHTML=''; showToast('Custom worksheet assigned',`${worksheet.questions.length} selected questions are ready for the class.`, 'success');
      teacherHubTab='assignments';schoolHubTab='assignments';return renderTeacherHub();
    }
    if (form.id === 'district-create-form') {
      event.preventDefault(); const ids=data.getAll('schoolIds').map(String); if(!ids.length) throw new Error('Choose at least one school.');
      await school.createDistrict(String(data.get('name')||'District').slice(0,120),ids); showToast('District created','District reporting is ready.','success'); return openDistrictDashboard();
    }
    if (form.id === 'planner-task-form') { event.preventDefault(); const title=String(data.get('title')||'Study task').slice(0,160),date=String(data.get('date')||localDateString()),type=String(data.get('type')||'Study').slice(0,40); persist({...state,plannerTasks:[...(state.plannerTasks||[]),{id:`planner-${Date.now()}`,title,date,type,done:false}].slice(-500)},{quiet:true}); document.getElementById('modal-root').innerHTML=''; showToast('Added to planner',title,'success'); return renderCalendar(); }
    if (form.id === 'parent-reply-form') { event.preventDefault(); const client=accountClient.ensureClient(); const {error}=await client.rpc('mathsexpress_parent_send_message',{p_student_id:String(data.get('studentId')||''),p_body:String(data.get('body')||'').slice(0,2000)}); if(error)throw error; showToast('Message sent','Your reply was added to the school communication thread.','success'); return renderGuardianPortal(); }
    if (form.id === 'assignment-controls-form') { event.preventDefault(); const assignmentId=String(data.get('assignmentId')||''); await school.updateAssignmentControls(assignmentId,{paused:data.get('paused')==='on',gamesLocked:data.get('gamesLocked')==='on',focusRequired:data.get('focusRequired')==='on',resultsReleased:data.get('resultsReleased')==='on',startAt:data.get('startAt')?new Date(data.get('startAt')).toISOString():null,exactStart:data.get('exactStart')==='on',dueAt:data.get('dueAt')?new Date(data.get('dueAt')).toISOString():null,timeLimitMinutes:data.get('timeLimit')?Number(data.get('timeLimit')):null}); document.getElementById('modal-root').innerHTML=''; showToast('Assignment controls saved','Students will see the updated schedule and rules.','success'); return renderTeacherClass(); }
    if (form.id === 'student-accommodation-form') { event.preventDefault(); await school.setStudentAccommodation(data.get('assignmentId'),data.get('studentId'),{extraMinutes:Number(data.get('extraMinutes'))||0,attemptsOverride:data.get('attemptsOverride')?Number(data.get('attemptsOverride')):null}); showToast('Accommodation saved','Extra time is stored. Assignment attempts stay unlimited.','success'); return; }
    if (form.id === 'house-create-form') { event.preventDefault(); await school.createHouse(data.get('schoolId'),data.get('name')); showToast('House created',String(data.get('name')||'House'),'success'); return openHouseSystemModal(); }
    if (form.id === 'house-assign-form') { event.preventDefault(); await school.assignHouse(data.get('houseId'),data.get('studentId')); showToast('House updated','The student has been moved into that house.','success'); return openHouseSystemModal(); }
    if (form.id === 'merit-award-form') { event.preventDefault(); await school.awardMerit(data.get('schoolId'),data.get('studentId'),Number(data.get('points'))||1,data.get('reason')); showToast('Merit points awarded',`${Number(data.get('points'))||1} points added.`,'success'); return openHouseSystemModal(); }
    if (form.id === 'tournament-create-form') { event.preventDefault(); let bracket={}; try { bracket=JSON.parse(String(data.get('bracket')||'{}')); } catch {} const scope=String(data.get('scope')||'school'); const schoolId=String(data.get('schoolId')||'')||null; const classId=scope==='class'?(String(data.get('classId')||'')||null):null; await school.createTournament({schoolId,classId,title:data.get('title'),type:data.get('type'),bracket}); showToast('Tournament created',String(data.get('title')||'Maths Tournament'),'success'); return openTournamentModal(); }
    if (form.id === 'parent-message-form') {
      event.preventDefault();
      const result=await queueAndTryParentEmail('teacher-message',String(data.get('schoolId')||''),String(data.get('studentId')||''),String(data.get('body')||''));
      document.getElementById('modal-root').innerHTML='';
      if(result.delivery==='sent') showToast('Parent email sent',`${Number(result?.sent||0)} email${Number(result?.sent||0)===1?'':'s'} sent.`, 'success');
      else showToast('Email setup required','The teacher message is safely queued. Email delivery is not configured on this deployment yet.');
      return renderTeacherClass();
    }
    if (form.id === 'parent-report-email-form') {
      event.preventDefault();
      const result=await queueAndTryParentEmail('progress-report',String(data.get('schoolId')||''),String(data.get('studentId')||''));
      document.getElementById('modal-root').innerHTML='';
      if(result.delivery==='sent') showToast('Progress report emailed',`${Number(result?.sent||0)} email${Number(result?.sent||0)===1?'':'s'} sent.`, 'success');
      else showToast('Email setup required','The progress report is safely queued. Email delivery is not configured on this deployment yet.');
      return renderTeacherClass();
    }
    if (form.id === 'student-parent-invite-form') { event.preventDefault(); const client=accountClient.ensureClient(); const {data:result,error}=await client.rpc('mathsexpress_student_invite_parent',{p_guardian_email:String(data.get('guardianEmail')||''),p_guardian_name:String(data.get('guardianName')||'')||null}); if(error)throw error; showToast('Parent email saved','Progress reports and teacher messages can now be emailed directly to this address. No parent account is needed.','success'); return openStudentParentModal(); }
    if (form.id === 'parent-link-form') { event.preventDefault(); await school.addParentLink(data.get('schoolId'),data.get('studentId'),data.get('guardianEmail'),data.get('guardianName')); showToast('Parent email saved',`${String(data.get('guardianEmail')||'')} can now receive reports and teacher messages.`, 'success'); return openParentAccountsModal(); }
    if (form.id === 'teacher-reward-form') {
      event.preventDefault();
      const classId=String(data.get('classId')||''); const studentId=String(data.get('studentId')||'');
      const coins=Math.max(0,Math.min(500,Number(data.get('coins'))||0));
      const gameTimeSeconds=Math.max(0,Math.min(300,Number(data.get('gameTimeSeconds'))||0));
      if(!coins && !gameTimeSeconds) return showToast('Add a reward','Enter coins, Game Time, or both.');
      await school.grantStudentRewards(classId,studentId,{coins,gameTimeSeconds,reason:String(data.get('reason')||'Teacher reward')});
      document.getElementById('modal-root').innerHTML='';
      showToast('Reward queued','The student receives it automatically when they sign in or refresh.','success');
      return;
    }
    if (form.id === 'student-identity-form') {
      event.preventDefault();
      await school.updateStudentIdentity(data.get('studentId'),{displayName:data.get('displayName'),username:data.get('username')});
      document.getElementById('modal-root').innerHTML='';
      showToast('Student account updated','Name and username were updated by staff.','success');
      return renderTeacherClass();
    }
    if (form.id === 'teacher-feedback-form') { event.preventDefault(); await school.saveTeacherFeedback(data.get('studentId'),data.get('assignmentId'),data.get('comment'),data.get('allowResubmission')==='on'); document.getElementById('modal-root').innerHTML=''; showToast('Feedback saved','The student can now see your assignment feedback.','success'); return renderTeacherClass(); }
    if (form.id === 'mark-override-form') {
      event.preventDefault(); const client=accountClient.ensureClient(); const {error}=await client.rpc('mathsexpress_teacher_override_mark',{p_assignment_id:String(data.get('assignmentId')||''),p_student_id:String(data.get('studentId')||''),p_question_id:String(data.get('questionId')||''),p_score_awarded:Number(data.get('score'))||0,p_score_possible:Number(data.get('possible'))||1,p_comment:String(data.get('comment')||'')}); if(error)throw error; document.getElementById('modal-root').innerHTML=''; showToast('Mark overridden','The teacher mark and rationale are saved.','success'); return;
    }
    if (form.id === 'tutorial-video-form') {
      event.preventDefault(); const client=accountClient.ensureClient(); const {error}=await client.rpc('mathsexpress_save_tutorial_video',{p_school_id:String(data.get('schoolId')||'')||null,p_skill_id:String(data.get('skillId')||'')||null,p_topic:String(data.get('topic')||'')||null,p_title:String(data.get('title')||''),p_url:String(data.get('url')||''),p_duration:data.get('duration')?Number(data.get('duration')):null}); if(error)throw error; document.getElementById('modal-root').innerHTML=''; showToast('Tutorial attached','Students can open it from the Video tool when the skill matches.','success'); return;
    }
    if (form.id === 'textbook-resource-form') {
      event.preventDefault(); const client=accountClient.ensureClient(); const {error}=await client.rpc('mathsexpress_save_textbook_resource',{p_school_id:String(data.get('schoolId')||'')||null,p_section_id:String(data.get('sectionId')||''),p_type:String(data.get('type')||''),p_title:String(data.get('title')||''),p_body:String(data.get('body')||''),p_url:String(data.get('url')||'')||null}); if(error)throw error; showToast('Resource attached','It is now linked to this textbook section.','success'); return openTextbookResources(String(data.get('sectionId')||''),{teacher:true});
    }
    if (form.id === 'recognition-form') {
      event.preventDefault(); if(!canUseTeacherHub(account))throw new Error('Only teachers can send recognition.'); if(!data.get('classId')||!data.get('studentId'))throw new Error('Choose a class and student first.'); await school.giveRecognition(data.get('classId'),data.get('studentId'),data.get('message'),data.get('sticker')); document.getElementById('modal-root').innerHTML=''; showToast('Recognition sent','The sticker and teacher note are on the student dashboard.','success'); return renderTeacherClass();
    }
    if (form.id === 'bulk-assign-form') {
      event.preventDefault(); const ids=data.getAll('classIds').map(String).filter(Boolean); if(!ids.length)throw new Error('Choose at least one class.'); const task=getTaskById(String(data.get('taskId')||''))||TASK_LIBRARY[0]; if(!task)throw new Error('Task not found.'); const due=data.get('dueAt')?new Date(data.get('dueAt')).toISOString():null; const mode=String(data.get('mode')||'adaptive'); let created=0; for(const classId of ids){const a=await school.createAndAssignTask({classId,title:String(data.get('title')||task.title),type:mode==='adaptive'?'adaptive':task.type,topic:task.topic?.toLowerCase?.()||'mathematics',lessonId:task.lessonId,difficulty:mode==='adaptive'?'adaptive':task.difficulty,questionCount:task.questionCount,requiredMastery:task.masteryTarget,taskLibraryId:task.id,dueAt:due,hintsAllowed:true,testMode:false});created++;if(a?.id)void fireAndForgetRpc('mathsexpress_queue_parent_due_notifications',{p_assignment_id:String(a.id)});} document.getElementById('modal-root').innerHTML=''; showToast('Bulk assignment sent',`${created} class${created===1?'':'es'} received the task.`,'success'); return renderTeacherHub();
    }
    if (form.id === 'education-domain-form') {
      event.preventDefault();
      await school.addEducationDomain(data.get('domain'),data.get('label'));
      showToast('Education domain added',String(data.get('domain')||''),'success');
      return openEducationDomainsModal();
    }
    if (form.id === 'owner-activity-filter-form') {
      event.preventDefault();
      ownerActivityFilters = {
        ...ownerActivityFilters,
        search:String(data.get('search')||'').trim(),
        category:String(data.get('category')||'all'),
        eventType:String(data.get('eventType')||'all'),
        userId:String(data.get('userId')||'all'),
        page:String(data.get('page')||'all'),
      };
      ownerActivityLoadedAt=0;
      renderOwnerActivity(false);
      await loadOwnerActivityData(true);
      return;
    }
    if (form.id === 'textbook-search-form') {
      event.preventDefault(); textbookQuery=String(data.get('query')||'').trim(); return renderTextbook();
    }
    if (form.id === 'textbook-note-form') {
      event.preventDefault(); const sectionId=String(data.get('sectionId')||''); const note=String(data.get('note')||'').slice(0,3000); persist({...state,textbookNotes:{...(state.textbookNotes||{}),[sectionId]:note}},{quiet:true}); showToast('Notes saved','Your notes are saved to this account on this device.','success'); return renderTextbookLesson();
    }
    if (form.classList?.contains('staff-role-form')) {
      event.preventDefault();
      await school.updateSchoolStaffRole(selectedSchoolId, data.get('userId'), data.get('staffRole'));
      showToast('Staff role updated', 'School permissions were updated.', 'success');
      return renderTeacherHub();
    }
    if (!form.id) return;
    if (form.id === 'create-school-form') {
      event.preventDefault();
      if (!canCreateSchoolAccount()) { showToast('Teacher account required','Teacher or Owner accounts can create a school.'); return; }
      const created = await school.createSchool({
        name:data.get('name'), code:data.get('code'), region:data.get('region'), country:data.get('country'), curriculum:data.get('curriculum'), yearLevels:data.getAll('yearLevels').map(Number),
      });
      selectedSchoolId = String(created.id || '');
      schoolHubTab = 'overview';
      showToast('School created', 'You are the Principal. Add staff, then create classes inside the school.', 'success');
      return renderTeacherHub();
    }
    if (form.id === 'add-school-staff-form') {
      event.preventDefault();
      await school.addSchoolStaff(selectedSchoolId, data.get('email'), data.get('staffRole'));
      showToast('Staff member added', `${schoolRoleLabel(data.get('staffRole'))} access is ready.`, 'success');
      return renderTeacherHub();
    }
    if (form.id === 'task-library-filter-form') {
      event.preventDefault();
      taskLibraryFilters = {
        query: String(data.get('query') || ''),
        yearLevel: data.get('yearLevel') || 'all',
        pathway: data.get('pathway') || 'all',
        strand: data.get('strand') || 'all',
        topic: data.get('topic') || 'all',
        skillId: data.get('skillId') || 'all',
        difficulty: data.get('difficulty') || 'all',
        type: data.get('type') || 'all',
        questionCount: data.get('questionCount') || 'all',
      };
      teacherHubTab = 'library';
      return renderTeacherHub();
    }
    if (form.id === 'quick-assign-form') {
      event.preventDefault();
      const task = getTaskById(data.get('taskId'));
      if (!task) throw new Error('That library task could not be found.');
      const assignmentTitle=String(data.get('assignmentTitle')||task.title).trim().slice(0,160);
      const textbookRef=String(data.get('textbookRef')||'').trim().slice(0,300);
      const createdAssignment = await school.createAndAssignTask({
        classId: data.get('classId'), title: assignmentTitle, type: task.type, topic: task.topic.toLowerCase(), lessonId: task.lessonId,
        difficulty: task.difficulty, questionCount: task.questionCount, requiredMastery: task.masteryTarget, taskLibraryId: task.id,
        dueAt: data.get('dueAt') ? new Date(data.get('dueAt')).toISOString() : null, hintsAllowed: task.type !== 'test', testMode: task.type === 'test',
        config:textbookRef?{textbook_reference:textbookRef,textbook_linked:true}:undefined,
      });
      if(createdAssignment?.id) void fireAndForgetRpc('mathsexpress_queue_parent_due_notifications',{p_assignment_id:String(createdAssignment.id)});
      document.getElementById('modal-root').innerHTML = '';
      showToast('Assignment sent', `${assignmentTitle} is now on the class dashboard.`, 'success');
      teacherHubTab = 'assignments'; schoolHubTab = 'assignments';
      return renderTeacherHub();
    }
    if (form.id === 'canvas-grade-passback-form') {
    try{const fd=new FormData(form);showToast('Sending grade','Contacting Canvas…');const data=await integrationRequest('canvas_grade_passback','canvas',{courseId:String(fd.get('courseId')||''),canvasAssignmentId:String(fd.get('canvasAssignmentId')||''),canvasUserId:String(fd.get('canvasUserId')||''),scorePercent:Number(fd.get('scorePercent'))});document.getElementById('modal-root').innerHTML='';showToast('Canvas grade sent',data.message||'Grade passback completed.','success');}catch(error){showToast('Grade passback failed',error.message||'Check Canvas IDs and permissions.');}
    return;
  }
  if (form.id === 'discussion-new-form') {
      event.preventDefault();
      const classId=String(data.get('classId')||activeDiscussionClassId||selectedStudentClassId||'');
      const body=String(data.get('body')||'').trim();
      if(!classId) throw new Error('Choose a class first.');
      if(body.length<2) throw new Error('Write a question first.');
      const {error}=await accountClient.ensureClient().rpc('mathsexpress_create_discussion_thread',{p_class_id:classId,p_subject:String(data.get('subject')||'Question'),p_body:body});
      if(error) throw error;
      showToast('Question sent','Your teacher can now see it in the class discussion.','success');
      return openDiscussionBoard(classId);
    }
    if (form.id === 'discussion-reply-form') {
      event.preventDefault();
      const threadId=String(data.get('threadId')||'');
      const body=String(data.get('body')||'').trim();
      if(!threadId||!body) throw new Error('Write a reply first.');
      const {error}=await accountClient.ensureClient().rpc('mathsexpress_reply_discussion_thread',{p_thread_id:threadId,p_body:body});
      if(error) throw error;
      showToast('Reply posted','The discussion has been updated.','success');
      return openDiscussionBoard(activeDiscussionClassId);
    }
    if (form.id === 'standards-growth-filter-form') {
      event.preventDefault();
      const schoolId=String(data.get('schoolId')||selectedSchoolId||'');
      const start=String(data.get('start')||'');
      const end=String(data.get('end')||'');
      const year=String(data.get('year')||'all');
      return loadStandardsGrowthReport({schoolId,start:start?`${start}T00:00:00`:new Date(Date.now()-90*86400000),end:end?`${end}T23:59:59`:new Date(),year});
    }
    if (form.id === 'join-class-form') {
      event.preventDefault();
      const code=String(data.get('code')||'').trim().toUpperCase();
      if(!/^[A-Z0-9]{6}$/.test(code)) throw new Error('Enter the 6-character class code from your teacher.');
      try {
        await school.joinClass(code);
      } catch(error) {
        const raw=String(error?.message||'');
        if(/not found|no class|invalid.*code|P0002|22P02/i.test(raw)) throw new Error('That class code was not found. Check the code and try again.');
        if(/already|duplicate|unique/i.test(raw)) throw new Error('You are already in this class.');
        if(/permission|policy|unauthorized|401|403/i.test(raw)) throw new Error('Your account could not join this class. Sign out, sign back in, then try again.');
        throw new Error(raw || 'The class could not be joined right now.');
      }
      await syncStudentLearningContextFromClasses();
      showToast('Class joined', `Your class year level and textbook focus are now applied automatically.`, 'success');
      return renderStudentHub();
    }
    if (form.id === 'create-class-form') {
      event.preventDefault(); const created=await school.createClass({ schoolId:data.get('schoolId') || selectedSchoolId, name:data.get('name'), yearLevel:data.get('yearLevel'), room:data.get('room') }); showToast('Class created', created?.roomUnavailable?'Class created. Run the v8.7 SQL migration to enable Room.':(data.get('room')?`Class created in room ${String(data.get('room'))}.`:'The class now lives inside this school.'), created?.roomUnavailable?'info':'success'); schoolHubTab='classes'; return renderTeacherHub();
    }
    if (form.id === 'create-assignment-form') {
      event.preventDefault();
      const classId=String(data.get('classId')||'');
      const cls=teacherHubClasses.find(c=>String(c.id)===classId);
      if(!cls) throw new Error('Choose a valid class.');
      const type=String(data.get('type')||'custom');
      if(type==='bulk-custom'||type==='bulk-adaptive') { document.getElementById('modal-root').innerHTML=''; return openBulkAssignModal(); }
      if(type==='template-sequence') { document.getElementById('modal-root').innerHTML=''; return openTemplateFoldersModal(); }
      const difficulty=String(data.get('difficulty')||'medium');
      const skillId=String(data.get('skillId')||'');
      const skill=CURRICULUM.find(x=>String(x.id)===skillId) || getCurriculumSkills({yearLevel:Number(cls.year_level)||9})[0];
      if(!skill) throw new Error('Choose a skill for this assignment.');
      const count=assignmentTypeQuestionCount(type,data.get('questionCount'));
      const libraryType=type==='custom'?'practice':type;
      let task=searchTaskLibrary({yearLevel:skill.yearLevel,skillId:skill.id,type:libraryType,difficulty,questionCount:count,limit:1})[0];
      if(!task) task=searchTaskLibrary({yearLevel:skill.yearLevel,skillId:skill.id,type:libraryType,difficulty,limit:1})[0];
      if(!task) task=searchTaskLibrary({yearLevel:skill.yearLevel,skillId:skill.id,type:'practice',difficulty,limit:1})[0];
      if(!task) throw new Error('MathsExpress could not build a question set for that skill.');
      const strict=assignmentTypeIsStrictTest(type);
      const title=String(data.get('title')||task.title||assignmentTypeLabel(type)).trim().slice(0,160);
      const startAt=data.get('startAt')?new Date(String(data.get('startAt'))).toISOString():null;
      const dueAt=data.get('dueAt')?new Date(String(data.get('dueAt'))).toISOString():null;
      await school.createAndAssignTask({classId,title,type,difficulty,questionCount:count,startAt,dueAt,topic:skill.topic,lessonId:type==='lesson'?skill.id:null,taskLibraryId:task.id,hintsAllowed:strict?false:data.get('hintsAllowed')==='on',tutorAllowed:!strict,videosAllowed:!strict,testMode:strict,calculatorEnabled:!strict,config:{assignment_workflow_type:type,skill_id:skill.id,year_level:skill.yearLevel,strict_test_mode:strict}});
      document.getElementById('modal-root').innerHTML='';
      showToast('Assignment created',`${assignmentTypeLabel(type)} · ${count} questions · ${skill.title}`,'success');
      teacherHubTab='assignments'; schoolHubTab='assignments'; return renderTeacherHub();
    }
    if (form.id === 'student-settings-form') {
      event.preventDefault(); const profile = await accountClient.updateProfileSettings({ username:null, yearLevel:data.get('yearLevel'), textbookFocus:null, accessibilityMode:data.get('accessibilityMode')==='on' }); account={...account,profile}; updateAccountChrome(); showToast('Settings saved', 'Your student settings have been updated.', 'success'); return renderStudentHub();
    }
    if (form.id === 'guardian-form') {
      event.preventDefault(); await school.addGuardian(data.get('email'), { weeklyProgress:data.get('weekly')==='on' }); showToast('Guardian added', 'Progress update preferences saved.', 'success'); form.reset(); return renderStudentHub();
    }
    if (form.id === 'assessment-generator-form') {
      event.preventDefault();
      const pool = TASK_LIBRARY.slice(0, Math.max(10, Number(data.get('count')) || 10));
      const pack = generateAssessmentPack(pool, { title:data.get('title'), count:data.get('count'), difficulty:data.get('difficulty'), calculator:data.get('calculator'), timeLimit:data.get('timeLimit') });
      const preview=document.getElementById('assessment-preview');
      if(preview) preview.innerHTML=`<div class="assessment-result"><span class="eyebrow">Generated</span><h3>${escapeHtml(pack.title)}</h3><p>${pack.count} questions · ${escapeHtml(pack.difficulty)} · ${escapeHtml(pack.calculator)} calculator · ${pack.timeLimit} min</p><div class="simple-modal-actions"><button type="button" class="btn secondary" data-action="download-generated-test" data-title="${escapeHtml(pack.title)}">Download / print</button><button type="button" class="btn primary" data-action="assign-generated-test">Send to Task Library</button></div></div>`;
      return;
    }
    if (form.id === 'custom-question-form') {
      event.preventDefault();
      const q={id:`custom-${Date.now()}`,type:String(data.get('type')||'numeric'),prompt:String(data.get('prompt')||'').slice(0,500),answer:String(data.get('answer')||'').slice(0,300),topic:String(data.get('topic')||'Mathematics').slice(0,100),createdAt:new Date().toISOString()};
      persist({...state,customQuestions:[...(state.customQuestions||[]),q].slice(-500),favoriteQuestionIds:[...(state.favoriteQuestionIds||[]),q.id].slice(-1000)},{quiet:true});
      const schoolId=selectedSchoolId||schoolHubSchools[0]?.id||null;
      if(schoolId){
        try { await school.saveCustomQuestion({schoolId,classId:selectedTeacherClassId||null,prompt:q.prompt,questionType:q.type==='algebra'?'numeric':q.type==='written-response'?'written':q.type,answer:q.answer,topic:q.topic,difficulty:'medium',favourite:true}); }
        catch(error){ showToast('Saved locally','Cloud question bank sync failed: '+(error.message||'try again later.')); }
      }
      showToast('Question saved','It is now in your favourites and custom question bank.','success'); document.getElementById('modal-root').innerHTML=''; return;
    }
    if (form.id === 'goal-form') {
      event.preventDefault();
      const metric=String(data.get('metric')||'custom');
      const baseline=metric==='questions'?(Number(state?.stats?.answered)||0):metric==='streak'?(Number(state?.streak)||0):0;
      const goal=createGoal({title:data.get('title'),target:data.get('target'),dueDate:data.get('dueDate'),metric,baseline});
      persist({...state,goals:[...(state.goals||[]),goal].slice(-50)},{quiet:true});
      try { const remote=await school.saveGoal({title:goal.title,target:goal.target,due:goal.dueDate||null,schoolId:selectedSchoolId||null}); if(remote?.id){goal.remoteId=remote.id; persist({...state,goals:(state.goals||[]).map(g=>g.id===goal.id?{...g,remoteId:remote.id}:g)},{quiet:true});} } catch {}
      showToast('Goal added','Your goal is now being tracked.','success'); return openGoalsModal();
    }
    if (form.id === 'calendar-item-form') {
      event.preventDefault(); const item={id:`event-${Date.now()}`,title:String(data.get('title')||'School event').slice(0,100),date:String(data.get('date')||''),type:String(data.get('type')||'School').slice(0,40)};
      persist({...state,calendarItems:[...(state.calendarItems||[]),item].slice(-200),notifications:[...(state.notifications||[]),{id:`notice-${Date.now()}`,title:'Calendar event added',body:item.title,type:'calendar',createdAt:new Date().toISOString()}].slice(-100)},{quiet:true}); document.getElementById('modal-root').innerHTML=''; showToast('Event added',item.title,'success'); return renderCalendar();
    }
    if (form.id === 'poll-form') {
      event.preventDefault(); livePoll=createPoll(data.get('question'),[data.get('a'),data.get('b'),data.get('c'),data.get('d')]);
      const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id||null; const schoolId=selectedSchoolId||teacherHubClasses.find(c=>c.id===classId)?.school_id||null;
      if(classId&&schoolId){ try { const remote=await school.createStudioContent({schoolId,classId,type:'quick-poll',title:livePoll.question,payload:{options:livePoll.options}}); livePoll.remoteId=remote?.id||null; } catch(error){ showToast('Poll is local only',error.message||'Cloud sync failed.'); } }
      document.getElementById('modal-root').innerHTML=''; activeToolTab='live'; showToast('Poll ready','Students can respond from the live-class preview.','success'); return renderTools();
    }
    if (form.id === 'announcement-form') {
      event.preventDefault(); const title=String(data.get('title')||'Announcement').slice(0,100), body=String(data.get('body')||'').slice(0,500);
      const classId=String(data.get('classId')||selectedTeacherClassId||'')||null; const schoolId=selectedSchoolId||teacherHubClasses.find(c=>String(c.id)===String(classId))?.school_id||schoolHubSchools[0]?.id||null;
      if(schoolId){ await school.createStudioContent({schoolId,classId,type:'announcement',title,body,payload:{audience:classId?'class':'school'}}); }
      persist({...state,notifications:[...(state.notifications||[]),{id:`notice-${Date.now()}`,title,body,type:'announcement',createdAt:new Date().toISOString()}].slice(-100)},{quiet:true}); document.getElementById('modal-root').innerHTML=''; showToast('Announcement posted',title,'success'); return;
    }
    if (form.id === 'auto-revision-form') {
      event.preventDefault(); const title=String(data.get('title')||'Revision').slice(0,100), dates=revisionPlanDates(data.get('testDate'),data.get('count')); if(!dates.length) throw new Error('Choose a valid test date.');
      const items=dates.map((d,i)=>({id:`revision-${Date.now()}-${i}`,title:`${title} · Revision ${i+1}`,date:d.toISOString().slice(0,10),type:'Revision'})); persist({...state,calendarItems:[...(state.calendarItems||[]),...items].slice(-200)},{quiet:true}); document.getElementById('modal-root').innerHTML=''; showToast('Revision plan created',`${items.length} sessions added before the test.`,'success'); return renderCalendar();
    }
    if (form.id === 'recurring-homework-form') {
      event.preventDefault(); const classId=String(data.get('classId')||''), title=String(data.get('title')||'Recurring homework').slice(0,100), dates=recurringDates(data.get('startDate'),data.get('frequency'),data.get('count')); if(!classId||!dates.length) throw new Error('Choose a class and first due date.');
      for(let i=0;i<dates.length;i++){ await school.createAndAssignTask({classId,title:`${title} ${i+1}`,type:'adaptive',difficulty:'medium',questionCount:10,dueAt:dates[i].toISOString(),hintsAllowed:true}); }
      const items=dates.map((d,i)=>({id:`hw-${Date.now()}-${i}`,title:`${title} ${i+1}`,date:d.toISOString().slice(0,10),type:'Assignment'})); persist({...state,calendarItems:[...(state.calendarItems||[]),...items].slice(-200)},{quiet:true}); document.getElementById('modal-root').innerHTML=''; showToast('Recurring homework scheduled',`${dates.length} assignments were created.`,'success'); return;
    }
    if (form.id === 'differentiated-assignment-form') {
      event.preventDefault(); const classId=String(data.get('classId')||''), title=String(data.get('title')||'Differentiated practice').slice(0,100), count=Number(data.get('count'))||10; if(!classId) throw new Error('Choose a class.');
      const members=await school.listClassMembers(classId); const students=members.map((m,i)=>({id:m.student_id,mastery:Number(m.student?.mastery||((i+1)*17)%100)})); const targets=buildDifferentiatedTargets(students); const rows=differentiateAssignment({title,questionCount:count});
      for(const row of rows){ const ids=(targets[row.group]||[]).map(x=>x.id); if(ids.length) await school.createAndAssignTask({classId,title:`${title} · ${row.group}`,type:'adaptive',difficulty:row.difficulty,questionCount:row.questionCount,hintsAllowed:row.hintsAllowed,targetStudentIds:ids}); }
      document.getElementById('modal-root').innerHTML=''; showToast('Differentiated work created','Support, Core and Extension students received targeted versions.','success'); return;
    }
    if (form.id === 'owner-broadcast-form') {
      event.preventDefault(); if(!canUseOwnerConsole(account)) throw new Error('Owner access required.');
      const title=String(data.get('title')||'MathsExpress update').slice(0,120), body=String(data.get('body')||'').slice(0,1000);
      const remote=await updatePlatformSettingsRemote({maintenanceMode:Boolean(state.ownerSettings?.maintenanceMode),maintenanceMessage:state.ownerSettings?.maintenanceMessage,broadcastTitle:title,broadcastBody:body});
      persist({...state,ownerSettings:{...(state.ownerSettings||{}),broadcastTitle:title,broadcastBody:body,updatedAt:remote.updated_at||new Date().toISOString()},notifications:[...(state.notifications||[]),{id:`broadcast-${Date.now()}`,title,body,type:'broadcast',createdAt:new Date().toISOString()}].slice(-100)},{quiet:true});
      document.getElementById('modal-root').innerHTML=''; showToast('Broadcast published','Signed-in users will see it in Notifications.','success'); return;
    }
    if (form.id === 'class-teacher-access-form') {
      event.preventDefault(); const result=await school.addClassTeacher(data.get('classId'),data.get('email'),data.get('reliefHours'));
      document.getElementById('modal-root').innerHTML=''; showToast(result?.mode==='relief'?'Relief access granted':'Co-teacher added',result?.mode==='relief'?'Temporary class access is active.':'Permanent class access is active.','success'); return;
    }
    if (form.id === 'school-branding-form') {
      event.preventDefault(); if(!selectedSchoolId) throw new Error('Choose a school first.');
      await school.setSchoolControls(selectedSchoolId,{featureFlags:state.featureFlags||{},branding:{displayName:String(data.get('displayName')||'').slice(0,100),logo:String(data.get('logo')||'').slice(0,300),accent:String(data.get('accent')||'olive').slice(0,30)}});
      document.getElementById('modal-root').innerHTML=''; showToast('Branding saved','School branding settings are stored in MathsExpress.','success'); return;
    }
    if (form.id === 'student-import-form') {
      event.preventDefault(); const raw=String(data.get('rows')||''); const rows=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map((line,i)=>{const parts=line.split(',').map(v=>v.trim()); if(i===0&&/email/i.test(parts[1]||'')) return null; return {name:parts[0]||'',email:parts[1]||'',yearLevel:Number(parts[2])||9};}).filter(r=>r&&r.email);
      if(!selectedSchoolId) throw new Error('Open a school first.'); if(!rows.length) throw new Error('Add at least one CSV row.');
      const result=await school.bulkAddStudents(selectedSchoolId,selectedTeacherClassId||null,rows); document.getElementById('modal-root').innerHTML=''; showToast('Student import finished',`${result?.added||0} existing accounts added${Array.isArray(result?.missing)&&result.missing.length?` · ${result.missing.length} emails need accounts`:''}.`,'success'); return;
    }
    if (form.id === 'change-password-form') {
      event.preventDefault(); await accountClient.changePassword(data.get('newPassword'), data.get('currentPassword')); showToast('Password changed', 'Your new password is active.', 'success'); form.reset(); return;
    }
  } catch (error) { event.preventDefault(); showToast('Couldn’t save', error.message || 'Please try again.'); }
}

const V7_FEATURE_GROUPS = Object.freeze([
  {title:'Learning intelligence',icon:'🧠',items:[
    ['Diagnostic placement test','A real starting-level check that saves weak and strong skills.','v7-diagnostic'],
    ['Prerequisite skill map','See which skills are locked and exactly what must be mastered first.','v7-prereq-map'],
    ['True mastery engine','Mastery can rise or fall using accuracy, hints, difficulty and spaced-review decay.','v7-mastery-engine'],
    ['Automatic intervention groups','Build Support, Revision, Core and Extension groups from class data.','v7-intervention-groups'],
    ['Symbolic answer checker','Recognise equivalent algebra such as 2(x+3) and 2x+6.','v7-symbolic-checker'],
    ['Equation & graph checker','Check coordinate points against an equation with tolerance.','v7-graph-checker'],
  ]},
  {title:'Creation & curriculum',icon:'✎',items:[
    ['Maths handwriting input','Draw working with mouse/stylus and keep a typed maths fallback.','v7-handwriting'],
    ['Working-out pad','Digital rough-work paper beside practice with save/clear controls.','v7-working-pad'],
    ['Teacher question builder','Create original short-answer, multiple-choice and reasoning questions.','v7-question-builder'],
    ['Question-bank versioning','Save editable question/resource versions instead of overwriting originals.','v7-question-versions'],
    ['Worksheet import','Import TXT/CSV worksheet text and turn lines into editable questions.','v7-worksheet-import'],
    ['Assignment templates','Save reusable assignment setups for a class or school.','v7-assignment-template'],
    ['Shared teacher resource library','Store and browse school-shared teacher resources.','v7-resource-library'],
    ['Curriculum outcome mapping','Map current skills to NSW/Australian-style curriculum outcome codes.','v7-outcome-map'],
  ]},
  {title:'Teacher analytics & live class',icon:'👨‍🏫',items:[
    ['Report comment generator','Create an editable progress comment from real MathsExpress progress.','v7-report-comment'],
    ['Class mastery heatmap','Compare students against skills and spot gaps quickly.','v7-class-heatmap'],
    ['Misconception analytics','Group common sign, arithmetic, fraction and algebra mistakes.','v7-misconceptions'],
    ['Question analytics','Flag questions that look too easy, too hard or frequently skipped.','v7-question-analytics'],
    ['Live teacher screen','See class members, focus state, help queue and recent work in one screen.','v7-live-teacher'],
    ['Raise Hand','Students can privately join a teacher help queue.','v7-raise-hand'],
    ['Teacher whiteboard','Publish a class worked example or instruction card.','v7-whiteboard'],
    ['Exit tickets','Build a quick three-question end-of-lesson check.','v7-exit-ticket'],
    ['Revision generator','Build weak-skill revision from recent mastery and mistakes.','v7-revision-generator'],
    ['Exam generator','Create an exam outline with equivalent A–D versions.','v7-exam-generator'],
    ['Rubric marking','Build method/reasoning/final-answer marking criteria.','v7-rubric'],
  ]},
  {title:'Student progression & community',icon:'★',items:[
    ['Student portfolio','Collect best work, badges, feedback and mastery snapshots.','v7-portfolio'],
    ['Certificates','Create printable certificates for progress and mastery.','v7-certificate'],
    ['School achievements','Unlock whole-school milestones for participation and mastery.','v7-school-achievements'],
    ['Teams & maths clubs','Create school/class team or club structures.','v7-teams'],
    ['Season system','Term-based quests, rewards and seasonal progress.','v7-season'],
    ['Safe friend challenges','Use school-controlled challenge invites and preset messages only.','v7-safe-social'],
    ['Daily puzzle','One deterministic puzzle each day with a separate puzzle streak.','v7-daily-puzzle'],
    ['Escape-room maths','Solve maths rooms and codes to escape.','v7-escape-room'],
    ['Maths adventure campaign','Progress through topic worlds and mastery bosses.','v7-adventure'],
  ]},
  {title:'Competition & school events',icon:'🏆',items:[
    ['Teacher-created tournaments','Create class or school maths tournaments from real classes.','open-tournament'],
    ['Spectator scoreboard','Project a clean live class-game scoreboard.','v7-spectator'],
    ['School-v-school challenge setup','Prepare year-level matched inter-school events with moderation controls.','open-inter-school'],
  ]},
  {title:'Integrations & school operations',icon:'↔',items:[
    ['Offline / PWA mode','Cache the core app shell and show offline readiness.','open-offline-status'],
    ['Google school login','OAuth wiring is ready once the school Google provider is configured.','v7-google-login'],
    ['Microsoft school login','Azure/Entra OAuth wiring is ready once the provider is configured.','v7-microsoft-login'],
    ['Google Classroom','Connection workflow and import/sync mapping screen.','v7-google-classroom'],
    ['Microsoft Teams','Connection workflow and Teams assignment mapping screen.','v7-microsoft-teams'],
    ['CSV / SIS import','Import class/student rows from CSV with preview and validation.','v7-sis-import'],
    ['Automatic class rollover','Prepare a new-year class copy without copying submissions.','v7-class-rollover'],
    ['Temporary substitute access','Give a teacher time-limited class access.','v7-substitute'],
    ['Teacher co-ownership','Add another teacher to the selected class.','v7-co-teacher'],
  ]},
  {title:'Platform management & reliability',icon:'⚙',items:[
    ['Permission builder','Owner can control role permissions such as beta, support and content tools.','v7-permissions'],
    ['Audit timeline','Review role/settings/content changes and local audit entries.','v7-audit'],
    ['Undo admin actions','Record reversible platform actions and recovery notes.','v7-undo'],
    ['Platform status page','Show website, database, AI and offline-cache health.','v7-status'],
    ['Feature testing groups','Stage features for Bug Testers, pilot schools or a percentage rollout.','v7-staging'],
    ['In-app changelog','Publish and display What’s New notes.','v7-changelog'],
    ['Feedback voting','Authenticated users can vote on proposed MathsExpress features.','v7-feature-voting'],
    ['Bug attachments','Bug reports can store local screenshot/video filenames and notes.','v7-bug-attachments'],
    ['AI content quality check','Check generated questions for missing answers, duplicates and weak wording.','v7-ai-quality'],
    ['AI teacher copilot','Build a complete lesson outline, practice and exit ticket from a topic.','v7-teacher-copilot'],
    ['AI error coach','Explain the likely misconception rather than only saying “wrong”.','v7-error-coach'],
    ['Voice tutor','Use browser speech input when available, with typed fallback.','v7-voice-tutor'],
    ['Read-aloud maths','Read equations and instructions aloud with browser speech synthesis.','v7-read-aloud'],
    ['Language support','Switch common maths UI/help phrases while leaving equations unchanged.','open-language-tools'],
    ['Privacy dashboard','Show what MathsExpress stores and what it deliberately does not collect.','v7-privacy'],
    ['Automatic backups','Create downloadable backup snapshots and shared backup manifests.','v7-backups'],
    ['Staging mode','Preview selected features with testers before broad release.','v7-staging'],
  ]},
]);

function v7CurrentClassId(){
  return selectedTeacherClassId || activeSchoolAssignment?.classId || teacherHubClasses.find(c=>!c.archived)?.id || '';
}
function v7CurrentSchoolId(){
  return selectedSchoolId || teacherHubClasses.find(c=>String(c.id)===String(v7CurrentClassId()))?.school_id || teacherHubClasses[0]?.school_id || '';
}
function v7FeatureCount(){ return V7_FEATURE_GROUPS.reduce((n,g)=>n+g.items.length,0); }
function v7RoleNotice(){
  const role=account.profile?.role||'player';
  if(role==='player') return 'Student tools are ready. Teacher/admin cards will explain when extra permission is required.';
  if(role==='parent') return 'Parent accounts can use linked-child reports and communication while school controls remain protected.';
  return `${platformRoleLabel(role)} tools are available according to your current platform and school permissions.`;
}
function renderV7Hub(){
  const view=document.getElementById('app-view'); if(!view)return;
  const season=seasonDefinition(new Date());
  const puzzle=dailyPuzzle(localDateString(),normaliseYearLevel(account.profile?.yearLevel));
  const diag=(state.v7DiagnosticHistory||[]).at(-1);
  view.innerHTML=`<div class="page v7-page">
    <section class="v7-hero"><div><span class="eyebrow">MathsExpress v7</span><h1>Next-generation school platform</h1><p>${escapeHtml(v7RoleNotice())}</p><div class="v7-hero-actions"><button class="btn primary" data-action="v7-diagnostic">Run diagnostic</button><button class="btn secondary" data-action="v7-daily-puzzle">Today’s puzzle</button><button class="btn secondary" data-route="tools">Existing Power Tools</button></div></div><div class="v7-hero-metrics"><div><b>${v7FeatureCount()}</b><small>v7 tools</small></div><div><b>${diag?Math.round(diag.accuracy*100)+'%':'—'}</b><small>last diagnostic</small></div><div><b>${escapeHtml(season.id)}</b><small>current season</small></div><div><b>${escapeHtml(puzzle.dateKey.slice(5))}</b><small>daily puzzle</small></div></div></section>
    <section class="v7-progress-strip"><div><strong>Built into this version</strong><span>Adaptive learning · school workflows · analytics · safe collaboration · integrations wiring · admin controls</span></div><div class="status-banner success"><b>Privacy rule:</b> focus tracking can show MathsExpress active/hidden/idle only. It never reveals the other site/app content.</div></section>
    ${V7_FEATURE_GROUPS.map(group=>`<section class="v7-group"><div class="section-heading"><div><span class="eyebrow">${group.icon} v7</span><h2>${escapeHtml(group.title)}</h2></div><span>${group.items.length} tools</span></div><div class="v7-grid">${group.items.map(([title,desc,action])=>`<article class="v7-card"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p></div><button class="btn secondary small" data-action="${escapeHtml(action)}">Open</button></article>`).join('')}</div></section>`).join('')}
  </div>`;
}

function v7DiagnosticQuestions(year=9){
  const y=Math.max(0,Math.min(12,Number(year)||9));
  return [
    {id:'d1',skill:'integer-operations',strand:'Number',prompt:'Evaluate 18 − 7 × 2.',answer:'4'},
    {id:'d2',skill:'fractions',strand:'Number',prompt:'What is 3/4 + 1/8? Give a simplified fraction.',answer:'7/8'},
    {id:'d3',skill:'percentages',strand:'Number',prompt:'Find 15% of 240.',answer:'36'},
    {id:'d4',skill:'linear-equations',strand:'Algebra',prompt:'Solve 3x + 5 = 26.',answer:'7'},
    {id:'d5',skill:'indices',strand:'Algebra',prompt:'Evaluate 2^5.',answer:'32'},
    {id:'d6',skill:'coordinates',strand:'Geometry',prompt:'The midpoint of (2,4) and (8,10) is written x,y. Enter x,y.',answer:'5,7'},
    ...(y>=9?[{id:'d7',skill:'pythagoras',strand:'Geometry',prompt:'A right triangle has shorter sides 6 and 8. Find the hypotenuse.',answer:'10'}]:[]),
    ...(y>=10?[{id:'d8',skill:'quadratics',strand:'Algebra',prompt:'Solve x^2 = 49. Enter the positive solution.',answer:'7'}]:[]),
  ];
}
function v7OpenDiagnostic(){
  const q=v7DiagnosticQuestions(normaliseYearLevel(account.profile?.yearLevel));
  openSimpleModal('Diagnostic Placement Test',`<form id="v7-diagnostic-form" class="v7-diagnostic-form"><p class="muted">This short diagnostic checks several prerequisite areas. It does not affect school grades.</p>${q.map((x,i)=>`<label><span>${i+1}. ${mathHtml(x.prompt)}</span><input name="${x.id}" autocomplete="off" required></label>`).join('')}<button class="btn primary" type="submit">Mark diagnostic</button></form>`);
}
function v7OpenPrereqMap(){
  const year=normaliseYearLevel(account.profile?.yearLevel); const rows=prerequisiteMap(learningPathRows(year));
  openSimpleModal('Skill Prerequisite Map',`<div class="v7-prereq-list">${rows.slice(0,40).map(r=>`<article class="${r.unlocked?'ready':'locked'}"><span>${r.unlocked?'✓':'🔒'}</span><div><strong>${escapeHtml(r.skill||r.title||r.id)}</strong><small>${escapeHtml(r.strand||'Maths')} · ${Math.round(r.mastery||0)}% mastery${r.prerequisites?.length?` · needs ${escapeHtml(r.prerequisites.join(', '))}`:''}</small></div></article>`).join('')}</div>`);
}
function v7OpenMasteryEngine(){
  const skill=recommendedLearningPathSkill(); const current=skillMasteryValue(skill?.id||'');
  const correct=updateTrueMastery({mastery:current,correct:true,hintsUsed:0,difficulty:'medium',responseTimeMs:25000,daysSincePractice:0});
  const hinted=updateTrueMastery({mastery:current,correct:true,hintsUsed:2,difficulty:'medium',responseTimeMs:50000,daysSincePractice:0});
  const gap=updateTrueMastery({mastery:current,correct:true,hintsUsed:0,difficulty:'medium',responseTimeMs:30000,daysSincePractice:21});
  openSimpleModal('True Mastery Engine',`<h3>${escapeHtml(skill?.skill||'Example skill')}</h3><div class="owner-analytics-strip"><div><b>${current}%</b><small>current</small></div><div><b>${correct}%</b><small>correct, no hints</small></div><div><b>${hinted}%</b><small>correct, 2 hints</small></div><div><b>${gap}%</b><small>after 21-day gap</small></div></div><p>v7 mastery considers difficulty, hints, recent performance and time since practice, so mastery can rise or fall instead of only increasing.</p>`);
}
function v7OpenSymbolicChecker(){
  openSimpleModal('Symbolic Maths Checker',`<form id="v7-symbolic-form" class="school-form"><label>Student expression<input name="left" value="2(x+3)" required></label><label>Expected expression<input name="right" value="2x+6" required></label><button class="btn primary" type="submit">Check equivalence</button><div id="v7-symbolic-output" class="v7-result-box"></div></form>`);
}
function v7OpenGraphChecker(){
  openSimpleModal('Equation & Graph Checker',`<form id="v7-graph-form" class="school-form"><label>Expected equation y = <input name="expression" value="2*x+1" required></label><label>Student points (one x,y pair per line)<textarea name="points" rows="6">0,1\n1,3\n2,5\n3,7</textarea></label><label>Tolerance<input name="tolerance" type="number" step="0.05" min="0" max="2" value="0.25"></label><button class="btn primary" type="submit">Check plotted points</button><div id="v7-graph-output" class="v7-result-box"></div></form>`);
}
function v7SketchModal(title,kind='handwriting'){
  openSimpleModal(title,`<div class="v7-sketch-wrap"><canvas id="v7-sketch-canvas" width="900" height="420" aria-label="Maths working canvas"></canvas><div class="simple-modal-actions"><button class="btn secondary" data-action="v7-clear-sketch">Clear canvas</button><button class="btn secondary" data-action="v7-save-sketch">Save snapshot</button></div><label>Typed maths fallback<textarea id="v7-sketch-text" rows="4" placeholder="Type your working here if handwriting is not convenient."></textarea></label><p class="muted">The drawing stays inside MathsExpress. v7 does not send handwriting to an external recognition service unless a school later connects one.</p></div>`);
  setTimeout(v7InitSketchCanvas,0);
}
function v7InitSketchCanvas(){
  const canvas=document.getElementById('v7-sketch-canvas'); if(!canvas||canvas.dataset.ready)return; canvas.dataset.ready='1'; const ctx=canvas.getContext('2d'); if(!ctx)return; ctx.lineWidth=3; ctx.lineCap='round'; ctx.strokeStyle='#2d2b27'; let drawing=false;
  const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}};
  canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture?.(e.pointerId);const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y)});
  canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke()});
  const stop=()=>drawing=false;canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('pointerleave',stop);
}
function v7QuestionBuilder(){
  openSimpleModal('Teacher Question Builder',`<form id="v7-question-builder-form" class="school-form"><label>Question type<select name="type"><option value="short">Short answer</option><option value="multiple-choice">Multiple choice</option><option value="reasoning">Reasoning / teacher review</option><option value="graph">Graph / coordinate</option></select></label><label>Prompt<textarea name="prompt" rows="4" required placeholder="Write the question"></textarea></label><label>Expected answer<input name="answer" required></label><label>Options (for multiple choice, separated by |)<input name="options" placeholder="12 | 14 | 16 | 18"></label><div class="form-two"><label>Topic<input name="topic" value="Algebra"></label><label>Difficulty<select name="difficulty"><option>easy</option><option selected>medium</option><option>hard</option></select></label></div><button class="btn primary" type="submit">Quality-check & save</button></form>`);
}
function v7WorksheetImport(){
  openSimpleModal('Worksheet Import',`<form id="v7-worksheet-import-form" class="school-form"><label>Upload TXT / CSV / Markdown<input name="file" type="file" accept=".txt,.csv,.md,text/plain,text/csv"></label><label>Or paste worksheet text<textarea name="text" rows="10" placeholder="1. Solve 3x + 5 = 20\n2. Find 25% of 80"></textarea></label><button class="btn primary" type="submit">Create editable draft questions</button><p class="muted">PDFs can still be attached to a bug/resource record, but v7 does not pretend to OCR image-only PDFs. Paste or export the worksheet text for reliable question conversion.</p></form>`);
}
function v7AssignmentTemplate(){
  const classId=v7CurrentClassId();
  openSimpleModal('Assignment Template',`<form id="v7-template-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><label>Template name<input name="title" value="Year ${normaliseYearLevel(account.profile?.yearLevel)} Mixed Revision" required></label><label>Folder / subfolder<input name="folder" value="/Year ${normaliseYearLevel(account.profile?.yearLevel)}/Revision" placeholder="/Year 9/Algebra/Term 2"></label><div class="form-two"><label>Questions<input name="questions" type="number" min="5" max="100" value="20"></label><label>Difficulty<select name="difficulty"><option>adaptive</option><option>easy</option><option>medium</option><option>hard</option></select></label></div><label>Sharing<select name="shareScope"><option value="private">Private</option><option value="school">Share with school</option><option value="district">Share across district</option></select></label><label><input name="ai" type="checkbox" checked> AI helper allowed</label><label><input name="games" type="checkbox"> Game rewards allowed during task</label><button class="btn primary" type="submit">Save template</button></form>`);
}
function v7ResourceLibrary(){
  const schoolId=v7CurrentSchoolId();
  openSimpleModal('Shared Teacher Resource Library','<div class="school-loading"><span class="spinner"></span><strong>Loading resources…</strong></div>');
  getSchoolClient().v7ListObjects({type:'resource',schoolId:schoolId||null}).then(rows=>openSimpleModal('Shared Teacher Resource Library',`<form id="v7-resource-form" class="school-form"><input type="hidden" name="schoolId" value="${escapeHtml(schoolId)}"><label>Resource title<input name="title" required placeholder="Year 9 Linear Equations Review"></label><label>Resource notes<textarea name="body" rows="4"></textarea></label><button class="btn primary" type="submit">Share with school</button></form><div class="simple-list">${rows.length?rows.map(r=>`<div><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.visibility)} · ${new Date(r.updated_at).toLocaleDateString()}</span></div>`).join(''):'<p>No shared v7 resources yet.</p>'}</div>`)).catch(e=>openSimpleModal('Shared Teacher Resource Library',`<p>${escapeHtml(e.message)}</p>`));
}
function v7OutcomeMap(){
  const skills=outcomeMap(getCurriculumSkills({yearLevel:normaliseYearLevel(account.profile?.yearLevel)}).slice(0,60));
  openSimpleModal('Curriculum Outcome Mapping',`<div class="v7-outcome-grid">${skills.map(s=>`<article><strong>${escapeHtml(s.outcome)}</strong><span>${escapeHtml(s.skill||s.title||s.id)}</span><small>${escapeHtml(s.strand||'Mathematics')}</small></article>`).join('')}</div>`);
}
function v7ReportComment(){
  const model=buildProfileModel(state); const weak=learningPathRows(normaliseYearLevel(account.profile?.yearLevel)).sort((a,b)=>a.mastery-b.mastery).slice(0,2).map(x=>x.skill||x.id); const strong=learningPathRows(normaliseYearLevel(account.profile?.yearLevel)).sort((a,b)=>b.mastery-a.mastery).slice(0,2).map(x=>x.skill||x.id);
  const comment=reportComment({name:state.playerName,accuracy:model.accuracy,mastery:state.mastery?.algebra||0,completed:state.stats?.answered||0,weakSkills:weak,strongSkills:strong});
  openSimpleModal('Editable Report Comment',`<textarea class="v7-big-text" id="v7-report-comment" rows="8">${escapeHtml(comment)}</textarea><div class="simple-modal-actions"><button class="btn primary" data-action="v7-copy-report-comment">Copy comment</button><button class="btn secondary" data-action="v7-save-report-comment">Save draft</button></div><p class="muted">AI/report drafts should always be reviewed by the teacher before being used in an official school report.</p>`);
}
function v7Misconceptions(){
  const attempts=(state.mistakeBook||[]).map((m,i)=>({studentId:account.profile?.userId,prompt:m.prompt,expected:m.expectedAnswer||'',actual:m.answer||'',topic:m.topic||m.skill||'',hintsUsed:m.hintsUsed||0,errorType:m.errorType||''}));
  const rows=misconceptionAnalytics(attempts);
  openSimpleModal('Misconception Analytics',rows.length?`<div class="simple-list">${rows.map(r=>`<div><strong>${escapeHtml(r.type)}</strong><span>${r.count} occurrence${r.count===1?'':'s'}${r.studentCount?` · ${r.studentCount} student${r.studentCount===1?'':'s'}`:''}</span></div>`).join('')}</div>`:'<p>No saved mistakes yet. This fills automatically as students practise.</p>');
}
function v7QuestionAnalytics(){
  const attempts=(state.v7QuestionAttempts||state.mistakeBook||[]).map((m,i)=>({questionId:m.questionId||`q-${i+1}`,prompt:m.prompt||'Practice question',correct:Boolean(m.correct),skipped:Boolean(m.skipped),responseTimeMs:Number(m.responseTimeMs)||30000}));
  const rows=questionAnalytics(attempts);
  openSimpleModal('Question Analytics',rows.length?`<div class="v7-analytics-table"><div class="head"><b>Question</b><b>Attempts</b><b>Accuracy</b><b>Avg time</b><b>Flag</b></div>${rows.slice(0,30).map(r=>`<div><span>${escapeHtml(r.prompt)}</span><span>${r.attempts}</span><span>${Math.round(r.accuracy*100)}%</span><span>${r.avgSeconds}s</span><span>${escapeHtml(r.flag)}</span></div>`).join('')}</div>`:'<p>Question analytics will populate after students attempt practice items.</p>');
}
function v7OpenHelpQueue(){
  const classId=v7CurrentClassId(); if(!classId)return showToast('Choose a class first','Open a class in the School area.');
  openSimpleModal('Live Help Queue','<div class="school-loading"><span class="spinner"></span><strong>Loading help requests…</strong></div>');
  getSchoolClient().v7HelpQueue(classId).then(rows=>openSimpleModal('Live Help Queue',rows.length?`<div class="simple-list">${rows.map(r=>`<div><strong>${escapeHtml(r.display_name)}</strong><span>${escapeHtml(r.message)} · ${new Date(r.created_at).toLocaleTimeString()}</span><button class="btn ghost small" data-action="v7-resolve-help" data-help-id="${r.id}">Resolve</button></div>`).join('')}</div>`:'<p>No students are waiting for help.</p>')).catch(e=>showToast('Help queue unavailable',e.message));
}
function v7RaiseHand(){
  const classId=activeSchoolAssignment?.classId||'';
  if(classId){openSimpleModal('Raise Hand',`<form id="v7-raise-hand-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><label>What do you need help with?<input name="message" value="I need help with this question"></label><button class="btn primary" type="submit">Join help queue</button></form>`);return;}
  getSchoolClient().listStudentClasses().then(rows=>{const classes=rows.map(r=>r.class).filter(Boolean);if(!classes.length)return showToast('Join a class first','Raise Hand works inside a MathsExpress class.');openSimpleModal('Raise Hand',`<form id="v7-raise-hand-form" class="school-form"><label>Class<select name="classId">${classes.map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join('')}</select></label><label>What do you need help with?<input name="message" value="I need help with this question"></label><button class="btn primary" type="submit">Join help queue</button></form>`);}).catch(e=>showToast('Could not load classes',e.message));
}
function v7Whiteboard(){
  const classId=v7CurrentClassId(); if(!classId)return showToast('Choose a class first','Whiteboards are published to a class.');
  openSimpleModal('Teacher Live Whiteboard',`<form id="v7-whiteboard-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><label>Title<input name="title" value="Worked Example" required></label><label>Board content<textarea name="body" rows="8" placeholder="3x + 5 = 20\n3x = 15\nx = 5"></textarea></label><button class="btn primary" type="submit">Publish to class</button></form>`);
}
function v7RevisionGenerator(){
  const rows=learningPathRows(normaliseYearLevel(account.profile?.yearLevel)).sort((a,b)=>a.mastery-b.mastery).slice(0,8); const tasks=rows.map(s=>({skill:s,task:taskForLearningSkill(s,'revision',10)}));
  openSimpleModal('Personal Revision Generator',`<p>Built from your lowest-mastered unlocked skills.</p><div class="simple-list">${tasks.map(({skill,task},i)=>`<div><strong>${i+1}. ${escapeHtml(skill.skill||skill.id)}</strong><span>${Math.round(skill.mastery)}% mastery · ${task?escapeHtml(task.title||task.id):'practice bank'}</span></div>`).join('')}</div><button class="btn primary" data-action="start-mixed-revision">Start mixed revision</button>`);
}
function v7Portfolio(){
  const snap=portfolioSnapshot({name:state.playerName,mastery:state.skillMasteryMap||state.mastery||{},achievements:state.achievements||[],feedback:state.teacherFeedback||[],bestWork:state.v7BestWork||[]});
  openSimpleModal('Student Portfolio',`<div class="owner-analytics-strip"><div><b>${snap.averageMastery}%</b><small>average mastery</small></div><div><b>${snap.achievements.length}</b><small>recent badges</small></div><div><b>${snap.bestWork.length}</b><small>saved work</small></div></div><div class="simple-modal-actions"><button class="btn primary" data-action="v7-save-portfolio">Save snapshot</button><button class="btn secondary" data-action="v7-download-portfolio">Download summary</button></div>`);
}
function v7Season(){
  const season=seasonDefinition(new Date()); const progress=state.v7SeasonProgress||{};
  openSimpleModal(season.name,`<h3>${escapeHtml(season.theme)} Season</h3><div class="simple-list">${season.quests.map(q=>`<div><strong>${escapeHtml(q.label)}</strong><span>${Math.min(q.target,Number(progress[q.id])||0)}/${q.target}</span></div>`).join('')}</div><p>Season progress is separate from school grades and resets each term.</p>`);
}
function v7DailyPuzzle(){
  const p=dailyPuzzle(localDateString(),normaliseYearLevel(account.profile?.yearLevel));
  openSimpleModal('Daily Maths Puzzle',`<form id="v7-daily-puzzle-form" class="school-form"><input type="hidden" name="puzzleKey" value="${escapeHtml(p.id)}"><input type="hidden" name="answerKey" value="${escapeHtml(p.answer)}"><h3>${mathHtml(p.prompt)}</h3><label>Your answer<input name="answer" required autocomplete="off"></label><button class="btn primary" type="submit">Check puzzle</button></form>`);
}
function v7EscapeRoom(){
  const room=escapeRoom(`${account.profile?.userId||'guest'}:${localDateString()}`); openSimpleModal('Maths Escape Room',`<p>Clear each room in order. The full adventure uses the same practice engine as normal MathsExpress.</p><div class="v7-worlds">${room.rooms.map((r,i)=>`<article><span>${i+1}</span><div><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.difficulty)} · code locked</small></div></article>`).join('')}</div><button class="btn primary" data-action="start-mixed-revision">Start first maths challenge</button>`);
}
function v7Adventure(){
  openSimpleModal('Maths Adventure Campaign',`<div class="v7-worlds">${adventureWorlds().map((w,i)=>`<article><span>${i+1}</span><div><strong>${escapeHtml(w.name)}</strong><small>${escapeHtml(w.skills.join(' · '))}</small><p>Boss: ${escapeHtml(w.boss)}</p></div></article>`).join('')}</div><button class="btn primary" data-route="learning-path">Use Learning Path to unlock worlds</button>`);
}
function v7SafeSocial(){
  openSimpleModal('Safe Friend Challenges',`<p>MathsExpress does not use unrestricted student DMs. Challenges can use school/class membership and preset messages.</p><div class="v7-message-chips">${safeMessages().map(m=>`<button class="btn ghost small" data-action="v7-safe-message" data-message="${escapeHtml(m)}">${escapeHtml(m)}</button>`).join('')}</div>`);
}
function v7Spectator(){
  const game=activeClassGame; if(!game)return openSimpleModal('Spectator Scoreboard',`<p>Start or join a live class game first. This view is designed for a classroom projector and shows scores only—not private answers.</p><button class="btn primary" data-route="games">Open Games</button>`);
  const board=game.leaderboard||[];openSimpleModal('Spectator Scoreboard',`<div class="v7-scoreboard">${board.slice(0,20).map((r,i)=>`<div><b>${i+1}</b><span>${escapeHtml(r.display_name||'Student')}</span><strong>${Number(r.score)||0}</strong></div>`).join('')}</div>`);
}
function v7IntegrationModal(id){
  const item=integrationCatalogV7().find(x=>x.id===id); if(!item)return;
  openSimpleModal(item.name,`<div class="integration-status-card"><span class="status-dot waiting"></span><div><h3>Code path ready</h3><p>${escapeHtml(item.needs)}</p><p class="muted">No OAuth secret is stored in the browser. The external provider must be configured by the school/platform owner before live syncing can run.</p></div></div>${id==='google-sso'?'<button class="btn primary" data-action="v7-oauth-google">Try Google login</button>':''}${id==='microsoft-sso'?'<button class="btn primary" data-action="v7-oauth-azure">Try Microsoft login</button>':''}`);
}
function v7SisImport(){
  openSimpleModal('CSV / SIS Import',`<form id="v7-sis-form" class="school-form"><label>Upload CSV<input name="file" type="file" accept=".csv,text/csv"></label><label>Or paste CSV<textarea name="text" rows="9">display_name,email,year_level\nStudent Example,student@example.edu.au,9</textarea></label><button class="btn primary" type="submit">Preview import</button></form>`);
}
function v7ClassRollover(){
  const c=teacherHubClasses.find(x=>String(x.id)===String(v7CurrentClassId()))||teacherHubClasses[0]; if(!c)return showToast('Choose a class first','Open School → Classes.');
  openSimpleModal('Automatic Class Rollover',`<div class="status-banner warning"><b>Preview only until confirmed</b></div><p>Current: <b>${escapeHtml(c.name)}</b> · Year ${c.year_level}</p><form id="v7-rollover-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(c.id)}"><label>New class name<input name="name" value="${escapeHtml(c.name)} ${new Date().getFullYear()+1}" required></label><label>New year level<input name="yearLevel" type="number" min="0" max="12" value="${Math.min(12,Number(c.year_level)+1)}"></label><label><input name="copyStudents" type="checkbox" checked> Copy student memberships (not submissions/results)</label><button class="btn primary" type="submit">Create next-year class</button></form>`);
}
function v7CoTeacher(kind='co'){
  const c=teacherHubClasses.find(x=>String(x.id)===String(v7CurrentClassId()))||teacherHubClasses[0]; if(!c)return showToast('Choose a class first','Open a class first.');
  const sub=kind==='sub'; openSimpleModal(sub?'Temporary Substitute Access':'Teacher Co-ownership',`<form id="${sub?'v7-substitute-form':'v7-coteacher-form'}" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(c.id)}"><label>Teacher email<input name="email" type="email" required placeholder="teacher@education.nsw.gov.au"></label>${sub?'<label>Access expires<input name="expires" type="datetime-local" required></label>':''}<button class="btn primary" type="submit">${sub?'Grant temporary access':'Add co-teacher'}</button></form>`);
}
function v7Permissions(){
  if(!canUseOwnerConsole(account))return showToast('Owner only','Only the Owner can change platform role permissions.');
  const catalog=permissionCatalog();openSimpleModal('Role Permission Builder','<div class="school-loading"><span class="spinner"></span><strong>Loading permissions…</strong></div>');
  getSchoolClient().v7RolePermissions().then(saved=>{const map=new Map(saved.map(x=>[`${x.role}:${x.permission_key}`,x.allowed]));openSimpleModal('Role Permission Builder',`<form id="v7-permissions-form" class="v7-permission-form">${Object.entries(catalog).filter(([r])=>r!=='owner').map(([role,perms])=>`<section><h3>${escapeHtml(platformRoleLabel(role))}</h3>${perms.map(p=>`<label><input type="checkbox" name="perm" value="${escapeHtml(role)}|${escapeHtml(p)}" ${map.get(`${role}:${p}`)!==false?'checked':''}> ${escapeHtml(p.replaceAll('-',' '))}</label>`).join('')}</section>`).join('')}<button class="btn primary" type="submit">Save permissions</button></form>`)}).catch(e=>showToast('Permissions unavailable',e.message));
}
function v7Audit(){
  const rows=(state.localAuditLog||[]).slice(-30).reverse();openSimpleModal('Audit Timeline',rows.length?`<div class="v7-timeline">${rows.map(r=>`<article><time>${escapeHtml(r.createdAt||'')}</time><div><strong>${escapeHtml(r.action||'Action')}</strong><p>${escapeHtml(r.actor||state.playerName)} → ${escapeHtml(r.target||'MathsExpress')}</p></div></article>`).join('')}</div>`:'<p>No local audit entries yet. Supabase also stores protected platform audit records for server-side admin actions.</p>');
}
function v7Status(){
  const s=statusSnapshot({online:navigator.onLine,supabase:Boolean(account.authenticated),ai:true,serviceWorker:'serviceWorker' in navigator});openSimpleModal('Platform Status',`<div class="status-banner ${s.overall==='operational'?'success':'warning'}"><b>${escapeHtml(s.overall.toUpperCase())}</b></div><div class="simple-list">${s.services.map(x=>`<div><strong>${escapeHtml(x.name)}</strong><span>${x.ok?'Operational':'Needs attention'}</span></div>`).join('')}</div><button class="btn secondary" data-action="v7-status-live-test">Run live database test</button>`);
}
function v7Staging(){
  const plan=stagingPlan(['AI error coach','New question builder','Adventure campaign']);openSimpleModal('Staging & Feature Test Groups',`<div class="simple-list">${plan.map(p=>`<div><strong>${escapeHtml(p.feature)}</strong><span>${escapeHtml(p.group)} · ${p.percent}% · ${escapeHtml(p.status)}</span></div>`).join('')}</div><p>Use existing Owner feature rollouts to publish changes to Bug Testers, pilot schools or percentage cohorts before full release.</p><button class="btn primary" data-action="open-rollouts">Open rollouts</button>`);
}
function v7Changelog(){
  const rows=state.v7Changelog||[{version:'7.0',title:'V7 Platform Expansion',body:'Diagnostic testing, symbolic checking, school workflows, safe collaboration, integrations wiring and new admin tools.',date:localDateString()}];
  openSimpleModal('What’s New in MathsExpress',`<div class="v7-timeline">${rows.map(r=>`<article><time>${escapeHtml(r.date)}</time><div><strong>v${escapeHtml(r.version)} · ${escapeHtml(r.title)}</strong><p>${escapeHtml(r.body)}</p></div></article>`).join('')}</div>${canUseOwnerConsole(account)?'<button class="btn primary" data-action="v7-new-changelog">Publish update note</button>':''}`);
}
function v7FeatureVoting(){
  openSimpleModal('Feature Voting','<div class="school-loading"><span class="spinner"></span><strong>Loading votes…</strong></div>');
  getSchoolClient().v7FeatureVotes().then(rows=>{const proposals=['Graph handwriting recognition','More adventure worlds','Teacher resource marketplace','More school competitions'];const map=new Map(rows.map(r=>[r.feature_key,r]));openSimpleModal('Feature Voting',`<div class="simple-list">${proposals.map(k=>{const r=map.get(k)||{score:0,votes:0};return`<div><strong>${escapeHtml(k)}</strong><span>${r.score} score · ${r.votes} votes</span><button class="btn ghost small" data-action="v7-vote-feature" data-feature="${escapeHtml(k)}">▲ Vote</button></div>`}).join('')}</div>`)}).catch(e=>showToast('Votes unavailable',e.message));
}
function v7BugAttachments(){
  openSimpleModal('Bug Report Attachments',`<form id="v7-bug-attachment-form" class="school-form"><label>Bug summary<input name="title" required></label><label>Description<textarea name="description" rows="5" required></textarea></label><label>Screenshot or short screen recording<input name="attachment" type="file" accept="image/*,video/*"></label><button class="btn primary" type="submit">Prepare bug report</button><p class="muted">The attachment file is not uploaded anywhere until a storage provider is configured. v7 stores the filename and report text safely instead of pretending the upload succeeded.</p></form>`);
}
function v7AiQuality(){
  openSimpleModal('AI Content Quality Check',`<form id="v7-quality-form" class="school-form"><label>Question prompt<textarea name="prompt" rows="5">Solve 2x + 5 = 15.</textarea></label><label>Expected answer<input name="answer" value="5"></label><label>Options (optional, separated by |)<input name="options"></label><button class="btn primary" type="submit">Run quality checks</button><div id="v7-quality-output" class="v7-result-box"></div></form>`);
}
function v7TeacherCopilot(){
  openSimpleModal('AI Teacher Copilot',`<form id="v7-copilot-form" class="school-form"><label>Topic<input name="topic" value="Linear equations" required></label><div class="form-two"><label>Year<input name="year" type="number" min="0" max="12" value="${normaliseYearLevel(account.profile?.yearLevel)}"></label><label>Lesson minutes<input name="minutes" type="number" min="20" max="90" value="50"></label></div><button class="btn primary" type="submit">Build lesson</button></form>`);
}
function v7ErrorCoach(){
  openSimpleModal('AI Error Coach',`<form id="v7-error-coach-form" class="school-form"><label>Question<input name="prompt" value="Solve 3x + 5 = 20"></label><label>Expected answer<input name="expected" value="5"></label><label>Student answer<input name="actual" value="-5"></label><label>Student working<textarea name="working" rows="4">3x = 15\nx = -5</textarea></label><button class="btn primary" type="submit">Diagnose misconception</button><div id="v7-error-output" class="v7-result-box"></div></form>`);
}
function v7VoiceTutor(){
  const supported=Boolean(globalThis.SpeechRecognition||globalThis.webkitSpeechRecognition);openSimpleModal('Voice Maths Tutor',`<p>${supported?'Your browser supports speech input.':'Speech input is not available in this browser, so use the typed fallback.'}</p><textarea id="v7-voice-text" rows="5" placeholder="Ask a maths question"></textarea><div class="simple-modal-actions">${supported?'<button class="btn primary" data-action="v7-start-voice">Start listening</button>':''}<button class="btn secondary" data-action="v7-send-voice-to-ai">Send to AI Helper</button></div>`);
}
function v7Privacy(){
  const p=privacySummary({eventCount:Number(ownerActivityStatsData.events_today)||0,hasParentLinks:account.profile?.role==='parent',focusTracking:true});openSimpleModal('Data & Privacy Dashboard',`<div class="form-two"><section class="calm-card"><h3>Stored</h3><ul>${p.stored.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section><section class="calm-card"><h3>Not collected</h3><ul>${p.notStored.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></section></div><div class="status-banner success"><b>Focus tracking:</b> MathsExpress may record whether this MathsExpress tab is active, hidden or idle. It does not identify or capture another website/app.</div><button class="btn secondary" data-action="open-retention">Open retention settings</button>`);
}
function v7Backups(){
  const manifest=buildBackupManifest({schools:schoolHubSchools.length,users:ownerActivityStatsData.total_users||1,assignments:0,version:'7'});openSimpleModal('Automatic Backups',`<div class="simple-list"><div><strong>${escapeHtml(manifest.id)}</strong><span>${escapeHtml(manifest.createdAt)} · ${escapeHtml(manifest.status)}</span></div></div><div class="simple-modal-actions"><button class="btn primary" data-action="complete-export-backup">Download local backup</button><button class="btn secondary" data-action="v7-save-backup-manifest">Save shared backup manifest</button></div>`);
}
function v7SchoolAchievements(){
  const a=schoolAchievement({schoolName:schoolHubSchools.find(s=>String(s.id)===String(v7CurrentSchoolId()))?.name||'Your school',questions:Number(ownerPlatformStats.questions)||0,mastered:Object.values(state.skillMasteryMap||{}).filter(x=>Number(x)>=80).length,challengeWins:Number(state.challengeWins)||0});openSimpleModal('School Achievements',a.unlocked.length?`<div class="achievement-grid">${a.unlocked.map(x=>`<article class="achievement earned"><span>★</span><div><strong>${escapeHtml(x)}</strong><small>${escapeHtml(a.schoolName)}</small></div></article>`).join('')}</div>`:'<p>School milestones will unlock as participation and mastery grow.</p>');
}
function v7Teams(){
  const items=state.v7Teams||[];openSimpleModal('Teams & Maths Clubs',`<form id="v7-team-form" class="school-form"><label>Name<input name="name" required placeholder="Year 9 Problem Solvers"></label><label>Type<select name="type"><option>Maths club</option><option>Competition team</option><option>Study group</option></select></label><button class="btn primary" type="submit">Create team</button></form><div class="simple-list">${items.map(t=>`<div><strong>${escapeHtml(t.name)}</strong><span>${escapeHtml(t.type)}</span></div>`).join('')||'<p>No local teams created yet.</p>'}</div>`);
}
function v7Action(action,el){
  if(!action||!action.startsWith('v7-'))return false;
  const simple={
    'v7-diagnostic':v7OpenDiagnostic,'v7-prereq-map':v7OpenPrereqMap,'v7-mastery-engine':v7OpenMasteryEngine,'v7-symbolic-checker':v7OpenSymbolicChecker,'v7-graph-checker':v7OpenGraphChecker,
    'v7-handwriting':()=>v7SketchModal('Maths Handwriting Input','handwriting'),'v7-working-pad':()=>v7SketchModal('Working-Out Pad','working'),
    'v7-question-builder':v7QuestionBuilder,'v7-worksheet-import':v7WorksheetImport,'v7-assignment-template':v7AssignmentTemplate,'v7-resource-library':v7ResourceLibrary,'v7-outcome-map':v7OutcomeMap,
    'v7-report-comment':v7ReportComment,'v7-misconceptions':v7Misconceptions,'v7-question-analytics':v7QuestionAnalytics,'v7-raise-hand':v7RaiseHand,'v7-whiteboard':v7Whiteboard,'v7-revision-generator':v7RevisionGenerator,
    'v7-portfolio':v7Portfolio,'v7-season':v7Season,'v7-daily-puzzle':v7DailyPuzzle,'v7-escape-room':v7EscapeRoom,'v7-adventure':v7Adventure,'v7-safe-social':v7SafeSocial,'v7-spectator':v7Spectator,
    'v7-google-login':()=>v7IntegrationModal('google-sso'),'v7-microsoft-login':()=>v7IntegrationModal('microsoft-sso'),'v7-google-classroom':()=>v7IntegrationModal('google-classroom'),'v7-microsoft-teams':()=>v7IntegrationModal('microsoft-teams'),'v7-sis-import':v7SisImport,'v7-class-rollover':v7ClassRollover,'v7-substitute':()=>v7CoTeacher('sub'),'v7-co-teacher':()=>v7CoTeacher('co'),
    'v7-permissions':v7Permissions,'v7-audit':v7Audit,'v7-status':v7Status,'v7-staging':v7Staging,'v7-changelog':v7Changelog,'v7-feature-voting':v7FeatureVoting,'v7-bug-attachments':v7BugAttachments,'v7-ai-quality':v7AiQuality,'v7-teacher-copilot':v7TeacherCopilot,'v7-error-coach':v7ErrorCoach,'v7-voice-tutor':v7VoiceTutor,'v7-privacy':v7Privacy,'v7-backups':v7Backups,'v7-school-achievements':v7SchoolAchievements,'v7-teams':v7Teams,
  };
  if(simple[action]){simple[action]();return true;}
  if(action==='v7-intervention-groups'){
    const src=(lastTeacherReport?.students||[]).map((s,i)=>({id:s.user_id||s.studentId||String(i),name:s.displayName||s.display_name||`Student ${i+1}`,mastery:s.mastery||{overall:Number(s.accuracy)||((i*17)%100)}}));
    const groups=buildInterventionGroupsV7(src.length?src:[{name:'Example support student',mastery:{overall:35}},{name:'Example core student',mastery:{overall:68}},{name:'Example extension student',mastery:{overall:91}}]);
    openSimpleModal('Automatic Intervention Groups',`<div class="v7-group-columns">${Object.entries(groups).map(([k,rows])=>`<section><h3>${escapeHtml(k)}</h3>${rows.map(r=>`<div><strong>${escapeHtml(r.name||r.displayName)}</strong><span>${r.averageMastery}%</span></div>`).join('')||'<p>None</p>'}</section>`).join('')}</div>`);return true;
  }
  if(action==='v7-question-versions'){
    openSimpleModal('Question Bank Versioning','<div class="school-loading"><span class="spinner"></span><strong>Loading saved questions…</strong></div>');
    getSchoolClient().v7ListObjects({type:'question',schoolId:v7CurrentSchoolId()||null,classId:v7CurrentClassId()||null}).then(rows=>openSimpleModal('Question Bank Versioning',`<p>Each edit is saved as a new resource instead of overwriting the previous question.</p><div class="simple-list">${rows.length?rows.slice(0,30).map(r=>`<div><strong>${escapeHtml(r.title)}</strong><span>Updated ${new Date(r.updated_at).toLocaleString()} · ${escapeHtml(r.visibility)}</span><button class="btn ghost small" data-action="v7-version-question" data-object-id="${escapeHtml(r.id)}" data-title="${escapeHtml(r.title)}">New version</button></div>`).join(''):'<p>No v7 questions have been saved yet.</p>'}</div><button class="btn primary" data-action="v7-question-builder">Create question</button>`)).catch(e=>showToast('Question bank unavailable',e.message));return true;
  }
  if(action==='v7-version-question'){const title=el?.dataset.title||'Question';getSchoolClient().v7SaveObject({type:'question',title:`${title} · new version`,payload:{parentObjectId:el?.dataset.objectId||null,versionCreatedAt:new Date().toISOString(),needsTeacherEdit:true},schoolId:v7CurrentSchoolId()||null,classId:v7CurrentClassId()||null,visibility:v7CurrentSchoolId()?'school':'private'}).then(()=>{showToast('Version created','A new editable version was saved.','success');v7Action('v7-question-versions',el);}).catch(e=>showToast('Could not version question',e.message));return true;}
  if(action==='v7-class-heatmap'){
    const students=(lastTeacherReport?.students||[]).slice(0,12);const masteryRows=lastTeacherReport?.mastery||[];
    if(!students.length||!masteryRows.length){openSimpleModal('Class Mastery Heatmap','<p>Open School → Reports for a class first. v7 will then build the heatmap from the real mastery rows loaded for that class.</p>');return true;}
    const skillIds=[...new Set(masteryRows.map(m=>m.skill_id))].slice(0,7);
    openSimpleModal('Class Mastery Heatmap',`<div class="heatmap"><div class="heatmap-row head"><b>Student</b>${skillIds.map(id=>`<b>${escapeHtml(String(id))}</b>`).join('')}</div>${students.map(st=>`<div class="heatmap-row"><strong>${escapeHtml(st.displayName||st.display_name||'Student')}</strong>${skillIds.map(id=>{const row=masteryRows.find(m=>(m.student_id===st.user_id||m.student_id===st.studentId)&&m.skill_id===id);const v=Math.max(0,Math.min(100,Math.round(Number(row?.mastery||0))));return `<span class="heat ${v>=80?'high':v>=50?'mid':'low'}">${v}%</span>`}).join('')}</div>`).join('')}</div>`);return true;
  }
  if(action==='v7-live-teacher'){const cid=v7CurrentClassId(); if(!cid)return showToast('Choose a class first','Open School → Classes.'); openSimpleModal('Live Teacher Screen',`<div class="simple-modal-actions"><button class="btn primary" data-action="v7-open-help-queue">Help queue</button><button class="btn secondary" data-action="refresh-focus-modal" data-class-id="${escapeHtml(cid)}">Focus status</button><button class="btn secondary" data-route="teacher-class" data-param="${escapeHtml(cid)}">Open class</button></div><p>Use Focus Status to see MathsExpress active/hidden/idle. It does not identify the external tab or app.</p>`);return true;}
  if(action==='v7-exit-ticket'){if(!canUseTeacherHub(account)){showToast('Teacher tool','Teacher access is required.');return true;}const classId=v7CurrentClassId();if(!classId){showToast('Choose a class first','Open a class before publishing an exit ticket.');return true;}openSimpleModal('Exit Ticket Builder',`<form id="v7-exit-ticket-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><label>Lesson topic<input name="topic" value="Today’s lesson"></label><label>Question 1 · retrieval<input name="q1" value="What was the key rule from today?"></label><label>Question 2 · application<input name="q2" value="Solve one example using today’s method."></label><label>Question 3 · reasoning<input name="q3" value="Explain why the method works."></label><button class="btn primary" type="submit">Publish exit ticket</button></form>`);return true;}
  if(action==='v7-exam-generator'){completeAction('open-exam-pro');return true;}
  if(action==='v7-rubric'){completeAction('open-rubric-builder');return true;}
  if(action==='v7-certificate'){const c=certificateData({name:state.playerName,title:'MathsExpress Achievement',reason:'Outstanding progress in mathematics'});openSimpleModal('Certificate',`<div class="certificate-preview"><span>★</span><h2>${escapeHtml(c.title)}</h2><p>This certificate is presented to</p><h1>${escapeHtml(c.name)}</h1><p>${escapeHtml(c.reason)}</p><small>${new Date(c.issuedAt).toLocaleDateString()}</small></div>`,`<button class="btn primary" data-action="print-certificate">Print certificate</button>`);return true;}
  if(action==='v7-open-help-queue'){v7OpenHelpQueue();return true;}
  if(action==='v7-resolve-help'){getSchoolClient().v7ResolveHelp(Number(el?.dataset.helpId),'resolved').then(()=>{showToast('Help request resolved','Removed from the queue.','success');v7OpenHelpQueue();}).catch(e=>showToast('Could not update request',e.message));return true;}
  if(action==='v7-safe-message'){showToast('Preset message',el?.dataset.message||'Good game!','success');return true;}
  if(action==='v7-clear-sketch'){const c=document.getElementById('v7-sketch-canvas');c?.getContext('2d')?.clearRect(0,0,c.width,c.height);return true;}
  if(action==='v7-save-sketch'){const c=document.getElementById('v7-sketch-canvas');if(!c)return true; const snapshot={id:`work-${Date.now()}`,createdAt:new Date().toISOString(),text:document.getElementById('v7-sketch-text')?.value||'',image:c.toDataURL('image/png')};persist({...state,v7BestWork:[...(state.v7BestWork||[]),snapshot].slice(-20)},{quiet:true});showToast('Working saved','Added to your local portfolio.','success');return true;}
  if(action==='v7-copy-report-comment'){const t=document.getElementById('v7-report-comment')?.value||'';navigator.clipboard?.writeText(t).then(()=>showToast('Copied','Report comment copied.','success')).catch(()=>showToast('Copy unavailable','Select the text and copy it manually.'));return true;}
  if(action==='v7-save-report-comment'){const t=document.getElementById('v7-report-comment')?.value||'';persist({...state,v7ReportDrafts:[...(state.v7ReportDrafts||[]),{text:t,createdAt:new Date().toISOString()}].slice(-50)},{quiet:true});showToast('Draft saved','Teacher report comment saved locally.','success');return true;}
  if(action==='v7-save-portfolio'){const snap=portfolioSnapshot({name:state.playerName,mastery:state.skillMasteryMap||state.mastery||{},achievements:state.achievements||[],bestWork:state.v7BestWork||[]});getSchoolClient().v7SaveObject({type:'portfolio',title:`${state.playerName} portfolio`,payload:snap,visibility:'private'}).then(()=>showToast('Portfolio snapshot saved','Saved to MathsExpress.','success')).catch(e=>showToast('Could not save portfolio',e.message));return true;}
  if(action==='v7-download-portfolio'){const snap=portfolioSnapshot({name:state.playerName,mastery:state.skillMasteryMap||state.mastery||{},achievements:state.achievements||[],bestWork:state.v7BestWork||[]});downloadTextFile(`MathsExpress-Portfolio-${localDateString()}.json`,JSON.stringify(snap,null,2),'application/json');return true;}
  if(action==='v7-vote-feature'){getSchoolClient().v7VoteFeature(el?.dataset.feature||'feature',1).then(()=>{showToast('Vote saved','Thanks for the feedback.','success');v7FeatureVoting();}).catch(e=>showToast('Vote failed',e.message));return true;}
  if(action==='v7-status-live-test'){getSchoolClient().v7FeatureVotes().then(()=>showToast('Database operational','Authenticated RPC test passed.','success')).catch(e=>showToast('Database test failed',e.message));return true;}
  if(action==='v7-save-backup-manifest'){const payload=buildBackupManifest({schools:schoolHubSchools.length,users:ownerActivityStatsData.total_users||1,version:'7'});getSchoolClient().v7SaveObject({type:'backup',title:`Backup ${localDateString()}`,payload,schoolId:v7CurrentSchoolId()||null,visibility:v7CurrentSchoolId()?'school':'private'}).then(()=>showToast('Manifest saved','Backup record saved.','success')).catch(e=>showToast('Could not save',e.message));return true;}
  if(action==='v7-new-changelog'){openSimpleModal('Publish Update Note',`<form id="v7-changelog-form" class="school-form"><label>Version<input name="version" value="7.0"></label><label>Title<input name="title" required></label><label>What changed<textarea name="body" rows="6" required></textarea></label><button class="btn primary" type="submit">Publish note</button></form>`);return true;}
  if(action==='v7-start-voice'){const C=globalThis.SpeechRecognition||globalThis.webkitSpeechRecognition;if(!C)return showToast('Speech unavailable','Use typed input.');const rec=new C();rec.lang='en-AU';rec.interimResults=false;rec.onresult=e=>{const box=document.getElementById('v7-voice-text');if(box)box.value=e.results?.[0]?.[0]?.transcript||'';};rec.onerror=()=>showToast('Voice input stopped','Try again or type the question.');rec.start();return true;}
  if(action==='v7-send-voice-to-ai'){const text=document.getElementById('v7-voice-text')?.value?.trim();if(!text)return showToast('Ask a question first','Type or speak a maths question.');document.getElementById('modal-root').innerHTML='';openAiHelperModal();setTimeout(()=>{const box=document.getElementById('ai-helper-input');if(box)box.value=text;},0);return true;}
  if(action==='v7-read-aloud'){const msg=new SpeechSynthesisUtterance('MathsExpress read aloud is ready. Select a textbook section and use the read button for equations and instructions.');msg.lang='en-AU';speechSynthesis?.speak(msg);return true;}
  if(action==='v7-oauth-google'||action==='v7-oauth-azure'){
    openSimpleModal('School SSO setup required',`<div class="status-banner warning"><b>Not enabled yet</b></div><p>The MathsExpress client wiring is ready, but OAuth sign-in stays disabled until the platform Owner configures the provider and the server-side education-email gate. This prevents personal accounts bypassing the school-email rule.</p><p class="muted">After those provider credentials are configured, this button can safely start the Supabase OAuth flow.</p>`);return true;
  }
  if(action==='v7-ai-error-coach'){v7ErrorCoach();return true;}
  if(action==='v7-undo'){if(!canUseOwnerConsole(account)){showToast('Owner only','Only the Owner can undo platform role/status changes.');return true;}openSimpleModal('Undo Admin Actions','<div class="school-loading"><span class="spinner"></span><strong>Loading reversible actions…</strong></div>');getSchoolClient().v7OwnerUndoList(40).then(rows=>openSimpleModal('Undo Admin Actions',rows.length?`<div class="simple-list">${rows.map(r=>`<div><strong>${escapeHtml(r.action_type)} · ${escapeHtml(r.target_name||r.target_user_id)}</strong><span>${escapeHtml(r.previous_value)} → ${escapeHtml(r.new_value)} · ${new Date(r.created_at).toLocaleString()}${r.undone_at?' · already undone':''}</span>${r.undone_at?'':`<button class="btn ghost small" data-action="v7-undo-owner-action" data-undo-id="${r.id}">Undo</button>`}</div>`).join('')}</div>`:'<p>No reversible role/status changes yet.</p>')).catch(e=>showToast('Undo history unavailable',e.message));return true;}
  if(action==='v7-undo-owner-action'){getSchoolClient().v7OwnerUndoAction(Number(el?.dataset.undoId)).then(()=>{showToast('Change undone','The previous account value was restored.','success');v7Action('v7-undo',el);}).catch(e=>showToast('Could not undo',e.message));return true;}
  if(action==='v7-save-copilot-plan'){const plan=state.v7PendingCopilotPlan;if(!plan)return true;getSchoolClient().v7SaveObject({type:'resource',title:`${plan.topic} lesson plan`,payload:plan,schoolId:v7CurrentSchoolId()||null,classId:v7CurrentClassId()||null,visibility:v7CurrentSchoolId()?'school':'private'}).then(()=>showToast('Lesson plan saved','Added to the v7 resource library.','success')).catch(e=>showToast('Could not save plan',e.message));return true;}
  return true;
}

async function handleV7Submit(event){
  const form=event.target; if(!form?.id?.startsWith('v7-'))return; event.preventDefault(); const data=new FormData(form);
  try{
    if(form.id==='v7-v83-diagnostic-form'){
      const kind=String(data.get('kind')||'discovery'),runId=String(data.get('runId')||''),year=normaliseYearLevel(account.profile?.yearLevel),qs=v83DiagnosticQuestions(year,kind);
      let correct=0;const responses=[];
      for(const q of qs){const actual=String(data.get(q.id)||'').trim();const ok=validateAnswer({prompt:q.prompt,answer:q.answer,exactAnswer:q.exactAnswer,type:q.type||'short-answer'},actual).correct===true||symbolicEquivalent(actual,String(q.answer??''));if(ok)correct++;responses.push({q,actual,correct:ok});}
      for(const x of responses){try{await accountClient.ensureClient().rpc('mathsexpress_record_diagnostic_response',{p_run_id:runId,p_skill_id:x.q.skill,p_item_difficulty:Number(x.q.difficulty)||0,p_correct:x.correct,p_response_seconds:0});}catch{}}
      const {data:finished,error}=await accountClient.ensureClient().rpc('mathsexpress_finish_diagnostic',{p_run_id:runId});if(error)throw error;const summary=finished?.summary||{};openSimpleModal(kind==='discovery'?'Discovery Check-In Result':'Readiness Result',`<div class="owner-analytics-strip large"><div><b>${Number(summary.accuracy_percent??(correct/Math.max(1,qs.length)*100)).toFixed(0)}%</b><small>accuracy</small></div><div><b>${Number(summary.readiness_percent||0).toFixed(0)}%</b><small>readiness</small></div><div><b>${Number(summary.grade_equivalent||year).toFixed(1)}</b><small>grade-equivalent estimate</small></div><div><b>${qs.length}</b><small>curriculum checks</small></div></div><div class="simple-list">${responses.map((x,i)=>`<div><strong>${i+1}. ${escapeHtml(x.q.skill)}</strong><span>${x.correct?'Secure':'Review'} · ${escapeHtml(x.q.strand)}</span></div>`).join('')}</div><button class="btn primary" data-action="open-growth-report">View growth report</button>`);return;
    }
    if(form.id==='v7-v83-integrations-form'){const schoolId=String(data.get('schoolId')||'');const {error}=await accountClient.ensureClient().rpc('mathsexpress_update_integration_config',{p_school_id:schoolId,p_canvas_enabled:data.get('canvas')==='on',p_canvas_base_url:String(data.get('canvasUrl')||''),p_clever_enabled:data.get('clever')==='on',p_clever_district_id:String(data.get('cleverDistrict')||''),p_saml_enabled:data.get('saml')==='on',p_saml_domain:String(data.get('samlDomain')||''),p_roster_sync_enabled:data.get('sync')==='on',p_roster_sync_provider:String(data.get('provider')||'manual'),p_sync_hour_local:Number(data.get('hour'))||5});if(error)throw error;showToast('Integration settings saved','Provider secrets still stay server-side.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-diagnostic-form'){
      const qs=v7DiagnosticQuestions(normaliseYearLevel(account.profile?.yearLevel));const attempts=qs.map(q=>{const actual=String(data.get(q.id)||'').trim().toLowerCase().replace(/\s+/g,'');const expected=String(q.answer).toLowerCase().replace(/\s+/g,'');return{skillId:q.skill,strand:q.strand,correct:actual===expected,actual,expected};});const result=scoreDiagnostic(attempts,normaliseYearLevel(account.profile?.yearLevel));const item={...result,createdAt:new Date().toISOString()};persist({...state,v7DiagnosticHistory:[...(state.v7DiagnosticHistory||[]),item].slice(-20)},{quiet:true});openSimpleModal('Diagnostic Result',`<div class="owner-analytics-strip"><div><b>${Math.round(result.accuracy*100)}%</b><small>accuracy</small></div><div><b>${result.weakSkills.length}</b><small>priority skills</small></div><div><b>${result.strongSkills.length}</b><small>strong skills</small></div></div><div class="simple-list">${attempts.map((a,i)=>`<div><strong>${i+1}. ${escapeHtml(qs[i].skill)}</strong><span>${a.correct?'Correct':'Review'} · expected ${escapeHtml(a.expected)}</span></div>`).join('')}</div><button class="btn primary" data-route="learning-path">Build learning path</button>`);return;
    }
    if(form.id==='v7-symbolic-form'){const r=symbolicEquivalent(data.get('left'),data.get('right'));const out=document.getElementById('v7-symbolic-output');if(out)out.innerHTML=`<div class="status-banner ${r.equivalent?'success':'warning'}"><b>${r.equivalent?'Equivalent':'Not equivalent'}</b> ${escapeHtml(r.reason)}</div>`;return;}
    if(form.id==='v7-graph-form'){const pts=String(data.get('points')||'').split(/\r?\n/).map(line=>line.split(',').map(Number)).filter(x=>x.length>=2&&x.every(Number.isFinite)).map(([x,y])=>({x,y}));const r=graphMatch(pts,String(data.get('expression')||''),Number(data.get('tolerance'))||.25);const out=document.getElementById('v7-graph-output');if(out)out.innerHTML=`<div class="status-banner ${r.correct?'success':'warning'}"><b>${r.matched}/${r.total} points matched</b>${r.correct?' All plotted points fit the equation.':' Check the points that do not fit.'}</div>`;return;}
    if(form.id==='v7-question-builder-form'){const options=String(data.get('options')||'').split('|').map(x=>x.trim()).filter(Boolean);const q={id:`custom-${Date.now()}`,type:String(data.get('type')),prompt:String(data.get('prompt')),answer:String(data.get('answer')),options,topic:String(data.get('topic')),difficulty:String(data.get('difficulty'))};const check=qualityCheckQuestion(q);if(!check.ok){return openSimpleModal('Question needs review',`<div class="status-banner warning"><b>${check.score}/100 quality score</b></div><ul>${check.issues.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><button class="btn secondary" data-action="v7-question-builder">Edit another question</button>`);}persist({...state,v7CustomQuestions:[...(state.v7CustomQuestions||[]),q].slice(-500)},{quiet:true});await getSchoolClient().v7SaveObject({type:'question',title:q.prompt.slice(0,80),payload:q,schoolId:v7CurrentSchoolId()||null,classId:v7CurrentClassId()||null,visibility:v7CurrentSchoolId()?'school':'private'}).catch(()=>null);showToast('Question saved','Quality checks passed.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-worksheet-import-form'){let text=String(data.get('text')||'');const file=data.get('file');if(file&&file.size)text+=`\n${await file.text()}`;const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(x=>x.length>4).slice(0,100);const drafts=lines.map((line,i)=>({id:`import-${Date.now()}-${i}`,prompt:line.replace(/^\d+[.)]\s*/,''),answer:'',type:'short',needsReview:true}));persist({...state,v7ImportedQuestions:[...(state.v7ImportedQuestions||[]),...drafts].slice(-500)},{quiet:true});openSimpleModal('Worksheet Draft Created',`<p>${drafts.length} editable question drafts were created. Answers are intentionally left blank for teacher review.</p><div class="simple-list">${drafts.slice(0,20).map((q,i)=>`<div><strong>${i+1}</strong><span>${escapeHtml(q.prompt)}</span></div>`).join('')}</div>`);return;}
    if(form.id==='v7-template-form'){const payload={questions:Number(data.get('questions'))||20,difficulty:String(data.get('difficulty')),aiAllowed:data.get('ai')==='on',gamesAllowed:data.get('games')==='on',classId:String(data.get('classId')||'')||null};const scope=String(data.get('shareScope')||'private');let result=await accountClient.ensureClient().rpc('mathsexpress_save_assignment_template_v86',{p_name:String(data.get('title')),p_folder:String(data.get('folder')||'/'),p_payload:payload,p_share_scope:scope,p_district_id:null});if(result.error){result=await accountClient.ensureClient().rpc('mathsexpress_save_assignment_template',{p_name:String(data.get('title')),p_folder:String(data.get('folder')||'/'),p_payload:payload,p_shared:scope!=='private'});}if(result.error)throw result.error;showToast('Template saved',scope==='district'?'Reusable template shared across the district.':'Reusable assignment template created in its folder.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='template-lifecycle-edit-form'){const templateId=String(data.get('templateId')||'');const existing=templateLifecycleRows.find(t=>String(t.id)===templateId);const payload={...(existing?.payload||{}),questions:Number(data.get('questions'))||20,difficulty:String(data.get('difficulty')||'adaptive'),aiAllowed:data.get('ai')==='on',gamesAllowed:data.get('games')==='on'};const {error}=await accountClient.ensureClient().rpc('mathsexpress_update_assignment_template_v866',{p_template_id:templateId,p_name:String(data.get('title')||'Assignment Template'),p_folder:String(data.get('folder')||'/'),p_payload:payload,p_share_scope:String(data.get('shareScope')||'private')});if(error)throw error;showToast('Template updated','Changes were saved to the original template.','success');openTemplateFoldersModal();return;}

    if(form.id==='v7-resource-form'){await getSchoolClient().v7SaveObject({type:'resource',title:String(data.get('title')),payload:{body:String(data.get('body')||''),version:1},schoolId:String(data.get('schoolId')||'')||null,visibility:data.get('schoolId')?'school':'private'});showToast('Resource shared','Added to the resource library.','success');v7ResourceLibrary();return;}
    if(form.id==='v7-raise-hand-form'){await getSchoolClient().v7RaiseHand(String(data.get('classId')),String(data.get('message')||'I need help'));showToast('Hand raised','Your teacher can see the help request.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-whiteboard-form'){await getSchoolClient().v7SaveObject({type:'whiteboard',title:String(data.get('title')),payload:{body:String(data.get('body')||'')},classId:String(data.get('classId')),schoolId:v7CurrentSchoolId()||null,visibility:'class'});showToast('Whiteboard published','Students in the class can load the board.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-daily-puzzle-form'){const actual=String(data.get('answer')||'').trim();const correct=actual===String(data.get('answerKey')||'').trim();await getSchoolClient().v7RecordDailyPuzzle(String(data.get('puzzleKey')),correct);if(correct){persist({...state,v7PuzzleStreak:(state.v7LastPuzzleDate===localDateString()?state.v7PuzzleStreak||1:(state.v7PuzzleStreak||0)+1),v7LastPuzzleDate:localDateString()},{quiet:true});}showToast(correct?'Puzzle solved!':'Not quite',correct?`Puzzle streak: ${state.v7PuzzleStreak||1}`:'Try the inverse operations again.',correct?'success':'');if(correct)document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-sis-form'){let text=String(data.get('text')||'');const file=data.get('file');if(file&&file.size)text=await file.text();const rows=parseCsv(text);openSimpleModal('CSV Import Preview',`<p>${rows.length} rows parsed.</p><div class="v7-analytics-table"><div class="head"><b>Name</b><b>Email</b><b>Year</b><b>Status</b><b></b></div>${rows.slice(0,50).map(r=>`<div><span>${escapeHtml(r.display_name||r.name||'')}</span><span>${escapeHtml(r.email||'')}</span><span>${escapeHtml(r.year_level||r.year||'')}</span><span>${/@/.test(r.email||'')?'Ready':'Check email'}</span><span></span></div>`).join('')}</div><p class="muted">Preview only. Use School → Students bulk import to commit validated students to the selected school.</p>`);return;}
    if(form.id==='v7-coteacher-form'){await getSchoolClient().v7AddCoTeacher(String(data.get('classId')),String(data.get('email')));showToast('Co-teacher added','Class access updated.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-substitute-form'){const dt=new Date(String(data.get('expires')));if(Number.isNaN(dt.getTime()))throw new Error('Choose a valid expiry time.');await getSchoolClient().v7AddSubstitute(String(data.get('classId')),String(data.get('email')),dt.toISOString());showToast('Temporary access granted',`Expires ${dt.toLocaleString()}.`,'success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-permissions-form'){const chosen=new Set(data.getAll('perm').map(String));const catalog=permissionCatalog();const jobs=[];for(const [role,perms] of Object.entries(catalog)){if(role==='owner')continue;for(const perm of perms)jobs.push(getSchoolClient().v7SetRolePermission(role,perm,chosen.has(`${role}|${perm}`)));}await Promise.all(jobs);showToast('Permissions saved','Role permissions updated.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-changelog-form'){const row={version:String(data.get('version')||'7.0'),title:String(data.get('title')),body:String(data.get('body')),date:localDateString()};persist({...state,v7Changelog:[row,...(state.v7Changelog||[])].slice(0,50)},{quiet:true});await getSchoolClient().v7SaveObject({type:'changelog',title:row.title,payload:row,visibility:'public'}).catch(()=>null);showToast('Update note published','Added to What’s New.','success');v7Changelog();return;}
    if(form.id==='v7-bug-attachment-form'){const file=data.get('attachment');let attachmentPath='';if(file&&file.size)attachmentPath=await getSchoolClient().v7UploadBugAttachment(file,account.profile?.userId);const row={id:`bug-${Date.now()}`,title:String(data.get('title')),description:String(data.get('description')),attachmentName:file?.name||'',attachmentType:file?.type||'',attachmentPath,createdAt:new Date().toISOString()};await getSchoolClient().v7SubmitFeedback('bug',row.title,row.description,'v7-bug-report',attachmentPath?`Private attachment: ${attachmentPath}`:'');persist({...state,v7BugDrafts:[...(state.v7BugDrafts||[]),row].slice(-50)},{quiet:true});showToast('Bug report submitted',attachmentPath?'Attachment uploaded privately.':'Report saved without an attachment.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-quality-form'){const q={prompt:String(data.get('prompt')),answer:String(data.get('answer')),options:String(data.get('options')||'').split('|').map(x=>x.trim()).filter(Boolean)};const r=qualityCheckQuestion(q);const out=document.getElementById('v7-quality-output');if(out)out.innerHTML=`<div class="status-banner ${r.ok?'success':'warning'}"><b>${r.score}/100 · ${r.ok?'Passed':'Review needed'}</b></div>${r.issues.length?`<ul>${r.issues.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:'<p>No basic quality issues detected.</p>'}`;return;}
    if(form.id==='v7-copilot-form'){const plan=teacherCopilot({topic:String(data.get('topic')),yearLevel:Number(data.get('year')),minutes:Number(data.get('minutes'))});openSimpleModal('Teacher Copilot Lesson',`<h3>Year ${plan.yearLevel} · ${escapeHtml(plan.topic)}</h3><div class="simple-list">${plan.segments.map(x=>`<div><strong>${escapeHtml(x.name)} · ${x.minutes} min</strong><span>${escapeHtml(x.detail)}</span></div>`).join('')}</div><p><b>Homework:</b> ${escapeHtml(plan.homework)}</p><button class="btn primary" data-action="v7-save-copilot-plan">Save as resource</button>`);state.v7PendingCopilotPlan=plan;return;}
    if(form.id==='v7-error-coach-form'){const expected=String(data.get('expected')),actual=String(data.get('actual')),working=String(data.get('working'));const type=classifyMathError({expected,actual,working});const messages={'sign-error':'Your method may be right, but the sign changed. Check where the negative sign was introduced or lost.','algebra-error':'The likely issue is an algebra manipulation step. Check that the same operation was applied to both sides.','formula-error':'The formula or substitution may be the issue. Write the formula first, then substitute values with units.','incomplete-method':'Your working appears unfinished. Continue the inverse operation or simplification before evaluating the final answer.','arithmetic-or-concept':'Check the first step where your value differs from the expected method. Recalculate one operation at a time.','none':'The final answer matches.'};const out=document.getElementById('v7-error-output');if(out)out.innerHTML=`<div class="status-banner ${type==='none'?'success':'warning'}"><b>${escapeHtml(type.replaceAll('-',' '))}</b></div><p>${escapeHtml(messages[type]||messages['arithmetic-or-concept'])}</p>`;return;}
    if(form.id==='v7-team-form'){const row={id:`team-${Date.now()}`,name:String(data.get('name')),type:String(data.get('type')),createdAt:new Date().toISOString()};persist({...state,v7Teams:[...(state.v7Teams||[]),row].slice(-50)},{quiet:true});await getSchoolClient().v7SaveObject({type:'team',title:row.name,payload:row,schoolId:v7CurrentSchoolId()||null,classId:v7CurrentClassId()||null,visibility:v7CurrentSchoolId()?'school':'private'}).catch(()=>null);showToast('Team created',row.name,'success');v7Teams();return;}
    if(form.id==='v7-exit-ticket-form'){const classId=String(data.get('classId'));const payload={topic:String(data.get('topic')||'Lesson'),questions:[String(data.get('q1')),String(data.get('q2')),String(data.get('q3'))],kind:'exit-ticket'};await getSchoolClient().v7SaveObject({type:'whiteboard',title:`Exit ticket · ${payload.topic}`,payload,classId,schoolId:v7CurrentSchoolId()||null,visibility:'class'});showToast('Exit ticket published','Saved to the class activity stream.','success');document.getElementById('modal-root').innerHTML='';return;}
    if(form.id==='v7-rollover-form'){
      const original=teacherHubClasses.find(c=>String(c.id)===String(data.get('classId')));if(!original)throw new Error('Original class not found.');const created=await getSchoolClient().v7RolloverClass(original.id,String(data.get('name')),Number(data.get('yearLevel')),data.get('copyStudents')==='on');showToast('Next-year class created',`${String(data.get('name'))} · code ${created?.join_code||'created'}`,'success');teacherHubClasses=await getSchoolClient().listTeacherClasses().catch(()=>teacherHubClasses);document.getElementById('modal-root').innerHTML='';return;
    }
  }catch(error){showToast('Couldn’t complete v7 action',error.message||'Please try again.');}
}


function renderMaintenanceLock() {
  const view=document.getElementById('app-view'); if(!view)return;
  view.innerHTML=`<div class="page maintenance-lock"><section class="maintenance-lock-card"><span class="maintenance-icon">MX</span><span class="eyebrow">MathsExpress maintenance</span><h1>We’re updating MathsExpress.</h1><p>${escapeHtml(state.ownerSettings?.maintenanceMessage||'MathsExpress is being updated. Please try again soon.')}</p><small>Your account and school data stay saved. Owner accounts can still enter to test the update.</small><button class="btn secondary" data-action="sign-out">Sign out</button></section></div>`;
}

function render() {
  if (typeof document === 'undefined' || !state || !account.authenticated) return;
  try { if(globalThis.speechSynthesis?.speaking || globalThis.speechSynthesis?.pending) globalThis.speechSynthesis.cancel(); } catch {}
  const view = document.getElementById('app-view');
  try {
    if(state.ownerSettings?.maintenanceMode && !canUseOwnerConsole(account)) { updateChrome(); renderMaintenanceLock(); return; }
    let { route, param } = routeFromHash();
    if ((route === 'teacher-hub' || route === 'teacher-class' || route === 'v7') && !canUseTeacherHub(account)) {
      route = 'home';
      param = '';
      if (globalThis.history?.replaceState) globalThis.history.replaceState(null,'','#home');
    }
    if(route==='assignment') restoreActiveAssignmentSession();
    document.body?.classList.toggle('assignment-focus-mode', Boolean(activeSchoolAssignment) && (route==='assignment' || route==='generated-task' || route==='lesson'));
    document.body?.classList.toggle('assignment-test-lock', Boolean(activeSchoolAssignment?.testMode) && (route==='assignment' || route==='generated-task' || route==='lesson'));
    if(route!=='owner-activity') setOwnerActivityAutoRefresh(false);
    if(route!=='student-hub') stopClassHubLiveRefresh();
    if(route!=='textbook-lesson' && textbookReadTimer){ clearInterval(textbookReadTimer); textbookReadTimer=null; textbookReadTracker={sectionId:'',lastAt:0,maxScroll:0}; }
    const routeKey=`${route}:${param||''}`;
    if(routeKey!==lastTrackedRoute){ lastTrackedRoute=routeKey; trackActivityEvent('route-view','navigation',`open-${route}`,param?{param}:{}); }
    applyPageTitle(route);
    updateActiveNav(route);
    updateChrome();
    const renderers = {
      home: renderHome,
      learn: renderLearn,
      'learning-path': renderLearningPath,
      lesson: renderLesson,
      'generated-task': renderGeneratedTask,
      textbook: renderTextbook,
      'textbook-lesson': renderTextbookLesson,
      games: renderGames,
      elo: renderElo,
      'class-game': renderClassGame,
      challenges: renderChallenges,
      tools: renderTools,
      v7: renderV7Hub,
      calendar: renderCalendar,
      parent: renderParentView,
      shop: renderShop,
      locker: renderLocker,
      achievements: renderAchievements,
      profile: renderProfile,
      'student-hub': renderStudentHub,
      'teacher-hub': renderTeacherHub,
      'teacher-class': renderTeacherClass,
      'assignment': renderAssignmentRoute,
      'owner-activity': renderOwnerActivity,
    };
    (renderers[route] ?? renderHome)();
    view?.scrollTo?.({ top: 0, behavior: 'instant' });
  } catch (error) {
    try { console.error('MathsExpress render error:', error); } catch {}
    if (view) view.innerHTML = `<div class="page"><section class="card card-pad" style="max-width:760px;margin:48px auto"><span class="eyebrow">Recovery mode</span><h1>MathsExpress hit a page error.</h1><p>Your account is still signed in. You can return Home, reload the app, or restore a saved progress backup.</p><div class="hero-actions"><button class="btn primary" data-route="home">Home</button><button class="btn secondary" data-action="reload-app">Reload</button><button class="btn secondary" data-action="export-progress">Download backup</button><button class="btn secondary" data-action="import-progress">Restore backup</button></div><small>${escapeHtml(error?.message || 'Unknown page error')}</small></section></div>`;
    hideLoadingScreen();
  }
}

function handleClick(event) {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton) {
    if (!account.authenticated) { showAuthGate('Log in or create an account to enter MathsExpress.'); return; }
    const moreMenu = document.getElementById('more-nav-menu');
    const moreButton = document.getElementById('more-nav-button');
    if (moreMenu) moreMenu.hidden = true;
    if (moreButton) moreButton.setAttribute('aria-expanded', 'false');
    const route = routeButton.dataset.route;
    if (route !== 'games') { stopDrivingTimer(); if(eduGameSession) finishEducationalGame({showResult:false}); }
    if (route) go(route, routeButton.dataset.param || '');
    return;
  }
  const graphAnswerGrid=event.target?.closest?.('#generated-graph-grid');
  if(graphAnswerGrid){
    const rect=graphAnswerGrid.getBoundingClientRect(); const min=Number(graphAnswerGrid.dataset.min||-10),max=Number(graphAnswerGrid.dataset.max||10); const span=Math.max(1,max-min);
    const px=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)); const py=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
    const x=Math.round(min+px*span), y=Math.round(max-py*span); graphAnswerGrid.dataset.x=String(x);graphAnswerGrid.dataset.y=String(y);
    const marker=document.getElementById('generated-graph-marker'); if(marker){marker.hidden=false;marker.style.left=`${((x-min)/span)*100}%`;marker.style.top=`${((max-y)/span)*100}%`;}
    const out=document.getElementById('generated-graph-output'); if(out)out.textContent=`(${x}, ${y})`; return;
  }
  if (event.target?.id === 'workspace-graph') {
    const rect = event.target.getBoundingClientRect();
    graphPoints.push({ x: Math.max(0, Math.min(event.target.width, (event.clientX-rect.left)*(event.target.width/rect.width))), y: Math.max(0, Math.min(event.target.height, (event.clientY-rect.top)*(event.target.height/rect.height))) });
    graphPoints = graphPoints.slice(-100);
    drawWorkspaceGraph();
    return;
  }
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  if(action && !['owner-activity-refresh','owner-activity-export','owner-activity-tab','owner-user-detail'].includes(action)) trackActivityEvent('ui-action',activityCategoryForAction(action),action,safeActionDetails(actionEl));

  if (action === 'assignment-submit-working-step') { submitAssignmentWorkingStep(); return; }
  if (action === 'assignment-request-next-step') { submitAssignmentWorkingStep({requestNext:true}); return; }
  if (action === 'assignment-handwriting') { openAssignmentHandwriting(); return; }
  if (action === 'recognize-assignment-handwriting') { recognizeAssignmentHandwriting(); return; }
  if (action === 'use-handwriting-expression') { const value=decodeURIComponent(actionEl.dataset.expression||''); const input=document.querySelector('.assignment-workspace #assignment-step-input'); if(input){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));} const modal=document.getElementById('modal-root');if(modal)modal.innerHTML='';input?.focus();return; }
  if (action === 'use-handwriting-typed-fallback') { const value=String(document.getElementById('handwriting-typed-fallback')?.value||'').trim(); if(!value){showToast('Type some maths first','Enter the expression, then choose Use typed maths.');return;} const input=document.querySelector('.assignment-workspace #assignment-step-input'); if(input){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));} const modal=document.getElementById('modal-root');if(modal)modal.innerHTML='';input?.focus();return; }
  if (action === 'assignment-video') { if(activeSchoolAssignment?.testMode)return showToast('Videos locked','Videos are disabled in Test Mode.'); openTutorialVideoModal(); return; }
  if (action === 'assignment-video-locked') { showToast('Videos locked',activeSchoolAssignment?.testMode?'Videos are disabled in Test Mode.':'Your teacher has disabled tutorial videos for this assessment.'); return; }
  if (action === 'assignment-textbook-locked') { showToast('Textbook locked','Textbook support is disabled in Test Mode.'); return; }
  if (action === 'assignment-toolbox-locked') { showToast('Tools locked','Extra tools are disabled in Test Mode.'); return; }
  if (action === 'open-join-class') { openJoinClassModal(); return; }
  if (action === 'open-discussion-board') { void openDiscussionBoard(actionEl.dataset.classId||''); return; }
  if (action === 'discussion-status') {
    accountClient.ensureClient().rpc('mathsexpress_moderate_discussion_thread',{p_thread_id:String(actionEl.dataset.threadId||''),p_status:String(actionEl.dataset.status||'open'),p_visibility:null})
      .then(({error})=>{if(error)throw error;return openDiscussionBoard(activeDiscussionClassId);})
      .catch(error=>showToast('Could not update discussion',error.message||'Try again.'));
    return;
  }
  if (action === 'discussion-visibility') {
    accountClient.ensureClient().rpc('mathsexpress_moderate_discussion_thread',{p_thread_id:String(actionEl.dataset.threadId||''),p_status:null,p_visibility:String(actionEl.dataset.visibility||'teacher')})
      .then(({error})=>{if(error)throw error;return openDiscussionBoard(activeDiscussionClassId);})
      .catch(error=>showToast('Could not update discussion',error.message||'Try again.'));
    return;
  }
  if (action === 'open-fix-mode') { openFixMode(actionEl.dataset.assignmentId); return; }
  if (action === 'fix-check-answer') { checkFixAnswer(); return; }
  if (action === 'edit-class') { openClassEditor(actionEl.dataset.classId); return; }
  if (action === 'toggle-class-archive') { void toggleClassArchive(actionEl.dataset.classId,actionEl.dataset.archived==='1'); return; }
  if (action === 'delete-class') { void deleteClassPermanently(actionEl.dataset.classId,actionEl.dataset.className||'this class'); return; }
  if (action === 'open-task-report') { openMatureTaskReport(actionEl.dataset.assignmentId); return; }
  if (action === 'task-report-view') { renderMatureTaskReport(actionEl.dataset.view||'students'); return; }
  if (action === 'task-report-sort') { taskReportQuestionSort=actionEl.dataset.sort||'incorrect'; renderMatureTaskReport('questions'); return; }
  if (action === 'open-question-detail') { void openTaskQuestionDetail(actionEl.dataset.questionId); return; }
  if (action === 'print-task-report') { printTaskReport(actionEl.dataset.assignmentId); return; }
  if (action === 'task-to-template') { void saveTaskAsTemplate(actionEl.dataset.assignmentId); return; }
  if (action === 'reassign-task-report') { void reassignTaskFromReport(actionEl.dataset.assignmentId); return; }
  if (action === 'try-report-question') { tryReportQuestion(actionEl.dataset.questionId); return; }
  if (action === 'create-hardest-revision') { void createHardestRevision(actionEl.dataset.assignmentId); return; }
  if (action === 'open-engagement-compass') { void openLearningEngagementCompass(); return; }
  if (action === 'open-engagement-student') { openEngagementStudent(actionEl.dataset.studentId); return; }
  if (action === 'open-standards-proficiency') { void openStandardsProficiencyReport(); return; }
  if (action === 'export-single-task-report') { exportSingleTaskReport(actionEl.dataset.assignmentId); return; }
  if (action === 'reopen-assignment') { reopenAssignmentFromReport(actionEl.dataset.assignmentId); return; }
  if (action === 'copy-task-share-link') { copyTaskShareLink(actionEl.dataset.taskId,actionEl.dataset.taskTitle||'Task'); return; }
  if (action === 'open-scorecard') { scorecardModal(actionEl.dataset.assignmentId); return; }
  if (action === 'open-mark-override') { openMarkOverrideModal(actionEl.dataset.assignmentId,actionEl.dataset.studentId,actionEl.dataset.studentName); return; }
  if (action === 'open-assessment-review') { openAssessmentReviewModal(actionEl.dataset.assignmentId,actionEl.dataset.studentId,actionEl.dataset.studentName); return; }
  if (action === 'open-bulk-assign') { openBulkAssignModal(); return; }
  if (action === 'open-recognition') { openRecognitionModal(); return; }
  if (action === 'open-class-expedition') { openClassExpeditionModal(); return; }
  if (action === 'open-tutorial-video-manager') { openTutorialVideoManager(); return; }
  if (action === 'textbook-try-similar') { const id=actionEl.dataset.taskId; if(id)getTaskById(id)?startGeneratedTask(id,{returnRoute:routeFromHash().route}):showToast('Similar problem unavailable','Try the checkpoint for this section.'); return; }
  if (action === 'textbook-view-resources') { openTextbookResources(actionEl.dataset.sectionId,{teacher:false}); return; }
  if (action === 'textbook-teacher-resources') { openTextbookResources(actionEl.dataset.sectionId,{teacher:true}); return; }
  if (action === 'open-curated-bank') { openCuratedQuestionBank(); return; }
  if (action === 'open-curated-bank-year') { openCuratedQuestionBank(actionEl.dataset.year); return; }
  if (action === 'open-template-folders') { openTemplateFoldersModal(); return; }
  if (action === 'toggle-archived-templates') { openTemplateFoldersModal({includeArchived:actionEl.dataset.showArchived==='1'}); return; }
  if (action === 'edit-template') { openTemplateLifecycleEditor(actionEl.dataset.templateId); return; }
  if (action === 'duplicate-template') { duplicateTemplateLifecycle(actionEl.dataset.templateId); return; }
  if (action === 'archive-template') { archiveTemplateLifecycle(actionEl.dataset.templateId); return; }
  if (action === 'queue-parent-due') { accountClient.ensureClient().rpc('mathsexpress_queue_parent_due_notifications',{p_assignment_id:String(actionEl.dataset.assignmentId)}).then(({data,error})=>{if(error)throw error;showToast('Parent reminders queued',`${Number(data?.queued||0)} guardian reminder${Number(data?.queued||0)===1?'':'s'} queued.`,'success');}).catch(e=>showToast('Could not queue reminders',e.message)); return; }
  if (action === 'open-role-tools') { openRoleTools(); return; }
  if (action === 'assignment-ai-locked') { showToast('AI Helper locked','Your teacher has disabled AI help for this assessment.'); return; }
  if (action === 'assignment-calculator-locked') { showToast('Calculator locked','Your teacher has disabled the calculator for this assignment.'); return; }
  if (action === 'assignment-insert-math') {
    const insert=actionEl.dataset.insert||'';
    let target=document.activeElement;
    if(!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) target=document.querySelector('.assignment-workspace #lesson-answer, .assignment-workspace .generated-part-answer, .assignment-workspace #generated-coordinate-x');
    if(!target || !('value' in target)) return;
    const start=Number(target.selectionStart ?? target.value.length), end=Number(target.selectionEnd ?? start);
    const value=String(target.value||''); target.value=value.slice(0,start)+insert+value.slice(end); const pos=start+insert.length; target.focus(); try{target.setSelectionRange(pos,pos);}catch{} return;
  }
  if (action === 'assignment-lesson-help-locked' || action === 'assignment-lesson-help') {
    if(activeSchoolAssignment?.testMode)return showToast('Lesson Support locked','Support is disabled in Test Mode.');
    openSimpleModal('Lesson Support',lessonSupportHtml()); return;
  }
  if (action === 'assignment-textbook') {
    if(activeSchoolAssignment?.testMode)return showToast('Textbook locked','Textbook support is disabled in Test Mode.');
    openSimpleModal('Task Textbook',taskTextbookPanelHtml(currentTaskSupportContext(),{compact:false}));
    return;
  }
  if (action === 'assignment-return-fullscreen') { void enterAssignmentFullscreen(); return; }
  if (action === 'leave-assignment') { clearActiveAssignment(); return; }
  if (action === 'assignment-toolbox') {
    if(activeSchoolAssignment?.testMode)return showToast('Tools locked','Extra tools are disabled in Test Mode.');
    openSimpleModal('Assignment tools',`<div class="assignment-tool-list"><button class="btn secondary" data-action="assignment-lesson-help">Lesson Support</button><button class="btn secondary" data-action="assignment-textbook">Task Textbook</button><button class="btn secondary" data-action="open-scientific-calculator">Calculator</button></div><p class="muted">These tools open over the assignment so you can stay in the focused workspace.</p>`); return;
  }
  if (action === 'assignment-more') {
    const due=activeSchoolAssignment?.dueAt?formatSchoolDate(activeSchoolAssignment.dueAt):'No due date';
    openSimpleModal('Assignment details',`<div class="simple-list"><div><strong>${escapeHtml(activeSchoolAssignment?.assignmentTitle||currentGeneratedTask?.task?.title||'Assigned work')}</strong><span>${escapeHtml(activeSchoolAssignment?.className||'MathsExpress')}</span></div><div><strong>Due</strong><span>${escapeHtml(due)}</span></div><div><strong>AI Helper</strong><span>${activeSchoolAssignment?.tutorAllowed===false?'Locked by teacher':'Available'}</span></div><div><strong>Hints</strong><span>${activeSchoolAssignment?.hintsAllowed===false?'Locked by teacher':'Available'}</span></div><div><strong>Calculator</strong><span>${activeSchoolAssignment?.calculatorAllowed===false?'Locked by teacher':'Available'}</span></div></div>`); return;
  }
  if (action === 'owner-activity-refresh') { ownerActivityLoadedAt=0; loadOwnerActivityData(true); return; }
  if (action === 'owner-activity-export') { const rows=filterOwnerActivity(ownerActivityRows,ownerActivityFilters).map(r=>({time:r.createdAt,user:r.displayName,email:r.email,role:r.role,category:r.category,event:r.eventType,action:r.action,page:r.page,source:r.source,details:JSON.stringify(r.details||{})})); downloadTextFile(`mathsexpress-activity-${localDateString()}.csv`,exportRowsCsv(rows),'text/csv;charset=utf-8'); return; }
  if (action === 'owner-activity-tab') { ownerActivityMode=actionEl.dataset.tab==='users'?'users':'activity'; renderOwnerActivity(false); return; }
  if (action === 'owner-user-detail') { return openOwnerUserDetail(actionEl.dataset.userId||''); }
  if (action === 'owner-set-user-role') { const userId=actionEl.dataset.userId||''; const role=document.getElementById('owner-user-role-select')?.value||'player'; getSchoolClient().ownerUpdateUserRole(userId,role).then(()=>{showToast('Role updated',`User is now ${platformRoleLabel(role)}.`,'success'); ownerActivityLoadedAt=0; openOwnerUserDetail(userId);}).catch(e=>showToast('Could not update role',e.message)); return; }
  if (action === 'owner-set-user-status') { const userId=actionEl.dataset.userId||''; const status=actionEl.dataset.status||'active'; getSchoolClient().ownerUpdateUserStatus(userId,status).then(()=>{showToast('Account status updated',status,'success'); ownerActivityLoadedAt=0; openOwnerUserDetail(userId);}).catch(e=>showToast('Could not update account',e.message)); return; }

  if (action === 'owner-save-user-profile') { const userId=actionEl.dataset.userId||''; getSchoolClient().ownerUpdateUserProfile(userId,{displayName:document.getElementById('owner-user-display-name')?.value||'',username:document.getElementById('owner-user-username')?.value||'',yearLevel:document.getElementById('owner-user-year-level')?.value||null}).then(()=>{showToast('Account updated','Name, username and learning year saved.','success');ownerActivityLoadedAt=0;openOwnerUserDetail(userId);}).catch(e=>showToast('Could not update account',e.message)); return; }
  if (action === 'owner-adjust-user-rewards') { const userId=actionEl.dataset.userId||''; getSchoolClient().ownerAdjustUserRewards(userId,{coinsDelta:document.getElementById('owner-user-coins-delta')?.value||0,xpDelta:document.getElementById('owner-user-xp-delta')?.value||0,gameTimeDelta:document.getElementById('owner-user-game-delta')?.value||0}).then(()=>{showToast('Rewards updated','Coins, XP and Game Time were updated.','success');openOwnerUserDetail(userId);}).catch(e=>showToast('Could not update rewards',e.message)); return; }
  if (action === 'owner-send-password-reset') { const email=actionEl.dataset.email||''; if(!email)return showToast('No email','This account has no email address.'); accountClient.resetPassword(email).then(()=>showToast('Password reset sent','A secure password-reset email was requested.','success')).catch(e=>showToast('Could not send reset',e.message)); return; }
  if (action === 'claim-daily-mission') { claimDailyMission(actionEl.dataset.missionId||''); return; }
  if (action === 'mark-notice-read') { const id=actionEl.dataset.noticeId||''; persist({...state,notifications:(state.notifications||[]).map(n=>n.id===id?{...n,read:true}:n)},{quiet:true}); return renderHome(); }
  if (action === 'learning-path-year') { if(!canUseTeacherHub(account)) return; persist({...state,learningPathYear:normaliseYearLevel(actionEl.dataset.year)},{quiet:true}); return renderLearningPath(); }
  if (action === 'start-recommended-path' || action === 'start-adaptive-practice') { const skill=recommendedLearningPathSkill(); const task=taskForLearningSkill(skill,'adaptive',10); if(!task)return showToast('No practice found','Choose a skill from Learn.'); activeSchoolAssignment=null; return startGeneratedTask(task.id,{returnRoute:routeFromHash().route}); }
  if (action === 'start-path-skill') { const skillYear=normaliseYearLevel(actionEl.dataset.skillYear,account.profile?.yearLevel); const skill=getCurriculumSkill(skillYear,actionEl.dataset.skillId)||CURRICULUM.find(x=>x.id===actionEl.dataset.skillId); const task=taskForLearningSkill(skill,'adaptive',10); if(!task)return showToast('No task found','Try another skill.'); activeSchoolAssignment=null; return startGeneratedTask(task.id,{returnRoute:routeFromHash().route}); }
  if (action === 'start-mixed-revision') { const year=normaliseYearLevel(account.profile?.yearLevel); const weak=learningPathRows(year).filter(x=>x.unlocked).sort((a,b)=>a.mastery-b.mastery)[0]; const task=taskForLearningSkill(weak,'revision',15); if(!task)return showToast('Revision unavailable','Complete more practice first.'); activeSchoolAssignment=null; return startGeneratedTask(task.id,{returnRoute:routeFromHash().route}); }
  if (action === 'start-exam-practice') { void enterAssignmentFullscreen({quiet:true}); const year=normaliseYearLevel(account.profile?.yearLevel); const skill=recommendedLearningPathSkill()||getCurriculumSkills({yearLevel:year})[0]; const task=taskForLearningSkill(skill,'test',20); if(!task)return showToast('Exam practice unavailable','Try another skill.'); activeSchoolAssignment={id:'local-exam',classId:null,lessonId:'',taskId:task.id,testMode:true,tutorAllowed:false,hintsAllowed:false,calculatorAllowed:false,videosAllowed:false,gamesLocked:true,focusRequired:true,answered:0,correct:0,startedAt:Date.now(),synced:true,localOnly:true}; saveActiveAssignmentSession(); return startAssignedGeneratedTask(task.id); }
  if (action === 'start-review-skill') { const skillYear=normaliseYearLevel(actionEl.dataset.skillYear,account.profile?.yearLevel); const skill=getCurriculumSkill(skillYear,actionEl.dataset.skillId)||CURRICULUM.find(x=>x.id===actionEl.dataset.skillId); const task=taskForLearningSkill(skill,'revision',10); if(!task)return showToast('Review unavailable','Try from the Learning Path.'); persist({...state,spacedReviews:(state.spacedReviews||[]).map(r=>r.id===actionEl.dataset.reviewId?{...r,done:true}:r)},{quiet:true}); activeSchoolAssignment=null; return startGeneratedTask(task.id,{returnRoute:routeFromHash().route}); }
  if (action === 'shop-category') { shopCategory=actionEl.dataset.category||'all'; return renderShop(); }
  if (action === 'start-v6-game') return startV6Arcade(actionEl.dataset.game);
  if (action === 'v6-game-answer') return answerV6Arcade(actionEl.dataset.choice);
  if (action === 'quick-release-results') {
    const assignmentId=String(actionEl.dataset.assignmentId||'');
    getSchoolClient().updateAssignmentControls(assignmentId,{resultsReleased:true}).then(()=>{showToast('Results unlocked','Students can now see their test results.','success');return renderTeacherClass();}).catch(error=>showToast('Could not unlock results',error.message||'Try again.'));
    return;
  }
  if (action === 'assignment-controls') return assignmentControlModal(actionEl.dataset.assignmentId);
  if (action === 'print-class-report') { globalThis.print?.(); return; }
  if (action === 'download-parent-report') { const m=buildProfileModel(state); const text=`MathsExpress Weekly Report\nStudent: ${state.playerName}\nLevel: ${m.level}\nAccuracy: ${m.accuracy}%\nQuestions answered: ${m.questionsAnswered}\nStreak: ${state.streak||0} days\nWeekly questions: ${state.weeklyQuestionsCompleted||0}/${state.weeklyGoalQuestions||30}\n`; downloadTextFile(`mathsexpress-weekly-report-${localDateString()}.txt`,text); return; }
  if (action === 'open-planner-task') { return openSimpleModal('Add study task',`<form id="planner-task-form" class="school-form"><label>Task<input name="title" required placeholder="e.g. Revise trigonometry"></label><div class="form-two"><label>Date<input name="date" type="date" required value="${localDateString()}"></label><label>Type<select name="type"><option>Study</option><option>Homework</option><option>Revision</option><option>Test</option><option>Goal</option></select></label></div><button class="btn primary" type="submit">Add to planner</button></form>`); }
  if (action === 'toggle-planner-task') { const id=actionEl.dataset.taskId||''; persist({...state,plannerTasks:(state.plannerTasks||[]).map(x=>x.id===id?{...x,done:!x.done}:x)},{quiet:true}); return renderCalendar(); }
  if (action === 'refresh-class-focus') { return renderTeacherClass(); }
  if (action === 'open-focus-monitor') { return openClassFocusMonitor(actionEl.dataset.classId||selectedTeacherClassId); }
  if (action === 'refresh-focus-modal') { return openClassFocusMonitor(actionEl.dataset.classId||selectedTeacherClassId); }
  if (action === 'remove-education-domain') { const domain=actionEl.dataset.domain||''; getSchoolClient().removeEducationDomain(domain).then(()=>{showToast('Domain removed',domain,'success');openEducationDomainsModal();}).catch(e=>showToast('Could not remove domain',e.message)); return; }
  if (action === 'email-parent-report') {
    queueAndTryParentEmail('progress-report',String(actionEl.dataset.schoolId||''),String(actionEl.dataset.studentId||'')).then(result=>{
      if(result.delivery==='sent') showToast('Progress report emailed',`${Number(result?.sent||0)} email${Number(result?.sent||0)===1?'':'s'} sent.`, 'success');
      else showToast('Email setup required','The progress report is safely queued. Email delivery is not configured on this deployment yet.');
      openParentAccountsModal();
    }).catch(e=>showToast('Could not queue report',e.message||'Check the parent email address.'));
    return;
  }
  if (action === 'retry-parent-email') {
    const id=Number(actionEl.dataset.outboxId)||0;
    if(!id)return;
    parentEmailRequest(id).then(result=>{showToast('Parent email sent',`${Number(result?.sent||0)} email${Number(result?.sent||0)===1?'':'s'} sent.`, 'success');openParentAccountsModal();}).catch(e=>{showToast('Still queued',e.message||'Email delivery is not configured yet.');openParentAccountsModal();});
    return;
  }
  if (action === 'open-student-parent') { return openStudentParentModal(); }
  if (action === 'parent-child') { selectedParentChildId=actionEl.dataset.studentId||''; return renderGuardianPortal(); }
  if (action === 'generated-drag-tile') { const source=document.getElementById('generated-drag-source'); const zone=document.getElementById('generated-drag-zone'); if(!source||!zone)return; const placeholder=zone.querySelector('.drop-placeholder'); if(placeholder)placeholder.remove(); (actionEl.parentElement===zone?source:zone).append(actionEl); return; }
  if (action === 'number-line-step') { const input=document.getElementById('lesson-answer'); if(!input||input.type!=='range')return; const delta=Number(actionEl.dataset.delta)||0; const min=Number(input.min),max=Number(input.max); input.value=String(Math.min(max,Math.max(min,Number(input.value)+delta))); const output=document.getElementById('generated-number-line-output'); if(output)output.textContent=input.value; return; }
  if (action === 'generated-drag-reset') { const source=document.getElementById('generated-drag-source'); const zone=document.getElementById('generated-drag-zone'); if(!source||!zone)return; Array.from(zone.querySelectorAll('.generated-drag-tile')).forEach(el=>source.append(el)); if(!zone.querySelector('.drop-placeholder'))zone.insertAdjacentHTML('beforeend','<span class="drop-placeholder">Drop tiles here</span>'); return; }
  if (action === 'open-student-identity-editor') { return openStudentIdentityEditor(actionEl.dataset.studentId||''); }
  if (action === 'open-teacher-feedback') { return openTeacherFeedbackModal(actionEl.dataset.studentId||''); }
  if (action === 'open-parent-message-teacher') { return openParentMessagesModal(actionEl.dataset.studentId||''); }

  if (action === 'textbook-year') { if(!canUseTeacherHub(account)) return; textbookYearLevel=normaliseYearLevel(actionEl.dataset.year); textbookPathway='all'; textbookBookId=''; textbookQuery=''; textbookExpandedChapters=new Set(); return renderTextbook(); }
  if (action === 'textbook-toggle-chapter') { const id=String(actionEl.dataset.chapterId||''); if(!id)return; const next=new Set(textbookExpandedChapters); if(next.has(id))next.delete(id);else next.add(id); textbookExpandedChapters=next; return renderPreservingScroll(renderTextbook); }
  if (action === 'textbook-publisher') { const publisher=String(actionEl.dataset.publisher||'Cambridge'); if(TEXTBOOK_PUBLISHERS.includes(publisher))textbookPublisher=publisher; textbookPathway='all'; textbookBookId=''; textbookQuery=''; textbookExpandedChapters=new Set(); return renderTextbook(); }
  if (action === 'textbook-pathway') { textbookPathway=actionEl.dataset.pathway||'all'; textbookBookId=''; textbookQuery=''; textbookExpandedChapters=new Set(); return renderTextbook(); }
  if (action === 'clear-textbook-search') { textbookQuery=''; return renderTextbook(); }
  if (action === 'load-licensed-pdf') { return openLicensedPdfLoadModal(actionEl.dataset.pdfKey||CAMBRIDGE_YEAR9_PDF_KEY,Number(actionEl.dataset.pdfPage)||1,actionEl.dataset.pdfLabel||'CambridgeMATHS NSW Year 9'); }
  if (action === 'open-licensed-textbook-page') { return void openLicensedPdfPage(actionEl.dataset.pdfKey||CAMBRIDGE_YEAR9_PDF_KEY,Number(actionEl.dataset.pdfPage)||1,actionEl.dataset.pdfLabel||'CambridgeMATHS NSW Year 9'); }
  if (action === 'open-textbook-section') { const id=actionEl.dataset.sectionId||''; if(!getTextbookSection(id)) return showToast('Section unavailable','That textbook section could not be found.'); void flushTextbookReadTracking(); persist({...state,textbookLastSection:id},{quiet:true}); return go('textbook-lesson',id); }
  if (action === 'bookmark-textbook-section') { const id=actionEl.dataset.sectionId||''; const set=new Set(state.textbookBookmarks||[]); if(set.has(id)) set.delete(id); else set.add(id); persist({...state,textbookBookmarks:[...set]},{quiet:true}); showToast(set.has(id)?'Bookmarked':'Bookmark removed',set.has(id)?'This section is saved for quick return.':'Removed from your saved sections.','success'); return renderTextbookLesson(); }
  if (action === 'complete-textbook-section') { const id=actionEl.dataset.sectionId||''; const current=Math.max(0,Number(state.textbookProgress?.[id])||0); const next=current>=100?0:100; persist({...state,textbookProgress:{...(state.textbookProgress||{}),[id]:next}},{quiet:true}); void flushTextbookReadTracking({completed:next>=100}); showToast(next>=100?'Section complete':'Completion cleared',next>=100?'Nice work — your textbook progress has been updated.':'You can mark it complete again when ready.','success'); return renderTextbookLesson(); }
  if (action === 'read-textbook-section') { const section=getTextbookSection(actionEl.dataset.sectionId||''); if(!section)return; const text=[section.title,section.learningGoal,...section.explanation,section.keyRule].join('. '); return readText(text,actionEl); }
  if (action === 'textbook-assign-menu') { return openTextbookAssignMenu(actionEl.dataset.bookId||textbookBookId); }
  if (action === 'assign-textbook-task') { if(!canUseTeacherHub(account)) return showToast('Teacher access required','Only teachers can assign textbook work.'); const taskId=actionEl.dataset.taskId||''; if(!getTaskById(taskId)) return showToast('Task unavailable','That textbook task could not be found.'); const title=String(actionEl.dataset.assignmentTitle||'').trim(); const reference=title?`${textbookPublisher} textbook · ${title}`:''; return openQuickAssign(taskId,{title:title||getTaskById(taskId)?.title||'Textbook task',reference}); }

  if (action === 'open-studio-content') return openStudioContent(actionEl.dataset.contentId);
  if (action === 'studio-poll-vote') {
    const contentId=activeStudioContentId; if(!contentId)return;
    getSchoolClient().submitLiveResponse(contentId,{optionId:actionEl.dataset.option,label:actionEl.dataset.label},{score:1}).then(()=>{document.getElementById('modal-root').innerHTML='';showToast('Response sent','Your teacher can see your poll response.','success');}).catch((e)=>showToast('Couldn’t send response',e.message)); return;
  }
  if (action === 'toggle-more-nav') {
    const menu = document.getElementById('more-nav-menu');
    const button = document.getElementById('more-nav-button');
    if (!menu || !button) return;
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
    return;
  }
  if (action === 'open-student-tab') {
    studentHubTab = actionEl.dataset.tab || 'class';
    const menu = document.getElementById('more-nav-menu');
    const button = document.getElementById('more-nav-button');
    if (menu) menu.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
    return routeFromHash().route === 'student-hub' ? renderStudentHub() : go('student-hub');
  }
  if (action === 'tool-tab') { activeToolTab=actionEl.dataset.tab||'study'; return renderTools(); }
  if (v7Action(action, actionEl)) return;
  if (completeAction(action)) return;
  if (action === 'complete-save-notebook') { const body=document.getElementById('complete-notebook-text')?.value||''; const page=createNotebookPage({title:`Notes ${new Date().toLocaleDateString()}`,body,tags:['maths']}); persist({...state,notebookPages:[...(state.notebookPages||[]),page].slice(-100)},{quiet:true}); showToast('Notebook saved','Your maths notes were saved.','success'); return; }
  if (action === 'complete-save-starter-flashcards') { const cards=createFlashcards([{term:'Gradient',definition:'rise ÷ run'},{term:'Pythagoras',definition:'a² + b² = c²'}]); persist({...state,flashcards:cards},{quiet:true}); showToast('Flashcards saved','Starter revision cards are ready.','success'); return; }
  if (action === 'complete-download-formulas') { const sheet=buildFormulaSheet([{topic:'Circle',formula:'A = πr²'},{topic:'Pythagoras',formula:'a² + b² = c²'},{topic:'Gradient',formula:'m = (y₂-y₁)/(x₂-x₁)'}]); downloadTextFile('MathsExpress-Formula-Sheet.txt',sheet); return showToast('Formula sheet downloaded','Saved as a text file.','success'); }
  if (action === 'complete-download-exam') { const q=searchTaskLibrary({yearLevel:normaliseYearLevel(account.profile?.yearLevel)}).slice(0,10); const paper=buildExamPaper({title:`${yearLabel(account.profile?.yearLevel)} MathsExpress Exam`,questions:q.map((x,i)=>({title:x.title,marks:i%3===0?2:1}))}); downloadTextFile('MathsExpress-Exam-Outline.txt',`${paper.title}\nReading time: ${paper.readingMinutes} minutes\nWriting time: ${paper.timeMinutes} minutes\nTotal marks: ${paper.totalMarks}\n\n${paper.questions.map((x,i)=>`${i+1}. ${x.title} [${x.marks}]`).join('\n')}`); return showToast('Exam outline downloaded','Version-ready exam outline created.','success'); }
  if (action === 'complete-download-parent-report') { const r=buildParentWeeklySummary({name:state.playerName,completed:5,assigned:6,mastery:state.mastery?.algebra||0,minutes:Math.round((state.stats?.answered||0)*1.5)}); downloadTextFile('MathsExpress-Parent-Weekly-Report.txt',r.text); return showToast('Parent report downloaded','Weekly summary created.','success'); }
  if (action === 'complete-export-backup') { const payload={exportedAt:new Date().toISOString(),profile:{displayName:state.playerName,yearLevel:normaliseYearLevel(account.profile?.yearLevel)},state}; downloadTextFile(`MathsExpress-Backup-${localDateString()}.json`,JSON.stringify(payload,null,2),'application/json'); return showToast('Backup exported','A local account backup was created.','success'); }
  if (action === 'complete-toggle-focus') { persist({...state,focusMode:!state.focusMode},{quiet:true}); document.documentElement.classList.toggle('mx-focus-mode',Boolean(state.focusMode)); showToast(state.focusMode?'Focus Mode on':'Focus Mode off',state.focusMode?'Games and reward distractions are hidden while you study.':'Normal MathsExpress view restored.','success'); return; }
  if (action === 'calculator-key') {
    const input=document.getElementById('complete-calc-expression'); if(!input)return;
    const value=actionEl.dataset.value||'';
    if(value==='clear'){input.value=''; calculatorAns=0; const out=document.getElementById('complete-calc-output'); if(out)out.textContent='0'; input.focus(); return;}
    if(value==='delete'){const start=input.selectionStart??input.value.length,end=input.selectionEnd??start; input.value=start!==end?input.value.slice(0,start)+input.value.slice(end):input.value.slice(0,Math.max(0,start-1))+input.value.slice(end); input.focus(); const pos=start!==end?start:Math.max(0,start-1); try{input.setSelectionRange(pos,pos);}catch{} return;}
    if(value==='equals'){const raw=String(input.value||''); const out=document.getElementById('complete-calc-output'); try{const result=evaluateScientificCalculator(raw); if(out)out.textContent=String(result);}catch(error){if(out)out.textContent=error.message||'Invalid expression';} input.focus(); return;}
    let insert=value==='square'?'^2':value==='ans'?'ans':value;
    const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
    input.value=input.value.slice(0,start)+insert+input.value.slice(end); const pos=start+insert.length; input.focus(); try{input.setSelectionRange(pos,pos);}catch{} return;
  }
  if (action === 'calculator-toggle-angle') { calculatorAngleMode=calculatorAngleMode==='deg'?'rad':'deg'; actionEl.textContent=calculatorAngleMode.toUpperCase(); return; }
  if (action === 'complete-calc') { const input=document.getElementById('complete-calc-expression'); const raw=String(input?.value||''); const out=document.getElementById('complete-calc-output'); try{const result=evaluateScientificCalculator(raw); if(out)out.textContent=String(result);}catch(error){if(out)out.textContent=error.message||'Invalid expression';} return; }
  if (action === 'complete-convert-unit') { const value=Number(document.getElementById('unit-value')?.value); const from=document.getElementById('unit-from')?.value||''; const to=document.getElementById('unit-to')?.value||''; const out=document.getElementById('unit-convert-output'); const families={length:new Set(['mm','cm','m','km']),mass:new Set(['mg','g','kg']),capacity:new Set(['ml','l'])}; const family=Object.values(families).find(set=>set.has(from)&&set.has(to)); const r=family?convertUnit(value,from,to):{ok:false}; if(out)out.textContent=r.ok?`${value} ${from} = ${Math.round(r.value*1e9)/1e9} ${to}`:'Choose units from the same measurement family.'; return; }
  if (action === 'complete-run-probability') { const kind=document.getElementById('probability-kind')?.value||'coin'; const trials=Math.max(1,Math.min(10000,Number(document.getElementById('probability-trials')?.value)||100)); const out=document.getElementById('probability-output'); const counts={}; for(let i=0;i<trials;i++){ let label=''; const r=Math.random(); if(kind==='coin')label=r<.5?'Heads':'Tails'; else if(kind==='die')label=String(1+Math.floor(r*6)); else label=['A','B','C','D'][Math.floor(r*4)]; counts[label]=(counts[label]||0)+1; } if(out)out.innerHTML=`<div class="probability-bars">${Object.entries(counts).map(([label,count])=>`<div><span>${escapeHtml(label)}</span><i style="width:${Math.round(count/trials*100)}%"></i><b>${count} (${(count/trials*100).toFixed(1)}%)</b></div>`).join('')}</div><small>${trials.toLocaleString()} trials</small>`; return; }
  if (action === 'complete-statistics') { const raw=String(document.getElementById('statistics-data')?.value||''); const values=raw.split(/[\s,;]+/).map(Number).filter(Number.isFinite); const out=document.getElementById('statistics-output'); if(!values.length){if(out)out.innerHTML='<p>Enter at least one valid number.</p>';return;} const sorted=[...values].sort((a,b)=>a-b); const mean=values.reduce((a,b)=>a+b,0)/values.length; const mid=Math.floor(sorted.length/2); const median=sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2; const range=sorted.at(-1)-sorted[0]; const variance=values.reduce((n,v)=>n+(v-mean)**2,0)/values.length; const sd=Math.sqrt(variance); if(out)out.innerHTML=`<div class="owner-analytics-strip"><div><b>${Math.round(mean*1000)/1000}</b><small>Mean</small></div><div><b>${median}</b><small>Median</small></div><div><b>${range}</b><small>Range</small></div><div><b>${Math.round(sd*1000)/1000}</b><small>Std dev</small></div></div><p>${values.length} values · min ${sorted[0]} · max ${sorted.at(-1)}</p>`; return; }
  if (action === 'complete-geometry') { const parsePoint=id=>String(document.getElementById(id)?.value||'').replace(/[()]/g,'').split(',').map(Number); const a=parsePoint('geometry-point-a'),b=parsePoint('geometry-point-b'); const out=document.getElementById('geometry-output'); if(a.length<2||b.length<2||!a.slice(0,2).every(Number.isFinite)||!b.slice(0,2).every(Number.isFinite)){if(out)out.textContent='Enter both points as x, y.';return;} const dx=b[0]-a[0],dy=b[1]-a[1],distance=Math.sqrt(dx*dx+dy*dy),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2]; if(out)out.innerHTML=`<strong>Distance:</strong> ${Math.round(distance*1000)/1000}<br><strong>Midpoint:</strong> (${mid[0]}, ${mid[1]})<br><strong>Gradient:</strong> ${dx===0?'undefined':Math.round((dy/dx)*1000)/1000}`; return; }
  if (action === 'complete-toggle-screen-reader') { const prefs={...(state.accessibilityPrefs||{}),highContrast:true,largeText:true,reducedMotion:true}; persist({...state,accessibilityPrefs:prefs},{quiet:true}); applyAccessibilityPreferences(); showToast('Screen-reader emphasis on','High contrast, larger text and reduced motion enabled.','success'); return; }
  if (action === 'complete-save-game-schedule') { const schedule=buildGameSchedule({allowedDays:['Friday','Saturday'],start:'12:00',end:'18:00',dailyCapMinutes:20}); persist({...state,gameSchedule:schedule},{quiet:true}); showToast('Game schedule saved','Game Time limits were saved for this account.','success'); return; }

  if (action === 'close-ultimate-modal') { const root=document.getElementById('modal-root'); if(root) root.innerHTML=''; return; }
  if (action === 'refresh-live-activities') { const schoolId=selectedSchoolId||teacherHubClasses[0]?.school_id||null; const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id||null; if(!schoolId||!classId)return showToast('Choose a class','Open a class before loading live activities.'); getSchoolClient().listStudioContent({schoolId,classId,limit:50}).then(rows=>{studioContent=rows;renderTools();showToast('Live activities refreshed',`${rows.length} recent school/class items loaded.`,'success');}).catch(e=>showToast('Couldn’t load activities',e.message)); return; }
  if (action === 'open-live-results') { const id=Number(actionEl.dataset.contentId); openSimpleModal('Live Results','<div class="school-loading"><span class="spinner"></span><strong>Loading responses…</strong></div>'); getSchoolClient().liveResults(id).then(rows=>{const item=studioContent.find(x=>Number(x.id)===id); openSimpleModal(item?.title||'Live Results',rows.length?`<div class="live-results-table">${rows.map((r,i)=>`<article><b>${i+1}</b><div><strong>${escapeHtml(r.display_name||'Student')}</strong><small>${escapeHtml(JSON.stringify(r.response||{}))}</small></div><span class="${r.correct===true?'success-text':r.correct===false?'danger-text':''}">${r.correct===true?'Correct':r.correct===false?'Check':'Responded'}</span></article>`).join('')}</div>`:'<div class="school-empty">No student responses yet.</div>');}).catch(e=>{document.getElementById('modal-root').innerHTML='';showToast('Couldn’t load live results',e.message);}); return; }
  if (action === 'open-tutor' || action === 'open-ai-helper') return openAiHelperModal();
  if (action === 'ai-helper-send') return sendAiHelperMessage(document.getElementById('ai-helper-input')?.value);
  if (action === 'ai-helper-chip') return sendAiHelperMessage(actionEl.dataset.message || '');
  if (action === 'ai-helper-clear') { aiChatHistory=[]; saveAiChatHistory(); try{globalThis.localStorage?.setItem(aiChatContextStorageKey(),currentAiChatContextKey());}catch{} return openAiHelperModal(); }
  if (action === 'open-workspace') return openWorkspaceModal();
  if (action === 'open-goals') return openGoalsModal();
  if (action === 'open-mistakes') return openMistakesModal();
  if (action === 'open-exam-generator') return openTestGenerator(true);
  if (action === 'open-test-generator') return openTestGenerator(false);
  if (action === 'open-question-builder') return openQuestionBuilder();
  if (action === 'open-homework-generator') { activeToolTab='assessment'; teacherHubTab='library'; schoolHubTab='assignments'; return go('teacher-hub'); }
  if (action === 'open-favourites') {
    const qs=(state.customQuestions||[]).filter(q=>(state.favoriteQuestionIds||[]).includes(q.id));
    return openSimpleModal('Question Favourites',qs.length?`<div class="mistake-list">${qs.map(q=>`<article><span>★</span><div><strong>${escapeHtml(q.topic)}</strong><p>${mathHtml(q.prompt)}</p></div></article>`).join('')}</div>`:'<div class="school-empty">No favourite custom questions yet. Use Question Builder to save one.</div>');
  }
  if (action === 'open-auto-revision') return openSimpleModal('Auto Revision Planner',`<form id="auto-revision-form" class="school-form"><label>Test / topic<input name="title" value="Upcoming maths test" required></label><div class="form-two"><label>Test date<input type="date" name="testDate" required></label><label>Revision sessions<select name="count"><option>3</option><option selected>5</option><option>7</option></select></label></div><p class="muted">MathsExpress spreads short revision sessions across the two weeks before the test.</p><button class="btn primary" type="submit">Create revision plan</button></form>`);
  if (action === 'preview-differentiation') { const rows=differentiateAssignment({title:'Same topic, three levels',questionCount:10}); const classes=teacherHubClasses.filter(c=>!c.archived); return openSimpleModal('Differentiated Assignment',`<div class="differentiation-grid">${rows.map(r=>`<article><span class="eyebrow">${r.group}</span><h3>${r.difficulty}</h3><p>${r.questionCount} questions · hints ${r.hintsAllowed?'on':'off'}</p></article>`).join('')}</div><form id="differentiated-assignment-form" class="school-form"><label>Title<input name="title" value="Differentiated practice" required></label><label>Class<select name="classId" required>${classes.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}</select></label><label>Questions<select name="count"><option>10</option><option>15</option><option>20</option></select></label><button class="btn primary" type="submit">Create 3 targeted versions</button></form>`); }
  if (action === 'print-worksheet') { openPrintableWorksheet(actionEl.dataset.taskId||TASK_LIBRARY[0]?.id); return; }
  if (action === 'open-calculator-rules') return openSimpleModal('Calculator Rules',`<div class="ultimate-grid"><article class="ultimate-card"><h3>No calculator</h3><p>Arithmetic and reasoning without calculator support.</p></article><article class="ultimate-card"><h3>Basic calculator</h3><p>Four operations and percentage work.</p></article><article class="ultimate-card"><h3>Scientific calculator</h3><p>Senior maths and trigonometry support.</p></article></div><p class="muted">Set the calculator rule when generating an Exam or assignment.</p>`);
  if (action === 'open-assignment-scheduler') return openSimpleModal('Assignment Scheduling',`<div class="ultimate-card"><p>MathsExpress assignments already support both <strong>start time</strong> and <strong>due time</strong>. Use the Task Library / Quick Assign workflow to schedule release and due dates.</p><button class="btn primary" data-route="teacher-hub">Open Task Library</button></div>`);
  if (action === 'open-recurring-homework') { const classes=teacherHubClasses.filter(c=>!c.archived); return openSimpleModal('Recurring Homework',`<form id="recurring-homework-form" class="school-form"><label>Class<select name="classId" required>${classes.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}</select></label><label>Homework title<input name="title" value="Weekly maths practice" required></label><div class="form-two"><label>Frequency<select name="frequency"><option value="weekly">Weekly</option><option value="fortnightly">Fortnightly</option><option value="daily">Daily</option></select></label><label>Occurrences<select name="count"><option>4</option><option selected>6</option><option>8</option></select></label></div><label>First due date<input type="date" name="startDate" required></label><button class="btn primary" type="submit">Schedule homework</button></form>`); }
  if (action === 'start-daily-practice') { const options=searchTaskLibrary({yearLevel:normaliseYearLevel(account.profile?.yearLevel)}); const five=buildDailyPractice(options,5,new Date().getDate()); if(!five.length)return showToast('No practice found','Try another year level.'); return startGeneratedTask(five[0].id,{returnRoute:routeFromHash().route}); }
  if (action === 'tutor-mode') { const map={hint:'Give me a hint',explain:'Explain this simply',example:'Show a similar example',mistake:'Check my likely mistake'}; return sendAiHelperMessage(map[actionEl.dataset.mode]||'Help me'); }
  if (action === 'equation-key') { const ta=document.getElementById('working-pad'); if(ta){ta.value+=actionEl.dataset.key||'';ta.focus();} return; }
  if (action === 'graph-clear') { graphPoints=[]; graphExpression=''; const input=document.getElementById('graph-expression'); if(input)input.value=''; return drawWorkspaceGraph(); }
  if (action === 'graph-plot-expression') { const input=document.getElementById('graph-expression'); try { graphFunction(input?.value||''); graphExpression=String(input?.value||'').trim(); drawWorkspaceGraph(); showToast('Graph plotted',`y = ${graphExpression}`,'success'); } catch(error) { showToast('Couldn’t plot equation',error.message); } return; }
  if (action === 'goal-progress') { const id=actionEl.dataset.goalId; const current=(state.goals||[]).find(g=>g.id===id); const changed=current?updateGoal(current,1):null; persist({...state,goals:(state.goals||[]).map(g=>g.id===id?changed:g)},{quiet:true}); if(changed?.remoteId) getSchoolClient().updateGoal(changed.remoteId,changed.progress,changed.completed?'completed':'active').catch(()=>{}); return openGoalsModal(); }
  if (action === 'study-timer-toggle') {
    const t=studyTimerSnapshot(); if(t.running) stopStudyTimerInterval(); else startStudyTimerInterval();
    persistStudyTimer(); updateStudyTimerDisplay(); return;
  }
  if (action === 'study-timer-reset') {
    stopStudyTimerInterval(); studyTimerRuntime={mode:'study',remaining:25*60,cyclesDone:0,cycles:4,running:false}; persistStudyTimer(); updateStudyTimerDisplay(); return;
  }
  if (action === 'study-timer-skip') {
    const t=studyTimerSnapshot(); t.mode=t.mode==='study'?'break':'study'; if(t.mode==='study'){t.cyclesDone+=1; if(t.cyclesDone>=t.cycles){t.cyclesDone=0; showToast('Pomodoro complete','Four focus cycles completed. Starting a new set at cycle 1 of 4.','success');}} t.remaining=t.mode==='study'?25*60:5*60; persistStudyTimer(); updateStudyTimerDisplay(); return;
  }
  if (action === 'achievements-filter') { achievementsFilter=actionEl.dataset.filter||'all'; return renderAchievements(); }
  if (action === 'toggle-access') { const pref=actionEl.dataset.pref; const prefs={...(state.accessibilityPrefs||{}),[pref]:Boolean(actionEl.checked)}; persist({...state,accessibilityPrefs:prefs},{quiet:true}); applyAccessibilityPreferences(); return renderTools(); }
  if (action === 'read-current-page') return readText(document.getElementById('app-view')?.innerText||'MathsExpress',actionEl);
  if (action === 'open-calendar-item') return openSimpleModal('Add Calendar Event',`<form id="calendar-item-form" class="school-form"><label>Event<input name="title" required></label><div class="form-two"><label>Date<input type="date" name="date" required></label><label>Type<select name="type"><option>Assignment</option><option>Test</option><option>Revision</option><option>Class Game</option><option>School</option></select></label></div><button class="btn primary" type="submit">Add event</button></form>`);
  if (action === 'print-parent-summary') { globalThis.print?.(); return; }
  if (action === 'open-poll') return openSimpleModal('Quick Poll',`<form id="poll-form" class="school-form"><label>Question<input name="question" required value="How confident do you feel about today’s topic?"></label><div class="form-two"><label>Option 1<input name="a" value="Very confident"></label><label>Option 2<input name="b" value="Mostly confident"></label></div><div class="form-two"><label>Option 3<input name="c" value="Not sure yet"></label><label>Option 4<input name="d" value="I need help"></label></div><button class="btn primary" type="submit">Launch poll</button></form>`);
  if (action === 'vote-poll') { livePoll=votePoll(livePoll,actionEl.dataset.option); return renderTools(); }
  if (action === 'create-exit-ticket') { exitTicket=createExitTicket('Current lesson',3); const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id||null; const schoolId=selectedSchoolId||teacherHubClasses.find(c=>c.id===classId)?.school_id||null; if(classId&&schoolId) getSchoolClient().createStudioContent({schoolId,classId,type:'exit-ticket',title:'Exit Ticket',body:'Three-question end-of-lesson check',payload:{count:3}}).then(r=>{exitTicket.remoteId=r?.id||null;}).catch(()=>{}); showToast('Exit Ticket created','3-question end-of-lesson check is ready.','success'); teacherHubTab='library'; taskLibraryFilters={...taskLibraryFilters,questionCount:5}; return; }
  if (action === 'start-live-lesson') { if(!canUseTeacherHub(account))return showToast('Teacher feature','Teacher or Owner access is required.'); const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id; if(!classId)return showToast('Choose a class','Create or open a class first.'); const schoolId=selectedSchoolId||teacherHubClasses.find(c=>c.id===classId)?.school_id||null; const school=getSchoolClient(); Promise.all([school.createClassroomSession(classId,'team-quiz',{liveLesson:true,questionCount:10}),schoolId?school.createStudioContent({schoolId,classId,type:'live-lesson',title:'Live Lesson',body:'Teacher-led live maths lesson',payload:{questionCount:10}}):Promise.resolve(null)]).then(()=>showToast('Live Lesson started','Students can join it from Games.','success')).catch(e=>showToast('Couldn’t start',e.message)); return; }
  if (action === 'open-student-groups') { const members=(lastTeacherReport?.students||[]).map((x,i)=>({id:x.studentId||x.user_id||i,name:x.displayName||x.display_name||'Student',mastery:Number(x.mastery||0)})); if(!members.length)return showToast('Open a class report first','Student Groups uses the students in the class report you open.'); const groups=buildStudentGroups(members,'balanced',3); return openSimpleModal('Student Groups',`<div class="differentiation-grid">${groups.map(g=>`<article><span class="eyebrow">${escapeHtml(g.name)}</span>${g.students.map(st=>`<p>${escapeHtml(st.name||st.displayName||'Student')}</p>`).join('')||'<p>Empty</p>'}</article>`).join('')}</div>`); }
  if (action === 'open-announcement') { const classes=teacherHubClasses.filter(c=>!c.archived); return openSimpleModal('Class announcement',`<form id="announcement-form" class="school-form"><label>Class<select name="classId" required>${classes.map(c=>`<option value="${escapeHtml(c.id)}" ${String(c.id)===String(selectedTeacherClassId)?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select></label><label>Title<input name="title" required maxlength="100"></label><label>Message<textarea name="body" rows="5" required maxlength="500"></textarea></label><button class="btn primary" type="submit">Send to class</button></form>`); }
  if (action === 'open-certificate') { const c=createCertificate({student:state.playerName,reason:'Outstanding progress in mathematics'}); return openSimpleModal('Certificate',`<div class="certificate-preview"><span>★</span><h2>${escapeHtml(c.title)}</h2><p>This certificate is presented to</p><h1>${escapeHtml(c.student)}</h1><p>${escapeHtml(c.reason)}</p><small>${escapeHtml(c.date)}</small></div>`,`<button class="btn primary" data-action="print-certificate">Print certificate</button>`); }
  if (action === 'print-certificate') { globalThis.print?.(); return; }
  if (action === 'open-staff-tools') { if(!canUseTeacherHub(account))return showToast('Teacher feature','Teacher or Owner access required.'); const classes=teacherHubClasses.filter(c=>!c.archived); return openSimpleModal('Co-teachers & Relief Access',`<form id="class-teacher-access-form" class="school-form"><label>Class<select name="classId" required>${classes.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}</select></label><label>Teacher email<input type="email" name="email" required placeholder="teacher@example.com"></label><label>Access type<select name="reliefHours"><option value="0">Permanent co-teacher</option><option value="8">Relief teacher — 8 hours</option><option value="24">Relief teacher — 24 hours</option><option value="72">Relief teacher — 3 days</option><option value="168">Relief teacher — 7 days</option></select></label><button class="btn primary" type="submit">Grant access</button></form>`); }
  if (action === 'open-head-dashboard' || action === 'open-principal-dashboard') { if(!canUseTeacherHub(account))return showToast('School leadership','Teacher/leadership access required.'); return openLeadershipDashboard(action==='open-principal-dashboard'?'principal':'head'); }
  if (action === 'export-platform-data') { const rows=[{player:state.playerName,level:levelFromXp(state.xp),coins:state.coins,streak:state.streak,accuracy:buildProfileModel(state).accuracy,mastery:state.mastery?.algebra||0}]; downloadTextFile('MathsExpress-Data.csv',exportRowsCsv(rows),'text/csv;charset=utf-8'); return showToast('Export ready','CSV downloaded.','success'); }
  if (action === 'open-student-import') { if(!selectedSchoolId)return showToast('Choose a school','Open School first.'); return openSimpleModal('Import Students',`<form id="student-import-form" class="school-form"><label>CSV rows<textarea name="rows" rows="10" required placeholder="name,email,year
Alex,alex@example.com,9"></textarea></label><p class="muted">Existing MathsExpress accounts are added to the school and selected class. Emails without accounts are returned as missing.</p><button class="btn primary" type="submit">Import students</button></form>`); }
  if (action === 'open-school-branding') { if(!selectedSchoolId)return showToast('Choose a school','Open School first so MathsExpress knows which school to update.'); return openSimpleModal('School Branding',`<form id="school-branding-form" class="school-form"><label>Display name<input name="displayName" value="${escapeHtml(schoolHubSchools.find(x=>String(x.id)===String(selectedSchoolId))?.display_name||schoolHubSchools.find(x=>String(x.id)===String(selectedSchoolId))?.name||'My School')}"></label><label>Logo reference<input name="logo" placeholder="Optional image URL or asset name"></label><label>Accent<select name="accent"><option value="olive">Olive</option><option value="navy">Navy</option><option value="purple">Purple</option><option value="blue">Blue</option></select></label><button class="btn primary" type="submit">Save branding</button></form>`); }
  if (action === 'open-feature-flags') { const flags=normalizeFeatureFlags(state.featureFlags||{}); return openSimpleModal('Feature Controls',`<div class="accessibility-panel">${Object.entries(flags).map(([k,v])=>`<label class="access-toggle"><span><strong>${escapeHtml(k.replace(/([A-Z])/g,' $1'))}</strong><small>Enable or disable this feature for testing.</small></span><input type="checkbox" data-action="toggle-feature" data-feature="${k}" ${v?'checked':''}></label>`).join('')}</div>`); }
  if (action === 'open-interventions') { const students=(lastTeacherReport?.students||[]); if(!students.length)return showToast('Open a class report first','Interventions are calculated from real students in the selected class.'); const rows=students.slice(0,12).map((st,i)=>({name:st.displayName||st.display_name||`Student ${i+1}`,reason:st.last_seen&&Date.now()-new Date(st.last_seen).getTime()>7*86400000?'Not active this week':'Review recent mastery and assignment results'})); return openSimpleModal('Teacher Interventions',`<div class="intervention-list">${rows.map(r=>`<article><span>!</span><div><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.reason)}</small></div></article>`).join('')}</div>`); }
  if (action === 'open-class-heatmap') { const students=(lastTeacherReport?.students||[]).slice(0,8); if(!students.length)return showToast('Open a class report first','The heatmap only uses real mastery records from that class.'); const skillIds=[...new Set((lastTeacherReport?.mastery||[]).map(m=>m.skill_id))].slice(0,5); if(!skillIds.length)return showToast('No mastery data yet','Students need to practise skills before a class heatmap can be shown.'); return openSimpleModal('Class Heatmap',`<div class="heatmap"><div class="heatmap-row head"><b>Student</b>${skillIds.map(id=>`<b>${escapeHtml(getLessonById(id)?.shortTitle||String(id))}</b>`).join('')}</div>${students.map(st=>`<div class="heatmap-row"><strong>${escapeHtml(st.displayName||st.display_name||'Student')}</strong>${skillIds.map(id=>{const row=(lastTeacherReport.mastery||[]).find(m=>(m.student_id===st.user_id||m.student_id===st.studentId)&&m.skill_id===id);const v=Math.max(0,Math.min(100,Math.round(Number(row?.mastery||0))));return `<span class="heat ${v>=80?'high':v>=50?'mid':'low'}">${v}%</span>`}).join('')}</div>`).join('')}</div>`); }
  if (action === 'open-student-timeline') { openSimpleModal('Student Timeline','<div class="school-loading"><span class="spinner"></span><strong>Loading recent activity…</strong></div>'); getSchoolClient().listActivity(30).then(rows=>{const root=document.querySelector('#modal-root .ultimate-modal-body');if(!root)return;root.innerHTML=rows.length?`<div class="timeline-list">${rows.map(r=>`<article><time>${escapeHtml(new Date(r.occurred_at).toLocaleDateString())}</time><div><strong>${escapeHtml(String(r.activity_type||'Maths activity').replaceAll('-',' '))}</strong><small>${escapeHtml(r.topic||'Maths')} · ${Number(r.correct||0)}/${Number(r.questions||0)} correct · ${Math.round(Number(r.active_seconds||0)/60)} min</small></div></article>`).join('')}</div>`:'<div class="school-empty">No activity has been recorded yet.</div>';}).catch(e=>showToast('Couldn’t load activity',e.message)); return; }
  if (action === 'open-class-challenge') return openSimpleModal('Class Weekly Challenge',`<div class="ultimate-card"><h3>10-question class speed challenge</h3><p>Use the same fair timing rules as Global Challenges, but only for one class.</p><button class="btn primary" data-action="launch-class-weekly">Launch for selected class</button></div>`);
  if (action === 'launch-class-weekly') { const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id; if(!classId)return showToast('Choose a class','Open a class first.'); getSchoolClient().createClassroomSession(classId,'quiz-show',{weeklyChallenge:true,questions:10}).then(()=>{document.getElementById('modal-root').innerHTML='';showToast('Class challenge live','Students can join from Games.','success')}).catch(e=>showToast('Couldn’t launch',e.message)); return; }
  if (action === 'open-school-leaderboard') { if(!lastTeacherReport?.students?.length)return showToast('Open a class report first','School leaderboards need real class/student data before they can be displayed.'); const attempts=lastTeacherReport.attempts||[]; const rows=lastTeacherReport.students.map(st=>{const sa=attempts.filter(a=>a.student_id===st.user_id);const avg=sa.length?Math.round(sa.reduce((n,a)=>n+Number(a.score_percent||0),0)/sa.length):0;return {name:st.display_name||st.displayName||'Student',avg};}).sort((a,b)=>b.avg-a.avg).slice(0,10); return openSimpleModal('School Leaderboards',`<div class="leaderboard-demo">${rows.map((r,i)=>`<div><b>${i+1}</b><span>${escapeHtml(r.name)}</span><strong>${r.avg}% average</strong></div>`).join('')}</div><p class="muted">This board is based on the currently opened class report. School leaders can disable leaderboards in Moderation Controls.</p>`); }
  if (action === 'open-moderation') return openSimpleModal('Moderation Controls',`<div class="accessibility-panel"><label class="access-toggle"><span><strong>Leaderboards</strong><small>Show or hide competitive rankings.</small></span><input type="checkbox" data-action="toggle-feature" data-feature="leaderboards" ${normalizeFeatureFlags(state.featureFlags||{}).leaderboards?'checked':''}></label><label class="access-toggle"><span><strong>Games</strong><small>Allow or hide student games.</small></span><input type="checkbox" data-action="toggle-feature" data-feature="games" ${normalizeFeatureFlags(state.featureFlags||{}).games?'checked':''}></label><label class="access-toggle"><span><strong>Global Challenges</strong><small>Allow or hide global challenges.</small></span><input type="checkbox" data-action="toggle-feature" data-feature="globalChallenges" ${normalizeFeatureFlags(state.featureFlags||{}).globalChallenges?'checked':''}></label></div>`);
  if (action === 'toggle-feature') { const key=actionEl.dataset.feature; const featureFlags={...(state.featureFlags||{}),[key]:Boolean(actionEl.checked)}; persist({...state,featureFlags},{quiet:true}); if(selectedSchoolId && canUseTeacherHub(account)) getSchoolClient().setSchoolControls(selectedSchoolId,{featureFlags}).catch(()=>{}); return; }
  if (action === 'vote-suggestion') { const id=String(actionEl.dataset.feedbackId||''); accountClient.ensureClient().rpc('mathsexpress_vote_feedback',{p_feedback_id:Number(id)}).then(({data,error})=>{ if(error) throw error; const votes={...(state.suggestionVotes||{}),[id]:Number(data?.votes||1)}; persist({...state,suggestionVotes:votes},{quiet:true}); const b=actionEl.querySelector('b'); if(b)b.textContent=String(votes[id]); showToast('Vote counted','Thanks for helping prioritise suggestions.','success'); }).catch(e=>showToast('Couldn’t vote',e.message)); return; }
  if (action === 'download-generated-test') { const title=actionEl.dataset.title||'Generated Test'; downloadTextFile(`${String(title).replace(/[^a-z0-9_-]+/gi,'-')}.txt`,`${title}\n\nGenerated by MathsExpress\n\nUse the digital task library to preview and assign the matching question set.`); return showToast('Test generated','Download created.','success'); }
  if (action === 'assign-generated-test') { const root=document.getElementById('modal-root'); if(root)root.innerHTML=''; teacherHubTab='library'; schoolHubTab='assignments'; return go('teacher-hub'); }
  if (action === 'open-teacher-rewards') {
    if(!canUseTeacherHub(account)) return showToast('Teacher feature','Teacher or Owner access required.');
    const classId=selectedTeacherClassId||teacherHubClasses.find(c=>!c.archived)?.id||'';
    if(!classId) return showToast('Choose a class','Open or create a class first.');
    const students=(lastTeacherReport?.class?.id===classId ? (lastTeacherReport.students||[]) : []);
    if(!students.length) return showToast('Open the class report first','Open a class so MathsExpress can load its students.');
    openSimpleModal('Give student rewards',`<form id="teacher-reward-form" class="school-form"><input type="hidden" name="classId" value="${escapeHtml(classId)}"><label>Student<select name="studentId" required>${students.map(st=>`<option value="${escapeHtml(st.user_id||st.studentId)}">${escapeHtml(st.display_name||st.displayName||'Student')}</option>`).join('')}</select></label><label>Coins<input name="coins" type="number" min="0" max="500" value="0"></label><label>Game Time seconds<input name="gameTimeSeconds" type="number" min="0" max="300" step="10" value="0"><small>Student Game Time can never exceed 5:00.</small></label><label>Reason<input name="reason" maxlength="240" placeholder="Great effort in class"></label><button class="btn primary" type="submit">Give reward</button></form>`);
    return;
  }

  if (action === 'school-tab') {
    schoolHubTab = actionEl.dataset.tab || 'overview';
    if (schoolHubTab !== 'assignments') teacherHubTab = schoolHubTab === 'classes' ? 'classes' : teacherHubTab === 'library' ? 'classes' : teacherHubTab;
    if (schoolHubTab === 'assignments' && teacherHubTab !== 'library') teacherHubTab = 'assignments';
    return renderTeacherHub();
  }
  if (action === 'remove-school-staff') {
    if (!selectedSchoolId) return;
    getSchoolClient().removeSchoolStaff(selectedSchoolId, actionEl.dataset.userId).then(() => { showToast('Staff removed', 'School access was removed.', 'success'); renderTeacherHub(); }).catch((error)=>showToast('Couldn’t remove staff', error.message));
    return;
  }
  if (action === 'toggle-teacher-more') {
    const wrap = actionEl.closest('.teacher-more-wrap');
    const menu = wrap?.querySelector('.teacher-more-menu');
    if (!menu) return;
    menu.hidden = !menu.hidden;
    actionEl.setAttribute('aria-expanded', String(!menu.hidden));
    return;
  }
  if (action === 'teacher-more-action') {
    const tool = actionEl.dataset.tool;
    const targetClass = selectedTeacherClassId || teacherHubClasses.find((item) => !item.archived)?.id || '';
    const menu = actionEl.closest('.teacher-more-menu');
    if (menu) menu.hidden = true;
    if (tool === 'templates') { teacherHubTab = 'library'; taskLibraryFilters = { ...taskLibraryFilters, query: '' }; showToast('Reusable work', 'Use the Task Library to preview and reuse ready-made work.', 'success'); return renderTeacherHub(); }
    if (!targetClass) { teacherHubTab = 'classes'; showToast('Create a class first', 'Planner, students and classroom games belong to a class.'); return renderTeacherHub(); }
    selectedTeacherClassId = targetClass;
    if (tool === 'games') {
      const root = document.getElementById('modal-root');
      root.innerHTML = `<div class="modal-backdrop"><div class="modal pop relaxed-tool-modal classroom-games-modal"><span class="eyebrow">Classroom games</span><h2>Choose a live maths game</h2><p class="lock-note">Students are split into balanced Blue and Red teams automatically. Every game uses one synced class state.</p><div class="classroom-game-menu">${CLASSROOM_MODES.map((mode) => `<button class="classroom-game-pick" data-action="launch-class-game" data-mode="${mode.id}"><strong>${escapeHtml(mode.label || mode.name || mode.id)}</strong><span>${escapeHtml(mode.description||'Live class maths game')}</span></button>`).join('')}</div><div class="simple-modal-actions"><button class="btn ghost" data-action="close-school-modal">Close</button></div></div></div>`;
      return;
    }
    go('teacher-class', targetClass);
    showToast(tool === 'planner' ? 'Planner opened' : 'Student list opened', tool === 'planner' ? 'Upcoming class work is shown near the top of this report.' : 'Your student list and recent progress are shown in this class report.', 'success');
    return;
  }

  if (action === 'preview-library-task') return openTaskPreview(actionEl.dataset.taskId);
  if (action === 'quick-assign-task') return openQuickAssign(actionEl.dataset.taskId);
  if (action === 'open-custom-assignment') return openCustomAssignment();
  if (action === 'close-school-modal') { const root = document.getElementById('modal-root'); if (root) { const url=root.dataset.pdfObjectUrl||''; if(url)try{URL.revokeObjectURL(url);}catch{} delete root.dataset.pdfObjectUrl; root.innerHTML = ''; } return; }

  if (action === 'retry-class-extras') { return renderStudentHub(); }
  if (action === 'retry-student-hub') { return renderStudentHub(); }
  if (action === 'student-hub-tab') { studentHubTab = actionEl.dataset.tab || 'class'; return renderStudentHub(); }
  if (action === 'switch-student-class') { selectedStudentClassId=String(actionEl.value||''); studentHubTab='class'; return renderStudentHub(); }
  if (action === 'teacher-tab') { const modal=document.getElementById('modal-root'); if(modal) modal.innerHTML=''; const requested = actionEl.dataset.tab || 'classes'; teacherHubTab = requested === 'create' ? 'library' : requested; if (teacherHubTab==='library' || teacherHubTab==='assignments') schoolHubTab='assignments'; else if (teacherHubTab==='reports') schoolHubTab='reports'; else if (teacherHubTab==='classes') schoolHubTab='classes'; return routeFromHash().route === 'teacher-class' ? go('teacher-hub') : renderTeacherHub(); }
  if (action === 'open-custom-worksheet-builder') { openCustomWorksheetBuilder(); return; }
  if (action === 'worksheet-add-question') { const task=getTaskById(actionEl.dataset.taskId); if(!task)return; const seed=Math.max(0,Number(actionEl.dataset.seed)||0), qi=Math.max(0,Number(actionEl.dataset.questionIndex)||0); const q=generateTaskQuestions(task,2,{seedOffset:seed})[qi]; if(!q)return; const added=normalizeWorksheetQuestion({...q,id:`${q.id}-ws-${Date.now()}`,sourceTitle:task.skill||task.title},selectedWorksheetQuestions().length); worksheetBuilderDraft.questions=[...selectedWorksheetQuestions(),added].slice(0,80); renderCustomWorksheetBuilder(); return; }
  if (action === 'worksheet-add-task-questions') { const task=getTaskById(actionEl.dataset.taskId); if(!task)return; const added=generateTaskQuestions(task,3,{seedOffset:Date.now()%1000000}).map((q,i)=>normalizeWorksheetQuestion({...q,sourceTitle:task.skill||task.title},i)); worksheetBuilderDraft.questions=[...selectedWorksheetQuestions(),...added].slice(0,80); renderCustomWorksheetBuilder(); return; }
  if (action === 'worksheet-remove-question') { const i=Number(actionEl.dataset.index); worksheetBuilderDraft.questions=selectedWorksheetQuestions().filter((_,idx)=>idx!==i); renderCustomWorksheetBuilder(); return; }
  if (action === 'worksheet-move-question') { const i=Number(actionEl.dataset.index),dir=Number(actionEl.dataset.direction); const q=[...selectedWorksheetQuestions()]; const j=i+dir; if(i>=0&&j>=0&&i<q.length&&j<q.length){[q[i],q[j]]=[q[j],q[i]];worksheetBuilderDraft.questions=q;} renderCustomWorksheetBuilder(); return; }
  if (action === 'worksheet-use-part') { const i=Number(actionEl.dataset.index),pi=Number(actionEl.dataset.part); const q=selectedWorksheetQuestions()[i],part=q?.parts?.[pi]; if(q&&part){ const replacement=normalizeWorksheetQuestion({...q,id:`${q.id}-part-${pi}`,prompt:`${q.prompt} — ${part.label||`Part ${pi+1}`}`,type:part.type||q.type,answer:part.answer??q.answer,acceptedAnswers:part.acceptedAnswers||q.acceptedAnswers,parts:[]},i); worksheetBuilderDraft.questions=selectedWorksheetQuestions().map((x,idx)=>idx===i?replacement:x); } renderCustomWorksheetBuilder(); return; }
  if (action === 'save-custom-worksheet') { const title=document.getElementById('worksheet-builder-title')?.value||worksheetBuilderDraft?.title; const w=saveWorksheetDraftLocal(title); if(!w)return showToast('Add questions first','A worksheet needs at least one question.'); showToast('Worksheet saved',`${w.questions.length} questions saved on this account.`, 'success'); renderCustomWorksheetBuilder(); return; }
  if (action === 'open-task-groups') { openTaskGroupsModal(actionEl.dataset.assignmentId); return; }
  if (action === 'open-mastery-evidence') { openMasteryEvidenceModal(actionEl.dataset.studentId,actionEl.dataset.skillId,actionEl.dataset.studentName); return; }
  if (action === 'open-course-progress') { openCourseProgressReport(); return; }
  if (action === 'open-grouped-task-report') { openGroupedTaskReport(); return; }
  if (action === 'open-year-over-year') { openYearOverYearAnalytics(); return; }
  if (action === 'open-district-report') { openDistrictDashboard(); return; }
  if (action === 'open-class-planner') { openClassPlannerCalendar(); return; }
  if (action === 'planner-prev') { teacherPlannerMonth=new Date(teacherPlannerMonth.getFullYear(),teacherPlannerMonth.getMonth()-1,1);openClassPlannerCalendar();return; }
  if (action === 'planner-next') { teacherPlannerMonth=new Date(teacherPlannerMonth.getFullYear(),teacherPlannerMonth.getMonth()+1,1);openClassPlannerCalendar();return; }
  if (action === 'planner-today') { teacherPlannerMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);openClassPlannerCalendar();return; }
  if (action === 'open-class-textbook-focus') { openClassTextbookFocusModal(); return; }
  if (action === 'open-year-override') { openStudentYearOverrideModal(actionEl.dataset.studentId); return; }
  if (action === 'clear-year-override') { getSchoolClient().setStudentYearOverride(actionEl.dataset.studentId,actionEl.dataset.classId,null,null).then(()=>{document.getElementById('modal-root').innerHTML='';showToast('Override cleared','The student will use the class year level again.','success');renderTeacherClass();}).catch(e=>showToast('Could not clear override',e.message));return; }
  if (action === 'open-textbook-task-search') { openTextbookTaskSearch(''); return; }
  if (action === 'open-integration-center') { openIntegrationCenter(); return; }
  if (action === 'open-canvas-grade-passback') { openCanvasGradePassback(); return; }
  if (action === 'open-integration-readiness') { openIntegrationReadiness(); return; }
  if (action === 'test-integration') { testIntegrationProvider(actionEl.dataset.provider); return; }
  if (action === 'preview-integration-roster') { previewIntegrationRoster(actionEl.dataset.provider); return; }
  if (action === 'sync-integration-roster') { syncIntegrationRoster(actionEl.dataset.provider); return; }
  if (action === 'start-recurring-skill-checkin') { startRecurringSkillCheckIn(); return; }
  if (action === 'skill-mini-check') { startSkillMiniCheck(actionEl.dataset.skillId,actionEl.dataset.skillYear); return; }
  if (action === 'start-school-assignment') { const assignmentId=actionEl.dataset.assignmentId; const classId=actionEl.dataset.classId || ''; const assignmentTitle=actionEl.dataset.assignmentTitle || 'Assigned work'; const className=actionEl.dataset.className || 'MathsExpress class'; const dueAt=actionEl.dataset.dueAt || ''; const lessonId=actionEl.dataset.lessonId || ''; const taskId=actionEl.dataset.taskId || ''; const testMode=actionEl.dataset.testMode==='1'; const tutorAllowed=actionEl.dataset.tutorAllowed!=='0'; const hintsAllowed=actionEl.dataset.hintsAllowed!=='0'; const calculatorAllowed=actionEl.dataset.calculatorEnabled!=='0'; const gamesLocked=actionEl.dataset.gamesLocked==='1'; const focusRequired=actionEl.dataset.focusRequired==='1'; const timeLimitMinutes=Math.max(0,Number(actionEl.dataset.timeLimit)||0); const videosAllowed=actionEl.dataset.videosAllowed!=='0'; const startAt=actionEl.dataset.startAt||''; const exactStart=actionEl.dataset.exactStart==='1'; const scheduledMs=startAt?new Date(startAt).getTime():NaN; const timerStart=exactStart&&Number.isFinite(scheduledMs)?Math.min(Date.now(),scheduledMs):Date.now(); const school=getSchoolClient(); Promise.all([school.startAssignment(assignmentId),school.getAssignment(assignmentId).catch(()=>null)]).then(([startResult,assignmentRow]) => { const rowStart=assignmentRow?.start_at||assignmentRow?.config?.start_at||startAt; const rowScheduledMs=rowStart?new Date(rowStart).getTime():NaN; const rowExact=Boolean(assignmentRow?.config?.exact_scheduled_start??exactStart); const strictTest=Boolean(testMode||assignmentRow?.test_mode||(assignmentRow?.assignment_type==='test'||assignmentRow?.assignment_type==='topic-test')||assignmentRow?.config?.testMode||assignmentRow?.config?.strict_test_mode); activeSchoolAssignment={ id:assignmentId, classId, assignmentTitle, className, dueAt, lessonId:assignmentRow?.lesson_id||lessonId, taskId:assignmentRow?.config?.task_library_id||taskId, questionSeed:Number(assignmentRow?.config?.question_seed)||0, customWorksheet:assignmentRow?.config?.custom_worksheet||null, testMode:strictTest, tutorAllowed:strictTest?false:tutorAllowed, hintsAllowed:strictTest?false:hintsAllowed, calculatorAllowed:strictTest?false:calculatorAllowed, videosAllowed:strictTest?false:videosAllowed, gamesLocked:strictTest?true:gamesLocked, focusRequired:strictTest?true:focusRequired, timeLimitMinutes, answered:0, correct:0, startedAt:rowExact&&Number.isFinite(rowScheduledMs)?Math.min(Date.now(),rowScheduledMs):timerStart, exactScheduledStart:rowExact, scheduledStartAt:rowStart||'', unlimitedRetry:Boolean(startResult?.unlimited_retry), synced:false, returnRoute:'student-hub' }; if(strictTest) void enterAssignmentFullscreen({quiet:true}); saveActiveAssignmentSession(); startFocusHeartbeat(); syncStudentFocusStatus('active',{force:true}); showToast('Assignment started', rowExact&&rowStart?'The timer uses the class scheduled start time.':focusRequired?'Focus status is active for this task.':'Your assignment has started.', 'success'); if (assignmentRow?.config?.custom_worksheet?.questions?.length) startAssignedCustomWorksheet(assignmentRow); else if ((assignmentRow?.config?.task_library_id||taskId) && getTaskById(assignmentRow?.config?.task_library_id||taskId)) startAssignedGeneratedTask(assignmentRow?.config?.task_library_id||taskId); else if ((assignmentRow?.lesson_id||lessonId) && getLessonById(assignmentRow?.lesson_id||lessonId)) startAssignedLesson(assignmentRow?.lesson_id||lessonId); else { clearActiveAssignment({returnToAssigned:false}); showToast('Assignment unavailable','This assignment does not have a valid task attached.'); go('student-hub'); } }).catch((error)=>showToast('Couldn’t start assignment', error.message)); return; }
  if (action === 'quick-check-in') { const weakest = recommendedLesson(); showToast('Skills Check-In', `Starting with ${weakest.title}.`, 'success'); return startLesson(weakest.id); }
  if (action === 'launch-class-game') { if (!canUseTeacherHub(account)) return; const mode = actionEl.dataset.mode; const classId = selectedTeacherClassId || ''; if (!classId) { teacherHubTab='classes'; showToast('Choose a class', 'Open a class first, then launch the live game.'); return renderTeacherHub(); } getSchoolClient().createClassroomSession(classId, mode, { seconds:60 }).then(()=>showToast('Live game created', 'Session is ready for your class.', 'reward')).catch((error)=>showToast('Couldn’t launch game', error.message)); return; }
  if (action === 'create-revision') { teacherHubTab='library'; taskLibraryFilters = { ...taskLibraryFilters, type:'revision' }; go('teacher-hub'); showToast('Revision tasks ready', 'Pick a revision task, preview it, then Quick Assign.', 'success'); return; }
  if (action === 'export-gradebook') {
    if (!lastTeacherReport) { showToast('Nothing to export', 'Open a class report first.'); return; }
    const csv = gradebookCsv(lastTeacherReport);
    const safeName = String(lastTeacherReport.class?.name || 'MathsExpress-Class').replace(/[^a-z0-9_-]+/gi, '-');
    const ok = downloadTextFile(`${safeName}-gradebook.csv`, csv, 'text/csv;charset=utf-8');
    showToast(ok ? 'Gradebook downloaded' : 'Export unavailable', ok ? 'The current class gradebook was exported as CSV.' : 'Your browser blocked the download.', ok ? 'success' : '');
    return;
  }

  if (action === 'request-username-change') {
    openFeedbackModal();
    const category=document.getElementById('feedback-category'); if(category) category.value='suggestion';
    const title=document.getElementById('feedback-title-input'); if(title) title.value='Username change request';
    const description=document.getElementById('feedback-description'); if(description) description.value=`Current username: ${generatedUsernameFromEmail(account.profile?.email)}\nRequested username: `;
    return;
  }
  if (action === 'export-progress') { exportProgressBackup(); return; }
  if (action === 'import-progress') { importProgressBackup(); return; }
  if (action === 'privacy-request-export') { void submitPrivacyRequest('export'); return; }
  if (action === 'privacy-request-deletion') { void submitPrivacyRequest('deletion'); return; }
  if (action === 'open-privacy-page') { globalThis.open?.('./privacy.html','_blank','noopener,noreferrer'); return; }
  if (action === 'open-terms-page') { globalThis.open?.('./terms.html','_blank','noopener,noreferrer'); return; }
  if (action === 'open-security-page') { globalThis.open?.('./security.html','_blank','noopener,noreferrer'); return; }
  if (action === 'reload-app') { try { globalThis.location?.reload?.(); } catch {} return; }
  if (action === 'open-account') {
    if(!account.authenticated){ showAuthGate(); return; }
    return go('profile');
  }
  if (action === 'open-feedback') return openFeedbackModal();
  if (action === 'open-my-feedback') { openSimpleModal('My reports','<div class="school-loading"><span class="spinner"></span><strong>Loading your reports…</strong></div>'); accountClient.ensureClient().rpc('mathsexpress_my_feedback',{}).then(({data,error})=>{if(error)throw error;const rows=Array.isArray(data)?data:[];openSimpleModal('My reports',rows.length?`<div class="bug-status-list">${rows.map(row=>`<article><span class="feedback-status">${escapeHtml(row.status||'open')}</span><div><strong>${escapeHtml(row.title||'Report')}</strong><p>${escapeHtml(row.category||'feedback')} · ${escapeHtml(new Date(row.created_at).toLocaleDateString())}</p></div></article>`).join('')}</div>`:'<div class="school-empty">You haven’t sent any reports yet.</div>');}).catch(e=>showToast('Couldn’t load reports',e.message)); return; }
  if (action === 'close-feedback') { const root=document.getElementById('modal-root'); if(root) root.innerHTML=''; return; }
  if (action === 'refresh-owner-feedback') return loadOwnerFeedback();
  if (action === 'owner-feedback-status') return updateOwnerFeedbackStatus(actionEl.dataset.feedbackId, actionEl.dataset.status);
  if (action === 'open-owner-console') return openOwnerConsole();
  if (action === 'close-owner-console') return closeOwnerConsole();
  if (action === 'owner-home') { closeOwnerConsole(); return go('home'); }
  if (action === 'forgot-password') { const email = document.getElementById('auth-login-email')?.value?.trim(); const message = document.getElementById('auth-message'); if (!email) { if (message) message.textContent = 'Enter your email first.'; return; } accountClient.resetPassword(email).then(() => { if (message) message.textContent = 'Password reset email requested.'; }).catch((error) => { if (message) message.textContent = error.message; }); return; }
  if (action === 'auth-change-signup') { pendingSignup=null; try{const url=new URL(globalThis.location.href);url.searchParams.set('auth','signup');globalThis.history.replaceState(null,'',`${url.pathname}${url.search}${url.hash}`);}catch{} showAuthGate(); return; }
  if (action === 'auth-resend-verification') { const message=document.getElementById('auth-message'); if(message)message.textContent='Sending another verification email…'; accountClient.resendSignupVerification(pendingSignup?.email||'').then(()=>{if(message)message.textContent='Verification email sent again.';}).catch(error=>{if(message)message.textContent=error.message||'Could not resend verification email.';}); return; }
  if (action === 'auth-finish-signup') { const message=document.getElementById('auth-message'); if(!pendingSignup?.email||!pendingSignup?.password){ if(message)message.textContent='Checking your verified session…'; accountClient.initialize().then(snapshot=>snapshot?.authenticated?finishAuthentication(snapshot):showAuthGate('Open the verification link from your email, then return here. MathsExpress will continue automatically.')).catch(error=>{if(message)message.textContent=error?.message||'Could not check the verified session.';}); return;} if(message)message.textContent='Finishing your account…'; accountClient.signIn(pendingSignup.email,pendingSignup.password).then(snapshot=>finishAuthentication(snapshot)).catch(error=>{if(message)message.textContent=/confirm|verify/i.test(String(error?.message||''))?'Your email is not verified yet. Open the verification email first, then press continue.':(error.message||'Could not finish sign up.');}); return; }
  if (action === 'sign-out') { const leave=trackActivityEvent('logout','account','logout',{}); Promise.resolve(leave).finally(()=>void secureSignOut()); return; }

  if (action === 'join-class-game') return openClassGame(actionEl.dataset.sessionId);
  if (action === 'class-game-answer') return answerClassGame(actionEl.dataset.option);
  if (action === 'unlock-drive-track') { const track=actionEl.dataset.track; const cost=Math.max(0,Number(actionEl.dataset.cost)||0); if((state.gameTimeSeconds||0)<cost)return showToast('Not enough Game Time',`You need ${cost} seconds.`); const owned=[...new Set([...(state.ownedDrivingTracks||['city']),track])]; persist({...state,gameTimeSeconds:Math.max(0,(state.gameTimeSeconds||0)-cost),ownedDrivingTracks:owned},{quiet:true}); showToast('Track unlocked',`${track} is now available in Maths Drive.`,'reward'); return renderGames(); }
  if (action === 'start-edu-game') { return startEducationalGame(actionEl.dataset.mode||'quick-maths'); }
  if (action === 'edu-game-answer') { answerEducationalGame(actionEl.dataset.choice); return; }
  if (action === 'stop-edu-game') { return finishEducationalGame({showResult:true}); }
  if (action === 'start-math-chess') { return startMathChess(actionEl.dataset.difficulty||'easy'); }
  if (action === 'resume-math-chess') { return resumeMathChess(); }
  if (action === 'stop-math-chess') { stopMathChessTimer(); mathChessSession=null; if(state.savedMathChess)persist({...state,savedMathChess:null},{quiet:true}); void flushGameServerSpend(true,{preserveLocalGameTime:true}); return renderGames(); }
  if (action === 'math-chess-square') { return mathChessChooseSquare(Math.max(0,Math.min(63,Number(actionEl.dataset.square)||0))); }
  if (action === 'math-chess-promotion') { return mathChessChoosePromotion(actionEl.dataset.piece||'q'); }
  if (action === 'math-chess-answer') { return mathChessCheckAnswer(actionEl.dataset.answer||''); }
  if (action === 'math-chess-submit') { const input=document.getElementById('math-chess-answer-input'); return mathChessCheckAnswer(input?.value||''); }
  if (action === 'start-driving') { if ((state.gameTimeSeconds||0)<1) return showToast('No Game Time yet','Finish maths questions to earn 10 seconds each.'); trackActivityEvent('game-started','game','start-maths-drive',{track:state.drivingSettings?.track||'city',mode:state.drivingSettings?.mode||'classic'}); const chosen=state.drivingSettings?.track||'city'; if(!(state.ownedDrivingTracks||['city']).includes(chosen)) persist({...state,drivingSettings:{...(state.drivingSettings||{}),track:'city'}},{quiet:true}); const year=normaliseYearLevel(account.profile?.yearLevel); drivingState=createDrivingState(year,Math.random,{track:(state.ownedDrivingTracks||['city']).includes(chosen)?chosen:'city',mode:state.drivingSettings?.mode||'classic',recentPrompts:drivingHistoryForYear(year)}); return renderGames(); }
  if (action === 'stop-driving') { stopDrivingTimer(); drivingState=null; return renderGames(); }
  if (action === 'drive-left') { drivingState=moveDrivingLane(drivingState,-1); return renderGames(); }
  if (action === 'drive-right') { drivingState=moveDrivingLane(drivingState,1); return renderGames(); }
  if (action === 'drive-select-lane') { drivingState={...drivingState,lane:Number(actionEl.dataset.lane)||0}; return renderGames(); }
  if (action === 'drive-submit') { const before=drivingState.score; drivingState=chooseDrivingLane(drivingState,drivingState.lane); const year=String(drivingState.yearLevel||normaliseYearLevel(account.profile?.yearLevel)); trackActivityEvent('game-answer','game','maths-drive-answer',{correct:drivingState.score>before,lane:drivingState.lane,score:drivingState.score}); persist({...state,drivingHighScore:Math.max(state.drivingHighScore||0,drivingState.score),drivingQuestionHistory:{...(state.drivingQuestionHistory||{}),[year]:(drivingState.recentPrompts||[]).slice(-180)}},{quiet:true}); showToast(drivingState.score>before?'Correct lane!':'Wrong lane',drivingState.score>before?`Score ${drivingState.score} · combo x${drivingState.combo}`:'Combo reset. Try the next question.',drivingState.score>before?'success':''); return renderGames(); }
  if (action === 'buy-lucky-box') { const result=startLuckyBox(state); if(!result.ok) return showToast('Not enough coins','You need 50 coins for a Lucky Box.'); persist(result.state,{quiet:true}); luckyBoxRound={boxes:result.boxes}; return renderGames(); }
  if (action === 'reveal-lucky-box') { if(!luckyBoxRound) return; const result=revealLuckyBox(state,luckyBoxRound.boxes,actionEl.dataset.index); let next=result.state; if(result.prize.id==='reward') next={...next,gameTimeSeconds:Math.min(MAX_GAME_TIME_SECONDS,(next.gameTimeSeconds||0)+30)}; persist(next,{quiet:true}); const text=result.prize.id==='reward'?'+30 seconds Game Time':result.prize.label; luckyBoxRound=null; showToast('Lucky Box opened!',text,'reward'); return renderGames(); }
  if (action === 'start-speed-challenge') return startSpeedChallenge();
  if (action === 'challenge-choice') { speedChallenge.run=selectGeneratedChoice(speedChallenge.run,actionEl.dataset.choice); return renderChallenges(); }
  if (action === 'challenge-check') return submitChallengeAnswer();
  if (action === 'challenge-next') { speedChallenge.run=advanceGeneratedTask(speedChallenge.run); if(speedChallenge.run.complete) finishSpeedChallenge(); return renderChallenges(); }
  if (action === 'refresh-challenge-board') { const year=speedChallenge?.yearLevel||normaliseYearLevel(account.profile?.yearLevel); return refreshChallengeLeaderboard(year).then(renderChallenges); }
  if (action === 'learn-year') { if(!canUseTeacherHub(account)) return; learnYearLevel = normaliseYearLevel(actionEl.dataset.year); learnExpandedStrands = new Set(); return renderLearn(); }
  if (action === 'learn-toggle-strand') { const key=String(actionEl.dataset.strand||''); if(!key)return; const next=new Set(learnExpandedStrands); if(next.has(key))next.delete(key);else next.add(key); learnExpandedStrands=next; return renderPreservingScroll(renderLearn); }
  if (action === 'start-library-task') { activeSchoolAssignment = null; return startGeneratedTask(actionEl.dataset.taskId,{returnRoute:routeFromHash().route}); }
  if (action === 'generated-choice') { currentGeneratedTask = selectGeneratedChoice(currentGeneratedTask, actionEl.dataset.choice); saveActiveAssignmentSession(); renderGeneratedTask(); requestAnimationFrame(()=>document.getElementById('app-view')?.focus()); return; }
  if (action === 'check-generated-answer') return submitGeneratedTaskAnswer();
  if (action === 'generated-hint') { if(activeSchoolAssignment?.testMode)return showToast('Hints locked','Hints are disabled in Test Mode.'); currentGeneratedTask.uiDraft=captureQuestionDraft(); currentGeneratedTask = useGeneratedHint(currentGeneratedTask); saveActiveAssignmentSession(); return renderGeneratedTask(); }
  if (action === 'review-previous-question') { return openSolvedQuestionReview(); }
  if (action === 'review-solved-question') { return openSolvedQuestionReview(Number(actionEl.dataset.questionIndex)||0); }
  if (action === 'jump-task-question') { if(currentGeneratedTask&&!currentGeneratedTask.aiMarking){clearAiChatHistoryForNewQuestion();currentGeneratedTask.draftAnswer=generatedRawAnswer(currentGeneratedTask.current);currentGeneratedTask.uiDraft=captureQuestionDraft();currentGeneratedTask=jumpGeneratedTask(currentGeneratedTask,Number(actionEl.dataset.questionIndex));saveActiveAssignmentSession();renderGeneratedTask();restoreQuestionDraft();} return; }
  if (action === 'count-dot') { const out=document.getElementById('mx-count-output');if(out)out.textContent=actionEl.dataset.number;actionEl.classList.add('counted');return; }
  if (action === 'generated-next') { clearAiChatHistoryForNewQuestion(); currentGeneratedTask = advanceGeneratedTask(currentGeneratedTask); saveActiveAssignmentSession(); return renderGeneratedTask(); }
  if (action === 'open-lesson' || action === 'restart-lesson') return startLesson(actionEl.dataset.lessonId);
  if (action === 'lesson-choice') { currentLesson.selectedChoice = actionEl.dataset.choice; saveActiveAssignmentSession(); renderLesson(); requestAnimationFrame(()=>document.getElementById('app-view')?.focus()); return; }
  if (action === 'check-lesson-answer') return submitLessonAnswer();
  if (action === 'show-hint') {
    if(activeSchoolAssignment?.testMode)return showToast('Hints locked','Hints are disabled in Test Mode.');
    const max = safeLessonHints(currentLesson.current).length;
    currentLesson.hintCount = Math.min(max, currentLesson.hintCount + 1);
    saveLessonQuestionState(); saveActiveAssignmentSession();
    return renderLesson();
  }
  if (action === 'show-solution') { if(activeSchoolAssignment?.testMode)return showToast('Worked solutions locked','Worked solutions are disabled in Test Mode.'); currentLesson.showSolution = true; saveLessonQuestionState(); saveActiveAssignmentSession(); return renderLesson(); }
  if (action === 'jump-lesson-question') { if(currentLesson){clearAiChatHistoryForNewQuestion();loadLessonQuestionAt(Number(actionEl.dataset.questionIndex));return renderLesson();} return; }
  if (action === 'next-question') { clearAiChatHistoryForNewQuestion(); pickNextLessonQuestion(); return renderLesson(); }

  if (action === 'buy-item') {
    const itemId=actionEl.dataset.itemId||'';
    if(!account.authenticated)return showToast('Sign in required','Shop purchases are saved to your MathsExpress account.');
    getSchoolClient().purchaseCosmeticServer(itemId).then(async data=>{await applyRemotePlayerState(data,{quiet:true});showToast('Cosmetic unlocked!','Saved to your account and available on every device.','reward');renderShop();}).catch(error=>showToast('Purchase failed',error.message||'Try again.'));
    return;
  }
  if (action === 'equip-item') {
    const item=COSMETICS.find(x=>x.id===actionEl.dataset.itemId);
    if(!item)return showToast('Cannot equip item','Item not found.');
    getSchoolClient().equipCosmeticServer(item.category,item.id).then(async data=>{await applyRemotePlayerState(data,{quiet:true});showToast('Equipped','Your selection is saved to your account.','success');routeFromHash().route==='locker'?renderLocker():renderShop();}).catch(error=>showToast('Cannot equip item',error.message||'Buy or unlock it first.'));
    return;
  }
  if (action === 'save-character-appearance') {
    const current=characterAppearance();
    const next={
      skin:validCharacterColour(document.getElementById('character-skin-colour')?.value,current.skin),
      shirtPrimary:validCharacterColour(document.getElementById('character-shirt-primary')?.value,current.shirtPrimary),
      shirtSecondary:validCharacterColour(document.getElementById('character-shirt-secondary')?.value,current.shirtSecondary),
      pants:validCharacterColour(document.getElementById('character-pants-colour')?.value,current.pants),
      style:['classic','sport','varsity','hoodie'].includes(document.getElementById('character-clothes-style')?.value)?document.getElementById('character-clothes-style').value:'classic',
    };
    persist({...state,characterAppearance:next},{quiet:true});
    showToast('Character updated','Your skin tone and clothes are saved to your account.','success');
    return renderLocker();
  }
  if (action === 'reset-character-appearance') {
    persist({...state,characterAppearance:{skin:'#f2c7a4',shirtPrimary:'#4b63d3',shirtSecondary:'#2e3b86',pants:'#29304d',style:'classic'}},{quiet:true});
    showToast('Character reset','Default character colours restored.','success');
    return renderLocker();
  }

  if (action === 'reset-progress') {
    if (globalThis.confirm?.('Reset all MathsExpress progress on this browser?')) {
      state = resetState(globalThis.localStorage, activeStorageKey);
      state = touchDailyStreak(state, localDateString());
      persist(state, { quiet: true });
      currentLesson = null;
      showToast('Progress reset', 'Your save has been returned to the beginning.');
      go('home');
      showOnboarding();
    }
    return;
  }

  if (action === 'save-player-name') {
    if (!canEditAccountIdentity()) return showToast('Profile locked','Students cannot change their account name or email. Ask a teacher or administrator.');
    const rawName = document.getElementById('profile-name')?.value?.trim();
    const playerName = rawName || 'MathsExpress Student';
    persist({ ...state, playerName }, { quiet: true });
    showToast('Name saved', `Welcome, ${state.playerName}.`, 'success');
    return renderProfile();
  }
  if (action === 'onboarding-prev') { onboardingStep=Math.max(0,onboardingStep-1); renderOnboardingModal(); return; }
  if (action === 'onboarding-next') { onboardingStep=Math.min(onboardingSlides().length-1,onboardingStep+1); renderOnboardingModal(); return; }
  if (action === 'complete-onboarding') {
    const lockedName = account.profile?.role === 'player' ? displayNameFromEmail(account.profile?.email) : (account.profile?.displayName || state.playerName || 'MathsExpress Student');
    persist({ ...state, playerName: lockedName, onboardingComplete: true }, { quiet: true });
    document.getElementById('modal-root').innerHTML = '';
    showToast('You’re ready', `Welcome, ${state.playerName}. Start with Class or Learn.`, 'success');
    return;
  }
}

function handleKeyDown(event) {
  const graphGrid=document.activeElement?.id==='generated-graph-grid'?document.activeElement:null;
  if(graphGrid && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key)){
    event.preventDefault();
    const min=Number(graphGrid.dataset.min||-10),max=Number(graphGrid.dataset.max||10);
    let x=Number.isFinite(Number(graphGrid.dataset.x))?Number(graphGrid.dataset.x):0;
    let y=Number.isFinite(Number(graphGrid.dataset.y))?Number(graphGrid.dataset.y):0;
    if(event.key==='ArrowLeft')x=Math.max(min,x-1);
    if(event.key==='ArrowRight')x=Math.min(max,x+1);
    if(event.key==='ArrowDown')y=Math.max(min,y-1);
    if(event.key==='ArrowUp')y=Math.min(max,y+1);
    graphGrid.dataset.x=String(x);graphGrid.dataset.y=String(y);
    const span=Math.max(1,max-min);const marker=document.getElementById('generated-graph-marker');
    if(marker){marker.hidden=false;marker.style.left=`${((x-min)/span)*100}%`;marker.style.top=`${((max-y)/span)*100}%`;}
    const out=document.getElementById('generated-graph-output');if(out)out.textContent=`(${x}, ${y})`;
    if(event.key==='Enter'||event.key===' '){
      showToast('Point selected',`(${x}, ${y})`,'success');
      if(event.key==='Enter' && currentGeneratedTask && !currentGeneratedTask.feedback?.correct && !currentGeneratedTask.feedback?.needsReview) void submitGeneratedTaskAnswer();
    }
    return;
  }
  if (document.activeElement?.id === 'complete-calc-expression' && event.key === 'Enter') {
    event.preventDefault();
    const out=document.getElementById('complete-calc-output');
    try { const result=evaluateScientificCalculator(document.activeElement.value); if(out)out.textContent=String(result); }
    catch(error) { if(out)out.textContent=error.message||'Invalid expression'; }
    return;
  }
  if (document.activeElement?.id === 'ai-helper-input' && event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    return sendAiHelperMessage(document.getElementById('ai-helper-input')?.value);
  }
  if (routeFromHash().route === 'games' && drivingState && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); drivingState=moveDrivingLane(drivingState,-1); return renderGames(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); drivingState=moveDrivingLane(drivingState,1); return renderGames(); }
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); drivingState=chooseDrivingLane(drivingState,drivingState.lane); persist({...state,drivingHighScore:Math.max(state.drivingHighScore||0,drivingState.score)},{quiet:true}); return renderGames(); }
  }
  if (event.key !== 'Enter') return;
  const active=document.activeElement;
  if(active?.id==='challenge-answer'){event.preventDefault();submitChallengeAnswer();return;}
  if(event.repeat || event.isComposing || document.querySelector('#modal-root .modal-overlay')) return;
  const answerAreaFocused=active===document.body || active?.id==='app-view' || !active;
  if(answerAreaFocused && currentGeneratedTask?.current?.type==='multiple-choice' && currentGeneratedTask.selectedChoice && !currentGeneratedTask.feedback?.correct && !currentGeneratedTask.feedback?.needsReview){
    event.preventDefault(); submitGeneratedTaskAnswer(); return;
  }
  if(answerAreaFocused && currentLesson?.current?.type==='multiple-choice' && currentLesson.selectedChoice && !currentLesson.feedback?.correct){
    event.preventDefault(); submitLessonAnswer(); return;
  }
  if(['generated-task','assignment'].includes(routeFromHash().route) && currentGeneratedTask && (currentGeneratedTask.feedback?.correct||currentGeneratedTask.feedback?.needsReview)){event.preventDefault();currentGeneratedTask=advanceGeneratedTask(currentGeneratedTask);saveActiveAssignmentSession();renderGeneratedTask();return;}
  if(active?.tagName==='TEXTAREA' && active.id==='lesson-answer' && event.shiftKey && currentGeneratedTask){
    event.preventDefault();
    if(currentGeneratedTask.feedback?.correct||currentGeneratedTask.feedback?.needsReview){currentGeneratedTask=advanceGeneratedTask(currentGeneratedTask);saveActiveAssignmentSession();renderGeneratedTask();}
    else submitGeneratedTaskAnswer();
    return;
  }
  if(active?.tagName==='TEXTAREA') return;
  const inMathAnswer=Boolean(active?.id==='lesson-answer' || active?.classList?.contains('generated-part-answer') || active?.id==='generated-coordinate-x' || active?.id==='generated-coordinate-y');
  if(inMathAnswer && currentGeneratedTask){
    event.preventDefault();
    if(currentGeneratedTask.feedback?.correct||currentGeneratedTask.feedback?.needsReview){currentGeneratedTask=advanceGeneratedTask(currentGeneratedTask);saveActiveAssignmentSession();renderGeneratedTask();}
    else submitGeneratedTaskAnswer();
    return;
  }
  if(active?.id==='lesson-answer' && currentLesson){event.preventDefault();if(currentLesson.feedback?.correct){pickNextLessonQuestion();renderLesson();}else submitLessonAnswer();return;}
  if(currentGeneratedTask && (currentGeneratedTask.feedback?.correct||currentGeneratedTask.feedback?.needsReview) && !['BUTTON','TEXTAREA','SELECT'].includes(active?.tagName||'')){
    event.preventDefault(); currentGeneratedTask=advanceGeneratedTask(currentGeneratedTask); saveActiveAssignmentSession(); renderGeneratedTask(); return;
  }
  if(currentLesson?.feedback?.correct && !['BUTTON','TEXTAREA','SELECT'].includes(active?.tagName||'')){
    event.preventDefault(); pickNextLessonQuestion(); renderLesson(); return;
  }
}

async function handleV950Click(event){
  const el=event.target.closest?.('[data-action]');if(!el)return;const action=el.dataset.action||'';
  if(action==='open-theme-customizer'){openThemeCustomizer();return;}
  if(action==='upload-theme-background'){uploadThemeBackground();return;}
  if(action==='clear-theme-background'){persist({...state,customBackgroundImage:'',themePrefs:{...normaliseThemePrefs(state.themePrefs||{}),useCustomImage:false}},{quiet:true});applyThemePreferences();openThemeCustomizer();return;}
  if(action==='reset-theme'){persist({...state,themePrefs:{preset:'clean',accent:'#627d98',cardOpacity:.96,blur:8,pattern:'none',customColor:'',useCustomImage:false},customBackgroundImage:''},{quiet:true});applyThemePreferences();openThemeCustomizer();return;}
  if(action==='recommendation-category'){recommendationCategory=String(el.dataset.category||'smart');recommendationShuffleSeed=0;persist({...state,recommendationPrefs:{category:recommendationCategory,shuffleSeed:0}},{quiet:true});if(routeFromHash().route==='learn')renderLearn();return;}
  if(action==='shuffle-recommendations'){recommendationShuffleSeed=(Date.now()%99991)+1;persist({...state,recommendationPrefs:{category:recommendationCategory,shuffleSeed:recommendationShuffleSeed}},{quiet:true});renderLearn();return;}
  if(action==='open-skills-focus'){void openSkillsFocusManager(el.dataset.classId||selectedTeacherClassId).catch(e=>showToast('Skills Focus unavailable',e.message||'Try again.'));return;}
  if(action==='open-school-usage'){void openSchoolUsageDashboard();return;}
  if(action==='open-class-comparison'){void openEngagementClassComparison();return;}
  if(action==='print-actual-task'){printActualTask(el.dataset.assignmentId);return;}
  if(action==='open-authored-question-studio'){void openAuthoredQuestionStudio();return;}
  if(action==='review-authored-question'){void accountClient.ensureClient().rpc('mathsexpress_review_authored_question',{p_question_id:String(el.dataset.questionId||''),p_status:String(el.dataset.status||'review')}).then(({error})=>{if(error)throw error;showToast('Question updated',`Status: ${el.dataset.status}.`,'success');void openAuthoredQuestionStudio();}).catch(e=>showToast('Couldn’t update question',e.message||'Try again.'));return;}
  if(action==='open-canvas-auto-passback'){void openCanvasAutomaticPassback();return;}
  if(action==='view-canvas-grade-queue'){void viewCanvasGradeQueue().catch(e=>showToast('Canvas queue unavailable',e.message||'Try again.'));return;}
  if(action==='sync-canvas-grade-queue'){void syncCanvasGradeQueue();return;}
  if(action==='school-usage-range'){schoolUsageRangeDays=Number(el.value)||30;void openSchoolUsageDashboard();return;}
  if(action==='district-range'){districtRangeDays=Number(el.value)||90;void openDistrictDashboard();return;}
  if(action==='district-school-filter'){districtSchoolFilter=String(el.value||'all');void openDistrictDashboard();return;}
  if(action==='district-year-filter'){districtYearFilter=String(el.value||'all');void openDistrictDashboard();return;}
  if(action==='district-tab'){districtActiveTab=String(el.dataset.tab||'usage');void openDistrictDashboard();return;}
}

async function handleV950Submit(event){
  const form=event.target;if(!(form instanceof HTMLFormElement))return;
  const ids=['theme-customizer-form','skills-focus-form','canvas-auto-assignment-map-form','canvas-auto-user-map-form','authored-question-form'];if(!ids.includes(form.id))return;
  event.preventDefault();event.stopImmediatePropagation();const data=new FormData(form);
  try{
    if(form.id==='theme-customizer-form'){
      const prefs={preset:String(data.get('preset')||'clean'),accent:String(data.get('accent')||'#738158'),customColor:String(data.get('customColor')||''),pattern:String(data.get('pattern')||'none'),cardOpacity:(Number(data.get('cardOpacity'))||96)/100,blur:Number(data.get('blur'))||0,useCustomImage:data.get('useCustomImage')==='on'};
      persist({...state,themePrefs:prefs},{quiet:true});applyThemePreferences();document.getElementById('modal-root').innerHTML='';showToast('Theme saved','Your MathsExpress appearance has been updated.','success');return;
    }
    if(form.id==='skills-focus-form'){
      const classId=String(data.get('classId')||'');const ids=data.getAll('skillIds').map(String).slice(0,6);const note=String(data.get('note')||'');const skills=ids.map((id,i)=>{const skill=getCurriculumSkill(id)||{};return{skill_id:id,title:skill.title||skill.skill||id,note,priority:i<2?3:i<4?2:1}});
      const {error}=await accountClient.ensureClient().rpc('mathsexpress_set_class_skill_focus',{p_class_id:classId,p_skills:skills});if(error)throw error;document.getElementById('modal-root').innerHTML='';showToast('Skills Focus saved',`${skills.length} priority skill${skills.length===1?'':'s'} published to the class.`,'success');return;
    }
    if(form.id==='canvas-auto-assignment-map-form'){
      const {error}=await accountClient.ensureClient().rpc('mathsexpress_save_canvas_assignment_map',{p_assignment_id:String(data.get('assignmentId')),p_course_id:String(data.get('courseId')),p_canvas_assignment_id:String(data.get('canvasAssignmentId')),p_auto:data.get('auto')==='on'});if(error)throw error;showToast('Canvas assignment mapped','Completed MathsExpress attempts can now enter the grade queue.','success');return;
    }
    if(form.id==='canvas-auto-user-map-form'){
      const {error}=await accountClient.ensureClient().rpc('mathsexpress_save_canvas_user_map',{p_school_id:String(data.get('schoolId')),p_student_id:String(data.get('studentId')),p_canvas_user_id:String(data.get('canvasUserId'))});if(error)throw error;showToast('Canvas student mapped','This student can now receive queued grade passback.','success');return;
    }
    if(form.id==='authored-question-form'){
      const answerRaw=String(data.get('answer')||'').trim();const {error}=await accountClient.ensureClient().rpc('mathsexpress_save_authored_question',{p_school_id:String(data.get('schoolId')||'')||null,p_year_level:Number(data.get('year'))||0,p_strand:String(data.get('strand')||''),p_topic:String(data.get('topic')||''),p_skill_id:String(data.get('skillId')||'')||null,p_difficulty:String(data.get('difficulty')||'medium'),p_question_type:String(data.get('questionType')||'numeric'),p_prompt:String(data.get('prompt')||''),p_answer:{value:answerRaw},p_worked_solution:String(data.get('workedSolution')||'')||null,p_source_label:String(data.get('sourceLabel')||'')||null,p_submit_for_review:data.get('submitReview')==='on'});if(error)throw error;showToast('Authored question saved','The question was saved to the human-review workflow.','success');void openAuthoredQuestionStudio();return;
    }
  }catch(error){showToast('Couldn’t save',error.message||'Try again.');}
}

function handleV950Change(event){
  const el=event.target.closest?.('[data-action]');if(!el)return;const action=el.dataset.action||'';
  if(action==='licensed-pdf-file'){
    const file=el.files?.[0];if(!file)return;
    const key=el.dataset.pdfKey||CAMBRIDGE_YEAR9_PDF_KEY;const page=Number(el.dataset.pdfPage)||1;const label=el.dataset.pdfLabel||'CambridgeMATHS NSW Year 9';
    void saveLicensedPdf(key,file).then(()=>{showToast('PDF connected','Your licensed textbook is stored only in this browser.','success');return openLicensedPdfPage(key,page,label);}).catch(error=>showToast('Couldn’t connect PDF',error.message||'Choose the PDF again.'));return;
  }
  if(action==='school-usage-range'){schoolUsageRangeDays=Number(el.value)||30;void openSchoolUsageDashboard();return;}
  if(action==='district-range'){districtRangeDays=Number(el.value)||90;void openDistrictDashboard();return;}
}

function handleV950Hotkeys(event){
  if((event.metaKey||event.ctrlKey)&&event.shiftKey&&String(event.key).toLowerCase()==='a'&&canUseTeacherHub(account)){
    event.preventDefault();const btn=document.querySelector('[data-action="open-custom-assignment"]');if(btn)btn.click();
  }
}

async function bootstrap() {
  // Local ZIPs are normally opened with file://. Service workers only work on http(s)
  // and can abort startup in some browsers if registration is attempted locally.
  try {
    if ((location.protocol === 'https:' || location.protocol === 'http:') && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
    }
  } catch {}

  // Never block the user behind a full-screen startup state. Show a usable account
  // screen immediately, then restore any saved session in the background.
  showAuthGate('Connecting to your MathsExpress account…');
  hideLoadingScreen();
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleAuthSubmit);
  document.addEventListener('submit', handleSchoolSubmit);
  document.addEventListener('submit', handleFeedbackSubmit);
  document.addEventListener('submit', handleV7Submit);
  document.addEventListener('click', handleV950Click);
  document.addEventListener('submit', handleV950Submit);
  document.addEventListener('keydown', handleV950Hotkeys);
  document.addEventListener('change', handleV950Change);
  document.addEventListener('input', (event) => {
    if(event.target?.matches?.('[data-math-answer="1"]')) sanitizeMathAnswerInput(event.target);
    if (event.target?.id === 'lesson-answer' && event.target?.type === 'range') {
      const output=document.getElementById('generated-number-line-output');
      if (output) output.textContent=String(event.target.value);
    }
  });
  document.addEventListener('dragstart', (event) => { const tile=event.target.closest?.('.generated-drag-tile'); if(tile) event.dataTransfer?.setData('text/plain',tile.dataset.value||''); });
  document.addEventListener('dragover', (event) => { if(event.target.closest?.('#generated-drag-zone')) event.preventDefault(); });
  document.addEventListener('drop', (event) => { const zone=event.target.closest?.('#generated-drag-zone'); if(!zone)return; event.preventDefault(); const value=event.dataTransfer?.getData('text/plain')||''; const tile=[...document.querySelectorAll('.generated-drag-tile')].find(el=>el.dataset.value===value); if(tile){ zone.querySelector('.drop-placeholder')?.remove(); zone.append(tile); } });
  document.addEventListener('dragstart', (event) => { const item=event.target.closest?.('.class-planner-event'); if(item){event.dataTransfer?.setData('application/x-mathsexpress-assignment',item.dataset.assignmentId||'');event.dataTransfer.effectAllowed='move';} });
  document.addEventListener('dragover', (event) => { const day=event.target.closest?.('.class-planner-day');if(day){event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect='move';} });
  document.addEventListener('drop', (event) => { const day=event.target.closest?.('.class-planner-day');if(!day)return;const assignmentId=event.dataTransfer?.getData('application/x-mathsexpress-assignment')||'';if(!assignmentId)return;event.preventDefault();void movePlannerAssignment(assignmentId,day.dataset.plannerDate||''); });
  document.addEventListener('change', (event) => {
    const drive = event.target.closest?.('[data-action="drive-setting"]');
    if (drive) {
      const setting=drive.dataset.setting; const value=String(drive.value||'');
      const next={...(state.drivingSettings||{}),[setting]:value};
      if(setting==='track' && !(state.ownedDrivingTracks||['city']).includes(value)) { drive.value=state.drivingSettings?.track||'city'; return showToast('Track locked','Unlock it with earned Game Time first.'); }
      persist({...state,drivingSettings:next},{quiet:true});
      return;
    }
    const learnYearSelect=event.target.closest?.('[data-action="learn-year-select"]');
    if(learnYearSelect){ if(!canUseTeacherHub(account))return; learnYearLevel=normaliseYearLevel(learnYearSelect.value); learnExpandedStrands=new Set(); renderLearn(); return; }
    const pathYearSelect=event.target.closest?.('[data-action="learning-path-year-select"]');
    if(pathYearSelect){ if(!canUseTeacherHub(account))return; persist({...state,learningPathYear:normaliseYearLevel(pathYearSelect.value)},{quiet:true}); renderLearningPath(); return; }
    if(event.target?.id==='worksheet-builder-year') { worksheetBuilderDraft={...(worksheetBuilderDraft||{}),yearLevel:Number(event.target.value)||9,topicFilter:'all'}; renderCustomWorksheetBuilder(); return; }
    if(event.target?.id==='worksheet-builder-topic') { worksheetBuilderDraft={...(worksheetBuilderDraft||{}),topicFilter:String(event.target.value||'all')}; renderCustomWorksheetBuilder(); return; }
    if(event.target?.id==='group-report-filter') { groupedReportGroupFilter=String(event.target.value||'all'); openGroupedTaskReport(); return; }
    const select = event.target.closest?.('[data-action="switch-school"]');
    if (!select) return;
    selectedSchoolId = String(select.value || '');
    selectedTeacherClassId = '';
    schoolHubTab = 'overview';
    teacherHubTab = 'classes';
    renderTeacherHub();
  });
  document.addEventListener('click', (event) => {
    const moreWrap = event.target.closest('.more-menu-wrap');
    if (!moreWrap) { const menu=document.getElementById('more-nav-menu'); const button=document.getElementById('more-nav-button'); if(menu) menu.hidden=true; if(button) button.setAttribute('aria-expanded','false'); }
    const teacherMoreWrap = event.target.closest('.teacher-more-wrap');
    if (!teacherMoreWrap) document.querySelectorAll('.teacher-more-menu').forEach((menu)=>{ menu.hidden=true; });
    const tab = event.target.closest('[data-auth-tab]');
    if (tab) {
      const signup = tab.dataset.authTab === 'signup';
      document.querySelectorAll('[data-auth-tab]').forEach((button) => button.classList.toggle('active', button === tab));
      const loginForm = document.getElementById('auth-login-form');
      const signupForm = document.getElementById('auth-signup-form');
      if (loginForm) loginForm.hidden = signup;
      if (signupForm) signupForm.hidden = !signup;
      try { document.title=`MathsExpress — ${signup?'Create account':'Log in'}`; } catch {}
      return;
    }
    const ownerButton = event.target.closest('[data-owner-action]');
    if (ownerButton) applyOwnerAction(ownerButton.dataset.ownerAction);
  });
  document.addEventListener('keydown',assessmentCaptureShortcut,true);
  document.addEventListener('keyup',assessmentCaptureShortcut,true);
  if(navigator?.mediaDevices?.getDisplayMedia && !navigator.mediaDevices.__mathsExpressCaptureGuard){
    try{
      const originalGetDisplayMedia=navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia=(...args)=>{
        if(activeSchoolAssignment?.id){showAssessmentCaptureWarning('recording');return Promise.reject(new DOMException('Screen capture is disabled while an assessment is active.','NotAllowedError'));}
        return originalGetDisplayMedia(...args);
      };
      navigator.mediaDevices.__mathsExpressCaptureGuard=true;
    }catch{}
  }
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('fullscreenchange',handleAssignmentFullscreenChange);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) void flushCloudAppState(); if(activeSchoolAssignment?.id){ const hidden=document.hidden; syncStudentFocusStatus(hidden?'hidden':'active',{force:true}); if(hidden){assessmentIntegrity.tabLeaves=(assessmentIntegrity.tabLeaves||0)+1; void recordAssessmentIntegrity('tab-hidden',{elapsed_seconds:assignmentElapsedSeconds()}); if(activeSchoolAssignment?.testMode)showToast('Test focus changed','Stay in the test window. Screenshots and recording are not allowed.');} else void recordAssessmentIntegrity('focus-return',{elapsed_seconds:assignmentElapsedSeconds()}); } });
  globalThis.addEventListener('blur',()=>{ if(activeSchoolAssignment?.id && !document.hidden){syncStudentFocusStatus('away',{force:true});void recordAssessmentIntegrity('window-blur',{elapsed_seconds:assignmentElapsedSeconds()});} });
  globalThis.addEventListener('focus',()=>{ if(activeSchoolAssignment?.id && !document.hidden){syncStudentFocusStatus('active',{force:true});void recordAssessmentIntegrity('focus-return',{elapsed_seconds:assignmentElapsedSeconds()});} });
  document.addEventListener('paste',(event)=>{if(activeSchoolAssignment?.id && event.target?.closest?.('.assignment-workspace')){assessmentIntegrity.pasteEvents=(assessmentIntegrity.pasteEvents||0)+1;void recordAssessmentIntegrity('paste',{target:event.target?.id||event.target?.className||'input',chars:String(event.clipboardData?.getData('text')||'').length});}});
  // Right-click/copy protection only applies during Test Mode assessments — normal practice stays fully copyable.
  document.addEventListener('contextmenu',(event)=>{if(activeSchoolAssignment?.testMode && event.target?.closest?.('.assignment-workspace')){event.preventDefault();showToast('Right-click disabled','Right-click is turned off while a test is in progress.');}});
  document.addEventListener('copy',(event)=>{if(activeSchoolAssignment?.testMode && event.target?.closest?.('.assignment-workspace')){event.preventDefault();void recordAssessmentIntegrity('copy-attempt',{target:event.target?.id||event.target?.className||'input',elapsed_seconds:assignmentElapsedSeconds()});showToast('Copying disabled','Copying question text is turned off while a test is in progress.');}});
  document.addEventListener('cut',(event)=>{if(activeSchoolAssignment?.testMode && event.target?.closest?.('.assignment-workspace')){event.preventDefault();}});
  document.addEventListener('copy',(event)=>{if(activeSchoolAssignment?.id && event.target?.closest?.('.assignment-workspace'))void recordAssessmentIntegrity('copy',{target:event.target?.id||event.target?.className||'assignment'});});
  globalThis.addEventListener('scroll',updateTextbookScrollDepth,{passive:true});
  globalThis.addEventListener('beforeunload',()=>{try{void flushTextbookReadTracking();void flushCloudAppState();}catch{}});
  globalThis.addEventListener('hashchange', () => account.authenticated ? render() : showAuthGate('Log in to enter MathsExpress.'));
  updateAccountChrome();

  let restoreStarted = false;
  const restoreSavedSession = async () => {
    if (restoreStarted || account.authenticated) return;
    if (typeof globalThis.supabase?.createClient !== 'function') return;
    restoreStarted = true;
    try {
      const snapshot = await withStartupTimeout(accountClient.initialize(),4200,'Account connection timed out.');
      if (snapshot.authenticated) await finishAuthentication(snapshot);
      else {
        let authMessage='';
        try { const params=new URLSearchParams(globalThis.location?.search||''); if(params.get('auth')==='confirmed') authMessage='Email verified. Finishing your account sign-in…'; } catch {}
        showAuthGate(authMessage);
      }
    } catch (error) {
      console.error('MathsExpress account initialization failed', error);
      showAuthGate(error?.message?.includes('timed out')
        ? 'MathsExpress opened, but restoring your saved login is taking longer than usual. You can log in now.'
        : 'MathsExpress opened, but the account service could not connect. Check your internet connection and try logging in again.');
    } finally {
      clearTimeout(loadingScreenSafetyTimer);
      hideLoadingScreen();
    }
  };

  // If the account library is already ready, restore immediately. Otherwise the page
  // stays usable and the loader dispatches this event as soon as the library arrives.
  if (typeof globalThis.supabase?.createClient === 'function') {
    void restoreSavedSession();
  } else {
    globalThis.addEventListener('mathsexpress:supabase-ready', () => void restoreSavedSession(), { once:true });
    Promise.resolve(globalThis.MathsExpressSupabaseReady).then(() => void restoreSavedSession()).catch(() => {
      showAuthGate('MathsExpress is open. Account services are still connecting; try Log in in a moment.');
    });
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  bootstrap().catch((error) => {
    console.error('MathsExpress startup failed', error);
    clearTimeout(loadingScreenSafetyTimer);
    hideLoadingScreen();
    try {
      showAuthGate(`MathsExpress opened, but startup hit an error: ${error?.message || 'Unknown error'}. Reload this page or log in again.`);
    } catch {}
  });
}

return {ROUTES};
})();
