import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CurrentStudent } from '@/domain/student';
import { renderWithRouter } from '@/test/renderWithRouter';
import { AssignmentSection } from './AssignmentSection';
import { ChallengesPanel } from './ChallengesPanel';
import { LeaderboardPanel } from './LeaderboardPanel';
import { RecommendedPractice } from './RecommendedPractice';
import { WelcomeBanner } from './WelcomeBanner';

const NOW = new Date(2026, 9, 28, 9, 15);

const student: CurrentStudent = {
  id: 'student-1',
  firstName: 'Sam',
  lastName: 'Lee',
  displayName: 'Sam L.',
  enrolment: { classId: 'c1', className: '7A Maths', yearLevel: 7, teacherName: 'Mr Ng' },
  coinBalance: 0,
};

describe('WelcomeBanner', () => {
  it('congratulates a student with nothing left to do and still offers Continue learning', () => {
    renderWithRouter(
      <WelcomeBanner
        student={student}
        now={NOW}
        taskCounts={{ open: 0, overdue: 0 }}
        continueAssignment={null}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Good morning, Sam');
    expect(screen.getByText('You’re all caught up on your tasks. Nice work!')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Continue learning' })).toBeVisible();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});

describe('empty states', () => {
  it('explains when there are no tasks yet', () => {
    renderWithRouter(<AssignmentSection assignments={[]} now={NOW} />);
    expect(screen.getByText(/hasn’t set any tasks yet/)).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('explains when there is nothing to recommend yet', () => {
    renderWithRouter(<RecommendedPractice recommendation={null} />);
    expect(screen.getByText(/suggest what to practise next/)).toBeVisible();
  });

  it('explains when there are no challenges today', () => {
    render(<ChallengesPanel challenges={[]} />);
    expect(screen.getByText('New challenges appear here every day.')).toBeVisible();
  });
});

describe('LeaderboardPanel', () => {
  it('adds the student’s own row when they are outside the top five', () => {
    const entries = ['A', 'B', 'C', 'D', 'E', 'F'].map((letter, index) => ({
      studentId: letter,
      displayName: `${letter}.`,
      coinsThisWeek: 100 - index * 10,
    }));
    renderWithRouter(<LeaderboardPanel entries={entries} currentStudentId="F" />);
    const rows = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(rows).toHaveLength(6);
    expect(rows[5]).toHaveTextContent('Rank 6FYou (F.)50 coins');
  });
});
