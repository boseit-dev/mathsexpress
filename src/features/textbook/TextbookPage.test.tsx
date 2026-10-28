import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { renderApp } from '@/test/renderApp';

describe('student textbook library', () => {
  it('opens the book library from the top navigation', async () => {
    const user = userEvent.setup();
    renderApp('/student');
    await user.click(await screen.findByRole('link', { name: 'Textbook' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Textbook' })).toBeVisible();
    expect(
      screen.getAllByRole('link', { name: /Year 9 Mathematics/ }).some(
        (link) => link.getAttribute('href') === '/student/textbook/year-9',
      ),
    ).toBe(true);
  });

  it('opens each Year 12 Standard book independently', async () => {
    renderApp('/student/textbook');
    await screen.findByRole('heading', { level: 1, name: 'Textbook' });
    expect(screen.getByRole('link', { name: /Year 12 Standard 1/ })).toHaveAttribute(
      'href',
      '/student/textbook/year-12-standard-1',
    );
    expect(screen.getByRole('link', { name: /Year 12 Standard 2/ })).toHaveAttribute(
      'href',
      '/student/textbook/year-12-standard-2',
    );
  });

  it('navigates book contents and shows the ready Year 9 chapter', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/year-9');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Year 9 Mathematics' }),
    ).toBeVisible();
    const contents = screen.getByRole('heading', { name: 'Contents' }).closest('section');
    if (!contents) throw new Error('Textbook contents section not found');
    await user.click(
      within(contents).getByRole('link', { name: /Solving linear equations/ }),
    );
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Exercise 1A' })).toBeVisible();
  });

  it('checks a student answer, shows a hint and allows a retry', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/year-9/solving-linear-equations');
    await screen.findByRole('heading', { name: 'Exercise 1A' });
    const answer = screen.getAllByRole('spinbutton')[0];
    const check = screen.getAllByRole('button', { name: 'Check' })[0];
    const hint = screen.getAllByRole('button', { name: 'Hint' })[0];
    if (!answer || !check || !hint) throw new Error('Equation controls not found');
    await user.type(answer, '9');
    await user.click(check);
    expect(screen.getByText('Not quite. Try again or open the hint.')).toBeVisible();
    await user.click(hint);
    expect(screen.getByText('Subtract 7 from both sides.')).toBeVisible();
    await user.clear(answer);
    await user.type(answer, '8');
    await user.click(check);
    expect(screen.getByText('Correct! x = 15 − 7 = 8')).toBeVisible();
  });

  it('does not claim that unpublished chapters are finished', async () => {
    renderApp('/student/textbook/year-4/measurement-and-space');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Measurement and space' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Chapter in preparation' })).toBeVisible();
  });

  it('has no detectable accessibility problems on the library page', async () => {
    renderApp('/student/textbook');
    await screen.findByRole('heading', { level: 1, name: 'Textbook' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
