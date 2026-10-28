/** Original, independently checked examples; not copied from any textbook. */
export interface EquationExercise {
  id: string;
  prompt: string;
  answer: number;
  hint: string;
  method: string;
}

export const linearEquationExercises: readonly EquationExercise[] = [
  {
    id: 'q1', prompt: 'x + 7 = 15', answer: 8,
    hint: 'Subtract 7 from both sides.',
    method: 'x = 15 − 7 = 8',
  },
  {
    id: 'q2', prompt: '3x = 27', answer: 9,
    hint: 'Divide both sides by 3.',
    method: 'x = 27 ÷ 3 = 9',
  },
  {
    id: 'q3', prompt: '4x − 5 = 19', answer: 6,
    hint: 'Add 5 to both sides, then divide by 4.',
    method: '4x = 24, so x = 6',
  },
  {
    id: 'q4', prompt: '2x + 3 = 17', answer: 7,
    hint: 'Subtract 3 and then divide by 2.',
    method: '2x = 14, so x = 7',
  },
  {
    id: 'q5', prompt: '5(x − 2) = 25', answer: 7,
    hint: 'Divide by 5 first, then add 2.',
    method: 'x − 2 = 5, so x = 7',
  },
  {
    id: 'q6', prompt: '−2x + 9 = 17', answer: -4,
    hint: 'Subtract 9, then divide by negative 2.',
    method: '−2x = 8, so x = −4',
  },
];

/** Keep answer checking separate from presentation so it can be tested. */
export function isEquationAnswerCorrect(input: string, expected: number): boolean {
  if (!input.trim()) return false;
  const value = Number(input);
  return Number.isFinite(value) && Math.abs(value - expected) < 1e-9;
}
