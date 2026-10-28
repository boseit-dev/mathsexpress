import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StudentHomeRepository } from '@/data/repositories';
import { createSampleStudentHomeRepository } from '@/data/sample/sampleStudentHomeRepository';
import { millisecondsUntilMidnight } from '@/lib/dates';
import { findAccessibilityProblems } from '@/test/axe';
import { createFakeState } from '@/test/fakeDependencies';
import { renderApp, TEST_NOW } from '@/test/renderApp';

// renderApp uses the sample data with "now" fixed at Wednesday 28 October 2026, 3:30 pm.
async function renderHome() {
  const view = renderApp('/student');
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

  it('keeps Continue learning prominent and working', async () => {
    const user = userEvent.setup();
    await renderHome();
    const banner = section('Good afternoon, Mia');
    expect(banner).toHaveTextContent('Pick up where you left off');
    expect(
      within(banner).getByRole('progressbar', { name: 'Solving linear equations progress' }),
    ).toHaveAttribute('aria-valuetext', '7 of 12 questions');

    await user.click(within(banner).getByRole('link', { name: 'Continue learning' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeVisible();
  });

  it('lists the most urgent tasks first, then the latest completed one', async () => {
    await renderHome();
    const tasks = section('Your assigned tasks');
    const cards = within(tasks).getAllByRole('article');
    expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual([
      'Surface area revision',
      'Solving linear equations',
      'Pythagoras’ theorem quiz',
    ]);
    const [overdue, inProgress, completed] = cards as [HTMLElement, HTMLElement, HTMLElement];
    expect(overdue).toHaveTextContent('Overdue · was due yesterday');
    expect(overdue).toHaveTextContent('Not started');
    expect(
      within(overdue).getByRole('link', { name: 'Start Surface area revision' }),
    ).toBeVisible();
    expect(inProgress).toHaveTextContent('Due tomorrow');
    expect(inProgress).toHaveTextContent('In progress');
    expect(inProgress).toHaveTextContent('Reward: +60 coins');
    expect(
      within(inProgress).getByRole('link', { name: 'Continue Solving linear equations' }),
    ).toHaveAttribute('href', '/student/learn');
    expect(completed).toHaveTextContent('Completed 27 Oct');
    expect(completed).toHaveTextContent('42 coins earned');
    expect(
      within(completed).getByRole('link', { name: 'Review Pythagoras’ theorem quiz' }),
    ).toBeVisible();
    expect(within(tasks).getByRole('link', { name: 'View all 5 tasks' })).toHaveAttribute(
      'href',
      '/student/class/tasks',
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

  it('shows the class leaderboard with the student highlighted and ties sharing a rank', async () => {
    await renderHome();
    const rows = within(section('Class leaderboard')).getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual([
      'Rank 1LMLeo M.260 coins',
      'Rank 2ATAva T.240 coins',
      'Rank 3MCYou (Mia C.)185 coins',
      'Rank 3NKNoah K.185 coins',
      'Rank 5ZPZara P.150 coins',
    ]);
  });

  it('shows the coin shop, daily challenges and rewards', async () => {
    await renderHome();
    const shop = section('Coin shop');
    expect(shop).toHaveTextContent('Your balance: 340 coins');
    expect(shop).toHaveTextContent('Gold avatar frame');
    expect(shop).toHaveTextContent('60 more needed');
    expect(within(shop).getByRole('link', { name: 'Go to the shop' })).toHaveAttribute(
      'href',
      '/student/more/shop',
    );

    const challenges = section('Daily challenges');
    expect(challenges).toHaveTextContent('Resets at midnight');
    expect(
      within(challenges).getByRole('progressbar', { name: 'Get 5 correct in a row' }),
    ).toHaveAttribute('aria-valuetext', '5 of 5');

    const rewards = section('Your rewards');
    expect(rewards).toHaveTextContent('Earned this week+185 coins');
    expect(rewards).toHaveTextContent('Badges earned12');
    expect(rewards).toHaveTextContent('Next badge: Algebra Ace');
  });

  it('marks every panel that shows sample data', async () => {
    await renderHome();
    for (const name of [
      'Your assigned tasks',
      'Your recommended practice',
      'Your progress',
      'Class leaderboard',
      'Coin shop',
      'Daily challenges',
      'Your rewards',
    ]) {
      expect(section(name)).toHaveTextContent('Sample data');
    }
    expect(section('Good afternoon, Mia')).toHaveTextContent('(sample task)');
    expect(section('Good afternoon, Mia')).toHaveTextContent(
      'You have 2 tasks to finish, and 1 is overdue. (sample tasks)',
    );
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
