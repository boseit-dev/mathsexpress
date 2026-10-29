import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createFakeState } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';
import { findAccessibilityProblems } from '@/test/axe';

describe('real student coin shop', () => {
  it('shows the real starter wallet and a catalogue, not preview data', async () => {
    renderApp('/student/more/shop');
    expect(await screen.findByRole('heading', { name: 'Coin Shop' })).toBeVisible();
    expect(await screen.findByText('Ocean Blue')).toBeVisible();
    const walletLabel = screen.getByText('Your coin balance');
    const wallet = walletLabel.parentElement;
    if (!wallet) throw new Error('Missing shop wallet');
    expect(within(wallet).getByText('100')).toBeVisible();
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Buy item' }).length).toBeGreaterThan(0);
  });

  it('buys a cosmetic once, saves it to the locker and equips it', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    renderApp('/student/more/shop', { state });
    await screen.findByText('Ocean Blue');
    const card = screen.getByRole('heading', { name: 'Ocean Blue' }).closest('article');
    if (!card) throw new Error('Shop card missing');
    await user.click(within(card).getByRole('button', { name: 'Buy item' }));
    await user.click(within(card).getByRole('button', { name: 'Confirm buy' }));
    expect(await screen.findByText(/Purchased Ocean Blue/)).toBeVisible();
    const walletLabel = screen.getByText('Your coin balance');
    const wallet = walletLabel.parentElement;
    if (!wallet) throw new Error('Missing shop wallet');
    expect(within(wallet).getByText('60')).toBeVisible();
    await user.click(within(card).getByRole('button', { name: 'Equip' }));
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-shop-theme', 'theme-ocean');
    });
    expect(within(card).getByRole('button', { name: /Equipped/ })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'My locker' }));
    expect(screen.getByRole('heading', { name: 'Ocean Blue' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Sunset Glow' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Coin history' }));
    expect(screen.getByText('-40 coins')).toBeVisible();
    expect(state.shopWallets.size).toBe(1);
  });

  it('does not allow spending more coins than the account has', async () => {
    const user = userEvent.setup();
    renderApp('/student/more/shop');
    const card = await screen.findByRole('heading', { name: 'Sunset Glow' });
    const item = card.closest('article');
    if (!item) throw new Error('Shop card missing');
    await user.click(within(item).getByRole('button', { name: 'Buy item' }));
    await user.click(within(item).getByRole('button', { name: 'Confirm buy' }));
    expect(await screen.findByText(/Purchased Sunset Glow/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Themes' }));
    expect(screen.getAllByRole('button', { name: /Need .* more/ }).length).toBeGreaterThan(0);
  });

  it('has no detectable accessibility issues', async () => {
    renderApp('/student/more/shop');
    await screen.findByRole('heading', { name: 'Ocean Blue' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
