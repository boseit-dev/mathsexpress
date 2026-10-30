import { act, screen, waitFor, within } from '@testing-library/react';
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

  it('opens the real wallet preview and links to the working shop', async () => {
    const { user, toolbar } = await openTools();
    await user.click(within(toolbar).getByRole('button', { name: 'Shop' }));
    const dialog = screen.getByRole('dialog', { name: 'Shop' });
    expect(await within(dialog).findByText('100 coins')).toBeVisible();
    expect(within(dialog).getByRole('link', { name: 'Open the shop' })).toHaveAttribute(
      'href',
      '/student/more/shop',
    );
    expect(within(dialog).getByRole('link', { name: 'My collection' })).toHaveAttribute(
      'href',
      '/student/more/shop/collection',
    );
    expect(dialog).not.toHaveTextContent('Sample data');
  });

  it('switches panels inside the open panel without closing it', async () => {
    const { user, toolbar } = await openTools();
    const leaderboard = within(toolbar).getByRole('button', { name: 'Leaderboard' });
    await user.click(leaderboard);
    const dialog = screen.getByRole('dialog', { name: 'Leaderboard' });
    const switcher = within(dialog).getByRole('group', { name: 'Switch panel' });
    expect(within(switcher).getByRole('button', { name: 'Leaderboard' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await user.click(within(switcher).getByRole('button', { name: 'Achievements' }));
    expect(screen.getByRole('dialog', { name: 'Achievements' })).toBe(dialog);
    expect(dialog).toHaveAttribute('open');
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(within(switcher).getByRole('button', { name: 'Achievements' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Close panel' }));
    await waitFor(() => {
      expect(dialog).not.toHaveAttribute('open');
    });
    expect(leaderboard).toHaveFocus();
  });

  it('closes when the backdrop is clicked', async () => {
    const { user, toolbar } = await openTools();
    await user.click(within(toolbar).getByRole('button', { name: 'Shop' }));
    const dialog = screen.getByRole('dialog', { name: 'Shop' });
    act(() => {
      dialog.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    });
    await waitFor(() => {
      expect(dialog).not.toHaveAttribute('open');
    });
  });

  it('closes with Escape and preserves the focus return', async () => {
    const { user, toolbar } = await openTools();
    const button = within(toolbar).getByRole('button', { name: 'Rewards' });
    await user.click(button);
    const dialog = screen.getByRole('dialog', { name: 'Rewards' });
    act(() => {
      dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    });
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

  it('stays out of the way of the interactive textbook practice chapter', async () => {
    renderApp('/student/textbook/year-9/solving-linear-equations');
    await screen.findByRole('heading', { level: 1, name: 'Solving linear equations' });
    expect(screen.queryByRole('complementary', { name: 'Student quick tools' })).toBeNull();
  });

  it('has no detectable accessibility issues with a panel open', async () => {
    const { user, toolbar } = await openTools();
    await user.click(within(toolbar).getByRole('button', { name: 'Achievements' }));
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
