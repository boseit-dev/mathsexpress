import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { createFakeState, testTeacher } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

const CLASS_PAGE = '/teacher/classes/class-9m2';

function teacherState() {
  const state = createFakeState();
  state.signedInEmail = testTeacher.email;
  return state;
}

describe('teacher Classes page', () => {
  it('lists the teacher’s classes with their codes and student counts', async () => {
    renderApp('/teacher/classes', { signedInAs: 'teacher' });
    const card = await screen.findByRole('article', { name: '9M2 Mathematics' });
    expect(within(card).getByText('Year 9 · 1 student')).toBeVisible();
    expect(within(card).getByText('ABCD-2345')).toBeVisible();
    expect(within(card).getByText('Joining open')).toBeVisible();
    expect(
      within(card).getByRole('link', { name: 'Manage class 9M2 Mathematics' }),
    ).toHaveAttribute('href', CLASS_PAGE);
  });

  it('creates a class and opens it', async () => {
    const user = userEvent.setup();
    const { router, state } = renderApp('/teacher/classes', { signedInAs: 'teacher' });

    await user.type(await screen.findByLabelText('Class name'), '  7 Blue   Maths ');
    await user.selectOptions(screen.getByLabelText('Year level'), 'Year 7');
    await user.click(screen.getByRole('button', { name: 'Create class' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher/classes/class-2');
    });
    expect(await screen.findByRole('heading', { level: 1, name: '7 Blue Maths' })).toBeVisible();
    expect(screen.getByText('No students yet', { exact: false })).toBeVisible();
    expect(state.classes[0]).toMatchObject({ name: '7 Blue Maths', yearLevel: 7 });
  });

  it('checks the name and year level before creating a class', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/teacher/classes', { signedInAs: 'teacher' });

    await user.click(await screen.findByRole('button', { name: 'Create class' }));
    const name = screen.getByLabelText('Class name');
    await waitFor(() => {
      expect(name).toHaveFocus();
    });
    expect(name).toHaveAccessibleDescription(/Enter a class name of up to 60 characters\./);

    await user.type(name, 'Extension');
    await user.click(screen.getByRole('button', { name: 'Create class' }));
    const yearLevel = screen.getByLabelText('Year level');
    await waitFor(() => {
      expect(yearLevel).toHaveFocus();
    });
    expect(yearLevel).toHaveAttribute('aria-invalid', 'true');
    expect(state.classes).toHaveLength(1);
  });

  it('is only for teachers', async () => {
    const { router } = renderApp('/teacher/classes', { signedInAs: 'student' });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/teacher/classes', { signedInAs: 'teacher' });
    await screen.findByRole('article', { name: '9M2 Mathematics' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('teacher class page', () => {
  it('shows the class, its code and its students', async () => {
    renderApp(CLASS_PAGE, { signedInAs: 'teacher' });
    expect(await screen.findByRole('heading', { level: 1, name: '9M2 Mathematics' })).toBeVisible();
    expect(screen.getByText('Year 9 · 1 student')).toBeVisible();
    expect(screen.getByText('ABCD-2345')).toBeVisible();
    expect(screen.getByText('Mia Chen', { selector: 'p' })).toBeVisible();
    expect(screen.getByLabelText('Mia Chen’s year level')).toHaveDisplayValue('Year 9');
  });

  it('changes a student’s year level', async () => {
    const user = userEvent.setup();
    const { state } = renderApp(CLASS_PAGE, { signedInAs: 'teacher' });

    await user.selectOptions(await screen.findByLabelText('Mia Chen’s year level'), 'Year 10');
    await user.click(screen.getByRole('button', { name: 'Save Mia Chen’s year level' }));

    expect(await screen.findByText('Saved. Mia Chen is in Year 10.')).toBeVisible();
    expect(state.classes[0]?.students[0]?.yearLevel).toBe(10);
  });

  it('removes a student after confirming', async () => {
    const user = userEvent.setup();
    const { state } = renderApp(CLASS_PAGE, { signedInAs: 'teacher' });

    await user.click(await screen.findByRole('button', { name: 'Remove Mia Chen' }));
    await user.click(screen.getByRole('button', { name: 'Remove student' }));

    const message = await screen.findByText('Mia Chen was removed from the class.');
    await waitFor(() => {
      expect(message.closest('[role="status"]')).toHaveFocus();
    });
    expect(screen.queryByText('Mia Chen')).not.toBeInTheDocument();
    expect(state.classes[0]?.students).toEqual([]);
  });

  it('copies the class code', async () => {
    const user = userEvent.setup();
    renderApp(CLASS_PAGE, { signedInAs: 'teacher' });
    await user.click(await screen.findByRole('button', { name: 'Copy code' }));
    expect(await screen.findByText('Copied to the clipboard.')).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe('ABCD-2345');
  });

  it('makes a new code after confirming, so the old one stops working', async () => {
    const user = userEvent.setup();
    const { state } = renderApp(CLASS_PAGE, { signedInAs: 'teacher' });

    await user.click(await screen.findByRole('button', { name: 'Make a new code' }));
    await user.click(screen.getByRole('button', { name: 'Make new code' }));

    expect(
      await screen.findByText('The new class code is WXYZ-6789. The old code no longer works.'),
    ).toBeVisible();
    expect(await screen.findByText('WXYZ-6789', { selector: 'span' })).toBeVisible();
    expect(state.classes[0]?.joinCode).toBe('WXYZ6789');
    expect(screen.getByRole('button', { name: 'Make a new code' })).toHaveFocus();
  });

  it('saves the class settings, moving students on the class’s year level with it', async () => {
    const user = userEvent.setup();
    const { state } = renderApp(CLASS_PAGE, { signedInAs: 'teacher' });

    const name = await screen.findByLabelText('Class name');
    await user.clear(name);
    await user.type(name, '10M2 Mathematics');
    await user.selectOptions(screen.getByLabelText(/^Class year level/), 'Year 10');
    await user.click(screen.getByLabelText('Join with the class code'));
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByText('Class settings saved.')).toBeVisible();
    expect(
      await screen.findByRole('heading', { level: 1, name: '10M2 Mathematics' }),
    ).toBeVisible();
    expect(state.classes[0]).toMatchObject({
      name: '10M2 Mathematics',
      yearLevel: 10,
      joiningEnabled: false,
      studentsCanLeave: true,
    });
    expect(state.classes[0]?.students[0]?.yearLevel).toBe(10);
    expect(screen.getAllByText('Joining off')[0]).toBeVisible();
  });

  it('shows only the result of the form used last', async () => {
    const user = userEvent.setup();
    renderApp(CLASS_PAGE, { signedInAs: 'teacher' });

    await user.click(await screen.findByRole('button', { name: 'Save settings' }));
    expect(await screen.findByText('Class settings saved.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Save Mia Chen’s year level' }));
    expect(await screen.findByText('Saved. Mia Chen is in Year 9.')).toBeVisible();
    expect(screen.queryByText('Class settings saved.')).not.toBeInTheDocument();
  });

  it('treats another teacher’s class as not found', async () => {
    const state = teacherState();
    const [taught] = state.classes;
    if (taught) taught.teacherId = 'user-someone-else';
    renderApp(CLASS_PAGE, { signedInAs: 'teacher', state });
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    expect(screen.queryByText('ABCD-2345')).not.toBeInTheDocument();
  });

  it('has no detectable accessibility problems', async () => {
    renderApp(CLASS_PAGE, { signedInAs: 'teacher' });
    await screen.findByRole('heading', { level: 1, name: '9M2 Mathematics' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
