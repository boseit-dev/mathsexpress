import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StudentHomeRepository } from '@/data/repositories';
import { createSampleStudentHomeRepository } from '@/data/sample/sampleStudentHomeRepository';
import { millisecondsUntilMidnight } from '@/lib/dates';
import { findAccessibilityProblems } from '@/test/axe';
import {
  addFakeAttempt,
  addFakeTask,
  createFakeState,
  type FakeState,
} from '@/test/fakeDependencies';
import { renderApp, TEST_NOW } from '@/test/renderApp';

/**
 * Three real tasks for the same lesson, judged by the attempts made after each was set:
 * one overdue and not started, one in progress, one completed.
 */
function stateWithTasks(): FakeState {
  const state = createFakeState();
  addFakeAttempt(state, { solved: 5, at: new Date(2026, 9, 27, 10) });
  addFakeAttempt(state, { solved: 2, at: new Date(2026, 9, 28, 10) });
  addFakeTask(state, {
    title: 'Algebra check-in',
    publishedAt: new Date(2026, 9, 26).toISOString(),
    dueAt: new Date(2026, 9, 27, 12).toISOString(),
  });
  addFakeTask(state, {
    title: 'Equations practice',
    publishedAt: new Date(2026, 9, 28, 9).toISOString(),
    dueAt: new Date(2026, 9, 29, 23, 59).toISOString(),
  });
  addFakeTask(state, {
    title: 'Surface area revision',
    publishedAt: new Date(2026, 9, 28, 11).toISOString(),
    dueAt: new Date(2026, 9, 28, 14).toISOString(),
  });
  return state;
}

// renderApp's "now" is fixed at Wednesday 28 October 2026, 3:30 pm.
async function renderHome(state: FakeState = stateWithTasks()) {
  const view = renderApp('/student', { state });
  await screen.findByRole('heading', { level: 1 });
  return view;
}

function section(name: string) {
  return screen.getByRole('region', { name });
}

