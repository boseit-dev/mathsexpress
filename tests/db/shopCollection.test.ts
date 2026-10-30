import { describe, expect, it } from 'vitest';
import { SHOP_CATALOGUE } from '../../src/domain/shopCatalogue.ts';
import { admin, createClass, createStudent, createTeacher, type TestUser } from './helpers.ts';

interface Snapshot {
  balance: number;
  equipped: Record<string, string>;
  owned: string[];
  items: { id: string; name: string; category: string; price: number; rarity: string }[];
  transactions: { reason: string; delta: number; itemId: string | null }[];
}

function snapshot(payload: unknown): Snapshot {
  if (!payload || typeof payload !== 'object' || !('balance' in payload)) {
    throw new Error('Shop state missing');
  }
  return payload as Snapshot;
}

/** Sets a student's balance directly, as a test shortcut for many finished lessons. */
async function giveCoins(student: TestUser, balance: number) {
  await student.client.rpc('shop_state');
  const { error } = await admin
    .from('shop_wallets')
    .update({ balance })
    .eq('student_id', student.id);
  if (error) throw error;
}

async function state(student: TestUser): Promise<Snapshot> {
  const { data, error } = await student.client.rpc('shop_state');
  if (error) throw error;
  return snapshot(data);
}

const LESSON = 'linear-equations-basics';
const ANSWERS: [string, string][] = [
  ['eq-1', '5'],
  ['eq-2', '5'],
  ['eq-3', '-3'],
  ['eq-4', '5'],
  ['eq-5', '-4'],
];

/** Finishes the lesson, getting the first question wrong once. Returns each answer's reply. */
async function finishLesson(student: TestUser) {
  const { data: attemptId, error } = await student.client.rpc('start_lesson_attempt', {
    content_id: LESSON,
  });
  if (error) throw error;
  await student.client.rpc('record_answer', {
    attempt_id: attemptId,
    question_id: 'eq-1',
    answer: '1',
  });
  const replies: Record<string, unknown>[] = [];
  for (const [question, answer] of ANSWERS) {
    const reply = await student.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: question,
      answer,
    });
    if (reply.error) throw reply.error;
    replies.push(reply.data as Record<string, unknown>);
  }
  return replies;
}

describe('the shop catalogue', () => {
  it('matches the website catalogue item for item, so every item has artwork', async () => {
    const student = await createStudent();
    const { items } = await state(student);
    expect(items).toEqual(
      SHOP_CATALOGUE.map(({ id, name, description, category, price, rarity }) => ({
        id,
        name,
        description,
        category,
        price,
        rarity,
      })),
    );
    expect(items.length).toBeGreaterThanOrEqual(80);
  });

  it('refuses an item whose rarity does not fit its price', async () => {
    const { error } = await admin.from('shop_catalogue').insert({
      id: 'cheap-legend',
      name: 'Cheap legend',
      description: 'Should never exist.',
      category: 'avatar',
      price: 10,
      rarity: 'legendary',
    });
    expect(error?.message).toMatch(/shop_catalogue_rarity_price_check/);
  });
});

