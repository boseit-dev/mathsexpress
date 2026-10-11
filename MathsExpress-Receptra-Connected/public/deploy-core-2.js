'use strict';
var __modules = window.__modules || (window.__modules = Object.create(null));
// module: src/core/owner-activity.js
__modules["src/core/owner-activity.js"]=(()=>{
const OWNER_ACTIVITY_CATEGORIES = Object.freeze([
  'account','navigation','learning','assignment','class','school','game','challenge','reward','feedback','admin','settings','system',
]);
function normalizeOwnerActivityEvent(row = {}) {
  return {
    id: Number(row.id) || 0,
    userId: String(row.user_id ?? row.userId ?? ''),
    displayName: String(row.display_name ?? row.displayName ?? 'Unknown user'),
    email: String(row.email ?? '').trim().toLowerCase(),
    role: String(row.role ?? 'player'),
    eventType: String(row.event_type ?? row.eventType ?? 'activity'),
    category: OWNER_ACTIVITY_CATEGORIES.includes(row.category) ? row.category : 'system',
    action: String(row.action ?? row.event_type ?? 'activity'),
    page: String(row.page ?? ''),
    schoolId: row.school_id ?? row.schoolId ?? null,
    classId: row.class_id ?? row.classId ?? null,
    assignmentId: row.assignment_id ?? row.assignmentId ?? null,
    sessionId: String(row.session_id ?? row.sessionId ?? ''),
    details: row.details && typeof row.details === 'object' ? row.details : {},
    createdAt: String(row.created_at ?? row.createdAt ?? ''),
  };
}
function filterOwnerActivity(events = [], filters = {}) {
  const search = String(filters.search ?? '').trim().toLowerCase();
  const category = String(filters.category ?? 'all');
  const userId = String(filters.userId ?? 'all');
  const page = String(filters.page ?? 'all');
  const eventType = String(filters.eventType ?? 'all');
  return (Array.isArray(events) ? events : []).map(normalizeOwnerActivityEvent).filter((event) => {
    if (category !== 'all' && event.category !== category) return false;
    if (userId !== 'all' && event.userId !== userId) return false;
    if (page !== 'all' && event.page !== page) return false;
    if (eventType !== 'all' && event.eventType !== eventType) return false;
    if (!search) return true;
    return [event.displayName,event.email,event.action,event.eventType,event.page,event.role,JSON.stringify(event.details)]
      .join(' ').toLowerCase().includes(search);
  });
}
function summarizeOwnerActivity(events = []) {
  const rows = (Array.isArray(events) ? events : []).map(normalizeOwnerActivityEvent);
  const users = new Set(rows.map((row) => row.userId).filter(Boolean));
  const today = new Date().toISOString().slice(0, 10);
  return {
    totalEvents: rows.length,
    uniqueUsers: users.size,
    todayEvents: rows.filter((row) => row.createdAt.slice(0, 10) === today).length,
    questionAttempts: rows.filter((row) => row.eventType === 'question-attempt').length,
    classJoins: rows.filter((row) => row.eventType === 'class-joined').length,
    logins: rows.filter((row) => row.eventType === 'login').length,
  };
}
function activityLabel(event = {}) {
  const row = normalizeOwnerActivityEvent(event);
  const labels = {
    'account-created':'Created an account', login:'Logged in', logout:'Logged out',
    'route-view':'Opened a page', 'ui-action':'Used a feature', 'school-joined':'Joined a school',
    'class-joined':'Joined a class', 'assignment-created':'Created an assignment',
    'assignment-started':'Started an assignment', 'assignment-completed':'Completed an assignment',
    'question-attempt':'Answered a question', 'game-started':'Started a game', 'game-answer':'Answered in a game',
    'challenge-submitted':'Submitted a challenge', 'feedback-submitted':'Sent feedback',
    'owner-action':'Used an Owner command', 'profile-updated':'Updated profile settings',
  };
  return labels[row.eventType] || row.action.replaceAll('-', ' ');
}
function ownerUserSummary(user = {}, events = []) {
  const rows = (Array.isArray(events) ? events : []).map(normalizeOwnerActivityEvent).filter((row) => row.userId === String(user.user_id ?? user.userId ?? ''));
  return {
    userId: String(user.user_id ?? user.userId ?? ''),
    displayName: String(user.display_name ?? user.displayName ?? 'Unknown user'),
    email: String(user.email ?? ''),
    role: String(user.role ?? 'player'),
    status: String(user.status ?? 'active'),
    joinedAt: String(user.created_at ?? user.joinedAt ?? ''),
    lastSeen: String(user.last_seen ?? user.lastSeen ?? ''),
    events: rows.length,
    lastEventAt: rows[0]?.createdAt || String(user.last_event_at ?? ''),
  };
}

return {OWNER_ACTIVITY_CATEGORIES,normalizeOwnerActivityEvent,filterOwnerActivity,summarizeOwnerActivity,activityLabel,ownerUserSummary};
})();
// module: src/core/platform.js
__modules["src/core/platform.js"]=(()=>{
const clamp = (n, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(n)) ? Number(n) : min));
const text = (v, max = 120) => String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? '').trim());
function normalizeStudentSettings(input = {}) {
  const guardianEmails = [...new Set((Array.isArray(input.guardianEmails) ? input.guardianEmails : []).map((x) => String(x).trim().toLowerCase()).filter(validEmail))].slice(0, 5);
  return {
    yearLevel: Math.round(clamp(input.yearLevel ?? 9, 0, 12)),
    textbookFocus: text(input.textbookFocus || 'Mathematics', 80),
    guardianEmails,
    weeklyParentEmails: input.weeklyParentEmails !== false,
    parentTaskNotifications: input.parentTaskNotifications !== false,
    accessibilityMode: Boolean(input.accessibilityMode),
    readAloud: Boolean(input.readAloud),
    language: text(input.language || 'English', 40),
    hideIncorrectAttempts: Boolean(input.hideIncorrectAttempts),
    calculatorEnabled: input.calculatorEnabled !== false,
  };
}

const levels = ['easy', 'medium', 'hard'];
function nextAdaptiveDifficulty(current = 'medium', recent = []) {
  const idx = Math.max(0, levels.indexOf(current));
  const tail = recent.slice(-3);
  const correct = tail.filter(Boolean).length;
  if (tail.length >= 2 && correct === 0) return levels[Math.max(0, idx - 1)];
  if (tail.length >= 3 && correct === tail.length) return levels[Math.min(levels.length - 1, idx + 1)];
  return levels[idx] || 'medium';
}
function updateSkillMastery(current = 0, { correct = false, weight = 6 } = {}) {
  const delta = Math.abs(Number(weight) || 0) * (correct ? 1 : -1);
  return Math.round(clamp(Number(current) + delta, 0, 100));
}
function buildRecommendedPractice(skills = []) {
  return skills.map((skill) => {
    const mastery = clamp(skill.mastery ?? 0, 0, 100);
    const prereq = clamp(skill.prerequisiteMastery ?? 0, 0, 100);
    let reason = 'Ready to learn';
    let score = 60;
    if (mastery >= 75 && mastery < 95) { reason = 'Skill almost mastered'; score = 100 - mastery + 90; }
    else if (skill.recent) { reason = 'Skill worked on recently'; score = 80; }
    else if (prereq < 60) { reason = 'Build prerequisite skills'; score = 25; }
    else score = 70 + (60 - Math.min(60, mastery));
    return { ...skill, mastery, prerequisiteMastery: prereq, reason, score };
  }).sort((a, b) => b.score - a.score);
}
function buildRevisionBank(attempts = []) {
  const latest = new Map();
  for (const item of [...attempts].sort((a, b) => Number(a.at ?? 0) - Number(b.at ?? 0))) latest.set(String(item.questionId), item);
  return [...latest.values()].filter((x) => !x.correct);
}
function streakMultiplier(streak = 0) {
  const value = Math.max(0, Math.floor(Number(streak) || 0));
  if (value >= 4) return 4;
  if (value === 3) return 3;
  if (value === 2) return 2;
  return 1;
}
function applyQuestionPoints(state = {}, result = {}) {
  const previous = Math.max(0, Math.floor(Number(state.questionStreak) || 0));
  const nextStreak = result.correct ? previous + 1 : (result.retry ? previous : 0);
  const base = result.correct ? 10 + (result.fullMarks ? 2 : 0) : 0;
  const gained = base * streakMultiplier(nextStreak);
  return { ...state, questionStreak: nextStreak, weeklyPoints: Math.max(0, Math.floor(Number(state.weeklyPoints) || 0)) + gained, lastPointsGained: gained };
}
function spinDailyWheel(state = {}, dateKey, random = Math.random) {
  if (state.lastWheelDate === dateKey) return { ok: false, message: 'Daily wheel already claimed.', state };
  const rewards = [10, 15, 20, 25, 35, 50];
  const idx = Math.max(0, Math.min(rewards.length - 1, Math.floor(Number(random()) * rewards.length)));
  const reward = rewards[idx];
  return { ok: true, reward, state: { ...state, lastWheelDate: dateKey, coins: Math.max(0, Number(state.coins) || 0) + reward } };
}
function buildLeaderboard(players = [], currentId = '') {
  const rows = [...players].map((p) => ({ ...p, points: Math.max(0, Number(p.points) || 0) })).sort((a, b) => b.points - a.points || String(a.name).localeCompare(String(b.name))).map((p, i) => ({ ...p, rank: i + 1 }));
  const me = rows.find((x) => String(x.id) === String(currentId)) || null;
  const nearby = me ? rows.filter((x) => Math.abs(x.rank - me.rank) <= 2 && x.id !== me.id) : [];
  return { rows, podium: rows.slice(0, 5), me, nearby };
}
function topicReadinessSummary(skills = []) {
  const mastery = skills.length ? Math.round(skills.reduce((sum, s) => sum + clamp(s.mastery ?? 0, 0, 100), 0) / skills.length) : 0;
  const gaps = skills.filter((s) => clamp(s.mastery ?? 0, 0, 100) < 60).map((s) => String(s.id));
  return { mastery, ready: mastery >= 70 && gaps.length === 0, gaps, assessedSkills: skills.length };
}
function buildPlannerItems(tasks = []) {
  return tasks.map((task) => ({ ...task, type: String(task.type || 'custom') })).sort((a, b) => String(a.dueAt || '9999').localeCompare(String(b.dueAt || '9999')) || String(a.title || '').localeCompare(String(b.title || '')));
}
function buildScorecard(input = {}) {
  const possible = Math.max(1, Number(input.possible) || 1);
  const awarded = clamp(input.awarded ?? 0, 0, possible);
  return {
    questionId: String(input.questionId || ''),
    working: Array.isArray(input.working) ? input.working.map((x) => String(x)) : [],
    awarded,
    possible,
    percent: Math.round((awarded / possible) * 100),
    partial: awarded > 0 && awarded < possible,
    feedback: String(input.feedback || ''),
    markingRationale: String(input.markingRationale || input.feedback || ''),
  };
}
function integrityFlags(events = []) {
  return events.flatMap((event) => {
    if (event.type === 'visibility-hidden') return [{ type: 'tab-switch', at: event.at ?? null }];
    if (event.type === 'paste') return [{ type: 'paste', chars: Math.max(0, Number(event.chars) || 0), at: event.at ?? null }];
    return [];
  });
}
function buildAdminAnalytics(rows = []) {
  const activeStudents = rows.filter((r) => Number(r.activeDays) > 0).length;
  const questionsCompleted = rows.reduce((sum, r) => sum + Math.max(0, Number(r.questions) || 0), 0);
  const totalTime = rows.reduce((sum, r) => sum + Math.max(0, Number(r.timeSeconds) || 0), 0);
  return {
    students: rows.length,
    activeStudents,
    veryActiveStudents: rows.filter((r) => Number(r.activeDays) >= 5).length,
    inactiveStudents: rows.length - activeStudents,
    questionsCompleted,
    averageLearningTimeSeconds: rows.length ? Math.round(totalTime / rows.length) : 0,
    averageQuestions: rows.length ? Math.round(questionsCompleted / rows.length) : 0,
  };
}
function searchTextbookContent(items = [], query = '') {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [...items];
  return items.filter((item) => [item.book, item.topic, item.subtopic, item.lesson, ...(item.outcomes || [])].some((v) => String(v || '').toLowerCase().includes(q)));
}
function createTaskGroups(groups = []) {
  return groups.map((group, index) => ({
    id: String(group.id || `group-${index + 1}`),
    name: text(group.name || `Group ${index + 1}`, 60),
    studentIds: [...new Set((group.studentIds || []).map(String))],
    startAt: group.startAt ? String(group.startAt) : null,
    dueAt: group.dueAt ? String(group.dueAt) : null,
  }));
}
const TASK_TYPES = Object.freeze(['custom','adaptive','lesson','worksheet','test','readiness','template','revision','recommended','self-directed-adaptive']);
const TEXTBOOKS = Object.freeze([
  { id:'nsw-y9', book:'MathsExpress NSW Year 9', curriculum:'NSW', yearLevel:9, topic:'Algebra', subtopic:'Linear equations', outcomes:['MA5-ALG-C-01'], lesson:'Solving linear equations', difficulty:'Medium', estimatedMinutes:18 },
  { id:'nsw-y9-exp', book:'MathsExpress NSW Year 9', curriculum:'NSW', yearLevel:9, topic:'Algebra', subtopic:'Expanding expressions', outcomes:['MA5-ALG-C-01'], lesson:'Expanding brackets', difficulty:'Medium', estimatedMinutes:16 },
  { id:'aus-y9', book:'MathsExpress Australian Curriculum Year 9', curriculum:'Australian Curriculum', yearLevel:9, topic:'Number & Algebra', subtopic:'Algebraic techniques', outcomes:['AC9M9A02'], lesson:'Algebraic techniques', difficulty:'Medium', estimatedMinutes:20 },
]);

