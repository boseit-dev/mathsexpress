import { describe, expect, it } from 'vitest';
import {
  countOpenAssignments,
  describeDue,
  getAssignmentStatus,
  isOverdue,
  selectContinueAssignment,
  selectHomeAssignments,
  type Assignment,
} from './assignment';

// Wednesday 28 October 2026, 3:30 pm (tests run in Sydney time).
const NOW = new Date(2026, 9, 28, 15, 30);
const onDay = (month: number, day: number, hour = 9) =>
  new Date(2026, month, day, hour).toISOString();
const october = (day: number, hour = 9) => onDay(9, day, hour);

function task(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: 'task',
    title: 'Task',
    kind: 'homework',
    topic: 'Topic',
    dueAt: october(30),
    questionCount: 10,
    questionsCompleted: 0,
    coinsAvailable: 50,
    coinsEarned: 0,
    lastActivityAt: null,
    completedAt: null,
    ...overrides,
  };
}

describe('getAssignmentStatus', () => {
  it('derives the status from progress and completion', () => {
    expect(getAssignmentStatus(task())).toBe('not-started');
    expect(getAssignmentStatus(task({ questionsCompleted: 3 }))).toBe('in-progress');
    expect(getAssignmentStatus(task({ questionsCompleted: 10, completedAt: october(27) }))).toBe(
      'completed',
    );
  });
});

describe('isOverdue', () => {
  it('is true only for open tasks past their due time', () => {
    expect(isOverdue(task({ dueAt: october(27) }), NOW)).toBe(true);
    expect(isOverdue(task({ dueAt: october(27), completedAt: october(26) }), NOW)).toBe(false);
    expect(isOverdue(task({ dueAt: october(29) }), NOW)).toBe(false);
  });
});

describe('describeDue', () => {
  it.each([
    [october(28, 17), 'Due today', 'soon'],
    [october(29), 'Due tomorrow', 'soon'],
    [october(30), 'Due Friday', 'upcoming'],
    [onDay(10, 3), 'Due Tuesday', 'upcoming'],
    [onDay(10, 4), 'Due 4 Nov', 'upcoming'],
    [october(28, 9), 'Overdue · was due today', 'overdue'],
    [october(27), 'Overdue · was due yesterday', 'overdue'],
    [october(25), 'Overdue by 3 days', 'overdue'],
  ])('describes a task due %s as "%s"', (dueAt, label, tone) => {
    expect(describeDue(task({ dueAt }), NOW)).toEqual({ label, tone });
  });

  it('describes completed tasks by their completion date', () => {
    const completed = task({ dueAt: october(25), completedAt: october(26, 14) });
    expect(describeDue(completed, NOW)).toEqual({ label: 'Completed 26 Oct', tone: 'done' });
  });
});

describe('selectHomeAssignments', () => {
  const overdue = task({ id: 'overdue', dueAt: october(27), questionsCompleted: 2 });
  const dueSoon = task({ id: 'soon', dueAt: october(29) });
  const dueLater = task({ id: 'later', dueAt: october(31) });
  const completedOld = task({ id: 'old', completedAt: october(20) });
  const completedRecent = task({ id: 'recent', completedAt: october(26) });
  const all = [completedOld, dueLater, completedRecent, dueSoon, overdue];

  it('lists open tasks by due date, then the most recently completed', () => {
    expect(selectHomeAssignments(all, 10).map(({ id }) => id)).toEqual([
      'overdue',
      'soon',
      'later',
      'recent',
      'old',
    ]);
  });

  it('respects the limit and does not change the input', () => {
    expect(selectHomeAssignments(all, 2).map(({ id }) => id)).toEqual(['overdue', 'soon']);
    expect(all[0]?.id).toBe('old');
  });
});

describe('selectContinueAssignment', () => {
  it('picks the task worked on most recently', () => {
    const older = task({ id: 'older', questionsCompleted: 2, lastActivityAt: october(25) });
    const newer = task({ id: 'newer', questionsCompleted: 1, lastActivityAt: october(27) });
    expect(selectContinueAssignment([older, newer, task({ id: 'new' })])?.id).toBe('newer');
  });

  it('falls back to the open task due soonest', () => {
    const later = task({ id: 'later', dueAt: october(31) });
    const sooner = task({ id: 'sooner', dueAt: october(29) });
    expect(selectContinueAssignment([later, sooner])?.id).toBe('sooner');
  });

  it('returns null when every task is complete', () => {
    expect(selectContinueAssignment([task({ completedAt: october(26) })])).toBeNull();
  });
});

describe('countOpenAssignments', () => {
  it('counts open and overdue tasks', () => {
    const tasks = [
      task({ dueAt: october(27) }),
      task({ dueAt: october(30) }),
      task({ completedAt: october(26) }),
    ];
    expect(countOpenAssignments(tasks, NOW)).toEqual({ open: 2, overdue: 1 });
  });
});
