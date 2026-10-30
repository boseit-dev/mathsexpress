import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '@/domain/errors';
import { SHOP_CATALOGUE, makeFreshShopState, type ShopState } from '@/domain/shop';
import { findAccessibilityProblems } from '@/test/axe';
import { createFakeDependencies, createFakeState, testStudent } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

const SHOP = '/student/more/shop';
/** Each shop page draws 98 illustrated cards, which takes a few seconds on CI runners. */
const SLOW = { timeout: 15_000 };
const STUDENT_ID = `user-${testStudent.email}`;

/** A fake state where the test student already has a wallet with these changes. */
function withWallet(changes: Partial<ShopState>) {
  const state = createFakeState();
  const wallet = makeFreshShopState();
  state.shopWallets.set(STUDENT_ID, {
    ...wallet,
    ...changes,
    owned: [...wallet.owned, ...(changes.owned ?? [])],
  });
  return state;
}

function wallet(state: ReturnType<typeof createFakeState>) {
  const found = state.shopWallets.get(STUDENT_ID);
  if (!found) throw new Error('No wallet yet');
  return found;
}

function card(name: string) {
  return screen.getByRole('article', { name });
}

/** The big preview beside the grid. */
function stage() {
  return within(screen.getByRole('complementary', { name: 'Your look' })).getByRole('img');
}

async function openShop(state = createFakeState()) {
  const view = renderApp(SHOP, { state });
  await screen.findByRole('list', { name: 'Shop items' });
  return view;
}