return {normalizeStudentSettings,nextAdaptiveDifficulty,updateSkillMastery,buildRecommendedPractice,buildRevisionBank,streakMultiplier,applyQuestionPoints,spinDailyWheel,buildLeaderboard,topicReadinessSummary,buildPlannerItems,buildScorecard,integrityFlags,buildAdminAnalytics,searchTextbookContent,createTaskGroups,TASK_TYPES,TEXTBOOKS};
})();
// module: src/core/reports.js
__modules["src/core/reports.js"]=(()=>{
function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function buildGradebookRows({ students = [], assignments = [], attempts = [] } = {}) {
  return students.map((student) => {
    const scores = {};
    const completion = {};
    for (const assignment of assignments) {
      const candidates = attempts.filter((attempt) => String(attempt.student_id) === String(student.user_id)
        && String(attempt.assignment_id) === String(assignment.id));
      const latest = candidates.at(-1);
      scores[assignment.title] = latest ? Math.round(asNumber(latest.score_percent)) : '';
      completion[assignment.title] = latest?.completed_at ? 'Completed' : latest ? 'In progress' : 'Not started';
    }
    const numeric = Object.values(scores).filter((value) => typeof value === 'number');
    return {
      studentId: String(student.user_id ?? ''),
      student: String(student.display_name ?? student.username ?? student.email ?? 'Student'),
      username: String(student.username ?? ''),
      email: String(student.email ?? ''),
      average: numeric.length ? Math.round(numeric.reduce((sum, value) => sum + value, 0) / numeric.length) : '',
      scores,
      completion,
    };
  });
}
function gradebookCsv(data = {}) {
  const assignments = Array.isArray(data.assignments) ? data.assignments : [];
  const rows = buildGradebookRows(data);
  const header = ['Student', 'Username', 'Email', 'Average', ...assignments.map((assignment) => assignment.title)];
  const lines = [header.map(csvCell).join(',')];
  for (const row of rows) {
    lines.push([
      row.student,
      row.username,
      row.email,
      row.average === '' ? '' : `${row.average}%`,
      ...assignments.map((assignment) => {
        const score = row.scores[assignment.title];
        return score === '' ? '' : `${score}%`;
      }),
    ].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}
function hardestQuestions(questionAttempts = [], limit = 10) {
  const grouped = new Map();
  for (const attempt of questionAttempts) {
    const questionId = String(attempt.question_id ?? attempt.questionId ?? '');
    if (!questionId) continue;
    const score = Math.max(0, asNumber(attempt.score));
    const maxScore = Math.max(1, asNumber(attempt.max_score ?? attempt.maxScore, 1));
    const entry = grouped.get(questionId) ?? { questionId, earned: 0, possible: 0, attempts: 0 };
    entry.earned += Math.min(score, maxScore);
    entry.possible += maxScore;
    entry.attempts += 1;
    grouped.set(questionId, entry);
  }
  return [...grouped.values()]
    .map((entry) => ({
      questionId: entry.questionId,
      attempts: entry.attempts,
      accuracy: entry.possible ? Math.round((entry.earned / entry.possible) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts || a.questionId.localeCompare(b.questionId))
    .slice(0, Math.max(1, Number(limit) || 10));
}

return {buildGradebookRows,gradebookCsv,hardestQuestions};
})();
// module: src/core/ui-model.js
__modules["src/core/ui-model.js"]=(()=>{
const {levelFromXp, xpForLevel, getTopicMastery}=__modules["src/core/progression.js"];


function accuracyFromState(state) {
  const answered = Number(state?.stats?.answered) || 0;
  const correct = Number(state?.stats?.correct) || 0;
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}
function buildDashboardModel(state) {
  const level = levelFromXp(state?.xp ?? 0);
  const startXp = xpForLevel(level);
  const nextXp = xpForLevel(level + 1);
  const span = Math.max(1, nextXp - startXp);
  const levelProgress = Math.max(0, Math.min(100, Math.round((((state?.xp ?? 0) - startXp) / span) * 100)));
  return {
    level,
    levelProgress,
    xp: state?.xp ?? 0,
    nextLevelXp: nextXp,
    coins: state?.coins ?? 0,
    streak: state?.streak ?? 1,
    accuracy: accuracyFromState(state),
    algebraMastery: getTopicMastery(state, 'algebra'),
  };
}
function buildProfileModel(state) {
  return {
    level: levelFromXp(state?.xp ?? 0),
    xp: state?.xp ?? 0,
    coins: state?.coins ?? 0,
    streak: state?.streak ?? 1,
    accuracy: accuracyFromState(state),
    questionsAnswered: state?.stats?.answered ?? 0,
    correctAnswers: state?.stats?.correct ?? 0,
    algebraMastery: getTopicMastery(state, 'algebra'),
  };
}

return {buildDashboardModel,buildProfileModel};
})();
// module: src/core/game-time.js
__modules["src/core/game-time.js"]=(()=>{
const GAME_TIME_PER_QUESTION = 10;
const MAX_GAME_TIME_SECONDS = 300;

const clampSeconds = (value) => Math.max(0, Math.floor(Number(value) || 0));
function awardQuestionGameTime(state, questionKey, seconds = GAME_TIME_PER_QUESTION) {
  const key = String(questionKey || '').trim();
  if (!key) throw new Error('Question key is required');
  const rewarded = new Set(Array.isArray(state.gameTimeRewardedQuestions) ? state.gameTimeRewardedQuestions : []);
  if (rewarded.has(key)) return state;
  rewarded.add(key);
  return {
    ...state,
    gameTimeSeconds: Math.min(MAX_GAME_TIME_SECONDS, clampSeconds(state.gameTimeSeconds) + clampSeconds(seconds)),
    gameTimeRewardedQuestions: [...rewarded].slice(-2000),
  };
}
function spendGameTime(state, seconds = 1) {
  const spend = clampSeconds(seconds);
  return { ...state, gameTimeSeconds: Math.max(0, clampSeconds(state.gameTimeSeconds) - spend) };
}
function formatGameTime(seconds) {
  const safe = clampSeconds(seconds);
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

return {GAME_TIME_PER_QUESTION,MAX_GAME_TIME_SECONDS,awardQuestionGameTime,spendGameTime,formatGameTime};
})();
// module: src/core/driving-game.js
__modules["src/core/driving-game.js"]=(()=>{
function int(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function shuffled(values, random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function uniqueDistractors(answer, random, spread = 8) {
  const base = Number(answer);
  const values = new Set([base]);
  let guard = 0;
  while (values.size < 4 && guard < 20) {
    const offset = int(random, 1, Math.max(2, Math.floor(spread))) * (random() > .5 ? 1 : -1);
    values.add(base + offset);
    guard += 1;
  }
  for (const offset of [1,-1,2,-2,3,-3,5,-5]) {
    if (values.size >= 4) break;
    values.add(base + offset);
  }
  return [...values].slice(0,4);
}
const DRIVING_RECENT = new Map();
function rememberDrivingQuestion(year,prompt){
  const list=DRIVING_RECENT.get(year)||[];
  list.push(String(prompt));
  while(list.length>24)list.shift();
  DRIVING_RECENT.set(year,list);
}
function createDrivingQuestion(yearLevel = 9, random = Math.random, avoidPrompts = []) {
  const parsedYear=Number(yearLevel);
  const year = Math.max(0, Math.min(12, Math.floor(Number.isFinite(parsedYear)?parsedYear:9)));
  const recent=[...new Set([...(DRIVING_RECENT.get(year)||[]), ...(Array.isArray(avoidPrompts)?avoidPrompts:[])])].slice(-220);
  let prompt = '';
  let answer = 0;
  let attempts=0;
  do {
    prompt=''; answer=0;
  if (year === 0) {
    const a=int(random,0,8), b=int(random,0,Math.max(0,10-a));
    prompt = `${a} + ${b} = ?`; answer = a+b;
  } else if (year === 1) {
    const a=int(random,0,12), b=int(random,0,8);
    prompt = `${a} + ${b} = ?`; answer = a+b;
  } else if (year === 2) {
    const a=int(random,10,70), b=int(random,1,29);
    prompt = `${a} + ${b} = ?`; answer = a+b;
  } else if (year === 3) {
    const a=int(random,2,10), b=int(random,2,10);
    prompt = `${a} × ${b} = ?`; answer = a*b;
  } else if (year === 4) {
    const a=int(random,20,120), b=int(random,10,80);
    prompt = `${a} - ${Math.min(a,b)} = ?`; answer = a-Math.min(a,b);
  } else if (year === 5) {
    const a = int(random, 20, 150); const b = int(random, 5, 80);
    prompt = `${a} + ${b} = ?`; answer = a + b;
  } else if (year === 6) {
    const a = int(random, 4, 15); const b = int(random, 3, 12);
    prompt = `${a} × ${b} = ?`; answer = a * b;
  } else if (year === 7) {
    const a = int(random, 8, 45); const b = int(random, 3, 18);
    prompt = `${a} + ${b} = ?`; answer = a + b;
  } else if (year === 8) {
    const x = int(random, 2, 12); const m = int(random, 2, 7); const c = int(random, 1, 12);
    prompt = `Solve: ${m}x + ${c} = ${m*x+c}`; answer = x;
  } else if (year === 9) {
    const x = int(random, 2, 10); const a = int(random, 2, 8); const b = int(random, -9, 9);
    prompt = `If x = ${x}, find ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`; answer = a*x+b;
  } else if (year === 10) {
    const r1 = int(random, 1, 8); const r2 = int(random, 1, 8);
    prompt = `For x² - ${r1+r2}x + ${r1*r2} = 0, one root is ${r1}. Find the other.`; answer = r2;
  } else if (year === 11) {
    const x = int(random, 1, 8); const a = int(random, 2, 6); const b = int(random, -8, 8);
    prompt = `For f(x) = ${a}x² ${b < 0 ? '-' : '+'} ${Math.abs(b)}, find f(${x}).`; answer = a*x*x+b;
  } else {
    const a = int(random, 2, 7); const n = int(random, 2, 5); const x = int(random, 1, 4);
    prompt = `If f(x) = ${a}x^${n}, find f'(${x}).`; answer = a*n*(x**(n-1));
  }
    attempts += 1;
  } while(recent.includes(prompt) && attempts < 30);
  rememberDrivingQuestion(year,prompt);
  const options = shuffled(uniqueDistractors(answer, random, Math.max(5, Math.abs(Number(answer))*0.25)), random)
    .map((value, index) => ({ id: `lane-${index}`, value: String(value), correct: Number(value) === Number(answer) }));
  return { id: `drive-${year}-${Date.now()}-${Math.floor(random()*1e6)}`, yearLevel: year, prompt, answer: String(answer), options };
}
function createDrivingState(yearLevel = 9, random = Math.random, options = {}) {
  const recentPrompts=Array.isArray(options.recentPrompts)?options.recentPrompts.slice(-180):[];
  return { yearLevel, lane: 1, score: 0, combo: 0, bestCombo: 0, answered: 0, correct: 0, misses: 0, hazards: 0, track: options.track || 'city', mode: options.mode || 'classic', recentPrompts, question: createDrivingQuestion(yearLevel, random, recentPrompts), feedback: null };
}
function moveDrivingLane(state, delta) {
  return { ...state, lane: Math.max(0, Math.min(3, Number(state.lane || 0) + Number(delta || 0))) };
}
function chooseDrivingLane(state, lane, random = Math.random) {
  const safeLane = Math.max(0, Math.min(3, Math.floor(Number(lane) || 0)));
  const picked = state.question.options[safeLane];
  const correct = Boolean(picked?.correct);
  const combo = correct ? (state.combo || 0) + 1 : 0;
  const mode = state.mode || 'classic';
  const baseScore = Number(state.score) || 0;
  let gain = correct ? 100 + combo * 20 : 0;
  let hazards = Number(state.hazards) || 0;
  if (mode === 'speed-round') gain = correct ? 150 + combo * 30 : 0;
  if (mode === 'perfect-streak') gain = correct ? 120 + combo * 40 : 0;
  if (mode === 'obstacles') {
    gain = correct ? 120 + combo * 20 : -50;
    if (!correct) hazards += 1;
  }
  if (mode === 'endless') gain = correct ? 90 + combo * 25 : 0;
  const recentPrompts=[...(Array.isArray(state.recentPrompts)?state.recentPrompts:[]), String(state.question?.prompt||'')].filter(Boolean).slice(-180);
  return {
    ...state,
    recentPrompts,
    lane: safeLane,
    score: Math.max(0, baseScore + gain),
    combo,
    bestCombo: Math.max(Number(state.bestCombo) || 0, combo),
    answered: (state.answered || 0) + 1,
    correct: (state.correct || 0) + (correct ? 1 : 0),
    misses: (state.misses || 0) + (correct ? 0 : 1),
    hazards,
    feedback: correct ? 'correct' : 'wrong',
    question: createDrivingQuestion(state.yearLevel, random, recentPrompts),
  };
}

return {createDrivingQuestion,createDrivingState,moveDrivingLane,chooseDrivingLane};
})();
// module: src/core/lucky-box.js
__modules["src/core/lucky-box.js"]=(()=>{
const LUCKY_BOX_COST = 50;
const LUCKY_BOX_PRIZES = Object.freeze([
  { id: 'refund', label: '50 coins back', coinDelta: 50 },
  { id: 'reward', label: 'Bonus reward', coinDelta: 0 },
  { id: 'double', label: '100 coins', coinDelta: 100 },
]);
function canBuyLuckyBox(state) {
  return Math.max(0, Number(state?.coins) || 0) >= LUCKY_BOX_COST;
}
function startLuckyBox(state, random = Math.random) {
  if (!canBuyLuckyBox(state)) return { ok:false, reason:'insufficient-coins', state };
  const shuffled = [...LUCKY_BOX_PRIZES].sort(() => random() - .5);
  return { ok:true, state:{ ...state, coins:Math.max(0, Number(state.coins)||0)-LUCKY_BOX_COST }, boxes:shuffled };
}
function revealLuckyBox(state, boxes, index) {
  const prize = boxes?.[Math.max(0, Math.min(2, Math.floor(Number(index) || 0)))] || LUCKY_BOX_PRIZES[0];
  return {
    prize,
    state: {
      ...state,
      coins: Math.max(0, Number(state.coins) || 0) + prize.coinDelta,
      luckyBoxRewards: [...(Array.isArray(state.luckyBoxRewards) ? state.luckyBoxRewards : []), { prize:prize.id, at:new Date().toISOString() }].slice(-100),
    },
  };
}

return {LUCKY_BOX_COST,LUCKY_BOX_PRIZES,canBuyLuckyBox,startLuckyBox,revealLuckyBox};
})();
// module: src/core/global-challenges.js
__modules["src/core/global-challenges.js"]=(()=>{
const WEEKLY_REWARDS = Object.freeze({ 1:15, 2:8, 3:4 });
function challengeWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
function previousChallengeWeekKey(date = new Date()) {
  const previous = new Date(date.getTime() - 7 * 86400000);
  return challengeWeekKey(previous);
}
function scoreSpeedChallenge({ elapsedMs = 0, wrongAnswers = 0, correct = 10 } = {}) {
  const base = Math.max(0, Math.floor(Number(elapsedMs) || 0));
  const wrong = Math.max(0, Math.floor(Number(wrongAnswers) || 0));
  const accurate = Math.max(0, Math.floor(Number(correct) || 0));
  const penaltyMs = wrong * 5000;
  return { elapsedMs:base, wrongAnswers:wrong, correct:accurate, penaltyMs, totalMs:base + penaltyMs };
}
function rankChallengeScores(rows = []) {
  return [...rows]
    .filter((row) => Number(row.correct) >= 10)
    .sort((a,b) => Number(a.totalMs) - Number(b.totalMs) || new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    .map((row,index) => ({ ...row, rank:index+1, rewardCoins:WEEKLY_REWARDS[index+1] || 0 }));
}
function formatChallengeTime(ms) {
  const total = Math.max(0, Math.floor(Number(ms) || 0));
  const seconds = Math.floor(total / 1000);
  const millis = total % 1000;
  return `${seconds}.${String(millis).padStart(3,'0')}s`;
}

return {WEEKLY_REWARDS,challengeWeekKey,previousChallengeWeekKey,scoreSpeedChallenge,rankChallengeScores,formatChallengeTime};
})();
// module: src/core/ultimate-suite.js
__modules["src/core/ultimate-suite.js"]=(()=>{
const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
const clean=(v,max=120)=>String(v??'').trim().replace(/\s+/g,' ').slice(0,max);
const DEFAULT_FEATURE_FLAGS=Object.freeze({
  games:true,globalChallenges:true,luckyBox:true,leaderboards:true,helper:true,
  liveLessons:true,parentView:true,announcements:true,certificates:true,studentAvatars:true,
  darkMode:true,readAloud:true,graphing:true,printing:true
});
function normalizeFeatureFlags(input={}){
  return Object.fromEntries(Object.keys(DEFAULT_FEATURE_FLAGS).map(k=>[k,input[k]!==false]));
}
function buildMistakeBook(attempts=[]){
  const map=new Map();
  for(const a of attempts){
    if(a?.correct===true) continue;
    const key=clean(a?.questionId||a?.prompt||a?.skill||'mistake',160);
    const row=map.get(key)||{key,prompt:clean(a?.prompt||'Question',240),skill:clean(a?.skill||a?.topic||'General maths',80),count:0,lastAt:null,resolved:false};
    row.count+=1; row.lastAt=a?.createdAt||a?.created_at||row.lastAt; map.set(key,row);
  }
  return [...map.values()].sort((a,b)=>b.count-a.count||String(b.lastAt).localeCompare(String(a.lastAt)));
}
function buildDailyPractice(pool=[],count=5,seed=0){
  const list=[...pool]; if(!list.length) return [];
  const n=Math.max(1,Math.min(20,Math.floor(Number(count)||5)));
  const start=Math.abs(Math.floor(Number(seed)||0))%list.length;
  return Array.from({length:Math.min(n,list.length)},(_,i)=>list[(start+i*7)%list.length]);
}
function nextSmartDifficulty(current='medium',recent=[]){
  const levels=['easy','medium','hard']; let idx=Math.max(0,levels.indexOf(current));
  const tail=recent.slice(-4); if(tail.length<3) return levels[idx];
  const correct=tail.filter(Boolean).length;
  if(correct>=4) idx++; else if(correct<=1) idx--;
  return levels[Math.max(0,Math.min(2,idx))];
}
function masteryBand(value=0){
  const n=clamp(value,0,100);
  if(n>=80) return 'Mastered'; if(n>=50) return 'Learning'; if(n>0) return 'Needs practice'; return 'Not started';
}
function createGoal(input={}){
  const metric=['questions','streak','mastery','custom'].includes(input.metric)?input.metric:'custom';
  return {id:clean(input.id||`goal-${Date.now()}`,80),title:clean(input.title||'Maths goal',100),target:clamp(input.target||100,1,100000),progress:clamp(input.progress||0,0,input.target||100),dueDate:clean(input.dueDate||'',20),completed:Boolean(input.completed),metric,metricTopic:clean(input.metricTopic||'',40),baseline:Math.max(0,Number(input.baseline)||0)};
}
function updateGoal(goal,amount=1){ const next=createGoal(goal); next.progress=clamp(next.progress+Number(amount||0),0,next.target); next.completed=next.progress>=next.target; return next; }
function tutorResponse({prompt='',hint='',solution='',mode='hint'}={}){
  const p=clean(prompt,300), h=clean(hint,400), s=clean(solution,500);
  if(mode==='explain') return h?`Start with this idea: ${h}`:`Break the problem into smaller steps. Identify what is known, what is unknown, then choose the operation or rule that connects them.`;
  if(mode==='example') return `Try a similar example with simpler numbers first, then copy the same method back to: ${p||'the original question'}.`;
  if(mode==='mistake') return `Check one line at a time. Look for sign errors, an operation applied to only one side, or a value substituted into the wrong place.`;
  if(mode==='solution') return s||h||'Use the rule for this skill, show each step, and verify your result by substituting it back into the original question.';
  return h||'Write down the important values first, then decide which rule or operation the question is testing.';
}
function generateAssessmentPack(tasks=[],options={}){
  const count=Math.max(1,Math.min(60,Math.floor(Number(options.count)||10)));
  const title=clean(options.title||'Generated assessment',100);
  const difficulty=clean(options.difficulty||'mixed',20);
  const selected=[];
  const source=tasks.filter(Boolean);
  for(let i=0;i<count && source.length;i++) selected.push(source[i%source.length]);
  return {id:`assessment-${Date.now()}`,title,count:selected.length,difficulty,calculator:options.calculator||'teacher-choice',timeLimit:clamp(options.timeLimit||40,1,240),questions:selected};
}
function differentiateAssignment(base={}){
  const q=Math.max(5,Math.min(30,Number(base.questionCount)||10));
  return [
    {...base,group:'Support',difficulty:'easy',questionCount:q,hintsAllowed:true},
    {...base,group:'Core',difficulty:'medium',questionCount:q,hintsAllowed:true},
    {...base,group:'Extension',difficulty:'hard',questionCount:q,hintsAllowed:false},
  ];
}
function recurringDates(startDate,frequency='weekly',count=6){
  const out=[]; const d=new Date(startDate||Date.now()); if(Number.isNaN(d.getTime())) return out;
  const max=Math.max(1,Math.min(52,Number(count)||6));
  for(let i=0;i<max;i++){ out.push(new Date(d)); if(frequency==='daily')d.setDate(d.getDate()+1); else if(frequency==='fortnightly')d.setDate(d.getDate()+14); else d.setDate(d.getDate()+7); }
  return out;
}
function buildStudentGroups(students=[],strategy='balanced',groupCount=3){
  const n=Math.max(1,Math.min(10,Number(groupCount)||3));
  const groups=Array.from({length:n},(_,i)=>({id:`group-${i+1}`,name:`Group ${i+1}`,students:[]}));
  const sorted=[...students].sort((a,b)=>(Number(b.mastery)||0)-(Number(a.mastery)||0));
  sorted.forEach((s,i)=>groups[strategy==='balanced'?(i%n):Math.min(n-1,Math.floor(i/(Math.max(1,Math.ceil(sorted.length/n)))))].students.push(s));
  return groups;
}
function createPoll(question,options=[]){
  const choices=options.map((x,i)=>({id:`o${i+1}`,label:clean(x,80),votes:0})).filter(x=>x.label).slice(0,6);
  return {id:`poll-${Date.now()}`,question:clean(question,160),options:choices,totalVotes:0,open:true};
}
function votePoll(poll,optionId){
  const next={...poll,options:(poll.options||[]).map(o=>({...o}))}; const o=next.options.find(x=>x.id===optionId); if(!o||!next.open)return next; o.votes++; next.totalVotes=(Number(next.totalVotes)||0)+1; return next;
}
function createExitTicket(topic='Lesson',count=3){ return {id:`exit-${Date.now()}`,topic:clean(topic,80),count:Math.max(1,Math.min(5,Number(count)||3)),status:'ready'}; }
function createCertificate({student='Student',reason='Outstanding improvement',date=new Date()}={}){ return {student:clean(student,80),reason:clean(reason,160),date:new Date(date).toISOString().slice(0,10),title:'MathsExpress Certificate'}; }
function buildNotifications(items=[]){
  return items.filter(Boolean).map((x,i)=>({id:clean(x.id||`notice-${i}`,80),type:clean(x.type||'info',30),title:clean(x.title||'Update',100),body:clean(x.body||'',240),read:Boolean(x.read),createdAt:x.createdAt||new Date().toISOString()})).slice(-100).reverse();
}
function exportRowsCsv(rows=[]){
  if(!rows.length) return '';
  const keys=[...new Set(rows.flatMap(r=>Object.keys(r||{})))];
  const esc=v=>`"${String(v??'').replaceAll('"','""')}"`;
  return [keys.map(esc).join(','),...rows.map(r=>keys.map(k=>esc(r[k])).join(','))].join('\n');
}
function ownerAnalytics({users=0,schools=0,questions=0,assignments=0,games=0,feedback=0}={}){
  return {users:Math.max(0,Number(users)||0),schools:Math.max(0,Number(schools)||0),questions:Math.max(0,Number(questions)||0),assignments:Math.max(0,Number(assignments)||0),games:Math.max(0,Number(games)||0),feedback:Math.max(0,Number(feedback)||0)};
}
function revisionPlanDates(testDate,count=5){
  const test=new Date(testDate); if(Number.isNaN(test.getTime())) return [];
  const n=Math.max(1,Math.min(10,Number(count)||5)); const out=[];
  const gaps=n===1?[2]:Array.from({length:n},(_,i)=>Math.max(1,Math.round(14-(i*(12/(n-1))))));
  for(const gap of gaps){const d=new Date(test);d.setDate(d.getDate()-gap);out.push(d);}
  return out.sort((a,b)=>a-b);
}
function buildDifferentiatedTargets(students=[]){
  const sorted=[...students].sort((a,b)=>(Number(a.mastery)||0)-(Number(b.mastery)||0));
  const groups={Support:[],Core:[],Extension:[]};
  const names=['Support','Core','Extension'];
  const n=sorted.length;
  sorted.forEach((student,index)=>{
    // Use the centre of each student's rank bucket so tiny classes still
    // distribute sensibly (e.g. 3 students -> one per group).
    const bucket=n ? Math.min(2,Math.floor((((index+0.5)/n)*3))) : 1;
    groups[names[bucket]].push(student);
  });
  return groups;
}

return {DEFAULT_FEATURE_FLAGS,normalizeFeatureFlags,buildMistakeBook,buildDailyPractice,nextSmartDifficulty,masteryBand,createGoal,updateGoal,tutorResponse,generateAssessmentPack,differentiateAssignment,recurringDates,buildStudentGroups,createPoll,votePoll,createExitTicket,createCertificate,buildNotifications,exportRowsCsv,ownerAnalytics,revisionPlanDates,buildDifferentiatedTargets};
})();
// module: src/core/ai-study-bot.js
__modules["src/core/ai-study-bot.js"]=(()=>{
const clean = (value, max = 1000) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max);

const TOPIC_HELP = Object.freeze({
  algebra: 'Treat the unknown like a number you are trying to isolate. Simplify first, then undo operations in reverse order.',
  equation: 'Keep the equation balanced: whatever operation you do to one side, do to the other side too.',
  equations: 'Keep the equation balanced: whatever operation you do to one side, do to the other side too.',
  factor: 'Look for a common factor first, then check whether the expression matches a familiar factorisation pattern.',
  factorising: 'Look for a common factor first, then check whether the expression matches a familiar factorisation pattern.',
  expanding: 'Multiply the term outside the bracket by every term inside, then collect like terms.',
  fraction: 'Use a common denominator before adding or subtracting fractions, and simplify at the end.',
  percentage: 'Change the percentage to a decimal or fraction, then multiply by the original amount.',
  ratio: 'Simplify ratios by dividing every part by the same common factor.',
  pythagoras: 'For a right triangle, use a² + b² = c², with c as the hypotenuse.',
  trigonometry: 'Label opposite, adjacent and hypotenuse first, then choose sine, cosine or tangent.',
  probability: 'Probability is favourable outcomes divided by total equally likely outcomes, and it must stay between 0 and 1.',
  mean: 'Add all values and divide by the number of values.',
  median: 'Order the values first, then find the middle value.',
  quadratic: 'Try factorising first when possible. Otherwise choose a suitable solving method and remember there may be two solutions.',
  gradient: 'Gradient is change in y divided by change in x.',
  logarithm: 'A logarithm and an exponential describe the same relationship in different forms.',
  differentiation: 'Differentiate each term using the relevant rule, then simplify.',
  derivative: 'Differentiate each term using the relevant rule, then simplify.',
  integration: 'Integrate term by term, increase powers by 1 and divide by the new power. Add the constant when required.',
  vector: 'Work component by component and keep directions and signs consistent.',
});

const SMALL_TALK = [
  ['hello','Hey! What maths are you working on?'],
  ['hi','Hi! Send me a question, topic, or your working and I’ll help.'],
  ['hey','Hey! I can give hints, check answers, explain steps, or make a similar example.'],
  ['thanks','You’re welcome. Send the next step or question whenever you’re ready.'],
  ['thank you','You’re welcome. Want another example or a harder one next?'],
];

function detectBotIntent(message = '') {
  const m = clean(message, 500).toLowerCase();
  if (!m) return 'welcome';
  if (/^(hi|hello|hey|thanks|thank you|cheers)[!. ]*$/.test(m)) return 'chat';
  if (/^(why|how come)\??$/.test(m)) return 'why';
  if (/\b(another hint|next hint|more help)\b/.test(m)) return 'hint';
  if (/\b(is .* right|check my answer|my answer|i got|i think.*=|correct\?)\b/.test(m)) return 'check';
  if (/\b(answer|solution|solve it|just tell me)\b/.test(m)) return 'answer';
  if (/\b(example|similar question|another one)\b/.test(m)) return 'example';
  if (/\b(explain|simpler|what does|how does|teach me)\b/.test(m)) return 'explain';
  if (/\b(what should i (study|practise|practice)|recommend|weak|next topic)\b/.test(m)) return 'recommend';
  if (/\b(formula|rule)\b/.test(m)) return 'formula';
  if (/\b(hint|stuck|help|start)\b/.test(m)) return 'hint';
  return 'coach';
}

function safeTutorHints(rawHints = [], workedSolution = '', answer = null) {
  const solution=clean(workedSolution,900).toLowerCase();
  const answerText=Array.isArray(answer)?answer.join(' '):(answer&&typeof answer==='object'?Object.values(answer).join(' '):String(answer??''));
  const answerNorm=clean(answerText,250).toLowerCase().replace(/\s+/g,' ').trim();
  const escapedAnswer=answerNorm ? answerNorm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') : '';
  const out=[];
  for(let i=0;i<rawHints.length;i+=1){
    const hint=clean(rawHints[i],500); if(!hint)continue;
    const norm=hint.toLowerCase().replace(/\s+/g,' ').trim();
    // Generated questions historically stored the complete worked solution as hint #2.
    // Remove anything equal to, containing, or substantially copying that solution.
    if(solution && (norm===solution || (norm.length>45 && solution.includes(norm)) || (solution.length>45 && norm.includes(solution)))) continue;
    // Never pass the expected answer through as a teacher hint, even for one-digit answers.
    if(escapedAnswer){
      const boundary=new RegExp(`(^|[^a-z0-9])${escapedAnswer}([^a-z0-9]|$)`,'i');
      const looksConclusive=/\b(answer|therefore|hence|so|solution|gives?|equals?)\b|(?:^|\s)[xyabcnmprstuvw]\s*=|=\s*[-+]?\d/i.test(norm);
      if(boundary.test(norm) && (looksConclusive || i>0 || norm.length<90)) continue;
    }
    // Hints should be strategy-level. A line that reads like a completed solution is not a hint.
    if(i>0 && /\b(the solution is|final answer|therefore|hence)\b/i.test(norm)) continue;
    out.push(hint);
    if(out.length>=2) break;
  }
  return out;
}


function buildBotContext(input = {}) {
  const q = input.question || {};
  const workedSolution = clean(q.workedSolution || q.solution || input.workedSolution || '', 900);
  const answer = q.answer ?? input.answer ?? null;
  const rawHints = Array.isArray(q.hints) ? q.hints : (Array.isArray(input.hints) ? input.hints : [q.hint || input.hint]);
  const hints = safeTutorHints(rawHints, workedSolution, answer);
  return {
    prompt: clean(q.prompt || input.prompt || '', 700),
    answer,
    hints,
    hint: hints[0] || '',
    workedSolution,
    skill: clean(input.skill || q.skill || input.topic || q.topic || 'Mathematics', 120),
    topic: clean(input.topic || q.topic || input.skill || q.skill || 'Mathematics', 120),
    yearLevel: Number.isFinite(Number(input.yearLevel)) ? Number(input.yearLevel) : 9,
    difficulty: clean(input.difficulty || q.difficulty || 'medium', 30),
    attempts: Math.max(0, Number(input.attempts || 0)),
    tutorAllowed: input.tutorAllowed !== false,
    testMode: Boolean(input.testMode),
    mistakes: Array.isArray(input.mistakes) ? input.mistakes.slice(0, 5) : [],
  };
}

function topicTip(context, message='') {
  const haystack = `${message} ${context.skill} ${context.topic} ${context.prompt}`.toLowerCase();
  const key = Object.keys(TOPIC_HELP).find(k => haystack.includes(k));
  return key ? TOPIC_HELP[key] : 'Work out what is given, what you need to find, and which maths relationship connects them. Then do one clear step at a time.';
}

function answerFromMessage(message) {
  const text = clean(message, 400);
  const quoted = text.match(/(?:answer(?: is)?|i got|i think|=)\s*([^?.!,]+(?:\.[0-9]+)?)/i);
  return quoted ? clean(quoted[1], 120) : '';
}

function normaliseAnswer(value) {
  const s = String(value ?? '').trim().toLowerCase().replace(/\s+/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? { type: 'number', value: Math.round(n * 1e8) / 1e8 } : { type: 'text', value: s };
}

function answersMatch(a, b) {
  const x = normaliseAnswer(a), y = normaliseAnswer(b);
  if (x.type === 'number' && y.type === 'number') return Math.abs(x.value - y.value) < 1e-6;
  return x.value === y.value;
}

function simpleExample(context) {
  const lower = `${context.skill} ${context.topic} ${context.prompt}`.toLowerCase();
  if (lower.includes('linear') || lower.includes('equation')) return 'Try this similar one: solve 3x + 5 = 20. First subtract 5 from both sides, then divide both sides by 3. The same two-step idea applies to your question.';
  if (lower.includes('expand')) return 'Try this similar one: expand 4(x + 3). Multiply 4 by both terms inside the bracket to get 4x + 12.';
  if (lower.includes('factor')) return 'Try this similar one: factorise 6x + 18. Both terms share a factor of 6, so it becomes 6(x + 3).';
  if (lower.includes('percentage')) return 'Try this similar one: find 20% of 70. Convert 20% to 0.20, then calculate 0.20 × 70.';
  if (lower.includes('pythag')) return 'Try this similar one: a right triangle has shorter sides 3 and 4. Use 3² + 4² = c², then take the square root.';
  if (lower.includes('gradient')) return 'Try this similar one: from (1, 2) to (4, 8), gradient = (8 − 2) ÷ (4 − 1).';
  if (lower.includes('fraction')) return 'Try this similar one: 1/3 + 1/6. Rewrite 1/3 as 2/6, then add the numerators.';
  return `Try a smaller ${context.topic || 'maths'} example first using simple numbers, then copy the same method into the original question.`;
}

function safeArithmetic(message='') {
  const m=clean(message,300).toLowerCase().replace(/,/g,'');
  const hit=m.match(/(?:(?:what(?:'s| is)?|calculate|work out|evaluate|solve|how (?:do i|to|would i) do)\s+)?([0-9.()\s+\-*/^×÷]+)\??$/i);
  if(!hit) return null;
  let expr=hit[1].replace(/×/g,'*').replace(/÷/g,'/').trim();
  if(!expr || !/[0-9]/.test(expr) || !/[+\-*/]/.test(expr) || !/^[0-9.()\s+\-*/]+(?:\*\*[0-9.()\s+\-*/]+)?$/.test(expr)) return null;
  try {
    const value=globalThis.MXSafeMath?.evaluate?.(expr,{});
    if(typeof value!=='number' || !Number.isFinite(value)) return null;
    return { value: Math.round(value*1e10)/1e10, expr };
  } catch { return null; }
}

function arithmeticWorking(arithmetic) {
  if(!arithmetic) return '';
  const {expr,value}=arithmetic;
  const simple=expr.match(/^\s*(-?\d+(?:\.\d+)?)\s*([*\/])\s*(-?\d+(?:\.\d+)?)\s*([+\-])\s*(-?\d+(?:\.\d+)?)\s*$/);
  if(simple){
    const a=Number(simple[1]), op1=simple[2], b=Number(simple[3]), op2=simple[4], c=Number(simple[5]);
    const first=op1==='*'?a*b:a/b;
    const final=op2==='+'?first+c:first-c;
    const op1Label=op1==='*'?'×':'÷';
    return `Use order of operations: do multiplication/division first.\n1. ${a} ${op1Label} ${b} = ${Math.round(first*1e10)/1e10}\n2. ${Math.round(first*1e10)/1e10} ${op2} ${c} = ${Math.round(final*1e10)/1e10}\nAnswer: ${value}`;
  }
  return `Calculate using order of operations.\n${expr.replace(/\*\*/g,'^').replace(/\*/g,'×').replace(/\//g,'÷')} = ${value}`;
}

function neatNumber(value) {
  const n=Number(value);
  if(!Number.isFinite(n)) return String(value ?? '');
  return String(Math.round(n*1e10)/1e10);
}

function solveLinearEquation(message='') {
  const raw=clean(message,500)
    .toLowerCase()
    .replace(/[?]/g,'')
    .replace(/−/g,'-')
    .replace(/×/g,'*')
    .replace(/\s+/g,'');
  const hit=raw.match(/(?:solve|findx|what(?:is)?x[:=]?)?([+-]?(?:\d+(?:\.\d+)?)?)x([+-]\d+(?:\.\d+)?)?=([+-]?\d+(?:\.\d+)?)$/i);
  if(!hit) return null;
  let aText=hit[1];
  const a=(aText===''||aText==='+')?1:aText==='-'?-1:Number(aText);
  const b=hit[2]?Number(hit[2]):0;
  const rhs=Number(hit[3]);
  if(!Number.isFinite(a)||a===0||!Number.isFinite(b)||!Number.isFinite(rhs)) return null;
  const afterSubtract=rhs-b;
  const x=afterSubtract/a;
  const left=`${a===1?'':a===-1?'-':neatNumber(a)}x${b===0?'':b>0?` + ${neatNumber(b)}`:` - ${neatNumber(Math.abs(b))}`}`;
  const steps=[];
  steps.push(`${left} = ${neatNumber(rhs)}`);
  if(b!==0) steps.push(`${a===1?'x':a===-1?'-x':`${neatNumber(a)}x`} = ${neatNumber(afterSubtract)}  (${b>0?`subtract ${neatNumber(b)}`:`add ${neatNumber(Math.abs(b))}`} on both sides)`);
  if(a!==1) steps.push(`x = ${neatNumber(afterSubtract)} ÷ ${neatNumber(a)} = ${neatNumber(x)}`);
  else steps.push(`x = ${neatNumber(x)}`);
  return {value:x,text:`Solve it by keeping both sides balanced.\n${steps.map((step,i)=>`${i+1}. ${step}`).join('\n')}\nAnswer: x = ${neatNumber(x)}`};
}

function solvePercentage(message='') {
  const raw=clean(message,500).toLowerCase().replace(/,/g,'');
  const hit=raw.match(/(?:what(?:'s| is)?|find|calculate|work out)?\s*(-?\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(-?\d+(?:\.\d+)?)/i);
  if(!hit) return null;
  const pct=Number(hit[1]), amount=Number(hit[2]);
  if(!Number.isFinite(pct)||!Number.isFinite(amount)) return null;
  const decimal=pct/100, value=decimal*amount;
  return {value,text:`Convert the percentage to a decimal, then multiply.\n1. ${neatNumber(pct)}% = ${neatNumber(decimal)}\n2. ${neatNumber(decimal)} × ${neatNumber(amount)} = ${neatNumber(value)}\nAnswer: ${neatNumber(value)}`};
}

function directContextSolution(context) {
  const prompt=context.prompt||'';
  const hasAnswer=context.answer!==null && context.answer!==undefined && context.answer!=='';
  if(context.workedSolution) {
    const answer=hasAnswer?`\nAnswer: ${context.answer}`:'';
    return `Here is the worked solution:\n${context.workedSolution}${answer}`;
  }
  const linear=solveLinearEquation(prompt);
  if(linear && (!hasAnswer || answersMatch(linear.value,context.answer))) return linear.text;
  const percent=solvePercentage(prompt);
  if(percent && (!hasAnswer || answersMatch(percent.value,context.answer))) return percent.text;
  const arithmetic=safeArithmetic(prompt);
  if(arithmetic && (!hasAnswer || answersMatch(arithmetic.value,context.answer))) return arithmeticWorking(arithmetic);
  if(hasAnswer) return `Answer: ${context.answer}\nMethod: ${topicTip(context,prompt)}`;
  return '';
}

function priorAssistant(history=[]){
  return [...history].reverse().find(x=>x?.role==='assistant' && clean(x.text,1000))?.text || '';
}

function hintLevel(history=[]){
  return Math.max(0, history.filter(x=>x?.role==='user' && /hint|stuck|help|another/i.test(String(x.text||''))).length-1);
}

function contextualHint(context, history, message){
  const level=hintLevel(history);
  if(context.hints?.length) return context.hints[Math.min(level,context.hints.length-1)];
  // Never fall through to the stored worked solution for the current question.
  // Build progressively more specific strategy hints from the topic instead.
  const base=topicTip(context,message);
  if(level===0) return base;
  if(level===1) return `${base} Now write the first algebra/calculation line only—don’t try to do the whole problem in your head.`;
  return `${base} Compare your latest line with the question and check signs, operations and units before continuing.`;
}

function whyReply(context, history){
  const previous=priorAssistant(history);
  if(/subtract|add|divide|multiply|both sides|equation/i.test(previous)) return 'Because an equation is a balance. Doing the same operation to both sides keeps the equality true while moving you closer to isolating the unknown.';
  if(/denominator|fraction/i.test(previous)) return 'Because fractions can only be added or subtracted directly when they refer to equal-sized parts, which is why a common denominator matters.';
  if(/percentage|decimal/i.test(previous)) return 'Because a percentage means “out of 100”. Converting it to a decimal turns it into a multiplier you can use directly.';
  if(previous) return `Because that step uses the rule behind ${context.topic}. In other words: ${topicTip(context,previous)}`;
  return `Because ${topicTip(context)}`;
}

function chatReply(message){
  const m=clean(message,100).toLowerCase();
  const exact=SMALL_TALK.find(([key])=>m.startsWith(key));
  return exact?.[1] || 'I’m here. Send me the maths question or the step you’re unsure about.';
}

function messageLooksLikeCurrentQuestion(message='', prompt='') {
  const tokens=v=>clean(v,800).toLowerCase().replace(/[^a-z0-9+\-*/=.%π²³√]+/g,' ').split(/\s+/).filter(x=>x.length>1);
  const a=tokens(message), b=tokens(prompt); if(!a.length||b.length<2)return false;
  const set=new Set(a); const overlap=b.filter(x=>set.has(x)).length/Math.max(1,b.length);
  return overlap>=0.6 || clean(message,800).toLowerCase().includes(clean(prompt,800).toLowerCase());
}

function createStudyBotReply({ message = '', context = {}, history = [] } = {}) {
  const c = buildBotContext(context);
  const intent = detectBotIntent(message);
  const currentQuestionRequest=messageLooksLikeCurrentQuestion(message,c.prompt);

  if (!c.tutorAllowed || c.testMode) {
    return { intent: 'locked', text: 'The AI Helper is turned off for this assessment. I can help again when you return to normal practice.', suggestions: ['Open practice instead'] };
  }

  const arithmetic=safeArithmetic(message);
  const linear=solveLinearEquation(message);
  const percentage=solvePercentage(message);
  let text = '';
  if(arithmetic!==null && !currentQuestionRequest){
    text=arithmeticWorking(arithmetic);
  } else if(linear && !currentQuestionRequest){
    text=linear.text;
  } else if(percentage && !currentQuestionRequest){
    text=percentage.text;
  } else if (intent === 'welcome') {
    text = `I’m your MathsExpress AI Helper. Ask me about ${c.topic || 'maths'}, paste your working, or say “give me a hint”. I’ll respond to what you actually ask.`;
  } else if (intent === 'chat') {
    text = chatReply(message);
  } else if (intent === 'why') {
    text = whyReply(c,history);
  } else if (intent === 'hint') {
    const hint=contextualHint(c,history,message);
    const n=hintLevel(history)+1;
    text = `Hint ${n}: ${hint}${c.attempts >= 2 && c.workedSolution && n===1 ? ' Focus only on that next step before looking further.' : ''}`;
  } else if (intent === 'explain') {
    const base=topicTip(c,message);
    text = `${base}${c.prompt ? ` For the current question, start by identifying the part that matches that rule, then send me your first step.` : ''}`;
  } else if (intent === 'example') {
    text = simpleExample(c);
  } else if (intent === 'formula') {
    text = `For ${c.topic}: ${topicTip(c,message)}`;
  } else if (intent === 'check') {
    const proposed = answerFromMessage(message);
    if (!proposed) text = 'Send it like “My answer is 12” or paste your working, and I’ll check it.';
    else if (c.answer === null || c.answer === undefined || c.answer === '') text = `I can’t compare ${proposed} with a stored final answer here, but paste your working and I can check the method and likely mistakes.`;
    else if (answersMatch(proposed, c.answer)) text = `Yes — ${proposed} matches the expected answer. Nice. If you send your working, I can also check whether the method is clear.`;
    else text = `${proposed} doesn’t match the expected result yet. Don’t restart everything—check this next: ${contextualHint(c,history,message)}`;
  } else if (intent === 'recommend') {
    const weak = c.mistakes.find(x => x?.skill || x?.topic);
    text = weak ? `Your next useful practice is ${clean(weak.skill || weak.topic, 100)}. Do 5 easy questions, review any mistake, then try 5 medium questions.` : `A good next step is ${c.topic}. Do 5 easy questions, then 5 medium questions. Move to hard only when you can explain the method yourself.`;
  } else if (intent === 'answer') {
    if(!c.prompt) text='Send me the actual question and I’ll explain the method with you.';
    else text = `I won’t give away the final answer to the question you are working on. Next step: ${contextualHint(c,history,message)} Try that step and send me what you get.`;
  } else {
    const m=clean(message,400);
    if(/\?$/.test(m) || /\bwhat|how|why|when|which\b/i.test(m)) text=`For “${m}”: ${topicTip(c,m)}${c.prompt?` Your current question is ${c.prompt}`:''}`;
    else text=`I understand. For ${c.topic}, ${topicTip(c,m)} Tell me which step you’re on and I can be more specific.`;
  }

  const suggestions = intent === 'welcome' || intent === 'chat'
    ? ['Give me a hint', 'Explain this simply', 'Show a similar example', 'What should I practise next?']
    : intent==='hint'
      ? ['Another hint','Why?','Show a similar example','Check my answer']
      : ['Give me a hint', 'Explain this simply', 'Show a similar example', 'Check my answer'];

  return { intent, text: String(text ?? '').trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').slice(0, 1800), suggestions, historyLength: history.length };
}

return {buildBotContext,createStudyBotReply,detectBotIntent};
})();
// module: src/data/textbooks.js
__modules["src/data/textbooks.js"]=(()=>{
const {CURRICULUM, getCurriculumSkills}=__modules["src/data/curriculum.js"];
const {searchTaskLibrary, generateTaskQuestions}=__modules["src/data/task-library.js"];
const TEXTBOOK_DIFFICULTY_BANDS = Object.freeze([
  { id: 'foundation', label: 'Foundation', difficulty: 'easy', count: 10 },
  { id: 'developing', label: 'Developing', difficulty: 'easy', count: 15 },
  { id: 'core', label: 'Core', difficulty: 'medium', count: 15 },
  { id: 'advanced', label: 'Advanced', difficulty: 'hard', count: 10 },
  { id: 'extension', label: 'Extension', difficulty: 'hard', count: 15 },
]);

const SECTION_STAGES = Object.freeze([
  { id: 'concepts', label: 'Concepts & vocabulary', emphasis: 'Understand the language, notation and meaning before using a rule.' },
  { id: 'methods', label: 'Methods & fluency', emphasis: 'Develop a reliable method and show each step clearly.' },
  { id: 'applications', label: 'Applications & reasoning', emphasis: 'Choose a method, connect representations and justify why the answer is sensible.' },
]);

const SENIOR_FOCUS = Object.freeze({
  11: {
    Standard: ['Formulas and equations','Linear relationships','Earning money','Managing money','Applications of measurement','Time and location','Networks, paths and trees','Data analysis'],
    Advanced: ['Working with functions','Graph transformations','Trigonometry and measure of angles','Trigonometric identities and equations','Introduction to differentiation','Exponential and logarithmic functions','Probability and data'],
    'Extension 1': ['Further work with functions','Polynomials','Further trigonometry','Permutations and combinations','The binomial theorem'],
  },
  12: {
    'Standard 1': ['Algebraic relationships','Investment','Depreciation and loans','Right-angled triangles','Ratios and rates','Bivariate data analysis','Relative frequency and probability'],
    'Standard 2': ['Algebraic relationships','Investment and loans','Annuities','Trigonometry','Ratios and rates','Network flow','Critical path analysis','Bivariate data analysis','Relative frequency and probability','The normal distribution'],
    Advanced: ['Further graph transformations and modelling','Differential calculus','Integral calculus','Applications of calculus','Sequences and series','Random variables','Financial mathematics'],
    'Extension 1': ['Proof by mathematical induction','Introduction to vectors','Inverse trigonometric functions','Further calculus skills','Further applications of calculus','Binomial distributions and sampling distributions'],
    'Extension 2': ['The nature of proof','Further work with vectors','Introduction to complex numbers','Further integration','Applications of calculus to mechanics'],
  },
});

const FOCUS_GENERATORS = Object.freeze({
  'Formulas and equations':'linear-equation','Linear relationships':'linear-graph','Earning money':'finance-simple','Managing money':'finance-simple',
  'Applications of measurement':'measurement-composite','Time and location':'ratio-rate','Networks, paths and trees':'networks','Data analysis':'statistics-distribution',
  'Working with functions':'function-eval','Graph transformations':'function-eval','Trigonometry and measure of angles':'trig-function','Trigonometric identities and equations':'trig-function',
  'Introduction to differentiation':'calculus-diff','Exponential and logarithmic functions':'logarithm','Probability and data':'probability-compound',
  'Further work with functions':'function-eval','Polynomials':'polynomial','Further trigonometry':'trig-function','Permutations and combinations':'combinatorics','The binomial theorem':'combinatorics',
  'Algebraic relationships':'linear-graph','Investment':'finance-growth','Depreciation and loans':'finance-growth','Right-angled triangles':'trig-right','Ratios and rates':'ratio-rate',
  'Bivariate data analysis':'regression','Relative frequency and probability':'relative-frequency','Investment and loans':'finance-growth','Annuities':'finance-annuity','Trigonometry':'trig-right',
  'Network flow':'networks','Critical path analysis':'networks','The normal distribution':'distribution','Further graph transformations and modelling':'function-eval',
  'Differential calculus':'calculus-diff','Integral calculus':'calculus-int','Applications of calculus':'calculus-diff','Sequences and series':'sequence','Random variables':'distribution','Financial mathematics':'finance-annuity',
  'Proof by mathematical induction':'proof','Introduction to vectors':'vectors','Inverse trigonometric functions':'trig-function','Further calculus skills':'calculus-diff','Further applications of calculus':'calculus-int','Binomial distributions and sampling distributions':'distribution',
  'The nature of proof':'proof','Further work with vectors':'vectors','Introduction to complex numbers':'complex','Further integration':'calculus-int','Applications of calculus to mechanics':'vectors',
});

const VOCAB = Object.freeze({
  Number:['integer','rational','irrational','factor','multiple','estimate'],
  Algebra:['variable','coefficient','term','expression','equation','identity'],
  'Functions & Graphs':['function','domain','range','gradient','intercept','model'],
  'Measurement & Geometry':['length','area','volume','angle','scale','similarity'],
  Probability:['event','outcome','sample space','relative frequency','independent','conditional'],
  'Statistics & Data':['population','sample','distribution','median','spread','association'],
});

const RULES = Object.freeze({
  'linear-equation':'Keep an equation balanced: whatever operation is applied to one side must also be applied to the other.',
  simplify:'Only like terms can be combined. Keep the variable part unchanged and operate on the coefficients.',
  expand:'Multiply the factor outside a bracket by every term inside the bracket before collecting like terms.',
  'factor-common':'Factorising reverses expansion: identify the greatest common factor and place it outside a bracket.',
  substitution:'Replace each variable with its given value, then follow the order of operations.',
  indices:'For powers with the same base, multiplication adds exponents and division subtracts exponents.',
  'indices-advanced':'Negative and fractional indices describe reciprocals and roots; rewrite them before calculating when helpful.',
  surds:'Keep exact roots in surd form unless a decimal approximation is specifically requested.',
  'linear-graph':'For y = mx + b, m is the gradient and b is the vertical intercept.',
  gradient:'Gradient is change in y divided by change in x.',
  pythagoras:'In a right triangle, the square of the hypotenuse equals the sum of the squares of the shorter sides.',
  'trig-right':'Choose sine, cosine or tangent by matching the known and unknown sides relative to the angle.',
  probability:'Probability is favourable outcomes divided by total equally likely outcomes.',
  'probability-compound':'For independent successive events, multiply the relevant probabilities.',
  'statistics-centre':'Choose a summary statistic that matches the shape of the data and the question being asked.',
  'measurement-2d':'Write the correct formula first, substitute values with units, then calculate.',
  'measurement-3d':'Volume is measured in cubic units; identify the cross-section and relevant length before calculating.',
  'function-eval':'Function notation is an instruction: substitute the input into the rule and simplify carefully.',
  'calculus-diff':'A derivative describes instantaneous rate of change and the gradient of the tangent.',
  'calculus-int':'Integration accumulates change and can represent signed area under a curve.',
  vectors:'A vector has magnitude and direction and can be represented using components.',
  complex:'Complex numbers extend the real number system using i² = −1.',
  proof:'A proof must establish a statement for every case covered by its assumptions, not just a few examples.',
});

function slug(value) { return String(value).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function titleCase(value) { return String(value).replace(/\b\w/g,(c)=>c.toUpperCase()); }
function dedupe(values) { return [...new Set(values.filter(Boolean))]; }

function vocabularyFor(skill) {
  if(Number(skill.yearLevel)<4){
    const simple={
      Number:['number','count','more','less','equal','group'],
      Algebra:['pattern','rule','same','different','next'],
      'Functions & Graphs':['pattern','position','row','column','point'],
      'Measurement & Geometry':['length','shape','side','corner','turn','area'],
      Probability:['chance','certain','possible','impossible','outcome'],
      'Statistics & Data':['data','count','table','picture graph','most','least'],
    };
    return dedupe(simple[skill.strand]||['number','pattern','shape','compare']).slice(0,6);
  }
  return dedupe([...(VOCAB[skill.strand] || []), ...String(skill.topic).toLowerCase().split(/[^a-z]+/).filter((x)=>x.length>4)]).slice(0,8);
}

function explanationFor(skill, stage) {
  const subject = skill.title.toLowerCase();
  if(Number(skill.yearLevel)<4){
    if(stage.id==='concepts') return [
      `Today we are learning about ${subject}. Say what you notice before you start.`,
      `Use counters, blocks, drawings, a number line or your fingers when they help you see the maths.`,
      `Point, count or compare carefully. Then say your answer in a full sentence.`
    ];
    if(stage.id==='methods') return [
      `Try ${subject} in small steps. Do one part, check it, then do the next part.`,
      `Draw a picture or make a model if the numbers or shapes feel hard to see in your head.`,
      `Check by counting again, matching objects, or explaining how you know.`
    ];
    return [
      `Look for ${subject} in a short story, picture or everyday object.`,
      `Choose a simple way to show your thinking: objects, a drawing, marks, numbers or words.`,
      `Tell someone what your answer means and how you checked it.`
    ];
  }
  const rule = RULES[skill.generator] || `Start by identifying the quantities and relationships in the ${subject} problem, choose an appropriate representation, then check that the result fits the original conditions.`;
  if (stage.id === 'concepts') return [
    `${skill.title} is part of ${skill.topic}. The key idea is to understand what each symbol, quantity and representation means before performing any calculation.`,
    `${rule} Write units, labels and mathematical notation carefully so that each line of working communicates a clear idea.`,
    `A strong first check is to estimate what kind of answer is reasonable. This makes it easier to notice sign errors, incorrect substitutions or an unsuitable formula.`,
  ];
  if (stage.id === 'methods') return [
    `For ${subject}, build a repeatable method: identify the information, select a rule or representation, substitute or transform carefully, and simplify one step at a time.`,
    `${rule} Avoid skipping important algebraic or numerical steps when the method is new; visible working makes errors easier to diagnose.`,
    `After calculating, verify the result using substitution, an inverse operation, a graph, an estimate or a second method whenever possible.`,
  ];
  return [
    `Application questions rarely tell you exactly which method to use. Translate the context into mathematics, decide which information matters and explain why your chosen method is appropriate.`,
    `${rule} In harder problems, two or more ideas may need to be connected, so organise the work into smaller sub-problems.`,
    `Finish by interpreting the result in context. Include units, sensible rounding and a sentence explaining what the answer means when the question is applied or statistical.`,
  ];
}

function taskFor(skill, difficulty, count, type='practice', variant=1) {
  const pathwayText=String(skill.pathway || 'Core');
  const catalogPath = skill.curriculumPathway || (pathwayText.startsWith('Standard') ? 'Standard' : pathwayText.startsWith('Extension') ? 'Extension' : pathwayText === 'Advanced' ? 'Advanced' : (skill.pathway || 'all'));
  const tasks = searchTaskLibrary({ yearLevel:skill.yearLevel, pathway:catalogPath, skillId:skill.catalogSkillId || skill.id, difficulty, type, questionCount:count, limit:40 });
  if (!tasks.length) return null;
  return tasks[Math.max(0,Math.min(tasks.length-1,variant-1))];
}

function syntheticTask(skill, difficulty, count, type, seedLabel) {
  return {
    id:`tb:${skill.yearLevel}:${slug(skill.legacyPathway||skill.pathway||'core')}:${skill.id}:${type}:${difficulty}:${slug(seedLabel)}`,
    yearLevel:skill.yearLevel,pathway:skill.pathway||'Core',strand:skill.strand,topic:skill.topic,skill:skill.title,skillId:skill.id,
    lessonId:skill.id,generator:skill.generator,type,typeLabel:titleCase(type),difficulty,questionCount:count,variant:1,variantLabel:seedLabel,
    title:`${skill.title} · ${titleCase(difficulty)} ${titleCase(type)}`,learningGoal:skill.learningGoal,
  };
}

function buildWorkedExamples(skill) {
  return ['easy','medium','hard'].map((difficulty,index)=>{
    const task = taskFor(skill,difficulty,5,'lesson',index+1) || syntheticTask(skill,difficulty,5,'lesson',`Example ${index+1}`);
    const q = generateTaskQuestions(task,1)[0];
    return { label:index===0?'Worked example':index===1?'Worked example — core':'Worked example — challenge', difficulty, prompt:q?.prompt||`Apply ${skill.title.toLowerCase()} to a representative problem.`, solution:q?.workedSolution||'Choose a suitable method, show each step, and check the result.', hint:q?.hints?.[0]||'Identify what is known and what must be found.' };
  });
}

function textbookBandsFor(skill) {
  const pathway=String(skill.pathway||'Core');
  if(pathway==='Extended'||pathway==='Extension') return [
    { id:'developing',label:'Developing',difficulty:'medium',count:10 },
    { id:'core',label:'Core',difficulty:'medium',count:15 },
    { id:'advanced',label:'Advanced',difficulty:'hard',count:15 },
    { id:'extension',label:'Extension',difficulty:'hard',count:20 },
    { id:'challenge',label:'Challenge',difficulty:'hard',count:25 },
  ];
  if(pathway==='Advanced') return [
    { id:'foundation',label:'Foundation',difficulty:'easy',count:10 },
    { id:'core',label:'Core',difficulty:'medium',count:15 },
    { id:'advanced',label:'Advanced',difficulty:'hard',count:15 },
    { id:'extension',label:'Extension',difficulty:'hard',count:15 },
    { id:'challenge',label:'Challenge',difficulty:'hard',count:20 },
  ];
  return TEXTBOOK_DIFFICULTY_BANDS;
}
function buildExercises(skill, stageIndex) {
  return textbookBandsFor(skill).map((band,index)=>{
    const variant = ((stageIndex + index) % 8) + 1;
    const task = taskFor(skill,band.difficulty,band.count,'practice',variant) || syntheticTask(skill,band.difficulty,band.count,'practice',`${band.label}-${stageIndex+1}`);
    return { ...band, taskId:task.id, title:`Exercise ${String.fromCharCode(65+index)} — ${band.label}`, estimatedMinutes:Math.max(8,Math.round(band.count*(band.difficulty==='hard'?2.2:band.difficulty==='medium'?1.6:1.1))), sampleQuestions:generateTaskQuestions(task,3) };
  });
}

function makeSection(skill, chapter, sectionIndex, stage, ordinal) {
  const idPath=skill.legacyPathway||skill.pathway||'Core';
  const id=`tb-y${skill.yearLevel}-${slug(idPath)}-${skill.id}-${stage.id}`;
  const curriculumPathway=skill.curriculumPathway||skill.pathway||'all';
  const prereqSkills=getCurriculumSkills({yearLevel:skill.yearLevel,pathway:curriculumPathway}).filter((x)=>x.id!==skill.id).slice(Math.max(0,ordinal-2),ordinal).map((x)=>x.title);
  // IMPORTANT: Textbook practice is intentionally lazy. Older builds generated every
  // worked example and exercise set for every K–12 section while the page was loading,
  // which could lock Chrome for a long time. Only generate the heavy question content
  // when a student actually opens that section.
  let workedExamplesCache=null;
  let exercisesCache=null;
  let checkpointTaskIdCache=null;
  let reviewTaskIdCache=null;
  let challengeTaskIdCache=null;
  const section={
    id,yearLevel:skill.yearLevel,pathway:skill.pathway||'Core',strand:skill.strand,topic:skill.topic,skillId:skill.id,generator:skill.generator,
    chapterId:chapter.id,chapterTitle:chapter.title,sectionNumber:`${chapter.number}.${sectionIndex+1}`,title:`${skill.title} — ${stage.label}`,
    shortTitle:skill.title,stage:stage.id,stageLabel:stage.label,learningGoal:skill.learningGoal,
    learningIntentions:Number(skill.yearLevel)<4?[`I can learn one new idea about ${skill.title.toLowerCase()}.`,'I can show my thinking with objects, drawings, numbers or words.','I can check my answer by trying it again.']:[skill.learningGoal,stage.emphasis,'Use correct mathematical language and check whether the result is reasonable.'],
    prerequisites:Number(skill.yearLevel)<4?(prereqSkills.length?prereqSkills.slice(-1):['Counting, matching, drawing and talking about your thinking']):(prereqSkills.length?prereqSkills:['Core number facts and careful use of mathematical notation']),
    vocabulary:vocabularyFor(skill),keyRule:Number(skill.yearLevel)<4?'Show the maths in a way you can see, do one small step at a time, and check it again.':(RULES[skill.generator]||`Represent the information clearly, select a suitable method, calculate accurately and check the result.`),
    explanation:explanationFor(skill,stage),
    commonMistakes:Number(skill.yearLevel)<4?[`Counting too fast and missing or counting an object twice.`,`Changing the order of objects without checking the total again.`,`Giving an answer without showing how you know.`]:[`Starting calculations before identifying what the question is asking.`,`Skipping a sign, unit or bracket when rewriting the problem.`,`Giving a numerical result without checking whether it is reasonable.`],
  };
  Object.defineProperties(section,{
    workedExamples:{enumerable:true,get(){return workedExamplesCache ??= buildWorkedExamples(skill);}},
    exercises:{enumerable:true,get(){return exercisesCache ??= buildExercises(skill,ordinal+sectionIndex);}},
    checkpointTaskId:{enumerable:true,get(){return checkpointTaskIdCache ??= (taskFor(skill,'medium',10,'test',1)||syntheticTask(skill,'medium',10,'test','Checkpoint')).id;}},
    reviewTaskId:{enumerable:true,get(){return reviewTaskIdCache ??= (taskFor(skill,'medium',20,'revision',2)||syntheticTask(skill,'medium',20,'revision','Review')).id;}},
    challengeTaskId:{enumerable:true,get(){return challengeTaskIdCache ??= (taskFor(skill,'hard',10,'practice',8)||syntheticTask(skill,'hard',10,'practice','Challenge')).id;}},
  });
  return Object.freeze(section);
}

function finaliseChapter(chapter,chapterSkills=[]) {
  let topicTestTaskIdCache=null;
  Object.defineProperty(chapter,'topicTestTaskId',{enumerable:true,get(){
    if(topicTestTaskIdCache!==null)return topicTestTaskIdCache;
    for(const skill of chapterSkills){const task=taskFor(skill,'medium',15,'test',7);if(task){topicTestTaskIdCache=task.id;return topicTestTaskIdCache;}}
    topicTestTaskIdCache='';return topicTestTaskIdCache;
  }});
  return Object.freeze(chapter);
}
function mathsExpressBookTitle(yearLevel,pathway='Core') {
  const yearLabel=yearLevel===0?'K':String(yearLevel);
  const suffix=yearLevel<=6?'':` – ${pathway}`;
  return `MathsExpress Mathematics ${yearLabel}${suffix}`;
}
function pathwayLearningGoal(skill,pathway) {
  if(pathway==='Extended'||pathway==='Extension') return `${skill.learningGoal} Extend the method to unfamiliar, multi-step and reasoning-rich problems.`;
  if(pathway==='Advanced') return `${skill.learningGoal} Connect representations and justify methods in more demanding applications.`;
  return skill.learningGoal;
}
function k10Books() {
  const books=[];
  for (const yearLevel of [0,1,2,3,4,5,6,7,8,9,10]) {
    // Cambridge NSW-style catalogue labels for the school-facing textbook browser.
    // Years 7–10 now display Core / Advanced / Extension. We keep the previous
    // internal Core/Advanced/Extended IDs so existing student progress is not reset.
    const pathways=yearLevel<=6?['Core']:['Core','Advanced','Extension'];
    const baseSkills=getCurriculumSkills({yearLevel});
    for(const pathway of pathways){
      const legacyPathway=pathway==='Extension'?'Extended':pathway;
      const mappedSkills=baseSkills.map((base)=>({...base,catalogSkillId:base.id,pathway,legacyPathway,curriculumPathway:'all',learningGoal:pathwayLearningGoal(base,pathway)}));
      const topicOrder=dedupe(mappedSkills.map((skill)=>skill.topic));
      const chapters=topicOrder.map((topic,i)=>{
        const chapterSkills=mappedSkills.filter((skill)=>skill.topic===topic);
        const chapterIdPath=slug(legacyPathway);
        const chapter={id:`tb-y${yearLevel}-${chapterIdPath}-${slug(topic)}`,number:i+1,title:topic,yearLevel,pathway,strand:chapterSkills[0]?.strand||'Mathematics',sections:[]};
        chapter.sections=chapterSkills.flatMap((skill,skillIndex)=>SECTION_STAGES.map((stage,stageIndex)=>makeSection(skill,chapter,skillIndex*SECTION_STAGES.length+stageIndex,stage,mappedSkills.indexOf(skill))));
        return finaliseChapter(chapter,chapterSkills);
      });
      const id=yearLevel<=6?`tb-y${yearLevel}-core`:`tb-y${yearLevel}-${slug(legacyPathway)}`;
      const legacyIds=yearLevel<=6?[id]:(pathway==='Core'?[id,`tb-y${yearLevel}-standard`]:pathway==='Extension'?[id,`tb-y${yearLevel}-extension`]:[id]);
      const subtitle=yearLevel<=6?'K–6 core mathematics catalogue':`${pathway} pathway · linked textbook practice and assessment`;
      books.push(Object.freeze({id,legacyIds,yearLevel,pathway,title:mathsExpressBookTitle(yearLevel,pathway),subtitle,contentSource:'MathsExpress-generated linked practice',chapters:Object.freeze(chapters)}));
    }
  }
  return books;
}

function nearestSkill(yearLevel,pathway,focus,index) {
  const generator=FOCUS_GENERATORS[focus]||'modelling';
  const pathForCurriculum=pathway.startsWith('Standard')?'Standard':pathway.startsWith('Extension')?'Extension':pathway;
  const candidates=getCurriculumSkills({yearLevel,pathway:pathForCurriculum});
  return candidates.find((s)=>s.generator===generator) || candidates[index%candidates.length] || CURRICULUM.find((s)=>s.yearLevel===yearLevel) || CURRICULUM[0];
}
function seniorPathwayPlan(yearLevel,pathway){
  const source=SENIOR_FOCUS[yearLevel]||{};
  if(pathway==='Standard'){
    if(yearLevel===11)return (source.Standard||[]).map(focus=>({focus,legacyPathway:'Standard'}));
    return dedupe([...(source['Standard 2']||[]),...(source['Standard 1']||[])]).map(focus=>({focus,legacyPathway:(source['Standard 2']||[]).includes(focus)?'Standard 2':'Standard 1'}));
  }
  if(pathway==='Advanced')return (source.Advanced||[]).map(focus=>({focus,legacyPathway:'Advanced'}));
  if(yearLevel===11)return (source['Extension 1']||[]).map(focus=>({focus,legacyPathway:'Extension 1'}));
  return dedupe([...(source['Extension 1']||[]),...(source['Extension 2']||[])]).map(focus=>({focus,legacyPathway:(source['Extension 1']||[]).includes(focus)?'Extension 1':'Extension 2'}));
}
function seniorBookIds(yearLevel,pathway){
  if(pathway==='Standard')return yearLevel===11?['tb-y11-standard']:['tb-y12-standard-2','tb-y12-standard-1'];
  if(pathway==='Advanced')return [`tb-y${yearLevel}-advanced`];
  return yearLevel===11?['tb-y11-extension-1']:['tb-y12-extension-1','tb-y12-extension-2'];
}
function seniorBooks() {
  const books=[];
  for(const yearLevel of [11,12]){
    for(const pathway of ['Standard','Advanced','Extension']){
      const plan=seniorPathwayPlan(yearLevel,pathway);
      const chapters=plan.map(({focus,legacyPathway},i)=>{
        const base=nearestSkill(yearLevel,pathway,focus,i);
        const skill={...base,catalogSkillId:base.id,id:`${slug(legacyPathway)}-${slug(focus)}`,title:focus,topic:focus,pathway,legacyPathway,curriculumPathway:pathway==='Extension'?'Extension':pathway,generator:FOCUS_GENERATORS[focus]||base.generator,learningGoal:pathwayLearningGoal({...base,learningGoal:`Develop fluency and reasoning in ${focus.toLowerCase()} and apply the ideas to unfamiliar problems.`},pathway)};
        const chapter={id:`tb-y${yearLevel}-${slug(legacyPathway)}-${slug(focus)}`,number:i+1,title:focus,yearLevel,pathway,strand:base.strand,sections:[]};
        chapter.sections=SECTION_STAGES.map((stage,stageIndex)=>makeSection(skill,chapter,stageIndex,stage,i));
        return finaliseChapter(chapter,[skill]);
      });
      const ids=seniorBookIds(yearLevel,pathway);
      books.push(Object.freeze({id:ids[0],legacyIds:ids,yearLevel,pathway,title:mathsExpressBookTitle(yearLevel,pathway),subtitle:`Original MathsExpress Year ${yearLevel} ${pathway} pathway`,contentSource:'Original MathsExpress content',chapters:Object.freeze(chapters)}));
    }
  }
  return books;
}
const TEXTBOOK_BOOKS = Object.freeze([...k10Books(),...seniorBooks()]);
const TEXTBOOK_CHAPTERS = Object.freeze(TEXTBOOK_BOOKS.flatMap((book)=>book.chapters));
const TEXTBOOK_SECTIONS = Object.freeze(TEXTBOOK_CHAPTERS.flatMap((chapter)=>chapter.sections));
const TEXTBOOK_SECTION_COUNT = TEXTBOOK_SECTIONS.length;
const TEXTBOOK_CHAPTER_COUNT = TEXTBOOK_CHAPTERS.length;
const TEXTBOOK_EXERCISE_SET_COUNT = TEXTBOOK_SECTION_COUNT * TEXTBOOK_DIFFICULTY_BANDS.length;
function getTextbookBooks({yearLevel=null,pathway='all'}={}) {
  const y=yearLevel===null||yearLevel==='all'||yearLevel===''?null:Number(yearLevel);
  return TEXTBOOK_BOOKS.filter((book)=>(y===null||book.yearLevel===y)&&(pathway==='all'||book.pathway===pathway));
}
function getTextbookBook(id) { const value=String(id||''); return TEXTBOOK_BOOKS.find((book)=>book.id===value||(book.legacyIds||[]).includes(value))||null; }
function getTextbookChapter(id) { return TEXTBOOK_CHAPTERS.find((chapter)=>chapter.id===String(id))||null; }
function getTextbookSection(id) { return TEXTBOOK_SECTIONS.find((section)=>section.id===String(id))||null; }
function searchTextbookSeries(query,{yearLevel=null,pathway='all',limit=120}={}) {
  const q=String(query||'').trim().toLowerCase();
  const y=yearLevel===null||yearLevel==='all'||yearLevel===''?null:Number(yearLevel);
  return TEXTBOOK_SECTIONS.filter((section)=>{
    if(y!==null&&section.yearLevel!==y)return false;
    if(pathway!=='all'&&section.pathway!==pathway)return false;
    if(!q)return true;
    return `${section.title} ${section.chapterTitle} ${section.strand} ${section.topic} ${section.pathway} ${section.vocabulary.join(' ')}`.toLowerCase().includes(q);
  }).slice(0,Math.max(1,Math.min(500,Number(limit)||120)));
}
function textbookStats() {
  // Do not touch section.exercises here: exercises are lazy getters and materialising
  // them for every K–12 section freezes the browser when Textbook opens.
  const questionsPerSection=TEXTBOOK_DIFFICULTY_BANDS.reduce((sum,band)=>sum+Number(band.count||0),0);
  return {books:TEXTBOOK_BOOKS.length,chapters:TEXTBOOK_CHAPTER_COUNT,sections:TEXTBOOK_SECTION_COUNT,exerciseSets:TEXTBOOK_EXERCISE_SET_COUNT,practiceQuestions:TEXTBOOK_SECTION_COUNT*questionsPerSection};
}

return {TEXTBOOK_DIFFICULTY_BANDS,TEXTBOOK_BOOKS,TEXTBOOK_CHAPTERS,TEXTBOOK_SECTIONS,TEXTBOOK_SECTION_COUNT,TEXTBOOK_CHAPTER_COUNT,TEXTBOOK_EXERCISE_SET_COUNT,getTextbookBooks,getTextbookBook,getTextbookChapter,getTextbookSection,searchTextbookSeries,textbookStats};
})();
// module: src/core/complete-suite.js
__modules["src/core/complete-suite.js"]=(()=>{
const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number(n)||0));
const text=(v,max=240)=>String(v??'').trim().replace(/\s+/g,' ').slice(0,max);
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
function scoreDiagnostic(attempts=[],yearLevel=9){
  const rows=attempts.filter(Boolean); const bySkill=new Map();
  for(const a of rows){const id=text(a.skillId||a.skill||'general',80);const r=bySkill.get(id)||{id,correct:0,total:0,strand:text(a.strand||'General',60)};r.total++;if(a.correct)r.correct++;bySkill.set(id,r);}
  const skills=[...bySkill.values()].map(r=>({...r,accuracy:r.total?r.correct/r.total:0}));
  const weakSkills=skills.filter(r=>r.accuracy<0.6).sort((a,b)=>a.accuracy-b.accuracy).map(r=>r.id);
  const strongSkills=skills.filter(r=>r.accuracy>=0.8).map(r=>r.id);
  const accuracy=rows.length?rows.filter(r=>r.correct).length/rows.length:0;
  return {yearLevel:clamp(yearLevel,0,12),accuracy,weakSkills,strongSkills,recommendedDifficulty:accuracy>=.85?'hard':accuracy>=.55?'medium':'easy',skills};
}
function buildLearningPath({skills=[]}={}){
  const map=new Map(skills.map(s=>[s.id,{...s,mastery:clamp(s.mastery,0,100),prerequisites:Array.isArray(s.prerequisites)?s.prerequisites:[]}]))
  const eligible=[]; const blocked=[];
  for(const s of map.values()){
    const prereqReady=s.prerequisites.every(id=>(map.get(id)?.mastery??100)>=60);
    if(s.mastery>=80) continue;
    (prereqReady?eligible:blocked).push({...s,reason:prereqReady?'ready':'prerequisite-gap'});
  }
  return [...eligible.sort((a,b)=>a.mastery-b.mastery),...blocked.sort((a,b)=>a.mastery-b.mastery)];
}
function scheduleSpacedReview(start=new Date(),count=6){
  const base=new Date(start); if(Number.isNaN(base.getTime()))return[]; const gaps=[1,3,7,14,30,60,90,180];
  return Array.from({length:Math.max(1,Math.min(8,Number(count)||6))},(_,i)=>{const d=new Date(base);d.setUTCDate(d.getUTCDate()+gaps[i]);return d;});
}
function predictMastery({mastery=0,recent=[],daysSincePractice=0}={}){
  const accuracy=recent.length?recent.filter(Boolean).length/recent.length:.5;
  const decay=Math.min(18,Math.max(0,Number(daysSincePractice)||0)*.75);
  return Math.round(clamp(Number(mastery)+(accuracy-.5)*24-decay,0,100));
}
function buildRubric(parts=[]){
  const rows=parts.map((p,i)=>({part:text(p.part||String.fromCharCode(97+i),8),marks:Math.max(0,Math.floor(Number(p.marks)||0)),criteria:text(p.criteria||'accuracy',120)}));
  return {parts:rows,totalMarks:rows.reduce((n,p)=>n+p.marks,0)};
}
function buildExamVersions(questions=[],versionCount=4,seed='mathsexpress'){
  const labels=['A','B','C','D','E','F'].slice(0,Math.max(1,Math.min(6,Number(versionCount)||4)));
  const out={};
  labels.forEach((label,vi)=>{const rotated=[...questions].sort((a,b)=>(hash(`${seed}:${label}:${a.id}`)-hash(`${seed}:${label}:${b.id}`)));out[label]={label,questions:rotated.map((q,i)=>({...q,variantSeed:hash(`${seed}:${label}:${q.id}:${i}`)})),totalMarks:rotated.reduce((n,q)=>n+(Number(q.marks)||1),0)};});
  return out;
}
function markWorkedResponse(response={},scheme={}){
  const steps=Array.isArray(response.steps)?response.steps.map(x=>String(x).replace(/\s+/g,'')):[];
  const expected=String(scheme.expectedAnswer??'').replace(/\s+/g,'').toLowerCase();
  const actual=String(response.finalAnswer??'').replace(/\s+/g,'').toLowerCase();
  const correct=expected!==''&&actual===expected;
  const patterns=(scheme.methodPatterns||[]).map(x=>String(x).replace(/\s+/g,''));
  const methodHit=patterns.length?patterns.some(p=>steps.some(s=>s.includes(p))):steps.length>0;
  const marks=scheme.marks||{}; let awarded=0;
  if(methodHit)awarded+=Number(marks.method)||0;
  if(correct)awarded+=Number(marks.accuracy)||0;
  if((correct||methodHit)&&steps.length)awarded+=Number(marks.followThrough)||0;
  return {correct,methodHit,awarded,maxMarks:(Number(marks.method)||0)+(Number(marks.accuracy)||0)+(Number(marks.followThrough)||0),feedback:correct?'Correct final answer with working checked.':methodHit?'Your method has useful progress. Check the final arithmetic/algebra.':'Show the method you used so method marks can be awarded.'};
}
function buildAttendanceRegister(students=[],date=new Date().toISOString().slice(0,10)){
  return {date:text(date,20),rows:students.map(s=>({studentId:s.id||s.user_id,name:text(s.name||s.display_name||'Student',80),status:'present',note:''}))};
}
function buildSeatingPlan(students=[],columns=5){const c=Math.max(1,Math.min(12,Number(columns)||5));return students.map((s,i)=>({studentId:s.id||s.user_id,name:text(s.name||s.display_name||'Student',80),row:Math.floor(i/c)+1,column:(i%c)+1}));}
function buildTimetable(items=[]){const dayOrder=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];return [...items].map(x=>({...x,day:text(x.day,20),period:Math.max(1,Number(x.period)||1)})).sort((a,b)=>dayOrder.indexOf(a.day)-dayOrder.indexOf(b.day)||a.period-b.period);}
function buildTournamentBracket(entries=[]){
  const names=entries.map(x=>typeof x==='string'?x:text(x.name||x.id||'Player',80)); if(!names.length)return{rounds:[]};
  const size=2**Math.ceil(Math.log2(Math.max(2,names.length))); while(names.length<size)names.push('BYE');
  const matches=[]; for(let i=0;i<names.length;i+=2)matches.push({id:`r1m${i/2+1}`,a:names[i],b:names[i+1],winner:names[i+1]==='BYE'?names[i]:names[i]==='BYE'?names[i+1]:null});
  const rounds=[{number:1,matches}]; let n=size/2,round=2; while(n>1){const m=[];for(let i=0;i<n;i+=2)m.push({id:`r${round}m${i/2+1}`,a:null,b:null,winner:null});rounds.push({number:round,matches:m});n/=2;round++;}
  return {rounds};
}
function inspectChallengeIntegrity({answerTimesMs=[],accuracy=0,tabLeaves=0,pasteEvents=0}={}){
  const times=answerTimesMs.map(Number).filter(Number.isFinite); const avg=times.length?times.reduce((a,b)=>a+b,0)/times.length:0; const reasons=[];
  if(times.length>=3&&avg<350)reasons.push('answers-too-fast'); if(Number(tabLeaves)>0)reasons.push('tab-left'); if(Number(pasteEvents)>0)reasons.push('pasted-content'); if(Number(accuracy)>=.98&&times.length>=5&&avg<700)reasons.push('perfect-speed-pattern');
  return {flagged:reasons.length>0,reasons,averageAnswerMs:Math.round(avg)};
}
function createStudySession({minutes=25,breakMinutes=5,cycles=4}={}){return{studySeconds:Math.max(60,Math.floor(Number(minutes)||25)*60),breakSeconds:Math.max(60,Math.floor(Number(breakMinutes)||5)*60),cycles:Math.max(1,Math.min(12,Math.floor(Number(cycles)||4))),status:'ready'};}
function confidenceAccuracySummary(attempts=[]){let over=0,under=0,calibrated=0;for(const a of attempts){const c=clamp(a.confidence,1,5);if(!a.correct&&c>=4)over++;else if(a.correct&&c<=2)under++;else calibrated++;}return{overconfident:over,underconfident:under,calibrated,total:attempts.length};}
function classifyMathError({expected='',actual='',working=''}={}){const e=String(expected).trim(),a=String(actual).trim(),w=String(working);if(e&&a&&e.replace('-','')===a.replace('-','')&&e!==a)return'sign-error';if(/[+\-*/]\s*$/.test(w))return'incomplete-method';if(/formula|sin|cos|tan|area|volume/i.test(w)&&a!==e)return'formula-error';if(/[a-z]/i.test(w)&&a!==e)return'algebra-error';return a===e?'none':'arithmetic-or-concept';}
function buildRevisionChecklist(topics=[]){return topics.map((topic,i)=>({id:`rev-${i+1}`,topic:text(topic,100),done:false,confidence:3}));}
function createFlashcards(rows=[]){return rows.map((r,i)=>({id:`card-${i+1}`,term:text(r.term,100),definition:text(r.definition,300),mastered:false})).filter(x=>x.term);}
function buildFormulaSheet(rows=[]){return rows.map(r=>`${text(r.topic,80)}: ${text(r.formula,160)}`).join('\n');}

const UNIT_FACTORS={mm:.001,cm:.01,m:1,km:1000,mg:.000001,g:.001,kg:1,ml:.001,l:1};
function convertUnit(value,from,to){const f=UNIT_FACTORS[String(from).toLowerCase()],t=UNIT_FACTORS[String(to).toLowerCase()];if(!f||!t)return{ok:false,value:null};return{ok:true,value:Number(value)*f/t,from,to};}
function rearrangeFormula(formula,target){const f=String(formula).replace(/\s/g,''),t=String(target).trim();const known={
  'v=d/t:d':'d = v × t','v=d/t:t':'t = d ÷ v','v=d/t:v':'v = d ÷ t',
  'a=v/t:v':'v = a × t','a=v/t:t':'t = v ÷ a','f=ma:m':'m = F ÷ a','f=ma:a':'a = F ÷ m',
  'p=mv:m':'m = p ÷ v','p=mv:v':'v = p ÷ m','a=πr^2:r':'r = √(A ÷ π)'
};return known[`${f.toLowerCase()}:${t.toLowerCase()}`]||`${t} = rearrange(${formula})`;}
function buildParentWeeklySummary({name='Student',completed=0,assigned=0,mastery=0,minutes=0,comments=''}={}){const textOut=`${name} completed ${completed} of ${assigned} assigned tasks, reached ${Math.round(mastery)}% mastery and studied for ${Math.round(minutes)} minutes this week.${comments?` Teacher note: ${comments}`:''}`;return{text:textOut,completed,assigned,mastery:clamp(mastery,0,100),minutes:Math.max(0,Number(minutes)||0)};}
function duplicateAssignment(a={}){return{...a,id:`copy-${Date.now()}-${hash(JSON.stringify(a))}`,title:`${text(a.title||'Assignment',100)} Copy`,copiedFrom:a.id||null,createdAt:new Date().toISOString()};}
function createResourceVersion(resource={},version=1,changeNote=''){return{resourceId:resource.id||null,title:text(resource.title||'Resource',120),version:Math.max(1,Math.floor(Number(version)||1)),changeNote:text(changeNote,300),snapshot:JSON.parse(JSON.stringify(resource)),createdAt:new Date().toISOString()};}
function searchResourceLibrary(resources=[],query=''){const q=String(query).toLowerCase().trim();return [...resources].filter(r=>!q||String(r.title||'').toLowerCase().includes(q)||(r.tags||[]).some(t=>String(t).toLowerCase().includes(q))).sort((a,b)=>(Number(b.rating)||0)-(Number(a.rating)||0));}
function buildFeatureRollout({feature='',schools=[],beta=false,percent=100,startAt=null}={}){return{feature:text(feature,100),schools:[...new Set(schools.map(String))],beta:Boolean(beta),percent:clamp(percent,0,100),startAt:startAt||new Date().toISOString(),status:'configured'};}
function buildStatusSnapshot(services={}){const rows=Object.entries(services).map(([name,ok])=>({name,ok:Boolean(ok)}));const down=rows.filter(x=>!x.ok);return{overall:down.length===0?'operational':down.length===rows.length?'outage':'degraded',services:rows,checkedAt:new Date().toISOString()};}
function buildDataRetentionPlan({studentWorkDays=730,auditDays=2555,feedbackDays=730,deletedRecoveryDays=30}={}){return{studentWorkDays:clamp(studentWorkDays,30,3650),auditDays:clamp(auditDays,30,3650),feedbackDays:clamp(feedbackDays,30,3650),deletedRecoveryDays:clamp(deletedRecoveryDays,1,90)};}
function buildDemoSchool(name='MathsExpress Demo School'){const classes=[0,1,2,3,4,5,6,7,8,9,10,11,12].map(y=>({id:`demo-y${y}`,name:`${y===0?'Kindergarten':`Year ${y}`} Mathematics`,yearLevel:y,students:Array.from({length:8},(_,i)=>({id:`y${y}s${i+1}`,name:`Demo Student ${i+1}`,mastery:35+((i*9+y)%55)}))}));return{name:text(name,100),classes,staff:[{name:'Demo Principal',role:'principal'},{name:'Demo Head Teacher',role:'head_teacher'},{name:'Demo Teacher',role:'teacher'}]};}
function buildLessonPlan({topic='Mathematics',minutes=50,yearLevel=9,objective='',resources=[]}={}){const m=Math.max(20,Math.min(120,Number(minutes)||50));return{topic:text(topic,120),yearLevel:clamp(yearLevel,0,12),objective:text(objective||`Understand and apply ${topic}`,240),segments:[{name:'Do Now',minutes:Math.round(m*.1)},{name:'Explicit teaching',minutes:Math.round(m*.25)},{name:'Worked examples',minutes:Math.round(m*.2)},{name:'Guided practice',minutes:Math.round(m*.2)},{name:'Independent practice',minutes:Math.round(m*.2)},{name:'Exit ticket',minutes:Math.max(3,m-Math.round(m*.95))}],resources};}
function buildTermPlan(topics=[],weeks=10){return Array.from({length:Math.max(1,Math.min(20,Number(weeks)||10))},(_,i)=>({week:i+1,topic:text(topics[i%Math.max(1,topics.length)]||'Revision / assessment',120),status:'planned'}));}
function curriculumCoverage(outcomes=[],completedIds=[]){const done=new Set(completedIds);const rows=outcomes.map(o=>({...o,covered:done.has(o.id)}));return{rows,covered:rows.filter(x=>x.covered).length,total:rows.length,percent:rows.length?Math.round(rows.filter(x=>x.covered).length/rows.length*100):0};}
function buildMarkingScheme(parts=[]){return buildRubric(parts).parts.map(p=>({...p,methodMarks:Math.max(0,p.marks-1),accuracyMarks:p.marks?1:0}));}
function buildExamPaper({title='Mathematics Examination',timeMinutes=60,readingMinutes=5,questions=[]}={}){return{title:text(title,120),timeMinutes:clamp(timeMinutes,10,240),readingMinutes:clamp(readingMinutes,0,30),questions,totalMarks:questions.reduce((n,q)=>n+(Number(q.marks)||1),0),instructions:['Write your answers clearly.','Show working where marks are allocated for method.','Check your answers if time permits.']};}
function buildMultiPartQuestion({stem='',parts=[]}={}){return{stem:text(stem,500),parts:parts.map((p,i)=>({label:p.label||String.fromCharCode(97+i),prompt:text(p.prompt,500),marks:Math.max(1,Number(p.marks)||1),dependsOn:p.dependsOn||null}))};}
function progressiveHints(hints=[]){return hints.map((h,i)=>({level:i+1,text:text(h,400),penalty:i*5}));}
function buildHouseStandings(houses=[]){return [...houses].map(h=>({name:text(h.name,60),points:Math.max(0,Number(h.points)||0)})).sort((a,b)=>b.points-a.points);}
function buildMeritRecord({studentId,points=1,reason='Positive learning behaviour'}={}){return{id:`merit-${Date.now()}`,studentId,points:clamp(points,1,20),reason:text(reason,160),createdAt:new Date().toISOString()};}
function buildLateWork(assignments=[],now=new Date()){const t=new Date(now).getTime();return assignments.filter(a=>a.status!=='completed'&&a.dueAt&&new Date(a.dueAt).getTime()<t).map(a=>({...a,overdue:true}));}
function buildTeacherReminders({lateWork=[],unmarked=0,upcoming=[]}={}){const out=[];if(lateWork.length)out.push(`${lateWork.length} overdue task${lateWork.length===1?'':'s'}`);if(unmarked)out.push(`${unmarked} response${unmarked===1?'':'s'} awaiting marking`);if(upcoming.length)out.push(`${upcoming.length} upcoming assessment${upcoming.length===1?'':'s'}`);return out;}
function createNotebookPage({title='Maths Notes',body='',tags=[]}={}){return{id:`note-${Date.now()}`,title:text(title,100),body:String(body).slice(0,12000),tags:tags.map(x=>text(x,40)).slice(0,20),updatedAt:new Date().toISOString()};}
function searchEverything({resources=[],notes=[],tasks=[],students=[]}={},query=''){const q=String(query).toLowerCase().trim();const rows=[];for(const [type,list] of Object.entries({resource:resources,note:notes,task:tasks,student:students})){for(const item of list){const hay=JSON.stringify(item).toLowerCase();if(!q||hay.includes(q))rows.push({type,item});}}return rows.slice(0,100);}
function buildDashboardLayout(widgets=[]){return widgets.map((w,i)=>({id:w.id||`widget-${i+1}`,order:i,visible:w.visible!==false,size:w.size||'medium'}));}
function translateMathUi(textValue,language='en'){const t=String(textValue);const dictionaries={es:{Home:'Inicio',Learn:'Aprender',Class:'Clase',Games:'Juegos'},fr:{Home:'Accueil',Learn:'Apprendre',Class:'Classe',Games:'Jeux'},hi:{Home:'होम',Learn:'सीखें',Class:'कक्षा',Games:'गेम्स'}};return dictionaries[language]?.[t]||t;}
function buildGameSchedule({allowedDays=['Friday'],start='12:00',end='15:30',dailyCapMinutes=20}={}){return{allowedDays, start:text(start,8),end:text(end,8),dailyCapMinutes:clamp(dailyCapMinutes,0,180)};}
function buildErrorLog({message='',route='',userId=null,severity='error'}={}){return{id:`err-${Date.now()}`,message:text(message,500),route:text(route,100),userId,severity:['info','warning','error','critical'].includes(severity)?severity:'error',createdAt:new Date().toISOString()};}
function buildAuditEntry({actor='',action='',target='',details={}}={}){return{id:`audit-${Date.now()}`,actor:text(actor,120),action:text(action,120),target:text(target,160),details,createdAt:new Date().toISOString()};}
function buildBackupManifest({schools=0,users=0,assignments=0,version='1'}={}){return{id:`backup-${Date.now()}`,createdAt:new Date().toISOString(),version:String(version),counts:{schools:Number(schools)||0,users:Number(users)||0,assignments:Number(assignments)||0},status:'ready'};}
function buildIntegrationCatalog(){return[
  {id:'google-classroom',name:'Google Classroom',status:'requires-provider-connection'},
  {id:'microsoft-teams',name:'Microsoft Teams',status:'requires-provider-connection'},
  {id:'google-sso',name:'Google school login',status:'requires-provider-connection'},
  {id:'microsoft-sso',name:'Microsoft school login',status:'requires-provider-connection'},
  {id:'lms',name:'LMS / LTI',status:'requires-provider-connection'},
  {id:'email',name:'Email notifications',status:'requires-email-provider'},
  {id:'push',name:'Push notifications',status:'requires-PWA-permission'},
];}

return {scoreDiagnostic,buildLearningPath,scheduleSpacedReview,predictMastery,buildRubric,buildExamVersions,markWorkedResponse,buildAttendanceRegister,buildSeatingPlan,buildTimetable,buildTournamentBracket,inspectChallengeIntegrity,createStudySession,confidenceAccuracySummary,classifyMathError,buildRevisionChecklist,createFlashcards,buildFormulaSheet,convertUnit,rearrangeFormula,buildParentWeeklySummary,duplicateAssignment,createResourceVersion,searchResourceLibrary,buildFeatureRollout,buildStatusSnapshot,buildDataRetentionPlan,buildDemoSchool,buildLessonPlan,buildTermPlan,curriculumCoverage,buildMarkingScheme,buildExamPaper,buildMultiPartQuestion,progressiveHints,buildHouseStandings,buildMeritRecord,buildLateWork,buildTeacherReminders,createNotebookPage,searchEverything,buildDashboardLayout,translateMathUi,buildGameSchedule,buildErrorLog,buildAuditEntry,buildBackupManifest,buildIntegrationCatalog};
})();
