import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { addFakeAttempt, addFakeTask, createFakeState, testStudent } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

const MIA = `user-${testStudent.email}`;

/** Mia finished the lesson yesterday with one wrong first try; Leo has done nothing. */
function stateWithWork() {
  const state = createFakeState();
  state.classes[0]?.students.push({
    studentId: 'user-leo',
    firstName: 'Leo',
    lastName: 'Zhang',
    yearLevel: 9,
    joinedAt: '2026-10-03T00:00:00.000Z',
  });
  addFakeTask(state);
  addFakeAttempt(state, { solved: 5, wrong: 1, at: new Date(2026, 9, 27, 10) });
  return state;
}

describe('teacher reports', () => {
  it('summarises the class from saved work only', async () => {
    renderApp('/teacher/reports', { signedInAs: 'teacher', state: stateWithWork() });
    const tiles = await screen.findByText('Active students');
    expect(tiles.parentElement).toHaveTextContent('1 of 2');
    expect(
      screen.getByText('Right first time', { selector: 'dt' }).parentElement,
    ).toHaveTextContent('80%');
    const table = screen.getByRole('table', { name: 'Each student’s learning' });
    expect(within(table).getByRole('row', { name: /Mia Chen/ })).toHaveTextContent('80%');
    // No made-up numbers for a student who hasn't worked yet.
    expect(within(table).getByRole('row', { name: /Leo Zhang/ })).toHaveTextContent('Not yet');
    expect(screen.getByText('1 of 2 finished')).toBeVisible();
  });

  it('opens one student’s attempts', async () => {
    const user = userEvent.setup();
    renderApp('/teacher/reports', { signedInAs: 'teacher', state: stateWithWork() });
    await user.click(await screen.findByRole('link', { name: 'Mia Chen' }));
    const attempts = await screen.findByRole('table', { name: 'Mia Chen’s lesson attempts' });
    expect(
      within(attempts).getByRole('row', { name: /Solving linear equations/ }),
    ).toHaveTextContent('Completed');
    expect(screen.getByRole('link', { name: 'All students' })).toBeVisible();
  });

  it('says so when a period has no saved work', async () => {
    renderApp('/teacher/reports?period=7d', {
      signedInAs: 'teacher',
      state: (() => {
        const state = createFakeState();
        addFakeAttempt(state, { solved: 2, at: new Date(2026, 8, 1) });
        return state;
      })(),
    });
    expect(await screen.findByText(/No saved work in the last 7 days/)).toBeVisible();
  });

  it('shows the same report in the class’s Progress tab', async () => {
    renderApp(`/teacher/classes/class-9m2/progress?student=${MIA}`, {
      signedInAs: 'teacher',
      state: stateWithWork(),
    });
    expect(await screen.findByRole('table', { name: 'Mia Chen’s lesson attempts' })).toBeVisible();
  });

  it('lists recent completions on the teacher home', async () => {
    renderApp('/teacher', { signedInAs: 'teacher', state: stateWithWork() });
    const activity = await screen.findByRole('region', { name: 'Recent activity' });
    expect(activity).toHaveTextContent('Mia Chen finished Solving linear equations');
    expect(activity).toHaveTextContent('right first time 80%');
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/teacher/reports', { signedInAs: 'teacher', state: stateWithWork() });
    await screen.findByRole('table', { name: 'Each student’s learning' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
