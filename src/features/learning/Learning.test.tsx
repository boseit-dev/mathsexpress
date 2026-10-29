import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { paths } from '@/config/paths';
import { createFakeState } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

describe('Learn page', () => {
  it('shows available real lessons for a teacher-assigned year, without a year selector', async () => {
    renderApp(paths.student.learn);
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeVisible();
    expect(screen.getByText('Year 9')).toBeVisible();
    expect(screen.queryByRole('combobox', { name: /year/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start lesson' })).toHaveAttribute(
      'href',
      paths.student.lesson('linear-equations-basics'),
    );
  });

  it('links an assigned Year 9 student to the original textbook chapter', async () => {
    renderApp(paths.student.learn);
    await screen.findByRole('heading', { level: 1, name: 'Learn' });
    expect(screen.getByRole('link', { name: /Open Year 9 chapter/ })).toHaveAttribute(
      'href',
      paths.student.textbookChapter('year-9', 'solving-linear-equations'),
    );
  });

  it('asks students without a class to join one', async () => {
    const state = createFakeState();
    state.classes[0]?.students.splice(0);
    renderApp(paths.student.learn, { state });
    expect(
      await screen.findByRole('heading', { name: 'Join a class to get started' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /join a class/i })).toHaveAttribute(
      'href',
      paths.student.class,
    );
  });

  it('does not show a Year 9 lesson to a Year 10 student', async () => {
    const state = createFakeState();
    const member = state.classes[0]?.students[0];
    if (member) member.yearLevel = 10;
    renderApp(paths.student.learn, { state });
    expect(await screen.findByText('Lessons for your year are being prepared')).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Start lesson' })).not.toBeInTheDocument();
  });
});

describe('guided lesson practice', () => {
  it('lets students return to the corresponding textbook explanation', async () => {
    renderApp(paths.student.lesson('linear-equations-basics'));
    await screen.findByRole('heading', { name: 'Solving linear equations', level: 1 });
    expect(
      screen.getByRole('link', { name: /Read the matching textbook chapter/ }),
    ).toHaveAttribute('href', paths.student.textbookChapter('year-9', 'solving-linear-equations'));
  });

  it('checks answers, gives hints and explains the correct answer', async () => {
    const user = userEvent.setup();
    renderApp(paths.student.lesson('linear-equations-basics'));
    expect(
      await screen.findByRole('heading', { name: 'Solving linear equations', level: 1 }),
    ).toBeVisible();
    expect(screen.getByText('2x + 4 = 14')).toBeVisible();
    expect(screen.getByRole('button', { name: /check answer/i })).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: 'Your answer' }), '4');
    await user.click(screen.getByRole('button', { name: /check answer/i }));
    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
    await user.click(screen.getByRole('button', { name: 'Get a hint' }));
    expect(
      screen.getAllByRole('status').some((item) => item.textContent.includes('Undo the +4')),
    ).toBe(true);
    await user.clear(screen.getByRole('textbox', { name: 'Your answer' }));
    await user.type(screen.getByRole('textbox', { name: 'Your answer' }), '5');
    await user.click(screen.getByRole('button', { name: /check answer/i }));
    expect(screen.getByText(/Correct! Here's why/)).toBeVisible();
    expect(screen.getByRole('button', { name: /next question/i })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getByText('5x − 7 = 18')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'Lesson question progress' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
  });

  it('finishes the full lesson and allows another attempt', async () => {
    const user = userEvent.setup();
    renderApp(paths.student.lesson('linear-equations-basics'));
    await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' });
    for (const solution of ['5', '5', '-3', '5', '-4']) {
      const field = screen.getByRole('textbox', { name: 'Your answer' });
      await user.type(field, solution);
      await user.click(screen.getByRole('button', { name: /check answer/i }));
      await user.click(screen.getByRole('button', { name: /next question|finish lesson/i }));
    }
    const result = screen.getByText('Lesson completed!').parentElement;
    expect(result).not.toBeNull();
    expect(screen.getByText(/not saved to your account yet/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /practise again/i }));
    expect(screen.getByText('2x + 4 = 14')).toBeVisible();
  });

  it('does not open a lesson outside the assigned year', async () => {
    const state = createFakeState();
    const member = state.classes[0]?.students[0];
    if (member) member.yearLevel = 8;
    renderApp(paths.student.lesson('linear-equations-basics'), { state });
    expect(await screen.findByRole('heading', { name: 'Lesson unavailable' })).toBeVisible();
  });
});
