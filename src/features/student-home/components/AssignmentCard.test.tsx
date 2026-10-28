import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Assignment } from '@/domain/assignment';
import { renderWithRouter } from '@/test/renderWithRouter';
import { AssignmentCard } from './AssignmentCard';

const NOW = new Date(2026, 9, 28, 15, 30);

function task(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: 'task',
    title: 'Index laws',
    kind: 'practice',
    topic: 'Indices',
    dueAt: new Date(2026, 9, 30, 9).toISOString(),
    questionCount: 10,
    questionsCompleted: 0,
    coinsAvailable: 50,
    coinsEarned: 0,
    lastActivityAt: null,
    completedAt: null,
    ...overrides,
  };
}

function renderCard(assignment: Assignment) {
  renderWithRouter(<AssignmentCard assignment={assignment} now={NOW} />);
  return screen.getByRole('article', { name: assignment.title });
}

describe('AssignmentCard', () => {
  it('shows a task that has not been started, with a Start button', () => {
    const card = renderCard(task());
    expect(card).toHaveTextContent('Practice · Indices');
    expect(card).toHaveTextContent('0 of 10 questions');
    expect(card).toHaveTextContent('Due Friday');
    expect(card).toHaveTextContent('Reward: +50 coins');
    expect(card).toHaveTextContent('Not started');
    expect(within(card).getByRole('progressbar', { name: 'Index laws progress' })).toHaveAttribute(
      'aria-valuetext',
      '0 of 10 questions',
    );
    expect(within(card).getByRole('link', { name: 'Start Index laws' })).toHaveAttribute(
      'href',
      '/student/learn',
    );
  });

  it('shows progress and a Continue button for a task in progress', () => {
    const card = renderCard(task({ questionsCompleted: 4, coinsEarned: 20 }));
    expect(card).toHaveTextContent('In progress');
    expect(card).toHaveTextContent('4 of 10 questions');
    expect(card).toHaveTextContent('40%');
    expect(within(card).getByRole('link', { name: 'Continue Index laws' })).toBeVisible();
  });

  it('warns when a task is overdue', () => {
    const card = renderCard(task({ dueAt: new Date(2026, 9, 25, 9).toISOString() }));
    expect(card).toHaveTextContent('Overdue by 3 days');
  });

  it('shows a completed task differently, with coins earned and a Review button', () => {
    const card = renderCard(
      task({
        questionsCompleted: 10,
        coinsEarned: 45,
        completedAt: new Date(2026, 9, 26, 14).toISOString(),
      }),
    );
    expect(card).toHaveTextContent('Completed 26 Oct');
    expect(card).toHaveTextContent('45 coins earned');
    expect(card).toHaveTextContent('Completed');
    expect(within(card).queryByRole('progressbar')).not.toBeInTheDocument();
    expect(within(card).getByRole('link', { name: 'Review Index laws' })).toBeVisible();
  });
});
