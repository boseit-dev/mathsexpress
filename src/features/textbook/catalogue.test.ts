import type { YearLevel } from '@/domain/student';
import { describe, expect, it } from 'vitest';
import { findTextbook, findTextbookChapter, stageForYear, textbookBooks } from './catalogue';
import { isEquationAnswerCorrect, linearEquationExercises } from './pilotEquations';
import { checkNotebookAnswer, findNotebookLesson, notebookLessons } from './notebookLessons';

describe('NSW textbook catalogue', () => {
  it('gives every book a unique route and an accessible guide', () => {
    expect(textbookBooks).toHaveLength(25);
    expect(new Set(textbookBooks.map((book) => book.id)).size).toBe(textbookBooks.length);
    for (const book of textbookBooks) {
      expect(findTextbook(book.id)).toBe(book);
      expect(findTextbookChapter(book, 'getting-started')?.status).toBe('ready');
      expect(book.syllabusUrl).toMatch(/^https:\/\/curriculum\.nsw\.edu\.au\//);
      expect(new Set(book.chapters.map((chapter) => chapter.id)).size).toBe(book.chapters.length);
    }
  });

  it('indexes stage focus areas and every senior course separately', () => {
    expect(findTextbook('kindergarten')?.chapters.some((c) => c.title === 'Forming groups')).toBe(
      true,
    );
    expect(findTextbook('year-4')?.chapters.some((c) => c.title === 'Partitioned fractions')).toBe(
      true,
    );
    expect(
      findTextbook('year-6')?.chapters.some((c) => c.title === 'Representing quantity fractions'),
    ).toBe(true);
    expect(findTextbook('year-9')?.chapters.some((c) => c.strand === 'Stage 5 Paths')).toBe(true);
    expect(findTextbook('year-8')?.chapters.some((c) => c.strand === 'Stage 5 Paths')).toBe(false);
    expect(
      findTextbook('year-11-advanced')?.chapters.some(
        (c) => c.title === 'Introduction to differentiation',
      ),
    ).toBe(true);
    expect(
      findTextbook('year-12-advanced')?.chapters.some((c) => c.title === 'Integral calculus'),
    ).toBe(true);
    expect(
      findTextbook('year-11-extension-1')?.chapters.some((c) => c.title === 'The binomial theorem'),
    ).toBe(true);
    expect(
      findTextbook('year-12-extension-2')?.chapters.some(
        (c) => c.title === 'Introduction to complex numbers',
      ),
    ).toBe(true);
    for (const book of textbookBooks) {
      expect(book.chapters.length).toBeGreaterThan(3);
      expect(
        book.chapters.filter((c) => c.id !== 'getting-started' && c.status === 'ready').length,
      ).toBe(book.chapters.length - 1);
    }
  });

  it('provides a distinct concept-first starter lesson in all 25 books', () => {
    expect(notebookLessons).toHaveLength(200);
    expect(new Set(notebookLessons.map((lesson) => lesson.bookId)).size).toBe(25);
    expect(
      new Set(notebookLessons.map((lesson) => lesson.bookId + '/' + lesson.chapterId)).size,
    ).toBe(notebookLessons.length);
    for (const lesson of notebookLessons) {
      const book = findTextbook(lesson.bookId);
      expect(book).toBeDefined();
      expect(book?.chapters.find((chapter) => chapter.id === lesson.chapterId)?.status).toBe(
        'ready',
      );
      expect(findNotebookLesson(lesson.bookId, lesson.chapterId)).toBe(lesson);
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
      expect(lesson.practice.length).toBeGreaterThanOrEqual(2);
      expect(lesson.recap.length).toBeGreaterThanOrEqual(3);
      for (const answer of [lesson.guided, ...lesson.practice]) {
        expect(checkNotebookAnswer(String(answer.answer), answer.answer)).toBe(true);
        expect(checkNotebookAnswer(String(answer.answer + 1), answer.answer)).toBe(false);
      }
    }
  });

  it('does not give duplicated courses, bogus outcomes or incomplete answers', () => {
    for (const lesson of notebookLessons) {
      expect(lesson.concept.trim()).not.toBe('');
      expect(lesson.principle.trim()).not.toBe('');
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
      expect(lesson.guided.hint).not.toBe(lesson.guided.explanation);
      for (const question of [lesson.guided, ...lesson.practice]) {
        expect(Number.isFinite(question.answer)).toBe(true);
        expect(checkNotebookAnswer(String(question.answer), question.answer)).toBe(true);
        expect(checkNotebookAnswer(String(question.answer + 1), question.answer)).toBe(false);
      }
    }
  });

  it('has separate Standard 1 and Standard 2 Year 12 books', () => {
    expect(findTextbook('year-12-standard-1')?.chapters).not.toEqual(
      findTextbook('year-12-standard-2')?.chapters,
    );
    expect(findTextbook('year-11-standard')).toBeDefined();
    expect(findTextbook('year-11-extension-2')).toBeUndefined();
    expect(findTextbook('year-12-extension-2')).toBeDefined();
  });

  it('maps the compulsory year bands to the correct syllabus stages', () => {
    const years: readonly YearLevel[] = ['K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(years.map(stageForYear)).toEqual([
      'Early Stage 1',
      'Stage 1',
      'Stage 1',
      'Stage 2',
      'Stage 2',
      'Stage 3',
      'Stage 3',
      'Stage 4',
      'Stage 4',
      'Stage 5',
      'Stage 5',
    ]);
  });
});

describe('original Year 9 equation exercises', () => {
  it('has six different questions with independently verified solutions', () => {
    expect(linearEquationExercises).toHaveLength(6);
    expect(new Set(linearEquationExercises.map((q) => q.id)).size).toBe(6);
    expect(linearEquationExercises.map((q) => q.answer)).toEqual([8, 9, 6, 7, 7, -4]);
    for (const exercise of linearEquationExercises) {
      expect(isEquationAnswerCorrect(String(exercise.answer), exercise.answer)).toBe(true);
      expect(isEquationAnswerCorrect(String(exercise.answer + 1), exercise.answer)).toBe(false);
    }
  });

  it('rejects blank answers, invalid values and non-finite values', () => {
    expect(isEquationAnswerCorrect(' ', 8)).toBe(false);
    expect(isEquationAnswerCorrect('not a number', 8)).toBe(false);
    expect(isEquationAnswerCorrect('Infinity', 8)).toBe(false);
    expect(isEquationAnswerCorrect('0x8', 8)).toBe(false);
    expect(isEquationAnswerCorrect('8e0', 8)).toBe(false);
    expect(isEquationAnswerCorrect('−4', -4)).toBe(true);
    expect(isEquationAnswerCorrect('8', 8)).toBe(true);
  });
});
