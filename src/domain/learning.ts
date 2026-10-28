import type { YearLevel } from './student';

/** Published content only. Do not advertise lessons or year levels we haven't written yet. */
export interface PracticeQuestion {
  id: string;
  expression: string;
  solution: number;
  hint: string;
  secondHint: string;
  explanation: readonly string[];
}

export interface GuidedLesson {
  id: string;
  title: string;
  strand: string;
  yearLevel: YearLevel;
  estimatedMinutes: number;
  introduction: string;
  keyIdea: string;
  workedExample: readonly string[];
  questions: readonly PracticeQuestion[];
}

export const publishedLessons: readonly GuidedLesson[] = [
  {
    id: 'linear-equations-basics',
    title: 'Solving linear equations',
    strand: 'Number and Algebra',
    yearLevel: 9,
    estimatedMinutes: 10,
    introduction:
      'Learn how to find an unknown number by keeping both sides of an equation balanced.',
    keyIdea:
      'Whatever you do to one side of an equation, do to the other side too. Undo addition or subtraction before multiplication or division.',
    workedExample: [
      '3x + 5 = 20',
      'Subtract 5 from both sides: 3x = 15',
      'Divide both sides by 3: x = 5',
      'Check: 3 × 5 + 5 = 20 ✓',
    ],
    questions: [
      {
        id: 'eq-1',
        expression: '2x + 4 = 14',
        solution: 5,
        hint: 'Undo the +4 first. What is 14 − 4?',
        secondHint: '2x = 10. Divide both sides by 2.',
        explanation: ['2x + 4 = 14', '2x = 14 − 4 = 10', 'x = 10 ÷ 2 = 5'],
      },
      {
        id: 'eq-2',
        expression: '5x − 7 = 18',
        solution: 5,
        hint: 'Add 7 to both sides.',
        secondHint: '5x = 25. Divide by 5 to find x.',
        explanation: ['5x − 7 = 18', '5x = 18 + 7 = 25', 'x = 25 ÷ 5 = 5'],
      },
      {
        id: 'eq-3',
        expression: '4x + 3 = −9',
        solution: -3,
        hint: 'Subtract 3 from both sides, even though the right side is negative.',
        secondHint: '4x = −12. Divide both sides by 4.',
        explanation: ['4x + 3 = −9', '4x = −9 − 3 = −12', 'x = −12 ÷ 4 = −3'],
      },
      {
        id: 'eq-4',
        expression: '3(x + 2) = 21',
        solution: 5,
        hint: 'First divide both sides by 3 to remove the brackets.',
        secondHint: 'x + 2 = 7. Subtract 2 from each side.',
        explanation: ['3(x + 2) = 21', 'x + 2 = 21 ÷ 3 = 7', 'x = 7 − 2 = 5'],
      },
      {
        id: 'eq-5',
        expression: '7 − 2x = 15',
        solution: -4,
        hint: 'Subtract 7 from both sides. Pay attention to −2x.',
        secondHint: '−2x = 8. Divide both sides by −2.',
        explanation: ['7 − 2x = 15', '−2x = 15 − 7 = 8', 'x = 8 ÷ (−2) = −4'],
      },
    ],
  },
];

export function lessonsForYear(yearLevel: YearLevel): GuidedLesson[] {
  return publishedLessons.filter((lesson) => lesson.yearLevel === yearLevel);
}

/** Exact for the currently published integer-answer exercises; rejects malformed input. */
export function checkNumericalAnswer(value: string, expected: number): boolean {
  const trimmed = value.trim().replaceAll('−', '-');
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed)) return false;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed === expected;
}
