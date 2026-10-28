import { describe, expect, it } from 'vitest';
import { getAssignmentStatus, isOverdue } from '@/domain/assignment';
import { createSampleStudentHome } from './sampleStudentHome';

// Guards the sample data's internal consistency, so the preview never shows impossible numbers.
describe('sample student home data', () => {
  const now = new Date(2026, 9, 28, 15, 30);
  const viewer = { id: 'student-1', displayName: 'Sam L.' };
  const home = createSampleStudentHome(now, viewer);

  it('has task numbers that add up', () => {
    for (const task of home.assignments) {
      expect(task.questionsCompleted).toBeLessThanOrEqual(task.questionCount);
      expect(task.coinsEarned).toBeLessThanOrEqual(task.coinsAvailable);
      expect(task.completedAt === null).toBe(task.questionsCompleted < task.questionCount);
    }
  });

  it('covers every task state, including an overdue task', () => {
    const statuses = new Set(home.assignments.map(getAssignmentStatus));
    expect(statuses).toEqual(new Set(['not-started', 'in-progress', 'completed']));
    expect(home.assignments.some((task) => isOverdue(task, now))).toBe(true);
  });

  it('keeps the student’s weekly coins the same everywhere they appear', () => {
    const ownRow = home.leaderboard.find((entry) => entry.studentId === viewer.id);
    expect(ownRow?.coinsThisWeek).toBe(home.rewards.coinsEarnedThisWeek);
    expect(ownRow?.displayName).toBe(viewer.displayName);
  });

  it('has a consistent progress summary', () => {
    const { progress } = home;
    expect(progress.questionsCorrect).toBeLessThanOrEqual(progress.questionsAnswered);
    expect(progress.topicsCompleted).toBeLessThanOrEqual(progress.topicsInCourse);
    expect(progress.streakDays).toBeLessThanOrEqual(progress.bestStreakDays);
  });
});