describe('buying', () => {
  it('owns free starter items without paying, and never sells them', async () => {
    const student = await createStudent();
    const start = await state(student);
    expect(start.owned).toEqual(expect.arrayContaining(['av-capybara', 'av-fox', 'frame-classic']));
    const equip = await student.client.rpc('shop_equip', { category: 'avatar', item_id: 'av-fox' });
    expect(equip.error).toBeNull();
    expect(snapshot(equip.data).equipped).toEqual({ avatar: 'av-fox' });
    const buy = await student.client.rpc('shop_buy', { item_id: 'av-fox' });
    expect(buy.error?.message).toBe('shop_already_owned');
    expect((await state(student)).balance).toBe(100);
  });

  it('buys cheap and expensive items, taking the server price exactly once', async () => {
    const student = await createStudent();
    const cheap = await student.client.rpc('shop_buy', { item_id: 'acc-books' });
    expect(snapshot(cheap.data).balance).toBe(75);
    await giveCoins(student, 5000);
    const legendary = await student.client.rpc('shop_buy', { item_id: 'av-nebula' });
    expect(legendary.error).toBeNull();
    const after = snapshot(legendary.data);
    expect(after.balance).toBe(0);
    expect(after.owned).toEqual(expect.arrayContaining(['acc-books', 'av-nebula']));
    expect(after.transactions.filter((entry) => entry.reason === 'purchase')).toEqual([
      expect.objectContaining({ itemId: 'av-nebula', delta: -5000 }),
      expect.objectContaining({ itemId: 'acc-books', delta: -25 }),
    ]);
  });

  it('refuses a purchase without enough coins and changes nothing', async () => {
    const student = await createStudent();
    const { error } = await student.client.rpc('shop_buy', { item_id: 'bg-golden-palace' });
    expect(error?.message).toBe('shop_not_enough_coins');
    const after = await state(student);
    expect(after.balance).toBe(100);
    expect(after.owned).not.toContain('bg-golden-palace');
  });

  it('charges once when the same purchase is sent twice at the same time', async () => {
    const student = await createStudent();
    await giveCoins(student, 1000);
    const results = await Promise.all([
      student.client.rpc('shop_buy', { item_id: 'acc-wizard-hat' }),
      student.client.rpc('shop_buy', { item_id: 'acc-wizard-hat' }),
    ]);
    expect(results.filter((result) => result.error === null)).toHaveLength(1);
    expect(results.map((result) => result.error?.message)).toContain('shop_already_owned');
    const after = await state(student);
    expect(after.balance).toBe(550);
    expect(after.transactions.filter((entry) => entry.itemId === 'acc-wizard-hat')).toHaveLength(1);
  });

  it('never overspends when two different purchases race', async () => {
    const student = await createStudent();
    await giveCoins(student, 600);
    const results = await Promise.all([
      student.client.rpc('shop_buy', { item_id: 'av-capy-explorer' }),
      student.client.rpc('shop_buy', { item_id: 'acc-mini-robot' }),
    ]);
    expect(results.filter((result) => result.error === null)).toHaveLength(1);
    expect(results.map((result) => result.error?.message)).toContain('shop_not_enough_coins');
    expect((await state(student)).balance).toBe(0);
  });
});

describe('equipping', () => {
  it('wears one item per category, keeps it after signing in again, and resets', async () => {
    const student = await createStudent();
    await giveCoins(student, 5000);
    for (const id of [
      'acc-crown',
      'bg-deep-ocean',
      'frame-golden',
      'fx-snowfall',
      'title-pattern-pro',
    ]) {
      expect((await student.client.rpc('shop_buy', { item_id: id })).error).toBeNull();
    }
    await student.client.rpc('shop_equip', { category: 'accessory', item_id: 'acc-crown' });
    await student.client.rpc('shop_equip', { category: 'background', item_id: 'bg-deep-ocean' });
    await student.client.rpc('shop_equip', { category: 'frame', item_id: 'frame-golden' });
    await student.client.rpc('shop_equip', { category: 'effect', item_id: 'fx-snowfall' });
    await student.client.rpc('shop_equip', { category: 'title', item_id: 'title-pattern-pro' });
    // A second accessory replaces the first: one per category.
    await student.client.rpc('shop_equip', { category: 'accessory', item_id: 'acc-pencil' });

    // A fresh sign-in sees the same look.
    await student.client.auth.signOut();
    await student.client.auth.signInWithPassword({
      email: student.email,
      password: student.password,
    });
    const saved = await state(student);
    expect(saved.equipped).toEqual({
      accessory: 'acc-pencil',
      background: 'bg-deep-ocean',
      frame: 'frame-golden',
      effect: 'fx-snowfall',
      title: 'title-pattern-pro',
    });

    const off = await student.client.rpc('shop_equip', { category: 'effect' });
    expect(snapshot(off.data).equipped).not.toHaveProperty('effect');
    // Back to a crown the student still owns.
    await student.client.rpc('shop_equip', { category: 'accessory', item_id: 'acc-crown' });

    const reset = await student.client.rpc('shop_reset_look');
    expect(snapshot(reset.data).equipped).toEqual({});
    expect(snapshot(reset.data).owned).toEqual(
      expect.arrayContaining(['acc-crown', 'frame-golden']),
    );
    expect(snapshot(reset.data).balance).toBe(5000 - 2000 - 250 - 1200 - 150 - 400);
  });

  it('refuses items the student does not own, in the wrong slot, or that do not exist', async () => {
    const student = await createStudent();
    const notOwned = await student.client.rpc('shop_equip', {
      category: 'avatar',
      item_id: 'av-dragon',
    });
    expect(notOwned.error?.message).toBe('shop_not_owned');
    const wrongSlot = await student.client.rpc('shop_equip', {
      category: 'frame',
      item_id: 'av-fox',
    });
    expect(wrongSlot.error?.message).toBe('shop_not_owned');
    const badCategory = await student.client.rpc('shop_equip', {
      category: 'power-up',
      item_id: 'av-fox',
    });
    expect(badCategory.error?.message).toBe('shop_invalid_category');
  });
});

