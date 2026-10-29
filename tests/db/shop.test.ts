import { describe, expect, it } from 'vitest';
import { anonClient, createClass, createStudent, createTeacher } from './helpers.ts';

function balance(payload: unknown): number {
  if (!payload || typeof payload !== 'object' || !('balance' in payload)) {
    throw new Error('Shop state missing balance');
  }
  const amount = payload.balance;
  if (typeof amount !== 'number') throw new Error('Invalid coin balance');
  return amount;
}

describe('server-owned shop wallets and purchases', () => {
  it('creates 100 welcome coins only once and persists a purchase across reads', async () => {
    const student = await createStudent();
    const start = await student.client.rpc('shop_state');
    expect(start.error).toBeNull();
    expect(balance(start.data)).toBe(100);
    const repeat = await student.client.rpc('shop_state');
    expect(balance(repeat.data)).toBe(100);
    const buy = await student.client.rpc('shop_buy', { item_id: 'theme-ocean' });
    expect(buy.error).toBeNull();
    expect(balance(buy.data)).toBe(60);
    const again = await student.client.rpc('shop_buy', { item_id: 'theme-ocean' });
    expect(again.error?.message).toBe('shop_already_owned');
    expect(balance((await student.client.rpc('shop_state')).data)).toBe(60);
  });

  it('rejects fake equipment, invalid products and unaffordable purchases', async () => {
    const student = await createStudent();
    const notOwned = await student.client.rpc('shop_equip', {
      category: 'frame',
      item_id: 'frame-royal',
    });
    expect(notOwned.error?.message).toBe('shop_not_owned');
    const invalid = await student.client.rpc('shop_buy', { item_id: 'fake-price-zero' });
    expect(invalid.error?.message).toBe('shop_item_unavailable');
    const first = await student.client.rpc('shop_buy', { item_id: 'theme-sunset' });
    expect(first.error).toBeNull();
    expect(balance(first.data)).toBe(0);
    const noFunds = await student.client.rpc('shop_buy', { item_id: 'frame-sky' });
    expect(noFunds.error?.message).toBe('shop_not_enough_coins');
  });

  it('saves and unequips only owned cosmetics in the correct category', async () => {
    const student = await createStudent();
    await student.client.rpc('shop_buy', { item_id: 'frame-starlight' });
    const equipped = await student.client.rpc('shop_equip', {
      category: 'frame',
      item_id: 'frame-starlight',
    });
    expect(equipped.error).toBeNull();
    expect(equipped.data).toMatchObject({ equippedFrame: 'frame-starlight' });
    const wrong = await student.client.rpc('shop_equip', {
      category: 'theme',
      item_id: 'frame-starlight',
    });
    expect(wrong.error?.message).toBe('shop_not_owned');
    const reset = await student.client.rpc('shop_equip', { category: 'frame', item_id: null });
    expect(reset.data).toMatchObject({ equippedFrame: null });
  });

  it('never allows teachers or visitors to use the student shop API', async () => {
    const teacher = await createTeacher();
    const noProfile = anonClient();
    const blockedTeacher = await teacher.client.rpc('shop_state');
    const blockedGuest = await noProfile.rpc('shop_state');
    expect(blockedTeacher.error?.message).toBe('students_only');
    expect(blockedGuest.error).not.toBeNull();
  });

  it('awards only verified Year 9 questions, at most once per question', async () => {
    const student = await createStudent();
    const noYear = await student.client.rpc('shop_award_answer', {
      question_id: 'eq-1',
      answer: '5',
    });
    expect(noYear.error?.message).toBe('shop_lesson_unavailable');
    const teacher = await createTeacher();
    const maths = await createClass(teacher, '9X Maths', 9);
    await student.client.rpc('join_class', { code: maths.join_code });
    const wrong = await student.client.rpc('shop_award_answer', {
      question_id: 'eq-1',
      answer: '4',
    });
    expect(wrong.error?.message).toBe('shop_answer_incorrect');
    const fake = await student.client.rpc('shop_award_answer', {
      question_id: 'made-up',
      answer: '5',
    });
    expect(fake.error?.message).toBe('shop_question_unavailable');
    const correct = await student.client.rpc('shop_award_answer', {
      question_id: 'eq-1',
      answer: '5',
    });
    expect(correct.error).toBeNull();
    expect(balance(correct.data)).toBe(120);
    const duplicate = await student.client.rpc('shop_award_answer', {
      question_id: 'eq-1',
      answer: '5',
    });
    expect(duplicate.error?.message).toBe('shop_already_rewarded');
    const negative = await student.client.rpc('shop_award_answer', {
      question_id: 'eq-3',
      answer: '−3',
    });
    expect(negative.error).toBeNull();
    expect(balance(negative.data)).toBe(140);
  });
});