describe('student home page', () => {
  it('welcomes the student with their class and a summary of their tasks', async () => {
    await renderHome();
    const banner = section('Good afternoon, Mia');
    expect(banner).toHaveTextContent('Year 9 · 9M2 Mathematics');
    expect(banner).toHaveTextContent('You have 2 tasks to finish, and 1 is overdue.');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await waitFor(() => {
      expect(document.title).toBe('Home · MathsExpress');
    });
  });

  it('keeps Continue learning prominent and taking the student to their task', async () => {
    const user = userEvent.setup();
    await renderHome();
    const banner = section('Good afternoon, Mia');
    expect(banner).toHaveTextContent('Pick up where you left off');
    expect(
      within(banner).getByRole('progressbar', { name: 'Equations practice progress' }),
    ).toHaveAttribute('aria-valuetext', '2 of 5 questions');

    await user.click(within(banner).getByRole('link', { name: 'Continue learning' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' }),
    ).toBeVisible();
  });

  it('lists the most urgent real tasks first, then the latest completed one', async () => {
    await renderHome();
    const tasks = section('Your assigned tasks');
    const cards = within(tasks).getAllByRole('article');
    expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual([
      'Surface area revision',
      'Equations practice',
      'Algebra check-in',
    ]);
    const [overdue, inProgress, completed] = cards as [HTMLElement, HTMLElement, HTMLElement];
    expect(overdue).toHaveTextContent('Overdue · was due today');
    expect(overdue).toHaveTextContent('Not started');
    expect(
      within(overdue).getByRole('link', { name: 'Start Surface area revision' }),
    ).toHaveAttribute('href', '/student/learn/linear-equations-basics');
    expect(inProgress).toHaveTextContent('Due tomorrow');
    expect(inProgress).toHaveTextContent('In progress');
    expect(completed).toHaveTextContent('Completed 27 Oct');
    expect(within(completed).getByRole('link', { name: 'Review Algebra check-in' })).toBeVisible();
    expect(within(tasks).queryByText('Sample data')).not.toBeInTheDocument();
  });

  it('says so when no tasks have been set yet', async () => {
    await renderHome(createFakeState());
    const tasks = section('Your assigned tasks');
    expect(tasks).toHaveTextContent('Your teacher hasn’t set any tasks yet.');
    expect(section('Good afternoon, Mia')).toHaveTextContent(
      'You’re all caught up on your tasks. Nice work!',
    );
  });

  it('recommends a topic to practise and shows the mistakes behind it', async () => {
    await renderHome();
    const practice = section('Your recommended practice');
    expect(
      within(practice).getByRole('heading', { name: 'Factorising quadratic expressions' }),
    ).toBeVisible();
    expect(within(practice).getByRole('link', { name: 'Start practice' })).toHaveAttribute(
      'href',
      '/student/learn',
    );
    expect(practice).toHaveTextContent('3 recent mistakes to look over');
    expect(practice).toHaveTextContent('Factorise x² + 5x + 6');
    expect(practice).toHaveTextContent('Your answer:(x + 1)(x + 6)');
    expect(practice).toHaveTextContent('Correct:(x + 2)(x + 3)');
  });

  it('summarises learning progress', async () => {
    await renderHome();
    const progress = section('Your progress');
    expect(progress).toHaveTextContent('Topics completed14of 38 in Year 9');
    expect(progress).toHaveTextContent('Questions answered1,286142 this week');
    expect(progress).toHaveTextContent('Accuracy82%1,055 answered correctly');
    expect(progress).toHaveTextContent('Learning streak6 daysBest: 11 days');
  });

  it('offers simple routes into learning, textbook and class', async () => {
    await renderHome();
    const shortcuts = screen.getByRole('navigation', { name: 'Study shortcuts' });
    expect(within(shortcuts).getByRole('link', { name: /Learn a topic/ })).toHaveAttribute(
      'href',
      '/student/learn',
    );
    expect(within(shortcuts).getByRole('link', { name: /Textbook/ })).toHaveAttribute(
      'href',
      '/student/textbook',
    );
    expect(within(shortcuts).getByRole('link', { name: /My class/ })).toHaveAttribute(
      'href',
      '/student/class',
    );
  });

  it('keeps leaderboards, coins and rewards off the study-journal home', async () => {
    await renderHome();
    for (const name of ['Class leaderboard', 'Coin shop', 'Daily challenges', 'Your rewards']) {
      expect(screen.queryByRole('region', { name })).not.toBeInTheDocument();
    }
  });

  it('marks every panel that shows sample data, and only those', async () => {
    await renderHome();
    for (const name of ['Your recommended practice', 'Your progress']) {
      expect(section(name)).toHaveTextContent('Sample data');
    }
    expect(section('Your assigned tasks')).not.toHaveTextContent('Sample data');
    expect(section('Good afternoon, Mia')).not.toHaveTextContent('sample');
  });

  it('shows the student’s real class and teacher-assigned year level', async () => {
    const state = createFakeState();
    const membership = state.classes[0]?.students[0];
    if (membership) membership.yearLevel = 10;
    renderApp('/student', { state });
    expect(await screen.findByText('Year 10 · 9M2 Mathematics')).toBeVisible();
  });

  it('asks a student who has not joined a class to join one', async () => {
    const state = createFakeState();
    state.classes[0]?.students.splice(0);
    renderApp('/student', { state });
    expect(
      await screen.findByRole('link', { name: 'You’re not in a class yet · Join a class' }),
    ).toHaveAttribute('href', '/student/class');
  });

  it('has no detectable accessibility problems', async () => {
    await renderHome();
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('keeping the home page current', () => {
  function renderCountingHomeLoads() {
    const repository = createSampleStudentHomeRepository(() => TEST_NOW);
    const getStudentHome = vi.fn<StudentHomeRepository['getStudentHome']>((student, options) =>
      repository.getStudentHome(student, options),
    );
    renderApp('/student', { overrides: { studentHome: { getStudentHome } } });
    return getStudentHome;
  }

  it('reloads the data when the student returns to the tab', async () => {
    const getStudentHome = renderCountingHomeLoads();
    await screen.findByRole('heading', { level: 1 });
    expect(getStudentHome).toHaveBeenCalledTimes(1);

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await waitFor(() => {
      expect(getStudentHome).toHaveBeenCalledTimes(2);
    });
  });

  it('reloads the data at midnight', async () => {
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const getStudentHome = renderCountingHomeLoads();
    await screen.findByRole('heading', { level: 1 });

    const midnightCall = setTimeoutSpy.mock.calls.find(
      ([, delay]) => delay === millisecondsUntilMidnight(TEST_NOW),
    );
    expect(midnightCall).toBeDefined();
    act(() => {
      (midnightCall?.[0] as () => void)();
    });

    await waitFor(() => {
      expect(getStudentHome).toHaveBeenCalledTimes(2);
    });
  });
});
