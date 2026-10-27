import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Assignment } from '@/domain/assignment';
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

describe('AssignmentCard', () => {
  it('shows a task that has not been started', () => {
    render(<AssignmentCard assignment={task()} now={NOW} />);
    const card = screen.getByRole('article', { name: 'Index laws' });
    expect(card).toHaveTextContent('Practice');
    expect(card).toHaveTextContent('Due Friday');
    expect(card).toHaveTextContent('Not started');
    expect(card).toHaveTextContent('0 of 10 questions');
    expect(card).not.toHaveTextContent('earned so far');
    expect(screen.getByRole('progressbar', { name: 'Index laws progress' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  it('shows progress and coins earned so far for a task in progress', () => {
    render(
      <AssignmentCard assignment={task({ questionsCompleted: 4, coinsEarned: 20 })} now={NOW} />,
    );
    const card = screen.getByRole('article', { name: 'Index laws' });
    expect(card).toHaveTextContent('In progress');
    expect(card).toHaveTextContent('4 of 10 questions · 20 coins earned so far');
    expect(card).toHaveTextContent('Reward: +50 coins');
  });

  it('warns when a task is overdue', () => {
    const overdue = task({ dueAt: new Date(2026, 9, 25, 9).toISOString() });
    render(<AssignmentCard assignment={overdue} now={NOW} />);
    expect(screen.getByRole('article')).toHaveTextContent('Overdue by 3 days');
  });

  it('shows a completed task as done with the coins earned', () => {
    const completed = task({
      questionsCompleted: 10,
      coinsEarned: 45,
      completedAt: new Date(2026, 9, 26, 14).toISOString(),
    });
    render(<AssignmentCard assignment={completed} now={NOW} />);
    const card = screen.getByRole('article', { name: 'Index laws' });
    expect(card).toHaveTextContent('Completed 26 Oct');
    expect(card).toHaveTextContent('Done');
    expect(card).toHaveTextContent('Well done! You earned 45 coins.');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
