import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { addFakeAttempt, addFakeTask, createFakeState, testStudent } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

describe('creating a task', () => {
  it('publishes a lesson for the class and opens the task', async () => {
    const user = userEvent.setup();
    const { router, state } = renderApp('/teacher/tasks/new', { signedInAs: 'teacher' });

    // The teacher's only class and only lesson are chosen already; the title follows the lesson.
    expect(await screen.findByLabelText('Class')).toHaveDisplayValue(/9M2 Mathematics/);
    expect(screen.getByRole('radio', { name: /Solving linear equations/ })).toBeChecked();
    const title = screen.getByLabelText('Task title');
    await user.clear(title);
    await user.type(title, '  Equations   homework ');
    await user.type(screen.getByLabelText('Instructions (optional)'), 'Show your working.');
    await user.click(screen.getByRole('button', { name: 'Publish task' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher/tasks/task-1');
    });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Equations homework' }),
    ).toBeVisible();
    expect(screen.getByText('0 of 1')).toBeVisible();
    expect(state.tasks[0]).toMatchObject({
      title: 'Equations homework',
      instructions: 'Show your working.',
      state: 'published',
      audience: 'class',
    });
  });

  it('explains what needs fixing beside each field', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/teacher/tasks/new', { signedInAs: 'teacher' });
    const title = await screen.findByLabelText('Task title');
    await user.clear(title);
    await user.click(screen.getByRole('button', { name: 'Publish task' }));
    await waitFor(() => {
      expect(title).toHaveFocus();
    });
    expect(title).toHaveAccessibleDescription(/Give the task a title of up to 80 characters\./);

    await user.type(title, 'Homework');
    const due = screen.getByLabelText('Due date');
    await user.clear(due);
    await user.type(due, '2026-10-01');
    await user.click(screen.getByRole('button', { name: 'Publish task' }));
    await waitFor(() => {
      expect(due).toHaveFocus();
    });
    expect(due).toHaveAccessibleDescription(/Choose a due date in the future/);

    await user.clear(due);
    await user.type(due, '2026-11-02');
    await user.click(screen.getByRole('radio', { name: /Chosen students/ }));
    await user.click(screen.getByRole('button', { name: 'Publish task' }));
    expect(
      await screen.findByText('Choose at least one student who is in this class.'),
    ).toBeVisible();
    expect(state.tasks).toHaveLength(0);
  });

  it('sets work for chosen students only', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/teacher/tasks/new', { signedInAs: 'teacher' });
    await user.click(await screen.findByRole('radio', { name: /Chosen students/ }));
    await user.click(screen.getByRole('checkbox', { name: /Mia Chen/ }));
    await user.click(screen.getByRole('button', { name: 'Publish task' }));
    await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' });
    expect(state.tasks[0]).toMatchObject({
      audience: 'students',
      studentIds: [`user-${testStudent.email}`],
    });
  });

  it('saves a draft that students can’t see, and publishes it later', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/teacher/tasks/new', { signedInAs: 'teacher' });
    await user.click(await screen.findByRole('button', { name: 'Save as draft' }));
    expect(await screen.findByText(/Draft · students can’t see it yet/)).toBeVisible();
    expect(state.tasks[0]?.state).toBe('draft');

    await user.click(screen.getByRole('button', { name: 'Publish task' }));
    expect(await screen.findByText('Published. Students can see this task now.')).toBeVisible();
    expect(state.tasks[0]?.state).toBe('published');
  });
});

describe('a task’s page', () => {
  it('shows each student’s saved result', async () => {
    const state = createFakeState();
    addFakeTask(state);
    addFakeAttempt(state, { solved: 5, wrong: 1, at: new Date(2026, 9, 27) });
    renderApp('/teacher/tasks/task-1', { signedInAs: 'teacher', state });
    const table = await screen.findByRole('table', { name: 'Each student’s result' });
    const row = within(table).getByRole('row', { name: /Mia Chen/ });
    expect(row).toHaveTextContent('Completed');
    expect(row).toHaveTextContent('5 of 5');
    expect(row).toHaveTextContent('80% (4 of 5)');
    expect(screen.getByText('1 of 1')).toBeVisible();
  });

  it('moves the due date', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    addFakeTask(state);
    renderApp('/teacher/tasks/task-1', { signedInAs: 'teacher', state });
    const due = await screen.findByLabelText('Due date');
    await user.clear(due);
    await user.type(due, '2026-11-06');
    await user.click(screen.getByRole('button', { name: 'Save due date' }));
    expect(await screen.findByText('Due date saved.')).toBeVisible();
    expect(new Date(state.tasks[0]?.dueAt ?? '').getDate()).toBe(6);
  });

  it('deletes a task after confirming', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    addFakeTask(state);
    const { router } = renderApp('/teacher/tasks/task-1', { signedInAs: 'teacher', state });
    await user.click(
      await screen.findByRole('button', { name: 'Delete task Linear equations homework' }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete task' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher/tasks');
    });
    expect(await screen.findByText('No tasks yet')).toBeVisible();
    expect(state.tasks).toHaveLength(0);
  });

  it('treats another teacher’s task as not found', async () => {
    const state = createFakeState();
    addFakeTask(state);
    const [taught] = state.classes;
    if (taught) taught.teacherId = 'user-someone-else';
    renderApp('/teacher/tasks/task-1', { signedInAs: 'teacher', state });
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  });

  it('has no detectable accessibility problems', async () => {
    const state = createFakeState();
    addFakeTask(state);
    renderApp('/teacher/tasks/task-1', { signedInAs: 'teacher', state });
    await screen.findByRole('table');
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('the Tasks page', () => {
  it('lists tasks and filters them', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    addFakeTask(state, { title: 'Equations homework' });
    addFakeTask(state, { title: 'Revision', state: 'draft', publishedAt: null });
    renderApp('/teacher/tasks', { signedInAs: 'teacher', state });
    const table = await screen.findByRole('table', { name: 'Your tasks' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);

    await user.selectOptions(screen.getByLabelText('Status'), 'Drafts');
    expect(within(screen.getByRole('table')).getByRole('link', { name: 'Revision' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Equations homework' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Status'), 'All tasks');
    await user.type(screen.getByLabelText('Search tasks'), 'homework');
    expect(screen.getByRole('link', { name: 'Equations homework' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Revision' })).not.toBeInTheDocument();
    expect(screen.getByText('1 task of 2 shown')).toBeVisible();
  });

  it('shows a class’s tasks in its workspace', async () => {
    const state = createFakeState();
    addFakeTask(state, { title: 'Equations homework' });
    renderApp('/teacher/classes/class-9m2/tasks', { signedInAs: 'teacher', state });
    expect(await screen.findByRole('link', { name: 'Equations homework' })).toHaveAttribute(
      'href',
      '/teacher/tasks/task-1',
    );
    expect(screen.getByRole('link', { name: 'Create task' })).toHaveAttribute(
      'href',
      '/teacher/tasks/new?class=class-9m2',
    );
  });

  it('has no detectable accessibility problems', async () => {
    const state = createFakeState();
    addFakeTask(state);
    renderApp('/teacher/tasks', { signedInAs: 'teacher', state });
    await screen.findByRole('table');
    expect(await findAccessibilityProblems()).toEqual([]);
  });

  it('has no detectable accessibility problems on the form', async () => {
    renderApp('/teacher/tasks/new', { signedInAs: 'teacher' });
    await screen.findByLabelText('Task title');
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