describe('the shop', SLOW, () => {
  it('shows the real wallet and every item, with no sample data', async () => {
    await openShop();
    expect(screen.getByRole('heading', { level: 1, name: 'Shop' })).toBeVisible();
    expect(screen.getByText('Your coins').parentElement).toHaveTextContent('100');
    const items = within(screen.getByRole('list', { name: 'Shop items' })).getAllByRole('article');
    expect(items).toHaveLength(SHOP_CATALOGUE.length);
    expect(screen.getByText(`Showing all ${SHOP_CATALOGUE.length} items`)).toBeVisible();
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument();
  });

  it('tries items on together for free, then puts the student’s look back', async () => {
    const user = userEvent.setup();
    const { state } = await openShop();
    await user.click(screen.getByRole('button', { name: 'Try on Astronaut Capybara' }));
    const first = screen.getByRole('dialog', { name: 'Astronaut Capybara' });
    await user.click(within(first).getByRole('button', { name: 'Keep trying on' }));

    await user.click(screen.getByRole('button', { name: 'Try on Space Helmet' }));
    const second = screen.getByRole('dialog', { name: 'Space Helmet' });
    expect(within(second).getByText('Also trying on: Astronaut Capybara')).toBeVisible();
    expect(within(second).getByRole('img')).toHaveAccessibleName(
      /Trying on: Astronaut Capybara avatar, Space Helmet/,
    );
    await user.click(within(second).getByRole('button', { name: 'Keep trying on' }));

    await user.click(screen.getByRole('button', { name: 'Try on Cosmic Galaxy' }));
    await user.click(screen.getByRole('button', { name: 'Keep trying on' }));
    expect(stage()).toHaveAccessibleName(
      'Trying on: Astronaut Capybara avatar, Space Helmet, Cosmic Galaxy background, Classic Ring',
    );
    // Trying costs nothing and saves nothing.
    expect(wallet(state).balance).toBe(100);
    expect(wallet(state).equipped).toEqual({});

    await user.click(screen.getByRole('button', { name: 'Back to my look' }));
    expect(stage()).toHaveAccessibleName(
      'Your look: MathsExpress Capybara avatar, Lavender Hills background, Classic Ring',
    );
  });

  it('recolours the whole page while a theme is tried on, then puts it back', async () => {
    const user = userEvent.setup();
    const { state } = await openShop();
    await user.click(screen.getByRole('button', { name: 'Try on Forest Green' }));
    expect(document.documentElement).toHaveAttribute('data-shop-theme', 'theme-forest');
    expect(screen.getByText(/The whole page is showing Forest Green/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Keep trying on' }));
    expect(document.documentElement).toHaveAttribute('data-shop-theme', 'theme-forest');
    await user.click(screen.getByRole('button', { name: 'Back to my look' }));
    expect(document.documentElement).not.toHaveAttribute('data-shop-theme');
    expect(wallet(state).equipped).toEqual({});
  });

  it('cancelling a try-on removes just that item from the preview', async () => {
    const user = userEvent.setup();
    await openShop();
    await user.click(screen.getByRole('button', { name: 'Try on Royal Crown' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(stage()).toHaveAccessibleName(/^Your look/);
  });

  it('buys after confirming, charges once even when clicked twice, then equips', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const fake = createFakeDependencies(state).shop;
    const buy = vi.fn(fake.buy.bind(fake));
    renderApp(SHOP, { state, overrides: { shop: { ...fake, buy } } });
    await screen.findByRole('list', { name: 'Shop items' });

    await user.click(
      within(card('Pocket Calculator')).getByRole('button', { name: 'Buy Pocket Calculator' }),
    );
    const dialog = screen.getByRole('dialog', { name: 'Pocket Calculator' });
    expect(within(dialog).getByText(/You’ll have 25 coins left/)).toBeVisible();
    await user.dblClick(within(dialog).getByRole('button', { name: 'Confirm purchase' }));

    expect(await within(dialog).findByText(/Pocket Calculator is yours!/)).toBeVisible();
    expect(buy).toHaveBeenCalledTimes(1);
    expect(wallet(state).balance).toBe(25);
    expect(wallet(state).transactions.filter((entry) => entry.reason === 'purchase')).toHaveLength(
      1,
    );
    expect(screen.getByText('Your coins').parentElement).toHaveTextContent('25');

    await user.click(within(dialog).getByRole('button', { name: 'Equip now' }));
    expect(await within(dialog).findByText(/Pocket Calculator is equipped/)).toBeVisible();
    expect(wallet(state).equipped).toEqual({ accessory: 'acc-calculator' });
    // The header avatar wears it straight away.
    const account = screen.getByRole('button', { name: /Account:/ });
    expect(account.querySelector('svg[data-look]')?.getAttribute('data-look')).toContain(
      'acc-calculator',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Done' }));
    expect(
      within(card('Pocket Calculator')).getByRole('button', { name: 'Unequip Pocket Calculator' }),
    ).toBeVisible();
  });

  it('never lets a student spend coins they don’t have', async () => {
    const user = userEvent.setup();
    const { state } = await openShop();
    const crown = card('Royal Crown');
    expect(crown).toHaveTextContent('1,900 more');
    expect(
      within(crown).queryByRole('button', { name: 'Buy Royal Crown' }),
    ).not.toBeInTheDocument();
    await user.click(within(crown).getByRole('button', { name: 'Try on Royal Crown' }));
    expect(screen.getByRole('button', { name: /Need 1,900 more coins/ })).toBeDisabled();
    expect(wallet(state).balance).toBe(100);
  });

  it('equips and unequips owned items, and keeps them after reloading', async () => {
    const user = userEvent.setup();
    const state = withWallet({ owned: ['fx-sparkles'] });
    const first = await openShop(state);
    await user.click(screen.getByRole('button', { name: 'Equip Little Sparkles' }));
    expect(await screen.findByText('Little Sparkles is equipped.')).toBeVisible();
    expect(wallet(state).equipped).toEqual({ effect: 'fx-sparkles' });
    first.unmount();

    await openShop(state);
    await user.click(screen.getByRole('button', { name: 'Unequip Little Sparkles' }));
    expect(await screen.findByText('Little Sparkles is off. You still own it.')).toBeVisible();
    expect(wallet(state).equipped).toEqual({});
  });

  it('shows the default capybara as worn without offering to take it off', async () => {
    await openShop();
    const capybara = card('MathsExpress Capybara');
    expect(capybara).toHaveTextContent('Default');
    expect(within(capybara).queryByRole('button', { name: /Unequip/ })).not.toBeInTheDocument();
  });
});

describe('browsing the shop', SLOW, () => {
  function shown() {
    return within(screen.getByRole('list', { name: 'Shop items' }))
      .getAllByRole('article')
      .map((item) => item.getAttribute('aria-label'));
  }

  it('switches category with the tabs', async () => {
    const user = userEvent.setup();
    await openShop();
    await user.click(screen.getByRole('button', { name: /^Backgrounds/ }));
    expect(screen.getByRole('button', { name: /^Backgrounds/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(shown()).toHaveLength(20);
    expect(shown()).toContain('Northern Lights');
  });

  it('searches, filters by rarity and price, and sorts', async () => {
    const user = userEvent.setup();
    await openShop();
    await user.type(screen.getByLabelText('Search items'), 'gold');
    expect(shown()).toEqual([
      'Golden Capybara',
      'Treasure Chest',
      'Golden Football',
      'Royal Crown',
      'Golden Trophy',
      'Desert Dunes',
      'Golden Palace',
      'Sunrise Frame',
      'Golden Frame',
      'Golden Aura',
      'Royal Gold',
    ]);
    await user.clear(screen.getByLabelText('Search items'));

    await user.selectOptions(screen.getByLabelText('Rarity'), 'Legendary');
    expect(shown().length).toBeGreaterThan(5);
    await user.selectOptions(screen.getByLabelText('Sort by'), 'Most expensive first');
    expect(shown().slice(0, 4)).toEqual([
      'Maths Legend',
      'Maths Universe',
      'Nebula Spirit',
      'Infinity Halo',
    ]);
    await user.selectOptions(screen.getByLabelText('Rarity'), 'Any rarity');

    await user.selectOptions(screen.getByLabelText('Price'), '25–75 coins');
    await user.selectOptions(screen.getByLabelText('Sort by'), 'Cheapest first');
    expect(shown().slice(0, 2)).toEqual(['Quick Thinker', 'Stack of Books']);
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(shown()).toHaveLength(SHOP_CATALOGUE.length);
  });

  it('shows only owned items, or only items the student can afford', async () => {
    const user = userEvent.setup();
    await openShop();
    await user.click(screen.getByLabelText('I own'));
    expect(shown()).toHaveLength(SHOP_CATALOGUE.filter((item) => item.price === 0).length);
    await user.click(screen.getByLabelText('I can afford'));
    expect(screen.getByLabelText('I own')).not.toBeChecked();
    const affordable = SHOP_CATALOGUE.filter((item) => item.price > 0 && item.price <= 100);
    expect(shown()).toHaveLength(affordable.length);
  });

  it('says so when nothing matches', async () => {
    const user = userEvent.setup();
    await openShop();
    await user.type(screen.getByLabelText('Search items'), 'zzzz');
    expect(screen.getByText('No items match.')).toBeVisible();
  });
});

describe('My collection and coin history', SLOW, () => {
  it('lists owned items, equips them and restores the default look', async () => {
    const user = userEvent.setup();
    const state = withWallet({
      owned: ['av-dragon', 'bg-moon-surface'],
      equipped: { avatar: 'av-dragon' },
    });
    renderApp(`${SHOP}/collection`, { state });
    expect(await screen.findByRole('heading', { name: 'My collection' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Unequip Little Dragon' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Equip Moon Surface' }));
    expect(await screen.findByText('Moon Surface is equipped.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Restore the default look' }));
    await user.click(screen.getByRole('button', { name: 'Restore default look' }));
    expect(await screen.findByText(/Back to the default MathsExpress look/)).toBeVisible();
    expect(wallet(state).equipped).toEqual({});
    expect(wallet(state).owned).toEqual(expect.arrayContaining(['av-dragon', 'bg-moon-surface']));
  });

  it('shows purchases and how to earn coins', async () => {
    const state = withWallet({
      transactions: [
        {
          id: 2,
          itemId: 'acc-books',
          delta: -25,
          reason: 'purchase',
          createdAt: '2026-10-30T01:00:00Z',
        },
        { id: 1, itemId: null, delta: 100, reason: 'welcome', createdAt: '2026-10-29T00:00:00Z' },
      ],
    });
    renderApp(`${SHOP}/history`, { state });
    expect(await screen.findByText('Bought Stack of Books')).toBeVisible();
    expect(screen.getByText('Welcome gift')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'How to earn coins' })).toBeVisible();
  });
});

describe('when the server has problems', SLOW, () => {
  it('keeps the coins safe when a purchase fails, and lets the student try again', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const fake = createFakeDependencies(state).shop;
    const buy = vi.fn(fake.buy.bind(fake)).mockRejectedValueOnce(new AppError('network'));
    renderApp(SHOP, { state, overrides: { shop: { ...fake, buy } } });
    await screen.findByRole('list', { name: 'Shop items' });

    await user.click(screen.getByRole('button', { name: 'Buy Stack of Books' }));
    await user.click(screen.getByRole('button', { name: 'Confirm purchase' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(wallet(state).balance).toBe(100);
    expect(wallet(state).owned).not.toContain('acc-books');

    await user.click(screen.getByRole('button', { name: 'Buy for 25 coins' }));
    await user.click(screen.getByRole('button', { name: 'Confirm purchase' }));
    expect(await screen.findByText(/Stack of Books is yours!/)).toBeVisible();
    expect(wallet(state).balance).toBe(75);
  });

  it('offers to try again when the shop can’t load', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const fake = createFakeDependencies(state).shop;
    const getState = vi
      .fn(fake.getState.bind(fake))
      .mockRejectedValueOnce(new AppError('network'))
      .mockRejectedValueOnce(new AppError('network'));
    renderApp(SHOP, { state, overrides: { shop: { ...fake, getState } } });
    expect(await screen.findByText(/Your coins and items are safe/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('list', { name: 'Shop items' })).toBeVisible();
  });
});

describe('looks around MathsExpress', SLOW, () => {
  it('shows each student’s look in their teacher’s class list', async () => {
    const state = withWallet({ owned: [], equipped: { avatar: 'av-owl', theme: 'theme-ocean' } });
    renderApp('/teacher/classes/class-9m2/students', { signedInAs: 'teacher', state });
    const names = await screen.findAllByText('Mia Chen');
    const row = names.map((name) => name.closest('li')).find((item) => item !== null);
    const look = row?.querySelector('svg[data-look]')?.getAttribute('data-look') ?? '';
    expect(look).toContain('av-owl');
    // Dashboard themes stay private.
    expect(look).not.toContain('theme-ocean');
  });

  it('shows the student’s look on the home page', async () => {
    const state = withWallet({ equipped: { avatar: 'av-fox' } });
    renderApp('/student', { state });
    const link = await screen.findByRole('link', { name: /^Shop\s*Spend your coins/ });
    await waitFor(() => {
      expect(link.querySelector('svg[data-look]')?.getAttribute('data-look')).toContain('av-fox');
    });
  });
});

// axe checks every one of the 98 illustrated cards, which is slow on CI runners.
describe('accessibility', { timeout: 30_000 }, () => {
  it('has no detectable problems on the shop', async () => {
    await openShop();
    expect(await findAccessibilityProblems()).toEqual([]);
  });

  it('has no detectable problems in the Try On preview', async () => {
    const user = userEvent.setup();
    await openShop();
    await user.click(screen.getByRole('button', { name: 'Try on Space Helmet' }));
    expect(await findAccessibilityProblems()).toEqual([]);
  });

  it('has no detectable problems in My collection', async () => {
    renderApp(`${SHOP}/collection`);
    await screen.findByRole('heading', { name: 'My collection' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
