import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { createFakeState, TEST_CLASS_CODE, type FakeState } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

type User = ReturnType<typeof userEvent.setup>;

/** Adds a second class, taught by the test teacher, that the student hasn't joined. */
function addOpenClass(state: FakeState, overrides: { joiningEnabled?: boolean } = {}) {
  const [existing] = state.classes;
  if (!existing) throw new Error('The fake state has no class to copy');
  state.classes.push({
    ...existing,
    id: 'class-10a',
    name: '10A Advanced',
    yearLevel: 10,
    joinCode: 'WXYZ2345',
    joiningEnabled: overrides.joiningEnabled ?? true,
    students: [],
  });
}

async function joinWithCode(user: User, code: string) {
  const field = await screen.findByLabelText('Class code');
  await user.clear(field);
  await user.type(field, code);
  await user.click(screen.getByRole('button', { name: 'Join class' }));
}

function classCard(name: string) {
  return screen.getByRole('article', { name });
}

describe('student Class page', () => {
  it('shows each class with its teacher and the student’s year level, which they can’t change', async () => {
    renderApp('/student/class');
    expect(await screen.findByRole('heading', { level: 1, name: 'Class' })).toBeVisible();

    const card = classCard('9M2 Mathematics');
    expect(within(card).getByText('Priya Patel')).toBeVisible();
    expect(within(card).getByText('Year 9')).toBeVisible();
    expect(within(card).getByText('Set by your teacher')).toBeVisible();
    expect(within(card).getByText('2 Oct 2026')).toBeVisible();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows the student’s own year level when the teacher has changed it', async () => {
    const state = createFakeState();
    const membership = state.classes[0]?.students[0];
    if (membership) membership.yearLevel = 10;
    renderApp('/student/class', { state });

    const card = await screen.findByRole('article', { name: '9M2 Mathematics' });
    expect(within(card).getByText('Year 10')).toBeVisible();
    expect(within(card).getByText('Class year level')).toBeVisible();
    expect(within(card).getByText('Year 9')).toBeVisible();
  });

  it('joins a class with a code typed in any case, with or without the hyphen', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    addOpenClass(state);
    renderApp('/student/class', { state });

    await joinWithCode(user, 'wxyz-2345');

    expect(await screen.findByRole('status')).toHaveTextContent(
      'You joined 10A Advanced. Your teacher is Priya Patel.',
    );
    expect(await screen.findByRole('article', { name: '10A Advanced' })).toBeVisible();
    expect(screen.getByLabelText('Class code')).toHaveValue('');
    expect(state.classes[1]?.students.map((student) => student.firstName)).toEqual(['Mia']);
  });

  it('explains a code in the wrong format and moves focus to it', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/student/class');
    await joinWithCode(user, 'ABC');

    const field = screen.getByLabelText('Class code');
    await waitFor(() => {
      expect(field).toHaveFocus();
    });
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription(
      'For example ABCD-2345 Class codes have 8 letters and numbers, like ABCD-2345.',
    );
    expect(state.classes[0]?.students).toHaveLength(1);
  });

  it('explains a code no class uses', async () => {
    const user = userEvent.setup();
    renderApp('/student/class');
    await joinWithCode(user, 'QQQQ2222');
    expect(
      await screen.findByText('No class uses that code. Check it with your teacher.'),
    ).toBeVisible();
  });

  it('won’t join the same class twice', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/student/class');
    await joinWithCode(user, TEST_CLASS_CODE);
    expect(await screen.findByText('You’re already in this class.')).toBeVisible();
    expect(state.classes[0]?.students).toHaveLength(1);
  });

  it('explains when a class isn’t accepting students', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    addOpenClass(state, { joiningEnabled: false });
    renderApp('/student/class', { state });
    await joinWithCode(user, 'WXYZ2345');
    expect(
      await screen.findByText(
        'This class isn’t accepting new students right now. Ask your teacher.',
      ),
    ).toBeVisible();
  });

  it('leaves a class after confirming, and says so', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/student/class');

    await user.click(await screen.findByRole('button', { name: 'Leave class 9M2 Mathematics' }));
    const confirm = screen.getByRole('button', { name: 'Yes, leave class' });
    expect(confirm).toHaveFocus();
    expect(confirm).toHaveAccessibleDescription(/To come back, you’ll need the class code/);

    await user.click(confirm);
    const message = await screen.findByRole('status');
    expect(message).toHaveTextContent('You left 9M2 Mathematics.');
    await waitFor(() => {
      expect(message).toHaveFocus();
    });
    expect(screen.getByText('You’re not in a class yet')).toBeVisible();
    expect(state.classes[0]?.students).toEqual([]);
  });

  it('shows only the latest result, so leaving and rejoining doesn’t still say “You left”', async () => {
    const user = userEvent.setup();
    renderApp('/student/class');
    await user.click(await screen.findByRole('button', { name: 'Leave class 9M2 Mathematics' }));
    await user.click(screen.getByRole('button', { name: 'Yes, leave class' }));
    expect(await screen.findByText('You left 9M2 Mathematics.')).toBeVisible();

    await joinWithCode(user, TEST_CLASS_CODE);
    expect(
      await screen.findByText('You joined 9M2 Mathematics. Your teacher is Priya Patel.'),
    ).toBeVisible();
    expect(screen.queryByText('You left 9M2 Mathematics.')).not.toBeInTheDocument();
  });

  it('can cancel leaving', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/student/class');
    const leave = await screen.findByRole('button', { name: 'Leave class 9M2 Mathematics' });
    await user.click(leave);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Leave class 9M2 Mathematics' })).toHaveFocus();
    expect(state.classes[0]?.students).toHaveLength(1);
  });

  it('has no leave button when the teacher has turned leaving off', async () => {
    const state = createFakeState();
    const [taught] = state.classes;
    if (taught) taught.studentsCanLeave = false;
    renderApp('/student/class', { state });
    const card = await screen.findByRole('article', { name: '9M2 Mathematics' });
    expect(within(card).queryByRole('button')).not.toBeInTheDocument();
    expect(within(card).getByText('Your teacher manages who is in this class.')).toBeVisible();
  });

  it('is only for students', async () => {
    const { router } = renderApp('/student/class', { signedInAs: 'teacher' });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher');
    });
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/student/class');
    await screen.findByRole('article', { name: '9M2 Mathematics' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });

  it('shows a helpful empty state to students without a class', async () => {
    const state = createFakeState();
    const [taught] = state.classes;
    if (taught) taught.students = [];
    renderApp('/student/class', { state });
    expect(await screen.findByText('You’re not in a class yet')).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: 'Join a class' })).toBeVisible();
  });
});
