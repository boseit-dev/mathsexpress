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
      screen
        .getAllByRole('link', { name: /Year 9 Mathematics/ })
        .some((link) => link.getAttribute('href') === '/student/textbook/year-9'),
    ).toBe(true);
  });

  it('uses all five MathsExpress palette treatments for textbook covers', async () => {
    renderApp('/student/textbook');
    await screen.findByRole('heading', { level: 1, name: 'Textbook' });
    const palettes = Array.from(document.querySelectorAll('[data-palette]')).map((element) =>
      element.getAttribute('data-palette'),
    );
    expect(new Set(palettes)).toEqual(new Set(['0', '1', '2', '3', '4']));
  });

  it('filters to books with published maths, then resets the library search', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook');
    await screen.findByRole('heading', { level: 1, name: 'Textbook' });
    await user.click(screen.getByRole('button', { name: 'Ready to learn' }));
    expect(screen.getByText('Showing 25 of 25 books')).toBeVisible();
    expect(
      screen
        .getAllByRole('link', { name: /Year 9 Mathematics/ })
        .some((link) => link.getAttribute('href') === '/student/textbook/year-9'),
    ).toBe(true);
    const search = screen.getByRole('searchbox', { name: 'Find a textbook' });
    await user.type(search, 'standard 2');
    expect(screen.getByText('Showing 1 of 25 books')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Show all books' }));
    expect(search).toHaveValue('');
    expect(screen.getByText('Showing 25 of 25 books')).toBeVisible();
  });

  it('shows the teacher-assigned year without changing student permissions', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook');
    await screen.findByRole('heading', { level: 1, name: 'Textbook' });
    await user.click(screen.getByRole('button', { name: 'My year' }));
    expect(screen.getByText('Showing 2 of 25 books')).toBeVisible();
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
    await user.click(within(contents).getByRole('link', { name: /Solving linear equations/ }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Exercise 1A' })).toBeVisible();
  });

  it('opens a published book chapter directly and links to guided practice', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/year-9');
    const start = await screen.findByRole('link', {
      name: /Start reading Solving linear equations/,
    });
    await user.click(start);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /Practise this topic in Learn/ })).toHaveAttribute(
      'href',
      '/student/learn/linear-equations-basics',
    );
    expect(screen.getByRole('navigation', { name: 'Move between chapters' })).toHaveTextContent(
      'Previous: Getting started with your textbook',
    );
  });

  it('checks a student answer, shows a hint and allows a retry', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/year-9/solving-linear-equations');
    await screen.findByRole('heading', { name: 'Exercise 1A' });
    const answer = screen.getAllByRole('textbox', { name: 'Your answer: x =' })[0];
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

  it('opens a teaching chapter for an additional focus area', async () => {
    renderApp('/student/textbook/year-4/focus-5');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Geometric measure' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'One worked example, explained' })).toBeVisible();
    expect(screen.getByText(/starter lesson for Geometric measure/)).toBeVisible();
  });

  it('teaches with an original guided notebook before independent questions', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/year-9/solving-linear-equations');
    expect(
      await screen.findByRole('navigation', { name: 'Jump to chapter section' }),
    ).toBeVisible();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '1. Understanding equations' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Undo the operations, one at a time' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Your turn, with support' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Exercise 1A' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'The four things to remember' })).toBeVisible();

    const slider = screen.getByRole('slider', { name: /Number added to x/ });
    expect(slider).toHaveValue('5');
    await user.click(screen.getByText('Explore the balance'));
    expect(screen.getByText(/x = 12 − 5 =/)).toBeVisible();

    const step = screen.getByRole('textbox', { name: 'First step: 4x =' });
    await user.type(step, '19');
    await user.click(screen.getByRole('button', { name: 'Check this step' }));
    expect(screen.getByText(/Not yet. Focus on undoing/)).toBeVisible();
    await user.clear(step);
    await user.type(step, '24');
    await user.click(screen.getByRole('button', { name: 'Check this step' }));
    expect(screen.getByText(/Exactly! 4x = 24/)).toBeVisible();

    await user.click(screen.getByText(/Explore other topics in Year 9 Mathematics/));
    expect(screen.getByRole('link', { name: 'Probability' })).toBeVisible();
  });

  it('teaches real concepts across primary, secondary and senior books', async () => {
    const cases = [
      { url: '/student/textbook/kindergarten/focus-1', heading: 'Count small groups' },
      { url: '/student/textbook/year-6/focus-1', heading: 'Compare tenths and hundredths' },
      { url: '/student/textbook/year-10/core-1', heading: 'Explore compound growth' },
      {
        url: '/student/textbook/year-12-extension-2/focus-1',
        heading: 'Disprove claims with counterexamples',
      },
    ];
    for (const item of cases) {
      const { unmount } = renderApp(item.url);
      expect(await screen.findByRole('heading', { name: item.heading })).toBeVisible();
      expect(screen.getByRole('heading', { name: 'One worked example, explained' })).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Try one with support' })).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Try it independently' })).toBeVisible();
      unmount();
    }
  });

  it('opens senior course and Stage 5 Paths teaching with worked examples', async () => {
    for (const url of [
      '/student/textbook/year-9/path-9',
      '/student/textbook/year-12-standard-2/focus-10',
      '/student/textbook/year-12-extension-2/focus-3',
    ]) {
      const view = renderApp(url);
      expect(
        await screen.findByRole('heading', { name: 'One worked example, explained' }),
      ).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Try one with support' })).toBeVisible();
      view.unmount();
    }
  });

  it('reveals worked steps gradually and supports a confidence check', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/kindergarten/focus-1');
    expect(
      await screen.findByRole('heading', { name: 'One worked example, explained' }),
    ).toBeVisible();
    expect(screen.getByText('Step 1 of 3')).toBeVisible();
    expect(screen.queryByText('The last word was four: there are 4 cars.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show next step' }));
    expect(screen.getByText('Step 2 of 3')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Show all steps' }));
    expect(screen.getByText('The last word was four: there are 4 cars.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Start the example again' }));
    expect(screen.getByText('Step 1 of 3')).toBeVisible();

    const slider = screen.getByRole('slider', { name: /Number of objects/ });
    expect(slider).toHaveValue('4');
    expect(screen.getByRole('img', { name: '4 objects' })).toBeVisible();

    const confidence = screen.getByRole('radio', { name: /I can explain the method/ });
    await user.click(confidence);
    expect(confidence).toBeChecked();
    expect(screen.getByText(/Try teaching the idea aloud/)).toBeVisible();
  });

  it('provides additional explanation after two incorrect guided attempts', async () => {
    const user = userEvent.setup();
    renderApp('/student/textbook/kindergarten/focus-1');
    await screen.findByRole('heading', { name: 'Try one with support' });
    const answer = screen.getAllByRole('textbox', { name: 'Your answer' })[0];
    if (!answer) throw new Error('Guided answer is missing');
    await user.type(answer, '9');
    await user.click(screen.getByRole('button', { name: 'Check this step' }));
    expect(screen.queryByText('Still unsure? Read the full explanation')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check this step' }));
    expect(screen.getByText('Still unsure? Read the full explanation')).toBeVisible();
    await user.click(screen.getByText('Still unsure? Read the full explanation'));
    expect(screen.getByText('One, two, three: 3 dots.')).toBeVisible();
    await user.clear(answer);
    await user.type(answer, '3');
    await user.click(screen.getByRole('button', { name: 'Check this step' }));
    expect(screen.getByText(/That is correct!/)).toBeVisible();
  });

  it('lets students explore exact decimal and compound growth models', async () => {
    const user = userEvent.setup();
    const decimal = renderApp('/student/textbook/year-5/focus-1');
    expect(await screen.findByText('Build a decimal')).toBeVisible();
    const tenths = screen.getByRole('slider', { name: /Tenths shaded/ });
    expect(tenths).toHaveValue('4');
    expect(screen.getByRole('img', { name: '4 of ten equal pieces shaded' })).toBeVisible();
    decimal.unmount();
    renderApp('/student/textbook/year-10/core-1');
    expect(await screen.findByText('Watch compound growth')).toBeVisible();
    const years = screen.getByRole('slider', { name: /Number of years/ });
    expect(years).toHaveValue('2');
    expect(screen.getByRole('img', { name: 'Investment is $121.00 after 2 years' })).toBeVisible();
  });

  it('has no detectable accessibility problems in the published reader', async () => {
    renderApp('/student/textbook/year-9/solving-linear-equations');
    await screen.findByRole('heading', { name: 'Exercise 1A' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });

  it('has no detectable accessibility problems on the library page', async () => {
    renderApp('/student/textbook');
    await screen.findByRole('heading', { level: 1, name: 'Textbook' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
