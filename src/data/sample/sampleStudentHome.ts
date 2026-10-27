// DEVELOPMENT SAMPLE DATA for the student home page. Fictional students and results, used to
// build and test the interface before real accounts and learning data exist. Dates are relative
// to "now" so the preview always shows a realistic mix of due, overdue and completed tasks.
import type { StudentHome } from '@/domain/studentHome';
import { sampleStudent } from './sampleStudent';

/** An ISO timestamp `days` from today (negative for the past) at the given local time. */
function daysFromNow(now: Date, days: number, hour: number, minute = 0): string {
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + days,
    hour,
    minute,
  ).toISOString();
}

function hoursAgo(now: Date, hours: number): string {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

export function createSampleStudentHome(now: Date): StudentHome {
  return {
    assignments: [
      {
        id: 'sample-task-linear-equations',
        title: 'Solving linear equations',
        kind: 'homework',
        topic: 'Linear equations',
        dueAt: daysFromNow(now, 1, 9),
        questionCount: 12,
        questionsCompleted: 7,
        coinsAvailable: 60,
        coinsEarned: 35,
        lastActivityAt: hoursAgo(now, 20),
        completedAt: null,
      },
      {
        id: 'sample-task-surface-area',
        title: 'Surface area revision',
        kind: 'revision',
        topic: 'Area and surface area',
        dueAt: daysFromNow(now, -1, 15),
        questionCount: 8,
        questionsCompleted: 0,
        coinsAvailable: 40,
        coinsEarned: 0,
        lastActivityAt: null,
        completedAt: null,
      },
      {
        id: 'sample-task-pythagoras',
        title: 'Pythagoras’ theorem quiz',
        kind: 'quiz',
        topic: 'Pythagoras’ theorem',
        dueAt: daysFromNow(now, 2, 9),
        questionCount: 10,
        questionsCompleted: 10,
        coinsAvailable: 50,
        coinsEarned: 42,
        lastActivityAt: hoursAgo(now, 26),
        completedAt: hoursAgo(now, 26),
      },
      {
        id: 'sample-task-index-laws',
        title: 'Index laws practice',
        kind: 'practice',
        topic: 'Index laws',
        dueAt: daysFromNow(now, -2, 9),
        questionCount: 15,
        questionsCompleted: 15,
        coinsAvailable: 45,
        coinsEarned: 45,
        lastActivityAt: hoursAgo(now, 75),
        completedAt: hoursAgo(now, 75),
      },
      {
        id: 'sample-task-probability',
        title: 'Probability warm-up',
        kind: 'practice',
        topic: 'Probability',
        dueAt: daysFromNow(now, -6, 9),
        questionCount: 10,
        questionsCompleted: 10,
        coinsAvailable: 30,
        coinsEarned: 30,
        lastActivityAt: hoursAgo(now, 150),
        completedAt: hoursAgo(now, 150),
      },
    ],
    recommendation: {
      topicId: 'sample-topic-factorising-quadratics',
      topicName: 'Factorising quadratic expressions',
      strand: 'Number and algebra',
      reason: 'You missed 3 of the 5 factorising questions in your last algebra task.',
      questionCount: 10,
      estimatedMinutes: 12,
      mistakes: [
        {
          id: 'sample-mistake-1',
          question: 'Factorise x² + 5x + 6',
          givenAnswer: '(x + 1)(x + 6)',
          correctAnswer: '(x + 2)(x + 3)',
        },
        {
          id: 'sample-mistake-2',
          question: 'Factorise x² − 9',
          givenAnswer: '(x − 3)²',
          correctAnswer: '(x + 3)(x − 3)',
        },
        {
          id: 'sample-mistake-3',
          question: 'Factorise 2x² + 7x + 3',
          givenAnswer: '(2x + 3)(x + 1)',
          correctAnswer: '(2x + 1)(x + 3)',
        },
      ],
    },
    progress: {
      topicsCompleted: 14,
      topicsInCourse: 38,
      questionsAnswered: 1286,
      questionsCorrect: 1055,
      questionsAnsweredThisWeek: 142,
      streakDays: 6,
      bestStreakDays: 11,
    },
    rewards: {
      coinsEarnedThisWeek: 185,
      badgesEarned: 12,
      nextBadge: {
        name: 'Algebra Ace',
        description: 'Finish 10 algebra tasks',
        progress: 7,
        target: 10,
      },
    },
    leaderboard: [
      { studentId: 'sample-student-leo', displayName: 'Leo M.', coinsThisWeek: 260 },
      { studentId: 'sample-student-ava', displayName: 'Ava T.', coinsThisWeek: 240 },
      { studentId: sampleStudent.id, displayName: sampleStudent.displayName, coinsThisWeek: 185 },
      { studentId: 'sample-student-noah', displayName: 'Noah K.', coinsThisWeek: 185 },
      { studentId: 'sample-student-zara', displayName: 'Zara P.', coinsThisWeek: 150 },
      { studentId: 'sample-student-isaac', displayName: 'Isaac W.', coinsThisWeek: 120 },
      { studentId: 'sample-student-ruby', displayName: 'Ruby S.', coinsThisWeek: 95 },
    ],
    challenges: [
      {
        id: 'sample-challenge-questions',
        title: 'Answer 20 questions',
        progress: 12,
        target: 20,
        rewardCoins: 20,
      },
      {
        id: 'sample-challenge-streak',
        title: 'Get 5 correct in a row',
        progress: 5,
        target: 5,
        rewardCoins: 15,
      },
      {
        id: 'sample-challenge-minutes',
        title: 'Practise for 15 minutes',
        progress: 6,
        target: 15,
        rewardCoins: 10,
      },
    ],
    featuredShopItems: [
      {
        id: 'sample-item-galaxy-theme',
        name: 'Galaxy theme',
        description: 'A starry background for your profile.',
        category: 'theme',
        price: 250,
      },
      {
        id: 'sample-item-streak-shield',
        name: 'Streak shield',
        description: 'Keeps your streak safe for one missed day.',
        category: 'power-up',
        price: 120,
      },
      {
        id: 'sample-item-gold-frame',
        name: 'Gold avatar frame',
        description: 'A shining frame around your avatar.',
        category: 'avatar',
        price: 400,
      },
    ],
  };
}
