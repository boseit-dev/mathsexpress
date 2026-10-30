import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { StudentTask } from '@/domain/tasks';
import { renderWithRouter } from '@/test/renderWithRouter';
import { TaskCard } from './TaskCard';

const NOW = new Date(2026, 9, 28, 15, 30);

function task(overrides: Partial<StudentTask> = {}): StudentTask {
  return {
    id: 'task-1',
    classId: 'class-1',
    className: '9M2 Mathematics',
    title: 'Linear equations homework',
    instructions: null,
    contentId: 'linear-equations-basics',
    contentTitle: 'Solving linear equations',
    contentKind: 'lesson',
    topic: 'Linear equations',
    questionCount: 5,
    estimatedMinutes: 10,
    dueAt: new Date(2026, 9, 30, 23, 59).toISOString(),
    publishedAt: new Date(2026, 9, 27).toISOString(),
    progress: 'not_started',
    completedAt: null,
    questionsSolved: 0,
    ...overrides,
  };
}

describe('TaskCard', () => {
  it('shows a task that has not been started, with a Start button to its lesson', () => {
    renderWithRouter(<TaskCard task={task()} now={NOW} />);
    expect(screen.getByRole('heading', { name: 'Linear equations homework' })).toBeVisible();
    expect(screen.getByText('Lesson · Linear equations · 9M2 Mathematics')).toBeVisible();
    expect(screen.getByText(/^Due Fri/)).toBeVisible();
    expect(screen.getByText('Not started')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Start Linear equations homework' })).toHaveAttribute(
      'href',
      '/student/learn/linear-equations-basics',
    );
  });

  it('shows saved progress and a Continue button for a task in progress', () => {
    renderWithRouter(
      <TaskCard task={task({ progress: 'in_progress', questionsSolved: 2 })} now={NOW} />,
    );
    expect(
      screen.getByRole('progressbar', { name: 'Linear equations homework progress' }),
    ).toHaveAttribute('aria-valuetext', '2 of 5 questions');
    expect(screen.getByRole('link', { name: 'Continue Linear equations homework' })).toBeVisible();
  });

  it('warns when a task is overdue', () => {
    renderWithRouter(
      <TaskCard task={task({ dueAt: new Date(2026, 9, 26, 23, 59).toISOString() })} now={NOW} />,
    );
    expect(screen.getByText('Overdue by 2 days')).toBeVisible();
  });

  it('shows a completed task with a Review button', () => {
    renderWithRouter(
      <TaskCard
        task={task({
          progress: 'completed',
          questionsSolved: 5,
          completedAt: new Date(2026, 9, 27).toISOString(),
        })}
        now={NOW}
      />,
    );
    expect(screen.getByText('Completed 27 Oct')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Review Linear equations homework' })).toBeVisible();
  });
});
