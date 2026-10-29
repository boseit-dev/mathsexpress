import { describe, expect, it } from 'vitest';
import { checkNumericalAnswer, lessonsForYear, publishedLessons } from './learning';

describe('published maths lessons', () => {
  it('shows only published lessons for the teacher-assigned year', () => {
    expect(lessonsForYear(9).map((lesson) => lesson.id)).toEqual(['linear-equations-basics']);
    expect(lessonsForYear(8)).toEqual([]);
    expect(lessonsForYear('K')).toEqual([]);
  });

  it('has unique, correct question IDs and authored steps', () => {
    for (const lesson of publishedLessons) {
      const ids = lesson.questions.map((question) => question.id);
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
      for (const question of lesson.questions) {
        expect(question.hint).toBeTruthy();
        expect(question.secondHint).toBeTruthy();
        expect(question.explanation.length).toBeGreaterThan(1);
        expect(checkNumericalAnswer(String(question.solution), question.solution)).toBe(true);
      }
    }
  });
});

describe('numeric answer checking', () => {
  it('marks correct positive, negative and decimal number spellings', () => {
    expect(checkNumericalAnswer(' 5 ', 5)).toBe(true);
    expect(checkNumericalAnswer('-3', -3)).toBe(true);
    expect(checkNumericalAnswer('−3', -3)).toBe(true);
    expect(checkNumericalAnswer('5.0', 5)).toBe(true);
    expect(checkNumericalAnswer('0.5', 0.5)).toBe(true);
  });

  it('rejects wrong, empty, infinite and arbitrary input', () => {
    for (const input of ['6', '', ' ', '5x', 'Infinity', 'NaN', '0x5', '5,000', '2+3']) {
      expect(checkNumericalAnswer(input, 5)).toBe(false);
    }
  });
});
