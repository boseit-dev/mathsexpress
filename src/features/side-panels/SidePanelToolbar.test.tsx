import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { renderApp } from '@/test/renderApp';

async function openTools() {
  const user = userEvent.setup();
  renderApp('/student');
  const toolbar = await screen.findByRole('complementary', { name: 'Student quick tools' });
  return { user, toolbar };
}

describe('student quick tools', () => {
  it('offers five working panel buttons, all with accessible names', async () => {
    const { user, toolbar } = await openTools();
    for (const name of ['Leaderboard', 'Shop', 'Daily challenges', 'Achievements', 'Rewards']) {
      const button = within(toolbar).getByRole('button', { name });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      await user.click(button);
      const dialog = screen.getByRole('dialog', { name });
      expect(dialog).toBeVisible();
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.click(within(dialog).getByRole('button', { name: 'Close panel' }));
      await waitFor(() => {
        expect(dialog).not.toHaveAttribute('open');
      });
      expect(button).toHaveFocus();
    }
  });

  it('labels preview content and never enables shop purchases', async () => {
    const { user, toolbar } = await openTools();
    await user.click(within(toolbar).getByRole('button', { name: 'Shop' }));
    const dialog = screen.getByRole('dialog', { name: 'Shop' });
    expect(dialog).toHaveTextContent('Preview only');
    expect(dialog).toHaveTextContent('Sample data');
    expect(within(dialog).getAllByRole('button', { name: /coming soon/i }).length).toBeGreaterThan(
      0,
    );
    for (const button of within(dialog).getAllByRole('button', { name: /coming soon/i })) {
      expect(button).toBeDisabled();
    }
  });

  it('closes with Escape and preserves the focus return', async () => {
    const { user, toolbar } = await openTools();
    const button = within(toolbar).getByRole('button', { name: 'Rewards' });
    await user.click(button);
    const dialog = screen.getByRole('dialog', { name: 'Rewards' });
    fireEvent.cancel(dialog);
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(button).toHaveFocus();
  });

  it('clears the open panel when navigation changes', async () => {
    const { user, toolbar } = await openTools();
    await user.click(within(toolbar).getByRole('button', { name: 'Leaderboard' }));
    expect(screen.getByRole('dialog', { name: 'Leaderboard' })).toBeVisible();
    const dialog = screen.getByRole('dialog', { name: 'Leaderboard' });
    await user.click(within(dialog).getByRole('link', { name: 'View your class' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Class' })).toBeVisible();
    expect(screen.queryByRole('dialog', { name: 'Leaderboard' })).not.toBeInTheDocument();
  });

  it('does not render floating controls over an active guided lesson', async () => {
    renderApp('/student/learn/sample-unknown-lesson');
    await screen.findByRole('navigation', { name: 'Student' });
    expect(screen.queryByRole('complementary', { name: 'Student quick tools' })).toBeNull();
  });

  it('has no detectable accessibility issues with a panel open', async () => {
    const { user, toolbar } = await openTools();
    await user.click(within(toolbar).getByRole('button', { name: 'Achievements' }));
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