describe('keeping accounts apart', () => {
  it('never lets one student wear or read another student’s items', async () => {
    const owner = await createStudent('Ava', 'Owner');
    const other = await createStudent('Ben', 'Other');
    await giveCoins(owner, 500);
    await owner.client.rpc('shop_buy', { item_id: 'acc-crystal-orb' });
    const borrowed = await other.client.rpc('shop_equip', {
      category: 'accessory',
      item_id: 'acc-crystal-orb',
    });
    expect(borrowed.error?.message).toBe('shop_not_owned');
    for (const table of ['shop_owned', 'shop_equipped', 'shop_wallets'] as const) {
      const direct = await other.client.from(table).select('*');
      expect(direct.error).not.toBeNull();
    }
    const write = await other.client.from('shop_equipped').insert({
      student_id: other.id,
      category: 'accessory',
      item_id: 'acc-crystal-orb',
    });
    expect(write.error).not.toBeNull();
  });

  it('shows a class’s looks to its teacher only, without private themes or effects', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher, 'Looks class', 9);
    const mia = await createStudent('Mia', 'Chen');
    await mia.client.rpc('join_class', { code: created.join_code });
    await giveCoins(mia, 500);
    await mia.client.rpc('shop_buy', { item_id: 'theme-ocean' });
    await mia.client.rpc('shop_buy', { item_id: 'fx-sparkles' });
    await mia.client.rpc('shop_equip', { category: 'avatar', item_id: 'av-owl' });
    await mia.client.rpc('shop_equip', { category: 'theme', item_id: 'theme-ocean' });
    await mia.client.rpc('shop_equip', { category: 'effect', item_id: 'fx-sparkles' });

    const looks = await teacher.client.rpc('class_member_looks', { class_id: created.id });
    expect(looks.error).toBeNull();
    expect(looks.data).toEqual({ [mia.id]: { avatar: 'av-owl' } });

    const stranger = await createTeacher();
    expect(
      (await stranger.client.rpc('class_member_looks', { class_id: created.id })).error?.message,
    ).toBe('class_not_found');
    expect(
      (await mia.client.rpc('class_member_looks', { class_id: created.id })).error?.message,
    ).toBe('teachers_only');
  });
});

describe('earning coins by finishing lessons', () => {
  it('pays for each finished lesson, with a bonus for first-try answers, up to four a day', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher, 'Coins class', 9);
    const student = await createStudent();
    await student.client.rpc('join_class', { code: created.join_code });
    const before = (await state(student)).balance;

    const replies = await finishLesson(student);
    // One wrong try on the first question: 25 + 5 × 4 first-try answers.
    expect(replies.at(-1)).toMatchObject({ completed: true, coinsAwarded: 45 });
    expect(replies.slice(0, -1).every((reply) => reply.coinsAwarded === 0)).toBe(true);
    expect((await state(student)).balance).toBe(before + 45);

    for (let lesson = 2; lesson <= 4; lesson += 1) await finishLesson(student);
    const fifth = await finishLesson(student);
    expect(fifth.at(-1)).toMatchObject({ completed: true, coinsAwarded: 0 });
    const after = await state(student);
    expect(after.balance).toBe(before + 45 * 4);
    expect(after.transactions.filter((entry) => entry.reason === 'lesson_complete')).toHaveLength(
      4,
    );
  });
});
